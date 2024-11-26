---
title: Yetkili Tarafından Tüm Token Hesaplarını Alma
sidebarSortOrder: 14
description:
  "Sahip tarafından Solana token hesaplarını nasıl alacağınızı öğrenin, tüm hesaplar veya mint'e göre filtrelenmiş olarak."
---

Sahip tarafından token hesaplarını alabilirsiniz. Bunu yapmanın iki yolu vardır.

---

1. **Tüm Token Hesabı Al**

```typescript filename="get-token-account-by-owner-all.ts"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

(async () => {
  // bağlantı
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const owner = new PublicKey("G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY");
  let response = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  response.value.forEach(accountInfo => {
    console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
    console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
    console.log(
      `owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`,
    );
    console.log(
      `decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`,
    );
    console.log(
      `amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`,
    );
    console.log("====================");
  });
})();
```

:::tip
**Not:** Hesapları alırken, bir **PublicKey**'in geçerliliğinden emin olun. Aksi takdirde, hatalarla karşılaşabilirsiniz.
:::

2. **Mint'e Göre Filtreleme**

```typescript filename="get-account-by-owner-by-mint.ts"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

(async () => {
  // bağlantı
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const owner = new PublicKey("G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY");
  const mint = new PublicKey("54dQ8cfHsW1YfKYpmdVZhWpb9iSi6Pac82Nf7sg3bVb");

  let response = await connection.getParsedTokenAccountsByOwner(owner, {
    mint: mint,
  });

  response.value.forEach(accountInfo => {
    console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
    console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
    console.log(
      `owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`,
    );
    console.log(
      `decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`,
    );
    console.log(
      `amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`,
    );
    console.log("====================");
  });
})();
```

:::info
Filtreleme işlemi, belirli bir mint ile ilişkilendirilmiş hesapları bulmak için oldukça etkilidir. Her iki yöntem de **Solana** blok zinciri ile etkileşimde bulunmanıza yardımcı olur.
:::

---
