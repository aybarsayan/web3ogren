---
title: Araçlar
seoTitle: API Araçları ile Gözlemleme ve Değiştirme
sidebar_position: 5
description: Araçlar, APIler üzerindeki giriş ve çıkış işlemlerini yönetmek için güçlü bir mekanizmadır. Her aracın kendine özgü fonksiyonları vardır, bu sayede asenkron şekilde çalışabilirler.
tags: 
  - API
  - Middleware
  - Asenkron
  - Gözlemleme
  - Değiştirme
keywords: 
  - araçlar
  - istemci
  - interceptor
  - mesaj
  - serileştirme
---
Araçlar, çıkış ve giriş başlıklarını, verileri, takasları, tipli mesajları ve hataları, hem unary API'ler hem de akışlar için gözlemleme ve değiştirme konusunda güçlü bir yoldur.

Her bir araç, **her istek veya akış başına bir kez** oluşturulur ve istemci tarafından o çağrının yaşam döngüsü boyunca çağrılan bir dizi fonksiyon sağlar. Her bir fonksiyon, aracın durumu gözlemleyip saklamasına ve çıkış veya giriş içeriğini değiştirmesine olanak tanır. Araçlar, hem tipli mesajlarla (serileştirmeden önceki istek mesajları ve serileştirmeden sonraki yanıt mesajları) hem de ham verilerle etkileşimde bulunma yeteneğine sahiptir.

:::info
Araçların, değiştirilmiş olabilecek bir değeri zincirdeki bir sonraki araca geçirmeden önce asenkron işler yapma fırsatı vardır.
:::

Zincirin sonuna ulaşıldığında, nihai değer ağ istemcisine iletilir; burada sunucuya (çıkış isteği) veya arayan kişiye (giriş yanıtı) gönderilir.

Araçlar ayrıca, çıkış isteklerini gönderilmeden önce başarısız kılabilir; zincirdeki sonraki araçlar çağrılmayacak ve hata orijinal arayana dönecektir.

Araçlar, hem mevcut değeri hem de aracın zincirini devam ettirmek için çağrılması gereken bir kapanışı alır. Bu kapanış çağrılana kadar yayılma devam etmeyecektir. Belirli bir araca, önceden başka bir değerle zinciri devam ettirmemiş olsa bile ek değerler iletilmeye devam edilebilir. Örneğin:

1. Bir istek gönderilir.
2. Yanıt başlıkları alınır ve bir araç zinciri işlem sırasında duraklatılır.
3. Akıştan ilk parça yanıt verisi alınır ve araç bu değerle çağrılır.
4. Araç, önce başlıklarla, ardından verilerle devam etmesi beklenmektedir.

:::tip
Uygulamalar, iş parçacığı güvenli olmalıdır (bu nedenle `Sendable` gereksinimleri), çünkü fonksiyonlar, zincirde mevcut olabilecek diğer araçların asenkron doğası nedeniyle bir isteğin veya akışın süresince farklı iş parçacıklarından çağrılabilir.
:::

Bir örnek olarak, `demo.connectrpc.com` ana bilgisayarı için tüm çıkış isteklerine bir `Authorization` başlığı ekleyen bir araç aşağıda verilmiştir:

```swift
import Connect

/// Asenkron olarak bir auth token'ı alıp ardından çıkış isteklerine `Authorization`
/// başlığı ekleyen araç. Token alma işlemi başarısız olursa, çıkış isteğini reddeder
/// ve orijinal arayana bir hata döndürür.
final class ExampleAuthInterceptor: UnaryInterceptor {
    init(config: ProtocolClientConfig) { /* Opsiyonel kurulum */ }

    @Sendable
    func handleUnaryRequest<Message: ProtobufMessage>(
        _ request: HTTPRequest<Message>,
        proceed: @escaping @Sendable (Result<HTTPRequest<Message>, ConnectError>) -> Void)
    {
        guard request.url.host == "demo.connectrpc.com" else {
            // İsteğin olduğu gibi gönderilmesine izin ver.
            proceed(.success(request))
            return
        }

        fetchUserToken(forPath: request.url.path) { token in
            if let token = token {
                // İsteğin başlıklarını değiştir ve isteği diğer araçlara
                // iletmeden önce sunucuya göndermeyi sağla.
                var headers = request.headers
                headers["Authorization"] = ["Bearer \(token)"]
                proceed(.success(HTTPRequest(
                    url: request.url,
                    headers: headers,
                    message: request.message,
                    trailers: request.trailers
                )))
            } else {
                // Geçerli bir token mevcut değil - isteği reddet ve
                // bir hatayı arayana döndür.
                proceed(.failure(ConnectError(
                    code: .unknown, message: "auth token fetch failed",
                    exception: nil, details: [], metadata: [:]
                )))
            }
        }
    }

    @Sendable
    func handleUnaryResponse<Message: ProtobufMessage>(
        _ response: ResponseMessage<Message>,
        proceed: @escaping @Sendable (ResponseMessage<Message>) -> Void
    ) {
        // Yanıtı gözlemlemek/değiştirmek için kullanılabilir.
        proceed(response)
    }
}
```

Araçlar, `ProtocolClient` ile başlangıçta kaydedilir:

```swift
let client = ProtocolClient(
    httpClient: URLSessionHTTPClient(),
    config: ProtocolClientConfig(
        host: "https://demo.connectrpc.com",
        networkProtocol: .connect,
        codec: ProtoCodec(),
        //highlight-next-line
        interceptors: [InterceptorFactory { ExampleAuthInterceptor(config: $0) }]
    )
)
```

İstemci, istek yolu üzerinde FIFO sırasına göre, yanıt yolu üzerinde ise LIFO sırasına göre her bir aracı çağırır.

:::note
Örneğin, aşağıdaki araçlar kaydedilirse:
```swift
interceptors: [
    InterceptorFactory { A(config: $0) },
    InterceptorFactory { B(config: $0) },
    InterceptorFactory { C(config: $0) },
    InterceptorFactory { D(config: $0) },
]
```
İstemci bir istek başlattığında her seferinde oluşturulacak ve ardından şu sırayla çağrılacaktır:

```
İstemci -> A -> B -> C -> D -> Sunucu
İstemci <- D <- C <- B <- A <- Sunucu
```
:::