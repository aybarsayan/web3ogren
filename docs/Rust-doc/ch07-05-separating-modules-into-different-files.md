## Modülleri Farklı Dosyalara Ayırma

Şu ana kadar, bu bölümdeki tüm örnekler bir dosyada birden fazla modül tanımladı. Modüller büyüdüğünde, tanımlarını ayrı bir dosyaya taşıyarak kodun daha kolay gezinilebilir hale gelmesini isteyebilirsiniz.

:::note
Örneğin, birden fazla restoran modülüne sahip olan 7-17 numaralı listedeki koddan başlayalım.
:::

Modülleri, tüm modüllerin crate kök dosyasında tanımlanması yerine dosyalara çıkartacağız. Bu durumda crate kök dosyası *src/lib.rs*'dir, ancak bu işlem *src/main.rs* olan ikili crate'ler için de geçerlidir.

Öncelikle `front_of_house` modülünü kendi dosyasına çıkaracağız. `front_of_house` modülündeki süslü parantezler içindeki kodu kaldırarak yalnızca `mod front_of_house;` bildirimini bırakın, böylece *src/lib.rs* 7-21 numaralı listedeki gösterilen kodu içerir. Bu, *src/front_of_house.rs* dosyasını 7-22 numaralı listede oluşturana kadar derlenmeyecektir.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-21-and-22/src/lib.rs}}
```



Sonraki adımda, süslü parantezler içindeki kodu 7-22 numaralı listedeki gibi *src/front_of_house.rs* adlı yeni bir dosyaya yerleştirin. Derleyici, crate kökünde `front_of_house` adıyla modül bildirimine rastladığı için bu dosyada arama yapar.



```rust,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/listing-07-21-and-22/src/front_of_house.rs}}
```



Bir dosyayı modül ağacınızda yalnızca bir kez `mod` bildirimi kullanarak yüklemeniz gerektiğini unutmayın. Derleyici, dosyanın projenin bir parçası olduğunu bilirse (ve `mod` ifadesini nerede koyduğunuz nedeniyle kodun modül ağacındaki konumunu biliyorsa), projenizdeki diğer dosyalar yüklü dosyanın koduna, bildirildiği yerin yolunu kullanarak atıfta bulunmalıdır. Bu durum, “Modül Ağaçlarında Bir Ögeyi Referans Alma Yolları” bölümünde ele alınmıştır. Diğer bir deyişle, `mod` diğer programlama dillerinde gördüğünüz “dahil etme” işlemi değildir.

:::info
Sonraki adımda, `hosting` modülünü kendi dosyasına çıkaracağız. Süreç biraz farklı çünkü `hosting`, kök modülün değil, `front_of_house` modülünün bir alt modülüdür.
:::

`hosting` için dosyayı modül ağacındaki atalarına göre adlandırılacak yeni bir dizin olan *src/front_of_house* içine yerleştireceğiz.

`hosting`'i taşımaya başlamak için *src/front_of_house.rs* dosyasını yalnızca `hosting` modülü bildirimi içerecek şekilde değiştirelim:



```rust,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/no-listing-02-extracting-hosting/src/front_of_house.rs}}
```



Ardından, `hosting` modülünde yapılan tanımları içeren bir *hosting.rs* dosyası oluşturmak için *src/front_of_house* dizinini yaratıyoruz:



```rust,ignore
{{#rustdoc_include ../listings/ch07-managing-growing-projects/no-listing-02-extracting-hosting/src/front_of_house/hosting.rs}}
```



Eğer *hosting.rs* dosyasını *src* dizinine koyarsak, derleyici *hosting.rs* kodunun crate kökünde tanımlanmış bir `hosting` modülünde yer almasını bekleyecektir ve `front_of_house` modülünün çocuğu olarak değil. Derleyicinin hangi dosyaların hangi modüllerin kodunu kontrol edeceği ile ilgili kuralları, dizinlerin ve dosyaların modül ağacına daha yakın bir biçimde eşleşmesini sağlar.

> ### Alternatif Dosya Yolları
>
> Şu ana kadar Rust derleyicisinin kullandığı en idiomatik dosya yollarını ele aldık, ancak Rust ayrıca daha eski bir dosya yolu stilini de desteklemektedir. Crate kökünde tanımlanan `front_of_house` adlı bir modül için derleyici, modülün kodunu şu yerlerde arayacaktır:
>
> * *src/front_of_house.rs* (ele aldığımız kısım)
> * *src/front_of_house/mod.rs* (eski stil, hala desteklenen yol)
>
> `front_of_house`'ın alt modülü olan `hosting` adlı bir modül için derleyici, modülün kodunu şu yerlerde arayacaktır:
>
> * *src/front_of_house/hosting.rs* (ele aldığımız kısım)
> * *src/front_of_house/hosting/mod.rs* (eski stil, hala desteklenen yol)
>
> Aynı modül için her iki stili kullanırsanız derleyici hatası alırsınız. Aynı projedeki farklı modüller için her iki stilin karışık kullanılmasına izin verilir, ancak projenizde gezinirken kafa karıştırıcı olabilir.
>
> *mod.rs* adı verilen dosyaların kullanımındaki ana dezavantaj, projenizin birçok *mod.rs* adlı dosya ile sonuçlanmasıdır; bu da aynı anda editörünüzde açık olduklarında kafa karıştırıcı olabilir.

Her modülün kodunu ayrı bir dosyaya taşıdık ve modül ağacı aynı kaldı. 

> **Key Takeaway**
> `eat_at_restaurant` içindeki işlev çağrıları, tanımlar farklı dosyalarda bulunsa bile herhangi bir değişiklik olmadan çalışacaktır.
> — Rust Docs

:::tip
Bu teknik, modüllerin boyutu büyüdükçe yeni dosyalara taşınmasına olanak tanır.
:::

*src/lib.rs* dosyasındaki `pub use crate::front_of_house::hosting` ifadesinin değişmediğini unutmayın; `use` ifadesi de crate’in bir parçası olarak hangi dosyaların derlendiğine etki etmez. `mod` anahtar kelimesi modülleri tanımlar ve Rust, o modüle ait kodu bulmak için modülün adıyla aynı adı taşıyan bir dosyaya bakar.

## Özet

Rust, bir paketi birden fazla crate'e ve bir crate'i modüllere ayırmanıza olanak tanır, böylece bir modülde tanımlanan ögelere diğer modüllerden atıfta bulunabilirsiniz. Bunu, mutlak veya göreceli yollar belirterek yapabilirsiniz. Bu yollar, belirli bir kapsamda öğenin birden fazla kullanımında daha kısa bir yol kullanabilmeniz için `use` ifadesiyle kapsamınıza alınabilir. Modül kodu varsayılan olarak özel olarak kabul edilir, ancak `pub` anahtar kelimesini ekleyerek tanımlamaları genel hale getirebilirsiniz.

Bir sonraki bölümde, düzenli organizasyonunuzdaki kodda kullanabileceğiniz standart kütüphanedeki bazı koleksiyon veri yapılarını inceleyeceğiz.

[paths]: ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html