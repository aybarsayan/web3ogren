

## `match` Kontrol Akışı Yapısı

Rust, bir değeri bir dizi desenle karşılaştırmanıza ve hangi desene uyan koda göre kod çalıştırmanıza olanak tanıyan son derece güçlü bir kontrol akışı yapısı olan `match`'e sahiptir. Desenler, literal değerler, değişken adları, yabaniler ve daha birçok şeyden oluşabilir; [Bölüm 18][ch19-00-patterns] tüm farklı desen türlerini ve ne işe yaradıklarını kapsar. 

:::info
`match`'in gücü, desenlerin anlatım gücünden ve derleyicinin tüm olası durumların ele alındığını doğrulamasından gelir.
:::

Bir `match` ifadesini, jetonları sınıflandıran bir makineye benzetebilirsiniz: jetonlar, üzerinde çeşitli boyutlarda delikler bulunan bir raydan kayar ve her jeton, sığabileceği ilk deliğe düşer. Benzer şekilde, değerler bir `match` içindeki her desenden geçer ve değer “uyduğu” ilk desende, yürütme sırasında kullanılmak üzere ilişkili kod bloğuna düşer.

> **Anahtar Nokta:** Değerler bir `match` ifadesinde sıralı bir şekilde kontrol edilir ve ilk eşleşme bulunduğunda ilgili kod çalıştırılır.  
> — Rust Dokümantasyonu

Jetonlardan bahsetmişken, gelin bir örnek olarak onları kullanalım! Bilinmeyen bir ABD jetonunu alan ve sayma makinesi gibi, hangi jeton olduğunu belirleyen ve değerini santim olarak döndüren bir fonksiyon yazabiliriz. Bunu Liste 6-3'te göstermiştir.



```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-03/src/main.rs:here}}
```



`value_in_cents` fonksiyonundaki `match`'i inceleyelim. İlk olarak `match` anahtar kelimesini, bu durumda `coin` değerini izleyen bir ifadeyle listeliyoruz. Bu, `if` ile kullanılan bir koşullu ifadeye çok benziyor, ancak büyük bir fark var: `if` ile koşul, Boolean değerine dönüştürülmelidir, ancak burada herhangi bir tür olabilir. Bu örnekte `coin`'in türü, ilk satırda tanımladığımız `Coin` enum'udur.

Sonra `match` kolları gelir. Bir kol, bir desen ve bazı koddan oluşan iki kısımdan oluşur. Buradaki ilk kol, `Coin::Penny` değerini içeren bir desene sahiptir ve ardından deseni ve çalıştırılacak kodu ayıran `=>` operatörü gelir. Bu durumda kod sadece `1` değeridir. Her kol, bir sonraki koldan virgülle ayrılır.

`match` ifadesi çalıştığında, sonuç değeri her kolun desenine karşı sırayla karşılaştırılır. Eğer bir desen değerle eşleşirse, o desene karşılık gelen kod çalıştırılır. Eğer o desen değerle eşleşmezse, yürütme bir jeton sınıflandırma makinesi gibi bir sonraki kola geçer. Ne kadar çok kola ihtiyacımız varsa o kadar fazla kol ekleyebiliriz: Liste 6-3'teki `match`’te dört kol vardır.

:::tip
Her kolun ilişkili kodu bir ifadedir ve eşleşen kolun ifadelerinin sonuç değeri, tüm `match` ifadesi için döndürülen değerdir.
:::

Eğer kol kodu kısa ise, genellikle süslü parantez kullanmayız; Liste 6-3’te her kol sadece bir değer döndürdüğü için böyle. Eğer bir `match` kolunda birden fazla kod satırı çalıştırmak isterseniz, süslü parantezleri kullanmanız gerekir ve kolun ardından gelen virgül isteğe bağlıdır. Örneğin, aşağıdaki kod `Coin::Penny` ile metod her çağrıldığında "Şanslı kuruş!" yazdırır, ancak yine de blokun son değeri olan `1`'i döndürür:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-08-match-arm-multiple-lines/src/main.rs:here}}
```

---

### Değerlere Bağlanan Desenler

Diğer bir faydalı özellik ise, `match` kollarının eşleşen desenlerin değerlerine bağlanabilmesidir. Bu, enum varyantlarından değerleri çıkarmamıza olanak tanır.

Bir örnek vermek gerekirse, enum varyantlarımızdan birini içinde veri tutacak şekilde değiştirelim. 1999'dan 2008'e kadar, Amerika Birleşik Devletleri, bir tarafında 50 eyaletin farklı tasarımlarının bulunduğu çeyrekleri basmıştır. Diğer madeni paralar eyalet tasarımlarına sahip olmadığından, yalnızca çeyreklerin bu ekstra değeri vardır. 

:::note
`Quarter` varyantını içine `UsState` değeri alacak şekilde değiştirerek bu bilgiyi `enum`'umuza ekleyebiliriz; bunu Liste 6-4'te göstermişiz.
:::



```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-04/src/main.rs:here}}
```



Bir arkadaşımızın 50 eyalet çeyreğini toplamaya çalıştığını hayal edelim. Bozuk paralarımızı para türüne göre ayırırken, her çeyreğin ilişkili olduğu eyaletin adını sesli olarak söyleyeceğiz ki eğer arkadaşımızda yoksa, koleksiyonuna ekleyebilsin.

Bu kod için `match` ifadesinde, `Coin::Quarter` varyantının değerlerine uyan bir deseni bağlayacak `state` adında bir değişken ekliyoruz. Bir `Coin::Quarter` eşleştiğinde, `state` değişkeni o çeyreğin eyalet değerine bağlanır. Sonra bu bağı `println!` ifadesinde kullanabiliriz, şöyle:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-09-variable-in-pattern/src/main.rs:here}}
```

