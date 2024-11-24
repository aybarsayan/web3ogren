## `panic!` Yapmak mı Yoksa Yapmamak mı

Peki, `panic!` çağırmanız gerektiğine veya `Result` döndürmeniz gerektiğine nasıl karar verirsiniz? Kod panik yaptığında, geri dönmenin bir yolu yoktur. Geri dönmenin mümkün olduğu her hata durumu için `panic!` çağırabilirsiniz, ancak bu durumda çağıran kod adına bir durumun kurtarılamaz olduğu kararını vermiş olursunuz. Bir `Result` değeri döndürmeyi seçtiğinizde, çağıran koda seçenekler verirsiniz. 

:::tip
**Başarısız olma ihtimali olan bir fonksiyon tanımlarken `Result` döndürmek iyi bir varsayılan seçimdir.**
:::

Çağıran kod, durumuna uygun bir şekilde kurtarma girişiminde bulunmayı seçebilir veya bu durumun bir `Err` değeri olduğunu ve bu nedenle `panic!` çağırarak kurtarılabilir hatanızı kurtarılamaz hale getirebileceğini düşünebilir. 

### Örnekler, Prototip Kodu ve Testler

Bazı kavramları açıklamak için bir örnek yazarken, sağlam hata işleme kodu eklemek örneği daha az anlaşılır hale getirebilir. Örneklerde, panik yaratabilecek bir `unwrap` gibi bir metoda yapılan çağrının, uygulamanızın hataları nasıl ele alması gerektiğini belirtecek bir yer tutucu olarak kullanıldığı anlaşılır; bu, kodunuzun geri kalanına bağlı olarak farklılık gösterebilir.

:::note
**Prototip aşamasında `unwrap` ve `expect` yöntemleri çok kullanışlıdır.**
:::

Hataları nasıl ele alacağınıza karar vermeye hazır olana kadar kullanılırlar. Kodunuzda programınızı daha sağlam hale getirmek üzere hangi aşamada çalışmaya hazır olduğunuzu gösterecek net işaretler bırakırlar. 

Bir testte bir metod çağrısı başarısız olursa, o testin tamamının başarısız olmasını istersiniz, bu metod test altındaki işlevsellik olmasa bile. Çünkü `panic!`, bir testin başarısızlığı olarak işaretlenme şeklidir; dolayısıyla `unwrap` veya `expect` çağırmak tam olarak olması gereken şeydir.

---

### Derleyiciden Daha Fazla Bilgiye Sahip Olduğunuz Durumlar

`Result`’ın bir `Ok` değeri taşıyacağını garanti eden başka bir mantığınız olduğunda `unwrap` veya `expect` çağırmak da uygundur, ancak bu mantık derleyicinin anlayamayacağı bir şeydir. Yine de ele almanız gereken bir `Result` değeri alacaksınız: çağırdığınız her işlem, genel anlamda başarısız olma olasılığı taşır; oysa sizin belirli durumunuzda mantıken imkansız olabilir. 

:::warning
**Kodunuzu manuel olarak inceleyerek asla bir `Err` varyantına sahip olamayacağınızı garanti edebiliyorsanız `unwrap` çağırmak tamamen kabul edilebilir.**
:::

Daha da iyi bir yöntem, `expect` metninde bir `Err` varyantına asla sahib olamayacağını düşündüğünüz nedenleri belgelendirmektir. İşte bir örnek:

```rust
{{#rustdoc_include ../listings/ch09-error-handling/no-listing-08-unwrap-that-cant-fail/src/main.rs:here}}
```

Bir `IpAddr` örneği oluşturuyoruz, sabit bir dizeyi ayrıştırarak. `127.0.0.1` geçerli bir IP adresi olduğu için burada `expect` kullanmak kabul edilebilir. Ancak, sabit bir geçerli dizeye sahip olmak, `parse` metodunun dönüş türünü değiştirmez: hala bir `Result` değeri alırız ve derleyici, bu dize her zaman geçerli bir IP adresi olduğunu görebilecek kadar akıllı olmadığından `Err` varyantının bir olasılık olduğunu düşünmek zorundadır. 

:::info
**Eğer IP adresi dizesi bir kullanıcıdan geliyorsa ve bu nedenle *başarısız olma* olasılığı varsa, durumu daha sağlam bir şekilde ele almak isteyeceğimiz kesin.**
:::

### Hata Yönetimi için İlkeler

Kodunuzun kötü bir duruma düşme olasılığı olduğunda, kodunuzun panik yapması önerilir. Bu bağlamda kötü bir durum, bazı varsayımların, garantilerin, sözleşmelerin veya değişmezlerin bozulması anlamına gelir; örneğin, geçersiz değerler, çelişkili değerler veya kodunuza geçersiz değerlerin geçirilmesidir—buna ek olarak aşağıdakilerden bir veya daha fazlası:

