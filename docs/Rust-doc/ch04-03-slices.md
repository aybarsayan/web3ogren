## Dilim Tipi

*Dilimler*, tüm koleksiyonu değil, bir koleksiyon içindeki bitişik bir dizi elementi referans almanızı sağlar. Bir dilim, bir tür referanstır, bu nedenle sahiplik durumu yoktur.

:::tip
Kullanıcı dostu öneriler ve en iyi uygulamalar için dilimlerin kullanımını göz önünde bulundurmalısınız.
:::

İşte küçük bir programlama problemi: boşluklarla ayrılmış kelimeler içeren bir dize alan ve o dizenin içinde bulduğu ilk kelimeyi döndüren bir fonksiyon yazın. Eğer fonksiyon dizenin içinde bir boşluk bulamazsa, tüm dize tek bir kelime olmalıdır; dolayısıyla, tüm dize döndürülmelidir.

Bu problemi dilimlerin çözeceğini anlamak için bu fonksiyonun imzasını dilim kullanmadan nasıl yazacağımızı inceleyelim:

```rust,ignore
fn first_word(s: &String) -> ?
```

`first_word` fonksiyonu bir `&String` parametresine sahiptir. Sahiplik istemediğimiz için bu tamamdır. Peki, ne döndürmeliyiz? Bizim gerçekten bir dizenin *bir kısmını* anlatacak bir yolumuz yok. Ancak, boşlukla belirtilen kelimenin sonunun indeksini döndürebiliriz. Bunu deneyelim, Şekil 4-7'de gösterildiği gibi.



```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-07/src/main.rs:here}}
```



Her bir `String` elementini teker teker kontrol etmek zorunda olduğumuz için, `String`'i `as_bytes` metodu kullanarak bir bayt dizisine dönüştüreceğiz.

```rust,ignore
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-07/src/main.rs:as_bytes}}
```

Sonrasında, bayt dizisi üzerinde `iter` metodu kullanarak bir iteratör oluşturuyoruz:

```rust,ignore
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-07/src/main.rs:iter}}
```

:::info
İteratörler hakkında daha fazla ayrıntıya [Bölüm 13][ch13]'te değineceğiz.
:::

Şu an için, `iter`'in bir koleksiyondaki her elementi döndüren bir metod olduğunu ve `enumerate`'in `iter` sonuçlarını sararak her elementi bir tuple parçası olarak döndürdüğünü bilin. `Enumerate`'den dönen tuple'ın ilk elemanı indeks, ikinci elemanı ise elemana bir referanstır. Bu, indeks hesaplamaktan daha uygundur.

`Enumerate` metodu bir tuple döndürdüğü için, bu tuple'ı yapılandırmak için desenleri kullanabiliriz. `For` döngüsünde, tuple'daki indeks için `i` ve tuple'daki tek bayt için `&item` olan bir deseni belirtiyoruz. `.iter().enumerate()` ile elemanın referansını aldığımız için, desende `&` kullanıyoruz.

`For` döngüsünün içinde, boşluğu temsil eden baytı bulmak için bayt literaal sözdizimini kullanıyoruz. Eğer bir boşluk bulursak, konumu döndürüyoruz. Aksi takdirde, `s.len()` kullanarak dizenin uzunluğunu döndürüyoruz.

```rust,ignore
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-07/src/main.rs:inside_for}}
```

Artık dizedeki ilk kelimenin sonunun indeksini bulmanın bir yoluna sahibiz, ancak bir sorun var. Kendi başına bir `usize` döndürüyoruz, ancak bu, yalnızca `&String` bağlamında anlamlı bir sayıdır. Diğer bir deyişle, bu, `String`'den ayrı bir değer olduğu için, gelecekte geçerli olacağının herhangi bir garantisi yoktur. Şekil 4-8'deki programı düşünün; bu program Listing 4-7'den `first_word` fonksiyonunu kullanıyor.



```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-08/src/main.rs:here}}
```



Bu program hatasız derleniyor ve `s.clear()` çağrısından sonra `word`'ü kullansak da derlenmeye devam ediyor. Çünkü `word`, `s`'nin durumu ile hiçbir bağlantısı yok; `word` hala `5` değerini içeriyor. Bu `5` değerini `s` değişkeni ile kullanarak ilk kelimeyi çıkarmaya çalışabiliriz, ancak bu bir hata olur çünkü `word` içinde `5` değerini kaydettiğimizden beri `s`'nin içeriği değişti.

:::warning
`word`'deki indeksin `s`'deki verilerle senkronize olmamasından endişelenmek sıkıcı ve hata yapma olasılığı yüksektir! Eğer bir `second_word` fonksiyonu yazarsak, bu indeksleri yönetmek daha da zor olacaktır.
:::

İmzası şöyle görünmek zorunda kalacaktır:

