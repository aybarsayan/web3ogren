---
date: 2023-12-06T00:00:00Z
seoTitle: "Token Uzantıları: Devredilemez"
title: Devredilemez uzantıyı nasıl kullanılır
description:
  "Dijital koleksiyonlar dünyasında, NFT'lerin PFP meta dışında birçok kullanımı
  vardır. 'Ruh bağlı' tokenler kavramına girin - bireye bağlı olan ve
  devredilemeyen varlıklar."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: beginner
tags:
  - token 2022
  - token uzantıları
---

`NonTransferable` uzantısı, devredilemeyen tokenler oluşturmayı mümkün kılar.
Bu, dijital varlıkların bireyle iç içe geçtiği "ruh bağlı" tokenlerin oluşturulmasını sağlar.
Bu tokenler devredilemese de, sahibi tokenleri yakabilir ve Token Hesabını
kapayabilir. Bu, kullanıcıların istenmeyen bir varlıkla "sıkışıp kalmalarını"
önler.

:::info
Bu kılavuzda, Solana Playground kullanarak `NonTransferable` uzantısıyla
"ruh bağlı" tokenler oluşturma örneğini inceleyeceğiz. İşte
[son script](https://beta.solpg.io/6570c54bfb53fa325bfd0c4d).
:::

## Başlarken

Bu Solana Playground
[bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açarak
aşağıdaki başlangıç kodunu kullanın.

```javascript
// Client
console.log("Benim adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Benim bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, önce bir
Playground Cüzdanı oluşturmanız ve cüzdanı devnet SOL ile finanse etmeniz gerekecek.



Eğer bir Playground cüzdanınız yoksa, `pg.wallet.publicKey` üzerindeki
tüm tanımlamalarda bir tür hatası görebilirsiniz. Bu tür hatası,
Playground cüzdanı oluşturduktan sonra silinecektir.



Devnet SOL almak için, Playground'un terminalinde `solana airdrop`
komutunu çalıştırın veya bu [devnet faucet](https://faucet.solana.com/) ziyaret edin.

```
solana airdrop 5
```

Playground cüzdanınızı oluşturup finanse ettikten sonra, başlangıç kodunu çalıştırmak için "Çalıştır" butonuna tıklayın.

## Bağımlılıkları Ekle

Öncelikle scriptimizi kurmaya başlayalım. `@solana/web3.js` ve
`@solana/spl-token` kütüphanelerini kullanacağız.

Başlangıç kodunu aşağıdaki ile değiştirin:

```javascript
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializeNonTransferableMintInstruction,
  getMintLen,
  mintTo,
  createAccount,
  transfer,
  burn,
  closeAccount,
} from "@solana/spl-token";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilen işlemlerden dönen işlem imzası
let transactionSignature: string;
```

## Mint Kurulumu

Öncelikle, bir sonraki adımda oluşturacağımız Mint Hesabı'nın özelliklerini tanımlayalım.

```javascript
// Mint Hesabı için yeni anahtar çifti oluştur
const mintKeypair = Keypair.generate();
// Mint Hesabı için adres
const mint = mintKeypair.publicKey;
// Mint Hesabı için ondalık sayılar
const decimals = 2;
// Yeni tokenleri basabilen yetki
const mintAuthority = pg.wallet.publicKey;
```

Ardından, yeni Mint Hesabı'nın boyutunu belirleyelim ve kira muafiyeti için gerekli minimum lamportları hesaplayalım.

```javascript
// Uzantıyla birlikte Mint Hesabı'nın boyutu
const mintLen = getMintLen([ExtensionType.NonTransferable]);
// Mint Hesabı için gerekli minimum lamportlar
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

Token Uzantıları ile birlikte, Mint Hesabı'nın boyutu etkinleştirilen
uzantılara bağlı olarak değişecektir.

## Talimatları Oluştur

Sonraki adımda, aşağıdakileri yapmak için talimat setini oluşturalım:

- Yeni bir hesap oluştur
- `NonTransferable` uzantısını başlat
- Kalan Mint Hesabı verilerini başlat

Öncelikle, bir hesap oluşturmak için Sistem Programını çağıran talimatı oluşturun ve mülkiyeti Token Uzantıları Programına atayın.

```javascript
// Yeni hesap oluşturmak için Sistem Programını çağırma talimatı
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları oluşturulan hesaba aktaracak hesap
  newAccountPubkey: mint, // Oluşturulacak hesabın adresi
  space: mintLen, // Oluşturulan hesaba tahsis edilecek byte miktarı
  lamports, // Oluşturulan hesaba aktarılan lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanacak program
});
```

Ardından, Mint Hesabı için `NonTransferable` uzantısını başlatan talimatı oluşturun.

```javascript
// Devredilemez Uzantıyı başlatma talimatı
const initializeNonTransferableMintInstruction =
  createInitializeNonTransferableMintInstruction(
    mint, // Mint Hesabı adresi
    TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
  );
```

Son olarak, Mint Hesabı'nın geri kalan verilerini başlatma talimatını oluşturun.
Bu, orijinal Token Programı ile aynı olacaktır.

```javascript
// Mint Hesabı verilerini başlatma talimatı
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Hesabı Adresi
  decimals, // Mint ondalıkları
  mintAuthority, // Belirlenen Mint Yetkisi
  null, // Opsiyonel Dondurma Yetkisi
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

## İşlem Gönder

Sonraki adımda, talimatları yeni bir işleme ekleyelim ve ağa gönderelim. Bu, `NonTransferable` uzantısı etkinleştirilmiş bir Mint Hesabı oluşturacaktır.

```javascript
// Yeni işleme talimatları ekle
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeNonTransferableMintInstruction,
  initializeMintInstruction,
);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair], // İmza atanlar
);

