---
title: Hesap Nasıl Oluşturulur
sidebarSortOrder: 1
description:
  "Hesaplar, Solana'daki her şeyin temel yapı taşlarıdır. Solana blok zincirinde hesap nasıl oluşturulacağını öğrenin."
---

Bir hesap oluşturmak için System Program `createAccount` talimatını kullanmak gerekir. Solana çalışma zamanı, bir hesabın sahibi programına, verilerine yazma veya lamportları transfer etme erişimi verecektir. Bir hesap oluştururken, belirli bir depolama alanını bayt cinsinden (alan) önceden ayırmamız ve kirayı karşılamak için yeterli lamport ayarlamamız gerekir.

:::tip
**Hesap oluştururken dikkat edilmesi gereken önemli bir nokta:** Yeterli lamportun ayarlandığından emin olun.
:::





```typescript filename="create-account.ts"
import {
  pipe,
  createSolanaRpc,
  appendTransactionMessageInstructions,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/web3.js";
import { getSetComputeUnitPriceInstruction } from "@solana-program/compute-budget";
import {
  getCreateAccountInstruction,
  SYSTEM_PROGRAM_ADDRESS,
} from "@solana-program/system";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});

const space = 0n; // hesap için herhangi bir ekstra alan
const rentLamports = await rpc.getMinimumBalanceForRentExemption(space).send();
console.log("Kira istisnası için minimum bakiye:", rentLamports);

// todo: kendi imzalayıcınızı SOL ile yükleyin
const signer = await generateKeyPairSigner();

// oluşturmak için yeni bir anahtar çifti ve adres oluştur
const newAccountKeypair = await generateKeyPairSigner();
console.log("Yeni hesap adresi:", newAccountKeypair.address);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transactionMessage = pipe(
  createTransactionMessage({ version: "legacy" }),
  tx => setTransactionMessageFeePayerSigner(signer, tx),
  tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  tx =>
    appendTransactionMessageInstructions(
      [
        // öncelikli bir ücret ekle
        getSetComputeUnitPriceInstruction({
          microLamports: 200_000,
        }),
        // yeni hesabı oluştur
        getCreateAccountInstruction({
          lamports: rentLamports,
          newAccount: newAccountKeypair,
          payer: signer,
          space: space,
          // "cüzdan" hesapları sistem programı tarafından yönetilir
          programAddress: SYSTEM_PROGRAM_ADDRESS,
        }),
      ],
      tx,
    ),
);

const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
const signature = getSignatureFromTransaction(signedTransaction);

await sendAndConfirmTransaction(signedTransaction, {
  commitment: "confirmed",
});
console.log("İmza:", signature);
```





```typescript filename="create-account.ts"
import {
  SystemProgram,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const fromPubkey = Keypair.generate();

// Oluşturulan hesaba lamport transferi için SOL hava atışı
const airdropSignature = await connection.requestAirdrop(
  fromPubkey.publicKey,
  LAMPORTS_PER_SOL,
);
await connection.confirmTransaction(airdropSignature);

// hesap için ayrılacak alan miktarı
const space = 0;

// Oluşturulan hesabı kira istisnası için lamportlarla doldur
const rentExemptionAmount =
  await connection.getMinimumBalanceForRentExemption(space);

const newAccountPubkey = Keypair.generate();
const createAccountParams = {
  fromPubkey: fromPubkey.publicKey,
  newAccountPubkey: newAccountPubkey.publicKey,
  lamports: rentExemptionAmount,
  space,
  programId: SystemProgram.programId,
};

const createAccountTransaction = new Transaction().add(
  SystemProgram.createAccount(createAccountParams),
);

await sendAndConfirmTransaction(connection, createAccountTransaction, [
  fromPubkey,
  newAccountPubkey,
]);
```





:::info
Hesap oluşturma işlemi başarıyla tamamlandığında, **işlem imzası** alınacaktır. Bu kullanıcı için önemli bir bilgidir.
:::

--- 

:::note
**Ek Bilgi:** Hesap oluşturulurken dikkat edilmesi gereken diğer bir unsursa, yeterli kira için lamportların temin edilmesidir.
::: 

:::warning
**Dikkat:** Hesapları yönetirken, özellikle kiralama konusunda yapılan hatalar ciddi sonuçlar doğurabilir.
:::