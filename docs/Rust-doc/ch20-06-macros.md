## Makrolar

Bu kitapta `println!` gibi makroları kullandık, ancak bir makronun ne olduğunu ve nasıl çalıştığını tam anlamıyla keşfetmedik. *Makro* terimi, Rust'taki bir dizi özelliği ifade eder: *declarative* makrolar `macro_rules!` ile ve üç tür *procedural* makrolar:

- `derive` niteliğiyle birleştirildiğinde eklenen kodu belirten özel `#[derive]` makroları
- Herhangi bir öğede kullanılabilen özel nitelikler tanımlayan nitelik benzeri makrolar
- Fonksiyon çağrılarına benzeyen, ancak argüman olarak belirtilen tokenlar üzerinde işlem yapan fonksiyon benzeri makrolar

Her birini sırayla ele alacağız, ancak önce, fonksiyonlarımız varken neden makrolara ihtiyaç duyduklarına bir bakalım.

### Makrolar ile Fonksiyonlar Arasındaki Fark

Temel olarak, makrolar başka kod yazan bir kod yazma yoludur; bu duruma *metaprogramlama* denir. Ek B'de, size çeşitli özellikler için bir uygulama oluşturan `derive` niteliğinden bahsediyoruz. Ayrıca, bu kitapta `println!` ve `vec!` makrolarını kullandık. Bu makroların tümü, yazdığınız koddan daha fazla kod üretmek için *genleşir*.

:::note
Metaprogramlama, yazmanız ve bakımını yapmanız gereken kod miktarını azaltmak için yararlıdır; bu aynı zamanda fonksiyonların rollerinden biridir.
:::

Bununla birlikte, makroların fonksiyonların sahip olmadığı bazı ek yetenekleri vardır.

- Bir fonksiyon imzası, fonksiyonun sahip olduğu parametrelerin sayısını ve türünü belirtmelidir.
- Öte yandan, makrolar değişken sayıda parametre alabilir: `println!("merhaba")` çağrısını tek bir argümanla veya `println!("merhaba {}", name)` çağrısını iki argümanla yapabiliriz. 
- Ayrıca, makrolar derleyici kodun anlamını yorumlamadan önce genişletilir, böylece bir makro, örneğin, belirli bir türde bir özelliği uygulayabilir. 

:::tip
Bir fonksiyon, çalışma zamanında çağrılabilir ve bir özelliğin derleme zamanında uygulanması gerekir.
:::

Bir makroyu uygulamanın, bir fonksiyonu uygulamaktan dezavantajı, makro tanımlarının fonksiyon tanımlarından daha karmaşık olmasıdır çünkü Rust kodu yazıyorsunuz ve bu kod başka Rust kodu yazıyor. Bu dolaylılık nedeniyle, makro tanımları genellikle fonksiyon tanımlarından daha zor okunur, anlaşılır ve bakım yapılır.

Makrolar ile fonksiyonlar arasındaki bir diğer önemli fark, bir dosyada bir makroyu çağırmadan önce makroları tanımlamanız veya kapsamınıza getirmeniz gerektiğidir; oysa fonksiyonları istediğiniz yere tanımlayıp çağırabilirsiniz.

### Genel Metaprogramlama için `macro_rules!` ile Deklaratif Makrolar

Rust'taki en yaygın kullanılan makro biçimi *deklaratif makro*dur. Bunlar ayrıca “örnekle makrolar”, “`macro_rules!` makroları” veya kısaca “makrolar” olarak da adlandırılır. Temelinde, deklaratif makrolar, Rust `match` ifadesine benzer bir şey yazmanıza olanak tanır.

:::info
Bölüm 6'da ele alındığı gibi, `match` ifadeleri, bir ifadeyi alan, ifadenin oluşan değerini kalıplarla karşılaştıran ve ardından eşleşen kalıpla ilişkili kodu çalıştıran kontrol yapılarıdır.
:::

Makrolar ayrıca, belirli bir kodla ilişkilendirilmiş kalıplara bir değeri karşılaştırır: bu durumda değer, makroya geçirilen gerçek Rust kaynak kodudur; kalıplar, bu kaynak kodunun yapısıyla karşılaştırılır; ve eşleşen her kalıpla ilişkili kod, makroya iletilen kodun yerini alır. Tüm bunlar derleme sırasında gerçekleşir.

