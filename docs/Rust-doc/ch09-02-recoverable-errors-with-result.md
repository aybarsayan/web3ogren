## `Result` ile Kurtarılabilir Hatalar

Çoğu hata, programın tamamen durmasını gerektirecek kadar ciddi değildir. Bazen bir fonksiyon başarısız olduğunda, durumu kolayca yorumlayabilir ve tepki verebilirsiniz. Örneğin, bir dosyayı açmaya çalıştığınızda ve bu işlem dosyanın mevcut olmaması nedeniyle başarısız olursa, işlemi sonlandırmak yerine dosyayı oluşturmak isteyebilirsiniz.

:::info
2. Bölümde [“`Result` ile Olası Hataları Yönetme”][handle_failure]'den hatırlayacağınız gibi, `Result` enum'u iki varyant olarak tanımlanmıştır: `Ok` ve `Err`, şu şekilde:
:::

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`T` ve `E`, geneik tür parametreleridir: generikleri daha detaylı bir şekilde 10. Bölümde ele alacağız. Şu anda bilmeniz gereken, `T`'nin `Ok` varyantında başarı durumunda döndürülecek değerin türünü temsil ettiği ve `E`'nin `Err` varyantında döndürülecek hatanın türünü temsil ettiği. `Result`'ın bu genel tür parametreleri olduğu için, `Result` türünü ve üzerinde tanımlanan fonksiyonları, döndürülecek başarı ve hata değerlerinin farklı olabileceği birçok durumda kullanabiliriz.

Başarılı olabileceği için bir `Result` değeri döndüren bir fonksiyonu çağıralım. 9-3. Listede bir dosyayı açmaya çalışıyoruz.



```rust
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-03/src/main.rs}}
```



`File::open`'ın dönüş türü `Result`'dir. Genel parametre `T`, `File::open`'ın başarı değerinin türü olan `std::fs::File` ile doldurulmuştur, bu bir dosya tanıtıcısıdır. Hata değerinde kullanılan `E` türü ise `std::io::Error`'dır. Bu dönüş türü, `File::open` çağrısının başarılı olabileceği ve bizden okunabilir veya yazılabilir bir dosya tanıtıcısı döndürebileceği anlamına gelir. Fonksiyon çağrısı başarısız da olabilir: örneğin dosya mevcut olmayabilir veya dosyaya erişim izniniz olmayabilir. `File::open` fonksiyonunun bize başarılı olup olmadığını bildirmesi ve aynı zamanda ya dosya tanıtıcısını ya da hata bilgisini vermesi gerekir. Bu bilgi tam olarak `Result` enum'u aracılığıyla iletilir.

> Eğer `File::open` başarılı olursa, `greeting_file_result` değişkenindeki değer, bir dosya tanıtıcısı içeren `Ok` örneği olacaktır. Eğer başarısız olursa, `greeting_file_result` değişkenindeki değer, oluşan hata hakkında daha fazla bilgi içeren bir `Err` örneği olacaktır.

:::tip
9-3. Listesindeki koda, `File::open`'ın döndüreceği değere bağlı olarak farklı eylemler gerçekleştirmek için eklemeler yapmamız gerekiyor. 9-4. Liste, `Result`'ı ele almak için, 6. Bölümde ele aldığımız temel araç olan `match` ifadesini kullanmanın bir yolunu gösteriyor.
:::



```rust,should_panic
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-04/src/main.rs}}
```



`Option` enum'u gibi, `Result` enum'u ve varyantları, önceden tanımlı olarak kapsam içine alınmıştır, bu yüzden `match` kollarında `Ok` ve `Err` varyantlarının önünde `Result::` belirtmemize gerek yoktur.

Sonuç `Ok` olduğunda, bu kod, `Ok` varyantından içteki `file` değerini döndürecektir, ve daha sonra bu dosya tanıtıcısı değerini `greeting_file` değişkenine atarız. `match`'den sonra, okumak veya yazmak için dosya tanıtıcısını kullanabiliriz.

