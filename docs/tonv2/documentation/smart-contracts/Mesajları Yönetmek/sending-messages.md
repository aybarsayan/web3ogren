# Mesaj Gönderimi

Mesajların oluşturulması, ayrıştırılması ve gönderilmesi, `TL-B şemaları` ve `işlem aşamaları ile TVM` kesişiminde yer almaktadır.

Gerçekten, FunC, üzerinde seri hale getirilmiş bir mesaj bekleyen `send_raw_message` fonksiyonunu sunmaktadır.

TON kapsamlı bir sistem olduğu için, tüm bu işlevselliği destekleyebilecek mesajlar oldukça karmaşık görünebilir. Ancak, bu işlevselliğin çoğu yaygın senaryolar içinde kullanılmamaktadır ve mesaj serileştirmesi çoğu durumda şuna indirgenebilir:

```func
  cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_slice(message_body)
  .end_cell();
```

Bu nedenle, geliştiren korkmamalıdır ve bu belgede bir şey ilk okumada anlaşılamıyorsa, bu normaldir. **Genel fikri kavrayın.**

Bazen **'gram'** kelimesi belgelerde, genellikle kod örneklerinde geçebilir; bu, **toncoin** için sadece eski bir isimdir.

Haydi başlayalım!

## Mesaj Türleri

Üç tür mesaj vardır:
* **harici**—blockchain dışından bir akıllı sözleşmeye gönderilen mesajlar. Bu tür mesajlar, söz konusu `credit_gas` sırasında akıllı sözleşmeler tarafından açıkça kabul edilmelidir. Mesaj kabul edilmezse, düğüm bunu bir bloğa kabul etmemeli veya diğer düğümlere iletmemelidir.
* **iç**—bir blockchain varlığından diğerine gönderilen mesajlar. Bu tür mesajlar (harici ile karşılaştırıldığında) bazı TON taşıyabilir ve kendileri için ödeme yapabilir. Böylece, bu tür mesajları alan akıllı sözleşmeler bu mesajı kabul etmeyebilir. Bu durumda, gaz mesaj değerinden düşülecektir.
* **günlükler**—bir blockchain varlığından dış dünyaya gönderilen mesajlar. Genel olarak, bu tür mesajların blockchain dışına gönderilmesi için bir mekanizma yoktur. Aslında, ağdaki tüm düğümlerin bir mesajın oluşturulup oluşturulmadığı konusunda mutabakata vardığı durumda, bunların nasıl işleneceğine dair kurallar yoktur. Günlükler doğrudan `/dev/null`'a, diske kaydedilebilir, bir dizinlenmiş veritabanında saklanabilir veya hatta blockchain dışı yollarla (e-posta/telegram/sms) gönderilebilir; bunların tamamı belirli düğümün inisiyatifine bağlıdır.

---

## Mesaj Düzeni

İç mesaj düzeni ile başlayacağız.

Akıllı sözleşmeler tarafından gönderilebilecek mesajları tanımlayan TL-B şeması şu şekildedir:

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed 
  init:(Maybe (Either StateInit ^StateInit))
  body:(Either X ^X) = MessageRelaxed X;
