````markdown
---
title: Yeniden Başlatılabilir Yükleme/İndirme Demo - BNB Greenfield Dosya Yönetimi
description: Bu döküman, BNB Greenfield üzerinde yeniden başlatılabilir yükleme ve indirme işlemlerini detaylandırmaktadır. Yükleme ve indirme süreçlerinin nasıl çalıştığını ve örneklerle detaylandırarak kullanıcıların bu özelliklerden nasıl yararlanabileceğini açıklamaktadır.
keywords: [yeniden başlatılabilir yükleme, yeniden başlatılabilir indirme, BNB Greenfield, dosya yönetimi, Go-SDK]
---

# Yeniden Başlatılabilir Yükleme & Yeniden Başlatılabilir İndirme

* Yeniden başlatılabilir yükleme, dosyaların birden fazla parçaya bölünerek yüklenmesine olanak tanıyan bir özelliktir. Bu, kesintiler veya hatalar durumunda yükleme işleminin kaldığı yerden devam ettirilmesini sağlar. Bu, büyük dosyalar veya ağ bağlantısının güvenilir olmayabileceği durumlar için özellikle yararlıdır.
* Yeniden başlatılabilir indirme, kullanıcıların indirme işlemini duraklatmasına veya kesintiye uğratmasına ve daha sonra devam ettirmesine olanak tanıyan yaygın bir indirme yöntemidir. Bir kullanıcı büyük bir dosya indirmeyi talep ettiğinde, genellikle birden fazla sabit boyutta parçaya bölünür ve indirme işlemi HTTP Range istek başlığını kullanarak indirme için başlangıç ve bitiş pozisyonlarını belirler. Kullanıcı indirmeyi duraklatırsa veya kesintiye uğratırsa, sonraki istek, indirmeyi tamamen yeniden indirmeden son pozisyondan devam ettirmek için uygun bir Range alanı ile bir istek göndererek devam edebilir.

## Yeniden Başlatılabilir Yükleme

Yeniden başlatılabilir yükleme, bir dosyanın birden fazla parçaya bölünerek yüklendiği süreci ifade eder; her bir parça ayrı ayrı yüklenir. Bu, kesintiler veya hatalar durumunda yüklemenin kaldığı yerden devam ettirilmesini sağlar; yükleme sürecine tamamen yeniden başlama gereksinimini ortadan kaldırır.

### :::tip
Yeniden başlatılabilir yükleme hizmeti, yükleme işlemlerini daha güvenilir hale getirir ve kesinti durumlarında verimliliği artırır.
:::

Yeniden başlatılabilir yükleme sırasında, `PutObject` işlemi sırasında bir hata meydana gelirse, sonraki yükleme girişimleri öncelikle sunucu tarafında önceki yüklemenin ilerlemesini sorgular. Ardından, yüklemeye son konumdan devam eder.

### Yükleme Süreci Genel Görünümü

![yeniden-baslatilabilir-yukleme-genel-gorunum](../../../../../../images/bnb-chain/bnb-greenfield/for-developers/tutorials/app/file-management/resumable-upload/12-Resumable-Upload.png)

1. Nesneyi yüklemek için ilk `PutObject` işlemini başlatın.
2. Yükleme sırasında bir hata meydana gelirse, örneğin bir ağ kesintisi veya sunucu hatası gibi, yükleme işlemi kesintiye uğrar.
3. Yüklemeyi yeniden başlatırken, sonraki `PutObject` işlemi sunucuya önceki yüklemenin ilerlemesini almak için bir sorgu başlatır.
4. Sunucu, yüklemenin yeniden başlaması gereken son konumu döner.
5. `PutObject` işlemi, sunucudan alınan konumdan yükleme işlemini yeniden başlatır.
6. Yükleme işlemi tamamlanana kadar kesinti noktasından devam eder.

### PutObject Seçenekleri

Greenfield GO-SDK API'sındaki `PutObject` işlemi, bir nesneyi bir kova yüklemenize olanak tanır. `PutObjectOptions` yapısı aracılığıyla yapılandırma için ek seçenekler sunar. Bu belgede, `PutObjectOptions` yapısına eklenen iki yeni seçenek açıklanmaktadır.

- **PartSize (Varsayılan: 16 MB)**  
  `PartSize` seçeneği, büyük nesneleri yüklerken her parçanın boyutunu belirler. Eğer nesnenin boyutu `PartSize` değerinden küçükse, tek bir parça olarak yüklenecektir. Ancak, nesne boyutu daha büyükse ve `DisableResumable` seçeneği `false` olarak ayarlandığında, yeniden başlatılabilir yükleme etkinleştirilir.

Yeniden başlatılabilir yüklemenin parça boyutunu belirtin; büyük bir dosyayı birden fazla parçaya bölerek yüklemeyi sağlayın. Parça boyutu, segment boyutunun tam katıdır.

