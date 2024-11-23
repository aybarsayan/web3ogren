---
sidebar_position: 2
title: Partner Konfigürasyonu
description: Camino Partner Konfigürasyonu
---

# Camino Partner Konfigürasyonu

:::info TASLAK BELGE UYARISI

Kamino Messenger’ın ilk üretim versiyonunu yayınlamış olsak da, hala erken bir dönemdayız ve partnerlerin önemli işlem trafiği göndermeye ve almaya başlamasıyla işlevselliği eklemeyi ve geliştirmeyi planlıyoruz. Bu nedenle Camino Partner Konfigürasyonu aktif geliştirme aşamasındadır ve içeriğin, yönergelerin ve talimatların değişebileceğini göz önünde bulundurarak düzenli olarak geri kontrol etmenizi öneririz.

:::

## Giriş

Partner Konfigürasyonu, Partnerlerin Camino Ağı’na servis sağlayıcılar olarak kendilerini tanıtmalarına veya ağdaki diğer Partnerlerden hizmet arayışında olmalarına olanak tanır. İki taraf arasındaki talep edilen ve sunulan hizmetlerin eşleşmesi durumunda, bu hizmetler Camino Messenger üzerinde ticareti yapılacaktır.

Hizmetler, Mesaj Türleri kavramı içinde tanımlanmaktadır: mevcut türlerin listesini görmek için  tam belgeleri bulabilirsiniz. Bir dağıtıcı veya tedarikçi olarak, bir Partner genellikle aynı anda birden fazla hizmeti _ve_ sunmak ister.
Örneğin:

Bir konaklama dağıtımcısı, örneğin bir tur operatörü, şu hizmetleri tüketmek isteyebilir:

- AccommodationProductInfoService
- AccommodationProductListService
- AccommodationSearchService
- ValidationService
- MintService

Bir konaklama tedarikçisi, örneğin bir otel zinciri, aynı hizmetleri sunabilir.

Aynı zamanda, tur operatörü bir bilgi sağlayıcısından şu hizmeti tüketmek isteyebilir:

- DestinationInformationService

Bu da tüketicinin etkinlik güncellemelerini almak için bir geri çağırma yöntemini açıklamaya olanak tanır:

- DestinationInformationCallbackService (YAKINDA)

Ve bilgi tedarikçisi de karşılıklı olarak ilgili hizmetleri sunmak/tüketmek zorundadır. Birden fazla hizmet sunmak ve almak isteyen partnerler için işler biraz karmaşıklaşabilir: Camino Vakfı ve topluluk, belirli durumlarınız için en iyi uygulamaları desteklemek ve uygulama konularında yardımcı olmak üzere mevcuttur;  üzerinden bize ulaşabilirsiniz.

## Aktörler ve Bileşenler

Bir Partnerin nasıl konfigüre edileceğine dair ayrıntılara girmeden önce, ilgili aktörlerin (insan ve yazılım bileşenleri, zincir üzeri ve zincir dışı) ve bu aktörlerin Camino Messenger üzerindeki Partner operasyonundaki özel sorumluluklarını açıklamak faydalı olacaktır.

```mermaid
graph TD
    CFO([CFO]) --> |owns| FinanceWallet
    CTO([Teknik Güç Kullanıcısı]) --> |owns| TechWallet
    CTO --> |deploys| Bot1
    CTO --> |deploys| Bot2
    CTO --> |owns| Bot1Wallet
    CTO --> |owns| Bot2Wallet
    FinanceWallet[Finans cüzdanı- Ana örgüt fonlarını tutar, Messenger'da ticaret için ayırır.]  CMAccount
    TechWallet[Teknik cüzdan- CMA’yı oluşturur ve yönetir, gaz ücretlerini öder- CMA’dan para çekebilir] --> CMAccount
    CMAccount[CMA akıllı sözleşmesi- Ticaret fonlarını tutar- Rezervasyonlar için ödeme yapar/alır- Hizmetleri ve ücretleri belirtir- Kabul edilen para birimlerini belirtir- Botları kaydeder] --> Bot1Wallet
    CMAccount --> Bot2Wallet
    Bot1(Bot1) --> |uses| Bot1Wallet[Bot1 cüzdanı- CMA’dan sınırlı miktarlarda para çekebilir- tedarikçi olarak: hizmet ücreti çeklerini nakde çevirir, rezervasyon token’larının mintlenmesi için gaz ücretlerini öder- dağıtıcı olarak: hizmet ücreti çekleri için öder ve rezervasyon token’larını satın almak için gaz ücretlerini öder]
    Bot2(Bot2) --> |uses| Bot2Wallet[Bot2 cüzdanı- Bot1 cüzdanıyla aynı]
```

