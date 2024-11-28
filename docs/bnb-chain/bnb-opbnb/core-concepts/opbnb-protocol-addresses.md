---
description: opBNB protokol adresleri hakkında detaylı bilgiler ve sözleşme açıklamaları içerir. Burada, testnet ve mainnet için önemli adresleri bulabilirsiniz.
keywords: [opBNB, protokol, akıllı sözleşmeler, testnet, mainnet, L1, L2]
---

# opBNB Protokol Adresleri

opBNB protokol sözleşmeleri, opBNB ağında işlem gerçekleştirilmesini sağlayan akıllı sözleşmelerdir. Ana sözleşmeler şunlardır:

- **batchInbox**: Bu sözleşme, L1 üzerinde Sequencer'dan gelen işlem gruplarını alır.
- **batchSender**: Bu sözleşme, batchInbox'a işlem gruplarını gönderen yetkili göndericidir. opBNB ağının parametrelerini yöneten SystemConfig sözleşmesi tarafından değiştirilebilir.
- **outputProposer**: Bu sözleşme, opBNB düğümlerinin yürütmesi için çıktılar önerir. batchInbox ve diğer kaynaklardan girişler alır ve opBNB protokol kurallarıyla tutarlı çıktılar üretir.

---

**Testnet:**

| **İsim**        | **Adres**                                                  |
| --------------- | ------------------------------------------------------------ |
| Batch Sender    | [0x1Fd6A75CC72f39147756A663f3eF1fc95eF89495](https://testnet.bscscan.com/address/0x1fd6a75cc72f39147756a663f3ef1fc95ef89495) |
| Batch Inbox     | [0xfF00000000000000000000000000000000005611](https://testnet.bscscan.com/address/0xff00000000000000000000000000000000005611) |
| Output Proposer | [0x4aE49f1f57358c13A5732cb12e656Cf8C8D986DF](https://testnet.bscscan.com/address/0x4ae49f1f57358c13a5732cb12e656cf8c8d986df) |

**Mainnet:**

| **İsim**        | **Adres**                                                  |
| --------------- | ------------------------------------------------------------ |
| Batch Sender    | [0xef8783382eF80Ec23B66c43575A6103dECA909c3](https://bscscan.com/address/0xef8783382eF80Ec23B66c43575A6103dECA909c3) |
| Batch Inbox     | [0xff00000000000000000000000000000000000204](https://bscscan.com/address/0xff00000000000000000000000000000000000204) |
| Output Proposer | [0xc235c904AD9EfcABfF4628E3279994A4c0A9d591](https://bscscan.com/address/0xc235c904AD9EfcABfF4628E3279994A4c0A9d591) |

###  

## L1 Sözleşme Adresleri

**Testnet**

| **İsim**                          | **Açıklama**                                              | **Adres**                                                  |
| --------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| L1CrossDomainMessenger            | Layer 1 (L1) üzerinde alanlar arası iletişimi sağlamakla sorumludur | [0x5b0c605c707979e8bDc2Ad9271A0388b3fD4Af3E](https://testnet.bscscan.com/address/0x5b0c605c707979e8bDc2Ad9271A0388b3fD4Af3E) |
| L1ERC721Bridge                    | Bu sözleşme, L1 ve L2 arasında değiştirilemeyen jetonları (NFT) aktarabilen muhtemelen bir ERC-721 köprüsüdür | [0xad39e2cfa7d8d8B6c2d56244Bfb88990EC31Bb79](https://testnet.bscscan.com/address/0xad39e2cfa7d8d8B6c2d56244Bfb88990EC31Bb79) |
| L1ERC721BridgeProxy               | L1ERC721Bridge sözleşmesi için ek işlevsellik sağlayabilecek bir proxy sözleşmesidir. | [0x17e1454015bFb3377c75bE7b6d47B236fd2ddbE7](https://testnet.bscscan.com/address/0x17e1454015bFb3377c75bE7b6d47B236fd2ddbE7) |
| L1StandardBridge                  | L1 ve L2 arasında değiştirilebilir jetonların aktarımını sağlayan standart bir köprü sözleşmesidir. | [0xddB9EB847971DaA82e5dbe2745C429A3B2715B46](https://testnet.bscscan.com/address/0xddB9EB847971DaA82e5dbe2745C429A3B2715B46) |
| L2OutputOracle                    | Bu sözleşme, akıllı sözleşmeler ve uygulamalarda kullanılmak üzere veri sağlayan bir oracle'dır | [0xD92aEF4473093C67A7696e475858152D3b2acB7c](https://testnet.bscscan.com/address/0xD92aEF4473093C67A7696e475858152D3b2acB7c) |
| L2OutputOracleProxy               | L2OutputOracle ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0xFf2394Bb843012562f4349C6632a0EcB92fC8810](https://testnet.bscscan.com/address/0xFf2394Bb843012562f4349C6632a0EcB92fC8810) |
| Lib_AddressManager                | Bu sözleşme, sistemdeki çeşitli sözleşmelerin adreslerini yönetmek için kullanılan bir kütüphanedir. | [0x4d07b9B1ffC70Fc824587573cfb6ef1Cc404AaD7](https://testnet.bscscan.com/address/0x4d07b9B1ffC70Fc824587573cfb6ef1Cc404AaD7) |
| OptimismMintableERC20Factory      | Bu, Layer 2 ağı üzerinde mintable ERC-20 jetonları oluşturmak için bir fabrika sözleşmesidir. | [0x1AD11eA5426bA3A11c0bA8c4B89fd1BCa732025E](https://testnet.bscscan.com/address/0x1AD11eA5426bA3A11c0bA8c4B89fd1BCa732025E) |
| OptimismMintableERC20FactoryProxy | OptimismMintableERC20Factory ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0x182cE4305791744202BB4F802C155B94cb66163B](https://testnet.bscscan.com/address/0x182cE4305791744202BB4F802C155B94cb66163B) |
| OptimismPortal                    | Bu sözleşme, Optimism Layer 2 ağı ile etkileşime geçmek için bir portal veya geçit işlevi görür. | [0x2d5D7bEe8ebEf17DE14dd6ADAE8271507994a6E0](https://testnet.bscscan.com/address/0x2d5D7bEe8ebEf17DE14dd6ADAE8271507994a6E0) |
| OptimismPortalProxy               | OptimismPortal ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0x4386C8ABf2009aC0c263462Da568DD9d46e52a31](https://testnet.bscscan.com/address/0x4386C8ABf2009aC0c263462Da568DD9d46e52a31) |
| PortalSender                      | Bu sözleşme, L1 üzerinde bir portal veya geçide veri veya mesaj göndermekle ilgilenir. | [0x02B668393Bc41415Dbb973C9dC144fDD42B8fA2D](https://testnet.bscscan.com/address/0x02B668393Bc41415Dbb973C9dC144fDD42B8fA2D) |
| ProxyAdmin                        | Bu sözleşme, proxy sözleşmelerini yönetmekle sorumludur, böylece yükseltmeler ve erişim kontrolü sağlar. | [0xE4925bD8Ac30b2d4e2bD7b8Ba495a5c92d4c5156](https://testnet.bscscan.com/address/0xE4925bD8Ac30b2d4e2bD7b8Ba495a5c92d4c5156) |
| Proxy__OVM_L1CrossDomainMessenger | Bu sözleşme, L1CrossDomainMessenger sözleşmesi için bir proxy'dir, Layer 1'den Layer 2 sözleşmesi ile etkileşim sağlanmasına olanak tanır. | [0xD506952e78eeCd5d4424B1990a0c99B1568E7c2C](https://testnet.bscscan.com/address/0xD506952e78eeCd5d4424B1990a0c99B1568E7c2C) |
| Proxy__OVM_L1StandardBridge       | Bu, Layer 2 ağındaki L1StandardBridge sözleşmesi için bir proxy'dir, Layer 1'den Layer 2 köprüsü ile etkileşim sağlanmasına olanak tanır. | [0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840](https://testnet.bscscan.com/address/0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840) |
| SystemConfig                      | Bu sözleşme, protokoldeki sistem yapılandırmalarını, ayarlarını veya parametrelerini yönetmekle sorumludur. | [0x8Fc086Ec0ac912D5101Fec3E9ac6D910eBD5b611](https://testnet.bscscan.com/address/0x8Fc086Ec0ac912D5101Fec3E9ac6D910eBD5b611) |
| SystemConfigProxy                 | SystemConfig sözleşmesi ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0x406aC857817708eAf4ca3A82317eF4ae3D1EA23B](https://testnet.bscscan.com/address/0x406aC857817708eAf4ca3A82317eF4ae3D1EA23B) |
| SystemDictator                    | Bu sözleşme, sistemin veya protokolün belirli yönlerini yönetmek veya yönetmekte rol oynar. | [0x281cc8F04AE5bb873bADc3D89059423E4c664834](https://testnet.bscscan.com/address/0x281cc8F04AE5bb873bADc3D89059423E4c664834) |
| SystemDictatorProxy               | SystemDictator sözleşmesi ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0xB9Edfded1254ca07085920Af22BeCE0ce905F2AB](https://testnet.bscscan.com/address/0xB9Edfded1254ca07085920Af22BeCE0ce905F2AB) |

###  

**Mainnet**

| **İsim**                          | **Açıklama**                                              | **Adres**                                                  |
| --------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| L1CrossDomainMessenger            | Layer 1 (L1) üzerinde alanlar arası iletişimi sağlamakla sorumludur | [0x09525eB7eEd671582dDc6f02f8D9082cbd55A606](https://bscscan.com/address/0x09525eB7eEd671582dDc6f02f8D9082cbd55A606) |
| L1ERC721Bridge                    | Bu sözleşme, L1 ve L2 arasında değiştirilemeyen jetonları (NFT) aktarabilen muhtemelen bir ERC-721 köprüsüdür | [0xCB4CD5B74A2f2D75076Fb097Da70cEF5FEaC0428](https://bscscan.com/address/0xCB4CD5B74A2f2D75076Fb097Da70cEF5FEaC0428) |
| L1ERC721BridgeProxy               | L1ERC721Bridge sözleşmesi için ek işlevsellik sağlayabilecek bir proxy sözleşmesidir. | [0xC7c796D3B712ad223Bc29Bf85E6cdD3045D998C4](https://bscscan.com/address/0xC7c796D3B712ad223Bc29Bf85E6cdD3045D998C4) |
| L1StandardBridge                  | L1 ve L2 arasında değiştirilebilir jetonların aktarımını sağlayan standart bir köprü sözleşmesidir. | [0x6df37de57D50eC5a0600510eB8F563F538BDc403](https://bscscan.com/address/0x6df37de57D50eC5a0600510eB8F563F538BDc403) |
| L2OutputOracle                    | Bu sözleşme, akıllı sözleşmeler ve uygulamalarda kullanılmak üzere veri sağlayan bir oracle'dır | [0x0d61A015BAeF63f6740afF8294dAc278A494f6fA](https://bscscan.com/address/0x0d61A015BAeF63f6740afF8294dAc278A494f6fA) |
| L2OutputOracleProxy               | L2OutputOracle ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0x153CAB79f4767E2ff862C94aa49573294B13D169](https://bscscan.com/address/0x153CAB79f4767E2ff862C94aa49573294B13D169) |
| Lib_AddressManager                | Bu sözleşme, sistemdeki çeşitli sözleşmelerin adreslerini yönetmek için kullanılan bir kütüphanedir. | [0x29cfb9A803589Ff5C37f955ead83b45311F15b12](https://bscscan.com/address/0x29cfb9A803589Ff5C37f955ead83b45311F15b12) |
| OptimismMintableERC20Factory      | Bu, Layer 2 ağı üzerinde mintable ERC-20 jetonları oluşturmak için bir fabrika sözleşmesidir. | [0x6560F2822c9dFb9801F5E9A7c7CE1564c8c2b461](https://bscscan.com/address/0x6560F2822c9dFb9801F5E9A7c7CE1564c8c2b461) |
| OptimismMintableERC20FactoryProxy | OptimismMintableERC20Factory ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0xAa53ddCDC64A53F65A5f570cc13eB13529d780f1](https://bscscan.com/address/0xAa53ddCDC64A53F65A5f570cc13eB13529d780f1) |
| OptimismPortal                    | Bu sözleşme, Optimism Layer 2 ağı ile etkileşime geçmek için bir portal veya geçit işlevi görür. | [0x7e2419F79c9546B9A0E292Fd36aC5005ffed5495](https://bscscan.com/address/0x7e2419F79c9546B9A0E292Fd36aC5005ffed5495) |
| OptimismPortalProxy               | OptimismPortal ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0x1876EA7702C0ad0C6A2ae6036DE7733edfBca519](https://bscscan.com/address/0x1876EA7702C0ad0C6A2ae6036DE7733edfBca519) |
| PortalSender                      | Bu sözleşme, L1 üzerinde bir portal veya geçide veri veya mesaj göndermekle ilgilenir. | [0xEDa034A4B7806e1283e99F8522eFd08d855B9b72](https://bscscan.com/address/0xEDa034A4B7806e1283e99F8522eFd08d855B9b72) |
| ProxyAdmin                        | Bu sözleşme, proxy sözleşmelerini yönetmekle sorumludur, böylece yükseltmeler ve erişim kontrolü sağlar. | [0x27a591Ec09AAfEEb39d7533AEf7C64E0305D1576](https://bscscan.com/address/0x27a591Ec09AAfEEb39d7533AEf7C64E0305D1576) |
| Proxy__OVM_L1CrossDomainMessenger | Bu sözleşme, L1CrossDomainMessenger sözleşmesi için bir proxy'dir, Layer 1'den Layer 2 sözleşmesi ile etkileşim sağlanmasına olanak tanır. | [0xd95D508f13f7029CCF0fb61984d5dfD11b879c4f](https://bscscan.com/address/0xd95D508f13f7029CCF0fb61984d5dfD11b879c4f) |
| Proxy__OVM_L1StandardBridge       | Bu, Layer 2 ağındaki L1StandardBridge sözleşmesi için bir proxy'dir, Layer 1'den Layer 2 köprüsü ile etkileşim sağlanmasına olanak tanır. | [0xF05F0e4362859c3331Cb9395CBC201E3Fa6757Ea](https://bscscan.com/address/0xF05F0e4362859c3331Cb9395CBC201E3Fa6757Ea) |
| SystemConfig                      | Bu sözleşme, protokoldeki sistem yapılandırmalarını, ayarlarını veya parametrelerini yönetmekle sorumludur. | [0x0be96fcB5eCCA87c775344fB76A3A1C6146cA5Fd](https://bscscan.com/address/0x0be96fcB5eCCA87c775344fB76A3A1C6146cA5Fd) |
| SystemConfigProxy                 | SystemConfig sözleşmesi ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0x7AC836148C14c74086D57F7828F2D065672Db3B8](https://bscscan.com/address/0x7AC836148C14c74086D57F7828F2D065672Db3B8) |
| SystemDictator                    | Bu sözleşme, sistemin veya protokolün belirli yönlerini yönetmek veya yönetmekte rol oynar. | [0x0744F61646DdE7Bc2d2c18B13D08a8fba597666b](https://bscscan.com/address/0x0744F61646DdE7Bc2d2c18B13D08a8fba597666b) |
| SystemDictatorProxy               | SystemDictator sözleşmesi ile ilgili bir proxy sözleşmesidir, arayüz veya ek işlevsellik sağlar. | [0xEb23CCD85eF040BdAf3CBf962C816cD9Cb691F35](https://bscscan.com/address/0xEb23CCD85eF040BdAf3CBf962C816cD9Cb691F35) |

###  

## L2 Sözleşme Adresleri

| **İsim**                      | **Açıklama**                                              | **Adres**                                                  |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| WBNB                          | Bu sözleşme, opBNB ağında BNB ile ilişkilendirilen Wrapped BNB'yi temsil eder. | [0x4200000000000000000000000000000000000006](https://opbnbscan.com/address/0x4200000000000000000000000000000000000006) |
| L2CrossDomainMessenger        | Bu sözleşme, opBNB ağının Layer 2'de alanlar arası iletişimi sağlamakla sorumludur. | [0x4200000000000000000000000000000000000007](https://opbnbscan.com/address/0x4200000000000000000000000000000000000007) |
| L2StandardBridge              | Bu sözleşme, farklı zincirler veya ağlar arasında değiştirilebilir jetonların aktarımını sağlayan standart bir köprüdür. | [0x4200000000000000000000000000000000000010](https://opbnbscan.com/address/0x4200000000000000000000000000000000000010) |
| SequencerFeeVault             | Bu sözleşme, opBNB'de işlem gönderen sequencer'lardan ücret toplamak için bir vault olarak işlev görür. | [0x4200000000000000000000000000000000000011](https://opbnbscan.com/address/0x4200000000000000000000000000000000000011) |
| OptimismMintableERC20Factory  | Bu, Layer 2 ağı üzerinde mintable ERC-20 jetonları oluşturmak için bir fabrika sözleşmesidir. | [0x4200000000000000000000000000000000000012](https://opbnbscan.com/address/0x4200000000000000000000000000000000000012) |
| GasPriceOracle                | Bu sözleşme, opBNB ağında işlemler ve ücret hesaplamaları için kullanılabilecek gaz fiyatı verilerini sağlayabilir. | [0x420000000000000000000000000000000000000F](https://opbnbscan.com/address/0x420000000000000000000000000000000000000F) |
| L1Block                       | Bu sözleşme, opBNB ile etkileşim bağlamında Layer 1 üzerindeki bir bloktu. | [0x4200000000000000000000000000000000000015](https://opbnbscan.com/address/0x4200000000000000000000000000000000000015) |
| L2ToL1MessagePasser           | Bu sözleşme, opBNB ağında Layer 2'den Layer 1'e mesaj iletiminden sorumludur. | [0x4200000000000000000000000000000000000016](https://opbnbscan.com/address/0x4200000000000000000000000000000000000016) |
| L2ERC721Bridge                | Bu sözleşme, Layer 2'de ERC-721 değiştirilemeyen jetonların aktarımı için bir köprüdür. | [0x4200000000000000000000000000000000000014](https://opbnbscan.com/address/0x4200000000000000000000000000000000000014) |
| OptimismMintableERC721Factory | Bu, Layer 2 ağı üzerinde mintable ERC-721 jetonları oluşturmak için bir fabrika sözleşmesidir. | [0x4200000000000000000000000000000000000017](https://opbnbscan.com/address/0x4200000000000000000000000000000000000017) |
| ProxyAdmin                    | Bu sözleşme, opBNB ağındaki proxy sözleşmelerini yönetmekle sorumludur, böylece yükseltmeler ve erişim kontrolü sağlar. | [0x4200000000000000000000000000000000000018](https://opbnbscan.com/address/0x4200000000000000000000000000000000000018) |
| BaseFeeVault                  | Bu sözleşme, opBNB ağında temel ücretlerin toplanması için bir vault işlevi görür. | [0x4200000000000000000000000000000000000019](https://opbnbscan.com/address/0x4200000000000000000000000000000000000019) |

## referans
![img](../../images/bnb-chain/bnb-opbnb/img/L1-L2.png)