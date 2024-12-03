---
title: Çapraz Zincir Köprüleri
seoTitle: Çapraz Zincir Köprüleri - XRP Defteri
sidebar_position: 4
description: Çapraz zincir köprüleri, XRP ve diğer tokenların blok zincirleri arasında verimli bir şekilde taşınmasını sağlar. Bu özellik, köprülerle bağlantılı kilit ve ihraç zincirleri arasındaki etkileşimleri yönetir.
tags: 
  - XRP
  - çapraz zincir
  - köprüler
  - blok zinciri
  - token
keywords: 
  - XRP
  - çapraz zincir
  - köprüler
  - blok zinciri
  - token
---

# Çapraz Zincir Köprüleri

_(Bu özellik, [XChainBridge değişikliği][] not-enabled /%})_

Çapraz zincir köprüleri, XRP ve token'ları XRP Defteri ile diğer blok zincirleri arasında taşımanıza olanak tanır. Bir köprü ile bağlantılı olan blok zincirlerinden biri kilit zinciri, diğeri ise ihraç zinciridir.

Kilit zinciri, dijital varlığın çıktığı yerdir. Bu varlıklar, bir köprü üzerinden ihraç zincirine gönderildiğinde güvene alınır.

İhraç zinciri, kendine ait bir konsensüs algoritması ve işlem türleri ve kuralları olan bağımsız bir defterdir. Dijital varlığın sarılmış bir versiyonu, kilit zincirinden bir varlık alınıp alınmadığına veya gönderilip gönderilmediğine bağlı olarak mint edilir ve yok edilir.

:::info
Köprüler, çapraz zincir varlık taşırken özel *kapı hesapları* kullanır. Kilit zincirinde bir kapı hesabı, varlıkları güvende tutmak için kullanılır ve ihraç zincirinde bir kapı hesabı, sarılmış varlıkları ihraç etmek için kullanılır.
:::

Kilit ve ihraç zincirleri, bağımsız düğümler ve doğrulayıcılarla paralel ağlar olarak çalışır. İki zincir arasındaki işlemleri izlemek ve varlıkların belirli hesaplara aktarıldığını tasdik etmek için bağımsız `tanık sunucuları` kullanılır.

## Köprüler Nasıl Çalışır?

Yüksek düzeyde, köprüler çapraz zincir işlemlerini şu adımlarla sağlar:

1. İhraç zincirinde bir çapraz zincir talep kimliği oluşturun. Bir çapraz zincir talep kimliği, blok zincirleri arasında bir değer transferini temsil eder.
2. Kilit zincirinde varlıkları güvene almak için bir taahhüt işlemi gönderin. İşlem, çapraz zincir talep kimliğini ve tanık sunucuları için ödülü içerir.

    :::info
    Tanık sunucuları her iki zincirdeki işlemleri izler. Bir işlemin gerçekleştiğini doğrulamak için tasdikler veya imzalı mesajlar sağlarlar. `XChainCommit` ve `XChainAccountCreateCommit` işlemleri için tasdikler vardır.
    :::

3. Tanık sunucuları, varlıkların kilit zincirinde güvence altına alındığını belirterek ihraç zincirine tasdik gönderir.
4. Yeterli imza olduğunda, varlıklar ihraç zincirinde hedef hesaba serbest bırakılır.

    :::info
    Bazı durumlarda, örneğin, depozito yetkilendirmesi etkinleştirildiğinde, ihraç zincirinde transfer edilen varlıklar için bir işlem talebi göndermeniz gerekir.
    :::

5. Ödüller, ihraç zincirindeki tanık sunucularının hesaplarına dağıtılır.

> "Köprüler, dijital varlıkların farklı blok zincirleri arasında güvenli ve verimli bir şekilde taşınmasını sağlar."  
> — XRP Defteri