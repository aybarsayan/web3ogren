# Çapraz Zincir köprüleri

Merkeziyetsiz çapraz zincir köprüleri TON Blockchain üzerinde çalışır ve TON Blockchain'den diğer blok zincirlerine ve bunun tersine varlık transferi yapmanıza olanak tanır.

## Toncoin Köprüsü

Toncoin köprüsü, Toncoin'i TON Blockchain ile Ethereum blok zinciri arasında ve TON Blockchain ile BNB Akıllı Zincir arasında transfer etmenizi sağlar. 

Köprü, `merkeziyetsiz oracle'lar` tarafından yönetilmektedir.

### Nasıl kullanılır?

Köprü ön yüzü [ton.org/bridge](https://ton.org/bridge) adresinde barındırılmaktadır.

:::info
[Köprü ön yüzü kaynak kodu](https://github.com/ton-blockchain/bridge)
:::

### TON-Ethereum akıllı sözleşmeleri kaynak kodları

* [FunC (TON tarafı)](https://github.com/ton-blockchain/bridge-func)
* [Solidity (Ethereum tarafı)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)

### TON-BNB Akıllı Zincir akıllı sözleşmeleri kaynak kodları

* [FunC (TON tarafı)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
* [Solidity (BSC tarafı)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)

### Blockchain Yapılandırmaları

Gerçek köprü akıllı sözleşme adreslerini ve oracle adreslerini ilgili yapılandırmayı kontrol ederek alabilirsiniz:

- TON-Ethereum: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738).
- TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739).
- TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740).

### Dokümantasyon

* [Köprünün nasıl çalıştığı](https://github.com/ton-blockchain/TIPs/issues/24)

:::note
Çapraz zincir köprüleri, farklı blok zincirleri arasındaki varlık transferlerinde önemli bir rol oynar.
:::

### Çapraz zincir yol haritası

* https://t.me/tonblockchain/146