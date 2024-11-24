## Nesne Yönelimli Dillerin Özellikleri

Programlama topluluğunda bir dilin nesne yönelimli olarak kabul edilmesi için hangi özelliklere sahip olması gerektiği konusunda bir görüş birliği yoktur. Rust, nesne yönelimli programlamayı da içeren birçok programlama paradigmasından etkilenmiştir; örneğin, 13. Bölümde fonksiyonel programlamadan gelen özellikleri incelemiştik. Tartışmaya değer, nesne yönelimli dillerin belirli ortak özellikleri vardır; bunlar nesneler, kapsülleme ve miras almaktır. Bu özelliklerin her birinin ne anlama geldiğine ve Rust'un bunları destekleyip desteklemediğine bakalım.

### Nesneler Veri ve Davranış İçerir

Erich Gamma, Richard Helm, Ralph Johnson ve John Vlissides tarafından yazılan *Design Patterns: Elements of Reusable Object-Oriented Software* adlı kitap, genel olarak *Dört Çetenin Kitabı* olarak adlandırılır ve nesne yönelimli tasarım kalıplarının bir kataloğudur. OOP'yi şu şekilde tanımlar:

> Nesne yönelimli programlar nesnelerden oluşur. Bir *nesne*, hem veriyi hem de o veri üzerinde işlem yapan prosedürleri paketler. Prosedürler genellikle *yöntemler* veya *işlemler* olarak adlandırılır.  
> — Erich Gamma et al.

Bu tanıma göre, Rust nesne yönelimlidir: struct ve enum veri içerir ve `impl` blokları struct ve enum'lar üzerinde yöntemler sağlar. **Yöntemleri olan struct ve enum'lar** *nesne* olarak adlandırılmasa da, Dört Çetenin nesne tanımına göre aynı işlevselliği sağlarlar.

### Uygulama Ayrıntılarını Gizleyen Kapsülleme

OOP ile genellikle ilişkilendirilen bir diğer yön *kapsülleme* kavramıdır; bu, bir nesnenin uygulama detaylarının o nesneyi kullanan kod tarafından erişilebilir olmaması anlamına gelir. :::tip Kapsülleme, uygulama detaylarını gizleyerek kontrol ve esneklik sağlar. Bu nedenle, bir nesne ile etkileşimde bulunmanın tek yolu, nesnenin halka açık API'si aracılığıyla gerçekleşir; nesneyi kullanan kod, nesnenin iç detaylarına ulaşarak veri veya davranışı doğrudan değiştirememelidir. Bu, programcıya bir nesnenin iç yapısını değiştirme ve yeniden düzenleme olanağı tanır; nesneyi kullanan kodun değiştirilmesine gerek kalmadan bu yapılabilir.

Kapsüllemeyi kontrol etmenin nasıl olduğunu 7. Bölümde tartıştık: `pub` anahtar kelimesini kullanarak, kodumuzdaki hangi modüllerin, türlerin, fonksiyonların ve yöntemlerin halka açık olması gerektiğini belirleyebiliriz ve varsayılan olarak diğer her şey gizlidir. Örneğin, `i32` değerlerini içeren bir vektör barındıran bir `AveragedCollection` struct'ı tanımlayabiliriz. Struct ayrıca vektördeki değerlerin ortalamasını içeren bir alan içerebilir; bu, ortalamanın her isteyenin ihtiyaç duyması durumunda talep üzerine hesaplanmasına gerek kalmadığı anlamına gelir. Diğer bir deyişle, `AveragedCollection` bizim için hesaplanmış ortalamayı önbelleğe alacaktır. 

---

Aşağıdaki liste, 18-1 numaralı listedeki `AveragedCollection` struct'ının tanımını göstermektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-01/src/lib.rs}}
```



Struct, diğer kodların kullanabilmesi için `pub` olarak işaretlenmiştir, ancak struct içindeki alanlar özel kalır. Bu, bir değer listeden eklendiğinde veya çıkarıldığında ortalamanın da güncellenmesini sağlamak istediğimiz için önemlidir. Bunu struct üzerinde `add`, `remove` ve `average` yöntemlerini uygulayarak yaparız; bunlar 18-2 numaralı listede gösterilmektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-02/src/lib.rs:here}}
```



Halka açık `add`, `remove` ve `average` yöntemleri, `AveragedCollection` örneğindeki verilere erişmenin veya değiştirenin tek yoludur. Bir öğe `add` yöntemi kullanılarak `list`e eklendiğinde veya `remove` yöntemi kullanılarak çıkarıldığında, her birinin uygulamaları özel `update_average` yöntemini çağırarak `average` alanını da güncelleyerek işlem yapar.

`list` ve `average` alanlarını özel bıraktığımız için, dışarıdaki kodun doğrudan `list` alanına öğeler ekleyip çıkarması mümkün değildir; aksi takdirde `list` değiştiğinde `average` alanı senkronize olmaktan çıkabilir. `average` yöntemi, `average` alanındaki değeri döner; dış kodun `average` değerini okumasına izin verir, ancak değiştirmesine izin vermez.

