## Gelecekler ve Async Söz Dizimi

Rust'taki asenkron programlamanın ana unsurları **gelecekler** ve Rust’ın `async` ve `await` anahtar kelimeleridir.

Bir **gelecek**, şu anda hazır olmayabilecek bir değerdir, ancak gelecekte bir noktada hazır hale gelecektir. (Bu aynı kavram birçok dilde, bazen “görev” veya “vaat” gibi başka adlarla karşımıza çıkar.) Rust, farklı asenkron işlemlerin farklı veri yapılarıyla uygulanabilmesi için bir inşa bloğu olarak `Future` trait’ini sağlar, ancak bu ortak bir arayüz ile. Rust'ta, `Future` trait'ini uygulayan türler gelecektir. `Future`'yi uygulayan her tür, ilerlemenin kaydedilmiş bilgilerini ve "hazır" olmanın ne anlama geldiğini tutar.

`async` anahtar kelimesi, kesintiye uğratılabilir ve yeniden başlatılabilir bloklar ve fonksiyonlar için uygulanabilir. Bir asenkron blok veya asenkron fonksiyon içinde, bir geleceğin hazır olmasını beklemek için `await` anahtar kelimesini kullanabilirsiniz, buna **geleceği beklemek** denir. Bir asenkron blok veya fonksiyon içinde geleceği beklediğiniz her yer, o asenkron blok veya fonksiyonun duraklayabileceği ve tekrar başlatılabileceği bir yerdir. Bir gelecekle kontrol etme sürecine **polling** denir.

:::tip
**Not:** Diğer bazı diller de asenkron programlama için `async` ve `await` anahtar kelimelerini kullanır. Eğer bu dillerle tanıdık iseniz, Rust’ın iş yapma şekli, sözdizimini nasıl ele aldığı dahil olmak üzere bazı önemli farklılıklar içerebilir.
:::

Rust’ta asenkron yazılım geliştirirken çoğu zaman `async` ve `await` anahtar kelimelerini kullanırız. Rust, bunları `Future` trait'ini kullanarak karşılık gelen koda derler; bu, `for` döngülerinin `Iterator` trait'ini kullanarak karşılık gelen koda derlenmesi gibi. Ancak Rust `Future` trait'ini sağladığından, kendi veri türleriniz için de gerektiğinde bunu uygulayabilirsiniz. Bu bölümde göreceğimiz birçok işlev, `Future`’ın kendi uygulamalarına sahip türler döndürecektir. Bölümün sonunda trait’in tanımına döneceğiz ve nasıl çalıştığına daha fazla gireceğiz, ancak bu, ilerlememiz için yeterli detaydır.

Bunların hepsi biraz soyut görünebilir. İlk asenkron programımızı yazalım: küçük bir web tarayıcısı. Komut satırından iki URL geçirip, her ikisini eş zamanlı olarak alacağız ve hangisi önce biterse onun sonucunu döndüreceğiz. Bu örnek, biraz yeni sözdizimi içerecek, ama endişelenmeyin. İhtiyacınız olan her şeyi açıklayacağız.

### İlk Asenkron Programımız

