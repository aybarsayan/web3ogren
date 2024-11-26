---
title: Token Program ile Token Oluşturma
objectives:
  - Token mints oluştur
  - Token meta verisi oluştur
  - İlgili token hesapları oluştur
  - Token mintle
  - Token transfer et
description:
  "Tokenların - hem normal tokenlar hem de NFT'ler - Solana üzerinde nasıl oluşturulduğunu, saklandığını ve transfer edildiğini anlayın."
---

### Özet

- SOL'un Solana'nın 'yerel token'ı olduğunu hatırlıyor olabilirsiniz. Diğer tüm tokenlar, fungible
  ve non-fungible tokenlar (NFT'ler), **SPL Tokenlar** olarak adlandırılır.
- **Token Programı**, SPL Tokenlar oluşturmak ve onlarla etkileşimde bulunmak için talimatlar içerir.
  
:::info
**Token Mints**, belirli bir tokenı tanımlayan hesaplardır. Bu, tokenın kendisi hakkında bilgi içerir (kaç ondalık basamağa sahip olduğu gibi), daha fazla token mintlemek için izin verilen hesap (bu **mint authority** olarak adlandırılır) ve token hakkında daha fazla bilgi bulmak için nerelere bakılacağı gibi bilgiler içerir.
:::
  
- Mint authority, token minti kullanarak daha fazla token yapabilir!
- **Token Hesapları**, belirli bir Token Mint’in tokenlarını tutar. Çoğu kullanıcı için, her bir token mintinin bakiyeleri **İlgili Token Hesapları** olarak adlandırılan hesaplarda saklanır - bunlar, cüzdan adresleri ve tokenin minti ile oluşturulan adreslerdir.
- Token Mints ve Token Hesapları oluşturmak, SOL ile **kira** ayırmayı gerektirir. Bir Token Hesabı için kira, hesap kapatıldığında geri ödenebilir. Ayrıca, `Token Extensions Program` ile oluşturulan tokenlar da Token Mints'leri kapatabilir.

---

### Ders

Token Programı, Solana Program Kütüphanesi (SPL) tarafından sağlanan birçok programdan biridir. SPL Tokenlar oluşturmak ve onlarla etkileşimde bulunmak için talimatlar içerir. Bu tokenlar, Solana ağı üzerindeki tüm yerel olmayan (yani SOL olmayan) tokenları temsil eder.

Bu ders, Token Programını kullanarak yeni bir SPL Token oluşturma ve yönetme temellerine odaklanacaktır:

1. Yeni bir Token Mint oluşturma
2. Token Hesapları oluşturma
3. Mintleme
4. Tokenları bir tutucudan diğerine transfer etme

Bunu geliştirme sürecinin istemci tarafında `@solana/spl-token` JavaScript kütüphanesini kullanarak ele alacağız.

#### Token Mint

Yeni bir SPL Token oluşturmak için önce bir Token Mint oluşturmanız gerekir. Token Mint, belirli bir token hakkında veri tutan bir hesaptır.

Örneğin, [USD Coin (USDC) Solana Explorer'da](https://explorer.solana.com/address/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v) bakalım. USDC'nin Token Mint adresi `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`'dir. Explorer ile, USDC'nin Token Mint'i hakkında mevcut token arzı, mint ve freeze authority adresleri ve tokenın ondalık hassasiyeti gibi belirli ayrıntıları görebiliriz.

![USDC Token Mint](../../../images/solana/public/assets/courses/unboxed/token-program-usdc-mint.png)

Yeni bir Token Mint oluşturmak için Token Programına doğru işlem talimatlarını göndermeniz gerekir. Bunu yapmak için `@solana/spl-token` kütüphanesinden `createMint` fonksiyonunu kullanacağız.

```typescript
const tokenMint = await createMint(
  connection,
  payer,
  mintAuthority,
  freezeAuthority,
  decimal,
);
```

`createMint` fonksiyonu yeni token mintinin `publicKey`'sini döndürür. Bu fonksiyon aşağıdaki argümanları gerektirir:

- `connection` - küme için JSON-RPC bağlantısı
- `payer` - işlemin ödenecek olan `publicKey`
- `mintAuthority` - token minti üzerinden tokenları gerçek mintlemek için yetkilendirilmiş hesap.
- `freezeAuthority` - bir token hesabındaki tokenları dondurmak için yetkilendirilmiş bir hesap. Dondurma istenmiyorsa, parametre null olarak ayarlanabilir.
- `decimals` - tokenın istenen ondalık hassasiyetini belirler.

:::tip
Eğer gizli anahtarınıza erişimi olan bir betikten yeni bir mint oluşturuyorsanız, `createMint` fonksiyonunu basitçe kullanabilirsiniz. Ancak, kullanıcıların yeni bir token minti oluşturmasına izin veren bir web sitesi oluşturuyorsanız, bunu kullanıcıların gizli anahtarını tarayıcıya açmadan, kullanıcının gizli anahtarı ile yapmanız gerekir. Bu durumda, doğru talimatlarla bir işlem oluşturup göndermek isteyeceksiniz.
:::

Altında, `createMint` fonksiyonu, iki talimat içeren bir işlem oluşturuyor:

1. Yeni bir hesap oluştur
2. Yeni bir mint başlat

Bu şöyle görünür:

```typescript
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

async function buildCreateMintTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  decimals: number,
): Promise<web3.Transaction> {
  const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
  const accountKeypair = web3.Keypair.generate();
  const programId = token.TOKEN_PROGRAM_ID;

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeypair.publicKey,
      space: token.MINT_SIZE,
      lamports,
      programId,
    }),
    token.createInitializeMintInstruction(
      accountKeypair.publicKey,
      decimals,
      payer,
      payer,
      programId,
    ),
  );

  return transaction;
}
```

Yeni bir token mint oluşturmak için talimatları manuel olarak oluştururken, hesaba ve minti başlatma talimatlarını _aynı işlemi_ eklemeyi unutmayın. Her adımı ayrı bir işlemde yapıyorsanız, teorik olarak, oluşturduğunuz hesabı bir başkasının alması ve kendi minti için başlatması mümkün olabilir.

---

#### Kira ve Kira Muafiyeti

Önceki kod kesitinin fonksiyon gövdesindeki ilk satırın `getMinimumBalanceForRentExemptMint` çağrısı içerdiğini ve bunun `createAccount` fonksiyonuna geçirildiğini unutmayın. Bu, kira muafiyeti denilen hesap başlatma işleminin bir parçasıdır.

Son zamanlarda, Solana'daki tüm hesapların, deallocate edilmemek için aşağıdakilerden birini yapması gerekiyordu:

1. Belirli aralıklarla kira ödemek
2. Başlatma sırasında kira muafiyeti için yeterli SOL yatırmak

Son zamanlarda, ilk seçenek kaldırıldı ve yeni bir hesabı başlatırken kira muafiyeti için yeterli SOL yatırmak bir gereklilik haline geldi.

Bu durumda, bir token mint için yeni bir hesap oluşturuyoruz, bu yüzden `@solana/spl-token` kütüphanesinden `getMinimumBalanceForRentExemptMint` kullanıyoruz. Ancak, bu kavram tüm hesaplar için geçerlidir ve oluşturmanız gereken diğer hesaplar için `Connection` üzerinde daha genel `getMinimumBalanceForRentExemption` yöntemini de kullanabilirsiniz.

---

#### Token Hesabı

Tokenları mintlemek (yeni arz etmek) için, yeni çıkarılmış tokenları tutacak bir Token Hesabına ihtiyacınız vardır.

Bir Token Hesabı, belirli bir "mint"e ait tokenları tutar ve hesabın belirli bir "sahibi" vardır. Sadece sahip, Token Hesap bakiyesini azaltma yetkisine (transfer, yakma, vb.) sahiptir, oysa herkes Token Hesabına token gönderebilir ve bakiyesini artırabilir.

:::tip
Yeni Token Hesabını oluşturmak için `spl-token` kütüphanesinin `createAccount` fonksiyonunu kullanabilirsiniz:
:::

```typescript
const tokenAccount = await createAccount(
  connection,
  payer,
  mint,
  owner,
  keypair,
);
```

`createAccount` fonksiyonu yeni token hesabının `publicKey`'sini döndürür. Bu fonksiyon aşağıdaki argümanları gerektirir:

- `connection` - küme için JSON-RPC bağlantısı
- `payer` - işlemin ödenecek olan hesabı
- `mint` - yeni token hesabının ilişkili olduğu token mint
- `owner` - yeni token hesabının sahibinin hesap
- `keypair` - bu, yeni token hesabı adresini belirtmek için isteğe bağlı bir parametredir. Eğer no keypair sağlanmazsa, `createAccount` fonksiyonu ilişkili `mint` ve `owner` hesaplarından türetilen bir varsayılan kullanır.

Lütfen bu `createAccount` fonksiyonunun, `createMint` fonksiyonunun içindeki `createAccount` fonksiyonundan farklı olduğunu unutmayın. Daha önce, tüm hesapları oluşturmak için talimatı döndürmek için `SystemProgram` üzerinde `createAccount` fonksiyonunu kullandık. Buradaki `createAccount` fonksiyonu ise, iki talimat içeren bir işlem sunan `spl-token` kütüphanesinde yardımcı bir fonksiyondur. İlk önce hesabı oluşturur ve ikinci olarak hesabı Token Hesabı olarak başlatır.

Token Mint oluşturmada olduğu gibi, `createAccount` için işlemi manuel olarak oluşturmak istiyorsak, fonksiyonun altındaki işlemi kopyalayıp yeniden yazabiliriz:

1. `mint` ile ilişkilendirilmiş olan veriyi almak için `getMint` kullanın
2. Token hesabı için gerekli olan alanı hesaplamak için `getAccountLenForMint` kullanın
3. Kira muafiyeti için gereken lamports'u hesaplamak için `getMinimumBalanceForRentExemption` kullanın
4. `SystemProgram.createAccount` ve `createInitializeAccountInstruction` kullanarak yeni bir işlem oluşturun. Not: Bu `createAccount` `@solana/web3.js`'ten gelir ve genel bir yeni hesap oluşturmak için kullanılır. `createInitializeAccountInstruction` bu yeni hesabı kullanarak yeni token hesabını başlatır.

```typescript
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

async function buildCreateTokenAccountTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  mint: web3.PublicKey,
): Promise<web3.Transaction> {
  const mintState = await token.getMint(connection, mint);
  const accountKeypair = await web3.Keypair.generate();
  const space = token.getAccountLenForMint(mintState);
  const lamports = await connection.getMinimumBalanceForRentExemption(space);
  const programId = token.TOKEN_PROGRAM_ID;

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeypair.publicKey,
      space,
      lamports,
      programId,
    }),
    token.createInitializeAccountInstruction(
      accountKeypair.publicKey,
      mint,
      payer,
      programId,
    ),
  );

  return transaction;
}
```

---

#### İlgili Token Hesapları

Bir İlgili Token Hesabı, aşağıdaki gibi bir adreste tokenları saklar:

- Sahiplerin public key'i
- Token mint

Örneğin, Bob'un USDC'si, Bob'un public key'i ve USDC mint adresinden oluşturulmuş bir İlgili Token Hesabında saklanır.

:::note
İlgili Token Hesapları, belirli bir `publicKey` için belirli bir token ile ilişkili Token Hesabını bulmanın kesin bir yolunu sağlar.
:::

Token hesapları oluşturmanın diğer yolları da vardır (özellikle zincir içi programlar için), ancak genellikle kullanıcılar için token saklamak istediğinizde, bunun bir İlgili Token Hesabı olmasını istersiniz. Kullanıcı zaten bu token için bir ATA'ya sahip olmasa bile, adresi bulup bu hesabı onlara oluşturabilirsiniz.

![ATAs are PDAs](../../../images/solana/public/assets/courses/unboxed/atas-are-pdas.svg)

İlgili token hesabı oluşturmak için `spl-token` kütüphanesinin `createAssociatedTokenAccount` fonksiyonunu kullanabilirsiniz.

```typescript
const associatedTokenAccount = await createAssociatedTokenAccount(
  connection,
  payer,
  mint,
  owner,
);
```

Bu fonksiyon, yeni ilgili token hesabının `publicKey`'sini döndürür ve aşağıdaki argümanları gerektirir:

- `connection` - küme için JSON-RPC bağlantısı
- `payer` - işlemin ödenecek olan hesabı
- `mint` - yeni token hesabının ilişkili olduğu token mint
- `owner` - yeni token hesabının sahibinin hesap

`getOrCreateAssociatedTokenAccount` fonksiyonunu kullanarak, belirli bir adresle ilişkili Token Hesabını almak veya mevcut değilse oluşturmak da mümkündür. Örneğin, bir kullanıcıya token airdrop yapmak için kod yazıyorsanız, bu fonksiyonu kullanarak verilen kullanıcı ile ilişkili token hesabının var olup olmadığını kontrol edersiniz ve yoksa oluşturursunuz.

:::tip
Altında, `createAssociatedTokenAccount` iki şey yapıyor:
1. `mint` ve `owner`'dan ilişkili token hesap adresini türetmek için `getAssociatedTokenAddress`'i kullanıyor
2. `createAssociatedTokenAccountInstruction` talimatlarından bir işlem oluşturarak
:::

```typescript
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

async function buildCreateAssociatedTokenAccountTransaction(
  payer: web3.PublicKey,
  mint: web3.PublicKey,
): Promise<web3.Transaction> {
  const associatedTokenAddress = await token.getAssociatedTokenAddress(
    mint,
    payer,
    false,
  );

  const transaction = new web3.Transaction().add(
    token.createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAddress,
      payer,
      mint,
    ),
  );

  return transaction;
}
```

---

#### Token Mintlemek

Token mintleme, yeni tokenları dolaşıma sokma sürecidir. Tokenları mintlediğinizde, token mintinin arzını artırır ve yeni mintlenen tokenları bir token hesabına yatırırsınız. Sadece bir token mintinin mint authority'si yeni tokenları mintlemek için yetkilidir.

`spl-token` kütüphanesini kullanarak token mintlemek için `mintTo` fonksiyonunu kullanabilirsiniz.

```typescript
const transactionSignature = await mintTo(
  connection,
  payer,
  mint,
  destination,
  authority,
  amount,
);
```

`mintTo` fonksiyonu, Solana Explorer'da görüntülenebilen bir `TransactionSignature` döndürür. `mintTo` fonksiyonu aşağıdaki argümanları gerektirir:

- `connection` - küme için JSON-RPC bağlantısı
- `payer` - işlemin ödenecek olan hesabı
- `mint` - yeni token hesabının ilişkili olduğu token mint
- `destination` - tokenların mintleneceği token hesabı
- `authority` - token mintlemek için yetkilendirilmiş hesap
- `amount` - ondalıkları hariç mintlenecek tokenların ham miktarı, örneğin, Scrooge Coin mintinin ondalık özelliği 2 olarak ayarlanmışsa, 1 tam Scrooge Coin almak için bu özelliği 100 olarak ayarlamanız gerekir.

:::tip
Mintten sonra mint authority'yi null olarak güncellemek yaygın bir durumdur. Bu, maksimum bir arz belirler ve gelecekte hiçbir tokenın mintlenemeyeceğini garanti eder. Tersi olarak, mint authority bir programa verilebilir, böylece tokenlar düzenli aralıklarla veya programlanabilir koşullara göre otomatik olarak mintlenebilir.
:::

Altında, `mintTo` fonksiyonu, `createMintToInstruction` fonksiyonundan elde edilen talimatlarla bir işlem oluşturur.

```typescript
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

async function buildMintToTransaction(
  authority: web3.PublicKey,
  mint: web3.PublicKey,
  amount: number,
  destination: web3.PublicKey,
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createMintToInstruction(mint, destination, authority, amount),
  );

  return transaction;
}
```

---

#### Token Transfer Etmek

SPL Token transferleri, hem gönderici hem de alıcının transfer edilen tokenların minti için token hesaplarına sahip olmasını gerektirir. Tokenlar, göndericinin token hesabından alıcının token hesabına transfer edilir.

Alıcının ilişkili token hesabını elde etmek için `getOrCreateAssociatedTokenAccount` kullanabilirsiniz, bu da transferden önce token hesabının var olduğundan emin olmanıza yardımcı olur. Hesap mevcut değilse, bu fonksiyon, hesabın oluşturulması için gereken lamportları, işlemin payer'ına tahsil ederek oluşturur.

Alıcının token hesabı adresini bildiğinizde, transfer işlemini, `spl-token` kütüphanesinin `transfer` fonksiyonu ile gerçekleştirirsiniz.

```typescript
const transactionSignature = await transfer(
  connection,
  payer,
  source,
  destination,
  owner,
  amount,
);
```

`transfer` fonksiyonu, Solana Explorer'da görüntülenebilen bir `TransactionSignature` döndürür. `transfer` fonksiyonu aşağıdaki argümanları gerektirir:

- `connection` - küme için JSON-RPC bağlantısı
- `payer` - işlemin ödenecek olan hesabı
- `source` - tokenları gönderen token hesabı
- `destination` - tokenları alan token hesabı
- `owner` - `source` token hesabının sahibinin hesap
- `amount` - transfer edilecek token miktarı

:::warning
Altında, `transfer` fonksiyonu, `createTransferInstruction` fonksiyonundan alınan talimatlarla bir işlem oluşturur:
:::

```typescript
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

async function buildTransferTransaction(
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number,
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createTransferInstruction(source, destination, owner, amount),
  );

  return transaction;
}
```

---

### Laboratuvar

Token Programını kullanarak bir Token Mint oluşturacağız, bir İlgili Token Hesabı oluşturacağız, token mintleyeceğiz, token transfer edeceğiz ve token yakacağız.

Zaten bir `.env` dosyanızın olduğunu varsayıyoruz ve bir `SECRET_KEY` ayarı yapıldı `Kriptografi temelleri`.

```bash
npm i @solana/web3.js@1 @solana/spl-token @solana-developers/helpers@2 esrun
```

#### Token Mint Oluştur

`create-token-mint.ts` adında boş bir dosya oluşturun. Anahtar çiftlerimizi yükledikten sonra, `createMint()` çağrısında bulunacağız ve `user`'ı `payer`, `mintAuthority` ve `freezeAuthority` olarak ayarlayacağız.

Token mintini, token üreten fabrikayı düşünün. Bizim `user`'ımız, `mintAuthority` olarak, fabrikayı işleten kişidir.

```typescript filename="create-token-mint.ts"
import { createMint } from "@solana/spl-token";
import "dotenv/config";
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Anahtar çiftini güvenli bir şekilde yükledik, bir env dosyası kullanıyoruz! Public key'imiz: ${user.publicKey.toBase58()}`,
);

// Bu, şu işlemi çalıştırır:
// SystemProgram.createAccount()
// token.createInitializeMintInstruction()
// Bkz. https://www.soldev.app/course/token-program
const tokenMint = await createMint(connection, user, user.publicKey, null, 2);

const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅ Tamamlandı! Oluşturulan token mint: ${link}`);
```

Betik `npx esrun create-token-mint.ts` kullanılarak çalıştırılmalıdır. Aşağıdakini görmelisiniz.

```bash
✅ Tamamlandı! Oluşturulan token mint: https://explorer.solana.com/address/HYeUCAqdsQBkqQNHRoBPov42QySDhwM7zAqiorToosbz?cluster=devnet
```

Solana Explorer'ı açın ve yeni tokeninizi kontrol edin!

**Mint adresini aklınızda tutun! Bunu daha sonra kullanacağız.**

#### Bazı token meta verileri oluşturun

Token hesabımızın güzel bir sembolü olmadığını ve Explorer'da 'Bilinmeyen Token' olarak göründüğünü göreceksiniz. Bunun nedeni token'ımızın meta verisinin olmaması! Hadi biraz ekleyelim.

:::tip
Token meta verilerini eklemek, token'larınızın tanınmasını sağlar. 
:::

Metaplex `mpl-token-metadata` Programı'nın 2. sürümünü kullanacağız. Bu, `mpl-token-metadata`'nın en popüler sürümüdür ve daha yeni olan 3. sürüme kıyasla önemli ölçüde karmaşıklığı azaltır.

```bash
npm i @metaplex-foundation/mpl-token-metadata@2
```

`create-token-metadata.ts` adında yeni bir dosya oluşturun.

```typescript filename="create-token-metadata.ts"
// Bu, token'lar oluşturmak için "@metaplex-foundation/mpl-token-metadata@2" kullanır
import "dotenv/config";
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

const user = getKeypairFromEnvironment("SECRET_KEY");

const connection = new Connection(clusterApiUrl("devnet"));

console.log(
  `🔑 Anahtar çiftimizi güvenli bir şekilde yükledik, bir env dosyası kullanarak! Genel anahtarımız: ${user.publicKey.toBase58()}`,
);

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

// Token mint hesabınızın adresini buraya ekleyin
const tokenMintAccount = new PublicKey("YOUR_TOKEN_MINT_ADDRESS_HERE");

const metadataData = {
  name: "Solana Eğitim Tokenı",
  symbol: "TRAINING",
  // Arweave / IPFS / Pinata vb. bağlantıyı metaplex standartları ile offchain veri için
  uri: "https://arweave.net/1234",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

const metadataPDAAndBump = PublicKey.findProgramAddressSync([
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    tokenMintAccount.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID,
);

const metadataPDA = metadataPDAAndBump[0];

const transaction = new Transaction();

const createMetadataAccountInstruction =
  createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: tokenMintAccount,
      mintAuthority: user.publicKey,
      payer: user.publicKey,
      updateAuthority: user.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        collectionDetails: null,
        data: metadataData,
        isMutable: true,
      },
    },
  );

transaction.add(createMetadataAccountInstruction);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [user],
);

const transactionLink = getExplorerLink(
  "transaction",
  transactionSignature,
  "devnet",
);

console.log(`✅ İşlem onaylandı, explorer bağlantısı: ${transactionLink}`);

const tokenMintLink = getExplorerLink(
  "address",
  tokenMintAccount.toString(),
  "devnet",
);

console.log(`✅ Token mintine tekrar bakın: ${tokenMintLink}`);
```

`YOUR_TOKEN_MINT_ADDRESS_HERE` kısmını mint adresiniz ile değiştirin ve script'i `npx esrun create-token-metadata.ts` komutunu kullanarak çalıştırın.

:::info
Artık Solana Explorer'ın güncellendiğini ve token'ın adını ve sembolünü mint üzerinde gösterdiğini göreceksiniz!
:::

Solana Explorer'ın aşağıdaki gibi bir uyarı göstereceğini unutmayın:

> Uyarı! Token adları ve logoları benzersiz değildir. Bu token, başka bir token gibi görünmek için adını ve logosunu taklit edebilir. Doğru olup olmadığını kontrol etmek için token'ın mint adresini doğrulayın.  
> — Solana Explorer

Bu uyarı doğrudur - gerçekten herkes herhangi bir token'ın herhangi bir sembole veya isme sahip olmasını sağlayabilir. Ancak referansınız için, eğer çok tanınan bir orijinal token yapıyorsanız, Solana Explorer, [Unified Token List API](https://github.com/solflare-wallet/utl-api) temelinde bir beyaz liste kullanır.

--- 

#### Token'ları saklamak için bir İlişkili Token Hesabı oluşturun

Mint'i oluşturduğumuza göre, artık token'larımızı saklayacak yeni bir İlişkili Token Hesabı oluşturalım. Bu İlişkili Token Hesabı, cüzdanımız için (eğer token mint yetkisi olarak token'ları adresimize mintlemek istiyorsak) veya devnet cüzdanı olan tanıdığımız biri için olabilir!

:::note
`create-token-account.ts` adında boş bir dosya oluşturun. Ardından, cüzdan ve mint adresimize dayanarak ilişkili token hesabını almak için `getOrCreateAssociatedTokenAccount()` kullanın, gerekiyorsa hesabı da oluşturun.
:::

Aşağıda kendi token mint adresinizi yerleştirmeyi unutmayın!

```typescript filename="create-token-account.ts"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Anahtar çiftimizi güvenli bir şekilde yükledik, bir env dosyası kullanarak! Genel anahtarımız: ${user.publicKey.toBase58()}`,
);

// create-token-mint.ts dosyasından token mint hesabınızı yerleştirin
const tokenMintAccount = new PublicKey("YOUR_TOKEN_MINT");

// Burada, kendi adresimiz için bir ilişkili token hesabı oluşturuyoruz, ancak
// devnet üzerindeki başka bir cüzdan için de bir ATA oluşturabiliriz!
// const recipient = new PublicKey("BİR BAŞKASININ_DEVNET_ADRESİ");
const recipient = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  recipient,
);

