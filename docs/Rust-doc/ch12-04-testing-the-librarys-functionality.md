## Kütüphanenin İşlevselliğini Test Odaklı Geliştirme ile Geliştirmek

Artık mantığı *src/lib.rs* dosyasına çıkardık ve argüman toplama ile hata yönetimini *src/main.rs* dosyasında bıraktık, **kodumuzun temel işlevselliği için test yazmak çok daha kolay hale geldi.** Fonksiyonları çeşitli argümanlar ile doğrudan çağırabilir ve komut satırından ikili dosyamızı çağırmadan geri dönüş değerlerini kontrol edebiliriz.

:::info
Bu bölümde, `minigrep` programına arama mantığını, **test odaklı geliştirme (TDD)** süreci kullanarak ekleyeceğiz.
:::

### TDD Süreci

Bu süreçte aşağıdaki adımları takip edeceğiz:

1. Beklediğiniz sebepten ötürü başarısız olan bir test yazın ve çalıştırın.
2. Yeni testin geçmesi için yeterince kod yazın veya mevcut kodu değiştirin.
3. Eklediğiniz veya değiştirdiğiniz kodu yeniden düzenleyin ve testlerin geçmeye devam ettiğinden emin olun.
4. Adım 1'den tekrarlayın!

> **Önemli Not:** Yazılım yazmanın birçok yolu olsa da, TDD kod tasarımını yönlendirmeye yardımcı olabilir. Testi, testi geçirecek kodu yazmadan önce yazmak, süreç boyunca yüksek test kapsamını korumaya yardımcı olur. — Test Kapsamı

Bir sorgu dizisinin dosya içeriklerinde arama yapacak olan işlevselliğin uygulanmasını testle başladığımızda, bu işlevselliği `search` adlı bir fonksiyon içinde ekleyeceğiz.

### Başarısız Bir Test Yazmak

Artık ihtiyacımız kalmadığı için, programın davranışını kontrol etmek için kullandığımız *src/lib.rs* ve *src/main.rs* dosyalarındaki `println!` ifadelerini kaldıralım. Ardından, *src/lib.rs* içinde, [Bölüm 11][ch11-anatomy]'de yaptığımız gibi bir test fonksiyonu ile `tests` modülü ekleyeceğiz. Test fonksiyonu, `search` fonksiyonunun sahip olması gereken davranışı belirler: bir sorgu alacak ve aramak için metin alacak ve sadece metindeki sorguyu içeren satırları döndürecektir. **Liste 12-15'te, henüz derlenmeyecek bu testi gösterilmektedir.**



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-15/src/lib.rs:here}}
```



Bu test, `"duct"` dizesini arar. Aradığımız metin üç satır içerir ve sadece birisi `"duct"` içerir. **Açık tırnak işaretinin ardından gelen ters eğik çizgi, Rust'a bu string literal'inin içeriğinin başına yeni bir satır karakteri koymamasını söyler.** `search` fonksiyonunun geri döndürdüğü değerin yalnızca beklediğimiz satırı içerdiğini onaylıyoruz.

:::warning
Bu testi çalıştırıp başarısız olduğunu görmek için henüz yeterli değiliz çünkü test derlenmiyor: `search` fonksiyonu henüz mevcut değil!
:::

TDD ilkelerine uygun olarak, testin derlenip çalışması için yeterince kod ekleyeceğiz ve böylece her zaman boş bir vektör döndüren `search` fonksiyonunun tanımını ekleyeceğiz. Bunu **Liste 12-16'da** gösteriyoruz. Artık test derlenmeli ve boş bir vektör geri dönmediği için başarısız olmalıdır; çünkü boş bir vektör, `"safe, fast, productive."` dizesini içeren bir vektörle eşleşmez.



```rust,noplayground
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-16/src/lib.rs:here}}
```



`search` fonksiyonunun imzasında açık bir ömür (`'a`) tanımlamamız ve bu ömrü `contents` argümanı ve dönüş değerinde kullanmamız gerektiğini dikkat edin. [Bölüm 10][ch10-lifetimes]'da ömür parametrelerinin hangi argüman ömrünün dönüş değerinin ömrüyle bağlantılı olduğunu belirttiğini hatırlayın. Bu durumda, döndürülen vektörün, `contents` argümanının dilimlerini referans alan string dilimlerini içereceğini belirtiyoruz (değişken `query` değil, `contents` ile bağlantılıdır).

