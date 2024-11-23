## Yapıları Tanımlama ve Oluşturma

Yapılar, [“Tuple Tipi”][tuples] bölümünde tartışıldığı gibi, birden fazla ilişkili değeri saklayan demetlere benzer. Demetlerde olduğu gibi, bir yapının parçaları farklı türlerde olabilir. **Demetlerden farklı olarak**, bir yapıda her bir veri parçasına bir isim vererek değerlerin ne anlama geldiği belli olur. Bu isimlerin eklenmesi, yapıların demetlere göre daha esnek olmasını sağlar: bir örneğin değerlerini belirtmek veya erişmek için verilerin sıralamasına güvenmek zorunda kalmazsınız.

:::tip
**Dikkat:** Bir yapıyı tanımlarken, yapının adı bir araya getirilen veri parçalarının önemini açıklamalıdır.
:::

Bir yapıyı tanımlamak için `struct` anahtar kelimesini yazar ve tüm yapıya bir isim veririz. Sonrasında, süslü parantezlerin içerisine veri parçalarının isimlerini ve türlerini tanımlarız, bunlara *alanlar* denir. Örneğin, Liste 5-1, bir kullanıcı hesabıyla ilgili bilgileri saklayan bir yapıyı göstermektedir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-01/src/main.rs:here}}
```



Tanımladığımız bir yapıyı kullanmak için, her bir alan için somut değerler belirterek o yapının bir *örneğini* oluştururuz. Bir örneği oluşturmak için yapının ismini söyleriz ve ardından süslü parantezler içinde *anahtar: değer* çiftleri ekleriz; burada anahtarlar alanların isimleri, değerler ise bu alanlarda saklamak istediğimiz verilerdir.

:::info
**Not:** Alanları yapıda tanımladığımız sırayla belirtmek zorunda değiliz. Diğer bir deyişle, yapı tanımı tür için genel bir şablondur ve örnekler o şablonu belirli verilerle doldurarak türün değerlerini oluşturur.
:::

Örneğin, Liste 5-2'de belirli bir kullanıcı tanımlanmıştır.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-02/src/main.rs:here}}
```



Bir yapıdan belirli bir değeri almak için, nokta notasyonunu kullanırız. Örneğin, bu kullanıcının e-posta adresine erişmek için `user1.email` ifadesini kullanırız. Eğer örnek değiştirilebilir ise, belirli bir alana atama yaparak bir değeri değiştirebiliriz. Liste 5-3, değiştirilebilir bir `User` örneğinin `email` alanındaki değeri nasıl değiştireceğimizi göstermektedir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-03/src/main.rs:here}}
```



Tüm örneğin değiştirilebilir olması gerektiğini unutmayın; Rust sadece belirli alanları değiştirilebilir olarak işaretlemeye izin vermez. Herhangi bir ifade gibi, işlev gövdesindeki son ifade olarak yeni bir örnek oluşturabilir ve otomatik olarak o yeni örneği döndürebiliriz.

:::warning
**Önemli:** Eğer `User` yapısında bir alan değiştirilebilir olarak işaretlenmezse, örneği değiştirilemez.
:::

Liste 5-4'te, verilen e-posta ve kullanıcı adı ile `User` örneği döndüren bir `build_user` işlevi gösterilmektedir. `active` alanı `true` değerini alırken, `sign_in_count` alanı `1` değerini alır.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-04/src/main.rs:here}}
```



İşlev parametrelerini yapı alanlarıyla aynı isimle adlandırmak mantıklıdır, ancak `email` ve `username` alan isimlerini ve değişkenleri tekrar etmek biraz can sıkıcıdır. Eğer yapı daha fazla alana sahip olsaydı, her ismin tekrarlanması daha da can sıkıcı olurdu. Neyse ki, kullanışlı bir kısayol var!

### Alan Başlatma Kısayolu Kullanma

