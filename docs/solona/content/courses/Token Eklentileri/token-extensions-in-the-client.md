---
title: Kullanıcıdan Token Uzantılarını Kullanma
objectives:
  - Birden fazla Solana token programını müşteri uygulamalarında etkili bir şekilde entegre etmeyi öğrenin
  - SPL TypeScript kitaplığını kapsamlı token işlemleri için etkili bir şekilde kullanmayı öğrenin
description:
  "Web ve mobil uygulamalarda Token Uzantıları programı ile mintler kullanın."
---

## Özet

- `Token Uzantıları Programı`, `Token Programı` ile aynı işlevlerin yanı sıra `uzantılar` ekler.
- Bu iki token programı: `Token Programı` ve `Token Uzantıları Programı`, ayrı adresler kullanır ve doğrudan uyumlu değildir.
- Her ikisini desteklemek, müşteri tarafındaki işlevlerde doğru program kimliğini belirtmeyi gerektirir.
- Varsayılan olarak, SPL program kütüphanesi, başka bir program belirtilmedikçe orijinal **`Token Programı`** kullanır.
- `Token Uzantıları Programı`, ayrıca teknik özel adı olan `Token22` olarak da anılabilir.

---

## Genel Bakış

`Token Uzantıları Programı`, orijinal `Token Programı`nı, uzantılar olarak bilinen ek özellikler ile geliştirmektedir. Bu uzantılar, önceki durumları ele almak için tasarlanmıştır ve geliştiricilerin Solana Program Kütüphanesini çatal yapıp değiştirmesiyle sonuçlanan ayrık ekosistemler ve benimseme zorlukları yaratmıştır. Token Uzantıları Programının tanıtımı, bu durumların etkili bir şekilde ele alınmasını sağlar.

> **Not:** `Token Programı` ve `Token Uzantıları Programı` farklı on-chain programları oldukları için uyumlu değildir. Örneğin, `Token Uzantıları Programı` ile çıkarılan bir token, `Token Programı` ile transfer edilemeyebilir. Sonuç olarak, tüm SPL token'larını görüntülemek veya desteklemek için gerekli olan herhangi bir müşteri tarafı uygulamasında her iki programı da desteklememiz gerekecek. Bu, orijinal Token Programı'ndan (adres: `TOKEN_PROGRAM_ID`) ve Uzantı Programı'ndan (adres: `TOKEN_2022_PROGRAM_ID`) mintleri açıkça işleyeceğimiz anlamına gelir.

Neyse ki, iki programın arayüzleri tutarlıdır ve bu, yalnızca program kimliğini değiştirerek `spl-token` yardımcı işlevlerinin her iki programda da kullanılabilmesini sağlar (fonksiyon, herhangi bir program kimliği sağlanmadığı takdirde varsayılan olarak orijinal Token Programını kullanır). Çoğu zaman, son kullanıcılar belirli token programının kullanılmasından endişe duymazlar. Bu nedenle, her iki token çeşidinden gelen detayları takip etmek, derlemek ve birleştirmek için ek bir mantık uygulamak, akıcı bir kullanıcı deneyimi sağlamak açısından önemlidir.

Son olarak, "Token 22" genellikle teknik ad olarak kullanılmaktadır. Birinin Token 22 Programı'na atıfta bulunduğunu gördüğünüzde, Token Uzantıları Programı'na atıfta bulunduğunu bilmelisiniz.

---

### Token Programı Token'ları ile Token Uzantıları Token'ları Arasındaki Farklar

> **Uyarı:** Mintler ve token'larla etkileşimde bulunurken, doğru Token Programını kullandığımızdan emin olmamız gerekir. Bir `Token Programı` minti oluşturmak için `Token Programı` kullanın; uzantılar ile bir mint oluşturmak için `Token Uzantıları Programı`nı kullanın.

