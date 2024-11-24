## Test Organizasyonu

Bölümün başında belirtildiği gibi, test etme karmaşık bir disiplindir ve farklı insanlar farklı terminoloji ve organizasyon kullanır. Rust topluluğu, testleri iki ana kategori açısından düşünmektedir: birim testleri ve entegrasyon testleri. **Birim testleri**, daha küçük ve daha odaklıdır; bir modülü izole bir şekilde bir seferde test eder ve özel arayüzleri test edebilir. **Entegrasyon testleri**, kütüphanenize tamamen dışsal olup, kodunuzu herhangi bir başka dış kodun yapacağı gibi sadece genel arayüzü kullanarak ve potansiyel olarak her testte birden fazla modülü çalıştırarak kullanır.

Her iki tür testi yazmak, kütüphanenizdeki parçaların ayrı ve birlikte beklediğiniz gibi çalıştığından emin olmak için önemlidir.

### Birim Testleri

Birim testlerinin amacı, kodun her bir birimini geri kalan koddan izole bir şekilde test ederek, kodun nerede beklendiği gibi çalışmadığını hızlı bir şekilde belirlemektir. Birim testlerini, test ettikleri kodun bulunduğu her dosyada *src* dizini içinde bulacaksınız. Gelenek, her dosyada test işlevlerini içeren `tests` adlı bir modül oluşturmak ve modülü `cfg(test)` ile not etmek şeklindedir.

#### Testler Modülü ve `#[cfg(test)]`

`tests` modülündeki `#[cfg(test)]` notu, Rust'a test kodunu yalnızca `cargo test` çalıştırıldığında derlemesi ve çalıştırması talimatını verir; `cargo build` çalıştırıldığında değil. Bu, yalnızca kütüphaneyi derlemek istediğinizde derleme süresini tasarruf etmenizi sağlar ve testlerin dahil edilmediği için sonuç derlenmiş eserinde alan tasarrufu sağlar. :::info Entegrasyon testlerinin farklı bir dizinde bulunduğu için `#[cfg(test)]` notuna ihtiyacı yoktur. Ancak, birim testleri kodla aynı dosyalarda bulunduğu için testlerin derlenmiş sonuçta yer almadığını belirtmek için `#[cfg(test)]` kullanacaksınız.

Bu bölümün ilk bölümünde yeni oluşturduğumuz `adder` projesini oluşturduğumuzda Cargo'nun bizim için bu kodu oluşturduğunu hatırlayın:

Dosya Adı: src/lib.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-01/src/lib.rs}}
```

Otomatik olarak oluşturulan `tests` modülündeki `cfg` niteliği, *konfigürasyon* anlamına gelir ve Rust'a sonraki öğenin belirli bir konfigürasyon seçeneği verilirse yalnızca dahil edilmesi gerektiğini söyler. Bu durumda, konfigürasyon seçeneği, testleri derlemek ve çalıştırmak için Rust tarafından sağlanan `test`'tir. `cfg` niteliğini kullanarak, Cargo test kodumuzu yalnızca `cargo test` ile aktif olarak çalıştırdığımızda derler. Bu, `#[test]` ile işaretlenmiş işlevler ile birlikte bu modül içindeki olası yardımcı işlevleri de içerir.

#### Özel İşlevlerin Test Edilmesi

Test topluluğu içinde özel işlevlerin doğrudan test edilip edilemeyeceği konusunda tartışmalar var ve diğer diller özel işlevleri test etmeyi zorlaştırır veya imkansız hale getirir. Hangi test ideolojisine sadık kalırsanız kalın, Rust'ın gizlilik kuralları özel işlevleri test etmenize olanak tanır. **Özel işlev** `internal_adder` olan 11-12 numaralı Listede bulunan kodu düşünün.



```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-12/src/lib.rs}}
```



`internal_adder` işlevinin `pub` olarak işaretlenmediğini unutmayın. Testler, yalnızca Rust kodudur ve `tests` modülü başka bir modüldür. [“Modül Ağaçlarında Bir Öğeye Atıfta Bulunma Yolları”][paths] bölümünde tartıştığımız gibi, çocuk modüllerdeki öğeler, önceki modüllerdeki öğeleri kullanabilir. Bu testte, `tests` modülündeki ebeveynin öğelerini kapsam içine almak için `use super::*` kullanıyoruz, ardından test `internal_adder`'ı çağırabilir. :::warning Özel işlevlerin test edilmesi gerektiğini düşünmüyorsanız, Rust'ta bunu yapmaya zorlayacak hiçbir şey yoktur.

### Entegrasyon Testleri

