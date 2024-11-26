---
sidebarLabel: Küme ve Uç Noktalar
title: Küme ve Kamu RPC Uç Noktaları
sidebarSortOrder: 8
description:
  Solana'nın ağ kümeleri (Devnet, Testnet ve Mainnet Beta),
  kamu RPC uç noktaları, oran sınırları ve kullanım durumları hakkında bilgi edinin. Farklı Solana
  ağlarına geliştirme, test etme ve üretim için nasıl bağlanacağınızı öğrenin.
---

Solana blok zincirinde, `Küme` olarak bilinen birkaç farklı doğrulayıcı grubu bulunmaktadır. Her bir küme, genel ekosistem içinde farklı amaçlar için hizmet verir ve kendi Kümesi için `JSON-RPC` isteklerini yerine getiren özel api düğümleri içerir.

Bir Küme içindeki bireysel düğümler üçüncü şahıslar tarafından sahiplenilir ve işletilir; her biri için kamuya açık bir uç nokta mevcuttur.

## Solana kamu RPC uç noktaları

Solana Labs organizasyonu, her Küme için bir kamu RPC uç noktası işletmektedir. Bu kamu uç noktaları oran sınırlamalarına tabidir, ancak kullanıcıların ve geliştiricilerin Solana blok zinciri ile etkileşimde bulanmaları için mevcuttur.

> Kamu uç nokta oran sınırlarının değişiklik gösterebileceği unutulmamalıdır. Bu belgede yer alan belirli oran sınırlarının en güncel olacağı garantisi verilmemektedir.  
> — Solana Labs

### Farklı Kümeleri kullanarak keşif yapmak

Birçok popüler Solana blok zinciri keşif aracı, herhangi bir Küme'yi seçme desteği sağlar ve genellikle ileri düzey kullanıcıların özel/özel bir RPC uç noktası eklemesine de olanak tanır.

Bu Solana blok zinciri keşif araçlarından bazıları şunlardır:

