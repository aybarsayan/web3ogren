## Tek İpli Sunucumuzu Çok İpli Sunucuya Dönüştürme

Şu anda sunucu her isteği sırayla işliyor, bu da ilk istek bitene kadar ikinci bir bağlantıyı işlemeyeceği anlamına geliyor. Sunucu daha fazla istek aldıkça, bu seri yürütme giderek daha az optimal hale gelecektir. Sunucu uzun süre işlenen bir istek aldığında, sonraki istekler uzun isteğin tamamlanmasını beklemek zorunda kalacak, oysa yeni istekler hızlı bir şekilde işlenebilir. Bunu düzeltmemiz gerekecek, ancak önce sorunu aksiyon halinde görelim.

### Mevcut Sunucu Uygulamasında Yavaş Bir İsteği Simüle Etme

Mevcut sunucu uygulamamıza yapılan başka istekleri yavaş işleyebilen bir isteğin nasıl etki edebileceğine bir göz atacağız. Liste 21-10, sunucunun yanıt vermeden önce 5 saniye uyumasını sağlayan simüle edilmiş yavaş bir yanıt ile */sleep* isteğini işlemenin nasıl yapıldığını gösterir.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-10/src/main.rs:here}}
```



Üç durumumuz olduğu için `if`'ten `match`'e geçtik. `request_line`'ın bir dilimini eşleşmek için açıkça kaydetmemiz gerekiyor; `match`, eşitlik yöntemi gibi otomatik referanslama ve denetleme yapmaz.

> **Ana Not:** İlk kol, Liste 21-9'da bulunan `if` bloğuyla aynıdır. İkinci kol, */sleep* isteğine eşleşiyor. O istek alındığında, sunucu başarılı HTML sayfasını sunmadan önce 5 saniye uyuyacaktır. Üçüncü kol, Liste 21-9'daki `else` bloğuyla aynıdır.

Şimdi sunucumuzun ne kadar primitif olduğunu görebiliyorsunuz: gerçek kütüphaneler, birden fazla isteğin tanınmasını çok daha az ayrıntılı bir şekilde ele alır!

Sunucuyu `cargo run` ile başlatın. Sonra iki tarayıcı penceresi açın: biri için *http://127.0.0.1:7878/* ve diğeri için *http://127.0.0.1:7878/sleep*. Önceki gibi birkaç kez */* URI'sini girerseniz, hızlı yanıt aldığınızı göreceksiniz. Ancak */sleep* girip ardından */* yüklediğinizde, */*'ın `sleep` tam 5 saniye uyuduktan sonra yüklendiğini göreceksiniz.

:::warning
Yavaş bir isteğin arkasında taleplerin yığılmasını önlemenin çeşitli teknikleri vardır, örneğin 17. Bölümde yaptığımız gibi async kullanmak; uygulanacak olan teknik bir işçi havuzudur.
:::

### Bir İşçi Havuzuyla Veri Akışını İyileştirme

Bir *işçi havuzu*, bekleyen ve bir görevi yerine getirmeye hazır bir grup oluşturulmuş ipliktir. Program yeni bir görev aldığında, havuzdaki ipliklerden birini göreve atar ve o iplik görevi işler. Havuzdaki kalan iplikler, ilk iplik işlem yaparken gelen diğer talepleri işlemek için mevcuttur. İlk iplik görevini tamamladığında, yeniden boş iplik havuzuna döner, yeni bir görevi işlemek üzere hazır olur. İşçi havuzu, bağlantıları aynı anda işleyerek sunucunuzun veri akışını artırmanızı sağlar.

Bir saldırının (DoS) etkilerinden korunmak için işçi havuzundaki iplik sayısını küçük bir sayı ile sınırlayacağız; eğer her istekte bir iplik oluşturmak için programımızı oluşturursak, sunucumuza 10 milyon istekte bulunan biri, tüm sunucunun kaynaklarını tüketip taleplerin işlenmesini durdurabilir.

Bu nedenle, sınırsız iplikler oluşturmak yerine, havuzda bekleyen sabit bir iplik sayısına sahip olacağız. Gelen istekler işlenmek üzere havuza gönderilecektir. Havuz, gelen isteklerin bir kuyruğunu tutacaktır. Havuzdaki ipliklerden her biri bu kuyruktan bir isteği alacak, isteği işleyip ardından kuyruktan başka bir istek isteyecektir. Bu tasarımla, `N` kadar isteği aynı anda işleyebiliriz; burada `N`, iplik sayısını ifade eder. Her iplik uzun süren bir isteğe yanıt veriyorsa, sonraki istekler kuyrukta hala yığılabilir, ancak bu noktaya ulaşmadan önce işleyebileceğimiz uzun süren istek sayısını artırdık.

:::tip
Bu teknik, bir web sunucusunun veri akışını iyileştirmenin birçok yolundan sadece biridir. Diğer seçenekler, *fork/join modeli*, *tek iplikli async I/O modeli* veya *çok iplikli async I/O modeli* gibi uygulamaları inceleyebilirsiniz. Bu konuya ilginiz varsa, diğer çözümleri okuyabilir ve onları uygulamaya çalışabilirsiniz; Rust gibi düşük seviyeli bir dilde, tüm bu seçenekler mümkündür.
:::

İşçi havuzunu uygulamaya başlamadan önce, havuzun nasıl kullanılacağını tartışalım. Kod tasarlarken, önce istemci arayüzünü yazmak tasarımızı yönlendirmeye yardımcı olabilir. Kodu öyle bir API olarak yazın ki, çağırmak istediğiniz yapıda gerçekleşsin; ardından bu yapıda işlevselliği uygulayın, işlevselliği uygulayıp ardından kamu API'sini tasarlamak yerine.

Bölüm 12'deki projede test odaklı geliştirme kullandığımız gibi, burada derleyici odaklı geliştirme kullanacağız. İstediğimiz işlevleri çağıran kodu yazacağız ve ardından kodun çalışması için neyi değiştirmemiz gerektiğini belirlemek için derleyiciden gelen hatalara bakacağız. Ancak bunu yapmadan önce, başlangıç noktası olarak kullanmayacağımız bir tekniği keşfedelim.

#### Her İstek için Bir İplik Yaratma

Öncelikle, her bağlantı için yeni bir iplik yaratsa kodumuzun nasıl görüneceğine bakalım. Daha önce belirtildiği gibi, sonunda sınırsız sayıda iplik oluşturma problemleri nedeniyle bu, nihai planımız değil, ancak öncelikle çalışan bir çok iplikli sunucu elde etmek için bir başlangıç noktasıdır. Sonra iyileştirme olarak işçi havuzunu ekleyeceğiz ve iki çözümü karşılaştırmak daha kolay olacaktır. Liste 21-11, `for` döngüsündeki her akışı ele almak için yeni bir iplik yaratmak üzere `main`'deki değişiklikleri göstermektedir.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-11/src/main.rs:here}}
```



