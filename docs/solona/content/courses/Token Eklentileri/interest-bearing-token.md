---
title: Faizli Token
objectives:
  - Faizli uzantıyla bir mint hesabı oluşturmak
  - Faizli tokenların kullanım durumlarını açıklamak
  - Uzantının kurallarıyla denemeler yapmak
description: "Zamanla faiz kazanan bir token oluşturun."
---

## Özet

- Oluşturucular faiz oranını belirleyebilir ve bunu doğrudan mint hesabında saklayabilir.
- Faizli tokenlar için temel token miktarı değişmeden kalır.
- Birikmiş faiz, sık sık yeniden baz almak veya güncellemek gerekmeden UI amaçları için gösterilebilir.
- Laboratuvar, faiz oranıyla mint yapmak üzere ayarlanmış bir mint hesabının yapılandırılmasını gösterir. Test durumu ayrıca faiz oranının nasıl güncelleneceğini ve token'dan oranın nasıl alınacağını da göstermektedir.

---

## Genel Bakış

Zamanla artan veya azalan değerlere sahip tokenların pratik uygulamaları gerçek dünyada mevcuttur; tahviller bunun en iyi örneğidir. Daha önce, bu dinamiği tokenlarda yansıtma yeteneği, proxy sözleşmelerinin kullanımına bağlıydı ve sık sık yeniden baz almak veya güncellemeler gerektiriyordu.

`faizli token` uzantısı bu konuda yardımcı olur. `faizli token` uzantısı ve `amount_to_ui_amount` fonksiyonunu kullanarak, kullanıcılar tokenlarına bir faiz oranı uygulayabilir ve herhangi bir anda, faizi de dahil olmak üzere, güncellenmiş toplamı alabilirler.

:::note
Faiz hesaplaması sürekli olarak, ağın zaman damgasını dikkate alarak yapılır. Ancak, ağın zamanındaki tutarsızlıklar birikmiş faizin beklenenden biraz daha az olmasına neden olabilir; bu durum nadiren görülen bir durumdur.
:::

Bu mekanizmanın yeni tokenlar üretmediğini ve görüntülenen miktarın yalnızca biriken faizi içerdiğini belirtmek önemlidir; bu değişim tamamen estetik bir nitelik taşımaktadır. Yine de, bu mint hesabında depolanan bir değerdir ve programlar bunu estetikten öte işlevsellik yaratmak için kullanabilir.

### Tokena faiz oranı ekleme

Faizli bir token başlatmak üç talimat gerektirir:

1. `SystemProgram.createAccount`
2. `createInitializeTransferFeeConfigInstruction`
3. `createInitializeMintInstruction`

İlk talimat `SystemProgram.createAccount`, mint hesabı için blockchain üzerinde alan ayırır. Bu talimat üç şeyi gerçekleştirir:

- `alan` ayırma
- Kira için `lamport` aktarımı
- Sahip olduğu programa atama

```typescript
SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint,
    space: mintLen,
    lamports: mintLamports,
    programId: TOKEN_2022_PROGRAM_ID,
}),
```

