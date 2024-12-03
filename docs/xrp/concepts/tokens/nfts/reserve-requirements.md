---
title: NFT Rezerv Gereksinimleri
seoTitle: NFT Mintleme ve Rezerv Gereksinimleri
sidebar_position: 4
description: NFTlerin mintlenmesi ve tutulması için gereken rezerv gereksinimlerini anlamak. Bu belge, temel rezerv ve sahip rezervi ile ilgili önemli bilgileri özetler.
tags: 
  - NFT
  - rezerv gereksinimleri
  - XRP
  - NFToken
  - mintleme
keywords: 
  - NFT
  - rezerv gereksinimleri
  - XRP
  - NFToken
  - mintleme
---

# NFT Rezerv Gereksinimleri

NFT'leri mintlemek, tutmak ve satışa sunmak için, rezervde XRP bulundurmanız gerekmektedir. **Rezerv ücretleri hızla artabilir.** Rezerv gereksinimlerini anlamak, iş durumunuz için en iyi yaklaşımı seçmenize yardımcı olabilir.

## Temel Rezerv

Hesabınızın, şu anda **10 XRP** olan bir temel rezerv ayırması gerekmektedir. Temel rezerv XRP miktarı değişkenlik gösterebilir. `Temel Rezerv ve Sahip Rezervi` sayfasına bakınız.

## Sahip Rezervi

XRP Ledger'da sahip olduğunuz her nesne için, şu anda **2 XRP** olan bir sahip rezervi bulunmaktadır. Bu, kullanıcıların defteri gereksiz verilerle spam yapmasını engellemek ve gereksiz olan verileri temizlemelerini teşvik etmek amaçlıdır. Sahip rezervi miktarı değişkenlik gösterebilir. `Temel Rezerv ve Sahip Rezervi` sayfasına bakınız.

> **Not:** NFT'ler için, _nesne_ bireysel NFT'leri değil, hesap tarafından sahip olunan `NFTokenPage` nesnelerini ifade eder. `NFTokenPage` nesneleri en fazla 32 NFT depolayabilir.

Ancak, NFT'ler sayfa alanını minimize etmek için sayfalara yerleştirilmez. Eğer 64 NFT'ye sahipseniz, yalnızca **2 `NFTokenPage`** nesneniz olduğu doğru değildir.

İyi bir kural, ortalama olarak her `NFTokenPage` nesnesinin **24 NFT** depoladığını varsaymaktır. Bu nedenle, _N_ NFT'yi mintlemek veya sahip olmak için rezerv gereksinimlerini (24N)/2, yani NFT başına **1/12 XRP** olarak tahmin edebilirsiniz.

Aşağıdaki tablo, sahip olunan NFT sayısına ve bunları tutan sayfa sayısına bağlı olarak toplam sahip rezervinin ne kadar olabileceğine dair örnekler sunmaktadır.

| Sahip Olunan NFT Sayısı | En İyi Durum | Tipik Durum | Kötü Durum |
|:------------------------|:-------------|:-----------|:-----------|
| 32 veya daha az        | 2 XRP        | 2 XRP      | 2 XRP      |
| 50                      | 4 XRP        | 6 XRP      | 8 XRP      |
| 200                     | 14 XRP       | 18 XRP     | 26 XRP     |
| 1000                    | 64 XRP       | 84 XRP     | 126 XRP    |

## `NFTokenOffer` Rezervi

Her `NFTokenOffer` nesnesi, teklifi veren hesap için bir artan rezerv maliyetlidir. Bu yazı itibarıyla artan rezerv **2 XRP**'dir. Rezerv, teklifi iptal ederek geri kazanılabilir. Teklif kabul edilirse rezerv de geri kazanılır ve bu, teklifi XRP Ledger'dan kaldırır.

:::tip
Bir NFT'yi sattıktan sonra, alıcılarınızın rezervlerini geri vermek için, onların adına herhangi bir eski `NFTokenOffer` nesnesini iptal edin. Bunu `NFTokenCancelOffer` işlemleri ile gerçekleştirebilirsiniz.
:::

## Pratik Düşünceler

NFT'leri mintlerken, tutarken ve satın alıp satarken, rezerv gereksinimleri hızla artabilir. Bu, işlemler sırasında hesabınızın rezerv gereksiniminin altına düşmesine yol açabilir. **Gereksinimin altına düşmek, XRPL'de ticaret yapma yeteneğinizi sınırlayabilir.** `Rezerv Gereksiniminin Altına Düşmek` sayfasına bakınız.

Yeni bir hesap oluşturduğunuzda, bir NFT mintlediğinizde ve XRP Ledger'da bir `NFTokenSellOffer` oluşturduğunuzda, minimum **14 XRP** rezerv gerekmektedir.

| Rezerv Türü          | Miktar  |
|:---------------------|--------:|
| Temel                | 10 XRP  |
| NFToken Sayfası     | 2 XRP   |
| NFToken Teklifleri   | 2 XRP   |
| Toplam               | 14 XRP  |

:::info
Bir rezerv gereksinimi olmasa da, mintleme ve satış sürecindeki her işlem için küçük bir ücreti karşılamak için rezervlerinizin üstünde en az **1 XRP** bulundurmak isteyeceğinizi unutmayın (genellikle 12 drops veya .000012 XRP).
:::

Eğer 200 NFT mintleyecek ve her biri için bir `NFTokenSellOffer` oluşturursanız, bu kadar çok sayıda NFT'yi rezervde tutmak için **en az 436 XRP** gerekebilir.

| Rezerv Türü          | Miktar  |
|:---------------------|--------:|
| Temel                | 10 XRP  |
| NFToken Sayfaları    | 26 XRP  |
| NFToken Teklifleri   | 400 XRP |
| Toplam               | 436 XRP |

Gerekli rezervler, ayırmaktan rahat olduğunuz miktarı aşarsa, tek bir zamanda sahip olduğunuz NFT ve teklifler sayısını azaltmak için talep üzerine mintleme modelini kullanmayı düşünün. Ayrıntılar için `Toplu Mintleme` sayfasına bakın.