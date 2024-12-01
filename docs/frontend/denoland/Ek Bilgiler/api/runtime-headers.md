---
title: "HTTP Başlıkları"
description: HTTP başlıkları arayüzü Fetch API'nin bir parçasıdır ve fetch() işlevinin istek ve yanıt kaynaklarının HTTP başlıklarını oluşturmanıza ve manipüle etmenize olanak tanır. Bu doküman, Header() yapıcı fonksiyonu ve önemli yöntemler hakkında bilgi sunmaktadır.
keywords: [HTTP başlıkları, Fetch API, Header, JavaScript, web geliştirme]
---

[Başlıklar](https://developer.mozilla.org/en-US/docs/Web/API/Headers) arayüzü
Fetch API'nin bir parçasıdır. fetch() işlevinin istek ve yanıt kaynaklarının HTTP
başlıklarını oluşturmanıza ve manipüle etmenize olanak tanır.

- `Yapıcı`
  - `Parametreler`
- `Yöntemler`
- `Örnek`

## Yapıcı

Header() yapıcı fonksiyonu yeni bir `Header` örneği oluşturur.

```ts
let headers = new Headers(init);
```

#### Parametreler

| ad   | tür                                    | isteğe bağlı | açıklama                                                                                                 |
| ---- | -------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| init | `Headers` / `{ [key: string]: string }` | `doğru`     | init seçeneği, başlıklar nesnesini mevcut bir `Headers` veya bir nesne literal'i ile başlatmanıza olanak tanır. |

Yapıcı fonksiyonun dönüş türü bir `Headers` örneğidir.

:::tip
Başlıklar nesnesini oluştururken dikkat etmeniz gereken en önemli şey, uygun türdeki bir nesne literal'i sağlamaktır.
:::

## Yöntemler

| ad                                   | açıklama                                                          |
| ------------------------------------ | ----------------------------------------------------------------- |
| `append(name: string, value: string)` | Başlıklara bir başlık ekler (mevcut olanı üzerini yazar)         |
| `delete(name: string)`               | Başlıklar nesnesinden bir başlığı siler.                         |
| `set(name: string, value: string)`   | Başlıklar nesnesinde yeni bir başlık oluşturur.                 |
| `get(name: string)`                  | Başlıklar nesnesindeki bir başlığın değerini alır.              |
| `has(name: string)`                  | Başlığın Başlıklar nesnesinde mevcut olup olmadığını kontrol eder. |
| `entries()`                          | Başlıkları anahtar-değer çifti olarak alır. Sonuç döngü ile kullanılabilir. |
| `keys()`                             | Başlıklar nesnesinin tüm anahtarlarını alır. Sonuç döngü ile kullanılabilir. |

:::info
Header nesnesi, isteklerinizi özelleştirmek ve API ile iletişiminizi güçlendirmek için kullanışlıdır.
:::

## Örnek

```ts
// Bir nesne literal'inden yeni bir başlıklar nesnesi oluşturma.
const myHeaders = new Headers({
  accept: "application/json",
});

// Başlıklar nesnesine bir başlık ekleme.
myHeaders.append("user-agent", "Deno Deploy");

// Başlıklar nesnesinin başlıklarını yazdırma.
for (const [key, value] of myHeaders.entries()) {
  console.log(key, value);
}

// Başlıklar örneğini Response veya Request yapıcılarına geçebilirsiniz.
const request = new Request("https://api.github.com/users/denoland", {
  method: "POST",
  headers: myHeaders,
});
``` 