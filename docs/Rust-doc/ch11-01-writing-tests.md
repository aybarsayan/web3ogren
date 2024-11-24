## Test Yazma Yöntemleri

Testler, Rust fonksiyonlarıdır ve test edilmeyen kodun beklenildiği gibi çalışıp çalışmadığını doğrular. Test işlevlerinin gövdesi genellikle bu üç işlemi yapar:

* Gerekli verileri veya durumu ayarlayın.
* Test etmek istediğiniz kodu çalıştırın.
* Sonuçların beklediğiniz gibi olup olmadığını doğrulayın.

Rust'ın bu işlemleri gerçekleştirmek için sağladığı özelliklere bir bakalım; bunlar arasında `test` niteliği, birkaç makro ve `should_panic` niteliği bulunmaktadır.

### Bir Test Fonksiyonunun Anatomisi

En basit haliyle, Rust'taki bir test, `test` niteliği ile işaretlenmiş bir fonksiyondur. Nitelikler, Rust kod parçaları hakkında meta verileridir; bir örnek, Bölüm 5'te kullandığımız `derive` niteliğidir. 

:::note
Bir fonksiyonu test fonksiyonu haline getirmek için, `fn` komutunun önündeki satıra `#[test]` ekleyin.
:::

Testlerinizi `cargo test` komutuyla çalıştırdığınızda, Rust, işaretli fonksiyonları çalıştıran ve her test fonksiyonunun geçip geçmediğini raporlayan bir test koşucu ikili dosyası oluşturur.

Yeni bir kütüphane projesi oluşturduğumuzda, Cargo otomatik olarak bir test modülü ve içinde bir test fonksiyonu üretir. Bu modül, testlerinizi yazmak için bir şablon sağlar, böylece her yeni projeye başladığınızda tam yapıyı ve söz dizimini aramanıza gerek kalmaz. İstediğiniz kadar ek test fonksiyonu ve test modülü ekleyebilirsiniz!

Testlerin nasıl çalıştığını keşfetmek için, herhangi bir kodu test etmeden önce şablon test ile deneyler yapacağız. Ardından, yazdığımız bazı kodları çağıran ve davranışının doğru olduğunu doğrulayan gerçek dünya testleri yazacağız.

İki sayıyı toplayacak `adder` adında yeni bir kütüphane projesi oluşturalım:

```console
$ cargo new adder --lib
     Kütüphane `adder` projesi oluşturuldu
$ cd adder
```

`adder` kütüphanenizdeki *src/lib.rs* dosyasının içeriği 11-1 No'lu Listede olduğu gibi görünmelidir.



```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-01/src/lib.rs}}
```



Şimdilik yalnızca `it_works` fonksiyonuna odaklanalım. `#[test]` niteliğini not edin: bu nitelik bu fonksiyonun bir test fonksiyonu olduğunu belirtir, böylece test koşucu bu fonksiyonu bir test olarak ele alır. `tests` modülünde yaygın senaryoları ayarlamaya veya yaygın işlemler gerçekleştirmeye yarayan test dışı fonksiyonlar da olabilir, bu nedenle hangi fonksiyonların test olduğunu her zaman belirlememiz gerekir.

Örnek fonksiyon gövdesi, `result` değişkeninin, 2 ile 2’yi toplamanın sonucunu içerdiğinin 4'e eşit olduğunu doğrulamak için `assert_eq!` makrosunu kullanır. Bu doğrulama, tipik bir test için format örneği olarak işlev görür. Bunu çalıştırarak bu testin geçtiğini görelim.

`cargo test` komutu, projemizdeki tüm testleri çalıştırır; 11-2 No'lu Listede gösterildiği gibi.



```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-01/output.txt}}
```



Cargo testi derledi ve çalıştırdı. `1 test çalıştırılıyor` satırını görüyoruz. Bir sonraki satır, üretilen test fonksiyonunun adı olan `tests::it_works`'ü gösterir ve o testin çalıştırılmasının sonucunun `ok` olduğunu belirtir. Genel özet `test sonucu: ok.` tüm testlerin geçtiğini, `1 geçti; 0 başarısız` kısmı ise kaç testin geçtiğini veya başarısız olduğunu gösterir.

