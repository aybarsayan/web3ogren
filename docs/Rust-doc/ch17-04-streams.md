## Akışlar

Bu bölümde şimdiye kadar esas olarak bireysel geleceklerle sınırlı kaldık. Tek büyük
istisna, kullandığımız asenkron kanaldı. Bölümün başlarında [“Mesaj Gönderimi”][17-02-messages] kısmında asenkron kanalımız için alıcıyı nasıl kullandığımızı hatırlayın. Asenkron `recv` metodu zaman içinde bir dizi öğe üretir. Bu, genel bir modelin bir örneğidir ve genellikle bir *akış* olarak adlandırılır.

:::info
Bir akış, asenkron bir yineleme biçimine benzerdir.
:::

Bir dizi öğe, 13. bölümde `Iterator` traitine baktığımızda daha önce gördüğümüz bir şeydir, ancak iteratörler ile asenkron kanal alıcısı arasında iki farklılık vardır. İlk farklılık zaman unsuru: iteratörler senkron olduğundan, kanal alıcısı asenkron'dur. İkinci farklılık ise API'dir. `Iterator` ile doğrudan çalışırken, senkron `next` metodunu çağırırız. Özellikle `trpl::Receiver` akışında, bunun yerine asenkron `recv` metodunu çağırdık, ancak bu API'ler diğer bakımlardan oldukça benzer.

:::tip
Bu benzerlik, bir akışın asenkron bir yineleme biçimine benzemesinden kaynaklanmaktadır.
:::

Bu benzerlik bir tesadüf değil. Rust'taki iteratörler ile akışlar arasındaki benzerlik, aslında herhangi bir iteratörden bir akış oluşturabileceğimiz anlamına gelir. Bir iteratörle olduğu gibi, bir akışla da `next` metodunu çağırarak ve ardından çıktıyı bekleyerek çalışabiliriz; bu, 17-30 listeleme örneğinde gösterilmiştir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch17-async-await/listing-17-30/src/main.rs:stream}}
```



Sayılardan oluşan bir dizi ile başlıyoruz, bunu bir iteratöre dönüştürüyoruz ve ardından tüm değerleri iki katına çıkarmak için `map` çağırıyoruz. Daha sonra iteratörü `trpl::stream_from_iter` fonksiyonu kullanarak bir akışa dönüştürüyoruz. Sonra `while let` döngüsü ile akıştaki öğeleri geldikçe döngüleştiriyoruz.

Maalesef, kodu çalıştırmayı denediğimizde, derlenmiyor. Çıktıda görüldüğü gibi, `next` metodunun mevcut olmadığı bilgisi veriliyor.

```console
error[E0599]: no method named `next` found for struct `Iter` in the current scope
  --> src/main.rs:10:40
   |