:::info Kapsülleme, uygulama detaylarını gizleyerek gelecekte veri yapısındaki değişiklikleri kolaylaştırır.

`AveragedCollection` struct'ının uygulama detaylarını kapsüle ettiğimiz için, gelecekte veri yapısı gibi yönleri kolayca değiştirebiliriz. Örneğin, `list` alanı için bir `HashSet` kullanabiliriz. `add`, `remove` ve `average` halka açık yöntemlerinin imzaları aynı kaldığı sürece, `AveragedCollection` kullanan kodun derlenmesi için değişmesine gerek kalmaz. Eğer `list` alanını halka açık yapsaydık, bu durum gerekli olmayacaktı: `HashSet` ve `Vec`, öğeleri eklemek ve çıkarmak için farklı yöntemlere sahiptir; bu nedenle, eğer dışarıdaki kod doğrudan `list`'i değiştiriyorsa, muhtemelen değişiklik yapmak zorunda kalacaktı.

Eğer kapsülleme, bir dilin nesne yönelimli olarak kabul edilmesi için gerekli bir unsur ise, o zaman Rust bu gerekliliği karşılamaktadır. Farklı kod parçaları için `pub` kullanma seçeneği, uygulama detaylarının kapsüllenmesini sağlar.

### Miras, Bir Tür Sistemi Olarak ve Kod Paylaşımı Olarak

*Miras* bir nesnenin başka bir nesnenin tanımından öğeleri miras alarak, ebeveyn nesnenin verilerini ve davranışlarını yeniden tanımlamaya gerek duymadan kazanması mekanizmasıdır.

:::warning Eğer bir dilin nesne yönelimli bir dil olabilmesi için mirasa sahip olması gerekiyorsa, o zaman Rust nesne yönelimli bir dil değildir.

Bir yapının ebeveyn yapının alanlarını ve yöntem uygulamalarını miras almasını sağlamak için bir makro kullanmadan bir yapı tanımlamanın bir yolu yoktur.

Ancak, eğer programlama araç setinizde mirasa alışkınsanız, Rust'ta mirası kullanma sebebinize bağlı olarak başka çözümler kullanabilirsiniz.

Mirası seçmenin iki ana nedeni vardır. Birincisi kodun yeniden kullanımı içindir: bir tür için belirli bir davranış uygulayabilirsiniz ve miras bu uygulamanın başka bir tür için yeniden kullanılmasını sağlar. Rust kodunda, `Summary` traitinde `summarize` yönteminin varsayılan uygulamasını eklediğimiz 10-14 numaralı listede gördüğünüz gibi, mirası sınırlı bir şekilde kullanabilirsiniz. 

> Bir tür, `Summary` traitini uygulayan herhangi bir tür, ek bir kod olmadan `summarize` yöntemini kullanabilir.  
> — Örnek uygulama

Bu, bir üst sınıfın bir yöntem uygulamasına sahip olması ve miras alan bir alt sınıfın da bu yöntem uygulamasına sahip olmasıyla benzerdir. `Summary` traitini uygularken varsayılan `summarize` yönteminin uygulamasını da geçersiz kılabiliriz ki bu, bir alt sınıfın üst sınıfından miras alınan bir yöntem uygulamasını geçersiz kılmasıyla benzerlik gösterir.

Mirası kullanmanın diğer nedeni, dizin sistemine ilişkindir: bir alt türün, ebeveyn türüyle aynı yerlerde kullanılmasını sağlamaktır. Bu ayrıca *polimorfizm* olarak adlandırılır ve belirli özellikleri paylaşan birden fazla nesnenin, çalışma zamanında birbirinin yerine geçebilmesi anlamına gelir.

> ### Polimorfizm
> 
> Birçok insan için polimorfizm, miras ile eş anlamlıdır. Ancak bu aslında birden fazla türde veri ile çalışabilen kodu ifade eden daha genel bir kavramdır. Miras için, bu türler genellikle alt sınıflardır.
> 
> Rust bunun yerine, farklı olası türlerin üzerinde soyutlama yapmak için generics kullanır ve bu türlerin sağlamak zorunda olduğu sınırlamalar için trait sınırları uygular. Bu bazen *sınırlı parametrik polimorfizm* olarak adlandırılır.

Miras, birçok programlama dilinde programlama tasarım çözümü olarak son zamanlarda popülaritesini yitirmiştir çünkü genellikle gerekenden daha fazla kod paylaşma riski taşır. Alt sınıflar her zaman üst sınıflarının tüm özelliklerini paylaşmamalıdır, ancak miras yoluyla bunu yapacaklardır. Bu, bir programın tasarımını daha az esnek hale getirebilir. Ayrıca, alt sınıflarda mantıklı olmayan veya alt sınıfa uygulanmayan yöntemleri çağırma olasılığını da beraberinde getirir. :::note Örneğin, bazı diller yalnızca tek mirası izin verir; bu da bir programın tasarım esnekliğini daha da kısıtlar.

Bu nedenlerden dolayı, Rust, miras yerine trait nesneleri kullanma yönünde farklı bir yaklaşım benimsemiştir. Şimdi trait nesnelerinin Rust'ta polimorfizmi nasıl sağladığına bakalım.