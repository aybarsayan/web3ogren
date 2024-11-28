---
description: BNB Greenfield, veri mülkiyeti ve yönetimini merkezsizleştirmeyi amaçlayan blockchain tabanlı merkeziyetsiz bir depolama çözümüdür; kullanıcıların kendi verilerini ve varlıklarını yönetmelerine olanak tanır.
keywords: [Greenfield, BNB, S3, veri yönetimi, blockchain, merkeziyetsiz depolama]
---

# S3'ten Greenfield'e geçiş

## Giriş

Greenfield, **veri mülkiyeti** ve yönetiminin merkezsizleştirilmesine yardımcı olmak için tasarlanmış **blockchain tabanlı merkeziyetsiz bir depolama çözümü**dür ve kullanıcıların kendi verilerini ve varlıklarını yönetmelerine olanak tanır. Bu platform, kullanıcıların verilerinin güvenliğini ve yönetim yeteneklerini artırırken, izin yönetimi için on-chain veri izinleri ve Web2 benzeri API'ler sunarak merkeziyetsiz uygulamaların (dApp'ler) geliştirilmesini teşvik eder. Ayrıca, kimlik doğrulama ve depolama hizmetlerini sağlamakla sorumlu olan **Depolama Sağlayıcıları (SP)** aracılığıyla verilerin güvenliğini ve yönetim yeteneklerini artırır.

:::info
İzin yönetimi açısından, SP'ler çeşitli kimlik doğrulama hizmetleri sunar. AWS S3'ün kullanıcı izinlerini AWS Anahtarları ve AWS Sırları aracılığıyla kontrol etmesinin aksine, Greenfield’deki SP'ler izin kontrolü için özel anahtarlar kullanır.
:::

> Greenfield platformunda, izin kimlik doğrulamasının blockchain teknolojisine dayandığı anlamına gelir ve güvenliğin ve merkezsizliğin sağlanmasını temin ederken, izin kimlik doğrulaması ve veri depolama işlevsellikleri dahil olmak üzere blockchain işlevselliklerini genişletir.  
> — Greenfield Geliştirme Ekibi

Greenfield tasarımında, kullanıcıların İlk SP olarak herhangi bir SP'yi seçme özgürlüğü yanı sıra Ek SP'ler olarak da ek SP'ler seçme olanağı vardır; bu, nesne depolama açısından hem performans hem de güvenilirlik sağlar. Birincil SP'ler, bir nesnenin tüm veri segmentlerini saklamakla ve kullanıcı okuma veya indirme taleplerine doğrudan yanıt vermekle esasen sorumludur. İkincil SP'ler ise Erasure Coding (EC) teknolojisi tarafından üretilen veri bloklarını depolarak veri mevcudiyetini artırmaya yardımcı olurlar.

---

AWS S3 ile karşılaştırıldığında, Greenfield’in dağıtılmış depolama yapısı yalnızca veri dayanıklılığını ve kurtarılabilirliğini artırmakla kalmaz, aynı zamanda blockchain teknolojisi kullanarak veri bütünlüğü ve doğrulanabilirliği sağlar. Bu yaklaşım aracılığıyla, Greenfield yeni bir veri ekonomisini ve dApp modeli inşasını teşvik etmeye kararlıdır; veri yönetiminde şeffaflığı ve verimliliği artırmayı ve blockchain teknolojisi aracılığıyla veri merkeziyetsiz yönetimi ve mülkiyet kanıtını gerçekleştirmeyi amaçlar.

:::tip
Şimdi Greenfield ve AWS S3 üzerinden SDK'yı göstereceğiz.
:::

## SDK istemcisini başlat

**S3**

```go
const (
    AWSKey          = "mock-aws-key"
    AWSSecret       = "mock-aws-secret"
    Region          = "us-east-1"
)

cfg, err := config.LoadDefaultConfig(context.TODO(),
    config.WithRegion(Region),
    config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(AWSKey, AWSSecret, "")),
)
handleErr(err, "LoadDefaultConfig")
client := s3.NewFromConfig(cfg)
```

AWS S3 için, başlatma AWS Anahtarı ve AWS Sırrı kullanılarak bir AWS S3 istemcisi oluşturur ve kullanıcı etkileşimine izin verir. `Region`, kullanıcının dökümantasyonunun bulunduğu bölgeyi belirtir.

**Greenfield**

