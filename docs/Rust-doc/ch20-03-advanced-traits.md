## İleri Düzey Özellikler

Özellikleri ilk olarak [“Özellikler: Paylaşılan Davranışı Tanımlama”][traits-defining-shared-behavior] bölümünde ele almıştık, ancak daha ileri düzey detaylara değinmedik. Rust hakkında daha fazla bilgi edindiğinize göre, ayrıntılara girebiliriz.

### Bir Trait Tanımında Yer Tutucu Türleri Belirlemek için İlişkili Türler

*İlişkili türler*, bir tür yer tutucuyu bir trait ile bağlayarak trait metod tanımlarının bu yer tutucu türlerini imza olarak kullanmasına izin verir. Bir trait'in uygulayıcısı, belirli bir uygulama için yer tutucu tür yerine kullanılacak somut türü belirleyecektir. Bu şekilde, belirli türlerin ne olduğunu bilmeden bazı türleri kullanan bir trait tanımlayabiliriz, ta ki trait uygulanana kadar.

:::note
Bu bölümdeki çoğu ileri düzey özellik nadiren ihtiyaç duyulacak şekilde tanımlanmıştır. İlişkili türler ise ortada bir yerdedir: diğer bölümlerde açıklanan özelliklerden daha nadir kullanılsa da bu bölümde tartışılan birçok özellikten daha yaygın olarak kullanılmaktadır.
:::

İlişkili bir tür içeren bir trait örneği, standart kütüphanenin sağladığı `Iterator` traitidir. İlişkili tür `Item` olarak adlandırılmıştır ve `Iterator` traitini uygulayan türün üzerinde yinelediği değerlerin türünü temsil eder. `Iterator` traitinin tanımı Şekil 20-12'de gösterilmiştir.



```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-12/src/lib.rs}}
```



`Item` türü bir yer tutucudur ve `next` metodunun tanımı, `Option` türünde değerler döndüreceğini gösterir. `Iterator` traitinin uygulayıcıları, `Item` için somut türü belirleyeceklerdir ve `next` metodu, o somut türdeki bir değeri içeren bir `Option` döndürecektir.

:::warning
İlişkili türler, generics ile benzer bir kavram gibi görünebilir, çünkü generics, bir işlevi hangi türlerin işleyebileceğini belirtmeden tanımlamamıza izin verir.
:::

İki kavram arasındaki farkı incelemek için, `Item` türünün `u32` olarak belirlendiği `Counter` adlı bir tür üzerinde `Iterator` traitinin bir uygulamasına bakalım:



```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-22-iterator-on-counter/src/lib.rs:ch19}}
```



Bu sözdizimi, generics ile karşılaştırılabilir gibi görünmektedir. Peki neden `Iterator` traitini Listing 20-13'te gösterildiği gibi generics ile tanımlamıyoruz?



```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-13/src/lib.rs}}
```



Fark, Listing 20-13'te olduğu gibi generics kullanıldığında, her bir uygulamada türleri belirtmemiz gerektiğidir; çünkü `Counter` için `Iterator` uygulayabiliriz veya başka herhangi bir tür için de. Başka bir deyişle, bir trait içinde bir genel parametre olduğu zaman, bu trait bir tür için birden fazla kez uygulanabilir ve her seferinde genel tür parametrelerinin somut türlerini değiştirebiliriz. `Counter` üzerinde `next` metodunu kullandığımızda, hangi `Iterator` uygulamasını kullanmamız gerektiğini belirtmek için tür açıklamaları sağlamamız gerekir.

:::tip
İlişkili türleri kullandığımızda, türleri belirtmemize gerek yoktur çünkü bir trait'i bir tür üzerinde birden fazla kez uygulayamayız.
:::

İlişkili türleri kullanan tanımda Listing 20-12'de, yalnızca `Item` türünün ne olacağını bir kez seçebiliriz, çünkü yalnızca bir `impl Iterator for Counter` olabilir. `Counter` üzerinde `next` çağrısında bulunduğumuz her yerde `u32` değerlerini içeren bir iterator istediğimizi belirtmemiz gerekmez.

