## Desen Örneklerinin Kullanılabileceği Tüm Yerler

Desenler Rust'ta birçok yerde ortaya çıkar ve bunları çoğu zaman farkında olmadan kullanıyorsunuz! Bu bölüm, desenlerin geçerli olduğu tüm yerleri tartışır.

### `match` Kolları

Bölüm 6'da tartışıldığı gibi, `match` ifadelerinin kollarında desenler kullanırız. Resmi olarak, `match` ifadeleri `match` anahtar kelimesi, eşleşilecek bir değer ve o değerin kolunun desenine uyması durumunda çalıştırılacak bir ifade içeren bir veya daha fazla eşleşme kolu ile tanımlanır, örneğin şöyle:

```text
match DEĞER {
    DESEN => İFADE,
    DESEN => İFADE,
    DESEN => İFADE,
}
```

Örneğin, aşağıda `x` değişkenindeki bir `Option` değerine uyan 6-5 numaralı listeden `match` ifadesini görebilirsiniz:

```rust,ignore
match x {
    None => None,
    Some(i) => Some(i + 1),
}
```

Bu `match` ifadesindeki desenler, her bir okun solundaki `None` ve `Some(i)`'dir.

**:::note** `match` ifadeleri için bir gereklilik, **kapsayıcı** olmalarıdır; yani, `match` ifadesindeki değer için tüm olasılıkların göz önünde bulundurulması gerekir. Her olasılığı kapsadığınızdan emin olmanın bir yolu, son kola genel bir desen koymaktır: örneğin, herhangi bir değeri eşleştiren bir değişken adı asla başarısız olamaz ve dolayısıyla kalan tüm durumları kapsar.

Belirli desen _ her şeyi eşleştirir, ancak hiçbir zaman bir değişkene bağlanmaz; bu nedenle genellikle son `match` kolunda kullanılır. `_` deseni, belirtilmemiş herhangi bir değeri göz ardı etmek istediğinizde faydalı olabilir. Bu bölümü ilerleyen sayfalarda [“Desenlerde Değerleri Göz Ardı Etmek”][ignoring-values-in-a-pattern] bölümünde daha ayrıntılı olarak inceleyeceğiz.

### Koşullu `if let` İfadeleri

Bölüm 6'da, `if let` ifadelerini esas olarak yalnızca bir durumu eşleştiren bir `match` yazmanın daha kısa bir yolu olarak kullanmanın yolunu tartıştık. Opsiyonel olarak, `if let` ifadelerinin, `if let`'deki desen eşleşmediğinde çalıştırılacak kod içeren ilgili bir `else` içermesi mümkündür.

#### Koşulların Birleştirilmesi
19-1 numaralı liste, `if let`, `else if` ve `else if let` ifadelerini karıştırmanın mümkün olduğunu gösteriyor. Bunu yapmak, `match` ifadesinden daha fazla esneklik sağlar, çünkü `match` ifadesinde yalnızca desenlerle karşılaştırılacak bir değeri ifade edebiliriz. Ayrıca, Rust'ta bir dizi `if let`, `else if`, `else if let` kollarındaki koşulların birbiriyle ilişkili olması gerekmez.

