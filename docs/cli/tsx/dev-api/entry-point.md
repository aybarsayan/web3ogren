---
description: Bu belge, `tsx` ile TypeScript dosyalarının nasıl yükleneceğini açıklamaktadır. Özellikle CommonJS ve ESM (ECMAScript Module) modları için ayrıntılı bilgileri içerir.
keywords: [tsx, TypeScript, ESM, CommonJS, dinamik içe aktarma, Node.js]
---

# Giriş Noktası

Giriş dosyanızın en üstüne `tsx`'i içe aktarın:

```js
import 'tsx'

// Artık TS dosyalarını yükleyebilirsiniz
await import('./file.ts')
```


:::info
Not: ESM'deki statik içe aktarma değerlendirmesi sırası nedeniyle, iyileştirme yalnızca [kaydetme sonrası dinamik içe aktarmalar](https://nodejs.org/docs/latest-v22.x/api/module.html#:~:text=dynamic%20import()%20must%20be%20used%20for%20any%20code%20that%20should%20be%20run%20after%20the%20hooks%20are%20registered) üzerinde çalışır.
:::

:::danger
Kaynak kodunuzdan çalıştırma zamanında _tsx_ yükleyerek Node.js'i geliştirmeniz, bunu bilmeyen iş arkadaşlarınız için beklenmedik olabilir.

Mümkünse, bunu daha görünür bir yöntem olarak, `CLI bayrağı` olarak geçmeyi önerilir.
:::

## Gelişmiş kullanım

### Sadece CommonJS modu

Giriş dosyanızın en üstüne `tsx/cjs`'i dahil edin:

```js
require('tsx/cjs')

// Artık TS dosyalarını yükleyebilirsiniz
require('./file.ts')
```

### Sadece Modül modu

Giriş dosyanızın en üstüne `tsx/esm`'i içe aktarın:

```js
import 'tsx/esm'

// Artık TS dosyalarını yükleyebilirsiniz
await import('./file.ts')