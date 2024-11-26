---
title: Gerekli Memo
objectives:
  - Transfer sırasında gerekli memo ile bir token hesabı oluşturun
  - Memo ile transfer
  - Memo olmadan transfer
  - Gerekli memo'yu devre dışı bırak
description: "Her transferde kısa bir not gerektiren bir token oluşturun."
---

## Özeti

- `gerekli memo` uzantısı, geliştiricilerin bir token hesabına gelen tüm transferlerin bir memo içermesini zorunlu kılmasına olanak tanır; bu, işlem izleme ve kullanıcı tanımlama için geliştirilmiş bir kolaylık sağlar.
- Memo olmadan bir transfer başlatıldığında, işlem başarısız olacaktır.
- `gerekli memo` uzantısı, `disableRequiredMemoTransfers` çağrısı ile devre dışı bırakılabilir.

## Genel Bakış

Borsa veya finans hizmetleri gibi belirli uygulamalarda, bir işlemin amacı veya kaynağını izlemek kritik öneme sahiptir. `gerekli memo` uzantısı, bir token hesabına gelen her transfer için bir memo'nun gerekli olduğunu belirtir. Bu gereklilik, her işlemi ek bilgilerle birlikte sunar; bu bilgiler uyumluluk, denetleme veya kullanıcıya spesifik amaçlar için kullanılabilir. Eğer sıkı izleme ihtiyacı azalırsa, gereklilik, memoların isteğe bağlı hale getirilmesi için ayarlanabilir; bu, işlemlerin nasıl ele alındığı ve kaydedildiği konusunda esneklik sağlar.

:::info
Bu, bir token hesabı uzantısı olduğunu belirtmek önemlidir, mint uzantısı değildir.
:::

Bu, bireysel token hesaplarının bu özelliği etkinleştirmesi gerektiği anlamına gelir. Ve tüm uzantılar gibi, bu yalnızca Token Extensions Program token'larıyla çalışacaktır.

### Gerekli memo ile token oluşturma

Gerekli memo ile bir token hesabı başlatmak, üç talimat gerektirir:

- `SystemProgram.createAccount`
- `initializeAccountInstruction`
- `createEnableRequiredMemoTransfersInstruction`

İlk talimat olan `SystemProgram.createAccount`, token hesabı için blockchain üzerinde alan tahsis eder. Bu talimat üç şeyi gerçekleştirir:

- `space` tahsis eder
- Kiralama için `lamports` aktarır
- Sahip programına atar

```tsx
const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccountKeypair.publicKey,
  space: accountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

İkinci talimat olan `createInitializeAccountInstruction`, hesap talimatını başlatır.

```tsx
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccountKeypair.publicKey,
  mint,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Üçüncü talimat olan `createEnableRequiredMemoTransfersInstruction`, gerekli memo ile token hesabını başlatır.

```tsx
const enableRequiredMemoTransfersInstruction =
  createEnableRequiredMemoTransfersInstruction(
    tokenAccountKeypair.publicKey,
    payer.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
```

Bu üç talimatla işlem gönderildiğinde, gerekli memo uzantısına sahip yeni bir token hesabı oluşturulur.

```tsx
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeAccountInstruction,
  enableRequiredMemoTransfersInstruction,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, tokenAccountKeypair], // İmzacılar
);
```

### Gerekli memo ile transfer

Gerekli memo talimatı etkinleştirilmiş bir token hesabına transfer yaparken, önce aynı işlem içinde bir memo göndermeniz gerekir. Bunu yapmak için Memo programını aramak üzere bir memo talimatı oluşturuyoruz. Ardından, transfer talimatımızı ekliyoruz.

```ts
const message = "Merhaba, Solana";

const transaction = new Transaction().add(
  new TransactionInstruction({
    keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
    data: Buffer.from(message, "utf-8"), // Memo mesajı. Bu durumda "Merhaba, Solana"
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"), // Anahtarları ve memo mesajını doğrulayan Memo programı
  }),
  createTransferInstruction(
    ourTokenAccount,
    otherTokenAccount, // Gerekli memo'ya sahip
    payer.publicKey,
    amountToTransfer,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  ),
);
await sendAndConfirmTransaction(connection, transaction, [payer]);
```

### Gerekli memo'yu devre dışı bırakma

Gerekli memo uzantısı, token hesabını değiştirme yetkiniz varsa devre dışı bırakılabilir. Bunun için, sadece `disableRequiredMemoTransfers` fonksiyonunu çağırın ve gerekli argümanları geçirin.

