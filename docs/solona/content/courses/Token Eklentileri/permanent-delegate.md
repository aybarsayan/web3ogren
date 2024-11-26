---
title: Kalıcı Temsilci
objectives:
  - Kalıcı bir temsilci ile mint oluşturun
  - Kalıcı temsilcinin kullanım durumlarını açıklayın
  - Uzantının kuralları ile deney yapın
description:
  "Belirli bir hesabın kalıcı olarak aktarılabilir veya yakılabilir bir token oluşturun."
---

## Özet

- **Kalıcı temsilci**, mint ile ilişkili tüm token hesaplarının küresel sahipliğini elinde bulundurur.
- **Kalıcı temsilci**'nin, o mintin herhangi bir token hesabından tokenları transfer etme ve yakma yetkisi sınırsızdır.
- Bu temsilci rolü, kapsamlı kontrol sağlayan güvenilir bir varlığı belirler. Yaygın kullanım durumları arasında yaptırım uyumu ve geri alınabilir erişim tokenları bulunmaktadır. 
- **Bu erişim düzeyi ile kalıcı temsilci**, tokenları yeniden atama, token arzını yönetme ve token hesaplarında belirli politikaları veya kuralları doğrudan uygulama gibi yüksek düzeyde idari işlevleri yerine getirebilir.

---

## Genel Bakış

`kalıcı temsilci` uzantısı, mintin tüm tokenları için bir `kalıcı temsilci` olmasına olanak tanır. Bu, tek bir adresin o mintin herhangi bir tokenını, herhangi bir token hesabından transfer edebilmesi veya yakabilmesi anlamına gelir. 

:::warning
Bu uzantıyı kullanmak son derece güçlüdür ama aynı zamanda risklidir. Bu, tek bir adrese token arzı üzerinde tam kontrol sağlar. 
:::

Otomatik ödemeler, boşalan cüzdanların kurtarılması ve iadeler gibi durumlar için iyi olabilir. Ancak, **bu bir çift taraflı kılıçtır**; `kalıcı temsilci` çalınabilir veya kötüye kullanılabilir. Amca Ben'in sözleriyle, "Büyük güç, büyük sorumluluk getirir."

> **Hayal edin**: Kalıcı temsilci kullanan NFT'lerin anahtar olarak kullanıldığı bir Solana tabanlı AirBnb. Check-in yaptığınızda, NFT anahtar size transfer edilecek ve konaklamanızın tadını çıkarabileceksiniz. Konaklamanızın sonunda, mülk sahibi anahtarı sizden geri alacak - çünkü onlar `kalıcı temsilci`. 

:::tip
Cüzdanınız boşalırsa veya anahtara erişiminizi kaybederseniz endişelenmeyin; mülk sahibi anahtarı herhangi bir hesaptan size geri transfer edebilir!
:::

Ama diğer yandan, diyelim ki mülk sahibi artık orada kalmanızı istemiyor; istedikleri zaman bunu geri alabilirler ve siz dışarıda kalırsınız. Bu şekilde, kalıcı temsilci uzantısı çift taraflı bir kılıçtır.

Tüm bunlar söylendikten sonra - `kalıcı temsilci`, Solana tokenlarına bir dünya olasılık ekleyen oldukça heyecan verici bir uzantıdır.

### Mint için kalıcı temsilci başlatma

Kalıcı temsilci tokenı başlatmak için üç talimat gereklidir:

1. `SystemProgram.createAccount`
2. `createInitializePermanentDelegateInstruction`
3. `createInitializeMintInstruction`

İlk talimat `SystemProgram.createAccount`, mint hesabı için blok zincir üzerinde alan ayırır. Bu talimat üç şey gerçekleştirir:

- Alan ayırma
- Kira için lamport transfer etme
- Sahip olduğu programa göre atama

```typescript
SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mint,
  space: mintLen,
  lamports: mintLamports,
  programId: TOKEN_2022_PROGRAM_ID,
}),
```

İkinci talimat `createInitializePermanentDelegateInstruction`, kalıcı temsilci uzantısını başlatır. Kalıcı temsilciyi belirleyen argüman, oluşturduğumuz `permanentDelegate` adında bir değişken olacaktır.