Bir makro tanımlamak için `macro_rules!` yapısını kullanırsınız. `macro_rules!` kullanmanın nasıl olduğunu anlamak için `vec!` makrosunun nasıl tanımlandığına bakalım. Bölüm 8, `vec!` makrosunu belirli değerlerle yeni bir vektör oluşturmak için kullanmamızın yolunu ele alıyordu. 

> **Not:** `vec!` makrosunun standart kütüphanedeki gerçek tanımı, önceden doğru miktarda bellek ayırmak için kod içerir. Örnek basıtlaşsın diye bu kodu burada dahil etmiyoruz.  
> — Docusaurus Markdown Feature Team

```rust
let v: Vec<u32> = vec![1, 2, 3];
```

İki tam sayılık bir vektör ya da beş dize dilimi içeren bir vektör oluşturmak için de `vec!` makrosunu kullanabiliriz. Aynı şeyi bir fonksiyonla yapamazdık çünkü önceden değerlerin sayısını veya türünü bilemezdik.

### 
Liste 20-28: `vec!` makrosunun basitleştirilmiş bir tanımını gösterir.

```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-28/src/lib.rs}}
```



`#[macro_export]` notasyonu, bu makronun, tanımlandığı crate kapsamına getirildiğinde erişilebilir olması gerektiğini belirtir. Bu notasyon olmadan, makro kapsamınıza getirilemez.

:::warning
Ardından, makro tanımına `macro_rules!` ile başlıyoruz ve tanımladığımız makronun ismini *ünlem işareti olmadan* yazıyoruz. 
:::

Bu durumda isim `vec` olup, makro tanımının gövdesini belirten küme parantezleriyle takip edilir.

`vec!` gövdesindeki yapı, bir `match` ifadesinin yapısına benzerdir. Burada, `( $( $x:expr ),* )` kalıbına sahip bir kol var, ardından `=>` ve bu kalıpla ilişkili kod bloğu geliyor. Eğer kalıp eşleşirse, ilişkili kod bloğu yayımlanır. Bu makrodaki tek kalıp olduğuna göre, eşleşebilecek sadece bir geçerli yol vardır; başka bir kalıp hata verecektir. Daha karmaşık makroların birden fazla kolu olabilir.

Makro tanımlarındaki geçerli kalıp sözdizimi, Bölüm 19'da ele alınan kalıp sözdiziminden farklıdır çünkü makro kalıpları, değerler yerine Rust kodu yapısına karşı karşılaştırılır. Liste 20-28'deki kalıp parçalarının ne anlama geldiğini inceleyelim; tam makro kalıp sözdizimi için [Rust Referansı][ref]’na bakın.

Öncelikle, tüm kalıbı kapsamak için bir set parantez kullanıyoruz. Bir makro sisteminde kalıbı karşılayan Rust kodunu içerecek bir değişkeni tanımlamak için bir dolar işareti (`$`) kullanıyoruz. Dolar işareti, bunun, normal bir Rust değişkeni yerine bir makro değişkeni olduğunu açıkça belirtir. Ardından, yer değiştirme kodunda kullanılmak üzere parantezler içindeki kalıplara karşılık gelen değerleri yakalayan bir parantez seti gelir. `$()` içindeki `$x:expr`, herhangi bir Rust ifadesini karşılar ve bu ifadeye `$x` adını verir.

`$()`'dan sonraki virgül, `$()`'daki kodla eşleşen koddan sonra bir harf ayrım karakterinin isteğe bağlı olarak görünebileceğini gösterir. `*` simgesi, kalıbın önündeki nesnenin sıfır veya daha fazlasını karşılayabileceğini belirtir.

Bu makroyu `vec![1, 2, 3];` ile çağırdığımızda, `$x` kalıbı `1`, `2` ve `3` ifadeleriyle üç kez eşleşir.

Şimdi, bu kol ile ilişkili kodun içindeki kalıba bakalım: `$()*` içindeki `temp_vec.push()`; bu, kalıbın kaç kez eşleştiğine göre, `$()`'daki kalıpla eşleşen her parçanın üretilmesi için sıfır veya daha çok kez üretir. `$x`, eşleşen her ifadeyle değiştirilir. Bu makroyu `vec![1, 2, 3];` ile çağırdığımızda, bu makro çağrısının yerini alacak oluşturulan kod aşağıdaki gibidir:

```rust,ignore
{
    let mut temp_vec = Vec::new();
    temp_vec.push(1);
    temp_vec.push(2);
    temp_vec.push(3);
    temp_vec
}
```

Herhangi bir sayıda argümanı ve her türdeki argümanı alabilen ve belirtilen öğeleri içeren bir vektör oluşturmak için kod üretebilecek bir makro tanımladık.

:::tip
Makro yazma hakkında daha fazla bilgi edinmek için çevrimiçi belgelere veya Daniel Keep tarafından başlatılan ve Lukas Wirth tarafından devam eden [“Rust Makrolarının Küçük Kitabı”][tlborm] gibi diğer kaynaklara başvurun.
:::

### Niteliklerden Kod Üretmek için Procedural Makrolar

İkinci makro biçimi *procedural makro*dur; bu, bir fonksiyona daha çok benzer (ve bir tür prosedürdür). Procedural makrolar, bir kodu girdi olarak alır, o kod üzerinde işlem yapar ve çıktı olarak bazı kodlar üretir; bu, kalıplara karşı eşleşip kodu başka bir kodla değiştiren deklartif makrolarından farklıdır. Üç tür procedural makro vardır: özel türetme, nitelik benzeri ve fonksiyon benzeri; hepsi benzer bir şekilde çalışır.

Procedural makro oluştururken, tanımlarının kendi crate'lerinde ve özel bir crate türü ile yer alması gerekir. Bu, gelecekte ortadan kaldırmayı umduğumuz karmaşık teknik nedenlerden kaynaklanmaktadır. Liste 20-29'da, `some_attribute` belirli bir makro türü kullanmak için bir yer tutucudur; bir procedural makro nasıl tanımlanır gösterilmektedir.

### 
Liste 20-29: Bir procedural makro tanımlama örneği

```rust,ignore
use proc_macro;

#[some_attribute]
pub fn some_name(input: TokenStream) -> TokenStream {
}
```



Procedural makroyu tanımlayan fonksiyon, bir `TokenStream` alır ve bir `TokenStream` üretir. `TokenStream` türü, Rust ile birlikte gelen ve bir dizi token'ı temsil eden `proc_macro` crate'i tarafından tanımlanır. Bu, makronun özü: makronun üzerinde işlem yaptığı kaynak kodu, giriş `TokenStream`'ını oluşturur ve makronun ürettiği kod, çıkış `TokenStream`'ını oluşturur. Fonksiyona, hangi tür procedural makro oluşturduğumuzu belirten bir nitelik de eklenmiştir. Aynı crate'de birden fazla türde procedural makroya sahip olabiliriz.

Şimdi, farklı türdeki procedural makrolara bakalım. Özel türetme makrosuyla başlayalım ve ardından diğer türlerin farklı olmasını sağlayan küçük farklılıkları açıklayalım.

### Özel `derive` Makrosu Nasıl Yazılır

