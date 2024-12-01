---
title: Kullanım
description: Node.js `stream.Readable` API'sini uygulayan CSV ve nesne üretimi. Bu paket, rastgele veri kümeleri oluşturmak ve JavaScript nesneleri üretmek için esnek bir yöntem sunar.
keywords: [csv, üret, node.js, stream, özellikler, kullanım, veri]
sort: 1
---

# CSV ve nesne üretici

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-csv/nodejs.yml?branch=master)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/csv-generate)](https://www.npmjs.com/package/csv-generate)
[![NPM](https://img.shields.io/npm/v/csv-generate)](https://www.npmjs.com/package/csv-generate)

Bu paket, Node.js `stream.Readable` API'sini uygulayan **esnek bir CSV dizesi ve Javascript nesneleri üreticisidir**. Rastgele veya kullanıcı tanımlı veri kümeleri oluşturmak için kullanılabilir.

Bu projenin kaynak kodu [GitHub](https://github.com/adaltas/node-csv) üzerinde mevcuttur.

## Ana özellikler

* Ölçeklenebilir `stream.Readable` uygulaması
* Rastgele veya sahte rastgele tohum bazlı üretim
* "tohum" seçeneği ile idempotans
* Kullanıcı tanımlı değer üretimi
* Birden fazla değer türü (tam sayı, boolean, tarih, ...)
* `csv-parse`, `csv-stringify` ve `stream-transform` paketleriyle iyi çalışır
* MIT Lisansı

---

## Kullanım

Paket NPM'de yayınlanmıştır ve hem NPM hem de YARN ile kurulabilir.

:::tip
Paketi doğrudan kurabilirsiniz. Örneğin, `npm install csv-generate` komutunu kullanarak NPM ile.
:::

```bash
# Paket bağımlılığını kur
npm install csv-generate
# Örnek bir modül yaz
cat > generator.js <<JS
// csv modülünü içe aktar
import generate from 'csv-generate'
// 10 kayıt yazdır
generate({length: 10}).pipe(process.stdout)
JS
# Modülü çalıştır
node generator.js
```

Alternatif bir seçenek, ana modülü `generate` işlevini içeren üst `csv` paketine erişmektir. Örneğin, NPM ile `npm install csv` komutunu kullanarak.

```bash
# Paket bağımlılığını kur
npm install csv
# Örnek bir modül yaz
cat > generator.js <<JS
// csv modülünü içe aktar
import csv from 'csv'
// 10 kayıt yazdır
csv.generate({length: 10}).pipe(process.stdout)
JS
# Modülü çalıştır
node generator.js
```

:::info
Tam csv modülünü kurmak için `npm install csv` komutunu çalıştırın veya sadece CSV üreticisiyle ilgileniyorsanız `npm install csv-generate` komutunu çalıştırın.
:::

Kaynak kod modern JavaScript özelliklerini kullanır ve Node sürüm 8 veya üzerindeki sistemlerde yerel olarak çalışır.

## Ek yardım

Kullanım ve örnekler için, `örnek sayfasına`, [“örnekler” klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/samples) ve [“test” klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/test) başvurabilirsiniz.