## Genel Veri Türleri

Genel veri türlerini kullanarak, işlev imzaları veya yapı gibi öğelerin tanımlarını oluşturabiliriz; bu tanımları daha sonra birçok farklı somut veri türü ile kullanabiliriz. Öncelikle, genel veri türlerini kullanarak işlevlerin, yapıları, enum'ları ve yöntemleri nasıl tanımlayacağımıza bakalım. Ardından, genel veri türlerinin kod performansını nasıl etkilediğini tartışacağız.

### İşlev Tanımlarında

Genel veri türlerini kullanan bir işlev tanımlarken, genelleri genellikle parametrelerin ve dönüş değerinin veri türlerini belirttiğimiz işlevin imzasında yerleştiririz. Bunu yapmak, kodumuzu daha esnek hale getirir ve işlevimizin çağrıcılarına daha fazla işlevsellik sağlar, ayrıca kod tekrarını önler.

> **Anahtar Nokta:** `largest` işlevimizle devam ederken, Liste 10-4, bir dilim içinde en büyük değeri bulan iki işlev göstermektedir. Daha sonra bunları genel veri türleri kullanan tek bir işlevde birleştireceğiz.
> — En önemli not.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-04/src/main.rs:here}}
```



`largest_i32` işlevi, Liste 10-3'te çıkardığımız, bir dilim içindeki en büyük `i32`'yi bulan işlevdir. `largest_char` işlevi, bir dilim içindeki en büyük `char`'ı bulur. İşlev gövdeleri aynı koda sahip olduğundan, tekrarları ortadan kaldırmak için tek bir işlevde genel bir tür parametresi tanıtalım.

### Genel Tür Parametreleri

Yeni bir tek işlevde türleri parametreleştirmek için, tür parametresine bir isim vermemiz gerekir, tıpkı işlevin değer parametreleri için yaptığımız gibi. Herhangi bir tanımlayıcıyı tür parametre adı olarak kullanabilirsiniz; ancak, varsayılan olarak `T` kullanacağız çünkü Rust'taki tür parametre adları genellikle kısa olup çoğunlukla tek harfli ve Rust’ın tür adlandırma kuralı UpperCamelCase'dir. İsimlerin kısaltması olarak *type*, `T` çoğu Rust programcısı tarafından tercih edilen seçimdir.

:::note
İşlevin gövdesinde bir parametre kullandığımızda, derleyicinin bu adın ne anlama geldiğini bilmesi için imzada parametre adını bildirmemiz gerekir.
:::

Benzer şekilde, bir işlev imzasında bir tür parametre adı kullandığımızda, onu kullanmadan önce tür parametre adını bildirmemiz gerekir. Genel `largest` işlevini tanımlamak için, işlev adı ile parametre listesi arasında açılı parantezler içinde tür adı bildirimlerini yerleştiririz:

```rust,ignore
fn largest<T>(list: &[T]) -> &T {
```

Bu tanımı şöyle okuyoruz: `largest` işlevi bir tür `T` üzerinde genel bir işlevdir. Bu işlevin `list` adında bir parametresi vardır; bu, `T` türündeki değerlerin dilimidir. `largest` işlevi, aynı türde `T` bir değere referans döndürecektir.

Liste 10-5, genel veri tipini imzasında kullanan birleşik `largest` işlev tanımını göstermektedir. Liste aynı zamanda işlevimizi `i32` değerlerinin veya `char` değerlerinin bir dilimi ile nasıl çağırabileceğimizi de göstermektedir. Bu kodun henüz derlenmeyeceğini, ama daha sonra bu bölümü düzelteceğimizi unutmayın.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-05/src/main.rs}}
```



Bu kodu şu anda derlersek, şu hatayı alırız:

```console
{{#include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-05/output.txt}}
```

Yardım metninde `std::cmp::PartialOrd` belirtiliyor; bu bir *trait*'dir ve bir sonraki bölümde trait'ler hakkında konuşacağız. Şimdilik, bu hatanın `largest` işlevinin gövdesinin, `T` olabilecek tüm olası türler için çalışmayacağını belirttiğini bilin. Çünkü gövdede `T` türündeki değerleri karşılaştırmak istiyoruz, sadece değerleri sıralanabilen türleri kullanabiliriz. Karşılaştırmalara izin vermek için standart kütüphane, türler üzerinde uygulayabileceğiniz `std::cmp::PartialOrd` trait'ini içerir (bu trait hakkında daha fazla bilgi için Ek C'ye bakın). Yardım metnindeki öneriyi takip ederek `T` için geçerli türleri yalnızca `PartialOrd`'u uygulayan türlerle sınırlıyoruz ve bu örnek derleniyor çünkü standart kütüphane hem `i32` hem de `char` üzerinde `PartialOrd`'u uygular.

