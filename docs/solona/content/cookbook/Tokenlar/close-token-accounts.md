---
title: Token Hesaplarını Kapatma Yöntemi
sidebarSortOrder: 9
description:
  "Wrapped SOL ve boş hesaplar gibi durumları da içeren, Solana'da token hesaplarını nasıl kapatacağınızı öğrenin."
---

Bir token hesabını kapatabilirsiniz eğer onu artık kullanmak istemiyorsanız. İki durum vardır:

1. **Wrapped SOL** - Kapatma işlemi Wrapped SOL'u SOL'a dönüştürür.
2. **Diğer Tokenler** - Sadece token hesabının bakiyesi **0** ise kapatabilirsiniz.

:::tip
**Önemli Not:** Kapatmadan önce, tüm bakiyelerinizi geri çektiğinizden emin olun.
:::

```typescript filename="close-token-account.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { closeAccount, createCloseAccountInstruction } from "@solana/spl-token";
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

  const tokenAccountPubkey = new PublicKey(
    "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
  );

  // 1) yerleşik işlevi kullan
  {
    let txhash = await closeAccount(
      connection, // bağlantı
      feePayer, // ödeyen
      tokenAccountPubkey, // kapatmak istediğiniz token hesabı
      alice.publicKey, // hedef
      alice, // token hesabının sahibi
    );
    console.log(`txhash: ${txhash}`);
  }

  // veya

  // 2) kendiniz oluşturun
  {
    let tx = new Transaction().add(
      createCloseAccountInstruction(
        tokenAccountPubkey, // kapatmak istediğiniz token hesabı
        alice.publicKey, // hedef
        alice.publicKey, // token hesabının sahibi
      ),
    );
    console.log(
      `txhash: ${await sendAndConfirmTransaction(connection, tx, [
        feePayer,
        alice /* ücret ödeyen + sahibi */,
      ])}`,
    );
  }
})();
```

:::info
**Ekstra Bilgi:** Kapatılan token hesaplarındaki SOL, ilgili hesap sahibi tarafından geri alınamaz. Bu nedenle, önemli varlıklarınızı korumak için dikkatli olun.
:::

:::warning
**Dikkat:** Token hesabını kapatırken, tüm bakiyelerin sıfır olduğundan emin olun. Aksi takdirde işlem başarısız olacaktır.
:::


Daha Fazla Bilgi

Kapatma işlemi sonucu, fazladan ağaç kalıntıları veya bekleyen işlemler bırakmamak için, tüm işlemlerin tamamlandığından emin olmalısınız. Hesap kapandıktan sonra, bu hesapla ilgili hiçbir işlem gerçekleştiremeyeceksiniz.



---