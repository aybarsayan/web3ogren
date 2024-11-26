---
title: Transfer Ücreti Uzantısı
objectives:
  - Ücret yapılandırılmış mint oluşturma
  - O mint'in token'larını transfer etme
  - Transfer için ücret toplama
description:
  "Her seferinde token ticareti yapıldığında bir ücret alınmasını sağlayan bir token oluşturun."
---

## Özet

- Token Uzantı Programı'nın `transfer ücreti` uzantısı, her transferde ücretlerin
  tutulmasına olanak tanır. Bu ücretler alıcının hesabında saklanır ve yalnızca
  `withdrawWithheldAuthority` yetkisi ile tahsil edilebilir.
- Tutulan token'lar doğrudan alıcının hesaplarından çekilebilir veya mint'e toplanıp
  daha sonra çekilebilir.
- `transfer ücreti` uzantısını kullanan mint'lerle yapılan işlemlerde
  `transferCheckedWithFee` talimatı kullanılması gerekir.

## Genel Bakış

Diyelim ki bir Solana oyun geliştiricisiniz ve büyük bir açık dünya çok oyunculu
rol yapma oyunu yapıyorsunuz. Bu oyunda, tüm oyuncuların kazanıp ticaret yapacağı
bir para birimi olacaktır. Oyun ekonomisini sirküler hale getirmek için, bu para
birimi el değiştirdiğinde her seferinde küçük bir transfer ücreti talep etmek
isteyebilirsiniz, buna geliştirici vergisi diyorsunuz. :::info İlginç olanı, bu her transferde, oyunun içinde
ve dışında çalışacaktır!

Token Uzantı Programı'nın `transfer ücreti` uzantısı, bir mint üzerinde
transfer ücreti yapılandırmanıza olanak tanır; böylece ücretler protokol düzeyinde
değerlendirilir. Her transferde, o mint'in belirli bir miktarı alıcının
hesabında tutulur ve alıcı tarafından kullanılamaz. Transferden hemen sonra,
`withdraw` yetkisi bu tutulan token'ları talep edebilir.

:::note `transfer ücreti` uzantısı özelleştirilebilir ve güncellenebilir. Gireceğimiz
parametreler şunlardır:

- Ücret temel puanları: Her transferde uygulanan ücrettir. Örneğin, 1000 token
  50 temel puan ile transfer edilirse, 5 token elde edilir.
- Maksimum ücret: Transfer ücretleri için üst sınırdır. 5000 token maksimum
  ücreti ile, 10.000.000.000.000 token'lık bir transfer yalnızca 5000 token
  getirecektir.
- Transfer ücreti yetkisi: Ücretleri değiştirebilen varlık.
- Tutulan yetkiyi çekme: Mint veya token hesaplarında tutulan token'ları
  hareket ettirebilen varlık.
:::

### Ücret temel puanlarını hesaplama

Uzantıya girmeden önce, "ücret temel puanları" hakkında hızlı bir tanıtım.

Bir temel puan, finansal bir aracın değerindeki veya oranındaki yüzdelik
değişimi tanımlamak için finansal alanda kullanılan bir ölçüm birimidir. Bir temel
puan, 0,01% veya ondalık biçimde 0,0001'e eşittir.

Ücreti hesaplamak için şu şekilde bir hesaplama yapmalıyız:

```
Ücret = (token_miktarı * ücret_taban_puanları) / 10000
```

Sabit olan 10.000, ücret temel puan yüzdesini eşdeğer tutara dönüştürmek için kullanılır.

### Transfer ücreti ile mint yapılandırma

`transfer ücreti` uzantısıyla bir mint başlatmak, üç talimatı içerir:

- `SystemProgram.createAccount`
- `createInitializeTransferFeeConfigInstruction`
- `createInitializeMintInstruction`

Birinci talimat `SystemProgram.createAccount`, blockchain üzerinde mint hesabı
için alan ayırır. Bu talimat üç şeyi gerçekleştirir:

- `alan` ayırır
- Kiralama için `lamports` transfer eder
- Kendisine ait programa atama yapar

