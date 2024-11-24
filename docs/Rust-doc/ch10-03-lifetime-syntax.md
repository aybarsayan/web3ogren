## Referansların Süreleri ile Doğrulanması

Süreler, zaten kullandığımız bir başka tür generiktir. Bir türün istediğimiz davranışı sağladığından emin olmak yerine, süreler referansların ihtiyaç duyduğumuz süre boyunca geçerli olmasını sağlar.

:::note
4. bölümdeki [“Referanslar ve Ödünç Alma”][references-and-borrowing] bölümünde tartışmadığımız bir detay, Rust'taki her referansın bir *ömrü* olduğudur; bu, o referansın geçerli olduğu alandır.
:::

Çoğu durumda, ömürler örtük ve çıkarımla belirlenmiştir; t t t t t çoğu zaman türler de çıkarımla belirlenir. Birden fazla tür mümkün olduğunda yalnızca türleri belirtmemiz gerekir. Benzer şekilde, referansların ömürleri birkaç farklı şekilde ilişkili olabileceğinde ömürleri de belirtmemiz gerekir. Rust, çalışma zamanında kullanılan gerçek referansların kesinlikle geçerli olmasını sağlamak için ilişkileri belirtmemizi gerektirir.

Ömürlerin belirtilmesi, çoğu diğer programlama dilinde bulunmayan bir kavramdır, bu yüzden bu durum alışılmadık gelebilir. Bu bölümde ömürleri tam olarak ele almayacak olsak da, kavramla rahat etmeye yardımcı olacak yaygın ömür sözdizimlerini tartışacağız.

### Ömürler ile Yanlış Referansların Önlenmesi

