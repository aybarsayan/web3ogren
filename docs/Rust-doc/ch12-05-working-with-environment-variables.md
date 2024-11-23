## Ortam Değişkenleri ile Çalışmak

`minigrep`'i geliştirerek ekstra bir özellik ekleyeceğiz: kullanıcının etkinleştirebileceği büyük/küçük harf duyarsız arama seçeneği için bir ortam değişkeni. Bu özelliği bir komut satırı seçeneği yapabilir ve kullanıcıların her seferinde etkinleştirmesini isteyebiliriz, ancak bunun yerine onu bir ortam değişkeni haline getirerek, kullanıcılarımızın ortam değişkenini bir kez ayarlayarak o terminal oturumunda tüm aramalarının büyük/küçük harf duyarsız olmasına izin vermiş oluruz.

### Büyük/Küçük Harf Duyarsız `search` Fonksiyonu için Başarısız Bir Test Yazma

Öncelikle, ortam değişkeninin bir değeri olduğunda çağrılacak yeni bir `search_case_insensitive` fonksiyonu ekleyeceğiz. TDD sürecini izlemeye devam edeceğiz, bu nedenle ilk adım yine başarısız bir test yazmaktır. Yeni `search_case_insensitive` fonksiyonu için yeni bir test ekleyeceğiz ve eski testimizi `one_result`'tan `case_sensitive` olarak yeniden adlandırarak iki test arasındaki farkları netleştireceğiz. Aşağıdaki Şema 12-20'de gösterilmiştir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-20/src/lib.rs:here}}
```



Eski testin `contents` kısmını da düzenlediğimizi unutmayın. `"Duct tape."` metnini büyük *D* ile ekledik ki bu, büyük/küçük harf duyarlı bir şekilde arama yaparken `"duct"` sorgusuyla eşleşmemelidir. Bu noktada uygun bir ***tip*** kutucuğu eklemek önemlidir:

:::tip
Eski testi bu şekilde değiştirmek, daha önce uyguladığımız büyük/küçük harf duyarlı arama işlevselliğini yanlışlıkla bozmamızı sağlamaya yardımcı olur. Bu test şimdi geçmeli ve büyük/küçük harf duyarsız arama üzerinde çalıştıkça geçmeye devam etmelidir.
:::

Büyük/küçük harf duyarsız arama için yeni test, sorgu olarak `"rUsT"` kullanmaktadır. Eklemek üzere olduğumuz `search_case_insensitive` fonksiyonunda, sorgu `"rUsT"` büyük *R* ile `"Rust:"` içeren satırla eşleşmeli ve her ikisi de sorgudan farklı büyük/küçük harf kullanımına sahip olsa da `"Trust me."` satırıyla da eşleşmelidir. Bu, başarısız testimizdir ve henüz `search_case_insensitive` fonksiyonunu tanımlamadığımız için derlenmeyecektir. Testin derlenmesini ve başarısız olmasını görmek için, yukarıdaki Şema 12-16'da yaptığımız gibi her zaman boş bir vektör dönen bir iskelet uygulaması eklemekten çekinmeyin.

### `search_case_insensitive` Fonksiyonunu Uygulama

Aşağıdaki Şema 12-21'de gösterilen `search_case_insensitive` fonksiyonu, `search` fonksiyonuna çok benzer olacaktır. Tek fark, `query` ve her bir `line`'ı küçük harfe dönüştürmemizdir, böylece giriş argümanlarının büyük/küçük harf durumu ne olursa olsun, sorgunun bulunduğu satırları kontrol ettiğimizde aynı halde olacaklardır.



```rust,noplayground
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-21/src/lib.rs:here}}
```



Öncelikle, `query` dizesini küçük harfli hale getirip aynı isimle bir gölgelenmiş değişkene kaydediyoruz. `to_lowercase` çağrısı yapmak, kullanıcının sorgusu `"rust"`, `"RUST"`, `"Rust"` veya `"rUsT"` olsa bile sorguyu `"rust"` gibi muamele etmemizi sağlamak açısından gereklidir ve bu duruma karşı kayıtsız kalacaktır. 

:::info
`to_lowercase`, temel Unicode'u yönetse de tamamen doğru olmayacaktır. Gerçek bir uygulama yazıyor olsaydık, burada biraz daha fazla çalışma yapmak isterdik, ancak bu bölüm ortam değişkenleri ile ilgili, Unicode ile değil, bu nedenle burada bırakacağız.
:::

Artık `query`, veri referansı olmaktan çok bir `String`'dir çünkü `to_lowercase` çağrısı yeni veriler oluşturur. Örneğin, sorgu `"rUsT"` ise: o dize dilimi bizim için kullanabileceğimiz bir küçük `u` veya `t` içermediğinden, `"rust"` içeren yeni bir `String` ayırmamız gerekiyor. Şimdi `contains` yöntemine `query`'yi argüman olarak geçtiğimizde, `contains`'in imzası bir dize dilimini alacak şekilde tanımlandığından bir ampersand eklememiz gerekir.

Sıradaki adım, her `line` için `to_lowercase` çağrısını ekleyerek tüm karakterleri küçük harfe dönüştürmektir. Artık `line` ve `query`'yi küçük harfe dönüştürdüğümüze göre, sorgunun büyük/küçük harf durumu ne olursa olsun eşleşmeler bulabileceğiz.

:::note
Bu uygulamanın testleri geçip geçmediğini görelim:
:::

```console
{{#include ../listings/ch12-an-io-project/listing-12-21/output.txt}}
```

Harika! Geçti. Şimdi, yeni `search_case_insensitive` fonksiyonunu `run` fonksiyonundan çağıralım. Öncelikle, `Config` yapısına büyük/küçük harfe duyarlı ve duyarsız arama arasında geçiş yapabilmemiz için bir yapılandırma seçeneği ekleyeceğiz. Bu alanı eklemek, henüz bu alanı herhangi bir yerde başlatmadığımız için derleyici hatalarına neden olacaktır:

Dosya Adı: src/lib.rs

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-22/src/lib.rs:here}}
```

`ignore_case` adında bir Boolean tutan alanı ekledik. Sıradaki adım, `run` fonksiyonunun `ignore_case` alanının değerini kontrol etmesi ve buna göre `search` fonksiyonunu yoksa `search_case_insensitive` fonksiyonunu çağırmasıdır; bu işlem Aşağıdaki Şema 12-22'de gösterilmektedir. Bu hâlâ derlenmeyecektir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-22/src/lib.rs:there}}
```



Son olarak, ortam değişkenini kontrol etmemiz gerekiyor. Ortam değişkenleri ile çalışmaya yönelik fonksiyonlar `std` kütüphanesindeki `env` modülünde yer alır, bu nedenle `src/lib.rs` dosyasının en üst kısmında bu modülü kapsamımıza alıyoruz. Ardından, aşağıdaki Şema 12-23'te gösterildiği gibi `IGNORE_CASE` adında bir ortam değişkeni için herhangi bir değer ayarlanıp ayarlanmadığını kontrol etmek için `env` modülündeki `var` fonksiyonunu kullanacağız.



```rust,noplayground
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-23/src/lib.rs:here}}
```



Burada, yeni bir `ignore_case` değişkeni oluşturuyoruz. Değerini ayarlamak için `env::var` fonksiyonunu çağırıp `IGNORE_CASE` ortam değişkeninin adını geçiyoruz. `env::var` fonksiyonu, ortam değişkeni herhangi bir değere ayarlandığında bu değeri içeren başarılı `Ok` varyantı olan bir `Result` döndürmektedir. Ortam değişkeni ayarlanmamışsa `Err` varyantını döndürür.

Ortam değişkeninin ayarlanıp ayarlanmadığını kontrol etmek için `Result` üzerindeki `is_ok` yöntemini kullanıyoruz; bu, programın büyük/küçük harf duyarsız bir arama yapması gerektiği anlamına gelmektedir. Eğer `IGNORE_CASE` ortam değişkeni herhangi bir değerle ayarlanmamışsa, `is_ok` `false` döndürecek ve program büyük/küçük harf duyarlı bir arama gerçekleştirecektir. Ortam değişkeninin *değeri* ile ilgili değiliz, sadece ayarlanıp ayarlanmadığını kontrol ediyoruz, bu nedenle `unwrap`, `expect` veya `Result` üzerindeki diğer yöntemleri kullanmaktansa `is_ok`'u kontrol ediyoruz.

:::warning
`ignore_case` değişkenindeki değeri `Config` örneğine geçiriyoruz, böylece `run` fonksiyonu bu değeri okuyup `search_case_insensitive` yoksa `search` çağırıp çağırmayacağına karar verebiliyor; bu, Şema 12-22'de uyguladığımız gibi.
:::

Bunu deneyelim! Öncelikle, programımızı ortam değişkeni ayarlanmadan ve `to` sorgusu ile çalıştıracağız, bu, büyük harf duyarlılığını göz önünde bulundurmamız gereken durumlarla karşılaşmamıza neden olacaktır:

```console
{{#include ../listings/ch12-an-io-project/listing-12-23/output.txt}}
```

Görünüşe göre bu hâlâ çalışıyor! Şimdi programı `IGNORE_CASE` değeri `1` olarak ayarlanmış halde ama aynı `to` sorgusu ile çalıştıracağız:

```console
$ IGNORE_CASE=1 cargo run -- to poem.txt
```

PowerShell kullanıyorsanız, ortam değişkenini ayarlamanız ve programı ayrı komutlar olarak çalıştırmanız gerekecektir:

```console
PS> $Env:IGNORE_CASE=1; cargo run -- to poem.txt
```

Bu, `IGNORE_CASE`'in shell oturumunuzun geri kalanı için kalıcı olmasını sağlayacaktır. `Remove-Item` cmdlet'i ile kaldırılabilir:

```console
PS> Remove-Item Env:IGNORE_CASE
```

Büyük/küçük harf durumu ayarlanan `to` kelimesinin içeren satırları almalıyız:



```console
Sen de kimse misin?
Birisi olmanın ne kadar sıkıcı olduğunu!
Adını gün boyunca söylemek
Bir hayranlık gölüne!
```

Mükemmel, *To* harfini içeren satırları da aldık! Artık `minigrep` programımız, bir ortam değişkeni ile kontrol edilen büyük/küçük harf duyarsız arama yapabiliyor. Şimdi, komut satırı argümanları veya ortam değişkenleri kullanarak ayarlanmış seçenekleri nasıl yönetebileceğinizi biliyorsunuz.

Bazı programlar aynı yapılandırma için hem argüman hem de ortam değişkenlerine izin verir. Bu tür durumlarda, programlar birinin diğerine öncelik vereceğini belirler. Kendi başınıza başka bir alıştırma olarak, büyük/küçük harf duyarlılığını bir komut satırı argümanı veya bir ortam değişkeni ile kontrol etmeyi deneyin. Programın birini büyük harf duyarlı, diğerini ise duyarsız olarak ayarlandığında hangisinin öncelik alması gerektiğine karar verin.

:::danger
`std::env` modülü, ortam değişkenleriyle ilgili daha birçok yararlı özellik içerir: neler bulunduğunu görmek için belgelere göz atın.
:::danger