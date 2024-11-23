## UTF-8 Kodu İçerik Metnini Değerlerle Saklama

Dördüncü bölümde dizgiler hakkında konuştuk, ancak şimdi onlara daha derinlemesine bakacağız. **Yeni Rust geliştiricileri** genellikle dizgiler hakkında üç nedenden dolayı zorlanır: Rust'ın olası hataları açığa çıkartma eğilimi, dizgilerin birçok programcının düşünüğünden daha karmaşık bir veri yapısı olması ve **UTF-8**. Bu faktörler, diğer programlama dillerinden geliyorken zorlayıcı gibi görünen bir şekilde birleşir.

:::tip
Dizgiler, belirli bir bağlamda, başka yerlerde depolanan bazı UTF-8 kodlu dize verilerine referanslar olan iç içe geçirilen baytların bir koleksiyonudur.
:::

Bu bölümde, `String` üzerindeki her koleksiyon türünün sahip olduğu işlemleri, örneğin oluşturma, güncelleme ve okuma hakkında konuşacağız. Ayrıca, `String`'in diğer koleksiyonlardan nasıl farklı olduğunu, yani bir `String`'e indekslemenin insanların ve bilgisayarların `String` verisini yorumlama şekilleri arasındaki farklılıklarla nasıl karmaşıklaştığını da tartışacağız.

### Dize Nedir?

Öncelikle *dize* terimiyle ne demek istediğimizi tanımlayalım. Rust'ın çekirdek dilinde yalnızca bir dize türü vardır; bu, genellikle borçlu formu olan dize dilimi `&str` olarak görülen `str` dize dilimidir. Dördüncü bölümde, başka bir yerde depolanan bazı UTF-8 kodlu dize verilerine referans olan *dize dilimlerini* konuştuk. Örneğin, dize literalleri programın ikili dosyasında depolanır ve dolayısıyla dize dilimleridir.

Rust'ın standart kütüphanesi tarafından sağlanan `String` türü, büyüyebilen, değiştirilebilen, sahipli, UTF-8 kodlu bir dize türüdür. Rust geliştiricileri Rust'taki "dizgiler" derken, yalnızca `String` veya dize dilimi `&str` türlerinden birine değil, her ikisine de atıfta bulunabilirler. Bu bölüm büyük ölçüde `String` hakkında olsa da, her iki tür de Rust'ın standart kütüphanesinde yoğun şekilde kullanılır ve hem `String` hem de dize dilimleri UTF-8 kodludur.

### Yeni Bir Dize Oluşturma

`Vec` ile mevcut olan birçok aynı işlem `String` ile de mevcuttur çünkü `String` aslında bazı ek garantiler, kısıtlamalar ve yetenekler ile bir bayt vektörü etrafında bir sarmalayıcı olarak uygulanmıştır. `Vec` ve `String` ile aynı şekilde çalışan bir örnek işlev, bir örneği gösteren `new` işlevidir, Liste 8-11'de gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-11/src/main.rs:here}}
```



Bu satır, `s` adında yeni, boş bir dize oluşturur, ardından içine veri yükleyebiliriz. **Çoğu zaman**, dizenin başlangıcında kullanmak istediğimiz bazı başlangıç verilerimiz olacaktır. Bunun için, dize literallerinin yaptığı gibi, `Display` trait'ini uygulayan herhangi bir türda mevcut olan `to_string` yöntemini kullanırız. Liste 8-12, iki örneği göstermektedir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-12/src/main.rs:here}}
```



Bu kod, `initial contents` içeren bir dize oluşturur.

