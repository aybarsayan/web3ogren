---
title: Token Hesapları veya Mintler Üzerinde Yetki Nasıl Ayarlanır
sidebarSortOrder: 10
description:
  "Solana token hesapları ve mintler üzerinde yetki ayarlamayı öğrenin. Token'ları kimlerin değiştirebileceğini veya yönetebileceğini kontrol etmek için hayati öneme sahiptir."
---

Yetki ayarlayabilir/güncelleyebilirsiniz. **4 tür vardır:**

1. MintTokens (mint hesabı)
2. FreezeAccount (mint hesabı)
3. AccountOwner (token hesabı)
4. CloseAccount (token hesabı)

```typescript filename="set-authority.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  AuthorityType,
  createSetAuthorityInstruction,
  setAuthority,
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
  console.log(`rastgele kişi: ${randomGuy.publicKey.toBase58()}`);

  const mintPubkey = new PublicKey(
    "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV",
  );

  // yetki türü

  // 1) mint hesabı için
  // AuthorityType.MintTokens
  // AuthorityType.FreezeAccount

  // 2) token hesabı için
  // AuthorityType.AccountOwner
  // AuthorityType.CloseAccount

  // 1) yerleşik fonksiyonu kullanın
  {
    let txhash = await setAuthority(
      connection, // bağlantı
      feePayer, // ödeyici
      mintPubkey, // mint hesabı || token hesabı
      alice, // mevcut yetki
      AuthorityType.MintTokens, // yetki türü
      randomGuy.publicKey, // yeni yetki (kapatmak için `null` geçirebilirsiniz)
    );
    console.log(`txhash: ${txhash}`);
  }

  // ya da

  // 2) kendiniz oluşturun
  {
    let tx = new Transaction().add(
      createSetAuthorityInstruction(
        mintPubkey, // mint hesabı || token hesabı
        alice.publicKey, // mevcut yetki
        AuthorityType.MintTokens, // yetki türü
        feePayer.publicKey, // yeni yetki (kapatmak için `null` geçirebilirsiniz)
      ),
    );
    console.log(
      `txhash: ${await sendAndConfirmTransaction(connection, tx, [
        feePayer,
        alice /* ödeme yapan + orijinal yetki */,
      ])}`,
    );
  }
})();
```

:::tip
Token yetkilerini aylık olarak gözden geçirmeniz önerilir.
:::

:::info
Yetkilerinizi güncellerken, eski yetkileri kaldırmayı unutmayın!
:::

:::warning
Geçersiz veya hatalı yetki ayarları işlem kaybına neden olabilir.
:::

:::note
Her bir yetki türü belirli işlemleri kontrol eder, bu yüzden dikkatli ayarlayın.
:::

> **"Her yetki türü, işlemlerin güvenli bir şekilde yönetilmesi için kritiktir."**  
> — Solana Geliştirme Ekibi