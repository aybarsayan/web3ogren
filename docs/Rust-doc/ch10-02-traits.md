## Özellikler: Paylaşılan Davranışı Tanımlama

Bir **özellik**, belirli bir türün sahip olduğu ve diğer türlerle paylaşabileceği işlevselliği tanımlar. Özellikleri, soyut bir şekilde paylaşılan davranışı tanımlamak için kullanabiliriz. **Özellik sınırları** kullanarak, bir generic türün belirli bir davranışı olan herhangi bir tür olabileceğini belirtebiliriz.

> **Not:** Özellikler, bazı dillerde *arayüzler* olarak adlandırılan bir özellikle benzerdir, ancak bazı farklılıklar vardır.

### Bir Özellik Tanımlama

Bir türün davranışı, o tür üzerinde çağırabileceğimiz metotlardan oluşur. Farklı türler, bu türlerin tümünde aynı metotları çağırabiliyorsak aynı davranışı paylaşır. Özellik tanımları, belirli bir amacı başarmak için gerekli olan bir dizi davranışı tanımlamak için metot imzalarını bir araya getirme yoludur.

Örneğin, çeşitli metin türleri ve miktarları tutan birden fazla yapı (struct) olduğunu varsayalım: belirli bir konumda dosyalanmış bir haber hikayesini tutan bir `NewsArticle` yapısı ve en fazla 280 karakter içeren, yeni bir tweet, retweet veya başka bir tweete yanıt olup olmadığını gösteren meta veriler içerebilen bir `Tweet`.

Bir `NewsArticle` veya `Tweet` örneğinde saklanabilecek verilerin özetlerini gösterebilen `aggregator` adında bir medya agregatör kütüphanesi oluşturmak istiyoruz. Bunu yapmak için, her türden bir özet almamız gerekiyor ve bu özeti bir örnekte `summarize` metodu çağrılarak talep edeceğiz. Liste 10-12, bu davranışı ifade eden genel bir `Summary` özelliğinin tanımını gösterir.



```rust,noplayground
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-12/src/lib.rs}}
```



Burada, `trait` anahtar kelimesini kullanarak bir özellik tanımlıyoruz ve ardından bu özelliğin adı (bu durumda `Summary`) gelmektedir. Ayrıca, bu özelliği `pub` olarak tanımlayarak, bu crate'e bağımlı olan diğer crate'lerin de bu özelliği kullanabilmesini sağlarız; birkaç örnekte bunu göreceğiz. Süslü parantezlerin içinde, bu özelliği uygulayan türlerin davranışlarını tanımlayan metot imzalarını tanımlıyoruz; bu durumda `fn summarize(&self) -> String` ifadesine sahibiz.

**Metot imzasından sonra**, süslü parantezler içinde bir uygulama sağlamak yerine bir noktalı virgül kullanıyoruz. Bu özelliği uygulayan her tür, metodun gövdesi için kendi özel davranışını sağlamalıdır. Derleyici, `Summary` özelliğine sahip herhangi bir türün, bu imzayla `summarize` metodunun tanımlanmış olacağını zorunlu kılacaktır.

Bir özellik, gövdesinde birden fazla metoda sahip olabilir: metot imzaları her bir satıra bir tane gelecek şekilde listelenir ve her satır bir noktalı virgül ile sona erer.

### Bir Tür Üzerine Özellik Uygulama

Şimdi `Summary` özelliğinin metotlarının istenen imzalarını tanımladıktan sonra, bunu medya agregatörümüzdeki türler üzerinde uygulayabiliriz. Liste 10-13, `NewsArticle` yapısına `Summary` özelliği uygulanmasını göstermektedir; bu yapı, başlık, yazar ve konum kullanarak `summarize` dönüş değerini oluşturur. `Tweet` yapısı için, `summarize` yöntemini kullanıcı adı ve ardından tweetin tamamı olarak tanımlıyoruz; tweet içeriğinin zaten 280 karakterle sınırlı olduğunu varsayıyoruz.



```rust,noplayground
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-13/src/lib.rs:here}}
```



