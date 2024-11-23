## Güvensiz Rust

Şimdiye kadar tartıştığımız tüm kod, Rust'un bellek güvenliği garantilerinin derleme zamanında uygulanmasıyla ilgiliydi. Ancak, Rust'un içinde bu bellek güvenliği garantilerini uygulamayan ikinci bir dil gizlidir: *güvensiz Rust* olarak adlandırılır ve normal Rust gibi çalışır, ancak bize ekstra süper güçler verir.

:::info
Güvensiz Rust, yapısı gereği statik analizin temkinli olmasından dolayı vardır. Derleyici, kodun garantileri sağlayıp sağlamadığını belirlemeye çalışırken, bazı geçerli programları reddetmesi, bazı geçersiz programları kabul etmesinden daha iyidir.
:::

Kod *belki* de doğru olsa da, Rust derleyicisinin kendine güvenebilmesi için yeterli bilgiye sahip olmadığı durumlarda kodu reddedecektir. Bu durumlarda, "Bana güven, ne yaptığımı biliyorum." demek için güvensiz kod kullanabilirsiniz. Ancak, güvensiz Rust kullanmanın kendi riskleri olduğunu unutmayın: güvensiz kodu yanlış kullanırsanız, bellek güvenliği sorunları, örneğin null gösterici dereferansı gibi problemler meydana gelebilir.

Rust'un güvensiz bir alter egosuna sahip olmasının bir diğer nedeni de, altında yatan bilgisayar donanımının doğası gereği güvensiz olmasıdır. Rust, güvensiz işlemlere izin vermezse, belirli görevleri yerine getiremezsiniz. Rust'ın amacı, işletim sistemi ile doğrudan etkileşimde bulunmak veya kendi işletim sisteminizi yazmak gibi düşük seviyeli sistem programlamasına olanak tanımaktır. Düşük seviyeli sistem programlaması ile çalışmak da dilin hedeflerinden biridir. Güvensiz Rust ile ne yapabileceğimizi ve bunu nasıl yapacağımızı keşfedelim.

### Güvensiz Süper Güçler

Güvensiz Rust'a geçmek için `unsafe` anahtar kelimesini kullanın ve ardından güvensiz kodu tutacak yeni bir blok başlatın. **Güvensiz Rust'ta güvenli Rust'ta yapamadığınız beş işlem gerçekleştirebilirsiniz** ve bunlara *güvensiz süper güçler* denir. Bu süper güçler, şunları içerir:

- Bir ham işaretçiyi dereferanslama
- Güvensiz bir fonksiyonu veya metodu çağırma
- Değiştirilebilir bir statik değişkene erişme veya onu değiştirme
- Güvensiz bir arayüz sağlaması
- Bir `union`'un alanlarına erişim

:::warning
`unsafe` anahtar kelimesinin, ödünç alma kontrolünü devre dışı bırakmadığını veya Rust'un diğer güvenlik kontrollerini devre dışı bırakmadığını anlamak önemlidir: güvensiz kodda bir referans kullanıyorsanız, hala kontrol edilir.
:::

`unsafe` anahtar kelimesi, yalnızca bu beş özelliğe erişim sağlar ve bunlar derleyici tarafından bellek güvenliği için kontrol edilmez. Bir güvensiz blok içinde yine de belli bir düzeyde güvenlik sağlanır. Dahası, `unsafe` kodun blok içinde mutlaka tehlikeli olmadığı veya bellek güvenliği problemleri yaratmayacağı anlamına gelmez: amaç, programcı olarak, `unsafe` bloğun içinde bulunan kodun belleğe geçerli bir şekilde erişeceğini sağlamaktır.

> **Unutmayın**: İnsanlar hata yapabilir ve hatalar olacaktır, ancak bu beş güvensiz işlemin `unsafe` ile işaretlenmiş bloklar içinde yer almasını gerektirerek, bellek güvenliği ile ilgili hataların bir `unsafe` bloğu içinde olacağını bileceksiniz. `unsafe` bloklarını küçük tutun; bellek hatalarını araştırdığınızda ileride mutlu olacaksınız.

