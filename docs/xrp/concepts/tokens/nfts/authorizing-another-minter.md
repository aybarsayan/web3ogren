---
title: Başka Bir Hesabı Yetkilendirme
seoTitle: NFTler İçin Başka Bir Hesabı Yetkilendirme
sidebar_position: 4
description: Bir hesap adına NFTler basmak için başka bir hesabın yetkilendirilmesi hakkında bilgi edineceksiniz. Bu içerik, yetkilendirilmiş bir basıcı atama ve kaldırma süreçlerini kapsamaktadır.
tags: 
  - NFT
  - yetkilendirilmiş basıcı
  - NFTokenMint
  - XRP Ledger
  - NFT basma
keywords: 
  - NFT
  - yetkilendirilmiş basıcı
  - NFTokenMint
  - XRP Ledger
  - NFT basma
---

## Başka Bir Basıcıyı Yetkilendirme

Her hesabın adına NFT basabilen 0 veya 1 yetkilendirilmiş basıcı olabilir. Bir basıcıyı yetkilendirerek, bir yaratıcı farklı bir hesabın NFT basmasına izin verebilir; bu da onlara daha fazla NFT üretmeye odaklanma imkanı tanır.

## Yetkilendirilmiş Bir Basıcı Atama

Yetkilendirilmiş basıcıyı `AccountSet` işlemi ile belirlersiniz.

```js
tx_json = {
  "TransactionType": "AccountSet",
  "Account": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m",
  "NFTokenMinter": "r3riWB2TDWRmwmT7FRKdRHjqm6efYu4s9C",
  "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
}
```

`NFTokenMinter`, aynı XRP Ledger örneğindeki bir hesabın kimlik numarasıdır. `asfAuthorizedNFTokenMinter` bayrağı, `NFTokenMinter` hesabının `Account` adına NFT basmasına izin verir.

:::note
`asfAuthorizedNFTokenMinter` bayrağı yalnızca `AccountSet` işleminde kullanılır. İşlemin, bir hesap kökü üzerindeki NFTokenMinter alanının varlığını veya değerini etkileyip etkilemediğini gösterir. Özellikle, AccountRoot üzerinde karşılık gelen bir bayrak yoktur.
:::

## Yetkilendirilmiş Bir Basıcıyı İşten Çıkarma

Bir yetkilendirilmiş basıcıyı kaldırmak için `AccountSet` işlemini kullanın ve `asfAuthorizedNFTokenMinter` bayrağını temizleyin.

```js
tx_json = {
  "TransactionType": "AccountSet",
  "Account": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m",
  "ClearFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
}
```

## Başka Bir Hesap İçin NFT Basma

Başka bir hesap için token basarken standart `NFTokenMint` işlemini kullanırsınız. Fark, NFT'yi basarken `Issuer` alanını, basacağınız NFT için hesap kimliğini dahil etmeniz gerektiğidir.

```js
const transactionBlob = {
  "TransactionType": "NFTokenMint",
  "Account": "r3riWB2TDWRmwmT7FRKdRHjqm6efYu4s9C",
  "URI": xrpl.convertStringToHex("ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"),
  "Flags": 8,
  "TransferFee": 5000,
  "NFTokenTaxon": 0,
  "Issuer": "rrE5EgHN4DfjXhR9USecudHm7UyhTYq6m", // Başka bir hesap için basarken gerekli.
}
```

> **Not:** Siz veya bir aracınız NFT'yi satışa çıkardığında, TransferFee (satışın yüzdesi) sizin ihraç eden hesabınıza aktarılır. — 