## Nesne Yönelimli Tasarım Deseni Uygulaması

*Durum deseni*, nesne yönelimli bir tasarım desenidir. Desenin özü, bir değerin içsel olarak sahip olabileceği bir dizi durumu tanımlamamızdır. Durumlar, bir dizi *durum nesnesi* ile temsil edilir ve değerin davranışı duruma bağlı olarak değişir. Bir blog gönderisi yapısının örneğini uygulayacağız; bu yapı, durumu tutacak bir alan içerecek ve bu, "taslak", "inceleme" veya "yayınlanmış" setinden bir durum nesnesi olacaktır.

:::info
**Not:** Durum nesneleri işlevselliği paylaşır: Rust'ta, elbette, nesneler ve miras yerine yapılar ve özellikler kullanırız. Her durum nesnesi kendi davranışından sorumludur ve başka bir duruma ne zaman geçiş yapması gerektiğini belirler. Bir durum nesnesini tutan değer, durumların farklı davranışları hakkında hiçbir şey bilmez veya durumlar arasında ne zaman geçiş yapması gerektiğini bilemez.
:::

Durum desenini kullanmanın avantajı, programın iş gereksinimleri değiştiğinde, durumu tutan değerin kodunu veya değeri kullanan kodu değiştirmemiz gerekmemesidir. Sadece durum nesnelerinden birinin içindeki kodu güncellememiz yeterlidir; bu, kurallarını değiştirmek veya belki de daha fazla durum nesnesi eklemek anlamına gelir.

Önce, geleneksel bir nesne yönelimli şekilde durum desenini uygulayacağız, sonra Rust'ta daha doğal olan bir yaklaşım kullanacağız. Durum desenini kullanarak bir blog gönderisi iş akışını kademeli olarak uygulamaya başlayalım.

Son işlevsellik şöyle görünecek:

1. Bir blog gönderisi boş bir taslak olarak başlar.
2. Taslak tamamlandığında, gönderinin incelenmesi talep edilir.
3. Gönderi onaylandığında, yayınlanır.
4. Sadece yayınlanmış blog gönderileri içerik döndürür, böylece onaylanmamış gönderiler yanlışlıkla yayınlanamaz.

Bir gönderide denenen diğer herhangi bir değişiklik etkisiz olmalıdır. Örneğin, inceleme talep etmeden önce bir taslak blog gönderisini onaylamaya çalışırsak, gönderinin yayınlanmamış bir taslak olarak kalması gerekir.

---

Liste 18-11, bu iş akışını kod biçiminde göstermektedir: bu, bir kitaplık krate adını verdiğimiz `blog` olan API'mizin bir örnek kullanımını temsil eder. Daha önce `blog` krate'ini uygulamadığımız için henüz derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch18-oop/listing-18-11/src/main.rs:all}}
```



Kullanıcının `Post::new` ile yeni bir taslak blog gönderisi oluşturmasına izin vermek istiyoruz. Blog gönderisine metin eklenmesine izin vermek istiyoruz. Onaylanmadan önce gönderinin içeriğini hemen almaya çalışırsak, gönderinin hala bir taslak olduğu için hiçbir metin almamalıyız. Gösterim amacıyla kodda `assert_eq!` ekledik. Mükemmel bir birim testi, bir taslak blog gönderisinin `content` yönteminden boş bir dize döndürdüğünü doğrulamak olacaktır, ancak bu örnek için test yazmayacağız.

---

Sonraki adımda, gönderinin inceleme talep etmesine olanak tanımak istiyoruz ve `content` inceleme beklerken boş bir dize döndürmelidir. Gönderi onaylandığında, `content` çağrıldığında gönderinin metni geri döndürülmelidir.

Krate'den etkileşimde bulunduğumuz tek türün `Post` türü olduğunu unutmayın. Bu tür, durum desenini kullanacak ve gönderinin olabileceği üç durum nesnesinden birini tutacaktır—taslak, inceleme bekliyor veya yayınlanmış. Bir durumdan diğerine geçiş, `Post` türü içinde yönetilecektir. Durumlar, kütüphanemizin kullanıcıları tarafından `Post` örneği üzerinde çağrılan yöntemlere yanıt olarak değişir, ancak durum değişikliklerini doğrudan yönetmeleri gerekmez. Ayrıca, kullanıcılar durumlarla ilgili bir hata yapamazlar; örneğin, bir gönderiyi incelemeden önce yayınlamak gibi.

### `Post`'un Tanımlanması ve Taslak Durumda Yeni Bir Örneğin Oluşturulması

Kütüphanenin uygulanmasına başlayalım! Bazı içerikleri tutan bir genel `Post` yapısına ihtiyacımız var, bu yüzden yapının tanımı ile başlayacağız **ve yeni bir `Post` örneği oluşturmak için ilişkili bir genel `new` fonksiyonu tanımlayacağız**; bu, Liste 18-12'de gösterilmiştir. Ayrıca, `Post` için tüm durum nesnelerinin sahip olması gereken davranışları tanımlayan özel bir `State` trait'i oluşturacağız.

Sonra `Post`, durumu tutacak `state` adında bir özel alanda `Box` türünden bir trait nesnesi tutacaktır. `Option` kullanmanın neden gerekli olduğunu birazdan göreceksiniz.



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-12/src/lib.rs}}
```



