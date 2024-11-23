## Cargo Çalışma Alanları

Bölüm 12'de, bir ikili crate ve bir kütüphane crate'i içeren bir paket oluşturduk. Projeniz geliştikçe, kütüphane crate'inin büyümeye devam ettiğini görebilirsiniz ve paketinizi daha fazla kütüphane crate'ine ayırmak isteyebilirsiniz. Cargo, birlikte geliştirilen birden fazla ilgili paketi yönetmenize yardımcı olabilecek **çalışma alanları** adı verilen bir özellik sunar.

### Bir Çalışma Alanı Oluşturma

Bir **çalışma alanı**, aynı *Cargo.lock* ve çıktı dizinini paylaşan bir paket setidir. 

:::tip
Bir çalışma alanı kullanarak bir proje oluşturun - yapının üzerinde yoğunlaşabilmemiz için önemsiz kod kullanacağız.
:::

Bir çalışma alanını yapılandırmanın birden fazla yolu vardır, bu yüzden sadece bir yaygın yolu göstereceğiz. Bir ikili ve iki kütüphane içeren bir çalışma alanımız olacak. Ana işlevselliği sağlayacak olan ikili, iki kütüphaneye bağımlı olacaktır. Bir kütüphane bir `add_one` fonksiyonu sağlayacak ve ikinci kütüphane bir `add_two` fonksiyonu. Bu üç crate aynı çalışma alanının parçası olacak. Öncelikle çalışma alanı için yeni bir dizin oluşturacağız:

```console
$ mkdir add
$ cd add
```

Sonra, *add* dizininde, tüm çalışma alanını yapılandıracak *Cargo.toml* dosyasını oluşturuyoruz. Bu dosya bir `[package]` bölümüne sahip olmayacak. Bunun yerine, çalışma alanına üye eklememizi sağlayacak `[workspace]` bölümüne sahip olacak. Ayrıca, çalışma alanımızda Cargo'nun çözücü algoritmasının en son ve en iyi sürümünü kullanmak için `resolver`'ı `"2"` olarak ayarlamayı hedefliyoruz.

ikili crate'imiz için paketin yolunu belirterek; bu durumda, o yol *adder*:

Dosya Adı: Cargo.toml

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-01-workspace/add/Cargo.toml}}
```

Sonra, *add* dizininde `cargo new` çalıştırarak `adder` ikili crate'ini oluşturacağız:

```console
$ cargo new adder
    İkili (uygulama) `adder` paketi oluşturuluyor
      `adder`'ı `file:///projects/add` çalışma alanına üye olarak ekliyor
```

`cargo new` komutunu bir çalışma alanında çalıştırmak, ayrıca yeni oluşturulan paketi de [workspace] tanımındaki `members` anahtarına otomatik olarak ekler, şöyle:

```toml
{{#include ../listings/ch14-more-about-cargo/output-only-01-adder-crate/add/Cargo.toml}}
```

Bu noktada, `cargo build` komutunu çalıştırarak çalışma alanını derleyebiliriz. *add* dizininizdeki dosyalar şu şekilde görünmelidir:

```text
├── Cargo.lock
├── Cargo.toml
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

Çalışma alanı, derlenmiş dosyaların yerleştirileceği üst düzeyde bir **target** dizinidir; `adder` paketinin kendi **target** dizini yoktur. *adder* dizininin içinden `cargo build` çalıştırmış olsak bile, derlenmiş dosyalar yine *add/target* dizinine değil, *add/adder/target* dizinine yerleştirilecektir. Cargo, bir çalışma alanındaki **target** dizinini bu şekilde yapılandırır çünkü bir çalışma alanındaki crate'lerin birbirine bağımlı olması amaçlanmıştır. 

> **Not:** Her crate kendi **target** dizinine sahip olsaydı, her crate diğer crate'lerin her birini yeniden derlemek zorunda kalır ve bunları kendi **target** dizinine yerleştirmek için kaynakları harcardı. Tek bir **target** dizinini paylaşarak, crate'ler gereksiz yeniden derlemeleri önleyebilir.

### Çalışma Alanında İkinci Paketi Oluşturma

Sonra, çalışma alanında `add_one` adında başka bir üye paketi oluşturalım. Üst düzey *Cargo.toml* dosyasını, `members` listesine *add_one* yolunu belirtecek şekilde değiştirin:

Dosya Adı: Cargo.toml

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-02-workspace-with-two-crates/add/Cargo.toml}}
```

Sonra `add_one` adında yeni bir kütüphane crate'i oluşturalım:

```console
$ cargo new add_one --lib
    Kütüphane `add_one` paketi oluşturuluyor
      `add_one`'ı `file:///projects/add` çalışma alanına üye olarak ekliyor
```

*add* dizininiz artık şu dizinlere ve dosyalara sahip olmalıdır:

```text
├── Cargo.lock
├── Cargo.toml
├── add_one
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

*add_one/src/lib.rs* dosyasında bir `add_one` fonksiyonu ekleyelim:

