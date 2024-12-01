---
title: Dosya Tabanlı Yönlendirme
description: Bu öğretici, dosya tabanlı yönlendirme kullanan basit bir HTTP sunucusu oluşturmanın nasıl yapılacağını göstermektedir. Sunucu, belirli dizinlere eklenen dosyaları otomatik olarak yönlendirme yollarına dönüştürür.
keywords: [dosya tabanlı yönlendirme, HTTP sunucusu, Deno, Next.js, yönlendirme istekleri]
---

Eğer [Next.js](https://nextjs.org/) gibi çerçeveler kullandıysanız, dosya tabanlı yönlendirme ile tanış olabilirsiniz - belirli bir dizine bir dosya eklersiniz ve otomatik olarak bir yön yolu haline gelir. 

## Yönlendirme istekleri

Yeni bir `server.ts` dosyası oluşturun. Bu dosya, istekleri yönlendirmek için kullanılacaktır. Bir istek nesnesini argüman olarak alan `handler` adlı bir asenkron fonksiyon oluşturun:

```ts title="server.ts"
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  let module;

  try {
    module = await import(`.${path}.ts`);
  } catch (_error) {
    return new Response("Not found", { status: 404 });
  }

  if (module[method]) {
    return module`method`;
  }

  return new Response("Method not implemented", { status: 501 });
}

Deno.serve(handler);
```

`handler` fonksiyonu, istek URL'sinden çıkarılan yolu içeren bir `path` değişkeni ve istek yöntemini içeren bir `method` değişkeni ayarlar.

Daha sonra, yola dayanarak bir modülü içe aktarmayı dener. Modül bulunamazsa, 404 yanıtını döner.

Modül bulunduğunda, modülün istek yöntemi için bir yöntem yöneticisi olup olmadığını kontrol eder. Yöntem yöneticisi bulunursa, istek nesnesi ile birlikte çağrılır. Yöntem yöneticisi bulunamazsa, 501 yanıtını döner.

Son olarak, `Deno.serve` kullanarak handler fonksiyonunu sunar.

> Yol, `/users`, `/posts` gibi geçerli bir URL yolu olabilir. `/users` gibi yollar için `./users.ts` dosyası içe aktarılacaktır. Ancak, `/org/users` gibi daha derin yollar, `./org/users.ts` dosyasını gerektirecektir. İç içe dizinler ve dosyalar oluşturarak iç içe yönlendirmeler oluşturabilirsiniz.

## İstekleri İşle

`server.ts` ile aynı dizinde `users.ts` adlı yeni bir dosya oluşturun. Bu dosya, `/users` yoluna gelen istekleri işlemek için kullanılacaktır. Bir örnek olarak `GET` isteğini kullanacağız. `POST`, `PUT`, `DELETE` gibi daha fazla HTTP yöntemi ekleyebilirsiniz.

`users.ts` içinde, bir istek nesnesini argüman olarak alan `GET` adında bir asenkron fonksiyon ayarlayın:

```ts title="users.ts"
export function GET(_req: Request): Response {
  return new Response("Hello from user.ts", { status: 200 });
}
```

## Sunucuyu Başlat

Sunucuyu başlatmak için aşağıdaki komutu çalıştırın:

```sh
deno run --allow-net --allow-read server.ts
```

Bu, sunucuyu `localhost:8080`'da başlatacaktır. Artık `localhost:8000/users` adresine bir `GET` isteği yapabilir ve `Hello from user.ts` yanıtını görebilirsiniz.

:::tip
Bu komut, sunucuyu başlatmak için ağa erişim sağlamak ve dosya sisteminden `users.ts` dosyasını okumak için `--allow-net` ve `--allow-read` `izin bayraklarını` gerektirir.
:::

🦕 Artık uygulamalarınızda dosya yapısına dayalı olarak yönlendirme ayarlayabilirsiniz. Gerekirse daha fazla yön ve yöntem eklemek için bu örneği genişletebilirsiniz.

[ @naishe](https://github.com/naishe) teşekkürler, bu öğretici için katkıda bulundu.