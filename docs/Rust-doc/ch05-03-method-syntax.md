## Yöntem Söz Dizimi

*Yöntemler*, işlevlere benzerdir: `fn` anahtar kelimesi ve bir ad ile tanımlarız, parametre alabilirler ve bir döndürme değeri olabilir, ayrıca başka bir yerden çağrıldığında çalışan bazı kod içerirler. İşlevlerin aksine, yöntemler bir yapı (ya da bir enum veya trait nesnesi, bunları [Bölüm 6][enums] ve [Bölüm 17][trait-objects]'da kapsayacağız) bağlamında tanımlanır ve ilk parametreleri her zaman `self`’dir, bu da yöntem çağrıldığı yapı örneğini temsil eder.

### Yöntem Tanımlama

`Rectangle` örneğini parametre olarak alan `area` işlevini değiştirelim ve bunun yerine `Rectangle` yapısında tanımlanan bir `area` yöntemi oluşturalım, bu Listing 5-13'te gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-13/src/main.rs}}
```



Yöntemi `Rectangle` bağlamında tanımlamak için `Rectangle` için bir `impl` (uygulama) bloğu başlatırız. Bu `impl` bloğunun içindeki her şey `Rectangle` tipiyle ilişkilendirilecektir. Ardından `area` işlevini `impl` süslü parantezlerinin içine taşırız ve imzada ilk (ve bu durumda tek) parametreyi `self` olarak değiştiririz. `main` içinde `area` işlevini çağırdığımız ve `rect1`'i argüman olarak geçtiğimiz yerde, yerine *yöntem söz dizimini* kullanarak `Rectangle` örneğimizdeki `area` yöntemini çağırabiliriz. Yöntem sözdizimi bir örneğin sonrasında gelir: noktayı ekleriz ve ardından yöntem adını, parantezleri ve argümanları ekleriz.

:::tip
*Yöntem sözdizimini kullanmak, kodunuza açıklık ve okunabilirlik katacaktır.*
:::

`area` imzasında, `rectangle: &Rectangle` yerine `&self` kullanırız. `&self`, aslında `self: &Self` için kısaltmadır. Bir `impl` bloğu içinde, `Self` tipi, `impl` bloğunun hangi tipe ait olduğunu belirten bir takma addır. Yöntemlerin ilk parametreleri olarak `Self` tipinde bir `self` adlı parametreye sahip olmaları gerekir, bu yüzden Rust, bu durumu yalnızca `self` ismi ile ilk parametre alanında kısaltmanıza izin verir. Bu noktada `self` kısaltmasının önüne `&` koymamız gerektiğini unutmayın; bu, bu yöntinin `Self` örneğini ödünç aldığını göstermek içindir, tıpkı `rectangle: &Rectangle` gibi. Yöntemler, `self`'in sahipliğini alabilir, `self`'i değişmez olarak ödünç alabilir, burada yaptığımız gibi veya `self`'i değiştirilebilir olarak ödünç alabilir; diğer tüm parametreler gibi.

Burada `&self`'i seçtik çünkü işlev versiyonunda kullandığımız `&Rectangle` ile aynı sebepten: sahiplik almak istemiyoruz ve yalnızca yapının verilerini okumak istiyoruz, yazmak istemiyoruz. Eğer yöntem üzerinde çağrıda bulunduğumuz örneği değiştirmek isteseydik, o zaman ilk parametre olarak `&mut self` kullanırdık. İlk parametre olarak sadece `self` kullanarak bir örneğin sahipliğini alan bir yöntem oluşturmak nadirdir; bu teknik genellikle yöntemin `self`'i başka bir şeye dönüştürdüğünde kullanılır ve siz orijinal örneğin çağrıcı tarafından kullanılmasını önlemek istersiniz.

> **Ana neden:**
> Fonksiyonlar yerine yöntemler kullanmanın ana nedeni, yöntem söz dizimi sağlamak ve her yöntem imzasında `self`'in türünü tekrarlamaya gerek kalmamış olmasıdır. Bir tür örneği ile yapabileceğimiz her şeyi bir `impl` bloğunda topladık, böylece kodumuzu kullanan kişiler için `Rectangle`'ın yeteneklerini kütüphanemizde çeşitli yerlerde aramak zorunda kalmadılar.

Bir yönteme, yapının alanlarından biri ile aynı ismi verme seçeneğimiz olduğunu unutmayın. Örneğin, `Rectangle` üzerinde `width` adıyla tanımlanmış bir yöntem oluşturabiliriz:



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/no-listing-06-method-field-interaction/src/main.rs:here}}
```



Burada, `width` yöntemi, örneğin `width` alanındaki değerin `0`'dan büyük olması durumunda `true`, `0` olması durumunda `false` döndürmesi için seçiyoruz: aynı isimde bir alanı bir yöntemde herhangi bir amaç için kullanabiliriz. `main` içinde `rect1.width`'i parantezlerle takip ettiğimizde, Rust bunun yöntem `width` olduğunu anlar. Parantez kullanmadığımızda ise, Rust bunun alan `width` olduğunu anlar.

:::note
Genellikle, ama her zaman değil, bir yönteme alan ile aynı ismi verirken, yalnızca alan içindeki değeri döndürmesini ve başka bir şey yapmamasını isteriz. Bu tür yöntemler *getter* olarak adlandırılır.
:::

Getter'lar kullanışlıdır çünkü alanı özel tutabilir ancak yöntemi genel yapabilir ve böylece o alanın türün genel API'sinin bir parçası olarak yalnızca okunabilir erişim sağlarız. Genel ve özel olanı, bir alanın veya yöntemin genel veya özel olarak nasıl belirteceğimizi [Bölüm 7][public]'de tartışacağız.

> ### `->` Operatörü Nerede?
>
> C ve C++'da, yöntemleri çağırmak için iki farklı operatör kullanılır: bir yöntem çağırıyorsanız doğrudan nesnenin üzerindeyseniz `.` ile, nesneye işaret eden bir işaretçi ile çağırıyorsanız `->` kullanırsınız ve önce işaretçiyi çözmeniz gerekir. Başka bir deyişle, `object` bir işaretçi ise, `object->something()` ifadesi `(*object).something()` ifadesine benzer.
>
> Rust'ın `->` operatörüne eşdeğeri yoktur; bunun yerine, Rust'ın *otomatik referans alma ve dereferanslama* adında bir özelliği vardır. Yöntem çağırmak, Rust'ta bu davranışın bulunduğu birkaç yerden biridir.
>
> İşte bunun nasıl çalıştığı: bir yöntemi `object.something()` ile çağırdığınızda, Rust otomatik olarak `&`, `&mut` veya `*` ekler, böylece `object` yöntem imzasıyla eşleşir. Başka bir deyişle, aşağıdakiler aynıdır:
>
> ```rust
> # #[derive(Debug,Copy,Clone)]
> # struct Point {
> #     x: f64,
> #     y: f64,
> # }
> #
> # impl Point {
> #    fn distance(&self, other: &Point) -> f64 {
> #        let x_squared = f64::powi(other.x - self.x, 2);
> #        let y_squared = f64::powi(other.y - self.y, 2);
> #
> #        f64::sqrt(x_squared + y_squared)
> #    }
> # }
> # let p1 = Point { x: 0.0, y: 0.0 };
> # let p2 = Point { x: 5.0, y: 6.5 };
> p1.distance(&p2);
> (&p1).distance(&p2);
> ```
>
> İlk örnek çok daha temiz görünüyor. Bu otomatik referans alma davranışı, yöntemlerin net bir alıcıya sahip olması sayesinde çalışır—`self` tipinin türü. Alıcı ve bir yöntemin adı verildiğinde, Rust, yönteminin okuma (`&self`), değiştirme (`&mut self`) veya tüketme (`self`) olup olmadığını kesin bir şekilde anlayabilir. Rust'ın yöntem alıcıları için devretmeyi örtük hale getirmesi, sahipliği pratikte ergonomik hale getirmenin büyük bir parçasıdır.

### Daha Fazla Parametreye Sahip Yöntemler

Yöntemleri kullanmayı pratik yaparak `Rectangle` yapısına ikinci bir yöntem ekleyelim. Bu sefer, bir `Rectangle` örneğinin başka bir `Rectangle` örneğini almasını ve eğer ikinci `Rectangle` kendisi içinde tamamen sığabiliyorsa `true`, aksi takdirde `false` döndürmesini istiyoruz. Yani, `can_hold` yöntemini tanımladıktan sonra, Listing 5-14'te gösterilen programı yazabilmeyi istiyoruz.



```rust,ignore
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-14/src/main.rs}}
```



Beklenen çıktı aşağıdaki gibi olacaktır; çünkü `rect2`'nin her iki boyutu da `rect1`'in boyutlarından daha küçüktür, ancak `rect3` `rect1`’den daha geniştir:

```text
rect1 rect2'yi tutabilir mi? true
rect1 rect3'ü tutabilir mi? false
```

Bir yöntemi tanımlamak istediğimizi biliyoruz, bu nedenle `impl Rectangle` bloğu içinde olacaktır. Yöntem adı `can_hold` olacak ve başka bir `Rectangle`’e değişmez bir borç alacaktır. Parametrenin tipini, yöntemi çağıran kodu inceleyerek anlayabiliriz: `rect1.can_hold(&rect2)` ifadesi, `&rect2`'yi geçerek, `Rectangle`'in bir örneğine değişmez bir borç verir. Bu mantıklıdır çünkü yalnızca `rect2`'yi okumamız gerekiyor (yazmamız gerekirse değiştirilebilir bir borca ihtiyaç duyardık) ve `main`'in `rect2`'nin sahipliğini korumasını istiyoruz; dolayısıyla `can_hold` yöntemini çağırdıktan sonra tekrar kullanabilelim. `can_hold`'in dönüş değeri bir Boolean olacaktır ve uygulama, `self`'in genişliğinin ve yüksekliğinin, diğer `Rectangle`'in genişliği ve yüksekliğinden sırasıyla daha büyük olduğunu kontrol edecektir. Listing 5-13'teki `impl` bloğuna yeni `can_hold` yöntemini ekleyelim, bu Listing 5-15'te gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-15/src/main.rs:here}}
```



Bu kodu Listing 5-14'teki `main` fonksiyonu ile çalıştırdığımızda istediğimiz çıktıyı alacağız. Yöntemler birden fazla parametre alabilir ve bu parametreleri, `self` parametresinden sonra imzaya ekleyebiliriz; bu parametreler işlevlerdeki parametreler gibi çalışır.

### İlişkili İşlevler

Bir `impl` bloğu içinde tanımlanan tüm işlevlere *ilişkili işlevler* denir çünkü bunlar `impl`in ardından gelen türle ilişkilidir. Kendileri ile çalışması için bir örneğe ihtiyaç duymadıklarından, ilk parametre olarak `self` almayan ilişkili işlevler tanımlayabiliriz. Bunun gibi zaten bir işlev kullandık: `String` tipi üzerinde tanımlanan `String::from` işlevi.

Yöntem olmayan ilişkili işlevler genellikle yeni bir yapı örneği döndüren yapıcılarda kullanılır. Bu işlevler sık sık `new` olarak adlandırılır, fakat `new` özel bir isim değildir ve dille birlikte entegre değildir. Örneğin, bir boyut parametresine sahip `square` adında bir ilişkili işlev sağlamayı seçebiliriz ve bunu hem genişlik hem de yükseklik olarak kullanarak bir kare `Rectangle` oluşturmayı kolaylaştırırız; bu nedenle aynı değeri iki kez belirtmek zorunda kalmayız:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/no-listing-03-associated-functions/src/main.rs:here}}
```