console.log(
  "\nMint Hesabı Oluştur:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti çalıştırmak için `Çalıştır` butonuna tıklayın. Ardından, işlemi
SolanaFM'de inceleyebilirsiniz.

## Token Hesaplarını Oluştur

Sonraki adımda, `NonTransferable` uzantısının işlevselliğini göstermek için iki Token Hesabı oluşturalım.

Öncelikle, Playground cüzdanı tarafından owned bir `sourceTokenAccount` oluşturun.

```javascript
// Playground cüzdanı için Token Hesabı oluştur
const sourceTokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturacak ödeyici
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Opsiyonel anahtar çifti, Default olarak Bağlı Token Hesabı
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

Ardından, rastgele bir anahtar çifti oluşturun ve bunu
`destinationTokenAccount` sahibi olarak kullanın.

```javascript
// Token Hesabı sahibi olarak kullanmak için rastgele anahtar çifti
const randomKeypair = new Keypair();
// Rastgele anahtar çifti için Token Hesabı oluştur
const destinationTokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturacak ödeyici
  mint, // Mint Hesabı adresi
  randomKeypair.publicKey, // Token Hesabı sahibi
  undefined, // Opsiyonel anahtar çifti, Default olarak Bağlı Token Hesabı
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

Son olarak, devredilemez uygulamayı test etmek için `sourceTokenAccount`'a 1 token basın.

```javascript
// sourceTokenAccount'a token bas
transactionSignature = await mintTo(
  connection,
  payer, // İşlem ücreti ödeyici
  mint, // Mint Hesabı adresi
  sourceTokenAccount, // Mint yapılacak yer
  mintAuthority, // Mint Yetkisi adresi
  100, // Miktar
  undefined, // Ek imza sahipleri
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nToken Bas:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Token Transferini Deneme

Sonraki adımda, `sourceTokenAccount`'dan `destinationTokenAccount`'a token transfer etmeyi deneyelim. 

:::warning
Bu işlemin `NonTransferable` uzantısı nedeniyle başarısız olmasını bekliyoruz.
:::

```javascript
try {
  // Token transfer etmeyi dene
  await transfer(
    connection,
    payer, // İşlem ücreti ödeyici
    sourceTokenAccount, // Transfer edilecek yer
    destinationTokenAccount, // Transfer edilecek yer
    payer.publicKey, // Kaynak Token Hesabı sahibi
    100, // Miktar
    undefined, // Ek imza sahipleri
    undefined, // Onay seçenekleri
    TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
  );
} catch (error) {
  console.log("\nHata Bekleniyor:", error);
}
```

Scripti çalıştırmak için `Çalıştır` butonuna tıklayın. Ardından, Playground terminalinde hatayı inceleyebilirsiniz. Aşağıdaki gibi bir mesaj görmelisiniz:

```
Hata Bekleniyor: { [Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x25]
  logs:
   [ 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
     'Program log: Instruction: Transfer',
     'Program log: Transfer bu mint için devre dışı',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb, 3454 hesaplama birimi tükendi 200000',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb başarısız oldu: özel program hatası: 0x25' ] }
```

## Tokenleri Yakma ve Token Hesabını Kapatma

Tokenler devredilemez olsa da, yine de yakılabilirler.

```javascript
// Tokenleri yak
transactionSignature = await burn(
  connection,
  payer, // İşlem ücreti ödeyici
  sourceTokenAccount, // Yakılacak yer
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  100, // Miktar
  undefined, // Ek imza sahipleri
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nTokenleri Yak:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Token Hesabı, hesaba tahsis edilen SOL'u geri almak için kapatılabilir. 

:::note
Token bakiyesinin 0 olması gerektiğini unutmayın.
:::

```javascript
// Token Hesabını Kapat
transactionSignature = await closeAccount(
  connection,
  payer, // İşlem ücreti ödeyici
  sourceTokenAccount, // Kapatılacak Token Hesabı
  payer.publicKey, // Kapatılan hesaptan lamportları alacak hesap
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Ek imza sahipleri
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nToken Hesabını Kapat:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti çalıştırmak için `Çalıştır` butonuna tıklayın. Ardından, işlemi
SolanaFM'de inceleyebilirsiniz.

## Sonuç

:::quote
`NonTransferable` mint uzantısı, "ruh bağlı" tokenlerin oluşturulmasını sağlar,
dijital varlıkların bireysel bir hesaba bağlı olmasını garanti eder. Bu
özellik, kişisel başarılar, kimlik veya devredilemez niteliğe sahip
kimlikler için dijital mülkiyet için benzersiz bir mekanizma sağlar.
— Kılavuzun Özeti
:::