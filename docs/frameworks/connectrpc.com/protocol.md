---
title: Bağlantı Protokolü Referansı
seoTitle: Bağlantı Protokolü Referansı - Geliştirici Rehberi
sidebar_position: 1
description: Bu belge, HTTP üzerinden RPCler yapmak için Bağlantı protokolünü tanımlar. Protokol, belirli bir HTTP sürümüne özgü çerçeveleme detaylarına bağlı değildir.
tags: 
  - Bağlantı Protokolü
  - RPC 
  - HTTP
  - gRPC
  - Protobuf
keywords: 
  - Bağlantı
  - Protokol
  - RPC
  - HTTP
  - gRPC
  - Protobuf
---
Bu belge, HTTP üzerinden RPC'ler yapmak için Bağlantı protokolünü tanımlar. Protokol, belirli bir HTTP sürümüne özgü çerçeveleme detaylarına _bağlı değildir_.

Kurallar [ABNF sözdizimi](https://datatracker.ietf.org/doc/html/rfc5234.html) kullanır, ancak tasarım hedefleri ve özeti gündelik okuyucular için ulaşılabilir niteliğe sahiptir. Ayrıca `tekil` ve `akış` RPC'leri için örnekler de bulunmaktadır.

## Tasarım Hedefleri

Bu protokol, aşağıdakileri amaçlar:

* Genel amaçlı HTTP araçlarıyla, özellikle tekil RPC'lerde okunabilir ve hata ayıklanabilir olmak.
* [gRPC'nin HTTP/2 protokolü] ile kavramsal olarak yakın kalmak, böylece Bağlantı uygulamaları her iki protokolü de destekleyebilir.
* Yalnızca yaygın olarak uygulanan HTTP özelliklerine bağlı kalmak ve davranışı [yüksek seviyeli anlambilimler][rfc-http-semantics] cinsinden belirlemek, böylece Bağlantı uygulamaları hazır ağ kütüphanelerini kolayca kullanabilir.

## Özet

Protokol, Protokol Buffer şemaları ile kullanıldığında, tekil, istemci akışı, sunucu akışı ve çift yönlü akış RPC'lerini destekler; bu işlemler ya ikili Protobuf ya da JSON yükleri ile gerçekleştirilir. Çift yönlü akış HTTP/2 gerektirirken, diğer RPC türleri de HTTP/1.1'i destekler. Protokol, HTTP trailer'larını hiç kullanmaz, bu nedenle herhangi bir ağ altyapısı ile çalışır.

:::info
Tekil RPC'ler `application/proto` ve `application/json` içerik türlerini kullanır ve sadeleştirilmiş bir REST diyaloğuna benzer. Çoğu istek POST'tur, yollar Protobuf şemasından türetilir, istek ve yanıt gövdesi geçerli Protobuf veya JSON'dur (gRPC tarzı ikili çerçeveleme olmaksızın) ve yanıtlar anlamlı HTTP durum kodlarına sahiptir. Örneğin:
:::

```
> POST /connectrpc.greet.v1.GreetService/Greet HTTP/1.1
> Host: demo.connectrpc.com
> Content-Type: application/json
>
> {"name": "Buf"}

< HTTP/1.1 200 OK
< Content-Type: application/json
<
< {"greeting": "Merhaba, Buf!"}
```

Yan etkisi olmayan RPC'ler için GET istekleri kullanmak mümkündür:

```
> GET /connectrpc.greet.v1.GreetService/Greet?encoding=json&message=%7B%22name%22%3A%22Buf%22%7D HTTP/1.1
> Host: demo.connectrpc.com

< HTTP/1.1 200 OK
< Content-Type: application/json
<
< {"greeting": "Merhaba, Buf!"}
```

Bir isteğin yan etkisi olmadığı kabul edilir, eğer ilişkili RPC `IdempotencyLevel` seçeneği ile böyle işaretlenmişse:

```protobuf
service ElizaService {
  rpc Say(stream SayRequest) returns (SayResponse) {
    option idempotency_level = NO_SIDE_EFFECTS;
  }
}
```

Tekil ABNF kuralları, meta verilerin (zaman aşımı ve sıkıştırma şemaları gibi) HTTP başlıklarına nasıl kodlandığını açıklar ve hata modelinin detaylarını açıklığa kavuşturur. `Aşağıdaki örnekler` daha geniş bir senaryo yelpazesini göstermektedir.

:::note
Akış RPC'leri genellikle biraz daha karmaşıktır: `application/connect+proto` ve `application/connect+json` içerik türlerini kullanır ve gRPC-Web'e benzer.
:::

## Taslak

* **İstek** &rarr; Tekil-Istek / Tekil-Get-Isteği / Akış-Isteği
* **`Tekil-Istek`** &rarr; Tekil-Istek-Başlıkları Sade-Mesaj
* **`Tekil-Get-Isteği`** &rarr; Tekil-Get-Istek-Başlıkları
* **`Akış-Isteği`** &rarr; Akış-Istek-Başlıkları *Sarmalı-Mesaj

İstemciler, sunuculara HTTP istekleri gönderir. Tekil istekler tam olarak bir mesaj içerirken, akış istekleri sıfır veya daha fazla mesaj içerebilir.

* **Yanıt** &rarr; Tekil-Yanıt / Akış-Yanıt
* **`Tekil-Yanıt`** &rarr; Tekil-Yanıt-Başlıkları Sade-Mesaj
* **`Akış-Yanıt`** &rarr; Akış-Yanıt-Başlıkları 1*Sarmalı-Mesaj

Sunucular, istemcilere HTTP yanıtları döndürür. Tekil yanıtlar tam olarak bir mesaj içerirken, akış yanıtları bir veya daha fazla mesaj içerebilir.

Bu belgedeki kurallar, HTTP/2 tarzı notasyon kullanır (örneğin, ":method POST" ve ":path /foo/bar" yerine "POST /foo/bar HTTP/1.1"). Üzerinde, Bağlantı uygulamaları bu anlamları kullanılan HTTP sürümüne uygun olarak temsil etmelidir.

## Tekil (İstek-Yanıt) RPC'leri

Çoğu RPC tekildir (ya da istek-yanıttır). Yapısal olarak, tekil RPC, webin kaynak odaklı modeliyle benzerdir. Bağlantı protokolü, web tarayıcıları, cURL ve diğer genel amaçlı HTTP araçlarıyla çalışmayı kolaylaştırmak için tekil RPC'lere özel dikkat gösterir.

### Tekil-Istek

* **Tekil-Istek** &rarr; Tekil-Istek-Başlıkları Sade-Mesaj
* **Tekil-Istek-Başlıkları** &rarr; Tekil-Çağrı-Tanımı *Öncü-MetaVeri
* **Tekil-Çağrı-Tanımı** &rarr; Yöntem-Post Yol Tekil-İçerik-Türü \[Bağlantı-Protokolü-Sürümü\] \[Zaman-Aşımı\] \[İçerik-Sıkıştırma\] \[Kabul-Sıkıştırma\]
* **Yöntem-Post** &rarr; ":method POST"
* **Yol** &rarr; ":path" "/" [Yönlendirme-Ön eki "/"] İşlem-İsmi ; büyük/küçük harf duyarlı
* **Yönlendirme-Ön eki** &rarr; \{_rastgele ön ek_\}
* **İşlem-İsmi** &rarr; \{_IDL-özgü hizmet &amp; yöntem ismi_\} ; bkz. `Protokol Buffer`
* **Mesaj-Kodlayıcı** &rarr; ("proto" / "json" / \{_özel_\})
* **Tekil-İçerik-Türü** &rarr; "content-type" "application/" Mesaj-Kodlayıcı
* **Bağlantı-Protokolü-Sürümü** &rarr; "connect-protocol-version" "1"
* **Zaman-Aşımı** &rarr; "connect-timeout-ms" Zaman-Aşımı-Milisaniye
* **Zaman-Aşımı-Milisaniye** &rarr; \{_pozitif tamsayı en fazla 10 haneli ASCII dizesi_\}
* **İçerik-Sıkıştırma** &rarr; "content-encoding" İçerik-Kodlama
* **İçerik-Kodlama** &rarr; "identity" / "gzip" / "br" / "zstd" / \{_özel_\}
* **Kabul-Sıkıştırma** &rarr; "accept-encoding" İçerik-Kodlama *("," [" "] İçerik-Kodlama) ; HTTP kalite değerleri sözdiziminin bir alt kümesi
* **Öncü-MetaVeri** &rarr; Özel-MetaVeri
* **Özel-MetaVeri** &rarr; ASCII-MetaVeri / İkili-MetaVeri
* **ASCII-MetaVeri** &rarr; Başlık-İsmi ASCII-Değeri
* **İkili-MetaVeri** &rarr; \{Başlık-İsmi "-bin"\} \{base64-kodlanmış değer\}
* **Başlık-İsmi** &rarr; 1\*( %x30-39 / %x61-7A / "\_" / "-" / ".") ; 0-9 a-z \_ - .
* **ASCII-Değeri** &rarr; 1\*( %x20-%x7E ) ; boşluk &amp; yazdırılabilir ASCII
* **Sade-Mesaj** &rarr; *\{ikili oktet\}

**Tekil-Istek-Başlıkları** şu şekilde gönderilir &mdash; ve aynı anlama sahiptir &mdash; HTTP başlıkları. Sunucular, istemci çok fazla başlık gönderdiğinde hata ile yanıt verebilir.

Eğer sunucu belirtilen **Mesaj-Kodlayıcı**'yı desteklemiyorsa, 415 Desteklenmeyen Medya Türü HTTP durum kodu ile yanıt vermelidir.

**Bağlantı-Protokolü-Sürümü** başlığı, tekil Bağlantı RPC trafiğini aynı İçerik Türünü kullanabilecek diğer isteklerden ayırır. (Gelecekte, bu başlık aynı zamanda bu protokoldeki revizyonları desteklemek için de kullanılabilir.) İstemciler, özellikle otomatik oluşturulmuş istemciler, bu başlığı göndermelidir. Sunucular ve proxy'ler bu başlıksız trafiği 400 HTTP durum kodu ile reddedebilir.

Standart HTTP anlamlarına göre, sunucular, istemci **İçerik-Sıkıştırma**'yı atladığında "identity" varsayımında bulunmalıdır. Eğer istemci **Kabul-Sıkıştırma**'yı atladığında, sunucular istemcinin talep için kullandığı **İçerik-Sıkıştırma** değerini kabul ettiğini varsaymalıdır. Sunucular, tüm istemcilerin "identity" değerini en az tercih ettikleri sıkıştırma türü olarak kabul ettiğini varsaymalıdır. Sunucu uygulamaları, **Kabul-Sıkıştırma** için tam HTTP kalite değeri sözdizimini kabul etmeyi seçebilir, ancak istemci uygulamaları burada belirtilen kolayca ayrıştırılabilir alt kümeden ibaret kalmalıdır. Sunucular, **Kabul-Sıkıştırma** başlığını sıralı bir liste olarak ele almalıdır; bu listenin başında istemcinin en çok tercih ettiği sıkıştırma türü ve sonunda en az tercih ettiği sıkıştırma türü bulunmalıdır. Eğer istemci desteklenmeyen bir **İçerik-Sıkıştırma** kullanıyorsa, sunucular, "uygulanamaz" koduyla ve desteklenen sıkıştırmaları listeleyen bir mesajla hata vermelidir.

Eğer **Zaman-Aşımı** atlanırsa, sunucu sonsuz bir zaman aşıma var saymalıdır. Protokol, 100 günden fazla zaman aşımını karşılayacak şekilde tasarlanmıştır. İstemci uygulamaları, tüm RPC'ler için bir varsayılan zaman aşımı belirleyebilir ve sunucu uygulamaları, uygun bir maksimumla zaman aşımını sınırlayabilir.

HTTP, başlık değerlerinin rastgele ikili bloblar olmasına izin vermediğinden, Bağlantı **ASCII-MetaVeri** ile **İkili-MetaVeri** arasında ayrım yapar. İkili başlıklar "-bin" ile biten anahtarları kullanmalıdır ve uygulamalar, dolgu uygulamadan base64 kodlanmış değerler yayınlaymalıdır. Uygulamalar, hem dolgunun olduğu hem de olmadığı değerleri kabul etmelidir. Çünkü ikili ve ASCII olmayan başlıklar göreceli olarak nadir olduğundan, uygulamalar HTTP başlıklarını özel bir tür belirterek değil genel bir tür kullanarak temsil edebilir. Genel tür kullanan uygulamalar, bu kuralları belirgin bir şekilde belgelemelidir. Hem ASCII hem de ikili meta veriler için "connect-" ile başlayan anahtarlar, Bağlantı protokolü tarafından kullanılmak üzere saklıdır.

**Sade-Mesaj**, **Tekil-İçerik-Türü** tarafından belirtilen kodlayıcı kullanılarak serileştirilmiş RPC istek yüküdür ve mümkünse **İçerik-Sıkıştırma** kullanılarak sıkıştırılabilir. HTTP isteği içeriği (genellikle gövde olarak adlandırılan) olarak ağda gönderilir. Sunucular, sıfır uzunluğundaki HTTP istek içeriğini açmaya çalışmamalıdır.

### Tekil-Get-Isteği

* **Tekil-Get-Isteği** &rarr; Tekil-Get-Istek-Başlıkları
* **Tekil-Get-Istek-Başlıkları** &rarr; Tekil-Get-Çağrı-Tanımı *Öncü-MetaVeri
* **Tekil-Get-Çağrı-Tanımı** &rarr; Yöntem-Get Yol "?" Sorgu-Get \[Zaman-Aşımı\] \[Kabul-Sıkıştırma\]
* **Yöntem-Get** &rarr; ":method GET"
* **Sorgu-Get** &rarr; Mesaj-Sorgu Kodlama-Sorgu \[Base64-Sorgu\] \[Sıkıştırma-Sorgu\] \[Bağlantı-Sürüm-Sorgu\]
* **Mesaj-Sorgu** &rarr; "message=" (*\{yüzde-kodlu oktet\})
* **Base64-Sorgu** &rarr; "&base64=1"
* **Kodlama-Sorgu** &rarr; "&encoding=" Mesaj-Kodlayıcı
* **Sıkıştırma-Sorgu** &rarr; "&compression=" İçerik-Kodlama
* **Bağlantı-Sürüm-Sorgu** &rarr; "&connect=v1"

**Tekil-Get-Isteği**, yan etkisiz RPC'ler, basit sorgular gibi yalnızca olağan HTTP GET istekleri kullanmak üzere tasarlanmış özel bir tekil istek varyantıdır. Bu istekler, herhangi bir özel HTTP başlığı gerektirmez ve bir tarayıcı sekmesinde görüntülenebilir. Yapılması kolay ve tarayıcılarda, proxy'lerde ve CDN'lerde önbelleğe alınabilir hale hazırlandılar.

**Tekil-Get-Istek-Başlıkları**, şu şekilde gönderilir &mdash; ve aynı anlama sahiptir &mdash; HTTP başlıkları. Sunucular, istemci çok fazla başlık gönderdiğinde hata ile yanıt verebilir.

**Sorgu-Get**, isteğin URI'sinin sorgu bölümünde gönderilir ve HTTP URI sorgu parametreleriyle aynı anlama sahiptir. Sunucular, sorgu parametrelerini herhangi bir sırada kabul etmelidir ve bilinmeyen sorgu parametrelerine Bağlantı sorgu parametreleriyle birlikte izin vermelidir. Sunucular, sorgu parametresinin bir başlığa sığamayacak kadar uzun olması durumunda hata ile yanıt verebilir.

Get isteklerindeki mesaj yükleri belirleyici bir biçimde kodlanmalıdır. Tüm kodlayıcılar, herhangi bir açıdan aynı anlamsal mesaja belirli bir "kanonik" kodlama sağlama yeteneğine sahip değildir; ancak bir kodlayıcı, bir HTTP GET isteği için kullanıldığında, belirli bir alan nesnesinin mümkün olduğunda aynı tam mesaja kodlanmasını sağlamalıdır. Bu, önbelleğe alınmış HTTP GET isteklerinin kullanımı için önemlidir; çünkü birden fazla farklı mesaj kodlaması, alt-optimallik sorunlarına neden olabilir.

**Mesaj-Sorgu**, **Kodlama-Sorgu** tarafından belirtilen kodlayıcı ile serileştirilmiş ve mümkün olan durumlarda **Sıkıştırma-Sorgu** ile sıkıştırılmış RPC istek yüküdür. Eğer **Base64-Sorgu** belirtilmişse, ham ikili oktetler RFC 4648 §5 "URL-güvenli" base64 veri kodlamasıyla kodlanacaktır; aksi takdirde bir metin yükü, RFC 1738'de belirtilen yüzde kodlama şeması kullanılarak UTF-8 olarak kodlanabilir. İsteğe bağlı olarak, base64-kodlu mesaj dolgu karakterleri içerebilir; ancak bu karakterler mevcutsa yüzde kodlanmalıdır.

:::warning
Not: Mesaj yükü ikili veriler içeriyorsa base64 kodlama kullanılmalıdır. Yüzde kodlama kullanan yükler yalnızca geçerli UTF-8 kod noktaları oluşturan baytlara sahip olabilir. İstemciler, yüzde kodlu ikili veri ile istek göndermemelidir ve sunucular, yüzde kodlu ikili verileri içeren istekleri reddetme hakkına sahiptir. Bu nedenle, `identity` dışındaki herhangi bir sıkıştırma ve ikili verileri (örneğin `proto`) kullanan herhangi bir kodlama, base64 kodlaması kullanmalıdır. Ayrıca, istemcilerin, base64 kodlamasının gerekli olduğu durumlarda bile **Base64-Sorgu**'yu açıkça belirtmeleri gerekmektedir.
:::

Eğer **Base64-Sorgu** mevcutsa, parametrenin değeri 1 olmalıdır. "base64" parametresi için diğer değerler basitçe göz ardı edilecektir. Genellikle, base64 kodlaması olmayan bir yükle yapılan isteklerin bir "base64" parametresine ihtiyacı olmayacaktır.

Eğer sunucu belirtilen **Mesaj-Kodlayıcı**'yı desteklemiyorsa, 415 Desteklenmeyen Medya Türü HTTP durum kodu ile yanıt vermelidir.

Sunucular, istemci **Sıkıştırma-Sorgu**'yu atladığında "identity" varsayımında bulunmalıdır. Eğer istemci **Kabul-Sıkıştırma**'yı atladığında, sunucular istemcinin talep için kullandığı **Sıkıştırma-Sorgu** değerini kabul ettiğini varsaymalıdır. Sunucular, tüm istemcilerin "identity" değerini en az tercih ettikleri sıkıştırma türü olarak kabul ettiğini varsaymalıdır. Sunucu uygulamaları, **Kabul-Sıkıştırma** için tam HTTP kalite değeri sözdizimini kabul etmeyi seçebilir; ancak istemci uygulamaları burada belirtilen kolayca ayrıştırılabilir alt küme ile sınırlı kalmalıdır. Sunucular, **Kabul-Sıkıştırma** başlığını bir sıralı liste olarak ele almalıdır; bu listenin başında istemcinin en çok tercih ettiği sıkıştırma türü ve sonunda en az tercih ettiği sıkıştırma türü olmalıdır. Eğer istemci desteklenmeyen bir **Sıkıştırma-Sorgu** değeri kullanıyorsa, sunucular, "uygulanamaz" koduyla ve desteklenen sıkıştırmaları listeleyen bir mesajla hata vermelidir. Sunucular, sıfır uzunluğundaki **Mesaj-Sorgu**'yu açmaya çalışmamalıdır.

Eğer **Zaman-Aşımı** atlanırsa, sunucu sonsuz bir zaman aşıma var saymalıdır. Protokol, 100 günden fazla zaman aşımını karşılayacak şekilde tasarlanmıştır. İstemci uygulamaları, tüm RPC'ler için bir varsayılan zaman aşımı belirleyebilir ve sunucu uygulamaları, uygun bir maksimumla zaman aşımını sınırlayabilir. Not: Zaman aşımı, eğer belirtilirse, sorgu parametreleri yerine HTTP başlıkları kullanılarak belirtilmelidir.

**Bağlantı-Sürüm-Sorgu** parametresi, Bağlantı GET isteklerini diğer HTTP GET isteklerinden ayırır. (Gelecekte, bu başlık aynı zamanda bu protokoldeki revizyonları desteklemek için de kullanılabilir.) İstemciler, özellikle otomatik oluşturulmuş istemciler, bu başlığı göndermelidir. Sunucular ve proxy'ler bu parametresiz trafiği 400 HTTP durum kodu ile reddedebilir.

### Tekil-Yanıt

* **Tekil-Yanıt** &rarr; Tekil-Yanıt-Başlıkları Sade-Mesaj
* **Tekil-Yanıt-Başlıkları** &rarr; HTTP-Durumu Tekil-İçerik-Türü \[İçerik-Sıkıştırma\] \[Kabul-Sıkıştırma\] *Öncü-MetaVeri *Önekli-Travma-MetaVeri
* **HTTP-Durumu** &rarr; ":status" ("200" / \{_hata kodu HTTP'ye çevrilmiştir_\})
* **Önekli-Travma-MetaVeri** &rarr; Önekli-ASCII-MetaVeri / Önekli-İkili-MetaVeri
* **Önekli-ASCII-MetaVeri** &rarr; Önekli-Başlık-İsmi ASCII-Değeri
* **Önekli-İkili-MetaVeri** &rarr; \{Önekli-Başlık-İsmi "-bin"\} \{base64-kodlanmış değer\}
* **Önekli-Başlık-İsmi** &rarr; "trailer-" Başlık-İsmi

**Tekil-Yanıt-Başlıkları** şu şekilde gönderilir &mdash; ve aynı anlama sahiptir &mdash; HTTP başlıkları. Bu, **Önekli-Travma-MetaVeri**'yi de içerir: üzerinde, **Öncü-MetaVeri** ile yan yana gönderilir, travma meta verilerini desteklemek, Bağlantı uygulamalarının akış ve tekil RPC'ler için yaygın araçlar kullanmasını sağlar. Uygulamalar, veriyi ağa yazarken travma meta veri anahtarlarını "trailer-" ön eki ile önceden tanımlamalıdır ve ağa okurken bu ön ek kaldırılmalıdır. Daha önce belirtildiği gibi, **Öncü-MetaVeri** anahtarları "connect-" ile başlarken, **Önekli-Travma-MetaVeri** anahtarları "trailer-connect-" ile başlar.

Eğer **İçerik-Sıkıştırma** atlanırsa, istemciler "identity" varsayımında bulunmalıdır. Sunucular, ya bir hata yanıtı ile dönmeli ya da istemcinin desteklediği bir **İçerik-Sıkıştırma** kullanmalıdır.

Başarılı yanıtlar 200 **HTTP-Durumu** ile gelmelidir. Bu durumda, **Tekil-İçerik-Türü**, isteğin **Tekil-İçerik-Türü** ile aynı olmalıdır. **Sade-Mesaj**, **Tekil-İçerik-Türü** tarafından belirtilen kodlayıcı kullanılarak serileştirilmiş RPC yanıt yüküdür ve mümkünse **İçerik-Sıkıştırma** ile sıkıştırılabilir. HTTP yanıt içeriği (genellikle gövde olarak adlandırılan) olarak ağda gönderilir. İstemciler, sıfır uzunluğundaki HTTP yanıt içeriğini açmaya çalışmamalıdır.

Hatalar, 200 olmayan **HTTP-Durumu** ile gelir. Bu durumda, **Tekil-İçerik-Türü** _mutlaka_ "application/json" olmalıdır. **Sade-Mesaj**, ya atlanır ya da JSON serileştirilmiş `Hata` ile birlikte sıklıkla **İçerik-Sıkıştırma** ile sıkıştırılmış olarak ve ağda HTTP yanıt içeriği olarak gönderilir. İstemciler, sıfır uzunluğundaki HTTP yanıt içeriğini açmaya çalışmamalıdır. Eğer **Sade-Mesaj**, bir Hata ise, **HTTP-Durumu**, `aşağıdaki tabloda` belirtildiği gibi Hata.code ile eşleşmelidir. Ağdan veri okurken, istemci uygulamaları **Sade-Mesaj** kaybolduğunda ya da hatalı olduğunda bir Bağlantı hata kodunu çıkarmak için `HTTP-to-Bağlantıya haritalama` kullanmalıdır.

### Örnekler {#unary-examples}

HTTP/1.1 notasyonunu kullanarak, basit bir istek ve başarılı yanıt:

```
> POST /connectrpc.greet.v1.GreetService/Greet HTTP/1.1
> Host: demo.connectrpc.com
> Content-Type: application/json
>
> {"name": "Buf"}

< HTTP/1.1 200 OK
< Content-Type: application/json
<
< {"greeting": "Merhaba, Buf!"}
```

Aynı RPC, ancak bir tekil GET isteği olarak gönderildi:

```
> GET /connectrpc.greet.v1.GreetService/Greet?message=%7B%22name%22%3A%22Buf%22%7D&encoding=json&connect=v1 HTTP/1.1
> Host: demo.connectrpc.com

< HTTP/1.1 200 OK
< Content-Type: application/json
<
< {"greeting": "Merhaba, Buf!"}
```

(Not: Bir tarayıcı URL çubuğuna yazarken, çoğu karakter otomatik olarak sizin için kodlanacaktır.)

Aynı RPC, ancak 5 saniyelik bir zaman aşımı, asimetrik sıkıştırma ve bazı özel öncü ve travma meta verileri ile:

```
> POST /connectrpc.greet.v1.GreetService/Greet HTTP/1.1
> Host: demo.connectrpc.com
> Content-Type: application/json
> Accept-Encoding: gzip, br
> Connect-Timeout-Ms: 5000
> Acme-Shard-Id: 42
>
> {"name": "Buf"}

< HTTP/1.1 200 OK
< Content-Type: application/json
< Content-Encoding: gzip
< Trailer-Acme-Operation-Cost: 237
<
< <gziplenmiş JSON>
```

Aynı RPC tekrar, ancak Protobuf kodlu bir istek ve bir hata yanıtı ile:

```
> POST /connectrpc.greet.v1.GreetService/Greet HTTP/1.1
> Host: demo.connectrpc.com
> Content-Type: application/proto
>
> <sıkıştırılmamış ikili Protobuf>

< HTTP/1.1 404 Not Found
< Content-Type: application/json
<
< {
<   "code": "uygulanamaz",
<   "message": "connectrpc.greet.v1.GreetService/Greet uygulanmamıştır"
< }
```

## Akış RPC'leri

Akış RPC'leri yarım veya tam çift yönlü olabilir. Sunucu akış RPC'lerinde, istemci tek bir mesaj gönderir ve sunucu bir mesaj akışı ile yanıt verir. İstemci akış RPC'lerinde, istemci bir mesaj akışı gönderir ve sunucu tek bir mesaj ile yanıt verir. Çift yönlü akış RPC'lerinde, hem istemci hem de sunucu bir mesaj akışı gönderir. Bağlantı uygulamasına, IDL'ye ve kullanılan HTTP sürümüne bağlı olarak, bu akış RPC türlerinin bazıları veya tamamı mevcut olmayabilir.