# RLDP

Uygulama:
* https://github.com/ton-blockchain/ton/tree/master/rldp
* https://github.com/ton-blockchain/ton/tree/master/rldp2
* https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy

---

## Genel Bakış

RLDP - Güvenilir Büyük Datagram Protokolü - ADNL UDP üstünde çalışan bir protokoldür ve büyük veri bloklarının transferi için kullanılır. 
Ayrıca, diğer taraftaki onay paketleri yerine İleri Hata Düzeltme (FEC) algoritmalarını içerir. 

:::tip
Bu, ağ bileşenleri arasında veriyi daha verimli bir şekilde transfer etmeyi sağlamaktadır, ancak daha fazla trafik tüketimi ile birlikte.
:::

RLDP, TON altyapısında her yerde kullanılmaktadır; örneğin, diğer düğümlerden blokları indirmek ve onlara veri transfer etmek için kullanılır, TON web sitelerine erişmek ve TON Storage'a ulaşmak için kullanılır.

## Protokol

RLDP, iletişim için aşağıdaki TL yapılarını kullanır:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.roundRobin data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.online data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
rldp.confirm transfer_id:int256 part:int seqno:int = rldp.MessagePart;
rldp.complete transfer_id:int256 part:int = rldp.MessagePart;

rldp.message id:int256 data:bytes = rldp.Message;
rldp.query query_id:int256 max_answer_size:long timeout:int data:bytes = rldp.Message;
rldp.answer query_id:int256 data:bytes = rldp.Message;
```

Serileştirilmiş yapı, `adnl.message.custom` TL şemasında sarılır ve ADNL UDP üzerinden gönderilir. RLDP transferleri, büyük verileri transfer etmek için kullanılır; rastgele bir `transfer_id` oluşturulur ve veri kendisi FEC algoritması tarafından işlenir. 

:::note
Ortaya çıkan parçalar, `rldp.messagePart` yapısında sarılır ve eşe gönderilir, eş `rldp.complete` gönderene veya zaman aşımına kadar.
:::

Alıcı, bir tamamlanmış mesajı bir araya getirmek için gerekli `rldp.messagePart` parçalarını topladığında, tüm parçaları bir araya getirir, FEC'i kullanarak kod çözer ve sonuçta elde edilen byte dizisini `rldp.query` veya `rldp.answer` yapılarından birine deseralize eder; türüne bağlı olarak (tl ön ek id).

### FEC

RLDP ile kullanılabilecek geçerli İleri Hata Düzeltme algoritmaları RoundRobin, Online ve RaptorQ'dur. 
Hâlihazırda verilerin kodlanması için [RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf) kullanılmaktadır.

#### RaptorQ

RaptorQ'nun özü, verilerin önceden belirlenmiş aynı boyutta sembollere - bloklara - bölünmesidir. 

Bloklardan matrisler oluşturulur ve bu matrislere ayrık matematiksel işlemler uygulanır. Bu, aynı veriden neredeyse sonsuz sayıda sembol yaratmamızı sağlar. Tüm semboller karıştırılır ve kaybolan paketlerin sunucuya ek veriler istemeden geri kazanılması mümkündür; bu, aynı parçaları bir döngüde gönderdiğimizde harcanacak paket sayısından daha az paket kullanarak gerçekleştirilir.

Oluşturulan semboller, eşin tüm verilerin alındığını ve geri kazanıldığını (kod çözüldüğünü) bildirdiği zamana kadar ona gönderilir.

[[RaptorQ'nun Golang'daki uygulama örneği]](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq)

---

## RLDP-HTTP

TON Siteleri ile etkileşim için, RLDP içinde HTTP kullanılmaktadır. Host, sitesini herhangi bir HTTP web sunucusunda çalıştırır ve yanında rldp-http-proxy başlatır. 
TON ağına gelen tüm istekler, proxy aracılığıyla RLDP protokolü ile gelir ve proxy, isteği basit HTTP'ye yeniden birleştirir ve yerel olarak orijinal web sunucusunu çağırır.

Kullanıcı kendi tarafında, örneğin [Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy) aracılığıyla proxy başlatır ve .ton sitelerini kullanır; tüm trafik ters sırada sarıldığından, istekler yerel HTTP proxy'sine gider ve o da RLDP aracılığıyla uzak TON sitesine gönderir.

RLDP içindeki HTTP, TL yapıları kullanılarak uygulanmıştır:

```tlb
http.header name:string value:string = http.Header;
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;

http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

Bu, saf metin biçiminde bir HTTP değildir; her şey ikili TL'de sarılır ve proxy tarafından web sunucusuna veya tarayıcıya gönderilmeden önce geri açılır.

