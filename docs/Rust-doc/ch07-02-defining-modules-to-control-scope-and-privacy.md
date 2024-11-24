## Modüllerin Kapsam ve Gizliliği Kontrol Etmek İçin Tanımlanması

Bu bölümde, modüller ve modül sisteminin diğer parçaları hakkında konuşacağız; yani öğeleri adlandırmanıza olanak tanıyan *yollar*; bir yolu kapsam içine getiren `use` anahtar kelimesi; ve öğeleri genel hale getiren `pub` anahtar kelimesi. Ayrıca `as` anahtar kelimesi, harici paketler ve glob operatörünü de tartışacağız.

### Modüller Hızlı Referans Kılavuzu

Modüller ve yolların detaylarına girmeden önce, burada modüllerin, yolların, `use` anahtar kelimesinin ve `pub` anahtar kelimesinin derleyicide nasıl çalıştığı ve çoğu geliştiricinin kodlarını nasıl organize ettiği hakkında hızlı bir referans sağlıyoruz. Bu bölüm boyunca bu kuralların her birine örnekler geçeceğiz, ancak modüllerin nasıl çalıştığını hatırlamak için burası harika bir yer.

- **Kütüphane kökünden başlayın**: **Bir kütüphane derlenirken**, derleyici öncelikle derlenecek kod için kütüphane kök dosyasına (genellikle kütüphane kütüğü için *src/lib.rs* veya ikili kütük için *src/main.rs*) bakar.
- **Modül tanımlama**: **Kütüphane kök dosyasında yeni modüller tanımlayabilirsiniz**; diyelim ki `mod garden;` ile bir “bahçe” modülü tanımladınız. Derleyici, modül kodunu aşağıdaki yerlerde arar:
  - `mod garden` ifadesini takip eden süslü parantezler içinde, çevreleyen süslü parantezler.
  - *src/garden.rs* dosyasında
  - *src/garden/mod.rs* dosyasında
- **Alt modül tanımlama**: **Kütüphane kök dosyası dışındaki herhangi bir dosyada alt modüller tanımlayabilirsiniz.** Örneğin, *src/garden.rs* içinde `mod vegetables;` tanımlayabilirsiniz. Derleyici, alt modül kodunu, ana modül adına sahip dizinde şu yerlerde arar:
  - Süslü parantezler içinde `mod vegetables` ifadesinin hemen ardından
  - *src/garden/vegetables.rs* dosyasında
  - *src/garden/vegetables/mod.rs* dosyasında
- **Modüllerdeki koda yollar**: **Bir modül**, kütüphanenizin bir parçası olduğunda, o modüldeki koda, gizlilik kuralları izin verdiği sürece, aynı kütüphanedeki başka bir yerden erişebilirsiniz. Örneğin, bahçe sebzeleri modülündeki bir `Asparagus` türü `crate::garden::vegetables::Asparagus` ile bulunabilir.
- **Özel vs. genel**: Bir modül içindeki kod, varsayılan olarak ana modüllerinden gizlidir. **Bir modülü genel hale getirmek için `mod` yerine `pub mod` ile tanımlayın.** Genel bir modül içindeki öğeleri de genel hale getirmek için, tanımlarından önce `pub` kullanın.
- **`use` anahtar kelimesi**: **Bir kapsam içinde `use` anahtar kelimesi**, uzun yolların tekrarlanmasını azaltmak için öğelere kısayollar oluşturur. `crate::garden::vegetables::Asparagus` referans verebilen her kapsamda, `use crate::garden::vegetables::Asparagus;` ile bir kısayol oluşturabilirsiniz ve bundan sonra bu türü kapsam içinde kullanmak için sadece `Asparagus` yazmanız yeterlidir.

Burada bu kuralları açıklayan bir ikili kütük olan `backyard` oluşturalım. Kütüğün, aynı zamanda `backyard` adını taşıyan dizini, bu dosyaların ve dizinlerin içerir:

```text
backyard
├── Cargo.lock
├── Cargo.toml
└── src
    ├── garden
    │   └── vegetables.rs
    ├── garden.rs
    └── main.rs
```

Bu durumda kütüphane kök dosyası *src/main.rs*'dir ve aşağıdakileri içerir:



```rust,noplayground,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/quick-reference-example/src/main.rs}}
```



`pub mod garden;` satırı, derleyiciye *src/garden.rs* dosyasındaki kodu dahil etmesini söyler. Bu kod:



```rust,noplayground,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/quick-reference-example/src/garden.rs}}
```



Burada, `pub mod vegetables;` ifadesi, *src/garden/vegetables.rs* dosyasındaki kodun da dahil olduğu anlamına gelir. O kod:

```rust,noplayground,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/quick-reference-example/src/garden/vegetables.rs}}
```

