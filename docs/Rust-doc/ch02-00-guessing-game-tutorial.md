# Tahmin Oyunu Programlama

Hadi Rust’a birlikte pratik bir proje ile giriş yapalım! Bu bölüm, Rust'un birkaç yaygın kavramını gerçek bir programda nasıl kullanacağınızı göstererek sizlere tanıtacaktır. `let`, `match`, yöntemler, ilişkilendirilmiş fonksiyonlar, harici kütüphaneler ve daha fazlası hakkında bilgi edineceksiniz! Bundan sonraki bölümlerde, bu fikirleri daha ayrıntılı bir şekilde inceleyeceğiz. Bu bölümde sadece temel bilgileri pratik yapacaksınız.

Klasik bir başlangıç programlama problemini uygulayacağız: bir tahmin oyunu. İşleyişi şöyle: program 1 ile 100 arasında rastgele bir tamsayı üretecek. Daha sonra, oyuncudan bir tahminde bulunması için istek yapacak. Bir tahminde bulunulduktan sonra, program tahminin çok düşük mü yoksa çok yüksek mi olduğunu belirtecek. Tahmin doğruysa, oyun bir tebrik mesajı baskılayacak ve çıkacak.

## Yeni Bir Proje Kurma

Yeni bir proje kurmak için, Bölüm 1'de oluşturduğunuz *projects* dizinine gidin ve Cargo kullanarak yeni bir proje oluşturun:

```console
$ cargo new guessing_game
$ cd guessing_game
```

İlk komut olan `cargo new`, projenin adını (`guessing_game`) ilk argüman olarak alır. İkinci komut ise yeni projenin dizinine geçer.

Oluşturulan *Cargo.toml* dosyasına bakın:

Dosya Adı: Cargo.toml

```toml
{{#include ../listings/ch02-guessing-game-tutorial/no-listing-01-cargo-new/Cargo.toml}}
```

Bölüm 1'de gördüğünüz gibi, `cargo new` sizin için bir "Merhaba, dünya!" programı üretir. *src/main.rs* dosyasına göz atın:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/no-listing-01-cargo-new/src/main.rs}}
```

Şimdi bu "Merhaba, dünya!" programını derleyip `cargo run` komutunu kullanarak aynı adımda çalıştıralım:

```console
{{#include ../listings/ch02-guessing-game-tutorial/no-listing-01-cargo-new/output.txt}}
```

`run` komutu, projede hızlı bir şekilde iterasyon yapmanız gerektiğinde, bu oyunda olduğu gibi, her iterasyonu hızlıca test edip bir sonraki aşamaya geçmeden önce oldukça işe yarar.

*src/main.rs* dosyasını yeniden açın. Tüm kodu bu dosyaya yazacaksınız.

## Bir Tahminin İşlenmesi

Tahmin oyunu programının ilk kısmı kullanıcı girişi isteyecek, bu girişi işleyecek ve beklenen biçimde olup olmadığını kontrol edecektir. Başlamak için, oyuncunun bir tahminde bulunmasına izin vereceğiz. *src/main.rs* dosyasına Liste 2-1'deki kodu girin.



```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:all}}
```



Bu kodda oldukça fazla bilgi yer alıyor, bu yüzden satır satır üzerinden geçelim. Kullanıcı girişi almak ve sonucu çıktı olarak yazdırmak için, `io` girdi/çıktı kütüphanesini kapsam içine almamız gerekiyor. `io` kütüphanesi, standart kütüphaneden, yani `std`'den gelir:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:io}}
```

Rust, her programın kapsamına getirdiği standart kütüphanede tanımlı bir dizi öğeye sahiptir. Bu dizi *prelude* olarak adlandırılır ve içindekilerin hepsini [standart kütüphane dokümantasyonunda][prelude] görebilirsiniz.

Kullanmak istediğiniz bir tür eğer prelude içinde yoksa, o türü bir `use` ifadesi ile kapsam içine almanız gerekir. `std::io` kütüphanesini kullanmak, kullanıcı girişini kabul etme dahil birçok yararlı özellik sağlar.

Bölüm 1'de gördüğünüz gibi, `main` fonksiyonu programın giriş noktasıdır:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:main}}
```

`fn` sözdizimi yeni bir fonksiyon bildirir; parantezler, `()` hiç parametre olmadığını gösterir; ve süslü parantez `{`, fonksiyonun gövdesini başlatır.

Yine Bölüm 1'de öğrendiğiniz gibi, `println!` bir dizeyi ekran görüntülemesini sağlayan bir makrodur:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:print}}
```

Bu kod, oyunun ne olduğunu belirten bir istem yazdırmakta ve kullanıcıdan girdi istemekte.

### Değerleri Değişkenlerle Saklama

Sonraki adımda, kullanıcı girdiğini saklamak için bir *değişken* oluşturacağız:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:string}}
```

Artık program ilginç hale geliyor! Bu kısa satırda birçok şey var. Değişken yaratmak için `let` ifadesini kullanıyoruz. İşte başka bir örnek:

```rust,ignore
let apples = 5;
```

Bu satır, `apples` adında yeni bir değişken oluşturur ve onu 5 değerine bağlar. Rust'ta, değişkenler varsayılan olarak değişmezdir, yani bir değişkene bir değer verdiğimizde, o değer değişmez. Bu kavramı [“Değişkenler ve Değişkenlik”][variables-and-mutability] bölümünde detaylı olarak ele alacağız. Bir değişkeni değiştirilebilir hale getirmek için, değişken adının önüne `mut` ekleriz:

```rust,ignore
let apples = 5; // değişmez
let mut bananas = 5; // değiştirilebilir
```

> **Not:** `//` sözdizimi, satırın sonuna kadar devam eden bir yorum başlatır. Rust, yorumların içindeki her şeyi görmezden gelir. Yorumları daha detaylı olarak [Bölüm 3][comments]'te anlatacağız.