İlişkili türler aynı zamanda trait'in sözleşmesinin bir parçası haline gelir: trait'in uygulayıcıları, ilişkili tür yer tutucusu için bir tür sağlamak zorundadır. İlişkili türlerin genellikle türün nasıl kullanılacağını tanımlayan bir adı vardır ve API dökümantasyonunda ilişkili türleri belgelerken iyi bir uygulama olarak kabul edilir.

### Varsayılan Genel Tür Parametreleri ve Operatör Aşırı Yükleme

Genel tür parametrelerini kullandığımızda, genel tür için bir varsayılan somut tür belirleyebiliriz. Bu, trait'in uygulayıcılarının varsayılan tür işe yarıyorsa somut bir tür belirtmelerine ihtiyaç duymadan geçerlidir. Genel bir tür tanımlarken `` sözdizimini kullanarak varsayılan bir tür belirtirsiniz.

:::info
Bu tekniğin faydalı olduğu harika bir örnek, belirli durumlarda bir operatörün (örneğin `+`) davranışını özelleştirdiğiniz *operatör aşırı yüklemesidir*.
:::

Rust, kendi operatörlerinizi oluşturmanıza veya keyfi operatörleri aşırı yüklemenize izin vermez. Ancak, operatörle ilişkili trait'leri uygulayarak `std::ops` içinde listelenen işlemleri ve ilgili trait'leri aşırı yükleyebilirsiniz. Örneğin, Listing 20-14'te iki `Point` instance'ını toplamak için `+` operatörünü aşırı yüklüyoruz. Bunu, `Point` yapısı üzerinde `Add` trait'ini uygulayarak yapıyoruz:



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-14/src/main.rs}}
```



`add` metodu, iki `Point` instance'ının `x` değerlerini ve iki `Point` instance'ının `y` değerlerini toplar ve yeni bir `Point` oluşturur. `Add` trait'inin `add` metodundan döndürülen türü belirleyen bir ilişkili tür olan `Output` isimli bir ilişkili türü vardır.

:::note
Bu koddaki varsayılan genel tür, `Add` trait'inin içindedir. İşte tanımı:
```rust
trait Add<Rhs=Self> {
    type Output;

