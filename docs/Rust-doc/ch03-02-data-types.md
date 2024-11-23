## Veri Türleri

Rust'taki her değer belirli bir *veri türü* içerisindedir; bu, Rust'a hangi tür verinin tanımlandığını bildirir, böylece bu verilerle nasıl çalışacağını biliriz. İki veri türü alt kümesine bakacağız: skalar ve bileşik.

:::note
Unutmayın ki Rust, *statik olarak türlendirilmiş* bir dildir; bu, tüm değişkenlerin türlerini derleme zamanında bilmesi gerektiği anlamına gelir.
:::

Derleyici genellikle hangi türü kullanmak istediğimizi, değer ve kullanım şeklimize dayanarak çıkarabilir. Birden fazla türün mümkün olduğu durumlarda, örneğin [“Tahmini Gizli Sayı ile Karşılaştırma”][comparing-the-guess-to-the-secret-number] bölümünde, bir `String`'i sayısal bir türe `parse` ile dönüştürdüğümüzde, bir tür açıklaması eklememiz gerekir; örneğin:

```rust
let guess: u32 = "42".parse().expect("Bir sayı değil!");
```

Önceki kodda gösterilen `: u32` tür açıklamasını eklemezsek, Rust aşağıdaki hatayı gösterir; bu, derleyicinin hangi türü kullanmak istediğimizi bilmek için bizden daha fazla bilgiye ihtiyaç duyduğu anlamına gelir:

```console
{{#include ../listings/ch03-common-programming-concepts/output-only-01-no-type-annotations/output.txt}}
```

Diğer veri türleri için farklı tür açıklamaları göreceksiniz.

---

### Skalar Türler

*Skalar* tür, tek bir değeri temsil eder. Rust'ın dört temel skalar türü vardır: tam sayılar, ondalık sayılar, Boolean'lar ve karakterler. Bunları diğer programlama dillerinden tanıyor olabilirsiniz. Şimdi Rust'taki nasıl çalıştıklarına bakalım.

#### Tam Sayı Türleri

Bir *tam sayı*, kesirli bir bileşeni olmayan bir sayıdır. Bölüm 2'de bir tam sayı türü kullandık; bu `u32` türüdür. Bu tür bildirim, ilişkili olduğu değerin işaretsiz bir tam sayı (işaretli tam sayı türleri `u` yerine `i` ile başlar) olması gerektiğini ve 32 bit alan kapladığını gösterir. Tablo 3-1, Rust'taki yerleşik tam sayı türlerini göstermektedir. Bir tam sayı değerinin türünü bildirmek için bu varyantların herhangi birini kullanabiliriz.

Tablo 3-1: Rust'taki Tam Sayı Türleri

| Uzunluk | İşaretli | İşaretsiz |
|---------|----------|-----------|
| 8-bit   | `i8`     | `u8`      |
| 16-bit  | `i16`    | `u16`     |
| 32-bit  | `i32`    | `u32`     |
| 64-bit  | `i64`    | `u64`     |
| 128-bit | `i128`   | `u128`    |
| mimari  | `isize`  | `usize`   |

:::info
Her varyant ya işaretli ya da işaretsiz olabilir ve belirli bir boyuta sahiptir. *İşaretli* ve *işaretsiz*, sayının negatif olmasının mümkün olup olmadığını belirtir.
:::

