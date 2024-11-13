---
sidebar_position: 2
---

# Subnet CLI

 Camino Alt Ağları'nı yönetmek için bir komut satırı arayüzüdür.

## Kurulum

### Kaynak

```bash
git clone https://github.com/chain4travel/camino-subnet-cli.git
cd camino-subnet-cli;
go install -v .;
```

`subnet-cli` kurulduktan sonra, çalıştığını doğrulamak için `subnet-cli` komutunu çalıştırın (_$GOBIN'inin $PATH'inizde bulunduğundan emin olun_):

### Ön Tanımlı İkili Dosyalar

Şu anda `subnet-cli` için ön tanımlı ikili dosyalar mevcut değildir.

## Kullanım

```bash
> subnet-cli
subnet-cli CLI

Kullanım:
subnet-cli [komut]

Mevcut Komutlar:
  add         Kaynak yaratma için alt komutlar
  completion  Belirtilen shell için otomatik tamamlama betiğini oluştur
  create      Kaynak yaratma için alt komutlar
  help        Herhangi bir komut hakkında yardım
  status      durum komutları
  wizard      Tüm bir subnet oluşturan sihirli bir komut

Bayraklar:
      --enable-prompt              'true' prompt modunu etkinleştirir (varsayılan true)
  -h, --help                       subnet-cli hakkında yardım
      --log-level string           log seviyesi (varsayılan "info")
      --poll-interval duration     tx/blok zinciri durumunu sorgulama aralığı (varsayılan 1s)
      --request-timeout duration   istek zaman aşımı (varsayılan 2m0s)

Bir komut hakkında daha fazla bilgi için "subnet-cli [komut] --help" kullanın.
```

Bu **AYNI** bilgisayarda çalıştırılmasına gerek yoktur, validator'ünüzü çalıştırdığınız yer.

### Ağ Seçimi

Bir `subnet-cli` komutu bir API uç noktasını çağırdığında, `--public-uri` uç noktanın nerede olduğunu belirtmek için kullanılır.

Bu noktada `subnet-cli` yalnızca yerel uç nokta ile test edilmiştir: `http://127.0.0.1:9650`

### `subnet-cli create VMID`

Bu komut, bir VM'yi benzersiz bir şekilde tanımlamak için bazı dizgiler temelinde geçerli bir VMID oluşturmak için kullanılır. Bu, VM'nin tüm sürümleri için aynı kalmalıdır, bu nedenle bir kod parçasının hash'inden ziyade bir kelimeye dayanmalıdır.

```bash
subnet-cli create VMID  [--hash]
```

Örnek

```bash
> subnet-cli create VMID timestampvm
timestampvm'den yeni bir VMID tGas3T58KzdjcJ2iKSyiYsWiqYctRXaPTqBCA11BqEkNg8kPc oluşturuldu
```

### `subnet-cli create key`

```bash
> subnet-cli create key
".subnet-cli.pk" isimli yeni bir anahtar oluşturuldu
```

Bu, mevcut dizinde özel bir anahtar ile `.subnet-cli.pk` isimli bir dosya oluşturur. Varsayılan olarak, `subnet-cli` işlem ücretini ödemek için P-Chain'de `.subnet-cli.pk` dosyasıyla belirtilen anahtarı kullanır, `--private-key-path` kullanılırsa bu üzerine yazılabilir. Lütfen bu P-Chain adresinde yeterli fonunuzun bulunduğundan emin olun.

#### Yerel

Yerel düğümde, fonlar X-Chain'den P-Chain'e aşağıdaki API çağrılarıyla transfer edilebilir:

- `avm.export`
- `platform.importAVAX`

### `subnet-cli wizard`

`wizard` sihirli bir komuttur:

- Tüm NodeID'lerini ana ağa (zaten mevcut olanları atlayarak) validator olarak ekler
- Bir Subnet oluşturur
- Tüm NodeID'lerini Subnet üzerinde validator olarak ekler
- Yeni bir blok zinciri oluşturur

Fuji Testnet'te bir Subnet oluşturmak için bir komut şu şekildedir:

