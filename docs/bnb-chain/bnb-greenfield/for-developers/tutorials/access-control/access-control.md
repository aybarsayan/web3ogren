---
title: Yerel Erişim Kontrolü - BNB Greenfield Erişim Kontrolü
description: Kova ve nesne izinlerinizi yönetmek için Greenfield Go-SDK kütüphanesini nasıl kullanacağınız. Bu eğitim, erişim kontrolü özellikleri ile uygulama kurulumunu detaylandırmaktadır.
keywords: [BNB Greenfield, Erişim kontrolü, İzin, Go-SDK, Kova yönetimi]
order: 2
---

# Yerel Erişim Kontrolü

Bu eğitimde, **kova** ve **nesnelerinizi** yönetmek için go-SDK kütüphanesini kullanacağız.

## Ön Gereksinimler
Başlamadan önce, aşağıdakilerle tanışık olmalısınız:

* `Greenfield temelleri`
* Greenfield komut satırı [örnekleri](https://github.com/bnb-chain/greenfield-cmd#examples)

## Erişim Kontrolü Özellikleri

| **Anahtar**     | **Etkisi** | **Eylemler**                                                 | **Kaynaklar** | **Süre** |
| ---------------- | ----------- | ----------------------------------------------------------- | ------------- | --------- |
| Hesaplar/Grup    | İzin Ver/Düşün | UpdateBucketInfo, DeleteBucket, vb                      | Kova         |           |
| Hesaplar/Grup    | İzin Ver/Düşün | CreateObject, DeleteObject, CopyObject, GetObject, ExecuteObject, vb | Nesne        |           |
| Hesaplar/Grup    | İzin Ver/Düşün | UpdateGroupMember, DeleteGroup, vb                       | Grup         |           |

---

## Kurulum
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

:::tip
Bağımlılıkları değiştirmek için go.mod dosyasını düzenleyin.
:::

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
### Bağımlılıkları Kur
```sh
go mod tidy
```

### Basit bir fonksiyonu test et

Basit bir `main.go` oluşturmak için `genel bakış` referans alabilirsiniz.

Her şey doğru bir şekilde ayarlanmışsa, kodunuz Greenfield düğümüne bağlanabilecek ve yukarıda gösterilen zincir verilerini döndürebilecektir.

---

## Hesap Kurulumu

İki hesap hazırlamanız gerekiyor; biri `anahtar` olur, bu bir yönetici gibi hareket eder ve diğeri ise nesneleri görüntülemek/güncellemek için erişim alacak bir üyedir.

```go
	account, err := types.NewAccountFromPrivateKey("test", privateKey)
	if err != nil {
		log.Fatalf("Özel anahtardan yeni hesap oluşturma hatası, %v", err)
	}
	cli, err := client.New(chainId, rpcAddr, client.Option{DefaultAccount: account})
	if err != nil {
		log.Fatalf("Yeni greenfield istemcisi oluşturulamadı, %v", err)
	}
```

## Grup Oluşturma
Sonraki adım, anahtar hesabından erişim alacak bir grup oluşturmaktır.

```go
  // grup oluştur
  groupTx, err := cli.CreateGroup(ctx, groupName, types.CreateGroupOptions{})
  handleErr(err, "CreateGroup")
  _, err = cli.WaitForTx(ctx, groupTx)
  if err != nil {
    log.Fatalln("işlem başarısız")
  }

  log.Printf("grup %s başarıyla oluşturuldu \n", groupName)

  // grup bilgilerini görüntüle
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
    log.Fatalln("işlem başarısız")
  }

  log.Printf("grup üyesi: %s başarıyla gruba eklendi: %s \n", memberAddress, groupName)

  // grup üyesini kontrol et
  memIsExist := cli.HeadGroupMember(ctx, groupName, creator.GetAddress().String(), memberAddress)
  if !memIsExist {
    log.Fatalf("grup üyesi %s kontrolünde başarısız \n", memberAddress)
  }

  log.Printf(" grup üyesi %s mevcut \n", memberAddress)
```

Sonuç, aşağıdaki gibi bir şey olacak:
```shell
2023/10/31 09:34:54 grup oluşturma başarılı sample-group
2023/10/31 09:34:54 grup bilgileri: owner:"0x525482AB3922230e4D73079890dC905dCc3D37cd" group_name:"sample-group" id:"720"
2023/10/31 09:35:01 grup üyesi: 0x843e77D639b6C382e91ef489881963209cB238E5 gruba başarıyla eklendi: sample-group
2023/10/31 09:35:01  grup üyesi 0x843e77D639b6C382e91ef489881963209cB238E5 mevcut
```

---

## Politika Oluşturma
Artık anahtar hesabının bu gruba `kova sil`, `kova güncelle`, `nesne sil`, `nesne güncelle` erişimi vermesine izin verebilirsiniz.
```go
// kova politikası belirle
	bucketActions := []permTypes.ActionType{
		permTypes.ACTION_UPDATE_BUCKET_INFO,
		permTypes.ACTION_DELETE_BUCKET,
		permTypes.ACTION_DELETE_OBJECT,
    	permTypes.ACTION_GET_OBJECT,
	}
	ctx := context.Background()
	statements := utils.NewStatement(bucketActions, permTypes.EFFECT_ALLOW, nil, types.NewStatementOptions{})

	policyTx, err := cli.PutBucketPolicy(ctx, bucketName, principalStr, []*permTypes.Statement{&statements},
		types.PutPolicyOption{})
	handleErr(err, "PutBucketPolicy")
	_, err = cli.WaitForTx(ctx, policyTx)
	if err != nil {
		log.Fatalln("işlem başarısız")
	}
	log.Printf("kova %s politikası başarıyla belirlendi, anahtar: %s.\n", bucketName, principal)
```

Kod çalıştırıldıktan sonra sonuç aşağıdaki gibi bir şey olacak:

```shell
2023/10/31 10:46:55 kova sdkexamplebucket politikası başarıyla belirlendi, anahtar:
2023/10/31 10:46:55 kova: sdkexamplebucket politika bilgisi:id:"2358" principal:<type:PRINCIPAL_TYPE_GNFD_ACCOUNT value:"0x843e77D639b6C382e91ef489881963209cB238E5" > resource_type:RESOURCE_TYPE_BUCKET resource_id:"429" statements:<effect:EFFECT_ALLOW actions:ACTION_UPDATE_BUCKET_INFO actions:ACTION_DELETE_BUCKET actions:ACTION_DELETE_OBJECT actions:ACTION_GET_OBJECT >
```

Ayrıca blok tarayıcıyı kullanarak da inceleyebilirsiniz, örneğin [https://greenfieldscan.com](https://greenfieldscan.com/).

### Politika Doğrulama
İşte politika meta verilerini zincir üzerinde doğrulamak için bir örnek:
```go
// kova politikası al
  policyInfo, err := cli.GetBucketPolicy(ctx, bucketName, memberAddress)
  handleErr(err, "GetBucketPolicy")
  log.Printf("kova: %s politika bilgisi:%s\n", bucketName, policyInfo.String())

  // izinleri doğrula
  effect, err := cli.IsBucketPermissionAllowed(ctx, memberAddress, bucketName, permTypes.ACTION_DELETE_BUCKET)
  handleErr(err, "IsBucketPermissionAllowed")

  if effect != permTypes.EFFECT_ALLOW {
    log.Fatalln("izin verilmedi: ", principalStr)
  }
```

Politika beklendiği gibi kaydedildiyse, herhangi bir hata görmeyeceksiniz.

## Politika Silme
İşte kova politikanızı silmek için bir örnek.

`principalStr`, `NewPrincipalWithAccount` veya `NewPrincipalWithGroupId` yöntemiyle oluşturulabilir.

```go
	// kova politikasını sil
	policyTx, err = cli.DeleteBucketPolicy(ctx, bucketName, principalStr, types.DeletePolicyOption{})
	handleErr(err, "DeleteBucketPolicy")
	_, err = cli.WaitForTx(ctx, policyTx)
	if err != nil {
		log.Fatalln("işlem başarısız")
	}
```

### Kaynak Kodu
* [Go-SDK](https://github.com/bnb-chain/greenfield-go-sdk/blob/master/examples/permission.go)
* [JS-SDK](https://github.com/bnb-chain/greenfield-js-sdk/blob/main/examples/nodejs/cases/policy.js)