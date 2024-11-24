## Gelişmiş Tipler

Rust'un tip sistemi, şimdiye kadar bahsettiğimiz ancak henüz tartışmadığımız bazı özelliklere sahiptir. İlk olarak, yeni tiplerin (newtypes) neden faydalı olduğunu inceleyerek genel olarak yeni tiplerle başlayacağız. Ardından, yeni tiplerin benzeri ancak biraz farklı bir anlam taşıyan tür takma adlarına (type aliases) geçeceğiz. Ayrıca `!` tipini ve dinamik boyutlu türleri de tartışacağız.

### Tip Güvenliği ve Soyutlama için Yeni Tip Deseni Kullanımı

> **Not:** Bu bölüm, [“Yeni Tip Desenini Dışsal Türler Üzerinde Dışsal Özellikler Gerçekleştirmek için Kullanma”][using-the-newtype-pattern] başlıklı önceki kısmı okuduğunuzu varsaymaktadır.

Yeni tip deseni, şimdiye kadar tartıştığımız görevlerin ötesinde, değerlerin hiç karıştırılmadığını statik olarak sağlamaya ve bir değerin birimlerini göstermeye de yararlıdır. Yeni tiplerin birimleri göstermek için nasıl kullanıldığını, 20-15 numaralı Listede gördünüz: `Millimeters` ve `Meters` yapılarının `u32` değerlerini yeni tip içinde sarmaladığını hatırlayın. 

:::warning
Bir `Millimeters` tipinde bir parametreye sahip bir fonksiyon yazarsak, yanlışlıkla bu fonksiyonu `Meters` tipinde bir değer ya da sıradan bir `u32` ile çağıran bir program derlemeyecektir.
:::

Yeni tip desenini, bir tipin bazı uygulama detaylarını soyutlamak için de kullanabiliriz: yeni tip, özel iç tipin API'sinden farklı bir kamu API'si sunabilir.

Yeni tipler ayrıca iç uygulamaları da gizleyebilir. Örneğin, bir kişinin kimliği ile adını ilişkilendiren bir `HashMap`'i sarmak için `People` türünü sağlayabiliriz. `People` kullanan bir kod, yalnızca sağladığımız kamu API'si ile etkileşimde bulunur; örneğin, `People` koleksiyonuna bir ad dizisi eklemek için bir yöntem; o kod, dahili olarak adlara bir `i32` kimlik atadığımızı bilmek zorunda değildir. Yeni tip deseni, uygulama detaylarını gizlemek için hafif bir kapsülleme sağlamanın bir yoludur; bunu 18. bölümdeki [“Uygulama Detaylarını Gizleyen Kapsülleme”][encapsulation-that-hides-implementation-details] bölümünde tartıştık.

### Tip Takma Adları ile Tip Eşanlamlıları Oluşturma

Rust, var olan bir tipe başka bir isim vermek için *tip takma adları* tanımlama yeteneği sunar. Bunun için `type` anahtar kelimesini kullanırız. Örneğin, `i32` için `Kilometers` takma adını şöyle oluşturabiliriz:

```rust
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-04-kilometers-alias/src/main.rs:here}}
```

Artık `Kilometers` takma adı, `i32` için bir *eşanlamlı*dır; 20-15 numaralı Listede oluşturduğumuz `Millimeters` ve `Meters` tiplerinden farklı olarak, `Kilometers` ayrı, yeni bir tip değildir. `Kilometers` tipine sahip değerler, `i32` tipi değerler gibi işlenir:

```rust
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-04-kilometers-alias/src/main.rs:there}}
```

`Kilometers` ve `i32` aynı tip olduklarından, her iki tipin değerlerini toplayabiliriz ve `i32` parametreleri alan fonksiyonlara `Kilometers` değerlerini geçebiliriz. Ancak, bu yöntemi kullanırken, daha önce tartıştığımız yeni tip deseninin sağladığı tip kontrolü yararını elde edemeyiz. Başka bir deyişle, bir yerde `Kilometers` ve `i32` değerlerini karıştırırsak, derleyici bize hata vermez.

