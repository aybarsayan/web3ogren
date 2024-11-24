## Yolları `use` Anahtar Kelimesi ile Kapsama Alma

Fonksiyonları çağırmak için yolları yazmak zahmetli ve tekrarlı gelebilir. Liste 7-7'de, **`add_to_waitlist`** fonksiyonuna mutlak veya göreceli yol seçmemize bakılmaksızın, **`add_to_waitlist`**'i her çağırmak istediğimizde `front_of_house` ve `hosting`'i de belirtmek zorunda kaldık. Neyse ki, bu süreci basitleştirmenin bir yolu var: `use` anahtar kelimesi ile bir yol için bir kısayol oluşturabiliriz ve ardından o kısayolu kapsam içinde her yerde kullanabiliriz.

:::info
`use` anahtar kelimesi, modüller arasındaki yolu kısaltarak daha okunabilir ve yönetilebilir hale getirir.
:::

Liste 7-11'de, **`crate::front_of_house::hosting`** modülünü `eat_at_restaurant` fonksiyonunun kapsamına alıyoruz, böylece **`add_to_waitlist`** fonksiyonunu çağırmak için sadece **`hosting::add_to_waitlist`** belirtmemiz yeterli oluyor.



```rust,noplayground,test_harness
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-11/src/lib.rs}}
```



Kapsama `use` ve bir yol eklemek, dosya sisteminde sembolik bir bağlantı oluşturmaya benzer. `crate` köküne **`use crate::front_of_house::hosting`** ekleyerek, `hosting` artık o kapsamda geçerli bir ad haline gelir, sanki **`hosting`** modülü crate kökünde tanımlanmış gibi. `use` ile kapsama alınan yollar gizlilik denetiminden geçer, diğer yollar gibi.

> **Not:** `use` anahtar kelimesinin yalnızca bulunduğu belirli kapsamda kısayol oluşturduğunu unutmayın. Liste 7-12, **`eat_at_restaurant`** fonksiyonunu `customer` adlı yeni bir alt modüle taşır, bu da `use` ifadesinden farklı bir kapsamdır, bu nedenle işlev gövdesi derlenmeyecektir.



```rust,noplayground,test_harness,does_not_compile,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-12/src/lib.rs}}
```



Derleyici hatası, kısayolun artık `customer` modülünde geçerli olmadığını göstermektedir:

```console
{{#include ../listings/ch07-managing-growing-projects/listing-07-12/output.txt}}
```

Ayrıca `use` ifadesinin artık bu kapsamda kullanılmadığına dair bir uyarı da var! Bu sorunu düzeltmek için `use` ifadesini `customer` modülü içinde de taşıyabilir veya alt `customer` modülündeki üst modülde kısayolu **`super::hosting`** ile referans verebilirsiniz.

---

### İdiomatik `use` Yolları Oluşturma

Liste 7-11'de, neden **`use crate::front_of_house::hosting`** belirttiğimizi ve ardından **`eat_at_restaurant`**'da **`hosting::add_to_waitlist`** çağırdığımızı merak etmiş olabilirsiniz. Aynı sonucu elde etmek için `use` yolunu **`add_to_waitlist`** fonksiyonuna kadar tamamen belirtseydik, Liste 7-13'te olduğu gibi olurdu.



```rust,noplayground,test_harness
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-13/src/lib.rs}}
```



Her iki Liste 7-11 ve Liste 7-13 aynı görevi yerine getiriyor olsa da, Liste 7-11 `use` ile bir fonksiyonu kapsama almanın idiomatik yoludur. Fonksiyonun üst modülünü kapsama almak, fonksiyonu çağırırken üst modülü belirtmemiz gerektiği anlamına gelir. Fonksiyonu çağırırken üst modülü belirtmek, fonksiyonun yerel olarak tanımlanmadığını açıkça belirtirken, tam yolun tekrarını da azaltır. Liste 7-13'teki kod, **`add_to_waitlist`**'in nerede tanımlandığı konusunda belirsizdir.

Diğer yandan, `use` ile yapıların, enumların ve diğer öğelerin kapsama alınması söz konusu olduğunda, tam yol belirtmek ideomatik bir yaklaşımdır. Liste 7-14, standart kütüphanenin **`HashMap`** yapısını bir ikili crate kapsamına almanın ideomatik yolunu göstermektedir.



```rust
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-14/src/main.rs}}
```



Bu ideomun arkasında güçlü bir neden yoktur: bu, ortaya çıkan bir gelenektir ve insanlar Rust kodunu bu şekilde okumaya ve yazmaya alışmıştır.

:::warning
Bu ideomun istisnası, `use` ifadeleri ile aynı isimde iki öğeyi kapsama almak olduğunda geçerlidir; çünkü Rust bunu kabul etmez.
:::