```tsx
/**
 * Belirtilen hesapta memo transferlerini devre dışı bırak
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerini ödeyen
 * @param account        Değiştirilecek hesap
 * @param owner          Hesabın sahibi
 * @param multiSigners   Eğer `owner` çoklu imzalıysa imzalayan hesaplar
 * @param confirmOptions İşlemi onaylamak için seçenekler
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanan işlemin imzası
 */
await disableRequiredMemoTransfers(
  connection,
  payer,
  otherTokenAccount,
  payer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Laboratuvar

Bu laboratuvarda, gerekli memo uzantısına sahip bir token hesabı oluşturacağız. Ardından, uzantının istenildiği gibi çalışıp çalışmadığını kontrol etmek için testler yazacağız ve memo ile ve memosuz fund transfer etmeyi deneyeceğiz.

#### 1. Ortamı Ayarlama

Başlamak için, `required-memo` adında boş bir dizin oluşturun ve oraya gidin. Yepyeni bir proje başlatacağız. `npm init` komutunu çalıştırın ve istemleri takip edin.

Sonrasında, bağımlılıklarımızı eklememiz gerekecek. Gerekli paketleri yüklemek için aşağıdakileri çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

`src` adında bir dizin oluşturun. Bu dizinde `index.ts` adında bir dosya oluşturun. Bu dosyada bu uzantının kurallarına göre kontroller yapacağız. `index.ts` dosyasına aşağıdaki kodu yapıştırın:

```ts
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  mintTo,
  createTransferInstruction,
  createMint,
  disableRequiredMemoTransfers,
  enableRequiredMemoTransfers,
} from "@solana/spl-token";
import {
  sendAndConfirmTransaction,
  Connection,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
// import { createTokenWithMemoExtension } from "./token-helper"; // Bunu daha sonra yorumdan çıkaracağız
import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

require("dotenv").config();

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);
const mintDecimals = 9;

const [ourTokenAccountKeypair, otherTokenAccountKeypair] = makeKeypairs(2);
const ourTokenAccount = ourTokenAccountKeypair.publicKey;
const otherTokenAccount = otherTokenAccountKeypair.publicKey;

const amountToMint = 1000;
const amountToTransfer = 300;

// MİNT OLUŞTUR

// TOKEN OLUŞTUR

// TOKEN MİNT ET

// MEMO OLMADAN TRANSFER DENEMESİ

// MEMO İLE TRANSFER DENEMESİ

// MEMO UZANTISINI DEVRE DIŞI BIRAKARAK TRANSFER ET
```

#### 2. Doğrulayıcı düğüm çalıştırma

Bu kılavuz için, kendi doğrulayıcı düğümümüzü çalıştıracağız.

Farklı bir terminalde, aşağıdaki komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştıracak ve bazı anahtarlar ve değerler de günlüğe kaydedilecektir. Bağlantımızda kullanmamız gereken değer JSON RPC URL'sidir; bu durumda `http://127.0.0.1:8899`'dur. Bunu bağlantıda yerel RPC URL'sini belirtmek için kullanıyoruz.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Alternatif olarak, testnet veya devnet kullanmak istiyorsanız, `@solana/web3.js`'den `clusterApiUrl`'i içe aktarın ve bağlantıya aşağıdaki gibi geçirin:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

#### 3. Yardımcılar

Daha önce `index.ts` kodunu yapıştırdığımızda, `@solana-developers/helpers` paketinden sağlanan ve bazı başlangıç değişkenlerini içeren yardımcıları ekledik.

- `initializeKeypair`: Bu fonksiyon `payer` için bir anahtar çifti oluşturur ve ayrıca buna 1 testnet SOL airdrop'u yapar
- `makeKeypairs`: Bu fonksiyon airdrop olmadan anahtar çiftleri oluşturur

#### 4. Mint’i oluşturma

Öncelikle, `gerekli memo` uzantısı bir token uzantısı olduğundan, mint ile ilgili herhangi bir karmaşıklık yapmamıza gerek yoktur. Tek yapmamız gereken, bir Token Extensions Program mint'i olmaktır. Bu nedenle, `createMint` fonksiyonunu kullanarak yalnızca bir tane oluşturacağız.

Bunu `src/index.ts` içinde yapalım:

