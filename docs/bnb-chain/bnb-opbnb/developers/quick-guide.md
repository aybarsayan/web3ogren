---
title: Quick Guide - opBNB
description: opBNB geliştiricileri için hızlı kılavuz. Projenizi inşa etmek için gerekenleri anlayacaksınız. Bu belge, opBNB üzerinde uygulama geliştirmek isteyenler için kapsamlı bilgiler sunmaktadır.
keywords: [opBNB, geliştirme, dapp, BNB, Layer 2]
order: 8
---

Eğer opBNB üzerinde geliştirme yapmayı arzulayan bir geliştiriciyseniz, doğru yerdesiniz.  
Bu belge, opBNB uygulamaları geliştirmek için ihtiyaç duyduğunuz tüm bilgileri sağlamaktadır.

## Başlarken

opBNB ağı, [OP Stack](https://docs.optimism.io/) ile güçlendirilmiş BNB Smart Chain(BSC) için Layer 2 ölçekleme çözümüdür.

Eğer opBNB’ye yeni başladıysanız, opBNB üzerinde `fullstack dapp oluşturma` kılavuzuyla başlamayı deneyebilirsiniz.  
Bu, size opBNB'de akıllı bir sözleşmeyi dağıtma ve bir dapp üzerinden onunla etkileşimde bulunma temellerini tanıtacaktır.

opBNB, [EVM eşdeğeridir](https://web.archive.org/web/20231127160757/https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306), böylece mevcut Ethereum akıllı sözleşme becerilerinizin opBNB'ye sorunsuz bir şekilde aktarılacağından emin olabilirsiniz.  
Ethereum ve opBNB arasında birkaç küçük fark bulunmakta, bu yüzden bunları bilmekte fayda var. Daha fazla bilgi için [optimism belgelerine](https://docs.optimism.io/chain/differences) başvurabilirsiniz.

---

## Bağlantı Kurma

opBNB ağına bağlanmanıza yardımcı olacak bazı kaynaklar:

- `Ağ Bilgisi ve RPC Sağlayıcıları`
- `Cüzdan Yapılandırması`

### :::tip 
Kullanıcı deneyiminizi artırmak için önerilen cüzdanlar arasından seçim yapabilirsiniz.
:::

---

## Token Alma

opBNB, BSC üzerinde bir Layer 2'dir, bu nedenle token'lar iki zincir arasında köprüler kullanılarak taşınabilir.  
Testnet için, BSC üzerinde bazı test token'ları elde etmek için musluğu kullanabilir ve ardından bunları resmi köprü aracılığıyla opBNB’ye köprüleyebilirsiniz.  
Ana ağ için, BSC'den opBNB'ye çeşitli köprüler aracılığıyla token köprüleyebilir veya opBNB ağını destekleyen merkezi bir borsa (CEX) aracılığıyla token'ları doğrudan çekebilirsiniz (örn. Binance).

- `opBNB Testnet Musluğu`
- Köprüler
    - [opBNB Resmi köprüsü](https://opbnb-bridge.bnbchain.org)
    - [zkBridge](https://www.zkbridge.com/opbnb/token)
    - [rhino.fi](https://app.rhino.fi/bridge?token=BNB&chainOut=OPBNB&chain=BINANCE)

> Eğer köprülerin ve CEX'lerin henüz desteklemediği token'ları köprülemek istiyorsanız, opBNB üzerinde kendi L2 ayna token sözleşmenizi dağıtabilir ve `bu kılavuza` göre köprüleyebilirsiniz.  
> — opBNB Geliştirici Ekibi

---

## Çapraz Zincir İletişimi

BSC ve opBNB arasında çapraz zincir uygulamaları oluşturmak için, çapraz zincir mesaj geçişinin nasıl çalıştığını anlamalısınız.  
Daha fazla bilgi için [L1 ve L2 arasında veri gönderme](https://docs.optimism.io/builders/app-developers/bridging/messaging) kılavuzuna başvurabilirsiniz.

---

## Geliştirici Araçları

- Keşif Araçları
    - [NodeReal opBNB Scan](https://mainnet.opbnbscan.com)
    - [BSCScan](https://opbnb.bscscan.com/)
- SDK. Sadece Ethereum uyumlu işlevler için SDK kullanıyorsanız, tüm Ethereum SDK'ları opBNB ile çalışmalıdır. Eğer opBNB'ye özel işlevleri kullanmak istiyorsanız, [OP Stack Uzantıları ile op-viem](https://viem.sh/op-stack) kullanmanız önerilir.
    - [ethers.js](https://docs.ethers.io)
    - [web3.js](https://web3js.readthedocs.io)
    - [viem](https://viem.sh/)
- Araçlar
    - [Remix](https://remix.ethereum.org)
    - [Hardhat](https://hardhat.org)
    - [Foundry](https://book.getfoundry.sh/)
- `BNB Chain Çoklu İmza Cüzdanı`
- Cüzdanlar
    - [Binance Web3 Cüzdanı](https://www.binance.com/en/web3wallet)
    - [Metamask](https://metamask.io/)
    - [TrustWallet](https://trustwallet.com/)
    - [Particle Network](https://wallet.particle.network/)
    - [Gem Wallet](https://gemwallet.com/)
    - [OKX Wallet](https://www.okx.com/nl/web3)
    - [MathWallet](https://mathwallet.org/en-us/)
    - [Sequence.build](https://sequence.build/landing)
    - [Avatar](https://avatarwallet.io/)
- Oracle
    - [Binance Oracle](https://oracle.binance.com/docs/)
- Hesap Soyutlama
    - [Particle Network](https://wallet.particle.network/)
    - [Biconomy](https://docs.biconomy.io/supportedchains/)
    - [CyberConnect](https://cyberconnect.me/) 
- Depolama
    - [BNB Greenfield](https://greenfield.bnbchain.org/en)
- Veri Analitiği
    - [DefiLlama](https://defillama.com/chain/opBNB)
    - [CoinGecko](https://www.coingecko.com/en/chains/opbnb)
    - [DappBay](https://dappbay.bnbchain.org/ranking/chain/opbnb) 

Daha fazla araç ve detay için `bu belgeye` başvurabilirsiniz.