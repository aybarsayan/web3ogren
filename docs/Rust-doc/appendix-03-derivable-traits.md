## Ek C: Türetilen Özellikler

Kitabın çeşitli yerlerinde, `derive` niteliğinden bahsettik. Bu niteliği bir yapı veya enum tanımına uygulayabilirsiniz. `derive` niteliği, `derive` sözdizimi ile işaretlediğiniz tür üzerinde varsayılan bir uygulama ile bir özelliği uygulayan kod üretir.

:::info
Bu ekte, `derive` ile kullanabileceğiniz standart kütüphanedeki tüm özelliklerin bir referansını sağlıyoruz.
:::

Her bölüm şunları kapsamaktadır:

* Bu niteliği türetmenin hangi işleçler ve yöntemleri etkinleştireceği
* `derive` tarafından sağlanan niteliğin uygulamasının ne yaptığı
* Niteliğin uygulanmasının tür hakkında ne anlama geldiği
* Niteliği uygulamak için izin verilen veya verilmeyen koşullar
* Niteliği gerektiren işlemlerin örnekleri

Eğer `derive` niteliği tarafından sağlanan davranıştan farklı bir davranış istiyorsanız, her nitelik için detaylı bilgiler için `standart kütüphane belgeleri` ile danışın.

Burada listelenen özellikler, `derive` ile türlerinize uygulanabilen standart kütüphane tarafından tanımlanan tek özelliklerdir. Standart kütüphanede tanımlanan diğer özellikler mantıklı varsayılan bir davranışa sahip değildir; bu nedenle, neyi başarmaya çalıştığınıza uygun bir şekilde uygulamak size kalmıştır.

:::warning
Türetilmesi mümkün olmayan bir nitelik örneği `Display` olup, son kullanıcılar için biçimlendirme sağlar.
:::

Her zaman bir türü son kullanıcıya uygun bir şekilde görüntülemenin en iyi yolunu düşünmelisiniz. Son kullanıcıların görmesine izin verilen türün hangi kısımları var? Hangi kısımlar onların ilgisini çeker? Verilerin hangi biçimi onlara en ilgili olanıdır? Rust derleyicisi bu anlayışa sahip olmadığı için, sizin için uygun varsayılan bir davranış sağlayamaz.

Bu ekte sağlanan türetilebilen özellikler listesi kapsamlı değildir: **kitaplıklar**, kendi özellikleri için `derive` uygulayabilir, bu da `derive` ile kullanabileceğiniz özellikler listesinin gerçekten sonsuz olduğu anlamına gelir. `derive` uygulamak, bir işlevsel makro kullanmayı içerir; bu konu, 20. Bölümdeki [“Makrolar”][macros] kısmında ele alınmıştır.

### `Debug` Programcı Çıktısı için

`Debug` niteliği, format dizelerinde hata ayıklama biçimlendirmesini etkinleştirir; bunu `{}` yer tutucularında `:?` ekleyerek belirtirsiniz.

`Debug` niteliği, bir türün örneklerini hata ayıklama amaçları için yazdırmanıza olanak tanır; böylece siz ve türünüzü kullanan diğer programcılar, bir programın yürütülmesi sırasında belirli bir noktada bir örneği inceleyebilir.

> `Debug` niteliği, örneğin, `assert_eq!` makrosunu kullanırken gereklidir. Bu makro, eşitlik doğrulaması başarısız olursa, argüman olarak verilen örneklerin değerlerini yazdırır; böylece programcılar neden iki örneğin birbirine eşit olmadığını görebilir.  
> — Rust Belgeleri

### `PartialEq` ve `Eq` Eşitlik Karşılaştırmaları için

`PartialEq` niteliği, bir türün örneklerini karşılaştırmanıza ve eşitlik için kontrol etmenize olanak tanır ve `==` ve `!=` işleçlerinin kullanılmasını etkinleştirir.

