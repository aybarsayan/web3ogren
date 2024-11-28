---
title: Genel Bakış - BC Fusion
description: BNB Beacon Chain, merkeziyetsiz borsa vizyonunu destekleyen bir blockchain'dir ve Beacon Chain'in emekli olma sürecini açıklamaktadır. Bu süreç, BNB Smart Chain ile entegrasyon ve önemli güncellemeler içermektedir.
keywords: [BNB Beacon Chain, merkeziyetsiz borsa, BNB Chain, güncellemeler, blockchain, BEP-333, Feynman Hardfork]
---

# Genel Bakış

BNB Beacon Chain, dijital varlıklar için merkeziyetsiz bir borsa (DEX) vizyonunu uygulayan BNB Chain topluluğu tarafından geliştirilmiş bir blockchain'dir. Bunun yanında, Beacon Chain ve BSC, çift zincirli bir yapıdadır: Beacon Chain, BSC'nin bir stake ve yönetim katmanı olarak güvenliğini artırmasına yardımcı olur. **Farklı Dex türlerinin artmasıyla birlikte, sipariş defteri tabanlı merkeziyetsiz borsa [BEP151](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP151.md) ile devre dışı bırakılmıştır.** BSC'nin hızlı evrimi ile birlikte, Beacon Chain bir yük haline gelmiştir. 

:::info
İki zinciri birbirine bağlayan çapraz zincir köprüsü, geliştirme iterasyonunu yavaşlatarak BNB'yi her zaman belirli bir seviyede güvenlik açığına maruz bırakmaktadır.
:::

**Bir adım daha atmanın zamanı geldi ve Beacon Chain işlevselliğinin BSC'ye geçişi sağlanarak** **Beacon Chain'in emekli olmasına izin verilecektir**.

![](../images/bnb-chain/assets/bcfusion/phases.png)

Beacon Chain'in geri çekilmesi için birkaç aşama olacaktır:

- **İlk Gün Batımı Hardfork'u** - Bazı Beacon chain işlemleri devre dışı bırakılacak, örneğin:
  - TimeLockMsg
  - TimeRelockMsg
  - FreezeMsg
  - IssueMsg
  - MintMsg
  - IssueMiniMsg
  - HTLTMsg
  - DepositHTLTMsg
  - MsgCreateValidatorOpen
  - MsgCreateSideChainValidator
  - MsgCreateSideChainValidatorWithVoteAddr
  - MsgEditSideChainValidatorWithVoteAddr
  - MsgSideChainDelegate
  - MsgSideChainReDelegate
  
- **BSC Feynman Hardfork'u** - Yerel doğrulayıcılar ve staking, BNB Akıllı Zinciri'nde yerel yönetim etkinleştirilecektir. BSC doğrulayıcıları/delegatörleri, Feynman güncellemesinden sonra taşınmalara başlayabilir.

:::tip
Tüm paydaşlar, BNB Chain blogunu takip ederek ilgili duyurulara dikkat etmelidir.
:::

- **İkinci Gün Batımı Hardfork'u** - Daha fazla Beacon chain işlemi devre dışı bırakılacak, örneğin, MsgSideChainSubmitProposal. Tüm TimeLock ve AtomicSwap, kullanıcının cüzdanına otomatik olarak iade edilecektir. Tüm BSC delegasyonları otomatik olarak geri alınacaktır.

- **Son Gün Batımı Hardfork'u** - Beacon Chain ile BSC arasındaki çapraz zincir iletişimi tamamen durdurulacaktır. (Ana ağda tahmini süre: Eylül 2024)

- **BC Fusion Sonrası** - Beacon Chain yok edilecek ve BSC'ye bağlı ancak henüz BSC'ye aktarılmamış varlıkları kurtarmak için bir merkle ağaçı oluşturulacaktır.

:::warning
Proaktif olarak harekete geçmek, tüm paydaşlar için kritik öneme sahiptir.
:::

BNB Chain birleştirmesi hakkında daha fazla bilgi için lütfen [BEP-333](https://github.com/bnb-chain/BEPs/pull/333?ref=bnbchain.ghost.io) başvurun.

BNB Chain birleştirmesi için yol haritası ve kilometre taşları hakkında bilgi için lütfen [blogu](https://www.bnbchain.org/en/blog/bnb-chain-fusion-roadmap) inceleyin.