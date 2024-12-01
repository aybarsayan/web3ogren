---
title: ECMAScript modülleri
description: CSV generate'nin CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş Node.js paketleri için uygundur. Bu doküman, kullanım yöntemleri, desteklenen Node.js sürümleri ve eski sürümler hakkında bilgi sunmaktadır.
keywords: [csv, generate, CJS, CommonJS, modüller, Node.js, paketler]
sort: 3.2
---

# Node.js CommonJS (CJS)

CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş Node.js paketleri için uygundur. Kodunuzda şu şekilde kullanılabilir:

* Stream ve callback API: `const {generate} = require('csv-generate');`
* Sync API: `const {generate} = require('csv-generate/sync');`

:::info
Ek bilgiler `proje CommonJS` dokümanında mevcuttur.
:::

## Desteklenen Node.js sürümleri

Bu paketinin CommonJS dağıtımı, Node.js sürüm 8.3 ve üzerindeki sürümlerin kullanımını destekler. Ancak, modül yolu Node.js sürümünüze bağlı olarak farklılık gösterir.

İçsel olarak, [`export` property](https://nodejs.org/api/packages.html#packages_exports), `package.json` dosyası içinde `csv-generate` ve `csv-generate/sync` giriş noktalarını beyan eder. Bu, [`./dist/cjs` klasöründeki](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/lib) modülleri açığa çıkarır.

> **Not:** Node.js 12+ sürümünde `main` alanına alternatif olarak desteklenmektedir. Eski sürümlerde, `main` alanı `csv` modülünün bir yedekleme işlevi gibi davranır. Bu şeffaftır. 
> — Node.js Sürüm Dikkatleri

```js
require("csv/dist/cjs/sync.cjs") // Alternatif
```
ifadesini `require("csv/sync")` ifadesine alternatif olarak kullanın.

## Bu paketin eski sürümleri

2. sürüm ve altındaki sürümlerde, modül imzası şu şekildedir:

```js
const generate = require('csv-generate');
// Ve
const generate = require('csv-generate/lib/sync');
```