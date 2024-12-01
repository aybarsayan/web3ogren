---
title: Seçenek ltrim
description: ltrim seçeneği, bir CSV alanının sol tarafındaki boşlukları yok sayar. Bu özellik, veri analizi yaparken alanları düzenlemek ve hatasız işler elde etmek için kullanışlıdır.
keywords: [csv, parsel, seçenekler, sütunlar, veri analizi, boşluk temizleme]
---

# Seçenek `ltrim`

`ltrim` seçeneği, bir CSV alanının sol tarafındaki **boşluk karakterlerini** yok sayar. Varsayılan değeri `false`'dır. Bir alanın içerisindeki tırnakların içindeki boşlukları kaldırmaz.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* İle: ilk günlerde
* İlgili: `trim`, `rtrim` &mdash; `Mevcut Seçenekler` kısmına bakınız

:::tip
**Not:** Hangi karakterlerin boşluk olarak yorumlandığını öğrenmek için `trim` belgelerine başvurun.
:::

## Örnek

Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.ltrim.js), alanlar etrafında birden fazla yerde boşluklar tanımlar. Soldaki boşluklar kaldırılırken diğerleri korunur.

> "ltrim, CSV verilerini işlerken **alanların** temizlenmesini sağlar."  
> — Belirtilen kaynak


Detaylı Bilgi

`ltrim` seçeneği kullanıldığında, CSV dosyasındaki her bir alanın sol tarafında bulunan boşluk karakterleri silinir. Bu işlem, **veri analizi** sürecini kolaylaştırarak **hata olasılığını** azaltır.
  


`embed:packages/csv-parse/samples/option.ltrim.js`