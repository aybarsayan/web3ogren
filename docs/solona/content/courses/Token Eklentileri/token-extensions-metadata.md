---
title: Metadata ve Metadata Pointer Genişletmesi
objectives:
  - Token Genişletmeleri Programı Mint'lerinde metadata pointer'ların ve metadata genişletmelerinin nasıl çalıştığını açıklamak
  - Mint hesabının kendisine gömülü metadata ile bir NFT oluşturmak
  - Metadata pointer genişletmesi ile bir NFT oluşturmak
description: "Token metadata'sını doğrudan token mint hesabının içine dahil edin."
---

## Özet

- `metadata pointer` genişletmesi, bir token mint'i doğrudan bir metadata hesabına ilişkilendirir. Bu, metadata hesabının adresini mint'te saklayarak gerçekleşir. Bu metadata hesabı adresi, Metaplex gibi bir dış metadata hesabı olabilir veya `metadata` genişletmesini kullanıyorsanız mint'in kendisi olabilir.
- `metadata` mint genişletmesi, Token Genişletmeleri Programı aracılığıyla metadata'nın doğrudan mint hesaplarına gömülmesini sağlar. Bu her zaman kendine referans veren bir `metadata pointer` ile birlikte gelir. Bu, minting aşamasında kapsamlı token bilgilerini gömmeyi kolaylaştırır.
- Bu genişletmeler, metadata'nın nasıl ilişkilendirildiğini ve erişildiğini standartlaştırarak token'ların farklı uygulamalar ve platformlar arasındaki etkileşimini artırır.
- Metadata'yı doğrudan gömmek veya gösterim yapmak, ek sorgulara veya dış aramalara olan ihtiyacı azaltarak işlemleri ve etkileşimleri kolaylaştırabilir.

---

## Genel Bakış

Token Genişletmeleri Programı, Solana'da metadata'yı kolaylaştırır. Token Genişletmeleri Programı olmadan, geliştiriciler, metadata'yı metadata hesaplarında bir metadata onchain programı kullanarak saklar; genellikle `Metaplex`. Ancak, bunun bazı dezavantajları vardır. Örneğin, metadata'nın "bağlı olduğu" mint hesabı metadata hesabının bilincinde değildir. Bir hesabın metadata'ya sahip olup olmadığını belirlemek için mint ve `Metaplex` programını birlikte PDA kaydetmemiz ve bir Metadata hesabının var olup olmadığını görmek için ağı sorgulamamız gerekiyor. Ek olarak, bu metadata'yı oluşturmak ve güncellemek için bir ikinci program (yani `Metaplex`) kullanmanız gerekiyor. Bu süreçler, satıcı kilidi ve artan karmaşıklık getiriyor. 

**Token Genişletmeleri Programı'nın Metadata genişletmeleri, iki genişletme sunarak bunu düzeltir:**

- `metadata-pointer` genişletmesi: Mint hesabında iki basit alan ekler: Token için metadata'yı tutan hesabın publicKey gösterimi [Token-Metadata Arayüzü](https://github.com/solana-labs/solana-program-library/tree/master/token-metadata/interface), ve bu göstergenin güncellenmesi için yetki.
- `metadata` genişletmesi: Mint'in kendisinde metadata'yı saklamamıza olanak tanıyan alanları [Token-Metadata Arayüzü](https://github.com/solana-labs/solana-program-library/tree/master/token-metadata/) tanımlar.

:::note
`metadata` genişletmesi, başlıca mint'e geri işaret eden `metadata-pointer` genişletmesi ile birlikte kullanılmalıdır.
:::

---

### Metadata-Pointer Genişletmesi:

Birden fazla metadata programı mevcut olduğundan, bir mint birçok hesabın mint'i tanımladığını iddia etmesine neden olur ve bu durum mint'in "resmi" metadata'sının hangisi olduğunu bilmekte karmaşıklık yaratır. Bunu çözmek için, `metadata-pointer` genişletmesi mint hesabında `metadataAddress` adında bir `publicKey` alanı ekler. Bu, bu token için metadata'yı tutan hesabı işaret eder. Stabilcoin olmayı iddia eden taklit mint'lerinin önüne geçmek için, bir istemci artık mint ve metadata'nın birbirini işaret edip etmediğini kontrol edebilir.

**Bu genişletme mint hesabına iki yeni alan ekler:**

- `metadataAddress`: Bu token için metadata hesap adresini tutar; `metadata` genişletmesini kullanıyorsanız kendisine de işaret edebilir.
- `authority`: Metadata adresini belirleyebilecek yetki.

Genişletme ayrıca üç yeni yardımcı işlev tanıtır:

- `createInitializeMetadataPointerInstruction`
- `createUpdateMetadataPointerInstruction`
- `getMetadataPointerState`

`createInitializeMetadataPointerInstruction` işlevi, mint hesabında metadata adresini belirleyecek talimatı döndürür.

**Bu işlev dört parametre alır:**

- `mint`: oluşturulacak mint hesabı
- `authority`: metadata adresini belirleyebilecek yetki
- `metadataAddress`: metadata'yı tutan hesap adresi
- `programId`: SPL Token program ID'si (bu durumda, Token Genişletme program ID'si olacaktır)

```ts
function createInitializeMetadataPointerInstruction(
  mint: PublicKey,
  authority: PublicKey | null,
  metadataAddress: PublicKey | null,
  programId: PublicKey,
);
```

`createUpdateMetadataPointerInstruction` işlevi, mint hesabının metadata adresini güncelleyecek talimatı döndürür. Eğer yetkiye sahipseniz, metadata pointer'ını herhangi bir noktada güncelleyebilirsiniz.

**Bu işlev beş parametre alır:**

- `mint`: oluşturulacak mint hesabı.
- `authority`: metadata adresini belirleyebilecek yetki
- `metadataAddress`: metadata'yı tutan hesap adresi
- `multiSigners`: işlemi imzalayacak çoklu imzacılar
- `programId`: SPL Token program ID'si (bu durumda, Token Genişletme program ID'si olacaktır)

```ts
function createUpdateMetadataPointerInstruction(
  mint: PublicKey,
  authority: PublicKey,
  metadataAddress: PublicKey | null,
  multiSigners: (Signer | PublicKey)[] = [],
  programId: PublicKey = TOKEN_2022_PROGRAM_ID,
);
```