Bu, sayıları kağıda yazmaya benzer: imzanın önemli olduğu durumlarda, bir sayı artı (`+`) veya eksi (`-`) işareti ile gösterilir; ancak sayının pozitif olduğunu varsaymanın güvenli olduğu durumlarda, işaretsiz gösterilir. İşaretli sayılar [iki'nin tamamı][twos-complement] temsili kullanılarak saklanır.

Her işaretli varyant, -(2n - 1) ile 2n - 1 - 1 arasındaki sayıları saklayabilir; burada *n*, bu varyantın kullandığı bit sayısını belirtir. Dolayısıyla bir `i8`, -(27) ile 27 - 1 arasında değer saklayabilir; bu da -128 ile 127 arasında anlamına gelir. İşaretsiz varyantlar, 0 ile 2n - 1 arasında sayıları saklayabilir; dolayısıyla bir `u8`, 0 ile 28 - 1 arasında yani 0 ile 255 arasında değer saklayabilir.

Ayrıca, `isize` ve `usize` türleri, programınızın çalıştığı bilgisayarın mimarisine bağlıdır; bu tablo da "mimari" olarak belirtilmiştir: 64 bit, 64 bit mimarideysanız ve 32 bit, 32 bit mimarideysanız.

---

:::tip
Tam sayı sabitlerini Tablo 3-2'de gösterildiği gibi herhangi bir formda yazabilirsiniz. Birden fazla sayısal türü temsil edebilen sayı sabitleri, türü belirtmek için bir tür ekine, örneğin `57u8`, izin verir. Sayı sabitleri ayrıca, sayıyı okumayı kolaylaştırmak için `_` tırnak işaretini kullanabilir; örneğin `1_000`, `1000` olarak belirtmiş olsaydınız aynı değere sahip olacaktır.
:::

Tablo 3-2: Rust'taki Tam Sayı Sabitleri

| Sayı sabitleri | Örnek       |
|-----------------|-------------|
| Ondalık         | `98_222`    |
| Altıgen         | `0xff`      |
| Sekizgen        | `0o77`      |
| İkilik         | `0b1111_0000`|
| Byte (`u8` sadece)| `b'A'`   |

:::warning
Hangi tam sayı türünü kullanmanız gerektiğini nasıl bilirsiniz? Emin değilseniz, Rust'ın varsayılanları genellikle iyi başlangıç noktalarıdır: tam sayı türleri varsayılan olarak `i32`'dir.
:::

`isize` veya `usize`'yi kullanmanız gereken ana durum, bir tür koleksiyonunu dizinlemek olduğunda olur.

> ##### Tam Sayı Taşması
>
> Diyelim ki 0 ile 255 arasında değerler tutabilen bir `u8` türünde değişkeniniz var. Eğer değişkenin değerini bu aralığın dışındaki bir değere, örneğin 256'ya değiştirmeye çalışırsanız, *tam sayı taşması* gerçekleşecektir; bu da iki tür davranışa yol açabilir. Hata modunda derleme yaptığınızda, Rust taşma durumunu kontrol eden kontrol mekanizmaları içerir ve programınız bu davranış gerçekleşirse çalıştırma zamanında *panic* durumu alır. Rust, bir program hata ile çıktığında bu durumu *panikleme* terimini kullanır; panikleri daha ayrıntılı olarak [“Panic! ile Geri Dönülemez Hatalar”][unrecoverable-errors-with-panic] bölümünde tartışacağız.
>
> Çıkış modunda `--release` bayrağı ile derleme yaptığınızda, Rust, paniklere neden olan tam sayı taşmasını kontrol etmez. Bunun yerine taşma durumunda, Rust *iki'nin tamamı sarılması* gerçekleştirir. Kısacası, türün tutabileceğinden daha büyük değerler, o türün tutabileceği değerlerin en düşük değerine "sarılır". Bir `u8` durumunda 256 değeri 0 olur, 257 değeri 1 olur ve bu şekilde devam eder. Program paniklemeyecektir, ancak değişken beklediğiniz değerle muhtemelen aynı olmayacaktır. Tam sayı taşmasından gelen sarılma davranışına güvenmek bir hata olarak kabul edilir.
>
> Taşma olasılığını açıkça ele almak için, standart kütüphane tarafından sağlanan bu yöntem gruplarını kullanabilirsiniz:
>
> * Taşmanın her modunun sarıldığı `wrapping_*` yöntemleri, örneğin `wrapping_add`.
> * Taşma oluşursa `None` değerini döndüren `checked_*` yöntemleri.
> * Taşma olup olmadığını belirten bir boolean ile birlikte değeri döndüren `overflowing_*` yöntemleri.
> * Değerin minimum veya maksimum değerinde doygun hale gelmesini sağlayan `saturating_*` yöntemleri.

#### Ondalık Sayı Türleri

Rust ayrıca *ondalık sayılar* için iki temel türe sahiptir; bunlar ondalık noktası olan sayılardır. Rust'ın ondalık sayı türleri `f32` ve `f64` olup, sırasıyla 32 bit ve 64 bit büyüklüğündedir. Varsayılan tür `f64`'tür çünkü modern CPU'larda, `f32` ile yaklaşık olarak aynı hızda çalışmasına rağmen daha fazla hassasiyet sunmaktadır. Tüm ondalık sayı türleri işaretlidir.

> Aşağıdaki kod, ondalık sayıların kullanımını gösteren bir örnektir:
>
> Dosya Adı: src/main.rs
>
> ```rust
> {{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-06-floating-point/src/main.rs}}
> ```

Ondalık sayılar IEEE-754 standardına göre temsil edilir. `f32`, tek hassasiyetli bir float, `f64` ise çift hassasiyetli bir float'tur.

#### Sayısal İşlemler

Rust, tüm sayı türleri için beklediğiniz temel matematiksel işlemleri destekler: toplama, çıkarma, çarpma, bölme ve kalan. Tam sayı bölmesi, sıfıra en yakın tam sayıya yuvarlar. Aşağıdaki kod, bir `let` ifadesinde her sayısal işlemi nasıl kullanabileceğinizi gösterir:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-07-numeric-operations/src/main.rs}}
```

Bu ifadelerdeki her ifade bir matematiksel operatör kullanır ve tek bir değere hesaplayarak ardından bir değişkene bağlanır. [Ek B][appendix_b] Rust'ın sunduğu tüm operatörlerin bir listesini içerir.

#### Boolean Türü

Çoğu diğer programlama dilinde olduğu gibi, Rust'taki bir Boolean türünün iki olası değeri vardır: `true` ve `false`. Boolean'lar bir byte boyutundadır. Rust'taki Boolean türü `bool` ile gösterilir. Örneğin:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-08-boolean/src/main.rs}}
```

