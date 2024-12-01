````markdown
---
title: Seçenekler
description: csv-parse paketi ile ilgili seçenekler. Bu paket, CSV verilerini ayrıştırmak için bir dizi seçenek sunar, kullanıcıların verileri farklı şekillerde işlemesine imkan tanır.
keywords: [csv, parse, seçenekler, ayırıcı, sütunlar, yorum, kaçış]
sort: 5
---

# CSV Parse seçenekleri

## Giriş

Tüm seçenekler isteğe bağlıdır. [Node.js Stream Writable](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options) içindeki seçenekler de desteklenir ve olduğu gibi geçilir. **Sadece "objectMode" her zaman "true" olarak ayarlanır.**

## Mevcut seçenekler

* `bom` (boolean)   
  _4.4.0 sürümünden itibaren_   
  Eğer doğruysa, "CSV girişi içinde mevcutsa byte order mark'ı (BOM) tespit eder ve hariç tutar."
* `cast` (boolean|function)   
  _2.2.0 sürümünden itibaren_   
  **"Bir alanın değerini değiştirir."** Eğer doğruysa, ayrıştırıcı giriş dizelerini yerel türlere dönüştürmeye çalışır. Bir fonksiyon, yeni değeri döndürmeli ve alınan argümanlar cast edilecek değeri ve bağlam nesnesini içermelidir. Bu seçenek 2. sürüme kadar `auto_parse` olarak adlandırılmıştır.
* `cast_date` (boolean|function)   
  _1.0.5 sürümünden itibaren_   
  **"CSV alanını bir tarihe dönüştürür."** `cast` seçeneğinin aktif olmasını gerektirir. Bu seçenek 2. sürüme kadar `auto_parse_date` olarak adlandırılmıştır.
* `columns` (array|boolean|function)   
  _Erken dönemlerden itibaren_   
  Kayıtları dizi yerine nesne literal olarak oluşturur. **Alanların bir dizisi olarak, ilk satırı kabul eden ve sütun adlarını döndüren kullanıcı tanımlı bir geri çağırma ya da ilk CSV satırında otomatik olarak keşfedildiyse `true`.** Varsayılan olarak `null` değerindedir. Sonuç veri kümesini etkiler; kayıtlar dizi yerine nesne olacaktır. Sütun dizisi içinde "false", "null" veya "undefined" değeri varsa, sütun çıktıda atlanır.
  
* :::tip 
  Kayıtların düzenlenmesi için "columns" seçeneğini kullanmayı düşünün.
  :::

* `group_columns_by_name` (boolean)   
  _4.10.0 sürümünden itibaren_  
  **"Sütunlar etkinleştirildiğinde ve aynı isimde birden fazla sütun bulunduğunda değerleri bir değerler dizisine dönüştürür."**
* `comment` (string|buffer)   
  _Erken dönemlerden itibaren_   
  **"Bu karakterden sonra gelen tüm karakterleri bir yorum olarak kabul eder."** Bir veya birden fazla karakter; varsayılan olarak boş bir dize `""` tanımlanarak devre dışıdır.
* `comment_no_infix` (boolean)   
  _5.5.0 sürümünden itibaren_   
  Yorum tanımını tam satırlara kısıtlar.
* `delimiter` (string|Buffer|[string|Buffer])   
  _0.0.1 sürümünden itibaren_   
  **"Bir veya birden fazla karakter içeren bir veya daha fazla alan ayırıcı tanımlar."** Varsayılan olarak `,` (virgül) değerindedir.

---

### Ek bilgiler


Dikkat Edilmesi Gerekenler

* **`encoding`** ayarını dikkatli seçmelisiniz, çünkü yanlış bir kodlama veri kaybına neden olabilir.
* `ignore_last_delimiters` seçeneğinin doğru şekilde ayarlanmadığı durumlarda beklenmedik sonuçlar ortaya çıkabilir.



---

* `encoding` (string|Buffer)   
  _4.13.0 sürümünden itibaren_   
  Giriş ve çıkış kodlamalarını ayarlar. **"null" veya "false" kullanıldığında ham tamponun bir dize yerine çıktı olarak sağlanır ve varsayılan olarak `utf8`dir.**
* `escape` (string|Buffer)   
  _0.0.1 sürümünden itibaren_   
  "Kaçış karakterini yalnızca bir karakter/bayt olarak ayarlar." Sadece alıntılanmış alanlar içindeki alıntı ve kaçış karakterlerine uygulanır ve varsayılan olarak `"` (çift tırnak) değerindedir.
  
---
  
## Tarzınızı seçin

Kod, işlev ve değişken adları için geleneksel stil olarak aşağı altı çizili (snake case) kullanmaktadır. **Aşağı altı çizili stilinde, tüm harfler küçük ve kelimeler alt çizgi ile ayrılır.** Ancak, seçeneklerin camel case olarak sağlanmasına da izin verilmektedir. 

**"Böylece, `record_delimiter` ve `recordDelimiter` yeni bir ayrıştırıcının başlatılmasında eşdeğerdir."** Seçenek, aşağı altı çizili formata dönüştürülecek ve bu şekilde sağlanacaktır. Örneğin, `record_delimiter` seçeneğine erişmeniz gerektiğinde `generate().options.record_delimiter` kullanın ve `generate().options.recordDelimiter` değil. 

* :::info 
  Kodlama stilinize en uygun olan durumu seçin!
  :::
````