Bölüm 16'da öğrendiğiniz gibi, `thread::spawn`, yeni bir iplik oluşturacak ve ardından kodu kapalı alanda yeni iplikte çalıştıracaktır. Bu kodu çalıştırırsanız ve tarayıcınızda */sleep*'i, ardından iki tarayıcı sekmesinde */* yüklemeyi denerken, */*'ya yapılan isteklerin */sleep*'in bitmesini beklemek zorunda olmadığını gerçekten göreceksiniz. Ancak, daha önce de bahsettiğimiz gibi, bu, sonunda sistemi aşırı yükleyecektir çünkü sınır olmaksızın yeni iplikler oluşturacaksınız.

> **Önemli Not:** Ayrıca, 17. Bölüm'den bu durumun gerçekten async ve await uygulamalarının parladığı tam yer olduğunu hatırlayabilirsiniz! İşi bir işçi havuzu yaparken, her şeyin async ile nasıl görüneceğini veya aynı kalacağını düşünün.

#### Sonlu Sayıda İplik Oluşturma

İşçi havuzumuzun, ipliklerden havuza geçişin büyük değişiklikler gerektirmeyecek şekilde benzer, tanıdık bir şekilde çalışmasını istiyoruz. Liste 21-12, `thread::spawn` yerine kullanmak istediğimiz bir `ThreadPool` yapısı için varsayımsal bir arayüzü göstermektedir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch21-web-server/listing-21-12/src/main.rs:here}}
```



`ThreadPool::new` ile yapılandırılabilir bir iplik sayısına sahip yeni bir işçi havuzu oluşturuyoruz; bu durumda dört tane. Ardından, `for` döngüsünde `pool.execute`, her akış için çalıştırılacak bir kapalı alanı alan `thread::spawn` ile benzer bir arayüze sahip. `pool.execute`'yi, kapalı alanı alıp havuzdaki bir ipliğe vermesi için uygulamamız gerekiyor. Bu kod henüz derlenmeyecek, ancak derleyici bize bunu nasıl düzelteceğimiz konusunda yol gösterebilir.

#### Derleyici Odaklı Geliştirme ile `ThreadPool` Oluşturma

Liste 21-12'deki değişiklikleri *src/main.rs* dosyasına yapın, ardından derlememizi yönlendirmek için `cargo check`'ten gelen derleyici hatalarını kullanalım. Aldığımız ilk hata şöyle:

```console
{{#include ../listings/ch21-web-server/listing-21-12/output.txt}}
```

Harika! Bu hata, bir `ThreadPool` türü veya modülüne ihtiyacımız olduğunu söylüyor; o nedenle şimdi bir tane inşa edelim. `ThreadPool` uygulamamız, web sunucumuzun yaptığı iş türünden bağımsız olacaktır. Bu nedenle, `hello` kütüphanesini bir ikili kütüphane yerine, `ThreadPool` uygulamamız için bir kütüphane kütüphanesine çevirelim. Kütüphane kütüphanesine geçtikten sonra, yalnızca web isteklerini karşılamak için değil, bir işçi havuzu kullanarak yapmak istediğimiz her türlü iş için ayrı işçi havuzu kütüphanesini de kullanabiliriz.

Aşağıdaki içerik ile *src/lib.rs* oluşturun; bu, şu anda sahip olabileceğimiz en basit `ThreadPool` yapısı tanımıdır:



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/no-listing-01-define-threadpool-struct/src/lib.rs}}
```



Ardından *main.rs* dosyasını düzenleyip `ThreadPool`'u kütüphane kütüphanesinden kapsamına almak için aşağıdaki kodu *src/main.rs*'nin en üstüne ekleyin:



```rust,ignore
{{#rustdoc_include ../listings/ch21-web-server/no-listing-01-define-threadpool-struct/src/main.rs:here}}
```



Bu kod halen çalışmayacak, ancak düzeltmemiz gereken bir sonraki hata için tekrar kontrol edelim:

```console
{{#include ../listings/ch21-web-server/no-listing-01-define-threadpool-struct/output.txt}}
```

Bu hata, `ThreadPool` için `new` adlı bir ilişkili işlev oluşturmamız gerektiğini gösterir. Ayrıca, `new`'nin bir parametre alması gerektiğini ve `4`'ün bir argüman olarak alınabileceğini ve `ThreadPool` örneğini döndürmesi gerektiğini biliyoruz. O halde bu özelliklere sahip en basit `new` işlevini uygulayalım:



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/no-listing-02-impl-threadpool-new/src/lib.rs}}
```



`size` parametresinin türü olarak `usize` seçtik, çünkü negatif bir iplik sayısı mantıklı değildir. Ayrıca, bu `4` değerini bir dizi iplik elemanlarının sayısı olarak kullanacağımızı biliyoruz; bu da `usize` türünün amacına uygun olması gerektiğini gösterir, 3. Bölümdeki [“Tam Sayı Türleri”][integer-types] bölümünde bahsedildiği gibi.

Şimdi kodu tekrar kontrol edelim:

```console
{{#include ../listings/ch21-web-server/no-listing-02-impl-threadpool-new/output.txt}}
```

Şimdi hata, `ThreadPool`'da `execute` yöntemimiz olmadığı için oluşuyor. `“Sonlu Sayıda İplik Oluşturma”` bölümünde, işçi havuzumuzun `thread::spawn` ile benzer bir arayüze sahip olacağını belirledik. Ayrıca, `execute` işlevini, kendisine verilen kapalı alanı alıp havuzdaki bir boş ipliğe vermesi için uygulayacağız.

`ThreadPool` üzerindeki `execute` yöntemini bir kapalı alanı parametre olarak alacak şekilde tanımlayacağız. [“Kapalı Alanlardan Değerleri Taşıma ve `Fn` Özellikleri”][fn-traits] bölümünde, kapalı alanları `Fn`, `FnMut` ve `FnOnce` üç farklı özelliği ile parametre olarak alabileceğimizi hatırlıyoruz. Burada hangi tür kapalı alan kullanmamız gerektiğini belirlemeliyiz. Sonunda `execute`'te aldığımız argümanı `spawn`'a ileteceğimiz için, standart kütüphane `thread::spawn` uygulamasının parametre imzasında ne tür sınırlamalar olduğunu görebiliriz. Belgelendirme bize aşağıdaki bilgileri gösteriyor:

```rust,ignore
pub fn spawn<F, T>(f: F) -> JoinHandle<T>
    where
        F: FnOnce() -> T,
        F: Send + 'static,
        T: Send + 'static,
```

`F` tür parametresi burada bizi ilgilendiriyor; `T` tür parametresi döndürme değeri ile ilgili ve bununla ilgilenmiyoruz. `spawn`'ın `F` için `FnOnce` özelliğini kullandığını görebiliyoruz. Bu muhtemelen bizim de istediklerimiz, çünkü bir isteği çalıştırmak için oluşturacağımız iplik yalnızca o isteğin kapalı alanını bir kez çalıştıracaktır; bu, `FnOnce` içindeki `Once` ile eşleşiyor.

`F` tür parametresi ayrıca `Send` özelliğine ve `'static` ömrü sınırlamasına sahiptir; bunlar durumumuzda faydalıdır: işlevi bir iplikten diğerine taşımak için `Send`'e ihtiyaç duyarız ve `'static` ömrü, ipliğin çalıştırılmasının ne kadar sürmeyeceğini bilmediğimiz için gereklidir. `ThreadPool`'da, şu sınırlara sahip `F` türünde genel bir parametre alan bir `execute` yöntemi oluşturalım:



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/no-listing-03-define-execute/src/lib.rs:here}}
```



Hiçbir parametre almayan ve birim türü `()` döndüren bir kapalı alanı temsil ettiği için, `FnOnce`'dan sonra `()` olarak kullanmaya devam ediyoruz. Fonksiyon tanımları gibi, dönüş türü imzasından çıkarılabilir; ancak parametremiz olmasa bile, parantezleri hâlâ belirtmemiz gerekmektedir.

Yine, bu `execute` yönteminin en basit uygulaması: hiçbir şey yapmıyor, ancak kodumuzu derlenebilir hale getirmeye çalışıyoruz. Şimdi tekrar kontrol edelim:

```console
{{#include ../listings/ch21-web-server/no-listing-03-define-execute/output.txt}}
```

Derleniyor! Ancak, `cargo run` yapıp tarayıcıda bir istek yaptığınızda, bölümün başında gördüğümüz hataları tarayıcıda göreceksiniz. Kütüphanemiz henüz `execute`'ye iletilen kapalı alanı çağırmıyor!

:::note
Haskell ve Rust gibi sıkı derleyicilere sahip diller hakkında duyabileceğiniz bir ifade, "Kod derleniyorsa, çalışır." Ancak bu ifade evrensel olarak doğru değildir. Projemiz derleniyor, ancak kesinlikle hiçbir şey yapmıyor! Eğer gerçek, tam bir proje inşa etseydik, bu noktada kodun derlenmesini *ve* istediğimiz davranışı belirlemek için birim testleri yazmaya başlamak iyi bir zaman olurdu.
:::

Düşünün: eğer bir kapalı alan yerine bir *gelecek* yürütmeye çalışsaydık, burada ne farklı olurdu?

#### `new` İçin İplik Sayısını Doğrulama

Şu an için `new` ve `execute`'deki parametrelerle ilgili hiçbir şey yapmıyoruz. Bu işlevlerin gövdelerini, istediğimiz davranışla uygulayalım. Öncelikle, `new` hakkında düşünelim. Daha önce `size` parametresi için işaretsiz bir tür seçmiştik çünkü negatif iplik sayısına sahip bir havuz anlamlı değildir. Ancak, sıfır iplik sayısına sahip bir havuz da mantıklı değildir, ancak sıfır, tam anlamıyla geçerli bir `usize` değeridir. `size`'ın sıfırdan büyük olduğundan emin olmamız için kod ekleyeceğiz ve sıfır alırsa programın panic yaratmasını sağlayacağız, bunun için Liste 21-13'te gösterildiği gibi `assert!` makrosunu kullanacağız.



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/listing-21-13/src/lib.rs:here}}
```



Ayrıca, `ThreadPool` için doc yorumları ile bazı belgeler ekledik. Fonksiyonumuzun hangi durumlarda panik yaratabileceğini belirtmek için bir bölüm ekleyerek iyi belgelerin uygulamalarına saygı gösterdik, bu 14. Bölümde ele alındı. `cargo doc --open` komutunu çalıştırmayı ve `ThreadPool` yapısına tıklamayı deneyin; `new` için üretilen belgelerin nasıl göründüğünü görün!

Burada, `assert!` makrosunu eklemek yerine, `new`'u `build` olarak değiştirip, I/O projesinde Liste 12-9'da yaptığımız gibi bir `Result` döndürebiliriz. Ancak bu durumda, sıfır iplik olmadan bir işçi havuzu oluşturmaya çalışmanın geri dönüşü olmayan bir hata olması gerektiğine karar verdik. Çoğu zaman iddialı hissediyorsanız, `new` fonksiyonu ile karşılaştırılması için aşağıdaki imzaya sahip bir `build` adında bir fonksiyon yazmayı deneyin:

```rust,ignore
pub fn build(size: usize) -> Result<ThreadPool, PoolCreationError> {
```

#### İplikleri Saklamak İçin Alan Oluşturma

Artık havuzda saklamak için geçerli bir iplik sayısına sahip olduğumuz bir yolumuz var, bu yüzden bu iplikleri oluşturup `ThreadPool` yapısında saklayabiliriz. Ancak bir ipliği nasıl "saklarız"? `thread::spawn` imzasına bir kez daha bakalım:

```rust,ignore
pub fn spawn<F, T>(f: F) -> JoinHandle<T>
    where
        F: FnOnce() -> T,
        F: Send + 'static,
        T: Send + 'static,
```

`spawn` işlevi bir `JoinHandle` döndürür; burada `T`, kapalı alanın döndürdüğü türdür. `JoinHandle`'ı da deneyelim ve ne olduğunu görelim. Bizim durumumuzda, işçi havuzuna ilettiğimiz kapalı alanlar bağlantıyı yönetecek ve hiçbir şey döndürmeyecektir, bu nedenle `T`, birim türü `()` olacaktır.

Liste 21-14'teki kod derleniyor ama henüz herhangi bir iplik yaratmıyor. `ThreadPool`'un tanımını, ipliklerin saklanacağı `thread::JoinHandle` örneklerini tutan bir vektör içerecek şekilde değiştirdik, vektörü `size` ile başlatmış, bazı iplikleri oluşturmak için bir `for` döngüsü kurduk ve onları içeren bir `ThreadPool` örneği döndürdük.



```rust,ignore,not_desired_behavior
{{#rustdoc_include ../listings/ch21-web-server/listing-21-14/src.lib.rs:here}}
```



`std::thread`'i kütüphane kütüphanemize dahil ettik çünkü `ThreadPool`'un içindeki vektör öğelerinin türü olarak `thread::JoinHandle` kullanıyoruz.

Geçerli bir boyut alındığında, `ThreadPool` yeni bir vektör oluşturur; bu vektör `size` öğe tutabilir. `with_capacity` işlevi, `Vec::new` ile aynı görevi yerine getirir ama önemli bir fark ile: vektörde önceden alan ayırır. Vektörde `size` öğeleri saklayacağımızı bildiğimiz için, bu ayırımı yapmak, öğeler eklendikçe kendini yeniden boyutlandıran `Vec::new` kullanmaktan daha verimlidir.

`cargo check` komutunu tekrar çalıştırdığınızda, başarılı olmalıdır.

#### `Worker` Yapısı: `ThreadPool`'dan Bir İşi Bir İvme İletmek Üzere Sorumlu

Liste 21-14'teki `for` döngüsüyle ilgili bir yorum bıraktık; burada thread'lerin nasıl oluşturulduğuna bakalım. Standart kütüphane, thread oluşturmak için `thread::spawn` sağlar ve `thread::spawn`, thread yaratıldığında çalıştırılacak bir kod almayı bekler. Ancak, bizim durumumuzda thread'leri oluşturmamız ve onların daha sonra göndereceğimiz kod için **beklemesini** istememiz gerekiyor. Standart kütüphanenin thread uygulaması bunu yapmanın bir yolunu sağlamıyor; bunu manuel olarak uygulamamız gerekiyor.

:::info
Bu davranışı, `ThreadPool` ile bu yeni davranışı yönetecek olan thread'ler arasında yeni bir veri yapısı tanıtarak uygulayacağız. 
:::

Bu veri yapısına *Worker* adını vereceğiz; bu, havuz uygulamalarında yaygın bir terimdir. Worker, çalıştırılması gereken kodu alır ve bu kodu Worker'ın thread'inde çalıştırır. Bir restorandaki mutfakta çalışan insanları düşünün: çalışanlar, müşterilerden siparişler gelene kadar bekler ve ardından bu siparişleri alıp yerine getirirler.

`JoinHandle` örneklerinin bir vektörünü thread havuzunda saklamak yerine, `Worker` yapısının örneklerini saklayacağız. Her `Worker`, tek bir `JoinHandle` örneğini saklayacak. Daha sonra `Worker` üzerinde çalıştırılacak bir kod kapalı işlevi alan ve bunu zaten çalışan thread'e gönderen bir yöntem uygulayacağız. Her çalışana, havuzdaki farklı çalışanları ayırt edebilmemiz için bir `id` de vereceğiz.

İşte bir `ThreadPool` oluşturduğumuzda gerçekleşecek yeni süreç. `Worker`'ı bu şekilde kurduktan sonra kodu, kapalı işlevi thread’e gönderecek şekilde uygulayacağız:

1. **Bir `id` ve bir `JoinHandle` tutan bir `Worker` yapısı tanımlayın.**
2. **`ThreadPool`'ı `Worker` örneklerinin bir vektörünü tutacak şekilde değiştirin.**
3. **Bir `id` numarasını alan ve `id`'yi ve boş bir kapalı işlev ile oluşturulmuş bir thread'i tutan bir `Worker` örneği döndüren `Worker::new` fonksiyonunu tanımlayın.**
4. **`ThreadPool::new` içinde, `for` döngüsü sayacını kullanarak bir `id` oluşturun, bu `id` ile yeni bir `Worker` oluşturun ve işçiyi vektörde saklayın.**

:::tip
Zorluk arıyorsanız, Liste 21-15'teki kodu incelemeden önce bu değişiklikleri kendiniz uygulamayı deneyin.
:::

Hazır mısınız? İşte, önceki değişiklikleri yapmanın bir yolu olan Liste 21-15.



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/listing-21-15/src/lib.rs:here}}
```



`ThreadPool`'deki alanın adını `threads`'ten `workers`'e değiştirdik çünkü şu anda `JoinHandle` örnekleri yerine `Worker` örneklerini tutuyor. `Worker::new`'e bir argüman olarak `id` kullandık ve her yeni `Worker`'ı `workers` adındaki vektörde sakladık.

Dış kod (örneğin *src/main.rs* içindeki sunucumuz) `ThreadPool` içinde bir `Worker` yapısını kullanmayla ilgili uygulama detaylarını bilmesine gerek yok, bu yüzden `Worker` yapısını ve `new` fonksiyonunu özel yaptık. `Worker::new` fonksiyonu, kendisine verdiğimiz `id`'yi kullanır ve yeni bir thread oluştururken oluşturduğu `JoinHandle` örneğini saklar.

> **Not:** İşletim sistemi bir thread oluşturamazsa çünkü yeterli sistem kaynakları yoksa, `thread::spawn` panik yapar. Bu, bazı thread'lerin oluşturulması başarılı olsa bile, tüm sunucumuzun paniklemesine neden olur. Basit olsun diye bu davranış kabul edilebilir, ancak üretim için bir thread havuzu uygulamasında, büyük ihtimalle `std::thread::Builder`'ı ve bunun `Result` döndüren `spawn` metodunu kullanmak istersiniz.

Bu kod derlenecek ve `ThreadPool::new`’a argüman olarak belirttiğimiz `Worker` örneklerinin sayısını saklayacaktır. Ancak hala `execute` içinde aldığımız kapalı işlevi işlemiyor olduğumuz için buraya bakacağız.

---

### İğneleri Thread'lere Göndermek İçin Kanallar

Bir sonraki sorunumuz, `thread::spawn`'a verilen kapalı işlevlerin hiçbir şey yapmamasıdır. Şu anda, `execute` metodunda çalıştırmak istediğimiz kapalı işlevi alıyoruz. Ancak, `ThreadPool` yaratıldığında her `Worker`'ı oluşturduğumuzda, `thread::spawn`'a çalıştırması için bir kapalı işlev vermemiz gerekiyor.

:::warning
Yeni oluşturduğumuz `Worker` yapılarının, `ThreadPool` içinde tutulan bir kuyruktan çalıştırılacak kodu almasını ve bu kodu çalıştırması için kendi thread’ine göndermesini istiyoruz.
:::

16. Bölümde öğrendiğimiz kanallar—iki thread arasında iletişim kurmanın basit bir yolu—bu kullanım senaryosu için mükemmel olacaktır. Bir kanal, işlerin kuyruğu olarak işlev görecek ve `execute` bir işi `ThreadPool`'dan `Worker` örneklerine gönderecek, bu da işi thread'ine iletecek. İşte plan:

1. **`ThreadPool` bir kanal oluşturacak ve alıcıyı tutacaktır.**
2. **Her `Worker`, alıcıyı tutacaktır.**
3. **Gönderilecek kapalı işlevleri tutacak yeni bir `Job` yapısı oluşturacağız.**
4. **`execute` metodu, çalıştırmak istediği işi gönderici üzerinden gönderecektir.**
5. **`Worker`, thread'inde alıcısının üzerinde döngü yapıp aldığı tüm işlerin kapalı işlevlerini çalıştıracaktır.**

Şimdi, Liste 21-16'da gösterildiği gibi, `ThreadPool::new`'te bir kanal oluşturup göndericiyi `ThreadPool` örneğinde tutarak başlayalım. `Job` yapısı şuan için hiçbir şey tutmuyor, ancak kanal üzerinden göndereceğiz.



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/listing-21-16/src/lib.rs:here}}
```



