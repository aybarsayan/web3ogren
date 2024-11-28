---
title: BSC Validator'ı Çalıştır - BNB Akıllı Zinciri
description: Bu belge, BSC validator'ının kurulumu ve yapılandırılması hakkında kapsamlı bir rehber sunmaktadır. Hem mainnet hem de testnet için gerekli donanım gereksinimleri, düğüm kurulum süreci ve en iyi uygulamalar detaylandırılmaktadır.
keywords: [BSC, validator, BNB Akıllı Zincir, donanım gereksinimleri, düğüm kurulumu, oylama hesabı, yedek düğüm]
---

# BSC Validator'ı Çalıştır

## Validator Donanım Gereksinimleri

### Mainnet

- Örnek Özelliği: AWS üzerinde r7a.4xlarge örnek türü önerilir.
- Bellek: 64 GB
- Disk: **ÖNEMLİ** 4T GB, katı hal sürücüsü (SSD), gp3, 8k IOPS, 500 MB/s veri aktarım hızı, okuma gecikmesi  10 Gbps

### Testnet

- CPU: "AMD Gen 3 veya daha yenisi" veya "Intel Ice Lake veya daha yenisi"
- Bellek: 16 GB
- Disk: 1.5 TB, katı hal sürücüsü (SSD), gp3, 8k IOPS, 250 MB/s veri aktarım hızı.
- Ağ Bant Genişliği: > 2.5 Gbps

---

## Validator Düğümünü Kurma

### 1. BSC Fullnode'u Kur

Bir full node kurmak için `buradaki talimatları izleyin`.

### 2. Hesapları Hazırlama

İki hesap, bir validator çalıştırmadan önce hazırlanmalıdır: Konsensüs hesabı ve BLS Oylama hesabı. **Bu hesapların yeni bir validator oluşturulurken karşılık gelenlerle eşleştiğinden emin olun.**

#### Konsensüs Adresini Oluştur

Yeni bir madencilik konsensüs hesabı oluşturmak için bu komutu çalıştırın ve hesap için bir şifre belirleyin:

```shell
geth account new --datadir ${DATA_DIR}
```

-  `DATA_DIR`: Anahtar depolama dosyalarınızın kaydedildiği yer.

Eğer zaten bir konsensüs hesabınız varsa, bu adımı atlayın. Şifreyi password.txt adında bir dosyaya kaydedin:

```shell
echo {konsensüs hesabı için şifreniz} > password.txt
```

#### BLS Oylama Adresini Oluştur

Yeni bir BLS hesabı kurmak için bu komutu kullanın:

```shell
geth bls account new --datadir ${DATA_DIR}
```

-  `DATA_DIR`: Anahtar depolama dosyalarınızı saklamak için dizin.

Eğer zaten bir BLS oylama anahtarınız varsa, bir BLS cüzdanı oluşturabilir ve onu anahtar dosyası ile geri yükleyebilirsiniz:

```shell
geth bls account import ${KEY_FILE} --datadir ${DATA_DIR}
```

BLS adresinizi almak için çalıştırın:

```shell
geth bls account list --datadir ${DATA_DIR}
```

Şifreyi blspassword.txt adında bir dosyaya kaydedin:

```shell
echo {BLS cüzdanı için şifreniz} > blspassword.txt
```

### 3. Validator Düğümünü Başlat

:::warning
Lütfen RPC uç noktalarınızı halka açık ağa açmayın!
:::

Validator'nızı aşağıdaki komut satırını kullanarak başlatın:

```bash
geth --config ./config.toml --datadir ./node --syncmode snap -unlock {tx imzalamak için hesaplar, en azından madencilik hesabınızı içermelidir} --miner.etherbase {madencilik hesabınızın adresi} --password password.txt --blspassword blspassword.txt --mine --vote --allow-insecure-unlock --cache 18000
```

---

## Çalıştırma Sonrası

### 1. Düğüm durumunu izleme

Hızlı bir başlangıç için, GethExporter'ı bir Docker konteynerinde çalıştırın.

```
docker run -it -d -p 9090:9090 \
  -e "GETH=http://mygethserverhere.com:8545" \
  hunterlong/gethexporter
```

