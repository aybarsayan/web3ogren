---
title: opbnbscan üzerinde doğrulama - opBNB
description: opBNBScan, geliştiricilerin akıllı sözleşmelerini doğrulamak için adım adım bir kılavuz sunar. Bu içerikte Hardhat ve Truffle kullanarak nasıl gerçekleştirileceğini öğrenin.
keywords: [opBNB, akıllı sözleşme, doğrulama, Hardhat, Truffle, API anahtarı, NodeReal]
---

# Hardhat ve Truffle ile sözleşmenizi doğrulamak için opBNBScan kullanın

opBNBScan, geliştiricilerin Truffle ve Hardhat gibi popüler geliştirme araçlarını kullanarak akıllı sözleşmelerini doğrulamaları için kullanışlı ve kullanıcı dostu bir platform sunar. opBNBScan'in akıllı sözleşme doğrulama API'leri ile başlamak için adım adım talimatlar aşağıda verilmiştir.

1. [NodeReal](http://nodereal.io) portalına gidin ve **Giriş** butonuna tıklayın.
2. GitHub hesabınızla veya Discord hesabınızla giriş yapın.
3. **Yeni anahtar oluştur** butonuna tıklayarak API anahtarınızı oluşturun.
4. API anahtarınızı panonuza kopyalayın ve akıllı sözleşme doğrulama API'lerinin anahtarı olarak kullanın.

## **Hardhat**

Yayımlanan akıllı sözleşmenizi doğrulamak için [hardhat-verify](https://hardhat.org/hardhat-runner/docs/guides/verifying) eklentisini kullanabilirsiniz. Hardhat belgesindeki adımları izleyebilirsiniz. Aşağıda hardhat.config.js dosyanızı nasıl yapılandıracağınıza dair bir örnek bulunmaktadır. Ağın yapılandırma ayarlarına dikkat edin ve gereksinimlerinize uygun ayarları değiştirin.

```typescript
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.19", // kendi solidity derleyici sürümünüzü değiştirin
  networks: {
    opbnb: {
      url: "https://opbnb-testnet-rpc.bnbchain.org/",
      chainId: 5611, // "opbnb" ağı için doğru chainId ile değiştirin
      accounts: ["{{YOUR-PRIVATE-KEY}}"], // Kullanılacak hesapların özel anahtarlarını veya mnemoniklerini ekleyin
      gasPrice: 20000000000,
    },
  },
  etherscan: {
    apiKey: {
      opbnb: "{{YOUR-NODEREAL-API-KEY}}", // kendi nodereal API anahtarınızı değiştirin
    },

    customChains: [
      {
        network: "opbnb",
        chainId: 5611, // "opbnb" ağı için doğru chainId ile değiştirin
        urls: {
          apiURL:
            "https://open-platform.nodereal.io/{{YOUR-NODEREAL-API-KEY}}/op-bnb-testnet/contract/",
          browserURL: "https://testnet.opbnbscan.com/",
        },
      },
    ],
  },
};
```

## **Truffle**

Ayrıca Truffle'ı kullanarak akıllı sözleşmenizi opBNBScan üzerinde doğrulayabilirsiniz.

:::tip
Truffle'ı kullanmadan önce **truffle-plugin-verify**'nin doğru bir şekilde yüklendiğinden emin olun ve eklentide 'truffle-plugin-verify' ekleyin.
:::

```typescript
module.exports = {
 plugins: [
  'truffle-plugin-verify'
 ],
 networks:
 {
  development: {
  	host: "127.0.0.1", // Localhost (varsayılan: yok)
  	port: 8545, // Standart port (varsayılan: yok)
  	network_id: "*", // Herhangi bir ağ (varsayılan: yok)
 	},
 	dashboard: {
  	verify: {
  	apiUrl: 'https://open-platform.nodereal.io/{{YOUR-NODEREAL-API-KEY}}/op-bnb-testnet/contract/',
  	apiKey: '{{YOUR-NODEREAL-API-KEY}}',
  	explorerUrl: 'https://testnet.opbnbscan.com/',
 		},
 			host: "127.0.0.1",
 			port: 24012,
 			network_id: "*"
		},
 },
// Burada varsayılan mocha seçeneklerini ayarlayın, özel raporlayıcılar vb. kullanın.
mocha: {
// timeout: 100000
},
// Derleyicilerinizi yapılandırın
compilers: {
	solc: {
		version: "0.8.15", // tam sürümü solc-bin'den alır (varsayılan: truffle'ın sürümü)
	}
},
```

Öncelikle akıllı sözleşmenizin yayımlandığından emin olun. **Özel kimlik bilgilerinizi yerel makinenize kaydetmemek için paneli kullanıyorum.**

```shell
npx truffle migrate –network dashboard
```

Ardından, sözleşme adınızı belirterek akıllı sözleşmenizi doğrulayabilirsiniz.

```shell
npx truffle run verify {{Your-Contract-Name}} --network dashboard
```

Daha sonra akıllı sözleşmenizin doğrulanıp doğrulanmadığını kontrol etmek için [opBNBScan explorer](https://testnet.opbnbscan.com/address/0x57996bA7FC3F0C61E7A949ac050b9E2437eA1972?p=1&tab=Contract) sayfasına gidebilirsiniz.

:::info
Ana ağ sözleşme doğrulaması için aşağıdaki URL'leri değiştirin:
- url: "https://opbnb-testnet-rpc.bnbchain.org/" 'yi "https://opbnb-mainnet-rpc.bnbchain.org/" ile değiştirin
- apiUrl: 'https://open-platform.nodereal.io/{{YOUR-NODEREAL-API-KEY}}/op-bnb-testnet/contract/' 'yi 'https://open-platform.nodereal.io/{{YOUR-NODEREAL-API-KEY}}/op-bnb-mainnet/contract/' ile değiştirin
:::