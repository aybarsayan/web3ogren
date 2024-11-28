---
title: Yerel Node Çalıştırma - opBNB
description: Bu kılavuz, opBNB üzerine bir uygulama geliştirmek isteyenler için yerel Testnet veya Mainnet node kurulumunu açıklamaktadır. Kendi node'unuzu çalıştırmak veya kamuya açık RPC'leri kullanmak için gerekli adımlar ve gereksinimler belirtilmiştir.
keywords: [opBNB, node çalıştırma, Testnet, Mainnet, Docker, senkronizasyon, yazılım geliştirme]
---

# Yerel Testnet veya Mainnet Node Çalıştırma

opBNB üzerinde bir uygulama geliştirmek istiyorsanız, bir opBNB node'una erişiminiz olmalıdır. 
Kamuya açık rpc'yi (Testnet: , Mainnet: ) kullanabilir veya kendi node'unuzu çalıştırabilirsiniz. 

Bu kılavuz, kendi Testnet/Mainnet node'unuzu kurmanıza yardımcı olacaktır.

## Donanım Gereksinimleri

Replika'lar, opBNB'nin işlem geçmişini depolamalı ve Geth'i çalıştırmalıdır. Optimal performans için, en az 16 GB RAM ve 500 GB boş alanı olan bir SSD diske sahip güçlü makineler (gerçek veya sanal) olmalıdır (üretim ağı için).

### Hızlı Node

Normal rpc node'unu hata ayıklama işlevleri olmadan çalıştırmak isteyen kullanıcılar için, daha hızlı senkronizasyon hızı ve daha az donanım gereksinimi olan **hızlı node**'u çalıştırabilirsiniz. 

Hızlı node, MPT durumlarına sahip değildir ve yalnızca en son durumu senkronize etmek için anlık görüntüyü kullanır. Güvenliği tam node kadar iyi değildir, ancak çoğu kullanıcı için yeterlidir ve birçok üretim nodunda doğrulanmıştır. Hızlı node'un avantajı, MPT durumlarını hesaplaması ve MPT ağaçlarını depolayıp sorgulamasına gerek kalmadan daha hızlı senkronize olmasıdır. 

:::tip
Hızlı node'u `--allow-insecure-no-tries` bayrağı ile başlatabilirsiniz. Hızlı node ile başlatıyorsanız gc modu `archive` olmamalıdır.
:::

