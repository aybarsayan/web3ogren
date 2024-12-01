---
title: "HTTP İsteği"
description: Fetch API'nin bir parçası olan Request arayüzünü keşfedin, bu nesnenin nasıl oluşturulacağını ve kullanıldığını öğrenin. Özellikleri ve yöntemleri ile örnek kodları dahil edilmektedir.
keywords: [Fetch API, HTTP Request, Request Interface, JavaScript, Web API]
---

[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) arayüzü, Fetch API'nin bir parçasıdır ve fetch() isteğini temsil eder.

- `Konstrüktör`
  - `Parametreler`
- `Özellikler`
- `Metotlar`
- `Örnek`

## Konstrüktör

Request() konstrüktörü yeni bir Request örneği oluşturur.

```ts
let request = new Request(input, init);
```

:::info
`Request` nesnesi, HTTP isteğinizi yapılandırmak için kullanılır.
:::

#### Parametreler

| isim     | tür                          | isteğe bağlı | açıklama                                                               |
| -------- | ----------------------------- | ------------ | --------------------------------------------------------------------- |
| kaynak   | `Request` veya `USVString`    | `false`      | Kaynak, ya bir isteği nesnesi ya da bir URL dizesi olabilir.          |
| init     | `RequestInit` | `true`       | Init nesnesi, isteğe bağlı parametreleri ayarlamanızı sağlar.         |

Dönüş tipi bir `Request` nesnesidir.

##### `RequestInit`

| isim                             | tür                                                                                    | varsayılan     | açıklama                                                |
| -------------------------------- | --------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------- |
| [`method`][method]               | `string`                                                                                | `GET`          | İsteğin metodu.                                      |
| [`headers`][headers]             | `Headers` veya `{ [key: string]: string }`                                            | yok            | İsteğin başlıkları.                                  |
| [`body`][body]                   | `Blob`, `BufferSource`, `FormData`, `URLSearchParams`, `USVString` veya `ReadableStream` | yok            | İsteğin gövdesi.                                     |
| [`cache`][cache]                 | `string`                                                                                | yok            | İsteğin önbellek modu.                                |
| [`credentials`][credentials]     | `string`                                                                                | `same-origin`  | İsteğin kimlik bilgileri modu.                         |
| [`integrity`][integrity]         | `string`                                                                                | yok            | İsteğin gövdesinin kriptografik hash'i.                |
| [`mode`][mode]                   | `string`                                                                                | `cors`         | Kullanmak istediğiniz istek modu.                      |
| [`redirect`][redirect]           | `string`                                                                                | `follow`       | Yönlendirmelerin nasıl ele alınacağını belirtir.       |
| [`referrer`][referrer]           | `string`                                                                                | `about:client` | `no-referrer`, `client` veya bir URL belirten bir `USVString`. |

:::tip
RequestInit nesnesi kullanarak isteğinizi daha da özelleştirin.
:::

## Özellikler

| isim                                | tür                                        | açıklama                                                                                                                 |
| ----------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| [`cache`][cache]                    | `string`                                   | Ön bellek modu, isteğin nasıl önbelleğe alınacağını (varsayılan, no-cache, vb.) belirtir.                               |
| [`credentials`][credentials]        | `string`                                   | Kimlik bilgileri (`omit`, `same-origin`, vb.) kullanıcının isteğin CORs'lerinde çerezleri gönderip göndermeyeceğini gösterir. |
| [`destination`][destination]        | [`RequestDestination`][requestdestination] | İstenen içeriğin türünü gösteren dize.                                                                                  |
| [`body`][body]                      | [`ReadableStream`][readablestream]        | Getter, gövde içeriğinin `ReadableStream`'ini ifşa eder.                                                               |
| [`bodyUsed`][bodyused]              | `boolean`                                  | Gövde içeriğinin okunup okunmadığını gösterir.                                                                            |
| [`url`][url]                        | `USVString`                                | İsteğin URL'si.                                                                                                        |
| [`headers`][headers]                | `Headers`               | İsteğe ait başlıklar.                                                                                                   |
| [`integrity`][integrity]            | `string`                                   | İsteğin gövdesinin kriptografik hash'i.                                                                                |
| [`method`][method]                  | `string`                                   | İsteğin metodu (`POST`, `GET`, vb.).                                                                                   |
| [`mode`][mode]                      | `string`                                   | İsteğin modunu belirtir (örn. `cors`).                                                                                 |
| [`redirect`][redirect]              | `string`                                   | Yönlendirmelerin nasıl ele alınacağına dair mod.                                                                        |
| [`referrer`][referrer]              | `string`                                   | İsteğin yönlendiren kaynağı.                                                                                           |
| [`referrerPolicy`][referrerpolicy]  | `string`                                   | İsteğin yönlendirme politikasını belirtir.                                                                             |

Yukarıdaki tüm özellikler yalnızca okunabilir.

## Metotlar

| isim                            | açıklama                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| [`arrayBuffer()`][arraybuffer]  | Gövde akışını tamamlanana kadar okur ve bir `ArrayBuffer` nesnesi döner.                  |
| [`blob()`][blob]                | Gövde akışını tamamlanana kadar okur ve bir `Blob` nesnesi döner.                         |
| [`formData()`][formdata]        | Gövde akışını tamamlanana kadar okur ve bir `FormData` nesnesi döner.                     |
| [`json()`][json]                | Gövde akışını tamamlanana kadar okur, JSON olarak ayrıştırır ve bir JavaScript nesnesi döner. |
| [`text()`][text]                | Gövde akışını tamamlanana kadar okur ve bir USVString nesnesi (metin) döner.              |
| [`clone()`][clone]              | Request nesnesinin bir kopyasını oluşturur.                                             |

:::warning
`Request` nesnesinin herhangi bir özelliğini değiştirmeye çalışmayın, çünkü bu yalnızca okunabilir.
:::

## Örnek

```ts
function handler(_req) {
  // Bir post isteği oluştur
  const request = new Request("https://post.deno.dev", {
    method: "POST",
    body: JSON.stringify({
      message: "Merhaba dünya!",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  console.log(request.method); // POST
  console.log(request.headers.get("content-type")); // application/json

  return fetch(request);
}

Deno.serve(handler);
```