---

### Yapı Tanımlarında

Bir veya daha fazla alanda genel tür parametresi kullanmak için yapıları da tanımlayabiliriz; bunu `<>` sözdizimi ile yaparız. Liste 10-6, her türdeki `x` ve `y` koordinat değerlerini tutan `Point` yapısını tanımlar.

` yapısı">

```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-06/src/main.rs}}
```



Yapı tanımlarında genel veri türlerini kullanma sözdizimi, işlev tanımlarında kullanılanlarla benzerdir. Öncelikle, yapı adının hemen ardından açılı parantezler içinde tür parametresinin adını bildirimimiz gerekir. Ardından, yapının tanımında, genellikle somut veri türlerini belirtmek için kullanırız.

:::tip
`Point` tanımında sadece bir genel tür kullandığımızdan, bu tanım, `Point` yapısının bazı türler üzerinde genel olduğunu ve `x` ve `y` alanlarının *her iki* aynı tür olduğunu ifade eder; hangi tür olursa olsun.
:::

Eğer Liste 10-7'de gösterildiği gibi, farklı tür değerleri olan bir `Point` örneği oluşturursak, kodumuz derlenmeyecektir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-07/src/main.rs}}
```



Bu örnekte, `x`'e tamsayı değeri `5` atadığımızda, derleyiciye bu `Point` örneği için genel tür `T`'nin bir tamsayı olacağını bildirmiş oluruz. Daha sonra `y` için `4.0` belirttiğimizde, `x` ile aynı türde olmasını tanımladığımızda, bu durumda tür uyuşmazlığı hatası alırız:

```console
{{#include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-07/output.txt}}
```

`x` ve `y` her ikisi de genel türler olmasına rağmen farklı türlere sahip olabilecek bir `Point` yapısı tanımlamak için, birden fazla genel tür parametresi kullanabiliriz. Örneğin, Liste 10-8'de `Point` tanımını, `x` türü `T` ve `y` türü `U` olacak şekilde genel hale getirmek için değiştiriyoruz.

