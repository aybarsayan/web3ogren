---
title: Senk API
description: Senk API, giriş olarak tam bir kayıt veri kümesi bekleyen ve stringleştirilmiş CSV içeriği döndüren bir fonksiyonu açığa çıkarır. Bu API, kayıtları geçirerek basit ve tutarlı bir çıktı sağlar, bu nedenle veri kümeniz belleğe sığıyorsa ideal bir çözümdür.
keywords: [csv, stringify, api, sync, memory, function]
sort: 3.3
---

# Senk API

Senk API, bir [saf fonksiyon](https://en.wikipedia.org/wiki/Pure_function) gibi davranır. Belirli bir girdi seti ve seçeneklerinden oluşan bir girdi için her zaman aynı çıktı verilerini üretir.

:::info
Bu durum, bir fonksiyona yapılan düzenli bir doğrudan senkron çağrıyı temsil eder: kayıtları geçirirsiniz ve bir CSV metni döner.
:::

Basitliği nedeniyle, ölçeklenebilirliğe ihtiyacınız yoksa ve veri kümeniz belleğe sığıyorsa bu önerilen yaklaşımdır.

İçeri aktarılması gereken modül `csv-stringify/sync`'dir ve imza `const data = stringify(records, [options])` şeklindedir; bu, [senk örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/api.sync.js) ile gösterilmiştir:

```
`embed:packages/csv-stringify/samples/api.sync.js`