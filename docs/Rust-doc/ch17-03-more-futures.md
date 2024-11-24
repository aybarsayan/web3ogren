## Herhangi Bir Sayıda Gelecek İşlemleri ile Çalışmak

Önceki bölümde iki gelecekten üç geleceğe geçiş yaptığımızda, `join` kullanmaktan `join3` kullanmaya geçmemiz gerekti. Gelecek sayısını her değiştirdiğimizde farklı bir fonksiyon çağırmak can sıkıcı olurdu. Neyse ki, `join`'in geçerli bir makro formu var ve buna keyfi sayıda argüman geçirebiliyoruz. Bu makro, geleceklere erişimi de kendisi halleder. Böylece, Liste 17-13'teki kodu `join3` yerine `join!` kullanacak şekilde yeniden yazabiliriz; Liste 17-14'te gördüğümüz gibi:



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-14/src/main.rs:here}}
```



Bu, `join`, `join3` ve `join4` arasında geçiş yapma zorunluluğuna göre kesinlikle güzel bir iyileştirme! Ancak, bu makro biçimi bile geleceği önceden bilmediğimiz durumlarda çalışmıyor. Gerçek dünyada Rust'ta, geleceklere bir koleksiyona eklemek ve ardından o koleksiyondaki bazı veya tüm geleceklere beklemek yaygın bir örnektir.

:::info
Gelecekleri koleksiyonlara eklemek yaygın bir durumdur; bu sayede daha dinamik bir yapı oluşturabilirsiniz.
:::

Bazı koleksiyonlardaki tüm geleceklere bakmak için, *hepsinin* üzerinde döngü yapmamız ve bunları birleştirmemiz gerekecek. `trpl::join_all` fonksiyonu, 13. bölümde öğrendiğimiz `Iterator` trait'ini implement eden herhangi bir türü kabul eder, bu yüzden bu makul görünüyor. Geleceklerimizi bir vektöre koymayı deneyelim ve `join!`'i `join_all` ile değiştirelim.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch17-async-await/listing-17-15/src/main.rs:here}}
```



Ne yazık ki, bu derlenmiyor. Bunun yerine, bu hata ile karşılaşıyoruz:

```text
error[E0308]: mismatched types
  --> src/main.rs:45:37
   |
10 |         let tx1_fut = async move {
   |                       ---------- the expected `async` block
...
24 |         let rx_fut = async {
   |                      ----- the found `async` block
...
45 |         let futures = vec![tx1_fut, rx_fut, tx_fut];
   |                                     ^^^^^^ expected `async` block, found a different `async` block
   |
   = note: expected `async` block `{async block@src/main.rs:10:23: 10:33}`
              found `async` block `{async block@src/main.rs:24:22: 24:27}`
   = note: no two async blocks, even if identical, have the same type
   = help: consider pinning your async block and casting it to a trait object
```

Bu şaşırtıcı olabilir. Sonuçta, hiçbiri bir şey döndürmüyor, bu yüzden her blok bir `Future` üretiyor. Ancak, `Future` bir trait'tir, somut bir tür değil. Somut türler, derleyici tarafından async bloklar için üretilen bireysel veri yapılarıdır. İki farklı manuel olarak yazılmış yapı bir `Vec` içinde olamaz; bu, derleyici tarafından üretilen farklı yapılar için de geçerlidir.

:::warning
Her farklı async blok, kendine has bir tür ürettiğinden, aynı türde olmaları zorunludur.
:::

Bunu çalıştırmak için, trait nesnelerini kullanmamız gerekiyor; bu, 12. bölümde [“Koşu Fonksiyonundan Hataları Döndürmek”][dyn] başlığında yaptığımız gibi. (Trait nesnelerini 18. bölümde ayrıntılı olarak ele alacağız.) Trait nesnelerini kullanmak, bu türlerin ürettiği her bir anonim geleceği aynı tür olarak işlememizi sağlar, çünkü bunların hepsi `Future` trait'ini implement eder.