    fn add(self, rhs: Rhs) -> Self::Output;
}
```
:::

Bu kod genel olarak tanıdık görünmelidir: bir metodu ve bir ilişkili türü olan bir trait. Yeni olan kısım, `Rhs=Self`: bu sözdizimi *varsayılan tür parametreleri* olarak adlandırılır. `Rhs` genel tür parametresi (sağ tarafı temsil eder) `add` metodundaki `rhs` parametresinin türünü tanımlar. `Add` trait'ini uyguladığımızda `Rhs` için bir somut tür belirtmezsek, `Rhs` türü varsayılan olarak `Self` olur ki bu da `Add` uyguladığımız tür olacaktır.

`Add`'i `Point` için uyguladığımızda, iki `Point` instance'ını toplamak istediğimiz için `Rhs` için varsayılanı kullandık. Varsayılanı kullanmadan, `Rhs` türünü özelleştirmek istediğimiz bir `Add` trait'i uygulaması örneğine bakalım.

İki yapımız var: `Millimeters` ve `Meters`, farklı birimlerde değerler tutmaktadır. Mevcut bir türü başka bir yapı içinde ince sarma, *newtype pattern* olarak bilinir ve bu konuda daha fazla bilgiyi [“Dış Türler Üzerinde Dış Trait'leri Uygulamak için Yeni Tür Desenini Kullanma”][newtype] bölümünde bulabilirsiniz. Millimetre cinsinden değerleri metre cinsinden değerlere eklemek ve `Add` uygulamasının doğru dönüşümü yapmasını sağlamak istiyoruz. `Millimeters` için `Rhs` olarak `Meters` ile `Add`'i uygulayabiliriz, bu Listing 20-15'te gösterilmiştir.



```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-15/src/lib.rs}}
```



`Millimeters` ve `Meters`'i toplamak için varsayılan `Self` yerine `Rhs` tür parametresinin değerini belirtmek için `impl Add` yazıyoruz.

Varsayılan tür parametrelerini iki ana şekilde kullanacaksınız:

* Mevcut kodu bozmadan bir türü genişletmek için
* Çoğu kullanıcının ihtiyaç duymayacağı belirli durumlarda özelleştirme sağlamaya izin vermek için

:::info
Standart kütüphanedeki `Add` trait'i ikinci amaç için bir örnektir: genellikle iki benzer türü toplarsınız, ancak `Add` trait'i bunun ötesinde özelleştirme sağlama yeteneği sunar. `Add` trait tanımında varsayılan bir tür parametresi kullanarak, ekstra parametreyi çoğu zaman belirtmenize gerek kalmaz.
:::

Diğer bir deyişle, biraz uygulama şablonuna ihtiyaç olmadığında trait'i kullanmak daha kolay hale gelir.

İlk amaç ikinci amaçla benzer ancak tersidir: var olan bir trait'e bir tür parametresi eklemek istiyorsanız, onu mevcut uygulama kodunu bozmadan trait'in işlevselliğini genişletmek için varsayılan bir tür verebilirsiniz.

### Aynı İsimli Metotları Çağırmada Tam Nitelikli Söz Dizimi ile Belirsizlik Giderme

Rust'ta bir trait'in başka bir trait'in metodu ile aynı isme sahip olmasını önleyen hiçbir şey yoktur, ayrıca Rust, aynı tür üzerinde her iki trait'i de uygulamanıza da engel olmaz. Ayrıca, özelliklerden, aynı isimli bir metodu doğrudan tür üzerinde uygulamak da mümkündür.

Aynı isimli metotları çağırırken, hangi metodu kullanmak istediğinizi Rust'a söylemeniz gerekecek. Listing 20-16'daki kodu düşünün; burada hem `Pilot` hem de `Wizard` adında iki trait tanımladık ve her ikisi de `fly` adlı bir metoda sahiptir. Ardından, zaten `fly` adında bir metodu olan `Human` türü üzerinde her iki trait'i de uyguluyoruz. Her `fly` metodu farklı bir şey yapar.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-16/src/main.rs:here}}
```



`Human` instance'ı üzerinde `fly` çağrısı yaptığımızda, derleyici, Listing 20-17'de gösterildiği gibi, türde doğrudan uygulanmış olan metodu çağırmayı varsayılan olarak alır.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-17/src/main.rs:here}}
```



Bu kodu çalıştırmak, `*arms furiously waving*` olarak gösteren bir çıktı verir; bu, Rust'ın `Human` üzerinde doğrudan uygulanmış olan `fly` metodunu çağırdığını gösterir.

`Pilot` trait'inin veya `Wizard` trait'inin `fly` metodunu çağırmak için, hangi `fly` metodunu kastettiğimizi belirtmek için daha açık bir sözdizimi kullanmamız gerekir. Listing 20-18 bu sözdizimini göstermektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-18/src/main.rs:here}}
```



Metod adı öncesinde trait adını belirtmek, Rust'a hangi `fly` uygulamasını çağırmak istediğimizi netleştirir. Ayrıca `Human::fly(&person)` yazabiliriz ki bu, Listing 20-18'de kullandığımız `person.fly()` ile eşdeğerdir, ancak bu, belirsizliği gidermemiz gerekmiyorsa yazılması daha uzun bir yol olacaktır.

Bu kodu çalıştırmak aşağıdaki çıktıyı verir:

```console
{{#include ../listings/ch20-advanced-features/listing-20-18/output.txt}}
```

`fly` metodu bir `self` parametresi aldığından, eğer iki *tür* varsa ve her biri bir *trait* uygularsa, Rust, hangi trait uygulamasını kullanacağını `self` türüne dayalı olarak belirleyebilir.

