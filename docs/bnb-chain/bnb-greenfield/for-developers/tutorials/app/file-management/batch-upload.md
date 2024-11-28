---
title: Veri Kümesi Toplu İşlemleri - BNB Greenfield Dosya Yönetimi
description: Greenfield üzerindeki nesne yükleme süreçlerini ve toplu yükleme yöntemlerini keşfedin. Bu içerik, geçici hesapları nasıl kullanacağınızı ve paketleme hizmetlerini detaylandırır.
keywords: [Greenfield, toplu yükleme, geçici hesap, paket servisi, nesne yönetimi, BNB, dosya yönetimi]
---

# Greenfield'de toplu nesne yükleme nasıl çalışır?

`Greenfield`'de bir nesneyi bir depoya yüklemek iki aşamalı bir süreçtir. Öncelikle, nesne meta verilerini içeren bir işlemin Greenfield Zinciri'ne yayımlanması ve onaylanması gerekir. Onaylandıktan sonra, nesneyi bir Greenfield Depolama Sağlayıcısına PUT etmeniz gerekir. İlk aşamada, her işlemin **öncelikli anahtar** (aynı zamanda `hesap` olarak da bilinir, daha fazla ayrıntı için `hesaplar` bölümüne bakın) ile imzalanması gerekir. Ayrıca, eğer `Greenfield`'e bir ön uç uygulaması aracılığıyla ve Metamask gibi bir cüzdanla bağlanıyorsanız, işlemi imzalamak için onay istenecektir.

Büyük miktarlarda nesne yükleme ihtiyacıyla karşılaşan kişiler için, `Greenfield`'e sırayla nesne yüklemek zaman alıcı ve zahmetli bir süreç olabilir, çünkü cüzdanın işlem göndermek için sürekli olarak onaylanan pop-up taleplerini tekrar tekrar onaylamaları gerekir. :::tip Toplu yükleme, bu sorunu hızlı ve verimli bir çözüm ile çözebilir.

## Toplu Yüklemeyi Gerçekleştirmenin Yolları

Toplu yükleme amacını başarmak için iki yol sunacağız:

### Çoklu Mesaj.
`Greenfield`, tek bir işlemde birden fazla mesaj gömülü olarak desteklemektedir. Birden fazla `MsgCreateObject` mesajı içeren bir işlem oluşturabilir ve bunu Greenfield Zinciri'ne yayabilirsiniz. Nesne meta verileri zincirde onaylandığında, nesneleri Depolama Sağlayıcısına PUT etmeye başlayabilirsiniz. Ancak, lütfen bu yaklaşımın Greenfield'deki işlem boyutu sınırlamaları nedeniyle çok büyük partiler için uygun olmayabileceğini unutmayın.

### Geçici Hesap.
Çalışma zamanında geçici bir hesap oluşturarak, nesneleri birincil hesap adına oluşturmak için tam izinler verebiliriz. Bu yaklaşımda, birincil hesabınız yalnızca geçici hesaba izin vermek için Greenfield'e bir işlem göndermelidir. Yüklenecek her nesne için geçici hesap kullanılacak ve işlemi Greenfield Zinciri'ne yaymak için kullanılacaktır. Birincil hesabın daha fazla etkileşime ihtiyaç duymayacağını unutmayın. Ayrıca, geçici hesabın para yatırması gerekmez.

### Paket Servisi
Greenfield'de küçük dosyaları depolamak, blok zincirinde depolanan meta verilerin dosyalardan daha büyük olması nedeniyle verimsizdir. Bu, kullanıcılar için daha yüksek maliyetlere neden olur. Ayrıca, Greenfield Blockchain'inin dosyaları eşzamanlı olarak işleme kapasitesi sınırlıdır.