`getMetadataPointerState` işlevi, belirli bir `Mint` nesnesinin `MetadataPointer` durumunu döndürür. Bunu `getMint` işlevini kullanarak elde edebiliriz.

```ts
function getMetadataPointerState(mint: Mint): Partial<MetadataPointer> | null;
```

```ts
export interface MetadataPointer {
  /** Metadata adresini belirleyebilecek isteğe bağlı yetki */
  authority: PublicKey | null;
  /** Metadata'yı tutan isteğe bağlı Hesap Adresi */
  metadataAddress: PublicKey | null;
}
```

---

#### Metadata-pointer ile NFT Oluşturma

`metadata-pointer` genişletmesi ile bir NFT oluşturmak için iki yeni hesaba ihtiyacımız vardır: `mint` ve `metadataAccount`.

`mint`, genellikle `Keypair.generate()` ile oluşturulan yeni bir `Keypair`'dir. `metadataAccount`, metadata mint genişletmesini kullanıyorsanız `mint`'in `publicKey`'si veya Metaplex gibi başka bir metadata hesabı olabilir.

Bu noktada, `mint` yalnızca bir `Keypair`'dir, ancak blok zincirinde yer için yer ayırmamız gerekiyor. Solana blok zincirindeki tüm hesaplar, hesabın boyutuna orantılı olarak kira ödemek zorundadır ve mint hesabının byte cinsinden ne kadar büyük olduğunu bilmemiz gerek. `@solana/spl-token` kütüphanesinden `getMintLen` yöntemini kullanabiliriz. Metadata-pointer genişletmesi, mint hesabının boyutunu iki yeni alan ekleyerek artırır: `metadataAddress` ve `authority`.

```ts
const mintLen = getMintLen([ExtensionType.MetadataPointer]);
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

**Metadata pointer ile `mint`'i oluşturmak ve başlatmak için aşağıdaki sırayla birkaç talimata ihtiyacımız var:**

1. Blok zincirinde alan ayırtmak için `SystemProgram.createAccount` ile `mint` hesabını oluştur.
2. `createInitializeMetadataPointerInstruction` ile metadata pointer genişletmesini başlat.
3. `createInitializeMintInstruction` ile mint'i başlat.

```ts
const createMintAccountInstructions = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  lamports,
  newAccountPubkey: mint.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  space: mintLen,
});

const initMetadataPointerInstructions =
  createInitializeMetadataPointerInstruction(
    mint.publicKey,
    payer.publicKey,
    metadataAccount,
    TOKEN_2022_PROGRAM_ID,
  );

const initMintInstructions = createInitializeMintInstruction(
  mint.publicKey,
  decimals,
  payer.publicKey,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

NFT'yi oluşturmak için talimatları bir işleme ekleyin ve Solana ağına gönderin:

```ts
const transaction = new Transaction().add(
  createMintAccountInstructions,
  initMetadataPointerInstructions,
  initMintInstructions,
);
const sig = await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mint,
]);
```

---

### Metadata Genişletmesi:

`metadata` genişletmesi, Token Genişletmeleri Programı'na heyecan verici bir eklemedir. Bu genişletme, metadata'yı doğrudan _mint'in_ kendisine saklamamıza olanak tanır! Bu, ayrı bir hesaba olan ihtiyacı ortadan kaldırarak metadata yönetimini büyük ölçüde basitleştirir.

:::note
`metadata` genişletmesi, `metadata-pointer` genişletmesi ile doğrudan çalışır. Mint oluşturma sırasında, mint'e işaret eden `metadata-pointer` genişletmesini de eklemelisiniz. [Solana Token Genişletmeleri Programı dökümantasyonuna](https://spl.solana.com/token-2022/extensions#metadata) göz atın.
:::

Metadata genişletmesindeki ek alanlar ve işlevler, [Token-Metadata Arayüzü](https://github.com/solana-labs/solana-program-library/tree/master/token-metadata/interface) ı takip eder.

Bir mint, metadata genişletmesi ile başlatıldığında, bu ek alanları saklayacaktır:

```rust
type Pubkey = [u8; 32];
type OptionalNonZeroPubkey = Pubkey; // Eğer tüm sıfırsa, `None` olarak yorumlanır

pub struct TokenMetadata {
    /// Metadata'yı güncellemek için imza atabilen yetki
    pub update_authority: OptionalNonZeroPubkey,
    /// Spoofing'i önlemek için kullanılan ilişkili mint
    pub mint: Pubkey,
    /// Token'ın uzun ismi
    pub name: String,
    /// Token için kısaltılmış sembol
    pub symbol: String,
    /// Daha zengin metadata'ya işaret eden URI
    pub uri: String,
    /// Token hakkında anahtar-değer çiftleri olarak herhangi bir ek metadata. Program, aynı anahtarı iki kez saklamaktan kaçınmalıdır.
    pub additional_metadata: Vec<(String, String)>,
}
```

**Bu ek alanlarla birlikte, `@solana/spl-token-metadata` kütüphanesi aşağıdaki işlevlerle güncellendi:**

- `createInitializeInstruction`
- `createUpdateFieldInstruction`
- `createRemoveKeyInstruction`
- `createUpdateAuthorityInstruction`
- `createEmitInstruction`
- `pack`
- `unpack`

Ayrıca, @solana/spl-token kütüphanesi yeni bir işlev ve iki sabit tanıtır:

- `getTokenMetadata`
- `LENGTH_SIZE`: verinin uzunluğunun sabit byte sayısı
- `TYPE_SIZE`: verinin tipinin sabit byte sayısı

`createInitializeInstruction` işlevi, hesabın içindeki metadata'yı başlatır ve birincil metadata alanlarını (isim, sembol, URI) ayarlar. İşlev daha sonra mint hesabında metadata alanlarını ayarlayacak bir talimat döndürür.

**Bu işlev sekiz parametre alır:**

- `mint`: başlatılacak mint hesabı
- `metadata`: oluşturulacak metadata hesabı
- `mintAuthority`: token basabilen yetki
- `updateAuthority`: metadata'yı güncellemek için imza atabilen yetki
- `name`: token'ın uzun ismi
- `symbol`: token için kısaltılmış sembol, ayrıca ticker olarak da bilinir
- `uri`: daha zengin meta veriye işaret eden token URI'si
- `programId`: SPL Token program ID'si (bu durumda, Token Genişletme program ID'si olacaktır)

```ts
export interface InitializeInstructionArgs {
  programId: PublicKey;
  metadata: PublicKey;
  updateAuthority: PublicKey;
  mint: PublicKey;
  mintAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
}

export function createInitializeInstruction(
  args: InitializeInstructionArgs,
): TransactionInstruction;
```

`createUpdateFieldInstruction` işlevi, bir token-metadata hesabındaki bir alanı oluşturacak veya güncelleyecek talimatı döndürür.

**Bu işlev beş parametre alır:**

- `metadata`: metadata hesap adresi.
- `updateAuthority`: metadata'yı güncellemek için imza atabilecek yetki
- `field`: güncellenmek istenen alan, bu, ya yerleşik `Field`'lerden biri ya da `additional_metadata` alanında saklanan özel bir alan olabilir
- `value`: alanın güncellenmiş değeri
- `programId`: SPL Token program Id'si (bu durumda, Token Genişletme program Id'si olacaktır)

