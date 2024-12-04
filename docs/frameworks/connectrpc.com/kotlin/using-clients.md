---
title: Müşteri Kullanımı
seoTitle: Müşteri Kullanımı - Connect-Kotlin
sidebar_position: 3
description: Bu doküman Connect-Kotlin ile desteklenen protokolleri ve istemcilerin kullanımını açıklamaktadır. Ayrıca, korutinler ve geri çağırmalar gibi önemli özellikler hakkında bilgi sunmaktadır.
tags: 
  - Connect-Kotlin
  - Protokoller
  - Korutinler
  - Geri Çağırmalar
keywords: 
  - Connect-Kotlin
  - Protokoller
  - HTTP
  - gRPC
  - Korutinler
  - Geri Çağırmalar
---
## Yapılandırma

### Desteklenen protokoller

Connect-Kotlin şu anda 3 protokolü desteklemektedir:

- Yeni `Connect protokolü`, HTTP/1.1 veya HTTP/2 üzerinden çalışan, basit ve HTTP tabanlı bir protokoldür. gRPC/gRPC-Web'in en iyi özelliklerini, akış da dahil olmak üzere, tüm platformlar, mobil dahil, üzerinde iyi çalışan bir protokole paketler. Varsayılan olarak, JSON ve ikili kodlanmış Protobuf desteklenmektedir.
- [gRPC protokolü][grpc]: Mevcut gRPC hizmetleri ile iletişim kurmak için müşterileri sağlar.
- [gRPC-Web protokolü][grpc-web]: Mevcut gRPC-Web hizmetleri ile iletişim kurmak için müşterileri sağlar. gRPC ve gRPC-Web arasındaki ana fark, gRPC-Web'in protokoldaki HTTP trailer'larını kullanmamasıdır.

:::info
Eğer arka uç hizmetleriniz bugün gRPC kullanıyorsa, [Envoy destek sağlar][envoy-grpc-bridge] Connect ve gRPC-Web protokolleri kullanılarak yapılan istekleri gRPC'ye dönüştürmek için.
:::

Bu protokoller arasında geçiş yapmak, `ProtocolClientConfig`'in `protocol` alanını yapılandırırken tek satırlık basit bir kod değişikliği gerektirir:

```kotlin
val client = ProtocolClient(
  httpClient = ConnectOkHttpClient(OkHttpClient()),
  ProtocolClientConfig(
    host = host,
    serializationStrategy = GoogleJavaProtobufStrategy(),
    protocol = Protocol.CONNECT, // Protocol.GRPC veya Protocol.GRPC_WEB.
  ),
)
```

**Bu Protokol seçeneklerinin birbirini dışladığını unutmayın. Bir istemci örneği yalnızca tek bir protokolle ilişkilendirilebilir. Aynı uygulamada farklı API'lerle her iki protokolü kullanmak için önerilen çözüm, her protokol için özel bir `ProtocolClient` oluşturmaktır.**

### Sıkıştırma

İstek sıkıştırması ve yanıt çözme, veri sıkıştırma ve çözme mantığını içeren sıkıştırma havuzlarını kaydeden seçenekler aracılığıyla sağlanmaktadır. Varsayılan olarak Gzip desteği sağlanır ve ek sıkıştırma algoritmaları [`GzipCompressionPool`][gzip-option] tarafından sağlanan işlevselliği çoğaltarak eklenebilir.

### HTTP yığını

Varsayılan olarak, HTTP ağı [`OkHttp`][okhttp] kullanılarak `ConnectOkHttpClient` sarıcısı üzerinden sağlanmaktadır. Yapılandırıcısı, altında yatan ağ kütüphanesi için kullanılacak bir `OkHttpClient` kabul eder. Ayrıca, `ConnectOkHttpClient`, `HTTPClientInterface`'in sadece OkHttp uygulamasıdır. Tercih edilen başka bir ağ kütüphanesi varsa, Connect-Kotlin ile kullanmak üzere özel bir istemci sağlamak mümkündür!