`">

```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-08/src/main.rs}}
```



Artık gösterilen tüm `Point` örnekleri kabul ediliyor! Bir tanımda istediğiniz kadar genel tür parametresi kullanabilirsiniz, ancak birden fazlasını kullanmak kodunuzu okumayı zorlaştırır. Eğer kodunuzda birçok genel türe ihtiyacınız olduğunu düşünüyorsanız, bu, kodunuzun daha küçük parçalara yapılandırılması gerektiğini gösterebilir.

### Enum Tanımlarında

Yapılarda yaptığımız gibi, enum'ları da varyantlarında genel veri türleri tutacak şekilde tanımlayabiliriz. Standart kütüphanenin sağladığı ve 6. Bölümde kullandığımız `Option` enum'una bir kez daha bakalım:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

Bu tanım artık sizler için daha anlamlı olmalı. Gördüğünüz gibi, `Option` enum'u `T` türü üzerinde genel bir yapıdır ve iki varyanta sahiptir: `Some`, bir `T` türünde bir değeri tutar ve `None`, hiçbir değeri tutmaz. `Option` enum'unu kullanarak, bir opsiyonel değer kavramını ifade edebiliriz ve `Option` genel bir yapı olduğundan, opsiyonel değerin türü ne olursa olsun bu soyutlamayı kullanabiliriz.

Enum'lar da birden fazla genel tür kullanabilir. 9. Bölümde kullandığımız `Result` enum'ının tanımı bir örnektir:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`Result` enum'u iki tür üzerinde genel bir yapıdır: `T` ve `E`, ve iki varyantı vardır: `Ok`, `T` türünde bir değeri tutar ve `Err`, `E` türünde bir değeri tutar. Bu tanım, herhangi bir işlemimizin başarılı olabileceği (bir `T` türünde bir değer döndürebilir) veya başarısız olabileceği (bir `E` türünde bir hata döndürebilir) yerlerde `Result` enumunu kullanmayı kolaylaştırır. Aslında, `T`'nin başarılı bir şekilde açılan dosya için `std::fs::File` türü ile dolduğu ve `E`'nin dosyayı açma sorunları için `std::io::Error` türüyle dolduğu 9-3'teki açma işlemi için kullandığımız şey bu.

Kodunuzda yalnızca tuttukları değerlerin türleri ile farklılık gösteren birden fazla yapı veya enum tanımı ile karşılaştığınızda, bunun yerine genel türler kullanarak tekrarı önleyebilirsiniz.

---

### Yöntem Tanımlarında

Yapılar ve enum'lar (5. Bölümde yaptığımız gibi) üzerinde yöntemler implement edebiliriz ve bunların tanımlarında genel türler de kullanabiliriz. Liste 10-9, Liste 10-6'da tanımladığımız `Point` yapısı üzerinde `x` adında bir yöntem implement edildiğini göstermektedir.

` yapısına `x` adında bir yöntemi implement etme; bu yöntem `T` türündeki `x` alanına bir referans döndürecektir.">

```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-09/src/main.rs}}
```



Burada, `Point` üzerinde `x` adında bir yöntemi tanımladık; bu, `x` alanındaki verilere bir referans döndürüyor.

Dikkat edin ki `impl`'den hemen sonra `T`'yi bildirmemiz gerekiyor ki `Point` türünde yöntemler implement ettiğimizi belirtebilelim. `impl`'den sonra `T`'yi genel bir tür olarak tanımlayarak, Rust açılı parantez içindeki türün genel bir tür olduğunu tanımlar. Bu genel parametre için yapı tanımında tanımladığımızdan farklı bir ad seçebilirdik, ancak aynı adı kullanmak gelenekseldir. `impl` içinde yazılan ve genel türü ilan eden yöntemler, sonradan `Point` türüyle değiştirilecek somut tür ne olursa olsun, türün herhangi bir örneği üzerinde tanımlanır.

Ayrıca, tür tanımlarında yöntemleri tanımlarken genel türlere kısıtlamalar da belirtebiliriz. Örneğin, `Point` örnekleri yerine yalnızca `Point` örnekleri üzerinde yöntemler implement edebiliriz. Liste 10-10'da, somut tür olarak `f32` kullandığımızdan, `impl` sonrasında herhangi bir tür belirtmiyoruz.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-10/src/main.rs:here}}
```



Bu kod, `Point` türünün bir `distance_from_origin` yöntemine sahip olacağı; `T` türü `f32` olmayan diğer `Point` örnekleri ise bu yöntem tanımına sahip olmayacaktır. Bu yöntem, noktamızın (0.0, 0.0) koordinatlarındaki noktaya ne kadar uzakta olduğunu ölçer ve yalnızca kayan nokta türleri için mevcut matematiksel işlemleri kullanır.

:::warning
Bir yapı tanımındaki genel tür parametreleri, aynı yapının yöntem imzalarında kullandığınız türlerle her zaman aynı olmayabilir.
:::

Liste 10-11'de `Point` yapısı için genel türleri `X1` ve `Y1` olarak, `mixup` yönteminin imzası için ise `X2` ve `Y2` olarak kullanıyoruz ki bu örneği daha net hale getirelim. Yöntem, `self` `Point`'inden (türü `X1`) `x` değerini ve geçirilen `Point`'ten (türü `Y2`) `y` değerini içeren yeni bir `Point` örneği oluşturur.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-11/src/main.rs}}
```



