---
title: Option to_line
description: Option "to_line" istek üzerine bir satır numarasına kadar kayıtları işler. Bu seçenek, veri işlemede belirli bir esneklik ve kontrol sağlar.
keywords: [csv, parse, options, columns, data processing, records, line number]
---

# Option `to_line`

`to_line` seçeneği, istenen satır numarasına kadar kayıtları işler. Varsayılan olarak `-1` değeri ile devre dışıdır.

* Tür: `number`
* Zorlama: `string` to `number`
* Opsiyonel
* Varsayılan: `-1`
* Doğrulama: pozitif tamsayı
* İtibaren: 4.0.0
* İlgili: `from_line`, `from`, `to` &mdash; `Mevcut Seçenekler` kısmına bakın.

:::info
Değere eşit olan satır işlenir ve kayıt çıktıya dahil edilir. Eğer kayıt satırda bitmiyorsa, örneğin yeni satır karakteri kaçırılmışsa veya alıntılanmışsa, dikkate alınmayacaktır.
:::

## Örnek

Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.to_line.js) ilk iki satırı döndürür ve sonrası gelen tüm kayıtları atlar.

```javascript
// Option to_line example
```


Ekstra Bilgi
Aşağıda `to_line` seçeneğinin nasıl çalıştığına dair bir örnek verilmiştir.


---