```bash
> subnet-cli wizard \
  --public-uri=http://127.0.0.1:9650 \
  --private-key-path=.subnet-cli.pk \
  --chain-name="TSwizz" \
  --validate-end="2023-05-10T09:34:23+02:00" \
  --vm-genesis-path="./timestampvm-genesis.json" \
  --node-ids="NodeID-Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD" \
  --vm-id="tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH"
```

Ve konsolda tam basılmış günlük:

```text
2022-07-14T09:44:33.236+0200	info	client/client.go:81	X-Chain kimliği alınıyor
2022-07-14T09:44:33.243+0200	info	client/client.go:87	X-Chain kimliği alındı	{"id": "pgk8Re3MCEbQu62orC1ebw7YKzpX1Yk4iS7vTxZReAm9Pjp6m"}
2022-07-14T09:44:33.243+0200	info	client/client.go:96	CAM varlık kimliği alınıyor	{"uri": "http://127.0.0.1:9650"}
2022-07-14T09:44:33.245+0200	info	client/client.go:105	CAM varlık kimliği alındı	{"id": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW"}
2022-07-14T09:44:33.245+0200	info	client/client.go:107	ağ bilgileri alınıyor
2022-07-14T09:44:33.245+0200	info	client/client.go:116	ağ bilgileri alındı	{"networkId": 1001, "networkName": "columbus"}

Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD zaten 11111111111111111111111111111111LpoYY'de bir validator.

Wizard'ı yürütmeye hazırız, devam etmemiz gerekiyor mu?
*--------------------------*---------------------------------------------------*
| ANA P-CHAIN ADRESİ      | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk |
*--------------------------*---------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ  | 4,749.8053750 $CAM                                |
*--------------------------*---------------------------------------------------*
| TX ÜCRETİ               | 0.201 $CAM                                        |
*--------------------------*---------------------------------------------------*
| HER BAHİS MİKTARI       | 1.000 $CAM                                        |
*--------------------------*---------------------------------------------------*
| GEREKEN BAKİYE          | 1.201 $CAM                                        |
*--------------------------*---------------------------------------------------*
| URI                     | http://127.0.0.1:9650                             |
*--------------------------*---------------------------------------------------*
| AĞ ADI                 | columbus                                          |
*--------------------------*---------------------------------------------------*
| YENİ SUBNET VALIDATORLARI| [Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD]               |
*--------------------------*---------------------------------------------------*
| SUBNET DOĞRULAMA AĞIRLIĞI | 1,000                                             |
*--------------------------*---------------------------------------------------*
| ZİNCİR ADI             | TSwizz                                            |
*--------------------------*---------------------------------------------------*
| VM ID                  | tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH |
*--------------------------*---------------------------------------------------*
| VM İKİZİ YOLU          | ./timestampvm-genesis.json                        |
*--------------------------*---------------------------------------------------*
✔ Evet, oluşturalım! Ücreti ödemeye razıyım!


2022-07-14T09:44:54.138+0200	info	client/p.go:131	subnet oluşturuluyor	{"dryMode": false, "assetId": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW", "createSubnetTxFee": 100000000}
2022-07-14T09:44:54.178+0200	info	platformvm/checker.go:74	subnet sorgulanıyor	{"subnetId": "MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9"}
2022-07-14T09:44:54.179+0200	info	platformvm/checker.go:48	P-Chain tx'si sorgulanıyor	{"txId": "MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9", "expectedStatus": "Committed"}
2022-07-14T09:44:54.179+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-14T09:44:55.182+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "1.002398061s"}
2022-07-14T09:44:55.182+0200	info	platformvm/checker.go:88	subnetler bulunuyor	{"subnetId": "MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9"}
2022-07-14T09:44:55.182+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-14T09:44:55.182+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "450.058µs"}
"MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9" subnet'i oluşturuldu (1.002848119s sürdü)



Artık düğümünüzde bazı yapılandırma değişikliklerine geçelim.
`--whitelisted-subnets=MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9` ayarını yapın ve derlenmiş VM `tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH`'yi `/plugins/tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH` konumuna taşıyın.
İşiniz bittiğinde, düğümünüzü yeniden başlatın.
✔ Evet, devam edelim! `--whitelisted-subnets`'i güncelledim, VM'mi inşa ettim ve düğüm(ler)imi yeniden başlattım!


2022-07-14T09:48:26.168+0200	info	client/p.go:299	subnet validator ekleniyor	{"subnetId": "MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9", "txFee": 1000000, "start": "2022-07-14T09:48:56.162+0200", "end": "2023-03-16T01:00:00.000+0100", "weight": 1000}
2022-07-14T09:48:26.193+0200	info	platformvm/checker.go:48	P-Chain tx'si sorgulanıyor	{"txId": "2a6ZRwNAEZN7t3wAQU9eASSUDsSM7x7BPM75vN84vPf3hWDuzo", "expectedStatus": "Committed"}
2022-07-14T09:48:26.193+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-14T09:48:27.193+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "1.000624494s"}
Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD, MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9 subnet'ine validator setine eklendi (1.000624494s sürdü)

Validator Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD'nin MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9 subnet'ini doğrulamasını bekliyoruz...(birkaç dakika alabilir)


2022-07-14T09:48:57.199+0200	info	client/p.go:497	blok zinciri oluşturuluyor	{"subnetId": "MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9", "chainName": "TSwizz", "vmId": "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH", "createBlockchainTxFee": 100000000}
"2BYk5xByKdsumDavgrY2VdNkc7ichKTyTpBUSKCwBbFh321SQB" isimli blok zinciri oluşturuldu (2.575819ms sürdü)

*-------------------------*----------------------------------------------------*
| ANA P-CHAIN ADRESİ      | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk  |
*-------------------------*----------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ  | 4,749.7043750 $CAM                                 |
*-------------------------*----------------------------------------------------*
| URI                     | http://127.0.0.1:9650                              |
*-------------------------*----------------------------------------------------*
| AĞ ADI                 | columbus                                           |
*-------------------------*----------------------------------------------------*
| SUBNET VALIDATORLARI   | [Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD]                |
*-------------------------*----------------------------------------------------*
| SUBNET ID               | MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9  |
*-------------------------*----------------------------------------------------*
| BLOK ZİNCİRİ ID         | 2BYk5xByKdsumDavgrY2VdNkc7ichKTyTpBUSKCwBbFh321SQB |
*-------------------------*----------------------------------------------------*
| ZİNCİR ADI             | TSwizz                                             |
*-------------------------*----------------------------------------------------*
| VM ID                   | tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH  |
*-------------------------*----------------------------------------------------*
| VM İKİZİ YOLU          | ./timestampvm-genesis.json                         |
*-------------------------*----------------------------------------------------*
```

