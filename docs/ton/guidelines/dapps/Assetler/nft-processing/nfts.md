# NFT İşleme

## Genel Bakış

Bu belgeler kısmında okuyuculara NFT'ler hakkında daha iyi bir anlayış sağlanacaktır. Bu, okuyucuya NFT'lerle nasıl etkileşimde bulunulacağını ve TON Blockchain üzerinde gönderilen işlemler aracılığıyla NFT'leri nasıl kabul edebileceğini öğretecektir.

:::info
Aşağıda sağlanan bilgiler, okuyucunun önceki `Toncoin ödeme işleme detaylarını` derinlemesine incelemiş olduğunu ve aynı zamanda cüzdan akıllı sözleşmeleri ile programatik olarak nasıl etkileşimde bulunulacağına dair temel bir anlayışa sahip olduğunu varsaymaktadır.
:::

## NFT'lerin Temel Kavramlarını Anlama

TON Blockchain üzerinde çalışan NFT'ler, [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) ve [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) standartlarıyla temsil edilmektedir.

Open Network (TON) Blockchain, yüksek performans düşünülerek tasarlanmıştır ve TON'daki sözleşme adreslerine dayalı otomatik bölme (sharding) kullanımını içeren bir özelliğe sahiptir (bu, belirli NFT tasarımlarını sağlamak için kullanılır). Optimal performans elde etmek için, bireysel NFT'lerin kendi akıllı sözleşmelerini kullanmaları gerekir. Bu, her boyutta NFT koleksiyonu oluşturulmasına olanak tanırken (sayı bakımından büyük veya küçük olsun) geliştirme maliyetlerini ve performans sorunlarını da azaltır. Ancak, bu yaklaşım, NFT koleksiyonlarının geliştirilmesi için yeni dikkate alınması gereken unsurlar da getirir.

Her NFT kendi akıllı sözleşmesini kullandığı için, tek bir sözleşme kullanarak bir NFT koleksiyonu içindeki her bir NFT hakkında bilgi edinmek mümkün değildir. **Bir koleksiyonun tamamı hakkında bilgi almak ve bir koleksiyon içindeki her bireysel NFT'yi almak için, hem koleksiyon sözleşmesini hem de her bireysel NFT sözleşmesini ayrı ayrı sorgulamak gerekmektedir.** Aynı nedenle, NFT transferlerini izlemek için belirli bir koleksiyon içindeki her bireysel NFT için tüm işlemleri izlemek gereklidir.

### NFT Koleksiyonları
NFT Koleksiyonu, NFT içeriğini indekslemek ve depolamak için hizmet eden bir sözleşmedir ve aşağıdaki arayüzleri içermelidir:

#### Alım yöntemi `get_collection_data`
```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```
Koleksiyon hakkında genel bilgi alır, aşağıdaki şekilde temsil edilir:
1. `next_item_index` - koleksiyon sıralıysa, bu sınıflama koleksiyondaki toplam NFT sayısını ve basım için kullanılan sonraki indeksin kullanılacağını gösterir. Sıralanmamış koleksiyonlar için, `next_item_index` değeri -1'dir, yani koleksiyon, NFT'leri izlemek için benzersiz mekanizmalar kullanmaktadır (örneğin, TON DNS alanlarının hash’i).
2. `collection_content` - TEP-64 ile uyumlu formatta koleksiyon içeriğini temsil eden bir hücre.
3. `owner_address` - koleksiyon sahibinin adresini içeren bir dilim (bu değer de boş olabilir).

#### Alım yöntemi `get_nft_address_by_index`
```
(slice nft_address) get_nft_address_by_index(int index)
```
Bu yöntem, bir NFT'nin özgünlüğünü doğrulamak ve gerçekten belirli bir koleksiyona ait olup olmadığını onaylamak için kullanılabilir. Kullanıcıların, koleksiyondaki indeksini sağlayarak bir NFT'nin adresini almak için de kullanılabilir. Yöntemin, sağlanan indekse karşılık gelen NFT'nin adresini içeren bir dilim döndürmesi gerekir.