console.log(`Token Hesabı: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink(
  "address",
  tokenAccount.address.toBase58(),
  "devnet",
);

console.log(`✅ Token Hesabı oluşturuldu: ${link}`);
```

Script'i `npx esrun create-token-account.ts` komutunu kullanarak çalıştırın. Şunu görmeniz gerekir:

```bash
✅ Başarılı! Token hesabı oluşturuldu: https://explorer.solana.com/address/CTjoLdEeK8rk4YWYW9ZqACyjHexbYKH3hEoagHxLVEFs?cluster=devnet
```

Token hesabını Solana Explorer'da açın. Sahibi kontrol edin - o, ATA'yı oluşturduğunuz hesabıdır! Bakiyenin sıfır olacağına dikkat edin çünkü henüz oraya herhangi bir token göndermedik. Hadi, oraya birkaç token mintleyelim ve bunu düzeltelim!

:::danger
Token hesabınızın adresini hatırlayın! Bunu token mintlemek için kullanacağız.
:::

--- 

#### Token Mintleme

Artık bir token mint ve bir token hesabına sahip olduğumuza göre, token hesabına token mintleyelim. `user`'ı oluşturduğumuz `mint` için `mintAuthority` olarak ayarladığımızı hatırlayın.

`mint-tokens.ts` adında boş bir dosya oluşturun. Ardından, tokenları mintlemek için `spl-token` fonksiyonu `mintTo()` kullanın. Aşağıda token mint adresinizi ve token hesap adresinizi yerleştirmeyi unutmayın!

```typescript filename="mint-tokens.ts"
import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));

// Token'ımızın iki ondalık basamağı vardır
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const user = getKeypairFromEnvironment("SECRET_KEY");

// create-token-mint.ts dosyasından token mint hesabınızı yerleştirin
const tokenMintAccount = new PublicKey("YOUR_TOKEN_MINT_ACCOUNT");

// Önceki adımdan kendi veya arkadaşınızın token hesap adresini yerleştirin.
const recipientAssociatedTokenAccount = new PublicKey(
  "RECIPIENT_TOKEN_ACCOUNT",
);

const transactionSignature = await mintTo(
  connection,
  user,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  user,
  10 * MINOR_UNITS_PER_MAJOR_UNITS,
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Başarılı! Mint Token İşlemi: ${link}`);
```

Script'i `npx esrun mint-tokens.ts` komutunu kullanarak çalıştırın. Şunu görmeniz gerekir:

```bash
✅ Başarılı! Mint Token İşlemi: https://explorer.solana.com/tx/36U9ELyJ2VAZSkeJKj64vUh9cEzVKWznESyqFCJ92sj1KgKwrFH5iwQsYmjRQDUN2uVhcbW8AVDsNaiNuPZ7n9m4?cluster=devnet
```

Explorer'ı açın ve işlemi ve alıcının hesabındaki yeni token'ları görün!

--- 

#### Token Transferi

Sonraki adımda, yeni mintlediğimiz token'lardan bazılarını `spl-token` kütüphanesinin `transfer` fonksiyonunu kullanarak transfer edelim. İsterseniz,
`devnet'te ikinci bir hesap oluşturabilirsiniz` ya da devnet hesabı olan bir arkadaş bulup ona token gönderebilirsiniz!

