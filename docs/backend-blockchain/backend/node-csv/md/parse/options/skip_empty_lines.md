---
title: Seçenek skip_empty_lines
description: skip_empty_lines seçeneği, boş olan her satırı atlar. Bu özellik, veri işleme süreçlerinde gereksiz satırları ortadan kaldırarak daha temiz ve düzenli bir çıktı elde edilmesini sağlar.
keywords: ['csv', 'ayrı', 'seçenekler', 'skip_empty_lines', 'sütunlar', 'veri işleme', 'temizleme']
---

# Seçenek `skip_empty_lines`

`skip_empty_lines`, boş olan her satırı atlar.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 0.0.5
* İlişkili: `skip_records_with_error`, `trim` &mdash; `Mevcut Seçenekler` bakınız

## Örnek

[`option.skip_empty_line.js` örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.skip_empty_lines.js), değerini `true` olarak ayarlayarak seçeneği etkinleştirir:

`embed:packages/csv-parse/samples/option.skip_empty_lines.js`

---

## Boşluk karakterleri

:::info
Satır tamamen boş olmalıdır, boşluk ve sekme dahil hiçbir karakter içermemelidir.
:::

Eğer böyle karakterler varsa, `skip_empty_lines` seçeneğini [`trim` seçeneği ile ilişkilendirebilirsiniz](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.skip_empty_lines.trim.js):

`embed:packages/csv-parse/samples/option.skip_empty_lines.trim.js`

Bir diğer olasılık, `skip_records_with_empty_values` ve `relax_column_count` kombinasyonunu kullanmaktır.

> **Not:** Bu teknikler, veri analizi ve işleme sürecinde karşılaşılabilecek sorunların çözümünde oldukça faydalıdır.  
> — Dökümantasyon 

---