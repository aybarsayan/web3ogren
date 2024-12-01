---
title: Seçenek escape_formulas
description: =`, `+`, `-`, `@`, `\t` veya `\r` ile başlayan değerlerin `'` ile kaçırılması ve CSV enjeksiyon saldırılarına karşı korunma yöntemleri hakkında bilgi verilmektedir. Bu seçenek, CSV formatında özel karakterler içeren değerleri güvenli bir şekilde işlemek için kullanılır.
keywords: ['csv', 'stringify', 'options', 'escape_formulas', 'quotes', 'escape', 'safety']
---

# Seçenek `escape_formulas`

:::info
`=`, `+`, `-`, `@`, `\t` veya `\r` ile başlayan değerleri `'` ile kaçırın ve CSV enjeksiyon saldırılarına karşı savunun.
:::

* Tür: `Boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 6.3.0
* İlgili: `quote`, `escape` &mdash; `Mevcut Seçenekler` sayfasına bakın

---

## Örnek

[Kaçırma formülleri örneği](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples/option.escape_formulas.js) içinde, `=` ve `@` ile başlayan her alan, değerine `'` eklenerek kaçırılmaktadır. 

> "Bu uygulama ile CSV enjeksiyon saldırılarına karşı koruma sağlanmaktadır."  
> — CSV Güvenliği Uzmanı

```javascript
// Örnek kod bloğu
const { stringify } = require('csv-stringify');

// Diğer kodlar...
```


Detayları Göster

Bu seçenek, veri güvenliğini artırmak için kullanılan bir dizi önlemden sadece biridir. Diğer önlemler arasında verilerin doğrulanması ve yetkilendirilmesi gibi konular da bulunmaktadır.

