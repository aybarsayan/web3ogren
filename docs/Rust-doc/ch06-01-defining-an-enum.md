## Enum Tanımının Yapılması

Yapılar, `genişlik` ve `yükseklik` gibi ilgili alanları ve verileri bir arada gruplamanıza olanak tanırken, enum'lar bir değerin olası bir değer setinden biri olduğunu ifade etmenizi sağlar. Örneğin, `Dikdörtgen`'in, `Daire` ve `Üçgen`'in de dahil olduğu olası şekillerden biri olduğunu söylemek isteyebiliriz. Bunu yapmak için Rust, bu olasılıkları bir enum olarak encode etmemize olanak tanır.

Kodda ifade etmek isteyebileceğimiz bir duruma bakalım ve neden enum'ların bu durumda yapılar yerine daha faydalı ve uygun olduğunu görelim. Diyelim ki IP adresleri ile çalışmamız gerekiyor. Şu anda IP adresleri için iki ana standart kullanılmaktadır: versiyon dört ve versiyon altı. Programımızın karşılaşacağı bir IP adresinin yalnızca bu olasılıklar olduğu için, tüm olası varyantları *sayabiliriz*, ki bu sayabilmenin adıdır.

:::info
Her IP adresi ya bir versiyon dört ya da bir versiyon altı adresi olabilir, ancak aynı anda her ikisi olamaz. IP adreslerinin bu özelliği, enum veri yapısını uygun hale getirir çünkü bir enum değeri yalnızca varyantlarından biri olabilir.
:::

Hem versiyon dört hem de versiyon altı adresleri hala temelde IP adresleridir, bu yüzden kod, her türlü IP adresine uygulanan durumlarla çalışırken aynı tür olarak ele alınmalıdır.

Bu kavramı kodda, `IpAddrKind` adında bir enumeration tanımlayarak ve bir IP adresinin olabileceği olası türleri, `V4` ve `V6` olarak listeleyerek ifade edebiliriz. İşte enum'un varyantları:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-01-defining-enums/src/main.rs:def}}
```

`IpAddrKind`, şimdi kodumuzda başka yerlerde kullanabileceğimiz özel bir veri türüdür.

### Enum Değerleri

`IpAddrKind`'in her iki varyantından örnekler oluşturabiliriz:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-01-defining-enums/src/main.rs:instance}}
```

> Enum'un varyantlarının, tanımlayıcı altında isimlendirilmiş olduğunu ve aralarına çift kolon koyarak ayırdığımızı unutmayın. Bu, artık `IpAddrKind::V4` ve `IpAddrKind::V6` değerlerinin aynı türde olduğunu kullanışlı hale getirir: `IpAddrKind`. — 

Örneğin, herhangi bir `IpAddrKind` alan bir fonksiyon tanımlayabiliriz:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-01-defining-enums/src/main.rs:fn}}
```

Ve bu fonksiyonu her iki varyant ile de çağırabiliriz:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-01-defining-enums/src/main.rs:fn_call}}
```

Enum'ların daha fazla avantajı vardır. IP adresi türümüzü daha çok düşündüğümüzde, aslında IP adresinin *veri* kısmını saklamak için bir yolumuz yok; sadece *türü* hakkında bilgi sahibiyiz. Bölüm 5'te yapılar hakkında yeni şeyler öğrendiğinizi göz önünde bulundurursak, bu sorunu yapı kullanarak çözmeye teşvik edilebilirsiniz.



```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-01/src/main.rs:here}}
```



Burada, bir `kind` alanı olan ve daha önce tanımladığımız enum olan `IpAddrKind` türünde bir `IpAddr` yapısı tanımladık ve `String` türünde bir `address` alanı var. Bu yapının iki örneği var. İlk olarak `home`, `kind` olarak `IpAddrKind::V4` değerine ve bağlı adres verisi `127.0.0.1` değerine sahiptir. İkinci örnek `loopback`'tir. O da, `V6` olarak `kind` değeri ve ona bağlı `::1` adresine sahiptir. `kind` ve `address` değerlerini bir araya getiren bir yapı kullandık, böylece varyant artık değer ile ilişkili.

