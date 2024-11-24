## G/Ç Projemizi Geliştirme

Bu yeni iteratör bilgisi ile, 12. Bölüm'deki G/Ç projesini iteratörleri kullanarak kodu daha anlaşılır ve özlü hale getirmek için geliştirebiliriz. `Config::build` fonksiyonumuzun ve `search` fonksiyonumuzun uygulamalarına nasıl iteratörlerin katkı sağlayabileceğine bakalım.

### Bir `clone`'u Bir İteratör Kullanarak Kaldırma

:::tip
`clone` çağrılarından kaçınmak, kod performansını artırabilir.
:::

12-6. Listelemesinde, `String` değerlerini alan bir dilim alıp, dilimden indeksleme yaparak değerleri kopyalayan `Config` yapısının bir örneğini oluşturacak şekilde kod ekledik; böylece `Config` yapısı bu değerlere sahip olabiliyordu. 13-17. Listelemesinde, 12-23. Listelemesinde olduğu gibi `Config::build` fonksiyonunun uygulamasını yeniden oluşturduk:



```rust,ignore
{{#rustdoc_include ../listings/ch13-functional-features/listing-12-23-reproduced/src/lib.rs:ch13}}
```



O zaman, verimsiz `clone` çağrıları hakkında endişelenmememiz gerektiğini söyledik çünkü bunları gelecekte kaldıracağımızı biliyorduk. İşte o zaman şimdi!

Burada `clone`'a ihtiyaç duyuyorduk çünkü `args` parametresinde `String` öğelerle dolu bir dilim var, ancak `build` fonksiyonu `args`'a sahip değil. Bir `Config` örneğinin sahipliğini geri döndürmek için `Config`'in `query` ve `file_path` alanlarından değerleri kopyalamak zorundaydık, böylece `Config` örneği bu değerlere sahip olabiliyor.

:::info
Yeni iteratör bilgilerimizle, `build` fonksiyonunu bir dilimi ödünç almak yerine bir iteratörün sahipliğini argüman olarak alacak şekilde değiştirebiliriz.
:::

Uzunluk kontrolü yapan ve belirli konumlara indeksleme yapan kod yerine iteratör işlevselliğini kullanacağız. Bu, `Config::build` fonksiyonunun ne yaptığını netleştirecek çünkü iteratör değerleri erişecektir.

> Bir kez `Config::build`, iteratörün sahipliğini alıp borç alan indeksleme işlemlerini kullanmayı bırakınca, `String` değerlerini iteratörden `Config`'e taşıyabiliriz; böylece `clone` çağırıp yeni bir tahsis yapmak zorunda kalmayız.  
> — `Config` güncellemesi

#### Döndürülen İteratörü Doğrudan Kullanma

G/Ç projenizin *src/main.rs* dosyasını açın; bu dosya şu şekilde görünmelidir:

Dosya Adı: src/main.rs

```rust,ignore
{{#rustdoc_include ../listings/ch13-functional-features/listing-12-24-reproduced/src/main.rs:ch13}}
```

Öncelikle, 12-24. Listelemesinde bulunan `main` fonksiyonunun başlangıcını 13-18. Listelemesindeki kod ile değiştireceğiz; bu sefer bir iteratör kullanıyoruz. Bu, `Config::build`'i de güncelleyene kadar derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-18/src/main.rs:here}}
```



`env::args` fonksiyonu bir iteratör döndürür! Şimdi, iteratör değerlerini bir vektöre toplamak yerine ve sonra bir dilim geçmek yerine, doğrudan `Config::build`'e `env::args`'den dönen iteratörün sahipliğini geçiyoruz.

Sonraki adım, `Config::build` tanımını güncellemektir. G/Ç projenizin *src/lib.rs* dosyasında, `Config::build`'in imzasını 13-19. Listelemesindeki gibi değiştirelim. Bu hâlâ derlenmeyecek çünkü fonksiyon gövdesini güncellememiz gerekiyor.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-19/src/lib.rs:here}}
```



Standart kütüphane dökümantasyonu `env::args` fonksiyonunun döndürdüğü iteratör türünün `std::env::Args` olduğunu, bu türün `Iterator` trait'ini uyguladığını ve `String` değerleri döndürdüğünü gösteriyor.

:::note
`args` parametresinin tipini `impl Iterator` olarak değiştirdik.
:::

