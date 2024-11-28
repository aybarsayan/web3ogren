---
title: Basit Dosya Yönetim Aracı - BNB Greenfield Dosya Yönetimi
description: Bu eğitim, Greenfield SDK kullanarak dosya yönetim aracı oluşturmayı ve testnet ile etkileşimde bulunmayı adım adım gösterir. Özellikleri, kurulum adımları ve örnek kodlar ile kullanıcıların kendilerine ait projeler geliştirebilmelerine olanak tanır.
keywords: [BNB, Greenfield, dosya yönetimi, SDK, testnet, API, blockchain]
order: 1
---

# Greenfield SDK ile Dosya Yönetim Aracı Oluşturma

Birçok Chain API kütüphanesi mevcuttur. Bu kütüphaneler, Greenfield düğümüne bağlanmak, istek yapmak ve yanıtları yönetmek için alt düzey mantığı yönetir.

* [go-sdk](https://github.com/bnb-chain/greenfield-go-sdk)
* [js-sdk](https://github.com/bnb-chain/greenfield-js-sdk)

:::info
Bu eğitimde testnet ile etkileşimde bulunmak için go-SDK kütüphanesini kullanacağız.
:::

## Ön Koşullar
Başlamadan önce, şunları bilmelisiniz:
* `Greenfield temel bilgileri`
* Greenfield komut satırı [örnekleri](https://github.com/bnb-chain/greenfield-cmd#examples)

Ayrıca, aşağıdaki bağımlılıkların en son sürümünü yüklediğinizden emin olun:
* Go sürümü 1.20 ve üstü

## Go-SDK Özellikleri
* **basic.go**, blockchain bilgilerini almak için temel fonksiyonları içerir.
* **storage.go**, bir kova oluşturma, dosya yükleme, dosya indirme, başlık ve kaynakları silme gibi en önemli depolama fonksiyonlarını içerir.
* **group.go**, bir grup oluşturma ve grup üyesini güncelleme gibi grubuyla ilgili fonksiyonları içerir.
* **payment.go**, yönetim ödeme hesabına ilişkin ödeme ile ilgili fonksiyonları içerir.
* **crosschain.go**, BSC'ye kaynakları aktarım veya yansıtmak için çapraz zincir ile ilgili fonksiyonları içerir.

## Kurulum

### Go Projesi Oluşturma
Gerekli bağımlılıklarla bir Go projesi oluşturalım.

Init
```sh
$ mkdir ~/hellogreenfield
$ cd ~/hellogreenfield
$ go mod init hellogreenfield
```

SDK Bağımlılıklarını Ekle
```sh
$ go get github.com/bnb-chain/greenfield-go-sdk
```

Bağımlılıkları değiştirmek için go.mod dosyasını düzenleyin
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

Bağımlılıkları yükle
```sh
go mod tidy
```

### Basit bir fonksiyonu test et
Artık Greenfield testnet'e bağlanmak ve depolama sağlayıcı API'leri ile etkileşimde bulunmak için hazırız. Her şeyin beklendiği gibi çalıştığını doğrulamak için Greenfield sürümünü sorgulayan basit bir betik yazalım.

Projenizde `main.go` dosyası oluşturun ve aşağıdaki kodu ekleyin.
```go
package main

import (
  "context"
  "log"

  "github.com/bnb-chain/greenfield-go-sdk/client"
  "github.com/bnb-chain/greenfield-go-sdk/types"
)

const (
  rpcAddr    = "https://greenfield-chain.bnbchain.org:443"
  chainId    = "greenfield_1017-1"
  /*testnet
  rpcAddr    = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
  chainId    = "greenfield_5600-1"
  */
  privateKey = ""
)

func main() {
  account, err := types.NewAccountFromPrivateKey("test", privateKey)
  if err != nil {
    log.Fatalf("Yeni özel anahtardan hesap oluşturma hatası, %v", err)
  }

  cli, err := client.New(chainId, rpcAddr, client.Option{DefaultAccount: account})
  if err != nil {
    log.Fatalf("yeni greenfield istemcisi oluşturulamadı, %v", err)
  }

  ctx := context.Background()
  nodeInfo, versionInfo, err := cli.GetNodeInfo(ctx)
  if err != nil {
    log.Fatalf("düğüm bilgilerini almak mümkün değil, %v", err)
  }

  log.Printf("düğüm bilgisi moniker: %s, go sürümü: %s", nodeInfo.Moniker, versionInfo.GoVersion)
  
  latestBlock, err := cli.GetLatestBlock(ctx)
  if err != nil {
    log.Fatalf("son bloğu almak mümkün değil, %v", err)
  }
  log.Printf("son blok başlığı: %s", latestBlock.Header)

  heightBefore := latestBlock.Header.Height
  log.Printf("blok yüksekliği bekliyor: %d", heightBefore)
  err = cli.WaitForBlockHeight(ctx, heightBefore+10)
  if err != nil {
    log.Fatalf("blok yüksekliği beklemek mümkün değil, %v", err)
  }
  height, err := cli.GetLatestBlockHeight(ctx)
  if err != nil {
    log.Fatalf("en son blok yüksekliğini almak mümkün değil, %v", err)
  }

  log.Printf("Mevcut blok yüksekliği: %d", height)
}
```

Proje dizininde aşağıdaki komutu çalıştırın:
```
go run main.go
```
Bu, şöyle bir çıktı verecektir:
```
2023/09/12 22:18:10 düğüm bilgisi moniker: fullnode, go sürümü: go sürümü go1.20.7 linux/amd64
2023/09/12 22:18:10 son blok başlığı: {{%!s(uint64=11) %!s(uint64=0)} greenfield_5600-1 %!s(int64=401149) 2023-09-13 04:18:05.661693468 +0000 UTC
{
    "header": {
      "version": {
        "block": "11",
        "app": "0"
      },
      "chain_id": "greenfield_5600-1",
      "height": "401149",
      "time": "2023-09-13T04:18:05.661693468Z",
      "last_block_id": {
        "hash": "KenBGYDrtA7Bnyy6j3R3d16GWuHnIl5gJW0J3kmM4r8=",
        "part_set_header": {
          "total": 1,
          "hash": "W6nmeVJEhHinvI4I6HBsU/A87Zma8DVVvddBATJdctE="
        }
      },
      "last_commit_hash": "/G92Jzr8fPpqKY89F3xa3dytOF8a2HLvqCrccm9scXM=",
      "data_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "validators_hash": "FykCd/548F1J28ssZr71B1805hzxENaQvexsW/Dxo3E=",
      "next_validators_hash": "FykCd/548F1J28ssZr71B1805hzxENaQvexsW/Dxo3E=",
      "consensus_hash": "FgA8CM0pWCco2OYq8pA9tuklVX8bmHmMV2Ssdj31W4E=",
      "app_hash": "wv+XqXhJBQPYpat/Obaj00u86KfJ8le4LIIFFAgqVmA=",
      "last_results_hash": "f6XeDeH8QasoTSGpSJL0r2WGE4MlrXOVt0cE3bIQE8I=",
      "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "proposer_address": "KhlQ9bz1O8iaWZnqKe36m3IpcP4=",
      "randao_mix": "/6zQmCJztTeqZIRHe/pXxhgSbfwDLE85awoa4c8sShUUwGGLqFyshMag63MTB7JC2fAsUqPg1ryALY+uQNZ3Bw=="
    }
}
2023/09/12 22:18:10 Blok yüksekliği bekliyor: 401149
2023/09/12 22:18:34 Mevcut blok yüksekliği: 401159
```
Her şey düzgün ayarlanmışsa, kodunuz Greenfield düğümüne bağlanabilecek ve yukarıdaki gibi zincir verilerini döndürebilecektir.

## Zincir Verilerini Al
Önceki adımda, düğüme bağlanmanın ve zincir verilerini sorgulamak için bir `Client` başlatmanın temel adımlarını göstermek için bir `main.go` dosyası oluşturduk. Şimdi, bazı ek fonksiyonları kullanalım.

Mevcut zincir başını alın:
```go
  blockByHeight, err := cli.GetBlockByHeight(ctx, height)
  if err != nil {
    log.Fatalf("yükseklikten bloğu almak mümkün değil, %v", err)
  }
  log.Printf("Mevcut blok yüksekliği: %d", blockByHeight.Header)
```

## Adres Bakiyesini Al
Verilen bir greenfield cüzdan adresi ile, `GetAccountBalance` fonksiyonunu çağırarak bakiyesini sorgulayabilirsiniz.
```go
  balance, err := cli.GetAccountBalance(ctx, account.GetAddress().String())
  if err != nil {
    log.Fatalf("bakiyeyi almak mümkün değil, %v", err)
  }
  log.Printf("%s Mevcut bakiye: %s", account.GetAddress().String(), balance.String())
```

Yukarıda gösterilen temel veri sorgularının yanı sıra, daha birçok özellik bulunmaktadır. Lütfen tüm Greenfield API tanımlamaları için `JSON-RPC API Referansı` sayfasına bakın.

## Cüzdanı Yönet
Greenfield cüzdanları, nesneleri yönetmek, işlemleri imzalamak ve gaz ücretlerini ödemek için kullanabileceğiniz adresleri tutar. Bu bölümde, cüzdanınızı yönetmenin farklı yollarını göstereceğiz.
1. Öncelikle, bağlı düğümünüzün çalıştığından ve cüzdan adresinin biraz testnet BNB içerdiğinden emin olun.
2. Önceki projede olduğu gibi aynı projede yeni bir `account.go` dosyası oluşturun. Burada cüzdanla ilgili tüm kodlarımızı yazacağız.
3. `account.go` dosyasında modülleri içe aktarın ve özel anahtarınızı veya mnemonik kelime grubunu başlatın.

```go
  //mnemonik içe aktar
  account, err := types.NewAccountFromMnemonic("test", mnemonic)
  //özel anahtarı içe aktar
  account, err := types.NewAccountFromPrivateKey("test", privateKey)
```

Bu yeni adresle transferleri test edebileceğimiz ikinci bir cüzdan adresi oluşturalım. Yeni adres yerel olarak oluşturulacak ve 0 token bakiyesiyle başlayacak:
```go
  account2, _, err := types.NewAccount("test2")
```

Şimdi, bu yeni adrese tBNB transfer etmeye çalışalım. Temel düzeyde, bu, tBNB'yi fromAddress'tan toAddress'a aktarmak için bir işlem oluşturur, SDK kullanarak işlemi imzalar ve imzalı işlemi Greenfield düğümüne gönderir.
```go
    transferTxHash, err := cli.Transfer(ctx, account2.GetAddress().String(), math.NewIntFromUint64(10000000000), types2.TxOption{})
    if err != nil {
      log.Fatalf("gönderilemiyor, %v", err)
    }
    log.Printf("Transfer yanıtı: %s", transferTxHash)

    waitForTx, err := cli.WaitForTx(ctx, transferTxHash)

    log.Printf("tx bekliyor: %s", waitForTx.TxResult.String())

    balance, err = cli.GetAccountBalance(ctx, account2.GetAddress().String())
```

tBNB transferini test etmek için kodu çalıştırın:
```sh
go run account.go
```

Bu, şöyle bir çıktı verecektir:
```
2023/09/07 11:18:51 tx bekliyor: data:"\022&\n$/cosmos.bank.v1beta1.MsgSendResponse\032\010\000\000\000\000\000\000\372\235" log:"[{\"msg_index\":0,\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmos.bank.v1beta1.MsgSend\"},{\"key\":\"sender\",\"value\":\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"},{\"key\":\"module\",\"value\":\"bank\"}]},{\"type\":\"coin_spent\",\"attributes\":[{\"key\":\"spender\",\"value\":\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"},{\"key\":\"amount\",\"value\":\"10000000000BNB\"}]},{\"type\":\"coin_received\",\"attributes\":[{\"key\":\"receiver\",\"value\":\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"},{\"key\":\"amount\",\"value\":\"10000000000BNB\"}]},{\"type\":\"transfer\",\"attributes\":[{\"key\":\"recipient\",\"value\":\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"},{\"key\":\"sender\",\"value\":\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"},{\"key\":\"amount\",\"value\":\"10000000000BNB\"}]},{\"type\":\"message\",\"attributes\":[{\"key\":\"sender\",\"value\":\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"}]}]}]" gas_wanted:1200 gas_used:1200 events:<type:"coin_spent" attributes:<key:"spender" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true > attributes:<key:"amount" value:"6000000000000BNB" index:true > > events:<type:"coin_received" attributes:<key:"receiver" value:"0xf1829676DB577682E944fc3493d451B67Ff3E29F" index:true > attributes:<key:"amount" value:"6000000000000BNB" index:true > > events:<type:"transfer" attributes:<key:"recipient" value:"0xf1829676DB577682E944fc3493d451B67Ff3E29F" index:true > attributes:<key:"sender" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true > attributes:<key:"amount" value:"6000000000000BNB" index:true > > events:<type:"message" attributes:<key:"sender" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true >
```

## Depolama Anlaşması Yap
Veri depolamak, Greenfield'ın en önemli özelliklerinden biridir. Bu bölümde, verilerinizi Greenfield ağına depolamak için uçtan uca süreci inceleyeceğiz. Öncelikle verilerinizi içe aktaracağız, ardından bir depolama sağlayıcısıyla depolama anlaşması yapacağız ve son olarak anlaşmanın tamamlanmasını bekleyeceğiz.

### 1. Ana Dosyayı Oluştur
Demo projenizde bir `storage.go` dosyası oluşturun ve aşağıdaki örnek kodu ekleyin:
```go
func main() {​
  // hesabı başlat
  account, err := types.NewAccountFromPrivateKey("test", privateKey)
  log.Println("adres bilgisi:", account)​
  if err != nil {
    log.Fatalf("Yeni özel anahtardan hesap oluşturma hatası, %v", err)
  }

  // istemciyi başlat
  cli, err := client.New(chainId, rpcAddr, client.Option {DefaultAccount: account})
  if err != nil {
    log.Fatalf("yeni greenfield istemcisi oluşturulamadı, %v", err)
  }

  ctx := context.Background()​

  // 1. depolama sağlayıcısını seç
  // 2. Bir kova oluştur
  // 3. Verilerinizi yükleyin ve bir kota belirleyin      ​
}
```

### 2. Kendi SP'nizi Seçin
SP listesini sorgulayabilirsiniz.
```go
  // depolama sağlayıcıları listesini al
  spLists, err := cli.ListStorageProviders(ctx, true)
  if err != nil {
    log.Fatalf("hizmetteki sps'leri listelemek başarısız oldu")
  }

  // ilk sp'yi birincil SP olarak seç
  primarySP := spLists[0].GetOperatorAddress()
```

### 3. Kovanızı Oluşturun
Kova özel veya genel olabilir. Bunu seçeneklerle özelleştirebilirsiniz.
* VISIBILITY_TYPE_PUBLIC_READ
* VISIBILITY_TYPE_PRIVATE
```go
  chargedQuota := uint64(10000000)
  visibility := storageTypes.VISIBILITY_TYPE_PUBLIC_READ
  opts := types.CreateBucketOptions{Visibility: visibility, ChargedQuota: chargedQuota}

  bucketTx, err := cli.CreateBucket(ctx, bucketName, primarySP, opts)
  if err != nil {
    log.Fatalf("gönderilemiyor, %v", err)
  }
  log.Printf("Kova oluşturma yanıtı: %s", bucketTx)
```
`quota`nın nasıl çalıştığını anlamak için `bu belgeyi` okuyun.

### 4. Nesnenizi Yükleyin
Nesneler özel veya genel olabilir. Nesneleri yüklemek iki aşamadan oluşur: oluşturma ve koyma.
* `CreateObject`, bir nesne oluşturma onayı alır ve createObject işlemini Greenfield ağına gönderir.
* `PutObject`, nesneyi kovaya yüklemenin ikinci aşamasını destekler.

```go
  // nesne oluştur ve yükle
  var buffer bytes.Buffer
  line := `0123456789`
  for i := 0; i < objectSize/10; i++ {
    buffer.WriteString(fmt.Sprintf("%s", line))
  }

  txnHash, err := cli.CreateObject(ctx, bucketName, objectName, bytes.NewReader(buffer.Bytes()), types.CreateObjectOptions{})

  handleErr(err, "CreateObject")

  err = cli.PutObject(ctx, bucketName, objectName, int64(buffer.Len()),
    bytes.NewReader(buffer.Bytes()), types.PutObjectOptions{TxnHash: txnHash})
  handleErr(err, "PutObject")

  log.Printf("nesne: %s SP'ye yüklendi\n", objectName)

  waitObjectSeal(cli, bucketName, objectName)
```

```go
  func waitObjectSeal(cli client.Client, bucketName, objectName string) {
    ctx := context.Background()
    // nesnenin mühürlenmesini bekleyin
    timeout := time.After(15 * time.Second)
    ticker := time.NewTicker(2 * time.Second)

    for {
      select {
      case <-timeout:
        err := errors.New("15 saniye sonra nesne mühürlenmedi")
        handleErr(err, "HeadObject")
      case <-ticker.C:
        objectDetail, err := cli.HeadObject(ctx, bucketName, objectName)
        handleErr(err, "HeadObject")
        if objectDetail.ObjectInfo.GetObjectStatus().String() == "OBJECT_STATUS_SEALED" {
          ticker.Stop()
          fmt.Printf("nesne %s başarıyla yüklendi \n", objectName)
          return
        }
      }
    }
  }
```

Birincil SP, ikincil SP'lerle senkronize olarak veri yedekliliğini ayarlar ve ardından depolama için nihai veriyle birlikte bir `Seal` işlemi imzalar. Birincil SP, dosyayı depolamak istemediklerini düşündüğünde isteği "SealReject" edebilir.

### 5. Nesne Yönetimi

#### 5.1 Nesneyi Oku
Verileri indirmek için `GetObject` fonksiyonunu çağırabilirsiniz.
```go
  // nesneyi al
  reader, info, err := cli.GetObject(ctx, bucketName, objectName, types.GetObjectOptions{})
  handleErr(err, "GetObject")
  log.Printf("nesne %s başarıyla alındı, boyut %d \n", info.ObjectName, info.Size)
  handleErr(err, "GetObject")
  objectBytes, err := io.ReadAll(reader)
  fmt.Printf("Okunan veri: %s\n", string(objectBytes))
```

#### 5.2 Nesne görünürlüğünü güncelle
* Kova görünürlüğünü değiştirmek için `UpdateBucketVisibility` fonksiyonunu çağırabilirsiniz.
* Nesne görünürlüğünü değiştirmek için `UpdateObjectVisibility` fonksiyonunu çağırabilirsiniz.

```go
  //kova görünürlüğünü güncelle
  updateBucketTx, err := cli.UpdateBucketVisibility(ctx, bucketName,
              storageTypes.VISIBILITY_TYPE_PRIVATE, types.UpdateVisibilityOption{})

  resp, err := cli.WaitForTx(ctx, updateBucketTx)
  fmt.Printf("Güncelleme yanıtı: %s\n", resp)
  handleErr(err, "UpdateBucketVisibility")

  // Nesne görünürlüğünü güncelle
  updateObjectTx, err := cli.UpdateObjectVisibility(ctx, bucketName, objectName,
              storageTypes.VISIBILITY_TYPE_PRIVATE, types.UpdateObjectOption{})

  resp, err := cli.WaitForTx(ctx, updateObjectTx)
  fmt.Printf("Güncelleme yanıtı: %s\n", resp)
  handleErr(err, "UpdateObjectVisibility")
 ```

#### 5.3 Nesneyi Sil
DeleteObject fonksiyonu nesneleri silmeyi destekler.
```go
  // nesneyi sil
  delTx, err := cli.DeleteObject(ctx, bucketName, objectName, types.DeleteObjectOption{})
  handleErr(err, "DeleteObject")
  _, err = cli.WaitForTx(ctx, delTx)
  if err != nil {
    log.Fatalln("işlem başarısız")
  }
  log.Printf("nesne: %s silindi\n", objectName)
```

## Sonuç
Bu eğitimi başarıyla tamamladığınız için tebrikler! Bu eğitimde, SDK kütüphanesini kullanarak Greenfield ağı ile etkileşimde bulunmanın temellerini öğrendik.

### Kaynak Kodu
* [Go-SDK](https://github.com/bnb-chain/greenfield-go-sdk/blob/master/examples/storage.go)
* [JS-SDK](https://github.com/bnb-chain/greenfield-js-sdk/blob/main/examples/nodejs/storage.js)