`value_in_cents(Coin::Quarter(UsState::Alaska))` çağrıldığında, `coin` `Coin::Quarter(UsState::Alaska)` olacaktır. O değeri her `match` koluyla karşılaştırdığımızda, `Coin::Quarter(state)`'e ulaşana kadar hiçbiri eşleşmez. O noktada `state` için bağlanma, `UsState::Alaska` değerine sahip olacaktır. Sonra bu bağı `println!` ifadesinde kullanarak, `Coin` enum varyantından `Quarter` için iç değeri almış oluruz.

---

### `Option` ile Eşleşme

Önceki bölümde `Option` kullanırken `Some` durumunun içindeki `T` değerini almak istemiştik; `Option`'yi `match` kullanarak ele alabiliriz, tıpkı `Coin` enum'unda yaptığımız gibi! Jetonları karşılaştırmak yerine, `Option`'nin varyantlarını karşılaştıracağız, ancak `match` ifadesinin çalışma şekli aynı kalacaktır.

Diyelim ki bir `Option` alan ve içinde bir değer varsa, o değere 1 ekleyen bir fonksiyon yazmak istiyoruz. İçinde değer yoksa, fonksiyon `None` değerini döndürmeli ve herhangi bir işlem yapmamalıdır.

:::tip
Bu fonksiyon yazması çok kolaydır, `match` sayesinde, ve Liste 6-5 gibi görünebilir.
:::

` üzerinde `match` ifadesi kullanan bir fonksiyon">

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-05/src/main.rs:here}}
```

`plus_one`'ın ilk yürütmesini daha ayrıntılı inceleyelim. `plus_one(five)` çağrıldığında, `plus_one` içindeki `x` değişkeninin değeri `Some(5)` olacaktır. Daha sonra bunu her `match` kolu ile karşılaştırıyoruz:

```rust,ignore
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-05/src/main.rs:first_arm}}
```

`Some(5)` değeri `None` deseniyle eşleşmediği için bir sonraki kola geçiyoruz:

```rust,ignore
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-05/src/main.rs:second_arm}}
```

`Some(5)` `Some(i)` ile eşleşiyor mu? Evet! Aynı varyanta sahibiz. `i`, `Some` içindeki değere bağlanır, bu nedenle `i` değeri `5` alır. Daha sonra eşleşen kolun içindeki kod çalıştırılır, bu nedenle değeri `i`'ye 1 ekliyoruz ve toplamımız olan `6` ile yeni bir `Some` değeri oluşturuyoruz.

---

Şimdi Liste 6-5'teki `plus_one` fonksiyonunun ikinci çağrısını ele alalım; burada `x` değeri `None`. `match`'e giriyoruz ve ilk kola karşılaştırıyoruz:

```rust,ignore
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-05/src/main.rs:first_arm}}
```

Eşleşiyor! Eklemek için hiçbir değer yok, bu nedenle program durur ve sağdaki `=>` ifadesinde `None` değerini döndürür. İlk kolda eşleştiği için diğer kollar karşılaştırılmaz.

`match` ve enum'ları birleştirmek birçok durumda kullanışlıdır. Rust kodunda bu deseni sıkça göreceksiniz: bir enum'a karşı `match` yapın, veri içindeki bir değişkeni bağlayın ve ardından buna bağlı olarak kod çalıştırın. İlk başta biraz karmaşık gelebilir, ancak alıştığınızda, diğer dillerde bunu istediğinizi düşüneceksiniz. Kullanıcıların favorisi olmaya devam ediyor.

---

### Eşleşmeler Kapsayıcıdır

