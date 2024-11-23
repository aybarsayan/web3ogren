# Blockchain’ların Farkı

Bu bölümde, Ethereum blockchain’i ile TON blockchain’i arasındaki temel farkları inceleyeceğiz. Analiz, ağ mimarilerine genel bir bakış, her birinin benzersiz özelliklerini vurgulama ve avantajlarını ve dezavantajlarını değerlendirme içerecektir.

Ethereum ve TON ekosistemlerine genel bir bakışla, her iki platformun da varlıkları elinde bulunduran ve işlemler yapan kullanıcılar, ağı çalışır durumda ve güvenli tutan doğrulayıcılar ve blockchain’i ürün ve hizmetlerinin temeli olarak kullanan uygulama geliştiricileri dahil olmak üzere benzer bir katılımcı ve hizmet yapısı sunduğunu söyleyebiliriz. 

:::tip
Her iki ekosistem de kullanıcılara varlıkları üzerinde farklı kontrol düzeyleri sağlayan hem bakım hizmetleri hem de kendine ait olmayan hizmetler içermektedir.
:::

Ayrıca, her iki platformun da geliştiricilere güçlü araçlar ve geliştirme standartları sunarak merkeziyetsiz uygulamalar (DApp) oluşturmayı kolaylaştırdığını vurgulamakta fayda var.

Ancak, genel yapı ve sunulan özelliklerdeki benzerliklere rağmen, Ethereum ve TON’un temel teknolojik yönleri ve ağ tasarım yaklaşımları önemli ölçüde farklılık göstermektedir. Bu farklılıklar, geliştiricilerin her bir ağın yeteneklerinden en iyi şekilde yararlanmalarını sağlamak için özellikle önemli olan her bir platformun benzersiz avantajlarının ve sınırlamalarının anlaşılması için bir temel oluşturur. Aşağıdaki alt bölümlerde, bu farklılıkları daha ayrıntılı olarak inceleyecek, ağ mimarisi, modeller, işlem mekanizmaları ve işlem yerleşim sistemine odaklanarak geliştiricilere ihtiyaç duydukları içgörüleri sağlamaya çalışacağız.

## Blockchain’lar Mimarlığı

Ethereum, Bitcoin’in temel ilkelerini devralarak ve genişleterek, geliştiricilere karmaşık merkeziyetsiz uygulamalar (DApp) oluşturmak için gereken esnekliği sağlamıştır. Ethereum'un benzersiz bir özelliği, her bir hesaba bireyselleştirilmiş bir veri deposu sağlamasıdır; bu, işlemlerin yalnızca token transferlerini gerçekleştirmekle kalmayıp, aynı zamanda akıllı sözleşmelerle etkileşimde bulunarak blockchain’in durumunu değiştirmesine olanak tanır. 

:::info
Hesaplar arasında senkron bir etkileşim sağlama yeteneği, uygulama geliştirmesi için büyük bir umut sunar, ancak ölçeklenebilirlik sorununu da gündeme getirir. 
:::

Ethereum ağı üzerindeki her işlem, düğümlerin blockchain’in tam durumunu güncelleyip sürdürmesini gerektirir, bu da önemli gecikmelere yol açar ve ağın kullanımı arttıkça gaz maliyetlerini artırır.

Bu zorluklara yanıt olarak, TON ölçeklenebilirlik ve performansı artırmaya yönelik alternatif bir yaklaşım sunmaktadır. Geliştiricilere çeşitli uygulamalar oluşturmak için maksimum esneklik sağlama hedefiyle tasarlanan TON, blok oluşturma sürecini optimize etmek için shard ve masterchain kavramını kullanmaktadır. 

:::note
Her bir TON shardchain ve masterchain üzerinde, ortalama her 5 saniyede yeni bir blok oluşturulmakta ve hızlı işlem yürütülmektedir.
:::

Ethereum'da durum güncellemeleri senkron bir şekilde yapılırken, TON, akıllı sözleşmeler arasında asenkron mesajlaşma uygulayarak, her bir işlemin bağımsız ve paralel işlenmesine olanak tanır; bu da ağ üzerindeki işlem işlemlerini önemli ölçüde hızlandırır. Kendinizi tanıtmak için bölümler ve makaleler:

