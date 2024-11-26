---
date: 2023-12-07T00:00:00Z
seoTitle: "Token Uzantıları: Gerekli Memo"
title: Gerekli Memo token uzantısını nasıl kullanılır
description:
  "Finansal işlemlerde memolar, gönderici ve alıcı arasında bir iletişim aracı olarak
  hizmet eder. Her iki tarafın tanımlanmasına yardımcı olur ve
  transferin amacını netleştirir."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: beginner
tags:
  - token 2022
  - token uzantıları
---

`MemoTransfer` uzantısı, bir Token Hesabına yapılan her giriş transferinin bir 
[memo](https://spl.solana.com/memo) talimatı ile birlikte olmasını zorunlu kılar. Bu memo talimatı, işlemin program logolarında bir mesaj kaydeder. Bu özellik, işlem logolarını incelediğinizde, işlemlerin amacını anlamayı kolaylaştırarak işlemlere bağlam eklemek için özellikle faydalıdır.

> **Anahtar Nokta:** Bu uzantı ile, her transferin içeriği ve amacı daha net bir şekilde belgelenir.  
> — Gerekli Memo Kullanımı

Bu kılavuzda, Solana Playground kullanarak bir örneği inceleyeceğiz. İşte 
[son betik](https://beta.solpg.io/65724a91fb53fa325bfd0c54).

## Başlarken

Aşağıdaki başlangıç kodu ile bu Solana Playground 
[bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açarak başlayın.

```javascript
// Client
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, önce bir 
Playground Cüzdanı oluşturmanız ve bu cüzdanı devnet SOL ile fonlamanız 
gerekecektir.

:::info
Eğer bir Playground cüzdanınız yoksa, editörde `pg.wallet.publicKey`'den 
tüm açıklamalarda bir tür hatası görebilirsiniz. Bu tür hatası, bir 
Playground cüzdanı oluşturduktan sonra kaldırılacaktır.
:::

Devnet SOL almak için, Playground'un terminalinde `solana airdrop` 
komutunu çalıştırın veya bu [devnet faucet](https://faucet.solana.com/) adresini 
ziyaret edin.

```
solana airdrop 5
```

Playground cüzdanını oluşturup fonladıktan sonra, başlangıç kodunu çalıştırmak 
için "Çalıştır" butonuna tıklayın.

## Bağımlılıkları Ekleme

Betikimizi ayarlamaya başlayalım. `@solana/web3.js`, 
`@solana/spl-token` ve `@solana/spl-memo` kütüphanelerini kullanacağız.

Başlangıç kodunu aşağıdaki ile değiştirin:

```javascript
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  TransactionInstruction,
  PublicKey,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createEnableRequiredMemoTransfersInstruction,
  createInitializeAccountInstruction,
  createMint,
  disableRequiredMemoTransfers,
  enableRequiredMemoTransfers,
  getAccountLen,
  createAccount,
  mintTo,
  createTransferInstruction,
} from "@solana/spl-token";
import { createMemoInstruction } from "@solana/spl-memo";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlan
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilecek işlem
let transaction: Transaction;
// Gönderilen işlemden dönen işlem imzası
let transactionSignature: string;
```

## Mint Kurulumu

Token Hesapları oluşturabilmemiz için önce yeni bir Mint Hesabı 
oluşturmamız gerekecek.

```javascript
// Yeni tokenları mintleyebilecek yetki
const mintAuthority = pg.wallet.publicKey;
// Mint Hesabı için ondalık sayılar
const decimals = 2;

// Mint Hesabını oluştur
const mint = await createMint(
  connection,
  payer, // İşlem ve başlangıç ücretlerini ödeyen
  mintAuthority, // Mint Yetkisi
  null, // Opsiyonel Dondurma Yetkisi
  decimals, // Mintin Ondalıkları
  undefined, // Opsiyonel anahtar çifti
  undefined, // İşlemi onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı Kimliği
);
```

## Memo Transfer Token Hesabı

Şimdi, yeni bir Token Hesabı için `MemoTransfer` uzantısını etkinleştirecek 
bir işlem oluşturalım.

Öncelikle, Token Hesabı adresi olarak kullanılacak yeni bir anahtar çifti oluşturalım.

```javascript
// Token Hesabının sahibi olarak kullanılacak rastgele anahtar çifti
const tokenAccountKeypair = Keypair.generate();
// Token Hesabı için adres
const tokenAccount = tokenAccountKeypair.publicKey;
```

Sonra, yeni Token Hesabının boyutunu belirleyelim ve kira muafiyeti için 
gerekli minimum lamportları hesaplayalım.

```javascript
// Uzantı ile birlikte Token Hesabının boyutu
const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
// Token Hesabı için gereken minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);
```

Token Uzantıları ile birlikte, Token Hesabının boyutu etkinleştirilen 
uzantılara bağlı olarak değişecektir.

## Talimatları Oluşturma

Şimdi, aşağıdakileri yapmak için bir dizi talimat oluşturalım:

- Yeni bir hesap oluştur
- Token Hesabı verilerini başlat
- `MemoTransfer` uzantısını etkinleştir

Öncelikle, bir hesap oluşturmak için Sistem Programını çağıracak 
talimatı oluşturalım ve sahipliğini Token Uzantıları Programına atayalım.

```javascript
// Yeni hesap oluşturmak için Sistem Programını çağırma talimatı
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları oluşturulan hesaba transfer edecek hesap
  newAccountPubkey: tokenAccount, // Oluşturulacak hesabın adresi
  space: accountLen, // Oluşturulacak hesaba tahsis edilecek byte miktarı
  lamports, // Oluşturulan hesaba transfer edilen lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanan program
});
```

Sonra, Token Hesabı verilerini başlatacak talimatı oluşturalım.

```javascript
// Token Hesabı verilerini başlatma talimatı
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount, // Token Hesabı Adresi
  mint, // Mint Hesabı
  payer.publicKey, // Token Hesabı Sahibi
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı Kimliği
);
```

Son olarak, Token Hesabı için `MemoTransfer` uzantısını etkinleştirecek talimatı oluşturalım.

```javascript
// MemoTransfer Uzantısını başlatma talimatı
const enableRequiredMemoTransfersInstruction =
  createEnableRequiredMemoTransfersInstruction(
    tokenAccount, // Token Hesabı adresi
    payer.publicKey, // Token Hesabı Sahibi
    undefined, // Ek imzalayıcılar
    TOKEN_2022_PROGRAM_ID, // Token Programı Kimliği
  );