Ayrıca, bir dize literali'nden `String` oluşturmak için `String::from` işlevini de kullanabiliriz. Liste 8-13'teki kod, `to_string` kullanan Liste 8-12'deki kod ile eşdeğerdir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-13/src/main.rs:here}}
```



Dizgiler birçok şey için kullanıldığından, **bize birçok seçenek sunan** birçok farklı genel API'yi dize için kullanabiliriz. Bazıları gereksiz görünebilir, ancak hepsinin kendine göre bir yeri vardır! Bu durumda, `String::from` ve `to_string` aynı şeyi yapar, bu yüzden hangisini seçtiğiniz bir stil ve **okunabilirlik** meselesidir.

Dizgilerin UTF-8 kodlu olduğunu unutmayın, bu nedenle içlerine uygun şekilde kodlanmış verileri dahil edebiliriz; bu Liste 8-14'te gösterilmektedir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-14/src/main.rs:here}}
```



Tüm bunlar geçerli `String` değerleridir.

### Bir Dizeyi Güncelleme

Bir `String`, `Vec` içindekiler gibi büyüyebilir ve içeriği değiştirilebilir, daha fazla veri eklediğinizde. Ayrıca `String` değerlerini birleştirmek için kolayca `+` operatörünü veya `format!` makrosunu kullanabilirsiniz.

#### `push_str` ve `push` ile Dizeye Ekleme

`push_str` yöntemini kullanarak bir dize dilimini `String`'e ekleyerek büyütebiliriz; bu Liste 8-15'te gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-15/src/main.rs:here}}
```



Bu iki satırdan sonra, `s` `foobar` içerecektir. `push_str` yöntemi bir dize dilimi alır çünkü parametreyi sahiplenmek istemiyoruz. Örneğin, Liste 8-16'daki kodda, içeriğini `s1`'e ekledikten sonra `s2`'yi kullanabilmek istiyoruz.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-16/src/main.rs:here}}
```



Eğer `push_str` yöntemi `s2`'nin sahipliğini alsa, son satırda değerini yazdırmamız mümkün olmazdı. Ancak bu kod, beklediğimiz gibi çalışır!

