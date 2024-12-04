---
title: Kod Üretimi
seoTitle: Protobuf ile Kod Üretimi
sidebar_position: 2
description: Bu belge, Protobuf şemaları kullanarak kod üretimini ve uzaktan eklentilerin nasıl kullanılacağını özetlemektedir. Ayrıca, kodun nasıl yerel sistemlerde kolayca üretileceğine dair bilgiler sağlamaktadır.
tags: 
  - Protobuf
  - Kod Üretimi
  - Uzaktan Eklentiler
  - Geliştirme
keywords: 
  - Protobuf
  - Kod Üretimi
  - Uzaktan Eklentiler
  - Geliştiriciler
---
Bir [Protobuf][protobuf] şeması, bir hizmeti, onun yöntemlerini (API'lerini) ve bunların istek/yanıt türlerini tanımlayan basit bir dosyadır:

```protobuf
syntax = "proto3";

package connectrpc.eliza.v1;

message SayRequest {
  string sentence = 1;
}

message SayResponse {
  string sentence = 1;
}

service ElizaService {
  rpc Say(SayRequest) returns (SayResponse) {}
}
```

Yukarıdaki tanımın tamamen belgelenmiş bir versiyonu [Buf Schema Registry](https://buf.build/connectrpc/eliza/file/main:connectrpc/eliza/v1/eliza.proto) (BSR) içinde görülebilir.

`rpc` anahtar kelimesi, uzaktan prosedür çağrısını (Remote Procedure Call) ifade eder — uzaktan çağrılabilen bir API yöntemi. Şema, sunucu ve istemci arasında bir **sözleşme** olup verilerin nasıl değiştirileceğini kesin bir şekilde tanımlar.

Şema, kod üreterek hayat bulur. Sunucu için bir arayüz oluşturulur ve mühendis, yöntemleri iş mantığı ile doldurmaya odaklanabilir. İstemci için ise, mühendis sadece istemci yöntemlerini çağırabilir, derleme zamanı tür güvenliği ve serileştirme için üretilen türlere güvenebilir ve uygulama mantığına odaklanabilir.

## Uzaktan Eklentiler

> **Not:** `Eğitimde` yer alan örnek, bu bölümün içeriğinin çoğunu kapsamaktadır.

[Protobuf eklentileri][available-plugins], `.proto` dosyası girdilerini kabul eden ve çeşitli çıktılar (`.kt` dosyaları bu durumda) üreten çalıştırılabilirlerdir. Uzaktan bir makinada üretim yapmak yerel kurulumu kolaylaştırır ve üretimin **izole** bir ortamda gerçekleşmesine olanak tanır. [Buf][buf] kullanacağız, bu Google'ın protobuf derleyicisi için modern bir alternatiftir ve [uzaktan eklentiler][remote-plugins] ile birlikte kullanılacaktır.

Bu, [Buf CLI'sinin][buf-cli] kurulmasını gerektirir:

```bash
brew install bufbuild/buf/buf
```

Yeni bir proje geliştirirken, oluşturulması gereken 2 yeni dosya vardır:

- [`buf.yaml`][buf.yaml]
- [`buf.gen.yaml`][buf.gen.yaml]

İlk dosya olan `buf.yaml`, şu komutla oluşturulabilir:

```bash
buf config init
```

İkinci dosya olan `buf.gen.yaml`, manuel olarak oluşturulmalı ve hangi eklentilerin kod üretmek için kullanılacağını belirtmelidir. Bu dosyanın bir örneği aşağıda gösterilmektedir:

```yaml
version: v2
plugins:
  - remote: buf.build/connectrpc/kotlin
    out: generated
  - remote: buf.build/protocolbuffers/java
    out: generated
```

Bu dosya, [Connect-Kotlin eklentisi][connect-kotlin-plugin] çıktılarının `generated` dizinine yerleştirilmesini belirtir. Bu eklenti, tanımlanan `service` ve `rpc` türlerinden Kotlin arayüzleri ve bunların karşılık gelen uygulamalarını içeren `.kt` dosyaları oluşturur.

Yapılandırma ayrıca, `.java` çıktılarının aynı `generated` dizinine yerleştirileceği [`protocolbuffers/java` eklentisi][java-protobuf-plugin] ile başka bir seçenek grubu içerir. Bu eklenti, `message` ve `enum` gibi Protobuf türlerinden modeller oluşturur.

> **Önemli:** Birlikte, bu iki eklenti gerekli tüm kodu üretir.

> `buf.gen.yaml` içindeki eklentilerin yapılandırılması hakkında ayrıntılar [belgelerde][remote-plugins] bulunabilir ve mevcut uzaktan eklentilerin tam listesi [burada][available-plugins] bulunmaktadır.

Bu yapılandırma dosyaları yerinde olduğunda, kod üretmek için aşağıdaki komutu yürütün:

```bash
buf generate
```

Yukarıdaki yapılandırma ve örnek `eliza.proto` dosyasıyla birlikte, artık `generated` dizininde bazı üretilmiş dosyalar olmalıdır:

```
generated
└── connectrpc
    └── eliza
        └── v1
            ├── ConverseRequest.java
            ├── ConverseRequestOrBuilder.java
            ├── ConverseResponse.java
            ├── ConverseResponseOrBuilder.java
            ├── ElizaProto.java
            ├── ElizaServiceClient.kt
            ├── ElizaServiceClientInterface.kt
            ├── IntroduceRequest.java
            ├── IntroduceRequestOrBuilder.java
            ├── IntroduceResponse.java
            ├── IntroduceResponseOrBuilder.java
            ├── SayRequest.java
            ├── SayRequestOrBuilder.java
            ├── SayResponse.java
            └── SayResponseOrBuilder.java
```

## Üretilen Kodu Kullanma

Bir Gradle projesi için belirli bir dizine doğrudan üretin.

Üretilen kod, hem `Connect` hem de Google Java protobuf kütüphanelerine bağlıdır. Bu bağımlılıkları eklemek için `Başlarken eğitiminde bu adımları takip edin`.

### Üretilen kodu çağırma konusunda rehberlik için, `istemcileri kullanma belgelerine` bakın.

## Üretim Seçenekleri

Aşağıdaki üretim seçenekleri, çıktıların özelleştirilmesi için `buf.gen.yaml` dosyasının `opt` alanında birleştirilebilir:

| **Seçenek**                   | **Tür**  | **Varsayılan** | **Tekrarlanabilir** | **Ayrıntılar**                                  |
|-------------------------------|:--------:|:--------------:|:-------------------:|-------------------------------------------------|
| `generateCallbackMethods`      | Boolean  |   `false`      |         Hayır         | Tekil yöntemler için geri çağrı imzaları üretir. |
| `generateCoroutineMethods`     | Boolean  |   `true`       |         Hayır         | Tekil yöntemler için askıya alma imzaları üretir. |
| `generateBlockingUnaryMethods` | Boolean  |   `false`      |         Hayır         | Tekil yöntemler için engelleyici imzalar üretir. |