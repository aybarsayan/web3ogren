---
description: BNB Token Model outlines the core concepts of BNB as the primary utility token within the Greenfield ecosystem, its various uses, revenue sharing, circulation model, and genesis setup.
keywords: [BNB, Greenfield, token, blockchain, staking, governance, storage]
title: BNB Token Model - BNB Greenfield Core Concepts
---

# BNB Token Model

**BNB**, Greenfield üzerinde ana yardımcı token olarak kalmaktadır. **BNB**, BSC'den Greenfield blockchain'ine ve tersine aktarılabilir. Bunu şu şekillerde kullanılır:

- **Staking token**: Bu token kullanıcıların kendi kendine delegasyon yapmasına ve stake olarak başkalarına delegasyon yapmasına izin verir. Bu, gaz ödülleri kazanabilir ancak uygunsuz davranış sonucu kesinti yapılabilir.
  
:::tip
Staking yaparken güvenilir validator'lar seçmek, uzun vadeli kazançlar sağlamak açısından önemlidir.
:::

- **Gaz token**: Bu token Greenfield blockchain'inde işlemleri göndermek için gaz ödemesi yapmak amacıyla kullanılır. Bu hem Greenfield yerel işlemleri hem de Greenfield ile BSC arasındaki çapraz zincir işlemlerini içerir. Ücret, işlem gönderiminde tahsil edilir ve Greenfield `validators`'ına, bazı işlemler için potansiyel olarak Greenfield `Storage Providers`'ına iletilir. Ücret dağıtımı protokol içinde yapılır ve bir protokol spesifikasyonu [burada açıklanmaktadır](https://github.com/bnb-chain/greenfield-cosmos-sdk/blob/master/docs/spec/fee_distribution/f1_fee_distr.pdf).
  
- **Storage service fee token**: Bu token nesne depolama ve indirme bant genişliği veri paketi için ücret ödemek amacıyla kullanılır. Ücretler zaman ilerledikçe tahsil edilir ve Greenfield `Storage Providers`'ına dağıtılır.
  
- **Governance token**: BNB sahipleri, staking yaptıkları BNB ile tekliflere oy vererek Greenfield'ı yönlendirme yetkisine sahip olabilirler (başlangıçta mevcut değildir).

## Revenue Sharing

> Greenfield'in ana ekonomik gücü `storage providers`'dan gelir; bu sağlayıcılar kullanıcılar için depolama hizmetleri karşılığında ücret talep ederler. 

Bu arada, `validators`, ağın güvenliğini denetleyerek, istikrarı koruyarak ve hizmet kalitesini sağlayarak önemli bir rol oynamaktadır. `Validators`, işlem ücretleri kazanabilir, ancak bu, ağ güvenliği için yeterli staking garantisi vermeyebilir. Bu nedenle, Greenfield, `validators`'ın sağladıkları depolama hizmetlerinden makul bir ücret oranı almasını sağlamak amacıyla tasarlanmıştır. 

:::info
Bu yaklaşım, kullanıcı verilerinin sadece depolanmasını değil, aynı zamanda ağın da güvenli ve emniyetli olmasını sağlamaktadır.
:::

## Circulation Model

Greenfield'de, BNB'nin çift zincirli yapısı nedeniyle enflasyon yoktur. Bunun yerine, BNB'nin Greenfield ve Smart Chain arasında iki yönlü olarak akışını sağlamak için çapraz zincir transferleri kullanılmaktadır. Sonuç olarak, Greenfield'deki BNB'nin toplam dolaşımı dalgalanabilir.

Greenfield, BNB'nin her iki zincirdeki toplam dolaşımının her zaman başlangıçta toplam arzdan daha az olmasını sağlamak için Lock/Unlock mekanizmasını kullanmaktadır:

1. Transfer dışı blockchain, kaynak sahip adreslerinden bir miktarı bir modül hesabına veya akıllı sözleşmeye kilitler.
   
2. Transfer içi blockchain, modül hesabından veya sözleşmeden miktarı açar ve hedef adreslere gönderir.

3. Her iki ağ da asla BNB basmaz.

:::note
Mekanizmaya dair daha fazla bilgi için `çapraz zincir modeline` başvurun.
:::

## Genesis Setup

BNB, ilk çapraz zincir eylemi olarak BSC'den Greenfield'a aktarılır. Greenfield'deki başlangıç validator seti ve `storage provider` başlangıçta belirli bir miktar BNB'yi BSC'deki "Greenfield Token Hub" sözleşmesine kilitler. Bu sözleşme, genesis sonrası BNB transferleri için yerel köprü olarak kullanılmaktadır. Başlangıçta kilitlenen bu BNB, `validators`'ın kendi stake'leri, `storage provider` deposu ve ilk günlerdeki gaz ücretleri için kullanılacaktır.

> Greenfield'deki başlangıç BNB tahsisi yaklaşık 500K BNB'dir.
— Greenfield Ekonomik Modeli

!!! tip
    Genesis kurulumunda hiçbir başlangıç bağışçısı, vakıf veya şirket fon almayacaktır.