:::tip
Tip eşanlamlılarının ana kullanım durumu tekrarları azaltmaktır.
:::

Örneğin, aşağıdaki gibi uzun bir tipimiz olduğunu varsayalım:

```rust,ignore
Box<dyn Fn() + Send + 'static>
```

Bu uzun tipin fonksiyon imzalarında ve kodun her yerinde tip açıklamaları olarak yazılması, yorucu ve hata yapmaya neden olabilir. Düşünün ki, böyle bir projede 20-24 numaralı Listede gösterilen gibi bir kod dolu.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-24/src/main.rs:here}}
```



Bir tip takma adı, bu kodu tekrarı azaltarak daha yönetilebilir hale getirir. 20-25 numaralı Listede, ayrıntılı tip için `Thunk` adında bir takma ad tanıttık ve türün tüm kullanımlarını daha kısa olan `Thunk` takma adıyla değiştirebiliriz.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-25/src/main.rs:here}}
```



Bu kod çok daha okunabilir ve yazılması kolay! Bir tip takma adına anlamlı bir isim seçmek, niyetinizi iletmeye yardımcı olabilir (*thunk* kelimesi, daha sonraki bir zamanda değerlendirilecek kod anlamına gelir, böylece saklanan bir closure için uygun bir isimdir).

Tip takma adları, tekrarları azaltmak için `Result` tipi ile yaygın olarak kullanılır. Standart kütüphanedeki `std::io` modülünü göz önünde bulundurun. G/Ç işlemleri genellikle işlemler başarısız olduğunda durumları ele almak için `Result` döndürür. Bu kitaplıkta tüm olası G/Ç hatalarını temsil eden bir `std::io::Error` yapısı bulunmaktadır. `std::io` içindeki birçok fonksiyon, `E`'sinin `std::io::Error` olduğu `Result` döndürecektir; örneğin `Write` trait'indeki bu fonksiyonlar:

```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-05-write-trait/src/lib.rs}}
```

`Result` çokça tekrar edilir. Bu nedenle, `std::io` bu tip takma ad deklarasyonuna sahiptir:

```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-06-result-alias/src/lib.rs:here}}
```

Bu deklarasyon `std::io` modülünde olduğundan, tam olarak nitelikli takma ad olan `std::io::Result`'yi kullanabiliriz; yani `E`, `std::io::Error` olarak doldurulmuş bir `Result`. `Write` trait fonksiyon imzaları şu şekilde görünmektedir:

```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-06-result-alias/src/lib.rs:there}}
```

Tip takma adı iki yönden faydalıdır: kodu yazmayı kolaylaştırır *ve* `std::io`'nun tamamında tutarlı bir arayüz sunar. Bir takma ad olduğu için, bu sadece başka bir `Result`'dir, yani `Result` üzerinde çalışan herhangi bir yöntemi onunla kullanabiliriz ve `?` operatörü gibi özel söz dizimini de kullanabiliriz.

### Asla Dönmeyen `Never` Tipi

Rust, tip teorisi dilinde *boş tip* olarak bilinen özel bir tip olan `!`'a sahiptir çünkü hiçbir değeri yoktur. Asla dönmeyecek bir fonksiyonun dönüş tipi yerine geçen *asla* tipi olarak adlandırmayı tercih ediyoruz. İşte bir örnek:

```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-07-never-type/src/lib.rs:here}}
```

Bu kod, "fonksiyon `bar` asla dönmez." şeklinde okunur. Asla dönen fonksiyonlara *sapmaya neden olan fonksiyonlar* denir. `!` tipinde değerler oluşturamayacağımız için, `bar` hiçbir zaman geri dönemez.

:::note
Ama asla değer oluşturamayacağınız bir tipin ne işlevi var?
:::

20-26 numaralı Listede yer alan sayı tahmin oyununun kodunu hatırlayın; burada bir kısmını tekrar oluşturduk.



```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-05/src/main.rs:ch19}}
```