Boolean değerleri kullanmanın temel yolu, `if` ifadesi gibi koşul ifadeleri ile kullanmaktır. Rust'taki `if` ifadelerinin nasıl çalıştığını [“Kontrol Akışı”][control-flow] bölümünde inceleyeceğiz.

#### Karakter Türü

Rust'ın `char` türü, dilin en basit alfabetik türüdür. İşte `char` değerlerini tanımlamanın bazı örnekleri:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-09-char/src/main.rs}}
```

`char` sabitlerini tek tırnak ile belirttiğimizi, dize sabitlerinin ise çift tırnak kullandığını unutmayın. Rust'ın `char` türü dört byte boyutundadır ve bir Unicode Scalar Değeri temsil eder; bu, yalnızca ASCII'den daha fazlasını temsil edebileceği anlamına gelir. Aksanlı harfler; Çince, Japonca ve Korece karakterler; emoji; ve sıfır genişlikli boşluklar, Rust'taki geçerli `char` değerleridir. Unicode Scalar Değerleri, `U+0000` ile `U+D7FF` ve `U+E000` ile `U+10FFFF` arasında değer alır. Ancak, Unicode'da "karakter" gerçekten bir kavram değildir; bu nedenle insan sezginizin bir "karakter"ın ne olduğu ile Rust'taki `char` arasındaki fark size alışılmadık görünebilir. Bu konuyu [“UTF-8 Kodlu Metinleri Dizelerle Saklama”][strings] bölümünde ayrıntılı olarak tartışacağız.

---

### Bileşik Türler

*Bileşik türler*, birden fazla değeri bir türde gruplayabilir. Rust'ta iki temel bileşik tür vardır: demetler ve diziler.

#### Demet Türü

*Bir demet*, birden fazla değeri çeşitli türlerde bir arada gruplamanın genel bir yoludur. Demetlerin sabit bir uzunluğu vardır: bir kez tanımlandıklarında boyutu büyüyemez veya küçülemez.

:::info
Bir demet oluşturmak için, parantez içinde virgülle ayrılmış bir değer listesi yazarız. Demetteki her pozisyonda bir tür vardır ve demetteki farklı değerlerin türleri aynı olmak zorunda değildir.
:::

Bu örnekte isteğe bağlı tür açıklamaları ekledik:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-10-tuples/src/main.rs}}
```