`push` yöntemi, bir karakteri bir parametre olarak alır ve `String`'e ekler. Liste 8-17, `push` yöntemi kullanarak bir `String` değerine `l` harfini ekler.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-17/src/main.rs:here}}
```



Sonuç olarak, `s` `lol` içerecektir.

#### `+` Operatörü veya `format!` Makrosu ile Birleştirme

Çoğu zaman, iki var olan dizgiyi birleştirmek istersiniz. Bir yol, Liste 8-18'de gösterildiği gibi `+` operatörünü kullanmaktır.



```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-18/src/main.rs:here}}
```



`String` `s3`, `Hello, world!` içerecektir. `s1`'in eklemeden sonra artık geçerli olmaması ve `s2`'ye referans kullanmamızın nedeni, `+` operatörünü kullandığımızda çağrılan metodun imzasıyla ilgilidir. `+` operatörü `add` metodunu kullanır, imzası aşağıdakine benzer görünmektedir:

```rust,ignore
fn add(self, s: &str) -> String {
```

Standart kütüphanede `add`, jenerikler ve ilişkili türler kullanılarak tanımlanmıştır. Burada, bu yöntemi `String` değerleri ile çağırdığımızda olan şey budur; somut türlerde değiştirilmiştir. Bu imza, `+` operatörünün karmaşık kısımlarını anlamak için ihtiyacımız olan ipuçlarını verir.

Öncelikle, `s2`'nin bir `&`'ye sahip olduğunu görüyoruz, bu da ikinci dizenin bir *referansını* birinci dizenin üzerine eklediğimiz anlamına gelir. Bu, `add` işlevindeki `s` parametresinin nedenidir: yalnızca bir `&str` ekleyebiliriz; iki `String` değerini birleştiremeyiz. Ancak bekle—`&s2` türü `&String`, değil mi? `add`'in ikinci parametresi `&str` olarak belirtilmiştir. O halde neden Liste 8-18 derleniyor?

:::warning
`add` metoduna `&s2` kullanabilmemizin nedeni, derleyicinin `&String` argümanını `&str`'ye *zorlaması*dır.
:::

`add` metodunu çağırdığımızda, Rust bir *dereferans zorlaması* kullanır; burada `&s2`'yi `&s2[..]`'ye dönüştürür. Dereferans zorlaması üzerine daha detaylı olarak 15. bölümde tartışacağız. `add` fonksiyonu `s` parametresinin sahipliğini almadığı için, `s2` bu işlemin ardından hala geçerli bir `String` olacaktır.

İkinci olarak, imzadan `add`'in `self`'in sahipliğini aldığını görebiliriz, çünkü `self` bir `&`'ye sahip değildir. Bu, Liste 8-18'de `s1`'in `add` çağrısına taşınacağı ve bundan sonra geçerli olmayacağı anlamına gelir. Bu nedenle, `let s3 = s1 + &s2;` ifadesi hem iki dizeyi kopyalayacak hem de yeni bir tane yaratacakmış gibi görünse de, bu ifade aslında `s1`'in sahipliğini alır, `s2`'nin içeriklerinden bir kopyayı ekler ve ardından sonucu geri döndürür. Diğer bir deyişle, birçok kopya yapıyormuş gibi görünüyor, ancak öyle değil; uygulama kopyalamaktan daha verimlidir.

Birden fazla dize birleştirmemiz gerekiyorsa, `+` operatörünün davranışı zahmetli hale gelir:

```rust
{{#rustdoc_include ../listings/ch08-common-collections/no-listing-01-concat-multiple-strings/src/main.rs:here}}
```

Bu noktada, `s` `tic-tac-toe` olacaktır. Tüm bu `+` ve `"` karakterleri ile ne olduğunu görmek zordur. Daha karmaşık yollarla dizeleri birleştirmek için, bunun yerine `format!` makrosunu kullanabiliriz:

```rust
{{#rustdoc_include ../listings/ch08-common-collections/no-listing-02-format/src/main.rs:here}}
```

Bu kod ayrıca `s`'yi `tic-tac-toe` olarak ayarlar. `format!` makrosu `println!` gibi çalışır, ancak çıktıyı ekrana yazdırmak yerine içerikle birlikte bir `String` döndürür. `format!` kullanan kodun versiyonu okumak için çok daha kolaydır ve `format!` makrosu tarafından üretilen kod, hiçbir parametresinin sahipliğini almadığı için referanslar kullanarak çalışır.

### Dizelere İndeksleme

Birçok diğer programlama dilinde, bir dize içindeki bireysel karakterlere indeksle erişim, geçerli ve yaygın bir işlemdir. Ancak, Rust'ta indeksleme sözdizimini kullanarak bir `String`'in parçalarına erişmeye çalışırsanız, bir hata alırsınız. Liste 8-19'daki geçersiz koda bir göz atalım.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-19/src/main.rs:here}}
```



Bu kod aşağıdaki hata ile sonuçlanacaktır:

```console
{{#include ../listings/ch08-common-collections/listing-08-19/output.txt}}
```

Hata ve not, durumu anlatıyor: Rust dizgileri indekslemeyi desteklemiyor. Ama neden? Bu soruya yanıt vermek için Rust'ın dizgileri bellekte nasıl depoladığını tartışmamız gerekiyor.

#### İçsel Temsil

Bir `String` bir `Vec` etrafında bir sarmalayıcıdır. Liste 8-14'ten bazı düzgün kodlanmış UTF-8 örnek dizgilerimize bir göz atalım. Öncelikle bu:

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-14/src/main.rs:spanish}}
```

Bu durumda, `len` `4` olacaktır, bu da "Hola" dizesini depolayan vektörün 4 bayt uzunluğunda olduğu anlamına gelir. Bu harflerin her biri UTF-8'de kodlandığında bir bayt alır. Ancak, aşağıdaki satır sizi şaşırtabilir (bu dizenin büyük Kiril harfi *Ze* ile başladığını not edin, sayı 3 ile değil):

```rust
{{#rustdoc_include ../listings/ch08-common-collections/listing-08-14/src/main.rs:russian}}
```

Dizenin ne kadar uzun olduğunu sorsaydınız, muhtemelen 12 dersiniz. Ancak, Rust'ın cevabı 24'tür: "Здравствуйте" dizisini UTF-8'de kodlamak için gereken bayt sayısıdır, çünkü o dizedeki her Unicode skalar değeri 2 bayt depolama alır. Bu nedenle, dizenin baytlarındaki bir indeks her zaman geçerli bir Unicode skalar değeri ile ilişkilendirilmez. Bunu göstermek için, bu geçersiz Rust koduna bakalım:

```rust,ignore,does_not_compile
let hello = "Здравствуйте";
let answer = &hello[0];
```

Artık `answer`ın `З` olmayacağını zaten biliyorsunuz; bu, ilk harf değil. UTF-8'de kodlandığında, `З`'nin ilk baytı `208` ve ikincisi `151`dir, dolayısıyla `answer`'ın aslında `208` olması gerektiği görünmektedir, ancak `208` tek başına geçerli bir karakter değildir. Bir kullanıcı bu dizenin ilk harfini istediyse, `208` döndürmek muhtemelen istemediği bir şeydir; ancak bu, Rust'ın bayt indeks 0'da sahip olduğu tek veridir. Kullanıcılar genellikle geri dönen bayt değerini istemez, dizenin yalnızca Latin harfleri içermesi durumunda bile: `&"hello"[0]` geçerli bir kod olarak dönerse, `104` döner, `h` değil.

:::note
Sonuç olarak, beklenmeyen bir değer döndürmeyi ve hemen keşfedilmeyen hatalar yaratmayı önlemek için, Rust bu kodu hiç derlemez ve çelişkileri geliştirme aşamasının başında önler.
:::

#### Baytlar ve Skalar Değerler ve Graphem Küme! Oh Hayır!

UTF-8 hakkında başka bir nokta, Rust'ın gözünde dizelere bakmanın aslında üç ilgili yolu olduğudur: baytlar, skalar değerler ve graphem kümeleri (en yakın isimlendirme ile *harf* olarak adlandırabileceğimiz şey).

Hindistan'daki "नमस्ते" kelimesini Devanagari alfabesinde yazarsak, bu şu şekilde depolanır:

```text
[224, 164, 168, 224, 164, 174, 224, 164, 184, 224, 165, 141, 224, 164, 164,
224, 165, 135]
```

Bu 18 bayttır ve verilerin nihayetinde bilgisayarlar tarafından nasıl depolandığını gösterir. Unicode skalar değerleri (Rust'ın `char` tipi olarak adlandırdığı şey) açısından bakarsak, bu baytlar şöyle görünür:

```text
['न', 'म', 'स', '्', 'त', 'े']
```

Burada altı `char` değeri vardır, ancak dördüncü ve altıncı değer harf değildir: bunlar kendi başına anlam ifade etmeyen diakritik işaretlerdir. Son olarak, bunlara graphem kümeleri açısından bakarsak, Hindistan'daki kelimeyi oluşturan dört harfi alırız:

```text
["न", "म", "स्", "ते"]
```

Rust, bilgisayarların depoladığı ham dize verilerini yorumlamak için farklı yollar sağlayarak her programın ihtiyacına göre doğru yorumu seçmesine izin verir; bu, verilerin hangi insan dili kullandığına bakılmaksızın geçerlidir.

:::info
Bir dizgedeki karakterleri indeksleme işlemini desteklememe nedeninin bir diğer nedeni, indeksleme işlemlerinin her zaman sabit süre (O(1)) alması beklenmesidir. Ancak `String` ile bunun performansını garanti etmek mümkün değildir, çünkü Rust, geçerli karakterlerin sayısını belirlemek için en baştan içeriği kontrol etmek zorundadır.
:::

### Dizeleri Dilimleme

Bir dizeye indeksleme yapmak temel olarak kötü bir fikirdir çünkü dize-indeksleme işleminin dönüş tipinin ne olması gerektiği net değildir: bir bayt değeri, bir karakter, bir graphem küme veya bir dize dilimi. Bu nedenle, dizeleri dilimlemek için gerçekten indeksler kullanmanız gerekiyorsa, Rust sizi daha spesifik olmaya zorlar.

Tek bir numara ile `[]` kullanmak yerine, belirli baytları içeren bir dize dilimi oluşturmak için bir aralık kullanarak `[]` kullanabilirsiniz:

```rust
let hello = "Здравствуйте";

let s = &hello[0..4];
```

Burada, `s` dizenin ilk dört baytını içeren bir `&str` olacaktır. Daha önce, her bir karakterin iki bayt olduğunu belirtmiştik; bu nedenle `s` `Зд` olacaktır.

Bir karakterin baytlarının yalnızca bir kısmını dilimlemeyi denediğimizde, örneğin `&hello[0..1]`, Rust, bir vektörde geçersiz indeks erişimi varsa olduğu gibi çalışma zamanında panik yapacaktır:

```console
{{#include ../listings/ch08-common-collections/output-only-01-not-char-boundary/output.txt}}
```

Menziller ile dize dilimleri oluştururken dikkatli olmalısınız; çünkü bu, programınızı çökertebilir.

### Dizeler Üzerinde İterasyon Yöntemleri

Dizgilerin parçaları üzerinde çalışmanın en iyi yolu, karakterlerin veya baytların ne türde olduğunu açıkça belirtmektir. Tekil Unicode skalar değerleri için `chars` yöntemini kullanın. "Зд" üzerinde `chars` çağırmak, iki `char` tipi değeri ayırır ve her bir elemanı erişmek için sonuç üzerinde yineleyebilirsiniz:

```rust
for c in "Зд".chars() {
    println!("{c}");
}
```

Bu kod aşağıdakileri yazdıracaktır:

```text
З
д
```

Alternatif olarak, `bytes` yöntemi her bir ham baytı döndürür; bu sizin alanınıza uygun olabilir:

```rust
for b in "Зд".bytes() {
    println!("{b}");
}
```

Bu kod, bu dizeyi oluşturan dört baytı yazdıracaktır:

```text
208
151
208
180
```

Ancak geçerli Unicode skalar değerlerinin birden fazla bayttan oluşabileceğini hatırlamak önemlidir.

:::info
Dizelerden graphem kümeleri almak, Devanagari alfabesi gibi, karmaşıktır, bu nedenle bu işlevsellik standart kütüphanede sağlanmaz. Eğer bu işlevselliğe ihtiyacınız varsa, [crates.io](https://crates.io/) üzerinde mevcut olan paketler bulunmaktadır.
:::

### Dizeler O Kadar Basit Değil

Özetlemek gerekirse, dizeler karmaşıktır. **Farklı programlama dilleri**, programcıya bu karmaşıklığı nasıl sunacakları konusunda farklı seçimler yaparlar. Rust, `String` verilerini doğru bir şekilde ele almayı tüm Rust programları için varsayılan davranış olarak seçmiştir; bu, programcıların UTF-8 verilerini baştan ele alma konusunda daha fazla düşünmek zorunda kalması anlamına gelir. Bu takas, diğer programlama dillerinde görünenden daha fazla dize karmaşıklığını açığa çıkarır, ancak sizin gelişim yaşam döngünüzde daha sonra ASCII olmayan karakterlerle ilgili hataları ele almanızı engeller.

İyi haber, standart kütüphanenin bu karmaşık durumları doğru bir şekilde ele almak için `String` ve `&str` türlerine dayanan birçok işlevsellik sunmasıdır. **Bir dize içinde arama yapmak için** `contains` gibi yararlı yöntemler ve bir dizedeki bazı kısımları başka bir dizi ile değiştirmek için `replace` gibi yöntemlerin belgelerine göz atmayı unutmayın.

---
Şimdi biraz daha az karmaşık bir şeye geçelim: hash haritaları!