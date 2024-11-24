## Async ile Eşzamanlılık

Bu bölümde, bölüm 16'da işlediğimiz bazı eşzamanlılık zorluklarına async uygulayacağız. Önceki bölümde pek çok ana fikri konuştuğumuz için, bu bölümde thread ve future'lar arasındaki farklılıklara odaklanacağız.

Birçok durumda, async kullanarak eşzamanlılık ile çalışmak için API'ler, thread kullanmak için olanlara çok benzerdir. Diğer durumlarda, oldukça farklı şekillerde şekillenirler. API'ler thread'ler ve async arasında *benzer* görünse bile, genellikle farklı davranış sergilerler - ve neredeyse her zaman farklı performans özelliklerine sahiptirler.

### Sayma

Bölüm 16'da ele aldığımız ilk görev, iki ayrı thread üzerinde saymaktı. Aynısını async kullanarak yapalım. `trpl` crate'i, `thread::spawn` API'sine çok benzeyen bir `spawn_task` fonksiyonu sağlar ve `thread::sleep` API'sinin async bir versiyonu olan bir `sleep` fonksiyonu da vardır. Bu ikisini birlikte kullanarak, thread'lerle aynı sayma örneğini, Liste 17-6'daki gibi uygulayabiliriz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-06/src/main.rs:all}}
```



Başlangıç noktamız olarak, `main` fonksiyonumuzu `trpl::run` ile kurarak, en üst düzey fonksiyonumuzun async olmasını sağlıyoruz.

> **Not:** Bu noktadan itibaren bölümde, her örnek `main` içindeki `trpl::run` ile bu tam sarma kodunu içerecektir, bu yüzden sıklıkla bunu atlayacağız tıpkı `main` ile yaptığımız gibi. Kodunuzda bunu eklemeyi unutmayın!

Ardından, içinde bir `trpl::sleep` çağrısı olan iki döngü yazarız, bu da bir sonraki mesajı göndermeden önce yarım saniye (500 milisaniye) bekler. Bir döngüyü bir `trpl::spawn_task` bloğunun gövdesine, diğerini ise en üst düzey bir `for` döngüsüne koyarız. Ayrıca `sleep` çağrılarının ardından bir `await` ekleriz.

Bu işlem, thread tabanlı uygulama ile benzer bir şey yapar - çalıştırdığınızda terminalinizdeki mesajların farklı bir sırada görünebileceği gerçeği dahil.



```text
hi number 1 from the second task!
hi number 1 from the first task!
hi number 2 from the first task!
hi number 2 from the second task!
hi number 3 from the first task!
hi number 3 from the second task!
hi number 4 from the first task!
hi number 4 from the second task!
hi number 5 from the first task!
```

Bu versiyon, main async bloğundaki for döngüsü bittiği anda durur, çünkü `spawn_task` tarafından başlatılan görev ana fonksiyon sona erdiğinde kapatılır. Görevin tamamlanmasına kadar çalıştırmak isterseniz, ilk görevin tamamlanmasını beklemek için bir katılma tutamağı kullanmanız gerekir. 

:::tip
Thread'lerde, thread'in çalışmayı bitene kadar "bloke" olması için `join` yöntemini kullandık. Liste 17-7'de, aynı şeyi yapmak için `await` kullanabiliriz, çünkü görev tutamağı kendisi bir future'dır. `Output` türü bir `Result` olduğu için, ayrıca bunu await ettikten sonra unwrap ederiz.
:::



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-07/src/main.rs:handle}}
```



Bu güncellenmiş versiyon *her iki* döngü bitene kadar çalışır.



```text
hi number 1 from the second task!
hi number 1 from the first task!
hi number 2 from the first task!
hi number 2 from the second task!
hi number 3 from the first task!
hi number 3 from the second task!
hi number 4 from the first task!
hi number 4 from the second task!
hi number 5 from the first task!
hi number 6 from the first task!
hi number 7 from the first task!
hi number 8 from the first task!
hi number 9 from the first task!
```