* Kötü durum, muhtemel olarak sıkça meydana gelebilecek bir durumdan ziyade beklenmeyen bir durumdur; örneğin, bir kullanıcıdan yanlış formatta veri girişi yapılması.
* Bu noktadan sonra kodunuzun bu kötü duruma düşmemesi gerekir; sorunu her adımda kontrol etmek yerine.
* Kullandığınız türlerde bu bilgiyi kodlayacak iyi bir yol yoktur. [“Durumları ve Davranışları Türler Olarak Kodlamak”][encoding] bölümünde ne demek istediğimizi bir örnekle açıklayacağız.

:::danger
**Eğer birisi kodunuza geçersiz anlam taşıyan değerler gönderirse, en iyisi bir hata döndürmektir.**
:::

Kod kullanıcı bu durumda ne yapmak istediğine karar verebilir. Ancak, devam etmenin güvensiz veya zararlı olabileceği durumlar söz konusu olduğunda, en iyi seçim `panic!` çağırmak ve kütüphanenizi kullanan kişiyi kodlarındaki hatayı düzeltmeye yönlendirmek olabilir.

Benzer şekilde, dış kontrolünüz dışında olan ve geçersiz bir durum döndüren dış bir kodu çağırıyorsanız, `panic!` sık sık uygundur. 

Ancak, başarısızlığın beklenildiği durumlarda `Result` döndürmek, `panic!` çağırmaktan daha uygundur. Örnekler, bir ayrıştırıcının hatalı veri aldığında veya bir HTTP isteğinin bir durum döndürdüğünde çok yüklenmiş bir duruma girdiğini belirtmektedir. Bu tür durumlarda `Result` döndürmek, başarısızlığın çağıran kod tarafından nasıl ele alınması gerektiğini gösterecek beklenen bir olasılık olduğunu belirtir.

Kodunuz, geçersiz değerlerle çağrıldığında bir kullanıcıyı tehlikeye atma olasılığı taşıyan bir işlem gerçekleştirdiğinde, önce değerlerin geçerli olduğunu doğrulamalı ve değerler geçerli değilse panik yapmalıdır. Bunun başlıca nedeni güvenliktir: geçersiz verilerle işlem yapmak kodunuzu güvenlik açıklarına maruz bırakabilir. Standart kütüphane, bir sınır dışı bellek erişimi gerçekleştirmeye çalıştığında `panic!` çağırır; çünkü mevcut veri yapısına ait olmayan bir belleği erişmeye çalışmak yaygın bir güvenlik sorunudur. Fonksiyonların genellikle *sözleşmeleri* vardır: davranışları yalnızca girdilerin belirli gereklilikleri karşıladığında garanti edilir. 

:::tip
**Sözleşmenin ihlal edildiği durumlarda panik yapmanın mantıklı olduğu, çünkü bir sözleşme ihlali her zaman çağıran tarafın hatasına işaret eder.**
:::

Bu tür bir hatayı çağıran kodun açıkça ele alması istenmez. Aslında, çağıran kodun kurtulması için makul bir yol yoktur; çağıran *programcıların* kodu düzeltmesi gerekir. Bir fonksiyon için sözleşmeler, özellikle bir ihlalin bir paniğe yol açacağı durumlarda, fonksiyonun API belgelerinde açıklanmalıdır.

---

## Geçerlilik için Özel Türler Oluşturma

Şimdi Rust’un tür sistemini geçerli bir değere sahip olmayı sağlamak için bir adım ileriye götürelim ve geçerlilik için özel bir türü inceleyelim. 2. bölümdeki tahmin oyunu belleklerimizde, kodumuzun kullanıcıdan 1 ile 100 arasında bir sayı tahmin etmesini istediğini hatırlayalım. Kullanıcının tahmininin bu sayılar arasında olup olmadığını kontrol etmeden önce yalnızca tahminin pozitif olduğunu doğruladık; bu, durumun sonuçları pek de vahim değildir: “Çok yüksek” veya “Çok düşük” çıktı vermemiz hâlâ doğrudur. 

:::info
**Ancak, kullanıcıyı geçerli tahminler yapmaya yönlendirmek üzere farklı bir davranış sergileyebilmek faydalı bir iyileştirme olacaktır; kullanıcı aralıktan çıkacak bir sayı tahmin ettiğinde veya örneğin harfler yazdığında farklı bir davranış sergileyebiliriz.**
:::

Bunu yapmanın bir yolu, tahmini yalnızca `u32` yerine bir `i32` olarak ayrıştırmak, yani potansiyel olarak negatif sayılara izin vermektir; ardından aşağıdaki gibi bir aralık kontrolü eklemek:



```rust,ignore
{{#rustdoc_include ../listings/ch09-error-handling/no-listing-09-guess-out-of-range/src/main.rs:here}}
```



`if` ifadesi, değerimizin aralıkta olup olmadığını kontrol eder, kullanıcıyı bu sorun hakkında bilgilendirir ve döngünün bir sonraki yinelemesini başlatmak için `continue` çağırır. `if` ifadesinden sonra, artık `guess` ile gizli sayımız arasındaki karşılaştırmalara devam edebiliriz çünkü `guess` artık 1 ile 100 arasında olduğu biliniyor.

