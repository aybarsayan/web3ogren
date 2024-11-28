---
title: Sıkça Sorulan Sorular - BSC MEV
description: BSC MEV çözümleriyle ilgili sıkça sorulan sorulara yanıtlar ve önemli bilgiler. Bu içerik, kullanıcıların MEV'nin önemi, yapıcılar ve doğrulayıcılar hakkında bilgi edinmelerine yardımcı olacaktır.
keywords: [MEV, BNB Zinciri, Proposer Builder Separation, blok alanı, merkeziyetsizlik]
---

# Sıkça Sorulan Sorular

### 1. MEV çözümü, BNB Zinciri ekosistemi için neden önemlidir?

   BNB Zinciri'nin MEV çözümü, daha şeffaf ve adil bir blok alanı pazarı oluşturmak için **Proposer Builder Separation (PBS)** mimarisinden yararlanmaktadır. 
   PBS aracılığıyla, kullanıcılar işlem göndermek için tercih ettikleri yapıcıyı seçme gücüne sahip olurken, MEV ödülleri arayıcılar, doğrulayıcılar, yapıcılar ve BNB staker'ları arasında adil bir şekilde dağıtılır. 
   Bu yaklaşım **şeffaflık**, **adalet**, **kullanıcı tercihi** ve **ağ güvenliğini** teşvik eder. 
   Ödüllerin çeşitli roller arasında dağıtılması, BNB Zinciri'nin daha geniş katılımı teşvik etmesine ve merkeziyetçilik riskini azaltmasına olanak tanır; böylece merkeziyetsiz ve kapsayıcı bir blok zinciri ekosistemi inşa edilir.

   :::info
   MEV çözümleri, kullanıcı deneyimini ve ağ güvenliğini iyileştirmek için kritik öneme sahiptir.
   :::

### 2. Yapıcılar, blok inşa etmek için dönüşümlü önericinin GasCeil'ini mi alır?

   Evet, blok inşa etmeden önce doğrulayıcının MEV bilgilerini sorgulamak için RPC `mev_params` kullanabilirsiniz; bu, 1) **GasCeil**'den daha fazla olmayan bir geçerli başlık hesaplamaya, 2) **BidSimulationLeftOver** ile kalan teklif zamanını hesaplamaya, 3) **validatorCommission** ile uygun **builderFee**'yi hesaplamaya yardımcı olabilir.

### 3. Doğrulayıcı en iyi teklifi nasıl seçer?

   Blok ödülü **gasFee** olarak hesaplanır, doğrulayıcı ödülü ise **gasFee * commissionRate - builderFee** olarak hesaplanır. Doğrulayıcı her yeni teklifi aldığında, ödülünü mevcut en iyi teklif ile karşılaştırır. Eğer daha iyi bir blok ödülü ve doğrulayıcı ödülü varsa, yeni teklif simülasyona alınır. Simülasyon, blok mühürlenmeden başarılı olursa, yerel madencilik yapılmış blok ödülü ile karşılaştırılır. Eğer teklifin blok ödülü ve doğrulayıcı ödülü, yerel bloktan daha üstteyse, doğrulayıcı tarafından mühürlenir.

   > **Önemli Not:** Doğrulayıcıların tekliflerini simüle etmeleri, ağın verimliliğini artırır.  
   > — BNB Zinciri Uzmanı

### 4. Kim yapıcı olabilir?

   BNB Zinciri, izin gerektirmeyen bir ekosistemdir; standart yapıcı API'sini uygulayan herkes BNB Zinciri yapıcısı olabilir.

### 5. BNB Zinciri yapıcı bilgilerini nerede bulabilirim? 

   BNB Zinciri yapıcılarını bir kamu 
   [builder info repo](https://github.com/bnb-chain/bsc-mev-info/tree/main/mainnet/builders) aracılığıyla bulabilirsiniz.

### 6. Yapıcılarla entegre edilmiş kaç doğrulayıcı var?

   PBS çözümünü uygulayan doğrulayıcıları 
   [validator info repo](https://github.com/bnb-chain/bsc-mev-info/tree/main/mainnet/validators) aracılığıyla bulabilirsiniz.

### 7. BNB Zinciri MEV istatistik panosunu nerede bulabilirim?

   MEV istatistiklerini 
   [MEV Stats Dashboard](https://dune.com/bnbchain/bnb-smart-chain-mev-stats) aracılığıyla görüntüleyebilirsiniz.

   :::tip
   Kullanıcıların MEV istatistiklerini düzenli olarak takip etmesi, ağ hakkında daha iyi bilgi sahibi olmalarına yardımcı olacaktır.
   :::

--- 