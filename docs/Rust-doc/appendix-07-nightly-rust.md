## Ek G - Rust Nasıl Yapılır ve “Gece Rust”

Bu ek, Rust'ın nasıl yapıldığını ve bunun bir Rust geliştiricisi olarak sizi nasıl etkilediğini anlatmaktadır.

---

### Duraksama Olmadan Kararlılık

Rust, bir dil olarak kodunuzun kararlılığına *çok* önem vermektedir. Rust'ın üstüne inşa edebileceğiniz sağlam bir temel olmasını istiyoruz ve eğer her şey sürekli değişiyorsa, bu imkansız olur. Aynı zamanda, yeni özelliklerle deneme yapamazsak, önemli hataları, artık değiştirilemeyeceği zaman, onların çıkışından sonra öğrenebiliriz.

:::tip
**Rehber İlke:** Stabil Rust'ın yeni bir sürümüne yükseltmekten asla korkmamalısınız. Her yükseltme acısız olmalıdır, ama aynı zamanda size yeni özellikler, daha az hata ve daha hızlı derleme süreleri getirmelidir.
:::

---

### Choo, Choo! Yayın Kanalları ve Trenlere Biniş

Rust geliştirmesi bir *tren takvimine* göre işletilmektedir. Yani, tüm geliştirme Rust deposunun `master` dalında yapılmaktadır. Yayınlar, Cisco IOS ve diğer yazılım projeleri tarafından kullanılan bir yazılım yayın treni modelini takip etmektedir. Rust için üç *yayın kanalı* vardır:

- Gece
- Beta
- Stabil

Çoğu Rust geliştiricisi öncelikle stabil kanalı kullanmaktadır, ancak deneysel yeni özellikleri denemek isteyenler gece veya beta sürümünü kullanabilirler.

:::info
**Örnek:** Rust ekibinin Rust 1.5 sürümünü yayınladığını varsayalım. Bu yayın Aralık 2015'te gerçekleşti, ancak bize gerçekçi sürüm numaraları sağlayacaktır.
:::

Geliştirme ve yayın sürecinin nasıl çalıştığına dair bir örnek: `master` dalına yeni bir commit atıldı. Her gece, Rust'ın yeni bir gece sürümü üretiliyor. Her gün bir yayın günüdür ve bu yayınlar, yayın altyapımız tarafından otomatik olarak oluşturulmaktadır. Zamanla, yayınlarımız her gece şöyle görünmektedir:

```text
gece: * - - * - - *
```

Her altı haftada bir, yeni bir yayının hazırlanma zamanı! Rust deposunun `beta` dalı, gece için kullanılan `master` dalından ayrılır. Artık iki yayın vardır:

```text
gece: * - - * - - *
                      |
beta:                 *
```

Çoğu Rust kullanıcısı beta yayınlarını aktif olarak kullanmaz, ancak Rust'ın olası regresyonları keşfetmesine yardımcı olmak için CI sistemlerinde beta ile test yaparlar. Bu arada, her gece bir gece yayını hala vardır:

```text
gece: * - - * - - * - - * - - *
                      |
beta:                 *
```

Bir regresyon bulunduğunu varsayalım. Regresyonun stabil bir yayına sızmadan önce beta yayınını test etmek için biraz zamanımızın olması iyi bir şey! Düzeltme, `master` dalına uygulanır, böylece gece düzeltildi, ardından düzeltme `beta` dalına geri taşındı ve yeni bir beta yayını üretildi:

```text
gece: * - - * - - * - - * - - * - - *
                      |
beta:                 * - - - - - - - - *
```

İlk beta oluşturulduktan altı hafta sonra, stabil bir yayın zamanı! `stable` dalı, `beta` dalından üretilir:

```text
gece: * - - * - - * - - * - - * - - * - * - *
                      |
beta:                 * - - - - - - - - *
                                        |
stable:                                 *
```

Yaşasın! Rust 1.5 tamamlandı! Ancak unuttuğumuz bir şey var: altı hafta geçtiği için, Rust'ın *bir sonraki* sürümü 1.6'nın yeni bir beta yayınını da almamız gerekiyor. Bu nedenle `stable`, `beta`'dan ayrıldıktan sonra, bir sonraki `beta` sürümü tekrar gece dalından ayrılır:

```text
gece: * - - * - - * - - * - - * - - * - * - *
                      |                         |
beta:                 * - - - - - - - - *       *
                                        |
stable:                                 *
```

Bu, “tren modeli” olarak adlandırılmaktadır çünkü her altı haftada bir, bir yayın “istasyondan kalkmaktadır”, ancak hala stabil bir yayın olarak ulaşmadan önce beta kanalında bir yolculuk yapmak zorundadır.

Rust her altı haftada bir, bir saat gibi yayımlanır. Bir Rust yayınının tarihini biliyorsanız, bir sonraki yayının tarihini de bilirsiniz: altı hafta sonra. Her altı haftada bir planlı yayınların olması güzel bir özelliktir çünkü bir sonraki tren yakında gelmektedir. Eğer bir özellik belirli bir yayını kaçırırsa, endişelenmenize gerek yoktur: kısa bir süre içinde başka bir tane daha olacaktır! Bu, bir yayılma tarihi yaklaşırken olası düzgün olmayan özellikleri gizleme baskısını azaltmaya yardımcı olur.

:::note
Bu süreç sayesinde, her zaman Rust'ın bir sonraki derlemesini kontrol edebilir ve yükseltmenin kolay olduğunu kendiniz doğrulayabilirsiniz: eğer bir beta yayını beklenildiği gibi çalışmıyorsa, ekibe bildirebilir ve bir sonraki stabil yayından önce düzeltilmesini sağlayabilirsiniz!
:::

