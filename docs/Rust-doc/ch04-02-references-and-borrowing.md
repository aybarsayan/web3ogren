## Referanslar ve Borç Alma

Liste 4-5'teki tuple kodunda sorun, `String`'i çağıran fonksiyona döndürmek zorunda olmamızdır; böylece `calculate_length` çağrısından sonra `String`'i hala kullanabiliriz, çünkü `String`, `calculate_length` içine taşınmıştı. Bunun yerine, `String` değerine bir referans sağlayabiliriz. **Bir *referans*, bir işaretçi gibi, o adrese erişebilmek için takip edebileceğimiz bir adrestir; bu veriler başka bir değişken tarafından sahiplenilir.** İşaretçilerin aksine, bir referans, o referansın ömrü boyunca belirli bir türün geçerli bir değerine işaret etme garantisi sunar.

:::tip
*Referans kullanımı, bellek yönetimini daha verimli hale getirir ve sahiplik sorunlarını önler.*
:::

İşte bir nesneye referans parametre olarak alıp, değeri sahiplenmek yerine `calculate_length` fonksiyonunu nasıl tanımlayıp kullanabileceğiniz:



```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-07-reference/src/main.rs:all}}
```



Öncelikle, değişken beyanındaki ve fonksiyon dönüş değerindeki tüm tuple kodunun gittiğine dikkat edin. İkincisi, `calculate_length`'e `&s1` gönderdiğimizi ve tanımında `String` yerine `&String` aldığımızı not edin. Bu ampersandlar *referansları* temsil eder ve size bir değere referans verme imkanı tanır, onu sahiplenmeden. **Şekil 4-6 bu kavramı göstermektedir.**

![](images/rust/img/trpl04-06.svg)

Şekil 4-6: `&String s`'nin `String s1`'e işaret etmelerini tasvir eden bir diyagram

> **Not:** `&` kullanarak referans vermenin zıttı *de-referanslama*dır ve bu, de-referanslama operatörü `*` ile gerçekleştirilir. De-referanslama operatörünün bazı kullanımlarını Bölüm 8'de göreceğiz ve de-referanslama ile ilgili detayları Bölüm 15'te tartışacağız.

Burada fonksiyon çağrısına daha yakından bakalım:

```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-07-reference/src/main.rs:here}}
```

`&s1` sözdizimi, `s1` değerine işaret eden bir referans oluşturmamıza olanak tanır, ancak değeri sahiplenmez. Çünkü sahiplenmez, işaret ettiği değer referans kullanımı sona erdiğinde atılmayacaktır.

Ayrıca, fonksiyonun imzası `&` kullanarak `s` parametresinin türünün bir referans olduğunu gösterir. Bazı açıklayıcı notlar ekleyelim:

```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-08-reference-with-annotations/src/main.rs:here}}
```

Değişken `s`'nin geçerli olduğu alan, herhangi bir fonksiyon parametresinin alanı ile aynıdır, ancak referansın işaret ettiği değer, `s` kullanılmadığında atılmaz, çünkü `s` sahiplik taşımıyor. **Fonksiyonlar, gerçek değerler yerine referanslar parametre olarak aldıklarında, sahiplik geri vermek için değerleri döndürmemize gerek olmayacaktır, çünkü asla sahipliğimiz yoktu.**

> **Referans oluşturma eylemine *borç alma* denir.** Gerçek hayatta olduğu gibi, bir kişi bir şeye sahip olduğunda, onu sizden borç alabilirsiniz. İşiniz bittiğinde, geri vermeniz gerekir. Onun sahibi değilsiniz.

