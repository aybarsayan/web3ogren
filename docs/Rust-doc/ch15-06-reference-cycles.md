## Referans Döngüleri Belleği Sızdırabilir

Rust’ın bellek güvenliği garantileri, bellek temizlenmeyen durumların (bilinen bir *bellek sızıntısı*) kazara yaratılmasını zorlaştırır, ancak imkansız kılmaz. Bellek sızıntılarını tamamen önlemek, Rust’ın garantilerinden biri değildir; bunun anlamı, Rust'ta bellek sızıntıları bellek güvenlidir. Rust’ın `Rc` ve `RefCell` kullanarak bellek sızıntılarına izin verdiğini görebiliriz: elemanların birbirine döngüsel bir şekilde referans vermesi mümkündür. Bu, döngüdeki her nesnenin referans sayısı 0’a asla ulaşmadığı için bellek sızıntılarına sebep olur ve değerler asla düşmez.

### Bir Referans Döngüsü Oluşturma

:::note
Bir referans döngüsünün nasıl olabileceğine ve nasıl önlenebileceğine bakalım; önce `List` enum’unun tanımını ve 15-25. listedeki bir `tail` yöntemini inceleyelim.
:::

` tutan bir cons list tanımı, böylece bir `Cons` varyantının hangi değere referans verdiğini değiştirebiliriz">

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-25/src/main.rs}}
```



15-5. listedeki `List` tanımının başka bir varyasyonunu kullanıyoruz. `Cons` varyantındaki ikinci eleman artık `RefCell>`, yani 15-24. listedeki gibi `i32` değerini değil, bir `Cons` varyantının referans verdiği `List` değerini değiştirmek istiyoruz. Ayrıca, bir `Cons` varyantına sahip olduğumuzda ikinci öğeye erişimi kolaylaştırmak için bir `tail` yöntemini ekliyoruz.

