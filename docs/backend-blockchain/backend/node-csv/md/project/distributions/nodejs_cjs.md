---
title: ECMAScript modülleri
description: CommonJS dağıtımı, ECMAScript modüllerine henüz geçmemiş Node.js paketleri için uygundur. Bu içerik, Node.js kullanıcılarına CommonJS ile nasıl çalışacaklarını ve uygun kullanımları hakkında önemli bilgiler sunmaktadır.
keywords: [csv, CJS, CommonJS, modüller, Node.js, paketler, import]
sort: 4.2
---

# Node.js CommonJS (CJS)

CommonJS dağıtımı, ECMAScript modüllerine henüz geçmemiş olan Node.js paketleri için uygundur `ECMAScript modülleri`.

:::info
Node.js yerleşik global değişkenleri ve modülleri eklenmez. Bu, performans ve uyumluluk nedenleriyle motivasyona bağlıdır.
:::

Buffer shim hata üretir, [bkz. #303](https://github.com/adaltas/node-csv/issues/303). Uygun shim'leri sağlamak için `tarayıcı IIFE dağıtımını` kullanın veya modülü bir derleme sistemi ile entegre edin.

> **Anahtar Not**: `csv` paketini kullanırken, aşağıdaki import direktiflerini kullanın:

```js
// Akış ve geri çağırma API'leri için
const {generate, parse, transform, stringify} = require('csv');
// Veya senkron API için
const {generate, parse, transform, stringify} = require('csv/sync');
```

Bireysel paketleri kullanırken:

```js
// Akış ve geri çağırma API'leri için
const {generate} = require('csv-generate');
const {parse} = require('csv-parse');
const {transform} = require('stream-transform');
const {stringify} = require('csv-stringify');
// Veya senkron API için
const {generate} = require('csv-generate/sync');
const {parse} = require('csv-parse/sync');
const {transform} = require('stream-transform/sync');
const {stringify} = require('csv-stringify/sync');
```

## Desteklenen Node.js sürümleri

:::tip
Bu paket için CommonJS dağıtımı, Node.js sürüm 8.3 ve üzerinin kullanımını destekler.
:::

Ancak, modül yolu kullanılan Node.js sürümüne bağlı olarak farklılık göstermektedir.

İçsel olarak, `package.json` dosyasındaki [`export` özelliği](https://nodejs.org/api/packages.html#packages_exports) `csv` ve `csv/sync` giriş noktalarını beyan eder. Bu, [`./dist/cjs` klasörünün](https://github.com/adaltas/node-csv/tree/master/packages/csv/lib) modüllerini açığa çıkarır.

Node.js 12+ sürümlerinde `main` alanı yerine alternatif olarak desteklenmektedir. Daha eski sürümlerde, `main` alanı `csv` modülünün yedeklemesi olarak işlev görür. Şeffaftır ancak yalnızca bu modüle uygulanır. 

> **Önemli**: `require("csv/dist/cjs/sync.cjs")` ifadesini `require("csv/sync")` ifadesine alternatif olarak kullanın.

## Bu paketin eski sürümleri

2 ve altındaki sürümlerde, modül imzası şuydu:

```js
const generate = require('csv');
// Ve
const generate = require('csv/lib/sync');
```