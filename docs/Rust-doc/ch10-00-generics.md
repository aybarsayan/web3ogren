# Genel Türler, Özellikler ve Ömürler

Her programlama dili, kavramların çoğaltılmasını etkili bir şekilde yönetmek için araçlar sunar. Rust'ta, bunlardan biri **genel türlerdir**: somut türler veya diğer özellikler için soyut yer tutuculardır. Genel türlerin davranışını veya diğer genel türlerle nasıl ilişkili olduğunu, kodu derleyip çalıştırırken yerlerinde ne olacağını bilmeden ifade edebiliriz.

:::tip
Genel türler, kodunuzu daha esnek ve yeniden kullanılabilir hale getirmek için mükemmel bir araçtır.
:::

Fonksiyonlar, somut bir tür olan `i32` veya `String` yerine, bazı genel tür parametreleri alabilir; tıpkı bilinmeyen değerlere sahip parametreler alarak aynı kodu birden fazla somut değer üzerinde çalıştırdıkları gibi. Aslında, genel türleri 6. Bölümde `Option`, 8. Bölümde `Vec` ve `HashMap`, 9. Bölümde ise `Result` ile zaten kullandık. Bu bölümde, kendi türlerinizi, fonksiyonlarınızı ve yöntemlerinizi genel türlerle nasıl tanımlayacağınızı keşfedeceksiniz!

Öncelikle, kod çoğaltımını azaltmak için bir fonksiyonu nasıl çıkaracağımızı gözden geçireceğiz. Ardından, parametre türleri sadece farklı olan iki fonksiyondan genel bir fonksiyon oluşturmak için aynı tekniği kullanacağız. Ayrıca, yapı ve enum tanımlarında genel türleri nasıl kullanacağınızı açıklayacağız.

:::info
Genel türlerle çalıştığınızda, yazdığınız kodun sadece belirli türlere özgü olmadığını ve daha geniş bir alanda kullanılabileceğini unutmayın.
:::

Sonra, **özellikleri** genel bir biçimde davranışı tanımlamak için nasıl kullanacağınızı öğreneceksiniz. Özellikleri genel türlerle birleştirerek, bir genel türü yalnızca belirli bir davranışa sahip türleri kabul edecek şekilde kısıtlayabilirsiniz, bu da herhangi bir türü değil.

Son olarak, **ömürleri** tartışacağız: derleyiciye referansların birbirleriyle nasıl ilişkili olduğu hakkında bilgi veren çeşitli genel türler. Ömürler, derleyiciye ödünç alınan değerler hakkında yeterli bilgi vererek, referansların yardımımız olmadan garanti edilemeyecek kadar daha fazla durumda geçerli olmasını sağlar.

---

## Funksiyonu Çıkararak Çoğaltmayı Kaldırma

Genel türler, belirli türleri birden fazla türü temsil eden bir yer tutucu ile değiştirerek kod çoğaltımını kaldırmamıza olanak tanır. Genel türlerin sözdizimine dalmadan önce, belirli değerleri birden fazla değeri temsil eden bir yer tutucu ile değiştiren bir fonksiyonu çıkararak çoğaltmayı ortadan kaldırmanın bir yoluna bakalım. Ardından, aynı tekniği bir genel fonksiyonu çıkarmak için uygulayacağız! Çıkarabileceğiniz tekrarlanan kodları nasıl tanıyacağınıza bakarak, genel türlerin kullanılabileceği tekrarlanan kodları tanımaya başlayacaksınız.

Liste 10-1'deki en büyük sayıyı bulan kısa program ile başlayacağız.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-01/src/main.rs:here}}
```



`number_list` değişkeninde bir tam sayı listesi saklıyoruz ve listenin ilk sayısına bir referansı `largest` adlı bir değişkende tutuyoruz. Ardından, listenin tüm sayıları arasında döngü yapıyoruz ve eğer mevcut sayı, `largest`'ta saklanan sayıdan büyükse, o değişkendeki referansı değiştiriyoruz. Ancak, mevcut sayı, şimdiye kadar görülen en büyük sayıdan küçük veya eşitse, değişken değişmez ve kod listeki bir sonraki sayıya geçer. Listenin tüm sayılarını göz önünde bulundurduktan sonra, `largest` en büyük sayıyı, bu durumda 100'ü referans almalıdır.

:::note
Unutmayın ki, bu yaklaşım sadece küçük veri setleri için etkili olur ve büyük veri kümeleri için daha verimli çözümler düşünmelisiniz.
:::

Artık bize iki farklı sayı listesinde en büyük sayıyı bulma görevini verdiler. Bunu yapmak için, Liste 10-1'deki kodu çoğaltmayı ve programdaki iki farklı yerde aynı mantığı kullanmayı seçebiliriz; bu da Liste 10-2'de gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-02/src/main.rs}}
```



Bu kod çalışsada, kodu çoğaltmak zahmetli ve hata yapmaya yatkındır. Ayrıca, değiştirmek istediğimizde kodu birçok yerde güncellememiz gerektiğini de hatırlamalıyız.

:::warning
Kodda tekrarı azaltmadığınız takdirde, hata yapma olasılığınız artar ve bakım maliyetleri yükselir.
:::

Bu çoğaltmayı ortadan kaldırmak için, herhangi bir tam sayı listesi üzerinde çalışacak bir fonksiyon tanımlayarak bir soyutlama oluşturacağız. Bu çözüm, kodumuzu daha net hale getirir ve bir listede en büyük sayıyı bulma kavramını soyut bir şekilde ifade etmemizi sağlar.

Liste 10-3'te, en büyük sayıyı bulan kodu `largest` adlı bir fonksiyona çıkarıyoruz. Ardından, Liste 10-2'deki iki listede en büyük sayıyı bulmak için fonksiyonu çağırıyoruz. Ayrıca, gelecekte sahip olabileceğimiz başka bir `i32` değerler listesinde de bu fonksiyonu kullanabiliriz.



```rust
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/listing-10-03/src/main.rs:here}}
```



`largest` fonksiyonu, fonksiyona geçirebileceğimiz herhangi bir somut `i32` değer dilimi temsil eden `list` adlı bir parametreye sahiptir. Sonuç olarak, fonksiyonu çağırdığımızda, kod geçirdiğimiz somut değerler üzerinde çalışır.

:::tip
Soyutlama seviyesini artırdığınızda, uygulamanızın bakımı ve genişletilmesi de o kadar kolaylaşır.
:::

Özetlemek gerekirse, Liste 10-2'den Liste 10-3'e kodu değiştirmek için şu adımları takip ettik:

1. Tekrarlanan kodu tanımlayın.
2. Tekrarlanan kodu, fonksiyonun gövdesine çıkarın ve bu kodun giriş ve dönüş değerlerini fonksiyon imzasında belirtin.
3. Tekrarlanan kodun iki örneğini, fonksiyonu çağıracak şekilde güncelleyin.

Sonra, kod çoğaltımını azaltmak için bu aynı adımları genel türlerle kullanacağız. Fonksiyon gövdesinin belirli değerler yerine soyut bir `list` üzerinde çalışabilmesi gibi, genel türler de kodun soyut türler üzerinde çalışmasına olanak tanır.

:::info
Bu süreç, kodunuzu yeniden kullanabilir ve daha az hata ile bakımını yapabilmenizi sağlar.
:::

Örneğin, `i32` değerleri dilimi içinde en büyük öğeyi bulan bir fonksiyon ve `char` değerleri dilimi içinde en büyük öğeyi bulan bir başka fonksiyonumuz olduğunu varsayalım. O çoğaltmayı nasıl ortadan kaldırırız? Hadi öğrenelim!