`Tup` değişkeni tüm demete bağlanır çünkü demet tek bir bileşik eleman olarak kabul edilir. Demet değerinden bireysel değerleri almak için, bir desen eşleşmesi kullanarak demet değerini dağıtabiliriz; şöyle:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-11-destructuring-tuples/src/main.rs}}
```

Bu program önce bir demet oluşturur ve onu `tup` değişkenine bağlar. Ardından, `let` ile bir desen kullanarak `tup`'u alır ve üç ayrı değişken olan `x`, `y` ve `z`'ye dönüştürür. Bu, demeti üç parçaya ayırdığı için *dağıtma* olarak adlandırılır. Son olarak, program `y`'nin değerini, yani `6.4` değerini yazdırır.

Bir demet elemanına doğrudan erişmek için, erişmek istediğimiz değerin dizinini takip eden bir nokta (`.`) kullanabiliriz. Örneğin:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-12-tuple-indexing/src/main.rs}}
```

Bu program `x` demetini oluşturur ve ardından demetin her elemanına karşılık gelen dizinlerini kullanarak erişir. Çoğu programlama dilinde olduğu gibi, bir demetteki ilk dizin 0'dır.

---

:::danger
Herhangi bir değeri olmayan demet için özel bir isim vardır: *birim*. Bu değer ve ona karşılık gelen tür her ikisi de `()` olarak yazılır ve boş bir değeri veya boş bir dönüş türünü temsil eder. İfadeler, başka bir değer döndürmüyorsa, birim değerini döndürür.
:::

#### Dizi Türü

Birden fazla değerin bir araya gelmesi için bir diğer yol *bir dizi* oluşturmaktır. Bir demetin aksine, bir dizinin her elemanı aynı türde olmak zorundadır. Diğer bazı dillerdeki dizilerin aksine, Rust'taki diziler sabit bir uzunluğa sahiptir.

Dizi elemanlarını, köşeli parantezler içinde virgülle ayrılmış bir liste olarak yazarız:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-13-arrays/src/main.rs}}
```

Diziler, verilerinizi yığıt üzerinde, gördüğümüz diğer türler gibi tahsis etmek istediğinizde yararlıdır; yığın ile (bu konuyu [Bölüm 4][stack-and-heap]'te daha ayrıntılı olarak tartışacağız) veya daima sabit sayıdaki elemanlara sahip olmayı sağlamak istediğinizde yararlıdır. Ancak, diziler vektör türünden daha esnek değildir. *Vektör*, standart kütüphane tarafından sağlanan ve büyüyüp küçülmesine izin verilen benzer bir koleksiyon türüdür. Hangi türü kullanmanız gerektiğinden emin değilseniz, muhtemelen bir vektör kullanmalısınız. [Bölüm 8][vectors]'de vektörleri daha ayrıntılı olarak ele alacağız.

:::note
Ancak, diziler, eleman sayısının değişmeyeceğini bildiğinizde daha kullanışlıdır. Örneğin, programınızda ayların adlarını kullanıyorsanız, muhtemelen bir vektör yerine bir dizi kullanırsınız çünkü her zaman 12 eleman içereceğini bilirsiniz:

```rust
let months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz",
              "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