Ömürlerin ana amacı *yanlış referansların* önlenmesidir; bu tür referanslar, bir programın hedeflenenden farklı verilere referans vermesine neden olur. Dış bir kapsam ve iç bir kapsamı olan 10-16 numaralı listedeki programa bir göz atalım.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-16/src/main.rs}}
```



> Not: 10-16, 10-17 ve 10-23 numaralı listelerdeki örnekler, başlangıç değeri verilmeden değişkenler tanımlamakta, bu nedenle değişken adı dış kapsamda mevcuttur. İlk bakışta, bu durum Rust'ın null değerleri olmaması ile çelişiyor gibi görünebilir. Ancak, bir değişkeni değer vermeden kullanmaya çalışırsak, bir derleme hatası alırız; bu, Rust'ın gerçekten null değerlere izin vermediğini gösterir.

Dış kapsamda başlangıç değeri olmayan `r` adında bir değişken tanımlanmıştır ve iç kapsamda `5` başlangıç değerine sahip `x` adında bir değişken tanımlanmıştır. İç kapsamda `r`'nin değeri olarak `x`'e referans vermeye çalışıyoruz. Ardından iç kapsam sona erer ve `r`'nin değerini yazdırmaya çalışırız. Bu kod derlenmeyecek çünkü `r`'nin atıfta bulunduğu değer, onu kullanmadan önce kapsam dışına çıkmıştır. İşte hata mesajı:

```console
{{#include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-16/output.txt}}
```

Hata mesajında `x`‘in “yeterince uzun yaşamadığı” belirtilmiştir. Bunun nedeni, `x`'in iç kapsam sona erdiğinde kapsam dışına çıkacak olmasıdır. Ancak `r`, dış kapsam için hala geçerlidir; çünkü kapsamı daha büyüktür, bu yüzden “daha uzun yaşar” diyoruz. Rust bu kodun çalışmasına izin verseydi, `r` `x` kapsam dışına çıktığında serbest bırakılan belleği referans alıyor olacaktı ve `r` ile yapmaya çalıştığımız her şey doğru çalışmayacaktı. Peki Rust, bu kodun neden geçersiz olduğunu nasıl belirliyor? Bir ödünç alma denetleyicisi kullanıyor.

### Ödünç Alma Denetleyicisi

Rust derleyicisinde, tüm ödünçlerin geçerli olup olmadığını belirlemek için kapsamları karşılaştıran bir *ödünç alma denetleyicisi* vardır. 10-17 numaralı liste, ömürlerin değişkenlerin ömürlerini gösteren notasyonlarla 10-16 numaralı listedeki aynı kodu gösterir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-17/src/main.rs}}
```



Burada `r`'nin ömrünü `'a` ve `x`'in ömrünü `'b` olarak notlandırdık. Gördüğünüz gibi, iç `'b` bloğu dış `'a` ömür bloğundan çok daha küçüktür. Derleme zamanında Rust, bu iki ömrü karşılaştırır ve `r`'nin ömrünün `'a` olduğunu, ancak `'b` ömrüne sahip bir belleğe atıfta bulunduğunu görür. Program, `'b`'nin daha kısa olmasından dolayı reddedilir: referansın konusu, referans kadar uzun yaşamaz.

10-18 numaralı liste, kodu düzeltir böylece herhangi bir yanlış referans içermez ve hatasız derlenir.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-18/src/main.rs}}
```



Burada `x`'in ömrü `'b`’dir; bu durum, `'a`’dan daha büyüktür. Bu durumda `r` `x`'e referans verebilir çünkü Rust, `r`'deki referansın `x` geçerli olduğu sürece her zaman geçerli olacağını bilir.

Şimdi referansların ömürlerinin ne olduğunu ve Rust'ın referansların her zaman geçerli olmasını sağlamak için ömürleri nasıl analiz ettiğini bildiğinize göre, fonksiyonlar bağlamında genel ömürleri ve dönüş değerlerini keşfetmeye başlayalım.

### Fonksiyonlarda Genel Ömürler

İki dize dilimi arasında en uzun olanını döndüren bir fonksiyon yazacağız. Bu fonksiyon iki dize dilimi alacak ve tek bir dize dilimi döndürecektir. `longest` fonksiyonunu uyguladıktan sonra, 10-19 numaralı listedeki kod `En uzun dize abcd` sonuçlarını yazdırmalıdır.



```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-19/src/main.rs}}
```



Fonksiyonun, `longest` fonksiyonunun parametrelerinin sahipliğini almasını istemediğimiz için referanslar olan dize dilimlerini almasını istiyoruz. 10-19 numaralı listedeki kullandığımız parametrelerin neden bu olduğunu daha fazla tartışmak için 4. bölümdeki [“Dize Dilimlerinin Parametreler Olarak”][string-slices-as-parameters] bölümüne bakın.

Eğer 10-20 numaralı listedeki gibi `longest` fonksiyonunu uygulamaya çalışırsak, derlenmeyecektir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-20/src/main.rs:here}}
```



Bunun yerine, aşağıdaki hata ile karşılaşırız:

```console
{{#include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-20/output.txt}}
```

Yardım metni, döndürülen türün bir genel ömür parametresine ihtiyaç duyduğunu ortaya koyuyor çünkü Rust, döndürülen referansın `x` veya `y`'e atıfta bulunup bulunmadığını bilemiyor. Aslında, biz de tam olarak bilmiyoruz çünkü fonksiyonun gövdesindeki `if` bloğu `x`'e bir referans döndürüyor ve `else` bloğu `y`'ye bir referans döndürüyor!

Bu fonksiyonu tanımlarken, bu fonksiyona geçirilmesi beklenen somut değerleri bilmediğimiz için, `if` durumu veya `else` durumu çalıştığında somut ömürlerin ne olacağını bilmeyiz. Geçirilecek referansların somut ömürlerini de bilmediğimiz için, 10-17 ve 10-18 numaralı listelerde yaptığımız gibi kapsamları inceleyemeyiz, böylece döndürdüğümüz referansın her zaman geçerli olup olmayacağını belirleyemeyiz. Ödünç alma denetleyicisi de bunu belirleyemez çünkü `x` ve `y`'nin ömürlerinin dönüş değerinin ömrü ile nasıl ilişkilendiğini bilmez. Bu hatayı düzeltmek için, ödünç alma denetleyicisinin analiz yapabilmesi için referansların ömürleri arasındaki ilişkiyi tanımlayan genel ömür parametreleri ekleyeceğiz.