19-1 numaralı listedeki kod, birkaç koşul için yapılan kontroller serisine dayanarak arka plan renginin ne olacağını belirliyor. Bu örnekte, gerçek bir programın alabileceği sabit değerler içeren değişkenler oluşturduk.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-01/src/main.rs}}
```



Kullanıcı bir favori renk belirtirse, o renk arka plan olarak kullanılır. Favori renk belirtilmezse ve bugün Salı ise, arka plan rengi yeşil olur. Aksi takdirde, kullanıcı yaşını bir dize olarak belirtirse ve bunu başarıyla bir sayıya dönüştürebiliyorsak, renk sayının değerine bağlı olarak mor veya turuncu olur. Bu koşullardan hiçbiri sağlanmazsa, arka plan rengi mavi olur.

Bu koşullu yapı, karmaşık gereksinimleri desteklememizi sağlar. **:::tip** Burada kullandığımız sabit değerlerle bu örnek, `Arka plan rengi olarak mor kullanılıyor` yazdırır.

Görüyorsunuz ki `if let` aynı zamanda `match` kollarında olduğu gibi gölgeli değişkenler de tanıtabilir: `if let Ok(age) = age` satırı, `Ok` varyantının içindeki değeri barındıran yeni bir gölgeli `age` değişkeni tanıtır. Bu, `if age > 30` koşulunu o blok içinde yerleştirmemiz gerektiği anlamına gelir: bu iki koşulu `if let Ok(age) = age && age > 30` şeklinde birleştiremeyiz. Karşılaştırmak istediğimiz gölgeli `age`, yeni kapsam eğrisi açıldığında geçerli olur.

**:::warning** `if let` ifadelerinin dezavantajı, derleyicinin kapsayıcılığı kontrol etmemesi; oysa `match` ifadelerinde kontrol edilir. Son `else` bloğunu çıkarırsak ve dolayısıyla bazı durumları ele almazsak, derleyici bizi olası bir mantık hatası konusunda uyarmaz.

### `while let` Koşullu Döngüler

`if let` ifadesine benzer şekilde, `while let` koşullu döngüsü bir desen eşleşmeye devam ettikçe bir `while` döngüsünün çalışmasına izin verir. `while let` döngüsünü ilk olarak Bölüm 17'de, bir akış yeni değerler ürettiği sürece döngüde kalmak için kullandığımızda gördük. Benzer şekilde, 19-2 numaralı listede, bir `Result` kontrol eden bir `while let` döngüsü, ama bu durumda bir `Option` yerine, gösteriyoruz.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-02/src/main.rs:here}}
```



Bu örnek 1, 2 ve 3 değerlerini yazdırır. **:::info** Bölüm 16'da `recv`'i gördüğümüzde hatayı doğrudan çıkarttık veya onunla bir `for` döngüsü kullanarak bir iteratör olarak etkileşime geçtik. Ancak 19-2 numaralı liste de gösteriyor ki, `while let` de kullanabiliriz; çünkü `recv` yöntemi gönderici mesajlar üretmeye devam ettikçe `Ok` döndürüyor ve gönderici tarafı bağlantısını kesildiğinde `Err` üretir.

### `for` Döngüleri

