---
date: 2023-12-07T00:00:00Z
seoTitle: "Token Uzantıları: Faiz Getiren"
title: Faiz Getiren uzantıyı nasıl kullanabilirsiniz
description:
  "Faiz getiren tokenler, zamanla değer kazanabilen veya kaybedebilen tokenlerdir. Banka tasarruf hesapları veya krediler gibi, faiz birikir."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: beginner
tags:
  - token 2022
  - token uzantıları
---

`InterestBearingConfig` uzantısı, geliştiricilerin doğrudan Mint Hesabı üzerinde depolanan bir faiz oranı belirlemelerine olanak tanır. Faiz, ağın zaman damgasına dayalı olarak sürekli olarak bileşik faiz şeklinde hesaplanır.

> **Önemli Not:**  
> Başka bir deyişle, biriken faiz, sadece görsel bir UI dönüştürmesi olup, altında yatan token miktarı değişmez. Bu tasarım, biriken faizi ayarlamak için sık sık yeniden temellendirme veya güncelleme işlemleri yapma gereğini ortadan kaldırır.  
> — Token Uzantıları Kılavuzu


Faiz Hesaplama Notları

:::info
Faiz birikiminin sadece bir [hesaplama](https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/interest_bearing_mint/mod.rs#L85) olduğunu ve yeni tokenlerin basılmasını içermediğini unutmayın.
:::


Bu kılavuzda, Solana Playground'u kullanma örneğini inceleyeceğiz. İşte [son script](https://beta.solpg.io/65724856fb53fa325bfd0c53).

## Başlarken

Başlamak için, aşağıdaki başlangıç koduyla bu Solana Playground [bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açın.

```javascript
// Client
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, önce bir Playground Cüzdanı oluşturmanız ve cüzdanı devnet SOL ile fonlamanız gerekecek.

:::info
Eğer bir Playground cüzdanınız yoksa, `pg.wallet.publicKey` olan tüm beyanlarda bir tip hatası görebilirsiniz. Bu tip hatası, bir Playground cüzdanı oluşturduktan sonra silinecektir.
:::

Devnet SOL almak için, Playground'un terminalinde `solana airdrop` komutunu çalıştırın veya bu [devnet musluğuna](https://faucet.solana.com/) gidin.

```
solana airdrop 5
```

Playground cüzdanını oluşturup fonladıktan sonra, başlangıç kodunu çalıştırmak için "Çalıştır" butonuna tıklayın.

## Bağımlılıkları Ekle

Script'imizi ayarlamaya başlayalım. `@solana/web3.js` ve `@solana/spl-token` kütüphanelerini kullanacağız.

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
  updateRateInterestBearingMint,
  createInitializeInterestBearingMintInstruction,
  createInitializeMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  amountToUiAmount,
  getInterestBearingMintConfigState,
  getMint,
} from "@solana/spl-token";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilen işlemden dönen işlem imzası
let transactionSignature: string;
```

## Mint Ayarı

Öncelikle, bir sonraki adımda oluşturacağımız Mint Hesabı'nın özelliklerini tanımlayalım.

```javascript
// Mint Hesabı için yeni bir anahtar çifti oluştur
const mintKeypair = Keypair.generate();
// Mint Hesabı için adres
const mint = mintKeypair.publicKey;
// Mint Hesabı için ondalık sayılar
const decimals = 2;
// Yeni tokenleri basabilen otorite
const mintAuthority = pg.wallet.publicKey;
// Faiz oranını güncelleyebilen otorite
const rateAuthority = pg.wallet.keypair;
// Faiz oranı baz puanları (100 = %1)
// Maksimum değer = 32,767 (i16)
const rate = 32_767;
```

Sonra, yeni Mint Hesabı'nın boyutunu belirleyelim ve kiralama muafiyeti için gereken minimum lamportları hesaplayalım.

```javascript
// Uzantı ile birlikte Mint Hesabı boyutu
const mintLen = getMintLen([ExtensionType.InterestBearingConfig]);
// Mint Hesabı için gereken minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

Token Uzantıları ile birlikte, Mint Hesabı'nın boyutu etkin olan uzantılara göre değişecektir.

## Talimatları Oluştur

Sonraki adımda, yeni bir hesap oluşturma, `InterestBearingConfig` uzantısını başlatma ve kalan Mint Hesabı verilerini başlatma talimatları setini oluşturalım.

Öncelikle, bir hesap oluşturmak ve sahipliği Token Uzantıları Programı'na atamak için Sistem Programı'nı çağıracak talimatı oluşturalım.

```javascript
// Yeni hesap oluşturmak için Sistem Programı'nı çağıracak talimat
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları oluşturulan hesaba aktaracak hesap
  newAccountPubkey: mint, // Oluşturulacak hesap adresi
  space: mintLen, // Oluşturulan hesap için ayrılacak bayt miktarı
  lamports, // Oluşturulan hesaba aktarılacak lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanan program
});
```

Sonraki adımda, Mint Hesabı için `InterestBearingConfig` uzantısını başlatacak talimatı oluşturalım.

```javascript
// InterestBearingConfig Uzantısını başlatmak için talimat
const initializeInterestBearingMintInstruction =
  createInitializeInterestBearingMintInstruction(
    mint, // Mint Hesabı adresi
    rateAuthority.publicKey, // Belirlenen Faiz Otoritesi
    rate, // Faiz oranı baz puanları
    TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID'si
  );
