---
title: Tam Düğüm - BSC Geliştir
description: Bu doküman, BSC tam düğümünün nasıl kurulacağı ve çalıştırılacağı hakkında detaylı bilgiler sunmaktadır. Geth ve Reth istemcileri ile BSC ağında tam düğüm oluşturmak için izlenmesi gereken adımlar yer almaktadır.
keywords: [BSC, tam düğüm, Geth, Reth, blockchain, senkronizasyon, geliştirme]
---

## 1. Hakkında

Tam düğüm, diskte tam dünya durumunu saklar ve şunları yapabilme yeteneğine sahiptir:

* yeni işlemleri işleyebilir ve yeni bloklar üretebilir, bir doğrulayıcı düğümü olarak kullanılabilir.
* yeni alınan blokları yürütüp doğrulamak.
* her bir hesabın durumunu doğrulamak, çünkü tam dünya durumuna sahiptir.

Şu anda BSC tam olarak çalıştırmak için 3 farklı istemci bulunmaktadır:

* Geth: [https://github.com/bnb-chain/bsc](https://github.com/bnb-chain/bsc)
* Reth: [https://github.com/bnb-chain/reth](https://github.com/bnb-chain/reth)
* Erigon: [https://github.com/node-real/bsc-erigon](https://github.com/node-real/bsc-erigon)

Bu sayfada yalnızca Geth ve Reth ele alınacaktır, çünkü Erigon esasen arşiv modu desteklemekte, kullanımı için lütfen `archive_node.md` sayfasına başvurun.

:::tip
Yüksek performans istiyorsanız ve durum tutarlılığına çok önem vermiyorsanız, `--tries-verify-mode none` bayrağı ile ayarlanmış bir tam düğüm olan hızlı bir düğüm çalıştırabilirsiniz.
Bir hızlı düğüm çalıştırmaya dair tüm ayrıntılar için `buraya` göz atın.
```
    ./geth --config ./config.toml --datadir <datadir>  --cache 8000 --tries-verify-mode none
```
## 2. BSC Tam Düğüm Çalıştırma: Geth

### 2.1. Desteklenen Platformlar

Tam düğüm çalıştırmayı **Mac OS X**, **Linux** ve **Windows** üzerinde destekliyoruz.

### 2.2. Adımlar

Sıfırdan bir BSC tam düğümü kurmak için 2 yaklaşım vardır:

- Anlık görüntü ile (Tavsiye Edilen): en son anlık görüntüyü indirin ve buna göre senkronize olun.
- Genesis'ten (Tavsiye Edilmez): tüm BSC zincirini genesis bloktan senkronize edin.

:::tip
Nov-2024 itibarıyla BSC ana ağındaki en son blok yüksekliği 40M'yi aşmıştır, bu nedenle daha güçlü bir donanım gerekecek ve genesis'ten senkronize almak oldukça zaman alacaktır, bu yüzden bir BSC tam düğümünü anlık görüntüye dayalı olarak kurmanız önerilir.
:::

#### a. Anlık Görüntü ile

1. En son sürüm sayfasından önceden derlenmiş ikili dosyaları indirin veya aşağıdaki talimatları izleyin
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

2. Konfigürasyon dosyalarını indirin

   **genesis.json** ve **config.toml** dosyalarını indirin:
   ```bash
   # ana ağ
   wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep mainnet |cut -d\" -f4)
   unzip mainnet.zip
   
   # test ağı
   wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep testnet |cut -d\" -f4)
   unzip testnet.zip
   ```

3. Anlık görüntüyü indirin
   En son zincir verileri anlık görüntüsünü [buradan](https://github.com/bnb-chain/bsc-snapshots) indirin. Dosyalarınızı düzenlemek için kılavuzu izleyin.

4. Tam düğümü başlatın
   ```
   ## lütfen <datadir> değerini yerel datadir yolunuz ile değiştirin.
   ./geth --config ./config.toml --datadir <datadir>  --cache 8000
   ```

5. Düğüm durumunu izleyin

   Varsayılan olarak **.//bsc.log** dosyasından günlüğü izleyebilirsiniz. Düğümünüz senkronize olmaya başladığında, aşağıdaki çıktıyı görebilirsiniz:
   ```
   t=2022-09-08T13:00:27+0000 lvl=info msg="Imported new chain segment"             blocks=1    txs=177   mgas=17.317   elapsed=31.131ms    mgasps=556.259  number=21,153,429 hash=0x42e6b54ba7106387f0650defc62c9ace3160b427702dab7bd1c5abb83a32d8db dirty="0.00 B"
   t=2022-09-08T13:00:29+0000 lvl=info msg="Imported new chain segment"             blocks=1    txs=251   mgas=39.638   elapsed=68.827ms    mgasps=575.900  number=21,153,430 hash=0xa3397b273b31b013e43487689782f20c03f47525b4cd4107c1715af45a88796e dirty="0.00 B"
   t=2022-09-08T13:00:33+0000 lvl=info msg="Imported new chain segment"             blocks=1    txs=197   mgas=19.364   elapsed=34.663ms    mgasps=558.632  number=21,153,431 hash=0x0c7872b698f28cb5c36a8a3e1e315b1d31bda6109b15467a9735a12380e2ad14 dirty="0.00 B"
   ```

#### b. Genesis'ten

```bash
## bir komut ile genesis'ten bir tam düğümü başlat
## lütfen <datadir> değerini yerel datadir yolunuz ile değiştirin.
./geth --config ./config.toml --datadir <datadir>  --cache 8000
```

### 2.3. Senkronizasyon Modu

Tam bir düğüm çalıştırmak için iki senkronizasyon modu vardır: **snap** ve **full**. Bu modlar **--syncmode** bayrağı ile belirtilebilir.

**snap** senkronizasyon modu, en son durumları indirmek için kullanılır, genesis'ten blokları yürütmek yerine. İlk senkronizasyon tamamlandığında, otomatik olarak tam senkronizasyona geçecektir.

**full** senkronizasyon modu, ilk senkronizasyon için de kullanılabilir, ancak Genesis'ten itibaren tüm blokları yürütür. Ancak, bu **tavsiye edilmez**, çünkü tarihsel verilerin miktarı çok büyüktür. Bunun yerine, [resmi depodan](https://github.com/bnb-chain/bsc-snapshots) bir anlık görüntü indirebilir ve anlık görüntüden tam senkronize olmaya başlayabilirsiniz.

**--syncmode** bayrağı verilmezse, varsayılan senkronizasyon modu veri klasörünün durumuna bağlı olacaktır. Eğer genesis'ten senkronize alıyorsanız **snap** modunda, eğer bir anlık görüntüden başlıyorsanız **full** modunda olacaktır.

### 2.4. Diğerleri

#### a. Greenfield Eşleri

**full** senkronizasyon modu seçmek, düğümünüzün diğer ağ eşlerinden yalnızca blok başlıklarına ve gövdelere ihtiyaç duyması anlamına gelir. Bu süreci hızlandırmak için `Greenfield Peer` kullanmayı düşünün.

Bu veri kaynağı, Greenfield tarafından sağlanır ve daha verimli bir senkronizasyon sağlar. BSC düğümünüzü Greenfield Light Peer ile bağlantı kuracak şekilde yapılandırın, yapılandırma dosyası ayarlarını değiştirerek. 

:::info
Detaylı talimatlar için `Light Peer` sayfasına bakın.
:::

#### b. Yerel Özel Ağ

Yerel bir özel ağ kurmak için lütfen [BSC-Deploy Araçları](https://github.com/bnb-chain/node-deploy) sayfasına başvurun.

#### c. Düğüm Bakımı

Lütfen `bu kılavuzu` okuyun.

#### d. Geth'i Güncelle

Lütfen `bu kılavuzu` okuyun.

## 3. BSC Tam Düğüm Çalıştırma: Reth

BSC Reth, Paradigm ile işbirliği içinde geliştirilen en son nesil bir Rust istemcisidir ve BNB Akıllı Zincir (BSC) için sorunsuz destek sağlamayı hedeflemektedir. BNB Zincirindeki istemci çeşitliliğini artırmak amacıyla güvenli ve verimli bir yürütme istemcisi sunmayı geliştirmektedir.

### 3.1. Donanım Gereksinimleri

BSC Reth'i etkili bir şekilde çalıştırmak için sisteminizin aşağıdaki donanım gereksinimlerini karşılaması gerekmektedir:

* 16+ çekirdekli CPU
* 128GB RAM
* Tam düğüm için en az 4TB boş alan ve arşiv düğümü için 8TB boş alan bulunan yüksek performanslı NVMe SSD
* 25 MB/s yükleme/indirme hızına sahip geniş bant internet bağlantısı

### 3.2. BSC Reth Çalıştırma

1. Kaynak kodunu indirin ve ikili dosyayı oluşturun.
   ```shell
   git clone https://github.com/bnb-chain/reth.git
   cd reth
   make build-bsc
   ```

2. Reth düğümünü başlatın, varsayılan olarak arşiv modunda çalışacaktır. Bir tam düğüm başlatmak için `--full` bayrağını ekleyebilirsiniz.
   ```shell
   # ana ağ için
   export network=bsc
   
   # test ağı için
   # export network=bsc-testnet
   
   ./target/release/bsc-reth node \
       --datadir=./datadir \
       --chain=${network} \
       --http \
       --http.api="eth, net, txpool, web3, rpc" \
       --log.file.directory ./datadir/logs
   ```

3. İsteğe bağlı olarak, Reth düğümünü Docker ile çalıştırabilirsiniz.
   ```shell
   # ana ağ için
   export network=bsc
   
   # test ağı için
   # export network=bsc-testnet
   
   # docker görüntüsü sürümünü kontrol etmek için buraya bakın: https://github.com/bnb-chain/reth/pkgs/container/bsc-reth
   export version=latest
   
   # Reth verilerinin depolanacağı dizin
   export data_dir=/xxx/xxx
   
   docker run -d -p 8545:8545 -p 30303:30303 -p 30303:30303/udp -v ${data_dir}:/data \
       --name bsc-reth ghcr.io/bnb-chain/bsc-reth:${version} node \
       --datadir=/data \
       --chain=${network} \
       --http \
       --http.api="eth, net, txpool, web3, rpc" \
       --log.file.directory /data/logs
   ```

### 3.3. Anlık Görüntü

Sıfırdan bir BSC Reth düğümünü mevcut blok yüksekliğine senkronize etmek zaman alıcı bir süreç olabilir. BSC ana ağı için bir arşiv düğümü 30 gün ve bir tam düğüm için 24 gün kadar sürmesi gerekebilir.

BNB Zinciri ekibi, BSC ağının aşamalı senkronizasyonu için bölümlü bir anlık görüntü indirme çözümü geliştirmektedir ve bu çözümün yakın zamanda piyasaya sürülmesi planlanmaktadır. 

Şu anda, süreci hızlandırmak isteyen geliştiriciler, [topluluk tarafından yönetilen depolardan](https://github.com/fuzzland/snapshots) arşiv düğümü anlık görüntülerini edinebilirler. Bu anlık görüntüler, genesis'ten senkronize olmaktan daha hızlı bir alternatif sunarak düğüm kurulumunu ve ağ katılımını hızlandırmaktadır.