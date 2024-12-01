---
title: Hatalar
description: CSV ayrıştırıcısını kullanırken karşılaşılan yaygın hatalar ve bunların çözümleri hakkında bilgi edinin. Hataların kodları ve açıklamaları ile ilgili detaylar burada listelenmiştir.
keywords: [csv, ayrıştır, hata, yanlış, api]
sort: 7
---

# Hatalar

> Önemli: hata desteği, 4.5 sürümü ile birlikte yakında eklendi. Kapsam henüz kapsamlı değil. Aşağıda belgelenen kod, mesaj ve özellikler yakın gelecekte değişebilir.

Tüm hatalar, JavaScript `Error` sınıfını genişleten `CsvError` sınıfını örnekler. Hatanın 2 ana özelliği:

* **`code`**   
  Hata türünü tanımlar, ayrıştırıcı tarafından atılan her hata için benzersizdir, hata kodlarının listesi için aşağıya bakınız.
* **`message`**   
  Kodun okunabilir bir versiyonu ile tanıtılan açıklayıcı ve bazen ayrıntılı hata mesajı.

Hata ayrıca birden fazla bağlamsal özellik ile zenginleştirilmiştir:

* **`column` (number|string)**   
  `columns` seçeneği tanımlıysa sütun adı ya da alan pozisyonu.
* **`empty_lines` (number)**   
  Bu alana kadar karşılaşılan boş satırların içsel sayacı.
* **`header` (boolean)**   
  Sağlanan değerin başlığın bir parçası olup olmadığını belirten bir boolean.
* **`index` (number)**   
  0'dan başlayarak alan pozisyonu.
* **`invalid_field_length` (number)**   
  `relax_column_count` true olduğunda standart dışı uzunlukta kayıt sayısı. Sürüm 3'ten önce `skipped_lines` olarak adlandırılıyordu.
* **`lines` (number)**   
  Mevcut satır dahil olmak üzere işlenen satır sayısı.
* **`quoting` (boolean)**   
  Alanın tırnak işareti ile çevrili olup olmadığını belirten bir boolean.
* **`records` (number)**   
  Tam olarak ayrıştırılan kayıt sayısı. Sürüm 3'ten önce `count` olarak adlandırılıyordu.

Son olarak, kod özelliği ile tanımlanan her hata türü ilave özellikler içerebilir.

## Çalışma zamanı hataları

* **code: `CSV_INVALID_CLOSING_QUOTE`**   
  Beklenmedik bir konumda bir tırnak işareti bulunduğunda atılır. `relax_quotes` seçeneğini etkinleştirerek bu hataya tolerans sağlanabilir.
  
* **code: `CSV_RECORD_INCONSISTENT_FIELDS_LENGTH`**   
  Bir kaydın önceki kayıtlarla aynı sayıda alanla eşleşmediği durumlarda atılır. Alan miktarına tolerans sağlamak için `relax_column_count` seçeneği kullanılabilir. Ek özellikler arasında:
  * **`record`**   
    Karşılaşılan geçersiz kayıt.
    
* **code: `CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH`**   
  Bir kaydın aynı sayıda sütunla eşleşmediği durumlarda atılır. Bu hata yalnızca `columns` seçeneği aktif olduğunda görülür. Ek özellikler arasında:
  * **`record`**   
    Karşılaşılan geçersiz kayıt.
  
* **code: `CSV_INVALID_COLUMN_MAPPING`**   
  `columns` seçeneği bir işlev olduğunda ve beklenildiği gibi bir başlık alanları dizisi döndürmediğinde atılır.
  * **`headers`**   
    İşlev tarafından döndürülen geçersiz başlık değerleri.

* **code: `CSV_MAX_RECORD_SIZE`**   
  Bir alanın `max_record_size` seçeneği tarafından tanımlanan değerden daha uzun olduğu durumlarda atılır.