### Ömür Notasyon Sözdizimi

Ömür notasyonları, referansların ömürlerinin ne kadar sürdüğünü değiştirmez. Bunun yerine, birden fazla referansın ömürlerinin birbirleriyle ilişkilerini, ömürleri etkilemeden tanımlar. Tıpkı işlevlerin, imzada bir genel tür parametresi belirtildiğinde her türlü türü kabul edebilmesi gibi, işlevler de bir genel ömür parametresi belirterek herhangi bir ömre sahip referansları kabul edebilir.

Ömür notasyonlarının biraz alışılmadık bir sözdizimi vardır: ömür parametrelerinin adları bir apostrof (`'`) ile başlamalıdır ve genellikle küçük harflerle ve çok kısa yazılmalıdır, yani genel türler gibidir. Çoğu insan ilk ömür notasyonu için `'a` adını kullanır. Ömür parametre notasyonlarını, bir referansın `&` işareti sonrasına koyarız; notasyonu referansın türünden ayırmak için bir boşluk bırakırız.

İşte bazı örnekler: bir ömür parametresi olmadan `i32`'ye referans, `'a` adında bir ömür parametresine sahip `i32`'ye referans ve `'a` ömrüne sahip bir `i32` için değiştirilebilir referans.

```rust,ignore
&i32        // bir referans
&'a i32     // açık bir ömre sahip bir referans
&'a mut i32 // açık bir ömre sahip bir değiştirilebilir referans
```

Tek bir ömür notasyonu kendi başına pek anlam ifade etmez, çünkü notasyonlar, Rust'a birden fazla referansın genel ömür parametrelerinin nasıl ilişkili olduğunu söylemek içindir. Şimdi, ömür notasyonlarının `longest` fonksiyonu bağlamındaki ilişkisini inceleyelim.

### Fonksiyon İmzalarında Ömür Notasyonları

Fonksiyon imzalarında ömür notasyonlarını kullanmak için, genel *ömrü* parametrelerini açılı parantezler içinde, fonksiyon adının ve parametre listesi arasına tanımlamamız gerekir; t t t t t *t t t t t t t t t *.

:::info
İmzanın, döndürülen referansın, hem parametreler hem de dönüş değeri geçerli olduğu sürece geçerli olacağı kısıtlamayı ifade etmesini istiyoruz.
:::

Bu, parametrelerin ve dönüş değerinin ömürlerinin ilişkisidir. Ömre `'a` adını vereceğiz ve ardından onu her referansa ekleyeceğiz; 10-21 numaralı listedeki gibi.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-21/src/main.rs:here}}
```



Bu kod, 10-19 numaralı listedeki `main` fonksiyonu ile kullanıldığında beklediğimiz sonucu oluşturmalı ve derlenmelidir.

Fonksiyon imzası artık Rust'a, bazı ömürler için `'a`'dan geçerli olan iki parametre aldığını, bunların her ikisinin de en az `'a` kadar uzun süre geçerli olan dize dilimleri olduğunu belirtmektedir. Fonksiyon imzası ayrıca Rust'a, fonksiyondan döndürülen dize diliminin de en az `'a` kadar uzun süre geçerli olacağını bildirir. Pratikte, `longest` fonksiyonundan dönen referansın ömrü, fonksiyon argümanlarının atıfta bulunduğu değerlerin ömürlerinin daha kısa olanı kadardır. Bu ilişkiler, Rust'ın bu kodun analizinde kullanmasını istediğimiz verilerdir.

Unutmayın, bu fonksiyon imzasında ömür parametrelerini tanımlarken, geçilen veya döndürülen değerlerin ömürlerini değiştirmiyoruz. Bunun yerine, ödünç alma denetleyicisinin bu kısıtlamalara uymayan herhangi bir değeri reddetmesini belirtiyoruz. `longest` fonksiyonu, `x` ve `y`'nin ne kadar süre geçerli olacağını kesin olarak bilmesine gerek yok; sadece `'a` için birbirinin yerine kullanılabilecek bir kapsam olması yeterlidir.

