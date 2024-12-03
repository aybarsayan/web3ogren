---
title: NFTleri Koleksiyon Halinde Mintlemek
seoTitle: Nasıl NFT Koleksiyonu Oluşturulur NFTokenTaxon Kullanımı
sidebar_position: 4
description: NFTleri koleksiyonlar halinde mintlemek için kullanılacak olan NFTokenTaxon alanı ve detayları hakkında bilgi. Bu yazıda, takson değerlerinin nasıl kullanılacağı ve koleksiyon oluşturma süreci ele alınmaktadır.
tags: 
  - NFT
  - NFTokenTaxon
  - koleksiyon
  - mintleme
  - fungible olmayan tokenlar
keywords: 
  - NFT
  - NFTokenTaxon
  - koleksiyon
  - mintleme
  - fungible olmayan tokenlar
---

# NFT'leri Koleksiyon Halinde Mintlemek

NFT'leri koleksiyonlar halinde gruplayabilmek için `NFTokenTaxon` alanını kullanabilirsiniz. Minter olarak, `0x0` ile `0xFFFFFFFF` arasında herhangi bir sayısal değeri seçebilir ve bunu oluşturduğunuz NFT'lere atayabilirsiniz. Taksonun önemi tamamen size bağlıdır.

:::tip
İlk koleksiyonunuz için `NFTokenTaxon` değerini `1` olarak ayarlayabilirsiniz.
:::

**Örnek**:
- `316`, `420` veya `911` takson değerlerine sahip NFT'lerden oluşan bir koleksiyon oluşturabilirsiniz.
- NFT türünü belirtmek için bir rakamla başlayan taksonlar kullanabilirsiniz (örneğin, tüm Gayrimenkul NFT'leri `2` ile başlayan bir taksona sahiptir).

:::info
`NFTokenTaxon` alanı zorunlu olmakla birlikte, bir koleksiyon oluşturmayı planlamıyorsanız, değeri `0` olarak ayarlayabilirsiniz.
:::

> **Not:** `NFTokenTaxon` hakkında daha fazla bilgi için `NFTokenTaxon` bağlantısına bakın.