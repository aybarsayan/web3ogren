# Giriş

> Not: Bu kitabın bu edisyonu, [No Starch Press][nsp]’ten basılı ve e-kitap formatında mevcut olan [Rust Programlama Dili][nsprust] ile aynıdır.
> — Rust Programlama Dili Edisyon Notu

[nsprust]: https://nostarch.com/rust-programming-language-2nd-edition  
[nsp]: https://nostarch.com/

*Rust Programlama Dili*’ne hoş geldiniz, Rust hakkında bir başlangıç kitabıdır. Rust programlama dili, daha hızlı ve daha güvenilir yazılımlar yazmanıza yardımcı olur. Yüksek düzey ergonomi ile düşük düzey kontrol, genellikle programlama dili tasarımında çelişir; Rust bu çelişkiyi zorlar. Güçlü teknik kapasite ile harika bir geliştirici deneyimini dengeleyerek, Rust'a işletim sistemi ayrıntılarını (örneğin bellek kullanımı) kontrol etme seçeneğini sunar ve bu kontrol ile gelen geleneksel zorlukları ortadan kaldırır.

## Rust Kimin İçin

Rust, çeşitli nedenlerle birçok insana uygun. En önemli gruplardan bazılarına göz atacağız.

### Geliştirici Takımları

Rust, farklı seviyelerde sistem programlama bilgisine sahip büyük geliştirici ekipleri arasında işbirliği için ürün verimli bir araç olduğunu kanıtlıyor. Düşük seviye kod, çoğu diğer dillerde kapsamlı test ve deneyimli geliştiriciler tarafından dikkatli kod incelemesi gerektiren çeşitli ince hatalara açıktır. Rust'ta, derleyici bu kaygan hatalar, özellikle de eşzamanlılık hataları içeren kodu derlemeyi reddederek koruyucu bir rol oynar. Derleyiciyle birlikte çalışarak, ekip programın mantığına odaklanmak için zaman harcayabilir, hataları izlemek yerine.

Rust aynı zamanda sistem programlama dünyasına çağdaş geliştirici araçları getirir:

* Dahil edilen bağımlılık yöneticisi ve derleme aracı **Cargo**, bağımlılıkları eklemeyi, derlemeyi ve yönetmeyi acısız ve Rust ekosisteminde tutarlı hale getirir.
* **Rustfmt** biçimlendirme aracı, geliştiriciler arasında tutarlı bir kodlama stili sağlar.
* **rust-analyzer**, kod tamamlama ve çevrimiçi hata mesajları için Entegre Geliştirme Ortamı (IDE) entegrasyonunu güçlendirir.

:::info
Rust ekosistemindeki bu ve diğer araçları kullanarak, geliştiriciler sistem düzeyinde kod yazarken verimli olabilirler.
:::

### Öğrenciler

Rust, sistem kavramlarını öğrenmekle ilgilenen öğrenciler ve bireyler içindir. Rust kullanarak, birçok kişi işletim sistemleri geliştirme gibi konular hakkında bilgi edinmiştir. Topluluk çok samimi ve öğrenci sorularına yanıt vermekten mutlu. Bu kitabın gibi çabalarla, Rust ekipleri sistem kavramlarını daha erişilebilir hale getirmek istiyor, özellikle programlamaya yeni olanlar için.

### Şirketler

Küçük ve büyük yüzlerce şirket, çeşitli görevler için üretimde Rust kullanmaktadır; bu görevler arasında komut satırı araçları, web hizmetleri, DevOps araçları, gömülü cihazlar, ses ve video analizi ve aktarımı, kripto paralar, biyoenformatik, arama motorları, Nesnelerin İnterneti uygulamaları, makine öğrenimi ve hatta Firefox web tarayıcısının ana parçaları yer alıyor.

### Açık Kaynak Geliştiricileri

Rust, Rust programlama dilini, topluluğunu, geliştirici araçlarını ve kütüphaneleri inşa etmek isteyen kişiler içindir. Rust diline katkıda bulunmanızı isteriz.

### Hız ve Stabiliteyi Değerli Kılanlar

Rust, bir dilde hız ve stabilite arayan insanlar içindir. Hızdan kastımız, Rust kodunun ne kadar hızlı çalışabileceği ve Rust'ın programları yazmanıza ne kadar hızlı izin verdiğidir. Rust derleyicisinin kontrolleri, özellik eklemeleri ve yeniden yapılandırmalar yoluyla stabilite sağlar. Bu, bu kontrollerin olmadığı dillerdeki kırılgan miras kodla zıt olup, geliştiricilerin genellikle değiştirmekten korktuğu durumdur. Sıfır maliyetli soyutlamaları hedefleyerek, daha üst düzey özelliklerin, elle yazılan kod kadar hızlı bir şekilde düşük düzey koduyla derlenmesini sağlayarak, Rust güvenli kodun hızlı kod olarak da olmasını sağlamaya çalışmaktadır.