```ts
export enum Field {
  Name,
  Symbol,
  Uri,
}

export interface UpdateFieldInstruction {
  programId: PublicKey;
  metadata: PublicKey;
  updateAuthority: PublicKey;
  field: Field | string;
  value: string;
}

export function createUpdateFieldInstruction(
  args: UpdateFieldInstruction,
): TransactionInstruction;
```

:::note
Güncellediğiniz metadata, başlangıçta tahsis edilen alandan daha fazla alan gerektiriyorsa, `createUpdateFieldInstruction`'ın yeniden tahsis yapabilmesi için yeterli kira için bir `system.transfer` eşleştirmeniz gerekiyor. Gerekli ek alanı `getAdditionalRentForUpdatedMetadata` ile elde edebilirsiniz. Veya bu güncellemeyi bağımsız olarak çağırıyorsanız, tüm bunları bir arada yapmak için `tokenMetadataUpdateFieldWithRentTransfer` yardımcı işlevini kullanabilirsiniz.
:::

`createRemoveKeyInstruction` işlevi, token-metadata hesabından `additional_metadata` alanını kaldıracak talimatı döndürür.

**Bu işlev beş parametre alır:**

- `metadata`: metadata hesap adresi
- `updateAuthority`: metadata'yı güncellemek için imza atabilecek yetki
- `field`: kaldırmak istediğimiz alan
- `programId`: SPL Token program ID'si (bu durumda, Token Genişletme program ID'si olacaktır)
- `idempotent`: Doğru olduğunda, talimat anahtar mevcut değilse hata vermez

```ts
export interface RemoveKeyInstructionArgs {
  programId: PublicKey;
  metadata: PublicKey;
  updateAuthority: PublicKey;
  key: string;
  idempotent: boolean;
}

export function createRemoveKeyInstruction(
  args: RemoveKeyInstructionArgs,
): TransactionInstruction;
```

`createUpdateAuthorityInstruction` işlevi, bir token-metadata hesabının yetkisini güncelleyecek talimatı döndürür.

**Bu işlev dört parametre alır:**

- `metadata`: metadata hesap adresi
- `oldAuthority`: metadata'yı güncellemek için imza atabilen mevcut yetki
- `newAuthority`: metadata'yı güncellemek için imza atabilecek yeni yetki
- `programId`: SPL Token program ID'si (bu durumda, Token Genişletme program ID'si olacaktır)

```ts
export interface UpdateAuthorityInstructionArgs {
  programId: PublicKey;
  metadata: PublicKey;
  oldAuthority: PublicKey;
  newAuthority: PublicKey | null;
}

export function createUpdateAuthorityInstruction(
  args: UpdateAuthorityInstructionArgs,
): TransactionInstruction;
```

`createEmitInstruction` "yayımlar" veya token-metadata'yı beklenen TokenMetadata durum formatında kaydeder. Bu, TokenMetadata arayüzünü takip etmek isteyen metadata programları için gerekli bir işlevdir. Yayımlama talimatı, indexleyicilerin ve diğer offchain kullanıcıların metadata'yı almak için çağrıda bulunmalarını sağlar. Ayrıca, özel metadata programlarının [metadata'yı farklı bir formatta saklamasına izin verirken, Arayüz standartlarıyla uyumluluğu korumalarını sağlar](https://solana.com/developers/guides/token-extensions/metadata-pointer#metadata-interface-instructions).

**Bu işlev dört parametre alır:**

- `metadata`: metadata hesap adresi
- `programId`: SPL Token program ID'si (bu durumda, Token Genişletme program ID'si olacaktır)
- `start`: _İsteğe bağlı_ metadata başlangıcı
- `end`: _İsteğe bağlı_ metadata sonu

```ts
export interface EmitInstructionArgs {
  programId: PublicKey;
  metadata: PublicKey;
  start?: bigint;
  end?: bigint;
}

export function createEmitInstruction(
  args: EmitInstructionArgs,
): TransactionInstruction;
```

`pack` işlevi, metadata'yı bir byte dizisine kodlar ve karşıtına `unpack`, byte dizisinden metadata'yı çözer. Bu işlemler, metadata'nın byte boyutunu belirlemek için gereklidir; bu, yeterli depolama alanı tahsis etmek için kritiktir.

```ts
export interface TokenMetadata {
    // Metadata'yı güncellemek için imza atabilen yetki
    updateAuthority?: PublicKey;
    // Spoofing'i önlemek için kullanılan ilişkili mint
    mint: PublicKey;
    // Token'ın uzun ismi
    name: string;
    // Token için kısaltılmış sembol
    symbol: string;
    // Daha zengin metadata'ya işaret eden URI
    uri: string;
    // Token hakkında anahtar-değer çiftleri olarak herhangi bir ek metadata
    additionalMetadata: [string, string][];
}

export const pack = (meta: TokenMetadata): Uint8Array

export function unpack(buffer: Buffer | Uint8Array): TokenMetadata
```

`getTokenMetadata` işlevi, belirli bir mint için metadata'yı döndürür.