```

Bunu kelimelere dökebiliriz. Herhangi bir mesajın serileştirilmesi üç alandan oluşur: **info** (kaynağı, varış yerini ve diğer meta verileri tanımlayan bir tür başlık), **init** (mesajların başlatılması için yalnızca gerekli olan alan) ve **body** (mesajın yükü).

`Maybe`, `Either` ve diğer ifade türleri aşağıdaki anlamlara gelir:
* **info:CommonMsgInfoRelaxed** alanında, `CommonMsgInfoRelaxed`'in serileştirilmesinin doğrudan serileştirme hücresine yerleştirildiği anlamına gelir.
* **body:(Either X ^X)** alanında, bazı `X` türlerinin (de)serileştirilmesinde önce bir `either` bitinin yerleştirileceği anlamına gelir; bu bit `X` aynı hücreye serileştiriliyorsa `0`, ayrı bir hücreye serileştiriliyorsa `1` olur.
* **init:(Maybe (Either StateInit ^StateInit)** alanında, bu alanın boş olup olmadığına bağlı olarak önce **0** veya **1** yerleştirileceği anlamına gelir; eğer boş değilse, `Either StateInit ^StateInit` serileştirilecektir (yine, `StateInit` aynı hücreye serileştiriliyorsa `0`, ayrı bir hücreye serileştiriliyorsa `1` olan bir **either** bit eklenir).

`CommonMsgInfoRelaxed` düzeni aşağıdaki gibidir:

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt 
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

Şimdi `int_msg_info`'ya odaklanalım. 
1 bitlik `0` öneki ile başlar, ardından Instant Hypercube Routing'un devre dışı olup olmadığı, mesajın işlemesi sırasında hatalar varsa mesajın sekteye uğrayıp uğramadığı ve mesajın kendisinin bir sekteye neden olup olmadığına dair üç 1-bit bayrağı bulunur. Ardından, kaynak ve hedef adresler serileştirilir, ardından mesajın değeri ve mesajın yönlendirme ücretleri ve zamanı ile ilgili dört tamsayı gelir.

Eğer mesaj akıllı sözleşmeden gönderiliyorsa, bazı alanlar doğru değerlere yazılacaktır. Özellikle, doğrulayıcı `bounced`, `src`, `ihr_fee`, `fwd_fee`, `created_lt` ve `created_at` değerlerini güncelleyecektir. Bu iki durumu ifade eder: birincisi, başka bir akıllı sözleşmenin mesajı işlerken bu alanlara güvenebileceği (gönderen kaynak adresini sahte bir şekilde değiştiremez, `bounced` bayrağını vb.); ikincisi, serileştirme sırasında bu alanlara herhangi bir geçerli değer koyabileceğimizdir (her neyse, bu değerler üzerine yazılacaktır).

Mesajın doğrudan serileştirilmesi aşağıdaki gibi olacaktır:

```func
  var msg = begin_cell()
    .store_uint(0, 1) ;; tag
    .store_uint(1, 1) ;; ihr_disabled
    .store_uint(1, 1) ;; bounces'i izin ver
    .store_uint(0, 1) ;; kendisi sekteye uğramamış
    .store_slice(source)
    .store_slice(destination)
    ;; CurrencyCollection'ı serileştir (aşağıya bakın)
    .store_coins(amount)
    .store_dict(extra_currencies)
    .store_coins(0) ;; ihr_fee
    .store_coins(fwd_value) ;; fwd_fee 
    .store_uint(cur_lt(), 64) ;; işlem lt'si
    .store_uint(now(), 32) ;; işlem için unixtime
    .store_uint(0,  1) ;; no init-field flag (Maybe)
    .store_uint(0,  1) ;; inplace mesaj içeriği bayrağı (Either)
    .store_slice(msg_body)
  .end_cell();
```

Ancak, genellikle, geliştiriciler tüm alanların adım adım serileştirilmesi yerine kısayolları kullanırlar. Dolayısıyla, mesajların akıllı sözleşmeden nasıl gönderileceğini [elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153) örneğinden gözden geçirelim.

```func
() send_message_back(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(ans_tag, 32)
    .store_uint(query_id, 64);
  if (body >= 0) {
    msg~store_uint(body, 32);
  }
  send_raw_message(msg.end_cell(), mode);
}
```

İlk olarak, `0x18` değerini 6 bite koyar, bu da `0b011000` demektir. Bu nedir?

* İlk bit `0`—`int_msg_info` olduğunu belirten 1 bitlik ön ek.
* Ardından, `ihr_disabled` bayrağı, mesajların sekteye uğrayabileceği ve mesajın kendisinin sekteye uğramadığına dair üç bit `1`, `1`, `0`. 
* Ardından gönderen adres gelmelidir, ancak bu alan herhangi bir geçerli adresin orada saklanmasına neden olabilir, çünkü her durumda etkisi tekrar yazılacaktır. Kısa geçerli adres serileştirmesi `addr_none`'ın serileştirmesidir ve iki bitlik `00` dizisi ile serileştirilir.

Böylelikle, `.store_uint(0x18, 6)` etiketi ve ilk 4 alanın optimize edilmiş bir serileştirme yoludur.

Sonraki satır varış adresini serileştirir.

Ardından değerleri serileştirmemiz gerekir. Genel olarak, mesaj değeri `CurrencyCollection` nesnesidir ve şu şemaya sahiptir:

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) 
                 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection 
           = CurrencyCollection;
```

Bu şema, TON değerine ek olarak, mesajın ek bir _extra-currencies_ sözlüğünü taşıyabileceği anlamına gelmektedir. Ancak, şu anda bunu göz ardı edebiliriz ve mesajın değerinin "nanoton sayısı olarak değişken tamsayı" ve "`0` - boş sözlük baytı" şeklinde serileştirildiğini varsayabiliriz.

Gerçekten de, yukarıdaki elector kodunda, jetonların miktarlarını `.store_coins(toncoins)` ile serileştiriyoruz; ancak daha sonra sadece toplam uzunluğu `1 + 4 + 4 + 64 + 32 + 1 + 1` olan sıfırlar dizisini koyuyoruz. Peki bu nedir? 