O zaman, bu kodda bazı ayrıntıları atladık. 6. bölümde [“`match` Kontrol Akışı Operatörü”][the-match-control-flow-operator] bölümünde, `match` kollarının hepsinin aynı türde dönüş yapması gerektiğini tartıştık. Yani, örneğin, aşağıdaki kod çalışmaz:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-08-match-arms-different-types/src/main.rs:here}}
```

Bu koddaki `guess` tipi bir tam sayı *ve* bir dize olmalıdır, Rust ise `guess`'in yalnızca bir tipe sahip olmasını gerektirir. Peki `continue` ne döndürür? 20-26 numaralı Listede, bir kola `u32` değer döndürürken başka bir kolun `continue` ile bitmesine nasıl izin verdik?

Tahmin ettiğiniz gibi, `continue` bir `!` değerine sahiptir. Yani, Rust `guess` tipini hesaplarken, ilk kol bir `u32` değeri ve diğeri bir `!` değeri ile bakar. `!` hiçbir zaman bir değere sahip olamayacağı için, Rust `guess` tipinin `u32` olduğunu kararlaştırır.

Bu davranışı tanımlamanın resmi yolu, `!` tipindeki ifadelerin diğer herhangi bir türe zorlanabileceğidir. `continue` ile biten bu `match` kolunu sonlandırmamıza izin veriliyor çünkü `continue` bir değer döndürmez; bunun yerine kontrol akışını döngünün en üstüne geri döndürür, bu yüzden `Err` durumunda `guess`'e asla bir değer atamayız.

Asla tipi, `panic!` makrosuyla da kullanışlıdır. `Option` değerlerinde bir değer üretmek veya bu tanıma sahip panikleme fonksiyonunu çağırdığımızı hatırlayın:

```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-09-unwrap-definition/src/lib.rs:here}}
```

Bu kodda, 20-26 numaralı Listede bulunan `match` alanındaki şeylerin aynısı oldu: Rust, `val`'ın `T` tipinde ve `panic!`'in `!` tipinde olduğunu gördü, yani genel `match` ifadesinin sonucu `T` olarak belirleniyor. Bu kod, `panic!` değer üretmediği için çalışır; programı sonlandırır. `None` durumunda, `unwrap`'ten bir değer döndürmeyeceğiz, bu nedenle bu kod geçerlidir.

`!` tipinde bir son ifade daha vardır: bir `loop`:

```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-10-loop-returns-never/src/main.rs:here}}
```

Burada, döngü asla bitmez, bu yüzden `!` ifadenin değeridir. Ancak, `break` eklersek bu doğru olmaz; çünkü döngü `break`e geldiğinde sona erecektir.

### Dinamik Boyutlu Türler ve `Sized` Trait'i

Rust, belirli türleri hakkında bazı ayrıntılara ihtiyaç duyar, örneğin, belirli bir tür için bir değer ayırmak için ne kadar alan gerektiği. Bu, tür sisteminin bir köşesini ilk başta biraz kafa karıştırıcı hale getirir: *dinamik boyutlu türler* kavramı. Bazen *DST'ler* veya *boyutsuz türler* olarak adlandırılan bu türler, yalnızca çalışma zamanında boyutlarını bilerek kod yazmamıza olanak tanır.

`str` adında bir dinamik boyutlu tipin ayrıntılarına girelim; bu tür, kitap boyunca kullandığımız bir türdür. Evet, `&str` değil, yalnızca `str`, bir DST'dir. String'in ne kadar uzun olduğunu çalışma zamanında bilmediğimizden, `str` tipinde bir değişken oluşturamayız veya `str` tipinde bir argümanı alamayız. Aşağıdaki kodu düşünün, bu çalışmaz:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-11-cant-create-str/src/main.rs:here}}
```

Rust'un, belirli bir tür için herhangi bir değer ayırmak üzere ne kadar bellek ayıracağını bilmesi gerekir ve bir türün tüm değerleri aynı miktarda bellek kullanmalıdır. Rust, bu kodu yazmamıza izin verirse, bu iki `str` değerinin aynı miktarda alan alması gerekir. Ama farklı uzunlukları vardır: `s1` 12 baytlık depolama gerektirirken, `s2` 15 bayt gerektirir. Bu nedenle, dinamik boyutlu bir tür tutan bir değişken oluşturmak mümkün değildir.