Aşağıdakiler başarıyla oluşturuldu:

- Subnet: MZE36w4FFMpWu7hoJjHmf8bAJcx2uvFK3oKSciobQrrSPAtx9
- Blok Zinciri: 2BYk5xByKdsumDavgrY2VdNkc7ichKTyTpBUSKCwBbFh321SQB

### `subnet-cli create subnet`

```bash
subnet-cli create subnet
```

Yerel ağda bir Subnet oluşturmak için:

```bash
subnet-cli create subnet \
--private-key-path=.subnet-cli.pk \
--public-uri=http://127.0.0.1:9650
```

Ve konsol günlüğü:

```text
2022-07-18T11:05:38.630+0200	info	client/client.go:81	X-Chain kimliği alınıyor
2022-07-18T11:05:38.636+0200	info	client/client.go:87	X-Chain kimliği alındı	{"id": "pgk8Re3MCEbQu62orC1ebw7YKzpX1Yk4iS7vTxZReAm9Pjp6m"}
2022-07-18T11:05:38.636+0200	info	client/client.go:96	CAM varlık kimliği alınıyor	{"uri": "http://127.0.0.1:9650"}
2022-07-18T11:05:38.636+0200	info	client/client.go:105	CAM varlık kimliği alındı	{"id": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW"}
2022-07-18T11:05:38.636+0200	info	client/client.go:107	ağ bilgileri alınıyor
2022-07-18T11:05:38.637+0200	info	client/client.go:116	ağ bilgileri alındı	{"networkId": 1001, "networkName": "columbus"}
2022-07-18T11:05:38.666+0200	info	client/p.go:131	subnet oluşturuluyor	{"dryMode": true, "assetId": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW", "createSubnetTxFee": 100000000}

Subnet kaynaklarını oluşturmak için hazırız, devam etmemiz gerekiyor mu?
*-------------------------*----------------------------------------------------*
| ANA P-CHAIN ADRESİ      | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk  |
*-------------------------*----------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ  | 2,499.9990000 $CAM                                 |
*-------------------------*----------------------------------------------------*
| TX ÜCRETİ               | 0.100 $CAM                                         |
*-------------------------*----------------------------------------------------*
| URI                     | http://127.0.0.1:9650                              |
*-------------------------*----------------------------------------------------*
| AĞ ADI                 | columbus                                           |
*-------------------------*----------------------------------------------------*
| BEKLENEN SUBNET ID      | 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx |
*-------------------------*----------------------------------------------------*
✔ Evet, oluşturalım! Ücreti ödemeye razıyım!



2022-07-18T11:05:43.432+0200	info	client/p.go:131	subnet oluşturuluyor	{"dryMode": false, "assetId": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW", "createSubnetTxFee": 100000000}
2022-07-18T11:05:43.435+0200	info	platformvm/checker.go:74	subnet sorgulanıyor	{"subnetId": "2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx"}
2022-07-18T11:05:43.436+0200	info	platformvm/checker.go:48	P-Chain tx'si sorgulanıyor	{"txId": "2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx", "expectedStatus": "Committed"}
2022-07-18T11:05:43.436+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-18T11:05:44.437+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "1.001827607s"}
2022-07-18T11:05:44.438+0200	info	platformvm/checker.go:88	subnetler bulunuyor	{"subnetId": "2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx"}
2022-07-18T11:05:44.438+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-18T11:05:44.438+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "480.827µs"}
"2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx" subnet'i oluşturuldu (1.002308434s sürdü)
(subnet, önce --whitelisted-subnets bayrağı ile beyaz listeye alınmalıdır!)

*-------------------------*----------------------------------------------------*
| ANA P-CHAIN ADRESİ      | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk  |
*-------------------------*----------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ  | 2,499.8990000 $CAM                                 |
*-------------------------*----------------------------------------------------*
| URI                     | http://127.0.0.1:9650                              |
*-------------------------*----------------------------------------------------*
| AĞ ADI                 | columbus                                           |
*-------------------------*----------------------------------------------------*
| OLUŞTURULAN SUBNET ID   | 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx |
*-------------------------*----------------------------------------------------*
```

