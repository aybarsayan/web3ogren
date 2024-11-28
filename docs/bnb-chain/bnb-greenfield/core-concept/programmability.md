---
title: Çapraz Zincir Programlaması - BNB Greenfield Çapraz Zincir
description: Bu doküman, BNB Greenfield ekosisteminde çapraz zincir programlamasının nasıl gerçekleştiğini ve önemli yapılarını açıklamaktadır. Geliştiricilere farklı blok zincirleri arasında veri etkileşimleri sağlamak için gereken bilgileri sunar.
keywords: [Çapraz Zincir, BNB Greenfield, Geliştirme, Blockchain, Akıllı Sözleşmeler]
order: 6
---

# Çapraz Zincir Programlaması

Greenfield ekosistemi, verimlilik yönetimi ve akıllı kod yürütmesi yoluyla veri varlık değerini artırmak için **çapraz zincir programlamasını** kullanır. Bu platform, farklı blok zincirleri üzerinde veri yoğun, güvenilmez hesaplama ortamlarının oluşturulmasını, yönetilmesini ve işletilmesini destekler.

::: info
Geliştiricilerin BSC ağına dayalı dapp oluşturmaları gerektiği anlamına gelmez. Mükemmel altyapı, uygulamalar ve araçlar doğrudan Greenfield ağı üzerinde inşa edilebilir.
:::

## Çerçeve

![](../../images/bnb-chain/bnb-greenfield/static/asset/03-Cross-chain-Architecture.jpg)

Greenfield ekosistemi, çapraz zincir etkileşimlerini ve varlık yönetimini kolaylaştırmak için her biri belirli bir amaca hizmet eden üç ana katmana yapılandırılmıştır:

- **Çapraz Zincir İletişim Katmanı**: Verileri BSC ile Greenfield arasında güvenli bir şekilde transfer eder, birlikte çalışabilirlik sağlar.
- **Kaynak Ayna Katmanı**: Greenfield'ın kaynaklarını BSC'ye yansıtarak akıllı sözleşme etkileşimlerini kolaylaştırır.
- **Uygulama Katmanı**: Greenfield'ın altyapısını kullanarak BSC'de merkeziyetsiz uygulamalar geliştirmek için akıllı sözleşmeleri kullanır.

Bu katmanlı mimari, geliştiricilerin Greenfield'ın benzersiz özelliklerini kullanarak yenilikçi uygulamalar yaratmalarını sağlarken, sağlam çapraz zincir yetenekleri sağlar.

## Ana Özellikler

- **Yerel Çapraz Zincir Köprüsü**: Validatorlar arasında çok imzalı bir şemayla artırılmış güvenlik ile kesintisiz birlikte çalışabilirlik sağlar. Daha fazla ayrıntı için [Çapraz Zincir Modül tasarımı](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/cross-chain.md) kısmına göz atabilirsiniz.
- **Kaynak Yansıtma**: BSC aracılığıyla Greenfield nesnelerinin/bucket'larının/gruplarının blok zincirinde yönetilmesine olanak tanır ve işlem olasılıklarını genişletir.
- **EVM Sözleşme Programlama**: Dosya yüklemeleri dışında, BSC'deki çoğu yerel Greenfield işlemine olanak tanır; dosya yüklemeleri çevrimdışı etkileşimler gerektirir.
- **Çoklu Mesaj**: Tek bir işlem içinde birden fazla çapraz zincir operasyonunun yürütülmesine olanak tanır. Bu, çeşitli işlemleri bir araya getiren `MultiMessage` sözleşmesi aracılığıyla gerçekleştirilir. MultiMessage sözleşmesinin, bucket, nesne, grup, izin ve token çapraz zincir transferi gibi mevcut çapraz zincir operasyonlarını desteklemekle sınırlı olduğunu belirtmek önemlidir.

## Dapp Geliştirmeye Başlayın

- [Çapraz zincir mekanizması hakkında daha fazla bilgi edinin](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/cross-chain.md)
- `Greenfield ile dapp geliştirmeye başlayın`