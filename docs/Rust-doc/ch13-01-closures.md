

## Kapsayıcılar: Ortamlarını Yakalamayı Başaran Anonim Fonksiyonlar

Rust'taki kapsayıcılar, bir değişkende saklayabileceğiniz veya diğer fonksiyonlara argüman olarak geçebileceğiniz anonim fonksiyonlardır. Kapsayıcıyı bir yerde oluşturabilir ve başka bir yerde onu farklı bir bağlamda değerlendirmek için çağırabilirsiniz. **Fonksiyonların aksine**, kapsayıcılar tanımlandıkları kapsamdan değerleri yakalayabilirler. Bu kapsayıcı özelliklerinin kod yeniden kullanımı ve davranış özelleştirmesi için nasıl olanak sağladığını göstereceğiz.

---





### Kapsayıcılar ile Ortamı Yakalamak

Öncelikle, kapsayıcıları tanımlandıkları ortamdan değerleri yakalamak için nasıl kullanabileceğimizi inceleyeceğiz. İşte senaryo: Belirli aralıklarla, tişört şirketimiz, bir promosyon olarak posta listemizdeki birine özel, sınırlı sayıda üretilmiş bir tişört hediye eder. Posta listesinde bulunan kişiler, profillerine tercih ettikleri rengi isteğe bağlı olarak ekleyebilirler. Ücretsiz tişört kazanan kişinin tercih ettiği bir renk varsa, o renkte bir tişört alır. Kişi tercih ettiği bir rengi belirtmemişse, şirketin şu anda en fazla bulundurduğu renkten bir tişört alır.

:::info
Bu örneğin uygulanması için `ShirtColor` adında bir enum ve `Inventory` adında bir struct kullanacağız.
:::

