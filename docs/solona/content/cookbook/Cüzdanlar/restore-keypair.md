---
title: Anahtar Çifti Nasıl Geri Yüklenir
sidebarSortOrder: 2
description: "Solana'da bir gizli anahtardan anahtar çiftlerini nasıl geri yükleyeceğinizi öğrenin."
---

Eğer zaten gizli anahtarınızı veya byte'larınızı aldıysanız, bu gizli anahtardan anahtar çiftinizi alarak dApp'inizi test edebilirsiniz.

## Byte'lardan





```typescript
import { createKeyPairFromBytes } from "@solana/web3.js";

const keypairBytes = new Uint8Array([
  174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
  222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246, 15,
  185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121, 121,
  35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
]);

const keypair = await createKeyPairFromBytes(keypairBytes);
```




```typescript
import { Keypair } from "@solana/web3.js";

const keypairBytes = Uint8Array.from([
  174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
  222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246, 15,
  185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121, 121,
  35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
]);

const keypair = Keypair.fromSecretKey(keypairBytes);
```




## Base58 Dizesinden





```typescript
import { createKeyPairFromBytes, getBase58Codec } from "@solana/web3.js";

const keypairBase58 =
  "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG";
const keypairBytes = getBase58Codec().decode(keypairBase58);
const keypair = await createKeyPairFromBytes(keypairBytes);
```




```typescript
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

const keypairBase58 =
  "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG";
const keypairBytes = bs58.decode(keypairBase58);
const keypair = Keypair.fromSecretKey(keypairBytes);
```




:::info
Bu örneklerde kullanılan `keypairBytes` dizisi, anahtar çiftini oluşturmak için gereklidir. **Anahtarları dikkatli yönetin!**
:::

:::tip
Anahtar çiftinizi başarıyla oluşturduktan sonra, dApp'inizde kullanıma hazırdır. Devam etmek için doğru yere yerleştirdiğinizden emin olun.
:::

## Önemli Not
Anahtar çiftlerini geri yüklerken dikkatli olun. Yanlış bir işlem yapıldığında, anahtar bilgilerinizi kaybedebilirsiniz.

:::warning
Herhangi bir güvenlik açığına yol açmamak için, anahtar çiftlerinizi güvende tutun ve paylaşmayın.
:::

---

Anahtar çiftleri ile ilgili diğer bilgiler ve belgeler için [Solana Dokümantasyonu](https://solana.com/docs) adresine göz atabilirsiniz.