`match`'in diğer kolu, `File::open`'dan `Err` değeri aldığımız durumu ele alır. Bu örnekte, `panic!` makrosunu çağırmayı seçtik. Eğer çalıştığımız dizinde *hello.txt* adlı bir dosya yoksa ve bu kodu çalıştırırsak, `panic!` makrosunun şu çıktısını göreceğiz:

```console
{{#include ../listings/ch09-error-handling/listing-09-04/output.txt}}
```

Her zamanki gibi, bu çıktı, neyin yanlış gittiğini tam olarak anlatmaktadır.

---

### Farklı Hatalarda Eşleşme

9-4. Listesindeki kod, `File::open` başarısız olduğu her durumda `panic!` yapacaktır. Ancak farklı hata nedenleri için farklı eylemler gerçekleştirmek istiyoruz. Eğer `File::open` dosya mevcut olmadığından başarısız olursa, dosyayı yaratmak ve yeni dosyanın tanıtıcısını döndürmek istiyoruz. Eğer `File::open` herhangi başka bir nedenle başarısız olursa—örneğin, dosyayı açmak için iznimiz yoksa—kodun aynı şekilde `panic!` yapmasını istiyoruz. Bunu yapmak için, 9-5. Listede gösterilen iç bir `match` ifadesi ekliyoruz.



```rust,ignore
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-05/src/main.rs}}
```



`File::open`'ın `Err` varyantı içindeki değerin türü `io::Error`'dır; bu, standart kütüphane tarafından sağlanan bir struct'tır. Bu struct, `io::ErrorKind` değerini almak için çağırabileceğimiz bir `kind` metoduna sahiptir. `io::ErrorKind` enum'u, standart kütüphane tarafından sağlanır ve `io` işlemlerinden kaynaklanabilecek farklı hata türlerini temsil eden varyantlara sahiptir. Kullanmak istediğimiz varyant, dosyanın açmaya çalıştığımız dosyanın henüz mevcut olmadığını gösteren `ErrorKind::NotFound`'dır. Bu nedenle, `greeting_file_result` üzerinde eşleşiyoruz, ancak aynı zamanda `error.kind()` üzerinde iç bir eşleşmemiz var.

İç eşlememizde kontrol etmek istediğimiz koşul, `error.kind()` tarafından döndürülen değerin `ErrorKind` enum'undaki `NotFound` varyantı olup olmadığıdır. Eğer öyleyse, `File::create` ile dosyayı yaratmaya çalışıyoruz. Ancak, `File::create` da başarısız olabileceğinden, iç `match` ifadesinde ikinci bir kol ihtiyacımız var. Dosya yaratılamazsa, farklı bir hata mesajı basılır. Dış `match`'in ikinci kolu aynı kalır, bu nedenle program, kaybolan dosya hatası dışında herhangi bir hatada `panic!` yapar.

:::warning
> #### `Result` ile `match` Kullanmanın Alternatifleri
>
> Bu kadar çok `match` kullanmak! `match` ifadesi çok yararlıdır ama ayrıca çok da ilkel bir yapıdır. 13. Bölümde, `Result` üzerinde tanımlanan birçok yöntemle kullanılan closures öğreneceksiniz. Bu yöntemler, `Result` değerlerini işlemede `match` kullanmaktan daha özlü olabilir.
>
> Örneğin, 9-5. Listede gösterilen aynı mantığı closures ve `unwrap_or_else` metodunu kullanarak yazmanın başka bir yolu:
>
> ```rust,ignore
> use std::fs::File;
> use std::io::ErrorKind;
>
> fn main() {
>     let greeting_file = File::open("hello.txt").unwrap_or_else(|error| {
>         if error.kind() == ErrorKind::NotFound {
>             File::create("hello.txt").unwrap_or_else(|error| {
>                 panic!("Dosya oluşturma problemi: {error:?}");
>             })
>         } else {
>             panic!("Dosya açma problemi: {error:?}");
>         }
>     });
> }
> ```
>
> Bu kod, 9-5. Listedeki davranış ile aynı davranışı sergiler, ancak hiç `match` ifadesi içermez ve okunması daha temizdir. Bu örneğe 13. Bölümü okuduktan sonra geri dönün ve standart kütüphane belgelerinde `unwrap_or_else` metodunu arayın. Bu yöntemlerin çoğu, hatalarla uğraşırken büyük iç içe geçmiş `match` ifadelerini temizleyebilir.
:::

