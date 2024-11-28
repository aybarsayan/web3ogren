---
description: Bu belge, BNB Greenfield için SP konfigürasyonunu ayrıntılı bir şekilde açıklamaktadır. Kullanıcılar, yapılandırma adımlarını ve gerekli alanları öğrenebilirler.
keywords: [BNB, Greenfield, SP, konfigürasyon, yapılandırma, toml, veritabanı]
---

## SP Konfigürasyonu

Bu bölüm, SP'nin tam konfigürasyonunu verir. `./gnfd-sp config.dump`, bir şablon config.toml dosyası oluşturur.

:::tip
Bu dosya, yapılandırmanızı oluşturmak için gereklidir. Lütfen tüm alanları doğru şekilde doldurduğunuzdan emin olun.
:::

```toml
# isteğe bağlı
Env = ''
# isteğe bağlı
AppID = ''
# isteğe bağlı
Server = []
# isteğe bağlı
GRPCAddress = ''
```

### Veritabanı

`[SpDB]`, `[BsDB]`'yi yapılandırmak için bu alanlara `kullanıcı adı`, `db şifresi`, `db adresi` ve `db adı` girmeniz gerekir.

> **Not:** Kullanıcı adı, şifre ve veritabanı adı gibi bilgileri doğru girdiğinizden emin olun. — Bu bilgiler veri erişimi için kritik öneme sahiptir.

### Parça Mağazası

`[PieceStore]` ve `[PieceStore.Store]`'yi yapılandırmak için bu `belgeye` göz atabilirsiniz.

---

### Zincir Bilgisi

* Mainnet için `ChainID` `greenfield_1017-1` ve testnet için `greenfield_5600-1`'dir.
* `ChainAddress`, mainnet'in RPC uç noktasını temsil eder, RPC bilgilerini `buradan` bulabilirsiniz.

### SP Hesabı

Bu özel anahtarlar cüzdan kurulumu sırasında oluşturulur.

### Uç Nokta

`[Endpoint]` farklı hizmetlerin URL'lerini belirtir.

Tek makineli ev sahibi için (önerilmez):

```toml
[Endpoint]
ApproverEndpoint = ''
ManagerEndpoint = ''
DownloaderEndpoint = ''
ReceiverEndpoint = ''
MetadataEndpoint = ''
UploaderEndpoint = ''
P2PEndpoint = ''
SignerEndpoint = ''
AuthenticatorEndpoint = ''
```

K8S kümesi için:

```toml
[Endpoint]
ApproverEndpoint = 'manager:9333'
ManagerEndpoint = 'manager:9333'
DownloaderEndpoint = 'downloader:9333'
ReceiverEndpoint = 'receiver:9333'
MetadataEndpoint = 'metadata:9333'
UploaderEndpoint = 'uploader:9333'
P2PEndpoint = 'p2p:9333'
SignerEndpoint = 'signer:9333'
AuthenticatorEndpoint = 'localhost:9333'
```

:::warning
Mainnet ve testnet'te P2P hizmetini kullanmıyoruz, bu nedenle kullanıcılar P2P öğelerini görmezden gelebilirler.
:::

### Geçit

```toml
[Gateway]
DomainName = 'region.sp-name.com'
```

Doğru yapılandırma, `https://` protokol ön ekini içermemelidir.

---

### Blok Senkronlayıcı

İşte block_syncer konfigürasyonu. BsDBWriteAddress'ın yapılandırması, buradaki BSDB.Address modülüyle aynı olabilir. Performansı artırmak için buraya yazma veritabanı adresini ve karşılık gelen okuma veritabanı adresini BSDB'ye ayarlayabilirsiniz.

```toml
Modules = ['epoch','bucket','object','payment','group','permission','storage_provider','prefix_tree', 'virtual_group','sp_exit_events','object_id_map','general']
Workers = 50
BsDBWriteAddress = 'localhost:3306'
```

### Kota

İşte kota konfigürasyonu. MonthlyFreeQuota, her ayki ücretsiz kotaları tanımlar. Kullanım kotası tüketildiğinde azalacaktır.

```toml
[Quota]
MonthlyFreeQuota = 0
```

### SP Probesi

Çift probe içerir: canlılık ve hazır olma probe'ları. Kullanıcılar, SP'nin sağlıklı ve hazır olup olmadığını kontrol etmek isterse, ilgili kavramları öğrenmek için [Kubernetes belgelerine](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) başvurabilir.

## SP Mainnet Önerilen Konfigürasyonu

Bu bölüm, Greenfield'daki resmi yapılandırmayı göstermektedir, böylece kullanıcılar benzer bir yapılandırma ekleyebilir:

```toml
# isteğe bağlı
Env = "mainnet"
# isteğe bağlı
Server = []
# isteğe bağlı
GRPCAddress = '0.0.0.0:9333'
```

:::note
Bu yapılandırma örneği, BNB Greenfield SP için önerilen başlanğıç noktasıdır.
:::

### Detaylar


Devamını Göster

**Db Bilgisi:**
```toml
[SpDB]
# zorunlu
User = ''
# zorunlu
Passwd = ''
# zorunlu
Address = '{your_db_address}'
# zorunlu
Database = 'storage_provider_db'
```
**Son bilgiler:**
```toml
[Gateway]
# zorunlu
DomainName = '{your_domain_name}'
```



