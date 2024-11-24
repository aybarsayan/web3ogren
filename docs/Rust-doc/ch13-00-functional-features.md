# Fonksiyonel Dil Özellikleri: İteratörler ve Kapanışlar

Rust'un tasarımı, birçok mevcut dilden ve teknikten ilham almıştır ve bunlar arasında önemli bir etki ***fonksiyonel programlama***dır. Fonksiyonel bir tarzda programlama genellikle değer olarak fonksiyonları kullanmayı, bunları argüman olarak geçirmeyi, diğer fonksiyonlardan döndürmeyi, daha sonraki yürütme için değişkenlere atamayı ve benzeri durumları içerir.

:::info
Fonksiyonel programlama, kodun daha okunabilir ve yeniden kullanılabilir olmasını sağlamak için fonksiyonların kullanımı üzerinde durur.
:::

Bu bölümde, fonksiyonel programlamanın ne olduğu veya ne olmadığı konusunu tartışmayacağız, bunun yerine Rust'un birçok dilde genellikle fonksiyonel olarak adlandırılan dillerle benzer özelliklerinden bazılarını ele alacağız.

Daha spesifik olarak, şunları kapsayacağız:

- Bir değişkende depolayabileceğiniz bir fonksiyon benzeri yapı olan ***Kapanışlar***
- Bir dizi öğeyi işleme yöntemi olan ***İteratörler***
- Bölüm 12'deki I/O projesini geliştirmek için kapanışları ve iteratörleri nasıl kullanacağımız
- Kapanışların ve iteratörlerin performansı (Spoiler: düşündüğünüzden daha hızlılar!)

:::tip
Kapanışlar ve iteratörler, fonksiyonel programlamanın Rust'taki uygulamalarını anlamak için kritik öneme sahiptir.
:::

Daha önce, fonksiyonel tarzdan etkilenen desen eşleştirme ve enumlar gibi diğer Rust özelliklerini de ele aldık. Kapanışları ve iteratörleri ustaca kullanmak, ideomatic, hızlı Rust kodu yazmanın önemli bir parçasıdır, bu nedenle bu tüm bölümü onlara ayıracağız.

---

> **Anahtar Takeaway:** Kapanışlar ve iteratörler, Rust'taki fonksiyonel programlama özelliklerinin temel taşlarıdır.  
> — Rust Belgelendirme Ekibi


Kapanışlar ve İteratörler Hakkında Daha Fazla Bilgi

Kapanışlar, belirli bir kapsamda tanımlandıkları durumların içindeki değişkenleri hafızalarına alabilen fonksiyonlardır. İteratörler ise, verileri sıralı bir şekilde işlemek için kullanılan bir yapıdır. Rust, performansı artırmak için bu yapıların verimli kullanılmasını sağlar.