Rust'ta, entegrasyon testleri kütüphanenize tamamen dışsaldır. Kütüphanenizi, diğer herhangi bir kodun yapacağı gibi kullanırlar, bu da yalnızca kütüphanenizin genel API'sinin bir parçası olan işlevleri çağırabilecekleri anlamına gelir. Amaçları, kütüphanenizin birçok parçasının birlikte doğru bir şekilde çalışıp çalışmadığını test etmektir. Kendi başına doğru çalışan kod birimleri entegre edildiğinde sorun yaşayabilir, bu nedenle entegre kodun test kapsamı da önemlidir. Entegrasyon testleri oluşturmak için öncelikle bir *tests* dizinine ihtiyacınız var.

#### *tests* Dizin Yapısı

Proje dizinimizin üst düzeyinde, *src* dizininin yanında bir *tests* dizini oluşturuyoruz. Cargo, bu dizinde entegrasyon test dosyalarını arar. İstediğimiz kadar test dosyası oluşturabiliriz ve Cargo her dosyayı bağımsız bir crate olarak derleyecektir.

Bir entegrasyon testi oluşturalım. 11-12 numaralı Listede bulunan kod hala *src/lib.rs* dosyasında, bir *tests* dizini oluşturun ve *tests/integration_test.rs* adıyla yeni bir dosya oluşturun. Dizin yapınız şöyle görünmelidir:

```text
adder
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── tests
    └── integration_test.rs
```

11-13 numaralı Listede bulunan kodu *tests/integration_test.rs* dosyasına girin.



```rust,ignore
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-13/tests/integration_test.rs}}
```



*tests* dizinindeki her dosya ayrı bir crate olduğundan, kütüphanemizi her test crate'inin kapsamına almak zorundayız. Bu nedenle, birim testlerinde ihtiyaç duymadığımız için, kodun en üstüne `use adder::add_two;` ekliyoruz.

*tests/integration_test.rs* dosyasındaki hiçbir kodu `#[cfg(test)]` ile notlamak zorunda değiliz. Cargo, *tests* dizinini özel olarak işleyerek yalnızca `cargo test` çalıştırıldığında bu dizindeki dosyaları derler. Şimdi `cargo test` çalıştırın:

```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-13/output.txt}}
```

Çıktının üç bölümü birim testler, entegrasyon testi ve belge testlerini içerir. Bir bölümde herhangi bir test başarısız olursa, sonraki bölümler çalıştırılmayacaktır. Örneğin, birim testi başarısız olursa, entegrasyon ve belge testleri için herhangi bir çıktı olmayacaktır çünkü bu testler yalnızca tüm birim testleri geçiyorsa çalıştırılacaktır.

:::note Birim testleri için ilk bölüm, şimdiye kadar gördüğümüz gibidir: 11-12 numaralı Listede eklediğimiz `internal` adında bir birim testi için bir satır ve ardından birim testleri için bir özet satırı vardır.

Entegrasyon testleri bölümü `Running tests/integration_test.rs` satırıyla başlar. Ardından, o entegrasyon testindeki her test işlevi için bir satır ve entegrasyon testinin sonuçları için bir özet satırı gelir, bu satır `Doc-tests adder` bölümü başlamadan hemen öncedir.

Her entegrasyon test dosyasının kendi bölümü vardır, bu nedenle *tests* dizinine daha fazla dosya eklersek, daha fazla entegrasyon testi bölümü olacaktır.

Belirli bir entegrasyon test işlevini çalıştırmak için, test işlevinin adını `cargo test`'e bir argüman olarak belirtebiliriz. Belirli bir entegrasyon test dosyasındaki tüm testleri çalıştırmak için, `cargo test` komutunun `--test` argümanını kullanarak dosya adını ekleyin:

```console
{{#include ../listings/ch11-writing-automated-tests/output-only-05-single-integration/output.txt}}
```

Bu komut, yalnızca *tests/integration_test.rs* dosyasındaki testleri çalıştırır.

#### Entegrasyon Testlerinde Alt Modüller

Daha fazla entegrasyon testi ekledikçe, bunları organize etmeye yardımcı olmak için *tests* dizininde daha fazla dosya oluşturmak isteyebilirsiniz; örneğin, test işlevlerini test ettikleri işlevselliklerine göre gruplandırabilirsiniz. Daha önce belirttiğimiz gibi, *tests* dizinindeki her dosya kendine ait bağımsız bir crate olarak derlenir, bu da son kullanıcıların crate'inizi kullanacağı şekilde ayrı kapsamlar oluşturmaya yarar. Ancak, bu, *tests* dizinindeki dosyaların, 7. Bölüm'de modülleri ve dosyaları ayırma ile ilgili edinilen bilgilerin aksine, *src* dosyalarında olduğu gibi aynı davranışı paylaşmadığı anlamına gelir.

*tests* dizinindeki dosyaların farklı davranışı, birden fazla entegrasyon test dosyasında kullanılacak bir dizi yardımcı işleve sahip olduğunuzda, bu işlevleri ortak bir modüle çıkartma işlemi yaptığınızda en belirgin hale gelir. Örneğin, *tests/common.rs* oluşturursak ve içinde `setup` adında bir işlev yerleştirirsek, `setup` işlevini birden fazla test işlevinden çağırmak istediğimiz bazı kodları ekleyebiliriz:

Dosya Adı: tests/common.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-12-shared-test-code-problem/tests/common.rs}}
```

Testleri tekrar çalıştırdığımızda, *common.rs* dosyası için test çıktılarına yeni bir bölüm göreceğiz, bu dosyanın hiç test işlevi içermediğinden veya `setup` işlevini hiçbir yerden çağırmadığımızdan dolayı:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-12-shared-test-code-problem/output.txt}}
```

Test sonuçlarında `running 0 tests` ile birlikte `common`'ın görünmesi, istemediğimiz bir durum. Tekrar sadece diğer entegrasyon test dosyalarıyla bazı kodları paylaşmak istemiştik. `common`'ın test çıktısında görünmesini önlemek için, *tests/common.rs* oluşturmak yerine, *tests/common/mod.rs* oluşturacağız. Proje dizini şimdi şöyle görünüyor:

```text
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── tests
    ├── common
    │   └── mod.rs
    └── integration_test.rs
```

Bu, Rust'ın da anlayabileceği eski bir isimlendirme kuralıdır ve bahsettiğimiz [“Alternatif Dosya Yolları”][alt-paths] bölümünde açıklanmıştır. Dosyanın bu şekilde adlandırılması, Rust'a `common` modülünü bir entegrasyon test dosyası olarak değerlendirmemesi talimatını verir. `setup` işlevi kodunu *tests/common/mod.rs* içerisine taşıdığımızda ve *tests/common.rs* dosyasını sildiğimizde, test çıktısındaki bölüm artık görünmeyecektir. *tests* dizininin alt dizinlerindeki dosyalar bağımsız crate'ler olarak derlenmez veya test çıktısında bölümleri bulunmaz.

*tests/common/mod.rs* oluşturduktan sonra, entegrasyon test dosyalarından herhangi birinden modül olarak kullanabiliriz. İşte *tests/integration_test.rs* içindeki `it_adds_two` testinden `setup` işlevini çağırmanın bir örneği:

Dosya Adı: tests/integration_test.rs

```rust,ignore
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-13-fix-shared-test-code-problem/tests/integration_test.rs}}
```

`mod common;` ifadesinin, 7-21 numaralı Listede gösterdiğimiz modül açıklamasıyla aynı olduğunu not edin. Daha sonra, test işlevinde, `common::setup()` işlevini çağırabiliriz.

#### İkili Crate'ler için Entegrasyon Testleri

Eğer projemiz sadece bir *src/main.rs* dosyası içeren bir ikili crate ise ve *src/lib.rs* dosyası yoksa, *tests* dizininde entegrasyon testleri oluşturamaz ve *src/main.rs* dosyasında tanımlanan işlevleri kapsam içine alamayız. Yalnızca kütüphane crate'leri, diğer crate'lerin kullanabileceği işlevleri sunar; ikili crate'ler kendi başlarına çalıştırılmak için tasarlanmıştır.

Bu, Rust projelerinin ikili sağladıkları için yalnızca bir *src/main.rs* dosyasına sahip olmalarının nedenlerinden biridir ve bu dosya, *src/lib.rs* dosyasında bulunan mantığı çağırır. Bu yapı ile entegrasyon testleri *kütüphane crate'ini* test edebilir ve `use` ile önemli işlevselliği kullanılabilir hale getirmek için sunabilir. Önemli işlevsellik çalışıyorsa, *src/main.rs* dosyasındaki küçük kod parçası da çalışır ve bu küçük kod parçasının test edilmesine gerek yoktur.

## Özet

Rust'ın test etme özellikleri, kodun nasıl çalışması gerektiğini belirlemenin bir yolunu sağlar, böylece değişiklikler yapmanıza rağmen beklediğiniz gibi çalışmaya devam eder. **Birim testleri**, kütüphanenin farklı parçalarını ayrı ayrı işler ve özel uygulama detaylarını test edebilir. **Entegrasyon testleri**, kütüphanenin birçok parçasının birlikte doğru bir şekilde çalışıp çalışmadığını kontrol eder ve kodu dış kodun kullanacağı şekilde test etmek için kütüphanenin genel API'sını kullanır. Rust'ın tür sistemi ve sahiplik kuralları bazı türde hataları önlemeye yardımcı olsa da, testler hala kodunuzun beklenildiği gibi davranmasıyla ilgili mantık hatalarını azaltmak için önemlidir.

Bu bölümde ve önceki bölümlerde öğrendiğiniz bilgileri bir projede çalışmak için birleştirelim!

[paths]: ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html
[separating-modules-into-files]: ch07-05-separating-modules-into-different-files.html
[alt-paths]: ch07-05-separating-modules-into-different-files.html#alternate-file-paths