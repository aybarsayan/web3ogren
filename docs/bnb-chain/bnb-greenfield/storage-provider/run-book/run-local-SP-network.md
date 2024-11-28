---
title: Yerel SP Ağı Kurma - BNB Greenfield SP
description: Bu kılavuz, test ve diğer geliştirme ile ilgili amaçlar için yerel bir Greenfield Depolama Sağlayıcı ağı kurmanıza yardımcı olur. Adım adım yönergelerle, gerekli ön koşullar, ağ kurulumu ve SP ile işlem yapma işlemlerini ayrıntılı bir şekilde sunmaktadır.
keywords: [Greenfield, SP Ağı, BNB, blockchain, depolama sağlayıcı, yerel ağ kurma]
---

Bu kılavuz, test ve diğer geliştirme ile ilgili amaçlar için yerel bir Greenfield Depolama Sağlayıcı ağı kurmanıza yardımcı olur.

- `Tavsiye Edilen Ön Koşullar`
- `Yerel Greenfield blok zinciri ağını hızlı bir şekilde kurun`
- `Yerel SP ağı kurun`
- `SP ile İşlem Yapın`
    - `1. Test hesabınızı oluşturun`
    - `2. Test hesabına bazı BNB tokenleri transfer edin`
    - `3. İstek göndermek için cmd'yi kullanın`

## Tavsiye Edilen Ön Koşullar

Aşağıdaki liste, tavsiye edilen donanım gereksinimlerini göstermektedir:

- Güncel versiyonlarda çalışan bir VPS, Mac OS X, Linux veya Windows；
- 16 çekirdek CPU, 64 GB bellek (RAM);
- Backend depolama için en az 100GB disk alanı;
- 10 GB+ SQL Veritabanı.

## Yerel Greenfield blok zinciri ağını hızlı bir şekilde kurun

1. Greenfield Blockchain'i inşa edin

:::note
Greenfield blok zinciri, `cgo` kullanan bir kütüphane kullanır, bu nedenle cgo ortam değişkenini ayarlamalısınız; ayrıca, işletim sisteminize `gcc` derleyicisini kurmalısınız.
:::

```shell
git clone https://github.com/bnb-chain/greenfield.git
cd greenfield/
export CGO_ENABLED=1
make build
```

Eğer greenfield blok zincirini derlerken aşağıdaki hata mesajlarıyla karşılaşırsanız, `glibc-static` ve `libstdc++-static` kurmalısınız.

```shell
# command-line-arguments
/usr/local/go/pkg/tool/linux_amd64/link: running gcc failed: exit status 1
/bin/ld: cannot find -lstdc++
collect2: error: ld returned 1 exit status

make: *** [build] Error 1
```

2. Greenfield Blockchain'i başlatın

```shell
# 1 doğrulayıcı ve 8 depolama sağlayıcısı
bash ./deployment/localup/localup.sh all 1 8
```

3. SP'lerin anahtarlarını dışa aktarın

```shell
bash ./deployment/localup/localup.sh export_sps 1 8

# sonuç örneği
# {
#   "sp0": {
#     "OperatorAddress": "0x14539343413EB47899B0935287ab1111Df891d04",
#     "FundingAddress": "0x21c6ff21DD7012DE1CCf9055f2eB234A44a1d3fB",
#     "SealAddress": "0x8e424c6Db42Ad9A5d91b24e20b5f603eC70abbA3",
#     "ApprovalAddress": "0x7Aa5C8B50696f1D15B3A60d6629f7318c605bb4C",
#     "GcAddress": "0xfa238a4B262e1dc35c4970A2296A2444B956c9Ca",
#     "MaintenanceAddress": "0xbE03316B1D7c3FCB69136e47e02442d6Fb3396dB",
#     "OperatorPrivateKey": "ba6e97958d9c43d1ad54923eba99f8d59f54a0c66c78a5dcbc004c5c3ec72f8c",
#     "FundingPrivateKey": "bd9d9e7823cd2dc7bc20f1b6676c3025cdda6cf5a8df9b04597fdff42c29af01",
#     "SealPrivateKey": "aacd6b834627fdbc5de2bfdb1db31be0ea810a941854787653814c8040a9dd39",
#     "ApprovalPrivateKey": "32108ed1a47c0af965824f84ac2162c029f347eec6d0988e642330b0ac264c85",
#     "GcPrivateKey": "2fad16031b4fd9facb7dacda3da4ca4dd5f005f4166891bf9f7be13e02abb12d",
#     "MaintenancePrivateKey": "cc38f4c004f73a810223776376a37a8ab3ed8204214f5a3a0a2f77f7bb5e2dc1",
#     "BlsPrivateKey": "6f349866f18413abb1a78cab947933459042044649686f354e941a646b9ed6e7"
#   }
#   ...
# }
```

> Bu JSON verileri, yerel SP ağı kurmak için kullanılacak, bu nedenle bunları bir json dosyası olarak kaydetmelisiniz:

```shell
bash ./deployment/localup/localup.sh export_sps 1 8 > sp.json
```

## Yerel SP ağı kurun

