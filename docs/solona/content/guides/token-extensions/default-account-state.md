---
date: 2023-12-06T00:00:00Z
seoTitle: "Token Uzantıları: Varsayılan Hesap Durumu"
title: Varsayılan Hesap Durumu uzantısını nasıl kullanılır
description:
  "Tüm yeni Token Hesaplarının varsayılan olarak dondurulmasını yapılandırın, ardından
  kullanılabilir olmadan önce tüm tokenların yetki tarafından dondurulması gerekir."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: beginner
tags:
  - token 2022
  - token uzantıları
---

`DefaultAccountState` uzantısı, tüm yeni Token Hesaplarının varsayılan olarak dondurulma seçeneğini sağlar. Bu yapılandırma ile Token Hesapları, kullanılmadan önce öncelikle mint’in Donma Yetkisi tarafından çözülmelidir (dondurulmaktan kurtarılmalıdır). Bu özellik, token yaratıcılarına token dağıtımı üzerinde daha fazla kontrole sahip olma yeteneği tanır ve kimin token tutabileceğini sınırlayarak bunu sağlar.

:::tip
Bu uzantının kullanımı, token dağıtımında esneklik sağlar. 
:::

Bu rehberde, Solana Playground kullanma örneğini inceleyeceğiz. İşte [son script](https://beta.solpg.io/6570ae7afb53fa325bfd0c4c).

## Başlarken

Aşağıdaki başlangıç koduyla bu Solana Playground [bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açarak başlayın.

```javascript
// Client
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, önce bir Playground Cüzdanı oluşturmanız ve cüzdanı devnet SOL ile finanse etmeniz gerekecek.


Not: Playground Cüzdanı

Eğer bir Playground cüzdanınız yoksa, `pg.wallet.publicKey` tanımlamaları içinde editörde bir tür hata görebilirsiniz. Bu tür hata, bir Playground cüzdanı oluşturduktan sonra geçecektir.



Devnet SOL almak için, Playground'un terminalinde `solana airdrop` komutunu çalıştırın veya bu [devnet musluğunu](https://faucet.solana.com/) ziyaret edin.

```
solana airdrop 5
```

Parkland cüzdanınızı oluşturup finanse ettikten sonra, başlangıç kodunu çalıştırmak için "Çalıştır" düğmesine tıklayın.

## Bağımlılık Ekleme

Şimdi scriptimizi ayarlamaya başlayalım. `@solana/web3.js` ve `@solana/spl-token` kütüphanelerini kullanacağız.

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
  AccountState,
  createInitializeDefaultAccountStateInstruction,
  createInitializeMintInstruction,
  getMintLen,
  createAccount,
  mintTo,
  updateDefaultAccountState,
  thawAccount,
} from "@solana/spl-token";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilen işlemin imzası
let transactionSignature: string;
```

## Mint Kurulumu

İlk olarak, aşağıdaki adımda oluşturacağımız Mint Hesabının özelliklerini tanımlayalım.

```javascript
// Mint Hesabı için yeni anahtar çifti oluştur
const mintKeypair = Keypair.generate();
// Mint Hesabı için adres
const mint = mintKeypair.publicKey;
// Mint Hesabı için ondalık sayılar
const decimals = 2;
// Yeni tokenları basabilen yetki
const mintAuthority = pg.wallet.publicKey;
// Token hesaplarını dondurabilen ve çözebilen yetki
const freezeAuthority = pg.wallet.publicKey;
```

Sonra, yeni Mint Hesabının boyutunu belirleyelim ve kiralama muafiyeti için minimum lamport miktarını hesaplayalım.

```javascript
// Uzantılı Mint Hesabı boyutu
const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
// Mint Hesabı için gerekli minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

Token Uzantıları ile, Mint Hesabının boyutu etkinleştirilen uzantılara bağlı olarak değişecektir.

## Talimatları Oluşturma

Şimdi, aşağıdakileri yapmak için talimat seti oluşturalım:

- Yeni bir hesap oluştur
- `DefaultAccountState` uzantısını başlat
- Kalan Mint Hesabı verilerini başlat

Öncelikle, yeni bir hesap oluşturmak için Sistem Programını çağıracak talimatı oluşturalım ve sahipliği Token Uzantıları Programına atayalım.

```javascript
// Yeni hesap oluşturmak için Sistem Programını çağıracak talimat
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamport'u oluşturulan hesaba aktaracak hesap
  newAccountPubkey: mint, // Oluşturulacak hesabın adresi
  space: mintLen, // Oluşturulan hesaba tahsis edilecek bayt miktarı
  lamports, // Oluşturulan hesaba aktarılan lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanan program
});
```

Sonra, Mint Hesabı için `DefaultAccountState` uzantısını başlatacak talimatı oluşturalım.

```javascript
// Varsayılan hesap durumunu Dondurulmuş olarak ayarla
const defaultState = AccountState.Frozen;
// DefaultAccountState Uzantısını başlatmak için talimat
const initializeDefaultAccountStateInstruction =
  createInitializeDefaultAccountStateInstruction(
    mint, // Mint Hesabı adresi
    defaultState, // Varsayılan AccountState
    TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
  );
