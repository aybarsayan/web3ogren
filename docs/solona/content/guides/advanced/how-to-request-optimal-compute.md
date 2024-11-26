---
date: 2024-03-19T00:00:00Z
difficulty: intermediate
title: Optimal Hesaplama Bütçesi Nasıl Talep Edilir
description:
  "İşlem simülasyonunu nasıl kullanacağınızı öğrenin
  ve harcanan hesaplama birimlerini alarak optimal bir işlem oluşturun."
tags:
  - compute
---

Solana üzerindeki tüm işlemler
[Hesaplama Birimleri (CU)](https://solana.com/docs/terminology#compute-units) kullanır; bu
birimler, işleminizin ağ üzerindeki hesaplama kaynaklarını ölçer. İşlemlerinizde
[öncelik ücretleri](https://solana.com/developers/guides/advanced/how-to-use-priority-fees)
öderken, beklediğiniz hesaplama birimlerinin tam miktarını belirtmelisiniz;
aksi takdirde, işleminiz için fazla ödeme yaparsınız. Bu kılavuz, işleminiz için
hesaplama birimlerini optimize etme konusunda adım adım talimatlar sağlayacaktır.

## Hesaplama Bütçesi Nasıl Talep Edilir

:::tip
İşleminizin hesaplama kaynakları üzerinde hassas kontrol sağlamak için
Compute Budget programından `setComputeUnitLimit` talimatını kullanın.
:::

Bu talimat, işleminiz için belirli bir sayıda hesaplama birimi tahsis eder,
ihtiyacınız olanı sadece ödemeyi sağlar.

```typescript
// import { ComputeBudgetProgram } from "@solana/web3.js"

const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300,
});
```

Bu talimat, işleminiz için belirli bir miktar hesaplama birimi tahsis edecektir. Kullanılacak sayıyı nasıl buluyoruz?

[simulateTransaction RPC yöntemi](https://solana.com/docs/rpc/http/simulatetransaction)
verilen bir işlemin tahmin edilen hesaplama birimlerini döndürecektir.

[Solana yardımcıları npm paketi](https://www.npmjs.com/package/@solana-developers/helpers)
şu içeriği sağlar:
[`getSimulationComputeUnits`](https://github.com/solana-developers/helpers?tab=readme-ov-file#get-simulated-compute-units-cus-for-transaction-instructions),
`simulateTransaction` kullanarak hesaplama birimlerini hesaplayan küçük bir
fonksiyon. Ardından, yeni işleminizde hesaplama birimlerini ayarlayabilir ve
optimal bir sonuç için yeni işlemi gönderebilirsiniz.

```
npm i @solana-developers/helpers
```

Sözdizimi basit:

```typescript
getSimulationComputeUnits(
  connection: Connection,
  instructions: Array<TransactionInstruction>,
  payer: PublicKey,
  lookupTables: Array<AddressLookupTableAccount>
);
```

Örneğin:

```typescript
const units = await getSimulationComputeUnits(
  connection,
  transactions,
  payer.publicKey,
);
```

:::info
`getSimulationComputeUnits` kullanarak, işleminizin harcadığı hesaplama
birimleri için uygun miktarda hesaplama birimi kullanan optimal bir işlem
oluşturabilirsiniz:
:::

```typescript
// import { ... } from "@solana/web3.js"

async function buildOptimalTransaction(
  connection: Connection,
  instructions: Array<TransactionInstruction>,
  signer: Signer,
  lookupTables: Array<AddressLookupTableAccount>,
) {
  const [microLamports, units, recentBlockhash] = await Promise.all([
    100 /* Optimal öncelik ücretlerini alın - https://solana.com/developers/guides/advanced/how-to-use-priority-fees*/,
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
    // birimlere biraz hata payı eklemek probably should 
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



Bu iki fonksiyonun kaynak kodu için Sammmmmy, aka [@stegaBOB](https://twitter.com/stegaBOB)'ye teşekkürler.



## Özel Hususlar

İşlemler için hesaplama birimleri her zaman istikrarlı değildir. Örneğin, yürüttüğünüz işlem `find_program_address` çağrısı içeriyorsa, hesaplama kullanımınız değişebilir; bu, bir program türetilmiş adresi bulurken geçerlidir.

:::warning
İşlemlerinizde değişken hesaplama kullanımı varsa, iki şeyden birini yapabilirsiniz:
:::

1. Zaman içinde işlemleriniz üzerinde bir test çalıştırarak maksimum
   hesaplama birimi kullanımını bulabilir ve bu sayıyı kullanabilirsiniz.
2. `simulateTransaction`'dan dönen hesaplama birimlerini alıp,
   toplamına bir yüzde ekleyebilirsiniz. Örneğin, %10 daha fazla CU eklemeye
   karar verdiyseniz ve `simulateTransaction`'dan aldığınız sonuç 1000 CU ise,
   işleminiz için 1100 CU ayarlamış olursunuz.

## Sonuç

:::note
İşleminiz için optimal hesaplama birimlerini talep etmek, işleminiz için
daha az ödeme yapmanıza ve işleminizi ağ üzerinde daha iyi planlamanıza yardımcı
olmak için önemlidir.
:::

Cüzdanlar, dApp'ler ve diğer hizmetler, kullanıcıları için en iyi deneyimi sağlamak amacıyla hesaplama birimi taleplerinin optimal olmasını
sağlamalıdır.

## Daha Fazla Kaynak

Hesaplama Bütçesi ve ilgili konular hakkında daha fazla bilgi edinebilirsiniz:

- `Hesaplama Bütçesi` için belgeler
- `öncelik ücretlerini nasıl kullanacağınız` üzerine kılavuz
- `programlardaki hesaplama birimlerini nasıl optimize edeceğiniz` üzerine kılavuz