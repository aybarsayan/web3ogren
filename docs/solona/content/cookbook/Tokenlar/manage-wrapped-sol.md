---
title: Sarılı SOL Kullanma Yöntemleri
sidebarSortOrder: 13
description:
  "Solana'da sarılı SOL kullanmayı öğrenin, token hesapları oluşturma ve SOL transferleri veya token transferleri aracılığıyla bakiye ekleme dahil."
---

Sarılı SOL, diğer token mint'leri gibi. **Fark**, `syncNative` kullanarak ve token hesaplarını `NATIVE_MINT` adresinde özel olarak oluşturmaktır.

## Token Hesabı Oluşturma

`SPL token hesapları` oluşturma ile aynı ancak mint'i `NATIVE_MINT` ile değiştirin.

```js
import { NATIVE_MINT } from "@solana/spl-token";
```

## Bakiye Ekleme

Sarılı SOL için bakiye eklemenin iki yolu vardır.

### 1. SOL Transferi ile

:::tip
Bu yöntemi kullanarak, doğrudan SOL transferi yapabilir ve ardından bakiye senkronizasyonu gerçekleştirebilirsiniz.
:::

```typescript filename="add-balance-by-sol.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";

(async () => {
  // bağlantı
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2",
    ),
  );

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const alice = Keypair.fromSecretKey(
    bs58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
    ),
  );

  // önce ATA oluşturmayı unutmayın
  let ata = await getAssociatedTokenAddress(
    NATIVE_MINT, // mint
    alice.publicKey, // sahibi
  );

  let amount = 1 * 1e9; /* Sarılı SOL'un ondalık sayısı 9'dur */

  let tx = new Transaction().add(
    // SOL transferi
    SystemProgram.transfer({
      fromPubkey: alice.publicKey,
      toPubkey: ata,
      lamports: amount,
    }),
    // sarılı SOL bakiyesini senkronize et
    createSyncNativeInstruction(ata),
  );
  console.log(
    `txhash: ${await sendAndConfirmTransaction(connection, tx, [feePayer, alice])}`,
  );
})();
```

### 2. Token Transferi ile

:::info
Token transferi ile bakiye eklerken, öncelikle bir token hesabı oluşturmanız gerektiğini unutmayın.
:::

```typescript filename="add-balance-by-token.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  getMinimumBalanceForRentExemptAccount,
  getAssociatedTokenAddress,
  ACCOUNT_SIZE,
  createInitializeAccountInstruction,
  createTransferInstruction,
  createCloseAccountInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";

(async () => {
  // bağlantı
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2",
    ),
  );

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const alice = Keypair.fromSecretKey(
    bs58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
    ),
  );

  // önce ATA oluşturmayı unutmayın
  let ata = await getAssociatedTokenAddress(
    NATIVE_MINT, // mint
    alice.publicKey, // sahibi
  );

  let auxAccount = Keypair.generate();
  let amount = 1 * 1e9; /* Sarılı SOL'un ondalık sayısı 9'dur */

  let tx = new Transaction().add(
    // token hesabı oluştur
    SystemProgram.createAccount({
      fromPubkey: alice.publicKey,
      newAccountPubkey: auxAccount.publicKey,
      space: ACCOUNT_SIZE,
      lamports:
        (await getMinimumBalanceForRentExemptAccount(connection)) + amount, // kira + miktar
      programId: TOKEN_PROGRAM_ID,
    }),
    // token hesabını başlat
    createInitializeAccountInstruction(
      auxAccount.publicKey,
      NATIVE_MINT,
      alice.publicKey,
    ),
    // WSOL transferi
    createTransferInstruction(
      auxAccount.publicKey,
      ata,
      alice.publicKey,
      amount,
    ),
    // yardımcı hesabı kapat
    createCloseAccountInstruction(
      auxAccount.publicKey,
      alice.publicKey,
      alice.publicKey,
    ),
  );

  console.log(
    `txhash: ${await sendAndConfirmTransaction(connection, tx, [
      feePayer,
      auxAccount,
      alice,
    ])}`,
  );
})();