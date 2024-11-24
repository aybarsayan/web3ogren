## Mesajla İletişim Kullanarak İşlemler Arası Veri Taşıma

Güvenli eşzamanlılık sağlama konusunda giderek popülerleşen bir yaklaşım *mesajlaşmadır*, burada iş parçacıkları veya aktörler veri içeren mesajlar göndererek birbirleriyle iletişim kurarlar. İşte bu fikri aktaran bir slogan: [Go dilinin belgelendirmesinden](https://golang.org/doc/effective_go.html#concurrency): 

> “Belleği paylaşarak iletişim kurmayın; bunun yerine iletişim kurarak belleği paylaşın.”  
> — Go Dili Belgeleri

Mesaj gönderme eşzamanlılığı sağlamak için Rust'ın standart kütüphanesi *kanallar* uygulaması sağlar. Bir kanal, verilerin bir iş parçacığından diğerine gönderildiği genel bir programlama kavramıdır.

Programlama bağlamında bir kanalı, suyun aktığı yönlü bir kanal olarak düşünebilirsiniz; örneğin, bir akarsu veya nehir. Nehre bir lastik ördeği koyarsanız, akıntı ile aşağıya doğru hareket eder.

Bir kanalın iki yarısı vardır: bir verici ve bir alıcı. Verici yarısı, nehre lastik ördekleri koyduğunuz yere, alıcı yarısı ise lastik ördeğin akıntının sonuna ulaştığı yerdir. Kodunuzun bir kısmı göndermek istediğiniz veriler ile verici üzerinde yöntemler çağırır, ve diğer bir kısım da gelen mesajlar için alıcı ucunu kontrol eder. Verici veya alıcı kısmı düşerse, kanal *kapalı* olarak kabul edilir.

:::note
Burada, bir iş parçacığını değerler üretmek ve bunları bir kanaldan göndermek üzere ve başka bir iş parçacığını değerleri almak ve yazdırmak üzere çalıştıran bir program geliştireceğiz. Bu özellikleri göstermek için iş parçacıkları arasında basit değerler göndereceğiz. 
:::

Tekniğe alıştığınızda, bir sohbet sistemi veya birçok iş parçacığının bir hesaplamanın parçalarını gerçekleştirdiği ve parçaları bir iş parçacığına toplamak üzere gönderdiği bir sistem gibi, birbirleriyle iletişim kurması gereken iş parçacıkları için kanalları kullanabilirsiniz.

Öncelikle, 16-6 numaralı listedeki gibi bir kanal oluşturacağız, ancak onunla herhangi bir işlem yapmayacağız. Rust’ın, kanal üzerinden hangi tür değerleri göndermek istediğini henüz bilemediğini unutmayın.

Dosya Adı: src/main.rs

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-06/src/main.rs}}
```

Liste 16-6: Bir kanal oluşturarak iki yarısını `tx` ve `rx` olarak atama

Yeni bir kanal oluştururken `mpsc::channel` fonksiyonunu kullanıyoruz; `mpsc`, *birden fazla üretici, tek tüketici* anlamına gelir. Kısacası, Rust’ın standart kütüphanesinin kanalları uygulama biçimi, bir kanalın değer üreten birden fazla *gönderme* ucu olabileceği ancak bu değerleri tüketmek için yalnızca bir *alım* ucu olması anlamına gelir. 

:::info
Hayal edin ki birçok akarsunun birleşip bir büyük nehir oluşturması gibi: akarsulardan gönderilen her şey sonunda tek bir nehirde bir araya gelir. 
:::

Şu anda tek bir üretici ile başlayacağız; ancak bu örneği çalışır hale getirdiğimizde birden fazla üretici ekleyeceğiz.

`mpsc::channel` fonksiyonu, ilk elemanı gönderme ucu—verici—ve ikinci elemanı alma ucu—alıcı—olan bir demet döndürür. `tx` ve `rx` kısaltmaları, pek çok alanda sırasıyla *gönderici* ve *alıcı* olarak kullanıldıkları için, her bir ucu belirtmek adına değişkenlerimizi bu şekilde adlandırıyoruz. Demetleri parçalayarak almak için bir desen ile `let` ifadesi kullanıyoruz; `let` ifadelerindeki desenlerin kullanımı ve parçalama konusunu 19. Bölümde tartışacağız. Şu aşamada, `let` ifadesinin bu şekilde kullanılmasının, `mpsc::channel` tarafından döndürülen demetin parçalarını çıkarmak için pratik bir yaklaşım olduğunu bilin.

Verici ucunu oluşturulmuş bir iş parçacığına taşıyacak ve bir dize göndererek oluşturulan iş parçacığının ana iş parçacığı ile iletişim kurmasını sağlayacağız, bu 16-7 numaralı listedeki gibi. Bu, nehrin akıntısına bir lastik ördek koymak veya bir iş parçacığından diğerine bir sohbet mesajı göndermek gibidir.



```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-07/src/main.rs}}
```



Yine, yeni bir iş parçacığı oluşturmak için `thread::spawn` kullanıyoruz ve ardından `move` ile `tx`'i kapanış içine taşıyoruz, böylece oluşturulan iş parçacığı `tx`'nin sahibi olur. Oluşturulan iş parçacığı, kanaldan mesaj gönderebilmesi için vericinin sahibi olmalıdır. Vericinin, göndermek istediğimiz değeri alan bir `send` yöntemi vardır. `send` yöntemi, `Result` türünde bir değer döndürür, bu nedenle alıcı zaten düşmüşse ve bir değeri gönderecek yer yoksa, gönderme işlemi hata döndürecektir. 

:::warning
Bu örnekte `unwrap` çağrısı yaparak hata durumunda panikliyoruz. Ancak gerçek bir uygulamada, bunu düzgün bir şekilde ele alırız: doğru hata yönetimi stratejileri için 9. Bölüme geri dönün.
:::

16-8 numaralı listede, ana iş parçacığında alıcıdan değeri alacağız. Bu, nehrin sonunda lastik ördeği sudan almak veya bir sohbet mesajı almaya benziyor.



```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-08/src/main.rs}}
```



Alıcının iki kullanışlı yöntemi vardır: `recv` ve `try_recv`. Beklenen değeri almak için ana iş parçacığının yürütülmesini engelleyen `recv` yöntemi ile döndürülen değer `Result` formatındadır. Verici kapandığında, `recv` artık değer gönderilmeyeceğini belirtmek için hata döndürecektir.

`try_recv` yöntemi engellemez, aksine hemen bir `Result` değeri döndürür: eğer bir mesaj mevcutsa `Ok` değeri, bu sefer bir mesaj yoksa `Err` değeri döndürür. Eğer bu iş parçacığının mesaj beklerken yapılacak başka işleri varsa, `try_recv` kullanmak faydalıdır: belirli aralıklarla `try_recv` çağırarak bir mesaj varsa işleyecek ve yoksa başka işlerle bir süre meşgul olacak bir döngü yazabiliriz.

:::tip
Bu örnekte, ana iş parçacığının başka bir iş yapacak durumu olmadığı için, `recv` kullanıyoruz; dolayısıyla ana iş parçacığını engellemek uygun.
:::

16-8 numaralı listedeki kodu çalıştırdığımızda, ana iş parçacığından üretilen değeri görebiliriz:

```text
Got: hi
```

Perfect!

---

### Kanallar ve Mülkiyet Transferi

Mülkiyet kuralları, mesaj göndermenin etkili biçiminde önemli bir rol oynar çünkü güvenli ve eşzamanlı kod yazmanıza yardımcı olurlar. Eşzamanlı programlamadaki hataları önlemek, Rust programlarınızda mülkiyetle ilgili düşünmenin avantajıdır. 

:::note
Kanallar ve mülkiyetin birlikte nasıl çalıştığını göstermek için bir deney yapalım: `val` değerini, onu kanaldan gönderdikten *sonra* oluşturulmuş iş parçacığında kullanmaya çalışalım. 
:::

16-9 numaralı listedeki kodu derlemeye çalışarak bu kodun neden mümkün olmadığını görebilirsiniz:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-09/src/main.rs}}
```



