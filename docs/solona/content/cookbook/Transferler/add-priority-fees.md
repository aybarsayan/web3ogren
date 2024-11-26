---
title: Bir İşleme Öncelik Ücretleri Ekleme
sidebarSortOrder: 5
description:
  "Solana'da önceliklendirme sırasına göre gerçekleştirilen işlemler. Solana'da öncelik ücretleri ile işleminizin önceliğini nasıl artıracağınızı öğrenin."
---

İşlem (TX) önceliği, Temel Ücrete ek olarak bir Önceliklendirme Ücreti ödeyerek elde edilir. Varsayılan olarak hesaplama bütçesi, **200.000 Hesaplama Birimi (CU)** \* talimat sayısının ürünüdür ve maksimum **1.4M CU**'dur. **Temel Ücret**, imza başına **5.000 Lamport**'tur. Bir mikroLamport, **0.000001 Lamport**'tur.

> **Öncelik ücretlerini nasıl kullanacağınızla ilgili detaylı bir kılavuzu buradan bulabilirsiniz**
> `öncelik ücretleri nasıl kullanılır`.

---

Tek bir TX için toplam hesaplama bütçesi veya Önceliklendirme Ücreti, `ComputeBudgetProgram`'dan talimatlar ekleyerek değiştirilebilir.

```typescript
ComputeBudgetProgram.setComputeUnitPrice({ microLamports: number });
```

Temel Ücretin (5.000 Lamport) üzerine bir Önceliklendirme Ücreti ekleyecektir. MikroLamport olarak sağlanan değer, Önceliklendirme Ücretini belirlemek için CU bütçesi ile çarpılacaktır. Örneğin, CU bütçeniz **1M CU** ise ve **1 mikroLamport/CU** ekliyorsanız, Önceliklendirme Ücreti **1 Lamport** (1M \* 0.000001) olacaktır. Toplam ücret daha sonra **5001 Lamport** olacaktır.

:::tip
Yeni bir hesaplama bütçesi ayarlamak için `ComputeBudgetProgram.setComputeUnitLimit({ units: number })` kullanın. Sağlanan değer varsayılan değeri değiştirecektir.
:::

---

İşlemler, verimliliği artırmak veya ücretleri azaltmak için yürütme için gereken minimum CU miktarını talep etmelidir.


İşlem bütçesi yönetimi hakkında daha fazla bilgi

- İşlemi daha verimli hale getirmek için Önceliklendirme Ücretlerini nasıl etkili bir şekilde kullanabileceğinizi öğrenin.
- **Her zaman tahmin edilen bütçenizi aşabilecek değişken faktörleri göz önünde bulundurun**.






```typescript filename="add-priority-fees.ts" {61-72} {37-38} {77-87}
import {
  airdropFactory,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  devnet,
  generateKeyPairSigner,
  getComputeUnitEstimateForTransactionMessageFactory,
  getSignatureFromTransaction,
  lamports,
  pipe,
  prependTransactionMessageInstructions,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/web3.js";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";
import { getAddMemoInstruction } from "@solana-program/memo";

async function writeMemoWithPriorityFees(message: string) {
  // RPC oluştur.
  const CLUSTER = "devnet";
  const rpc = createSolanaRpc(devnet(`https://api.${CLUSTER}.solana.com`));
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    devnet(`wss://api.${CLUSTER}.solana.com`),
  );

  // Airdrop fonksiyonu oluştur.
  const airdrop = airdropFactory({ rpc, rpcSubscriptions });

  // Bir işlem mesajının hesaplama tüketimini tahmin eden bir yardımcı fonksiyonu oluştur.
  const getComputeUnitEstimate =
    getComputeUnitEstimateForTransactionMessageFactory({ rpc });

  // İşlem gönderme fonksiyonu oluştur.
  const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
  });

  // Bir hesap oluştur ve fonla.
  const keypairSigner = await generateKeyPairSigner();
  console.log("Adresle bir hesap oluşturuldu", keypairSigner.address);
  console.log("Airdrop talep ediliyor");
  await airdrop({
    commitment: "confirmed",
    lamports: lamports(1000_000n),
    recipientAddress: keypairSigner.address,
  });
  console.log("Airdrop onaylandı");

  // Bir memo işlemi oluştur.
  console.log("Bir memo işlemi oluşturuluyor");
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const transactionMessage = pipe(
    createTransactionMessage({ version: "legacy" }),
    m => setTransactionMessageFeePayerSigner(keypairSigner, m),
    m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    m =>
      appendTransactionMessageInstructions(
        [
          getSetComputeUnitPriceInstruction({ microLamports: 5000n }),
          getAddMemoInstruction({ memo: message }),
        ],
        m,
      ),
  );

  // Bu işlem için ne kadar hesaplama birimi bütçesi gerektiğini belirleyin
  // böylece hesaplama bütçesini, bir bloğa dahil edilme şansını artırmak için
  // doğru şekilde ayarlayabilirsiniz.
  console.log("İşlemin hesaplama tüketimini tahmin ediliyor");
  var estimatedComputeUnits = await getComputeUnitEstimate(transactionMessage);
  // Bu tahminler oldukça doğru olsa da mükemmel değildir. Öyleyse işlem
  // tahmin edilenden daha fazla hesaplama birimi tüketiyorsa bir yedek eklemek isteyebilirsiniz.
  // Gelecekte gönderirken işlemin ne kadar tüketeceğini tam olarak bilmek mümkün değildir.
  // Durum değişebilir. Tahminde bu durumu göz önünde bulundurmak için bir yedek ekleyebilirsiniz.
  // estimatedComputeUnits += 1000;
  // estimatedComputeUnits *= 1.1;
  // Sorun hakkında daha fazla bilgi edinmek için burayı okuyabilirsiniz: https://github.com/solana-labs/solana-web3.js/tree/master/packages/library#getcomputeunitestimatefortransactionmessagefactoryrpc

  console.log(
    `İşlemin tahmin edilen hesaplama tüketimi ${estimatedComputeUnits} hesaplama birimidir`,
  );
  const budgetedTransactionMessage = prependTransactionMessageInstructions(
    [getSetComputeUnitLimitInstruction({ units: estimatedComputeUnits })],
    transactionMessage,
  );

  // İşlemi imzala ve gönder.
  console.log("İşlemi imzalayıp gönderiyorum");
  const signedTx = await signTransactionMessageWithSigners(
    budgetedTransactionMessage,
  );
  const signature = getSignatureFromTransaction(signedTx);
  console.log(
    "İşlem gönderiliyor https://explorer.solana.com/tx/" +
      signature +
      "/?cluster=" +
      CLUSTER,
  );
  await sendAndConfirmTransaction(signedTx, { commitment: "confirmed" });
  console.log("İşlem onaylandı");
}

writeMemoWithPriorityFees("Merhaba, öncelik ücretleri!");
```





```typescript filename="add-priority-fees.ts" {25-28, 30-33}
import { BN } from "@coral-xyz/anchor";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

(async () => {
  const payer = Keypair.generate();
  const toAccount = Keypair.generate().publicKey;

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  // belirli bir hesaplama birimi bütçesi talep et
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });

  // istenen öncelik ücretini ayarla
  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  // Toplam ücret 1M CU için 5.001 Lamport olacaktır
  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount,
        lamports: 10000000,
      }),
    );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  console.log(signature);

  const result = await connection.getParsedTransaction(signature);
  console.log(result);
})();
```



