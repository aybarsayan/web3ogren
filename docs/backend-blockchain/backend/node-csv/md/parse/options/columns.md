---
title: Seçenek sütunları
description: Seçenek "sütunlar", kayıtları dizi yerine nesne literal olarak oluşturur. Bu seçenek, kullanıcıların veri yapılandırmasını daha esnek bir şekilde yönetmelerine olanak tanır.
keywords: [csv, ayrıştır, seçenekler, sütunlar, nesne literal]
---

# Seçenek `sütunlar`

`Sütunlar` seçeneği, kayıtları nesne literal biçiminde üretir.

:::info
Bu özellik, ayrıştırıcı kayıtları nesne literal olarak yapılandırmanıza yardımcı olur ve veri işlemede esneklik sağlar.
:::

* Tür: `boolean` | `array` | `function`
* Opsiyonel
* Varsayılan: `false`
* İlk Kullanım: ilk günler
* İlgili: `group_columns_by_name` &mdash; `Mevcut Seçenekler` bölümüne bakın

Varsayılan olarak, ayrıştırıcı kayıtları dizi biçiminde üretir. İlişkili değer birden fazla biçim alabilir:

* `true`    
  Sütun adlarını ilk satırdan çıkar.
* `array`    
  Veriyi işlemden önce sütun tanımını belirt.
* `function`   
  Kullanıcıdan dinamik olarak sütun tanımını al.

:::tip
Tanım dizisinde değeri `undefined`, `null` veya `false` olan bir veya daha fazla alan atlanabilir. Böylece, kayıtları daha esnek bir şekilde yönetebilirsiniz.
:::

Birden fazla sütun aynı adı paylaşıyorsa, yalnızca son değer saklanır. Önceki değerler kaybolur. `group_columns_by_name` seçeneği` yineleyen sütun adlarını tespit eder ve tüm değerleri bir diziye yerleştirir.

## True Olarak

Değer `true` ise, veri setindeki ilk kayıt bir başlık olarak kabul edilir. Hiçbir kayıt üretilmez ve her alan yeni bir özellik tanımlar.

> **Önemli Not:** 
> [Desteklenmiş sütunlar örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.columns.true.js) kayıt literal'leri üretir ve özellikleri veri setinin ilk satırı ile eşleşir.  
> — Önemli Bilgi

`embed:packages/csv-parse/samples/option.columns.true.js`

## Dizi Olarak

Değer bir dizi ise, her bir elemana bir özellik karşılık gelir. Değerler bir dize veya `name` özelliği olan bir nesne literal olabilir.

> **Başka Bir Örnek:** 
> [Sütunlar örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.columns.array.js), `sütunlar` seçeneğinin değerleri ile eşleşen kayıt literal'leri üretir.  
> — Ek Bilgi

`embed:packages/csv-parse/samples/option.columns.array.js`

## Fonksiyon Olarak

Değer bir fonksiyon ise, kullanıcı sütun listesini döndürmekten sorumludur. İlk satır bir başlık olarak kabul edilir ve kayıt üretilmez. Fonksiyon, ilk satırı bir alan listesi olarak alır.

:::warning
[Sütunlar örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.columns.function.js) ilk satırdaki her alanı büyük harfe dönüştürür. Fonksiyonun doğru çalıştığından emin olun.
:::

`embed:packages/csv-parse/samples/option.columns.function.js`