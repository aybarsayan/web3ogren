---
title: Müşteri Kullanımı
seoTitle: Müşteri Kullanımı - Connect-Swift
sidebar_position: 3
description: Connect-Swift ile müşteri kullanımını öğrenin. Desteklenen protokoller ve istemci yapılandırması hakkında bilgi edinin.
tags: 
  - Connect-Swift
  - Protokoller
  - İstemci Yapılandırması
keywords: 
  - Connect
  - gRPC
  - gRPC-Web
  - İstemci
  - HTTP
---
## Yapılandırma

### Desteklenen protokoller

Connect-Swift şu anda 3 protokolü desteklemektedir:

- Yeni `Connect protokolü`, HTTP/1.1 veya HTTP/2 üzerinden çalışan basit, HTTP tabanlı bir protokoldür. gRPC/gRPC-Web'ün en iyi özelliklerini, akış da dahil olmak üzere, alır ve tüm platformlarda, mobil dahil, iyi çalışan bir protokolde toplar. Varsayılan olarak, JSON ve ikili kodlanmış Protobuf desteklenmektedir.
- [gRPC protokolü][grpc]: Müşterilerin mevcut gRPC servisleriyle iletişim kurmasına olanak tanır.
- [gRPC-Web protokolü][grpc-web]: Müşterilerin mevcut gRPC-Web servisleriyle iletişim kurmasına olanak tanır. gRPC ile gRPC-Web arasındaki ana fark, gRPC-Web'in protokolde HTTP trailerlarını kullanmamasıdır.

Eğer arka uç servisleriniz zaten gRPC kullanıyorsa, 
[Envoy desteği](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/connect_grpc_bridge_filter)
, Connect ve gRPC-Web protokolleri kullanılarak yapılan istekleri gRPC'ye dönüştürmek için sağlanır; bu da Connect-Swift'i SwiftNIO bağımlılığı olmadan kullanmanızı sağlar.

:::tip
**Connect ve gRPC-Web protokolleri arasında geçiş yapmak, `ProtocolClient` yapılandırırken basit bir 1 satırlık değişikliktir:**
:::

```swift
import Connect

let protocolClient = ProtocolClient(
    httpClient: URLSessionHTTPClient(),
    config: ProtocolClientConfig(
        host: "https://demo.connectrpc.com",
        //highlight-next-line
        networkProtocol: .connect, // Veya .grpcWeb
        codec: ProtoCodec()
    )
)
```

gRPC kullanmak için `ConnectNIO` dahil edilmeli ve HTTP istemcisi değiştirilmelidir,
ancak bu da eşit derecede kolaydır:

```swift
import Connect
//highlight-next-line
import ConnectNIO

let host = "https://demo.connectrpc.com"
let protocolClient = ProtocolClient(
    //highlight-next-line
    httpClient: NIOHTTPClient(host: host),
    config: ProtocolClientConfig(
        host: host,
        //highlight-next-line
        networkProtocol: .grpc,
        codec: ProtoCodec()
    )
)
```

**Bu seçeneklerin karşılıklı olarak dışlayıcı olduğunu unutmayın. Eğer
farklı API'lerle farklı protokoller kullanmak istiyorsanız, her bir
protokol için bir `ProtocolClient` oluşturun.**

### İstemci yapılandırması

