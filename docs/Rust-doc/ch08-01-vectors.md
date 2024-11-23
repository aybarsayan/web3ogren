## Değer Listelerini Vektörlerle Saklamak

İlk inceleyeceğimiz koleksiyon türü `Vec`, aynı zamanda *vektör* olarak da bilinir. Vektörler, bir veri yapısında birden fazla değeri yan yana bellek içinde saklamanıza olanak tanır. Vektörler sadece aynı tipteki değerleri saklayabilir. Metinde bir dosyadaki metin satırları veya bir alışveriş sepetindeki ürünlerin fiyatları gibi bir listeye sahip olduğunuzda yararlıdırlar.

### Yeni Bir Vektör Oluşturma

Yeni bir boş vektör oluşturmak için `Vec::new` fonksiyonunu çağırırız; bu, Liste 8-1'de gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-01/src/main.rs:here}}
```



Burada bir tür notasyonu eklediğimizi unutmayın. Bu vektöre herhangi bir değer eklemediğimiz için Rust, hangi tür öğeleri saklayacağımızı bilmez. **Bu önemli bir noktadır.** Vektörler jenerikler kullanılarak uygulanmıştır; kendi türlerinizle jenerikleri nasıl kullanacağınızı Bölüm 10'da ele alacağız. Şimdilik, standart kütüphane tarafından sağlanan `Vec` türünün herhangi bir türü tutabileceğini bilin. Belirli bir türü saklamak için bir vektör oluşturduğumuzda, türü açılı parantezler içinde belirtebiliriz. Liste 8-1'de, `v`’deki `Vec`'nin `i32` türü öğeleri tutacağını Rust’a bildirdik.

:::note
Çoğu zaman, başlangıç değerleri ile `Vec` oluşturursunuz ve Rust, saklamak istediğiniz değerin türünü çıkarır, bu yüzden nadiren bu tür notasyonu yapmanız gerekmez.
:::

Rust, verdiğiniz değerleri tutan yeni bir vektör oluşturacak olan `vec!` makrosunu sağlar. Liste 8-2, `1`, `2` ve `3` değerlerini tutan yeni bir `Vec` oluşturur. Tam sayı türü `i32`’dir çünkü bu, üçüncü bölümdeki [“Veri Türleri”][data-types] bölümünde tartıştığımız varsayılan tam sayı türüdür.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-02/src/main.rs:here}}
```



Başlangıçta `i32` değerleri verdiğimiz için Rust, `v`’nin türünün `Vec` olduğunu çıkarabilir ve tür notasyonu gerekli değildir. **Şimdi bir vektörü nasıl güncelleyeceğimize bakalım.**

### Bir Vektörü Güncelleme

Bir vektör oluşturup ona öğeler eklemek için `push` metodunu kullanabiliriz; bu, Liste 8-3'te gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-03/src/main.rs:here}}
```



Herhangi bir değişken gibi, değerini değiştirebilmek için `mut` anahtar kelimesi kullanılarak değiştirilebilir hale getirilmesi gerekir; bu, üçüncü bölümde tartışılmıştır. İçerideki sayılar `i32` türündedir ve Rust, veriden bunu çıkarır, bu yüzden `Vec` açıklamasına ihtiyacımız yoktur.

### Vektörlerde Öğeleri Okuma

Bir vektörde saklanan bir değeri referans almak için iki yol vardır: indeksleme veya `get` metodunu kullanarak. Aşağıdaki örneklerde, bu fonksiyonlardan dönen değerlerin türlerini ek açıklama ile belirtmişiz.

Liste 8-4, bir vektörde bir değere erişmenin her iki yolunu da, indeksleme sözdizimi ve `get` yöntemi ile göstermektedir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-04/src/main.rs:here}}
```



Burada birkaç detaya dikkat edin. Üçüncü öğeyi almak için `2` indeks değerini kullanıyoruz çünkü vektörler sıfırdan başlayarak numara ile indekslenir. `&` ve `[]` kullanarak, indeks değerindeki öğeye referans elde ederiz. `get` yöntemi ile indeks, argüman olarak geçildiğinde, `Option` döner ve bunu `match` ile kullanabiliriz.

