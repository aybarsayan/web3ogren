---
title: Hızlı Düğüm - BSC Geliştir
description: Bu belge, BNB Akıllı Zincirinde Hızlı Düğüm'ün nasıl kurulacağını ve çalıştırılacağını açıklar. Hızlı düğüm, verileri etkin bir şekilde yönetmekte kritik bir rol oynar.
keywords: [Hızlı Düğüm, BNB Akıllı Zincir, blockchain, Geth, düğüm kurulumu, chaindata, P2P]
---

# BNB Akıllı Zincirinde Hızlı Düğüm

## Not
**Hızlı Düğüm senkronizasyon sırasında Trie Verisi oluşturmaz.  
Hızlı Düğüm çalışmaya başladıktan sonra, Full Düğüm'e geri dönme şansı yoktur.  
Full Düğüm'e geri yüklemek için anlık görüntü verilerini yeniden indirmek gerekir.**

---

## Hızlı Düğüm Fonksiyonları

* Tam blockchain tarihini diskte saklar ve ağdan gelen veri taleplerine yanıt verebilir.
* Yeni blokları ve işlemleri alır ve doğrular.
* Her bir hesabın durumunu doğrular.

---

## Hızlı Düğüm Çalıştırmak için Adımlar

### [sürümler sayfasından](https://github.com/bnb-chain/bsc/releases/latest) önceden derlenmiş ikili dosyaları indirin veya aşağıdaki talimatları izleyin:

```bash
# Linux
wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep geth_linux |cut -d\" -f4)
mv geth_linux geth
chmod -v u+x geth

# MacOS
wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep geth_mac |cut -d\" -f4)
mv geth_mac geth
chmod -v u+x geth
```

:::tip
Her sistem için doğru ikili dosyayı indirdiğinizden emin olun.
:::

### Config dosyalarını indirin

**genesis.json** ve **config.toml** dosyalarını indirin:

```bash
wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep mainnet |cut -d\" -f4)
unzip mainnet.zip
```

### Anlık Görüntü İndirin

En son chaindata anlık görüntüsünü [buradan](https://github.com/bnb-chain/bsc-snapshots) indirin. Dosyalarınızı yapılandırmak için kılavuzu izleyin.

:::note
--datadir bayrağınız çıkarılmış chaindata klasörü yolunu göstermelidir
:::

### Tüm trie verilerini temizleyin

Hızlı düğüm artık trie verilerine ihtiyaç duymuyor, trie verilerini aşağıdaki komutla temizleyin.
```
./geth snapshot insecure-prune-all --datadir ./node  ./genesis.json
```

### Anlık Görüntü Doğrulaması Olmadan Hızlı Düğümü Başlatın

Düğüm doğrulayarak anlık görüntü doğrulaması olmadan Hızlı Düğüm'ü başlatabilirsiniz.

```bash
## hızlı düğümü başlat
./geth --tries-verify-mode none --config ./config.toml --datadir ./node  --cache 8000 --rpc.allow-unprotected-txs --history.transactions 0
```

> **Not:** Anlık görüntü doğrulaması olmadan başlatma, hız ve performans açısından avantaj sağlar.  
> — BSC Geliştirici Ekibi

Veya Anlık Görüntü Doğrulaması ile Hızlı Düğüm'ü Başlatın

1. config.toml'de verifyNodes eşleri ekleyin.

```
[Node.P2P]
MaxPeers = 1350
NoDiscovery = false
BootstrapNodes = ["enode://...", "enode://...", ...]
VerifyNodes = ["enode://...", "enode://...", ...]
StaticNodes = ["enode://...", "enode://...", ...]
ListenAddr = ":30311"
EnableMsgEvents = false
```

2. Düğüm doğrulayarak anlık görüntü doğrulaması ile hızlı düğümünüzü başlatın.

```bash
## hızlı düğümü başlat
./geth --tries-verify-mode full --config ./config.toml --datadir ./node  --cache 8000 --rpc.allow-unprotected-txs --history.transactions 0
```

:::warning
Veri doğrulaması yapmadan düğüm başlatmak, ağ güvenliğini azaltabilir. Bu nedenle, doğru yapılandırmaların yapıldığından emin olun.
:::