```go
const (
    RpcAddr         = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443" // Greenfield Testnet RPC Adresi
    ChainId         = "greenfield_5600-1" // Greenfield Testnet Zincir ID'si
    PrivateKey      = "mock-private-key"
)
client, primarySP, err := NewFromConfig(ChainId, RpcAddr, PrivateKey)
handleErr(err, "NewFromConfig")
```

Greenfield için, RPC Adresi ve Zincir ID'si belirli bir Greenfield ağını seçmek için kullanılır; yukarıdaki örnek Testnet içindir. Kullanıcılar, cüzdanlarından dışa aktarılan bir özel anahtar kullanarak etkileşime girmelidirler.

> Greenfield Ana Ağ Zincir ID'si: greenfield_1017-1  
> Greenfield Ana Ağ RPC  
> https://greenfield-chain.bnbchain.org:443  
> https://greenfield-chain-ap.bnbchain.org:443  
> https://greenfield-chain-eu.bnbchain.org:443  
> https://greenfield-chain-us.bnbchain.org:443  

## Kova oluştur

**S3**

```go
const (
    BucketName      = "mock-bucket-name"
)

_, err = client.CreateBucket(context.TODO(), &s3.CreateBucketInput{
    Bucket: aws.String(BucketName),
})
handleErr(err, "CreateBucket")
```

AWS S3'te, `CreateBucket` metodu kova adını belirten bir yapılandırma nesnesi ile çağrılır. Bu işlem, S3'ün bulut depolama odaklı yaklaşımını yansıtarak, bulut üzerinde depolama kapsayıcılarının oluşturulması ve yönetimi ile ilgili birinci dereceden önem taşır.

**Greenfield**

```go
const (
    BucketName      = "mock-bucket-name"
)

_, err = client.CreateBucket(context.TODO(), BucketName, primarySP, types.CreateBucketOptions{})
handleErr(err, "CreateBucket")
```

Greenfield için, `CreateBucket` metodu da bir kova adı gerektirir, ancak `primarySP` gibi ek parametreler içerir; bu da istemci başlatma sırasında elde edilir. `primarySP`, ilgili kova verilerini yürütmek ve depolamak için kritik bir rol oynamaktadır ve bu, Greenfield'in blockchain tabanlı doğası nedeniyle daha karmaşık bir etkileşim modeli olduğunu göstermektedir.

## Kovaları listele

**S3**

```go
const (
    BucketName      = "mock-bucket-name"
)

bucketsList, err := client.ListBuckets(context.TODO(), &s3.ListBucketsInput{})
handleErr(err, "ListBuckets")
for _, bucket := range bucketsList.Buckets {
    fmt.Printf("* %s\n", aws.ToString(bucket.Name))
}
```

**Greenfield**

```go
const (
    BucketName      = "mock-bucket-name"
)

bucketsList, err := client.ListBuckets(context.TODO(), types.ListBucketsOptions{})
handleErr(err, "ListBuckets")
for _, bucket := range bucketsList.Buckets {
    fmt.Printf("* %s\n", bucket.BucketInfo.BucketName)
}
```

Her iki sistem için istemci başlatıldığında, kullanıcı bilgileri zaten elde edilmiştir ve bu, bir `User` nesnesi aracılığıyla ilgili kovaların geri dönmesini sağlar. Bu süreç, AWS S3'ten Greenfield'e geçişin minimum çaba ve maliyetle gerçekleştirilebileceğini göstermektedir.

## Kova sil

**S3**

```go
const (
    BucketName      = "mock-bucket-name"
)

_, err = client.DeleteBucket(context.TODO(), &s3.DeleteBucketInput{
    Bucket: aws.String(BucketName),
})
handleErr(err, "Delete Bucket")
```

**Greenfield**

```go
const (
    BucketName      = "mock-bucket-name"
)

_, err = cli.DeleteBucket(context.TODO(), BucketName, types.DeleteBucketOption{})
handleErr(err, "Delete Bucket")
```

AWS S3 ve Greenfield'de bir kovayı silme işlemi temelde aynıdır; kullanıcıların yalnızca kova adını kullanarak kolayca bir kovayı silmelerine olanak tanır.

## Nesne oluştur

**S3**

```go
const (
    BucketName      = "mock-bucket-name"
    ObjectKey       = "test-api.js"
)

_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
    Bucket: aws.String(BucketName),
    Key:    aws.String(ObjectKey),
    Body:   file,
})
handleErr(err, "PutObject")
```

**Greenfield**