---
title: isteğe bağlı
description: Bu belgede, sistem yapılandırma ayarları ve API oran sınırlayıcılarına ilişkin bilgiler yer almaktadır. Bu ayarlar, sistemin performansını ve güvenliğini optimize etmek için kullanılmaktadır.
keywords: [global parallel settings, API rate limiter, configuration, system performance, security]
---

# isteğe bağlı

GlobalCreateBucketApprovalParallel = 1024 # isteğe bağlı
GlobalCreateObjectApprovalParallel = 1024
# isteğe bağlı
GlobalUploadObjectParallel = 1024
# isteğe bağlı
GlobalReplicatePieceParallel = 1024
# isteğe bağlı
GlobalSealObjectParallel = 1024
# isteğe bağlı
GlobalReceiveObjectParallel = 10240
# isteğe bağlı
GlobalBackupTaskParallel = 1024
# isteğe bağlı
GlobalRecoveryPieceParallel = 1024
# isteğe bağlı
GlobalGcObjectSafeBlockDistance = 64
# isteğe bağlı
GlobalMigrateGVGParallel = 10

[Monitor]
# zorunlu
DisableMetrics = false
# zorunlu
DisablePProf = false
# zorunlu
DisableProbe = false
# zorunlu
MetricsHTTPAddress = '0.0.0.0:24367'
# zorunlu
PProfHTTPAddress = '0.0.0.0:24368'
# zorunlu
ProbeHTTPAddress = '0.0.0.0:24369'

# isteğe bağlı
[Rcmgr]
# isteğe bağlı
DisableRcmgr = false
# isteğe bağlı
[Rcmgr.GfSpLimiter]
# isteğe bağlı
[Rcmgr.GfSpLimiter.System]
# isteğe bağlı
Memory = 4294967296
# isteğe bağlı
Tasks = 10240
# isteğe bağlı
TasksHighPriority = 128
# isteğe bağlı
TasksMediumPriority = 1024
# isteğe bağlı
TasksLowPriority = 16
# isteğe bağlı
Fd = 2147483647
# isteğe bağlı
Conns = 2147483647
# isteğe bağlı
ConnsInbound = 2147483647
# isteğe bağlı
ConnsOutbound = 2147483647

[BlockSyncer]
# zorunlu
Modules = ['epoch','bucket','object','payment','group','permission','storage_provider','prefix_tree','virtual_group','sp_exit_events','object_id_map','general']
# zorunlu
Workers = 50
# isteğe bağlı
BsDBWriteAddress = "{your_db_address}"

[APIRateLimiter]
:::info
Her satır bir geçit rotasının bir girişini temsil etmelidir. Her satırı takip eden yorum, hangi rota adını temsil ettiğini içermelidir.
:::

# 1.  Çoğu sorgu-API'si için, rate limit değeri maksimum qps'nin 1/4'üne kadar ayarlanabilir, çünkü yapılandırma yalnızca bir geçit örneği içindir.
# 2.  Ayrıca çok büyük veya çok küçük bir rate limit değeri ayarlamaktan kaçınmalıyız.
# 3.  Yükleme/indirme API'leri için, rate limit kullanarak sunucular için koruma mekanizması oluşturmak zordur. Çünkü yükleme/indirme etkileşimlerinin performansı genellikle dosyanın işlem süresine bağlıdır.
# 4.  Yükleme/indirme API'leri için geçici olarak 50~75 rate limit olarak ayarlıyoruz ve daha iyi bir deneyim elde ettiğimizde bunları ayarlayabiliriz.
# 5.  Şu anda, lütfen PathPattern isim listesine yalnızca bir isim koyun.

# isteğe bağlı
PathPattern = [
    {Key = "/auth/request_nonce", Method = "GET", Names = ["GetRequestNonce"]},
    {Key = "/auth/update_key", Method = "POST", Names = ["UpdateUserPublicKey"]},
    {Key = "/permission/.+/[^/]*/.+", Method = "GET", Names = ["VerifyPermission"]},
    {Key = "/greenfield/admin/v1/get-approval", Method = "GET", Names = ["GetApproval"]},
    {Key = "/greenfield/admin/v1/challenge", Method = "GET", Names = ["GetChallengeInfo"]},
    {Key = "/greenfield/admin/v2/challenge", Method = "GET", Names = ["GetChallengeInfo"]},
    {Key = "/greenfield/receiver/v1/replicate-piece", Method = "PUT", Names = ["ReplicateObjectPiece"]},
    
    {Key = "/download/[^/]*/.+", Method = "GET", Names = ["DownloadObjectByUniversalEndpoint"]},
    {Key = "/view/[^/]*/.+", Method = "GET", Names = ["ViewObjectByUniversalEndpoint"]},
    {Key = "/status", Method = "GET", Names = ["GetStatus"]},
    ...

    {Key = "/$", Method = "GET", Names = ["GetUserBuckets"]},
]

NameToLimit = [
    {Name = "GetRequestNonce", RateLimit = 100, RatePeriod = 'S'}, # requestNonceRouterName 3000qps
    {Name = "UpdateUserPublicKey", RateLimit = 100, RatePeriod = 'S'}, # updateUserPublicKeyRouterName 4000qps
    ...
]

HostPattern = []

[Manager]
# isteğe bağlı
EnableLoadTask = true
# isteğe bağlı
GVGPreferSPList = [1,2,3,4,5,6,7]
# isteğe bağlı
EnableTaskRetryScheduler = true

[Executor]
# isteğe bağlı
ListenSealRetryTimeout = 30

[Quota]
MonthlyFreeQuota = 0