:::info
Bir testi belirli bir durumda çalıştırmamak üzere işaretlemek mümkün; bunu daha sonra bu bölümde [“Belirli İstekte Bulunmadıkça Bazı Testleri Yoksayma”][ignoring] bölümünde ele alacağız. Burada bunu yapmadığımız için, özet `0 yoksayıldı` gösteriyor.
:::

`0 ölçüldü` istatistiği, performansı ölçen kıyaslama testleri içindir. Kıyaslama testleri, bu yazının yazıldığı tarihte yalnızca gecikmeli Rust'ta kullanılabiliyor. Daha fazla bilgi için [kıyaslama testleri hakkında belgeleri][bench] inceleyin.

Ayrıca, yalnızca adının bir dizeyle eşleştiği testleri çalıştırmak için `cargo test` komutuna bir argüman geçirebiliriz; bu, *filtreleme* olarak adlandırılır ve [“Adla Bir Alt Küme Testini Çalıştırma”][subset] bölümünde ele alınacaktır. Burada, çalıştırılan testleri filtrelemediğimiz için, özette `0 filtrelenmiş` görünmektedir.

`Doc-tests adder` ile başlayan test çıktısının sonraki bölümü, herhangi bir belgede bulunan kod örneklerinin sonuçları içindir. Henüz herhangi bir belgelendirme testimiz yok, ancak Rust, API belgelerimizde yer alan herhangi bir kod örneğini derleyebilir. Bu özellik, belgelerinizin ve kodunuzun senkronize olmasına yardımcı olur! **Belgelerde yorumları test olarak yazma** ile ilgili belgeleri [“Belgelerde Yorumlar olarak Testler”][doc-comments] bölümünde tartışacağız. Şimdilik, `Doc-tests` çıktısını göz ardı edelim.

Testi kendi ihtiyaçlarımıza göre özelleştirmeye başlayalım. Önce `it_works` fonksiyonunun adını `exploration` gibi farklı bir adla değiştirelim:

Dosya adı: src/lib.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-01-changing-test-name/src/lib.rs}}
```

Ardından tekrar `cargo test` çalıştırın. Çıktı şimdi `it_works` yerine `exploration` gösteriyor:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-01-changing-test-name/output.txt}}
```

Artık başka bir test ekleyeceğiz, ancak bu sefer başarısız olacak bir test yapacağız! Testler, test fonksiyonunda bir panik olduğunda başarısız olur. Her test yeni bir iş parçacığında çalıştırılır ve ana iş parçacığı, bir test iş parçacığının öldüğünü gördüğünde, test başarısız olarak işaretlenir. Bölüm 9'da, panik yapmanın en basit yolunun `panic!` makrosunun çağrısı olduğunu konuştuk. Yeni testi `another` adında bir fonksiyon olarak girin, böylece *src/lib.rs* dosyanız 11-3 No'lu Listeye benzeyecek.



```rust,panics,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-03/src/lib.rs}}
```



`cargo test` ile testleri tekrar çalıştırın. Çıktının 11-4 No'lu Liste gibi görünmesi gerekir; bu, `exploration` testinin geçtiğini ve `another` testinin başarısız olduğunu gösterir.



```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-03/output.txt}}
```



Yalnızca `ok` yerine `test tests::another` satırı `FAILED` gösteriyor. Bireysel sonuçlar ile özet arasında iki yeni bölüm görünür: ilk bölüm, her bir test başarısızlığının ayrıntılı nedenini gösterir. Bu durumda `another` testinin `panicked at 'Make this test fail'` nedeniyle başarısız olduğunu gösteren bilgiler, *src/lib.rs* dosyasındaki 17. satırda yer alıyor. 

:::warning
İkinci bölüm, yalnızca tüm başarısız testlerin adlarını listeler; bu, birçok test olduğunda ve birçok ayrıntılı başarısız test çıktısı bulunduğunda yararlıdır.
:::