:::note
Ancak, aynı kavramı yalnızca bir enum kullanarak temsil etmek daha özlüdür: yapı içinde bir enum yerine, her enum varyantının içine doğrudan veri koyabiliriz. `IpAddr` enum'undaki bu yeni tanım, hem `V4` hem de `V6` varyantlarının ilişkili `String` değerleri olacağını belirtir:
:::

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-02-enum-with-data/src/main.rs:here}}
```

Enum'un her bir varyantına doğrudan veri ekliyoruz, böylece fazladan bir yapıya ihtiyaç yok. Burada ayrıca, tanımladığımız her enum varyantının, enum örneğini oluşturan bir fonksiyon olacağını görmenin bir başka detayını görmek de kolaydır. Yani, `IpAddr::V4()` bir `String` argümanını alıp `IpAddr` türünde bir örnek döndüren bir fonksiyon çağrısıdır. Enum'u tanımlamamızın sonucu olarak bu yapıcı fonksiyonu otomatik olarak elde ederiz.

Bir enum kullanmanın başka bir avantajı daha vardır: her varyantın farklı türlerde ve miktarlarda ilişkili veriye sahip olabilmesidir. Versiyon dört IP adresleri her zaman 0 ile 255 değerleri arasında dört sayısal bileşen içerecektir. `V4` adreslerini dört `u8` değeri olarak saklamak, ancak yine de `V6` adreslerini bir `String` değeri olarak ifade etmek istersek, bir yapı ile bunu yapamazdık. Enum'lar bu durumu kolaylıkla halleder:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-03-variants-with-different-data/src/main.rs:here}}
```

Versiyon dört ve versiyon altı IP adreslerini saklamak için birkaç farklı veri yapısı tanımlamanın yollarını gösterdik. Ancak, görünüşe göre IP adreslerini saklamak ve hangi türde olduğunu kodlamak istemek o kadar yaygındır ki, [standart kütüphane kullanabileceğimiz bir tanım içeriyor!][IpAddr] Standart kütüphanenin `IpAddr`'ı nasıl tanımladığına bakalım: tam olarak tanımladığımız ve kullandığımız enum ve varyantlara sahiptir, ancak adres verilerini varyantlar içinde, her varyant için farklı bir şekilde tanımlanmış iki yapı şeklinde gömülü olarak içermektedir:

```rust
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

Bu kod, bir enum varyantının içerisine her türlü veriyi koyabileceğinizi gösterir: örneğin, stringler, sayısal türler veya yapılar. Hatta başka bir enum bile dahil edilebilir! Ayrıca, standart kütüphane türleri genelde sizin bulabileceğiniz kadar karmaşık değillerdir.

Standart kütüphanede `IpAddr` için bir tanım bulunsa da, kapsamımıza standart kütüphane tanımını getirmediğimiz için kendi tanımımızı oluşturmaya ve kullanmaya devam edebiliriz. Türlerin kapsam içine alınması konusunu Bölüm 7'de daha fazla konuşacağız.

Dördüncü örneğe bakalım: Listing 6-2'de çok çeşitli türlerle gömülen bir enum.



```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-02/src/main.rs:here}}
```



Bu enum'un dört farklı türde varyantı vardır:

* `Quit` ile hiçbir veri ilişkili değildir.
* `Move` adlı alanları olan bir yapıya sahiptir.
* `Write` tek bir `String` içerir.
* `ChangeColor` üç `i32` değerini içerir.

:::tip
Listing 6-2'deki gibi varyantlara sahip bir enum tanımlamak, yapı tanımlamaları oluşturmak gibidir; tek fark, enum'un `struct` anahtar kelimesini kullanmaması ve tüm varyantların `Message` türü altında gruplanmış olmasıdır.
:::

Aşağıdaki yapılar, yukarıdaki enum varyantlarının tuttuğu aynı verileri tutabilir:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-04-structs-similar-to-message-enum/src/main.rs:here}}
```

Ancak, eğer her biri kendi türüne sahip olan farklı yapılar kullansaydık, `Listing 6-2`'de tanımlanan `Message` enum'u ile yapabileceğimiz kadar kolay bir fonksiyonu biçimlendiremezdik.