Burada, `val`'i `tx.send` ile kanaldan gönderdikten sonra yazdırmaya çalışıyoruz. Bunun mümkün olması kötü bir fikir olurdu: bir değer başka bir iş parçacığına gönderilir gönderilmez, o iş parçacığı değeri değiştirebilir veya düşürebilir, bu da değeri tekrar kullanmaya çalıştığımızda hatalara ya da beklenmeyen sonuçlara neden olabilir. Ancak, 16-9 numaralı listedeki kodu derlemeye çalıştığımızda Rust bize bir hata verir:

```console
{{#include ../listings/ch16-fearless-concurrency/listing-16-09/output.txt}}
```

Eşzamanlılık hatamız bir derleme zaman hatasına neden oldu. `send` fonksiyonu, parametresinin mülkiyetini alır ve değer taşındığında alıcı onun mülkiyetini üstlenir. Bu da, değeri gönderdikten sonra kazara tekrar kullanmamızı engeller; mülkiyet sistemi her şeyin yolunda gittiğini kontrol eder.

---

### Birden Fazla Değer Gönderme ve Alıcının Bekleme Durumunu Görme

16-8 numaralı listedeki kod derlendi ve çalıştı, ancak iki ayrı iş parçacığının kanal üzerinden birbirleriyle konuştuğunu net bir şekilde göstermedi. 16-10 numaralı listedeki gibi kodda bazı değişiklikler yaptık, böylece 16-8 numaralı listedeki kodun eşzamanlı olarak çalıştığını kanıtlayacağız: oluşturulan iş parçacığı artık birden fazla mesaj gönderecek ve her mesaj arasında bir saniye bekleyecek.