Liste 7-15, aynı isme ancak farklı üst modüllere sahip olan iki **`Result`** tipini kapsama almanın ve bunlara nasıl atıfta bulunmanın yolunu göstermektedir.



```rust,noplayground
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-15/src/lib.rs:here}}
```



Gördüğünüz gibi, üst modülleri kullanmak iki **`Result`** tipini ayırır. Bunun yerine **`use std::fmt::Result`** ve **`use std::io::Result`** belirtseniz, aynı kapsamda iki **`Result`** tipi olurdu ve Rust hangi **`Result`**'ı kastettiğimizi bilemezdi.

---

### `as` Anahtar Kelimesi ile Yeni İsimler Sağlama

`use` ile aynı isimde iki türü aynı kapsama almak için başka bir çözüm vardır: yolun ardından **`as`** belirtebiliriz ve tür için yeni bir yerel ad veya *takma ad* belirtebiliriz. Liste 7-16, Liste 7-15'teki kodu yazmanın başka bir yolunu göstermektedir; **`as`** kullanarak iki **`Result`** tipinden birinin adını değiştiriyoruz.



```rust,noplayground
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-16/src/lib.rs:here}}
```



İkinci `use` ifadesinde, **`std::io::Result`** türü için yeni ad olarak **`IoResult`** seçtik. Bu, kapsama aldığımız **`std::fmt`**'ten gelen **`Result`** ile çakışmayacaktır. Liste 7-15 ve Liste 7-16 ideomatik olarak kabul edilir, bu nedenle seçim size kalmıştır!

---

### `pub use` ile İsimleri Yeniden İhracat Etme

`use` anahtar kelimesi ile bir ismi kapsama aldığımızda, yeni kapsamda mevcut olan isim özel olur. Kodumuzun çağıranlarının o isme, sanki o kodun kapsamına tanımlanmış gibi atıfta bulunabilmesini sağlamak için **`pub`** ve **`use`**'yi birleştirebiliriz. Bu teknik *yeniden ihracat etme* olarak adlandırılır; çünkü hem bir öğeyi kapsam içine alıyoruz hem de o öğeyi başkalarının kendi kapsamlarına almaları için kullanılabilir hale getiriyoruz.

Liste 7-17, Liste 7-11'deki kodu kök modülündeki **`use`** ifadesini **`pub use`** olarak değiştirilmiş bir şekilde göstermektedir.



```rust,noplayground,test_harness
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-17/src/lib.rs}}
```



Bu değişiklikten önce, dış kod **`add_to_waitlist`** fonksiyonunu **`restaurant::front_of_house::hosting::add_to_waitlist()`** yolunu kullanarak çağırmak zorundaydı; bu da **`front_of_house`** modülünün **`pub`** olarak işaretlenmesini gerektiriyordu. Artık bu **`pub use`**, **`hosting`** modülünü kök modülden yeniden ihracat ettiğinden, dış kod **`restaurant::hosting::add_to_waitlist()`** yolunu kullanabilir.

:::note
Yeniden ihracat etme, kodunuzun iç yapısının, kodunuzu çağıran programcıların düşünme şekli ile farklı olduğu durumlarda yararlıdır.
:::

Örneğin, bu restoran metaforunda, restoranı yöneten insanlar "ön taraf" ve "arka taraf" üzerine düşünürler. Ancak bir restorana giden müşteriler, restoranın bölümlerini o terimlerle düşünmeyeceklerdir. **`pub use`** ile, kodumuzu bir yapı ile yazabilir ancak farklı bir yapıyı açığa çıkarabiliriz. Bu, kütüphanemizin, kütüphane üzerinde çalışan programcılar ve kütüphaneyi çağıran programcılar için iyi yapılandırılmasını sağlar. **`pub use`** ile birlikte crate'nin belgelerini nasıl etkilediğine dair başka bir örneği de 14. Bölümde [“Kolay Kullanılabilir Bir Kamu API'si İhracı”][ch14-pub-use] kısmında göreceğiz.

---

### Harici Paketleri Kullanma

Bölüm 2'de, rastgele sayılar elde etmek için **`rand`** adlı harici bir paketi kullanan bir tahmin oyunu projesi yazdık. Projelerimizde **`rand`**'i kullanmak için *Cargo.toml* dosyasına bu satırı ekledik:





```toml
{{#include ../listings/ch02-guessing-game-tutorial/listing-02-02/Cargo.toml:9:}}
```



*Cargo.toml* dosyasına **`rand`** bağımlılığı eklemek, Cargo'ya **`rand`** paketini ve herhangi bir bağımlılığını [crates.io](https://crates.io/) üzerinden indirmesini ve **`rand`**'in projemize ulaşılabilir olmasını sağlar.

