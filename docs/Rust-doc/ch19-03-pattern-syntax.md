## Desen Paterni Söz Dizimi

Bu bölümde, desenlerde geçerli olan tüm söz dizimlerini topluyoruz ve hangisinin neden ve ne zaman kullanılacağını tartışıyoruz.

### Kesin Literalleri Eşleştirme

Bölüm 6'da gördüğünüz gibi, desenleri doğrudan literallere karşı eşleştirebilirsiniz. Aşağıdaki kod bazı örnekler vermektedir:

```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/no-listing-01-literals/src/main.rs:here}}
```

Bu kod `one` yazdırır çünkü `x` içindeki değer 1'dir. Bu söz dizimi, kodunuzun belirli bir somut değeri aldığında bir işlem yapması gerektiğinde faydalıdır.

### İsimli Değişkenleri Eşleştirme

:::info
İsimli değişkenler, herhangi bir değeri eşleştiren geçersiz kılınamaz desenlerdir ve kitabın birçok yerinde kullanılmıştır.
:::

Ancak, `eşleşme` ifadelerinde isimli değişkenleri kullandığınızda bir karmaşıklık vardır. `eşleşme` yeni bir kapsama alanı başlattığı için, `eşleşme` ifadesinin içindeki bir desende bir model olarak tanımlanan değişkenler, dışarıdaki aynı isimdeki değişkenlerin üzerine yazar; bu, tüm değişkenler için geçerlidir. Liste 19-11'de, `Some(5)` değeriyle `x` adında bir değişken ve `10` değeriyle `y` adında bir değişken tanımlıyoruz. Sonra, `x` değerine dayanan bir `eşleşme` ifadesi oluşturuyoruz. Kural kollarındaki desenlere ve sonunda `println!`'a bakın ve bu kod çalıştırılmadan ya da daha fazla okumadan kodun ne yazdıracağını tahmin etmeye çalışın.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-11/src/main.rs:here}}
```



:::note
`eşleşme` ifadesi çalıştığında neler olduğunu inceleyelim. İlk eşleşme kolundaki desen tanımlı `x` değerine uymadığı için kod devam eder.
:::

İkinci eşleşme kolundaki desen, `Some` değeri içindeki herhangi bir değerle eşleşecek yeni bir `y` adlı değişken tanıtır. `eşleşme` ifadesinin içindeki yeni kapsamda olduğumuz için, bu yeni `y` değişkeni, başlangıçta değer 10 olan `y` değişkeni değildir. Bu yeni `y` bağlamı, `x`'teki `Some` değerinin içindeki herhangi bir değeri eşleştirecektir. Dolayısıyla, bu yeni `y`, `x`'teki `Some`'ın iç değerine bağlanır. O değer `5` olduğundan, o kolun ifadeleri yürütülür ve `Matched, y = 5` yazdırır.

Eğer `x` değeri `Some(5)` yerine bir `None` değeri olsaydı, ilk iki kolun desenleri eşleşmeyecekti, dolayısıyla değer alt çizgiye eşleşecekti. Alt çizgi kolundaki desende `x` değişkenini tanımlamadığımızdan, ifadede `x` hala üstteki gölgelenmemiş `x` olur. Bu varsayımsal durumda, `eşleşme` `Default case, x = None` yazdırır.

:::warning
`eşleşme` ifadesi bittiğinde, kapsama alanı sona erer ve içteki `y`'nin kapsamı da sona erer. Son `println!`, `at the end: x = Some(5), y = 10` yazdırır.
:::

Dıştaki `x` ve `y` değişkenlerinin değerlerini karşılaştıran bir `eşleşme` ifadesi oluşturmak isteseydik, gölgeli bir değişken tanıtmak yerine bir `eşleşme` koruma koşulu kullanmak zorunda kalırdık. `eşleşme` korumaları hakkında daha sonra `“Ek Koşullar ile Eşleşme Koruma”` bölümünde konuşacağız.

### Birden Fazla Deseni Eşleştirme

:::tip
`eşleşme` ifadelerinde, `|` sözdizimini kullanarak birden fazla deseni eşleştirebilirsiniz; bu da *veya* operatörüdür.
:::

Örneğin, aşağıdaki kodda `x` değerini eşleşme kollarıyla karşılaştırıyoruz; bunlardan ilki *veya* seçeneğine sahiptir ki bu da `x` değerinin o kolun içindeki değerlerden birine eşleşmesi durumunda o kolun kodunun çalışacağı anlamına gelir:

```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/no-listing-02-multiple-patterns/src/main.rs:here}}
```

Bu kod `one or two` yazdırır.

### `..=` ile Değer Aralıklarını Eşleştirme

:::note
`..=` sözdizimi, kapsayıcı bir değer aralığına eşleşmemizi sağlar. Aşağıdaki kodda, bir desen belirli bir aralıktaki herhangi bir değere eşleşirse, o kol yürütülür:
:::

```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/no-listing-03-ranges/src/main.rs:here}}
```

Eğer `x`, 1, 2, 3, 4 veya 5 ise, ilk kol eşleşecektir. Bu sözdizimi, aynı fikirleri ifade ederken `|` operatörünü kullanmaktan daha kullanışlıdır; eğer `|` kullanmak zorunda olsaydık, `1 | 2 | 3 | 4 | 5` belirtmek zorunda kalırdık. Bir aralığı belirtmek çok daha kısadır, özellikle de 1 ile 1,000 arasında herhangi bir sayıyı eşleştirmek istiyorsak!

Derleyici, aralığın derleme zamanında boş olmadığını kontrol eder ve Rust’ın bir aralığın boş olup olmadığını belirleyebildiği tek türler `char` ve sayısal değerlerdir; bu nedenle aralıklar yalnızca sayısal veya `char` değerlerle kullanılır.

İşte `char` değerlerinden oluşan aralıkları kullanan bir örnek:

```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/no-listing-04-ranges-of-char/src/main.rs:here}}
```

Rust, `'c'` değerinin ilk desenin aralığı içinde olduğunu belirleyebilir ve `early ASCII letter` yazdırır.

### Değerleri Ayırmak için Desen Kullanma

Ayrıca, değerlerin parçalarını kullanmak için yapıları, enumları ve tuple'ları ayırmak üzere desenler kullanabiliriz. Her bir değeri inceleyelim.

#### Yapıları Ayırma

Liste 19-12, iki alanı olan bir `Point` yapısını gösterir; `x` ve `y`, bir `let` ifadesi ile bir desen kullanarak parçalara ayırabiliriz.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-12/src/main.rs}}
```