:::note
Başka bir deyişle, Rust'a `search` fonksiyonunun döndürdüğü verinin, `contents` argümanı ile `search` fonksiyonuna geçilen verinin ömrü kadar yaşayacağını söylüyoruz. Bu önemlidir!
:::

Bir dilimin referans aldığı veri, referansın geçerli olabilmesi için geçerli olmalıdır; derleyici, `contents` yerine `query`'nin string dilimlerini oluşturduğumuzu varsayıyorsa, güvenlik kontrollerini yanlış bir şekilde yapar.

Ömür belirlemelerini unutur ve bu fonksiyonu derlemeye çalışırsak, bu hatayı alırız:

```console
{{#include ../listings/ch12-an-io-project/output-only-02-missing-lifetimes/output.txt}}
```

Rust, iki argümandan hangisini gerektiğini bilmediği için bunu açıkça belirtmemiz gerekiyor. `contents`, **tüm metni içeren argüman** olduğu için ve o metin parçalarının geri döndürülmesini istediğimiz için, `contents`'in dönüş değeriyle bağlanması gereken argüman olduğunu biliyoruz.

:::tip
Diğer programlama dilleri, imzada argümanları dönüş değerleriyle bağlamanızı gerektirmez; ancak bu uygulama zamanla daha da kolaylaşacaktır. 
:::

Bu örneği, [Bölüm 10][validating-references-with-lifetimes]'daki “Referansları Ömrüyle Geçerli Kılma” bölümündeki örneklerle karşılaştırmak isteyebilirsiniz.

### Testi Çalıştırma Zamanı

Şimdi testi çalıştırma zamanı:

```console
{{#include ../listings/ch12-an-io-project/listing-12-16/output.txt}}
```

Harika, test başarısız oldu, tam beklediğimiz gibi. Hadi testin geçmesini sağlayalım!

### Testi Geçirmek İçin Kod Yazmak

Şu anda testimiz başarısız çünkü her zaman boş bir vektör döndürüyoruz. Bunun üstesinden gelmek ve `search`'ü uygulamak için programımızın bu adımları takip etmesi gerekiyor:

1. İçeriklerin her satırında döngü.
2. Satırın sorgu dizisini içerip içermediğini kontrol et.
3. Eğer içeriyorsa, döndürdüğümüz değerler listesine ekle.
4. İçermiyorsa, hiçbir şey yapma.
5. Eşleşen sonuç listesini döndür.

Her adım üzerinden geçiyoruz, önce satırları döngüleme ile başlayarak.

#### `lines` Metodu ile Satırları Döngüleme

Rust, dizeleri satır satır döngülemek için `lines` adında yararlı bir metoda sahiptir ve bu, **Liste 12-17'de** gösterildiği gibi çalışır. Henüz derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-17/src/lib.rs:here}}
```



`lines` metodu bir iteratör döndürür. [Bölüm 13][ch13-iterators]'te iteratörler hakkında derinlemesine konuşacağız, ancak daha önce [Liste 3-5][ch3-iter]'de bir koleksiyondaki her öğe üzerinde bazı kodları çalıştırmak için bir `for` döngüsü ile bir iteratör kullanmış olduğunuzu hatırlayın.

#### Her Satırı Sorgu İçin Aramak

Sonraki adım, mevcut satırın sorgu dizesini içerip içermediğini kontrol etmek. Neyse ki, dizelerin bizim için bunu yapan `contains` adlı yararlı bir metodu var! `search` fonksiyonunda `contains` metodunu çağırmayı ekleyin, **Liste 12-18'de** gösterildiği gibi. Bu da henüz derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-18/src/lib.rs:here}}
```