```

## İşlemi Gönder

Şimdi, yeni bir işleme talimatları ekleyip bunu ağa gönderelim. Bu, `MemoTransfer` 
uzantısı etkinleştirilmiş bir Token Hesabı oluşturacaktır.

```javascript
// Yeni işleme talimatlarını ekle
transaction = new Transaction().add(
  createAccountInstruction,
  initializeAccountInstruction,
  enableRequiredMemoTransfersInstruction,
);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, tokenAccountKeypair], // İmzacıları
);

console.log(
  "\nToken Hesabı Oluştur:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Betik dosyasını çalıştırmak için `Çalıştır` butonuna tıklayın. Daha sonra işlem detaylarını 
SolanaFM'de inceleyebilirsiniz.

## Token Hesabını Oluştur ve Fonla

Şimdi, `MemoTransfer` uzantısının işlevselliğini göstermek için başka bir Token Hesabı 
oluşturalım.

Öncelikle, Playground cüzdanı tarafından sahip olunan bir `sourceTokenAccount` oluşturun.

```javascript
// Playground cüzdanı için Token Hesabı oluştur
const sourceTokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturacak ödeyici
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Opsiyonel anahtar çifti, Varsayılan olarak İlişkili Token Hesabı
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı Kimliği
);
```

Daha sonra, `sourceTokenAccount`'a 2 token mintleyin.

```javascript
// sourceTokenAccount'a token mintleme
transactionSignature = await mintTo(
  connection,
  payer, // İşlem ücreti ödeyicisi
  mint, // Mint Hesabı adresi
  sourceTokenAccount, // Mintlenecek Yer
  mintAuthority, // Mint Yetkisi adresi
  200, // Miktar
  undefined, // Ek imzalayıcılar
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı Kimliği
);

console.log(
  "\nToken Mintleme:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Transfer ve Memo Talimatı

Şimdi, token transferi ve memo talimatlarını hazırlayalım.

Öncelikle, `sourceTokenAccount`'tan `MemoTransfer` uzantısı etkinleştirilmiş `tokenAccount`'a 
token transfer etmek için talimatı oluşturalım.

```javascript
// Token transfer talimatı
const transferInstruction = createTransferInstruction(
  sourceTokenAccount, // Kaynak Token Hesabı
  tokenAccount, // Hedef Token Hesabı
  payer.publicKey, // Kaynak Token Hesabı sahibi
  100, // Miktar
  undefined, // Ek imzalayıcılar
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı Kimliği
);
```

Sonra, memo talimatını oluşturalım. Mesaj, talimatın eklendiği işlemin program logolarına dahil 
edilecektir.

```javascript
// Memo için mesaj
const message = "Merhaba, Solana";
// Memoyu eklemek için talimat
const memoInstruction = new TransactionInstruction({
  keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
  data: Buffer.from(message, "utf-8"),
  programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
});
```

Alternatif olarak, talimatı `@solana/spl-memo` kütüphanesini kullanarak da oluşturabilirsiniz:

```javascript
// Memo için mesaj
const message = "Merhaba, Solana";
// Memoyu eklemek için talimat
const memoInstruction = createMemoInstruction(message, [payer.publicKey]);
```

## Memo Olmadan Transferi Deneme

`MemoTransfer` uzantısının işlevselliğini göstermek için önce bir token transferini memo olmadan 
göndermeye çalışalım.

```javascript
try {
  // Memo olmadan transfer etmeyi dene
  transaction = new Transaction().add(transferInstruction);

  // İşlemi gönder
  await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer], // İmzacılar
  );
} catch (error) {
  console.log("\nHata Bekliyorum:", error);
}
```

Betik dosyasını çalıştırmak için `Çalıştır` butonuna tıklayın. Daha sonra, Playground terminalinde 
hata ile ilgili bilgileri inceleyebilirsiniz. Aşağıdaki gibi bir mesaj görmelisiniz:

```
Hata Bekliyorum: { [Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x24]
  logs:
   [ 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
     'Program log: Instruction: Transfer',
     'Program log: Error: No memo in previous instruction; required for recipient to receive a transfer',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb consumed 6571 of 200000 compute units',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x24' ] }
