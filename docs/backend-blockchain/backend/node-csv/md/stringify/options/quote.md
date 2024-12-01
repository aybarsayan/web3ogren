---
title: Seçenek alıntısı
description: Alıntı seçeneği, belirli karakterlerin etrafını sararak metinlerin nasıl gösterileceğini tanımlar. Bu sayfada, alıntı ayarları ve örnekler hakkında bilgi bulabilirsiniz.
keywords: [csv, stringify, options, quote, delimiter, escape, customization]
---

# Seçenek `quote`

Alıntı seçeneği, bir alanın etrafındaki karakterleri tanımlar; **varsayılan olarak** `"` (çift tırnak işaretleri) kullanılır.

:::info
Bir alıntıyı devre dışı bırakmak için seçenek değerini `false` veya boş bir dize olarak ayarlamak mümkündür. Ayar, özel bir karakter içerip içermediğine bakılmaksızın her zaman geçerlidir.
:::

* Tür: `string|Buffer|boolean`
* Opsiyonel
* Varsayılan: `"`
* Sürüm: 0.0.1
* İlgili: `quoted_empty`, `quoted_match`, `quoted_string`, `quoted`  &mdash; `Mevcut Seçenekler` sayfasına bakın

## Örnek

> [özel alıntı örneği](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples/option.quote.custom.js): Özel bir değer tanımlar. Çıktı alanı, varsayılan alan ayırıcı olan virgül içermesi nedeniyle, boru karakteri ile çevrelenmiştir.
> — GitHub Örneği

---


Detaylar

`embed:packages/csv-stringify/samples/option.quote.custom.js`

