## Bir Dizi Unsuru ile İteratörler Üzerinde İşlem Yapma

İteratör deseni, bir dizi unsur üzerinde sırayla bir görev gerçekleştirmenizi sağlar. Bir iteratör, her bir element üzerinde yineleme yapma mantığından ve dizinin ne zaman tamamlandığını belirleme sorumluluğuna sahiptir. **İteratörler** kullandığınızda, bu mantığı kendiniz yeniden uygulamak zorunda kalmazsınız.

Rust’ta, iteratörler *tembel*dir; bu, iteratörü tüketen yöntemleri çağırmadığınız sürece hiçbir etkisi olmadığı anlamına gelir. Örneğin, Aşağıdaki Listing 13-10, `v1` vektöründeki unsurlar üzerinde bir iteratör oluşturmak için `Vec` üzerine tanımlı `iter` yöntemini çağırır. Bu kod kendi başına herhangi bir faydalı işlem yapmaz.



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-10/src/main.rs:here}}
```



İteratör, `v1_iter` değişkeninde saklanır. Bir iteratör oluşturduğumuzda, onu çeşitli şekillerde kullanabiliriz. Bölüm 3’teki Listing 3-5’te, bir `for` döngüsü kullanarak bir diziyi yinelemiştik ve her bir öğesi üzerinde bazı kodlar çalıştırmıştık. **Arka planda**, bu açıkça bir iteratör oluşturacak ve sonra tüketecektir, ancak şimdiye kadar bunun nasıl çalıştığını atlamıştık.

Aşağıdaki Listing 13-11’deki örnekte, iteratörün oluşturulması ile `for` döngüsünde iteratörün kullanılması ayrıştırıldı. `v1_iter` içindeki iteratörü kullanarak `for` döngüsü çağrıldığında, iteratördeki her bir eleman, döngünün bir yinelemesinde kullanılır ve her bir değer yazdırılır.



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-11/src/main.rs:here}}
```



:::info
Standart kütüphaneleri tarafından sağlanmayan bir iteratör olmayan dillerde, bu aynı işlevselliği sıfırdan, 0 indeksindeki bir değişkenle başlatarak, o değişkeni vektörün içine bir değer almak için indeksle kullanarak ve değişken değerini döngüde artırarak yazıyor olurdunuz.
:::

**İteratörler**, tüm bu mantığı sizin için yönetir ve potansiyel olarak karışabileceğiniz tekrarlı kodları azaltır. İteratörler, hem veri yapıları (örneğin, vektörler) hem de indeksleyebileceğiniz farklı türden dizilerle aynı mantığı kullanma esnekliği sunar. İteratörlerin bunu nasıl yaptığını inceleyelim.

### `Iterator` Trait’i ve `next` Yöntemi

Tüm iteratörler, standart kütüphanede tanımlı olan `Iterator` adında bir trait’i uygular. Trait’in tanımı şu şekildedir:

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // varsayılan implementasyonları olan metodlar gizlenmiştir
}
```

Bu tanımda bazı yeni sözdizimleri kullanıldığını görün: `type Item` ve `Self::Item`, bu trait ile bir *ilişkili tür* tanımlamaktadır. İlişkili türler konusunda derinlemesine konuşacağız. Şu anda, bu kodun `Iterator` trait’ini uygulamanın, bir `Item` türü tanımlamayı gerektirdiğini ve bu `Item` türünün `next` yönteminin dönüş türünde kullanıldığını bilmeniz yeterlidir. 

> **Not:** Diğer bir deyişle, `Item` türü, iteratörden dönen tür olacaktır.

`Iterator` trait’i yalnızca uygulayıcılardan bir yöntem tanımlamalarını talep eder: `next` yöntemi, iteratörden bir öğeyi bir seferde `Some` içinde döndürür ve yineleme sona erdiğinde `None` döndürür.

İteratörlerde doğrudan `next` yöntemini çağırabiliriz; Listing 13-12, vektörden oluşturulan iteratör üzerindeki `next` çağrılarından hangi değerlerin döndüğünü gösterir.



```rust,noplayground
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-12/src/lib.rs:here}}
```



`v1_iter`’in değiştirilebilir olması gerektiğine dikkat edin: bir iteratör üzerinde `next` yöntemini çağırmak, iteratörün dizideki konumunu takip etmek için kullandığı iç durumu değiştirir. Diğer bir deyişle, bu kod, iteratörü *tüketir*, yani kullanır. `next` çağrısı her seferinde iteratörden bir öğeyi geri alır. `for` döngüsünde `v1_iter`'i kullanırken, döngü, `v1_iter`'in sahipliğini alır ve içten içe değiştirilebilir hale getirir; bu nedenle `v1_iter`'i değiştirilebilir yapmamıza gerek yoktu.

:::warning
Ayrıca, `next` çağrılarından aldığımız değerlerin vektördeki değerlere olan değiştirilemez referanslar olduğunu unutmayın. 
:::

`iter` yöntemi, değiştirilemez referanslar üzerinde bir iteratör üretir. `v1` üzerindeki sahipliği alarak sahip olunan değerleri döndüren bir iteratör oluşturmak istiyorsak, `iter` yerine `into_iter` çağırabiliriz. Benzer şekilde, değiştirilebilir referanslar üzerinde yineleme yapmak istiyorsak, `iter` yerine `iter_mut` çağırabiliriz.

### İteratörü Tüketen Yöntemler

`Iterator` trait’i, standart kütüphane tarafından sağlanan varsayılan implementasyonlara sahip birçok farklı yönteme sahiptir; bu yöntemler hakkında `Iterator` trait’inin standart kütüphane API belgelerine bakarak bilgi edinebilirsiniz. Bu yöntemlerin bazıları, tanımlarında `next` yöntemini çağırır; bu nedenle `Iterator` trait’ini uygularken `next` yöntemini implement etmeniz gerekir.

`next` çağrısı yapan yöntemlere *tüketici adaptörler* denir; çünkü bunları çağırmak iteratörü tüketir. Bir örnek, `sum` yöntemidir; bu yöntem, iteratörün sahipliğini alır ve `next`’i tekrar tekrar çağırarak unsurlar üzerinde yineleme yapar, böylece iteratörü tüketir. Her bir unsuru toplamakta ve yineleme tamamlandığında toplamı geri döndürmektedir. Listing 13-13, `sum` yönteminin bir kullanımını gösteren bir test içermektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-13/src/lib.rs:here}}
```