10 |         while let Some(value) = stream.next().await {
   |                                        ^^^^
   |
   = note: the full type name has been written to 'file:///projects/async_await/target/debug/deps/async_await-9de943556a6001b8.long-type-1281356139287206597.txt'
   = note: consider using `--verbose` to print the full type name to the console
   = help: items from traits can only be used if the trait is in scope
help: the following traits which provide `next` are implemented but not in scope; perhaps you want to import one of them
   |
1  + use crate::trpl::StreamExt;
   |
1  + use futures_util::stream::stream::StreamExt;
   |
1  + use std::iter::Iterator;
   |
1  + use std::str::pattern::Searcher;
   |
help: there is a method `try_next` with a similar name
   |
10 |         while let Some(value) = stream.try_next().await {
   |                                        ~~~~~~~~
```

Çıktının belirttiği gibi, derleyici hatasının nedeni, `next` metodunu kullanabilmemiz için doğru trait'in kapsamda olması gerektiği. Şimdiye kadar yaptığımız tartışmayı göz önünde bulundurursak, bunun `Stream` olması mantıklı görünebilir, ancak burada ihtiyacımız olan trait aslında `StreamExt`. Buradaki `Ext` kısmı “uzantı” için: bu, Rust topluluğunda bir trait'i başka bir trait ile genişletmek için yaygın bir modeldir.

:::note
`StreamExt`, `Stream` üzerine daha yüksek seviyeli bir API seti sağlar.
:::

Neden `StreamExt`'ye ihtiyacımız var, `Stream` neyi yapıyor? Kısaca cevap, Rust ekosisteminde `Stream` trait'inin, aslında `Iterator` ve `Future` trait'lerini birleştiren düşük seviyeli bir arabirimi tanımlamasıdır. `StreamExt` trait'i, `next` metodu yanı sıra `Iterator` trait'i tarafından sağlanan diğer yardımcı metodlar gibi, `Stream` üzerinde daha yüksek seviyeli bir API seti sağlar. `Stream` ve `StreamExt` trait'lerine bölümün sonunda biraz daha ayrıntılı döneceğiz. Şu anda, bununla devam etmemizi sağlamak için yeterlidir.

Derleyici hatasını düzeltmek için, Listing 17-31'de görünene göre `trpl::StreamExt` için bir `use` ifadesi eklememiz gerekir.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-31/src/main.rs:all}}
```



Tüm bu parçaları bir araya getirdiğimizde, bu kod istendiği gibi çalışır! Dahası, artık `StreamExt` kapsamda olduğundan, iteratörlerle olduğu gibi tüm yardımcı metotlarını da kullanabiliriz. Örneğin, Listing 17-32'de, `filter` metodunu kullanarak üç ve beşin katları olan her şeyi filtreliyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-32/src/main.rs:all}}
```



Elbette, bu çok ilginç değil. Normal iteratörlerle ve hiç asenkron olmadan da bunu yapabilirdik. O yüzden akışlara özgü bazı diğer şeylere bakalım.

---

### Akışları Birleştirme

Birçok kavram doğal olarak akışlar olarak temsil edilir: bir kuyruğun içinde mevcut hâle gelen öğeler, ya da bir bilgisayarın belleğine sığmayacak kadar fazla veriyle çalışmak için dosya sisteminden yalnızca chunk'lar çekerek, ya da zaman içinde ağ üzerinden gelen veriler. Akışlar gelecektir, bu nedenle diğer tür gelecekle de birlikte kullanılabiliriz ve ilginç şekillerde birleştirebiliriz. Örneğin, çok fazla ağ çağrısını tetiklemekten kaçınmak için olayları toplu hale getirebiliriz, uzun süreli işlemler dizilerine zaman aşımı ayarlayabiliriz veya kullanıcı arayüzü olaylarını kısıtlayarak gereksiz işleri önleyebiliriz.

Bir WebSocket veya başka bir gerçek zamanlı iletişim protokolünden görebileceğimiz bir veri akışını temsil eden küçük bir mesaj akışı oluşturarak başlayalım. Listing 17-33'te, `String` öğesi döndüren `impl Stream` döndüren `get_messages` adlı bir işlev oluşturuyoruz. Uygulamasında, bir asenkron kanal oluşturuyoruz, İngiliz alfabesinin ilk on harfini döngüye alıyoruz ve bunları kanaldan gönderiyoruz.

Ayrıca `trpl::channel`'dan `rx` alıcısını `next` metodu ile `Stream`'e dönüştüren yeni bir tür olan `ReceiverStream`'i de kullanıyoruz. `main` fonksiyonuna geri döndüğümüzde, akıştan gelen tüm mesajları yazdırmak için bir `while let` döngüsü kullanıyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-33/src/main.rs:all}}
```



Bu kodu çalıştırdığımızda, tam olarak beklediğimiz sonuçları alırız:

```text
Message: 'a'
Message: 'b'
Message: 'c'
Message: 'd'
Message: 'e'
Message: 'f'
Message: 'g'
Message: 'h'
Message: 'i'
Message: 'j'
```

:::note
Bu sonuçları normal `Receiver` API'si ile de elde edebilirdik.
:::

Bunu normal `Receiver` API'si ile veya hatta normal `Iterator` API'si ile de yapabilirdik. Bir akışın gerektirdiği bir şeyi ekleyelim: akıştaki her öğeye uygulanan bir zaman aşımı ve gönderdiğimiz öğelerde bir gecikme.

Listing 17-34'te, `StreamExt` trait'inden gelen `timeout` metodu ile akışa bir zaman aşımı eklemeye başlıyoruz. Sonra `while let` döngüsünün gövdesini güncelliyoruz, çünkü akış şimdi bir `Result` döndürür. `Ok` varyantı mesajın zamanında geldiğini; `Err` varyantı ise zaman aşımı gerçekleştiğinde herhangi bir mesajın gelmediğini gösterir. `match` ifadesi ile bu sonucu kontrol ederiz ve ya başarıyla aldığımızda mesajı yazdırır ya da zaman aşımı bildirimi yazdırırız. Son olarak, zaman aşımını uyguladıktan sonra mesajları sabitliyoruz, çünkü zaman aşımı yardımcı programı, üzerinde polledilmesi için sabitlenmesi gereken bir akış üretir.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-34/src/main.rs:timeout}}
```



Ancak, mesajlar arasında gecikmeler olmadığı için bu zaman aşımı programın davranışını değiştirmiyor. Gönderdiğimiz mesajlara daha değişken bir gecikme ekleyelim. `get_messages` işlevinde, gönderdiğimiz her öğeyle birlikte her öğenin dizininin indeksini alabilmemiz için `messages` dizisi ile `enumerate` iteratör metodunu kullanıyoruz. Ardından, çift indeksli öğelere 100 milisaniye gecikme ve tek indeksli öğelere 300 milisaniye gecikme uyguluyoruz; bu da gerçek dünyada bir akıştaki mesajların sahip olabileceği farklı gecikmeleri simüle etmek içindir. Zaman aşımımız 200 milisaniye olduğundan, bu durum mesajların yarısını etkilemelidir.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-35/src/main.rs:messages}}
```