> Not: 8. bölümde, bir `Vec` içinde birden fazla türü dahil etmek için kullanılan bir diğer yolu tartıştık: vektörde görünebilecek farklı türleri temsil etmek için bir enum kullanmak. Ancak burada bunu yapamayız. Bir şey, farklı türleri adlandırmanın bir yolu yok, çünkü anonimdirler. Diğer yandan, `join_all` için bir vektör kullanma sebebimiz, hepsinin ne olacağına çalışma zamanında kadar bilmeden dinamik bir gelecek koleksiyonu ile çalışmaktır.

Gelecekleri `vec!` içindeki her birini `Box::new` ile sarmalamaya başlıyoruz; bu, Liste 17-16'da gösterildiği gibi.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch17-async-await/listing-17-16/src/main.rs:here}}
```



Ne yazık ki, bu hâlâ derlenmiyor. Aslında, daha önce olduğumuz temel hataya sahibiz; ancak bu sefer ikinci ve üçüncü `Box::new` çağrıları için bir hata alıyoruz ve ayrıca `Unpin` trait'ine atıfta bulunan yeni hatalar alıyoruz. Öncelikle, tür hatalarını düzeltmek için `Box::new` çağrılarındaki türü açıkça belirtelim:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch17-async-await/listing-17-17/src/main.rs:here}}
```



Burada yazmamız gereken tür biraz karmaşık, bu yüzden üzerinden geçelim:

* En içteki tür, geleceğin kendisidir. Geleceğin çıktısının birim türü `()` olduğunu açıkça belirtiyoruz `Future` yazarak.
* Sonra, dinamik olduğunu belirtmek için trait'i `dyn` ile işaretliyoruz.
* Tüm trait referansı bir `Box` içinde sarılır.
* Son olarak, `futures`'ın bu türleri içeren bir `Vec` olduğunu açıkça belirtiyoruz.

Bu büyük bir fark yarattı. Şimdi derleyiciyi çalıştırdığımızda, yalnızca `Unpin` ile ilgili hatalarımız kalıyor. Üç tane olmalarına rağmen, her biri içerik açısından oldukça benzer.

```text
error[E0308]: mismatched types
   --> src/main.rs:46:46
    |
10  |         let tx1_fut = async move {
    |                       ---------- the expected `async` block
...
24  |         let rx_fut = async {
    |                      ----- the found `async` block
...
46  |             vec![Box::new(tx1_fut), Box::new(rx_fut), Box::new(tx_fut)];
    |                                     -------- ^^^^^^ expected `async` block, found a different `async` block
    |                                     |
    |                                     arguments to this function are incorrect
    |
    = note: expected `async` block `{async block@src/main.rs:10:23: 10:33}`
               found `async` block `{async block@src/main.rs:24:22: 24:27}`
    = note: no two async blocks, even if identical, have the same type
    = help: consider pinning your async block and casting it to a trait object
note: associated function defined here
   --> file:///home/.rustup/toolchains/1.82/lib/rustlib/src/rust/library/alloc/src/boxed.rs:255:12
    |
255 |     pub fn new(x: T) -> Self {
    |            ^^^

error[E0308]: mismatched types
   --> src/main.rs:46:64
    |
10  |         let tx1_fut = async move {
    |                       ---------- the expected `async` block
...
30  |         let tx_fut = async move {
    |                      ---------- the found `async` block
...
46  |             vec![Box::new(tx1_fut), Box::new(rx_fut), Box::new(tx_fut)];
    |                                                       -------- ^^^^^^ expected `async` block, found a different `async` block
    |                                                       |
    |                                                       arguments to this function are incorrect
    |
    = note: expected `async` block `{async block@src/main.rs:10:23: 10:33}`
               found `async` block `{async block@src/main.rs:30:22: 30:32}`
    = note: no two async blocks, even if identical, have the same type
    = help: consider pinning your async block and casting it to a trait object
note: associated function defined here
   --> file:///home/.rustup/toolchains/1.82/lib/rustlib/src/rust/library/alloc/src/boxed.rs:255:12
    |
255 |     pub fn new(x: T) -> Self {
    |            ^^^

error[E0277]: `{async block@src/main.rs:10:23: 10:33}` cannot be unpinned
   --> src/main.rs:48:24
    |
48  |         trpl::join_all(futures).await;
    |         -------------- ^^^^^^^ the trait `Unpin` is not implemented for `{async block@src/main.rs:10:23: 10:33}`, which is required by `Box<{async block@src/main.rs:10:23: 10:33}>: Future`
    |         |
    |         required by a bound introduced by this call
    |
    = note: consider using the `pin!` macro
            consider using `Box::pin` if you need to access the pinned value outside of the current scope
    = note: required for `Box<{async block@src/main.rs:10:23: 10:33}>` to implement `Future`
note: required by a bound in `join_all`
   --> file:///home/.cargo/registry/src/index.crates.io-6f17d22bba15001f/futures-util-0.3.30/src/future/join_all.rs:105:14
    |
102 | pub fn join_all<I>(iter: I) -> JoinAll<I::Item>
    |        -------- required by a bound in this function
...
105 |     I::Item: Future,
    |              ^^^^^^ required by this bound in `join_all`

error[E0277]: `{async block@src/main.rs:10:23: 10:33}` cannot be unpinned
  --> src/main.rs:48:9
   |
48 |         trpl::join_all(futures).await;
   |         ^^^^^^^^^^^^^^^^^^^^^^^ the trait `Unpin` is not implemented for `{async block@src/main.rs:10:23: 10:33}`, which is required by `Box<{async block@src/main.rs:10:23: 10:33}>: Future`
   |
   = note: consider using the `pin!` macro
           consider using `Box::pin` if you need to access the pinned value outside of the current scope
   = note: required for `Box<{async block@src/main.rs:10:23: 10:33}>` to implement `Future`
note: required by a bound in `futures_util::future::join_all::JoinAll`
  --> file:///home/.cargo/registry/index.crates.io-6f17d22bba15001f/futures-util-0.3.30/src/future/join_all.rs:29:8
   |
27 | pub struct JoinAll<F>
   |            ------- required by a bound in this struct
28 | where
29 |     F: Future,
   |        ^^^^^^ required by this bound in `JoinAll`
```