Bir tür üzerinde bir özelliği uygulamak, normal metotları uygulamak gibidir. Tek fark, `impl` ifadesinden sonra uygulamak istediğimiz özellik adını yazmamız sonra `for` anahtar kelimesini kullanarak uygulamak istediğimiz türün adını belirtmemizdir. `impl` bloğu içerisinde, özellik tanımında tanımlanan metot imzalarını ekliyoruz. Her bir imzanın sonuna noktalı virgül eklemek yerine, süslü parantezleri kullanarak metodun gövdesini uygulamak istediğimiz belirli davranışla dolduruyoruz.

**Artık kütüphane, `NewsArticle` ve `Tweet` üzerinde `Summary` özelliğini uyguladı, crate'in kullanıcıları `NewsArticle` ve `Tweet` örnekleri üzerinde özellik metotlarını, normal metotları çağırır gibi çağırabilir. Tek fark, kullanıcının türlerin yanı sıra özelliği de kapsam içine alması gerektiğidir.** İşte bir binary crate'in `aggregator` kütüphane crate'ini nasıl kullanabileceğine dair bir örnek:

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-01-calling-trait-method/src/main.rs}}
```

Bu kod, `1 new tweet: horse_ebooks: of course, as you probably already know, people` çıktısını verir.

`aggregator` crate'ine bağımlı diğer crate'ler de kendi türlerine `Summary` uygulamak için `Summary` özelliğini kapsam içine alabilir. **Not edilmesi gereken bir kısıtlama**, bir özellik üzerinde bir türü yalnızca ya özellik ya da tür, ya da ikisi de crate'imize yerel olduğu sürece uygulayabileceğimizdir. Örneğin, `Tweet` gibi bir özel tür olan `Tweet` üzerinde `Display` gibi standart kütüphane özelliklerini uygulayabiliriz, çünkü `Tweet` türü `aggregator` crate'imize yereldir. Ayrıca `Vec` üzerinde `Summary` uygulayabiliriz çünkü `Summary` özelliği `aggregator` crate'imize yereldir.

Ancak, dış özellikleri dış türler üzerinde uygulayamıyoruz. Örneğin, `aggregator` crate'imizin içinde `Vec` üzerinde `Display` özelliğini uygulayamıyoruz çünkü `Display` ve `Vec` her ikisi de standart kütüphanede tanımlanmıştır ve `aggregator` crate'imize yerel değildir. Bu kısıtlama, *tutarlılık* adı verilen bir özellikten ve daha spesifik olarak *yetim kuralı* adıyla bilinir; çünkü ana tür mevcut değildir. Bu kural, başkalarının kodunun sizin kodunuzu ve tersinin bozmamasını sağlar. Kural olmadan, iki crate aynı tür için aynı özelliği uygulayabilir ve Rust hangi uygulamanın kullanılacağını bilemezdi.

### Varsayılan Uygulamalar

Bazen, her tür için tüm metotların uygulamalarını gerektirmek yerine, bir özelliğin bazı ya da tüm metotları için varsayılan bir davranışa sahip olmak faydalı olabilir. Daha sonra, belirli bir tür üzerinde özelliği uygularlarken, her bir metodun varsayılan davranışını koruyabilir ya da değiştirebiliriz.

Liste 10-14'te, `Summary` özelliğinin `summarize` metodu için varsayılan bir dize belirtiyoruz; bunu sadece yöntem imzasını tanımladığımız gibi, Liste 10-12'de yaptığımız gibi yapmıyoruz.



```rust,noplayground
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-14/src/lib.rs:here}}
```



`NewsArticle` örneklerini özetlemek için varsayılan bir uygulama kullanmak üzere, `impl Summary for NewsArticle {}` ile boş bir `impl` bloğu belirtiyoruz.

**`NewsArticle` üzerinde `summarize` metodunu artık doğrudan tanımlamıyor olsak da, varsayılan bir uygulama sağladık ve `NewsArticle`'ın `Summary` özelliğini uyguladığını belirttik. Sonuç olarak, `NewsArticle` örneği üzerinde `summarize` metodunu hala çağırabiliriz, bu şekilde:** 

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-02-calling-default-impl/src/main.rs:here}}
```

