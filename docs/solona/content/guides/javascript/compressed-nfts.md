---
date: 2023-04-22T00:00:00Z
title: JavaScript ile Sıkıştırılmış NFT'ler Oluşturma
description:
  "Sıkıştırılmış NFT'ler, Metaplex'in Bubblegum programını kullanarak, NFT meta verilerini
  uygun maliyetle ve güvenli bir şekilde, Solana üzerinde State Compression kullanarak depolar."
keywords:
  - merkle ağacı
  - ReadApi
difficulty: intermediate
tags:
  - sıkıştırma
  - metaplex
altRoutes:
  - /developers/guides/compressed-nfts
---

Solana'daki sıkıştırılmış NFT'ler, NFT meta verilerini uygun maliyetle ve güvenli bir şekilde depolamak için
Metaplex'in [Bubblegum](https://docs.metaplex.com/programs/compression/) programını
kullanır ve `State Compression` kullanır.

Bu geliştirici kılavuzu, JavaScript/TypeScript kullanarak aşağıdakileri gösterecektir:

- `sıkıştırılmış NFT'ler için bir ağaç oluşturma`,
- `sıkıştırılmış NFT'leri bir ağaca basma`,
- `Read API'den sıkıştırılmış NFT meta verileri alma`,
  ve
- `sıkıştırılmış NFT'leri transfer etme`

## Sıkıştırılmış NFT'lere Giriş

Sıkıştırılmış NFT'ler, NFT'lerin depolama maliyetini önemli ölçüde azaltmak için `State Compression` ve
`merkle ağaçları` kullanır.
Bir NFT'nin meta verilerini tipik bir Solana hesabında depolamak yerine, sıkıştırılmış NFT'ler meta verileri
defter içinde depolar. Bu, sıkıştırılmış NFT'lerin Solana blok zincirinin güvenliğini ve hızını miras almaya
devam etmesini sağlarken genel depolama maliyetlerini de azaltır.

:::info
Zincir üzerindeki veri depolama mekanizması sıkıştırılmamış muadillerinden farklı olmasına rağmen,
sıkıştırılmış NFT'ler hâlâ tam olarak aynı [Metadata](https://docs.metaplex.com/programs/token-metadata/accounts#metadata)
şemasını/yapısını takip eder. 
:::

Bu da Koleksiyonunuzu ve NFT'nizi benzer şekilde tanımlamanıza olanak tanır.

Ancak, sıkıştırılmış NFT'leri basma ve transfer etme süreci, sıkıştırılmamış NFT'lerden farklıdır. Farklı bir
zincir programı kullanmanın yanı sıra, sıkıştırılmış NFT'ler bir merkle ağacına basılır ve transfer için bir
"kanıt" doğrulamaya ihtiyaç duyar. Bununla ilgili daha fazla bilgi aşağıda yer almaktadır.

### Sıkıştırılmış NFT'ler ve dizinleyiciler

Sıkıştırılmış NFT'ler, bütün meta verilerini `defter` içinde sakladığından,
sıkıştırılmamış NFT'ler gibi geleneksel `hesaplar` yerine, sıkıştırılmış NFT'lerin
meta verilerini hızlı bir şekilde almak için dizinleme hizmetlerine ihtiyacımız olacak.

:::tip
Destekleyen RPC sağlayıcıları, geliştiricilerin çağrabileceği ek RPC yöntemleri eklemek için Dijital Varlık
Standart Okuma API'sini (veya kısaca "Okuma API") kullanıyor. Bu ek, NFT odaklı yöntemler, belirli NFT'ler
hakkında tüm bilgileri yüklemektedir. Hem **Sıkıştırılmış NFT'ler** hem de
sıkıştırılmamış NFT'ler için destek içermektedir.
:::

#### Metadata defter tarafından güvence altına alınır ve dizinleyiciler tarafından önbelleğe alınır

Doğrulayıcılar, son defter verilerinin çok uzun bir geçmişini tutmadığından, bu dizinleyiciler sıkıştırılmış NFT
meta verilerini Solana defteri üzerinden "önbelleğe alır". Uygulamaların hızını ve kullanıcı deneyimini
geliştirmek için istek üzerine hızlı bir şekilde geri hizmet verir. Ancak, sıkıştırılmış NFT basılırken meta
veri zaten deftere güvence altına alındığı için, herkes güvenli defterden meta veriyi yeniden dizinleyebilir.
Bu durum, ihtiyaç duyulduğunda verinin bağımsız olarak doğrulanmasına olanak tanır.

:::note
Bu dizinleme hizmetleri, şu anda bazı yaygın RPC sağlayıcılarından mevcut olup, yakın gelecekte daha fazlası
desteğe açılacaktır. Okuma API'sini zaten destekleyen birkaç RPC sağlayıcısı şunlardır:
:::

- Helius
- Triton
- SimpleHash

### Sıkıştırılmış NFT'leri nasıl basılır

Solana üzerinde sıkıştırılmış NFT'ler oluşturma veya basma süreci, "geleneksel NFT koleksiyonu" oluşturmaya
benzer ve birkaç fark ile gerçekleşir. Basım süreci 3 ana adımda gerçekleşecektir:

1. bir NFT koleksiyonu oluşturma (veya mevcut bir tane kullanma)
2. bir `eş zamanlı merkle ağacı` oluşturma
   ( `@solana/spl-account-compression` SDK'sını kullanarak)
3. sıkıştırılmış NFT'leri ağacınıza basma (istediğiniz herhangi bir sahibin adresine)

### Sıkıştırılmış NFT'yi nasıl transfer edilir

Sıkıştırılmış NFT'niz Solana blok zincirinde var olduğunda, bir sıkıştırılmış NFT'nin mülkiyetini transfer etme
süreci birkaç geniş adımda gerçekleşir:

1. NFT "varlık" bilgilerini almak (dizinleyiciden)
2. NFT'nin "kanıtını" almak (dizinleyiciden)
3. Merkle ağaç hesabını almak (Solana blok zincirinden)
4. varlık kanıtını hazırlamak (parsing ve formatlama)
5. transfer talimatını oluşturmak ve göndermek

İlk üç adım esasen transfer edilecek NFT için belirli bilgilerin ( `proof` ve ağacın kanopi derinliği) toplanmasını
içerir. Bu bilgilere, `proof`'u doğru bir şekilde parsing/formatlamak için ihtiyaç duyulmaktadır.

## Başlarken

Bu kılavuz için, oluşturacağımız sıkıştırılmış NFT koleksiyonu hakkında birkaç varsayımda bulunacağız:

- bu örnekte TypeScript ve NodeJS kullanacağız
- tek bir, **yeni** Metaplex koleksiyonu kullanacağız

### Proje Ayarları

Sıkıştırılmış NFT koleksiyonumuzu oluşturmaya başlamadan önce, birkaç paketi yüklememiz gerekiyor:

- [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) - blok zinciri ile etkileşim için
  temel Solana JS SDK'sı, RPC bağlantımızı yapmak ve işlemler göndermek dahil
- [`@solana/spl-token`](https://www.npmjs.com/package/@solana/spl-token) - koleksiyonumuzu ve zincir üzerinde
  mint oluşturmak için kullanılır
- [`@solana/spl-account-compression`](https://www.npmjs.com/package/@solana/spl-account-compression) -
  sıkıştırılmış NFT'lerimizi depolamak için zincir üzerindeki ağacı oluşturmak için kullanılır
- [`@metaplex-foundation/mpl-bubblegum`](https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum) -
  zincir üzerinde sıkıştırılmış NFT'leri basmak ve transfer etmek için tipleri ve yardımcı işlevleri almak için
  kullanılır
- [`@metaplex-foundation/mpl-token-metadata`](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata) -
  NFT'imizin meta verileri için tipleri ve yardımcı işlevleri almak için kullanılır


Tercih ettiğiniz paket yöneticisini (örneğin npm, yarn, pnpm, vb.) kullanarak bu paketleri projenize yükleyin:

```shell
yarn add @solana/web3.js@1 @solana/spl-token @solana/spl-account-compression
```

```shell
yarn add @metaplex-foundation/mpl-bubblegum @metaplex-foundation/mpl-token-metadata
```

## Bir Koleksiyon Oluşturma

NFT'ler genellikle Metaplex standartlarını kullanarak bir [Koleksiyon](https://docs.metaplex.com/programs/token-metadata/certified-collections#collection-nfts) içinde gruplandırılır.
Bu hem geleneksel NFT'ler hem de sıkıştırılmış NFT'ler için doğrudur. NFT Koleksiyonu, cüzdanlarda ve keşif
platformlarında görünecek olan koleksiyon resmini ve adını içeren tüm geniş meta verileri depolayacaktır.

Altta yatan bir NFT koleksiyonu, Solana üzerindeki herhangi bir diğer token gibi çalışır. Daha spesifik olarak,
bir Koleksiyon, etkili bir şekilde sıkıştırılmamış bir NFT'dir. Yani, aslında, onları bir
[SPL token](https://spl.solana.com/token) oluşturma sürecini takip ederek oluştururuz:

- yeni bir token "mint" oluşturma
- token mint'imiz için bir ilişkili token hesabı (`ata`) oluşturma
- tek bir token'ı mint etme
- koleksiyonun meta verilerini zincir üzerinde bir Hesapta depolama

NFT Koleksiyonları, `State Compression` veya
`sıkıştırılmış NFT'ler` ile ilgili hiçbir özel duruma sahip
olmadığı için, bu kılavuzda bir koleksiyon oluşturmayı kapsamayacağız.

### Koleksiyon adresleri

Bu kılavuz bir koleksiyonu oluşturmayı kapsamasa da, Koleksiyonunuz için çeşitli adreslere ihtiyacımız olacak:

- `collectionAuthority` - bu, `payer`'ınız olabilir ama olmayabilir de
- `collectionMint` - koleksiyonun mint adresi
- `collectionMetadata` - koleksiyonun meta veri hesabı
- `editionAccount` - örneğin, koleksiyonunuz için oluşturulan `masterEditionAccount`

## Bir ağaç oluşturma

Sıkıştırılmış NFT'ler oluştururken alınacak en önemli kararlardan biri `ağacınızı nasıl kuracağınızdır`.
Özellikle, ağacınızı boyutlandırmak için kullanılan değerler, oluşturma maliyetini belirleyecek ve **Oluşturma
işleminden sonra değiştirilemeyecek**.

:::warning
Ağaç vs Koleksiyon

Bir ağaç, bir koleksiyonla aynı şey değildir. Tek bir koleksiyon, _herhangi_ bir sayıdaki ağaçları kullanabilir.
Aslında, daha küçük ağaçların daha büyük topluluk için daha iyi bileşenel daha fazla uyumluluğa sahip
olması nedeniyle, bu genelde daha büyük koleksiyonlar için önerilmektedir.

Tam aksine, bir ağaç birden fazla koleksiyonda kullanılabilse de, bu genellikle kötü bir uygulama olarak
düşünülmekte ve önerilmemektedir.
:::

[`@solana/spl-account-compression`](https://www.npmjs.com/package/@solana/spl-account-compression) SDK'sının sağladığı yardımcı işlevleri kullanarak
ağacımızı aşağıdaki adımlarda oluşturabiliriz:

- ağaç boyutumuzu belirleme
- yeni bir Keypair oluşturma ve zincir üzerinde ağaca tahsis edilen alan
- ağacı gerçekten oluşturma (Bubblegum programı tarafından sahiplenilerek)

### Ağacınızı boyutlandırma

Ağaç boyutunuz, her biri çok belirli bir amaca hizmet eden 3 değerle ayarlanır:

1. `maxDepth` - ağaçta kaç NFT'ye sahip olabileceğimizi belirlemek için kullanılır
2. `maxBufferSize` - aynı blokta ağacınıza kaç güncelleme
   yapılabileceğini belirlemek için kullanılır
3. `canopyDepth` - zincir üzerinde kanıtın bir kısmını depolamak için
   kullanılır ve böylece sıkıştırılmış NFT koleksiyonunuzun maliyetini ve bileşenel
   uyumluluğunu büyük ölçüde etkiler.

> `State Compression` ile ilgili
> daha fazla ayrıntıyı, ayrıca `ağacı nasıl boyutlandıracağınızla`
> ve olası bileşenel endişeleriyle ilgili okumalar yapabilirsiniz.

Şimdi, 10k NFT içerecek bir sıkıştırılmış NFT koleksiyonu oluşturmayı varsayalım. Ve koleksiyonumuz nispeten
küçük olduğundan, tüm NFT'leri depolamak için yalnızca tek bir küçük ağaç gereklidir:

```ts
// oluşturulacak ağacın derinliğini ve tampon boyutunu tanımlayın
const maxDepthSizePair: ValidDepthSizePair = {
  // max=16,384 düğüm (bir `maxDepth` için 14)
  maxDepth: 14,
  maxBufferSize: 64,
};

// oluşturulacak ağacın kanopi derinliğini tanımlayın
const canopyDepth = 10;
```

`14` değerine sahip bir `maxDepth` ayarlanması, ağacımızın `16,384`
sıkıştırılmış NFT'yi tutmasına izin verecek, bu da `10k` koleksiyon boyutumuzu
yeterince aşmaktadır.

Sadece belirli [ValidDepthSizePair](https://solana-labs.github.io/solana-program-library/account-compression/sdk/docs/modules/index.html#ValidDepthSizePair)
çiftlerinin bulunmasına izin verildiğinden, `maxBufferSize` değerini istediğiniz
`maxDepth` ile ilgili değere ayarlayın.

Ardından, `10` değerine sahip bir `canopyDepth` ayarlamak, ağacımızın
"kanıt düğüm hash"larımızdan `10`'unu zincir üzerinde depolamasını söyler.
Bu da her sıkıştırılmış NFT transfer talimatında daima `4` kanıt düğümü değerini
(i.e. `maxDepth - canopyDepth`) içermemizi gerektirecektir.

### Ağaç için adresleri oluşturma

Yeni bir ağaç oluştururken, ağacın sahip olduğu bir yeni `Keypair` adresi
oluşturmamız gerekiyor:

```ts
const treeKeypair = Keypair.generate();
```

Ağacımız, sıkıştırılmış NFT'ler için kullanılacak olduğundan, ayrıca Bubblegum programı tarafından sahiplenilen
bir Hesap türetmemiz gerekecek (yani, PDA):

```ts
// ağacın yetkisini türetme (PDA), Bubblegum tarafından sahiplenilen
const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
  [treeKeypair.publicKey.toBuffer()],
  BUBBLEGUM_PROGRAM_ID,
);
```

### Ağaç oluşturma talimatlarını oluşturma

Ağaç boyutlarımızı ve adreslerimizi tanımladıktan sonra, iki ilgili talimat oluşturmalıyız:

1. ağacımız için zincir üzerinde yeterince alan tahsis etmek
2. ağaç geliştirme, Bubblegum programı tarafından sahiplenilmekte

[`createAllocTreeIx`](https://solana-labs.github.io/solana-program-library/account-compression/sdk/modules/index.html#createAllocTreeIx) yardımcı işlevini kullanarak, ağacımız için zincir üzerinde yeterince yer tahsis edelim.

```ts
// ağaç hesabını `space` ile zincir üzerinde tahsis et
const allocTreeIx = await createAllocTreeIx(
  connection,
  treeKeypair.publicKey,
  payer.publicKey,
  maxDepthSizePair,
  canopyDepth,
);
```

Sonrasında, Bubblegum SDK'den [`createCreateTreeInstruction`](https://metaplex-foundation.github.io/metaplex-program-library/docs/bubblegum/functions/createCreateTreeInstruction.html) kullanarak, ağacı gerçekten zincir üzerinde oluşturalım. Bu sayede Bubblegum programına sahip olacak.

```ts
// ağacı gerçekten oluşturacak talimatı yarat
const createTreeIx = createCreateTreeInstruction(
  {
    payer: payer.publicKey,
    treeCreator: payer.publicKey,
    treeAuthority,
    merkleTree: treeKeypair.publicKey,
    compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    // NOT: bu bazı zincir içi logging için kullanılır
    logWrapper: SPL_NOOP_PROGRAM_ID,
  },
  {
    maxBufferSize: maxDepthSizePair.maxBufferSize,
    maxDepth: maxDepthSizePair.maxDepth,
    public: false,
  },
  BUBBLEGUM_PROGRAM_ID,
);
```

### İşlemi oluştur ve gönder

İki talimatımızı oluşturduktan sonra, bunları bir işlemin içerisine ekleyip, `payer` ve oluşturulan `treeKeypair`
imzacılarının işlemi imzalamasını sağlayarak işlemi blok zincirine gönderebiliriz:

```ts
// işlemi oluştur
const tx = new Transaction().add(allocTreeIx).add(createTreeIx);
tx.feePayer = payer.publicKey;

// işlemi gönder
const txSignature = await sendAndConfirmTransaction(
  connection,
  tx,
  // `treeKeypair` PDA ve `payer`'ın İKİSİNİN de imzalayıcı olduğu garanti ediliyor
  [treeKeypair, payer],
  {
    commitment: "confirmed",
    skipPreflight: true,
  },
);
```

Kısa bir süre sonra ve işlem onaylandığında, sıkıştırılmış NFT'leri ağacımıza basmaya hazırız.

## Sıkıştırılmış NFT'leri Basma

Sıkıştırılmış NFT'ler, geleneksel NFT'lerle aynı Metaplex [meta veri standartlarına](https://docs.metaplex.com/programs/token-metadata/accounts#metadata) sahip olduklarından, aslında NFT'lerimizin verilerini benzer şekilde tanımlayabiliriz.

:::note
Ana fark, sıkıştırılmış NFT'lerin meta verilerinin aslında defterde depolanmasıdır (geleneksel NFT'lerin hesaplarda depolandığının aksine). Meta veriler "hash'lenir" ve ağacımızda depolanır ve böylece Solana defteri tarafından güvence altına alınır.
:::

Bu da, orijinal meta verilerimizin değişmediğini kriptografik olarak doğrulamamıza olanak tanır (istersek).

> State Compression'ın, Solana defteri kullanarak
> [eşzamanlı merkle ağaçlarını](https://docs/advanced/state-compression.md#what-is-a-concurrent-merkle-tree) kullanarak
> zincir dışı verileri kriptografik olarak güvence altına alma yöntemini öğrenin.

### NFT meta verilerimizi tanımlama

Tek bir NFT'yi basmak üzere olduğumuz belirli meta verileri tanımlayabiliriz:

```ts
const compressedNFTMetadata: MetadataArgs = {
  name: "NFT Adı",
  symbol: "ANY",
  // her NFT için belirli JSON meta verileri
  uri: "https://supersweetcollection.notarealurl/token.json",
  creators: null,
  editionNonce: 0,
  uses: null,
  collection: null,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 0,
  isMutable: false,
  // bu değerler Bubblegum paketinden alınmaktadır
  tokenProgramVersion: TokenProgramVersion.Original,
  tokenStandard: TokenStandard.NonFungible,
};
```

:::tip
Bu demo için, NFT meta verilerimizin dikkat edilmesi gereken başlıca noktalar şunlardır:

- `name` - bu, NFT'mizin cüzdanlarda ve keşif platformlarında görüntülenecek olan gerçek adıdır.
- `uri` - bu, NFT'lerinizin meta veri JSON dosyası için adrestir.
- `creators` - bu örnek için bir yaratıcılar listesi depolamıyoruz. NFT'lerinizin telif hakkı almasını istiyorsanız, burada gerçek veri saklamanız gerekecek. Daha fazla bilgi için Metaplex belgelerine bakabilirsiniz.
:::

### Bubblegum imzalayıcıyı türetme

Yeni sıkıştırılmış NFT'ler basarken, Bubblegum programının SPL sıkıştırma programını
çalıştırmak için bir PDA'ya ihtiyacı vardır (`cross-program invocation` (`cpi`)).

:::warning
Bu `bubblegumSigner` PDA, `collection_cpi` sabit kodlu bir tohum dizesi kullanılarak türetilir ve Bubblegum programı tarafından
sahiplenir. Bu sabit kodlu değerin doğru bir şekilde verilmemesi, sıkıştırılmış NFT basımınızın başarısız olmasına neden olacaktır.
:::

Aşağıda, bu PDA'yı gerektiği üzere `collection_cpi` sabit kodlu tohum dizesi ile türetiyoruz:

```ts
// sıkıştırılmış basımla ilgili imzalayıcı olarak çalışan (Bubblegum tarafından sahiplenilen) bir PDA'nın türetimi
const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
  // `collection_cpi` Bubblegum programı tarafından gereken özel bir ön ektir
  [Buffer.from("collection_cpi", "utf8")],
  BUBBLEGUM_PROGRAM_ID,
);
```

### Basım talimatını oluşturma

Artık sıkıştırılmış NFT'mizi oluşturmak için ihtiyacımız olan tüm bilgilere sahip olmalıyız.

Bubblegum SDK'sında sağlanan `createMintToCollectionV1Instruction` yardımcı işlevini kullanarak, sıkıştırılmış NFT'mizi doğrudan koleksiyonumuza basmak için talimat oluşturabiliriz.

Eğer geleneksel NFT'leri Solana üzerinde basmışsanız, bu oldukça benzer görünecektir. Yeni bir talimat oluşturuyoruz, bekleyebileceğiniz birkaç hesap adresini (örneğin `payer`, `tokenMetadataProgram` ve çeşitli koleksiyon adresleri) veriyor ve bu ardından ağaç için özel adresleri ekliyoruz.

Özellikle dikkat edilmesi gereken adresler şunlardır:

- `leafOwner` - bu, sıkıştırılmış NFT'nin sahibi olacaktır. İsterseniz bunu kendiniz mintleyebilir (yani `payer`), ya da başka bir Solana adresine airdrop yapabilirsiniz.
- `leafDelegate` - bu, mintlemekte olduğumuz bu spesifik NFT'nin devredilmiş yetkisi olacaktır. Mintlemek üzere olduğumuz NFT'nin üzerinde bir devredilmiş yetki istemiyorsanız, bu değer `leafOwner` adresi ile aynı değere ayarlanmalıdır.

```ts
const compressedMintIx = createMintToCollectionV1Instruction(
  {
    payer: payer.publicKey,

    merkleTree: treeAddress,
    treeAuthority,
    treeDelegate: payer.publicKey,

    // NFT'nin alıcısını ayarla
    leafOwner: receiverAddress || payer.publicKey,
    // bu NFT üzerinde devredilmiş bir yetki ayarla
    leafDelegate: payer.publicKey,

    // koleksiyon detayları
    collectionAuthority: payer.publicKey,
    collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
    collectionMint: collectionMint,
    collectionMetadata: collectionMetadata,
    editionAccount: collectionMasterEditionAccount,

    // diğer hesaplar
    bubblegumSigner: bubblegumSigner,
    compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    logWrapper: SPL_NOOP_PROGRAM_ID,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
  },
  {
    metadataArgs: Object.assign(compressedNFTMetadata, {
      collection: { key: collectionMint, verified: false },
    }),
  },
);
```

Diğer ağaç spesifik adreslerden bazıları şunlardır:

- `merkleTree` - oluşturduğumuz ağacın adresi
- `treeAuthority` - ağacın yetkisi
- `treeDelegate` - tüm ağacın devredilmiş yetkisi

Ayrıca NFT koleksiyonumuzun mint adresi, meta veri hesabı ve baskı hesabı dahil olmak üzere standart adresler de bulunmaktadır. Bunlar, sıkıştırılmamış NFT'leri basarken de geçerlidir.

#### İşlemi imzala ve gönder

Sıkıştırılmış basım talimatımız oluşturulduktan sonra, bunu bir işlemin içine ekleyebilir ve Solana ağına gönderebiliriz:

```ts
const tx = new Transaction().add(compressedMintIx);
tx.feePayer = payer.publicKey;

// işlemi kümeye gönder
const txSignature = await sendAndConfirmTransaction(connection, tx, [payer], {
  commitment: "confirmed",
  skipPreflight: true,
});
```

## Sıkıştırılmış NFT'lerin meta verilerini okuma

:::tip
Destekleyici bir RPC sağlayıcının yardımıyla geliştiriciler, NFT'lerin meta verilerini almak için Dijital Varlık
Standart Okuma API'sini (veya kısaca "Okuma API") kullanabilirler.
:::

> Okuma API'si, hem sıkıştırılmış NFT'leri hem de geleneksel/sıkıştırılmamış NFT'leri desteklemektedir.
> Her iki tür NFT için çeşitli bilgileri almak üzere tüm toplu ön uçları kullanabilirsiniz,
> NFT'lerin JSON URI'sini otomatik olarak alma dahil.

### Okuma API'sini Kullanma

Read API ile ve destekleyici bir RPC sağlayıcı ile çalışırken, geliştiriciler bu tür istekleri yapmak için
tercih ettikleri yöntemi kullanarak RPC uç noktasına `POST` istekleri yapabilirler (örneğin `curl`, JavaScript `fetch()`, vb.).

#### Varlık Kimliği Hakkında Not

Read API içinde, dijital varlıklar (yani NFT'ler) `id` ile indekslenir. Bu varlık `id` değeri, geleneksel NFT'ler ile sıkıştırılmış NFT'ler arasında biraz farklılık göstermektedir:

- geleneksel/sıkıştırılmamış NFT'ler için: bu, varlığın metadata'sını saklayan, zincir üzerinde gerçek Hesabın adresidir.
- sıkıştırılmış NFT'ler için: bu, ağacın içindeki sıkıştırılmış NFT'nin `id`sidir ve **gerçek** bir zincir üzerindeki Hesap adresi değildir. Sıkıştırılmış bir NFT'nin `assetId`'si, geleneksel bir Solana Hesap adresine benzese de, o değildir.

---

### Yaygın Read API Yöntemleri

:::info
Read API, aşağıda listelenenlerden daha fazlasını desteklese de, en yaygın olarak kullanılan yöntemler şunlardır:
:::

- `getAsset` - belirli bir NFT varlığını `id`'si ile al
- `getAssetProof` - sıkıştırılmış NFT'yi transfer etmek için gereken merkle kanıtını, varlık `id`'sine göre döndürür
- `getAssetsByOwner` - belirli bir adres tarafından sahip olunan varlıkları al
- `getAssetsByGroup` - belirli bir gruplama (yani, bir koleksiyon) ile varlıkları al

#### Read API Yöntemleri, Şema ve Spesifikasyon

Digital Asset Standard Read API tarafından eklenen tüm ek RPC yöntemlerini [Metaplex'in RPC Playground](https://metaplex-read-api.surge.sh/) adresinde keşfedin. Burada desteklenen her RPC yöntemi için beklenen girdi ve yanıt şemasını da bulabilirsiniz.

---

### Örnek Read API İsteği

Göstermek için, aşağıda `getAsset` yöntemi için bir örnek isteği bulunmaktadır ve bu örnek, modern JavaScript çalışma zamanlarında yerleşik olan [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) kullanılarak yapılmıştır:

```ts
// JavaScript `fetch` API kullanarak RPC'ye POST isteği gönder
const response = await fetch(rpcEndpointUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "rpd-op-123",
    method: "getAsset",
    params: {
      id: "5q7qQ4FWYyj4vnFrivRBe6beo6p88X8HTkkyVPjPkQmF",
    },
  }),
});
```

---

### Örnek Read API Yanıtı

RPC'den başarılı bir yanıt aldığınızda, aşağıdaki gibi bir veriyi görmelisiniz:

```ts
{
  interface: 'V1_NFT',
  id: '5q7qQ4FWYyj4vnFrivRBe6beo6p88X8HTkkyVPjPkQmF',
  content: [Object],
  authorities: [Array],
  compression: [Object],
  grouping: [],
  royalty: [Object],
  creators: [],
  ownership: [Object],
  supply: [Object],
  mutable: false
}
```

Özellikle dikkat etmeniz gereken yanıt alanları şunlardır:

- `id` - bu, varlığınızın `id`'sidir
- `grouping` - NFT'nin ait olduğu koleksiyon adresini söyleyebilir. Koleksiyon adresi `group_value` olacaktır.
- `metadata` - NFT'nin mint edildiği zaman otomatik olarak alınan JSON uri dahil olmak üzere NFT için gerçek metadata'yı içerir
- `ownership` - NFT'nin sahibi adresini verir (ve ayrıca NFT'nin başka bir adrese yetki devredip devretmediğini)
- `compression` - bu NFT'nin gerçekten sıkıştırma kullanıp kullanmadığını söyler. Sıkıştırılmış NFT'ler için, bu aynı zamanda sıkıştırılmış NFT'nin zincir üzerinde depolandığı ağaç adresini de verir.

> Bazı döndürülen değerler, NFT'nin **sıkıştırılmış** NFT olmaması durumunda boş olabilir, örneğin birçok `compression` alanı. Bu beklenmektedir.

---

## Sıkıştırılmış NFT'leri Aktarma

Sıkıştırılmış NFT'leri aktarmak, sıkıştırılmamış NFT'leri aktarmaktan farklıdır. Farklı bir zincir üzerindeki program kullanmanın yanı sıra, sıkıştırılmış NFT'ler bir varlığın "merkle kanıtı"nı (veya kısaca `proof` olarak adlandırılır) kullanmayı gerektirir.

### Merkle Kanıtı Nedir?

Bir varlığın "merkle kanıtı", belirli bir yaprak dalının doğrulanması için ağaç içindeki tüm "bitişik hash'lerin" bir listesidir.

Bu kanıt hash'leri ve belirli varlığın yaprak verileri, "kök hash" hesabını yapmak için deterministik bir şekilde birlikte hashlenir. Böylece, bir varlığın merkle ağacındaki kriptografik doğrulamasına olanak tanır.

> **NOT:** Bu hash değerlerinin her biri, solana hesabına ait `adres/public key` gibi görünse de, bunlar adres değildir.

Sıkıştırılmış NFT'lerin mülkiyetinin devri 5 ana adımda gerçekleşir:

1. NFT'nin "varlık" verisini al (indexer'dan)
2. NFT'nin kanıtını al (indexer'dan)
3. Merkle ağaç hesabını al (doğrudan Solana blockchain'inden)
4. varlık kanıtını hazırla
5. aktarım talimatını oluştur ve gönder

İlk üç adım esasen, transfer edilecek NFT için belirli bilgilerin (kanıt ve ağacın taç derinliği) toplanması ile ilgilidir. Bu bilgilerin, transfer talimatının kendisinde doğru şekilde ayrıştırılıp biçimlendirilmesi için gerekli olduğu sürece bu bilgilere ihtiyacımız vardır.

---

### Varlığı Al

Sıkıştırılmış NFT'mizi aktarmak için, NFT hakkında birkaç bilgi parçasını geri almamız gerekmektedir.

Başlangıç olarak, zincir üzerindeki sıkıştırma programının doğrulamayı ve güvenlik kontrollerini doğru bir şekilde gerçekleştirmesi için bazı varlık bilgilerini almamız gerekecek.

*:::note*
Sıkıştırılmış NFT için iki önemli bilgi parçasını almak için `getAsset` RPC yöntemini kullanabiliriz: `data_hash` ve `creator_hash`.
*:::

#### `getAsset` Yönteminden Örnek Yanıt

Aşağıda `getAsset` yönteminden örnek bir yanıt yer almaktadır:

```ts
compression: {
  eligible: false,
  compressed: true,
  data_hash: 'D57LAefACeaJesajt6VPAxY4QFXhHjPyZbjq9efrt3jP',
  creator_hash: '6Q7xtKPmmLihpHGVBA6u1ENE351YKoyqd3ssHACfmXbn',
  asset_hash: 'F3oDH1mJ47Z7tNBHvrpN5UFf4VAeQSwTtxZeJmn7q3Fh',
  tree: 'BBUkS4LZQ7mU8iZXYLVGNUjSxCYnB3x44UuPVHVXS9Fo',
  seq: 3,
  leaf_id: 0
}
```

### Varlık Kanıtını Al

Sıkıştırılmış NFT transfer talimatınızı hazırlamanızdaki bir sonraki adım, transferi gerçekleştirmek için geçerli bir varlık `proof` almaktır. Bu kanıt, zincir üzerindeki sıkıştırma programı tarafından zincir üzerindeki bilgileri doğrulamak için gereklidir.

İki önemli bilgi parçasını geri almak için `getAssetProof` RPC yöntemini kullanabiliriz:

- `proof` - transferi gerçekleştirmek için gereken "tam kanıt" (bununla ilgili daha fazla aşağıda)
- `tree_id` - sıkıştırılmış NFT'lerin ağacının zincir üzerindeki adresi

#### Tam Kanıt Döndürülür

`getAssetProof` RPC yöntemi, sıkıştırılmış NFT transferini gerçekleştirmek için kullanılan "kanıt hash'lerinin" tam listesini döndürür. Bu "tam kanıt" RPC'den geri döndüğü için, ağacın `taç` kısmında depolanan "tam kanıt" kısmını çıkarmamız gerekecek.

#### `getAssetProof` Yönteminden Örnek Yanıt

Aşağıda `getAssetProof` yönteminden örnek bir yanıt bulunmaktadır:

```ts
{
  root: '7dy5bzgaRcUnNH2KMExwNXXNaCJnf7wQqxc2VrGXy9qr',
  proof: [
    'HdvzZ4hrPEdEarJfEzAavNJEZcCS1YU1fg2uBvQGwAAb',
    ...
    '3e2oBSLfSDVdUdS7jRGFKa8nreJUA9sFPEELrHaQyd4J'
  ],
  node_index: 131072,
  leaf: 'F3oDH1mJ47Z7tNBHvrpN5UFf4VAeQSwTtxZeJmn7q3Fh',
  tree_id: 'BBUkS4LZQ7mU8iZXYLVGNUjSxCYnB3x44UuPVHVXS9Fo'
}
```

---

### Merkle Ağaç Hesabını Al

`getAssetProof` her zaman "tam kanıtı" döndürdüğünden, ağacın taç kısmında zincir üzerindeki saklanan kanıt hash'lerini çıkarmak için bunu azaltmamız gerekecek. Ancak doğru sayıda kanıt adreslerini çıkarmak için, ağacın `taç derinliğini` bilmemiz gerekir.

Sıkıştırılmış NFT'imizin ağaç adresini ( `getAssetProof` değerinden `tree_id` değeri) aldıktan sonra, `@solana/spl-account-compression` SDK'sından [`ConcurrentMerkleTreeAccount`](https://solana-labs.github.io/solana-program-library/account-compression/sdk/docs/classes/index.ConcurrentMerkleTreeAccount.html) sınıfını kullanabiliriz:

```ts
// zincir üzerinde merkle ağacının hesabını al
const treeAccount = await ConcurrentMerkleTreeAccount.fromAccountAddress(
  connection,
  treeAddress,
);

// transfer talimatımız için gereken değerleri çıkaralım
const treeAuthority = treeAccount.getAuthority();
const canopyDepth = treeAccount.getCanopyDepth();
```

Transfer talimatı için, `treeAccount` aracılığıyla alabileceğimiz mevcut `treeAuthority` adresine de ihtiyacımız olacak.

---

### Varlık Kanıtını Hazırla

"Tam kanıt" ve `canopyDepth` değerlerimiz elindeyken, `proof`'u transfer talimatında sunulmak üzere doğru bir şekilde formatlayabiliriz.

Gerçekten transfer talimatımızı oluşturmak için Bubblegum SDK'dan `createTransferInstruction` yardımcı fonksiyonunu kullanacağız:

- zaten ağacın `taç kısmında` depolanan kanıt değerlerini çıkaralım, ve
- kalan kanıt değerlerini, talimat oluşturucu fonksiyonunun kabul ettiği geçerli `AccountMeta` yapısına dönüştürelim

```ts
// kanıt adresleri listesini geçerli AccountMeta[]'ya ayrıştır
const proof: AccountMeta[] = assetProof.proof
  .slice(0, assetProof.proof.length - (!!canopyDepth ? canopyDepth : 0))
  .map((node: string) => ({
    pubkey: new PublicKey(node),
    isSigner: false,
    isWritable: false,
  }));
```

Yukarıdaki TypeScript kod örneğinde, "tam kanıtımız"ın ilk kısmını alarak, dizinin başından başlayarak `proof.length - canopyDepth` sayıda kanıt değeri ile sınırlıyoruz. Bu, ağacın taç kısmında zaten depolanan kanıt kısımlarını çıkartacaktır.

Ardından, kalan kanıt değerlerinin her birini geçerli bir `AccountMeta` olarak yapılandırıyoruz, çünkü kanıt zincir üzerinde transfer talimatında "ek hesaplar" şeklinde sunulmaktadır.

---

### Transfer Talimatını Oluştur

Son olarak, ağaç ve sıkıştırılmış NFT'lerimiz hakkında gerekli tüm veri parçalarını ve doğru formatlı kanıtı elde ettiğimizde, transfer talimatını gerçekten oluşturmaya hazınız.

Transfer talimatınızı Bubblegum SDK'dan [`createTransferInstruction`](https://metaplex-foundation.github.io/metaplex-program-library/docs/bubblegum/functions/createTransferInstruction.html) yardımcı fonksiyonunu kullanarak oluşturun:

```ts
// NFT transfer talimatını oluştur (Bubblegum paketi aracılığıyla)
const transferIx = createTransferInstruction(
  {
    merkleTree: treeAddress,
    treeAuthority,
    leafOwner,
    leafDelegate,
    newLeafOwner,
    logWrapper: SPL_NOOP_PROGRAM_ID,
    compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    anchorRemainingAccounts: proof,
  },
  {
    root: [...new PublicKey(assetProof.root.trim()).toBytes()],
    dataHash: [...new PublicKey(asset.compression.data_hash.trim()).toBytes()],
    creatorHash: [
      ...new PublicKey(asset.compression.creator_hash.trim()).toBytes(),
    ],
    nonce: asset.compression.leaf_id,
    index: asset.compression.leaf_id,
  },
  BUBBLEGUM_PROGRAM_ID,
);
```

Bütün bu farklı hesap adreslerini ve varlığın kanıtını geçirmenin yanı sıra, `data_hash`, `creator_hash`, `root` hash değerlerinin dize biçimlerini, `createTransferInstruction` yardımcı fonksiyonunun kabul ettiği bir byte dizisine dönüştürüyoruz.

Bu hash değerlerinin her biri, PublicKey'lere benzer ve benzer bir biçimde formatlanmış olduğundan, bunları [`PublicKey`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/PublicKey.html) sınıfını web3.js içinde kullanarak kabul edilen byte dizi formatına dönüştürebiliriz.

---

#### İşlemi Gönder

Transfer talimatlarımız oluşturulduğunda, bunu önceki gibi bir işleme ekleyebilir ve blokçein'e gönderebiliriz. Mevcut `leafOwner` veya `leafDelegate`'in işlemi imzaladığından emin olmalıyız.

> Her başarılı sıkıştırılmış NFT transferinden sonra, `leafDelegate` boş bir değer ile sıfırlanmalıdır. Bu, belirli varlığın sahibinden başka bir adrese yetki devretmeyeceği anlamına gelir.

Ve kümeyi onayladıktan sonra, başarılı bir şekilde bir sıkıştırılmış NFT transfer etmiş olacağız.

---

## Örnek Kod Havuzu

Bu geliştirici kılavuzu için örnek bir kod havuzunu Solana Geliştiricileri GitHub'ında bulabilirsiniz:
[https://github.com/solana-developers/compressed-nfts](https://github.com/solana-developers/compressed-nfts)