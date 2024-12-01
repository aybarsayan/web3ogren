---
title: Seçenek bilgisi
description: info seçeneği, ek bağlam bilgisi sağlamak için iki özellik olan info ve record'u oluşturur. Bu özellikler, veri analizlerinde önemli bir rol oynar ve kullanıcı deneyimini geliştirir.
keywords: [csv, parse, options, bom, utf, unicode, utf8]
---

# Seçenek `info`

`info` seçeneği ek bağlam sağlar. Nesne literali veya diziler şekliyle kayıtlar oluşturmak yerine, iki özellik olan `info` ve `record` oluşturur. `info` özelliği, kaydın oluşturulduğu anda `info nesnesinin` bir anlık görüntüsüdür. `record` özelliği ise mevcut kayıttır.

:::note
Bu seçenek, raw seçeneği ile birlikte kullanılabilir.
:::

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 4.0.0
* İlgili: `cast`, `on_record`, `raw` &mdash; `Mevcut Seçenekler` bölümüne bakın

## Örnek

[`info` seçeneği etkinleştirildiğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.info.js) ve değeri `true` olduğunda, alan iki özellik olan `info` ve `record`'dan oluşur:

> `info` seçeneği etkin olduğunda, veri kaydı daha fazla bilgi içerir.  
> — "Info Seçeneği Kılavuzu"

`embed:packages/csv-parse/samples/option.info.js`

Eğer `info` `false` olsaydı, doğrulama şöyle olacaktı:

```js
assert.deepStrictEqual(records, [
  [ 'a', 'b', 'c' ]
]);
```