---
title: Light Peer, Greenfield tarafından bir BSC veri tohumlayıcı
description: Light Peer, BSC blockchain verilerini daha verimli bir şekilde sağlamak için tasarlanmış bir çözümdür. Bu kılavuz, Light peer'in nasıl çalıştığını ve BSC düğümlerine nasıl bağlanılacağını açıklar.
keywords: [BNB Greenfield, NodeReal, Veri Arşiv Katmanı, Light Peer, BSC veri sağlama]
---

# Light Peer

`block-hub` lansmanı ile BSC tarihsel blok verileri artık Greenfield üzerinde erişilebilir. Tam senkron modda BSC düğümleri çalıştıranlar için **Light peer'e** bağlanmak faydalı bir seçimdir. **Light peer**, blok verilerini Greenfield'dan alır ve BSC düğümlerine P2P ağı aracılığıyla sağlar.

## Light Peer'in Çalışma Şekli

Aşağıdaki diyagram, Light peer'in işlevselliğini göstermektedir. Light peer, BSC ağındaki diğer operasyonlara katılmamakta, yalnızca blok verilerini BSC düğümlerine sağlamaktadır. Kendi başına herhangi bir veriyi saklamaz; bunun yerine, diğer BSC düğümlerinden gelen istekleri (`GetBodies` ve `GetHeaders`) aldığında, Greenfield'dan bir dizi blok (blok sayısı Block Indexer tarafından belirlenir) alır ve bunları bellekte önbelleğe alır. **Bu**, Light peer'in BSC düğümlerine blok verilerini verimli bir şekilde iletmesini sağlar.

![light peer](../../../images/bnb-chain/bnb-greenfield/static/asset/light-peer.png)

## Light Peer ile Etkileşim Kurma

Light Peer kullanımı basittir. BSC düğümünüzü Light peer'e bağlanacak şekilde yapılandırmak için yapılandırma dosyanızdaki ayarları düzenleyin.

:::tip
BSC düğümünüzün yapılandırma dosyasının P2P bölümüne gidin ve Light peer'in enode bilgilerini belirtin.
:::

```toml
# diğer yapılandırmalar atlanmıştır
...
[Node.P2P]
MaxPeers = 1
NoDiscovery = true
TrustedNodes = []
StaticNodes=["enode://a2c586f41d2cc6dc7445e32922305e92b4de7daad718744d12bf105a79715606330535cffae6a0d60c61567ff772796d906fcb72b9cbb578f10de3221bb34015@13.115.90.65:30303?discport=0"]
...
```