:::info
Bu kod, `p` yapısının `x` ve `y` alanlarının değerlerini eşleştiren `a` ve `b` adında değişkenler oluşturur. Bu örnek, desenin içindeki değişken adlarının yapının alan adlarıyla eşleşmesi gerekmiyor olduğunu gösterir.
:::

Ancak, hangi değişkenlerin hangi alanlardan geldiğini hatırlamayı kolaylaştırmak için değişken adlarının alan adları ile eşleşmesi yaygındır. Bu yaygın kullanım nedeniyle ve `let Point { x: x, y: y } = p;` yazmanın fazlasıyla tekrara sahip olması nedeniyle, Rust, yapı alanlarını eşleştiren desenler için bir kısayol sunar: yalnızca yapı alanının adını listelemeniz yeterlidir; desenden oluşturulan değişkenler aynı isimlere sahip olacaktır. Liste 19-13, Liste 19-12'deki kodla aynı şekilde davranır, ancak `let` deseninde yaratılan değişkenler `a` ve `b` yerine `x` ve `y`dir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-13/src/main.rs}}
```



Bu kod, `p` değişkeninin `x` ve `y` alanlarına karşılık gelen `x` ve `y` adında değişkenler oluşturur. Sonuç olarak, `x` ve `y` değişkenleri `p` yapısından gelen değerleri içerir.

Ayrıca, tüm alanlar için değişkenler oluşturmak yerine yapı deseninin bir parçası olarak literal değerlerle de ayırabiliriz. Bu sayede, bazı alanları belirli değerlere karşı test ederken diğer alanları ayıracak değişkenler oluşturabiliriz.

Liste 19-14'te, `Point` değerlerini üç duruma ayıran bir `eşleşme` ifadesi vardır: `x` ekseninde doğrudan yatan noktalar (bu, `y = 0` olduğunda doğrudur), `y` ekseninde (`x = 0`) veya ikisi de değil.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-14/src/main.rs:here}}
```



İlk kol, `y` alanı, değerinin literal `0` ile eşleşmesi durumunda `x` ekseninde yatan herhangi bir noktayı eşleştirir. Desen, bu kol için kodda kullanabileceğimiz `x` adında bir değişken oluşturmaya devam eder.