Şimdiye kadar, async ve thread'lerin aynı temel çıktıları verdiği görülüyor, yalnızca farklı sözdizimiyle: katılma tutamağı üzerinde `join` çağırmak yerine `await` kullanmak ve `sleep` çağrılarını beklemek.

Büyük farklılık, bunu yapmak için başka bir işletim sistemi thread'i başlatmamıza gerek olmaması. Aslında, burada bir görev bile başlatmamıza gerek yok. Async bloklar anonim future'lara derlendiği için, her döngüyü bir async blok içinde koyabilir ve runtime'ın her ikisini de tamamlayacak şekilde çalıştırmasını sağlayabiliriz `trpl::join` fonksiyonunu kullanarak.

Bölüm 16'da, `std::thread::spawn` çağrıldığında dönen `JoinHandle` türü üzerinde `join` yönteminin nasıl kullanılacağını gösterdik. `trpl::join` fonksiyonu benzer, ancak future'lar için. İki future verdiğinizde, çıktısı her iki future'ın çıktısının bir tuple'ı olan yeni bir future oluşturur, her iki tamamlandığında. Bu yüzden, Liste 17-8'de, hem `fut1` hem de `fut2`'nin bitmesini beklemek için `trpl::join` kullanıyoruz. `fut1` ve `fut2`'yi await etmiyoruz, bunun yerine `trpl::join` tarafından üretilen yeni future'ı await ediyoruz. Çıktıyı geçersiz kılıyoruz, çünkü sadece iki birim değeri içeren bir tuple'dır.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-08/src/main.rs:join}}
```



Bunu çalıştırdığımızda, her iki future'ın da tamamlandığını görüyoruz:



```text
hi number 1 from the first task!
hi number 1 from the second task!
hi number 2 from the first task!
hi number 2 from the second task!
hi number 3 from the first task!
hi number 3 from the second task!
hi number 4 from the first task!
hi number 4 from the second task!
hi number 5 from the first task!
hi number 6 from the first task!
hi number 7 from the first task!
hi number 8 from the first task!
hi number 9 from the first task!
```

Burada, her seferinde tam olarak aynı sırayı göreceksiniz, bu da thread'lerde gördüğümüzden çok farklı. Bunun nedeni, `trpl::join` fonksiyonunun *adil* olmasıdır; bu, her future'ı eşit sıklıkta kontrol eder, ikisi arasında geçiş yapar ve bir diğerinin hazır olmasına izin vermez. Thread'lerde, işletim sistemi hangi thread'i kontrol edeceğine ve ne kadar süre çalışmasına izin vereceğine karar verir. Async Rust'ta, runtime hangi görevi kontrol edeceğine karar verir. 

> **Not:** Pratikte, detaylar karmaşık hale gelir çünkü bir async runtime, eşzamanlılığı yönetmenin bir parçası olarak arka planda işletim sistemi thread'lerini kullanabilir, bu nedenle adil olmayı garanti etmek runtime için daha fazla iş olabilir - ama yine de mümkündür! 

Runtimes'ın herhangi bir operasyon için adaleti garanti etmesine gerek yoktur ve genellikle adalet isteyip istemediğinizi seçmenize izin vermek için farklı API'ler sunarlar.

Future'ları beklemek için bu farklı varyasyonlardan bazılarını deneyin ve ne yaptıklarını görün:

* Döngülerden birinin veya her ikisinin etrafındaki async bloğunu kaldırın.
* Her async bloğu tanımladıktan hemen sonra await edin.
* Sadece ilk döngüyü bir async bloğa sarın ve ikinci döngünün gövdesinden sonra ortaya çıkan future'ı bekleyin.

Ek bir zorluk için, her durumda kodu çalıştırmadan önce çıktının ne olacağını bulup bulamayacağınıza bakın!

### Mesaj İletişimi

Future'lar arasında veri paylaşımı da tanıdık olacak: tekrar mesaj iletimi kullanacağız, ancak bu, tiplerin ve fonksiyonların async versiyonları ile olacak. Bölüm 16'da yaptığımızdan biraz farklı bir yol alarak, thread tabanlı ve future tabanlı eşzamanlılık arasındaki bazı temel farklılıkları göstereceğiz. Liste 17-9'da, sadece bir tane async blok ile başlayacağız - ayrı bir görev başlatmadan, bir ayrı thread olarak.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-09/src/main.rs:channel}}
```