**Dört parametre alır:**

- `connection`: Kullanılacak bağlantı
- `address`: mint hesabı
- `commitment`: durum sorgulama için istenen taahhüt seviyesi
- `programId`: SPL Token program hesabı (bu durumda, Token Genişletme program ID'si olacaktır)

```ts
export async function getTokenMetadata(
  connection: Connection,
  address: PublicKey,
  commitment?: Commitment,
  programId = TOKEN_2022_PROGRAM_ID,
): Promise<TokenMetadata | null>;

#### Metadata uzantısı ile NFT oluşturma

Metadata uzantısı ile NFT oluşturmak, birkaç ekstra adımla birlikte metadata-pointer ile oluşturmak gibidir:

1. Gerekli hesapları toplayın
2. Gerekli metadata boyutunu bulun/kararlaştırın
3. `mint` hesabını oluşturun
4. Pointer'ı başlatın
5. Mint'i başlatın
6. Mint hesabındaki metadata'yı başlatın
7. Gerekirse ek özel alanlar ekleyin

İlk olarak, `mint` bir Keypair olacak, genellikle `Keypair.generate()` kullanılarak oluşturulacaktır. Ardından, dahil edilecek metadata’yı belirlemeli ve toplam boyutu ve maliyeti hesaplamalıyız.

> **Önemli Not:** Mint hesabının boyutu metadata ve metadata-pointer uzantıları ile aşağıdakileri içerir:
> 
> - Temel metadata alanları: isim, sembol ve URI
> - Bir metadata olarak saklamak istediğimiz ek özel alanlar
> - Gelecekte metadata’yı değiştirebilecek güncelleme yetkisi
> - `@solana/spl-token` kütüphanesindeki `LENGTH_SIZE` ve `TYPE_SIZE` sabitleri - bu, genellikle `getMintLen` çağrısıyla eklenen mint uzantılarıyla ilişkili boyutlardır, ancak metadata uzantısı değişken uzunlukta olduğu için manuel olarak eklenmelidir
> - Metadata pointer verisi (bu mint'in adresi olacak ve tutarlılık için yapılır)  
> — **Bu bilgi kritik öneme sahiptir.**


<summary>**Ekstra Bilgi:**</summary>
  
Daha fazla metadatanız olacağını düşünüyorsanız, gerekli olan miktardan daha fazla alan ayırmaya gerek yoktur. `createUpdateFieldInstruction` otomatik olarak alanı yeniden tahsis edecektir! Ancak, mint hesabının yeterli kira alması için başka bir `system.transfer` işlemi eklemeniz gerekecektir.



Bunların tümünü program aracılığıyla belirlemek için `@solana/spl-token` kütüphanesinden `getMintLen` ve `pack` fonksiyonlarını kullanırız:

```ts
const metadata: TokenMetadata = {
  mint: mint.publicKey,
  name: tokenName,
  symbol: tokenSymbol,
  uri: tokenUri,
  additionalMetadata: [["customField", "customValue"]],
};

const mintAndPointerLen = getMintLen([ExtensionType.MetadataPointer]); // Metadata uzantısı değişken uzunluktadır, bu yüzden aşağıda hesaplıyoruz
const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
const totalLen = mintLen + mintAndPointerLen;
const lamports = await connection.getMinimumBalanceForRentExemption(totalLen);
```

Gerçekten `mint`'i metadata ve metadata pointer ile oluşturmak ve başlatmak için belirli bir sırada birkaç talimata ihtiyacımız var:

1. `SystemProgram.createAccount` ile blockchain'de alan rezerve eden `mint` hesabını oluşturun
2. `createInitializeMetadataPointerInstruction` ile metadata pointer uzantısını başlatın
3. `createInitializeMintInstruction` ile mint'i kendisini başlatın
4. `createInitializeInstruction` ile metadata'yı başlatın (bu YALNIZCA temel metadata alanlarını ayarlar)
5. Opsiyonel: `createUpdateFieldInstruction` ile özel alanları ayarlayın (bir alan her çağrıda)  

```ts
const createMintAccountInstructions = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  lamports,
  newAccountPubkey: mint.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  space: totalLen,
});

const initMetadataPointerInstructions =
  createInitializeMetadataPointerInstruction(
    mint.publicKey,
    payer.publicKey,
    mint.publicKey, // metadata hesabı olarak mintin kendisine işaret edeceğiz
    TOKEN_2022_PROGRAM_ID,
  );

const initMintInstructions = createInitializeMintInstruction(
  mint.publicKey,
  decimals,
  payer.publicKey,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);

const initMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID,
  mint: mint.publicKey,
  metadata: mint.publicKey,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  mintAuthority: payer.publicKey,
  updateAuthority: payer.publicKey,
});

