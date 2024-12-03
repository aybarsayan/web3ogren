---
title: Değiştirilemez Tokenler
seoTitle: XRP Ledgerda Değiştirilemez Tokenler
sidebar_position: 4
description: XRPL NFTlere Giriş. Bu bölümde, XRP Ledger üzerinde değiştirilemez tokenlerin nasıl işlediği ve bunların mintlenmesi, satılması ve yakılması ile ilgili süreçleri keşfedeceksiniz.
tags: 
  - NFT
  - XRP Ledger
  - değiştirilemez tokenler
  - mintleme
  - NFT yaşam döngüsü
keywords: 
  - NFT
  - XRP Ledger
  - değiştirilemez tokenler
  - mintleme
  - NFT yaşam döngüsü
---

# Değiştirilemez Tokenler

XRP Ledger, yerel olarak değiştirilemez tokenleri (NFT'ler veya günlük dilde “nifties”) destekler. Değiştirilemez tokenler, sanat eserleri veya oyun içi öğeler gibi benzersiz fiziksel, fiziksel olmayan veya tamamen dijital varlıkların mülkiyetini kodlamak için kullanılır.

_(Ekleme, [NonFungibleTokensV1_1 amendment][] tarafından yapılmıştır.)_

Bu tür dijital varlıkları temsil etmek için, XRP Ledger'ın Değiştirilemez Tokenler özelliğini kullanın (bazen standart taslak numarası ile anılır, [XLS-20](https://github.com/XRPLF/XRPL-Standards/discussions/46)).

## XRP Ledger'daki NFT'ler

XRP Ledger'da, bir NFT, bir [NFToken][] nesnesi olarak temsil edilir. Bir NFT, ödemeler için kullanılmayan benzersiz, bölünemez bir birimdir. Kullanıcılar NFT'leri mint (oluşturma), tutma, satın alma, satma ve yakma (imha etme) işlemlerini gerçekleştirebilir.

:::tip
NFT'lerinizi mintlerken doğru ayarları yapmayı unutmayın!
:::

Defter, aynı hesap tarafından sahip olunan en fazla 32 NFT'yi tek bir [NFTokenPage nesnesi][] içinde saklar. Bunun sonucunda, sahibin `rezerv gereksinimi` yalnızca defterin ek token'lar saklamak için yeni bir sayfa oluşturması gerektiğinde artar.

Hesaplar aynı zamanda NFT'leri kendi adlarına satan veya mint eden bir _Aracı_ veya _Yetkili Mintleyen_ atayabilir.

NFT'lerin mint edildiği zaman tanımlanan birkaç değişmez ayarı vardır. Bunlar şunlardır:

- Token'ı benzersiz şekilde tanımlayan veriler.
- Vericinin, token'ı kimin elinde olursa olsun yakıp yakamayacağı.
- Token'ın sahibinin onu başkalarına aktarabilip geçiremeyeceği. (Bir NFT her zaman vericiye doğrudan gönderilebilir.)
- Aktarımlara izin veriliyorsa, verici satış fiyatının bir yüzdesi kadar transfer ücreti talep edebilir.
- Sahibinin NFT'yi `değiştirilebilir token` miktarlarıyla mı, yoksa yalnızca XRP ile mi satabileceği.

## NFT Yaşam Döngüsü

Herkes yeni bir NFT oluşturmak için [NFTokenMint işlemi][] kullanabilir. NFT, çıkaran hesabın [NFTokenPage nesnesi][] üzerinde yaşar. Ya sahibi ya da bir ilgilenen taraf, NFT'yi satın alma veya satma teklifinde bulunmak için [NFTokenCreateOffer işlemi][] gönderebilir; defter, önerilen transferi [NFTokenOffer nesnesi][] olarak izler ve taraflardan biri teklifi kabul ettiğinde veya iptal ettiğinde `NFTokenOffer`'ı siler. NFT transfer edilebilir ise, hesaplar arasında birden fazla kez takas edilebilir.

Sahip olduğunuz bir NFT'yi, [NFTokenBurn işlemi][] kullanarak imha edebilirsiniz. Eğer verici token'ı `tfBurnable` bayrağı etkinleştirilerek mint etmişse, verici token'ı şu anki sahibine bakılmaksızın da yakabilir. (Bu, örneğin, belirli bir zamanda kullanılan bir etkinlik bileti temsil eden bir token için yararlı olabilir.)



:::info
NFT'lerin transferi hakkında daha fazla bilgi için `XRP Ledger üzerinde NFT Ticaretine` bakın.
:::

raw-partial file="/docs/_snippets/common-links.md