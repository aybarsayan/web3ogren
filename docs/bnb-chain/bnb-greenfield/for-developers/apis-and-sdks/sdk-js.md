---
title: Javascript SDK Örneği - BNB Greenfield SDK
description: BNB Greenfield JavaScript SDK ile merkeziyetsiz depolama etkileşimleri için gerekli bilgiler. Bu kılavuz, SDK'nın kurulumunu, kullanımını ve temel işlemlerini kapsamaktadır.
keywords: [JavaScript SDK, BNB Greenfield, merkeziyetsiz depolama, API kullanımı, işlemler, blok zinciri]
---

# Hızlı Başlangıç

BNB Greenfield JavaScript SDK, ön uç ortamları için tasarlanmıştır ve BNB Greenfield merkeziyetsiz depolama ile etkileşimde bulunmak için bir API sağlar. İzin detaylarını, gaz ücretlerini vb. almak gibi çeşitli işlemler sunar. SDK ayrıca, *işlemleri imzalamak ve BNB Greenfield'a göndermek için bir kripto bileşeni* içerir.

:::info  
SDK'nın BNB Smart Chain (BSC) ile etkileşim kurma yöntemleri içermediği belirtilmelidir. Mevcut işlemler hakkında kapsamlı bir anlayış için [API Referansı](https://github.com/bnb-chain/greenfield-js-sdk) sayfasına başvurun.
:::

## Kurulum

```bash
npm install @bnb-chain/greenfield-js-sdk
```

## Kullanım

SDK işlevselliğini kullanmak için, kullanıcıların SDK'dan bir istemci nesnesi oluşturması gerekir. Bu istemci nesnesi, BNB Greenfield ile etkileşimde bulunmak ve istenen işlemleri gerçekleştirmek için arayüz olarak hizmet eder.

### İstemci Oluşturma

```js
import { Client } from '@bnb-chain/greenfield-js-sdk'

export const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');
```

*SDK, iki tür işlem sunar*:
- BNB Greenfield'a işlem göndermek, kullanıcıların blok zincirinin durumunu değiştirmelerine olanak tanır;
- İkinci tür ise, kullanıcıların sorgular göndermesine ve blok zincirinde saklanan nesneler hakkında meta veri bilgilerini almasına izin verir.

SDK iki bölümden oluşur:

* Zincir: [Greenfield Zincir API](https://github.com/bnb-chain/greenfield/tree/master/docs/greenfield-api)
* Depolama Sağlayıcı: [Greenfield Depolama Sağlayıcı API](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/docs/storage-provider-rest-api)

### İşlemler

#### 1. İşlem inşası

SDK, hesaplar arasında token transferi yapmak için işlevsellik sağlar ve kullanıcıların token transferlerini gerçekleştirmelerini kolaylaştıran basit bir yol sunar. Kullanıcılar, SDK ile istenen hesaplar içinde token transferlerini başlatabilir ve gerçekleştirebilir, böylece tokenları yönetme ve değiştirme sürecini kolaylaştırır.

> "SDK, işlemlerin simülasyonunu ve yayılmasını sağlamak için işlevsellik içerir."  
> — Kullanıcı deneyimi geliştirme ekibi

```js
const { simulate, broadcast } = await client.account.transfer({
  fromAddress: address,
  toAddress: transferInfo.to,
  amount: [
    {
      denom: 'BNB',
      amount: ethers.utils.parseEther(transferInfo.amount).toString(),
    },
  ],
});
```

#### 2. İşlem Simülasyonu

Bu işlev, tahmini gaz limitini, gaz fiyatını ve genel gaz ücretini döndürür.

```js
// işlem simülasyonu
const simulateInfo = await simulate({
   denom: 'BNB',
});
```

Örnek çıktı

```json
{
   "gasLimit":2400,
   "gasPrice":"5000000000",
   "gasFee":"0.000012"
}
```

#### 3. İşlem Yayılması

İşlem verilerini blok zincir ağına göndermek için API uç noktasını kullanın.

```js
// işlem yayılması
// Bu, gaz limiti, gaz fiyatı ve genel gaz ücreti gibi ayrıntıları içerir.
const broadcastRes = await broadcast({
  denom: 'BNB',
  gasLimit: Number(simulateInfo.gasLimit),
  gasPrice: simulateInfo.gasPrice,
  payer: address,
  granter: '',
});
```

#### DİKKAT: `Broadcast` için İmza Modu  

`broadcast`, varsayılan olarak imza sağlayıcı olarak `window.ethereum` kullanır.

Başka birini kullanmak istiyorsanız, `signTypedDataCallback` ayarını yapabilirsiniz:

```js
// TrustWallet
const broadcastRes = await broadcast({
  //...
  signTypedDataCallback: async (addr: string, message: string) => {
    return await window.trustwallet.request({
      method: 'eth_signTypedData_v4',
      params: [addr, message],
    });
  }
});
```

Nodejs'de yayın yapıyorsanız, bir tx'yi `privateKey` ile yayınlayabilirsiniz:

```js
const broadcastRes = await broadcast({
  //...
  privateKey: '0x.......'
});
```

İşleminizi yaydıktan sonraki örnek çıktı:


 işlem sonucu 

```json
{
   "code":0,
   "height":449276,
   "txIndex":0,
   "events":[
      {
         "type":"coin_spent",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"coin_received",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"transfer",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"message",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"tx",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"tx",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"tx",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"message",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"coin_spent",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"coin_received",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"transfer",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"message",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"greenfield.payment.EventStreamRecordUpdate",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"greenfield.payment.EventStreamRecordUpdate",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"greenfield.payment.EventStreamRecordUpdate",
         "attributes":[
            "Array"
         ]
      },
      {
         "type":"greenfield.storage.EventCreateBucket",
         "attributes":[
            "Array"
         ]
      }
   ],
   "rawLog":"..",
   "transactionHash":"D304242145ED9B44F05431C3798B3273CF2A907E6AE1CA892759985C900D6E72",
   "gasUsed":2400,
   "gasWanted":2400
}
```



#### 4. Çoklu İşlemler

SDK ayrıca, çoklu işlemleri tek bir işlemde paketleme desteği sunar, böylece gaz ücretlerini azaltır. Bu özellik, kullanıcıların birden fazla işlemi bir araya getirerek işlemlerini optimize etmelerine olanak tanır ve bunları ayrı ayrı yürütmenin neden olduğu toplam gaz maliyetini en aza indirir. 

```js
const createGroupTx = await client.group.createGroup(params);
const mirrorGroupTx = await client.crosschain.mirrorGroup({
   groupName,
   id,
   operator,
});

const principal = {
  type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_GROUP,
  value: GRNToString(newGroupGRN(address as string, groupName)),
};

const statement: PermissionTypes.Statement = {
  effect: PermissionTypes.Effect.EFFECT_ALLOW,
  actions: [PermissionTypes.ActionType.ACTION_GET_OBJECT],
  resources: [
    GRNToString(
      type === 'Data'
        ? newObjectGRN(bucketName, name)
        : newObjectGRN(bucketName, '*'),
    ),
  ],
};

const policyTx = await client.object.putObjectPolicy(bucketName, name, {
  operator: address,
  statements: [statement],
  principal,
});

const { simulate, broadcast } = await multiTx([
  createGroupTx,
  mirrorGroupTx,
  policyTx,
]);
```

### Meta Verileri Sorgulama

* Hesap bilgileri

```js
const { client, selectSp, generateString } = require('./client');
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require('./env');
const Long = require('long');

(async () => {
  // hesap bilgilerini al
  const addrInfo = await client.account.getAccount(ACCOUNT_ADDRESS);

  console.log('adres:', addrInfo);
})
```

Örnek çıktı:

```json
{
   "address":"0x525482AB3922230e4D73079890dC905dCc3D37cd",
   "pubKey":{
      "typeUrl":"/cosmos.crypto.eth.ethsecp256k1.PubKey",
      "value":"CiECKuOEfCNFxnfiinnIIoe0OSf3VEOAU5jxwmZscfpOaW4="
   },
   "accountNumber":"5012",
   "sequence":"9"
}
```

### Depolama Sağlayıcı İstemcisi

> [https://github.com/bnb-chain/greenfield-storage-provider/tree/master/docs/storage-provider-rest-api](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/docs/storage-provider-rest-api)

Ayrıca, SDK, mevcut depolama sağlayıcılarının listesini sorgulama desteği sağlar ve meta veri özelliklerini keşfetmek için genel arama yetenekleri sunar.

SDK iki [kimlik doğrulama türü](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/README.md#authentication-type) destekler:

* ECDSA: Genellikle Node.js üzerinde kullanılır (Çünkü özel anahtar kullanılması gerekir)  
* EDDSA: Genellikle tarayıcıda kullanılır  

`getBucketReadQuota` örnek olarak:

```js
// anahtar oluştur
const allSps = await getAllSps();
const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload(
  {
    sps: allSps,
    chainId: GREEN_CHAIN_ID,
    expirationMs: 5 * 24 * 60 * 60 * 1000,
    domain: window.location.origin,
    address: 'adresiniz',
  },
  provider: 'cüzdan sağlayıcı',
);

// sp api'sini talep et
const bucketQuota = await client.bucket.getBucketReadQuota(
  {
    bucketName,
  },
  {
    type: 'EDDSA',
    seed: offchainAuthRes.seedString,
    domain: window.location.origin,
    address: 'adresiniz',
  },
);
```

```js
// Node.js:
// sp api'sini talep et
const bucketQuota = await client.bucket.getBucketReadQuota(
  {
    bucketName,
  },
  {
    type: 'ECDSA',
    privateKey: '0x....'
  },
);
```

Diğer işlevler:

#### Depolama Sağlayıcılarını Listeleme

```js
export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter(
    (v: any) => v?.description?.moniker !== 'QATest',
  );

  return finalSps;
};
```

#### Nesneler İçin Arama

Bir nesne özel olarak ayarlansa bile, meta verilerinin halka açık olarak erişilebilir olduğunu belirtmek önemlidir. Bu meta veriler, dosya boyutu, dosya türü ve dosya adı gibi bilgileri içerir.

```js
export const searchKey = async (key: string) => {
  try {
    return await client.sp.listGroup(key, `${DAPP_NAME}_`, {
      sourceType: 'SOURCE_TYPE_ORIGIN',
      limit: 1000,
      offset: 0,
    });
  } catch (e) {
    return [];
  }
}
```

## Örnekler

Şimdi tam bir örnek yapalım:

1. Kova oluştur
2. Nesne oluştur ve kovaya yükle
3. Nesneyi indir

### Hazırlık

Öncelikle, bir hesap oluşturun ve Greenfield üzerinde token yatırın. `Token Transfer` kılavuzunu izleyin. Hesabınızda hiç BNB yoksa, işlem gerçekleştirilmeyecektir.

#### Depolama Sağlayıcıyı Seçin

Verileri depolamak, Greenfield'ın en önemli özelliklerinden biridir. Tüm depolama ile ilgili API'lerin `depolama sağlayıcısı` seçilmesini gerektirir.

```js title="sp seç"
const spList = await client.sp.getStorageProviders();
const sp = {
   operatorAddress: spList[0].operatorAddress,
   endpoint: spList[0].endpoint,
};
```

#### ECDSA / OffChainAuth

[ECDSA](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/README.md#for-auth-type-gnfd1-ecdsa) kullanıcıların kimlik doğrulama için özel anahtar kullanmasını gerektirir.

[OffChainAuth](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/modules/authenticator.md) sağlayıcıya kimlik doğrulamak için kullanılır.

> Tarayıcıda kullanıcının özel anahtarına erişilemediğinden, tarayıcıda `OffChainAuth` kullanılır ve Nodejs üzerinde `ECDSA` kullanılır.

=== "Tarayıcı"

```js title="Tarayıcı"
// MetaMask
const provider = window.ethereum;

const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload({
   sps: {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
   },
   chainId: '5600',
   expirationMs: 5 * 24 * 60 * 60 * 1000,
   domain: window.location.origin,
   // cüzdan hesabınız
   address: '0x..',
}, provider);
```

=== "Nodejs"
    
!!! bilgi
    Nodejs offchainauth gerektirmiyor.
    
```js title="Nodejs"
// hesabınız
const ACCOUNT_ADDRESS = '0x....'

// hesabınızın özel anahtarı
const ACCOUNT_PRIVATEKEY = '0x....'
```

### 1. Kova Oluşturma

#### 1.1 Kova oluşturma tx'sini inşa etme

Kova özel veya genel olabilir, bunu seçeneklerle özelleştirebilirsiniz (`visibility`):

* `VISIBILITY_TYPE_PUBLIC_READ`
* `VISIBILITY_TYPE_PRIVATE`

```js title="kova oluşturma tx'sini inşa et"
const createBucketTx = await client.bucket.createBucket(
  {
    bucketName: 'bucket_name',
    creator: address,
    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
    chargedReadQuota: Long.fromString('0'),
    primarySpAddress: sp.operatorAddress,
    paymentAddress: address,
  }
);
```

#### 1.2 Kova oluşturma tx'sini simüle etme

```js title="kova oluşturma tx'sini simüle et"
const createBucketTxSimulateInfo = await createBucketTx.simulate({
   denom: 'BNB',
});
```

#### 1.3 Kova oluşturma tx'sini yayma

=== "Tarayıcı"
    
```js title="kova oluşturma tx'sini yayma"
const res = await createBucketTx.broadcast({
   denom: 'BNB',
   gasLimit: Number(simulateInfo?.gasLimit),
   gasPrice: simulateInfo?.gasPrice || '5000000000',
   payer: address,
   granter: '',
});
```

=== "Nodejs"

```js title="kova oluşturma tx'sini yayma"
const res = await createBucketTx.broadcast({
   denom: 'BNB',
   gasLimit: Number(createBucketTxSimulateInfo?.gasLimit),
   gasPrice: createBucketTxSimulateInfo?.gasPrice || '5000000000',
   payer: ACCOUNT_ADDRESS,
   granter: '',
   // vurgula
   privateKey: ACCOUNT_PRIVATEKEY,
   // vurgula
});
```

### 2. Nesne Oluşturma

#### 2.1 Nesne oluşturma tx'sini inşa etme

Kovadaki `görünürlük` gibi nesnelerin de bir görünürlüğü vardır:

* `VISIBILITY_TYPE_PUBLIC_READ`
* `VISIBILITY_TYPE_PRIVATE`

Dosyanın kontrol toplamını almak için [reed-solomon](https://github.com/bnb-chain/greenfield-js-sdk/tree/main/packages/reed-solomon) gerekir:

=== "Tarayıcı"

```js
import { ReedSolomon } from '@bnb-chain/reed-solomon';

const rs = new ReedSolomon();

// file, File türündedir
const fileBytes = await file.arrayBuffer();
const expectCheckSums = rs.encode(new Uint8Array(fileBytes));
```

=== "Nodejs"

```js
const fs = require('node:fs');
const { NodeAdapterReedSolomon } = require('@bnb-chain/reed-solomon/node.adapter');

const filePath = './CHANGELOG.md';
const fileBuffer = fs.readFileSync(filePath);
const rs = new NodeAdapterReedSolomon();
const expectCheckSums = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer));
```

```js
const createObjectTx = await client.object.createObject(
  {
    bucketName: 'bucket_name',
    objectName: 'object_name',
    // kullanıcının hesap adresi
    creator: '0x...',
    visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
    contentType: 'json',
    redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
    payloadSize: Long.fromInt(13311),
    expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
  }
);
```

#### 2.2 Nesne oluşturma tx'sini simüle etme

```js
const createObjectTxSimulateInfo = await createObjectTx.simulate({
   denom: 'BNB',
});
```

#### 2.3 Nesne oluşturma tx'sini yayma

=== "Tarayıcı"
    
```js
const res = await createObjectTx.broadcast({
   denom: 'BNB',
   gasLimit: Number(simulateInfo?.gasLimit),
   gasPrice: simulateInfo?.gasPrice || '5000000000',
   payer: address,
   granter: '',
});
```

=== "Nodejs"
    
```js
const createObjectTxRes = await createObjectTx.broadcast({
   denom: 'BNB',
   gasLimit: Number(createObjectTxSimulateInfo?.gasLimit),
   gasPrice: createObjectTxSimulateInfo?.gasPrice || '5000000000',
   payer: ACCOUNT_ADDRESS,
   granter: '',
   // vurgula
   privateKey: ACCOUNT_PRIVATEKEY,
   // vurgula
});
```

#### 2.4 Nesne yükleme

=== "Tarayıcı"
    
```js
const uploadRes = await client.object.uploadObject(
   {
      bucketName: createObjectInfo.bucketName,
      objectName: createObjectInfo.objectName,
      body: file,
      txnHash: txHash,
   },
   // vurgula
   {
      type: 'EDDSA',
      domain: window.location.origin,
      seed: offChainData.seedString,
      address,
   },
   // vurgula
);
```

=== "Nodejs"
    
```js
const uploadRes = await client.object.uploadObject(
   {
      bucketName: bucketName,
      objectName: objectName,
      body: createFile(filePath),
      txnHash: createObjectTxRes.transactionHash,
   },
   // vurgula
   {
      type: 'ECDSA',
      privateKey: ACCOUNT_PRIVATEKEY,
   }
   // vurgula
);
    
// buffer'ı dosyaya dönüştür
function createFile(path) {
  const stats = fs.statSync(path);
  const fileSize = stats.size;

  return {
    name: path,
    type: '',
    size: fileSize,
    content: fs.readFileSync(path),
  }
}
```

### 3. Nesne İndirme

=== "Tarayıcı"

```js
const res = await client.object.downloadFile(
   {
      bucketName: 'bucket_name',
      objectName: 'object_name',
   },
   // vurgula
   {
      type: 'EDDSA',
      address,
      domain: window.location.origin,
      seed: offChainData.seedString,
   },
   // vurgula
);
```

=== "Nodejs"

```js
const res = await client.object.getObject(
   {
      bucketName: 'bucket_name',
      objectName: 'object_name',
   },
   // vurgula
   {
      type: 'ECDSA',
      privateKey: ACCOUNT_PRIVATEKEY,
   }
   // vurgula
);

// res.body Blob'dır
console.log('res', res)
const buffer = Buffer.from([res.body]);
fs.writeFileSync('your_output_file', buffer)
```

## Kod Deposu

- [Resmi JS uygulaması SDK](https://github.com/bnb-chain/greenfield-js-sdk)

## API Belgelendirmesi

- [Greenfield JS SDK Belgeleri](https://docs.bnbchain.org/greenfield-js-sdk/)