:::warning
Fonksiyonlardaki ömürleri belirtirken, notasyonlar fonksiyon gövdesinde değil, fonksiyon imzasında yer alır. Ömür notasyonları, imzanın bir parçası haline gelir ve t t t t t t `t t t. t t t t. t t t t` .
:::

Somut referansları `longest`’e geçirirken, `'a` için yer tutucu olarak kullanılan somut ömür, `x`’in kapsamı ile `y`’nin kapsamının kesişimidir. Başka bir deyişle, genel ömür `'a` ile `x` ve `y`’nin ömürlerinin daha kısa olanı eşit olur. Döndürülen referansta aynı ömür parametresi `'a` ile notlandığı için, döndürülen referans da `x` ve `y`’nin ömürlerinin daha kısa olanı kadar geçerli olacaktır.

Farklı somut ömre sahip referanslar geçirirken `longest` fonksiyonunun nasıl kısıtlandığını görelim. 10-22 numaralı liste basit bir örnektir.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-22/src/main.rs:here}}
```



Bu örnekte, `string1` dış kapsam sonunda geçerlidir; `string2` iç kapsamının sonunda geçerlidir. `result`, iç kapsamının sonunda geçerli olan bir şeye referans verir. Bu kodu çalıştırdığınızda, ödünç alma denetleyicisinin onayladığını göreceksiniz; derlenecek ve `En uzun dize uzun dize uzun dize` yazacaktır.

Şimdi, `result`’ın referansının iki argümanın daha kısa ömrü olması gerektiğini gösteren bir örnek deneyelim. `result` değişkeninin tanımını iç kapsamın dışına alacağız; ancak `result` değişkenine değeri atamayı `string2` ile aynı kapsamda bırakacağız. Ardından, `result` kullanan `println!` ifadesini iç kapsamın dışına, iç kapsam sona erdikten sonra hareket ettireceğiz. 10-23 numaralı listedeki kod, derlenmeyecek.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-23/src/main.rs:here}}
```



Bu kodu derlemeye çalıştığımızda, aşağıdaki hata ile karşılaşırız:

```console
{{#include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-23/output.txt}}
```

Hata, `result`'ın `println!` ifadesi için geçerli olması için `string2`nin dış kapsamın sonuna kadar geçerli olması gerektiğini gösteriyor. Rust, bunu parametrelerin ve dönüş değerinin ömürlerini aynı ömür parametresi `'a` kullanarak notlandırdığımız için biliyor.

İnsanlar olarak, bu koda bakıp `string1`'in `string2`'den daha uzun olduğunu görebiliriz; bu nedenle `result`, `string1`'e referans içerecektir. `string1` hala kapsam dışına çıkmadığı için, `println!` ifadesi için `string1`'e referans geçerli olacaktır. Ancak, derleyici, bu referansın geçerli olduğunu göremez. Rust'a, `longest` fonksiyonundan döndürülen referansın, geçirilen referansların ömürlerinin daha kısa olanı kadar olduğunu belirttik. Bu nedenle ödünç alma denetleyicisi, 10-23 numaralı listedeki kodu geçersiz bir referans olabileceği için reddeder.

`longest` fonksiyonuna geçtiğiniz referansların değerlerini ve ömürlerini değiştirerek daha fazla deneme tasarlamayı deneyin ve döndürülen referansın nasıl kullanıldığına dair hipotezler geliştirin. Derlemeden önce denemelerinizin ödünç alma denetleyicisinden geçip geçmeyeceğini tahmin edin; ardından doğru olup olmadığını kontrol edin!

### Ömürler Açısından Düşünme

Ömür parametrelerini belirtme şekliniz, fonksiyonunuzun ne yaptığına bağlıdır. Örneğin, `longest` fonksiyonunun uygulamasını en uzun dize dilimi yerine her zaman ilk parametreyi döndürmek üzere değiştirdiğimizde, `y` parametresinde bir ömür belirtmemiz gerekmeyecektir. Aşağıdaki kod derlenir:



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-08-only-one-reference-with-lifetime/src/main.rs:here}}
```