```tsx
// MİNT OLUŞTUR
const mint = await createMint(
  connection,
  payer,
  payer.publicKey,
  null,
  mintDecimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 5. Gerekli memo ile Token Hesabı oluşturma

Yeni bir dosya olan `src/token-helper.ts` oluşturalım ve içinde `createTokenWithMemoExtension` adında yeni bir fonksiyon oluşturalım. Adından da anlaşılacağı üzere, bu fonksiyonu gerekli memo uzantısı etkinleştirilmiş token hesaplarımızı oluşturmak için kullanacağız. Fonksiyon aşağıdaki argümanları alacak:

- `connection`: Bağlantı nesnesi
- `mint`: Yeni mint için halka anahtarı
- `payer`: İşlem için ödeyen
- `tokenAccountKeypair`: Token hesabı ile ilişkilendirilmiş token hesabı anahtar çifti

```ts
import {
  TOKEN_2022_PROGRAM_ID,
  getAccountLen,
  ExtensionType,
  createInitializeAccountInstruction,
  createEnableRequiredMemoTransfersInstruction,
} from "@solana/spl-token";
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  Transaction,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

export async function createTokenWithMemoExtension(
  connection: Connection,
  payer: Keypair,
  tokenAccountKeypair: Keypair,
  mint: PublicKey,
): Promise<string> {
  // HESAP OLUŞTURMA TALİMATI

  // HESABI BAŞLATMA TALİMATI OLUŞTUR

  // GEREKEN MEMO TRANSFERİNİ ETKİNLEŞTİRME TALİMATI OLUŞTUR

  // İŞLEMİ GÖNDERİP ONAYLA

  return await "TODO FONKSİYONU TAMAMLA";
}
```

Kodumuzu eklemeye başlayalım.

Token hesabı oluşturmanın ilk adımı, `SystemProgram.createAccount` yöntemini kullanarak Solana üzerinde alan ayırmaktır:

```tsx
// HESAP OLUŞTURMA TALİMATI
const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccountKeypair.publicKey,
  space: accountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

Şimdi token hesabını başlatmamız gerekecek. Bu talimatı oluşturmak için `createInitializeAccountInstruction` fonksiyonunu arıyoruz ve gerekli argümanları geçiriyoruz. Bu işlev SPL Token paketince sağlanır ve yeni bir token hesabını başlatan bir işlem talimatı oluşturur.

```tsx
// HESABI BAŞLATMA TALİMATI OLUŞTUR
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccountKeypair.publicKey,
  mint,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Son ihtiyacımız olan talimat, gerekli memoyu etkinleştiren talimat. Bunu `createEnableRequiredMemoTransfersInstruction` fonksiyonunu arayarak elde ediyoruz. Gerekli memolar etkinleştirildiğinde, hesaba yapılan herhangi bir token transferinin bir memo içermesi gerekmektedir.

```tsx
// GEREKEN MEMO TRANSFERİNİ ETKİNLEŞTİRME TALİMATI OLUŞTUR
const enableRequiredMemoTransfersInstruction =
  createEnableRequiredMemoTransfersInstruction(
    tokenAccountKeypair.publicKey,
    payer.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
```

Son olarak, tüm talimatları bir işleme ekleyip, blockchain'e gönderelim ve imzayı döndürelim.

```tsx
// İŞLEMİ GÖNDERİP ONAYLA
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeAccountInstruction,
  enableRequiredMemoTransfersInstruction,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, tokenAccountKeypair], // İmzacılar
);

return transactionSignature;
```

`index.ts`'e geri dönelim ve `ourTokenAccountKeypair` ve `otherTokenAccountKeypair` adlı iki yeni token hesabı oluşturalım, yeni oluşturduğumuz fonksiyonu kullanarak.

```typescript
// TOKEN OLUŞTUR
await createTokenWithMemoExtension(
  connection,
  payer,
  ourTokenAccountKeypair,
  mint,
);

