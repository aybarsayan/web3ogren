---
title: Seçenek objname
description: objname seçeneği, kayıtları anahtar olarak bir alan kullanarak ilişkilendirir. Bu seçenek ile veri yapılandırması yapılırken belirli bir alan veya konum üzerinden işlemler gerçekleştirilir.
keywords: ['csv', 'parse', 'options', 'objname', 'index', 'position', 'name', 'field']
---

# Seçenek `objname`

`objname` seçeneği, kayıtları anahtar olarak bir alan kullanarak ilişkilendirir.

`columns` seçeneği ile, alan sütun adıyla tanımlanır. Bir dizi veya bir tampon (buffer) olmalıdır. :::tip Bu seçeneği kullanmadan önce `column` seçeneğini belirlemek önemlidir; aksi halde alan indeks konumu ile tanımlanır. Bu bir sayı olmalıdır.

* Tür: `string` | `Buffer` | `number`
* Opsiyonel
* Varsayılan: `undefined`
* Başlangıç: ilk günler
* İlgili: `column`, `info`, `raw` &mdash; `Mevcut Seçenekler` bölümüne bakın

Seçenek, `raw` ve `info` seçenekleri ile uyumludur.

## Sütun adı olarak

Alan adları, bir kayıt özelliğine atıfta bulunur. Bu nedenle, kayıtların dizi yerine nesne literal olarak oluşturulabilmesi için sütun seçeneğinin kullanılması gereklidir. 

Aşağıda, [`objname` seçeneği bir dizidir](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.objname.column.js) ve `c2` sütununu tanımlar:

`embed:packages/csv-parse/samples/option.objname.column.js`

## İndeks adı olarak

İndeks adları, bir kayıt alanına konumu ile atıfta bulunur. Bu nedenle, kayıtlar dizi olarak oluşturulmalıdır.

:::info Aşağıda, [`objname` seçeneği bir sayıdır](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.objname.index.js) ve `1` indeksinde ikinci konumu tanımlar:

`embed:packages/csv-parse/samples/option.objname.index.js`