`Config::build` fonksiyonunun imzasını güncelleyerek `args` parametresinin `&[String]` yerine `impl Iterator` trait sınırları olan bir genel türe sahip olmasını sağladık. Bu, 10. Bölümdeki [“Parametre Olarak Traitler”][impl-trait] bölümünde tartıştığımız `impl Trait` sözdizimini kullanmamız sayesinde oldu; yani `args`, `Iterator` trait'ini uygulayan ve `String` öğeleri döndüren herhangi bir tür olabilir.

`args`'ın sahipliğini alacağımız ve `args` üzerinde yineleme yaparak `args`'ı değiştireceğimiz için, `args` parametresinin tanımına `mut` anahtar kelimesini ekleyerek değiştirilebilir hale getirebiliriz.

#### İndeksleme Yerine `Iterator` Trait Yöntemlerini Kullanma

Sonraki adım, `Config::build`'in gövdesini düzeltmektir. `args` `Iterator` trait'ini uyguladığından, onun üzerinde `next` yöntemini çağırabileceğimizi biliyoruz! 13-20. Listelemesi, 12-23. Listelemesindeki kodu `next` yöntemini kullanacak şekilde güncelliyor:



```rust,noplayground
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-20/src/lib.rs:here}}
```



:::warning
`env::args`'in döndürdüğü ilk değerin programın adı olduğunu unutmayın.
:::

Bunu göz ardı etmek istiyoruz ve bir sonraki değere geçmek istiyoruz, bu yüzden önce `next` çağırıyoruz ve döndürdüğü değeri umursamıyoruz. İkinci olarak, `next` çağırarak `Config`'in `query` alanına koymak istediğimiz değeri alıyoruz. Eğer `next` `Some` dönerse, değeri çıkarmak için bir `match` kullanıyoruz. Eğer `None` dönerse, yeterince argüman verilmediği anlamına gelir ve hemen `Err` değeri ile döneriz. `file_path` değeri için de aynı şeyi yapıyoruz.

### İteratör Adaptörleri ile Kodu Daha Anlaşılır Hale Getirme

G/Ç projemizdeki `search` fonksiyonunda da iteratörlerden faydalanabiliriz. Bu işlev, 12-19. Listelemesinde olduğu gibi, 13-21. Listelemesinde burada yeniden üretilmiştir:



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-19/src/lib.rs:ch13}}
```



Bu kodu iteratör adaptör yöntemlerini kullanarak daha özlü bir şekilde yazabiliriz. Bunu yapmak, değişken bir ara `results` vektörüne sahip olmaktan da kaçınmamızı sağlar. Fonksiyonel programlama tarzı, kodu daha anlaşılır hale getirmek için değişken durum miktarını en aza indirmeyi tercih eder. Değişken durumu kaldırmak, gelecekte arama işleminin paralel gerçekleşmesine olanak tanıyabilir, çünkü `results` vektörüne eş zamanlı erişimi yönetmemize gerek kalmaz. 13-22. Listelemesi, bu değişikliği gösterir:



```rust,ignore
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-22/src/lib.rs:here}}
```



:::tip
`search` fonksiyonunun amacının `contents` içinde `query`'yi içeren tüm satırları döndürmek olduğunu unutmayın.
:::

13-16. Listelemesindeki `filter` örneğine benzer şekilde, bu kod yalnızca `line.contains(query)`'nin `true` döndürdüğü satırları korumak için `filter` adaptörünü kullanmaktadır. Ardından, eşleşen satırları `collect` ile başka bir vektörde toplarız. Çok daha basit! Aynı değişikliği `search_case_insensitive` fonksiyonunda da uygulamaktan çekinmeyin.

### Döngüler ile İteratörler Arasında Seçim Yapma

Bir sonraki mantıklı soru, kendi kodunuzda hangi stili seçeceğiniz ve nedenidir: 13-21. Listelemesindeki orijinal uygulama mı yoksa 13-22. Listelemesindeki iteratör kullanan sürüm mü? Çoğu Rust programcısı iteratör stilini kullanmayı tercih eder. Başlangıçta alışması biraz zor olabilir, ancak çeşitli iteratör adaptörlerinin ne yaptığını kavradığınızda, iteratörler daha kolay anlaşılabilir hale gelir. Yeni vektörler oluşturmak ve döngülerle uğraşmak yerine, kod döngünün yüksek seviyeli amacına odaklanır. Bu, yaygın kod parçalarını uzaklaştırır, böylece döngüye özgü kavramları daha kolay görmenizi sağlar.

:::danger
Ama iki uygulama gerçekten eşdeğer mi? Düşünmek intuitif olarak, daha düşük seviyedeki döngünün daha hızlı olacağı varsayımında bulunabiliriz. Performans hakkında konuşalım.
:::

[impl-trait]: ch10-02-traits.html#traits-as-parameters