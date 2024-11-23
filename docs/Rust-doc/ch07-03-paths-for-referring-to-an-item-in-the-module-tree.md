## Modül Ağacında Bir Öğeye Atıfta Bulunma Yolları

Rust'a bir modül ağacında bir öğeyi nerede bulacağını göstermek için, bir dosya sisteminde gezinirken kullandığımız bir yol gibi bir yol kullanırız. Bir fonksiyonu çağırmak için, onun yolunu bilmemiz gerekir.

Bir yol iki biçim alabilir:

* *Mutlak bir yol*, bir crate kökünden başlayan tam yoldur; bir dış crate'den gelen kod için, mutlak yol crate adıyla başlar, ve mevcut crate'den gelen kod için ise `crate` kelimesiyle başlamaktadır.
* *Göreli bir yol*, mevcut modülden başlar ve `self`, `super` veya mevcut modüldeki bir tanımlayıcıyı kullanır.

Hem mutlak hem de göreli yollar, çift çiftliç (`::`) ile ayrılmış bir veya daha fazla tanımlayıcı ile takip edilir.

:::info
Listeleme 7-1'e geri dönersek, `add_to_waitlist` fonksiyonunu çağırmak istediğimizi varsayalım. Bu, `add_to_waitlist` fonksiyonunun yolu nedir? Listeleme 7-3, bazı modüller ve fonksiyonlar çıkarılarak Listeleme 7-1'i içermektedir.
:::

Yeni bir fonksiyondan, `eat_at_restaurant`, crate kökünde tanımlı olan `add_to_waitlist` fonksiyonunu çağırmanın iki yolunu göstereceğiz. Bu yollar doğrudur, ancak bu örneğin mevcut haliyle derlenmesini engelleyen başka bir sorun vardır. Neden olduğunu birazdan açıklayacağız.

