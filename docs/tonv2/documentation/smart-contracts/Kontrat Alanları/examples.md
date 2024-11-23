# Akıllı Sözleşmelere Örnekler

Bu sayfada, çeşitli program yazılımları için uygulanmış TON akıllı sözleşme referanslarını bulabilirsiniz.

:::info
Sözleşmeleri bir üretim ortamında kullanmadan önce iyice test ettiğinizden emin olun. Bu, yazılımınızın düzgün çalışmasını ve güvenliğini sağlamak için kritik bir adımdır.
:::

## FunC Akıllı Sözleşmeleri

### Üretim Kullanımındaki Sözleşmeler

| Sözleşmeler                                                                                                                                                                                                                                                                                             | Açıklama                                                                                                                                                     |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/wallet-contract&name=wallet-contract)                                                   | **Wallet v4**, v3 veya daha eski cüzdanların yerini alması önerilen cüzdan versiyonudur.                                                                        |
| [liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/liquid-staking-contract/&name=liquid-staking-contract)                                        | Liquid Staking (LSt), TON sahiplerini donanım düğüm operatörleri ile bağlayan ve varlık havuzlaması yoluyla TON Blockchain doğrulamasına katılmalarını sağlayan bir protokoldür. |
| [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/EmelyanenkoK/modern_jetton&name=modern_jetton)                                                                               | Ekstra `withdraw_tons` ve `withdraw_jettons` ile standart jettonun uygulanması.                                                                                |
| [highloadwallet-v3](https://github.com/ton-blockchain/highload-wallet-contract-v3)                                                                                                                                                                                                                       | Bu cüzdan, **çok yüksek hızlarda işlem göndermesi gerekenler için** tasarlanmıştır, örneğin kripto borsaları.                                                      |
| [stablecoin-contract](https://github.com/ton-blockchain/stablecoin-contract)                                                                                                                                                                                                                            | Jetton-governance FunC akıllı sözleşmeleri, USDt gibi **stablecoinler** için kullanılır.                                                                         |
| [governance-contract](https://github.com/ton-blockchain/governance-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/governance-contract&name=governance-contract)                                                      | Temel TON Blockchain sözleşmeleri `elector-code.fc` ve `config-code.fc`.                                                                                      |
| [bridge-func](https://github.com/ton-blockchain/bridge-func)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/bridge-func&name=bridge-func)                                                                                       | TON-EVM Toncoin Köprüsü.                                                                                                                                     |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/token-bridge-func&name=token-bridge-func)                                                            | TON-EVM token köprüsü - FunC akıllı sözleşmeleri.                                                                                                            |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal&name=lockup-wallet-contract/universal) | Evrensel kilit cüzdanı, kilitlenmiş ve kısıtlı coinleri depolayabilen bir sözleşmedir.                                                                          |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting&name=lockup-wallet-contract/vesting) | Vesting cüzdanı akıllı sözleşmesi                                                                                                                            |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/multisig-contract&name=multisig-contract)                                                          | **`(n, k)`-multisig cüzdanı**, `n` özel anahtarı olan sahipleriyle birlikte çalışan ve isteği göndermek için en az `k` imza toplayan bir cüzdandır.                            |
| [token-contract](https://github.com/ton-blockchain/token-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/token-contract&name=token-contract)                                                                              | Fungible, Non-Fungible, Semi-Fungible Token **Akıllı Sözleşmeleri**                                                                                            |
| [dns-contract](https://github.com/ton-blockchain/dns-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/dns-contract&name=dns-contract)                                                                                        | `.ton` bölgesinin akıllı sözleşmeleri.                                                                                                                    |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/nominator-pool&name=nominator-pool)                                                                            | Nominator Pool akıllı sözleşmesi                                                                                                                            |
| [single-nominator-pool](https://github.com/orbs-network/single-nominator)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/nominator-pool&name=nominator-pool)                                                                         | Tekil Nominator Pool akıllı sözleşmesi                                                                                                                    |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/vesting-contract&name=vesting-contract)                                                                    | Vesting sözleşmesi, belirli bir süre için belirli bir miktarda Toncoin'i **kilitlemenizi** ve bunları yavaşça serbest bırakmanızı sağlar.                       |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont&name=storage)                      | TON Depolama sağlayıcısı ve kumaş sözleşmeleri                                                                                                           |

---

### Ekosistem Sözleşmeleri

| Sözleşmeler                                                                                                                                                                                                                                                                                            | Açıklama                                                                                                                 |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| [telemint](https://github.com/TelegramMessenger/telemint)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/TelegramMessenger/telemint&name=telemint)                                                                                               | Telegram Kullanıcı Adları(`nft-item.fc`) ve Telegram Numaraları(`nft-item-no-dns.fc`) sözleşmeleri.                      |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/TonoxDeFi/capped-fungible-token&name=capped-fungible-token)                                                          | Jetton Cüzdanı ve Jetton Minter için **akıllı sözleşmelerin** temel uygulanması.                                           |
| [gusarich-airdrop](https://github.com/Gusarich/airdrop/tree/main/contracts)                                                                                                                                                                                | TON blockchain için **ölçeklenebilir bir Airdrop Sistemi** uygulaması. Jettonları on-chain herhangi bir cüzdana dağıtmak için kullanılabilir. |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources&name=getgems-io/nft-contracts)  | Getgems NFT Sözleşmeleri                                                                                               |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-defi-org/lockup-wallet-deployment&name=lockup-wallet-deployment)                                       | Kilit sözleşmesini uçtan uca dağıtma ve çalıştırma.                                                                    |
| [WTON](https://github.com/TonoxDeFi/WTON)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/TonoxDeFi/WTON&name=WTON)                                                                                                                                         | Bu akıllı sözleşme, **WTON** adı verilen sarmalanmış Toncoin'in uygulanmasını sağlar.                                      |
| [wton-contract](https://github.com/ton-community/wton-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-community/wton-contract&name=wton-contract)                                                                                      | wTON sözleşmeleri                                                                                                     |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-community/contract-verifier-contracts&name=contract-verifier-contracts)                            | Kod hücresi karmaşığı için bir on-chain kanıtı saklayan kaynaklar **kayıt** sözleşmeleri.                                  |
| [vanity-contract](https://github.com/ton-community/vanity-contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-community/vanity-contract&name=vanity-contract)                                                                          | Herhangi bir sözleşme için uygun bir adres "madenciliği" yapmanıza izin veren bir akıllı sözleşme.                       |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-foundation/ton-config-smc&name=ton-config-smc)                                                                                  | TON Blockchain'de sürümlü verileri saklamak için **basit bir sözleşme**.                                                  |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func&name=ratelance)                                              | Ratelance, potansiyel işverenler ile çalışanlar arasındaki engelleri kaldırmaya çalışan bir serbest çalışma platformudur. |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc&name=logger.fc)                                      | Verileri yerel depolama alanına kaydeden sözleşme.                                                                     |
| [ton-nominators](https://github.com/tonwhales/ton-nominators)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-nominators&name=ton-nominators)                                                                                         | Ton Whales Nominator pool kaynak kodu.                                                                                |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-link/ton-link-contract-v3&name=ton-link-contract-v3)                                                                  | Ton-link, akıllı sözleşmelerin veri güvenliğini korurken blockchain dışındaki verilere erişmesini sağlar.              |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/delab-team/contracts/tree/main/fungible-token&name=delab-team/fungible-token)                       | DeLab TON **fungible-token** uygulaması                                                                                   |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc&name=whitelisted-wallet.fc)| Basit **Beyaz Listeye Alınmış Cüzdan** Sözleşmesi                                                                             |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/delab-team/contracts/tree/main/jetton-pool&name=delab-team/jetton-pool)                                   | Jetton Pool TON akıllı sözleşmesi, tarım havuzları oluşturmak için tasarlanmıştır.                                  |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ston-fi/dex-core/tree/main/contracts&name=ston-fi/contracts)                                                       | Stonfi DEX **çekirdek sözleşmeleri**                                                                                      |
| [onda-ton](https://github.com/0xknstntn/onda-ton)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/0xknstntn/onda-ton&name=onda-ton)                                                                                                         | Onda Lending Pool - TON üzerindeki ilk kredi protokolünün temel akıllı sözleşmeleri                                    |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ProgramCrafter/ton-stable-timer&name=ton-stable-timer)                                                                  | TON Stable Timer sözleşmesi                                                                                         |
| [HipoFinance/contract](https://github.com/HipoFinance/contract)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/HipoFinance/contract&name=HipoFinance)                                                                                             | hTON, TON Blockchain üzerinde merkezi olmayan, izin gerektirmeyen, açık kaynaklı bir **likit staking protokolüdür**.    |

### Öğrenme Sözleşmeleri

| Sözleşmeler                                                                                                                                                                                                                                                                                                                             | Açıklama                                                               |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc&name=counter.fc)                                                              | **Yorumlarla birlikte sayıcı akıllı sözleşmesi.**                          |
| [simple-distributor](https://github.com/ton-community/simple-distributor)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/ton-community/simple-distributor&name=simple-distributor)                                                                                                          | **Basit TON dağıtımcısı.**                                               |
| [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc&name=ping-pong.fc)                                                        | **Farklı modlarda Toncoin gönderimini test etmek için basit sözleşme.**    |
| [ton-random](https://github.com/puppycats/ton-random)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/puppycats/ton-random&name=ton-random)                                                                                                                                                  | **Zincir üzerinde rastgele sayılar üretmeye yardımcı olacak iki sözleşme.** |
| [Blueprint basit sözleşme](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc&name=simple_contract)                                                    | **Örnek akıllı sözleşme**                                                |
| [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc&name=jetton_minter.fc) | **Zincir üzerinde Jetton'ları basmak için akıllı sözleşme örneği.**        |
| [Basit TON DNS Alt alan yöneticisi](https://github.com/Gusarich/simple-subdomain)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/Gusarich/simple-subdomain&name=Simple_TON_DNS_Subdomain_manager)                                                                                            | **TON DNS alt alan yöneticisi.**                                          |
| [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func)  🪄 [WebIDE'de Çalıştır](https://ide.nujan.io/?importURL=https://github.com/disintar/sale-dapp/tree/master/func&name=disintar/sale-dapp)                                                                                                    | **React + NFT satış DApp'i ile FunC**                                     |

---

### TON Akıllı Zorluklar

#### TON Akıllı Zorluk 1
* [TON FunC Yarışma 1](https://github.com/nns2009/TON-FunC-contest-1/tree/main)
* [Yarışma 1 Çözümleri](https://github.com/pyAndr3w/func-contest1-solutions)
* [TonContest FunC Yarışma 1](https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1)

#### TON Akıllı Zorluk 2
* [Yarışma 2 Çözümleri](https://github.com/ton-blockchain/func-contest2-solutions)
* [TON FunC Yarışma 2](https://github.com/nns2009/TON-FunC-contest-2)
* [TonContest FunC Yarışma 2](https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2)

#### TON Akıllı Zorluk 3
* [TON FunC Yarışma 3](https://github.com/nns2009/TON-FunC-contest-3)
* [Yarışma 3 Çözümleri](https://github.com/shuva10v/func-contest3-solutions)
* [TonContest FunC Yarışma 3](https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3)

#### TON Akıllı Zorluk 4

* [ÖZEL optimize edilmiş](https://github.com/akifoq/tsc4)
* [Yarışma 4 Çözümleri](https://github.com/Gusarich/tsc4)
* [Yarışma 4 Çözümleri](https://github.com/Skydev0h/tsc4)
* [FunC çözümü](https://github.com/aSpite/tsc4-contracts)
* [FunC çözümü](https://github.com/ProgramCrafter/tsc4/tree/c1616e12d1b449b01fdcb787a3aa8442e671371e/contracts)

---

## Fift Akıllı Sözleşmeler

* **Akıllı sözleşmeler için Fift dosyaları:**
  * [CreateState.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/CreateState.fif)
  * [asm-to-cpp.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/asm-to-cpp.fif)
  * [auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/auto-dns.fif)
  * [complaint-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-req.fif)
  * [complaint-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-signed.fif)
  * [config-proposal-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-req.fif)
  * [config-proposal-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-signed.fif)
  * [create-config-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-proposal.fif)
  * [create-config-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-upgrade-proposal.fif)
  * [create-elector-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-elector-upgrade-proposal.fif)
  * [envelope-complaint.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/envelope-complaint.fif)
  * [gen-zerostate-test.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate-test.fif)
  * [gen-zerostate.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate.fif)
  * [highload-wallet-v2-one.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-one.fif)
  * [highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2.fif)
  * [highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet.fif)
  * [manual-dns-manage.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/manual-dns-manage.fif)
  * [new-auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-auto-dns.fif)
  * [new-highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)
  * [new-highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet.fif)
  * [new-manual-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-manual-dns.fif)
  * [new-pinger.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pinger.fif)
  * [new-pow-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pow-testgiver.fif)
  * [new-restricted-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet.fif)
  * [new-restricted-wallet2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet2.fif)
  * [new-restricted-wallet3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet3.fif)
  * [new-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-testgiver.fif)
  * [new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)
  * [new-wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif)
  * [new-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)
  * [show-addr.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/show-addr.fif)
  * [testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/testgiver.fif)
  * [update-config-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config-smc.fif)
  * [update-config.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config.fif)
  * [update-elector-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-elector-smc.fif)
  * [validator-elect-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-req.fif)
  * [validator-elect-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-signed.fif)
  * [wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v2.fif)
  * [wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif)
  * [wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet.fif)
  * [wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

---

## FunC Kütüphaneleri ve Yardımcılar

* **Kaynaklar:**
* [stdlib.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)
* [elliptic-curves](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/elliptic-curves)
* [math](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math)
* [messages](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages)
* [slices](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/slices)
* [strings](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings)
* [tuples](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples)
* [utils](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils)
* [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func)

---

## Referans Ekle

:::tip  
Yeni bir örnek akıllı sözleşme paylaşmak istiyorsanız, bu [sayfa](https://github.com/ton-community/ton-docs/tree/main/docs/v3/documentation/smart-contracts/contracts-specs/examples.md) için PR'inizi yapın.
:::

## Ayrıca Bakınız

* `Akıllı Sözleşmeler Giriş`
* `Cüzdan akıllı sözleşmeleri ile nasıl çalışılır`
* [You Tube: Ton Geliştirici Eğitimi - FunC & BluePrint dersleri](https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa)