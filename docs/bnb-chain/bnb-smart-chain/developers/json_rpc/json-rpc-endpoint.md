---
title: JSON-RPC-Uç Noktası - BSC Geliştirici
description: JSON-RPC uç noktaları, BNB Chain için dağıtık uygulamalara erişim sağlar. Bu belge, BNB Akıllı Zincir'e bağlanmak için kullanılan RPC uç noktalarını ve özelliklerini kapsamaktadır.
keywords: [JSON-RPC, BNB Chain, BSC, RPC uç noktası, Akıllı Zincir]
---

# JSON-RPC-Uç Noktası

JSON-RPC uç noktaları, bir programın sunucu verilerine erişmek için RPC isteklerini aktarabileceği ağ konumunu ifade eder. Dağıtık bir uygulama bir RPC uç noktasına bağlandığında, blok zinciri verilerinin gerçek zamanlı kullanımını sağlayabilecek çeşitli işlemlerin işlevlerine erişebilirsiniz. BNB Chain, hem ana ağ (Mainnet) hem de test ağı (Testnet) için çeşitli RPC uç noktaları sağlamaktadır. Bu bölümde, BNB Akıllı Zincir'e bağlanmak için kullanılabilecek JSON-RPC uç noktalarını listeleyeceğiz.

## BSC ağını bir tıklama ile ekleme

:::tip
[ChainList](https://chainlist.org/chain/56) adresini ziyaret edin ve cüzdanınıza bağlanın, bu canlı RPC uç noktalarını ekleyecektir.
:::

## BNB Akıllı Zincir için RPC Uç Noktaları

*BSC uç noktasının Testnet ve Mainnet üzerindeki oran sınırı **10K/5dakika**'dır.*

> `eth_getLogs` aşağıdaki Mainnet uç noktalarında devre dışı bırakılmıştır, lütfen **[buradan](https://chainlist.org/chain/56)** üçüncü taraf uç noktalarını kullanın. Sıklıkla log çekmeniz gerekiyorsa, mevcut olduğunda yeni logları size iletmek için WebSocket kullanmanızı öneririz.  
> — BNB Documentation

### BSC Mainnet (ChainID 0x38, onaltılık 56)

- https://bsc-dataseed.bnbchain.org
- https://bsc-dataseed.nariox.org
- https://bsc-dataseed.defibit.io
- https://bsc-dataseed.ninicoin.io
- https://bsc.nodereal.io
- https://bsc-dataseed-public.bnbchain.org
- https://bnb.rpc.subquery.network/public

Daha fazla uç nokta için **[buradan](https://chainlist.org/chain/56)** bilgi alabilirsiniz.

### BSC Testnet (ChainID 0x61, onaltılık 97)

- https://bsc-testnet-dataseed.bnbchain.org
- https://bsc-testnet.bnbchain.org
- https://bsc-prebsc-dataseed.bnbchain.org

### RPC Sağlayıcıları

- **Moralis:** 
- **NodeReal:** 
- **Ankr:** 
- **Chainstack:** 
- **GetBlock:** 
- **QuickNode:** 
- **BlockVision:** 
- **4EVERLAND:** 
- **NOWNodes:** 
- **dRPC:** 
- **SubQuery:** 
- **All That Node:** 
- **Alchemy:** 

### HTTP JSON-RPC Başlatma

HTTP JSON-RPC'yi --http bayrağı ile başlatabilirsiniz:
```bash
## mainnet
geth attach https://bsc-dataseed.bnbchain.org

## testnet
geth attach https://bsc-testnet-dataseed.bnbchain.org
```

## JSON-RPC API Listesi

BSC (BNB Akıllı Zinciri) EVM uyumlu olup, Go-Ethereum API'si ile mümkün olduğunca uyumlu olmaya çalışmaktadır. Ancak, BSC'nin daha hızlı nihai sonuç ve yürütme katmanında blob verilerinin depolanması gibi kendi özel özellikleri vardır ve bu özellikler kendi uzmanlaşmış API'lerini gerektirir.

### Geth(Go-Ethereum) API

BSC, Geth API'leri ile neredeyse tamamen uyumludur. Herhangi bir istisna veya uyumsuzluk açıkça belirtilmiştir. Belirli bir API'nin ayrıntılı kullanımını arıyorsanız, muhtemelen aşağıdaki bağlantıda yanıtı bulacaksınız:

[Geth JSON-RPC API dökümantasyonu](https://geth.ethereum.org/docs/interacting-with-geth/rpc).

### Nihai Sonuç

Ethereum'un PoS konsensüs protokolü olan "Gasper", LMD-GHOST (bir fork seçim kuralı) ve Casper FFG (bir nihai son gadget) üzerine inşa edilmiştir. Benzer şekilde, BSC'nin konsensüs protokolü "Parlia", FFG ile birlikte zorluk tabanlı bir fork seçim mekanizması üzerine inşa edilmiştir; bu durum [BEP-126](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP126.md) belgesinde açıklanmıştır. 

:::info
BSC'nin verimliliğini artırmak için, doğrulayıcıların birden fazla ardışık blok üretmelerine izin verilir; bu durum [BEP-341](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP-341.md) belgesinde açıklanmaktadır. Bu farklılıklar nedeniyle, BSC'nin Ethereum ile karşılaştırıldığında benzersiz bir nihai sonuç süreci bulunmaktadır. Daha fazla ayrıntı için lütfen aşağıdaki belgeye başvurun:
`BSC Nihai Sonuç API'si`.
:::

### Blob

BSC, [BEP-336](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP-336.md) belgesinde açıklandığı gibi Shard Blob İşlemlerini destekleyen EIP-4844'ü uygulamıştır. Daha fazla bilgi için lütfen aşağıdaki belgeye başvurun: `BSC Blob API`.

### Diğer BSC API'leri

BSC, `BSC API` belgesinde açıklandığı gibi bazı diğer API'leri uygulamıştır.