### `subnet-cli add validator`

```bash
subnet-cli add validator \
--node-ids="[YOUR-NODE-ID]" \
--stake-amount=[STAKE-AMOUNT-IN-NANO-CAM] \
--validate-reward-fee-percent=2
```

Yerel ağa bir validator eklemek için:

```bash
subnet-cli add validator \
--public-uri=http://localhost:9650 \
--node-ids="NodeID-Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD" \
--stake-amount=100000000000 \
--validate-reward-fee-percent=3
```

```text
2022-07-18T11:00:52.315+0200	info	client/client.go:81	X-Chain kimliği alınıyor
2022-07-18T11:00:52.322+0200	info	client/client.go:87	X-Chain kimliği alındı	{"id": "pgk8Re3MCEbQu62orC1ebw7YKzpX1Yk4iS7vTxZReAm9Pjp6m"}
2022-07-18T11:00:52.322+0200	info	client/client.go:96	CAM varlık kimliği alınıyor	{"uri": "http://localhost:9650"}
2022-07-18T11:00:52.322+0200	info	client/client.go:105	CAM varlık kimliği alındı	{"id": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW"}
2022-07-18T11:00:52.322+0200	info	client/client.go:107	ağ bilgileri alınıyor
2022-07-18T11:00:52.323+0200	info	client/client.go:116	ağ bilgileri alındı	{"networkId": 1001, "networkName": "columbus"}

Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD zaten 11111111111111111111111111111111LpoYY'de bir validator.
Ana ağda eklenmesi gereken validator yok.

### `subnet-cli add subnet-validator`

```bash
subnet-cli add subnet-validator \
--node-ids="[NODE-ID'NIZI BURAYA YAZIN]" \
--subnet-id="[ALT-AĞ ID'Yİ BURAYA YAZIN]"
```

Yerel ağa bir Alt Ağ doğrulayıcısı eklemek için:

```text
> subnet-cli add subnet-validator \
--public-uri=http://127.0.0.1:9650 \
--node-ids="NodeID-Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD" \
--subnet-id="2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx"
```

Ve konsol günlük kaydı:

```text
2022-07-18T11:15:20.843+0200	info	client/client.go:81	X-Chain id alınıyor
2022-07-18T11:15:20.854+0200	info	client/client.go:87	X-Chain id alındı	{"id": "pgk8Re3MCEbQu62orC1ebw7YKzpX1Yk4iS7vTxZReAm9Pjp6m"}
2022-07-18T11:15:20.854+0200	info	client/client.go:96	CAM varlık id'si alınıyor	{"uri": "http://127.0.0.1:9650"}
2022-07-18T11:15:20.855+0200	info	client/client.go:105	CAM varlık id'si alındı	{"id": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW"}
2022-07-18T11:15:20.855+0200	info	client/client.go:107	Ağ bilgileri alınıyor
2022-07-18T11:15:20.856+0200	info	client/client.go:116	Ağ bilgileri alındı	{"networkId": 1001, "networkName": "columbus"}

