---
date: 2024-04-25T00:00:00Z
difficulty: intro
title: Oyunlarda NFT'ler ve Dijital Varlıkların Kullanımı
description:
  NFT'ler blok zinciri oyunlarında güçlü bir araç olabilir. Solana oyunlarında NFT'leri
  tam potansiyeliyle nasıl kullanacağınızı öğrenin.
tags:
  - oyunlar
  - anchor
  - program
  - web3js
  - token uzantıları
  - token 2022
  - nftp
keywords:
  - eğitim
  - blok zinciri geliştirici
  - blok zinciri eğitimi
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
  - nftp
  - meta veriler
---

Fongible olmayan tokenlar (NFT'ler), Solana'nın oyunlara entegrasyonu için hızla
popülarite kazanmaktadır. Bu **benzersiz dijital varlıklar**, Solana blok zincirinde
saklanır ve onlara ekli bir JSON meta verisi gelir. Bu meta veri, geliştiricilerin
belirli bir varlıkla ilgili **önemli nitelikleri ve bilgileri** depolamasına olanak tanır,
örneğin **nadirliği veya oyun içindeki belirli yetenekleri** gibi.

NFT'ler, oyuncular için yeni bir sahiplik ve kıtlık seviyesi sunarak silahlar ve zırhlar
gibi şeylerin yanı sıra dijital gayrimenkul ve koleksiyonları temsil etmek için oyunlarda
kullanılabilir. Ayrıca NFT'ler, bir oyundaki arazi, ev, başarılar veya hatta karakterleri
temsil edebilir. Olasılıklar **sonsuzdur**.

## NFT Oluşturmak için Solana GameShift Kullanımı

Solana GameShift, [Solana Labs](https://solanalabs.com/) tarafından oluşturulan bir oyun API
ürünüdür ve böylece oyununuz için NFT'ler ve diğer varlıkları kolayca oluşturabilirsiniz.
GameShift şu özellikleri sunar:

- NFT'ler oluşturmak için basit bir API
- USD üzerinden varlık satın alma
- Oyun içi pazar yeri
- NFT'lerin meta verilerini güncelleme

- [Belgeler](https://docs.gameshift.dev/)
- [Örnek Oyun Canlı](https://solplay.de/cubeshift)
- [Örnek Oyun Kaynağı](https://github.com/solana-developers/cube_shift)
- [Örnek Oyun Geliştirici Günlüğü](https://www.youtube.com/watch?v=hTCPXVn14TY)

## NFT'lerle Token Gating

NFT'leri kullanarak, NFT'ye sahip olma durumuna bağlı olarak oyunun belirli bir
kısmına erişimi koşullu olarak kısıtlayabilirsiniz. Bu, oyununuzda daha sıkı bir
topluluk oluşturabilir. :::info Bu yaklaşım, oyuncuların **katılımını artırabilir**.
`JavaScript` kullanarak
[Metaplex SDK](https://github.com/metaplex-foundation/js#readme) ile bu aşağıdaki
gibi görünecektir:

```js
JSON.parse(
  // Örneğin '~/.config/solana/devnet.json'
  fs.readFileSync("yourKeyPair.json").toString())
);
let keyPair = Keypair.fromSecretKey(decodedKey);

const metaplex = Metaplex.make(connection).use(keypairIdentity(keyPair));

const nfts = await metaplex
  .nfts()
  .findAllByOwner({ owner: wallet.publicKey })

let collectionNfts = []
for (let i = 0; i < nfts.length; i++) {
  if (nfts[i].collection?.address.toString() == collectionAddress.toString()) {
    collectionNfts.push(nfts[i])
  }
}
```

:::warning Dikkat: NFT'leri yüklemek için başka bir verimli yol, 
[DAS varlık API](https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api)'dir.
Bunu Solana oyunları ön ayarı JavaScript istemcisinde bu [Kod Örneği](https://github.com/solana-developers/solana-game-preset/blob/main/app/components/DisplayNfts.tsx)
veya aşağıdaki komutla tam bir oyun iskeleti oluşturabilirsiniz:

```bash
npx create-solana-game your-game-name
```

--- 

## NFT'lerle Ekstra Etkiler

Yeniden gelir akışları sağlamanın yanı sıra, NFT'ler oyunculara oyun içi avantajlar
ve bonuslar sağlamak için de kullanılabilir. Örneğin, "jeton iki katına çıkaran"
NFT'sine sahip bir oyuncu, NFT'yi cüzdanında tuttukları sürece iki katı miktarda jeton
alabilir.

NFT'ler, oyuncuların geçici etkiler (örneğin, iksirler veya büyüler) elde etmek için
belirli bir sayıda kullanabilecekleri oyun içi tüketilebilirler olarak da kullanılabilir.
:::note Tamamen tüketildiğinde, NFT yakılır ve etki oyuncunun karakterine uygulanır.

Bu yenilikçi NFT özellikleri, oyun geliştiricilere oyun deneyimlerini benzersiz hale
getirme ve oyuncuları Solana blok zincirindeki değerli varlıkların sahipliği için
ödüllendirme fırsatları sunmaktadır.

> Bu geliştirici kılavuzunu [tokenlarla etkileşimde nasıl](https://content/guides/games/interact-with-tokens.md) bulunduğunuz
> zincir üzerindeki bir Solana oyununda takip edebilirsiniz.

Örnek oyunda, Yedi Denizlerde program, hem fungible hem de non-fungible varlıklar
olan 3 farklı dijital varlık kullanmaktadır:

- "korsan jetonları" (fungible tokenlar) gemileri yükseltmek için kullanılır
- "rom" (fungible tokenlar) gemilerin sağlığını artırır
- "toplar" (NFT'ler) gemilerin savaşlarda verdiği hasarı artırır

> Kaynak kodunu bulabilirsiniz [kaynak kodu](https://github.com/solana-developers/solana-game-examples/tree/main/seven-seas) 
> ve Yedi Denizler oyunu için
> [sekiz saatlik video kurs](https://www.youtube.com/playlist?list=PLilwLeBwGuK6NsYMPP_BlVkeQgff0NwvU) burada.

Ayrıca
`dinamik meta veriler` (Token
Uzantılarını kullanarak) bir NFT'de karakter seviyesi ve tecrübe veya nesneleri
saklamak için de kullanılabilir. Bu, oyundaki NFT'lerin oyuncular daha fazla onunla
oynadıkça daha değerli hale gelmesini sağlayabilir.

Bunu ayrıca Metaplex'in yeni [Core NFT standardı](https://developers.metaplex.com/core) ile de yapabilirsiniz.

---

## Oyuncu İstatistikleri için NFT Meta Verilerini Kullanma

NFT'ler ayrıca oyun nesneleri için her türlü nitelikleri depolamak için kullanılabilecek
meta verilere sahiptir. Örneğin, bir NFT bir oyun karakterini temsil edebilir ve
nitelikleri (Güç, Zeka, Çeviklik gibi) karakterin oyundaki gücünü doğrudan etkileyebilir.
:::tip Önemli: NFT meta verilerini ve niteliklerini Metaplex SDK kullanarak yükleyebilirsiniz:

```js
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

JSON.parse(
  // Örneğin '.config/solana/devnet.json'
  fs.readFileSync("yourKeyPair.json").toString())
);
let keyPair = Keypair.fromSecretKey(decodedKey);

const metaplex = Metaplex.make(connection).use(keypairIdentity(keyPair));
const nfts = await metaplex.nfts().findAllByOwner({owner: keyPair.publicKey});

const physicalDamage = 5;
const magicalDamage = 5;

nfts.forEach(async nft => {
  const metaData = await metaplex.nfts().load({metadata: nft});

    metaData.json.attributes.forEach(async attribute => {
      if (attribute.trait_type == "Strength") {
        physicalDamage += parseInt(attribute.value)
      }
      if (attribute.trait_type == "Int") {
        magicalDamage += parseInt(attribute.value)
      }
    });
})

console.log("Oyuncunun Fiziksel Hasarı: " + physicalDamage)
console.log("Oyuncunun Büyüsel Hasarı: " + magicalDamage)
```

---

## Bir Oyun Durumunu Kaydetmek için NFT'leri Kullanma

Ayrıca bir NFT'nin mint'ini
[bir PDA türetmek için](https://docs/core/pda.md#how-to-derive-a-pda) kullanabilir ve
bunu bir oyuncunun oyun durumunu kaydetmek için kullanabilirsiniz. Bu, bir oyuncunun
herhangi bir oyun durumunu doğrudan bir NFT'de saklamanıza olanak tanır ki bu da oyuncunun
onu alıp gitmesine (satmasına izin vermekle birlikte) olanak tanır. Bunu [Solana 2048 oyunu](https://github.com/solana-developers/solana-2048)'nda nasıl yapabileceğinizi görebilir ve
aşağıdaki kod parçasını inceleyebilirsiniz:

```rust
#[account(
    init,
    payer = signer,
    space = 800,
    seeds = [b"player".as_ref(), nftMint.key().as_ref()],
    bump,
)]
pub player: Account<'info, PlayerData>,
```

---

## NFT'leri Birleştirme

[Metaplex Fusion Trifle programı](https://docs.metaplex.com/programs/fusion/overview), NFT'lerin diğer NFT'lere sahip olmasını sağlar.

Örneğin, bir bitki parseli NFT'si oluşturabilir ve bunu bir su NFT'si ve bir tohum NFT'si ile birleştirerek bir Domates NFT'si oluşturabilirsiniz.

---

## Oyun İçinde 3D NFT'leri Kullanma

Her NFT meta verisi ayrıca bir "animasyon url" içerir. Bu url bir video, GIF veya bir 3D dosyası içerebilir. Bu 3D dosyaları genellikle `.glb` veya `.gltf` formatını kullanır ve dinamik olarak bir oyuna yüklenebilir.

Unity için [GLTFast](https://github.com/atteneder/glTFast) paketini kullanabilirsiniz. JavaScript'te
[GLTFast JS](https://discoverthreejs.com/book/first-steps/load-models/) kullanılabilir.

Aşağıda, içinde
[bir NFT'nin meta verisi ve glb modelini](https://solscan.io/token/DzHPvbGzrHK4UcyeDurw2nuBFKNvt4Kb7K8Bx9dtsfn#metadata)
yükleyen bir örnek kod parçası bulunmaktadır:

```c#
var gltf = gameObject.AddComponent<GLTFast.GltfAsset>();
gltf.url = nft.metadata.animationUrl;
```

```js
npm install --save-dev gltf-loader-ts

import { GltfLoader } from 'gltf-loader-ts';

let loader = new GltfLoader();
let uri = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf';
let asset: Asset = await loader.load(uri);
let gltf: GlTf = asset.gltf;
console.log(gltf);
// -> {asset: {...}, scene: 0, scenes: Array(1), nodes: Array(2), meshes: Array(1), ...}

let data = await asset.accessorData(0); // BoxTextured0.bin'i alır
let image: Image = await asset.imageData.get(0) // CesiumLogoFlat.png'yi alır
```

---

## Raindrops Boots ile NFT'leri Öğeler ve Niteliklerle Özelleştirme

[Raindrops Boots programı](https://docs.raindrops.xyz/services/boots) ile bir macera karakteri, bir kılıç ve bir miğfer sahibi olabilir. Karakter NFT'si bir pazarda satışa çıktığında, sahip olduğu diğer NFT'ler de satılır.

## NFT'leri Bir Programda Oluşturma ve Ekstra Meta Veri Ekleme

Yeni `Token Uzantıları` ile,
bir programda NFT'ler oluşturmak ve NFT'nin mint hesabında saklanabilecek ek dinamik
zincir içi nitelikler eklemek mümkündür. :::tip Öneri: Örneğin, NFT'nin kendisinde deneyim ve oyuncu seviyesini kaydedebilirsiniz. Bu NFT'ler,
oyuncular daha fazla onunla oynadıkça daha değerli hale gelebilir. 99 seviyesindeki bir
karakter, 1 seviyesindeki bir karakterden daha arzu edilebilir olabilir.

Bu tür zincir içi meta verileri ile çalışmak için daha fazla kaynak bulabilirsiniz:

- `Kılavuz`
- [Depo](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/nft-meta-data-pointer/anchor)
- [Video](https://www.youtube.com/watch?v=n-ym1utpzhk&ab_channel=Solana)

---

## NFT Koleksiyonu Oluşturma

Solana'daki NFT'ler genellikle Metaplex standartlarına uyar. Metaplex, Solana'daki en çok
kullanılan NFT standardını yöneten bir şirkettir. NFT koleksiyonu oluşturmanın en yaygın yolu,
kullanıcının önceden tanımlı meta veri ve resim çiftlerini mintlemesine izin veren bir
Metaplex "[Candy Machine](https://docs.metaplex.com/programs/candy-machine/how-to-guides/my-first-candy-machine-part1)" oluşturmaktır.

> :::note Dikkat: Metaplex koleksiyonları ile çalışmak hakkında daha fazla bilgi bulabilirsiniz
[Metaplex topluluk rehberlerinde](https://developers.metaplex.com/community-guides).

Metaplex yaygın ve popüler olsa da, Solana'da daha birçok NFT standardı bulunmaktadır:

- spNFT'ler
- WNS
- Core
- SPL-22
- SPL-404
- nifty

---

## NFT Stake Etme ve Misyonlar

Oyuncuların NFT'leri stake etmelerine (zaman kilidi) ve oyun içi para birimi oluşturmalarına
ya da oyunculara ödül vermek için NFT'leri misyonlara göndermelerine izin verebilirsiniz.
:::tip İpuçları: [Honeycomb Protocol](https://docs.honeycombprotocol.com/) bu tür bir işlevsellik ve daha fazlasını
sunmaktadır.