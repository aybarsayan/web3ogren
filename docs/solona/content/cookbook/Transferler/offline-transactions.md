---
title: Çevrimdışı İşlemler
sidebarSortOrder: 7
description: Çevrimdışı işlemleri nasıl oluşturup imzalayacağınızı öğrenin.
---

## İşlemi İmzala

Çevrimdışı bir işlem oluşturmak için işlemi imzalamanız ve ardından
herkesin bunu ağda yayınlaması gerekmektedir.

```typescript filename="sign-transaction.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Message,
} from "@solana/web3.js";
import * as nacl from "tweetnacl";
import * as bs58 from "bs58";

// çevrimdışı bir işlemi tamamlamak için bunu dört adıma ayıracağım
// 1. İşlem Oluştur
// 2. İşlemi İmzala
// 3. İşlemi Kurtar
// 4. İşlemi Gönder

(async () => {
  // bağlantıyı oluştur
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // örnek bir işlem oluştur, alice bob'a transfer yapıyor ve feePayer `feePayer`
  // alice ve feePayer bu işlemde imzalayıcılardır
  const feePayer = Keypair.generate();
  await connection.confirmTransaction(
    await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL),
  );
  const alice = Keypair.generate();
  await connection.confirmTransaction(
    await connection.requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL),
  );
  const bob = Keypair.generate();

  // 1. İşlem Oluştur
  let tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: alice.publicKey,
      toPubkey: bob.publicKey,
      lamports: 0.1 * LAMPORTS_PER_SOL,
    }),
  );
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  tx.feePayer = feePayer.publicKey;
  let realDataNeedToSign = tx.serializeMessage(); // imzalamak için gereken gerçek veri.

  // 2. İşlemi İmzala
  :::tip
  İstediğiniz herhangi bir kütüphaneyi kullanabilirsiniz, ana fikir ed25519 kullanarak imzalamaktır.
  Dönen imza 64 byte olmalıdır.
  :::

  let feePayerSignature = nacl.sign.detached(
    realDataNeedToSign,
    feePayer.secretKey,
  );
  let aliceSignature = nacl.sign.detached(realDataNeedToSign, alice.secretKey);

  // 3. İşlemi Kurtar
  // işlemi kurtarmadan önce imzaları doğrulayabilirsiniz
  let verifyFeePayerSignatureResult = nacl.sign.detached.verify(
    realDataNeedToSign,
    feePayerSignature,
    feePayer.publicKey.toBytes(), // doğrulamak için ham pubkey'i (32 byte) kullanmalısınız
  );

  :::info
  `feePayer imzasını doğrula: ${verifyFeePayerSignatureResult}`
  :::

  let verifyAliceSignatureResult = nacl.sign.detached.verify(
    realDataNeedToSign,
    aliceSignature,
    alice.publicKey.toBytes(),
  );

  :::info
  `alice imzasını doğrula: ${verifyAliceSignatureResult}`
  :::

  // işlemi kurtarmanın iki yolu vardır
  // 3.a İşlemi Kurtar (populate kullanarak ardından imzayı ekle)
  {
    let recoverTx = Transaction.populate(Message.from(realDataNeedToSign));
    recoverTx.addSignature(feePayer.publicKey, Buffer.from(feePayerSignature));
    recoverTx.addSignature(alice.publicKey, Buffer.from(aliceSignature));

    // 4. İşlemi Gönder
    console.log(
      `txhash: ${await connection.sendRawTransaction(recoverTx.serialize())}`,
    );
  }

  // ya da

  // 3.b. İşlemi Kurtar (imza ile populate kullanarak)
  {
    let recoverTx = Transaction.populate(Message.from(realDataNeedToSign), [
      bs58.encode(feePayerSignature),
      bs58.encode(aliceSignature),
    ]);

    // 4. İşlemi Gönder
    console.log(
      `txhash: ${await connection.sendRawTransaction(recoverTx.serialize())}`,
    );
  }

  // bu işlem çok uzun sürerse, en son blok hash'iniz süresi dolacaktır (150 bloktan sonra).
  // `kalıcı nonce` kullanarak bunu aşabilirsiniz.
})();
```

---