Alt Ağ doğrulayıcısını eklemeye hazır, devam edelim mi?
*-------------------------*----------------------------------------------------*
| TEMEL P-CHAIN ADRESİ   | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk  |
*-------------------------*----------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ | 2,499.8990000 $CAM                                 |
*-------------------------*----------------------------------------------------*
| TX ÜCRETİ              | 0.001 $CAM                                         |
*-------------------------*----------------------------------------------------*
| GEREKEN BAKİYE         | 0.001 $CAM                                         |
*-------------------------*----------------------------------------------------*
| URI                     | http://127.0.0.1:9650                              |
*-------------------------*----------------------------------------------------*
| AĞ ADI                 | columbus                                           |
*-------------------------*----------------------------------------------------*
| Düğüm ID'leri          | [Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD]                |
*-------------------------*----------------------------------------------------*
| ALT AĞ ID              | 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx |
*-------------------------*----------------------------------------------------*
| DOĞRULAMA AĞIRLIĞI     | 1,000                                              |
*-------------------------*----------------------------------------------------*
✔ Evet, oluşturalım! Ücreti ödemeyi kabul ediyorum!

2022-07-18T11:15:24.619+0200	info	client/p.go:299	alt ağ doğrulayıcısı ekleniyor	{"subnetId": "2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx", "txFee": 1000000, "start": "2022-07-18T11:15:54.618+0200", "end": "2023-03-16T01:00:00.000+0100", "weight": 1000}
2022-07-18T11:15:24.650+0200	info	platformvm/checker.go:48	P-Chain tx sorgulanıyor	{"txId": "22QGLfQh9o3baW56nr96pGPF977sXgkLYV15wp7j87YwTE1YdN", "expectedStatus": "Committed"}
2022-07-18T11:15:24.650+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-18T11:15:25.652+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "1.001411893s"}
Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD, alt ağ 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx doğrulayıcı setine eklendi (zaman aldı: 1.001411893s)

Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD doğrulama yapmaya başlamasını bekliyor 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx...(bazı dakikalar alabilir)*-------------------------*----------------------------------------------------*
| TEMEL P-CHAIN ADRESİ   | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk  |
*-------------------------*----------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ | 2,499.8980000 $CAM                                 |
*-------------------------*----------------------------------------------------*
| URI                     | http://127.0.0.1:9650                              |
*-------------------------*----------------------------------------------------*
| AĞ ADI                 | columbus                                           |
*-------------------------*----------------------------------------------------*
| Düğüm ID'leri          | [Nj5C7NdpS3p8hZvu6b5HBREKi8hA1qbDD]                |
*-------------------------*----------------------------------------------------*
| ALT AĞ ID              | 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx |
*-------------------------*----------------------------------------------------*
| DOĞRULAMA BAŞLANGIÇI   | 2022-07-18T11:15:54+02:00                          |
*-------------------------*----------------------------------------------------*
| DOĞRULAMA BİTİŞİ       | 2023-03-16T01:00:00+01:00                          |
*-------------------------*----------------------------------------------------*
| DOĞRULAMA AĞIRLIĞI     | 1,000                                              |
*-------------------------*----------------------------------------------------*
```

### `subnet-cli create blockchain`

```bash
subnet-cli create blockchain \
--subnet-id="[ALT-AĞ ID'Yİ BURAYA YAZIN]" \
--chain-name="[ZİNCİR ADI'NI BURAYA YAZIN]" \
--vm-id="[VM ID'Yİ BURAYA YAZIN]" \
--vm-genesis-path="[VM GENESİS YOLUNU BURAYA YAZIN]"
```

Yerel kümeyle bir blok zinciri oluşturmak için:

```bash
subnet-cli create blockchain \
--public-uri=http://127.0.0.1:9650 \
--subnet-id="2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx" \
--chain-name="TSnet" \
--vm-id="tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH" \
--vm-genesis-path=./timestampvm-genesis.json
```

```text
2022-07-18T11:23:05.153+0200	info	client/client.go:81	X-Chain id alınıyor
2022-07-18T11:23:05.158+0200	info	client/client.go:87	X-Chain id alındı	{"id": "pgk8Re3MCEbQu62orC1ebw7YKzpX1Yk4iS7vTxZReAm9Pjp6m"}
2022-07-18T11:23:05.158+0200	info	client/client.go:96	CAM varlık id'si alınıyor	{"uri": "http://127.0.0.1:9650"}
2022-07-18T11:23:05.159+0200	info	client/client.go:105	CAM varlık id'si alındı	{"id": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW"}
2022-07-18T11:23:05.159+0200	info	client/client.go:107	Ağ bilgileri alınıyor
2022-07-18T11:23:05.159+0200	info	client/client.go:116	Ağ bilgileri alındı	{"networkId": 1001, "networkName": "columbus"}