```

Son olarak, Mint Hesabı verilerinin geri kalanını başlatacak talimatı oluşturalım. Bu, orijinal Token Programı ile aynıdır.

```javascript
// Mint Hesabı verilerini başlatmak için talimat
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Hesabı Adresi
  decimals, // Mint'in Ondalık Sayıları
  mintAuthority, // Belirlenen Mint Yetkilisi
  null, // Opsiyonel Dondurma Yetkilisi
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID'si
);
```

## İşlem Gönder

Sonraki adımda, talimatları yeni bir işleme ekleyip ağına göndereceğiz. Bu, `InterestBearingConfig` uzantısı etkin olan bir Mint Hesabı oluşturacaktır.

```javascript
// Yeni işleme talimatları ekle
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeInterestBearingMintInstruction,
  initializeMintInstruction,
);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair], // İmzacıları
);

console.log(
  "\nMint Hesabı Oluştur:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Script'i çalıştırmak için `Çalıştır` butonuna tıklayın. Daha sonra, SolanaFM'de işlem detaylarını inceleyebilirsiniz.

## Faiz Oranını Güncelle

Belirlenen Faiz Otoritesi, istediği zaman Mint Hesabı üzerindeki faiz oranını güncelleyebilir.

```javascript
// Baz puanlardaki yeni faiz oranı
const updateRate = 0;
// Mint Hesabı üzerindeki faiz oranını güncelle
transactionSignature = await updateRateInterestBearingMint(
  connection,
  payer, // İşlem ücreti ödeyeni
  mint, // Mint Hesabı Adresi
  rateAuthority, // Belirlenen Faiz Otoritesi
  updateRate, // Yeni faiz oranı
  undefined, // Ek imzacı
  undefined, // Onay seçenekleri
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID'si
);

console.log(
  "\nOranı Güncelle:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Faiz Konfigürasyon Durumunu Getir

Sonraki adımda, Mint Hesabı verilerini alarak güncellenmiş faiz oranını kontrol edelim.

```javascript
// Mint Hesabı verilerini getir
const mintAccount = await getMint(
  connection,
  mint, // Mint Hesabı Adresi
  undefined, // Opsiyonel taahhüt
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID'si
);

// Mint Hesabı için Faiz Konfigürasyonunu Al
const interestBearingMintConfig = await getInterestBearingMintConfigState(
  mintAccount, // Mint Hesabı verileri
);

console.log(
  "\nMint Konfigürasyonu:",
  JSON.stringify(interestBearingMintConfig, null, 2),
);
```

## Biriken Faizi Hesapla

Son olarak, belirli bir miktar için biriken faizi hesaplayalım. Bu hesaplama, token basımına ihtiyaç duymadan herhangi bir miktar için bağımsız olarak gerçekleştirilebilir.

```javascript
// 1 saniye bekle
sleep(1000);

// Dönüştürülecek miktar
const amount = 100;
// Biriken faiz ile birlikte miktarı UI miktarına dönüştür
const uiAmount = await amountToUiAmount(
  connection, // Solana kümesine bağlantı
  payer, // İşlem için lamportları aktaracak hesap
  mint, // Mint hesabının adresi
  amount, // Dönüştürülecek miktar
  TOKEN_2022_PROGRAM_ID, // Token Uzantı Programı ID'si
);

console.log("\nBiriken Faiz ile Miktar:", uiAmount);
```

Script'i çalıştırmak için `Çalıştır` butonuna tıklayın. Daha sonra, SolanaFM'de işlem detaylarını inceleyebilir ve Playground terminalinde kaydedilen verileri görüntüleyebilirsiniz.

:::warning
Faiz, ağın zaman damgasına dayalı olarak sürekli olarak bileşik faiz şeklinde hesaplanır. Ağ zaman damgasında oluşabilecek kayma nedeniyle, biriken faiz beklenen değerden daha düşük olabilir. Neyse ki, bu nadirdir.
:::

Aşağıdaki kesite benzer bir çıktı görmelisiniz; burada ondalık değerler biriken faizi gösterir:

```
Mint Konfigürasyonu: {
  "rateAuthority": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "initializationTimestamp": 1702321738,
  "preUpdateAverageRate": 32767,
  "lastUpdateTimestamp": 1702321740,
  "currentRate": 0
}

Biriken Faiz ile Miktar: 1.000000207670422
```

## Sonuç

`InterestBearingConfig` uzantısı, tokenlerin zamanla değer kazanmasını veya kaybetmesini sağlamak için basit bir mekanizma sunar. Geleneksel finans alanında yaygın olarak bulunan araçları sorunsuz bir şekilde entegre ederek, bu yenilik Solana'nın yeteneklerini genişleterek geleneksel finansal araçlarla blockchain dünyası arasında köprü kurmaktadır.