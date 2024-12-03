---
title: Çapraz-Döviz Ödemeleri
seoTitle: Çapraz Döviz Ödemeleri - XRP Ledger
sidebar_position: 4
description: Çapraz döviz ödemeleri, XRP Ledger içinde atomik olarak gerçekleştirilen ve farklı para birimlerinin dönüşümünü sağlayan finansal işlemlerdir. Bu kapsamda, kullanıcılara en uygun maliyetli yollarla ödeme yapma fırsatı sunar.
tags: 
  - XRP Ledger
  - çapraz döviz
  - ödemeler
  - token
  - otomatık köprüleme
keywords: 
  - XRP Ledger
  - çapraz döviz
  - ödemeler
  - token
  - otomatık köprüleme
---

# Çapraz-Döviz Ödemeleri

XRP Ledger, size XRP ve token'lar ile çapraz döviz ödemeleri yapma imkanı sunar. **XRP Ledger** içindeki çapraz döviz ödemeleri tamamen atomiktir; bu, ödemenin tamamen gerçekleştirileceği veya ödemenin hiçbir parçasının gerçekleştirilmediği anlamına gelir.

:::tip
Çapraz döviz ödemeleri, farklı para birimlerini kolayca dönüştürmek için mükemmel bir yoldur.
:::

Varsayılan olarak, çapraz döviz ödemeleri, kaynağına değişken bir maliyetle, varış noktasına sabit bir miktar gönderir. Çapraz döviz ödemeleri ayrıca belirli bir gönderim limitinde değişken bir miktar sağlayan `kısmi ödemeler` de olabilir.

## Gereksinimler

- Tanım olarak, bir çapraz döviz ödemesi en az iki para birimi içerir; bu, en az bir para biriminin **XRP** dışındaki bir `token` olması gerektiği anlamına gelir.
- Gönderen ve alıcı arasında en az bir `Yol` olmalıdır ve tüm yollar üzerindeki toplam likidite, ödemenin gerçekleştirilmesi için yeterli olmalıdır. Çapraz döviz ödemeleri, XRP Ledger'daki `merkeziyetsiz borsa` içindeki `Teklifleri` tüketerek bir para biriminden diğerine dönüşüm yapar.

## Otomatik Köprüleme

Bir token'ın diğer bir token ile değiştirildiği çapraz döviz ödemeleri, ödemenin maliyetini düşürdüğünde **XRP**'yi otomatik olarak köprü olarak kullanabilir. Örneğin, USD'den MXN'ye yapılan bir ödeme:

> "Doğrudan USD'den MXN'ye dönüşüm yapmaktan daha ucuzsa, otomatik olarak USD'yi XRP'ye ve ardından XRP'yi MXN'ye dönüştürür."  
> — XRP Ledger Kılavuzu

Daha büyük işlemler, doğrudan (USD-MXN) ve otomatik köprülenmiş (USD-XRP-MXN) dönüşümlerin bir kombinasyonunu kullanabilir.

Daha fazla bilgi için `Otomatik Köprüleme` sayfasına bakın.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Tokenlar`
    - `Merkeziyetsiz Borsa`
    - `Yollar`
- **Referanslar:**
    - [Ödeme işlem türü][Payment transaction]
    - [path_find yöntemi][]
    - [ripple_path_find yöntemi][]
    - `Çapraz-Döviz Ödemelerinin Metadata'sını Yorumlama`

Daha Fazla Bilgi
Çapraz döviz ödemeleri, çift taraflı piyasalarda daha iyi fiyatlandırma ve daha fazla likidite erişimi sağlamak için kullanılabilir. 