Peki ne yapacağız? Bu durumda, cevabı biliyorsunuz: `s1` ve `s2` tiplerini bir `&str` olarak yaparız. 4. bölümdeki [“String Dilimleri”][string-slices] bölümünde, dilim veri yapısının yalnızca başlangıç pozisyonunu ve dilimin uzunluğunu depoladığını hatırlayın. Yani, `&T` bir değer olan `T`'nin bellek adresini depolarken, `&str` *iki* değerdir: `str`'nin adresi ve uzunluğu. Bu nedenle, bir `&str` değerinin boyutunu derleme zamanında biliyoruz: `usize`'nin iki katı uzunluğundadır. Yani, `&str`'nin boyutunu, referans ettiği string ne kadar uzun olursa olsun her zaman biliyoruz. 

:::info
Genel olarak, dinamik boyutlu türler Rust'ta bu şekilde kullanılır: dinamik bilginin boyutunu depolayan ekstra bir metadata sayısı vardır.
:::

Dinamik boyutlu türlerin altın kuralı, dinamik boyutlu tür değerlerini her zaman bir tür belirteci (pointer) ardına koymamız gerektiğidir. 

`str`'yi her türlü tür belirteci ile birleştirebiliriz: örneğin, `Box` veya `Rc`. Aslında, daha önce ama farklı bir dinamik boyutlu tipte: trait'lerle birlikte görmüştünüz. 18. bölümde [“Farklı Türlerle Değerler İçin Trait Nesnelerini Kullanma”][using-trait-objects-that-allow-for-values-of-different-types] bölümünde, trait'leri trait nesneleri olarak kullanmak için, onları bir işaretçi (pointer) arkasına koymamız gerektiğini belirtmiştik; örneğin `&dyn Trait` veya `Box` (`Rc` de işe yarar).

DST'lerle çalışmak için, Rust, derleme zamanında bir türün boyutunun bilini olup olmadığını belirlemek için `Sized` trait'ini sağlar. Bu trait, derleme zamanında boyutu bilinen her şey için otomatik olarak uygulanır. Ayrıca, Rust, her genel fonksiyona otomatik olarak `Sized` üzerinde bir sınır ekler. Yani, aşağıdaki gibi bir genel fonksiyon tanımı:

```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-12-generic-fn-definition/src/lib.rs}}
```

aslında şöyle yazılmış gibi muamele görür:

```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-13-generic-implicit-sized-bound/src/lib.rs}}
```

Varsayılan olarak, genel fonksiyonlar derleme zamanında boyutları bilinen türler üzerinde yalnızca çalışır. Ancak, bu kısıtlamayı rahatlatmak için şu özel sözdizimini kullanabilirsiniz:

```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-14-generic-maybe-sized/src/lib.rs}}
```

`?Sized` üzerindeki bir trait sınırı, "`T` boyutunu bilmek zorunda değildir" anlamına gelir ve bu notasyon, genel türlerin derleme zamanında bilinen bir boyuta sahip olma varsayımlarını geçersiz kılar. Bu anlamda `?Trait` sözdizimi yalnızca `Sized` için mevcuttur, diğer herhangi bir trait için değil.

Ayrıca, `t` parametresinin tipini `T`'den `&T`'ye değiştirdiğimizi unutmayın. Tür `Sized` olmayabileceğinden, onu bir tür belirteci ardına kullanmamız gerekir. Bu durumda, bir referans seçtik.

İleri de fonksiyonlar ve closure'lar hakkında konuşacağız! 

[encapsulation-that-hides-implementation-details]:
ch18-01-what-is-oo.html#encapsulation-that-hides-implementation-details
[string-slices]: ch04-03-slices.html#string-slices
[the-match-control-flow-operator]:
ch06-02-match.html#the-match-control-flow-operator
[using-trait-objects-that-allow-for-values-of-different-types]:
ch18-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types
[using-the-newtype-pattern]: ch20-03-advanced-traits.html#using-the-newtype-pattern-to-implement-external-traits-on-external-types