Bu bölümü, ekosistemin parçalarını jonglörlük yapmak yerine asynkron öğrenmeye odaklı tutmak için `trpl` crate’ini oluşturduk (`trpl`, “The Rust Programming Language" için kısaltmadır). İhtiyacınız olan tüm türleri, trait’leri ve işlevleri yeniden içe aktarır, esas olarak [`futures`][futures-crate] ve [`tokio`][tokio] crate’lerinden.

- `futures` crate’i, asenkron kod için Rust deneyiminin resmi bir evidir ve aslında `Future` türünün ilk tasarlandığı yerdir.
  
- Tokio, günümüzde Rust'taki en yaygın kullanılan asenkron çalışma zamanıdır, özellikle (ama sadece değil!) web uygulamaları için. Daha başka harika çalışma zamanları mevcut olup, bunlar sizin amaçlarınıza daha uygun olabilir. `trpl` için arka planda Tokio'yu kullanıyoruz çünkü iyi test edilmiştir ve geniş bir kullanıcı tabanına sahiptir.

Bazı durumlarda, `trpl` de orijinal API'leri yeniden adlandırır veya sarar, böylece bu bölüme ilgili detaylara odaklanabiliriz. Crate’in ne yaptığını anlamak istiyorsanız, [kaynak koduna][crate-source] göz atmanızı öneririz. Hangi re-enfeksiyonun hangi crate'ten geldiğini görebilir ve crate’in ne yaptığını açıklayan kapsamlı yorumlar bıraktık.

Yeni bir `hello-async` isimli ikili proje oluşturun ve `trpl` crate’ini bağımlılık olarak ekleyin:

```console
$ cargo new hello-async
$ cd hello-async
$ cargo add trpl
```

Artık `trpl` tarafından sağlanan çeşitli parçaları kullanarak ilk asenkron programımızı yazabiliriz. İki web sayfasını alan ve her birinden `` öğesini alan, hangi işlemin tamamlandığını yazdıran küçük bir komut satırı aracı inşa edeceğiz.

Bir sayfa URL'sini parametre olarak alan, ona bir istek yapan ve başlık öğesinin metnini döndüren bir işlev yazarak başlayalım:



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-01/src/main.rs:all}}
```



Listing 17-1'de, `page_title` isimli bir fonksiyon tanımlıyoruz ve onu `async` anahtar kelimesi ile işaretliyoruz. Daha sonra, geçtiğimiz URL'nin içeriğini almak için `trpl::get` fonksiyonunu kullanıyor ve yanıtı almak için `await` anahtar kelimesini kullanarak bekliyoruz. Yanıtın metnini, `text` metodunu çağırarak alıyoruz ve bir kez daha `await` anahtar kelimesi ile bekliyoruz. Bu iki adım da asenkron. `get` için, sunucunun yanıtının ilk kısmını geri göndermesini beklememiz gerekiyor, bu durum HTTP başlıklarını, çerezleri ve daha fazlasını içerecektir. Yanıtın bu kısmı, isteğin gövdesinden ayrı olarak teslim edilebilir. Özellikle gövde çok büyükse, tüm verilerin gelmesi biraz zaman alabilir. Bu nedenle, yanıtın *tamamen* gelmesini beklemek zorundayız; bu yüzden `text` metodu da asenkron.

:::info
Bu gelecekleri beklemek için her iki geleceği açıkça beklememiz gerekiyor, çünkü Rust’taki gelecekleşmeler *tembel*dir: `await` ile onlardan bir şey yapmalarını istemedikçe hiçbir şey yapmazlar. (Aslında, bir geleceği kullanmadığınızda Rust bir derleyici uyarısı gösterir.) Bu, 13. Bölümde yaptığımız iteratorlerdeki tartışmamızı hatırlatmalıdır [lazy konusunda][iterators-lazy]. 
:::

Iteratorler `next` metodunu çağırmadığınız sürece hiçbir şey yapmazlar; ister doğrudan, ister `for` döngüleri veya `map` gibi `next` kullanan metodlar kullanarak. Geleceklerde de aynı temel fikir geçerlidir: onları açıkça istemedikçe hiçbir şey yapmazlar. Bu tembellik, Rust'a asenkron kodu gerçekten ihtiyaç duyulana kadar çalıştırmama sağlar.

> **Not:** Bu durum, önceki bölümlerde kullandığımız `thread::spawn` ile gördüğümüz davranıştan farklıdır; burada, başka bir iş parçacığına geçirdiğimiz kapanış hemen çalışmaya başlıyordu. Ayrıca, birçok diğer dilin asynkron yöntemlerine de farklıdır! Ancak bu Rust için önemlidir. Bunu daha sonra göreceğiz.

`response_text`'e sahip olduğumuzda, artık bunu `Html` türüne ait bir örneğe dönüştürmek için `Html::parse` ile ayrıştırabiliriz. Artık ham bir dize yerine, HTML ile çalışabileceğimiz daha zengin bir veri yapısına sahibiz. Özellikle, `select_first` metodunu kullanarak belirli bir CSS seçicisinin ilk örneğini bulabiliriz. `"title"` dizesini geçirerek, belgede varsa ilk `` öğesini elde ederiz. Çünkü eşleşen öğe olmayabilir, `select_first` bir `Option` döndürür. Son olarak, `Option::map` metodunu kullanıyoruz; bu, `Option` içinde mevcutsa öğe ile çalışmamıza ve mevcut değilse hiçbir şey yapmamıza olanak tanır. (Burada bir `match` ifadesi de kullanabiliriz, ama `map` daha yaygın bir kullanımdır.) `map` metoduna sağladığımız fonksiyonun gövdesinde, içeriğini almak için `title_element` üzerinde `inner_html` çağrısını yapıyoruz; bu, bir `String`. Nihayetinde, bir `Option` elde ediyoruz.

Rust'ın `await` anahtar kelimesinin, beklediğiniz ifadenin ardından geldiğini, önce değil. Yani, bu bir *postfix anahtar kelimesidir*. Bu, başka dillerde asenkron kullandıysanız alıştığınızdan farklı olabilir. Rust bunu, metot zincirlerini daha hoş bir şekilde çalışır hale getirdiği için seçmiştir. Sonuç olarak, `page_url_for` fonksiyonunun gövdesini, aralarına `await` ile `trpl::get` ve `text` fonksiyon çağrılarını zincirleyerek değiştirebiliriz; bu Listing 17-2'de gösterilmiştir:



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-02/src/main.rs:chaining}}
```