Benzer şekilde, ikinci kol, `y` ekseni üzerinde herhangi bir noktayı eşleştirir; bu, `x` alanı, değerinin `0` ile eşleşmesi durumunda ve `y` alanının değerini `y` olarak oluşturur. Üçüncü kol belirli bir literal belirtmez, bu nedenle diğer `Point` değerlerinin her birini eşleştirir ve hem `x` hem de `y` alanları için değişkenler oluşturur.

Bu örnekte, `p` değeri `x`'in 0 olduğu için ikinci kolu eşleştirir, bu nedenle bu kod `On the y axis at 7` yazdıracaktır.

:::danger
Bir `eşleşme` ifadesinin ilk eşleşen deseni bulduğunda kontrolleri durdurduğunu unutmayın; dolayısıyla `Point { x: 0, y: 0}` hem `x` ekseninde hem de `y` ekseninde yer almasında rağmen bu kod yalnızca `On the x axis at 0` yazdıracaktır.
:::

#### Enumları Ayırma

Bu kitapta enumları ayırdık (örneğin, Bölüm 6'daki Liste 6-5), ancak enumları ayırmanın nasıl olduğunu açıkça tartışmadık. Örnek olarak, Liste 19-15'te Liste 6-2'den `Message` enumunu kullanarak her iç değere ayıracak desenlerle bir `eşleşme` yazıyoruz.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-15/src/main.rs}}
```



Bu kod `Change the color to red 0, green 160, and blue 255` yazdırır. Diğer kolların kodunu görmek için `msg` değerini değiştirmeyi deneyin.

Herhangi bir veri içermeyen enum varyantları için, `Message::Quit` gibi, değeri daha fazla ayıramayız. Sadece literal `Message::Quit` değerine eşleşebiliriz ve o desende değişken yoktur.

Yapı benzeri enum varyantları için, `Message::Move` gibi, yapıları eşleştirmek için kullandığımız desen benzeri bir deseni kullanabiliriz. Varyant adı ardından süslü parantezler koyarak ve ardından alanları değişkenlerle listeliyoruz, böylece parçaları kodda bu kol için kullanmak üzere ayırıyoruz. Burada Liste 19-13'te olduğu gibi kısayol formu kullanıyoruz.

Tuple benzeri enum varyantları için, örneğin, bir eleman içeren `Message::Write` ve üç eleman içeren `Message::ChangeColor` için, desen, tuple'ları eşleştirmek için belirttiğimiz desenle benzerdir. Desendeki değişken sayısı, eşleştirdiğimiz varyanttaki eleman sayısıyla eşleşmelidir.

#### Yapıları ve Enumları Ayırma

Şu ana kadar, örneklerimiz, bir seferde yapı veya enumları eşleştiriyordu, ancak eşleştirme, iç içe geçmiş öğeler üzerinde de çalışabilir! Örneğin, Liste 19-15'teki kodu, `ChangeColor` mesajındaki RGB ve HSV renklerini destekleyecek şekilde yeniden yapılandırabiliriz, bu da Liste 19-16'da gösterilmektedir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-16/src/main.rs}}
```



`eşleşme` ifadesindeki ilk kolun deseni, `Color::Rgb` varyantını içeren bir `Message::ChangeColor` enum varyantını eşleştirir; ardından desen üç iç `i32` değerine bağlanır. İkinci kolun deseni de `Message::ChangeColor` enum varyantını eşleştirir, ancak içteki enum `Color::Hsv` olarak değişir. İki enumun dahil olduğu bir `eşleşme` ifadesinde bu karmaşık koşulları belirtebiliriz.

#### Yapıları ve Tuple'ları Ayırma

Ayrıca, karmaşık yollarla desen ayırma kavramını karıştırabilir ve birleştirebiliriz. Aşağıdaki örnek, bir tuple içinde yapıları ve tuple'ları iç içe kullanarak karmaşık bir ayrıştırma gösterir ve tüm temel değerleri ayrı olarak ayırır:

```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/no-listing-05-destructuring-structs-and-tuples/src/main.rs:here}}
```

Bu kod, karmaşık türleri bileşenlerine ayırarak ilgilendiğimiz değerleri ayrı olarak kullanmamıza olanak tanır.

:::tip
Desenlerle ayırma, değerlerin parçalarını, örneğin bir yapının her bir alanından gelen değerleri, birbirinden ayrı kullanmanın rahat bir yoludur.
:::

### Bir Desende Değerleri Yoksayma

:::info
Bir desende değerleri yok saymanın bazen faydalı olduğunu gördünüz; bu, bir `eşleşme` ifadesinin son kolundaki gibi, geriye kalan olası tüm değerleri karşılamak için bir yakalayıcı elde etmek için kullanışlıdır.
:::

Bir desende tüm değerleri veya değerlerin parçalarını yok saymak için birkaç yol vardır: `_` desenini kullanmak (bunu gördünüz), başka bir desen içinde `_` desenini kullanmak, ismi bir alt çizgi ile başlatan bir isim kullanmak veya bir değerin geriye kalan parçalarını yok saymak için `..` kullanmak. Bu desenlerden her birinin nasıl ve neden kullanılacağını keşfedelim.

#### `_` ile Bir Tüm Değeri Yok Sayma

Alt çizgiyi, herhangi bir değeri yakalayan ancak değere bağlanmayan bir joker desen olarak kullandık. Bu, özellikle bir `eşleşme` ifadesinin son kolu için faydalıdır, ancak istediğimiz herhangi bir desende, fonksiyon parametreleri dahil, kullanabiliriz; Liste 19-17'de gösterildiği gibi.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-17/src/main.rs}}
```



Bu kod, birinci argüman olarak geçirilen `3` değerini tamamen yok sayacak ve `This code only uses the y parameter: 4` yazdıracaktır.

Çoğu durumda, artık belirli bir fonksiyon parametresine ihtiyacınız kalmadığında, imzayı değiştirmek ve kullanılmayan parametreyi içermemek isteyeceksiniz. Bir fonksiyon parametresini yok saymak, örneğin, belirli bir tür imzasına ihtiyaç duyduğunuz ancak uygulama gövdesinde bir parametreye ihtiyacınız olmadığı durumlarda özellikle faydalı olabilir. Bu durumda, bir isim kullandığınızda olduğu gibi, kullanılmayan fonksiyon parametreleriyle ilgili bir derleyici uyarısını önleyebilirsiniz.

#### Bir Değerin Parçalarını Yoksayma için Alt Çizgi Kullanma

Ayrıca, yalnızca bir değerin parçasını yok saymak için bir başka desende `_` kullanabiliriz; örneğin, bir değerin yalnızca bir kısmını test etmek ve diğer parçaların ilgili kodda kullanılmaması durumunda. Liste 19-18, bir ayar değerini yönetmekle ilgili olan koda işaret eder. İş gereksinimleri, kullanıcının mevcut bir ayarın özelleştirmesini değiştirmesine izin verilmemesi ancak ayarı kaldırabilmesi ve şayet mevcut değilse bir değer verebilmesidir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-18/src/main.rs:here}}
```



Bu kod, `Can't overwrite an existing customized value` yazdıracak ve ardından `setting is Some(5)` yazdıracaktır. İlk eşleşme kolunda, `Some` varyantlarının içindeki değerlerle eşleşmemize gerek yoktur, ancak `setting_value` ve `new_setting_value` değerlerinin `Some` varyantı olduğu durumu kontrol etmemiz gerekir. Bu durumda, `setting_value`'yı değiştirmeme nedenimizi yazdırır ve bu değişiklik yapılmaz.

Diğer tüm durumlarda (eğer ya `setting_value` ya da `new_setting_value` `None` ise) ikinci kolda `_` deseniyle ifade edilen durumlarda, `new_setting_value`'nin `setting_value` haline gelmesine izin vermek istemekteyiz.

Ayrıca, bir desende özel değerleri yok saymak için birden fazla yerde alt çizgi kullanabiliriz. Liste 19-19, beş elemanlı bir tuple'daki ikinci ve dördüncü değerleri yok sayma örneğini göstermektedir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-19/src/main.rs:here}}
```



Bu kod `Some numbers: 2, 8, 32` yazdıracak ve 4 ile 16 değerleri yok sayılacaktır.

#### İsmini Alt Çizgi ile Başlatılan Kullanılmayan Bir Değişkeni Yoksayma

Bir değişken oluşturduğunuzda ancak onu hiçbir yerde kullanmadığınızda, Rust genellikle bir uyarı verir çünkü kullanılmayan bir değişken bir hata olabilir. Ancak, bazen kullanılmayan bir değişken oluşturmak faydalı olabilir; örneğin, bir prototip oluşturduğunuzda veya bir projeye yeni başlarken. Bu durumda, kullanılmayan değişken hakkında size uyarı vermesi için değişkenin ismini alt çizgi ile başlatabilirsiniz. Liste 19-20'de, iki kullanılmayan değişken oluşturuyoruz, ancak bu kodu derlediğimizde yalnızca bir konuda uyarı alacağız.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-20/src/main.rs}}
```



Burada `y` değişkenini kullanmadığımızdan bir uyarı alıyoruz, fakat `_x`'i kullanmadığımızdan uyarı almıyoruz.

:::warning
Not edin ki yalnızca `_` kullanmak ile ismi alt çizgi ile başlayan bir ad kullanmak arasında ince bir fark vardır. `_x` sözdizimi, değeri değişkene bağlarken, `_` hiç bağlamaz.
:::

Bu ayrımın önemli olduğu bir durumu göstermek için, Liste 19-21 bize bir hata verecektir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-21/src/main.rs:here}}
```



`_s`'ye geçecektir, bu da `s`'yi bir daha kullanmamıza engel olur. Ancak, yalnızca alt çizgi kullanmak, değeri hiç bağlamaz. Liste 19-22, `_` kullandığı için hiçbir hata olmadan derlenebilir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-22/src/main.rs:here}}
```