İkinci talimat `createInitializeInterestBearingMintInstruction`, faizli token uzantısını başlatır. Faiz oranını belirleyen argüman, `rate` adında oluşturduğumuz bir değişken olacaktır. `rate`, [baz puanları](https://www.investopedia.com/terms/b/basispoint.asp) cinsinden tanımlanır.

```typescript
createInitializeInterestBearingMintInstruction(
    mint,
    rateAuthority.publicKey,
    rate,
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

Bu üç talimatla yapılan işlem gönderildiğinde, belirtilen oran yapılandırmasıyla yeni bir faizli token oluşturulur.

### Biriken faizi alma

:::tip
Bir token üzerindeki biriken faizi almak için öncelikle `getAccount` fonksiyonunu kullanarak token bilgilerini (miktar ve ilgili veriler dahil) almak gerekir. Bağlantıyı, ödeyicinin token hesabını ve ilgili program kimliğini (`TOKEN_2022_PROGRAM_ID`) geçerek bu işlemi gerçekleştirin.
:::

Daha sonra, elde edilen token bilgileri ile birlikte, bağlantı, ödeyici ve mint gibi ek parametreleri kullanarak `amountToUiAmount` fonksiyonunu kullanın; bu fonksiyon token miktarını, doğal olarak biriken faizi de içerecek şekilde, karşılık gelen UI miktarına dönüştürür.

```typescript
const tokenInfo = await getAccount(
    connection,
    payerTokenAccount,
    undefined,
    TOKEN_2022_PROGRAM_ID,
);

/**
 * Miktarı mint tarafından belirlenen ondalık sayı kullanarak string olarak al
 *
 * @param connection     Kullanılacak bağlantı
 * @param payer          İşlem masraflarını ödeyen
 * @param mint           Hesap için mint
 * @param amount         Ui Miktarına dönüştürülecek token miktarı
 * @param programId      SPL Token program hesabı
 *
 * @return Oluşturulan Ui Miktar
 */
const uiAmount = await amountToUiAmount(
    connection,
    payer,
    mint,
    tokenInfo.amount,
    TOKEN_2022_PROGRAM_ID,
);

console.log("UI Miktar: ", uiAmount);
```

`uiAmount` dönüş değeri, UI miktarının bir string temsili olup şu şekilde görünecektir: `0.0000005000001557528245`.

### Yetki oranını güncelleme

:::warning
Solana, faizli bir token üzerinde yeni bir yetki belirlemek için kullanılan `setAuthority` adlı bir yardımcı fonksiyon sağlar.
:::

`setAuthority` fonksiyonunu kullanarak, hesaba yeni bir yetki atayın. `connection`, işlem masraflarını ödeyen hesap (ödeyici), güncelleme yapılacak token hesabı (mint), mevcut yetki sahibinin genel anahtarı, güncellenecek yetki türü (bu durumda 7, `InterestRate` yetki türünü temsil eder) ve yeni yetki sahibinin genel anahtarını sağlamanız gerekmektedir.

Yeni yetki belirlendikten sonra, `updateRateInterestBearingMint` fonksiyonunu kullanarak hesabın faiz oranını güncelleyin. Gerekli parametreleri geçin: `connection`, `payer`, `mint`, yeni yetki sahibinin genel anahtarı, güncellenmiş faiz oranı ve program kimliği.

```typescript
/**
 * Hesaba yeni bir yetki atayın
 *
 * @param connection       Kullanılacak bağlantı
 * @param payer            İşlem masraflarını ödeyen
 * @param account          Hesabın adresi
 * @param currentAuthority Belirtilen türdeki mevcut yetki
 * @param authorityType    Belirlenmesi gereken yetki türü
 * @param newAuthority     Hesabın yeni yetkisi
 * @param multiSigners     Eğer `currentAuthority` çok imzalıysa imzalayıcı hesaplar
 * @param confirmOptions   İşlemin onaylanması için seçenekler
 * @param programId        SPL Token program hesabı
 *
 * @return Onaylanmış işlemin imzası
 */

await setAuthority(
    connection,
    payer,
    mint,
    rateAuthority,
    AuthorityType.InterestRate, // Oran türü (InterestRate)
    otherAccount.publicKey, // yeni oran yetkisi,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
);

await updateRateInterestBearingMint(
    connection,
    payer,
    mint,
    otherAccount, // yeni oran yetkisi
    10, // güncellenmiş oran
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
);
```

## Laboratuvar

Bu laboratuvar, Solana üzerinde Token-2022 programı aracılığıyla Faizli Tokenlar oluşturuyoruz. Bu tokenları belirli bir faiz oranı ile başlatacak, yetki ile oranı güncelleyecek ve zaman içinde tokenlar üzerindeki faiz birikimini gözlemleyeceğiz.

#### 1. Ortamı Kurma

Başlamak için, `interest-bearing-token` adında boş bir dizin oluşturun ve bu dizine gidin. `npm init -y` yazarak yepyeni bir proje başlatın.

Daha sonra bağımlılıklarımızı eklememiz gerekecek. Gerekli paketleri yüklemek için aşağıdaki komutu çalıştırın:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

`src` adında bir dizin oluşturun. Bu dizinde `index.ts` adında bir dosya oluşturun. Bu, uzantının kurallarına karşı karşılaştırma yapacağımız yer. `index.ts` dosyasına şu kodu yapıştırın:

```ts
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import {
    ExtensionType,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
    getMint,
    getInterestBearingMintConfigState,
    updateRateInterestBearingMint,
    amountToUiAmount,
    mintTo,
    createAssociatedTokenAccount,
    getAccount,
    AuthorityType,
} from "@solana/spl-token";

import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);
const [otherAccount, mintKeypair] = makeKeypairs(2);
const mint = mintKeypair.publicKey;
const rateAuthority = payer;