Explorer'da gördüğünüz gibi, token'lar şu anda cüzdanımıza bağlı bir İlişkili Token Hesabı içinde bulunuyor. İlişkili token hesabımızın adresini hatırlamamız gerekmiyor - bunun yerine `getOrCreateAssociatedTokenAccount()` kullanarak cüzdan adresimizi ve göndermek istediğimiz token'ın mintini sağlayarak adresi bulabiliriz. Aynı şekilde, bu token'ı tutacak alıcı için bir ATA bulabilir (ya da oluşturabiliriz).

:::warning
`transfer-tokens.ts` adında boş bir dosya oluşturun. Ardından `YOUR_RECIPIENT_HERE` kısmını alıcının genel anahtarınızla ve `YOUR_TOKEN_MINT_ADDRESS_HERE` kısmını token mint adresinizle değiştirin.
:::

```typescript filename="transfer-tokens.ts"
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"));

const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Anahtar çiftimizi güvenli bir şekilde yükledik, bir env dosyası kullanarak! Genel anahtarımız: ${sender.publicKey.toBase58()}`,
);

// Buraya alıcının genel anahtarını ekleyin.
const recipient = new PublicKey("YOUR_RECIPIENT_HERE");

// Token mint hesabınızı buraya yerleştirin
const tokenMintAccount = new PublicKey("YOUR_TOKEN_MINT_ADDRESS_HERE");

