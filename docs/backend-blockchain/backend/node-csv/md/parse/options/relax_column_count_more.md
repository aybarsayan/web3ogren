---
title: Seçenek relax_column_count_more
description: relax_column_count_more seçeneği, kayıtlar arasında alan sayısında tutarsızlık olan veri kümelerini, alan sayısı beklentiden düşük olduğu sürece toler eder. Bu özellik, veri analizinde esneklik sağlamak için kullanılır.
keywords: ['csv', 'parse', 'options', 'relax_column_count_more', 'columns']
---

# Seçenek `relax_column_count_more`

`relax_column_count_more` seçeneği, `relax_column_count` seçeneğinden` ilham alınarak geliştirilmiştir. Kayıtlar arasında alan sayısında tutarsızlık olan veri kümelerini, alan sayısı beklentiden daha fazla olduğu sürece toler eder.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 4.8.0
* İlgili: `relax_column_count`, `quote`, `relax_column_count_less` &mdash; `Mevcut Seçenekler` bölümüne bakın.

Özel uygulama detaylarını öğrenmek için `relax_column_count` seçeneğine` başvurun.

:::tip
Bu seçenek, veri kümesine esneklik kazandırarak analiz sürecini kolaylaştırır.
:::

## Kullanım

[Bu örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.relax_column_count_more.js), ikinci satırın, ilk satırdan daha fazla alana sahip olmasına rağmen nasıl tolerans gösterildiğini göstermektedir.


Örnek Kodu Görüntüle

```javascript
// Örnek kod
const parse = require('csv-parse');
const fs = require('fs');

fs.createReadStream('input.csv')
  .pipe(parse({ relax_column_count_more: true }))
  .on('data', function (row) {
    console.log(row);
  });
```



`embed:packages/csv-parse/samples/option.relax_column_count_more.js`