Bu kod, `New article available! (Read more...)` çıktısını verir.

Varsayılan bir uygulama oluşturmak, Liste 10-13'te `Tweet` üzerinde `Summary` uygulamasında değişiklik yapmamızı gerektirmez. Bunun nedeni, varsayılan bir uygulamayı değiştirmek için kullanılacak söz diziminin, varsayılan bir uygulama olmayan bir özellik metodu uygulamak için kullanılan söz dizimiyle aynı olmasıdır.

Varsayılan uygulamalar, aynı özellikteki diğer metotları çağırabilir; diğer metotların varsayılan uygulaması olmasa bile. Bu şekilde, bir özellik çok fazla yararlı işlev sağlayabilir ve yalnızca uygulayıcılardan küçük bir kısmını belirtmeleri istenir. Örneğin, `summarize_author` adında bir metot tanımlayabiliriz; bu metot uygulanmak zorundadır ve sonra varsayılan bir uygulama, `summarize_author` metodunu çağıran bir `summarize` metodu tanımlanabilir:

```rust,noplayground
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-03-default-impl-calls-other-methods/src/lib.rs:here}}
```

Bu `Summary` versiyonunu kullanmak için, tür üzerinde özelliği uygularken yalnızca `summarize_author`'ı tanımlamamız gerekir:

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-03-default-impl-calls-other-methods/src/lib.rs:impl}}
```

`summarize_author`'ı tanımladıktan sonra, `Tweet` yapısının örneklerinde `summarize`'ı çağırabiliriz ve `summarize`ın varsayılan uygulaması, sağladığımız `summarize_author` tanımını çağırır. `summarize_author`'ı uyguladığımız için, `Summary` özelliği, bizim başka bir kod yazmamıza gerek kalmadan `summarize` metodunun işlevselliğini sağlamıştır. İşte nasıl göründüğü:

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-03-default-impl-calls-other-methods/src/main.rs:here}}
```

Bu kod, `1 new tweet: (Read more from @horse_ebooks...)` çıktısını verir.

Dikkat edilmesi gereken nokta, aynı metodun geçersiz kılınmış bir uygulamasından varsayılan uygulamanın çağrılmasının mümkün olmamasıdır.

### Özellikleri Parametre Olarak Kullanma

Artık özellik tanımlamayı ve uygulamayı bildiğinize göre, birçok farklı türü kabul etmek için özellikleri nasıl kullanabileceğimizi keşfedebiliriz. İlgili fonksiyonların `Summary` özelliğini `NewsArticle` ve `Tweet` türlerinde Liste 10-13'te uyguladığımızı kullanarak bir `notify` fonksiyonu tanımlayacağız; bu fonksiyon, `item` parametresinde `summarize` metodunu çağırır ki bu parametre `Summary` özelliğini uygulayan herhangi bir türdendir. Bunu yapmak için, `impl Trait` sözdizimini kullanıyoruz:

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-04-traits-as-parameters/src/lib.rs:here}}
```

`item` parametresinde belirli bir tür yerine, `impl` anahtar kelimesini ve özellik adını belirtiriz. Bu parametre, belirtilen özelliği uygulayan herhangi bir türü kabul eder. `notify` gövdesinde, `item` üzerinde `Summary` özelliğinden gelen her türlü metodunu çağırabiliriz; örneğin `summarize`. `notify` fonksiyonunu çağırabilir ve `NewsArticle` veya `Tweet` örneklerinden herhangi birini geçirebiliriz. Fonksiyonu herhangi bir başka türle çağıran kod, örneğin bir `String` veya `i32`, derlenmeyecek çünkü bu türler `Summary` özelliğini uygulamamaktadır.

#### Özellik Sınırı Sözdizimi

`impl Trait` sözdizimi, basit durumlar için işe yarar ancak aslında *özellik sınırı* olarak bilinen daha uzun bir biçim için sözdizimi şekeridir; şöyle görünmektedir:

```rust,ignore
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

Bu daha uzun biçim, önceki bölümdeki örnekle eşdeğerdir ancak daha ayrıntılıdır. **Özellik sınırlarını** bir tür parametresinin tanımıyla üst üste koyarız; bir iki nokta (:) ve açılı parantezler ().

