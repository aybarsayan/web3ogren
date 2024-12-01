---
title: Eski Tarayıcı Ortamlarında IIFE Vanilla JavaScript
description: IIFE dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcılara yöneliktir. Bu sayfa, IIFE ile kullanıma hazır JavaScript'in nasıl entegre edileceğini açıklamaktadır.
keywords: [csv, parse, iife, javascript, vanilla, browser, example]
sort: 2.4
---

# Eski Tarayıcılar için Vanilla JavaScript (IIFE)

[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcılara yöneliktir. 

:::info
IIFE kullanarak geliştirdiğiniz kod parçacıkları, eski tarayıcılarla uyumlu olarak çalışacaktır.
:::

Dosyalar [`packages/csv-parse/dist/iife`](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/dist/iife) klasörü içerisinde bulunmaktadır. Bunları projenize dahil edin veya NPM kullanarak paketi indirin ve referans gösterin.

Sayfa bağlamında şu şekilde küresel olarak mevcuttur:

* Stream ve geri çağırma API'si: `csv_parse.parse(/* arguments */);`
* Senkron API: `csv_parse_sync.parse(/* arguments */);`

## Örnek

Çalışan bir demo [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur:

* [`./iife/parse.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/parse.html)
* [`./iife/parse_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/parse_sync.html)

:::tip
Her zaman en güncel versiyonu kullanmaya çalışın ve NPM ile paket yöneticisini tercih edin.
:::

Express ile dosyaları şu şekilde yayınlayın:

```js
const app = express();
app.use('/lib/parse/',
  express.static(`node_modules/csv-parse/dist/iife/`));
app.listen(3000);
```

HTML kodu aşağıdaki gibidir:

```html
<script src="/lib/parse/index.js"></script>
<script>
  csv_parse.parse(records, options, (err, data) => {
    console.info(data)
  });
</script>
```

Eğer senkron API'yi kullanmak isterseniz, aşağıdaki kodu kullanın:

```html
<script src="/lib/parse/sync.js"></script>
<script>
  const data = csv_parse_sync.parse(records, options);
</script>
```

:::warning
Senkron API kullanırken büyük veri kümesi işlemleri yavaşlayabilir, bu nedenle dikkatli olun. 
:::