Tahmin oyunu programına geri dönersek, artık `let mut guess` ifadesinin, `guess` adında bir değiştirilebilir değişken tanımlayacağını biliyorsunuz. Eşittir işareti (`=`), Rust’a o değişkenine şu an bir şey bağlamak istediğimizi gösterir. Eşittir işaretinin sağında, `guess`'in bağlı olduğu değer vardır; bu değer `String::new` fonksiyonunun sonucudur, bu fonksiyon yeni bir `String` örneği döner. [`String`][string], standart kütüphane tarafından sağlanan, büyüyebilen, UTF-8 kodlu bir metin türüdür.

`::` sözdizimi, `::new` satırında `new`nin `String` türünün ilişkilendirilmiş bir fonksiyonu olduğunu gösterir. *İlişkilendirilmiş bir fonksiyon*, bir tür üzerinde uygulanan bir fonksiyondur; bu durumda `String` üzerindedir. Bu `new` fonksiyonu, yeni, boş bir dize oluşturur. Birçok türde, yeni bir değer üreten fonksiyonlar için kullanılan yaygın bir isim olduğundan, birçok türde `new` fonksiyonu bulacaksınız.

Tam olarak, `let mut guess = String::new();` satırı, şu an yeni, boş bir `String` örneğine bağlı olan bir değiştirilebilir değişken oluşturmuştur. Ah!

### Kullanıcı Girişini Alma

Programın ilk satırında `use std::io;` ile standart kütüphaneden girdi/çıktı işlevselliğini dahil ettiğimizi hatırlayın. Şimdi, kullanıcı girişini yönetmemize olanak tanıyan `io` modülünden `stdin` fonksiyonunu çağıracağız:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:read}}
```

Eğer programın başında `use std::io;` ile `io` kütüphanesini dahil etmemiş olsaydık, fonksiyonu `std::io::stdin` olarak yazarak da kullanabilirdik. `stdin` fonksiyonu, terminaliniz için standart girdi birimine bir tutamaç türünü temsil eden [`std::io::Stdin`][iostdin] örneği döner.

Sonraki satırda `.read_line(&mut guess)` ifadesi, kullanıcıdan giriş almak için standart giriş tutamaçları üzerinde [`read_line`][read_line] yöntemini çağırmaktadır. Ayrıca, hangi dizeye kullanıcı girişini saklayacağını bildirmek için, `guess`'i argüman olarak `&mut` ile geçiriyoruz. `read_line`'in tam görevi, kullanıcının standart girdiye yazdığı her şeyi alıp, dizeye eklemek (içeriğini yazmadan) olduğundan, bu nedenle o dizeyi argüman olarak geçiyoruz. Dize argümanı değiştirilebilir olmalıdır ki metod, dizenin içeriğini değiştirebilsin.

`&`, bu argümanın bir *referans* olduğunu gösterir; bu da kodunuzun bir parçasının bir veri parçasına birden fazla yerden erişmesine olanak tanır, bu işlemi bellekte kopyalamadan gerçekleştirebilir. Referanslar karmaşık bir özelliktir ve Rust'ın büyük avantajlarından biri, referansları kullanmanın ne kadar güvenli ve kolay olduğudur. Bu programı bitirmek için bu ayrıntıların çoğunu bilmenize gerek yok. Şu anda bilmeniz gereken, değişkenler gibi referansların da varsayılan olarak değişmez olduğudur. Bu nedenle, değiştirilebilir hale getirmek için `&guess` yerine `&mut guess` yazmanız gerekir. (Bölüm 4, referansları daha ayrıntılı bir şekilde açıklayacak.)

### `Result` ile Olası Hataları Yönetme

Henüz bu kod satırında çalışmaya devam ediyoruz. Üçüncü bir metin satırını tartışıyoruz, ancak bunun hala tek bir mantıksal kod satırının parçası olduğunu unutmayın. Sonraki kısım şu yöntemdir:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:expect}}
```

Bu kodu şu şekilde yazabilirdik:

```rust,ignore
io::stdin().read_line(&mut guess).expect("Satır okunamadı");
```

Ancak, uzun bir çizgi okumak zordur, bu nedenle bölersek daha iyidir. `.method_name()` sözdizimini kullanarak bir metodu çağırdığınızda, uzun satırları bölmek için yeni bir satır ve diğer boşlukları tanıtmak genellikle akıllıca bir fikirdir. Şimdi bu satırın ne yaptığını tartışalım.

Daha önce belirtilen `read_line`, kullanıcıdan girdi alıp, ona geçirdiğimiz dizede saklarken, aynı zamanda bir `Result` değeri döndürür. [`Result`][result] türü, birden fazla olası durumda olabilen bir tür olan, sıklıkla *enum* olarak adlandırılan bir *enumeration*dır; her olası duruma *varyant* denir.

> :::note
> [Chapter 6][enums] Enumlar hakkında daha ayrıntılı bilgi verecektir.
> :::

`Result` türlerinin amacı, hata yönetimi bilgisini kodlamaktır.

`Result` türünün varyantları `Ok` ve `Err`dir. `Ok` varyantı işlemin başarılı olduğunu, `Ok` içinde ise başarılı bir şekilde üretilen değeri ifade eder. `Err` varyantı ise, işlemin başarısız olduğunu ve `Err`'nin işlemin neden veya nasıl başarısız olduğuna dair bilgi içerdiğini gösterir.