Daha sonra **`rand`** tanımlarını paketimizin kapsamına almak için, crate'nin adı olan **`rand`** ile başlayan bir **`use`** satırı ekledik ve kapsama almak istediğimiz öğeleri sıraladık. Hatırlayın ki, 2. Bölümdeki [“Rastgele Bir Sayı Üretme”][rand] bölümünde, **`Rng`** trait'ini kapsama almış ve **`rand::thread_rng`** fonksiyonunu çağırmıştık:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-03/src/main.rs:ch07-04}}
```

Rust topluluğu birçok paketi [crates.io](https://crates.io/) üzerinden kullanılabilir hâle getirmiştir ve bunlardan herhangi birini paketinize almak bu aynı adımları içerir: bunları paketin *Cargo.toml* dosyasında sıralamak ve **`use`** ile paketlerinden öğeleri kapsama almak.

Standart **`std`** kütüphanesinin de paketimiz için harici bir crate olduğunu belirtmek gerekir. Standart kütüphane Rust dili ile birlikte geldiği için, **`std`**'yi *Cargo.toml* dosyasına eklememize gerek yoktur. Ancak oradan öğeleri paketimizin kapsamına almak için **`use`** ile ona atıfta bulunmamız gerekir. Örneğin, **`HashMap`** için bu satırı kullanırız:

```rust
use std::collections::HashMap;
```

Bu, **`std`** ile başlayan bir mutlak yoldur; bu standart kütüphane crate'inin adıdır.

---

### Büyük `use` Listelerini Temizlemek İçin İç İçe Yolları Kullanma

Aynı crate veya aynı modül içinde tanımlanan birden fazla öğeyi kullanıyorsak, her öğeyi ayrı bir satırda listelemek dosyalarımızda çok fazla dikey alana yayılabilir. Örneğin, Liste 2-4'te tahmin oyununda yer alan bu iki **`use`** ifadesi **`std`**'den öğeleri kapsamına alıyor:



```rust,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/no-listing-01-use-std-unnested/src/main.rs:here}}
```



Bunun yerine, aynı öğeleri tek bir satırda kapsama almak için iç içe yollar kullanabiliriz. Bunu yapmak için, yolun ortak kısmını belirtir, ardından iki çift iki nokta ve ardından yolların farklı olduğu parçalardan oluşan bir listeyi süslü parantez içine alırız; bu, Liste 7-18'de gösterilmiştir.



```rust,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-18/src/main.rs:here}}
```



Büyük programlarda, aynı crate veya modülden birçok öğeyi kapsama almak için iç içe yollar kullanmak, gereken ayrı **`use`** ifadelerinin sayısını büyük ölçüde azaltabilir!

Bir yolun herhangi bir seviyesinde iç içe bir yolu kullanabiliriz; bu, alt yolun paylaşıldığı iki **`use`** ifadesini birleştirirken yararlıdır. Örneğin, Liste 7-19, **`std::io`**'yu kapsama alan bir **`use`** ifadesi ve **`std::io::Write`**'i kapsama alan bir **`use`** ifadesi göstermektedir.



```rust,noplayground
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-19/src/lib.rs}}
```



Bu iki yolun ortak kısmı **`std::io`**'dur ve bu, tamamlanan ilk yoldur. Bu iki yolu tek bir **`use`** ifadesinde birleştirmek için, iç içe yolda **`self`** kullanabiliriz; bu, Liste 7-20'de gösterilmiştir.



```rust,noplayground
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-20/src/lib.rs}}
```



Bu satır, **`std::io`** ve **`std::io::Write`**'i kapsama alır.

### Glob Operatörü

Bir yolda tanımlanan *tüm* genel öğeleri kapsama almak istiyorsak, o yolun ardından **`*`** glob operatörünü belirtebiliriz:

```rust
use std::collections::*;
```

Bu **`use`** ifadesi, **`std::collections`** içinde tanımlanan tüm genel öğeleri mevcut kapsamda kapsama alır. Glob operatörünü kullanırken dikkatli olun! Glob, hangi isimlerin kapsamda olduğunu ve programınızdaki bir ismin nerede tanımlandığını anlamayı zorlaştırabilir.

Glob operatörü, genellikle tüm test altını **`tests`** modülüne almak için test yaparken kullanılır; bunu [“Test Nasıl Yazılır”][writing-tests] bölümünde 11. Bölümde tartışacağız. Glob operatörü bazen prelude deseninin bir parçası olarak da kullanılır: bu desen hakkında daha fazla bilgi için `standart kütüphane belgelere` bakabilirsiniz.

[ch14-pub-use]: ch14-02-publishing-to-crates-io.html#exporting-a-convenient-public-api-with-pub-use
[rand]: ch02-00-guessing-game-tutorial.html#generating-a-random-number
[writing-tests]: ch11-01-writing-tests.html#how-to-write-tests