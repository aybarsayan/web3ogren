---
title: "HTTP Yanıtı"
description: "HTTP Yanıtı, Fetch API'sinin bir parçasıdır ve fetch() fonksiyonunun bir yanıt kaynağını temsil eder. Bu dökümantasyon, yanıt nesnesinin nasıl oluşturulacağını, özelliklerini ve yöntemlerini detaylı bir şekilde açıklamaktadır."
keywords: [HTTP Yanıtı, Fetch API, Response, yanıt nesnesi, JavaScript, web geliştirme, API]
oldUrl:
  - /deploy/docs/response/
---

[Yanıt](https://developer.mozilla.org/en-US/docs/Web/API/Response) arayüzü Fetch API'sinin bir parçasıdır ve fetch() fonksiyonunun bir yanıt kaynağını temsil eder.

- `Yapıcı`
  - `Parametreler`
- `Özellikler`
- `Yöntemler`
- `Örnek`

## Yapıcı

Response() yapıcısı yeni bir Yanıt örneği oluşturur.

```ts
let response = new Response(body, init);
```

:::tip
Yanıt oluştururken gövde ve başlık bilgilerini doğru bir şekilde ayarlamak, API'nin sağlıklı çalışması için önemlidir.
:::

#### Parametreler

| ad   | tür                                                                                    | isteğe bağlı | açıklama                                                            |
| ---- | --------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| body | `Blob`, `BufferSource`, `FormData`, `ReadableStream`, `URLSearchParams` veya `USVString` | `doğru`      | Yanıtın gövdesi. Varsayılan değeri `null`'dır.                     |
| init | `ResponseInit`                                                                          | `doğru`      | Yanıtın durumunu ve başlıklarını ayarlamaya olanak tanıyan isteğe bağlı bir nesne. |

Dönüş tipi bir `Response` örneğidir.

##### `ResponseInit`

| ad          | tür                                                  | isteğe bağlı | açıklama                                               |
| ------------| -----------------------------------------------------| ------------ | ----------------------------------------------------- |
| `status`    | `number`                                            | `doğru`      | Yanıtın durum kodu.                                   |
| `statusText`| `string`                                            | `doğru`      | Durum kodunu temsil eden durum mesajı.                |
| `headers`   | `Headers` veya `string[][]` veya `Record` | `yanlış`      | Yanıtın HTTP başlıkları.                              |

## Özellikler

| ad                         | tür              | yalnızca okunur | açıklama                                               |
| -------------------------- | ---------------- | --------------- | ----------------------------------------------------- |
| [`body`][body]             | `ReadableStream` | `doğru`        | Getter, gövde içeriklerinin `ReadableStream`'ini açar. |
| [`bodyUsed`][bodyused]     | `boolean`        | `doğru`        | Gövde içeriğinin okunup okunmadığını gösterir.         |
| [`url`][url]               | `USVString`      | `doğru`        | Yanıtın URL'si.                                      |
| [`headers`][headers]       | `Headers`        | `doğru`        | Yanıtla ilişkili başlıklar.                          |
| [`ok`][ok]                 | `boolean`        | `doğru`        | Yanıtın başarılı olup olmadığını (200-299 durumu) gösterir. |
| [`redirected`][redirected] | `boolean`        | `doğru`        | Yanıtın bir yönlendirme sonucunda olup olmadığını gösterir. |
| [`status`][status]         | `number`         | `doğru`        | Yanıtın durum kodu.                                   |
| [`statusText`][statustext] | `string`         | `doğru`        | Yanıtın durum mesajı.                                 |
| [`type`][type]             | `string`         | `doğru`        | Yanıtın türü.                                         |

:::info
Yanıt nesnesinin `ok` özelliği, yanıtın başarılı olup olmadığını kontrol etmek için sıklıkla kullanılır. Eğer `ok` özelliği `false` ise, yanıt bir hata durumuyla karşılaşmış demektir.
:::

## Yöntemler

| ad                                                 | açıklama                                                                                 |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`arrayBuffer()`][arraybuffer]                     | Gövde akışını tamamlayarak bir `ArrayBuffer` nesnesi döndürür.                         |
| [`blob()`][blob]                                   | Gövde akışını tamamlayarak bir `Blob` nesnesi döndürür.                                |
| [`formData()`][formdata]                           | Gövde akışını tamamlayarak bir `FormData` nesnesi döndürür.                            |
| [`json()`][json]                                   | Gövde akışını tamamlayarak JSON olarak ayrıştırır ve bir JavaScript nesnesi döndürür.   |
| [`text()`][text]                                   | Gövde akışını tamamlayarak bir USVString nesnesi (metin) döndürür.                     |
| [`clone()`][clone]                                 | Yanıt nesnesini kopyalar.                                                              |
| [`error()`][error]                                 | Ağ hatası ile ilişkili yeni bir yanıt nesnesi döndürür.                                 |
| [`redirect(url: string, status?: number)`][redirect] | Verilen URL'ye yönlendiren yeni bir yanıt oluşturur.                                   |

## Örnek

```ts
function handler(_req) {
  // Gövdesi html olan bir yanıt oluştur.
  const response = new Response("<html> Hello </html>", {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });

  console.log(response.status); // 200
  console.log(response.headers.get("content-type")); // text/html

  return response;
}

Deno.serve(handler);
```

:::note
Yanıt nesnesi, hata durumları gibi çeşitli senaryoları ele alacak şekilde tasarlanmalıdır. Böylelikle kullanıcı deneyimi geliştirilebilir.
:::

[clone]: https://developer.mozilla.org/en-US/docs/Web/API/Response/clone
[error]: https://developer.mozilla.org/en-US/docs/Web/API/Response/error
[redirect]: https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect
[body]: https://developer.mozilla.org/en-US/docs/Web/API/Body/body
[bodyused]: https://developer.mozilla.org/en-US/docs/Web/API/Body/bodyUsed
[url]: https://developer.mozilla.org/en-US/docs/Web/API/Request/url
[headers]: https://developer.mozilla.org/en-US/docs/Web/API/Request/headers
[ok]: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
[redirected]: https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected
[status]: https://developer.mozilla.org/en-US/docs/Web/API/Response/status
[statustext]: https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText
[type]: https://developer.mozilla.org/en-US/docs/Web/API/Response/type
[method]: https://developer.mozilla.org/en-US/docs/Web/API/Request/method
[readablestream]: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
[arraybuffer]: https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer
[blob]: https://developer.mozilla.org/en-US/docs/Web/API/Body/blob
[json]: https://developer.mozilla.org/en-US/docs/Web/API/Body/json
[text]: https://developer.mozilla.org/en-US/docs/Web/API/Body/text
[formdata]: https://developer.mozilla.org/en-US/docs/Web/API/Body/formdata