:::warning
Rust, elemanların var olduğu aralığın dışında bir indeks değeri kullanmaya çalıştığınızda, programın nasıl davranacağını seçmenizi sağlayacak şekilde bu iki yolu sağlar. 
:::

Örnek olarak, beş eleman içeren bir vektörümüz olduğunda ve ardından her bir teknikle 100 indeksindeki bir öğeye erişmeye çalıştığımızda, Liste 8-5'te gösterildiği gibi ne olacağını görelim.



```rust,should_panic,panics
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-05/src/main.rs:here}}
```



Bu kodu çalıştırdığımızda, ilk `[]` metodu programın korkmasına neden olacak çünkü var olmayan bir öğeye referans vermektedir. Bu yöntem, vektörün sonunun ötesinde bir öğeye erişim girişimi varsa programınızın çökmesini istediğiniz durumlarda en iyi şekilde kullanılmalıdır.

:::tip
`get` yöntemine vektörün dışında bir indeks verildiğinde, programı korkutmadan `None` döndürür. 
:::

Bu yöntem, normal koşullar altında vektörün aralığının ötesine erişme durumunun zaman zaman meydana gelebileceği durumlar için kullanılabilir. Kodunuz, `Some(&element)` veya `None` durumlarını ele almak için mantık içerecek şekilde olmalıdır; bu durumda kullanıcıdan bir sayı girmesi istenir. Eğer yanlışlıkla çok büyük bir sayı girerse ve program `None` değeri alırsa, mevcut vektörde kaç tane öğe olduğunu kullanıcıya bildirir ve geçerli bir değer girmesi için yeniden bir şans verebilirsiniz. Bu, programı bir yazım hatası nedeniyle çökertmekten daha kullanıcı dostu olur!