:::tip
Rust dili, burada bahsedilenler gibi daha pek çok kullanıcıyı desteklemeyi umuyor; bu teslimat yalnızca en büyük paydaşlardan bazıları.
:::

Genel olarak, Rust'ın en büyük amacı, programcıların on yıllardır kabul ettiği değişimi ortadan kaldırarak güvenlik *ve* verimlilik, hız *ve* ergonomi sunmaktır. Rust'ı deneyin ve seçimlerinin sizin için işe yarayıp yaramadığını görün.

## Bu Kitap Kimin İçin

Bu kitap, başka bir programlama dilinde kod yazmış olduğunuzu varsayıyor ancak hangi dil olduğuna dair herhangi bir varsayım yapmıyor. İçeriği çok çeşitli programlama geçmişine sahip olanlar için geniş kapsamlı erişilebilir hale getirmeye çalıştık. Programlamanın ne olduğu ya da nasıl düşünülmesi gerektiği hakkında çok fazla zaman harcamıyoruz. Eğer programlamada tamamen yeniyorsanız, programlamaya özel bir giriş sunan bir kitabı okumanız daha iyi olur.

## Bu Kitabı Nasıl Kullanmalısınız

Genel olarak, bu kitabı önceden arka sıraya doğru ardışık olarak okuyacağınızı varsayıyoruz. Daha sonraki bölümler, önceki bölümlerdeki kavramlara dayanıyor ve önceki bölümler belirli bir konu hakkında detaylara giremeyebilir ama daha sonraki bir bölümde o konuyu tekrar ele alacaktır.

Bu kitapta iki tür bölüm bulacaksınız: kavram bölümleri ve proje bölümleri. Kavram bölümlerinde, Rust’ın bir yönü hakkında bilgi sahibi olacaksınız. Proje bölümlerinde, şimdiye kadar öğrendiklerinizi uygulayarak küçük programlar geliştireceğiz. Bölüm 2, 12 ve 20 proje bölümleridir; diğerleri kavram bölümleridir.

Bölüm 1, Rust'ı nasıl kuracağınızı, "Merhaba, dünya!" programını nasıl yazacağınızı ve Rust’ın paket yöneticisi ve derleme aracı **Cargo**’yu nasıl kullanacağınızı açıklar. Bölüm 2, Rust'ta bir program yazmanın pratik bir tanıtımını sunarak, sıfırdan bir tahmin oyunu geliştirmenizi sağlar. Burada kavramları yüksek seviyede ele alıyoruz ve sonraki bölümler ek detaylar sunacaktır. Hemen parmaklarınızı karıştırmak istiyorsanız, Bölüm 2 bunun için en uygun yer. Bölüm 3, diğer programlama dillerine benzer Rust özelliklerini kapsar ve Bölüm 4’te Rust’ın sahiplik sistemini öğreneceksiniz. Eğer her ayrıntıyı öğrenmeyi tercih eden özellikle titiz bir öğreniciyseniz, Bölüm 2'yi atlayıp doğrudan Bölüm 3'e geçmek isteyebilirsiniz; öğrendiğiniz detayları uygulamak için bir projeyle çalışmak istediğinizde Bölüm 2'ye geri dönebilirsiniz.

Bölüm 5, struct'ları ve yöntemleri tartışır, Bölüm 6 ise enum'lar, `match` ifadeleri ve `if let` kontrol akışı yapılarını kapsar. Rust’ta özel türler oluşturmak için struct ve enum’ları kullanacaksınız.

Bölüm 7, Rust’ın modül sistemini ve kodunuzu düzenlemek ve kamuya açık Uygulama Programlama Arayüzü (API) için gizlilik kurallarını öğrenmenizi sağlar. Bölüm 8, standart kütüphaneler tarafından sağlanan bazı yaygın koleksiyon veri yapıları, örneğin vektörler, dizgiler ve hash haritalarını tartışır. Bölüm 9, Rust’ın hata işleme felsefesi ve tekniklerini araştırır.