`PartialEq` türetilmesi, `eq` yöntemini uygular. `PartialEq`, yapılarda türetildiğinde, iki örnek yalnızca *tüm* alanlar eşit olduğunda eşittir ve herhangi bir alan eşit değilse örnekler eşit değildir. Enum'larda türetildiğinde, her varyant kendisiyle eşittir ve diğer varyantlarla eşit değildir.

:::tip
`PartialEq` niteliği, örneğin, türlerin eşitliğini kontrol edebilmek için `assert_eq!` makrosu kullanıldığında gereklidir.
:::

`Eq` niteliğinin herhangi bir yöntemi yoktur. Amacı, işaretlenmiş türün her değeri için değerin kendisiyle eşit olduğunu belirtmektir. `Eq` niteliği yalnızca `PartialEq`'yi de uygulayan türlere uygulanabilir, ancak `PartialEq`'yi uygulayan tüm türler `Eq`'yi uygulayamaz. Bunun bir örneği, not-a-number (`NaN`) değeri olan iki örneğin birbirine eşit olmadığını belirten ondalık sayı türleridir.

> `Eq`nin gerekli olduğu bir örnek, `HashMap` içinde anahtarlar içindir; böylece `HashMap` iki anahtarın aynı olup olmadığını belirleyebilir.  
> — Rust Belgeleri

### `PartialOrd` ve `Ord` Sıralama Karşılaştırmaları için

`PartialOrd` niteliği, bir türün örneklerini sıralama amacıyla karşılaştırmanıza olanak tanır. `PartialOrd`'yi uygulayan bir tür ``, `=` işleçleri ile kullanılabilir. `PartialOrd` niteliğini yalnızca `PartialEq`'yi de uygulayan türlere uygulayabilirsiniz.

`PartialOrd` türetilmesi, verilen değerlerin sıralama üretmediğinde `None` dönen bir `Option` döndüren `partial_cmp` yöntemini uygular. Sıralama üretmeyen bir değer örneği, çoğu değerin karşılaştırılabilir olduğu `NaN` ondalık değeridir. Herhangi bir ondalık sayı ile `NaN` ondalık değeri ile `partial_cmp` çağrıldığında `None` dönecektir.

Yapılarda türetildiğinde, `PartialOrd`, her alanın sırasıyla içindeki değeri karşılaştırarak iki örneği karşılaştırır. Enum'larda türetildiğinde ise, enum tanımında daha önce tanımlanan varyantlar, daha sonra listelenmiş varyantlardan daha küçük kabul edilir.

:::note
`PartialOrd` niteliği, örneğin, belirli bir aralıkta rastgele değer üreten `rand` crate'indeki `gen_range` metodunda gereklidir.
:::

### `Clone` ve `Copy` Değerleri Çoğaltmak için

`Clone` niteliği, bir değerin derin bir kopyasını açıkça oluşturmanıza olanak tanır ve çoğaltma süreci, rastgele kod çalıştırmayı ve yığın verilerini kopyalamayı içerebilir. `Clone` ile ilgili daha fazla bilgi için 4. Bölümdeki [“Değişkenlerin ve Verilerin Etkileşim Yolları: Clone”][ways-variables-and-data-interact-clone] bölümüne bakabilirsiniz.

`Clone` türetilmesi, türetilen türün her bir parçasında `clone` çağrısında bulunan `clone` yöntemini uygular. Bu nedenle, `Clone`'yi türetmek için türdeki tüm alanların veya değerlerin de `Clone` uygulaması gerekir.

:::warning
`Clone`nin gerekli olduğu bir örnek, bir dilim üzerinde `to_vec` metodunu çağırmaktır. 
:::

Dilimi, içinde bulundurduğu tür örneklerini sahiplenmez; ancak `to_vec`'den dönen vektör, örneklerini sahiplenmesi gerektiğinden, `to_vec` her öğe üzerinde `clone` çağrısı yapar. Bu nedenle, dilimde saklanan tür `Clone`'yi uygulamalıdır.

