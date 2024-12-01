---
title: Seçenekler
description: csv-generate paketine ait seçenekler. Bu belgede, CSV üretiminde kullanılabilecek çeşitli seçenekler hakkında bilgi bulacaksınız. Kullanıcıların daha iyi anlaması için açıklamalar ve örnekler yer almaktadır.
keywords: [csv, üret, seçenekler, süre, sütunlar, tohum, nesne, dize]
sort: 5
---

# CSV Üret seçenekleri

Tüm seçenekler isteğe bağlıdır. [Node.js Stream Writable](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options) seçenekleri de desteklenmektedir.

## Mevcut seçenekler

* `columns` (tamsayı|dizi|fonksiyon)  
  Oluşturulan alanların sayısını ve üretim yöntemini tanımlar. **Sütunlar bir tamsayı ise**, alan sayısına karşılık gelir. **Dizi ise** her bir eleman bir alana karşılık gelir. **Alan bir fonksiyon ise**, fonksiyonun bir değer döndürmesi beklenir; eğer bir dize ise, aynı isme sahip kaydedilmiş fonksiyonu çağırır (örneğin `Generator.int` "int" değeri için). Mevcut değerler "ascii", "int" ve "bool" olup, kullanıcı tarafından veya talep üzerine daha fazlası eklenebilir [pull request](https://github.com/adaltas/node-csv/issues/new) açarak. Varsayılan olarak 8 ascii sütunu vardır.

* `delimiter` (dize)  
  Alan ayıracını ayarlayın. Bir veya birden fazla karakter. Varsayılan olarak "," (virgül) kullanılmaktadır.

:::tip
**İpucu:** Boş alanları ayırırken, alan ayıracının dikkatli seçilmesi önemlidir. Bu, verilerin doğru bir şekilde analiz edilmesine yardımcı olur.
:::

* `duration` (tamsayı)  
  Millisaniye cinsinden çalışma süresi, varsayılan olarak 4 dakika olarak ayarlanmıştır.

* `encoding` (dize)  
  Belirtilmişse, tamponlar belirtilen kodlamayı kullanarak dizelere dönüştürülecektir; tüm desteklenen kodlamalar için [belgeleri](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) kontrol edin; varsayılan olarak `null` ayarlanmıştır.

* `end` (tamsayı|tarih)  
  Üretimin ne zaman durdurulacağını; sayısal bir değer veya bir tarih nesnesi olabilir; varsayılan olarak null.

---

* `eof` (boolean|dize)  
  Dosyanın sonunda yazılacak bir veya birden fazla karakter; yalnızca `objectMode` devre dışı bırakıldığında geçerlidir; varsayılan olarak `false` veya `true` ise `row_delimiter` değeridir.

* `fixed_size`, `fixedSize` (boolean)  
  `highWaterMark` seçeneği ile tanımlanan uzunluğa eşit tamponlar oluşturun; yalnızca `objectMode` devre dışı bırakıldığında geçerlidir; ilk kayıt `highWaterMark` seçeneğinin iki katı olacaktır; varsayılan olarak `false` ayarlıdır.

---

* `high_water_mark`, `highWaterMark` (tamsayı)  
  Temel kaynaklardan okuma işlemini durdurmadan önce depolamak için maksimum byte miktarı; nesne modunda çalışan akışlar için, highWaterMark toplam nesne sayısını belirtir; varsayılan değer 16384 (16kb) veya nesne modu akışları için 16.

* `length` (tamsayı)  
  Oluşturulacak satır veya kayıt sayısı. Varsayılan değer `-1` olup, bu sonsuzdur.  

* `max_word_length` (tamsayı)  
  Her kelime için maksimum karakter sayısı. Varsayılan olarak **16** belirlenmiştir.

* `object_mode`, `objectMode` (boolean)  
  Bu akışın nesne akışı olarak davranıp davranmayacağını belirtir. Yani `stream.read(n)`, n boyutunda bir Tampon yerine tek bir değer döndürür. Varsayılan değeri `false`'dır. 

* `row_delimiter`, `rowDelimiter` (dize)  
  Kayıtları ayırmak için kullanılan bir veya birden fazla karakter; yalnızca `objectMode` devre dışı bırakıldığında geçerlidir; varsayılan olarak `\n`, Unix satır sonudur.

* `seed` (tamsayı)  
  Belirtilen bir numara varsa, idempotent rastgele karakterler oluşturur. Varsayılan değer `false` olup, bu özellik devre dışıdır.

* `sleep` (sayı)  
  Her kayıt üretiminden önce bekleyeceğiniz süre; v3.1.0'dan itibaren; varsayılan olarak "0" (bekleme yok).

---

## Tarzınızı Seçin

Kod, fonksiyon ve değişken isimleri için geleneksel stil olarak snake case kullanır. **Snake case'de tüm harfler küçük ve alt çizgiler kelimeleri ayırır.** Ancak, seçenekleri camel case şeklinde sağlamak kabul edilmektedir. Bu nedenle, `record_delimiter` ve `recordDelimiter` yeni bir üretim başlatırken eşdeğerdir. Seçenek snake case'e dönüştürülecek ve bu şekilde sunulacaktır. Örneğin, `record_delimiter` seçeneğine erişmeniz gerektiğinde, `generate().options.record_delimiter` ve değil `generate().options.recordDelimiter` kullanın. **Kodlama stilinize en uygun olan durumu seçin.**

---

## Seçenek `objectMode`

Varsayılan olarak, üretici bir CSV veri kümesi oluşturur. Ancak, nesne oluşturmak mümkündür, ancak writable akışa ait [`objectMode` seçeneğini](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options) geçerek.

[Akış örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-generate/samples/options.objectmode.stream.js), her kayıt `read` fonksiyonu tarafından bir dizi şeklinde döndürülmektedir.

`embed:packages/csv-generate/samples/options.objectmode.stream.js`

[Callback örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-generate/samples/options.objectmode.callback.js), veri kümesi verileri callback'e bir dizi dizi olarak aktarılmaktadır.

`embed:packages/csv-generate/samples/options.objectmode.callback.js`