#### Alım yöntemi `get_nft_content`
```
(cell full_content) get_nft_content(int index, cell individual_content)
```
Koleksiyon, NFT'ler için ortak bir veri depolama alanı hizmeti sunduğundan, NFT içeriğini tamamlamak için bu yöntem gereklidir. Bu yöntemi kullanmak için, önce ilgili `get_nft_data()` yöntemini çağırarak NFT'nin `individual_content`'ini almak gerekmektedir. `individual_content`'i aldıktan sonra, `get_nft_content()` yöntemini NFT indeksi ve `individual_content` hücresi ile çağırmak mümkündür. Yöntemin, NFT'nin tam içeriğini içeren bir TEP-64 hücresi döndürmesi gerekir.

### NFT Öğeleri
Temel NFT'ler şunları uygulamalıdır:

#### Alım yöntemi `get_nft_data()`
```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### İnline mesaj yöneticisi `transfer`
```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```
Mesajınızda doldurmanız gereken her parametreyi inceleyelim:
1. `OP` - `0x5fcc3d14` - transfer mesajı içinde TEP-62 standardı tarafından tanımlanan bir sabit.
2. `queryId` - `uint64` - mesajı takip etmek için kullanılan bir uint64 numarası.
3. `newOwnerAddress` - `MsgAddress` - NFT'yi transfer etmek için kullanılan sözleşmenin adresi.
4. `responseAddress` - `MsgAddress` - ek fonların transfer edildiği adres. Genellikle, NFT sözleşmesine yeterli fon olduğundan emin olmak için ek bir TON miktarı (örn. 1 TON) gönderilir. İşlem içindeki kullanılmayan tüm fonlar `responseAddress`'e gönderilir.
5. `forwardAmount` - `Coins` - verilecek mesajla birlikte kullanılan TON miktarı (genellikle 0.01 TON olarak ayarlanır). TON asenkron bir mimari kullandığı için, NFT'nin yeni sahibi, işlemi başarıyla aldıktan hemen sonra bilgilendirilmez. Yeni sahip bilgisi için, NFT akıllı sözleşmesinden `newOwnerAddress`'e `forwardAmount` ile belirtilen bir değer ile iç mesaj gönderilir. İleri mesaj, `ownership_assigned` OP'si (`0x05138d91`) ile başlayacak ve önceki sahibin adresini ve `forwardPayload`'yi (varsa) içerecektir.
6. `forwardPayload` - `Slice | Cell` - `ownership_assigned` bildirim mesajının bir parçası olarak gönderilir.

:::tip
Bu mesaj (açıklandığı gibi), bir bildirim alındıktan sonra sahipliği değişen bir NFT ile etkileşimde bulunmak için kullanılan ana yöntemdir.
:::

Örneğin, yukarıdaki mesaj tipi sıklıkla bir Cüzdan Akıllı Sözleşmesinden bir NFT Öğesi Akıllı Sözleşmesine gönderilir. Bir NFT Akıllı Sözleşmesi bu mesajı alıp yürüttüğünde, NFT Sözleşmesi'nin depolama alanı (iç sözleşme verileri) ve Sahip ID’si güncellenir. Bu şekilde, NFT Öğesi (sözleşti) sahiplerini doğru bir şekilde değiştirir. Bu süreç standart bir NFT Transferini detaylandırır.

Bu durumda, gönderme miktarı uygun bir değere (bir normal cüzdan için 0.01 TON ya da bir NFT transfer ederek bir sözleşme yürütmek istiyorsanız daha fazla) ayarlanmalıdır; böylece yeni sahip, sahiplik devri hakkında bir bildirim alır. Bu, yeni sahibi, NFT'yi aldıklarına dair bilgilendirilmediğinden önemlidir.

## NFT Verilerini Alma

Çoğu SDK, NFT verilerini almak için kullanıma hazır yöneticilerden yararlanmaktadır. Bu yöneticilere örnek olarak: [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L38), [tonutils-go](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132), [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L771) ve daha fazlası.

NFT verilerini almak için, `get_nft_data()` alma mekanizmasının kullanılması gereklidir. Örneğin, aşağıdaki NFT öğesi adresini doğrulamak zorundayız: `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e` (aynı zamanda [foundation.ton](https://tonscan.org/address/EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e) alanı olarak da bilinir).

Öncelikle, aşağıdaki gibi toncenter.com API'sini kullanarak get yöntemini yürütmek gerekmektedir:
```
curl -X 'POST' \
  'https://toncenter.com/api/v2/runGetMethod' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e",
  "method": "get_nft_data",
  "stack": []
}'
```
Yanıt genellikle aşağıdakine benzer bir şeydir:
```json
{
  "ok": true,
  "result": {
    "@type": "smc.runResult",
    "gas_used": 1581,
    "stack": [
      // init
      [ "num", "-0x1" ],
      // index
      [ "num", "0x9c7d56cc115e7cf6c25e126bea77cbc3cb15d55106f2e397562591059963faa3" ],
      // collection_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4AW7psr1kCofjDYDWbjVxFa4J78SsJhlfLDEm0U+hltmfDtDcL7" } ],
      // owner_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4ATtS415xpeB1e+YRq/IsbVL8tFYPTNhzrjr5dcdgZdu5BlgvLe" } ],
      // content
      [ "cell", { "bytes": "te6cckEBCQEA7AABAwDAAQIBIAIDAUO/5NEvz/d9f/ZWh+aYYobkmY5/xar2cp73sULgTwvzeuvABAIBbgUGAER0c3/qevIyXwpbaQiTnJ1y+S20wMpSzKjOLEi7Jwi/GIVBAUG/I1EBQhz26hlqnwXCrTM5k2Qg5o03P1s9x0U4CBUQ7G4HAUG/LrgQbAsQe0P2KTvsDm8eA3Wr0ofDEIPQlYa5wXdpD/oIAEmf04AQe/qqXMblNo5fl5kYi9eYzSLgSrFtHY6k/DdIB0HmNQAQAEatAVFmGM9svpAE9og+dCyaLjylPtAuPjb0zvYqmO4eRJF0AIDBvlU=" } ]
    ],
    "exit_code": 0,
    "@extra": "1679535187.3836682:8:0.06118075068995321"
  }
}
```
Dönüş parametreleri:
- `init` - `boolean` - -1, NFT'nin başlatıldığı ve kullanılabileceği anlamına gelir.
- `index` - `uint256` - koleksiyondaki NFT'nin indeksi. Sıralı olabilir veya başka bir şekilde türetilmiş olabilir. Örneğin, bu, TON DNS sözleşmeleri ile kullanılan bir NFT alan hash'ini ifade edebilir; koleksiyonlar belirli bir indekste yalnızca bir benzersiz NFT'ye sahip olmalıdır.
- `collection_address` - `Cell` - NFT koleksiyonu adresini içeren bir hücre (boş olabilir).
- `owner_address` - `Cell` - geçerli sahibin NFT adresini içeren bir hücre (boş olabilir).
- `content` - `Cell` - NFT öğesi içeriğini içeren bir hücre (parsing gerekiyorsa TEP-64 standardına danışmak gerekmektedir).

## Bir koleksiyondaki tüm NFT'leri Alma
Bir koleksiyondaki tüm NFT'leri alma süreci, koleksiyonun sıralı olup olmamasına bağlıdır. Aşağıda her iki süreci de detaylandıralım.

### Sıralı koleksiyonlar
Sıralı bir koleksiyondaki tüm NFT'leri almak görece olarak kolaydır; çünkü gerekli NFT sayısı zaten bilinmektedir ve adresleri kolaylıkla elde edilebilir. Bu süreci tamamlamak için, aşağıdaki adımlar sırayla izlenmelidir:
1. Koleksiyon sözleşmesinde TonCenter API'sını kullanarak `get_collection_data` yöntemini çağırın ve yanıttan `next_item_index` değerini alın.
2. `get_nft_address_by_index` yöntemini kullanarak, indeks değeri `i`'yi (başlangıçta 0 olarak ayarlanmış) geçerek koleksiyondaki ilk NFT'nin adresini alın.
3. Bir önceki adımdan elde edilen adresi kullanarak NFT Öğesi verilerini alın. Daha sonra, ilk NFT Koleksiyonu akıllı sözleşmesinin, NFT öğesinin bildirdiği NFT Koleksiyonu akıllı sözleşmesiyle eşleşip eşleşmediğini kontrol edin (koleksiyonun başka bir kullanıcının NFT akıllı sözleşmesini benimsemediğinden emin olmak için).
4. Önceki adımdan `individual_content` ile `i` ile `get_nft_content` yöntemini çağırın.
5. `i`'yi 1 artırın ve `i`, `next_item_index` ile eşit oluncaya kadar adım 2-5'i tekrarlayın.
6. Bu noktada, koleksiyondan ve bireysel öğelerinden gerekli bilgilere sahip olacaksınız.

### Sıralanmamış koleksiyonlar
Sıralanmamış bir koleksiyondaki NFT'lerin listesini almak daha zor çünkü koleksiyona ait NFT'lerin adreslerini elde etmenin içsel bir yolu yoktur. Bu nedenle, koleksiyon sözleşmesindeki tüm işlemlerin ayrıştırılması ve koleksiyona ait NFT'lere karşılık gelen tüm giden mesajların kontrol edilmesi gerekmektedir.

Bunu yapmak için, NFT verileri alınmalı ve `get_nft_address_by_index` yöntemi koleksiyonda NFT tarafından döndürülen ID ile çağrılmalıdır. Eğer NFT sözleşme adresi ve `get_nft_address_by_index` yöntemi tarafından döndürülen adres eşleşirse, NFT'nin mevcut koleksiyona ait olduğu gösterilir. Ancak, koleksiyonun tüm mesajlarının ayrıştırılması uzun bir süreç olabilir ve arşiv düğümleri gerektirebilir.

## TON Dışında NFT'lerle Çalışma

### NFT Gönderimi

NFT sahipliğini devretmek için, NFT sahibinin cüzdanından NFT sözleşmesine bir iç mesaj göndermek gereklidir. Bu, transfer mesajını içeren bir hücre oluşturularak gerçekleştirilebilir. Bu, belirli bir dil için kütüphaneler kullanılarak yapılabilir (örn. [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65), [ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102), [tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)).

Transfer mesajı oluşturulduktan sonra, sahip cüzdan sözleşmesinden NFT öğesi sözleşme adresine gönderilmesi ve ilgili işlem ücretini karşılamak için yeterli TON miktarıyla birlikte gönderilmesi gereklidir.

Başka bir kullanıcıdan kendinize NFT transfer etmek için, TON Connect 2.0 veya ton:// bağlantısını içeren basit bir QR kodu kullanmanız gerekmektedir. Örneğin:
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`

