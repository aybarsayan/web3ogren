---
title: Seçenek quoted_string
description: Tüm string tipindeki alanları alıntı yapın. Bu kılavuz, alıntı gerektiren karakter olmasa bile bu seçeneğin nasıl uygulanacağını açıklar.
keywords: [csv, stringify, seçenekler, alıntı, ayırıcı, kaçış, string]
---

# Seçenek `quoted_string`

Tüm string tipindeki alanları alıntı yapın. Bu seçenek, alıntı gerektiren bir karakter olmasa bile uygulanır.

* **Tür:** `boolean`
* **İsteğe bağlı**
* **Varsayılan:** `false`
* **Sürüm:** 0.0.4
* **İlgili:** `quote`, `quoted_empty`, `quoted_match`, `quoted`  &mdash; `Mevcut Seçenekler` bölümüne bakın.

:::info
Belirli koşullar altında alanları ne zaman alıntı yapacağını kontrol etmek için birkaç seçenek mevcuttur. Alternatifleri gözden geçirdiğinizden emin olun.
:::

## Örnek

[quoted_string örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.quoted.js), yalnızca `string` tipindeki boş veya dolu alanların alıntılandığını gösterir.

> “Tüm string tipindeki alanlar alıntı yapılarak işlenir.”  
> — Seçenek Tanımı


Ek Bilgiler

İhtiyaç duyulduğunda bu özelliğin uygulanmasına yönelik detaylar ve kullanım örnekleri burada bulunabilir.



`embed:packages/csv-stringify/samples/option.quoted.js`