---
title: Kullanıcı Kılavuzu - BSC Stake Etme
description: Bu kılavuz, BNB stake etme dApp'inin BSC testnet ve ana ağda nasıl kullanılacağına dair adım adım talimatlar sunmaktadır. Kullanıcılar, stake'lerini yönetmek için gerekli olan işlemleri öğrenebilirler.
keywords: [BNB, stake etme, dApp, BSC, kullanıcı kılavuzu, blockchain, cüzdan]
---

# BNB Stake Etme dApp ile Stake Yönetimi

Stake'lerinizi yönetmek için BNB stake etme dApp'ini kullanın. Bu kılavuz, dApp'i BSC testnet ve ana ağda nasıl kullanacağınız konusunda adım adım bir rehber sunmaktadır.

- **Testnet**: [https://testnet-staking.bnbchain.org/en/bnb-staking](https://testnet-staking.bnbchain.org/en/bnb-staking)
- **Ana Ağ**: [https://www.bnbchain.org/en/bnb-staking](https://www.bnbchain.org/en/bnb-staking)

## Cüzdanı Bağla

![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake1.png){:style="width:400px"}

dApp ile etkileşimde bulunabilmek için öncelikle web3 cüzdanınızı bağlayın. Şu anda, yalnızca ana ağda desteklenen `TrustWallet` ve `MetaMask` ile birlikte `WalletConnect` uyumlu tüm cüzdanlar desteklenmektedir.

:::tip
Cüzdanınızı bağlarken sorun yaşıyorsanız, tarayıcınızın uzantı ayarlarını kontrol edin ve cüzdanınızın güncel olduğundan emin olun.
:::

## Stake Devret

1. Stake'lerinizi devredeceğiniz bir doğrulayıcı seçin. Her bir doğrulayıcı hakkında ayrıntılı bilgiler ilgili sayfalarında mevcuttur.
2. Yeni bir devir başlatmak için `Devret` düğmesine tıklayın.

    ![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake2.png){:style="width:400px"}

3. Devretmek istediğiniz BNB miktarını girin.

    ![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake3.png){:style="width:400px"}

4. Devri onayladıktan sonra, bağlı cüzdanınız işlemi imzalamanız için bir uyarı gösterecektir. 

    > Başarılı işlemler, işlem hash'i ile birlikte `Benim Stakem` sayfasında görüntülenecektir.  
    — Kullanıcı Kılavuzu

    ![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake4.png){:style="width:400px"}

## Stake Yeniden Devret

`Benim Stakem` sayfasında mevcut devirlerinizi yönetebilirsiniz.

> Not: Sık sık doğrulayıcı değiştirmeyi teşvik etmemek amacıyla %0.002'lik bir yeniden devretme ücreti uygulanmaktadır.

1. Stake'inizi farklı bir doğrulayıcıya aktarmak için `Yeniden Devret` düğmesine tıklayın.

    ![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake6.png){:style="width:400px"}

2. Açılan pencerede, yeni doğrulayıcınızı seçin ve yeniden devretmek istediğiniz miktarı belirtin. Tüm miktarı veya sadece bir kısmını taşımayı seçebilirsiniz.

    ![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake7.png){:style="width:400px"}

## Stake İadesi

Stake'lerinizi ve ödüllerinizi almak için geri devretmeniz gerekir.

1. İlgili devrin yanındaki `Geri Devret` düğmesine tıklayın.

    ![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake8.png){:style="width:400px"}

2. Tüm miktarı veya bir kısmını geri devretmeyi seçebilirsiniz. Dönmeyen stake'leriniz, hesabınıza iade edilmeden önce **7 günlük** bir unbinding süresine tabi olacaktır.

    ![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake9.png){:style="width:400px"}

:::info
Unbinding süresi sona erdikten sonra, stake'lerinizi talep edebilirsiniz. Bu süreç, kullanıcılar için avantajlıdır ve işlemlerin güvenliğini artırır.
:::

## Stake'leri Talep Et

Unbinding süresi sona erdikten sonra, `Talep Et` düğmesine tıklayarak stake'lerinizi talep edebilirsiniz.

![](../../images/bnb-chain/bnb-smart-chain/img/staking/user-stake10.png){:style="width:400px"}

## SSS

### Hangi cüzdanlar, doğrulayıcılara devir için kullanılabilir?

Şu anda, `MetaMask` ve `TrustWallet` desteklenmektedir, ayrıca `WalletConnect` ile uyumlu tüm cüzdanlar da kullanılabilir.

### BscScan veya BscTrace üzerinde stake'leri devredebilir/geri devredebilir/yeniden devredebilir/talep edebilir miyim?

Yukarıda belirtilen devir/geri devret/yeni devir/talep işlemlerini BscScan veya BscTrace'te yapmak isterseniz, staking hub kontratını aşağıdaki URL'lerde çağırmalısınız:
* [BscScan Stake Hub](https://bscscan.com/address/0x0000000000000000000000000000000000002002#writeContract)
* [BscTrace Stake Hub](https://bsctrace.com/address/0x0000000000000000000000000000000000002002?tab=Contract&p=1&view=contract_write)