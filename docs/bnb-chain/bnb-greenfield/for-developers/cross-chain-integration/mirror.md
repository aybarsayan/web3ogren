---
title: CLI ile Kaynak Yansıtma - BNB Greenfield Cross Chain Entegrasyonu
description: Bu belge, BNB Greenfield'dan BSC'ye kaynak yansıtma sürecini detaylandırmaktadır. Yansıtma işlemlerinin nasıl gerçekleştirileceğine ve örnek komutların kullanımına dair bilgiler sunulmaktadır.
keywords: [BNB Greenfield, BSC, kaynak yansıtma, ERC-721, ERC-1155, NFT, testnet]
---

# CLI ile Kaynak Yansıtma

## Giriş

BNB Greenfield'dan BSC'ye yansıtma süreci sırasında, **dosyanın içeriği kopyalanmaz**. Bu, BNB Greenfield blockchain'inde saklanan verilerin veya dosya meta verilerinin BSC'ye aktarılmadığı anlamına gelir. Dolayısıyla, gerçek dosya içeriği çoğaltılmadığı için yansıtma sürecine herhangi bir boyut sınırlaması getirilmez.

## Yansıtma Nesneleri

:::info
Nesneler, BSC'de **ERC-721 NFT** olarak yansıtılabilir.
:::

BSC testnet'e yansıtma için örnek komut:
```shell
gnfd-cmd object mirror --bucketName yourBucketName --objectName yourObjectName --destChainId 97
```

**Örnek çıktı:**
```
mirror object succ, txHash: 0774F400EBD42FAB009A6B3C303EF8625B57AB551E0F065C546B892167938122
```
Yansıtma işleminin detaylarını görmek için [GreenfieldScan](https://testnet.greenfieldscan.com) adresine gidebilirsiniz.

Daha sonra, [BscScan](https://testnet.bscscan.com) adresine giderek size transfer edilen bir NFT bulabilirsiniz.

![İşlem Detayları](../../../images/bnb-chain/bnb-greenfield/static/asset/mirror-object.png)

---

## Yansıtma Kova

Yansıtma kovaları aynı prosedürü takip eder ve nesneleri yansıtır.

BSC testnet'e yansıtma için örnek komut:
```shell
gnfd-cmd object mirror --bucketName yourBucketName  --destChainId 97
```

**Örnek çıktı:**
```
mirror bucket succ, txHash: 0xba1ca47a2271864b2010158b13535331301ba3289aab8e373503e91e3a41d0a7
```
Yansıtma işleminin detaylarını görmek için [GreenfieldScan](https://testnet.greenfieldscan.com) adresine gidebilirsiniz.

Daha sonra, [BscScan](https://testnet.bscscan.com) adresine giderek size transfer edilen bir NFT bulabilirsiniz.

---

## Yansıtma Grubu

Bir gruptaki üyeler, kaynakları belirlemek için izinleri temsil eder ve **ERC-1155 token** olarak yansıtılabilir.

BSC testnet'e yansıtma için örnek komut:

```shell
// BSC'ye NFT olarak bir grubu yansıt, grup kimliğini veya grup adını kullanarak grubu tanımlayabilirsiniz
gnfd-cmd group mirror --id 1
// grup kimliği ile bir grubu yansıt
gnfd-cmd group mirror --groupName yourGroupName
```

**Örnek çıktı:**
```shell
mirror_group:
transaction hash: 99A749ECC3CEB8B7CF4B8132A19D1A04EF7247F8549477B6AD28CA69BD11E66A
```
Yansıtma işleminin detaylarını görmek için [GreenfieldScan](https://testnet.greenfieldscan.com) adresine gidebilirsiniz.

Daha sonra, [BscScan](https://testnet.bscscan.com) adresine giderek size transfer edilen bir NFT bulabilirsiniz.