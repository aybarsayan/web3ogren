---
title: ECMAScript modülleri tarayıcı ortamları
description: ESM dağıtımı, ES6 ile tanıtılan ECMAScript modüllerini destekleyen en son tarayıcıları hedefler. Bu belge, ESM kullanımı ve kurulum adımlarını detaylandırmaktadır.
keywords: [csv, stringify, esm, tarayıcı, ECMAScript, modüller, Node.js]
sort: 2.3
---

# ECMAScript modülleri (ESM) daha yeni tarayıcılar için

ESM dağıtımı, [ECMAScript modülleri](https://caniuse.com/es6-module) ES6 ile tanıtılan en son tarayıcıları hedefler.

:::info
Bu dağıtım, Node.js ortamı dışında çalıştırmak için gerekli polyfill'leri içermektedir ve `Node.js sürümü` ile karşılaştırıldığında önemli bir farklılık göstermektedir.
:::

Ek bilgiler `ECMAScript modülleri projesi` belgelerinde mevcuttur.

## Kullanım

Dosyalar manuel olarak içe aktarılabilir. Herhangi bir dış bağımlılığa ihtiyaç duymazlar ve [`packages/csv-stringify/dist/esm`](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/dist/esm) klasörü içerisinde yer almaktadırlar.

Modüllerinizi yönetmek ve yüklemek için NPM kullanıyorsanız, örneğin webpack içinde, şu şekilde kullanın:

```js
import {stringify} from 'csv-stringify/browser/esm';
// Veya
import {stringify} from 'csv-stringify/browser/esm/sync';
```

## Vanilla JavaScript

Çalışan bir demo, [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur.

* [`./esm/stringify.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/stringify.html)
* [`./esm/stringify_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/stringify_sync.html)

Express ile dosyaları şu şekilde yayınlayın:

```js
const app = express();
app.use('/lib/stringify/',
  express.static(`node_modules/csv-stringify/dist/esm/`));
app.listen(3000);
```

HTML kodu şöyle görünür:

```html
<script type="module">
  import {stringify} from '/lib/stringify/index.js';
  stringify(records, options, (err, data) => {
    console.info(data)
  });
</script>
```

Senkron API'yi kullanmak isterseniz, şu şekilde kullanın:

```html
<script type="module">
  import {stringify} from '/lib/stringify/sync.js';
  const data = stringify(records, options);
</script>
```

## Webpack modül paketleyici

Bu dağıtım, [webpack sürüm 5](https://webpack.js.org/) ile uyumludur. Node.js polyfill'leri ile birlikte gelir. Proje deposunda bir [çalışan demo](https://github.com/adaltas/node-csv/tree/master/demo/webpack) mevcuttur.

Modülünüzde, uygun `csv-stringify` modülünü içe aktarın:

* [`./stringify.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/stringify.js#L2):   
  ```js
  import {stringify} from 'csv-stringify/browser/esm';
  ```
* [`./stringify_sync.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/stringify_sync.js#L2):   
  ```js
  import {stringify} from 'csv-stringify/browser/esm/sync';
  ```

İlgili [webpack yapılandırması](https://github.com/adaltas/node-csv/tree/master/demo/webpack/webpack.config.js) şöyle görünür:

`embed:demo/webpack/webpack.config.js{snippet: "stringify"}`