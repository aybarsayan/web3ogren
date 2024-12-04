---
title: Hatalar
seoTitle: Hatalar - Connect-Kotlin Protokolü
sidebar_position: 5
description: Connect-Kotlin hata kodları hakkında kapsamlı bilgi. Hatalar, JSON formatında bildirilir ve detaylı hata bilgilerine erişim sağlanır.
tags: 
  - hata kodu
  - JSON
  - Connect-Kotlin
  - API
keywords: 
  - hata
  - protokol
  - ConnectException
  - hata mesajı
---
Connect-Kotlin, `16 hata kodu` kullanır.  
Bunlar daha bilinen "404 Bulunamadı" ve "500 İç Sunucu Hatası" HTTP durum kodlarına benzerdir.

`Connect protokolü` kapsamında, bir hata her zaman JSON formatında iletilir. Örneğin:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "code": "invalid_argument",
    "message": "cümle boş olamaz"
}
```

:::info
Connect-Kotlin, tüm desteklenen protokoller arasında hataları tutarlı bir şekilde temsil eden bir ortak [`ConnectException`][connect-exception-source] türü sağlar.
:::

`ResponseMessage` tarafından döndürülen başarısızlık değerleri, bir `cause` içerir ve akış API'leri, `responseChannel` üzerinden okuma sırasında bir hata meydana gelirse bir ConnectException fırlatır:

```kotlin
val request = SayRequest(sentence = sentence)
val response = elizaClient.say(request)
response.failure {
  print(it.cause.code) // Code.INVALID_ARGUMENT
  print(it.cause.message) // "cümle boş olamaz"
  print(it.cause.metadata) // Sunucu tarafından sağlanan ek başlıklar/trailerların sözlüğü
}
```

## Hata ayrıntıları

Ekstra güçlü tipli hatalar `sunucu tarafından yanıtlarda belirtilmiş olabilir`.  
Bunlar `google.protobuf.Any` tipinde sarılır ve `ConnectException.unpackedDetails()` fonksiyonu kullanılarak beklenen hata mesajı sınıf türü belirtilerek açılabilir:

```kotlin
val request = SayRequest(sentence = sentence)
val response = elizaClient.say(request)
response.failure {
  val errorDetails = it.cause.unpackedDetails(ErrorDetail::class)
  // ErrorDetail ile çalışın.
}
```

## İptal

Oluşturulan yöntemlerin imzasında `suspend` anahtar kelimesi bulunur. Bu, Kotlin coroutine bağlamı iptal edildiğinde alttaki isteği iptal edecektir.

Geri çağırma tekil imzasıyla sonuç, kullanıcıya bir isteği manuel olarak iptal etme kontrolü vermek için bir iptal oluşturucudur:

```kotlin
val request = sayRequest { sentence = sentence }
val cancel = elizaServiceClient.say(request) { response ->
  print(response.code) // Code.CANCELED.
}
cancel()
```

[connect-exception-source]: https://github.com/connectrpc/connect-kotlin/blob/main/library/src/main/kotlin/com/connectrpc/ConnectException.kt