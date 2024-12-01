---
title: Seçenek quoted_match
description: Tüm alanları belirli bir düzenli ifadeye uygun olanları alıntıla. Bu seçenek, alanların içeriğine göre belirli bir filtre uygulamak için kullanılabilir.
keywords: [csv, stringify, options, quotes, delimiter, escape, regular expression]
---

# Seçenek `quoted_match`

Tüm alanları belirli bir düzenli ifadeye uygun olanları alıntıla. Değer bir dize, bir RegExp veya bunların herhangi birine sahip bir dizi olabilir.

* **Tür:** `[String|RegExp]` veya `String|RegExp`
* **Opsiyonel**
* **Varsayılan:** `null`
* **Sürüm:** 5.0.0
* **İlgili:** `quote`, `quoted_empty`, `quoted_string`, `quoted`  &mdash; `Mevcut Seçenekler` kısmına bakın

:::note
Belirli koşullar altında alanları ne zaman alıntılayacağınızı kontrol etmek için birkaç seçenek mevcuttur. Alternatifleri incelemeyi unutmayın.
:::

## Dize ile örnek

[quoted_match_string örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.quoted_match_string.js) içinde, `"."` dizesini içeren alanlar alıntılanır.

```javascript
embed:packages/csv-stringify/samples/option.quoted_match_string.js
```

## Düzenli ifade ile örnek

[quoted_match_regexp örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.quoted_match_regexp.js) içinde, `/\./` düzenli ifadesine uyan alanlar alıntılanır.

```javascript
embed:packages/csv-stringify/samples/option.quoted_match_regexp.js
```