`x` ve dönüş türü için bir ömür belirlendi fakat `y` parametresi için değil, çünkü `y`'nin ömrü `x`'nin ömrü ya da dönüş değeri ile bir ilişkiye sahip değildir.

Bir fonksiyondan referans döndürdüğümüzde, dönüş türü için ömür parametresi bir parametreye ait olmalıdır. Eğer döndürülen referans *hiçbir* parametreye atıfta bulunmuyorsa, fonksiyon içerisinde yaratılmış bir değere atıfta bulunması gerekir. Ancak, bu durumda değer fonksiyonun sonunda kapsam dışına çıkacağı için bu bir aşamalı referans olur. Aşağıda derlenmeyecek bir `longest` fonksiyonunun uygulanması bulunmaktadır:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-09-unrelated-lifetime/src/main.rs:here}}
```



Burada, dönüş türü için bir ömür parametresi `'a` belirlememiş olsak da, bu uygulama derlenmeyecektir çünkü dönüş değeri ömrü, parametrelerin ömürleriyle hiçbir şekilde ilişkili değildir. Aldığımız hata mesajı:

```console
{{#include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-09-unrelated-lifetime/output.txt}}
```

Sorun, `result`'in kapsam dışına çıkması ve `longest` fonksiyonunun sonunda temizlenmesidir. Ayrıca, fonksiyondan `result`'e bir referans döndürmeye çalışıyoruz. Aşamalı bir referans değişkenini değiştirecek şekilde ömür parametrelerini belirtmemiz mümkün değildir ve Rust aşamalı bir referans oluşturmaya izin vermeyecektir. Bu durumda en iyi çözüm, bir referans yerine sahip olunan bir veri türü döndürmek olur, böylece çağrılan fonksiyon değerin temizlenmesinden sorumlu olur.

Sonuçta, ömür sözdizimi çeşitli parametrelerin ve fonksiyonların dönüş değerlerinin ömürlerini bağlamakla ilgilidir. Bir kez bağlandıklarında, Rust, bellek güvenli operasyonlara izin verecek ve aşamalı işaretçiler ya da belleği güvenliğini ihlal edecek işlemleri engelleyecek yeterli bilgiye sahip olacaktır.

### Yapı Tanımlarında Ömür Notasyonları

Şu ana kadar tanımladığımız yapılar, her zaman sahip olunan türler tutar. Referanslar tutmak için yapılar tanımlayabiliriz; ancak bu durumda yapının tanımındaki her referansa bir ömür notasyonu eklememiz gerekecektir. 10-24 numaralı listedeki `ImportantExcerpt` adlı yapı, bir dizgi dilimi tutmaktadır.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-24/src/main.rs}}
```



Bu yapının, bir referans olan dizgi dilimini tutan tek bir alanı olan `part` bulunmaktadır. Genel veri türlerinde olduğu gibi, yapı adı sonrasındaki açılı parantezler içinde, ömür parametrelerinin adını belirtiyoruz; böylece yapının tanımında ömür parametrelerini kullanabiliriz. Bu notasyon, `ImportantExcerpt` örneğinin, `part` alanında tuttuğu referans ömründen daha uzun süre yaşamayacağı anlamına gelir.

Buradaki `main` fonksiyonu, `novel` değişkenine ait `String` içerindeki ilk cümleye bir referans tutan `ImportantExcerpt` yapısının bir örneğini oluşturur. `novel` içerdiği veriler, `ImportantExcerpt` örneği oluşturulmadan önce mevcuttur. Ayrıca `novel`, `ImportantExcerpt` kapsam dışına çıkmadan önce geçerliliğini yitirmez; bu nedenle `ImportantExcerpt` örneğindeki referans geçerli olacaktır.

### Ömür Belirsizliği

Her referansın bir ömrü olduğunu ve referansları kullanan fonksiyonlar veya yapıların ömür parametrelerini belirtmeniz gerektiğini öğrendiniz. Ancak, Referans 4-9'da (Listing 4-9) yer alan ve tekrar Referans 10-25'te (Listing 10-25) gösterilen bir fonksiyonumuz vardı ki bu, ömür anotasyonları olmadan derlenebildi.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-25/src/main.rs:here}}
```



