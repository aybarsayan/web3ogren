---
title: Dosya Yönetimi için Basit Araç (JS) - BNB Greenfield Dosya Yönetimi
description: Bu doküman, BNB Greenfield SDK'sını kullanarak dosya yönetimi araçları oluşturmak için gerekli adımları kapsamaktadır. Güncel yöntemlerle testnet ile etkileşim kurabileceğiniz uygulamalar sunmaktadır.
keywords: [Greenfield, dosya yönetimi, JS-SDK, API, cüzdan yönetimi, depolama anlaşması, işlem simülasyonu]
order: 3
---

# Greenfield SDK ile Dosya Yönetimi Aracı Oluşturma (JS)

Birçok Zincir API kütüphanesi mevcuttur. Bu kütüphaneler, Greenfield düğümüne bağlanma, istek yapma ve yanıtları yönetme gibi düşük seviye mantığı yönetir.

* [go-sdk](https://github.com/bnb-chain/greenfield-go-sdk)
* [js-sdk](https://github.com/bnb-chain/greenfield-js-sdk)

Bu derste, testnet ile etkileşimde bulunmak için JS-SDK kütüphanesini kullanacağız.

## Ön Koşullar

Başlamadan önce aşağıdakilerle tanışık olmalısınız:

* `Greenfield temelleri`
* `Token Transfer` sağlanan talimatları izleyin. **Lütfen** hesabınızda herhangi bir BNB yoksa, işlemin gerçekleştirilmeyeceğini unutmayın.

---

## Kurulum

### Proje Oluşturma

:::tip
Hızlı Başlangıç kılavuzunu izleyerek projeyi kolayca oluşturabilirsiniz.
:::

=== "Tarayıcı"

    [Hızlı Başlangıç](https://docs.bnbchain.org/greenfield-js-sdk/getting-started/quick-start) izleyerek projeyi oluşturun.

=== "Nodejs"

Yeni bir `index.js` oluşturun:

    ```bash title="Nodejs proje oluşturma"
    > mkdir gnfd-app
    > cd gnfd-app
    > touch index.js
    ```

    SDK'yı yükleyin:

    ```bash title="npm bağımlılıklarını yükle"
    > npm init -y
    > npm add @bnb-chain/greenfield-js-sdk
    ```

### Greenfield İstemcisi Oluşturma

:::info
Bu adımda JS SDK kullanarak bir istemci oluşturacaksınız.
:::

=== "Tarayıcı"

    ```js title="Testnet İstemcisi Oluştur"
    import { Client } from '@bnb-chain/greenfield-js-sdk';

    const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');
    ```

=== "Nodejs"

    ```js title="Testnet istemcisi oluştur"
    const {Client}  = require('@bnb-chain/greenfield-js-sdk');

    // testnet
    const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');
    ```

### Basit Bir Fonksiyonu Test Etme

=== "Tarayıcı"

    ```jsx
    <button
    className="button is-primary"
    onClick={async () => {
        const latestBlockHeight = await client.basic.getLatestBlockHeight();

        alert(JSON.stringify(latestBlockHeight));
    }}
    >
    getLatestBlockHeight
    </button>
    ```

=== "Nodejs"

    ```js title="index.js"
    ;(async () => {
    const latestBlockHeight = await client.basic.getLatestBlockHeight()

    console.log('latestBlockHeight', latestBlockHeight)
    })()
    ```

    `index.js` dosyasını çalıştırarak en son blok yüksekliğini alın:

    ```bash
    > node index.js
    ```

    Çıktı şöyle olacaktır:

    ```bash
    latestBlockHeight 3494585
    ```

---

## Adres Bakiyesi Alma

Önceki adımda, istemcinin çalıştığını doğruladık.

Şimdi bir hesap için daha fazla özellik deneyeceğiz.

=== "Tarayıcı"

    ```jsx
    <button
    className="button is-primary"
    onClick={async () => {
        if (!address) return;

        const balance = await client.account.getAccountBalance({
        address: address,
        denom: 'BNB',
        });

        alert(JSON.stringify(balance));
    }}
    >
    getAccountBalance
    </button>
    ```

=== "Nodejs"

    Bir hesabın bakiyesini sorgulamak için `account.getAccountBalance` fonksiyonunu çağırabilirsiniz.

    ```js title="hesabın bakiyesini al"
    ;(async () => {
        const balance = await client.account.getAccountBalance({
        address: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
        denom: 'BNB'
    })

    console.log('balance: ', balance)
    })()
    ```

    Hesabın bakiyesini almak için `node index.js` komutunu çalıştırın:

    ```text
    balance: { balance: { denom: 'BNB', amount: '4804586044359520195' } }
    ```

> Yukarıda gösterilen temel veri sorguları dışında pek çok özellik bulunmaktadır. Tüm Greenfield API tanımlamaları için lütfen [API Referansı](https://docs.bnbchain.org/greenfield-js-sdk/category/api) sayfasına bakın.

## Cüzdan Yönetimi

Nodejs'deki cüzdan, bir özel anahtar tarafından oluşturulur, ancak cüzdan eklentileri (MetaMask, CollectWallet vb.) tarayıcıda kullanıcının özel anahtarına erişemez, bu nedenle başka bir yol gereklidir.

=== "Tarayıcı"

    ```jsx
    <button
    className="button is-primary"
    onClick={async () => {
        if (!address) return;

        const transferTx = await client.account.transfer({
        fromAddress: address,
        toAddress: '0x0000000000000000000000000000000000000000',
        amount: [
            {
            denom: 'BNB',
            amount: '1000000000',
            },
        ],
        });

        const simulateInfo = await transferTx.simulate({
        denom: 'BNB',
        });

        const res = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: address,
        granter: '',
        signTypedDataCallback: async (addr: string, message: string) => {
            const provider = await connector?.getProvider();
            return await provider?.request({
            method: 'eth_signTypedData_v4',
            params: [addr, message],
            });
        },
        });

        if (res.code === 0) {
        alert('transfer success!!');
        }
    }}
    >
    transfer
    </button>
    ```

=== "Nodejs"

    Genel olarak, özel anahtarı `.env` dosyasına yerleştirmemiz ve bu dosyayı `.gitignore` dosyasında göz ardı etmemiz gerekir (hesap güvenliği için).

    ```bash
    > touch .env
    ```

    Aşağıdaki bilgileri `.env` dosyasına ekleyin:

    ```py
    # hesap bilgilerinizi doldurun
    ACCOUNT_PRIVATEKEY=0x...
    ACCOUNT_ADDRESS=0x...
    ```

    `dotenv` bağımlılıklarını yükleyin (değişkenleri .env'den yüklemek için):

    ```bash
    > npm install dotenv
    ```

    Her şey hazır ve şimdi işlemi transfer edebiliriz.

    `transfer.js` dosyasını oluşturun:

    ```js title="transfer.js"
    require('dotenv').config();
    const {Client} = require('@bnb-chain/greenfield-js-sdk');
    const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');

    ;(async () => {

    // tx oluştur
    const transferTx = await client.account.transfer({
        fromAddress: process.env.ACCOUNT_ADDRESS,
        toAddress: '0x0000000000000000000000000000000000000000',
        amount: [
        {
            denom: 'BNB',
            amount: '1000000000',
        },
        ],
    })

    // transfer tx'yi simüle et
    const simulateInfo = await transferTx.simulate({
        denom: 'BNB',
    });

    // transfer tx'yi yayınla
    const res = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: process.env.ACCOUNT_ADDRESS,
        granter: '',
        privateKey: process.env.ACCOUNT_PRIVATEKEY,
    })

    console.log('res', res)
    })()
    ```

    `node transfer.js` komutunu çalıştırarak:

    
    transfer tx yanıtı

    ```json
    {
    code: 0,
    height: 3495211,
    txIndex: 0,
    events: [
        { type: 'coin_spent', attributes: [Array] },
        { type: 'coin_received', attributes: [Array] },
        { type: 'transfer', attributes: [Array] },
        { type: 'message', attributes: [Array] },
        { type: 'tx', attributes: [Array] },
        { type: 'tx', attributes: [Array] },
        { type: 'tx', attributes: [Array] },
        { type: 'message', attributes: [Array] },
        { type: 'coin_spent', attributes: [Array] },
        { type: 'coin_received', attributes: [Array] },
        { type: 'transfer', attributes: [Array] },
        { type: 'message', attributes: [Array] }
    ],
    rawLog: '[{"msg_index":0,"events":[{"type":"message","attributes":[{"key":"action","value":"/cosmos.bank.v1beta1.MsgSend"},{"key":"sender","value":"0x1C893441AB6c1A75E01887087ea508bE8e07AAae"},{"key":"module","value":"bank"}]},{"type":"coin_spent","attributes":[{"key":"spender","value":"0x1C893441AB6c1A75E01887087ea508bE8e07AAae"},{"key":"amount","value":"1000000000BNB"}]},{"type":"coin_received","attributes":[{"key":"receiver","value":"0x0000000000000000000000000000000000000000"},{"key":"amount","value":"1000000000BNB"}]},{"type":"transfer","attributes":[{"key":"recipient","value":"0x0000000000000000000000000000000000000000"},{"key":"sender","value":"0x1C893441AB6c1A75E01887087ea508bE8e07AAae"},{"key":"amount","value":"1000000000BNB"}]},{"type":"message","attributes":[{"key":"sender","value":"0x1C893441AB6c1A75E01887087ea508bE8e07AAae"}]}]}]',
    transactionHash: '1B731E99A55868F773E9A7C951D9325BE7995616B990924D47491320599789DE',
    msgResponses: [
        {
        typeUrl: '/cosmos.bank.v1beta1.MsgSendResponse',
        value: Uint8Array(0) []
        }
    ],
    gasUsed: 1200n,
    gasWanted: 1200n
    }
    ```
    


Daha fazla TxClient [Referans](https://docs.bnbchain.org/greenfield-js-sdk/client/tx-client).

---

## Depolama Anlaşması Yapma

Veri depolamak, Greenfield'ın en önemli özelliklerinden biridir. Bu bölümde, verilerinizi Greenfield ağında depolamanın uçtan uca sürecini gözden geçireceğiz. Verinizi içe aktarmakla başlayacağız, ardından bir depolama sağlayıcısıyla bir depolama anlaşması yapacak ve nihayet anlaşmanın tamamlanmasını bekleyeceğiz.

### 0. Ana Dosyayı Oluşturma

=== "Tarayıcı"

    Tarayıcı ana dosyaya ihtiyaç duymaz.

=== "Nodejs"

    ```bash
    > touch storage.js
    ```

### 1. Kendi SP'nizi Seçin

SP listesini sorgulayabilirsiniz:

=== "Tarayıcı"

    ```js title="utils/offchainAuth.ts"
    export const getSps = async () => {
    const sps = await client.sp.getStorageProviders();
    const finalSps = (sps ?? []).filter((v: any) => v.endpoint.includes('nodereal'));

    return finalSps;
    };

    export const getAllSps = async () => {
    const sps = await getSps();

    return sps.map((sp) => {
        return {
        address: sp.operatorAddress,
        endpoint: sp.endpoint,
        name: sp.description?.moniker,
        };
    });
    };

    export const selectSp = async () => {
    const finalSps = await getSps();

    const selectIndex = Math.floor(Math.random() * finalSps.length);

    const secondarySpAddresses = [
        ...finalSps.slice(0, selectIndex),
        ...finalSps.slice(selectIndex + 1),
    ].map((item) => item.operatorAddress);
    const selectSpInfo = {
        id: finalSps[selectIndex].id,
        endpoint: finalSps[selectIndex].endpoint,
        primarySpAddress: finalSps[selectIndex]?.operatorAddress,
        sealAddress: finalSps[selectIndex].sealAddress,
        secondarySpAddresses,
    };

    return selectSpInfo;
    };

    const getOffchainAuthKeys = async (address: string, provider: any) => {
    const storageResStr = localStorage.getItem(address);

    if (storageResStr) {
        const storageRes = JSON.parse(storageResStr) as IReturnOffChainAuthKeyPairAndUpload;
        if (storageRes.expirationTime < Date.now()) {
        alert('Your auth key has expired, please generate a new one');
        localStorage.removeItem(address);
        return;
        }

        return storageRes;
    }

    const allSps = await getAllSps();
    const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload(
        {
        sps: allSps,
        chainId: GREEN_CHAIN_ID,
        expirationMs: 5 * 24 * 60 * 60 * 1000,
        domain: window.location.origin,
        address,
        },
        provider,
    );

    const { code, body: offChainData } = offchainAuthRes;
    if (code !== 0 || !offChainData) {
        throw offchainAuthRes;
    }

    localStorage.setItem(address, JSON.stringify(offChainData));
    return offChainData;
    };
    ```

=== "Nodejs"

    ```js title="storage.js"
    ;(async () => {
    // depolama sağlayıcılarının listesini al
    const sps = await client.sp.getStorageProviders()

    // ilk sağlayıcıyı birincil SP olarak seç
    const primarySP = sps[0].operatorAddress;
    })()
    ```

### 2. Kova Oluşturma

Kova özel veya genel olabilir. Bununla birlikte seçenekler ile özelleştirebilirsiniz.

`VisibilityType`:

* `VISIBILITY_TYPE_PUBLIC_READ`
* `VISIBILITY_TYPE_PRIVATE`

```jsx title="kova oluştur"
import { Long, VisibilityType, RedundancyType, bytesFromBase64 } from '@bnb-chain/greenfield-js-sdk';
const createBucketTx = await client.bucket.createBucket(
  {
    bucketName: info.bucketName,
    creator: address,
    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
    chargedReadQuota: Long.fromString('0'),
    primarySpAddress: spInfo.primarySpAddress,
    paymentAddress: address,
  },
);

const simulateInfo = await createBucketTx.simulate({
  denom: 'BNB',
});

console.log('simulateInfo', simulateInfo);

const res = await createBucketTx.broadcast({
  denom: 'BNB',
  gasLimit: Number(simulateInfo?.gasLimit),
  gasPrice: simulateInfo?.gasPrice || '5000000000',
  payer: address,
  granter: '',
});
```

### 3. Nesne Oluşturma ve Yükleme

Nesneler de özel veya genel olabilir.

Dosyanın kontrol toplamını almak için [reed-solomon](https://github.com/bnb-chain/greenfield-js-sdk/tree/main/packages/reed-solomon) kullanmalısınız:

=== "Tarayıcı"

    ```js
    import { ReedSolomon } from '@bnb-chain/reed-solomon';

    const rs = new ReedSolomon();

    // dosya File türündedir
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

Bir nesne oluşturma onayı almak ve `createObject` işlemini Greenfield ağına göndermek için:

```jsx
const createObjectTx = await client.object.createObject(
  {
    bucketName: info.bucketName,
    objectName: info.objectName,
    creator: address,
    visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
    contentType: fileType,
    redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
    payloadSize: Long.fromInt(fileBuffer.length),
    expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
  },
);

const simulateInfo = await createObjectTx.simulate({
  denom: 'BNB',
});

const res = await createObjectTx.broadcast({
  denom: 'BNB',
  gasLimit: Number(simulateInfo?.gasLimit),
  gasPrice: simulateInfo?.gasPrice || '5000000000',
  payer: address,
  granter: '',
});
```

### 4. Nesne Yönetimi

#### 4.1 Nesneyi İndirme

=== "Tarayıcı"

    ```jsx
    await client.object.downloadFile(
    {
        bucketName: info.bucketName,
        objectName: info.objectName,
    },
    {
        type: 'EDDSA',
        address,
        domain: window.location.origin,
        seed: offChainData.seedString,
    },
    );
    ```

=== "Nodejs"

    ```js title="manage.js"
    ;(async () => {

    // nesneyi indir
    const res = await client.object.getObject({
        bucketName: 'extfkdcxxd',
        objectName: 'yhulwcfxye'
    }, {
        type: 'ECDSA',
        privateKey: ACCOUNT_PRIVATEKEY,
    })

    // res.body Blob türündedir
    console.log('res', res)
    const buffer = Buffer.from([res.body]);
    fs.writeFileSync('your_output_file', buffer)
    })()
    ```

#### 4.2 Nesne görünürlüğünü güncelleme

=== "Tarayıcı"

    ```jsx
    const tx = await client.object.updateObjectInfo({
    bucketName: info.bucketName,
    objectName: info.objectName,
    operator: address,
    visibility: 1,
    });

    const simulateTx = await tx.simulate({
    denom: 'BNB',
    });

    const res = await tx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateTx?.gasLimit),
    gasPrice: simulateTx?.gasPrice || '5000000000',
    payer: address,
    granter: '',
    });
    ```

=== "Nodejs"

    ```js
    const tx = await client.object.updateObjectInfo({
    bucketName: 'extfkdcxxd',
    objectName: 'yhulwcfxye',
    operator: ACCOUNT_ADDRESS,
    visibility: 1,
    })

    const simulateTx = await tx.simulate({
    denom: 'BNB',
    })

    const createObjectTxRes = await tx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateTx?.gasLimit),
    gasPrice: simulateTx?.gasPrice || '5000000000',
    payer: ACCOUNT_ADDRESS,
    granter: '',
    privateKey: ACCOUNT_PRIVATEKEY,
    });
    ```

#### 4.3 Nesneyi Silme

=== "Tarayıcı"

    ```jsx
    const tx = await client.object.deleteObject({
    bucketName: info.bucketName,
    objectName: info.objectName,
    operator: address,
    });

    const simulateTx = await tx.simulate({
    denom: 'BNB',
    });

    const res = await tx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateTx?.gasLimit),
    gasPrice: simulateTx?.gasPrice || '5000000000',
    payer: address,
    granter: '',
    });
    ```

=== "Nodejs"

    ```js
    ;(async () => {
    const tx = await client.object.deleteObject({
        bucketName: 'extfkdcxxd',
        objectName: 'yhulwcfxye',
        operator: ACCOUNT_ADDRESS,
    });

    const simulateTx = await tx.simulate({
        denom: 'BNB',
    })

    const createObjectTxRes = await tx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateTx?.gasLimit),
        gasPrice: simulateTx?.gasPrice || '5000000000',
        payer: ACCOUNT_ADDRESS,
        granter: '',
        privateKey: ACCOUNT_PRIVATEKEY,
    });

    if (createObjectTxRes.code === 0) {
        console.log('nesne silme başarıyla gerçekleşti')
    }
    })()
    ```