`ThreadPool::new`'de, yeni kanalımızı oluşturuyor ve havuzu göndericiyi tutacak şekilde ayarlıyoruz. Bu başarıyla derlenecektir.

Her işçiye teslimat sırasında kanaldan alıcıyı geçirmeyi deneyelim. İşçilerin oluşturduğu thread'de alıcıyı almak istediğimize göre, kapalı işlev içindeki `receiver` parametresine atıfta bulunacağız. Liste 21-17'deki kod henüz derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch21-web-server/listing-21-17/src/lib.rs:here}}
```



Bazı küçük ve basit değişiklikler yaptık: alıcıyı `Worker::new`'e geçiriyoruz ve ardından kapalı işlevin içinde kullanıyoruz.

Bu kodu kontrol etmeye çalıştığımızda şu hatayı alıyoruz:

```console
{{#include ../listings/ch21-web-server/listing-21-17/output.txt}}
```

Kod, `receiver`'ı birden fazla `Worker` örneğine iletmeye çalışıyor. Bu çalışmayacak; çünkü hatırlayacağınız üzere, Rust'ın sağladığı kanal uygulaması çoklu *üretici*, tekil *tüketici*dir. Bu, tüketim ucunu düzeltmek için kopyalayamayacağımız anlamına geliyor. Ayrıca, birden fazla tüketiciye bir mesaj göndermek istemiyoruz; her mesajın bir kez işlenmesini istediğimiz çok sayıda işçiyle bir mesaj listesine ihtiyacımız var.

Ek olarak, bir iş almanın kuyruktan çıkması alıcının değiştirilmesini içerir, bu yüzden thread'lerin alıcıyı paylaşmak ve değiştirmek için güvenli bir yola ihtiyacı vardır; aksi takdirde koşul yarışları (16. Bölümde ele alındığı gibi) yaşayabiliriz.

:::note
16. Bölümdeki thread güvenli akıllı göstergelere dikkat edin: sahipliği birden fazla thread arasında paylaşmak ve thread'lerin değeri değiştirmesine izin vermek için `Arc>` kullanmamız gerekiyor. `Arc` tipi birden fazla işçinin alıcıyı sahiplenmesine izin verecek ve `Mutex`, bir işçinin alıcıdan bir iş alamasını sağlamak için yalnızca bir işçinin kullanmasını güvence altına alacak. Liste 21-18'de yapmamız gereken değişiklikleri gösteriyoruz.
:::



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/listing-21-18/src/lib.rs:here}}
```



`ThreadPool::new`'de, alıcıyı bir `Arc` içinde ve bir `Mutex` içine koyuyoruz. Her yeni işçi için, alıcının referans sayısını artırmak üzere `Arc`'yi kopyalıyoruz böylece işçiler alıcının mülkiyetini paylaşabilirler.

Bu değişikliklerle kod derleniyor! Hedefe yaklaşıyoruz!

---

### `execute` Metodunu Uygulamak

Şimdi, `ThreadPool` üzerinde `execute` metodunu nihayet uygulayalım. `Job`'ı bir yapıyı kapalı işlevin tutacağı bir tür eşya olarak bir tür takma adına değiştireceğiz. 20. Bölümün [“Tür Takma İsimleri Oluşturmak”][creating-type-synonyms-with-type-aliases] bölümünde tartışıldığı gibi, tür takma adları, uzun türleri daha kısa hale getirerek kullanım kolaylığı sağlar. Liste 21-19'a bakın.



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/listing-21-19/src/lib.rs:here}}
```



`execute` içinde aldığımız kapalı işlev kullanılarak yeni bir `Job` örneği oluşturduktan sonra, o işi kanalın gönderim ucuna gönderiyoruz. Gönderim işlemi başarısız olursa diye `send`'de `unwrap` çağırıyoruz. Bu, örneğin, tüm thread'lerimizi yürütmemize engel olursak, alıcının yeni mesajlar almaya devam etmeyi bıraktığı durumlarda gerçekleşebilir. Şu anda thread'lerimizi yürütmeyi durduramadığımız için: havuz var oldukça thread'lerimiz çalışmaya devam ediyor. `unwrap` kullanmamızın nedeni ise hata durumunun olmayacağını bilmemizdir, ancak derleyici bunu bilemez.

Ancak henüz tamamlanmadık! İşçi içinde, `thread::spawn`'a geçirilen kapalı işlevi doğrusal olarak yalnızca *alıcı* ucuna atfediyoruz. Bunun yerine, kapalı işlevin sonsuza kadar döngü yapmasını, alıcıdan bir iş istemesini ve bir iş aldığında bu işi çalıştırmasını sağlamalıyız. `Worker::new`'deki değişiklik için Liste 21-20'yi yapalım.



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/listing-21-20/src/lib.rs:here}}
```