```rust,noplayground
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-10/src/main.rs}}
```



Bu sefer, oluşturulan iş parçacığı ana iş parçacığına göndermek istediğimiz bir dize vektörüne sahiptir. Onlar üzerinde yineleyerek, her birini tek tek gönderiyoruz ve her bir mesaj arasında 1 saniyelik bir bekleme süresi koymak için `thread::sleep` fonksiyonunu kullanıyoruz.

Ana iş parçacığında artık `recv` fonksiyonunu açıkça çağırmıyoruz: bunun yerine, `rx`'i bir yineleyici gibi kullanıyoruz. Gelen her değer alındığında yazdırıyoruz. Kanal kapandığında, yineleme sona erecektir.

16-10 numaralı listedeki kodda çalıştırıldığında, her satır arasında 1 saniyelik bir bekleme ile aşağıdaki çıktıyı görmelisiniz:

```text
Got: hi
Got: from
Got: the
Got: thread
```

:::tip
`for` döngüsünde ana iş parçacığında bekleyen veya geciken kod olmadığından, ana iş parçacığının oluşturulan iş parçacığından değerleri almak için beklediğini söyleyebiliriz.
:::

---

### Verici Tüketimini Klonlayarak Birden Fazla Üretici Oluşturma

Daha önce, `mpsc`'nin *birden fazla üretici, tek tüketici* anlamına geldiğinden bahsetmiştik. `mpsc`'yi kullanarak 16-10 numaralı listedeki kodunuzu genişletelim ve tümü aynı alıcıya değer gönderen birden fazla iş parçacığı oluşturalım. Bunu, 16-11 numaralı listedeki gibi vericiyi klonlayarak yapabiliriz:



```rust,noplayground
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-11/src/main.rs:here}}
```



Bu sefer, ilk oluşturulan iş parçacığını oluşturmadan önce vericide `clone` çağırıyoruz. Bu, ilk oluşturulan iş parçacığına geçirebileceğimiz yeni bir verici verecektir. Orijinal vericiyi ikinci bir oluşturulmuş iş parçacığına geçiriyoruz. Bu, bize iki iş parçacığı verir; her biri aynı alıcıya farklı mesajlar gönderir.

Kodu çalıştırdığınızda, çıktınız aşağıdakine benzer görünmelidir:

```text
Got: hi
Got: more
Got: from
Got: messages
Got: for
Got: the
Got: thread
Got: you
```

Değerleri sisteminize bağlı olarak başka bir sırada görebilirsiniz. Bu, eşzamanlılığı ilginç ama bir o kadar da zor hale getiren şeydir. `thread::sleep` ile farklı iş parçacıklarında farklı değerler vererek denemeler yaparsanız, her çalıştırma daha deterministik olmayacak ve her seferinde farklı çıktılar üretecektir.

Artık kanalların nasıl çalıştığını gördüğümüze göre, bir başka eşzamanlılık yöntemine bakalım.