Güvensiz kodu mümkün olduğunca izole etmek için, güvensiz kodu güvenli bir soyutlama içine yerleştirip güvenli bir API sağlamanız en iyisidir, bunu sonraki bölümlerde güvensiz fonksiyonları ve metodları incelerken tartışacağız. Standart kütüphanenin bazı bölümleri, denetlenmiş güvensiz kod üzerinden güvenli soyutlamalar olarak uygulanmıştır. Güvensiz kodu güvenli bir soyutlamaya sarmak, `unsafe` kullanmanın tüm yerlerine sızmasını önler, çünkü güvenli bir soyutlama kullanmak güvenlidir.

Şimdi her bir beş güvensiz süper gücü sırayla inceleyelim. Aşağıda, güvensiz kod için güvenli bir arayüz sağlayan bazı soyutlamalara da bakacağız.

### Ham Bir İşaretçiyi Dereferanslama

Bölüm 4'te, [“Sarkık Referanslar”][dangling-references] bölümünde, derleyicinin referansların her zaman geçerli olmasını sağladığını belirttik. Güvensiz Rust'ta, referanslara benzer olan iki yeni tür olan *ham işaretçiler* bulunmaktadır. Referanslarla aynı şekilde, ham işaretçiler değiştirilemez veya değiştirilebilir olabilir ve sırasıyla `*const T` ve `*mut T` olarak yazılır. Yıldız işareti dereferanslama operatörü değildir; tip adının bir parçasıdır. Ham işaretçiler bağlamında, *değiştirilemez* demek, işaretçinin dereferanslandıktan sonra doğrudan atanamayacağı anlamına gelir.

> **Önemli Not**: Referanslar ve akıllı işaretçilerden farklı olarak, ham işaretçiler:
>
> - Hem bir değiştirilemez hem de değiştirilebilir işaretçiyi veya aynı konuma birden fazla değiştirilebilir işaretçiyi görmezden gelme iznine sahiptir
> - Geçerli belleğe işaret etme garantisi yoktur
> - Null olmasına izin verilir
> - Otomatik temizlik sağlamazlar

Rust'un bu garantilerin uygulanmasını reddetmesi, daha iyi performans veya Rust'un garantilerinin geçerli olmadığı başka bir dil veya donanımla arayüz oluşturma yeteneği için garantili güvenlikten vazgeçmenizi sağlar.

Liste 20-1, bir değiştirilemez ve bir değiştirilebilir ham işaretçi oluşturmanın nasıl olduğunu göstermektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-01/src/main.rs:here}}
```



Bu kodda `unsafe` anahtar kelimesini dahil etmediğimize dikkat edin. Ham işaretçileri güvenli kodda oluşturabiliriz; sadece bir güvensiz blok dışında ham işaretçileri dereferanslayamayız, birazdan göreceksiniz.

Ham işaretçileri, ham ödünç alma operatörlerini kullanarak oluşturduk: `&raw const num` bir `*const i32` değiştirilemez ham işaretçi oluşturur ve `&raw mut num` bir `&mut i32` değiştirilebilir ham işaretçi oluşturur. Bunları doğrudan yerel bir değişkenden oluşturduğumuz için, bu belirli ham işaretçilerin geçerli olduğunu biliyoruz, ancak sadece herhangi bir ham işaretçinin bu geçerli olduğu varsayımında bulunamayız.

Bunu göstermek için, `as` kullanarak bir değeri dönüştürerek geçerliliğinden bu kadar emin olmadığımız bir ham işaretçi oluşturacağız. Liste 20-2, bellekteki keyfi bir konuma işaret eden bir ham işaretçi oluşturmanın nasıl olduğunu gösterir. Keyfi belleği kullanmaya çalışmak tanımsızdır: o adreste veri olabilir veya olmayabilir, derleyici kodu optimize edebilir ve bellek erişimi olmayabilir veya program bir segment hatası ile hata verebilir. Genellikle, böyle bir kod yazmak için iyi bir neden yoktur, özellikle ham ödünç alma operatörü kullanabileceğiniz durumlarda, ancak bu mümkündür.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-02/src/main.rs:here}}
```