`Result` türünün değerleri, her türün değerleri gibi, üzerinde tanımlı metotlara sahiptir. `Result` örneğinde bir [`expect` metodu][expect] bulunmaktadır. Bu örnek `Result` bir `Err` değeri ise, `expect`, programın çökmesine neden olacak ve parametre olarak geçirdiğiniz mesajı gösterecektir. `read_line` metodu bir `Err` değeri dönerse, bu muhtemelen altyapıdan gelen bir hata sonucu olacaktır. Eğer bu örnek `Result` bir `Ok` değeri ise, `expect`, `Ok`'nin tuttuğu döndürme değerini alacak ve sadece o değeri kullanmak için size verecektir. Bu durumda, o değer kullanıcının girişi ile ilgili olan bayt sayısıdır.

`expect` çağırmazsanız, program derlenecek, ancak bir uyarı alacaksınız:

```console
{{#include ../listings/ch02-guessing-game-tutorial/no-listing-02-without-expect/output.txt}}
```

Rust, `read_line`'den dönen `Result` değerini kullanmadığınız konusunda uyarır ve bunun sonucunda programınızın olası bir hatayı ele almadığını gösterir.

Uyarıyı bastırmanın doğru yolu, gerçekten hata yönetimi kodu yazmak olsa da, bizim durumumuzda, bir sorun oluştuğunda bu programı çökertmek istediğimiz için `expect` kullanabiliriz. Hatalardan kurtulmayı [Bölüm 9][recover]'da öğreneceksiniz.

### Değerleri `println!` Yer Tutucuları ile Yazdırma

Kapanış süslü parantezinden başka, şimdiye kadar kodda tartışacak başka yalnızca bir satır var:

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-01/src/main.rs:print_guess}}
```

Bu satır, artık kullanıcının girişini içeren dizeyi yazdırır. `{}` süslü parantezler bir yer tutucudur: `{}`'yi bir değeri yerinde tutan küçük yengeç pençeleri olarak düşünün. Bir değişkenin değerini yazdırırken, değişken adı süslü parantezlerin içine girebilir. Bir ifadenin sonucunu yazdırırken, format dizesinde boş süslü parantezleri koyarsınız, ardından format dizesini, her boş süslü parantez yer tutucusunda yazdırmak için sıralı bir ifadeler listesi ile takip edersiniz. Hem değişkeni hem de bir ifadeyi `println!` ile tek bir çağrıda yazdırmak, şu şekilde görünür:

```rust
let x = 5;
let y = 10;

println!("x = {x} ve y + 2 = {}", y + 2);
```

Bu kod, `x = 5 ve y + 2 = 12` yazdırır.

### İlk Kısmı Test Etmek

Hadi tahmin oyununun ilk kısmını test edelim. `cargo run` kullanarak çalıştırın:



```console
$ cargo run
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 6.44s
     Running `target/debug/guessing_game`