Enum'lar ve yapılar arasında bir benzerlik daha vardır: yapı üzerinde `impl` kullanarak yöntemler tanımlama yeteneğimiz olduğu gibi, enum'lar üzerinde de yöntemler tanımlama yeteneğimiz vardır. İşte `Message` enum'umuz üzerinde tanımlayabileceğimiz bir `call` yönteminin örneği:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-05-methods-on-enums/src/main.rs:here}}
```

Yöntemin gövdesi, çağrıda bulunduğumuz değeri almak için `self` kullanacaktır. Bu örnekte, `m`, `Message::Write(String::from("hello"))` değeri ile oluşturulmuş bir değişken ve bu, `m.call()` çalıştığında `call` yönteminin gövdesinde `self` olacaktır.

:::warning
Şimdi, standart kütüphanedeki çok yaygın ve kullanışlı bir diğer enum'a bakalım: `Option`.
:::

### `Option` Enum'u ve Null Değerlerine Göre Avantajları

Bu bölüm, standart kütüphane tarafından tanımlanan bir diğer enum olan `Option` için bir vaka çalışmasını keşfetmektedir. `Option` türü, değerlerin bir şey veya hiç olabileceği oldukça yaygın bir durumu kodlar.

Örneğin, boş olmayan bir listede ilk öğeyi isterseniz, bir değer alırsınız. Boş bir listede ilk öğeyi isterseniz, hiçbir şey almazsınız. Bu kavramı tür sistemi açısından ifade etmek, derleyicinin tüm durumları ele alıp almadığınızı kontrol etmesine imkan tanır; bu işlevsellik, diğer programlama dillerinde oldukça yaygın olan hataları önleyebilir.

:::note
Programlama dili tasarımı genellikle hangi özellikleri içerdiğinizle düşünülür, ancak dışladığınız özellikler de önemlidir. Rust, birçok başka dilde bulunan null özelliğine sahip değildir. *Null*, orada hiçbir değerin olmadığı anlamına gelen bir değerdir. Null olan dillerde, değişkenler her zaman iki durumdan birinde olabilir: null veya null değil.
:::

Tony Hoare, null'ün mucidi, 2009 yılında “Null Referanslar: Milyar Dolarlık Hata” başlıklı bir sunumda şöyle der:

> Bunu milyar dolarlık hatam olarak adlandırıyorum. O zaman, nesne yönelimli bir dilde referanslar için ilk kapsamlı tür sistemini tasarlıyordum. Amacım, referansların tüm kullanımının tamamen güvenli olmasını sağlamak, derleyici tarafından otomatik olarak kontrol edilmesini sağlamaktı. Ancak, uygulanması çok kolay olduğu için bir null referans koyma arzusuna direnemedim. Bu, muhtemelen son kırk yılda milyar dolarlık acı ve zarara neden olan sayısız hata, zafiyet ve sistem çökmesine yol açtı. 

Null değerlerle ilgili sorun, null bir değeri null olmayan bir değer gibi kullanmaya çalıştığınızda bir tür hata almanızdır. Bu null veya null olmayan özellik yaygın olduğundan, bu tür hataları yapmak son derece kolaydır.

Ancak, null'ün ifade etmeye çalıştığı kavram hala yararlıdır: null, bazı nedenlerden ötürü geçersiz veya eksik olan bir değerdir.

Sorun gerçekten kavramda değil, belirli uygulamada yatmaktadır. Bu nedenle, Rust null içermez, ancak bir değerin mevcut veya eksik olabileceği kavramını kodlayabilen bir enum'a sahiptir. Bu enum `Option` ve [standart kütüphane tarafından tanımlanmıştır][option]:

```rust
enum Option<T> {
    None,
    Some(T),
}
```

`Option` enum'u o kadar yararlıdır ki, öncelikli olarak dahil edilmiştir; kesinlikle kapsamınıza getirmeniz gerekmez. Varyantları da öncelikli olarak dahil edilmiştir: `Option::` ön eki olmadan doğrudan `Some` ve `None` kullanabilirsiniz. `Option` enum'u hala sıradan bir enum'dur ve `Some(T)` ve `None` hala `Option` türünün varyantlarıdır.

`` sözdizimi, daha önce konuşmadığımız bir Rust özelliğidir. Bu, bir genel tür parametresidir ve genel türleri daha ayrıntılı bir şekilde Bölüm 10'da ele alacağız. Şu anda bilmeniz gereken tek şey ``nin, `Option` enum'unun `Some` varyantının herhangi bir türde bir veriyi tutabileceği ve `T` yerine kullanılan her somut türün genel `Option` türünü farklı bir tür yaptığıdır. İşte `Option` değerlerini sayısal türleri ve string türleri tutacak şekilde kullanmanın bazı örnekleri:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-06-option-examples/src/main.rs:here}}
```

