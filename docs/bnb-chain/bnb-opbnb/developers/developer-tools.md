---
title: Geliştirici Araçları - opBNB Gelişimi
description: opBNB'nin BNB Akıllı Zinciri üzerindeki kullanımının artırılması ve yüksek performanslı bir Layer 2 zinciri olarak benimsenmesi hedeflenmektedir. Bu doküman, geliştirilen araçlar ve altyapıyı detaylandırarak kullanıcılar ve geliştiriciler için bilgiler sunmaktadır.
keywords: [opBNB, BNB Akıllı Zinciri, geliştirici araçları, Layer 2, blockchain, dijital cüzdan, veri analitiği]
---

Ana hedeflerimizden biri, opBNB'nin BNB Akıllı Zinciri üzerinde yüksek performanslı ve düşük maliyetli bir Layer 2 zinciri olarak benimsenmesini ve kullanımını artırmaktır. Bu hedefe ulaşmak için, temel teknolojimizin **sağlam**, **ölçeklenebilir** ve **kullanıcı dostu** olmasını sağlamamız gerekiyor. Bu nedenle, opBNB'yi ve kullanıcılarının, ev sahiplerinin ve geliştiricilerinin topluluğunu destekleyen temel altyapıyı ve araçları geliştirmeye ve iyileştirmeye kararlıyız. Aşağıda opBNB için inşa ettiğimiz ekosistemi bulabilirsiniz.

# Özet