Neyse ki, `spl-token` paketi bunu basit hale getiriyor. Hem `TOKEN_PROGRAM_ID` hem de `TOKEN_2022_PROGRAM_ID` sabitlerini sağlar ve program kimliği girdi olarak alan tüm token oluşturma ve mintleme yardımcı işlevlerine sahiptir.


  **Not**
  `spl-token`, aksi belirtilmediği sürece `TOKEN_PROGRAM_ID` kullanmayı varsayılan olarak ayarlar. Token Uzantıları Programı ile ilgili tüm fonksiyon çağrıları için `TOKEN_2022_PROGRAM_ID`'yi açıkça geçtiğinizden emin olun. Aksi takdirde, şu hatayı alırsınız: `TokenInvalidAccountOwnerError`.


---

### Hem Token hem de Uzantı Token'ları ile Çalışırken Dikkat Edilmesi Gerekenler

Her ne kadar bu iki programın arayüzleri tutarlı kalsa da, iki farklı programdır. Bu programların program kimlikleri benzersiz ve değiştirilemezdir; bu da kullanıldıklarında farklı adreslerle sonuçlanır. Hem `Token Programı` token'larını hem de `Token Uzantıları Programı` token'larını desteklemek istiyorsanız, müşteri tarafında ek bir mantık eklemeniz gerekir.

---

### İlişkili Token Hesapları (ATA)

Bir İlişkili Token Hesabı (ATA), adresi, cüzdanın ortak anahtarına, token'ın mintine ve token programına dayanarak türetilen bir Token Hesabıdır. Bu mekanizma, her bir mint için kullanıcı başına belirleyici bir Token Hesabı adresi sağlar. ATA hesabı genellikle çoğu sahip için varsayılan hesaptır. Neyse ki, ATAlar her iki token programı ile de aynı şekilde işlenmektedir.

Her token programı için ATA yardımcı işlevlerini sağlamak için istediğimiz program kimliğini verebiliriz.

`getOrCreateAssociatedTokenAccount` çağrısında Token Uzantıları Programını kullanmak istiyorsak, `tokenProgramId` parametresi için `TOKEN_2022_PROGRAM_ID`'yi geçirebiliriz:

```ts
const tokenProgramId = TOKEN_2022_PROGRAM_ID;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mintAddress,
  payer.publicKey,
  true,
  "finalized",
  { commitment: "finalized" },
  tokenProgramId, // Token Program token'ları için TOKEN_PROGRAM_ID ve Token Uzantıları Programı token'ları için TOKEN_2022_PROGRAM_ID
);
```

ATA'nın adresini baştan oluşturmak için doğru tohumları sağlayarak `findProgramAddressSync` fonksiyonunu kullanabiliriz:

```ts
function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey,
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(), // TOKEN_2022_PROGRAM_ID ile Token22 token'ları için TOKEN_PROGRAM_ID'yi değiştirin
      tokenMintAddress.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0];
}
```

---

### Token'ları Fetch Etme

Token Programı veya Token Uzantıları Programı ile yapılmış token'lar arasında herhangi bir fark yoktur. Bu, token'ları fetch etme konusunda Token Programı veya Token Uzantıları Programı token'ları arasında bir fark olmadığı anlamına gelir. Tek yapmamız gereken doğru token programını sağlamak:

```ts
const tokenAccounts = await connection.getTokenAccountsByOwner(
  walletPublicKey,
  { programId: TOKEN_PROGRAM_ID }, // veya TOKEN_2022_PROGRAM_ID
);
```

Belirli bir sahibin tüm token’larını fetch etmek istiyorsak, `getTokenAccountsByOwner` gibi bir fonksiyonu kullanabiliriz ve bunu iki kez çağırabiliriz; bir kez `TOKEN_PROGRAM_ID` ile ve bir kez `TOKEN_2022_PROGRAM_ID` ile.