const updateMetadataFieldInstructions = createUpdateFieldInstruction({
  metadata: mint.publicKey,
  updateAuthority: payer.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  field: metadata.additionalMetadata[0][0],
  value: metadata.additionalMetadata[0][1],
});
```

Tüm bu talimatları gömülü NFT'yi oluşturmak için bir işlemde sarın:

```ts
const transaction = new Transaction().add(
  createMintAccountInstructions,
  initMetadataPointerInstructions,
  initMintInstructions,
  initMetadataInstruction,
  updateMetadataFieldInstructions, // herhangi bir özel alan eklemek istiyorsanız
);
const signature = await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mint,
]);
```

Burada sıralamanın önemi vardır.


<summary>**Dikkat:**</summary>

`createUpdateFieldInstruction` yalnızca bir alanı günceller. Birden fazla özel alanınız olmasını istiyorsanız, bu yöntemi birden fazla kez çağırmanız gerekecektir. Ayrıca, temel metadata alanlarını güncellemek için aynı yöntemi kullanabilirsiniz:

```ts
const updateMetadataFieldInstructions = createUpdateFieldInstruction({
  metadata: mint.publicKey,
  updateAuthority: payer.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  field: "name", // Alan | string
  value: "new name",
});
```



## Laboratuvar

Şimdiye kadar öğrendiklerimizle pratik yapma zamanı. Bu laboratuvar, `metadata` ve `metadata pointer` uzantıları ile NFT oluşturma sürecini gösteren bir betik oluşturacağız.

### 0. Başlarken

Hadi başlayalım ve başlangıç kodumuzu klonlayalım:

```bash
git clone https://github.com/Unboxed-Software/solana-lab-token22-metadata.git
cd solana-lab-token22-metadata
git checkout starter
npm install
```

Başlangıç dalında sağlananlara bir bakalım.

Gerekli tüm bağımlılıklarla başlatılan NodeJS projesinin yanı sıra, `src/` dizininde iki diğer dosya sağlanmıştır.

- **`cat.png`**: NFT için kullanacağımız resimdir. Kendi resminizle değiştirmekten çekinmeyin.
- `helpers.ts`
- `index.ts`


<summary>**Not:**</summary>

Irys kullanarak devnet üzerinde dosyaları yüklüyoruz; bu 100 KiB ile sınırlıdır.



**`helpers.ts`** dosyası bize `uploadOffChainMetadata` adında kullanışlı bir yardımcı işlev sağlar.

`uploadOffChainMetadata`, Irys (eski adıyla Bundlr) kullanarak offchain metadata'yı Arweave'de saklamak için bir yardımcıdır. Bu laboratuvarda Token Extensions Program etkileşimine daha fazla odaklanacağız, bu nedenle bu yükleyici işlev sağlanmıştır. Bir NFT veya herhangi bir offchain metadata, [NFT.storage](https://nft.storage/), Solana'nın yerel [ShadowDrive](https://www.shdwdrive.com/) veya [Irys (eski adıyla Bundlr)](https://irys.xyz/) gibi herhangi bir depolama sağlayıcıda herhangi bir yere saklanabilir. Sonuçta, ihtiyacınız olan tek şey, barındırılan metadata json dosyasının URL'sidir.

Bu yardımcı, bazı dışa aktarılan arayüzlere sahiptir. Bu, işlevlerimizi temizleyecek.

```ts
export interface CreateNFTInputs {
  payer: Keypair;
  connection: Connection;
  tokenName: string;
  tokenSymbol: string;
  tokenUri: string;
  tokenAdditionalMetadata?: Record;
}

export interface UploadOffChainMetadataInputs {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  tokenExternalUrl: string;
  tokenAdditionalMetadata?: Record;
  imagePath: string;
  metadataFileName: string;
}
```

**`index.ts`** kodumuzu ekleyeceğimiz yerdir. Şu anda, `connection`'ı ayarlayan ve kullanmamız için bir keypair başlatan kod bulunmaktadır.

Keypair `payer`, tüm işlem boyunca gerekli olan her ödemenin sorumlusu olacaktır. `payer` ayrıca mint yetkisi, mint dondurma yetkisi vb. gibi tüm yetkileri tutacaktır. Yetkiler için ayrı bir keypair kullanmak mümkün olsa da, basitlik açısından `payer` kullanmaya devam edeceğiz.

Son olarak, bu laboratuvar devnet üzerinde gerçekleştirilecektir. Bu, metadata'yı Arweave'ye yüklemek için Irys kullanmamız gerektiğindendir - devnet veya mainnet bağlantısı gerektirir. Airdrop sorunlarıyla karşılaşırsanız:

- `initializeKeypair`'a `keypairPath` parametresini ekleyin - yol, terminalinizde `solana config get` komutunu çalıştırarak alınabilir
- Terminalinizde `solana address` komutunu çalıştırarak keypair'ın adresini alın
- Adresi kopyalayın ve [faucet.solana](https://faucet.solana.com/) üzerinden devnet sol airdrop yapın.

### 1. Offchain metadata yükleme

Bu bölümde NFT metadata’mızı kararlaştıracak ve sağlanan yardımcı işlevleri kullanarak dosyalarımızı NFT.Storage'a yükleyeceğiz.

Offchain metadata’mızı yüklemek için önce NFT'mizi temsil edecek bir resim hazırlamalıyız. `cat.png` sağladık, ancak bunu kendi resminizle değiştirmekten çekinmeyin. Çoğu resim türü, çoğu cüzdan tarafından desteklenmektedir. (Yine devnet Irys, dosya başına 100KiB'ye kadar izin verir)

Sonra, NFT'mizin hangi metadatalara sahip olacağına karar verelim. Kararlaştırdığımız alanlar `name`, `description`, `symbol`, `externalUrl` ve bazı `attributes` (ek metadata) olacaktır. Birkaç kediyle ilgili metadata sağlayacağız, ancak kendi metadata'nızı oluşturmakta serbestsiniz.

- **`name`**: Cat NFT
- **`description`**: Bu bir kedidir
- **`symbol`**: EMB
- **`externalUrl`**: https://solana.com/
- **`attributes`**: `{ species: 'Cat', breed: 'Cool' }`

Son olarak, tüm bu verileri biçimlendirmemiz ve yüklenen metadata uri'sini almak için yardımcı işlevimiz `uploadOffChainMetadata`'ya göndermemiz gerekmektedir.

Bunların hepsini bir araya getirdiğimizde, `index.ts` dosyası aşağıdaki gibi görünecektir:

```ts
import { Connection } from "@solana/web3.js";
import { initializeKeypair } from "@solana-developers/helpers";
import { uploadOffChainMetadata } from "./helpers";
import dotenv from "dotenv";
dotenv.config();

const connection = new Connection(clusterApiUrl("devnet"), "finalized");
const payer = await initializeKeypair(connection, {
  keypairPath: "your/path/to/keypair.json",
});

const imagePath = "src/cat.png";
const metadataPath = "src/temp.json";
const tokenName = "Cat NFT";
const tokenDescription = "This is a cat";
const tokenSymbol = "EMB";
const tokenExternalUrl = "https://solana.com/";
const tokenAdditionalMetadata = {
  species: "Cat",
  breed: "Cool",
};

const tokenUri = await uploadOffChainMetadata(
  {
    tokenName,
    tokenDescription,
    tokenSymbol,
    imagePath,
    metadataPath,
    tokenExternalUrl,
    tokenAdditionalMetadata,
  },
  payer,
);

