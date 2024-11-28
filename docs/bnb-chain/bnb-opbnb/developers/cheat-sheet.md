---
title: Donanım Gereksinimleri - opBNB Geliştir
description: BNB Zinciri ekosisteminde düğüm kurma için gereken donanım gereksinimleri hakkında bilgi verilmektedir. Minimum ve önerilen yapılandırmalar ile performans optimizasyonları ele alınmaktadır.
keywords: [opBNB, donanım gereksinimleri, BNB Zinciri, düğüm kurma, L1 RPC, L2 senkronizasyon]
---

# Donanım Gereksinimleri

BNB Zinciri ekosisteminde bir düğüm kurmak, donanım gereksinimlerini anlamayı gerektirir. **Minimum Donanım Gereksinimi**, ortalama işlem hacimlerinin verimli yönetimini sağlarken, **Önerilen Donanım Gereksinimi** yüksek performans sunar ve saniyede 100 milyon gaz işleme kapasitesine ve 1k QPS (Saniye Başına Sorgu) işlemesine olanak tanır; bu, ağır işlem yükleri veya en yüksek verimlilik için idealdir.

## İşlemci

CPU Tipi: Intel Xeon Ölçeklenebilir işlemcileri (Ice Lake) veya daha yenisi 

**op-node:**  

- Minimum: 4 çekirdek
- Önerilen: 8 çekirdek veya daha fazlası

**op-geth:** 

- Minimum: 12 çekirdek
- Önerilen: 16 çekirdek veya daha fazlası

## Bellek

**op-node:**  

- Minimum: 4 GB
- Önerilen: 16 GB

**op-geth:** 

- Minimum: 10 GB
- Önerilen: 32 GB

## Depolama

**op-node:**  

- Ek kalıcı depolama gerektirmiyor

**op-geth:** 

- 3000 IOPS veya üzerinde gerektirir
- Uzun süreli işlem geçmişi için 1TB veya daha fazlası

## Ağ

- 125MB/s veya daha yüksek bant genişliği olan kararlı bir ağ

---

# Kendi opBNB Düğümünüzü Çalıştırma

- Yerel geliştirme düğümü kurulumu: `Yerel Geliştirme Ortamı Çalıştırma`
- Ana ağ/test ağı düğümü kurulumu: `Yerel Düğüm Çalıştırma`
- Akıllı Sözleşme Doğrulama: `opBNBScan ile Hardhat & Truffle Doğrulama`

---

# Performans Stabilite Optimizasyonu

**L1 RPC Yapılandırması:**

:::tip 
op-node kurulumları için L2 çözümleri üzerinde birden fazla L1 RPC uç noktası yapılandırarak L1 zinciri ile senkronizasyon, güvenlik, veri bütünlüğü sağlamak ve tek nokta hatası riskini azaltmak.
:::

Örneğin:
```bash
  export L1_RPC1=https://bsc-dataseed.bnbchain.org
  export L1_RPC2=https://bsc.nodereal.io
  --l1=rpc1,rpc2…
```
L1 makbuz alma performansını optimize et

- **op-node:** `--l1.rpckind=bsc_fullnode`

---

**L2 Senkronizasyon Modu Ayarları:**

- **op-geth:** `--gcmode=archive`
- **op-node:** `--l2.engine-sync=true`

---

# Düğüm Sağlığı İzleme

## JSON Modeli İçe Aktarma

Düğümünüzün sağlığını `rpc_nodes.json` modelini içe aktararak izleyin.

---

## Önemli Metrikler

- **chain_head_header:** Düğümün mevcut güvenli olmayan blok numarasını gösterir. Artmayan bir sayı senkronizasyon sorunlarını, azalan bir sayı ise yeniden düzenlemeleri belirtir.
- **rpc_duration_all:** RPC sunucusu istek sürelerinin histogramı.
- **rpc_requests:** RPC sunucusuna yapılan toplam istek.
- **p2p_peers:** op-geth'ye bağlı olan eşlerin sayısı. Motor üzerinden senkronizasyon için gereklidir. Eğer sıfırsa, op-geth senkronize olamaz.
- **op_node_default_peer_count:** op-node'a bağlı olan eşlerin sayısı. Eşler olmadan, op-node güvenli olmayan blokları senkronize edemez ve L1 senkronizasyonuna bağımlı olduğu için sıralayıcıdan geri kalır.

---