Bölüm 10, birden fazla türe uygulanan kodu tanımlama yeteneği veren generics, özellikler ve yaşam süreleri konularına dalar. Bölüm 11, artık Rust’ın güvenlik garantileri ile bile programınızın mantığının doğru olduğunu sağlamak için gerekli olan test etmeye odaklanır. Bölüm 12’de, dosyaların içinde metni arayan `grep` komut satırı aracının işlevselliğinin bir alt kümesini uygulayacağımız kendi uygulamamızı geliştireceğiz. Bunun için, önceki bölümlerde tartıştığımız birçok kavramı kullanacağız.

Bölüm 13, işlevsel programlama dillerinden gelen Rust’ın kapalı ifadelerini ve yineleyicilerini (iterators) keşfeder. Bölüm 14’te Cargo'yu daha derinlemesine inceleyeceğiz ve kütüphanelerinizi başkalarıyla paylaşmak için en iyi uygulamaları konuşacağız. Bölüm 15, standart kütüphanenin sağladığı akıllı işaretçileri ve işlevselliklerini sağlamak için gerekli olan özellikleri tartışır.

Bölüm 16, farklı eşzamanlı programlama modellerini geçirip, Rust’ın çoklu iş parçacıkları ile programlamanızı korkusuzca nasıl desteklediğini konuşacağız. Bölüm 17’de, Rust'ın async ve await sözdizimi ile destekledikleri hafif eşzamanlılık modelinin derinliklerine ineceğiz.

Bölüm 18, Rust deyimlerinin, aşina olabileceğiniz nesne yönelimli programlama ilkeleriyle nasıl karşılaştırıldığını inceler.

Bölüm 19, Rust programları boyunca fikirleri ifade etmenin güçlü yolları olan desenler ve desen eşleştirmeleri üzerine bir referans içermektedir. Bölüm 20, tehlikeli Rust, makrolar ve yaşam süreleri, özellikler, türler, fonksiyonlar ve kapalı ifadeler hakkında daha fazlası gibi ilgi çekici gelişmiş konuların bir potpourrisini içeriyor.

---

Son olarak, bölüm 21'de, düşük seviyeli çok iş parçacıklı bir web sunucusu uygulamak için bir proje tamamlayacağız!

Son olarak, bazı ekler, dile ilişkin faydalı bilgileri daha referans benzeri bir formatta içermektedir. Ek A, Rust'ın anahtar kelimelerini, Ek B, Rust'ın operatörlerini ve sembollerini, Ek C, standart kütüphane tarafından sağlanan türetilebilir özellikleri, Ek D, bazı faydalı geliştirme araçlarını ve Ek E, Rust sürümlerini açıklar. Ek F’de, kitabın çevirilerini bulacak ve Ek G'de Rust’ın nasıl yapıldığı ve gece geç saatlerde Rust’ın ne olduğunu ele alacağız.

:::warning
Bu kitabı okumanın yanlış bir yolu yoktur: Eğer daha ileri gitmek istiyorsanız, gidin! Herhangi bir karışıklık yaşarsanız, önceki bölümlere geri dönmeniz gerekebilir. Ancak sizin için işe yarayan her şeyi yapın.
:::



Rust’ı öğrenme sürecinin önemli bir parçası, derleyicinin görüntülediği hata mesajlarını nasıl okuyacağınızı öğrenmektir: bunlar sizi çalışır kodlara yönlendirecektir. Bu nedenle, derlenmeyen birçok örnek sağlayacak ve her durumda derleyicinin size göstereceği hata mesajını sunacağız. Rasgele bir örneği giriş yapıp çalıştırdığınızda, derlenmeyeceğini unutmayın! Çalıştırmaya çalıştığınız örneğin hata almak amacıyla olduğunu görmek için çevresindeki metni okuduğunuzdan emin olun. Ferris, çalışması amaçlanmayan kodları ayırt etmenize de yardımcı olacaktır:

| Ferris                                                                                                           | Anlam                                          |
|------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| ![](images/rust/img/ferris/does_not_compile.svg)            | Bu kod derlenmiyor!                      |
| ![](images/rust/img/ferris/panics.svg)                   | Bu kod panik yapıyor!                                |
| ![](images/rust/img/ferris/not_desired_behavior.svg) | Bu kod beklenen davranışı üretmiyor. |

Çoğu durumda, derlenmeyen herhangi bir kodun doğru versiyonuna sizi yönlendireceğiz.

## Kaynak Kodu

Bu kitabın oluşturulduğu kaynak dosyaları [GitHub][book]’da bulunabilir.

[book]: https://github.com/rust-lang/book/tree/main/src