:::note
Bu fonksiyonun ömür anotasyonları olmadan derlenmesinin nedeni tarihsel bir sebeptir: Rust'ın erken sürümlerinde (1.0'dan önce), bu kod derlenemezdi çünkü her referansın açık bir ömre ihtiyacı vardı. O zaman, fonksiyon imzası şöyle yazılırdı:
:::

```rust,ignore
fn first_word<'a>(s: &'a str) -> &'a str {
```

Birçok Rust kodu yazdıktan sonra, Rust ekibi Rust programcılarının belirli durumlarda aynı ömür anotasyonlarını sürekli olarak girdiklerini fark etti. Bu durumlar öngörülebilirdi ve birkaç belirleyici model izliyordu. Geliştiriciler bu kalıpları derleyicinin koduna programlayarak, ödünç alma kontrolörünün bu durumlarda ömürleri çıkarsamasını sağladılar ve açık anotasyonlara ihtiyaç duymadılar.

> Bu Rust tarihi parçası önemlidir çünkü daha deterministik kalıpların ortaya çıkması ve derleyiciye eklenmesi mümkündür. Gelecekte, daha az ömür anotasyonu gerekmeyebilir.  
> — Rust Ekibi

Rust'ın referans analizi için programlanan kalıplara *ömür belirsizlik kuralları* denir. Bunlar, programcıların uyması gereken kurallar değildir; derleyicinin dikkate alacağı belirli durumlar setidir ve eğer kodunuz bu durumlara uyuyorsa, ömürleri açıkça yazmanıza gerek yoktur.

Belirsizlik kuralları tam belirsizlik sağlamaz. Rust kuralları uyguladıktan sonra hala referansların ömürlerinin ne olması gerektiği konusunda belirsizlik varsa, derleyici kalan referansların ömrünün ne olacağını tahmin etmez. Tahmin yapmak yerine, derleyici size ömür anotasyonları ekleyerek çözebileceğiniz bir hata verir.

Fonksiyon veya yöntem parametrelerindeki ömürler *giriş ömürleri*, dönüş değerlerindeki ömürler ise *çıkış ömürleri* olarak adlandırılır.

Derleyici, açık anotasyon olmadığında referansların ömürlerini belirlemek için üç kural kullanır. İlk kural giriş ömürlerine uygulanır, ikinci ve üçüncü kurallar ise çıkış ömürlerine uygulanır. Derleyici üç kuralın sonuna geldiğinde ve hala ömürlerini belirleyemediği referanslar varsa, derleyici bir hata ile durur. Bu kurallar `fn` tanımları ve `impl` blokları için de geçerlidir.

- **İlk kural**, derleyicinin referans olan her parametreye bir ömür parametresi atamasıdır. Başka bir deyişle, bir parametreye sahip bir fonksiyon bir ömür parametresi alır: `fn foo(x: &'a i32)`; iki parametreye sahip bir fonksiyon iki ayrı ömür parametresi alır: `fn foo(x: &'a i32, y: &'b i32)`; ve daha fazlası.
  
- **İkinci kural**, eğer tam olarak bir giriş ömür parametresi varsa, o ömrün tüm çıkış ömür parametrelerine atandığıdır: `fn foo(x: &'a i32) -> &'a i32`.

- **Üçüncü kural**, birden fazla giriş ömür parametresi varsa, ancak bunlardan biri `&self` veya `&mut self` ise, çünkü bu bir yöntemdir, `self`'in ömrü tüm çıkış ömür parametrelerine atanır. Bu üçüncü kural yöntemleri daha okunaklı ve yazılabilir kılar çünkü daha az sembol gereklidir.

:::tip
Derleyici olduğumuzu varsayalım. Bu kuralları, Referans 10-25'teki `first_word` fonksiyonunun imzasındaki referansların ömürlerini belirlemek için uygulayacağız. İmza, referanslarla ilgili herhangi bir ömür olmadan başlar:
:::