```rust,ignore
fn second_word(s: &String) -> (usize, usize) {
```

Artık hem bir başlangıç *ve* bir bitiş indeksini takip ediyoruz ve belirli bir durumda hesaplanmış olan daha fazla değere sahibiz; ancak bu değerler o durumla hiç bağlantılı değil. Senkronize kalması gereken üç bağımsız değişkenimiz var.

Neyse ki, Rust bu problemi çözmek için bir çözüme sahiptir: string dilimleri.

### String Dilimleri

Bir *string dilimi*, bir `String`'in bir parçasına referans olup, şöyle görünür:

```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-17-slice/src/main.rs:here}}
```

`String`'in tamamına referans vermek yerine, `hello`, `String`'in bir bölümüne referanstır; bu bölüm, ekstra `[0..5]` kısmıyla belirtilmiştir. Dilimleri oluştururken, köşeli parantez içinde bir aralık belirterek `[starting_index..ending_index]` şeklinde kullanırız; burada `starting_index` dilimin başlangıç pozisyonu ve `ending_index` dilimin son pozisyonundan bir fazla olan değerdir. İçsel olarak, dilim veri yapısı, dilimin başlangıç pozisyonunu ve dilimin uzunluğunu saklar, bu da `ending_index` ile `starting_index` arasındaki farktır. Dolayısıyla, `let world = &s[6..11];` durumunda, `world`, `s`'nin 6 numaralı baytına işaret eden bir dilimdir ve uzunluk değeri `5` olacaktır.

Şekil 4-7 bunu bir diyagramda göstermektedir.

![](images/rust/img/trpl04-07.svg)

Şekil 4-7: Bir `String`'in bir parçasına referans veren string dilimi

Rust’ın `..` aralık sözdizimi ile, eğer 0 numaralı indeksten başlamak istiyorsanız, iki nokta öncesindeki değeri atlayabilirsiniz. Yani, bunlar eşittir:

```rust
let s = String::from("hello");

let slice = &s[0..2];
let slice = &s[..2];
```

Aynı şekilde, diliminiz `String`'in son baytını içeriyorsa, son sayıyı atlayabilirsiniz. Yani bunlar eşittir:

```rust
let s = String::from("hello");

let len = s.len();

let slice = &s[3..len];
let slice = &s[3..];
```

Ayrıca, tüm dizenin dilimini almak için hem değerleri de atlayabilirsiniz. Yani bunlar eşittir:

```rust
let s = String::from("hello");

let len = s.len();

let slice = &s[0..len];
let slice = &s[..];
```

> Not: String dilimi aralık indeksleri, geçerli UTF-8 karakter sınırlarında olmalıdır. Eğer bir çok baytlı karakterin ortasında bir string dilimi oluşturmaya çalışırsanız, programınız bir hata ile çıkacaktır. String dilimlerini tanıtma amacıyla, bu bölümde yalnızca ASCII varsayıyoruz; UTF-8 yönetimi hakkında daha ayrıntılı bir tartışma, [“String ile UTF-8 Kodlanmış Metinleri Saklama”][strings] bölümünde 8. Bölümde mevcuttur.

Tüm bu bilgilerin ışığında, `first_word` fonksiyonunu bir dilim döndürecek şekilde yeniden yazalım. "string dilimi" anlamına gelen tür `&str` olarak yazılır:



```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-18-first-word-slice/src/main.rs:here}}
```



Kelimenin sonunun indeksini aynı şekilde aldık; boşluğun ilk gerçekleşimini aradık. Bir boşluk bulduğumuzda, dizenin başlangıç noktasını ve boşluğun indeksini başlangıç ve bitiş indeksleri olarak kullanarak bir string dilimi döndürüyoruz.

:::note
Artık `first_word`'ü çağırdığımızda, temel verilere bağlı olan tek bir değer alıyoruz. Değer, dilimin başlangıç noktası ile dilimdeki element sayısından oluşan bir referanstır.
:::

Bir `second_word` fonksiyonu için dilim döndürmek de işe yarar:

```rust,ignore
fn second_word(s: &String) -> &str {
```