1. SP'yi derleyin

> SP'yi derlemek isteyen kullanıcılar bu `belgeye` başvurabilir.

2. Yerelup ortamını oluşturun

Aşağıdaki talimatları kullanarak yedi farklı dizinde şablon yapılandırma dosyası, sp.info ve db.info oluşturun. Bu komut, sp ortamını ilk kez oluşturmak veya yeniden oluşturmak için kullanılır.

```shell
# Bu komut dört argümanı kabul eder, birinci argüman yalnızca mutlak yol destekleyen json dosyası yolu, ikinci argüman db kullanıcı adı,
# üçüncü argüman db parolası ve dördüncü argüman db adresidir.
cd greenfield-storage-provider/
bash ./deployment/localup/localup.sh --generate json_file_path db_username db_password db_address
```

Birinci argüman için kabul edilen json dosyası yolu, `yerel greenfield blok zinciri ağını hızlı kurma adım 3` tarafından oluşturulmuştur.

Dizin yapısını görüntüleyin:

```shell
ls deployment/localup/local_env/sp0
├── sp0
│   ├── config.toml   # oluşturulan şablon yapılandırma dosyası
│   ├── db.info       # oluşturulan db.info, config.toml için kullanılır
│   ├── gnfd-sp0      # gnfd-sp ikili dosyası
│   └── sp.info       # oluşturulan sp.info, config.toml için kullanılır
├── sp1
├── ...
```

```shell
# Yerel sp ortamı oluşturma için bir örnek
cd greenfield-storage-provider/
bash ./deployment/localup/localup.sh --generate /root/sp.json root greenfield localhost:3306

[root@yourmachine sp0]# cat db.info
#!/usr/bin/env bash
USER="root"                     # veritabanı kullanıcı adı
PWD="greenfield"                # veritabanı parolası
ADDRESS="localhost:3306"        # db uç noktası, örneğin "localhost:3306"
DATABASE="sp_0"                 # veritabanı adı

[root@yourmachine sp0]# cat sp.info
#!/usr/bin/env bash
SP_ENDPOINT="127.0.0.1:9033"                                                              # geçit uç noktası, örneğin "127.0.0.1:9033"
OPERATOR_ADDRESS="0x14539343413EB47899B0935287ab1111Df891d04"                             # OperatorAddr, yerel Greenfield blok zinciri kurulum adım 3'te oluşturulmuştur.
OPERATOR_PRIVATE_KEY="ba6e97958d9c43d1ad54923eba99f8d59f54a0c66c78a5dcbc004c5c3ec72f8c"   # OperatorPrivKey, yerel Greenfield blok zinciri kurulum adım 3'te oluşturulmuştur.
FUNDING_PRIVATE_KEY="bd9d9e7823cd2dc7bc20f1b6676c3025cdda6cf5a8df9b04597fdff42c29af01"    # FundingPrivKey, yerel Greenfield blok zinciri kurulum adım 3'te oluşturulmuştur.
SEAL_PRIVATE_KEY="aacd6b834627fdbc5de2bfdb1db31be0ea810a941854787653814c8040a9dd39"       # SealPrivKey, yerel Greenfield blok zinciri kurulum adım 3'te oluşturulmuştur.
APPROVAL_PRIVATE_KEY="32108ed1a47c0af965824f84ac2162c029f347eec6d0988e642330b0ac264c85"   # ApprovalPrivKey, yerel Greenfield blok zinciri kurulum adım 3'te oluşturulmuştur.
GC_PRIVATE_KEY="2fad16031b4fd9facb7dacda3da4ca4dd5f005f4166891bf9f7be13e02abb12d"         # GcPrivateKey, yerel Greenfield blok zinciri kurulum adım 3'te oluşturulmuştur.
BLS_PRIVATE_KEY="6f349866f18413abb1a78cab947933459042044649686f354e941a646b9ed6e7"        # BlsPrivateKey, yerel Greenfield blok zinciri kurulum adım 3'te oluşturulmuştur.
```

4. Sekiz SP'yi başlatın

db.info, sp.info'ya göre config.toml'yi yapın ve sekiz SP'yi başlatın.

```shell
cd greenfield-storage-provider/
bash ./deployment/localup/localup.sh --reset
bash ./deployment/localup/localup.sh --start
```

Ortam dizini şu şekildedir:

```shell
deployment/localup/local_env/
├── sp0
│   ├── config.toml    # gerçek yapılandırma
│   ├── data/          # parça deposu veri dizini
│   ├── db.info
│   ├── gnfd-sp0
│   ├── gnfd-sp.log    # gnfd-sp günlük dosyası
│   ├── log.txt
│   └── sp.info
├── sp1
├── ...
```

:::tip
Eğer farklı sp dizinlerinde config.toml'yi değiştirmek ya da gnfd-sp ikili dosyasını yeniden derlemek istiyorsanız, yerel sp'yi sıfırlamak ve başlatmak için aşağıdaki komutları kullanabilirsiniz:

```shell
cd greenfield-storage-provider/
bash ./deployment/localup/localup.sh --reset
bash ./deployment/localup/localup.sh --start
```
:::