Tahmin et!
Lütfen tahmininizi girin.
6
Tahmininiz: 6
```

Bu noktada, oyunun ilk kısmını tamamladık: klavye üzerinden giriş alıyoruz ve daha sonra bunu yazdırıyoruz.

---

## Gizli Bir Sayı Üretme

Ardından, kullanıcının tahmin etmeye çalışacağı gizli bir sayı oluşturmamız gerekiyor. Gizli numara her seferinde farklı olmalı, böylece oyun birden fazla kez oynanabilir olmak zorundadır. Oyunun çok zor olmaması için 1 ile 100 arasında rastgele bir sayı kullanacağız. Rust, henüz standart kütüphanesinde rastgele sayı işlevselliği sunmamaktadır. Ancak, Rust takımı bu işlevselliği sağlayan bir [`rand` kütüphanesi][randcrate] sunmaktadır.

### Daha Fazla İşlevsellik Almak İçin Bir Kütüphane Kullanma

Bir kütüphanenin, Rust kaynak kodu dosyaları koleksiyonu olduğunu unutmayın. İnşa ettiğimiz proje bir *ikili kütüphane*, yani bir yürütülebilir dosyadır. `rand` kütüphanesi ise, diğer programlarda kullanılmak üzere tasarlanmış kodları içeren bir *kütüphane kütüphanesidir* ve kendi başına çalıştırılamaz.

Cargo'nun harici kütüphaneleri koordine etmedeki başarısı gerçekten göz önünde bulundurulmaya değerdir. `rand` kullanacak kodlar yazmadan önce, `Cargo.toml` dosyasını `rand` kütüphanesini bağımlılık olarak içerecek şekilde değiştirmemiz gerekiyor. Şimdi o dosyayı açın ve aşağıdaki satırı, Cargo'nun sizin için oluşturduğu `[dependencies]` bölüm başlığının altında en alta ekleyin. Burada `rand`'i tam olarak bizim yazdığımız gibi, bu sürüm numarasını belirterek belirtin, aksi takdirde bu kılavuzdaki kod örnekleri çalışmayabilir:

> :::warning
> `rand` sürümünü güncellerken aşağıdaki dosyalarda kullanılan `rand` sürümünü güncellemeyi unutmayın:
> * ch07-04-yolları-kapsamda-almak-icin-use-kelimesi.md
> * ch14-03-cargo-workspaces.md
> :::

Dosya Adı: Cargo.toml

```toml
{{#include ../listings/ch02-guessing-game-tutorial/listing-02-02/Cargo.toml:8:}}
```

*Cargo.toml* dosyasında, bir başlıktan sonra gelen her şey, başka bir bölüm başlamadığı sürece o bölümün bir parçasıdır. `[dependencies]` bölümünde, Cargo'ya projenizin hangi harici kütüphanelere bağımlı olduğunu ve bu kütüphanelerin hangi sürümlerini talep ettiğinizi söyleriz. Bu durumda, `rand` kütüphanesini `0.8.5` sürüm varsayılan belirleyicisi ile belirtiriz. Cargo, [Sözdizimsel Sürüm Belirleme][semver] standartına (bazen *SemVer* olarak adlandırılır) uyar ve bu sürüm numaralarının yazılma biçimidir. `0.8.5` belirleyicisi aslında `^0.8.5` kısaltmasıdır; bu, en az 0.8.5 olan ancak 0.9.0'dan daha düşük herhangi bir sürümü ifade eder.

Cargo, standart API'lerle uyumlu 0.8.5 sürümü ile, bu belirleyici ile birlikte bu sürümle birlikte en son yamayı alırsınız ve bu bölümdeki kodla hala derlenebilir. 0.9.0 veya daha büyük sürümlerin aynı API'yi sağlama garantisi yoktur.

Şimdi, kodun hiçbirini değiştirmeden projeyi, Liste 2-2'de gösterildiği gibi oluşturalım.





```console
$ cargo build
    Yeni sürüm indexini güncelleyip
     16 paketi en son uyumlu sürümlere kilitlemek
      wasi v0.11.0+wasi-snapshot-preview1 (en son: v0.13.3+wasi-0.2.2) ekleniyor
      zerocopy v0.7.35 (en son: v0.8.9) ekleniyor
      zerocopy-derive v0.7.35 (en son: v0.8.9) ekleniyor
  syn v2.0.87 indirildi
  1 kütüphane (278.1 KB) 0.16s içinde indirildi
   proc-macro2 v1.0.89 derleniyor
   unicode-ident v1.0.13 derleniyor
   libc v0.2.161 derleniyor
   cfg-if v1.0.0 derleniyor
   byteorder v1.5.0 derleniyor
   getrandom v0.2.15 derleniyor
   rand_core v0.6.4 derleniyor
   quote v1.0.37 derleniyor
   syn v2.0.87 derleniyor
   zerocopy-derive v0.7.35 derleniyor
   zerocopy v0.7.35 derleniyor
   ppv-lite86 v0.2.20 derleniyor
   rand_chacha v0.3.1 derleniyor
   rand v0.8.5 derleniyor
   guessing_game v0.1.0 (file:///projects/guessing_game) derleniyor
    `dev` profili [optimize edilmemiş + debuginfo] hedeflerinde bitti (süre: 3.69s)
```



Farklı sürüm numaraları görebilirsiniz (ancak bunların hepsi kod ile uyumlu olacaktır, SemVer sayesinde!) ve farklı satırlar (işletim sistemine bağlı olarak) olabilir ve satırlar farklı bir sırada görünebilir.

Harici bir bağımlılık eklediğimizde, Cargo en son sürümleri, *kayit* adı verilen bir kütüphaneden, [Crates.io][cratesio]'dan çağırır. Crates.io, Rust ekosistemindeki insanlar tarafından açık kaynaklı Rust projelerinin diğerlerinin kullanımına sunulması için bir platformdur.

Kayıt güncellendikten sonra, Cargo `[dependencies]` bölümünü kontrol eder ve daha önceden indirilmemiş olan herhangi bir kütüphaneyi indirir. Bu durumda, yalnızca `rand`'i bağımlılık olarak listelememize rağmen, Cargo çalışması için `rand`in ihtiyaç duyduğu diğer kütüphaneleri de aldı. Kütüphaneleri indirdikten sonra, Rust bunları derler ve ardından bağımlılıkların mevcut olduğu projeyi derler.

Eğer hemen `cargo build` komutunu tekrar çalıştırırsanız ve herhangi bir değişiklik yapmazsanız, yalnızca `Finished` satırını alırsınız. Cargo, bağımlılıkları halihazırda indirdiğini ve derlediğini biliyor, ayrıca bunlar hakkında *Cargo.toml* dosyanızda hiçbir şey değiştirmediğinizi de biliyor. Cargo ayrıca, kodunuz hakkında da hiçbir şey değiştirmediğinizi bilir, bu nedenle onu yeniden derlemez. Yapacak hiçbir şeyi olmadığından, basitçe çıkıyor.

Eğer *src/main.rs* dosyasını açıp, gereksiz bir değişiklik yapar ve ardından tekrar derlerseniz, yalnızca iki satırlık çıktıyı göreceksiniz:



```console
$ cargo build
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    `dev` profili [optimize edilmemiş + debuginfo] hedeflerinde bitti (süre: 0.13s)
```

Bu satırlar, Cargo'nun yalnızca *src/main.rs* dosyasında yaptığınız küçük değişiklikle derlemeyi güncellediğini gösterir. Bağımlılıklarınız değişmediğinden, Cargo, onlarla ilgili olarak daha önce indirdiği ve derlediği kaynakları yeniden kullanabileceğini bilir.

---

### *Cargo.lock* Dosyası ile Yeniden Üretilebilir Derlemelere Garanti Verme

Cargo, kodunuzu siz veya başka biri her derlediğinde aynı çıktıyı yeniden oluşturabileceğinizi sağlamak için bir mekanizmaya sahiptir: Cargo yalnızca belirttiğiniz bağımlılıkların sürümlerini kullanacaktır, aksi takdirde başka bir şey belirtemezsiniz. Örneğin, gelecek hafta `rand` kütüphanesinin 0.8.6 sürümü piyasaya çıkarsa ve bu sürüm önemli bir hata düzeltmesi içeriyorsa, ancak aynı zamanda kodunuzu bozacak bir gerileme içeriyorsa, Rust, ilk kez `cargo build` çalıştırdığınızda *Cargo.lock* dosyasını oluşturur, bu nedenle şimdi *guessing_game* dizininde bu dosya var.

Bir projeyi ilk kez oluşturduğunuzda, Cargo, tüm bağımlılıkların uygun sürümlerini belirleyip, bunu *Cargo.lock* dosyasına yazar. Gelecekte projenizi oluşturduğunuzda, Cargo, *Cargo.lock* dosyasının var olduğunu görecek ve bu dosyada belirtilen sürümleri kullanacaktır; böylelikle yeniden ölçeklenen sürümlere yeniden zorluk çıkarma işinden kaçınarak. Bu, projenizin her zaman 0.8.5'te kalmasını sağlar, ta ki siz açıkça yükseltmeye karar verene kadar. *Cargo.lock* dosyası, yeniden üretilebilir derlemeler için önemli olduğundan, genellikle projenizdeki tüm kodla beraber kaynak kontrolüne kontrol edilir.

#### Bir Kütüphanenin Güncellenmesi

Bir kütüphaneyi güncellemek istediğinizde, Cargo `update` komutunu sağlar; bu komut, *Cargo.lock* dosyasını göz ardı eder ve *Cargo.toml* dosyanızda belirttiğiniz özelliklere uyan en son sürümleri bulur. Cargo, bu sürümleri *Cargo.lock* dosyasına yazar. Bu durumda, Cargo yalnızca 0.8.5'ten büyük ve 0.9.0'dan küçük sürümlere bakacaktır. Eğer `rand` kütüphanesi 0.8.6 ve 0.9.0 adında iki yeni sürüm yayınlamışsa, `cargo update` komutunu çalıştırdığınızda aşağıdakileri görürsünüz:



```console
$ cargo update
    Updating crates.io index
    Updating rand v0.8.5 -> v0.8.6
```

Cargo, 0.9.0 sürümünü göz ardı eder. Bu noktada, *Cargo.lock* dosyanızda artık kullandığınız `rand` kütüphanesinin sürümünün 0.8.6 olduğunu belirten bir değişiklik de fark edeceksiniz. `rand` sürümü 0.9.0 veya 0.9.*x* serisindeki herhangi bir sürümü kullanmak için, *Cargo.toml* dosyasını aşağıdaki gibi güncellemeniz gerekir:

```toml
[dependencies]
rand = "0.9.0"
```

Bir sonraki `cargo build` komutunuzu çalıştırdığınızda, Cargo mevcut olan kütüphane kayıtlarını güncelleyecek ve belirttiğiniz yeni sürüme göre `rand` gereksinimlerinizi yeniden değerlendirecektir.

Cargo ve [ekosistemi][doccratesio] hakkında daha pek çok şey söylemek mümkün, ancak şimdilik bilmeniz gereken her şey bu. Cargo, kütüphaneleri tekrar kullanmayı çok kolaylaştırdığı için Rustacean'lar daha küçük projeler yazabiliyor. Bu projeler, birçok paket kullanılarak bir araya getiriliyor.

---

### Rastgele Bir Sayı Üretme

Şimdi `rand` kullanarak tahmin edilecek bir sayı oluşturmayı başlatalım. Bir sonraki adım, *src/main.rs* dosyasını aşağıdaki gibi güncelleyebilmek:



```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-03/src/main.rs:all}}
```



İlk olarak `use rand::Rng;` satırını ekliyoruz. `Rng` türü, rastgele sayı üreteçlerinin uyguladığı yöntemleri tanımlar ve bu yöntemleri kullanabilmemiz için bu türünün görünür olması gerekir. Bölüm 10, türleri ayrıntılı bir şekilde ele alacaktır.

Sonra, ortada iki yeni satır ekliyoruz. İlk satırda, kullanacağımız rastgele sayı üretecini veren `rand::thread_rng` fonksiyonunu çağırıyoruz: bu fonksiyon, mevcut yürütme iş parçacığına özgü olan ve işletim sistemi tarafından tohumlanan bir rastgele sayı üreteçtir. Ardından rastgele sayı üretecisi üzerinde `gen_range` yöntemini çağırıyoruz. Bu yöntem, `use rand::Rng;` ifadesi ile görünür hale getirdiğimiz `Rng` türü tarafından tanımlanmıştır. `gen_range` yöntemi bir aralık ifadesi argümanı alır ve belirtilen aralıkta rastgele bir sayı oluşturur. Burada kullandığımız aralık ifadesi `start..=end` biçimindedir ve alt ve üst sınırlar dâhil edilmiştir; bu nedenle, 1 ile 100 arasında bir sayı talep etmek için `1..=100` olarak belirtmemiz gerekir.

> **Not:** Hangi tür ile hangi yöntemleri kullanacağınızı bilmeyeceksiniz, bu nedenle her kütüphane, onu nasıl kullanacağınıza dair talimatların olduğu bir belgelendirmeye sahiptir. Cargo'nun başka bir harika özelliği, `cargo doc --open` komutunu çalıştırdığınızda bağımlılıklarınız tarafından sağlanan belgelendirmeyi yerel olarak oluşturarak tarayıcınızda açmasıdır. Örneğin, `rand` kütüphanesindeki diğer işlevler ile ilgileniyorsanız, `cargo doc --open` komutunu çalıştırın ve sol çubukta `rand` kısmına tıklayın.

İkinci yeni satır, gizli sayıyı yazdırır. Bu, programı geliştirdiğimiz süre boyunca onu test edebilmek açısından kullanışlıdır, ancak nihai versiyondan kaldıracağız. Program başladığında hemen cevabı yazdırıyorsa eğlenceli sayılmaz!

Programı birkaç kez çalıştırmayı deneyin:



```console
$ cargo run
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running `target/debug/guessing_game`
Tahmin edilen sayıyı bulun!
Gizli sayı: 7
Tahmininizi girin.
4
Tahmin ettiniz: 4

$ cargo run
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running `target/debug/guessing_game`
Tahmin edilen sayıyı bulun!
Gizli sayı: 83
Tahmininizi girin.
5
Tahmin ettiniz: 5
```

Farklı rastgele sayılar almalısınız ve bunlar 1 ile 100 arasında olmalıdır. Harika iş!

---

## Tahmini Gizli Sayıyla Karşılaştırma

Artık kullanıcı girdisi ve rastgele bir sayımız olduğuna göre, bunları karşılaştırabiliriz. Bu adım, Listing 2-4'te gösterilmiştir. Bu kod henüz derlenmeyecek, çünkü açıklayacağız.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-04/src/main.rs:here}}
```



İlk olarak, standart kütüphaneden `std::cmp::Ordering` adında bir türü görünür hale getiren başka bir `use` ifadesi ekliyoruz. `Ordering` türü bir diğer enum olup, `Less`, `Greater` ve `Equal` varyantlarına sahiptir. Bu, iki değeri karşılaştırdığınızda olası üç sonuçtur.

Sonra, en altta `Ordering` türünü kullanan beş yeni satır ekliyoruz. `cmp` yöntemi iki değeri karşılaştırır ve karşılaştırılabilir herhangi bir şey üzerinde çağrılabilir. Bir referans alır ve burada `guess` ile `secret_number` değerlerini karşılaştırır. Ardından, `use` ifadesi ile görünür hale getirdiğimiz `Ordering` enumunun bir varyantını döndürür. `match` ifadesini kullanarak `guess` ile `secret_number` değerleriyle yapılan `cmp` çağrısının hangi varyantının döndüğüne göre ne yapılacağımızı belirleriz.

`match` ifadesi *kollar* ile oluşur. Bir kol, karşılaştıracağınız bir *şablon* ve eğer `match` kelimesine verilen değer o kolun şablonuna uyuyorsa çalıştırılması gereken kodu içerir. Rust, `match` kelimesine verilen değeri alır ve her kolun şablonunu sırayla kontrol eder. Şablonlar ve `match` yapısı, Rust'ın güçlü özellikleridir: bunlar, kodunuzun karşılaşabileceği farklı durumları ifade etmenizi sağlar ve bunların hepsini ele aldığınızdan emin olursunuz. Bu özellikler, Bölüm 6 ve Bölüm 19'da ayrıntılı olarak ele alınacaktır.

Burada kullandığımız `match` ifadesi ile bir örnek üzerinden geçelim. Kullanıcı 50 tahmin etti ve bu sefer rastgele oluşturulan gizli sayı 38.

Kod 50 ile 38'i karşılaştırdığında, `cmp` metodu `Ordering::Greater` döndürecektir çünkü 50, 38'den büyüktür. `match` ifadesi, `Ordering::Greater` değerini alır ve her kolun şablonunu kontrol etmeye başlar. İlk kolun şablonuna `Ordering::Less` bakar ve `Ordering::Greater` değerinin `Ordering::Less` ile eşleşmediğini görünce o kolun kodunu göz ardı eder ve bir sonraki kola geçer. Sonraki kolun şablonu `Ordering::Greater` ve bu *eşleşiyor*! O kol içindeki ilişkili kod çalışacak ve ekrana `Çok büyük!` yazdıracaktır. `match` ifadesi ilk başarılı eşleşmeden sonra sona erer, bu nedenle bu senaryoda son kolu kontrol etmeyecektir.

> **Dikkat:** Ancak, Listing 2-4'teki kod henüz derlenmeyecek. Onu deneyelim:



```console
{{#include ../listings/ch02-guessing-game-tutorial/listing-02-04/output.txt}}
```

Hata çekirdeğinin, *eşleşmeyen türler* olduğunu belirtiyor. Rust'ın güçlü, statik bir tür sistemi vardır. Ancak aynı zamanda tür çıkarımı da yapar. `let mut guess = String::new()` yazdığımızda, Rust, `guess` değişkeninin bir `String` olacağını çıkarımda bulundu ve bizden türü yazmamızı istemedi. Öte yandan `secret_number` bir sayı türüdür. Rust'ın sayı türlerinden bazıları 1 ile 100 arasında bir değer alabilir: `i32`, 32 bitlik bir sayı; `u32`, işaretsiz 32 bitlik bir sayı; `i64`, 64 bitlik bir sayı ve diğerleri. Başka bir yere belirtilmediği sürece, Rust varsayılan olarak `i32` üzerinde durur; bu, `secret_number`'ın türüdür, eğer Rust'ın farklı bir sayı türü çıkarmasına neden olacak başka tür bilgiler eklemediyseniz. Hatanın sebebi, Rust'ın bir string ile bir sayı türünü karşılaştıramamasıdır.

Sonunda, programın girdiğini okuduğu `String` değerini bir sayı türüne çevirmek istiyoruz, böylece onu gizli sayı ile karşılaştırabiliriz. Bunu `main` işlevinin gövdesine bu satırı ekleyerek yapıyoruz:

Dosya Adı: src/main.rs

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/no-listing-03-convert-string-to-number/src/main.rs:here}}
```

Satır şu şekildedir:

```rust,ignore
let guess: u32 = guess.trim().parse().expect("Lütfen bir sayı yazın!");
```

`guess` adında bir değişken oluşturuyoruz. Ama bekleyin, program zaten `guess` adında bir değişken bulundurmuyor mu? Bulunduruyor, ancak Rust, önceki `guess` değerini yeni bir değerle gölgelemenize olanak sağlar. *Gölgeleme*, `guess` değişken adını yeniden kullanmamıza izin verirken, iki farklı değişken oluşturmamız zorunda bırakmaz, örneğin `guess_str` ve `guess` gibi. Bunu daha ayrıntılı olarak [Bölüm 3][shadowing]'te inceleyeceğiz, ancak şimdilik, bir değeri bir türden diğerine dönüştürmek istediğinizde bu özelliğin sıklıkla kullanıldığını bilin.

Bu yeni değişkeni `guess.trim().parse()` ifadesine bağlarız. İfadede `guess`, girdi olarak bulunan orijinal `guess` değişkenine gönderir. `String` nesnesindeki `trim` yöntemi, başında ve sonunda herhangi bir boşluk karakterini ortadan kaldırır; bunu, stringi karşılaştırmamız için yapmamız gerekir, çünkü `u32` yalnızca sayısal veriler içerebilir. Kullanıcı, `read_line`'i tatmin etmek ve tahminini girmek için enter tuşuna basmak zorundadır; bu diyaloğa bir yeni satır karakteri ekler. Örneğin, kullanıcı 5 yazar ve enter tuşuna basarsa, `guess` şöyle görünür: `5\n`. `\n` "yeni satır" anlamına gelir. (Windows'ta, enter tuşuna basıldığında, bir satır sonu ve yeni satır olarak `\r\n` ortaya çıkar.) `trim` yöntemi `\n` veya `\r\n` değerlerini ortadan kaldırarak yalnızca `5` sonucunu verir.

[`parse` yöntemi][parse], bir stringi başka bir türe dönüştürür. Burada, bir stringden bir sayıya dönüştürmek için kullanıyoruz. Rust'a tam olarak hangi sayı türünü istediğimizi belirtmemiz gerekir; bu sebeple `let guess: u32` kullanıyoruz. `guess` kelimesinin ardından gelen iki nokta (`:`), Rust'a değişkenin türünü belirteceğimizi ifade eder. Rust'ın birkaç yerleşik sayı türü vardır; buradaki `u32`, işaretsiz 32 bitlik bir tam sayıdır. Küçük pozitif sayılar için iyi bir varsayılan seçimdir. Diğer sayı türleri hakkında [Bölüm 3][integers]'te bilgi alacaksınız.

Ayrıca bu örnek programdaki `u32` açıklaması ve `secret_number` ile karşılaştırma, Rust'ın `secret_number` türünü de `u32` olarak çıkarmasını sağlayacaktır. Artık karşılaştırma, her iki türün de aynı olduğu iki değer arasında olacaktır!

`parse` metodu yalnızca mantıken sayılara dönüştürülebilen karakterler üzerinde çalışır ve bu nedenle kolayca hatalara neden olabilir. Örneğin, string `A👍%` içeriyorsa, bunu bir sayıya dönüştürmek mümkün olmayacaktır. Başarısız olabileceğinden, `parse` yöntemi, `read_line` yönteminde olduğu gibi (daha önce `“Sonuç ile Olası Başarısızlığı Ele Alma”`'da tartışılmıştır) bir `Result` türü döndürür. Bu `Result`'ı, `expect` yöntemi ile aynı şekilde ele alacağız. Eğer `parse`, stringden bir sayı üretemediği için bir `Err` `Result` varyantı dönerse, `expect` çağrısı oyunun sona ermesine neden olur ve verdiğimiz mesajı yazdırır. Eğer `parse` stringi başarıyla bir sayıya dönüştürebilirse, `Ok` `Result` varyantını döndürecek ve `expect` istediğimiz sayıyı `Ok` değerinden alacaktır.

---

Şimdi programı çalıştıralım:



```console
$ cargo run
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.26s
     Running `target/debug/guessing_game`
