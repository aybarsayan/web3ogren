# Dahili Mesajlar

## Genel Bakış

Akıllı sözleşmeler, sözde **dahili mesajlar** göndererek birbirleriyle etkileşimde bulunurlar. Dahili bir mesaj, hedef hesaba ulaştığında, bu hesabın adına sıradan bir işlem oluşturulur ve dahili mesaj, bu hesabın (akıllı sözleşme) kodu ve kalıcı verileri tarafından belirtilen şekilde işlenir. 

:::info
Özellikle, işleme işlemi bir veya birden fazla outbound dahili mesaj yaratabilir, bunların bazıları işlenen dahili mesajın kaynak adresine gönderilmiş olabilir. Bu, bir sorgunun dahili bir mesaj içinde kapsüllenip başka bir akıllı sözleşmeye gönderilmesi sağlanarak, o sorgunun işlenip bir yanıtın yine dahili bir mesaj olarak geri gönderilmesiyle basit "istemci-sunucu uygulamaları" oluşturmak için kullanılabilir.
:::

Bu yaklaşım, bir dahili mesajın "sorgu", "yanıt" veya herhangi bir ek işleme gerektirmeyen (örneğin "basit para transferi" gibi) olarak tasarlanıp tasarlanmadığını ayırt etme gereğini doğurur. Ayrıca, bir yanıt alındığında, bunun hangi sorguya ait olduğunu anlamanın bir yolu olmalıdır.

