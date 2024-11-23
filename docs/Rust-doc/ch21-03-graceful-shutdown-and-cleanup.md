## Nazik Kapatma ve Temizlik

Liste 21-20'deki kod, niyet ettiğimiz gibi, bir iş parçacığı havuzu kullanarak istekleri eşzamanlı olarak yanıtlıyor. Kullanmadığımız `workers`, `id` ve `thread` alanları hakkında, herhangi bir şeyi temizlemediğimiz için bize hatırlatan bazı uyarılar alıyoruz. Ana iş parçacığını durdurmak için daha az şık olan ctrl-c yöntemini kullandığımızda, diğer tüm iş parçacıkları hemen durdurulur, istek hizmetinin ortasında olsalar bile.

:::tip
Bir iş parçacığı havuzunu kullanmayı planlıyorsanız, temizleme ve kapanma işlemlerinin yönetimini önceden düşünmek önemlidir.
:::

Bir sonraki adım olarak, havuzdaki her bir iş parçacığının isteklerini tamamlayabilmesi için `join` çağrısını yapmak üzere `Drop` trait'ini uygulayacağız. Ardından, iş parçacıklarına yeni istek almaktan vazgeçmeleri ve kapatılmaları gerektiğini bildiren bir yol uygulayacağız. Bu kodun çalışmasını görmek için, sunucumuzu, nazik bir şekilde iş parçacığı havuzunu kapatmadan önce yalnızca iki isteği kabul edecek şekilde değiştireceğiz.

:::warning
Unutmayın, bu aşamada yapılan her değişiklik, kapanmaları yöneten kod parçalarına etki etmez. Bu nedenle, aynı eşzamanlı çalışma süresi için bir iş parçacığı havuzu kullanıyorsak sonuçlar değişmeyecek.
:::

### `ThreadPool` Üzerinde `Drop` Trait'inin Uygulanması