Başarısız bir testi çalıştırarak daha kolay hata ayıklamak için bu adı kullanabiliriz; testlerin nasıl çalıştırılacağı hakkında daha fazla bilgiyi [“Testlerin Nasıl Çalıştırılacağı”][controlling-how-tests-are-run] bölümünde tartışacağız.

En son özet satırında, genel test sonucumuzun `FAILED` olduğunu gösterir. Bir test geçti, bir test başarısız oldu.

Artık test sonuçlarının farklı senaryolarda nasıl göründüğünü gördükten sonra, testlerde kullanışlı olan `panic!` dışındaki bazı makrolara bakalım.

### Sonuçları `assert!` Makrosu ile Kontrol Etme

Standart kütüphane tarafından sağlanan `assert!` makrosu, testte bazı koşulların `true` olarak değerlendirilmesini sağlamak için kullanışlıdır. `assert!` makrosuna Boolean değerine dönüşen bir argüman veriyoruz. Eğer değer `true` ise hiçbir şey olmaz ve test geçer. Eğer değer `false` ise, `assert!` makrosu testi başarısız kılmak için `panic!` çağrısını yapar. 

Bölüm 5'te, 11-5 No'lu Listede tekrarlanan bir `Dikdörtgen` yapısı ve `can_hold` metodunu kullandık. Bu kodu *src/lib.rs* dosyasına koyalım, ardından bununla ilgili bazı testler yazalım.



```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-05/src/lib.rs}}
```



`can_hold` metodu bir Boolean döndürmektedir, bu da `assert!` makrosu için mükemmel bir kullanım durumudur. 11-6 No'lu Listede, boyutu 8 ve yüksekliği 7 olan bir `Dikdörtgen` örneği oluşturarak `can_hold` metodunu kullanan bir test yazacağız ve bunun, boyutu 5 ve yüksekliği 1 olan başka bir `Dikdörtgen` örneğini tutup tutamayacağını kontrol edeceğiz.



```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-06/src/lib.rs:here}}
```



`tests` modülündeki `use super::*;` satırını not edin. `tests` modülü, Bölüm 7'de [“Bir Modül Ağaçında Bir Öğeye Referans Verme Yolları”][paths-for-referring-to-an-item-in-the-module-tree] bölümünde ele aldığımız genellikle standart görünürlük kurallarını takip eden bir modüldür. `tests` modülü bir iç modül olduğu için, dış modüldeki test edilen kodu iç modülün kapsamına dahil etmemiz gerekir. Burada bir glob kullanıyoruz, böylece dış modülde tanımladığımız her şey bu `tests` modülüne erişilebilir.

Testimizi `larger_can_hold_smaller` olarak adlandırdık ve ihtiyaç duyduğumuz iki `Dikdörtgen` örneğini oluşturduk. Ardından `assert!` makrosunu çağırdık ve `larger.can_hold(&smaller)` ifadesinin sonucunu geçtik. Bu ifadenin `true` döndürmesi bekleniyor, bu nedenle testimiz geçmelidir. Hadi bakalım!

```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-06/output.txt}}
```

Başarıyla geçiyor! Şimdi başka bir test ekleyeceğiz, bu sefer daha küçük bir dikdörtgenin daha büyük bir dikdörtgeni tutamayacağını doğrulayan:

Dosya adı: src/lib.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-02-adding-another-rectangle-test/src/lib.rs:here}}
```

`can_hold` fonksiyonunun bu durumda doğru sonucu `false` döndürdüğünden, sonucu `assert!` makrosuna geçmeden önce tersine çevirmemiz gerekir. Sonuç olarak, testimiz `can_hold` `false` döndüğünde geçecektir:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-02-adding-another-rectangle-test/output.txt}}
```

İki test de geçti! Artık kodumuzu bozduğumuzda test sonuçlarımızın nasıl etkileneceğini görelim. `can_hold` metodunun daha büyük olanı daha küçük olanla karşılaştırırken `>` işaretini `

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-07/src/lib.rs}}
```



Bunun geçip geçmediğini kontrol edelim!

```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-07/output.txt}}
```

