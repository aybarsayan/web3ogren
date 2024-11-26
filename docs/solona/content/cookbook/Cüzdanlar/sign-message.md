---
title: Mesajı Nasıl İmzalayıp Doğrulayıp
sidebarSortOrder: 6
description: "Solana'da mesajları nasıl imzalayacağınızı öğrenin."
---

Ana işlevi bir anahtar çiftinin, mesajları, işlemleri imzalamak ve imzanın
doğrulanmasına olanak tanımaktır. **Bir imzanın doğrulanması**, alıcının verilerin
belirli bir özel anahtarın sahibi tarafından imzalandığından emin olmasını sağlar.

:::info
**Dikkat edilmesi gereken:**
Doğru ve güvenli bir imzalama işlemi için anahtar çiftlerinin gizliliğine önem verilmelidir.
:::

 


```typescript
import {
  generateKeyPair,
  signBytes,
  verifySignature,
  getUtf8Encoder,
  getBase58Decoder,
} from "@solana/web3.js";

const keys = await generateKeyPair();
const message = getUtf8Encoder().encode("Merhaba, Dünya!");
const signedBytes = await signBytes(keys.privateKey, message);

const decoded = getBase58Decoder().decode(signedBytes);
console.log("İmza:", decoded);

const verified = await verifySignature(keys.publicKey, signedBytes, message);
console.log("Doğrulandı:", verified);
```





Solana Web3.js v1'de [TweetNaCl](https://www.npmjs.com/package/tweetnacl) kripto kütüphanesini
kullanabiliriz:

```typescript
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { decodeUTF8 } from "tweetnacl-util";

const keypair = Keypair.fromSecretKey(
  Uint8Array.from([
    174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
    222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
    15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
    121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
  ]),
);

const message = "Hızlı kahverengi tilki tembel köpeğin üzerine atlar";
const messageBytes = decodeUTF8(message);

const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
const result = nacl.sign.detached.verify(
  messageBytes,
  signature,
  keypair.publicKey.toBytes(),
);

console.log(result);
```




:::tip
**Öneri:** İmzanızın geçerliliğini düzenli olarak kontrol edin ve anahtar çiftlerini güvenli bir şekilde saklayın.
::: 

--- 

:::note
**İlgi çekici bir not:**
Kullanıcılar, imza oluşturma işlemini özelleştirebilir ve farklı mesaj formatları deneyebilir.
::: 

:::warning
**Potansiyel sıkıntılar:**
Anahtarların kaybolması ya da ele geçirilmesi durumunda, imzaların güvenliği tehdit altında olabilir.
:::