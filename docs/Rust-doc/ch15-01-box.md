## `Box` Kullanarak Yığın Üzerinde Veri İşaretleme

En basit akıllı işaretçi *box* yani kutudur ve türü `Box` olarak yazılır. Kutular, verileri yığına değil, yığın bellek üzerinde saklamanıza olanak tanır. Yığındaki kalan ise yığın verisine işaret eden işaretçidir. Yığın ve yığın bellek arasındaki farkı incelemek için `Bölüm 4'e` bakın.

:::info
Kutuların performans maliyeti yoktur; yalnızca verilerini yığında sakladıklarından kaynaklanır. 
:::

Ancak çok fazla ek yetenekleri de yoktur. Bunları en çok bu durumlarda kullanacaksınız:

- Derleme zamanında boyutu bilinemeyen bir türe sahipseniz ve o türde bir değeri kesin boyut gerektiren bir bağlamda kullanmak istiyorsanız.
- Büyük miktarda veriniz varsa ve sahipliği devretmek istiyorsanız ancak verinin kopyalanmamasını istiyorsanız.
- Bir değeri sahiplenmek istiyorsanız ve bunun belirli bir tür olmaktan çok belirli bir trait'i uygulayan bir tür olmasının sizin için önemli olması durumunda.

:::tip
İlk durumu `“Kutular ile Rekürsif Türleri Etkinleştirme”` bölümünde göstereceğiz. 
:::

İkinci durumda, büyük bir veri miktarını sahiplik devri sırasında kopyalanmaktan kaçınmak için yığından yığına kopyalamak uzun sürebilir. Bu durumda performansı artırmak için büyük miktardaki verileri yığında bir kutuda saklayabiliriz. Böylece yalnızca küçük miktarda işaretçi verisi yığında kopyalanırken, referans verdiği veriler yığının bir noktasında kalır. Üçüncü durum ise *trait nesnesi* olarak bilinir ve `Bölüm 18` başlıklı tüm bir bölüm ayırmaktadır. Burada öğrendiklerinizi yine Bölüm 18'de uygulayacaksınız!

### Yığın Üzerinde Veri Saklamak için `Box` Kullanma

`Box`'nin yığın depolama kullanım durumunu tartışmadan önce, `Box` içinde saklanan değerlere nasıl etkileşimde bulunacağımıza dair sözdizimini ele alacağız.

Liste 15-1, bir `i32` değerini yığında saklamak için bir kutu kullanmayı gösterir:



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-01/src/main.rs}}
```



`b` değişkenini yığında tahsis edilen `5` değerine işaret eden bir `Box` değeri olarak tanımlıyoruz. Bu program `b = 5` yazdıracak; bu durumda, veriye kutudayken tıpkı yığında olduğunda erişiriz. Her sahiplenilmiş değer gibi, bir kutu kapsam dışında çıktığında, `main`'in sonunda olduğu gibi, serbest bırakılır. Serbest bırakma, hem yığında saklanan kutu hem de onun işaret ettiği yığın üzerindeki veri için gerçekleşir.

:::warning
Yığında tek bir değeri saklamak pek faydalı değildir, bu nedenle kutuları bu şekilde sıkça kullanmayacaksınız.
:::

Tek bir `i32` gibi değerlere yığında sahip olmak, varsayılan olarak saklandıkları yer olarak çoğu durumda daha uygundur. Kutuları kullanmadan tanımlayacağımız türleri belirleyebileceğimiz bir duruma bakalım.

### Kutular ile Rekürsif Türleri Etkinleştirme

*Rekürsif tür* bir değerin kendisiyle aynı türden bir başka değere sahip olabileceği bir değerdir. Rekürsif türler bir sorun teşkil eder çünkü Rust derleme zamanında bir türün ne kadar alan kapladığını bilmelidir. Ancak, rekürsif türlerin değerlerinin iç içe geçmişliği teorik olarak sonsuza kadar devam edebilir, bu nedenle Rust o değerin ne kadar alan gerektiğini bilemez. Kutuların bilinen bir boyutu olduğundan, rekürsif tür tanımında bir kutu ekleyerek rekürsif türleri etkinleştirebiliriz.

:::note
Bir rekürsif tür örneği olarak, *cons listesi*'ni inceleyelim. Bu, fonksiyonel programlama dillerinde sıkça bulunan bir veri türüdür.
:::

Tanımlayacağımız cons listesi türü, rekürsiyon dışında oldukça basittir; bu nedenle, üzerinde çalışacağımız örnekteki kavramlar rekürsif türlerle ilgili daha karmaşık durumlarla her zaman faydalı olacaktır.

#### Cons Listesi Hakkında Daha Fazla Bilgi

*Cons listesi*, Lisp programlama dilinden ve onun diyalektlerinden gelen, iç içe geçmiş çiftlerden oluşan bir veri yapısıdır ve bir bağlı liste sürümüdür. Adı, iki argümanından yeni bir çift oluşturan Lisp'teki `cons` fonksiyonundan (gereç anlamında "inşa fonksiyonu") gelmektedir. Bir değer ve başka bir çiftten oluşan bir çifte `cons` çağrısı yaparak, rekürsif çiftlerden oluşan cons listeleri üretilebiliriz.

Örneğin, işte parantez içinde her çiftin olduğu bir liste olan 1, 2, 3 içeren bir cons listesinin psödo-kod temsili:

```text
(1, (2, (3, Nil)))
```

Her bir öğe, iki unsur içerir: mevcut öğenin değeri ve bir sonraki öğe. Listedeki son madde yalnızca `Nil` adı verilen bir değeri içerir ve bir sonraki öğeye sahip değildir. Bir cons listesi, `cons` fonksiyonunun rekürsif olarak çağrılmasıyla üretilir. Rekürsiyonun temel durumunu belirtmek için kullanılan kanonik isim `Nil`dir. Bunun, Bölüm 6'daki "null" veya "nil" kavramından farklı olduğuna dikkat edin; çünkü bu, geçersiz veya yok değeridir.

> **Not:** Cons listesi Rust'ta sık kullanılan bir veri yapısı değildir. Rust'ta bir dizi öğeye sahip olduğunuzda, çoğu zaman `Vec` daha iyi bir seçimdir. Diğer, daha karmaşık rekürsif veri türleri, çeşitli durumlarda faydalıdır, ancak bu bölümde cons listesiyle başlayarak, kutuların nasıl bir rekürsif veri türü tanımlamamıza izin verdiğini fazla dikkat dağıtmadan keşfedebiliriz.

Liste 15-2, bir cons listesi için bir enum tanımını içermektedir. Bu kodun henüz derlenmeyeceğini unutmayın, çünkü `List` türünün bilinen bir boyutu yoktur, bunu göstereceğiz.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-02/src/main.rs:here}}
```