Ham işaretçileri güvenli kodda oluşturabildiğimizi hatırlayın, ancak ham işaretçileri *dereferanslayamayız* ve işaret ettikleri verileri okuyamayız. Liste 20-3'te, bir ham işaretçiyi dereferanslamak için `*` dereferanslama operatörünü kullanıyoruz ve bu bir `unsafe` bloğu gerektirir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-03/src/main.rs:here}}
```



Bir işaretçi oluşturmak zarar vermez; yalnızca işaret ettiği değeri erişmeye çalıştığımızda geçersiz bir değerle karşılaşabiliriz.

Liste 20-1 ve 20-3'te, `*const i32` ve `*mut i32` ham işaretçileri oluşturduk ve her ikisi de `num`'un saklandığı aynı bellek konumuna işaret ediyor. Eğer `num`'a bir değiştirilemez ve değiştirilebilir referans oluşturmaya çalışsaydık, kod derlenmeyecekti çünkü Rust'ın mülkiyet kuralları, aynı anda bir değiştirilemez referansla birlikte bir değiştirilebilir referansa izin vermez. Ham işaretçiler ile, aynı konuma bir değiştirilebilir işaretçi ve bir değiştirilemez işaretçi oluşturabiliriz ve değiştirilebilir işaretçi aracılığıyla veriyi değiştirebiliriz ve bu da bir veri yarışına yol açabilir. Dikkatli olun!

Tüm bu tehlikelerle, neden ham işaretçileri kullanmalısınız? Bir ana kullanım durumu, bir C kodu ile arayüz oluşturma ihtiyacıdır; bunu bir sonraki bölümde, `“Güvensiz Bir Fonksiyonu veya Metodu Çağırma.”` göreceksiniz. Bir diğer durum ise ödünç alma kontrolünün anlamadığı güvenli soyutlamalar oluşturmaktır. Güvensiz fonksiyonları tanıtacağız ve ardından güvensiz kod kullanan bir güvenli soyutlama örneğine bakacağız.

### Güvensiz Bir Fonksiyonu veya Metodu Çağırma

Güvensiz bir blok içinde gerçekleştirebileceğiniz ikinci işlem güvensiz fonksiyonları çağırmaktır. Güvensiz fonksiyonlar ve metodlar, tamamen normal fonksiyonlar ve metodlar gibi görünür, ancak tanımın geri kalanından önce ek bir `unsafe` ile tanımlanır. Bu bağlamda `unsafe` anahtar kelimesi, bu fonksiyonu çağırırken uymamız gereken gereksinimler olduğunu belirtir, çünkü Rust bu gereksinimleri yerine getirip getirmediğimizden emin olamaz. Bir `unsafe` bloğu içinde bir güvensiz fonksiyon çağırırken, bu fonksiyonun belgelerini okuduğumuzu belirtiyor ve fonksiyonun sözleşmelerini yerine getirmekten sorumlu olduğumuzu belirtiyoruz.

:::note
İşte vücut kısmında hiçbir şey yapmayan `dangerous` adında bir güvensiz fonksiyon:
:::

```rust
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-01-unsafe-fn/src/main.rs:here}}
```

`dangerous` fonksiyonunu ayrı bir `unsafe` bloğu içinde çağırmalıyız. Eğer `dangerous` fonksiyonunu `unsafe` bloğu olmadan çağırmaya çalışırsak, bir hata alırız:

```console
{{#include ../listings/ch20-advanced-features/output-only-01-missing-unsafe/output.txt}}
```

`unsafe` bloğu ile Rust'a, fonksiyonun belgelerini okuduğumuzu, nasıl düzgün bir şekilde kullanılacağını anladığımızı ve fonksiyonun sözleşmesini yerine getirme konusunda teyit ettiğimizi belirtiyoruz. Güvensiz fonksiyonların gövdesi, etkili bir şekilde `unsafe` bloklarıdır, bu nedenle güvensiz bir fonksiyon içinde başka güvensiz işlemler gerçekleştirmek için başka bir `unsafe` bloğu eklememize gerek yoktur.

#### Güvensiz Kod Üzerinde Güvenli Bir Soyutlama Oluşturma

Bir fonksiyonun içinde güvensiz kod bulunması, tüm fonksiyonu güvensiz olarak işaret etmemiz gerektiği anlamına gelmez. Aslında, güvensiz kodu güvenli bir fonksiyon içinde sarmak yaygın bir soyutlamadır. Örneğin, standart kütüphaneden bazı güvensiz kod gerektiren `split_at_mut` fonksiyonunu inceleyelim. Bunu nasıl uygulamayı düşüneceğimiz, hayal gücümüzdeki örnekleri düşünmekle ilgilidir. Bu güvenli metot, değiştirilebilir dilimler üzerinde tanımlanmıştır: bir dilimi alır ve verilen indeks üzerinde dilimi ikiye bölerek iki dilim oluşturur. Liste 20-4, `split_at_mut`'in nasıl kullanılacağını göstermektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-04/src/main.rs:here}}
```



Bu fonksiyonu yalnızca güvenli Rust kullanarak uygulayamayız. Bir girişim, Liste 20-5 gibi görünebilir, ancak derlenmeyecek. Basitlik adına, `split_at_mut`'i metod yerine bir fonksiyon olarak ve yalnızca `i32` değerlerinin dilimleri için uygulayacağız.

Listelere göz attığınızda, göreceğiniz gibi kod derlemeye çalıştığımızda, bir hata alacağız.

```console
{{#include ../listings/ch20-advanced-features/listing-20-05/output.txt}}
```

Rust'ın ödünç alma kontrolü, dilimin farklı parçalarını ödünç aldığımızı anlamaz; sadece aynı dilimden iki kez ödünç aldığımızı bilir. Dilimin farklı parçalarını ödünç almak temelde kabul edilebilir çünkü iki dilim örtüşmez, ancak Rust bunu bilmek için yeterince akıllı değildir. Kodun doğru olduğunu bildiğimiz zaman ama Rust bunu bilmediğinde, güvensiz koda başvurmanın zamanı gelir.

Liste 20-6, `split_at_mut` fonksiyonunun çalışması için bir `unsafe` bloğu, bir ham işaretçi ve bazı güvensiz fonksiyon çağrıları kullanmanın nasıl olduğunu göstermektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-06/src/main.rs:here}}
```



Bölüm 4'teki [“Dilim Tipi”][the-slice-type] bölümünden hatırlayın ki, dilimler bazı verilere ve dilimin uzunluğuna bir göstericidir. Bir dilimin uzunluğunu almak için `len` yöntemini ve bir dilimin ham işaretçisine erişmek için `as_mut_ptr` yöntemini kullanırız. Bu durumda, `i32` değerlerine sahip değiştirilebilir bir dilim olduğumuz için, `as_mut_ptr` tipi `*mut i32` olan bir ham işaretçi döndürmektedir, bu da `ptr` değişkeninde saklanmıştır.

`mid` indeksinin dilim içinde olup olmadığını doğrulamaya devam ediyoruz. Ardından güvensiz koda geçiyoruz: `slice::from_raw_parts_mut` fonksiyonu bir ham işaretçi ve bir uzunluk alır ve bir dilim oluşturur. Bu fonksiyonu kullanarak `ptr`'dan başlayıp `mid` öğe uzunluğunda bir dilim oluşturuyoruz. Ardından, `ptr` üzerinde `mid`'i argüman olarak vererek `mid`'de başlayan bir ham işaretçi almak için `add` metodunu çağırıyoruz ve o gösterici ve `mid`'den kalan öğe sayısı ile uzunluğu oluşturuyoruz.

:::tip
`slice::from_raw_parts_mut` fonksiyonu güvensizdir çünkü bir ham işaretçi alır ve bu işaretçinin geçerli olduğunu kabul etmelidir. Ham işaretçilerin `add` metodunun da güvensiz olduğunu unutmayın, çünkü kullandığı konumun geçerli bir işaretçi olduğu hususunda güvenmek zorundadır. Bu nedenle, `slice::from_raw_parts_mut` ve `add` çağrılarımızın etrafına bir `unsafe` bloğu eklememiz gerekti.
:::

Kodu incelediğimizde ve `mid`'in `len`'den küçük veya eşit olduğu doğrulamasını eklediğimizde, `unsafe` bloğu içindeki tüm ham işaretçilerin geçerli işaretçiler olacağını belirleyebiliyoruz. Bu, `unsafe` kullanımının kabul edilebilir ve uygun bir kullanımidir.

Sonuç olarak, `split_at_mut` fonksiyonunu `unsafe` olarak işaretlememize gerek yoktur ve bu fonksiyonu güvenli Rust'tan çağırabiliriz. Bu fonksiyonu, bu fonksiyonun eriştiği verilerden yalnızca geçerli işaretçiler oluşturarak güvensiz kod için güvenli bir soyutlama oluşturmuşuzdur.

Tam tersine, Liste 20-7'deki `slice::from_raw_parts_mut` kullanımı, dilim kullanıldığında muhtemelen çökmesine neden olacaktır. Bu kod, keyfi bir bellek konumundan bir dilim oluşturur ve 10.000 öğe uzunluğundadır.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-07/src/main.rs:here}}
```



