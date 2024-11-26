---
title: Bir Mnemonikten Anahtar Çifti Nasıl Geri Yüklenir
sidebarSortOrder: 5
description: "Solana'da bir mnemonikten anahtar çiftlerini nasıl geri yükleyeceğinizi öğrenin"
---

Birçok cüzdan uzantısı gizli anahtarlarını temsil etmek için mnemonikleri kullanır. Mnemonikleri yerel testler için anahtar çiftlerine dönüştürebilirsiniz.

## BIP39 formatındaki mnemonikleri geri yüklemek

:::info
BIP39 mnemonikleri, kullanıcıların özel anahtarlarını kolayca yedeklemelerine ve geri yüklemelerine olanak tanır.
:::

```typescript filename="restore-bip39-mnemonic.ts"
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";

const mnemonic =
  "pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter";

// arguments: (mnemonic, password)
const seed = bip39.mnemonicToSeedSync(mnemonic, "");
const keypair = Keypair.fromSeed(seed.slice(0, 32));

console.log(`${keypair.publicKey.toBase58()}`);

// output: 5ZWj7a1f8tWkjBESHKgrLmXshuXxqeY9SYcfbshpAqPG
```

:::tip
`bip39.mnemonicToSeedSync` fonksiyonu, mnemonikten bir tohum oluşturmak için kullanılır. Bu tohum, anahtar çiftinin oluşturulmasında kritik bir rol oynar.
:::

## BIP44 formatındaki mnemonikleri geri yüklemek

:::note
BIP44, çoklu hesap ve alt hesap yapısına izin vererek birden fazla varlık yönetimini kolaylaştırır.
:::

```typescript filename="restore-bip44-mnemonic.ts"
import { Keypair } from "@solana/web3.js";
import { HDKey } from "micro-ed25519-hdkey";
import * as bip39 from "bip39";

const mnemonic =
  "neither lonely flavor argue grass remind eye tag avocado spot unusual intact";

// arguments: (mnemonic, password)
const seed = bip39.mnemonicToSeedSync(mnemonic, "");
const hd = HDKey.fromMasterSeed(seed.toString("hex"));

for (let i = 0; i < 10; i++) {
  const path = `m/44'/501'/${i}'/0'`;
  const keypair = Keypair.fromSeed(hd.derive(path).privateKey);
  console.log(`${path} => ${keypair.publicKey.toBase58()}`);
}
```

:::warning
Anahtar çiftlerini geri yüklerken doğru path yapısının kullanıldığından emin olun. Yanlış bir path, istenmeyen sonuçlara yol açabilir.
:::

:::quote
"BIP39 ve BIP44, şifreleme ve anahtar yönetimi alanında standartlar oluşturarak, kullanıcıların güvenli bir şekilde varlıklarını yönetmelerine olanak tanır." — Dünya Kripto Uzmanı
:::