Burada, bölüm 16'da thread'lerle kullandığımız çoklu-üretici, tek-tüketici kanal API'sinin async versiyonu olan `trpl::channel` kullanıyoruz. API'nin async versiyonu, thread tabanlı versiyondan sadece biraz farklıdır: değişken bir alıcı `rx` yerine, değişmez bir alıcı kullanır ve `recv` metodu doğrudan değeri üretmek yerine beklememiz gereken bir future üretir. Artık mesajları gönderen tarafın alıcıya iletmesi mümkündür. Dikkat edin ki, ayrı bir thread veya görev başlatmamıza gerek yoktur; sadece `rx.recv` çağrısını beklememiz gerekir.

Senkron `Receiver::recv` metodu `std::mpsc::channel` içinde bir mesaj alınana kadar bloke olur. `trpl::Receiver::recv` metodu, çünkü async'dir. Bloke etmek yerine, bir mesaj alınana veya kanalın gönderim tarafı kapanana kadar kontrolü runtime'a geri verir. Buna karşılık, `send` çağrısını beklemiyoruz, çünkü o bloke olmaz. Gereksizdir, çünkü içine gönderdiğimiz kanal sonsuzdur.

> **Not:** Çünkü tüm bu async kod bir `trpl::run` çağrısında bir async blok içinde çalışır, içindeki her şey bloke olmayı önleyebilir. Ancak dışarıdaki kod, `run` fonksiyonunun geri dönüşünü beklerken bloke olacaktır. `trpl::run` fonksiyonunun tam amacı budur: bazı async kod grupları üzerinde blokaj seçme şansını sunmak ve bu nedenle senkron ve async kod arasında geçiş yapabileceğiniz yerdir. Çoğu async runtime'da, tam olarak bu nedenle `run` aslında `block_on` adıyla bilinir.

Bu örnek hakkında iki şey fark edin: İlk olarak, mesaj hemen ulaşacaktır! İkincisi, burada bir future kullansak da, henüz bir eşzamanlılık yok. Listede yer alan her şey sırasıyla gerçekleşiyor; tıpkı içinde future'lar olmayan bir durumda olduğu gibi.

İlk kısmı, bir dizi mesaj göndererek ve bunların arasında uyuyarak başlıyoruz, Liste 17-10'da gösterildiği gibi:





```rust,ignore
{{#rustdoc_include ../listings/ch17-async-await/listing-17-10/src/main.rs:many-messages}}
```



Mesajları göndermenin yanı sıra, onları almamız da gerekiyor. Bu durumda, kaç mesaj geleceğini bildiğimiz için, bunu dört kez `rx.recv().await` yaparak manuel olarak yapabiliriz. Ancak gerçekte, genellikle bazı *bilinmeyen* sayıdaki mesajları bekliyor olacağız. Böyle bir durumda, daha fazla mesaj gelmediğini belirlediğimizde kadar beklemeye devam etmemiz gerekir.

Liste 16-10'da bir senkron kanaldan alınan tüm öğeleri işlemek için bir `for` döngüsü kullandık. Ancak, Rust henüz *asenkron* bir dizi öğe üzerinde bir `for` döngüsü yazma yoluna sahip değil. Bunun yerine, daha önce görmediğimiz yeni bir döngü türü olan `while let` koşullu döngüsünü kullanmamız gerekir. `while let` döngüsü, bölüm 6'da gördüğümüz `if let` yapısının döngü versiyonudur. Döngü, tanımlanan desen değerle eşleşmeye devam ettikçe yürütülmeye devam edecektir.