### NFT Alma
Belirli bir akıllı sözleşme adresine (yani bir kullanıcının cüzdanına) gönderilen NFT'leri izleme süreci, ödemeleri izlemek için kullanılan mekanizmaya benzer. Bu, cüzdanınızdaki tüm yeni işlemleri dinleyerek ve ayrıştırarak tamamlanmaktadır.

Bir sonraki adımlar, belirli kullanıma göre değişiklik gösterebilir. Aşağıda birkaç farklı senaryo inceleyelim.

#### Tanınmış NFT adres transferlerini bekleyen hizmet:
- NFT öğesi akıllı sözleşme adresinden gönderilen yeni işlemleri doğrulayın.
- Mesaj gövdesinin ilk 32 bitini `uint` türü olarak okuyun ve bunun `op::ownership_assigned()` (`0x05138d91`) ile eşit olup olmadığını kontrol edin.
- Mesaj gövdesinden sonraki 64 biti `query_id` olarak okuyun.
- Mesaj gövdesinden adresi `prev_owner_address` olarak okuyun.
- Artık yeni NFT'nizi yönetmek mümkündür.

:::note
Bu adımlar, NFT'nin yeni sahibi tarafından transfer edilmesinin takibini kolaylaştırır.
:::

#### Tüm NFT transfer türlerini dinleyen hizmet:
- Tüm yeni işlemleri kontrol edin ve gövde uzunluğu 363 bitten (OP - 32, QueryID - 64, Adres - 267) az olanları yok sayın.
- Yukarıdaki listede ayrıntılı olarak belirttiğimiz adımları tekrarlayın.
- Süreç düzgün çalışıyorsa, NFT'nin özgünlüğünü kontrol etmek, ayrıştırmak ve ait olduğu koleksiyonu doğrulamak gerekmektedir. Daha sonra NFT'nin belirtilen koleksiyona ait olduğundan emin olmak gerekir. Bu süreci detaylandıran daha fazla bilgi, `Koleksiyondaki Tüm NFT'leri Alma` bölümünde bulunabilir. Bu süreç, NFT'ler veya koleksiyonlar için bir beyaz liste kullanarak basitleştirilebilir.
- Artık yeni NFT'nizi yönetebilirsiniz.