Bu keyfi konumda belleğe sahip değiliz ve bu kodun oluşturduğu dilimin geçerli `i32` değerleri içerdiğine dair bir garanti yoktur. `values`'ı geçerli bir dilim varmış gibi kullanmaya çalışmak tanımsız bir davranışa yol açar.

#### Harici Kod Çağırmak İçin `extern` Fonksiyonları Kullanma

Bazen, Rust kodunuz başka bir dilde yazılmış kodla etkileşim kurması gerekebilir. Bunun için Rust, *Yabancı Fonksiyon Arayüzü (FFI)* oluşturmayı ve kullanmayı kolaylaştıran `extern` anahtar kelimesini sunar. FFI, bir programlama dilinin fonksiyonlar tanımlamasını ve farklı (yabancı) bir programlama dilinin bu fonksiyonları çağırmasına izin veren bir yoldur.

Liste 20-8, C standart kütüphanesindeki `abs` fonksiyonu ile entegrasyon oluşturmanın nasıl olduğunu göstermektedir. `extern` blokları içinde tanımlanan fonksiyonlar, Rust kodundan her zaman güvensizdir. Bunun nedeni, diğer dillerin Rust'ın kurallarını ve garantilerini uygulamıyor olması ve Rust'ın bunları kontrol edememesidir; bu nedenle sorumluluk programcıya düşmektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-08/src/main.rs}}
```



`extern "C"` bloğu içinde, çağırmak istediğimiz başka bir dilden gelen harici fonksiyonların isimlerini ve imzalarını listeliyoruz. `"C"` kısmı, harici fonksiyonun kullandığı *uygulama ikili arayüzünü (ABI)* tanımlar: ABI, fonksiyonu montaj seviyesinde çağırmanın nasıl olacağını belirler. `"C"` ABI en yaygın olanıdır ve C programlama dilinin ABI'sine uyar.

:::tip
#### Diğer Dillerden Rust Fonksiyonlarını Çağırma
`extern` anahtar kelimesi, başka dillerin Rust fonksiyonlarını çağırmasını sağlayan bir arayüz oluşturmak için de kullanılabilir. Bütün bir `extern` bloğu oluşturmak yerine, ilgili fonksiyon için `fn` anahtar kelimesinin hemen önüne `extern` anahtar kelimesini ekleyip kullanılacak ABI'yi belirtiriz. Ayrıca, Rust derleyicisine bu fonksiyonun adını değiştirmemesi için `#[no_mangle]` anotasyonu eklememiz gerekir. *Mangle* etmek, bir derleyicinin bir fonksiyona verdiğimiz adı, derleme sürecinin diğer bölümleri için daha fazla bilgi içeren ancak insanın okumasının zor olduğu farklı bir adla değiştirmesidir. Her programlama dili derleyicisi adları biraz farklı mangle eder, bu nedenle bir Rust fonksiyonunun diğer diller tarafından adıyla çağrılabilmesi için Rust derleyicisinin ad değiştirmesini devre dışı bırakmalıyız.