Dosya Adı: add_one/src/lib.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch14-more-about-cargo/no-listing-02-workspace-with-two-crates/add/add_one/src/lib.rs}}
```

Artık `adder` paketimizi, kütüphanemizi içeren `add_one` paketine bağımlı hale getirebiliriz. Öncelikle, *adder/Cargo.toml* dosyasına `add_one` için bir yol bağımlılığı eklememiz gerekiyor:

Dosya Adı: adder/Cargo.toml

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-02-workspace-with-two-crates/add/adder/Cargo.toml:6:7}}
```

Cargo, çalışma alanındaki crate'lerin birbirine bağımlı olacağını varsaymaz, bu yüzden bağımlılık ilişkilerini açıkça belirtmemiz gerekir.

Sonra, `adder` crate'inde `add_one` crate'indeki `add_one` fonksiyonunu kullanalım. *adder/src/main.rs* dosyasını açın ve en üste yeni `add_one` kütüphane crate'ini kapsam içine almak için bir `use` satırı ekleyin. Ardından `main` fonksiyonunu, Listing 14-7'deki gibi `add_one` fonksiyonunu çağıracak şekilde değiştirin.



```rust,ignore
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-07/add/adder/src/main.rs}}
```



Çalışma alanını `cargo build` komutunu üst düzey *add* dizininde çalıştırarak derleyelim!

```console
$ cargo build
   add_one v0.1.0 (file:///projects/add/add_one) derleniyor
   adder v0.1.0 (file:///projects/add/adder) derleniyor
    `dev` profili [optimize edilmemiş + hata ayıklama bilgisi] hedef(ler) 0.22s içinde tamamlandı
```

*add* dizinindaki ikili crate'i çalıştırmak için, kullanmak istediğimiz paketi `-p` argümanını ve paket adını kullanarak `cargo run` ile belirtebiliriz:

```console
$ cargo run -p adder
    `dev` profili [optimize edilmemiş + hata ayıklama bilgisi] hedef(ler) 0.00s içinde tamamlandı
     `target/debug/adder` çalıştırılıyor
Merhaba, dünya! 10 artı bir 11'dir!
```

Bu, *adder/src/main.rs* içindeki kodu çalıştırır; bu kod `add_one` crate'ine bağımlıdır.

#### Çalışma Alanında Dış Bir Pakete Bağımlı Olma

Workspace içinde yalnızca bir *Cargo.lock* dosyası olduğunu fark edin; her crate dizininde ayrı bir *Cargo.lock* yoktur. Bu, tüm crate'lerin tüm bağımlılıklarının aynı sürümünü kullandığını garanti eder. Eğer *adder/Cargo.toml* ve *add_one/Cargo.toml* dosyalarına `rand` paketini eklersek, Cargo her ikisini de bir `rand` sürümüne çözecek ve bunu tek bir *Cargo.lock* dosyasında kaydedecektir. Çalışma alanındaki tüm crate'lerin aynı bağımlılıkları kullanması, her zaman birbiriyle uyumlu olmalarını sağlar. 

:::info
`add_one` crate'inde `rand` crate'ini kullanabilmemiz için, *add_one/Cargo.toml* dosyasındaki `[dependencies]` bölümüne `rand` crate'ini ekleyelim:
:::