15-26. listedeki `main` fonksiyonunu ekleyerek 15-25. listedeki tanımları kullanıyoruz. Bu kod, `a` değişkeninde bir liste ve `b` değişkeninde `a` listesini işaret eden bir liste oluşturuyor. Ardından, `a` listesini `b`’ye işaret edecek şekilde değiştirerek bir referans döngüsü oluşturuyoruz. Bu süreçte referans sayılarını çeşitli noktalarda göstermek için `println!` ifadeleri var.



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-26/src/main.rs:here}}
```



`a` değişkeninde `5, Nil` içeren bir `Rc` örneği oluşturuyoruz. Ardından, `a` listesini işaret eden 10 değerini içeren bir başka `Rc` örneği olan `b` oluşturuyoruz.

`a`’yı `Nil` yerine `b`’ye işaret edecek şekilde değiştiriyoruz ve bu bir döngü oluşturuyor. Bunu, `a`'daki `RefCell>` referansını alacak şekilde `tail` yöntemini kullanarak yapıyoruz; bu referansı `link` değişkenine koyuyoruz. Ardından, `Rc`'teki `Nil` değerini içeren değeri `b`'deki `Rc` ile değiştirmek için `RefCell>` üzerindeki `borrow_mut` yöntemini kullanıyoruz.

Bu kodu çalıştırdığımızda, en son `println!` ifadesini şu an için yorum satırı haline getirirsek, aşağıdaki çıktıyı alırız:

```console
{{#include ../listings/ch15-smart-pointers/listing-15-26/output.txt}}
```

`a`’daki listedeki değişiklikten sonra `Rc` örneklerinin referans sayısı 2 oluyor. `main`’in sonunda Rust, `b` değişkenini düşürdüğünde, `b`’nin `Rc` örneğinin referans sayısını 2’den 1’e düşürüyor. `Rc`’teki bellek bu noktada düşmeyecek çünkü referans sayısı 1, 0 değil. Ardından Rust, `a`'yı düşürüyor; bu da `a`’nın `Rc` örneğinin referans sayısını da 2’den 1’e düşürüyor. Bu örneğin belleği de düşürülemez, çünkü diğer `Rc` örneği hala ona referans vermektedir. Listeye tahsis edilen bellek sonsuza dek toplanmadan kalacak. Bu referans döngüsünü görselleştirmek için Şekil 15-4'te bir diyagram oluşturduk.

![Liste referans döngüsü](images/rust/img/trpl15-04.svg)

Şekil 15-4: Birbirine işaret eden `a` ve `b` listelerinin referans döngüsü

Son `println!` ifadesini açarsanız ve programı çalıştırırsanız, Rust bu döngüyü `a`'nın `b`'ye, `b`'nin de `a`'ya işaret ettiği biçimde yazdırmaya çalışır ve yığın taşmasına yol açabilir.

:::warning
Gerçek bir program ile karşılaştırıldığında, bu örnekte bir referans döngüsü oluşturmanın sonuçları pek de korkunç değildir: referans döngüsünü oluşturduktan hemen sonra program sonlanır. Ancak daha karmaşık bir program, bir döngü içinde çok fazla bellek tahsis eder ve bunu uzun süre tutarsa, program ihtiyaç duyduğundan daha fazla bellek kullanacak ve sistemin bellek bitmesine sebep olabilir.
:::

Referans döngülerinin oluşturulması kolay değildir, ancak imkansız da değildir. `Rc` değerlerini veya benzer içi değiştirilebilir ve referans sayımı olan türlerin iç içe kombinasyonlarını içeren `RefCell` değerleriniz varsa, döngü oluşturmamanız gerektiğini sağlamak zorundasınız; Rust’ın bunları yakalayacağını bekleyemezsiniz. Bir referans döngüsü oluşturmak, programınızdaki mantıksal bir hata olur; bunu minimize etmek için otomatik testler, kod incelemeleri ve diğer yazılım geliştirme uygulamalarını kullanmalısınız.

:::tip
Referans döngülerinden kaçınmanın bir diğer çözümü, bazı referansların sahipliği ifade ettiği ve bazı referansların ifade etmediği veri yapılarını yeniden organize etmektir. Sonuç olarak, sahiplik ilişkileri ve sahipsiz ilişkilerden oluşan döngüler yapabilir ve yalnızca sahiplik ilişkileri, bir değerin düşüp düşmeyeceğini etkiler. 
:::

Burada, 15-25. listedeki `Cons` varyantlarının her zaman listelerini sahiplenmesini istediğimizden, veri yapısını yeniden organize etmek mümkün değildir. Şimdi, ebeveyn düğümleri ve çocuk düğümleriyle yapılan grafikleri kullanarak sahiplik dışı ilişkilerin referans döngülerini önlemek için uygun bir yol olup olmadığını görelim.

### Referans Döngülerini Önleme: `Rc`'yi `Weak` Haline Getirme

Şu ana kadar, `Rc::clone` çağırmanın bir `Rc` örneğinin `strong_count`'ını artırdığını ve bir `Rc` örneğinin yalnızca `strong_count` 0 olduğunda temizlendiğini gösterdik. Ayrıca, `Rc` örneğindeki değere *zayıf bir referans* oluşturmak için `Rc::downgrade` çağırarak `Rc`’ye bir referans geçirebilirsiniz. Güçlü referanslar, bir `Rc` örneğinin sahipliğini paylaşmanın yoludur. Zayıf referanslar sahiplik ilişkisini ifade etmez ve sayımları, bir `Rc` örneğinin ne zaman temizleneceğini etkilemez. Zayıf referansları içeren herhangi bir döngü, ilgili değerlerin güçlü referans sayısı 0 olduğunda kırılacaktır.

:::info
`Rc::downgrade` çağırdığınızda, `Weak` türünde bir akıllı gösterici elde edersiniz. `Rc` örneğindeki `strong_count`’ı 1 artırmak yerine, `Rc::downgrade` çağırmak `weak_count`'ı 1 artırır. `Rc` tipi, `weak_count`'ı mevcut ne kadar `Weak` referansı olduğunu takip etmek için kullanır; bu, `strong_count`’a benzer. Fark, `Rc` örneğinin temizlenmesi için `weak_count`'ın 0 olması gerekmediğidir.
:::

`Weak` referanslarının gösterebileceği değer düşmüş olabileceğinden, bir `Weak` referansı ile gösterilen değere herhangi bir şey yapmak için, değerin hala var olduğundan emin olmalısınız. Bunu bir `Weak` örneği üzerindeki `upgrade` yöntemini çağırarak yapın; bu, bir `Option>` döndürecektir. `Rc` değeri henüz düşmemişse, `Some` olarak bir sonuç alırsınız; eğer `Rc` değeri düşmüşse `None` olarak bir sonuç alırsınız. `upgrade`'ın bir `Option>` döndürdüğünden, Rust `Some` durumu ve `None` durumunun ele alındığından emin olacaktır; geçersiz bir işaretçi olmayacaktır.

Örneğin, öğeleri yalnızca sonraki öğesini bilen bir liste yerine, çocuk öğeleri *ve* ebeveyn öğeleri hakkında bilgi sahibi olan bir ağaç oluşturacağız.

#### Bir Ağaç Veri Yapısını Oluşturma: Çocuk Düğümleri Olan Bir `Node`

Başlamak için, çocuk düğümlerinden haberdar olan düğümlerle bir ağaç inşa edeceğiz. Kendi `i32` değerini ve çocuk `Node` değerlerine referansları tutan bir `Node` adlı yapı oluşturacağız:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-27/src/main.rs:here}}
```

Bir `Node`'un çocuklarına sahip olmasını istiyoruz ve bu sahipliği değişkenlerle paylaşmak istiyoruz, böylece ağaçtaki her `Node`'a doğrudan erişebiliriz. Bunu yapmak için, `Vec` öğelerini `Rc` türündeki değerler olarak tanımlıyoruz. Ayrıca, hangi düğümlerin diğer bir düğümün çocukları olduğu ile oynamak istiyoruz, bu yüzden `children` içinde `Vec>` çevresinde bir `RefCell` tutuyoruz.

Sonra, yapı tanımımızı kullanarak, değeri 3 olan ve çocuğu olmayan bir `leaf` adlı `Node` örneği ve değeri 5 olan ve `leaf`'in çocuklarından biri olduğu başka bir `branch` örneği oluşturacağız; bu, 15-27. listedeki gibi olacak:



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-27/src/main.rs:there}}
```



`leaf` içindeki `Rc`'yi klonlayarak `branch` içinde saklıyoruz; bu, `leaf` içindeki `Node`'un artık iki sahibi olduğu anlamına gelir: `leaf` ve `branch`. `branch.children` üzerinden `leaf`'e ulaşabiliriz, ancak `leaf`'ten `branch`'e ulaşmanın bir yolu yoktur. Nedeni, `leaf`'in `branch`'e bir referansı olmaması ve bunların birbirine bağlı olduğunu bilmemesidir. `leaf`'in, `branch`'in ebeveyni olduğunu bilmesini istiyoruz. Bunu bir sonraki adımda yapacağız.

#### Bir Çocukta Ebeveynine Referans Eklemek

Çocuk düğümünün ebeveynini bilmesi için, `Node` yapı tanımımıza bir `parent` alanı eklememiz gerekiyor. Sorun, `parent`'ın türünün ne olması gerektiğini belirlemekte. İçinde bir `Rc` barındıramayacağını biliyoruz; çünkü bu, `leaf.parent`'ı `branch`'e, `branch.children`'ı da `leaf`'e işaret edecek bir referans döngüsü oluşturur ve bu da `strong_count` değerlerinin asla 0 olmasına neden olur.

:::tip
İlişkileri başka bir şekilde düşünürsek, ebeveyn düğümünün çocuklarına sahip olması gerekir: eğer bir ebeveyn düğümü düşerse, çocuk düğümleri de düşmelidir. Ancak, bir çocuk ebeveynine sahip olmamalıdır: çocuk düğümünü düşürürsek, ebeveyn hâlâ var olmalıdır. Bu, zayıf referanslar için bir durumdur!
:::

Bu nedenle `Rc` yerine, `parent`'ın türü `Weak` kullanacak; özellikle `RefCell>`. Artık `Node` yapı tanımımız şu şekilde görünüyor:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-28/src/main.rs:here}}
```

