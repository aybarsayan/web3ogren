---
title: Seçenek bom
description: Byte sıralama işaretini (BOM) çıktı akışına ekleyin. Bu özellik, belge kodlamasının doğru bir şekilde belirlenmesine yardımcı olur.
keywords: [csv, stringify, options, bom, utf8, unicode, utf16]
---

# Seçenek `bom`

`bom` seçeneği, [byte sıralama işareti (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) çıktı akışına ekler.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 5.4.0
* İlgili: `Mevcut Seçenekler` bölümüne bakın

## Hakkında

:::info
UTF-8 BOM, bir metin akışının başlangıcındaki byte dizisidir (`EF BB BF` veya `\ufeff`) ve okuyucunun dosyanın UTF-8 olarak kodlanıp kodlanmadığını güvenilir bir şekilde belirlemesine olanak tanır.
:::

## Örnek

Varsayılan değer boolean `false`'dir. 

:::tip
[bom örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.bom.js) seçeneği basitçe etkinleştirir.
:::


Ekstra Bilgi

`embed:packages/csv-stringify/samples/option.bom.js`
