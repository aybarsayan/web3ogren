---
title: Genel Bakış - BSC Staking
description: BSC staking, belirlenen doğrulayıcılarla token’ları stake ederek ağı güvence altına almak ve ödül kazanma sürecini kapsamaktadır. Bu rehber, BSC üzerindeki temel staking kavramları ve işlemlerine dair ayrıntılı bilgi sunar.
keywords: [BSC, staking, doğrulayıcı, blockchain, ödül, konsensüs, PoSA]
---

# BSC Staking Genel Bakışı

![Staking](../../images/bnb-chain/bnb-smart-chain/img/Staking.png)

BNB Akıllı Zinciri (BSC), belirlenen doğrulayıcılarla token’larını stake ederek ağı güvence altına almak ve staking ödülleri kazanmak için önerilen [BEP-294](https://github.com/bnb-chain/BEPs/pull/294) çerçevesinde, Proof-of-Staked-Authority (PoSA) blockchain üzerinde çalışmaktadır. BSC üzerindeki temel staking kavramları ve işlemlerine dair bir inceleme.

## Temel Kavramlar

### Konsensüs Motoru

BSC, konsensüs sağlamak için DPoS ve PoA'yı birleştiren bir konsensüs mekanizması kullanmaktadır; bu sistemde:

* Bloklar, sınırlı bir doğrulayıcı seti tarafından üretilir.
* Doğrulayıcılar, blok üretiminde PoA yöntemiyle sırayla görev alırlar.
* Doğrulayıcı seti, staking tabanlı yönetime göre seçilir.

:::info
Staking mekanizması, doğrulayıcıların blok üretme yeterliliğini belirlemede esastır.
:::

### Doğrulayıcı Seti

Doğrulayıcı seti, BSC üzerinde işlemleri doğrulamak ve blok üretmekle sorumlu olan düğüm grubudur. Doğrulayıcı seti, her doğrulayıcının sahip olduğu staking miktarına bağlıdır; bu, doğrulayıcının ve onun delegelerinin stake ettiği BNB miktarını yansıtır. En yüksek staking'e sahip olan doğrulayıcılar aktif doğrulayıcı seti olarak seçilir ve blokları önermek ve oylamak için sırayla görev alırlar. Kalan doğrulayıcılar ise bekleme doğrulayıcı setindedir ve staking'leri arttığında veya bazı aktif doğrulayıcılar devre dışı kaldığında aktif doğrulayıcı setine katılabilirler.

Herhangi bir organizasyon veya birey, zincir üzerinde kendi doğrulayıcısını oluşturarak ve yeterli delegasyon sağlayarak doğrulayıcı setinin bir parçası olabilir. Benzer şekilde, tüm BNB delegasyonlarını geri çekerek setten çıkmayı da tercih edebilirler. 

> **Önemli Not:** Doğrulayıcılar aynı zamanda kötü davranış veya çevrimdışı olma cezasına tabi olabilirler. Bu durum, "slashing" olarak adlandırılan bir süreçle gerçekleşir.   
> — Bilgi Notu

### Doğrulayıcı Seçimi

Doğrulayıcılar için farklı rolleri bulunmaktadır:

* **Kabine:** blok üretme konusunda en fazla şansa sahip olan en iyi K (şu an 21) doğrulayıcı.
* **Aday:** küçük bir blok üretme şansına sahip, en iyi (K, K+NumOfCandidates] (şu an (21,45] arası) doğrulayıcı.
* **Pasif:** blok üretme şansına sahip olmayan diğer doğrulayıcılar.

![img](../../images/bnb-chain/bnb-smart-chain/img/staking/validator-election.png)

Doğrulayıcı seti rolleri, her 24 saatte bir en son staking bilgilerine dayalı olarak belirlenmektedir. UTC 00:00'dan sonra, konsensüs motoru doğrulayıcıları sıralar ve BSC doğrulayıcı setini sıralama bilgileriyle günceller.

### Sistem Sözleşmeleri

BSC staking'i kolaylaştırmak için birkaç yerleşik sözleşme (yani sistem sözleşmeleri) bulunmaktadır.

* **Doğrulayıcı Seti Sözleşmesi.** Bu sözleşme, belirli aralıklarla bir doğrulayıcı seti seçer. Ayrıca, doğrulayıcı ödüllerini geçici olarak depolamak için bir güvence görevi görür.
  
* **Sistem Ödül Sözleşmesi.** Bu sözleşme, işlem ücretlerinin bir kısmını toplamak için bir güvence olarak görev yapar. Toplanan fonlar, hızlı sonuç ödüllerini dağıtmak gibi kamu amaçları için kullanılır.
  
* **Slash Sözleşmesi.** Bu sözleşme, bir doğrulayıcının ne kadar süreyle kullanılamaz hale geldiğini takip eder ve belirli bir eşik aşıldığında cezalar tetikler. Ayrıca, çift imza ve hızlı sonuçta kötü amaçlı oylama gibi diğer slashing olaylarını da yönetir.

* **Stake Hub Sözleşmesi.** Bu sözleşme, doğrulayıcılar ve delegasyonları yönetmek için bir giriş noktası olarak görev yapar ve belirli doğrulayıcıların slashing'ine dair mantığı uygular. Delegasyon/geri delegasyon/yeniden delegasyon işlemleri için, bir kullanıcının stake'ini yönetmek amacıyla farklı doğrulayıcıların uygulama sözleşmelerini çağırır.

### Kredilendirme Sözleşmesi

Her doğrulayıcının staking kredilerini yöneten ve kredi ile BNB arasındaki değişimi kolaylaştıran kendi doğrulayıcı sözleşmesi vardır. Staking kredisi token’ının adı "stake {{validator moniker}} credit" olup, sembolü "st{{validator moniker}}"dir. Bu sözleşme, bir doğrulayıcı oluşturulduğunda Stake Hub Sözleşmesi tarafından oluşturulacaktır.

Bir kullanıcı BNB delegasyonu yaptığında, eşdeğer miktarda kredi token’ı oluşturulur. Öte yandan, bir kullanıcı delegasyonunu geri çektiğinde, karşılık gelen miktarda kredi token’ı yok edilir ve böylece BNB serbest bırakılır.

### Ödül Dağıtımı

Staking ödülü, işlem ücretlerinden gelmektedir - bir blok üretildiğinde, blok ücretinin çoğu, bloğu öneren doğrulayıcıya ödül olarak toplanır.

Her gün, toplanan ödüllerin bir kısmı direkt olarak doğrulayıcının işletmeci hesabına komisyon olarak gönderilirken, kalan kısmı ilgili doğrulayıcı kredi sözleşmesine aktarılır. Kullanıcı, geri delegasyon yapıp stake'ini talep ettiğinde, toplanan ödül ve orijinal stake kendisine gönderilir.

## Doğrulayıcı İşlemleri

Doğrulayıcılar, BNB Akıllı Zincir yazılımını çalıştıran ve konsensüs sürecine katılan düğümlerdir. Kendi doğrulayıcı adreslerinde minimum BNB stake'ine ihtiyaç duyarlar ve diğer BNB sahiplerinden delegasyon alabilirler. Doğrulayıcılar, işlem ücretlerinden ödül kazanır ve bu ödüllerin çoğunu delegeleriyle paylaşır.

### Doğrulayıcı Oluşturma

Ağın güvenliğini sağlamak için, BSC'de bir doğrulayıcı olabilmek için minimum 2000 BNB kendi delegasyonu gereklidir. BNB sahipleri, bir doğrulayıcı olabilmek için `StakeHub` sözleşmesi ile `CreateValidator` işlemi başlatabilirler. Daha fazla bilgi için `BSC Doğrulayıcı Oluşturma` sayfasına bakın.

### Doğrulayıcıyı Düzenleme

Doğrulayıcılar, `EditConsensusAddress`, `EditCommissionRate`, `EditDescription` ve `EditVoteAddress` gibi işlemlerle bilgilerini güncelleyebilirler.

## Delegatör İşlemleri

Delegatörler, BNB'lerini bir doğrulayıcı ile stake eden BNB sahipleridir ve ödülleri paylaşırlar. Aktif veya bekleme durumundaki herhangi bir doğrulayıcıyı seçebilir, bunlar arasında geçiş yapabilir, BNB’lerini geri çekebilir ve ödüllerini istedikleri zaman talep edebilirler. Kullanıcılar, bu işlemlere dair talimatlar için `kullanıcı kılavuzu` ile başvurabilirler.