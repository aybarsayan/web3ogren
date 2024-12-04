---
title: CORS
seoTitle: CORS (Cross-Origin Resource Sharing)
sidebar_position: 4
description: CORS, bir web tarayıcısında çalışan JavaScriptten gelen istekleri kısıtlayan bir mekanizmadır. Bu belge, gereksinimleri öğrenmek veya ağ bileşeninde CORSu yapılandırmak için bir referans olarak hizmet etmektedir.
tags: 
  - CORS
  - Connect
  - gRPC-Web
keywords: 
  - CORS
  - Cross-Origin Resource Sharing
  - Connect
  - gRPC-Web
---
## Farklı Kökenli Kaynak Paylaşımı ile Connect ve gRPC-Web

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), sunucuların bir web tarayıcısında çalışan JavaScript'ten gelen istekleri kısıtlamasına olanak tanıyan bir mekanizmadır. Örneğin, kötü niyetli bir web sayfasının farklı bir alan adı üzerindeki bir API'ye istekler göndermesine neden olabileceğini düşünün. Bu sayfayı ziyaret etmek, sizin adınıza rastgele eylemler gerçekleştirebilir.

:::tip
Bu problemi önlemek için tarayıcılar, hedefe istek yapmak için izin ister; eğer istek hedeften farklı bir yerden geliyorsa.
:::

Ön uç istek gönderirler ve sunucu CORS bilgileriyle yanıt verir. Tarayıcı, gerçek isteği yapıp yapmamaya karar verir ve yalnızca açıkça izin verilen yanıt başlıklarını JavaScript'e açığa çıkarır.

Hem Connect hem de gRPC-Web, farklı kökenli istekler için CORS ön uç istekleri gerektirir. Bu belge, gereksinimleri daha fazla öğrenmek veya ağ bileşeninde CORS'u yapılandırmanız gerekiyorsa bir referans olarak hizmet etmektedir.