Bu kod iyi çalışır çünkü `s`'yi hiçbir şeye bağlamıyoruz; bu yüzden `s` taşınmaz.

#### `..` ile Bir Değerin Geri Kalan Parçalarını Yoksayma

Birden fazla parçaya sahip değerlerle, belirli parçaları kullanmak ve geri kalanını yok saymak için `..` sözdizimini kullanabiliriz; bu da her bir yok sayılan değer için alt çizgi listeleme ihtiyacını ortadan kaldırır. `..` deseni, eşleşmemiş olan herhangi bir değeri yok sayar. Liste 19-23'te üç boyutlu alanlarda bir koordinatı tutan bir `Point` yapısı vardır. `eşleşme` ifadesinde, yalnızca `x` koordinatında işlem yapmak ve `y` ve `z` alanlarındaki değerleri yok saymak istiyoruz.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-23/src/main.rs:here}}
```



`x` değerini sıralarız ve ardından sadece `..` desenini ekleriz. Bu, özellikle pek çok alana sahip yapılarda yalnızca bir veya iki alana erişmemiz gerektiğinde `y: _` ve `z: _` listelemekten çok daha hızlıdır.

:::note
`..` sözdizimi, ihtiyacı olduğu kadar değer genişletebilir. Liste 19-24, `..` kullanılarak bir tuple ile nasıl kullanılabileceğini gösterir.
:::



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-24/src/main.rs}}
```