// Yükleme işlemi tamamlandığında burada URI'yi güncelleyebilirsiniz
console.log("Token URI:", tokenUri);
```

Artık terminalinizde `npm run start` komutunu çalıştırın ve kodunuzu test edin. Yükleme tamamlandığında, URI'yi kaydettiklerinizi görmelisiniz. Bağlantıyı ziyaret ettiğinizde, tüm offchain metadata'mızı içeren bir JSON nesnesi görmelisiniz.

### 2. NFT Fonksiyonu Oluşturma

Bir NFT oluşturmak, birden fazla talimatı içerir. Solana ağı ile etkileşimde bulunurken, bu talimatların tamamını tek bir işlemde birleştirmek en iyi uygulamadır çünkü işlemlerin atomik doğası vardır. Bu, tüm talimatların başarılı bir şekilde gerçekleştirilmesini veya hatalar durumunda tamamının geri alınmasını sağlar. Bu durumda, `src/nft-with-embedded-metadata.ts` adında yeni bir dosyada `createNFTWithEmbeddedMetadata` adlı yeni bir fonksiyon oluşturacağız.

Bu fonksiyon, bir NFT oluşturacak ve aşağıdaki adımları takip edecektir:

1. Betimleme nesnesini oluştur
2. Mint ayır
3. Mintin kendisine işaret eden bir metadata-pointer'ı başlat
4. Minti başlat
5. Mint içindeki betimlemeyi başlat (bu, mint için isim, sembol ve uri ayarlayacaktır)
6. Mintte ek betimlemeyi ayarlay
7. İlgili token hesabını oluştur ve NFT'yi ona mintleyip mint yetkisini kaldır
8. Tüm bunları tek bir işlemde toparla ve ağa gönder
9. Çalıştığından emin olmak için token hesabını, mint hesabını ve betimlemeyi al ve yazdır

Bu yeni fonksiyon, `helpers.ts` dosyasında tanımlanan `CreateNFTInputs` alacaktır.

:::info
**İlk adım olarak**, `src/nft-with-embedded-metadata.ts` adında yeni bir dosya oluşturalım ve aşağıdakileri ekleyelim:
:::


```typescript
import {
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { CreateNFTInputs } from "./helpers";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import {
  AuthorityType,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  createSetAuthorityInstruction,
  ExtensionType,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  getMintLen,
  getTokenMetadata,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";

export default async function createNFTWithEmbeddedMetadata(
  inputs: CreateNFTInputs,
) {
  const {
    payer,
    connection,
    tokenName,
    tokenSymbol,
    tokenUri,
    tokenAdditionalMetadata,
  } = inputs;

  // 0. Mint Ayarı
  // 1. Betimleme nesnesini oluştur
  // 2. Mint ayır
  // 3. Mint'in kendisine işaret eden bir metadata-pointer'ı başlat
  // 4. Minti başlat
  // 5. Mint içindeki betimlemeyi başlat (bu, mint için isim, sembol ve uri ayarlayacaktır)
  // 6. Mintte ek betimlemeyi ayarlay
  // 7. İlgili token hesabını oluştur ve NFT'yi ona mintleyip mint yetkisini kaldır
  // 8. Tüm bunları tek bir işlemde toparla ve ağa gönder
  // 9. Çalıştığından emin olmak için token hesabını, mint hesabını ve betimlemeyi al ve yazdır
}
```

Şimdi adımları tek tek dolduralım.

0. adım olarak mint'in anahtar çiftini oluşturalım, NFT'miz için ondalık olarak 0 ayarlayalım ve arzı 1 olarak belirleyelim.

```typescript
// 0. Mint Ayarı
const mint = Keypair.generate();
const decimals = 0; // NFT'nin 0 ondalığı olmalı
const supply = 1; // NFT'lerin arzı 1 olmalı
```

Şimdi `@solana/spl-token-metadata` arayüzünden `TokenMetadata` nesnesini oluşturup, tüm girdilerimizi ona geçireceğiz.

:::note
Not: `tokenAdditionalMetadata` geçişini yapmamız gerekiyor:
:::

```typescript
// 1. Betimleme nesnesini oluştur
const metadata: TokenMetadata = {
  mint: mint.publicKey,
  name: tokenName,
  symbol: tokenSymbol,
  uri: tokenUri,
  // additionalMetadata: [['customField', 'customValue']],
  additionalMetadata: Object.entries(tokenAdditionalMetadata || []).map(
    ([key, value]) => [key, value],
  ),
};
```

Artık `SystemProgram.createAccount` kullanarak ilk on-chain talimatımızı oluşturabiliriz. Bunu yapmak için NFT'mizin mint hesabının boyutunu bilmemiz gerekiyor. Unutmayın, NFT'miz için iki uzantı kullanıyoruz: `metadata pointer` ve `metadata` uzantıları. Ayrıca, metadata 'gömülü' olarak metadata uzantısını kullandığı için değişken uzunluktadır. Bu nedenle, son uzunluğumuzu elde etmek için `getMintLen`, `pack` ve bazı sabit miktarları birleştiriyoruz.

Sonra, hesap oluşturmanın ne kadara mal olacağını görmek için `getMinimumBalanceForRentExemption` çağrısını yapıyoruz.

Son olarak, `SystemProgram.createAccount` fonksiyonuna her şeyi koyarak ilk talimatımızı alıyoruz:

```typescript
// 2. Mint ayır
const mintLen = getMintLen([ExtensionType.MetadataPointer]);
const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
const lamports = await connection.getMinimumBalanceForRentExemption(
  mintLen + metadataLen,
);

const createMintAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  lamports,
  newAccountPubkey: mint.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  space: mintLen,
});
```


<summary><strong>Metadata'daki maliyet hakkında bilgi</strong></summary>
Metadata'daki bilgi arttıkça maliyeti de o kadar artar.


Adım 3, `metadata pointer` uzantısını başlatmamızı gerektiriyor. Bunu, metadata hesabının mint'e işaret ettiğini kontrol ederek `createInitializeMetadataPointerInstruction` fonksiyonunu çağırarak yapalım.

```typescript
// 3. Mint'in kendisine işaret eden metadata-pointer'ı başlat
const initMetadataPointerInstruction =
  createInitializeMetadataPointerInstruction(
    mint.publicKey,
    payer.publicKey,
    mint.publicKey, // Metadata hesabı - kendisine işaret ediyor
    TOKEN_2022_PROGRAM_ID,
  );