```

Son olarak, Mint Hesabı verilerini başlatmak için geri kalan talimatı oluşturun. Bu, orijinal Token Programı ile aynıdır.

```javascript
// Mint Hesabı verilerini başlatmak için talimat
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Hesabı Adresi
  decimals, // Mint'in Ondalık Sayısı
  mintAuthority, // Belirlenen Mint Yetkisi
  freezeAuthority, // Belirlenen Donma Yetkisi
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

## İşlemi Gönder

Şimdi, talimatları yeni bir işleme ekleyelim ve ağ üzerinden gönderelim. Bu, `DefaultAccountState` uzantısı etkinleştirilen bir Mint Hesabı oluşturacaktır.

```javascript
// Talimatları yeni bir işleme ekle
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeDefaultAccountStateInstruction,
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

Scripti çalıştırmak için `Run` butonuna tıklayın. Daha sonra işlemi SolanaFM'de inceleyebilirsiniz.

## Varsayılan Dondurulmuş Token Hesabı

Bir Token Hesabı oluşturulduğunda, varsayılan olarak dondurulmuş olacaktır. Sonuç olarak, Token Hesabıyla etkileşimde bulunan herhangi bir işlem başarısız olacaktır.

```javascript
// Playground cüzdanı için Token Hesabı oluştur
const tokenAccount = await createAccount(
  connection,
  payer, // Token Hesabı oluşturmak için ödeyici
  mint, // Mint Hesabı adresi
  payer.publicKey, // Token Hesabı sahibi
  undefined, // İsteğe bağlı anahtar çifti, Varsayılan İlişkili Token Hesabı olacak
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);
```

Varsayılan dondurulmuş durumda, kullanıcılar Mint'ten token tutamaz veya etkileşimde bulunamazlar, bunun için Donma Yetkisi Token Hesabını çözmelidir (dondurulmaktan kurtarmalıdır).

> **Not:** Yeni Token Hesabına token basma işlemi başarısız olacaktır.

```javascript
try {
  // Tokenları basmaya çalış
  await mintTo(
    connection,
    payer, // İşlem ücreti ödeyicisi
    mint, // Mint Hesabı adresi
    tokenAccount, // Basım için varış noktası
    mintAuthority, // Mint Yetkisi
    100, // Basılacak miktar
    undefined, // Ek imzalayıcılar
    undefined, // Onay seçenekleri
    TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
  );
} catch (error) {
  console.log("\nHata Bekliyoruz:", error);
}
```

Scripti çalıştırmak için `Run` butonuna tıklayın. Daha sonra hatayı Playground terminalinde inceleyebilirsiniz. Aşağıdakine benzer bir mesaj görmelisiniz:

```
[Error: transaction göndermede başarısız oldu: İşlem simülasyonu başarısız oldu: Talimat 0'ı işleme hatası: özel program hatası: 0x11]
  loglar:
   [ 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
     'Program kaydı: Talimat: MintTo',
     'Program kaydı: Hata: Hesap donmuş',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb 200000 hesaplama biriminden 3274 tüketti',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb başarısız oldu: özel program hatası: 0x11' ]
```

## Donmayı Açma (Çözme) Token Hesabı

Token Hesabı, orijinal Token programında olduğu gibi `thawAccount` talimatı kullanılarak çözülür.

```javascript
// Token Hesabını çöz (dondurmayı kaldır)
transactionSignature = await thawAccount(
  connection,
  payer, // İşlem ücreti ödeyicisi
  tokenAccount, // Çözülmesi gereken Token Hesabı
  mint, // Mint Hesabı adresi
  freezeAuthority, // Donma Yetkisi
  undefined, // Ek imzalayıcılar
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nToken Hesabını Çöz:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Token Hesabını çözme talimatı, kullanıcıların Token Hesaplarını çözmek için belirli eylemleri gerçekleştirmelerini gerektiren daha karmaşık işlemlere eklenebilir.

## Varsayılan Durumu Güncelleme

Token yaratıcıları, oluşturulan hesaplar için ayarlanacak yeni hesap durumunu geçerek `updateDefaultAccountState` talimatını kullanarak başlangıç kısıtlamalarını hafifletmeyi seçebilirler.

```javascript
// Yeni Token Hesapları için varsayılan hesap durumunu güncelle
transactionSignature = await updateDefaultAccountState(
  connection,
  payer, // İşlem ücretini ödeyen
  mint, // Değiştirilecek Mint
  AccountState.Initialized, // Oluşturulan hesaplar için ayarlanacak yeni hesap durumu
  freezeAuthority, // Donma yetkisi
  undefined, // Ek imzalayıcılar
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantısı Program ID
);

console.log(
  "\nVarsayılan Mint Hesap Durumunu Güncelle:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Scripti çalıştırmak için `Run` butonuna tıklayın. Daha sonra işlemi SolanaFM'de inceleyebilirsiniz.

## Sonuç

`DefaultAccountState` uzantısı, token yaratıcılarının tokenları üzerinde geliştirilmiş bir kontrol sağlamak için değerli bir araç tanıtır. Bu özellik, tokenların kontrol altında dağıtımını sağlar ve token sahipleri için zorunlu KYC doğrulama mekanizmaları gibi olanaklar sunar.