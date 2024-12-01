---
title: Seçenek bom
description: bom seçeneği, byte sıralama işaretini (BOM) kaldırır. Bu seçenek, UTF-8 dosyaları ile çalışırken kullanışlıdır ve BOM başlıklarının yönetimini kolaylaştırır.
keywords: [csv, ayrıştırma, seçenekler, bom, utf, unicode, utf8]
---

# Seçenek `bom`

`bom` seçeneği, giriş dizesinden veya tamponundan [byte sıralama işaretini (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) çıkarır. Aktif hale geldiğinde, BOM **otomatik olarak tespit edilir** ve ayrıştırma, bir BOM bulunup bulunmadığına bakılmaksızın gerçekleşir.

:::tip
UTF-8 dosyaları ile çalışırken bu seçeneğin her zaman etkinleştirilmesi önerilir.
:::

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürümlerden itibaren: 4.4.0
* İlişkili: `encoding` &mdash; `Mevcut Seçenekler` için bakınız.

## Hakkında

UTF-8 BOM, bir metin akışının başlangıcındaki bir bayt dizisidir (`EF BB BF` veya `\ufeff`) ve okuyucunun dosyanın UTF-8 olarak kodlanıp kodlanmadığını güvenilir bir şekilde belirlemesine olanak tanır.

## Örnek

Varsayılan boolean değeri `false`'dır. [bom örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.bom.js) basitçe seçeneği etkinleştirir:

`embed:packages/csv-parse/samples/option.bom.js`

---

## Çıktıdaki Gizli BOM

Seçenek varsayılan olarak devre dışıdır. UTF-8 girişini içe aktarırken, örneğin UTF-8 ile kodlanmış bir dosyadan okurken, seçeneği etkinleştirmek güvenlidir, hatta BOM başlığını içerip içermediğinden emin olsanız bile.

> Bu seçenek olmadan BOM başlığını yönetmek beklenmedik davranışlara yol açabilir. 
> — Uyarı

BOM baytları çıktı içinde görünmez olarak bulunmaktadır; ya değerlerde ya da `column` seçeneğini kullanırken nesne özelliklerinde.

:::info
Aşağıdaki [örneğe](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.bom.hidden.js) bakınız, bu özellik adının konsolda yazdırılandan farklı olduğunu gösterir:
:::

`embed:packages/csv-parse/samples/option.bom.hidden.js`