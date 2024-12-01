---
title: IIFE Vanilla JavaScript eski tarayıcı ortamları için
description: IIFE dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcıları hedef alır. Bu belgede, kullanım örnekleri ve dosya yerleşimi hakkında bilgi bulacaksınız.
keywords: ['csv', 'generate', 'iife', 'javascript', 'vanilla', 'browser']
sort: 2.4
---

# Eski Tarayıcılar için Vanilla JavaScript (IIFE)

[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcıları hedef alır.

:::info
Dosyalar, [`packages/csv-generate/dist/iife`](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/dist/iife) klasörü içinde yer almaktadır. Bunları projeniz içinde içe aktarın ya da paketi indirmek ve referans vermek için NPM'i kullanın.
:::

Sayfa bağlamında şu şekilde genel olarak erişilebilir:

* Akış ve geri çağırma API'si: `csv_generate.generate(/* arguments */);`
* Senkron API: `csv_generate_sync.generate(/* arguments */);`

## Örnek

Çalışan bir demo, [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur:

* [`./iife/generate.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/generate.html)
* [`./iife/generate_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/generate_sync.html)

:::tip
Express ile dosyaları şu şekilde yayınlayabilirsiniz:
:::

```js
const app = express();
app.use('/lib/generate/',
  express.static(`node_modules/csv-generate/dist/iife/`));
app.listen(3000);
```

HTML kodu ise şu şekildedir:

```html
<script src="/lib/generate/index.js"></script>
<script>
  csv_generate.generate(options, (err, data) => {
    console.info(data)
  });
</script>
```

Eğer senkron API'yi kullanmak istiyorsanız, şunu kullanın:

```html
<script src="/lib/generate/sync.js"></script>
<script>
  const data = csv_generate_sync.generate(options);
</script>