`State` trait'i, farklı gönderi durumları tarafından paylaşılan davranışları tanımlar. Durum nesneleri `Draft`, `PendingReview` ve `Published` olup, hepsi `State` trait'ini uygulayacaktır. Şu an için, trait'in herhangi bir yöntemi yoktur ve gönderinin başlamak istediği durum olan sadece `Draft` durumunu tanımlamaya başlayacağız.

Yeni bir `Post` oluşturduğumuzda, `state` alanını bir `Some` değeri olarak bir `Box` tutacak şekilde ayarlıyoruz. Bu `Box`, yeni bir `Draft` yapısı örneğine işaret eder. Bu, `Post`'un yeni bir örneğini her oluşturduğumuzda taslak olarak başlamasını sağlar. `Post`'un `state` alanı özel olduğu için başka bir durumda bir `Post` oluşturma yolu yoktur! `Post::new` fonksiyonunda, `content` alanını yeni, boş bir `String` değeri ile ayarlıyoruz.

### Gönderi İçeriğinin Metninin Saklanması

Liste 18-11'de gördüğümüz gibi, `add_text` adında bir yöntem çağırmak ve ona bir `&str` geçirerek bu değeri blog gönderisinin metin içeriği olarak ekleme yeteneğine sahip olmak istiyoruz. `content` alanını `pub` olarak açmak yerine, daha sonra `content` alanındaki verilerin nasıl okunacağını kontrol edecek bir yöntem tanımlamak üzere `add_text` yöntemini bünyesine alıyoruz. `add_text` yöntemi oldukça basittir, bu yüzden onu Liste 18-13'te `impl Post` bloğuna ekleyelim:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-13/src/lib.rs:here}}
```



`add_text` yöntemi `self`'e bir değiştirilebilir referans alır; çünkü `add_text` üzerinde işlem yaptığımız `Post` örneğini değiştiriyoruz. Ardından, `content` içindeki `String` üzerinde `push_str` çağırarak, kaydedilen `content`'a eklemek için `text` argümanını iletiriz. Bu davranış, gönderinin bulunduğu duruma bağlı değildir, bu nedenle durum deseninin bir parçası değildir. `add_text` yöntemi `state` alanıyla etkileşime girmez, ancak desteklemek istediğimiz bir davranıştır.

### Taslak Gönderinin İçeriğinin Boş Olduğunun Sağlanması

`add_text` çağrıldığında ve gönderimize biraz içerik eklendiğinde, gönderinin durumu hala taslak olduğu için `content` yönteminin boş bir dize dilimi döndürmesini istemeye devam ediyoruz. Şu an için, bu gereksinimi yerine getirecek en basit şeyle `content` yöntemini uygulayalım: daima boş bir dize dilimi döndürmek. Daha sonra, gönderinin durumunu değiştirip yayınlayabilmek için bunu değiştireceğiz. Şu ana kadar, gönderiler yalnızca taslak durumunda olabilir, bu nedenle gönderi içeriği her zaman boş olmalıdır. Liste 18-14, bu yer tutucu uygulamayı göstermektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-14/src/lib.rs:here}}
```



Bu eklenen `content` yöntemi ile, Liste 18-11'deki 7. satıra kadar her şey beklendiği gibi çalışmaktadır.

### Gönderinin İnceleme Talep Etmesi Durumu Değiştirir

