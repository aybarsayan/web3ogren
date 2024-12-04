---
title: Connect HTTP Kodlarını Güncelleme
seoTitle: Hedefe Ulaşmak İçin Connect HTTP Kodlarını Güncelleme
sidebar_position: 11
description: Bu belge, Connect protokolünde RPC hata kodlarının HTTP kodları ile daha doğru bir biçimde eşleştirilmesini önermektedir. Değişikliklerin mantığı ve beklenen kullanıcı etkileri üzerinde durulmaktadır.
tags: 
  - Connect
  - RPC
  - HTTP
  - hata kodları
  - gRPC
keywords: 
  - Connect
  - RPC
  - HTTP
  - hata kodları
  - gRPC
---
## 003: Connect HTTP Kodlarını Güncelleme

Bu RFC, Connect protokolünü RPC hata kodları ile HTTP kodları arasında daha doğru bir şekilde geri ve ileri çevirmek üzere güncellemeyi önermektedir. Bu, bazı taşıma düzeyindeki hataları düzeltir ve gRPC ile birlikte çalışabilirliği iyileştirir, ancak Connect istemcilerinin hatalı yanıtları nasıl yorumlayacağını değiştirir.

Protokol spesifikasyonuna önerilen değişiklik [PR 130][pr130] içerisindedir. Bu belge, değişikliğin mantığına ve beklenen son kullanıcı etkisine odaklanmaktadır.

## RPC &rarr; HTTP eşleme

RPC hata kodlarından HTTP kodlarına olan eşlemelerin iki sebepten değişmesini öneriyoruz:

* İki durumda, Connect'in mevcut HTTP 408 kodlarını kullanımı kategorik olarak yanlıştır - bu, istemcinin isteği yeniden denemesi gerektiğini belirtir. Bu kodu, idempotent olmayan RPC'ler için kullanmak, potansiyel olarak ciddi bir hata teşkil etmektedir.
* Ek olarak, mevcut protokol, [`code.proto`][code.proto] dosyasında önerilen eşlemeden sapmaktadır. `code.proto` eşlemesi gRPC tarafından kullanılmamaktadır, ancak Google Cloud Platform ön uçları, gRPC-Gateway, Envoy ve Protobuf ekosistemindeki çeşitli diğer projeler tarafından kullanılmaktadır.

> Çoğu Connect kullanıcısı bu değişiklikleri fark etmeyecektir, çünkü istemciler yanıt gövdesinden açık RPC hata kodlarını okumaktadır. Sunucular, istemcileri ve ara sunucuları otomatik yeniden denemeye teşvik etmeyi bırakacak, bu da ciddi bir hatayı düzeltecektir. Hataların tel üzerinde temsilini değiştirdiğinden, bu teklifin bu kısmı, kullanıcıların günümüzde sahip olduğu herhangi bir HTTP düzeyindeki gözlemlenebilirliği açıkça etkileyecektir.  
> — Kaynak: RFC Teklifleri

## HTTP &rarr; RPC eşleme

HTTP kodlarından RPC kodlarına bazı eşlemeleri kaldırmayı öneriyoruz, böylece Connect'in eşlemesi gRPC'nin eşlemesi ile _özdeş_ hale gelecektir. Bu, kullanıcıların kod değişiklikleri olmadan RPC protokollerini değiştirebileceği vaadini gerçekleştirmeye yardımcı olur.

Yine, çoğu Connect kullanıcısı bu değişiklikleri fark etmeyecektir, çünkü istemciler yanıt gövdesinden RPC hata kodlarını okumaktadır. Ancak, bu, istemcilerin hatalı yanıtları (genellikle yanlış davranan bir ara sunucudan gelen) yorumlamasını değiştirecektir.

[code.proto]: https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto  
[pr130]: https://github.com/connectrpc/connectrpc.com/pull/130