---
title: Araçlar
seoTitle: API ve Akış Yönetim Araçları
sidebar_position: 6
description: Araçlar, APIlerin ve akışların başlıkları, verileri, sonlandırıcıları ve hataları gözlemlemesi ve müdahale etmesi için güçlü bir yol sunar. Her istek için bir kez oluşturularak istemci tarafından çağrılan bir dizi closure sağlar.
tags: 
  - API
  - Akış
  - Geliştirme
  - Araçlar
keywords: 
  - API
  - Akış
  - Geliştirme
  - Araçlar
---
Araçlar, hem tekil API'ler hem de akışlar için dışa ve içe doğru başlıkları, verileri, sonlandırıcıları ve hataları gözlemlemenin ve bunlara müdahale etmenin güçlü bir yoludur.

Bir araç, **her istek için bir kez** oluşturulur ve bu isteğin yaşam döngüsü boyunca istemci tarafından çağrılan bir dizi closure sağlar. Her closure, aracın durumu gözlemlemesine ve saklamasına olanak tanırken, dışa veya içe doğru içeriği değiştirme seçeneğini de sunar.

:::tip
Örneğin, `demo.connectrpc.com` ana bilgisayarına giden tüm dışa doğru istekler için bir `Authorization` başlığı ekleyen bir araç aşağıda gösterilmiştir.
:::

```kotlin
import com.connectrpc.Interceptor
import com.connectrpc.StreamFunction
import com.connectrpc.UnaryFunction
import com.connectrpc.http.HTTPRequest

/// `demo.connectrpc.com`'a giden dışa doğru
/// isteklere bir `Authorization` başlığı ekleyen araç.
class AuthorizationInterceptor : Interceptor {
  override fun unaryFunction(): UnaryFunction {
    return UnaryFunction(
      requestFunction = { request ->
        if (request.url.host != "demo.connectrpc.com") {
          return@UnaryFunction request
        }

        val headers = mutableMapOf<String, List<String>>()
        headers.put("Authorization", listOf("SOME_USER_TOKEN"))
        return@UnaryFunction HTTPRequest(
          url = request.url,
          contentType = request.contentType,
          headers = headers,
          message = request.message
        )
      },
      responseFunction = { resp ->
        resp
      },
    )
  }

  override fun streamFunction(): StreamFunction {
    return StreamFunction(/* code */)
  }
}
```

Araçlar, `ProtocolClient` ile başlatma sırasında kaydedilir:

```kotlin
val client = ProtocolClient(
  httpClient = ConnectOkHttpClient(OkHttpClient()),
  ProtocolClientConfig(
    host = "https://demo.connectrpc.com",
    serializationStrategy = GoogleJavaProtobufStrategy(),
    protocol = Protocol.CONNECT,
    interceptors = listOf({ AuthorizationInterceptor() })
  ),
)
```

:::info
İstemci, daha sonra istek yolunda FIFO sırasına göre, yanıt yolunda ise LIFO sırasına göre her aracı çağıracaktır.
:::

Örneğin, aşağıdaki araçlar kaydedilirse:

```kotlin
val client = ProtocolClient(
  httpClient = ConnectOkHttpClient(OkHttpClient()),
  ProtocolClientConfig(
    host = host,
    serializationStrategy = GoogleJavaProtobufStrategy(),
    protocol = Protocol.CONNECT,
    interceptors = listOf({ A() }, { B() }, { C() }, { D() })
  ),
)
```

Her seferinde istemci tarafından bir istek başlatıldığında oluşturulacak ve aşağıdaki sırayla çağrılacaktır:

```
İstemci -> A -> B -> C -> D -> Sunucu
İstemci <- D <- C <- B <- A <- Sunucu
```