---
title: Seçenek quoted_empty
description: Boş dizeleri alıntı yapın; bu seçenek, boş dizeler için `quoted_string`'i geçersiz kılar. Boş dizeleri alıntı yaparken dikkate almanız gereken önemli noktaları keşfedin.
keywords: [csv, stringify, options, quotes, delimiter, escape]
---

# Seçenek `quoted_empty`

Boş dizeleri alıntı yapın. Belirlendiğinde boş dizeler için `quoted_string`'i geçersiz kılar.

* **Tür:** `boolean`
* **Opsiyonel**
* **Varsayılan:** `false`
* **Sürüm:** 0.0.4
* **İlgili:** `quote`, `quoted_match`, `quoted_string`, `quoted` &mdash; `Mevcut Seçenekler` bölümüne bakın

:::info
Belirli koşullar altında alanların ne zaman alıntı yapılacağını kontrol etmek için birkaç seçenek mevcuttur. Alternatifleri gözden geçirdiğinizden emin olun.
:::

## Örnek

> Boş olarak değerlendirilen alanlar alıntıya alınacak; bu, boş bir dize ile `false`, `null` ve `undefined` değerlerini içerir.  
> — Kaynak: [`quoted_empty örneği`](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples/option.quoted.js)


Örnek Detaylar

[quoted_empty örneği](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples/option.quoted.js) üzerinde her boş olarak değerlendirilen alan alıntı yapılır.
 


`embed:packages/csv-stringify/samples/option.quoted.js`