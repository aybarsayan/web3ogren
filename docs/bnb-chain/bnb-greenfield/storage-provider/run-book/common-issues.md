---
title: SP Ortak Sorunları - BNB Greenfield SP
description: Bu, yaygın SP dağıtım sorunlarına yönelik çözümlerin bir listesidir. Kullanıcılar, karşılaştıkları sorunlara yönelik öneriler bulacak ve uygulamalarını daha verimli bir şekilde yönetebilecek.
keywords: [SP sorunları, BNB Greenfield, zincir içi teklifler, veritabanı sorunları, P2P sorunları]
---

Bu, yaygın SP dağıtım sorunlarına yönelik çözümlerin bir listesidir.

## Zincir İçi Teklif

### 1. Neden tx gönderimi başarısız oldu?

* Sebep 1: gnfd ikili dosyası eşleşmiyor, [son sürümü](https://github.com/bnb-chain/greenfield/releases/latest) kullanmalısınız.
* Sebep 2: Zincir ID'si eşleşmiyor, zincir ID'sini doğru bir şekilde belirtmelisiniz. Greenfield `mainnet` için `--chain-id "greenfield_1017-1"` eklemelisiniz; Greenfield `testnet` için `--chain-id "greenfield_5600-1"` eklemelisiniz.

### 2. Neden Teklif Reddi?

Eğer teklifiniz validatorlerden %2/3'ten az `evet` oyu aldıysa, teklifiniz reddedilecektir.

### 3. Neden Teklif Başarısız Oldu?

Başarısız olma sebebini sorgulamak için aşağıdaki komutu çalıştırın:

```shell
#  Greenfield Mainnet
./gnfd query gov proposal <teklif-id> --node https://greenfield-chain-us.bnbchain.org:443

# Greenfield Testnet
./gnfd q gov proposal <teklif-id> --node https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org:443
```

Eğer şu mesajı görüyorsanız:

```shell
failed_reason: 'spendable balance 999009992000000000000BNB is smaller than 1000000000000000000000BNB:
```

:::tip
Bu, teklifin başlatıcısının fonlama adresi olması gerektiği ve yukarıdaki hata mesajına göre **1k BNB** bakiye bulundurması gerektiği anlamına gelir.
:::

Lütfen başlangıç depozit gereksiniminin farklı ortamlarda değişebileceğini unutmayın. bkz. `fonlama-adresi`

## SP Düğüm Sorunları

### 1. Adres Bulunamadı Sorunu

#### Tanım

SP ikili dosyasını başlattıktan sonra, aşağıdaki hatayı görüyorsunuz:

```shell
rpc error: code = NotFound desc = rpc error: code = NotFound desc = account 0x12334567890 not found: key not found"
```

#### Temel Sebep

Yeni oluşturulan bir adres hakkında zincirde bilgi bulmak mümkün değildir.

#### Çözüm

SP'nizi başlatmadan önce, tüm 5 adresinize BNB aktarın.

### 2. Veritabanı Yapılandırma Sorunu

#### Tanım

SP ikili dosyasını başlattıktan sonra, aşağıdaki hatayı görüyorsunuz:

```shell
Table "block_syncer.master_db" does not exist
Failed to get db config from config file
```

#### Temel Sebep

Veri kaynağı adı (dsn) `config.toml` içinde tanımlanmamıştır.

#### Çözüm

```shell
[BlockSyncer]
Modules = ['epoch','bucket','object','payment','group','permission','storage_provider','prefix_tree', 'virtual_group','sp_exit_events','object_id_map','general']
Dsn = [BsDB_User]:[BsDB_Passwd]@tcp([BsDB_Address])/[BsDB_Database?parseTime=true&multiStatements=true&loc=Local&interpolateParams=true
```

### 3. Nesne Sızdırılmış Durumu Sorunu

#### Tanım

Bir dosya yükledikten sonra, şu hata mesajını görüyorsunuz:

```shell
Message: object has not been sealed state
```

SP günlüğünde aşağıdakileri görüyorsunuz:

```shell
{"t":"2023-07-10T11:34:50.856+0800","l":"error","caller":"gfspapp/sign_server.go:42","msg":"failed to seal object","error":"code_space:\"signer\" http_status_code:400 inner_code:120002 description:\"failed to broadcast seal object tx, error: failed to broadcast tx, resp code: 13\" "}
```

#### Temel Sebep

`SealAddress` sızdırma işlemlerini imzalamak için yeterli BNB'ye sahip değil.

#### Çözüm

`SealAddress` adresine BNB aktarın.

### 4. P2P Sorunu

#### Tanım

SP ikili dosyasını başlattıktan sonra, şu hata mesajını görüyorsunuz:

```shell
failed to parse address 'k8s-gftestne-p2pexter-bc25ac70bc-a31e9596d87054c3.elb.us-east-1.amazonaws.com:9933' domain
```

#### Temel Sebep

SP, P2P ağında geçersiz bir SP URL'si ile bağlanmaya çalışıyor.

#### Çözüm

`config.toml` dosyasındaki [P2P] ayarını güncelleyiniz:

```shell
[P2P]
# p2p node msg Secp256k1 şifreleme anahtarı, diğer SP'lerin adreslerinden farklıdır
P2PPrivateKey = '${p2p_private_key}'
P2PAddress = '0.0.0.0:9933'
P2PAntAddress = '${load_balance_doamin:port}'
P2PBootstrap = []
P2PPingPeriod = 0
```

`P2PAntAddress` yük denge adresinizdir. Yük denge adresiniz yoksa, bir genel IP'ye sahip olmalısınız ve bunu `P2PAddress` olarak kullanmalısınız. `P2PBootstrap` artık kullanılmıyor, bu alanı boş bırakabilirsiniz.

### 5. MinIO Kimlik Doğrulama Sorunu

#### Tanım

Minio'yu depolama olarak yapılandıramıyorum.

```shell
{"t":"2023-07-17T18:05:40.245+0800","l":"debug","caller":"storage/object_storage.go:15","msg":"created minio storage at endpoint http://172.17.0.2:9000/hashquark"}
Jul 17 18:05:41 10-7-46-85 gnfd-sp[18585]: {"t":"2023-07-17T18:05:40.245+0800","l":"info","caller":"storage/minio.go:37","msg":"new minio store succeeds","bucket":"hashquark"}
Jul 17 18:07:01 10-7-46-85 gnfd-sp[18585]: {"t":"2023-07-17T18:07:00.893+0800","l":"error","caller":"storage/s3.go:147","msg":"S3 failed to head bucket","error":"NoCredentialProviders: no valid providers in chain. Deprecated.\n\tFor verbose messaging see aws.Config.CredentialsChainVerboseErrors"}
Jul 17 18:07:01 10-7-46-85 gnfd-sp[18585]: {"t":"2023-07-17T18:07:00.893+0800","l":"error","caller":"piece/piece_store.go:88","msg":"failed to head bucket","error":"NoCredentialProviders: no valid providers in chain. Deprecated.\n\tFor verbose messaging see aws.Config.CredentialsChainVerboseErrors"}
Jul 17 18:07:01 10-7-46-85 gnfd-sp[18585]: {"t":"2023-07-17T18:07:00.893+0800","l":"error","caller":"piece/piece_store.go:77","msg":"failed to check bucket due to storage is not configured rightly ","error":"deny access bucket","object":"minio://hashquark/"}
Jul 17 18:07:01 10-7-46-85 gnfd-sp[18585]: {"t":"2023-07-17T18:07:00.893+0800","l":"error","caller":"piece/piece_store.go:21","msg":"failed to create storage","error":"deny access bucket"}
```

#### Temel Sebep

Bu bir MinIO kimlik doğrulama sorunudur.

#### Çözüm

`buraya` göz atabilirsiniz.

### 6. SP Standart Test Sorunu

#### Tanım

```html
2023/07/26 19:06:03.543395 [INFO] GID 41, Uploading file - object: 2q4l5v4v3z, bucket: sc1bw
default error msg : <html>
<head><title>413 Request Entity Too Large</title></head>
<body>
<center><h1>413 Request Entity Too Large</h1></center>
<hr><center>nginx/1.18.0 (Ubuntu)</center>
</body>
</html>
{"level":"error","time":"2023-07-26T13:06:03-06:00","message":"do API error, url: https://sc1bw.gnfd-testnet-sp.epotter-qa.io/2q4l5v4v3z, err: statusCode 413 : code : unknown error  request-id  (Message: <html>\r\n<head><title>413 Request Entity Too Large</title></head>\r\n<body>\r\n<center><h1>413 Request Entity Too Large</h1></center>\r\n<hr><center>nginx/1.18.0 (Ubuntu)</center>\r\n</body>\r\n</html>)"}
2023/07/26 19:06:03.543395 [INFO] GID 41, Uploading file - object: 2q4l5v4v3z, bucket: sc1bw
default error msg : <html>
<head><title>413 Request Entity Too Large</title></head>
<body>
<center><h1>413 Request Entity Too Large</h1></center>
<hr><center>nginx/1.18.0 (Ubuntu)</center>
</body>
</html>
{"level":"error","time":"2023-07-26T13:06:03-06:00","message":"do API error, url: https://sc1bw.gnfd-testnet-sp.epotter-qa.io/2q4l5v4v3z, err: statusCode 413 : code : unknown error  request-id  (Message: <html>\r\n<head><title>413 Request Entity Too Large</title></head>\r\n<body>\r\n<center><h1>413 Request Entity Too Large</h1></center>\r\n<hr><center>nginx/1.18.0 (Ubuntu)</center>\r\n</body>\r\n</html>)"}
```

#### Temel Sebep

Nginx büyük dosyaları desteklemiyor.

#### Çözüm

:::info
`proxy-body-size` değerini artırın.
:::
    
## DCellar Entegrasyon Sorunları

### 1. İstenilen kaynağın üzerinde 'Access-Control-Allow-Origin' başlığı mevcut değil

Hata:

```shell
Access to XMLHttpRequest at 'https://fbgtest.gnfd-testnet-sp.fbgx.ai/?read-quota&year-month=2023-07' from origin 'https://dcellar.io' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### Çözüm

Bu başlıkları ekleyin:

```http
Access-Control-Allow-Credentials:
true
Access-Control-Allow-Headers:
Access-Control-Allow-Headers: DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-MD5,Range,Authorization,X-Gnfd-Content-Sha256,X-Gnfd-Unsigned-Msg,X-Gnfd-Txn-Hash,Date,X-Gnfd-Object-ID,X-Gnfd-Resource,X-Gnfd-Piece-Index,X-Gnfd-Redundancy-Index,Address,X-Gnfd-User-Address,X-Gnfd-App-Domain,X-Gnfd-App-Reg-Nonce,X-Gnfd-Date,X-Gnfd-App-Reg-Public-Key,X-Gnfd-App-Reg-Expiry-Date,X-Gnfd-Expiry-Timestamp
Access-Control-Allow-Methods:
GET, PUT, POST, DELETE, PATCH, OPTIONS
Access-Control-Allow-Origin:
*
Access-Control-Expose-Headers:
*, X-Gnfd-Request-ID,X-Gnfd-Signed-Msg,X-Gnfd-Object-ID,X-Gnfd-Integrity-Hash,X-Gnfd-Piece-Hash
Access-Control-Max-Age:
1728000
```

### 2. Bir OPTION isteği yapıldığında, OPTIONS 405 (Yöntem Yasaklandı) hatası alıyorum

#### Temel Sebep

:::warning
405 Yöntem Yasaklandı hatası, web sunucusu belirli bir URL için belirli bir işlemi gerçekleştirmenize izin vermeyecek şekilde yapılandırıldığında meydana gelir. Bu, sunucu tarafından bilinen ancak hedef kaynak tarafından desteklenmeyen bir istek yöntemini belirtmek için HTTP yanıt durumu kodudur.
:::

#### Çözüm

Uygulamanız muhtemelen Apache, nginx veya Cloudflare gibi yaygın web sunucusu yazılımlarından birini kullanan bir sunucuda çalışmaktadır. Web sunucusu yazılımınız için yapılandırma dosyalarınızı kontrol edin ve istemeden yönlendirme veya istek işleme talimatlarına bakın.