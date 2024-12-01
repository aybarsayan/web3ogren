---
title: Seçenek record_delimiter
description: "`record_delimiter` seçeneği, bir kaydın nasıl birden çok alana bölüneceğini belirtir. Bu seçenek, kayıtları ayırmak için kullanılan karakterleri tanımlar ve kullanım kolaylığı sağlar."
keywords: ['csv', 'parse', 'options', 'record_delimiter', 'separator', 'tsv', 'line break']
---

# Seçenek `record_delimiter`

`record_delimiter` seçeneği, kayıtları ayırmak için kullanılan bir veya birden fazla karakteri tanımlar.

Değer, bir dize, bir tampon veya her ikisinin bir dizisi olabilir. **Boş olamaz.** Varsayılan olarak, kayıt ayırıcıları otomatik olarak keşfedilir. Desteklenen otomatik keşif yöntemleri Linux ("\n"), Apple ("\r") ve Windows ("\r\n") kayıt ayırıcılarıdır.

* Tür: `string|Buffer|[string|Buffer]`
* Opsiyonel
* Varsayılan: `[]` (otomatik keşfedildi)
* Beraberinde: 4.0.0
* İlgili: `delimiter`, `quote`, `escape` &mdash; `Mevcut Seçenekler` bölümüne bakın.

:::tip
Bir kayıt ayırıcısını kaçışlamak mümkün değildir. Bir alan, bir kayıt ayırıcısı içeriyorsa ve bu, olduğu gibi yorumlanmamalıdır, **tırnak içine alınmalıdır**.
:::

## Tarihçe

4.0.0 sürümünden önce, bu seçenek `rowDelimiter` olarak adlandırılıyordu.

## Tek değerli kayıt ayırıcı

[record delimiter örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.record_delimiter.js), iki karakter `&&` kayıtları ayırır.

`embed:packages/csv-parse/samples/option.record_delimiter.js`

---

# Kayıt ayırıcı değerlerinin dizisi

Kayıt ayırıcı, [birden fazla değerden](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.record_delimiter.array.js) oluşacak şekilde bir dizi olarak tanımlandığında yapılabilir:

`embed:packages/csv-parse/samples/option.record_delimiter.array.js`