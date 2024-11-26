---
title: Test SOL Alma
sidebarSortOrder: 3
description: Geliştirme amaçları için test SOL nasıl alınır öğrenin.
---

Yerel olarak çalışırken, işlemleri göndermek için biraz SOL'e ihtiyacınız var. Ana ağ dışındaki ortamlarda, adresinize airdrop ile SOL alabilirsiniz.

:::info
**Önemli Bilgi:** Test ortamlarında gerçek SOL kullanılmaz; bunun yerine, airdrop ile alınan SOL kullanılır.
:::

```typescript filename="get-test-sol.ts"
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

(async () => {
  const keypair = Keypair.generate();

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  const signature = await connection.requestAirdrop(
    keypair.publicKey,
    LAMPORTS_PER_SOL,
  );
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature,
  });
})();
```

:::tip
**Tavsiyeler:** SOL almak için airdrop isteği yaparken, gönderi başına alabileceğiniz maksimum miktara dikkat edin.
:::


Ek Bilgiler

Airdrop talebi, Solana blok zinciri üzerinde işlem yapılmadan önce cüzdanınıza SOL eklemenin en hızlı yoludur. Cüzdanınızın bakiyesini kontrol etmek için aşağıdaki yöntemi kullanabilirsiniz.

```typescript
const balance = await connection.getBalance(keypair.publicKey);
console.log(`Cüzdan bakiyesi: ${balance / LAMPORTS_PER_SOL} SOL`);
```



:::warning
**Potansiyel Teferruatlar:** Airdrop talebi, yoğun zamanlarda işlenmeyebilir. Bu durumda, aynı işlemi bir süre sonra tekrar deneyin.
:::

Yapılan airdrop işlemi onaylandıktan sonra, cüzdanınıza SOL eklenmiş olacaktır. 

> **Anahtar Nokta:** Test SOL veya airdrop ile aldığınız SOL, yalnızca test amaçlıdır ve herhangi bir gerçek değer taşımaz. — Geliştirme Takımı

---