---
title: Kontrat olarak Bucket Sahibi - BNB Greenfield Demo
description: BNB Greenfield, bir kontratın bucket'ları yönetme yeteneğini yeşil alan çapraz zincir işlemeleri aracılığıyla sağlar. Bu dokümantasyon, süreci göstermek için bir demo içermektedir.
keywords: [BNB Greenfield, demo, bucket yönetimi, akıllı sözleşmeler, çapraz zincir]
---

# Greenfield Demo: Kontrat olarak Bucket Sahibi
BNB Greenfield, bir kontratın bucket'ları yönetme yeteneğini yeşil alan çapraz zincir işlemeleri aracılığıyla sağlar ve süreci kısaca göstermek için bir demo kullanacağız.

## Kaynak Kodu
- Greenfield Demo Uygulama Kontratı: [GreenfieldDemo](https://github.com/bnb-chain/greenfield-contracts/blob/develop/contracts/example/GreenfieldDemo.sol)
- Demo ile Etkileşim İçin Script: [Demo Script](https://github.com/bnb-chain/greenfield-contracts/blob/develop/scripts/11-demo-contract-approve-eoa-upload.ts)

## Greenfield Demo Kontratı
Demo aşağıdaki bölümleri içerir:

### Greenfield Sözleşmeleri Sabiti:
```solidity
// BSC test ağı
address public constant TOKEN_HUB = 0xED8e5C546F84442219A5a987EE1D820698528E04;
address public constant CROSS_CHAIN = 0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7;
address public constant BUCKET_HUB = 0x5BB17A87D03620b313C39C24029C94cB5714814A;
address public constant PERMISSION_HUB = 0x25E1eeDb5CaBf288210B132321FBB2d90b4174ad;
address public constant SP_ADDRESS_TESTNET = 0x5FFf5A6c94b182fB965B40C7B9F30199b969eD2f;
address public constant GREENFIELD_EXECUTOR = 0x3E3180883308e8B4946C9a485F8d91F8b15dC48e;
```
BSC test ağında dağıtılan Greenfield sözleşmelerinin adresleri burada mevcuttur ve yapılandırılmıştır. Diğer ağlarda dağıtılan sözleşmeleri bulabilirsiniz [sözleşme giriş noktası](https://docs.bnbchain.org/bnb-greenfield/for-developers/cross-chain-integration/contract-list).

### :::tip
**Öneri:** İlgili adresleri kullanmadan önce mevcut olup olmadıklarını kontrol edin.

### Bucket Oluşturma ve Bucket Akış Hızı Limitini Ayarlama
```solidity
function createBucket(string memory bucketName, uint256 transferOutAmount, bytes memory _executorData) external payable;
```
Bucket adını, Greenfield'deki demo kontratına aktarılan başlangıç BNB miktarını ve bucket akış hızı limitini ayarlamak için executor verilerini sağlar. Bu API, akıllı sözleşme tarafından sahip olunan yeni bir bucket oluşturacak ve bunun için ödeme ayarlayacaktır.

### EOA Hesabının Bucket'a Dosya Yüklemesine İzin Veren Politika Oluşturma
```solidity
function createPolicy(bytes memory createPolicyData) external payable;
```
Akıllı sözleşme tarafından sahip olunan oluşturulan bucket için özel prensibe izin vermek amacıyla `createPolicyData` parametrelerini yapılandırın.

## Etkileşim Scripti
### Kurulum
```shell
git clone https://github.com/bnb-chain/greenfield-contracts.git
cd greenfield-contracts && git checkout develop
npm install
npx hardhat compile

cp .env.example .env
# .env dosyasında `DeployerPrivateKey` ayarlayın
# hesabın tBNB bakiyesinin BSC Testnet üzerinde >= 0.5 BNB olduğunu kontrol edin
npx hardhat run scripts/11-demo-contract-approve-eoa-upload.ts  --network bsc-testnet
```

### İş Akışı
Etkileşim scripti aşağıdaki 4 adımı içerir:

#### Demo Kontratını Dağıtma
```typescript
const demo = (await deployContract(operator, 'GreenfieldDemo')) as GreenfieldDemo;
```

#### Sahibi Demo Kontrat Olan Bucket Oluşturma
Bucket akış hızı limitini ayarlayın ve demo kontratına 0.1 BNB çapraz zincir transfer edin
```typescript
const bucketName = 'test-' + demo.address.substring(2, 6).toLowerCase();
// - transferOutAmt: Greenfield'deki demo kontratına 0.1 BNB transfer edin
// - bu bucket için akış hızı limitini ayarlayın
// - bucket oluşturun: 'test-approve-eoa-upload', sahibi demo kontrattır
const dataSetBucketFlowRateLimit = ExecutorMsg.getSetBucketFlowRateLimitParams({
    bucketName,
    bucketOwner: demo.address,
    operator: demo.address,
    paymentAddress: demo.address,
    flowRateLimit: '1000000000000000000',
});
const executorData = dataSetBucketFlowRateLimit[1];
const transferOutAmt = ethers.utils.parseEther('0.1');
const value = transferOutAmt.add(relayFee.mul(3).add(ackRelayFee.mul(2)));

log('- demo kontratına greenfield üzerinden transfer yap', toHuman(transferOutAmt));
log('- bucket oluştur', bucketName);
log('çapraz zincir tx gönderin!');
const receipt = await waitTx(
    demo.createBucket(bucketName, transferOutAmt, executorData, { value })
);
log(`https://testnet.bscscan.com/tx/${receipt.transactionHash}`);
```

#### Bucket Oluşturulduktan Sonra İsmine Göre Bucket Kimliğini Alma
```typescript
const bucketInfo = await client.bucket.getBucketMeta({ bucketName });
const bucketId = bucketInfo.body!.GfSpGetBucketMetaResponse.Bucket.BucketInfo.Id;
log('bucket oluşturuldu, bucket kimliği', bucketId);
const hexBucketId = `0x000000000000000000000000000000000000000000000000000000000000${BigInt(
    bucketId
).toString(16)}`;
log(`https://testnet.greenfieldscan.com/bucket/${hexBucketId}`);
```

#### EOA Hesabının Bucket'a Dosya Yüklemesine İzin Veren Politika Oluşturma Çapraz Zincir İşlemi ile
```typescript
const uploaderEoaAccount = operator.address; // TODO dosya yüklemek için eoa hesabınızı ayarlayın
log('yükleyiciyi (eoa hesabı) ayarlamaya çalış', uploaderEoaAccount);

const policyDataToAllowUserOperateBucket = Policy.encode({
    id: '0',
    resourceId: bucketId, // bucket kimliği
    resourceType: ResourceType.RESOURCE_TYPE_BUCKET,
    statements: [
        {
            effect: Effect.EFFECT_ALLOW,
            actions: [ActionType.ACTION_CREATE_OBJECT], // bucket'a dosya yüklemeye izin verin
            resources: [],
        },
    ],
    principal: {
        type: PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
        value: uploaderEoaAccount,
    },
}).finish();

await waitTx(
    demo.createPolicy(policyDataToAllowUserOperateBucket, { value: relayFee.add(ackRelayFee) })
);
```

Artık dağıtım hesabı Greenfield'deki bucket'a dosya yükleyebilir.