`impl Trait` sözdizimi, basit durumlar için uygun ve daha özlü kod yazmak için kullanılabilirken, daha kompleks durumlar için daha kapsamlı özellik sınırı sözdizimi kullanılabilir. Örneğin, iki parametrenin `Summary` uygulamasını sağlaması mümkündür. `impl Trait` sözdizimiyle bunu şöyle gerçekleştiririz:

```rust,ignore
pub fn notify(item1: &impl Summary, item2: &impl Summary) {
```

`item1` ve `item2`'nin farklı türlere sahip olmasına izin verecek şekilde bu fonksiyonu yazmak için `impl Trait` kullanışlıdır (Her iki tür de `Summary` uyguladığı sürece). Ancak, her iki parametrenin de aynı türde olmasını istiyorsak, o zaman bir özellik sınırı kullanmalıyız; aşağıdaki gibi:

```rust,ignore
pub fn notify<T: Summary>(item1: &T, item2: &T) {
```

`item1` ve `item2` parametrelerinin türü olarak belirtilen generic tür `T`, fonksiyonu, `item1` ve `item2` için geçirilen argümanın somut türünün aynı olması gerektiğini kısıtlar.

#### `+` Sözdizimi ile Birden Fazla Özellik Sınırı Belirleme

Birden fazla özellik sınırını da belirleyebiliriz. `notify` fonksiyonunun `summarize` ile birlikte görünüm formatlaması kullandığını varsayalım; `notify` tanımında `item`'in hem `Display` hem de `Summary` uygulamasını sağlaması gerektiğini belirtiriz. Bunu `+` sözdizimi kullanarak yapabiliriz:

```rust,ignore
pub fn notify(item: &(impl Summary + Display)) {
```

`+` sözdizimi, generic türler üzerindeki özellik sınırları için de geçerlidir:

```rust,ignore
pub fn notify<T: Summary + Display>(item: &T) {
```

İki özellik sınırı belirtildiğinde, `notify` gövdesinde `summarize` çağırabilir ve `item`'i `{}` ile biçimlendirebiliriz.

#### `where` Kapsamıyla Daha Net Özellik Sınırları

Çok fazla özellik sınırını kullanmanın dezavantajları vardır. Her generic'in kendi özellik sınırları vardır; bu nedenle birden fazla generic tür parametreli fonksiyonlar, fonksiyon adının ve parametre listesinin arasında çok fazla özellik sınır bilgisi içerebilir, bu da fonksiyon imzasını zor okunur hale getirebilir. Bu nedenle, Rust, fonksiyon imzasından sonra `where` ifadesini kullanarak, özellik sınırlarını belirtmek için alternatif bir sözdizimi sunar. Yani, şunu yazmak yerine:

```rust,ignore
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {
```

şu şekilde `where` ifadesi kullanabiliriz:

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-07-where-clause/src/lib.rs:here}}
```

Bu fonksiyonun imzası daha derli toplu hale gelir: **fonksiyon adı, parametre listesi ve dönüş türü daha yakındır, çok sayıda özellik sınırı olan bir fonksiyondan daha sadedir.**

### Özellikleri Uygulayan Türler Döndürme

`impl Trait` sözdizimini dönüş pozisyonunda, belirli bir özelliği uygulayan bazı türden bir değeri döndürmek için de kullanabiliriz; şunu şöyle gösteririz:

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-05-returning-impl-trait/src/lib.rs:here}}
```

Dönüş türü için `impl Summary` kullanarak, `returns_summarizable` fonksiyonunun somut türünü adlandırmadan, `Summary` özelliğini uygulayan bazı türlerin döndürüleceğini belirtiyoruz. Bu durumda, `returns_summarizable` bir `Tweet` döndürür ancak bu fonksiyonu çağıran kod bununla ilgili bilgiye sahip olmamalıdır.

