---
title: Bilgi özellikleri
description: CSV Parse - bilgi özellikleri. Bu belge, CSV Parse ile ilgili iç bilgilerin raporlanmasını sağlamakta ve veri kümesi, kayıt ve alan bilgilerini detaylandırmaktadır. Ayrıca, hata durumları ve çeşitli seçenekler hakkında bilgiler içermektedir.
keywords: [csv, parse, count, counter, information, lines, records]
sort: 6
redirects:
 - /parse/state/
---

# CSV Parse bilgi özellikleri

Bilgi özellikleri, işlenmiş kayıt sayısı gibi iç bilgileri rapor eder.

Bilgiler, erişim şekline ve yerine bağlı olarak birden fazla ayrıntı düzeyine sahiptir. Genel veri kümesine, bir kayda veya bir alana uygulanabilir. Kayıt bilgisi, veri bilgisini genişletir. Alan bilgisi, kayıt ve veri kümesi bilgisini genişletir.

## Veri kümesi bilgileri

Bunlar, bir ayrıştırıcı örneğinin `info` nesnesinde mevcuttur ve kullanıcı geri çağrısının üçüncü argümanı olarak da dışa aktarılır.

* `bytes` (sayı)   
  İşlenmiş bayt sayısı.
* `columns` (boolean || nesne)   
  `options.columns` normalleştirilmiş versiyonu.
* `comment_lines` (sayı)   
  Tamamen yorumlanmış satırların sayısını sayar.
* `empty_lines` (sayı)   
  İşlenmiş boş satırların sayısını sayar; versiyon 3'e kadar `empty_line_count` olarak biliniyordu; yalnızca `skip_empty_lines` seçeneği ile çalışır, aksi halde boş bir satır bulunursa bir hata oluşur.
* `invalid_field_length` (sayı)   
  `relax_column_count` true olduğunda, uyumsuz kayıt sayısı; versiyon 3'e kadar `skipped_line_count` olarak biliniyordu.
* `lines` (sayı)   
  Kaynak veri kümesinde karşılaşılan satır sayısı, ilk satır için 1 ile başlar.
* `records` (sayı)   
  İşlenmiş kayıt sayısını sayar.

:::info
Veri kümesi bilgileri, kullanıcılara ayrıştırma sürecinde karşılaşılan durumlar hakkında detaylı bilgi verir.
:::

## Kayıt bilgileri

`info` seçeneği` ve `on_record` seçeneği` ile ortaya konmaktadır. Kullanımını öğrenmek ve sağladıkları ek özellikleri görmek için ilgili belgelerine başvurun.

Tüm veri kümesi bilgilerini ve ek özellikleri içerir:

* `error` (Hata)   
  Karşılaşılan hata, çeşitli rahatlatma seçenekleri ile faydalıdır.
* `header` (boolean)   
  `columns` seçeneği` etkinleştirildiğinde ve geçerli kayıt bir veri kaydı yerine başlık olarak yorumlandığında doğrudur.
* `index` (sayı)   
  Son işlenen alanın konumu.

:::tip
Kayıt bilgileri, CSV verilerinizi işleme esnasında dikkat edilmesi gereken noktaları göz önünde bulundurarak kullanmanızı önerir.
:::

## Alan bilgileri

`cast` seçeneği` ve `cast_date` seçeneği` tarafından, fonksiyonlar olarak tanımlandığında ortaya konmaktadır.

Çalışma zamanı hataları, alan bilgileri ile birlikte zenginleştirilir ve gerektiğinde bazı ek özellikleri içerir.

Tüm veri kümesi ve kayıt bilgilerini, ek özelliklerle birlikte içerir:

* `column` (string || index)   
  `columns` seçeneği aktifse sütun adı veya kayıttaki alan indeks pozisyonu.
* `quoting` (boolean)   
  Alanın tırnak içinde olduğunu belirtir.

:::warning
`cast` ve `cast_date` seçeneklerini kullanırken, veri kaynağınızdaki formatın uygun olduğundan emin olun.
:::

## Dahili `info` nesnesine erişim

`info` nesnesi, doğrudan ayrıştırıcı örneğinden mevcuttur. Nesneyi değiştirmeyin, bazı özellikler ayrıştırıcı tarafından dahili olarak kullanılır.

`embed:packages/csv-parse/samples/api.info.internal.js`

## Geri çağrıda `info`ya erişim

`info` nesnesi, `error` ve `data` argümanlarından sonra geri çağrının üçüncü argümanında sağlanır.

`embed:packages/csv-parse/samples/api.info.callback.js`