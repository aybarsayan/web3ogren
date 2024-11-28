---
title: SDK ile Çapraz Zincir Erişim Kontrolü - BNB Greenfield Erişim Kontrolü
description: BSC üzerindeki akıllı sözleşmeye nesneler üzerindeki izin kontrolünü aktarmak için go-SDK kütüphanesinin nasıl kullanılacağını ve zincir üzerindeki yönetimi sağlamayı anlatır. Bu kılavuz, BNB Greenfield ile BSC arasındaki etkileşimi ve çapraz zincir iletişimini detaylandırır.
keywords: [BNB Greenfield, Erişim kontrolü, İzin, Çapraz Zincir, go-SDK, Blockchain, Akıllı sözleşme]
---

# SDK ile Çapraz Zincir Erişim Kontrolü

:::tip
Bu öğretici, nesneler üzerindeki kontrolü BSC üzerindeki akıllı sözleşmeye aktarmak ve zincir üzerindeki yönetimi sağlamak için go-SDK kütüphanesini kullanmayı anlatmaktadır.
:::

Nesne yansıtma, BNB Greenfield'daki merkeziyetsiz depolama üzerinde tüm BSC dApp'leri için **daha büyük esneklik** ve **kontrol** sağlar. Bu, BSC'nin yeteneklerinden ve akıllı sözleşme işlevselliğinden yararlanarak her iki platform arasında geliştirilmiş işlevsellik ve birlikte çalışabilirlik sağlar.

## Ön koşullar

Başlamadan önce, aşağıdakilerle aşina olmalısınız:

- `Greenfield temelleri`
- Greenfield komut satırı [örnekleri](https://github.com/bnb-chain/greenfield-cmd#examples)

## Çapraz Zincir Mekanizması

Çapraz zincir iletişimi, farklı blok zincirleri arasında varlıkların, verilerin ve işlevlerin değişimini sağlayarak daha bağlı ve verimli bir merkeziyetsiz ekosistem oluşturmanın temelini oluşturur.

> **Not:** BNB Greenfield ile BSC arasındaki çapraz iletişim, Polkadot, Chainlink ve Cosmos'un benimsediği yaklaşımlardan pek çok önemli açıdan ayrılmaktadır.

| **Çapraz zincir iletişim özellikleri** | **BNB Greenfield/BSC**                     | **Cosmos/IBC**             | **Polkadot**                              | **Chainlink CCIP**                           |
| -------------------------------------- | ------------------------------------------ | -------------------------- | ----------------------------------------- | -------------------------------------------- |
| Toplu mesajlaşma                      | Özel ve performanslı                      | Genel uygulama            | Genel uygulama                           | Genel uygulama                              |
| Uyumluluk                             | EVM ve Ethereum L2'lerle tam uyumlu     | Yalnızca Cosmos ekosistemi | Yalnızca Polkadot ekosistemi              | Her blok zincir için belirli uygulamalar   |
| Güvenlik Modeli                      | Kendi doğrulayıcıları                     | Paylaşılan                 | Paylaşılan                                | Kendi doğrulayıcıları                       |
| Tokenomik                            | BNB                                       | ATOM                       | DOT                                       | LINK                                         |
| Adres Şeması                         | Tek - aynı adresler                      | Farklı adresler olabilir   | Farklı adresler olabilir                  | Farklı adresler olabilir                    |
| Bileşenlerin Birleştirilebilirliği    | BNB Zincir ekosistemi ile paylaşılan bileşenler | Uygulama aşamasında      | Polkadot ekosistemi ile paylaşılan bileşenler | Her ağ için yeni uygulama                   |

---

## Hesap Ayarı

### Go Projesi Oluşturma

Gerekli bağımlılıklarla bir Go projesi oluşturalım.

### Başlat

```sh
$ mkdir ~/hellogreenfield
$ cd ~/hellogreenfield
$ go mod init hellogreenfield
```

### SDK Bağımlılıklarını Ekle

```sh
$ go get github.com/bnb-chain/greenfield-go-sdk
```

go.mod dosyasını düzenleyerek bağımlılıkları değiştirin.

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

### Bağımlılıkları Yükle

```sh
go mod tidy
```

### Basit Bir Fonksiyonu Test Etme

Basit bir `main.go` oluşturmak hakkında bilgi edinmek için `genel bakışa` bakabilirsiniz.

Her şey doğru bir şekilde ayarlandıysa, kodunuz Greenfield düğümüne bağlanabilir ve yukarıda gösterildiği gibi zincir verilerini döndürebilir.

### Hesap Ayarı

```go
account, err := types.NewAccountFromPrivateKey("test", privateKey)
	if err != nil {
		log.Fatalf("Özel anahtardan yeni hesap oluşturma hatası, %v", err)
	}
	cli, err := client.New(chainId, rpcAddr, client.Option{DefaultAccount: account})
	if err != nil {
		log.Fatalf("Yeni greenfield istemcisi oluşturulamadı, %v", err)
	}
	ctx := context.Background()
```

---

## Kova Oluşturma

Şimdi, içe aktarılan hesapla bir kova oluşturalım.

Bu örnekte,

```go
	// depolama sağlayıcıları listesini al
	spLists, err := cli.ListStorageProviders(ctx, true)
	if err != nil {
		log.Fatalf("hizmetteki sp'leri listeleme başarısız oldu")
	}
	// ilk sp'yi birincil SP olarak seç
	primarySP := spLists[0].GetOperatorAddress()

	bucketName := storageTestUtil.GenRandomBucketName()

	txHash, err := cli.CreateBucket(ctx, bucketName, primarySP, types.CreateBucketOptions{})
	handleErr(err, "CreateBucket")
	log.Printf("kova %s SP'de: %s başarıyla oluşturuldu \n", bucketName, spLists[0].Endpoint)

	waitForTx, _ := cli.WaitForTx(ctx, txHash)
	log.Printf("Tx için bekleyin: %s", waitForTx.TxResult.String())
```

Örnek dönüş mesajı aşağıdaki gibi olacaktır:

```shell
2023/10/31 13:14:54 Kovayı ylatitsb olarak SP'de: https://gnfd-testnet-sp1.bnbchain.org başarıyla oluşturuldu
2023/10/31 13:14:54 Tx için bekleyin: data:"\0225\n+/greenfield.storage.MsgCreateBucketResponse\022\006\n\0043175\032\010\000\000\000\000\000\000\201\006" log:"[{\"msg_index\":0,\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/greenfield.storage.MsgCreateBucket\"},{\"key\":\"sender\",\"value\":\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"},{\"key\":\"module\",\"value\":\"storage\"}]},{\"type\":\"greenfield.storage.EventCreateBucket\",\"attributes\":[{\"key\":\"bucket_id\",\"value\":\"\\\"3175\\\"\"},{\"key\":\"bucket_name\",\"value\":\"\\\"ylatitsb\\\"\"},{\"key\":\"charged_read_quota\",\"value\":\"\\\"0\\\"\"},{\"key\":\"create_at\",\"value\":\"\\\"1698779691\\\"\"},{\"key\":\"global_virtual_group_family_id\",\"value\":\"40\"},{\"key\":\"owner\",\"value\":\"\\\"0x525482AB3922230e4D73079890dC905dCc3D37cd\\\"\"},{\"key\":\"payment_address\",\"value\":\"\\\"0x525482AB3922230e4D73079890dC905dCc3D37cd\\\"\"},{\"key\":\"primary_sp_id\",\"value\":\"1\"},{\"key\":\"source_type\",\"value\":\"\\\"SOURCE_TYPE_ORIGIN\\\"\"},{\"key\":\"status\",\"value\":\"\\\"BUCKET_STATUS_CREATED\\\"\"},{\"key\":\"visibility\",\"value\":\"\\\"VISIBILITY_TYPE_PRIVATE\\\"\"}]}]}]" gas_wanted:2400 gas_used:2400 events:<type:"coin_spent" attributes:<key:"spender" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true > attributes:<key:"amount" value:"12000000000000BNB" index:true > > events:<type:"coin_received" attributes:<key:"receiver" value:"0xf1829676DB577682E944fc3493d451B67Ff3E29F" index:true > attributes:<key:"amount" value:"12000000000000BNB" index:true > > events:<type:"transfer" attributes:<key:"recipient" value:"0xf1829676DB577682E944fc3493d451B67Ff3E29F" index:true > attributes:<key:"sender" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true > attributes:<key:"amount" value:"12000000000000BNB" index:true > > events:<type:"message" attributes:<key:"sender" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true > > events:<type:"tx" attributes:<key:"fee" value:"12000000000000BNB" index:true > attributes:<key:"fee_payer" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true > > events:<type:"tx" attributes:<key:"acc_seq" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd/70" index:true > > events:<type:"tx" attributes:<key:"signature" value:"aKL7wpB1b0107d1OleaHKKBw5mXUskggINbq7hsr90s6MzgV88DxjAGak37xz9V4LsoH0sr7saqBmBrE5MKJtgA=" index:true > > events:<type:"message" attributes:<key:"action" value:"/greenfield.storage.MsgCreateBucket" index:true > attributes:<key:"sender" value:"0x525482AB3922230e4D73079890dC905dCc3D37cd" index:true > attributes:<key:"module" value:"storage" index:true > > events:<type:"greenfield.storage.EventCreateBucket" attributes:<key:"bucket_id" value:"\"3175\"" index:true > attributes:<key:"bucket_name" value:"\"ylatitsb\"" index:true > attributes:<key:"charged_read_quota" value:"\"0\"" index:true > attributes:<key:"create_at" value:"\"1698779691\"" index:true > attributes:<key:"global_virtual_group_family_id" value:"40" index:true > attributes:<key:"owner" value:"\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"" index:true > attributes:<key:"payment_address" value:"\"0x525482AB3922230e4D73079890dC905dCc3D37cd\"" index:true > attributes:<key:"primary_sp_id" value:"1" index:true > attributes:<key:"source_type" value:"\"SOURCE_TYPE_ORIGIN\"" index:true > attributes:<key:"status" value:"\"BUCKET_STATUS_CREATED\"" index:true > attributes:<key:"visibility" value:"\"VISIBILITY_TYPE_PRIVATE\"" index:true > >
```

* `HeadBucket` fonksiyonu ile kovayı sorgulama

```go
	// başlık kova
	bucketInfo, err := cli.HeadBucket(ctx, bucketName)
	handleErr(err, "HeadBucket")
	log.Println("kova bilgisi:", bucketInfo.String())
```
Örnek dönüş mesajı aşağıdaki gibi olacaktır:

```shell
2023/10/31 13:14:54 kova bilgisi: owner:"0x525482AB3922230e4D73079890dC905dCc3D37cd" bucket_name:"ylatitsb" visibility:VISIBILITY_TYPE_PRIVATE id:"3175" create_at:1698779691 payment_address:"0x525482AB3922230e4D73079890dC905dCc3D37cd" global_virtual_group_family_id:40
```

---

## Grup Oluşturma

Sonraki adım, ana hesap tarafından `nesneyi alma` erişimini alacak bir grup oluşturmaktır.

```go
  // grup oluştur
  groupTx, err := cli.CreateGroup(ctx, groupName, types.CreateGroupOptions{})
  handleErr(err, "CreateGroup")
  _, err = cli.WaitForTx(ctx, groupTx)
  if err != nil {
    log.Fatalln("txn başarısız")
  }

  log.Printf("grup %s başarıyla oluşturuldu \n", groupName)

  // grup bilgilerini al
  creator, err := cli.GetDefaultAccount()
  handleErr(err, "GetDefaultAccount")
  groupInfo, err := cli.HeadGroup(ctx, groupName, creator.GetAddress().String())
  handleErr(err, "HeadGroup")
  log.Println("grup bilgileri:", groupInfo.String())

  _, err = sdk.AccAddressFromHexUnsafe(memberAddress)
  if err != nil {
    log.Fatalln("grup üyesi geçersiz")
  }
  // grup üyesi ekle
  updateTx, err := cli.UpdateGroupMember(ctx, groupName, creator.GetAddress().String(), []string{memberAddress}, []string{},
    types.UpdateGroupMemberOption{})
  handleErr(err, "UpdateGroupMember")
  _, err = cli.WaitForTx(ctx, updateTx)
  if err != nil {
    log.Fatalln("txn başarısız")
  }

  log.Printf("gruba üye ekle: %s grup: %s başarıyla \n", memberAddress, groupName)

  // grup üyesini başlık al
  memIsExist := cli.HeadGroupMember(ctx, groupName, creator.GetAddress().String(), memberAddress)
  if !memIsExist {
    log.Fatalf("grup üyesi başlığı alma %s başarısız \n", memberAddress)
  }

  log.Printf(" üye %s mevcut \n", memberAddress)
```

Sonuç aşağıdaki gibi görünmelidir:

```shell
2023/10/31 09:34:54 grup oluşturma örnek-grubu başarıyla
2023/10/31 09:34:54 grup bilgileri: owner:"0x525482AB3922230e4D73079890dC905dCc3D37cd" group_name:"örnek-grubu" id:"720"
2023/10/31 09:35:01 grup üyesi: 0x843e77D639b6C382e91ef489881963209cB238E5 gruba başarıyla eklendi: örnek-grubu
2023/10/31 09:35:01  üye 0x843e77D639b6C382e91ef489881963209cB238E5 mevcut
```

---

## Politika Oluşturma

Artık, ana hesap bu gruba `nesneyi alma` erişimi vermek için izin verebilir.

```go
// kova politikasını koy
	bucketActions := []permTypes.ActionType{
    	permTypes.ACTION_GET_OBJECT,
	}
	ctx := context.Background()
	statements := utils.NewStatement(bucketActions, permTypes.EFFECT_ALLOW, nil, types.NewStatementOptions{})

	policyTx, err := cli.PutBucketPolicy(ctx, bucketName, principalStr, []*permTypes.Statement{&statements},
		types.PutPolicyOption{})
	handleErr(err, "PutBucketPolicy")
	_, err = cli.WaitForTx(ctx, policyTx)
	if err != nil {
		log.Fatalln("txn başarısız")
	}
	log.Printf("kova %s politikası başarıyla konuldu, ilke: %s.\n", bucketName, principal)
```

Kodunuzu çalıştırdıktan sonra sonuç aşağıdaki gibi görünmelidir:

```shell
2023/10/31 10:46:55 kova sdkexamplebucket politikası başarıyla konuldu, ilke:
2023/10/31 10:46:55 kova: sdkexamplebucket politika bilgisi:id:"2358" principal:<type:PRINCIPAL_TYPE_GNFD_ACCOUNT value:"0x843e77D639b6C382e91ef489881963209cB238E5" > resource_type:RESOURCE_TYPE_BUCKET resource_id:"429" statements:<effect:EFFECT_ALLOW actions:ACTION_UPDATE_BUCKET_INFO actions:ACTION_DELETE_BUCKET actions:ACTION_DELETE_OBJECT actions:ACTION_GET_OBJECT >
```

Blok tarayıcısı kullanarak da inceleyebilirsiniz, örneğin: [https://greenfieldscan.com](https://greenfieldscan.com).

---

## Grubu BSC'ye Yansıtma

Greenfield'de, nesne yansıtma, BNB Greenfield'da depolanan nesneler üzerindeki kontrolün BNB Akıllı Zincir (BSC) üzerindeki bir akıllı sözleşmeye aktarılmasını ifade eder.

Bu, nesnenin BSC'de zincir üzerinde tamamen yönetilmesini sağlar; bu, kullanıcıların veya diğer akıllı sözleşmelerin çeşitli işlemleri gerçekleştirmelerini ve nesne üzerinde değişiklikler yapmalarını sağlar.

> **Uyarı:** BNB Greenfield'den BSC'ye yansıtma sürecinde, dosyanın kendisinin kopyalanmadığı anlamına gelir. Bu, BNB Greenfield blok zincirinde depolanan verilerin veya dosya meta verilerinin BSC'ye aktarılmadığı anlamına gelir.

```go
	// grup bilgileri
	groupInfo, err := cli.HeadGroup(ctx, groupName, creator.GetAddress().String())
  	handleErr(err, "HeadGroup")
  	log.Println("grup bilgileri:", groupInfo.String())

	// kova yansıtma
	txResp, err := cli.MirrorGroup(ctx, sdk.ChainID(crossChainDestBsChainId), groupInfo.Id, groupName, gnfdSdkTypes.TxOption{})
	handleErr(err, "MirrorGroup")
	waitForTx, _ = cli.WaitForTx(ctx, txResp.TxHash)
	log.Printf("Tx için bekleyin: %s", waitForTx.TxResult.String())
	log.Printf("başarıyla grup yansıtıldı id %s BSC'ye", groupInfo.Id)
```

```shell
2023/10/31 21:43:57 grup: sdkexamplegroup politika bilgisi:id:"712" principal:<type:PRINCIPAL_TYPE_GNFD_ACCOUNT value:"0x843e77D639b6C382e91ef489881963209cB238E5" > resource_type:RESOURCE_TYPE_BUCKET resource_id:"429" statements:<effect:EFFECT_ALLOW actions:ACTION_GET_OBJECT >
2023/10/31 21:43:57 kova bilgisi: owner:"0x525482AB3922230e4D73079890dC905dCc3D37cd" bucket_name:"ylatitsb" visibility:VISIBILITY_TYPE_PRIVATE id:"3175" create_at:1698779691 payment_address:"0x525482AB3922230e4D73079890dC905dCc3D37cd" global_virtual_group_family_id:40
```

Blok tarayıcısı kullanarak da inceleyebilirsiniz, örneğin: [https://greenfieldscan.com](https://greenfieldscan.com).

---

## BSC'deki Erişim Kontrol Yönetimi

Artık grubunuzu BSC'ye yansıttınız ve bir ERCC-721 tokenı çıkarıldı. Şu anda, NFT'ler taşınabilir değildir. Grup üyeliği BSC'deki akıllı sözleşmeler tarafından doğrudan yönetilebilir. Bu işlemler, [Greenfield Sözleşmesi](https://github.com/bnb-chain/greenfield-contracts/tree/master) yardımıyla verilerin depolama formatı, erişim izinleri ve diğer yönlerini doğrudan etkiler.

Öncelikle, bağımlılıkları yüklemeli ve çevreyi kurmalısınız; [kılavuzları](https://github.com/bnb-chain/greenfield-contracts/tree/master#requirement) takip edin.

Her şey hazır olduğunda, grubunuza üye eklemek için aşağıdaki betiği çalıştırabilirsiniz:

```
# özel anahtarınızı, operatör adresinizi, grup kimliğinizi ve ekleyeceğiniz üye adresini ayarlayın
forge script foundry-scripts/GroupHub.s.sol:GroupHubScript \
--private-key ${your private key} \
--sig "addMember(address operator, uint256 groupId, address member)" \
${the owner of the group} ${your group id} ${the member address to add} \
-f https://data-seed-prebsc-1-s1.binance.org:8545/ \
--legacy --ffi --broadcast
```

### Kaynak Kodu

- [Go-SDK](https://github.com/bnb-chain/greenfield-go-sdk/blob/master/examples/crosschain.go)
- [JS-SDK](https://github.com/bnb-chain/greenfield-js-sdk/blob/main/examples/nextjs/src/components/mirror/index.tsx)
- [Greenfield Sözleşme Örnekleri](https://github.com/bnb-chain/greenfield-contracts/tree/master/foundry-scripts/examples).