`add_two(2)` ifadesinin sonucunu tutan `result` adında bir değişken oluşturuyoruz. Ardından, `assert_eq!`'ye `result` ve `4` argümanlarını geçiriyoruz. Bu testin çıktısı `test tests::it_adds_two ... ok` şeklindedir ve `ok` metni testimizin geçtiğini gösterir!

Hata görmemiz için kodumuza bir hata ekleyelim. `add_two` fonksiyonunun içeriğini `3` ekleyecek şekilde değiştirin:

```rust,not_desired_behavior,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-04-bug-in-add-two/src/lib.rs:here}}
```

Testleri tekrar çalıştırın:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-04-bug-in-add-two/output.txt}}
```

Testimiz hatayı yakaladı! `it_adds_two` testi başarısız oldu ve mesaj `assertion `left == right` failed` ile birlikte `left` ve `right` değerlerini gösterdi. Bu mesaj, hata ayıklamaya başlamamıza yardımcı olur: `left` argümanı (burada `add_two(2)` çağrısının sonucu) `5` iken `right` argümanı `4` oldu. Bunun testlerin yoğun olduğu durumlarda özellikle yardımcı olacağını hayal edebilirsiniz.

Bazı dillerde ve test çerçevelerinde eşitlik doğrulama fonksiyonlarının parametrelerine `expected` ve `actual` denir ve argümanların sıralanması önemlidir. Ancak Rust'ta bunlar `left` ve `right` olarak adlandırılır ve beklenen değeri ve kodun ürettiği değeri belirtirken sıralama önemli değildir. Bu testi `assert_eq!(4, result)` şeklinde yazmak, `(left == right)` ifadesinin başarısız olduğu mesajını üretir.

`assert_ne!` makrosu, verilerimizi eşit olmadığında geçer, eşit olduklarında ise başarısız olur. Bu makro, bir değerin ne olacağını bilmediğimiz, ancak kesinlikle ne olmaması gerektiğini bildiğimiz durumlarda en kullanışlıdır. Örneğin, girdiği verilerin bir şekilde değiştirileceğinden emin bir fonksiyonu test ediyorsak ama değişimin nasıl gerçekleşeceği, testleri çalıştırdığımız güne bağlıysa, en iyi doğrulama, fonksiyonun çıktısının girdi ile eşit olmadığını doğrulamaktır.

Arka planda, `assert_eq!` ve `assert_ne!` makroları sırasıyla `==` ve `!=` operatörlerini kullanır. Bu doğrulamalar başarısız olduğunda, bu makrolar argümanlarını hata ayıklama formatıyla yazdırır; bu, karşılaştırılan değerlerin `PartialEq` ve `Debug` özniteliklerini uygulaması gerektiği anlamına gelir. Tüm ilkel türler ve çoğu standart kütüphane türü bu öznitelikleri uygular. 

:::tip
Kendi tanımladığınız yapılar ve enum'lar için, bu türlerin eşitliğini doğrulamak üzere `PartialEq` uygulamanız gerekir. Hata durumunda değerleri yazdırabilmek için ayrıca `Debug` uygulamanız gerekir. Her iki öznitelik de türetilebilir öznitelikler olduğundan, bölüm 5'te 5-12 No'lu Listede bahsedildiği üzere bu genellikle `#[derive(PartialEq, Debug)]` ifadesini yapınızın ya da enum'un tanımına eklemek kadar basittir.
:::

Bu ve diğer türetilebilir öznitelikler hakkında daha fazla bilgi için Ek C'yi, [“Türetilebilir Özellikler”][derivable-traits] inceleyin.

### Özel Başarısızlık Mesajları Eklemek

Ayrıca, başarısızlık mesajıyla birlikte yazdırılacak özel bir mesajı `assert!`, `assert_eq!` ve `assert_ne!` makrolarına isteğe bağlı argümanlar olarak ekleyebilirsiniz. Gerekli argümanların ardından belirtilen tüm argümanlar, bölüm 8'de [“`+` Operatörü veya `format!` Makrosu ile Birleştirme”][concatenation-with-the--operator-or-the-format-macro] tartışılan `format!` makrosuna iletilir, yani `{}` yer tutucuları ve o yer tutuculara geçecek değerler içeren bir format dizesi geçebilirsiniz. Özel mesajlar, bir doğrulamanın ne anlama geldiğini belgelerken faydalıdır; bir test başarısız olduğunda, kodla ilgili sorunun ne olduğunu daha iyi anlayacaksınız.

