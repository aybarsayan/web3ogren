---
title: Paket Servisi - BNB Greenfield Geliştir
description: Küçük nesneleri birleştirmek için paket hizmetini nasıl kullanacağınız hakkında kapsamlı bir kılavuz. Geliştiricilere maliyetleri azaltma ve dosya yönetimini kolaylaştırma yollarını gösterir.
keywords: [BNB Greenfield, NodeReal, Paket, Paket Servisi, dağıtım, dosya yönetimi]
---

Daha fazla geliştirici BNB Greenfield ekosistemine katıldıkça, merkeziyetsiz depolama kullanan birçok **iyi uygulama** ortaya çıkmaya devam ediyor. Öte yandan, küçük dosyaları Greenfield'a göndermek ekonomik bir yol değildir. Küçük dosyalar gönderildiğinde, sistemde saklanan dosyalarla ilgili bilgilerin (meta verilerin) kendilerinden daha büyük olabileceği anlamına gelir. Bu, hem kullanıcılar hem de Greenfield için daha yüksek maliyetler anlamına gelmektedir. **Örneğin**, bir kullanıcının hesabının Greenfield'a bir web sitesini yüklemek istediğini hayal edin. Web sitesinin dosyaları küçükse ancak sayıları fazlaysa, bu aynı probleme yol açar: fazla meta veri ve daha yüksek maliyetler.

:::tip
BNB Chain, bu problemi çözmek için Greenfield paketinin temel protokolünü önermiştir.
:::

