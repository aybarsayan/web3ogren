---
title: Eski tarayıcı ortamlarında IIFE Vanilla JavaScript
description: IIFE dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcılara yöneliktir. Bu kılavuz, mevcut kurulum ve kullanımı hakkında bilgi sunmaktadır.
keywords: ['stream', 'transform', 'iife', 'javascript', 'vanilla', 'browser', 'ECMAScript']
sort: 2.4
---

# Eski Tarayıcılar için Vanilla JavaScript (IIFE)

[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcılara yöneliktir.

Dosyalar [`packages/stream-transform/dist/iife`](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform/dist/iife) klasörünün içinde bulunmaktadır. Bunları projenize dahil edin veya paketi indirmek ve referans vermek için NPM'i kullanın.

:::tip
Aşağıdaki API'lar ile projenizde esnek bir şekilde çalışabilirsiniz.
:::

Sayfa bağlamında topluca kullanılabilir:

* Akış ve geri çağırma API'si: `stream_transform.transform(/* arguments */);`
* Senkron API: `stream_transform_sync.transform(/* arguments */);`

## Örnek

Çalışan bir demo, [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur:

* [`./iife/transform.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/transform.html)
* [`./iife/transform_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/transform_sync.html)

:::info
Express ile dosyaları sergileyerek uygulamanızda kullanabilirsiniz.
:::

Express ile dosyaları şu şekilde sergileyin:

```js
const app = express();
app.use('/lib/transform/',
  express.static(`node_modules/stream-transform/dist/iife/`));
app.listen(3000);
```

HTML kodu şu şekildedir:

```html
<script src="/lib/transform/index.js"></script>
<script>
  stream_transform.transform(input, handler, options, (err, data) => {
    console.info(data)
  });
</script>
```

Senkron API kullanmak isterseniz, şunu kullanın:

```html
<script src="/lib/transform/sync.js"></script>
<script>
  const data = stream_transform_sync.transform(input, handler, options);
</script>
```