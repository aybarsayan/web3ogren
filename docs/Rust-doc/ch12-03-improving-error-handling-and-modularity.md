## Modülerlük ve Hata Yönetimini İyileştirmek İçin Yeniden Yapılandırma

Programımızı geliştirmek için yapının ve olası hataları nasıl yönettiğiyle ilgili dört problemi çözeceğiz. Öncelikle, `main` fonksiyonumuz artık iki görev yerine getiriyor: argümanları yorumluyor ve dosyaları okuyor. Programımız büyüdükçe, `main` fonksiyonunun üstlendiği ayrı görev sayısı artacaktır. **Bir fonksiyon sorumluluk kazandıkça, üzerinde düşünmesi zorlaşır, test edilmesi zorlaşır ve parçalarından birini bozmadan değiştirilmesi daha zor hale gelir.** En iyisi, her bir fonksiyonun bir görevden sorumlu olduğu bir işlevselliği ayırmaktır.

:::note
Bu konu, ikinci bir problemle de bağlantılıdır: 
:::

`query` ve `file_path` programımız için yapılandırma değişkenleri olmasına rağmen, `contents` gibi değişkenler programın mantığını gerçekleştirmek için kullanılır. `main` giderek uzadıkça, kapsam içine almamız gereken değişken sayısı artar; kapsamda bulunan daha fazla değişken, her birinin amacını takip etmeyi zorlaştırır. En iyisi yapılandırma değişkenlerini tek bir yapı içinde toplamak ve amaçlarını belirginleştirmektir.

Üçüncü problem, dosyayı okuma işlemi başarısız olduğunda bir hata mesajı yazdırmak için `expect` kullandık, ancak hata mesajı sadece `Dosyayı okumalıydı` yazmaktadır. **Bir dosya okumak birçok şekilde başarısız olabilir:** örneğin, dosya eksik olabilir ya da açma iznimiz olmayabilir. Şu anda, duruma bakılmaksızın her şey için aynı hata mesajını yazdırmış oluyoruz; bu da kullanıcıya herhangi bir bilgi vermiyor!

:::warning
**Dördüncü olarak, bir hatayı ele almak için `expect` kullanıyoruz ve kullanıcı programımızı yeterli argüman belirtmeden çalıştırırsa, Rust'tan `indeks sınır dışı` hatası alacaklardır; bu da problemi net bir şekilde açıklamıyor.**
:::

Tüm hata yönetim kodunun tek bir yerinde bulunması en iyi seçenek olacaktır, böylece gelecekteki bakım yapanlar bu kodla yalnızca bir yerde danışabilirler; **tüm hata yönetim kodunun tek bir yerde tutulması, son kullanıcılar için anlamlı olacak mesajlar yazdırdığımızı da garanti edecektir.**

Bu dört problemi, projemizi yeniden yapılandırarak ele alalım.

---

### İkili Projeler İçin Endişelerin Ayrılması

`main` fonksiyonuna çoklu görevlerin sorumluluğunu atama organizasyonel problemi, birçok ikili projede yaygındır. Sonuç olarak, Rust topluluğu `main` büyümeye başladığında bir ikili programın ayrı endişelerini ayırmak için kılavuzlar geliştirmiştir. **Bu sürecin şu adımları vardır:**

* Programınızı bir *main.rs* dosyasına ve bir *lib.rs* dosyasına ayırın ve programınızın mantığını *lib.rs*'ye taşıyın.
* Komut satırı ayrıştırma mantığınız küçük olduğu sürece, *main.rs* içinde kalabilir.
* Komut satırı ayrıştırma mantığı karmaşıklaşmaya başladığında, bunu *main.rs*'den çıkarın ve *lib.rs*'ye taşıyın.

Bu işlem sonrasında `main` fonksiyonunda kalacak olan sorumluluklar aşağıdaki ile sınırlı olmalıdır:

* Argüman değerleriyle komut satırı ayrıştırma mantığını çağırmak
* Diğer yapılandırmaları ayarlamak
* *lib.rs* içinde bir `run` fonksiyonunu çağırmak
* `run` bir hata döndürürse hatayı işlemek