```rust,ignore
fn first_word(s: &str) -> &str {
```

Sonra derleyici ilk kuralı uygular, bu kural her parametrenin kendi ömrünü almasını belirtir. Bunu `‘a` olarak adlandıralım, bu nedenle imza artık şöyledir:

```rust,ignore
fn first_word<'a>(s: &'a str) -> &str {
```

İkinci kural, tam olarak bir giriş ömrü olduğu için uygulanır. İkinci kural, bir giriş parametresinin ömrünün çıkış ömrüne atanacağını belirtir, bu nedenle imza artık şöyledir:

```rust,ignore
fn first_word<'a>(s: &'a str) -> &'a str {
```

Artık bu fonksiyon imzasındaki tüm referansların ömürleri vardır ve derleyici, programcının bu fonksiyon imzasındaki ömürleri anotasyonu yapmadan analizine devam edebilir.

Bir başka örneğe bakalım, bu sefer Referans 10-20'de ömür parametreleri olmayan `longest` fonksiyonunu kullanacağız:

```rust,ignore
fn longest(x: &str, y: &str) -> &str {
```

İlk kuralı uygulayalım: Her parametre kendi ömrünü alır. Bu sefer bir yerine iki parametre var, bu yüzden iki ömür elde ediyoruz:

```rust,ignore
fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &str {
```

İkinci kuralın uygulanmadığını görebilirsiniz çünkü birden fazla giriş ömrü vardır. Üçüncü kural da uygulanmaz çünkü `longest` bir fonksiyon olup hiçbir parametre `self` değildir. Üç kuralı çalıştırdıktan sonra, dönüş tipinin ömrünü hala belirleyemedik. Bu yüzden Referans 10-20'deki kodu derlemeye çalışırken hata aldık: Derleyici ömür belirsizlik kurallarını çalıştırdı ama yine de imza içindeki referansların tüm ömürlerini belirleyemedi.

Üçüncü kural yalnızca yöntem imzalarında gerçekten geçerli olduğu için, neden yöntem imzalarında ömürleri çok sık anotasyon yapmamıza gerek olmadığını bir sonraki bölümde inceleyeceğiz.

### Yöntem Tanımlarında Ömür Anotasyonları

Bir yapı üzerinde ömürleri olan yöntemler uyguladığımızda, Referans 10-11'de gösterilen genel tip parametrelerinin aynı sözdizimini kullanırız. Ömür parametrelerini hangi durumda bildirdiğimiz ve kullandığımız, bu parametrelerin yapı alanlarıyla mı yoksa yöntem parametreleriyle ve dönüş değerleriyle mi ilişkili olduğuna bağlıdır.

Yapı alanları için ömür adları her zaman `impl` anahtar kelimesinden sonra bildirilmelidir ve ardından yapının adından sonra kullanılmalıdır çünkü bu ömürler yapının türünün bir parçasıdır.

`impl` blok içindeki yöntem imzalarında, referanslar yapı alanlarındaki referansların ömrüne bağlı olabilir veya bağımsız olabilir. Ayrıca, ömür belirsizlik kuralları genellikle yöntem imzalarında ömür anotasyonlarına gerek olmadığı anlamına gelir. Şimdi, Referans 10-24'te tanımladığımız `ImportantExcerpt` adlı yapıyı kullanarak bazı örneklere bakalım.

Öncelikle, tek parametre olarak `self` referansı alan ve dönüş değeri `i32` olan bir `level` yöntemini kullanacağız:

```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-10-lifetimes-on-methods/src/main.rs:1st}}
```

`impl` sonrasındaki ömür parametresi bildirimi ve tür adından sonrasındaki kullanımı gereklidir, ancak ilk belirsizlik kuralı nedeniyle `self` referansının ömrünü anotasyon yapmamıza gerek yoktur.

:::tip
Üçüncü ömür belirsizlik kuralının uygulandığı bir örnek:
:::

```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-10-lifetimes-on-methods/src/main.rs:3rd}}
```