> 
> **Uyarı:** `sum` metodunu çağırdığımızdan, `v1_iter`'i daha sonra kullanmamıza izin verilmez; `sum`, çağrıldığı iteratörün sahipliğini alır.

### Başka İteratörler Üreten Yöntemler

*İteratör adaptörleri*, iteratörü tüketmeyen `Iterator` trait’inde tanımlanmış yöntemlerdir. Bunun yerine, orijinal iteratörün bazı yönlerini değiştirerek farklı iteratörler üretirler.

Listing 13-14, öğeleri yineleme sırasında her bir öğe için çağrılan bir kapanış (closure) alan `map` iteratör adaptör yönteminin çağrılmasına bir örnek gösterir. `map` yöntemi, değiştirilen unsurları üreten yeni bir iteratör döndürür. Buradaki kapanış, vektördeki her bir öğeyi 1 artırarak yeni bir iteratör oluşturur:



```rust,not_desired_behavior
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-14/src/main.rs:here}}
```



Ancak, bu kod bir uyarı üretir:

```console
{{#include ../listings/ch13-functional-features/listing-13-14/output.txt}}
```

Listing 13-14’teki kod, herhangi bir şey yapmaz; belirtilen kapanış asla çağrılmaz. Uyarı, nedenini hatırlatır: iteratör adaptörleri tembel olduğu için, burada iteratörü tüketmemiz gerekir.

:::danger
Bu uyarıyı düzeltmek ve iteratörü tüketmek için, yinelemenin sonuçlarını bir koleksiyon veri türüne toplamak üzere, Listing 12-1’de `env::args` ile birlikte kullandığımız `collect` yöntemini kullanacağız.
:::

Listing 13-15’te, `map` çağrısının sonucunu yineleme sırasında elde edilen iteratörle bir vektöre topluyoruz. Bu vektör, orijinal vektörden 1 artırılmış her öğeyi içerecektir.



```rust
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-15/src/main.rs:here}}
```



`map` bir kapanış aldığı için, istediğimiz her tür operasyonu her öğe üzerinde gerçekleştirmek için belirtebiliriz. Bu, kapanışların, `Iterator` trait’inin sağladığı yineleme davranışını yeniden kullanırken belirli bir davranışı özelleştirme konusunda nasıl bir kullanıcı dostu örnek olduğunu gösterir.

**Birden fazla iteratör adaptörüne**, okunabilir bir şekilde karmaşık eylemler gerçekleştirmek için zincirleme çağrılar yapabilirsiniz. Ancak, tüm iteratörler tembel olduğundan, iteratör adaptörlerinden sonuç almak için mutlaka bir tüketici adaptör yöntemini çağırmanız gerekir.

### Ortamlarını Yakalama Kapanışları Kullanma

Birçok iteratör adaptörü, kapanışları argüman olarak alır ve genellikle, iteratör adaptörlerine argüman olarak belirteceğimiz kapanışlar, ortamlarını yakalayan kapanışlar olacaktır.

Bu örnekte, bir kapanış alan `filter` yöntemini kullanacağız. Kapanış, iteratörden bir öğe alır ve `bool` döndürür. Kapanış `true` dönerse, değer `filter` tarafından üretilen yinelemede yer alır. Kapanış `false` dönerse, değer dahil edilmez.

Listing 13-16’da, `shoe_size` değişkenini ortamından yakalayan bir kapanış ile `Shoe` yapı örneklerinin koleksiyonu üzerinde yineleme yapmak için `filter` kullanarak yalnızca belirli boyuttaki ayakkabıları döndürüyoruz.



```rust,noplayground
{{#rustdoc_include ../listings/ch13-functional-features/listing-13-16/src/lib.rs}}
```



`shoes_in_size` işlevi, bir ayakkabı vektörüne ve bir ayakkabı boyutuna sahipliği alır. Sadece belirtilen boyuttaki ayakkabıları içeren bir vektör döndürür.

`shoes_in_size` işlevinin gövdesinde, vektörün sahipliğini alan bir iteratör oluşturmak için `into_iter` çağrıyoruz. Ardından, o iteratörü yalnızca kapanışın `true` değerini döndürdüğü öğeleri içeren yeni bir iteratöre uyarlamak için `filter` çağırıyoruz.

Kapanış, ortamdan `shoe_size` parametresini yakalıyor ve her ayakkabının boyutunu bu değerle karşılaştırarak yalnızca belirtilen boyuttaki ayakkabıları koruyor. Son olarak, `collect` çağrısı, uyarlanan iteratörden dönen değerleri bir vektöre toplar ve işlevden döndürülür.

> **Sonuç:** Test, `shoes_in_size` çağrıldığında geri aldığımızın, belirttiğimiz değerle aynı boyutta olan ayakkabılar olduğunu gösterir.