Mesajlar arasında uyku çekmek için `get_messages` işlevinde engellemeksizin, asenkron kullanmamız gerekiyor. Ancak, `get_messages` işlevini kendisi asenkron bir işlev haline getiremeyiz, çünkü bu durumda bir `Future>` döndürmek yerine `Stream` döndürürüz. Çağıran, akışa erişim elde etmek için `get_messages`'i beklemelidir. Ama unutmayın: verilen bir gelecekte her şey doğrusal gerçekleşir; eşzamanlılık, *gelecekler arasındaki* işlemdir. `get_messages`'i beklemek, akış alıcı akışını döndürmeden önce tüm mesajları göndermesini gerektireceğinden, zaman aşımı sonunda işe yaramaz hale gelecektir. Akışın kendisinde gecikmeler olmayacak: gecikmeler tümüyle akış kullanılabilir olmadan önce gerçekleşecektir.

:::warning
Bunun yerine, `get_messages`'i bir akış döndüren normal bir işlev olarak bırakıyoruz.
:::

Artık kodumuz çok daha ilginç bir sonuç veriyor! Her diğer mesaj çiftinin arasından bir hata bildirimi görüyoruz: `Problem: Elapsed(())`.

```text
Message: 'a'
Problem: Elapsed(())
Message: 'b'
Message: 'c'
Problem: Elapsed(())
Message: 'd'
Message: 'e'
Problem: Elapsed(())
Message: 'f'
Message: 'g'
Problem: Elapsed(())
Message: 'h'
Message: 'i'
Problem: Elapsed(())
Message: 'j'
```

Zaman aşımı, mesajların sonunda gelmesini engellemiyor – hâlâ tüm orijinal mesajları alıyoruz. Bunun nedeni, kanalımızın sınırsız olmasıdır: belleğimizde tutabileceğimiz kadar mesajı barındırabilir. Mesaj zaman aşımına uğramadan önce gelmezse, akış işleyicimiz bununla başa çıkacaktır, ancak akışı tekrar kontrol ettiğinde, mesaj şimdi gelmiş olabilir.