---

#### Hata Durumunda Panic için Kısayollar: `unwrap` ve `expect`

`match` kullanmak oldukça işe yarar, ancak biraz ayrıntılı olabilir ve her zaman niyeti iyi ifade etmez. `Result` türü üzerinde, çeşitli daha spesifik görevleri yerine getirmek için pek çok yardımcı yöntem tanımlanmıştır. `unwrap` yöntemi, 9-4. Listede yazdığımız `match` ifadesiyle aynı şekilde uygulanmış bir kısayoldur. Eğer `Result` değeri `Ok` varyantıysa, `unwrap` içindeki `Ok`'da bulunan değeri döndürür. Eğer `Result` `Err` varyantıysa, `unwrap` bizim için `panic!` makrosunu çağırır. İşte `unwrap` kullanımının bir örneği:



```rust,should_panic
{{#rustdoc_include ../listings/ch09-error-handling/no-listing-04-unwrap/src/main.rs}}
```



Bu kodu *hello.txt* dosyası olmadan çalıştırırsak, `unwrap` metodunun `panic!` çağrısından bir hata mesajı alırız:

```text
thread 'main' panicked at src/main.rs:4:49:
called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "Dosya veya dizin yok" }
```

Benzer şekilde, `expect` yöntemi, `panic!` hata mesajını seçme olanağı da sunar. `unwrap` yerine `expect` kullanmak ve iyi hata mesajları sağlamak, niyetinizi iletebilir ve bir panic'in kaynağını bulmayı kolaylaştırabilir. `expect`'in sözdizimi şu şekildedir:



```rust,should_panic
{{#rustdoc_include ../listings/ch09-error-handling/no-listing-05-expect/src/main.rs}}
```



`expect`'i `unwrap` ile aynı şekilde kullanıyoruz: dosya tanıtıcısını döndürmek veya `panic!` makrosunu çağırmak için. `expect`'in `panic!`'a yaptığı çağrıda kullandığı hata mesajı, `expect`'e geçirdiğimiz parametre olacaktır; bu, `unwrap`'in kullandığı varsayılan `panic!` mesajından farklıdır. Görünümü şöyle:

```text
thread 'main' panicked at src/main.rs:5:10:
hello.txt bu projede yer almalıdır: Os { code: 2, kind: NotFound, message: "Dosya veya dizin yok" }
```

Üretim kalitesindeki kodlarda, çoğu Rustacyan `unwrap` yerine `expect` kullanmayı tercih eder ve işlemin her zaman başarılı olmasının beklenmesi hakkında daha fazla bağlam sağlar. Bu şekilde, varsayımlarınız yanlış olduğunda, hata ayıklama aşamasında daha fazla bilgiye sahip olursunuz.

---

### Hataları Yayma

Bir fonksiyonun içindeki bir işlem başarısız olabilecek bir şeyi çağırıyorsa, hatayı işleme konusunda değil, hatayı çağıran koda geri döndürebilirsiniz. Bu, hatayı *yayma* olarak bilinir ve çağıran koda daha fazla kontrol verir; burada hatanın nasıl işleneceğine dair daha fazla bilgi veya mantık mevcut olabilir; bu bağlamda erişiminiz olmadığında.

Örneğin, 9-6. Liste, bir dosyadan kullanıcı adını okuyan bir fonksiyonu göstermektedir. Eğer dosya mevcut değilse veya okunamazsa, bu fonksiyon bu hataları, fonksiyonu çağıran koda döndürecektir.



```rust
{{#include ../listings/ch09-error-handling/listing-09-06/src/main.rs:here}}
```



Bu fonksiyon çok daha kısa bir şekilde yazılabilir, ancak hata yönetimini keşfetmek için, çoğunu manuel olarak yapmakla başlayacağız; en sonunda daha kısa yolu göstereceğiz. Öncelikle fonksiyonun dönüş türüne bakalım: `Result`. Bu, fonksiyonun `Result` türünde bir değer döndürdüğü anlamına gelir; burada genel parametre `T`, somut tür `String` olarak doldurulmuştur ve genel tür `E`, somut tür `io::Error` olarak doldurulmuştur.