Program geçerli bir referansa sahip olduğunda, borç alma kontrolörü, bu referansın ve vektörün içeriğindeki diğer tüm referansların geçerli kalmasını sağlamak için sahiplik ve borç verme kurallarını zorlar (Bölüm 4'te ele alınmıştır). Aynı kapsamda hem değiştirilebilir hem de değiştirilemez referansların olamayacağına dair kuralı hatırlayın. Bu kural Liste 8-6'da geçerlidir; burada bir vektördeki ilk öğeye değiştirilemez bir referans tutuyoruz ve sona bir öğe eklemeye çalışıyoruz. Eğer daha sonra fonksiyonda o öğeye de referans vermeye çalışırsak bu program çalışmayacaktır.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-06/src/main.rs:here}}
```



Bu kodu derlemek, şu hatayı verecektir:

```console
{{#include ../listings/ch08-common-collections/listing-08-06/output.txt}}
```

Liste 8-6'daki kod, çalışması gereken bir şey gibi görünebilir: ilk öğeye yapılan bir referans, vektörün sonunda yapılan değişikliklerden neden etkilenmelidir? **Bu hata, vektörlerin çalışma şekliyle ilgilidir:** Vektörler, değerleri bellekte yan yana koydukları için, vektörün sonuna yeni bir öğe eklemek, yeterli alan yoksa eski öğeleri yeni alana kopyalamayı ve yeni bellek ayırmayı gerektirebilir. Bu durumda, ilk öğeye yapılan referans serbest bırakılmış belleğe işaret ediyor olacaktır. Borçlama kuralları, programların bu duruma düşmesini engeller.

> Not: `Vec` türünün uygulama detayları hakkında daha fazla bilgi için [“Rustonomicon”][nomicon].

### Vektördeki Değerler Üzerinde İterasyon

Vektördeki her bir öğeye sırayla erişmek için, her bir öğeyi birer birer erişmek yerine, tüm öğeler üzerinden yinelemeye geçeriz. Liste 8-7, `i32` değerlerinin bulunduğu bir vektördeki her öğeye değiştirilemez referanslar alarak nasıl baskı yapacağınızı göstermektedir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-07/src/main.rs:here}}
```



Ayrıca, bir değiştirilebilir vektörde her öğeye değiştirilebilir referanslar üzerinden geçerek tüm öğeleri değiştirebiliriz. Liste 8-8'deki `for` döngüsü, her öğeye `50` ekleyecektir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-08/src/main.rs:here}}
```



Değiştirilebilir referansın işaret ettiği değeri değiştirmek için, `+=` operatörünü kullanmadan önce `i`’deki değere erişmek için `*` dereferans operatörünü kullanmalıyız. Dereferans operatörü hakkında daha fazla bilgi [“Dereferans Operatörü ile Değere Giden İşaretçi”][deref] bölümünde görülecektir.

Bir vektör üzerinde, ister değiştirilebilir ister değiştirilebilir olsun, yineleme yapmak, borç alma kontrolörünün kurallarından dolayı güvenlidir. Liste 8-7 ve Liste 8-8'deki `for` döngüsü gövdesinde öğeleri ekleme veya kaldırmaya çalışırsak, Liste 8-6'daki kodda aldığımız benzer bir derleyici hata alırız. `for` döngüsünün referansı, vektörün tamamının aynı anda değiştirilmesini engeller.

### Birden Fazla Türü Saklamak İçin Enum Kullanma

Vektörler sadece aynı türden değerleri saklayabilir. Bu bazen elverişsiz olabilir; farklı türden öğeleri saklamak için kesinlikle bir kullanım senaryosu vardır. Neyse ki, bir enum'ın varyantları aynı enum türü altında tanımlandığından, farklı türlerdeki öğeleri temsil etmek için bir tür tanımlayıp kullanabiliriz!

Örneğin, bir satırda bazı sütunların tam sayılar, bazıların float numaraları ve bazıları string içeren bir elektronik tablodan değer almak isteyelim. Farklı değer türlerini tutacak varyantları olan bir enum tanımlayabiliriz ve tüm enum varyantları aynı tür olarak kabul edilecektir: enum türü. Sonra, bu enum'u tutmak için bir vektör oluşturabiliriz ve dolayısıyla farklı türleri tutabiliriz. Bunu Liste 8-9'da gösterdik.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-09/src/main.rs:here}}
```



Rust, bir vektörün içindeki türlerin derleme zamanında ne olacağını bilmesi gerektiğinden, her bir öğeyi saklamak için ihtiyaç duyulan bellek miktarını tam olarak bilmelidir. Ayrıca, bu vektörde hangi türlerin olduğunuza dair kesin olmalıyız. Eğer Rust, bir vektörün herhangi bir türü tutmasına izin verseydi, türlerden biri veya daha fazlasının vektör öğeleri üzerinde gerçekleştirilen işlemlerle hata vermesi riski olacaktı. Bir enum kullanmak ve `match` ifadesi ile Rust, derleme zamanında her olası durumun ele alındığından emin olacaktır; bu, Bölüm 6'da tartışılmıştır.

:::info
Eğer bir programın çalışma zamanında bir vektörde saklamak için alacağı türlerin tam setini bilmiyorsanız, enum tekniği işe yaramayacaktır.
:::

Bunun yerine, on sekizinci bölümde ele alacağımız bir trait nesnesi kullanabilirsiniz.

Artık vektörleri kullanmanın en yaygın yollarını tartıştığımıza göre, standart kütüphanenin `Vec` üzerine tanımladığı birçok yararlı yöntem için [API belgelerini][vec-api] gözden geçirmeyi unutmayın. Örneğin, `push`'ten başka, `pop` yöntemi son öğeyi kaldırır ve döndürür.

### Bir Vektörü Düşürmek, Öğelerini Düşürür

Herhangi bir başka `struct` gibi, bir vektör kapsam dışına çıkınca serbest bırakılır; bu, Liste 8-10'da gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-10/src/main.rs:here}}
```



Vektör düştüğünde, içindeki tüm içerikler de düşer; yani tuttuğu tam sayılar temizlenir. Borç alma kontrolörü, bir vektörün içeriğine referansların yalnızca vektör geçerli olduğunda kullanılmasını sağlar.

--- 

Şimdi bir sonraki koleksiyon türüne geçelim: `String`!

[data-types]: ch03-02-data-types.html#data-types
[nomicon]: ../nomicon/vec/vec.html
[vec-api]: ../std/vec/struct.Vec.html
[deref]: ch15-02-deref.html#following-the-pointer-to-the-value-with-the-dereference-operator