## Crate'in Crates.io'ya Yüklenmesi

Projelerimizde bağımlılık olarak [crates.io](https://crates.io/)'dan paketler kullandık, ancak kendi paketlerinizi yayınlayarak kodunuzu diğer insanlarla da paylaşabilirsiniz. [crates.io](https://crates.io/)'daki crate kayıt defteri, paketlerinizin kaynak kodunu dağıtmakta, bu nedenle esas olarak açık kaynak kodunu barındırmaktadır.

Rust ve Cargo, yayınlanan paketinizi insanların bulmasını ve kullanmasını kolaylaştıran özelliklere sahiptir. Bu özelliklerden bazılarını bir sonraki bölümde tartışacağız ve ardından bir paketi nasıl yayınlayacağımızı açıklayacağız.

### Kullanışlı Dokümantasyon Yorumları Oluşturmak

:::tip
Paketlerinizi doğru bir şekilde belgelemek, diğer kullanıcıların bunları nasıl ve ne zaman kullanacaklarını bilmelerine yardımcı olur. Bu nedenle, belgeleri yazmaya zaman ayırmak önemlidir.
:::

Bölüm 3'te, Rust kodunu iki eğik çizgi kullanarak `//` nasıl yorumlayacağımızı tartıştık. Rust ayrıca HTML dokümantasyonu oluşturacak şekilde belgelenmiş özel bir yorum türüne sahiptir; bu yorum, *belgeleme yorumu* olarak adlandırılmaktadır. HTML, programcıların crate'inizi *nasıl kullanacağını* değil, crate'inizin *nasıl uygulandığını* bilmek isteyenler için genel API öğelerinin içeriklerini görüntüler.

Belgeleme yorumları iki yerine üç eğik çizgi kullanarak `///` başlatılır ve metni biçimlendirmek için Markdown notasyonu destekler. Belgeleme yorumlarını, belgelenecek öğeden hemen önce yerleştirin. Aşağıda, `my_crate` adındaki bir crate içindeki `add_one` fonksiyonu için belgelenmiş yorumları gösteren bir örnek bulunmaktadır.



```rust,ignore
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-01/src/lib.rs}}
```



Burada, `add_one` fonksiyonunun ne yaptığını açıklıyor, `Örnekler` başlıklı bir bölüm başlatıyor ve ardından `add_one` fonksiyonunun nasıl kullanılacağını gösteren kod sağlıyoruz. Bu belgeleme yorumundan HTML dokümantasyonunu oluşturmak için `cargo doc` komutunu çalıştırabiliriz. Bu komut, Rust ile dağıtılan `rustdoc` aracını çalıştırır ve oluşturulan HTML dokümantasyonunu *target/doc* dizinine koyar.

:::info
Kolaylık sağlaması açısından `cargo doc --open` komutunu çalıştırmak, mevcut crate'inizdeki dokümantasyon için HTML oluşturacak (ve tüm crate bağımlılıklarınızın dokümantasyonunu da) ve sonucu bir web tarayıcısında açacaktır. `add_one` fonksiyonuna gidin ve belgeleme yorumlarındaki metnin nasıl biçimlendirildiğini göreceksiniz; bu, Şekil 14-1'de gösterilmiştir:
:::

![](images/rust/img/trpl14-01.png)

Şekil 14-1: `my_crate`'in `add_one` fonksiyonu için HTML dokümantasyonu

#### Yaygın Olarak Kullanılan Bölümler

Liste 14-1'de `# Örnekler` Markdown başlığını kullanarak HTML'de "Örnekler" başlıklı bir bölüm oluşturdum. İşte crate yazarlarının belgelerinde sıkça kullandığı bazı diğer bölümler:

* **Panikler**: Belgelenecek fonksiyonun ne zaman panik yapabileceği senaryolar. Panik istemeyen fonksiyon çağrıcıları, bu durumlarda fonksiyonu çağırmadıklarından emin olmalıdır.
* **Hatalar**: Fonksiyon bir `Result` döndürüyorsa, meydana gelebilecek hata türlerini ve bu hataların hangi koşullarda döndürülebileceğini tanımlamak, çağrıcılara faydalı olabilir; böylece farklı hata türlerini farklı şekillerde ele alacak kod yazabilirler.
* **Güvenlik**: Fonksiyonun çağrılmasının `unsafe` olup olmadığını belirtmek için (güvenliği Bölüm 20'de tartışıyoruz), fonksiyonun neden güvenlikte olduğunu açıklayan ve fonksiyonun çağrılmasını beklendiği gibi hepsinin karşılaması gereken saklı değerleri kapsayan bir bölüm olmalıdır.

:::note
Çoğu belgeleme yorumu bu bölümlerin hepsine ihtiyaç duymaz, ancak kodunuzun kullanıcıların ilgisini çekebileceği yönleri hatırlamak için iyi bir kontrol listesi olabilir.
:::

#### Belgeleme Yorumları Test Olarak

Belgeleme yorumlarınıza örnek kod blokları eklemek, kütüphanenizin nasıl kullanılacağını göstermek açısından yardımcı olabilir ve bunun ek bir avantajı da vardır: `cargo test` komutu, belgeleme örneklerindeki kodu test olarak çalıştırır! Örneklerle belgeler kadar iyi bir şey yoktur. Ancak belgeler yazılırken kod değişirse, çalışan örneklerden daha kötü bir şey olamaz. Eğer Liste 14-1'deki `add_one` fonksiyonunun belgelendiği noktada `cargo test` komutunu çalıştırırsak, test sonuçlarında şu şekilde bir bölüm göreceğiz:

```text
   Doc-tests my_crate

running 1 test
test src/lib.rs - add_one (line 5) ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.27s
```

:::warning
Şimdi ya fonksiyonu ya da örneği değiştirirsek ve örnekteki `assert_eq!` panik yaparsa `cargo test`'i bir kez daha çalıştırdığımızda, belge testlerinin örneğin ve kodun birbirleriyle uyumsuz olduğunu yakaladığına şahit olacağız!
:::

#### İçerilen Öğeleri Yorumlamak

`//!` belgeleme yorum stili, yorumların takip ettiği öğelere değil, yorumları içeren öğeye belgeleme ekler. Bu belgelemeleri genellikle crate kök dosyası (*src/lib.rs* geleneksel olarak) veya bir modülün içinde kullanarak crate'in veya modülün tamamını belgelemek için kullanırız.

Örneğin, `add_one` fonksiyonunu içeren `my_crate` crate'inin amacını açıklayan belgeleri eklemek için *src/lib.rs* dosyasının başına `//!` ile başlayan belgeleme yorumları ekliyoruz; bu Liste 14-2'de gösterilmiştir.



```rust,ignore
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-02/src/lib.rs:here}}
```



Son satırda `//!` ile başlayan bir kod yoktur. Çünkü `//!` ile yorumları başlattık, bu durumda bu yorum, bu yorumu içeren öğeyi, takip eden bir öğeyi değil belgeliyor. Bu durumda bu öğe *src/lib.rs* dosyasıdır, bu da crate köküdür. Bu yorumlar tüm crate'i tanımlar.

:::info
`cargo doc --open` komutunu çalıştırdığımızda, bu yorumlar `my_crate` için dokümantasyondaki ana sayfanın üzerinde görülecek, tüm genel öğelerin listesinde gösterilecektir; bu Şekil 14-2'de gösterilmektedir:
:::

![](images/rust/img/trpl14-02.png)

Şekil 14-2: `my_crate` için, crate'in tamamını tanımlayan yorumu içeren görüntülenen dokümantasyon

Öğeler içindeki belgeleme yorumları, özellikle crate'leri ve modülleri açıklamak açısından faydalıdır. Bunları, konteynerin genel amacını açıklamak için kullanarak kullanıcıların crate'in düzenini anlamalarına yardımcı olun.

### Kullanışlı Bir Public API'yi `pub use` ile İhraç Etmek

Yayıncıdan bir crate yayınlarken, kamu API'nizin yapısı büyük bir husustur. Crate'inizi kullanan insanlar, yapıyı sizin kadar iyi bilmeyeceklerinden, büyük bir modül hiyerarşisine sahipseniz, kullanmak istedikleri parçaları bulmada zorluk yaşayabilirler.

Bölüm 7'de, öğeleri `pub` anahtar kelimesini kullanarak nasıl yayınlayacağımızı ve `use` anahtar kelimesi ile öğeleri bir kapsam içine nasıl alacağımızı ele aldık. Ancak, bir crate geliştirirken anlamlı olan yapı, kullanıcılarınız için çok pratik olmayabilir. Belirli bir seviyede bir hiyerarşi içinde yapılandırmak isteyebilirsiniz, ancak derin bir hiyerarşide tanımladığınız bir türü kullanmak isteyen insanlar o türün var olduğunu bulmakta zorluk çekebilirler. Ayrıca, `use` ile `my_crate::some_module::another_module::UsefulType;` demek zorunda kalmanın yerine `use` ile `my_crate::UsefulType;` demek de kullanıcıları rahatsız edebilir.

:::note
İyi haber şu ki, eğer yapı, başka bir kütüphaneden kullanım için pratik değilse, iç organizasyonunuzu yeniden düzenlemek zorunda değilsiniz: bunun yerine, kamu yapısını ayarlamak için öğeleri yeniden ihraç edebilirsiniz. `pub use` kullanarak, bir yerdeki kamu bir öğeyi alıp, onu başka bir yerde kamuya açar, sanki o öğe orada tanımlanmış gibi görünmesine neden olur.
:::

Örneğin, sanatsal kavramları modellemek için `art` adında bir kütüphane oluşturduğumuzu varsayalım. Bu kütüphanede bir `kinds` modülü ve içinde `PrimaryColor` ve `SecondaryColor` adında iki enum, `utils` modülünde ise `mix` adında bir işlev içermektedir; bu Liste 14-3'te gösterilmektedir.



```rust,noplayground,test_harness
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-03/src/lib.rs:here}}
```



Şekil 14-3, `cargo doc` ile üretilen bu crate'in dokümantasyonunun ana sayfasının nasıl görüneceğini gösteriyor:

![](images/rust/img/trpl14-03.png)

Şekil 14-3: `art` dokümantasyonu için ana sayfa, `kinds` ve `utils` modüllerini listeliyor

:::info
`PrimaryColor` ve `SecondaryColor` türlerinin ana sayfada listelenmediğini, `mix` fonksiyonunun da görünmediğini unutmayın. Onları görebilmek için `kinds` ve `utils`'e tıklamalıyız.
:::

Bu kütüphaneye bağlı başka bir crate, öğeleri `art`'dan kapsama almak için `use` ifadelerine ihtiyaç duyarak, mevcut tanımlanan modül yapısını belirtmesi gerekir. Liste 14-4, `art` crate'inden `PrimaryColor` ve `mix` öğelerini kullanan bir crate örneğini göstermektedir:



```rust,ignore
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-04/src/main.rs}}
```



Liste 14-4'teki, `art` crate'ini kullanan kodun yazarı, `PrimaryColor`'ın `kinds` modülünde olduğunu ve `mix`'in `utils` modülünde yer aldığını anlamak zorunda kaldı. `art` crate'inin modül yapısı, `art`'ı geliştirenler için onun işleyişinin son derece ilgili bir durumuyken, onu kullananlar için çok fazla anlam ifade etmez. İç yapı, `art` crate'ini kullanmakta çalışan kişiler için yararlı bir bilgi içermediği gibi, kafa karıştırıcı hale de gelmektedir; zira, kullanmakta oldukları crate'i anlamaya çalışan geliştiricilerin nerelere bakacaklarını anlaması ve `use` ifadelerinde modül adını belirtmeleri gerekecektir.

:::danger
Kamu API'lerinden iç organizasyonu kaldırmak için, Liste 14-3'teki `art` crate kodunu değiştirip, en üst seviyede yeniden ihraç etmek için `pub use` ifadeleri ekleyebiliriz; bu da Liste 14-5'te gösterilmiştir.
:::



```rust,ignore
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-05/src/lib.rs:here}}
```



`cargo doc` bu crate için ürettiği API dokümantasyonu artık yeniden ihraç edilen öğeleri ana sayfada listeleyecek ve ilişkilendirecektir; bu, Şekil 14-4'te, `PrimaryColor` ve `SecondaryColor` türlerini ve `mix` fonksiyonunu bulmayı kolaylaştırmaktadır.

![](images/rust/img/trpl14-04.png)

Şekil 14-4: `art` için dokümantasyonun ana sayfası, yeniden ihraç edilen öğeleri listelemektedir

`art` crate kullanıcıları, Liste 14-3'teki iç yapıyı ve Liste 14-4'te gösterildiği gibi, yeniden ihraç edilen öğeleri kullanarak veya daha uygun olan Liste 14-5'teki yapıyı kullanarak görebilirler; bu da Liste 14-6'da gösterilmiştir:



```rust,ignore
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-06/src/main.rs:here}}
```



Birçok iç içe modül olduğunda, `pub use` ile türleri üst düzeyde yeniden ihraç etmek, crate'i kullanan insanların deneyiminde önemli bir fark yaratabilir. `pub use`'nin bir diğer yaygın kullanımı ise, bağımlılığın tanımlarını mevcut crate'inde yeniden ihraç ederek, o crate'in tanımlarını kendi crate'in kamu API'sinin bir parçası haline getirmektir.

Kullanışlı bir kamu API yapısı oluşturmak, bilimden ziyade bir sanattır ve kullanıcılarınız için en iyi çalışan API'yi bulmak için yineleyebilirsiniz. `pub use` seçeneği, crate'inizi içsel olarak nasıl yapılandıracağınızda esneklik sağlar ve iç yapınızı kullanıcılarınıza sunduğunuz yapıyla bağlantısız hale getirir. Kurduğunuz bazı crate'lerin kodlarına bakın ve iç yapılarının kamu API'lerinden farklı olup olmadığını görün.

### Crates.io Hesabı Oluşturma

Herhangi bir crate yayımlamadan önce, [crates.io](https://crates.io/)'da bir hesap oluşturmanız ve bir API anahtarı almanız gerekir. Bunu yapmak için, [crates.io](https://crates.io/) ana sayfasını ziyaret edin ve GitHub hesabınızla giriş yapın. (Şu anda GitHub hesabı bir gerekliliktir; ancak ileride başka hesap oluşturma yolları desteklenebilir.) Giriş yaptıktan sonra, [https://crates.io/me/](https://crates.io/me/) adresinden hesap ayarlarınıza gidin ve API anahtarınızı alın. Ardından `cargo login` komutunu çalıştırın ve istenildiğinde API anahtarınızı yapıştırın, şu şekilde:

```console
$ cargo login
abcdefghijklmnopqrstuvwxyz012345
```

Bu komut Cargo'ya API tokeninizi bildirecek ve yerel olarak *~/.cargo/credentials* dosyasında saklayacaktır. Bu anahtarın bir *gizli* olduğuna dikkat edin: kimseyle paylaşmayın. Eğer bir sebepten ötürü herhangi biriyle paylaşırsanız, onu iptal etmelisiniz ve [crates.io](https://crates.io/)'da yeni bir anahtar oluşturmalısınız.

### Yeni Bir Crate'e Metadata Eklemek

Yayımlamak istediğiniz bir crate'iniz olduğunu varsayalım. Yayınlamadan önce, crate'in *Cargo.toml* dosyasının `[package]` kısmına bazı meta veriler eklemeniz gerekecektir.

Crate'inizin benzersiz bir adı olmalıdır. Bir crate üzerinde yerel olarak çalışırken, istediğiniz herhangi bir adı verebilirsiniz. Ancak, [crates.io](https://crates.io/)'da crate adları sırasıyla tahsis edilir. Bir crate adı alındıktan sonra, başka kimse o isimle bir crate yayımlayamaz. Bir crate yayımlamadan önce, kullanmak istediğiniz adı arayın. Eğer ad alınmışsa, başka bir ad bulmanız ve `[package]` bölümündeki *Cargo.toml* dosyasındaki `name` alanını yeni isimle güncellemeniz gerekecek, şöyle:

Dosya Adı: Cargo.toml

```toml
[package]
name = "guessing_game"
```

Eğer benzersiz bir isim seçtiyseniz, bu noktada `cargo publish` komutunu çalıştırırken bir uyarı ve ardından bir hata alacaksınız:

```console
$ cargo publish
    Updating crates.io index
warning: manifest has no description, license, license-file, documentation, homepage or repository.
See https://doc.rust-lang.org/cargo/reference/manifest.html#package-metadata for more info.
--snip--
error: failed to publish to registry at https://crates.io

Caused by:
  the remote server responded with an error (status 400 Bad Request): missing or empty metadata fields: description, license. Please see https://doc.rust-lang.org/cargo/reference/manifest.html for more information on configuring these field
```

:::warning
Bu hata, bazı önemli bilgilerin eksik olmasından kaynaklanıyor: bir açıklama ve lisans gereklidir ki insanların crate'inizden ne yaptığını ve hangi şartlarla kullanabileceklerini bilsinler.
:::

*Cargo.toml*'da, crate'inizle ilgili arama sonuçlarında görüntülenecek bir cümle veya iki cümle içeren bir açıklama eklemeniz gerekir. `license` alanı için, *lisans tanımlayıcı değeri* vermeniz gerekmektedir. [Linux Vakfı'nın Yazılım Paket Verisi Değişimi (SPDX)][spdx] bu değer için kullanabileceğiniz tanımlayıcıları listeler. Örneğin, crate'inizi MIT Lisansı ile lisansladığınızı belirtmek için `MIT` tanımlayıcısını ekleyin:

Dosya Adı: Cargo.toml

```toml
[package]
name = "guessing_game"
license = "MIT"
```

:::note
SPDX'de görünmeyen bir lisans kullanmak istiyorsanız, o lisansın metnini bir dosyaya yerleştirip projeye dahil etmeniz ve ardından `license-file` kullanarak dosya adını belirtmeniz gerekir, `license` anahtarını kullanmak yerine.
:::

Projeniz için hangi lisansın uygun olduğu hakkında bilgi, bu kitabın kapsamının dışındadır. Rust topluluğundaki pek çok kişi, projelerini Rust gibi lisanslayarak `MIT OR Apache-2.0` çift lisansını kullanmaktadır. Bu uygulama, projeleriniz için birden fazla lisans belirtmek üzerin `OR` ile ayırarak birden fazla lisansınız olabileceğini göstermektedir.

Benzersiz bir dünya adı, versiyonunuz, açıklamanız ve bir lisans eklediğinizde, yayımlamaya hazır bir projenin *Cargo.toml* dosyası şu şekilde görünebilir:

Dosya Adı: Cargo.toml

```toml
[package]
name = "guessing_game"
version = "0.1.0"
edition = "2021"
description = "Bilgisayarın seçtiği sayıyı tahmin ettiğiniz eğlenceli bir oyun."
license = "MIT OR Apache-2.0"

[dependencies]
```

:::info
[Cargo’nun belgeleri](https://doc.rust-lang.org/cargo/) diğer meta verileri belirtmek için daha fazla bilgi sağlar, böylece diğerlerinin crate'inizi daha kolay bulup kullanmasını sağlarsınız.
:::

### Crates.io'ya Yayınlama

Artık bir hesap oluşturduğunuz, API anahtarınızı kaydettiğiniz, crate'iniz için bir ad seçtiğiniz ve gerekli meta verileri belirttiğiniz için, yayına hazır durumdasınız! Bir crate'i yayımlamak, belirli bir sürümü [crates.io](https://crates.io/)'ya başkalarının kullanması için yükler.

Dikkatli olun, çünkü bir yayın *kalıcıdır*. Sürüm asla üzerine yazılamaz ve kod silinemez. [crates.io](https://crates.io/)'nın bir diğer büyük hedefi, bu nedenle, [crates.io](https://crates.io/)'dan bağımlı olan tüm projelerin inşa ettikleri projelerin çalışmaya devam etmesini sağlamak için bir kalıcı arşiv işlevi görmektir. Sürüm silinmesine izin vermek, bu hedefin gerçekleştirilmesini imkansız hale getirir. Ancak, yayımlayabileceğiniz crate sürüm sayısı açısından bir sınırlama yoktur.

`cargo publish` komutunu bir kez daha çalıştırın. Artık başarıyla tamamlanmalıdır:

```console
$ cargo publish
    Updating crates.io index
   Packaging guessing_game v0.1.0 (file:///projects/guessing_game)
   Verifying guessing_game v0.1.0 (file:///projects/guessing_game)
   Compiling guessing_game v0.1.0
(file:///projects/guessing_game/target/package/guessing_game-0.1.0)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.19s
   Uploading guessing_game v0.1.0 (file:///projects/guessing_game)
```

Tebrikler! Artık kodunuzu Rust topluluğuyla paylaştınız ve herkes projesinin bağımlılığı olarak crate'inizi kolayca ekleyebilir.

### Mevcut Bir Crate'in Yeni Sürümünü Yayınlama

Crate'inizde değişiklik yaptıysanız ve yeni bir versiyon yayınlamaya hazırsanız, *Cargo.toml* dosyanızdaki `version` değerini değiştirip yeniden yayımlayın. Yaptığınız değişikliklerin türüne bağlı olarak, uygun bir sonraki sürüm numarasını belirlemek için [Anlamlı Sürümleme kurallarını][semver] kullanın. Ardından, yeni sürümü yüklemek için `cargo publish` komutunu çalıştırın.

### Crates.io'dan Sürümleri Devre Dışı Bırakma `cargo yank`

Bir crate'in önceki sürümlerini kaldıramasanız da, gelecekteki projelerin bu sürümleri yeni bir bağımlılık olarak eklemesini engelleyebilirsiniz. Bu, **bir crate sürümü bir şekilde bozulduğunda** yararlıdır. Bu tür durumlarda, Cargo *yanking* (devre dışı bırakma) desteği sunar.

:::tip
**Yanking Kılavuzu:** Her zaman, yalnızca bozuk bir sürüm varsa *yank* işlemi yapmalısınız. Bu, projelerinizi korumanıza yardımcı olur.
:::

Bir sürümü yanklemek, yeni projelerin o sürüme bağımlı olmasını engellerken, ona bağımlı olan tüm mevcut projelerin devam etmesine izin verir. Temelde, bir yank, tüm *Cargo.lock* dosyalarına sahip projelerin bozulmayacağı ve oluşturulacak herhangi bir gelecekteki *Cargo.lock* dosyasının yanklenmiş sürümü kullanmayacağı anlamına gelir.

Bir crate'in sürümünü yanklemek için, daha önce yayınladığınız crate'in dizininde `cargo yank` komutunu çalıştırın ve hangi sürümü yanklemek istediğinizi belirtin. Örneğin, `guessing_game` adında **1.0.1** sürümünde bir crate yayımladıysak ve bunu yanklemek istiyorsak, `guessing_game` projesinin dizininde şu komutu çalıştırırız:



```console
$ cargo yank --vers 1.0.1
    Updating crates.io index
        Yank guessing_game@1.0.1
```

:::info
**Not:** Komuta `--undo` ekleyerek, bir yank'i geri alabilir ve projelerin tekrar bir sürüme bağımlı olmasına izin verebilirsiniz:
:::

```console
$ cargo yank --vers 1.0.1 --undo
    Updating crates.io index
      Unyank guessing_game@1.0.1
```

:::warning
**Önemli:** Bir yank *hiçbir* kodu silmez. Örneğin, yanlışlıkla yüklenmiş gizli bilgileri silemez. Eğer böyle bir durum olursa, o gizli bilgileri derhal sıfırlamanız gerekir.
:::

[spdx]: http://spdx.org/licenses/  
[semver]: http://semver.org/  