Aşağıdaki örnekte, `call_from_c` fonksiyonunu, paylaşılan bir kütüphaneye derlendikten ve C'den bağlandıktan sonra C kodundan erişilebilir hale getiriyoruz:

```rust
#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("C'den bir Rust fonksiyonu çağrıldı!");
}
```
:::

Bu `extern` kullanımı `unsafe` gerektirmez.

### Değiştirilebilir Statik Bir Değişkene Erişim veya Onu Değiştirme

Bu kitapta henüz *küresel değişkenlerden* bahsetmedik; Rust bu tür değişkenleri destekler ancak Rust'un sahiplik kuralları ile sorunlu olabilir. İki iş parçacığı aynı değiştirilebilir küresel değişkene erişiyorsa, veri yarışı (data race) meydana gelebilir.

Rust'ta küresel değişkenler *statik* değişkenler olarak adlandırılır. Aşağıdaki liste, bir dize dilim değerine sahip bir statik değişkenin bir örnek bildirimini ve kullanımını göstermektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-09/src/main.rs}}
```



Statik değişkenler, 3. Bölümdeki [“Değişkenler ve Sabitler Arasındaki Farklar”][differences-between-variables-and-constants] bölümünde tartıştığımız sabitlere benzer. **Statik değişkenlerin adları geleneksel olarak** `SCREAMING_SNAKE_CASE` formatında yazılır. Statik değişkenler yalnızca `'static` ömrüne sahip referansları depolayabilir; bu da Rust derleyicisinin yaşam süresini belirleyebileceği ve bunun açıkça belirtilmesi gerekmediği anlamına gelir. Değiştirilemeyen bir statik değişkene erişim güvenlidir.