#### NFT transferlerini içsel işlemlerle bağlama:

Bu tür bir işlem alındığında, önceki listedeki adımları tekrarlamak gerekmektedir. Bu süreç tamamlandığında, `prev_owner_address` değerini okuduktan sonra mesaj gövdesinden bir uint32 okuyarak `RANDOM_ID` parametresini almak mümkündür.

#### Bildirim mesajı olmadan gönderilen NFT'ler:
Yukarıda belirtilen tüm stratejiler, hizmetlerin NFT transferinde doğru bir şekilde bir ileri mesaj oluşturmasını gerektirir. Eğer bu yapılmazsa, NFT'nin bize transfer edildiğini öğrenemeyiz. Ancak, bu senaryoda birkaç alternatif çözüm bulunmaktadır:

Yukarıda belirtilen tüm stratejiler, hizmetlerin NFT transferinde doğru bir şekilde bir ileri mesaj oluşturmasını gerektirir. Bu süreç yerine getirilmezse, NFT'nin hangi tarafa transfer edildiği konusunda belirsizlik oluşur. Ancak, bu senaryoda mümkün olan birkaç alternatif çözüm bulunmaktadır:

- Az sayıda NFT bekleniyorsa, bunları periyodik olarak ayrıştırmak ve sahibin ilgili sözleşme türüne dönüp dönmediğini kontrol etmek mümkündür.
- Büyük sayıda NFT bekleniyorsa, tüm yeni blokları ayrıştırmak ve NFT hedefe `op::transfer` yöntemi kullanılarak herhangi bir çağrı yapılıp yapılmadığını kontrol etmek mümkündür. Bu tür bir işlem başlatılırsa, NFT sahibini doğrulamak ve transferi almak mümkündür.
- Transfer sırasında yeni blokların ayrıştırılmasının mümkün olmaması durumunda, kullanıcıların NFT sahipliğini doğrulama süreçlerini kendileri tetiklemeleri mümkündür. Bu şekilde, bir bildirim olmadan NFT transferinin ardından NFT sahipliğini doğrulama sürecini başlatmak mümkündür.