```typescript
createInitializePermanentDelegateInstruction(
  mint,
  permanentDelegate.publicKey,
  TOKEN_2022_PROGRAM_ID,
),
```

Üçüncü talimat `createInitializeMintInstruction`, minti başlatır.

```typescript
createInitializeMintInstruction(
  mint,
  decimals,
  mintAuthority.publicKey,
  null,
  TOKEN_2022_PROGRAM_ID,
);
```

Bu üç talimat ile işlem gönderildiğinde, belirtilen yapılandırmaya sahip yeni bir kalıcı temsilci tokenı oluşturulmuş olur.

### Temsilci olarak token transferi

`transferChecked` fonksiyonu, kalıcı temsilcinin hesaplar arasında tokenları güvenli bir şekilde transfer etmesini sağlar. Bu fonksiyon, token transferinin mintin yapılandırılmış kurallarına uyduğundan emin olur ve temsilcinin işlemi imzalamasını gerektirir.

```ts
/**
 * Bir hesaptan en fazla token sayısını transfer etmek için bir temsilciyi onaylayın ve token mintini ve ondalık değerleri doğrulayın
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerinin ödenmesi
 * @param mint           Mint adresi
 * @param account        Hesap adresi
 * @param delegate       Kaynaktan token transfer edebilecek yetkilendirilmiş hesap
 * @param owner          Kaynağın sahibi
 * @param amount         Temsilcinin transfer edebileceği en fazla token sayısı
 * @param decimals       Onaylanan miktardaki ondalık sayısı
 * @param multiSigners   `owner` bir çok imzalıysa imzalayan hesaplar
 * @param confirmOptions İşlemi onaylamak için seçenekler
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */
await transferChecked(
  connection,
  payer,
  bobAccount,
  mint,
  carolAccount,
  permanentDelegate,
  amountToTransfer,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

### Temsilci olarak token yakma

`burnChecked` fonksiyonu, kalıcı temsilcinin mintin herhangi bir token hesabından tokenları yakmasına olanak tanır. Bu fonksiyon, yakma işleminin mintin kurallarına uygun olduğunu ve temsilcinin işlemi imzalamasını gerektirir.

```ts
/**
 * Bir hesaptan tokenları yakmak, token mintini ve ondalık değerleri doğrulamak
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerinin ödenmesi
 * @param account        Tokenların yakılacağı hesap
 * @param mint           Hesap için mint
 * @param owner          Hesap sahibi
 * @param amount         Yakılacak miktar
 * @param decimals       Yakılacak miktardaki ondalık sayısı
 * @param multiSigners   `owner` bir çok imzalıysa imzalayan hesaplar
 * @param confirmOptions İşlemi onaylamak için seçenekler
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */
await burnChecked(
  connection,
  payer,
  bobAccount,
  mint,
  permanentDelegate,
  amountToBurn,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

### Yeni bir temsilciye yetki atama

`approveChecked` fonksiyonu, bir temsilciyi bir hesaptan en fazla token sayısını transfer etme veya yakma konusunda onaylar. Bu, belirlenen temsilcinin belirli bir limit kadar, hesap sahibinin adına token transfer etmesine olanak tanır.

```ts
/**
 * Bir hesaptan en fazla token sayısını transfer etmek veya yakmak için bir temsilciyi onaylayın, token mintini ve ondalıkları doğrulayın
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem ücretlerinin ödenmesi
 * @param mint           Mint adresi
 * @param account        Hesap adresi
 * @param delegate       Kaynaktan token transfer edebilecek yetkilendirilmiş hesap
 * @param owner          Kaynağın sahibi
 * @param amount         Temsilcinin transfer edebileceği en fazla token sayısı
 * @param decimals       Onaylanan miktardaki ondalık sayısı
 * @param multiSigners   `owner` bir çok imzalıysa imzalayan hesaplar
 * @param confirmOptions İşlemi onaylamak için seçenekler
 * @param programId      SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */

// Yeni temsilcinin eylemleri gerçekleştirmesi için onay verin
await approveChecked(
  connection,
  payer,
  mint,
  bobAccount,
  delegate.publicKey,
  bob,
  amountToApprove,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// Yeni atanan temsilci artık bir hesaptan transfer gerçekleştirebilir
await transferChecked(
  connection,
  payer,
  bobAccount,
  mint,
  carolAccount,
  carol,
  amountToTransfer,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Laboratuvar

Bu laboratuvarda, mint hesabı ile bir kalıcı temsilci oluşturarak ve o mint ile ilişkili token hesapları ile çeşitli etkileşimleri test ederek `kalıcı temsilci` uzantısının işlevselliğini keşfedeceğiz.

#### 1. Ortamı Ayarlama

Başlamak için, `permanent-delegate` adında boş bir dizin oluşturun ve oraya gidin. Yepyeni bir proje başlatacağız. `npm init` komutunu çalıştırın ve istemleri takip edin.

Sonraki adımda bağımlılıkları eklememiz gerekiyor. Gerekli paketleri kurmak için aşağıdakini çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun
```

`src` adında bir dizin oluşturun. Bu dizin içinde `index.ts` adında bir dosya oluşturun. Bu dosyada uzantının kurallarına karşı kontrol yapacağız. `index.ts`'ye aşağıdaki kodu yapıştırın:

```ts
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  createInitializePermanentDelegateInstruction,
  mintTo,
  createAccount,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  transferChecked,
} from "@solana/spl-token";
import { initializeKeypair } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

const mintAuthority = payer;
const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
const permanentDelegate = payer;

const extensions = [ExtensionType.PermanentDelegate];
const mintLen = getMintLen(extensions);

const decimals = 9;
const amountToMint = 100;
const amountToTransfer = 10;
const amountToBurn = 5;

// Kalıcı temsilci ile mint hesabı oluştur

// Temsilci ve hedef token hesaplarını oluştur

// Hesaplara token mintle

// Doğru temsilci ile transfer yapmayı deneyin

// Yanlış temsilci ile transfer yapmayı deneyin

// Doğru temsilci ile bir hesaptan diğerine transfer yapmayı deneyin

// Doğru temsilci ile yakmayı deneyin

// Yanlış temsilci ile yakmayı deneyin

// Farklı bir token hesabından token transfer etmek için bir hesaba yetki verin

// Carol ile temsilci olarak tokenları tekrar transfer etmeyi deneyin, onun belirlenen kontrol miktarını aşmasına neden olun
```

`index.ts` belirlenen validatör düğümüne bağlantı oluşturur ve `initializeKeypair` çağrısında bulunur. Ayrıca, laboratuvarın geri kalanında kullanacağımız birkaç değişken vardır. `index.ts`, onu yazdıktan sonra skripti aramak için kullanacağız.

`initializeKeypair` ile hava düşürme sırasında bir hata ile karşılaşırsanız, bir sonraki adımı takip edin.

#### 2. Validatör Düğümünü Çalıştırma

Bu rehber açısından, kendi validatör düğümümüzü çalıştırıyor olacağız.

Ayrı bir terminalde aşağıdaki komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştıracak ve bazı anahtarları ve değerleri de günlüğe kaydedecektir. Bağlantımızda kullanmamız gereken değer, bu durumda JSON RPC URL'sidir, bu da `http://127.0.0.1:8899`'dur. Daha sonra bunu bağlantıya ekleyerek yerel RPC URL'sini kullanacağız.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Alternatif olarak, testnet veya devnet kullanmak isterseniz `@solana/web3.js` den `clusterApiUrl`'yi içe aktarın ve bağlantıya şu şekilde geçirin:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

#### 3. Yardımcı Programlar

Önceki `index.ts` kodunu yapıştırdığımızda, aşağıdaki yardımcı programları ekledik:

- `initializeKeypair`: Bu fonksiyon, `payer` için anahtar çiftini oluşturur ve ona bir miktar SOL hava düşürür.
- `makeKeypairs`: Bu fonksiyon, hava düşürmeden anahtar çiftleri oluşturur.

Ayrıca, `kalıcı temsilci` uzantısını test etmek için kullanılacak bazı ilk hesaplar ve değişkenlerimiz bulunmaktadır!

#### 4. Kalıcı temsilci ile mint oluşturma

Varsayılan durumda bir mint token oluştururken, hesap talimatını oluşturmamız, mint hesabı için varsayılan hesap durumunu başlatmamız ve minti kendisini başlatmamız gerekir.

`src/mint-helper.ts` dosyasında `createTokenExtensionMintWithPermanentDelegate` adında asenkron bir fonksiyon oluşturun. Bu fonksiyon, tüm yeni mintlerin kalıcı bir temsilci ile oluşturulmasını sağlar. Fonksiyon aşağıdaki argümanları alacaktır:

- `connection`: Bağlantı nesnesi
- `payer`: İşlem için ücret ödeyen
- `mintKeypair`: Yeni mint için anahtar çifti
- `decimals`: Mint ondalıkları
- `permanentDelegate`: Atanan temsilci anahtar çifti

Mint oluşturmanın ilk adımı, `SystemProgram.createAccount` yöntemi ile Solana'da yer ayırmaktır. Bu, ödemenin yapılacağı (oluşturma için fon sağlanacak ve kira muafiyeti sağlamak için SOL sağlayacak) `payer` anahtar çiftinin, yeni mint hesabının açık anahtarının (`mintKeypair.publicKey`), blok zincirde mint bilgilerinin depolanması için gereken alanın (space), hesap için kiradan kurtulmak için gerekli miktar SOL (lamport) ve bu mint hesabını yönetecek token programının ID'sini belirtmesini gerektirir (`TOKEN_2022_PROGRAM_ID`).

```typescript
const extensions = [ExtensionType.PermanentDelegate];
const mintLen = getMintLen(extensions);
const mintLamports =
  await connection.getMinimumBalanceForRentExemption(mintLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mint,
  space: mintLen,
  lamports: mintLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

Mint hesabı oluşturulduktan sonra, bir kalıcı temsilci ile başlatmak için sonraki adım gelir. `createInitializePermanentDelegateInstruction` fonksiyonu, mintin yeni mint hesaplarının kalıcı temsilcisini ayarlamasına olanak tanıyan bir talimat oluşturmak için kullanılır.

```typescript
const initializePermanentDelegateInstruction =
  createInitializePermanentDelegateInstruction(
    mint,
    permanentDelegate.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
```

Sonra, gereken argümanları geçirerek `createInitializeMintInstruction` çağrısını yaparak mint talimatını ekleyelim. Bu fonksiyon, yeni bir minti başlatan bir işlem talimatı oluşturan SPL Token paketine aittir.

```typescript
const initializeMintInstruction = createInitializeMintInstruction(
  mint,
  decimals,
  mintAuthority.publicKey, // Belirlenen Mint Yetkilisi
  null, // Donma Yetkisi Yok
  TOKEN_2022_PROGRAM_ID,
);
```

Son olarak, tüm talimatları bir işleme ekleyelim ve blok zincirine göndereceğiz:

```typescript
const transaction = new Transaction().add(
  createAccountInstruction,
  initializePermanentDelegateInstruction,
  initializeMintInstruction,
);

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mintKeypair,
]);
```

Tüm bunları bir araya getirerek, son `src/mint-helper.ts` dosyası şöyle görünecek:

```ts
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializePermanentDelegateInstruction,
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
 * Kalıcı temsilci ile mint oluşturur
 * @param connection
 * @param payer
 * @param mintKeypair
 * @param decimals
 * @param permanentDelegate
 * @returns işlemin imzası
 */
