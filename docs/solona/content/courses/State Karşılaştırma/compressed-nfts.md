---
title: Sıkıştırılmış NFT'ler
objectives:
  - Metaplex'in Bubblegum programını kullanarak sıkıştırılmış NFT koleksiyonu oluşturmak
  - Bubblegum programını kullanarak sıkıştırılmış NFT'ler basmak
  - Bubblegum programını kullanarak sıkıştırılmış NFT'leri transfer etmek
  - Read API'yi kullanarak sıkıştırılmış NFT verilerini okumak
description:
  "Metaplex'in Bubblegum Programı'nı kullanarak büyük ölçekli NFT koleksiyonlarını nasıl basacağınızı, transfer edeceğinizi ve okuyacağınızı öğrenin."
---

## Özeti

- **Sıkıştırılmış NFT'ler (cNFT'ler)**, NFT verilerini hash'lemek ve hash'i bir **eşzamanlı Merkle ağaç** yapısı kullanarak zincirde bir hesapta saklamak için **Durum Sıkıştırması** kullanır.
- cNFT veri hash'i, cNFT verisini çıkarım yaparak kullanılamaz, ancak gördüğünüz cNFT verisinin doğru olup olmadığını **doğrulamak** için kullanılabilir.
- Destekleyici RPC sağlayıcıları, cNFT basıldığında cNFT verilerini zincir dışı **indeksler** ve böylece veriye erişmek için **Read API** kullanılabilir.
- **Metaplex Bubblegum programı**, cNFT koleksiyonlarını daha basit bir şekilde oluşturmanıza, basmanıza ve yönetmenize olanak tanıyan, **Durum Sıkıştırması** programı üzerine bir soyutlamadır.

---

## Ders

Sıkıştırılmış NFT'ler (cNFT'ler), adlarının önerdiği gibidir: yapı olarak geleneksel NFT'lerden daha az hesap depolama alanı kaplayan NFT'lerdir. Sıkıştırılmış NFT'ler, maliyetleri büyük ölçüde azaltan bir şekilde veri depolamak için **Durum Sıkıştırması** adı verilen bir kavramdan yararlanır.

:::info
Solana'nın işlem maliyetleri o kadar düşüktür ki, çoğu kullanıcı, büyük ölçekli NFT'lerin basılmasının ne kadar pahalı olabileceğini asla düşünmez.
:::

Token Metadata Programı kullanarak 1 milyon geleneksel NFT'yi kurmak ve basmak için yaklaşık 24.000 SOL maliyet gerekmektedir. Karşılaştırıldığında, cNFT'ler, aynı kurulum ve basımın 10 SOL veya daha az maliyetle yapılandırılabilmesi için tasarlanabilir. Bu, büyük ölçekli NFT kullanan herkesin cNFT'leri geleneksel NFT'lere göre kullanarak maliyetleri **1000 kat daha** azaltabileceği anlamına gelir.

Ancak, cNFT'ler ile çalışmak bazen zor olabilir. Sonunda, bunlarla çalışmak için gereken araçlar, temel teknolojiden yeterince soyutlanmış olacak ve geleneksel NFT'ler ile cNFT'ler arasındaki geliştirici deneyimi önemsiz hale gelecektir. Ama şimdi, yine de düşük seviyedeki bulmacayı anlamanız gerekecek, o yüzden detaylara dalalım!

---

### cNFT'ler Üzerine Teorik Bir Genel Bakış

Geleneksel NFT'lerle ilişkili maliyetlerin çoğu, hesap depolama alanına dayanır. Sıkıştırılmış NFT'ler, verileri blockchain'in **defter durumu** içinde depolamak için Durum Sıkıştırması olarak adlandırılan bir kavram kullanır; yalnızca "parmak izi" veya verinin **hash'ini** saklamak için hesap durumunu kullanır. Bu hash, verinin değiştirilmediğini kriptografik olarak doğrulamanıza olanak tanır.

Hash'leri depolamak ve doğrulamayı sağlamak için, özel bir ikili ağaç yapısı olan **eşzamanlı Merkle ağaç** kullanırız. Bu ağaç yapısı, verileri birleştirerek, zincirde saklanan tek bir nihai hash hesaplamamıza olanak tanır. Bu nihai hash, bir araya getirilen tüm orijinal verilerden çok daha küçüktür; bu da "sıkıştırma" anlamına gelir. Bu süreçteki adımlar şunlardır:

1. Herhangi bir veri parçasını alın
2. Bu verinin hash'ini oluşturun
3. Bu hash'i ağacın alt kısmındaki bir "yaprak" olarak saklayın
4. Her yaprak çifti birleştirilerek bir "dal" oluşturulur
5. Her dal birleştirilerek hash edilir
6. Sürekli olarak ağacın tepesine çıkın ve komşu dalları birleştirerek hash edin
7. Ağacın tepesine ulaşıldığında, nihai "kök hash" üretilir
8. Kök hash'i zincirde saklayarak her yaprağın içindeki verilerin doğrulanabilir bir kanıtı olarak saklayın
9. Verilerinin "doğru kaynak" ile eşleşip eşleşmediğini doğrulamak isteyen herkes aynı süreçten geçebilir ve nihai hash'i karşılaştırabilir, tüm verilerin zincire kaydedilmesi gerekmez.

:::note
Yukarıda ele alınmayan bir sorun, verilerin bir hesap üzerinden alınamaması durumunda verilerin nasıl erişilebilir hale getirileceğidir. 
:::

Bu hashleme süreci zincirde gerçekleştiğinden, tüm veriler defter durumunda mevcut olup, teorik olarak orijinal işlemin tekrar oynatılarak orijinal zincir durumunda geri alınabilir. Ancak, bu biraz daha basit (ama hala karmaşık) bir **indeksleyici** kullanmak, işlemler gerçekleştiği sırada verileri takip etmeyi ve indekslemeyi sağlar. Bu, herkesin erişebileceği ve ardından zincirdeki kök hash ile doğrulayabileceği bir zincir dışı "ön bellek" sağlar.

Bu süreç _çok karmaşık_. Aşağıda bazı önemli kavramları ele alacağız, ancak hemen anlamıyorsanız endişelenmeyin. Durum sıkıştırması dersiyle daha fazla teori hakkında konuşacağız ve bu derste esas olarak NFT'lerle olan uygulamalara odaklanacağız. Bu dersten sonunda cNFT'lerle çalışabileceksiniz, tüm durum sıkıştırması bulmacasını tam olarak anlamasanız bile.

---

