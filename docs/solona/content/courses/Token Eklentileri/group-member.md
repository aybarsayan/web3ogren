---
title: Grup, Grup İşaretçisi, Üye, Üye İşaretçisi
objectives:
  - Grup, grup işaretçisi, üye ve üye işaretçisi uzantılarını kullanarak bir NFT koleksiyonu oluşturun.
  - Bir grubun yetkisini ve maksimum boyutunu güncelleyin.
description: "Token uzantılarını kullanarak bir NFT koleksiyonu oluşturun."
---

## Özet

- 'token grupları' genellikle NFT koleksiyonlarını gerçekleştirmek için kullanılır.
- `grup işaretçisi` uzantısı, token mintinde grup hesap bilgilerini tutmak için bir grup hesabı ayarlar.
- `grup` uzantısı, grup verilerini mintin kendisi içinde saklamamıza olanak tanır.
- `üye işaretçisi` uzantısı, token mintinde, bir grup içindeki token üyeliğine ilişkin bilgileri tutmak için bireysel bir üye hesabı ayarlar.
- `üye` uzantısı, üye verilerini mintin kendisi içinde saklamamıza olanak tanır.

---

## Genel Bakış

SPL tokenları yalnız başına değerli olsa da, ek işlevsellik için birleştirilebilir. Bunu `grup`, `grup işaretçisi`, `üye` ve `üye işaretçisi` uzantılarını birleştirerek Token Extensions Programı'nda yapabiliriz. Bu uzantıların en yaygın kullanım durumu, bir NFT koleksiyonu oluşturmaktır.

Bir NFT koleksiyonu oluşturmak için iki parçaya ihtiyacımız var: "koleksiyon" NFT'si ve koleksiyonun içindeki tüm NFT'ler. Bunu tamamen token uzantıları kullanarak yapabiliriz. "Koleksiyon" NFT'si tek bir mint olabilir ve `metadata`, `metadata pointer`, `grup` ve `grup işaretçisi` uzantılarını birleştirebiliriz. Ardından koleksiyon içindeki her bir bireysel NFT, `metadata`, `metadata pointer`, `üye` ve `üye işaretçisi` uzantılarını birleştiren bir mint dizisi olabilir.

NFT koleksiyonları yaygın bir kullanım durumu olmasına rağmen, gruplar ve üyeler herhangi bir token türüne uygulanabilir.

:::note
`grup işaretçisi` ile `grup` arasındaki hızlı bir not. `grup işaretçisi` uzantısı, herhangi bir on-chain hesabın adresini Token-Grup Arayüzüne işaret etmek üzere saklar. `grup` uzantısı ise Token-Grup Arayüzü verilerini doğrudan mint hesabında saklar. Genellikle, `grup işaretçisi` doğrudan mintin kendisine işaret eder. `üye işaretçisi` ile `üye` için de aynı durum geçerlidir, ancak üye verileri ile.
:::

**NOT:** Bir grubun birçok üyesi olabilir, ancak bir üye yalnızca bir gruba ait olabilir.

### Grup ve Grup İşaretçisi

`grup` ve `grup işaretçisi` uzantıları, bir token grubunu tanımlar. On-chain verisi aşağıdaki gibidir:

- `update_authority`: Grubu güncellemek için imza atabilen yetki.
- `mint`: Grup tokeninin minti.
- `size`: Mevcut grup üye sayısı.
- `max_size`: Grup için maksimum üye sayısı.

```rust
type OptionalNonZeroPubkey = Pubkey; // Tüm sıfırsa, `None` olarak yorumlanır
type PodU32 = [u8; 4];
type Pubkey = [u8; 32];

/// Tip belirleyici: [214, 15, 63, 132, 49, 119, 209, 40]
/// `hash("spl_token_group_interface:group")` ifadesinin ilk 8 byte'ı
pub struct TokenGroup {
    /// Grubu güncellemek için imza atabilen yetki
    pub update_authority: OptionalNonZeroPubkey,
    /// Spoofing'e karşı, grubun belirli bir mint'e ait olduğundan emin olmak için kullanılan mint
    pub mint: Pubkey,
    /// Mevcut grup üye sayısı
    pub size: PodU32,
    /// Grup için maksimum üye sayısı
    pub max_size: PodU32,
}
```

