---
title: Kullanıcı Kılavuzu - BSC MEV
description: Bu kılavuz, BNB Chain kullanıcılarının MEV (Madenci Çıkarılabilir Değer) saldırılarına karşı koruma ve özel RPC'ler kullanarak işlem güvenliğini artırma yöntemlerini ele almaktadır. Bu içerik, hem perakende yatırımcılar hem de profesyonel yatırımcılar için çeşitli stratejiler sunmaktadır.
keywords: [MEV, BSC, kullanıcı kılavuzu, özel RPC, işlem güvenliği, perakende yatırımcılar, profesyonel yatırımcılar]
---

# Kullanıcı Kılavuzu

PBS (Proposer-Builder Ayrımı) çerçevesi, BNB Chain kullanıcıları için birkaç avantaj sunmaktadır:

- Kullanıcıların işlemlerinin önceden gerçekleştirilme veya sandwich saldırısına uğrama olasılığı daha düşüktür. 
- Blok üreticileri arasındaki artan rekabet, daha verimli piyasalar ve potansiyel olarak daha düşük gas fiyatları ile sonuçlanabilir. 
- Gelişmiş işlem gizliliği: Kullanıcıların işlemleri, bir bloka dahil edilmeden önce daha az tarafın erişimine açıktır. 
- Daha hızlı işlem işleme: Daha verimli blok yapımı, daha hızlı işlem onaylarına yol açabilir.

## Perakende Yatırımcılar için 

:::tip
Merkeziyetsiz bir borsa (DEX) üzerinde işlem yaparken, işlemlerinizin hedef alınma riski vardır; bu, botların işleminizi kamu mempool'unda görmesi ve benzer bir işlemi öncelikle gerçekleştirmesi anlamına gelir. 
:::

Bu durum, alacağınız fiyatın daha kötü olmasına veya hatta paranın kaybolmasına neden olabilir. Özel RPC'ler, bu soruna bir çözüm sunar. İşlemlerinizi özel bir mempool (Yapıcılar tarafından sağlanan) aracılığıyla yönlendirir, bu botlardan gizleyerek. Bu, işlemlerinizin önceden gerçekleştirilme olasılığını azaltır ve beklediğiniz fiyatı alma olasılığınızı artırır.

Bazı DEX protokolleri veya yapıcı sağlayıcıları, ücretsiz koruma özellikleri sunmaya heveslidir. 

| Rol                         | Durum ve Yorumlar                                          |
| ---------------------------- | ------------------------------------------------------------ |
| Ücretsiz Gizlilik Koruyan RPC'ler | [Pancake Swap Özel RPC](https://docs.pancakeswap.finance/products/pancakeswap-private-rpc) [48 Club Özel RPC](https://docs.48.club/privacy-rpc)[Merkle Ücretsiz BSC Özel RPC](https://merkle.io/free-bsc-rpc) |

:::info
Birçok cüzdan artık kötü niyetli MEV (Madenci Çıkarılabilir Değer) saldırılarına karşı yerleşik koruma sunmakta ve kullanıcıların işlemlerinin güvenliğini ve adilliğini artırmaktadır.
:::

Bu koruma, genellikle kullanıcıların değişim veya ticaret faaliyetleri sırasında manuel olarak etkinleştirebileceği bir özellik olarak mevcuttur.

**Manuel MEV Korumasına Sahip Cüzdanlar:**

- **Özel İşlem İletimleri:** Bu iletimler, işlem ayrıntılarını kötü niyetli aktörlerden gizleyerek, kullanıcının ticaretini önceden gerçekleştirilmesi veya sandwich saldırısı ile engellemeye yardımcı olur.
- **Özelleşmiş Yapıcılar:** Bazı cüzdanlar, kullanıcı korumasını ve işlemlerin adil sıralamasını önceliklendiren yapıcılar kullanarak, MEV istismarının potansiyelini minimize eder.

| Tür    | İsim         | Durum    | Nasıl etkinleştirilir                                                |
| ------ | ------------ | --------- | ------------------------------------------------------------ |
| Cüzdan | OKX Cüzdan   | Destekleniyor | [OKX Cüzdan MEV Korumasını Etkinleştir](https://www.okx.com/ar/help/okx-wallet-supports-flashbot-to-prevent-mev-attack) |
| Cüzdan | Trust Wallet | Destekleniyor | [TrustWallet MEV Koruması](https://trustwallet.com/blog/introducing-mev-protection-secure-your-swaps-with-trust-wallet) |

---

## Profesyonel Yatırımcılar ve Hizmet Sağlayıcılar için

Ücretsiz özel RPC'ler iyi bir koruma düzeyi sunarken, premium özel RPC hizmetleri ile daha güçlü korumayı tercih edebilirsiniz. Bu hizmetler genellikle gelişmiş özellikler ve artırılmış güvenlik ve performans için ayrılmış altyapı sunar.

| Rol                                                         | Durum ve Yorumlar                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 5 Yapıcı (Özel gizlilik koruyan RPC hizmet sağlayıcıları) | [BloxRoute](https://bloxroute.com/products/protected-transactions/)[Blocksmith](https://docs.blocksmith.org/bsc-builder/private-rpc)[Nodereal](https://docs.nodereal.io/reference/bsc-bundle-service-api#overview)[Blockrazor](https://blockrazor.gitbook.io/blockrazor/mev-service/bsc)[Puissant](https://docs.48.club/) |

:::warning
İşlemin dahil edilme hızını etkileyebilecek iki unsur vardır. 
:::

1. **Validator Ağı:** Daha büyük bir entegre validator ağına sahip sağlayıcılar genellikle daha hızlı dahil etme hızları sunabilir. Daha fazla validator, işleminizin seçilmesi ve bir bloka eklenmesi için daha fazla fırsat anlamına gelir.
2. **Yapıcı Kullanımı:** Bir yapıcının hizmetinin daha yüksek kullanımı genellikle daha hızlı dahil etmeyi sağlar. Artan kullanım, yapıcının blok önerilerini validatorler için daha değerli hale getirir ve bu nedenle o blokları önceliklendirmeye teşvik eder.

En son MEV yapıcı verilerini (MEV_Blocks_by_Builders) [Dune panosundan](https://dune.com/bnbchain/bnb-smart-chain-mev-stats) görebilir ve işlemleri yayınlamak için uygun yapıcıları seçebilirsiniz. Her yapıcının iletişim bilgileri yukarıdaki Tablo 1'de listelenmiştir. 

Entegre olan validator sayısını ve her yapıcının blok sayısını yukarıda bahsedildiği gibi kontrol edebilirsiniz.

1. Daha fazla validator entegre edildikçe, yapıcı daha hızlı olabilir. 
2. Daha fazla blok üretildikçe, yapıcı daha hızlı olabilir. 

![img](../../../images/bnb-chain/bnb-smart-chain/img/mev/mev-blocks-by-builders.png)

:::note
İşlem onay süresine çok duyarlı olanlar için, işlem hızını maksimize etmek amacıyla, işlemi birden fazla yapıcıya yayınlamak için bir proxy oluşturulması önerilir; bu, **işlemin dahil edilme hızını artırır**.
:::

Birden fazla yapıcı hizmet sağlayıcısı ile kendi RPC proxy'nizi oluşturmanız gerekmektedir. 

![img](../../../images/bnb-chain/bnb-smart-chain/img/mev/proxy.png)

Bir işlem proxy örnek kodu NodeReal tarafından oluşturulmuştur, açık kaynaklı git reposunu burada bulabilirsiniz https://github.com/node-real/private-tx-sender