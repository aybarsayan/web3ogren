---
date: 2023-12-06T00:00:00Z
difficulty: beginner
seoTitle: "Token Extensions: Immutable Owner"
title: "Immutable Owner uzantısını nasıl kullanabilirsiniz"
description:
  "Token programı ile `SetAuthority` talimatı, bir hesabın sahipliğini
  başka birine devretmek için kullanılabilir. `ImmutableOwner` uzantısı 
  bunun önüne geçmek için kullanılabilir."
keywords:
  - token 2022
  - token uzantıları
  - token programı
tags:
  - token 2022
  - token uzantıları
altRoutes:
  - /developers/guides/immutable-owner
---

Token Programı ile `SetAuthority` talimatı, bir Token Hesabının sahibini 
başka bir hesaba değiştirmek için kullanılabilir. `ImmutableOwner` uzantısı, 
bir Token Hesabının sahipliğinin yeniden atanamayacağından emin olur.

Bu kılavuzda, Solana Playground kullanımıyla bir örneği ele alacağız. İşte 
[son script](https://beta.solpg.io/65710736fb53fa325bfd0c4f).

## Sonuçların Anlaşılması

Peki, bu neden önemlidir? İlişkili Token Hesaplarının adresleri, sahip ve 
mint'e dayanarak türetilir. Bu, belirli bir sahip için ilişkili Token Hesabını 
bulmayı kolaylaştırır.

:::tip
Eğer mevcut bir İlişkili Token Hesabının sahibi değiştirilirse, kullanıcılar 
farkında olmadan, bunun orijinal sahibine ait olduğunu varsayarak bir hesaba 
fon transferi yapabilirler.
:::

Token Uzantıları ile İlişkili Token Hesapları varsayılan olarak `ImmutableOwner` 
uzantısına sahiptir ve sahipliğin değiştirilmesini engeller.

`ImmutableOwner` uzantısı, Token Uzantı programı tarafından oluşturulan 
herhangi bir yeni Token Hesabı için de etkinleştirilebilir.

## Başlarken

Aşağıdaki başlangıç koduyla bu Solana Playground
[linkini](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açarak başlayın.

```javascript
// Client
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground kullanıyorsanız, önce bir Playground Cüzdanı oluşturmanız 
ve cüzdanı devnet SOL ile finanse etmeniz gerekecek.


Not: Playground Cüzdanı Oluşturma

Eğer bir Playground cüzdanınız yoksa, editörde `pg.wallet.publicKey` 
deklarasyonlarının hepsinde bir tür hatası görebilirsiniz. Bu tür hatası, bir 
Playground cüzdanı oluşturduktan sonra temizlenecektir.


Devnet SOL almak için, Playground'un terminalinde `solana airdrop` komutunu 
çalıştırın veya bu [devnet faucet](https://faucet.solana.com/) ziyaret edin.

```
solana airdrop 5
```

Playground cüzdanınızı oluşturup finanse ettikten sonra, başlangıç kodunu 
çalıştırmak için "Çalıştır" butonuna tıklayın.

## Bağımlılıkları Ekle

Şimdi scriptimizi kurmaya başlayalım. `@solana/web3.js` ve 
`@solana/spl-token` kütüphanelerini kullanacağız.

Başlangıç kodunu aşağıdaki ile değiştirin:

```javascript
import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  createMint,
  createInitializeImmutableOwnerInstruction,
  createInitializeAccountInstruction,
  getAccountLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  setAuthority,
  AuthorityType,
} from "@solana/spl-token";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilen işlemden dönen işlem imzası
let transactionSignature: string;
```

## Mint Ayarı

Öncelikle, Token Hesapları oluşturabilmek için yeni bir Mint Hesabı 
oluşturmamız gerekecek.

```javascript
// Yeni token oluşturabilecek yetkilidir
const mintAuthority = pg.wallet.publicKey;
// Mint Hesabı için basamak sayısı
const decimals = 2;

// Mint Hesabı oluştur
const mint = await createMint(
  connection,
  payer, // İşlem ve başlatma ücretlerinin ödeyeni
  mintAuthority, // Mint Yetkilisi
  null, // Opsiyonel Dondurma Yetkilisi
  decimals, // Mint'in basamak sayısı
  undefined, // Opsiyonel anahtar çifti
  undefined, // İşlemi onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
);
```

## İlişkili Token Hesabı

`ImmutableOwner` uzantısı, Token Uzantı Programı tarafından sahiplenecek 
Mint Hesapları için oluşturulan İlişkili Token Hesapları için varsayılan olarak 
etkindir.

Bu kavramı, Playground cüzdanı için bir İlişkili Token Hesabı oluşturarak 
gösterelim.

```javascript
// Playground cüzdanı için İlişkili Token Hesabı oluştur
const associatedTokenAccount = await createAssociatedTokenAccount(
  connection,
  payer, // Token Hesabı oluşturacak ödeyici
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
);
```

İlişkili Token Hesabının sahibini değiştirmeye çalışmak bir hataya yol 
açacaktır.

```javascript
try {
  // İlişkili Token Hesabının sahibini değiştirmeye çalışma
  await setAuthority(
    connection, // Kullanılacak bağlantı
    payer, // İşlem ücreti ödeyeni
    associatedTokenAccount, // İlişkili Token Hesabı
    payer.publicKey, // İlişkili Token Hesabının sahibi
    AuthorityType.AccountOwner, // Yetki türü
    new Keypair().publicKey, // Yeni Hesap Sahibi
    undefined, // Ek imzalayıcılar
    undefined, // Onaylama seçenekleri
    TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
  );
} catch (error) {
  console.log("\nHata Bekleniyor:", error);
}
```

Scripti `Çalıştır` butonuna tıklayarak çalıştırın. Ardından, Playground 
terminalinde hatayı inceleyebilirsiniz. Aşağıdaki gibi bir mesaj görmelisiniz:

```
Hata Bekleniyor: { [Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x22]
  logs:
   [ 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
     'Program log: Instruction: SetAuthority',
     'Program log: The owner authority cannot be changed',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb consumed 3057 of 200000 compute units',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x22' ] }
```

### Immutable Owner Token Hesabı

Sonraki adımda, yeni bir Token Hesabı için `ImmutableOwner` uzantısını etkinleştirmek için bir işlem oluşturalım. Bunun yalnızca yeni Token Hesapları için yapılabileceğini unutmayın.

Öncelikle, Token Hesabı adresi olarak kullanmak için yeni bir anahtar çifti oluşturalım.

```javascript
// Token Hesabı sahibi olarak kullanılacak rastgele anahtar çifti
const tokenAccountKeypair = Keypair.generate();
// Token Hesabı adresi
const tokenAccount = tokenAccountKeypair.publicKey;
```

Ardından, yeni Token Hesabının boyutunu belirleyelim ve kira muafiyeti için 
gerekli minimum lamportları hesaplayalım.

```javascript
// Uzantılı Token Hesabının boyutu
const accountLen = getAccountLen([ExtensionType.ImmutableOwner]);
// Token Hesabı için gereken minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);
```

Token Uzantıları ile, Token Hesabının boyutu etkinleştirilen uzantılara 
göre değişiklik gösterebilir.

## Talimatları Oluştur

Şimdi, aşağıdaki işlemleri oluşturmak için talimat setini oluşturalım:

- Yeni bir hesap oluştur
- `ImmutableOwner` uzantısını başlat
- Kalan Token Hesabı verilerini başlat

Öncelikle, bir hesap oluşturmak ve mülkiyeti Token Uzantıları Programına atamak 
için Sistem Programını çağıran talimatı oluşturalım.

```javascript
// Yeni bir hesap oluşturmak için Sistem Programını çağırma talimatı
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları yaratılan hesaba aktaracak hesap
  newAccountPubkey: tokenAccount, // Oluşturulacak hesabın adresi
  space: accountLen, // Oluşturulan hesaba ayırılacak byte miktarı
  lamports, // Oluşturulan hesaba aktarılacak lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanacak program
});
```

Ardından, Token Hesabı için `ImmutableOwner` uzantısını başlatma
talimatını oluşturalım.

```javascript
// ImmutableOwner Uzantısını başlatma talimatı
const initializeImmutableOwnerInstruction =
  createInitializeImmutableOwnerInstruction(
    tokenAccount, // Token Hesabı adresi
    TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
  );
