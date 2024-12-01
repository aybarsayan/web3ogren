---
title: Seçenek alıntı
description: Boş olmayan tüm alanları alıntılayın. Bu seçenek, alıntı gerektiren karakterler içermese bile tüm alanların nasıl alıntılanacağını belirler.
keywords: [csv, stringify, options, quotes, delimiter, escape]
---

# Seçenek `alıntı`

Boş olmayan tüm alanları, alıntı gerektiren bir karakter olmasa bile alıntılayın. 

Varsayılan olarak, yalnızca bir ayırıcı veya alıntı gibi **özel bir karakter** içeren alanlar alıntı içinde yer alır. 

* **Tür:** `boolean`
* **İsteğe bağlı**
* **Varsayılan:** `false`
* **Sürüm:** 0.0.1
* **İlgili:** `quote`, `quoted_empty`, `quoted_match`, `quoted_string`  &mdash; `Mevcut Seçenekler` kısmına bakın

:::tip
Bazı durumlarda alanları alıntılamak için ne zaman alıntı yapacağınızı kontrol etmek için mevcut olan **çeşitli seçenekler** bulunmaktadır. Alternatifleri gözden geçirdiğinizden emin olun.
:::

## "Alıntı" Kullanarak Örnek

[Alıntılı örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.quoted.js) içinde değerlendirilen her boş alan alıntı içinde değildir. Boş bir dize ve `false`, `null` ve `undefined` değerlerini içerir.


Örnek Detayları

```javascript
// Örnek kod bloğu
const stringify = require('csv-stringify');

stringify(data, {
  quoted: true,
  // diğer seçenekler
});
```



---

`embed:packages/csv-stringify/samples/option.quoted.js`