Bu sorunu çözmek için [BEP-323: Greenfield için Paket Formatı](https://github.com/bnb-chain/BEPs/pull/323) önerilmiştir. Bu depo, nesneleri bir pakette bir araya getirmek ve bir paketlenmiş nesneyi ayrı nesnelere ayırmak için kullanıcıları yönlendiren **Golang** sürümünü içermektedir.

## Geçici Hesap Vitrini

Geçici Hesap yaklaşımını kullanarak toplu yükleme sürecini göstermek için, `Greenfield-go-sdk` kullanarak bir örnek sağlanmıştır. Örnek, nesne depolama için bir depo oluşturma, geçici bir hesap oluşturma, geçici hesaba izinler verme ve nesne oluşturma ve PUT etme adımlarını içermektedir.

### Nesne depolamak için bir depo oluşturun.

Başlamadan önce, birincil hesap kullanarak nesneleri tutacak bir depo oluşturmamız gerekiyor. Bu, `Greenfield`'e bir işlem yayınlamayı gerektirir. Aşağıdaki kod, depo adını ve bizim depomuzu hizmet edecek seçili Depolama Sağlayıcısını doldurmak için `CreateBucket` isteğini nasıl yapılandıracağınızı gösterir. İşlem gönderildikten sonra, deponun varlığını kontrol ederek oluşturulup oluşturulmadığını doğrulamak isteyebilirsiniz.

```go
primaryAccount, _ := types.NewAccountFromPrivateKey("primaryAccount", privateKey)
cli, _ := client.New(chainId, rpcAddr, client.Option{DefaultAccount: primaryAccount})
ctx := context.Background()
// depolama sağlayıcıları listesi al
isInService := true
spLists, _ := cli.ListStorageProviders(ctx, isInService)
// ilk depolama sağlayıcısını birincil SP olarak seçin, başka bir tane seçmekte özgürsünüz
primarySP := spLists[0].GetOperatorAddress()
// Greenfield'e bir depo oluşturma isteği gönderir.
cli.CreateBucket(ctx, "yourBucketName", primarySP, types.CreateBucketOptions{})
// onay bekleyin
time.Sleep(3 * time.Second)
// Greenfield'den depo meta verisi alın
bucketInfo, _ := cli.HeadBucket(ctx, "yourBucketName")
```

### Geçici hesap oluşturma

Depo oluşturulduktan sonra, geçici hesabı oluşturmaya başlayabiliriz. Bir özel anahtar, 32 byte olarak temsil edilen 64 onaltılık karakter dizisidir. Geçici anahtar oluşturmak için rastgele 64 onaltılık karakter dizisi oluşturabiliriz. Ancak, bu durumda onu kurtaramayız ve gelecekte yeniden kullanamayız. Bu nedenle, özel anahtar oluşturmak için tasarlanmış bir yük kullanmak daha tercih edilmektedir. Aşağıdaki kod bölümünde, bir `signPayload`'ı "payload" dizesi ve hesap sırası ile birleştiriyoruz. Daha sonra, geçici özel anahtarı oluşturmak için birincil hesabımız tarafından imzalanan imzayı kullanıyoruz. `signPayload`, bir şifre gibi çalışır. `signPayload`'da yapılan herhangi bir manipülasyon, imzayı oluşturmak için uygulanırsa, `signPayload`'ı hatırladığımız sürece aynı manipülasyonu tekrar uygulayarak özel anahtarı her zaman alabiliriz. Burada gösterilen örnek, imzayı almak ve yeni geçici özel anahtar için kullanmak için sadece bir yoldur, ancak başka bir algoritmayı da kullanmakta özgürsünüz.

```go
// kullanıcıların kendi özel anahtarlarıyla imzalanan yük üzerindeki geçici hesabı oluşturma
signPayload := fmt.Sprintf("payload%d", primaryAccount.GetSequence())
tempAcct, _ := genTemporaryAccount(primaryAccount, signPayload)
tempAcctAddr, _ := tempAcct.GetAddress().Marshal()
```
```go
// genTemporaryAccount, geçici bir hesap oluşturur; signPayload, kullanıcının kendi özel anahtarı (Birincil hesap) tarafından imzalanacak ve imza, geçici hesabın özel anahtarını oluşturmak için kullanılacaktır.
// Kullanıcı, signPayload ile hesap tekrar dönüştürebilir
func genTemporaryAccount(acct *types.Account, signPayload string) (*types.Account, error) {
    signBz := []byte(signPayload)
    sig, err := acct.Sign(tmhash.Sum(signBz))
    if err != nil {
        return nil, err
    }
    if len(sig) < privateKeyLength {
        return nil, fmt.Errorf("gerekli imza uzunluğu en az %d olmalıdır, mevcut uzunluk %d", privateKeyLength, len(sig))
    }
    return types.NewAccountFromPrivateKey("temp", hex.EncodeToString(sig[:privateKeyLength]))
}
```

### Geçici hesap izinlerinin verilmesi

Geçici hesaba nesne oluşturma izni vermek için iki tür izin gereklidir. Her ikisi de birincil hesap tarafından verilmelidir:
- **Ana hesabın** deposunda nesne oluşturma iznini verin. `Politika`, bir hesabın veya bir grubun bir kaynak üzerindeki işlemi uygulamaya koyabileceğini tanımlar. Daha fazla ayrıntı için [izinler](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/permission.md) bölümüne başvurun.
- Gaz ücretinin birincil hesaptan kesilmesi için bir izin verin ve birincil hesap nesnelerin sahibi olacaktır.

Yine, bu iki tür vergi verme mesajını içeren işlemi `Greenfield`'e yaymamız gerekecektir.

```go
// Geçici hesabın birincil hesabın deposunda nesne oluşturmasına izin verin
statement := &permTypes.Statement{
    Actions: []permTypes.ActionType{permTypes.ACTION_CREATE_OBJECT},
    Effect:  permTypes.EFFECT_ALLOW,
}
msgPutPolicy := storageTypes.NewMsgPutPolicy(primaryAccount.GetAddress(), gnfdTypes.NewBucketGRN("yourBucketName").String(), 
	permTypes.NewPrincipalWithAccount(tempAcct.GetAddress()), []*permTypes.Statement{statement}, nil)

// Geçici hesaba beklenen işlem türünü yaymak için izin verin
allowedMsg := make([]string, 0)
allowedMsg = append(allowedMsg, "/greenfield.storage.MsgCreateObject")
allowance, _ := feegrant.NewAllowedMsgAllowance(&feegrant.BasicAllowance{}, allowedMsg)
msgGrantAllowance, _ := feegrant.NewMsgGrantAllowance(allowance, primaryAccount.GetAddress(), tempAcct.GetAddress())

// İşlemi Greenfield'e yayınlayın
cli.BroadcastTx(ctx, []sdk.Msg{msgGrantAllowance, msgPutPolicy}, types.TxOption{})

// Bir blok bekleyin ve izinlerin verildiğini onaylayın
```

### Nesne meta verisini oluşturma ve nesneyi koyma

Son olarak, geçici hesap kullanarak nesne meta verisini oluşturabilir ve nesneyi yerleştirebilirsiniz:
```go
// Geçici hesabı kullanmaya geçin
cli.SetDefaultAccount(tempAcct)
// Ana hesabı verici olarak tanımlayın
txOpt := types.TxOption{FeeGranter: primaryAccount.GetAddress()}
// nesne içeriğini oluştur
var buffer bytes.Buffer
line := `0123456789`
for i := 0; i < 100; i++ {
    buffer.WriteString(fmt.Sprintf("%s", line))
}
// Greenfield Zincirinde nesne meta oluşturun
cli.CreateObject(ctx, "yourBucketName", "yourObjectName", bytes.NewReader(buffer.Bytes()), types.CreateObjectOptions{TxOpts: &txOpt})
// Bir blok bekleyin, meta zincirdə oluşturulduğunda, nesneyi Greenfield Depolama Sağlayıcısına yükleyin
time.Sleep(3 * time.Second)
// Nesneyi Greenfield Depolama Sağlayıcısına yükleyin
cli.PutObject(ctx, "yourBucketName", "yourObjectName", int64(buffer.Len()), bytes.NewReader(buffer.Bytes()), types.PutObjectOptions{})
```

## Paket Servisi Örneği
Toplu nesneleri bir paket olarak nasıl toplayacağınız ve paketlenmiş bir nesneyi nasıl ayıracağınız için bir kılavuz burada bulunmaktadır. Greenfield ile etkileşimde bulunmak için [Greenfield GO SDK](https://github.com/bnb-chain/greenfield-go-sdk) referansına bakmalısınız.

### Çeşitli nesneleri paket olarak bir araya getirin
Bir pakette birden fazla nesneyi bir araya getirmek için aşağıdaki adımları izleyin.

1. `NewBundle` fonksiyonunu kullanarak boş bir paket oluşturun.

```go
// yukarıdaki iki nesneyi bir paket nesnesine birleştir
    bundle, err := bundle.NewBundle()
    handleErr(err, "NewBundle")
```

2. Paketin `AppendObject` yöntemini kullanarak nesneleri pakete ayrı ayrı ekleyin.
```go
    _, err = bundle.AppendObject("object1", bytes.NewReader(buffer1.Bytes()), nil)
    handleErr(err, "AppendObject")
    _, err = bundle.AppendObject("object2", bytes.NewReader(buffer2.Bytes()), nil)
    handleErr(err, "AppendObject")
```

3. Paketin `FinalizeBundle` yöntemini kullanarak paketi mühürleyin, böylece başka nesnelerin eklenmesi engellenecektir.
```go
    bundledObject, totalSize, err := bundle.FinalizeBundle()
    handleErr(err, "FinalizeBundle")
```

4. Kullanım sonrası kaynakları serbest bırakmak için paketin Close yöntemini kullanın.
```go
 defer bundle.Close()
```

Tam örnek [burada](https://github.com/bnb-chain/greenfield-bundle-sdk/blob/master/examples/upload_bundle.go)

### Paketlenmiş nesneden nesneleri çıkarın
Bir paketten çeşitli nesneleri çıkarmak için aşağıdaki adımları izleyin.

1. Paketlenmiş nesneyi `NewBundleFromFile` kullanarak bir paket örneği olarak açın.
```go
// Paketlenmiş nesneden nesneleri çıkar
    bundle, err := bundle.NewBundleFromFile(bundleFile.Name())
    handleErr(err, "NewBundleFromFile")
```
2. Paketin `GetBundleObjectsMeta` yöntemini kullanarak paketteki tüm nesnelerin meta verilerini alın.
```go
// Paketlenmiş nesneden nesneleri çıkar
    objMeta, err := bundle.GetBundleObjectsMeta(bundleFile.Name())
    handleErr(err, "GetBundleObjectsMeta")
```
3. Paketin `GetObject` yöntemini kullanarak çeşitli nesnelere birer birer erişin.
```go
    obj1, size, err := bundle.GetObject("object1")
    if err != nil || obj1 == nil || size != singleObjectSize {
        handleErr(fmt.Errorf("paketlenmiş nesne içinde object1'i çözme hatası: %v", err), "GetObject")
    }
    obj2, size, err := bundle.GetObject("object2")
    if err != nil || obj2 == nil || size != singleObjectSize {
        handleErr(fmt.Errorf("paketlenmiş nesne içinde object2'yi çözme hatası: %v", err), "GetObject")
    }
```

4. Kullanım sonrası kaynakları serbest bırakmak için paketin Close yöntemini kullanın.
```go
 defer bundle.Close()
```

Tam örnek [burada](https://github.com/bnb-chain/greenfield-bundle-sdk/blob/master/examples/download_bundle.go)