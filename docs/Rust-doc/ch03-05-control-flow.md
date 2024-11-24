## Kontrol Akışı

Bir koşulun `true` olup olmamasına bağlı olarak bazı kodların çalıştırılması ve bir koşul `true` olduğu sürece bazı kodların tekrar tekrar çalıştırılması, çoğu programlama dilinde temel yapı taşlarıdır. Rust kodunun yürütme akışını kontrol etmenizi sağlayan en yaygın yapılar `if` ifadeleri ve döngülerdir.

### `if` İfadeleri

Bir `if` ifadesi, kodunuzu koşullara bağlı olarak dallandırmanızı sağlar. Bir koşul sağlarsınız ve sonra “Bu koşul sağlanıyorsa, bu kod bloğunu çalıştır. Koşul sağlanmıyorsa, bu kod bloğunu çalıştırma.” şeklinde ifade edersiniz.

:::tip
`if` ifadesini keşfetmek için *projects* dizininizde *branches* adında yeni bir proje oluşturun.
:::

*src/main.rs* dosyasına aşağıdakileri yazın:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-26-if-true/src/main.rs}}
```

Tüm `if` ifadeleri `if` anahtar kelimesiyle başlar ve ardından bir koşul gelir. Bu durumda, koşul `number` değişkeninin 5'ten küçük bir değere sahip olup olmadığını kontrol eder. Koşul `true` ise çalıştırılacak kod bloğunu süslü parantezler içinde hemen koşulun ardından yerleştiririz. `if` ifadelerindeki koşullarla ilişkili kod bloklarına bazen *kollar* denir; bu, [“Tahmini Gizli Sayıya Karşı Karşılaştırma”][comparing-the-guess-to-the-secret-number] bölümünde tartıştığımız `match` ifadelerindeki kollar gibi.

İsteğe bağlı olarak, koşul `false` değerlendiğinde yürütülmesi için programa alternatif bir kod bloğu vermek amacıyla burada seçtiğimiz gibi bir `else` ifadesi de ekleyebiliriz. Eğer bir `else` ifadesi sağlamazsanız ve koşul `false` ise, program sadece `if` bloğunu atlayacak ve sonraki koda geçecektir.

Bu kodu çalıştırmayı deneyin; aşağıdaki çıktıyı görmelisiniz:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-26-if-true/output.txt}}
```

Bu sefer koşulu `false` yapacak bir değere `number` değişkeninin değerini değiştirmeyi deneyelim:

```rust,ignore
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-27-if-false/src/main.rs:here}}
```

Programı tekrar çalıştırın ve çıktıya bakın:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-27-if-false/output.txt}}
```

:::warning
Bu kodda dikkat edilmesi gereken bir diğer nokta, koşulun *kesinlikle* bir `bool` olması gerektiğidir. Koşul bir `bool` değilse, bir hata alırız.
:::

Örneğin, aşağıdaki kodu çalıştırmayı deneyin:

Dosya Adı: src/main.rs

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-28-if-condition-must-be-bool/src/main.rs}}
```

Bu sefer `if` koşulu `3` değerine değerlendiriliyor ve Rust bir hata veriyor:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-28-if-condition-must-be-bool/output.txt}}
```

Hata, Rust'ın bir `bool` beklediğini ancak bir tamsayı aldığını belirtmektedir. Ruby ve JavaScript gibi dillerin aksine, Rust otomatik olarak boole olmayan türleri bir Boole'ye dönüştürmeye çalışmaz. 

:::note
Belirgin olmalısınız ve her zaman `if`'e koşul olarak bir Boole sağlamalısınız. Örneğin, `if` kod bloğunun yalnızca bir sayı `0`'a eşit olmadığında çalışmasını istiyorsak, `if` ifadesini aşağıdaki gibi değiştirebiliriz:
:::

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-29-if-not-equal-0/src/main.rs}}
```

Bu kod çalıştırıldığında `number was something other than zero` yazdırır.

#### `else if` ile Birden Fazla Koşul Yönetimi

Birden fazla koşulu bir `else if` ifadesinde `if` ve `else` birleştirerek kullanabilirsiniz. Örneğin:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-30-else-if/src/main.rs}}
```

Bu programın dört olası yolu vardır. Çalıştırdıktan sonra aşağıdaki çıktıyı görmelisiniz:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-30-else-if/output.txt}}
```

