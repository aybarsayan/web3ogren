---
title: İşlem Ücretini Nasıl Hesaplayabilirsiniz
sidebarSortOrder: 3
description:
  "Her işlem, Solana üzerinde yürütülmesi için belirli bir ücret tutarına mal olur. Solana üzerindeki işlem ücretlerini nasıl hesaplayacağınızı öğrenin."
---

Bir işlemin gereken imza sayısı işlem ücretini hesaplamak için kullanılır. Bir hesap oluşturmadığınız sürece, bu temel işlem ücreti olacaktır. Bir hesap oluşturmanın maliyetleri hakkında daha fazla bilgi edinmek için `kira maliyetlerini hesaplama` sayfasına göz atın.





```typescript filename="calculate-cost.ts" {101-118}
import {
  airdropFactory,
  appendTransactionMessageInstructions,
  compileTransactionMessage,
  createSignerFromKeyPair,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  devnet,
  generateKeyPairSigner,
  getBase64Decoder,
  getCompiledTransactionMessageEncoder,
  getComputeUnitEstimateForTransactionMessageFactory,
  getSignatureFromTransaction,
  lamports,
  pipe,
  prependTransactionMessageInstructions,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type TransactionMessageBytesBase64,
} from "@solana/web3.js";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";
import { getAddMemoInstruction } from "@solana-program/memo";
import { loadDefaultKeypairWithAirdrop } from "./CreateKeypair";

async function calculateCost(message: string) {
  // Bir RPC oluştur.
  const CLUSTER = "devnet";
  const rpc = createSolanaRpc(devnet(`https://api.${CLUSTER}.solana.com`));
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    devnet(`wss://api.${CLUSTER}.solana.com`),
  );

  // Bir işlem mesajının hesaplama tüketimini tahmin eden bir yardımcı oluştur.
  const getComputeUnitEstimate =
    getComputeUnitEstimateForTransactionMessageFactory({ rpc });

  // Bir işlem gönderme fonksiyonu oluştur.
  const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
  });

  // Bir airdrop fonksiyonu oluştur.
  const airdrop = airdropFactory({ rpc, rpcSubscriptions });

  // Bir hesap oluştur ve fonlendir.
  const signer = await generateKeyPairSigner();
  console.log("Adres ile bir hesap oluşturuldu", signer.address);
  console.log("Airdrop talep ediliyor");
  await airdrop({
    commitment: "confirmed",
    lamports: lamports(1000_000n),
    recipientAddress: signer.address,
  });
  console.log("Airdrop onaylandı");

  // Bir memo işlemi oluştur.
  console.log("Bir memo işlemi oluşturuluyor");
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const transactionMessage = pipe(
    createTransactionMessage({ version: "legacy" }),
    m => setTransactionMessageFeePayerSigner(signer, m),
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
  // böylece bütçeyi doğru boyutlandırarak,
  // bir bloğa dahil edilme şansını maksimuma çıkarabilirsiniz.
  console.log("İşlemin hesaplama tüketimini tahmin ediyor");
  const estimatedComputeUnits =
    await getComputeUnitEstimate(transactionMessage);
  console.log(
    `İşlemin yaklaşık olarak ${estimatedComputeUnits} hesaplama birimi tüketmesi bekleniyor`,
  );

  const budgetedTransactionMessage = prependTransactionMessageInstructions(
    [getSetComputeUnitLimitInstruction({ units: estimatedComputeUnits })],
    transactionMessage,
  );

  const base64EncodedMessage = pipe(
    // Ücretini almak istediğiniz mesajla başlayın.
    budgetedTransactionMessage,

    // Derleyin.
    compileTransactionMessage,

    // Derlenmiş mesajı bir bayt dizisine dönüştürün.
    getCompiledTransactionMessageEncoder().encode,

    // O bayt dizisini bir base64 dizesi olarak kodlayın.
    getBase64Decoder().decode,
  ) as TransactionMessageBytesBase64;

  const transactionCost = await rpc
    .getFeeForMessage(base64EncodedMessage)
    .send();

  console.log(
    "İşlemin tahmini maliyeti " + transactionCost.value + " lamports",
  );

  // İşlemi imzala ve gönder.
  console.log("İşlemi imzalıyor ve gönderiyor");
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
  // İşlemin yaklaşık olarak 6236 hesaplama birimi tüketmesi bekleniyor
  // İşlemin yaklaşık maliyeti 5032 lamports
}

calculateCost("Merhaba, Ücretler!");
```




```typescript filename="calculate-cost.ts {108-111}"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Message,
  SystemProgram,
  SYSTEM_INSTRUCTION_LAYOUTS,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";

(async () => {
  // Küme ile bağlantı kur
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const payer = Keypair.generate();
  const recipient = Keypair.generate();

  const type = SYSTEM_INSTRUCTION_LAYOUTS.Transfer;
  const data = Buffer.alloc(type.layout.span);
  const layoutFields = Object.assign({ instruction: type.index });
  type.layout.encode(layoutFields, data);

  const recentBlockhash = await connection.getLatestBlockhash();

  const messageParams = {
    accountKeys: [
      payer.publicKey.toString(),
      recipient.publicKey.toString(),
      SystemProgram.programId.toString(),
    ],
    header: {
      numReadonlySignedAccounts: 0,
      numReadonlyUnsignedAccounts: 1,
      numRequiredSignatures: 1,
    },
    instructions: [
      {
        accounts: [0, 1],
        data: bs58.encode(data),
        programIdIndex: 2,
      },
    ],
    recentBlockhash: recentBlockhash.blockhash,
  };

  const message = new Message(messageParams);

  const fees = await connection.getFeeForMessage(message);
  console.log(`Tahmini SOL transfer maliyeti: ${fees.value} lamports`);
  // Tahmini SOL transfer maliyeti: 5000 lamports
})();
```





:::info
İşlem ücretleri, Solana ağı üzerinde işlem boyutuna ve karmaşıklığına göre değişebilir. 
:::

---
### Önemli Noktalar
- Her işlemin, belirli bir ücret gerektirdiğini unutmayın.
- Hesap oluşturmanın maliyetleri, işlem ücretini etkileyebilir.
  
:::tip
İşlemlerinizin maliyetini en aza indirmek için, gereksiz hesaplamalardan kaçının.
:::

---

### Ekstra Bilgiler


Hesap oluşturma maliyetleri hakkında daha fazla bilgi

Bir hesap oluşturmanın maliyetleri, Solana ağına izin verirken önemli bir faktördür. Daha fazla bilgi için `kira maliyetlerini hesaplama` dokümanını inceleyebilirsiniz.


:::warning
İşlem ücretlerini hesaplarken, her zaman en son verilere dayanarak hareket edin.
:::

---