Bu, *çok* fazla bilgiler içeriyor, bu yüzden parçalara ayıralım. Mesajın ilk kısmı, ilk async bloğun (`src/main.rs:8:23: 20:10`) `Unpin` trait'ini implement etmediğini gösteriyor ve bunun çözümü için `pin!` veya `Box::pin` kullanmayı öneriyor. Bölümün ilerleyen kısımlarında `Pin` ve `Unpin` hakkında daha fazla ayrıntıya gireceğiz. Ancak, bu noktada derleyicinin önerisini takip edip sıkışıklığı aşalım! Liste 17-18'de `futures` için tür belirtimini güncelleyerek başlıyoruz, her birine `Pin` ekliyoruz. İkinci olarak, geleceğin kendisini sabitlemek için `Box::pin` kullanıyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-18/src/main.rs:here}}
```



Bunu derleyip çalıştırdığımızda, nihayet umduğumuz çıktıyı alıyoruz:

```text
received 'hi'
received 'more'
received 'from'
received 'messages'
received 'the'
received 'for'
received 'future'
received 'you'
```

Uff!

Burada daha keşfedecek bir şey var. Bir şey, `Pin>` kullanmanın, bu gelecekleri `Box` ile heap'e koymaktan kaynaklanan küçük bir ek yükü vardır; ve bunu yalnızca türlerin hizalanması için yapıyoruz. Sonuçta, heap tahsisine *ihtiyacımız yoktur*; bu geleceklere belirli bir işlev içinde yereliz. Yukarıda belirtildiği gibi, `Pin` kendisi bir sarmalayıcı türdür, böylece `Box` için başvuruda bulunduğumuz gibi `Vec` içinde bir tür tekliği faydasını elde edebiliriz - heap tahsisi olmadan. Her bir gelecek için `Pin` 'i doğrudan kullanabiliriz ve `std::pin::pin` makrosunu kullanarak yapabiliriz.

:::note
`pin!` makrosu, pointer’ların güvenli bir şekilde yönetilmesine yardımcı olur ve dinamik türlerle çalışırken önemlidir.
:::

Ancak, sabit referansın türü hakkında hala açık olmalıyız; aksi takdirde Rust, bunların `Vec` içinde dinamik trait nesneleri olarak yorumlayacağını bilmeyecektir. Bu nedenle, her geleceği tanımladığımızda `pin!` ile sabitliyoruz ve `futures`'ı dinamik `Future` türüne sabitlenmiş güncellenebilir referanslar içeren bir `Vec` olarak tanımlıyoruz; Liste 17-19'da görüldüğü gibi.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-19/src/main.rs:here}}
```



