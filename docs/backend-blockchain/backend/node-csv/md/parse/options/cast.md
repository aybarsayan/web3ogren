---
title: Seçenek cast
description: Seçenek "cast" bir alanın değerini değiştirir. Bu yapı, alan değerlerinin dönüştürülmesi ve tür değişikliklerini yönetme yeteneği sağlar. Kullanıcı fonksiyonları ve bağlam nesneleri ile derinlemesine kullanım imkanı sunar.
keywords: ['csv', 'parse', 'options', 'cast', 'context', 'lines', 'quoting']
---

# Seçenek `cast`

`cast` seçeneği, bir alanın değerini değiştirmek için alan düzeyinde çalışır. Bu özellik, **alanın değerini dönüştürmek** veya türünü değiştirmek için oldukça etkili bir yol sunar.

* **Tür:** `function`
* **Opsiyonel**
* **Varsayılan:** `undefined`
* **Versiyon:** 2.2.0
* **İlgili:** `cast_date`, `info`, `on_record` &mdash; `Mevcut Seçenekler` için bakınız

`cast` değeri, bağlam açısından zengin bilgileri alan bir fonksiyon olması beklenir. Fonksiyon, bir alan üzerinde **tam kontrol** sağlar.

## Kullanım

`cast` kullanıcı fonksiyonu, 2 argüman ile çağrılır: alan `value` ve `context` nesnesi. Kullanıcı fonksiyonu, değeri olduğu gibi döndürebilir veya `null` ve `undefined` de dahil olmak üzere herhangi bir başka değeri döndürebilir.

> **Önemli Not:** The [`test/option.cast.coffee`](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/test/option.cast.coffee) testi, nasıl kullanılacağı ve desteklenen işlevsellikler hakkında bilgi sağlar. İlk sütunu olduğu gibi döndürür, ikinci sütunu bir tam sayıya dönüştürür ve üçüncü sütunun değerinden yeni bir dize döndürür.  
> — Test Doğrulama Raporu

`embed:packages/csv-parse/samples/option.cast.js`

---

## Bağlam

`context` nesnesi şu özellikleri sergiler:

* **`column` (number|string)**  
  Eğer `columns` seçeneği tanımlanmışsa sütun adı, aksi takdirde alanın pozisyonu.
* **`empty_lines` (number)**  
  Bu alana kadar karşılaşılan boş satırların içsel sayacı.
* **`header` (boolean)**  
  Sağlanan değerin başlığın bir parçası olup olmadığını belirten bir boolean.
* **`index` (number)**  
  Mevcut kayıttaki alan pozisyonu, 0'dan başlar.
* **`invalid_field_length` (number)**  
  `relax_column_count` true olduğunda tutarsız uzunlukta kayıtlara sahip olan kayıt sayısı. Versiyon 3'e kadar `skipped_lines` olarak adlandırılıyordu.
* **`lines` (number)**  
  İşlenen satır sayısı, mevcut satır dahil.
* **`quoting` (boolean)**  
  Alanın tırnaklar içinde olup olmadığını belirten bir boolean.
* **`records` (number)**  
  Tamamen ayrıştırılmış kayıt sayısı. Versiyon 3'e kadar `count` olarak adlandırılıyordu.

:::info Bağlam örneği
[bağlam örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.cast.context.js) ilk alanı bir tarihe dönüştürmek ve ikinci alanı enjekte edilen bağlam ile değiştirmek için bağlamı kullanır:
:::

`embed:packages/csv-parse/samples/option.cast.context.js`

---

## `cast` ve `columns` fonksiyonlarını birlikte kullanma

`cast` fonksiyonu, başlık olarak değerlendirilip değerlendirilmeksizin her bir alan için çağrılır. `columns` fonksiyonu, ilk kayıt oluşturulduğunda (başlık olarak düşünülüyorsa) bir kez çağrılır. Bu nedenle `cast`, `columns`'dan önce çalıştırılır.

**Not:** `cast` fonksiyonunda bir başlık alanını veri alanından ayırmak için, `cast` fonksiyonunun ikinci argümanından [`context.header` özelliğini](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.cast.header.column.fn.js) kullanın:

`embed:packages/csv-parse/samples/option.cast.header.column.fn.js`

:::note
Yukarıdaki örnek, [`cast` içinde doğrudan `columns` dönüşümünü](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.cast.header.column.true.js) uygulamak için yeniden yazılabilir; `columns: true` olarak ayarlanarak ve `if(context.header) return value;` yerine `if(context.header) return value.toUpperCase();` ile değiştirilerek:
:::

`embed:packages/csv-parse/samples/option.cast.header.columns.true.js`