Eğer bu fonksiyon herhangi bir sorun olmadan başarılı olursa, bu fonksiyonu çağıran kod, dosyadan okunan `String` içeren bir `Ok` değeri alacaktır—bu, bu fonksiyon tarafından okunan kullanıcı adıdır. Eğer bu fonksiyon herhangi bir sorunla karşılaşırsa, çağıran kod bir `Err` değeri alacaktır; bu değer, `io::Error` örneği içerir ve bu, karşılaşılan sorunlar hakkında daha fazla bilgi taşır. Bu fonksiyonun dönüş türü olarak `io::Error`'ı seçtik çünkü çağırdığımız işlemlerin her ikisi de, bu fonksiyonun gövdesinde başarısız olabilecek olan: `File::open` fonksiyonu ve `read_to_string` metodu için döndürülen hata değerinin türüdür.

Fonksiyonun gövdesi, önce `File::open` fonksiyonu çağrısı ile başlar. Daha sonra, 9-4. Listesindeki `match`'e benzer bir `match` ile `Result` değerini ele alırız. Eğer `File::open` başarılı olursa, `file` desen değişkenindeki dosya tanıtıcısı, `username_file` adlı değişkene atanacaktır ve fonksiyon devam eder. `Err` durumunda, `panic!` çağırmak yerine, `return` anahtar kelimesini kullanarak fonksiyonu tamamen erken terk ediyoruz ve hata değerini, artık desen değişkeni `e` içinde olacak şekilde, çağıran koda bu fonksiyonun hata değeri olarak geri döndürüyoruz.

Yani, eğer `username_file`'da bir dosya tanıtıcısı varsa, fonksiyon yeni bir `String` oluşturur; `username` değişkeninde, `username_file`'daki dosya tanıtıcısı üzerinde `read_to_string` metodunu çağırarak dosyanın içeriğini `username`'e okur. `read_to_string` metodu da başarısız olabileceği için `Result` döndürür, oysa ki `File::open` başarılıdır. Bu `Result`'ı işlemek için başka bir `match`'e ihtiyaç duyarız: Eğer `read_to_string` başarılı olursa, o zaman fonksiyon başarıyla çalışmış olur ve dosyadan okuduğumuz kullanıcı adını, artık `username` içinde olan `Ok` olarak döndürürüz. Eğer `read_to_string` başarısız olursa, hata değerini aynı şekilde döndürürüz ki bu, `File::open` değerinin döndürülmesini işlemiş olduğumuz `match` ile aynı şekilde olur. Ancak, dönüş ifadesinin son ifadesi olduğu için, açıkça `return` dememize gerek yoktur.

Bu kodu çağıran kod daha sonra bir kullanıcı adını içeren `Ok` değeri veya bir `io::Error` içeren `Err` değeri alacaktır. Bu değerlerle ne yapacağı, çağıran koda bağlıdır. Eğer çağıran kod, bir `Err` değeri alırsa, `panic!` yapabilir ve programı çökertir, varsayılan bir kullanıcı adı kullanabilir veya kullanıcı adını dosyadan başka bir yerden alabilir. Örneğin. Elimizde, çağıran kodun ne yapmaya çalıştığına dair yeterli bilgi yoktur, bu nedenle tüm başarı veya hata bilgisini yukarıya yayarak gerektiği şekilde işlenmesini sağlıyoruz.

---

:::danger
Hataları yayma biçimi, Rust'ta o kadar yaygındır ki, Rust, bu işlemi kolaylaştırmak için `?` operatörünü sağlar.
:::

#### Hataları Yaymanın Kısa Yolu: `?` Operatörü

9-7. Listede `read_username_from_file` fonksiyonunun aynı işlevselliğini sağlamasına rağmen, bu uygulama `?` operatörünü kullanmaktadır.



```rust
{{#include ../listings/ch09-error-handling/listing-09-07/src/main.rs:here}}
```