`Copy` niteliği, sadece yığında saklanan bitleri kopyalayarak bir değeri çoğaltmanıza olanak tanır; rastgele kod çalıştırmaya gerek yoktur. `Copy` ile ilgili daha fazla bilgi için 4. Bölümdeki [“Yalnızca Yığın Verileri: Copy”][stack-only-data-copy] bölümüne bakabilirsiniz.

`Copy` niteliği, programcıların bu yöntemleri aşırı yüklemesini ve rastgele kod yürütülmeyeceği varsayımını ihlal etmesini önlemek için yöntem tanımlamaz. Böylece, tüm programcılar bir değerin kopyalanmasının çok hızlı olacağını varsayabilir.

`Copy`yi, tüm parçalarının `Copy` uygulayan herhangi bir türde türetebilirsiniz. `Copy`'yi uygulayan bir tür, ayrıca `Clone`'yi de uygulamalıdır; çünkü `Copy`'yi uygulayan bir tür, `Clone`'nin `Copy` ile aynı görevi yerine getiren önemsiz bir uygulamasına sahiptir.

:::tip
`Copy` niteliği nadiren gereklidir; `Copy`'yi uygulayan türler, `clone`'yi çağırmanıza gerek kalmaksızın optimizasyonlar sunar, bu da kodun daha özlü olmasını sağlar.
:::

`Copy` ile mümkün olan her şeyi `Clone` ile de gerçekleştirebilirsiniz, ancak kod daha yavaş olabilir veya belirli yerlerde `clone` kullanmanız gerekebilir.

### `Hash` Sabit Boyutlu Bir Değere Bir Değeri Haritalamak için

`Hash` niteliği, bir türün rastgele boyutta bir örneğini almanıza ve o örneği sabit boyutta bir değere eşleştirmenize olanak tanır. `Hash` türetilmesi, `hash` yöntemini uygular. `hash` yönteminin türetilmiş uygulaması, tüm alanlarda veya değerlerde `hash` çağırarak elde edilen sonucu birleştirir; bu da `Hash`'yi türetmek için tüm alanların veya değerlerin de `Hash` uygulaması gerektiği anlamına gelir.

:::note
`Hash`nin gerekli olduğu bir örnek, verileri verimli bir şekilde depolamak için bir `HashMap` içindeki anahtarların saklanmasıdır.
:::

### `Default` Varsayılan Değerler için

`Default` niteliği, bir tür için bir varsayılan değer oluşturmanıza olanak tanır. `Default` türetilmesi, `default` işlevini uygular. Türetilmiş `default` işlevinin uygulaması, türün her parçasında `default` işlevini çağırır; bu da `Default`'yi türetmek için türdeki tüm alanların veya değerlerin de `Default` uygulaması gerektiği anlamına gelir.

`Default::default` işlevi genellikle, 5. Bölümde ele alınan [“Başka Örneklerden Yapı Güncelleme Sözdizimi ile Örnekler Oluşturma”][creating-instances-from-other-instances-with-struct-update-syntax] ile yapısal güncelleme sözdizimi ile birlikte kullanılır. Yapının birkaç alanını özelleştirip ardından geri kalan alanlar için varsayılan bir değer ayarlayıp kullanmak için `..Default::default()` kullanabilirsiniz.

:::tip
`Default` niteliği, örneğin, `Option` örneklerinde `unwrap_or_default` metodunu kullandığınızda gereklidir. Eğer `Option` `None` ise, `unwrap_or_default` metodu, `Option` içinde saklanan `T` türü için `Default::default` sonuç döndürecektir.
:::

[creating-instances-from-other-instances-with-struct-update-syntax]:
ch05-01-defining-structs.html#creating-instances-from-other-instances-with-struct-update-syntax
[stack-only-data-copy]:
ch04-01-what-is-ownership.html#stack-only-data-copy
[ways-variables-and-data-interact-clone]:
ch04-01-what-is-ownership.html#ways-variables-and-data-interact-clone
[macros]: ch20-06-macros.html#macros