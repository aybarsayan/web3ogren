---
title: NFT APIleri
seoTitle: NFT APIleri - Güçlü NFT İşlemleri için Rehber
sidebar_position: 4
description: Bu sayfa, NFT işlemleri ve talepleri hakkında faydalı bilgiler sağlamaktadır. NFTlerle ilgili APIlerin nasıl kullanılacağını keşfedin.
tags: 
  - NFT
  - API
  - blockchain
  - Clio
  - fungible olmayan tokenlar
keywords: 
  - NFT
  - API
  - meta veriler
  - blockchain
  - Clio
  - fungible olmayan tokenlar
  - NFT işlemleri
---

# NFT API'leri

Bu sayfa, NFT'lerle ilgili işlemleri ve talepleri pratik bir referans olarak listelemektedir.

## NFT Defter Kayıtları

- [NFToken][] veri türü - Defterde saklanan NFT nesnesi.
- Defter Kayıtları:
    - [NFTokenOffer girişi][] - Bir NFT'yi satın almak veya satmak için yapılan bir teklif.
    - [NFTokenPage girişi][] - Bir NFT sayfası maksimum 32 NFT tutar. Pratikte, her NFT sayfası genellikle 16-24 NFT tutar.

## NFT İşlemleri

:::tip
NFT oluşturma ve alma süreçlerinde dikkatli olunmalı, her adımda doğru bilgilerin girilmesi önemlidir.
:::

- [NFTokenMint][] - Bir NFT oluşturun.
- [NFTokenCreateOffer][] - Bir NFT'yi satın almak veya satmak için bir teklif oluşturun.
- [NFTokenCancelOffer][] - Bir NFT'yi satın almak veya satmak için teklifi iptal edin.
- [NFTokenAcceptOffer][] - Bir NFT'yi satın almak veya satmak için teklifi kabul edin.
- [NFTokenBurn][] - Bir NFT'yi kalıcı olarak yok edin.

## NFT Talepleri

:::info
Bu API'ler, NFT'lerle ilgili çeşitli bilgi talepleri için kullanılabilir.
:::

- [account_nfts yöntemi][] - Bir hesap tarafından sahip olunan fungible olmayan tokenların listesini alın.
- [nft_buy_offers yöntemi][] - Belirli bir NFToken nesnesi için satın alma tekliflerinin listesini alın.
- [nft_sell_offers yöntemi][] - Belirli bir NFToken nesnesi için satış tekliflerinin listesini alın.
- [subscribe yöntemi][] - Belirli bir konu hakkında güncellemeleri dinleyin. Örneğin, bir pazar yeri kendi platformunda listelenen NFT'lerin durumuyla ilgili gerçek zamanlı güncellemeler yayınlayabilir.
- [unsubscribe yöntemi][] - Bir NFT hakkında güncellemeleri dinlemeyi durdurun.

## Clio

`Clio sunucuları` ayrıca NFT'lerle ilgili aşağıdaki API'leri sağlar:

- `nft_info` - Belirtilen NFT hakkında mevcut durum bilgilerini alın.
- `nft_history` - Belirtilen NFT için geçmiş işlem meta verilerini alın.

Bir kamu Clio sunucusuna erişmek için, URL'sine ve Clio portuna (genellikle 51233) bir istek göndererek ulaşabilirsiniz. Kamu Clio API sunucuları, SLAs ile birlikte gelmez ve öncelikli olarak düzeltilme sorumluluğu yoktur. İş kullanım durumunuz sürekli izleme ve bilgi talepleri gerektiriyorsa, kendi Clio sunucu örneğinizi kurmayı düşünün. `install-clio-on-ubuntu` adresine bakın.

:::warning
Kamu Clio sunucularında sürekli erişim sağlayamayan durumlar söz konusu olabilir. Kendi sunucunuzu kurarak bu sorunları önleyebilirsiniz.
:::