Bu program çalıştığında, sırasıyla her `if` ifadesini kontrol eder ve koşul `true` olarak değerlendirildiği takdirde ilk gövdayı çalıştırır. 6'nın 2 ile bölünebilir olmasına rağmen, `number is divisible by 2` çıktısını görmüyoruz, ayrıca `number is not divisible by 4, 3, or 2` metnini de `else` bloğundan görmüyoruz. Bunun nedeni, Rust'ın yalnızca ilk `true` koşulundaki bloğu çalıştırmasıdır; bir tane bulduğunda, kalanları kontrol dahi etmez.

Aşırı sayıda `else if` ifadesi kullanmak kodunuzu karıştırabilir, bu nedenle birden fazla varsa kodunuzu gözden geçirmek isteyebilirsiniz. Bölüm 6, bu durumlarda kullanılabilecek güçlü bir Rust dal yapısı olan `match` ile ilgilidir.

#### `let` İfadesinde `if` Kullanma

`if` bir ifade olduğundan, onu bir `let` ifadesinin sağ tarafında kullanarak sonucu bir değişkene atayabiliriz, örneğin Liste 3-2'deki gibi.



```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/listing-03-02/src/main.rs}}
```



`number` değişkeni, `if` ifadesinin sonucuna dayalı bir değere bağlanacaktır. Bu kodu çalıştırın ve neler olacağını görün:

```console
{{#include ../listings/ch03-common-programming-concepts/listing-03-02/output.txt}}
```

Kod bloğunun son ifadesi değerlendirildiğini ve sayılar kendi başlarına da ifadeler olduğunu unutmayın. Bu durumda, tüm `if` ifadesinin değeri hangi kod bloğunun çalıştırıldığına bağlıdır. Bu, `if`'in her kolunun sonuçlarının aynı türde olması gerektiği anlamına gelir; Liste 3-2'de, `if` kolunun ve `else` kolunun sonuçları `i32` tam sayılarıydı. Aşağıdaki örnekte olduğu gibi türler birbiriyle uyuşmuyorsa, hata alırız:

Dosya Adı: src/main.rs

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-31-arms-must-return-same-type/src/main.rs}}
```

Bu kodu derlemeye çalıştığımızda bir hata alırız. `if` ve `else` kolları, uyumsuz değer türlerine sahiptir ve Rust, programdaki sorunu tam olarak bulduğunu belirtir:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-31-arms-must-return-same-type/output.txt}}
```

`if` bloğundaki ifade bir tam sayı olarak değerlendiriliyor ve `else` bloğundaki ifade ise bir dize olarak değerlendiriliyor. Bu çalışmayacaktır çünkü değişkenler tek bir türe sahip olmalıdır ve Rust, derleme zamanında `number` değişkeninin türünü kesin olarak bilmelidir. `number`’ın türünü bilmek, derleyicinin, türün `number`'ı kullandığımız her yerde geçerli olup olmadığını doğrulamasını sağlar. Rust, `number`’ın türünün yalnızca çalışma zamanında belirlendiği durumlarda bunu yapamayabilir; derleyici daha karmaşık hale gelir ve bir değişken için çok sayıda varsayımsal türü takip etmek zorunda kalırsa, kod hakkında daha az garanti sunacaktır.

### Döngülerle Tekrar

Bir kod bloğunu birden fazla kez çalıştırmak sıklıkla yararlıdır. Bu görev için Rust, döngü gövdesinin içindeki kodu sona kadar çalıştıran ve ardından hemen yeniden başlatan birkaç *döngü* sağlar. Döngülerle denemek için *loops* adlı yeni bir proje oluşturalım.

Rust'ın üç tür döngüsü vardır: `loop`, `while` ve `for`. Her birini deneyelim.

#### `loop` ile Kodu Tekrar Etme

`loop` anahtar kelimesi Rust'a bir kod bloğunu sonsuz bir döngü şeklinde tekrar tekrar çalıştırmasını söyler veya açıkça durdurmasını istediğinizdeye kadar.

Örneğin, *loops* dizininizde *src/main.rs* dosyasını şöyle değiştirin:

