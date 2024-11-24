## Akıllı İşaretçileri `Deref` Trait'i ile Normal Referanslar Gibi Kullanma

`Deref` trait'ini uygulamak, *dereference operatörü* `*` (çarpma veya glob operatörü ile karıştırılmamalıdır) davranışını özelleştirmenizi sağlar. `Deref`'i, bir akıllı işaretçinin normal bir referans gibi davranabilmesi için uygulayarak, referanslar üzerinde çalışan kod yazabilir ve bu kodu akıllı işaretçilerle de kullanabilirsiniz.

Öncelikle, dereference operatörünün normal referanslarla nasıl çalıştığını inceleyelim. Ardından, `Box` gibi davranan özel bir tür tanımlamaya çalışacağız ve dereference operatörünün yeni tanımladığımız tür üzerinde neden referans gibi çalışmadığını göreceğiz. `Deref` trait'inin uygulanmasının, akıllı işaretçilerin referanslarla benzer şekilde çalışabilmesine nasıl olanak tanıdığını keşfedeceğiz. Daha sonra Rust'un *deref coercion* özelliğine ve bunun referanslar veya akıllı işaretçiler ile nasıl çalıştığına bakacağız.

> **Not:** Geliştireceğimiz `MyBox` türü ile gerçek `Box` arasında büyük bir fark var: bizim versiyonumuz verilerini heap üzerinde saklamayacak. Bu örneği `Deref` üzerine odakladığımız için, verinin nerede saklandığı, işaretçi benzeri davranış kadar önemli değildir.




### Değere Giden İşaretçiyi Takip Etme

Normal bir referans, bir tür işaretçidir ve bir işaretçi hakkında düşünmenin bir yolu, başka bir yerde saklanan bir değere işaret eden bir ok olarak görmektir. 

