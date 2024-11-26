---
title: Anahtar Çifti Oluşturma
sidebarSortOrder: 1
description:
  "Her işlem, Solana üzerindeki bir anahtar çifti tarafından imzalanmayı gerektirir. Solana'da Anahtar Çiftleri oluşturmayı öğrenin."
---

Solana blok zincirindeki herhangi bir işlem, bir anahtar çifti veya cüzdan gerektirir. Eğer `bir cüzdana bağlanıyorsanız`, anahtar çifti hakkında endişelenmenize gerek yoktur. Aksi takdirde, işlemleri imzalamak için bir anahtar çifti oluşturulmalıdır.

:::tip
Anahtar çifti oluştururken, güvenlik ve gizliliği artırmak için güçlü bir şifreleme algoritması kullanmanız önerilir.
:::





```javascript
import { generateKeyPairSigner } from "@solana/web3.js";

const signer = await generateKeyPairSigner();
console.log("adres: ", signer.address);
```





```javascript
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();
console.log("adres:", keypair.publicKey.toBase58());
```





:::info
Anahtar çifti, bir özel anahtar ve bir genel anahtar içerir. Özel anahtar, işlemleri imzalamak için kullanılırken, genel anahtar diğer kullanıcılar tarafından görünür ve almakta olduğunuz tutarı almak için kullanılır.
:::

:::warning
Anahtar çiftlerinizi güvenli bir yerde saklamayı unutmayın. Eğer özel anahtarınız kaybolursa, cüzdanınıza erişiminizi kaybedersiniz.
:::


Ek Bilgiler

Anahtar çifti oluşturma sürecinde, aşağıdaki adımları izlemek önemlidir:

1. İlgili kütüphaneyi yükleyin.
2. Anahtar çifti oluşturun.
3. Genel anahtarınızı paylaşın; özel anahtarınızı ise herkesle paylaşmayın.



:::note
Anahtar çiftleri oluşturmak için kullanılan yöntemler, geliştiricilerin farklı ihtiyaçlarına göre çeşitlilik gösterebilir.
:::

---