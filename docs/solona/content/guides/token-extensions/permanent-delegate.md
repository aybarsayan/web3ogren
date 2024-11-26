---
date: 2023-12-06T00:00:00Z
seoTitle: "Token Uzantıları: Kalıcı Temsilci"
title: Kalıcı Temsilci uzantısını nasıl kullanılır
description:
  "Token Uzantıları, bir mint için kalıcı bir hesap temsilcisi belirlemenize
  izin verir. Bu, o mint ile ilişkili herhangi bir hesap üzerinde sınırsız temsilci
  ayrıcalıkları sağlayarak, herhangi bir miktarda token yakma veya transfer etme
  yetkisini içerir."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: beginner
tags:
  - token 2022
  - token uzantıları
---

`PermanentDelegate` uzantısı, bir Mint Hesabı için belirlenmiş bir Kalıcı
Temsilci sağlar. Bu kalıcı temsilci, o mint için tüm Token Hesapları üzerinde
sınırsız temsilcilik yetkilerine sahiptir; böylece tokensiz sınır olmaksızın yakma veya
transfer işlemleri yapabilir.

Bu kılavuzda, Solana Playground kullanarak Kalıcı Temsilci ile bir token
oluşturma örneğini adım adım göstereceğiz. İşte bu kılavuzun
[son scripti](https://beta.solpg.io/6570a56bfb53fa325bfd0c4b).

## Etkileri Anlamak

Bu, çok güçlü bir özelliktir ve etkilerinin hem kullanıcılar hem de uygulama
geliştiricileri için net bir şekilde belirtilmesi gerekir.

:::warning
Kalıcı Temsilci, mint için tüm Token Hesaplarının etkili bir şekilde
küresel sahibidir. Kalıcı Temsilci’nin sınırsız yetkileri nedeniyle,
temsilcinin anahtarları tehlikeye girerse, bir saldırgan o mint için tüm
Token Hesapları üzerinde tam kontrol sahibi olacaktır.
:::

## Başlarken

Bu Solana Playground'u açarak başlayın
[bağlantı](https://beta.solpg.io/656e19acfb53fa325bfd0c46) ve aşağıdaki
başlangıç kodunu kullanın.

```javascript
// İstemci
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, önce bir
Playground Cüzdanı oluşturmanız ve cüzdanı devnet SOL ile finanse etmeniz
gerekir.

:::info
Eğer bir Playground cüzdanınız yoksa, `pg.wallet.publicKey` ifadelerinin
her birinde derleme hatası görebilirsiniz. Bu tür bir derleme hatası,
Playground cüzdanı oluşturduktan sonra ortadan kalkacaktır.
:::

Devnet SOL almak için, Playground'un terminalinde `solana airdrop`
komutunu çalıştırın veya bu [devnet faucet](https://faucet.solana.com/) adresini ziyaret edin.

```
solana airdrop 5
```

Playground cüzdanını oluşturup finanse ettikten sonra, başlangıç kodunu
çalıştırmak için "Run" butonuna tıklayın.

## Bağımlılıkları Ekle

Scriptimizi oluşturarak başlayalım. `@solana/web3.js` ve
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
  createInitializePermanentDelegateInstruction,
  createInitializeMintInstruction,
  getMintLen,
  createAccount,
  mintTo,
  transferChecked,
  burnChecked,
} from "@solana/spl-token";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilen işlemden dönen işlem imzası
let transactionSignature: string;
```

## Mint Ayarları

Öncelikle, bir sonraki adımda oluşturacağımız Mint Hesabının
özelliklerini tanımlayalım.

```javascript
// Mint Hesabı için yeni anahtar çifti oluştur
const mintKeypair = Keypair.generate();
// Mint Hesabı için adres
const mint = mintKeypair.publicKey;
// Mint Hesabı için ondalık sayılar
const decimals = 2;
// Yeni token oluşturabilecek yetki
const mintAuthority = pg.wallet.publicKey;
// Herhangi bir token hesabından transfer veya yakma yetkisi
const permanentDelegate = pg.wallet.publicKey;
```

Sonra, yeni Mint Hesabının boyutunu belirleyelim ve kira muafiyeti için gerekli
minimum lamport miktarını hesaplayalım.

```javascript
// Uzantılı Mint Hesabı boyutu
const mintLen = getMintLen([ExtensionType.PermanentDelegate]);
// Mint Hesabı için gerekli minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

Token Uzantıları ile, Mint Hesabının boyutu etkin olan uzantılara bağlı olarak değişiklik
gösterecektir.

## Talimatları Oluştur

Aşağıdaki işlemleri gerçekleştirmek için bir dizi talimat oluşturmamız
gerekecek:

1. Yeni bir hesap oluşturma
2. `PermanentDelegate` uzantısını başlatma
3. Kalan Mint Hesabı verilerini başlatma

Öncelikle, yeni bir hesap oluşturmak ve Token Uzantıları Programı'na
sahipliği vermek için Sistem Programını çağıracak talimatı oluşturalım.

```javascript
// Yeni hesap oluşturmak için Sistem Programını çağıran talimat
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları oluşturulan hesaba aktaracak hesap
  newAccountPubkey: mint, // Oluşturulacak hesabın adresi
  space: mintLen, // Oluşturulacak hesaba ayrılacak byte miktarı
  lamports, // Oluşturulan hesaba aktarılacak lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanacak program
});
```

Sonra, Mint Hesabı için `PermanentDelegate` uzantısını başlatmak için talimatı
oluşturalım.

```javascript
// PermanentDelegate Uzantısını başlatma talimatı
const initializePermanentDelegateInstruction =
  createInitializePermanentDelegateInstruction(
    mint, // Mint Hesabı adresi
    permanentDelegate, // Belirlenen Kalıcı Temsilci
    TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
  );
