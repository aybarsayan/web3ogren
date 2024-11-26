---
title: Varsayılan Hesap Durumu
objectives:
  - Varsayılan hesap durumu dondurulmuş olan mint hesabı oluştur
  - Varsayılan hesap durumunun kullanım senaryolarını açıkla
  - Uzantının kurallarıyla deneme yap
description:
  "Kullanmak için belirli bir hizmetle etkileşim gerektiren token oluştur."
---

## Özet

- `varsayılan durum` uzantısı, geliştiricilerin bu uzantıya sahip yeni token hesaplarını varsayılan olarak dondurulmuş hale getirmelerine olanak tanır; bu, token'ları çözmek ve kullanmak için belirli bir hizmetle etkileşim gerektirir.
- Token hesaplarının **üç durumu** vardır:
  - **Başlatıldı**
  - **Başlatılmamış**
  - **Dondurulmuş**
  
  Bu durumlar, bir token hesabı ile nasıl etkileşim kurulacağını belirler.
- Bir token hesabı **dondurulduğunda**, bakiyesi değişmez.
- `freezeAuthority`, bir token hesabını dondurmak ve çözmek için **tek adrestir**.
- `varsayılan durum`, `updateDefaultAccountState` kullanılarak güncellenebilir.
- Lab, `varsayılan durum` uzantısı ile bir mint oluşturma ve oluşturulurken dondurulmuş duruma ayarlanan yeni bir token hesabı oluşturmayı gösterir. Lab, uzantının hem **dondurulmuş** hem de **çözülmüş** durumlarda token basma ve transfer etme işlevlerini yerine getirdiğinden emin olmak için testler içerir.

## Genel Bakış

`varsayılan durum` uzantısı, geliştiricilerin tüm yeni token hesaplarının "Başlatıldı" veya "Dondurulmuş" durumlardan birinde olmasını zorlamalarına olanak tanır. Bu uzantı ile oluşturulan herhangi bir yeni token hesabı varsayılan olarak dondurulabilir. Bir token hesabı dondurulduğunda, bakiyesi değişemez. Yani, token basılamaz, transfer edilemez veya yakılamaz. **Sadece** `freezeAuthority`, bir dondurulmuş hesabı çözebilir.

`Kendinizi Solana oyun geliştiricisi olarak hayal edin ve oyununuzun yalnızca oyuncularının oyun içi token'ınızla etkileşimde bulunmasını istiyorsunuz.` Oyuncunun token hesabını çözmek ve diğer oyuncularla oynamasına ve ticaret yapmasına izin vermek için oyuna kaydolması üzerinden yürütülen bir süreç oluşturabilirsiniz. Bu, tüm yeni token hesaplarının dondurulmuş olarak ayarlandığı `varsayılan durum` uzantısı sayesinde mümkün olmaktadır.

:::note
Etkileşim gerektiren token hesapları ile ilgili kurallar her zaman dikkatlice gözden geçirilmelidir.
:::

### Durum Türleri

Varsayılan hesap durumu uzantısıyla birlikte **3 tür durum** vardır:

- **Başlatılmamış**: Bu durum, token hesabının oluşturulmuş ancak Token Programı aracılığıyla henüz başlatılmamış olduğunu gösterir.
- **Başlatılmış**: Başlatılmış durumda bir hesap, Token Programı aracılığıyla doğru bir şekilde kurulan bir hesaptır. Bu, belirli bir mint ve atanmış bir sahip olduğu anlamına gelir.
- **Dondurulmuş**: Dondurulmuş bir hesap, belirli işlemleri, özellikle de token transferi ve basımı yapma yetkisi geçici olarak kaldırılmış bir hesap anlamına gelir.

```ts
/** Program tarafından saklanan token hesap durumu */
export enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}
```

Ancak `varsayılan durum` yalnızca son iki durumla ilgilidir: `Başlatılmış` ve `Dondurulmuş`. Bir hesabı dondurduğunuzda, durum `Dondurulmuş`; çözdüğünüzde ise `Başlatılmış` olur.

---