Eğer sunucunuz `connect-go` ile yazılmışsa, [`connectrpc.com/cors`](https://github.com/connectrpc/cors-go) paketi CORS'u doğru bir şekilde desteklemeyi oldukça basit hale getirir. Bir örneği `burada` bulabilirsiniz. Benzer bir özellik, connect-es için `cors` export'u` ile mevcuttur.

## Protokole Göre Yapılandırmalar

### gRPC-web

```
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type,Grpc-Timeout,X-Grpc-Web,X-User-Agent
Access-Control-Expose-Headers: Grpc-Status, Grpc-Message, Grpc-Status-Details-Bin
```

### Connect

```
Access-Control-Allow-Methods: GET,POST
Access-Control-Allow-Headers: Content-Type, Connect-Protocol-Version, Connect-Timeout-Ms, X-User-Agent
```

## Ön Uç İsteği

Connect protokolü ile bir CORS ön uç isteği için bir örnek:

```
OPTIONS /connectrpc.greet.v1.GreetService/Greet HTTP/1.1
Origin: https://connectrpc.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Connect-Protocol-Version,Content-Type
[diğer başlıklar gizlenmiştir...]
```

Tarayıcının köken, ayrıca HTTP yöntemleri ve gerçek isteğin başlık adlarını ilettiğine dikkat edin.

## Ön Uç Yanıtı

Yukarıdaki ön uç isteği için CORS ön uç yanıtı ile ilgili bir örnek:

```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://connectrpc.com
Access-Control-Allow-Methods: POST,GET
Access-Control-Allow-Headers: Content-Type,Connect-Protocol-Version,Connect-Timeout-Ms,Grpc-Timeout,X-Grpc-Web,X-User-Agent
Access-Control-Max-Age: 7200
Vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers
[diğer başlıklar gizlenmiştir...]
```

Detaylara bir bakalım:

### Kökenleri İzin Verme

`Access-Control-Allow-Origin: https://connectrpc.com` tarayıcıların connectrpc.com'dan https ile istek yapmasına izin verir; varsayılan port 443 ile.

### Yöntemleri ve Başlıkları İzin Verme

`Access-Control-Allow-Methods: POST,GET`, gRPC-Web ve Connect'i desteklemek için gereklidir. gRPC-Web yalnızca POST kullanır. Connect POST kullanır ve isteğe bağlı olarak GET kullanır.

`Access-Control-Allow-Headers: Content-Type,Connect-Protocol-Version,Connect-Timeout-Ms,Grpc-Timeout,X-Grpc-Web,X-User-Agent` Connect ve gRPC-Web için gereken tüm istek başlıklarını izin verir.

> **Not:** Eğer uygulamanız özel istek başlıkları kullanıyorsa, bunları açıkça izin vermeniz gerekir. Bu, `Authorization` gibi sık kullanılan başlıkları içerir.

### Ön Uç Yanıtlarını Önbellekleme

`Access-Control-Max-Age: 7200`, tarayıcıların CORS bilgilerini daha uzun süre önbelleğe almasına izin verir; bu da ön uç isteklerinin sayısını azaltır. Değer saniye cinsindendir. CORS ayarlarınızda herhangi bir değişiklik, önbelleğe alınmış veri süresi dolana kadar etkili olmayacaktır. Firefox bu değeri 24 saatte sınırlar ve modern Chrome bunu 2 saatte (7200 saniye) sınırlar.

`Vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers`, tarayıcının verilen başlık adlarına göre CORS bilgilerini önbelleğe almak için kullanılır. Eğer CORS ön uç yanıtı dinamikse, koşullu ön uç yanıtlarına neden olan tüm istek başlıkları `Vary` yanıt başlığına eklenmelidir; böylece ara belleklerin zehirlenmesi önlenir.

## Gerçek Yanıt

Başarılı bir ön uç isteğinden sonra gerçek bir yanıtın nasıl görüneceği:

```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Expose-Headers: Grpc-Status,Grpc-Message,Grpc-Status-Details-Bin
[diğer başlıklar gizlenmiştir...]

{"greeting": "Merhaba, Buf!"}
```

Üçü de açıkça belirtilen başlıklar, gRPC-Web desteği için gereklidir. Content-Type açıkça gösterilmesine gerek yoktur; çünkü bu bir [CORS-güvenli yanıt başlığı](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header)dır.

> **Not:** Eğer uygulamanız özel yanıt başlıkları kullanıyorsa, bunları açıkça açığa çıkarmanız gerekir.  
> Eğer uygulamanız özel yanıt **trailer'ları** kullanıyorsa, bunları `Trailer-` ön ekiyle açığa çıkarmanız gerekir; çünkü Connect, tekilli RPC'ler için trailer'ları başlıklar olarak gönderir. Servisiniz trailer `Bar`'ı ayarlıyorsa, yanıt `Trailer-Bar` açığa çıkartmalıdır.

## Connect GET

Yan etkisiz RPC'ler için basit sorgular gibi, Connect CORS ön uç isteklerine gerek duymayan GET isteklerini destekler. Tarayıcılar hemen gerçek isteği yapacak, fakat iki gereklilik vardır:

1. Hiçbir istek başlığı ayarlanmamalıdır; `Connect-Timeout-Ms` veya `Grpc-Timeout`, veya herhangi bir uygulama-spesifik başlık dahil.
2. Yanıt, örneğin yanıt başlığı ile kökeni izin vermelidir: `Access-Control-Allow-Origin: https://connectrpc.com`.

Eğer ilk gereklilik karşılanmazsa, bir ön uç isteği yapılır. Eğer ikinci gereklilik karşılanmazsa, istek tarayıcıda hata verecektir.

## Wildcard'lardan Kaçınma

Birçok CORS başlığı wildcard `*`'ye izin verse de, bunu sadece kimlik bilgileri olmayan istekler için yaparlar, örneğin çerezler, TLS istemci sertifikaları veya yetkilendirme başlıkları.

:::warning
Üretimde wildcard'lardan kaçınmak en iyisidir. CORS kütüphaneleri genellikle birden fazla kökeni izin verme gibi yaygın kullanım senaryoları için mekanizma sağlar.
:::

## Özel Ağ Erişimi

[Özel ağ erişimi](https://wicg.github.io/private-network-access/) CORS'a bir eklemeyle, web sitelerinin özel ağlardaki sunuculara istek göndermesini kısıtlar. Chrome bu özelliği ilk uygulayan olmuştur. Daha fazla bilgiye [beraberindeki blog yazısında](https://developer.chrome.com/blog/private-network-access-update/) ulaşabilirsiniz.

Eğer uygulamanız özel ağ erişiminden yararlanıyorsa, CORS bilgi önbelleğini ayarlamak için ön uç yanıt başlığını `Access-Control-Allow-Private-Network` olarak ayarlamanız ve CORS bilgilerini önbelleğe aldığınızda `Vary: Access-Control-Request-Private-Network` eklemeniz gerekecektir.