Burada, önce `receiver` üzerinde `lock` çağırarak mutex'i elde ediyoruz ve ardından herhangi bir hata üzerinde `unwrap` çağırıyoruz. Bir kilidi elde etmek, mutex bir *zehirli* durumda olduğunda başarısız olabilir; bu, başka bir thread kilidi alırken paniklediği durumlarda olabilir ve kilidi bıraktığı durumlarda gerçekleşir. Bu durumda, `unwrap` çağırmak, bu thread’in panik yapması için doğru eylemdir. Bunun yerine size anlamlı bir hata mesajı ile `expect` yapmak isteyebilirsiniz.

Mutex'teki kilidi elde edersek, kanaldan bir `Job` almak için `recv` çağırıyoruz. Son bir `unwrap` da, gönderim ucunu kapatan bir thread'e benzer bir hata durumunda kesilmeyi önlemek için olur; bu da alıcı kapatıldığında `send` metodunun `Err` döndürdüğü gibidir.

`recv` çağrısı bloğa neden olur, bu nedenle henüz bir iş yoksa, mevcut thread bir iş kullanılabilir hale gelene kadar bekleyecektir. `Mutex`, her seferinde yalnızca bir `Worker` thread'inin bir iş isteme girişiminde bulunmasına izin verir.

:::tip
Thread havuzumuz artık çalışan bir durumda! Bir `cargo run` verin ve bazı taleplerde bulunun:
:::