### Varsayılan Hesap Durumu Ekleme

Bir transfer ücretiyle mint başlatmak, **üç talimat** gerektirir:

1. `SystemProgram.createAccount`
2. `createInitializeTransferFeeConfigInstruction`
3. `createInitializeMintInstruction`

#### İlk Talimat

İlk talimat `SystemProgram.createAccount`, mint hesabı için blok zincirinde alan tahsis eder. Bu talimat üç şeyi gerçekleştirir:

- `alan` ayırır
- Kiralama için `lamports` aktarır
- Sahip programına atar

Mint hesabının boyutunu almak için `getMintLen` çağrılır ve alan için gerekli lamports almak için `getMinimumBalanceForRentExemption` çağrılır.

```typescript
const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
// Mint Hesabı için gereken minimum lamports
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mintKeypair.publicKey,
  space: mintLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

#### İkinci Talimat

İkincil talimat `createInitializeDefaultAccountStateInstruction`, varsayılan hesap durumu uzantısını başlatır.

```typescript
const initializeDefaultAccountStateInstruction =
  createInitializeDefaultAccountStateInstruction(
    mintKeypair.publicKey, // Mint
    defaultState, // Varsayılan Durum
    TOKEN_2022_PROGRAM_ID,
  );
```

#### Üçüncü Talimat

Üçüncü talimat `createInitializeMintInstruction`, minti başlatır.

```typescript
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, tüm bu talimatları bir işlem içine ekleyip blok zincirine gönderin.

```ts
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeDefaultAccountStateInstruction,
  initializeMintInstruction,
);

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mintKeypair,
]);
```

### Varsayılan Hesap Durumunu Güncelleme

Varsayılan hesap durumunu, bunu yapma yetkisine sahipseniz her zaman değiştirebilirsiniz. Bunu yapmak için `updateDefaultAccountState` çağrısını yapmanız yeterlidir.

```ts
/**
 * Bir mintte varsayılan hesap durumunu güncelle
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerini ödeyen
 * @param mint           Değiştirilecek mint
 * @param state          Oluşturulan hesaplara ayarlanan yeni hesap durumu
 * @param freezeAuthority Dondurma yetkisi
 * @param multiSigners   Eğer `freezeAuthority` çok imzalıysa imzalayan hesaplar
 * @param confirmOptions İşlemi onaylamak için seçenekler
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */
export async function updateDefaultAccountState(
  connection: Connection,
  payer: Signer,
  mint: PublicKey,
  state: AccountState,
  freezeAuthority: Signer | PublicKey,
  multiSigners: Signer[] = [],
  confirmOptions?: ConfirmOptions,
  programId = TOKEN_2022_PROGRAM_ID,
): Promise<TransactionSignature>;
```

### Dondurma Yetkisini Güncelleme

Son olarak, `freezeAuthority`'yi başka bir hesaba güncellemek isteyebilirsiniz. Örneğin, dondurma ve çözme işlemlerini bir program aracılığıyla gerçekleştirmek istiyorsanız bunu yapabilirsiniz. `setAuthority` çağırarak doğru hesapları ekleyebilir ve `authorityType`'ı geçerek bunu gerçekleştirebilirsiniz; bu durumda `AuthorityType.FreezeAccount` olacaktır.