Sonraki adımda, bir gönderinin inceleme talep etme işlevselliğini eklememiz gerekiyor; bu durumunu `Draft`'tan `PendingReview`'a değiştirmelidir. Liste 18-15 bu kodu göstermektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-15/src/lib.rs:here}}
```



`Post`'a `self`'in değiştirilebilir bir referansını alacak genel bir `request_review` yöntemi ekliyoruz. Ardından, `Post`'un mevcut durumuna ait bir iç `request_review` yöntemini çağırıyoruz ve bu ikinci `request_review` yöntemi, mevcut durumu tüketir ve yeni bir durum döndürür.

:::note
`request_review` yöntemini `State` trait'ine ekliyoruz; trait'i uygulayan tüm türler artık `request_review` yöntemini uygulamak zorundadır. Dikkat edin; metodun ilk parametresi olarak `self`, `&self` veya `&mut self` yerine `self: Box` kullanıyoruz. Bu sözdizimi, yöntemin yalnızca bir türü tutan bir `Box` üzerinden çağrıldığında geçerli olduğu anlamına gelir. Bu sözdizimi, `Box`'in sahipliğini alır ve eski durumu geçersiz kılar, bu şekilde `Post`'un durum değeri yeni bir duruma dönüşebilir.
:::

Eski durumu tüketmek için, `request_review` yöntemi durum değerinin sahipliğini alması gerekir. İşte burada `state` alanındaki `Option` devreye giriyor: `state` alanından `Some` değerini almak için `take` yöntemini çağırırız ve bu işleme bırakmak için bir `None` bırakırız; çünkü Rust, yapıların boş alanlarla kullanılmasına izin vermez. Bu, `state` değerini `Post`'tan taşımamızı sağlar; aksi takdirde yalnızca ödünç alırız. Ardından gönderinin `state` değerini, bu işlemin sonucuna ayarlayacağız.

`state` değerinin sahipliğini almak için onu geçici olarak `None`'a ayarlamak gerekiyor, yani, doğrudan `self.state = self.state.request_review();` kodu ile ayarlamıyoruz. Bu, `Post`'un eski `state` değerini yeni bir duruma dönüşmeden sonra kullanamayacağını sağlar.

`Draft` üzerindeki `request_review` yöntemi, inceleme bekleyen bir gönderiyi temsil eden yeni `PendingReview` yapısı için yeni, kutulu bir örneği döndürür. `PendingReview` yapısı da `request_review` yöntemini uygular, ancak dönüşüm yapmaz. Aksine, kendisini döndürür, çünkü bir gönderiyi zaten `PendingReview` durumunda iken inceleme talep ettiğimizde, `PendingReview` durumunda kalması gerekir.

Artık durum deseninin avantajlarını görmeye başlayabiliriz: `Post` üzerindeki `request_review` yöntemi, `state` değeri ne olursa olsun aynıdır. Her bir durum, kendi kurallarından sorumludur.

`Post` üzerindeki `content` yöntemini olduğu gibi bırakacağız; boş bir dize dilimini döndürecektir. Artık hem `Draft` durumunda hem de `PendingReview` durumunda bir `Post`'a sahip olabiliriz, ancak `PendingReview` durumunda aynı davranışı istemekteyiz. Liste 18-11 şimdi 10. satıra kadar çalışıyor!

---

### `content` Davranışını Değiştirmek İçin `approve` Eklemek

`approve` yöntemi, `request_review` yöntemine benzer: durumu onaylandığında mevcut durumun ne olması gerektiğini ayarlayacaktır; bu durum Liste 18-16'da gösterilmiştir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-16/src/lib.rs:here}}
```



`approve` yöntemini `State` trait'ine ekliyoruz ve `State`'i uygulayan yeni bir yapılar olan `Published` durumunu oluşturuyoruz.

`PendingReview` üzerinde `request_review` yönteminin nasıl çalıştığına benzer bir biçimde, bir `Draft` üzerindeki `approve` yöntemini çağırırsak etkisi olmayacaktır; çünkü `approve` kendisini döndürecektir. `PendingReview` üzerinde `approve` çağrıldığında, `Published` yapısının yeni, kutulu bir örneğini döndürür. `Published` yapısı `State` trait'ini uygulamakta ve hem `request_review` yöntemi hem de `approve` yöntemi kendisini döndürmektedir; çünkü bu durumlarda gönderinin `Published` durumunda kalması gerekmektedir.