```go
const (
    BucketName      = "mock-bucket-name"
    ObjectKey       = "test-api.js"
)

txnHash, err := cli.CreateObject(context.TODO(), BucketName, ObjectKey, file, types.CreateObjectOptions{})
handleErr(err, "CreateObject")

err = cli.PutObject(context.TODO(), BucketName, ObjectKey, int64(fileInfo.Size()),
file, types.PutObjectOptions{TxnHash: txnHash})
handleErr(err, "PutObject")
```

Nesne oluşturma sürecinde, Greenfield ile S3 arasında bir fark vardır. Greenfield'de, nesneyi koymadan önce nesneyi önce oluşturmak gereklidir. Bu, Greenfield’in kullanıcıların nesnenin bütünlüğünü güvence altına almak için blockchain üzerindeki meta verileri oluşturmasını gerektiği anlamına gelir.

## Nesneleri listele

**S3**

```go
const (
    BucketName      = "mock-bucket-name"
)

objects, err := client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
    Bucket: aws.String(BucketName),
})
handleErr(err, "ListObjectsV2")
for _, item := range objects.Contents {
    fmt.Printf("* %s\n", aws.ToString(item.Key))
}
```

**Greenfield**

```go
const (
    BucketName      = "mock-bucket-name"
)

objects, err := cli.ListObjects(context.TODO(), BucketName, types.ListObjectsOptions{})
handleErr(err, "ListObjects")
for _, obj := range objects.Objects {
    log.Printf("* %s\n", obj.ObjectInfo.ObjectName)
}
```

Her iki sistemde de, bir kovadaki tüm nesneleri almak oldukça kolay bir şekilde kovanın adını kullanarak sağlanabilir. Bu işlevsellik, kullanıcıların karmaşık sorgu parametreleri veya yapılandırmalar gerekmeden depolama içeriklerini verimli bir şekilde erişip yönetmelerine olanak tanıyan kullanıcı dostu bir yaklaşımı göstermektedir.

## Nesne sil

**S3**

```go
const (
    BucketName      = "mock-bucket-name"
    ObjectKey       = "test-api.js"
)

_, err = client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
    Bucket: aws.String(BucketName),
    Key:    aws.String(ObjectKey),
})
handleErr(err, "Delete Object")
```

**Greenfield**

```go
const (
    BucketName      = "mock-bucket-name"
    ObjectKey       = "test-api.js"
)

_, err = cli.DeleteObject(context.TODO(), BucketName, ObjectKey, types.DeleteObjectOption{})
handleErr(err, "Delete Object")
```

AWS S3 ve Greenfield'de bir nesneyi silme işlemi temel olarak benzer olup, kullanıcıların kova adı ve nesne adı belirterek nesneyi zahmetsizce kaldırabilmelerini sağlar.

## Nesne al

**S3**

```go
const (
    BucketName      = "mock-bucket-name"
    ObjectKey       = "test-api.js"
)

resp, err := client.GetObject(context.TODO(), &s3.GetObjectInput{
    Bucket: aws.String(BucketName),
    Key:    aws.String(ObjectKey),
})
handleErr(err, "GetObject")
```

**Greenfield**

```go
const (
    BucketName      = "mock-bucket-name"
    ObjectKey       = "test-api.js"
)

resp, _, err := cli.GetObject(context.TODO(), BucketName, ObjectKey, types.GetObjectOptions{})
handleErr(err, "GetObject")
```

## Özet

AWS S3 ve Greenfield, kullanıcıların verimli erişim için kova ve nesne adlarını belirttiği, düzene sokulmuş veri alma süreçleri sunar. AWS S3, veri yerelliği ve erişim verimliliği için anahtar çiftleri ile kimlik doğrulama ve bölge belirtimine dayanırken, Greenfield, kimlik doğrulaması için özel anahtarlar ve ağ bağlantısı için RPC Adresleri ile Zincir ID'leri kullanan **blockchain tabanlı** bir yaklaşımı benimsemektedir. Greenfield, kullanıcıların lokasyonlarına bağlı olarak en verimli bağlantıyı seçmelerine olanak tanıyarak hizmet kalitesini artırmaktadır.

:::warning
Kova oluşturma gibi işlemler için SDK’lar arasındaki yapısal benzerlik dikkat çekicidir; Greenfield ayrıca istemci başlatma sırasında bir primarySP elde etmek için ek bir adım gerektirir. 
:::