```

Son olarak, Token Hesabı verilerinin geri kalanını başlatmak için talimatı 
oluşturalım.

```javascript
// Token Hesabı verilerini başlatma talimatı
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount, // Token Hesabı Adresi
  mint, // Mint Hesabı
  payer.publicKey, // Token Hesabı Sahibi
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
);
```

## İşlemi Gönder

Şimdi, talimatları yeni bir işleme ekleyip ağına gönderelim. Bu, 
`ImmutableOwner` uzantısı etkin bir Token Hesabı oluşturacaktır.

```javascript
// Yeni işlemi talimatlarla doldur
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeImmutableOwnerInstruction,
  initializeAccountInstruction,
);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, tokenAccountKeypair], // İmzalayıcılar
);

console.log(
  "\nToken Hesabı Oluştur:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti `Çalıştır` butonuna tıklayarak çalıştırın. Ardından, 
işlem detaylarını SolanaFM'de inceleyebilirsiniz.

Eğer Token Hesabının sahibini değiştirmeye çalışırsanız, aynı hatayı 
görmelisiniz.

```javascript
try {
  // Token Hesabının sahibini değiştirmeye çalışma
  await setAuthority(
    connection, // Kullanılacak bağlantı
    payer, // İşlem ücreti ödeyeni
    tokenAccount, // Token Hesabı
    payer.publicKey, // Token Hesabının sahibi
    AuthorityType.AccountOwner, // Yetki türü
    new Keypair().publicKey, // Yeni Hesap Sahibi
    undefined, // Ek imzalayıcılar
    undefined, // Onaylama seçenekleri
    TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID
  );
} catch (error) {
  console.log("\nHata Bekleniyor:", error);
}
```

## Sonuç

:::note
`ImmutableOwner` uzantısı, ilişkili Token Hesaplarının sahibi değişikliğinden 
kaynaklanan bir güvenlik açığını önler. Bu güvenlik özelliği aynı zamanda 
herhangi bir yeni Token Hesabı için de uygulanabilir ve istenmeyen sahiplik 
değişikliklerine karşı koruma sağlar.
:::