Artık `Post` üzerindeki `content` yöntemini güncellemeye ihtiyacımız var. `content`'ten döndürülen değerin, `Post`'un mevcut durumuna bağlı olmasını istiyoruz; bu nedenle `Post`, durumu üzerindeki `content` yöntemine devrederiz; bu, Liste 18-17'de gösterilmiştir:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch18-oop/listing-18-17/src/lib.rs:here}}
```



Bu kuralları, `State`'i uygulayan yapılar içinde tutmak hedefindeyiz; bu nedenle durumu içindeki değere bir `content` yöntemi çağırıyoruz ve gönderi örneğini (yani `self`) bir argüman olarak geçiyoruz. Ardından, `state` değerini kullanarak `content` yönteminden dönen değeri döndürüyoruz.

`Option` üzerindeki `as_ref` yöntemini çağırıyoruz çünkü, `Option` içindeki değerle ilgili bir referansa ihtiyacımız var; değer üzerinde sahiplik değil. Çünkü `state`, `Option>` olduğundan, `as_ref` çağırdığımızda `Option>` döndürülür. Eğer `as_ref` çağırmazsak, `state`'i fonksiyon parametrelerinin ödünç alınmış `&self` kısmından çıkarmamız mümkün olmayacağından hata alırdık.

Ardından `unwrap` yöntemini çağırıyoruz ki bunun asla panik oluşturmayacağını biliyoruz; zira `Post` üzerindeki yöntemlerin, bu yöntemler tamamlandığında `state`'in daima bir `Some` değer içereceğini garanti ettiğini bilmektedir. Bu, Kompiler'ın anlayamadığı bir durum; bu, 9. Bölümdeki [“Kompiler'den Daha Fazla Bilginiz Olduğunda”][more-info-than-rustc] bölümünde konuştuğumuz durumlardan biridir.

Bu noktada, `&Box` üzerinde `content` çağırdığımızda, `&` ve `Box` üzerindeki deref dönüştürmesi etkili olacaktır; böylece `content` yöntemi nihayetinde `State` trait'ini uygulayan türde çağrılacaktır. Bu nedenle, `State` trait tanımına `content` eklememiz gerekir ve burada hangi duruma sahip olduğumuza bağlı olarak hangi içeriği döndüreceğimizi belirleyeceğimiz yer olacaktır; bu da Liste 18-18'de gösterilmiştir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-18/src/lib.rs:here}}
```



`content` yönteminin, boş bir dize dilimi döndüren varsayılan bir uygulamasını ekliyoruz. Bu, `Draft` ve `PendingReview` yapılarında `content` uygulaması yapmamıza gerek kalmadığı anlamına geliyor. `Published` yapısı, `content` yöntemini geçersiz kılacak ve `post.content` içindeki değeri döndürecektir.

Bu yöntemde ömür anotasyonlarına ihtiyacımız var; çünkü bir argüman olarak gönderiye bir referans alıyoruz ve ardından o gönderinin bir kısmına referans döndürüyoruz. Yani, döndürülen referansın ömrü, gönderi argümanının ömrüyle ilişkili olacaktır.

Ve işte tamam! Artık Liste 18-11'in tümü çalışıyor! Gönderi iş akışının kurallarını içeren durum desenini uyguladık. Kurallarla ilgili mantık, durum nesnelerinde yaşamaktadır; dağınık bir şekilde `Post`'ta değildir.

> #### Neden Bir Enum Değil?
>
> Farklı olası gönderi durumlarını varyantlar olarak barındıran bir `enum` kullanmadığımızı merak ediyor olabilirsiniz. Bu kesinlikle mümkün bir çözümdür; bunu deneyin ve nihai sonuçları karşılaştırın! Bir `enum` kullanmanın dezavantajlarından biri, enum değerini kontrol eden her yerin, her bir olası varyantı ele alacak bir `match` ifadesine ihtiyacı olacaktır. Bu, bu trait nesnesi çözümünden daha tekrarlı hale gelebilir.

---

### Durum Deseninin Ticari Dengelemeleri

Rust'un her bir durumun nasıl davranması gerektiğini kapsüllemek için nesne yönelimli durum desenini uygulama yeteneği gösterildi. `Post` üzerindeki yöntemler çeşitli davranışlar hakkında hiçbir şey bilmez. Kodumuzu organize etme biçimimiz sayesinde, bir gönderinin yayımlanmış olmasının farklı yollarının yalnızca bir yerde bulunması gerektiğini biliyoruz: `Published` yapısındaki `State` trait'inin uygulanması.

