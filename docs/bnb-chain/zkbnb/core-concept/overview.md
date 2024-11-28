---
title: Genel Bakış - zkBNB Temel Kavramları
description: zkBNB, dijital varlık yönetimi ve NFT işlevselliği sunarak kullanıcıların etkin bir şekilde token'ları yönetmelerine olanak tanır. BSC ile entegre olan bu yapı, kullanıcı deneyimini geliştirirken, işlem kolaylığı sağlar.
keywords: [zkBNB, dijital varlık, NFT, BSC, token yönetimi, blokzincir, ECDSA]
---

## Temel Özellikler

### Dijital Varlık Yönetimi
zkBNB, dijital varlıkların ihraç edilmesi, kullanılması, ödenmesi ve değiştirilmesi için alternatif bir pazar olarak hizmet verecektir. zkBNB ve BSC, BNB, BEP2 ve NFT tokenları için aynı token evrenini paylaşır. Bu şunu tanımlar:

- Aynı token, her iki ağda da dönebilir ve **L1  L2** iletişimi aracılığıyla iki yönlü akış gerçekleştirebilir.
- Aynı token'ın toplam dolaşımı, iki ağ üzerinde yönetilmelidir; yani bir token'ın toplam etkili arzı, hem BSC hem de BC üzerindeki token'ın toplam etkili arzının toplamı olmalıdır.
- Token'lar yalnızca BSC üzerinde **BEP20** olarak başlangıçta oluşturulabilir, ardından zkBNB'ye bağlanabilir. Token'ı zkBNB'ye bağlamak için izin almak gerekmemektedir.

Kullanıcı, zkBNB'de hem fungible token hem de non-fungible token'ı **yatırabilir, transfer edebilir ve çekebilir**.

Kullanıcılar, zk-rollup'a BSC üzerinde dağıtılan rollup sözleşmesine **token yatırarak** girerler. zkBNB izleyici, yatırımları takip eder ve bunları bir layer2 işlemi olarak gönderir; bir komitör işlemi doğruladığında, kullanıcılar hesaplarına fon alırlar ve işlemleri işlenmesi için komitöre göndererek işlem yapmaya başlayabilirler.

Kullanıcı, zkBNB üzerindeki herhangi bir mevcut hesaba herhangi bir miktar fonu **transfer edebilir**; bunu ağ üzerine imzalı bir işlem göndererek gerçekleştirir.

zkBNB'den BSC'ye **çekim** yapmak basittir. Kullanıcı, çekim işlemini başlatır; fon zkBNB'de yakılacaktır. Sonrasında bir sonraki **batch**'teki işlem rolluplandığında, belirli bir miktarda token, rollup sözleşmesinden hedef hesaba açılacaktır.

### NFT Yönetimi ve Pazar Yeri
Kullanıcılara göz atabilecekleri, satın alabilecekleri, satabilecekleri veya kendi NFT'lerini oluşturabilecekleri açık kaynaklı bir NFT pazarı sağlamayı hedefliyoruz. zkBNB'deki NFT'nin meta verisi [BSC standartlarına](https://docs.bnbchain.org/docs/nft-metadata-standard/) bağlıdır. **ERC721** standart NFT, zkBNB'ye sorunsuz bir şekilde yatırılabilir veya tersine yapılabilir.

![Pazar yeri çerçevesi](../../images/bnb-chain/zkbnb/static/NFT_Marketplace.png)

Yukarıdaki diyagram, **Nft Pazarı** ve zkBNB'nin çerçevesini göstermektedir. Tüm alım/satım teklifleri, NFT/Koleksiyonun meta verileri, medya kaynakları ve hesap profilleri NFT pazarının arka planında depolanmaktadır; yalnızca **contendHash**, **sahiplik**, **creatorTreasuryRate** ve birkaç başka alan zkBNB üzerinde kaydedilmektedir. 

:::tip
Fiyat keşfini teşvik etmek için, kimse zkBNB'ye gönderilmeyen tekliflerin arka planda önbelleğe alındığı için pazara ücret ödemeden alım/satım teklifi verebilir.
:::

Teklif eşleştirildiğinde, alım ve satım tekliflerini içeren bir **AtomicMatch** işlemi zkBNB'ye gönderilir ve ticaret gerçekleştirilir. Kullanıcılar ayrıca arka planda önbelleğe alınmış teklifi devre dışı bırakmak için bir iptal teklifi işlemi göndererek bir teklifi manuel olarak iptal edebilirler.

### Sorunsuz L1 Cüzdan Yönetimi
zkBNB, yerel olarak ECDSA imzalarını destekler ve [EIP712](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md) imzalama yapısını takip eder; bu da çoğu Ethereum cüzdanının zkBNB'yi sorunsuz bir şekilde destekleyebileceği anlamına gelir. 

:::info
BSC kullanıcılarının zkBNB'den yararlanması için ekstra bir çaba gerekmemektedir.
:::