---
title: rippled Sunucu Modları
seoTitle: rippled Server Modes
sidebar_position: 1
description: rippled sunucu modları hakkında bilgi edinin; stok sunucular, doğrulayıcı sunucular ve bağımsız modda çalışan rippled sunucuları dahil.
tags: 
  - rippled
  - sunucu modları
  - P2P
  - doğrulayıcılar
  - API sunucuları
  - bağımsız mod
keywords: 
  - rippled
  - sunucu modları
  - P2P
  - doğrulayıcılar
  - API sunucuları
  - bağımsız mod
---

# rippled Sunucu Modları

`rippled` sunucu yazılımı, yapılandırmasına bağlı olarak birkaç modda çalışabilir. Bunlar arasında:

- **P2P Modu** - Sunucunun ana modu: eşler-arası ağı takip eder, işlemleri işler ve belirli bir miktar `defter geçmişi` korur. Bu mod, aşağıdaki rollerden herhangi birini veya tümünü yerine getirecek şekilde yapılandırılabilir:
    - **Doğrulayıcı** - Konsensusa katılarak ağı güvenli hale getirir.
    - **API Sunucu** - Paylaşılan defterden veri okumak, işlemleri göndermek ve defterdeki etkinliği izlemek için `API erişimi` sağlar. Opsiyonel olarak, bu bir **Tam Tarih Sunucusu** olabilir; bu, işlem ve defter geçmişinin tam kaydını tutar.
    - **Hub Sunucusu** - Eşler-arası ağın birçok üyesi arasında mesajları iletir.
- **Raporlama Modu** - İlişkisel bir veritabanından API isteklerini karşılamak için özel bir mod. Eşler-arası ağa katılmaz, bu nedenle bir P2P Modu sunucusu çalıştırmalı ve raporlama modundaki sunucuyu güvenilir bir gRPC bağlantısı kullanarak bağlamalısınız.
- **Bağımsız Mod** - Test için çevrimdışı bir mod. Eşler-arası ağa bağlanmaz veya konsensusu kullanmaz.

Ayrıca, yerel olarak `rippled` API'lerini erişmek için `rippled` yürütülebilir dosyasını bir istemci uygulaması olarak çalıştırabilirsiniz. (Bu durumda, aynı ikili dosyanın iki örneği yan yana çalışabilir; biri sunucu, diğeri ise kısa bir süre istemci olarak çalışıp sonlandırılır.)

:::tip
Her bir bu modda `rippled` komutlarını çalıştırmak için bilgi almak için `Komut Satırı Referansı` bölümüne bakın.
:::

---

## P2P Modu

P2P Modu, `rippled` sunucusunun ana ve varsayılan modudur ve sunucunuzun yapmasını istediğiniz hemen hemen her şeyi işleyebilir. Bu sunucular, işlemleri işleyen ve XRP Ledger'ın paylaşılan durumunu koruyan bir eşler-arası ağ oluşturur. 

> "İşlemleri göndermek, defter verilerini okumak veya ağa katılmak istiyorsanız, talepleriniz eninde sonunda bir P2P Modu sunucusu aracılığıyla geçmelidir." — 

P2P Modu sunucuları, ek işlevsellik sağlamak için daha fazla yapılandırılabilir. Minimum değişiklik yapılmış bir yapılandırma dosyası ile çalışan bir P2P Modu sunucusu, _stok sunucu_ olarak da adlandırılır. Diğer yapılandırmalar şunları içerir:

- Doğrulayıcı
- API Sunucu
- Genel Hub'lar

P2P Modu sunucuları varsayılan olarak `Mainnet` ile bağlanır.

### API Sunucuları

Tüm P2P Modu sunucuları, işlem göndermek, bakiye ve ayarları kontrol etmek ve sunucuyu yönetmek gibi amaçlar için `API'ler` sağlar. Eğer XRP Ledger'den veri sorguluyor veya iş kullanımı için işlemleri gönderiyorsanız, `kendi sunucunuzu çalıştırmak` faydalı olabilir.

#### Tam Tarih Sunucuları

Diğer bazı blok zincirlerinden farklı olarak, XRP Ledger'ın, mevcut durumu bilmek ve yeni işlemleri işlemek için sunucuların tamamlanmış bir işlem tarihine sahip olmasını gerektirmediği bilinmektedir. Bir sunucu operatörü olarak, her seferinde ne kadar `defter geçmişi` saklayacağınıza siz karar verirsiniz. 

:::info
Ancak, bir P2P Modu sunucusu yalnızca yerel olarak mevcut olan defter geçmişini kullanarak API taleplerini yanıtlayabilir. Örneğin, altı aylık bir geçmiş saklıyorsanız, sunucunuz bir yıl önceki bir işlemin sonucunu tanımlayamaz.
:::

**Tam tarih** ile API sunucuları, XRP Ledger'ın başlangıcından beri tüm işlemleri ve bakiye durumlarını raporlayabilir.

### Genel Hub'lar

