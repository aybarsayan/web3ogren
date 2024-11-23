## Anahtarları İlişkili Değerlerle Hash Map'lerde Saklamak

Ortak koleksiyonlarımızın sonuncusu *hash map*'dir. `HashMap` tipi, bir *hashing fonksiyonu* kullanarak `K` tipindeki anahtarları `V` tipindeki değerlere eşleştiren bir yapı saklar. Bu fonksiyon, bu anahtarları ve değerleri belleğe nasıl yerleştirdiğini belirler. Birçok programlama dili bu tür veri yapısını destekler, ancak genellikle *hash*, *map*, *object*, *hash table*, *dictionary* veya *associative array* gibi farklı adlar kullanırlar.

:::tip
Hash map'ler, verileri bir indeks kullanarak değil, herhangi bir türde anahtar kullanarak aramak istediğinizde faydalıdır.
:::

Örneğin, bir oyunda, her takımın skorunu saklamak için bir hash map kullanabilirsiniz; burada her anahtar bir takımın adı ve değerler ise her takımın skorudur. Bir takım adını verdiğinizde, skorunu alabilirsiniz.

Bu bölümde hash map'lerin temel API'sini inceleyeceğiz, ancak standart kütüphane tarafından tanımlanan `HashMap` üzerindeki daha fazla özellik saklıdır. Her zaman, daha fazla bilgi için standart kütüphane belgelerini kontrol edin.

### Yeni Bir Hash Map Oluşturma

Boş bir hash map oluşturmanın bir yolu `new` kullanmak ve öğeleri `insert` ile eklemektir. Listeleme 8-20'de, isimleri *Mavi* ve *Sarı* olan iki takımın skorlarını takip ediyoruz. Mavi takım 10 puanla başlar ve Sarı takım 50 ile başlar.


Listeleme 8-20: Yeni bir hash map oluşturma ve bazı anahtarlar ve değerler ekleme

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-20/src/main.rs:here}}
```



Öncelikle standart kütüphanenin koleksiyon kısmından `HashMap`'i `use` etmemiz gerektiğini unutmayın. Üç ortak koleksiyonumuzdan, bu en az sıklıkla kullanılanıdır, bu nedenle otomatik olarak ön eki getirilen özellikler arasında yer almaz. Hash map'ler ayrıca standart kütüphaneden daha az destek alır; örneğin, onları oluşturmak için yerleşik bir makro yoktur.

Vektörler gibi, hash map'ler verilerini heap'te saklar. Bu `HashMap`, `String` tipinde anahtarlar ve `i32` tipinde değerlere sahiptir. Vektörlerde olduğu gibi, hash map'ler de homojendir: tüm anahtarlar aynı tipte olmak zorundadır ve tüm değerler de aynı tipte olmalıdır.

### Hash Map'te Değerlere Erişme

Hash map'ten bir değer almak için anahtarı `get` metoduna sağlayabiliriz, bu Listeleme 8-21'de gösterilmektedir.


Listeleme 8-21: Hash map'te saklanan Mavi takımın skoruna erişme

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-21/src/main.rs:here}}
```



:::info
Burada, `score` Mavi takım ile ilişkili olacak ve sonuç `10` olacaktır. `get` metodu `Option` döner; eğer hash map'te o anahtar için bir değer yoksa, `get` `None` döner.
:::

Bu program, `Option`'ı `copied` çağrısını yaparak `Option` olarak almak yerine `Option` alacak şekilde işler, ardından `unwrap_or` ile `scores` hash map'inde anahtar için bir giriş yoksa `score`'u sıfıra ayarlamak üzere hareket eder.

Hash map'teki her anahtar-değer çiftini, vektörlerde yaptığımız gibi, bir `for` döngüsü kullanarak yineleyebiliriz:

```rust
{{#rustdoc_include ../listings/ch08-common-collections/no-listing-03-iterate-over-hashmap/src/main.rs:here}}
```

Bu kod, her çifti rastgele bir sırada yazdırır:

```text
Sarı: 50
Mavi: 10
```

### Hash Map'ler ve Mülkiyet

`i32` gibi `Copy` trait'ini uygulayan türler için değerler hash map'e kopyalanır. `String` gibi sahiplik değerleri için ise değerler taşınır ve hash map bu değerlerin sahibi olur, Listeleme 8-22'de gösterildiği gibi.