Bu noktaya, farklı `Output` türleri olabileceği gerçeğini göz ardı ederek geldik. Örneğin, Liste 17-20'de `a` için anonim gelecek `Future`, `b` için anonim gelecek `Future`, ve `c` için anonim gelecek `Future` implement eder.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-20/src/main.rs:here}}
```



:::tip
`trpl::join!` kullanarak farklı türdeki gelecekleri bekleyebilirsiniz; ancak `join_all` yalnızca aynı türdeki gelecekleri kabul eder.
:::

`trpl::join!` kullanarak onları bekleyebiliriz, çünkü bu, birden fazla gelecek türü geçirmenize ve bu türlerin bir demetini üretmenize izin verir. `trpl::join_all`'ı kullanamayız, çünkü bu, geçirdiğimiz geleceklere ait türlerin hepsinin aynı olmasını gerektirir. Unutmayın, bu hata, `Pin` ile bu maceraya çıkmamıza neden olan hataydı!

Bu, temel bir seçimdir: `join_all` ile dinamik bir sayıda gelecekle uğraşabiliriz, yeter ki hepsi aynı türde olsun veya aynı türde olmasalar bile `join` fonksiyonları veya `join!` makrosu ile belirli bir sayıda gelecekle uğraşabiliriz. Rust'taki diğer türlerle çalışmakla aynıdır; geleceklere özel bir şey yoktur, bunlarla çalışmak için güzel bir sözdizimi olmasına rağmen, bu iyi bir şeydir.

### Gelecek Yarışları

Gelecekleri `join` fonksiyonları ve makroları ile "birleştirdiğimizde", *hepsinin* tamamlanmasını bekliyoruz. Ancak bazen, ilerlemek için bir setten yalnızca *bazı* bir geleceğin tamamlanması gerekir—bir belirsiz gelecekle bir diğerine yarıştırmaya benzer.

Liste 17-21'de, `trpl::race` kullanarak `slow` ve `fast` adlı iki geleceği birbirine karşı çalıştırıyoruz. Her biri çalışmaya başladığında bir mesaj basar, belirli bir süre boyunca `sleep` çağırarak ve bekleyerek duraklar, ardından bittiğinde başka bir mesaj basar. Sonra ikisini `trpl::race`'e geçiririz ve birinin bitmesini bekleriz. (Bu durumda sonuç çok şaşırtıcı olmayacak: `fast` kazanır!) Daha önce [İlk Async Programımız][async-program] da `race` kullandığımızda olduğu gibi, döngülerin çok ilginç olduğunu düşündüğümüz `Either` örneğini burada sadece göz ardı ediyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-21/src/main.rs:here}}
```



:::info
`race` fonksiyonu, argümanların sırasını değiştirirseniz, tam olarak hangi geleceğin tamamlandığını görmenizi sağlar.
:::

`race`'e geçen argümanların sırasını değiştirirseniz, "başlatıldı" mesajlarının sırasının değiştiğini göreceksiniz, ancak `fast` geleceği her zaman ilk tamamlanır. Bunun sebebi, bu belirli `race` fonksiyonunun adil olmamasıdır. Geçerli argümanları sıraya göre çalıştırır. Diğer uygulamalar *adil* olabilir ve hangi geleceği önce kontrol edeceğini rastgele seçebilir. Ancak kullandığımız `race`'in uygulamasının adil olup olmaması fark etmeksizin, *bir* gelecek, bir diğer görevin başlamasından önce gövdesindeki ilk `await` noktasına kadar çalışır.

:::tip
Race koşulları, belirli durumlarda program akışını etkileyebilir; dikkatli olun!
:::

[İlk Async Programımız][async-program] kısmında hatırlayın ki, her `await` noktasında, Rust koşulu duraklatmak ve beklenen geleceğin hazır değilse başka birine geçiş yapmak için bir fırsat verir. Tersine, Rust yalnızca bir `await` noktasında async bloklarını duraklatıp kontrolü bir çalışma zamanına verir. `await` noktaları arasındaki her şey senkronizedir.