## Akıllı Sözleşmelerden NFT'lerle Etkileşim

NFT'leri gönderme ve alma temellerini kapsadıktan sonra, [NFT Satış](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc) sözleşmesi örneğini kullanarak akıllı sözleşmelerden NFT'leri nasıl alacağımızı ve transfer edeceğimizi keşfedelim.

### NFT Gönderimi

Bu örnekte, NFT transfer mesajı [satır 67](https://www.google.com/url?q=https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc%23L67&sa=D&source=docs&ust=1685436161341866&usg=AOvVaw1yuoIzcbEuvqMS4xQMqfXE) bulunur:

```
var nft_msg = begin_cell()
  .store_uint(0x18, 6)
  .store_slice(nft_address)
  .store_coins(0)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bakın)
  .store_uint(op::transfer(), 32)
  .store_uint(query_id, 64)
  .store_slice(sender_address) ;; new_owner_address
  .store_slice(sender_address) ;; response_address
  .store_int(0, 1) ;; boş custom_payload
  .store_coins(0) ;; yeni_sahip_adrese yapılan ön ödeme miktarı
  .store_int(0, 1); ;; boş forward_payload
```
Kodu inceleyelim:
- `store_uint(0x18, 6)` - mesaj bayraklarını depolar.
- `store_slice(nft_address)` - mesaj alıcılarını (NFT adreslerini) depolar.
- `store_coins(0)` - mesajla gönderilecek TON miktarı 0 olarak ayarlanır; çünkü kalan bakiyesi ile mesaj gönderilmesi için `128` `mesaj modu` kullanılmaktadır. Kullanıcının tüm bakiyesi dışında bir miktar göndermek için, numaranın değiştirilmesi gerekmektedir. Bunun yeterince yüksek olması, hem gaz ücretlerini hem de herhangi bir iletim tutarını karşılayabileceği için dikkat edilmelidir.
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)`  -  mesaj başlığını oluşturan diğer bileşenler boş bırakılır.
- `store_uint(op::transfer(), 32)` - msg_body başlangıcıdır. Burada, alıcının bu mesajın transfer sahipliği mesajı olduğunu anlaması için transfer OP kodunu kullanmaya başlıyoruz.
- `store_uint(query_id, 64)` - query_id'i depolayın.
- `store_slice(sender_address) ;; new_owner_address` - ilk depolanan adres, NFT'leri aktarmak ve bildirim göndermek için kullanılan adrestir.
- `store_slice(sender_address) ;; response_address` - ikinci kayıtlı adres bir yanıt adresidir.
- `store_int(0, 1)` - özel yük bayrağı 0 olarak ayarlanmıştır; bu, özel bir yük gerektirmediğini gösterir.
- `store_coins(0)` - mesajla iletilecek TON miktarıdır. Bu örnekte 0 olarak ayarlanmıştır; ancak, bu değerin daha yüksek bir tutara (örneğin en az 0.01 TON) ayarlanması önerilmektedir; böylece bir ileri mesaj oluşturulabilir ve yeni sahibin NFT'yi aldığı hakkında bilgilendirilmesi sağlanabilir. Miktar, ilgili ücretleri ve maliyetleri karşılamak için yeterli olmalıdır.
- `.store_int(0, 1)` - özel yük bayrağı. Servisinizin payload'ı bir referans olarak geçmesi gerekiyorsa `1` olarak ayarlanmalıdır.

### NFT'lerin Alınması

NFT'yi gönderdikten sonra, yeni sahibi tarafından ne zaman alındığını belirlemek kritik bir öneme sahiptir. Bunu yapmanın iyi bir örneği, aynı NFT satış akıllı sözleşmesinde bulunabilir:

```plaintext
slice cs = in_msg_full.begin_parse();
int flags = cs~load_uint(4);