- [http://explorer.solana.com/](https://explorer.solana.com/)
- [http://solana.fm/](https://solana.fm/)
- [http://solscan.io/](https://solscan.io/)
- [http://solanabeach.io/](http://solanabeach.io/)
- [http://validators.app/](http://validators.app/)

## Yüksek seviyede

- Mainnet: Yayınlanan uygulamalar için canlı üretim ortamı.
- Devnet: Uygulamalarını deneyen geliştiriciler için kamu erişimine sahip test ortamı.
- Testnet: Ağ yükseltmeleri ve doğrulayıcı performansı için stres testi.

**Örnek kullanım durumları**: Devnet’te yeni bir programı hata ayıklamak veya Mainnet dağıtımından önce Testnet’te performans metriklerini doğrulamak isteyebilirsiniz.

| **Küme**    | **Uç Nokta**                           | **Amaç**                      | **Notlar**                     |
| ----------- | -------------------------------------- | ------------------------------ | ------------------------------- |
| Mainnet     | `https://api.mainnet-beta.solana.com` | Canlı üretim ortamı          | İşlemler için SOL gereklidir    |
| Devnet      | `https://api.devnet.solana.com`       | Kamu test ve geliştirme       | Test için ücretsiz SOL airdrop |
| Testnet     | `https://api.testnet.solana.com`      | Doğrulayıcı ve stres testi    | Kesintili zamanlar olabilir     |

---

## Devnet

Devnet, Solana'yı bir deneme sürüşüne çıkarmak isteyen her birey için bir oyun alanı işlevi görmektedir; kullanıcı, token sahibi, uygulama geliştirici veya doğrulayıcı olarak.

- Uygulama geliştiricileri Devnet'i hedeflemelidir.
- Potansiyel doğrulayıcılar önce Devnet’i hedeflemelidir.

:::note
Devnet ve Mainnet Beta arasındaki ana farklar:
- Devnet tokenları **gerçek değildir**.
- Devnet, uygulama testleri için airdrop'lar sağlayan bir token musluğuna sahiptir.
- Devnet, defter sıfırlamalarına tabi olabilir.
- Devnet genellikle Mainnet Beta ile aynı yazılım sürüm dalında çalışır, ancak Mainnet Beta'dan daha yeni bir küçük sürüm versiyonu çalıştırabilir.
:::

- Devnet için Gossip giriş noktası: `entrypoint.devnet.solana.com:8001`

### Devnet uç noktası

- `https://api.devnet.solana.com` - tek Solana Labs barındırılan api düğümü; oran sınırlıdır.

#### Örnek `solana` komut satırı yapılandırması

`devnet` Kümesi'ne Solana CLI kullanarak bağlanmak için:

```shell
solana config set --url https://api.devnet.solana.com
```

### Devnet oran sınırları

- IP başına 10 saniyede maksimum istek sayısı: 100
- Tek bir RPC için IP başına 10 saniyede maksimum istek sayısı: 40
- IP başına maksimum eşzamanlı bağlantı: 40
- IP başına 10 saniyede maksimum bağlantı oranı: 40
- 30 saniyede maksimum veri miktarı: 100 MB

---

## Testnet

Testnet, Solana çekirdek katkıda bulunanlarının canlı bir kümede en son sürüm özelliklerini stres testine tabi tuttuğu yerdir; özellikle ağ performansı, istikrar ve doğrulayıcı davranışına odaklanmaktadır.

- Testnet tokenları **gerçek değildir**.
- Testnet, defter sıfırlamalarına tabi olabilir.
- Testnet, uygulama testleri için airdrop'lar sağlayan bir token musluğuna sahiptir.
- Testnet genellikle hem Devnet hem de Mainnet Beta'dan daha yeni bir yazılım sürüm dalını çalıştırır.
- Testnet için Gossip giriş noktası: `entrypoint.testnet.solana.com:8001`

### Testnet uç noktası

- `https://api.testnet.solana.com` - tek Solana Labs api düğümü; oran sınırlıdır.

#### Örnek `solana` komut satırı yapılandırması

`testnet` Kümesi'ne Solana CLI kullanarak bağlanmak için:

```shell
solana config set --url https://api.testnet.solana.com
```

### Testnet oran sınırları

- IP başına 10 saniyede maksimum istek sayısı: 100
- Tek bir RPC için IP başına 10 saniyede maksimum istek sayısı: 40
- IP başına maksimum eşzamanlı bağlantı: 40
- IP başına 10 saniyede maksimum bağlantı oranı: 40
- 30 saniyede maksimum veri miktarı: 100 MB

---

## Mainnet Beta

Solana kullanıcıları, geliştiricileri, doğrulayıcıları ve token sahipleri için izinsiz, kalıcı bir kümedir.

- Mainnet Beta'da ihraç edilen tokenlar **gerçek** SOL'dur.
- Mainnet Beta için Gossip giriş noktası: `entrypoint.mainnet-beta.solana.com:8001`

### Mainnet beta uç noktası

- `https://api.mainnet-beta.solana.com` - Solana Labs tarafından barındırılan api düğümü kümesi, yük dengeleyici ile desteklenmektedir; oran sınırlıdır.

#### Örnek `solana` komut satırı yapılandırması

`mainnet-beta` Kümesi'ne Solana CLI kullanarak bağlanmak için:

```shell
solana config set --url https://api.mainnet-beta.solana.com
```

### Mainnet beta oran sınırları

- IP başına 10 saniyede maksimum istek sayısı: 100
- Tek bir RPC için IP başına 10 saniyede maksimum istek sayısı: 40
- IP başına maksimum eşzamanlı bağlantı: 40
- IP başına 10 saniyede maksimum bağlantı oranı: 40
- 30 saniyede maksimum veri miktarı: 100 MB

> Kamu RPC uç noktaları, üretim uygulamaları için tasarlanmamıştır. Uygulamanızı başlatırken, NFT'leri bırakırken vb. özel/özel RPC sunucuları kullanmanızı öneririz. Kamu hizmetleri kötüye kullanıma tabidir ve oran sınırları önceden bildirim olmaksızın değişebilir. Bununla birlikte, yüksek trafikli web siteleri önceden bildirim olmaksızın engellenebilir.

---

## Yaygın HTTP Hata Kodları

- **403** -- IP adresiniz veya web siteniz engellendi. Kendi RPC sunucunuzu çalıştırmanın veya özel bir hizmet bulmanın zamanı geldi.
- **429** -- IP adresiniz oran sınırlarını aşıyor. Yavaşlayın! Başka bir istekte bulunmadan önce ne kadar beklemeniz gerektiğini belirlemek için [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) HTTP yanıt başlığını kullanın.