Bu, bir async blok içinde `await` noktası olmadan bir dizi iş yaparsanız, bu geleceği diğer tüm geleceklere ilerlemeden engelleyecektir. Bazen, bu durumun bir geleceğin diğer geleceklere *açlık vermesi* olarak adlandırıldığını duyabilirsiniz. Bazı durumlarda, bu büyük bir sorun olmayabilir. Ancak, pahalı bir kurulum veya uzun süreli bir iş yapıyorsanız veya belirli bir görevi sonsuza kadar sürdürecek bir geleceğiniz varsa, kontrolü çalışma zamanına geri verme zamanınızı ve yerinizi düşünmelisiniz.

Aynı şekilde, uzun süreli bloklama işlemlerine sahip olduğunuzda, async, programın farklı bölümlerinin birbirleriyle ilişkili yollar sağlaması için faydalı bir araç olabilir.

Ama bu durumlarda çalışma zamanına kontrolü nasıl geri vereceksiniz?

### Yielding

Uzun süren bir işlemi simüle edelim. Listing 17-22, bir `slow` fonksiyonunu tanıtır. `slow`, `trpl::sleep` yerine `std::thread::sleep` kullanır, böylece `slow` fonksiyonu çağrıldığında mevcut iş parçacığını bir süreliğine engeller. `slow` fonksiyonunu, hem uzun süreli hem de engelleyici olan gerçek dünya işlemleri için bir yer tutucu olarak kullanabiliriz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-22/src/main.rs:slow}}
```



Listing 17-23'te, `slow` fonksiyonunu bir çift gelecekte CPU bağlı bir işi bu şekilde taklit etmek için kullanıyoruz. Başlangıçta, her bir gelecek kontrolü, bir dizi yavaş işlemi gerçekleştirdikten sonra çalışma zamanına geri teslim eder.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-23/src/main.rs:slow-futures}}
```



Bunu çalıştırdığınızda, aşağıdaki çıktıyı göreceksiniz:

```text
'a' started.
'a' ran for 30ms
'a' ran for 10ms
'a' ran for 20ms
'b' started.
'b' ran for 75ms
'b' ran for 10ms
'b' ran for 15ms
'b' ran for 350ms
'a' finished.
```

:::info
Önceki örneğimize benzer şekilde, `race`, `a` tamamlanır tamamlanmaz sona erer. Ancak iki gelecek arasında bir sıra yoktur.
:::

`a` geleceği, `trpl::sleep` çağrısına ulaşana kadar tüm işini yapar, ardından `b` geleceği kendi `trpl::sleep` çağrısına kadar tüm işini yapar ve ardından `a` geleceği tamamlanır. Her iki geleceğin yavaş görevleri arasında ilerleme kaydetmesi için bekleme noktalarına ihtiyacımız var, bu nedenle bekleyebileceğimiz bir şeye ihtiyacımız var!

Bu tür bir devrin Listing 17-23'te gerçekleştiğini zaten görebiliyoruz: `a` geleceğinin sonundaki `trpl::sleep` kaldırılırsa, `b` geleceği çalışmadan *tamamen* tamamlanır. Belki başlamak için `sleep` fonksiyonunu kullanabiliriz?



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-24/src/main.rs:here}}
```



Listing 17-24'te, her `slow` çağrısının arasında bekleme noktaları ile `trpl::sleep` çağrıları ekliyoruz. Artık iki geleceğin çalışması birbirine karışmış durumda:

```text
'a' started.
'a' ran for 30ms
'b' started.
'b' ran for 75ms
'a' ran for 10ms
'b' ran for 10ms
'a' ran for 20ms