Örneğin, bir kişinin ismiyle selamlayan bir fonksiyonumuz olduğunu ve bu fonksiyona geçen ismin çıktıda yer alıp almadığını test etmek istediğimizi varsayalım:

Dosya adı: src/lib.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-05-greeter/src/lib.rs}}
```

Bu programın gereksinimleri henüz görüşülmedi ve `selam` metninin selamlamanın başında değişeceğinden oldukça eminiz. Testin gereksinimler değiştiğinde güncellenmesine gerek kalmaması için, `greeting` fonksiyonundan dönen değer ile tam eşitlik kontrol etmek yerine, çıktının girdi parametresinin metni içerdiğini doğrulamak istiyoruz.

:::danger
Şimdi, `greeting` fonksiyonunun ismi dışarıda bırakacak şekilde kodu bozalım, böylece varsayılan test başarısızlığının nasıl göründüğünü göreceğiz:
:::

```rust,not_desired_behavior,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-06-greeter-with-bug/src/lib.rs:here}}
```

Bu testi çalıştırdığımızda aşağıdaki sonucu alırız:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-06-greeter-with-bug/output.txt}}
```

Bu sonuç, sadece assert'in başarısız olduğunu ve hangi satırda yer aldığını belirtmektedir. Daha yararlı bir başarısızlık mesajı, `greeting` fonksiyonunun değerini yazdırır. Şimdi, `greeting` fonksiyonundan aldığımız gerçek değeri içeren format dizesinden oluşan özel bir başarısızlık mesajı ekleyelim:

```rust,ignore
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-07-custom-failure-message/src/lib.rs:here}}
```

Şimdi testimizi çalıştırdığımızda, daha bilgilendirici bir hata mesajı alacağız:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-07-custom-failure-message/output.txt}}
```

Gerçekten de aldığımız değeri test çıktısında görüyoruz, bu durum beklediğimizle ne olduğunu anlamamızda yardımcı olacaktır.

### `should_panic` ile Panik Kontrolü

Dönüş değerlerini kontrol etmenin yanı sıra, kodumuzun hata durumlarını beklediğimiz gibi ele alıp almadığını kontrol etmek de önemlidir. Örneğin, Bölüm 9'da oluşturduğumuz `Guess` türünü ele alalım, Liste 9-13. `Guess` kullanan diğer kodlar, **`Guess` örneklerinin yalnızca 1 ile 100 arasındaki değerleri içereceği garantisine bağımlıdır.** Bu aralık dışındaki bir değerle `Guess` örneği oluşturmaya çalışmanın panik yaratacağını garanti eden bir test yazabiliriz.

:::tip
Bu tür testleri yazarken, panik yaratıp yaratmadığını kontrol etmenin önemini unutmayın.
:::

Bunu, test fonksiyonumuza `should_panic` niteliğini ekleyerek yaparız. Eğer fonksiyon içindeki kod panik yaratırsa test geçer; fonksiyon içindeki kod panik yaratmazsa test başarısız olur.

Liste 11-8, `Guess::new`'in hata koşullarının beklediğimiz zamanlarda oluştuğunu kontrol eden bir testi göstermektedir.



```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-08/src/lib.rs}}
```



`#[test]` niteliğinden sonra ve uygulandığı test fonksiyonundan önce `#[should_panic]` niteliğini ekliyoruz. **Bu testin başarıyla geçtiğinde sonuç nasıl olur?**

```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-08/output.txt}}
```

Güzel! Şimdi, `new` fonksiyonunun değeri 100'den büyükse panik yaratacağı koşulu kaldırarak kodumuza bir hata ekleyelim:

```rust,not_desired_behavior,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-08-guess-with-bug/src/lib.rs:here}}
```