const rate = 32_767;

// Faizli bir token oluşturun

// İlişkili token hesabı oluşturun

// getInterestBearingMint fonksiyonunu oluşturun

// Faiz oranını güncellemeyi deneyin

// Yanlış sahip ile faiz oranını güncellemeyi deneyin

// Birikmiş faizi günlükleyin

// Faizli mint yapılandırma durumunu günlükleyin

// Oran yetkisini güncelleyin ve yeni yetki ile faiz oranını güncellemeyi deneyin
```

`index.ts`, belirtilen doğrulayıcı düğümüne bir bağlantı oluşturur ve `initializeKeypair` çağrısını gerçekleştirir. Ayrıca, laboratuvarın geri kalanında kullanacağımız birkaç değişken içerir. `index.ts`, yazımını tamamladıktan sonra geri kalan scriptimizi çağıracağımız yer olacaktır.

#### 2. Doğrulayıcı düğümü çalıştırma

Bu kılavuz için, kendi doğrulayıcı düğümümüzü çalıştıracağız.

Ayrı bir terminalde şu komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştıracak ve bazı anahtarları ve değerleri de kaydedecektir. Bağlantımızda kullanmamız gereken değer JSON RPC URL'sidir, bu durumda `http://127.0.0.1:8899` olacaktır. Bu değeri bağlantıda kullanın.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

#### 3. Yardımcılar

Önceki `index.ts` kodunu yapıştırdığımızda, aşağıdaki yardımcıları ekledik:

- `initializeKeypair`: Bu fonksiyon, `payer` için bir anahtar çift oluşturur ve buna ayrıca 1 testnet SOL aktarır.
- `makeKeypairs`: Bu fonksiyon, herhangi bir SOL aktarmadan anahtar çiftleri oluşturur.

Ayrıca bazı başlangıç hesapları var:

- `payer`: Her şey için masraf ödeyen ve yetkili olan
- `mintKeypair`: `faizli token` uzantısına sahip mintimiz
- `otherAccount`: Faizi güncelleme girişiminde bulunacağımız hesap
- `otherTokenAccountKeypair`: Test için kullanılan başka bir token

#### 4. Faizli token ile mint oluşturma

Bu fonksiyon, tüm yeni tokenların bir faiz oranı ile oluşturulacağı yerdir. `src` dizininde `token-helper.ts` adında yeni bir dosya oluşturun.

```typescript
import {
    TOKEN_2022_PROGRAM_ID,
    createInitializeInterestBearingMintInstruction,
    createInitializeMintInstruction,
} from "@solana/spl-token";
import {
    sendAndConfirmTransaction,
    Connection,
    Keypair,
    Transaction,
    PublicKey,
    SystemProgram,
} from "@solana/web3.js";

export async function createTokenWithInterestRateExtension(
    connection: Connection,
    payer: Keypair,
    mint: PublicKey,
    mintLen: number,
    rateAuthority: Keypair,
    rate: number,
    mintKeypair: Keypair,
) {
    const mintAuthority = payer;
    const decimals = 9;
}
```

Bu fonksiyon aşağıdaki argümanları alacaktır:

- `connection`: Bağlantı nesnesi
- `payer`: İşlem için ödeyici
- `mint`: Yeni mint için genel anahtar
- `rateAuthority`: Tokenı değiştirebilen hesabın anahtar çifti, bu durumda, bu `payer`dır
- `rate`: Token için seçilen faiz oranı. Bizim durumumuzda, bu `32_767`, yani faizli token uzantısının maksimum oranıdır.
- `mintKeypair`: Yeni mint için anahtar çifti

Faizli bir token oluştururken, hesap talimatlarını oluşturmak, faiz talimatını eklemek ve mint'i başlatmak zorundayız. `src/token-helper.ts` içindeki `createTokenWithInterestRateExtension`'da, faizli token oluşturmak için kullanılacak birkaç değişken zaten yaratılmıştır. Aşağıdaki kodu belirtilmiş değişkenlerin altına ekleyin:

```ts
const extensions = [ExtensionType.InterestBearingConfig];
const mintLen = getMintLen(extensions);
const mintLamports =
    await connection.getMinimumBalanceForRentExemption(mintLen);

const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports: mintLamports,
        programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeInterestBearingMintInstruction(
        mint,
        rateAuthority.publicKey,
        rate,
        TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
        mint,
        decimals,
        mintAuthority.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID,
    ),
);

await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    undefined,
);
```

Token oluşturma işlemi bu kadar! Şimdi, test eklemeye başlayabiliriz.

#### 5. Gerekli hesapları oluşturma

`src/index.ts` içinde, başlangıç kodu zaten faizli token oluşturma ile ilgili bazı değerler içermektedir.

Mevcut `rate` değişkeninin altına, faizli token yaratmak için `createTokenWithInterestRateExtension` fonksiyon çağrısını ekleyin. Ayrıca, faizli tokenları mintlemek için kullanacağımız ilişkili bir token hesabı oluşturmamız gerekecek ve birikmiş faizin beklendiği gibi artıp artmadığını kontrol etmek için birkaç test yapacağız.

```typescript
const rate = 32_767;

// Faizli token oluşturun
await createTokenWithInterestRateExtension(
    connection,
    payer,
    mint,
    rateAuthority,
    rate,
    mintKeypair,
);

// İlişkili token hesabı oluşturun
const payerTokenAccount = await createAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
);
```

### 6. Testler

Herhangi bir test yazmadan önce, `mint` alarak mevcut faiz oranını döndüren bir fonksiyona sahip olmak bizim için yararlı olacaktır.

Bunu başarmak için, SPL kütüphanesinin sağladığı `getInterestBearingMintConfigState` yardımcı fonksiyonunu kullanabiliriz. Ardından, testlerimizde mint'in mevcut faiz oranını günlüklemek için kullanılan bir fonksiyonu oluşturacağız.

Bu fonksiyonun dönüş değeri, aşağıdaki değerlere sahip bir nesne olacaktır:

- `rateAuthority`: Tokenı değiştirebilen hesabın anahtar çifti
- `initializationTimestamp`: Faizli tokenın başlatılma zaman damgası
- `preUpdateAverageRate`: Güncellemeden önceki son oran
- `lastUpdateTimestamp`: Son güncelleme zaman damgası
- `currentRate`: Mevcut faiz oranı

Aşağıdaki türleri ve fonksiyonu ekleyin:

```typescript
// getInterestBearingMint fonksiyonunu oluştur
interface GetInterestBearingMint {
    connection: Connection;
    mint: PublicKey;
}

async function getInterestBearingMint(inputs: GetInterestBearingMint) {
    const { connection, mint } = inputs;
    // mint'in bilgilerini al
    const mintAccount = await getMint(
        connection,
        mint,
        undefined,
        TOKEN_2022_PROGRAM_ID,
    );

    // mint'in faiz durumunu al
    const interestBearingMintConfig =
        await getInterestBearingMintConfigState(mintAccount);

    // mevcut faiz oranını döndür
    return interestBearingMintConfig?.currentRate;
}
```

**Faiz oranını güncelleme**

