---
title: Seçenek rtrim
description: rtrim seçeneği, bir CSV alanının sağ tarafındaki boşlukları yok sayar. Bu özellik, veri işleme sırasında alanların daha temiz olmasını sağlamak için kullanılır.
keywords: [csv, parse, options, columns, rtrim, boşluk, veri işleme]
---

# Seçenek `rtrim`

`rtrim` seçeneği, bir CSV alanının sağ tarafındaki boşluk karakterlerini yok sayar. Varsayılan değeri `false`'dır. Bir alanın içindeki tırnaklar arasındaki boşlukları kaldırmaz.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Çıktı: ilk günlerden itibaren
* İlgili: `trim`, `rtrim` &mdash; `Mevcut Seçenekler` kısmına bakın

:::tip
Hangi karakterlerin boşluk olarak yorumlandığını öğrenmek için `trim` belgelerine başvurun.
:::

## Örnek

Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.rtrim.js), alanlar etrafında birden fazla yerde boşluklar tanımlar. Sağ taraftaki boşluklar kaldırılırken diğerleri korunur.

> "Sağ taraftaki boşluklar kaldırılıyor, ancak içerdeki tırnaklar arası boşluklar korunuyor."  
> — CSV İşleme Rehberi


Daha Fazla Bilgi

`rtrim` seçeneği kullanıldığında, veri setindeki alanların sağındaki gereksiz boşluklar temizlenir, böylece analiz ve işleme aşamalarında daha temiz verilere erişim sağlanır.



`embed:packages/csv-parse/samples/option.rtrim.js`