```ts
/**
 * Hesaba yeni bir yetki atayın
 *
 * @param connection       Kullanılacak bağlantı
 * @param payer            İşlem ücretlerini ödeyen
 * @param account          Hesabın adresi
 * @param currentAuthority Belirtilen türdeki mevcut yetki
 * @param authorityType    Ayarlanacak yetki türü
 * @param newAuthority     Hesabın yeni yetkisi
 * @param multiSigners     Eğer `currentAuthority` çok imzalıysa imzalayan hesaplar
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
  AuthorityType.FreezeAccount,
  newAuthority,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Laboratuvar

Bu laboratuvar, tüm yeni token hesaplarının oluşturulurken dondurulmuş olduğu bir mint oluşturacağız ve `varsayılan durum` uzantısını kullanacağız. Daha sonra, uzantının işlevini test etmek için dondurulmuş ve çözülmüş hesap durumlarında token basma ve transfer etmeye çalışacağız.

#### 1. Ortamı Ayarlama

Başlamak için, `default-account-state` adında boş bir dizin oluşturun ve içine girin. Yepyeni bir proje başlatacağız. `npm init` komutunu çalıştırın ve istemleri izleyin.

Sonraki adımda bağımlılıklarımızı eklememiz gerekecek. Gerekli paketleri yüklemek için aşağıdakini çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

`src` adında bir dizin oluşturun. Bu dizin içinde `index.ts` adında bir dosya oluşturun. Burada bu uzantının kurallarına karşı kontrol işlemlerini gerçekleştireceğiz. `index.ts`'ye aşağıdaki kodu yapıştırın:

```ts
import {
  AccountState,
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  mintTo,
  thawAccount,
  transfer,
  createAccount,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
// import { createTokenExtensionMintWithDefaultState } from "./mint-helper"; // Bu daha sonra açıklanacak
import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

const [mintKeypair, ourTokenAccountKeypair, otherTokenAccountKeypair] =
  makeKeypairs(3);
const mint = mintKeypair.publicKey;
const decimals = 2;
const defaultState = AccountState.Frozen;

const ourTokenAccount = ourTokenAccountKeypair.publicKey;

// Transfer testlerini karşılamak için
const otherTokenAccount = otherTokenAccountKeypair.publicKey;

const amountToMint = 1000;
const amountToTransfer = 50;

// VARSAYILAN DURUMLA MINT İNŞA ETME

// TEST TOKEN HESAPLARI OLUŞTURMA

// TEST: ÇÖZÜLMEDEN BASMA

// TEST: ÇÖZÜLEREK BASMA

// TEST: ÇÖZÜLMEDEN TRANSFER

// TEST: ÇÖZÜLEREK TRANSFER
```

`index.ts`, belirtilen doğrulayıcı düğümüne bir bağlantı oluşturur ve `initializeKeypair` çağrısında bulunur. Ayrıca, bu laboratuvarın geri kalanında kullanacağımız birkaç değişken içerir. `index.ts`, nihayetinde yazdıktan sonra diğer script'lerimizi çağıracağımız yerdir.

`initializeKeypair` ile airdrop sırasında bir hata alırsanız, bir sonraki adımı izleyin.

#### 2. Doğrulayıcı Düğümünü Çalıştırma

Bu rehberin amacı doğrultusunda, kendi doğrulayıcı düğümümüzü çalıştıracağız.

Ayrı bir terminalde, aşağıdaki komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştıracak ve bazı anahtarlar ve değerler günlüğüne kaydedilecektir. Bağlantımızda kullanmamız gereken değeri almak için gerekli olan JSON RPC URL'sini almamız gerekiyor ki bu örnekte `http://127.0.0.1:8899`'dur. Sonrasında bağlantıda yerel RPC URL'sini belirtmek için bunu kullanırız.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Alternatif olarak, testnet veya devnet kullanmak istiyorsanız, `@solana/web3.js`'den `clusterApiUrl`'ı içe aktarabilir ve bağlantıya şöyle geçirebilirsiniz:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

Devnet kullanmayı seçerseniz ve airdrop dizisinde sorun yaşarsanız, bu duruma `initializeKeypair`'a `keypairPath` parametresini ekleyebilirsiniz. Bu, terminalde `solana config get` komutunu çalıştırarak elde edilecektir. Ardından, [faucet.solana.com](https://faucet.solana.com/) adresine gidip adresinize birkaç sol airdrop yapabilirsiniz. Adresinizi `solana address` komutunu çalıştırarak alabilirsiniz.

#### 3. Araçlar

Önceki metin içindeki `index.ts` kodunu yapıştırırken, aşağıdaki araçları ekledik:

- `initializeKeypair`: Bu fonksiyon `payer` için anahtarı oluşturur ve buna biraz SOL airdrop yapar
- `makeKeypairs`: Bu fonksiyon airdrop yapmadan anahtar çiftleri oluşturur

Ayrıca bazı başlangıç hesaplarımız var:

- **`payer`**: Her şey için ödeme yapmak ve yetki sahibi olmak için kullanılır
- **`mintKeypair`**: `varsayılan durum` uzantısına sahip mintimiz
- **`ourTokenAccountKeypair`**: Test için kullanacağımız payer'a ait token hesabı
- **`otherTokenAccountKeypair`**: Test için kullanılan başka bir token

#### 4. Varsayılan Hesap Durumuyla Mint Oluşturma

Varsayılan durumla bir mint token oluştururken, hesap talimatını oluşturmalı, mint hesabı için varsayılan hesabı başlatmalı ve minti kendisi başlatmalıyız.

`src/mint-helpers.ts` içinde `createTokenExtensionMintWithDefaultState` adında bir asenkron fonksiyon oluşturun. Bu fonksiyon, tüm yeni token hesaplarının “dondurulmuş” olarak başlamasını sağlayacak şekilde mint oluşturacaktır. Fonksiyon aşağıdaki argümanları alır:

- `connection`: Bağlantı nesnesi
- `payer`: İşlem için ödeyen
- `mintKeypair`: Yeni mintin anahtarı
- `decimals`: Mint ondalık sayısı
- `defaultState`: Mint token'ın varsayılan durumu - örn: `AccountState.Frozen`

Bir mint oluşturmanın ilk adımı, `SystemProgram.createAccount` yöntemi kullanarak Solana'da alan ayırmaktır. Bu, ödeyenin anahtar çiftini (oluşumu finanse edecek ve kiralama muafiyeti için SOL sağlayacak hesap) belirtmeyi, yeni mint hesabının genel anahtarını (`mintKeypair.publicKey`), mint bilgilerini blok zincirinde saklamak için gereken alan miktarını, hesapları kiradan muaf hale getirmek için gerekli SOL (lamports) miktarını ve bu mint hesabını yönetecek token programının kimliğini (`TOKEN_2022_PROGRAM_ID`) zorunlu kılar.

```typescript
const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
// Mint Hesabı için gereken minimum lamports
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mintKeypair.publicKey,
  space: mintLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

Mint hesabı oluşturulduktan sonra, bir sonraki adım varsayılan durum ile başlatmaktır. `createInitializeDefaultAccountStateInstruction` fonksiyonu, mint'in yeni token hesaplarının `defaultState` ayarlamasına olanak tanıyan bir talimat oluşturmak için kullanılır.

```typescript
const initializeDefaultAccountStateInstruction =
  createInitializeDefaultAccountStateInstruction(
    mintKeypair.publicKey,
    defaultState,
    TOKEN_2022_PROGRAM_ID,
  );
```

Bir sonraki adımda mint talimatını eklemek için `createInitializeMintInstruction` çağrılacak ve gerekli argümanlar iletilecektir. Bu işlev, SPL Token paketinin sağladığı bir işlevdir ve yeni bir mint'i başlatan bir işlem talimatı oluşturur.

```typescript
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey, // Atanan Mint Yetkilisi
  payer.publicKey, // Atanan Dondurma Yetkilisi
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, tüm talimatları bir işleme ekleyip bunu blok zincirine gönderelim:

```typescript
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeDefaultAccountStateInstruction,
  initializeMintInstruction,
);

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mintKeypair,
]);
```

Her şeyi bir araya getirirsek, son `src/mint-helpers.ts` dosyası aşağıdaki gibi olacaktır:

```ts
import {
  AccountState,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeDefaultAccountStateInstruction,
  createInitializeMintInstruction,
  getMintLen,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

/**
 * Varsayılan durum olan token mintini oluşturur
 * @param connection
 * @param payer
 * @param mintKeypair
 * @param decimals
 * @param defaultState
 * @returns işlemin imzası
 */
export async function createTokenExtensionMintWithDefaultState(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number = 2,
  defaultState: AccountState,
): Promise<string> {
  const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
  // Mint Hesabı için gereken minimum lamports
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const initializeDefaultAccountStateInstruction =
    createInitializeDefaultAccountStateInstruction(
      mintKeypair.publicKey,
      defaultState,
      TOKEN_2022_PROGRAM_ID,
    );

  const initializeMintInstruction = createInitializeMintInstruction(
    mintKeypair.publicKey,
    decimals,
    payer.publicKey, // Atanan Mint Yetkilisi
    payer.publicKey, // Atanan Dondurma Yetkilisi
    TOKEN_2022_PROGRAM_ID,
  );

  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeDefaultAccountStateInstruction,
    initializeMintInstruction,
  );

  return await sendAndConfirmTransaction(connection, transaction, [
    payer,
    mintKeypair,
  ]);
}
```

#### 6. Test Ayarları

Artık varsayılan durum için tüm yeni token hesaplarına sahip bir mint’i oluşturma yeteneğimiz olduğuna göre, nasıl işlediğini görmek için bazı testler yazalım.

#### 6.1 Varsayılan Durumla Mint Oluşturma

Öncelikle varsayılan durumu `dondurulmuş` olan bir mint oluşturacağız. Bunun için, `index.ts` dosyamızda az önce oluşturduğumuz `createTokenExtensionMintWithDefaultState` fonksiyonunu çağıracağız:

```ts
// VARSAYILAN DURUMLA MINT OLUŞTUR
await createTokenExtensionMintWithDefaultState(
  connection,
  payer,
  mintKeypair,
  decimals,
  defaultState,
);
```

#### 6.2 Test Token Hesapları Oluşturma

Şimdi, test etmek için iki yeni Token hesabı oluşturalım. Bunu, SPL Token kütüphanesi tarafından sağlanan `createAccount` yardımcısını çağırarak gerçekleştirebiliriz. İlk başta oluşturduğumuz anahtar çiftlerini kullanacağız: `ourTokenAccountKeypair` ve `otherTokenAccountKeypair`.

```typescript
// TEST TOKEN HESAPLARI OLUŞTURMA
// Hesaptan transfer
await createAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
  ourTokenAccountKeypair,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
// Hesaba transfer
await createAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
  otherTokenAccountKeypair,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 7 Testler

Şimdi, `varsayılan durum` uzantısıyla hangi etkileşimlerin yapılabileceğini göstermek için bazı testler yazalım.

Toplamda dört test yazacağız:

- Alıcının hesabını çözmeden basma
- Alıcının hesabını çözerek basma
- Alıcının hesabını çözmeden transfer
- Alıcının hesabını çözerek transfer

#### 7.1 Alıcının Hesabını Çözmeden Basma

Bu test, `ourTokenAccount`’a bir token basmaya çalışacak, ancak bu hesabı çözmeden gerçekleştirecektir. Bu testin başarısız olması bekleniyor çünkü hesap basım sırasında dondurulmuş olacak. Unutmayın: bir token hesabı dondurulduğunda, bakiyesi değişmez.

Bunu yapmak için, bir `try catch` yapısında `mintTo` fonksiyonunu sarmalayalım ve saygı duyulan sonucu yazdıralım:

```typescript
// TEST: ÇÖZÜLMEDEN BASMA
try {
  // Çözmeden basmaya çalış
  await mintTo(
    connection,
    payer,
    mint,
    ourTokenAccount,
    payer.publicKey,
    amountToMint,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("Basılmamalıydı...");
} catch (error) {
  console.log(
    "✅ - Hesabın hâlâ dondurulmuş olduğu için bunun başarısız olacağını bekliyorduk.",
  );
}
```

Script'i çalıştırarak bunu test edin:

```bash
esrun src/index.ts
```

Terminalde şu hatayı görmeliyiz, bu da uzantının işlevini doğru şekilde yerine getirdiğini gösteriyor.
`✅ - Hesabın hâlâ dondurulmuş olduğu için bunun başarısız olacağını bekliyorduk.`

#### 7.2 Alıcının Hesabını Çözerek Basma

Bu test, token hesabını çözdükten sonra bir token basmaya çalışacak. Bu testin geçmesi bekleniyor çünkü hesap basım sırasında çözülecek.

Bu testi, önce `thawAccount` çağırarak ve ardından `mintTo` ile gerçekleştirebiliriz:

```typescript
// TEST: ÇÖZÜLEREK BASMA
// Dondurulmuş token'ı çöz
await thawAccount(
  connection,
  payer,
  ourTokenAccount,
  mint,
  payer.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
// TokenAccount'a token gönder
await mintTo(
  connection,
  payer,
  mint,
  ourTokenAccount,
  payer.publicKey,
  amountToMint,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const ourTokenAccountWithTokens = await getAccount(
  connection,
  ourTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - Dondurmayı çözüp basım gerçekleştirdikten sonra yeni hesap bakiyesi ${Number(ourTokenAccountWithTokens.amount)}.`,
);
```

Gidin ve script'i çalıştırın, işlem başarılı olmalıdır.

```bash
esrun src/index.ts

#### 7.3 Alıcı hesabını çözmeden transfer

Artık mintleme test ettiğimize göre, dondurulmuş tokenlarımızın transferini ve dondurulmamış olanlarını test edebiliriz. Öncelikle alıcının token hesabını çözmeden bir transfer testi yapalım.

:::warning
Unutmayın, varsayılan olarak, `otherTokenAccountKeypair` uzantı nedeniyle donmuş durumdadır.
:::

Bu testin başarısız olmasını bekliyoruz, çünkü `otherTokenAccountKeypair` donmuş ve bakiyesi değişemez.

Bunu test etmek için `transfer` fonksiyonunu bir `try catch` içinde sarmalayalım:

```typescript
// TEST: ÇÖZMEKSİZ TRANSFER
try {
  await transfer(
    connection,
    payer,
    ourTokenAccount,
    otherTokenAccount,
    payer,
    amountToTransfer,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("Mintlenmemiş olması gerekiyordu...");
} catch (error) {
  console.log(
    "✅ - Bunun başarısız olmasını bekliyorduk çünkü hesap hala donmuş.",
  );
}
```

Testi çalıştırın ve sonuçları görün:

```bash
esrun src/index.ts
```

---

#### 7.4 Alıcının hesabını çözerek transfer

Oluşturacağımız son test, token hesabını çözdükten sonra token transferini test edecek. Bu testin geçmesi bekleniyor, çünkü tüm token hesapları şimdi çözülecek.

Bunu `thawAccount` çağrısı yaparak ve ardından `transfer` yaparak gerçekleştireceğiz:

```typescript
// TEST: ÇÖZMEYİ İÇEREN TRANSFER
// Donmuş tokenı çöz
await thawAccount(
  connection,
  payer,
  otherTokenAccount,
  mint,
  payer.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

await transfer(
  connection,
  payer,
  ourTokenAccount,
  otherTokenAccount,
  payer,
  amountToTransfer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const otherTokenAccountWithTokens = await getAccount(
  connection,
  otherTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - Yeni hesap bakiyesi ${Number(
    otherTokenAccountWithTokens.amount,
  )} çözme ve transferden sonra.`,
);
```

Tüm testleri bir kez daha çalıştırın ve sonuçları görün:

```bash
esrun src/index.ts
```

#### Anahtar çıkarımlarınızı hatırlayın:

- `varsayılan durum` uzantısı, _tüm_ yeni token hesaplarında varsayılan durumu zorlar.
- Donmuş hesabın bakiyesi değişemez.

---

Tebrikler! Varsayılan hesap uzantısını kullanarak bir mint oluşturduk ve test ettik!

## Zorluk

Donmuş ve çözülmüş token hesaplarından token yakmaya yönelik testler ekleyin. :::tip Biri başarısız olacak, biri başarılı olacak. :::

Başlamak için:

```ts
// TEST: Donmuş hesapta token yak
await freezeAccount(
  connection,
  payer,
  ourTokenAccount,
  mint,
  payer.publicKey,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

await burn(
  connection,
  payer,
  ourTokenAccount,
  mint,
  payer.publicKey,
  1,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);