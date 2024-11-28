---
title: Go SDK Örneği - BNB Greenfield SDK
description: Bu rehber, BNB Greenfield SDK'sının Go uygulamalarında nasıl kullanılacağını göstermektedir. Kullanıcılar, veri depolama ve izin yönetimi gibi Greenfield hizmetlerine erişim sağlayabilirler. Kılavuz, kurulum, kullanım, API belgeleri ve depolama süreçlerini içermektedir.
keywords: [Go SDK, BNB Greenfield, veri depolama, izin yönetimi, API, cüzdan yönetimi, örnek kod]
---

# Hızlı Başlangıç

Greenfield SDK, geliştiricilerin veri depolama ve izin yönetimi gibi Greenfield hizmetlerini kullanarak Go uygulamaları inşa etmeleri için API'ler ve yardımcı araçlar sağlar.

SDK, doğrudan bir web hizmeti arayüzü ile programlama sürecini basitleştirir. Kimlik doğrulama, istekleri yeniden deneme ve hataları yönetme gibi birçok temel detayı üstlenir.

:::info
Bu kılavuz, yapılandırma bilgileri, örnek kod ve SDK yardımcı araçlarına bir giriş sağlamaktadır.
:::

## Kurulum

Greenfield SDK'sı için Go 1.20 veya daha yenisine ihtiyaç vardır. Mevcut Go sürümünüzü görüntülemek için `go version` komutunu çalıştırabilirsiniz. Go'yu yükleme veya güncelleme hakkında bilgi için [https://golang.org/doc/install](https://golang.org/doc/install) adresine bakın.

SDK ve bağımlılıklarını yüklemek için aşağıdaki Go komutunu çalıştırın.

```sh
$ go get github.com/bnb-chain/greenfield-go-sdk
```

Bağımlılıkları değiştirmek için `go.mod` dosyasını düzenleyin.
```sh
replace (
    cosmossdk.io/api => github.com/bnb-chain/greenfield-cosmos-sdk/api v0.0.0-20230425074444-eb5869b05fe9
    cosmossdk.io/math => github.com/bnb-chain/greenfield-cosmos-sdk/math v0.0.0-20230425074444-eb5869b05fe9
    github.com/cometbft/cometbft => github.com/bnb-chain/greenfield-cometbft v0.0.2
    github.com/cometbft/cometbft-db => github.com/bnb-chain/greenfield-cometbft-db v0.8.1-alpha.1
    github.com/cosmos/cosmos-sdk => github.com/bnb-chain/greenfield-cosmos-sdk v0.2.3
    github.com/cosmos/iavl => github.com/bnb-chain/greenfield-iavl v0.20.1-alpha.1
    github.com/syndtr/goleveldb => github.com/syndtr/goleveldb v1.0.1-0.20210819022825-2ae1ddf74ef7
)
```

Bağımlılıkları yükleyin.

```sh
go mod tidy
```

## Kullanım

Artık Greenfield test ağına bağlanmaya ve Greenfield API'leri ile etkileşimde bulunmaya hazırız. Her şeyin beklendiği gibi çalışıp çalışmadığını doğrulamak için Greenfield sürümünü sorgulayan basit bir betik yazalım.

### İstemci Oluşturma

Projenizde bir `main.go` dosyası oluşturun ve aşağıdaki kodu ekleyin.

```go
package main

import (
	"context"
	"log"

	"github.com/bnb-chain/greenfield-go-sdk/client"
	"github.com/bnb-chain/greenfield-go-sdk/types"
)

const (
	privateKey  = ""
	
	// Ana Ağ Bilgisi
	rpcAddr     = "https://greenfield-chain.bnbchain.org:443"
	chainId     = "greenfield_1017-1"
	
	// Test Ağı Bilgisi
	// rpcAddr     = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
	// chainId     = "greenfield_5600-1"
)

func main() {
	// hesap içeri aktar
	account, err := types.NewAccountFromPrivateKey("test", privateKey)
	if err != nil {
		log.Fatalf("Özel anahtardan yeni hesap oluşturma hatası, %v", err)
	}

	// istemci oluştur
	cli, err := client.New(chainId, rpcAddr, client.Option{DefaultAccount: account})
	if err != nil {
		log.Fatalf("yeni greenfield istemcisi oluşturulamadı, %v", err)
	}
	ctx := context.Background()

	// RPC'den düğüm bilgilerini al
	nodeInfo, versionInfo, err := cli.GetNodeInfo(ctx)
	if err != nil {
		log.Fatalf("düğüm bilgileri alınamadı, %v", err)
	}
	log.Printf("düğüm bilgileri kimliği: %s, go sürümü: %s", nodeInfo.Moniker, versionInfo.GoVersion)

	// en son blok yüksekliğini sorgula
	height, err := cli.GetLatestBlockHeight(ctx)
	if err != nil {
		log.Fatalf("en son blok yüksekliği alınamadı, %v", err)
	}

	log.Printf("Mevcut blok yüksekliği: %d", height)
}
```

Proje dizininizde aşağıdaki komutu çalıştırın:

```bash
go run main.go
```

Bu, aşağıdaki gibi bir çıktı verecektir:

```
2023/06/22 10:44:16 düğüm bilgileri kimliği: validator-a, go sürümü: go version go1.20.4 linux/amd64
2023/06/22 10:44:16 Mevcut blok yüksekliği: 817082
```

> Her şey doğru bir şekilde ayarlandığında, kodunuz Greenfield düğümüne bağlanabilir ve yukarıda gösterildiği gibi zincir verilerini döndürebilir.

### Sorgular

Önceki adımda, düğüme bağlanmanın ve zincir verilerini sorgulamak için bir `Client` başlatmanın temel adımlarını göstermek için bir `main.go` dosyası oluşturduk. Şimdi, daha fazla işlev kullanmaya geçelim.

#### 1. Mevcut Zincir Başını Al

Aşağıdaki kodu `main.go` dosyasına ekleyerek zincirin mevcut başını sorgulayabiliriz.

```go
  // en son blok yüksekliğini sorgula
  blockByHeight, err := cli.GetBlockByHeight(ctx,height)
	if err != nil {
		log.Fatalf("yükseklik ile bloğu almak mümkün olmadı, %v", err)
	}
	log.Printf("Mevcut blok yüksekliği: %d", blockByHeight.GetHeader())
```

#### 2. Adres Bakiyesini Al

Verilen bir Greenfield cüzdan adresi ile `GetAccountBalance` fonksiyonunu çağırarak bakiyesini sorgulayabilirsiniz.

```go
	// mevcut bakiyeyi sorgula
	balance, err := cli.GetAccountBalance(ctx, account.GetAddress().String())
	if err != nil {
		log.Fatalf("bakiyeyi almak mümkün olmadı, %v", err)
	}
	log.Printf("%s Mevcut bakiye: %s", account.GetAddress().String(), balance.String())
```

#### 3. Depolama Sağlayıcılarını Sorgulama

Ayrıca, SDK, mevcut depolama sağlayıcılarının listesini sorgulama desteği sağlar ve meta veri niteliklerini keşfetmek için genel arama yetenekleri sunar.

```go
	cli, err := client.New(chainId, rpcAddr, client.Option{DefaultAccount: account})
	if err != nil {
		log.Fatalf("yeni greenfield istemcisi oluşturulamadı, %v", err)
	}
	ctx := context.Background()

	// depolama sağlayıcıları listesini al
	spLists, err := cli.ListStorageProviders(ctx, true)
	if err != nil {
		log.Fatalf("hizmet sps'inde listeleme başarısız")
	}
```

#### 4. Depolama Fiyatını Sorgulama

```go
	// birinci sp'yi ana sp olarak seç
	primarySP := spLists[0].GetOperatorAddress()

	// veri depolama fiyatını sorgula
	price, err := cli.GetStoragePrice(ctx,primarySP)
	if err != nil {
		log.Fatalf("hizmet sps'inde listeleme başarısız")
	}

	log.Printf("Okuma fiyatı %s ve Depolama fiyatı %s \n",price.ReadPrice,price.StorePrice)
```

#### 5. Kova Sorguları

Kova bilgilerini aşağıdaki gibi sorgulayabilirsiniz:

```go
	// kova başlığı
	bucketInfo, err := cli.HeadBucket(ctx, bucketName)
	handleErr(err, "Kova Başlığı")
	log.Println("kova bilgisi:", bucketInfo.String())
```

#### 5. Nesneleri Sorgulama

Aynı kovanın altındaki tüm nesneleri listele

```go
    // nesneleri listele
	objects, err := cli.ListObjects(ctx, bucketName, types.ListObjectsOptions{
		ShowRemovedObject: false, Delimiter: "", MaxKeys: 100, EndPointOptions: &types.EndPointOptions{
			Endpoint:  httpsAddr, // sp son noktası
			SPAddress: "",
		}})
	log.Println("nesneleri listele sonucu:")
	for _, obj := range objects.Objects {
		i := obj.ObjectInfo
		log.Printf("nesne: %s, durum: %s\n", i.ObjectName, i.ObjectStatus)
	}
```

Yukarıda gösterilen temel veri sorgularının yanı sıra birçok diğer özellik mevcuttur. Tüm Greenfield API tanımları için lütfen `JSON-RPC API Referansı`na bakın.

### İşlemler

#### 1. Cüzdan Yönetimi

Greenfield cüzdanları, nesneleri yönetmek, işlemleri imzalamak ve gaz ücretlerini ödemek için kullanabileceğiniz adresleri saklar. Bu bölümde, cüzdanınızı yönetmenin farklı yollarını göstereceğiz.

* İlk olarak, bağlı düğümünüzün çalıştığından emin olun ve cüzdan adresinizin bazı test ağı BNB değerine sahip olduğunu kontrol edin.
* Önceki proje ile aynı projede `account.go` adında yeni bir dosya oluşturun. Burada tüm cüzdan ile ilgili kodları yazacağız.
* `account.go` dosyasında modülleri içe aktarın ve özel anahtarınızı veya mnemonik ifadenizi başlatın.

```go
	// mnemonik içe aktar
	account, err := types.NewAccountFromMnemonic("test", mnemonic)
	// özel anahtarı içe aktar
	account, err := types.NewAccountFromPrivateKey("test", privateKey)
```

Yeni bir cüzdan adresi oluşturalım böylece transferleri test edebiliriz. Yeni adres yerel olarak oluşturulacak ve 0 token bakiyesi ile başlayacaktır:

```go
	// farklı bir hesap oluştur
	account2, _, err := types.NewAccount("test2")
```

Şimdi, tBNB'yi bu yeni adrese transfer etmeye çalışalım. Arkada, bu, tBNB'yi `fromAddress`dan `toAddress`a transfer etmek için bir işlem oluşturacak, işlemi SDK kullanarak imzalayacak ve imzalı işlemi Greenfield düğümüne gönderecektir.

```go
	// account2'ye jeton aktar
	transferTxHash, err := cli.Transfer(ctx, account2.GetAddress().String(), math.NewIntFromUint64(1000000000000000000), types2.TxOption{})
	if err != nil {
		log.Fatalf("gönderme mümkün olmadı, %v", err)
	}
	log.Printf("Transfer yanıtı: %s", transferTxHash)

	// işlem hash'ini bekle
	waitForTx, err := cli.WaitForTx(ctx, transferTxHash)

	log.Printf("tx için bekle: %s", waitForTx.String())

	// account2'nin bakiyesini doğrula
	balance, err = cli.GetAccountBalance(ctx, account2.GetAddress().String())
```

tBNB transferini test etmek için kodu çalıştırın:

```go
	go run account.go
```

Bu, aşağıdaki gibi bir çıktı verecektir:

```shell
raw_log: '[{"msg_index":0,"events":[{"type":"message","attributes":[{"key":"action","value":"/cosmos.bank.v1beta1.MsgSend"},{"key":"sender","value":"0x525482AB3922230e4D73079890dC905dCc3D37cd"},{"key":"module","value":"bank"}]},{"type":"coin_spent","attributes":[{"key":"spender","value":"0x525482AB3922230e4D73079890dC905dCc3D37cd"},{"key":"amount","value":"1BNB"}]},{"type":"coin_received","attributes":[{"key":"receiver","value":"0x78C3A3d10B1032bB2810366361dCE84E2e92eFCB"},{"key":"amount","value":"1BNB"}]},{"type":"transfer","attributes":[{"key":"recipient","value":"0x78C3A3d10B1032bB2810366361dCE84E2e92eFCB"},{"key":"sender","value":"0x525482AB3922230e4D73079890dC905dCc3D37cd"},{"key":"amount","value":"1BNB"}]},{"type":"message","attributes":[{"key":"sender","value":"0x525482AB3922230e4D73079890dC905dCc3D37cd"}]}]}]'
timestamp: "2023-06-22T20:02:19Z"
tx:
  '@type': /cosmos.tx.v1beta1.Tx
  auth_info:
    fee:
      amount:
      - amount: "6000000000000"
        denom: BNB
      gas_limit: "1200"
      granter: ""
      payer: ""
    signer_infos:
    - mode_info:
        single:
          mode: SIGN_MODE_EIP_712
      public_key:
        '@type': /cosmos.crypto.eth.ethsecp256k1.PubKey
        key: AirjhHwjRcZ34op5yCKHtDkn91RDgFOY8cJmbHH6Tmlu
      sequence: "12"
    tip: null
  body:
    extension_options: []
    memo: ""
    messages:
    - '@type': /cosmos.bank.v1beta1.MsgSend
      amount:
      - amount: "1"
        denom: BNB
      from_address: 0x525482AB3922230e4D73079890dC905dCc3D37cd
      to_address: 0x78C3A3d10B1032bB2810366361dCE84E2e92eFCB
    non_critical_extension_options: []
    timeout_height: "0"
  signatures:
  - FjUNT2dzpQZhCmVTLDGMEy1uR1NaNLeYjvqQiPr2xHM5xxeYP5Mic8CSxZtg3k4WHcAIEnQNcszqBi7fsgETagA=
txhash: DFC2CE0514FE334B5BCB6BC3EBCCCD7A6E16B4CAEDC4FFDBE3F2FA3B6E548E61
```

### Depolama Anlaşması Yapma

Veri depolamak, Greenfield'ın en önemli özelliklerinden biridir. Bu bölümde, verilerinizi Greenfield ağına depolama sürecini baştan sona açıklayacağız. Verilerinizi içe aktararak başlayacağız, ardından bir depolama sağlayıcısıyla depolama anlaşması yapacağız ve sonunda anlaşmanın tamamlanmasını bekleyeceğiz.

#### 1. `storage.go` dosyası oluşturma

`storage.go` adında bir dosya oluşturun ve aşağıdaki başlangıç kodunu ekleyin:

```go
func main() {

  // hesap başlat
  account, err := types.NewAccountFromPrivateKey("test", privateKey)
  log.Println("adres bilgisi:", account)

  if err != nil {
	  log.Fatalf("Özel anahtardan yeni hesap oluşturma hatası, %v", err)
  }

  // istemci başlat
  cli, err := client.New(chainId, rpcAddr, client.Option{DefaultAccount: account})
  if err != nil {
	  log.Fatalf("yeni greenfield istemcisi oluşturulamadı, %v", err)
  }
  ctx := context.Background()

  // 1. depolama sağlayıcısını seç

  // 2. Bir kova oluştur

  // 3. Verilerinizi yükleyin ve bir kota belirleyin
}
```

#### 2. SP Seçme

SP listesini sorgulayabilirsiniz.

```go
	// depolama sağlayıcıları listesini al
	spLists, err := cli.ListStorageProviders(ctx, true)
	if err != nil {
		log.Fatalf("hizmet sps'inde listeleme başarısız")
	}
	// birinci sp'yi ana sp olarak seç
	primarySP := spLists[0].GetOperatorAddress()
```

#### 3. Kovalar Oluşturma

Kovalar özel veya genel olabilir. Seçeneklerle özelleştirebilirsiniz.

*   VISIBILITY\_TYPE\_PUBLIC\_READ
*   VISIBILITY\_TYPE\_PRIVATE

```go
	chargedQuota := uint64(100)
	visibility := storageTypes.VISIBILITY_TYPE_PUBLIC_READ
	opts := types.CreateBucketOptions{Visibility: visibility, ChargedQuota: chargedQuota}
```

`kota`nın nasıl çalıştığını anlamak için `şunu` okuyun.

#### 4. Nesneleri Yükleme

Nesneler de özel veya genel olabilir.

Nesneleri yükleme işlemi iki bölümden oluşur: `create` ve `put`.

*   `CreateObject`, bir nesne oluşturmanın onayını alır ve nesne oluşturma işlemini Greenfield ağına gönderir.
*   `PutObject`, nesneyi kova içine yüklemenin ikinci aşamasını destekler.

```go
    // nesne yarat ve yükle
	txnHash, err := cli.CreateObject(ctx, bucketName, objectName, bytes.NewReader(buffer.Bytes()), types.CreateObjectOptions{})

	handleErr(err, "Nesne Oluştur")

	// nesnenizi yükleyin
	err = cli.PutObject(ctx, bucketName, objectName, int64(buffer.Len()),
		bytes.NewReader(buffer.Bytes()), types.PutObjectOptions{TxnHash: txnHash})
	handleErr(err, "Nesne Yükle")

	log.Printf("nesne: %s SP'ye yüklendi\n", objectName)

	// SP'nin nesnenizi mühürlemesini bekleyin
	waitObjectSeal(cli, bucketName, objectName)
```

Ana SP, veri yedekliliğini ayarlamak için ikincil SP'lerle senkronize olur ve ardından depolama için sonlandırılmış meta verilerle birlikte bir "`Seal`" işlemi imzalar. Ana SP, dosyayı herhangi bir nedenle depolamak istemediğine karar verirse, isteği "`SealReject`" edebilir.

### Nesne Yönetimi

#### 1. Nesneyi Okuma

Verileri indirmek için `GetObject` fonksiyonunu çağırabilirsiniz.

```go
	// nesneyi al
	reader, info, err := cli.GetObject(ctx, bucketName, objectName, types.GetObjectOption{})
	handleErr(err, "Nesne Al")
	log.Printf("nesneyi %s başarıyla aldık, boyut %d \n", info.ObjectName, info.Size)
	handleErr(err, "Nesne Al")
	objectBytes, err := io.ReadAll(reader)
	if !bytes.Equal(objectBytes, buffer.Bytes()) {
		handleErr(errors.New("indirilen içerik aynı değil"), "Nesne Al")
	}
```

#### 2. Nesne Görünürlüğünü Güncelleme

Nesne görünürlüğünü değiştirmek için `UpdateObjectVisibility` fonksiyonunu çağırabilirsiniz.

```go
	// nesne görünürlüğünü güncelle
	updateBucketTx, err := ccli.UpdateBucketVisibility(s.ClientContext, bucketName,
	storageTypes.VISIBILITY_TYPE_PRIVATE, types.UpdateVisibilityOption{})
```

#### 3. Nesneyi Silme

`DeleteObject` fonksiyonu nesneleri silmeyi destekler.

```go
	// nesneyi sil
	delTx, err := cli.DeleteObject(ctx, bucketName, objectName, types.DeleteObjectOption{})
	handleErr(err, "Nesne Sil")
	_, err = cli.WaitForTx(ctx, delTx)
	if err != nil {
		log.Fatalln("işlem başarısız")
	}
	log.Printf("nesne: %s silindi\n", objectName)
```

## Greenfield İstemci Belgeleri

### Kullanım

Greenfield Go SDK istemci paketini içe aktarın, istemci paketi Greenfield blok zinciri ve SP'lerle etkileşim için bir istemci sağlar.

```
    import "github.com/bnb-chain/greenfield-go-sdk/client"
```

Greenfield blok zinciri RPC son noktası ve chainID bilgilerini sağlayarak, bir Greenfield Go SDK istemci örneği oluşturarak yolculuğa başlayın.

```go
func New(chainID string, endpoint string, option Option) (Client, error)
```

### API Belgeleri

Greenfield Go SDK istemcisi, Greenfield ile etkileşim için birçok API'yi sarmalar, bunlar arasında hesap, banka, depolama ve izin API'leri gibi bir dizi API bulunur. Daha fazla detay için [Greenfield Go SDK Belgeleri](https://pkg.go.dev/github.com/bnb-chain/greenfield-go-sdk) adresine bakabilirsiniz.

## Kod Havuzu
- [Resmi Go uygulama SDK'sı](https://github.com/bnb-chain/greenfield-go-sdk)

## Daha Fazla Bilgi

* [Greenfield'da Depolama Modülü](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/storage-module.md): Greenfield Zincirindeki depolama modülü.
* [Greenfield'da Depolama Sağlayıcısı](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/storage-provider.md): Greenfield Zincirindeki depolama sağlayıcısı.
* [Veri Erişilebilirlik Mücadelesi](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/data-availability-challenge.md): Yüklemenin SP'de saklanma doğruluğu.
* `Depolama Sağlayıcısı Tanıtımı`: Greenfield Depolama Sağlayıcı belgeleri.
* `Depolama Sağlayıcı Derleme ve Bağımlılıklar`: SP derlenmesi ve bağımlılıkları hakkında ayrıntılı tanıtım.
* `Yerel Depolama Sağlayıcı Ağı Çalıştırma`: Test için yerel SP ortamını çalıştırma tanıtımı.
* `SP Ağına Katılma`: Test ağı veya ana ağda SP ağına katılma tanıtımı.