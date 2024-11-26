---
title: Devredilemez Token
objectives:
  - Devredilemez token oluştur
  - Devredilemez token bas
  - Devredilemez tokenı transfer etmeyi dene
description:
  "Transfer edilemeyen tokenlar oluşturun. Sertifikalar, kimlik, biletleme ve daha fazlası."
---

## Özet

- Orijinal Token Programında, devredilemez (bazen "ruh bağlı" olarak adlandırılan) token oluşturmak imkansızdır.
- Token Uzantı Programı'nın `devredilemez token` uzantısı, devredilemez tokenları etkinleştirir.

## Genel Bakış

Token Programında, transfer edilemeyen bir token oluşturmak imkansızdır. Bu, önemsiz gibi görünse de, birinin devredilemez (veya "ruh bağlı") bir token vermek istemesi için birkaç nedeni olabilir.

> **Ana Fikir:** Bir Solana oyun geliştiricisi olarak, "Bits and Bytes" oyununda devredilemez NFT'ler ile başarıları ödüllendirmek isteyebilirsiniz. Bu, oyuncuların başarılarını cüzdanlarında gururla sergilemelerini sağlar. Ancak, bu Token Programında mümkün değildir. Fakat, Token Uzantı Programında mümkündür!

Token Uzantı Programı, devredilemez mintler oluşturmak için kullanılabilecek `devredilemez` uzantısına sahiptir. Bu mintler yakılabilir, ancak transfer edilemezler.

### Devredilemez mint hesap oluşturma

#### Devredilemez bir minti başlatmak üç talimat içerir:
- `SystemProgram.createAccount`
- `createInitializeNonTransferableMintInstruction`
- `createInitializeMintInstruction`

İlk talimat olan `SystemProgram.createAccount`, mint hesabı için blockchain üzerinde alan ayırır. Bu talimat üç şeyi gerçekleştirir:

- `alan` ayırır
- Kira için `lamport` transfer eder
- Kendisi için mülkiyet programını atar

:::warning
Diğer tüm uzantılar gibi, mint hesabı için gereken alan ve lamportları hesaplamanız gerekecek. Bunu şu şekilde çağırarak yapabilirsiniz: `getMintLen` ve `getMinimumBalanceForRentExemption`.
:::

