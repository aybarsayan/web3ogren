---
title: ECMAScript modülleri
description: Callback API tüm kayıtları dönüştürür ve sonuçları bir kullanıcı tarafından sağlanan işlevine geçirilen tek bir veri kümesine tamponlar. Bu belge, Node.js ECMAScript modülleri kullanımı ile ilgili bilgiler sunmaktadır.
keywords: [csv, esm, node.js, ECMAScript, modüller, API, paketler]
sort: 4.1
---

# Node.js ECMAScript modülleri (ESM)

Bu projenin paketleri [ECMAScript modülleri](https://nodejs.org/api/esm.html) olarak yazılmıştır. `csv` paketini kullanırken, aşağıdaki içe aktarma direktiflerini kullanın:

```js
// Akış ve callback API'leri için
import {generate, parse, transform, stringify} from 'csv';
// Veya senkron API için
import {generate, parse, transform, stringify} from 'csv/sync';
```

:::tip
Dikkat: Bireysel paketleri kullanırken içe aktarma işlemlerini dikkatlice yapın.
:::

Bireysel paketleri kullanırken:

```js
// Akış ve callback API'leri için
import {generate} from 'csv-generate';
import {parse} from 'csv-parse';
import {transform} from 'stream-transform';
import {stringify} from 'csv-stringify';
// Veya senkron API için
import {generate} from 'csv-generate/sync';
import {parse} from 'csv-parse/sync';
import {transform} from 'stream-transform/sync';
import {stringify} from 'csv-stringify/sync';
```

## Desteklenen Node.js sürümleri

Sürümlerle ilgili olarak, **ECMAScript modülleri**, bu paket ile ve `--experimental-modules` bayrağı etkinleştirildiğinde Node.js sürüm **12.16** ile çalışmaya başladı. Sürüm **12.17**'den itibaren `--experimental-modules` bayrağının kullanımı gerekli değildir.

:::info
İçsel olarak, `package.json` dosyasındaki `export` özelliği modülleri [`./lib` klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv/lib) içinde açığa çıkarır.
:::

`CommonJS dağıtımı` Node.js'in daha eski sürümlerini sürüm **8.3** ile destekler.

---

## Bu paketlerin eski sürümleri

> ECMAScript modülleri desteği `csv`'nin 6.0.0 sürümüyle geldi. Önceki sürümler **CommonJS** belgelerine atıfta bulunmalıdır.  
> — Node.js ESM Belgeleri