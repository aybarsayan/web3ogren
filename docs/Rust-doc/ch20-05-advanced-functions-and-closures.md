## Gelişmiş Fonksiyonlar ve Kapanışlar

Bu bölüm, fonksiyonlar ve kapanışlarla ilgili bazı gelişmiş özellikleri, fonksiyon işaretçilerini ve kapanışları döndürmeyi araştırmaktadır.

### Fonksiyon İşaretçileri

:::info
Kapanışları fonksiyonlara nasıl geçireceğimizi konuştuk; normal fonksiyonları da fonksiyonlara geçirebilirsiniz! Bu teknik, yeni bir kapanış tanımlamak yerine zaten tanımlamış olduğunuz bir fonksiyonu geçireceğiniz zaman faydalıdır.
:::

Fonksiyonlar, `fn` (küçük f ile) türüne zorlanır, bu tür `Fn` kapanış özelliği ile karıştırılmamalıdır. `fn` türü *fonksiyon işaretçisi* olarak adlandırılır. Fonksiyon işaretçileri ile fonksiyonları geçmek, fonksiyonları diğer fonksiyonlara argüman olarak kullanmanıza olanak tanır.

Bir parametrenin fonksiyon işaretçisi olduğunu belirtme sözdizimi, kapanışlarınki ile benzerdir; 20-27 Numaralı Liste'de, bir parametreye bir ekleme yapan `add_one` fonksiyonunu tanımladık. `do_twice` fonksiyonu iki parametre alır: `i32` türünde bir parametre alan ve `i32` döndüren herhangi bir fonksiyona ait bir fonksiyon işaretçisi, ve bir `i32` değeri. `do_twice` fonksiyonu, `arg` değerini geçerek `f` fonksiyonunu iki kez çağırır ve ardından iki fonksiyon çağrısının sonuçlarını birleştirir. `main` fonksiyonu `do_twice`'ı `add_one` ve `5` argümanları ile çağırır.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-27/src/main.rs}}
```



Bu kod **`The answer is: 12`** ifadesini yazdırır. `do_twice` fonksiyonundaki `f` parametresinin bir `i32` türünde bir parametre aldığını ve `i32` döndürdüğünü belirtiriz. Böylece `do_twice`'in gövdesinde `f`'yi çağırabiliriz. `main` içinde, `do_twice`'a ilk argüman olarak `add_one` fonksiyon adını geçirebiliriz.

:::warning
Kapanışların aksine, `fn` bir türdür, bir özellik değil; bu nedenle, bir `Fn` özelliklerinden birine sahip bir genel tür parametresi tanımlamak yerine, parameter türünü doğrudan `fn` olarak belirtiriz.
:::

Fonksiyon işaretçileri, kapanış özelliklerinin tüm üçü (`Fn`, `FnMut` ve `FnOnce`) uygular; bu, bir fonksiyon işaretçisini kapanış bekleyen bir fonksiyon için her zaman bir argüman olarak geçirebileceğiniz anlamına gelir. Fonksiyonlarınızı, fonksiyon veya kapanışları kabul edebileceği şekilde bir genel tür ve kapanış özelliklerinden biri kullanarak yazmak en iyisidir.

Bununla birlikte, yalnızca `fn`'yi kabul etmek isteyeceğiniz bir durum, kapanışların olmadığı dış kodlarla etkileşim kurmaktır: C fonksiyonları, argüman olarak fonksiyonları kabul edebilir, ancak C kapanışlara sahip değildir.

:::note
İçinde tanımlı bir kapanış veya adlandırılmış bir fonksiyon kullanabileceğiniz bir örnek olarak, standart kütüphanedeki `Iterator` özelliği tarafından sağlanan `map` metoduna bakalım. 
:::

Sayılardan oluşan bir vektörü dize vektörüne dönüştürmek için `map` fonksiyonunu kullanmak istiyorsak, bir kapanış kullanabiliriz, şöyle:

```rust
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-15-map-closure/src/main.rs:here}}
```

Ya da kapanış yerine `map`'e argüman olarak bir fonksiyonu adlandırabiliriz, şöyle:

```rust
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-16-map-function/src/main.rs:here}}
```

Daha önce bahsettiğimiz gibi, birden fazla `to_string` adlı fonksiyon mevcut olduğu için tamamen nitelikli sözdizimini kullanmamız gerektiğini unutmayın. Burada, `Display` uygulayan herhangi bir tür için standart kütüphanenin uyguladığı `ToString` özelliğinde tanımlı olan `to_string` fonksiyonunu kullanıyoruz.

---

Bölüm 6'da [“Enum değerleri”][enum-values] bölümünden hatırlayacağınız gibi, tanımladığımız her enum varyantının adı aynı zamanda bir başlatıcı fonksiyonu olur. Bu başlatıcı fonksiyonları, kapanış özelliklerini uygulayan fonksiyon işaretçileri olarak kullanabiliriz; bu da, kapanış alan yöntemleri için başlatıcı fonksiyonları argüman olarak belirtebileceğimiz anlamına gelir, şöyle:

```rust
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-17-map-initializer/src/main.rs:here}}
```

Burada, `map`'in çağrıldığı aralıktaki her `u32` değeri için `Status::Value` örnekleri oluşturuyoruz; `Status::Value`'nin başlatıcı fonksiyonunu kullanarak. Bazı insanlar bu tarzı tercih eder, bazıları ise kapanışları tercih eder. İkisi de aynı koda derlenir, bu nedenle hangi tarz sizin için daha netse onu kullanın.

### Kapanışları Döndürmek

Kapanışlar, özellikler tarafından temsil edilmektedir, bu nedenle doğrudan kapanış döndüremezsiniz. Çoğu durumda, bir özelliği döndürmek isteyebileceğiniz durumlarda, bunun yerine özelliği uygulayan somut türü, fonksiyonun dönüş değeri olarak kullanabilirsiniz. Ancak, kapanışlarla bunu yapamazsınız çünkü kapanışların döndürülebilecek somut bir türü yoktur; örneğin, `fn` fonksiyon işaretçisini dönüş türü olarak kullanmanız yasaktır.

Aşağıdaki kod doğrudan bir kapanış döndürmeye çalışır, ancak derlenmeyecektir:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-18-returns-closure/src/lib.rs}}
```

Derleyici hatası şöyledir:

```console
{{#include ../listings/ch20-advanced-features/no-listing-18-returns-closure/output.txt}}
```

Hata tekrar `Sized` özelliğine atıfta bulunuyor! Rust, kapanışı saklamak için ne kadar alana ihtiyaç duyacağını bilmemektedir. Daha önce bu sorunun bir çözümünü gördük. Bir özellik nesnesi kullanabiliriz:

```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-19-returns-closure-trait-object/src/lib.rs}}
```

Bu kod gayet güzel bir şekilde derlenecektir. Özellik nesneleri hakkında daha fazla bilgi için, 19. bölümdeki [“Farklı Türlerin Değerlerine İzin Veren Özellik Nesnelerini Kullanma”][using-trait-objects-that-allow-for-values-of-different-types] bölümüne bakın.

Sonraki bölümde, makrolara bakalım! 

[advanced-traits]:
ch20-03-advanced-traits.html#advanced-traits
[enum-values]: ch06-01-defining-an-enum.html#enum-values
[using-trait-objects-that-allow-for-values-of-different-types]:
ch18-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types