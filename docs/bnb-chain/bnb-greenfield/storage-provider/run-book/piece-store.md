---
title: Deploy Piece Store - BNB Greenfield SP
description: Greenfield SP, kullanıcıların yük veri verilerini depolamak için `PieceStore` kullanarak merkeziyetsiz bir depolama altyapısı sağlar. Bu belgede, PieceStore yapılandırması, shardlama uygulamaları, IAM türleri ve desteklenen depolama sistemleri üzerinde durulmaktadır.
keywords: [Greenfield SP, PieceStore, depolama, shardlama, IAM türleri, nesne depolama, BNB]
---

Greenfield SP, Greenfield merkeziyetsiz depolama platformu için bir depolama altyapısıdır. Greenfield SP, kullanıcıların yük veri verilerini depolamak için `PieceStore` kullanır.

## PieceStore Yapılandırması

Bir PieceStore oluştururken, temel depolama yapılandırması için aşağıdaki seçenekler bulunmaktadır:

```toml
[PieceStore]
# zorunlu
Shards = 0

[PieceStore.Store]
# zorunlu
Storage = ''
# isteğe bağlı
BucketURL = ''
# isteğe bağlı
MaxRetries = 0
# isteğe bağlı
MinRetryDelay = 0
# isteğe bağlı
TLSInsecureSkipVerify = false
# zorunlu
IAMType = ''
```

- `Storage`: PieceStore tarafından kullanılacak temel depolamayı belirtin, örneğin `Storage = 's3'`.
- `BucketURL`: Temel depolama erişim adresini belirtin, örneğin `BucketURL = 'https://mybucket.s3.us-ease-1.amazonaws.com'`. Daha güvenli bir yol, çevre değişkeni ile bucket URL'sini ayarlamaktır, örneğin `export BUCKET_URL=https://mybucket.s3.us-ease-1.amazonaws.com`.
- `MaxRetries`: Temel depolama üzerindeki bir işlem gerçekleştirirken bir sorun olduğunda maksimum deneme sayısını belirtin, örneğin `MaxRetries = 3`.
- `MinRetryDelay`: Temel depolama üzerindeki bir işlem gerçekleştirirken bir sorun olduğunda minimum deneme gecikmesini belirtin, örneğin `MinRetryDelay = 10`.
- `TLSInsecureSkipVerify`: `HTTP` istekleri gönderirken `HTTPS`'yi devre dışı bırakıp bırakmadığınızı belirtin, örneğin `TLSInsecureSkipVerify = false`.
- `IAMType`: Temel depolama erişimi için hangi kimlik doğrulamasını kullanacağınızı belirtin, örneğin `IAMType = 'AKSK'`.

:::tip
PieceStore yapılandırmasını dikkatlice oluşturun; her seçenek, depolama gereksinimlerinize uygun ayarlanmalıdır.
:::

## Shards

Bir PieceStore oluştururken, `Shards` seçeneğiyle birden fazla bucket temel depolama olarak tanımlanabilir. Shardlama temelinde, SP, dosyaları dosya adının hashlenmiş değerine göre birden fazla bucket'a dağıtabilir. **Veri shardlama teknolojisi, büyük ölçekli veri yazımının eşzamanlı yazım yükünü birden fazla bucket'a dağıtarak yazım performansını artırabilir.**

Veri shardlama işlevini kullanırken dikkat edilmesi gereken noktalar şunlardır:

- `Shards` seçeneği, dosyaların hangi bucket'lara dağıtılacağını belirten 0 ve 256 arasında bir tamsayı kabul eder. Varsayılan değer 0'dır, yani veri shardlama işlevi etkin değildir.
- Aynı nesne depolama altında yalnızca birden fazla bucket kullanılabilir.
- Bucket'ları belirtmek için tamsayı joker karakteri `%d` kullanılmalıdır, örneğin `http://10.180.42.161:9000%d`. Bucket'lar PieceStore oluşturulurken SP tarafından otomatik olarak oluşturulabilir.
- Shardlama, oluşturulma sırasında ayarlanır ve oluşturulduktan sonra değiştirilemez. Bucket sayısını artırmak veya azaltmak ya da shardlama işlevini iptal etmek mümkün değildir.