## Kısmi İmzalı İşlem

Bir işlem birden fazla imza gerektiriyorsa, kısmen imzalayabilirsiniz. 
Diğer imzalayıcılar daha sonra imzalayıp bunu ağda yayınlayabilir.

Bunun faydalı olduğu bazı örnekler:

- Ödeme karşılığında bir SPL token gönderin
- Gelecekte doğrulamak için bir işlemi imzalayın
- İmzanızı gerektiren bir işlemde özel programlar çağırın

:::note
Bu örnekte Bob, Alice'e ödeme karşılığında bir SPL token gönderir:
:::

```typescript filename="partial-sign-transaction.ts"
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import base58 from "bs58";

/* İşlem:
 * - Alice'den Bob'a 0.01 SOL gönderir
 * - Bob'dan Alice'e 1 token gönderir
 * - Bob tarafından kısmen imzalanır, böylece Alice onaylayıp gönderebilir
 */

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const alicePublicKey = new PublicKey(
    "5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8",
  );
  const bobKeypair = Keypair.fromSecretKey(
    base58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
    ),
  );
  const tokenAddress = new PublicKey(
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  );
  const bobTokenAddress = await getAssociatedTokenAddress(
    tokenAddress,
    bobKeypair.publicKey,
  );

  // Alice'in bir token hesabı olmayabilir, bu nedenle Bob yoksa bir tane oluşturur
  const aliceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    bobKeypair, // Bob, oluşturmak için ücreti öder
    tokenAddress, // hesabın hangi token için olduğunu belirtir
    alicePublicKey, // token hesabının kime ait olduğunu belirtir
  );

  // Token mint ile ilgili bilgileri alın
  const tokenMint = await getMint(connection, tokenAddress);

  // İşlemde kullanmak için son blok hash'i alın
  const { blockhash } = await connection.getLatestBlockhash("finalized");

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    // Alice işlem ücretini ödeyecek
    feePayer: alicePublicKey,
  });

  // Alice'den Bob'a 0.01 SOL transfer et
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: alicePublicKey,
      toPubkey: bobKeypair.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    }),
  );

  // Bob'dan Alice'e 1 token transfer et
  transaction.add(
    createTransferCheckedInstruction(
      bobTokenAddress, // kaynak
      tokenAddress, // mint
      aliceTokenAccount.address, // hedef
      bobKeypair.publicKey, // kaynak hesabın sahibi
      1 * 10 ** tokenMint.decimals, // transfer edilecek miktar
      tokenMint.decimals, // token'in ondalık sayısı
    ),
  );

  // Bob olarak kısmi imzala
  transaction.partialSign(bobKeypair);

  // İşlemi serileştir ve geri döndürmek için base64'e çevir
  const serializedTransaction = transaction.serialize({
    // Alice'in işlemi serileştirmesi ve imzalaması gerekecek
    requireAllSignatures: false,
  });
  const transactionBase64 = serializedTransaction.toString("base64");
  return transactionBase64;

  // Bunun çağrısını yapan, onu bir işlem nesnesine geri dönüştürebilir:
  const recoveredTransaction = Transaction.from(
    Buffer.from(transactionBase64, "base64"),
  );
})();
```

---

## Kalıcı Nons

`recentBlockhash`, bir işlem için önemli bir değerdir. İşleminiz
varsa reddedilecektir  
süresi dolmuş bir blok hash kullanılıyorsa (150 bloktan daha eski). 
Son bir blok hash yerine, süresi asla dolmayan bir kalıcı nonce kullanabilirsiniz. 
Kalıcı bir nonce kullanmak için işleminiz:

1. `nonce`'yi `nonce account` içinde son blok hash olarak kullanır
2. ilk talimde `nonce advance` işlemini koyar

:::warning
Kalıcı nonce kullanmak, ağın güvenilirliğini artırır.
:::

### Nons Hesabı Oluştur

