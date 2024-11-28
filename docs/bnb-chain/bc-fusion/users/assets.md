---
title: Varlık Yönetimi
description: BNB Zinciri topluluğu BEP333 teklifini sunarak BNB Zinciri'ni emekliye ayırmayı hedefliyor. Bu kılavuz, dijital varlık sahiplerine, varlıklarını güvenli bir şekilde aktarmalarına yardımcı olmayı amaçlamaktadır.
keywords: [BNB Zinciri, BEP333, dijital varlık, transfer, BC Fusion, BSC, varlık yönetimi]
---

# Varlık Yönetimi

BNB Zinciri topluluğu yakın zamanda [BEP333: BNB Zinciri Fusion](https://github.com/bnb-chain/BEPs/pull/333) teklifini sundu. Bu BEP, BNB Zinciri'ni BNB Zinciri ekosisteminden emekliye ayırmayı hedefliyor. Amaç, BSC'nin geliştirme verimliliğini, güvenliğini ve varlık kullanım verimliliğini artırmaktır. Ayrıca, eski hizmetlerin bakım maliyetlerini azaltmayı amaçlamaktadır. Bu eğitim, BNB Beacon Zinciri üzerindeki dijital varlık ihraççılarına ve sahiplerine varlıklarının değerini, [BEP2](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP2.md)/[BEP8](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP8.md) tokenlerini BC Fusion öncesinde ve sonrasında aktarmalarına yardımcı olmayı amaçlamaktadır. Bu kılavuzu takip eden kullanıcılar, değerli dijital varlıklarını kaybetme olasılığını önleyebilirler.

:::note
**NOT:** BC Fusion programı, Nisan 2024'te uygulanması planlanmaktadır. Lütfen varlık göçü için dikkatli planlama yapın ve fonları güvende tutun.
:::

## BC Fusion Öncesi

BNB, BTC ve BUSD gibi en değerli BEP2/BEP8 tokenleri, Beacon Zinciri ve BSC ağları arasında serbestçe hareket edebilir. Kullanıcılara, kayıpsız ve sorunsuz bir geçiş sağlamak için varlıklarını BSC ağına aktarmaları şiddetle önerilmektedir; bu, 1:1 oranının korunmasını sağlar. Tabii ki, merkezi borsalar veya Binance.com ve [Thorswap](https://thorswap.finance/) gibi merkeziyetsiz çapraz zincir borsaları gibi varlık transferleri için alternatif kanallar mevcuttur. Ancak bu seçenekler, bu eğitim kılavuzunun kapsamının dışındadır.

**Adım 1: Varlıkların Çapraz Zincir Transferlerini Destekleyip Desteklemediğini Doğrulayın**

> Beacon Zinciri blok zinciri gezginini açın, [BEP2 Varlık](https://explorer.bnbchain.org/assets/bep2) sayfasına veya [BEP8 Varlık](https://explorer.bnbchain.org/assets/bep8) sayfasına gidin ve token adını arama yapın. BTC'yi örnek olarak kullanarak, bir BSC Sözleşme adresine bağlıdır, bu da çapraz zincir transferlerine olanak tanır.  
> — BNB Zinciri Dokümantasyonu

![img](../../images/bnb-chain/assets/bcfusion/user-asset-management1.png)

Buna karşılık, BSC Sözleşme adresine sahip olmayan GTEX-71B, bu yüzden çapraz zincir transferlerini desteklemez.

![img](../../images/bnb-chain/assets/bcfusion/user-asset-management2.png)

Eğer bir kullanıcı, çapraz zincir transferlerini desteklemeyen varlıkları aktarması gerekiyorsa, token sahibi/ihraççısı ile en kısa süre içinde iletişime geçmesi şiddetle önerilir. **Token ihraççısından `token bağlama kılavuzuna` danışmasını isteyin ve BEP20 tokenlerini BSC üzerinde ihraç edebilmesi ve çapraz zincir transferlerini etkinleştirebilmesi için. Eğer token ihraççısı, BNB Beacon Zinciri'nin kapanışı öncesinde token için çapraz zincir transferini etkinleştirmezse, fonlar sonsuza dek kaybolacak ve geri alınamayacaktır.**

**Adım 2: Varlıkları BSC Ağına Aktarın**

[BNB Zinciri Cüzdanı](https://chromewebstore.google.com/detail/bnb-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp) ve [Trust Wallet](https://trustwallet.com/) mobil bu durum için önerilmektedir. BNB Zinciri Cüzdanını örnek alarak, kullanıcılar tokenlerin bulunduğu hesapları içe aktardıktan sonra, ağı "BNB Beacon Zinciri Ağı"na çevirmeleri gerekmektedir:

![](../../images/bnb-chain/assets/bcfusion/user-asset-management3.png){:style="width:400px"}

Ardından, aktarılacak varlığı seçin, BSC hesabını ve token miktarını girin.

![](../../images/bnb-chain/assets/bcfusion/user-asset-management4.png){:style="width:400px"}

BSC cüzdanı, yaklaşık bir dakika sonra tokeni alacaktır.

Trust Wallet mobil çoklu zincir cüzdan kullanıcıları, varlıklarını aşağıdaki şekilde aktarabilirler.

![](../../images/bnb-chain/assets/bcfusion/tw1.PNG){:style="width:400px"}

Öncelikle, `Swap` sekmesini açmanız, 'BNB Beacon Zinciri'ni From ağı olarak ve 'BNB Smart Chain' i To ağı olarak seçmeniz, ardından aktarmak istediğiniz varlığı bulup transfer miktarını girmeniz gerekmektedir. `Devam` butonuna tıkladıktan sonra, onay sayfasına yönlendirileceksiniz.

![](../../images/bnb-chain/assets/bcfusion/tw2.PNG){:style="width:400px"}

Son olarak, işlemi onayladıktan sonra ilgili varlık BSC'ye aktarılacaktır.

## BC Fusion Sonrası

Beacon Zinciri'nin emekliye ayrılmasının ardından, bazı kullanıcıların hala varlıklarını BSC ağına aktarmadıkları düşünülmektedir. BNB Zinciri, bu kullanıcılar için hala rahatlama önlemleri sunmaktadır: [BEP299-BC Fusion Sonrası Token Göçü](https://github.com/bnb-chain/BEPs/pull/299).

:::info
Bu çözümün bazı sınırlamaları olmasına rağmen, aşağıdaki önemli noktaları belirtmek önemlidir:
:::

1. Sadece çapraz zincir özelliklerini etkinleştiren varlıklara uygulanabilir. **Eğer bu geçerli değilse, BEP2/BEP8 varlıkları kalıcı olarak kaybolacaktır.**
2. Kullanıcılar, Beacon Zinciri üzerinde özel anahtarlarını güvenli bir şekilde saklamak ve imzalama işlemlerinde kullanılmak üzere bunları kullanmaktan sorumludur.
3. Varlıkları geri getirme süreci tamamlanması 7 güne kadar sürecektir.
4. Bu çözüm, komut satırı üzerinden işletilmektedir ve herhangi bir UI sağlamamaktadır.

Bu sınırlamaları göz önünde bulundurarak, kullanıcıların mümkün olan en kısa sürede token transferini BC Fusion'dan önce tamamlamaları şiddetle önerilmektedir.

:::warning
Bu çözüm için ayrıntılı kılavuz, BC Fusion'dan sonra yayınlanacaktır. Güncellemeleri takipte kalın.
:::