Bir düğüm, ebeveyn düğümüne referans verebilir ancak ebeveynine sahip değildir. 15-28. listedeki örnekte, artık `leaf` düğümünün `branch` ebeveynine referans verme yolu olması için `main`'i yeni tanımı kullanacak şekilde güncelliyoruz:



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-28/src/main.rs:there}}
```



`leaf` düğümünü oluşturma işlemi, `parent` alanının olmaması dışında, 15-27. listedeki gibi görünür; `leaf` başlangıçta bir ebeveyni olmadan başlar, bu yüzden yeni, boş bir `Weak` referans örneği oluşturuyoruz.

Bu noktada, `leaf`'in ebeveynine `upgrade` yöntemini kullanarak erişmeye çalıştığımızda, `None` değerini alırız. Bunu ilk `println!` ifadesinin çıktısında görebiliriz:

```text
leaf parent = None
```

`branch` düğümünü oluşturduğumuzda, `parent` alanında yeni bir `Weak` referansı da olacaktır; çünkü `branch`'in ebeveyn düğümü yoktur. Hâlâ `branch`'in çocuklarından biri olarak `leaf` vardır. `branch`'deki `Node` örneğine sahip olduğumuzda, `leaf`'in ebeveynine bir `Weak` referansı vermek için `leaf`'in `parent` alanında `RefCell>` üzerindeki `borrow_mut` yöntemini kullanıyoruz ve ardından `branch` içindeki `Rc`'den `branch`'e `Weak` referansı oluşturmak için `Rc::downgrade` fonksiyonunu kullanıyoruz.

`leaf`'in ebeveynini tekrar yazdırdığımızda, bu sefer `branch` içeren bir `Some` varyantı alacağız: artık `leaf` ebeveynine erişebiliyor! Ayrıca `leaf`'i yazdırdığımızda, Listing 15-26'daki gibi yığın taşmasına yol açan döngüyü de önlüyoruz; `Weak` referansları `(Weak)` olarak yazdırılıyor:

```text
leaf parent = Some(Node { value: 5, parent: RefCell { value: (Weak) },
children: RefCell { value: [Node { value: 3, parent: RefCell { value: (Weak) },
children: RefCell { value: [] } }] } })
```

Sonsuz bir çıktının olmaması, bu kodun bir referans döngüsü oluşturmadığını gösteriyor. `Rc::strong_count` ve `Rc::weak_count` çağrılarından aldığımız değerleri de kontrol ederek bunu anlayabiliriz.

#### `strong_count` ve `weak_count` Değişimlerini Görselleştirme

:::tip
`strong_count` ve `weak_count` değerlerinin değişimini görmek için, yeni bir iç kapsam oluşturup `branch`'in oluşturulmasını o kapsamın içine taşıyalım. Böylece `branch` oluşturulduğunda ve kapsam dışına çıktığında ne olacağını görebiliriz.
:::

Değişiklikler 15-29. listede gösterilmiştir:



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-29/src/main.rs:here}}
```