#### Grup ve Grup İşaretçisi ile Mint Oluşturma

`grup` ve `grup işaretçisi` ile bir mint oluşturmak dört talimat içerir:

1. `SystemProgram.createAccount`
2. `createInitializeGroupPointerInstruction`
3. `createInitializeMintInstruction`
4. `createInitializeGroupInstruction`

İlk talimat `SystemProgram.createAccount`, blockchain üzerinde mint hesabı için alan ayırır. Ancak, tüm Token Extensions Programı mintleri gibi, mintin boyutunu ve maliyetini hesaplamamız gerekir. Bu, `getMintLen` ve `getMinimumBalanceForRentExemption` kullanılarak gerçekleştirilebilir. Bu durumda, yalnızca `ExtensionType.GroupPointer` ile `getMintLen` çağrısı yapacağız. Ardından grup verileri için mint uzunluğuna `TOKEN_GROUP_SIZE` ekleyeceğiz.

Mint uzunluğunu almak ve hesap oluşturma talimatı oluşturmak için şunları yapın:

```ts
// mint uzunluğunu al
const extensions = [ExtensionType.GroupPointer];
const mintLength = getMintLen(extensions) + TOKEN_GROUP_SIZE;

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

İkinci talimat `createInitializeGroupPointerInstruction`, grup işaretçisini başlatır. Mint, grup adresini ayarlayabilecek opsiyonel yetki, grubu tutan adres ve sahibi programı argüman olarak alır.

```ts
const initializeGroupPointerInstruction =
  createInitializeGroupPointerInstruction(
    mintKeypair.publicKey,
    payer.publicKey,
    mintKeypair.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
```

Üçüncü talimat `createInitializeMintInstruction`, minti başlatır.

```ts
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Dördüncü talimat `createInitializeGroupInstruction`, aslında grubu başlatır ve grup hesabında konfigürasyonu saklar.

```ts
const initializeGroupInstruction = createInitializeGroupInstruction({
  group: mintKeypair.publicKey,
  maxSize: maxMembers,
  mint: mintKeypair.publicKey,
  mintAuthority: payer.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  updateAuthority: payer.publicKey,
});
```

Son olarak, bu talimatları işlemi ekleyip Solana ağına gönderiyoruz.

```ts
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeGroupPointerInstruction,
  initializeMintInstruction,
  initializeGroupInstruction,
);

const signature = await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

### Grup Yetkisini Güncelleme

Bir grubun yetkisini güncellemek için sadece `tokenGroupUpdateGroupAuthority` fonksiyonuna ihtiyacımız var.

```ts
import { tokenGroupUpdateGroupAuthority } from "@solana/spl-token";

const signature = await tokenGroupUpdateGroupAuthority(
  connection, // bağlantı - Kullanılacak bağlantı
  payer, // payer - İşlem ücretleri için ödeyici
  mint.publicKey, // mint - Grup mint
  oldAuthority, // hesap - Eski güncelleme yetkisinin genel anahtarı
  newAuthority, // hesap - Yeni güncelleme yetkisinin genel anahtarı
  undefined, // multiSigners - `authority` çok imzalıysa imzalama hesapları
  { commitment: "finalized" }, // confirmOptions - İşlemi onaylamak için seçenekler
  TOKEN_2022_PROGRAM_ID, // programId - SPL Token program hesabı
);
```

### Bir Grubun Maksimum Boyutunu Güncelleme

Bir grubun maksimum boyutunu güncellemek için sadece `tokenGroupUpdateGroupMaxSize` fonksiyonuna ihtiyacımız var.

```ts
import { tokenGroupUpdateGroupMaxSize } from "@solana/spl-token";

const signature = tokenGroupUpdateGroupMaxSize(
  connection, // bağlantı - Kullanılacak bağlantı
  payer, // payer - İşlem ücretleri için ödeyici
  mint.publicKey, // mint - Grup mint
  updpateAuthority, // hesap - Grubun güncelleme yetkisi
  4, // maxSize - Grubun yeni maksimum boyutu
  undefined, // multiSigners - `authority` çok imzalıysa imzalama hesapları
  { commitment: "finalized" }, // confirmOptions - İşlemi onaylamak için seçenekler
  TOKEN_2022_PROGRAM_ID, // programId - SPL Token program hesabı
);
```

### Üye ve Üye İşaretçisi

`üye` ve `üye işaretçisi` uzantıları, bir token üyesini tanımlar. On-chain verisi aşağıdaki gibidir:

- `mint`: Üye tokeninin minti.
- `grup`: Grup hesabının adresi.
- `üye_numarası`: Üye numarası (grup içindeki indeks).

```rust
/// Tip belirleyici: [254, 50, 168, 134, 88, 126, 100, 186]
/// `hash("spl_token_group_interface:member")` ifadesinin ilk 8 byte'ı
pub struct TokenGroupMember {
    /// Spoofing'e karşı, üyenin belirli bir mint'e ait olduğundan emin olmak için kullanılan mint
    pub mint: Pubkey,
    /// `TokenGroup`'un genel anahtarı
    pub group: Pubkey,
    /// Üye numarası
    pub member_number: PodU32,
}
```

#### Üye İşaretçisi ile Mint Oluşturma

`üye işaretçisi` ve `üye` uzantıları ile bir mint oluşturmak dört talimat içerir:

1. `SystemProgram.createAccount`
2. `createInitializeGroupMemberPointerInstruction`
3. `createInitializeMintInstruction`
4. `createInitializeMemberInstruction`

İlk talimat `SystemProgram.createAccount`, blockchain üzerinde mint hesabı için alan ayırır. Ancak, tüm Token Extensions Programı mintleri gibi, mintin boyutunu ve maliyetini hesaplamamız gerekir. Bu, `getMintLen` ve `getMinimumBalanceForRentExemption` kullanılarak gerçekleştirilebilir. Bu durumda, `ExtensionType.GroupMemberPointer` ile `getMintLen` çağrısı yapacağız. Ardından, üye verileri için mint uzunluğuna `TOKEN_GROUP_MEMBER_SIZE` ekleyeceğiz.

Mint uzunluğunu almak ve hesap oluşturma talimatı oluşturmak için şunları yapın:

```ts
// mint uzunluğunu al
const extensions = [ExtensionType.GroupMemberPointer];
const mintLength = getMintLen(extensions) + TOKEN_GROUP_MEMBER_SIZE;

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

İkinci talimat `createInitializeGroupMemberPointerInstruction`, grup üye işaretçisini başlatır. Mint, grup adresini ayarlayabilecek opsiyonel yetki, grubu tutan adres ve sahibi programı argüman olarak alır.

```ts
const initializeGroupMemberPointerInstruction =
  createInitializeGroupMemberPointerInstruction(
    mintKeypair.publicKey,
    payer.publicKey,
    mintKeypair.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
```

Üçüncü talimat `createInitializeMintInstruction`, minti başlatır.

```ts
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Dördüncü talimat `createInitializeMemberInstruction`, aslında üyeyi başlatır ve üye hesabında konfigürasyonu saklar. Bu işlev grup adresini argüman olarak alır ve üyeyi o grupla ilişkilendirir.

```ts
const initializeMemberInstruction = createInitializeMemberInstruction({
  group: groupAddress,
  groupUpdateAuthority: payer.publicKey,
  member: mintKeypair.publicKey,
  memberMint: mintKeypair.publicKey,
  memberMintAuthority: payer.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

Son olarak, bu talimatları işlemi ekleyip Solana ağına gönderiyoruz.

```ts
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeGroupMemberPointerInstruction,
  initializeMintInstruction,
  initializeMemberInstruction,
);

const signature = await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

### Grup ve Üye Verilerini Alma

#### Grup İşaretçisi Durumunu Alma

Bir mint için `grup işaretçisi` durumunu almak için, önce `getMint` kullanarak hesabı elde etmemiz ve ardından bu veriyi `getGroupPointerState` fonksiyonu ile ayrıştırmamız gerekir. Bu, bize `GroupPointer` yapısını döndürür.

```ts
/** Program tarafından saklanan GroupPointer */
export interface GroupPointer {
  /** Grup adresini ayarlayabilen opsiyonel yetki */
  authority: PublicKey | null;
  /** Grubu tutan opsiyonel hesap adresi */
  groupAddress: PublicKey | null;
}
```

`GroupPointer` verilerini almak için şu şekilde çağırın:

```ts
const groupMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

const groupPointerData: GroupPointer = getGroupPointerState(groupMint);
```

#### Grup durumunu alma

Bir mint için grup durumunu almak için, önce `getMint` kullanarak hesabı elde etmemiz ve ardından bu veriyi `getTokenGroupState` fonksiyonu ile ayrıştırmamız gerekir. Bu, `TokenGroup` yapısını döndürür.

```ts
export interface TokenGroup {
  /** Grubu güncellemek için imza atabilen yetki */
  updateAuthority?: PublicKey;
  /** Spoofing'e karşı, grubun belirli bir mint'e ait olduğundan emin olmak için kullanılan mint */
  mint: PublicKey;
  /** Mevcut grup üye sayısı */
  size: number;
  /** Grup için maksimum üye sayısı */
  maxSize: number;
}
```

`TokenGroup` verilerini almak için şu şekilde çağırın:

```ts
const groupMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

const groupData: TokenGroup = getTokenGroupState(groupMint);
```

#### Grup Üye İşaretçisi Durumunu Alma

Bir mint için `üye işaretçisi` durumunu almak için, minti `getMint` ile elde ederiz ve ardından `getGroupMemberPointerState` ile ayrıştırırız. Bu, bize `GroupMemberPointer` yapısını döndürür.

```ts
/** Program tarafından saklanan GroupMemberPointer */
export interface GroupMemberPointer {
  /** Üye adresini ayarlayabilen opsiyonel yetki */
  authority: PublicKey | null;
  /** Üyeyi tutan opsiyonel hesap adresi */
  memberAddress: PublicKey | null;
}
```

`GroupMemberPointer` verilerini almak için şu şekilde çağırın:

```ts
const memberMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

const memberPointerData = getGroupMemberPointerState(memberMint);
```

#### Grup Üye Durumunu Alma

Bir mintin `üye` durumunu almak için, minti `getMint` ile elde ederiz ve ardından `getTokenGroupMemberState` ile ayrıştırırız. Bu, `TokenGroupMember` yapısını döndürür.

```ts
export interface TokenGroupMember {
  /** Spoofing'e karşı, üyenin belirli bir mint'e ait olduğundan emin olmak için kullanılan mint */
  mint: PublicKey;
  /** `TokenGroup`'un genel anahtarı */
  group: PublicKey;
  /** Üye numarası */
  memberNumber: number;
}
```

`TokenGroupMember` verilerini almak için şu şekilde çağırın:

```ts
const memberMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
const memberData = getTokenGroupMemberState(memberMint);
```

---

## Laboratuvar

Bu laboratuvarda `grup`, `grup işaretçisi`, `üye` ve `üye işaretçisi` uzantılarını `metadata` ve `metadata pointer` uzantıları ile birlikte kullanarak bir Cool Cats NFT koleksiyonu oluşturacağız.

Cool Cats NFT koleksiyonu, içinde üç üye NFT'si bulunan bir grup NFT'si içerecektir.

#### 1. Başlarken

Başlamak için [bu](https://github.com/Unboxed-Software/solana-lab-group-member) depo `starter` dalını klonlayın.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-group-member.git
cd solana-lab-group-member
git checkout starter
npm install
```

`starter` kodu şunları içerir:

- `index.ts`: bir bağlantı nesnesi oluşturur ve `initializeKeypair` çağrısını yapar. Burada scriptimizi yazacağız.
- `assets`: NFT koleksiyonumuz için resmi içeren klasör.
- `helper.ts`: metadata yükleme için yardımcı işlevler.

#### 2. Doğrulayıcı düğüm çalıştırma

:::tip
Bu kılavuz için, kendi doğrulayıcı düğümümüzü çalıştıracağız.
:::

Ayrı bir terminalde, şu komutu çalıştırın: `solana-test-validator`. Bu, düğümü çalıştıracak ve bazı anahtarlar ve değerler kaydedecektir. Bağlantımızda kullanmamız gereken değer, bu durumda `http://127.0.0.1:8899` olan JSON RPC URL'sidir. Ardından, bununla bağlantıyı kurarak yerel RPC URL'sini kullanmasını belirtiriz.

`const connection = new Connection("http://127.0.0.1:8899", "confirmed");`

Doğrulayıcı doğru bir şekilde ayarlandığında, `index.ts`'yi çalıştırabilir ve her şeyin düzgün çalıştığını onaylayabilirsiniz.

```bash
npx esrun src/index.ts
```

#### 3. Grup metadata ayarları

Grup NFT'mizi oluşturmadan önce grup metadata'sını hazırlayıp yüklememiz gerekir. Görseli ve metadata'yı yüklemek için devnet Irys (Arweave) kullanıyoruz. Bu işlevsellik size `helpers.ts` içinde sağlanmaktadır.

Bu dersin kolaylığı için NFT'ler için varlıklar `assets` dizininde sağlanmıştır.

Kendi dosyalarınızı ve metadata'nızı kullanmak isterseniz lütfen özgürce kullanabilirsiniz!

Grup metadata'mızı hazırlamak için şunları yapmamız gerekiyor:

1. Yükleme için metadata'mızı `LabNFTMetadata` arayüzü kullanarak formatlamak.
2. `helpers.ts` içinden `uploadOffChainMetadata` çağrısını yapmak.
3. Önceki adımdan elde edilen uri'yi dahil ederek her şeyi formatlamak.

Yükleme için metadata'mızı formatlamamız gerekiyor (`LabNFTMetadata`), resmi ve metadata'yı yüklememiz gerekiyor (`uploadOffChainMetadata`), ve nihayet her şeyi `@solana/spl-token-metadata` kütüphanesindeki `TokenMetadata` arayüzüne formatlamamız gerekiyor.

:::warning
Not: 100kb altında yüklemeler için devnet Irys kullanıyoruz.
:::

```ts
// Grup metadata'sını oluştur

const groupMetadata: LabNFTMetadata = {
  mint: groupMintKeypair,
  imagePath: "assets/collection.png",
  tokenName: "cool-cats-collection",
  tokenDescription: "Cool Cat NFT'lerin Koleksiyonu",
  tokenSymbol: "MEOW",
  tokenExternalUrl: "https://solana.com/",
  tokenAdditionalMetadata: {},
  tokenUri: "",
};

// Offchain metadata'yı yükle
groupMetadata.tokenUri = await uploadOffChainMetadata(payer, groupMetadata);

// Grup token metadata'sını formatla
const collectionTokenMetadata: TokenMetadata = {
  name: groupMetadata.tokenName,
  mint: groupMintKeypair.publicKey,
  symbol: groupMetadata.tokenSymbol,
  uri: groupMetadata.tokenUri,
  updateAuthority: payer.publicKey,
  additionalMetadata: Object.entries(
    groupMetadata.tokenAdditionalMetadata || [],
  ).map(([trait_type, value]) => [trait_type, value]),
};
```

Scripti çalıştırmaktan çekinmeyin ve her şeyin yüklendiğinden emin olun.

```bash
npx esrun src/index.ts
```

#### 3. Grup ve grup işaretçisi ile mint oluşturma

`metadata`, `metadata pointer`, `group` ve `group pointer` uzantılarını kullanarak grup NFT'sini oluşturalım. 

Bu NFT, koleksiyonumuzun görsel temsilidir. 

Öncelikle yeni `createTokenGroup` fonksiyonumuzun giriş parametrelerini tanımlayalım:

- **`connection`**: Blok zincirine bağlantı
- **`payer`**: İşlemi ödeyen anahtar çifti
- **`mintKeypair`**: Mint anahtar çifti
- **`decimals`**: Mint ondalık sayıları (NFT'ler için 0)
- **`maxMembers`**: Grupta izin verilen maksimum üye sayısı
- **`metadata`**: Grup minti için metadata

```ts
export async function createTokenGroup(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  maxMembers: number,
  metadata: TokenMetadata,
): Promise<TransactionSignature>;
```

:::tip
NFT'mizi oluşturmak için `metadata` ve `metadata pointer` uzantılarını kullanarak metadata'yı doğrudan mint hesabında saklayacağız. Ayrıca `group` ve `group pointer` uzantıları ile grup hakkında bazı bilgileri de kaydedeceğiz.
:::

Grup NFT'mizi oluşturmak için aşağıdaki talimatlara ihtiyacımız var:

- `SystemProgram.createAccount`: Mint hesabı için Solana'da alan tahsis eder. `mintLength` ve `mintLamports` değerlerini sırasıyla `getMintLen` ve `getMinimumBalanceForRentExemption` kullanarak alabiliriz.
- `createInitializeGroupPointerInstruction`: Grup işaretçisini başlatır
- `createInitializeMetadataPointerInstruction`: Metadata işaretçisini başlatır
- `createInitializeMintInstruction`: Mint'i başlatır
- `createInitializeGroupInstruction`: Grubu başlatır
- `createInitializeInstruction`: Metadata'yı başlatır

Son olarak, bu tüm talimatları bir işleme eklememiz ve Solana ağına göndermemiz gerekiyor; ardından imzayı döndüreceğiz. Bunu `sendAndConfirmTransaction` çağırarak yapabiliriz.

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
  createInitializeGroupInstruction,
  createInitializeGroupPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
  TOKEN_GROUP_SIZE,
} from "@solana/spl-token";

import {
  TokenMetadata,
  createInitializeInstruction,
  pack,
} from "@solana/spl-token-metadata";

export async function createTokenGroup(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  maxMembers: number,
  metadata: TokenMetadata,
): Promise<TransactionSignature> {
  const extensions: ExtensionType[] = [
    ExtensionType.GroupPointer,
    ExtensionType.MetadataPointer,
  ];

  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length + 500;
  const mintLength = getMintLen(extensions);
  const totalLen = mintLength + metadataLen + TOKEN_GROUP_SIZE;

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(totalLen);

  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeGroupPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeGroupInstruction({
      group: mintKeypair.publicKey,
      maxSize: maxMembers,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      programId: TOKEN_2022_PROGRAM_ID,
      updateAuthority: payer.publicKey,
    }),
    createInitializeInstruction({
      metadata: mintKeypair.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      name: metadata.name,
      programId: TOKEN_2022_PROGRAM_ID,
      symbol: metadata.symbol,
      updateAuthority: payer.publicKey,
      uri: metadata.uri,
    }),
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
  );

  return signature;
}
```

Artık fonksiyonumuzu oluşturduğumuza göre, bunu `index.ts` dosyamızda çağırabiliriz.

```ts
// Grup oluştur
const signature = await createTokenGroup(
  connection,
  payer,
  groupMintKeypair,
  decimals,
  maxMembers,
  collectionTokenMetadata,
);

console.log(
  `Metadata ile koleksiyon mint'i oluşturuldu:\n${getExplorerLink("tx", signature, "localnet")}\n`,
);
```

Scripti çalıştırmadan önce, yeni oluşturulan grup NFT'sini alalım ve içeriğini yazdıralım. Bunu `index.ts` dosyasında yapalım:

```ts
// Grubu al
const groupMint = await getMint(
  connection,
  groupMintKeypair.publicKey,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
const fetchedGroupMetadata = await getTokenMetadata(
  connection,
  groupMintKeypair.publicKey,
);
const metadataPointerState = getMetadataPointerState(groupMint);
const groupData = getGroupPointerState(groupMint);

console.log("\n---------- GRUP VERİLERİ -------------\n");
console.log("Grup Mint: ", groupMint.address.toBase58());
console.log(
  "Metadata Pointer Hesabı: ",
  metadataPointerState?.metadataAddress?.toBase58(),
);
console.log("Grup Pointer Hesabı: ", groupData?.groupAddress?.toBase58());
console.log("\n--- METADATA ---\n");
console.log("İsim: ", fetchedGroupMetadata?.name);
console.log("Sembol: ", fetchedGroupMetadata?.symbol);
console.log("Uri: ", fetchedGroupMetadata?.uri);
console.log("\n------------------------------------\n");
```

Artık scripti çalıştırabiliriz ve oluşturduğumuz grup NFT'sini görebiliriz.

```bash
npx esrun src/index.ts
```

#### 4. Üye NFT Metadata'sını Ayarlama

Artık grup NFT'mizi oluşturduğumuza göre, üye NFT'lerini oluşturabiliriz. Ancak onları gerçekten oluşturmadan önce, metadata'larını hazırlamamız gerekiyor.

Flow, grup NFT ile yaptığımız işlemlerle tamamen aynıdır.

1. `helper.ts` dosyasından `LabNFTMetadata` arayüzünü kullanarak metadata'mızı yüklemeye hazırlamamız gerekiyor.
2. `helpers.ts` dosyasındaki `uploadOffChainMetadata` fonksiyonunu çağırmalıyız.
3. Önceki adımdan elde edilen uri'yi `@solana/spl-token-metadata` kütüphanesindeki `TokenMetadata` arayüzüne dahil ederek her şeyi formatlamalıyız.

Ancak, üç üyemiz olduğu için, her üye için her adımı döngü ile geçireceğiz.

Öncelikle her üye için metadata'yı tanımlayalım:

```ts
// Üye metadata'sını tanımla
const membersMetadata: LabNFTMetadata[] = [
  {
    mint: cat0Mint,
    imagePath: "assets/cat_0.png",
    tokenName: "Kedi 1",
    tokenDescription: "Sevimli kedi",
    tokenSymbol: "MIAU",
    tokenExternalUrl: "https://solana.com/",
    tokenAdditionalMetadata: {},
    tokenUri: "",
  },
  {
    mint: cat1Mint,
    imagePath: "assets/cat_1.png",
    tokenName: "Kedi 2",
    tokenDescription: "Aşırı kedi",
    tokenSymbol: "MIAU",
    tokenExternalUrl: "https://solana.com/",
    tokenAdditionalMetadata: {},
    tokenUri: "",
  },
  {
    mint: cat2Mint,
    imagePath: "assets/cat_2.png",
    tokenName: "Kedi 3",
    tokenDescription: "Şaşkın kedi",
    tokenSymbol: "MIAU",
    tokenExternalUrl: "https://solana.com/",
    tokenAdditionalMetadata: {},
    tokenUri: "",
  },
];
```

Şimdi, her üye üzerinden döngü ile geçelim ve metadata'larını yükleyelim.

```ts
// Üye metadata'sını yükle
for (const member of membersMetadata) {
  member.tokenUri = await uploadOffChainMetadata(payer, member);
}
```

Son olarak, her üyenin metadata'sını `TokenMetadata` arayüzüne formatlayalım:

::::note
Not: Üye NFT'lerini oluşturmak için anahtar çiftine ihtiyaç duyacağımızdan onu da taşımak isteyeceğiz.
::::

```ts
// Token metadata'sını formatla
const memberTokenMetadata: { mintKeypair: Keypair; metadata: TokenMetadata }[] =
  membersMetadata.map(member => ({
    mintKeypair: member.mint,
    metadata: {
      name: member.tokenName,
      mint: member.mint.publicKey,
      symbol: member.tokenSymbol,
      uri: member.tokenUri,
      updateAuthority: payer.publicKey,
      additionalMetadata: Object.entries(
        member.tokenAdditionalMetadata || [],
      ).map(([trait_type, value]) => [trait_type, value]),
    } as TokenMetadata,
  }));
```

#### 5. Üye NFT'lerini Oluşturma

Gruplardan oluşan NFT gibi, üye NFT'lerini de oluşturmamız gerekiyor. Bunu `create-member.ts` adında yeni bir dosyada yapalım. Bu, `create-group.ts` dosyasına oldukça benzer olacaktır; ancak bu sefer `group` ve `group pointer` uzantıları yerine `member` ve `member pointer` uzantılarını kullanacağız.

Öncelikle yeni `createTokenMember` fonksiyonumuzun giriş parametrelerini tanımlayalım:

- **`connection`**: Blok zincirine bağlantı
- **`payer`**: İşlemi ödeyen anahtar çifti
- **`mintKeypair`**: Mint anahtar çifti
- **`decimals`**: Mint ondalık sayıları (NFT'ler için 0)
- **`metadata`**: Grup minti için metadata
- **`groupAddress`**: Grup hesabının adresi - bu durumda grup mint'in kendisi

```ts
export async function createTokenMember(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  metadata: TokenMetadata,
  groupAddress: PublicKey,
): Promise<TransactionSignature>;
```

Grup NFT gibi, aşağıdaki talimatlara ihtiyacımız var:

- `SystemProgram.createAccount`: Mint hesabı için Solana'da alan tahsis eder. `mintLength` ve `mintLamports` değerlerini sırasıyla `getMintLen` ve `getMinimumBalanceForRentExemption` kullanarak alabiliriz.
- `createInitializeGroupMemberPointerInstruction`: Üye işaretçisini başlatır
- `createInitializeMetadataPointerInstruction`: Metadata işaretçisini başlatır
- `createInitializeMintInstruction`: Mint'i başlatır
- `createInitializeMemberInstruction`: Üyeyi başlatır
- `createInitializeInstruction`: Metadata'yı başlatır

Son olarak, bu talimatları bir işlemin içine eklememiz, Solana ağına göndermemiz ve imzayı döndürmemiz gerekiyor. Bunu `sendAndConfirmTransaction` çağırarak yapabiliriz.

```ts
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
  PublicKey,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
  TOKEN_GROUP_MEMBER_SIZE,
  createInitializeGroupMemberPointerInstruction,
  createInitializeMemberInstruction,
} from "@solana/spl-token";

import {
  TokenMetadata,
  createInitializeInstruction,
  pack,
} from "@solana/spl-token-metadata";

export async function createTokenMember(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  metadata: TokenMetadata,
  groupAddress: PublicKey,
): Promise<TransactionSignature> {
  const extensions: ExtensionType[] = [
    ExtensionType.GroupMemberPointer,
    ExtensionType.MetadataPointer,
  ];

  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const mintLength = getMintLen(extensions);
  const totalLen = mintLength + metadataLen + TOKEN_GROUP_MEMBER_SIZE;

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(totalLen);

  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeGroupMemberPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMemberInstruction({
      group: groupAddress,
      groupUpdateAuthority: payer.publicKey,
      member: mintKeypair.publicKey,
      memberMint: mintKeypair.publicKey,
      memberMintAuthority: payer.publicKey,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeInstruction({
      metadata: mintKeypair.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      name: metadata.name,
      programId: TOKEN_2022_PROGRAM_ID,
      symbol: metadata.symbol,
      updateAuthority: payer.publicKey,
      uri: metadata.uri,
    }),
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
  );

  return signature;
}
```

Yeni fonksiyonumuzu `index.ts` dosyasına ekleyelim ve her üye için çağırabiliriz:

```ts
// Üye mint'lerini oluştur
for (const memberMetadata of memberTokenMetadata) {
  const signature = await createTokenMember(
    connection,
    payer,
    memberMetadata.mintKeypair,
    decimals,
    memberMetadata.metadata,
    groupMintKeypair.publicKey,
  );

  console.log(
    `Oluşturuldu ${memberMetadata.metadata.name} NFT:\n${getExplorerLink("tx", signature, "localnet")}\n`,
  );
}
```

Yeni oluşturduğumuz üye NFT'lerini alalım ve içeriklerini gösterelim.

```ts
for (const member of membersMetadata) {
  const memberMint = await getMint(
    connection,
    member.mint.publicKey,
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );
  const memberMetadata = await getTokenMetadata(
    connection,
    member.mint.publicKey,
  );
  const metadataPointerState = getMetadataPointerState(memberMint);
  const memberPointerData = getGroupMemberPointerState(memberMint);
  const memberData = getTokenGroupMemberState(memberMint);

  console.log("\n---------- ÜYE VERİLERİ -------------\n");
  console.log("Üye Mint: ", memberMint.address.toBase58());
  console.log(
    "Metadata Pointer Hesabı: ",
    metadataPointerState?.metadataAddress?.toBase58(),
  );
  console.log("Grup Hesabı: ", memberData?.group?.toBase58());
  console.log(
    "Üye Pointer Hesabı: ",
    memberPointerData?.memberAddress?.toBase58(),
  );
  console.log("Üye Numarası: ", memberData?.memberNumber);
  console.log("\n--- METADATA ---\n");
  console.log("İsim: ", memberMetadata?.name);
  console.log("Sembol: ", memberMetadata?.symbol);
  console.log("Uri: ", memberMetadata?.uri);
  console.log("\n------------------------------------\n");
}
```

Son olarak, scripti çalıştırıp NFT koleksiyonumuzu görebiliriz!

```bash
npx esrun src/index.ts
```

Bu kadar! Sorun yaşıyorsanız, lütfen `solution` [depo dalına](https://github.com/Unboxed-Software/solana-lab-group-member/tree/solution) göz atın.

## Görev

:::warning
`group`, `group pointer`, `member` ve `member pointer` uzantılarını kullanarak kendi NFT koleksiyonunuzu oluşturun.
:::