```

Sonraki adım `createInitializeMintInstruction`. Not edin ki bunu, betimlemeyi başlatmadan önce yapıyoruz.

```typescript
// 4. Minti başlat
const initMintInstruction = createInitializeMintInstruction(
  mint.publicKey,
  decimals,
  payer.publicKey,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Artık `createInitializeInstruction` ile betimlememizi başlatabiliriz. Tüm NFT betimlemelerimizi geçiyoruz, ancak `tokenAdditionalMetadata` hariç, bu bir sonraki adımda ele alınacak.

```typescript
// 5. Mint içindeki betimlemeyi başlat
const initMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID,
  mint: mint.publicKey,
  metadata: mint.publicKey,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  mintAuthority: payer.publicKey,
  updateAuthority: payer.publicKey,
});
```

NFT'mizde `tokenAdditionalMetadata` bulunmakta ve bir önceki adımda bunun `createInitializeInstruction` ile ayarlanamayacağını gördük. Bu nedenle, her yeni ek alanı ayarlamak için bir talimat oluşturmamız gerekiyor. Bunu `tokenAdditionalMetadata` içindeki her bir girdi için `createUpdateFieldInstruction` çağırarak yapıyoruz.

```typescript
// 6. Mintte ek betimlemeyi ayarlay
const setExtraMetadataInstructions = [];
for (const attributes of Object.entries(tokenAdditionalMetadata || [])) {
  setExtraMetadataInstructions.push(
    createUpdateFieldInstruction({
      updateAuthority: payer.publicKey,
      metadata: mint.publicKey,
      field: attributes[0],
      value: attributes[1],
      programId: TOKEN_2022_PROGRAM_ID,
    }),
  );
}
```

Şimdi, bu NFT'yi kendimize mintleyelim ve ardından mint yetkisini iptal edelim. Bu, gerçek bir NFT olmaması durumunda yalnızca bir tane olacaktır. Bunu aşağıdaki fonksiyonlarla gerçekleştiriyoruz:

- `createAssociatedTokenAccountInstruction`
- `createMintToCheckedInstruction`
- `createSetAuthorityInstruction`

```typescript
// 7. İlgili token hesabını oluştur ve NFT'yi ona mintleyip mint yetkisini kaldır
const ata = await getAssociatedTokenAddress(
  mint.publicKey,
  payer.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
);
const createATAInstruction = createAssociatedTokenAccountInstruction(
  payer.publicKey,
  ata,
  payer.publicKey,
  mint.publicKey,
  TOKEN_2022_PROGRAM_ID,
);

const mintInstruction = createMintToCheckedInstruction(
  mint.publicKey,
  ata,
  payer.publicKey,
  supply, // NFT'lerin arzı 1 olmalı
  decimals,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// NFT'lerin mint yetkisi olmamalıdır, böylece kimse aynı NFT'den daha fazlasını mintleyemez
const setMintTokenAuthorityInstruction = createSetAuthorityInstruction(
  mint.publicKey,
  payer.publicKey,
  AuthorityType.MintTokens,
  null,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Şimdi, tüm işlemlerimizi bir araya getirelim ve onu Solana ağına gönderelim. Burada sıralamanın önemli olduğunu belirtmek gerekir.

```typescript
// 8. Tüm bunları tek bir işlemde toparla ve ağa gönder.
const transaction = new Transaction().add(
  createMintAccountInstruction,
  initMetadataPointerInstruction,
  initMintInstruction,
  initMetadataInstruction,
  ...setExtraMetadataInstructions,
  createATAInstruction,
  mintInstruction,
  setMintTokenAuthorityInstruction,
);
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mint],
);
```

Son olarak, NFT'miz hakkında tüm bilgileri alalım ve yazdıralım, böylece her şeyin çalıştığından emin oluruz.

```typescript
// 9. Çalıştığından emin olmak için token hesabını, mint hesabını ve betimlemeyi al ve yazdır.
// Hesabı alma
const accountDetails = await getAccount(
  connection,
  ata,
  "finalized",
  TOKEN_2022_PROGRAM_ID,
);
console.log("İlişkili Token Hesabı =====>", accountDetails);

