---
title: Option relax_quotes
description: Option "relax_quotes" unquoted alan içindeki alıntıları korur. Bu seçenek, CSV verilerindeki alıntıların nasıl işleneceği ile ilgili önemli bir kontrol sağlar. Alanların içinde yer alan alıntı karakterlerinin korunmasını sağlayarak veri bütünlüğünü artırır.
keywords: [csv, parse, options, relax_quotes, quotes]
---

# Option `relax_quotes`

`relax_quotes` seçeneği, alıntı yapılmamış alan içindeki alıntıları korur.

* **Tür:** `boolean`
* **Opsiyonel**
* **Varsayılan:** `false`
* **Sürüm:** 0.0.1
* **İlgili:** `quote` &mdash; `Mevcut Seçenekler` bölümüne bakın.

## Kullanım

:::info
`relax_quotes` kullanımı, CSV verilerinin doğru şekilde işlenmesi için önemlidir. Bu ayar, alıntı karakterlerinin korunmasına olanak tanır.
:::

İkinci alan alıntı yapılmamış ve [içinde bir alıntı karakteri](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.relax_quotes.js) bulunmaktadır:

```javascript
embed:packages/csv-parse/samples/option.relax_quotes.js
```

> **Önemli Not:** Bu özellik sadece veri analizi sırasında kritik öneme sahip olabilir, çünkü alıntı karakterleri veri bütünlüğünü etkileyebilir.
> — Dokümantasyon Ekibi