#### Eşzamanlı Merkle Ağaçları

**Merkle ağacı**, tek bir hash ile temsil edilen ikili bir ağaç yapısıdır. Yapıdaki her yaprak düğüm, iç verisinin bir hash'idir; her dal ise çocuk yaprak hash'lerinin bir hash'idir. Dallar da birleştirilerek hash edilir ve sonunda bir tane nihai kök hash kalır.

> **Not:** Yaprak verisindeki herhangi bir değişiklik, kök hash'ini değiştirir. Bu, aynı slotta birden fazla işlemin yaprak verisini değiştirmeye çalıştığı durumlarda bir sorun yaratır. Bu işlemlerin sıralı olarak yürütülmesi gerektiğinden, ilk işlem dışında tüm işlemler başarısız olacaktır, çünkü kök hash ve geçerli kanıt, yürütülen ilk işlem tarafından geçersiz kılınacaktır.

Bir **eşzamanlı Merkle ağacı**, en son değişikliklerin güvenli bir değişiklik günlüklerini, aynı zamanda kök hash ve onu türetmek için kanıtla birlikte saklayan bir Merkle ağacıdır. Aynı slotta, birden fazla işlem yaprak verisini değiştirmeye çalıştığında, değişiklik günlüğü, ağacın eşzamanlı değişikliklerinin yapılmasına olanak tanıyan bir doğru kaynak olarak kullanılabilir.

Eşzamanlı Merkle ağacı ile çalışırken, ağacın boyutunu, ağacı oluşturma maliyetini ve ağaca yapılan eşzamanlı değişikliklerin sayısını belirleyen üç değişken vardır:

1. Maksimum derinlik
2. Maksimum tampon boyutu
3. Ağaç üstü derinliği

**Maksimum derinlik**, herhangi bir yapraktan ağacın köküne ulaşmak için gereken maksimum atlama sayısıdır. Merkle ağaçları ikili ağaçlar olduğundan, her yaprak yalnızca bir başka yaprağa bağlanır. Maksimum derinlik, `2 ^ maxDepth` ile ağacın düğüm sayısını hesaplamak için mantıksal olarak kullanılabilir.

**Maksimum tampon boyutu**, geçerli kök hash hala geçerli olacak şekilde, bir slot içinde bir ağaca yapabileceğiniz maksimum eşzamanlı değişiklik sayısını etkili bir şekilde belirler.

**Ağaç üstü derinliği**, herhangi bir verilmiş kanıt yolu için zincirde saklanan kanıt düğümü sayısını gösterir. Herhangi bir yaprağı doğrulamak için ağacın tam kanıt yoluna ihtiyaç vardır. Tam kanıt yolu, ağacın her "katmanı" için bir kanıt düğümünden oluşur, yani maksimum derinlik 14 ise, 14 kanıt düğümü vardır. Her kanıt düğümü bir işleme 32 byte ekler, bu nedenle büyük ağaçlar, kanıt düğümlerini zincirde ön belleklemeden hızlı bir şekilde maksimum işlem boyutu limitini aşabilir.

---

:::warning
Bu üç değerden her biri, maksimum derinlik, maksimum tampon boyutu ve ağaç üstü derinliği ile bir takas ile gelir. Bu değerlerden herhangi birini artırmak, ağacı saklamak için kullanılan hesabın boyutunu artırır ve dolayısıyla ağacın oluşturma maliyetini artırır.
:::

Maksimum derinlik seçimi oldukça basit olup, doğrudan yaprak sayısıyla ilgili olduğundan, ağacın tutması gereken NFT sayısına göre seçmek en kolayıdır. Eğer tek bir ağaçta 1 milyon cNFT'ye ihtiyacınız varsa, aşağıdaki ifadeyi doğru kılacak maksimum derinliği bulun: `2^maxDepth > 1 million`. Cevap 20'dir.

Maksimum tampon boyutunu seçmek, aslında bir çıktının sorusu: ne kadar eşzamanlı yazma ihtiyacınız var.

#### SPL Durum Sıkıştırması ve Noop Programları

SPL Durum Sıkıştırması Programı, yukarıdaki süreci Solana ekosisteminde tekrarlanabilir ve bileşen haline getirmek için vardır. Merkle ağaçlarını başlatmak, ağaç yapraklarını yönetmek (yani veri eklemek, güncellemek, kaldırmak) ve yaprak verilerini doğrulamak için talimatlar sağlar.

Durum Sıkıştırması Programı ayrıca, yaprak verilerini defter durumda daha kolay indekslemek için günlük kaydı yapan ayrı bir "no op" programını kullanır.

#### Depolama için Defter Durumunu Kullanma

Solana defteri, imzalı işlemler içeren bir giriş listesidir. Teorik olarak, bu, başlangıç bloğuna kadar geri izlenebilir. Bu, teorik olarak, bir işlemin içine konulmuş herhangi bir verinin, defterde mevcut olduğu anlamına gelir.

:::note
Sıkıştırılmış veriyi depolamak istediğinizde, bu veriyi Durum Sıkıştırması programına geçirirsiniz; burada hash'lenir ve Noop programına bir "olay" olarak yayımlanır. Hash daha sonra ilgili eşzamanlı Merkle ağacında saklanır. İşlem sırasında geçerli olan veri, Noop programı günlüklerinde bile mevcut olduğundan, bu veriler daima defter durumunda var olacaktır.
:::

#### Veriyi Kolayca Robotlamaya İndeksleme

Normal koşullar altında, uygun hesabı alarak zincirdeki verilere erişim sağlarsınız. Ancak, durum sıkıştırması kullanırken bu öyle basit değildir.

Yukarıda belirtildiği gibi, veriler artık bir hesapta değil, defter durumunda vardır. Tam verileri bulmanın en kolay yeri Noop talimatının günlüklerindedir, ancak bu veriler bir anlamda defter durumunda sonsuza kadar mevcut olsa da, zamanla doğrulayıcılar tarafından erişilemez hale gelecektir.

Alan tasarrufu sağlamak ve daha performanslı olmak için doğrulayıcılar, başlangıç bloğuna kadar her işlemi saklamaz. Verilerinize bağlı Noop talimatı günlüklerine erişim süresi doğrulayıcıya bağlı olarak değişecektir, ancak direkt olarak talimat günlüklerine güveniyorsanız, sonunda bunun erişimini kaybedeceksiniz.

Teknik olarak, işlem durumunu başlangıç bloğuna kadar tekrar oynatabilirsiniz, ancak ortalama bir ekip bunu yapmayacaktır ve performans açısından kesinlikle etkin olmayacaktır.

