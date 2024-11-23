## Değişkenler ve Değişkenlik

> **"Değişkenlerle Değerleri Saklama"** [“Değişkenlerle Değerleri Saklama”][storing-values-with-variables] kısmında belirtildiği gibi, varsayılan olarak değişkenler sabittir. Bu, Rust'ın kodunuzu, Rust'ın sunduğu güvenlik ve kolay eşzamanlılıktan yararlanacak şekilde yazmanız için verdiği birçok ipucundan biridir. Ancak, değişkenlerinizi değişken yapmak için seçeneğiniz hala var. Rust'ın neden sabitlikten yana olmanızı teşvik ettiğini ve bazen neden çıkmak isteyebileceğinizi keşfedelim.

Bir değişken sabit olduğunda, bir değer bir isimle bağlandıktan sonra o değeri değiştiremezsiniz. Bunu göstermek için, `cargo new variables` komutunu kullanarak *projects* dizininizde *variables* adında yeni bir proje oluşturun.

Sonra, yeni *variables* dizininizdeki *src/main.rs* dosyasını açın ve içindeki kodu henüz derlenmeyecek olan aşağıdaki kod ile değiştirin:

Dosya Adı: src/main.rs

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-01-variables-are-immutable/src/main.rs}}
```

Kaydedin ve programı `cargo run` komutuyla çalıştırın. Bir sabitlik hatası ile ilgili bir hata mesajı almanız gerekecek, aşağıdaki çıktıda gösterildiği gibi:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-01-variables-are-immutable/output.txt}}
```

Bu örnek, derleyicinin programınızdaki hataları bulmanıza nasıl yardımcı olduğunu gösteriyor. Derleyici hataları can sıkıcı olabilir, ama aslında bunun anlamı programınızın henüz istediğiniz şeyi güvenli bir şekilde yapmadığıdır; bu, iyi bir programcı olmadığınız anlamına gelmez! Deneyimli Rust kullanıcıları da hala derleyici hataları alırlar.

:::warning
`immutable değişken` `x` üzerine iki kez atama yapılamaz ` hata mesajını aldınız çünkü sabit `x` değişkenine ikinci bir değer atamayı denediniz.
:::

Bir değerin sabit olarak belirlenmiş bir değeri değiştirmeye çalıştığımızda derleme zamanı hataları almamız önemlidir çünkü bu durum hatalara yol açabilir. Kodumuzun bir kısmı bir değerin asla değişmeyeceği varsayımı ile çalışıyorsa ve kodumuzun diğer bir kısmı o değeri değiştiriyorsa, ilk kısmın tasarlandığı gibi çalışmaması mümkündür. Bu tür bir hatanın nedenini bulmak zor olabilir, özellikle de ikinci parçanın değeri yalnızca *bazen* değiştirdiğinde. Rust derleyicisi, bir değerin değişmeyeceğini belirttiğinizde, gerçekten de değişmeyeceğini garanti eder, böylece bunu kendiniz takip etmeniz gerekmez. Bu nedenle, kodunuzu daha kolay anlamlandırabilirsiniz.

Ancak değişkenlik çok yararlı olabilir ve kodu yazmayı daha uygun hale getirebilir. Değişkenler varsayılan olarak sabit olsalar da, kodunuzda değişken bir isim kullanmak için `mut` ekleyerek onları değişken hale getirebilirsiniz. Bu, [Bölüm 2][storing-values-with-variables] içindeki gibi. `mut` eklemek, gelecekte kodu okuyacak olanlara, diğer kod parçalarının bu değişkenin değerini değiştireceği niyetini de iletmektedir.

Örneğin, *src/main.rs* dosyasını aşağıdaki gibi değiştirelim:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-02-adding-mut/src/main.rs}}
```

Şimdi programı çalıştırdığımızda, şunu alıyoruz:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-02-adding-mut/output.txt}}
```

`mut` kullanıldığında `x`'e bağlı değeri `5`'ten `6`'ya değiştirme iznimiz var. Nihayetinde, değişkenlik kullanıp kullanmamaya karar vermek size bağlıdır ve bu belirli durumun en net olduğunu düşündüğünüze bağlıdır.

### Sabitler

Sabit değişkenler gibi, *sabitler* bir isimle bağlı değerlere sahiptir ve değişmelerine izin verilmez, ancak sabitler ile değişkenler arasında bazı farklılıklar vardır.

1. Öncelikle, sabitlerle `mut` belgelenmesine izin verilmez. 
2. Sabitler yalnızca varsayılan olarak sabit değildir—her zaman sabittirler. 

Sabitleri `let` anahtar kelimesi yerine `const` anahtar kelimesi kullanarak tanımlarsınız ve değerin türü *zorunlu olarak* anotasyon edilmelidir. Türler ve tür anotasyonları sonraki bölümde, [“Veri Türleri”][data-types], ele alınacaktır, bu yüzden şu anda detaylarla ilgili endişelenmeyin. Bilmeniz gereken tek şey, türü her zaman anot etmeniz gerektiğidir.

:::note
Sabitler herhangi bir kapsamda, küresel kapsam dahil olmak üzere, tanımlanabilir ve bu durum, birçok kod parçasının bilmesi gereken değerler için kullanışlıdır.
:::

Son farklılık, sabitlerin yalnızca bir sabit ifadeye atanmasına, runtime'da hesaplanabilecek bir değerin sonucuna atanmaya izni olmamasıdır.

İşte bir sabit tanımı örneği:

```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