Blok zinciri kaynaklarını oluşturmaya hazır, devam edelim mi?
*-------------------------*----------------------------------------------------*
| TEMEL P-CHAIN ADRESİ   | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk  |
*-------------------------*----------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ | 2,499.8980000 $CAM                                 |
*-------------------------*----------------------------------------------------*
| TX ÜCRETİ              | 0.100 $CAM                                         |
*-------------------------*----------------------------------------------------*
| GEREKEN BAKİYE         | 0.100 $CAM                                         |
*-------------------------*----------------------------------------------------*
| URI                     | http://127.0.0.1:9650                              |
*-------------------------*----------------------------------------------------*
| AĞ ADI                 | columbus                                           |
*-------------------------*----------------------------------------------------*
| ALT AĞ ID              | 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx |
*-------------------------*----------------------------------------------------*
| ZİNCİR ADI             | TSnet                                              |
*-------------------------*----------------------------------------------------*
| VM ID                   | tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH  |
*-------------------------*----------------------------------------------------*
| VM GENESIS YOLU        | ./timestampvm-genesis.json                         |
*-------------------------*----------------------------------------------------*
✔ Evet, oluşturalım! Ücreti ödemeyi kabul ediyorum!

2022-07-18T11:23:07.183+0200	info	client/p.go:497	blok zinciri oluşturuluyor	{"subnetId": "2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx", "chainName": "TSnet", "vmId": "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH", "createBlockchainTxFee": 100000000}
"rcXq53fMgf9f34iWXvQcka2VDSegdL3Knz7wMTNG5mxRboqFF" (zaman aldı: 3.205701ms) id'sine sahip blok zinciri oluşturuldu.

