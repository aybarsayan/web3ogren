---
title: ECMAScript modülleri tarayıcı ortamları
description: ESM dağıtımı, ES6 ile tanıtılan ECMAScript modüllerini destekleyen en son tarayıcıları hedef alır. Bu belgede, ESM kullanımına yönelik rehberlik ve örnekler bulunmaktadır.
keywords: ['akış', 'dönüştür', 'esm', 'tarayıcı', 'ECMAScript', 'modüller', 'web geliştirme']
sort: 2.3
---

# ECMAScript modülleri (ESM) daha yeni tarayıcılar için

ESM dağıtımı, [ES6 ile tanıtılan ECMAScript modüllerini](https://caniuse.com/es6-module) destekleyen en son tarayıcıları hedef alır.

:::info
**Not:** `Node.js sürümü` ile karşılaştırıldığında, bu dağıtım Node.js ortamının dışında çalıştırmak için polyfill'ler içerir.
:::

Ek bilgiler, `proje ECMAScript modülleri` belgelerinde mevcuttur.

## Kullanım

Dosyalar manuel olarak içe aktarılabilir. Herhangi bir dış bağımlılık gerektirmezler ve [`packages/stream-transform/dist/esm`](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform/dist/esm) klasörü içerisinde yer alırlar.

NPM kullanarak modüllerinizi yönetmek ve yüklemek için, örneğin webpack içinde, aşağıdaki şekilde kullanın:

```js
import {transform} from 'stream-transform/browser/esm';
// Veya
import {transform} from 'stream-transform/browser/esm/sync';
```

## Vanilla JavaScript

Çalışan bir demo, [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur.

* [`./esm/transform.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/transform.html)
* [`./esm/transform_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/transform_sync.html)

:::tip
**İpuçları:** Express ile, dosyaları şu şekilde sunabilirsiniz:
```js
const app = express();
app.use('/lib/transform/',
  express.static(`node_modules/stream-transform/dist/esm/`));
app.listen(3000);
```
:::

HTML kodu şu şekildedir:

```html
<script type="module">
  import {transform} from '/lib/transform/index.js';
  transform(input, handler, options, (err, data) => {
    console.info(data)
  });
</script>
```

Eğer senkron API'yi kullanmak isterseniz, şu şekilde kullanın:

```html
<script type="module">
  import {transform} from '/lib/transform/sync.js';
  const data = transform(input, handler, options);
</script>
```

## Webpack modül paketleyici

Bu dağıtım, [webpack sürüm 5](https://webpack.js.org/) ile uyumludur. Node.js polyfill'leri ile birlikte gelir. Proje deposunda bir [çalışan demo](https://github.com/adaltas/node-csv/tree/master/demo/webpack) paylaşılmıştır.

Modülünüzde, uygun `stream-transform` modülünü içe aktarın:

* [`./transform.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/transform.js#L2):   
  ```js
  import {transform} from 'stream-transform/browser/esm';
  ```
* [`./transform_sync.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/transform_sync.js#L2):   
  ```js
  import {transform} from 'stream-transform/browser/esm/sync';
  ```

İlgili [webpack yapılandırması](https://github.com/adaltas/node-csv/tree/master/demo/webpack/webpack.config.js) şu şekildedir:


webpack.config.js Ayrıntıları

`embed:demo/webpack/webpack.config.js{snippet: "transform"}`