`rx.recv` çağrısı bir `Future` üretir, ki bunu await ederiz. Runtime, future'ı hazır olana kadar duraklatacaktır. Bir mesaj geldiğinde, future `Some(message)` olarak çözüme ulaşır, bir mesaj geldiği kadar çok kez. Kanal kapandıktan sonra, *herhangi bir* mesaj gelip gelmediğine bakılmaksızın, future bunun yerine `None` olarak çözüme ulaşır ve artık polling yapmamız gerektiğini belirtir - yani beklemeyi durdururuz.

> **Not:** `while let` döngüsü tüm bu durumları bir araya getirir. `rx.recv().await` çağrısının sonucu `Some(message)` ise, mesaja erişim sağlarız ve döngü gövdesinde bunu kullanabiliriz, tıpkı `if let` ile yapabildiğimiz gibi. Sonuç `None` ise, döngü sona erer. Döngü her tamamlandığında, tekrar bekleme noktalarına gelir, bu nedenle runtime, başka bir mesaj gelene kadar tekrar duraklatır.

Kod şimdi tüm mesajları başarıyla gönderir ve alır. Ne yazık ki, hala birkaç sorun var. Bir şey, mesajların yarım saniyelik aralıklarla gelmemesidir. Mesajlar, programı başlattıktan iki saniye (2,000 milisaniye) sonra bir anda gelir. Diğeri, bu programın da asla kapanmamasıdır! Bunun için ctrl-c ile kapatmanız gerekecek.

Mesajların neden bir anda geldiğini tam anlamak için, neden her biri arasında gecikme olmadan toplam gecikmeden sonra geldiklerini anlamalıyız. Verilen bir async blok içinde `await` anahtar kelimelerinin sıralanışı, aynı zamanda program çalıştırıldığında meydana gelen sıradır.

Liste 17-10'da yalnızca bir tane async blok vardır, yani içindeki her şey ardışık olarak çalışır. Hala herhangi bir eşzamanlılık yok. Tüm `tx.send` çağrıları, `trpl::sleep` çağrıları ve bunlarla ilişkili bekleme noktalarıyla iç içe gerçekleşmektedir. Ancak sadece o zaman `while let` döngüsü `recv` çağrılarındaki herhangi bir `await` noktasına erişebilir.

İstediğimiz davranışı elde etmek için, her mesajı almak arasında uyku gecikmesinin olduğu bir düzen kurmalıyız, bu yüzden `tx` ve `rx` işlemlerini kendi async bloklarına koymalıyız. Sonra runtime, tıpkı sayma örneğinde olduğu gibi her birini ayrı ayrı çalıştırabilir. Tekrar, `trpl::join` çağrısını await ediyoruz, bireysel future'ları değil. Eğer bireysel future'ları ardışık olarak bekleseydik, yeniden ardışık bir akışa dönerdik - tam da *yapmak istemediğimiz* şey.





```rust,ignore
{{#rustdoc_include ../listings/ch17-async-await/listing-17-11/src/main.rs:futures}}
```



Liste 17-11'deki güncellenmiş kod ile, mesajlar artık 500 milisaniye aralıklarla yazdırılır; iki saniye sonunda bir anda değil.

Program hala asla bitmiyor çünkü `while let` döngüsünün `trpl::join` ile etkileşimi nedeniyle:

