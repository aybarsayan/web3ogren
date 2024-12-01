---
title: Seçenek kaçışı
description: Kaçış için kullanılan tek karakter, sadece `quote` ve `escape` seçeneklerine uygun karakterlere uygulanır. Varsayılan olarak çift tırnak olan bu seçenek, çıktı formatının doğru hale gelmesinde önemli bir rol oynar.
keywords: [csv, stringify, options, escape, karakter, kaçış]
---

# Seçenek `escape`

Kaçış için kullanılan tek karakterdir. Sadece `quote` ve `escape` seçeneklerine uygun karakterlere uygulanır ve varsayılan olarak çift tırnak (`"`).

* Tür: `string|Buffer`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 0.0.1

## Varsayılan davranış

:::info
Varsayılan kaçış değeri [varsayılan kaçış değeri](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples/option.escape.default.js) çift tırnaktır (`"`). Alıntılar mevcut olduğunda otomatik olarak uygulanır.
:::

`embed:packages/csv-stringify/samples/option.escape.default.js`

---

## Özel bir değer kullanma

:::tip
Özel kaçış örneği olarak [özel kaçış örneği](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples/option.escape.custom.js), alternatif ters bölü işareti (`\`) kullanır. Bu, bazı durumlarda daha iyi sonuçlar verebilir.
:::

`embed:packages/csv-stringify/samples/option.escape.custom.js`