Ancak bu ideal bir çözüm değil: eğer programın yalnızca 1 ile 100 arasındaki değerlerle çalışmasının kesinlikle gerekli olduğu ve bu gereksinime sahip birçok fonksiyonu varsa, her fonksiyonda böyle bir kontrol yapmak sıkıcı olacaktır (ve performansı etkileyebilir).

Bunun yerine, yeni bir tür oluşturabilir ve yeniden tekrarlamak yerine türün bir örneğini oluşturmak için bir fonksiyonda geçerlilik kontrollerini yapabiliriz. Bu şekilde, fonksiyonların türü güvenle işaretleyerek yeni türü kullanması ve aldıkları değerleri güvenle kullanması sağlanabilir. Liste 9-13’de, `Guess` türünü tanımlamak için bir yol gösterilmektedir; yalnızca `new` fonksiyonu 1 ile 100 arasında bir değer alıyorsa bir `Guess` örneği oluşturacaktır.



```rust
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-13/src/lib.rs}}
```



Öncelikle, `value` adında bir `i32` tutan alanı olan bir `Guess` adlı bir yapı tanımlıyoruz. Sayının burada saklanması planlanıyor.

Sonra, `Guess` üzerinde `new` adında bir ilişkili fonksiyon uyguluyoruz; bu fonksiyon `Guess` değerlerinin örneklerini oluşturur. `new` fonksiyonu, bir `i32` türünde `value` adında bir parametre alacak şekilde tanımlanır ve bir `Guess` döndürmesi belirtilir. `new` fonksiyonunun gövdesindeki kod, `value`’yi 1 ile 100 arasında olup olmadığını kontrol eder. Eğer `value` bu testi geçmezse, bir `panic!` çağrısı yaparız. 

:::danger
**Bu, çağıran kodu yazan programcıya bir hata olduğunu bildirecektir; çünkü 1 ile 100 arasının dışındaki bir `value` ile bir `Guess` oluşturmak, `Guess::new` fonksiyonunun dayandığı sözleşmeyi ihlal eder.**
:::

`Guess::new`‘nin panik yapabileceği koşullar, kamuya açık API belgesinde tartışılmalıdır; `panic!` olasılığını belirten belgeleri nasıl oluşturacağınız hakkında 14. bölümde bilgi vereceğiz. Eğer `value` testten geçerse, `value` alanını `value` parametesine ayarlayarak yeni bir `Guess` oluştururuz ve `Guess`’i döndürürüz.

Son olarak, `self` nesnesini ödünç alan, başka parametreleri olmayan ve bir `i32` döndüren bir `value` adında bir yöntem uyguluyoruz. Bu tür bir yöntem, alanlarından bazı verileri almak ve döndürmek amacıyla çağrılan *getter* olarak adlandırılır. 

:::tip
**Bu kamuya açık yöntem, `Guess` yapısının `value` alanı özel olduğu için gereklidir.**
:::

`value` alanının özel olması önemlidir; dolayısıyla `Guess` yapısını kullanan kodun, `Guess` örneğini oluşturmak için doğrudan `value`’yi ayarlamasına izin verilmez: modül dışındaki kod, bir `Guess` örneği oluşturmak için `Guess::new` fonksiyonunu kullanmak zorundadır; böylece bir `Guess`’in asla `Guess::new` fonksiyonunun koşullarının kontrol etmediği bir value’ya sahip olması imkânsız hale gelir.

Yalnızca 1 ile 100 arasındaki değerleri alabilecek veya döndürebilecek bir fonksiyon, imzasında bir `Guess` alması veya döndürmesi gerektiğini belirterek, gövdesinde herhangi bir ek kontrol yapmaya ihtiyacı kalmayabilir.

## Özet

Rust’un hata yönetim özellikleri, daha sağlam kod yazmanıza yardımcı olmak için tasarlanmıştır. `panic!` makrosu, programınızın başa çıkamayacağı bir durumda olduğunu işaretler ve geçersiz veya yanlış değerlerle ilerlemeye çalışmak yerine işlemin durmasını sağlar. `Result` enum’u, Rust’un tür sistemini kullanarak işlemlerin başarısız olabileceğini, ancak sizin kodunuzun bu durumdan kurtulabileceğini belirtir. Kodunuzu çağıran kodun, olası başarı veya başarısızlığı ele alması gerektiğini bildirmek için `Result` kullanabilirsiniz. 

:::tip
**`panic!` ve `Result`’ı uygun durumlarda kullanmak, kodunuzu kaçınılmaz sorunlarla karşı karşıya kaldığında daha güvenilir hale getirecektir.**
:::

Artık standart kütüphanenin, `Option` ve `Result` enum’ları ile nasıl generikleri kullandığını gördüğünüze göre, generiklerin nasıl çalıştığını ve kodunuzda nasıl kullanabileceğinizi konuşacağız.

[encoding]: ch18-03-oo-design-patterns.html#encoding-states-and-behavior-as-types