**Örneğin**, aşağıdaki yapılandırma 5 shard ile bir PieceStore oluşturur.

```toml
[PieceStore]
Shards = 5

[PieceStore.Store]
Storage = 'minio'
BucketURL = 'http://10.180.42.161:9000/mybucket%d'
IAMType = 'AKSK'
```

Yukarıdaki komutla SP başlatıldığında, PieceStore `mybucket0`, `mybucket1`, `mybucket2`, `mybucket3` ve `mybucket4` adında 5 bucket oluşturacaktır.

## IAMType

PieceStore, iki kimlik doğrulama modunu destekler: `AKSK` ve `SA`.

### AKSK

`AKSK` modunda, PieceStore `AccessKeyID` ve `AccessKeySecret` kullanarak nesne depolama erişimi sağlar. Kullanıcılar s3'ü nesne depolama olarak kullanıyorsa, `AWSAccessKey` ve `AWS_SECRET_KEY` çevre değişkenlerine ayarlanabilir; bu, daha güvenli bir yoldur.

Kalıcı erişim kimlik bilgileri genellikle iki bölümden oluşur, Erişim Anahtarı ve Gizli Anahtar, bu arada geçici erişim kimlik bilgileri genellikle üç bölümden oluşur, Erişim Anahtarı, Gizli Anahtar ve token ve geçici erişim kimlik bilgilerinin bir son kullanma süresi vardır, genellikle birkaç dakika ile birkaç saat arasında değişir.

### SA

Hizmet Hesabı (kısaca SA), nesne depolama sisteminin kullanıcıları kimlik doğrulaması yapması için daha güvenli bir yöntemdir. **Bu modda, `AccessKeyID` ve `AccessKeySecret` sağlamanızı gerektirmez.** Eğer SP'nizi Kubernetes üzerinde dağıtıyorsanız, nesne depolamaya erişmek için SA kullanmanızı öneririz. AWS S3, SA'yı kullanmayı öğrenmek için bu [belgeyi](https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html) inceleyebilir. Alibaba Cloud OSS, kullanıcıların `AccessKeyID` ve `AccessKeySecret` sağlamasını gerektirmeden OSS'ye güvenli bir şekilde erişmek için `OIDC` kullanır.

#### Geçici kimlik bilgilerini nasıl alırsınız

Farklı bulut sağlayıcılarının farklı edinim yöntemleri vardır. Genellikle, Geçici erişim kimlik bilgileri için erişim anahtarı, gizli anahtar ve izin sınırını temsil eden ARN'yi ikisi ile talep etmeniz gerekir ve bu, bulut hizmeti sağlayıcısının STS sunucusuna erişim sağlamak için gereken geçici erişim kimlik bilgilerini almanıza yardımcı olur. Bu işlem genellikle, bulut sağlayıcısı tarafından sağlanan SDK ile basit hale getirilebilir. **Örneğin**, Amazon S3 geçici kimlik bilgilerini almak için bu [bağlantıyı](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_request.html) kullanabilir, Alibaba Cloud OSS ise bu [bağlantıyı](https://www.alibabacloud.com/help/en/object-storage-service/latest/use-a-temporary-credential-provided-by-sts-to-access-oss) takip edebilir.

Geçici kimlik bilgileri, s3 için `AWS_SESSION_TOKEN`, minio için `MINIO_SESSION_TOKEN` gibi çevre değişkenlerine de ayarlanabilir. Geçici kimlik bilgilerinde bir son kullanma süresi bulunduğundan, bu test modunda kullanılır.

## Desteklenen Depolama Türü