`hello_macro` adında bir crate oluşturalım; bu crate bir `HelloMacro` trait'i tanımlar ve bununla ilişkili bir `hello_macro` fonksiyonu içerir. Kullanıcılarımızın her bir türü için `HelloMacro` trait'ini uygulamalarını istemek yerine, bir prosedürel makro sağlayacağız. Böylece kullanıcılar türlerini `#[derive(HelloMacro)]` ile not edebilir ve `hello_macro` fonksiyonunun varsayılan uygulamasını alabilirler. Varsayılan uygulama, **`Hello, Macro! Benim adım TypeName!`** yazdıracaktır; burada `TypeName`, bu trait'in tanımlandığı türün adıdır. Diğer bir deyişle, başka bir programcının bu crate'i kullanarak 20-30. Listede olduğu gibi kod yazmasını sağlayan bir crate yazacağız.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-30/src/main.rs}}
```



Bu kod tamamlandığında `Hello, Macro! Benim adım Pancakes!` yazacaktır. İlk adım, yeni bir kütüphane crate'i oluşturmaktır, şöyle:

```console
$ cargo new hello_macro --lib
```

Sonra, `HelloMacro` trait'ini ve onunla ilişkili fonksiyonu tanımlayacağız:



```rust,noplayground
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-20-impl-hellomacro-for-pancakes/hello_macro/src/lib.rs}}
```



Bir trait ve onun fonksiyonuna sahibiz. Bu noktada, crate kullanıcımız gerekli işlevselliği elde etmek için trait'i uygulayabilir:

```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/no-listing-20-impl-hellomacro-for-pancakes/pancakes/src/main.rs}}
```

:::warning
Ancak, `hello_macro` ile kullanmak istedikleri her tür için uygulama bloğu yazmak zorunda kalacaklardı; bu çalışmayı onlardan esirgeyebilmek istiyoruz.
:::

Ayrıca, trait'in uygulandığı türün adını yazdıracak varsayılan bir `hello_macro` fonksiyonu sağlayamayız: Rust, çalışma zamanında tür adını aramak için yansıma yeteneklerine sahip değildir. Derleme zamanında kod üretecek bir makroya ihtiyacımız var.

Bir sonraki adım, prosedürel makroyu tanımlamaktır. Bu yazının yazıldığı zamanlarda, prosedürel makroların kendi crate'lerinde bulunması gerekmektedir. Sonunda, bu kısıtlama kaldırılabilir. Crate'leri ve makro crate'lerini yapılandırma konvansiyonu şu şekildedir: `foo` adında bir crate için, özel bir derive prosedürel makro crate'i `foo_derive` olarak adlandırılır. `hello_macro` projemiz içinde `hello_macro_derive` adında yeni bir crate başlatalım:

```console
$ cargo new hello_macro_derive --lib
```

:::info
İki crate'imiz sıkı bir şekilde ilişkilidir, bu yüzden prosedürel makro crate'ini `hello_macro` crate'imizin dizininde oluşturuyoruz.
:::

Eğer `hello_macro`'daki trait tanımını değiştirirsek, `hello_macro_derive`'deki prosedürel makronun uygulamasını da değiştirmemiz gerekecek. İki crate ayrı olarak yayımlanmalıdır ve bu crate'leri kullanan programcılar ayrıca her ikisini de bağımlılık olarak eklemeli ve her ikisini de kapsam içine almalıdır. Alternatif olarak, `hello_macro` crate'i `hello_macro_derive`'yi bir bağımlılık olarak kullanıp prosedürel makro kodunu yeniden dışa aktarabilir. Ancak projemizi yapılandırma şeklimiz, programcıların `derive` işlevselliğini istemeseler bile `hello_macro`'yu kullanmalarına olanak tanır.

:::tip
`hello_macro_derive` crate'ini bir prosedürel makro crate olarak ilan etmemiz gerekiyor.
:::

Ayrıca, `syn` ve `quote` crate'lerinden de işlevsellik alacağız, bunu birazdan göreceksiniz; bu yüzden bunları bağımlılıklar olarak eklememiz gerekiyor. Aşağıdakileri `hello_macro_derive` için *Cargo.toml* dosyasına ekleyin:



```toml
{{#include ../listings/ch20-advanced-features/listing-20-31/hello_macro/hello_macro_derive/Cargo.toml:6:12}}
```



Prosedürel makroyu tanımlamaya başlamak için, Listing 20-31'deki kodu `hello_macro_derive` crate'inin *src/lib.rs* dosyasına yerleştirin. Bu kod, `impl_hello_macro` fonksiyonu için bir tanım ekleyene kadar derlenmeyecektir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-31/hello_macro/hello_macro_derive/src/lib.rs}}
```



:::note
`TokenStream`'i parse etmekten sorumlu olan `hello_macro_derive` fonksiyonu ve sözdizimi ağacını dönüştürmekten sorumlu olan `impl_hello_macro` fonksiyonu olarak kodu böldüğümüzü belirtmek isteriz: bu, bir prosedürel makro yazmayı daha rahat hale getirir.
:::

Dıştaki fonksiyondaki (`hello_macro_derive` bu durumda) kod, göreceğiniz ya da oluşturacağınız hemen hemen her prosedürel makro crate'i için aynı olacaktır. İçteki fonksiyonun gövdesinde (`impl_hello_macro` bu durumda) tanımladığınız kod, prosedürel makronuzun amacına bağlı olarak farklı olacaktır.

Üç yeni crate tanıttık: `proc_macro`, [`syn`] ve [`quote`]. `proc_macro`, Rust ile birlikte gelir, bu yüzden bunu *Cargo.toml*'da bağımlılıklara eklemek zorunda kalmadık. `proc_macro`, Rust kodunu kodumuzdan okuma ve üzerinde değişiklik yapma yeteneği sağlayan derleyicinin API'sidir.

`syn` crate'i Rust kodunu bir string'den, üzerinde işlem yapabileceğimiz bir veri yapısına parse eder. `quote` crate'i `syn` veri yapılarını tekrar Rust koduna çevirir. Bu crate'ler, herhangi bir Rust kodunu parse etmeyi çok daha kolay hale getirir: Rust kodu için tamamen bir parser yazmak basit bir iş değildir.

`hello_macro_derive` fonksiyonu, kütüphanemizin bir kullanıcısı tür üzerinde `#[derive(HelloMacro)]` belirttiğinde çağrılır. Bu, burada `hello_macro_derive` fonksiyonumuzu `proc_macro_derive` ile anotasyonlayıp, trait adımızla eşleşen `HelloMacro` adını belirttiğimiz için mümkündür; bu, çoğu prosedürel makronun takip ettiği konvansiyondur.

:::quote
**Önemli Not:** `hello_macro_derive` fonksiyonu, `input`'u bir `TokenStream`'den, ardından işleyeceğimiz ve üzerinde işlem yapabileceğimiz bir veri yapısına dönüştürür.
— Rust Dokümantasyonu
:::

İşte burada `syn` devreye giriyor. `syn` içindeki `parse` fonksiyonu, bir `TokenStream` alır ve parse edilmiş Rust kodunu temsil eden bir `DeriveInput` struct'ı döndürür. Listing 20-32, `struct Pancakes;` stringini parse ettiğimizde elde ettiğimiz `DeriveInput` struct'ının ilgili kısımlarını gösterir:



```rust,ignore
DeriveInput {
    // --snip--

    ident: Ident {
        ident: "Pancakes",
        span: #0 bytes(95..103)
    },
    data: Struct(
        DataStruct {
            struct_token: Struct,
            fields: Unit,
            semi_token: Some(
                Semi
            )
        }
    )
}
```



Bu struct'ın alanları, parse ettiğimiz Rust kodunun bir birim struct olduğunu ve `ident`'in (kimlik, yani isim) Pancakes olduğunu gösterir. Bu struct'ta, Rust kodunu tanımlamak için daha fazla alan bulunmaktadır; daha fazla bilgi için [`syn` belgelerindeki `DeriveInput`](https://docs.rs/syn/2.0/syn/struct.DeriveInput.html) bölümüne bakabilirsiniz.

Yakında `impl_hello_macro` fonksiyonunu tanımlayacağız; burada eklemek istediğimiz yeni Rust kodunu inşa edeceğiz. Ama önce, derive makromuzun çıktısının da bir `TokenStream` olduğunu belirtmeliyim. Döndürülen `TokenStream`, crate kullanıcılarımızın yazdığı koda eklenir. Dolayısıyla, crate'lerini derlediklerinde sağladığımız ek işlevselliği elde ederler.

:::tip
`unwrap` çağrısı yaparak `hello_macro_derive` fonksiyonunun `syn::parse` fonksiyonuna yapılan çağrı başarısız olursa panik yaratacağını fark etmiş olabilirsiniz. Prosedürel makromuzun hatalar sırasında panik yaratması gereklidir çünkü `proc_macro_derive` fonksiyonları `TokenStream` döndürmeli, `Result` değil, prosedürel makro API'sine uymak için.
:::

Bu örneği `unwrap` kullanarak basitleştirdik; üretim kodunda, `panic!` ya da `expect` kullanarak nelerin yanlış gittiği hakkında daha spesifik hata mesajları sağlamalısınız.

Artık, `TokenStream`'den anotasyonlu Rust kodunu bir `DeriveInput` örneğine dönüştürecek kodumuz olduğuna göre, Listing 20-33'te gösterildiği gibi, anotasyonlu tür üzerinde `HelloMacro` trait'ini uygulamak için kodu üretelim.



```rust,ignore
{{#rustdoc_include ../listings/ch20-advanced-features/listing-20-33/hello_macro/hello_macro_derive/src/lib.rs:here}}
```



:::info
`ast.ident` kullanarak annotasyona sahip türün adını (kimliğini) içeren bir `Ident` struct örneği alıyoruz. Listing 20-32'deki struct, `Listing 20-30`'daki kodu üzerinde `impl_hello_macro` fonksiyonunu çalıştırdığımızda, aldığımız `ident`'in `ident` alanının değeri `"Pancakes"` olacaktır.
:::

Böylece, Listing 20-33'teki `name` değişkeni, yazdırıldığında, Listing 20-30'daki struct'ın adı olan `"Pancakes"` stringini elde edeceğimiz bir `Ident` struct örneğini içerecektir.

`quote!` makrosu, döndürmek istediğimiz Rust kodunu tanımlamamız için bize olanak tanır. Derleyici, `quote!` makrosunun doğrudan sonucunun beklenen şeye benzemesini istediği için, onu bir `TokenStream`'e dönüştürmemiz gerekmektedir. Bunu yapmak için `into` metodunu çağırıyoruz; bu, bu ara temsili tüketir ve gereken `TokenStream` türünde bir değeri döndürür.

:::tip
`quote!` makrosu ayrıca bazı çok havalı şablonlama mekanikleri sağlar: `#name` yazabiliriz; `quote` bunu `name` değişkenindeki değerle değiştirecektir. Düzenli makroların çalışma şekliyle benzer bir şekilde tekrar yapabilirsiniz.
:::

[quote crate'inin belgelerini](https://docs.rs/quote) inceleyerek kapsamlı bir giriş yapabilirsiniz.

Prosedürel makromuzun kullanıcının annotasyonu olan tür için `HelloMacro` trait'inin bir uygulamasını üretmesini istiyoruz; bunu `#name` kullanarak elde edeceğiz. Trait uygulaması, `Hello, Macro! Benim adım` yazdırır ve ardından anotasyonlu türün adı gelir.

Burada kullanılan `stringify!` makrosu, Rust'a gömülü bir makrodur. Bir Rust ifadesini, örneğin `1 + 2`, alır ve derleme zamanında ifadeyi string literali olan `"1 + 2"` haline dönüştürür. Bu, ifadenin değerini değerlendiren ve ardından sonucu bir `String` haline getiren `format!` veya `println!` gibi makrolardan farklıdır. Girişteki `#name` ifadesinin harfiyen yazılması gereken bir ifade olma olasılığı bulunmaktadır, bu yüzden `stringify!` kullanıyoruz. `stringify!` kullanmak ayrıca `#name`'i derleme zamanında bir string literaline çevirerek bir tahsisat kazandırır.

Artık `cargo build` hem `hello_macro` hem de `hello_macro_derive` kısmında başarılı bir şekilde tamamlanmalıdır. Prosedürel makro eylemini görmek için bu crate'leri Listing 20-30'da bulunan kodla bağlayalım! *projects* dizininizde `cargo new pancakes` kullanarak yeni bir ikili proje oluşturun. `pancakes` crate'inin *Cargo.toml* dosyasına `hello_macro` ve `hello_macro_derive`'yi bağımlılık olarak eklememiz gerekiyor. Eğer `hello_macro` ve `hello_macro_derive`'nin sürümlerini [crates.io](https://crates.io/) üzerinde yayınlıyorsanız, bunlar normal bağımlılıklar olacaktır; eğer değilse, bunları `path` bağımlılıkları olarak aşağıdaki gibi belirtebilirsiniz:

```toml
{{#include ../listings/ch20-advanced-features/no-listing-21-pancakes/pancakes/Cargo.toml:7:9}}
```

Listing 20-30'un kodunu *src/main.rs* dosyasına yerleştirin ve `cargo run` çalıştırın: `Hello, Macro! Benim adım Pancakes!` yazdırmalıdır. Prosedürel makroya ait `HelloMacro` trait'inin uygulaması eklenmiştir; `pancakes` crate'inin bunu uygulamasına gerek kalmamıştır; `#[derive(HelloMacro)]` trait uygulamasını eklemiştir.

---

Sonraki adım, diğer prosedürel makro türlerinin özel derive makrolarından nasıl farklılaştığını keşfetmektir.

### Attribute-benzeri makrolar

Attribute-benzeri makrolar, özel derive makrolarına benzer, ancak `derive` niteliği için kod ürettikleri yerine, yeni nitelikler oluşturmanıza olanak tanır. Ayrıca daha esnektirler: `derive` yalnızca struct'lar ve enum'lar için çalışırken; nitelikler diğer öğelere de uygulanabilir, örneğin fonksiyonlara. Attribute-benzeri bir makro kullanma örneği: diyelim ki, bir web uygulama çerçevesi kullanırken fonksiyonları etiketleyen `route` adlı bir nitelik var:

```rust,ignore
#[route(GET, "/")]
fn index() {
```

Bu `#[route]` niteliği, çerçeve tarafından bir prosedürel makro olarak tanımlanır. Makro tanım fonksiyonunun imzası şu şekilde görünür:

```rust,ignore
#[proc_macro_attribute]
pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream {
```

Burada, `TokenStream` türünde iki parametreye sahibiz. İlk parametre niteliğin içeriğidir: `GET, "/"` kısmı. İkinci parametre, niteliğin iliştirildiği öğenin gövdesidir: bu durumda, `fn index() {}` ve fonksiyonun geri kalanı.

Bundan başka, attribute-benzeri makrolar, özel derive makrolarıyla aynı şekilde çalışır: `proc-macro` crate türü ile bir crate oluşturursunuz ve istediğiniz kodu üreten bir fonksiyon implement edersiniz!

### Fonksiyon-benzeri makrolar

Fonksiyon-benzeri makrolar, fonksiyon çağrıları gibi görünen makroları tanımlar. `macro_rules!` makroları gibi, bunlar fonksiyonlardan daha esnektirler; örneğin, bilinmeyen sayıda argüman alabilirler. Ancak, `macro_rules!` makroları yalnızca daha önceki bölümde tartıştığımız gibi eşleşme benzeri sözdizim kullanılarak tanımlanabilir. Fonksiyon-benzeri makrolar bir `TokenStream` parametresi alır ve tanımları, diğer iki prosedürel makro türü gibi, bu `TokenStream` üzerinde Rust kodu kullanarak manipülasyon yapar. Fonksiyon-benzeri bir makro örneği, şöyle çağrılabilecek bir `sql!` makrosudur:

```rust,ignore
let sql = sql!(SELECT * FROM posts WHERE id=1);
```

Bu makro, içindeki SQL ifadesini parse eder ve sözdizimsel olarak doğru olup olmadığını kontrol eder; bu, `macro_rules!` makrosunun yapabileceğinden çok daha karmaşık bir işlemedir. `sql!` makrosu, şu şekilde tanımlanır:

```rust,ignore
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
```

Bu tanım, özel derive makrosunun imzasına benzerdir: parantez içindeki token'ları alır ve üretmek istediğimiz kodu döndürür.

## Özet

Uff! Artık kutunuzda sıkça kullanmayacağınız bazı Rust özellikleri var, ancak bu özelliklerin özel durumlarda mevcut olduğunu bileceksiniz. Hata mesajı önerileri veya diğer insanların kodlarında karşılaştığınızda, bu kavramları ve sözdizimini tanıyabilmeniz için bir dizi karmaşık konuyu tanıttık. Bu bölümü çözümler bulmanıza rehberlik etmek için bir referans olarak kullanın.

Sonraki adımda, kitap boyunca tartıştığımız her şeyi pratiğe dökeceğiz ve bir proje daha gerçekleştireceğiz!

[ref]: ../reference/macros-by-example.html
[tlborm]: https://veykril.github.io/tlborm/
[`syn`]: https://crates.io/crates/syn
[`quote`]: https://crates.io/crates/quote
[syn-docs]: https://docs.rs/syn/2.0/syn/struct.DeriveInput.html
[quote-docs]: https://docs.rs/quote
[decl]: #declarative-macros-with-macro_rules-for-general-metaprogramming