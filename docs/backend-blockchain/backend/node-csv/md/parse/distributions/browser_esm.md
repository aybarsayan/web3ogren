---
title: ECMAScript modülleri tarayıcı ortamları
description: ESM dağıtımı, ES6 ile tanıtılan ECMAScript modüllerini destekleyen en son tarayıcılara yöneliktir. Bu belgede, ESM'nin nasıl kullanılacağı ve yapılandırılacağı açıklanmaktadır.
keywords: [csv, parse, esm, browser, ECMAScript, modules]
sort: 2.3
---

# ECMAScript modülleri (ESM) yeni tarayıcılar için

ESM dağıtımı, [ES6 ile tanıtılan ECMAScript modüllerini destekleyen en son tarayıcılara](https://caniuse.com/es6-module) yöneliktir.

:::info
Bu dağıtım, Node.js ortamının dışında çalıştırmak için polifiller içerir.
:::

Ek bilgiler, `ECMAScript modülleri projesi` dokümanında mevcuttur.

## Kullanım

Dosyalar manuel olarak içe aktarılabilir. Herhangi bir dış bağımlılık gerektirmemektedir ve [`packages/csv-parse/dist/esm`](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/dist/esm) klasörü içinde bulunmaktadır.

Modüllerinizi yönetmek ve yüklemek için NPM kullanıyorsanız, örneğin webpack içinde, şunu kullanın:

```js
import {parse} from 'csv-parse/browser/esm';
// Veya
import {parse} from 'csv-parse/browser/esm/sync';
```

## Vanilla JavaScript

Çalışan bir demo, projenin [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur.

* [`./esm/parse.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/parse.html)
* [`./esm/parse_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/parse_sync.html)

:::tip
Express ile dosyaları şöyle açın:
:::

```js
const app = express();
app.use('/lib/parse/',
  express.static(`node_modules/csv-parse/dist/esm/`));
app.listen(3000);
```

HTML kodu şöyle görünür:

```html
<script type="module">
  import {parse} from '/lib/parse/index.js';
  parse(records, options, (err, data) => {
    console.info(data)
  });
</script>
```

Eğer senkron API'yi kullanmak istiyorsanız, şöyle kullanın:

```html
<script type="module">
  import {parse} from '/lib/parse/sync.js';
  const data = parse(records, options);
</script>
```

## Webpack modül paketleyici

Bu dağıtım, [webpack sürüm 5](https://webpack.js.org/) ile uyumludur. Node.js polifilleri ile birlikte gelir. Proje deposunda bir [çalışan demo](https://github.com/adaltas/node-csv/tree/master/demo/webpack) paylaşılmıştır.

Modülünüzde uygun `csv-parse` modülünü içe aktarın:

* [`./parse.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/parse.js#L2):   
  ```js
  import {parse} from 'csv-parse/browser/esm';
  ```
* [`./parse_sync.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/parse_sync.js#L2):   
  ```js
  import {parse} from 'csv-parse/browser/esm/sync';
  ```

:::note
İlgili [webpack yapılandırması](https://github.com/adaltas/node-csv/tree/master/demo/webpack/webpack.config.js) şöyle görünmektedir:
:::

`embed:demo/webpack/webpack.config.js{snippet: "parse"}`