PieceStore şu anda aşağıdaki depolama sistemlerini desteklemektedir. Listelenen depolama sistemleri arasında kullanmak istediğiniz sistem yoksa, bir talep [ sorun](https://github.com/bnb-chain/greenfield-storage-provider/issues) göndermekten çekinmeyin.

| İsim                                    | değer    |
| --------------------------------------- | -------- |
| `Amazon S3`                | `s3`     |
| `Alibaba Cloud OSS`| `oss`    |
| `Backblaze B2`          | `b2`     |
| `MinIO`                        | `minio`  |
| `Dosya`                          | `file`   |
| `Bellek`                      | `memory` |

### Amazon S3

S3, [iki stil endpoint URI](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html) destekler: sanal barındırma stili ve yol stili. Farklar şunlardır:

- Sanal barındırma stili: `https://.s3..amazonaws.com`
- Yol stili: `https://s3..amazonaws.com/`

`` belirli bölge kodu ile değiştirilmelidir; örneğin, ABD Doğu (Kuzey Virginia) bölgesi kodu `us-east-1`dir. Tüm mevcut bölge kodlarını [buradan](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions) bulabilirsiniz. Eğer s3 kullandıysanız, yapılandırma ile birlikte `Storage = s3` ayarlayabilirsiniz.

AWS S3 `AKSK` çevre değişkenleri aşağıdaki gibidir:

```shell
// AWS_ACCESS_KEY aws erişim anahtarı için çevre değişkeninin adını tanımlar
export AWS_ACCESS_KEY="your_access_key"
// AWS_SECRET_KEY aws gizli anahtar için çevre değişkeninin adını tanımlar
export AWS_SECRET_KEY="your_secret_key"
// AWS_SESSION_TOKEN aws oturum belirteci için çevre değişkeninin adını tanımlar, bu isteğe bağlıdır
export AWS_SESSION_TOKEN="your_session_token"
```

AWS S3 `SA` çevre değişkenleri aşağıdaki gibidir:

```shell
// AWS_ROLE_ARN aws rol arnv için çevre değişkenini tanımlar
export AWS_ROLE_ARN="your_role_arn"
// AWSSecretKey aws web kimliği belirteci dosyası için çevre değişkeninin adını tanımlar
export AWS_WEB_IDENTITY_TOKEN_FILE="your_web_identity_token_file"
```

:::note
Eğer S3 bucket'ı herkese açık erişime sahipse (anonim erişim destekleniyorsa), lütfen `export AWS_ACCESS_KEY="NoSignRequest"` ayarlayın.
:::

### Alibaba Cloud OSS

Lütfen erişim anahtarı ve gizli anahtarı almak için bu [belgeyi](https://www.alibabacloud.com/help/en/basics-for-beginners/latest/obtain-an-accesskey-pair) izleyin. Alibaba Cloud ayrıca OSS'ye geçici erişim izni vermek için Güvenlik Token Servisi (STS) kullanmayı destekler. Eğer OSS'yi temel depolama olarak kullanıyorsanız, yapılandırma dosyasında `Storage = oss` ayarlayabilirsiniz.

Alibaba Cloud OSS `AKSK` çevre değişkenleri aşağıdaki gibidir:

```shell
// ALIBABA_CLOUD_ACCESS_KEY OSS erişim anahtarı için çevre değişkeninin adını tanımlar
export ALIBABA_CLOUD_ACCESS_KEY="your_access_key"
// ALIBABA_CLOUD_SECRET_KEY OSS gizli anahtarı için çevre değişkeninin adını tanımlar
export ALIBABA_CLOUD_SECRET_KEY="your_secret_key"
// ALIBABA_CLOUD_SESSION_TOKEN OSS oturum belirteci için çevre değişkeninin adını tanımlar, bu isteğe bağlıdır
export ALIBABA_CLOUD_SESSION_TOKEN="your_session_token"
// ALIBABA_CLOUD_OSS_REGION OSS bölgesi için çevre değişkeninin adını tanımlar
export ALIBABA_CLOUD_OSS_REGION="oss_region"
```

Alibaba Cloud OSS `SA` çevre değişkenleri aşağıdaki gibidir:

```shell
// ALIBABA_CLOUD_ROLE_ARN OSS rol arnv için çevre değişkenini tanımlar
export ALIBABA_CLOUD_ROLE_ARN="your_role_arn"
// ALIBABA_CLOUD_OIDC_TOKEN_FILE OSS oidc token dosyası için çevre değişkeninin adını tanımlar
export ALIBABA_CLOUD_OIDC_TOKEN_FILE="your_oidc_token_file"
// ALIBABA_CLOUD_OIDC_PROVIDER_ARN OSS oidc sağlayıcı arnv için çevre değişkenini tanımlar
export ALIBABA_CLOUD_OIDC_PROVIDER_ARN="your_oidc_provider_arn"
```

### Backblaze B2

Greenfield SP için Backblaze B2'yi bir depolama sistemi olarak kullanmak için önce bir [uygulama anahtarı](https://www.backblaze.com/docs/cloud-storage-application-keys) oluşturmanız gerekir. Uygulama Anahtar Kimliği ve Uygulama Anahtarı sırasıyla Erişim Anahtarı ve Gizli Anahtar'a karşılık gelir. Eğer Backblaze B2'yi temel depolama olarak kullanıyorsanız, yapılandırma dosyasında `Storage = b2` ayarlayabilirsiniz.

Backblaze B2 `AKSK` çevre değişkenleri aşağıdaki gibidir:

```shell
// B2_ACCESS_KEY b2 erişim anahtarı için çevre değişkeninin adını tanımlar
export B2_ACCESS_KEY="your_access_key"
// B2_SECRET_KEY b2 gizli anahtarı için çevre değişkeninin adını tanımlar
export B2_SECRET_KEY="your_secret_key"
// B2_SESSION_TOKEN b2 oturum belirteci için çevre değişkeninin adını tanımlar
export B2_SESSION_TOKEN="your_session_token"
```

### MinIO

[MinIO](https://min.io/) yüksek performanslı, S3 uyumlu bir nesne deposudur. MinIO kümesini nasıl dağıtacağınızı ve sürdüreceğinizi öğrenmek için resmi web sitesini ziyaret edebilir veya minio hizmetini satın alabilirsiniz. Eğer MinIO'yu temel depolama olarak kullanıyorsanız, yapılandırma dosyasında `Storage = minio` ayarlayabilirsiniz.

MinIO `AKSK` çevre değişkenleri aşağıdaki gibidir:

```shell
// MINIO_REGION minio bölgesi için çevre değişkeninin adını tanımlar
export MINIO_REGION="minio_region"
// MINIO_ACCESS_KEY minio erişim anahtarı için çevre değişkeninin adını tanımlar
export MINIO_ACCESS_KEY="your_access_key"
// MINIO_SECRET_KEY minio gizli anahtarı için çevre değişkeninin adını tanımlar
export MINIO_SECRET_KEY="your_secret_key"
// MINIO_SESSION_TOKEN minio oturum belirteci için çevre değişkeninin adını tanımlar, bu isteğe bağlıdır
export MINIO_SESSION_TOKEN="your_session_token"
```

### Dosya

Greenfield SP'yi yerel makinenizde çalıştırırken, SP'nin temel işlevlerini test etmek için yerel diski kullanabilirsiniz. Root kullanıcı için varsayılan depolama yolu `/var/piecestore` ve sıradan kullanıcılar için Linux ve macOS'ta `~/.piecestore/local`'dır. Windows sisteminde varsayılan yol `C:/piecestore/local`'dir.

Yerel depolama genellikle kullanıcıların Greenfield SP'nin nasıl çalıştığını anlamalarına ve Greenfield SP'nin temel özellikleri üzerinde bir deneyim elde etmelerine yardımcı olmak için kullanılır. **Oluşturulan PieceStore depolaması yalnızca tek bir makinede kullanılabilir. Bu üretim ortamında önerilmez.**

### Bellek

Bellek türü, tüm PieceStore arayüzlerini bellekte test etmek için kullanılabilir. Birim testi veya e2e testi için kullanışlıdır.