Liste 5-4'te parametre isimleri ve yapı alan isimleri tam olarak aynı olduğundan, `build_user`'ı aynı şekilde davranacak şekilde yeniden yazmak için *alan başlatma kısayolu* sentaksını kullanabiliriz; bu, `username` ve `email` tekrarını ortadan kaldırır. Liste 5-5'te gösterildiği gibi.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-05/src/main.rs:here}}
```



Burada, `email` adında bir alana sahip yeni bir `User` örneği oluşturuyoruz. `email` alanının değerini `build_user` işlevinin `email` parametresinin değeri olarak ayarlamak istiyoruz. **Çünkü** `email` alanı ve `email` parametresi aynı ada sahip, sadece `email` yazmamız yeterlidir; `email: email` yazmamıza gerek yoktur.

### Diğer Örneklerden Yapı Güncelleme Sözdizimi ile Örnekler Oluşturma

Çoğu zaman, bir başka örnekteki değerlerin çoğunu içeren ancak bazılarını değiştiren yeni bir yapı örneği oluşturmak faydalı olabilir. Bunu *yapı güncelleme sözdizimi* kullanarak yapabilirsiniz.

Öncelikle, Liste 5-6'daki gibi, `user2`'de yeni bir `User` örneği normal bir şekilde oluşturacağımızı gösteriyoruz. `email` için yeni bir değer belirliyoruz ancak Liste 5-2'de oluşturduğumuz `user1`'den diğer değerleri kullanıyoruz.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-06/src/main.rs:here}}
```



Yapı güncelleme sözdizimini kullanarak, aynı etkiyi daha az kodla elde edebiliriz. Liste 5-7'de gösterildiği gibi. `..` sözdizimi, açıkça ayarlanmamış kalan alanların, verilen örnekteki alanlarla aynı değere sahip olmasını belirtir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-07/src/main.rs:here}}
```



Liste 5-7'deki kod ayrıca `user2`'de `email` için farklı bir değer oluşturur ancak `user1`'den `username`, `active` ve `sign_in_count` alanları için aynı değerleri kullanır. `..user1` en son gelmelidir; bu şekilde kalan alanların değerlerinin `user1`'deki karşılık gelen alanlardan alınacağını belirtiriz. Ancak, yapı tanımındaki alanların sırasından bağımsız olarak, istediğimiz kadar alan için değerleri herhangi bir sırayla belirtme seçeneğine sahibiz.

Yapı güncelleme sözdizimi `=` kullanarak bir atama gibi çalışır; bu, veriyi taşır. Bu, [“Değişkenler ve Veriler: Taşımayı Etkileşim”][move] bölümünde gördüğümüz gibi gerçekleşir. Bu örnekte, `user2` oluşturulduktan sonra `user1`'i bir bütün olarak kullanamayız, çünkü `user1`'deki `username` alanındaki `String` `user2`'ye taşındı. Eğer `user2`'ye hem `email` hem de `username` için yeni `String` değerleri verirsek ve bu durumda sadece `user1`'den `active` ve `sign_in_count` değerlerini kullanmış olursak, o zaman `user1` hala geçerli olacaktır. **Her iki alan da, `Copy` trait’ini uygulayan türlerdir**; dolayısıyla, [“Yalnızca Yığın Verisi: Kopyala”][copy] bölümünde tartıştığımız davranış geçerlidir. Bu örnekte, değeri *taşınmadığı için* `user1.email` değerini hala kullanabiliriz.

### Alanı Olmayan Tuple Yapıları Kullanma

Rust, tuplara benzer yapıları, *tuple yapıları* olarak destekler. Tuple yapılar, yapı isminin sağladığı ek anlamı taşır ancak alanlarıyla ilişkili isimleri yoktur; bunun yerine, yalnızca alanların türlerine sahiptirler. Tuple yapılar, bir tüm tuple'e bir isim vermek ve onu diğer tuple'lardan farklı bir tür haline getirmek istediğinizde, her alanı isimlendirmek ise bir normal yapı gibi fazla ayrıntılı veya gereksiz olduğunda kullanışlıdır.

Bir tuple yapısını tanımlamak için `struct` anahtar kelimesi ve yapı adı ile tuple içindeki türleri yazmaya başlarız. Örneğin, burada `Color` ve `Point` adı verilen iki tuple yapıyı tanımlayıp kullanıyoruz:



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/no-listing-01-tuple-structs/src/main.rs}}
```



`black` ve `origin` değerlerinin farklı türler olduğunu unutmayın çünkü bunlar farklı tuple yapılarının örnekleridir. Tanımladığınız her yapı kendi türüdür, yapının içinde alanlar aynı türde olsa bile. Örneğin, bir `Color` türünde bir parametre alan bir işlev, üç `i32` değerinden oluşmasına rağmen bir `Point` almaz. Aksi takdirde, tuple yapı örnekleri, bireysel parçalara ayrılabileceğiniz ve bir bireysel değere erişmek için indeks ile birlikte `.` kullanabileceğiniz tuple'lar ile benzerdir. Tuple'lardan farklı olarak, tuple yapıları ayrıştırıldığında yapının türünü belirtmenizi gerektirir. Örneğin, `let Point(x, y, z) = point` şeklinde yazıyoruz.

### Alanı Olmayan Birim Benzeri Yapılar