Bu kodda, ilk ve son değerler `first` ve `last` ile eşleşir. `..`, ortadaki her şeyi yok sayacak ve bu alanların hepsini yükseltecektir.

:::danger
Ancak, `..` kullanımı belirsiz olmalıdır. Hangi değerlerin eşleşme için hangi parçaların yok sayılacağı netleşmiyorsa, Rust bize bir hata verecektir.
:::

Liste 19-25, `..` kullanmaya çalıştığımızda belirsiz bir şekilde bir örnek gösterir; bu nedenle derlenmeyecektir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-25/src/main.rs}}
```



Bu örneği derlediğimizde, şu hatayı alırız:

```console
{{#include ../listings/ch19-patterns-and-matching/listing-19-25/output.txt}}
```

Tuple'daki kaç tane değerin yok sayılacağını belirlemeden önce, `second` ile bir değeri eşleştirip, daha sonra ne kadar daha ileride bir değeri yok sayılacağını belirlemek imkansızdır. Bu kod, `2`'yi yok saymak isteyip `second`'ı `4` olarak bağlamaya ve ardından `8`, `16` ve `32`'yi yok saymaya veya `2` ve `4`'ü yok saymak, `second`'ı `8` olarak bağlamaya ve ardından `16` ve `32`'yi yok saymaya çalışmak anlamına gelebilir; ve bunun gibi. `second` değişkeninin adı Rust için özel bir anlam ifade etmediğinden, bu kullanım belirsiz olduğu için bir derleyici hatası alıyoruz.

### Eşleşme Koruyucuları ile Ekstra Koşul

Bir *eşleşme koruyucu*, bir `eşleşme` kolunda, desenin ardından belirtilen ek bir `if` koşuludur ve o kolun seçilmesi için de eşleşmesi gerekir. Eşleşme koruyucular, bir desenin kendisinin izin verdiğinden daha karmaşık fikirleri ifade etmek için kullanışlıdır. Koşul, desende oluşturulan değişkenleri kullanabilir. 

:::info
Yukarıdaki bilgiler, eşleşme koruyucuların kullanımında önemli bir anlam taşımaktadır.
:::

Listing 19-26'da, ilk kolun `Some(x)` desenine sahip olduğu ve ayrıca `if x % 2 == 0` eşleşme koruyucusuna sahip olduğu bir `eşleşme` gösterilmektedir (bu, sayı çiftse doğru olacaktır).



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-26/src/main.rs:here}}
```



Bu örnek `Dördüncü sayı 4 çifttir` yazdıracaktır. `num`, ilk kolun desenine karşı karşılaştırıldığında eşleşir, çünkü `Some(4)` `Some(x)` ile eşleşir. Ardından eşleşme koruyucusu, `x`'in 2’ye bölümünden kalanının 0 olup olmadığını kontrol eder ve bu doğru olduğu için ilk kol seçilir.

:::tip
Eşleşme koruyucuları kullanarak, daha karmaşık koşulları daha okunaklı hale getirmek mümkündür.
:::

Eğer `num` `Some(5)` olsaydı, ilk kolun eşleşme koruyucusu yanlış olurdu, çünkü 5'in 2’ye bölümünden kalan 1'dir ve bu da 0'a eşit değildir. Rust, o zaman ikinci kola geçer, çünkü ikinci kol bir eşleşme koruyucusuna sahip değildir ve dolayısıyla herhangi bir `Some` çeşidiyle eşleşir.

Desende `if x % 2 == 0` koşulunu ifade etmenin bir yolu yoktur, bu yüzden eşleşme koruyucusu bu mantığı ifade etme yeteneği verir. Bu ek ifade yeteneğinin olumsuz yanı, derleyicinin, eşleşme koruyucu ifadeleriyle ilgiliyken kapsamlılığı kontrol etmeye çalışmamasıdır.

Listing 19-11'de, eşleşme koruyucularını deseni gölgeleme sorununu çözmek için kullanabileceğimizi belirtmiştik. `eşleşme` ifadesinde desende yeni bir değişken oluşturduğumuzu hatırlayın, dışarıda bulunan değişkeni kullanmak yerine. O yeni değişken, dışarıdaki değişkenin değerine karşı test edemediğimiz anlamına geliyordu. 

:::note
Eşleşme koruyucuları, dışarıdaki değişkenlerle etkileşimi geliştirir.
:::

Listing 19-27, bu sorunu düzeltmek için bir eşleşme koruyucusu kullanma yöntemimizi gösteriyor.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-27/src/main.rs}}
```



Bu kod şimdi `Varsayılan durum, x = Some(5)` yazdıracaktır. İkinci eşleşme kolundaki desen, dıştaki `y`'yi gölgeleyen yeni bir `y` değişkeni tanıtmaz. Bu, eşleşme koruyucusunda dıştaki `y`'yi kullanabileceğimiz anlamına gelir. Deseni `Some(y)` olarak belirtmek yerine, dıştaki `y`'yi gölgelemeyen `Some(n)` olarak belirtiyoruz. Bu, dışarıda hiçbir `n` değişkeni olmadığı için herhangi bir şeyi gölgelemeyen yeni bir değişken `n` yaratır.

Eşleşme koruyucusu `if n == y` bir desen değildir ve dolayısıyla yeni değişkenler tanıtmaz. Bu `y`, gölgelenmiş yeni bir `y` yerine dıştaki `y`'dir ve `n` ile `y`'yi karşılaştırarak dıştaki `y` ile aynı değere sahip bir değer arayabiliriz.

Eşleşme koruyucusunda birden fazla deseni belirtmek için *veya* operatörü `|` de kullanabilirsiniz; eşleşme koruyucusu koşulu tüm desene uygulanacaktır. Listing 19-28, `|` kullanan bir deseni bir eşleşme koruyucusu ile birleştirdiğinizde önceliği gösteriyor. Bu örneğin önemli kısmı, `if y` eşleşme koruyucusunun `4`, `5` ve `6` için geçerli olmasıdır, oysa `if y`nin yalnızca `6` için geçerli olduğu gibi görünmesi mümkündür.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-28/src/main.rs:here}}
```