Bunu uygulamanın birçok yolu vardır. Bu örnek için, basitlik amacıyla `Red` ve `Blue` varyantlarına sahip olan `ShirtColor` adında bir enum kullanacağız. Şirketin envanterini temsil etmek için, mevcut tişört renklerini temsil eden `Vec` içeren `shirts` adında bir alanı olan bir `Inventory` struct'ı kullanıyoruz. `Inventory` üzerinde tanımlanan `giveaway` yöntemi, ücretsiz tişört kazanıcısının isteğe bağlı tişört rengi tercihini alır ve kişinin alacağı tişört rengini döner. Bu kurulum Şekil 13-1'de gösterilmektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-01/src/main.rs}}
```



`main` içinde tanımlanan `store`, bu sınırlı sayıda üretilmiş promosyon için dağıtmak üzere iki mavi tişört ve bir kırmızı tişört bulundurmaktadır. Kırmızı tişört tercih eden bir kullanıcı ve hiçbir tercihi olmayan bir kullanıcı için `giveaway` yöntemini çağırıyoruz.

:::tip
Bu kod birçok şekilde uygulanabilir; burada kapsayıcılara odaklanmak için, `giveaway` yönteminin gövdesi dışında öğrendiğiniz kavramlara sadık kaldık.
:::

`giveaway` yönteminde, kullanıcı tercihini `Option` türünde bir parametre olarak alırız ve `user_preference` üzerinde `unwrap_or_else` metodunu çağırırız. [`unwrap_or_else` metodu üzerinde `Option`][unwrap-or-else] standart kütüphane tarafından tanımlanmıştır. Bu metod bir argüman alır: argümanları olmayan ve bir `T` değeri döndüren bir kapsayıcı (bu durumda `Option`'nin `Some` varyantında saklanan aynı tür, `ShirtColor`). Eğer `Option` `Some` varyantıysa, `unwrap_or_else` içinde bulunan değeri döndürür. Eğer `Option` `None` varyantıysa, `unwrap_or_else` kapsayıcıyı çağırır ve kapsayıcının döndürdüğü değeri döndürür.

Kapsayıcı ifadesini `|| self.most_stocked()` olarak `unwrap_or_else` metoduna argüman olarak belirtiyoruz. Bu, kendisi hiçbir parametre almayan bir kapsayıcıdır (eğer kapsayıcının parametreleri olsaydı, iki dikey çubuk arasında görünürdü). Kapsayıcının gövdesi `self.most_stocked()` çağrısını içerir. Burada kapsayıcıyı tanımlıyoruz ve `unwrap_or_else`'in implementasyonu daha sonra sonuç gerektiğinde kapsayıcıyı değerlendirecektir.

Bu kodu çalıştırmak şunları yazdırır:

```console
{{#include ../listings/ch13-functional-features/listing-13-01/output.txt}}
```

Burada ilginç bir yön, `self.most_stocked()` çağıran bir kapsayıcıyı mevcut `Inventory` örneğine geçmemizdir. Standart kütüphane, tanımladığımız `Inventory` veya `ShirtColor` türleri hakkında hiçbir şey bilmek zorunda değildi ya da bu senaryoda kullanmak istediğimiz mantığa dair bir bilgiye ihtiyaç duymadı. Kapsayıcı, `self` `Inventory` örneğine değiştirilemeyen bir referans alır ve bunu belirttiğimiz kodla birlikte `unwrap_or_else` metoduna geçirir. Öte yandan, fonksiyonlar çevrelerini bu şekilde yakalayamazlar.

---

### Kapsayıcı Türü Çıkarımı ve Notasyon

Fonksiyonlar ile kapsayıcılar arasında daha fazla fark vardır. Kapsayıcıların genellikle parametrelerin veya dönüş değerinin türlerini `fn` fonksiyonları gibi belirtmeleri gerekmez. Fonksiyonlarda tür notasyonları zorunludur çünkü türler, kullanıcılarınıza sunulan açıklayıcı bir arayüzün parçasıdır. Bu arayüzü katı bir şekilde tanımlamak, herkesin bir fonksiyonun kullandığı ve döndürdüğü değer türleri üzerinde hemfikir olmasını sağlamak için önemlidir. Kapsayıcılar ise, bu tür bir arayüzde kullanılmazlar: değişkenlerde saklanır ve isimlendirilmeden ve kütüphanemizin kullanıcılarına ifşa edilmeden kullanılırlar.

Kapsayıcılar genellikle kısa ve dar bir bağlam içinde geçerlidir, herhangi bir keyfi senaryoda değil. Bu sınırlı bağlamlar içinde, derleyici, parametrelerin ve dönüş türünün türlerini çıkarabilir, çoğu değişkenin türlerini çıkardığı gibi (derleyicinin nadir durumlarda kapsayıcı tür notasyonlarına ihtiyaç duyduğu yerler vardır).

:::note
Değişkenlerle olduğu gibi, istiyorsak açıklığı ve netliği artırmak için tür notasyonları ekleyebiliriz.
:::

Kapsayıcı için tür notasyonları eklemek, Şekil 13-2'deki tanımda gösterilen gibi görünecektir. Bu örnekte, bir kapsayıcı tanımlıyor ve onu, Şekil 13-1'de yaptığımız gibi bir argüman olarak geçtiğimiz noktada tanımlamak yerine bir değişkende saklıyoruz.



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-02/src/main.rs:here}}
```



Tür notasyonları eklendiğinde, kapsayıcı sözdizimi, fonksiyonların sözdizimine daha benzer hale gelir. Burada, parametreine 1 ekleyen bir fonksiyon tanımlıyoruz ve karşılaştırma için aynı davranışı sergileyen bir kapsayıcı tanımlıyoruz. İlgili kısımları hizalamak için alanlar ekledik. Bu, kapsayıcı sözdiziminin, boru kullanımından ve gerekli sözdizimi miktarından başka bir farkın yanı sıra fonksiyon sözdizimiyle benzer olduğunu göstermektedir:

```rust,ignore
fn  add_one_v1   (x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1  ;
```

İlk satır bir fonksiyon tanımını, ikinci satır ise tam olarak notasyon yapılmış bir kapsayıcı tanımını göstermektedir. Üçüncü satırda, kapsayıcı tanımından tür notasyonlarını kaldırıyoruz. Dördüncü satırda ise, kapsayıcı gövdesinde yalnızca bir ifade olduğu için isteğe bağlı olan parantezleri kaldırıyoruz. Çağrıldıklarında aynı davranışları üretecek olan geçerli tanımların hepsi bunlardır. `add_one_v3` ve `add_one_v4` satırları, kapsayıcıların değerlendirilmesi için derlenmeleri gerektiği için, türler kullanımlarından çıkarılacaktır. Bu, `let v = Vec::new();` ifadesinin derleyicinin türü çıkarabilmesi için tür notasyonlarına veya belirli bir türde değerlerin `Vec` içine eklenmesine ihtiyaç duymasıyla benzerdir.

Kapsayıcı tanımları için, derleyici her bir parametreleri ve dönüş değerleri için bir somut tür çıkarır. Örneğin, Şekil 13-3'te yalnızca aldığı değeri döndürdüğü kısa bir kapsayıcının tanımı gösterilmektedir. Bu kapsayıcı, yalnızca bu örneğin amaçları için pek faydalı değildir. Tanımda herhangi bir tür notasyonu eklemediğimizi unutmayın. Tür notasyonu olmadığı için, kapsayıcıyı herhangi bir tür ile çağırabiliriz; burada ilk kez `String` ile yaptık. Ardından `example_closure`'ı bir tamsayı ile çağırmaya çalışırsak, bir hata alırız.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-03/src/main.rs:here}}
```



Derleyici bize bu hatayı verir:

```console
{{#include ../listings/ch13-functional-features/listing-13-03/output.txt}}
```

`String` değer ile ilk kez `example_closure`'ı çağırdığımızda, derleyici `x` türünü ve kapsayıcının dönüş türünü `String` olarak çıkarır. Bu türler, ardından `example_closure` içinde kapsayıcıya kilitlenir ve farklı bir türü aynı kapsayıcı ile kullanmaya çalıştığımızda tür hatası alırız.

---

### Referansları Yakalamak veya Sahipliği Taşımak

Kapsayıcılar, ortamlarından değerleri üç şekilde yakalayabilirler; bu, bir fonksiyonun bir parametre almalarının üç yoluyla doğru biçimde eşleşir: değiştirilemeyen borç alma, değiştirilebilir borç alma ve sahipliği alma. Kapsayıcı, yakalanan değerlerle fonksiyon gövdesinin ne yaptığına bağlı olarak hangisini kullanacaklarını belirler.

Şekil 13-4'te, yalnızca değeri yazdırmak için değiştirilemeyen bir referansa ihtiyaç duyduğu için `list` adındaki diziye değiştirilemeyen bir referans yakalayan bir kapsayıcı tanımlıyoruz:



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-04/src/main.rs}}
```



Bu örnek, bir değişkenin bir kapsayıcı tanımına bağlı olabileceğini ve daha sonra kapsayıcıyı, değişken ismini ve parantezleri kullanarak sanki değişken adı bir fonksiyon adıymış gibi çağırabileceğimizi göstermektedir.

:::warning
`list` üzerinde aynı anda birden fazla değiştirilemeyen referansa sahip olabileceğimiz için, `list`, kapsayıcı tanımından önceki koddan, kapsayıcı tanımının yanındaki koddan ve kapsayıcı çağrıldıktan sonraki koddan erişilebilir.
:::

Bu kod derlenir, çalıştırılır ve aşağıdakileri yazdırır:

```console
{{#include ../listings/ch13-functional-features/listing-13-04/output.txt}}
```

Sonraki adımda, Şekil 13-5'te, kapsayıcı gövdesini `list` dizisine bir eleman ekleyecek şekilde değiştiriyoruz. Kapsayıcı artık bir değiştirilebilir referansı yakalar:



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-05/src/main.rs}}
```



Bu kod derlenir, çalıştırılır ve aşağıdakileri yazdırır:

```console
{{#include ../listings/ch13-functional-features/listing-13-05/output.txt}}
```

Artık `borrows_mutably` kapsayıcısının tanımı ile çağrılması arasında `println!` yoktur: `borrows_mutably` tanımlandığında, `list` üzerinde değiştirilebilir bir referans yakalar. Kapsayıcı çağrıldıktan sonra bir kez daha kapsayıcıyı kullanmadığımız için, değiştirilebilir borç sona erer. Kapsayıcı tanımı ile çağrılması arasında, yalnızca bir yazdırma işlemi olduğu için değiştirilemeyen bir borç verilmez; çünkü değiştirilebilir bir borç olduğunda başka borçlar verilmez. Oraya bir `println!` eklemeyi denerseniz, hangi hata mesajını alabileceğinizi görebilirsiniz!

Kapsayıcının, ortamındaki değerlerin sahipliğini almasını, kapsayıcının gövdesinin sahipliğe sıkı bir şekilde ihtiyaç duymadığı durumlarda zorlamak istiyorsanız, parametreler listesinin önüne `move` anahtar kelimesini ekleyebilirsiniz.

:::danger
Bu teknik, genellikle yeni bir iş parçacığına verileri taşımak için kapsayıcıyı geçirirken kullanışlıdır.
:::

Bu nedenle, veriler yeni iş parçacığına ait olur. İş parçacıkları ve neden onları kullanmak isteyeceğimiz hakkında detayları 16. bölümde eşzamanlılık üzerine konuşurken ele alacağız, ancak şimdilik, `move` anahtar kelimesini gerektiren bir kapsayıcı kullanarak yeni bir iş parçacığı oluşturmaya kısaca göz atalım. Şekil 13-6, Şekil 13-4'ün iş parçacığında bir vektörü yazdırmak için değiştirildiğini göstermektedir:



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-06/src/main.rs}}
```



Yeni bir iş parçacığı başlatıyoruz ve iş parçacığına çalıştırması için bir kapsayıcı veriyoruz. Kapsayıcı gövdesi listeyi yazdırır. Şekil 13-4'te, kapsayıcı yalnızca `list`'i değiştirilemeyen bir referans olarak yakalamıştır, çünkü bunu yazdırmak için gereken en az erişimdir. Bu örnekte, kapsayıcı gövdesi hâlâ yalnızca değiştirilemeyen bir referansa ihtiyaç duyduğunda, kapsayıcı tanımının başına `move` anahtar kelimesini koyarak `list`'in kapsayıcıya taşınmasını belirtmek zorundayız. Yeni iş parçacığı, ana iş parçacığı tamamlanmadan önce sona erebilir veya ana iş parçacığı daha önce tamamlanabilir. Eğer ana iş parçacığı `list`'in sahipliğini sürdürür ancak yeni iş parçacığı bittikten önce sona ererse ve `list`'i bırakırsa, iş parçacığındaki değiştirilemeyen referans geçersiz olur. Bu nedenle, derleyici `list`'in yeni iş parçacığına taşınmasının zorunlu hale gelmesini gerektirir; böylece referans geçerli olacak şekilde. `move` anahtar kelimesini kaldırarak veya kapsayıcı tanımlandıktan sonra `main` iş parçacığında `list`'i kullanarak hangi derleyici hatalarını alacağınızı görmek için deneyin!

### Kapanan Değerleri Kapatmalardan ve `Fn` Özelliklerinden Çıkarma

Bir kapanma, kapanmanın tanımlandığı ortamdan bir değerin sahibini veya bir referansı yakaladıktan sonra (bu durumda, kapanmaya nelerin taşınacağını etkileyerek), kapanmanın gövdesindeki kod, kapanma daha sonra değerlendirildiğinde referanslara veya değerlere ne olacağını tanımlar (bu, kapanmadan nelerin taşınacağını etkileyerek). Bir kapanma gövdesi aşağıdakilerden herhangi birini yapabilir:

- Kapanmadan yakalanan bir değeri çıkarmak
- Yakalanan değeri değiştirmek
- Değeri ne taşıyabilir ne de değiştirmek
- Başlangıçta ortamdan hiçbir şey yakalamamak

:::info
Kapanmanın ortamdan değerleri yakalaması ve işlemesi, kapanmanın hangi özellikleri uyguladığını etkiler ve özellikler, işlevlerin ve yapıların hangi tür kapanmaları kullanabileceğini belirtmek için kullanılır.
:::

Kapanmalar, kapanmanın gövdesinin değerleri nasıl ele aldığınıza bağlı olarak, otomatik olarak bir, iki veya bu üç `Fn` özelliğini ekleyerek uygulayabilir:

1. **`FnOnce`**: Bir kez çağrılabilen kapanmalara uygulanır. Tüm kapanmalar en azından bu özelliği uygular, çünkü tüm kapanmalar çağrılabilir. Kapanmadan yakalanan değerleri gövdesinden çıkaran bir kapanma yalnızca `FnOnce` özelliğini uygular ve diğer `Fn` özelliklerinden hiçbirini uygulamaz, çünkü yalnızca bir kez çağrılabilir.
2. **`FnMut`**: Gövdesinden yakalanan değerleri çıkarmayan ancak yakalanan değerleri değiştirebilecek kapanmalara uygulanır. Bu kapanmalar birden fazla kez çağrılabilir.
3. **`Fn`**: Gövdesinden yakalanan değerleri çıkarmayan ve yakalanan değerleri değiştirmeyen kapanmalara ve ortamlarından hiçbir şey yakalamayan kapanmalara uygulanır. Bu kapanmalar ortamlarını değiştirmeden birden fazla kez çağrılabilir, bu da bir kapanmayı birden fazla kez birbirleriyle eş zamanlı çağırmak gibi durumlarda önemlidir.

### `Option` Üzerindeki `unwrap_or_else` Metodunun Tanımı

Kod örneği:

```rust,ignore
impl<T> Option<T> {
    pub fn unwrap_or_else<F>(self, f: F) -> T
    where
        F: FnOnce() -> T
    {
        match self {
            Some(x) => x,
            None => f(),
        }
    }
}
```

`T`'nin, bir `Option`'ın `Some` varyantındaki değerin türünü temsil eden genel tür olduğunu hatırlayın. Bu `T` türü, `unwrap_or_else` fonksiyonunun dönüş türüdür: örneğin, bir `Option` üzerinde `unwrap_or_else` çağıran kod, bir `String` alır.

:::note
`unwrap_or_else` fonksiyonunun ek bir genel tür parametresi `F` olduğunu not edin. `F` tipi, `unwrap_or_else` çağrıldığında sağladığımız kapanma olan `f` adındaki parametrenin türüdür.
:::

Genel tür `F` üzerindeki sınırlama, `FnOnce() -> T` olup, bu, `F`'nin bir kez çağrılabilmesi, argüman almaması ve `T` döndürmesi gerektiği anlamına gelir. Trait sınırlaması üzerinde `FnOnce` kullanmak, `unwrap_or_else` fonksiyonunun en fazla bir kez `f`'yi çağıracağına dair kısıtlamayı ifade eder. `unwrap_or_else` gövdesinde, `Option`'ın `Some` olması durumunda `f`'nin çağrılmayacağını görebiliriz. `Option` `None` ise, `f` bir kez çağrılacaktır. Tüm kapanmalar `FnOnce`'yi uyguladığı için, `unwrap_or_else` üç tür kapanmayı da kabul eder ve mümkün olduğunca esnektir.

> **Not:** İşlevler de tüm `Fn` özelliklerini uygulayabilir. Ne yapmak istediğimiz, ortamdan bir değeri yakalamayı gerektirmiyorsa, `Fn` özelliklerinden birini uygulayan bir şeye ihtiyaç duyduğumuzda bir kapanma yerine bir işlevin adını kullanabiliriz. Örneğin, bir `Option>` değeri üzerinde, `None` değerini aldığında yeni, boş bir dizi elde etmek için `unwrap_or_else(Vec::new)` çağırabiliriz.

---

Şimdi, dilimlerin üzerinde tanımlı standart kütüphane yöntemi **`sort_by_key`**'ye bakalım, bunun `unwrap_or_else`'den nasıl farklı olduğunu ve neden `sort_by_key` için trait sınırı olarak `FnMut` kullandığını görelim. Kapanma, değerlendirilen dilimdeki mevcut öğeye bir referans şeklinde bir argüman alır ve sıralanabilir bir `K` türünde bir değer döndürür. Bu işlev, her bir öğenin belirli bir niteliğine göre bir dilimi sıralamak istediğinizde yararlıdır. Listing 13-7'de, `Rectangle` örneklerinin bir listesini aldık ve bunları `width` niteliği ile düşükten yükseğe doğru sıralamak için `sort_by_key` kullandık:



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-07/src/main.rs}}
```



Bu kod şu çıktıyı verir:

```console
{{#include ../listings/ch13-functional-features/listing-13-07/output.txt}}
```

:::warning
`sort_by_key`'in bir `FnMut` kapanmasını alacak şekilde tanımlanmasının nedeni, kapanmayı birden fazla kez çağırmasıdır: dilimdeki her bir öğe için bir kez. Kapanma `|r| r.width` ortamdan hiçbir şey yakalamadığı, değiştirmediği veya çıkarmadığı için trait sınırlama gerekliliklerini karşılar.
:::

Buna karşılık, Listing 13-8, sadece `FnOnce` özelliğini uygulayan bir kapanma örneği gösterir, çünkü bu ortamdan bir değeri çıkarır. Derleyici, bu kapanmayı `sort_by_key` ile kullanmamıza izin vermez:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-08/src/main.rs}}
```



Bu, `list`'i sıralarken `sort_by_key`'ın kapanmayı kaç kez çağırdığını saymaya çalışmanın bir çarpıtılmış, karmaşık yoludur (bu çalışmaz). Bu kod, `value`'ı — kapanmanın ortamından bir `String` — `sort_operations` vektörüne iterek bu sayımı yapmayı dener. Kapanma `value`'ı yakalar ve ardından `value`'ın sahipliğini `sort_operations` vektörüne transfer ederek `value`'ı kapanmadan çıkarır. Bu kapanma yalnızca bir kez çağrılabilir; ikinci kez çağırmaya çalışmak işe yaramaz çünkü `value` artık ortamda `sort_operations`'a tekrar itilecek durumda değildir! Bu nedenle, bu kapanma yalnızca `FnOnce`'yi uygular. Bu kodu derlemeye çalıştığımızda, `value`'ın kapanmadan çıkarılamayacağına dair bir hata alırız çünkü kapanmanın `FnMut` özelliğini uygulaması gerekir:

```console
{{#include ../listings/ch13-functional-features/listing-13-08/output.txt}}
```

:::tip
Hata, `value`'ı ortamdan çıkaran kapanma gövdesindeki satıra işaret eder. Bunu düzeltmek için, kapanma gövdesini ortamdan değerleri çıkarmayacak şekilde değiştirmemiz gerekir. Kapanmanın kaç kez çağrıldığını saymanın daha basit bir yolu, ortamda bir sayaç tutmak ve kapanma gövdesinde değerini artırmaktır. Listing 13-9'daki kapanma, `num_sort_operations` sayacına yalnızca değişken bir referans yakaladığı için `sort_by_key` ile çalışır ve bu yüzden birden fazla kez çağrılabilir:
:::


```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-09/src/main.rs}}
```



`Fn` özellikleri, kapanmaları kullanan işlevler veya türler tanımlarken veya kullanırken önemlidir. Bir sonraki bölümde, yineleyicileri tartışacağız. Birçok yineleme yöntemi kapanma argümanları alır, bu nedenle bu kapanma ayrıntılarını unutmadan devam edelim!

[unwrap-or-else]: ../std/option/enum.Option.html#method.unwrap_or_else