Beta yayınındaki bozulmalar oldukça nadirdir, ancak `rustc` yine de bir yazılım parçası olduğu için hatalar mevcuttur.

---

### Bakım Zamanı

Rust projesi en son stabil sürümü desteklemektedir. Yeni bir stabil sürüm yayınlandığında, eski sürüm ömrünün sonuna ulaşır (EOL). Bu, her sürümün altı hafta boyunca desteklendiği anlamına gelir.

---

### Stabil Olmayan Özellikler

Bu yayın modelinde bir zorluk daha var: stabil olmayan özellikler. Rust, bir yayında hangi özelliklerin etkin olduğunu belirlemek için “özellik bayrakları” adlı bir teknik kullanmaktadır. Eğer yeni bir özellik aktif bir geliştirme aşamasındaysa, `master` dalına atılır ve dolayısıyla gece sürümünde, fakat bir *özellik bayrağı* arkasında. Eğer siz bir kullanıcı olarak, geliştirilmekte olan bir özelliği denemek isterseniz, gece sürümünü kullanıyor olmalısınız ve kaynak kodunuza uygun bayrak ile not eklemelisiniz.

Bir beta veya stabil Rust sürümünü kullanıyorsanız, hiçbir özellik bayrağı kullanamazsınız. Bu, yeni özelliklerle pratik kullanım elde etmemizi sağlayan anahtardır, onları sonsuza dek stabil hale getirmeden önce. Cesur olmak isteyenler, yeni özelliklere katılabilirken; sağlam bir deneyim isteyenler stabilde kalabilir ve kodlarının bozulmayacağından emin olabilirler. Duraksama olmadan kararlılık.

Bu kitap sadece stabil özellikler hakkında bilgi içermektedir, çünkü geliştirilmekte olan özellikler hala değişmektedir ve kesinlikle bu kitabın yazıldığı zaman ile stabil derlemelerde etkinleştirildiği zaman arasında farklılık göstereceklerdir. Sadece gece sürümleri için belgeler bulabilirsiniz.

---

### Rustup ve Rust Gece Rolü

Rustup, Rust'ın farklı yayın kanalları arasında global veya proje bazında geçiş yapmayı kolaylaştırır. Varsayılan olarak, stabil Rust yüklü olacaktır. Örneğin gece sürümünü yüklemek için:

```console
$ rustup toolchain install nightly
```

Ayrıca, `rustup` ile yüklediğiniz *araç zincirlerinin* (Rust sürümleri ve ilgili bileşenleri) tümünü görebilirsiniz. İşte yazarlarınızdan birinin Windows bilgisayarında bir örnek:

```powershell
> rustup toolchain list
stable-x86_64-pc-windows-msvc (varsayılan)
beta-x86_64-pc-windows-msvc
nightly-x86_64-pc-windows-msvc
```

Gördüğünüz gibi, stabil araç zinciri varsayılan olanıdır. Çoğu Rust kullanıcısı çoğu zaman stabil kullanmaktadır. Çoğu zaman stabil kullanmak isteyebilirsiniz, ancak keskin bir özellik ile ilgilendiğiniz için belirli bir projede gece sürümünü kullanmak isteyebilirsiniz. Bunu yapmak için, o projenin dizininde `rustup override` komutunu kullanarak gece araç zincirini `rustup`'ın bu dizindeyken kullanması gereken zincir olarak belirleyebilirsiniz:

```console
$ cd ~/projects/needs-nightly
$ rustup override set nightly
```

Artık, her `rustc` veya `cargo` çağrısında, *~/projects/needs-nightly* içinde, `rustup` gece Rust'ı, varsayılan stabil Rust yerine kullandığınızdan emin olacaktır. Bu, bir çok Rust projeniz olduğunda faydalıdır!

---

### RFC Süreci ve Takımlar

Peki, bu yeni özellikler hakkında nasıl bilgi alıyorsunuz? Rust’ın geliştirme modeli bir *Yorum Talebi (RFC) sürecini* takip etmektedir. Rust'ta bir iyileştirme istiyorsanız, bir öneri yazabilirsiniz, buna RFC denir.

Herkes Rust'ı geliştirmek için RFC yazabilir ve teklifler Rust ekibi tarafından gözden geçirilir ve tartışılır; bu ekip birçok konu alt takımından oluşmaktadır. Projenin her alanı için takımlar içeren [Rust'ın web sitesinde](https://www.rust-lang.org/governance) bir takım listesi bulunmaktadır: dil tasarımı, derleyici uygulaması, altyapı, dökümantasyon ve daha fazlası. 

:::info
İlgili takım, öneriyi ve yorumları okur, kendi yorumunu yazar ve sonuçta, özelliğin kabul edilmesi veya reddedilmesi için bir fikir birliğine varılır.
:::

Eğer özellik kabul edilirse, Rust deposunda bir sorun açılır ve biri bunu uygulayabilir. Uygulayan kişi, özelliği başlangıçta öneren kişi olmayabilir! Uygulama hazır olduğunda, `master` dalına bir özellik kapısının arkasında eklenir, daha önce `“Stabil Olmayan Özellikler”` bölümünde tartıştığımız gibi.

Bir süre sonra, gece sürümlerini kullanan Rust geliştiricileri yeni özelliği deneyimledikten sonra, ekip üyeleri özelliği tartışacak, gece sürümünde nasıl çalıştığını değerlendirecek ve stabil Rust'a geçip geçmemesi gerektiğine karar verecektir. Karar ilerlemekse, özellik kapısı kaldırılır ve özellik artık stabil olarak kabul edilir! Yeni stabil bir Rust yayınına trenlere biner.