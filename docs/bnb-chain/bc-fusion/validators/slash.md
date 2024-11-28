---
description: Bu belgede BNB akıllı zinciri üzerindeki slashing mekanizması hakkında ayrıntılı bilgiler sunulmaktadır. Özellikle kesinti, çift imza ve kötü niyetli oy verme cezaları ele alınmaktadır.
keywords: [BNB Smart Chain, slashing, block validation, wrong voting, double sign, consensus, staking]
---

# Slash

BNB akıllı zinciri (BSC), hızlı, güvenli ve güvenilir işlemler sağlamayı amaçlayan bir blok zinciri ağidir. Bunu başarmak için, BSC blok üreten ve doğrulayan bir dizi doğrulayıcıya dayanır. Doğrulayıcılar, ağa katılmak ve ödül kazanmak için BNB token'larını stake ederler.

:::warning
Ancak, doğrulayıcılar, ağın bütünlüğüne ve güvenilirliğine zarar verebilecek şekillerde davrandıklarında stake'lerini kaybetme riski ile de karşı karşıyadır.
:::

İşte burada slashing mekanizması devreye girer. Slashing mekanizması, bazı koşulları ihlal eden doğrulayıcılara ceza veren bir kural ve işlevler setidir ve bu mekanizma `SlashIndicator` kontratı içinde uygulanmaktadır (bu bir sistem kontratıdır ve adresi `0x0000000000000000000000000000000000001001`'dir) ve doğrulayıcıları cezalandırmak için `StakeHub` kontratını çağırır, diğer bir sistem kontratı olup adresi `0x0000000000000000000000000000000000002002`'dir.

Slashing mekanizması, üç tür suç hakkında işlem yapar: **kesinti**, **çift imza** ve **kötü niyetli oy verme**. 

> Her bir suç, ağ üzerindeki etkisine bağlı olarak farklı bir ciddiyet ve ceza taşır.  
> — BNB Smart Chain Belgelendirme

Bu belgede, her bir suç için slashing koşullarını ve mekanizmalarını detaylı bir şekilde açıklayacağız.

---

## Kesinti Cezası

Doğrulayıcıların ağın kesintisiz çalışmasını sağlamak için yüksek kullanılabilirlikte olmaları beklenmektedir. Bu kullanılabilirlik gereksinimlerini karşılamayan doğrulayıcılar cezaya tabi tutulmaktadır.

- Bir iç kontrat, doğrulayıcıların belirli bir zaman dilimi içindeki imza attıkları blok sayısını ölçerek kullanılabilirliklerini takip eder.
- Eğer bir doğrulayıcı, zaman dilimi içinde en az minimum sayıda blok imzalayamazsa, çevrimdışı olarak değerlendirilir ve 10 BNB ceza alarak 2 gün boyunca "tutuklu" durumuna geçer.

---

## Çift İmza Cezası

BSC ağı içindeki kritik bir suç, bir doğrulayıcının aynı yükseklikte iki farklı blok imzalamasıdır. Bu tür eylemler, ağ çatallarına yol açarak blok zincirinin güvenliğini ve tutarlılığını tehlikeye atabilir.

:::tip
Herkes, `SlashIndicator` kontratına `submitDoubleSignEvidence` işlemi göndererek aşağıdaki bilgileri belirtebilir:
:::

- **Header 1**: Bir doğrulayıcının imzaladığı BSC başlığı.
- **Header 2**: Doğrulayıcı tarafından imzalanmış başka bir BSC başlığı. İki başlık da aynı yüksekliktedir.

- Off-chain hizmetler, doğrulayıcıların imzalarını ve imzaladıkları blokların hash’lerini karşılaştırarak çift imza atmayı izler.
- Eğer bir doğrulayıcı çift imza atarken yakalanırsa, kontrat bir slashing işlevi çalıştırarak doğrulayıcının stake’ini 200 BNB azaltır ve 30 gün süreyle "tutuklu" durumuna geçirir, manüel müdahale gerçekleşene kadar konsensusa katılmalarını engeller.

---

## Kötü Niyetli Hızlı Nihai Oylama Cezası

[Hızlı nihai oylama kurallarını](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP126.md) ihlal eden doğrulayıcılar da cezalandırılacaktır.

:::info
Herkes, `SlashIndicator` kontratına `submitFinalityViolationEvidence` işlemi göndererek aşağıdaki bilgileri belirtebilir:
:::

- **Delil**: Doğrulayıcının hızlı nihai kuralları ihlal ettiğini kanıtlayan delil.

- Off-chain hizmetler, kötü niyetli oylamaları tanımlamak için hızlı nihai oylama verilerini izler.
- Eğer bir doğrulayıcı kötü niyetli oy kullanırken yakalanırsa, doğrulayıcı 200 BNB ceza alır ve 30 gün süreyle "tutuklu" statüsüne geçer.