Solana SPL kütüphanesi, bir tokenın faiz oranını güncellemek için `updateRateInterestBearingMint` adında bir yardımcı fonksiyon sağlar. Bu fonksiyonun düzgün çalışması için, tokenın `rateAuthority`'sı, tokenın oluşturulduğu yetki ile aynı olmalıdır. Eğer `rateAuthority` yanlışsa, tokenı güncellemek bir hata ile sonuçlanacaktır.

:::tip
Doğru yetki ile oranı güncellemeyi deneyen bir test oluşturalım. 
:::

Aşağıdaki fonksiyon çağrılarını ekleyin:

```typescript
// Faiz oranını güncellemeyi deneyin
const initialRate = await getInterestBearingMint({ connection, mint });
try {
    await updateRateInterestBearingMint(
        connection,
        payer,
        mint,
        payer,
        0, // güncellenmiş oran
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID,
    );
    const newRate = await getInterestBearingMint({ connection, mint });

    console.log(
        `✅ - Bu durumun başarılı geçmesini bekliyorduk çünkü oran güncellendi. Eski oran: ${initialRate}. Yeni oran: ${newRate}`,
    );
} catch (error) {
    console.error("Faizi güncelleyebilmeniz gerekiyor.");
}
```

`npx esrun src/index.ts` komutunu çalıştırın. Terminalde şunlardan biri çıkmalıdır: `✅ - Bu durumun başarılı geçmesini bekliyorduk çünkü oran güncellendi. Eski oran: 32767. Yeni oran: 0`.

**Yanlış oran yetkisi ile güncelleme**

Sonraki testimizde, yanlış `rateAuthority` ile faiz oranını güncellemeyi deneyelim. Daha önce `otherAccount` adında bir anahtar çifti oluşturmuştuk. Bu, faiz oranını değiştirmeyi denemek için kullanacağımız `otherAccount` olacaktır.

Önceki testimizin altına aşağıdaki kodu ekleyin:

```typescript
// Faiz oranını güncelleme girişimini yetki dışındaki hesap olarak deneyin.
try {
    await updateRateInterestBearingMint(
        connection,
        otherAccount,
        mint,
        otherAccount, // yanlış yetki
        0, // güncellenmiş oran
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID,
    );
    console.log("Faizi güncelleyebilmeniz gerekiyor.");
} catch (error) {
    console.error(
        `✅ - Sahip yanlış olduğu için bu durumun başarısız olacağını bekliyorduk.`,
    );
}
```

Artık `npx esrun src/index.ts` komutunu çalıştırın. Bu, başarısız olmalı ve `✅ - Sahip yanlış olduğu için bu durumun başarısız olacağına dair bekliyorduk.` günlüklerini çıkarmalıdır.

**Token üretimi ve faiz oranını okuma**

Dolayısıyla faiz oranını güncellemeyi test ettik. Bir hesap daha fazla token mintlediğinde biriken faizin artıp artmadığını nasıl kontrol edebiliriz? Bunu başarmak için, `amountToUiAmount` ve `getAccount` yardımcılarını kullanarak bunu gerçekleştirebiliriz.

5 kez döngü oluşturup her döngüde 100 token mintleyip yeni birikmiş faizi günlükleyelim:

```typescript
// Birikmiş faizi günlükleme
{
    // Token üzerindeki faizi günlükleyin
    for (let i = 0; i < 5; i++) {
        const rate = await getInterestBearingMint({ connection, mint });
        await mintTo(
            connection,
            payer,
            mint,
            payerTokenAccount,
            payer,
            100,
            undefined,
            undefined,
            TOKEN_2022_PROGRAM_ID,
        );

        const tokenInfo = await getAccount(
            connection,
            payerTokenAccount,
            undefined,
            TOKEN_2022_PROGRAM_ID,
        );

        // Birikmiş faizle UI miktarına dönüştür
        const uiAmount = await amountToUiAmount(
            connection,
            payer,
            mint,
            tokenInfo.amount,
            TOKEN_2022_PROGRAM_ID,
        );

        console.log(
            `Birikmiş faiz ile birlikte miktar ${rate}: ${tokenInfo.amount} token = ${uiAmount}`,
        );
    }
}
```

Aşağıdaki günlükleri göreceksiniz:

```typescript
Birikmiş faiz ile birlikte miktar 32767: 100 token = 0.0000001000000207670422
Birikmiş faiz ile birlikte miktar 32767: 200 token = 0.0000002000000623011298
Birikmiş faiz ile birlikte miktar 32767: 300 token = 0.0000003000001246022661
Birikmiş faiz ile birlikte miktar 32767: 400 token = 0.00000040000020767045426
Birikmiş faiz ile birlikte miktar 32767: 500 token = 0.0000005000003634233328
```

Gördüğünüz gibi, daha fazla token mint oldukça faiz oranı artmaktadır!

**Mint yapılandırmasını günlükleme**

Bir nedenle mint yapılandırma durumunu almak zorunda kalırsanız, daha önce oluşturduğumuz `getInterestBearingMintConfigState` fonksiyonunu kullanarak faizli mint durumuyla ilgili bilgileri görüntüleyebiliriz.

```ts
// Faizli mint yapılandırma durumunu günlükleyin
const mintAccount = await getMint(
    connection,
    mint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
);

// Mint Hesabı için Faiz Yapılandırmasını Alın
const interestBearingMintConfig =
    await getInterestBearingMintConfigState(mintAccount);

console.log(
    "\nMint Yapılandırması:",
    JSON.stringify(interestBearingMintConfig, null, 2),
);
```

Bu günlük, aşağıdakine benzer bir çıktı vermelidir:

```typescript
Mint Yapılandırması: {
    "rateAuthority": "Ezv2bZZFTQEznBgTDmaPPwFCg7uNA5KCvMGBNvJvUmS",
    "initializationTimestamp": 1709422265,
    "preUpdateAverageRate": 32767,
    "lastUpdateTimestamp": 1709422267,
    "currentRate": 0
}
```

### Faiz oranı yetkisini güncelle ve faiz oranı

Bu laboratuvarı tamamlamadan önce, faiz taşıyan tokende yeni bir faiz oranı yetkisi belirleyelim ve faiz oranını güncellemeyi deneyelim. Bunu `setAuthority` fonksiyonunu kullanarak ve orijinal yetkiyi belirterek yapıyoruz, oran türünü (bu durumda `InterestRate` için 7) ve yeni yetkilinin genel anahtarını geçiyoruz.

:::tip
**İpuçları:** Yeni yetki ile güncellemeler yapmadan önce mevcut yetkililerin kontrol edilmesi önemlidir.
:::

Yeni yetkiyi belirledikten sonra, faiz oranını güncellemeyi deneyebiliriz.

```typescript
// Faiz oranı yetkisini güncelle ve yeni yetki ile faiz oranını güncellemeyi dene
try {
  await setAuthority(
    connection,
    payer,
    mint,
    rateAuthority,
    AuthorityType.InterestRate, // Oran türü (InterestRate)
    otherAccount.publicKey, // yeni faiz oranı yetkisi,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await updateRateInterestBearingMint(
    connection,
    payer,
    mint,
    otherAccount, // yeni yetki
    10, // güncellenmiş oran
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  const newRate = await getInterestBearingMint({ connection, mint });

  console.log(
    `✅ - Böyle olması bekleniyordu çünkü oran yeni yetki ile güncellenebilir. Yeni oran: ${newRate}`,
  );
} catch (error) {
  console.error(
    `Yeni faiz oranı yetkisi ile faizi güncelleyebilmelisiniz.`,
  );
}
```

:::info
Bu işlemin çalışması bekleniyor ve yeni faiz oranı 10 olmalı.
:::

---

Hepsi bu! Faiz taşıyan bir token oluşturduk, faiz oranını güncelledik ve tokenin güncellenmiş durumunu kaydettik!

## Meydan Okuma

Kendi faiz taşıyan tokeninizi oluşturun. 

:::note
**Not:** Kendi tokeninizi oluştururken dikkat etmeniz gereken bir dizi adım ve parametre bulunmaktadır. 
:::

### İpucu
- Faiz oranını güncellerken, yeni oran değerinin makul ve sürdürülebilir olduğundan emin olun.