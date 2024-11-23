## İyileştirilmiş Paralel Kod Çalıştırma

Günümüz işletim sistemlerinin çoğunda, bir uygulamanın kodu bir *işlem* içinde çalıştırılır ve işletim sistemi aynı anda birden fazla işlemi yönetir. Bir program içerisinde, aynı anda çalışan bağımsız parçalar da olabilir. Bu bağımsız parçaları çalıştıran öğelere *iplikler* denir. Örneğin, bir web sunucusu aynı anda birden fazla isteğe yanıt verebilmek için birden fazla iplik kullanabilir.

:::tip
Programınızdaki hesaplamayı birden fazla ipliğe bölmek, birden fazla görevi aynı anda çalıştırmak performansı artırabilir.
:::

Ancak bu aynı zamanda karmaşıklık da getirir. İplikler aynı anda çalışabildiğinden, farklı ipliklerdeki kod parçalarının hangi sırayla çalışacağına dair doğal bir garanti yoktur. Bu durum aşağıdaki gibi sorunlara yol açabilir:

* İpliklerin tutarsız bir sırada veriye ya da kaynaklara eriştiği yarış koşulları
* İki ipliğin birbirini beklediği deadlock'lar; bu, her iki ipliğin devam etmesini engeller
* Sadece belirli durumlarda ortaya çıkan ve güvenilir bir şekilde yeniden üretip düzeltmenin zor olduğu hatalar

:::warning
Rust, iplikleri kullanmanın olumsuz etkilerini azaltmaya çalışır, ancak çok iplikli bir bağlamda programlama hala dikkatli düşünme gerektirir.
:::

