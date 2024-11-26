---
title: SOL Göndermenin Yolu
sidebarSortOrder: 1
description:
  "Solana'daki en yaygın işlem SOL göndermektir. Solana'da SOL göndermeyi öğrenin."
---

SOL göndermek için [SystemProgram][1] ile etkileşimde bulunmanız gerekecek.





```typescript filename="send-sol.ts" {70-74}
import {
  address,
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
import { getTransferSolInstruction } from "@solana-program/system";

async function transferSol() {
  // RPC oluşturun. solana-test-validator için localnet kullanın. Bu, size daha kolay airdrop sağlar.
  const CLUSTER = "devnet";
  const rpc = createSolanaRpc(devnet(`https://api.${CLUSTER}.solana.com`));
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    devnet(`wss://api.${CLUSTER}.solana.com`),
  );

  // Bir airdrop fonksiyonu oluşturun.
  const airdrop = airdropFactory({ rpc, rpcSubscriptions });

  // Bir işlem mesajının hesaplama tüketimini tahmin eden bir yardımcı oluşturun.
  const getComputeUnitEstimate =
    getComputeUnitEstimateForTransactionMessageFactory({ rpc });

  // Gönderim işlemi için bir fonksiyon oluşturun.
  const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
  });

  // Bir hesap oluşturun ve finanse edin.
  const keypairSigner = await generateKeyPairSigner();
  console.log("Adresle bir hesap oluşturuldu", keypairSigner.address);
  console.log("Airdrop talep ediliyor");
  await airdrop({
    commitment: "confirmed",
    lamports: lamports(1_000_000_000n),
    recipientAddress: keypairSigner.address,
  });
  console.log("Airdrop onaylandı");

  // Bir not işlemi oluşturun.
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
          getTransferSolInstruction({
            source: keypairSigner,
            destination: address("web3Qm5PuFapMJqe6PWRWfRBarkeqE2ZC8Eew3zwHH2"),
            amount: lamports(1_000_000n),
          }),
        ],
        m,
      ),
  );

  // Bu işlem için ne kadar hesaplama birimi bütçesi ayıracağınızı belirleyin
  // böylece hesaplama bütçesini optimize edebilir ve
  // bloğa dahil edilme şansını artırabilirsiniz.
  console.log("İşlemin hesaplama tüketimini tahmin ediyorum");
  const estimatedComputeUnits =
    await getComputeUnitEstimate(transactionMessage);
  console.log(
    `İşlemin tahmini hesaplama birimi tüketimi ${estimatedComputeUnits} hesaplama birimidir`,
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

transferSol();
```





```typescript filename="send-sol.ts" {28-38}
import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
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

  const lamportsToSend = 1_000_000;

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: lamportsToSend,
    }),
  );

  await sendAndConfirmTransaction(connection, transferTransaction, [
    fromKeypair,
  ]);
})();
```





:::tip 
Airdrop işlemleri, geliştiricilerin testnet ortamlarında SOL (Token) göndermelerini sağlar. Bu işlemleri doğru bir şekilde yapabilmek için, her zaman güncel ağı kullanmaya özen gösterin.
:::

:::warning
İşlemler sırasında düşük hesaplama birimi bütçesi ayırmaktan kaçının. Bu, işleminizin başarısız olmasına neden olabilir.
:::

:::info
Her zaman işlemlerinizin başlangıcında hesaplama birimi tahminlerinde bulunun. Bu, işlemlerinizin ne kadar hesap kapasitesine ihtiyaç duyduğunu anlamanıza yardımcı olur.
:::

:::note
Geliştiricilerin sistem programı kullanarak SOL göndermek için gerekli olan temel yapılandırmaları bilmeleri önemlidir.
:::

[1]: https://docs.solanalabs.com/runtime/programs#system-program