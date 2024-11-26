---
title: İşlem Eklemek için Not Nasıl Eklenir
sidebarSortOrder: 4
description:
  "İşlemler, hangi işlemin yapıldığına dair meta veri bilgileri ile birlikte gelir. Solana üzerindeki işlemlerinize nasıl not ekleyeceğinizi öğrenin."
---

Herhangi bir işlem, not programını kullanarak bir mesaj ekleyebilir. web3.js@1'de **Not Programı**'ndan programID manuel olarak eklenmelidir:
`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`. V2'de `getAddMemoInstruction` kullanabilirsiniz.





```typescript filename="add-memo.ts" {61-72}
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
  type Transaction,
} from "@solana/web3.js";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";
import { getAddMemoInstruction } from "@solana-program/memo";

async function writeMemo(message: string) {
  // RPC oluştur.
  const CLUSTER = "devnet";
  const rpc = createSolanaRpc(devnet(`https://api.${CLUSTER}.solana.com`));
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    devnet(`wss://api.${CLUSTER}.solana.com`),
  );

  // Bir airdrop işlevi oluştur.
  const airdrop = airdropFactory({ rpc, rpcSubscriptions });

  // Bir işlem mesajının hesaplama tüketimini tahmin eden bir yardımcı araç oluştur.
  const getComputeUnitEstimate =
    getComputeUnitEstimateForTransactionMessageFactory({ rpc });

  // İşlem gönderme işlevi oluştur.
  const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
  });

  // Bir hesap oluştur ve finanse et.
  const keypairSigner = await generateKeyPairSigner();
  console.log("Adresle bir hesap oluşturuldu", keypairSigner.address);
  console.log("Airdrop talep ediliyor");
  await airdrop({
    commitment: "confirmed",
    lamports: lamports(1000_000n),
    recipientAddress: keypairSigner.address,
  });
  console.log("Airdrop onaylandı");

  // Bir not işlem oluştur.
  console.log("Bir not işlemi oluşturuluyor");
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

  // Bu işlem için bütçelendirilmesi gereken hesaplama birimlerinin sayısını belirleyin
  // böylece bu işlem için maksimum blok içine dahil edilme şansını artırmak için
  // hesaplama bütçesini doğru şekilde ayarlayabilirsiniz.
  console.log("İşlemin hesaplama tüketimini tahmin ediliyor");
  const estimatedComputeUnits =
    await getComputeUnitEstimate(transactionMessage);
  console.log(
    `İşlemin tahminen ${estimatedComputeUnits} hesaplama birimi tüketmesi bekleniyor`,
  );
  const budgetedTransactionMessage = prependTransactionMessageInstructions(
    [getSetComputeUnitLimitInstruction({ units: estimatedComputeUnits })],
    transactionMessage,
  );

  // İşlemi imzalayıp gönderin.
  console.log("İşlemi imzalayıp gönderiyor");
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

writeMemo("Merhaba, Solana!");
```





```typescript filename="add-memo.ts" {38-46}
import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

(async () => {
  const fromKeypair = Keypair.generate();
  const toKeypair = Keypair.generate();

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );

  const airdropSignature = await connection.requestAirdrop(
    fromKeypair.publicKey,
    LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  const lamportsToSend = 10;

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: lamportsToSend,
    }),
  );

  transferTransaction.add(
    new TransactionInstruction({
      keys: [
        { pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true },
      ],
      data: Buffer.from("Bu işlemde gönderilecek not mesajı", "utf-8"),
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
    }),
  );

  await sendAndConfirmTransaction(connection, transferTransaction, [
    fromKeypair,
  ]);
})();
```





:::info
Bu kod örnekleri, Solana üzerinde işlem eklemek için not kullanmanın yollarını göstermektedir. V2 için `getAddMemoInstruction` ve V1 için programID kullanın.
:::

---

**Unutmayın:** İşlemler gerçekleştirilmeden önce hesapların finansmanı gerektiğini kontrol edin. Bu, işlemlerinizin yeterli bakiyeye sahip olmasını sağlamanın önemli bir yoludur. 

:::tip
**En iyi uygulama:** Her zaman en son `blockhash`'ı kullanarak işlem mesajlarınızı oluşturun. Bu, işlemlerinizin daha hızlı ve güvenilir olmasını sağlar.
:::

:::warning
**Potansiyel risk:** Airdrop taleplerinin yanı sıra işlem gönderiminde de gecikmeler olabilir. Her iki işlemin onaylanmasını beklemek önemlidir.
:::

---