Böylece ilk asenkron fonksiyonumuzu başarıyla yazmış olduk! Şimdi, çağrıda bulunmak için `main` içinde birkaç kod eklemeyi konuşalım; yazdığımızı biraz daha ele alalım ve ne anlama geldiğini anlamaya çalışalım.

Rust, `async` anahtar kelimesi ile işaretlenmiş bir blok gördüğünde, onu `Future` trait'ini uygulayan benzersiz, anonim bir veri türüne derler. Rust, `async` ile işaretlenmiş bir fonksiyon gördüğünde, bunun gövdesini bir asenkron blok olan eş zamanlı bir hale derler. Bir asenkron fonksiyonun dönüş tipi, derleyicinin o asenkron blok için oluşturduğu anonim veri türünün tipidir.

Böylece `async fn` yazmak, dönüş tipinin bir **gelecek** döndüren bir fonksiyon yazmak ile eşdeğerdir. Derleyici, Listing 17-1'deki `async fn page_title` gibi bir fonksiyon tanımını gördüğünde, bunun bir eşzamanlı fonksiyon anlamına geldiğini kabul eder:

```rust
# extern crate trpl; // mdbook test için gereklidir
use std::future::Future;
use trpl::Html;

fn page_title(url: &str) -> impl Future<Output = Option<String>> + '_ {
    async move {
        let text = trpl::get(url).await.text().await;
        Html::parse(&text)
            .select_first("title")
            .map(|title| title.inner_html())
    }
}
```

Dönüştürülmüş sürümün her bir parçasını inceleyelim:

* Bu, 10. Bölümdeki [“Traits as Parameters”][impl-trait] bölümünde tartıştığımız `impl Trait` sözdizimini kullanıyor.
* Döndürülen trait, `Output` ile ilişkili bir tür olan bir `Future`dir. `Output` türü, `async fn` sürümündeki `page_title`'ın orijinal dönüş tipi olan `Option` ile aynıdır.
* Orijinal fonksiyonun gövdesinde çağrılan tüm kod bir `async move` bloğuna sarılmıştır. Unutmayın ki bloklar ifadelerdir. Bu tüm blok, fonksiyondan dönen ifadedir.
* Bu asenkron blok, yukarıda açıklanan `Option` türünde bir değer üretir. Bu durum, dönüş tipinde belirtilen `Output` türü ile eşleşir. Bu, gördüğünüz diğer bloklar gibi bir durumdur.
* Fonksiyonun yeni gövdesi, `url` parametresini nasıl kullandığı açısından `async move` bloğudur. (Bu bölümde `async` ile `async move` arasındaki farkı daha fazla tartışacağız.)
* Fonksiyonun yeni sürümü, dönüş türünde daha önce görmediğimiz bir ömür türüne sahiptir: `'_`. Çünkü fonksiyon, bir referansa atıfta bulunan bir `Future` döner; bu durumda, `url` parametresinin referansı. Rust'a o referansın dahil edilmesini istediğimizi belirtmemiz gerekiyor. Burada ömrü adlandırmamıza gerek yok; çünkü Rust, dahil olabilecek tek bir referans olduğunu bildiği için bu yeterli. Ancak sonuçta elde edilen `Future`'nın o ömre bağlı olduğunu açıkça belirtmemiz gerekiyor.

Artık `main` içinde `page_title`'ı çağırabiliriz. Öncelikle, yalnızca tek bir sayfanın başlığını alacağız. Listing 17-3'te, 12. Bölümde komut satırı argümanlarını almak için kullandığımız aynı kalıbı izliyoruz. Ardından, ilk URL’yi `page_title`'a geçiriyoruz ve sonucu bekliyoruz. Gelecekten üretilen değer bir `Option` olduğundan, sayfanın bir ``'ı olup olmadığına bağlı olarak farklı mesajlar yazdırmak için bir `match` ifadesi kullanıyoruz.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch17-async-await/listing-17-03/src/main.rs:main}}
```



Ne yazık ki, bu derlenmiyor. `await` anahtar kelimesini sadece asenkron fonksiyonlarda veya bloklarda kullanabiliriz ve Rust, özel `main` fonksiyonunu `async` olarak işaretlememize izin vermez.

```text
error[E0752]: `main` function is not allowed to be `async`
 --> src/main.rs:6:1
  |
