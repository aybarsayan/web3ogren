## Farklı Türdeki Değerler için Trait Nesnelerini Kullanma

Bölüm 8'de, **vektörlerin birden fazla türdeki öğeleri saklayamadığını** belirttik. Listing 8-9'da, tam sayılar, float ve metin tutabilen varyantları olan `SpreadsheetCell` adında bir enum tanımlayarak bir çözüm ürettik. Bu, her hücrede farklı türde verileri saklayabileceğimiz ve hala bir satır hücrelerini temsil eden bir vektöre sahip olabileceğimiz anlamına geliyordu. Kodu derlendiğinde bildiğimiz, sabit bir tür kümesi olduğunda bu mükemmel bir çözümdür.

:::note
Birden fazla veri türüyle çalışırken dikkatli olmak önemlidir.
:::

Ancak bazen kütüphane kullanıcısının belirli bir durumda geçerli türler kümesini genişletebilmesini isteriz. Bunu nasıl başarabileceğimizi göstermek için, her bir öğe üzerinde bir `draw` metodunu çağırarak ekrana çizen bir liste üzerinden yineleyen bir örnek grafik kullanıcı arayüzü (GUI) aracı oluşturacağız - GUI araçları için yaygın bir tekniktir. **`Button`** veya **`TextField`** gibi kullanılabilecek bazı türleri içeren bir GUI kütüphanesi yapısı olan **`gui`** adında bir kütüphane oluşturacağız. Ayrıca, `gui` kullanıcıları kendi çizilebilecek türlerini oluşturmak isteyecekler: örneğin, bir programcı **`Image`** ekleyebilir ve diğeri bir **`SelectBox`** ekleyebilir.

:::tip
Kütüphanenizin genişletilebilirliğini düşünmek, kullanıcıların deneyimini artırır.
:::

Bu örnek için tam gelişmiş bir GUI kütüphanesi uygulamayacağız, ancak parçaların nasıl bir araya geleceğini göstereceğiz. Kütüphaneyi yazarken, diğer programcıların oluşturmak isteyebileceği tüm türleri bilip tanımlayamayız. Ama **`gui`**'nin farklı türde birçok değeri takip etmesi gerektiğini ve bu farklı türdeki her değere **`draw`** metodunu çağırması gerektiğini biliyoruz. Çağırdığımızda **`draw`** metodunun ne olacağını tam olarak bilmesine gerek yok; sadece bu metodun bizim çağırmamız için mevcut olması gerektiğini biliyoruz.

### Ortak Davranış için Bir Trait Tanımlama

`gui`'nin sahip olmasını istediğimiz davranışı uygulamak için, **`draw`** adında bir metoda sahip bir trait tanımlayacağız. Sonra bir *trait nesnesi* alan bir vektör tanımlayabiliriz. Bir trait nesnesi, belirtilen trait'i uygulayan bir tür örneğine ve bu tür üzerinde trait metodlarını çalışma zamanı sırasında aramak için kullanılan bir tabloya işaret eder. Bir trait nesnesi oluşturmak için, bir **`&`** referansı veya bir **`Box`** akıllı işaretçi gibi bir gösterici türü belirtiriz, ardından **`dyn`** anahtar kelimesini ekleriz ve ardından ilgili trait’i belirtiriz. (Trait nesnelerinin neden bir işaretçi kullanması gerektiği hakkında bilgi vereceğiz, Bölüm 20’de [“Daha Dinamik Boyutlu Türler ve `Sized` Trait.”][dynamically-sized] bölümünde.) Trait nesnelerini, bir generik veya somut türün yerine kullanabiliriz. 

:::info
Trait nesnelerini kullanmak, daha esnek kod yazmanıza yardımcı olur.
:::

Bir trait nesnesini kullandığımız her yerden, Rust'un tür sistemi derleme sırasında o bağlamda kullanılan herhangi bir değerin trait nesnesinin trait'ini uyguladığından emin olacaktır. Sonuç olarak, derleme sırasında tüm olası türleri bilmemize gerek yok.

Rust'ta, yapıları ve enum'ları "nesne" olarak adlandırmaktan kaçındığımızı daha önce belirtmiştik; bu, diğer dillerdeki nesnelerden ayırt etmek içindir. Bir yapı veya enum'da, yapı alanlarındaki veriler ile **`impl`** bloklarındaki davranışlar ayrıdır; diğer dillerde ise veriler ve davranışlar bir kavramda birleştirilmiş olup genellikle bir nesne olarak adlandırılır. Ancak trait nesneleri, verileri ve davranışı birleştirdikleri anlamında diğer dillerdeki nesnelere daha çok benzer. Ancak trait nesneleri, verilere ekleme yapamayacağımız açısından geleneksel nesnelerden farklıdır. Trait nesneleri, diğer dillerde nesneler kadar genel olarak faydalı değildir: spesifik amaçları, ortak davranışlar arasında soyutlama sağlamaktır.

