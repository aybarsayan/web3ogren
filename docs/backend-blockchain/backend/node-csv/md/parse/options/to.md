---
title: Seçenek `to`
description: to seçeneği, istenen kayıt sayısından sonra başlayan kayıtları işler. Kullanıcılar bu seçenekle belirli bir kayıt aralığını kolayca kontrol edebilirler.
keywords: ['csv', 'parse', 'options', 'to', 'count', 'records', 'info']
---

# Seçenek `to`

`to` seçeneği, istenen kayıt sayısına kadar olan kayıtları işler. Sayım 1-bazlıdır, örneğin, **ilk kaydı yayınlamak** için 1 (veya 0 değil) verilmelidir.

* Tür: `number`
* Dönüştürme: `string`'den `number`'a
* İsteğe bağlı
* Varsayılan: `1`
* Doğrulama: pozitif tam sayı
* Sürüm: 4.0.0
* İlgili: `info`, `from`, `to_line` &mdash; `Mevcut Seçenekler` için bakınız

:::tip
Kullanıcılar, `to` seçeneğini kullanarak yalnızca ihtiyaç duydukları kayıt aralığını işleyebilir. Bu, performansı artırabilir.
:::

## Çıkarılan sütun adları

`column` seçeneği aktif olduğunda, **ilk kayıt başlık** olarak işlenir. Bu bir kayıt olarak sayılmaz. Böylece, ilk kayıt özellik adlarını almak için kullanılır ve sayım bir sonraki kayıttan itibaren başlar.

:::info
**Not:** İlk kaydı atmak, veri işleme sürecinde önemli bir avantaj sunar; çünkü bazı durumlarda başlığın verilmesi, kayıtların doğru bir şekilde yorumlanmasını sağlar.
:::

Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.to.js), sütun adlarını belirlemek için ilk `a,b` kaydını okur, ilk iki kaydı döndürür ve sonrasındaki kayıtları atlar.


Örnek kod

```javascript
const parse = require('csv-parse');
const input = `a,b\n1,2\n3,4`;

parse(input, {
  columns: true,
  to: 2
}, (err, records) => {
  console.log(records);
});
```



`embed:packages/csv-parse/samples/option.to.js`