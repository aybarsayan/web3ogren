---
title: cast_date` Seçeneği
description: cast_date` seçeneği, CSV alanını JavaScript tarihine dönüştürmek için kullanılır. Aktif olması için `cast` seçeneğinin etkinleştirilmesi gerekmektedir. Bu belge, seçeneklerin kullanımına dair detaylı bilgileri içermektedir.
keywords: ['csv', 'ayrıştır', 'seçenekler', 'cast_date', 'cast', 'bağlam', 'satırlar']
---

# Seçenek `cast_date`

`cast_date` seçeneği, CSV alanını bir JavaScript tarihine dönüştürür. Aktif olması için `cast` seçeneğinin etkinleştirilmesi gerekmektedir.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 1.0.5
* İlgili: `cast`, `info`, `on_record` &mdash; `Mevcut Seçenekler` bölümüne bakın.

:::tip
`cast_date` seçeneğini kullanarak tarih formatlarında sorunsuz dönüşüm sağlayabilirsiniz.
:::

Uygulama [`Date.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) fonksiyonuna dayanmaktadır. Fonksiyon `NaN` dönerse, CSV değeri dokunulmadan bırakılır.

## Tarihçe

Bu seçenek, sürüm 2'ye kadar `auto_parse_date` olarak adlandırılmıştır.

## Kullanım

Aktif olduğunda [`cast_date` ile `true`](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.cast_date.js), her alan `Date.parse` ile test edilir. JavaScript tarihine dönüştürme başarılı olursa, yeni tarih döner. Aksi takdirde, orijinal değer döner.

:::info
`cast_date` seçeneğinin aktif olması, herhangi bir hata durumunda CSV değerinin direkt olarak kullanılmasına olanak tanır.
:::


Örnek Kullanım

```javascript
// Örnek kod
const { parse } = require('csv-parse');

parse(input, {
  cast: true,
  cast_date: true,
}, (err, records) => {
  console.log(records);
});
```



`embed:packages/csv-parse/samples/option.cast_date.js`