* `trpl::join`'dan dönen future yalnızca *her iki* future tamamlandığında tamamlanır.
* `tx` future'ı, `vals` içindeki son mesajı göndermeden önce uyuduktan sonra tamamlanır.
* `rx` future'ı, `while let` döngüsü sona erene kadar tamamlanmaz.
* `while let` döngüsü, `rx.recv` beklemek `None` ürettiği sürece sona ermez.
* `rx.recv` yalnızca kanalın diğer ucu kapandığında `None` döner.
* Kanal yalnızca `rx.close` çağırarak veya gönderim tarafı `tx` bırakıldığında kapanır.
* `rx.close`'u herhangi bir yerde çağırmıyoruz ve `tx` dıştaki async blok sona erene kadar bırakılmayacak.
* Blok, `trpl::join` tamamlanmasını beklediği için sona eremez ki bu da bizi bu listenin başına döndürür!

:::warning
`rx.close` çağrısını bir yere koyarak `rx`'ı manuel olarak kapatabiliriz, ancak bu çok anlamlı olmaz. Belirli sayıda mesajı işledikten sonra durmak programı kapatır, ancak mesajları kaçırabiliriz. `tx`'ın işlevin sonundan *önce* bırakıldığından emin olmak için başka bir yola ihtiyacımız var.
:::

Şu anda, mesajları gönderen async bloğu yalnızca `tx`'ı ödünç alır çünkü bir mesaj göndermek mülkiyet gerektirmiyor, ancak `tx`'ı o async bloğa taşıyabilirsek, o blok sona erdiğinde bırakılacaktır. Bölüm 13'te, closure'larla birlikte `move` anahtar kelimesini nasıl kullanacağımızı öğrendik ve Bölüm 16'da, thread'lerle çalışırken verileri closure'lara taşımamız gerektiğini çoğu zaman gördük. Temel dinamikler async bloklara da uygulanır, bu nedenle `move` anahtar kelimesi async bloklarla da aynı şekilde çalışır.

Liste 17-12'de, mesajları gönderen async bloğunu sıradan bir `async` bloktan `async move` bloğuna değiştiriyoruz. Bu **versiyon** kodu çalıştırdığımızda, son mesaj gönderilip alındığında düzgün bir şekilde kapanıyor.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-12/src/main.rs:with-move}}
```



Bu async kanal aynı zamanda çoklu-üretici bir kanaldır, bu nedenle birden fazla future'dan mesaj göndermek istiyorsak `clone` metodunu `tx` üzerinde çağırabiliriz. Liste 17-13'te, `tx`'ı kopyalayarak `tx1`'i ilk async bloğun dışında oluşturuyoruz. O bloğa, önceki gibi `tx1`'i hareket ettiriyoruz. Daha sonra, mesajları daha yavaş bir gecikmeyle göndereceğimiz *yeni* bir async bloğa orijinal `tx`'i taşıyoruz. Bu yeni async blok, mesajları almaya yönelik async bloğun ardından gelir, ancak aynı zamanda öncesine de konabilir. Anahtar, futures'ın hangi sırada beklediğidir; ne zaman oluşturuldukları değil.

Her iki mesaj gönderme async bloğunun da `async move` blokları olması gerekir, böylece `tx` ve `tx1` o bloklar bittiğinde bırakılır. Aksi halde başlangıçta girdiğimiz sonsuz döngüye geri döneriz. Son olarak, ek future'ı yönetmek için `trpl::join`'dan `trpl::join3`'e geçiyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-13/src/main.rs:here}}
```



Artık her iki gönderim future'ından gelen tüm mesajları görüyoruz. Gönderim future'ları mesaj gönderdikten sonra biraz farklı gecikmeler kullanıyor, bu nedenle mesajlar da bu farklı aralıklarla alınıyor.



```text
received 'hi'
received 'more'
received 'from'
received 'the'
received 'messages'
received 'future'
received 'for'
received 'you'
```

Bu iyi bir başlangıç, ancak yalnızca birkaç future ile sınırlı kalıyor: `join` ile iki veya `join3` ile üç. Daha fazla future ile nasıl çalışabileceğimizi görelim.

[streams]: ch17-05-streams.html