if (flags & 1) {  ;; bounce mesajlarını görmezden gel
    return ();
}
slice sender_address = cs~load_msg_addr();
throw_unless(500, equal_slices(sender_address, nft_address));
int op = in_msg_body~load_uint(32);
throw_unless(501, op == op::ownership_assigned());
int query_id = in_msg_body~load_uint(64);
slice prev_owner_address = in_msg_body~load_msg_addr();
```

Kodun her satırını tekrar inceleyelim:

- `slice cs = in_msg_full.begin_parse();` - **gelen mesajı ayrıştırmak için kullanılır.**
- `int flags = cs~load_uint(4);` - **mesajın ilk 4 bitinden bayrakları yüklemek için kullanılır.**

:::tip
Bounce olan mesajlar, bir işlemi almakta hata ile karşılaşan ve gönderen kişiye geri dönen mesajlardır. 
Eğer aksi bir neden yoksa, gelen tüm mesajlarınız için bu işlemi gerçekleştirmek önemlidir.
:::

- `if (flags & 1) { return (); } ;; bounce mesajlarını görmezden gel` - **mesajın geri dönmediğini doğrulamak için kullanılır.**
- `slice sender_address = cs~load_msg_addr();` - mesaj göndereni yüklemek için kullanılır. **Bu durumda, özel olarak bir NFT adresi kullanılarak yükleme yapılır.**
- `throw_unless(500, equal_slices(sender_address, nft_address));` - gönderenin gerçekten akılla transfer edilmesi gereken bir NFT olduğunu doğrulamak için kullanılır. **Akıllı sözleşmelerden NFT verilerini ayrıştırmak oldukça zordur, bu nedenle çoğu durumda NFT adresi sözleşme oluşturulurken önceden tanımlanır.**
- `int op = in_msg_body~load_uint(32);` - **mesaj OP kodunu yükler.**
- `throw_unless(501, op == op::ownership_assigned());` - alınan OP kodunun mülkiyet atama sabit değeriyle eşleştiğinden emin olur.
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - **önceki sahip adresi, gelen mesaj gövdesinden çıkarılır ve `prev_owner_address` dilim değişkenine yüklenir.** Bu, önceki sahibi sözleşmeyi iptal etmeye ve NFT'nin kendisine geri verilmesini istemesi durumunda faydalı olabilir.

:::info
Artık bildirim mesajını başarıyla ayrıştırıp doğruladığımıza göre, NFT İhale'leri için (örneğin getgems.io gibi) NFT Öğesi satış süreçlerini yönetmek için kullanılan bir satış akıllı sözleşmesi başlatmak üzere iş mantığımızla ilerleyebiliriz.
:::