// Mint'i alma
const mintDetails = await getMint(
  connection,
  mint.publicKey,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
console.log("Mint =====>", mintDetails);

// Mint kendisinde metadataları depoladığı için, bunu böyle alabiliriz
const onChainMetadata = await getTokenMetadata(connection, mint.publicKey);
// Şimdi mint ile birlikte gelen metadata'yı görebiliriz
console.log("Onchain metadata =====>", onChainMetadata);

// Ve hatta şimdi offchain json'u alabiliriz
if (onChainMetadata?.uri) {
  try {
    const response = await fetch(onChainMetadata.uri);
    const offChainMetadata = await response.json();
    console.log("Mint offchain metadata =====>", offChainMetadata);
  } catch (error) {
    console.error("Offchain metadata alma veya ayrıştırma hatası:", error);
  }
}
```

Tüm bunları bir araya getirdiğinizde `src/nft-with-embedded-metadata.ts` içeriği aşağıdaki gibi olacaktır:

```ts
import {
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { CreateNFTInputs } from "./helpers";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import {
  AuthorityType,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  createSetAuthorityInstruction,
  ExtensionType,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  getMintLen,
  getTokenMetadata,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";

export default async function createNFTWithEmbeddedMetadata(
  inputs: CreateNFTInputs,
) {
  const {
    payer,
    connection,
    tokenName,
    tokenSymbol,
    tokenUri,
    tokenAdditionalMetadata,
  } = inputs;

  // 0. Mint Ayarı
  const mint = Keypair.generate();
  const decimals = 0; // NFT'nin 0 ondalığı olmalı
  const supply = 1; // NFT'lerin arzı 1 olmalı

  // 1. Betimleme nesnesini oluştur
  const metadata: TokenMetadata = {
    mint: mint.publicKey,
    name: tokenName,
    symbol: tokenSymbol,
    uri: tokenUri,
    // additionalMetadata: [['customField', 'customValue']],
    additionalMetadata: Object.entries(tokenAdditionalMetadata || []).map(
      ([key, value]) => [key, value],
    ),
  };

  // 2. Mint ayır
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen,
  );

  const createMintAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    lamports,
    newAccountPubkey: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    space: mintLen,
  });

  // 3. Mint'in kendisine işaret eden metadata-pointer'ı başlat
  const initMetadataPointerInstruction =
    createInitializeMetadataPointerInstruction(
      mint.publicKey,
      payer.publicKey,
      mint.publicKey, // Metadata hesabı - kendisine işaret ediyor
      TOKEN_2022_PROGRAM_ID,
    );

  // 4. Minti başlat
  const initMintInstruction = createInitializeMintInstruction(
    mint.publicKey,
    decimals,
    payer.publicKey,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );

  // 5. Mint içindeki betimlemeyi başlat
  const initMetadataInstruction = createInitializeInstruction({
    programId: TOKEN_2022_PROGRAM_ID,
    mint: mint.publicKey,
    metadata: mint.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    mintAuthority: payer.publicKey,
    updateAuthority: payer.publicKey,
  });

  // 6. Mintte ek betimlemeyi ayarlay
  const setExtraMetadataInstructions = [];
  for (const attributes of Object.entries(tokenAdditionalMetadata || [])) {
    setExtraMetadataInstructions.push(
      createUpdateFieldInstruction({
        updateAuthority: payer.publicKey,
        metadata: mint.publicKey,
        field: attributes[0],
        value: attributes[1],
        programId: TOKEN_2022_PROGRAM_ID,
      }),
    );
  }

  // 7. İlgili token hesabını oluştur ve NFT'yi ona mintleyip mint yetkisini kaldır
  const ata = await getAssociatedTokenAddress(
    mint.publicKey,
    payer.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
  );
  const createATAInstruction = createAssociatedTokenAccountInstruction(
    payer.publicKey,
    ata,
    payer.publicKey,
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );

  const mintInstruction = createMintToCheckedInstruction(
    mint.publicKey,
    ata,
    payer.publicKey,
    supply, // NFT'lerin arzı 1 olmalı
    decimals,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  // NFT'lerin mint yetkisi olmamalıdır, böylece kimse aynı NFT'den daha fazlasını mintleyemez
  const setMintTokenAuthorityInstruction = createSetAuthorityInstruction(
    mint.publicKey,
    payer.publicKey,
    AuthorityType.MintTokens,
    null,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  // 8. Tüm bunları tek bir işlemde toparla ve ağa gönder.
  const transaction = new Transaction().add(
    createMintAccountInstruction,
    initMetadataPointerInstruction,
    initMintInstruction,
    initMetadataInstruction,
    ...setExtraMetadataInstructions, // Ek metadata alanlarını bozma
    createATAInstruction,
    mintInstruction,
    setMintTokenAuthorityInstruction,
  );
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mint],
  );

  // 9. Çalıştığından emin olmak için token hesabını, mint hesabını ve betimlemeyi al ve yazdır.
  // Hesabı alma
  const accountDetails = await getAccount(
    connection,
    ata,
    "finalized",
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("İlişkili Token Hesabı =====>", accountDetails);

  // Mint'i alma
  const mintDetails = await getMint(
    connection,
    mint.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("Mint =====>", mintDetails);

  // Mint kendisinde metadataları depoladığı için, bunu böyle alabiliriz
  const onChainMetadata = await getTokenMetadata(connection, mint.publicKey);
  // Şimdi mint ile birlikte gelen metadata'yı görebiliriz
  console.log("Onchain metadata =====>", onChainMetadata);

  // Ve hatta şimdi offchain JSON'u alabiliriz
  if (onChainMetadata?.uri) {
    try {
      const response = await fetch(onChainMetadata.uri);
      const offChainMetadata = await response.json();
      console.log("Mint offchain metadata =====>", offChainMetadata);
    } catch (error) {
      console.error("Offchain metadata alma veya ayrıştırma hatası:", error);
    }
  }
}
```

### 3. NFT Fonksiyonunu Çağırma

Şimdi her şeyi `src/index.ts` dosyasında bir araya getirelim.

`src/index.ts` dosyasına geri dönün ve yeni oluşturduğumuz dosyadan `createNFTWithEmbeddedMetadata` fonksiyonunu içe aktarın.

```ts
import createNFTWithEmbeddedMetadata from "./nft-with-embedded-metadata";
```

Ardından, ana fonksiyonun en sonunda çağırın ve gerekli parametreleri geçirin.

```ts
await createNFTWithEmbeddedMetadata({
  payer,
  connection,
  tokenName,
  tokenSymbol,
  tokenUri,
});
```

`src/index.ts` dosyası aşağıdaki gibi görünmelidir:

```ts
import { Connection } from "@solana/web3.js";
import { initializeKeypair, uploadOffChainMetadata } from "./helpers";
import createNFTWithEmbeddedMetadata from "./nft-with-embedded-metadata";
import dotenv from "dotenv";
dotenv.config();

const connection = new Connection("http://127.0.0.1:8899", "finalized");
const payer = await initializeKeypair(connection);

const imagePath = "NFT.png";
const tokenName = "NFT Adı";
const tokenDescription = "Bu harika bir Token Uzantısı NFT'dir";
const tokenSymbol = "TTT";

const tokenUri = await uploadOffChainMetadata({
  connection,
  payer,
  tokenName,
  tokenDescription,
  tokenSymbol,
  imagePath,
});

// URI'yi burada güncelleyebilir ve kodu çalıştırarak deneyebilirsiniz
console.log("Token URI:", tokenUri);

await createNFTWithEmbeddedMetadata({
  payer,
  connection,
  tokenName,
  tokenSymbol,
  tokenUri,
});
```

:::tip
**Programı bir kez daha çalıştırmayı deneyin** ve NFT'nizi ve metadata'yı görün.
```bash
npm run start
```
Başardınız! `metadata` ve `metadata pointer` uzantılarını kullanarak bir NFT oluşturdunuz.
:::

Herhangi bir sorunla karşılaşırsanız, [çözüm](https://github.com/Unboxed-Software/solana-lab-token22-metadata/tree/solution) belgesine göz atabilirsiniz.

## Meydan Okuma

Burada öğrendiklerinizi alarak kendi NFT veya SFT'nizi yaratın.