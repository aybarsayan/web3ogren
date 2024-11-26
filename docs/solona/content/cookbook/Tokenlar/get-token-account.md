---
title: Token Hesabı Nasıl Alınır
sidebarSortOrder: 4
description:
  "Sahibi, mint ve bakiye de dahil olmak üzere Solana token hesabı ayrıntılarını nasıl alacağınızı öğrenin."
---

Her token hesabı, sahibi, mint ve miktar (bakiye) gibi token ile ilgili bilgilere sahiptir.

:::info
**Token Hesabı Bilgileri:** Token hesaplarında bulunması gereken bilgiler:
- **Sahibi:** Hesabın sahibinin kimliği.
- **Mint:** Token'ın kaynağı.
- **Bakiye:** Hesaptaki token miktarı.
:::

```typescript filename="get-token-account.ts"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const tokenAccountPubkey = new PublicKey(
    "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
  );

  let tokenAccount = await getAccount(connection, tokenAccountPubkey);
  console.log(tokenAccount);
  /*
  {
    address: PublicKey {
      _bn: <BN: 16aef79dfadb39ffedb3b6f77688b8c162b18bb9cba2ffefe152303629ae3030>
    },
    mint: PublicKey {
      _bn: <BN: 7351e5e067cc7cfefef42e78915d3c513edbb8adeeab4d9092e814fe68c39fec>
    },
    owner: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    },
    amount: 0n,
    delegate: null,
    delegatedAmount: 0n,
    isInitialized: true,
    isFrozen: false,
    isNative: false,
    rentExemptReserve: null,
    closeAuthority: null
  }
  */
})();
```

:::note
**Kullanım Senaryosu:** Yukarıdaki kod parçası, belirli bir token hesabının bilgilerini almak için kullanılabilir.
:::

Her token hesabı aşağıdaki bilgilere sahiptir:

- **Address:** Token hesabının benzersiz adresi.
- **Mint:** İlgili token için mint adresi.
- **Owner:** Token hesabı sahibinin adresi.
- **Amount:** Hesaptaki token miktarı (bakiye).
  
:::tip
**İpuçları:** Token hesapları hakkında daha fazla bilgi edinmek için resmi belgeleri inceleyin.
::: 

:::warning
**Dikkat:** Yanlış bir cüzdan adresi kullanmak, yanlış token bilgileri elde etmenize sebep olabilir.
:::

```typescript
// Token bilgilerini alırken dikkat edilmesi gereken bazı noktalar.
```

Herhangi bir hata ile karşılaşırsanız, sunduğumuz belgeleri gözden geçirmeniz önemlidir.