Peki, borç aldığımız bir şeyi değiştirmeye çalışırsak ne olur? Liste 4-6'daki kodu deneyin. Spoiler uyarısı: çalışmıyor!



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch04-understanding-ownership/listing-04-06/src/main.rs}}
```



İşte hata:

```console
{{#include ../listings/ch04-understanding-ownership/listing-04-06/output.txt}}
```

**Değişkenler varsayılan olarak değiştirilemez olduğu gibi, referanslar da öyle.** Referansını aldığımız bir şeyi değiştirmemize izin verilmez.

---

### Değiştirilebilir Referanslar

Liste 4-6'daki kodu, sadece birkaç küçük değişiklikle, bir *değiştirilebilir referans* kullanarak, borç alınmış bir değeri değiştirmeye izin verecek şekilde düzeltebiliriz:



```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-09-fixes-listing-04-06/src/main.rs}}
```



**Önce `s`'yi `mut` yapıyoruz. Sonra, `change` fonksiyonunu çağırırken `&mut s` ile bir değiştirilebilir referans oluşturuyoruz** ve fonksiyon imzasını `some_string: &mut String` ile bir değiştirilebilir referans alacak şekilde güncelliyoruz. Bu, `change` fonksiyonunun borç aldığı değeri değiştireceğini çok açık hale getiriyor.

Değiştirilebilir referansların büyük bir kısıtlaması vardır: *bir değere ait bir değiştirilebilir referansa sahipseniz, o değere ait başka hiçbir referansa sahip olamazsınız.* Bu `s`'ye iki değiştirilebilir referans oluşturmaya çalışan kod başarısız olacaktır:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-10-multiple-mut-not-allowed/src/main.rs:here}}
```



İşte hata:

```console
{{#include ../listings/ch04-understanding-ownership/no-listing-10-multiple-mut-not-allowed/output.txt}}
```

Bu hata, bu kodun geçersiz olduğunu, çünkü `s`'yi bir seferde değiştirilebilir olarak birden fazla kez borç alamayacağımızı belirtiyor. İlk değiştirilebilir borç `r1`'de ve `println!`'da kullanıldığı sürece sürdürülmelidir, ancak bu değiştirilebilir referansın oluşturulması ile kullanımı arasında, `r2`'de aynı veriyi borç alan başka bir değiştirilebilir referans oluşturmaya çalıştık.

> **Aynı anda aynı verilere birden fazla değiştirilebilir referansı engelleyen kısıtlama, değişiklik yapılmasına izin verir ancak çok kontrollü bir şekilde.** Bu, yeni Rustacean'ların zorlandığı bir konudur çünkü çoğu dil, isterse istediğiniz zaman değişiklik yapmanıza izin verir. 

Bu kısıtlamanın faydası, Rust'ın derleme zamanında veri yarışlarını önlemesidir. **Bir *veri yarışı*, bir yarış koşuluna benzer ve şu üç davranışın gerçekleşmesi durumunda ortaya çıkar:**

* İki veya daha fazla işaretçi aynı veriye aynı anda erişim sağlar.
* İşaretçilerden en az biri veriyi yazmak için kullanılıyordur.
* Verilere erişim senkronize etmek için hiçbir mekanizma kullanılmamaktadır.

Veri yarışları tanımsız davranışlara neden olur ve bunları çalıştırma sırasında izlemeye çalıştığınızda teşhis etmek ve düzeltmek zor olabilir; **Rust bu problemi, veri yarışlarına sahip olan kodu derlemeyi reddederek engeller!**

Her zaman olduğu gibi, süslü parantezler kullanarak yeni bir alan oluşturabiliriz, böylece birden fazla değiştirilebilir referansa sahip olabiliriz, sadece *aynı anda* olanlara değil:

```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-11-muts-in-separate-scopes/src/main.rs:here}}
```

