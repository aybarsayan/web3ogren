---
title: Token Nasıl Yakılır
sidebarSortOrder: 8
description: "Solana üzerinde token yakmayı öğrenin"
---

Token hesabı yetkilisiyseniz token yakabilirsiniz.

:::tip
Token yakma işlemi, belirli bir miktar token'ın yok edilmesi anlamına gelir. Bu işlem, arzı azaltarak token'ın değerini artırabilir.
:::

```typescript filename="burn-token.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { burnChecked, createBurnCheckedInstruction } from "@solana/spl-token";
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

  const mintPubkey = new PublicKey(
    "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV",
  );

  const tokenAccountPubkey = new PublicKey(
    "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
  );

  // 1) yerleşik fonksiyonu kullan
  {
    let txhash = await burnChecked(
      connection, // bağlantı
      feePayer, // ödeyen
      tokenAccountPubkey, // token hesabı
      mintPubkey, // mint
      alice, // sahip
      1e8, // miktar, eğer ondalık sayınız 8 ise, 1 token için 10^8
      8,
    );
    console.log(`txhash: ${txhash}`);
  }

  // veya

  // 2) kendiniz derleyin
  {
    let tx = new Transaction().add(
      createBurnCheckedInstruction(
        tokenAccountPubkey, // token hesabı
        mintPubkey, // mint
        alice.publicKey, // token hesabının sahibi
        1e8, // miktar, eğer ondalık sayınız 8 ise, 1 token için 10^8
        8, // ondalık
      ),
    );
    console.log(
      `txhash: ${await sendAndConfirmTransaction(connection, tx, [
        feePayer,
        alice /* ücret ödeyen + token yetkilisi */,
      ])}`,
    );
  }
})();
```

:::info
Yukarıdaki kod örneği, Solana üzerinde token yakmak için iki farklı yöntemi göstermektedir: `burnChecked` fonksiyonu ile doğrudan işlem yapma ve `createBurnCheckedInstruction` fonksiyonu ile kendi işleminizi oluşturma.
:::

:::note
Token yakma işlemi gerçekleştirilirken, işlemin uygun bir şekilde onaylanıp onaylanmadığını kontrol etmek önemlidir. Onay süresi, ağın yoğunluğuna bağlı olarak değişebilir.
:::

:::warning
Token yakma işlemi geri alınamaz. Yanlış bir işlem yaparsanız, token'larınız kalıcı olarak kaybedilebilir.
:::

---