Aynı zamanda hiç alanı olmayan yapıları da tanımlayabilirsiniz! Bunlara *birim benzeri yapılar* denir çünkü [“Tuple Tipi”][tuples] bölümünde bahsettiğimiz `()` birim türüyle benzer şekilde davranır. Birim benzeri yapılar, bir tür üzerinde bir trait uygulamak gerektiğinde ancak o türün kendisinde saklamak istediğiniz veri bulunmadığında kullanılabilir. Trait'leri, Bölüm 10'da tartışacağız. İşte `AlwaysEqual` adında bir birim yapıyı tanımlayıp oluşturmaya bir örnek:



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/no-listing-04-unit-like-structs/src/main.rs}}
```



`AlwaysEqual` tanımlamak için, `struct` anahtar kelimesini, istediğimiz ismi ve ardından bir noktalı virgül kullanırız. **Süslü parantez** veya parantez kullanmamıza gerek yok! Daha sonra `subject` değişkeninde `AlwaysEqual` örneğini elde etmenin benzer bir yolunu kullanabiliriz: tanımladığımız ismi kullanarak, süslü parantez veya parantez olmadan. Daha sonra bu tür için her örneğin, başka bir türle her örneği eşit olması için bir davranış uygulayacağımızı hayal edin, belki test amaçları için bilinen bir sonuç elde etmek için. O davranışı uygulamak için herhangi bir veriye ihtiyacımız olmayacak! Trait tanımlamanın ve bunları herhangi bir türde, birim benzeri yapılara dahil olarak nasıl uygulayacağınızı Bölüm 10'da göreceksiniz.

> ### Yapı Verilerinin Sahipliği
>
> Liste 5-1'deki `User` yapı tanımında, `&str` dize dilimi türü yerine sahip olunan `String` türünü kullandık. Bu, her bir örneğin bu yapının verilerinin tümüne sahip olmasını ve bu verilerin tüm yapı geçerli oldukça geçerli olmasını istediğimizden dolayı bilinçli bir tercihtir.
>
> Aynı zamanda, yapılar başka bir şeye ait verilere referanslar saklayabilir; ancak bunu yapmak için *ömrü* kullanmak gereklidir; bu, Bölüm 10'da tartışacağımız bir Rust özelliğidir. Ömrler, bir yapının referans verdiği verinin ne kadar süreyle geçerli olduğunu garanti eder. Diyelim ki bir yapıda ömrü belirtmeden referans saklamayı denerseniz; aşağıdaki gibi; bu çalışmaz:
>
> 
>
> 
>
> ```rust,ignore,does_not_compile
> struct User {
>     active: bool,
>     username: &str,
>     email: &str,
>     sign_in_count: u64,
> }
>
> fn main() {
>     let user1 = User {
>         active: true,
>         username: "someusername123",
>         email: "someone@example.com",
>         sign_in_count: 1,
>     };
> }
> ```
>
> 
>
> Derleyici, ömür belirleyicilerine ihtiyaç duyduğuna dair uyarı verir:
>
> ```console
> $ cargo run
>    Compiling structs v0.1.0 (file:///projects/structs)
> error[E0106]: missing lifetime specifier
>  --> src/main.rs:3:15
>   |
> 3 |     username: &str,
>   |               ^ expected named lifetime parameter
>   |
> help: consider introducing a named lifetime parameter
>   |
> 1 ~ struct User<'a> {
> 2 |     active: bool,
> 3 ~     username: &'a str,
>   |
>
> error[E0106]: missing lifetime specifier
>  --> src/main.rs:4:12
>   |
> 4 |     email: &str,
>   |            ^ expected named lifetime parameter
>   |
> help: consider introducing a named lifetime parameter
>   |
> 1 ~ struct User<'a> {
> 2 |     active: bool,
> 3 |     username: &str,
> 4 ~     email: &'a str,
>   |
> 
> For more information about this error, try `rustc --explain E0106`.
> error: could not compile `structs` (bin "structs") due to 2 previous errors
> ```
>
> Bölüm 10'da, bu hataları nasıl düzeltebileceğimizi tartışacağız, böylece yapılar içinde referanslar saklayabilirsiniz. Ancak şimdilik, yukarıdaki hataları sahip olunan `String` gibi türler kullanarak düzelteceğiz, referanslar yerine `&str` gibi. 

[tuples]: ch03-02-data-types.html#the-tuple-type
[move]: ch04-01-what-is-ownership.html#variables-and-data-interacting-with-move
[copy]: ch04-01-what-is-ownership.html#stack-only-data-copy