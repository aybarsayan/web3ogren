---
title: BSC Validator Genel Görünümü - BNB Akıllı Zinciri
description: BSC doğrulayıcıları, blok üretmek ve ağı güvence altına almak için kilit öneme sahiptir. Bu içerik, BNB Akıllı Zinciri üzerindeki doğrulayıcıların işleyişi, görevleri ve karşılaştıkları cezaları ayrıntılı olarak açıklamaktadır.
keywords: [BSC, doğrulayıcı, blok üretimi, PoSA, BNB, staking, güvenlik]
---

# BSC Validator Genel Görünümü

![validator](../../images/bnb-chain/bnb-smart-chain/img/Validator.png)

BNB Akıllı Zinciri (BSC), kısa blok süresi ve düşük ücretleri destekleyebilen [Proof of Staked Authority (PoSA) konsensüsü](https://github.com/bnb-chain/whitepaper/blob/master/WHITEPAPER.md#consensus-and-validator-quorum) ile birden fazla doğrulayıcı sistemine dayanır. Staking'de en fazla bağlanan doğrulayıcılar blok üretme fırsatına sahip olacaktır. Çift imza tespiti ve diğer cezalandırma mantıkları güvenliği, istikrarı ve zincir kesinliğini sağlar.

BSC, blok üretimi için staking sıralamalarına dayalı olarak her gün **00:00 UTC** sonrası en iyi **45** aktif doğrulayıcıyı seçmek için bir seçim süreci gerçekleştirir. Bunlar arasında, en yüksek stake edilen miktarlara sahip **21** doğrulayıcı **Bakanlıklar** olarak adlandırılırken, geri kalan **24** doğrulayıcı **Adaylar** olarak bilinir. Diğer pasif doğrulayıcılar, aktif doğrulayıcı olabilmeleri için bir sonraki seçim turunu beklemek zorundadır.

**45** aktif doğrulayıcı arasında, her dönem **Bakanlıklardan** **18** doğrulayıcı ve **Adaylardan** **3** doğrulayıcı seçilir ve bu şekilde mevcut dönemde blok üretme konsensüs doğrulayıcı seti olarak **21** doğrulayıcıdan oluşan bir grup oluşturulur. Eğer bir doğrulayıcı konsensüs doğrulayıcısı olarak seçilmiş ama blok üretiminde yer almazsa, cezalandırılacaktır.

:::info
**Bakanlıklar**, blok üretimi için konsensüs doğrulayıcısı olarak seçilme olasılığı **Adaylar**'dan daha yüksektir; Adayların aynı rol için seçilme olasılığı ise biraz daha düşüktür.
:::

Ancak, ister **Bakanlıklar** ister **Adaylar** olsun, eğer blok üretme sırası geldiğinde çevrimiçi değillerse, cezalandırılacaklardır. Bu önlem, daha fazla doğrulayıcının konsensüs sürecine katılmasını teşvik etmeyi ve BSC'nin merkezsizliğini ve güvenliğini artırmayı amaçlar.

## Doğrulayıcı Nedir?

BSC üzerindeki doğrulayıcılar, blok üretmek ve ağı [POSA konsensüs mekanizması](https://github.com/bnb-chain/whitepaper/blob/master/WHITEPAPER.md#consensus-and-validator-quorum) aracılığıyla güvence altına almakla sorumlu düğümlerdir. İşlemleri paketleme, bloklar oluşturma ve doğrulama ile BSC ağını güvence altına alarak karşılığında BNB tokenleri kazanırlar.

## Ağ Topolojisi

![validator network topology](../../images/bnb-chain/bnb-smart-chain/img/validator/validator-network-topology.png){:style="width:600px"}

BSC ağındaki doğrulayıcılar, doğrudan ve dolaylı bağlantılar için bir peer-to-peer (P2P) ağı aracılığıyla birbirine bağlıdır. Bir doğrulayıcı düğüm operatörü olarak iki işlem modu seçebilirsiniz:

- **Mod A (Kullanım Kolaylığı)**: Doğrulayıcınızın genel IP adresini doğrudan P2P ağına açabilirsiniz, bu da doğrudan bir bağlantıyı kolaylaştırır. Bu mod en basit olanıdır ve daha az ağ sıçraması nedeniyle yüksek verimlilik sunar. Potansiyel güvenlik risklerini azaltmak için HTTP modülünü mümkün olduğunca devre dışı bırakmak ve HTTP erişimini halka açmaktan kaçınmak şiddetle tavsiye edilir. Ayrıca, doğrulayıcı düğümünüzün bilgilerini korumak, P2P portunu hedef alabilecek Dağıtılmış Hizmet Reddi (DDoS) saldırılarını önlemek için önemlidir.

- **Mod B (Gelişmiş Güvenlik)**: Bu mod, doğrulayıcı düğümünüzü, esasen normal BSC tam düğümleri olan bir veya daha fazla SentryNode'un arkasına gizler. SentryNode, gizli doğrulayıcı düğümünüz ile kamu P2P ağı arasında koruyucu bir aracı olarak işlev görür. Temelde doğrulayıcıyı DDoS saldırıları ve diğer güvenlik açıklarına karşı korur.

## Ekonomi

Doğrulayıcıların ödülleri, işlem ücretlerinden ve delegelerden alınan komisyon ücretlerinden gelir.

Bir blok için ödülün 100 BNB olduğunu ve belirli bir doğrulayıcının **%20** öz bahtiyarı BNB'ye sahip olduğunu ve komisyon oranını **%20** olarak belirlediğini varsayalım. Bu tokenler doğrudan teklif edene gitmez. Bunun yerine doğrulayıcılar ve delegeler arasında paylaşılır. Bu **100 BNB** her katılımcının payına göre dağıtılacaktır:

```
Komisyon: 80*20%= 16 BNB
Doğrulayıcı alır: 100*20% + Komisyon = 36 BNB
Tüm delegeler alır: 100*80% - Komisyon = 64 BNB
```

Hızlı Kesinlik için doğrulayıcıları oy vermeye motive etme ödülleri de işlem ücretlerinden gelir. Spesifik kurallara [BEP126](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP126.md#43-reward) üzerinden erişebilirsiniz.

Eğer doğrulayıcılar çift imza atar, kötü niyetli oy kullanır veya sık sık çevrimdışı kalırlarsa, stake ettikleri BNB'leri (onlara delegasyon yapan kullanıcıların BNB'lerini hariç tutarak) cezalandırılabilir. Cezanın derecesi ihlalin ciddiyetine bağlıdır.

Gelir geçmişini görmek için BitQuery'nin [grafiğine](https://explorer.bitquery.io/bsc/miners) veya bir [BscScan](https://bscscan.com/validatorset) tablosuna erişebilirsiniz.

## Doğrulayıcılar için Riskler

Eğer doğrulayıcılar sistemi aldatma veya spesifikasyonları ihlal etme girişiminde bulunurlarsa, **`cezalandırma`** adı verilen bir ceza alabilirler.

### Çift İmza Cezası

Doğrulayıcı anahtarlarınızı iki veya daha fazla makinede aynı anda çalıştırmak, Çift İmza cezasına neden olur. Çift imza cezasının cezası:

1. **200 stake edilen BNB**, doğrulayıcı için cezalandırılacaktır.
2. Çift imza hapishane süresi **30 gündür**, kötü niyetli doğrulayıcının, manuel müdahale yapılmadan konsensüse katılmasını engeller.

> Not:
> **Çift imza kanıtı sunma ödülü:** **5 BNB**. 
> Herkes, kötü niyetli doğrulayıcı tarafından mühürlenmiş aynı yükseklikte ve ebeveyn blokta **2 blok başlığı** içeren çift imza kanıtı ile bir cezalandırma talebi sunabilir.

### Kötü Niyetli Hızlı Kesinlik Oy Cezası

Doğrulayıcılarını aynı konsensüs anahtarları ve bls oy anahtarları ile aynı anda iki veya daha fazla makinede çalıştırmak, kötü niyetli oy cezasına neden olur. Kötü niyetli oy cezasının cezası:

1. **200 stake edilen BNB**, doğrulayıcı için cezalandırılacaktır.
2. Kötü niyetli oy hapishane süresi **30 gündür**, hapishane süresi sonrasında doğrulayıcınızı yeniden aktive etmek için bir `unjail` işlemi gönderebilirsiniz.

> Not: **Kötü Niyetli Oy kanıtı sunma ödülü:** **5 BNB**. Herkes, BSC'deki kötü niyetli oy kanıtı ile bir cezalandırma talebi sunabilir; bu talep, kötü niyetli doğrulayıcı tarafından imzalanmış **2 oy** içermelidir.

### Çevrimdışı Cezası

Eğer doğrulayıcınız **24 saat** içinde **50 blok** kaçırırsa, blok ödülü size verilmez, ancak diğer doğrulayıcılar arasında paylaşılır. Eğer doğrulayıcınız **24 saat** içinde **150 blok** daha fazla kaçırmaya devam ederse, çevrimdışı olma cezasını tetikler.

1. **10 stake edilen BNB**, doğrulayıcı için cezalandırılacaktır.
2. Çevrimdışı hapishane süresi **2 gündür**. Bu, doğrulayıcının 2 gün sonra bir `unjail` işlemi göndererek aktif bir doğrulayıcı olarak devam etmesini sağlar.

### Düşük Öz-Bağlama Cezası

Doğrulayıcıların öz-bağlama için minimum 2000 BNB stake etmeleri gerekir. Eğer öz-bağlanan miktar daha az ise, ceza 2 gün hapishane süresidir.