Bunun yerine, Noop programına gönderilen olayları gözlemleyecek ve ilgili verileri zincir dışı saklayacak bir indeksleyici kullanmalısınız. Böylece eski verilerin erişilemez hale gelmesi konusunda endişelenmenize gerek kalmaz.

---

### cNFT Koleksiyonu Oluşturma

Teorik temellere geçtikten sonra, bu dersin ana konusuna dönelim: cNFT koleksiyonu nasıl oluşturulur.

Neyse ki, süreci basitleştirmek için Solana Vakfı, Solana geliştirici topluluğu ve Metaplex tarafından oluşturulan araçları kullanabilirsiniz. Özellikle, `@solana/spl-account-compression` SDK'sını, Metaplex'ten Umi kütüphanesi aracılığıyla Metaplex Bubblegum programı `@metaplex-foundation/mpl-bubblegum` kullanacağız.

#### Metadata'yı Hazırlama

Başlamadan önce, NFT metadata'nızı Candy Machine kullanıyormuş gibi hazırlayacaksınız. Temelde, bir NFT, NFT standardına uyan metadata ile birlikte bir token'dır. Başka bir deyişle, bir şeye benzeyecek şekilde şekillendirilmelidir:

```json
{
  "name": "Koleksiyonum",
  "symbol": "KC",
  "description": "Koleksiyonum açıklaması",
  "image": "https://lvvg33dqzykc2mbfa4ifua75t73tchjnfjbcspp3n3baabugh6qq.arweave.net/XWpt7HDOFC0wJQcQWgP9n_cxHS0qQik9-27CAAaGP6E",
  "attributes": [
    {
      "trait_type": "Arka Plan",
      "value": "şeffaf"
    },
    {
      "trait_type": "Şekil",
      "value": "küre"
    },
    {
      "trait_type": "Çözünürlük",
      "value": "1920x1920"
    }
  ]
}
```

Kullanım durumunuza bağlı olarak, bunu dinamik olarak oluşturabilirsiniz veya her bir cNFT için önceden hazırlanmış bir JSON dosyasına sahip olmak isteyebilirsiniz. Ayrıca yukarıdaki örnekte gösterilen `image` URL'si gibi JSON ile ilişkili diğer varlıkları da temin etmeniz gerekecektir.

---

#### Koleksiyon NFT'si Oluşturma

NFT'ler, arzı olan fungible token'ların aksine doğal olarak biriciktir. Ancak aynı seriden üretilen NFT'leri bir koleksiyon altında bağlamak önemlidir. Koleksiyonlar, kullanıcıların aynı koleksiyondaki diğer NFT'leri keşfetmelerine olanak tanır ve bireysel NFT'lerin gerçekten koleksiyonun üyeleri olduğunu doğrulamalarına yardımcı olur (başka biri tarafından üretilmiş benzerleri değil).

:::tip
cNFT'lerinizin bir koleksiyonun parçası olması için, cNFT'leri mintlemeden **önce** bir Koleksiyon NFT'si oluşturmanız gerekecektir. Bu, cNFT'lerinizi bir araya getirerek referans oluşturan geleneksel Token Metadata Programı NFT'sidir.
:::