| Kategoriler        | Alt Kategoriler        | Altyapı ve Araçlar                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | --------------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DAO Yönetimi       | DAO Yönetimi         | [XDao](https://www.xdao.app/204),[Snapshot](https://snapshot.org/#/?filter=networks&q=opbnb)                                                                                                                                                                                                                                                                                                                      |
| Düğüm Sağlayıcıları | Düğüm Sağlayıcı      | [NodeReal](https://nodereal.io/meganode)                                                                                                                                                                                                                                                                                                                                                                          |
| Keşif              | Keşif                | [NodeReal opBNB Scan](https://mainnet.opbnbscan.com), [BSCScan](https://opbnb.bscscan.com/)                                                                                                                                                                                                                                                                                                                       |
|                     | Geliştirici Platformları | [Truffle](https://trufflesuite.com/), [Foundry](https://book.getfoundry.sh/), [Hardhat](https://hardhat.org/), [Remix](https://remix.ethereum.org/)                                                                                                                                                                                                                                                                |
| Kullanım Erişim Araçları | Cüzdan            | [Binance Web3 Cüzdan](https://www.binance.com/en/web3wallet), [Metamask](https://metamask.io/), [TrustWallet](https://trustwallet.com/), [Particle Network](https://wallet.particle.network/), [Gem Wallet](https://gemwallet.com/), [OKX Wallet](https://www.okx.com/nl/web3), [MathWallet](https://mathwallet.org/en-us/),  [Sequence.build](https://sequence.build/landing), [Avatar](https://avatarwallet.io/), [Openfort](https://openfort.xyz) |
|                     | Köprüler             | [opBNB Köprüsü](https://opbnb-bridge.bnbchain.org/deposit),[PolyHedra](https://zkbridge.com/), [rhino.fi](https://app.rhino.fi/bridge?token=BNB&chainOut=OPBNB&chain=BINANCE)                                                                                                                                                                                                                                       |
|                     | dApp Mağazası        | [dApp Bay](https://dappbay.bnbchain.org/ranking/chain/opbnb)                                                                                                                                                                                                                                                                                                                                                    |
| Oracle             | Fiyat Verileri, VRF   | [Binance Oracle](https://oracle.binance.com/), [Supra](https://supraoracles.com/)                                                                                                                                                                                                                                                                                                                                 |
| Depolama           | Merkezsiz Depolama    | [BNB Greenfield](https://greenfield.bnbchain.org/en)                                                                                                                                                                                                                                                                                                                                                            |
| Güvenlik           |                       | [AvengerDAO](https://www.avengerdao.org/)                                                                                                                                                                                                                                                                                                                                                                       |
| Hesap Abstraksiyonu|                       | [Particle Network](https://wallet.particle.network/), [Biconomy](https://docs.biconomy.io/supportedchains/), [CyberConnect](https://cyberconnect.me/), [Openfort](https://openfort.xyz)                                                                                                                                                                                                                        |
| Çoklu İmza         |                       | `BNB Zincir Çoklu İmza Cüzdanı`                                                                                                                                                                                                                                                                                                                                                             |
| Veri Analitiği     |                       | [DefiLlama](https://defillama.com/chain/opBNB), [CoinGecko](https://www.coingecko.com/en/chains/opbnb), [DappBay](https://dappbay.bnbchain.org/ranking/chain/opbnb)                                                                                                                                                                                                                                               |
| İndeksleme         |                       | NodeReal’in opBNB Graph QL                                                                                                                                                                                                                                                                                                                                                                                       |
| NFT                | NFT Pazarı           | [Element’in NFT Pazarı](https://element.market/opbnb)                                                                                                                                                                                                                                                                                                                                                          |

---

## Binance Borsa Desteği

Binance, **7 Kasım 2023** tarihinde deposit ve withdrawal işlemlerini desteklemiştir. Başlangıç listesi BNB, FDUSD ve USDT'dir.

## Düğüm Sağlayıcıları

:::info
RPC düğümlerinin kararlılığının herhangi bir blockchain için kritik olduğunu belirtmeye gerek yok.
:::

Bu durumda, BNB Zinciri, bu görevde yer almak üzere opBNB’nin erken ve ana katkıda bulunanlarından biri olan **NodeReal**'e sahiptir.

NodeReal RPC’ye [API pazarı](https://nodereal.io/api-marketplace/explore?chains=opbnb) üzerinden erişebilirsiniz. Genel/kamu düğümleri için topluluklar, [BNB Zincir Listesi](https://www.bnbchainlist.org/) üzerinden erişim sağlayabilir.

## Cüzdan

Kripto/Dijital cüzdan, kullanıcıların blockchain'e erişimi için bir giriş noktası işlevi görür. opBNB, opBNB'ye erişim sağlayan bilinen cüzdanlara, örneğin `Metamask ve Trustwallet`, öncülük etmektedir.

**Hesap Abstraksiyonu (AA)** kapsamında, [CyberConnect](https://cyberconnect.me/), [Particle Network](https://wallet.particle.network/), [Biconomy](https://docs.biconomy.io/supportedchains/), [Openfort](https://openfort.xyz/docs) opBNB ile entegre olmuştur.

:::tip
**Çoklu İmza** cüzdanı olarak BNB Zinciri kendi `Safe Çoklu İmza Cüzdanı`'nı sağlamıştır.
:::

## Cüzdan Hizmeti[WaaS]

Cüzdan-hizmeti (WaaS), dijital cüzdanların uygulamalara entegrasyonunu kolaylaştırarak, işletmelerin kripto paraları ve tokenleri zahmetsizce yönetmelerini sağlamaktadır. Cüzdan altyapısının karmaşıklıklarını ele alarak, WaaS, dijital varlıkların yönetimi için güvenli ve kullanıcı dostu bir deneyim sunar, genişletilmiş blok zinciri benimsemeyi teşvik eder ve operasyonel verimliliği artırır.

Aşağıdaki cüzdanlar, BNB Akıllı Zinciri ve opBNB üzerinde Cüzdan Hizmeti (WaaS) platformlarını desteklemiştir. Bu, opBNB ve diğer varlıkların yönetimi için dijital cüzdan işlevselliklerinin uygulamalara sorunsuz entegrasyonunu kolaylaştırmaktadır.

| **Proje Adı**     | **Ana Web Sitesi**       | **WaaS Belgesi**                                  |
| ----------------- | ------------------------ | -------------------------------------------------- |
| Particle Network  | https://particle.network/ | https://particle.network/wallet-introduction.html  |
| Sequence.build    | https://sequence.xyz/    | https://sequence.build/landing                     |
| Avatar Cüzdanı    | https://avatarwallet.io/ | https://docs.avatarwallet.io/docs/introduction     |
| Openfort          | https://openfort.xyz/    | https://openfort.xyz/docs                          |

## Köprüler

Köprüler için opBNB kendi varsayılan [köprüsünü](https://opbnb-bridge.bnbchain.org/deposit) oluşturmuştur. Bu köprü OP Stack’i yansıtacak şekilde inşa edilmiştir. Bu, OP köprüsü ve BASE köprüsü benzeri 7 günlük bir zorluk süresine sahip olduğu anlamına gelir. Ancak opBNB, daha kısa withdrawal süreleri sunan [Polyhedra](https://zkbridge.com/opbnb) ve [Rhino.Fi](https://app.rhino.fi/bridge?token=BNB&chainOut=OPBNB&chain=BINANCE) gibi 3. parti köprü sağlayıcılarına da sahiptir.

## Veri Analitiği

Birçok tanınmış sektör platformu, opBNB'yi desteklemeye başlamıştır, örneğin: [DefiLlama](https://defillama.com/chain/opBNB), [CoinGecko](https://www.coingecko.com/en/chains/opbnb), [DappBay](https://dappbay.bnbchain.org/ranking/chain/opbnb). DappBay'de listelemek isteyen projeler, bu [formu](https://dappbay.bnbchain.org/submit-dapp) doldurabilir.

## Veri İndeksleme

opBNB şu anda NodeReal’ın opBNB Graph QL’ini, mevcut oyuncular TheGraph’ın yılın geri kalanında yoğun olduğu için ilk destek olarak sağlamaktadır.[**Beta Versiyonu**] Bu tür hizmetlere ihtiyacı olan projeler, gereksinimlerini karşılamak için NodeReal ile iletişime geçebilirler. [[Süreç Linki](https://docs.google.com/document/d/1R0RcHKU27lBPMaSmwhwijlXLTQhs0Haa9LtKsxJbeAc/edit)]

## DAO

BNB Zinciri merkeziyetsizliğe doğru ilerlerken temel bir bileşen. [XDao](https://www.xdao.app/204) ve [Snapshot](https://snapshot.org/#/?filter=networks&q=opbnb) artık opBNB'yi desteklemektedir.

# DeFi'ye Özel

## Oracle

[Binance Oracle](https://oracle.binance.com/docs/) opBNB'yi Day1'den itibaren desteklemeye başlamıştır. Ürün desteği ve demo için Binance Oracle ile iletişime geçmekten çekinmeyin.

# Oyun/Sosyal Medya İçin

## VRF

[Binance Oracle](https://oracle.binance.com/docs/vrf/overview) opBNB VRF'yi desteklemektedir. Ürün desteği ve demo için Binance Oracle ile iletişime geçmekten çekinmeyin.

## NFT Pazarı ve Minting

[Element’in NFT Pazarı](https://element.market/opbnb) opBNB üzerinde zaten yayındadır. Minting özelliği Kasım ayında hazır olacağı bildirilmektedir.