```
:::

Bir dizinin türünü, her elemanın türünü, bir noktalı virgül ve ardından dizinin içindeki eleman sayısını köşeli parantezlerle yazılarak belirtirsiniz:

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

Burada, `i32` her bir elemanın türüdür. Noktalı virgülden sonra gelen `5`, dizinin beş eleman içerdiğini gösterir.

Ayrıca, diziye her eleman için aynı değeri içermek için başlangıç değerini belirtip, arkasından bir noktalı virgül ve ardından dizinin uzunluğunu köşeli parantez içerisinde belirterek başlatabilirsiniz; örneğin:

```rust
let a = [3; 5];
```

`A` adındaki dizi, başlangıçta `3` değerine ayarlanmış `5` eleman içerecektir. Bu, `let a = [3, 3, 3, 3, 3];` yazmak yerine daha özlü bir yoldur.

---

##### Dizi Elemanlarına Erişim

Bir dizi, önceden bilinen ve sabit boyutta bir bellek parçasıdır ve yığıt üzerinde tahsis edilebilir. Elemanlara erişmek için dizileme kullanarak erişebilirsiniz; şu şekilde:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-14-array-indexing/src/main.rs}}
```

Bu örnekte, `first` adındaki değişken `1` değerini alır, çünkü bu dizi içindeki `[0]` dizinindeki değerdir. `second` adındaki değişken ise dizinin `[1]` dizininden `2` değerini alır.

##### Geçersiz Dizi Elemanı Erişimi

Bir dizinin sonundan öte bir elemanı erişmek isterseniz ne olur? Diyelim ki, bölüm 2'deki tahmin oyunu benzeri bir kod yazıyorsunuz ve kullanıcıdan bir dizi indeksi alıyorsunuz:

Dosya Adı: src/main.rs

```rust,ignore,panics
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-15-invalid-array-access/src/main.rs}}
```

Bu kod başarıyla derlenir. Bu kodu `cargo run` kullanarak çalıştırdığınızda ve `0`, `1`, `2`, `3` veya `4` girerseniz, program o dizindeki ilgili değeri yazdırır. Eğer array'in sonundan geçecek bir sayı, örneğin `10` girerseniz, aşağıdaki gibi çıktılar alırsınız:

```console
thread 'main' panicked at src/main.rs:19:19:
index out of bounds: the len is 5 but the index is 10
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Program, geçersiz bir değerin dizilmesi sırasında bir *çalışma zamanı* hatası aldı. Program bir hata mesajı ile çıktı ve son `println!` ifadesini yürütmedi. Dizileme kullanarak bir eleman erişmeye çalıştığınızda, Rust belirtilen dizinin dizinin uzunluğundan küçük olduğundan emin olacaktır. Bu koşul, dizinin uzunluğuna eşit ya da daha büyükse, Rust panik yapacaktır. Bu kontrol, çalışma zamanında yapılmalıdır; özellikle bu durumda, derleyici kodu çalıştıran kullanıcının hangi değeri gireceğini bilemez.

:::danger
Bu, Rust’ın bellek güvenliği ilkelerinin bir örneğidir. Birçok düşük seviyeli dillerde, bu tür bir kontrol yapılmaz ve geçersiz bir dizin verildiğinde geçersiz belleğe erişilebilir. Rust, bellek erişim izin vermek ve devam etme yerine hemen çıkış yaparak bu tür hatalardan korunmanızı sağlar. Bölüm 9, Rust’ın hata yönetimi ile ilgili daha fazla bilgi ve okuması okunabilir, güvenli kod yazma yöntemlerini tartışmaktadır.
::: 

[comparing-the-guess-to-the-secret-number]:
ch02-00-guessing-game-tutorial.html#comparing-the-guess-to-the-secret-number
[twos-complement]: https://en.wikipedia.org/wiki/Two%27s_complement
[control-flow]: ch03-05-control-flow.html#control-flow
[strings]: ch08-02-strings.html#storing-utf-8-encoded-text-with-strings
[stack-and-heap]: ch04-01-what-is-ownership.html#the-stack-and-the-heap
[vectors]: ch08-01-vectors.html
[unrecoverable-errors-with-panic]: ch09-01-unrecoverable-errors-with-panic.html
[appendix_b]: appendix-02-operators.md