* **code: `CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE`**   
  Bir alan artık tırnak içinde değilken kapanış tırnağından sonra yeni tırnak içinde alınamayacak karakterler bulunduğunda atılır. Sadece `trim` veya `rtrim` seçenekleri etkinleştirildiğinde geçerli olur.

* **code: `CSV_QUOTE_NOT_CLOSED`**   
  Bir açılış tırnağının kapatılmadığı durumda veri ayrıştırma işlemi sona erdiğinde atılır.

## API Hataları

* **code: `CSV_INVALID_ARGUMENT`**   
  **message:** `Geçersiz argüman: {index} indeksinde {value} alındı`   
  `parse` dışa aktarılan işlev çağrıldığında yanlış argümanlar ile atılır.

* **code: `CSV_INVALID_OPTION_BOM`**   
  **message:** `Geçersiz seçenek bom: bom true olmalı, {value} alındı`   
  Cast seçeneği yanlış olduğunda atılır.

* **code: `CSV_INVALID_OPTION_CAST`**   
  **message:** `Geçersiz seçenek cast: cast true veya bir işlev olmalı, {value} alındı`   
  Cast seçeneği yanlış olduğunda atılır.

* **code: `CSV_INVALID_OPTION_CAST_DATE`**   
  **message:** `Geçersiz seçenek cast_date: cast_date true veya bir işlev olmalı, {value} alındı`   
  Bir sütun tanımı `name` özelliğini içermediğinde atılır.

* **code: `CSV_INVALID_COLUMN_DEFINITION`**  
  **message:** `Geçersiz sütun tanımı: bir dize veya literal nesne bekleniyor, {position} konumunda true alındı`   
  Bir sütun tanımı yanlış olduğunda atılır.

* **code: `CSV_OPTION_COLUMNS_MISSING_NAME`**   
  **message:** `Seçenek sütunları eksik adı: nesne literal olduğunda "name" özelliği gereklidir, {position} konumunda`   
  Bir sütun tanımı bir isim özelliği olmadan bir nesne olduğunda atılır.

* **code: `CSV_INVALID_OPTION_COLUMNS`**   
  **message:** `Geçersiz seçenek sütunlar: bir nesne, işlev veya true bekleniyor, {value} alındı`   
  Sütun seçeneği yanlış olduğunda atılır.

* **code: `CSV_INVALID_OPTION_COMMENT`**   
  **message:** `Geçersiz seçenek yorum: yorum bir buffer veya dize olmalı, {value` alındı`   
  Yorum seçeneği yanlış olduğunda atılır.

* **code: `CSV_INVALID_OPTION_DELIMITER`**   
  **message:** `Geçersiz seçenek ayırıcı: ayırıcı boş bir dize veya buffer olmalı, {value} alındı`    
  Ayırıcı seçeneği yanlış olduğunda atılır.

* **code: `CSV_INVALID_OPTION_RECORD_DELIMITER`**   
  **message:** ```Geçersiz seçenek `record_delimiter`: değer boş bir dize veya buffer veya dize|buffer dizisi olmalı, {value} alındı```   
  **since:** 5.0.0   
  Record_delimiter seçeneği yanlış olduğunda atılır.

---

## Yaygın sorunlar

### Bitiriş bildirimi

**Durum:**

"finish" olayını kullanıyorsunuz ve tüm kayıtlarınız yok. "readable" olayı hala birkaç kayıt ile çağrılıyor.

**Çözüm:**

Ayrıştırıcı hem yazılabilir hem de okunabilir bir akımdır. Veri yazarsınız ve kayıtları okursunuz. [Node.js. akım belgelerine](https://nodejs.org/api/stream.html) göre, "finish" olayı yazma API'sinden gelir ve giriş kaynağının verilerini boşaltması durumunda yayımlanır. "end" olayı okuma API'sinden gelir ve akımdan daha fazla veri tüketilecek olmadığında yayımlanır.

> **Sorun:** [GitHub - Node CSV Parse Issue #204](https://github.com/adaltas/node-csv-parse/issues/204)