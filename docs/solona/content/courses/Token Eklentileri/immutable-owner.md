---
title: Değiştirilemez Sahip
objectives:
  - Değiştirilemez bir sahip ile token hesapları oluşturun
  - Değiştirilemez sahip uzantısının kullanım alanlarını açıklayın
  - Uzantının kuralları ile deney yapın
description:
  "Saklanan token'ların hesabının sahibinin değiştirilemeyeceğini sağlayan bir token yapın."
---

## Özeti

- `değiştirilemez sahip` uzantısı, bir token hesabı oluşturulduğunda,
  sahibinin değiştirilemez olduğunu, mülkiyetin her türlü değişikliğe karşı
  güvence altına alır.
- Bu uzantıya sahip token hesapları, mülkiyetle ilgili yalnızca bir kalıcı duruma
  sahip olabilir: **Değiştirilemez**.
- İlişkili Token Hesapları (ATA'lar) varsayılan olarak `değiştirilemez sahip` uzantısı
  ile etkinleştirilmiştir.
- `değiştirilemez sahip` uzantısı, her token hesabında etkinleştirilen bir token
  hesabı uzantısıdır, mint üzerinde değil.

## Genel Bakış

İlişkili Token Hesapları (ATA'lar), sahip ve mint ile belirlenmiştir ve belirli
bir sahip için doğru Token Hesabını tanımlama sürecini kolaylaştırır. Başlangıçta,
herhangi bir token hesabı sahibi değişebilir, hatta ATA'lar da. Bu durum güvenlik
endişelerine yol açtı; kullanıcılar beklenen alıcı tarafından artık sahip olunmayan
bir hesaba yanlışlıkla fon gönderebiliyordu. Bu, sahibin değişmesi durumunda
fon kaybına neden olabilecektir.

:::warning
`değiştirilemez sahip` uzantısı, ATA'lara otomatik olarak uygulanır ve sahipliğin
herhangi bir değişimini engeller. 
:::

Bu uzantı ayrıca, Token Uzantıları Programı
üzerinden oluşturulan yeni Token Hesapları için de etkinleştirilebilir ve bir kez
mülkiyet ayarlandığında kalıcı olmasını garanti eder. Bu, hesapları
yetkisiz erişim ve transfer girişimlerine karşı güvence altına alır.

Bu uzantının bir Token Hesap uzantısı olduğunu ve bunun token hesabında,
mintte değil olduğunu belirtmek önemlidir.

### Değiştirilemez sahip ile token hesabı oluşturma

Tüm Token Uzantıları Programı ATA'ları varsayılan olarak değiştirilemez sahip
etkinleştirilmiş olarak gelir. Eğer bir ATA oluşturmak istiyorsanız `createAssociatedTokenAccount`
kullanabilirsiniz.

ATA'lar dışında, değiştirilemez sahip uzantısını varsayılan olarak etkinleştiren,
herhangi bir Token Uzantıları Programı token hesabında bunu manuel olarak da
etkinleştirebilirsiniz.

Değiştirilemez sahip ile bir token hesabı başlatmak, üç komut gerektirir:

- `SystemProgram.createAccount`
- `createInitializeImmutableOwnerInstruction`
- `createInitializeAccountInstruction`

:::note
Not: Daha önce bir mint oluşturulduğunu varsayıyoruz.
:::

İlk komut `SystemProgram.createAccount`, token hesabı için blockchain'de alan
ayırır. Bu komut üç şeyi yerine getirir:

- `alan` ayırır
- Kira için `lamport` transfer eder
- Kendi programına atar

```typescript
const tokenAccountKeypair = Keypair.generate();
const tokenAccount = tokenAccountKeypair.publicKey;
const extensions = [ExtensionType.ImmutableOwner];

const tokenAccountLen = getAccountLen(extensions);
const lamports =
  await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

const createTokenAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccount,
  space: tokenAccountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

İkinci komut `createInitializeImmutableOwnerInstruction`, değiştirilemez sahip
uzantısını başlatır.

```typescript
const initializeImmutableOwnerInstruction =
  createInitializeImmutableOwnerInstruction(
    tokenAccount,
    TOKEN_2022_PROGRAM_ID,
  );
```

Üçüncü komut `createInitializeAccountInstruction`, token hesabını
başlatır.

```typescript
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount,
  mint,
  owner.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, bu tüm komutları bir işleme ekleyin ve blockchain'e gönderin.

```ts
const transaction = new Transaction().add(
  createTokenAccountInstruction,
  initializeImmutableOwnerInstruction,
  initializeAccountInstruction,
);

transaction.feePayer = payer.publicKey;

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  owner,
  tokenAccountKeypair,
]);
```

Bu üç talimatla işlem gönderildiğinde, değiştirilemez sahip uzantısına sahip
yeni bir token hesabı oluşturulur.

## Laboratuvar

Bu laboratuvarda, değiştirilemez sahiple bir token hesabı oluşturacağız.
Daha sonra, uzantının istediği gibi çalışıp çalışmadığını kontrol etmek için
testler yazacağız.

#### 1. Ortamı Kurun

Başlamak için, `immutable-owner` adında boş bir dizin oluşturun ve içine
geçin. Yepyeni bir proje başlatacağız. Varsayılanlarla bir proje oluşturmak için
`npm init -y` komutunu çalıştırın.

Sonra, bağımlılıklarımızı eklememiz gerekecek. Gerekli paketleri yüklemek için
aşağıdakileri çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

`src` adında bir dizin oluşturun. Bu dizinde `index.ts` adında bir dosya
oluşturun. Burada, bu uzantının kurallarına karşı kontrol gerçekleştireceğiz.
`index.ts` dosyasına aşağıdaki kodu yapıştırın:

```ts
import {
  AuthorityType,
  TOKEN_2022_PROGRAM_ID,
  createMint,
  setAuthority,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

const [otherOwner, mintKeypair, ourTokenAccountKeypair] = makeKeypairs(3);
const ourTokenAccount = ourTokenAccountKeypair.publicKey;
```

#### 2. Geçerlilik Düğümünü Çalıştırın

Bu kılavuz doğrultusunda, kendi geçerlilik düğümümüzü çalıştıracağız.

Ayrı bir terminalde, aşağıdaki komutu çalıştırın: `solana-test-validator`.
Bu, düğümü çalıştıracak ve bazı anahtarlar ve değerleri günlüğe kaydedecektir.
Bağlantımızda kullanmamız gereken değer JSON RPC URL'sidir ve bu durumda
`http://127.0.0.1:8899`'dir. Sonra bu bağlantıyı yerel RPC URL'sini
kullanmak için kullanacağız.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Alternatif olarak, testnet veya devnet kullanmak isterseniz, `@solana/web3.js`'den 
`clusterApiUrl` içe aktarın ve bağlantıya aşağıdaki gibi geçirin:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

#### 3. Yardımcılar

Önceki `index.ts` kodunu yapıştırdığınızda, aşağıdaki yardımcıları eklemiş olduk:

- `initializeKeypair`: Bu işlev, `payer` için anahtar çiftini oluşturur ve
  ayrıca ona 2 testnet SOL düşürür.
- `makeKeypairs`: Bu işlev, SOL düşürmeden anahtar çiftleri oluşturur.

Ayrıca bazı başlangıç hesaplarımız var:

- `payer`: Her şey için ödeme yapmak ve yetki sahibi olmak için kullanılır
- `mintKeypair`: Bizim mint'imiz
- `ourTokenAccountKeypair`: Test amacıyla kullanacağımız `payer` tarafından
  sahip olunan token hesabı
- `otherOwner`: İki değiştirilemez hesaba sahipliğini transfer etmeye çalışacağımız
  token hesabı

#### 4. Mint Oluşturma

Token hesaplarımız için kullanacağımız mint'i oluşturalım.

`src/index.ts` dosyasının içinde, gerekli bağımlılıklar zaten içe aktarılmış
olacak ve yukarıda bahsedilen hesaplar da bulunmaktadır. Aşağıdaki `createMint`
işlevini mevcut kodun altına ekleyin:

```typescript
// MINT OLUŞTUR
const mint = await createMint(
  connection,
  payer,
  mintKeypair.publicKey,
  null,
  2,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 5. Değiştirilemez sahip ile Token hesabı oluşturma

Unutmayın ki tüm ATA'lar, `değiştirilemez sahip` uzantısı ile gelir. Ancak, bir
anahtar çifti kullanarak bir token hesabı oluşturacağız. Bu, hesabı oluşturmayı,
değiştirilemez sahip uzantısını başlatmayı ve hesabı başlatmayı gerektirir.

`src` dizini içinde, `token-helper.ts` adında yeni bir dosya oluşturun ve burada
`createTokenAccountWithImmutableOwner` adında yeni bir işlev oluşturun. Bu
işlev, değiştirilemez sahip ile ilişkilendirilmiş token hesabını oluşturacaktır.
Fonksiyon aşağıdaki argümanları alacaktır:

- `connection`: Bağlantı nesnesi
- `mint`: Yeni mint'in halka açık anahtarı
- `payer`: İşlem için ödeyen
- `owner`: ilişkili token hesabının sahibi
- `tokenAccountKeypair`: Token hesabı ile ilişkili token hesabı anahtar çifti

```ts
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeAccountInstruction,
  createInitializeImmutableOwnerInstruction,
  getAccountLen,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function createTokenAccountWithImmutableOwner(
  connection: Connection,
  mint: PublicKey,
  payer: Keypair,
  owner: Keypair,
  tokenAccountKeypair: Keypair,
): Promise<string> {
  // Hesap oluşturma talimatı

  // Değiştirilemez sahip talimatını etkinleştir

  // Hesabı başlatma talimatı

  // Blockchain'e gönder

  return "TODO Değiştir ile imza";
}
```

Token hesabı oluşturmanın ilk adımı, **`SystemProgram.createAccount`** yöntemi
ile Solana'da alan ayırmaktır. Bu, öncelikle ödeyenin anahtar çiftini
(bu, oluşturmayı finanse edecek ve kiradan muafiyet için SOL sağlayacak
hesap) belirtmeyi, yeni token hesabının halka açık anahtarı
(`tokenAccountKeypair.publicKey`), blockchain'de token bilgilerini saklamak
için gereken alanı, hesap için kiradan muaf olmak için gerekli SOL (lamports) ve
bu token hesabını yönetecek token programının kimliğini (**`TOKEN_2022_PROGRAM_ID`**)
gerektirir.

```typescript
// HESAP OLUŞTURMA TALİMATI
const tokenAccount = tokenAccountKeypair.publicKey;

const extensions = [ExtensionType.ImmutableOwner];

const tokenAccountLen = getAccountLen(extensions);
const lamports =
  await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

const createTokenAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccount,
  space: tokenAccountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

Token hesabı oluşturulduktan sonra, bir sonraki talimat `değiştirilemez sahip`
uzantısını başlatır. `createInitializeImmutableOwnerInstruction` fonksiyonu
bu talimatı oluşturmak için kullanılır.

```typescript
// DEĞİŞTİRİLEMEZ SAHİBİ ETKİNLEŞTİRME TALİMATI
const initializeImmutableOwnerInstruction =
  createInitializeImmutableOwnerInstruction(
    tokenAccount,
    TOKEN_2022_PROGRAM_ID,
  );
```

Ardından, `createInitializeAccountInstruction` çağrısı yaparak
başlatma hesabı talimatını ekliyoruz ve gereken argümanları geçiriyoruz. Bu
fonksiyon SPL Token paketinden sağlanır ve yeni bir token hesabını başlatan bir
işlem talimatı oluşturur.

```typescript
// HESABI BAŞLATMA TALİMATI
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount,
  mint,
  owner.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Artık talimatlar oluşturulduğuna göre, değiştirilemez sahip ile token hesabı
oluşturulabilir.

```typescript
// BLOCKCHAIN'E GÖNDER
const transaction = new Transaction().add(
  createTokenAccountInstruction,
  initializeImmutableOwnerInstruction,
  initializeAccountInstruction,
);

transaction.feePayer = payer.publicKey;

const signature = await sendAndConfirmTransaction(connection, transaction, [
  payer,
  owner,
  tokenAccountKeypair,
]);

return signature;
```

`token-helper` için işlevselliği eklediğimize göre, test token hesaplarımızı
oluşturabiliriz. İki test token hesabından biri, `createTokenAccountWithImmutableOwner`
çağrısı yapılarak oluşturulacaktır. Diğeri ise yerleşik SPL yardımcı fonksiyonu
`createAssociatedTokenAccount` ile oluşturulacaktır. Bu yardımcı, varsayılan olarak
değiştirilemez bir sahibi içeren bir ilişkili token hesabı oluşturacaktır.
Bu kılavuz doğrultusunda, bu iki yaklaşım için de testler yapacağız.

`index.ts` dosyasına mint değişkeninin altına aşağıdaki iki token hesabını
oluşturun:

```typescript
// TEST TOKEN HESAPLARINI OLUŞTUR: Değiştirilemez sahip talimatları ile açıkça oluştur
const createOurTokenAccountSignature = await createTokenAccountWithImmutableOwner(
  connection,
  mint,
  payer,
  payer,
  ourTokenAccountKeypair
);

// TEST TOKEN HESAPLARINI OLUŞTUR: Varsayılan değiştirilemez sahibi ile ilişkili token hesabı oluştur
const associatedTokenAccount = await createAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Token hesaplarıyla ilgili işlerimiz bu kadar! Şimdi, uzantı kurallarının
doğru bir şekilde uygulandığından emin olmak için bazı testler yapmaya
geçebiliriz.

Her şeyin doğru çalıştığını test etmek isterseniz, script'i çalıştırabilirsiniz.

```bash
npx esrun src/index.ts
```

#### 6. Testler

**Sahibi transfer etmeye çalışma testi**

Oluşturulan ilk token hesabı, `ourTokenAccountKeypair` ile bağlanmıştır.
Bu hesabın sahipliğini daha önce oluşturduğumuz `otherOwner`'a devretmeye
çalışacağız. Bu testin başarısız olması bekleniyor çünkü yeni yetki sahibi
hesap oluşturulduğunda hesabın sahibi değildir.

`src/index.ts` dosyanıza aşağıdaki kodu ekleyin:

```typescript
// DEĞİŞTİRİLEMEZ HESAPTA SAHİBİ TRANSFER ETMEYE ÇALIŞMA TESTİ
try {
  await setAuthority(
    connection,
    payer,
    ourTokenAccount,
    payer.publicKey,
    AuthorityType.AccountOwner,
    otherOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("Hesabın sahibini değiştirememeniz gerekir.");
} catch (error) {
  console.log(
    `✅ - Bu durumun başarısız olmasını bekliyorduk çünkü hesap değiştirilemez ve sahibi değiştirilemez.`,
  );
}
```

Yukarıdaki kodu çalıştırarak `setAuthority` fonksiyonunu çağırabiliriz.
`npx esrun src/index.ts` komutunu çalıştırmalıyız. Terminalde şu hatanın
görüldüğünü göreceğiz, bu da uzantının gerektiği gibi çalıştığını gösteriyor:
`✅ - Bu durumun başarısız olmasını bekliyorduk çünkü hesap değiştirilemez ve sahibi değiştirilemez.`

**İlişkili token hesabı ile sahibi transfer etmeye çalışma testi**

Bu test, sahipliği İlişkili Token Hesabına devretmeyi deneyecek.
Bu testin de başarısız olması bekleniyor çünkü yeni yetki sahibi
hesap oluşturulurken hesabın sahibi değildir.

Önceki testin altına aşağıdaki deneme/yakalama bloğunu ekleyin:

```typescript
// İLİŞKİLİ DEĞİŞTİRİLEMEZ HESAPTA SAHİBİ TRANSFER ETMEYE ÇALIŞMA TESTİ
try {
  await setAuthority(
    connection,
    payer,
    associatedTokenAccount,
    payer.publicKey,
    AuthorityType.AccountOwner,
    otherOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("Hesabın sahibini değiştirememeniz gerekir.");
} catch (error) {
  console.log(
    `✅ - Bu durumun başarısız olmasını bekliyorduk çünkü ilişkili token hesabı değiştirilemez ve sahibi değiştirilemez.`,
  );
}
```

Artık `npx esrun src/index.ts` komutunu çalıştırabiliriz. Bu testin de
önceki testle benzer bir hata mesajı vermesi bekleniyor. Bu, her iki token
hesabımızın da gerçekten değiştirilemez olduğunu ve istediğimiz gibi çalıştığını gösteriyor.

Tebrikler! Değiştirilemez sahip uzantısını test ettiğiniz token hesapları
oluşturmuş olduk! Eğer herhangi bir aşamada takılırsanız, çalışır durumu
bulmak için `solution` dalındaki
[burası](https://github.com/Unboxed-Software/solana-lab-immutable-owner/tree/solution)ndan
bulabilirsiniz.

## Meydan Okuma

Değiştirilemez bir sahibi olan kendi token hesabınızı oluşturun.