`eat_at_restaurant` fonksiyonu, kütüphane crate'imizin public API'sinin bir parçasıdır, bu yüzden onu `pub` anahtar kelimesi ile işaretliyoruz. [“`pub` Anahtar Kelimesi ile Yolları Açığa Çıkarma”][pub] bölümünde `pub` hakkında daha fazla bilgi vereceğiz.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-03/src/lib.rs}}
```



`add_to_waitlist` fonksiyonunu `eat_at_restaurant` içinde ilk kez çağırdığımızda, bir mutlak yol kullanıyoruz. `add_to_waitlist` fonksiyonu, `eat_at_restaurant` ile aynı crate'de tanımlıdır, bu da mutlak bir yol başlatmak için `crate` anahtar kelimesini kullanabileceğimiz anlamına gelir. Ardından, `add_to_waitlist`'e ulaşıncaya kadar ardışık modüllerin her birini dahil ederiz. Aynı yapıya sahip bir dosya sistemini hayal edebilirsiniz: `add_to_waitlist` programını çalıştırmak için `/front_of_house/hosting/add_to_waitlist` yolunu belirtiriz; crate kökünden başlamak için `crate` adını kullanmak, bir shell'de dosya sistemi kökünden başlamak için `/` kullanmak gibidir.

> **Anahtar Nokta:**
>
> `add_to_waitlist`'i `eat_at_restaurant` içinde ikinci kez çağırdığımızda, bir göreli yol kullanıyoruz. Yol, `eat_at_restaurant` ile aynı modül ağacında tanımlı olan `front_of_house` modülü ile başlıyor. Burada dosya sistemi karşılığı, `front_of_house/hosting/add_to_waitlist` yolunu kullanmaktır. Bir modül adıyla başlamak, yolun göreli olduğunu gösterir.

Göreli veya mutlak bir yol kullanma kararı projenize bağlı olacaktır ve öğe tanım kodunu, öğeyi kullanan koddan ayrı veya beraber taşıma olasılığınıza bağlıdır. Örneğin, `front_of_house` modülünü ve `eat_at_restaurant` fonksiyonunu `customer_experience` adında bir modüle taşırsak, `add_to_waitlist` için mutlak yolun güncellenmesi gerekecektir, ancak göreli yol geçerli kalacaktır. Bununla birlikte, `eat_at_restaurant` fonksiyonunu ayrı bir modül olan `dining`'e taşırsak, `add_to_waitlist` çağrısının mutlak yolu aynı kalacak, ancak göreli yol güncellenmelidir. Genel olarak, kod tanımlarını ve öğe çağrılarını birbirinden bağımsız olarak taşımak isteyeceğimiz için mutlak yolları belirtmeyi tercih ediyoruz.

:::tip
Listing 7-3'ü derlemeye çalışalım ve neden henüz derlenmediğini öğrenelim! Aldığımız hatalar Listing 7-4'te gösterilmektedir.
:::



```console
{{#include ../listings/ch07-managing-growing-projects/listing-07-03/output.txt}}
```



Hata mesajları, `hosting` modülünün özel olduğunu söylüyor. Diğer bir deyişle, `hosting` modülü ve `add_to_waitlist` fonksiyonu için doğru yollarımız var, ancak Rust bunları kullanmamıza izin vermiyor çünkü özel bölümlere erişimi yok. Rust'ta, tüm öğeler (fonksiyonlar, yöntemler, yapılar, enumlar, modüller ve sabitler) varsayılan olarak üst modüllere özeldir. Bir öğeyi, örneğin bir fonksiyon veya yapı, özel hale getirmek istiyorsanız, onu bir modül içinde tanımlarsınız.

:::warning
Bir üst modüldeki öğeler, alt modüllerdeki özel öğeleri kullanamaz, ancak alt modüllerdeki öğeler, ata modüllerdeki öğeleri kullanabilir. Bunun nedeni, alt modüllerin uygulama ayrıntılarını gizlemesi, ancak tanımlandıkları bağlamı görebilmeleridir.
:::

Analojimizi sürdürmek gerekirse, gizlilik kurallarını bir restoranın arka ofisi gibi düşünün: orada geçenler restoran müşterilerine özeldir, ancak ofis yöneticileri, çalıştıkları restorandaki her şeye erişebilir.

Rust, modül sisteminin böyle çalışmasını seçmiştir; böylece, iç uygulama ayrıntılarını gizlemek varsayılan olur. Böylece, iç kodun hangi parçalarını değiştirebileceğinizi bilirsiniz, dış kodu bozmak zorunda kalmazsınız. Ancak Rust, bir öğeyi public yapmak için `pub` anahtar kelimesini kullanarak, alt modüllerin iç bölümlerini dış üst modüllere açma seçeneği verir.

### `pub` Anahtar Kelimesi ile Yolları Açığa Çıkarma

Listing 7-4'te, `hosting` modülünün özel olduğunu belirten hataya geri dönelim. Üst modüldeki `eat_at_restaurant` fonksiyonunun alt modüldeki `add_to_waitlist` fonksiyonuna erişmesini istiyoruz, bu yüzden `hosting` modülünü, Listing 7-5'te gösterildiği gibi `pub` anahtar kelimesi ile işaretliyoruz.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-05/src/lib.rs}}
```



Ne yazık ki, Listing 7-5'teki kod hala derleyici hatalarına neden olmaktadır, Listing 7-6'da gösterildiği gibi.



```console
{{#include ../listings/ch07-managing-growing-projects/listing-07-05/output.txt}}
```



Ne oldu? `mod hosting`'in önüne `pub` anahtar kelimesini eklemek, modülü public hale getirir. Bu değişiklikle, `front_of_house`'a erişebilirsek, `hosting`'e de erişebiliriz. Ancak, `hosting`'in *içeriği* hala özel; modülü public hale getirmek, içeriğini public hale getirmez. Bir modülde bulunan `pub` anahtar kelimesi yalnızca ata modüllerdeki kodun ona atıfta bulunmasına izin verir, iç koduna erişmesine izin vermez. Modüller birer konteyner olduğundan, yalnızca modülün public hale getirilmesiyle pek bir şey yapamayız; daha ileri gitmemiz ve modül içindeki bir veya daha fazla öğeyi public olarak seçmemiz gerekir.

:::note
Listing 7-6'daki hatalar, `add_to_waitlist` fonksiyonunun özel olduğunu belirtir. Gizlilik kuralları, yapılar, enumlar, fonksiyonlar ve yöntemler ile birlikte modüllere de uygulanır.
:::

`add_to_waitlist` fonksiyonunu public hale getirmek için, Listing 7-7'de olduğu gibi tanımının önüne `pub` anahtar kelimesini ekleyelim.



```rust,noplayground,test_harness
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-07/src/lib.rs}}
```



Artık kod derlenecek! `pub` anahtar kelimesini eklemenin, gizlilik kurallarına göre `eat_at_restaurant` içinde bu yolları kullanmamıza nasıl izin verdiğini görmek için, mutlak ve göreli yollara bakalım.

Mutlak yolda, `crate` ile başlıyoruz, crate'imizin modül ağacının kökü. `front_of_house` modülü, crate kökünde tanımlıdır. `front_of_house` public olmamasına rağmen, `eat_at_restaurant` fonksiyonu `front_of_house` ile aynı modülde tanımlandığı için (`eat_at_restaurant` ve `front_of_house` kardeştir), `eat_at_restaurant`'dan `front_of_house`'a atıfta bulunabiliriz. Sonra `pub` ile işaretlenmiş `hosting` modülüne erişiyoruz. `hosting`'in üst modülüne erişebildiğimiz için, `hosting`'e erişebiliriz. Son olarak, `add_to_waitlist` fonksiyonu `pub` ile işaretlenmiştir ve onun üst modülüne erişebiliriz, bu yüzden bu fonksiyon çağrısı çalışır!

:::tip
Göreli yolda, mantık mutlak yol ile aynı, tek fark birinci adım: crate kökünden başlamak yerine, yol `front_of_house` ile başlar. `front_of_house` modülü, `eat_at_restaurant` ile aynı modülde tanımlıdır, bu nedenle `eat_at_restaurant`'ın tanımlandığı modülden başlayan göreli yol çalışır. Ardından, `hosting` ve `add_to_waitlist` `pub` ile işaretlendiği için, yolun geri kalanı çalışır ve bu fonksiyon çağrısı geçerlidir!
:::

Kütüphane crate'inizi diğer projelerle paylaşmayı planlıyorsanız, public API'niz, kodunuzla nasıl etkileşimde bulunabileceklerini belirleyen kullanıcılarınız için bir sözleşmedir. Public API'nizdeki değişiklikleri yönetme ile ilgili birçok husus vardır ve bunlar, crate'iniz üzerinde bağımlı olmayı kolaylaştırmak için tasarlanmıştır. Bu hususlar, bu kitabın kapsamı dışındadır; bu konuyla ilgileniyorsanız, [Rust API Yönergeleri][api-guidelines] adresine bakın.

> #### Binaries ve Library ile Paketler için En İyi Uygulamalar
>
> Bir paketin hem *src/main.rs* binary crate kökü hem de *src/lib.rs* library crate kökü içerebileceğini belirtmiştik ve her iki crate, varsayılan olarak paketin adı ile adlandırılır. Genellikle, bu desenin bir kütüphane ve bir binary crate içeren paketlerinde, binary crate içinde, kütüphane crate'i içinde çağrılan kodu başlatacak kadar yeterli kod bulunur. Bu, diğer projelerin, kütüphane crate'inin sunduğu işlevsellikten faydalanmasını sağlar, çünkü kütüphane crate'inin kodu paylaşılabilir.
>
> Modül ağacı *src/lib.rs* içinde tanımlanmalıdır. Ardından, herhangi bir public öğe, binary crate içinde paketin adıyla başlayarak kullanılabilir. Binary crate, library crate'inin bir kullanıcısı haline gelir tıpkı tamamen dış bir crate'in library crate'ini kullanması gibi: yalnızca public API'yi kullanabilir. Bu, iyi bir API tasarlamanıza yardımcı olur; sadece yazarsınız, aynı zamanda bir müşteri olursunuz!
>
> [Bölüm 12][ch12]'de, hem bir binary crate hem de bir library crate içerecek bir komut satırı programı ile bu organizasyon pratiğini göstereceğiz.

### `super` ile Göreli Yolları Başlatma

Göreli yolları, mevcut modül veya crate kökünden değil, üst modülden başlatarak oluşturabiliriz; yolun başında `super` kullanarak. Bu, bir dosya sistemi yolunu `..` sözdizimi ile başlatmak gibidir. `super` kullanmak, üst modülde olduğunu bildiğimiz bir öğeye atıfta bulunmamızı sağlar, bu da modülü, üst modülle yakın ilişkili olduğunda, modül ağacını yeniden düzenlemeyi kolaylaştırabilir.

:::note
Aşçı bir yanlış siparişi düzeltip şahsen müşteriye götürdüğü durumu modelleyen Listing 7-8'deki kodu düşünün. `back_of_house` modülünde tanımlı olan `fix_incorrect_order` fonksiyonu, `super` ile başlayarak `deliver_order` fonksiyonunu üst modülde çağırır.
:::



```rust,noplayground,test_harness
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-08/src/lib.rs}}
```



`fix_incorrect_order` fonksiyonu `back_of_house` modülündedir, bu yüzden `super` kullanarak `back_of_house`'ın üst modülüne geçebiliriz; bu durumda, üst modül `crate`, kök. Oradan, `deliver_order`'ı ararız ve buluruz. Başarılı olduk! `back_of_house` modülü ile `deliver_order` fonksiyonu arasındaki ilişki başlangıçta kalırsa ve crate'in modül ağacını yeniden düzenlemeye karar verirsek, bu durumda daha az yer güncelleyerek ilerleyebiliriz. Bu yüzden `super` kullandık, böylece gelecekte bu kod başka bir modüle taşınırsa daha az yerde güncelleme yapmamız gerekecek.

### Yapıları ve Enumları Public Yapma

Yapıları ve enumları public olarak belirlemek için `pub` kullanabiliriz, ancak `pub` kullanımında bazı ek detaylar vardır. Bir yapı tanımından önce `pub` kullanırsak, yapıyı public hale getiririz, ancak yapının alanları yine de özel kalır. Her bir alanı durum bazında public yapabiliriz. Listing 7-9'da, public `back_of_house::Breakfast` yapısını, public `toast` alanı ancak özel `seasonal_fruit` alanı ile tanımladık. Bu, bir restoran durumunu modeller; burada müşteri yemeği ile birlikte gelen ekmek türünü seçebilir, ancak şef, mevsim ve stoğa göre hangi meyvenin eşlik edeceğine karar verir. Available fruit değişiyor, bu nedenle müşteriler meyveyi seçemez veya hangi meyveyi alacaklarını göremezler.



```rust,noplayground
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-09/src/lib.rs}}
```



:::tip
`back_of_house::Breakfast` yapısındaki `toast` alanı public olduğundan, `eat_at_restaurant` içinde `toast` alanına nokta notasyonu kullanarak yazabilir ve okuyabiliriz. `seasonal_fruit` alanını `eat_at_restaurant` içinde kullanamayacağımızı unutmayın, çünkü `seasonal_fruit` özeldir. `seasonal_fruit` alanının değerini değiştiren satırı yorumdan çıkararak hangi hatayı aldığınızı görebilirsiniz!
:::

Ayrıca, `back_of_house::Breakfast`'ta özel bir alan olduğundan, yapının `Breakfast` örneğini oluşturan public ilişkili bir işlev sağlaması gerekir (burada `summer` adını verdik). Eğer `Breakfast`’ta böyle bir işlev olmasaydı, `eat_at_restaurant`'da `Breakfast` örneğini oluşturamazdık çünkü `eat_at_restaurant` içinde özel `seasonal_fruit` alanının değerini ayarlayamazdık.

Buna karşın, bir enum'u public yaparsak, tüm varyantları da public olur. Sadece `pub`'ı `enum` anahtar kelimesinin önüne eklememiz yeterlidir, Listing 7-10'da gösterildiği gibi.



```rust,noplayground
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-10/src/lib.rs}}
```



`Appetizer` enum'unu public hale getirdiğimiz için, `eat_at_restaurant` içinde `Soup` ve `Salad` varyantlarını kullanabiliriz.

:::note
Enumlar, varyantları public olmadıkça çok kullanışlı değildir; her durumda tüm enum varyantlarını `pub` ile belgelemek can sıkıcı olurdu, bu yüzden enum varyantları için varsayılan public olmaktır. Yapılar genellikle alanları public olmadan kullanılabilir, bu yüzden yapı alanları varsayılan olarak özel olması kuralını izler.
:::

`pub` ile ilgili ele alınmamış bir durum daha vardır ve bu, modül sistemi özelliğimiz: `use` anahtar kelimesidir. Önce `use`'yi başlı başına ele alacağız ve ardından `pub` ve `use`'yi nasıl birleştireceğimizi göstereceğiz.

[pub]: ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#exposing-paths-with-the-pub-keyword  
[api-guidelines]: https://rust-lang.github.io/api-guidelines/  
[ch12]: ch12-00-an-io-project.html  