Listing 18-3, **`draw`** adında bir metoda sahip **`Draw`** adında bir trait tanımlamanın nasıl olduğunu göstermektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-03/src/lib.rs}}
```



Bu sözdizimi, Bölüm 10'da trait tanımlama hakkında yaptığımız tartışmalardan aşina gelmeli. Şimdi bazı yeni sözdizimi geliyor: Listing 18-4, **`components`** adında bir vektör tutan **`Screen`** adında bir yapı tanımlıyor. Bu vektör, **`Draw`** trait'ini uygulayan bir tür için bir trait nesnesidir; **`Draw`** trait'ini uygulayan herhangi bir tür için **`Box`** içinde duracak bir yer tutucudur.



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-04/src/lib.rs:here}}
```



`Screen` yapısı üzerinde, Listing 18-5'te gösterildiği gibi, her **`components`** öğesi üzerinde **`draw`** metodunu çağıran **`run`** adında bir metod tanımlayacağız:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-05/src/lib.rs:here}}
```



Bu, bir trait sınırlarına sahip generik bir tür parametresi kullanan bir yapıyı tanımlamaktan farklı çalışır. Bir generik tür parametresi yalnızca bir somut türle bir kerede değiştirilirken, trait nesneleri bir trait nesnesi için birden çok somut türün çalışma zamanı sırasında doldurulmasına izin verir. Örneğin, Listing 18-6'da olduğu gibi bir trait sınırı ve generik bir tür kullanarak **`Screen`** yapısını tanımlamış olabilirdik:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-06/src/lib.rs:here}}
```



:::warning
Buradaki yaklaşımın dezavantajı, **`Screen`** üzerinde sadece homojen koleksiyonlar oluşturabilmenizdir.
:::

Diğer taraftan, trait nesnelerini kullanan yöntemle, bir **`Screen`** örneği **`Box`** ile birlikte bir **`Box`** içeren bir **`Vec`** tutabilir. Bunun nasıl çalıştığını inceleyelim ve ardından çalışma zamanı performansı üzerindeki etkilerinden bahsedelim.

### Trait'i Uygulama