Bu minimum fark, S3 kullanıcılarının Greenfield’e geçişinin sorunsuz olabileceğini ortaya koymakta; tanıdık SDK kod yapıları ve meta veri yönetimi sayesinde uyum sağlamanın kolaylığı vurgulanmaktadır. Ayrıca, Greenfield, S3'ün daha basit yaklaşımından daha fazla nesne yaşam döngüsü durumunu kontrol etme olanağı tanıyan iki aşamalı bir nesne yönetim süreci sunar. Ancak, temel işlevsellikler benzer kalmaktadır ve S3 kullanıcılarının Greenfield ortamına hızlıca uyum sağlamalarını sağlamak için önem taşımaktadır.

Genel olarak, AWS S3'ten Greenfield'e geçiş, benzer SDK kod uygulamaları ve meta veri yönetim yaklaşımları sayesinde, S3 ile tanıdık kullanıcıların Greenfield’in blockchain tabanlı depolama çözümüne minimum öğrenim eğrisi ile geçiş yapabilmesini kolaylaştırmaktadır. Bu uyum, mevcut bulut depolama bilgilerini kullanarak blockchain teknolojisinin ayrıntılarına geçiş yaparken, pürüzsüz bir adaptasyon potansiyelini vurgulamaktadır.

## Ekli kod

### Greenfield Entegrasyonuna Örnek

```go
package main

import (
    "bytes"
    "context"
    "fmt"
    "io"
    "log"
    "os"
    "time"

    "github.com/bnb-chain/greenfield-go-sdk/client"
    "github.com/bnb-chain/greenfield-go-sdk/types"
)

// Yapılandırma bilgileri greenfield testnet ile tutarlıdır
// Temel örneklerin iyi çalışması için privateKey, bucketName, objectName ve groupName ayarlamanız gerekmektedir
const (
    RpcAddr         = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
    ChainId         = "greenfield_5600-1"
    PrivateKey      = "mock-private-key"
    BucketName      = "mock-bucket-name"
    ObjectKey       = "api.js"
    UploadObjectKey = "test-api.js"
    DownloadPath    = "/Users/Desktop/s3test/"
    UploadPath      = "/Users/Desktop/s3test/"
)

func main() {
    cli, primarySP, err := NewFromConfig(ChainId, RpcAddr, PrivateKey)
    handleErr(err, "NewFromConfig")

    // kova oluştur
    _, err = cli.CreateBucket(context.TODO(), BucketName, primarySP, types.CreateBucketOptions{})
    handleErr(err, "CreateBucket")

    // kovaları listele
    bucketsList, err := cli.ListBuckets(context.TODO(), types.ListBucketsOptions{
        ShowRemovedBucket: false,
    })
    handleErr(err, "ListBuckets")
    for _, bucket := range bucketsList.Buckets {
        fmt.Printf("* %s\n", bucket.BucketInfo.BucketName)
    }

    // nesne oluştur
    file, err := os.Open(UploadPath + UploadObjectKey)
    handleErr(err, "PutObject")
    defer file.Close()

    fileInfo, err := file.Stat()
    handleErr(err, "Stat")

    // nesne oluştur
    txnHash, err := cli.CreateObject(context.TODO(), BucketName, UploadObjectKey, file, types.CreateObjectOptions{})
    handleErr(err, "CreateObject")

    var buf bytes.Buffer
    _, err = io.Copy(&buf, file)

    // nesneyi koy
    err = cli.PutObject(context.TODO(), BucketName, UploadObjectKey, int64(fileInfo.Size()),
    file, types.PutObjectOptions{TxnHash: txnHash})
    handleErr(err, "PutObject")

    // nesnenin başarıyla yüklendiğini bekleyin
    time.Sleep(10 * time.Second)

    // nesneleri listele
    objects, err := cli.ListObjects(context.TODO(), BucketName, types.ListObjectsOptions{
        ShowRemovedObject: false, Delimiter: "", MaxKeys: 100, SPAddress: "",
    })
    handleErr(err, "ListObjects")
    for _, obj := range objects.Objects {
        log.Printf("* %s\n", obj.ObjectInfo.ObjectName)
    }

    // nesne al
    reader, _, err := cli.GetObject(context.TODO(), BucketName, UploadObjectKey, types.GetObjectOptions{})
    handleErr(err, "GetObject")

    outFile, err := os.Create(DownloadPath + ObjectKey)
    handleErr(err, "DownloadObject")
    defer outFile.Close()

    _, err = io.Copy(outFile, reader)
    handleErr(err, "DownloadObject")
}

func NewFromConfig(chainID, rpcAddress, privateKeyStr string) (client.IClient, string, error) {
    account, err := types.NewAccountFromPrivateKey("test", privateKeyStr)
    if err != nil {
        log.Fatalf("Özel anahtardan yeni hesap oluşturma hatası, %v", err)
        return nil, "", err
    }

    cli, err := client.New(chainID, rpcAddress, client.Option{DefaultAccount: account})
    if err != nil {
        log.Fatalf("Greenfield istemcisi oluşturma hatası, %v", err)
        return nil, "", err
    }
    ctx := context.Background()

    // depolama sağlayıcıları listesini al
    spLists, err := cli.ListStorageProviders(ctx, true)
    if err != nil {
        log.Fatalf("hizmet sp'lerini listaramakta başarısız")
        return nil, "", err
    }
    // ilk SP'yi birincil SP olarak seç
    primarySP := spLists[0].GetOperatorAddress()
    return cli, primarySP, nil
}

func handleErr(err error, funcName string) {
    if err != nil {
        log.Fatalln("fail to " + funcName + ": " + err.Error())
    }
}
```