> **Bu desen, endişelerin ayrılmasıyla ilgilidir:** *main.rs* programı çalıştırma ile ilgilenirken, *lib.rs* mevcut görevle ilgili tüm mantığı yönetir.  
> — Rust Kılavuzları

`main` fonksiyonunu doğrudan test edemeyeceğiniz için, bu yapı, programınızın mantığını *lib.rs* içindeki fonksiyonlara taşımak suretiyle test etmenizi sağlar. *main.rs* içinde kalan kod, doğruluğunu okumakla doğrulamak için yeterince küçük olacaktır. Bu süreci izleyerek programımızı yeniden yapılandıralım.

#### Argüman Ayrıştırıcısını Çıkarma

Argümanları yorumlama işlevselliğini, komut satırı ayrıştırma mantığını *src/lib.rs*'ye taşımak için `main`'in çağıracağı bir fonksiyona çıkaracağız. Listing 12-5, şu an *src/main.rs* içinde tanımlayacağımız yeni bir `parse_config` fonksiyonunu çağıran `main`'in yeni başlangıcını göstermektedir.



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-05/src/main.rs:here}}
```



Komut satırı argümanlarını bir vektörde toplamaya devam ediyoruz, ancak `main` fonksiyonu içinde indeks 1'deki argüman değerini `query` değişkenine ve indeks 2'deki argüman değerini `file_path` değişkenine atamak yerine, bütün vektörü `parse_config` fonksiyonuna iletiyoruz. **`parse_config` fonksiyonu, hangi argümanın hangi değişkende yer alacağını belirleyen mantığı bulundurur ve değerleri geri `main`'e iletir.** Hala `main` içinde `query` ve `file_path` değişkenlerini oluşturuyoruz, ancak `main` artık komut satırı argümanları ve değişkenleri arasındaki ilişkiyi belirlemekten sorumlu değildir.

:::info
Bu yeniden yapılandırma, küçük programımız için aşırı gibi görünse de, küçük ve kademeli adımlarla yeniden yapılandırma yapıyoruz. Bu değişikliği yaptıktan sonra, argüman ayrıştırmanın hala çalıştığını doğrulamak için programı tekrar çalıştırın. **İlerleme durumunuzu sık sık kontrol etmek, sorunlar ortaya çıktığında nedenini belirlemeye yardımcı olur.**
:::

#### Yapılandırma Değerlerini Gruplama

`parse_config` fonksiyonunu daha da geliştirmek için bir başka küçük adım atabiliriz. Şu anda bir demet (tuple) döndürüyoruz, ancak ardından hemen bu demeti tekrar bireysel parçalara ayırıyoruz. Bu, muhtemelen uygun soyutlamamızın henüz mevcut olmadığının bir işareti.

:::tip
**Geliştirilecek bir alan olduğunu gösteren diğer bir gösterge, `parse_config` içindeki `config` kısmıdır; bu, döndürdüğümüz iki değerin ilişkili olduğunu ve her ikisinin de bir yapılandırma değerinin parçası olduğunu ima eder.**
:::

Şu anda bu anlamı, iki değeri bir demete gruplamak dışında veri yapısının içinde iletmiyoruz; bunun yerine iki değeri bir yapı (struct) içine koyup, her bir yapı alanına anlamlı bir isim vereceğiz. Bunu yapmak, bu kodun gelecekteki bakımcılarının farklı değerlerin nasıl ilişkilendiğini ve ne amaçla kullanıldığını anlamasını kolaylaştıracaktır.

Listing 12-6, `parse_config` fonksiyonundaki iyileştirmeleri göstermektedir.



```rust,should_panic,noplayground
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-06/src/main.rs:here}}
```



`query` ve `file_path` adında alanlara sahip olan `Config` adı verilen bir yapı ekledik. `parse_config` imzası artık bir `Config` değeri döndürdüğünü belirtiliyor. **`parse_config`'in içinde, daha önceden `args` içindeki `String` değerlerine referans veren string dilimlerini döndürdüğümüz yerde, şimdi `Config`'in sahip olduğu `String` değerleri içermesini tanımlıyoruz.** `main` içindeki `args` değişkeni argüman değerlerinin sahibidir ve sadece `parse_config` fonksiyonunun onlara ödünç vermesine izin verir; bu da demektir ki, `Config` `args` içindeki değerlere sahip olmaya çalışırsa Rust'ın ödünç verme kurallarını ihlal etmiş olur.

`String` verisini yönetmenin birçok yolu vardır; en kolay, ancak biraz verimsiz olan yol, değerlerin üzerinde `clone` metodunu çağırmaktır. Bu, `Config` örneği için verilerin tam bir kopyasını alır; bu da, string verisine bir referans saklamaktan daha fazla zaman ve bellek harcar. **Ancak verileri klonlamak, referansların yaşam döngülerini yönetmek zorunda olmadığımız için kodumuzu oldukça basit hale getirir; bu durumda, biraz performans kaybı karşılığında sadelik elde etmek kabul edilebilir bir değişimdir.**

> ### `clone` Kullanmanın Dezavantajları
>
> Birçok Rust geliştiricisi, sahiplik problemlerini düzeltmek için `clone` kullanmakta tereddüt ederler çünkü bu, çalışma zamanı maliyetiyle ilişkilidir. [13. Bölümde][ch13], bu tür durumlarda daha verimli yöntemler kullanmayı öğreneceksiniz. **Ancak şu anda, ilerlemeye devam etmek için birkaç string kopyalamak kabul edilebilir çünkü bu kopyaları ancak bir kez yapacaksınız ve dosya yolunuz ile sorgu stringiniz oldukça küçüktür.**
> — Rust Geliştirme Kılavuzları

İlk seferde kodunuzu aşırı optimize etmeye çalışmaktansa, biraz verimsiz çalışan bir programa sahip olmak daha iyidir. Rust ile daha deneyimli hale geldikçe, en verimli çözümlerle başlamanız daha kolay olacak; ancak şu anda `clone` çağrısını yapmak tamamen kabul edilebilir.

`main`'i güncelleyerek `parse_config` tarafından döndürülen `Config` örneğini `config` adında bir değişkene koyduk ve daha önce ayrı `query` ve `file_path` değişkenlerini kullanan kodu, bunun yerine `Config` yapısındaki alanları kullanacak şekilde güncelledik.

:::info
**Artık kodumuz, `query` ve `file_path`'ın ilişkili olduğunu ve amacının programın nasıl çalışacağını yapılandırmak olduğunu daha net bir şekilde iletebiliyor.** Bu değerleri kullanan her kod, `config` örneğinde, amaçlarıyla adlandırılan alanlardan bulmaları gerektiğini bilir.
:::

#### `Config` için Bir Kurucu Oluşturma

Şu ana kadar, komut satırı argümanlarını ayrıştırma görevini `main`'den çıkardık ve `parse_config` fonksiyonuna koyduk. **Bunu yapmak, `query` ve `file_path` değerlerinin ilişkili olduğunu görmemizi sağladı ve bu ilişkinin kodumuzda iletilmesi gerektiğini ortaya koydu.** Sonra, `query` ve `file_path`'ın ilişkili amacını adlandırmak ve bu değerlerin adlarını `parse_config` fonksiyonundan döndürebilmek için `Config` yapısını ekledik.

Artık `parse_config` fonksiyonunun amacının bir `Config` örneği oluşturmak olduğunu bildiğimizden, `parse_config`'i sıradan bir fonksiyondan, `Config` yapısıyla ilişkili bir `new` adlı bir fonksiyona dönüştürebiliriz. **Bu değişiklik, kodun daha idiyomatik olmasını sağlayacaktır.** Standart kütüphanedeki türlerin (örneğin, `String`) örneklerini `String::new` çağrısı yaparak oluşturabiliriz; benzer şekilde, `parse_config`'i `Config` ile ilişkili bir `new` fonksiyonu haline getirerek, `Config` örneklerini `Config::new` ile oluşturabileceğiz. Listing 12-7, yapmamız gereken değişiklikleri göstermektedir.



```rust,should_panic,noplayground
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-07/src/main.rs:here}}
```



`parse_config`'i çağırdığımız `main`'i güncelleyerek, bunun yerine `Config::new` çağırıyoruz. **`parse_config`'in adını `new` olarak değiştirdik ve bunu `new` fonksiyonunu `Config` ile ilişkilendiren bir `impl` bloğu içine taşıdık.** Bu kodun yine çalıştığını derlemeyi deneyin.

### Hata Yönetimini Düzeltme

Artık hata yönetimimizi düzeltmeye çalışacağız. `args` içindeki 1. veya 2. indekslerdeki değerlere erişmeye çalışmak, vektör üçten az öğe içeriyorsa programın paniklemesine neden olacaktır. **Herhangi bir argüman olmadan programı çalıştırmayı deneyin; bu şöyle görünür:**

```console
{{#include ../listings/ch12-an-io-project/listing-12-07/output.txt}}
```

`indeks sınır dışı: uzunluk 1 ama indeks 1` satırı, programcılar için tasarlanmış bir hata mesajıdır. Bu, son kullanıcılarımızın ne yapmaları gerektiğini anlamalarına yardımcı olmayacaktır. Şimdi bunu düzeltelim.

#### Hata Mesajını İyileştirme

Listing 12-8'de, indeks 1 ve indeks 2'ye erişmeden önce dilimin yeterince uzun olduğunu doğrulayan bir kontrol ekliyoruz. **Dilim yeterince uzun değilse, program panikler ve daha iyi bir hata mesajı görüntüler.**



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-08/src/main.rs:here}}
```



Bu kod, Listing 9-13'te yazdığımız `Guess::new` fonksiyonuna benzer[9][ch9-custom-types], burada `value` argümanı geçerli değerler aralığının dışında olduğunda `panic!` çağrısında bulunmuştuk. **Burada geçerli değerler aralığı kontrol etmek yerine, `args` uzunluğunun en az `3` olduğunu kontrol ediyoruz ve fonksiyonun geri kalan kısmı bu koşulun sağlandığı varsayımı altında işleyecek.** Eğer `args`, üçten az öğe içeriyorsa, bu koşul `true` olacaktır ve programı hemen sonlandırmak için `panic!` makrosunu çağırıyoruz.

`new` içindeki bu birkaç ekstra satır ile, programı yine herhangi bir argüman olmadan çalıştırmayı deneyelim ve şimdi hatanın nasıl göründüğüne bakalım:

```console
{{#include ../listings/ch12-an-io-project/listing-12-08/output.txt}}
```

Bu çıktı daha iyi: şimdi makul bir hata mesajımız var. Ancak, kullanıcılara vermek istemediğimiz gereksiz bilgiler de var. **Belki Listing 9-13'te kullandığımız teknik burada en iyi seçim değildir:** `panic!` çağrısı, bir programlama problemi için daha uygundur, kullanım problemi için değil. [9. Bölümde][ch9-error-guidelines] tartışıldığı gibi, bunun yerine üzerinde konuştuğunuz diğer teknik kullanılan ifade mümkün olan bir `Result` döndürmek olacaktır[9][ch9-result]; bu, ya başarı ya da hata olarak tanımlanabilir.

---

#### `panic!` Çağırmak Yerine `Result` Döndürmek

Bunun yerine, başarılı durumda bir `Config` örneği ve hata durumunda problemi tanımlayan bir `Result` değeri döndürebiliriz. Ayrıca, `new` fonksiyon adını `build` olarak değiştireceğiz çünkü birçok programcı `new` fonksiyonlarının asla başarısız olmalarını bekler. **`Config::build` `main` ile iletişim kurduğunda, sorun olduğuna işaret etmek için `Result` türünü kullanabiliriz.** Ardından, `main`'i `Err` varyantını kullanıcılar için daha pratik bir hata mesajına dönüştürmek için değiştirebiliriz; böylece `thread 'main'` ve `RUST_BACKTRACE` gibi `panic!` çağrısının oluşturduğu etrafındaki metinler ortadan kalkacaktır.

Listing 12-9, artık `Config::build` olarak adlandırdığımız fonksiyonun dönüş değerinde yapmamız gereken değişiklikleri ve `Result` döndürmek için gerekli olan fonksiyonun gövdesini göstermektedir. Bu, `main`'i de güncellemediğimiz sürece derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-09/src/main.rs:here}}
```



`build` fonksiyonumuz, başarı durumunda bir `Config` örneği ve hata durumunda bir string literal içeren bir `Result` döndürür. **Hata değerlerimiz her zaman `'static` ömrüne sahip string literaller olacaktır.**

Fonksiyon gövdesinde iki değişiklik yaptık: kullanıcı yeterli argüman geçmediğinde `panic!` çağırmak yerine, artık bir `Err` değeri döndürüyoruz ve `Ok` ile `Config` döndürme değerini sarmaladık. **Bu değişimler, fonksiyonun yeni tür imzasına uyum sağlamasını sağlamaktadır.**

`Config::build`'den bir `Err` değeri döndürmek, `main` fonksiyonuna, `build` fonksiyonundan döndürülen `Result` değerini ele alacak ve hata durumunda süreci daha temiz bir şekilde sonlandırmasına olanak tanır.

---

#### `Config::build`'i Çağırmak ve Hataları Ele Almak

Hata durumunu ele almak ve kullanıcı dostu bir mesaj yazdırmak için, `main`'i `Config::build` tarafından döndürülen `Result` değerini ele alacak şekilde güncellememiz gerekecek; bu, Listing 12-10'da gösterildiği gibi. **Ayrıca, komut satırı aracının sıfırdan farklı bir hata kodu ile çıkma sorumluluğunu `panic!`'den alıp buna manuel olarak gerçekleştireceğiz.** Sıfırdan farklı bir çıkış durumu, programımızın hata durumu ile çıktığını belirtmek için bir gelenektir.



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-10/src/main.rs:here}}
```



Bu listedeki kod, henüz ayrıntılı olarak ele almadığımız bir yöntemi içermektedir: `unwrap_or_else`, bu yöntem `Result` üzerine standart kütüphane tarafından tanımlanmıştır. **`unwrap_or_else` kullanmak, özel bir `panic!` dışı hata yönetimi tanımlamamıza olanak sağlar.** `Result` bir `Ok` değeri ise, bu yöntem davranışı `unwrap` ile benzerdir: `Ok`'ın sarmaladığı iç değeri döndürür. Ancak, değer bir `Err` değeri ise, bu yöntem, argüman olarak geçirdiğimiz kapsayıcıdaki kodu çağırır; bu kod, hata durumunda çalışacak olan anonim bir fonksiyondur. **Kapsayıcıyı daha ayrıntılı inceleyeceğiz [13. Bölümde][ch13].** Şimdilik `unwrap_or_else`'in `Err` iç değerini, bu durumda Listing 12-9'da eklediğimiz statik string olan `"yeterli argüman yok"` değerini, `err` argümanına geçeceğini bilmeniz yeterlidir. Kapsayıcıdaki kod, çalıştığında `err` değerini kullanabilir.

Yeni bir `use` satırı ekleyerek `process`'i standart kütüphaneden kapsam içine aldık. **Hata durumunda çalışacak olan kapsayıcıdaki kod, yalnızca iki satırdır:** `err` değerini yazdırıyoruz ve ardından `process::exit` çağırıyoruz. **`process::exit` fonksiyonu programı derhal durduracak ve çıkış durumu olarak belirttiğimiz sayıyı döndürecektir.** Bu, Listing 12-8'de kullandığımız `panic!`-temelli yönetimle benzerlik göstermektedir; ancak artık tüm ekstra çıktıyı almayacağız. Hadi deneyelim:

```console
{{#include ../listings/ch12-an-io-project/listing-12-10/output.txt}}
```

Harika! Bu çıktı kullanıcılarımız için çok daha dostça.

### `main`'den Mantığı Çıkarma

Artık yapılandırma ayrıştırmasını yeniden yapılandırmayı bitirdiğimize göre, programın mantığına dönelim. Yukarıda bahsedildiği gibi`“İkili Projeler İçin Endişelerin Ayrılması”`, `main` fonksiyonunda yapılandırmayla veya hata yönetimiyle ilgili olmayan tüm mantığı tutacak bir `run` fonksiyonu çıkarmayı planlıyoruz. **İşim bittiğinde `main`, iç gözlemle doğrulaması kolay ve özlü olacak ve tüm diğer mantık için test yazabileceğiz.**

Listing 12-11, çıkarılan `run` fonksiyonunu göstermektedir. Şu an için yalnızca fonksiyonu çıkarmanın küçük, kademeli iyileştirmesini yapıyoruz. Fonksiyonu hâlâ *src/main.rs* içinde tanımlıyoruz.



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-11/src/main.rs:here}}
```



**`run` fonksiyonu artık `main`'den okuma işlemi ile başlayan tüm geri kalan mantığı içermektedir.** `run` fonksiyonu, `Config` örneğini argüman olarak alır.

#### `run` Fonksiyonundan Hata Döndürme

Kalan program mantığı `run` fonksiyonuna ayrıldığında, `Config::build` ile yaptığımız gibi hata yönetimini geliştirebiliriz. Programın `expect` çağrısı yaparak panik yapmasını sağlamak yerine, `run` fonksiyonu bir şeyler ters gittiğinde `Result` döndürecektir. Bu, hata yönetimine dair mantığı `main` içinde kullanıcı dostu bir şekilde daha da konsolide etmemize olanak tanıyacak. 

:::tip
Değişiklikleri göstermek için 12-12 numaralı listedeki imzaya ve `run` fonksiyonunun gövdesine gereken değişiklikleri yaptık.
:::



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-12/src/main.rs:here}}
```



Burada üç önemli değişiklik yaptık. İlk olarak, `run` fonksiyonunun dönüş tipini `Result>` olarak değiştirdik. Bu fonksiyon daha önceden birim tipini, `()`, döndürüyordu ve bu değeri `Ok` durumunda geri döndürmeye devam ediyoruz.

:::info
Hata tipi için *trait nesnesi* olan `Box` kullandık (ve `std::error::Error`'ı en üstteki bir `use` deklarasyonu ile kapsamımıza aldık). Trait nesnelerini [Bölüm 18][ch18]'de ele alacağız. 
:::

İkincisi, hata durumunda `panic!` yerine `?` operatörünü kullanarak `expect` çağrısını kaldırdık. [Bölüm 9][ch9-question-mark]'de konuştuğumuz gibi. 

> `panic!` yerine `?` kullanmak, mevcut fonksiyondan hata değerini döndürecektir, bu da çağıran tarafından yönetilecektir. 
> — Dökümantasyon

Üçüncüsü, `run` fonksiyonu artık başarı durumunda bir `Ok` değeri döndürüyor.

:::note
`run` fonksiyonunun başarı tipini imzada `()` olarak belirledik, bu da birim tip değerini `Ok` değeri içinde sarmamız gerektiği anlamına geliyor. Bu `Ok(())` sözdizimi başlangıçta biraz garip görünse de, böyle kullanmak `run` fonksiyonunu yalnızca yan etkileri için çağırdığımızı belirtmenin deyimsel yoludur; döndürdüğü bir değer yok.
:::

Bu kodu çalıştırdığınızda, derlenecek ancak bir uyarı gösterecektir:

```console
{{#include ../listings/ch12-an-io-project/listing-12-12/output.txt}}
```

Rust, kodumuzun `Result` değerini göz ardı ettiğini ve bu `Result` değerinin bir hata meydana geldiğini gösterebileceğini söyler. Ancak bir hata olup olmadığını kontrol etmiyoruz ve derleyici burada bazı hata yönetim kodları eklemeyi kastettiğimizi hatırlatıyor! Şimdi bu sorunu güncelleyelim.

#### `main` İçinde `run`'dan Dönen Hataları Yönetme

Hata kontrolü yapacağız ve bunu, 12-10 numaralı listede `Config::build` ile kullandığımız benzer bir teknik ile ele alacağız, ancak ufak bir farklılık ile:

Dosya Adı: src/main.rs

```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/no-listing-01-handling-errors-in-main/src/main.rs:here}}
```

:::warning
`run`'ın bir `Err` değeri döndürüp döndürmediğini kontrol etmek ve dönerse `process::exit(1)` çağırmak için `if let` kullanıyoruz. 
:::

`run` fonksiyonu, `Config::build`'in `Config` örneğini döndürdüğü gibi `unwrap` etmek istediğimiz bir değer döndürmüyor. Çünkü `run`, başarı durumunda `()` döndürüyor, bu nedenle sadece bir hata tespit etme ile ilgileniyoruz; bu yüzden `unwrap_or_else`'in sarmalanmış değeri döndürmesine gerek yok, bu yalnızca `()` olacaktı.

Her iki durumda da `if let` ve `unwrap_or_else` fonksiyonlarının gövdeleri aynıdır: hatayı yazdırıyoruz ve çıkıyoruz.

---

### Kodu Bir Kütüphane Krate'ine Ayırma

`minigrep` projemiz şu ana kadar iyi görünüyor! Şimdi *src/main.rs* dosyasını ayıracağız ve bazı kodları *src/lib.rs* dosyasına koyacağız. Böylece kodu test edebilir ve daha az sorumluluk ile bir *src/main.rs* dosyası edinebiliriz.

:::tip
`main` fonksiyonu içinde bulunmayan tüm kodları *src/main.rs*'dan *src/lib.rs*'ya taşımalıyız:
:::

* `run` fonksiyonu tanımı
* İlgili `use` deklarasyonları
* `Config` tanımı
* `Config::build` fonksiyonu tanımı

*src/lib.rs*'in içerikleri, kısalık nedeniyle fonksiyonların gövdelerini hariç tutarak, 12-13 numaralı listedeki imzalara sahip olmalıdır. Bu, 12-14 numaralı listedeki *src/main.rs* dosyasını değiştirmeden derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-13/src/lib.rs:here}}
```