Bir dönüş türünü sadece somut türü türettiği özellik ile belirtme yeteneği, özellikle kapalı ifadeler ve iteratörler bağlamında faydalıdır; ki bunları 13. Bölümde ele alıyoruz. Kapalı ifadeler ve iteratörler, yalnızca derleyici tarafından bilinen veya belirtmesi çok uzun türler oluşturur. `impl Trait` sözdizimi, bir fonksiyonun, çok uzun türleri yazmadan, `Iterator` özelliğini uygulayan bir türü döndürdüğünü belirtmek için kısa bir yol sağlar.

Ancak, `impl Trait` yalnızca bir tür döndürüyorsanız kullanılabilir. Örneğin, dönüş türü olarak `impl Summary` belirtilmiş bir kod, bir `NewsArticle` veya bir `Tweet` döndürmeye çalıştığında çalışmaz:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-06-impl-trait-returns-one-type/src/lib.rs:here}}
```

Bir `NewsArticle` veya `Tweet` döndüren bir fonksiyon yazılmasına izin verilmemektedir; bunun nedeni, `impl Trait` sözdiziminin derleyicide nasıl uygulandığı ile ilgilidir. Bu davranışı sağlayacak bir fonksiyon yazmayı, 18. Bölümde "Farklı Türlerde Değerler için Özellik Nesneleri Kullanma" bölümünde ele alacağız.

### Özellik Sınırlarını Koşullu Olarak Metotları Uygulamak için Kullanma

Generic tür parametrelerini kullanan `impl` bloğunda bir özellik sınırı kullanarak, belirtilen özellikleri uygulayan türler için metotları koşullu olarak uygulayabiliriz. **Örneğin, Liste 10-15'te, `Pair` türü her zaman `Pair`'nin yeni bir örneğini döndüren `new` fonksiyonunu uygular.** Ancak sonraki `impl` bloğunda, `Pair` yalnızca iç türü `T` `PartialOrd` özelliğini uyguladığı ve `Display` özelliğini uyguladığı durumda `cmp_display` metodunu uygular.



```rust,noplayground
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-15/src/lib.rs}}
```



Bir türün başka bir özelliği uyguladığı durumlarda, özellik sağlama konusunda da koşullu uyarlama yapabiliriz. **Herhangi bir tür üzerinde herhangi bir özelliği uygulamanın implementasyonuna *Blanket Implementations* denir ve Rust standart kütüphanesinde yaygın şekilde kullanılır.** Örneğin, standart kütüphane, `Display` özelliğini uygulayan herhangi bir tür üzerinde `ToString` özelliğini uygular. Standart kütüphanedeki `impl` bloğu bu koda benzer görünmektedir:

```rust,ignore
impl<T: Display> ToString for T {
    // --snip--
}
```

Standart kütüphanesinin bu blanket uygulaması sayesinde, `Display` özelliğini uygulayan herhangi bir tür üzerinde `ToString` özelliğinden tanımlanan `to_string` metodunu çağırabiliriz. **Örneğin, tam sayıların karşılık gelen `String` değerlerine dönüşmesi şöyle olabilir çünkü tam sayılar `Display` uygular:**

```rust
let s = 3.to_string();
```

**Blanket uygulama, bir özelliğin "Uygulayıcılar" kısmında belgelerinde yer alır.**

Özellikler ve özellik sınırları, kodumuzu tekrarı azaltacak şekilde generic tür parametreleri kullanma imkanı sunar, ancak aynı zamanda derleyiciye generic türün belirli bir davranışa sahip olmasını istediğimizi belirtme yeteneği verir. Derleyici, bu tür sınırları bilgilerini kullanarak, kodumuzla kullanılan somut türlerin tümünün doğru davranışı sağladığını kontrol edebilir. Dinamik olarak türlenen dillerde, bir metodu tanımlamayan bir tür üzerinde bir metot çağırdığımızda, çalışma zamanında bir hata alırız. Ancak Rust, bu hataları derleme zamanına taşır, böylelikle kodumuz çalışmadan önce sorunları düzeltmek zorundayız. Ayrıca, çalışma zamanında davranışı kontrol edecek kod yazmak zorunda kalmadan, derleme zamanında zaten kontrol ettiğimiz için performansı artırırız ve generiklerin sağladığı esneklikten de vazgeçmemiş oluruz.