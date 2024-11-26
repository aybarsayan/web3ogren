---
date: 2023-12-21T00:00:00Z
seoTitle: "Token Uzantıları: Metadata Pointer ve Token Metadata"
title: Metadata Pointer uzantısını nasıl kullanılır
description:
  "Metadata Pointer uzantısı, bir Mint Hesabının
  metadata'sını saklayan hesabın adresini belirlemesine olanak tanır. Metadata
  Uzantısı ile birlikte kullanıldığında, metadata doğrudan Mint Hesabında saklanabilir."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: beginner
tags:
  - token 2022
  - token uzantıları
---

## Frequency Guidelines

:::tip
**İpucu:** Metadata Pointer uzantısı kullanıldığında, Mint Hesabınızın metadata verilerini daha etkili bir şekilde yönetebilirsiniz.
:::

Token Uzantıları Programı'ndan ve
[Token Metadata Arayüzü](https://github.com/solana-labs/solana-program-library/tree/master/token-metadata/interface)'nden önce, bir Mint Hesabına ekstra veri ekleme süreci, 
[Metaplex Metadata Programı](https://developers.metaplex.com/token-metadata) aracılığıyla bir Metadata Hesabı oluşturmayı gerektiriyordu.

`MetadataPointer` uzantısı şimdi bir Mint Hesabının ilgili Metadata Hesabının adresini belirtmesine olanak tanır. Bu esneklik, Mint Hesabının, Token Metadata Arayüzünü uygulayan bir programa ait herhangi bir hesaba işaret etmesini sağlar.

Token Uzantıları Programı doğrudan Token Metadata Arayüzünü uygular ve bu arayüz `TokenMetadata` uzantısı aracılığıyla erişilebilir hale getirilmiştir. `TokenMetadata` uzantısıyla, Mint Hesabı artık metadata'yı tutabilir.

Bu kılavuzda, `MetadataPointer` ve `TokenMetadata` uzantılarını etkinleştiren bir Mint Hesabı oluşturma yöntemini göstereceğiz. Bu yapılandırma, metadata ekleme sürecini, tüm verileri tek bir hesapta depolayarak basitleştirir. İşte [son script](https://beta.solpg.io/65964e90cffcf4b13384ceca).

---

## Token Metadata Arayüzü Genel Görünümü

[Token Metadata Arayüzü](https://github.com/solana-labs/solana-program-library/tree/master/token-metadata/interface), metadata ekleme sürecini standartlaştırmak ve basitleştirmek amacıyla tasarlanmıştır. Bu, metadata'nın işlenmesi için veri yapısını ve talimat setini tanımlar.

:::info
**Ek Bilgi:** Token Metadata Arayüzü, herhangi bir program tarafından uygulanabilir. Geliştiricilere özel Metadata Programları oluşturma esnekliği sağlar.
:::

### Metadata Arayüzü Alanları

Token Metadata Arayüzü, aşağıda ana hatlarıyla belirtilen standart bir veri alanı seti tanımlar [`TokenMetadata`](https://github.com/solana-labs/solana-program-library/blob/master/token-metadata/interface/src/state.rs#L25-L40). Ayrıca, `additional_metadata` bölümünde, anahtar-değer çiftleri olarak biçimlendirilmiş özel veri alanlarının dahil edilmesine izin verir.

```rust
pub struct TokenMetadata {
    /// Metadata güncellemesini imzalayabilen yetki
    pub update_authority: OptionalNonZeroPubkey,
    /// Belirli bir mint'e ait metadata'nın olup olmadığını belirlemek için kullanılan ilişkili mint
    pub mint: Pubkey,
    /// Token'ın daha uzun ismi
    pub name: String,
    /// Token için kısaltılmış sembol
    pub symbol: String,
    /// Daha zengin metadata'ya işaret eden URI
    pub uri: String,
    /// Token hakkında ek metadata, anahtar-değer çiftleri olarak. Program
    /// aynı anahtarı iki kez saklamaktan kaçınmalıdır.
    pub additional_metadata: Vec<(String, String)>,
}
```

### Metadata Arayüzü Talimatları

Metadata Arayüzü aşağıdaki [talimatları](https://github.com/solana-labs/solana-program-library/blob/master/token-metadata/interface/src/instruction.rs) belirtir:

- [**Initialize**](https://github.com/solana-labs/solana-program-library/blob/master/token-metadata/interface/src/instruction.rs#L97):
  Temel token metadata alanlarını (isim, sembol, URI) başlat.

- [**UpdateField**](https://github.com/solana-labs/solana-program-library/blob/master/token-metadata/interface/src/instruction.rs#L120):
  Mevcut bir token metadata alanını günceller veya mevcut değilse `additional_metadata`'ya ekler. Ekstra alan için hesabın yeniden boyutlandırılmasını gerektirir.

- [**RemoveKey**](https://github.com/solana-labs/solana-program-library/blob/master/token-metadata/interface/src/instruction.rs#L137):
  `additional_metadata` içindeki bir anahtar-değer çiftini siler. Bu talimat, gerekli isim, sembol ve URI alanları için geçerli değildir.

- [**UpdateAuthority**](https://github.com/solana-labs/solana-program-library/blob/master/token-metadata/interface/src/instruction.rs#L147):
  Token metadata'sını değiştirmek için yetkilendirilen otoriteyi günceller.

- [**Emit**](https://github.com/solana-labs/solana-program-library/blob/master/token-metadata/interface/src/instruction.rs#L162):
  Token metadata'sını `TokenMetadata` yapısının formatında yayar. Bu, hesap verilerinin farklı bir formatta saklanmasına olanak tanırken arayüz standartları ile uyumluluğu sürdürür.

---

## Başlarken

Aşağıdaki başlangıç koduyla bu Solana Playground [bağlantısını](https://beta.solpg.io/656e19acfb53fa325bfd0c46) açarak başlayın.

```javascript
// İstemci
console.log("Adresim:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

Eğer Solana Playground'u ilk kez kullanıyorsanız, öncelikle bir Playground Cüzdanı oluşturmanız ve cüzdanınızı devnet SOL ile finanse etmeniz gerekecek.

:::tip
**İpucu:** Eğer bir Playground cüzdanınız yoksa, editörde `pg.wallet.publicKey` ile ilgili tüm tanımlarda bir tip hatası görebilirsiniz. Bu tip hatası, bir Playground cüzdanı oluşturduğunuzda temizlenecektir.
:::

Devnet SOL almak için, Playground'un terminalinde `solana airdrop` komutunu çalıştırın veya bu [devnet faucet](https://faucet.solana.com/) adresini ziyaret edin.

```
solana airdrop 5
```

Playground cüzdanını oluşturup fonladığınızda, başlangıç kodunu çalıştırmak için "Çalıştır" düğmesine tıklayın.

---

## Bağımlılıkları Ekle

Hadi scriptimizi ayarlamaya başlayalım. `@solana/web3.js`, `@solana/spl-token` ve `@solana/spl-token-metadata` kütüphanelerini kullanacağız.

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
  getMintLen,
  createInitializeMetadataPointerInstruction,
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

// Playground cüzdanı
const payer = pg.wallet.keypair;

// Devnet kümesine bağlantı
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Gönderilecek işlem
let transaction: Transaction;
// Gönderilen işlemden dönen işlem imzası
let transactionSignature: string;
```

---

## Mint Ayarı

Sonraki adımda, oluşturacağımız Mint Hesabı'nın özelliklerini tanımlayın.

```javascript
// Mint Hesabı için yeni anahtar çifti oluştur
const mintKeypair = Keypair.generate();
// Mint Hesabı için adres
const mint = mintKeypair.publicKey;
// Mint Hesabı için ondalık
const decimals = 2;
// Yeni token'lar basma yetkisi
const mintAuthority = pg.wallet.publicKey;
// Metadata pointer ve token metadata'yı güncelleyebilecek yetki
const updateAuthority = pg.wallet.publicKey;

// Mint Hesabı'nda saklanacak metadata
const metaData: TokenMetadata = {
  updateAuthority: updateAuthority,
  mint: mint,
  name: "OPOS",
  symbol: "OPOS",
  uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  additionalMetadata: [["description", "Sadece Solana Üzerinde Mümkündür"]],
};
```

Daha sonra, yeni Mint Hesabı'nın boyutunu belirleyin ve kira muafiyeti için gereken minimum lamportları hesaplayın.

Aşağıdaki kod parçasında, `TokenMetadata` uzantısı için 4 byte ayırıyoruz ve daha sonra metadata'nın gerektirdiği alanı hesaplıyoruz.

```javascript
// MetadataExtension için boyut 2 byte tür, 2 byte uzunluk
const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
// Metadata boyutu
const metadataLen = pack(metaData).length;

// Uzantı ile birlikte Mint Hesabı'nın boyutu
const mintLen = getMintLen([ExtensionType.MetadataPointer]);

// Mint Hesabı için gereken minimum lamport
const lamports = await connection.getMinimumBalanceForRentExemption(
  mintLen + metadataExtension + metadataLen,
);
```

Token Uzantıları ile birlikte, Mint Hesabı'nın boyutu etkinleştirilen uzantılara bağlı olarak değişiklik gösterecektir.

---

## Talimatları Oluştur

Sonraki adımda, aşağıdakileri yapacak bir talimat seti oluşturalım:

1. Yeni bir hesap oluştur
2. `MetadataPointer` uzantısını başlat
3. Geri kalan Mint Hesabı verilerini başlat
4. `TokenMetadata` uzantısını ve token metadata'sını başlat
5. Token metadata'sını özel bir alan ile güncelle

Öncelikle, Sistem Programını çağırarak bir hesap oluşturmak için talimatı oluşturun ve Token Uzantıları Programı'na sahiplik atayın.

```js
// Yeni hesap oluşturmak için Sistem Programını çağıran talimat
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Lamportları yaratılan hesaba transfer edecek hesap
  newAccountPubkey: mint, // Oluşturulacak hesabın adresi
  space: mintLen, // Oluşturulacak hesaba tahsis edilecek byte miktarı
  lamports, // Oluşturulan hesaba transfer edilen lamport miktarı
  programId: TOKEN_2022_PROGRAM_ID, // Oluşturulan hesabın sahibi olarak atanan program
});
```

Sonraki adımda, Mint Hesabı için `MetadataPointer` uzantısını başlatacak talimatı oluşturun. Bu örnekte, metadata pointer'ı Mint adresine işaret eder; bu da metadata'nın doğrudan Mint Hesabı'nda saklanacağını gösterir.

```js
// MetadataPointer Uzantısını başlatmak için talimat
const initializeMetadataPointerInstruction =
  createInitializeMetadataPointerInstruction(
    mint, // Mint Hesabı adresi
    updateAuthority, // Metadata adresini ayarlayabilen yetki
    mint, // Metadata'yı tutan hesap adresi
    TOKEN_2022_PROGRAM_ID,
  );
```

Sonraki adımda, Mint Hesabı'nın geri kalan verilerini başlatacak talimatı oluşturun. Bu, orijinal Token Programı ile aynıdır.

```js
// Mint Hesabı verilerini başlatmak için talimat
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Hesabı Adresi
  decimals, // Mint'in Ondalık Sayısı
  mintAuthority, // Atanan Mint Yetkilisi
  null, // Opsiyonel Dondurma Yetkilisi
  TOKEN_2022_PROGRAM_ID, // Token Uzantıları Programı ID'si
);
```

Daha sonra, `TokenMetadata` uzantısını ve gerekli metadata alanlarını (isim, sembol, URI) başlatacak talimatı oluşturun.

Bu talimatta, metadata'nın Mint Hesabı'nın adresi kullanılarak `metadata` olarak atanmaz, bu da Mint'in kendisinin "Metadata Hesabı" olduğunu gösterir.

```js
// Metadata Hesabı verilerini başlatmak için talimat
const initializeMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Uzantıları Programı "Metadata Program" olarak
  metadata: mint, // Metadata'yı tutan hesap adresi
  updateAuthority: updateAuthority, // Metadata'yı güncelleyebilen yetki
  mint: mint, // Mint Hesabı adresi
  mintAuthority: mintAuthority, // Atanan Mint Yetkilisi
  name: metaData.name,
  symbol: metaData.symbol,
  uri: metaData.uri,
});
```

Daha sonra, `UpdateField` talimatını kullanarak metadata'yı özel bir alan ile güncelleyecek talimatı oluşturun.

Bu talimat, mevcut bir alanın değerini güncelleyebilir veya mevcut değilse `additional_metadata`'ya ekleyebilir. Not: Hesabı ek veri almak için daha fazla alan ayırmanız gerekebilir. Bu örnekte, hesabı oluştururken tüm kira için gerekli lamportları önceden tahsis ettik.

```js
// Metadata'yı güncellemek, özel alan eklemek için talimat
const updateFieldInstruction = createUpdateFieldInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Uzantıları Programı "Metadata Program" olarak
  metadata: mint, // Metadata'yı tutan hesap adresi
  updateAuthority: updateAuthority, // Metadata'yı güncelleyebilen yetki
  field: metaData.additionalMetadata[0][0], // anahtar
  value: metaData.additionalMetadata[0][1], // değer
});
```

---

## İşlemi Gönder

Sıradaki adımda, talimatları yeni bir işleve ekleyin ve ağına gönderin. Bu, `MetadataPointer` ve `TokenMetadata` uzantıları etkinleştirilmiş bir Mint Hesabı oluşturacak ve metadata'yı Mint Hesabı'nda depolayacaktır.

> Bazı token uzantısı talimatları, minti başlatmadan önce atomik sıraya dizilmelidir. Diğerleri ise sonrasında. Bu talimatların "dışı" yanlış sıralandığında işleminiz başarısız olabilir.

```javascript
// Yeni işleme talimatları ekleyin
transaction = new Transaction().add(
  createAccountInstruction,
  initializeMetadataPointerInstruction,
  // not: yukarıdaki talimatlar, minti başlatmadan önce gereklidir
  initializeMintInstruction,
  initializeMetadataInstruction,
  updateFieldInstruction,
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

---

## Mint Hesabından Metadata Okuma

Metadata'nın Mint Hesabı'nda depolandığını kontrol edin.

Başlangıç olarak, Mint Hesabı'nı alarak `MetadataPointer` uzantısı kısmını hesap verilerinden okuyun:

```js
// Mint bilgilerini al
const mintInfo = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

// Metadata pointer durumunu al ve kaydet
const metadataPointer = getMetadataPointerState(mintInfo);
console.log("\nMetadata Pointer:", JSON.stringify(metadataPointer, null, 2));
```

Daha sonra, hesap verilerinin metadata kısmını okuyun:

```js
// Metadata durumunu al ve kaydet
const metadata = await getTokenMetadata(
  connection,
  mint, // Mint Hesabı adresi
);
console.log("\nMetadata:", JSON.stringify(metadata, null, 2));
```

Scripti `Çalıştır` butonuna tıklayarak çalıştırın. Ardından işlem detaylarını SolanaFM'de kontrol edebilirsiniz.

Ayrıca aşağıdaki gibi bir konsol çıktısı görmelisiniz:

```
Metadata Pointer: {
  "authority": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "metadataAddress": "BFqmKEm12CrDbcFAncjL34Anu5w18LruxQrgvy7aExzV"
}

Metadata: {
  "updateAuthority": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "mint": "BFqmKEm12CrDbcFAncjL34Anu5w18LruxQrgvy7aExzV",
  "name": "OPOS",
  "symbol": "OPOS",
  "uri": "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  "additionalMetadata": [
    [
      "description",
      "Sadece Solana Üzerinde Mümkündür"
    ]
  ]
}
```

---

## Özel Alanı Kaldır

Metadata'dan özel bir alanı silmek için, Token Metadata Arayüzü'nden `RemoveKey` talimatını kullanın.

:::warning
**Önemli Uyarı:** `idempotent` bayrağı, anahtarın hesapta yoksa işlemin başarısız olup olmayacağını belirler. Eğer idempotent bayrağı `true` olarak ayarlanmışsa, talimat anahtar yoksa hata vermez.
:::

```js
// Metadata'dan bir anahtarı kaldırma talimatı
const removeKeyInstruction = createRemoveKeyInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Uzantıları Programı "Metadata Program" olarak
  metadata: mint, // Metadata'nın adresi
  updateAuthority: updateAuthority, // Metadata'yı güncelleyebilen yetki
  key: metaData.additionalMetadata[0][0], // Metadata'dan kaldırılacak anahtar
  idempotent: true, // idempotent bayrağı `true` olarak ayarlandıysa, talimat anahtar yoksa hata vermez
});

// Yeni işleme talimatı ekle
transaction = new Transaction().add(removeKeyInstruction);

// İşlemi gönder
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer],
);

console.log(
  "\nEk Metadata Alanını Kaldır:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);

// Metadata durumunu al ve kaydet
const updatedMetadata = await getTokenMetadata(
  connection,
  mint, // Mint Hesabı adresi
);
console.log("\nGüncellenmiş Metadata:", JSON.stringify(updatedMetadata, null, 2));

console.log(
  "\nMint Hesabı:",
  `https://solana.fm/address/${mint}?cluster=devnet-solana`,
);
```

Scripti `Çalıştır` butonuna tıklayarak çalıştırın. Ardından işlem detaylarını ve Mint Hesabını SolanaFM'de kontrol edebilirsiniz.

Ayrıca aşağıdaki gibi bir konsol çıktısı görmelisiniz:

```
Güncellenmiş Metadata: {
  "updateAuthority": "Ehqz1TAMboGbY5oBWqKKWmv5hhvQuwcpkaWbVjkU96cZ",
  "mint": "9wdvSnsqgYo4HFBYMtiCvVNQfFBYdzSeACjLuxVCDcjB",
  "name": "OPOS",
  "symbol": "OPOS",
  "uri": "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  "additionalMetadata": []
}
```