Liste 11-8'deki testi çalıştırdığımızda, bu test başarısız olacak:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-08-guess-with-bug/output.txt}}
```

Bu durumda çok yardımcı bir mesaj almazdık, ancak test fonksiyonuna baktığımızda `#[should_panic]` ile anotasyonlandığını görüyoruz. **Aldığımız başarısızlık, test fonksiyonundaki kodun bir panik yaratmadığı anlamına geliyor.**

:::warning
`should_panic` kullanan testler kesin olmayabilir. Bir `should_panic` testi, beklediğimizden farklı bir nedenle panik yaratsa bile geçerli sayılacaktır.
:::

`should_panic` testlerini daha kesin hale getirmek için `should_panic` niteliğine isteğe bağlı bir `expected` parametresi ekleyebiliriz. Test çerçevesi, başarısızlık mesajının sağlanan metni içerdiğinden emin olacaktır. Örneğin, Liste 11-9'da `new` fonksiyonunun, değer çok küçük veya çok büyük olduğunda farklı mesajlarla panik yarattığı değiştirilmiş kodu düşünelim.



```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-09/src/lib.rs:here}}
```



Bu test geçecektir çünkü `should_panic` niteliğinin `expected` parametresinde belirttiğimiz değer, **`Guess::new` fonksiyonunun panik mesajının bir alt dizesidir.** Beklediğimiz tüm panik mesajını belirtebiliriz, ki bu durumda `Guess değeri 100'den küçük veya ona eşit olmalıdır, 200 alındı` olur. Ne belirleyeceğiniz, panik mesajının ne kadarının benzersiz veya dinamik olduğuna ve testinizin ne kadar kesin olmasını istediğinize bağlıdır. Bu durumda, panik mesajının bir alt dizesi, test fonksiyonundaki kodun `else if value > 100` durumunu çalıştırdığını garanti etmek için yeterlidir.

:::note
**`expected` mesajı olan bir `should_panic` testinin başarısız olduğunda ne olacağını görmek için, değerlerin `if value  100` bloklarının gövdelerini değiştirerek tekrar hata girelim:**
:::

```rust,ignore,not_desired_behavior
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-09-guess-with-panic-msg-bug/src/lib.rs:here}}
```

Bu kez `should_panic` testini çalıştırdığımızda, başarısız olacak:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-09-guess-with-panic-msg-bug/output.txt}}
```

Başarısızlık mesajı, bu testin beklediğimiz gibi panik yarattığını gösterir, ancak panik mesajı beklediğimiz dizeyi `100'e eşit veya daha az` içermemektedir. **Bu durumda aldığımız panik mesajı `Guess değeri 1'den büyük veya ona eşit olmalıdır, 200 alındı.`** Artık hatamızın nerede olduğunu bulmaya başlayabiliriz!

---

### Testlerde `Result` Kullanımı

Şimdiye kadar tüm testlerimiz başarısız olduklarında panik yaratıyor. **`Result` kullanan testler de yazabiliriz!** İşte, Liste 11-1'deki testin, panik yaratmak yerine `Result` kullanacak şekilde yeniden yazılmış hali:

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-10-result-in-tests/src/lib.rs:here}}
```

`it_works` fonksiyonu artık **`Result`** dönüş türüne sahip. Fonksiyonun gövdesinde, `assert_eq!` makrosunu çağırmak yerine, test geçerse `Ok(())` döndürüyoruz ve test başarısız olursa içinde `String` olan bir `Err` döndürüyoruz.

Testleri `Result` döndürecek şekilde yazmak, test gövdesinde soru işareti operatörünü kullanmanıza olanak tanır, bu da içindeki herhangi bir işlem `Err` varyantını dönerse başarısız olacağı testler yazmak için uygun bir yol olabilir. 

:::info
**`Result` kullanan testlerde `#[should_panic]` niteliğini kullanamazsınız. Bir işlemin `Err` varyantını döndürdüğünü doğrulamak için, `Result` değerine üzerindeki soru işareti operatörünü *kullanmayın*. Bunun yerine, `assert!(value.is_err())` kullanın.**
:::

Artık test yazmanın birkaç yolunu bildiğinize göre, testlerimizi çalıştırdığımızda neler olduğuna bakalım ve `cargo test` ile kullanabileceğimiz farklı seçenekleri keşfedelim.