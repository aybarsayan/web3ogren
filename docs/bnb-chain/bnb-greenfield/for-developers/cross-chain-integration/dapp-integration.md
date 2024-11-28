---
title: BSC Akıllı Sözleşmelerinin Greenfield Projeleri ile Entegrasyonu - BNB Greenfield Çapraz Zincir Entegrasyonu
description: Bu belgede, BSC Akıllı Sözleşme SDK'sı kullanımına dair açıklamalar ve bileşen entegrasyonu hakkında bilgi bulunmaktadır. SDK'nın temel bileşenleri, işlevleri ve entegrasyon örnekleri detaylı bir şekilde incelenmektedir.
keywords: [BSC, Akıllı Sözleşme, Greenfield, SDK, Çapraz Zincir, Entegrasyon, Blockchain]
---

# Sözleşme SDK'sı

[Akıllı Sözleşme SDK'sı](https://github.com/bnb-chain/greenfield-contracts-sdk),  
toplum odaklı projelerin geliştirilmesini kolaylaştırmak için tasarlanmıştır. SDK, çapraz zincir iletişimini uygulayan  
[Greenfield-Sözleşmeleri](https://github.com/bnb-chain/greenfield-contracts) kütüphanesi için üst katman bir sarmalayıcı görevi görür.  
Kullanıcı dostu bir arayüz sunarak, SDK geliştirme sürecini basitleştirir ve geliştiricilerin BSC üzerinde akıllı sözleşme  
yoluyla bir dizi greenfield kaynağı oluşturmasını ve yönetmesini sağlar; örneğin, kova, grup ve nesne gibi.

:::tip
BSC Akıllı Sözleşme SDK'sı ile projelerinizi geliştirirken topluluk kaynaklarına daha kolay erişim sağlayabilirsiniz.
:::

SDK, dört ana kısımdan oluşmaktadır: `BaseApp`, `BucketApp`, `ObjectApp` ve `GroupApp`.
Bu bileşenler, geliştiriciler için temel yapı taşlarını sağlar. `BaseApp`, diğer üç bileşenin temeli olup,  
`BucketApp`, `ObjectApp` ve `GroupApp` tarafından gereken ortak fonksiyonları sağlıyor.

> **Not:** Bu bileşenlerin her biri, belirli proje ihtiyaçlarına uygun olarak uygulanabilecek benzersiz fonksiyonlar
ve sanal fonksiyonlar ile donatılmıştır.  
> — BSC SDK Belgelendirme Ekibi

### Bileşenler

1. **BaseApp:** Diğer bileşenler tarafından kullanılan ortak fonksiyonları içerir ve belirli proje gereksinimleri için 
   uygulanması gereken üç sanal fonksiyon içerir.
2. **BucketApp:** Kovali ilgili işlemleri yönetmek için tasarlanmış özel bir modül olup, kova oluşturma, silme ve kova 
   kaynak çağrılarını işlemenin yanı sıra çeşitli fonksiyonlar sunar.
3. **ObjectApp:** Nesne ile ilgili işlemleri yönetmek üzere tasarlanmış özel bir modül olup, BSC'den nesne 
   oluşturma desteği bulunmamaktadır; dolayısıyla, nesne silme işlemleri üzerine odaklanılmıştır.
4. **GroupApp:** Grup ile ilgili işlemleri yönetmek için daha karmaşık bir modül olup, 
   oluşturma, silme ve güncelleme işlemleri ile grup kaynak çağrılarını yönetir.

### BaseApp

BaseApp, BucketApp, ObjectApp ve GroupApp tarafından paylaşılan ortak fonksiyonları içerir.  
Bu fonksiyonlar, çapraz zincir işlemleri için ortamı kurmak ve yönetmek açısından önemlidir.  
BaseApp aşağıdaki temel fonksiyonları sağlar:

1. `_getTotalFee():` Bu fonksiyon, çapraz zincir paketi göndermek için gereken toplam değeri döner.
2. `Setters:` Akıllı sözleşmenin çeşitli yönlerini yapılandırmak için birkaç ayarlayıcı mevcuttur:
   - `callbackGasLimit`: Callback fonksiyonu için gaz limitini ayarlar.
   - `failureHandleStrategy`: Akıllı sözleşmenin yürütülmesi sırasında başarısızlıkları yönetmek için stratejiyi ayarlar.

:::info
Geliştiriciler, BaseApp ile sağlanan ayarlayıcıları kullanarak akıllı sözleşmelerinin parametrelerini kolayca yapılandırabilirler.
:::

Bu fonksiyonlara ek olarak, BaseApp üç sanal fonksiyon sunar:

1. `greenfieldCall(uint32 status, uint8 resourceType, uint8 operationType, uint256 resourceId, bytes calldata callbackData):`  
   Bu fonksiyon, çapraz zincir yanıtını yönetmek için tasarlanmış bir callback kancasıdır. Geliştiricilerin belirli kaynak 
   türleri ve işlem türleri için özel davranışları tanımlaması gereken sanal bir fonksiyondur. Bu fonksiyon, greenfield 
   tarafında bir çapraz zincir işlemi tamamlandığında tetiklenir ve BSC'ye bir paket döner. Geliştiricilerin belirli eylemleri 
   gerçekleştirmesine veya bir işlemin tamamlanmasına yanıt olarak durumları güncellemesine olanak tanır. 
   Geliştiricilerin callback'e ihtiyaç duymadığı takdirde, bu fonksiyon (ve diğer callback ile ilgili fonksiyonlar) tanımsız hale getirilebilir.
2. `retryPackage(uint8 resourceType):` Bu fonksiyon, kaynak türüne dayalı olarak bir paketin yeniden deneme mekanizmasını yönetir.  
   Geliştiricilerin, bir paketin yeniden denenmesi gerektiğinde davranışı tanımlamak için bu fonksiyonu uygulaması gerekir.
3. `skipPackage(uint8 resourceType):` Bu fonksiyon, kaynak türüne dayalı olarak bir paketin atlanmasını sağlar.  
   Geliştiricilerin, bir paketin atlanması gerektiğinde davranışı tanımlamak için bu fonksiyonu uygulaması gerekir.

Bu sanal fonksiyonları uygulayarak, geliştiriciler akıllı sözleşmelerinin davranışını belirli gereksinimlerini karşılayacak şekilde özelleştirebilirler.  
BaseApp bileşeni ile geliştiriciler, `BucketApp`, `ObjectApp` ve `GroupApp` kullanarak akıllı sözleşme uygulamalarını inşa etmek için sağlam bir temel elde ederler.

### BucketApp

BucketApp bileşeni, akıllı sözleşme SDK'sındaki kova ile ilgili işlemleri yönetmek için tasarlanmış özel bir modüldür.  
Bu bileşen, kovalar oluşturma, silme ve yönetmenin yanı sıra çeşitli kova kaynak işlemlerini yönlendirmek ve işlemek için bir dizi fonksiyon sunar.  
Aşağıda, BucketApp'de bulunan fonksiyonların detaylı bir özeti verilmiştir:

1. `_bucketGreenfieldCall(uint32 status, uint8 operationType, uint256 resourceId, bytes calldata callbackData)`:  
   Bu fonksiyon, kova kaynak callback'i için bir yönlendirici görevi görür. Sağlanan parametrelere göre çağrıyı işler ve yönlendirir.
2. `_retryBucketPackage()`: Bu fonksiyon, başarısız bir kova kaynak paketini yeniden dener.
3. `_skipBucketPackage()`: Bu fonksiyon, başarısız bir kova kaynak paketini atlar.
4. `_createBucket(address _creator, string memory _name, BucketStorage.BucketVisibilityType _visibility, address _paymentAddress, address _spAddress, uint256 _expireHeight, uint32 _globalVirtualGroupFamilyId, bytes calldata _sig, uint64 _chargedReadQuota)`:  
   Bu fonksiyon, callback olmadan greenfield'e bir kova oluşturma çapraz zincir isteği gönderir. Çeşitli parametreler alır; örneğin, yaratıcı, isim, görünürlük türü, ücretli okuma kotası, hizmet sağlayıcı adresi, sona erme yüksekliği, küresel sanal aile kimliği ve imza.
5. `_createBucket(address _creator, string memory _name, BucketStorage.BucketVisibilityType _visibility, address _paymentAddress, address _spAddress, uint256 _expireHeight, uint32 _globalVirtualGroupFamilyId, bytes calldata _sig, uint64 _chargedReadQuota, address _refundAddress, PackageQueue.FailureHandleStrategy _failureHandleStrategy, bytes memory _callbackData, uint256 _callbackGasLimit)`:  
   Bu fonksiyon, bir callback ile birlikte greenfield'e bir kova oluşturma çapraz zincir isteği gönderir. Önceki fonksiyonla aynı parametreleri alır, ek olarak callback için bazı parametreler içerir.
6. `_deleteBucket(uint256 _tokenId)`: Bu fonksiyon, sağlanan token ID'sini kullanarak greenfield'e bir kova silme çapraz zincir isteği gönderir.
7. `_deleteBucket(uint256 _tokenId, address _refundAddress, PackageQueue.FailureHandleStrategy _failureHandleStrategy, bytes memory _callbackData, uint256 _callbackGasLimit)`:  
   Bu fonksiyon, sağlanan token ID'si ve callback verisi ile birlikte greenfield'e bir kova silme çapraz zincir isteği gönderir.

:::warning
BucketApp bileşeninde dikkat edilmesi gereken önemli noktalar arasında, kullanıcıların yalnızca doğru token ID'si ile  
işlem yapması gerektiği yer almaktadır. Aksi takdirde, beklenmedik sonuçlarla karşılaşabilirler.
:::

Bu fonksiyonlara ek olarak, BucketApp iki sanal fonksiyon sunar:

1. `_createBucketCallback(uint32 _status, uint256 _tokenId, bytes memory _callbackData)`:  
   Geliştiriciler, kova oluşturma callback'i için davranışı tanımlamak üzere bu fonksiyonu uygulayabilir. Fonksiyon, durum, token ID ve callback verilerini parametre olarak alır.
2. `_deleteBucketCallback(uint32 _status, uint256 _tokenId, bytes memory _callbackData)`:  
   Geliştiriciler, kova silme callback'i için davranışı tanımlamak üzere bu fonksiyonu uygulayabilir. Fonksiyon, durum, token ID ve callback verilerini parametre olarak alır.

Bu sanal fonksiyonları uygulayarak, geliştiriciler BucketApp bileşenini belirli kova ile ilgili işlemlerine uyacak şekilde özelleştirebilir ve gereken callback'leri yönetebilirler.

### ObjectApp

ObjectApp bileşeni, akıllı sözleşme SDK'sında nesne ile ilgili işlemleri yönetmek için tasarlanmış özel bir modüldür.  
Bu bileşen, nesneleri yönetmek ve nesne kaynak işlemlerini işlemek için bir dizi fonksiyon sunar. Ancak, lütfen  
BSC'den nesne oluşturmanın şu anda desteklenmediğini unutmayın. Aşağıda, ObjectApp'de bulunan fonksiyonların  
detaylı bir özeti verilmiştir:

1. `_objectGreenfieldCall(uint32 status, uint8 operationType, uint256 resourceId, bytes calldata callbackData)`:  
   Bu fonksiyon, nesne kaynak callback'i için bir yönlendirici görevi görür. Sağlanan parametrelere göre çağrıyı işler ve yönlendirir.
2. `_retryObjectPackage()`: Bu fonksiyon, başarısız bir nesne kaynak paketini yeniden dener.
3. `_skipObjectPackage()`: Bu fonksiyon, başarısız bir nesne kaynak paketini atlar.
4. `_deleteObject(uint256 _tokenId)`: Bu fonksiyon, sağlanan token ID'sini kullanarak bir nesneyi siler. BSC'den nesne oluşturma desteği bulunmadığı için, ObjectApp silme işlemleri üzerine odaklanmaktadır.
5. `_deleteObject(uint256 _tokenId, address _refundAddress, PackageQueue.FailureHandleStrategy _failureHandleStrategy, bytes memory _callbackData, uint256 _callbackGasLimit)`:  
   Bu fonksiyon, sağlanan token ID'si ve callback verisi ile birlikte bir nesneyi siler.

:::note
Geliştiriciler, ObjectApp ile yalnızca nesne silme işlemlerini gerçekleştirebilmektedir. Nesne oluşturma özelliği şu anda mevcut değildir.
:::

Bu fonksiyonlara ek olarak, ObjectApp bir sanal fonksiyon sunar:

1. `_deleteObjectCallback(uint32 _status, uint256 _tokenId, bytes memory _callbackData)`:  
   Geliştiricilerin, nesne silme callback'i için davranışı tanımlamak üzere bu fonksiyonu uygulaması gerekir. Fonksiyon, durumu, token ID'sini ve callback verilerini parametre olarak alır.

Bu sanal fonksiyonu uygulayarak, geliştiriciler ObjectApp bileşenini nesne silme işlemlerini yönetmek ve gereken callback'leri yönetmek üzere özelleştirebilirler.

### GroupApp

GroupApp bileşeni, akıllı sözleşme SDK'sında grup ile ilgili işlemleri yönetmek için tasarlanmış özel bir modüldür.  
Bu bileşen, BucketApp ve ObjectApp'dan daha karmaşık olup, grup oluşturma, silme, güncelleme ve yönetme  
fonksiyonları sunar. Aşağıda, GroupApp'de bulunan fonksiyonların detaylı bir özeti verilmiştir:

1. `_groupGreenfieldCall(uint32 status, uint8 operationType, uint256 resourceId, bytes calldata callbackData)`:  
   Bu fonksiyon, grup kaynak callback'i için bir yönlendirici görevi görür. Sağlanan parametrelere göre çağrıyı işler ve yönlendirir.
2. `_retryGroupPackage()`: Bu fonksiyon, başarısız bir grup kaynak paketini yeniden dener.
3. `_skipGroupPackage()`: Bu fonksiyon, başarısız bir grup kaynak paketini atlar.
4. `_createGroup(address _owner, string memory _groupName)`: Bu fonksiyon, sağlanan sahip adresi ve grup adı ile yeni bir grup oluşturur.
5. `_createGroup(address _refundAddress, PackageQueue.FailureHandleStrategy _failureHandleStrategy, bytes memory _callbackData,, address _owner, string memory _groupName, uint256 _callbackGasLimit)`:  
   Bu fonksiyon, sağlanan sahip adresi, grup adı ve callback verisi ile birlikte yeni bir grup oluşturur.
6. `_deleteGroup(uint256 _tokenId)`: Bu fonksiyon, sağlanan token ID'sini kullanarak bir grubu siler.
7. `_deleteGroup(uint256 _tokenId, address _refundAddress, PackageQueue.FailureHandleStrategy _failureHandleStrategy, bytes memory _callbackData, uint256 _callbackGasLimit)`:  
   Bu fonksiyon, sağlanan token ID'si ve callback verisi ile birlikte bir grubu siler.
8. `_updateGroup(address _owner, uint256 _tokenId, uint8 _opType, address[] memory _members, uint64[] memory _expiration)`:  
   Bu fonksiyon, sağlanan sahip adresi, token ID'si, işlem türü ve bir dizi üye adresine göre bir grubu günceller.
9. `_updateGroup(address _owner, uint256 _tokenId, uint8 _opType, address[] memory _members, uint64[] memory _expiration, address _refundAddress, PackageQueue.FailureHandleStrategy _failureHandleStrategy, bytes memory _callbackData, uint256 _callbackGasLimit)`:  
   Bu fonksiyon, sağlanan sahip adresi, token ID'si, işlem türü, bir dizi üye adresi ve callback verisi ile birlikte bir grubu günceller.

:::danger
GroupApp dâhilindeki işlemleri gerçekleştirmeden önce kapsamlı bir test yapmalısınız çünkü geri alınamayan kayıplar yaşanabilir.
:::

Bu fonksiyonlara ek olarak, GroupApp üç sanal fonksiyon sunar:

1. `_createGroupCallback(uint32 _status, uint256 _tokenId, bytes memory _callbackData)`:  
   Geliştiricilerin bu fonksiyonu uygulayarak grup oluşturma callback'i için davranışı tanımlaması gerekir. Fonksiyon, durumu, token ID'sini ve callback verilerini parametre olarak alır.
2. `_deleteGroupCallback(uint32 _status, uint256 _tokenId, bytes memory _callbackData)`:  
   Geliştiricilerin bu fonksiyonu uygulayarak grup silme callback'i için davranışı tanımlaması gerekir. Fonksiyon, durumu, token ID'sini ve callback verilerini parametre olarak alır.
3. `_updateGroupCallback(uint32 _status, uint256 _tokenId, bytes memory _callbackData)`:  
   Geliştiricilerin bu fonksiyonu uygulayarak grup güncelleme callback'i için davranışı tanımlaması gerekir. Fonksiyon, durumu, token ID'sini ve callback verilerini parametre olarak alır.

Bu sanal fonksiyonları uygulayarak, geliştiriciler GroupApp bileşenini belirli grup ile ilgili işlemlerine uyacak şekilde özelleştirebilir ve gereken callback'leri yönetebilirler.

---

## Entegrasyon Örneği

Akıllı sözleşme SDK'sını kullanarak merkeziyetsiz bir `Ekitap` dükkanı oluşturma sürecini örnek olarak inceleyeceğiz.

### Ön Gereksinimler

Başlamadan önce, aşağıdaki araçların yüklü olduğundan emin olun:

- [Node.js](https://nodejs.org/)
- [Foundry](https://book.getfoundry.sh/)

### Kurulum

```console
$ npm install @bnb-chain/greenfield-contracts-sdk
```

Alternatif olarak, sözleşmeleri doğrudan GitHub deposundan (`bnb-chain/greenfield-contracts-sdk`) alabilirsiniz.  
Bunu yaparken, uygun sürümü belirttiğinizden emin olun.

---
title: Adımlar
description: Bu makalede, bir EbookShop akıllı sözleşmesinin geliştirilmesine yönelik adımlar ele alınmaktadır. İçerdiği farklı fonksiyonlar ve uygulama süreçleri ile kullanıcıların kendi kaynaklarını nasıl oluşturabileceği ve kaydedebileceği anlatılmaktadır.
keywords: [EbookShop, akıllı sözleşme, Solidity, dApp, gelişim adımları, Ethereum, BSC]
---

#### Adımlar

1. İstenilen sözleşmeleri içe aktarın, örneğin `examples/ebook-shop.sol`:

   ```solidity
   pragma solidity ^0.8.0;
   
   import "@bnb-chain/greenfield-contracts-sdk/BucketApp.sol";
   import "@bnb-chain/greenfield-contracts-sdk/ObjectApp.sol";
   import "@bnb-chain/greenfield-contracts-sdk/GroupApp.sol";
   import "@bnb-chain/greenfield-contracts-sdk/interface/IERC1155.sol";
   import "@bnb-chain/greenfield-contracts-sdk/interface/IERC721NonTransferable.sol";
   import "@bnb-chain/greenfield-contracts-sdk/interface/IERC1155NonTransferable.sol";
   ...
   
   contract EbookShop is BucketApp, ObjectApp, GroupApp {
   	...
   }
   ```

2. `initialize` fonksiyonunu tanımlayın. Global değişkenleri init fonksiyonunda başlatın. İçsel init fonksiyonlarını kullanabilirsiniz:

   ```solidity
   function initialize(
       address _crossChain,
       address _bucketHub,
       address _objectHub,
       address _groupHub,
       address _ebookToken,
       address _paymentAddress,
       uint256 _callbackGasLimit,
       address _refundAddress,
       uint8 _failureHandleStrategy,
       ...
   ) public initializer {
       __base_app_init_unchained(_crossChain, _callbackGasLimit, _refundAddress, _failureHandleStrategy);
       __bucket_app_init_unchained(_bucketHub);
       __group_app_init_unchained(_groupHub);
       __object_app_init_unchained(_objectHub);
   
       ...
   }
   ```

3. dApp'iniz geri çağrıya ihtiyaç duyuyorsa `greenfieldCall`, `retryPackage` ve `skipPackage` fonksiyonlarını tanımlayın ve geçersiz kılın. Çağrıları içsel yöntem yardımıyla yönlendirebilirsiniz:

   ```solidity
   function greenfieldCall(
       uint32 status,
       uint8 resoureceType,
       uint8 operationType,
       uint256 resourceId,
       bytes calldata callbackData
   ) external override(BucketApp, ObjectApp, GroupApp) {
       require(msg.sender == crossChain, string.concat("EbookShop: ", ERROR_INVALID_CALLER));
   
       if (resoureceType == RESOURCE_BUCKET) {
           _bucketGreenfieldCall(status, operationType, resourceId, callbackData);
       } else if (resoureceType == RESOURCE_OBJECT) {
           _objectGreenfieldCall(status, operationType, resourceId, callbackData);
       } else if (resoureceType == RESOURCE_GROUP) {
           _groupGreenfieldCall(status, operationType, resourceId, callbackData);
       } else {
           revert(string.concat("EbookShop: ", ERROR_INVALID_RESOURCE));
       }
   }

   function retryPackage(uint8 resoureceType) external override onlyOperator {
       if (resoureceType == RESOURCE_BUCKET) {
           _retryBucketPackage();
       } else if (resoureceType == RESOURCE_OBJECT) {
           _retryObjectPackage();
       } else if (resoureceType == RESOURCE_GROUP) {
           _retryGroupPackage();
       } else {
           revert(string.concat("EbookShop: ", ERROR_INVALID_RESOURCE));
       }
   }

   function skipPackage(uint8 resoureceType) external override onlyOperator {
       if (resoureceType == RESOURCE_BUCKET) {
           _skipBucketPackage();
       } else if (resoureceType == RESOURCE_OBJECT) {
           _skipObjectPackage();
       } else if (resoureceType == RESOURCE_GROUP) {
           _skipGroupPackage();
       } else {
           revert(string.concat("EbookShop: ", ERROR_INVALID_RESOURCE));
       }
   }
   ```

4. Ardından uygulamanın temel işlevsel parçalarını tanımlamanız gerekiyor. Aşağıdaki gibi içsel fonksiyonlar yardımıyla sistem sözleşmelerine çapraz zincir isteği gönderebilirsiniz:

   ```solidity
   /**
    * @dev Yeni bir seri oluştur.
    * 
    * Sağlayıcının bilgileri ön yüz tarafından sağlanacak varsayılmaktadır.
    */
   function createSeries(
       string calldata name,
       BucketStorage.BucketVisibilityType visibility,
       uint64 chargedReadQuota,
       address spAddress,
       uint256 expireHeight,
       bytes calldata sig
   ) external payable {
       require(bytes(name).length > 0, string.concat("EbookShop: ", ERROR_INVALID_NAME));
       require(seriesId[name] == 0, string.concat("EbookShop: ", ERROR_RESOURCE_EXISTED));
   
       bytes memory _callbackData = bytes(name); // adını geri çağırma verisi olarak kullan
       _createBucket(msg.sender, name, visibility, chargedReadQuota, spAddress, expireHeight, sig, _callbackData); // çapraz zincir isteği gönder
   }

   /**
    * @dev Bir ebook'un kimliğini sağlayarak onu yayınlayın.
    *
    * Sahibi için bir ERC1155 token oluşturulacaktır.
    * Diğer kullanıcılar, belirtilen fiyatla `buyEbook` fonksiyonunu çağırarak ebook'u satın alabilir.
    */
   function publishEbook(uint256 _ebookId, uint256 price) external {
       require(
           IERC721NonTransferable(objectToken).ownerOf(_ebookId) == msg.sender,
           string.concat("EbookShop: ", ERROR_INVALID_CALLER)
       );
       require(ebookGroup[_ebookId] != 0, string.concat("EbookShop: ", ERROR_GROUP_NOT_EXISTED));
       require(price > 0, string.concat("EbookShop: ", ERROR_INVALID_PRICE));
   
       ebookPrice[_ebookId] = price;
       IERC1155(ebookToken).mint(msg.sender, _ebookId, 1, "");
   }
       
   /**
    * @dev Bir ebook'un kimliğini sağlayarak satın alın.
    *
    * Alıcı, ebook'un grubuna eklenir.
    * Alıcıya bir ERC1155 token oluşturulacaktır.
    */
   function buyEbook(uint256 _ebookId) external payable {
       require(ebookPrice[_ebookId] > 0, string.concat("EbookShop: ", ERROR_EBOOK_NOT_ONSHELF));
   
       uint256 price = ebookPrice[_ebookId];
       require(msg.value >= price, string.concat("EbookShop: ", ERROR_NOT_ENOUGH_VALUE));
   
       IERC1155(ebookToken).mint(msg.sender, _ebookId, 1, "");
   
       uint256 _groupId = ebookGroup[_ebookId];
       address _owner = IERC721NonTransferable(groupToken).ownerOf(_groupId);
       address[] memory _member = new address[](1);
       _member[0] = msg.sender;
       _updateGroup(_owner, _groupId, UPDATE_ADD, _member);
   }

   /**
    * @dev Bir ebook'un kimliğini sağlayarak onu indirin.
    *
    * Ebook, raftan kaldırılacak ve satın alınamayacaktır.
    * Zaten satın alanlar etkilenmeyecektir.
    */
   function downshelfEbook(uint256 _ebookId) external {
       require(
           IERC721NonTransferable(objectToken).ownerOf(_ebookId) == msg.sender,
           string.concat("EbookShop: ", ERROR_INVALID_CALLER)
       );
       require(ebookPrice[_ebookId] > 0, string.concat("EbookShop: ", ERROR_EBOOK_NOT_ONSHELF));
   
       ebookPrice[_ebookId] = 0;
   }
   ...
   ```

5. Ayrıca, kullanıcının yeşil alanda oluşturulan ve ardından BSC'ye manuel olarak yansıtılan kendi kaynaklarını kaydetmesi için bir fonksiyona ihtiyacınız olabilir:

   ```solidity
   /**
    * @dev GreenField'dan BSC'ye yansıtılan bucket kaynağını kaydet.
    */
   function registerSeries(string calldata name, uint256 tokenId) external {
       require(
           IERC721NonTransferable(bucketToken).ownerOf(tokenId) == msg.sender,
           string.concat("EbookShop: ", ERROR_INVALID_CALLER)
       );
       require(bytes(name).length > 0, string.concat("EbookShop: ", ERROR_INVALID_NAME));
       require(seriesId[name] == 0, string.concat("EbookShop: ", ERROR_RESOURCE_EXISTED));
   
       seriesName[tokenId] = name;
       seriesId[name] = tokenId;
   }
   ...
   ```

6. Kendi ihtiyaçlarınıza göre diğer görünüm fonksiyonlarını, iç fonksiyonları ve erişim kontrol sistemini tanımlayın.

:::tip 
Kullanıcıların başvurabileceği işlevler ve bunların kullanımına dair en iyi uygulamaları belirlemek için, belgeleri gözden geçirmenizi öneririz.
:::