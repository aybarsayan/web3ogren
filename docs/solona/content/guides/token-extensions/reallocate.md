---
date: 2023-12-07T00:00:00Z
seoTitle: "Token Uzantıları: Yeniden Tahsisat Talimatı"
title: Yeniden Tahsisat Talimatını Nasıl Kullanırım
description:
  "Token Uzantıları programı, bir Token Hesabı başlatıldıktan sonra uygulanabilen bir hesap uzantısına sahiptir,
  bu da başlangıç oluşturmasından sonra daha fazla uzantı için genişletilmiş destek sağlamaktadır."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: başlangıç
tags:
  - token 2022
  - token uzantıları
---

Mevcut Token Hesaplarına Token Uzantıları programı aracılığıyla ek uzantılar etkinleştirmek için,
öncelikle bu uzantıların gerektirdiği ek veriyi barındırmak üzere ek alan yeniden tahsis edilmelidir.
Bu, `reallocate` talimatı kullanılarak yapılabilir.

> Önemli Not: Bu işlem, mevcut Token Hesaplarının `MemoTransfer` ve
`CpiGuard` uzantılarını etkinleştirecek şekilde güncellenmesini sağlar.  
— Prosedür Kılavuzu

## Başlarken

Aşağıdaki başlangıç kodu ile bu Solana Playground
[bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açarak başlayın.

```javascript
// İstemci
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, önce bir
Playground Cüzdanı oluşturmanız ve cüzdanı devnet SOL ile fonladığınızdan emin olmalısınız.

:::info
Eğer bir Playground cüzdanınız yoksa, `pg.wallet.publicKey` tanımlarında
tür hatası görebilirsiniz. Bu tür hatası, bir Playground cüzdanı oluşturduktan
sonra temizlenecektir.
:::

Devnet SOL almak için, Playground'un terminalinde `solana airdrop` komutunu çalıştırın veya bu [devnet faucet](https://faucet.solana.com/) adresini ziyaret edin.

```
solana airdrop 5
```

Playground cüzdanını oluşturduktan ve fonladıktan sonra, başlangıç kodunu çalıştırmak için "Çalıştır" butonuna tıklayın.

---

## Bağımlılıkları Ekle

Scriptimizi ayarlamakla başlayalım. `@solana/web3.js` ve
`@solana/spl-token` kütüphanelerini kullanacağız.

Başlangıç kodunu aşağıdaki ile değiştirin:

```javascript
import {
  Connection,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createAccount,
  createMint,
  createReallocateInstruction,
  createEnableRequiredMemoTransfersInstruction,
} from "@solana/spl-token";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilen işlemden dönen işlem imzası
let transactionSignature: string;
```

---

## Mint ve Token Hesabı Oluşturma

Öncelikle, yeni bir Mint Hesabı oluşturmamız gerekecek.

```javascript
// Yeni token'ları mint edebilecek yetki
const mintAuthority = pg.wallet.publicKey;
// Mint Hesabı için ondalıklar
const decimals = 2;

// Mint Hesabı oluştur
const mint = await createMint(
  connection,
  payer, // İşlem ve başlangıç ücretlerinin ödeyeni
  mintAuthority, // Mint Yetkisi
  null, // Opsiyonel Dondurma Yetkisi
  decimals, // Mint'in Ondalıkları
  undefined, // Opsiyonel anahtar çifti
  undefined, // İşlemi onaylamak için opsiyonlar
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
);
```

> **Not:** Mint Hesabı oluştururken, ödenmesi gereken ücretler için yeterli SOL bakiyeniz olduğundan emin olun.  
— İşlem Ücretleri

Sonraki adımda, uzantı etkinleştirilmemiş bir Token Hesabı oluşturalım.

```javascript
// Playground cüzdanı için Token Hesabı oluştur
const tokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturacak ödeyen
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Opsiyonel anahtar çifti, Varsayılan olarak İlişkili Token Hesabı
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
);
```

---

## Talimatları Oluşturma

Sonraki adımda, mevcut bir Token Hesabı için `MemoTransfer` uzantısını etkinleştirmek üzere bir işlem oluşturalım.

Önce, belirtilen uzantı için yeterli alanla Token Hesabını yeniden tahsis etmek üzere talimatı oluşturalım. Token Uzantıları Programı, gerekli alan ve lamportları otomatik olarak hesaplayan bir
[yeniden tahsisat talimatı](https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/reallocate.rs#L24) içerir.

```javascript
// Yeniden tahsis edilecek veriler için uzantılar
const extensions = [ExtensionType.MemoTransfer];
// Token Hesabı verilerini yeniden tahsis etme talimatı
const reallocateInstruction = createReallocateInstruction(
  tokenAccount, // Token Hesabı adresi
  payer.publicKey, // Verileri yeniden tahsis etmek için ödeyen
  extensions, // Yeniden tahsis edilecek uzantılar
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Ek imzalayıcılar
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
);
```

Sonraki adımda, Token Hesabı için `MemoTransfer` uzantısını etkinleştirecek talimatı oluşturalım.

```javascript
// MemoTransfer Uzantısını başlatma talimatı
const enableRequiredMemoTransfersInstruction =
  createEnableRequiredMemoTransfersInstruction(
    tokenAccount, // Token Hesabı adresi
    payer.publicKey, // Token Hesabı Sahibi
    undefined, // Ek imzalayıcılar
    TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
  );
```

---

## İşlemi Gönder

Sonraki adımda, talimatları yeni bir işleme ekleyelim ve ağına gönderelim. Bu, Token Hesabını `MemoTransfer` uzantısı etkinleştirilecek şekilde güncelleyecektir.

```javascript
// Yeni işleme talimatları ekle
const transaction = new Transaction().add(
  reallocateInstruction,
  enableRequiredMemoTransfersInstruction,
);

// İşlemi Gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer],
);

console.log(
  "\nYeniden Tahsisat:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti çalıştırmak için `Çalıştır` butonuna tıklayın. Ardından, işlemin detaylarını SolanaFM'de inceleyebilirsiniz.

---

## Sonuç

Token Uzantıları programındaki yeniden tahsisat talimatı, mevcut Token Hesaplarını ek işlevselliklerle güncellemenin esnek bir yolunu sunar. **Bu talimat**, başlangıçta belirli uzantılara ihtiyaç duymadığını düşünen token sahipleri için kullanışlıdır, ancak zamanla bu ek özellikleri gerektiren durumlarla karşılaşabilirler.