İki giriş ömrü vardır, bu yüzden Rust ilk ömür belirsizlik kuralını uygular ve hem `&self` hem de `announcement` kendi ömürlerini alır. Sonra, `&self` parametrelerinden biri olduğu için dönüş tipi `&self`'in ömrünü alır, ve tüm ömürler hesaplanmış olur.

### Statik Ömür

Tartışmamız gereken özel bir ömür var: `'static`, bu, ilgili referansın programın tüm süresi boyunca yaşayabileceğini (can live) belirtir. Tüm dize literalleri `'static` ömrüne sahiptir, bunu aşağıdaki gibi belirtebiliriz:

```rust
let s: &'static str = "Statik bir ömre sahibim.";
```

Bu dizedeki metin, programın ikili dosyasına doğrudan depolanır ve her zaman erişilebilir. Bu nedenle, tüm dize literallerinin ömrü `'static`'tir.

Hata mesajlarında `'static` ömrünü kullanmanız önerilebilir. Ancak, bir referansın gerçekten programınızın tüm ömrü boyunca yaşayıp yaşamadığını veya bunu isteyip istemediğinizi düşünmeden `'static`'ı ömür olarak belirlemeyin. Çoğu zaman, `'static` ömrünü önermek, sarkan bir referans oluşturmaya veya mevcut ömürlerin uyumsuzluğuna çalışmakta olduğunuz bir hatanın sonucudur. Böyle durumlarda, çözüm bu problemleri düzeltmektir, `'static` ömrünü belirtmek değil.

## Genel Tip Parametreleri, Trait Sınırları ve Ömürleri Birlikte

Genel tip parametrelerini, trait sınırlarını ve ömürleri bir fonksiyonda belirtme sözdizimine kısaca bakalım!

```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-11-generics-traits-and-lifetimes/src/main.rs:here}}
```

Bu, iki dize dilimini karşılaştıran, daha uzun olanı döndüren Referans 10-21’deki `longest` fonksiyonudur. Ancak şimdi, `where` koşulunda tanımlandığı gibi `Display` traitini uygulayan herhangi bir tür tarafından doldurulabilecek `T` genel tipine sahip ek bir parametre olan `ann` eklenmiştir. Bu ek parametre `{}` kullanılarak yazdırılacaktır, bu nedenle `Display` trait sınırı gereklidir. Ömürler türlerin bir türü olduğundan, ömür parametre bildiriminin `'a` ve genel tür parametre bildirimi `T` ile birlikte açıken funksiyon adı sonrasındaki açılı parantez içerisinde yer alır. 

## Özet

Bu bölümde çok şey gördük! Genel tip parametrelerini, trait ve trait sınırlarını ve genel ömür parametrelerini bildiğinize göre, birçok farklı durumda çalışan, tekrarsız kod yazmaya hazırsınız. Genel tip parametreleri, kodu farklı türlerde uygulamanıza olanak tanır. Traitler ve trait sınırları, türler genel olsa bile, kodun ihtiyaç duyduğu davranışa sahip olmalarını sağlar. Ömür anotasyonlarını kullanmayı öğrendiniz ki bu esnek kodun sarkan referanslar içermesini engellemekte kullanılabilir. Tüm bu analizler derleme zamanında gerçekleşir ve çalışma zamanı performansını etkilemez!

İnanın ya da inanmayın, bu bölümde tartıştığımız konular hakkında öğrenilecek daha çok şey var: Bölüm 18, trait nesneleri ile ilgili, bu da traitleri kullanmanın başka bir yoludur. Ayrıca, yalnızca çok ileri düzey senaryolarda ihtiyacınız olacak ömür anotasyonları ile daha karmaşık senaryolar da vardır; bunlar için [Rust Referansı][reference] okumalısınız. Ancak bir sonraki bölümde, kodunuzun beklenildiği gibi çalıştığından emin olmak için Rust'da test yazmayı öğreneceksiniz.

[references-and-borrowing]:
ch04-02-references-and-borrowing.html#references-and-borrowing
[string-slices-as-parameters]:
ch04-03-slices.html#string-slices-as-parameters
[reference]: ../reference/index.html