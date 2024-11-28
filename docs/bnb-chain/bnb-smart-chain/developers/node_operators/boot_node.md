---
title: Boot Node - BSC Geliştirme
description: Bu belge, BSC ağına bağlanmayı kolaylaştıran Boot Node'ların nasıl kullanılacağını açıklamaktadır. Boot Node'lar, kullanıcıların bağlantı süreçlerini basitleştirerek daha hızlı erişim sağlar.
keywords: [BSC, Boot Node, Geliştirme, Ethereum, StaticNodes, P2P, Ağ Bağlantısı]
---

Bakım sürümü [v1.2.12 4](https://github.com/bnb-chain/bsc/releases/tag/v1.2.12) ile birlikte, BSC ana ağında Boot Node'lar tanıtıldı. BSC Boot Node'ları, Ethereum Boot Node'larına benzer, daha fazla ayrıntı için [buraya](https://ethereum.org/en/developers/docs/nodes-and-clients/bootnodes/) bakabilirsiniz. 

> Boot Node'ların temel faydası, kullanıcıların BSC ağına bağlanmalarının daha kolay olmasıdır. Kullanıcıların artık `config.toml` dosyasında `StaticNodes` ayarlamalarına gerek yok, sadece bu alanı boş bırakmaları ve `config.toml` dosyasındaki `BootstrapNodes` alanını silmeleri yeterlidir.  
> — BSC Geliştirme Ekibi

## Kullanıcılara Etkisi

### Statik Düğümler Durdurulabilir

Önceden, BSC, kullanıcıların ağa bağlanması için bir listede `StaticNodes` sağlıyordu; bunlar tam düğüm olarak çalışıyor ve ayrıca P2P keşif protokolüne hizmet ediyordu. Yeni BSC düğümleri, bu `StaticNodes` üzerinden BSC ağına bağlanmaktadır. Çalışıyor, ancak oldukça kararsız, çünkü çok ağır bir iş yüküne sahip olabilirler. 

:::info
Bu statik düğümler, gelecekte Boot Node'lar ile durdurulabilir ve değiştirilebilir. Ayrıca, daha önce sağlanan `StaticNodes` listesi artık mevcut olmayabilir.
:::

> Bu liste, [v1.2.11 5](https://github.com/bnb-chain/bsc/releases/tag/v1.2.11) sürümünde sağlanan liste gibidir:  
> ```plaintext
> StaticNodes = [
> "enode://fe0bb07eae29e8cfaa5bb15b0db8c386a45b7da2c94e1dabd7ca58b6327eee0c27bdcea4f08db19ea07b9a1391e5496a28c675c6eee578154edae4fa44640c5d@54.228.2.74:30311",
> ...
> ]
> ```

### Ağa Bağlanmak İçin BootNode'lar Kullanımı

* Eğer `v1.2.12` sürümünden önceki BSC sürümünü kullanıyorsanız, `v1.2.12` sürümüne geçmeden de BootNode'ları deneyebilirsiniz. Bunu yapmak için `config.toml` dosyanızda `BootstrapNodes` alanını ayarlayıp yeniden başlatmanız yeterlidir. Aşağıda listelenen altı `BootstrapNodes` öğesini doğrudan kullanabilirsiniz; bunlar `v1.2.12` sürümündeki mevcut varsayılan `BootstrapNodes`'lardır:

```
...
[Node.P2P]
MaxPeers = 200
NoDiscovery = false
BootstrapNodes = [
"enode://433c8bfdf53a3e2268ccb1b829e47f629793291cbddf0c76ae626da802f90532251fc558e2e0d10d6725e759088439bf1cd4714716b03a259a35d4b2e4acfa7f@52.69.102.73:30311",
...
]
StaticNodes = []
ListenAddr = ":30311"
...
```

:::tip
Eğer `v1.2.12` veya daha yeni bir BSC sürümü kullanıyorsanız, `BootstrapNodes` alanını ayarlamanıza gerek yok, ancak bu alanı boş bırakamazsınız. `config.toml` dosyasından silmeniz gerektiğinden emin olun.
:::

Gelecekte boot node listesindeki herhangi bir güncelleme olabileceğinden dolayı varsayılan değeri silip kullanmak tercih edilir. `config.toml` dosyanız aşağıdaki gibi görünmelidir:

```
...
[Node.P2P]
MaxPeers = 200
NoDiscovery = false
StaticNodes = []
ListenAddr = ":30311"
..
```

### Boot Node Çalıştırma

Boot node'lar süper hafif düğümlerdir ve çok düşük maliyetli bir cihazda çalıştırılabilirler, örneğin: **2 çekirdek, 2GB bellek, 20GB disk**. 
Eğer BSC ekosistemine yeni boot node'lar sağlayarak destek olmak istiyorsanız, bunu yapmak için [bu](https://github.com/bnb-chain/bsc#running-a-bootnode) kılavuzunu takip edebilirsiniz.

## Yardım

Boot node'lar yakın zamanda tanıtıldığından, kullanımda herhangi bir sorunla karşılaşırsanız, lütfen bizimle iletişime geçin. [BSC GitHub deposu](https://github.com/bnb-chain/bsc/issues) üzerinde yeni bir sorun oluşturabilirsiniz. 