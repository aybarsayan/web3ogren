---
date: 2023-12-06T00:00:00Z
seoTitle: "Token Extensions: Transfer Fees"
title: Transfer Ücreti uzantısını nasıl kullanılır
description:
  "Herhangi bir işlem türünde, genellikle bir ücret toplama veya uygulama isteği vardır.
  Bankada para transferi yaptığınızda her seferinde alınan küçük bir hizmet ücreti veya
  belirli transferler için telif ücreti veya vergilerin nasıl toplandığına benzer."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: başlangıç
tags:
  - token 2022
  - token uzantıları
---

Herhangi bir işlem türünde, genellikle bir ücret toplama veya uygulama isteği vardır.  
Bankada para transferi yaptığınızda her seferinde alınan küçük bir hizmet ücreti veya  
belirli transferler için telif ücreti veya vergilerin nasıl toplandığına benzer.

`TransferFee` uzantısı, bir transfer ücretini doğrudan Mint Hesabı üzerinde  
yapılandırmanıza olanak tanır, böylece ücretler protokol düzeyinde toplanabilir.  
Herhangi bir zamanda tokenler transfer edildiğinde, ücret alıcının Token Hesabı'na  
ayrılır. Bu ücret alıcı tarafından dokunulamaz ve sadece Çekim Yetkisi tarafından  
erişilebilir.

> **Anahtar Nokta:**  
> Alıcı hesabında transfer ücretlerinin havuzlanması tasarımı, işlemlerin paralel  
> olarak maksimum düzeyde gerçekleştirilmesini sağlamak amacı taşır. Aksi takdirde,  
> yapılandırılmış bir ücret alıcı hesabı, paralel transferler arasında yazma kilitli  
> olacak ve protokolün verimliliğini azaltacaktır.  
> — Transfer Ücreti Uzantısı Kılavuzu

---

Bu kılavuzda, Solana Playground kullanarak `TransferFee` uzantısı etkinleştirilmiş bir  
mint oluşturma örneğini adım adım inceleyeceğiz. İşte  
[son script](https://beta.solpg.io/6570e5b7fb53fa325bfd0c4e).



Transfer Ücreti uzantısı, yalnızca aynı Token Mint'inden ücret alabilir. (örneğin,  
`TokenA` oluşturduysanız, Transfer Ücreti uzantısı aracılığıyla alınan tüm transfer  
ücretleri `TokenA` olacaktır). Başka bir token üzerinde benzer bir transfer ücreti  
elde etmek istiyorsanız, Transfer Hook uzantısını kullanın.



## Başlarken

