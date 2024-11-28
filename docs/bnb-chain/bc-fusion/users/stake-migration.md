---
description: BNB Chain topluluğu, BNB Beacon Chaini ekosistemde görevden alacak önemli bir geçiş süreci olan BNB Akıllı Zincir'deki yerel staking sistemini tanıtıyor. Kullanıcılar, mevcut yetkilendirmelerini iki ana yöntemle taşıma fırsatına sahipler, Çapraz Zincir Yeniden Yetkilendirme ve Yetkilendirmeyi İptal Etme, Çapraz Zincir Aktarımı, Yeni Yetkilendirme.
keywords: [BNB Chain, Beacon Chain, staking, çapraz zincir, yetkilendirme, BSC, Feynman Hardfork]
---

# Stake Göçü

BNB Chain topluluğu, [BEP333: BNB Chain Fusion](https://github.com/bnb-chain/BEPs/pull/333) ile, BNB Beacon Chain'i ekosistemde görevden alacak önemli bir güncelleme sunmuştur. Bu geçiş, Feynman Hardfork'un ardından BNB Akıllı Zincir üzerinde yerel staking'i tanıtmaktadır. Paydaşlar, mevcut yetkilendirmelerini yeni yerel staking sistemine iki ana yöntemle taşıma fırsatına sahiptirler:

* **Çapraz Zincir Yeniden Yetkilendirme**
* **Yetkilendirmeyi İptal Etme, Çapraz Zincir Aktarımı, Yeni Yetkilendirme**

[BEP-153](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP153.md) formatında oluşturulan yetkilendirmeler için, lütfen göç süreci hakkında bilgi almak için `bu belgeye` bakınız.

## Çapraz Zincir Yeniden Yetkilendirme

Çapraz zincir yeniden yetkilendirme kullanıcıların, yetkilendirmelerini yerel BSC doğrulayıcılarına aktarmasını sağlar; bu, ikinci seçeneğe kıyasla kullanıcıların daha kolay bir göç yapmasını sağlar. Bu nedenle, **stake göçü için önerilen yol budur**.

### Adımlar

!`type:video`

#### Adım 1: Yetkilendirmelerinizi Bulun

Stake web sitesine gidin ve web3 cüzdanınıza bağlanın.

Ana Ağ Stake Web Sitesi: [https://www.bnbchain.org/en/staking](https://www.bnbchain.org/en/staking)

Test Ağı Stake Web Sitesi: [https://testnet-staking.bnbchain.org/en/staking](https://testnet-staking.bnbchain.org/en/staking)

Test ağı için bağlantı kurmak üzere [BNB Chain Wallet](https://chromewebstore.google.com/detail/bnb-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp) kullanabilirsiniz. 

Ana ağ için, bağlantı kurmak üzere BEW veya [TrustWallet](https://trustwallet.com/browser-extension) kullanabilirsiniz.

![](../../images/bnb-chain/assets/bcfusion/stake-migration1.png){:style="width:600px"}

`My Staking` sayfasını açın, ardından mevcut yetkilendirmelerinizi aşağıdaki gibi bulabilirsiniz.

![](../../images/bnb-chain/assets/bcfusion/stake-migration2.png){:style="width:600px"}

#### Adım 2: Taşınacak Yerel BSC Doğrulayıcılarını Seçin

Bir yetkilendirme seçin ve `Migrate to BSC` butonuna tıklayın. Hangi BSC doğrulayıcısına taşınmak istediğinizi seçmek için aşağıdaki pencere açılacaktır.

![](../../images/bnb-chain/assets/bcfusion/stake-migration3.png){:style="width:400px"}

Pencere esas olarak aşağıdaki alanları içermektedir:

* **Taşınacak doğrulayıcı:** Eski yetkilendirme için doğrulayıcı operatörü BSC'de yeni bir doğrulayıcı oluşturduysa, bu alan yeni doğrulayıcı olarak ayarlanacaktır. Ayrıca, yetkilendirmek istediğiniz başka bir doğrulayıcıyı da seçebilirsiniz.
* **BSC yetkilendirme adresi:** Bu adres, BSC üzerinde staking'i yönetmek için sizin için sahibi olarak kullanılacaktır. *Kaybı önlemek için adresin doğru olduğunu iki kez kontrol edin.*

#### Adım 3: Taşınma işlemini imzalayın

Son olarak, işlemi imzalayabilir ve göç başlatılacaktır.

![](../../images/bnb-chain/assets/bcfusion/stake-migration4.png){:style="width:400px"}

Eğer göç başarısız olursa, fonlar Beacon Chain'inize geri dönecek ve bunu web3 cüzdanınızda kontrol edebilirsiniz.

Eğer göç başarılı olursa, yeni staking dApp'ta yetkilendirmeyi bulacaksınız. **Yetkilendirmelerinizi nasıl bulacağınız hakkında daha fazla bilgi için lütfen `bu belgeye` bakın.**

## Yetkilendirme İptali, Çapraz Zincir Aktarımı, Yeni Yetkilendirme

İkinci seçenek, yetkilendiren kişinin 1) Beacon Chain'de yetkilendirmeyi iptal etmesi, bekleme süresini (7 gün ana ağda), 2) BNB'yi BSC'ye çapraz zincir olarak aktarması ve 3) yeni staking dApp'te staking yapması gerektiği anlamına gelir. Bu daha fazla zaman ve işlem ücreti gerektirir; bu nedenle **önerilmez**.

### Adımlar

#### Adım 1: Yetkilendirmelerinizi Bulun

Yetkilendirmelerinizi, birinci seçenek adımlarıyla bulabilirsiniz.

#### Adım 2: Yetkilendirmeyi İptal Et

Ardından, `Undelegate` butonuna tıklayarak yetkilendirmelerinizi iptal edebilir ve işlemi Beacon Chain'e gönderebilirsiniz.

*Unbonding süresi (ana ağda 7 gün) sonrasında stake, Beacon Chain hesabınıza geri dönecektir.*

#### Adım 3: Çapraz Zincir Aktarımı

BNB'nizi Beacon Chain'den BSC'ye çapraz zincir aktarımı için BNB Chain Wallet (BEW) veya TrustWallet kullanabilirsiniz.

BEW için, ağı "BNB Beacon Chain Network"/"BNB Beacon Chain Testnet Network" olarak değiştirmeniz gerekir:

![](../../images/bnb-chain/assets/bcfusion/user-asset-management3.png){:style="width:400px"}

Ardından, aktarılacak varlığı seçin, BSC hesabını girin ve token miktarını yazın.

![](../../images/bnb-chain/assets/bcfusion/user-asset-management4.png){:style="width:400px"}

BSC cüzdanı, yaklaşık bir dakika sonra token'ı teslim alacaktır.

TrustWallet mobil çoklu zincir kullanıcıları için, `Swap` sekmesine gidin ve ana ağ varlık aktarımı için From ağını `BNB Beacon Chain` ve To ağını `BNB Smart Chain` olarak seçin.

Ardından, aktarmak istediğiniz varlığı bulun ve aktarım miktarını girin.

![](../../images/bnb-chain/assets/bcfusion/tw1.PNG){:style="width:400px"}

`Continue` butonuna tıkladıktan sonra, onay sayfasına yönlendirileceksiniz.

![](../../images/bnb-chain/assets/bcfusion/tw2.PNG){:style="width:400px"}

Son olarak, işlemi onayladığınızda ilgili varlık BSC'ye aktarılacaktır.

#### Adım 4: Yeni Doğrulayıcılara Yetkilendir

Son olarak, yeni staking dApp'i kullanarak yeni BSC doğrulayıcılarına yetkilendirme yapabilirsiniz. Ayrıntılı adımlar için `bu belgeye` bakabilirsiniz.