* İlk bit, boş ekstra para birimleri sözlüğünü temsil eder.
* Ardından, iki 4 bit uzun alana sahibiz. Bunun içinde 0 `VarUInteger 16` olarak kodlanmaktadır. Aslında, `ihr_fee` ve `fwd_fee` üstü yazılacağı için buraya da sıfır koyabiliriz.
* Ardından sıfır `created_lt` ve `created_at` alanlarına yerleştirilir. Bu alanlar da üstü yazılacaktır; ancak, ücretlerin aksine, bu alanların sabit uzunluğu vardır ve bu nedenle 64 bit ve 32 bit uzun diziler olarak kodlanmıştır.
* _(o anda mesaj başlığını zaten serileştirmiş ve init/body'e geçmişizdir)_
* Sonraki sıfır biti `init` alanının olmadığını gösterir.
* Son bit, mesaj içeriğinin yerinde serileştirileceği anlamına gelir.
* Bunun ardından, mesajın gövdesi (herhangi bir düzen ile) kodlanır.

Bu şekilde, 14 parametrenin bireysel serileştirilmesi yerine, 4 serileştirme ilkesini uyguluyoruz.

## Tam Şema

Mesaj düzeni ve içerik alanlarının tamamını (ve TON'daki tüm nesnelerin şemasını) [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) dosyasında bulabilirsiniz.

---

## Mesaj Boyutu

:::info
**Hücre boyutu:** Herhangi bir `Cell` maksimum `1023` bit içerebilir. Eğer daha fazla veri depolamanız gerekiyorsa, bunu parçalara ayırmalı ve referans hücrelerde saklamalısınız.
:::

Örneğin, eğer mesaj gövdenizin boyutu 900 bit uzunluğunda ise, bunu mesaj başlığı ile aynı hücrede depolayamazsınız. Gerçekten de, mesaj başlığı alanları dışında, hücrenin toplam boyutu **1023** bitten fazla olacaktır ve serileştirme sırasında `hücre taşması` hatası alınacaktır. Bu durumda, yerinde mesaj gövdesi bayrağı (`0`) yerine **1** olmalı ve mesaj gövdesi referans hücrede saklanmalıdır.

Bu şeyler, bazı alanların değişken boyutları olduğu gerçeği nedeniyle dikkatlice işlenmelidir.

Örneğin, `MsgAddress` dört oluşturucu ile temsil edilebilir: `addr_none`, `addr_std`, `addr_extern`, `addr_var`; uzunluğu 2 bit (`addr_none` için) ile 586 bit (en büyük formdaki `addr_var` için) arasında değişmektedir. Aynı durum, `VarUInteger 16` olarak serileştirilen nanotondan miktarlar için de geçerlidir. Bu, 4 bitin tamsayının bayt uzunluğunu gösterdiği ve ardından daha önce belirtilen baytların kendisi ile birlikte geldiği anlamına gelir. Bu şekilde, **0** nanotondan `0b0000` (sıfır uzunlukta bir bayt dizisini kodlayan 4 bit ve ardından sıfır bayt) olarak serileştirilecek, **100.000.000** TON (veya **100000000000000000** nanotondan) ise `0b10000000000101100011010001010111100001011101100010100000000000000000` olarak serileştirilecektir (`0b1000`, 8 baytı temsil eder ve ardından 8 baytı kendisi).

:::info
**Mesaj boyutu:** Mesajın genel boyut sınırlamaları ve hücre sayısı sınırlamaları da olduğunu unutmayın, örneğin: maksimum mesaj boyutu `max_msg_bits`'i geçmemeli, mesaj başına hücre sayısı `max_msg_cells`'i geçmemelidir...

Daha fazla yapılandırma parametresi ve değerleri için [buraya](https://v3/documentation/network/configs/blockchain-configs#param-43) göz atabilirsiniz.
:::

---

## Mesaj Modları

Görmüş olabileceğiniz gibi, `send_raw_message` ile mesajlar gönderiyoruz; bu, yalnızca mesajı tüketmekle kalmaz, ayrıca modda kabul eder. Bu mod, mesaj gönderirken, yakıt için ayrı ödeme yapıp yapmamayı ve hataları nasıl yöneteceğini belirlemek için kullanılır. TON Sanal Makinesi (TVM) mesajları analiz ettikçe ve işlerken, mod değerine bağlı olarak farklılaştırılmış bir işlem yapar. Değerlendirmekte zorlanılıyor çünkü mod parametresinin değerinin iki değişkeni vardır: mod ve bayrak. Mod ve bayrak farklı işlevlere sahiptir:

- **mod** : mesaj gönderirken temel davranışı tanımlar, örneğin, bakiyeyi taşıyıp taşımayacağı, mesajın işlenme sonuçlarını bekleyip beklemeyeceği vb. Farklı mod değerleri, farklı gönderim özelliklerini temsil eder ve belirli gönderim gereksinimlerini karşılamak için farklı değerler birleştirilebilir.
- **bayrak** : modun yanı sıra, her mesaj davranışını yapılandırmak için kullanılır, örneğin, transfer ücretlerini mesaj değerinden ayrı ödemek veya işleme hatalarını göz ardı etmek. Bayrak, nihai mesaj gönderim modunu oluşturmak için moda eklenir.

`send_raw_message` fonksiyonunu kullanırken ihtiyaçlarınıza uygun mod ve bayrak kombinasyonunu seçmek önemlidir. İhtiyaçlarınıza en uygun modu belirlemek için aşağıdaki tabloya göz atabilirsiniz:

| Mod | Açıklama |
|:-|:-|
| `0` | Sıradan mesaj |
| `64` | Yeni mesajda başlangıçta belirtilen değerin yanı sıra, gelen mesajın kalan değerini de taşıyın |
| `128` | Yeni mesajda başlangıçta belirtilen değerin yerine, mevcut akıllı sözleşmenin tüm kalan bakiyesini taşıyın |

| Bayrak  | Açıklama                                                                                         |
|:------|:----------------------------------------------------------------------------------------------------|
| `+1`  | Transfer ücretlerini mesaj değerinden ayrı olarak ödeyin                                                 |
| `+2`  | İşlem aşaması sırasında bu mesajı işleme sırasında ortaya çıkan bazı hataları yok sayın (aşağıdaki notu kontrol edin) |
| `+16` | İşlem başarısızsa - işlemi geri al. `+2` kullanılması durumunda etkisi yoktur.                         |
| `+32` | Sonuçta bakiyesi sıfır olan mevcut hesap yok edilmelidir (genellikle Mod 128 ile kullanılır)       |

:::info
**+2 bayrağı**: `+2` bayrağı yalnızca işleme aşmasında işlem sırasında ortaya çıkan aşağıdaki hataları yok sayar:
1. Yeterli Toncoin yok:
    - Mesaj ile transfer için yeterli değer yok (gelen mesajın tüm değeri tüketildi).
    - Mesajı işlemek için yeterli fon yok.
    - Mesajın yönlendirme ücretlerini ödemek için yeterli değere sahip değil.
    - Mesaj ile göndermek için yeterli ekstra para yok.
    - Harici bir mesaj için çıkış yapmak için yeterli fon yok.
2. Mesaj çok büyük (daha fazlası için `Mesaj boyutu` kontrol edin).
3. Mesajın çok büyük Merkle derinliği var.

Ancak, aşağıdaki senaryolarda hataları yok saymaz:
1. Mesaj geçersiz bir biçime sahipse.
2. Mesaj modunun hem 64 hem de 128 modlarını içermesi halinde.
3. Çıkış mesajı, StateInit içinde geçersiz kütüphaneler içeriyorsa.
4. Harici mesaj sıradan değilse veya +16 veya +32 bayrağını ya da her ikisini içeriyorsa.
:::

:::info
**+16 bayrağı**: Eğer sözleşme sekteye uğrayabilen bir mesaj alırsa, `credit` aşamasından **önce** `storage` aşamasını işler.

Aksi takdirde, `storage` aşamasını **önce** `credit` aşamasından işler.

[`bounce-enable` bayrağı için kontroller ile kaynak kodunu kontrol edin](https://github.com/ton-blockchain/ton/blob/master/validator/impl/collator.cpp#L2810).
:::

:::warning
1. **+16 bayrağı** - harici mesajlarda (örneğin, cüzdanlara) kullanmayın, çünkü geri dönen mesajı alacak bir gönderen yoktur.
2. **+2 bayrağı** - harici mesajlarda (örneğin, cüzdanlara) önemlidir.
:::

---

### Kullanım Vakalarına Örnek

Daha net hale getirmek için bir örneğe bakalım. Diyelim ki akıllı sözleşmemizde 100 Toncoin var ve 50 Toncoin ile bir iç mesaj alıyoruz ve 20 Toncoin ile bir mesaj gönderiyoruz, toplam ücret 3 Toncoin.

**ÖNEMLİ**: Hatalı durumların sonuçları, hatanın meydana geldiği durumda açıklanmıştır.

| Durum | Mod ve Bayraklar | Kod | Sonuç |
|:-|:-|:-|:-|
| Sıradan bir mesaj gönder | `mod` = 0, bayrak yok | `send_raw_message(msg, 0)` | `bakiye` - 100 + 50 - 20 = 130, `gönder` - 20 - 3 = 17 |
| Sıradan bir mesaj gönder, eğer işlem aşamasında bir hata varsa, işlemi geri almayın ve göz ardı edin | `mod` = 0, `bayrak` = 2 | `send_raw_message(msg, 2)` | `bakiye` - 100 + 50, `gönder` - 0 |
| Sıradan bir mesaj gönder, eğer işlem aşamasında bir hata olursa, mesajı geri gönderirken işlemi geri al | `mod` = 0, `bayrak` = 16 | `send_raw_message(msg, 16)` | `bakiye` - 100 + 50 = 167 + 17 (geri döner), `gönder` - 20 - 3 = `geri döner` mesajı 17 |
| Sıradan bir mesaj gönder ve transfer ücretlerini ayrı ödeyin |  `mod` = 0, `bayrak` = 1 | `send_raw_message(msg, 1)` | `bakiye` - 100 + 50 - 20 - 3 = 127, `gönder` - 20 |
| Sıradan bir mesaj gönder ve transfer ücretlerini ayrı ödeyin, eğer işlem aşamasında bir hata olursa, mesajı geri gönderirken işlemi geri al |  `mod` = 0, `bayrak` = 1 + 16 | `send_raw_message(msg, 17)` | `bakiye` - 100 + 50 - 20 - 3 = 127 + `20 (geri döner)`, `gönder` - 20 = `geri döner` mesajı 20 |
| Gelen mesajın kalan değerini yeni mesajda başlangıçta belirtilen değerin yanı sıra taşıyın | `mod` = 64, `bayrak` = 0 | `send_raw_message(msg, 64)` | `bakiye` - 100 - 20 = 80, `gönder` - 20 + 50 - 3 = 67 |
| Gelen mesajın kalan değerini yeni mesajda başlangıçta belirtilen değerin yanı sıra taşıyın ve transfer ücretlerini ayrı ödeyin | `mod` = 64, `bayrak` = 1 | `send_raw_message(msg, 65)` | `bakiye` - 100 - 20 - 3 = 77, `gönder` - 20 + 50 = 70 |
| Gelen mesajın kalan değerini yeni mesajda başlangıçta belirtilen değerin yanı sıra taşıyın ve transfer ücretlerini ayrı ödeyin, eğer işlem aşamasında bir hata olursa, mesajı geri gönderirken işlemi geri al | `mod` = 64, `bayrak` = 1 + 16 | `send_raw_message(msg, 81)` | `bakiye` - 100 - 20 - 3 = 77 + `70 (geri döner)`, `gönder` - 20 + 50 = `geri döner` mesajı 70 |
| Alınan tüm tokenleri sözleşme bakiyesi ile birlikte gönderin | `mod` = 128, `bayrak` = 0 | `send_raw_message(msg, 128)` | `bakiye` - 0, `gönder` - 100 + 50 - 3 = 147 |
| Alınan tüm tokenleri sözleşme bakiyesi ile birlikte gönderin, eğer işlem aşamasında bir hata olursa, mesajı geri gönderirken işlemi geri al | `mod` = 128, `bayrak` = 16 | `send_raw_message(msg, 144)` | `bakiye` - 0 + `147 (geri döner)`, `gönder` - 100 + 50 - 3 = `geri döner` mesajı 147 |
| Alınan tüm tokenleri sözleşme bakiyesi ile birlikte gönderin ve akıllı sözleşmeyi yok edin | `mod` = 128, `bayrak` = 32 | `send_raw_message(msg, 160)` | `bakiye` - 0, `gönder` - 100 + 50 - 3 = 147 |
| Alınan tüm tokenleri sözleşme bakiyesi ile birlikte gönderin ve akıllı sözleşmeyi yok edin, eğer işlem aşamasında bir hata olursa, mesajı geri gönderirken işlemi geri al. **ÖNEMLİ**: Bu davranışı kaçının çünkü iadeler zaten silinmiş bir sözleşmeye gidecektir. | `mod` = 128, `bayrak` = 32 + 16 | `send_raw_message(msg, 176)` | `bakiye` - 0 + `147 (geri döner)`, `gönder` - 100 + 50 - 3 = `geri döner` mesajı 147 |