`main` içinde, `x` için `i32` (değeri `5`) ve `y` için bir `f64` (değeri `10.4`) olan bir `Point` tanımladık. `p2` değişkeni, `x` için bir dize dilimi (değeri `"Hello"`) ve `y` için bir `char` (değeri `c`) olan bir `Point` yapısıdır. `mixup` yöntemini `p1` üzerinde `p2` argümanıyla çağırmak, bize `x` için `i32`, çünkü `x`, `p1`'den geldi. `p3` değişkeni `y` için `char` alacak çünkü `y`, `p2`'den geldi. `println!` makro çağrısı `p3.x = 5, p3.y = c` değerlerini yazdıracaktır.

Bu örneğin amacı, bazı genel parametrelerin `impl` ile ve bazılarının yöntem tanımı ile tanımlandığı bir durumu göstermektir. Burada, genel parametreler `X1` ve `Y1`, yapı tanımına gittiğinden dolayı `impl`'den sonra bildirilmiştir. Genel parametreler `X2` ve `Y2` ise yalnızca yönteme özgü olduklarından `fn mixup`'dan sonra bildirilmiştir.

---

### Genel Veri Türlerini Kullanan Kodun Performansı

Belki de genel tür parametrelerini kullanmanın bir çalışma zamanı maliyeti olup olmadığını merak ediyorsunuzdur. İyi haber şu ki, genel türler kullanmak, programınızın somut türlerle çalıştığı kadar yavaş çalışmasına neden olmaz.

Rust, genel türleri kullanarak yazılan kodun monomorfizasyonunu derleme zamanında gerçekleştirir. *Monomorfizasyon*, genel kodun, derlenirken kullanılan somut türler ile doldurulması yoluyla özel koda dönüştürülmesi sürecidir. Bu süreçte, derleyici, Liste 10-5'te genel işlevi oluşturmak için kullandığımız adımların tersini yapar: derleyici, genel kodun çağrıldığı her yeri inceler ve genel kodun çağrıldığı somut türler için kod oluşturur.

Bunun nasıl işlediğine bakalım, standart kütüphanenin genel `Option` enum'unu kullanarak:

```rust
let integer = Some(5);
let float = Some(5.0);
```

Rust bu kodu derlerken monomorfizasyon gerçekleştirir. Bu süreçte, derleyici `Option` örneklerinde kullanılmış olan değerleri okur ve iki türden `Option` tanımlar: biri `i32`, diğeri `f64`. Böylece, genel `Option` tanımını `i32` ve `f64` türlerine özel iki tanıma genişletir ve genel tanımı somut olanlarla değiştirmiş olur.

> **Önemli Not:** Monomorfize edilmiş kodun görünümü şu şekildedir (derleyici burada kullandığımızdan farklı isimler kullanır; burada örnekleme amacıyla gösterilmektedir):



```rust
enum Option_i32 {
    Some(i32),
    None,
}

enum Option_f64 {
    Some(f64),
    None,
}

fn main() {
    let integer = Option_i32::Some(5);
    let float = Option_f64::Some(5.0);
}
```



Genel `Option` tanımı, derleyici tarafından oluşturulan somut tanımlarla değiştirilmiştir. Rust, genel kodu, her örnekte türü belirten kod olarak derlediğinden, genel türler kullanmanın çalışma zamanı maliyeti yoktur. Kod çalıştığında, her define'ı manuel olarak kopyalamış olsaydık da olduğu gibi işler. Monomorfizasyon süreci, Rust'ın genel türlerini çalışma zamanında son derece verimli hale getirir.