Daha fazla ayrıntıyı [BEP-323](https://github.com/bnb-chain/BEPs/pull/323) adresinde bulabilirsiniz. NodeReal, paketleme hizmetini uygulayan ilk altyapı sağlayıcısıdır. Paketleme hizmeti, küçük dosyaları birleştirip Greenfield'a göndermeden önce bir büyük dosya haline getirme çözümü sunar. Böylece, geliştiriciler gereksiz maliyetleri azaltabilirken, yine de büyük dosyadaki her bir dosyaya, ayrıymış gibi erişebilirler.

NodeReal Paketleme hizmeti tamamen açık kaynaklıdır. Geliştiriciler NodeReal paket hizmetini doğrudan kullanabilirler, ayrıca ihtiyaç duyarlarsa **kendi paket hizmetlerini de dağıtabilirler**.

## Paket Formatı
Paket formatı, kullanıcıların dosyaları paketlerken oluşturduğu paketin yapısını ve organizasyonunu belirler. Bu format, düz dosyaları paketlemek için tasarlanmıştır; hiyerarşik dizin yapıları veya klasörler desteklenmez.

Bir klasörle uğraşırken, yapısını bireysel dosyalara dönüştürerek basitleştirebiliriz. Bu süreçte, her dosyayı klasör yolunu içerecek şekilde yeniden adlandırırız. Örneğin, irra ve dirb içindeki dosya.txt adındaki bir dosya, dira/dirb/file.txt olarak yeniden adlandırılacaktır. Bu yaklaşım, klasörün organizasyonunu korurken, paketteki düz dosya gereksinimine uymamızı sağlar.

Paket formatı birkaç ana bileşene yapılandırılmıştır:

* **Sürüm:** Bu, kullanılan paket protokolünün sürüm numarasını belirtir.
* **Meta Boyutu:** Bu, paketin meta verilerinin boyutunu belirtir ve tüm paketi okumak zorunda kalmadan paket yapısının inşasını mümkün kılar.
* **Meta Veri:** Bu bölüm, paketteki dosyalarla ilgili bilgileri içerir. Herhangi bir dosyaya doğrudan erişim sağlayabilmeyi kolaylaştırır, bu da demektir ki paketteki tüm dosyalar arasında geçiş yapmadan doğrudan herhangi bir dosyaya atlayabilirsiniz.
* **Veri:** Bu bölüm, gerçek içeriği temsil eder ve tüm dosyaları baytlar olarak içerir.

:::info
Daha fazla ayrıntı için [BEP-323](https://github.com/bnb-chain/BEPs/pull/323) ve [Bundle-SDK](https://github.com/bnb-chain/greenfield-bundle-sdk) adreslerine başvurabilirsiniz.
:::

## Paket Servisi

Yukarıdaki paket formatıyla, kullanıcılar artık küçük nesnelerini bir pakete yerleştirip paket dosyasını Greenfield'a yükleyebilirler. Ancak kullanıcılar, paket dosyasındaki nesnelere kolayca erişemezler.

Paket hizmeti, birçok küçük nesneyi Greenfield'a yükleyen kullanıcılar veya dApp'ler için tasarlanmıştır ve paketteki nesneler için bir indeksleme hizmeti sağlar. Kullanıcılar, küçük nesneleri paket hizmetine yükleyebilir ve paket hizmeti küçük dosyaları bir pakete toplar ve Greenfield'a yükler; aynı zamanda, paket hizmeti paketteki her bir nesneye erişim için bir URL de sağlar.

Paket hizmeti, paket dosyasını kullanıcının belirttiği bucket'a yükleyecektir. Bu nedenle, kullanıcı, paket hizmetinin dosyaları bucket'a yükleme izni olması gerektiğini belirtmelidir. Aynı zamanda, kullanıcı, paket hizmetinin Greenfield'a nesneleri yüklemesi için işlem ücretini de sağlamalıdır.

### Mimari

Paket hizmeti iki ana bileşenden oluşur: **API hizmeti** ve **Paketleyici**.

![bundle-architecture.png](../../images/bnb-chain/bnb-greenfield/static/asset/bundle-1.png)

#### API Hizmeti
API hizmeti, bir nesneyi yükleme, bir nesneyi sorgulama gibi kullanıcı isteklerine hizmet eder.

#### Paketleyici
Paketleyici, kullanıcının yüklediği nesneleri bir paket dosyasına toplar ve bunu Greenfield'daki bir bucket'a yükler.

### Ana İş Akışları
Paketleyici hizmetinin, paketlenmiş dosyaları kullanıcının bucket'ına yüklediğini anlamak önemlidir; kullanıcı paket dosyaları üzerinde mutlak kontrole sahiptir. Bu kontrol düzeyi, kullanıcıların paketlenmiş dosyalarını gerektiği gibi etkili bir şekilde yönetmelerine ve manipüle etmelerine olanak tanır.

"Paket hizmeti, işlemleri göndermek ve paketlenmiş dosyaları Greenfield'a sunmak için kendi hesabını kullanır. Kullanıcılar işlem ücretlerini karşılamaktan sorumludur ve yeni dosyalar oluşturmak için paketleyici hesabına yetki vermelidirler. Bu nedenle, paketleyici hizmetini kullanmadan önce gerekli yetkilendirmeyi tamamlamak önemlidir." — BNB Greenfield Geliştirme Ekibi

Greenfield, bucket'lar ve dosyalar için izinleri yönetebilir. Ancak, paketleyici hizmetinin akıcı kalmasını sağlamak için, karmaşık izin yönetimi şu anda mevcut değildir. Paketleyici hizmeti sadece kamu bucket'larını destekler ve yalnızca bucket sahibi dosyaları yükleyebilir. Ancak, tüm kullanıcılar izin olmaksızın paket hizmeti aracılığıyla dosyalara erişebilir.

#### İzin Verme
![grant-permission.png](../../images/bnb-chain/bnb-greenfield/static/asset/bundle-2.png)

* **Adım 1:** Paket hizmetini kullanmadan önce, kullanıcı Greenfield'da bir bucket oluşturmalı ve görünürlük kamu olmalıdır. Bunun için greenfield-go-sdk ile bir bucket oluşturmak üzere aşağıdaki API'yi kullanabilirsiniz. GUI seçeneği olarak, yeni bir bucket oluşturmak için DCellar'ı kullanabilirsiniz.
```go
func (c *Client) CreateBucket(ctx context.Context, bucketName string, primaryAddr string, opts types.CreateBucketOptions) (string, error)
```

* **Adım 2:** Paket dosyalarını Greenfield'a yüklerken optimum performansı sağlamak için, paketleyici hizmeti birden fazla operatör adresi sunar. Operatör adresi, paketli nesneleri Greenfield'a yüklerken kullanıcıyı değiştirmek için kullanılır. Paketli nesneleri oluşturmak için operatör adresini alın.

* **Adım 3:** Bucket altında paketli nesneleri oluşturmak için operatör adresine ücret ve izin verin. Ücret tahsisi için sadece nesne oluşturma için bir ücret tahsis edebilirsiniz.
```go
func (c *Client) GrantAllowance(ctx context.Context, granteeAddr string, allowance feegrant.FeeAllowanceI, txOption gnfdsdktypes.TxOption) (string, error)

// Yeni İzinli Mesaj Tahsisi, yeni filtrelenmiş ücret tahsisi oluşturur.
func NewAllowedMsgAllowance(allowance FeeAllowanceI, allowedMsgs []string) (*AllowedMsgAllowance, error)
```
İzin tahsisi için, sadece nesne oluşturma için izin vermek üzere aşağıdaki API'leri kullanabilirsiniz.
```go
func (c *Client) PutBucketPolicy(ctx context.Context, bucketName string, principalStr types.Principal,
statements []*permTypes.Statement, opt types.PutPolicyOption,
) (string, error)

func NewPrincipalWithAccount(principalAddr sdk.AccAddress) (types.Principal, error)

func NewStatement(actions []permTypes.ActionType, effect permTypes.Effect,
resource []string, opts types.NewStatementOptions,
) permTypes.Statement
```

#### Nesne Yükleme
Paket, aşağıdaki koşullardan herhangi biri yerine getirildiğinde donacaktır:
-  Paketin boyutu, varsayılan değeri 1GB olan MaxBundledSize'a eşit veya büyükse.
-  Mevcut paketteki nesne sayısı, varsayılan değeri 1000 olan MaxBundledNumber'a eşit veya büyükse.
-  Paketin oluşturulmasından bu yana geçen zaman, varsayılan değeri 24 saat olan MaxFinalizeTime'a eşit veya büyükse.

Kullanıcılar, MaxBundledSize, MaxBundledNumber ve MaxFinalizeTime için kendi kurallarını da tanımlayabilirler, ancak değerlerin varsayılan değerleri aşmaması gerekmektedir.

:::note
Bu modda, önceki paket donduğunda, yeni dosyalar yüklendiğinde, paketleyici hizmeti otomatik olarak kullanıcı için yeni bir paket oluşturacak, böylece ek bir kullanıcı müdahalesi gerekmeyecektir. Paketleyici hizmeti tarafından oluşturulan paketler, {bundle_prefix}_{bundle_nonce} adlandırma formatını takip eder. bundle_prefix varsayılan olarak bundle'dır ve bundle_nonce, bucket'da oluşturulan paketlerin sayısını belirtir.
:::

![upload-object1.png](../../images/bnb-chain/bnb-greenfield/static/asset/bundle-3.png)

Ayrıca, kullanıcıların "paket oluştur" API'sını kullanarak yeni bir paket oluşturup, ardından "paketi mühürle" API'sı aracılığıyla paketi Greenfield'a göndermelerini sağlamak için bir paketin yaşam döngüsünü tamamen belirleme seçeneği vardır. Paket oluşturma ile mühürleme arasındaki sürenin, 24 saatlik DefaultMaxBundledTime'ı aşmaması önemlidir. Bu zaman sınırı aşılırsa, paket hizmeti paketi süresi dolmuş olarak ayarlayacak ve kullanıcı artık paketi tamamlayamayacaktır.

![upload-object2.png](../../images/bnb-chain/bnb-greenfield/static/asset/bundle-4.png)

Paketleyici hizmeti, küçük dosyalarla ilgili depolama performansı ve verimlilik sorunlarını çözmek için tasarlanmıştır. Bu nedenle, paket hizmetine yüklenen dosya boyutunun **16 MB'ı aşmaması** önemlidir. Bu sınırı aşan herhangi bir dosya paket hizmeti tarafından reddedilecektir.

#### Paket Yükleme
Kullanıcılar, bir web sitesi yüklemek gibi dosyaları aynı anda yüklemek isteyebileceğinden, paket hizmeti kullanıcıların geçerli bir paketi yüklemelerine izin verir. Küçük nesneleri kolayca bir pakette birleştirmek için [paket komut satırı aracını](https://github.com/bnb-chain/greenfield-bundle-sdk/tree/master?tab=readme-ov-file#command-line-tool) kullanabilirsiniz.

Paket hizmeti, yüklenen paketi doğrulayacak; eğer paket geçersizse, talep reddedilecektir.

Geçerli bir paket için, paket hizmeti paketteki tüm dosyaları dizinleyecek, böylece kullanıcı paket içindeki dosyalara UploadObject API'si aracılığıyla yüklenen nesneler gibi erişebilecektir.

UploadObject API'sinin aksine, kullanıcı paket yüklerken paket adını belirtmelidir ve kullanıcının bu pakete artık nesne yüklemesine izin verilmez. Paket, **Nihai** olarak işaretlenecek ve paket hizmeti tarafından Greenfield'a yüklenecektir.

![upload-bundle.png](../../images/bnb-chain/bnb-greenfield/static/asset/bundle-5.png)

#### Nesne Sorgulama
Paket hizmeti, yüklenen nesneler için indeks bilgi depolar. Paket ve meta verilerini izler, paketteki dosyaların kolayca bulunmasını ve dizinlenmesini sağlar. Hizmet ayrıca sık erişilen verileri önbelleğe alır ve böylece talep performansını artırır.
- Paketleyici hizmeti, dosyayı kaydetmişse, paketleyici hizmeti isteğe anında yanıt verebilir.
- Sadece indeks bilgisi mevcutsa, paket hizmeti dosyayı Greenfield'dan alır ve kullanıcıya döner.
- Eğer indeks kaybolursa, hizmet, onu Greenfield'dan yeniden oluşturmaya çalışır ve ardından dosyayı alır ve geri döner.

![query-object.png](../../images/bnb-chain/bnb-greenfield/static/asset/bundle-6.png)

### API'ler
Paket Servisi Sunucu API'si, paketlerle etkileşimde bulunmak ve yönetmek için birkaç uç nokta sağlar. İşte kısa bir genel bakış:

- **Bir nesneyi pakete yükleyin (POST /uploadObject):** Bu uç nokta, kullanıcıların bir nesneyi bir pakete yüklemesine olanak tanır; bucket adı, dosya adı vb. gibi ayrıntılar gereklidir.
- **Bir paket yükleyin (POST /uploadBundle):** Bu uç nokta, kullanıcıların bir nesne paketini yüklemesine olanak tanır; bucket adı, paket adı vb. gibi ayrıntılar gereklidir.
- **Bir nesneyi bir paket içerisinden dosya olarak alın (GET /view/{bucketName}/{bundleName}/{objectName}):** Bu uç nokta, belirli bir nesneyi verilen bir paketten elde eder ve bir dosya olarak döner.
- **Bir nesneyi bir paket içerisinden dosya olarak indirin (GET /download/{bucketName}/{bundleName}/{objectName}):** Bu uç nokta, kullanıcıların belirli bir nesneyi verilen bir paket içerisinden indirmesine olanak tanır ve bir dosya olarak döner.
- **Paket bilgilerini sorgula (GET /queryBundle/{bucketName}/{bundleName}):** Bu uç nokta, belirli bir nesneyi verilen bir paketten sorgular ve ilgili bilgileri döner.
- **Bir bucket'ın paket bilgilerini sorgula (GET /queryBundlingBundle/{bucketName}):** Bu uç nokta, verilen bir bucket'ın paket bilgilerini sorgular.
- **Yeni Bir Paket Başlat (POST /createBundle):** Bu uç nokta, yeni bir paket başlatır; bucket adı ve paket adı gibi ayrıntılar gereklidir.
- **Mevcut Bir Paketi Nihai Hale Getir (POST /finalizeBundle):** Bu uç nokta, mevcut bir paketin yaşam döngüsünü tamamlar ve yetkilendirme için paket adını gerektirir.
- **Mevcut Bir Paketi Sil (POST /deleteBundle):** Bu uç nokta, Greenfield'da nesne silindikten sonra mevcut bir paketi siler.
- **Bir Kullanıcı için Paketleyici Hesabı Al (POST /bundlerAccount/{userAddress}):** Bu uç nokta, verilen bir kullanıcı için paketleyici hesabını döner.
- **Yeni Paketleme Kuralları Belirle (POST /setBundleRule):** Bu uç nokta, kullanıcıların paketleme için yeni kurallar belirlemesine veya eski kuralları değiştirmesine olanak tanır; maksimum boyut ve dosya sayısı gibi kısıtlamalar dahil.

Her bir uç noktayla ilgili gerekli parametreler ve yanıt formatları hakkında daha ayrıntılı bilgi için lütfen [https://github.com/node-real/greenfield-bundle-service](https://github.com/node-real/greenfield-bundle-service) adresindeki swagger.yaml dosyasına başvurun.

Detaylı kullanım durumları için, [https://github.com/node-real/greenfield-bundle-service/tree/main/e2e](https://github.com/node-real/greenfield-bundle-service/tree/main/e2e) adresindeki e2e test durumlarına başvurabilirsiniz.

### Uç Noktalar
[NodeReal](https://docs.nodereal.io/docs/greenfield-bundle-service) tarafından açık kaynaklı uygulama

#### Greenfield Test Ağı
Test ağının paket hizmetini kullanarak, paket dosyası Greenfield test ağına yüklenecektir. Uç nokta:
```
https://gnfd-testnet-bundle.nodereal.io
```

#### Greenfield Ana Ağı
Ana ağın paket hizmetini kullanarak, paket dosyası Greenfield ana ağına yüklenecektir. Uç nokta:
```
https://gnfd-mainnet-bundle.nodereal.io