Bir `for` döngüsünde, `for` anahtar kelimesinden hemen sonra gelen değer bir desendir. Örneğin, `for x in y` ifadesinde `x` desenidir. 19-3 numaralı liste, bir `for` döngüsünde bir deseni nasıl kullanarak bir demeti parçalamayı gösterir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-03/src/main.rs:here}}
```



19-3 numaralı listedeki kod aşağıdakileri yazdıracaktır:

```console
{{#include ../listings/ch19-patterns-and-matching/listing-19-03/output.txt}}
```

Bir iteratörü, onun bir değeri ve o değerin indeksini üretmesi için `enumerate` yöntemi ile uyarlıyoruz; sonuçta bir demet elde ediyoruz. Üretilen ilk değer `(0, 'a')` demetidir. Bu değer `(index, value)` desenine eşleştirildiğinde, `index` 0 ve `value` `'a'` olur ve çıktının ilk satırını yazdırır.

### `let` İfadeleri

Bu bölümden önce, yalnızca desenleri `match` ve `if let` ile nasıl kullanacağımızı açıkça tartıştık, ancak aslında, `let` ifadeleri de dahil olmak üzere başka yerlerde de desenleri kullandık. Örneğin, aşağıdaki basit değişken atamasına bir `let` ifadesi ile bakalım:

```rust
let x = 5;
```

Bu tür bir `let` ifadesi kullandığınız her seferde desenleri kullanıyorsunuz, ancak bunun farkında olmamış olabilirsiniz! Daha resmi bir şekilde, bir `let` ifadesi şöyle görünür:

```text
let DESEN = İFADE;
```

`let x = 5;` gibi ifadelerde, `PATTERN` alanında bir değişken adı olduğunda, bu değişken adı, aslında çok basit bir desen şeklidir. Rust, ifadeyi desenle karşılaştırır ve bulduğu isimleri atar. Yani `let x = 5;` örneğinde, `x`, burada "buraya uyanı değişken `x`'e bağla" anlamına gelen bir desendir. `x` ismi tüm desen olduğundan, bu desen aslında "değer ne olursa olsun her şeyi değişken `x`'e bağla" anlamına gelir.

**:::info** `let` ifadesinin desen eşleştirme yönünü daha net görmek için, 19-4 numaralı listeyi ele alalım; bu liste bir deseni kullanarak bir demeti parçalamak için `let` ifadesini kullanıyor.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-04/src/main.rs:here}}
```



Burada, bir demeti bir desenle eşleştiriyoruz. Rust, `(1, 2, 3)` değerini `(x, y, z)` deseni ile karşılaştırır ve değer desene uyar, böylece Rust `1` değerini `x`'e, `2` değerini `y`'ye ve `3` değerini `z`'ye bağlar. Bu demet desenini üç ayrı değişken deseni içeriyormuş gibi düşünebilirsiniz.

**:::warning** Desendeki eleman sayısı demetteki eleman sayısıyla eşleşmezse, genel tür eşleşmez ve derleme hatası alırız. Örneğin, 19-5 numaralı liste, üç elemanlı bir demeti iki değişkene parçalamaya çalışmanın örneğini gösterir; bu çalışmaz.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-05/src/main.rs:here}}
```



Bu kodu derleme girişiminde bulunmak, aşağıdaki tür hatasıyla sonuçlanır:

```console
{{#include ../listings/ch19-patterns-and-matching/listing-19-05/output.txt}}
```

Hatayı düzeltmek için, demetteki bir veya daha fazla değeri `_` veya `..` kullanarak göz ardı edebiliriz; bunu [“Desenlerde Değerleri Göz Ardı Etme”][ignoring-values-in-a-pattern] bölümünde göreceksiniz. Problemin, desendeki çok sayıda değişken olmasından kaynaklandığı durumlarda, türleri eşleştirmenin çözümü, değişken sayısını demetteki eleman sayısıyla eşitlemek için bazı değişkenleri kaldırmaktır.

### Fonksiyon Parametreleri

Fonksiyon parametreleri de desenler olabilir. 19-6 numaralı listede `i32` türünde bir `x` parametresi alan `foo` adında bir fonksiyon beyanı, artık alışıldık görünmelidir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-06/src/main.rs:here}}
```



`x` bölümü bir desendir! `let` ile yaptığımız gibi, bir fonksiyonun argümanlarında bir demeti desene eşleştirebiliriz. 19-7 numaralı liste, fonksiyona geçerken bir demetteki değerleri nasıl ayıracağını gösterir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-07/src/main.rs}}
```



Bu kod `Mevcut konum: (3, 5)` yazdırır. Değerler `&(3, 5)` deseni ile eşleşir, bu nedenle `x` değeri `3` ve `y` değeri `5` olur.

Desenleri, fonksiyon parametre listelerinde olduğu gibi, closure parametre listelerinde de aynı şekilde kullanabiliriz; çünkü closure'lar, Bölüm 13'te tartışıldığı gibi, fonksiyonlara benzer.

**:::note** Bu noktada, desenlerin nasıl kullanılacağına dair birkaç yolu gördünüz, ancak desenler her yerde aynı şekilde çalışmaz. Bazı yerlerde desenlerin kesinlikle karşı konulamaz olması gerekir; diğer durumlarda ise karşı konulabilir olabilirler. Bu iki kavramı sıradaki bölümlerde tartışacağız.

[ignoring-values-in-a-pattern]:
ch19-03-pattern-syntax.html#ignoring-values-in-a-pattern