:::info
Sabitler ile değiştirilemeyen statik değişkenler arasındaki ince bir fark, statik bir değişkendeki değerlerin bellekte sabit bir adrese sahip olmasıdır. Değeri kullanmak her zaman aynı veriye erişir. 
:::

Öte yandan, sabitlerin her kullanıldığında verilerini çoğaltmalarına izin verilir. Diğer bir fark ise, statik değişkenlerin değiştirilebilir olabilmesidir. Değiştirilebilir statik değişkenlere erişim ve onları değiştirmek *güvenli değildir*. Liste 20-10, `COUNTER` adındaki bir değiştirilebilir statik değişkenin nasıl tanımlanacağını, erişileceğini ve değiştirileceğini göstermektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-10/src/main.rs}}
```



Normal değişkenlerde olduğu gibi, değiştirilebilirliği belirtmek için `mut` anahtar kelimesini kullanıyoruz. `COUNTER` değişkenini okuyan veya yazan herhangi bir kod bir `unsafe` bloğu içinde olmalıdır. Bu kod derlenir ve beklediğimiz gibi `COUNTER: 3` çıktısını verir çünkü tek iş parçacıklıdır. 

> **Not:** Birden fazla iş parçacığının `COUNTER` değişkenine erişimi veri yarışlarına neden olabilir; dolayısıyla tanımsız bir davranıştır.

Bu nedenle, tüm fonksiyonu `unsafe` olarak işaretlememiz ve güvenlik sınırlamasını belgelerken, fonksiyonu çağıranların neyin güvenli olduğunu bilmelerini sağlayarak, neyin yapılmasına izin verildiğini veya verilmediğini belirtmemiz gerekir.

Her zaman bir güvenli olmayan fonksiyon yazdığımızda, `SAFETY` ile başlayan bir yorum yazmak, fonksiyonun güvenli bir şekilde çağrılması için çağıranın ne yapması gerektiğini açıklamak için yaygın bir uygulamadır. Benzer şekilde, güvenli olmayan bir işlem gerçekleştirdiğimizde, güvenlik kurallarının nasıl korunduğunu açıklamak için `SAFETY` ile başlayan bir yorum yazmak yaygın bir uygulamadır.

Küresel olarak erişilebilir değiştirilebilir verilerle, veri yarışlarının olmadığını sağlamak zor olabilir; bu nedenle Rust, değiştirilebilir statik değişkenleri güvenli görmez. 

:::tip
Mümkün olduğunda, derleyicinin farklı iş parçacıklarından erişilen verilerin güvenli bir şekilde erişildiğinden emin olabilmesi için, 16. Bölümde tartıştığımız eşzamanlılık tekniklerini ve iş parçacığı güvenli akıllı işaretçileri kullanmamız daha iyidir.
:::

### Güvensiz Bir Trait Uygulamak

Güvensiz bir trait'i uygulamak için `unsafe` kullanabiliriz. Bir trait, en az bir metodunun derleyicinin doğrulayamayacağı bir invarianta sahip olduğunda güvensizdir. Bir trait'in güvensiz olduğunu, `trait` kelimesinin önüne `unsafe` anahtar kelimesini ekleyerek ve trait'in uygulamasını da güvensiz olarak işaretleyerek bildiriyoruz; bu Liste 20-11'de gösterilmektedir.



```rust
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-11/src/main.rs}}
```



`unsafe impl` kullandığımızda, derleyicinin doğrulamadığı invariantalara uyacağımıza dair söz veriyoruz.

Bir örnek olarak, 16. Bölümde tartıştığımız [“`Sync` ve `Send` Traitleri ile Gelişmiş Eşzamanlılık”][extensible-concurrency-with-the-sync-and-send-traits] bölümındaki `Sync` ve `Send` işaretçi traitlerini hatırlayın: Derleyici, türlerimiz tamamen `Send` ve `Sync` türlerinden oluşuyorsa bu traitleri otomatik olarak uygular. Eğer `Send` veya `Sync` olmayan bir türü içeren bir tür uygularsak veya o türü `Send` veya `Sync` olarak işaretlemek istiyorsak, `unsafe` kullanmamız gerekir. 

:::warning
Rust, türümüzün iş parçacıkları arasında güvenli bir şekilde gönderilebileceği veya birden fazla iş parçacığından erişilebileceği garantisini doğrulayamaz; bu nedenle, bu kontrolleri manuel olarak yapmamız ve bunu `unsafe` ile belirtmemiz gerekir.
:::

### Bir Union’un Alanlarına Erişim

Yalnızca `unsafe` ile çalışan son işlem, bir *union*'un alanlarına erişmektir. Bir `union`, bir `struct`a benzer, ancak yalnızca bir tane belirtilen alan bir anda kullanılır. Unionlar esasen C kodundaki unionlarla arayüz sağlamak için kullanılır. Union alanlarına erişim güvensizdir çünkü Rust, union örneğinde şu anda depolanan verinin türünü garanti edemez. Unionlar hakkında daha fazla bilgiyi [Rust Referansı][reference] sayfasında öğrenebilirsiniz.

### Güvensiz Kod Kontrolü için Miri Kullanmak

Güvensiz kod yazarken, yazdığınız şeyin gerçekten güvenli ve doğru olduğunu kontrol etmek isteyebilirsiniz. Bunun için en iyi yöntemlerden biri, tanımsız davranışları tespit etmek için resmi bir Rust aracı olan [Miri][miri] kullanmaktır. 

:::note
Borç kontrolörü, derleme zamanında çalışan bir *statik* araçtır; Miri ise çalışma zamanında çalışan bir *dinamik* araçtır.
:::

Kodunuzu çalıştırarak veya test paketini çalıştırarak, Rust'un nasıl çalışması gerektiği hakkında anladığı kuralları ihlal ettiğinizde bunu tespit eder.

Miri kullanmak, Rust'ın gece yapılandırmasını gerektirir (bunu [Ek G: Rust Nasıl Yapılır ve “Gece Rust”][nightly] bölümünde daha fazla anlatıyoruz). Hem Rust’ın gece sürümünü hem de Miri aracını kurmak için `rustup +nightly component add miri` yazabilirsiniz. Bu, projenizin hangi Rust sürümünü kullandığını değiştirmez; yalnızca aracı sisteminize ekler, böylece istediğinizde kullanabilirsiniz. Miri'yi bir projede çalıştırmak için `cargo +nightly miri run` veya `cargo +nightly miri test` yazabilirsiniz.

Bu işlemin ne kadar yararlı olabileceğine bir örnek olarak, onu Liste 20-10 üzerinde çalıştırdığımızda olanları düşünün:

```console
{{#include ../listings/ch20-advanced-features/listing-20-10/output.txt}}
```

Yardımcı bir şekilde, değiştirilebilir verilere paylaşılan referanslarımız olduğunu doğru bir şekilde fark eder ve bu konuda uyarır. Bu durumda, sorununu nasıl çözeceğimiz konusunda bilgi vermez ancak bir olası sorun olduğuna dair bir bilgiye sahip olmamız ve güvenli olmasını sağlamak için düşünmemizi sağlar. Diğer durumlarda, bazı kodların *kesinlikle* yanlış olduğunu ve bunu düzeltmek için önerilerde bulunabilir.

Miri, güvensiz kod yazarken hata yapabileceğiniz *herşeyi* yakalamaz. Bunun bir sebebi, dinamik bir kontrol olduğu için yalnızca gerçekten çalıştırılan kodlardaki problemleri yakalar. Yani, yazdığınız güvensiz kod hakkında güveninizi artırmak için bunu iyi test teknikleri ile birlikte kullanmanız gerekecek. Ayrıca, kodunuzun hatalı olabileceği her şekilde kapsamaz. Miri bir sorun tespit ettiğinde bir hata olduğunu bilirsiniz, ancak Miri bir hata tespit etmediğinde bir sorun olmadığı anlamına gelmez. Ancak Miri çok şeyi yakalayabilir. Bu bölümdeki diğer güvensiz kod örneklerine uygulamayı deneyin ve ne dediğine bakın!

### Ne Zaman Güvensiz Kod Kullanmalısınız

Tartıştığımız beş eylemden birini (süper güçleri) gerçekleştirirken `unsafe` kullanmak yanlış değildir veya bir şekilde kötü bir şey değildir. Ancak, `unsafe` kodunun doğru bir şekilde elde edilmesi daha zordur çünkü derleyici bellek güvenliğini korumaya yardımcı olamaz. 

:::tip
`unsafe` kodu kullanmanın bir nedeni olduğunda, bunu yapabilirsiniz ve açık `unsafe` notasyonu, sorunlar meydana geldiğinde problemin kaynağını bulmayı kolaylaştırır. 
:::

Ne zaman güvensiz kod yazsanız, Miri'yi kullanarak yazdığınız kodun Rust'ın kurallarını koruduğundan daha fazla emin olmanıza yardımcı olabilirsiniz.

[dangling-references]:
ch04-02-references-and-borrowing.html#dangling-references
[differences-between-variables-and-constants]:
ch03-01-variables-and-mutability.html#constants
[extensible-concurrency-with-the-sync-and-send-traits]:
ch16-04-extensible-concurrency-sync-and-send.html#extensible-concurrency-with-the-sync-and-send-traits
[the-slice-type]: ch04-03-slices.html#the-slice-type
[reference]: ../reference/items/unions.html
[miri]: https://github.com/rust-lang/miri
[nightly]: appendix-07-nightly-rust.html