Gerekirse farklı bir davranış elde edebilirsiniz; diğer kanal türlerini veya daha genel olarak diğer akış türlerini kullanarak. Bu bölüm için son örneğimizde, bir zaman aralığı akışı ile bu mesaj akışını birleştirerek birini pratikte görelim.

---

### Akışları Birleştirme

Öncelikle, her milisaniyede bir öğe yayacak başka bir akış oluşturalım eğer onu doğrudan çalıştırırsak. Basitlik için, bir gecikme ile bir mesaj göndermek için `sleep` fonksiyonunu kullanabiliriz ve bunu `get_messages` içinde kullandığımız kanaldan bir akış oluşturma yaklaşımıyla birleştirebiliriz. Fark, bu sefer geçtiğimiz zaman aralıklarının sayısını geri göndereceğimizdir; bu nedenle dönüş türü `impl Stream` olacak ve işlevimizi `get_intervals` olarak adlandıracağız.

Listing 17-36'da, ilk olarak görev içindeki bir `count` tanımlıyoruz. (Onu görev dışında da tanımlayabiliriz, ancak her değişkenin kapsamını kısıtlama seçeneği daha belirgindir.) Sonra sonsuz bir döngü oluşturuyoruz. Döngünün her yinelemesi asenkron olarak bir milisaniye uyuyor, sayıyı artırıyor ve ardından bunu kanaldan gönderiyor. Bu Her şey, `spawn_task` tarafından oluşturulan görevle paketlenmiş olduğundan, tüm bunlar runtime ile birlikte temizlenir, sonsuz döngü de dahil.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-36/src/main.rs:intervals}}
```



Bu tür bir sonsuz döngü, tüm runtime kapatılana kadar devam eder ve asenkron Rust'ta oldukça yaygındır: birçok programın sürekli çalışması gerekir. Asenkron durumda, bu başka bir şeyi engellemez; her döngü yinelemesinde en az bir bekleme noktası olduğu sürece.

Ana fonksiyonumuzun asenkron bloğunda, `get_intervals`'i çağırarak başlıyoruz. Sonra, `messages` ve `intervals` akışlarını `merge` metodu ile birleştiriyoruz; bu, bir kaynaktan öğeler mevcut olduğunda, belli bir sıralamayı dayatmadan, birden fazla akışı tek bir akışa dönüştürür. Son olarak, birleştirilmiş akış üzerinde döngü oluşturuyoruz (Listing 17-37).



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch17-async-await/listing-17-37/src/main.rs:main}}
```



Bu noktada, hem `messages` hem de `intervals` sabitlenmiş veya değiştirilebilir olmak zorunda değildir, çünkü ikisi de tek bir `merged` akışına birleştirilecektir. Ancak, `merge` çağrısı derlenmiyor! (Ayrıca `while let` döngüsündeki `next` çağrısı da derlenmiyor; bunu düzeltmeden sonra geri döneceğiz.) İki akışın türleri farklıdır. `messages` akışının türü, `timeout` çağrısı için `Stream`'i uygulayan `Timeout>` türüdür. Bu arada, `intervals` akışının türü `impl Stream`dir. Bu iki akışı birleştirmek için, bunlardan birinin türünü diğerinin türü ile eşleştirmemiz gerekiyor.

Listing 17-38'de, `messages` daha önce istediğimiz temel formatta olduğundan ve zaman aşımı hatalarını halletmek zorunda olduğundan, `intervals` akışını yeniden yapılandırıyoruz. İlk olarak, `intervals`'ı bir dizeye dönüştürmek için `map` yardımcı metodunu kullanabiliriz. İkinci olarak, `messages`'ten `Timeout` ile eşleşmemiz gerekiyor. Ancak aslında `intervals` için bir zaman aşımına ihtiyacımız olmadığından, diğer sürelerden daha uzun bir zaman aşımı oluşturabiliriz. Burada, `Duration::from_secs(10)` ile 10 saniyelik bir zaman aşımı oluşturuyoruz. Son olarak, `stream`'in değiştirilebilir olması gerektiğinden, `while let` döngüsünün `next` çağrılarının akışı yinelemeye alabilmesi için sabitlenmesi gerekmektedir.