:::note
15-6. Listede, bir `i32` değerine referans oluşturuyoruz ve ardından referansı değere takip etmek için dereference operatörünü kullanıyoruz:
:::



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-06/src/main.rs}}
```



`x` değişkeni `5` değerinde bir `i32` tutar. `y`'yi `x`'e bir referans olacak şekilde ayarlıyoruz. `x`'in `5`'e eşit olduğunu iddia edebiliriz. Ancak, `y`'deki değere dair bir iddiada bulunmak istiyorsak, referansını gösterdiği değeri takip etmek için `*y` kullanmalıyız (bu nedenle *dereference*), böylece derleyici gerçek değeri karşılaştırabiliriz. `y`'yi dereferans ettikten sonra, `y`'nin işaret ettiği tam sayı değerine erişimimiz olur ve bunu `5` ile karşılaştırabiliriz.

Eğer `assert_eq!(5, y);` yazmaya çalışsaydık, bu derleme hatasını alırdık:

```console
{{#include ../listings/ch15-smart-pointers/output-only-01-comparing-to-reference/output.txt}}
```

Bir sayıyı ve bir sayıya olan referansı karşılaştırmak izin verilmez çünkü bunlar farklı türlerdir. Referansı gösterdiği değeri takip etmek için dereference operatörünü kullanmalıyız.

---

### `Box`'yi Bir Referans Gibi Kullanma

15-6. Listede bulunan kodu bir referans yerine `Box` kullanacak şekilde yeniden yazabiliriz; 15-7. Listede `Box` üzerindeki dereference operatörü, 15-6. Listede referans üzerindeki dereference operatörü ile aynı şekilde çalışır:

` üzerindeki dereference operatörünü kullanma">

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-07/src/main.rs}}
```



15-7. Liste ile 15-6. Liste arasındaki ana fark, burada `y`'yi `x`'in değerine işaret eden bir referans yerine `x`'in kopyalanmış değerine işaret eden bir `Box` örneği olarak ayarlıyoruz. Son iddiada, dereference operatörünü kullanarak `Box`'nin işaretçisini takip edebiliriz tıpkı `y` bir referans olduğunda yaptığımız gibi. Sonraki kısmında, `Box`'yi özel türler tanımlayarak dereference operatörünü kullanmamıza olanak tanıyan özel olan yönlerini keşfedeceğiz.

---

### Kendi Akıllı İşaretçimizi Tanımlama

Kültürel kütüphanede sağlanan `Box` türüne benzer bir akıllı işaretçi oluşturalım; böylece akıllı işaretçilerin normal referanslardan nasıl farklı davrandığını deneyimleyelim. Ardından dereference operatörünü kullanma yeteneğimizi nasıl ekleyeceğimize bakacağız.

`Box` türü nihayetinde bir elemanlı bir demet yapısı olarak tanımlandığı için, 15-8. Liste bir `MyBox` türünü aynı şekilde tanımlar. `Box` üzerindeki `new` fonksiyonunu eşleştirecek bir `new` fonksiyonu da tanımlayacağız.

` türü tanımlama">

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-08/src/main.rs:here}}
```



`MyBox` adında bir yapı tanımlıyoruz ve `T` adında bir genel parametre belirliyoruz çünkü türümüzün herhangi bir türdeki değerleri tutmasını istiyoruz. `MyBox` türü, `T` türünde bir elemanı olan bir demet yapısıdır. `MyBox::new` fonksiyonu `T` türünde bir parametre alır ve geçmiş olan değeri tutan bir `MyBox` örneği döndürür.

15-7. Listede yer alan `main` fonksiyonunu 15-8. Listeye eklemeyi deneyelim ve `Box` yerine tanımladığımız `MyBox` türünü kullanacak şekilde değiştirelim. 15-9. Listede yer alan bu kod derlenmeyecek çünkü Rust `MyBox`'ı dereference etmeyi bilmiyor.

` ile kullandığımız şekilde `MyBox` kullanmaya çalışmak">

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-09/src/main.rs:here}}
```



Aşağıdaki derleme hatası ile karşılaşırız:

```console
{{#include ../listings/ch15-smart-pointers/listing-15-09/output.txt}}
```

`MyBox` türümüz dereference edilemez çünkü bu yeteneği türümüzde uygulamadık. `*` operatörü ile dereference etmeyi sağlamak için `Deref` trait'ini uyguluyoruz.

---

### `Deref` Trait'ini Uygulayarak Bir Türü Referans Gibi Kullanma

10. Bölümdeki [“Bir Tür Üzerine Trait Uygulama”][impl-trait] bölümünde tartışıldığı gibi, bir trait uygulamak için, trait'in gerektirdiği yöntemlerin uygulamalarını sağlamamız gerekir. Standart kütüphane tarafından sağlanan `Deref` trait'i, `self` değerini borç alan ve iç veriye bir referans döndüren bir `deref` adında bir yöntem uygulamamızı gerektirir. 

:::tip
15-10. Liste `MyBox` tanımına ekleyeceğimiz `Deref` uygulamasını içermektedir:
:::

` üzerindeki `Deref`'i uygulama">

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-10/src/main.rs:here}}
```



`type Target = T;` sözdizimi, `Deref` trait'inin kullanması için bir ilişkili tür tanımlar. İlişkili türler, genel bir parametreyi tanımlamanın biraz farklı bir yoludur, ancak şu anda bunlarla ilgili endişelenmenize gerek yok; bunları 20. Bölümde daha ayrıntılı bir şekilde ele alacağız.

`deref` yönteminin gövdesini `&self.0` ile dolduruyoruz, böylece `deref` işaretçi operatörü `*` ile erişmek istediğimiz değere bir referans döndürür; 5. Bölümdeki [“Farklı Türler Oluşturmak İçin İsimlendirilmemiş Alanlarla Demet Yapılarını Kullanma”][tuple-structs] bölümünden hatırlayacaksınız ki `.0` bir demet yapısındaki ilk değere erişir. 

:::info
15-9. Listede `MyBox` değerine `*` uygulayan `main` fonksiyonu artık derlenir ve iddialar geçer!
:::

`Deref` trait'i olmadan, derleyici yalnızca `&` referanslarını dereference edebilir. `deref` yöntemi, herhangi bir türde `Deref` uygulayan bir değeri alır ve `deref` yöntemini çağırarak dereference etmeyi bilir.

15-9. Listede `*y` yazdığımızda, Rust arka planda bu kodu çalıştırdı:

```rust,ignore
*(y.deref())
```

Rust, `*` operatörünü `deref` yöntemine bir çağrı ve ardından bir basit dereference ile değiştirir, böylece `deref` yöntemini çağırmamız gerekip gerekmediğini düşünmek zorunda kalmayız. Bu Rust özelliği, normal bir referansımız olduğunda veya `Deref` uygulayan bir türümüz olduğunda, işlevsellik olarak aynı şekilde çalışan kod yazmamıza izin verir.

`deref` yönteminin bir değere değil, bir değerin referansına döndürülmesi ve `*(y.deref())` ifadesindeki parantezlerin dışındaki basit dereferansın hala gerekli olmasının nedeni, sahiplik sistemidir. `deref` yöntemi değer doğrudan döndürseydi, o değer `self`'den çıkarılmış olurdu. Bu durumda veya dereference operatörünü kullandığımız diğer çoğu durumda iç değerin sahipliğini almak istemeyiz.

`*` operatörünün her kullanımında, `deref` yöntemine bir çağrı ve ardından `*` operatörüne bir çağrının yalnızca bir kez değiştirildiğini not edin. `*` operatörünün değişimi sonsuz bir döngü oluşturmadığı için, sonuçta `assert_eq!` içindeki `5` ile eşleşen `i32` türünde bir veri elde ederiz.

### Fonksiyonlar ve Yöntemlerle İlişkili Implicit Deref Coercions

*Deref coercion*, `Deref` trait'ini uygulayan bir tür referansını başka bir tür referansına dönüştürür. Örneğin, `Deref` trait'i `&str` dönecek şekilde hizmet ettiği için `&String`'i `&str`'ye dönüştürebilir. Deref coercion, Rust'un fonksiyonlara ve yöntemlere geçirdiğimiz argümanlarda sağladığı bir kolaylıktır ve yalnızca `Deref` trait'ini uygulayan türlerde çalışır. Belirli bir türdeki bir değere olan referansın, fonksiyon veya yöntem tanımındaki parametre türü ile eşleşmediği durumlarda otomatik olarak gerçekleşir. 

:::warning
`deref` yöntemine yapılan ardışık çağrılar, sağladığımız türü parametrenin ihtiyaç duyduğu türe dönüştürür.
:::

Deref coercion, Rust'un fonksiyon ve yöntem çağrıları yazan programcılar için daha fazla açık referans ve dereference eklemelerine gerek kalmadan sağlanmıştır. Deref coercion özelliği, ayrıca referanslar veya akıllı işaretçiler ile çalışabilen daha fazla kod yazmamıza olanak tanır.

Deref coercion işlevini görmek için, 15-8. Listede tanımladığımız `MyBox` türünü ve 15-10. Listede eklediğimiz `Deref` uygulamasını kullanalım. 15-11. Listede bir string dilimi parametresi olan bir fonksiyon tanımını görebiliriz:



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-11/src/main.rs:here}}
```