Tahmin edilen sayıyı bulun!
Gizli sayı: 58
Tahmininizi girin.
  76
Tahmin ettiniz: 76
Çok büyük!
```

Güzel! Tahminden önce boşluk eklenmiş olsa bile, program kullanıcıların 76'yı tahmin ettiğini doğru olarak belirledi. Farklı türdeki girdilerle sayıyı doğru tahmin etme, fazla yükseğe tahmin etme ve fazla düşük tahmin etme gibi farklı davranışları doğrulamak için programı birkaç kez çalıştırın.

Artık oyunun büyük kısmı çalışıyor, ancak kullanıcı yalnızca bir tahmin yapabiliyor. Bunun yerine bir döngü ekleyerek bunu değiştirelim!

---

## Döngü ile Birden Fazla Tahmine İzin Verme

`loop` anahtar kelimesi sonsuz bir döngü oluşturur. Kullanıcılara sayıyı tahmin etmek için daha fazla şans vermek üzere bir döngü ekleyeceğiz:

Dosya Adı: src/main.rs

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/no-listing-04-looping/src/main.rs:here}}
```

Gördüğünüz gibi, tahmin girdi isteminden sonraki her şeyi bir döngü içine aldık. İçinde döngü bulunan satırları dört boşluk daha girintilemeyi unutmayın ve programı tekrar çalıştırın. Program artık sonsuza dek bir başka tahmin istemi gösterecek, bu da yeni bir sorun doğuruyor. Kullanıcının çıkabilir gibi görünmüyor!