```ts
const allOwnedTokens = [];
const tokenAccounts = await connection.getTokenAccountsByOwner(
  wallet.publicKey,
  { programId: TOKEN_PROGRAM_ID },
);
const tokenExtensionAccounts = await connection.getTokenAccountsByOwner(
  wallet.publicKey,
  { programId: TOKEN_2022_PROGRAM_ID },
);

allOwnedTokens.push(...tokenAccounts, ...tokenExtensionAccounts);
```


  **Not**
  Token'ı fetch ettikten sonra, token programını saklamak ve token ile ilişkilendirmek isteyebilirsiniz.


---

#### Sahiplik Programını Kontrol Etme

Belirli bir hesap için token programını bilmediğiniz bir senaryo ile karşılaşabilirsiniz. Neyse ki, `getParsedAccountInfo` bize sahiplik programını belirlememize izin verecektir:

```typescript
const accountInfo = await connection.getParsedAccountInfo(mintAddress);
if (accountInfo.value === null) {
  throw new Error("Hesap bulunamadı");
}

const programId = accountInfo.value.owner; // Token Programı mint adresi için TOKEN_PROGRAM_ID ve Token Uzantıları Programı mint adresi için TOKEN_2022_PROGRAM_ID döndürecektir

// Şimdi programId'yi kullanarak token'ları fetch ediyoruz
const tokenAccounts = await connection.getTokenAccountsByOwner(
  wallet.publicKey,
  { programId },
);
```


  **Not**
  Sahiplik programını fetch ettikten sonra, o sahipliği saklamak ve mintler/token'larla ilişkilendirmek iyi bir fikir olabilir.


---

## Laboratuvar - Bir Script'e Uzantı Token Desteği Ekleme

Mevcut bir script'e Token Uzantıları desteği eklediğimiz bütünsel bir örnek üzerinden çalışalım. Bu laboratuvar, orijinal Token Programı ve uzantı karşıtı için yetenekleri ve ince ayrıntıları benimsemek için gerekli ayarlara ve genişletmelere rehberlik edecektir.

Bu laboratuvarın sonunda, bu iki ayrı ama ilişkili token sistemini desteklemenin karmaşıklıklarına yol almış olacağız ve scriptimizin her iki sistemle de sorunsuz bir şekilde etkileşimde bulunmasını sağlayacağız.

---

#### 1. Başlangıç kodunu klonlayın