`hello` fonksiyonunu bir string dilimi argümanı ile çağırabiliriz, örneğin `hello("Rust");` gibi. Deref coercion, `hello` fonksiyonunu `MyBox` türündeki bir değerin referansı ile çağırmamızı mümkün kılar, bu da 15-12. Listede gösterilmiştir:

` değerine referans ile `hello` çağırmak">

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-12/src/main.rs:here}}
```



Burada, bir `MyBox` değerine referans olan `&m` ile `hello` fonksiyonunu çağırıyoruz. 15-10. Listede `MyBox` üzerinde `Deref` trait'ini uyguladığımız için, Rust `&MyBox`'i `&String`'e `deref` çağrısı ile dönüştürebilir. Standart kütüphane, `String` üzerinde `&str` döndüren bir `Deref` uygulaması sağlar ve bu `Deref` için API belgelerinde mevcuttur. Rust, `hello` fonksiyonunun tanımına uymak için `&String`'yi `&str`'ye dönüştürmek için tekrar `deref` çağrısı yapar.

Eğer Rust deref coercion uygulamasaydı, `hello` fonksiyonunu `&MyBox` türündeki bir değeri ile çağırmak için 15-13. Listede gösterilen kodu yazmak zorunda kalırdık.



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-13/src/main.rs:here}}
```



`(*m)` `MyBox`'yi bir `String`'e dereference eder. Ardından `&` ve `[..]`, `hello`'nun imzasına uymak için `String`in tamamına eşit olan bir string dilimi alır. Bu kod, tüm bu semboller içermediği için okunması, yazılması ve anlaşılması daha zordur. Deref coercion, Rust'ın bu dönüşümleri bizim için otomatik olarak gerçekleştirmesine olanak tanır.

`Deref` trait'i ilgili türler için tanımlandığında, Rust türlerin analizini yapacak ve parameterin türüne karşılık gelen bir referans almak için gerektiği kadar `Deref::deref` yöntemini çağıracaktır. `Deref::deref`'in kaç kez eklenmesi gerektiği, derleme zamanında belirlenir, bu nedenle deref coercion kullanmanın çalışma zamanı cezası yoktur!

---

### Deref Coercion'ın Değişebilirlik ile Etkileşimi

Değişmez referanslar üzerindeki `*` operatörünü geçersiz kılmak için `Deref` trait'ini kullandığınız gibi, değiştirilebilir referanslar üzerindeki `*` operatörünü geçersiz kılmak için `DerefMut` trait'ini kullanabilirsiniz.

Rust, tipleri ve trait uygulamalarını bulduğunda deref coercion gerçekleştirmektedir:

* `&T` den `&U` ye, eğer `T: Deref` ise
* `&mut T` den `&mut U` ye, eğer `T: DerefMut` ise
* `&mut T` den `&U` ye, eğer `T: Deref` ise

İlk iki durum, birbirine benzer ancak ikincisi değiştirilebilirliği uygular. İlk durum, `&T`'ye sahip olduğunuzda ve `T`, belirli bir tür `U`'ya dereference yapıyorsa, otomatik olarak `&U` elde edebileceğinizi belirtir. 

:::warning
İkinci durum, benzer deref coercion'ın değiştirilebilir referanslar için de geçerli olduğunu belirtir.
:::

Üçüncü durum daha karmaşıktır: Rust ayrıca bir değiştirilebilir referansı değişmez bir referansa da dönüştürür. Ancak bunun tam tersi *mümkün değildir*: değişmez referanslar asla değiştirilebilir referanslara dönüştürülmeyeceklerdir. Borç verme kurallarından dolayı, bir değiştirilebilir referansa sahip olduğunuzda, o değiştirilebilir referansın, o veriye ait tek referans olması gerekir (aksi takdirde program derlenmez). Bir değiştirilebilir referansı değişmez bir referansa dönüştürmek, borç verme kurallarını ihlal etmeyecektir. 

:::danger
Ancak bir değişmez referansı değiştirilebilir bir referansa dönüştürmek, başlangıçta değişmez referansın bu veriye ait tek değişmez referans olması gerektiğini gerektirir ancak borç verme kuralları bunun garantisini vermez. Bu nedenle, Rust, değişmez bir referansı değiştirilebilir bir referansa dönüştürmenin mümkün olduğunu varsayamaz.
:::

[impl-trait]: ch10-02-traits.html#implementing-a-trait-on-a-type  
[tuple-structs]: ch05-01-defining-structs.html#using-tuple-structs-without-named-fields-to-create-different-types  