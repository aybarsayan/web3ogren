---
title: Seçenek trim
description: trim seçeneği ayırıcı etrafındaki boşluk karakterlerini dikkate almaz. Bu özellik, veri işleme sırasında gereksiz boşlukları temizlemek için oldukça faydalıdır. 
keywords: ['csv', 'ayrıştır', 'seçenekler', 'sütunlar', 'veri işleme']
---

# Seçenek `trim`

`trim` seçeneği, `ayırıcı` etrafındaki boşluk karakterlerini yok sayar. Varsayılan olarak `false` değerini alır. Bir alanın tırnakları içindeki boşlukları kaldırmaz.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Çıkış: erken dönemler
* İlgili: `ltrim`, `rtrim` &mdash; `Mevcut Seçenekler` bölümüne bakın

:::tip
**Boşluk Karakterleri**: Boşluk olarak yorumlanan karakterler, normal ifadelerdeki `\s` meta karakteri ile aynıdır.
:::

* Yatay sekme, `String.fromCharCode(9)`
* NL satır beslemesi, yeni satır, `String.fromCharCode(10)`
* NP Form beslemesi, yeni sayfa, `String.fromCharCode(12)`
* Taşıma dönüşü, `String.fromCharCode(13)`
* Boşluk, `String.fromCharCode(32)`

## Örnek

Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.trim.js), alanların etrafında birden fazla yerde boşluk ekler. 

> **Anahtar Nokta**: `trim` seçeneği, veri işleme sürecinde özellikle boşluk karakterlerinden kaynaklanan hataları önler.  
> — Veri Uzmanı


Ek Bilgi
`trim` seçeneği kullanıldığında, veri girişinizin temiz ve düzenli kalmasını sağlamak için boşlukları kaldırarak analiz süreçlerinizi kolaylaştırır.


`embed:packages/csv-parse/samples/option.trim.js`