```

Son olarak, Mint Hesabı verilerinin geri kalanını başlatmak için talimatı
oluşturalım. Bu, orijinal Token Programı ile aynıdır.

```javascript
// Mint Hesabı verilerini başlatma talimatı
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Hesabı Adresi
  decimals, // Mint Ondalıklı Sayıları
  mintAuthority, // Belirlenmiş Mint Yetkisi
  null, // İsteğe bağlı Dondurma Yetkisi
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

## İşlem Gönder

Artık talimatları yeni bir işlemin içine ekleyip ağına gönderebiliriz. Bu,
`PermanentDelegate` uzantısından yararlanarak bir Mint Hesabı oluşturacaktır.

```javascript
// Yeni işleme talimatları ekle
const transaction = new Transaction().add(
  createAccountInstruction,
  initializePermanentDelegateInstruction,
  initializeMintInstruction,
);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair], // İmzalayanlar
);

console.log(
  "\nMint Hesabı Oluştur:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti çalıştırmak için `Run` butonuna tıklayın. Daha sonra işlemi
SolanaFM'de inceleyebilirsiniz.

## Token Hesapları Oluştur

Sonraki adımda, Kalıcı Temsilcininn işlevselliğini göstermek için iki Token
Hesabı oluşturacağız.

Öncelikle, rastgele bir anahtar çifti oluşturun ve bunu
`sourceTokenAccount`'ın sahibi olarak kullanın.

```javascript
// Token Hesabı sahibi olarak kullanılacak rastgele anahtar çifti
const randomKeypair = new Keypair();
// Rastgele anahtar çiftinin Token Hesabı için oluşturulması
const sourceTokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturmak için ödeyen
  mint, // Mint Hesabı adresi
  randomKeypair.publicKey, // Token Hesabı sahibi
  undefined, // İsteğe bağlı anahtar çifti, Varsayılan olarak İlişkili Token Hesabı
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

Sonra, Playground cüzdanı tarafından sahip olunan bir `destinationTokenAccount`
oluşturun.

```javascript
// Playground cüzdanı için Token Hesabı oluştur
const destinationTokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturmak için ödeyen
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  undefined, // İsteğe bağlı anahtar çifti, Varsayılan olarak İlişkili Token Hesabı
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

Son olarak, `sourceTokenAccount`'a fon sağlamak için 2 token mint edin.

```javascript
// sourceTokenAccount'a token mint et
transactionSignature = await mintTo(
  connection,
  payer, // İşlem ücreti ödeyeni
  mint, // Mint Hesabı adresi
  sourceTokenAccount, // Mint edilen yer
  mintAuthority, // Mint Yetkisi adresi
  200, // Miktar
  undefined, // Ek imzalayanlar
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nToken Mint:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Kalıcı Temsilci ile Transfer

Sonraki adımda, `sourceTokenAccount`'tan `destinationTokenAccount`'a 1 token transfer
etmek için bir işlem göndereceğiz. Unutmayın, `sourceTokenAccount` rastgele
oluşturulmuş bir anahtar çifti tarafından sahiptir.

Kalıcı Temsilci'yi kullanarak token transfer etmek için, `transferChecked`
talimatını kullanın ve `sourceTokenAccount`'ın sahibi olarak Kalıcı Temsilci’yi
belirleyin.

```javascript
// Kaynaktan hedefe token transfer et
transactionSignature = await transferChecked(
  connection,
  payer, // İşlem ücreti ödeyeni
  sourceTokenAccount, // Transfer edilen
  mint, // Mint Hesabı adresi
  destinationTokenAccount, // Transfer edilen yer
  permanentDelegate, // Kaynağı sahip olarak Kalıcı Temsilci kullan
  100, // Miktar
  decimals, // Mint Hesabı ondalık sayıları
  undefined, // Ek imzalayanlar
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nToken Transferi:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Kalıcı Temsilci ile Yakma

Ayrıca `sourceTokenAccount`'tan 1 token yakmak için bir işlem göndereceğiz.

Tokenları `Permanent Delegate` kullanarak yakmak için, `burnChecked`
talimatını kullanın ve `sourceTokenAccount`ın sahibi olarak Kalıcı Temsilci’yi
belirleyin.

```javascript
// Token hesabından token yak
transactionSignature = await burnChecked(
  connection,
  payer, // İşlem ücreti ödeyeni
  sourceTokenAccount, // Yakılan yer
  mint, // Mint Hesabı adresi
  permanentDelegate, // Kaynağı sahip olarak Kalıcı Temsilci kullan
  100, // Miktar
  decimals, // Mint Hesabı ondalık sayıları
  undefined, // Ek imzalayanlar
  undefined, // Onaylama seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nToken Yak:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti çalıştırmak için `Run` butonuna tıklayın. Daha sonra işlemleri
SolanaFM'de inceleyebilirsiniz.

:::success
Her iki transfer ve yakma işleminin de, Token Hesabının sahibi tarafından imzalanmamasına rağmen
başarıyla tamamlandığını unutmayın.
:::

## Sonuç

`PermanentDelegate` uzantısı, geliştiricilerin oluşturdukları tokenlar üzerinde
çok daha fazla kontrol sahibi olmasını sağlayan güçlü bir uzantıdır; örneğin,
yanlışlıkla transfer edilen tokenları geri alma yeteneği gibi. Bu uzantı ile daha fazla
esneklik sağlarken, kullanıcıların bu uzantı ile etkinleştirilmiş token tutmanın etkilerini
ve özellikle temsilci anahtarlarının tehlikeye girmesiyle ilgili riskleri
tam olarak anlamaları önemlidir.