```

## Memo ile Transfer

Şimdi, talimatın işlendiği işleme dahil edilen memo talimatı ile token transferi gönderelim.

```javascript
// Yeni işleme talimatlarını ekle
transaction = new Transaction().add(memoInstruction, transferInstruction);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer], // İmzalar
);

console.log(
  "\nMemo ile Transfer:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Betik dosyasını çalıştırmak için `Çalıştır` butonuna tıklayın. Daha sonra işlem detaylarını 
SolanaFM'de inceleyebilirsiniz.

## Memo Transferini Etkinleştir ve Devre Dışı Bırak

`MemoTransfer` uzantısı, Token Hesabı sahibinin isteğine bağlı olarak serbestçe 
etkinleştirilebilir veya devre dışı bırakılabilir.

> **Dikkat:** `MemoTransfer` uzantısını etkinleştirmek için `enableRequiredMemoTransfers` talimatını 
kullanın.
  
```javascript
// Gerekli Memo Transferlerini Etkinleştir
transactionSignature = await enableRequiredMemoTransfers(
  connection, // Kullanılacak bağlantı
  payer, // İşlem ücreti ödendi
  tokenAccount, // Değiştirilmesi gereken Token Hesabı
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Ek imzalayıcılar
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı Kimliği
);

console.log(
  "\nGerekli Memo Transferlerini Etkinleştir:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

`MemoTransfer` uzantısını devre dışı bırakmak için `disableRequiredMemoTransfers` talimatını 
kullanın.

```javascript
// Gerekli Memo Transferlerini Devre Dışı Bırak
transactionSignature = await disableRequiredMemoTransfers(
  connection, // Kullanılacak bağlantı
  payer, // İşlem ücreti ödendi
  tokenAccount, // Değiştirilmesi gereken Token Hesabı
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Ek imzalayıcılar
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı Kimliği
);

console.log(
  "\nGerekli Memo Transferlerini Devre Dışı Bırak:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

`MemoTransfer` uzantısı devre dışı bırakıldığında, memo talimatı olmadan token transfer 
işlemleri başarıyla tamamlanacaktır.

```javascript
// Yeni işleme talimatlarını ekle
transaction = new Transaction().add(transferInstruction);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer], // İmzalar
);

console.log(
  "\nMemo Olmadan Transfer:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Betik dosyasını çalıştırmak için `Çalıştır` butonuna tıklayın. Daha sonra işlem detaylarını 
SolanaFM'de inceleyebilirsiniz.

## Sonuç

`MemoTransfer` uzantısı, bir Token Hesabına yapılan her gelen transferin 
bir memo içerdiğini garanti eder. Her transfer ile bir memo talimatı 
gerektirerek, işlemin program logolarında bir mesaj kaydedilir. Bu özellik, 
işlemleri daha sonra incelemek için logları gözden geçirirken, işlemlerin amacını 
anlamak için özellikle yararlıdır.