* `Shards`
* [Blockchain’ların Karşılaştırılması belgesi](https://ton.org/comparison_of_blockchains.pdf)
* `Blockchain’ların Karşılaştırma tablosu (belgeden çok daha az bilgilendirici ama daha görsel)`

Sonuç olarak, TON ile Ethereum’un mimarisi ve teknolojik temellerini karşılaştırdığımızda, TON’un önemli avantajlar sunduğu açıkça görülmektedir. Asenkron işlem işleme ve benzersiz shard ve masterchain mimarisi ile TON, güvenlik veya merkeziyetçilikten ödün vermeden saniyede milyonlarca işlemi destekleme potansiyelini göstermektedir. Bu, platforma mükemmel bir esneklik ve verimlilik kazandırarak, geniş bir uygulama yelpazesine ideal hale getirmektedir.

## Hesap Tabanlı Model (Ethereum) vs Aktör Modeli (TON)

İlk alt bölümde, Ethereum ve TON’u karşılaştırdık, ana mimari farklarını ve Ethereum’un karşılaştığı başlıca zorlukları vurguladık. Özellikle, bu blockchain’lerde etkileşimlerin düzenlenmesi ve modellerin kullanımı açısından farklı yaklaşımlar dikkat çekici. Bu farklılıklar, her bir platformun benzersiz mimari tercihlerinden kaynaklanmaktadır. Ethereum’a alışık olan geliştiricilerin, TON üzerinde etkili bir şekilde geçiş yapabilmek için bu farklılıkları derinlemesine anlamaları önemlidir. Bu anlayış, şu şekilde olabilir:

> "Mimari, yeni ortamda akıllı sözleşmelerin etkileşimini adapte ve optimize etmesine olanak tanıyacaktır." — Geliştirici Kılavuzu

Şimdi, Ethereum'daki hesap tabanlı modelin nasıl çalıştığını hatırlayalım. Ethereum, bakiyeleri izlemek için bu modeli kullanmaktadır. 

**İki tür hesap vardır:**
- **Dışarıdan yönetilen hesaplar (EOA)** - dışarıdan yönetilen hesaplar, kullanıcının genel ve özel anahtar çiftlerini kullanarak kontrol ettiği hesaplar. Genel anahtar, başkalarının hesaba ödeme göndermesine olanak tanır.
- **Sözleşme hesapları** - özel anahtarlar yerine akıllı sözleşme kodu tarafından kontrol edilir. Bir özel anahtara sahip olmadıkları için sözleşme hesapları kendi başlarına işlemleri başlatamaz.

Bir Ethereum kullanıcısı bir cüzdan oluşturduğunda, ilk işlem çağrıldığında veya ilk fonlar alındığında, dış bir hesap, merkeziyetsiz ağdaki tüm düğümlerde global duruma eklenir. Bir akıllı sözleşme dağıtıldığında, belirli koşullara göre programlı bir şekilde fon depolayıp dağıtabilecek bir sözleşme hesabı oluşturulur. Tüm hesap türlerinin bakiyeleri ve depolama alanları vardır ve diğer hesaplardaki fonksiyonları çağırarak işlemleri tetikleyebilirler. Bu yapı, Ethereum’un programlanabilir para olarak hizmet etme yeteneğini sağlar.

Ethereum, her işlemin sıralı bir şekilde, katı bir sırayla işlendiği senkron işlem işleme mekanizmasına sahiptir. Bu, blockchain’in durumunun tüm katılımcılar için her zaman tutarlı ve öngörülebilir kalmasını sağlar. Tüm işlemler atomiktir; ya tamamen başarılı bir şekilde tamamlanır ya da tamamen başarısız olur ve kısmi veya eksik bir yürütme olmaz.

:::warning
Bir akıllı sözleşme çağrıldığında ve bu sözleşme başka bir akıllı sözleşmeyi çağırdığında, çağrı aynı işlem içinde anında gerçekleşir. Ancak burada yine dezavantajlar vardır; bir işlem, büyümesine izin verildiği kadar büyüyebilir.
:::

Senkronizmin olumsuz bir etkisi, hesaplamaların paralel olarak çalışamamasıdır. Sözleşme ve kullanıcı sayısı arttıkça, hesaplamaların paralelize edilememesi, ağın büyümesinde büyük bir sınırlayıcı faktör haline gelmektedir.

Şimdi aktör modelinin ne olduğunu anlayalım. Aktör modeli, ana unsuru aktör olan paralel ve dağıtık hesaplama için bir yaklaşımdır; aktör, bağımsız bir yürütme kodu bloğudur. İlk olarak küme hesaplamaları için geliştirilen bu model, ölçeklenebilirlik, paralellik ve hata toleransı özellikleri sayesinde modern dağıtık sistemlerin ihtiyaçlarını karşılamak amacıyla mikro sunucu mimarilerinde yaygın olarak kullanılmaktadır. Aktörler, mesaj alır ve işlerler; mesajın mantığına bağlı olarak, yerel değişiklikleri kabul ederek ya da bir eylem gerçekleştirerek yanıt verirler, başka aktörler oluşturabilir ya da mesajları başka yerlere gönderebilirler. 

:::note
Aktörler, iş parçacığı güvenli ve reentrant’tır, kilitlere ihtiyaç duymayı ortadan kaldırır ve görevlerin paralel işlenmesini basitleştirir.
:::

Bu model, ölçeklenebilir ve güvenilir sunucu çözümleri oluşturmak için idealdir; verimli eşzamanlı erişim kontrolü ve hem senkron hem de asenkron mesajlaşma desteği sağlar.

TON’da her şey akıllı sözleşmelerle temsil edilmektedir; bunlar, aktör modeli çerçevesinde de aktör olarak adlandırılabilir. Bir akıllı sözleşme, adres, kod, veri ve bakiye gibi özelliklere sahip bir nesnedir. Verileri saklama yeteneğine sahiptir ve diğer akıllı sözleşmelerden aldığı talimatlara göre davranır. Bir sözleşme, bir mesaj aldığında ve bunu TVM’deki kodunu çalıştırarak işlerken, çeşitli senaryolar gerçekleşebilir:
- Sözleşme özelliklerini `kod, veri, bakiye` değiştirebilir
- Sözleşme isteğe bağlı olarak bir çıkış mesajı üretebilir
- Sözleşme, bir sonraki olay meydana gelene kadar bekleme moduna geçebilir

Scriptlerin sonucu her zaman bir işlem oluşturmadır. İşlemler asenkron olduğundan, sistem, geçmiş işlemlerin tamamlanmasını beklerken diğer işlemleri işlemeye devam edebilir. Bu, karmaşık işlemlerin işlenmesinde daha fazla esneklik sağlar. Bazen tek bir işlem, belirli bir sıralamada gerçekleştirilmesi gereken birden fazla akıllı sözleşme çağrısını gerektirebilir. Bu çağrılar asenkron olduğundan, geliştiriciler, birden fazla eşzamanlı işlemi içerebilecek karmaşık işlem akışlarını daha kolay bir şekilde tasarlayıp uygulayabilirler. 

Ethereum’dan gelen bir geliştiricinin, TON blockchain’indeki akıllı sözleşmelerin yalnızca birbirleriyle asenkron mesajlar göndererek iletişim kurabileceğini anlaması gerekmektedir; bu, bir başka sözleşmeden veri talep etme ihtiyacı olduğunda ve hemen yanıt gerekirse, bunun mümkün olmayacağı anlamına gelmektedir. Bunun yerine `get metodları`, RPC düğümleri gibi Ethereum cüzdanlarında olduğu gibi, ağın dışından istemciler tarafından çağrılmalıdır. 

:::danger
Bu, birkaç nedenle önemli bir kısıtlamadır. Örneğin, flash krediler, bir blok içinde gerçekleştirilmesi gereken işlemlerdir ve aynı işlem içinde borç alma ve geri ödeme yeteneğine bağlıdır; bu, Ethereum’un EVM’inin senkron doğasından faydalanarak kolayca gerçekleştirilebilir, ancak TON’da işlemlerin asenkron doğası nedeniyle bir flash krediyi gerçekleştirmek mümkün değildir.
:::

Ayrıca, akıllı sözleşmelere dış veri sağlayan Oraklar, TON’da daha karmaşık bir tasarım süreci gerektirmektedir. Orakların ne olduğu ve TON’da nasıl kullanılacağı hakkında daha fazla bilgiyi `buradan` bulabilirsiniz.

## Cüzdanların Farkı

Ethereum'da bir kullanıcının cüzdanının, kendine özgü bir ilişki ile adreslerine dayalı olarak üretildiğini daha önce tartıştık; bu, kullanıcılarının genel anahtarları ile olan ilişkisidir. Ancak TON’da tüm cüzdanlar, kullanıcının kendisi tarafından dağıtılması gereken akıllı sözleşmelerdir. 

:::tip
Akıllı sözleşmelerin farklı yollarla yapılandırılabilmesi ve farklı özellikler taşıyabilmesi nedeniyle birden fazla cüzdan versiyonu bulunmaktadır; bunlar hakkında `burada` okuyabilirsiniz.
:::

Cüzdanların akıllı sözleşmeler olması nedeniyle, bir kullanıcının farklı adresler ve başlangıç parametreleri ile birden fazla cüzdanı olabilir. Bir işlem göndermek için, kullanıcı, mesajını özel anahtarı ile imzalamalı ve bunu cüzdan sözleşmesine göndermelidir; bu cüzdan daha sonra bunu belirli bir DApp uygulamasının akıllı sözleşmesine iletecektir. Bu yaklaşım, cüzdan tasarımında esnekliği önemli ölçüde artırır ve geliştiriciler gelecekte cüzdanın yeni versiyonlarını ekleyebilirler. 

Şu anda Ethereum’da geliştiriciler aktif olarak Gnosis gibi çoklu imza cüzdanları (akıllı sözleşmeler) kullanmakta ve ERC-4337 gibi “hesap soyutlamaları” denilen yeni tür cüzdanları tanıtmaya başlamaktadır; burada cüzdanlar, yerel bir token olmadan işlem gönderme, kaybolması durumunda hesap kurtarma gibi işlevsellikler ile doldurulacaktır. Ancak, cüzdan hesaplarının Ethereum’daki EOA’ya kıyasla gaz ücretleri açısından çok daha pahalı olduğunu belirtmek gerekir.

## Mesajlar ve İşlemler

İki sözleşme arasında olan olay bir mesajdır; belirli bir adrese az sayıda token ve keyfi veri gönderilir. Mesaj sözleşmeye ulaştığında, sözleşme kodu tarafından işlenir, sözleşme durumu güncellenir ve isteğe bağlı olarak yeni bir mesaj gönderilir. 

:::info
Bu sözleşmedeki tüm eylemler işlem olarak kaydedilir. 
:::

Bir örnek düşünelim; `A` sözleşmesinden `B` sözleşmesine, `B` sözleşmesinden `C` sözleşmesine bir mesaj zinciri var. O zaman iki mesaj ve üç işlemimiz olacaktır. Ancak, blockchain’in durumunu değiştirmek için dış bir sinyal gerekmektedir. 

Bir akıllı sözleşme çağrısı yapmak için, doğrulayıcılara giden ve onlara akıllı sözleşmeye uygulamaları gereken bir dış mesaj göndermeniz gerekmektedir. Ve önceki alt bölümde tartıştığımız gibi, bir cüzdan bir akıllı sözleşmedir; bu nedenle bu dış mesaj genellikle önce cüzdanın akıllı sözleşmesine gider ve bu ilk işlemi kaydeder ve bu ilk işlem genellikle aslında hedef sözleşmesi için gömülü bir mesaj içerir. Cüzdan akıllı sözleşmesi mesajı aldığında, bu işlemi işler ve hedef sözleşmeye iletir (bu örnekte, `A` cüzdan olabilir ve dış mesajı aldığında ilk işlemi yapacaktır). İşlem sıraları bir zincir oluşturur. Böylece, her akıllı sözleşmenin kendi işlemleri olduğunu görebiliriz; bu, her bir sözleşmenin kendi `küçük blockchain’ine` sahip olduğu anlamına gelir (bunun hakkında daha fazla bilgi için `buraya` göz atabilirsiniz); böylece ağ, işlemleri birbirinden tamamen bağımsız olarak işleyebilir.

## Gaz Sistemi Farkı 

Ethereum'da bir işlemin maliyeti `gaz` ile ölçülmektedir; bu, işlemin gerektirdiği hesaplama kaynaklarının miktarını yansıtır. `Gaz` maliyeti, protokol tarafından belirlenen bir `temel ücret` ve işlemin doğrulayıcılar tarafından işlenmesini hızlandırmak için kullanıcının eklediği bir `öncelik ücreti` olarak ikiye ayrılır. 

:::note
`Toplam ücret` = `kullanılan gaz birimleri` * (`temel ücret` + `öncelik ücreti`) şeklinde olacaktır.
:::

Ayrıca, Ethereum’da depolama esasen ücretsizdir; bu, bir verinin blockchain’e depolandıktan sonra orada tutulması için sürekli bir maliyet bulunmadığı anlamına gelir.

TON’da işlem ücretlerinin hesaplanması karmaşıktır ve akıllı sözleşmelerin blockchain’de depolanması, blockchain’e mesajların aktarılması, sanal makinede kodun çalıştırılması, kod çalıştırıldıktan sonraki işlemlerin işlenmesi ve TON blockchain’inin dışına mesaj gönderilmesi için birkaç tür ücreti içerir. Gaz fiyatı ve diğer bazı parametreler ana ağda oylama ile değiştirilebilir.

:::warning
Ethereum’un aksine, TON kullanıcıları gaz fiyatını kendileri belirleyemezler. Ayrıca, geliştirici, kalan gaz fonlarını sahibi geri iade etmelidir; aksi takdirde bu fonlar kilitli kalır.
:::

Akıllı sözleşme depolamasının kullanımı da fiyatı etkiler: Eğer bir cüzdanın akıllı sözleşmesi uzun bir süre kullanılmazsa, sonraki işlem daha maliyetli olacaktır.