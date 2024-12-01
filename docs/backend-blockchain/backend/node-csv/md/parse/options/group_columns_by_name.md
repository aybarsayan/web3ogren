---
title: Seçenek group_columns_by_name
description: group_columns_by_name seçeneği, tekrarlanan sütun adları için değerleri bir değer dizisine dönüştürür. Bu özellik, CSV verilerinin yönetimini kolaylaştırır ve daha düzenli veri yapıları oluşturmaya yardımcı olur.
keywords: [csv, ayrıştır, seçenekler, sütunlar, dizi, tekrarlar, veri yönetimi]
---

# Seçenek `group_columns_by_name`

Ayarları `true` olarak ayarlandığında etkinleşen `group_columns_by_name` seçeneği, aynı isimde birden fazla sütun bulunduğunda dönen değerleri değer dizilerine dönüştürecektir.

:::info
Bu seçenek, kayıtların literal nesneler olarak döndüğü `columns` modunun kullanımını gerektirir. Eğer `columns` modu etkinleştirilmezse bir hata fırlatılır.
:::

* Tür: **`boolean`**
* Opsiyonel
* Varsayılan: **`false`** (tek karakterli virgül)
* Sürümden beri: **4.10.0**
* İlgili: `columns` &mdash; `Mevcut Seçenekler` bölümüne bakınız
* Tarihçe: 5.0.0 sürümünden önce bu seçenek `columns_duplicates_to_array` adıyla bilinmekteydi.

## Örnek

[group_columns_by_name örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.group_columns_by_name.js), "arkadaş" adında iki sütun içeren bir CSV veri seti içerir. 

> `group_columns_by_name` seçeneği olmadan, sadece son arkadaş erişilebilir olacaktır. Bunun yerine, her arkadaş bir dizi şeklinde döndürülmektedir:
> — [group_columns_by_name Örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.group_columns_by_name.js)

```javascript
// Örnek kod bloğu burada
embed:packages/csv-parse/samples/option.group_columns_by_name.js
```