```typescript filename="create-nonce-account.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  NONCE_ACCOUNT_LENGTH,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

(async () => {
  // Bağlantımızı ve cüzdanımızı ayarlayalım
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const feePayer = Keypair.generate();

  // Cüzdanımızı 1 SOL ile finanse et
  const airdropSignature = await connection.requestAirdrop(
    feePayer.publicKey,
    LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  // Nons hesabı yetkisi için herhangi bir anahtar çifti kullanabilirsiniz,
  // bu, nonce hesap yetkisi için varsayılan Solana anahtar çifti dosyasını (id.json) kullanır
  const nonceAccountAuth = await getKeypairFromFile();

  let nonceAccount = Keypair.generate();
  console.log(`nons hesabı: ${nonceAccount.publicKey.toBase58()}`);

  let tx = new Transaction().add(
    // nonce hesabı oluştur
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: nonceAccount.publicKey,
      lamports:
        await connection.getMinimumBalanceForRentExemption(
          NONCE_ACCOUNT_LENGTH,
        ),
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    // nonce hesabını başlat
    SystemProgram.nonceInitialize({
      noncePubkey: nonceAccount.publicKey, // nonce hesabı pubkey'i
      authorizedPubkey: nonceAccountAuth.publicKey, // nonce hesabı yetkisi (ilerleme ve kapatma için)
    }),
  );

  console.log(
    `txhash: ${await sendAndConfirmTransaction(connection, tx, [feePayer, nonceAccount])}`,
  );
})();
```

### Nons Hesabını Al

```typescript filename="get-nonce-account.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  NonceAccount,
} from "@solana/web3.js";

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const nonceAccountPubkey = new PublicKey(
    "7H18z3v3rZEoKiwY3kh8DLn9eFT6nFCQ2m4kiC7RZ3a4",
  );

  let accountInfo = await connection.getAccountInfo(nonceAccountPubkey);
  let nonceAccount = NonceAccount.fromAccountData(accountInfo.data);
  console.log(`nonce: ${nonceAccount.nonce}`);
  console.log(`yetki: ${nonceAccount.authorizedPubkey.toBase58()}`);
  console.log(`ücret hesaplayıcı: ${JSON.stringify(nonceAccount.feeCalculator)}`);
})();
```

### Nons Hesabını Kullan

```typescript filename="use-nonce-account.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  NonceAccount,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as bs58 from "bs58";
import { getKeypairFromFile } from "@solana-developers/helpers";

(async () => {
  // Bağlantımızı ve cüzdanımızı ayarlayalım
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const feePayer = Keypair.generate();

  // Cüzdanımızı 1 SOL ile finanse et
  const airdropSignature = await connection.requestAirdrop(
    feePayer.publicKey,
    LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  // Nons hesabı yetkisi için herhangi bir anahtar çifti kullanabilirsiniz,
  // fakat nonceAccountAuth, nonce hesabı oluşturulurken kullanılanla aynı olmalıdır
  // nonce hesabı yetkisi için varsayılan Solana anahtar çiftini yükleyin
  const nonceAccountAuth = await getKeypairFromFile();

  const nonceAccountPubkey = new PublicKey(
    "7H18z3v3rZEoKiwY3kh8DLn9eFT6nFCQ2m4kiC7RZ3a4",
  );
  let nonceAccountInfo = await connection.getAccountInfo(nonceAccountPubkey);
  let nonceAccount = NonceAccount.fromAccountData(nonceAccountInfo.data);

  let tx = new Transaction().add(
    // nonce advance ilk talim olmalıdır
    SystemProgram.nonceAdvance({
      noncePubkey: nonceAccountPubkey,
      authorizedPubkey: nonceAccountAuth.publicKey,
    }),
    // ardından, gerçekten yapmak istediğinizi yapın, burada bir transfer talimi ekliyoruz örnek olarak.
    SystemProgram.transfer({
      fromPubkey: feePayer.publicKey,
      toPubkey: nonceAccountAuth.publicKey,
      lamports: 1,
    }),
  );
  // `nonce`'yi recentBlockhash olarak atayın
  tx.recentBlockhash = nonceAccount.nonce;
  tx.feePayer = feePayer.publicKey;
  tx.sign(
    feePayer,
    nonceAccountAuth,
  ); /* ücret ödeyeni + nonce hesabı yetkisi + ... */

  console.log(`txhash: ${await connection.sendRawTransaction(tx.serialize())}`);
})();