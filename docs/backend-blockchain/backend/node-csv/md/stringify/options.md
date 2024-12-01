---
title: Seçenekler
description: csv-stringify paketine ilişkin seçenekler. Bu belge, mevcut seçenekleri ve nasıl kullanılacaklarını detaylı bir şekilde açıklamaktadır.
keywords: [csv, stringify, seçenekler, node.js, akış api]
sort: 5
---

# CSV Stringify seçenekleri

Tüm seçenekler isteğe bağlıdır. [Node.js Writable Stream API](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options) ve [Node.js Readable Stream API](https://nodejs.org/api/stream.html#stream_new_stream_readable_options) kapsamındaki tüm seçenekler desteklenmektedir ve olduğu gibi geçilmektedir.

## Mevcut seçenekler

* `bom` (boolean)  
  _Versiyon 5.4.0'dan itibaren_  
  Byte sıralama markasını (BOM) çıktı akışına ekler.
  
* `cast`  
  _Versiyon 1.1.0'dan itibaren_  
  Belirli veri türleri için özel dönüştürme tanımlar; versiyon 4.3.1'e kadar `formatters` olarak geçiyordu.
  * `bigint`
    Bigint değerlerini dönüştürmek için özel fonksiyon.
  * `boolean`
    Boolean değerlerini dönüştürmek için özel fonksiyon.
  * `date`
    Tarih değerlerini dönüştürmek için özel fonksiyon.
  * `number`
    Sayı değerlerini dönüştürmek için özel fonksiyon.
  * `object`
    Nesne literallerini dönüştürmek için özel fonksiyon.
  * `string`
    Dize değerlerini dönüştürmek için özel fonksiyon.
    
* `columns` (array|object)  
  _Versiyon 0.0.1'den itibaren_  
  Kayıtların alan düzeyinde oluşturulmasını etkiler.

* `delimiter` (string)   
  _Versiyon 0.0.1'den itibaren_  
  Alan ayıracını belirler, bir veya birden fazla karakter, varsayılan olarak virgül.  

* `eof` (boolean)   
  _Versiyon 0.0.2'den itibaren_  
  Son kayıttan sonra `record_delimiter` seçeneğinin değerini ekler, varsayılan `true`.  
  :::warning
  Bu seçeneği kullanırken dikkat edin; varsayılan ayar, akışınızın doğru çalışmasını sağlamalıdır.
  :::

* `escape` (string|Buffer)   
  _Versiyon 0.0.1'den itibaren_  
  Kaçış için kullanılan tek karakter; yalnızca `quote` ve `escape` seçeneklerine uyan karakterlere uygulanır, varsayılan `"`.
  
* `escape_formulas` (boolean)   
  _Versiyon 6.3.0'dan itibaren_  
  `=`, `+`, `-`, `@`, `\t` veya `\r` ile başlayan değerleri `'` ile kaçırır ve CSV enjeksiyon saldırılarına karşı korur.
  
* `header` (boolean)   
  _Versiyon 0.0.1'den itibaren_  
  Eğer sütun seçeneği sağlanmışsa veya bulunmuşsa, ilk satırda sütun isimlerini gösterir.

* `quote` (string|Buffer|boolean)   
  _Versiyon 0.0.1'den itibaren_  
  Bir alanı çevreleyen alıntı karakterleri, varsayılan olarak `"` (çift tırnak işareti), boş bir alıntı değeri, alanı orijinal halinde korur, alıntı işareti içerip içermediğine bakılmaksızın.
  
* `quoted` (boolean)    
  _Versiyon 0.0.1'den itibaren_   
  Boolean, varsayılan olarak false, gerekli olmasa bile tüm boş olmayan alanları alıntılar.  

* `quoted_empty` (boolean)   
  _Versiyon 5.1.0'dan itibaren_   
  Boş dizeleri alıntılar ve tanımlı olduğunda boş dizeler için `quoted_string`'i geçersiz kılar; varsayılan `false`.

* `quoted_match` (String|RegExp)   
  _Versiyon 5.1.0'dan itibaren_   
  Bir düzenli ifadeye uyan tüm alanları alıntılar; varsayılan `false`.

* `quoted_string` (boolean)   
  _Versiyon 5.1.0'dan itibaren_   
  Gerekli olmasa bile dize türündeki tüm alanları alıntılar; varsayılan `false`.

* `record_delimiter` (string|Buffer)    
  _Versiyon 0.0.1'den itibaren_   
  Kayıt satırlarını ayırmak için kullanılan dize veya özel değer; özel değerler 'auto', 'unix', 'mac', 'windows', 'ascii', 'unicode'; varsayılan olarak 'auto' (kaynağında tespit edildi veya kaynak belirtilmediyse 'unix'); versiyon 4.3.1'den önce `rowDelimiter` idi.

---

## Tarzınızı seçin

Kod, fonksiyon ve değişken isimleri için geleneksel stil olarak **snake case** kullanır. Snake case'de, tüm harfler küçük ve alt çizgi kelimeleri ayırır. Bununla birlikte, seçeneklerin _camel case_ olarak sağlanmasına da izin verilmektedir. Böylece, `record_delimiter` ve `recordDelimiter`, `stringify`'nin yeni bir örneği başlatıldığında eşdeğerdir. 

> Seçenek, snake case'e dönüştürülecek ve öyle gösterilecektir. Örneğin, `record_delimiter` seçeneğine erişmeniz gerektiğinde `generate().options.record_delimiter` kullanın ve `generate().options.recordDelimiter` değil. Kodlama stilinize en uygun olan durumu seçin. —