'b' ran for 15ms'a' finished.
```

:::note
`a` geleceği, `b`'ye kontrolü devretmeden önce bir süre çalışmaya devam eder çünkü `trpl::sleep` çağrısından önce `slow` çağrısında bulunur, ancak sonrasında gelecekle ilgili olanlar her biri bir bekleme noktasına ulaştığında sırayla geçiş yapar. Bu durumda, her `slow` çağrısından sonra bunu yaptık, ancak işi en mantıklı olacak şekilde bölebiliriz.
:::

Bura gerçekten *uyuyakalmayı* istemiyoruz: mümkün olduğunca hızlı ilerlemek istiyoruz. Tekrar çalışma zamanına kontrol devretmemiz gerekiyor. Bunu doğrudan, `yield_now` fonksiyonu kullanarak yapabiliriz. Listing 17-25'te, tüm `sleep` çağrılarını `yield_now` ile değiştiriyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-25/src/main.rs:yields}}
```



:::tip
Bu, gerçek niyet hakkında daha net bir görüntü sağlar ve `sleep` kullanmaktan önemli ölçüde daha hızlı olabilir, çünkü zamanlayıcılar, `sleep` gibi kullanılanlar genellikle ne kadar ince granüle olabilecekleriyle ilgili sınırlara sahiptir. Kullandığımız `sleep` versiyonu, örneğin, bir nanosecond'luk bir `Duration` geçerse bile her zaman en az bir milisaniye boyunca uyuyar.
:::

