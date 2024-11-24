## Çürütülebilirlik: Bir Desenin Eşleşmeyi Başaramayabileceği Durumlar

Desenler iki formda gelir: çürütülebilir ve çürütülemez. Herhangi bir olası değer ile eşleşecek olan desenler **çürütülemezdir**. Bir örnek, `let x = 5;` ifadesindeki `x`'dir, çünkü `x` her şeyi eşleştirir ve bu nedenle eşleşmeyi başaramaz. Bir olası değerin eşleşmeyi başaramayacağı desenler ise _çürütülebilir_ dir. Bir örnek, `if let Some(x) = a_value` ifadesindeki `Some(x)`'dir çünkü eğer `a_value` değişkenindeki değer `None` ise, `Some(x)` deseni eşleşmeyecektir.

:::info
Fonksiyon parametreleri, `let` ifadeleri ve `for` döngüleri yalnızca çürütülemez desenleri kabul edebilir çünkü program, değerler eşleşmediğinde anlamlı bir şey yapamaz.
:::

`if let` ve `while let` ifadeleri çürütülebilir ve çürütülemez desenleri kabul eder, ancak derleyici çürütülemez desenler konusunda uyarır çünkü tanım gereği olası bir başarısızlığı ele almak için tasarlanmıştır: bir koşulun işlevselliği, başarı veya başarısızlık durumuna göre farklı şekilde performans gösterme yeteneğindedir.

Genel olarak, çürütülebilir ve çürütülemez desenler arasındaki ayrım konusunda endişelenmenize gerek yoktur; ancak, bir hata mesajında gördüğünüzde yanıt verebilmek için çürütülebilirlik kavramına aşina olmanız gerekir. Bu durumlarda, deseni veya deseni kullandığınız yapıyı, kodun beklenen davranışına bağlı olarak değiştirmeniz gerekecektir.

:::tip
Bir çürütülebilir deseni kullanmaya çalıştığımızda Rust’ın bir çürütülemez desen talep ettiği durumda ne olacağını gösteren bir örneğe bakalım.
:::

Liste 19-8, `let` ifadesini gösteriyor, ancak belirtilen desen `Some(x)` bir çürütülebilir desendir. Beklediğiniz gibi, bu kod derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-08/src/main.rs:here}}
```



Eğer `some_option_value` bir `None` değeri olsaydı, `Some(x)` desenine eşleşemeyecek, bu da desenin çürütülebilir olduğu anlamına gelir. Ancak, `let` ifadesi yalnızca bir çürütülemez deseni kabul edebilir çünkü `None` değeri ile kodun yapabileceği hiçbir geçerli şey yoktur. Derleme zamanında, Rust bir çürütülebilir deseni çürütülemez bir desen gerektiren bir noktada kullanmaya çalıştığımız için şikayet edecektir:

```console
{{#include ../listings/ch19-patterns-and-matching/listing-19-08/output.txt}}
```

> Deseni `Some(x)` ile her geçerli değerle kapsamadığımız için (ve kapsayamadığımız için!), Rust haklı olarak bir derleyici hatası üretir.  
> — Rust Derleyici

Bir çürütülebilir desenin bir çürütülemez desen gerektiği bir durumda, deseni kullanan kodu değiştirmekle düzeltebiliriz: `let` yerine `if let` kullanabiliriz. Böylece desen eşleşmezse, kod süslü parantez içindeki kodu atlayacak ve geçerli bir şekilde devam etme yolu verecek. Liste 19-9, Liste 19-8'deki kodu nasıl düzelteceğimizi gösteriyor.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-09/src/main.rs:here}}
```



Koda bir çıkış verdik! Bu kod artık mükemmel derecede geçerli. Ancak, Liste 19-10'da gösterildiği gibi `if let`'e çürütülemez bir desen (her zaman eşleşecek bir desen) verirsek, derleyici bir uyarı verecektir.



```rust
{{#rustdoc_include ../listings/ch19-patterns-and-matching/listing-19-10/src/main.rs:here}}
```



Rust, çürütülemez bir desen ile `if let` kullanmanın mantıklı olmadığını belirtir:

```console
{{#include ../listings/ch19-patterns-and-matching/listing-19-10/output.txt}}
```

:::warning
Bu nedenle, `match` kolları çürütülebilir desenler kullanmalıdır; son kolda ise, kalan değerleri çürütülemez bir desen ile eşleştirmek gerekir.
:::

Rust, yalnızca bir kolu olan bir `match` içinde çürütülemez bir desen kullanmamıza izin verir, ancak bu söz dizimi pek kullanışlı değildir ve daha basit bir `let` ifadesiyle değiştirilebilir.

Artık desenleri nerede kullanacağınızı ve çürütülebilir ile çürütülemez desenler arasındaki farkı bildiğinize göre, desen oluşturmak için kullanabileceğimiz tüm sözdizimini ele alalım.