export async function createTokenExtensionMintWithPermanentDelegate(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number = 2,
  permanentDelegate: Keypair,
): Promise<string> {
  const mintAuthority = payer;
  const mint = mintKeypair.publicKey;

  const extensions = [ExtensionType.PermanentDelegate];
  const mintLen = getMintLen(extensions);
  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(mintLen);
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint,
    space: mintLen,
    lamports: mintLamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const initializePermanentDelegateInstruction =
    createInitializePermanentDelegateInstruction(
      mint,
      permanentDelegate.publicKey,
      TOKEN_2022_PROGRAM_ID,
    );

  const initializeMintInstruction = createInitializeMintInstruction(
    mint,
    decimals,
    mintAuthority.publicKey, // Belirlenen Mint Yetkilisi
    null, // Donma Yetkisi Yok
    TOKEN_2022_PROGRAM_ID,
  );

  const transaction = new Transaction().add(
    createAccountInstruction,
    initializePermanentDelegateInstruction,
    initializeMintInstruction,
  );

  return await sendAndConfirmTransaction(connection, transaction, [
    payer,
    mintKeypair,
  ]);
}
```

#### 6. printBalances fonksiyonunu oluştur

Bir token hesabının bakiyesini değiştiren birden fazla test gerçekleştireceğiz. Takip etmeyi kolaylaştırmak için, tüm token hesap bakiyelerini yazdıran bir yardımcı fonksiyon oluşturalım.

`src/index.ts` dosyasının en altına aşağıdaki `printBalances` fonksiyonunu ekleyin:

```typescript
async function printBalances(
  connection: Connection,
  tokenAccounts: PublicKey[],
  names: string[],
) {
  if (tokenAccounts.length !== names.length)
    throw new Error("İsimlerin, hesaplarla bire bir olması gerekiyor.");

  for (let i = 0; i < tokenAccounts.length; i++) {
    const tokenInfo = await getAccount(
      connection,
      tokenAccounts[i],
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    console.log(`${names[i]}: ${tokenInfo.amount}`);
  }
}
```

#### 7. Test Ayarı

Artık kalıcı temsilci ile bir mint oluşturabilme yeteneğine sahip olduğumuza göre, bunun nasıl işlediğini görmek için bazı testler yazalım.

#### 7.1 Kalıcı Temsilci ile Mint Oluşturma

Öncelikle, `payer`'ın kalıcı temsilci olduğu bir mint oluşturalım. Bunu yapmak için, `index.ts` dosyamızda daha önce oluşturduğumuz `createTokenExtensionMintWithPermanentDelegate` fonksiyonunu çağırıyoruz:

```ts
// Kalıcı temsilci ile mint hesabı oluştur
await createTokenExtensionMintWithPermanentDelegate(
  connection,
  payer, // Diğer adıyla alice
  mintKeypair,
  decimals,
  defaultState,
);
```

#### 7.2 Test Token Hesapları Oluşturma

Şimdi, test etmek için üç yeni token hesabı oluşturalım. Bunu, SPL Token kütüphanesi tarafından sağlanan `createAccount` yardımcı fonksiyonunu çağırarak gerçekleştirebiliriz. Başlangıçta oluşturduğumuz anahtar çiftlerini kullanacağız: `alice`, `bob` ve `carol`.

Bu laboratuvarda, `alice` kalıcı temsilci olacaktır.

```typescript
// Temsilci ve hedef token hesaplarını oluştur
const aliceAccount = await createAccount(
  connection,
  payer,
  mint,
  alice.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const bobAccount = await createAccount(
  connection,
  payer,
  mint,
  bob.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const carolAccount = await createAccount(
  connection,
  payer,
  mint,
  carol.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 7.3 Hesaplara Token Mintleme

Önceki adımda, `kalıcı temsilci` uzantısını test etmek için gereken 3 hesabı oluşturduk. Şimdi, test yazmadan önce o hesaplara token mintlememiz gerekiyor.

`tokenAccounts` ve `names` değişkenlerini ekleyin ve ardından her hesap üzerinde döngü oluşturarak her birine 100 token mintleyin. Her bir hesap bakiyesini göstermek için `printBalances` fonksiyonunu çağırın:

```typescript
// Hesaplara token mintle
const tokenAccounts = [aliceAccount, bobAccount, carolAccount];
const names = ["Alice", "Bob", "Carol"];

for (const holder of tokenAccounts) {
  await mintTo(
    connection,
    payer,
    mint,
    holder,
    mintAuthority,
    amountToMint,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
}

console.log("Başlangıç Bakiyeleri: ");
await printBalances(connection, tokenAccounts, names);
```

Yerel validatörünüzü başlatın ve `npx esrun src/index.ts` komutunu çalıştırın. Terminalinize, token hesaplarımıza token mintlendiğini gösteren aşağıdakileri görmelisiniz:

```bash
Başlangıç Bakiyeleri:
Alice: 100
Bob: 100
Carol: 100

#### 8. Tests

Şimdi `kalıcı delege` uzantısıyla yapabileceğimiz etkileşimleri göstermek için bazı testler yazalım.

Aşağıdaki testleri yazacağız:

1. **Doğru Delege ile Transfer Girişimi:**

   - Alice, kalıcı delege olduğu için Bob'un hesabından kendine başarıyla token aktarımı yapacak.
   - Transferi doğrulamak için bakiyeleri yazdır.

2. **Yanlış Delege ile Transfer Girişimi:**

   - Bob, Alice'in hesabından kendine token aktarmaya çalışacak (başarısız olması bekleniyor çünkü Bob yetkilendirilmemiştir).
   - Başarısızlığı doğrulamak için bakiyeleri yazdır.

3. **Doğru Delege ile Bir Hesaptan Diğerine Transfer Girişimi:**

   - Alice, Bob'un hesabından Carol'un hesabına token aktaracak.
   - Transferi doğrulamak için bakiyeleri yazdır.

4. **Doğru Delege ile Yakma Girişimi:**

   - Alice, kalıcı delege olduğu için Bob'un hesabından token'ları başarıyla yakacak.
   - Yakmayı doğrulamak için bakiyeleri yazdır.

5. **Yanlış Delege ile Yakma Girişimi:**

   - Bob, Carol'un hesabından token'ları yakmaya çalışacak (başarısız olması bekleniyor çünkü Bob yetkilendirilmemiştir).
   - Başarısızlığı doğrulamak için bakiyeleri yazdır.

6. **Farklı Bir Token Hesabından Token Transferi İçin Bir Hesaba İzin Verme:**

   - Carol'un, Bob'un hesabından kendine token transfer etmesine onay ver.
   - Bob'un hesabından Carol'un hesabına token aktar.
   - Transferi doğrulamak için bakiyeleri yazdır.

7. **Carol'in Delege Olduğu Durumda Token Transferi Girişimi, Kendisine Ayrılan Kontrolü Aşma:**

   - Bob'un hesabından Carol'un hesabına token aktarmaya tekrar çalışacak, ancak kendisine ayrılan kontrolü aşacak (başarısız olması bekleniyor).

---

### :::note Doğru delege ile token transferi

Bu testte, `alice` token'ları `bob`dan kendine aktarmaya çalışıyor. Bu testin geçmesi bekleniyor çünkü `alice` kalıcı delege ve bu mint'in token hesapları üzerinde kontrolü var.

Bunu yapmak için, bir `transferChecked` fonksiyonunu `try catch` içine alalım ve hesaplarımızın bakiyelerini yazdıralım:

```typescript
// Doğru delege ile transfer girişimi
{
  // Alice, Bob'dan kendisine token aktaracak (Başarılı Olacak)
  try {
    await transferChecked(
      connection,
      payer,
      bobAccount,
      mint,
      aliceAccount,
      alice,
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log(
      "✅ Alice kalıcı delege olduğu için, bu mint'in tüm token hesapları üzerinde kontrol sahibidir.",
    );
    await printBalances(connection, tokenAccounts, names);
  } catch (error) {
    console.log("Alice, Bob'un token'larını Alice'e aktarabilmeli");
  }
}
```

Bu testi aşağıdaki komutu çalıştırarak test edin:

```bash
npx esrun src/index.ts
```

Aşağıdaki hata mesajının terminalde kaydedildiğini görmeliyiz, bu da uzantının beklendiği gibi çalıştığını gösterir:
`✅ Alice kalıcı delege olduğu için, bu mint'in tüm token hesapları üzerinde kontrol sahibidir.`

---

### :::danger Yanlış delege ile token transferi

Bu testte, `bob`, token'ları `alice`'den kendisine aktarmaya çalışacak. `bob` kalıcı delege olmadığından, bu girişim başarılı olmayacaktır.

Önceki testte olduğu gibi, bu testi `transferChecked` çağrısı yaparak ve ardından bakiyeleri yazarak oluşturabiliriz:

```typescript
// Yanlış delege ile transfer girişimi
{
  // Bob, Alice'ten kendisine token aktarmaya çalışacak (Başarısız Olacak)
  try {
    await transferChecked(
      connection,
      payer,
      aliceAccount, // transfer edilen
      mint,
      bobAccount,
      bob, // yanlış delege
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log("Bob, token'ları aktaramamalı");
  } catch (error) {
    console.log(
      "✅ Bob'un Alice'in fonları üzerinde yetkisi olmadığı için başarısız olmasını bekliyoruz",
    );
    await printBalances(connection, tokenAccounts, names);
  }
}
```

Komutu çalıştırın, işlem başarısız olmalı.

```bash
npx esrun src/index.ts
```

---

### :::tip Doğru delege ile bir hesaptan diğerine transfer

`kalıcı delege` uzantısının gücünü kullanarak `alice`, `bob`'dan `carol`'a bazı token'ları aktaracak.

Bu testin geçmesini bekliyoruz. Unutmayın, kalıcı delege mint'in **tüm** token hesapları üzerinde kontrol sahibidir.

Bunu test etmek için, bir `transferChecked` fonksiyonunu `try catch` içine alalım ve bakiyeleri yazdıralım:

```typescript
// Doğru delege ile bir hesaptan diğerine transfer girişimi
{
  // Alice, Bob'dan Carol'a token aktaracak
  try {
    await transferChecked(
      connection,
      payer,
      bobAccount, // transfer edilen
      mint,
      carolAccount, // transfer edilen
      alice,
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log(
      "✅ Alice, kalıcı delege olduğu için, kontrolü var ve Bob’un token’larını Carol’a aktarabilir",
    );
    await printBalances(connection, tokenAccounts, names);
  } catch (error) {
    console.log("Alice, Bob'un token'larını Alice'e aktarabilmeli");
  }
}
```

İlk testimizde, `bob`'un 10 token'ı `carol`'a aktarıldı. Bu zamana kadar `bob`'un 90 token'ı var. Testi çalıştırın ve sonuçları görün. `bob`'un artık 80 token'ı olduğunu göreceksiniz:

```bash
npx esrun src/index.ts
```

---

### :::tip Doğru delege ile yakma

Şimdi `bob`'dan bazı token'ları yakmaya çalışalım. Bu testin geçmesi bekleniyor.

Bunu `burnChecked` fonksiyonunu çağırarak ve ardından bakiyeleri yazarak yapacağız:

```typescript
// Doğru delege ile yakma girişimi
{
  // Alice, Bob'un token'larını yakacak
  try {
    await burnChecked(
      connection,
      payer,
      bobAccount,
      mint,
      alice, // doğru kalıcı delege
      amountToBurn, // bu durumda 5
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log(
      "✅ Alice kalıcı delege olduğu için, kontrol sahibidir ve Bob'un token'larını yakabilir",
    );
    await printBalances(connection, tokenAccounts, names);
  } catch (error) {
    console.error("Alice, Bob'un token'larını yakabilmeli");
  }
}
```

Testleri tekrar çalıştırın:

```bash
npx esrun src/index.ts
```

Bob'un 5 token'ı yakıldı ve şimdi yalnızca 75 token'ı var. Yazık oldu Bob'a!

---

### :::warning Yanlış delege ile yakma

Yanlış delege kullanarak bir hesaptan token'ları yakmaya çalışalım. Bu, `bob`'un token hesapları üzerinde kontrolü olmadığı için başarısız olması bekleniyor.

```typescript
// Yanlış delege ile yakma girişimi
{
  // Bob, Carol'dan token'ları yakmaya çalışacak (Başarısız Olacak)
  try {
    await burnChecked(
      connection,
      payer,
      carolAccount,
      mint,
      bob, // yanlış kalıcı delege
      amountToBurn,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    await printBalances(connection, tokenAccounts, names);
    console.error("Bob, token'ları yakamamalı");
  } catch (error) {
    console.log(
      "✅ Bob kalıcı delege olmadığı ve token'lar üzerinde kontrolü olmadığı için başarısız olmasını bekliyoruz",
    );
  }
}
```

`npm start` komutunu çalıştırın. Aşağıdaki mesajı göreceksiniz, bu da uzantının beklendiği gibi çalıştığını gösteriyor:
`✅ Bob kalıcı delege olmadığı ve token'lar üzerinde kontrolü olmadığı için başarısız olmasını bekliyoruz`

---

### :::info Carol'a delege izinleri ver ve transfer et

`kalıcı delege` uzantısıyla, başlangıçtaki delege, bir token hesabına mint token'ları üzerinde belirli bir kontrol seviyesine sahip olma izni verebilir. Bu durumda, `alice`, `carol`'un `bob` hesabından bazı token'ları kendisine aktarmasına izin verecek.

Bunun çalışması için `carol`'un bazı sınırları belirlemesi gerekecek. SPL Kütüphanesi tarafından sağlanan `approveChecked` fonksiyonunu kullanarak, `carol`'un aktarabileceği veya yakabileceği maksimum token sayısını belirleyebiliriz. Bu, onun yalnızca belirli bir miktarı aktarmasını sağlar, aşırı veya yetkisiz transferlerden korur.

Aşağıdaki testi ekleyin:

```typescript
// Farklı bir token hesabından token transferi için bir hesaba izin verme
{
  // Carol'a Bob'un token'larını kendisine aktarması için onay ver
  await approveChecked(
    connection,
    payer,
    mint,
    bobAccount,
    carol.publicKey,
    bob,
    amountToTransfer, // aktarılacak maksimum miktar
    decimals,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await transferChecked(
    connection,
    payer,
    bobAccount,
    mint,
    carolAccount,
    carol,
    amountToTransfer,
    decimals,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.log(
    "✅ Alice kalıcı delege olduğu için, Carol'ın Bob'un token'larını Carol'a transfer etmesine izin verebilir",
  );
  await printBalances(connection, tokenAccounts, names);
}
```

Testleri tekrar çalıştırın. `bob`'un artık yalnızca 65 token'ı olduğunu göreceksiniz çünkü `carol` onun 10 token'ını kendisine aktardı:
`npx esrun src/index.ts`

---

### :::tip Tekrar transfer girişimi

Önceki testte, `carol`'a kendisine 10 token transfer etmesi için onay verdik. Bu, onun başka bir hesaptan gönderebileceği token miktarına ulaştığı anlamına geliyor. Şimdi bir test yazalım ve kendisine tekrar 10 token aktarma girişiminde bulunalım. Bu başarısız olması bekleniyor.

```typescript
// Tekrar token transferi girişimi, Carol'ın ayrılan kontrolünü aşması
{
  // Carol'ın delege olarak yeniden aktarım girişimi, ayrılan kontrolü aşan
  try {
    await transferChecked(
      connection,
      payer,
      bobAccount,
      mint,
      carolAccount,
      carol, // Sahip - hedef hesabın token'larını aktarma yetkisine sahip olan kişi
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
  } catch (e) {
    console.log(
      `✅ Carol, ${amountToTransfer} token'ı zaten aktardığı için başarısız olmasını bekliyoruz ve daha fazla aktarım hakkı yok`,
    );
  }
}
```

Testleri bir kez daha çalıştırın ve bu mesajı göreceksiniz, bu da `✅ Carol, 10 token'ı zaten aktardığı için başarısız olmasını bekliyoruz ve daha fazla aktarım hakkı yok` anlamına geliyor.

Hepsi bu kadar! Artık kalıcı delegeye sahip bir mint hesabı oluşturdunuz ve işlevselliğini test ettiniz!

---

## Challenge

Kendinize kalıcı delegeye sahip bir mint hesabı oluşturun.