Token Uzantı Programı'nın tüm mint'lerinde olduğu gibi, mint için gereken alan ve
lamports miktarını hesaplamamız gerekiyor. Bunları `getMintLen` ve
`getMinimumBalanceForRentExemption` kullanarak alabiliriz.

```ts
const extensions = [ExtensionType.TransferFeeConfig];
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

İkinci talimat `createInitializeTransferFeeConfigInstruction`, transfer ücreti
uzantısını başlatır.

Şunları gerektiren parametreleri alır:

- `mint`: Token mint hesabı
- `transferFeeConfigAuthority`: Ücretleri güncelleyebilen isteğe bağlı yetki
- `withdrawWithheldAuthority`: Ücretleri çekebilen isteğe bağlı yetki
- `transferFeeBasisPoints`: Transfer miktarının temel puanları cinsinden toplanan
  transfer ücreti miktarı
- `maximumFee`: Transferler için uygulanan maksimum ücret
- `programId`: SPL Token program hesabı

```ts
const initializeTransferFeeConfigInstruction =
  createInitializeTransferFeeConfigInstruction(
    mintKeypair.publicKey,
    payer.publicKey,
    payer.publicKey,
    feeBasisPoints,
    maxFee,
    TOKEN_2022_PROGRAM_ID,
  );
```

Üçüncü talimat `createInitializeMintInstruction`, mint'i başlatır.

```ts
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey,
  null,
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, tüm bu talimatları bir işlemle eklemeli ve blockchain'e göndermelisiniz.