Durum deseni kullanmayan bir alternatif uygulama oluşturursak, `Post` üzerindeki yöntemlerde veya gönderinin durumunu kontrol eden ve o yerlerde davranışı değiştiren `match` ifadeleri kullanabiliriz. Bu durumda, gönderinin yayımlanmış durumunda olmasının tüm etkilerini anlamak için birkaç yerde bakmamız gerekirdi! Bu, eklediğimiz durum sayısı arttıkça sadece daha fazla artacaktı: bu `match` ifadelerinin her biri, başka bir kol gerektirecekti.

Durum deseninde `Post` yöntemleri ve gönderinin kullanıldığı yerler `match` ifadelerine ihtiyaç duymaz; yeni bir durum eklemek için yalnızca yeni bir yapı eklememiz ve bu bir yapı üzerinde trait yöntemlerini uygulamamız gerekir.

Durum desenini kullanarak yapılan uygulama, daha fazla işlevsellik eklemeyi kolaylaştırır. Durum desenini kullanan kodun bakımını sağlamanın basitliğini görmek için, bu önerilerden birkaçını deneyin:

* `PendingReview` durumundan `Draft` durumuna geri dönen bir `reject` yöntemi ekleyin.
* Durumun `Published` olarak değişebilmesi için önce iki kez `approve` çağrısında bulunun.
* Kullanıcıların yalnızca gönderi `Draft` durumundayken metin içeriği eklemesine izin verin. İpucu: durum nesnesinin içerik üzerinde neyin değişebileceğinden sorumlu olmasını ancak `Post`'u değiştirmekten sorumlu olmamasını sağlayın.

Durum deseninin bir dezavantajı, durumların geçişleri uygulayan durumlardan bazıları birbirine bağlı olmalarıdır. `PendingReview` ve `Published` arasında `Scheduled` gibi başka bir durum eklersek, `PendingReview` kodunu, `Scheduled` durumuna geçiş yapacak şekilde değiştirmemiz gerekecektir. `PendingReview` durumunun, yeni bir durum eklenmesi ile birlikte değişiklik yapması gerekmediğinde iş yükü azalmış olur, ancak bu başka bir tasarım desenine geçmek anlamına gelir.

Bir başka dezavantaj, bazı mantıkları çoğaltmış olmamızdır. Bazı çoğaltmayı ortadan kaldırmak için, `State` trait'inde `self` döndüren varsayılan uygulamalar oluşturmaya çalışabiliriz; ancak bu, nesne güvenliğini ihlal eder çünkü trait, kesin `self`'in tam olarak ne olacağını bilemez. `State`'i bir trait nesnesi olarak kullanabilmeyi istiyoruz; bu nedenle yöntemlerinin nesne güvenliğini sağlaması gerekir.