`some_number`'ın türü `Option`dir. `some_char`'ın türü `Option`'dır, bu farklı bir türdür. Rust, `Some` varyantının içinde bir değer belirttiğimiz için bu türleri çıkarabilir. `absent_number` için, Rust'ın genel `Option` türünü belirtmemizi gerektirir: derleyici, yalnızca `None` değeri üzerinden bakarak karşılık gelen `Some` varyantının ne türde bir veri tutacağını çıkaramaz. Burada Rust'a `absent_number`ın `Option` türünde olmasını istediğimizi söylüyoruz.

Bir `Some` değerimiz olduğunda, bir değerin mevcut olduğunu biliriz ve değer `Some` içinde tutulur. Bir `None` değerine sahip olduğumuzda, bir anlamda bu durum null ile aynı şeyi ifade eder: geçerli bir değere sahip değiliz. Peki, neden `Option` kullanmak null kullanmaktan daha iyi?

Kısacası, çünkü `Option` ve `T` (burada `T` her hangi bir tür olabilir) farklı türlerdir, derleyici `Option` değerini kesin bir geçerli değer varmış gibi kullanmamıza izin vermez. Örneğin, bu kod derlenmeyecek, çünkü bir `i8` ve bir `Option` toplamak istiyor:

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-07-cant-use-option-directly/src/main.rs:here}}
```

Bu kodu çalıştırdığımızda, aşağıdaki gibi bir hata mesajı alırız:

```console
{{#include ../listings/ch06-enums-and-pattern-matching/no-listing-07-cant-use-option-directly/output.txt}}
```

Yoğun! Aslında, bu hata mesajı, Rust'ın bir `i8` ile bir `Option`'i toplamak konusunda ne yapacağını anlamadığını belirtmektedir, çünkü bunlar farklı türlerdir. Rust'ta `i8` gibi bir türde bir değerimiz olduğunda, derleyici, her zaman geçerli bir değerimiz olması gerektiğini sağlayacaktır. Elde tuttuğumuz değeri kullanmadan önce null olup olmadığını kontrol etmemiz gerekmez. Yalnızca bir `Option`(veya çalıştığımız değer ne olursa olsun) değerime sahip olduğumuzda, o değeri kullanmadan önce olası bir değerin olmadığını kontrol etmemiz gerekecek ve derleyici bunu gerçekleştirecek.

:::danger
Diğer bir deyişle, `T` işlemleri ile devam etmek için bir `Some` varyantını bir `T` değerine dönüştürmelisiniz. Genel olarak, bu, null ile ilgili en yaygın sorunlardan birini yakalamaya yardımcı olur: bir şeyin null olmadığını varsaymak.
:::

Hatalı bir şekilde null olmayan bir değeri varsayma riskini ortadan kaldırmak, kodunuza olan güveninizi artırır. Olabilir bir null değere sahip olmak için, o değerin türünü `Option` yaparak açıkça seçmeniz gerekir. Sonra, o değeri kullanırken, değer null olduğunda durumu açıkça ele almanız zorunludur. Bir değerin türü `Option` olmayan her yerde, bu değerin null olmadığını güvenle varsayabilirsiniz. Bu, Rust'ın null'un yaygınlığını sınırlamak ve Rust kodunun güvenliğini artırmak için bilinçli bir tasarım kararıydı.

Peki, bir `Option` değerine sahipken `Some` varyantından `T` değerini nasıl çıkartırsınız? `Option` enum'unun farklı durumlarda kullanışlı olan birçok yöntemleri vardır; bunları [belgelerinde][docs] bulabilirsiniz. `Option` üzerindeki yöntemlerle tanışmak, Rust ile seyahatinizde son derece yararlı olacaktır.

Genel olarak, bir `Option` değerini kullanmak için, her varyantı ele alacak bir koda sahip olmalısınız. Sadece bir `Some(T)` değerine sahip olduğunuzda çalışacak bir kod istiyorsunuz; bu kod, içindeki `T`'yi kullanmak için özgürdür. Diğer bir kodun yalnızca bir `None` değeri olduğunda çalışmasını istiyorsunuz ve bu kodda `T` değeri mevcut değildir. `match` ifadesi, enum'lar ile kullanıldığında tam olarak bunu yapan bir kontrol akış yapısıdır: enum'un hangi varyantına sahipse ona göre farklı bir kod çalıştırır ve bu kod, eşleşen değerin içindeki veriyi kullanabilir.

[IpAddr]: ../std/net/enum.IpAddr.html  
[option]: ../std/option/enum.Option.html  
[docs]: ../std/option/enum.Option.html  