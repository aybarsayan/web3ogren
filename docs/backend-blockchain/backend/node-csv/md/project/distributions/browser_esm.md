---
title: ECMAScript modülleri tarayıcı ortamları
description: ESM dağıtımı, ES6 tarafından tanıtılan ECMAScript modüllerini destekleyen en son tarayıcıları hedef alır. Bu belgede, ESM'nin nasıl kullanıldığı ve modüllerin nasıl entegre edileceği hakkında bilgi bulabilirsiniz.
keywords: ['csv', 'esm', 'tarayıcı', 'ECMAScript', 'modüller', 'üret', 'ayrıştır']
sort: 4.3
---

# ECMAScript modülleri (ESM) yeni tarayıcılar için

ESM dağıtımı, [ES6 tarafından tanıtılan ECMAScript modüllerini](https://caniuse.com/es6-module) destekleyen en son tarayıcıları hedef alır. 

:::info
Modern web tarayıcıları, ECMAScript modüllerini yerel olarak içe aktarır ve bu, webpack ve diğer alternatif paketleyicilerle de uyumlu çalışır.
:::

`Node.js versiyonu` ile karşılaştırıldığında, bu dağıtım Node.js ortamı dışında çalışabilmesi için polifillerle birlikte paketlenmiştir. İki gösterim mevcuttur:

- Modül desteği olan web tarayıcılarını hedefleyen [Express](https://expressjs.com/) ile bir Vanilla Javascript uygulaması.
- [webpack](https://webpack.js.org/) ile paketlenmiş bir web uygulaması.

---

## Kullanım

Dosyalar `packages/{package}/dist/esm` klasörleri içerisinde yer almaktadır. Projenize içe aktarabilir veya NPM kullanarak paketi indirebilir ve bunlara referans verebilirsiniz:

`csv` paketini kullanıyorsanız:

* [csv](https://github.com/adaltas/node-csv/tree/master/packages/csv/dist/esm)

Bireysel paketleri kullanıyorsanız:

* [csv-generate](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/dist/esm)
* [csv-parse](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/dist/esm)
* [csv-stringify](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/dist/esm)
* [stream-transform](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform/dist/esm)

> **Not:** Modüllerinizi yönetmek ve yüklemek için NPM'i kullanırken, örneğin webpack içinde, şu şekilde kullanmalısınız:

```js
import * as csv from 'csv-parse/browser/esm/index.js';
// Veya
import * as csv from 'csv-parse/browser/esm/sync.js';
```

---

## Entegrasyon

ESM kodu, `module` türüne sahip bir script etiketiyle içe aktarılır:

```html
<script type="module">
// Modüllerinizi içe aktarın ve kodunuzu ekleyin
</script>
```

`csv` paketini kullanırken, aşağıdaki içe aktarma yönergelerini kullanın:

```js
// Akış ve geri çağırma API'leri için
import {generate, parse, transform, stringify} from '/your/path/lib/csv/index.js';
// Veya senkron API için
import {generate, parse, transform, stringify} from '/your/path/lib/csv/sync.js';
```

Bireysel paketleri kullanırken:

```js
// Akış ve geri çağırma API'leri için
import {generate} from '/your/path/lib/generate/index.js';
import {parse} from '/your/path/lib/parse/index.js';
import {transform} from '/your/path/lib/transform/index.js';
import {stringify} from '/your/path/lib/stringify/index.js';
// Veya senkron API için
import {generate} from '/your/path/lib/generate/sync.js';
import {parse} from '/your/path/lib/parse/sync.js';
import {transform} from '/your/path/lib/transform/sync.js';
import {stringify} from '/your/path/lib/stringify/sync.js';
```

---

## Vanilla JavaScript

Çalışan bir demo, [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur.

* [`./esm/csv.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/csv.html)
* [`./esm/csv_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/esm/csv_sync.html)

Express ile, dosyaları şu şekilde yayınlayın:

```js
const app = express();
app.use('/lib/csv/',
  express.static(`node_modules/csv/dist/esm/`));
app.listen(3000);
```

HTML kodu şu şekilde görünür:

```html
<script type="module">
  import {transform} from '/lib/csv/index.js';
  transform(input, handler, options, (err, data) => {
    console.info(data);
  });
</script>
```

Eğer senkron API'yi kullanmak istiyorsanız, şunu kullanın:

```html
<script type="module">
  import {transform} from '/lib/csv/sync.js';
  const data = transform(input, handler, options);
</script>
```

---

## Webpack modül paketleyici

Bu dağıtım, [webpack sürüm 5](https://webpack.js.org/) ile uyumludur. Node.js polifilleri ile birlikte gelir. Proje deposunda [çalışan bir demo](https://github.com/adaltas/node-csv/tree/master/demo/webpack) paylaşılmıştır.

Modülünüzde, uygun `csv` modülünü içe aktarın:

```js
import * as csv from 'csv-parse/browser/esm/index.js';
// Veya
import * as csv from 'csv-parse/browser/esm/sync.js';
```

İlgili [webpack konfigürasyonu](https://github.com/adaltas/node-csv/tree/master/demo/webpack/webpack.config.js) şu şekilde görünür:

`embed:demo/webpack/webpack.config.js{snippet: "csv"}`