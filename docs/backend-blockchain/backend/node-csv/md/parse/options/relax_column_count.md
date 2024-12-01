---
title: Seçenek relax_column_count
description: relax_column_count seçeneği, tutarsız alan sayısına sahip veri kümesine tolerans gösterir. Bu seçenek, veri ayrıştırmasında esneklik sağlar ve daha güvenilir veri işlemi yapmanıza olanak tanır.
keywords: [csv, parse, options, relax_column_count, columns, data handling, error tolerance]
---

# Seçenek `relax_column_count`

`relax_column_count` seçeneği, kayıtlar arasında tutarsız alan sayısına sahip veri kümesine tolerans gösterir. Varsayılan olarak, iki kayıt farklı sayıda alana sahipse bir hata fırlatılır.

> **Not:** Bu seçeneğin, benzer şekilde davranan `relax_column_count_less` seçeneği` ve `relax_column_count_more` seçeneği` ile tamamlandığını unutmayın.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 1.0.6
* İlgili: `relax_column_count_less`, `quote`, `relax_column_count_more` &mdash; `Mevcut Seçenekler` bölümüne bakın

Bu seçenek, `columns` seçeneği ile birlikte kullanılabilir. Beklenen alan sayısı, kullanıcı tarafından tanımlanıp tanımlanmadığına göre `columns` seçeneğinin uzunluğu ile belirlenir.

## Varsayılan davranış

[`option.relax_column_count.js` örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.relax_column_count.js) iki alana sahip kayıtlar bekler. İkinci satırda 2 alandan daha az, üçüncü satırda ise 2 alandan daha fazla alan bulunur. `relax_column_count` seçeneği `true` olmasaydı, her iki satır da bir hata oluşturmuş olacaktı.

`embed:packages/csv-parse/samples/option.relax_column_count.js`

---

## Kolonlar ve nesneler ile çalışma

`columns` seçeneği kullanıldığında, kayıtlar kolon seçeneğinde bulunan özellikler ile nesne olarak üretilir ve indeks konumlarına göre ilişkilendirilir. Eğer bir kayıtta kolon sayısından daha az alan varsa, eşleşmeyen kolonlar atılır. Tersi durumda, eğer bir kayıtta kolon sayısından daha fazla alan varsa, eşleşmeyen alanlar atılır. 

:::info
[`option.relax_column_count.columns.js` örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.relax_column_count.columns.js) her iki davranışı da göstermektedir:
:::

`embed:packages/csv-parse/samples/option.relax_column_count.columns.js`

---

## Tutarsız alan sayısı hatalarının işlenmesi

Diğer seçeneklerle birlikte kullanıldığında, tutarsız kayıtları kabul etmek ve kendi ayrıştırma uygulamanızı sağlamak mümkündür. Örneğin, `on_record` seçeneği, kendi özel kodunuzu eklemenizi sağlar. Gerektiğinde, `raw` seçeneği ham kaydı açığa çıkarır. Son olarak, hata kodu da dahil olmak üzere tam hata mevcuttur.

> **Örnek:** Bu, [tutarsız kayıt alan uzunluklarını işlemek için](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.relax_column_count.record_inconsistent_length.js) bir örnektir.

`embed:packages/csv-parse/samples/option.relax_column_count.record_inconsistent_length.js`

Eğer `columns` seçeneği aktifleştirilmişse, davranış benzer ancak hata fırlatma artık `CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH` şeklindedir. `on_record` fonksiyonu herhangi bir değer döndürebilir. Örneğin, [tutarsız kolonlar örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.relax_column_count.record_inconsistent_columns.js), `columns` seçeneği etkinleştirilmiştir ve bir dizi yerine bir nesne literal'i döndürülmektedir.

`embed:packages/csv-parse/samples/option.relax_column_count.record_inconsistent_columns.js`