Aşağıdaki başlangıç koduyla bu Solana Playground  
[bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açarak başlayın.

```javascript
// Client
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer bu Solana Playground'u ilk kez kullanıyorsanız, öncelikle bir Playground Cüzdanı oluşturmalı ve cüzdanı devnet SOL ile finanse etmelisiniz.



Bir Playground cüzdanınız yoksa, editörde `pg.wallet.publicKey` ifadeleri için  
bir tür hatası görebilirsiniz. Bu tür hatası, bir Playground cüzdanı oluşturduktan  
sonra temizlenecektir.



Devnet SOL almak için, Playground'un terminalinde `solana airdrop` komutunu çalıştırın veya bu [devnet faucet](https://faucet.solana.com/) sayfasını ziyaret edin.

```
solana airdrop 5
```

Playground cüzdanınızı oluşturup finanse ettikten sonra, başlangıç kodunu çalıştırmak için "Run" butonuna tıklayın.

## Bağımlılıkları Ekleyin

Scriptimizin kurulumuna başlayalım. `@solana/web3.js` ve  
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
  createAccount,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  getMintLen,
  getTransferFeeAmount,
  harvestWithheldTokensToMint,
  mintTo,
  transferCheckedWithFee,
  unpackAccount,
  withdrawWithheldTokensFromAccounts,
  withdrawWithheldTokensFromMint,
} from "@solana/spl-token";

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Gönderilen işlemden geri dönen işlem imzası
let transactionSignature: string;
```

## Mint Ayarı

Öncelikle, aşağıdaki adımda oluşturacağımız Mint Hesabı'nın özelliklerini tanımlayalım.

```javascript
// Mint Hesabı için yeni bir anahtar çifti oluştur
const mintKeypair = Keypair.generate();
// Mint Hesabı için adres
const mint = mintKeypair.publicKey;
// Mint Hesabı için ondalık
const decimals = 2;
// Yeni token mint edebilecek yetki
const mintAuthority = pg.wallet.publicKey;
// Transfer ücretlerini değiştirebilecek yetki
const transferFeeConfigAuthority = pg.wallet.keypair;
// Mint veya token hesaplarında alıkonmuş tokenleri hareket ettirebilecek yetki
const withdrawWithheldAuthority = pg.wallet.keypair;

// Transferler için ücret taban noktaları (100 = %1)
const feeBasisPoints = 100;
// Token temel birimlerinde transferler için maksimum ücret
const maxFee = BigInt(100);
```

Sonraki adımda, yeni Mint Hesabı'nın boyutunu belirleyelim ve kira muafiyeti için gereken minimum lamportları hesaplayalım.

```javascript
// Uzantılarla birlikte Mint Hesabı'nın boyutu
const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);
// Mint Hesabı için gereken minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

Token Uzantıları ile birlikte, Mint Hesabı'nın boyutu etkinleştirilen uzantılara bağlı olarak değişecektir.

## Talimatları Oluşturma

Sonraki adımda, aşağıdaki işlemleri gerçekleştirecek talimat setini oluşturalım:

- Yeni bir hesap oluştur
- `TransferFee` uzantısını başlat
- Kalan Mint Hesabı verilerini başlat

Öncelikle, System Program'ı çağırarak bir hesap oluşturmak ve mülkiyet devretmek için talimat oluşturun.

```javascript
// Yeni hesap oluşturmak için System Program'ı çağıran talimat
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları oluşturulan hesaba aktaracak hesap
  newAccountPubkey: mint, // Oluşturulacak hesabın adresi
  space: mintLen, // Oluşturulan hesaba ayrılacak byte miktarı
  lamports, // Oluşturulan hesaba aktarılacak lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanan program
});
```

Sonraki adımda, Mint Hesabı için `TransferFee` uzantısını başlatacak talimatı oluşturalım.

```javascript
// TransferFeeConfig Uzantısını başlatma talimatı
const initializeTransferFeeConfig =
  createInitializeTransferFeeConfigInstruction(
    mint, // Mint Hesabı adresi
    transferFeeConfigAuthority.publicKey, // Ücretleri güncelleyebilecek yetki
    withdrawWithheldAuthority.publicKey, // Ücretleri çekebilecek yetki
    feeBasisPoints, // Transfer ücreti hesaplama için taban noktaları
    maxFee, // Transfer başına maksimum ücret
    TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
  );
```

Son olarak, Mint Hesabı verilerinin geri kalanını başlatacak talimatı oluşturalım.  
Bu, orijinal Token Programı ile aynıdır.

```javascript
// Mint Hesabı verilerini başlatma talimatı
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Hesabı Adresi
  decimals, // Mint'in ondalıkları
  mintAuthority, // Belirlenmiş Mint Yetkisi
  null, // Opsiyonel Dondurma Yetkisi
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);
```

## İşlemi Gönder

Son olarak, talimatları yeni bir işleme ekleyip ağına gönderelim. Bu, `TransferFee` uzantısı ile bir mint hesabı oluşturacaktır.

```javascript
// Yeni işleme talimatları ekle
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeTransferFeeConfig,
  initializeMintInstruction,
);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair], // İmzalayıcılar
);