Diğer çoğaltmalara, `Post` üzerindeki `request_review` ve `approve` yöntemlerinin benzer uygulamaları da dahildir. Her iki yöntem de `Option` içindeki değerdeki aynı metodun uygulanmasına ve `state` alanının yeni değerini ayarlamaya devretmektedir. Eğer `Post` üzerinde bu desene uyan birçok yöntem olursa, tekrarları azaltmak için bir makro tanımlamayı düşünebiliriz (bkz. Bölüm 20'deki [“Makrolar”][macros]).

Durum desenini, nesne yönelimli diller için tanımlandığı gibi tam olarak uyguladığımızda, Rust'un güçlü yönlerinden tam olarak yararlanamadığımızı görüyoruz. `blog` krate'sinde geçersiz durumları ve geçişleri derleme zamanı hatalarına dönüştürebilecek bazı değişiklikleri inceleyelim.

#### Durumları Kodu Türleri Olarak Kodlama

Durum desenini yeniden düşünmeyi ve farklı bir takas seti elde etmeyi göstereceğiz. Durumları ve geçişleri tamamen kapsüllemek yerine, dış kodun bunları bilmemesini sağlamak için durumları **farklı türlere** kodlayacağız. Sonuç olarak, Rust'ın tür kontrol sistemi, yalnızca yayımlanan gönderilere izin verilen yerlerde taslak gönderileri kullanma girişimlerini **derleyici hatası** vererek engelleyecek.

:::info
**Açıklama:** Durumları türlere kodlamak, dış etkileşimleri azaltarak daha güvenli bir yazılım tasarımı sağlar.
:::

Listing 18-11'deki `main` fonksiyonunun ilk kısmını ele alalım:



```rust,ignore
{{#rustdoc_include ../listings/ch18-oop/listing-18-11/src/main.rs:here}}
```



`Post::new` kullanarak taslak durumundaki yeni gönderilerin oluşturulmasına ve gönderinin içeriğine metin ekleme yeteneğine hâlâ izin veriyoruz. Ancak, boş bir dize döndüren bir taslak gönderide `content` yönteminin olmasındansa, taslak gönderilerin **hiç** `content` yöntemine sahip olmamasını sağlayacağız. Bu şekilde, taslak bir gönderinin içeriğini almaya çalıştığımızda, metodun mevcut olmadığına dair bir derleyici hatası alacağız. Sonuç olarak, taslak gönderi içeriğini üretimde yanlışlıkla görüntülemek imkansız hale gelecektir, çünkü bu kod derlenmeyecektir.

:::tip
**Öneri:** Taslak gönderilerle çalışırken, `content` yönteminin mevcut olmamasını sağlamak, programınızda hata ayıklamayı kolaylaştırır.
:::

Listing 18-19, `Post` yapısının ve `DraftPost` yapısının tanımını ve her biri üzerindeki yöntemleri gösterir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-19/src/lib.rs}}
```



Hem `Post` hem de `DraftPost` yapıları, blog yazısı metnini saklayan özel bir `content` alanına sahiptir. Yapılar artık `state` alanına sahip değil çünkü durumu kodlamayı yapıların türlerine taşıyoruz. `Post` yapısı yayımlanan bir gönderiyi temsil edecek ve `content` yöntemine sahiptir ve bu `content` döndürür.

Hâlâ `Post::new` fonksiyonuna sahibiz, ancak `Post` örneği döndürmek yerine, bir `DraftPost` örneği döndürüyor. **Content** özel olduğundan ve `Post` döndüren işlevler bulunmadığından, şu anda `Post` örneği oluşturmak mümkün değildir.

:::warning
**Dikkat:** Şu anki yapı, doğrudan `Post` örneği oluşturmayı engelliyor; bu, taslak gönderilerin düzgün yönetimi için önemlidir.
:::

`DraftPost` yapısının `add_text` yöntemi var, bu nedenle `content`'e metin ekleyebiliriz, ancak dikkat edilmesi gereken nokta şu: `DraftPost`'un tanımlı bir `content` yöntemi yok! Bu nedenle, program artık tüm gönderilerin taslak gönderi olarak başlamasını garanti eder ve taslak gönderilerin içeriği görüntülemek için mevcut değildir. Bu kısıtlamaları aşmaya yönelik herhangi bir girişim, bir derleyici hatasıyla sonuçlanacaktır.

#### Geçişleri Farklı Türlere Dönüştürerek Uygulama

Peki, yayımlanan bir gönderiyi nasıl alırız? Taslak bir gönderinin yayımlanmadan önce gözden geçirilmesi ve onaylanması gerektiği kuralını uygulamak istiyoruz. Bekleyen inceleme durumundaki bir gönderi hâlâ hiçbir içerik göstermemelidir. Bu kısıtlamaları uygulamak için başka bir yapı, `PendingReviewPost` ekleyerek `DraftPost` üzerindeki `request_review` yöntemini `PendingReviewPost` döndürecek şekilde tanımlayalım ve `PendingReviewPost` üzerine `approve` yöntemini yayımlanan bir `Post` döndürecek şekilde tanımlayalım, Listing 18-20'de gösterildiği gibi:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-20/src/lib.rs:here}}
```



`request_review` ve `approve` yöntemleri, `self`'in sahipliğini alır ve böylece `DraftPost` ve `PendingReviewPost` örneklerini alır ve sırasıyla bunları bir `PendingReviewPost` ve yayımlanmış bir `Post`'a dönüştürür. Bu şekilde, `request_review` çağrıldığında herhangi bir kalıntı `DraftPost` örneğimiz kalmayacaktır. `PendingReviewPost` yapısında tanımlı bir `content` yöntemi yoktur, bu nedenle içeriğini okumaya çalışmak, `DraftPost`'ta olduğu gibi bir derleyici hatasına neden olur. İçeriği tanımlı bir `content` yöntemine sahip bir yayımlanan `Post` örneği elde etmenin tek yolu, bir `PendingReviewPost` üzerine `approve` yöntemini çağırmaktır; `PendingReviewPost` almak için tek yol ise **`DraftPost`** üzerine `request_review` yöntemini çağırmaktır; şimdi blog gönderi iş akışını tür sistemine kodlamış olduk.

