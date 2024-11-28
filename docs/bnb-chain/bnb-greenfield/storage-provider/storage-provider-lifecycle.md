---
title: Depolama Sağlayıcı Yaşam Döngüsü - BNB Greenfield SP
description: Bu belge, bir depolama sağlayıcısının Greenfield Depolama Ağı'na katılmasından çıkışına kadar olan tüm yaşam döngüsünü tanımlar. Depolama sağlayıcılarının süreçlerini, hizmette, bakımda ve çıkış aşamalarını detaylı bir şekilde ele almaktadır.
keywords: [depolama sağlayıcısı, Greenfield, yaşam döngüsü, hizmet, bakım, çıkış, veri koruma]
---

# Depolama Sağlayıcı Yaşam Döngüsü

Bu belge, bir depolama sağlayıcısının Greenfield Depolama Ağı'na katılmasından çıkışına kadar olan tüm yaşam döngüsünü tanımlar.

## Hazırlık

Öncelikle, depolama sağlayıcısının bir depolama sağlayıcı düğümünü çalıştırmayı ve oluşturmayı öğrenmesi gerekmektedir, bu da birkaç farklı kullanıcı hesabı ve birleşik bir dış EndPoint gerektirir.

- **Hazırlanmak için Önerilen Gereksinimleri takip edin**
- Gerekli hesapları oluşturun, Örn: operator/fundig/seal/approval/gv/bls
- Depolama Sağlayıcısının tüm hizmetlerini çalıştırın

:::note
    Daha fazla bilgi için lütfen `Depolama Sağlayıcısını Çalıştır` sayfasına bakın.
:::

## Teklif

Depolama Sağlayıcısı (SP), oy verme süreci yoluyla onay aldıktan sonra otomatik olarak yürütülecek Msg bilgilerini içeren bir zincir içi öneriyi başlatmalıdır. Bu durumda Msg, `MsgCreateStorageProvider`'dır. Teminat token'larının, zincirde belirtilen minimum teminat token'larını aşması gerektiğini sağlamak önemlidir.

Aşağıda öneride değiştirilmesi gereken zorunlu alanlar bulunmaktadır:

- **Adresler:**
  - sp_address: Ağa eklenecek depolama sağlayıcısının adresi.
  - seal_address: Nesneyi mühürlemek için kullanılan adres.
  - approval_address: Kova/nesne oluşturulmasını onaylayan adrestir.
  - gc_address: Çöp toplama adresi.
  - maintenance_address: Bakım modundayken test etmek için kullanılan adres.
- **EndPoint:** SP'nin veri taleplerini karşılayacağı uç noktanın detayları.
- **Kota & Fiyat:**
  - read_price: Okuma işlemleri için byte başına saniye başına Gwei cinsinden maliyet.
  - stora_price: Veri depolaması için byte başına saniye başına Gwei cinsinden maliyet.
  - free_read_quota: Kullanıcılara tahsis edilen varsayılan ücretsiz okuma kotası (örn., 10GB).
- **SP Stake'i için Teminat:**
  - SP, depolama hizmetleri sağlama taahhüdü olarak testnet'te en az 1000 BNB (Binance Coin) stake etmelidir.
- **Teklif için Teminat:**
  - Teklifin kendisi, testnet'te en az 1 BNB teminatına sahip olmalıdır.

:::note
    Daha fazla bilgi için lütfen `Depolama Sağlayıcısını Greenfield Ağı'na Ekle` sayfasına bakın.
:::

Gerekli değişiklikler ve teminatlarla bu zincir içi teklifi başlatmak, SP'nin Greenfield ağında aktif bir katılımcı olabilmesi için kritik bir adımdır ve kullanıcılara güvenilir ve güvenli depolama hizmetleri sunmaktadır. Öneri gereksinimlerine uyarak, SP itibarını artırabilir ve daha fazla kullanıcı çekebilir, böylece merkeziyetsiz depolama ekosisteminin büyümesine ve başarısına katkıda bulunabilir.

---

## Hizmette