Şimdi bu kuralların detaylarına girelim ve bunları uygulamalı olarak gösterelim!

### İlgili Kodu Modüllerde Gruplama

*Modüller*, kodu daha okunabilir ve kolayca yeniden kullanılabilir hale getirmek için bir kütüphanede organize etmemizi sağlayan yapılardır. Modüller ayrıca öğelerin *gizliliğini* kontrol etmemize de olanak tanır çünkü bir modül içindeki kod varsayılan olarak gizlidir. Özel öğeler, dış kullanım için mevcut olmayan iç uygulama ayrıntılarıdır. Modülleri ve içindeki öğeleri genel hale getirmek için seçim yapabiliriz; bu, dış kodun bu öğeleri kullanmasına ve onlara bağımlı olmasına olanak tanır.

**Örnek olarak, bir restoran işlevi sunan bir kütüphane kütüğü yazalım. Fonksiyonların imzalarını tanımlayacağız ancak gövdelerini boş bırakacağız, böylece kodun organizasyonuna odaklanacağız ve bir restoranın uygulanmasına değil.**

:::note
Restoran endüstrisinde, bir restoranın bazı bölümleri *ön tarafta* ve diğerleri *arka tarafta* olarak adlandırılır.
:::

**Ön tarafta**, müşterilerin bulunduğu yerdir; bu, misafirlerin oturmasını sağladığı, garsonların sipariş ve ödeme aldığı ve barmenlerin içki yaptığı yeri kapsar. **Arka tarafta ise**, aşçıların ve şeflerin mutfakta çalıştığı, bulaşıkçıların temizlik yaptığı ve yöneticilerin idari işler yaptığı yerdir.

Kütüğümüzü bu şekilde yapılandırmak için, işlevlerini iç içe modüllere organize edebiliriz. `cargo new restaurant --lib` komutunu çalıştırarak `restaurant` adında yeni bir kütüphane oluşturun. Ardından, modülleri ve fonksiyon imzalarını tanımlamak için 7-1 numaralı listedeki kodu *src/lib.rs* dosyasına girin; bu kod, ön tarafa ait bölüm.



```rust,noplayground
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-01/src/lib.rs}}
```



`mod` anahtar kelimesi ile modül adı (bu durumda `front_of_house`) tanımlıyoruz. Modülün gövdesi, süslü parantezler içine girer. Modüller içinde diğer modüller de barındırabiliriz; bu durumda `hosting` ve `serving` modülleri gibi. Modüller ayrıca struct, enum, sabitler, traitler ve - 7-1 numaralı listedeki gibi - fonksiyonlar gibi diğer öğelerin tanımlarını da barındırabilir.

**Modülleri kullanarak, ilgili tanımları bir araya getirebilir ve neden ilişkili olduklarına dair isimler verebiliriz.** Bu kodu kullanan programcılar, tanımları bulmak için gruplarına göre kodu gezinebilir, bütün tanımları okumak zorunda kalmazlar ve bu da kendileri için ilgili tanımları bulmayı kolaylaştırır. Bu koda yeni işlevsellik ekleyen programcılar, programı düzenli tutmak için kodu nereye yerleştireceklerini bilirler.

Daha önce, *src/main.rs* ve *src/lib.rs* dosyalarının kütüphane kökleri olarak adlandırıldığını belirtmiştik. **Bu isimlendirme, bu iki dosyanın içeriğinin**, kütüphanenin modül yapısının kökünde, `crate` adında bir modül oluşturmasından kaynaklanmaktadır; buna *modül ağacı* denir.

7-2 numaralı liste, 7-1 numaralı listedeki yapı için modül ağacını gösteriyor.



```text
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```



Bu ağaç, bazı modüllerin diğer modüllerin içinde yer aldığını gösterir; örneğin, `hosting`, `front_of_house` modülünün içinde yer alır. Ağaç ayrıca bazı modüllerin *kardeş* olduğunu gösterir; yani aynı modül içinde tanımlanmıştır; `hosting` ve `serving`, `front_of_house` içinde tanımlanan kardeşlerdir. A modülü B modülünün içinde yer alıyorsa, A modülünün B modülünün *çocuğu* ve B modülünün A modülünün *ebeveyni* olduğunu söyleriz. 

:::info
Tüm modül ağacının, `crate` adında örtük bir modül altında köklü olduğunu unutmayın.
:::

Modül ağacı, bilgisayarınızdaki dosya sisteminin dizin ağacını hatırlatabilir; bu çok uygun bir karşılaştırmadır! **Dosya sistemindeki dizinler gibi**, kodunuzu organize etmek için modülleri kullanırsınız. Ve bir dizindeki dosyalar gibi, modüllerimizi bulmanın bir yoluna ihtiyacımız var.