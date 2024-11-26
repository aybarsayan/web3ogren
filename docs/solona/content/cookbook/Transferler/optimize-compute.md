---
title: Hesaplama Talebini Optimize Etme
sidebarSortOrder: 6
---

Bir işlemin Hesaplama Talebini optimize etmek, **işlemin hem zamanında işlenmesini sağlamak** hem de *öncelik ücretlerinde fazla ödeme yapmaktan kaçınmak* için önemlidir.

:::tip
Optimal hesaplama talep etme hakkında daha fazla bilgi için, `tam kılavuzu inceleyin`.
:::

Ayrıca, bu detaylı kılavuzda `öncelik ücretlerini kullanma` hakkında daha fazla bilgi bulabilirsiniz.

```typescript filename="optimize-compute.ts"
// import { ... } from "@solana/web3.js"

async function buildOptimalTransaction(
  connection: Connection,
  instructions: Array<TransactionInstruction>,
  signer: Signer,
  lookupTables: Array<AddressLookupTableAccount>,
) {
  const [microLamports, units, recentBlockhash] = await Promise.all([
    100 /* Get optimal priority fees - https://solana.com/developers/guides/advanced/how-to-use-priority-fees*/,
    getSimulationComputeUnits(
      connection,
      instructions,
      signer.publicKey,
      lookupTables,
    ),
    connection.getLatestBlockhash(),
  ]);

  instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports }),
  );
  if (units) {
    // probably should add some margin of error to units
    instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({ units }));
  }
  return {
    transaction: new VersionedTransaction(
      new TransactionMessage({
        instructions,
        recentBlockhash: recentBlockhash.blockhash,
        payerKey: signer.publicKey,
      }).compileToV0Message(lookupTables),
    ),
    recentBlockhash,
  };
}
```

:::note
Bu optimizasyon yöntemlerini uygulamak, işlemlerinizi daha verimli hale getirebilir ve işlem sürelerinizi azaltabilir.
:::

:::warning
Hesaplama taleplerinin optimize edilmesi esnasında, potansiyel hatalara karşı dikkatli olunmalıdır.
:::

> **Anahtar Not:** Hesaplama taleplerinin optimize edilmesi, maliyetleri etkileyebilir.  
> — Geliştirici Kılavuzu