Şu an itibarıyla, işlevselliği geliştirmekteyiz. Kodun derlenmesi için, gövde içerisinde belirttiğimiz gibi bir değer döndürmeliyiz.

#### Eşleşen Satırları Saklama

Bu fonksiyonu tamamlama sürecinde döndürmek istediğimiz eşleşen satırları saklamak için bir yol bulmalıyız. Bunun için, `for` döngüsünden önce bir değişken vektörü tanımlayabilir ve `push` metodunu çağırarak `line`'ı vektörde saklayabiliriz. **`for` döngüsünden sonra, listeyi döndüreceğiz,** Liste 12-19'da gösterildiği gibi.



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-19/src/lib.rs:here}}
```



Artık `search` fonksiyonu yalnızca `query`'yi içeren satırları döndürmelidir ve testimiz geçmelidir. Haydi testi çalıştıralım:

```console
{{#include ../listings/ch12-an-io-project/listing-12-19/output.txt}}
```

Testimiz geçiyor, bu da çalıştığını biliyoruz!

:::tip
Bu aşamada, `search` fonksiyonunun uygulanmasını yeniden düzenlemek için geçerli olan fırsatları değerlendirebiliriz; testlerin geçmesini sağlarken aynı işlevselliği korumak için.
:::

`search` fonksiyonundaki kod pek kötü değil, fakat bazı yararlı iteratör özelliklerinden yararlanmıyor. Bunu [Bölüm 13][ch13-iterators]'te, iteratörler hakkında detaylı bir şekilde keşfedeceğiz ve nasıl geliştirebileceğimize bakacağız.

#### `run` Fonksiyonunda `search` Fonksiyonunu Kullanma

Artık `search` fonksiyonu çalışıyor ve test edildiğine göre, `run` fonksiyonundan `search`'ü çağırmamız gerekiyor. `config.query` değerini ve `run`'ın dosyadan okuduğu `contents`'i `search` fonksiyonuna geçmemiz gerekiyor. Sonra `run`, `search`'den dönen her satırı yazdıracak:

Dosya Adı: src/lib.rs

```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/no-listing-02-using-search-in-run/src/lib.rs:here}}
```

Hala her satırı `search`'den döndürüp yazdırmak için bir `for` döngüsü kullanıyoruz.

### Tüm Programı Deneyelim

Artık tüm program çalışmalıdır! Hadi deneyelim öncelikle Emily Dickinson şiirinden tam bir satır döndürmesi gereken bir kelime olan *frog* ile.

```console
{{#include ../listings/ch12-an-io-project/no-listing-02-using-search-in-run/output.txt}}
```

Harika! Şimdi, *body* gibi birden fazla satırla eşleşecek bir kelime deneyelim:

```console
{{#include ../listings/ch12-an-io-project/output-only-03-multiple-matches/output.txt}}
```

Ve sonunda, şiirde hiç olmayan *monomorphization* gibi bir kelimeyi aradığımızda hiçbir satır almadığımızdan emin olalım:

```console
{{#include ../listings/ch12-an-io-project/output-only-04-no-matches/output.txt}}
```

Mükemmel! **Kendi mini versiyonumuzu klasik bir araca inşa ettik ve uygulamaları yapılandırma konusunda pek çok şey öğrendik.** Ayrıca dosya girişi ve çıkışı, ömürler, test etme ve komut satırı ayrıştırma hakkında biraz bilgi edindik.

:::info
Bu projeyi tamamlamak için, çevresel değişkenlerle nasıl çalışılacağını ve standart hataya nasıl yazdırılacağını kısaca gösterelim; ikisi de komut satırı programları yazarken faydalı olacaktır.
:::

[validating-references-with-lifetimes]:
ch10-03-lifetime-syntax.html#validating-references-with-lifetimes
[ch11-anatomy]: ch11-01-writing-tests.html#the-anatomy-of-a-test-function
[ch10-lifetimes]: ch10-03-lifetime-syntax.html
[ch3-iter]: ch03-05-control-flow.html#looping-through-a-collection-with-for
[ch13-iterators]: ch13-02-iterators.html