Artık, `String` içindeki referansların geçerliliğini denetleyecek bir API'miz var. 4-8 numaralı listedeki programda ilk kelimenin bitiş indeksi alındıktan sonra dizenin temizlenmesi nedeniyle indeksimizin geçersiz hale geldiği hatayı hatırlayın. O kod mantık olarak yanlıştı, ancak hemen bir hata göstermedi. Sorunlar, dizenin temizlenmiş haliyle ilk kelime indeksini kullanmaya çalıştığımızda ortaya çıkacaktı. Dilimler bu hatayı imkansız hale getirir ve kodumuzda bir problem olduğunu daha erken anlamamızı sağlar. `first_word`'ün dilim sürümünü kullanmak derleme zamanında bir hata verecektir:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-19-slice-error/src/main.rs:here}}
```



İşte derleyici hatası:

```console
{{#include ../listings/ch04-understanding-ownership/no-listing-19-slice-error/output.txt}}
```

Borç alma kurallarından hatırlayın ki bir şeye değişmez bir referansımız olduğunda, aynı zamanda değiştirilebilir bir referans alamayız. `Clear` metodunun `String`'i kısaltması gerektiği için, değiştirilebilir bir referansa ulaşması gerekmektedir. `Clear` çağrısından sonraki `println!`, `word`'deki referansı kullanıyor; bu nedenle değişmez referans o noktada hala aktif olmalıdır. Rust, `clear`'deki değiştirilebilir referansı ve `word`'deki değişmez referansı aynı anda var olmalarını engeller ve derleme işlemi başarısız olur. Rust sadece API'mizi kullanmayı kolaylaştırmakla kalmadı, aynı zamanda derleme zamanında hataların tamamını ortadan kaldırdı!

#### String Literalleri Olarak Dilimler

String literallerinin ikili içinde saklandığını daha önce tartıştığımızı hatırlayın. Artık dilimleri bildiğimize göre, string literallerini doğru bir şekilde anlamlandırabiliriz:

```rust
let s = "Hello, world!";
```

Burada `s`'nin tipi `&str`dir: ikilinin belirli bir noktasına işaret eden bir dilimdir. Bu, string literallerinin neden değişmez olduğunu açıklamaktadır; `&str` değişmez bir referanstır.

#### String Dilimleri Olarak Parametreler

String literallerinin ve `String` değerlerinin dilimlerini alabileceğinizi bildiğimizde, `first_word` fonksiyonunda bir iyileşme daha yapıyoruz; o da imzasıdır:

```rust,ignore
fn first_word(s: &String) -> &str {
```

Daha deneyimli bir Rust geliştiricisi, `s` parametresi için string dilimi türünü kullanarak Listing 4-9'daki gibi imzayı yazacaktır:



```rust,ignore
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-09/src/main.rs:here}}
```



Eğer bir string dilimimiz varsa, onu doğrudan geçirebiliriz. Eğer bir `String`'imiz varsa, ya `String`'in bir dilimini ya da `String`'e bir referans geçirebiliriz. Bu esneklik, [“Fonksiyonlar ve Metotlarla İkili İhtiyaç Duyma”][deref-coercions] bölümünde ele alacağımız bir özellik olan *değişken zorlamalarından faydalanır*.

Bir referans yerine bir string dilimi alacak şekilde bir fonksiyon tanımlamak, API'mizi daha genel ve kullanışlı hale getirir; işlevselliği kaybetmeden:



```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-09/src/main.rs:usage}}
```



### Diğer Dilimler

String dilimleri, tahmin edebileceğiniz gibi, stringlere özeldir. Ancak, daha genel bir dilim türü de vardır. Bu diziyi düşünün:

```rust
let a = [1, 2, 3, 4, 5];
```

String'in bir parçasına referans almak istediğimiz gibi, bir dizinin de bir parçasına referans almak isteyebiliriz. Bunu şöyle yaparız:

```rust
let a = [1, 2, 3, 4, 5];

let slice = &a[1..3];

assert_eq!(slice, &[2, 3]);
```

Bu dilimin tipi `&[i32]`dir. Bu, ilk elemana bir referans ve bir uzunluk saklayarak string dilimleri gibi çalışır. Bu tür bir dilimi, çeşitli koleksiyonlar için kullanacaksınız. Bu koleksiyonları, 8. Bölümde vektörler hakkında konuştuğumuzda detaylı bir şekilde tartışacağız.

## Özet

Sahiplik, borç alma ve dilimleme kavramları, Rust programlarında derleme zamanında bellek güvenliğini sağlar. Rust dili, belleği kullanma açısından size diğer sistem programlama dilleriyle aynıdır; ancak verilere sahip olanın, sahibi kapsam dışına çıktığında, verileri otomatik olarak temizlemesi, bu kontrolü elde etmek için ekstra kod yazmak ve hata ayıklamaktan kaçınmanızı sağlar.

:::note
Sahiplik, Rust'ın diğer birçok bölümünü etkiler, bu nedenle bu kavramları kitabın geri kalanında daha fazla tartışacağız.
:::

Hadi, Bölüm 5'e geçelim ve veri parçasını `struct` içinde bir araya getirmeye bakalım.

[ch13]: ch13-02-iterators.html
[ch6]: ch06-02-match.html#patterns-that-bind-to-values
[strings]: ch08-02-strings.html#storing-utf-8-encoded-text-with-strings
[deref-coercions]: ch15-02-deref.html#implicit-deref-coercions-with-functions-and-methods