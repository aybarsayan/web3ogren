---
title: Arşiv Düğümü - BSC Geliştirme
description: Bu sayfa, BNB Akıllı Zinciri üzerinde arşiv düğümü çalıştırmanın önemini ve gereksinimlerini detaylandırmaktadır. Geliştiricilerin sürekliliğini sağlamak için önceki blok verilerine nasıl erişim sağlayacaklarını öğrenmelerine yardımcı olacaktır.
keywords: [arşiv düğümü, BSC, tam düğüm, Erigon, Reth, blok zinciri, geliştirme]
---

# BNB Akıllı Zincirinde Bir Arşiv Düğümü Nasıl Çalıştırılır

## Arşiv düğümü nedir?

Kısaca, arşiv düğümü `--gcmode archive` özel seçeneği ile çalışan tam bir düğümdür. Zincirin başlangıç bloğundan itibaren tüm tarihsel verileri saklar. Sadece en son bloklar için tüm durum değişiklik verilerini tutan tipik bir tam düğüm ile karşılaştırıldığında, arşiv düğümü her blok için bunları her zaman saklar.

## Arşiv düğümü neden önemlidir?

Geliştiriciler, bir tam düğüm ile bir adresin bakiyesini ve bir akıllı sözleşmenin durumunu kontrol etmek için sınırlı son bloklara sorgu yapma ile sınırlıdır. 

:::tip
Arşiv düğümleri, kullanıcıların belirli bir zamanda herhangi bir blok sorgulamasına olanak tanır, bu da geliştirme süreçlerini hızlandırır.
:::

Zincir ilerlerken istediklerini elde etmek zorlaşırken, arşiv düğümü ile belirli bir zamanda herhangi bir blok sorgulayabilirler. 

> "Arşiv düğümleri, çeşitli uygulamalar tarafından zorlu kullanım senaryoları için kullanılmaktadır."  
> — Geliştirici Rehberi

Arşiv düğümleri, aşağıdakiler de dahil olmak üzere, blok zincir üzerindeki çeşitli uygulamalar tarafından zorlu kullanım senaryoları için kullanılmaktadır:

- Otomatik ticaret sistemleri, ticaret modelini optimize etmek için tarihsel verilere ihtiyaç duyar
- Doğrulama modülleri, işlemleri zamanında doğrulamak için durum verilerine ihtiyaç duyar
- Analitik araçlar, veri analizi yapmak için tam tarihsel verilere ihtiyaç duyar
- Bazı cüzdanlardaki borsa, hızlı ve etkili transferler için arşiv düğümüne bağımlıdır

## Önerilen Gereksinimler

Bir arşiv düğümü çalıştırmak yüksek maliyet gerektirecektir çünkü tüm blok ve durum değişiklik verilerini içerir. Öncelikle yeterli kapasiteye sahip bir disk gerektirir; bunun yanı sıra, CPU ve disk performansı son blok yüksekliğini yakalamak için yeterince iyi olmalıdır. [önerilen donanım gereksinimlerine](https://github.com/node-real/bsc-erigon?tab=readme-ov-file#system-requirements) başvurabilirsiniz.

## BSC ana ağında bir arşiv düğümünü nasıl çalıştırırsınız?

### Erigon istemcisi ile çalıştırma

[Erigon](https://github.com/node-real/bsc-erigon) artık BSC ana ağını desteklemektedir. En son sürüm, sadece 3 gün içinde sıfırdan bir arşiv düğümü senkronize etmenizi sağlar ve 4.3 TB disk alanı kullanır. Aşağıda gösterildiği gibi Erigon ile bir arşiv düğümü çalıştırabilirsiniz.

### Reth istemcisi ile çalıştırma

[Reth](https://github.com/bnb-chain/reth) artık BSC ağını desteklemekte ve son benchmark testlerinde Geth ve Erigon'a kıyasla üstün performans sergilemektedir. Arşiv düğümü (ve tam düğüm) çalıştırmak için reth'i kullanabilirsiniz; daha fazla bilgi için `Tam Düğüm` referansına bakabilirsiniz.

---

title: BSC Erigon Düğümü Dağıtım Kılavuzu
---

### BSC Erigon Düğümü Dağıtımı

Node Real ekibi tarafından yönetilen BSC Erigon, BSC ağı için önde gelen arşiv düğümü uygulaması olmayı amaçlayan bir Erigon çatallamasıdır.

## Donanım Gereksinimleri

BSC Erigon düğümünüzün optimal performansını sağlamak için aşağıdaki donanım spesifikasyonlarını öneriyoruz:

* **RAM:** 64GB veya daha fazla (daha yüksek RAM, daha iyi performans ile ilişkilidir)
* **Depolama:** SSD veya NVMe
    - Arşiv Düğümü: Minimum 5TB
    - Hızlı Düğüm: Minimum 700GB

## BSC Erigon Düğümü Dağıtım Adımları

### 1. Erigon Binariesini Temin Etme

Seçenek 1: Kaynak Koddan Derleme
```shell
git clone https://github.com/node-real/bsc-erigon.git
cd bsc-erigon
make erigon
```
Seçenek 2: Docker imajını kullanma
```shell
docker pull ghcr.io/node-real/bsc-erigon:${latest_version}
```
### 2. Erigon Düğümünü Başlatma
Varsayılan olarak, düğüm arşiv modunda çalışacaktır. Sıfırdan senkronize etmek genellikle yaklaşık 3 gün sürer.
```shell
./build/bin/erigon \
--datadir="<your_data_directory_path>" \
--chain=bsc \
--port=30303 \
--http.port=8545 \
--authrpc.port=8551 \
--torrent.port=42069 \
--private.api.addr=127.0.0.1:9090 \
--http --ws \
--http.api=eth,debug,net,trace,web3,erigon,bsc
```
**Not**: Birden fazla örnek çalıştırırken, her zincir için farklı portlar belirtin, böylece port çakışmalarından kaçının.

### 3. Hızlı Düğüm Çalıştırma (Arşiv Dışı Mod)
Hızlı bir düğüm başlatmak için `--prune.mode=minimal` bayrağını ekleyin. Bu mod yalnızca son 3 günün durum ve blok verilerini saklar ve geçmiş 3 gün için debug_trace* işlemlerini destekler.

Günlerce senkronize etmeden çalışmak isterseniz, [topluluk tarafından yönetilen depo](https://github.com/48Club/bsc-snapshots) dan hızlı düğüm anlık görüntüleri alabilirsiniz.

:::info
Bu adımları takip ederek, gereksinimlerinize göre ya bir tam BSC Erigon düğümü veya bir hızlı düğüm dağıtabilirsiniz.
:::

Hangi seçeneği tercih ederseniz edin, BSC Erigon size verimli ve güvenilir bir düğüm hizmeti sunacaktır.