```console
$ cargo run
   Compiling hello v0.1.0 (file:///projects/hello)
warning: field `workers` is never read
 --> src/lib.rs:7:5
  |
6 | pub struct ThreadPool {
  |            ---------- field in this struct
7 |     workers: Vec<Worker>,
  |     ^^^^^^^
  |
  = note: `#[warn(dead_code)]` on by default

warning: fields `id` and `thread` are never read
  --> src/lib.rs:48:5
   |
47 | struct Worker {
   |        ------ fields in this struct
48 |     id: usize,
   |     ^^
49 |     thread: thread::JoinHandle<()>,
   |     ^^^^^^

warning: `hello` (lib) generated 2 warnings
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 4.91s
     Running `target/debug/hello`
Worker 0 got a job; executing.
Worker 2 got a job; executing.
Worker 1 got a job; executing.
Worker 3 got a job; executing.
Worker 0 got a job; executing.
Worker 2 got a job; executing.
Worker 1 got a job; executing.
Worker 3 got a job; executing.
Worker 0 got a job; executing.
Worker 2 got a job; executing.
```

Başarı! Artık bağlantıları asenkron olarak yürüten bir thread havuzumuz var. Sunucu çok sayıda isteği aldığında sistemimiz aşırı yüklenmeyecek, çünkü yaratılan thread sayısı hiçbir zaman dörtten fazla olmayacak. */sleep* isteğine bir talep yaptığımızda, sunucu diğer istekleri başka bir thread'in çalışması sayesinde yerine getirebilecektir.

> **Not:** Eğer */sleep*'i aynı anda birden fazla tarayıcı penceresinde açarsanız, yüklenme işlemi 5 saniyelik aralıklarla birer birer gerçekleşebilir. Bazı web tarayıcıları, önbellekleme nedenleriyle aynı isteği ardışık olarak birden fazla kez çalıştırır. Bu sınırlama bizim web sunucumuzdan kaynaklanmamaktadır.

:::info
Bu noktada, Liste 21-18, 21-19 ve 21-20'deki kodun, işlerin yapılması için kapalı işlev yerine futures kullanıyor olsaydık nasıl değişeceğini düşünmek için iyi bir zaman. Hangi türler değişirdi? Yöntem imzaları ne kadar farklı olurdu, eğer olursa? Kodun hangi kısımları aynı kalırdı?
:::

17. ve 18. Bölümlerdeki `while let` döngüsü hakkında bilgi aldıktan sonra, neden işçi thread kodunu Liste 21-21'de gösterildiği gibi yazmadığımızı merak ediyor olabilirsiniz.



```rust,ignore,not_desired_behavior
{{#rustdoc_include ../listings/ch21-web-server/listing-21-21/src/lib.rs:here}}
```



Bu kod derleniyor ve çalışıyor ancak istenilen threading davranışına neden olmuyor: yavaş bir istek, diğer isteklerin işlenmesini bekletmeye devam ediyor. Bunun nedeni biraz ince: `Mutex` yapısının halka açık bir `unlock` metodu yoktur çünkü kilidin sahipliği, `lock` metodunun döndürdüğü `LockResult>` içindeki `MutexGuard` ömrüne bağlıdır. Derleme zamanında, borç kontrolörü, bir `Mutex` ile korunan bir kaynağa erişimin, kilidi tutuyorsak mümkün olamayacağının kuralını zorlar. Ancak, bu uygulama, `MutexGuard` ömrüne dikkat etmezsek, kilidin beklenenden daha uzun süre tutulmasına da neden olabilir.

Liste 21-20’deki kod, `let job = receiver.lock().unwrap().recv().unwrap();` şeklinde çalışır, çünkü `let` ile, eşitlik işareti sağındaki ifadede kullanılan geçici değerler, `let` ifadesi sona erdiğinde hemen atılır. Ancak `while let` (ve `if let` ile `match`) geçici değerleri, ilişkili blok sonuna kadar atmaz. Liste 21-21’de, kilit, `job()` çağrısı süresince tutulur; bu, diğer işçilerin iş almasını engeller.

[creating-type-synonyms-with-type-aliases]:
ch20-04-advanced-types.html#creating-type-synonyms-with-type-aliases
[integer-types]: ch03-02-data-types.html#integer-types
[fn-traits]:
ch13-01-closures.html#moving-captured-values-out-of-the-closure-and-the-fn-traits
[builder]: ../std/thread/struct.Builder.html
[builder-spawn]: ../std/thread/struct.Builder.html#method.spawn