Programlama dilleri iplikleri birkaç farklı şekilde uygular ve birçok işletim sistemi, dilin yeni iplikler oluşturmak için çağırabileceği bir API sağlar. Rust standart kütüphanesi, bir programın her bir dil ipliği için bir işletim sistemi ipliği kullandığı *1:1* iplik uygulama modelini kullanır. 1:1 modeline farklı takaslarla diğer ipleme modellerini uygulayan paketler bulunmaktadır. (Rust'ın asenkron sistemi, bir sonraki bölümde göreceğimiz gibi, eşzamanlılık için başka bir yaklaşım sağlar.)

---

### `spawn` ile Yeni Bir İplik Oluşturma

Yeni bir iplik oluşturmak için `thread::spawn` fonksiyonunu çağırır ve yeni iplikte çalıştırmak istediğimiz kodu içeren bir kapalı alan (closure) geçeriz (kapalı alanlar hakkında Bölüm 13'te konuştuk). Liste 16-1'deki örnek, bir ana iplikten bazı metinler ve yeni bir iplikten diğer metinleri yazdırır:



```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-01/src/main.rs}}
```



Rust programının ana ipliği tamamlandığında, başlatılan tüm iplikler durdurulur; tamamlayıp tamamlamadıklarına bakılmaz. Bu programın çıktısı her seferinde biraz farklı olabilir, ancak aşağıdakine benzer görünmelidir:

```text
ana iplikten hi numara 1!
başlatılan iplikten hi numara 1!
ana iplikten hi numara 2!
başlatılan iplikten hi numara 2!
ana iplikten hi numara 3!
başlatılan iplikten hi numara 3!
ana iplikten hi numara 4!
başlatılan iplikten hi numara 4!
başlatılan iplikten hi numara 5!
```

:::note
`thread::sleep` çağrıları, bir ipliğin kısa bir süre boyunca yürütmesini durdurur ve başka bir ipliğin çalışmasına izin verir.
:::

İplikler sırayla çalışabilir, ancak bu garanti edilmez: ipliklerin nasıl zamanlandığı işletim sisteminize bağlıdır. Bu çalıştırmada, ana iplik önce yazdırırken, başlatılan iplikten gelen yazdırma ifadesi kodda önce görünmesine rağmen. Ve başlatılan ipliğe `i` 9 olana kadar yazdırmasını söylememize rağmen, ana iplik kapanmadan önce sadece 5'e kadar ulaştı.

Bu kodu çalıştırır ve yalnızca ana iplikten çıktı görürseniz veya herhangi bir örtüşme görmüyorsanız, işletim sisteminin iplikler arasında geçiş yapma fırsatını artırmak için aralıklardaki sayıları artırmayı deneyin.

---

### Tüm İpliklerin Bitmesini Beklemek için `join` Handles Kullanma

Liste 16-1'deki kod, yalnızca ana ipliğin sona ermesinden dolayı başlatılan ipliği genellikle erken durdurmakla kalmaz, ayrıca ipliklerin çalışma sırası konusunda garanti olmaması nedeniyle, başlatılan ipliğin hiç çalışacağına dair bir garanti de veremeyiz!

Başlatılan ipliğin çalışmadığı veya erken sona erdiği sorununu çözmek için `thread::spawn`'dan dönen değeri bir değişkende saklayabiliriz. `thread::spawn`'ın dönüş tipi `JoinHandle`'dir. `JoinHandle`, `join` yöntemini çağırdığımızda, ipliğinin tamamlanmasını bekleyen sahipli bir değerdir. Liste 16-2, Liste 16-1'de oluşturduğumuz ipliğin `JoinHandle`'ını nasıl kullanacağımızı ve `main` çıkmadan önce başlatılan ipliğin bitmesini sağlamak için `join` çağrısını gösterecektir:



```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-02/src/main.rs}}
```



Handle üzerinde `join` çağrısı yapmak, mevcut çalışan ipliği, handle'nın temsil ettiği iplik sona erene kadar engeller. Bir ipliği *engellemek*, o ipliğin çalışmasını ya da çıkmasını önlemek anlamına gelir. Ana iplikteki `for` döngüsünden sonra `join` çağrısını koyduğumuz için Liste 16-2'yi çalıştırmak, aşağıdakine benzer bir çıktı üretmelidir:

```text
ana iplikten hi numara 1!
ana iplikten hi numara 2!
başlatılan iplikten hi numara 1!
ana iplikten hi numara 3!
başlatılan iplikten hi numara 2!
ana iplikten hi numara 4!
başlatılan iplikten hi numara 3!
başlatılan iplikten hi numara 4!
başlatılan iplikten hi numara 5!
başlatılan iplikten hi numara 6!
başlatılan iplikten hi numara 7!
başlatılan iplikten hi numara 8!
başlatılan iplikten hi numara 9!
```

İki iplik sırayla devam ederken, ama ana iplik `handle.join()` çağrısı nedeniyle bekler ve başlatılan iplik bitmeden sona ermez.

:::info
`join` çağrısının yerinin küçük detayları, ipliklerinizin aynı anda çalışıp çalışamayacağını etkileyebilir.
:::

Ancak, `main`'deki `for` döngüsünden önce `handle.join()`'ı taşırsak ne olacağını görelim:



```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/no-listing-01-join-too-early/src/main.rs}}
```



Ana iplik, başlatılan ipliğin bitmesini bekleyecek ve sonra `for` döngüsünü çalıştıracak, bu nedenle çıktı artık iç içe geçmeyecek, şöyle görünür:

```text
başlatılan iplikten hi numara 1!
başlatılan iplikten hi numara 2!
başlatılan iplikten hi numara 3!
başlatılan iplikten hi numara 4!
başlatılan iplikten hi numara 5!
başlatılan iplikten hi numara 6!
başlatılan iplikten hi numara 7!
başlatılan iplikten hi numara 8!
başlatılan iplikten hi numara 9!
ana iplikten hi numara 1!
ana iplikten hi numara 2!
ana iplikten hi numara 3!
ana iplikten hi numara 4!
```

`join` çağrısının yerinin küçük detayları, ipliklerinizin aynı anda çalışıp çalışamayacağını etkileyebilir.

---

### `move` Kapalı Alanları ile İplik Kullanma

`thread::spawn`'a geçirilen kapalı alanlarla sıklıkla `move` anahtar kelimesini kullanacağız çünkü bu kapalı alan, kullanıldığı ortamdaki değerlerin sahipliğini alır ve böylece bu değerlerin bir iplikten diğerine sahipliğini aktarır. [“Referansları Yakalama veya Sahiplik Taşıma”][capture] Bölüm 13'te, kapalı alanlar bağlamında `move` hakkında konuştuk. Şimdi, `move` ve `thread::spawn` arasındaki etkileşime odaklanacağız.

Liste 16-1'de `thread::spawn`'a geçirdiğimiz kapalı alanın hiçbir argümanı olmadığını fark edin: yeni ipliğin kodunda ana iplikten herhangi bir veri kullanmıyoruz. Ana iplikten başlatılan iplikte kullanılacak veriyi kullanmak için, başlatılan ipliğin kapalı alanı ihtiyaç duyduğu değerleri yakalamalıdır. Liste 16-3, ana iplikte bir vektör oluşturmaya ve bunu başlatılan iplikte kullanmaya yönelik bir girişim gösterir. Ancak, bu henüz çalışmayacak, bir süre sonra göreceğiniz gibi.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-03/src/main.rs}}
```



Kapalı alan `v` kullanıyor, bu nedenle `v`'yi yakalayacak ve kapalı alanın ortamının bir parçası yapacaktır. `thread::spawn`, bu kapalı alanı yeni bir iplikte çalıştırdığından, o yeni iplik içinde `v`'ye erişmemiz gerekir. Ancak bu örneği derlediğimizde, aşağıdaki hatayı alırız:

```console
{{#include ../listings/ch16-fearless-concurrency/listing-16-03/output.txt}}
```

Rust, `v`'yi nasıl yakalayacağını *çıkarım* yapar ve `println!` yalnızca `v`'ye bir referansa ihtiyaç duyduğundan, kapalı alan `v`'yi ödünç almaya çalışır. Ancak bir sorun var: Rust, başlatılan ipliğin ne kadar süreyle çalışacağını bilemez, bu nedenle `v` için referansın her zaman geçerli olup olmayacağını bilemez.

Liste 16-4, ana ipliğin `v`'yi düşürdüğü bir senaryoyu sağlar:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-04/src/main.rs}}
```



Eğer Rust bu kodu çalıştırmamıza izin verseydi, başlatılan ipliğin hemen arka planda çalışmadan bırakılma olasılığı vardı. Başlatılan ipliğin içinde `v`'ye bir referansı vardır, ancak ana iplik hemen `v`'yi düşürür, bu, Bölüm 15'te tartıştığımız `drop` fonksiyonunu kullanmaktadır. Ardından, başlatılan iplik yürütmeye başladığında, `v` artık geçerli değildir, dolayısıyla ona referans da geçerli olmayacaktır. Oh hayır!

Liste 16-3'teki derleyici hatasını çözmek için, hata mesajının tavsiyesini kullanabiliriz:

```text
yardım: kapalı alanın `v`'nin (ve diğer referanslı değişkenlerin) sahipliğini almasını sağlamak için `move` anahtar kelimesini kullanın
  |
6 |     let handle = thread::spawn(move || {
  |                                ++++
```

Kapalı alanın önüne `move` anahtar kelimesini ekleyerek, kapalı alanın kullandığı değerlerin sahipliğini almasını zorlarız, bu da Rust'ın değerleri ödünç alması gerektiğini varsaymasını önler. Liste 16-3'teki değişikliği, Liste 16-5'te gösterildiği gibi, derlenip çalıştırılmasını sağlayacak şekilde yapacağız:



```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-05/src/main.rs}}
```



Liste 16-4'teki kodu düzeltmek için `move` kapalı alan kullanmayı denemeye teşvik edilebiliriz. Ancak, bu düzeltme başka bir nedenle uygulanamaz çünkü Liste 16-4'teki durum yasaklanmıştır. Eğer kapalı alana `move` eklersek, `v`'yi kapalı alanın ortamına taşıyacağız ve artık ana iplikte üzerinde `drop` çağrısı yapamayacağız. Bunun yerine bu derleyici hatasını alırız:

```console
{{#include ../listings/ch16-fearless-concurrency/output-only-01-move-drop/output.txt}}
```

Rust'ın sahiplik kuralları bizi tekrar kurtardı! Liste 16-3'teki koddan aldığımız hata, Rust'ın korumacı bir şekilde davranması ve ipliğin yalnızca `v` için ödünç aldığını, bu da ana ipliğin teorik olarak başlatılan ipliğin referansını geçersiz kılabileceği anlamına geliyordu. `v`'nin sahipliğini başlatılan ipliğe aktarmak için Rust'a söyleyerek, ana ipliğin artık `v`'yi kullanmayacağına Rust'ı garanti ediyoruz. Liste 16-4'ü aynı şekilde değiştirirsek, ana iplikte `v`'yi kullanmaya çalıştığımızda sahiplik kurallarını ihlal etmiş olacağız. `move` anahtar kelimesi, Rust'ın ödünç alma konusundaki korumacı varsayımını aşar; sahiplik kurallarını ihlal etmemize izin vermez.

İplikler ve iplik API'si konusunda temel bir anlayış ile, ipliklerle ne *yapabileceğimize* bakalım.

[capture]: ch13-01-closures.html#capturing-references-or-moving-ownership