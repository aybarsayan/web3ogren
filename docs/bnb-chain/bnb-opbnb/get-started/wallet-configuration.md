---
title: Cüzdan Yapılandırması - opBNB
description: Bu rehber, opBNB ile uyumlu herhangi bir Ethereum veya BSC cüzdanını yapılandırmanıza yardımcı olacaktır. Metamask ve Trustwallet üzerinde adım adım talimatlar içermektedir.
keywords: [opBNB, cüzdan yapılandırması, Metamask, Trustwallet, BSC, ağ ayarları]
---

# Cüzdan yapılandırması

opBNB ile herhangi bir Ethereum veya BSC cüzdanı kullanabilirsiniz. Örneğin, Metamask ve Trustwallet'i opBNB için nasıl yapılandıracağınızı göstereceğim.

:::info
Cüzdanınızı opBNB ile çalışacak şekilde yapılandırmak için, hem BNB akıllı zincirini (Katman 1) hem de opBNB ağını (Katman 2) eklemeniz gerekecek.
:::

Aşağıdaki adımları takip edin:

1. Cüzdanınıza BNB akıllı zincirini ekleyin. Bu, opBNB'nin üzerinde inşa edildiği Katman 1 blok zinciridir.

   *Testnet*

   - Ağ Adı: BSC Testnet
   - RPC URL: [https://data-seed-prebsc-1-s1.bnbchain.org:8545](https://data-seed-prebsc-1-s3.bnbchain.org:8545/)
   - ChainID: 97
   - Sembol: tBNB
   - Gözlemci: [https://testnet.bscscan.com/](https://testnet.bscscan.com/)

   *Mainnet*

   - Ağ Adı: BSC Mainnet
   - RPC URL: [https://bsc.nodereal.io](https://bsc.nodereal.io)
   - ChainID: 56
   - Sembol: BNB
   - Gözlemci: [https://bscscan.com/](https://bscscan.com/)

2. Cüzdanınıza opBNB ağını ekleyin.

   *Testnet*

   - Ağ Adı: opBNB Testnet
   - RPC URL: [https://opbnb-testnet-rpc.bnbchain.org](https://opbnb-testnet-rpc.bnbchain.org)
   - ChainID: 5611
   - Sembol: tBNB
   - Gözlemci: [http://testnet.opbnbscan.com/](http://testnet.opbnbscan.com/)

   *Mainnet*

   - Ağ Adı: opBNB Mainnet
   - RPC URL: [https://opbnb-mainnet-rpc.bnbchain.org](https://opbnb-mainnet-rpc.bnbchain.org)
   - ChainID: 204
   - Sembol: BNB
   - Gözlemci: [http://opbnbscan.com/](http://opbnbscan.com/)

## Referanslar - Trustwallet veya Metamask nasıl yapılandırılır

[Trustwallet](https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph)

Trustwallet'i tarayıcınıza kurduktan sonra, ayarlar -> ağ kısmına gidebilirsiniz.

![img](../../images/bnb-chain/bnb-opbnb/img/add-bsc-trustwallet.png)

Özelleştirilmiş ağı ekle seçeneğini seçin ve yukarıda belirttiğim ağ bilgilerini girin.

_[Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)_

Metamask'i tarayıcınıza kurduktan sonra, ayarlar -> ağlar -> ağ ekle sayfasına gidebilirsiniz.

Manuel ağı ekle seçeneğini seçin ve ağ bilgilerini girin.

![img](../../images/bnb-chain/bnb-opbnb/img/add-bsc-metamask.png)

:::note
Konumunuza ve tercihinize bağlı olarak, BSC ve opBNB için çeşitli RPC uç noktalarından seçebilirsiniz. Uç noktalarının ve özelliklerinin ayrıntıları için hazırladığımız ağ bilgileri belgesine başvurabilirsiniz. 
:::

:::tip
En iyi performans ve kullanıcı deneyimini sağlamak için, cüzdanınızla yapılandırmadan önce her uç noktanın gecikmesini test edebilirsiniz.
:::