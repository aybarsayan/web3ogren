---
title: ECMAScript modülleri
description: CSV parse'in CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş Node.js paketleri için uygundur. Bu belgede, ilgili API’ler ve desteklenen Node.js sürümleri hakkında önemli bilgiler yer almaktadır.
keywords: ['csv', 'parse', 'CJS', 'CommonJS', 'modüller', 'Node.js', 'API']
sort: 2.2
---

# Node.js CommonJS (CJS)

CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş Node.js paketleri için uygundur. Kodu şu şekilde erişebilirsiniz:

* Stream ve geri çağırma API'si: `const {parse} = require('csv-parse');`
* Senkron API: `const {parse} = require('csv-parse/sync');`

Ek bilgiler `proje CommonJS` belgelerinde mevcuttur.

## Desteklenen Node.js sürümleri

Bu paketin CommonJS dağıtımı, Node.js sürüm 8.3 ve üzerini desteklemektedir. Ancak, modül yolu, Node.js sürümünüze bağlı olarak değişir.

:::info
İçsel olarak, [`export` özelliği](https://nodejs.org/api/packages.html#packages_exports) `package.json` dosyası içerisinde `csv-parse` ve `csv-parse/sync` giriş noktalarını beyan eder.
:::

[`./dist/cjs` klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/lib) içinde modülleri ortaya koyar.

Node.js 12.16.0+ üzerinde `main` alanına alternatif olarak desteklenir. Eski sürümler için, `main` alanı `csv` modülüne yedek olarak işlev görür. Şeffaftır. 

> Kullanım önerisi: `require("csv-parse/dist/cjs/sync.cjs")`'i `require("csv-parse/sync")` alternatif olarak kullanın.  
> — Kullanım kılavuzu

## Bu paketin eski sürümleri

Sürüm 2 ve altındaki sürümlerde, modül imzası şöyleydi:

```js
const parse = require('csv-parse');
// Ve
const parse = require('csv-parse/lib/sync');
```