Hub sunucusu, diğer sunucularla çok sayıda `eş protokol bağlantısına` sahip bir P2P Modu sunucusudur. Hub sunucuları, özellikle açık internetten bağlantılara izin veren _genel hub'lar_, XRP Ledger ağına verimli bağlantıyı sürdürmelerine yardımcı olur. Başarılı genel hub'ların aşağıdaki özellikleri vardır:

- İyi bant genişliği.
- Güvenilir birçok eş ile bağlantılar.
- Mesajları güvenilir bir şekilde iletebilme yeteneği.

Sunucunuzu bir hub olarak yapılandırmak için, izin verilen maksimum eş sayısını artırın ve uygun bağlantı noktalarını `açık` bir şekilde yönlendirdiğinizden emin olun.

### Doğrulayıcılar

XRP Ledger'ın sağlamlığı, her biri diğer bazı doğrulayıcıları _şirket kurmayacak şekilde_ güvenen birbiriyle bağlı _doğrulayıcılar_ ağında yatar. Diğer P2P Modu sunucularıyla aynı şekilde, her işlemi işleyip defter durumunu hesaplayarak doğrulayıcılar, `konsensüs protokolü` içinde aktif olarak katılım sağlarlar. 

> "Eğer siz veya kuruluşunuz XRP Ledger'dan faydalanıyorsanız, _bir_ sunucuyu doğrulayıcı olarak çalıştırarak konsensüs sürecine katkıda bulunmanız sizin yararınızdır." — 

Doğrulama yalnızca küçük bir miktar işlemci kaynağı kullanır, ancak tek bir varlık veya kuruluşun birden fazla doğrulayıcı çalıştırmasının büyük bir faydası yoktur; çünkü bu işlem, şirketlerin iş birliği yapmasını önlemez. 

:::warning
Her doğrulayıcı, dikkatlice yönetilmesi gereken benzersiz bir kriptografik anahtar parçası ile kendini tanımlar; birden fazla doğrulayıcı aynı anahtar parçasını paylaşmamalıdır.
:::

Bu nedenlerle, doğrulama varsayılan olarak devre dışıdır. Diğer amaçlar için de kullanılan bir sunucuda doğrulamayı güvenle etkinleştirebilirsiniz; bu tür bir yapılandırmaya _çok amaçlı sunucu_ denir. Alternatif olarak, diğer P2P Modu `rippled` sunucularıyla bir `küme` içinde yer alan başka bir görev gerçekleştirmeyen _özel bir doğrulayıcı_ çalıştırabilirsiniz.

Bir doğrulayıcıyı çalıştırmak için daha fazla bilgi için `Doğrulayıcı Olarak `rippled` Çalıştırın` bölümüne bakın.

---

## Raporlama Modu

Raporlama modu, API isteklerini daha etkili bir şekilde karşılamak için özel bir moddur. Bu modda, sunucu, P2P Modu'nda çalışan ayrı bir `rippled` sunucusundan `gRPC` üzerinden en son onaylı defter verilerini alır, ardından bu verileri bir ilişkisel veritabanına ([PostgreSQL](https://www.postgresql.org/)) yükler. Raporlama modundaki sunucu, doğrudan eşler-arası ağa katılmamakta, ancak kullandığı P2P Modu sunucusuna işlem gönderme gibi istekleri iletebilir.

Birden fazla raporlama modu sunucusu, her bir sunucunun tüm verilerin gereksiz bir kopyasına ihtiyaç duymadan büyük bir geçmişi karşılamak için bir PostgreSQL veritabanı ve [Apache Cassandra](https://cassandra.apache.org/) kümesine erişim paylaşabilir. Raporlama modu sunucuları, temel veriyi nasıl depoladıklarıyla ilgili bazı küçük değişikliklerle aynı `rippled` API'lerini` sağlar.

En önemlisi, raporlama modu sunucuları, bekleyen, onaylanmamış defter verilerini veya işlemleri raporlamaz. Bu kısıtlama, `merkezi olmayan borsa` gibi hızlı verilere erişim gerektiren belirli kullanım durumları için önemlidir.

---

## Bağımsız Mod

Bağımsız modda, sunucu ağla bağlantı kurmadan ve konsensüs sürecine katılmadan çalışır. Konsensüs süreci yokluğunda, defteri manuel olarak ileri almanız gerekir ve "kapalı" ile "onaylı" defterler arasında hiçbir ayrım yapılmaz. Ancak, sunucu yine de API erişimi sağlar ve işlemleri aynı şekilde işler. Bu, size aşağıdakileri yapma imkanı tanır:

- `Değişikliklerin etkisini test edin` bu değişikliklerin merkezi olmayan ağda yürürlüğe girmeden önce.
- `Yeni bir başlangıç defteri oluşturun` sıfırdan.
- `Diskten mevcut bir defter sürümünü yükleyin`, ardından belirli işlemleri yeniden oluşturarak sonuçlarını tekrar yaratmak veya diğer olasılıkları test edebilirsiniz.

---

## Ayrıca Bakınız

- **Eğitimler:**
    - `rippled` yapılandırması`
    - `Bağımsız Modda rippled kullanın`

