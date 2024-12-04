---
title: GET İstekleri ve Önbellekleme
seoTitle: HTTP GET Requests and Caching
sidebar_position: 4
description: Bu sayfa, HTTP GET isteklerini işlemek ve önbellekleme ile ilgili ayrıntılı bilgiler sunmaktadır. Sunucuların yapılandırılması ve istemci ayarları hakkında bilgi edinin.
tags: 
  - HTTP
  - GET
  - caching
  - Connect
  - developers
keywords: 
  - HTTP request
  - caching
  - Connect
  - GET method
  - web development
---
Connect, idempotent, yan etki oluşturmayacak isteklerin HTTP GET tabanlı protokol kullanılarak gerçekleştirilmesini destekler. Bu, belirli türdeki isteklerin tarayıcıda, CDN'inizde veya proxyler ve diğer ara kutularda önbelleğe alınmasını kolaylaştırır.

Öncelikle, sunucunuzu Connect kullanarak HTTP GET isteklerini işlemek üzere yapılandırın. Sunucunuza karşılık gelen belgeleri inceleyin:

* `Connect Go`
* `Connect Node`

:::tip
Sorgu tarzı istekler yapmak için istemcileri kullanıyorsanız, Connect HTTP GET istek desteğini kullanabilme yeteneğine sahip olmak isteyebilirsiniz.
:::

Belirli bir prosedürü seçmek için, onu yan etki oluşturmayan olarak işaretlemeniz gerekir; bu, [`MethodOptions.IdempotencyLevel`][idempotency-level] seçeneği ile yapılır:

```protobuf
service ElizaService {
  rpc Say(stream SayRequest) returns (SayResponse) {
    option idempotency_level = NO_SIDE_EFFECTS;
  }
}
```

İstemciler varsayılan olarak otomatik olarak GET isteklerini kullanmayacaktır. Bunu yapmak için, `ProtocolClientConfig` ayarınızı etkinleştirilmiş `GETConfiguration` ile güncellemeniz gerekecektir.

```kotlin
val config = ProtocolClientConfig(
  getConfiguration = GETConfiguration.Enabled,
  ...
)
```

[idempotency-level]: https://github.com/protocolbuffers/protobuf/blob/e5679c01e8f47e8a5e7172444676bda1c2ada875/src/google/protobuf/descriptor.proto#L795