Bu NFT'yi oluşturma prosedürü [Metaplex ile NFT'ler dersi](https://solana.com/developers/courses/tokens-and-nfts/nfts-with-metaplex#add-the-nft-to-a-collection) sayfamızda detaylandırılmıştır.

```typescript
const collectionMint = generateSigner(umi);

await createNft(umi, {
  mint: collectionMint,
  name: `Koleksiyonum`,
  uri,
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true, // koleksiyon NFT'si olarak bas
}).sendAndConfirm(umi);
```

#### Merkle Ağaç Hesabı Oluşturma

Şimdi, geleneksel NFT'ler oluştururken kullanılan süreçten ayrılmaya başlıyoruz. Durum sıkıştırması için kullandığınız zincir üzerindeki depolama mekanizması, bir eşzamanlı Merkle ağacı temsil eden bir hesap olacaktır. Bu Merkle ağaç hesabı, SPL Durum Sıkıştırma programına aittir. cNFT'lerle ilgili herhangi bir şey yapmadan önce, uygun boyutta boş bir Merkle ağaç hesabı oluşturmalısınız.

Hesabın boyutunu etkileyen değişkenler şunlardır:

1. Maksimum derinlik
2. Maksimum tampon boyutu
3. Ağaç üstü derinliği

İlk iki değişken, geçerli çiftler setinden seçilmelidir. Aşağıdaki tablo, geçerli çiftleri ve bu değerlerle kaç cNFT oluşturulabileceğini göstermektedir.

| Maks. Derinlik | Maks. Tampon Boyutu | Maks. cNFT Sayısı |
| --------------- | -------------------- | ----------------- |
| 3               | 8                    | 8                 |
| 5               | 8                    | 32                |
| 14              | 64                   | 16,384            |
| 14              | 256                  | 16,384            |
| 14              | 1,024                | 16,384            |
| 14              | 2,048                | 16,384            |
| 15              | 64                   | 32,768            |
| 16              | 64                   | 65,536            |
| 17              | 64                   | 131,072           |
| 18              | 64                   | 262,144           |
| 19              | 64                   | 524,288           |
| 20              | 64                   | 1,048,576         |
| 20              | 256                  | 1,048,576         |
| 20              | 1,024                | 1,048,576         |
| 20              | 2,048                | 1,048,576         |
| 24              | 64                   | 16,777,216        |
| 24              | 256                  | 16,777,216        |
| 24              | 512                  | 16,777,216        |
| 24              | 1,024                | 16,777,216        |
| 24              | 2,048                | 16,777,216        |
| 26              | 512                  | 67,108,864        |
| 26              | 1,024                | 67,108,864        |
| 26              | 2,048                | 67,108,864        |
| 30              | 512                  | 1,073,741,824     |
| 30              | 1,024                | 1,073,741,824     |
| 30              | 2,048                | 1,073,741,824     |

Ağaçta saklanabilecek cNFT sayısının tamamen maksimum derinliğe bağlı olduğunu; tampon boyutunun ise aynı slotta ağaç üzerinde gerçekleşecek olan eşzamanlı değişikliklerin sayısını belirleyeceğini unutmayın. Başka bir deyişle, ihtiyacınız olan NFT sayısına karşılık gelen maksimum derinliği seçin; ardından bekleyeceğiniz trafiğe bağlı olarak maksimum tampon boyutu için bir seçenek seçin.

Ardından, ağaç üstü derinliğini seçin. Ağaç üstü derinliğini artırmak, cNFT'lerinizin bileşenliğini artırır. Sizin veya başka bir geliştiricinin kodu bir cNFT'yi doğrulamaya çalıştığında, kod, ağacınızdaki katman sayısı kadar kanıt düğümünü iletmek zorundadır. Örneğin, maksimum derinlik 20 ise, 20 kanıt düğümünü geçmelisiniz. Bu yalnızca zahmetli olmakla kalmaz, her kanıt düğümü 32 byte olduğundan, işlem boyutlarını çok hızlı bir şekilde en üst seviyeye çıkarmak mümkündür.

Örneğin, eğer ağacınızın çok düşük bir ağaç üstü derinliği varsa, bir NFT pazaryeri yalnızca basit NFT transferlerini destekleyebilir, cNFT'leriniz için bir zincir içi teklif sistemini desteklemek yerine. Ağaç üstü, zincirdeki kanıt düğümlerini önbelleğe alır, böylece hepsini işlemin içine geçirmek zorunda kalmazsınız, böylece daha karmaşık işlemlere izin verir.

:::danger
Bu üç değerden herhangi birinin artırılması, hesabın boyutunu artırır, dolayısıyla oluşturma ile ilgili maliyetin artmasına neden olur. Değerleri seçerken yararları buna göre değerlendirin.
:::

Bu değerleri belirledikten sonra, `@metaplex-foundation/mpl-bubblegum` paketindeki `createTree` yöntemini kullanarak ağacınızı oluşturabilirsiniz. Bu talimat, iki hesap oluşturup başlatır:

1. Bir `Merkle Ağaç` hesabı - bu, merkle hash'i tutar ve saklanan verinin doğruluğunu doğrulamak için kullanılır.
2. Bir `Ağaç Yapılandırma` hesabı - bu, ağaç oluşturucu, ağacın kamusal olup olmadığı gibi sıkıştırılmış NFT'lerle ilgili ek verileri saklar ve [diğer alanlar - Bubblegum programı kaynağına bakın](https://github.com/metaplex-foundation/mpl-bubblegum/blob/42ffed35da6b2a673efacd63030a360eac3ae64e/programs/bubblegum/program/src/state/mod.rs#L17).

#### Umi'yi Ayarlama

`mpl-bubblegum` paketi bir eklentidir ve Metaplex'ten Umi kütüphanesi olmadan kullanılamaz. Umi, Metaplex tarafından oluşturulan, zincir üzerinde programlar için JS/TS istemcileri oluşturan bir çerçevedir.

Umi'nin, web3.js'den farklı uygulama biçimlerine sahip olduğunu unutmayın; bu, Keypair, PublicKey ve Connections gibi öğeleri kapsar. Ancak, bu öğelerin web3.js versiyonlarından Umi eşdeğerlerine dönüştürmek kolaydır.

Başlamak için, bir Umi örneği oluşturmalıyız.

```typescript
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));
```

Yukarıdaki kod, herhangi bir imzalayıcı veya eklenti eklenmemiş boş bir Umi örneğini başlatır. Mevcut eklentilerin eksiksiz listesini [bu Metaplex doküman sayfasında](https://developers.metaplex.com/umi/metaplex-umi-plugins) bulabilirsiniz.

Sonraki bölüm, içe aktarmalarımızı eklemek ve Umi örneğimize bir imzalayıcı eklemektir.

```typescript
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

// Yerel dosya sisteminden anahtar çiftini yükleyin
// https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file adresine bakın
const localKeypair = await getKeypairFromFile();

// Umi uyumlu anahtar çiftine dönüştür
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// MPL Bubblegum programını yükleyin, dasApi eklentisini ekleyin ve Umi örneğimize bir imzalayıcı atayın
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

console.log("Bubblegum ile UMI yüklendi");
```

#### Ağaçınızı Başlatmak İçin Bubblegum'ı Kullanın

Umi başlatıldığında, Merkle ağaç ve ağaç yapılandırma hesaplarını başlatmak için `createTree` yöntemini çağırmaya hazırız.

```typescript
const merkleTree = generateSigner(umi);
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
});
await builder.sendAndConfirm(umi);
```

Ağaç oluşturmak için gerekli olan üç değer, yani `merkleTree`, `maxDepth` ve `maxBufferSize`'dır; diğerleri isteğe bağlıdır. Örneğin, `ağaç oluşturucu` varsayılan olarak Umi örneği kimliğine ayarlanır ve `kamusal` alanı varsayılan olarak yanlış ayarlanır.

> `Kamusal` true olarak ayarlandığında, herkes başlatılan ağaçtan basım yapabilir ve false olduğunda yalnızca ağaç oluşturucusu bu ağaçtan basım yapabilecektir.

[create_tree talimatı yöneticisinin](https://github.com/metaplex-foundation/mpl-bubblegum/blob/42ffed35da6b2a673efacd63030a360eac3ae64e/programs/bubblegum/program/src/processor/create_tree.rs#L40) ve [create_tree'ın beklenen hesapları](https://github.com/metaplex-foundation/mpl-bubblegum/blob/42ffed35da6b2a673efacd63030a360eac3ae64e/programs/bubblegum/program/src/processor/create_tree.rs#L20) incelemekten çekinmeyin.

#### cNFT'ler ile Mint Etme

Merkle ağacı hesabı ve ilgili Bubblegum ağaç yapılandırma hesabı başlatıldığında, ağaçta cNFT'ler mint etmek mümkündür. Bubblegum kütüphanesi, mint edilen varlığın bir koleksiyona ait olup olmadığına bağlı olarak faydalanabileceğimiz iki talimat sağlar.

:::info Bu iki talimatı inceleyelim:
1. **MintV1**
   
   ```typescript
   await mintV1(umi, {
     leafOwner,
     merkleTree,
     metadata: {
       name: "Sıkıştırılmış NFT'm",    
       uri: "https://example.com/my-cnft.json",
       sellerFeeBasisPoints: 0, // 0%
       collection: none(),
       creators: [
         { address: umi.identity.publicKey, verified: false, share: 100 },
       ],
     },
   }).sendAndConfirm(umi);
   ```

2. **mintToCollectionV1**

   ```typescript
   await mintToCollectionV1(umi, {
     leafOwner,
     merkleTree,
     collectionMint,
     metadata: {
       name: "Sıkıştırılmış NFT'm",
       uri: "https://example.com/my-cnft.json",
       sellerFeeBasisPoints: 0, // 0%
       collection: { key: collectionMint, verified: false },
       creators: [
         { address: umi.identity.publicKey, verified: false, share: 100 },
       ],
     },
   }).sendAndConfirm(umi);
   ```

Her iki işlev de cNFT mintlemek için gerekli olan NFT meta verilerini ve `leafOwner`, `merkleTree` hesabı gibi hesapların bir listesini geçirmenizi gerektirir.

### cNFT'lerle Etkileşim

cNFT'lerin _SPL token_ olmadığını belirtmek önemlidir. **Bu, kodunuzun cNFT işlevselliğini yönetmek için farklı standartlara uyması gerektiği anlamına gelir; örneğin, veri alma, sorgulama, transfer etme vb.**

#### cNFT verilerini Alma

Mevcut bir cNFT'den veri almanın en basit yolu, [Dijital Varlık Standardı Okuma API'si](https://developers.metaplex.com/das-api) (Okuma API'si) kullanmaktır. Bunun, standart JSON RPC'den ayrı olduğunu unutmayın. Okuma API'sini kullanmak için bir destekleyici RPC Sağlayıcısı kullanmanız gerekecek. Metaplex, (muhtemelen eksiksiz olmayan) [DAS Okuma API'sini destekleyen RPC sağlayıcılarının listesini](https://developers.metaplex.com/rpc-providers#rpcs-with-das-support) tutmaktadır.

:::tip Öneri: Bu dersin amaçları doğrultusunda [Helius](https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api) kullanacağız çünkü Devnet için ücretsiz destek sağlıyorlar.

RPC bağlantı uç noktanızı Umi başlatma kısmında güncellemeniz gerekebilir.

```typescript
const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=YOUR-HELIUS-API-KEY",
);
```

Okuma API'sini kullanarak belirli bir cNFT'yi almak için cNFT'nin varlık ID'sine sahip olmanız gerekir. Ancak, cNFT'leri mint ettikten sonra, en fazla iki bilgiye sahip olacaksınız:

1. İşlem imzası
2. Leaf dizini (muhtemel)

Real guarantee yalnızca işlem imzasına sahip olmanızdır. Oradan leaf indeksini bulmak **mümkündür**, ancak oldukça karmaşık bir ayrıştırma sürecidir. **Kısa hikaye, `Noop program`'ından ilgili talimat kayıtlarını almanız ve bunları analiz etmeniz gerektiğidir.** Bunu gelecekteki bir derste daha derinlemesine ele alacağız. Şu anda, leaf indeksini bildiğinizi varsayıyoruz.

Bu, çoğu mint için makul bir varsayımdır, çünkü mintleme işlemi kodunuz tarafından kontrol edilecek ve kodunuzun her mint için hangi indeksin kullanılacağını takip edebilmesi için sıralı bir şekilde ayarlanabilir. Yani ilk mint 0. indeksi kullanacak, ikincisi 1. indeksi vb.

Leaf indeksine sahip olduğunuzda, cNFT'ye karşılık gelen varlık ID'sini çıkartabilirsiniz. **Bubblegum kullanıldığında, varlık ID'si, Bubblegum program ID'si ve aşağıdaki tohumlar kullanılarak türetilmiş bir PDA'dır:**

1. UTF8 kodlamasında temsil edilen `asset` statik dizesi
2. Merkle ağacı adresi
3. Leaf dizini

Indexer, `Noop program`'dan işlem kayıtlarını gözlemler ve Merkle ağacında hash'lenmiş ve saklanmış cNFT meta verilerini depolar. Bu, talep edildiğinde verileri yüzeye çıkarmalarına olanak tanır. Bu varlık ID'si, indexer'ın belirli bir varlığı tanımlamak için kullandığı şeydir.

:::note Basitlik açısından, Bubblegum kütüphanesinden sadece `findLeafAssetIdPda` yardımcı işlevini kullanabilirsiniz.

```typescript
const [assetId, bump] = await findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex,
});
```

Varlık ID'si ile cNFT'yi almak oldukça basittir. Destekleyici RPC sağlayıcısı ve `dasApi` kütüphanesi tarafından sağlanan `getAsset` yöntemini kullanın:

```typescript
const [assetId, bump] = await findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex,
});

const rpcAsset = await umi.rpc.getAsset(assetId);
```

Bu, geleneksel bir NFT'nin hem on-chain hem de off-chain meta verilerinin kapsamlı bir JSON nesnesini döndürür. Örneğin, cNFT'nizin özelliklerini `content.metadata.attributes` veya resmi `content.files.uri` altında bulabilirsiniz.

#### cNFT'leri Sorgulama

Okuma API'si ayrıca birden fazla varlık alma, sahiplerine, yaratıcılarına ve daha fazlasına göre sorgulama yollarını da içerir. Örneğin, Helius aşağıdaki yöntemleri destekler:

- `getAsset`
- `getSignaturesForAsset`
- `searchAssets`
- `getAssetProof`
- `getAssetsByOwner`
- `getAssetsByAuthority`
- `getAssetsByCreator`
- `getAssetsByGroup`

Bunların çoğunu doğrudan geçmeyeceğiz, ancak bunları doğru bir şekilde kullanmayı öğrenmek için [Helius belgelerini](https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api) incelemeyi unutmayın.

#### cNFT'leri Transfer Etme

Standart bir SPL token transferiyle olduğu gibi, güvenlik çok önemlidir. Bir SPL token transferi, transfer yetkisini doğrulamayı çok kolay hale getirir. SPL Token programında ve standart imzalama işlemlerinde gömülüdür. Ancak, sıkıştırılmış bir token'ın sahipliğini doğrulamak daha zordur. Gerçek doğrulama program tarafında gerçekleşir, ancak istemci tarafı kodunuzun bunu mümkün kılmak için ek bilgiler sağlaması gerekir.

:::warning Dikkat: Bir Bubblegum `createTransferInstruction` yardımcı işlevi olsa da, genelde daha fazla montaj gereklidir. Özellikle, Bubblegum programı, transfer gerçekleşmeden önce cNFT verilerinin tamamının, istemcinin beyan ettiği şekilde olduğunu doğrulamak zorundadır. 

cNFT verilerinin tamamı Merkle ağacında tek bir leaf olarak hash'lenmiş ve saklanmış olup, Merkle ağaç da tüm ağacın leaf ve dallarının hash'idir. Bunun sonucunda, programa hangi hesabın inceleneceğini söyleyip o hesabın `authority` veya `owner` alanını işlem imzalayan ile karşılaştırmasını isteyemezsiniz.

Bunun yerine, cNFT verilerinin tamamını ve canopy'de saklanmayan Merkle ağacının herhangi bir delil bilgisini sağlamanız gerekir. Bu şekilde, program sağlanan cNFT verilerinin ve dolayısıyla cNFT sahibinin doğru olduğunu bağımsız olarak kanıtlayabilir. **Ancak o zaman program, işlem imzalayanın cNFT'yi transfer etme yetkisine sahip olup olmadığını güvenle belirleyebilir.**

Genel hatlarıyla bu, beş adımda gerçekleşir:

1. Indexer'dan cNFT'nin varlık verisini alın
2. Indexer'dan cNFT'nin bilgisini alın
3. Solana blockchain'inden Merkle ağaç hesabını alın
4. Varlık delilini `AccountMeta` nesnesi listesi olarak hazırlayın
5. Bubblegum transfer talimatını oluşturun ve gönderin

Neyse ki, bu adımları halleden `transfer` yöntemini kullanabiliriz.

```typescript
const assetWithProof = await getAssetWithProof(umi, assetId);

await transfer(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi);
```

### Laboratuvar

Hadi atlayalım ve cNFT'ler ile oluşturma ve çalışma pratiği yapalım. Bir Merkle ağacından cNFT koleksiyonu mint etmek için mümkün olan en basit scripti birlikte oluşturalım.

#### 1. Yeni bir proje oluşturun

Başlamak için boş bir NPM projesi oluşturun ve dizin içine geçin.

```bash
mkdir cnft-demo
npm init -y
cd cnft-demo
```

Gerekli bağımlılıkları yükleyin.

```bash
npm i @solana/web3.js@1 @solana-developers/helpers@2.5.2 @metaplex-foundation/mpl-token-metadata @metaplex-foundation/mpl-bubblegum @metaplex-foundation/digital-asset-standard-api @metaplex-foundation/umi-bundle-defaults

npm i --save-dev esrun
```

Bu ilk scriptte bir ağaç oluşturmayı öğreneceğiz, bu yüzden `create-tree.ts` dosyasını oluşturalım.

```bash
mkdir src && touch src/create-tree.ts
```

Umi başlatma kodu birçok dosyada tekrar edileceği için, bunu başlatmak için bir sarmalayıcı dosyası oluşturabilirsiniz:

```typescript filename="create-tree.ts"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

// yerel dosya sisteminden anahtar çiftini yükleme
// https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file adresine bakın
const localKeypair = await getKeypairFromFile();

// Umi ile uyumlu anahtar çiftine dönüştürme
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// MPL Bubblegum programını, dasApi eklentisini yükleyin ve bir imza sağlayıcısı atayın
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());
```

Yukarıdaki kodda, kullanıcı anahtar çiftini sistem cüzdanından `.config/solana/id.json` konumundan yüklüyoruz, yeni bir Umi örneği oluşturuyoruz ve anahtar çiftini ona atıyoruz. Ayrıca, Bubblegum ve dasApi eklentilerini de atıyoruz.

#### 2. Merkle ağaç hesabı oluşturma

Merkle ağaç hesabını oluşturmakla başlayacağız. Bunu yapmak için Metaplex Bubblegum programından `createTree` yöntemini kullanacağız.

:::note Bu işlev, üç varsayılan değeri alır:
- `merkleTree` - Merkle ağaç hesabı adresi
- `maxDepth` - Ağacın tutacağı maksimum leaf sayısını ve dolayısıyla ağacın içerebileceği maksimum cNFT sayısını belirler.
- `maxBufferSize` - Ağacın paralel olarak kaç eş zamanlı değişiklik yapılabileceğini belirler.
:::

Ayrıca şunlar gibi isteğe bağlı alanları da sağlayabilirsiniz:
- `treeCreator` - Ağacın yetkilisinin adresi, varsayılan olarak mevcut `umi.identity` örneğine atanır.
- `public` - Ağaç oluşturucusu haricindeki diğer kişilerin ağaçtan cNFT mint edip edemeyeceğini belirler.

```typescript filename="create-tree.ts"
const merkleTree = generateSigner(umi);
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
});
await builder.sendAndConfirm(umi);

let explorerLink = getExplorerLink("address", merkleTree.publicKey, "devnet");
console.log(`Keşif bağlantısı: ${explorerLink}`);
console.log("Merkle ağaç adresi:", merkleTree.publicKey);
console.log("✅ Başarıyla tamamlandı!");
```

`create-tree.ts` scriptini esrun kullanarak çalıştırın.

```bash
npx esrun create-tree.ts
```

Sıkıştırılmış NFT'leri mint ettiğimiz bir sonraki adımda kullanacağımız için Merkle ağaç adresini hatırladığınızdan emin olun.

Çıktınız bu şekilde görünecektir:

```bash
Keşif bağlantısı: https://explorer.solana.com/address/ZwzNxXw83PUmWSypXmqRH669gD3hF9rEjHWPpVghr5h?cluster=devnet
Merkle ağaç adresi: ZwzNxXw83PUmWSypXmqRH669gD3hF9rEjHWPpVghr5h
✅ Başarıyla tamamlandı!
```

Tebrikler! Bir Bubblegum ağacı oluşturmuşsunuz. **İşlemin başarılı bir şekilde tamamlandığından emin olmak için Keşif bağlantısını takip edin.**

![Oluşturulan Merkle ağaç hakkında detaylar içeren Solana Explorer](../../../images/solana/public/assets/courses/unboxed/solana-explorer-create-tree.png)

#### 3. cNFT'leri ağacınıza mint etme

İnanılmaz ama cNFT'ler için ağacınızı ayarlamak için yapmanız gereken tek şey bu! Şimdi mint etmeye odaklanalım.

Öncelikle yeni bir dosya oluşturalım: `mint-compressed-nft-to-collection.ts`, ardından ithalatlarımızı ekleyip Umi'yi başlatalım.

```typescript filename="mint-compressed-nft-to-collection.ts"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import {
  findLeafAssetIdPda,
  LeafSchema,
  mintToCollectionV1,
  mplBubblegum,
  parseLeafFromMintToCollectionV1Transaction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

// yerel dosya sisteminden anahtar çiftini yükleme
// https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file adresine bakın
const localKeypair = await getKeypairFromFile();

// Umi ile uyumlu anahtar çiftine dönüştürme
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// MPL Bubblegum programını, dasApi eklentisini yükleyin ve bir imza sağlayıcısı atayın
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());
```

Daha önce Metaplex dersinde oluşturduğum [bir Koleksiyon NFT'sini geri dönüştüreceğim](https://explorer.solana.com/address/D2zi1QQmtZR5fk7wpA1Fmf6hTY2xy8xVMyNgfq6LsKy1?cluster=devnet), ancak bu derste yeni bir koleksiyon oluşturmak istiyorsanız, kodu [bu repo'da](https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/create-collection.ts) kontrol edebilirsiniz.

:::tip Öneri: Metaplex Koleksiyonu NFT'si oluşturma kodunu [Metaplex dersimizde](https://solana.com/developers/courses/tokens-and-nfts/nfts-with-metaplex#add-the-nft-to-a-collection) bulun.
:::

Bir yana sıkıştırılmış NFT'yi bir koleksiyona mint etmek için şunlara ihtiyacımız olacak:

- `leafOwner` - Sıkıştırılmış NFT'nin alıcısı
- `merkleTree` - Önceki adımda oluşturduğumuz Merkle ağaç adresi
- `collection` - cNFT'mizin ait olacağı koleksiyon. **Bu isteğe bağlıdır ve cNFT'niz bir koleksiyona ait değilse dışarıda bırakabilirsiniz.**
- `metadata` - Offchain meta veriniz. Bu ders, meta verinizi nasıl hazırlayacağınıza odaklanmayacak, ancak [Metaplex'ten önerilen yapı](https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard) hakkında bilgi alabilirsiniz.

cNFT'miz, daha önce hazırladığımız bu yapıyı kullanacak.

```json filename="nft.json"
{
  "name": "NFT'm",
  "symbol": "MN",
  "description": "NFT Açıklamam",
  "image": "https://lycozm33rkk5ozjqldiuzc6drazmdp5d5g3g7foh3gz6rz5zp7va.arweave.net/XgTss3uKlddlMFjRTIvDiDLBv6Pptm-Vx9mz6Oe5f-o",
  "attributes": [
    {
      "trait_type": "Arka Plan",
      "value": "şeffaf"
    },
    {
      "trait_type": "Şekil",
      "value": "küre"
    }
  ]
}
```

Her şeyi koda yerleştirdiğimizde, kodumuz şöyle olacak:

```typescript filename="mint-compressed-nft-to-collection.ts"
const merkleTree = UMIPublicKey("ZwzNxXw83PUmWSypXmqRH669gD3hF9rEjHWPpVghr5h");

const collectionMint = UMIPublicKey(
  "D2zi1QQmtZR5fk7wpA1Fmf6hTY2xy8xVMyNgfq6LsKy1",
);

const uintSig = await(
  await mintToCollectionV1(umi, {
    leafOwner: umi.identity.publicKey,
    merkleTree,
    collectionMint,
    metadata: {
      name: "NFT'm",
      uri: "https://chocolate-wet-narwhal-846.mypinata.cloud/ipfs/QmeBRVEmASS3pyK9YZDkRUtAham74JBUZQE3WD4u4Hibv9",
      sellerFeeBasisPoints: 0, // 0%
      collection: { key: collectionMint, verified: false },
      creators: [
        {
          address: umi.identity.publicKey,
          verified: false,
          share: 100,
        },
      ],
    },
  }).sendAndConfirm(umi),
).signature;

const b64Sig = base58.deserialize(uintSig);
console.log(b64Sig);
```

İlk ifadede, işlem imzasını temsil eden byte dizisini döndürdüğümüzü belirtmekteyiz.

Leaf şemasını almak ve bu şemayla varlık ID'sini çıkarmak için buna ihtiyacımız var.

```typescript filename="mint-compressed-nft-to-collection.ts"
const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
  umi,
  uintSig,
);
const assetId = findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex: leaf.nonce,
})[0];
```

Her şey yere oturduğunda, şimdi `mint-compressed-nft-to-collection.ts` scriptimizi çalıştırabiliriz.

```bash
npx esrun mint-compressed-nft-to-collection.ts
```

Çıktınız bu şekilde görünmelidir:

```bash
varlık id'si: D4A8TYkKE5NzkqBQ4mPybgFbAUDN53fwJ64b8HwEEuUS
✅ Başarıyla tamamlandı!
```

Keşif bağlantısını döndürmüyoruz çünkü bu adres Solana durumunda mevcut olmayacak, ancak DAS API'sini destekleyen RPC'ler tarafından indekslenmektir.

Sonraki adımda, bu adresi sorgulayarak cNFT ayrıntılarını alacağız.

#### 4. Mevcut cNFT verilerini oku

Artık cNFT'leri mint etmek için kodu yazdığımızda, verilerini gerçekten alıp alamayacağımıza bakalım.

Yeni bir dosya oluşturun `fetch-cnft-details.ts`

```bash
fetch-cnft-details.ts
```

Paketlerimizi içe aktarın ve Umi'yi başlatın. Burada, daha önce içe aktardığımız `umi.use(dasApi())`'yi nihayet kullanacağız.

:::info
Umi'nin başlatılmasında, bağlantı uç noktamızda bir değişiklik yapacak ve DAS API'yi destekleyen bir RPC kullanacağız.
:::

Helius API anahtarlarınızı güncellemeyi unutmayın, bunları [geliştirici kontrol paneli sayfasından](https://dashboard.helius.dev/signup?redirectTo=onboarding) alabilirsiniz.

```typescript filename="fetch-cnft-details.ts"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@solana-developers/helpers";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=YOUR-HELIUS-API-KEY",
);

// yerel dosya sisteminden anahtar çiftini yükle
// https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file adresine bakın
const localKeypair = await getKeypairFromFile();

// Umi ile uyumlu anahtar çiftine dönüştür
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// MPL Bubblegum programını, dasApi eklentisini yükle ve umi örneğimize bir imzalayıcı atayın
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());
```

Sıkıştırılmış bir NFT detaylarını almak, `getAsset` metodunu `assetId` ile çağırmak kadar basittir.

```typescript filename="fetch-cnft-details.ts"
const assetId = UMIPublicKey("D4A8TYkKE5NzkqBQ4mPybgFbAUDN53fwJ64b8HwEEuUS");

// @ts-ignore
const rpcAsset = await umi.rpc.getAsset(assetId);
console.log(rpcAsset);
```

:::tip
Şimdi `logNftDetails` adında, `treeAddress` ve `nftsMinted` parametrelerini alan bir fonksiyon tanımlayarak başlayalım.
:::

console.log çıktımız şöyle olacaktır:

```json
{
  interface: 'V1_NFT',
  id: 'D4A8TYkKE5NzkqBQ4mPybgFbAUDN53fwJ64b8HwEEuUS',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://chocolate-wet-narwhal-846.mypinata.cloud/ipfs/QmeBRVEmASS3pyK9YZDkRUtAham74JBUZQE3WD4u4Hibv9',
    files: [ [Object] ],
    metadata: {
      attributes: [Array],
      description: 'Benim NFT Tanımım',
      name: 'Benim NFT',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {
      image: 'https://lycozm33rkk5ozjqldiuzc6drazmdp5d5g3g7foh3gz6rz5zp7va.arweave.net/XgTss3uKlddlMFjRTIvDiDLBv6Pptm-Vx9mz6Oe5f-o'
    }
  },
  authorities: [
    {
      address: '4sk8Ds1T4bYnN4j23sMbVyHYABBXQ53NoyzVrXGd3ja4',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: '2UgKwnTkguefRg3P5J33UPkNebunNMFLZTuqvnBErqhr',
    creator_hash: '4zKvSQgcRhJFqjQTeCjxuGjWydmWTBVfCB5eK4YkRTfm',
    asset_hash: '2DwKkMFYJHDSgTECiycuBApMt65f3N1ZwEbRugRZymwJ',
    tree: 'ZwzNxXw83PUmWSypXmqRH669gD3hF9rEjHWPpVghr5h',
    seq: 4,
    leaf_id: 3
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'D2zi1QQmtZR5fk7wpA1Fmf6hTY2xy8xVMyNgfq6LsKy1'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0,

    basis_points: 0,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: '4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF',
      share: 100,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: '4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
```

Unutmayın, Read API aynı zamanda birden fazla varlığı alma, sahip, yaratıcı vb. ile sorgulama yolları içerir. Mevcut olanları görmek için [Helius belgelerine](https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api) göz atmayı unutmayın.

---

#### 5. Bir cNFT transfer et

İçeriğimize ekleyeceğimiz son şey bir cNFT transferidir. Standart bir SPL token transferi ile aynı gibi, güvenlik çok önemlidir. Ancak, herhangi bir türdeki durum sıkıştırması olan bir güvenli transfer oluşturmak için transferi gerçekleştiren programın tüm varlık verilerine ihtiyacı vardır.

Neyse ki, varlık verilerini `getAssetWithProof` metodu ile alabiliyoruz.

Öncelikle yeni bir dosya oluşturun `transfer-asset.ts` ve yeni bir Umi istemcisi başlatmak için kodla doldurun.

```typescript filename="transfer-asset.ts"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import {
  getAssetWithProof,
  mplBubblegum,
  transfer,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";
import {
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

// yerel dosya sisteminden anahtar çiftini yükle
// https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file adresine bakın
const localKeypair = await getKeypairFromFile();

// Umi ile uyumlu anahtar çiftine dönüştür
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// MPL Bubblegum programını, dasApi eklentisini yükle ve umi örneğimize bir imzalayıcı atayın
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());
```

Artık varlığımızı transfer etmeye hazırız. cNFT'miz için `assetId` kullanarak, Bubblegum kütüphanesindeki `transfer` metodunu çağırabiliriz.

```typescript filename="transfer-asset.ts"
const assetId = UMIPublicKey("D4A8TYkKE5NzkqBQ4mPybgFbAUDN53fwJ64b8HwEEuUS");

//@ts-ignore
const assetWithProof = await getAssetWithProof(umi, assetId);

let uintSig = await(
  await transfer(umi, {
    ...assetWithProof,
    leafOwner: umi.identity.publicKey,
    newLeafOwner: UMIPublicKey("J63YroB8AwjDVjKuxjcYFKypVM3aBeQrfrVmNBxfmThB"),
  }).sendAndConfirm(umi),
).signature;

const b64sig = base58.deserialize(uintSig);

let explorerLink = getExplorerLink("transaction", b64sig, "devnet");
console.log(`Explorer link: ${explorerLink}`);
console.log("✅ Başarılı bir şekilde tamamlandı!");
```

:::tip
`npx esrun transfer-asset.ts` komutu ile scriptimizi çalıştırmak, başarılı olursa buna benzer bir çıktı vermelidir:
:::

```bash
Explorer link: https://explorer.solana.com/tx/3sNgN7Gnh5FqcJ7ZuUEXFDw5WeojpwkDjdfvTNWy68YCEJUF8frpnUJdHhHFXAtoopsytzkKewh39Rf7phFQ2hCF?cluster=devnet
✅ Başarılı bir şekilde tamamlandı!
```

:::note
Keşfedicinin bağlantısını açın ve en aşağıya inerek işlem günlüklerinizi gözlemleyin.
:::

![Solana Explorer, cNFT transfer talimatlarının günlüklerini gösteriyor.](../../../images/solana/public/assets/courses/unboxed/solana-explorer-showing-cnft-transfer-logs.png)

Tebrikler! Artık cNFT'leri mint etmek, okumak ve transfer etmek konusunda bilgilisiniz. İsterseniz, maksimum derinliği, maksimum tampon boyutunu ve canopy derinliğini daha büyük değerlere güncelleyebilir ve yeterli Devnet SOL'iniz olduğunda bu script ile 10k cNFT'yi çok küçük bir maliyetle mint edebilirsiniz.

cNFT'yi Solana Explorer'da inceleyin! Daha önce olduğu gibi, herhangi bir sorunla karşılaşırsanız, kendiniz düzeltmelisiniz, ancak gerekirse [çözüm kodu](https://github.com/solana-foundation/compressed-nfts) mevcuttur.

---

### Challenge

Artık bu kavramları kendi başınıza denemek için sıradasınız! Bu aşamada fazla yönlendirmede bulunmayacağız, ancak işte bazı fikirler:

1. Kendi üretim cNFT koleksiyonunuzu oluşturun.
2. Bu dersin laboratuvarı için bir UI oluşturun, böylece bir cNFT mint edebilir ve görüntüleyebilirsiniz.
3. Laboratuvar scriptinin bazı işlevselliğini bir onchain programında çoğaltmaya çalışın, yani cNFT'leri mint edebilen bir program yazın.


Kodunuzu GitHub'a yükleyin ve
[bize bu ders hakkında ne düşündüğünüzü anlatın](https://form.typeform.com/to/IPH0UGz7#answers-lesson=db156789-2400-4972-904f-40375582384a)!