### S3 Entegrasyonuna Örnek

```go
package main

import (
    "context"
    "fmt"
    "io"
    "log"
    "os"
    "time"

    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/credentials"
    "github.com/aws/aws-sdk-go-v2/service/s3"
)

const (
    AWSKey          = "mock-aws-key"
    AWSSecret       = "mock-aws-secret"
    Region          = "us-east-1"
    BucketName      = "mock-bucket-name"
    ObjectKey       = "mock-object-name"
    UploadObjectKey = "test-api.js"
    DownloadPath    = "/Users/Desktop/s3test/"
    UploadPath      = "/Users/Desktop/s3test/"
)

func main() {
    // aws s3 yapılandırmasını ayarla
    cfg, err := config.LoadDefaultConfig(context.TODO(),
        config.WithRegion(Region),
        config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(AWSKey, AWSSecret, "")),
    )
    handleErr(err, "LoadDefaultConfig")
    client := s3.NewFromConfig(cfg)

    // kova oluştur
    _, err = client.CreateBucket(context.TODO(), &s3.CreateBucketInput{
        Bucket: aws.String(BucketName),
    })
    handleErr(err, "CreateBucket")

    // sahip olanlar tarafından kovaları listele
    result, err := client.ListBuckets(context.TODO(), &s3.ListBucketsInput{})
    handleErr(err, "ListBuckets")
    for _, bucket := range result.Buckets {
        fmt.Printf("* %s\n", aws.ToString(bucket.Name))
    }

    // nesne oluştur
    file, err := os.Open(UploadPath + UploadObjectKey)
    handleErr(err, "PutObject")
    defer file.Close()

    _, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
        Bucket: aws.String(BucketName),
        Key:    aws.String(UploadObjectKey),
        Body:   file,
    })
    handleErr(err, "PutObject")

    // nesnenin başarıyla yüklendiğini bekleyin
    time.Sleep(10 * time.Second)
    objects, err := client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
        Bucket: aws.String(BucketName),
    })
    handleErr(err, "ListObjectsV2")
    for _, item := range objects.Contents {
        fmt.Printf("* %s\n", aws.ToString(item.Key))
    }

    // nesneyi indir
    resp, err := client.GetObject(context.TODO(), &s3.GetObjectInput{
        Bucket: aws.String(BucketName),
        Key:    aws.String(UploadObjectKey),
    })
    handleErr(err, "DownloadObject")

    defer resp.Body.Close()

    outFile, err := os.Create(DownloadPath + ObjectKey)
    handleErr(err, "DownloadObject")

    defer outFile.Close()

    _, err = io.Copy(outFile, resp.Body)
    handleErr(err, "DownloadObject")

    _, err = client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
        Bucket: aws.String(BucketName),
        Key:    aws.String(ObjectKey),
    })
    handleErr(err, "Delete Object")

    _, err = client.DeleteBucket(context.TODO(), &s3.DeleteBucketInput{
        Bucket: aws.String(BucketName),
    })
    handleErr(err, "Delete Bucket")
}

func handleErr(err error, funcName string) {
    if err != nil {
        log.Fatalln("fail to " + funcName + ": " + err.Error())
    }
}