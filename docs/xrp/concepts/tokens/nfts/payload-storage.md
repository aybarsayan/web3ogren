---
title: NFT Yük Depolama
seoTitle: NFT Payload Storage Solutions
sidebar_position: 4
description: NFTlerin yükünü depolamak için merkeziyetsiz ve merkezi çeşitli yöntemlerin keşfi. XRP Defteri ve diğer çözümler hakkında bilgi sağlayarak depolama stratejileri sunmaktadır.
tags: 
  - NFT
  - yük depolama
  - IPFS
  - Arweave
  - XRP Defteri
  - merkezi olmayan depolama
keywords: 
  - NFT
  - yük depolama
  - IPFS
  - Arweave
  - XRP Defteri
  - merkezi olmayan depolama
---

# NFT Yük Depolama

NFT'ler blokzincirinde oluşturulmaktadır. Ancak NFT'nin yükü, medya, meta veriler ve özellikler dahil olmak üzere, XRP Defteri üzerinde; merkezi olmayan, XRP Defteri dışında ve merkezi, XRP Defteri dışında çeşitli yollarla depolanabilir.

## XRP Defteri Üzerinde

Veriniz 256 bayttan küçükse, `data://` URI'sini kullanarak bunu doğrudan URI alanına gömmeyi düşünebilirsiniz. Bu, verileri güvenilir, kalıcı ve yanıt veren bir veritabanında depolama avantajına sahiptir.

:::tip
**İpuçları:** Verinizi `data://` URI'si ile gömmek, yükü çözümlemenin en basit yollarından biridir.
:::

## XRP Defteri Dışında Merkezi Olmayan

NFT meta verileriniz için mevcut olan herhangi bir merkezi olmayan depolama çözümünü kullanabilirsiniz.

IPFS ve Arweave, merkeziyetsizlik için çözümler sunmaktadır. Ancak, meta verileri verimli bir şekilde almak bir sorun olabilir. 

> **Anahtar Nokta:** IPFS veya Arweave'ı doğrudan sorgulamak, NFT'lerin yüksek kaliteli medya içeren birçok sayfasında kaydırma yapan kullanıcıların anlık yanıt gerektiren modern web siteleri için yeterince hızlı değildir.  
> — NFT Depolama Rehberi

Bulut depolama çözümleri ile ilgili bazı örnekler için [NFT Yük Depolama Seçenekleri](https://dev.to/ripplexdev/nft-payload-storage-options-569i) başlıklı blog yazısını inceleyin.

## XRP Defteri Dışında Merkezi

Yükün sunulduğu bir web sunucusuna işaret etmek için URI alanını kullanabilirsiniz.

:::info
**Ek Bilgi:** Alternatif olarak, defter üzerindeki alanı kaydetmek için, `AccountSet` kullanarak vericinin `Domain` alanını ayarlayabilir ve NFT'nin token ID'sini o alan üzerinde bir yol olarak düşünebilirsiniz.
:::

Örneğin, NFT'nin ID'si `123ABC` ve vericideki alan `example.com` ise, yükü `example.com/tokens/123ABC` adresinden sunabilirsiniz.