Bir Partnerın ilgili iki temel rolü, Mali İşler Müdürü (CFO) ve Teknik Güç Kullanıcısıdır. CFO, genellikle çok imzalı olan Finans Cüzdanı'ndan sorumludur ve bu cüzdan organizasyonun ana fonlarını bulundurur. Bu fonlar, Messenger'da ticaret faaliyetleri için tahsis edilir, ancak CFO işlemle hiç yaşamsak bir etkileşimde bulunmaz.

Teknik Güç Kullanıcısı, diğer yandan, CFO’dan fonları alarak Messenger operasyonları için kullanan Teknik Cüzdan'ın sorumlusudur. Teknik Cüzdan ile giriş yaparak, Partner Konfigürasyonunu oluşturup yönetebilir, Camino Messenger'da kurulum ve ticaret için gerekli gaz ücretlerini ödeyebilir ve fonları, ister kendi cüzdanına ister Finans Cüzdanına çekebilir.

Kamino Messenger Hesabı, ya da kısaca CMA, Partner Konfigürasyonu'nun finansal omurgası olarak işlev gören bir akıllı sözleşmedir (aslında bir akıllı sözleşmeler dizisidir). Partner adına Camino Messenger’da ticaret için tahsis edilen fonları tutar ve rezervasyonlar için ödeme/ödeme alımını yönetir. Ayrıca sunulan ve talep edilen hizmetlerin yanı sıra uygulanabilir hizmet ücretlerini ve kabul edilen para birimlerini içeren tüm konfigürasyon ayarlarını saklar. Partner sistemlerinin Messenger ile etkileşimde bulunduğu zincir dışı botların cüzdanlarının listesini de tutar.

