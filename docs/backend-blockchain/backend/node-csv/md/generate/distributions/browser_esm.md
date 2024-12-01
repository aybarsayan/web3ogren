---
title: ECMAScript modülleri tarayıcı ortamları
description: ESM dağıtımı, ES6 ile tanıtılan ECMAScript modüllerini destekleyen en son tarayıcıları hedeflemektedir. Bu belgede, modüllerin nasıl kullanılacağına ve yapılandırılacağına dair bilgiler bulunmaktadır. Dikkat edilmesi gereken noktalar ve örnek uygulamalara erişebilirsiniz.
keywords: [ESM, tarayıcı, ECMAScript, modüller, polyfill, webpack, NPM]
sort: 2.3
---

# Yeni tarayıcılar için ECMAScript modülleri (ESM)

ESM dağıtımı, [ES6 ile tanıtılan ECMAScript modüllerini destekleyen en son tarayıcıları](https://caniuse.com/es6-module) hedeflemektedir.

:::info
`Node.js sürümü` ile karşılaştırıldığında, bu dağıtım Node.js ortamının dışında çalışmak için polyfill'leri içerir.
:::

Ek bilgiler `ECMAScript modülleri projesi` belgelerinde mevcuttur.

## Kullanım

Dosyalar elle içe aktarılabilir. Herhangi bir dış bağımlılık gerektirmemekte ve [`packages/csv-generate/dist/esm`](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/dist/esm) klasöründe bulunmaktadır.

:::tip
NPM kullanarak modüllerinizi yönetmek ve yüklemek için, örneğin webpack içinde, şunu kullanın:
:::

```js
import {generate} from 'csv-generate/browser/esm';
// Veya
import {generate} from 'csv-generate/browser/esm/sync';
```

## Vanilla JavaScript

Çalışan bir demo, [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur.

- [`./esm/generate.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/generate.html)
- [`./esm/generate_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/generate_sync.html)

Express ile dosyaları şu şekilde açığa çıkarın:

```js
const app = express();
app.use('/lib/generate/',
  express.static(`node_modules/csv-generate/dist/esm/`));
app.listen(3000);
```

HTML kodu şöyle görünür:

```html
<script type="module">
  import {generate} from '/lib/generate/index.js';
  generate(options, (err, data) => {
    console.info(data)
  });
</script>
```

Eğer senkron API'yi kullanmak isterseniz, şunu kullanın:

```html
<script type="module">
  import {generate} from '/lib/generate/sync.js';
  const data = generate(options);
</script>
```

## Webpack modül paketleyici

Bu dağıtım, [webpack sürüm 5](https://webpack.js.org/) ile uyumludur. Node.js polyfill'leri ile birlikte gelmektedir. Proje deposunda [çalışan bir demo](https://github.com/adaltas/node-csv/tree/master/demo/webpack) paylaşılmıştır.

Modülünüzde, uygun `csv-generate` modülünü içe aktarın:

- [`./generate.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/generate.js#L2):   
  ```js
  import {generate} from 'csv-generate/browser/esm';
  ```
- [`./generate_sync.js`](https://github.com/adaltas/node-csv/blob/master/demo/webpack/src/generate_sync.js#L2):   
  ```js
  import {generate} from 'csv-generate/browser/esm/sync';
  ```

İlgili [webpack yapılandırması](https://github.com/adaltas/node-csv/tree/master/demo/webpack/webpack.config.js) şöyle görünür:


Webpack Yapılandırma Kodu

`embed:demo/webpack/webpack.config.js{snippet: "generate"}`

