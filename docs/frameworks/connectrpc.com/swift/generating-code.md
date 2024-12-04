---
title: Kod Üretme
seoTitle: Protobuf Şeması ile Kod Üretme
sidebar_position: 2
description: Bu belge, Protobuf şeması kullanarak nasıl kod üretebileceğinizi açıklar. Uzak ve yerel eklentilerin kurulumu ve kullanımı hakkında bilgi verilmektedir.
tags: 
  - Protobuf
  - Kod Üretimi
  - Eklentiler
  - Swift
  - Geliştirici
keywords: 
  - Protobuf
  - Kod Üretimi
  - Eklentiler
  - Swift
  - Geliştirici
---
Bir [Protobuf][protobuf] şeması, bir hizmeti, yöntemlerini (API'ler) ve bunların istek/yanıt türlerini tanımlayan basit bir dosyadır:

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

Yukarıdaki tanımın tam belgeli sürümü [Buf Şema Kaydı](https://buf.build/connectrpc/eliza/file/main:connectrpc/eliza/v1/eliza.proto) (BSR) üzerinde görülebilir.

`rpc` anahtar kelimesi, uzaktan çağrılabilen bir API yöntemini temsil eder. Şema, sunucu ve istemci arasında bir sözleşmedir ve verilerin nasıl değiştirileceğini kesin olarak tanımlar.

Şema, kod üreterek hayata geçer. Sunucu için bir arayüz üretilir ve mühendis, yöntemleri iş mantığı ile doldurmaya odaklanabilir. İstemci için ise yapılacak başka bir şey yoktur — mühendis, yalnızca istemci yöntemlerini çağırabilir, derleme zamanında tür güvenliği ve serileştirme için üretilen türlere güvenebilir ve uygulama mantığına odaklanabilir.