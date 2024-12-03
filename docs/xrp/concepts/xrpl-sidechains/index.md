---
title: XRPL Yan Zincirleri
seoTitle: XRPL Yan Zincirleri - Geliştirici Rehberi
sidebar_position: 4
description: XRPL yan zincirleri, kendi mutabakat algoritması ile birlikte bağımsız bir defterdir. Bu içerik, yan zincirlerin işleyişine ve kullanım örneklerine ışık tutmaktadır.
tags: 
  - yan zincir
  - XRPL
  - blockchain
  - akıllı sözleşme
  - EVM
  - merkezi olmayan borsa
keywords: 
  - XRPL
  - yan zincir
  - blockchain
  - akıllı sözleşme
  - Ethereum Sanal Makinesi
  - merkezi olmayan borsa
---
## XRPL Yan Zincirleri

_(Requires the [XChainBridge amendment][] not-enabled /%})_

Bir yan zincir, kendi mutabakat algoritması, işlem türleri, kuralları ve düğümleri olan bağımsız bir defterdir. Ana zincir (XRP Defteri) ile paralel çalışarak, iki taraf arasında değer transferine olanak tanır; bu süreçte ana zincirin hızını, verimliliğini ve işlem hacmini tehlikeye atmaz.

:::info
Yan zincirler, belirli bir kullanım durumu veya projeye özel ihtiyaçları karşılamak için XRP Defteri protokolünü özelleştirebilir ve kendi blok zinciri olarak çalıştırabilir.
:::

Bazı örnekler şunlardır:

- Bir akıllı sözleşme katmanı eklemek. Bakınız: [Xahau](https://xahau.network/)
- Ethereum Sanal Makinesi (EVM) uyumluluğu eklemek. Bakınız: [EVM Yan Zinciri](https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/).
- Özelleştirilmiş defter türleri ve işlem kuralları ile kendi algoritmik istikrarlı parayı oluşturma.
- Ana ağa `dağıtık borsa` üzerinde işlem görebilen izinli veya neredeyse izinsiz, merkezi veya büyük ölçüde merkezi olmayan defterler oluşturma.

**Notlar:**

- Yan zincirler kendi doğrulayıcılarını kullanır ve ana zincir `rippled` UNL'sinden ayrı bir UNL gerektirir.
- Ana zincirdeki ve yan zincirdeki düğümler birbirlerinden haberdar değildir.

> "Yan zincirler, XRP Defteri'nin esnekliğinden yararlanarak, özelleştirilmiş çözümler sunma yeteneği sağlar."  
> — XRPL Topluluğu



Yan zincirler, belirli durumlarda kullanıcılara daha fazla kontrol ve özelleştirme imkanı sunarak yenilikçi uygulamalar geliştirmelerini sağlar. Bu sayede, mevcut ekosistem içinde daha çeşitli çözümler ve hizmetler oluşturulabilir.