Sabitin adı `THREE_HOURS_IN_SECONDS` ve değeri 60 (bir dakikadaki saniye sayısı) ile 60 (bir saatteki dakika sayısı) çarpılınca 3 (bu programda saymak istediğimiz saatler) ile çarpılarak belirlenmiştir. Rust’ın sabitler için adlandırma kuralı, kelimeler arasında alt çizgi kullanarak tamamen büyük harfle yazmaktır. Derleyici, derleme zamanında sınırlı bir işlem setini değerlendirme yeteneğine sahiptir, bu da bize bu değeri, bu sabiti 10,800 değerine ayarlamak yerine kolayca anlaşılabilir ve doğrulanabilir bir şekilde yazmayı seçme olanağı tanır. Sabitlerin değerlendirilmesi hakkında daha fazla bilgi için [Rust Referansı’nin sabit değerlendirme][const-eval] kısmına bakın.

Sabitler, tanımlandıkları kapsam içinde programın çalıştığı süre boyunca geçerlidir. Bu özellik, sabitleri, bir programın birçok parçasının bilmesi gereken değerler için yararlı hale getirir, örneğin bir oyunun herhangi bir oyuncusunun kazanabileceği maksimum puan sayısı veya ışık hızı gibi. 

Programınızda kullanılan sabitlenmiş değerlere sabit ismi vererek, o değerin gelecekte kodun bakımını üstlenecek kişiler için anlamını iletmek için yararlıdır. Ayrıca, sabitlenmiş bir değer gelecekte güncellenmesi gerektiğinde değiştirmeniz gereken kodda yalnızca tek bir yer olması faydalıdır.

### Gölgeleme

:::info
[2. Bölüm][comparing-the-guess-to-the-secret-number]'deki tahmin oyunu öğreticisinde gördüğünüz gibi, daha önceki bir değişkenle aynı isimde yeni bir değişken tanımlayabilirsiniz.
:::

Rust kullanıcıları, ilk değişkenin ikinci tarafından *gölgelendiğini* söyler; bu, ikinci değişkenin isminin kullanıldığında derleyici tarafından görüleceği anlamına gelir. Aslında, ikinci değişken ilkini aşıyor ve değişken isminin tüm kullanımları onu kendi üzerine alacaktır, ta ki ya kendisi gölgelenene ya da kapsam sona erene kadar. Aynı değişken ismini kullanarak ve `let` anahtar kelimesini tekrarlayarak bir değişkeni gölgeleyebiliriz:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-03-shadowing/src/main.rs}}
```

Bu program önce `x`’i `5` değerine atar. Sonra, `let x =` ifadesini tekrar ederek yeni bir değişken `x` oluşturur, orijinal değeri alır ve `1` ekleyerek `x`’in değerini `6` yapar. Ardından, küme parantezleriyle oluşturulan bir iç kapsamda, üçüncü `let` ifadesi de `x`’i gölgeler ve onu yeni bir değişken haline getirerek önceki değeri `2` ile çarpar ve `x`'e `12` değerini atar. O kapsam sona erdiğinde, iç gölgeleme bitmiş olur ve `x` tekrar `6` olur. Bu programı çalıştırdığımızda, aşağıdaki çıktıyı verecektir:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-03-shadowing/output.txt}}
```

Gölgeleme, bir değişkeni `mut` olarak işaretlemekten farklıdır çünkü kazara bu değişkene atanmayı denediğimizde derleme zamanı hatası alırız. `let` kullanarak, bir değere birkaç dönüşüm yapabiliriz, ama dönüşüm tamamlandıktan sonra değişken sabit kalır.

`mut` ile gölgeleme arasındaki bir diğer fark, `let` anahtar kelimesini tekrar kullandığımızda etkili bir şekilde yeni bir değişken oluşturduğumuz için, değerin türünü değiştirme olanağımızdır, ancak aynı ismi yeniden kullanabiliriz. Örneğin, programımız kullanıcıdan bazı metinler arasında ne kadar boşluk istediklerini gösteren boşluk karakterlerini girmesini istemekte ve ardından bu girişi bir sayı olarak saklamak istemekte:

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-04-shadowing-can-change-types/src/main.rs:here}}
```

İlk `spaces` değişkeni bir string türündedir ve ikinci `spaces` değişkeni bir sayı türündedir. Bu nedenle, gölgeleme bize farklı isimler bulmak zorunda kalmamamızı sağlar; `spaces_str` ve `spaces_num` gibi; bunun yerine, daha basit olan `spaces` ismini yeniden kullanabiliriz. Ancak burada `mut` kullanmaya çalışırsak, aşağıda gösterildiği gibi, bir derleme zamanı hatası alırız:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-05-mut-cant-change-types/src/main.rs:here}}
```

Hata, bir değişkenin türünü değiştiremeyeceğimiz diyor:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-05-mut-cant-change-types/output.txt}}
```

Artık değişkenlerin nasıl çalıştığını araştırdığımıza göre, sahip olabilecekleri daha fazla veri türlerine bakalım.

[comparing-the-guess-to-the-secret-number]:
ch02-00-guessing-game-tutorial.html#comparing-the-guess-to-the-secret-number
[data-types]: ch03-02-data-types.html#data-types
[storing-values-with-variables]: ch02-00-guessing-game-tutorial.html#storing-values-with-variables
[const-eval]: ../reference/const_eval.html