> Not: Bu örnek için sadece `i32` değerlerini tutan bir cons listesi uyguluyoruz. Bu durumu, `Bölüm 10`da tartıştığımız gibi, herhangi bir türde değerler saklayabilen bir cons listesi türü tanımlamak için generikler kullanarak uygulayabilirdik.

`List` türünü `1, 2, 3` listesini saklamak için kullanmak Liste 15-3'teki kod gibi görünür:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-03/src/main.rs:here}}
```



İlk `Cons` değeri `1` ve bir başka `List` değeri tutar. Bu `List` değeri başka bir `Cons` değeridir ve `2` ve başka bir `List` değeri tutar. Bu `List` değeri bir tane daha `Cons` değeridir ve `3` ve sonunda `Nil`, listenin bitişini gösteren geçersiz örneği tutar.

Liste 15-3'teki kodu derlemeye çalıştığımızda, Liste 15-4'te gösterilen hatayı alırız:



```console
{{#include ../listings/ch15-smart-pointers/listing-15-03/output.txt}}
```



Hata, bu türün "sonsuz boyuta" sahip olduğunu göstermektedir. Bunun nedeni, `List`'i kendisinin bir başka değerini doğrudan tutan bir varyant içindeki rekürsif olarak tanımlamış olmamızdır. Sonuç olarak, Rust bir `List` değerini depolamak için ne kadar alan gerektiğini hesaplayamaz. Bu hatayı neden aldığımızı anlamak için önce, Rust'ın bir geçersiz türün ne kadar alan depolaması gerektiğini nasıl belirlediğine bakalım.

#### Geçersiz Türün Boyutunu Hesaplama

Bölüm 6'da enum tanımlarını tartıştığımız sırada Liste 6-2'de tanımladığımız `Message` enumunu hatırlayın:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-02/src/main.rs:here}}
```

Bir `Message` değerinin ne kadar alan tahsis etmesi gerektiğini belirlemek için Rust, her bir varyanta bakar ve hangisinin en fazla alana ihtiyaç duyduğunu görür. Rust, `Message::Quit`'in hiç alana ihtiyaç duymadığını, `Message::Move`'nin iki `i32` değerini saklamak için yeterli alana ihtiyaç duyduğunu görür ve bu şekilde devam eder. Yalnızca bir varyant kullanılacağından, bir `Message` değerinin ihtiyaç duyacağı en fazla alan, varyantlarının en büyüğünü depolamak için gereken alandır.

:::tip
Şimdi, Rust'ın Liste 15-2'deki `List` enumunun ihtiyaç duyduğu alan miktarını belirlemeye çalıştığında ne olduğunu karşılaştırın.
:::

Derleyici, `i32` türünde bir değeri ve bir `List` değerini tutan `Cons` varyantını inceleyerek başlar. Dolayısıyla, `Cons`, bir `i32`'nin boyutuna eşit miktarda alana ihtiyaç duyar, bunun yanı sıra bir `List` için gereken alanı tutar. `List` türünün ihtiyaç duyduğu bellek miktarını belirlemek için derleyici varyantlara bakar ve `Cons` varyantıyla başlar. `Cons` varyantı, bir `i32` türünde değer ve bir `List` türünde değer tutar ve bu süreç sonsuz olarak devam eder, Şekil 15-1'de gösterildiği gibi.

<img alt="Sonsuz bir Cons listesi" src="images/rust/img/trpl15-01.svg" class="center" style="width: 50%;" />

Şekil 15-1: Sonsuz `Cons` varyantlarından oluşan sonsuz bir `List`

#### Bilinen Boyutu Olan Rekürsif Tür Almak için `Box` Kullanma

Rust, rekürsif olarak tanımlanmış türler için ne kadar alan tahsis etmesi gerektiğini belirleyemediğinden, derleyici, bu yararlı öneri ile bir hata verir:

```text
help: insert some indirection (e.g., a `Box`, `Rc`, or `&`) to break the cycle
  |
2 |     Cons(i32, Box<List>),
  |               ++++    +
```

Bu öneride, "dolaylılık" demek, bir değeri doğrudan saklamak yerine, veri yapısını değiştirerek o değerin işaretçisini saklamamız gerektiğini belirtir.

Bir `Box` olduğu için Rust her zaman bir `Box`'nin ne kadar alan kapladığını bilir: bir işaretçinin boyutu, işaret ettiği veri miktarına bağlı olarak değişmez. Bu, `Cons` varyantı içinde doğrudan başka bir `List` değeri yerine bir `Box`'yi yerleştirebileceğimiz anlamına gelir. `Box`, yığında olacak bir sonraki `List` değerine işaret edecektir; böylece hâlâ diğeriyle birlikte listemiz vardır, ancak bu uygulama, öğeleri iç içe koymak yerine yan yana koymak gibidir.

Liste 15-2'deki `List` enumunun tanımını ve Liste 15-3'teki `List` kullanımını Liste 15-5'teki kod ile değiştirebiliriz, bu da derlenecektir:

` kullanan `List` tanımı">

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-05/src/main.rs}}
```



:::tip
`Cons` varyantı, bir `i32` ile kutunun işaretçi verisini depolamak için gereken alan boyutunun toplamına ihtiyaç duyar. `Nil` varyantı değer depolamaz, bu nedenle `Cons` varyantından daha az alana ihtiyaç duyar.
:::

Artık her `List` değerinin boyutunun, bir `i32` ile bir kutunun işaretçi veri boyutunun toplamı kadar olacağını biliyoruz. Bir kutu kullanarak, sonsuz rekürsif zinciri kırdık, böylece derleyici bir `List` değerini depolamak için ihtiyaç duyduğu boyutu belirleyebilir. Şekil 15-2, `Cons` varyantının artık nasıl göründüğünü göstermektedir.

<img alt="Sınırlı bir Cons listesi" src="images/rust/img/trpl15-02.svg" class="center" />

Şekil 15-2: `Cons` bir `Box` tuttuğu için sonsuz boyutta olmayan bir `List`

Kutular yalnızca dolaylılık ve yığın tahsisi sağlar; diğer akıllı işaretçi türlerinde göreceğimiz gibi herhangi bir başka özel yetenekleri yoktur. Aynı zamanda bu özel yeteneklerin neden olduğu performans maliyetine de sahip değillerdir. Bu nedenle, dolaylılığın tek özellik olduğu durumlarda, cons listesi gibi durumlarda kullanışlı olabilirler. Kutular için daha fazla kullanım senaryosunu da `Bölüm 18`de inceleyeceğiz.

:::info
`Box` türü, `Deref` trait'ini uyguladığı için akıllı bir işaretçidir; bu, `Box` değerlerinin referanslar gibi kullanılmasına olanak tanır.
:::

Bir `Box` değeri kapsam dışına çıktığında, kutunun işaret ettiği yığın verisi de `Drop` trait'inin uygulanması nedeniyle temizlenir. Bu iki trait, bu bölümdeki diğer akıllı işaretçi türlerinin sağladığı işlevsellik açısından daha da önemlidir. Bu iki trait'i daha ayrıntılı olarak keşfedelim.

[trait-objects]: ch18-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types