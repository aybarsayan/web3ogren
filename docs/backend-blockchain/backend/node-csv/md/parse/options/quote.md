---
title: Seçenek alıntısı
description: Seçenek "alıntı", bir alanı çevrelemek için kullanılan karakterleri tanımlar. Bu yapılandırma, CSV dosyalarını parse etme sürecinde, alıntı işaretlerinin doğru bir şekilde yönetilmesini sağlar.
keywords: ['csv', 'ayırma', 'seçenekler', 'objname', 'indeks', 'konum', 'isim', 'alan']
---

# Seçenek `alıntı`

`alıntı` seçeneği, bir alanı çevrelemek için kullanılan karakterleri tanımlar.

Alanın etrafında alıntıların bulunması isteğe bağlıdır ve otomatik olarak algılanır. **Değer bir veya birden fazla karakter** olabilir. Alıntıların algılanması `null`, `false` ve boş dize değerleri ile devre dışı bırakılır. Varsayılan olarak `"` (çift alıntı) olarak ayarlanmıştır.

* Tür: `string` | `Buffer` | `[string|Buffer]`
* İsteğe bağlı
* Varsayılan: `"` (çift alıntı)
* Sürüm: 0.0.1
* İlgili: `ayırıcı`, `kaçış`, `kayıt_ayırıcı`, `rahat_alıntılar` &mdash; `Mevcut Seçenekler` bölümüne bakınız.

---

## Varsayılan davranış

`alıntı` seçeneği varsayılan olarak `"`. Alanlar alıntılanmaya gerek duymamaktadır, [bu örnekte](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.quote.default.js) gösterildiği gibi:

`embed:packages/csv-parse/samples/option.quote.default.js`

:::info
Varsayılan ayar olan `"` kullanıldığında, çoğu durumda alıntısız veri işlemesi sağlanır.
:::

---

## Alan içindeki alıntılar

Bir alanda mevcut olan alıntı karakterleri `kaçış` ile belirtilmelidir. Varsayılan kaçış karakteri `"`.

[Bu örnek,](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.quote.escape.js) ikinci alanda alıntılar içermektedir:

`embed:packages/csv-parse/samples/option.quote.escape.js`

:::tip
Kaçış karakterlerini doğru bir şekilde kullanmak, alıntıların sorunsuz bir şekilde işlenmesini sağlar.
:::