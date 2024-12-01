---
description: Kinsta'da Deno dağıtımını nasıl gerçekleştirebileceğinizi öğrenin. Adım adım rehber ile uygulamanızı kolayca hazırlayıp dağıtabilirsiniz.
keywords: [Kinsta, Deno, uygulama dağıtımı, web uygulamaları, GitHub, deno-bin]
---

[Kinsta Uygulama Barındırma](https://kinsta.com/application-hosting), web uygulamalarınızı doğrudan Git depozitonuzdan oluşturup dağıtmanıza olanak tanıyan bir hizmettir.

## Uygulamanızı Hazırlama

**Kinsta**'da Deno uygulamalarını çalıştırmak için [`deno-bin`](https://www.npmjs.com/package/deno-bin) paketini kullanmanızı öneriyoruz.

:::info
Bunu yapmak için, `package.json` dosyanız şu şekilde görünmelidir:
:::

```json title="package.json"
{
  "name": "deno app",
  "scripts": {
    "start": "deno run --allow-net index.js --port=${PORT}"
  },
  "devDependencies": {
    "deno-bin": "^1.28.2"
  }
}
```

## Örnek Uygulama

```js
import { parseArgs } from "jsr:@std/cli";

const { args } = Deno;
const port = parseArgs(args).port ? Number(parseArgs(args).port) : 8000;

Deno.serve({ port }, (_req) => new Response("Hello, world"));
```

Uygulama kendiliğinden açıktır. **Kinsta**'nın sağladığı çevre değişkenini kullanmak kritik öneme sahiptir:

> **"PORT"**'u sabit kodlamak yerine bu değişkeni kullanmalısınız.  
> — Kinsta Dokümantasyonu

Ayrıca başlayabilmeniz için bir [depo](https://github.com/kinsta/hello-world-deno) bulunmaktadır.

## Dağıtım

1. [Kinsta Uygulama Barındırma](https://kinsta.com/signup/?product_type=app-db) üzerinde kaydolun veya doğrudan [My Kinsta](https://my.kinsta.com/) admin paneline giriş yapın.
2. Uygulamalar sekmesine gidin.
3. GitHub deponuzu bağlayın.
4. **Hizmet Ekle > Uygulama butonuna** basın.
5. Sihirbaz adımlarını takip edin.

:::tip
Uygulamanızı dağıtırken karşılaşabileceğiniz yaygın sorunları önlemek için her adımı dikkatlice izleyin.
:::