console.log(
  "\nMint Hesabı Oluştur:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

`Run` butonuna tıklayarak scripti çalıştırın. Ardından SolanaFM'de işlemleri inceleyebilirsiniz.

## Token Hesapları Oluştur

Sonraki adımda, `TransferFee` uzantısının işlevselliğini göstermesi için iki Token Hesabı oluşturalım.

Öncelikle, Playground cüzdanı tarafından sahip olunan bir `sourceTokenAccount` oluşturalım.

```javascript
// Playground cüzdanı için Token Hesabı oluştur
const sourceTokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturucu
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Opsiyonel anahtar çifti, Default olarak İlişkili Token Hesabı
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);
```

Sonra, rastgele bir anahtar çifti oluşturalım ve bunu `destinationTokenAccount`'ın sahibi olarak kullanalım.

```javascript
// Token Hesabı'nın sahibi olarak kullanılacak rastgele anahtar çifti
const randomKeypair = new Keypair();
// Rastgele anahtar çifti için Token Hesabı oluştur
const destinationTokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturucu
  mint, // Mint Hesabı adresi
  randomKeypair.publicKey, // Token Hesabı sahibi
  undefined, // Opsiyonel anahtar çifti, Default olarak İlişkili Token Hesabı
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);
```

Son olarak, `sourceTokenAccount`'a 2000 token mint edelim.

```javascript
// sourceTokenAccount'a token mint et
transactionSignature = await mintTo(
  connection,
  payer, // İşlem ücreti ödeyeni
  mint, // Mint Hesabı adresi
  sourceTokenAccount, // Mint yapılacak hesap
  mintAuthority, // Mint Yetkisi adresi
  2000_00, // Miktar
  undefined, // Ek imzalar
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);

console.log(
  "\nTokenleri Mint Et:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Tokenleri Transfer Et

Sonraki adımda, `sourceTokenAccount`'tan `destinationTokenAccount`'a token transfer etmeyi deneyelim. Transfer ücreti otomatik olarak transfer miktarından düşülecek ve `destinationTokenAccount` hesabında kalacaktır.

Tokenleri transfer etmek için `transferChecked` veya `transferCheckedWithFee` talimatlarından birini kullanmamız gerekir.

> **Not:**  
> Bu örnekte, `transferCheckedWithFee` kullanacağız. Transfer yalnızca doğru transfer  
> ücreti miktarı talimata geçirildiğinde başarılı olacaktır.

```javascript
// Transfer miktarı
const transferAmount = BigInt(1000_00);
// Transfer ücretini hesapla
const fee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
// Alınan ücreti belirle
const feeCharged = fee > maxFee ? maxFee : fee;

// Ücretle token transfer et
transactionSignature = await transferCheckedWithFee(
  connection,
  payer, // İşlem ücreti ödeyeni
  sourceTokenAccount, // Kaynak Token Hesabı
  mint, // Mint Hesabı adresi
  destinationTokenAccount, // Hedef Token Hesabı
  payer.publicKey, // Kaynak Hesabın sahibi
  transferAmount, // Aktarılacak miktar
  decimals, // Mint Hesabı ondalıkları
  feeCharged, // Transfer ücreti
  undefined, // Ek imzalar
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);

console.log(
  "\nTokenleri Transfer Et:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Token Hesaplarından Ücret Çek

Tokenler transfer edildiğinde, transfer ücretleri otomatik olarak alıcı Token Hesaplarında birikir. Çekim Yetkisi, Mint'in her Token Hesabından bu alıkonmuş tokenleri çekebilir.

> **Uyarı:**  
> Ücret biriken Token Hesaplarını bulmak için, mint için tüm Token Hesaplarını almalı ve ardından  
> alıkonmuş tokenlere sahip olanları filtrelemeliyiz.

Öncelikle, Mint Hesabı için tüm Token Hesaplarını alalım.

```javascript
// Mint Hesabı için tüm Token Hesaplarını al
const allAccounts = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
  commitment: "confirmed",
  filters: [
    {
      memcmp: {
        offset: 0,
        bytes: mint.toString(), // Mint Hesabı adresi
      },
    },
  ],
});
```

Sonraki adımda, transfer ücretlerini tutan Token Hesaplarını filtreleyelim.

```javascript
// Ücret çekilecek Token Hesaplarının listesi
const accountsToWithdrawFrom = [];

for (const accountInfo of allAccounts) {
  const account = unpackAccount(
    accountInfo.pubkey, // Token Hesabı adresi
    accountInfo.account, // Token Hesabı verisi
    TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
  );

  // Her hesabın transfer ücreti verisini çıkar
  const transferFeeAmount = getTransferFeeAmount(account);

  // Ücretlerin çekilmeye uygun olup olmadığını kontrol et
  if (transferFeeAmount !== null && transferFeeAmount.withheldAmount > 0) {
    accountsToWithdrawFrom.push(accountInfo.pubkey); // Hesabı çekim listesine ekle
  }
}
```

Son olarak, `withdrawWithheldAuthority` talimatını kullanarak ücretleri belirli bir hedef Token Hesabına çekelim.

```javascript
// Token Hesaplarından alıkonmuş tokenleri çek
transactionSignature = await withdrawWithheldTokensFromAccounts(
  connection,
  payer, // İşlem ücreti ödeyeni
  mint, // Mint Hesabı adresi
  destinationTokenAccount, // Ücret çekimi için hedef hesap
  withdrawWithheldAuthority, // Ücret çekme yetkisi
  undefined, // Ek imzalar
  accountsToWithdrawFrom, // Çekim yapılacak Token Hesapları
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);

console.log(
  "\nToken Hesaplarından Ücret Çek:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti `Run` butonuna tıklayarak çalıştırın. Ardından SolanaFM'de işlemi inceleyebilirsiniz.

## Mint Hesabına Ücret Hasat Et

Herhangi bir token, alıkonulmuş olanlar da dahil olmak üzere, Token Hesaplarında kapatılamaz. Ancak bir kullanıcı, alıkonmuş transfer ücretleriyle bir Token Hesabını kapatmak isteyebilir.

> **Not:**  
> Kullanıcılar, `harvestWithheldTokensToMint` talimatını kullanarak alıkonmuş tokenleri  
> herhangi bir izin olmadan Token Hesaplarından temizleyebilir. Bu, ücreti doğrudan Mint Hesabına aktarır.

Öncelikle, `destinationTokenAccount`'ın alıkonmuş transfer ücretlerine sahip olabilmesi için başka bir transfer yapalım.

```javascript
// Ücretle token transfer et
transactionSignature = await transferCheckedWithFee(
  connection,
  payer, // İşlem ücreti ödeyeni
  sourceTokenAccount, // Kaynak Token Hesabı
  mint, // Mint Hesabı adresi
  destinationTokenAccount, // Hedef Token Hesabı
  payer.publicKey, // Kaynak Hesabın sahibi
  transferAmount, // Aktarılacak miktar
  decimals, // Mint Hesabı ondalıkları
  feeCharged, // Transfer ücreti
  undefined, // Ek imzalar
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);

console.log(
  "\nTokenleri Transfer Et:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Sonrasında, `destinationTokenAccount`'dan ücretleri "hasat" edelim. Bu, herkes tarafından yapılabilir ve yalnızca Token Hesabının sahibi tarafından yapılması gerekmemektedir.

```javascript
// Alıkonmuş ücretleri Mint Hesabına hasat et
transactionSignature = await harvestWithheldTokensToMint(
  connection,
  payer, // İşlem ücreti ödeyeni
  mint, // Mint Hesabı adresi
  [destinationTokenAccount], // Ücret hasadı için kaynak Token Hesapları
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);

console.log(
  "\nMint Hesabına Ücret Hasat Et:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Mint Hesabından Ücret Çek

Mint Hesabına "hasat edilen" tokenler, Çekim Yetkisi tarafından her zaman belirtilen bir Token Hesabına çekilebilir.

```javascript
// Mint Hesabından ücretleri çek
transactionSignature = await withdrawWithheldTokensFromMint(
  connection,
  payer, // İşlem ücreti ödeyeni
  mint, // Mint Hesabı adresi
  destinationTokenAccount, // Ücret çekimi için hedef hesap
  withdrawWithheldAuthority, // Alıkonmuş Ücret Yetkisi
  undefined, // Ek imzalar
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID'si
);

console.log(
  "\nMint Hesabından Ücret Çek:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti `Run` butonuna tıklayarak çalıştırın. Ardından SolanaFM'de işlemi inceleyebilirsiniz.

---

## Sonuç

`TransferFee` uzantısı, token yaratıcılarının her transferde ekstra talimat veya özel programlar gerektirmeden ücret uygulamasını sağlar. Bu yaklaşım, ücretlerin aktarılan tokenlarla aynı para biriminde toplanmasını sağlarken, işlem sürecini basitleştirir.