await createTokenWithMemoExtension(
  connection,
  payer,
  otherTokenAccountKeypair,
  mint,
);
```

Son olarak, `ourTokenAccountKeypair`'e başlangıç token'ları mint etmek için `mintTo` çağırıyoruz:

```ts
// TOKEN MİNT ET
await mintTo(
  connection,
  payer,
  mint,
  ourTokenAccount,
  payer,
  amountToMint,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

:::warning
Not: `gerekli memo` uzantısının, mint işlemi sırasında değil, transfer sırasında memo gerektirdiğini unutmayın.
:::

#### 6. Testler

Artık `gerekli memo` talimatına sahip bazı hesaplar oluşturduğumuza göre, bunların nasıl çalıştığını görmek için bazı testler yazalım.

Toplamda 3 test yazacağız:

1. Memo olmadan transfer
2. Memo ile transfer
3. Gerekli memo uzantısını devre dışı bırakma ve memo olmadan transfer

#### 6.1 Memo olmadan transfer

Bu ilk test, `ourTokenAccount`'dan `otherTokenAccount`'a token transfer etmeyi deneyecektir. Bu testin başarısız olması beklenir çünkü işlemle birlikte hiçbir memo eklenmemiştir.

```tsx
// MEMO OLMADAN TRANSFER DENEMESİ
try {
  const transaction = new Transaction().add(
    createTransferInstruction(
      ourTokenAccount,
      otherTokenAccount,
      payer.publicKey,
      amountToTransfer,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  await sendAndConfirmTransaction(connection, transaction, [payer]);

  console.error("Memo olmadan transfer yapamamanız gerekir.");
} catch (error) {
  console.log(
    `✅ - Bu işlemin başarısız olmasını bekliyorduk çünkü transferle birlikte bir memo göndermelisiniz.`,
  );
}
```

Bu testi çalıştırdığınızda, terminalde aşağıdaki hatanın günlüğe kaydedilmesini göreceksiniz; bu, uzantının beklendiği gibi çalıştığını gösterir:
`✅ - Bu işlemin başarısız olmasını bekliyorduk çünkü transferle birlikte bir memo göndermelisiniz.`

```bash
npx esrun src/index.ts
```

#### 6.2 Memo ile transfer testi

Bu test, bir memo ile token transfer etmeyi deneyecektir. Bu testin başarılı olması beklenmektedir. İlk talimata özel dikkat gösterin - Bu, işlemin memo talimatını eklediği kısımdır:

```tsx
// MEMO İLE TRANSFER DENEMESİ
const message = "Merhaba, Solana";

const transaction = new Transaction().add(
  new TransactionInstruction({
    keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
    data: Buffer.from(message, "utf-8"), // Memo mesajı. Bu durumda "Merhaba, Solana"
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"), // Anahtarları ve memo mesajını doğrulayan Memo programı
  }),

  createTransferInstruction(
    ourTokenAccount,
    otherTokenAccount,
    payer.publicKey,
    amountToTransfer,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  ),
);
await sendAndConfirmTransaction(connection, transaction, [payer]);

const accountAfterMemoTransfer = await getAccount(
  connection,
  otherTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - Memo ile ${accountAfterMemoTransfer.amount} token'ı ${otherTokenAccount} adresine transfer ettik: ${message}`,
);
```

Bu testi çalıştırın ve geçmesini bekleyin:

```bash
npx esrun src/index.ts
```

#### 6.3 Devre dışı bırakılmış memo ile transfer testi

Son testimizde, `otherTokenAccount` üzerindeki `gerekli memo` uzantısını devre dışı bırakacağız ve ona memo olmadan bazı token'lar göndereceğiz. Bunun başarılı olmasını bekliyoruz.

```tsx
// MEMO UZANTISINI DEVRE DIŞI BIRAKARAK TRANSFER ET
await disableRequiredMemoTransfers(
  connection,
  payer,
  otherTokenAccount,
  payer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// otherTokenAccount'a token'ları transfer et
const transfer = new Transaction().add(
  createTransferInstruction(
    ourTokenAccount,
    otherTokenAccount,
    payer.publicKey,
    amountToTransfer,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  ),
);

await sendAndConfirmTransaction(connection, transfer, [payer]);

const accountAfterDisable = await getAccount(
  connection,
  otherTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// Var olduğunu göstermek için memo transferlerini yeniden etkinleştirin
await enableRequiredMemoTransfers(
  connection,
  payer,
  otherTokenAccount,
  payer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - Memo olmadan ${accountAfterDisable.amount} token'ı ${otherTokenAccount} adresine transfer ettik.`,
);
```

Testleri çalıştırdığınızda, `otherTokenAccount`'ın artık 600 token'a sahip olduğunu göreceksiniz; bu, uzantı devre dışı bırakıldıktan sonra başarılı bir şekilde transfer edildiğini gösterir.

```bash
npx esrun src/index.ts
```

Tebrikler! Gerekli memo uzantısını test etmiş olduk!

## Zorluk

Kendi token hesabınızı gerekli memo ile oluşturun.