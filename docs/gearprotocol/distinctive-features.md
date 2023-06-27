---
sidebar_position: 3
sidebar_label: Gear'ın Ayırt Edici Özellikleri
---
# Gear'ın Ayırt Edici Özellikleri

## Gerçekten merkezi olmayan

Diğer platformların akıllı sözleşmelerinin bilinen bir dezavantajı, kendi işlevlerini tetikleyememeleridir. Bunun yerine, belirli işlevleri çalıştırmak için harici bir bileşene veya hizmete zincir üzerindeki işlemleri tetiklemesini gerektirirler.

Akıllı sözleşme mantığı, bazı durumlarda kullanıcıların işlemleri başlatmasına ve sözleşmeyi etkinleştirmesine dayanabilir, ancak birçok durumda belirli koşulların gerçekleşmesi durumunda bir tetikleyiciye ihtiyaç duyulur, örneğin belirli bir zaman noktasına ulaşmak veya belirli bir olayın gerçekleşmesi gibi. Geçmişte, bu, akıllı sözleşmelerin yeteneklerini sınırlamış veya geliştiricilerin akıllı sözleşmeleri tetiklemek için merkezi bir hizmet tanıtmasını gerektirmiştir.

Gear Protocol'ün asenkron mesajlaşmayı desteklemesi sayesinde, sözleşme geliştiricileri belirli bir süre sonra veya belirli olaylara yanıt olarak sözleşmeyi uyandırabilen gecikmeli mesajlar ile keyfi sözleşme mantığı uygulayabilirler. Bu, akıllı sözleşmeler için çok daha geniş bir kullanım alanı sağlar, yeni merkezi olmayan işlevselliklerin kilidini açar ve blockchain ekosisteminde kullanıcılara daha fazla değer sunar.

## Sürekli mesajlaşma otomasyonu

Gear'da herhangi bir mesajın, sistem mesajlarıdahil olmak üzere, yürütülmesi "gas" tüketir. Gear Protocol, gas rezervasyonum kavramını tanıtır, bu da programlar tarafından daha fazla yürütme için kullanılabilecek gas havuzlarının oluşturulmasına olanak tanır. Her havuz, onu oluşturan programa özgüdür ve havuzdaki gas, programın "gas_available" yeterli değilse program tarafından tüketilebilir.

Gas rezervasyonunun temel faydalarından biri, gelecekte belirli bir zamanda otomatik olarak tetiklenebilen **gecikmeli mesajların** gönderilmesine izin vermesidir. Bu mesajlar, Gear'daki diğer akıllı sözleşmeleri çağırabilir veya kullanıcının posta kutusunda görünebilir şekilde diğer mesajlar gibi başka bir mesajı tetikleyebilir.

Belki de en il

ginç olanı, bir programın kendisine daha sonra bir mesaj göndermesine izin veren gas rezervasyonudur. Bu, bir akıllı sözleşmenin kendisini **sınırsız** sayıda kez yürütmesine olanak sağlar (yeterli gas yürütme için mevcut olduğunda).

Bu, akıllı sözleşmelerde **sürekli mesajlaşma otomasyonu** ile ilgili fonksiyonel mantığın uygulanması için geniş bir olasılık yelpazesi açar. Gecikmeli mesajlar, başka kaynaklar kullanmadan akıllı sözleşmelerde uygulanamayan cron işleri gibi işlevlerdir. Bu çözümün dikkate değer avantajı, dApp'lerde merkezi bileşenlere ihtiyaç duymadan tamamen zincir üzerinde çalışmalarını ve tamamen merkezi olmayan ve özerk olmalarını sağlamasıdır.

## Kullanım Örnekleri

Örneğin, ulaşılabilir hale gelen bazı kullanım örneği örneklerini ele alalım:

### NFT'ler

Benzersiz dijital varlıklar olan Non-Fungible Token'lar (NFT'ler), blockchain ağlarında sahiplik ve ticaret yapılabilen varlıklardır. NFT'lerin temel özelliklerinden biri, koşullara bağlı olarak özelliklerinin değiştirilebilmesidir. Dinamik NFT'ler, sahipleri tarafından hemen veya gecikmeli mesajlar kullanılarak yavaşça güncellenebilir.

