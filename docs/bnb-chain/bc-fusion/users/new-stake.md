---
title: Yeni Stake'leri BNB Staking dApp ile Yönetme
description: BNB staking dApp'ini kullanarak stake'lerinizi yönetmek hakkında kapsamlı bir rehber. Bu kılavuz, stake'lerinizi testnet ve mainnet üzerinde kolayca nasıl yöneteceğinizi adım adım gösterir.
keywords: [BNB, staking, dApp, cüzdan, doğrulayıcı, yönetim]
---

# Yeni Stake'leri BNB Staking dApp ile Yönetme

BNB staking dApp'ini kullanarak stake'lerinizi kolaylıkla yönetin. Bu kılavuz, dApp'i hem testnet hem de mainnet üzerinde kullanmak için adım adım bir rehber sağlar.

- **Testnet**: [https://testnet-staking.bnbchain.org/en/bnb-staking](https://testnet-staking.bnbchain.org/en/bnb-staking)
- **Mainnet**: [https://www.bnbchain.org/en/bnb-staking](https://www.bnbchain.org/en/bnb-staking)

## Cüzdanınızı Bağlama

![](../../images/bnb-chain/assets/bcfusion/user-stake1.png){:style="width:400px"}

:::tip
dApp ile etkileşimde bulunmak için önce web3 cüzdanınızı bağlayın.
:::

Şu anda yalnızca `TrustWallet` (mainnet için) ve `MetaMask` desteklenmektedir; ayrıca `WalletConnect` ile uyumlu tüm cüzdanlar kullanılabilir.

## Stake'leri Yetkilendirme

1. Stake'lerinizi yetkilendirmek için bir doğrulayıcı seçin. Her bir doğrulayıcı hakkında ayrıntılı bilgi, ilgili sayfalarında mevcuttur.
2. Yeni bir yetkilendirme başlatmak için `Delegate` butonuna tıklayın.

    ![](../../images/bnb-chain/assets/bcfusion/user-stake2.png){:style="width:400px"}

3. **Yetkilendirmek istediğiniz BNB miktarını girin.**

    ![](../../images/bnb-chain/assets/bcfusion/user-stake3.png){:style="width:400px"}

4. Yetkilendirmeyi onayladıktan sonra, bağlı cüzdanınız işlemi imzalamanız için sizi yönlendirecektir. **Başarılı işlemler**, `My Staking` sayfasında işlem hash'i ile birlikte görünür olacaktır.
   
    ![](../../images/bnb-chain/assets/bcfusion/user-stake4.png){:style="width:400px"}

## Stake'leri Yeniden Yetkilendirme

`My Staking` sayfasında mevcut yetkilendirmelerinizi yönetebilirsiniz.

> Not: Sık sık doğrulayıcı değişikliğini teşvik etmemek için 0.002% yeniden yetkilendirme ücreti uygulanmaktadır.

1. Stake'inizi farklı bir doğrulayıcıya kaydırmak için `Redelegate` butonuna tıklayın.

    ![](../../images/bnb-chain/assets/bcfusion/user-stake6.png){:style="width:400px"}

2. Açılan pencerede yeni doğrulayıcınızı seçin ve yeniden yetkilendirmek istediğiniz miktarı belirtin. **Toplam miktarı** veya yalnızca **bir kısmını** taşımayı tercih edebilirsiniz.

    ![](../../images/bnb-chain/assets/bcfusion/user-stake7.png){:style="width:400px"}

## Stake'leri İptal Etme

İptal etmek için:

1. İlgili yetkilendirmeye yanındaki `Undelegate` butonuna tıklayın.

    ![](../../images/bnb-chain/assets/bcfusion/user-stake8.png){:style="width:400px"}

2. **Tüm miktarı** veya **bir kısmını** iptal etme seçeneğiniz vardır. İptal edilen stake'lerin, hesabınıza geri dönmeden önce 7 günlük bir sıfır bağlanma süresine tabidir.

    ![](../../images/bnb-chain/assets/bcfusion/user-stake9.png){:style="width:400px"}

## Stake'leri Talep Etme

Sıfır bağlanma süresi sona erdikten sonra, `Claim` butonuna tıklayarak stake'lerinizi talep edebilirsiniz.

![](../../images/bnb-chain/assets/bcfusion/user-stake10.png){:style="width:400px"}

## SSS

### Yeni doğrulayıcılara yetkilendirme için hangi cüzdan kullanılabilir?

Şu anda `MetaMask` ve `TrustWallet` (yalnızca mainnet) desteklenmektedir; ayrıca `WalletConnect` ile uyumlu tüm cüzdanlar kullanılabilir.

### Bir doğrulayıcı operatörü olarak, BSC üzerinde yeni bir doğrulayıcı oluşturduktan sonra mevcut doğrulayıcıyı saklamalı mıyım?

Sorunsuz bir geçiş sağlamak için her iki doğrulayıcıyı bir süre tutmanız önerilir. Delegelerinizden `stake'lerini taşımasını` istemek daha iyi olacaktır. **Yeni doğrulayıcınız** cabinet veya aday olarak seçildikten sonra, eski doğrulayıcıyı güvenle emekliye ayırabilirsiniz.

### BNB'm BSC akıllı sözleşmesi aracılığıyla yetkilendirilmişse, delegasyonlarımı nasıl taşımalıyım?

BEP153 delegasyonları için `stake taşıma kılavuzuna` bakmanızı tavsiye ederiz.