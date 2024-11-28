---
title: opBNB Üzerine İnşa - opBNB SSS
description: opBNB ile akıllı sözleşme doğrulama, hizmetler, token bilgileri ve diğer konular hakkında detaylı bilgiler sunulmaktadır. Bu içerik, geliştiricilerin opBNB platformunu etkin bir şekilde kullanabilmesine yardımcı olmayı amaçlamaktadır.
keywords: [opBNB, akıllı sözleşme, proxy, RPC, NFT, airdrop, doğrulama]
---

### API GET isteği kullanarak bir akıllı sözleşmenin opBNB üzerinde doğrulanıp doğrulanmadığını nasıl kontrol edebilirim?

[API anahtarı](https://nodereal.io/meganode) ve akıllı sözleşme adresi ile sözleşmenin doğrulama durumu, kaynak kodu ve ABI'sini alabilirsiniz.

- opBNB ana ağında: `https://open-platform.nodereal.io/{{yourAPIkey}}/op-bnb-mainnet/contract/?action=getsourcecode&address={{contract address}}`
- opBNB test ağında: `https://open-platform.nodereal.io/{{yourAPIkey}}/op-bnb-testnet/contract/?action=getsourcecode&address={{contract address}}`

### Neden opBNBscan'de doğrulanmış bir sözleşme olmasına rağmen token bilgilerim (isim, sembol gibi) görüntülenmiyor?

:::warning
Eğer dağıtılan sözleşme bir proxy sözleşmesi ise, bilgi görüntülenmeyecektir çünkü opBNBscan, token detaylarını (isim, sembol vb.) almak için geliştirilmiş bir API kullanır. 
:::

Bu durumda, geliştirilmiş API'nin token detaylarını almak için uygulama sözleşmesine çağrı yapması gerekmektedir. Şu anda, proxy sözleşmesinden dönen token bilgisi boşsa uygulama sözleşmesine çağrı yapacak geliştirilmiş API'nin üzerinde çalışıldığı bir özellik geliştirilmektedir.

### Özel RPC erişimi satın alabileceğimiz üçüncü taraf sağlayıcı hizmetleri nelerdir?

Özel RPC erişimi satın alabileceğiniz yer [Nodereal](https://nodereal.io/meganode).

### opBNB üzerinde projeler için herhangi bir hibe veya mali destek var mı?

Evet, hibe veya finansman projeleri konusunda opBNB için de BNB Akıllı Zincir ile aynı desteği sağlıyoruz. Ayrıntılar için [buraya](https://www.bnbchain.org/en/developers/developer-programs) göz atın.

### opBNB üzerinde düğüm çalıştırma imkanı var mı?

opBNB üzerinde düğüm nasıl çalıştırılacağını öğrenmek için resmi `belgelere` bakın.

### Bir yerel projenin opBNB üzerinde token'ını yerel olarak çıkarması mümkün mü?

Evet, bu projenin tercihine bağlıdır.

### Projeleri başlatmak için önerilen yaklaşım nedir, proje önce opBNB'de yerel olarak mı başlatılmalı yoksa tam tersi mi?

L2 veya L1 seçimi, projenin özel ihtiyaçlarına bağlıdır. **L2**, daha iyi performans ve daha düşük maliyet sunar, bu nedenle bu faktörler proje için önemliyse L2'yi başlangıç noktası olarak kullanmanız önerilir.

### Gelecekte OPStack üzerinde inşa edilen diğer zincirlerle paylaşılan bir sıralayıcı/likitlik olasılığı var mı?

Maalesef, kısa vadede bu BNB Zincir ekibinin hedefidir.

### opBNB zinciri ve sözleşmeleri için hangi programlama dili kullanılıyor?

Önceden dağıtılan akıllı sözleşmeler **Solidity** dilinde yazılmıştır ve opBNB OP Stack çerçevesi ile inşa edilmiştir. Ayrıntılar için lütfen `resmi belgelere` başvurun.

### opBNB için herhangi bir airdrop var mı?

:::info
Şu anda opBNB için planlanan bir airdrop olmadığını belirtmek isteriz. Lütfen aksi yönde herhangi bir iddia veya mesaj konusunda dikkatli olun. Potansiyel dolandırıcılıklardan korunmak için dikkatli olun ve bilgileri resmi kaynaklardan doğrulayın.
:::

### opBNB hangi oracle ve VRF'leri destekliyor?

opBNB, herhangi bir VRF ve oracle hizmetinin entegre edilmesine izin veren bir **izin gerektirmeyen zincirdir**. opBNB üzerinde başlatılan ilk iki hizmet **Binance Oracle** ve **Polythera**'dır ve bu hizmetler akıllı sözleşmeler için güvenilir ve güvenli veri akışları sağlamaktadır.

### Tüm mevcut yöntemlerle akıllı sözleşmeyi doğrulama konusunda sorun yaşarsam ne yapmalıyım?

Akıllı sözleşmelerinizi doğrulamak için alternatif tarayıcıyı deneyin: .

### opBNB için hardhat doğrulama parametrelerini nasıl ayarlıyoruz?

Hardhat belgelere [buradan](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#adding-support-for-other-networks) bakabilirsiniz.

### opBNB, NFT’lerle ilişkili metadata'nın depolama ve yürütülmesini nasıl yönetiyor?

opBNB üzerinde NFT oluşturma ve depolama süreci diğer blok zincirleriyle benzerdir. NFT'nizin özelliklerini ve işlevlerini tanımlayan bir akıllı sözleşmeye sahip olmanız ve bunu opBNB'ye dağıtmanız gerekmektedir. NFT’nizin ismi, açıklaması, resmi ve diğer özellikleri gibi metadata'yı depolamak için çeşitli depolama çözümleri kullanabilirsiniz. 

Bazı örnekler:
- **BNB Greenfield**
- **IPFS**
- **Filecoin**

### Neden opBNB düğümüm güncel blokları yakalayamıyor?

:::warning
Düğümün zincirinin fork edilmiş olması ve diğer düğümlerden farklı olma olasılığı vardır.
:::

Eğer zincir bir hard fork nedeniyle fork edilmişse, blockchain'i sıfırlamanız ve programın en son versiyonu ile senkronize etmeniz önerilir:

1. OP Geth'teki veri dizinini temizleyin.
2. opbnb'yi en son sürüme güncelleyin: `git clone -b v0.x.x git@github.com:bnb-chain/opbnb.git`
3. op-geth'yi en son sürüme güncelleyin: `git clone -b v0.x.x git@github.com:bnb-chain/op-geth.git`

Düğüm tekrar senkronize etmek için `buradaki` talimatları izleyin. Sadece opbnb ve op-geth'nin en son sürümünü kullandığınızdan ve yeni sürüm `genesis.json` ve `rollup.json` kullandığınızdan emin olun.

### Hardhat ile opbnb-testnet'te ERC1967Proxy güncellenebilir sözleşmeyi nasıl doğrulayabilirim?

Proxy'yi doğrulamak için **solc-input.json**'u kullanmak üzere, [Etherscan/BscScan/PolygonScan](https://forum.openzeppelin.com/t/how-to-verify-a-contract-on-etherscan-bscscan-polygonscan/14225#if-proxy-is-not-verified-10) üzerindeki sözleşmeyi nasıl doğrulayacağınızla ilgili talimatları izleyebilirsiniz.

### Doğrulama için proxy'nin yapıcı argümanlarını nasıl elde edebilirim?

_data argümanını oluşturmak için ihtiyacımız var: 

1. Fonksiyon adı.
2. Sahip adresi + argüman1 + argüman2 + vb. Sonra "Encoded data"yı kopyalayın, metnin başına "0x" ekleyin ve bunu _data (Bytes) argümanı olarak yapıştırın. Ayrıntılar için lütfen [openzeppelin belgelerine](https://forum.openzeppelin.com/t/how-to-verify-upgradeable-contract-on-opbnb-testnet-by-hardhat/39495/6?u=serghd) başvurun. Daha kolay bir yol, proxy'niz için oluşturma işlemine ait verilerin giriş verisini görmektir: https://testnet.opbnbscan.com/tx/0xa287b0b69472cb4961c528b16e799136a520f700b5407595314c3cdd0a21f8d6?tab=overview 
3. Kodun son kısmında kodlanmış yapıcı argümanları görebilirsiniz.