Dosya Adı: src/main.rs

```rust,ignore
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-32-loop/src/main.rs}}
```

Bu programı çalıştırdığımızda, `again!` biçiminde sürekli olarak yeniden yazdırılır ve programı manuel olarak durdurana kadar devam eder. Çoğu terminal, sürekli bir döngüde takılı kalan bir programı kesmek için ctrl-c klavye kısayolunu destekler. Deneyin:

```console
$ cargo run
   Compiling loops v0.1.0 (file:///projects/loops)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.08s
     Running `target/debug/loops`
again!
again!
again!
again!
^Cagain!
```

Simge `^C`, ctrl-c tuşlarına bastığınız yeri temsil eder. Döngüde kodun ne aşamada olduğunuza bağlı olarak `again!` kelimesinin `^C`'den sonra yazdırılmayabilir.

Neyse ki, Rust, bir döngüden çıkmak için bir yol da sağlar. Döngü içinde `break` anahtar kelimesini koyarak programa döngü yürütmeye ne zaman son vereceğini söyleyebilirsiniz. Bunu, kullanıcı doğru sayıyı tahmin ettiğinde programı durdurmak için Bölüm 2'de [“Doğru Tahminde Sonlandırma”][quitting-after-a-correct-guess] bölümünde yaptığımızı hatırlayın.

Tahmin oyununda kullanılan `continue` anahtar kelimesini de kullandık; döngüde, programın bu döngü iterasyonundaki herhangi bir kalan kodu atlamasını ve bir sonraki iterasyona geçmesini söyler.

#### Döngülerden Değer Döndürme

`loop`'ın en yaygın kullanım alanlarından biri, kesilebileceğini bildiğiniz bir işlemi yeniden denemektir; bir iş parçacığının işini tamamlayıp tamamlamadığını kontrol etmek gibi. Ayrıca bu işlemin sonucunu döngü dışındaki kodun geri kalanına geçmeniz de gerekebilir. Bunu yapmak için, döngüyü durduran `break` ifadesinden hemen sonra döndürmek istediğiniz değeri ekleyebilirsiniz; bu değer, döngü dışına taşınarak kullanılabilir:

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-33-return-value-from-loop/src/main.rs}}
```

Döngüden önce, `counter` adında bir değişken tanımlar ve başlangıç değerini `0` olarak atarız. Ardından döngüden dönen değeri tutmak için `result` adında bir değişken tanırız. Döngünün her iterasyonunda, `counter` değişkenine `1` ekleriz ve ardından `counter`’ın `10` olup olmadığını kontrol ederiz. `10` olduğunda, `break` anahtar kelimesi ile `counter * 2` değerini kullanırız. Döngüden sonra, sonucu `result` değişkenine atayan ifadeyi sonlandırmak için bir noktalı virgül kullanırız. Son olarak, `result` içindeki değeri yazdırırız; bu durumda `20` olacaktır.

Döngü içinde `return` de yapabilirsiniz. `break` yalnızca mevcut döngüden çıkarken, `return` daima mevcut işlevden çıkar.

#### Birden Fazla Döngü Arasında Ayrım Yapmak için Döngü Etiketleri

Eğer döngülerin içinde döngüleriniz varsa, `break` ve `continue` en içteki döngüye uygulanır. İsteğe bağlı olarak, bir döngüde bir *döngü etiketi* belirtebilirsiniz; ardından bu etiketi `break` veya `continue` ile kullanarak bu anahtar kelimelerin etiketlenmiş döngüye uygulanmasını sağlayabilirsiniz. Döngü etiketleri, tek bir tırnakla başlamalıdır. İşte iki iç içe döngüyle ilgili bir örnek:

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-32-5-loop-labels/src/main.rs}}
```

Dış döngü, `'counting_up` etiketine sahiptir ve 0'dan 2'ye kadar sayacaktır. Etiketsiz iç döngü 10'dan 9'a kadar sayar. Etiket belirtmeyen ilk `break` yalnızca iç döngüyü terk eder. `break 'counting_up;` ifadesi dış döngüyü durdurur. Bu kodun çıktısı:

```console
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-32-5-loop-labels/output.txt}}
```

#### `while` ile Koşullu Döngüler

