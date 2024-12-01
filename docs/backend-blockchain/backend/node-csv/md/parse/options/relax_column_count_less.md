---
title: Option relax_column_count_less
description: relax_column_count_less seçeneği, kayıtlar arasındaki alan sayısının tutarsız olduğu veri kümesine, alan sayısı beklentinin altında olduğu sürece tolerans gösterir. Bu özellik, veri işleme sırasında çeşitli senaryoları yönetmek için kullanışlıdır.
keywords: ['csv', 'parse', 'options', 'relax_column_count_less', 'columns', 'data processing', 'flexibility']
---

# Option `relax_column_count_less`

`relax_column_count_less` seçeneği, `relax_column_count` seçeneğinden` esinlenmiştir. Kayıtlar arasındaki alan sayısının tutarsız olduğu veri setlerine tolerans gösterir; yeter ki alan sayısı beklentinin altında olsun.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Çıktı: 4.8.0
* İlgili: 
  * `relax_column_count` 
  * `quote`
  * `relax_column_count_more` 
  * &mdash; `Mevcut Seçenekler` bölümüne bakın

:::info
Özel uygulama ayrıntılarını öğrenmek için `relax_column_count` seçeneğine` başvurun.
:::

## Kullanım

[Bu örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.relax_column_count_less.js), ikinci satırın ilk satırdan daha az alana sahip olmasına rağmen nasıl tolerans gösterildiğini göstermektedir.

:::tip
Bu seçenek, veri setinizde esneklik sağlamak için önemlidir. Özellikle tutarsız verilerle çalışıyorsanız, iş akışınızı iyileştirebilir.
:::

`embed:packages/csv-parse/samples/option.relax_column_count_less.js`
```
