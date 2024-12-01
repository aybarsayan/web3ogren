---
title: Eski Tarayıcı Ortamları için IIFE Vanilla JavaScript
description: IIFE dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcılara yöneliktir. Bu içerik, IIFE kullanımını ve ilgili örnekleri içermektedir.
keywords: [csv, stringify, iife, javascript, vanilla, tarayıcı]
sort: 2.4
---

# Eski Tarayıcılar için Vanilla JavaScript (IIFE)

[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcılara yöneliktir.

Dosyalar [`packages/csv-stringify/dist/iife`](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/dist/iife) klasörü içinde bulunmaktadır. Bunları projeniz içinde içe aktarın ya da NPM kullanarak paketi indirin ve referans verin.

:::info
Sayfa bağlamında şu şekillerde küresel olarak kullanılabilir:
:::

* Akış ve geri çağırma API'si: `csv_stringify.stringify(/* argümanlar */);`
* Senkron API: `csv_stringify_sync.stringify(/* argümanlar */);`

## Örnek

Çalışır bir demo [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur:

* [`./iife/stringify.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/stringify.html)
* [`./iife/stringify_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/stringify_sync.html)

:::tip
Express ile dosyaları şu şekilde sergileyin:
:::

```js
const app = express();
app.use('/lib/stringify/',
  express.static(`node_modules/csv-stringify/dist/iife/`));
app.listen(3000);
```

HTML kodu şu şekildedir:

```html
<script src="/lib/stringify/index.js"></script>
<script>
  csv_stringify.stringify(records, options, (err, data) => {
    console.info(data)
  });
</script>
```

Senkron API'yi kullanmak isterseniz, şu şekilde kullanın:

```html
<script src="/lib/stringify/sync.js"></script>
<script>
  const data = csv_stringify_sync.stringify(records, options);
</script>
```

> **Önemli Not:** IIFE kullanırken, eski tarayıcıların modül sistemini desteklemediğini unutmamak önemli. 
> — Teknoloji Güncellemeleri