Kullanıcı her zaman klavye kısayolunu kullanarak programı kesebilir: ctrl-c. Ancak, kullanıcının çıkabilmesi için sağlanan başka bir yol var; bunlar `“Tahmini Gizli Sayıyla Karşılaştırma”` bölümünde `parse` tartışmasında belirtildiği gibi: kullanıcı sayısal olmayan bir cevap girerse, program çöker. Bunu, kullanıcının çıkmasına izin verecek şekilde burada kullanabiliriz:



```console
$ cargo run
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.23s
     Running `target/debug/guessing_game`
Tahmin edilen sayıyı bulun!
Gizli sayı: 59
Tahmininizi girin.
45
Tahmin ettiniz: 45
Çok küçük!
Tahmininizi girin.
60
Tahmin ettiniz: 60
Çok büyük!
Tahmininizi girin.
59
Tahmin ettiniz: 59
Kazandınız!
Tahmininizi girin.
çık
thread 'main' panicked at 'Lütfen bir sayı yazın!: ParseIntError { kind: InvalidDigit }', src/main.rs:28:47
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

`çık` yazmak oyunu sona erdirir, ancak fark edeceğiniz gibi, başka herhangi bir sayısal olmayan girdi de aynı sonucu yaratır. Bu, en azından alt düzeyde bir sorun; oyunun kazandığında da durması gerektiğini istiyoruz.

---

### Doğru Tahminde Kazandıktan Sonra Çıkma

Oyunu, kullanıcı kazandığı zaman çıkacak şekilde programlayalım ve bir `break` ifadesi ekleyelim:

Dosya Adı: src/main.rs

```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/no-listing-05-quitting/src/main.rs:here}}
```

`Kazandınız!` ifadesinin ardından `break` satırını eklemek, kullanıcının doğru tahminde bulunduğu zaman döngünün sona ermesini sağlar. Döngüden çıkmak, programdan çıkmak anlamına gelir, çünkü ana fonksiyonun son kısmı döngüdür.

---

### Geçersiz Girdileri İşleme

Oyunun davranışını daha rafine hale getirmek için, kullanıcı bir sayı girmezse programı çökertmek yerine, oyunun geçersiz girdileri göz ardı etmesini sağlayalım, böylece kullanıcıyı tahmin yapmaya devam edersin. Bunu, bir `String`'in `u32`'ye dönüştürüldüğü satırı değiştirerek Listing 2-5'te gösterildiği gibi gerçekleştirebiliriz.



```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-05/src/main.rs:here}}
```



`expect` çağrısından çıkış yaparak hataları yönetmek için `match` ifadesine geçiyoruz. Unutmayın, `parse` bir `Result` türü döndürür ve `Result`, `Ok` ve `Err` varyantlarına sahip bir enum'dur. Burada, `cmp` yönteminin `Ordering` sonucuyla yaptığımız gibi bir `match` ifadesi kullanıyoruz.

Eğer `parse`, string değerini başarıyla bir sayıya dönüştürebilirse, `Ok` değeri döndürecek ve bu sonuçta sayı vardır. Bu `Ok` değeri ilk kolun şablonuna uyacak ve `match` ifadesi, `parse` tarafından üretilen sayıyı döndürecektir. O sayı, oluşturmakta olduğumuz yeni `guess` değişkeninde istediğimiz yerde olacaktır.

Eğer `parse`, stringi bir sayıya dönüştüremiyorsa, bir hata değeri dönecek ve bu hata değeri hakkında daha fazla bilgi içerecektir. `Err` değeri, ilk `match` kolundaki `Ok(num)` şablonuyla eşleşmez, ancak ikinci kolun `Err(_)` şablonuyla eşleşir. Alt çizgi `_`, tüm değerleri karşılamak için kullanılan bir değer; bu örnekte tüm `Err` değerlerini, içlerinde ne tür bilgiler olursa olsun, eşleştirmek istediğimizi belirtiyoruz. Bu nedenle, program ikinci kolun kodunu çalıştıracak ve `continue` ile programın döngünün bir sonraki yinelemesine geçmesini ve başka bir tahmin istemesini sağlayacaktır. Böylece, program, `parse`'ın karşılaşabileceği tüm hataları göz ardı edecek!

Artık programdaki her şey beklendiği gibi çalışmalı. Bunu deneyelim:



```console
$ cargo run
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.13s
     Running `target/debug/guessing_game`