Dosya Adı: add_one/Cargo.toml

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-03-workspace-with-external-dependency/add/add_one/Cargo.toml:6:7}}
```

Artık *add_one/src/lib.rs* dosyasına `use rand;` ekleyebiliriz ve *add* dizininde `cargo build` komutunu çalıştırarak tüm çalışma alanını derlemek, `rand` crate'ini dahil eder ve derler. Kapsam içine aldığımız `rand`'i referans almadığımız için bir uyarı alacağız:

```console
$ cargo build
    crate.io dizinini güncelliyor
  rand v0.8.5 indirildi
   --snip--
   rand v0.8.5 derleniyor
   add_one v0.1.0 (file:///projects/add/add_one) derleniyor
uyarı: kullanılmayan import: `rand`
 --> add_one/src/lib.rs:1:5
  |
1 | use rand;
  |     ^^^^
  |
  = not: `#[warn(unused_imports)]` varsayılan olarak açık

uyarı: `add_one` (lib) 1 uyarı üretti (1 öneriyi uygulamak için `cargo fix --lib -p add_one` çalıştırın)
   adder v0.1.0 (file:///projects/add/adder) derleniyor
    `dev` profili [optimize edilmemiş + hata ayıklama bilgisi] hedef(ler) 0.95s içinde tamamlandı
```

Üst düzey *Cargo.lock* artık `add_one` paketinin `rand` bağımlılığı hakkında bilgi içermektedir. Ancak, çalışma alanında `rand` bir yerlerde kullanılmış olmasına rağmen, başka crate'lerde kullanabilmemiz için `rand`'ı bu crate'lerin *Cargo.toml* dosyalarına da eklememiz gerekir. 

:::warning
Örneğin, `adder` paketinin *adder/src/main.rs* dosyasına `use rand;` eklersek, bir hata alırız:
:::

```console
$ cargo build
  --snip--
   adder v0.1.0 (file:///projects/add/adder) derleniyor
hata[E0432]: çözülmemiş import `rand`
 --> adder/src/main.rs:2:5
  |
2 | use rand;
  |     ^^^^ dış bir crate yok `rand`
```

Bunu düzeltmek için, *adder* paketi için *Cargo.toml* dosyasını düzenleyin ve `rand`'ın aynı zamanda bir bağımlılık olduğunu belirtin. `adder` paketini derlemek, `adder` için *Cargo.lock* dosyasına `rand`'ı ekler; ancak `rand`'ın başka bir kopyası indirilmeyecek. Cargo, çalışma alanındaki her pakette `rand` paketini kullanan her crate'in aynı sürümü kullanmasını sağlayacaktır; yeter ki uyumlu `rand` sürümleri belirtmiş olsunlar, bu da bize alan kazandırır ve çalışma alanındaki crate'lerin uyumlu olmasını garanti eder.

Eğer çalışma alanındaki crate'ler, aynı bağımlılığın uyumsuz sürümlerini belirtirse, Cargo her birini çözecek, ancak yine de mümkün olduğunca az sürümle çözüm bulmaya çalışacaktır.

#### Bir Çalışma Alanına Test Ekleme

Başka bir iyileştirme olarak, `add_one` crate'indeki `add_one::add_one` fonksiyonu için bir test ekleyelim:

Dosya Adı: add_one/src/lib.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch14-more-about-cargo/no-listing-04-workspace-with-tests/add/add_one/src/lib.rs}}
```

Şimdi üst düzey *add* dizininde `cargo test` çalıştırın. Bu tür bir çalışma alanında `cargo test` çalıştırmak, çalışma alanındaki tüm crate'lerin testlerini çalıştıracaktır:

```console
$ cargo test
   add_one v0.1.0 (file:///projects/add/add_one) derleniyor
   adder v0.1.0 (file:///projects/add/adder) derleniyor
    `test` profili [optimize edilmemiş + hata ayıklama bilgisi] hedef(ler) 0.20s içinde tamamlandı
     Birim testleri src/lib.rs (target/debug/deps/add_one-f0253159197f7841) çalıştırılıyor

1 test çalıştırılıyor
test tests::it_works ... ok

test sonucu: ok. 1 başarı; 0 başarısız; 0 göz ardı; 0 ölçülen; 0 filtrelenen; 0.00s içinde tamamlandı

     Birim testleri src/main.rs (target/debug/deps/adder-49979ff40686fa8e) çalıştırılıyor

0 test çalıştırılıyor

test sonucu: ok. 0 başarı; 0 başarısız; 0 göz ardı; 0 ölçülen; 0 filtrelenen; 0.00s içinde tamamlandı

   Doküman testleri add_one

0 test çalıştırılıyor

test sonucu: ok. 0 başarı; 0 başarısız; 0 göz ardı; 0 ölçülen; 0 filtrelenen; 0.00s içinde tamamlandı
```

Çıktının ilk bölümü, `add_one` crate'indeki `it_works` testinin geçtiğini göstermektedir. Sonraki bölüm, `adder` crate'inde sıfır test bulunduğunu ve son bölümde, `add_one` crate'indeki sıfır dokümantasyon testinin bulunduğunu gösteriyor.

:::note
Ayrıca, üst düzey dizinden `-p` bayrağını kullanarak ve test etmek istediğimiz crate'in adını belirterek, çalışma alanındaki belirli bir crate için testleri çalıştırabiliriz:
:::

```console
$ cargo test -p add_one
    `test` profili [optimize edilmemiş + hata ayıklama bilgisi] hedef(ler) 0.00s içinde tamamlandı
     Birim testleri src/lib.rs (target/debug/deps/add_one-b3235fea9a156f74) çalıştırılıyor

1 test çalıştırılıyor
test tests::it_works ... ok

test sonucu: ok. 1 başarı; 0 başarısız; 0 göz ardı; 0 ölçülen; 0 filtrelenen; 0.00s içinde tamamlandı

   Doküman testleri add_one

0 test çalıştırılıyor

test sonucu: ok. 0 başarı; 0 başarısız; 0 göz ardı; 0 ölçülen; 0 filtrelenen; 0.00s içinde tamamlandı
```

Bu çıktı, `cargo test`'in yalnızca `add_one` crate'indeki testleri çalıştırdığını ve `adder` crate testlerini çalıştırmadığını gösterir.

Eğer çalışma alanındaki crate'leri [crates.io](https://crates.io/) adresine yayımlarsanız, her bir crate'in ayrı olarak yayımlanması gerekecektir. `cargo test` gibi, çalışma alanımızdaki belirli bir crate'i yayımlamak için de `-p` bayrağını kullanarak yayımlamak istediğimiz crate'in adını belirtebiliriz.

Ek pratik olarak, bu çalışma alanına `add_two` crate'ini `add_one` crate'ine benzer bir şekilde ekleyin!

Projeniz büyüdükçe bir çalışma alanı kullanmayı düşünün: tek bir büyük kod bloğundan daha küçük, bireysel bileşenlerin anlaşılması daha kolaydır. Ayrıca, çalışma alanındaki crate'leri bir arada tutmak, sık sık değiştiriliyorsa crate'ler arasındaki koordinasyonu kolaylaştırabilir.