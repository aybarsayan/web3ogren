---
title: Token Transfer Etme
sidebarSortOrder: 7
description: "Solana hesapları arasında token transferi yapma"
---

Bir token hesabından başka bir token hesabına token transfer edebilirsiniz.

```typescript filename="transfer-token.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  transferChecked,
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

  const mintPubkey = new PublicKey(
    "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV",
  );

  const tokenAccountXPubkey = new PublicKey(
    "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
  );
  const tokenAccountYPubkey = new PublicKey(
    "GMxZfDmpR1b3vdJYXHzdF5noVLQogZuUAsDHHQ3ytPfV",
  );

  // 1) yerleşik fonksiyonu kullan
  {
    let txhash = await transferChecked(
      connection, // bağlantı
      feePayer, // ücret ödeyici
      tokenAccountXPubkey, // gönderen (bir token hesabı olmalı)
      mintPubkey, // mint
      tokenAccountYPubkey, // alıcı (bir token hesabı olmalı)
      alice, // gönderenin sahibi
      1e8, // miktar, eğer ondalıklarınız 8 ise, 1 token için 10^8 gönderin
      8, // ondalık
    );
    console.log(`txhash: ${txhash}`);
  }

  // ya da

  // 2) kendiniz oluşturun
  {
    let tx = new Transaction().add(
      createTransferCheckedInstruction(
        tokenAccountXPubkey, // gönderen (bir token hesabı olmalı)
        mintPubkey, // mint
        tokenAccountYPubkey, // alıcı (bir token hesabı olmalı)
        alice.publicKey, // gönderenin sahibi
        1e8, // miktar, eğer ondalıklarınız 8 ise, 1 token için 10^8 gönderin
        8, // ondalık
      ),
    );
    console.log(
      `txhash: ${await sendAndConfirmTransaction(connection, tx, [
        feePayer,
        alice /* ücret ödeyici + sahibi */,
      ])}`,
    );
  }
})();
```

:::tip
Bir token transferi yaparken, doğru adreslerin kullanıldığından emin olun.
:::

:::info
Bağlantı için "devnet" kullanıldığında, işlem maliyetleri düşüktür fakat test ortamında olduğunuzu unutmayın.
:::

---

### Token Transferi Yöntemleri

1. **Yerleşik Fonksiyonu Kullanarak Transfer:**
   ```typescript
   let txhash = await transferChecked(
     connection,
     feePayer,
     tokenAccountXPubkey,
     mintPubkey,
     tokenAccountYPubkey,
     alice,
     1e8,
     8,
   );
   ```

   **Not:** Miktar, eğer ondalıkların 8 ise, 1 token için 10^8 olarak gönderilmelidir.

2. **Kendiniz Oluşturarak Transfer:**
   ```typescript
   let tx = new Transaction().add(
     createTransferCheckedInstruction(
       tokenAccountXPubkey,
       mintPubkey,
       tokenAccountYPubkey,
       alice.publicKey,
       1e8,
       8,
     ),
   );
   ```

:::warning
Transfer işlemlerinde, gönderici ve alıcının token hesaplarının doğru olduğuna dikkat edin. Yanlış adres kullanımı, işlemin başarısız olmasına yol açabilir.
:::

:::note
Bu yöntemler, geliştiricilere daha fazla esneklik sunar. İhtiyaca göre kullanılacak method seçilebilir.
:::

:::danger
Token transfer işlemleri sırasında yanlış bir işlem yapmak, maddi kayıplara neden olabilir. Dikkatli olunmalıdır!
:::


Ek Bilgiler
Token transferi yaparken dikkat edilmesi gereken önemli noktalar:
- Uygun mint adresinin kullanıldığından emin olun.
- Yeterli bakiye mevcut olduğundan emin olun.
- Transfer işlemleri, blockchain üzerinde kaydedilir ve geri alınamaz.


---