Bununla birlikte, metod olmayan ilişkili fonksiyonların `self` parametresi yoktur. Birden fazla tür veya trait bulunduğunda, aynı fonksiyon ismine sahip olan metod olmayan fonksiyonlar tanımlandığında, Rust hangi tür anlamını bilmeden bunu çözemez, aksi takdirde *tam nitelikli sözdizimi* kullanmanız gerekir. Örneğin, Listing 20-19'da, bir hayvan barınağı için tüm yavru köpeklere *Spot* adını vermek isteyen bir trait oluşturuyoruz. `baby_name` adlı ilişkili bir fonksiyon içeren bir `Animal` trait'i oluşturuyoruz. `Animal` trait'i, `Dog` yapısı için uygulanmış olup, burada doğrudan `baby_name` adlı bir ilişkili fonksiyon sağlıyoruz.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-19/src/main.rs}}
```



Tüm köpek yavrularını Spot olarak adlandırmak için `Dog` üzerinde tanımlanan `baby_name` ilişkili fonksiyonunu kodlarız. `Dog` türü ayrıca, tüm hayvanların sahip olduğu özellikleri açıklayan `Animal` trait'ini de uygular. Yavru köpeklere köpek yavrusu denir ve bu, `Animal` trait'in `Dog` üzerindeki `baby_name` fonksiyonunda ifade edilmiştir.

`main` içinde, doğrudan `Dog::baby_name` fonksiyonunu çağırıyoruz ve bu doğrudan `Dog` üzerinde tanımlanan ilişkili fonksiyonu çağırır. Bu kod, aşağıdaki çıktıyı verir:

```console
{{#include ../listings/ch20-advanced-features/listing-20-19/output.txt}}
```

Bu çıktı istediğimiz gibi değil. `Dog` üzerinde uyguladığımız `Animal` trait'inin bir parçası olan `baby_name` fonksiyonunu çağırmak istiyoruz, böylece kod `A baby dog is called a puppy` yazdırmalı. Listing 20-18'de kullandığımız trait adını belirtme tekniği burada işe yaramaz; eğer `main` kodunu Listing 20-20'deki koda değiştirirsek, derleme hatası alırız.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-20/src/main.rs:here}}
```



`Animal::baby_name`'ın bir `self` parametresi olmadığı ve `Animal` trait'ini uygulayan başka türler olabileceğinden, Rust hangi `Animal::baby_name` uygulamasını istediğimizi bilemez. Bu derleme hatasını alacağız:

```console
{{#include ../listings/ch20-advanced-features/listing-20-20/output.txt}}
```

:::danger
Tam açıklık sağlamak ve Rust'a, `Dog` için uygulanan `Animal`'ın implementasyonunu kullanmak istediğimizi söylemek için tam nitelikli sözdizimini kullanmalıyız.
:::

Listing 20-21, tam nitelikli sözdiziminin nasıl kullanılacağını gösterir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-21/src/main.rs:here}}
```



Rust'a, açılı parantez içindeki tür belirten bir tür annotasyonu sağlıyoruz; bu, `Dog` türünü bu fonksiyon çağrısı için `Animal` olarak ele almak istediğimizi belirtir. Bu kod artık istediğimiz verimi verir:

```console
{{#include ../listings/ch20-advanced-features/listing-20-21/output.txt}}
```

Genel olarak, tam nitelikli söz dizimi şu şekilde tanımlanır:

```rust,ignore
<Type as Trait>::function(receiver_if_method, next_arg, ...);
```

Metod olmayan ilişkili fonksiyonlar için bir `receiver` olmayacaktır; sadece diğer argümanların listesi olacaktır. Fonksiyonları veya metodları çağırdığınız her yerde tam nitelikli sözdizimini kullanabilirsiniz. Ancak, Rust'ın programda diğer bilgilerden çıkarabileceği bu söz diziminin herhangi bir kısmını atlamakta serbestsiniz. Bu daha ayrıntılı sözdizimini yalnızca aynı ada sahip birden fazla implementasyon bulunduğunda ve Rust, hangi implementasyonu çağırmak istediğinizi belirlemekte zorlandığında kullanmanız gerekir.

### Bir Trait İçinde Diğer Trait'in İşlevselliğini Gerektirmek için Üst Trait'lerin Kullanımı

Bazen, başka bir trait'e bağımlı bir trait tanımı yazabilirsiniz: bir türün ilk trait'i uygulaması için, bu türün aynı zamanda ikinci trait'i de uygulamasını istemek isteyebilirsiniz. Bunun nedeni, trait tanımınızın ikinci trait'in ilişkili öğelerini kullanabilmesi için gereklidir. Söz konusu trait'e, trait'inizin *üst trait'i* denir.

Örneğin, bir `OutlinePrint` trait'i tanımlamak istiyoruz; `outline_print` metodu, verilen bir değeri, yıldızlarla çerçevelenmiş şekilde yazdıracaktır. Yani `Display` standart kütüphane trait'ini uygulayan bir `Point` yapısı için `1` için `x` ve `3` için `y` olan bir `Point` instance'ı üzerinde `outline_print` çağırdığımızda, aşağıdaki gibi yazmalıdır:

```text
**********
*        *
* (1, 3) *
*        *
**********
```

`outline_print` metodunu uygulamanın içinde, `Display` trait'inin işlevselliğinden yararlanmak istiyoruz. Bu nedenle, `OutlinePrint` trait'inin yalnızca `Display`'i de uygulayan türler için çalışacağını belirtmeliyiz ve `OutlinePrint`'in ihtiyaç duyduğu işlevselliği sağlamalıyız. Bunu trait tanımında `OutlinePrint: Display` belirterek yapabiliriz. Bu teknik, trait'e bir trait bağı eklemeye benzer. Listing 20-22, `OutlinePrint` trait'inin uygulanmasını göstermektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-22/src/main.rs:here}}
```



`OutlinePrint`'in `Display` trait'ine ihtiyaç duyduğunu belirttiğimiz için, `Display`'i uygulayan her tür için otomatik olarak uygulanmış olan `to_string` fonksiyonunu kullanabiliriz. Trait adından sonra iki noktalı bir işaret eklemeden önce `to_string` fonksiyonunu kullanmaya çalışırsak, `to_string` metodunun mevcut kapsamda `&Self` için bulunmadığına dair bir hatayla karşılaşırız.

:::warning
`OutlinePrint`'i `Display`'i uygulamayan bir türde, örneğin `Point` yapısında uygulamaya çalıştığımızda hata alırız.
:::



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-02-impl-outlineprint-for-point/src/main.rs:here}}
```



`Display`'in gerekli ama uygulanmadığına dair bir hata alırız:

```console
{{#include ../listings/ch20-advanced-features/no-listing-02-impl-outlineprint-for-point/output.txt}}
```

Bunu düzeltmek için `Point` üzerinde `Display`'i uygulayıp `OutlinePrint`'in gerektirdiği kısıtlamayı karşılayabiliriz:



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-03-impl-display-for-point/src/main.rs:here}}
```



Sonra, `Point` üzerinde `OutlinePrint` trait'ini uygulamak başarılı bir şekilde derlenecek ve bir `Point` instance'ı üzerinde `outline_print` çağrısı yaparak onu yıldızların etrafında bir çerçeve içinde görüntüleyebiliriz.

### Yeni Tip Deseni Kullanarak Dış Tipler Üzerine Dış Özelliklerin Uygulanması

Bölüm 10'da [“Bir Özelliği Bir Tür Üzerine Uygulama”][implementing-a-trait-on-a-type] kısmında, bir özelliği bir tür üzerine uygulamanın yalnızca özelliğin veya türün kendi kütüphanemize (crate) ait olması durumunda mümkün olduğunu belirten yetim kuralından bahsettik. Bu kısıtlamayı aşmak için ***yeni tip deseni*** kullanmak mümkündür; bu, bir tuple yapısında yeni bir tür oluşturmayı içerir. (Tuple yapıları, Bölüm 5'teki [“İsimsiz Alanlar Olmadan Farklı Türler Oluşturmak İçin Tuple Yapılarını Kullanma”][tuple-structs] bölümünde ele alınmıştır.) 

:::info
Tuple yapısı bir alan içerecek ve uygulamak istediğimiz türün etrafında ince bir sarmalayıcı olacaktır. Böylece sarmalayıcı tür, kütüphanemize ait hale gelir ve bu sarmalayıcı üzerinde özelliği uygulayabiliriz.
:::

Yeni tip terimi, Haskell programlama dilinden gelmektedir. Bu desenin kullanılması için bir çalışma zamanı performans cezası yoktur ve sarmalayıcı tür derleme zamanında göz ardı edilir.

Örneğin, `Display`'i `Vec` üzerine uygulamak istediğimizi varsayalım; bu, yetim kuralı nedeniyle doğrudan yapmamıza izin vermez çünkü `Display` özelliği ve `Vec` türü kütüphanemiz dışında tanımlanmıştır. 

:::tip
`Vec` örneğini tutan bir `Wrapper` yapısı oluşturabiliriz; ardından `Wrapper` üzerinde `Display` uygulayabilir ve `Vec` değerini kullanabiliriz.
:::

Bu durum **List 20-23**'te gösterilmiştir.

` etrafında bir `Wrapper` türü oluşturma">

```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-23/src/main.rs}}
```



`Display` uygulaması `self.0` kullanarak içteki `Vec`'ye erişir çünkü `Wrapper` bir tuple yapısıdır ve `Vec` tuple içindeki 0. indeksteki öğedir. Ardından `Wrapper` üzerinde `Display` özelliğinin işlevselliğini kullanabiliriz.

Bu tekniği kullanmanın dezavantajı, `Wrapper`'ın yeni bir tür olmasıdır, bu nedenle tuttuğu değerin yöntemlerine sahip değildir. `Wrapper` üzerinde `Vec`'nin tüm yöntemlerini doğrudan uygulamamız gerekir; böylece bu yöntemler `self.0`'ya yönlendirilecektir, bu da bize `Wrapper`'ı tam olarak bir `Vec` gibi davranmasını sağlayacaktır. 

:::warning
Eğer yeni türün iç türün sahip olduğu her yönteme sahip olmasını istiyorsak, `Wrapper` üzerinde iç türü döndüren `Deref` özelliğini (Bölüm 15'te [“Akıllı İşaretçileri Normal Referanslar Gibi Ele Alma `Deref` Özelliği”][smart-pointer-deref] bölümünde tartışılmıştır) uygulamak bir çözüm olacaktır.
:::

Eğer `Wrapper` türünün iç türün tüm yöntemlerine sahip olmasını istemiyorsak—örneğin, `Wrapper` türünün davranışını sınırlamak için—yalnızca istediğimiz yöntemleri manuel olarak uygulamak zorunda kalırız.

Bu yeni tip deseni, özelliklerle ilgili olmasa bile faydalıdır. Şimdi odaklanmayı değiştirip Rust'ın tip sistemiyle etkileşimde bulunmanın bazı gelişmiş yollarına bakalım.

---

[newtype]: ch20-03-advanced-traits.html#using-the-newtype-pattern-to-implement-external-traits-on-external-types  
[implementing-a-trait-on-a-type]:  
ch10-02-traits.html#implementing-a-trait-on-a-type  
[traits-defining-shared-behavior]:  
ch10-02-traits.html#traits-defining-shared-behavior  
[smart-pointer-deref]:  
ch15-02-deref.html#treating-smart-pointers-like-regular-references-with-the-deref-trait  
[tuple-structs]:  
ch05-01-defining-structs.html#using-tuple-structs-without-named-fields-to-create-different-types  