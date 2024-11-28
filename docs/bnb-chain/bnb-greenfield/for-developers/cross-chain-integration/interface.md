---
title: EVM Programlanabilirliği - BNB Greenfield Çapraz Zincir
description: Bu belge, geliştiricilerin EVM uyumlu zincirlerde yeşil alan kaynaklarını doğrudan yönetmelerini sağlamak için çapraz zincir primitiflerine dair ayrıntılı bir tanıtım sunmaktadır. EVM ile BNB Greenfield arasındaki etkileşim, geliştiricilerin uygulamalarında güvenli ve etkili bir iletişim ortamı oluşturmasını sağlıyor.
keywords: [EVM, BNB, Greenfield, çapraz zincir, akıllı sözleşmeler, geliştirme, kaynak yönetimi]
---

# EVM Programlanabilirliği

Bu belge, geliştiricilerin EVM uyumlu zincirlerde yeşil alan kaynaklarını doğrudan yönetmelerini sağlamak için **EVM uyumlu zincirlerde** tanımlanmış çapraz zincir primitiflerine dair ayrıntılı bir tanıtım sunmaktadır.

:::info 
**Greenfield-Contracts Repo** [Greenfield-Contracts Repo](https://github.com/bnb-chain/greenfield-contracts), çapraz zincir iletişim protokolünün temel omurgasıdır. Bu kütüphane, Greenfield ile EVM uyumlu zincirler (BSC ve opBNB gibi) arasında sorunsuz etkileşimi sağlayan temel çapraz zincir iletişim işlevselliğini uygulamakla sorumludur.
:::

Kütüphane, çapraz zincir işlemlerinin karmaşıklıklarını yöneterek güvenli ve etkili iletişimi sağlar. 

Geliştirme sürecinde, geliştiricilerin muhtemelen etkileşimde bulunacakları sözleşmeler: `CrossChain`, `BucketHub`, `ObjectHub`, `GroupHub`, `PermissionHub`, `MultiMessage` ve `GreenfieldExecutor`.

## Hızlı Bakış

| Sözleşme Adı      | Kullanım                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GovHub             | Sistem yönetişim taleplerini yönetir                                                                                                                                                                                                                                                                                                                                                                                                        |
| CrossChain         | Çapraz zincir paketini yönetir                                                                                                                                                                                                                                                                                                                                                                                                             |
| TokenHub           | BNB'yi BSC’den Greenfield'a transfer eder                                                                                                                                                                                                                                                                                                                                                                                                    |
| LightClient        | Çapraz zincir paketini doğrular ve hafif bloğu senkronize eder                                                                                                                                                                                                                                                                                                                                                                               |
| RelayerHub         | Relayer'lar RelayerHub'dan ödül talep edebilir                                                                                                                                                                                                                                                                                                                                                                                              |
| BucketHub          | Kova oluşturur/siler                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ObjectHub          | Nesneyi siler                                                                                                                                                                                                                                                                                                                                                                                                                               |
| GroupHub           | Grup oluşturur/siler, grup üyelerini günceller                                                                                                                                                                                                                                                                                                                                                                                              |
| BucketERC721Token  | Kovaların sahipliğini temsil eden ERC721 token adresi                                                                                                                                                                                                                                                                                                                                                                                       |
| ObjectERC721Token  | Nesnelerin sahipliğini temsil eden ERC721 token adresi                                                                                                                                                                                                                                                                                                                                                                                       |
| GroupERC721Token   | Grupların sahipliğini temsil eden ERC721 token adresi                                                                                                                                                                                                                                                                                                                                                                                      |
| MemberERC1155Token | Grup üyelerinin kimliğini temsil eden ERC1155 token adresi                                                                                                                                                                                                                                                                                                                                                                                 |
| PermissionHub      | Kullanıcı, diğer hesaplara izin vermek için Kaynak Tabanlı Politika kullanabilir. Kova, nesne ve grup gibi herhangi bir kaynak, birkaç politikayla ilişkilendirilebilir. Yalnızca kaynak sahibinin, sahip olduğu bir kaynağa ilişkin bir politikayı belirlemesine izin verilir. 1. Bir kovayla ilişkili bir politika, alıcıya kovayı veya belirli nesneleri işlemesine izin verebilir. 2. Bir nesne/grup ile ilişkili bir politika, yalnızca nesne/grubu işlemesine izin verebilir. |
| PermissionToken    | Kaynak politikasını temsil eden ERC721 token adresi                                                                                                                                                                                                                                                                                                                                                                                         |
| MultiMessage       | MultiMessage, birleştirilmiş işlemlerin atomikliğini desteklemek için toplama yetenekleri sağlar.                                                                                                                                                                                                                                                                                                                                          |
| GreenfieldExecutor | Çoğu yerel işlem, GreenfieldExecutor ile gerçekleştirilebilir; ödeme hesabı oluşturma, ödeme hesabına para yatırma, ödeme hesabından para çekme, kova taşıma, kova taşıma iptali, kova bilgilerini güncelleme, SP’yi delege edilmiş ajan olarak ayarlama, kova akış oran limitini belirleme, nesneyi kopyalama, nesne bilgilerini güncelleme, etiket ayarlama gibi.                                                                                |

Ayrıntılı sözleşme adresleri için `sözleşme listesine` bakın.

---

## Geri Çağırma Yönetimi

EVM uyumlu zincirlerdeki dApp'ler, yani BSC'deki akıllı sözleşmeler, ACK ve FAIL_ACK paketlerini yönetmek için kendi mantıklarını uygulama hakkına sahiptir. Akıllı sözleşmeler, **ACK paketlerini yönetmek** için geri çağırma işlevlerini kaydedebilir. Geri çağırmalarda çok fazla gaz tüketiminden kaçınmak için, geri çağırmaları kaydeden akıllı sözleşmeler tarafından bir gaz limit tahmini yapılmalıdır.

:::tip
Çapraz zincir iletişimi sırasında hatalar ve başarısızlıklar meydana gelebilir. EVM uyumlu zincirlerdeki dApp’ler, paketi daha yüksek bir gaz limiti ile tekrar deneyerek, paketi atlayarak başarısızlığı tolere ederek veya köşe senaryolarını yönetmek için sözleşmelerini güncelleyerek bu durumları yönetebilir.
:::

Aşağıdakiler, dApp'lerin başarısızlıkları **yönetmesi** için arayüzlerdir:

```solidity
 // kuyruktaki ilk başarısız paketi tekrar dener
 function retryPackage() external;
 // kuyruktaki ilk başarısız paketi atlar
 function skipPackage() external;
```

## İzin Programlanabilirliği

Kaynaklar BSC'de oluşturulmuş veya Greenfield'den BSC'ye haritalanmış olsa da, örneğin Kovalar, Nesneler ve Gruplar, varsayılan olarak, bu kaynakların yalnızca sahibi hesap tarafından yönetilebilir. Ancak uygun yetkilendirme ile, diğer hesapların veya sözleşmelerin sahibin kaynaklarını işlemesine izin verilebilir. İki yetkilendirme yöntemi sunuyoruz:

### Rol Tabanlı Yetkilendirme

BucketHub, ObjectHub ve GroupHub, aşağıdaki arayüzü uygular. `grant` arayüzü aracılığıyla, diğer hesapların bu tür bir kaynağı belirli bir süre boyunca oluşturma, silme ve güncelleme yetkisi verilebilir. Bu izin, `revoke` arayüzü aracılığıyla da geri alınabilir.

```solidity
function grant(address account, uint32 acCode, uint256 expireTime) external {
 ...
}
function revoke(address account, uint32 acCode) external {
    ...
}
```

### NFT token yetkilendirmesi

BucketHub ve ObjectHub NFT721 standardını, GroupHub ise ERC1155 standardını uyguladığından, belirli kaynak Token ID'lerine yetkilendirmek için `approve` ve `setApprovalForAll` kullanıyoruz. Bu, işlemler üzerinde kısıtlama getirmeden, hem silme hem de güncellemeye izin verir.

```solidity
function approve(address to, uint256 tokenId) public virtual {
    ...
}
function setApprovalForAll(address operator, bool approved) public virtual {
    ...
}

---
title: Ayrıntılı Arayüz
description: Ayrıntılı arayüzler, EVM uyumlu zincirlerde gruplar, kovalar, nesneler ve izinler ile ilgili işlemleri yönetmek için gereken sözleşme arayüzlerini sağlar. Her bir arayüz, gerekli fonksiyonları ve etkileşimleri tanımlar.
keywords: [EVM, BSC, opBNB, sözleşme, arayüz, token, çapraz zincir]
---

## Ayrıntılı Arayüz

Aşağıdaki arayüzleri sırasıyla sağlar:

**IGroupHub**

`GroupHub` sözleşmesi, BSC/opBNB üzerinde grubu doğrudan yönetmek için aşağıdaki arayüzleri sağlar.

```solidity
interface IGroupHub {
       /** 
        * @dev  Grup NFT'sinin sözleşme adresini sorgula.
        * @return Grup token'ının sözleşme adresi.
        * Her grup, BSC üzerinde bir NFT olarak eşlenecektir.
        * Grup ID'si ve NFT token ID'si aynıdır.
        */
       function ERC721Token() external view returns (address);
       /** 
        * @dev  Üye NFT'sinin sözleşme adresini sorgula.
        * @return Üye token'ının sözleşme adresi.
        * Bir gruptaki üye, BSC üzerinde bir ERC1155 tokenı olarak eşlenecektir.
        * ERC1155 tokenının ID'si grup ID'siyle aynıdır.
        */
       function ERC1155Token() external view returns (address);
       
       :::tip
       *Dikkat*: `createGroup` fonksiyonu ile yeni bir grup oluşturulurken, `callbackGasLimit` ve `extraData` parametrelerinin doğru bir şekilde ayarlandığından emin olun.
       :::

       /**
        * @dev bir grup oluştur ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param creator Grubun sahibi.
        * @param name Grubun adı.
        */
       function createGroup(address creator, string memory name) external payable returns (bool);
   
       /**
        * @dev bir grup oluştur ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        * İstek işlendiğinde geri çağırma fonksiyonu çağrılır.
        *
        * @param creator Grubun sahibi.
        * @param name Grubun adı.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function createGroup(
           address creator,
           string memory name,
           uint256 callbackGasLimit,
           CmnStorage.ExtraData memory extraData
       ) external payable returns (bool);

       :::info
       `deleteGroup` çağrısı, belirli bir grup ID'sine göre grubu silmek için kullanılır. ID'nin geçerli olduğundan emin olun.
       :::

       /**
        * @dev bir grubu sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param id Grubun id'si.
        */
       function deleteGroup(uint256 id) external payable returns (bool);
   
       /**
        * @dev bir grubu sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        * İstek işlendiğinde geri çağırma fonksiyonu çağrılır.
        *
        * @param id Grubun id'si.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function deleteGroup(uint256 id, uint256 callbackGasLimit, CmnStorage.ExtraData memory extraData) external payable returns (bool);

       /**
        * @dev bir grubun üyesini güncelle ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param synPkg Güncellenecek grubun bilgilerini içeren paket.
        */
       function updateGroup(GroupStorage.UpdateGroupSynPackage memory synPkg) external payable returns (bool);
   
       /**
        * @dev bir grubun üyesini güncelle ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        * İstek işlendiğinde geri çağırma fonksiyonu çağrılır.
        *
        * @param synPkg Güncellenecek grubun bilgilerini içeren paket.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function updateGroup(
           GroupStorage.UpdateGroupSynPackage memory synPkg,
           uint256 callbackGasLimit,
           CmnStorage.ExtraData memory extraData
       ) external payable returns (bool);

       /**
        * @dev Grup oluşturma çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param owner Grubun sahibi.
        * @param name Grubun adı.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareCreateGroup(
           address sender,
           address owner,
           string memory name
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Silme grubu çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param id Grubun id'si.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareDeleteGroup(
           address sender,
           uint256 id
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Güncelleme grubunun çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param synPkg Güncellenecek grubun bilgilerini içeren paket.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareUpdateGroup(
           address sender,
           GroupStorage.UpdateGroupSynPackage memory synPkg
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);
   }
   ```

---

**IBucketHub**

`BucketHub` sözleşmesi, EVM uyumlu zincirlerde, BSC ve opBNB gibi, doğrudan bucket yönetimi için aşağıdaki arayüzleri sağlar.

```solidity
interface IBucketHub {
       /** 
        * @dev  Kova NFT'sinin sözleşme adresini sorgula.
        * @return Kova token'ının sözleşme adresi.
        * Her kova, BSC üzerinde bir NFT olarak eşlenecektir.
        * Kova ID'si ve NFT token ID'si aynıdır.
        */
       function ERC721Token() external view returns (address);
   
       /**
        * @dev bir kova oluştur ve BSC'den GNFD'ye bir çapraz zincir talebi gönder
        *
        * @param synPkg Oluşturulacak kova bilgilerini içeren paket.
        */
       function createBucket(BucketStorage.CreateBucketSynPackage memory synPkg) external payable returns (bool);
   
       /**
        * @dev bir kova oluştur ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        * İstek işlendiğinde geri çağırma fonksiyonu çağrılır.
        *
        * @param synPkg Oluşturulacak kova bilgilerini içeren paket.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function createBucket(
           BucketStorage.CreateBucketSynPackage memory synPkg,
           uint256 callbackGasLimit,
           CmnStorage.ExtraData memory extraData
       ) external payable returns (bool);

       /**
        * @dev bir kovayı sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param id Kovaların id'si.
        */
       function deleteBucket(uint256 id) external payable returns (bool);

       /**
        * @dev bir kovayı sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        * İstek işlendiğinde geri çağırma fonksiyonu çağrılır.
        *
        * @param id Kovaların id'si.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function deleteBucket(uint256 id, uint256 callbackGasLimit, CmnStorage.ExtraData memory extraData) external payable returns (bool);

       /**
        * @dev Kova oluşturma çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param synPkg Oluşturulacak kova bilgilerini içeren paket.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareCreateBucket(
           address sender,
           CreateBucketSynPackage memory synPkg
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);
    
       /**
        * @dev Kova oluşturma çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param synPkg Oluşturulacak kova bilgilerini içeren paket.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareCreateBucket(
           address sender,           
           CreateBucketSynPackage memory synPkg, 
           uint256 callbackGasLimit,
           CmnStorage.ExtraData memory extraData
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Silme kova çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param id Kovaların id'si.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareDeleteBucket(
           address sender,
           uint256 id
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Silme kova çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param id Kovaların id'si.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareDeleteBucket(
           address sender,
           uint256 id,
           uint256 callbackGasLimit,
           ExtraData memory extraData
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);
   }
   ```

---

**IObjectHub**

`ObjectHub` sözleşmesi, EVM uyumlu zincirlerde, BSC ve opBNB gibi, doğrudan nesne yönetimi için aşağıdaki arayüzleri sağlar.

```solidity
interface IObjectHub {
       /** 
        * @dev  Nesne NFT'sinin sözleşme adresini sorgula.
        * @return Nesne token'ının sözleşme adresi.
        * Her nesne, BSC üzerinde bir NFT olarak eşlenecektir.
        * Nesne ID'si ve NFT token ID'si aynıdır.
        */
       function ERC721Token() external view returns (address);

       /**
        * @dev bir nesneyi sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param id Nesnenin id'si.
        */
       function deleteObject(uint256 id) external payable returns (bool);

       /**
        * @dev bir nesneyi sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        * İstek işlendiğinde geri çağırma fonksiyonu çağrılır.
        *
        * @param id Nesnenin id'si.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function deleteObject(uint256 id, uint256 callbackGasLimit, CmnStorage.ExtraData memory extraData) external payable returns (bool);
    
       /**
        * @dev Silme nesne çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param id Nesnenin id'si.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareDeleteObject(
           address sender,
           uint256 id
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Silme nesne çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param id Nesnenin id'si.
        * @param callbackGasLimit Geri çağırma fonksiyonu için gaz limiti.
        * @param extraData Geri çağırma fonksiyonu için ekstra veriler.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareDeleteObject(
           address sender,
           uint256 id,
           uint256 callbackGasLimit,
           ExtraData memory extraData
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);
   }
   ```

---

**IPermissionHub**

`PermissionHub` sözleşmesi, EVM uyumlu zincirlerde, BSC ve opBNB gibi, doğrudan izin yönetimi için aşağıdaki arayüzleri sağlar.

```solidity
interface IPermissionHub {
       /** 
        * @dev  İzin NFT'sinin sözleşme adresini sorgula.
        * @return İzin token'ının sözleşme adresi.
        * Her izin politikası, BSC üzerinde bir NFT olarak eşlenecektir.
        * Politika ID'si ve NFT token ID'si aynıdır.
        */
       function ERC721Token() external view returns (address);

       /**
        * @dev bir politikayı sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param id Politikanın id'si.
        */
       function deletePolicy(uint256 id) external payable returns (bool);
    
       /**
        * @dev bir politikayı sil ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param id Politikanın id'si.
        * @param _extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function deletePolicy(uint256 id, PermissionStorage.ExtraData memory _extraData) external payable returns (bool);

       /**
        * @dev bir politika oluştur ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param data Protobuf ile kodlanmış politika verisi.
        * @param _extraData Geri çağırma fonksiyonu için ekstra veriler.
        */
       function createPolicy(
           bytes calldata _data, 
           PermissionStorage.ExtraData memory _extraData
       ) external payable returns (bool);

       /**
        * @dev bir politika oluştur ve BSC'den GNFD'ye bir çapraz zincir talebi gönder.
        *
        * @param _data Protobuf ile kodlanmış politika verisi.
        */
       function createPolicy(bytes calldata _data) external payable returns (bool);

       /**
        * @dev Oluşturma politikası çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param _data Protobuf ile kodlanmış politika verisi.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareCreatePolicy(
           address sender, 
           bytes calldata _data
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Oluşturma politikası çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param _data Protobuf ile kodlanmış politika verisi.
        * @param _extraData Geri çağırma fonksiyonu için ekstra veriler.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareCreatePolicy(
           address sender, 
           bytes calldata _data, 
           PermissionStorage.ExtraData memory _extraData
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Silme politikası çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param id Politikanın id'si.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareDeletePolicy(
           address sender, 
           uint256 id
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);

       /**
        * @dev Silme politikası çapraz zincir mesaj verilerini hazırlayın.
        * Bu fonksiyon `MultiMessage` ile yardımcı olmak için kullanılır.
        *
        * @param sender Çapraz zincir talebinin varsayılan mesaj göndericisi.
        * @param id Politikanın id'si.
        * @param _extraData Geri çağırma fonksiyonu için ekstra veriler.
        *
        * @return (ChannelID, MsgBytes, RelayerFee, AckRelayerFee, SenderAddress).
        */
       function prepareDeletePolicy(
           address sender, 
           uint256 id, 
           PermissionStorage.ExtraData memory _extraData
       ) external payable returns (uint8, bytes memory, uint256, uint256, address);
   }
   ```

---

**IMultiMessage**

`MultiMessage`, bileşik işlemlerin atomikliğini desteklemek için toplama yetenekleri sağlar.

```solidity
interface IMultiMessage {
    function sendMessages(
        address[] calldata _targets,
        bytes[] calldata _data,
        uint256[] calldata _values
    ) external payable returns (bool);
}
```

**IGreenfieldExecutor**

Çoğu yerel işlem, `GreenfieldExecutor` ile gerçekleştirilebilir; örneğin, ödeme hesabı oluşturma, ödeme hesabına para yatırma, ödeme hesabından para çekme, kova taşıma, kova taşıma iptal etme, kova bilgilerini güncelleme, SP'yi devredilmiş ajan olarak ayarlama, kova akış sınırını ayarlama, nesne kopyalama, nesne bilgilerini güncelleme, etiket ayarlama.                          

```solidity
interface IGreenfieldExecutor {
    function execute(uint8[] calldata _msgTypes, bytes[] calldata _msgBytes) external payable returns (bool);
}
```  