---
title: Hatalar
seoTitle: Connect-Swift Hata Kodları
sidebar_position: 4
description: Connect-Swift hata kodlarını ve JSON biçiminde temsil edilişini keşfedin. Detaylı hata bilgileri ve iptal süreçleri hakkında bilgi edinin.
tags: 
  - hata kodları
  - JSON
  - API
  - Connect-Swift
keywords: 
  - hata
  - API hata kodları
  - Connect-Swift
  - örnek
---
Connect-Swift, `16 hata kodu` setini kullanır. Bunlar, muhtemelen aşina olduğunuz "404 Bulunamadı" ve "500 İç Sunucu Hatası" HTTP durum kodlarına benzer.

`Connect protokolünde`, bir hata her zaman JSON biçiminde temsil edilir. Örneğin:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "code": "invalid_argument",
    "message": "cümle boş olamaz"
}
```

Connect-Swift, tüm desteklenen protokoller arasında hataları tutarlı bir şekilde temsil eden bir ortak [`ConnectError`][connect-error-source] türü sağlar.

Tekil API çağrıları tarafından döndürülen `ResponseMessage` değerleri isteğe bağlı bir `ConnectError?` içerir ve akış API'ları tarafından döndürülen `StreamResult` değerleri de bu türü içerebilir:

```swift
let request = SayRequest.with { $0.sentence = sentence }
let response = await elizaClient.say(request: request)
if let error = response.error {
    print(error.code) // Code.invalidArgument
    print(error.message) // "cümle boş olamaz"
    print(error.metadata) // Ek sunucu-provide edilen başlıklar/trailer ile ilgili sözlük
}
```

## Hata detayları

Ek olarak, güçlü biçimlendirilmiş hatalar `server tarafından yanıtlar içinde belirtilmiş olabilir`. Bunlar, kablolu durumda `google.protobuf.Any` türüyle sarılır ve beklenen hata mesajı türünü (`Eliza_V1_ChatError` bu örnekte) belirterek `ConnectError.unpackedDetails()` fonksiyonu kullanılarak ayrıştırılabilir:

```swift
let request = SayRequest.with { $0.sentence = sentence }
let response = await elizaClient.say(request: request)
if let chatErrors: [Eliza_V1_ChatError] = response.error?.unpackedDetails() {
    // Özel hataları işleyin
}
```

## İptal

:::tip
Bir giden isteği iptal etmek (yani, bir async `Task`'ı iptal ederek veya bir geri çağırma tabanlı istek üzerinde `cancel()` çağrısı yaparak) `canceled` hata kodunu içeren bir yanıt almanızı sağlar.
:::

```swift
let request = SayRequest.with { $0.sentence = sentence }
let cancelable = elizaClient.say(request: request) { response in
    print(response.code) // Code.canceled
}
cancelable.cancel()
```

[connect-error-source]: https://github.com/connectrpc/connect-swift/blob/main/Libraries/Connect/Interfaces/ConnectError.swift