---
date: 2023-12-05T00:00:00Z
seoTitle: "Token Uzantıları: Mint Kapatma Yetkisi"
title: Mint Kapatma Yetkisi uzantısını nasıl kullanılır
description:
  "Token Uzantıları ile, mint'i başlatmadan önce MintKapatmaYetkisi uzantısını
  başlatarak token mint hesaplarını kapatmak mümkün."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: beginner
tags:
  - token 2022
  - token uzantıları
---

Orijinal SPL token programında, Token Programı tarafından sahip olunan Mint Hesaplarını kapatma ve bu hesaplara ayrılmış SOL'u geri alma seçeneği yoktu.

> `MintCloseAuthority` uzantısı, mint'in arzı 0 ise, belirlenen Kapatma Yetkisi'nin bir Mint Hesabını kapatmasına olanak tanıyarak bu sınırlamaya bir çözüm getirir. Bu özellik, artık kullanılmayan Mint Hesaplarına ayrılmış SOL'u geri almanın bir mekanizmasını sağlar.  
> — Dökümantasyon Özeti

Bu kılavuzda, Solana Playground kullanarak bir örnek üzerinden gideceğiz. İşte [son script](https://beta.solpg.io/65700c73fb53fa325bfd0c4a).

## Başlarken

Aşağıdaki başlangıç kodu ile bu Solana Playground [bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açın.

```javascript
// Client
console.log("Benim adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Benim bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, önce bir Playground Cüzdanı oluşturmanız ve cüzdanı devnet SOL ile finanse etmeniz gerekecek.

:::info
Eğer bir Playground cüzdanınız yoksa, editörde `pg.wallet.publicKey` ile yapılan tüm tanımlamalarda bir tür hatası görünebilir. Bu tür hatası, bir Playground cüzdanı oluşturduktan sonra kaybolacaktır.
:::

Devnet SOL almak için, Playground'un terminalinde `solana airdrop` komutunu çalıştırın veya bu [devnet musluğuna](https://faucet.solana.com/) gidin.

```
solana airdrop 5
```

Playground cüzdanınızı oluşturup finanse ettikten sonra, başlangıç kodunu çalıştırmak için "Çalıştır" butonuna tıklayın.

## Bağımlılıkları Ekle

Kscriptimizi oluşturmaya başlayalım. `@solana/web3.js` ve `@solana/spl-token` kütüphanelerini kullanacağız.

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
  closeAccount,
  createInitializeMintCloseAuthorityInstruction,
  createInitializeMintInstruction,
  getMintLen,
} from "@solana/spl-token";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilen işlemden dönen işlem imzası
let transactionSignature: string;
```

## Mint Ayarları

Öncelikle, bir sonraki adımda oluşturacağımız Mint Hesabının özelliklerini tanımlayalım.

```javascript
// Mint Hesabı için yeni bir anahtar çiftini oluştur
const mintKeypair = Keypair.generate();
// Mint Hesabı için adres
const mint = mintKeypair.publicKey;
// Mint Hesabı için ondalık sayılar
const decimals = 2;
// Yeni token'lar mint edebilecek yetki
const mintAuthority = pg.wallet.publicKey;
// Mint Hesabını kapatabilecek yetki
const closeAuthority = pg.wallet.publicKey;
```

Sonra, yeni Mint Hesabı için gerekli olan boyutu belirleyelim ve kira muafiyeti için gereken minimum lamportları hesaplayalım.

```javascript
// Uzantıya sahip Mint Hesabının boyutu
const mintLen = getMintLen([ExtensionType.MintCloseAuthority]);
// Mint Hesabı için gereken minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

Token Uzantıları ile, Mint Hesabının boyutu etkinleştirilen uzantılara bağlı olarak değişecektir.

## Talimatları Oluştur

Sonraki adımda, şunları yapmak için talimatlar setini oluşturalım:

- Yeni bir hesap oluştur
- `MintCloseAuthority` uzantısını başlat
- Kalan Mint Hesabı verilerini başlat

Öncelikle, bir hesap oluşturmak için System Program'ı çağıran talimatı oluşturalım ve sahipliği Token Uzantıları Programı'na atayalım.

```javascript
// Yeni bir hesap oluşturmak için System Program'ı çağıran talimat
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları oluşturulan hesaba transfer edecek hesap
  newAccountPubkey: mint, // Oluşturulacak hesabın adresi
  space: mintLen, // Oluşturulan hesap için ayrılacak bayt miktarı
  lamports, // Oluşturulan hesaba transfer edilen lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanan program
});
```

Sonra, Mint Hesabı için `MintCloseAuthority` uzantısını başlatacak talimatı oluşturalım.

```javascript
// MintCloseAuthority Uzantısını başlatma talimatı
const initializeMintCloseAuthorityInstruction =
  createInitializeMintCloseAuthorityInstruction(
    mint, // Mint Hesabı adresi
    closeAuthority, // Belirlenen Kapatma Yetkisi
    TOKEN_2022_PROGRAM_ID, // Token Uzantıları Program ID'si
  );
```

Son olarak, Mint Hesabı verilerinin geri kalanını başlatma talimatını oluşturalım. Bu, orijinal Token Programı ile aynıdır.

```javascript
// Mint Hesabı verilerini başlatma talimatı
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Hesabı Adresi
  decimals, // Mint'in Ondalık Sayıları
  mintAuthority, // Belirlenen Mint Yetkisi
  null, // Opsiyonel Dondurma Yetkisi
  TOKEN_2022_PROGRAM_ID, // Token Uzantıları Program ID'si
);
```

## İşi Gönder

Sonraki adımda, talimatları yeni bir işleme ekleyelim ve ağına gönderelim. Bu, `MintCloseAuthority` uzantısı etkinleştirilmiş bir Mint Hesabı oluşturacaktır.

```javascript
// Yeni işleme talimatları ekle
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeMintCloseAuthorityInstruction,
  initializeMintInstruction,
);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair], // İmzacı
);

console.log(
  "\nMint Hesabı Oluştur:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti `Çalıştır` butonuna tıklayarak çalıştırın. Ardından, işlem detaylarını SolanaFM'de inceleyebilirsiniz.

## Mint Hesabını Kapat

`MintCloseAuthority` uzantısı etkinleştirildiğinde, Kapatma Yetkisi Mint Hesabını kapatarak hesaptan lamportları geri alabilir.

```javascript
// Mint Hesabını kapatmak için işlemi gönder
transactionSignature = await closeAccount(
  connection,
  payer, // İşlem ücreti ödendi
  mint, // Mint Hesabı adresi
  payer.publicKey, // Kapatılan hesaptan lamportları alacak hesap
  closeAuthority, // Mint Hesabı için Kapatma Yetkisi
  undefined, // Ek imzacılar
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantıları Program ID'si
);

console.log(
  "\nMint Hesabını Kapat:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti `Çalıştır` butonuna tıklayarak çalıştırın. Ardından, işlem detaylarını SolanaFM'de inceleyebilirsiniz.

## Sonuç

`MintCloseAuthority` uzantısı, geliştiricilerin Mint Hesabında kalıcı olarak kilitlenmiş olan SOL'u geri almasını sağlar. Bu özellik, yakılmak üzere tasarlanmış tek kullanımlık NFT'ler içeren uygulamalar veya oyunlar için özellikle yararlıdır. Kullanılmayan Mint Hesaplarına ayrılmış SOL'un geri alınmasını ve yeniden kullanılmasını sağlar.

:::warning
Bu uzantının yanlış kullanımı, gereksiz SOL kaybına yol açabilir. Uygulamaları dikkatli bir şekilde test etmek her zaman önemlidir.
:::