Hadi iş parçacığı havuzumuzda `Drop` uygulamaya başlayalım. Havuz bırakıldığında, iş parçacıklarımızın hepsi işleri tamamlamak için birleştirilmeli. Liste 21-22, `Drop` uygulaması için ilk bir deneme gösteriyor; bu kod henüz yeterince çalışmıyor.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch21-web-server/listing-21-22/src/lib.rs:here}}
```



İlk olarak, iş parçacığı havuzundaki `workers`'ın her birine döngü yapıyoruz. Bunun için `&mut` kullanıyoruz çünkü `self` bir değiştirilebilir referans ve aynı zamanda `worker`'ı da değiştirebilmemiz gerekiyor. Her işçi için, bu belirli işçinin kapandığını söyleyen bir mesaj yazdırıyoruz, ardından o işçinin iş parçacığı üzerinde `join` çağrısı yapıyoruz. `join` çağrısı başarısız olursa, Rust'ın panik yapması ve nazik olmayan bir kapanmaya gitmesi için `unwrap` kullanıyoruz.

:::note
Bu aşamadaki önemli noktalar:
- `join` çağrısının neden başarısız olabileceği
- `unwrap` kullanımının sonuçları
:::

Bu kodu derlediğimizde aldığımız hata:

```console
{{#include ../listings/ch21-web-server/listing-21-22/output.txt}}
```

Hata, `join` çağrısı yapamayacağımızı çünkü her `worker`'ın yalnızca bir değiştirilebilir ödünç olduğunu ve `join`'nin argümanının mülkiyetini aldığını bize söylüyor. Bu sorunu çözmek için, `join`'nin iş parçacığını tüketebilmesi için iş parçacığını, `thread`'ı sahiplenen `Worker` örneğinden taşımamız gerekiyor. Bunu Liste 17-15'te yaptık: `Worker`, `Option>` tutuyorsa, `Option` üzerindeki `take` yöntemini çağırarak değeri `Some` varyantından dışarı taşıyabiliriz ve yerine `None` varyantını bırakabiliriz. Diğer bir deyişle, çalışan bir `Worker`, `thread` üzerinde bir `Some` varyantına sahip olacaktır ve bir `Worker`'ı temizlemek istediğimizde, `Worker`'ın çalışacak bir iş parçacığı olmaması için `Some` değerini `None` ile değiştireceğiz.

Bu nedenle, `Worker` tanımını şu şekilde güncellemek istediğimizi biliyoruz:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch21-web-server/no-listing-04-update-worker-definition/src/lib.rs:here}}
```



Şimdi derleyiciden diğer değişiklik yapılması gereken yerleri bulmasını sağlayalım. Bu kodu kontrol ettiğimizde iki hata alıyoruz:

```console
{{#include ../listings/ch21-web-server/no-listing-04-update-worker-definition/output.txt}}
```

İkinci hatayı ele alalım; bu, `Worker::new`'in sonunda bulunan kodu işaret ediyor; yeni bir `Worker` oluşturduğumuzda `thread` değerini `Some` içinde sarmamız gerekiyor. Bu hatayı düzeltmek için aşağıdaki değişiklikleri yapalım:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch21-web-server/no-listing-05-fix-worker-new/src/lib.rs:here}}
```



İlk hata ise `Drop` uygulamamızda. Daha önce `worker`'dan `thread`'ı taşımak için `Option` değerindeki `take` çağrısı yapmayı planladığımızı belirtmiştik. Aşağıdaki değişiklikler bunu gerçekleştirecektir:



```rust,ignore,not_desired_behavior
{{#rustdoc_include ../listings/ch21-web-server/no-listing-06-fix-threadpool-drop/src/lib.rs:here}}
```



Bölüm 18'de tartıştığımız gibi, `Option` üzerindeki `take` yöntemi `Some` varyantını alır ve yerine `None` bırakır. `Some`'ı ayrıştırmak ve iş parçacığını almak için `if let` kullanıyoruz; ardından iş parçacığı üzerinde `join` çağrısı yapıyoruz. Eğer bir işçinin iş parçacığı zaten `None` ise, o işçinin zaten iş parçacığı temizlenmiş olduğundan hiçbir şey olmaz.

### İş Parçacıklarına İş Beklemeyi Durdurmak İçin İşaret Göndermek

Yaptığımız tüm değişikliklerle birlikte, kodumuz herhangi bir uyarı olmadan derleniyor. Ancak kötü haber, bu kodun henüz istediğimiz gibi çalışmaması. Anahtar, `Worker` örneklerinin iş parçacıkları tarafından yürütülen kapanmalardaki mantıktır: şu anda `join` çağrısı yapıyoruz, ancak bu, iş parçacıklarını kapatmaz çünkü sonsuza kadar iş beklemeye devam ediyorlar. Mevcut `drop` uygulamamızla `ThreadPool`'u bırakmaya çalışırsak, ana iş parçacığı ilk iş parçacığının bitmesini beklerken sonsuza kadar engellenir.

:::info
Kilit noktamız: `Worker`'lar üzerinde `join` çağrısı yapmadan önce, bu iş parçacıklarının iş beklemeyi durdurmaları gerekmektedir.
:::

Bu sorunu çözmek için, `ThreadPool`'un `drop` uygulamasında bir değişikliğe ihtiyacımız olacak ve ardından `Worker` döngüsünde bir değişiklik yapacağız.

Öncelikle, iş parçacıkları bitene kadar beklemekten önce `sender`'ı açıkça bırakmak için `ThreadPool`'un `drop` uygulamasını değiştireceğiz. Liste 21-23, `worker` iş parçacıklarını birleştirmeden önce `sender`ı açıkça bırakmak için `ThreadPool`'da yapılan değişiklikleri gösterir. İş parçacığını dışarı taşımak için `sender` ile aynı `Option` ve `take` tekniğini kullanıyoruz:



```rust,noplayground,not_desired_behavior
{{#rustdoc_include ../listings/ch21-web-server/listing-21-23/src/lib.rs:here}}
```



`sender`'ı bırakmak, kanalı kapatır, bu da artık daha fazla mesaj gönderilmeyeceği anlamına gelir. Bu olduğunda, işçilerin sonsuz döngüde yaptığı tüm `recv` çağrıları bir hata döndürecektir. Liste 21-24'te, bu durumda döngüden nazik bir şekilde çıkmak için `Worker` döngüsünü değiştiriyoruz, bu da iş parçacıkları `ThreadPool`'un `drop` uygulaması onlara `join` çağrısı yaptığında işlerlerini tamamlayacakları anlamına gelir.



```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/listing-21-24/src/lib.rs:here}}
```



Bu kodun çalışmasını görmek için, sunucuyu nazik bir şekilde kapatmadan önce yalnızca iki isteği kabul edecek şekilde `main` fonksiyonumuzu değiştirelim; bu, Liste 21-25'te gösterildiği gibi.



```rust,ignore
{{#rustdoc_include ../listings/ch21-web-server/listing-21-25/src/main.rs:here}}
```



Gerçek dünyada bir web sunucusunun yalnızca iki isteği tamamladıktan sonra kapanmasını istemezsiniz. Bu kod, nazik bir kapanma ve temizlik işlevinin çalıştığını göstermek içindir.

`take` yöntemi, `Iterator` trait'inde tanımlanmıştır ve yinelemeyi en fazla ilk iki öğeyle sınırlandırır. `ThreadPool`, `main`'in sonunda kapsamdan çıkacak ve `drop` uygulaması çalışacaktır.

Sunucuyu `cargo run` ile başlatın ve üç istek yapın. Üçüncü istek bir hata ile sonuçlanmalıdır ve terminalinizde aşağıdaki gibi bir çıktı görmelisiniz:

```console
$ cargo run
   Derleme hello v0.1.0 (file:///projects/hello)
    `dev` profilini bitirdi [optimize edilmemiş + hata ayıklama bilgisi] hedef(ler) 0.41s içinde
     `target/debug/hello` çalıştırılıyor
İşçi 0 bir iş aldı; yürütülüyor.
Kapatılıyor.
İşçi 0 kapatılıyor
İşçi 3 bir iş aldı; yürütülüyor.
İşçi 1 bağlantıyı kopardı; kapanıyor.
İşçi 2 bağlantıyı kopardı; kapanıyor.
İşçi 3 bağlantıyı kopardı; kapanıyor.
İşçi 0 bağlantıyı kopardı; kapanıyor.
İşçi 1 kapatılıyor
İşçi 2 kapatılıyor
İşçi 3 kapatılıyor
```

İşçi ve mesajların sıralamasında farklılık görebilirsiniz. Kodun bu şekilde çalıştığını görebiliyoruz: işçiler 0 ve 3 ilk iki isteği aldı. Sunucu, ikinci bağlantıdan sonra daha fazla bağlantı kabul etmeyi durdurdu ve `ThreadPool`'daki `Drop` uygulaması, işçi 3 işini başlatmadan önce çalışmaya başladı. `sender`'ı bırakmak, tüm iş parçacıklarını ayırır ve onlara kapanmaları gerektiğini bildirir. Her işçi bağlantılarını koptuğunda bir mesaj yazdırır ve ardından iş parçacığı havuzu, her işçi iş parçacığının bitmesini beklemek için `join` çağrısı yapar.

:::quote
"Bu belirli yürütmenin ilginç bir yönüne dikkat edin: `ThreadPool`, `sender`'ı bıraktı ve herhangi bir işçi hatayı almadan önce işçi 0'ı birleştirmeye çalıştık."
— Kapanma Yöntemleri Üzerine
:::

Bu belirli yürütmenin ilginç bir yönüne dikkat edin: `ThreadPool`, `sender`'ı bıraktı ve herhangi bir işçi hatayı almadan önce işçi 0'ı birleştirmeye çalıştık. İşçi 0, `recv`'den henüz hata almadı, bu nedenle ana iş parçacığı işçi 0'ın tamamlanmasını beklerken engellendi. Bu arada, işçi 3 bir iş aldı ve ardından tüm iş parçacıkları hata aldı. İşçi 0 tamamlandığında, ana iş parçacığı geri kalan iş parçacıklarının bitmesini bekledi. Bu noktada, hepsi döngülerinden çıkmış ve durmuşlardı.

Tebrikler! Artık projemizi tamamladık; bir iş parçacığı havuzu kullanarak eşzamanlı yanıt veren temel bir web sunucumuz var. Sunucunun nazik bir şekilde kapanmasını sağlıyoruz ki bu da havuzdaki tüm iş parçacıklarını temizlemiş oluyor.

Referans olarak tam kod:



```rust,ignore
{{#rustdoc_include ../listings/ch21-web-server/no-listing-07-final-code/src/main.rs}}
```





```rust,noplayground
{{#rustdoc_include ../listings/ch21-web-server/no-listing-07-final-code/src/lib.rs}}
```



Burada daha fazlasını yapabiliriz! Bu projeyi geliştirmeye devam etmek istiyorsanız, işte bazı fikirler:

* `ThreadPool` ve kamuya açık yöntemleri için daha fazla belge ekleyin.
* Kütüphanenin işlevselliğini test edin.
* `unwrap` çağrılarını daha sağlam hata işleme ile değiştirin.
* `ThreadPool` kullanarak web istekleri dışında başka bir görev gerçekleştirin.
* [crates.io](https://crates.io/) üzerinde bir iş parçacığı havuzu kütüphanesi bulun ve bunun yerine o kütüphaneyi kullanarak benzer bir web sunucusu uygulayın. Ardından API'sini ve uyguladığımız iş parçacığı havuzuyla olan sağlamlığını karşılaştırın.

## Özet

Harika bir iş çıkardınız! Kitabın sonuna ulaştınız! Bu Rust yolculuğunda bizimle birlikte olduğunuz için teşekkür ederiz. Artık kendi Rust projelerinizi uygulamaya hazır ve diğer insanların projelerine yardımcı olmaya hazırsınız. Rust yolculuğunuzda karşılaşabileceğiniz zorluklarla ilgili size yardımcı olmak isteyen diğer Rustaceans topluluğunun dostane bir şekilde yardım etmeye hazır olduğunun farkında olun.