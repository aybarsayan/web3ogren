---
title: Kapatılabilir Mint Uzantısı
objectives:
  - Kapatılabilir bir mint oluşturmak
  - Bir mint'i kapatmak için gerekli tüm ön koşulları tanımlamak
description: "Token'lar yakıldığında kapatılabilen bir mint oluşturmak."
---

## Özeti

- Orijinal Token Programı yalnızca token hesaplarını kapatmaya izin veriyordu, ancak mint hesaplarını kapatmaya izin vermiyordu.
- Token Uzantıları Programı, mint hesaplarının kapatılmasına izin veren `close mint` uzantısını içermektedir.
- `close mint` uzantısı ile bir mint'i kapatmak için belirtilen mint'in arzı 0 olmalıdır.
- `mintCloseAuthority`, `setAuthority` çağrılarak güncellenebilir.

---

## Genel Bakış

Orijinal Token Programı, yalnızca sahiplerin token hesaplarını kapatmalarına izin verir; mint hesaplarını kapatmalarına izin vermez. Bu nedenle bir mint oluşturursanız, hesabı asla kapatamazsınız. Bu, blok zincirinde çok fazla boş alan kaybına neden olmuştur. Bu durumu düzeltmek için, Token Uzantıları Programı `close mint` uzantısını tanıttı. Bu basitçe bir mint hesabının kapatılmasına ve lamportların iade edilmesine izin verir. **Tek dezavantajı, belirtilen mint'in arzının 0 olması gerektiğidir.**

> **Not:** Bu uzantı, binlerce mint hesabı olan geliştiriciler için güzel bir iyileştirmedir ve bu hesaplar temizlenebilir ve geri ödenebilir. Ayrıca, NFT'lerini yakmak isteyen NFT sahipleri için harika bir seçenektir. Artık tüm masraflarını geri alabilecekler, yani mint'i kapatma, metadata ve token hesapları. Önceden, birisi bir NFT yaktığında yalnızca metadata ve token hesabının kira bedelini geri alırdı. Unutmayın, yakıcı aynı zamanda `mintCloseAuthority` olmak zorundadır.

`close mint` uzantısı, mint hesabına ek bir alan `mintCloseAuthority` ekler. Bu, hesabı gerçekten kapatacak yetkilinin adresidir. **Tekrar belirtmemiz gerekir ki, bu uzantı ile bir mint'in kapatılabilmesi için arzın 0 olması gerekir.** Yani bu token'dan herhangi biri mint edilmişse, önce yakılması gerekir.

### Kapatılabilir Yetkili ile Mint Oluşturma

Kapatılabilir yetkili uzantısı ile mint'i başlatmak üç talimat gerektirir:

- `SystemProgram.createAccount`
- `createInitializeMintCloseAuthorityInstruction`
- `createInitializeMintInstruction`

İlk talimat `SystemProgram.createAccount` blockchain üzerinde mint hesabı için alan ayırır. Ancak, tüm Token Uzantıları Programı mint'leri gibi, mint'in boyutunu ve maliyetini hesaplamamız gerekir. Bu, `getMintLen` ve `getMinimumBalanceForRentExemption` kullanılarak başarılabilir. Bu durumda, yalnızca `ExtensionType.MintCloseAuthority` ile `getMintLen` çağıracağız.

Mint uzunluğunu almak ve hesap oluşturma talimatını oluşturmak için aşağıdakileri yapın:

```ts
const extensions = [ExtensionType.MintCloseAuthority];
const mintLength = getMintLen(extensions);

const mintLamports =
  await connection.getMinimumBalanceForRentExemption(mintLength);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer,
  newAccountPubkey: mint,
  space: mintLength,
  lamports: mintLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

İkinci talimat `createInitializeMintCloseAuthorityInstruction`, kapatma yetkili uzantısını başlatır. Tek dikkat çekici parametre, ikinci pozisyondaki `mintCloseAuthority`dır. Bu, mint'i kapatabilecek adresidir.

```ts
const initializeMintCloseAuthorityInstruction =
  createInitializeMintCloseAuthorityInstruction(
    mint,
    authority,
    TOKEN_2022_PROGRAM_ID,
  );