Teknik Güç Kullanıcısı (veya Partner'ın teknik departmanı), botların dağıtımından sorumludur (botlar ve bunları nasıl yapılandıracağınız konusunda daha fazla bilgi için lütfen  faydalanın). Botlar, zincir üzerinde tanımlanan ve işleyen, ilgili cüzdanlarla kontrol edilen erişime sahip olan zincir dışı bileşenlerdir; bu durumda CMA’daki fonlara erişim kısıtlıdır. Bot cüzdanları, botların özel blok zinciri işlemlerini yürütmesini sağlamakta yardımcı olur. Bir tedarikçi botın durumunda, bot cüzdanı hizmet ücreti çeklerini nakde çevirir ve partner sisteminin rezervasyon onayı ile birlikte rezervasyon tokenlarının mintlenmesi için gaz ücretlerini öder (gerçek rezervasyon tutarı, tedarikçinin CMA’sına gelir). Dağıtıcı botın durumunda ise, bot cüzdanı hizmet ücreti ödemelerini yönetir ve bu tür rezervasyon tokenlarının satın alınması sırasında harcanan gaz ücretlerini karşılar (gerçek ödeme tutarı, dağıtıcının CMA’sı tarafından harcanır).

Bu akış, zincir dışı botların akıllı sözleşmenin kısıtlamaları içinde çalışmasını sağlarken, zincir üzerinde fon ve hizmetlerin etkin yönetimini mümkün kılar. (CMA’dan bot için otomatik finansman işlevselliği planlanmaktadır, daha fazla bilgi için  YAKINDA bakabilirsiniz).

## Adım Adım Konfigürasyon Rehberi

Bu kılavuz, Teknik Güç Kullanıcılarının Camino Messenger Hesapları için konfigürasyon sürecine rehberlik etmek üzere tasarlanmıştır.

1. Partner Showroom'unda Partner olarak kaydolun veya eğer zaten listelenmişse Partnerinizi talep edin; bu işlemi  bulabilirsiniz.

2. Partner bilgilerinizle bağlantılı Teknik cüzdanınızın:

   - KYC/KYB onaylı olduğundan emin olun.
   - C-Chain üzerinde en az 110 CAM bulundurduğundan emin olun. Bunların 100'ü, ardından hizmet ücretlerini ödemek için kullanılacak Messenger Hesabı’na bağlanması gerekecek, geri kalan miktar ise sonraki konfigürasyon ayarlarıyla ilgili gaz masraflarını ve bot cüzdanlarını ön finansman için yeterli olacaktır.

3. Gerekli tüm bilgileri toplayın:

   - Yukarıda açıklandığı gibi Camino Messenger üzerindeki talep edilen hizmetler
   - Botlarınız aracılığıyla sunduğunuz veya sunmayı planladığınız hizmetler
   - Kabul etmek istediğiniz para birimleri

4. Partner bilgilerinizle bağlantılı Teknik cüzdanınız ile Camino Suite'a giriş yapın.

5. Partners bölümüne gidin, ardından My Partner detaylarına tıklayın ve "Create Messenger Account" butonuna tıklayın.

6. Prefund Miktarını belirleyin (minimum 100 CAM, aşağıdaki örnek ekran görüntüsünde bu yukarıdaki hususlara göre 105 olarak belirlenmiştir) ve Messenger Hesabınızı oluşturun:



Fig.1: Camino Messenger Hesabı oluşturma ekranı


7. Şimdi asıl konfigürasyon aşamasındasınız. Kabul edilen para birimlerini My Messenger Account sekmesinde yapılandırın. Bu sekmenin nasıl çalıştığına dair detaylı bir açıklama aşağıda bulunmaktadır.

8. Sunulan Hizmetleri kendi sekmesinde yapılandırın. Bu sekmenin nasıl çalıştığına dair detaylı bir açıklama aşağıda mevcuttur.

9. İstenilen Hizmetleri kendi sekmesinde yapılandırın. Bu sekmenin nasıl çalıştığına dair detaylı bir açıklama aşağıda mevcuttur. Bu adımın ardından, Partner Showroom'unda eşleşen partnerleri aramaya hazır olacaksınız ve Camino Messenger üzerinden iletişim kurmak için tartışmak üzere iletişim kurabilirsiniz.

10. Botlarınızı  açıklandığı gibi kurun veya daha önce kurulmuşlarsa her birinin cüzdan adresini toplayın.

11. Her botu Manage Bots sekmesine ekleyin. Bu sekmenin nasıl çalıştığına dair detaylı bir açıklama aşağıda mevcut.

12. Her bir botu, Teknik cüzdanınızdaki C-Chain adresinden bot cüzdanlarına küçük bir miktar (örneğin 1 CAM) transfer ederek finanse edin.

## Partner Konfigürasyonu Ayrıntılı

### My Messenger Account sekmesi



Fig.2: Camino Messenger Hesabı detay yönetimi


"My Messenger Account" ekranı, Camino Messenger adresinizi, hizmetlerinizi görmenizi ve kabul edilen para birimlerini ve bakiyelerini yönetmenizi sağlar. Bu sekmede mevcut olan işlevlerin bir dökümünü aşağıda bulabilirsiniz:

1. **Detaylı bilgi**:

   - **Camino Messenger Adresi**: Bu adres (örneğin, `0x97AD255Def722D1aeB06...136326E553e6`), desteklenen para birimlerinin yüklenmesi için kullanılır. Adresi dış cüzdanlarda veya diğer platformlarda kullanmak için "Kopyala" butonuna basarak panonuza kopyalayabilirsiniz.
   - **Sunulan Hizmetler**: Burada sağladığınız hizmetlerin listesi görüntülenir (örneğin, "AccommodationSearch").
   - **İstenilen Hizmetler**: Diğer partnerlerden aradığınız hizmetleri gösterir (örneğin, "CountryEntryRequirements").
   - **Yapılandırılmış Botlar**: Şu anda hesabınıza bağlı bot cüzdanlarının sayısını belirtir (örneğin, "1 yapılandırılmış botunuz var").

2. **Kabul Edilen Para Birimleri**:

   - Aşağıdaki listeden kabul ettiğiniz para birimlerini yönetebilirsiniz.

     - **CAM**: Mevcut bakiyeyi görüntüler (örneğin, "105.0 CAM"). "Çek" butonu, başka bir cüzdana para transferini başlatan bir çekim formu ile sizlere yardımcı olur. Bu formda, - Hedef C-Chain adresini belirtin ve kayıtlı Teknik Güç Kullanıcısını kolayca ayarlamak için bir buton bulunur. - Çekilecek miktarı belirtin ve çekilebilecek maksimum miktara kolayca ayarlamak için bir buton bulunur. - Transfer talimatı verin.
       CAM bakiyesini önceden yüklemek için yukarıda belirtilen Camino Messenger'a herhangi bir C-Chain cüzdanından transfer etmeniz gerekmektedir.
       Not: ERC20 token desteği yakında geliyor. Şu anda CAM dışındaki herhangi bir fonu göndermekten kaçınmanızı öneririz.
     - **USDC, EURC, EURe, EURSH** (yakında): Bunlar etkinleştirebileceğiniz potansiyel gelecekteki para birimleridir. Bu para birimleri için "Çek" seçeneği şu anda devre dışıdır.
     - **Fiat (zincir dışı)**: Bu seçenek, blok zincirinin dışında gerçekleşen fiat bazlı işlemleri etkinleştirmek için seçilebilir.

   - **Para Birimlerini Yapılandır Butonu**: Bu butona tıklayarak onay kutularını etkinleştirin, ardından düzenlemeleri tamamladıktan sonra "Değişiklikleri Kaydet" butonuna basın.

### Sunulan Hizmetler sekmesi



Fig.3: Camino Messenger Hesabı sunulan hizmetler


"Sunulan Hizmetler" ekranı, partnerlerin Camino Messenger'da sundukları hizmetleri yapılandırması ve yönetmesi için imkan sağlar. İşte, bu sekmede "Hizmetleri Yapılandır" butonuna tıkladığınızda etkinleştirebileceğiniz işlevlerin ayrıntılı bir dökümü:

1. **Bir Hizmet Ekle/Kaldır**:

   - "Hizmet seç" etiketli bir açılır liste, mevcut hizmetleri ve sürümlerini seçmenize olanak tanır; örneğin "cmp.services.accommodation.v2.AccommodationSearchService". Bir hizmet eklerken, aşağıdaki gibi yapılandırabilirsiniz.
   - Listelenen bir hizmet için, "Hizmeti Kaldır" butonu ile bu hizmeti kaldırabilirsiniz.

2. **Hizmeti Yapılandır**:
   - **Ücret**: Bu hizmetin arayıcısı tarafından ödenecek bir ücret belirleyebilirsiniz, CAM cinsinden görüntülenir; örneğin 0.05 CAM.
   - **Rack Ücretleri**: Bu hizmet için "rack" fiyatları (kamusal, müzakere edilmeyen fiyatlar) sunup sunmadığınızı belirtmek üzere bir onay kutusu.
   - **Yetenekler**: Hizmetinizin belirli yeteneklerini tanımlayan bir metin alanı; örneğin "Karayipler'deki 3* oteller". Yeni bir yetenek eklemek için "Yetenek Ekle" butonuna basabilir, bir yeteneği boşaltmak isterseniz silinecektir.
     Not: Ücret ve Rack Ücretleri belirlemek genellikle Ön Arama hizmetleri için anlamlıdır.

Düzenleme yaptıktan sonra, bu sekmedeki çalışmalarınızı kalıcı hale getirmek için "Değişiklikleri Kaydet" butonuna basın.

### İstenilen Hizmetler sekmesi



Fig.4: Camino Messenger Hesabı istenilen hizmetler


"İstenilen Hizmetler" ekranı, partnerlerin Camino Messenger'da aradıkları hizmetleri yapılandırması ve yönetmesi için imkan sağlar. Bu sekmede "Hizmetleri Yapılandır" butonuna tıkladığınızda etkinleştirebileceğiniz işlevlerin ayrıntılı bir dökümünü aşağıda bulabilirsiniz:

1. **Bir Hizmet Ekle/Kaldır**:
   - "Hizmet seç" etiketli bir açılır liste, mevcut hizmetleri ve sürümlerini seçmenize olanak tanır; örneğin "cmp.services.accommodation.v2.CountryEntryRequirementsService".
   - Listelenen bir hizmet için, "Hizmeti Kaldır" butonu ile bu hizmeti kaldırabilirsiniz.

Yapılandırma yaptıktan sonra, bu sekmedeki çalışmalarınızı kalıcı hale getirmek için "Değişiklikleri Kaydet" butonuna basın.

### Botları Yönet sekmesi



Fig.5: Camino Messenger Hesabı bot cüzdan yönetimi


"Botları Yönet" ekranı, partnerlerin bu Camino Messenger Hesabına bağlı bot cüzdanlarını yönetmelerine imkan tanır. İşte, bu sekmede mevcut olan işlevlerin ayrıntılı bir dökümünü aşağıda bulabilirsiniz:

1. **Bot Listesi**:

   - Bu Messenger Hesabını kullanan tüm bot cüzdanlarının adreslerini görüntüler; örneğin, "0xB21385af6bFD19d0E787d718FB83559e515412eB".
   - Her bir bot için, botun çalışması için mevcut CAM bakiyesi görüntülenir (YAKINDA).

2. **Bir Bot Ekle/Kaldır**:
   - Yeni bir bot cüzdan adresini "Bot" alanına girin ve ardından "Ekle" butonuna tıklayın.
   - Bir botu kaldırmak için "Kaldır" butonuna tıklayın.

Not: Bir bot eklediğinizde, çalışır hale gelmesi için cüzdan adresine küçük bir miktar transfer edilmesi gerekmektedir ve miktar asla 0 olmamalıdır. Otomatik bir yükleme mekanizması geliştirilmektedir (YAKINDA).