Bir `Result` değeri sonrasında yer alan `?`, 9-6. Listede `Result` değerlerini işlemek için tanımladığımız `match` ifadeleriyle neredeyse aynı şekilde çalışacak şekilde tanımlıdır. `Result` değerinin değeri `Ok` ise, `Ok` içindeki değer bu ifade ile döndürülecek ve program devam edecektir. Eğer değer `Err` ise, `Err` tüm fonksiyondan döndürülür ve hata değeri çağıran koda yayılmış olur.

9-6. Listede yer alan `match` ifadesi ile `?` operatörü arasında bir fark vardır: `?` operatörüne sahip hata değerleri `from` fonksiyonu aracılığıyla geçer, bu fonksiyon standart kütüphanede yer alan `From` trait inde tanımlı olan ve değerleri bir türden diğerine dönüştürmek için kullanılan bir fonksiyondur. `?` operatörü `from` fonksiyonunu çağırdığında, alınan hata türü, mevcut fonksiyonun dönüş türünde tanımlanan hata türüne dönüştürülür. Bu, bir fonksiyonun başarısız olabileceği tüm yolları temsil etmek üzere bir hata türü döndürmesini sağlamak için yararlıdır, oysa ki bazı kısımlar birçok farklı nedenle başarısız olabilir.

Örneğin, 9-7. Listede `read_username_from_file` fonksiyonunu, `OurError` adlı özelleştirilmiş hata türünü döndürecek şekilde değiştirebiliriz. Eğer `impl From for OurError` ile `OurError` örneği oluşturursak, o zaman `read_username_from_file` içindeki `?` operatörü, hata türlerini dönüştürmek için `from` çağrısını yapar ve fonksiyona ek bir kod eklememize gerek kalmaz.

9-7. Listede yer alan `File::open` çağrısının sonundaki `?`, `username_file` değişkenine `Ok` içerisinde değeri döndürecektir. Eğer bir hata oluşursa, `?` operatörü, tüm fonksiyondan erken dönecektir ve çağıran koda herhangi bir `Err` değeri verecektir. `read_to_string` çağrısının sonundaki `?` için de aynı şey geçerlidir.

`?` operatörü, birçok kod tekrarı yapmaktan kurtarır ve bu fonksiyonun uygulamasını basitleştirir. Bu kodu daha da kısaltmak için `?` operatöründen hemen sonra metot çağrılarını zincirleme yapabiliriz; bu 9-8. Listede gösterilmektedir.



```rust
{{#include ../listings/ch09-error-handling/listing-09-08/src/main.rs:here}}
```



`username` içindeki yeni `String` oluşturma adımını fonksiyonun başına taşıdık; o kısım değişmedi. `username_file` adında bir değişken oluşturmaktansa, `File::open("hello.txt")?` çağrısının sonucunun üzerine doğrudan `read_to_string` çağrısını zincirledik. `read_to_string` çağrısının sonunda hala bir `?` var ve `File::open` ve `read_to_string` her ikisi de başarılı olduğunda yine `Ok` içinde `username` döndürüyoruz; hata döndürmüyoruz. İşlevsellik yine 9-6. ve 9-7. Listelerdeki gibi aynıdır; bu sadece bunu yazmanın farklı, daha ergonomik bir yoludur.

9-9. Listede, dosyayı açmak ve ardından okumak için yerine `fs::read_to_string` kullanarak bunun daha kısa bir yolunu gösteriyor.



```rust
{{#include ../listings/ch09-error-handling/listing-09-09/src/main.rs:here}}
```



Bir dosyayı bir string'e okuma, oldukça yaygın bir işlemdir, bu nedenle standart kütüphane, dosyayı açan, yeni bir `String` oluşturan, dosyanın içeriğini dosyayı okuyan, o içeriği `String` içine koyan ve onu döndüren `fs::read_to_string` isimli uygun bir işlev sağlar. Elbette, `fs::read_to_string` kullanmak, tüm hata yönetimini açıklama fırsatı vermez, bu yüzden önce daha uzun yolu tercih ettik.

#### `?` Operatörünün Kullanılabileceği Yerler

