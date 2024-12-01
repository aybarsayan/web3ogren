---
title: ECMAScript modülleri
description: Geri çağırma API'si tüm kayıtları dönüştürür ve sonuçları kullanıcı tarafından sağlanan bir işleve geçirilen tek bir veri kümesine tamponlar. Node.js ECMAScript modülleri, `csv-stringify` paketinin nasıl kullanılacağını ve desteklenen sürümlerini açıklamaktadır.
keywords: [csv, stringify, esm, node.js, ECMAScript, modüller]
sort: 2.1
---

# Node.js ECMAScript modülleri (ESM)

`csv-stringify` paketi [ECMAScript modülleri](https://nodejs.org/api/esm.html) olarak yazılmıştır. Koduza şunları içeren yollarla erişebilirsiniz:

* Akış ve geri çağırma API'si: `import {stringify} from 'csv-stringify';`
* Senkron API: `import {stringify} from 'csv-stringify/sync';`

Ek bilgiye `csv` ESM` dokümantasyonunda ulaşabilirsiniz.

## Uygulama

:::tip
`package.json` dosyasındaki `export` özelliği, modüllerin nasıl sergilenmesi gerektiğini tanımlamak için kullanılır. Bu, modüllerin düzenlenmesinde önemli bir adımdır.
:::

İçsel olarak, `package.json` dosyasındaki `export` özelliği, modülleri [`./lib` klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/lib) içinde sergilemektedir.

## Desteklenen Node.js sürümleri

Testlerimize göre, ECMAScript modülleri bu paketle ve Node.js sürüm 12.16 ile `--experimental-modules` bayrağı aktifken çalışmaya başladı. Sürüm 12.17 ile birlikte `--experimental-modules` bayrağının kullanımı artık gerekli değildi.

:::info
Daha eski Node.js sürümleri için, CommonJS dağıtımı sürüm 8.3 ile birlikte desteklenmektedir.
:::

`CommonJS dağıtımı` sürüm 8.3 ile başlayan daha eski Node.js sürümlerini desteklemektedir.

## Bu paketin daha eski sürümleri

ECMAScript modülleri desteği `csv-stringify`'nin 3.0.0 sürümü ile geldi. Önceki sürümler CommonJS dokümantasyonuna atıfta bulunmalıdır.

> “ECMAScript modülleri desteği, gelişmiş işlevsellik sunarak modern uygulama gereksinimlerini karşılamaktadır.”  
> — Geliştirici Belgeleri