6 | async fn main() {
  | ^^^^^^^^^^^^^^^ `main` function is not allowed to be `async`
```

`main` fonksiyonunun `async` işaretlenememesinin nedeni, asenkron kodun bir *çalışma zamanı* gerektirmesidir: asenkron kodu çalıştırmanın detaylarını yöneten bir Rust crate’i. Bir programın `main` fonksiyonu *bir çalışma zamanını başlatabilir*, ancak kendisi bir çalışma zamanı *değildir*. (Bunu biraz daha sonra daha fazla göreceğiz.) Her Rust programı, asenkron kod çalıştırıyorsa, büyüktür bir yerde bir çalışma zamanını kurup gelecekliklerini çalıştırır.

Asenkron destekleyen çoğu dil, bir çalışma zamanını dil ile birleştirir. Rust bunu yapmaz. Bunun yerine, her biri hedefledikleri kullanım durumu için farklı trade-off’lar sağlayan birçok farklı asenkron çalışma zamanı mevcuttur. Örneğin, birçok CPU çekirdeği ve büyük miktarda RAM’i olan yüksek verimli bir web sunucusunun ihtiyaçları, tek çekirdekli, az RAM’e sahip, yığın derecelendirme yapma yeteneği olmayan bir mikrodenetleyicinin ihtiyaçlarından çok farklıdır. Bu çalışma zamanı sağlayan crate’ler genellikle dosya veya ağ I/O gibi yaygın işlevlerin asenkron sürümlerini de sağlar.

Bu bölümde ve bu bölüm boyunca, bir geleceği argüman olarak alan ve onu tamamlanmaya çalıştıran `trpl` crate’indeki `run` fonksiyonunu kullanacağız. Arkada, `run`'ı çağırdığımızda, geçirilen geleceği çalıştırmak için bir çalışma zamanı ayarlanır. Gelecek tamamlandığında, `run` geleceğin ürettiği değeri döndürür.

`page_title` tarafından döndürülen geleceği doğrudan `run`'a geçirebiliriz. Tamamlandığında, Listing 17-3'te denediğimiz gibi, dönüş türü olan `Option` üzerinde eşleşmek edebiliriz. Ancak, bölümdeki örneklerin çoğu (ve gerçek dünyadaki çoğu asenkron kod!), yalnızca bir asenkron fonksiyon çağrısından daha fazlasını yapacağız, bu nedenle, bunun yerine bir `async` bloğu geçirip, `page_title` çağrısının sonucunu açıkça bekleyeceğiz; bu Listing 17-4'te gösterilmektedir.



```rust,should_panic,noplayground
{{#rustdoc_include ../listings/ch17-async-await/listing-17-04/src/main.rs:run}}
```



Bunu çalıştırdığımızda, başlangıçta beklediğimiz davranışı elde ederiz:

```console
$ cargo run -- https://www.rust-lang.org
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/async_await 'https://www.rust-lang.org'`
The title for https://www.rust-lang.org was
            Rust Programming Language
```

Uff: şimdi bazı çalışan asenkron kodlarımız var! Bu artık derleniyor ve çalıştırabiliyoruz. İki siteyi karşılaştıracak kod eklemeden önce, gelecekle ilgili nasıl çalıştığını biraz daha ön planda tutalım.

Her bir **await noktası**—yani, kodun `await` anahtar kelimesini kullandığı her yer—kontrolün çalışma zamanına geri döndüğü bir yeri temsil eder. Bunu çalıştırabilmek için, Rust’ın asenkron bloktaki durumu takip etmesi gerekir; böylece çalışma zamanı, başka bir işe başlayabilir ve sonra bu işlemi tekrar denemek için geri gelebilir. Bu, her `await` noktasındaki mevcut durumu kaydetmek için yazılmış bir enum gibi görünmez bir durum makinesidir:

```rust
{{#rustdoc_include ../listings/ch17-async-await/no-listing-state-machine/src/lib.rs:enum}}
```

Her durumu elle geçiş yapmak için kod yazmak zahmetli ve hata yapmaya açık olurdu, özellikle de daha fazla işlev ve daha fazla durum eklemeye kalktığınızda. Bunun yerine, Rust derleyicisi asenkron kod için gerekli durumsal makine veri yapılarını otomatik olarak oluşturur ve yönetir. Merak ediyorsanız: evet, veri yapıları etrafındaki normal borç alma ve mülkiyet kuralları da geçerlidir. Neyse ki, derleyici bunu kontrol etmektedir ve iyi hata mesajları vardır. Bunun birkaçını bu bölümde gözden geçireceğiz!

Nihayetinde, bu durum makinesini çalıştıracak bir şey olmalıdır. O şey bir çalışma zamanıdır. (Bu nedenle, çalışma zamanları ile ilgili araştırmalar yaparken bazen *yürütücüler* ile ilgili referanslar bulmanızın nedeni budur: bir yürütücü, asenkron kodu çalıştırmakla sorumlu olan kısmıdır.)

Artık neden derleyicinin Listing 17-3'te `main` işlevini asenkron bir fonksiyon yapmamıza izin vermediğini anlayabiliyoruz. Eğer `main` bir asenkron fonksiyon olsaydı, `main` tarafından döndürülen herhangi bir geleceğin durum makinesini yönetmek için bir şey olması gerekirdi; ama `main` programın başlangıç noktasıdır! Bunun yerine, `main` içinde `trpl::run` fonksiyonunu çağırmakta ve bir `async` bloğunun döndürdüğü geleceği çalıştırarak sonuç dönene kadar çalıştırmaktayız.

> **Not:** bazı çalışma zamanları, bir asenkron main fonksiyonu yazmanıza izin vermek için makrolar sağlar. Bu makrolar `async fn main() { ... }` ifadesini, Listing 17-5'te yaptığımız gibi, bir geleceği tamamlanmasına kadar çalıştıracak normal bir `fn main` haline dönüştürür.

Şimdi bu parçaları bir araya getirip, kullanıcıdan iki farklı URL geçerek onları yarışa sokarak eşzamanlı kod yazmamızı nasıl yapacağımıza bakalım.



```rust,should_panic,noplayground
{{#rustdoc_include ../listings/ch17-async-await/listing-17-05/src/main.rs:all}}
```



Listing 17-5'te, kullanıcıdan sağlanan her URL için `page_title` çağırarak başlıyoruz. `page_title` çağrısı ile üretilen geleceği `title_fut_1` ve `title_fut_2` olarak saklıyoruz. Unutmayın, bunlar henüz hiçbir şey yapmaz, çünkü gelecekleşmeler tembellik yapar ve henüz beklemediğimiz için hiçbir işlev görmezler. Ardından, geleceği hangi işlemin önce tamamlandığını belirtmek için `trpl::race` fonksiyonuna geçiriyoruz.

:::warning
**Not:** `race` altında yatan, daha genel bir `select` fonksiyonu vardır; bu fonksiyonu gerçek hayattaki Rust kodlarında daha sık karşılaşabilirsiniz. Bir `select` fonksiyonu, `trpl::race` fonksiyonunun yapamayacağı çok sayıda işlem gerçekleştirebilir, ancak ayrıca kaçırılabilecek bazı karmaşıklıklar da vardır.
:::

Hangi geleceğin "kazanacağı" meşru olduğundan, bir `Result` döndürmek mantıklı değildir. Bunun yerine, `race` daha önce görmediğimiz bir tür olan `trpl::Either` döndürür. `Either` türü, iki durumu olan bir `Result`'a benzer; ancak `Result`'tan farklı olarak, `Either` içinde başarılı ya da başarısız olma kavramı yoktur. Bunun yerine, "bir ya da diğeri"yi belirtmek için `Left` ve `Right` kullanır.

```rust
enum Either<A, B> {
    Left(A),
    Right(B),
}
```

`race` fonksiyonu, ilk argüman ilk tamamsa `Left` döndürür ve o geleceğin çıktısını içerirken, `Right` ise ikinci geleceğin çıktısını içerir, bu da *o* tamamlandığında olur. Bu, işlevi çağırırken argümanların sırasını yansıtır: ilk argüman, ikinci argümanın solundadır.

`page_title`'ın da, geçen URL’yi döndürecek şekilde güncelledi. Böylece, ilk dönen sayfanın bir `` alma yeteneği yoksa, yine de anlamlı bir mesaj yazdırabiliriz. Bu bilgi ile, tamamlamak için çıktı `println!`'ımızı, hangi URL’nin önce bitirdiğini ve o URL'deki sayfanın ``'ının olup olmadığını belirtecek şekilde güncelleyebiliriz.

Artık küçük bir çalışan web tarayıcısı oluşturmuş oldunuz! Birkaç URL seçin ve komut satırı aracını çalıştırın. Bazı sitelerin bazılarından daha hızlı olduğunu keşfedebilirsiniz; bunun yanı sıra, hangi sitenin "kazanacağını" çalıştırmadan çalıştırmaya göre değişebilir. Daha önemlisi, artık gelecekle çalışma temellerini öğrendiğinizden, asenkron ile yapabileceğiniz daha fazla işlemi gözden geçirebiliriz.

[impl-trait]: ch10-02-traits.html#traits-as-parameters
[iterators-lazy]: ch13-02-iterators.html

[crate-source]: https://github.com/rust-lang/book/tree/main/packages/trpl
[futures-crate]: https://crates.io/crates/futures
[tokio]: https://tokio.rs