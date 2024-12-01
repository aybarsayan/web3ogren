---
title: Option from_line
description: Option "from_line" istediğiniz satır numarasından itibaren kayıtları işler. Bu seçenek, CSV verilerini daha etkili bir şekilde manipüle etmenizin yanı sıra belirli satırlardan başlamanıza olanak tanır.
keywords: [csv, parse, options, columns, data processing, from_line]
---

# Option `from_line`

`from_line` seçeneği, kayıtları istenen satır numarasından itibaren işler. Satır sayımı `1` ile başlar ki bu varsayılan değerdir, dolayısıyla ilk satır `1`'dir.

* Tür: `number`
* Dönüştürme: `string` to `number`
* Opsiyonel
* Varsayılan: `1`
* Doğrulama: pozitif tam sayı
* Versiyon: 4.0.0
* İlgili: `to_line`, `from`, `to` &mdash; bkz. `Mevcut Seçenekler`

:::tip
Belirli bir satırdan başlayarak verileri işlemek, büyük veri setlerinde performansı artırabilir. İlk satırın başlık olarak kullanılması, veri analizi için önemlidir.
:::

## İki sütunlu isimlerin çıkarıldığı basit örnek

Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.from_line.js) ilk satırları atlayarak ikinci satırdan sonra kayıtları döndürmektedir. İlk kayıt, sütun adlarını belirlemek için kullanılır:

> "Kayıtları belirli bir satırdan işlemek, CSV dosyalarının doğru bir şekilde parse edilmesine yardımcı olur." — CSV Belgelendirmesi


Daha Fazla Bilgi

`from_line` özelliği, belirli satırlardaki verileri atlayarak işlenmesine olanak tanır. Bu, özellikle büyük dosyalarla çalışırken, daha etkili veri alma yöntemleri sağlar.
  


`embed:packages/csv-parse/samples/option.from_line.js`