5. Desteklenen komutlar

```shell
# bu komut greenfield-storage-provider/ dizininde çalıştırılmalıdır.
bash ./deployment/localup/localup.sh --help

Kullanım: deployment/localup/localup.sh [seçenek...] {help|generate|reset|start|stop|print}

   --help            yardım bilgisini görüntüle
   --generate        sp.info ve db.info oluşturun, dört argümanı kabul eder: birinci argüman json dosyası yolu, ikinci argüman db kullanıcı adı, üçüncü argüman db parolası ve dördüncü argüman db adresidir
   --reset           ortamı sıfırlayın
   --start           depolama sağlayıcılarını başlatın
   --stop            depolama sağlayıcılarını durdurun
   --clean           yerel sp ortamını temizleyin
   --print           sp yerel ortam çalışma dizinini yazdır
```

## SP ile İşlem Yapın

Eğer yerel olarak Greenfield blok zincirini ve Greenfield SP'yi başarıyla başlattıysanız, SP ile CreateBucket, PutObject ve GetObject gibi işlemler yapmak için Greenfield Cmd'yi kullanabilirsiniz. Greenfield Cmd hakkında detaylı bilgi `burada` bulunabilir.

:::tip
Greenfield blok zinciri ve SP'nin işlevlerini keşfetmenize yardımcı olacak [Greenfield Cmd](https://github.com/bnb-chain/greenfield-cmd) okumayı şiddetle tavsiye ederiz.
:::

Şimdi, zincir ve SP ile işlem yapma konusunda adım adım bir kılavuz sunuyoruz.

### 1. Test hesabınızı oluşturun

Öncelikle bir test hesabı ve özel anahtar oluşturmalıyız:

```shell
cd greenfield/
# bu komut, adı testkey olan bir test hesabı oluşturacaktır, adını değiştirebilirsiniz
./build/bin/gnfd keys add testkey --keyring-backend os
# test hesabının özel anahtarını dışa aktarın
./build/bin/gnfd keys export testkey --unarmored-hex --unsafe --keyring-backend os
```

### 2. Test hesabına bazı BNB tokenleri transfer edin

Test hesabını oluşturduktan sonra, bu hesapta herhangi bir token yoktur. Bazı BNB tokenlerini transfer etmeliyiz:

```shell
cd greenfield/
# 5000 BNB token transfer edin
./gnfd tx bank send validator0 {generated_test_account_address} 500000000000000000000BNB --home /{your_greenfield_path}/greenfield/deployment/localup/.local/validator0 --keyring-backend test --node http://localhost:26750 -y
# hesap bakiyenizi sorgulayın
./gnfd q bank balances {generated_test_account_address} --node http://localhost:26750
```

### 3. İstek göndermek için cmd'yi kullanın

Eğer bu adıma geldiyseniz, tebrikler, kendi özel zinciriniz ve SP ile işlem yapabilirsiniz.

Öncelikle cmd'yi yapılandırmamız gerekiyor:

```shell
cd greenfield-cmd/
make build
cd build/
# özel anahtar bilgilerini yönetmek için bir anahtar dosyası oluşturun
touch key.txt & echo ${TEST_ACCOUNT_PRIVATE_KEY} > key.txt
touch password.txt & echo "test_sp_function" > password.txt
./gnfd-cmd --home ./  --passwordfile password.txt account import key.txt 

# config.toml'i oluşturun
touch config.toml
{
   echo rpcAddr = \"http://localhost:26750\"
   echo chainId = \"greenfield_9000-121\"
} > config.toml
```

İkinci olarak, SP ile bazı işlemler yapabilirsiniz:

1. Kova oluşturun

```shell
# mevcut SP'leri listele
./gnfd-cmd -c ./config.toml --home ./ sp ls
# rastgele bir SP seçip kova oluştur
./gnfd-cmd -c ./config.toml --home ./ bucket create gnfd://${BUCKET_NAME}
# kova bilgisini al
./gnfd-cmd -c ./config.toml --home ./ bucket head gnfd://${BUCKET_NAME}
# bir sp seçip kova oluştur, operator_address sp ls sonucunda gösterilecektir
./gnfd-cmd -c ./config.toml --home ./ bucket create --primarySP ${operator_address} gnfd://${BUCKET_NAME}
```

2. PutObject & GetObject

```shell
# 17MB rasgele bir dosya oluştur
dd if=/dev/urandom of=./random_file bs=17M count=1
# nesneyi yükle
./gnfd-cmd -c ./config.toml --home ./ object put --contentType "application/octet-stream" ./random_file gnfd://${BUCKET_NAME}/random_file
# nesneyi indir
./gnfd-cmd -c ./config.toml --home ./ object get gnfd://${BUCKET_NAME}/random_file ./new_random_file
```

Kullanıcılar, oluşturulan dosyanız ile indirilen dosyanın aynı olup olmadığını karşılaştırmak için md5 kullanabilir.

Greenfield Cmd'nin diğer işlevlerini keşfedebilirsiniz.