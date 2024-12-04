---
title: Çoklu Protokol Desteği
seoTitle: Çoklu Protokol Desteği - Geliştirici Rehberi
sidebar_position: 15
description: Bu makalede, Connectin HTTP içerik türleri üzerinden birden fazla protokole nasıl destek sağladığı açıklanmaktadır. Farklı protokollerin nasıl kullanılacağı ve geçiş yaparken neler göz önünde bulundurulması gerektiği ele alınmıştır.
tags: 
  - çoklu protokol
  - gRPC
  - Connect
  - HTTP
keywords: 
  - çoklu protokol
  - gRPC
  - Connect
  - HTTP
---
Connect, HTTP İçerik Türleri üzerinde geçiş yaparak birden fazla protokolü destekler: her protokol, sunucuların istemcinin hangi protokolü beklediğini bilmesi için farklı bir tür seti kullanır ve uygun şekilde yanıt verir. gRPC, gRPC-Web ve Connect'in kendi protokolleri aynı anlamlara sahip olduğundan, protokoller arasında geçiş yapmak kod değişiklikleri gerektirmiyor.

:::info
Protobuf şemaları kullandığınızı varsayarsak, gRPC protokolü `application/grpc`, `application/grpc+proto` ve `application/grpc+json` içerik türlerini kullanır. gRPC-Web protokolü ise `application/grpc-web`, `application/grpc-web+proto` ve `application/grpc-web+json` içerik türlerini kullanır.
:::

Tekrar Protobuf şemaları varsayarak, `Connect protokolü` tekil RPC'ler için `application/proto` ve `application/json` içerik türlerini kullanır. Akış için `application/connect+proto` ve `application/connect+json` kullanır.

## Uyumlu Anlamlar

Bu yaklaşım, üç protokolün de uyumlu anlamlar taşımasına dayanır: aynı bilgiyi farklı HTTP gelenekleri aracılığıyla iletiyorlar, bu nedenle protokol sadece bir uygulama ayrıntısıdır. Özellikle, üç protokol de aşağıdakileri destekler:

- Takılabilir serileştirme ve sıkıştırma.
- Tekil RPC'ler ve üç akış türü.
- Zaman aşımı.
- Başlıklar ve son ekler (ancak gRPC-Web ve Connect protokolü son ekleri yanıt gövdesinin son bölümüne kodlar).
- Bir kod, mesaj ve güçlü-şekilli detaylardan oluşan hatalar.

:::tip
API'lerini bu kavramlar etrafında organize ederek ve protokollere doğrudan referanslardan kaçınarak, Connect uygulamaları protokoller arasında özgürce geçiş yapmanıza olanak tanır.
:::