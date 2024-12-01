---
title: Seçenek oef
description: Belgedeki son kayıtların ardından karakterleri ayarlayın. 'eof' seçeneği, kayıtların nasıl yapılandırıldığını anlamak için kritik bir öneme sahiptir.
keywords: ['csv', 'stringify', 'options', 'eof', 'record delimiter', 'configuration', 'data processing']
---

# Seçenek `eof`

`eof` seçeneği, `record_delimiter` seçeneğinin değerini son kaydın ardından ekler. Varsayılan olarak etkindir.

* Tür: `boolean`
* İsteğe bağlı
* Varsayılan: `true`
* Sürüm: 0.0.2
* İlgili: `record_delimiter` &mdash; `Mevcut Seçenekler` sayfasına bakın

## Varsayılan davranış

:::info
Varsayılan olarak, `eof` seçeneği [etkindir](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.eof_true.js). Değerini tanımlamamak, `eof`'u `true` olarak ayarlamakla eşdeğerdir.
:::

`embed:packages/csv-stringify/samples/option.eof_true.js`

## Davranışı devre dışı bırakma

:::tip
Son kaydın ardından ekstra karakter eklememek için [`eof` değerini false] (https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.eof_false.js) olarak ayarlayın.
:::

`embed:packages/csv-stringify/samples/option.eof_false.js`