Çalışma şeması şu şekildedir:
* İstemci `http.request` gönderir.
* Sunucu, bir isteği alırken `Content-Length` başlığını kontrol eder.
  * Eğer 0 değilse, istemciye `http.getNextPayloadPart` isteği gönderir.
  * İstemci, gelen isteği alır ve `http.payloadPart` - istenen gövde parçasını `seqno` ve `max_chunk_size` değerine göre gönderir.
  * Sunucu, istemciden tüm parçaları alana kadar, yani son parçanın `last:Bool` alanı true olana kadar `seqno` değerini artırarak istekleri tekrarlar.
* İsteği işledikten sonra sunucu, `http.response` gönderir; istemci `Content-Length` başlığını kontrol eder.
  * Eğer 0 değilse, sunucuya bir `http.getNextPayloadPart` isteği gönderir ve tüm işlemler, önceki durumun tersine, yine de tekrarlanır.

---

## TON Sitesinden İstek

RLDP'nin nasıl çalıştığını anlamak için, TON sitesi `foundation.ton`'dan veri almanın bir örneğine bakalım. 
Diyelim ki, NFT-DNS sözleşmesinin Get metodunu çağırarak ADNL adresini zaten aldık, [DHT kullanarak RLDP servisinin adresini ve portunu belirledik](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md), ve [ADNL UDP aracılığıyla ona bağlandık](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md).

### `foundation.ton` için GET isteği gönder

Bunu yapmak için, aşağıdaki yapıyı dolduralım:

```tlb
http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
```

`http.request`'ı alanları doldurarak serileştirelim:

```
e191b161                                                           -- TL ID http.request      
116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245de471194   -- id           = {rastgele}
03 474554                                                          -- method       = string `GET`
16 687474703a2f2f666f756e646174696f6e2e746f6e2f 00                 -- url          = string `http://foundation.ton/`
08 485454502f312e31 000000                                         -- http_version = string `HTTP/1.1`
01000000                                                           -- headers (1)
   04 486f7374 000000                                              -- name         = Host
   0e 666f756e646174696f6e2e746f6e 00                              -- value        = foundation.ton
```

Artık serileştirilmiş `http.request`'ımızı `rldp.query` içine saralım ve onu da serileştirelim:

```
694d798a                                                              -- TL ID rldp.query
184c01cb1a1e4dc9322e5cabe8aa2d2a0a4dd82011edaf59eb66f3d4d15b1c5c      -- query_id        = {rastgele}
0004040000000000                                                      -- max_answer_size = 257 KB, başlıklar olarak kabul ettiğimiz yeterli herhangi bir boyut olabilir
258f9063                                                              -- timeout (unix)  = 1670418213
34 e191b161116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245   -- data (http.request)
   de4711940347455416687474703a2f2f666f756e646174696f6e2e746f6e2f00
   08485454502f312e310000000100000004486f73740000000e666f756e646174
   696f6e2e746f6e00 000000
```

### Paketlerin kodlanması ve gönderilmesi

Artık bu veriye FEC RaptorQ algoritmasını uygulamamız gerekiyor.

Öncelikle bir kodlayıcı oluşturalım; bunun için elde edilen byte dizisini sabit boyuttaki sembollere dönüştürmemiz gerekiyor. TON'da sembol boyutu 768 byte'dır. 
Bunu yapmak için diziyi 768 byte'lık parçalara bölelim. Son parçanın boyutu 768'den küçükse, gerekli boyuta ulaşmak için sıfır byte ile doldurulması gerekecek.

Dizimizin boyutu 156 byte olup, bu nedenle yalnızca 1 parça bulunacaktır ve boyutunu 768'e ulaşacak şekilde 612 sıfır byte ile doldurmalıyız.

Ayrıca, kodlayıcı için boyutlara göre sabitler seçilir; daha fazla bilgi almak için RaptorQ belgelerine bakabilirsiniz, ancak matematiksel karmaşanın içine girmemek için, böyle bir kodlama uygulayan hazır bir kütüphane kullanmanızı öneririm. 

:::tip
[[Kodlayıcı oluşturma örneği]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15) ve [[Sembol kodlama örneği]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26).
:::

Semboller, döngü usulüyle kodlanır ve gönderilir: başlangıçta `seqno` değerini 0 olarak tanımlarız ve her ardışık kodlanmış paket için 1 artırırız. Örneğin, 2 sembolümüz varsa, ilkini kodlar ve göndeririz, ardından seqno'yu 1 artırır, sonra ikinciyi kodlar ve seqno'yu yine 1 artırırız; daha sonra tekrar birinciyi kodlar ve seqno'yu bu noktada 2'ye eşit hale getirip bir kez daha artırırız. 

:::warning
Ve artık eşten verileri aldığımızı teyit edene kadar bu işlem böyle devam eder.
:::

Kodu oluşturduğumuzda, veri göndermeye hazırız; bunu yapmak için TL şemasını dolduracağız:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```