Listeleme 8-22: Anahtarların ve değerlerin, eklenir eklenmez hash map tarafından sahiplenildiğini gösterme

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-22/src/main.rs:here}}
```



:::warning
`insert` çağrısıyla hash map'e taşındıktan sonra değişkenler `field_name` ve `field_value`'yi kullanamayız.
:::

Hash map'e değerlere referanslar eklediğimizde, değerler hash map'e taşınmaz. Referansların işaret ettiği değerler, hash map'in geçerli olduğu sürece geçerli olmalıdır. Bu konuları, 10. Bölümde [“Referansları Geçerlilikleri ile Doğrulama”][validating-references-with-lifetimes] kısmında daha fazla konuşacağız.

### Hash Map Güncelleme

Anahtar ve değer çiftlerinin sayısı büyütülebilirken, her benzersiz anahtar yalnızca bir değer ile ilişkili olabilir (ancak bunun tersi geçerli değildir: örneğin, hem Mavi takım hem de Sarı takım `scores` hash map'inde `10` değeri saklayabilir).

Hash map'teki verileri değiştirmek istediğinizde, bir anahtarın zaten bir değer atandığında nasıl işleyeceğinize karar vermeniz gerekir. Eski değeri tamamen göz ardı ederek yeni değerle değiştirebilirsiniz. Eski değeri koruyup yeni değeri yoksayabilir, yalnızca anahtar *zaten* bir değeri yoksa yeni değeri ekleyebilirsiniz. Veya eski ve yeni değeri birleştirebilirsiniz. Şimdi bunların her birini inceleyelim!

#### Bir Değeri Geçersiz Kılma

Eğer bir anahtarı ve bir değeri bir hash map'e ekler ve ardından aynı anahtarı farklı bir değer ile eklerseniz, o anahtarla ilişkili değer geçersiz kılınır. Listeleme 8-23'te `insert` iki kez çağrılmasına rağmen, hash map yalnızca bir anahtar-değer çifti içerecektir çünkü her iki seferde de Mavi takımın anahtarı için değeri ekliyoruz.


Listeleme 8-23: Belirli bir anahtarla saklanan bir değeri değiştirme

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-23/src/main.rs:here}}
```



Bu kod `{"Mavi": 25}` yazdıracaktır. `10` değerinin orijinal değeri geçersiz kılınmıştır.



#### Bir Anahtarın Değeri Olmadığı Durumda Sadece Anahtar ve Değeri Ekleme

Bir anahtarın hash map'te zaten bir değere sahip olup olmadığını kontrol etmek ve ardından şu şekilde işlem almak yaygındır: Eğer anahtar zaten hash map'te bulunuyorsa, mevcut değer olduğu gibi kalmalıdır; eğer anahtar yoksa, onu ve onun için bir değeri ekleyin.

Hash map'lerin bunun için özel bir API'si vardır ve `entry` olarak adlandırılır; hangi anahtarı kontrol etmek istediğinizi parametre olarak alır. `entry` metodunun dönüş değeri, var olabilecek veya olmayabilecek bir değeri temsil eden `Entry` adlı bir enum'dur. Sarı takımın anahtarında bir değer olup olmadığını kontrol etmek istiyoruz. Eğer yoksa, `50` değerini eklemek istiyoruz, bu şekilde Mavi takım için de.

`entry` API'sını kullanarak, kod Listeleme 8-24'te gösterildiği gibi görünür.


Listeleme 8-24: Eğer anahtar zaten bir değere sahip değilse yalnızca eklemek için `entry` metodunu kullanma

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-24/src/main.rs:here}}
```



:::note
`or_insert` metodu, `Entry` için tanımlanmıştır ve eğer bu anahtar mevcutsa, ilgili `Entry` anahtarının değeri için değiştirilebilir bir referans döner; eğer yoksa, parametre bu anahtar için yeni değer olarak eklenir ve yeni değerin değiştirilebilir bir referansını döner. Bu teknik, mantığı kendimizin yazmasından çok daha temizdir ve ayrıca borç kontrolü ile daha uyumlu çalışır.
:::

Listeleme 8-24'teki kod çalıştırıldığında `{"Sarı": 50, "Mavi": 10}` yazdıracak. İlk `entry` çağrısı, Sarı takım için anahtarı değer `50` ile ekleyecek, çünkü Sarı takımın zaten bir değeri yok. İkinci `entry` çağrısı, Mavi takımın zaten `10` değeri olduğu için hash map'te bir değişiklik yapmayacaktır.

#### Eski Değere Dayalı Olarak Bir Değeri Güncelleme

Hash map'lerin başka bir yaygın kullanım durumu, bir anahtarın değerini aramak ve ardından eski değere dayalı olarak güncellemektir. Örneğin, Listeleme 8-25'te her kelimenin bir metinde ne kadar tekrarlandığını sayan bir kod gösterilmektedir. Anahtarlar olarak kelimeleri kullanarak bir hash map oluşturuyoruz ve gördüğümüz her kelime için değeri artırıyoruz. Eğer bir kelimeyi ilk kez görüyorsak, önce `0` değerini ekleyeceğiz.


Listeleme 8-25: Kelime ve sayıları saklayan bir hash map kullanarak kelime tekrar sayma

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-25/src/main.rs:here}}
```