![](https://grafana.com/api/dashboards/6976/images/4471/image)

### 2. Validator profilini güncelle

Bilgilerinizi güncellemek için bu depoya bir PullRequest gönderebilirsiniz: 

Referans: 

### 3. Validator Bilgilerini Yayınla

Bu repoya bir Pull Request gönderebilirsiniz 

Bu depo, validator adaylarının potansiyel delegeçilere ekipleri ve altyapıları hakkında kısa bir tanıtım sunmaları ve ekosistem katkılarını sergilemeleri için bir yerdir.

### 4. Doğrulamayı Durdur

Yeni blok madenciliğini durdurmak için **geth konsolu** üzerinden komutlar gönderebilirsiniz.

Validator düğümünüze **geth attach ipc:path/to/geth.ipc** ile bağlanın.

```bash
miner.stop()
```

Doğrulamayı yeniden başlatmak için,
```bash
miner.start()
```

---

## Bazı İpuçları & Araçlar

### 1. Yedek düğüm çalıştırma

Yedek düğüm, ana validator düğümünüz çeşitli potansiyel nedenlerden dolayı sorunlarla karşılaştığında yardım edebilir ve ağdaki katılımınızın sürekliliğini ve güvenilirliğini sağlar.

### 2. Düğümünüzün stabilitesini kontrol edin

BSC deposunda her validatorın slash durumunu dökme için bir javascript bulunmaktadır.

```
cd <bsc>/cmd/jsutils
# 1. Son bloğun slasherını dökmek için:
node getslashcount.js --Rpc https://bsc-mainnet.nodereal.io/v1/454e504917db4f82b756bd0cf6317dce

# 2. Ayrıca blok numarasını belirtebilirsiniz:
node getslashcount.js --Rpc https://bsc-mainnet.nodereal.io/v1/454e504917db4f82b756bd0cf6317dce --Num 39938351
```

> **Anahtar Not:** Validator'ınız sorunsuz çalışıyorsa, günlük olarak minimal veya hiç ceza almayı beklemelisiniz. Genel olarak, eğer validator'ınız tek bir günde üçten fazla slash alırsa, bu anomaliyi araştırmak iyi olur.

### 3. Bakım moduyla ilgili

Validator'ınız 50 slash alırsa, otomatik olarak bakım moduna geçecektir. Düğümünüzdeki sorunları zamanında teşhis edip gidermek önemlidir; aksi takdirde, düğümünüz daha kısıtlayıcı bir duruma geçebilir, bu duruma genellikle "hapsetme" denir.

Düğümünüzün işlevselliğini başarılı bir şekilde geri kazandıktan sonra, normal operasyonları yeniden başlatmak ve gereksiz duraklama veya cezaları önlemek için [bakım modundan çıkmanız](https://github.com/bnb-chain/bsc/blob/master/docs/parlia/README-BEP-127.md#exit-maintenance) önemlidir.
```
```
// not: "0x75B851a27D7101438F45fce31816501193239A83" değerini validator'ınızın konsensüs adresi ile değiştirin.
geth attach geth.ipc
web3.eth.sendTransaction({   from: "0x75B851a27D7101438F45fce31816501193239A83",   to: "0x0000000000000000000000000000000000001000",   data: "0x04c4fec6"})
```

### 4. Peerlere regex kalıbıyla filtreleme

Bu işlev, [1.4.6](https://github.com/bnb-chain/bsc/releases/tag/v1.4.6) sürümü ile tanıtılmıştır ve işlevsellikleri sorunlu olabilecek peerlere uygun bir şekilde kimlik belirlemeyi ve bunları hariç tutmayı amaçlamaktadır, böylece onlarla bağlantı kurulmasını önler. Daha fazla bilgi için lütfen bu Pull Request'i inceleyin: [PR#2404](https://github.com/bnb-chain/bsc/pull/2404).

Genel olarak, bu özelliğin normal işletim için gerekli değildir. Ancak, bir sürüm kritik hatalar içeriyorsa ve tüm düğümlerin hemen stabil bir sürüme yükseltmesi mümkün değilse, bu özellik problemler içeren sürümlere sahip peerlere bağlantıyı kesmek için kullanılabilir. Bu, kapsamlı bir güncelleme yapılana kadar bu hataların etkisini azaltmak için geçici bir çözüm sağlar.

Örneğin, v1.4.9'da bilinen sorunlar varsa, bu sürümün düğümlerinden bağlantıyı kesmek istiyorsanız, `config.toml` dosyanızı güncelleyebilir ve yeniden başlatabilirsiniz:
```
[Node.P2P]
PeerFilterPatterns = ["Geth/v1.4.9.*"]
```