Eşleşme koşulu, kolun yalnızca `x`'in `4`, `5` veya `6` değerine eşit olduğu durumda eşleşeceğini belirtir *ve* `y`'nin `true` olması gerekir. Bu kod çalıştığında, ilk kolun deseni eşleşir çünkü `x` `4`'tür, ancak eşleşme koruyucusu `if y` yanlıştır, bu nedenle ilk kol seçilmez. Kod, ikinci kola geçer ve bu eşleşir, bu program `hayır` yazdırır. Bunun nedeni, `if` koşulunun `4 | 5 | 6` deseninin tamamına uygulanmasıdır, sadece son değer `6`'ya değil. Diğer bir deyişle, bir eşleşme koruyucusunun bir desene karşı önceliği şu şekildedir:

```text
(4 | 5 | 6) if y => ...
```

bunun yerine şu şekilde değildir:

```text
4 | 5 | (6 if y) => ...
```

Kodu çalıştırdıktan sonra, öncelik davranışı belirgindir: eşleşme koruyucusu yalnızca `|` operatörü kullanılarak belirtilen değerler listesindeki son değere uygulanmış olsaydı, kol eşleşir ve program `evet` yazdırırdı.

### `@` Bağlantıları

*at* operatörü `@`, bir deseni kontrol ederken bir değeri tutan bir değişken oluşturmamıza izin verir. Listing 19-29'da, `Message::Hello` `id` alanının `3..=7` aralığında olduğunu test etmek istiyoruz. Ayrıca, değeri `id_variable` değişkenine bağlamamız gerekiyor, böylece bu değeri kol ile ilişkili kodda kullanabiliriz. Bu değişkene `id` adını verebiliriz, alanla aynı, ancak bu örnekte farklı bir ad kullanacağız.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-29/src/main.rs:here}}
```



Bu örnek `Aralıkta bir id bulundu: 5` yazdıracaktır. `id_variable @` ifadesini `3..=7` aralığından önce belirterek, aralığı eşleyen herhangi bir değeri alırken, aynı zamanda değerin aralık desenine uyduğunu test etmiş oluyoruz.

:::warning
Eğer desendeki değerle aynı değişken ismi kullanılırsa, bu karmakarışıklıklara yol açabilir.
:::

İkinci kol, nesne içinde yalnızca bir aralığın belirtildiği yerde, kol ile ilişkili kodda `id` alanının gerçek değerini içeren bir değişkene sahip değildir. `id` alanının değeri 10, 11 veya 12 olabilirdi, ancak o desene ait kod bunun hangi değeri kullandığını bilmez. Desen kodu, bu alandaki değeri kullanamaz çünkü `id` değerini bir değişkende kaydetmedik.

Son kol, bir aralık belirtmediğimizde, `id` alanının değerini arm kodunda kullanabileceğimiz bir değişke olan `id`'ye sahipiz. Bunun nedeni, yapı alanı kısayol sözdizimini kullanmamızdır. Ancak, bu kol içinde `id` alanındaki değere herhangi bir test uygulamadık; ilk iki kol gibi: herhangi bir değer bu desene uyacaktır.

`@` kullanmak, bir değeri test etmemize ve aynı zamanda tek bir desende bir değişkende saklamamıza olanak tanır.

## Özet

Rust’un desenleri, farklı türde verileri ayırt etmekte son derece yararlıdır. `eşleşme` ifadelerinde kullanıldığında, Rust, desenlerinizin her olası değeri kapsamasını sağlıyor; aksi takdirde programınız derlenmeyecektir. `let` ifadeleri ve fonksiyon parametrelerinde desenler, o yapıların daha kullanışlı hale getirilmesini sağlıyor ve değerlerin daha küçük parçalara ayrıştırılmasını mümkün kılarak değişkenlere atama yapmamızı sağlıyor. İhtiyaçlarımıza uygun basit veya karmaşık desenler oluşturabiliriz.

Bir sonraki bölümde, kitabın neredeyse son bölümünde, Rust’ın çeşitli özelliklerinin bazı ileri düzey yönlerine bakacağız.