Daha fazla bilgi için, [hızlı node pr](https://github.com/bnb-chain/op-geth/pull/75) sayfasına başvurabilirsiniz.

## Docker ile Çalıştırma

opBNB node'u için resmi Docker görüntüleri mevcuttur. Aşağıdaki bağlantılardan bu görüntülerin en son sürümlerini kullanabilirsiniz:
- [op-node](https://github.com/bnb-chain/opbnb/pkgs/container/op-node)
- [op-geth](https://github.com/bnb-chain/op-geth/pkgs/container/op-geth)

Ayrıca, Docker ile opBNB node'unu çalıştırmak için bu [depo](https://github.com/bnb-chain/opbnb-node-docker) içinde bir docker-compose dosyası örneği bulabilirsiniz. Bu, Testnet/Mainnet node'unu hızlıca kurmanızı sağlar, dakikalar içinde. 
Farklı altyapı sağlayıcıları kullanıyorsanız, lütfen docker-compose dosyasını gözden geçirin ve yapılandırmayı gerektiği gibi ayarlayın.

---

## Binaries ile Çalıştırma

### op-node ve op-geth'i Oluşturma

#### Bağımlılıklar
- golang 1.20+
- make
- git
- gcc
- libc-dev

Alpine Linux için Docker dosyalarına bakabilirsiniz: [op-node](https://github.com/bnb-chain/opbnb/blob/develop/op-node/Dockerfile) ve [op-geth](https://github.com/bnb-chain/op-geth/blob/develop/Dockerfile).
Farklı bir OS kullanıyorsanız, lütfen OS'unuz için alternatif paketleri bulun.

```bash
export OPBNB_WORKSPACE=/tmp/opbnb
mkdir -p $OPBNB_WORKSPACE

cd $OPBNB_WORKSPACE
git clone https://github.com/bnb-chain/opbnb.git
cd opbnb/op-node
git checkout develop
make op-node
mkdir -p $OPBNB_WORKSPACE/op-node-data
cp ./bin/op-node $OPBNB_WORKSPACE/op-node-data

cd $OPBNB_WORKSPACE
git clone https://github.com/bnb-chain/op-geth.git
cd op-geth
git checkout develop
make geth
mkdir -p $OPBNB_WORKSPACE/op-geth-data
cp ./build/bin/geth $OPBNB_WORKSPACE/op-geth-data/op-geth
```

### Veri Hazırlığı

```bash
cd $OPBNB_WORKSPACE
# testnet için
cp $OPBNB_WORKSPACE/opbnb/assets/testnet/genesis.json $OPBNB_WORKSPACE/op-geth-data
# mainnet için
# cp $OPBNB_WORKSPACE/opbnb/assets/mainnet/genesis.json $OPBNB_WORKSPACE/op-geth-data

openssl rand -hex 32 > jwt.txt
cp jwt.txt $OPBNB_WORKSPACE/op-geth-data
cp jwt.txt $OPBNB_WORKSPACE/op-node-data

# op-geth genesis'ini başlat
cd $OPBNB_WORKSPACE/op-geth-data
mkdir datadir
./op-geth --datadir ./datadir init genesis.json
```

### Bileşenleri Başlat

**op-geth**

```bash
#! /usr/bin/bash
cd $OPBNB_WORKSPACE/op-geth-data

# testnet için
export CHAIN_ID=5611
export L2_RPC=https://opbnb-testnet-rpc.bnbchain.org
export P2P_BOOTNODES="enr:-KO4QKFOBDW--pF4pFwv3Al_jiLOITj_Y5mr1Ajyy2yxHpFtNcBfkZEkvWUxAKXQjWALZEFxYHooU88JClyzA00e8YeGAYtBOOZig2V0aMfGhE0ZYGqAgmlkgnY0gmlwhDREiqaJc2VjcDI1NmsxoQM8pC_6wwTr5N2Q-yXQ1KGKsgz9i9EPLk8Ata65pUyYG4RzbmFwwIN0Y3CCdl-DdWRwgnZf,enr:-KO4QFJc0KR09ye818GT2kyN9y6BAGjhz77sYimxn85jJf2hOrNqg4X0b0EsS-_ssdkzVpavqh6oMX7W5Y81xMRuEayGAYtBSiK9g2V0aMfGhE0ZYGqAgmlkgnY0gmlwhANzx96Jc2VjcDI1NmsxoQPwA1XHfWGd4umIt7j3Fc7hKq_35izIWT_9yiN_tX8lR4RzbmFwwIN0Y3CCdl-DdWRwgnZf"

# mainnet için
# export CHAIN_ID=204
# export L2_RPC=https://opbnb-mainnet-rpc.bnbchain.org
# export P2P_BOOTNODES="enr:-KO4QHs5qh_kPFcjMgqkuN9dbxXT4C5Cjad4SAheaUxveCbJQ3XdeMMDHeHilHyqisyYQAByfdhzyKAdUp2SvyzWeBqGAYvRDf80g2V0aMfGhHFtSjqAgmlkgnY0gmlwhDaykUmJc2VjcDI1NmsxoQJUevTL3hJwj21IT2GC6VaNqVQEsJFPtNtO-ld5QTNCfIRzbmFwwIN0Y3CCdl-DdWRwgnZf,enr:-KO4QKIByq-YMjs6IL2YCNZEmlo3dKWNOy4B6sdqE3gjOrXeKdNbwZZGK_JzT1epqCFs3mujjg2vO1lrZLzLy4Rl7PyGAYvRA8bEg2V0aMfGhHFtSjqAgmlkgnY0gmlwhDbjSM6Jc2VjcDI1NmsxoQNQhJ5pqCPnTbK92gEc2F98y-u1OgZVAI1Msx-UiHezY4RzbmFwwIN0Y3CCdl-DdWRwgnZf"

./op-geth \
  --datadir="./datadir" \
  --verbosity=3 \
  --http \
  --http.corsdomain="*" \
  --http.vhosts="*" \
  --http.addr=0.0.0.0 \
  --http.port=8545 \
  --http.api=net,eth,engine \
  --ws \
  --ws.addr=0.0.0.0 \
  --ws.port=8545 \
  --ws.origins="*" \
  --ws.api=eth,engine \
  --syncmode=full \
  --maxpeers=10 \
  --networkid=$CHAIN_ID \
  --miner.gaslimit=150000000 \
  --triesInMemory=32 \
  --txpool.globalslots=10000 \
  --txpool.globalqueue=5000 \
  --txpool.accountqueue=200 \
  --txpool.accountslots=200 \
  --cache 32000 \
  --cache.preimages \
  --allow-insecure-unlock \
  --authrpc.addr="0.0.0.0" \
  --authrpc.port="8551" \
  --authrpc.vhosts="*" \
  --authrpc.jwtsecret=./jwt.txt \
  --gcmode=archive \
  --metrics \
  --metrics.port 6060 \
  --metrics.addr 0.0.0.0 \
  --rollup.sequencerhttp=$L2_RPC \
  --bootnodes=$P2P_BOOTNODES
```

op-geth, `--state.scheme path` ve `--db.engine pebble` bayraklarını ekleyerek `PBSS (Path-Base Scheme Storage) ve PebbleDB` ile çalışır. **Bu modda yeni bir node başlatmanız önerilir, bu daha iyi performans ve daha az disk alanı kullanımına olanak tanır.**

Hızlı node olarak çalışır durumda bir op-geth node'u başlatmak için `--allow-insecure-no-tries` bayrağını ekleyebilirsiniz. Ancak `gcmode` `full` olmalıdır.

**op-node**

```bash
#! /usr/bin/bash

set -ex

cd op-node-data

export L2_RPC=http://localhost:8551
# p2p özel anahtarınızı kendi anahtarınız ile değiştirin
# yeni bir tane `openssl rand -hex 32` ile üretebilirsiniz
export P2P_PRIV_KEY=ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff

# testnet için
# kararlılık için L1_RPC'yi kendi BSC Testnet RPC Uç Noktanız ile değiştirmek daha iyidir
export L1_RPC=https://bsc-testnet.bnbchain.org
export P2P_BOOTNODES="enr:-J24QGQBeMsXOaCCaLWtNFSfb2Gv50DjGOKToH2HUTAIn9yXImowlRoMDNuPNhSBZNQGCCE8eAl5O3dsONuuQp5Qix2GAYjB7KHSgmlkgnY0gmlwhDREiqaHb3BzdGFja4PrKwCJc2VjcDI1NmsxoQL4I9wpEVDcUb8bLWu6V8iPoN5w8E8q-GrS5WUCygYUQ4N0Y3CCIyuDdWRwgiMr,enr:-J24QJKXHEkIhy0tmIk2EscMZ2aRrivNsZf_YhgIU51g4ZKHWY0BxW6VedRJ1jxmneW9v7JjldPOPpLkaNSo6cXGFxqGAYpK96oCgmlkgnY0gmlwhANzx96Hb3BzdGFja4PrKwCJc2VjcDI1NmsxoQMOCzUFffz04eyDrmkbaSCrMEvLvn5O4RZaZ5k1GV4wa4N0Y3CCIyuDdWRwgiMr"

# mainnet için
# export L1_RPC=https://bsc-dataseed.bnbchain.org
# export P2P_BOOTNODES="enr:-J24QA9sgVxbZ0KoJ7-1gx_szfc7Oexzz7xL2iHS7VMHGj2QQaLc_IQZmFthywENgJWXbApj7tw7BiouKDOZD4noWEWGAYppffmvgmlkgnY0gmlwhDbjSM6Hb3BzdGFja4PMAQCJ2VjcDI1NmsxoQKetGQX7sXd4u8hZr6uayTZgHRDvGm36YaryqZkgnidS4N0Y3CCIyuDdWRwgiMs,enr:-J24QPSZMaGw3NhO6Ll25cawknKcOFLPjUnpy72HCkwqaHBKaaR9ylr-ejx20INZ69BLLj334aEqjNHKJeWhiAdVcn-GAYv28FmZgmlkgnY0gmlwhDTDWQOHb3BzdGFja4PMAQCJ2VjcDI1NmsxoQJ-_5GZKjs7jaB4TILdgC8EwnwyL3Qip89wmjnyjvDDwoN0Y3CCIyuDdWRwgiMs"

./op-node \
  --l1.trustrpc \
  --sequencer.l1-confs=15 \
  --verifier.l1-confs=15 \
  --l1.http-poll-interval 3s \
  --l1.epoch-poll-interval 45s \
  --l1.rpc-max-batch-size 20 \
  --rollup.config=./rollup.json \
  --rpc.addr=0.0.0.0 \
  --rpc.port=8546 \
  --p2p.sync.req-resp \
  --p2p.listen.ip=0.0.0.0 \
  --p2p.listen.tcp=9003 \
  --p2p.listen.udp=9003 \
  --snapshotlog.file=./snapshot.log \
  --p2p.bootnodes=$P2P_BOOTNODES \
  --metrics.enabled \
  --metrics.addr=0.0.0.0 \
  --metrics.port=7300 \
  --pprof.enabled \
  --rpc.enable-admin \
  --l1=${L1_RPC} \
  --l2=${L2_RPC} \
  --l2.jwt-secret=./jwt.txt \
  --l2.engine-sync=true \
  --l2.skip-sync-start-check=true \  
  --log.level=debug
```

## Anlık Görüntüler ile Çalıştırma

Node'un senkronizasyon hızını artırmak için anlık görüntüleri kullanarak başlatabilirsiniz. 

En son anlık görüntü, [opbnb-snapshot](https://github.com/bnb-chain/opbnb-snapshot) deposunda tutulmaktadır. 
Lütfen indirme bağlantıları ve kullanım talimatları için bu depoyu ziyaret edin.

## Durumu Kontrol Etme

Node'un senkronize olmasını bekleyin. Herhangi bir yeni blok olduğunda `op-geth` içinde bir log göreceksiniz.

```
INFO [11-15|10:10:05.569] Syncing beacon headers                   downloaded=1,762,304 left=11,403,991 eta=27m1.039s
INFO [11-15|10:10:06.440] Forkchoice requested sync to new head    number=13,164,499 hash=d78cb3..a2e94d finalized=unknown
```

Blok numarasını curl ile kontrol edebilirsiniz:

```
$ curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545
```

Tüm başlıklar indirildikten sonra, node blokları indirmeye başlayacaktır. Blok yüksekliğinin arttığını fark edeceksiniz.

```
{"jsonrpc":"2.0","id":1,"result":"0x1a"}
```

Node'un en son yüksekliğe senkronize olup olmadığını doğrulamak için, blok numarasını kamu uç noktalarından istenen blok ile karşılaştırabilirsiniz.

```bash
# yerel
$ curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","id": 1, "params": ["0x1a", false]}' http://localhost:8545

# testnet
$ curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","id": 1, "params": ["0x1a", false]}' https://opbnb-testnet-rpc.bnbchain.org

# mainnet
$ curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","id": 1, "params": ["0x1a", false]}' https://opbnb-mainnet-rpc.bnbchain.org
```

## Sorun Giderme

Karşılaştığınız sorun burada ele alınmamışsa, lütfen şu bağlantıyı ziyaret ederek GitHub'da bir sorun açın: [bir sorun aç](https://github.com/bnb-chain/opbnb/issues).

### Uzun Süredir Senkronize Olmama

Varsayılan senkronizasyon mekanizması iki P2P ağı içerir: op-node ağı ve op-geth ağı. 
Eğer op-node ağına bağlı değilseniz, yayın yoluyla en son blokları alamazsınız ve op-geth'nin motor senkronizasyonunu tetikleyemezsiniz. 
Eğer op-geth ağına bağlı değilseniz, yayın yoluyla en son blokları alabilirsiniz, ancak op-geth P2P ağına bağlı olarak tarihi blokları elde edemezsiniz.

**op-geth log'larını kontrol edin.**

Aşağıdaki logları bulabiliyorsanız, bu op-node ağının başarıyla bağlandığı ve yayın yoluyla en son blokları aldığınız anlamına gelir.

```
INFO [11-15|10:32:02.801] Forkchoice requested sync to new head    number=8,290,596 hash=1dbff3..9a306a finalized=unknown
```

Aşağıdaki logları bulabiliyorsanız, bu op-geth ağının başarıyla bağlandığı ve op-geth P2P ağından tarihsel blok başlıklarını aldığınız anlamına gelir.

```
INFO [11-15|10:32:52.240] Syncing beacon headers                   downloaded=210,432 left=8,084,773 eta=31m39.748s
```

Aşağıdaki komut ile op-node p2p ağını kontrol edin:

```
$ curl -X POST -H "Content-Type: application/json" --data \
    '{"method":"opp2p_peers","params":[true],"id":1,"jsonrpc":"2.0"}'  \
    http://localhost:8546
```

Aşağıdaki komut ile op-geth p2p ağını kontrol edin. Bu API'yi kullanmak için op-geth'de admin API'sinin etkinleştirilmesi gerekmektedir. 
Daha fazla ayrıntı için  adresine başvurun.

```
$ curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' http://localhost:8545 | jq .
```

### Yerel Node'un Zinciri Kanonik Zincirden Farklılaştı

Yerel node'unuz halihazırda çalışıyorsa ve blokları takip ediyorsa, aşağıdaki durumlar yerel node'unuzun zincirinin kanonik zincirden farklılaştığını gösterebilir:
1. `eth_getBlockByNumber` yöntemi aracılığıyla elde edilen aynı yükseklikteki blok hash'i, kamu node'undan dönen veri ile eşleşmiyor.
2. Yerel zinciriniz sürekli olarak sabit bir blok sayısı kadar geride kalıyor ve en son blok yüksekliğine yetişemiyor.

Bu durumda, yürütülen node'un kod sürümünü şu adımları takip ederek kontrol etmenizi öneririz:
```bash
$ op-node -v
op-node version v0.0.0-515ebd51-1698742099

$ op-geth version
Geth
Version: 0.1.0-unstable
Git Commit: f8871fc80dbf2aa0178b504e76c20c21b890c6d5
Git Commit Date: 20231026
Upstream Version: 1.11.5-stable
Architecture: arm64
Go Version: go1.20.2
Operating System: darwin
GOPATH=
```
Lütfen en son kod sürümünü kullandığınızdan emin olun. Kod sürümü yanlışsa, lütfen node verilerini tamamen silin ve yeni node'u bu kılavuza göre tekrar çalıştırın.

Ayrıca `genesis.json` ve `rollup.json` dosyalarının güncel olup olmadığını kontrol etmeniz gerekir.

En son kodda, rollup.json yapılandırmasını sabitledik. `--rollup.config=./rollup.json` kullanmak yerine sadece `--network=opBNBTestnet` (mainnet ağı için opBNBMainnet) kullanmanız yeterlidir. Bu değişiklik, rollup.json'ın içeriğinin yanlış olmasını sağlamaz.

### Node Bloğu Takılı Kalır ve op-geth Log'u: Database compacting, degraded performance database=/data/geth/chaindata Yazıyor

Eğer node'unuz aniden takılı kalır ve büyümezse ve op-geth log'unuz sürekli olarak: Database compacting, degraded performance database=/data/geth/chaindata yazıyorsa,
o zaman makine spesifikasyonlarını yükseltmeyi düşünmelisiniz; CPU, bellek ve disk maksimum verimliliği artırmalısınız.

Bu, mevcut OP Stack'in yalnızca Geth'in arşiv modunu desteklemesinden kaynaklanmaktadır ve disk alanı kullanımı zamanla artar. Geth'in dayanıklılık gösterdiği Leveldb, sıkıştırma işlemini tamamlamak için daha fazla makine kaynağı gerektirir.
Tam mod Geth'i desteklemek ve PBSS ile Pebble desteği ile bu problemi tamamen çözmek için çalışıyoruz.

Eğer makinenizin spesifikasyonlarını yükseltmek istemiyorsanız, [opbnb-snapshot](https://github.com/bnb-chain/opbnb-snapshot) deposundan kesilmiş anlık görüntüyü indirmeyi seçebilirsiniz ve bunu yeni bir node başlatmak için kullanabilirsiniz. 
Yeni node bu sorunla karşılaşmayacak, ancak belirli bir blok yüksekliğinden önceki tüm durum verilerini kaybedecektir.

Eğer ileri düzey bir kullanıcısıysanız, node'larınızda çevrimdışı kesme işlemini denemeyi de düşünebilirsiniz (Not: bu, tehlikeli bir işlemdir ve kesme işleminden sonra hedef blok yüksekliğinden önceki blokların durum verileri artık mevcut olmayacaktır). 
Bu adımları takip edebilirsiniz:
1. Makinenizi kapatın ve op-geth'nin şu logu yazdığından emin olun: "Blockchain stopped".
2. Node kapatılmadan önce en son eklenen blokun blok yüksekliğini onaylamak için loglarda "Chain head was updated" anahtar kelimesini arayın. Açıklama açısından, diyelim ki blok yüksekliği 16667495.
3. 16667495'in zincir üzerinde son durum haline gelmesini bekleyin, yeniden düzenleme olmadığından emin olun. Bu blok yüksekliğini sorgulamak için blockchain explorer'a (https://opbnbscan.com/) gidebilirsiniz,
ve blok yüksekliği hash'ini loglardaki hash ile karşılaştırabilirsiniz. Hash'ler eşleşirse ve uzun bir zaman geçmişse, bu blok yüksekliğinin yeniden düzenlenmeyeceğini düşünüyoruz.
4. Bu blok yüksekliğinin durum kökünü JSON-RPC ile alın.
5. Kesme işlemini gerçekleştirmek için aşağıdaki komutu kullanın: `geth snapshot prune-state --datadir {yourDataDir} --triesInMemory=32 {targetBlockStateRootHash}`,
gerekli değerleri {yourDataDir} ve {targetBlockStateRootHash} ile değiştirdiğinizden emin olun.
6. Sabırlı olun ve logları izleyin. Tüm süreç onlarca saat sürebilir.
7. Kesme işlemi tamamlandıktan sonra node'unuzu yeniden başlatın.

:::info
Kesme işlemi çok tehlikeli olabilir ve node'un verilerine zarar verebilir. Bu, yeni node'u yeniden çalıştırmak zorunda kalmanıza yol açabilir. Lütfen yalnızca sürece aşina iseniz bu işlemi gerçekleştirin.
:::