Başlamak için, [bu laboratuvarın deposunu](https://github.com/Unboxed-Software/solana-lab-token22-in-the-client/) klonlayın ve `starter` dalına geçin. Bu dal, sizi başlatmak için bazı yardımcı dosyalar ve biraz şablon kod içerir.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-token22-in-the-client.git
cd solana-lab-token22-in-the-client
git checkout starter
```

Bağımlılıkları kurmak için `npm install` komutunu çalıştırın.

---

#### 2. Başlangıç koduyla tanışın

Başlangıç kodu aşağıdaki dosyalarla birlikte gelir:

- `print-helpers.ts`
- `index.ts`

**`print-helpers.ts`** dosyası, verileri yapılandırılmış bir formatta konsola çıktı vermek üzere tasarlanmış **`printTableData`** adında bir fonksiyon içerir. Bu fonksiyon, herhangi bir nesneyi argüman olarak kabul edebilir ve verileri okunabilir bir tablo formatında görüntülemek için NodeJS tarafından sağlanan **`console.table`** yöntemini kullanır.

Son olarak, `index.ts` ana scriptimizi içerir. Şu anda yalnızca bir bağlantı oluşturur ve `payer` için anahtar çiftini oluşturmak üzere `initializeKeypair` fonksiyonunu çağırır.

---

#### 3. Doğrulayıcı düğümünü çalıştırın (İsteğe bağlı)

İsteğe bağlı olarak, devnet yerine kendi yerel doğrulayıcınızı çalıştırmak isteyebilirsiniz. Bu, havale ile ilgili herhangi bir sorunu aşmanın iyi bir yoludur.

Ayrı bir terminalde, aşağıdaki komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştırır ve bazı anahtarlar ve değerler de kaydeder. Bağlantımızda kullanmamız gereken değer, bu durumda `http://127.0.0.1:8899` olan JSON RPC URL'sidir. Bunu bağlantıda yerel RPC URL'sini kullanmak için kullanıyoruz.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Devnet'i kullanmak ve kendi devnet cüzdanınızı sağlamak istiyorsanız hala yapabilirsiniz - sadece `Connection` ve `initializeKeypair`'ye anahtar çiftini sağlamaya yeniden yapılandırın.

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

Şu ana kadar her şeyin düzgün çalışıp çalışmadığını test edelim ve `npm run start` komutunu çalıştıralım. Terminalinizde `payer` kamu anahtarının kaydedildiğini görmelisiniz.

---

#### 4. Token Programı ve Token Uzantıları Programı mintlerini oluşturun

Token Programı ve Token Uzantıları Programı kullanarak yeni token mintleri oluşturmaya başlayalım.

Yeni bir dosya oluşturun ve adını `create-and-mint-token.ts` koyun. Bu dosyada `createAndMintToken` adında bir fonksiyon oluşturacağız. İsimden de anlaşılacağı gibi, bir mint oluşturacak, token hesabı (ATA) oluşturacak ve ardından bu hesaba bir miktar token mintleyecek.

Bu `createAndMintToken` fonksiyonu içinde `createMint`, `getOrCreateAssociatedTokenAccount` ve `mintTo` çağrıları yapılacaktır. Bu fonksiyon, kullanılan belirli token programından bağımsız olacak şekilde tasarlanmıştır; bu, tokenların yalnızca `Token Programı` veya `Token Uzantıları Programı` ile oluşturulmasını sağlar. Bu yetenek, sağlanan program kimliğine dayalı olarak davranışını uyarlamak için bir program kimliğini parametre olarak kabul ederek elde edilir.

Bu fonksiyona geçeceğimiz argümanlar şunlardır:

- `connection` - Kullanılacak bağlantı nesnesi
- `tokenProgramId` - İşaret edilecek token programı
- `payer` - İşlemi ödeyen anahtar çifti
- `decimals` - Mint için dahil edilecek ondalık sayısı
- `mintAmount` - Ödeyiciye mint edilecek token miktarı

Ve bu, fonksiyonun yapacağı işlemlerdir:

- **`createMint`** kullanarak yeni bir mint oluşturun.
- **`getMint`** ile mint bilgisini alın.
- **`printTableData`** ile mint bilgilerini kaydedin.
- **`getOrCreateAssociatedTokenAccount`** ile ilişkili bir token hesabı oluşturun.
- İlişkili token hesabının adresini kaydedin.
- **`mintTo`** ile ilişkili token hesabına token mintleyin.

Bunların hepsi, son `createAndMintToken` fonksiyonunun görünümüdür:

```ts
import {
  createMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import printTableData from "./print-helpers";

export async function createAndMintToken(
  connection: Connection,
  tokenProgramId: PublicKey,
  payer: Keypair,
  decimals: number,
  mintAmount: number,
): Promise<PublicKey> {
  console.log("\\nYeni bir mint oluşturuluyor...");
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    decimals,
    undefined,
    {
      commitment: "finalized", // confirmOptions argümanı
    },
    tokenProgramId,
  );

  console.log("\\nMint bilgisi alınıyor...");

  const mintInfo = await getMint(connection, mint, "finalized", tokenProgramId);

  printTableData(mintInfo);

  console.log("\\nİlişkili token hesabı oluşturuluyor...");
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    true,
    "finalized",
    { commitment: "finalized" },
    tokenProgramId,
  );

  console.log(`İlişkili token hesabı: ${tokenAccount.address.toBase58()}`);

  console.log("\\nİlişkili token hesabına mintleme yapılıyor...");
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    mintAmount,
    [payer],
    { commitment: "finalized" },
    tokenProgramId,
  );

  return mint;
}

export default createAndMintToken;
```

---

#### 5. Token oluşturma ve mintleme

Şimdi yeni fonksiyonumuzu `index.ts` ana scriptimizde iki kez çağırarak kullanacağız. Hem bir `Token Programı` hem de `Token Uzantıları Programı` token'ını test etmek isteyeceğiz. Yani, iki farklı program kimliğimizi kullanacağız:

```typescript
import { initializeKeypair } from "@solana-developers/helpers";
import { Cluster, Connection } from "@solana/web3.js";
import createAndMintToken from "./create-and-mint-token";
import printTableData from "./print-helpers";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import dotenv from "dotenv";
dotenv.config();

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

console.log(`Ödeyen: ${payer.publicKey.toBase58()}`);

const tokenProgramMint = await createAndMintToken(
  connection,
  TOKEN_PROGRAM_ID,
  payer,
  0,
  1000,
);
const tokenExtensionProgramMint = await createAndMintToken(
  connection,
  TOKEN_2022_PROGRAM_ID,
  payer,
  0,
  1000,
);
```

Bu noktada `npm run start` komutunu çalıştırarak her iki mintin de oluşturulduğunu ve bilgilerin konsola kaydedildiğini görebilirsiniz.

---

#### 6. Token Programı ve Token Uzantıları Programı token'larını fetch etme

Artık token'ları cüzdanın ortak anahtarını ve program kimliğini kullanarak fetch edebiliriz.

Yeni bir dosya oluşturun, adını `fetch-token-info.ts` koyun.

Bu yeni dosya içerisinde, `fetchTokenInfo` fonksiyonunu oluşturun. Bu fonksiyon, sağlanan token hesabını fetch edecek ve yeni bir arayüz oluşturacak `TokenInfoForDisplay` döndürecektir. Bu, dönen verileri konsolda güzel bir şekilde formatlamak için kullanılacaktır. Yine, bu fonksiyon, hesabın hangi token programına ait olduğuna dair kayıtsız olacaktır.

```ts
import { AccountLayout, getMint } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export type TokenTypeForDisplay = "Token Program" | "Token Uzantıları Programı";

export interface TokenInfoForDisplay {
  mint: PublicKey;
  amount: number;
  decimals: number;
  displayAmount: number;
  type: TokenTypeForDisplay;
}
```

Tüm bu bilgileri fetch etmek için `getTokenAccountsByOwner` çağrısı yapacak ve sonuçları yeni `TokenInfoForDisplay` arayüzüne dönüştüreceğiz.

`fetchTokenInfo` fonksiyonu için gereken parametreler şunlardır:

- `connection` - Kullanılacak bağlantı nesnesi
- `owner` - İlişkili token hesaplarının sahibi olan cüzdan
- `programId` - Belirtilmesi gereken token programı
- `type` - Ya `Token Programı` ya da `Token Uzantıları Programı`; konsolda kaydetme amacıyla kullanılır.

```ts
export type TokenTypeForDisplay = "Token Program" | "Token Uzantıları Programı";

export interface TokenInfoForDisplay {
  mint: PublicKey;
  amount: number;
  decimals: number;
  displayAmount: number;
  type: TokenTypeForDisplay;
}

export async function fetchTokenInfo(
  connection: Connection,
  owner: PublicKey,
  programId: PublicKey,
  type: TokenTypeForDisplay,
): Promise<TokenInfoForDisplay[]> {
  const tokenAccounts = await connection.getTokenAccountsByOwner(owner, {
    programId,
  });

  const ownedTokens: TokenInfoForDisplay[] = [];

  for (const tokenAccount of tokenAccounts.value) {
    const accountData = AccountLayout.decode(tokenAccount.account.data);

    const mintInfo = await getMint(
      connection,
      accountData.mint,
      "finalized",
      programId,
    );

    ownedTokens.push({
      mint: accountData.mint,
      amount: Number(accountData.amount),
      decimals: mintInfo.decimals,
      displayAmount: Number(accountData.amount) / 10 ** mintInfo.decimals,
      type,
    });
  }

  return ownedTokens;
}
```

Bu fonksiyonu uygulamak için, önceki `index.ts`'ye iki ayrı çağrı ekleyelim:

```ts
// önceki importlar
import { TokenInfoForDisplay, fetchTokenInfo } from "./fetch-token-info";

// önceki kod
const myTokens: TokenInfoForDisplay[] = [];

myTokens.push(
  ...(await fetchTokenInfo(
    connection,
    payer.publicKey,
    TOKEN_PROGRAM_ID,
    "Token Programı",
  )),
  ...(await fetchTokenInfo(
    connection,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID,
    "Token Uzantıları Programı",
  )),
);

printTableData(myTokens);
```

`npm run start` komutunu çalıştırdığınızda, artık ödeyici cüzdanının sahip olduğu tüm token’ların listesi gösterilecektir.

---

#### 7. Token Programı ve Token Uzantıları Programı token'larını program kimliği olmadan fetch etme

Artık belirli bir mint hesabından sahiplik programını nasıl alacağımıza bir göz atalım.

Bunu yapmak için, `fetch-token-info.ts` dosyasına yeni bir `fetchTokenProgramFromAccount` fonksiyonu oluşturacağız. Bu fonksiyon, bize verilen mint'in `programId`'sini basitçe döndürecektir.

Bunu gerçekleştirmek için `getParsedAccountInfo` fonksiyonunu çağıracak ve `.value.owner`dan sahiplik programını döndüreceğiz.

`fetchTokenProgramFromAccount` fonksiyonu için gereken parametreler şunlardır:

- `connection` - Kullanılacak bağlantı nesnesi
- `mint` - Mint hesabının ortak anahtarı

Son fonksiyon görünümü şu şekilde olacaktır:

```ts
// önceki importlar ve kod

export async function fetchTokenProgramFromAccount(
  connection: Connection,
  mint: PublicKey,
) {
  // Mintten program ID'sini bularak döndür
  const accountInfo = await connection.getParsedAccountInfo(mint);
  if (accountInfo.value === null) {
    throw new Error("Hesap bulunamadı");
  }
  const programId = accountInfo.value.owner;
  return programId;
}
```

Son olarak, `index.ts` dosyamıza buna uygun bir örnek ekleyelim:

```ts
// önceki importlar
import {
  TokenInfoForDisplay,
  fetchTokenInfo,
  fetchTokenProgramFromAccount,
} from "./fetch-token-info";

// önceki kod
const tokenProgramTokenProgram = await fetchTokenProgramFromAccount(
  connection,
  tokenProgramMint,
);
const tokenExtensionProgramTokenProgram = await fetchTokenProgramFromAccount(
  connection,
  tokenExtensionProgramMint,
);

if (!tokenProgramTokenProgram.equals(TOKEN_PROGRAM_ID))
  throw new Error("Token Program mint token programı doğru değil");
if (!tokenExtensionProgramTokenProgram.equals(TOKEN_2022_PROGRAM_ID))
  throw new Error("Token Uzantıları Programı mint token programı doğru değil");
```

Son kez, `npm run start` komutunu yeniden çalıştırdığınızda aynı çıktıyı göreceksiniz - bu, beklenen token programlarının doğru olduğunu gösterir.

Hepsi bu kadar! Eğer herhangi bir adımda takılırsanız, [bu laboratuvarın deposundaki](https://github.com/Unboxed-Software/solana-lab-token22-in-the-client/) `solution` dalında tamamlanmış kodu bulabilirsiniz.

---

## Mücadele

Mücadele olarak, Token Programı token'ları ve Token Uzantıları token'ları için token yakma işlevini uygulamaya çalışın.