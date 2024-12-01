---
title: "HTTP istekleri (fetch)"
description: Fetch API, Deno Deploy'de dışa HTTP istekleri yapmanıza olanak tanır. Bu sayfa fetch() metodunun kullanımını detaylandırmaktadır.
keywords: [Fetch API, Deno Deploy, HTTP istekleri, promise, RequestInit]
---

[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 
sizin Deno Deploy'de dışa HTTP istekleri yapmanızı sağlar. Bu bir web standardıdır 
ve aşağıdaki arayüzlere sahiptir:

- `fetch()` - Dışa HTTP istekleri yapmanızı sağlayan metot
- `Request` - fetch()'in bir istek kaynağını temsil eder
- `Response` - fetch()'in bir yanıt kaynağını temsil eder
- `Headers` - İsteklerin ve yanıtların HTTP Başlıklarını temsil eder.

Bu sayfa fetch() metodunun kullanımını gösterir. Daha fazlasını öğrenmek için yukarıdaki diğer 
arayüzlere tıklayabilirsiniz.

Fetch ayrıca statik dosyaları almak için dosya URL'lerinden alma işlemini destekler. Statik dosyalar hakkında daha fazla bilgi için `filesystem API belgelerine` bakın.

---

## `fetch()`

`fetch()` metodu, sağlanan kaynağa bir ağ isteği başlatır ve yanıt mevcut olduğunda 
çözülen bir promise döner.

```ts
function fetch(
  resource: Request | string,
  init?: RequestInit,
): Promise<Response>;
```

#### Parametreler

| adı      | tür                                                         | isteğe bağlı | açıklama                                                       |
| -------- | ----------------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| resource | `Request`  [`USVString`][usvstring] | `false`      | Kaynak, bir istek nesnesi veya bir URL dizgesi olabilir.     |
| init     | `RequestInit`             | `true`       | Init nesnesi, isteğe bağlı parametreleri isteğe uygulamanıza olanak tanır. |

`fetch()`'in dönüş tipi, bir `Response` döndüren bir promise'dir.

:::tip
`fetch()` metodunu kullanarak dışa HTTP istekleri yaparken, yanıtın formatına dikkat etmek önemlidir.
:::

## Örnekler

Aşağıdaki Deno Deploy betiği, her gelen istek için GitHub API'ye bir `fetch()` isteği yapar 
ve ardından yanıtı işleyici fonksiyonundan döndürür.

```ts
async function handler(req: Request): Promise<Response> {
  const resp = await fetch("https://api.github.com/users/denoland", {
    // Buradaki init nesnesi, hangi türde bir yanıt kabul ettiğimizi
    // belirten başlıkları içeren bir başlık nesnesine sahiptir.
    // Fetch varsayılan olarak GET isteği yaptığı için method alanını 
    // belirtmiyoruz.
    headers: {
      accept: "application/json",
    },
  });
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "content-type": "application/json",
    },
  });
}

Deno.serve(handler);
```

:::info
Daha fazla bilgi için [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) belgelerine göz atabilirsiniz.
:::

[usvstring]: https://developer.mozilla.org/en-US/docs/Web/API/USVString