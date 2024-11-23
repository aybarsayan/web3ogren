# Akıllı İşaretçiler

Bir *işaretçi*, bellekte bir adres içeren bir değişken için genel bir kavramdır. Bu adres, başka bir veriye atıfta bulunur veya "gösterir". Rust'taki en yaygın işaretçi türü bir referanstır; bu, 4. Bölüm'de öğrendiğiniz bir konu. Referanslar `&` sembolü ile belirtilir ve gösterdikleri değeri ödünç alırlar. 

:::note
Veriye atıfta bulunmanın dışında özel bir yetenekleri yoktur ve herhangi bir ek yükleri yoktur.
:::

Diğer yandan, *akıllı işaretçiler*, bir işaretçi gibi davranan ancak ayrıca ek meta veriler ve yeteneklere sahip olan veri yapılarıdır. Akıllı işaretçi kavramı Rust'a özgü değildir: akıllı işaretçiler C++'da ortaya çıkmış ve diğer dillerde de mevcuttur. Rust, referanslar tarafından sağlanan işlevsellikten daha fazlasını sağlayan standart kütüphanede tanımlanmış çeşitli akıllı işaretçilere sahiptir. 

**Genel kavramı keşfetmek için,** *referans sayımı* akıllı işaretçi türü dahil olmak üzere çeşitli akıllı işaretçi örneklerine bakacağız. Bu işaretçi, verinin birden fazla sahibi olmasına izin vermek için sahiplerin sayısını takip ederek, sahip kalmadığında veriyi temizler.

Rust, sahiplik ve ödünç alma kavramı ile referanslar ve akıllı işaretçiler arasında ek bir fark oluşturur: referanslar yalnızca veriyi ödünç alırken, birçok durumda akıllı işaretçiler gösterdikleri veriyi *sahiplenir*.

O zaman böyle adlandırmasak da, bu kitapta `String` ve `Vec` gibi birkaç akıllı işaretçi ile karşılaştık. Her iki tür de bir miktar belleği sahiplenmeleri nedeniyle akıllı işaretçi olarak sayılır. Ayrıca meta verilere ve ek yetenekler veya garantilere sahiptirler. 

> `String` kapasitesini meta veri olarak saklar ve verisinin her zaman geçerli UTF-8 olmasını sağlama ek yeteneğine sahiptir.  
> — Rust Belgesi

Akıllı işaretçiler genellikle yapı kullanılarak uygulanır. Sıradan bir yapıdan farklı olarak, akıllı işaretçiler `Deref` ve `Drop` özelliklerini uygular. `Deref` özelliği, akıllı işaretçi yapısının bir örneğinin bir referans gibi davranmasını sağlar, böylece kodunuzu hem referanslarla hem de akıllı işaretçilerle çalışacak şekilde yazabilirsiniz. `Drop` özelliği, akıllı işaretçinin bir örneği kapsam dışına çıktığında çalışacak kodu özelleştirmenize olanak tanır. 

:::info
Bu bölümde, her iki özelliği de tartışacak ve akıllı işaretçiler için neden önemli olduklarını göstereceğiz.
:::

Akıllı işaretçi deseninin Rust'ta sık kullanılan genel bir tasarım deseni olduğunu göz önünde bulundurursak, bu bölüm mevcut her akıllı işaretçiyi kapsamayacaktır. Birçok kütüphane kendi akıllı işaretçilerine sahiptir ve hatta kendi akıllı işaretçilerinizi yazabilirsiniz. Standart kütüphanedeki en yaygın akıllı işaretçileri kapsayacağız:

* Yığın üzerinde değer ayırmak için `Box`
* Birden fazla sahipliği sağlayan referans sayım türü `Rc`
* `RefCell` üzerinden erişilen `Ref` ve `RefMut`, derleme zamanı yerine çalışma zamanında ödünç alma kurallarını uygulayan bir tür

Ayrıca, değişmez bir türün içsel bir değeri değiştirmek için bir API sunduğu *içsel değişebilirlik* desenini de ele alacağız. Ayrıca *referans döngüleri* hakkında, bunların belleği nasıl sızdırabileceği ve bunları nasıl önleyebileceğimizi de tartışacağız.

---

Haydi derinlere dalalım!