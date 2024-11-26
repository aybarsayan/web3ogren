---
title: Token Mintleme Yöntemi
sidebarSortOrder: 6
description:
  "Solana üzerinde token mintlemeyi öğrenin, arzı artırın ve yeni
  tokenleri belirli bir hesaba aktarın."
---

Token mintlediğinizde, arzı artırır ve yeni tokenleri belirli bir token hesabına aktarırısınız.

:::info
Token mintleme işlemi, yeni tokenlerin yaratılmasını ve mevcut token arzının artırılmasını sağlar. 
:::

```typescript filename="mint-tokens.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createMintToCheckedInstruction,
  mintToChecked,
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

  const tokenAccountPubkey = new PublicKey(
    "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
  );

  // 1) yerleşik fonksiyonu kullanın
  {
    let txhash = await mintToChecked(
      connection, // bağlantı
      feePayer, // ücret ödeyici
      mintPubkey, // mint
      tokenAccountPubkey, // alıcı (bir token hesabı olmalıdır)
      alice, // mint yetkisi
      1e8, // miktar. ondalık kesiriniz 8 ise, 1 token için 10^8 mintlersiniz.
      8, // ondalık kesir
    );
    console.log(`txhash: ${txhash}`);

    // eğer alice bir çok imza hesabıysa
    // let txhash = await mintToChecked(
    //   connection, // bağlantı
    //   feePayer, // ücret ödeyici
    //   mintPubkey, // mint
    //   tokenAccountPubkey, // alıcı (bir token hesabı olmalıdır)
    //   alice.publicKey, // !! mint yetkisi pubkey !!
    //   1e8, // miktar. ondalık kesiriniz 8 ise, 1 token için 10^8 mintlersiniz.
    //   8, // ondalık kesir
    //   [signer1, signer2 ...],
    // );
  }

  // veya

  // 2) kendiniz oluşturun
  {
    let tx = new Transaction().add(
      createMintToCheckedInstruction(
        mintPubkey, // mint
        tokenAccountPubkey, // alıcı (bir token hesabı olmalıdır)
        alice.publicKey, // mint yetkisi
        1e8, // miktar. ondalık kesiriniz 8 ise, 1 token için 10^8 mintlersiniz.
        8, // ondalık kesir
        // [signer1, signer2 ...], // yalnızca çoklu imza hesabı kullanacak
      ),
    );
    console.log(
      `txhash: ${await sendAndConfirmTransaction(connection, tx, [
        feePayer,
        alice /* ücret ödeyici + mint yetkisi */,
      ])}`,
    );
  }
})();
```

:::tip
Kodunuzun çalışmasını sağlamak için gerekli olan tüm bağımlılıkların yüklü olduğundan emin olun.
:::

:::note
1 token için `1e8` mintlendiğinde, toplamda 100,000,000 (yüz milyon) birim üretmiş oluyorsunuz.
:::

:::warning
Mintleme işlemi sırasında bağlantı hatası alırsanız, internet bağlantınızı ve Solana ağı sağlığını kontrol edin.
:::

:::danger
Mintleme işlemi tamamlanmadan uygulamanızı kapatmayın; aksi takdirde işlem kaybolabilir.
:::

---