`leaf` oluşturulduktan sonra, `Rc`’sinin güçlü sayımı 1 ve zayıf sayımı 0’dır. İç kapsamda, `branch` oluşturuyoruz ve `leaf` ile ilişkilendiriyoruz; bu noktada sayımları yazdırdığımızda, `branch` içindeki `Rc`’nin güçlü sayımının 1 ve zayıf sayımının 1 (bu yolla `leaf.parent`'ın `branch`'e işaret etmesi için zayıf bir referans) olduğunu göreceğiz. `leaf` içindeki sayımları yazdırdığımızda, 2 güçlü sayım göreceğiz çünkü `branch`’teki `branch.children` içinde `leaf`’in `Rc` kopyası şimdi mevcuttur, ama 0 zayıf sayımacaktır.

İç kapsam bittiğinde, `branch` kapsam dışına çıkar ve `Rc`'nin güçlü sayımı 0'a düşer; böylece `Node` düşer. `leaf.parent`'taki 1 zayıf sayımın `Node`'nun düşüp düşmemesine bir etkisi yoktur, bu yüzden herhangi bir bellek sızıntısı yaşamıyoruz!

Kapsamın sona ermesinden sonra `leaf`'in ebeveynine erişmeye çalışırsak, yine `None` alacağız. Programın sonunda, `leaf` içindeki `Rc` güçlü sayımı 1 ve zayıf sayımı 0’dır; çünkü `leaf` değişkeni artık `Rc` için tek referans olmuştur.

:::info
Sayım ve değer düşürme mantığını yöneten tüm mantık, `Rc` ve `Weak`’de ve `Drop` trait'inin uygulamalarında yerleşiktir. 
:::

`Node` tanımında bir çocuktan ebeveyne olan ilişkinin `Weak` referansı olması gerektiğini belirterek, ebeveyn düğümlerinin çocuk düğümlere ve tersine referans vermelerine izin veriyorsunuz ve bu şekilde referans döngüsü ve bellek sızıntısı oluşturmaktan kaçınıyorsunuz.

## Özet

Bu bölüm, akıllı göstericilerin Rust’ın varsayılan olarak düzenli referanslar ile sağladığı farklı garantiler ve ticaretlerle nasıl kullanılacağını kapsadı. `Box` türü bilinen bir boyuta sahiptir ve yığında tahsis edilmiş verilere işaret eder. `Rc` türü, yığında verilere olan referansların sayısını takip eder, böylece bu verilerin birden fazla sahibi olabilir. İç değiştirilebilirlik sağlayan `RefCell` türü, değiştirilemeyecek bir tür gerektiğinde ancak bu türün iç değerini değiştirmemiz gerektiğinde kullanabileceğimiz bir türdür; ayrıca, borçlanma kurallarını çalışma zamanında, derleme zamanında değil de uygular.

Ayrıca, akıllı göstericilerin birçok işlevselliğini sağlayan `Deref` ve `Drop` trait'leri üzerinde tartıştık. Bellek sızıntılarına neden olabilecek referans döngülerini keşfettik ve bunları `Weak` kullanarak nasıl önleyebileceğimizi inceledik.

:::tip
Bu bölüm ilginizi çektiyse ve kendi akıllı göstericilerinizi uygulamak istiyorsanız, daha yararlı bilgiler için [“The Rustonomicon”][nomicon]a göz atın.
:::

Sonraki bölümde, Rust'ta eşzamanlılıktan bahsedeceğiz. Hatta birkaç yeni akıllı gösterici hakkında bilgi edineceksiniz.

[nomicon]: ../nomicon/index.html