---
title: Token Hesaplarını Devretme
sidebarSortOrder: 11
description: "Başka birine token yetkisi nasıl devredilir öğrenin"
---

Bir yetkili belirleyebilirsiniz ve bu yetkili belirli bir miktar için geçerlidir. Ayarladıktan sonra, yetkili
token hesabınızın başka bir sahibi gibidir.

:::info
Bir token hesabı aynı anda yalnızca bir hesaba yetki devredebilir.
:::

```typescript filename="token-approve.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  approveChecked,
  createApproveCheckedInstruction,
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

  const randomGuy = Keypair.generate();

  const mintPubkey = new PublicKey(
    "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV",
  );
  const tokenAccountPubkey = new PublicKey(
    "GMxZfDmpR1b3vdJYXHzdF5noVLQogZuUAsDHHQ3ytPfV",
  );

  // 1) yerleşik fonksiyonu kullanın
  {
    let txhash = await approveChecked(
      connection, // bağlantı
      feePayer, // ücret ödeyici
      mintPubkey, // mint
      tokenAccountPubkey, // token hesabı
      randomGuy.publicKey, // yetkili
      alice, // token hesabının sahibi
      1e8, // miktar, eğer ondalık sayılarınız 8 ise, 1 token için 10^8
      8, // ondalık
    );
    console.log(`txhash: ${txhash}`);
  }
  // veya

  // 2) kendiniz oluşturun
  {
    let tx = new Transaction().add(
      createApproveCheckedInstruction(
        tokenAccountPubkey, // token hesabı
        mintPubkey, // mint
        randomGuy.publicKey, // yetkili
        alice.publicKey, // token hesabının sahibi
        1e8, // miktar, eğer ondalık sayılarınız 8 ise, 1 token için 10^8
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
Güvenlik nedeniyle, yetki devri yapmadan önce her zaman işlemlerinizin doğru ayarlandığından emin olun.
:::

:::note
Aşağıdaki yöntemlerden herhangi biri, token onayı vermek için kullanılabilir; hangi yöntemin kullanılacağı, uygulamanızın ihtiyaçlarına bağlıdır.
:::

---