Tahmin edilen sayıyı bulun!
Gizli sayı: 61
Tahmininizi girin.
10
Tahmin ettiniz: 10
Çok küçük!
Tahmininizi girin.
99
Tahmin ettiniz: 99
Çok büyük!
Tahmininizi girin.
foo
Tahmininizi girin.
61
Tahmin ettiniz: 61
Kazandınız!
```

Harika! Bir tek son küçük değişiklikle tahmin oyununu tamamlayacağız. Program hala gizli sayıyı yazdırıyor. Bu test için iyi çalıştı, ancak oyunun gerisini mahvediyor. Gizli sayıyı yazdıran `println!` satırını kaldırabiliriz. Listing 2-6'da son kodu gösterilmektedir.



```rust,ignore
{{#rustdoc_include ../listings/ch02-guessing-game-tutorial/listing-02-06/src/main.rs}}
```



Bu noktada, tahmin oyununu başarıyla oluşturdunuz. Tebrikler!

---

## Özet

> Bu proje, size birçok yeni Rust kavramını tanıtmanın pratik bir yoluydu: `let`, `match`, fonksiyonlar, harici kütüphanelerin kullanımı ve daha fazlası. Önümüzdeki birkaç bölümde, bu kavramları daha ayrıntılı bir şekilde öğreneceksiniz. Bölüm 3, çoğu programlama dilinde bulunan kavramları ele alır; bu kavramlar arasında değişkenler, veri türleri ve fonksiyonlar vardır ve bunların Rust'ta nasıl kullanılacağı gösterilecektir. Bölüm 4, Rust'ı diğer dillerden farklı yapan bir özellik olan sahiplik kavramını incelemektedir. Bölüm 5, yapıların ve yöntemlerin sözdizimini tartışır, Bölüm 6 ise enumların nasıl çalıştığını açıklar.

[prelude]: ../std/prelude/index.html
[variables-and-mutability]: ch03-01-variables-and-mutability.html#variables-and-mutability
[comments]: ch03-04-comments.html
[string]: ../std/string/struct.String.html
[iostdin]: ../std/io/struct.Stdin.html
[read_line]: ../std/io/struct.Stdin.html#method.read_line
[result]: ../std/result/enum.Result.html
[enums]: ch06-00-enums.html
[expect]: ../std/result/enum.Result.html#method.expect
[recover]: ch09-02-recoverable-errors-with-result.html
[randcrate]: https://crates.io/crates/rand
[semver]: http://semver.org
[cratesio]: https://crates.io/
[doccargo]: https://doc.rust-lang.org/cargo/
[doccratesio]: https://doc.rust-lang.org/cargo/reference/publishing.html
[match]: ch06-02-match.html
[shadowing]: ch03-01-variables-and-mutability.html#shadowing
[parse]: ../std/primitive.str.html#method.parse
[integers]: ch03-02-data-types.html#integer-types