Hizmetteyken, Depolama Sağlayıcıları (SP'ler) ağın günlük operasyonlarına aktif olarak katılmaktadırlar. Veri depolama, geri alma ve diğer depolama ile ilgili işlemler dahil olmak üzere çeşitli kullanıcı taleplerini yönetirler.

> SP'ler, depoladıkları verilerin erişilebilirliğini, bütünlüğünü ve gizliliğini korumakta kritik bir rol üstlenirler.  
> — Greenfield Depolama Ağı

Kullanıcı erişiminin kapı bekçileri olarak, verileri yetkisiz erişim veya müdahaleden korumak için uygun kimlik doğrulama ve yetkilendirme prosedürlerini uygularlar.

Bu aşamada, SP'ler Greenfield ağında kova ve nesnelere etkin bir şekilde hizmet verebilmek için sanal gruplar oluşturmaları gerekmektedir. Disk sektörlerini andıran bu sanal gruplar, SP'lerin veri depolamayı daha düzenli ve optimize bir şekilde yönetmesine olanak tanır. Nesneleri sanal gruplarla ilişkilendirerek, SP'ler nesne kopya verilerini depolayan ikincil depolama sağlayıcılarının aralığını sınırlayabilir, bu da veri fazlalığını ve dayanıklılığı artırır.

:::note
    Daha fazla bilgi için lütfen [Sanal Grup](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/virtual-group.md#abstract) sayfasına bakın.
:::

Ayrıca, SP'lerin depoladıkları veri miktarına karşılık gelen stake'ler sağlamaları gerekmektedir. Bu staking mekanizması, SP'leri kullanıcılara güvenilir ve yüksek kaliteli hizmetler sunmaya teşvik eder. Token veya dijital varlıkları stake ederek, SP'ler sağlam ve güvenilir bir ağa olan bağlılıklarını gösterirler ve bu, onların çıkarlarını depolama ekosisteminin genel güvenliği ve başarısıyla uyumlu hale getirir.

Ayrıca, sanal grup oluşturma ve staking, kova/nesneler ile SP'ler arasındaki karşılıklı bağımlılığı çözmeye yardımcı olur. Bunu yaparak, SP'ler, SP çıkışları ve kova geçişleri sırasında zincir üzerindeki BucketInfo ve ObjectInfo'yu değiştirmek için geniş bir işlem hacmi gereksinimini azaltırlar. Bu, ağ yönetiminin daha verimli olmasını ve ağın bileşenlerindeki değişiklikler sırasında daha pürüzsüz geçişler sağlanmasını sağlar.

SP'ler, kullanıcı ihtiyaçlarını karşılamaya devam ederken ve ağ operasyonlarına aktif olarak katılırken, itibarları ve hizmet kaliteleri en önemli hale gelir. Olumlu bir itibar puanı, daha fazla kullanıcının verilerini belirli bir SP'de depolamasını sağlamak için kritik öneme sahiptir. Sürekli iyileştirme ve uyum sağlama ile, SP'ler hizmetlerini geliştirebilir, depolama kapasitesini artırabilir ve dinamik merkeziyetsiz depolama pazarında rekabet avantajı elde edebilir.

---

## Bakımda

Hizmet sağlayıcılar (SP'ler) için bakım modu, SP'lerin kullanıcılardan herhangi bir oluşturma/yükleme talebini karşılamadığı bir durumdur. Bir SP'nin bakım modunda olabileceği iki durum vardır:

1. Bir SP, bir öneri geçtikten sonra ağa katıldığında, `STATUS_IN_MAINTENANCE` durumunda kalacak ve `MsgUpdateStorageProviderStatus` mesajını içeren bir işlem gönderene kadar bu durumda kalacaktır.
2. Eğer bir SP zaten hizmetteyse, Greenfield'e bakım süresi talep eden bir işlem gönderebilir; eğer ihlal edilen herhangi bir kısıtlama yoksa, SP'nin hemen bakım moduna girmesine izin verilir.

:::note  
    Not: SP, talep süresi sona ermeden önce Greenfield'e durumunu tekrar `STATUS_IN_SERVICE` olarak güncellemek için bir işlem göndermelidir; aksi takdirde, Greenfield bunu zorla yapacaktır.
:::

Bir SP bakımda olmak için talep ettiğinde iki kısıtlama geçerlidir. Bu kısıtlamalar, `num_of_historical_blocks_for_maintenance_records`, `maintenance_duration_quota` ve `num_of_lockup_blocks_for_maintenance` parametreleri ile çalışır. Daha fazla bilgi için lütfen [Parametreler](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/storage-provider.md#params) sayfasına bakın.

* Her SP için toplam bakım süresi, `num_of_historical_blocks_for_maintenance_records` tarafından tanımlanan blok sayısı içinde `maintenance_duration_quota` değerini aşmamalıdır.
* Bir SP'nin `num_of_lockup_blocks_for_maintenance` içinde arka arkaya iki kez `STATUS_IN_MAINTENANCE` talep etmesine izin verilmez, yeterli kota olsa bile.

Sağlanan hizmetin kalitesini sağlamak için, SP'lerin `STATUS_IN_SERVICE` moduna dönmeden önce bakım hesabı aracılığıyla bir öz test yapmaları şiddetle tavsiye edilir. Bu, tüm işlevlerin beklenildiği gibi çalıştığını doğrulamak için kovalar/nesneler oluşturmayı içermektedir. Kova/nesne oluşturmak için SDK kullanma konusunda ayrıntılı bir açıklama için lütfen `API'ler ve SDK'lar` sayfasına bakın.

---

## Çıkış

SP'nin davranış ve seçimlerine göre iki tür çıkış vardır: **Nazik Çıkış** ve **Zorla Çıkış**.

### Nazik Çıkış
Bir noktada, SP çeşitli nedenlerle Greenfield depolama ağından gönüllü olarak çıkış yapmayı seçebilir. 
Nazik bir çıkış sürecini sağlamak, sorumlulukların ve verilerin diğer SP'lere kesintisiz bir geçişini sağlamak için kritik öneme sahiptir. 
Çıkış süreci sırasında, SP kullanıcı sorgulama taleplerini karşılamaya devam etmelidir. Çıkış süreci başarıyla tamamlandığında, SP stake ettiği tüm BNB'leri geri alabilir.

Nazik bir çıkışı gerçekleştirmek için, mevcut tüm verilerini devralmaya istekli diğer halef SP'lere taşıması gerekmektedir.  
Bu veri taşıma süreci, çıkışta olan SP'den verileri güvenli ve etkili bir şekilde devralmayı içerir. 
Çıkan SP, Greenfield Blockchain'e `StorageProviderExit` işlemi gönderdiğinde durumu `STATUS_GRACEFUL_EXITING` olacaktır. 
Bir halef SP, ilk olarak Greenfield Blockchain'e `ReserveSwapIn` işlemi göndererek çıkış SP'sinin ilgili Küresel Sanal Grup (GVG) veya GVG Ailesi'ndeki pozisyonunu rezerve eder ve böylece diğer SP'lerden veri geri almasına izin verilir. 
Halef SP, bir GVG veya GVG Ailesindeki tüm verileri başarıyla devraldığında, veri transfer sürecinin tamamlandığını onaylayan bir `CompleteSwapIn` işlemi gönderir.

Greenfield Blockchain, nazik çıkış sürecini kolaylaştırmak ve doğrulamak için etkili bir uzlaşma mekanizması dahil etmiştir. 
Bu mekanizma, çıkışın şeffaf bir şekilde gerçekleştirilmesini sağlar, ağın bütünlüğünü korur ve geçiş sırasında herhangi bir kesinti veya veri kaybını önler.

Verilerin güvenli ve güvenilir bir şekilde taşınmasını sağlamak için, verilerini devralan SP'lere sık sık veri meydan okumaları uygulanmaktadır. 
Bu meydan okumalar, taşınan verilerin bütünlüğünü ve tutarlılığını doğrulamak amacıyla tasarlanmıştır ve kullanıcılara verilerinin güvenli ve erişilebilir kalmaya devam ettiğini temin eder.

### Zorla Çıkış
İşbirliği yapmayan bir SP artık hizmet vermek istemiyor ve standart nazik çıkış sürecine geçmeyi reddediyor. Böyle bir durumda, Greenfield yönetimi, SP'yi çıkış yapmaya zorlayacak, `STATUS_FORCED_EXITING` duruma girmesine neden olacaktır. Halef SP için veri geri alma süreci, yukarıda bahsedilen nazik çıkış süreci ile aynıdır.
Ancak, zorla çıkış yapan bir SP cezalara tabi olacak ve stake ettiği BNB'ler Ödeme modülü yönetim hesabına kilitlenecektir; bu ödeme hesabı, zorla yerleşim ücreti almak ve geç kalmış zorla yerleşimden kaynaklanan potansiyel borçları ödemek için kullanılacaktır.

:::note
    Daha fazla bilgi için lütfen [SP çıkışı](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/virtual-group.md#sp-exit-workflow) sayfasına bakın.
:::