`?` operatörü yalnızca dönüş türü, `?` kullanıldığı değer ile uyumlu olan fonksiyonlarda kullanılabilir. Bunun nedeni, `?` operatörünün, Listing 9-6'da tanımladığımız `match` ifadesinde olduğu gibi, bir değeri fonksiyondan erken döndürmek için tanımlanmış olmasıdır. **Listing 9-6**'da `match`, bir `Result` değeri kullanıyordu ve erken dönüş kolu, bir `Err(e)` değeri döndürdü. Fonksiyonun dönüş türü, bu `return` ile uyumlu olması için bir `Result` olmalıdır.

:::info
**Dikkat:** `?` operatörünü yalnızca `Result`, `Option` veya `FromResidual` uygulayan başka bir tür döndüren fonksiyonlarda kullanabilirsiniz.
:::

Listing 9-10'da, bir `main` fonksiyonunda `?` operatörünü kullandığımızda uyumsuz bir dönüş türüne sahip olduğumuzda alacağımız hataya bakalım.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-10/src/main.rs}}
```



Bu kod bir dosyayı açar, ancak başarısız olabilir. `?` operatörü, `File::open` tarafından döndürülen `Result` değerini takip eder, ancak bu `main` fonksiyonunun dönüş türü `()`, yani `Result` değildir. Bu kodu derlediğimizde, şu hata mesajını alırız:

```console
{{#include ../listings/ch09-error-handling/listing-09-10/output.txt}}
```

Bu hata, `?` operatörünün yalnızca `Result`, `Option` veya `FromResidual` uygulayan başka bir tür döndüren fonksiyonlarda kullanabileceğimizi belirtiyor.

Hata düzeltmek için iki seçeneğiniz var. Bir seçenek, fonksiyonunuzun dönüş türünü, kullandığınız `?` operatörüne uyumlu hale getirmektir; bu, eğer herhangi bir kısıtlama yoksa mümkündür. Diğer seçenek ise `Result`'yi uygun bir şekilde işlemek için bir `match` veya `Result` metodunu kullanmaktır.

:::tip
`?` operatörünü, `Option` değerleri ile de kullanabilirsiniz. 
:::

Hata mesajı ayrıca `?` operatörünün `Option` değerleri ile de kullanılabileceğini belirtti. `Result` üzerinde `?` kullanmanın yanı sıra, `?` yalnızca `Option` döndüren bir fonksiyonda kullanılabilir. `?` operatörünün bir `Option` üzerinde çağrıldığında davranışı, bir `Result` üzerinde çağrıldığında beklenen davranışla benzerdir: değer `None` ise, `None` erken bir şekilde fonksiyondan döndürülür. Değer `Some` ise, `Some` içerisindeki değer ifadenin sonuç değeri olur ve fonksiyon devam eder. 

Listing 9-11, verilen metindeki ilk satırın son karakterini bulan bir fonksiyon örneği sunmaktadır.

` değeri üzerinde `?` operatörünü kullanma">

```rust
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-11/src/main.rs:here}}
```



Bu fonksiyon `Option` döndürür çünkü orada bir karakter bulunması mümkündür, ancak bulunmaması da mümkündür. Bu kod, `text` string dilimi argümanını alır ve üzerindeki satırları döndüren `lines` metodunu çağırır. Bu fonksiyon ilk satırı incelemek istediğinden, iterator üzerinden ilk değeri almak için `next` çağrısını yapar. Eğer `text` boş bir string ise, bu `next` çağrısı `None` döndürür; bu durumda `?` kullanarak `last_char_of_first_line` fonksiyonunu durdurup `None` döndürürüz. Eğer `text` boş bir string değilse, `next` `text` üzerindeki ilk satırın string dilimini içeren bir `Some` değeri döndürür.

:::note
`?`, string dilimini ayıklayarak bu string dilimi üzerinde `chars` çağrısını yapmamıza olanak tanır. 
:::

İlk satırdaki son karaktere ilgi duyduğumuzdan, iterator üzerindeki son öğeyi döndürmek için `last` çağrısını yaparız. Bu bir `Option`'dır çünkü ilk satır boş bir string olabilir; örneğin, `text` bir boş satırla başlıyor ama diğer satırlarda karakterler varsa, örneğin `"\nhi"` gibi. Ancak, eğer ilk satırda bir son karakter varsa, bu `Some` varyantında döndürülecektir. Ortadaki `?` operatörü, bu mantığı ifade etmenin basit bir yolunu sağlıyor ve fonksiyonu tek satırda gerçekleştiriyor. Eğer `Option` üzerinde `?` operatörünü kullanamazsak, bu mantığı daha fazla yöntem çağrısı veya bir `match` ifadesi kullanarak gerçekleştirmeniz gerekecektir.

Dikkat edin ki, bir fonksiyon `Result` döndürdüğünde `Result` üzerinde `?` operatörünü, `Option` döndürdüğünde ise `Option` üzerinde `?` operatörünü kullanabilirsiniz, ancak karıştırıp eşleştiremezsiniz. `?` operatörü, `Result`'ı `Option`'a veya tersini otomatik olarak dönüştürmez; bu gibi durumlarda belirli dönüşümler yapmak için `Result` üzerinde `ok` metodunu veya `Option` üzerinde `ok_or` metodunu kullanabilirsiniz.

---

Şu ana kadar kullandığımız tüm `main` fonksiyonları `()` dönüyordu. `main` fonksiyonu özel bir fonksiyondur çünkü çalıştırılabilir bir programın giriş ve çıkış noktasıdır ve programın beklenildiği gibi çalışabilmesi için dönüş türü üzerinde kısıtlamalar vardır.

Neyse ki, `main` fonksiyonu da `Result` döndürebilir. Listing 9-12, Listing 9-10'daki kodu içerir, ancak `main`'in dönüş türünü `Result>` olacak şekilde değiştirdik ve sonuna bir dönüş değeri olarak `Ok(())` ekledik. Bu kod artık derlenebilecektir.

` olarak değiştirmek, `Result` değerleri üzerinde `?` operatörünün kullanımına izin verir." />

```rust,ignore
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-12/src/main.rs}}
```



`Box` türü bir *trait objesi*dir; bunun üzerine 18. Bölümdeki [“Farklı Türlerdeki Değerler İçin Trait Nesneleri Kullanma”][trait-objects] bölümünde konuşacağız. Şimdilik, `Box`'ı "herhangi bir hata türü" olarak okuyabilirsiniz. `main` fonksiyonunda hata türü `Box` olan bir `Result` değeri üzerinde `?` kullanmak, her türlü `Err` değerinin erken döndürülmesine izin verdiği için mümkündür. Bu `main` fonksiyonunun gövdesi yalnızca `std::io::Error` türünde hatalar döndürse bile, `Box` belirterek, bu imza, `main`'in gövdesine daha fazla hata döndüren kod eklenirse de doğru kalmaya devam edecektir.

Bir `main` fonksiyonu `Result` döndürdüğünde, çalıştırılabilir program `main` `Ok(())` dönerse `0` değeri ile çıkacak ve `main` bir `Err` değeri dönerse sıfırdan farklı bir değer ile çıkacaktır. C dilinde yazılmış programlar çıktıklarında tamsayı döndürür: başarılı bir şekilde çıkan programlar `0` tamsayısını döndürürken, hatalar dönen programlar sıfırdan farklı bir tamsayı döner. Rust da bu geleneğe uyum sağlamak için çalıştırılan dosyalardan tamsayılar döndürür.

`main` fonksiyonu, `ExitCode` döndüren bir `report` fonksiyonunu içeren [yakalama][termination] trait'ini uygulayan herhangi bir tür döndürebilir. Kendi türleriniz için `Termination` trait'ini uygulamak hakkında daha fazla bilgi için standart kütüphane belgelerine bakabilirsiniz.

:::warning
`panic!` çağırma veya `Result` döndürme konularını tartıştıktan sonra, hangi durumlarda hangisinin uygun olduğunu belirleme konusuna geri dönelim.
:::

[handle_failure]: ch02-00-guessing-game-tutorial.html#handling-potential-failure-with-result  
[trait-objects]: ch18-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types  
[termination]: ../std/process/trait.Termination.html  