`match`'in başka bir yönünü tartışmamız gerekiyor: kolların desenleri tüm olasılıkları kapsamalıdır. Aşağıdaki `plus_one` fonksiyonumuzun bu hatalı versiyonunu düşünün; bu derlenmeyecek:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-10-non-exhaustive-match/src/main.rs:here}}
```

`None` durumunu ele almadığımız için bu kod bir hata oluşturacaktır. Neyse ki, Rust'ın yakalayabileceği bir hata. Bu kodu derlemeye çalıştığımızda bu hatayı alırız:

```console
{{#include ../listings/ch06-enums-and-pattern-matching/no-listing-10-non-exhaustive-match/output.txt}}
```

Rust, her olası durumu kapsamadığımızı bilir ve hatta hangi deseni unuttuğumuzu da bilebilir! Rust'ta eşleşmeler *kapsayıcıdır*: kodun geçerli olması için her olasılığın tüketilmesi gerekir. Özellikle `Option` durumunda, Rust, `None` durumunu açıkça ele almayı unutmamızı önleyerek bizi bir değerimiz olduğunu varsaymaktan korur; böylece önceki hatayı işlemenin mümkün olmadığını garanti eder.

---

### Genel Kapsayıcı Desenler ve `_` Yer Tutucu

Enum'ları kullanarak, belirli birkaç değer için özel işlemler alabiliriz, ancak diğer tüm değerler için tek bir varsayılan işlem alırız. Bir oyunu uyguladığımızı düşünelim; eğer bir zar atışında 3 gelir ise, oyuncunuz hareket etmez, bunun yerine yeni bir şık şapka alır. Eğer 7 gelirse, oyuncunuz şık bir şapkayı kaybeder. Diğer tüm değerler için oyuncunuz, oyun tahtasında o kadar alan hareket eder. 

:::tip
İşte bu mantığı uygulayan bir `match`, zar atışının sonucunu önceden belirlenmiş bir değere bağladığımızı ve tüm diğer mantıkları gövdesi olmayan fonksiyonlar olarak bıraktığımızı gösterir:
:::

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-15-binding-catchall/src/main.rs:here}}
```

İlk iki kolda desenler, literal değerler `3` ve `7`'dir. Tüm diğer olası değerleri kapsayan son kolun deseni, `other` adını verdiğimiz bir değişkendir. `other` kolu için çalışacak kod değişkeni, `move_player` fonksiyonuna geçirir.

Bu kod derlenir; çünkü `u8` değerinin alabileceği tüm olası değerleri listelemiş olmasak bile, son desen tüm sayılara eşleşecektir. Bu genel kapsayıcı desen, `match`'in tükenmiş olma gereksinimini karşılar. Ti'yi, diğer desenlerden önce yerleştirmemiz gerektiğini unutmayın; çünkü desenler sırayla değerlendirilir. 

:::warning
Genel kapsayıcı kolu öne alırsak, diğer kollar asla çalışmaz. Bu nedenle Rust, bir genel kapsayıcıdan sonra kol eklersek bize uyarı verecektir!
:::

Rust, aynı zamanda bir genel kapsayıcı istemediğimiz ancak match'in içindeki değeri kullanmak istemediğimiz durumlarda kullanabileceğimiz bir desene sahiptir: `_` özel bir desen olup herhangi bir değere eşleşir ve o değere bağlanmaz. Bu, Rust'a o değeri kullanmayacağımızı belirtir; böylece Rust bize kullanılmayan bir değişken konusunda uyarıda bulunmaz.

Oyunun kurallarını değiştirelim: şimdi, eğer 3 veya 7 dışında bir şey atarsanız, yeniden atmalısınız. Genel kapsayıcı değeri kullanmamıza gerek kalmadı, bu nedenle kodumuzu `other` adlı değişken yerine `_` kullanarak değiştirebiliriz:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-16-underscore-catchall/src/main.rs:here}}
```

Bu örnek de kapsayıcılık gereksinimini karşılar; çünkü son kol, tüm diğer değerleri açıkça göz ardı etmektedir. Hiçbir şeyi unutmamış olduk.

Son olarak, oyunun kurallarını bir kez daha değiştiriyoruz; bu sefer 3 veya 7 dışında bir şey attığınızda, sıranızda başka hiçbir şey olmayacaktır. Bunu, önceki kol ile eşleşmeyen herhangi bir başka değeri kullanmak istemediğimizi belirtmek için birim değeri (bir tuple türünü, [“Tuple Türü”][tuples] bölümünde bahsettiğimiz) kullanarak ifade edebiliriz:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-17-underscore-unit/src/main.rs:here}}
```

Burada, daha önceki kol ile eşleşmeyen hiçbir başka değeri kullanmayacağımızı açıkça Rust'a belirtiyoruz ve bu durumda hiçbir kod çalıştırmak istemiyoruz.

Desenler ve eşleşmeler hakkında daha fazla bilgi vereceğiz [Bölüm 19][ch19-00-patterns]. Şimdi, `match` ifadesinin biraz çok kelime kullandığı durumlarda faydalı olabilecek `if let` sözdizimine geçiyoruz.

[tuples]: ch03-02-data-types.html#the-tuple-type

[ch19-00-patterns]: ch19-00-patterns.html