Rust, değiştirilebilir ve değiştirilemez referansların bir arada kullanılmasına benzer bir kural uygular. Bu kod bir hata ile sonuçlanır:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-12-immutable-and-mutable-not-allowed/src/main.rs:here}}
```

İşte hata:

```console
{{#include ../listings/ch04-understanding-ownership/no-listing-12-immutable-and-mutable-not-allowed/output.txt}}
```

Ufff! **Aynı değere ait bir değiştirilebilir referansa sahipken, değiştirilemez bir referansa sahip olamayız.**

Değiştirilemez referansı kullananlar, değerin altlarında birdenbire değişmesini beklemiyorlar! Ancak birden fazla değiştirilemez referansa izin verilmektedir çünkü verileri sadece okuyan herkesin başka birinin veriyi okumasını etkileme yeteneği yoktur.

Bir referansın kapsamının nereden tanıtıldığından başladığını ve o referansın en son kullanıldığı zamana kadar devam ettiğini unutmayın. **Örneğin, bu kod derlenecektir çünkü değiştirilemez referansların son kullanımı, `println!`, değiştirilebilir referans tanıtılmadan önce gerçekleşir:**

```rust,edition2021
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-13-reference-scope-ends/src/main.rs:here}}
```

Değiştirilemez referansların `r1` ve `r2` kapsamları, en son kullanıldıkları yer olan `println!`'dan sonra sona ermektedir ve bu, değiştirilebilir referans `r3` oluşturulmadan öncedir. Bu kapsamlar örtüşmez, böylece bu kod mümkündür: derleyici, referansın bir kapsamın sonundan önce artık kullanılmadığını anlayabilir.

Borç alma hataları zaman zaman sinir bozucu olabilir, ancak **Rust derleyicisinin muhtemel bir hatayı erken (çalıştırma zamanında değil, derleme zamanında) belirttiğini ve problemin tam olarak nerede olduğunu gösterdiğini unutmayın.** Böylece verinizin düşündüğünüz gibi olmamasının nedenini bulmanıza gerek kalmaz.

---

### Sarkan Referanslar

İşaretçilerin bulunduğu dillerde, hafıza belki de bir başkasına verilmiş olan bir konumu referans alan bir *sarkan işaretçi* oluşturmak kolaydır; bazı belleği özgürleştirerek o belleğe bir işaretçi saklayarak. **Rust'ta ise derleyici, referansların asla sarkan referanslar olmamasını garanti eder: eğer bir veri üzerinde referansınız varsa, derleyici, verinin referansın kapsamından çıkmadan önce kapsamdan çıkmadığını temin eder.**

Bir sarkan referans oluşturmaya çalışalım ve Rust'ın bunu derleme zamanı hatası ile nasıl önlediğini görelim:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-14-dangling-reference/src/main.rs}}
```



İşte hata:

```console
{{#include ../listings/ch04-understanding-ownership/no-listing-14-dangling-reference/output.txt}}
```

Bu hata mesajı, henüz kapsamadığımız bir özelliğe atıfta bulunuyor: yaşam süreleri. **Yaşam sürelerini ayrıntılı olarak Bölüm 10'da tartışacağız.** Ancak yaşam süreleriyle ilgili kısımları göz ardı ederseniz, mesajın bu kodun neden problemli olduğuna dair anahtarı içerdiğini göreceksiniz:

```text
bu fonksiyonun dönüş türü, borç alınmış bir değeri içeriyor, ancak ondan borç almak için hiçbir değer yok
```

`dangle` kodumuzun her aşamasında tam olarak ne olduğunu daha yakından inceleyelim:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-15-dangling-reference-annotated/src/main.rs:here}}
```



Çünkü `s` `dangle` içinde oluşturulmuş, `dangle` kodu tamamlandığında `s` serbest bırakılacaktır. Ancak ona bir referans döndürmeye çalıştık. Bu, geçersiz bir `String`'e işaret eden bir referans olur. **Bu iyi değil! Rust bunu kabul etmeyecek.**

Buradaki çözüm, `String`'i doğrudan döndürmektir:

```rust
{{#rustdoc_include ../listings/ch04-understanding-ownership/no-listing-16-no-dangle/src/main.rs:here}}
```

Bu sorun çıkmadan çalışır. **Sahiplik dışarı taşınır ve hiçbir şey serbest bırakılmaz.**

---

### Referansların Kuralları

Referanslar hakkında şu ana kadar tartıştıklarımızı özetleyelim:

* Herhangi bir anda, *ya* bir değiştirilebilir referans *ya da* sayısız değiştirilemez referansa sahip olabilirsiniz.
* Referanslar her zaman geçerli olmalıdır.

Sonraki bölümde, farklı bir tür referansa bakacağız: dilimlere.