Dönüş tipindeki ve işlevin gövdesindeki `Self` anahtar kelimeleri, bu durumda `impl` anahtar kelimesinin ardından gelen türün takma adlarıdır; bu durum `Rectangle`dır.

:::info
Bu ilişkili işlevi çağırmak için yapı adının `::` sözdizimini kullanırız; `let sq = Rectangle::square(3);` bir örnektir.
:::

Bu işlev, yapı tarafından adlandırılmıştır: `::` sözdizimi hem ilişkili işlevler hem de modüller tarafından yaratılan ad alanları için kullanılır. Modülleri [Bölüm 7][modules]'de tartışacağız.

### Birden Fazla `impl` Bloğu

Her yapının birden fazla `impl` bloğuna sahip olmasına izin verilir. Örneğin, Listing 5-15, her yöntemi kendi `impl` bloğuna sahip gösteren Listing 5-16 ile eşdeğerdir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-16/src/main.rs:here}}
```



Bu yöntemleri burada birden fazla `impl` bloğuna ayırmak için bir neden yoktur, ancak bu geçerli bir sözdizimidir. Birden fazla `impl` bloğunun yararlı olacağı bir durumu, genel türler ve traitler üzerinde tartıştığımız Bölüm 10'da göreceğiz.

## Özet

Yapılar, alanınıza anlamlı özel türler oluşturmanıza olanak tanır. Yapıları kullanarak, birbiriyle ilişkili veri parçalarını bir arada tutabilir ve her parçayı adlandırarak kodunuzu net hale getirebilirsiniz. `impl` bloklarında, türünüzle ilişkili işlevler tanımlayabilir ve yöntemler, yapı örneklerinin sahip olduğu davranışları belirlemenize izin veren bir tür ilişkili işlevdir.

:::warning
Ancak, yapılar, özel türler oluşturmanın tek yolu değildir: Rust'ın enum özelliğine dönelim ve aracınıza başka bir araç ekleyelim.
:::

[enums]: ch06-00-enums.html
[trait-objects]: ch18-02-trait-objects.md
[public]: ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#exposing-paths-with-the-pub-keyword
[modules]: ch07-02-defining-modules-to-control-scope-and-privacy.html