:::note
**Not:** `request_review` ve `approve` yöntemleri, durumları değiştirmeden yeni nesneler döndürerek immutability (değişmezlik) sağlar.
:::

Ancak `main`'de de bazı küçük değişiklikler yapmamız gerekiyor. `request_review` ve `approve` yöntemleri, çağrıldıkları yapıyı değiştirmek yerine yeni örnekler döndürüyor, bu nedenle döndürülen örnekleri saklamak için daha fazla `let post =` gölge atamalarını eklememiz gerekiyor. Ayrıca taslak ve inceleme için bekleyen gönderilerin içeriklerinin boş dizgiler olmasıyla ilgili doğrulamaların olması gerekmiyor; bu durumdaki gönderilerin içeriğini kullanmaya çalışan kodları derleyemeyiz.

`main`'deki güncellenmiş kod, Listing 18-21'de gösterilmiştir:



```rust,ignore
{{#rustdoc_include ../listings/ch18-oop/listing-18-21/src/main.rs}}
```



`post`'u yeniden atamak için `main`'de yaptığımız değişiklikler, bu uygulamanın nesne yönelimli durum desenini tam olarak takip etmediği anlamına geliyor; durumlar arasındaki dönüşümler artık tamamen `Post` uygulaması içinde kapsüllenmemiştir. Ancak, elde ettiğimiz kazanç, geçersiz durumların artık imkansız hale gelmesidir; bu da derlenme zamanında tür sistemi ve tür kontrolü sayesinde mümkündür! Bu, yayımlanmamış bir gönderinin içeriğinin görüntülenmesi gibi belirli hataların, üretime geçmeden önce **tespit edilmesini** sağlar.

:::danger
**Kritik Uyarı:** Yanlış durum geçişlerini önlemek için her zaman uygun türler ve yöntemleri kullanın; aksi takdirde beklenmedik hatalarla karşılaşabilirsiniz.
:::

Bu bölümün başında önerilen görevleri `blog` kütüphanesi üzerinde Listing 18-21'den sonra olduğu gibi deneyin ve bu kodun tasarımı hakkında ne düşündüğünüzü görün. Bazı görevlerin bu tasarımda zaten tamamlanmış olabileceğini unutmayın.

Rust'ın nesne yönelimli tasarım desenlerini uygulama yeteneğine sahip olduğunu gördük; ancak durumları tür sistemine kodlama gibi başka desenler de mevcut. Bu desenlerin farklı takasları vardır. Nesne yönelimli desenlere aşina olsanız bile, Rust'ın özelliklerini avantaja çıkarmak için sorunu yeniden düşünmek, derleme sırasında bazı hataları önlemek gibi faydalar sağlayabilir. Nesne yönelimli desenler, Rust'ın sahiplik gibi belirli özellikleri nedeniyle her zaman en iyi çözüm olmayabilir.

## Özet

Bu bölümden sonra Rust'ın nesne yönelimli bir dil olup olmadığına dair düşünceniz ne olursa olsun, artık Rust'ta bazı nesne yönelimli özellikler elde etmek için **trait nesnelerini** kullanabileceğinizi biliyorsunuz. Dinamik çağrı, kodunuza bir miktar çalışma zamanı performansı karşılığında esneklik kazandırabilir. Bu esnekliği, kodunuza bakım kolaylığı sağlayacak nesne yönelimli desenleri uygulamak için kullanabilirsiniz. Rust ayrıca nesne yönelimli dillerde bulunmayan sahiplik gibi başka özelliklere de sahiptir. Nesne yönelimli bir desen, Rust'ın güçlü yönlerinden yararlanmanın her zaman en iyi yolu olmayabilir, ancak mevcut bir seçenektir.

Sonraki bölümde, Rust'ın birçok esneklik sağlayan özelliklerinden biri olan **desenleri** gözden geçireceğiz. Kitap boyunca bunlara kısa bir bakış attık, ancak henüz tam yeteneklerini görmedik. Hadi başlayalım! 

[more-info-than-rustc]: ch09-03-to-panic-or-not-to-panic.html#cases-in-which-you-have-more-information-than-the-compiler  
[macros]: ch20-06-macros.html#macros