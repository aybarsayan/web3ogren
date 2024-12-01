---
title: Seçenek başlığı
description: Sütun seçenekleri sağlandığında veya bulunduğunda sütun adlarını ilk satırda görüntüle. Bu döküman, `header` ve ilgili seçeneklerin kullanımını açıklamaktadır.
keywords: [csv, stringify, seçenekler, başlık, nesne kayıtları]
---

# Seçenek `header`

`header` seçeneği, ilk üretilen kayıtta sütun adlarını oluşturur. Değerin bir boolean değeri olması beklenir.

:::info
Bu seçenek sütun bilgisine sahip olmayı gerektirir. Sütun adları, kayıtlar bir nesne olarak sağlandığında kayıtlar üzerinden keşfedilebilir.
:::

Ayrıca `columns` seçeneği` aracılığıyla da sağlanabilir.

Eğer `header` seçeneği ayarlandığında, ilk kayıtta hiçbir sütun tanımlanmadığı veya keşfedilmediği durumlarda çalışma zamanında bir hata iletilir. 
> Hata mesajı: **Keşfedilemeyen Sütunlar: header seçeneği sütun seçeneği veya nesne kayıtları gerektirir.**  
> — Hata Kaynağı

## Nesne kayıtları ile

Eğer ilk kayıt bir literal nesne olarak sağlanmışsa, sütun adları otomatik olarak keşfedilir. Bu durumda, nesnede mevcut olan anahtarlar, `columns` seçeneğini` ayarlamak için kullanılır.

Başlık kaydının üretilmesini etkinleştirmek için, değeri `true` olarak ayarlayın; bu, [başlık örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.header.js) olduğu gibi:

```
embed:packages/csv-stringify/samples/option.header.js
```

Bu örneği `node samples/option.header.js` komutuyla çalıştırın.

## `header` ve `columns` ile birlikte kullanımı

Eğer başlıkları ilk satırda çıkarmak istiyorsanız, bu seçeneği `header` seçeneği ile birlikte kullanabilirsiniz. Sütun tanım nesnesi, varsayılan olarak `key` özelliğine sahip optional bir [`header` özelliği alabilir](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.header_with_columns_array_strings.js):

```
embed:packages/csv-stringify/samples/option.header_with_columns_array_strings.js
```

:::tip
Bu örnek, [sütun seçeneğini bir nesne olarak tanımlamak](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.header_width_columns_object.js) suretiyle basitleştirilmiş olabilirdi. Bu yaklaşım, JavaScript'in garanti etmediği nesne özellik sırasına bağımlılığı gerektirdiğinden önerilmez.
:::

```
embed:packages/csv-stringify/samples/option.header_width_columns_object.js
```