```

Son talimat `createInitializeMintInstruction`, mint'i başlatır.

```ts
const initializeMintInstruction = createInitializeMintInstruction(
  mint,
  decimals,
  payer.publicKey,
  null,
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, talimatları işlemin içine ekleyip Solana ağına gönderiyoruz.

```typescript
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeMintCloseAuthorityInstruction,
  initializeMintInstruction,
);

const signature = await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

İşlem gönderildiğinde, belirtilen kapatma yetkisine sahip yeni bir mint hesabı oluşturulmuş olur.

### Kapatılabilir Yetki ile Mint'i Kapatma

`close mint` uzantısıyla bir mint'i kapatmak için, tek gereken `closeAccount` fonksiyonunu çağırmaktır.

> **Uyarı:** Unutmayın, mint hesabını kapatmak için toplam arz 0 olmalıdır. Yani herhangi bir token varsa, önce yakılmaları gerekir. Bunu `burn` fonksiyonu ile yapabilirsiniz.


  Dikkat Edilmesi Gereken Noktalar
  `closeAccount` fonksiyonu, mint'ler ve token hesapları için çalışır.


```ts
// token'ları 0'a yak
const burnSignature = await burn(
  connection, // bağlantı - Kullanılacak bağlantı
  payer, // ödeyici - İşlem ücretlerinin ödeyicisi
  sourceAccount, // hesap - Token'ların yakılacağı hesap
  mintKeypair.publicKey, // mint - Hesap için mint
  sourceKeypair, // sahip - Hesap sahibi
  sourceAccountInfo.amount, // miktar - Yakılacak miktar
  [], // çoklu İmzalar - Eğer `sahip` çok imzalıysa imza atan hesaplar
  { commitment: "finalized" }, // confirmOptions - İşlemi onaylamak için seçenekler
  TOKEN_2022_PROGRAM_ID, // programId - SPL Token program hesabı
);

// toplam arz şimdi 0 olduğu için hesap kapatılabilir
await closeAccount(
  connection, // bağlantı - Kullanılacak bağlantı
  payer, // ödeyici - İşlem ücretlerinin ödeyicisi
  mintKeypair.publicKey, // hesap - Kapatılacak hesap
  payer.publicKey, // hedef - Kapatılan hesabın kalan bakiyesini alacak hesap
  payer, // yetki - Hesabı kapatmaya yetkili
  [], // çoklu İmzalar - Eğer `yetki` çok imzalıysa imza atan hesaplar
  { commitment: "finalized" }, // confirmOptions - İşlemi onaylamak için seçenekler
  TOKEN_2022_PROGRAM_ID, // programId SPL Token program hesabı
);
```

### Kapatma Mint Yetkisini Güncelleme

`closeMintAuthority`'yı değiştirmek için `setAuthority` fonksiyonunu çağırabilir ve doğru hesapları ve `authorityType`'ı, bu durumda `AuthorityType.CloseMint` olarak geçirebilirsiniz.

```ts
/**
 * Hesaba yeni bir yetki atama
 *
 * @param connection       Kullanılacak bağlantı
 * @param payer            İşlem ücretlerinin ödeyicisi
 * @param account          Hesabın adresi
 * @param currentAuthority Belirtilen türdeki mevcut yetki
 * @param authorityType    Ayarlamak için yetki türü
 * @param newAuthority     Hesabın yeni yetkisi
 * @param multiSigners     Eğer `currentAuthority` çok imzalıysa imza atan hesaplar
 * @param confirmOptions   İşlemi onaylamak için seçenekler
 * @param programId        SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */

await setAuthority(
  connection,
  payer,
  mint,
  currentAuthority,
  AuthorityType.CloseMint,
  newAuthority,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

---

## Laboratuvar

Bu laboratuvarında, `close mint` uzantısıyla bir token mint hesabı oluşturacağız. Daha sonra bazı token'ları mint edeceğiz ve sıfırdan fazla bir arzla kapatmaya çalıştığımızda ne olacağını göreceğiz (ipuçları, kapatma işlemi başarısız olacak). Son olarak, arzı yakacağız ve hesabı kapatacağız.

### 1. Başlarken

Başlamak için, `close-mint` adlı boş bir dizin oluşturun ve bu dizine gidin. Yepyeni bir proje başlatacağız. `npm init` çalıştırın ve yönlendirmeleri takip edin.

Ardından bağımlılıklarımızı eklememiz gerekecek. Gerekli paketleri yüklemek için aşağıdakileri çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

`src` adlı bir dizin oluşturun. Bu dizinde `index.ts` adlı bir dosya oluşturun. Bu, bu uzantının kurallarına karşı kontrol yapacağımız yer. `index.ts` dosyasına aşağıdaki kodu yapıştırın:

```ts
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { initializeKeypair } from "@solana-developers/helpers";
// import { createClosableMint } from './create-mint' // - bunu sonraki aşamada yorumdan çıkarın
import {
  TOKEN_2022_PROGRAM_ID,
  burn,
  closeAccount,
  createAccount,
  getAccount,
  getMint,
  mintTo,
} from "@solana/spl-token";
import dotenv from "dotenv";
dotenv.config();

/**
 * Bir bağlantı oluşturun ve bir keypair yoksa başlatın.
 * Bir keypair mevcutsa, gerekiyorsa SOL airdrop edin.
 */
const connection = new Connection("http://127.0.0.1:8899");
const payer = await initializeKeypair(connection);

console.log(`public key: ${payer.publicKey.toBase58()}`);

const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
console.log("\nmint public key: " + mintKeypair.publicKey.toBase58() + "\n\n");

// KAPATILABİLİR YETKİ İLE MINT OLUŞTURMA

// TOKEN MİNT ETME

// ARZI DOĞRULAMA

// SIFIRDAN FAZLA ARZLA KAPATMAYA ÇALIŞMA

// ARZI YAKMA

// MINT'İ KAPATMA
```

`index.ts`, belirtilen geçerlilik düğümüne bir bağlantı oluşturur ve `initializeKeypair`'ı çağırır. Bu noktada, yazdıktan sonra scriptimizin geri kalanını çağıracak yer burasıdır.

Devam edin ve scripti çalıştırın. Terminalinizde `payer` ve `mint` public anahtarlarının yazdırıldığını görmelisiniz.

```bash
esrun src/index.ts
```

`initializeKeypair`'da airdrop ile ilgili bir hata alırsanız, bir sonraki adıma geçin.

#### 2. Geçerlilik Düğümünü Çalıştırma

Bu kılavuz için kendi geçerlilik düğümümüzü çalıştıracağız.

Ayrı bir terminalde, aşağıdaki komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştıracak ve bazı anahtarlar ve değerler de yazdıracaktır. Bağlantımızda kullanmamız gereken değer JSON RPC URL'sidir; bu durumda `http://127.0.0.1:8899`'dur. Ardından, bunu bağlantıda yerel RPC URL'sini kullanmak üzere belirtmek için kullanıyoruz.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Alternatif olarak, testnet veya devnet kullanmak isterseniz, `@solana/web3.js`'den `clusterApiUrl`'ı içe aktarabilir ve bağlantıya bunu geçirebilirsiniz:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

Devnet kullanmaya karar verirseniz ve SOL airdrop etmeye çalışırken sorun yaşıyorsanız, `initializeKeypair`'a `keypairPath` parametresini eklemeyi düşünebilirsiniz. Bunu terminalinizde `solana config get` komutu çalıştırarak alabilirsiniz. Ardından [faucet.solana.com](https://faucet.solana.com/) adresine gidip adresinize biraz SOL airdrop edebilirsiniz. Adresinizi almanın bir yolu, terminalinizde `solana address` komutunu çalıştırmaktır.

Örneğin, `keypairPath`'ın `/home/.config/solana/id.json` olduğu varsayılarak:

```typescript
const payer = initializeKeypair(connection, {
  keypairPath: "/home/.config/solana/id.json",
});
```

### 3. Kapatma Yetkisi ile Mint Oluşturma

Kapatılabilir bir mint oluşturmak için, `src/create-mint.ts` adlı yeni bir dosyada `createClosableMint` fonksiyonunu yazalım.

Kapatılabilir bir mint oluşturmak için birkaç talimat gerekmektedir:

- `getMintLen`: Mint hesabı için gereken alanı alır
- `SystemProgram.getMinimumBalanceForRentExemption`: Mint hesabı için kira bedelini bize söyler
- `SystemProgram.createAccount`: Solana üzerinde mint hesabı için alan ayırma talimatını oluşturur
- `createInitializeMintCloseAuthorityInstruction`: Kapatma mint uzantısını başlatmak için talimat oluşturur - bu, `closeMintAuthority`'yi parametre olarak alır.
- `createInitializeMintInstruction`: Mint'i başlatmak için talimat oluşturur
- `sendAndConfirmTransaction`: İşlemi blockchain'e gönderir

Tüm bu fonksiyonları sırayla çağıracağız. Ancak, öncelikle `createClosableMint` fonksiyonumuzun girdilerini tanımlayalım:

- `connection: Connection` : Bağlantı nesnesi
- `payer: Keypair` : İşlem ücreti için ödeyici
- `mintKeypair: Keypair` : Yeni mint için keypair
- `decimals: number` : Mint ondalık sayısı

Hepsini bir araya getirince elde ettiğimiz:

```ts
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintCloseAuthorityInstruction,
} from "@solana/spl-token";

export async function createClosableMint(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
): Promise<TransactionSignature> {
  const extensions = [ExtensionType.MintCloseAuthority];
  const mintLength = getMintLen(extensions);

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(mintLength);

  console.log("Kapatma mint talimatıyla işlem oluşturuluyor...");
  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMintCloseAuthorityInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  console.log("İşlem gönderiliyor...");
  const signature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    { commitment: "finalized" },
  );

  return signature;
}
```

Şimdi `src/index.ts`'de bu fonksiyonu çağıralım. Önce yeni fonksiyonumuzu 3. satırı yorumdan çıkararak içe aktarmanız gerekecek.

```ts
import { createClosableMint } from "./create-mint";
```

Sonra, doğru yorum bölümünün altına aşağıdaki kodu yapıştırın:

```ts
// KAPATILABİLİR YETKİ İLE MINT OLUŞTURMA
const decimals = 9;

await createClosableMint(connection, payer, mintKeypair, decimals);
```

Bu, kapatma mint talimatıyla bir işlem oluşturacaktır.

Bunu çalıştırın ve her şeyin düzgün çalıştığını kontrol edin:

```bash
esrun src/index.ts
```

### 4. Minti Kapatma

Mint'i kapatacağız, ancak önce sıfır arz varken kapatma işlemi gerçekleştirdiğimizde ne olacağını inceleyelim (ipuçları, başarısız olacak).

Bunu yapmak için, bazı token'lar mint edeceğiz, kapatmaya çalışacağız, ardından token'ları yakacağız ve ardından gerçekten kapatacağız.

#### 4.1 Token Mint Etme

`src/index.ts`'de bir hesap oluşturun ve bu hesaba 1 token mint edin.

Bunu `createAccount` ve `mintTo` fonksiyonlarını çağırarak gerçekleştirebiliriz:

```ts
// TOKEN MİNT ETME
/**
 * Bir hesap oluşturma ve bu hesaba 1 token mint etme
 */
console.log("Bir hesap oluşturuluyor...");
const sourceKeypair = Keypair.generate();
const sourceAccount = await createAccount(
  connection,
  payer,
  mint,
  sourceKeypair.publicKey,
  undefined,
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);

console.log("1 token mint ediliyor...\n\n");
const amount = 1 * LAMPORTS_PER_SOL;
await mintTo(
  connection,
  payer,
  mint,
  sourceAccount,
  payer,
  amount,
  [payer],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
```

Artık mint arzının sıfırdan fazla olduğunu doğrulayabiliriz. Mint bilgilerini almak için aşağıdaki kod bloğunu mint etme fonksiyonlarının altına ekleyin:

```ts
// ARZI DOĞRULAMA
/**
 * Arzı doğrulamak için mint bilgilerini al
 */
let mintInfo = await getMint(
  connection,
  mintKeypair.publicKey,
  "finalized",
  TOKEN_2022_PROGRAM_ID,
);
console.log("Başlangıç arzı: ", mintInfo.supply);
```

Scripti çalıştırın ve başlangıç arzını kontrol edin:

```bash
esrun src/index.ts
```

Terminalinizde şunu görmelisiniz:

```bash
Başlangıç arzı:  1000000000n
```

#### 4.2 Sıfırdan Fazla Arzla Mint'i Kapatma

Artık arzın sıfırdan fazla olduğu bir durumda mint'i kapatmaya çalışacağız. Bunun başarısız olacağını biliyoruz çünkü `close mint` uzantısı sıfırdan fazla bir arz gerektirir. Böylece oluşan hata mesajını görebilmek için `closeAccount` fonksiyonunu bir try-catch bloğu içinde saracağız ve hatayı yazdıracağız:

```ts
// SIFIRDAN FAZLA ARZLA KAPATMAYA ÇALIŞMA
/**
 * Arz sıfır değilken mint hesabını kapatmaya çalış
 *
 * `SendTransactionError` atması gerekir
 */
try {
  await closeAccount(
    connection,
    payer,
    mintKeypair.publicKey,
    payer.publicKey,
    payer,
    [],
    { commitment: "finalized" },
    TOKEN_2022_PROGRAM_ID,
  );
} catch (e) {
  console.log(
    "Hesap kapatma burada başarısız oluyor çünkü arz sıfır değil. Program günlüklerini kontrol edin:",
    (e as any).logs,
    "\n\n",
  );
}
```

Bunu çalıştırın:

```bash
esrun src/index.ts
```

Programın bir hata fırlattığını ve program günlükleri ile birlikte olduğunu göreceğiz. Şunu görmelisiniz:

```bash
Hesap kapatma burada başarısız oluyor çünkü arz sıfır değil.
```

#### 4.3 Arzı Yakma

Arzı yakarak bir mint'i gerçekten kapatabiliriz. Bunu `burn` fonksiyonunu çağırarak yaparız:

```ts
// ARZI YAKMA
const sourceAccountInfo = await getAccount(
  connection,
  sourceAccount,
  "finalized",
  TOKEN_2022_PROGRAM_ID,
);

console.log("Arz yakılıyor...");
const burnSignature = await burn(
  connection,
  payer,
  sourceAccount,
  mintKeypair.publicKey,
  sourceKeypair,
  sourceAccountInfo.amount,
  [],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
```

#### 4.4 Mint'i Kapatma

Piyasada herhangi bir token olmadığında mint'i kapatabiliriz. Bu noktada, `closeAccount` çağırabiliriz; ancak bu süreçte nasıl çalıştığını görselleştirmek açısından aşağıdakileri gerçekleştirebiliriz:

- Mint Bilgilerini Alma: Öncelikle, mint'in ayrıntılarını alır ve inceleriz; özellikle bu aşamada, arzın sıfır olması gerektiğini kontrol ederiz. Bu, mint'in kapatılmaya uygun olduğunu gösterir.

- Hesap Durumunu Doğrulama: Sonunda, hesabın hala açık ve aktif olduğundan emin olmak için durumunu doğrularız.

- Hesabı Kapatma: Hesabın açık durumunu doğruladıktan sonra, mint hesabını kapatmaya geçeriz.

- Kapatmayı Onaylama: Son olarak, `closeAccount` fonksiyonunu çağırdıktan sonra, hesabın gerçekten başarılı bir şekilde kapatıldığına dair bir kez daha durum kontrolü yaparız.

Bunların hepsini aşağıdaki fonksiyonlarla gerçekleştirebiliriz:

- `getMint`: Mint hesabını alır ve bilgileri serileştirir
- `getAccountInfo`: Mint hesabını alır, böylece var olup olmadığını kontrol edebiliriz - bunu kapatmadan önce ve sonra çağıracağız.
- `closeAccount`: Mint'i kapatır

Bunu bir araya getirdiğimizde:

```ts
// MINT'İ KAPATMA
mintInfo = await getMint(
  connection,
  mintKeypair.publicKey,
  "finalized",
  TOKEN_2022_PROGRAM_ID,
);

console.log("Yakıldıktan sonra arz: ", mintInfo.supply);

const accountInfoBeforeClose = await connection.getAccountInfo(
  mintKeypair.publicKey,
  "finalized",
);

console.log("Hesap kapatıldı mı? ", accountInfoBeforeClose === null);

console.log("Arz yakıldıktan sonra hesabı kapatmayı deniyoruz...");
const closeSignature = await closeAccount(
  connection,
  payer,
  mintKeypair.publicKey,
  payer.publicKey,
  payer,
  [],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);

const accountInfoAfterClose = await connection.getAccountInfo(
  mintKeypair.publicKey,
  "finalized",
);

console.log("Hesap kapatıldı mı? ", accountInfoAfterClose === null);
```

Scripti son bir kez çalıştırın.

```bash
esrun src/index.ts
```

Kapatılabilir mint oluşturma, token mint etme, kapatmaya çalışma, token'ı yakma ve nihayetinde hesabı kapatma süreçlerini başarıyla görmelisiniz.

Hepsi bu kadar! Kapatma yetkisine sahip bir mint oluşturmayı başarıyla gerçekleştirdik. Herhangi bir noktada takılırsanız, [bu repoda](https://github.com/Unboxed-Software/solana-lab-close-mint-account/tree/solution) çalışan kodu `solution` dalında bulabilirsiniz.

## Mücadele

Mücadele için, kendi mint'inizi oluşturmaya ve birkaç token hesabına mint yapmaya çalışın; ardından tüm bu token hesaplarını yakacak ve ardından mint'i kapatmak için bir script oluşturun.