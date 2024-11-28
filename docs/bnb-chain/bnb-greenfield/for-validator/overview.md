---
title: Genel Bakış - BNB Greenfield
description: Bu belge, BNB Greenfield blockchain'in temel yapısını ve işleyişini ortaya koymaktadır. Greenfield blockchain, Cosmos/Tendermint altyapısı üzerine inşa edilmiş olup, çeşitli uygulama ve servis sağlayıcılarıyla etkileşimde bulunur.
keywords: [Greenfield, blockchain, BNB, Cosmos, Tendermint, hizmet sağlayıcıları, veri güvenliği]
---

# Genel Bakış

## Greenfield Blockchain Nedir

**Greenfield blockchain**, `Greenfield ekosistemi` içinde merkezi bir rol oynamaktadır. 
Platformun temelini oluşturur ve **Cosmos/Tendermint** altyapısı üzerine inşa edilmiştir. 
Greenfield blockchain içinde, **on-chain** olarak mevcut iki kategori durum bulunmaktadır:

- Hesaplar ve BNB bakiye defteri.
- Nesne depolama sistemi ile ilgili meta veriler, `Hizmet Sağlayıcıları (SP'ler)`, bu sistemde saklanan nesneler 
ve bu depolama ile ilgili izin ve faturalama bilgileri.

> Greenfield blockchain üzerinde gerçekleştirilen işlemler yukarıda bahsedilen durumları değiştirebilir. 
> Bu durumlar ve işlemler, BNB Greenfield ekonomik verilerinin çoğunu oluşturur.  
> — BNB Greenfield Ekonomi

## Greenfield Blockchain Nasıl Çalışır

**Greenfield Blockchain**, [Tendermint konsensüs](https://tutorials.cosmos.network/) mekanizmasını kullanarak, 
ağ güvenliğini sağlamak için [Proof-of-Stake](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/) yaklaşımını uygulamaktadır. 
Doğrulayıcı seçimi ve yönetimi, Cosmos SDK'nın yönetişim modülünü takip eden [öneri-oy mekanizması](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/governance.md) aracılığıyla 
yapılmaktadır. Greenfield'ın doğrulayıcıları her **2 saniyede** blok üretmektedir.

Blockchain'in yerel token'ı olarak, **BNB** hem gaz hem de yönetişim token'ı olarak görev yapmaktadır. İlk BNB, BNB 
Akıllı Zinciri (BSC) üzerinde kilitlenir ve daha sonra Greenfield üzerinde yeniden basılır. 

:::tip
Köprü zinciri iletişimi, BNB'nin ve veri işlem yapı taşlarının Greenfield ile BSC arasında akıcı bir şekilde hareket etmesini sağlar.
:::

BNB'nin toplam dolaşımı etkilenmez ve BNB Beacon Chain, BSC ve Greenfield boyunca hareket etmeye devam edecektir.

!!! tip
    [İşte Tendermint üzerine inşa edilmiş bir uygulama zincirinin çalışma ilkeleri hakkında iyi bir okumadır](https://docs.tendermint.com/v0.34/introduction/what-is-tendermint.html).

## Greenfield Blockchain'den Doğrulayıcı

Greenfield Blockchain'in doğrulayıcıları, ağın güvenliği ve güvenilirliği için son derece önemlidir. 
Ancak, sorumlulukları bunun çok ötesine geçmektedir:

1. Doğrulayıcılar, köprü zinciri olayları üzerinde uzlaşmayı sağlamak ve köprü zinciri paketlerini 
   hem Greenfield hem de BNB Akıllı Zinciri'ne iletmekle görevlidir. Bu, köprü zinciri işlemlerinin hızlı, 
   güvenli ve düşük maliyetlerle gerçekleştirilmesini sağlar.

2. Doğrulayıcılar, hizmet sağlayıcıları (SP'ler) tarafından sağlanan verilerin bütünlüğünü ve kullanılabilirliğini 
   sağlamada önemli bir rol oynamaktadır. Belirli ya da rastgele bir şekilde SP’lerin veri erişilebilirliğini sorgulayarak, 
   kötü niyetli aktörleri ve kalitesiz hizmet sunanları ayıklayabilirler. 
   
   :::warning
   Bu tür aktörleri uygun önlemlerle - örneğin, paylarını kesmek gibi - ceza vermek, 
   Greenfield ekosistemindeki hizmetlerin kalitesini ve güvenilirliğini sağlamaya yardımcı olmaktadır.
   :::

3. Doğrulayıcılar ayrıca ağın yönetiminde söz sahibidir. Greenfield ekosisteminin gelecekteki gelişimine ilişkin 
   konularda oylama yapar ve gerekli olduğu takdirde çeşitli ağ parametrelerini ayarlarlar. 

   :::note
   Bu, ağın zamanla sağlıklı ve sürdürülebilir kalmasını sağlar, 
   aynı zamanda kullanıcılarının değişen ihtiyaç ve taleplerini karşılar.
   :::