* `transfer_id` - rastgele bir int256, aynı veri transferinde tüm messagePart'lar için aynıdır.
* `fec_type` = `fec.raptorQ`.
*  * `data_size` = 156
*  * `symbol_size` = 768
*  * `symbols_count` = 1
*  `part` bu durumda her zaman 0'dır; boyut limitine ulaştığı durumlarda kullanılabilir.
*  `total_size` = 156. Transfer verimizin boyutu.
*  `seqno` - ilk paket için 0 olacak ve her ardışık paket için 1 artacak; sembol kodlama ve çözme işlemleri için kullanılacaktır.
*  `data` - kodlanmış sembolümüz, 768 byte boyutundadır.

`rldp.messagePart`'ı serileştirdikten sonra, bunu `adnl.message.custom` içine sararak ADNL UDP üzerinden göndeririz.

Paketleri, her zaman seqno değerini artırarak bir döngü içinde gönderiyoruz; eşten gelen `rldp.complete` mesajını bekliyoruz veya zaman aşımına uğrayana kadar gönderime devam ediyoruz. Sembollerimizin sayısına eşit sayıda paket gönderdikten sonra yavaşlayabiliriz ve ek bir paket gönderebiliriz; örneğin, her 10 milisaniyede veya daha az bir süreyle. 

:::tip
Ek paketler, veri kaybı durumunda geri kazanım için kullanılır; çünkü UDP hızlı ama güvenilir olmayan bir protokoldür.
:::

[[Uygulama örneği]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L249)

### `foundation.ton`'dan gelen yanıtın işlenmesi

Gönderim sırasında, sunucudan yanıt bekleyebiliriz; biz, `http.response` içindeki `rldp.answer`'ı bekliyoruz. Bu, talep sırasında gönderilen ile aynı şekilde bir RLDP transferi olarak bize ulaşacak; ancak `transfer_id` tersine çevrilecektir (her byte XOR 0xFF ile). 

:::note
`rldp.messagePart` içeren `adnl.message.custom` mesajlarını alacağız.
:::

Öncelikle, transferin alınan ilk mesajından FEC bilgilerimizi almamız gerekiyor; özellikle `fec.raptorQ` mesajPart yapısından `data_size`, `symbol_size` ve `symbols_count` parametrelerini almalıyız. Bunlar, RaptorQ kod çözücümüzü başlatmak için gerekmektedir. [[Örnek]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137)

Başlatma işlemi tamamlandıktan sonra, aldığımız sembolleri `seqno` değerleri ile kod çözücümüze ekleriz ve `symbols_count` sayısına eşit minimum sayıda sembol toplandığında, tam mesajı çözmeye çalışabiliriz. Başarılı olursak, `rldp.complete` mesajını ileteceğiz. [[Örnek]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L168)

Sonuç, `rldp.query`'da gönderdiğimiz ile aynı `query_id`'ye sahip bir `rldp.answer` mesajı olacaktır. Veri, `http.response`'ı içermelidir.

```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```

Ana alanlarla ilgili her şeyin açık olduğunu düşünüyorum; öz, HTTP'dekiyle aynıdır. 

:::info
Burada ilginç bir bayrak olan `no_payload` var; eğer true ise, yanıt yasasında gövde yoktur (yakalama yok `Content-Length` = 0).
:::

Sunucudan gelen yanıt alınmış olarak kabul edilebilir.

Eğer `no_payload` = false ise, yanıt içinde içerik vardır ve onu almamız gerekecektir. Bunu yapmak için, `rldp.query` içine sarılmış olan `http.getNextPayloadPart` ile bir istek göndermemiz gerekiyor.

```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

`id`, `http.request`'ta gönderdiğimiz ile aynı olmalıdır; `seqno` - 0 ve her sonraki parça için +1'dir. `max_chunk_size`, kabul etmeye hazır olduğumuz maksimum parça boyutudur; tipik olarak 128 KB (131072 byte) kullanılır.

Yanıt olarak alacağımız şey:

```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```

Eğer `last` = true ise, sona ulaştık demektir; tüm parçaları birleştirip tam yanıt gövdesini alabiliriz; örneğin, html.

---

## Referanslar

_Burada, [Oleg Baranov](https://github.com/xssnick) tarafından [orijinal makaleye](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md) bağlantı bulunmaktadır._