*-------------------------*----------------------------------------------------*
| TEMEL P-CHAIN ADRESİ   | P-columbus17pysyr6av4n2gf6teqv3kjd5ewdkmncwrhq6qk  |
*-------------------------*----------------------------------------------------*
| TOPLAM P-CHAIN BAKİYESİ | 2,499.8980000 $CAM                                 |
*-------------------------*----------------------------------------------------*
| URI                     | http://127.0.0.1:9650                              |
*-------------------------*----------------------------------------------------*
| AĞ ADI                 | columbus                                           |
*-------------------------*----------------------------------------------------*
| ALT AĞ ID              | 2dwibTuU3YxvTe7Lc5X4PsmCeC5JiBr1PGJVpCm8T1nec7zUSx |
*-------------------------*----------------------------------------------------*
| OLUŞTURULAN BLOK ZİNCİRİ ID'Sİ | rcXq53fMgf9f34iWXvQcka2VDSegdL3Knz7wMTNG5mxRboqFF  |
*-------------------------*----------------------------------------------------*
| ZİNCİR ADI             | TSnet                                              |
*-------------------------*----------------------------------------------------*
| VM ID                   | tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH  |
*-------------------------*----------------------------------------------------*
| VM GENESIS YOLU        | ./timestampvm-genesis.json                         |
*-------------------------*----------------------------------------------------*
```

### `subnet-cli status blockchain`

`rcXq53fMgf9f34iWXvQcka2VDSegdL3Knz7wMTNG5mxRboqFF` blok zincirinin durumunu **özel URI** üzerinden kontrol etmek için:

```bash
subnet-cli status blockchain \
--private-uri=http://127.0.0.1:9650  \
--blockchain-id="rcXq53fMgf9f34iWXvQcka2VDSegdL3Knz7wMTNG5mxRboqFF" \
--check-bootstrapped

2022-07-18T11:28:22.347+0200	info	client/client.go:81	X-Chain id alınıyor
2022-07-18T11:28:22.351+0200	info	client/client.go:87	X-Chain id alındı	{"id": "pgk8Re3MCEbQu62orC1ebw7YKzpX1Yk4iS7vTxZReAm9Pjp6m"}
2022-07-18T11:28:22.351+0200	info	client/client.go:96	CAM varlık id'si alınıyor	{"uri": "http://127.0.0.1:9650"}
2022-07-18T11:28:22.351+0200	info	client/client.go:105	CAM varlık id'si alındı	{"id": "23MDJv6nhwCGnEer4GsEQWwDURk42ZQBoc444eosZ4BVgH87EW"}
2022-07-18T11:28:22.351+0200	info	client/client.go:107	Ağ bilgileri alınıyor
2022-07-18T11:28:22.352+0200	info	client/client.go:116	Ağ bilgileri alındı	{"networkId": 1001, "networkName": "columbus"}

Blok zincirini kontrol ediyorum...
2022-07-18T11:28:22.352+0200	info	platformvm/checker.go:127	blok zincirini sorguluyor	{"blockchainId": "rcXq53fMgf9f34iWXvQcka2VDSegdL3Knz7wMTNG5mxRboqFF", "expectedBlockchainStatus": "Validating"}
2022-07-18T11:28:22.353+0200	info	platformvm/checker.go:48	P-Chain tx sorgulanıyor	{"txId": "rcXq53fMgf9f34iWXvQcka2VDSegdL3Knz7wMTNG5mxRboqFF", "expectedStatus": "Committed"}
2022-07-18T11:28:22.353+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-18T11:28:22.354+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "874.197µs"}
2022-07-18T11:28:22.354+0200	info	poll/poll.go:42	sorgulama başlatılıyor	{"internal": "1s"}
2022-07-18T11:28:22.355+0200	info	poll/poll.go:66	sorgulama onaylandı	{"took": "1.309324ms"}