```ts
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeTransferFeeConfigInstruction,
  initializeMintInstruction,
);

const signature = await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

### Transfer Ücretleri ile Mint Aktarma

`transfer ücreti` uzantısını kullanarak token'ları aktarırken dikkate almanız
gereken birkaç nokta vardır.

İlk olarak, alıcı "ücretin" ödenmesinden sorumludur. Eğer 100 token'ı 500
temel puan (5%) ile gönderirsem, alıcı 95 token alır (beş tutulan).

İkinci olarak, ücret, gönderilen token miktarına göre değil, ilgili token'ın en
küçük birimi üzerinden hesaplanır. Solana programlamasında, her zaman en küçük
birimde transfer, mint veya yanma işlemleri için miktarları belirtiriz. Birine bir
SOL göndermek istiyorsak, aslında `1 * 10 ^ 9` lamports gönderiyoruz. Diğer bir
deyişle, bir ABD doları göndermek isterseniz, aslında 100 kuruş gönderiyorsunuz.
Bu doları 500 temel puan (5%) transfer ücreti ile bir token haline getirelim. Bir
dolar göndermek, beş centlik bir ücrete neden olur. Şimdi maksimum ücretin 10
cent olduğunu varsayalım, bu her zaman en yüksek ücret olacaktır, her ne kadar
$10.000 gönderdiğimizde bile.

> **Hesaplama**: Bu, transfer ücretlerinin nasıl hesaplandığını anlamanıza
güç sağlayacaktır. 

```ts
const transferAmount = BigInt(tokensToSend * 10 ** decimals);
const basisPointFee =
  (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
const fee = basisPointFee > maxFee ? maxFee : basisPointFee;
```

Üçüncü ve son olarak, `transfer ücreti` uzantısıyla token'ları aktarmanın iki yolu
vardır: `transfer_checked` veya `transfer_checked_with_fee`. Normal
`transfer` fonksiyonu, ücretleri yönetmek için gerekli mantığı içermez.

Transfer yapmak için kullanabileceğiniz fonksiyonlardan biri:

- `transfer_checked_with_fee`: Ücretleri hesaplamalı ve doğru şekilde sağlamalısınız.
- `transfer_checked`: Bu size ücretleri hesaplayacaktır.

```ts
/**
 * Bir hesaptan diğer bir hesaba token transferi yapın, token mint ve ondalık sayılarını doğrulayarak
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerini ödeyen
 * @param source         Kaynak hesap
 * @param mint           Hesap için mint
 * @param destination    Hedef hesap
 * @param owner          Kaynak hesabın sahibi
 * @param amount         Aktarılacak token sayısı
 * @param decimals       Aktarım miktarındaki ondalık sayısı
 * @param multiSigners   Eğer `owner` çoklu imza ise imza atan hesaplar
 * @param confirmOptions İşlemi onaylama seçenekleri
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */

const secondTransferAmount = BigInt(1 * 10 ** decimals);
const secondTransferSignature = await transferChecked(
  connection,
  payer,
  sourceAccount,
  mint,
  destinationAccount,
  sourceKeypair,
  secondTransferAmount,
  decimals, // Ayrıca mint hesap detaylarını `getMint(...)` ile alabilirsiniz
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

### Ücretleri Toplama

Tutulan token hesaplarından "ücretleri toplamanın" iki yolu vardır.

1. `withdrawWithheldAuthority`, bir kullanıcının token hesabının tutulan kısmından
   doğrudan çekiş yapabilir.
2. Tutulan token'ları toplayabilir ve bunları mint hesabında saklayabiliriz; bu
   sayede istediği zaman `withdrawWithheldAuthority` ile çekebilir.

Ama önce, neden bu iki seçeneğe sahip olunuyor?

Basitçe ifade etmek gerekirse, doğrudan çekiş yapmak, yetkilendirilmiş bir
işlevdir, yani yalnızca `withdrawWithheldAuthority` bunu çağırabilir. Oysa
toplama, izinsizdir; bu, toplama fonksiyonunu çağırarak tüm ücretlerin mint'e
girilmesine izin verir.

:::warning **Dikkat!** Neden her transferde doğrudan token'ları ücret toplama hesabına aktarmıyor? İki sebep:
- Mint oluşturucusunun ücretin nereye gideceğini bilmek isteyebilir.
- Bu bir darboğaz yaratabilir.
:::

Diyelim ki `transfer ücreti` etkin bir token'ınız var ve ücret kasanız bu
ücretleri alıyorsa. Eğer binlerce insan aynı anda token ile işlem yapmaya çalışıyorsa,
hepsi de sizin ücret kasanızın bakiyesini güncellemek zorunda kalacak. Ücret
kasası "yazılabilir" olmalıdır. İlginçtir ki, Solana paralel işleme yapabilir,
ancak aynı hesaplara aynı anda yazma işlemi gerçekleştirilemez. Bu nedenle, bu
binlerce kişi sırada beklemek zorunda kalacak ve transferi büyük ölçüde
yavaşlatacaktır. Bu, `tutulan` transfer ücretlerinin alıcının hesabında
tutulmasıyla çözülmektedir; böylece yalnızca gönderici ve alıcının hesapları
yazılabilir. Sonrasında `withdrawWithheldAuthority`, istediği zaman ücret
kasasına çekim yapabilir.

#### Doğrudan Ücret Çekme

İlk durumda, tüm tutulan transfer ücretlerini doğrudan tüm token hesaplarından
çekmek istiyorsak, aşağıdakileri yapabiliriz:

1. Mint ile ilişkili tüm token hesaplarını `getProgramAccounts` ile alın.
2. Tutulan token'lara sahip tüm token hesaplarını bir listeye ekleyin.
3. `withdrawWithheldTokensFromAccounts` fonksiyonunu çağırın (yetki bir imza
   sahibidir).

```ts
// verilen mint için tüm token hesaplarını alır
const accounts = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
  commitment: "finalized",
  filters: [
    {
      memcmp: {
        offset: 0,
        bytes: mint.toString(),
      },
    },
  ],
});

const accountsToWithdrawFrom = [];
for (const accountInfo of accounts) {
  const unpackedAccount = unpackAccount(
    accountInfo.pubkey,
    accountInfo.account,
    TOKEN_2022_PROGRAM_ID,
  );

  // Eğer tutulan token varsa, onu listeye ekleyin
  const transferFeeAmount = getTransferFeeAmount(unpackedAccount);
  if (
    transferFeeAmount != null &&
    transferFeeAmount.withheldAmount > BigInt(0)
  ) {
    accountsToWithdrawFrom.push(accountInfo.pubkey);
  }
}

/**
 * Hesaplardan tutulan token'ları çekin
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerini ödeyen
 * @param mint           Token mint'i
 * @param destination    Hedef hesap
 * @param authority      Mint'in tutulan token'ları çekme yetkisi
 * @param multiSigners   Eğer `owner` çoklu imza ise imza atan hesaplar
 * @param sources        Tutulan ücretleri çekmek için kaynak hesaplar
 * @param confirmOptions İşlemi onaylama seçenekleri
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */
await withdrawWithheldTokensFromAccounts(
  connection,
  payer,
  mint,
  feeVaultAccount,
  authority,
  [],
  accountsToWithdrawFrom,
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
```

#### Ücretleri Toplama

İkinci yaklaşımımız "toplama" - bu, izinsiz bir işlevdir; yani herkes bunu
çağırabilir. Bu yaklaşım, [clockwork](https://www.clockwork.xyz/) gibi araçlarla
toplama talimatının çalıştırılması için idealdir. Fark, toplama yaptığımızda,
tutulan token'ların mint içinde saklandığıdır. Sonrasında `withdrawWithheldAuthority`,
bu token'ları mint üzerinden istediği zaman çekebilir.

Toplama işlemi yapmak için:

1. Tıpkı yukarıdaki gibi toplamak istediğiniz tüm hesapları toplayın.
2. `harvestWithheldTokensToMint` fonksiyonunu çağırın.
3. Mint'ten çekmek için `withdrawWithheldTokensFromMint` fonksiyonunu çağırın.

```ts
/**
 * Hesaplardan mint'e tutulan token'ları toplayın
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerini ödeyen
 * @param mint           Token mint'i
 * @param sources        Tutulan ücretleri çekmek için kaynak hesaplar
 * @param confirmOptions İşlemi onaylama seçenekleri
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */
await harvestWithheldTokensToMint(
  connection,
  payer,
  mint,
  accountsToHarvestFrom,
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);

/**
 * Mint'ten tutulan token'ları çekin
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerini ödeyen
 * @param mint           Token mint'i
 * @param destination    Hedef hesap
 * @param authority      Mint'in tutulan token'ları çekme yetkisi
 * @param multiSigners   Eğer `owner` çoklu imza ise imza atan hesaplar
 * @param confirmOptions İşlemi onaylama seçenekleri
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */
await withdrawWithheldTokensFromMint(
  connection,
  payer,
  mint,
  feeVaultAccount,
  authority,
  [],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
```

### Ücret Güncelleme

Şu anda, JS kütüphanesi ile [oluşturulduktan sonra transfer ücretini
değiştirmenin](https://solana.stackexchange.com/questions/7775/spl-token-2022-how-to-modify-transfer-fee-configuration-for-an-existing-mint)
bir yolu yoktur. Ancak, CLI ile bunu yapabilirsiniz; bu durumda `solana config`
cüzdanınızın sonucu `transferFeeConfigAuthority` olmalıdır:

```bash
solana address
## Yukarıda belirtilen ^ sonucu `transferFeeConfigAuthority` olmalıdır
spl-token set-transfer-fee <MINT_ID> <FEE_IN_BASIS_POINTS> <MAX_FEE>
```

### Yetkileri Güncelleme

`transferFeeConfigAuthority` veya `withdrawWithheldAuthority`'yi
değiştirmek istiyorsanız, `setAuthority` fonksiyonuyla bunu yapabilirsiniz.
Doğru hesapları ve `authorityType`'ı geçmelisiniz; bu durumlarda ise
`TransferFeeConfig` ve `WithheldWithdraw`'dır.

```ts
/**
 * Hesaba yeni bir yetki atayın
 *
 * @param connection       Kullanılacak bağlantı
 * @param payer            İşlem ücretlerini ödeyen
 * @param account          Hesabın adresi
 * @param currentAuthority Mevcut yetki türü
 * @param authorityType    Ayarlanacak yetki türü
 * @param newAuthority     Hesabın yeni yetkisi
 * @param multiSigners     Eğer `currentAuthority` çoklu imza ise imza atan hesaplar
 * @param confirmOptions   İşlemi onaylama seçenekleri
 * @param programId        SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */

await setAuthority(
  connection,
  payer,
  mint,
  currentAuthority,
  AuthorityType.TransferFeeConfig, // veya AuthorityType.WithheldWithdraw
  newAuthority,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Laboratuvar

Bu laboratuvar çalışmasında, transfer ücreti yapılandırılmış bir mint
oluşturacağız. Ücretleri tutmak için bir ücret kasası kullanacağız ve hem
doğrudan yöntemle hem de toplama yöntemleriyle ücret toplayacağız.

#### 1. Başlarken

Başlamak için `transfer-fee` isimli boş bir dizin oluşturun ve o dizine gidin.
Yeni bir proje başlatacağız. `npm init` komutunu çalıştırın ve yönergeleri izleyin.

Sonra, bağımlılıklarımızı eklememiz gerekecek. Gerekli paketleri yüklemek için
aşağıdakileri çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

`src` isminde bir dizin oluşturun. Bu dizinde `index.ts` isminde bir dosya
oluşturun. Bu, bu uzantının kurallarını kontrol edeceğimiz yer olacak. `index.ts`
dosyasına aşağıdaki kodu yapıştırın:

```ts
import { Connection, Keypair } from "@solana/web3.js";
import { initializeKeypair } from "@solana-developers/helpers";
import { transferCheckedWithFee } from "@solana/spl-token";

/**
 * Bir bağlantı oluşturun ve bir keypair yoksa başlatın.
 * Eğer bir keypair varsa, gerekirse bir SOL token'ı airdrop'layın.
 */
const connection = new Connection("http://127.0.0.1:8899");
const payer = await initializeKeypair(connection);

console.log(`public key: ${payer.publicKey.toBase58()}`);

const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
console.log("\nmint public key: " + mintKeypair.publicKey.toBase58() + "\n\n");

// TRANSFER ÜCRETİ İLE MINT OLUŞTURUN

// ÜCRET KASASI HESABI OLUŞTURUN

// BİR KAYNAK HESABI OLUŞTURUN VE TOKEN MINT EDİN

// HEDEF HESABI OLUŞTURUN

// TOKEN'LARI AKTARIN

// TUTULAN TOKEN'LARLA HESAPLARI GETİRİN

// TUTULAN TOKEN'LARI ÇEKİN

// GÜNCELLENEN ÜCRET KASASI BAKİYESİNİ DOĞRULAYIN

// TUTULAN TOKEN'LARI MINT'E TOPLAYIN

// TOPLANAN TOKEN'LARI ÇEKİN

// GÜNCELLENEN ÜCRET KASASI BAKİYESİNİ DOĞRULAYIN
```

`index.ts`, belirtilen doğrulayıcı düğüme bir bağlantı oluşturan ve `initializeKeypair`
işlevini çağıran bir ana işlevi içerir. Bu `main` işlevi, script'imizi yazacağımız
yer olacaktır.

Gidin ve script'i çalıştırın. Terminalinizde `mint` public anahtarının
görüntülendiğini görmelisiniz.

```bash
esrun src/index.ts
```

Eğer `initializeKeypair` ile airdrop sırasında bir hata alırsanız, bir sonraki
aşamada ilerleyin.

#### 2. Doğrulayıcı düğüm çalıştırma

Bu kılavuz için kendi doğrulayıcı düğümümüzü çalıştıracağız.

Ayrı bir terminalde, aşağıdaki komutu çalıştırın: `solana-test-validator`. Bu,
düğümü çalıştıracak ve bazı anahtarları ve değerleri de kaydedecektir. Bağlantımızda
kullanmak üzere almamız gereken değer, JSON RPC URL'sidir; bu durumda bu `http://127.0.0.1:8899`'dur. Bunu ardından
bağlantıda kullanarak yerel RPC URL'sini belirtiriz.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Alternatif olarak, testnet veya devnet kullanmak isterseniz, 
`@solana/web3.js`'den `clusterApiUrl`'yi içe aktarabilir ve bağlantıya bu şekilde
geçebilirsiniz:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

Devnet kullanmayı seçerseniz ve SOL ile airdrop sırasında sorun yaşarsanız,
`initializeKeypair` fonksiyonuna `keypairPath` parametresini ekleyebilirsiniz. 
Bunu terminalde `solana config get` komutunu çalıştırarak alabilir ve ardından
[faucet.solana.com](https://faucet.solana.com/) adresine gidip
adresinize bir SOL airdrop gerçekleştirebilirsiniz. Adresinizi terminalde
`solana address` komutunu çalıştırarak alabilirsiniz.

#### 3. Transfer ücreti ile bir mint oluşturun

Yeni bir dosyada `createMintWithTransferFee` fonksiyonunu oluşturalım `src/create-mint.ts`.

```tip
`transfer fee` uzantısıyla bir mint oluşturmak için üç talimata ihtiyacımız var: `SystemProgram.createAccount`, `createInitializeTransferFeeConfigInstruction` ve `createInitializeMintInstruction`.
```

Ayrıca yeni `createMintWithTransferFee` fonksiyonumuzun aşağıdaki argümanlara sahip olmasını istiyoruz:

- `connection`: Bağlantı nesnesi
- `payer`: İşlem için ödeyici
- `mintKeypair`: Yeni mint için anahtar çifti
- `decimals`: Mint ondalık sayısı
- `feeBasisPoints`: Transfer ücreti için ücret baz puanları
- `maxFee`: Transfer ücreti için maksimum ücret puanları

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
  createInitializeTransferFeeConfigInstruction,
} from "@solana/spl-token";

export async function createMintWithTransferFee(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  feeBasisPoints: number,
  maxFee: bigint,
): Promise<TransactionSignature> {
  const extensions = [ExtensionType.TransferFeeConfig];
  const mintLength = getMintLen(extensions);

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(mintLength);

  console.log("Transfer ücreti talimatıyla bir işlem oluşturuluyor..."); 

  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeTransferFeeConfigInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      payer.publicKey,
      feeBasisPoints,
      maxFee,
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
  console.log("İşlem gönderildi");

  return signature;
}
```

Şimdi yeni fonksiyonumuzu `src/index.ts` dosyasında içe aktaralım ve çağıralım. Dokuz ondalık basamağa, 1000 ücret baz puanına (yüzde 10) ve 5000 maksimum ücrete sahip bir mint oluşturacağız.

```ts
// TRANSFER ÜCRETİ İLE MINT OLUŞTUR
const decimals = 9;
const feeBasisPoints = 1000;
const maxFee = BigInt(5000);

await createMintWithTransferFee(
  connection,
  payer,
  mintKeypair,
  decimals,
  feeBasisPoints,
  maxFee,
);
```

Bu anahtarı başarılı bir şekilde çalıştığını kontrol etmek için kodu çalıştırın.

```bash
esrun src/index.ts
```

---

#### 4. Bir ücret kasası hesabı oluşturun

Herhangi bir token transfer etmeden ve transfer ücretlerini biriktirmeden önce, tüm transfer ücretlerinin nihai alıcısı olacak bir "ücret kasası" oluşturun.

Basit olması açısından, ücret kasasını ödeyicimizin ilişkili token hesabı (ATA) olarak yapalım.

```ts
// ÜCRET KASASI HESABI OLUŞTUR
console.log("\nÜcret kasası hesabı oluşturuluyor...");

const feeVaultAccount = await createAssociatedTokenAccount(
  connection,
  payer,
  mintKeypair.publicKey,
  payer.publicKey,
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);

const initialBalance = (
  await connection.getTokenAccountBalance(feeVaultAccount, "finalized")
).value.amount;

console.log("Mevcut ücret kasası bakiyesi: " + initialBalance + "\n\n");
```

Scripti yine çalıştırın, bakiyemizin sıfır olması gerektiğini kontrol edin.

```bash
esrun src/index.ts
```

---

#### 5. İki token hesabı oluşturun ve birine mint edin

Şimdi `source` ve `destination` adını verdiğimiz iki test token hesabı oluşturalım. Ardından `source` hesabına bazı tokenlar mint edelim.

Bunu `createAccount` ve `mintTo` fonksiyonlarını çağırarak yapabiliriz. Tam 10 token mint edeceğiz.

```ts
// TEST HESAPLARI OLUŞTURUN VE TOKENS MINT EDİN
console.log("Kaynak hesabı oluşturuluyor...");

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

console.log("Hedef hesabı oluşturuluyor...");

const destinationKeypair = Keypair.generate();
const destinationAccount = await createAccount(
  connection,
  payer,
  mint,
  destinationKeypair.publicKey,
  undefined,
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);

console.log("Kaynağa 10 token mint ediliyor...\n\n");

const amountToMint = 10 * 10 ** decimals;

await mintTo(
  connection,
  payer,
  mint,
  sourceAccount,
  payer,
  amountToMint,
  [payer],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
```

İsterseniz kodu çalıştırarak her şeyin düzgün çalıştığını kontrol edin:

```bash
esrun src/index.ts
```

---

#### 6. Bir token transferi yapın

Şimdi `sourceAccount` hesabımızdan `destinationAccount` hesabımıza 1 token transfer edelim ve neler olacağını görelim.

```warning
`transfer fee` uzantısı etkinleştirilmiş bir token transferi yapmak için `transferCheckedWithFee` çağrısını yapmamız gerekiyor. Bu, ne kadar göndereceğimize karar vermemizi ve ilişkili doğru ücreti hesaplamamızı gerektiriyor.
```

Bunu yapmak için, biraz matematik yapabiliriz:

Öncelikle, bir tam token göndermek aslında `1 * (10 ^ decimals)` token göndermek demektir. 

Son olarak, ücretin maksimum ücretten fazla olup olmadığını kontrol etmemiz gerekiyor; eğer fazlaysa, `transferCheckedWithFee`'yi maksimum ücreti belirterek çağırmalıyız.

```ts
const transferAmount = BigInt(1 * 10 ** decimals);
const basisPointFee =
  (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
const fee = basisPointFee > maxFee ? maxFee : basisPointFee;
```

Tüm bu bilgilerle, bir saniye düşünün; bu işlem için nihai bakiyelerin ve alıkonulan miktarların ne olabileceğini düşünün.

Şimdi, bir token transfer edelim ve sonuçlanan bakiyeleri yazdıralım:

```ts
// TOKEN TRANSFER ET
console.log("Ücretli işlemle transfer yapılıyor...");

const transferAmount = BigInt(1 * 10 ** decimals);
const fee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);

const transferSignature = await transferCheckedWithFee(
  connection,
  payer,
  sourceAccount,
  mint,
  destinationAccount,
  sourceKeypair.publicKey,
  transferAmount,
  decimals,
  fee,
  [sourceKeypair],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);

const sourceAccountAfterTransfer = await getAccount(
  connection,
  sourceAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const destinationAccountAfterTransfer = await getAccount(
  connection,
  destinationAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const withheldAmountAfterTransfer = getTransferFeeAmount(
  destinationAccountAfterTransfer,
);

console.log(`Kaynak Token Bakiyesi: ${sourceAccountAfterTransfer.amount}`);
console.log(
  `Hedef Token Bakiyesi: ${destinationAccountAfterTransfer.amount}`,
);
console.log(
  `Alıkonan Transfer Ücretleri: ${withheldAmountAfterTransfer?.withheldAmount}\n`,
);
```

Scripti çalıştırabilirsiniz:

```bash
esrun src/index.ts
```

Aşağıdaki sonuçları almanız gerekiyor:

```bash
Ücretli işlemle transfer yapılıyor...
Kaynak Token Bakiyesi: 9000000000
Hedef Token Bakiyesi: 999995000
Alıkonan Transfer Ücretleri: 5000
```

Küçük bir inceleme:

```note
Ücret baz puanlarımız 1000, yani transfer edilen miktarın yüzde 10'u ücret olarak kullanılmalıdır. Bu durumda, 1,000,000,000'un yüzde 10'u 100,000,000 olup, bu 5000 maksimum ücretimizden çok daha büyük. Bu nedenle, 5000 tutarının tutulduğunu görüyoruz. Ayrıca, alıcının transfer ücretini "ödedigini" de unutmayın.
```

---

#### 7. Ücretleri geri çekme

Alıcının hesabından ücret kasasına iki şekilde ücret toplayabiliriz. 

```tip
İlk şekilde, alıcının hesabından doğrudan alıkonulan ücretleri `withdrawWithheldTokensFromAccounts` kullanarak ücret kasası hesabına çekiyoruz. 
```

Şimdi, doğrudan hedef hesap üzerinden ücretleri geri çekelim ve sonuçlanan bakiyeleri kontrol edelim:

```ts
// DOĞRUDAN ÇEKİM
await withdrawWithheldTokensFromAccounts(
  connection,
  payer,
  mint,
  feeVaultAccount,
  payer.publicKey,
  [],
  [destinationAccount],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const withheldAccountAfterWithdraw = await getAccount(
  connection,
  destinationAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const withheldAmountAfterWithdraw = getTransferFeeAmount(
  withheldAccountAfterWithdraw,
);

const feeVaultAfterWithdraw = await getAccount(
  connection,
  feeVaultAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `Geri çekim sonrası alıkonan miktar: ${withheldAmountAfterWithdraw?.withheldAmount}`,
);
console.log(
  `Geri çekim sonrası ücret kasası bakiyesi: ${feeVaultAfterWithdraw.amount}\n`,
);
```

Scripti çalıştırabilirsiniz:

```bash
esrun src/index.ts
```

Aşağıdaki sonuçları almanız gerekiyor:

```bash
Geri çekim sonrası alıkonan miktar: 0
Geri çekim sonrası ücret kasası bakiyesi: 5000
```

```note
`withdrawWithheldTokensFromAccounts` fonksiyonu, alıkonulan tüm ücretleri tüm token hesaplarından toplamak için de kullanılabilir; ilk önce hepsini getirmeniz gerekir. 
```

---

#### 7.2 Hasat etme ve ardından geri çekme

Şimdi, alıkonulan ücretleri geri almak için "hasat etme" seçeneğine bakalım. 

Bunu yapmak için, daha fazla ücret biriktirmek amacıyla daha fazla token transfer etmemiz gerekiyor. Bu sefer, `transferChecked` fonksiyonunu kullanarak bir kısayol alacağız. 

```ts
// TOKEN TRANSFER ET PT2
console.log("Ücretli işlemle transfer yapılıyor pt2...");

const secondTransferAmount = BigInt(1 * 10 ** decimals);
const secondTransferSignature = await transferChecked(
  connection,
  payer,
  sourceAccount,
  mint,
  destinationAccount,
  sourceKeypair,
  secondTransferAmount,
  decimals,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const sourceAccountAfterSecondTransfer = await getAccount(
  connection,
  sourceAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const destinationAccountAfterSecondTransfer = await getAccount(
  connection,
  destinationAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const withheldAmountAfterSecondTransfer = getTransferFeeAmount(
  destinationAccountAfterSecondTransfer,
);

console.log(`Kaynak Token Bakiyesi: ${sourceAccountAfterSecondTransfer.amount}`);
console.log(
  `Hedef Token Bakiyesi: ${destinationAccountAfterSecondTransfer.amount}`,
);
console.log(
  `Alıkonan Transfer Ücretleri: ${withheldAmountAfterSecondTransfer?.withheldAmount}\n`,
);
```

Şimdi, tokenları mint hesabına geri hasat edelim. Bunu `harvestWithheldTokensToMint` fonksiyonu ile yapacağız. 

```ts
// HASAT EDİLEN TOKENSİ MİNTE YENİDEN İADESİ
await harvestWithheldTokensToMint(
  connection,
  payer,
  mint,
  [destinationAccount],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, bu ücretleri mintten `withdrawWithheldTokensFromMint` fonksiyonu kullanarak geri çekelim.

```ts
// HASAT EDİLEN TOKENSİ GERİ ÇEK
await withdrawWithheldTokensFromMint(
  connection,
  payer,
  mint,
  feeVaultAccount,
  payer,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Şimdi, bunu çalıştırın.

```bash
esrun src/index.ts
```

Her adımda bakiyeleri göreceksiniz.

Hepsi bu kadar! Başarıyla transfer ücreti ile bir mint oluşturmuş olduk. Eğer herhangi bir noktada takılırsanız, çalışır kodu `solution` dalında bu [depo](https://github.com/Unboxed-Software/solana-lab-transfer-fee/tree/solution)'dan bulabilirsiniz.

---

#### Mücadele

Transfer ücreti etkinleştirilmiş bir mint oluşturun ve farklı ondalık basamaklar, ücret transfer puanları ve maksimum ücretlerle bazı tokenlar transfer edin.