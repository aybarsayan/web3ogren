---
title: Token Delegesini İptal Etme
sidebarSortOrder: 12
description:
  "Solana'da bir token delegesini nasıl iptal edeceğinizi öğrenin, delege
  izinlerini ve miktarlarını sıfırlayın."
---

İptal etmek, delegasyonu null olarak ayarlayacak ve tahsis edilen miktarı 0'a ayarlayacaktır.

:::info
Bu işlem, belirli bir token hesabının tüm delegasyonlarının kaldırılmasını sağlar.
:::

```typescript filename="revoke-token-delegate.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createRevokeInstruction, revoke } from "@solana/spl-token";
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
    "DRS5CSgPQp4uvPPcUA34tckfYFNUPNBJi77fVbnSfQHr",
  );

  // 1) yerleşik fonksiyonu kullan
  {
    let txhash = await revoke(
      connection, // bağlantı
      feePayer, // ödeme yapan
      tokenAccountPubkey, // token hesabı
      alice, // token hesabı sahibi
    );
    console.log(`txhash: ${txhash}`);
  }

  // veya

  // 2) kendiniz oluşturun
  {
    let tx = new Transaction().add(
      createRevokeInstruction(
        tokenAccountPubkey, // token hesabı
        alice.publicKey, // token hesabı sahibi
      ),
    );
    console.log(
      `txhash: ${await sendAndConfirmTransaction(connection, tx, [
        feePayer,
        alice /* ücret ödeyen + orijinal yetki */,
      ])}`,
    );
  }
})();
```

:::tip
Hesabınızın doğru bir şekilde yetkilendirilmiş olduğundan emin olun; aksi halde işleminiz başarısız olabilir.
:::


Daha Fazla Bilgi

Bu işlem, token delegasyonunda önemli bir adımdır. Aksi takdirde, tokenlarınızın başka bir hesap tarafından kullanılmasına izin vermiş olursunuz.



---

**Önemli:** Aşağıdaki kod, bir token delegasyonunu iptal etmenin iki yöntemini göstermektedir:

1. Yerleşik `revoke` fonksiyonu kullanma
2. Kendi işlem kodunuzu oluşturma

:::warning
Dinamik ve hatalı işlem dosyalarınız, varlık kaybına neden olabilir. Uygulamadan önce dikkatli olun.
:::