Bunu kendiniz görebilirsiniz. Listing 17-26'daki gibi küçük bir deneme ayarlayarak. (Bu, performans testi için özellikle titiz bir yol değil, ancak burada farkı göstermek için yeterlidir.) Burada, tüm durum yazdırmalarını atlıyoruz, `trpl::sleep`'e bir nanosecond'luk `Duration` geçiriyoruz ve her bir geleceği kendi başına çalıştırıyoruz, geleceğin arasında bekleme yapmaksızın. Daha sonra 1.000 yineleme için çalıştırıyoruz ve `trpl::sleep` kullanan geleceğin süresi ile `trpl::yield_now` kullanan geleceğin süresini karşılaştırıyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-26/src/main.rs:here}}
```



`yield_now` ile yapılan versiyon *çok* daha hızlı!

:::warning
Bu, async'nin hesaplama bazlı görevler için bile yararlı olabileceği anlamına gelir, programınızın diğer bölümlerinin ne yaptığına bağlıdır, çünkü bu, programın farklı bölümleri arasındaki ilişkileri yapılandırmak için yararlı bir araç sunar.
:::

Bu, her bir geleceğin bekleme noktaları aracılığıyla kontrolü ne zaman devredeceğini belirleme yeteneğine sahip olduğu bir *işbirlikçi çoklu görev* biçimidir. Bu nedenle her geleceğin çok uzun süre engellenmemesi sorumluluğu da vardır. Bazı Rust tabanlı gömülü işletim sistemlerinde, bu *tek* çoklu görev türüdür!

Gerçek dünya kodunda, her bir satırda bekleme noktaları ile işlev çağrılarını alternatif olarak kullanmıyorsunuz, elbette. Bu şekilde kontrolü devretmek nispeten ucuz olsa da, bedava değil! Birçok durumda, hesaplama bazlı bir görevi bölmeye çalışmak, onu önemli ölçüde yavaşlatabilir, bu nedenle bazen *genel* performans için işlemin kısa bir süre engellenmesine izin vermek daha iyidir. Kodunuzun gerçek performans darboğazlarının ne olduğunu görmek için her zaman ölçüm yapmalısınız. Bekleniyor olsa da, beklettiğinizde çok fazla iş olduğuna dikkat etmeniz gereken önemli bir dinamik!

---

### Kendi Async Abstraksiyonlarımızı Oluşturma

Ayrıca, yeni desenler yaratmak için geleceği bir araya toplayabiliriz. Örneğin, zaten sahip olduğumuz async yapı taşlarıyla bir `timeout` fonksiyonu oluşturabiliriz. İşimiz bittiğinde, sonuç, daha fazla async abstraksiyon oluşturmak için kullanabileceğimiz başka bir yapı taşı olacaktır.

Listing 17-27, bu `timeout` fonksiyonunun yavaş bir gelecekle nasıl çalışmasını bekleyeceğimizi gösterir.



```rust,ignore
{{#rustdoc_include ../listings/ch17-async-await/listing-17-27/src/main.rs:here}}
```



Bunu uygulayalım! Öncelikle, `timeout` için API'yi düşünelim:

* Kendisi bir async fonksiyonu olmalı, böylece bekleyebiliriz.
* İlk parametresi çalıştırılacak bir gelecek olmalıdır. Herhangi bir gelecekle çalışması için onu genel (generic) yapabiliriz.
* İkinci parametresi, beklemek için maksimum süre olacaktır. Eğer bir `Duration` kullanırsak, bu, `trpl::sleep`'e iletmeyi kolaylaştıracaktır.
* Bir `Result` döndürmelidir. Eğer gelecek başarıyla tamamlanırsa, `Result` geleceğin ürettiği değer ile `Ok` olacaktır. Eğer zaman aşımı önce gerçekleşirse, `Result`, zaman aşımının beklediği süre ile `Err` olacaktır.

Listing 17-28, bu bildirimi göstermektedir.





```rust,ignore
{{#rustdoc_include ../listings/ch17-async-await/listing-17-28/src/main.rs:declaration}}
```



Bu, türler için hedeflerimizi karşılar. Şimdi, gereken *davranışı* düşünelim: beklenen geleceği zaman aralığına karşı yarıştırmak istiyoruz. Zaman aşımından bir zamanlayıcı geleceği oluşturmak için `trpl::sleep` kullanabiliriz ve `trpl::race` ile bu zamanlayıcıyı çağıranın geçtiği gelecekle çalıştırabiliriz.

Ayrıca `race`'in adil olmadığını ve argümanları, geçtikleri sıraya göre kontrol ettiğini biliyoruz. Bu nedenle, iyi bir şansı olsun diye `future_to_try`'yi önce `race`'e geçiriyoruz. Eğer `future_to_try` önce tamamlanırsa, `race`, geleceğin çıktısıyla `Left` döndürecektir. Eğer zamanlayıcı önce tamamlanırsa, `race`, zamanlayıcının çıktısı olan `()` ile `Right` dönecektir.

Listing 17-29'da, `trpl::race`'in beklenmesi sonucunu eşliyoruz. Eğer `future_to_try` başarılı olmuşsa ve `Left(output)` alıyorsak, `Ok(output)` döndürüyoruz. Eğer zamanlayıcı süresi dolmuşsa ve `Right(())` alıyorsak, `_` ile `()`'yu yoksayıp, `Err(max_time)` döndürüyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-29/src/main.rs:implementation}}
```



Bununla birlikte, iki başka async yardımcıdan oluşturulmuş çalışan bir `timeout`'a sahibiz. Kodumuzu çalıştırırsak, zaman aşımından sonra hata modunu yazdırır:

```text
Failed after 2 seconds
```

:::danger
Gelecekler, diğer geleceklere kompoze olabildiğinden, daha küçük async yapı taşlarını kullanarak gerçekten güçlü araçlar oluşturabilirsiniz. Örneğin, bu aynı yaklaşımı zaman aşımını tekrarlarla birleştirmek için kullanabilir ve ardından bunları ağ çağrıları gibi şeylerle kullanabilirsiniz—bölümün başındaki örneklerden biri!
:::

Pratikte, genellikle doğrudan `async` ve `await` ile çalışacaksınız ve ikincil olarak `join`, `join_all`, `race` ve benzeri işlevler ve makrolarla. Bununla birlikte, bu API'lerle kullanmak için `pin`'e zaman zaman ulaşmanız gerekecek.

Artık aynı anda birden fazla gelecekle çalışma yollarını gördük. Önümüzde, zaman içinde bir sırayla birden fazla gelecekle nasıl çalışabileceğimize bakalım, *akışlarla*. Ancak öncelikle dikkate almanız gereken birkaç şey var:

* Bazı gruplaşmada tüm geleceklere son vermek için `join_all` ile `Vec` kullandık. Bunun yerine bir grup geleceği sırayla işlemek için `Vec` kullanmak nasıl olurdu? Bunu yapmanın getirileri nelerdir?

* `futures` kutusundan `futures::stream::FuturesUnordered` türüne bir göz atın. Onu kullanmak, bir `Vec` kullanmaktan nasıl farklı olurdu? (Kendinize, bunun `stream` kısmından geldiği gerçeği için endişelenmeyin; herhangi bir gelecek koleksiyonuyla gayet iyi çalışır.)