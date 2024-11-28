---
title: Yeşil Alan SP Ağı'ndan Çıkış - BNB Yeşil Alan SP
description: Bu kılavuz, SP'lerin Yeşil Alan NextWork'tan çıkışını detaylı bir şekilde açıklamaktadır. Adım adım talimatlar ve önemli bilgilerle süreci kolayca takip edebilirsiniz.
keywords: [Yeşil Alan, SP, BNB, blok zinciri, veri kurtarma, işlem başlatma, çıkış]
---

Bu kılavuz, SP'lerin Ana Ağa veya Test Ağı üzerinde Yeşil Alan NextWork'tan nasıl çıkacaklarına dair adım adım talimatlar sağlar ve hem çıkarılan SP hem de halef SP'ler tarafından gerçekleştirilmesi gereken gerekli eylemleri içerir.

- `Yeşil Alan ağından çıkış nasıl yapılır`
  - `1. Çıkışı ilan et`
  - `2. Veri kurtarma`
    - `2.1 RezervSwapİçin`
    - `2.2 Veri Kurtarma`
    - `2.3 TamamlaSwapİçin`
  - `3. Çıkışı tamamla`

## Yeşil Alan ağından çıkış nasıl yapılır
Bir SP'nin Yeşil Alan ağından çıkmaya karar vermesi durumunda, hem çıkarılan SP'yi hem de ağdaki diğer SP'leri içeren üç ana adım bulunmaktadır:

1. Çıkışı ilan et
2. Halef SP'ler tarafından veri kurtarma
3. Çıkışı tamamla

### 1. Çıkışı ilan et 

Çıkan SP, Yeşil Alan blok zincirine `StorageProviderExit` işlemi başlatmalıdır. Bu işlem, durumunu `STATUS_GRACEFUL_EXITING` olarak değiştirecektir.

Ağdan çıkmak için ilgili ağa göre aşağıdaki komutları kullanabilirsiniz:

=== "Ana Ağ"

    ```
    rpcAddr = "https://greenfield-chain.bnbchain.org:443"
    chainId = "greenfield_1017-1"
    ```

=== "Test Ağı"

    ```
    rpcAddr = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
    chainId = "greenfield_5600-1"
    ```

Depolama sağlayıcısı için çıkış komutu:
```shell
gnfd-sp spExit [komut seçenekleri] [argümanlar...]
```
**Örnek:**
```shell
./build/bin/gnfd-sp spExit --config ./config.toml
```

### 2. Veri kurtarma

Halef olmak isteyen SP'lerin aşağıdaki veri kurtarma adımlarını gerçekleştirmeleri gerekir:

#### 2.1 RezervSwapİçin

Potansiyel halef SP, çıkan SP'nin sahip olduğu Küresel Sanal grup (GVG) ve Küresel Sanal Grup Ailesini (VGF) belirlemelidir. 
Bu bilgi [GreenfieldScan](https://greenfieldscan.com/account/0x2901fddef924f077ec6811a4a6a1cb0f13858e8f?tab=gvg) adresinden veya sağlanan CLI'yi kullanarak elde edilebilir.

Kullanım:
```shell
# Çıkan SP'nin ikincil SP olarak işlediği GVG'leri listele
./gnfd-sp query-gvg-by-sp [komut seçenekleri] [argümanlar...]
# Çıkan SP'nin birincil SP olarak işlediği GVG Ailelerini listele
./gnfd-sp query-vgf-by-sp [komut seçenekleri] [argümanlar...]
```
**Örnek:**
```shell
# Çıkan SP'nin (id=1) ikincil SP olarak işlediği GVG'leri listele
./gnfd-sp query-gvg-by-sp --config ./config.toml -sp 1
# Çıkan SP'nin (id=1) birincil SP olarak işlediği GVG Ailelerini listele
./gnfd-sp query-vgf-by-sp --config ./config.toml -sp 1
```

Halef SP gerekli bilgileri edindikten sonra, çıkan SP'nin GVG Ailesi veya GVG'sinde bir pozisyon rezerve etmelidir.

Kullanım:
```shell
# Çıkan SP'nin GVG ailesindeki veya GVG'deki pozisyonunu rezerve et
./gnfd-sp swapIn [komut seçenekleri] [argümanlar...]
```

**Örnek:**
```shell
# Çıkan SP'nin (id=1) GVG ailesindeki pozisyonunu rezerve et (id=1)
./gnfd-sp swapIn --config ./config.toml -f 1 -sp 1
# Çıkan SP'nin (id=1) GVG'deki pozisyonunu rezerve et (id=1)
./gnfd-sp swapIn --config ./config.toml --gid 1 -sp 1
```

#### 2.2 Veri Kurtarma

Veri kurtarma süreci, halef SP tarafından aşağıdaki komutlar kullanılarak başlatılır:

Kullanım:
```shell
./gnfd-sp recover-vgf [komut seçenekleri] [argümanlar...]
./gnfd-sp recover-gvg [komut seçenekleri] [argümanlar...]
```
**Örnek:**
```shell
# Çıkan SP'nin verilerini VGF (id=1) içinde birincil SP olarak kurtarmak için:
./gnfd-sp recover-vgf --config /config/config.toml -f 1
# Çıkan SP'nin verilerini GVG (id=1) içinde ikincil SP olarak kurtarmak için:
./gnfd-sp swapIn --config ./config.toml --gid 1
```
Kurtarma işi başlatıldığında, SP Yönetim modülünde arka planda çalışacaktır. İlerleme, aşağıdaki komut kullanılarak sorgulanabilir:

Kullanım:
```shell
./gnfd-sp query-recover-p [komut seçenekleri] [argümanlar...]
```
**Örnek:**
```shell
# GVG ailesi (id=1) kurtarma ilerlemesini sorgula 
./gnfd-sp recover-vgf --config ./config.toml -f 1
# GVG (id=1) kurtarma ilerlemesini sorgula
./gnfd-sp recover-vgf --config ./config.toml --gid 1
```

#### 2.3 TamamlaSwapİçin

Veri kurtarma süreci tamamlandıktan ve başarıyla doğrulandıktan sonra, halef SP, Yeşil Alan blok zincirine `CompleteSwapIn` işlemi göndermelidir. Bu işlem, kurtarma süreci sonuçlanmadan önce otomatik olarak yapılacaktır. 
Bu, kurtarma sürecini tamamlayacak ve halef SP'nin GVG Ailesindeki veya GVG'deki pozisyonu devralmasına izin verecektir.

:::warning
`CompleteSwapIn` işleminin, halef SP'nin veri kurtarma sürecini henüz tamamlamadığı halde manuel olarak tetiklenmemesi son derece önemlidir. Aksi takdirde, veri erişilebilirliği sorunları ve potansiyel fon kaybı yaşanabilir.

### 3. Çıkışı tamamla
Halef SP, veri kurtarma sürecini tamamladıktan ve GVG Ailesindeki veya GVG'deki pozisyonu devraldıktan sonra, çıkarılan SP'nin GVG istatistiklerini kontrol ederek, onunla ilişkili daha fazla GVG olmadığını doğrulamalıdır. Yeşil Alan ağındaki herkes, ağdan çıkışını tamamlamak için Yeşil Alan blok zincirine `CompleteStorageProviderExit` işlemi gönderebilir. 
Aşağıda, çıkarılan SP tarafından tetiklenen CLI gösterilmektedir.

Kullanım:
```shell
./gnfd-sp completeSpExit [komut seçenekleri] [argümanlar...]
```

**Örnek:**
```shell
./gnfd-sp completeSpExit --config /config/config.toml
```