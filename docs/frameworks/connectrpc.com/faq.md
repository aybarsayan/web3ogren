---
title: Genel
seoTitle: Connect Protokolü Hakkında Bilgi
sidebar_position: 1
description: Connect protokolü ve kullanımı hakkında kapsamlı bir rehber. OpenAPI spesifikasyonları, akışlar ve hata yönetimi dahil konuları ele alıyor.
tags: 
  - Connect
  - gRPC
  - Protobuf
  - API
keywords: 
  - Connect protokolü
  - gRPC
  - Protobuf
  - API geliştirme
  - HTTP
---
## Genel

### Blog gönderisi veya sosyal medyada Connect'ten nasıl bahsetmeliyim?

**Connect**, projenin adıdır. Eğer bu sizin bağlamınızda belirsizse ya da arama sıralaması/özgünlük önemliyse, lütfen **Connect RPC** kullanın.

### Connect API'leri için OpenAPI spesifikasyonunu nasıl alabilirim?

Connect RPC'leri, spesifikasyon ve dokümantasyon işlevi gören Protobuf kullanılarak tanımlanır. OpenAPI, REST/HTTP uç noktaları için geçerlidir ve Connect gibi RPC sistemlerine uygulanmaz.

## Connect protokolü

### Connect uygulanımlarını nerede bulabilirim?

Tüm uygulanımlar ana [Connect RPC deposu][main-repo] üzerinde listelenmiştir.

### Connect ile REST yolları oluşturmanın bir yolu var mı?

Yol, hizmetin tam nitelikli adıdır. Bu yolu değiştirmek için yerleşik bir seçenek yoktur, çünkü bu gRPC ve gRPC-Web ile uyumluluğu bozacaktır.