```rust,ignore
{{#rustdoc_include ../listings/ch17-async-await/listing-17-38/src/main.rs:main}}
```



Bu, *neredeyse* ihtiyaç duyduğumuz yere ulaştırıyor. Her şey tür denetiminden geçiyor. Ancak bunu çalıştırırsanız, iki sorun olacak. Birincisi, asla durmayacak! ctrl-c ile durdurmanız gerekecek. İkincisi, İngiliz alfabasından gelen mesajlar, tüm zaman aralıkları sayısı mesajlarının ortasında kaybolacak:

```text
--snip--
Interval: 38
Interval: 39
Interval: 40
Message: 'a'
Interval: 41
Interval: 42
Interval: 43
--snip--
```

Listing 17-39, bu son iki sorunu çözmenin bir yolunu gösterir. İlk olarak, `intervals` akışında `throttle` metodunu kullanarak, onu `messages` akışını aşmayacak şekilde sınırlandırıyoruz. Nantalanma, bir işlevin ne sıklıkta çağrılacağını sınırlamanın bir yoludur—veya, bu durumda, akışın ne sıklıkta kontrol edileceğidir. Her yüz milisaniyede bir çağrı yapmaktir, çünkü bu, mesajlarımızın sıklığıyla hemen hemen aynı aralıktadır.

Bir akıştan kabul edeceğimiz öğe sayısını sınırlamak için `take` metodunu kullanabiliriz. Bunu *birleştirilmiş* akışa uygularız, çünkü nihai çıktıyı sınırlamak istiyoruz, sadece bir akış veya diğerine değil.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-39/src/main.rs:throttle}}
```



Artık programı çalıştırdığımızda, akıştan yirmi öğe çekildikten sonra duruyor ve zaman aralıkları mesajları aşmıyor. Ayrıca `Interval: 100` veya `Interval: 200` vb. almayız; bunun yerine `Interval: 1`, `Interval: 2` vb. alırız—her ne kadar her milisaniyede bir olay üretebilen bir kaynak akışımız olmasına rağmen. Bunun nedeni, `throttle` çağrısının, orijinal akışı sarmalayarak yeni bir akış üretmesidir, böylece orijinal akış yalnızca throttle hızında kontrol edilecektir; kendi “doğal” hızında değil. İlgilenmediğimiz bir dizi cevapsız zaman aralığı mesajı oluşturmak istemiyoruz. Bunun yerine, daha başında bu zaman aralığı mesajlarını üretmiyoruz! Bu, Rust'ın geleceğinin özünde "tembellik" derecelerinin bir kez daha çalışır duruma gelmesidir; bizlere performans tatlarını seçme imkânı tanır.

:::tip
`throttle` çağrısının, orijinal akışı sarmalayarak yeni bir akış üretmesi, kaynak akışının belirli bir hızda kontrol edilmesini sağlar.
:::

---

Son olarak, ele almamız gereken bir şey kalıyor: hatalar! Bu iki kanal tabanlı akışta, `send` çağrıları, kanalın diğer tarafı kapandığında başarısız olabilir - ve bu, akışı oluşturan geleceklere bağlıdır. Şimdiye kadar bunu `unwrap` çağırarak göz ardı ettik, ancak düzgün bir uygulamada, bu hatayı açıkça ele almalıyız; en azından döngüyü sonlandırarak, daha fazla mesaj göndermeye çalışmadığımızdan emin olmalıyız! Listing 17-40, basit bir hata stratejisini gösterir: sorunu yazdırır ve ardından döngülerden `break` ekler. Her zamanki gibi, bir mesaj gönderme hatasını ele almak için doğru yol değişecektir—sadece bir stratejiniz olduğundan emin olun.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-40/src/main.rs:errors}}
```



Artık pratikte bir dizi asenkron işlem gördüğümüze göre, `Future`, `Stream` ve Rust'ın asenkron çalışmasını sağlamak için kullandığı diğer önemli özelliklerin bazı ayrıntılarına dalalım.

[17-02-messages]: ch17-02-concurrency-with-async.html#message-passing