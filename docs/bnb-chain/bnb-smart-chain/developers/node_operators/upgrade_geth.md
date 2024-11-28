---
title: Geth Güncelleme - BSC Geliştir
description: Bu belge, Geth'in nasıl güncelleneceği hakkında adım adım bir rehber sunmaktadır. Güncelleme sürecinde dikkat edilmesi gereken önemli noktaları ve prosedürleri içermektedir.
keywords: [Geth, güncelleme, BSC, yazılım, Ethereum]
---

# Geth Nasıl Güncellenir

`geth`'yi güncellemek oldukça basittir. Tek yapmanız gereken `geth`'nin daha yeni bir sürümünü indirmek ve kurmak, düğümünüzü kapatmak ve yeni yazılımla yeniden başlatmaktır. Geth, otomatik olarak eski düğümünüzün verilerini kullanacak ve eski yazılımı kapattığınız zamandan beri çıkarılan en son blokları senkronize edecektir.

### Adım 1: Yeni Sürümü Derleyin veya yeni önceden derlenmiş ikili dosyaları indirin

```bash
git clone https://github.com/bnb-chain/bsc
# Klonlanan bsc klasörüne girin
cd bsc
# bsc'yi derleyin ve kurun
make geth
```

```bash
# Önceden derlenmiş ikili dosyaları indirin

# Linux
wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep geth_linux |cut -d\" -f4)
mv geth_linux geth
chmod -v u+x geth

# MacOS
wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep geth_mac |cut -d\" -f4)
mv geth_mac geth
chmod -v u+x geth
make geth
```

### Adım 2: Geth'i Durdurun

```bash
$ pid=`ps -ef | grep geth | grep -v grep | awk '{print $2}'`
$ kill  $pid
```

### Adım 3: Yeniden Başlat

:::note
Güncellemeden önce kullandığınız aynı başlatma komutunu kullandığınızdan emin olun. Bu durumda, `eğitim materyalimizde` kullandığımız aynı komutu kullanıyoruz.
:::

```bash
./geth --config ./config.toml --datadir ./node --cache 8000 --rpc.allow-unprotected-txs --history.transactions 0
```