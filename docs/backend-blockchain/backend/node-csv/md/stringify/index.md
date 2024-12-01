---
title: Kullanım
description: Node.js `stream.Transform` API'sini uygulayan CSV stringifier. Bu paket, kayıtları CSV metnine dönüştürerek hem basit hem de güçlü bir çözüm sunmaktadır. Geniş bir topluluk tarafından test edilmiştir ve bir dizi güçlü özellikle gelmektedir.
keywords: ['csv', 'stringify', 'node.js', 'stream', 'features', 'usage']
sort: 1
---

# Node.js için CSV Stringifier

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-csv/nodejs.yml?branch=master)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/csv-stringify)](https://www.npmjs.com/package/csv-stringify)
[![NPM](https://img.shields.io/npm/v/csv-stringify)](https://www.npmjs.com/package/csv-stringify)

Bu paket, kayıtları bir CSV metnine dönüştüren bir stringifier'dır ve Node.js [`stream.Transform` API'sini](https://nodejs.org/api/stream.html) uygular. Ayrıca, kullanım kolaylığı için daha basit senkron ve geri çağırma tabanlı API'ler de sağlar. Hem son derece kolay kullanılabilir hem de güçlüdür. İlk olarak 2010 yılında piyasaya sürülmüş ve geniş bir topluluk tarafından büyük veri setleri üzerinde test edilmiştir.

> **Not:** Bu projeye ait kaynak kodu [GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify) üzerinde mevcuttur.

## Ana özellikler

* Yerel Node.js akış API'sini genişletir
* Opsiyonel geri çağırma API'si ile basitlik
* Özel biçimleyiciler, ayırıcılar, alıntılar, kaçış karakterleri ve başlık desteği
* Büyük veri setlerini destekler
* İlham almanız için tam test kapsamı ve örnekler
* Dış bağımlılık yok
* `csv-generate`, `csv-parse` ve `stream-transform` paketleri ile uyumlu çalışır
* MIT Lisansı

---

## Kullanım

Tam csv modülünü yüklemek için `npm install csv` komutunu çalıştırın veya sadece CSV stringifier ile ilgileniyorsanız `npm install csv-stringify` komutunu çalıştırın.

:::tip
Ölçeklenebilirlik için akış temelli API'yi, basitlik için ise senkron ya da karışık API'leri kullanın.
:::

Kaynak kodu modern JavaScript özelliklerini kullanır ve Node 7.6+ üzerinde yerel olarak çalışır. Daha eski tarayıcılar veya eski Node sürümleri için, "./lib/es5" içindeki modülleri kullanın.

---

## Ek yardım

Kullanım ve örnekler için
`örnek sayfasına`,
[“örnekler” klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples) ve [“test” klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/test) başvurabilirsiniz.