Bir programın genellikle döngü içinde bir koşulu değerlendirmesi gerekir. Koşul `true` olduğu sürece döngü çalışır. Koşul `true` olmaktan çıktığında, program `break` çağırarak döngüyü durdurur. Bu davranışı, `loop`, `if`, `else` ve `break` kombinasyonunu kullanarak uygulamak mümkündür; isterseniz şimdi bir programda bunu deneyebilirsiniz. Ancak, bu desen o kadar yaygındır ki Rust'ın bunun için yerleşik bir dil yapısı vardır; buna `while` döngüsü denir. Liste 3-3'te, koşul `true` olduğu sürece programı üç kez döngüye sokmakta ve her seferinde geriye doğru sayarak, döngüden sonra bir mesaj yazdırmakta ve çıkmaktadır.



```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/listing-03-03/src/main.rs}}
```



Bu yapı, `loop`, `if`, `else` ve `break` kullandığınızda gerekli olan birçok iç içe girme durumunu elimine eder ve daha net bir yapı sunar. Koşul `true` değerlendiği sürece kod çalışır; aksi halde döngüyü terk eder.

#### `for` ile Bir Koleksiyon Üzerinde Döngü Kurma

Bir koleksiyonun (örneğin bir dizinin) elemanları üzerinde döngü kurmak için `while` yapısını da kullanabilirsiniz. Örneğin, Liste 3-4'teki döngü, `a` dizisindeki her bir elemanı yazdırır.



```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/listing-03-04/src/main.rs}}
```



Burada, kod dizideki elemanlar üzerinden sayım yapmaktadır. `0` indeksinden başlar ve ardından diziye kadar olan son indekse ulaşana kadar döngü yapar (yani `index 

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/listing-03-05/src/main.rs}}
```



Bu kodu çalıştırdığımızda, Liste 3-4’te olduğu gibi aynı çıktıyı göreceğiz. Daha önemlisi, şimdi kodun güvenliğini artırdık ve dizinin sonuna geçmeyi veya yeterince ileri gitmemeyi sağlayacak hatalardan kaçındık.

`for` döngüsü kullanılarak dizideki değerlerin sayısını değiştirdikçe başka bir kodu değiştirmek zorunda kalmayacaksınız; bu, Liste 3-4'te kullanılan yöntemle karşılaştırıldığında sağlıklı bir avantaj sunar.

`for` döngülerinin sağladığı güvenlik ve özlük, bunları Rust'ta en yaygın olarak kullanılan döngü yapısı haline getirir. Belirli bir sayıda kodu çalıştırmak istediğiniz durumlarda bile, Liste 3-3'te bir `while` döngüsü kullanmak yerine çoğu Rust programcısı bir `for` döngüsü kullanır. Bunu yapmak için, standart kütüphanenin sağladığı, belirli bir sayıdan başlayarak başka bir sayıya ulaşana kadar tüm sayıları sıralayan bir `Range` kullanabilirsiniz.

İşte geri sayımın bir `for` döngüsü ve henüz konuşmadığımız bir diğer yöntem olan `rev` ile ters çevrilmiş hali:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-34-for-range/src/main.rs}}
```

Bu kod biraz daha hoş, değil mi?

## Özet

Başardınız! Bu, büyük bir bölümdü: değişkenler, skalar ve karmaşık veri türleri, işlevler, yorumlar, `if` ifadeleri ve döngüler hakkında bilgi edindiniz! 

:::tip
Bu bölümde tartışılan kavramlarla pratik yapmak için, aşağıdakileri yapmaya yönelik programlar oluşturmayı deneyin:
* Fahrenheit ve Celsius arasında sıcaklıkları dönüştürün.
* *n*’inci Fibonacci sayısını üretin.
* “Yılbaşı Günü” şarkısının sözlerini yazdırın, şarkının tekrarından faydalanın.
:::

Hazır olduğunuzda, Rust'ta yaygın olarak diğer programlama dillerinde bulunmayan bir kavramdan bahsedeceğiz: sahiplik.

[comparing-the-guess-to-the-secret-number]:
ch02-00-guessing-game-tutorial.html#comparing-the-guess-to-the-secret-number
[quitting-after-a-correct-guess]:
ch02-00-guessing-game-tutorial.html#quitting-after-a-correct-guess