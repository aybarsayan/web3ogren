---
title: Docker Kullanarak BSC Düğümleri Çalıştırma - BSC Geliştir
description: Bu makalede Docker kullanarak BSC düğümlerinin nasıl çalıştırılacağına dair adım adım bir rehber sunulmaktadır. Kaynaklar, kurulum ve yapılandırma adımları detaylandırılmıştır.
keywords: [BSC, Docker, Düğüm, Kurulum, Yapılandırma, Ethereum, Geth]
---

# BSC Docker Görüntüsü Kullanarak Tam Düğüm Nasıl Çalıştırılır

## Kaynaklar
* Docker görüntüsü: [https://github.com/bnb-chain/bsc/pkgs/container/bsc](https://github.com/bnb-chain/bsc/pkgs/container/bsc)
* Dockerfile: [https://github.com/bnb-chain/bsc/blob/master/Dockerfile](https://github.com/bnb-chain/bsc/blob/master/Dockerfile)

## Desteklenen Platformlar

Bir BSC docker görüntüsünün **Mac OS X**, **Linux** ve **Windows** üzerinde çalıştırılmasını destekliyoruz.

---

## Docker'da Tam Düğüm Çalıştırma Adımları

### Docker'ı Kurun
* Masaüstü Kullanıcıları: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
* Ubuntu Linux: [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/)

#### Kurulumdan Sonra:

Başlangıçta docker'ı başlatın:
```
systemctl enable docker.service
systemctl enable containerd.service
```
Kullanıcı "ubuntu"yu docker grubuna ekleyin, böylece kullanıcının docker komutlarını çalıştırma yetkisi olsun:
```
usermod -aG docker ubuntu
```

### BSC Düğüm Görüntüsünü İndirin

* Son sürümü alın: [https://github.com/bnb-chain/bsc/pkgs/container/bsc](https://github.com/bnb-chain/bsc/pkgs/container/bsc)
```
docker pull ghcr.io/bnb-chain/bsc:latest
```

### BSC Düğüm Yapılandırma Dosyalarını İndirin

**genesis.json** ve **config.toml** dosyalarını indirin:

- Ana Ağı
```bash
wget $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest | grep browser_ | grep mainnet | cut -d\" -f4)
unzip mainnet.zip
```
- Test Ağı
```bash
wget $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest | grep browser_ | grep testnet | cut -d\" -f4)
unzip testnet.zip
```

### Docker Konteynerini Çalıştırma
1. Docker Değişkenleri ve Yapılandırma Dosyası Yeri

Dikkate alınması gereken önemli **Çevre Değişkenleri**:
```
$BSC_HOME = /bsc
$DATA_DIR = /data
```
Dosya konumu:

* BSC_CONFIG=${BSC_HOME}/config/config.toml
* BSC_GENESIS=${BSC_HOME}/config/genesis.json

2. Montaj İçin Docker Hacimleri

Temel olarak iki dizini bağlama montajı yapmamız gerekiyor:

|    Montaj        | Yerel  | Docker                     |
| ----------------- | ------------- | -------------------------------------- |
| Blok Zinciri Verileri | data/node | /bsc/node    |
| Yapılandırma dosyaları | config  | /bsc/config  |

3. Yerel ana bilgisayara veri indirin  
En son chaindata anlık görüntüsünü [buradan](https://github.com/bnb-chain/bsc-snapshots) indirin. Dosyalarınızı yapılandırmak için kılavuzu izleyin.

4. Konteyneri Başlat

Yapılandırma dosyasındaki ayarları geçersiz kılmak için *ETHEREUM SEÇENEKLERİ* de kullanabilirsiniz:
```
docker run -v $(pwd)/config:/bsc/config -v $(pwd)/data/node:/bsc/node -p 8575:8575 --rm --name bsc -it ghcr.io/bnb-chain/bsc:1.1.18_hr --http.addr 0.0.0.0 --http.port 8575 --http.vhosts '*' --verbosity 5
```
* *-p 8575:8575*: Bu, ana bilgisayardan konteynıra 8575 portunu eşleştirir, böylece ana bilgisayardaki düğümde 8575'i açar.
* *--http --http.addr 0.0.0.0*: RPC'yi etkinleştirmek ve konteynerin tüm ağ arayüzlerinde dinlemek için ek Geth bayrakları.

:::note
**NOT**: **8575** portu TESTNET'teki RPC hizmetinin varsayılan portudur. Ana ağa geçiyorsanız varsayılan port **8545**'tir.
:::

5. Geth konsolunu başlat
```
geth attach http://localhost:8575
```

### Konteynerinize nasıl erişilir

bsc adlı konteynerde bash (shell/terminal) çalıştırın:

```
docker exec -it bsc bash
```
Giriş yaptıktan sonra, docker olmadan bir düğümde yapacağınız olağan görevleri yerine getirebilirsiniz.

---

### Düğüm Çalışma Durumunu Kontrol Etme

#### Senkronizasyonu Kontrol Etme

Geth Konsolunu Başlatın:
```
geth attach ipc:node/geth.ipc
```
Başladıktan sonra, çalıştırın:
```
>eth.syncing
```

#### Geth Kayıtlarını Kontrol Etme
```
tail -f node/bsc.log