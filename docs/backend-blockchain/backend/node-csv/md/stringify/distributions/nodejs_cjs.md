---
title: ECMAScript modülleri
description: CSV stringify'in CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş Node.js paketleri için uygundur. Bu belge, kullanıcıların gerekli bilgileri edinmelerine yardımcı olur ve desteklenen Node.js sürümleri hakkında bilgi verir.
keywords: ['csv', 'stringify', 'CJS', 'CommonJS', 'modüller', 'Node.js', 'paketler']
sort: 2.2
---

# Node.js CommonJS (CJS)

CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş Node.js paketleri için uygundur. **Kodunuzda şu şekilde kullanılabilir:**

* **Akış ve geri çağırma API'si:** `const {stringify} = require('csv-stringify');`
* **Senkron API:** `const {stringify} = require('csv-stringify/sync');`

:::info
Ek bilgiler `proje CommonJS` belgelerinde mevcuttur.
:::

## Desteklenen Node.js sürümleri

Bu paketin CommonJS dağıtımı, Node.js sürüm 8.3 ve üzerindeki sürümlerin kullanımını destekler. Ancak, modül yolu Node.js sürümünüze bağlı olarak farklılık gösterir.

İçeride, `package.json` dosyasında [`export` özelliği](https://nodejs.org/api/packages.html#packages_exports) `csv-stringify` ve `csv-stringify/sync` giriş noktalarını tanımlar. [`./dist/cjs` klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/lib) içindeki modülleri açığa çıkarır.

:::tip
Node.js 12+ sürümünde `main` alanı için alternatif olarak desteklenmektedir. Daha eski sürümler için, `main` alanı `csv` modülünün geri dönüşü olarak işlev görür.
:::

> Bu şeffaftır. `require("csv/dist/cjs/sync.cjs")`'i `require("csv/sync")` için alternatif olarak kullanın.  
> — Node.js Kullanım Rehberi

---

## Bu paketin eski sürümleri

2 ve altındaki sürümlerde, modül imzası şu şekildeydi:

```js
const stringify = require('csv-stringify');
// Ve
const stringify = require('csv-stringify/lib/sync');
```