Şimdi **`Draw`** trait'ini uygulayan bazı türler ekleyeceğiz. **`Button`** türünü sağlayacağız. Yine, bir GUI kütüphanesinin gerçek uygulaması, bu kitabın kapsamı dışındadır; bu nedenle **`draw`** metodunun gövdesinde herhangi bir kullanışlı uygulama olmayacaktır. Uygulamanın nasıl görünebileceğini hayal etmek için, **`Button`** yapısı **`width`**, **`height`** ve **`label`** alanlarına sahip olabilir, bu Listing 18-7'de gösterilmektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch18-oop/listing-18-07/src/lib.rs:here}}
```



`Button` üzerindeki **`width`**, **`height`** ve **`label`** alanları diğer bileşenlerle farklı olacaktır; örneğin, bir **`TextField`** türünde bu aynı alanlar ile birlikte bir **`placeholder`** alanı bulunabilir. Ekranda çizmek istediğimiz türlerin her biri **`Draw`** trait'ini uygulayacak ancak her birinin **`draw`** metodunda o belirli türü çizmenin nasıl yapılacağını tanımlamak için farklı kodlar olacaktır; **`Button`** burada olduğu gibi (gerçek GUI kodu olmadan, bahsedildiği gibi). Örneğin, **`Button`** türü, kullanıcının butona tıkladığında olanlarla ilgili yöntemler içeren ek bir **`impl`** bloğuna sahip olabilir. Bu çeşit yöntemler, **`TextField`** gibi türlere uygulanmaz.

:::info
Her tür için özelleştirilmiş **`draw`** metodu, kullanıcı deneyimini geliştirebilir.
:::

Kütüphanemizi kullanan birisi, **`width`**, **`height`** ve **`options`** alanlarına sahip **`SelectBox`** yapısını uygulamaya karar verirse, Listing 18-8'de gösterildiği gibi **`SelectBox`** türü üzerinde de **`Draw`** trait'ini uygular:



```rust,ignore
{{#rustdoc_include ../listings/ch18-oop/listing-18-08/src/main.rs:here}}
```



Artık kütüphanemizin kullanıcısı, bir **`Screen`** örneği oluşturmak için kendi **`main`** fonksiyonunu yazabilir. **`Screen`** örneğine, her birini bir trait nesnesi haline getirmek için bir **`Box`** içine koyarak bir **`SelectBox`** ve bir **`Button`** ekleyebilir. Ardından **`Screen`** örneği üzerinde **`run`** metodunu çağırabilirler; bu, her bir bileşen için **`draw`** metodunu çağıracaktır. Listing 18-9 bu uygulamayı göstermektedir:



```rust,ignore
{{#rustdoc_include ../listings/ch18-oop/listing-18-09/src/main.rs:here}}
```



Kütüphaneyi yazarken, birinin **`SelectBox`** türünü ekleyeceğini bilmiyorduk ama **`Screen`** uygulamamız, **`Draw`** trait'ini uyguladığı için yeni tür ile işlem yapabildi ve onu çizebildi; bu, **`draw`** metodunu uygular.

Bir değerin somut türü yerine yalnızca bir değerin yanıt verdiği mesajlarla ilgilenmek, dinamik olarak yazılan dillerdeki *ördek yazımı* kavramına benzer: eğer bir ördek gibi yürüyorsa ve ördek gibi vak vakliyorsa, o zaman o bir ördektir! Listing 18-5'teki **`Screen`** üzerindeki **`run`** metodunun uygulaması, **`run`**'in her bir bileşenin somut türünü bilmesine gerek olmadığını göstermektedir. Bir bileşenin **`Button`** mı yoksa **`SelectBox`** mı olduğunu kontrol etmez, sadece bileşen üzerinde **`draw`** metodunu çağırır. **`components`** vektöründeki değerlerin türünü **`Box`** olarak belirleyerek, **`Screen`** üzerinde **`draw`** metodunu çağırabileceğimiz değerlere ihtiyacımız olduğunu tanımladık.

:::danger
Trait nesnelerini kullanmadan, tür kontrolünü doğru bir şekilde yapmak zordur!
:::

Trait nesnelerini kullanmanın ve Rust'un tür sistemini, ördek yazımına benzer bir kod yazmak için kullanmanın avantajı, çalışma zamanı sırasında bir değerin belirli bir metoda uygulanıp uygulanmadığını kontrol etmemize ya da bir değer bir metodu uygulamıyorsa ve yine de onu çağırmamız durumunda hata almaktan endişelenmememizdir. Rust, değerler belirtilen trait'leri uygulamadığında kodumuzu derlemeyecektir.

Örneğin, Listing 18-10, bir **`Screen`** oluştururken bir bileşen olarak **`String`** kullanmaya çalıştığımızda ne olacağını gösterir:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch18-oop/listing-18-10/src/main.rs}}
```



`String`'in **`Draw`** trait'ini uygulamadığı için bu hatayı alırız:

```console
{{#include ../listings/ch18-oop/listing-18-10/output.txt}}
```

Bu hata, ya **`Screen`**'e geçmesini istemediğimiz bir şey geçtiğimizi ve bu yüzden farklı bir tür geçmemiz gerektiğini ya da **`Screen`**'in bunun üzerinde **`draw`** çağrısı yapabilmesi için **`String`** üzerinde **`Draw`**'i uygulamamız gerektiğini bize bildirir.

### Trait Nesneleri Dinamik Dağıtım Gerçekleştirir

Bölüm 10'daki [“Generikler Kullanarak Kodun Performansı”][performance-of-code-using-generics] kısmında generiklerde trait sınırlarını kullandığımızda derleyici tarafından gerçekleştirilen monomorfizasyon sürecine ilişkin tartışmamızı hatırlayın: Derleyici, generik bir tür parametresi yerine kullandığımız her somut tür için fonksiyon ve metotların genel olmayan uygulamalarını üretir. Monomorfizasyon sonucunda elde edilen kod *statik dağıtım* yapmaktadır; bu, derleyicinin hangi metodu derleme zamanında çağırmanız gerektiğini bildiği zamandır. Bunun zıttı, derleyicinin derleme zamanında hangi metodu çağırdığınızı bilemediği durumlar için *dinamik dağıtım* dır. Dinamik dağıtım durumlarında, derleyici çalışma zamanı sırasında hangi yöntemin çağrılacağını belirleyecek kodu üretir.

Trait nesnelerini kullandığımızda, Rust dinamik dağıtım kullanmak zorundadır. Derleyici, trait nesneleri kullanan kodun hangi türlerin kullanılabileceğini bilmediği için hangi türde tanımlı hangi metodun çağrılacağını bilemez. Bunun yerine, çalışma zamanı sırasında Rust, hangi metodun çağrılacağını bilmek için trait nesnesinin içindeki işaretçileri kullanır. Bu arama, statik dağıtım ile gerçekleşmeyen bir çalışma zamanı maliyeti getirir. Dinamik dağıtım, derleyicinin bir metodun kodunu iç içe geçirme seçiminden kaçınmasına da neden olur; bu da bazı optimizasyonların önüne geçer. Ancak, Listing 18-5'te yazdığımız kodda ekstra bir esneklik elde ettik ve Listing 18-9'da destek gösterebildik, bu yüzden dikkate alınması gereken bir ticaret.

[performance-of-code-using-generics]:
ch10-01-syntax.html#performance-of-code-using-generics
[dynamically-sized]: ch20-04-advanced-types.html#dynamically-sized-types-and-the-sized-trait