Bu, bir NFT'nin fiyatındaki değişikliklere bağlı olarak güncellenmesi durumunda veya oyun uygulamalarında NFT'nin özelliklerinin zaman içinde değişebileceği durumlarda faydalı olabilir.

NFT'lerin güncellenebileceği senaryolar şunları içerir:
- Kullanıcı, NFT'yi hemen güncellemek için bir mesaj gönderebilir.
- NFT sözleşmesi, tokenın özelliklerini düzenli aralıklarla güncellemek için kendisine bir mesaj gönderebilir.
- NFT sözleşmesi, gecikmeli bir mesaj göndererek başka bir aktöre (program veya hesap gibi) mesajın işlenmesi sonucuna göre NFT'nin özelliklerini değiştirebilir.

Genel olarak, NFT'lerin dinamik olarak güncellenmesi, çeşitli uygulamalarda kullanılmak üzere geniş bir olasılık yelpazesi sunar.

### Oyunlar

Tamagotchi, bir dijital evcil hayvan oyunudur ve oyuncuların bir sanal yaratığa yiyecek, ilgi ve diğer bakım formları sağlayarak ona bakmasını gerektirir. Dinamik bir NFT olarak, bir Tam

agotchi, açlık, yorgunluk veya mutluluk gibi özelliklerine bağlı olarak görünümünü değiştirebilir ve beslenme veya oyun oynaması gerektiğinde kullanıcıya bildirim gönderebilir. Kullanıcı, Tamagotchi'nin durumunu güncellemek için gecikmeli mesajlar göndermek için gaz kullanabilir.

"Oyun stratejileri savaşı", farklı algoritmalar veya stratejiler kullanarak birbirleriyle rekabet eden birkaç programa dayanan bir oyundur. Oyun, dama, taş kağıt makas, yarışlar veya monopol gibi çeşitli klasik oyunlara dayanabilir. Her katılımcı, kendi oyun stratejisine sahip bir akıllı sözleşme oluşturur ve bunu blockchain'e yükler. Programlar ardışık olarak birbirleriyle oynarlar ve birisi kazanana kadar veya gaz bitene kadar devam eder. Gaz bitmesi durumunda, katılımcılardan biri daha fazla gaz içeren bir mesaj göndererek oyunu devam ettirebilir. Bu, oyunun en etkili stratejinin sonunda kazanan olarak ortaya çıkmasına izin vererek oyunun sürekli devam etmesini sağlar.

### DeFi

Merkezi olmayan finans (DeFi) uygulamaları, gecikmeli mesajları uygulayarak kullanıcı deneyimini geliştirebilir. Örneğin, kullanıcılar, otomatik piyasa yapıcı (AMM) üzerinde likidite havuzlarına token yatırdıklarında veya ödül kazanmak için stakinge katıldıklarında, kazançlarını manuel olarak talep etmeleri gerekebilir ("yatırım hasadı" olarak bilinir).

Gear Protocol sayesinde kullanıcılar, kazançlarının herhangi bir manuel müdahale olmadan otomatik olarak hesaplarına yatırıldığı bir DeFi deneyiminden faydalanabilirler. Ödüller düzenli olarak toplanır, orijinal havuz varlığı için takas edilir ve bileşik çiftçilik için tekrar yatırılır, bu da kullanıcıların herhangi bir ek eylem yapmadan daha fazla kazanç elde etmelerini sağlar.

Genel olarak, DeFi'de gecikmeli mesajların kullanımı, kullanıcıların ödüllerini kazanmalarını ve DeFi'nin avantajlarından sürekli olarak faydalanmalarını kolaylaştırarak kullanıcı deneyimini büyük ölçüde iyileştirebilir. Bu, DeFi'nin daha geniş bir şekilde benimsenmesine yardımcı olabilir ve sektörde yeni büyüme fırsatları açabilir.