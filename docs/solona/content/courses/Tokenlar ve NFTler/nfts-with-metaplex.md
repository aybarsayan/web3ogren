---
title: Metaplex ile Solana NFT'leri Oluşturun
objectives:
  - NFT'leri ve Solana ağında nasıl temsil edildiklerini açıklamak
  - Metaplex Token Metadata programının rolünü açıklamak
  - Metaplex JS SDK kullanarak NFT'leri oluşturmak ve güncellemek
description:
  "Metaplex Metadata programı ve Irys kalıcı depolama servisi ile TypeScript kullanarak NFT'leri nasıl oluşturacağınızı öğrenin."
---

### Özet

- **Değiştirilemez Tokenlar (NFT'ler)**, 0 ondalık ve maksimum 1 arz ile ilişkili bir metadata hesabına sahip SPL Token'lardır.
- **Metadata**, token mıntılarına (hem NFT'ler hem de normal tokenlar) ek özellikler ekler. NFT'ler için metadata, token adı ve bir dış JSON dosyasına bağlantı içerir. Bu JSON dosyası, sanat eserlerine ve diğer medya dosyalarına bağlantılar, NFT'nin sahip olduğu özel özellikler ve daha fazlasını içerir.
- **Metaplex Token Metadata** programı, bir token mıntısına metadata ekleyen zincir üzeri bir programdır. Token Metadata programı ile etkileşimde bulunabiliriz
  [Token Metadata paketi](https://developers.metaplex.com/token-metadata) aracılığıyla Umi kullanarak, Metaplex tarafından zincir üzeri programlarla çalışmak için oluşturulmuş bir araçtır.

---

### Ders

Solana Değiştirilemez Tokenlar (NFT'ler), Token programı kullanılarak oluşturulan SPL tokenlardır. Ancak bu tokenların her biri ile ilişkili ek bir metadata hesabı vardır.

:::tip
Bu derste, NFT'lerin Solana'da nasıl temsil edildiğine, `mpl-token-metadata` npm modülünü kullanarak bunları nasıl oluşturup güncelleyeceğimize dair temelleri ele alacağız.
:::

#### Solana'da NFT'ler

Bir NFT, aşağıdaki özelliklere sahip Token Programından standart bir token'dır:

1. 0 ondalık sayıya sahiptir, bu nedenle parçalara ayrılamaz.
2. 1 arz ile bir token mint'ten gelmektedir, bu nedenle bu token'dan yalnızca 1 adet vardır.
3. Arzı asla değişmeyecek şekilde ayarlanan `null` otoritesine sahip bir token mint'ten gelir.
4. **metadata** - bir isim, sembol, resimler vb. gibi bilgileri depolayan ilişkili bir hesaba sahiptir.

İlk üç nokta SPL Token Programı ile elde edilebilirken, ilişkili metadata ek bir programa ihtiyaç duyar. Bu **Metadata programı**dır.

#### Metaplex Token Metadata programı

Solana NFT'leri oluşturmanın en popüler yolu, 
[Metaplex Token Metadata](https://developers.metaplex.com/token-metadata) programını kullanmaktır.

![Metadata](../../../images/solana/public/assets/courses/unboxed/solana-nft-metaplex-metadata.png)

- Bir NFT oluşturulduğunda, Token Metadata programı bir Program Türetilmiş Adres (PDA) kullanarak **zincir üstü metadata** hesabı oluşturur ve token mint'i bir tohum olarak kullanır. Bu, herhangi bir NFT'nin metadata hesabının token mint'in adresi kullanılarak belirlenmesini sağlar. Zincir üstü metadata, içeriği dışarıdan `.json` dosyasına yönlendiren bir URI alanını içerir.

- Dışarıdaki **offchain metadata**, JSON dosyasında NFT'nin medya bağlantılarını (resimler, videolar, 3D dosyalar), sahip olabileceği özellikleri ve ek metadata'yı depolar (bkz.
  [bu örnek JSON dosyası](https://lsc6xffbdvalb5dvymf5gwjpeou7rr2btkoltutn5ij5irlpg3wa.arweave.net/XIXrlKEdQLD0dcML01kvI6n4x0GanLnSbeoT1EVvNuw)).
  Arweave gibi kalıcı veri depolama sistemleri, NFT metadata'sının offchain bileşenini depolamak için sıkça kullanılmaktadır.

Sonraki bölümlerde, Umi ile `metaplex-foundation/token-metadata` eklentisini kullanarak varlıkları hazırlamayı, NFT'leri oluşturmayı, NFT'leri güncellemeyi ve bir NFT'yi daha geniş bir koleksiyonla ilişkilendirmeyi ele alacağız. `metaplex-foundation/token-metadata` hakkında daha fazla bilgi için
[Token Metadata geliştirici belgeleri](https://developers.metaplex.com/token-metadata) sayfasını ziyaret edin.


[Metaplex Core](https://developers.metaplex.com/core), varlık detaylarının (sahip, isim, uri vb.) tek bir hesapta depolandığı Metaplex'ten bir NFT standardıdır. Ancak, en yaygın NFT tarzı, Metaplex Metadata programı aracılığıyla eklenmiş bazı Metadata ile birlikte bir Solana SPL tokenı oluşturarak yapılmaktadır, bu nedenle bu eğitimde bunu kullanacağız. 

#### UMI örneği

Umi, Metaplex tarafından oluşturulmuş zincir üstü programlar için JS/TS istemcileri oluşturmak için bir çerçevedir. Umi, birçok program için JS/TS istemcileri oluşturabilir, ancak pratikte, genellikle Token Metadata programı ile iletişim kurmak için kullanılır.

:::info
Umi'nin birçok kavram için web3.js'den farklı uygulamaları olduğunu unutmayın; bunlar arasında Anahtar çiftleri, Kamu Anahtarları ve Bağlantılar bulunmaktadır. Ancak, bu öğelerin web3.js versiyonlarını Umi eşdeğerlerine dönüştürmek kolaydır.
:::

#### Umi'yi yükleme ve ayarlama

Öncelikle yeni bir Umi örneği oluşturuyoruz. Bunu ya kendi RPC uç noktamızı sağlayarak yapabiliriz ya da `clusterApiUrl` metodu ile sağlanan genel Solana uç noktalarını kullanabiliriz.

```typescript
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));
```

Son olarak, Umi örneğimizin kimliğini (bu, işlemleri imzalamak için kullanılacak anahtar çiftidir) ve kullanacağımız eklentileri geçiriyoruz; bu durumda bu `metaplex-foundation/mpl-token-metadata`'dir.

```typescript
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@solana-developers/helpers";
import { promises as fs } from "fs"; 
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

// yerel dosya sisteminden anahtar çiftini yükle
// https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file sayfasına bakın
const localKeypair = await getKeypairFromFile();

// Umi ile uyumlu anahtar çiftine dönüştür
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// Umi örneğimize anahtar çiftini atayın ve MPL metadata program eklentisini yükleyin
umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata());
```

#### Varlıkları Yükleme

Bir NFT oluşturmadan önce, NFT ile ilişkilendirmeyi düşündüğünüz herhangi bir varlığı hazırlayıp yüklemelisiniz. Bu bir resim olmak zorunda değil, ancak çoğu NFT'nin ilişkili bir resmi vardır.

:::note
Bir resmi hazırlamak ve yüklemek, resmi bir tampon haline getirmeyi, dosyayı `createGenericFile()` fonksiyonu kullanarak bir [genel dosya](https://developers.metaplex.com/umi/storage#generic-files) haline dönüştürmeyi ve nihayetinde belirlenen Depolama Sürücüsüne yüklemeyi içerir.
:::

`GenericFile` türü, Umi'nin tarayıcı dosyaları ve yerel dosya sistemi dosyaları arasında farklılık olmasına rağmen farklı dosya varyasyonlarını desteklemesini sağlar.

Gerçekleştirildiğinde, bilgisayarınızdaki `random-image.png` adlı bir resmi yüklemek aşağıdaki adımları alacaktır:

1. `readFile` kullanarak dosyayı bir tampona okuma.

2. Tamamlayıcı dosyanın MIME Tipi ve dosya yolu ile genel dosya türü yaratma.

3. Dosyayı belirli depolama sağlayıcısına yükleme.

```typescript
let filePath = "random-image.png";

const buffer = await fs.readFile(filePath);
let file = createGenericFile(buffer, filePath, {
  // doğru dosya MIME türünü seçin https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  contentType: "image/jpeg",
});
const [image] = await umi.uploader.upload([file]);
```

Fonksiyonun döndürdüğü değer, resmin depolandığı URI olacaktır.

#### Metadata'yı Yükleme

Bir resmi yükledikten sonra, `uploadJson()` yöntemini kullanarak offchain JSON metadata'sını yükleme zamanı geldi. Bu, JSON metadata'sının depolandığı bir URI döndürecektir.

Unutmayın ki, metadata'nın offchain kısmı, resim URI'sı ile birlikte NFT'nin adı ve açıklaması gibi ek bilgileri içerir. Bu JSON nesnesinde teknik olarak istediğiniz her şeyi ekleyebilirsiniz, ancak çoğu durumda, cüzdanlar, programlar ve uygulamalarla uyumluluğu sağlamak için [NFT standardını](https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard) izlemeniz önerilir.

:::warning
Metadata'yı oluşturmak için SDK tarafından sağlanan `uploadJson()` yöntemini kullanın. Bu yöntem, bir metadata nesnesi alır ve yüklenen metadata'ya işaret eden bir URI döndürür.
:::

```typescript
const uri = await umi.uploader.uploadJson({
  name,
  description,
  image,
});
```

#### NFT'yi Oluşturma

NFT'nin metadata'sını yükledikten sonra, nihayet NFT'yi ağda oluşturabilirsiniz. Önceden eklediğimiz `mplTokenMetadata` eklentisi, minimal yapılandırma ile bir NFT veya başka bir token oluşturmak için gerekli yardımcıları sağlar. `createNft` yardımcı yöntemi, mint hesabını, token hesabını, metadata hesabını ve sizin için ana versiyon hesabını oluşturur. 

**Bu metoda sağlanan veriler, NFT metadata'sının zincir üstü kısmını temsil eder.** Bu metoda sağlanan diğer isteğe bağlı girdilere göz atabilirsiniz.

```typescript
const { signature, result } = await createNft(umi, {
  mint,
  name: "My NFT",
  uri,
  updateAuthority: umi.identity.publicKey,
  sellerFeeBasisPoints: percentAmount(0),
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });
```

`sendAndConfirm` yöntemi, işlemi imzalamak ve göndermekle ilgilenir. Ayrıca, pre-flight kontrolleri ve işlemin istenen taahhüdünü ayarlamak için diğer seçenekler de sunar, bu taahhüt belirtilmediği takdirde varsayılan olarak `confirmed` olur.

Bu yöntem, işlem imzasını ve bir sonucu içeren bir nesne döndürür. Sonuç nesnesi, işlemimizin sonucunu içerir. Başarılı olursa, içindeki `err` null olarak ayarlanır; aksi takdirde, hata alakanızda başarısız olan işlem için hata bilgilerini içerir.

Varsayılan olarak, SDK `isMutable` özelliğini true olarak ayarlar; bu, NFT'nin metadata'sında güncellemeler yapılmasına izin verir. Ancak, `isMutable` değerini false olarak ayarlamayı tercih edebilirsiniz; bu, NFT'nin metadata'sını değiştirilemez hale getirir.

#### NFT'yi Güncelleme

Eğer `isMutable` değerini true bıraktıysanız, NFT'nizin metadata'sını güncelleyebilirsiniz.

SDK'nın `updateV1` yöntemi, NFT'nin hem zincir üstü hem de offchain kısımlarını güncellemeye olanak tanır. Offchain metadata'yı güncellemek için, yeni bir resim ve metadata URI yükleme adımlarını tekrarlamanız gerekecek (önceki adımlarda açıklandığı gibi), ardından bu metoda yeni metadata URI'sini sağlamanız gereklidir. Bu, zincir üstü metadata'nın işaret ettiği URI'yi değiştirir ve böylece offchain metadata'yı da günceller.

```typescript
const nft = await fetchMetadataFromSeeds(umi, { mintAddress });

await updateV1(umi, {
  mint,
  authority: umi.identity,
  data: {
    ...nft,
    sellerFeeBasisPoints: 0,
    name: "Updated Name",
  },
  primarySaleHappened: true,
  isMutable: true,
}).sendAndConfirm(umi);
```

:::tip
`updateV1` çağrısına dahil etmediğiniz alanların, tasarım gereği aynı kalacağını unutmayın.
:::

#### NFT'yi Bir Koleksiyona Ekleme

Bir [Sertifikalı Koleksiyon](https://developers.metaplex.com/token-metadata/collections), bireysel NFT'lerin ait olabileceği bir NFT'dir. Solana Monkey Business gibi büyük bir NFT koleksiyonunu düşünün. Bir bireysel NFT'nin
[Metadata'sını](https://explorer.solana.com/address/C18YQWbfwjpCMeCm2MPGTgfcxGeEDPvNaGpVjwYv33q1/metadata) incelediğinizde, `key` alanına sahip `collection` alanını göreceksiniz; bu, belirli bir
[Sertifikalı Koleksiyon](https://explorer.solana.com/address/SMBH3wF6baUj6JWtzYvqcKuj2XCKWDqQxzspY12xPND/) NFT'sine işaret eder. Kısaca, koleksiyona ait olan NFT'ler, toplam koleksiyonu temsil eden başka bir NFT ile ilişkilendirilmiştir.

:::info
Sertifikalı koleksiyonlar önemlidir çünkü bu, koleksiyon sahibinin her NFT'nin gerçekten koleksiyona ait olduğunu doğruladığını gösterir!
:::

Bir NFT'yi koleksiyona eklemek için, önce Koleksiyon NFT'sinin oluşturulması gerekir. Süreç önceki ile aynıdır, ancak NFT Metadata'mıza bir ek alan ekleyeceğiz: `isCollection`. Bu alan, token programına bu NFT'nin bir Koleksiyon NFT'si olduğunu bildirir.

```typescript
const collectionMint = generateSigner(umi);

await createNft(umi, {
  mint: collectionMint,
  name: `My Collection`,
  uri,
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true,
}).sendAndConfirm(umi);
```

Bu koleksiyona bir NFT basmak için, yukarıda oluşturulan `collectionMint` adresinin ve doğrulanmış alanının iki alanı olan [Koleksiyon türünü](https://mpl-token-metadata-js-docs.vercel.app/types/Collection.html) kullanmalısınız.

```typescript
const { signature, result } = await createNft(umi, {
  mint,
  name: "My NFT",
  uri,
  updateAuthority: umi.identity.publicKey,
  sellerFeeBasisPoints: percentAmount(0),
  collection: { key: collectionMint.publicKey, verified: false },
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });
```

Yeni oluşturduğunuz NFT'nin metadata'sını kontrol ettiğinizde artık bir `collection` alanını şöyle görmelisiniz:

```JSON
"collection":{
  "verified": false,
  "key": "SMBH3wF6baUj6JWtzYvqcKuj2XCKWDqQxzspY12xPND"
}
```

Son olarak, NFT'yi doğrulamanız gerekir. Bu, yukarıdaki `verified` alanını true olarak değiştirmekten ibarettir, ancak son derece önemlidir. Bu, kullandığınız programların ve uygulamaların, cüzdanlar ve sanat pazarları dahil, NFT'nizin gerçekten koleksiyonun bir parçası olduğunu bilmesine olanak tanır. 

Bunu `verifyCollectionV1` fonksiyonu ile yapabilirsiniz:

```typescript
const metadata = findMetadataPda(umi, { mint: mint.publicKey });

await verifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: umi.identity,
}).sendAndConfirm(umi);
```

---

### Laboratuvar

Bu laboratuvarda, Metaplex Umi çerçevesini kullanarak bir NFT oluşturma adımlarını, NFT'nin metadata'sını güncelleme adımlarını ve ardından NFT'yi bir koleksiyonla ilişkilendirme adımlarını geçeceğiz. Eğitimin sonunda, Metaplex Umi kullanımı ve NFT'lerle etkileşimde bulunma konusunda temel bir anlayışa sahip olacaksınız.

#### 1. Bölüm: Bir NFT koleksiyonu oluşturma

Başlamak için yeni bir klasör oluşturun ve ilgili bağımlılıkları yükleyin:

```bash
npm i @solana/web3.js@1 @solana-developers/helpers@2 @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/umi-uploader-irys esrun
```

Sonra `create-metaplex-nft-collection.ts` adlı bir dosya oluşturun ve içeriye şu ithalatları ekleyin:

```typescript
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { promises as fs } from "fs";
import * as path from "path";
```

Devnet’e bağlanın, bir kullanıcı yükleyin ve gerekiyorsa biraz SOL havale edin:

```typescript
// Solana'nın devnet kümesine yeni bir bağlantı oluştur
const connection = new Connection(clusterApiUrl("devnet"));

// yerel dosya sisteminden anahtar çiftini yükle
// `solana-keygen new` kullanarak anahtar çifti oluşturulduğunu varsayıyoruz
const user = await getKeypairFromFile();

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL,
);

console.log("Yüklenen kullanıcı:", user.publicKey.toBase58());
```

Yeni bir Umi örneği oluşturun, yüklenen anahtar çiftini atayın, metadata programı ile etkileşim için `mplTokenMetadata`'yı yükleyin ve dosyalarımızı yüklemek için `irysUploader`'ı yükleyin.

```typescript
const umi = createUmi(connection);

// yerel dosya sisteminden anahtar çiftini yükle
// https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file sayfasına bakın
const user = await getKeypairFromFile();

// Umi ile uyumlu anahtar çiftine dönüştür
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

// Umi örneğimize anahtar çiftini atayın, MPL metadata program eklentisini ve Irys yükleyici eklentisini yükleyin.
umi
  .use(keypairIdentity(umiKeypair))
  .use(mplTokenMetadata())
  .use(irysUploader());
```

:::danger
Koleksiyon resmi ile ilgili varlık resimlerini, aşağıdaki bağlantılardan indirin ve çalışma dizininizde saklayın.
:::

1.koleksiyon resmi:
https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/collection.png

2.NFT resmi:
https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/nft.png

Bu resimleri koleksiyonumuz ve NFT’miz için kapak resimleri olarak kullanacağız. 

Irys’i depolama sağlayıcımız olarak kullanacağız ve Metaplex, dosyalarımızı yüklemek için kullanabileceğimiz `umi-uploader-irys` eklentisini rahat bir şekilde sağlar. Eklenti ayrıca depolama ücretleriyle de ilgilendiği için bu konuda endişelenmemize gerek kalmaz.

Offchain metadata'yı Irys'e yükleyin:

```typescript
const collectionImagePath = path.resolve(__dirname, "collection.png");

const buffer = await fs.readFile(collectionImagePath);
let file = createGenericFile(buffer, collectionImagePath, {
  contentType: "image/png",
});
const [image] = await umi.uploader.upload([file]);
console.log("resim uri:", image);

// offchain json'u Irys'e yükle
const uri = await umi.uploader.uploadJson({
  name: "My Collection",
  symbol: "MC",
  description: "Koleksiyonumun açıklaması",
  image,
});
console.log("Koleksiyon offchain metadata URI:", uri);
```

Sonra koleksiyonu oluşturun:

```typescript
// mıntı anahtar çiftini oluştur
const collectionMint = generateSigner(umi);

// NFT'yi oluştur ve bas
await createNft(umi, {
  mint: collectionMint,
  name: "Koleksiyonum",
  uri,
  updateAuthority: umi.identity.publicKey,
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true,
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });

let explorerLink = getExplorerLink(
  "address",
  collectionMint.publicKey,
  "devnet",
);
console.log(`Koleksiyon NFT'si:  ${explorerLink}`);
console.log(`Koleksiyon NFT adresi:`, collectionMint.publicKey);
console.log("✅ Başarıyla tamamlandı!");
```

Kodları yürütmek için [esrun](https://www.npmjs.com/package/esrun) kullanmanızı öneririz çünkü bu, kodunuzu asenkron fonksiyon içerisine sarmadan, en üst düzey await kullanmanıza olanak tanır.

`create-metaplex-nft-collection.ts` scriptini çalıştırın.

```
npx esrun create-metaplex-nft-collection.ts
```

Çıktınız şöyle görünmelidir:

```
% npx esrun create-metaplex-nft-collection.ts

Yüklenen kullanıcı: 4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF
resim uri: https://arweave.net/XWpt7HDOFC0wJQcQWgP9n_cxHS0qQik9-27CAAaGP6E
Koleksiyon offchain metadata URI: https://arweave.net/atIf58t3FHa3heoOtNqPkVvEGC_9WzAduY0GQE-LnFI
Koleksiyon NFT'si:  https://explorer.solana.com/address/D2zi1QQmtZR5fk7wpA1Fmf6hTY2xy8xVMyNgfq6LsKy1?cluster=devnet
Koleksiyon NFT adresi: D2zi1QQmtZR5fk7wpA1Fmf6hTY2xy8xVMyNgfq6LsKy1
✅ Başarıyla tamamlandı!
```

Tebrikler! Metaplex Koleksiyonu oluşturdunuz. Yukarıdaki URL'yi kullanarak Solana Explorer'da kontrol edin. Bu, aşağıdaki gibi görünmelidir:

![Oluşturulan koleksiyona dair detaylarla Solana Explorer](../../../images/solana/public/assets/courses/unboxed/solana-explorer-metaplex-collection.png)

Herhangi bir sorun ile karşılaşırsanız, kendiniz düzeltmeyi deneyin; ancak gerektiğinde [çözüm koduna](https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/create-collection.ts) de bakabilirsiniz.

Bir sonraki adımda koleksiyon NFT adresini kullanacağız.

#### 2. Koleksiyon İçinde Bir Metaplex NFT Oluşturma

Şimdi, az önce oluşturduğumuz koleksiyonun bir üyesi olan bir Metaplex NFT'si yapacağız. `create-metaplex-nft.ts` adlı yeni bir dosya oluşturun. Bunun ayarları, önceki dosya ile aynı görünecek, biraz farklı importlar ile:

```typescript
import {
  createNft,
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";

import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";import { promises as fs } from "fs";
import * as path from "path";
// Solana'nın devnet kümesine yeni bir bağlantı oluştur
const connection = new Connection(clusterApiUrl("devnet"));

// Yerel dosya sisteminden anahtar çiftini yükle
// anahtar çiftinin `solana-keygen new` kullanılarak zaten oluşturulduğu varsayılmaktadır
const user = await getKeypairFromFile();
console.log("Yüklenen kullanıcı:", user.publicKey.toBase58());

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL,
);

const umi = createUmi(connection);

// umi uyumlu anahtar çiftine dönüştür
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

// eklentileri ve imzacıları yükle
umi
  .use(keypairIdentity(umiKeypair))
  .use(mplTokenMetadata())
  .use(irysUploader());
```

:::info
**Metaplex'e koleksiyonumuzu ve oluşturmak istediğimiz NFT'yi tanıtma zamanı!**
:::

```typescript
// create-metaplex-nft-collection.ts dosyasından koleksiyon NFT adresinizi yerleştirin
const collectionNftAddress = UMIPublicKey("YOUR_COLLECTION_NFT_ADDRESS_HERE");

// NFT'miz için örnek veri ve meta veriler
const nftData = {
  name: "Benim NFT'm",
  symbol: "MN",
  description: "Benim NFT Açıklamam",
  sellerFeeBasisPoints: 0,
  imageFile: "nft.png",
};
```

Sonrasında dosyaları Irys'e çıkarabiliriz:

```typescript
const NFTImagePath = path.resolve(__dirname, "nft.png");

const buffer = await fs.readFile(NFTImagePath);
let file = createGenericFile(buffer, NFTImagePath, {
  contentType: "image/png",
});

// resmi yükle ve resim uri'sini al
const [image] = await umi.uploader.upload([file]);
console.log("resim uri:", image);

// offchain json'u irys kullanarak yükle ve meta veri uri'sini al
const uri = await umi.uploader.uploadJson({
  name: "Benim NFT'm",
  symbol: "MN",
  description: "Benim NFT Açıklamam",
  image,
});
console.log("NFT offchain meta veri URI'si:", uri);
```

Sonrasında, meta veriden elde edilen URI'yi kullanarak bir NFT oluşturalım:

```typescript
// mint anahtar çiftini oluştur
const mint = generateSigner(umi);

// NFT'yi oluştur ve mint et
await createNft(umi, {
  mint,
  name: "Benim NFT'm",
  symbol: "MN",
  uri,
  updateAuthority: umi.identity.publicKey,
  sellerFeeBasisPoints: percentAmount(0),
  collection: {
    key: collectionNftAddress,
    verified: false,
  },
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });

let explorerLink = getExplorerLink("address", mint.publicKey, "devnet");
console.log(`Token Mint:  ${explorerLink}`);
```

:::tip
`npx esrun create-metaplex-nft.ts` komutunu çalıştırın. Her şey yolunda giderse, aşağıdakileri göreceksiniz:
:::

```
% npx esrun create-metaplex-nft.ts

Yüklenen kullanıcı: 4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF
resim uri: https://arweave.net/XgTss3uKlddlMFjRTIvDiDLBv6Pptm-Vx9mz6Oe5f-o
NFT offchain meta veri URI'si: https://arweave.net/PK3Url31k4BYNvYOgTuYgWuCLrNjl5BrrF5lbY9miR8
Token Mint:  https://explorer.solana.com/address/CymscdAwuTRjCz1ezsNZa15MnwGNrxhGUEToLFcyijMT?cluster=devnet
Oluşturulan NFT adresi CymscdAwuTRjCz1ezsNZa15MnwGNrxhGUEToLFcyijMT
✅ Başarıyla tamamlandı!
```

Verilen adreste NFT'nizi inceleyin! Herhangi bir sorun varsa, kendiniz çözmeye çalışın, ancak gerekirse [çözüm kodunu](https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/create-nft.ts) kontrol edebilirsiniz.

Keşke, keşfiniz sayfanızda bu resme benzer bir şey olmalı:
![Solana Explorer with details about created NFT](../../../images/solana/public/assets/courses/unboxed/solana-explorer-metaplex-nft.png)

Son olarak, mint'imizin koleksiyonumuzun bir parçası olduğunu doğrulayalım. Bu, onchain meta veride `verified` alanının `true` olarak ayarlanmasını sağlar, böylece tüketim programları ve uygulamaları NFT'nin gerçekten koleksiyona ait olduğunu kesin olarak bilebilir.

Yeni bir dosya oluşturun `verify-metaplex-nft.ts`, gerekli kütüphaneleri içe aktarın ve yeni bir umi örneği oluşturun.

```typescript
import {
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Solana'nın devnet kümesine yeni bir bağlantı oluştur
const connection = new Connection(clusterApiUrl("devnet"));

// Yerel dosya sisteminden anahtar çiftini yükle
// anahtar çiftinin `solana-keygen new` kullanılarak zaten oluşturulduğu varsayılmaktadır
const user = await getKeypairFromFile();
console.log("Yüklenen kullanıcı:", user.publicKey.toBase58());

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL,
);

const umi = createUmi(connection);

// create-metaplex-nft-collection.ts dosyasından koleksiyon NFT adresinizi yerleştirin
const collectionAddress = UMIPublicKey("");

// create-metaplex-nft.ts dosyasından NFT adresinizi yerleştirin
const nftAddress = UMIPublicKey("");
```

:::warning
Bir NFT'yi doğrulamak, koleksiyon aşamasında oluşturduğunuz `collectionAddress`'a sahip olmanızı gerektirir ve `verifyCollectionV1` yöntemini kullanacağız.
:::

```typescript
// Koleksiyonumuzu Sertifikalı Koleksiyon olarak doğrula
// https://developers.metaplex.com/token-metadata/collections adresine bakın
const metadata = findMetadataPda(umi, { mint: nftAddress });
await verifyCollectionV1(umi, {
  metadata,
  collectionMint: collectionAddress,
  authority: umi.identity,
}).sendAndConfirm(umi);

let explorerLink = getExplorerLink("address", nftAddress, "devnet");
console.log(`doğrulanan koleksiyon:  ${explorerLink}`);
console.log("✅ Başarıyla tamamlandı!");
```

:::tip
`npx esrun verify-metaplex-nft.ts` komutunu çalıştırın. Her şey yolunda giderse, aşağıdakileri göreceksiniz:
:::

```
% npx esrun create-metaplex-nft.ts

Yüklenen kullanıcı: 4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF
doğrulanan koleksiyon: https://explorer.solana.com/address/CymscdAwuTRjCz1ezsNZa15MnwGNrxhGUEToLFcyijMT?cluster=devnet
✅ Başarıyla tamamlandı!
```

Verilen adreste doğrulanmış NFT'nizi inceleyin! Herhangi bir sorun varsa, kendiniz çözmeye çalışın, ancak gerekirse [çözüm kodunu](https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/verify-nft.ts) de kontrol edebilirsiniz.

NFT'nizdeki doğrulama işareti artık `1` -> `true` olarak ayarlanmış olmalıdır ve bunun doğruluğunu kontrol etmek için Solana Explorer'daki meta veri sekmesinde koleksiyona ait olduğundan emin olun.

![Solana Explorer with details about created NFT](../../../images/solana/public/assets/courses/unboxed/solana-explorer-verified-nft.png)

NFT adresini hatırlayın, bir sonraki adımda bunu kullanacağız.

#### 3. NFT'yi Güncelleme

Yeni bir dosya oluşturun, adını `update-metaplex-nft.ts` koyun. İçe aktarmalar, önceki dosyalarımızla benzer olacaktır:

```typescript
import {
  createNft,
  fetchMetadataFromSeeds,
  updateV1,
  findMetadataPda,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { promises as fs } from "fs";
import * as path from "path";

// Solana'nın devnet kümesine yeni bir bağlantı oluştur
const connection = new Connection(clusterApiUrl("devnet"));

// Yerel dosya sisteminden anahtar çiftini yükle
// anahtar çiftinin `solana-keygen new` kullanılarak zaten oluşturulduğu varsayılmaktadır
const user = await getKeypairFromFile();
console.log("Yüklenen kullanıcı:", user.publicKey.toBase58());

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL,
);

const umi = createUmi(connection);

// umi uyumlu anahtar çiftine dönüştür
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

// eklentileri ve imzacıları yükle
umi
  .use(keypairIdentity(umiKeypair))
  .use(mplTokenMetadata())
  .use(irysUploader());
```

:::note
NFT'mizi yükleyelim, önceki örnekten alacağımız adresi belirterek ve güncellemek istediğimiz şeyleri ayarlayalım:
:::

```typescript
// Mint adresini kullanarak NFT'yi yükle
const mint = UMIPublicKey("YOUR_NFT_ADDRESS_HERE");
const asset = await fetchDigitalAsset(umi, mint);

// mevcut bir NFT'yi güncellemek için örnek veri
const updatedNftData = {
  name: "Güncellenmiş Varlık",
  symbol: "GÜNCELLENDİ",
  description: "Güncellenmiş Açıklama",
  sellerFeeBasisPoints: 0,
  imageFile: "nft.png",
};
```

Sonrasında Metaplex'i kullanarak NFT'mizi güncelleyebiliriz:

```typescript
const NFTImagePath = path.resolve(__dirname, "nft.png");

const buffer = await fs.readFile(NFTImagePath);
let file = createGenericFile(buffer, NFTImagePath, {
  contentType: "image/png",
});

// yeni resmi yükle ve resim uri'sini al
const [image] = await umi.uploader.upload([file]);
console.log("resim uri:", image);

// güncellenmiş offchain json'u irys kullanarak yükle ve meta veri uri'sini al
const uri = await umi.uploader.uploadJson({
  name: "Güncellenmiş",
  symbol: "GÜNCELLENDİ",
  description: "Güncellenmiş Açıklama",
  image,
});
console.log("NFT offchain meta veri URI'si:", uri);

// Mint adresini kullanarak NFT'yi yükle
const mint = UMIPublicKey("Zxd9TmtBHQNti6tJxtx1AKYJFykNUwJL4rth441CjRd");
const nft = await fetchMetadataFromSeeds(umi, { mint });

await updateV1(umi, {
  mint,
  authority: umi.identity,
  data: {
    ...nft,
    sellerFeeBasisPoints: 0,
    name: "Güncellenmiş Varlık",
  },
  primarySaleHappened: true,
  isMutable: true,
}).sendAndConfirm(umi);

let explorerLink = getExplorerLink("address", mint, "devnet");
console.log(`Yeni meta veri URI'si ile güncellenmiş NFT: ${explorerLink}`);

console.log("✅ Başarıyla tamamlandı!");
```

:::tip
`npx esrun update-metaplex-nft.ts` komutunu çalıştırın. Şunu görmelisiniz:
:::

```bash
% npx esrun update-metaplex-nft.ts

Yüklenen kullanıcı: 4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF
resim uri: https://arweave.net/dboiAebucLGhprtknDQnp-yMj348cpJF4aQul406odg
NFT offchain meta veri URI'si: https://arweave.net/XEjo-44GHRFNOEtPUdDsQlW5z1Gtpk2Wv0HvR8ll1Bw
Yeni meta veri URI'si ile güncellenmiş NFT: https://explorer.solana.com/address/Zxd9TmtBHQNti6tJxtx1AKYJFykNUwJL4rth441CjRd?cluster=devnet
✅ Başarıyla tamamlandı!
```

Güncellenmiş NFT'yi Solana Explorer'da inceleyin! Daha önce olduğu gibi, herhangi bir sorun yaşarsanız kendiniz çözmeye çalışmalısınız, ancak gerekirse [çözüm kodu](https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/update-nft.ts) mevcuttur.

![Solana Explorer with details about the updated NFT](../../../images/solana/public/assets/courses/unboxed/solana-explorer-with-updated-NFT.png)

Tebrikler! Metaplex SDK'sını kullanarak koleksiyonun bir parçası olarak NFT'leri oluşturmayı, güncellemeyi ve doğrulamayı başardınız. Kendi ihtiyaçlarınıza göre bir koleksiyon oluşturmak için bilmeniz gereken her şeye sahipsiniz. Yeni bir etkinlik biletleme platformu oluşturabilir, perakende işletme üyelik programını yenileyebilir veya okulunuzun öğrenci kimlik sistemini dijitalleştirebilirsiniz. Olasılıklar sonsuz!

### Challenge

Yukarıda ele alınan NFT oluşturma adımları, bir seferde binlerce NFT'yi oluşturmak için inanılmaz derecede sıkıcı olacaktır. Metaplex, Magic Eden ve Tensor gibi birçok sağlayıcının, büyük miktarda NFT mint etmeyi ve bunların yaratıcıları tarafından belirlenen parametreler içinde satılmasını sağlamaya yönelik "adil lansman" araçları bulunmaktadır. Adil lansman platformları hakkında [Dijital Koleksiyonlar](https://solana.com/ecosystem/explore?categories=digital%20collectibles) sayfasında daha fazla bilgi edinin. Bu pratik deneyim, araçların kullanımını anlama yetkinizi artırmanın yanı sıra, gelecekte bunları etkili bir şekilde kullanma konusunda kendinize güveninizi güçlendirecektir.


Kodunuzu GitHub'a yükleyin ve
[bize bu dersle ilgili ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=296745ac-503c-4b14-b3a6-b51c5004c165)!