Bu kod `{"dünya": 2, "merhaba": 1, "harika": 1}` yazdıracaktır. Aynı anahtar-değer çiftlerinin farklı bir sıralamada yazdırıldığını görebilirsiniz: hash map üzerinde yineleme işleminin rastgele bir sırada yapıldığını hatırlayın, [“Hash Map'te Değerlere Erişme”][access] bölümünde belirtildiği gibi.

`split_whitespace` metodu, `text` değerindeki boşluklarla ayrılmış alt dilimlere bir iteratör döner. `or_insert` metodu, belirtilen anahtarın değeri için değiştirilebilir bir referans (`&mut V`) döner. Burada, o değiştirilebilir referansı `count` değişkeninde saklıyoruz, böylece o değere atanmak için önce `count`'u yıldız (`*`) kullanarak derefere etmemiz gerekiyor. Değiştirilebilir referans `for` döngüsünün sonunda geçerlilik süresini bitirir, bu nedenle bu değişikliklerin hepsi güvenlidir ve borçlanma kuralları tarafından izin verilir.

### Hashing Fonksiyonları

Varsayılan olarak, `HashMap`, hash tablolarıyla ilgili hizmet reddi (DoS) saldırılarına karşı direnç sağlayabilen *SipHash* adlı bir hashing fonksiyonu kullanır[^siphash]. Bu, mevcut en hızlı hashing algoritması değildir, ancak güvenlik açısından sağladığı avantaj, performansta ki düşüşe değerdir. Kodunuzu analiz eder ve varsayılan hashing fonksiyonunun amacınıza uygun olmadığı sonucuna varırsanız, farklı bir hasher belirterek başka bir fonksiyona geçebilirsiniz. *Hasher*, `BuildHasher` trait'ini uygulayan bir türdür. Trait'leri ve nasıl uygulanacakları hakkında 10. Bölümde konuşacağız. Kendinize ait bir hasher'i sıfırdan uygulamak zorunda değilsiniz; [crates.io](https://crates.io/)'da farklı Rust kullanıcıları tarafından sağlanan, yaygın birçok hashing algoritmasını uygulayan hasher'leri içeren kütüphaneler bulunmaktadır.

[^siphash]: [https://en.wikipedia.org/wiki/SipHash](https://en.wikipedia.org/wiki/SipHash)

## Özet

Vektörler, dizeler ve hash map'ler, verileri saklamak, erişmek ve değiştirmek istediğinizde programlarda büyük miktarda gerekli işlevsellik sağlayacaktır. Şimdi çözüme hazır olacağınız bazı alıştırmalar:

1. Bir tam sayı listesi verildiğinde, bir vektör kullanarak medyanı (sıralandığında ortada kalan değer) ve modunu (en sık meydana gelen değer; burada bir hash map faydalı olacaktır) döndürün.
2. Dizeleri pig latin'e çevirin. Her kelimenin ilk ünlüsü kelimenin sonuna taşınır ve *ay* eklenir, bu yüzden *ilk* *irst-fay* olur. Ünlü ile başlayan kelimelere ise bunun yerine sona *hay* eklenir (*elma* *elma-hay* olur). UTF-8 kodlaması ile ilgili ayrıntıları unutmayın!
3. Bir hash map ve vektörler kullanarak, bir kullanıcıya bir şirkette bir departmana çalışan adları eklemesine olanak tanıyan bir metin arayüzü oluşturun; örneğin, “Mavi takımına Sally ekle” veya “Sarı takımına Amir ekle.” Ardından, kullanıcıya bir departmandaki tüm kişilerin veya şirketin tüm kişilerin listesini alma olanağı sağlayın; alfabetik olarak sıralanmış.

Standart kütüphane API belgesi, bu alıştırmalar için faydalı olacak vektörler, dizeler ve hash map'lerin sahip olduğu metodları tanımlar!

:::danger
Hata işlemenin bu daha karmaşık programlara geçiyoruz ve bu yüzden hata yönetiminden konuşmak için mükemmel bir zamandır. Bunu bir sonraki bölümde yapacağız!
:::