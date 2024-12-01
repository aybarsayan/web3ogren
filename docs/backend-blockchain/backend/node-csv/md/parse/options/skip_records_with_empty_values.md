---
title: Option skip_records_with_empty_values
description: skip_records_with_empty_values seçeneği, boş değer içeren satırlar için kayıt oluşturmaz. Bu seçenek, veri işleme süreçlerinde boş kayıtları dikkate almamak için kullanılır.
keywords: [csv, parse, options, skip_records_with_empty_values, columns, boş değerler, veri işleme]
---

# Option `skip_records_with_empty_values`

`skip_records_with_empty_values` seçeneği, **boş değerler** (sutün eşleşmesi `/\s*/`), **boş Buffer** veya `null` ve `undefined` değerine eşit olan satırlar için kayıt oluşturmaz ve varsayılan olarak `false` değerine sahiptir.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Versiyon: 1.1.8
* İlgili: `skip_empty_lines`, `skip_records_with_error` &mdash; `Mevcut Seçenekler` bölümüne bakınız

## Kullanım

:::tip
Boş kayıtları atlamak, veri analizi ve işleme süreçlerinizde daha temiz bir veri seti elde etmenize yardımcı olur.
:::

[Bu örnekte](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.skip_records_with_empty_values.js), ikinci satır, sıfır karakter, boşluk ve sekmelerden oluşan boş alanlar içermektedir:


Örnek Kod

```javascript
// Örnek kod
const parse = require('csv-parse');
```


> "skip_records_with_empty_values" seçeneği kullanıldığında, dosyadaki tüm boş satırlar göz ardı edilir.  
> — Belirli durumlarda bu, analiz için daha iyi veri elde edilmesine yol açar.

--- 

```embed:packages/csv-parse/samples/option.skip_records_with_empty_values.js```