Daha fazla kontrol istiyorsanız, bir seçenek [gRPC Transcoding](https://github.com/googleapis/googleapis/blob/738ff24cb9c00be062dc200c10426df7b13d1e65/google/api/http.proto#L44) kullanmaktır; bu, REST yollarını belirlemenize olanak tanır. Bunu [vanguard-go](https://github.com/connectrpc/vanguard-go?tab=readme-ov-file#why-vanguard) veya [gRPC-Gateway](https://github.com/grpc-ecosystem/grpc-gateway#readme) kullanarak sunabilirsiniz.

### Connect HTTP/3 kullanabilir mi?

Evet, ancak tüm Connect uygulamaları HTTP/3 desteğine sahip değildir. Örneğin, Connect Go için bunu [quic-go paketi](https://pkg.go.dev/github.com/quic-go/quic-go/http3) kullanarak gerçekleştirebilirsiniz.

### Neden özel durum unary RPC'leri var?

:::info
Connect protokolü, bir unary RPC ve bir akış için etkili bir şekilde _iki_ protokoldür. Bu entelektüel olarak tatmin edici değil — unary RPC'leri her iki yönde tam olarak bir mesaj gönderilen iki yönlü bir akış olarak ele almak daha saf olurdu. Pratikte, saflık kaybının buna değdiğini bulduk.
:::

Standart HTTP sıkıştırma müzakeresini kullanarak ve gövde içindeki ikili çerçeveyi ortadan kaldırarak, Connect protokolü bize web tarayıcıları, cURL veya diğer herhangi bir HTTP istemcisi ile unary RPC'ler yapma imkanı tanıyor.

### Mevcut gRPC sunucularını çağırmak için Connect protokolünü nasıl kullanabilirim?

Çoğu Connect uygulanımı gRPC protokolünü desteklediğinden, seçim yapma şansınız var:

- Connect çalışma zamanını kullanın, ancak istemcinizi gRPC protokolünü kullanacak şekilde yapılandırın veya
- Connect çalışma zamanını ve Connect protokolünü kullanın ve Envoy'un otomatik olarak Connect-gRPC çevirisini yapmasını sağlayın. Envoy, popüler ve yaygın olarak kullanılan bir proxy'dir.

Envoy v1.26, istemcilerin mevcut gRPC sunucularına Connect protokolü (GET istekleri dahil) ile konuşmalarına izin veren Connect-gRPC köprüsüyle birlikte gelir. Bir demoyu burada bulabilirsiniz: https://github.com/connectrpc/envoy-demo

### Bir web tarayıcısındaki sunucu akış RPC'sini güvenilir bir şekilde nasıl arayabilirim?

Cevap, ilgili tüm ağ taraflarına bağlıdır. Genel olarak, sunucunuzun veya altyapınızın, aramanın beklenen süresi içinde zaman aşımı uygulamadığından emin olun. Mümkünse, kısa son tarihler belirleyerek ve son tarih aşıldığında çağrıyı tekrar ederek zaman aşımını önleyin. Etkileri hakkında bir fikir edinmek için `akış belgelerini` okuyun.

### Connect protokolünü NGINX üzerinden nasıl proxyleyebilirim?

Connect protokolü ile yapılan istek-yanıt (unary) RPC'leri, uçtan uca HTTP/2 gerektirmediğinden NGINX üzerinden proxylenebilir. Akış RPC'leri genellikle uçtan uca HTTP/2 gerektirir ve NGINX bunu desteklemez. NGINX yerine, Envoy, Apache veya HAProxy gibi TCP düzeyinde yük dengeleyicileri kullanmanızı öneririz; bunların hepsi tam Connect protokolünü destekler.

### Yarı çift yönlü akışların unary ve akış bileşeni var mı?

Hayır. Yarı çift yönlü, sunucu akış ve istemci akışı, akış RPC davranışıyla tanımlanır. Mesajlar, hem istek hem de yanıt için bağlı mesajlar olarak Connect akış kablolama anlamında kodlanacaktır.

### Neden HTTP durum kodları kullanılmıyor?

:::warning
Her hata taksonomisi kusurludur, ancak en azından HTTP durum kodları zamanla test edilmiştir ve geniş bir şekilde anlaşılmaktadır. Mükemmel bir dünyada, Connect protokolü için HTTP durum kodlarını birebir kullanırdık. Ne yazık ki, Connect işleyicilerinin ve istemcilerinin gRPC kablo protokollerini kod değişiklikleri yapmadan desteklemesini istiyoruz. 
:::

gRPC ve HTTP durum kodları arasındaki eşleme kayıplı olduğu için, aynı kod setini benimsemeden kabul edilebilir bir gRPC deneyimi sunamayız. C'est la vie.

### Neden Twirp protokolü kullanılmıyor?

[Twirp protokolunu](https://github.com/twitchtv/twirp) gerçekten seviyoruz! Basit, herhangi bir HTTP/2'ye özgü çerçeveye dayanmaz ve genel amaçlı HTTP araçlarıyla güzel çalışır. Ne yazık ki, ihtiyaçlarımızı karşılamadı:

- Akış RPC'lerini desteklemiyor. Çoğu RPC unary olmasına rağmen, birçok organizasyonun akış avantajı sağlayan birkaç API'si var.
- gRPC ile anlamsal olarak uyumsuz. Twirp, zaman aşımı kodlama yöntemlerini belirlemediğinden ve çok farklı bir hata modeline sahip olduğundan, protokoller arasında geçiş yapmak önemli kod değişikliklerini gerektiriyor.

Sonuçta, gRPC ve gRPC-Web uyumluluğunu Twirp desteğinden daha önde tuttuk. Connect’in unary protokolünün esasen çoğu Twirp sihrini yakaladığına inanıyoruz ama yine de kodunuzun daha büyük gRPC ekosistemi ile işbirliği yapmasına izin veriyoruz.

### Connect RPC, Envoy'i destekliyor mu?

Evet, birkaç yolla Envoy desteği sunuyor:

- gRPC ve Connect-Go kullanıyorsanız, yerleşik gRPC desteği vardır.
- Connect-gRPC, bir [Envoy filtrasyonu](https://github.com/connectrpc/envoy-demo) sunar.
- Connect-Go, [grpchealth-go](https://github.com/connectrpc/grpchealth-go) üzerinden gRPC sağlık kontrolünü destekler.

### Web isteğim başarısız oluyor ama yanıt geçerli görünüyor. Neden geçmiyor?

Bir sayfanın alanı dışından kaynakları yüklemeye çalışan web isteği, Cross-Origin Resource Sharing (CORS) yapılandırmasını gerektirir. Bunu yapmamak, "trailer eksik" gibi protokol hatalarına neden olabilir. Yanıt geçerliyse ve istek farklı bir alan içinse, sunucunun doğru `CORS yapılandırmasına` sahip olduğundan emin olun.

### Sunucumdan hata kodunu neden almıyorum?

Çoğu zaman, bu sunucunun CORS ayarının eksik olmasından kaynaklanır. İstek kaynağını, yöntemleri ve başlıkları izin vermek yeterli değil - aynı zamanda yanıt başlıklarını da açmalısınız. Ayrıntılar için `CORS belgelerini` inceleyin.

### Tarayıcıdaki ağ gözlemcisi yük içinde neden garip karakterler gösteriyor?

Protobuf ikili formatı etkilidir ancak tarayıcı tarafından metin olarak render edilemez. Bir Connect-ES istemcisi kullanıyorsanız, sorun gidermeyi kolaylaştırmak için `taşıma seçeneği` `useBinaryFormat: false` ile JSON'a geçebilirsiniz. Unary RPC'ler Connect protokolü ile saf JSON yükleri kullanır.

## Serileştirme ve sıkıştırma

### Neden sayılar JSON'da dizgiler olarak serileştiriliyor?

JavaScript'in `Number`'ı IEEE 754 çift hassasiyetli hareketli nokta; 64 bit bellek kaplasa da, sayının kesirli kısmı için alan ayrılmıştır. 64 bit tam sayıları temsil etmek için yeterli alan kalmaz! Tam sayıların doğru bir şekilde ele alınmasını sağlamak için Protobuf JSON eşlemesi `int64`, `fixed64` ve `uint64` türlerini dizgiler olarak temsil eder.

Bu, yalnızca cURL, tarayıcının `fetch` API'si veya diğer düz HTTP araçları ile yapılan aramalarda etkilidir. Connect istemcileri sayısal değerleri otomatik olarak dizgilerden ve dizgilere dönüştürür.

### Bilinmeyen JSON alanları neden görmezden geliniyor?

[proto3 dil kılavuzunu](https://protobuf.dev/programming-guides/proto3/#json-options) takip eden bir JSON ayrıştırıcısı, bilinmeyen alanları varsayılan olarak reddetmelidir. Ancak, bu davranışın RPC için pratik olmadığını gördük çünkü bu, şemanın mevcut istemcileri kırmadan gelişmesini engelliyor: yalnızca bir yanıta alan eklemek eski istemcileri kıracaktır. Bu nedenle, Connect istemcileri ve sunucuları, temel uygulama izin veriyorsa bilinmeyen alanları görmezden gelir.

## Go

### Neden jenerik kullanılır?

Jenerik kod, özünde jeneriksiz koda göre daha karmaşıktır. Yine de, Connect-Go'ya jeneriklerin eklenmesi iki önemli karmaşıklık kaynağını ortadan kaldırdı:

- Jenerikler, özellikle akış RPC'leri için daha az kod üretmemizi sağlıyor - bazı uzun URL'leri yazmayı göze alıyorsanız, artık `protoc-gen-connect-go` olmadan Connect kullanmak bu kadar kolay. `BidirectionalStream` gibi jenerik akış türleri, eşdeğer kod üretim şablonlarından çok daha net.
- Bağlamla hiçbir değer sağlamaya gerek yoktur, çünkü Connect'in jenerik `Request` ve `Response` yapı taşları başlıkları ve trailer'ları açıkça taşır. Bu, veri akışını belirgin hale getirir ve içe ve dışa bağımlı meta verilerle ilgili herhangi bir karışıklığı önler.

Dengeli bir şekilde, Connect-Go'yu jenerikler ile daha basit buluyoruz.

### Neden Connect'e özel paketler oluşturuluyor?

Eğer Protobuf ile tanışık iseniz, `protoc-gen-connect-go`'nun birçok diğer eklentiden biraz farklı davrandığını fark etmiş olmalısınız: temel mesaj türlerinin yanına kod eklemek yerine, ayrı bir Connect'e özel Go paketi oluşturur ve temel türleri içe aktarır.

Bu birkaç amaca hizmet eder:

- Temel türleri hafif tutar, böylece Protobuf mesajlarıyla çalışan _her_ paket bir RPC çerçevesi taşımak zorunda kalmaz.
- İsim çakışmalarını önler. Birçok Protobuf eklentisi - `protoc-gen-go-grpc` dahil - kodu temel türlerin yanına oluşturur ve bu nedenle paket ad alanı çok kalabalık hale gelir.
- Temel türler paketinin içeriğini sabit tutar. Bu, yerel olarak kod üretirken kritik değildir, ancak [oluşturulan SDK'ların](https://buf.build/connectrpc/eliza) ve [uzaktan eklentilerin](https://buf.build/connectrpc/eliza) çalışması için kritik öneme sahiptir.

### Connect-Go istemcileri, WASM ile tarayıcı uygulamalarında kullanılabilir mi?

Teknik olarak mümkündür, ancak Go'daki WASM'ın oldukça yeni olduğunu ve mimarinin bazı temel sınırlamaları olabileceğini unutmayın. Denemenizi öneririz ve karşılaştığınız sorunları Go veya Connect-Go'ya bildirerek Go üzerinde WASM'ı ilerletmeye yardımcı olabilirsiniz.

### Neden X saniye sonra "stream error: stream ID 5; INTERNAL_ERROR; received from peer" hata mesajı alıyorum? {#stream-error}

Bu, [http.Server](https://pkg.go.dev/net/http#Server) nesnenizin `ReadTimeout` veya `WriteTimeout` alanları yapılandırıldığını gösterir. Bu alanlar, akış çağrıları için bile tüm işlem süresine uygulanır. Bir işlem, belirtilen değerden daha uzun sürerse, sunucu akışı kapatır ve istemciler yukarıdaki hata mesajını görebilir. Diğer zaman aşımı alanları bu hataya neden olmayacaktır ve özellikle `ReadHeaderTimeout` değerini ayarlamanızı öneririz.

### Connect-Go'da bir istemci yanıt akışını nasıl kapatabilirim?

Yanıtı okurken, bir istemci her iki yönlü akışlarda `CloseResponse` veya sunucu akışlarında `Close` çağrısı yaparak bağlantıyı nazikçe kapatabilir. Bu, sonunda durum mesajı alınana kadar sunucudan gönderilen herhangi bir kalan mesajı atar. Durum bir hata ise, kapatma işlevi kablo hatasını döndürecektir. Alternatif olarak, işlemi iptal etmek ve istemci akışını hemen durdurmak istiyorsanız, işlemi iptal etmek için `aşağıya` bakın.

### Projem Go'da Buf ve BSR kullanıyor ve şimdi JavaScript stub'ları üretmemiz gerekiyor. Bu proje nasıl yapılandırılmalıdır?

Projeniz bir hizmet uyguluyorsa, yaygın bir yaklaşım Protobuf dosyalarını sunucu uygulamasıyla aynı depoda tutmak ve şemayı BSR'ye otomatik olarak göndermektir. Diğer depolar, istemciler için oluşturulan SDK'lardan tam olarak faydalanabilir ve Protobuf eklentilerini veya hatta Buf CLI'yi bile sürdürmeleri gerekmez.

Basit bir örnek olarak, [examples-go](https://github.com/connectrpc/examples-go) deposuna bakabilirsiniz; bu, Eliza hizmetini (basit bir sohbet botu) tanımlar ve bir sunucu uygular. Sunucu 
https://demo.connectrpc.com/ adresinde dağıtılmıştır ve `proto` dizinindeki şema [buf.build/connectrpc/eliza](https://buf.build/connectrpc/eliza) adresine itilmektedir. Ayrıca Go sunucusu ile sohbet edebileceğiniz bir JavaScript istemci uygulaması da içerir. Demo kaynağı halka açıktır, bu yüzden [istemciyi](https://github.com/connectrpc/connectrpc.com/blob/main/src/components/eliza-demo/index.tsx) inceleyebilirsiniz. İlginç olan, istemci tarafında oluşturulan SDK'dan yalnızca içe aktarıyor olmamızdır:

```go
import { ElizaService } from "@buf/connectrpc_eliza.bufbuild_es/connectrpc/eliza/v1/eliza_pb";
```

### Connect-Go, sunuculara bağlanırken gRPC'nin `WithBlock` seçeneğinin eşdeğerini sağlar mı?

Hayır, çünkü arka planda Connect-Go sadece bir `*http.Client` kullanıyor, ancak benzeri işlevselliği Connect-Go'ya eklemeyi değerlendiriyoruz. Bu sırada, [github.com/bufbuild/httplb] adresine göz atabilirsiniz. Bu, Connect'e özgü olmayan bir `*http.Client`, ancak RPC kullanmanın birçok zorluğuyla başa çıkar, özellikle de k8s kullanıyorsanız. Bunun hala Alpha aşamasında olduğunu ve API'lerin kararsız olduğunu unutmayın, ancak önemli olduğu için üzerinde çalışmaya devam ediyoruz.

### Connect-Go'da sunucuda Connect protokolü devre dışı bırakılabilir mi?

Şu anda desteklenen bir seçenek değildir. Şimdilik bir çözüm olarak, isteği grpc/grpcWeb isteği olarak sınıflandırmak için içerik türünü inceleyebilir ve aksi takdirde `415 Unsupported Media Type` durumu döndürebilirsiniz. İşte HTTP middleware'deki bir örnek:

```
func grpcOnlyMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/grpc") {
			w.WriteHeader(http.StatusUnsupportedMediaType)
			return
		}
		next.ServeHTTP(w, r)
	})
}
```

### Connect sunucusu tarafından döndürülen serileştirme hatalarını nasıl özelleştiririm?

Farklı bir `Codec` sağlayarak hata mesajını özelleştirebilirsiniz. Kod ve ayrıntılar özelleştirilemez.

### Connect-Go'da `EmitUnpopulated` gibi özel JSON seçeneklerini nasıl kullanabilirim?

Bu seçenekleri kod çözücüyü özelleştirerek kullanabilirsiniz. [connectproto](https://github.com/akshayjshah/connectproto) bu konuda yardımcı bir projedir.

### Connect-go'da akış uç noktalarının nazik kapatılması manuel olarak mı yapılmalıdır?

Evet. [`http.Server.Shutdown`](https://pkg.go.dev/net/http#Server.Shutdown) yönteminin belgelerinde bu konuda özel bir not bulunmaktadır:

> Shutdown, WebSocket gibi kaçırılmış bağlantıları kapatmayı veya beklemeyi denemez. Shutdown çağrısını yapan, arzu edilirse böyle uzun süreli bağlantılara kapatma bildiriminde bulunmalı ve kapanmalarını beklemelidir. Kapatma bildirim işlevlerini kaydetmek için [Server.RegisterOnShutdown](https://pkg.go.dev/net/http#Server.RegisterOnShutdown) kullanabilirsiniz.

Aynı prensip gRPC akışlarına uygulanır. İstemcilerinizde akışları beklerken istek bağlamını ve başka bir global sunucu bağlamını dinleyebilirsiniz. Eğer `Server.RegisterOnShutdown()` yönteminiz o global sunucu bağlamını iptal ederse, tüm işleyicilerinizin sunucu kapatılması nedeniyle isteğin yakında tamamlanacağı konusunda bilgi sahibi olur.

Tekrar belirtelim, `Shutdown()` tüm istek bağlamlarını iptal etmez. Bunun yerine, mevcut isteklerin normal olarak sona ermesine izin verirken yeni bağlantıları kabul etmeyi durdurur — "nazikçe" kapatır.

### `google.protobuf.Any` için türleri nasıl içe aktarabilirim?

Hizmetin yöntemleri tarafından tanımlanmayan türler erişilebilirliğini sağlamak için belirtilmesi gerekebilir. Bu, bazen `google.protobuf.Any` hata ile karşılaşmadan dizgiyi açıklayamayabilir. Mesajın kullanılabilir olmasını sağlamak için, türü, dilinizin çalışma zamanı için tanımlayıcı kaydına ekleyin.  

En pratik yaklaşım, genel tür kaydını kullanmak ve üretilen Protobuf mesajını boş bir içe aktarma ile kullanmaktır. Örneğin, üretilen `proto/path/mytype.pb.go` dosyasıyla, türün kayıtlı olmasını sağlamak için `import _ proto/path/mytype.pb.go` şeklinde bir Go içe aktarma ekleyin.

Sadece çalışma zamanı açısından erişilebilir türler için, dinamik olarak mesaj eklemek için [protoregistry belgelerini](https://pkg.go.dev/google.golang.org/protobuf@v1.33.0/reflect/protoregistry) inceleyin.

## TypeScript ve JavaScript

### gRPC arka uçlarını aramak için neden bir proxyye ihtiyacım var?

HTTP protokol spesifikasyonu on yıllardır trailerları içermektedir. Pratikte, bunlar nadiren kullanıldı. Birçok HTTP uygulaması — web tarayıcıları da dahil — hala trailerları desteklememektedir.

Ne yazık ki, gRPC, HTTP trailerları yoğun bir şekilde kullanmaktadır. Tarayıcılar trailerları desteklemediğinden, tarayıcıda çalışan hiç bir kod gRPC protokolünü konuşamaz. Bu sorunu aşmak için, gRPC ekibi, yanıt gövdesinin sonuna trailerları kodlayan gRPC-Web protokolünü tanıttı. 

Bazı gRPC sunucuları (Connect-Go ile yapılanlar dahil) gRPC-Web protokolünü yerel olarak desteklemektedir, bu yüzden tarayıcılar doğrudan arka uçlarınızla iletişim kurabilir. Çoğu Google gRPC uygulaması gRPC-Web'i desteklemediğinden, standart gRPC protokolünden çevirmek için Envoy gibi bir proxy çalıştırmanız gerekir.

### Akış destekleniyor mu?

Connect protokolü _tüm_ akış RPC türlerini desteklemektedir, ancak web tarayıcılarının istemci akışıyla ilgili bazı sınırlamaları vardır. Ayrıntılar için `Web için Connect` bölümüne bakın.

### Üretilen kod, paket boyutunu etkiler mi?

Evet, üretilen kod paket boyutunu etkilemektedir, ancak tarayıcı uygulaması, standart Web API'lerini kullanan ince bir kütüphane olup, kasten `çok az kod üretiyor`. ELIZA istemcisi için, sıkıştırılmış paket boyutu [yalnızca 13KiB civarında](https://github.com/connectrpc/connect-es/tree/main/packages/connect-web-bench)dir.

### Connect, gRPC-web ile nasıl karşılaştırılır?

Connect ile gRPC servisinizi gRPC-web olarak sunmak için bir proxyye ihtiyacınız yoktur ve TypeScript kutudan çıkıldığı gibi desteklenmektedir. İsteklerde gözden geçirilmesi kolaydır çünkü varsayılan olarak JSON formatı kullanılmakta olup gRPC-web yalnızca ikili formatı desteklemektedir.

Bu durumda, Connect gRPC-web protokolü için destekle birlikte gelmekte ve mevcut gRPC-web arka uçlarıyla tamamen uyumlu hale gelmektedir. [Bir protokol seçme](https://docs/web/choosing-a-protocol) bölümüne bakın.

### Connect için TypeScript için hangi Protobuf çalışma zamanı kullanılır?

Connect, [Protobuf-ES](https://github.com/bufbuild/protobuf-es) tarafından sağlanan Protobuf çalışma zamanını kullanır. Ayrıca, Connect-ES için kullanılan kod jeneratörü eklentisi de Protobuf-ES tarafından sağlanan eklenti çerçevesine dayanmaktadır. Bu kütüphane ile ilgili herhangi bir sorunuz varsa, [Protobuf-ES SSS sayfasını](https://github.com/bufbuild/protobuf-es/blob/main/docs/faq.md) ziyaret edin.

#### JavaScript için tanımcı kaydına türleri nasıl ekleyebilirim?

Şemanızdaki bir RPC, bir istek veya yanıt mesajında `google.protobuf.Any` kullanıyorsa, bunların JSON'a ayrıştırılabilmesi veya serileştirilmesi için bir tür kaydı sağlayabilirsiniz. Detaylı açıklama ve örnek için [bu GitHub tartışmasına](https://github.com/connectrpc/connect-es/discussions/689#discussioncomment-6280653) göz atabilirsiniz.

### Sunucuda bir çerez nasıl ayarlayabilirim?

Sunucudaki her servis yöntemi, yanıt başlıklarına erişim sağlayan ikinci bir argüman olarak `HandlerContext` alır. Çerezleri `Set-Cookie` yanıt başlığı ile ayarlayabilirsiniz — örneğin:

```
ctx.responseHeader.append("Set-Cookie", "foo=bar; Max=Age=120")
```

### Parcel, içe aktarmaları çözmede başarısız oluyor

Connect-ES ve Protobuf-ES, [paket dışa aktarımlarını](https://nodejs.org/docs/latest-v12.x/api/packages.html#packages_exports) kullanır. Eğer Parcel ile şu hatayı alıyorsanız, [paket dışa aktarmalarını](https://parceljs.org/features/dependency-resolution/#package-exports) etkinleştirdiğinizden emin olun:

```
@parcel/core: Failed to resolve '@bufbuild/protobuf/codegenv1'
```