// Token'ımızın iki ondalık basamağı vardır
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`💸 ${recipient.toBase58()} adresine 1 token göndermeyi deniyoruz...`);

// Bu tokenı saklamak için kaynak token hesabını alın veya oluşturun
const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  sender.publicKey,
);

// Bu tokenı saklamak için varış token hesabını alın veya oluşturun
const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  recipient,
);

// Token'ları transfer et
const signature = await transfer(
  connection,
  sender,
  sourceTokenAccount.address,
  destinationTokenAccount.address,
  sender,
  1 * MINOR_UNITS_PER_MAJOR_UNITS,
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ İşlem onaylandı, explorer bağlantısı: ${explorerLink}`);
```

Script'i `npx esrun transfer-tokens.ts` komutunu kullanarak çalıştırın. Şunu görmelisiniz:

```bash
✅ İşlem onaylandı, explorer bağlantısı: https://explorer.solana.com/tx/SgV2j2DkaErYf7ERiB11USoZzGqAk8HPEqVJLP8HWdz9M61FSFgyEMXJycHQtfCooCAPBom7Vi3akEAwSUHQUsu?cluster=devnet
```

Explorer bağlantısını açın. Bakiyenizin düştüğünü ve alıcının bakiyesinin yükseldiğini görün!

--- 

### Meydan Okuma

Artık bağımsız olarak bir şey oluşturma zamanı. Bir kullanıcının yeni bir mint oluşturmasına, bir token hesabı oluşturmasına ve token mintlemesine olanak tanıyan bir uygulama oluşturun.

:::tip
Cüzdan adaptörü kullanarak Token Program ile etkileşimde bulunmak için, her işlemi oluşturmalı ve ardından işlemi cüzdan uygulamasına onay için göndermelisiniz.
:::

![Token Programı Meydan Okuma Arayüzü](../../../images/solana/public/assets/courses/unboxed/token-program-frontend.png)

1. Bunu sıfırdan oluşturabilirsiniz veya
   [başlangıç kodunu indirebilirsiniz](https://github.com/Unboxed-Software/solana-token-frontend/tree/starter).
2. `CreateMint` bileşeninde yeni bir Token Mint oluşturun. Bir cüzdana onay için işlemleri nasıl göndereceğinizi hatırlamak isterseniz,
   `Cüzdanlar dersine` göz atabilirsiniz.

Yeni bir mint oluştururken, yeni oluşturulan `Keypair` işlemi imzalamalıdır. Bağlı cüzdana ek olarak diğer imzacıların gerektiği durumlarda aşağıdaki formatı kullanın:

```typescript
sendTransaction(transaction, connection, {
  signers: [Keypair],
});
```

3. `CreateTokenAccount` bileşeninde yeni bir Token Hesabı oluşturun.
4. `MintToForm` bileşeninde token mintleyin.

Aklınız karışırsa, lütfen referans almak için [çözüm koduna](https://github.com/ZYJLiu/solana-token-frontend) göz atın.

Ve unutmayın, bu meydan okumalarla yaratıcı olun ve kendi tarzınızı katın!



### Laboratuvarı tamamladınız mı?

Kodunuzu GitHub'a yükleyin ve
[bize bu dersi nasıl bulduğunuzu söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=72cab3b8-984b-4b09-a341-86800167cfc7)!