```ts
const extensions = [ExtensionType.NonTransferable];
const mintLength = getMintLen(extensions);

const mintLamports =
  await connection.getMinimumBalanceForRentExemption(mintLength);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mintKeypair.publicKey,
  space: mintLength,
  lamports: mintLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

İkinci talimat olan `createInitializeNonTransferableMintInstruction` devredilemez uzantıyı başlatır.

```ts
const initializeNonTransferableMintInstruction =
  createInitializeNonTransferableMintInstruction(
    mintKeypair.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
```

Üçüncü talimat olan `createInitializeMintInstruction` minti başlatır.

```ts
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey,
  null, // Onay Konfigürasyonu
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, tüm talimatları bir işlemle ekleyip Solana'ya gönderin.

```ts
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeNonTransferableMintInstruction,
  initializeMintInstruction,
);

await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

Ve işte bu! Artık mint hesabınız var ve mint edildiğinde transfer edilemez. Bu uzantı, `metadata` ve `metadata-pointer` uzantıları ile birleştirildiğinde daha heyecan verici hale gelir ve ruh bağlı NFT'ler oluşturur.

---

## Laboratuvar

Bu laboratuvarda, devredilemez bir token oluşturacağız ve ardından onu transfer etmeyi denediğimizde ne olacağını göreceğiz (ipucu: transfer başarısız olacak).

### 1. Başlarken

Başlamak için `devredilemez-token` adında boş bir dizin oluşturun ve içine geçin. Yepyeni bir proje başlatacağız. `npm init` çalıştırın ve yönergeleri izleyin.

Sonraki adımda bağımlılıklarımızı eklememiz gerekecek. Gerekli paketleri yüklemek için aşağıdakini çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

`src` adında bir dizin oluşturun. Bu dizinde `index.ts` adında bir dosya oluşturun. Bu, bu uzantının kurallarına göre kontroller yapacağımız yerdir. `index.ts`'ye aşağıdaki kodu yapıştırın:

```ts
import { Connection, Keypair } from "@solana/web3.js";
import { initializeKeypair } from "@solana-developers/helpers";
import dotenv from "dotenv";
import {
  createAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
// import { createNonTransferableMint } from './create-mint';
dotenv.config();

/**
 * Bir bağlantı oluşturun ve eğer yoksa bir anahtar çiftini başlatın.
 * Eğer bir anahtar çifti mevcutsa, gerekirse bir SOL airdrop edin.
 */
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

console.log(`public key: ${payer.publicKey.toBase58()}`);

const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
console.log("\nmint public key: " + mintKeypair.publicKey.toBase58() + "\n\n");

// MINT OLUŞTUR

// KAYNAK HESAP OLUŞTUR VE TOKEN BAS

// TRANSFER İÇİN HEDEF HESAP OLUŞTUR

// TRANSFER DENEMESİ
```

Bu dosya, belirtilen doğrulayıcı düğümüne bir bağlantı oluşturup `initializeKeypair` çağıran bir ana işlev içermektedir. Bu ana işlev, yazdıktan sonra betiğimizin diğer kısımlarını çağıracağımız yerdir.

Hemen betiği çalıştırın. Terminalinizde `mint` public key'ini göreceksiniz.

```bash
esrun src/index.ts
```

Eğer `initializeKeypair` ile airdrop sırasında bir hata ile karşılaşırsanız, bir sonraki adıma geçin.

### 2. Geliştirici ortamının kurulması (isteğe bağlı)

Eğer devnet SOL ile airdrop sorunları yaşıyorsanız, şu adımları izleyebilirsiniz:

1. `initializeKeypair`'a `keypairPath` parametresini ekleyin ve devnet SOL almak için [Solana'nın faucet'ini](https://faucet.solana.com/) kullanın.
2. Aşağıdaki şekilde bir yerel doğrulayıcı çalıştırın:

Ayrı bir terminalde aşağıdaki komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştıracak ve bazı anahtarları ve değerleri günlüğe kaydedecektir. Bağlantımızda kullanmamız gereken değer, bu durumda `http://127.0.0.1:8899` olan JSON RPC URL'sidir. Bunu bağlantıda kullanarak yerel RPC URL'sini kullanmayı belirtiyoruz.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

### 3. Devredilemez bir mint oluştur

Yeni bir dosyada `src/create-mint.ts` içinde `createNonTransferableMint` fonksiyonunu oluşturalım.

Dosya içinde, aşağıdaki argümanlarla `createNonTransferableMint` fonksiyonunu oluşturun:

- `connection`: Bağlantı nesnesi
- `payer`: İşlem için ödeme yapan
- `mintKeypair`: Yeni mint için anahtar çifti
- `decimals`: Mint ondalık sayısı

Fonksiyon içinde, aşağıdakileri çağıracağız:

- `getMintLen` - mint hesabı için gereken alanı almak
- `getMinimumBalanceForRentExemption` - mint hesabı için gereken lamport miktarını almak
- `createAccount` - mint hesabı için blockchain üzerinde alan ayırmak
- `createInitializeNonTransferableMintInstruction` - uzantıyı başlatmak
- `createInitializeMintInstruction` - minti başlatmak
- `sendAndConfirmTransaction` - işlemi blockchain'e göndermek

```typescript
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
  createInitializeNonTransferableMintInstruction,
} from "@solana/spl-token";

export async function createNonTransferableMint(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
): Promise<TransactionSignature> {
  const extensions = [ExtensionType.NonTransferable];
  const mintLength = getMintLen(extensions);

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(mintLength);

  console.log("Devredilemez talimatla bir işlem oluşturuluyor...");
  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeNonTransferableMintInstruction(
      mintKeypair.publicKey,
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

  const signature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    { commitment: "finalized" },
  );

  return signature;
}
```

Şimdi bu işlevi `src/index.ts` içinde çağırarak devredilemez minti oluşturalım:

```typescript
// MINT OLUŞTUR
const decimals = 9;

await createNonTransferableMint(connection, payer, mintKeypair, decimals);
```

Betiği hata almadan çalıştırmalısınız.

```bash
esrun src/index.ts
```

Devredilemez mint doğru şekilde ayarlandı ve `npm start` çalıştırıldığında oluşturulacaktır. Şimdi bir kaynak hesabı oluşturalım ve buna bir token basmaya geçelim.

### 4. Token basma

Bu mintten oluşturulan tokenların aslında transfer edilemediğini test edelim. Bunu yapmak için, bir hesaba token basmamız gerekiyor.

Bunu `src/index.ts` içinde yapalım. Bir kaynak hesabı oluşturalım ve bir devredilemez token basımında bulunalım.

Bunu iki fonksiyonla başarabiliriz:

- `getOrCreateAssociatedTokenAccount`: `@solana/spl-token` kütüphanesinden, belirtilen mint ve sahip için bir ilişkili token hesabı (ATA) oluşturur.
- `mintTo`: Bu fonksiyon, belirtilen token hesabına belirli bir `miktar` kadar token basar.

```typescript
// ÖDEYİCİ ATA OLUŞTUR VE TOKEN BAS
console.log("İlişkili Token Hesabı oluşturuluyor...");
const ata = (
  await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  )
).address;

console.log("1 token basılıyor...");

const amount = 1 * 10 ** decimals;
await mintTo(
  connection,
  payer,
  mint,
  ata,
  payer,
  amount,
  [payer],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
const tokenBalance = await connection.getTokenAccountBalance(ata, "finalized");

console.log(
  `Hesap ${ata.toBase58()} şimdi ${tokenBalance.value.uiAmount} token ile bulunmaktadır.`,
);
```

Betiği çalıştırın ve bir tokenın bir hesaba basıldığını doğrulayın:

```bash
esrun src/index.ts
```

### 5. Devredilemez tokenı transfer etmeyi deneme

Son olarak, tokenı başka bir yere transfer etmeye çalışalım. Öncelikle bir token hesabı oluşturmalıyız ve ardından transfer etmeyi denemek istiyoruz.

`src/index.ts` içinde, bir hedef hesap oluşturacağız ve devredilemez tokenı bu hesaba transfer etmeyi deneyelim.

Bunu iki fonksiyonla başarabiliriz:

- `createAccount`: Bu, belirtilen mint ve bu hesabın anahtar çifti için bir token hesabı oluşturur. Bu yüzden burada bir ATA kullanmak yerine yeni bir anahtar çifti oluşturacağız. Farklı seçenekleri göstermek için bunu yapıyoruz.
- `transferChecked`: Bu, token transfer etmeyi deneyecektir.

Öncelikle `createAccount` fonksiyonu:

```typescript
// TRANSFER İÇİN HEDEF HESAP OLUŞTUR
console.log("Bir hedef hesap oluşturuluyor...\n\n");
const destinationKeypair = Keypair.generate();
const destinationAccount = await createAccount(
  connection,
  payer,
  mintKeypair.publicKey,
  destinationKeypair.publicKey,
  undefined,
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
```

Şimdi, `transferChecked` fonksiyonu:

```typescript
// TRANSFER DENEMESİ
console.log("Devredilemez mintı transfer etmeye çalışıyor...");
try {
  const signature = await transferChecked(
    connection,
    payer,
    ata,
    mint,
    destinationAccount,
    ata,
    amount,
    decimals,
    [destinationKeypair],
    { commitment: "finalized" },
    TOKEN_2022_PROGRAM_ID,
  );
} catch (e) {
  console.log(
    "Bu transfer, mint devredilemez olduğu için başarısız oluyor. Program günlüklerini kontrol edin: ",
    (e as any).logs,
    "\n\n",
  );
}
```

Şimdi her şeyi çalıştırın ve ne olacağını görelim:

```bash
esrun src/index.ts
```

Sonunda `Transfer is disabled for this mint` şeklinde bir hata mesajı almalıydınız. Bu, transfer etmeye çalıştığımız token'ın gerçekten devredilemez olduğunu gösteriyor!

```bash
Devredilemez mintı transfer etmeye çalışıyor...
Bu transfer, mint devredilemez olduğu için başarısız oluyor. Program günlüklerini kontrol edin:  [
  'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
  'Program log: Instruction: TransferChecked',
  'Program log: Transfer is disabled for this mint',
  'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb consumed 3910 of 200000 compute units',
  'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x25'
]
```

Bu kadar! Başarıyla devredilemez bir mint oluşturdunuz. Eğer herhangi bir noktada takılırsanız, çalışır durumda olan kodu bu [depo](https://github.com/Unboxed-Software/solana-lab-non-transferable-token/tree/solution) `solution` dalında bulabilirsiniz.

---

## Meydan Okuma

Meydan okuma için, kendi devredilemez tokenınızı oluşturun ve metadata uzantısını ekleyerek bir “ruh bağlı” NFT'yi kendinize tutun.