:::tip
Bu hedefe ulaşmak için aşağıdaki dahili mesaj düzeni yaklaşımları kullanılabilir (TON Blockchain'in mesaj içeriği üzerinde herhangi bir kısıtlama getirmediğini unutmayın, dolayısıyla bunlar yalnızca önerilerdir).
:::

### Dahili Mesaj Yapısı

Mesajın içeriği, mesajın kendisine gömülebilir veya mesajdan referans verilen ayrı bir hücrede saklanabilir; bu, TL-B şeması parçası tarafından gösterilmektedir:

```tlb
message$_ {X:Type} ... body:(Either X ^X) = Message X;
```

Aldığı akıllı sözleşme, en azından gömülü mesaj içeriğine sahip dahili mesajları kabul etmelidir (bu içerikler, mesajı içeren hücreye sığmadığı sürece). Eğer ayrı hücrelerde mesaj içeriğini kabul ediyorsa (`(Either X ^X)`'nin `right` yapıcıyı kullanarak), gelen mesajın işlenmesi, mesaj içeriği için seçilen belirli gömme seçeneğine bağlı olmamalıdır. Öte yandan, daha basit sorgular ve yanıtlar için ayrı hücrelerde mesaj içeriklerini desteklememek tamamen geçerli bir durumdur.

### Dahili Mesaj İçeriği

Mesaj içeriği tipik olarak aşağıdaki alanlarla başlar:

* Yapılacak `işlemi` tanımlayan 32 bit (big-endian) işaretsiz tam sayı `op`, veya çağrılacak akıllı sözleşmenin `yöntemi`.
* Tüm sorgu-yanıt dahili mesajlarında bir yanıtın bir sorguyla ilgili olduğunu göstermek için kullanılan 64 bit (big-endian) işaretsiz tam sayı `query_id` (bir yanıtın `query_id`'si, karşılık gelen sorgunun `query_id`'sine eşit olmalıdır). Eğer `op`, bir sorgu-yanıt yöntemi değilse (örneğin, bir yanıt göndermesi beklenmeyen bir yöntemi çağırıyorsa), o zaman `query_id` atlanabilir.
* Mesaj içeriğinin geri kalanı, desteklenen her `op` değeri için spesifiktir.

### Yorumlu Basit Mesaj

Eğer `op` sıfırsa, mesaj "yorumlu basit transfer mesajı"dır. Yorum, mesaj içeriğinin geri kalanında bulunur (hiçbir `query_id` alanı olmaksızın, yani beşinci bayttan itibaren). Eğer `0xff` baytı ile başlamıyorsa, yorum metin niteliğindedir; geçersiz ve kontrol karakterleri filtrelendikten sonra, son kullanıcıya "olduğu gibi" gösterilebilir (ve geçerli bir UTF-8 dizesi olduğunu kontrol edebiliriz).

> Çoğu akıllı sözleşme, "basit transfer mesajı" aldıklarında karmaşık işlemler gerçekleştirmemeli veya gelen mesajı reddetmemelidir. Bu şekilde, `op` sıfır olduğunda, inbound dahili mesajları işleme akıllı sözleşme fonksiyonu (genellikle `recv_internal()` olarak adlandırılan) hemen sıfır çıkış kodu ile başarıları belirtmelidir. — Dışarıya aktarılan değerle alıcı hesabın hesaba aktarılmasına ve başka bir etkisi olmaksızın sonuçlanmasına yol açar.

Yorum uzun olduğunda ve bir hücreye sığmadığında, sığmayan satır sonu hücrenin ilk referansına yerleştirilir. Bu işlem, iki veya daha fazla hücreye sığmayan yorumları açıklamak için geri dönüşümlü olarak devam eder:   
```
root_cell("0x00000000" - 32 bit, "string" 123 bayta kadar)
     ↳1st_ref("string devamı" 127 bayta kadar)
             ↳1st_ref("string devamı" 127 bayta kadar)
                     ↳....
```
Aynı format, NFT ve [jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format) transferleri için yorumlar için de kullanılır.

:::warning
Unutmayın ki yorum `0xff` baytı ile başlıyorsa, geri kalanı "ikili yorum"dur ve son kullanıcıya metin olarak gösterilmemelidir (gerekirse sadece bir hex döküm olarak).
:::

### Şifreli Yorumlar İle Mesajlar

Eğer `op` `0x2167da4b` ise, o zaman mesaj "şifreli yorum ile transfer mesajı"dır. Bu mesaj şu şekilde serileştirilmektedir:

Girdi:

* `pub_1` ve `priv_1` - Gönderenin Ed25519 açık ve özel anahtarları, her biri 32 bayt.
* `pub_2` - Alıcının Ed25519 açık anahtarı, 32 bayt.
* `msg` - Şifrelenecek bir mesaj, herhangi bir bayt dizisi. `len(msg) <= 960`.

Şifreleme algoritması şu şekildedir:

1. `priv_1` ve `pub_2` kullanarak `shared_secret` hesaplayın.
2. `salt` değeri, gönderen cüzdan adresinin `isBounceable=1` ve `isTestnetOnly=0` durumu ile birlikte `bas64url temsilidir`.
3. `len(prefix+msg)` değeri 16'ya bölünecek şekilde 16 ile 31 bayt arasında bir `prefix` byte dizisi seçin. `prefix`'in ilk baytı `len(prefix)`e eşit olup, diğer baytlar rastgeledir. `data = prefix + msg` olarak tanımlayın.
4. `msg_key`, `hmac_sha512(salt, data)`'nin ilk 16 baytıdır.
5. `x = hmac_sha512(shared_secret, msg_key)` hesaplayın. `key=x[0:32]` ve `iv=x[32:48]` olarak tanımlayın.
6. `data`, `key` ve `iv` ile AES-256 CBC modunda şifrelensin.
7. Şifreli yorum oluşturun:
   1. `pub_xor = pub_1 ^ pub_2` - 32 bayt. Bu, her tarafın diğerinin açık anahtarını sorgulamadan mesajı çözmesine olanak tanır.
   2. `msg_key` - 16 bayt.
   3. Şifrelenmiş `data`.
8. Mesajın içeriği 4 baytlık `0x2167da4b` etiket ile başlar. Sonra bu şifreli yorum depolanacaktır:
   1. Bayt dizisi parçalara bölünür ve `c_1,...,c_k` hücreler dizisinde depolanır (`c_1` gövdenin köküdür). Her hücre, (sonuncusu hariç) bir referans taşır.
   2. `c_1` en fazla 35 bayt (4 baytlık etiketi hariç) içerebilir, diğer tüm hücreler en fazla 127 bayt içerebilir.
   3. Bu format aşağıdaki kısıtlamalara sahiptir: `k <= 16`, maksimum dize uzunluğu 1024.

:::tip
Aynı format, NFT ve jetton transferleri için yorumlar için de kullanılır; unutmayın ki gönderici ve alıcı adreslerinin (jetton cüzdan adresleri dışında) açık anahtarları kullanılmalıdır.
:::

:::info
Mesaj şifreleme algoritması örneklerinden öğrenin:
* [encryption.js](https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js)
* [SimpleEncryption.cpp](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/keys/SimpleEncryption.cpp)
:::

### Yorum Olmadan Basit Transfer Mesajları

"Yorum olmadan basit transfer mesajı", boş bir gövdeye (hatta bir `op` alanı olmaksızın) sahiptir. Yukarıdaki düşünceler, böyle mesajlar için de geçerlidir. Bu tür mesajların içeriklerinin mesaj hücresine gömülmesi gerektiğini unutmayın.

### Sorgu ve Yanıt Mesajları Arasındaki Ayrım

"Sorgu" mesajlarının, en yüksek sıralı bitinin temiz olduğu bir `op` değeri ile (yani `1 .. 2^31-1` aralığında) olması beklenir. "Yanıt" mesajlarının ise, en yüksek sıralı bitinin ayarlı olduğu bir `op` değeri (yani `2^31 .. 2^32-1` aralığında) olması beklenir. Eğer bir yöntem, ne bir sorgu ne de bir yanıt ise (bunun için ilgili mesaj içeriği bir `query_id` alanına sahip değilse), o zaman bir `op` değeri "sorgu" aralığında `1 .. 2^31 - 1` kullanmalıdır.

### Standart Yanıt Mesajlarının İşlenmesi

`op` değeri `0xffffffff` ve `0xfffffffe` olan bazı "standart" yanıt mesajları vardır. Genel olarak, `0xfffffff0` ile `0xffffffff` arasındaki `op` değerleri, böyle standart yanıtlar için ayrılmıştır.

* `op` = `0xffffffff`, "işlem desteklenmiyor" anlamına gelir. Bu, orijinal sorgudan alınan 64 bit `query_id` ile ve orijinal sorgunun 32 bit `op`'siyle devam eder. En basit akıllı sözleşmelerin, `1 .. 2^31-1` aralığında bilinmeyen bir `op` ile sorgu aldıklarında bu hatayı dönmeleri beklenir.
* `op` = `0xfffffffe`, "işlem yapılmasına izin verilmiyor" anlamına gelir. Bu, orijinal sorgunun 64 bit `query_id`'si ile birlikte, orijinal sorgudan alınan 32 bit `op`'nin yer almasıyla devam eder.

:::warning
Bilinmeyen "yanıtların" (`2^31 .. 2^32-1` aralığında bir `op` ile) göz ardı edilmesi gerektiğini unutmayın (özellikle onlara yanıt olarak `0xffffffff` değerine sahip bir yanıt üretilmemelidir), bunun yanı sıra beklenmeyen geri dönen mesajlar ("geri dönen" bayrağı ayarlandığında).
:::