- **DisableResumable (Varsayılan: false)**  
  `DisableResumable` seçeneği, yeniden başlatılabilir yüklemenin etkin olup olmadığını belirler. `false` olarak ayarlandığında, kesintiye uğradığında veya başarısız olduğunda yüklemenin yeniden başlatılmasını sağlayan yeniden başlatılabilir yükleme etkinleştirilir. Bu, büyük nesneler için özellikle yararlıdır. `true` olarak ayarlandığında, yeniden başlatılabilir yükleme devre dışı bırakılır.

Yeniden başlatılabilir yüklemenin etkinleştirilip etkinleştirilmeyeceğini belirtir. Yeniden başlatılabilir yükleme, bir dosyanın birden fazla parçaya bölünerek yüklendiği süreçtir; her parça ayrı ayrı yüklenir. Bu, yüklemenin kesintiye uğradığında veya başarısız olduğunda kaldığı yerden devam ettirilmesini sağlar; yükleme sürecine tamamen yeniden başlama gereksinimini ortadan kaldırır.

### Kullanım Örneği

```go
var buffer bytes.Buffer
err := s.Client.PutObject(
    ctx,
    bucketName,
    objectName,
    int64(buffer.Len()),
    bytes.NewReader(buffer.Bytes()),
    types.PutObjectOptions{
        PartSize:        1024 * 1024 * 16, // 16 MB
        DisableResumable: false,
    },
)
```

Yukarıdaki örnekte, nesne verilerini tutmak için **`buffer`** adlı bir **`bytes.Buffer`** oluşturuyoruz. Ardından, belirtilen kova ve nesne adıyla nesneyi yüklemek için **`PutObject`** işlemini kullanıyoruz. İstediğimiz seçeneklerle **`PutObjectOptions`** yapısı geçirilmektedir. Bu durumda, **`PartSize`** varsayılan değer olan 16 MB olarak ayarlanmış ve **`DisableResumable`** yeniden başlatılabilir yüklemeyi etkinleştirmek için false olarak ayarlanmıştır.

> **Not:** Yer tutucu değerleri (**`s.Client`**, **`s.ClientContext`**, **`bucketName`**, ve **`objectName`**) gerçek kodunuza uygun değişkenler veya değerlerle değiştirmeniz gerektiğini unutmayın.

## Yeniden Başlatılabilir İndirme

S3 Client API'sindeki `FGetObjectResumable` işlevi, büyük dosyalar için yeniden başlatılabilir indirmeler gerçekleştirmenizi sağlar. Bu işlev, belirlenen kova ve nesne adından bir dosyayı bir yerel dosyaya indirir; hatalar veya kesintiler durumunda indirmenin yeniden başlatılabilmesi özelliğine sahiptir.

### İndirme Süreci Genel Görünümü

1. Dosyayı indirmek için ilk `FGetObjectResumable` işlevini başlatın.
2. İndirme işlemi sırasında işlev, dosyanın parçalarını sunucu tarafında alır ve bunları `object_{operatoraddress}{getrange}.tmp` dosyasına ekler.
3. İndirme sırasında bir hata meydana gelirse, örneğin bir ağ kesintisi veya sunucu hatası gibi, indirme işlemi kesintiye uğrar.
4. İndirmeyi yeniden başlatırken, sonraki `FGetObjectResumable` işlevi önce `object_{operatoraddress}{getrange}.tmp` dosyasının var olup olmadığını kontrol eder.
5. Eğer `object_{operatoraddress}{getrange}.tmp` dosyası mevcutsa, işlev kısmen indirilmiş dosyanın bütünlüğünü sağlamak için kontrol toplamını doğrular.
6. Eğer `object_{operatoraddress}{getrange}.tmp` dosyası yoksa veya kontrol toplamı geçersizse, işlev sunucudan nesneyi taze bir indirime başlar.
7. İndirme işlemi son konumdan devam eder ve parçaları `object_{operatoraddress}{getrange}.tmp` dosyasına eklemeye devam eder.
8. İndirme tamamlandığında, `object_{operatoraddress}{getrange}.tmp` dosyası gerektiği gibi yeniden adlandırılabilir veya işlenebilir.

### Kullanım Örneği

```
err = s.Client.FGetObjectResumable(
    s.ClientContext,
    bucketName,
    objectName,
    newFile,
    types.GetObjectOptions{},
)
```

Yukarıdaki örnekte, belirtilen kova ve nesne adından bir dosyanın yeniden başlatılabilir indirmesini gerçekleştirmek için **`FGetObjectResumable`** işlevini kullanıyoruz. İndirme sırasında hata meydana geldiğinde, sonraki işlev çağrıları **`object_{operatoraddress}{getrange}.tmp`** dosyasının varlığını ve geçerliliğini kontrol edecek ve indirmeyi son konumdan tekrar başlatacaktır.

### Kaynak kodu
* [Go-SDK demo](https://github.com/bnb-chain/greenfield-go-sdk/blob/4940fb69df1258fcb232b92e1ed4894ead516583/e2e/e2e_storage_test.go#L452)
````