Gömülü yapılandırma seçenekleri örnekleri arasında isteklere ve
cevaplara gzip sıkıştırma, `interceptor'lar` için destek
ve JSON ile Protobuf ikili kodlamaları arasında geçiş yapabilme yeteneği bulunmaktadır.
Tam yapılandırma seçenekleri listesi
[Connect-Swift deposunda](https://github.com/connectrpc/connect-swift/blob/main/Libraries/Connect/Implementation/ProtocolClientConfig.swift) bulunabilir.

### Sıkıştırma

İstek sıkıştırması ve yanıt açılması, verileri sıkıştırma ve
açma mantığını içeren sıkıştırma havuzları aracılığıyla sağlanır. Varsayılan olarak gzip desteği bulunmaktadır ve ek sıkıştırma algoritmaları desteği sağlamak için
[`GzipCompressionPool`][gzip-pool] tarafından sağlanan işlevselliği çoğaltarak
`ProtocolClientConfig`'e iletebilirsiniz.

### HTTP yığını

Varsayılan olarak, HTTP ağ trafiği `URLSession` üzerinden
`URLSessionHTTPClient` sarıcı ile gerçekleştirilir. `init()`, temel oturumu yapılandırmak için
`URLSessionConfiguration` alır. Ayrıca, istenirse `URLSessionHTTPClient`'in de alt sınıfı oluşturulabilir.

Connect-Swift paketindeki `ConnectNIO` kütüphanesi aynı zamanda
[SwiftNIO](https://github.com/apple/swift-nio) tarafından desteklenen bir `NIOHTTPClient`'i
içermektedir ve bu sayede trailerleri (ki bu, `URLSession` tarafından desteklenmez) işleyebilir.

Özel bir HTTP istemcisi yazmak isterseniz, bu `HTTPClientInterface` protokolüne uyum sağlayarak ve bir `ProtocolClient`'i başlatırken `httpClient` olarak geçerek gerçekleştirilebilir.

## Üretilen istemcilerin kullanımı

### async/await

Üretilen istemciler, Swift’in en son async/await API'lerini destekler, bu da Connect tarafından üretilen kodun async bağlamlarında kullanımını kolaylaştırır.

Varsayılan olarak async arayüzleri sağlanır ve bunlar,
`GenerateAsyncMethods` seçeneği` kullanılarak
yapılandırılabilir:

```swift
import Connect

// ProtocolClient genellikle üretilen istemcilere iletilir.
let protocolClient = ProtocolClient(
    httpClient: URLSessionHTTPClient(),
    config: ProtocolClientConfig(
        host: "https://demo.connectrpc.com", // API'ler için temel URL
        networkProtocol: .connect, // Veya .grpcWeb
        codec: ProtoCodec() // Veya JSONCodec()
    )
)
let elizaClient = Eliza_V1_ElizaServiceClient(client: protocolClient)

...

// Async bağlamında gerçekleştirilir.
let request = Eliza_V1_SayRequest.with { $0.sentence = "hello world" }
let response = await elizaClient.say(request: request, headers: [:])
print(response.message?.sentence)
```

Sunucu akış RPC'leri için, istemcideki ilgili yöntem bir
`*AsyncStream` nesnesi döndürür; bu, çağıranın akış üzerinden veri göndermesine ve
sunucudan güncellemeleri almak için `for await...in` ifadesini kullanmasına olanak tanır:

```swift
let stream = elizaClient.converse(headers: [:])
Task {
    for await result in stream.results() {
        switch result {
        case .headers(let headers):
            ...
        case .message(let message):
            ...
        case .complete(let code, let error, let trailers):
            ...
        }
    }
}

let request = ConverseRequest.with { $0.sentence = "hello world" }
try stream.send(request)
```

### Geri çağrılar

Eğer bir geri çağrı tabanlı yaklaşım tercih ediyorsanız, geri çağrılar/kapanışlar kullanılabilir.

Bu arayüzler varsayılan olarak üretilmez, ancak
`GenerateCallbackMethods` seçeneği` kullanılarak
yapılandırılabilir:

```swift
import Connect

// ProtocolClient genellikle üretilen istemcilere iletilir.
let protocolClient = ProtocolClient(
    httpClient: URLSessionHTTPClient(),
    config: ProtocolClientConfig(
        host: "https://demo.connectrpc.com", // API'ler için temel URL
        networkProtocol: .connect, // Veya .grpcWeb
        codec: ProtoCodec() // Veya JSONCodec()
    )
)
let elizaClient = Eliza_V1_ElizaServiceClient(client: protocolClient)

...

let request = Eliza_V1_SayRequest.with { $0.sentence = "hello world" }
let cancelable = elizaClient.say(request: request, headers: [:]) { response in
    print(response.message?.sentence)
}

// cancelable.cancel()
```

Sunucu akış RPC'leri için, istemcideki ilgili yöntem her sunucu güncellemesi alındığında çağrılan bir `onResult` kapanışı alır ve akışta veri göndermeye izin veren bir `*Stream` nesnesi döndürür:

```swift
let stream = elizaClient.converse(onResult: { result in
    switch result {
    case .headers(let headers):
        ...
    case .message(let message):
        ...
    case .complete(let code, let error, let trailers):
        ...
    }
})

let request = ConverseRequest.with { $0.sentence = "hello world" }
try stream.send(request)
...
stream.close()
```

[envoy-grpc-bridge]: https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/connect_grpc_bridge_filter
[grpc]: https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md
[grpc-web]: https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md
[gzip-pool]: https://github.com/connectrpc/connect-swift/blob/main/Libraries/Connect/Implementation/Compression/GzipCompressionPool.swift
[protocol-client-config]: https://github.com/connectrpc/connect-swift/blob/main/Libraries/Connect/Implementation/ProtocolClientConfig.swift