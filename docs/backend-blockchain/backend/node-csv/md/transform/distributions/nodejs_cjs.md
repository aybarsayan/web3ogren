---
title: ECMAScript modülleri
description: Stream transform'un CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş olan Node.js paketleri için uygundur. Bu doküman, kodda nasıl kullanılacağını ve desteklenen Node.js sürümlerini açıklamaktadır.
keywords: ['stream', 'transform', 'CJS', 'CommonJS', 'modüller', 'Node.js', 'paket yönetimi']
sort: 2.2
---

# Node.js CommonJS (CJS)

CommonJS dağıtımı, henüz ECMAScript modüllerine geçmemiş olan Node.js paketleri için uygundur. Kodunuzda mevcut:

- **Stream** ve **geri çağırma API'si**: `const {transform} = require('stream-transform');`
- **Senkron API**: `const {transform} = require('stream-transform/sync');`

:::info
Ek bilgi `project CommonJS` belgelerinde mevcuttur.
:::

---

## Desteklenen Node.js sürümleri

Bu paketin CommonJS dağıtımı, Node.js sürüm 8.3 ve üzerinin kullanımını destekler. Ancak, modül yolu Node.js sürümünüze göre farklılık gösterir.

İçerisinde [`export` property](https://nodejs.org/api/packages.html#packages_exports) bulunan `package.json` dosyası, `stream-transform` ve `stream-transform/sync` giriş noktalarını tanımlar. [`./dist/cjs` klasöründeki](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform/lib) modülleri açığa çıkarır.

:::tip
Node.js 12+ sürümlerinde `main` alanına alternatif olarak desteklenmektedir. Eski sürümlerde, `main` alanı `csv` modülünün bir geri dönüşü olarak davranır.
:::

Şeffaftır. `require("csv/dist/cjs/sync.cjs")` kullarak `require("csv/sync")` yerine geçebilirsiniz.

---

## Bu paketin eski sürümleri

2 ve altındaki sürümlerde, modül imzası şu şekildeydi:

```js
const transform = require('stream-transform');
// Ve
const transform = require('stream-transform/lib/sync');
```

> **Not:** Eski sürümlerle çalışırken, mevcut kullanımınızda uyumsuzluklara dikkat edin. 
> — Dikkat Edilmesi Gerekenler