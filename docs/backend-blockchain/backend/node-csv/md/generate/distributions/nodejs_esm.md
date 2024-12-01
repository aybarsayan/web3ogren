---
title: ECMAScript modülleri
description: Callback API, tüm kayıtları dönüştürür ve sonuçları kullanıcı tarafından sağlanan bir işleve geçirilen tek bir veri kümesine tamponlar. Bu belgede, Node.js ECMAScript modülleri ve ilgili detaylar ele alınmaktadır.
keywords: [csv, üret, esm, node.js, ECMAScript, modüller]
sort: 2.1
---

# Node.js ECMAScript modülleri (ESM)

`csv-generate` paketi [ECMAScript modülleri](https://nodejs.org/api/esm.html) olarak yazılmıştır. Kodunuzda şu şekilde kullanılabilir:

* Akış ve callback API: `import {generate} from 'csv-generate';`
* Senkron API: `import {generate} from 'csv-generate/sync';`

Ek bilgiler `csv` ESM` belgelerinde mevcuttur.

## Uygulama

İçsel olarak, `package.json` dosyasındaki `export` özelliği [`./lib` klasöründeki](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/lib) modülleri açığa çıkarır.

## Desteklenen Node.js sürümleri

:::info
Yaptığımız testlere göre, ECMAScript modülleri bu paket ile birlikte ve `--experimental-modules` bayrağı etkinleştirildiğinde Node.js sürüm 12.16 ile çalışmaya başladı. Sürüm 12.17 ile birlikte, `--experimental-modules` bayrağının kullanımı artık zorunlu değildi.
:::

`CommonJS dağıtımı` sürüm 8.3 ile başlayan daha eski Node.js sürümlerini desteklemektedir.

## Bu paketin eski sürümleri

> ECMAScript modülü desteği, `csv-generate` paketinin 3.0.0 sürümü ile birlikte geldi. Önceki sürümler, CommonJS belgelerine atıfta bulunmalıdır.  
> — `csv-generate` belgeleri