:::note
`pub` anahtar kelimesini cömertçe kullandık: `Config`, alanları ve `build` metodu üzerinde ve `run` fonksiyonu üzerinde. Artık test edebileceğimiz kamuya açık bir API'ye sahip bir kütüphane krate'imiz var!
:::

Şimdi *src/lib.rs*'da hareket ettirdiğimiz kodu *src/main.rs* içindeki ikili krate'in kapsamına almak gerekiyor, bu 12-14 numaralı listedekine benzer bir şekilde.



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-14/src/main.rs:here}}
```



`Config` türünü kütüphane krate'indan ikili krate'in kapsamına almak için `use minigrep::Config` satırını ekliyoruz ve `run` fonksiyonunu krate adımızla önekliyoruz. 

:::danger
Şimdi tüm işlevsellik bağlantılı olmalı ve çalışmalıdır. Programı `cargo run` ile çalıştırın ve her şeyin doğru çalıştığından emin olun.
:::

Uff! Bu çok işti, ama kendimizi gelecekte başarıya ulaşmaya hazırladık. Artık hataları yönetmek çok daha kolay ve kodumuzu daha modüler hale getirdik. Bundan sonra işimizin çoğunu *src/lib.rs* içinde yapacağız.

Eski kod ile zor olacak ama yeni kod ile kolay olacak bu yeni modülerlikten faydalanalım: bazı testler yazalım! 

[ch13]: ch13-00-functional-features.html
[ch9-custom-types]: ch09-03-to-panic-or-not-to-panic.html#creating-custom-types-for-validation
[ch9-error-guidelines]: ch09-03-to-panic-or-not-to-panic.html#guidelines-for-error-handling
[ch9-result]: ch09-02-recoverable-errors-with-result.html
[ch18]: ch18-00-oop.html
[ch9-question-mark]: ch09-02-recoverable-errors-with-result.html#a-shortcut-for-propagating-errors-the--operator