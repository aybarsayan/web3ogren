---
title: NFT Nasıl Oluşturulur
sidebarSortOrder: 15
description: "Arweave ve Metaplex kullanarak Solana üzerinde nasıl NFT oluşturulacağını öğrenin."
---

Bir NFT oluşturmak için şunları yapmalısınız:

1. *Resmi IPFS'ye, örneğin Arweave'e yükleyin.*
2. *JSON metadata'yı Arweave veya benzeri bir depolama hizmetine yükleyin.*
3. *NFT için bir hesap oluşturmak üzere metaplex'i çağırın.*

### Arweave'e Yükleyin

```typescript filename="upload-to-arweave.ts"
import fs from "node:fs";
import Arweave from "arweave";

(async () => {
  const arweave = Arweave.init({
    host: "localhost",
    port: 1984,
    protocol: "http",
    timeout: 20000,
    logging: false,
  });

  const host = arweave.getConfig().api.host;
  const port = arweave.getConfig().api.port;
  const protocol = arweave.getConfig().api.protocol;

  // Resmi Arweave'e yükleyin
  const data = fs.readFileSync("./code/nfts/upload-arweave/lowres-dog.png");

  const transaction = await arweave.createTransaction({
    data: data,
  });

  transaction.addTag("Content-Type", "image/png");

  // Yeni bir cüzdan oluşturmak yerine, dosya sisteminizden mevcut bir cüzdanı kullanabilirsiniz
  // üretim ortamlarında kullanışlıdır
  // const wallet = JSON.parse(fs.readFileSync("./code/nfts/upload-arweave/wallet.json", "utf-8"))
  const wallet = await arweave.wallets.generate();
  const address = await arweave.wallets.getAddress(wallet);
  console.log("adres:, ", address);

  await arweave.api.get(`/mint/${encodeURI(addr)}/10000000000000000`);
  await arweave.transactions.sign(transaction, wallet);

  const response = await arweave.transactions.post(transaction);
  console.log(response);

  const id = transaction.id;
  const imageUrl = id ? `${protocol}://${host}:${port}/${id}` : null;
  console.log("imageUrl", imageUrl);

  // Metadata'yı Arweave'e yükleyin

  const metadata = {
    name: "Özel NFT #1",
    symbol: "CNFT",
    description: "Özel NFT #1 hakkındaki bir açıklama",
    seller_fee_basis_points: 500,
    external_url: "https://www.customnft.com/",
    attributes: [
      {
        trait_type: "NFT türü",
        value: "Özel",
      },
    ],
    collection: {
      name: "Test Koleksiyonu",
      family: "Özel NFT'ler",
    },
    properties: {
      files: [
        {
          uri: imageUrl,
          type: "image/png",
        },
      ],
      category: "image",
      maxSupply: 0,
      creators: [
        {
          address: "CBBUMHRmbVUck99mTCip5sHP16kzGj3QTYB8K3XxwmQx",
          share: 100,
        },
      ],
    },
    image: imageUrl,
  };

  const metadataString = JSON.stringify(metadata);

  const metadataTransaction = await arweave.createTransaction({
    data: metadataString,
  });

  metadataTransaction.addTag("Content-Type", "application/json");

  await arweave.transactions.sign(metadataTransaction, wallet);

  console.log("metadata txid", metadataTransaction.id);

  const txnResult = await arweave.transactions.post(metadataTransaction);

  console.log(txnResult);
})();
```

### NFT'yi Mintleyin

```typescript filename="mint-nft.ts"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  percentAmount,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { clusterApiUrl } from "@solana/web3.js";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import "dotenv/config";

(async () => {
  try {
    console.log("Ortamdan anahtar çiftini yüklüyor...");
    const privateKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY || "[]");
    if (privateKey.length === 0) {
      throw new Error("SOLANA_PRIVATE_KEY .env dosyasında ayarlı değil");
    }

    console.log("Umi örneği oluşturuluyor...");
    const umi = createUmi(clusterApiUrl("devnet"));

    const keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(privateKey),
    );

    // Anahtar çiftini imzalayıcı olarak ayarlamak için keypairIdentity'i kullanın
    const signer = keypairIdentity(keypair);
    umi.use(signer);
    umi.use(mplTokenMetadata());

    console.log("Anahtar çifti yüklendi. Kamu anahtarı:", keypair.publicKey);

    console.log("Yeni mint adresi üretiliyor...");
    const mint = generateSigner(umi);

    console.log("NFT oluşturuluyor...");
    const { signature } = await createNft(umi, {
      mint,
      name: "Benim NFT",
      /// Bunu Arweave metadata URI'niz ile değiştirin
      uri: "https://ffaaqinzhkt4ukhbohixfliubnvpjgyedi3f2iccrq4efh3s.arweave.net/KUAIIbk6p8oo4XHRcq0U__C2r0mwQaNl0gQow4Qp9yk",
      maxSupply: 1,
      sellerFeeBasisPoints: percentAmount(0),
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
          verified: true,
        },
      ],
    }).sendAndConfirm(umi);

    console.log("NFT başarıyla oluşturuldu!");
    console.log("Mint adresi:", mint.publicKey);
    console.log("İşlem imzası:", signature);

    console.log("Dijital varlık alınıyor...");
    const asset = await fetchDigitalAsset(umi, mint.publicKey);
    console.log("Dijital Varlık:", asset);
  } catch (error) {
    console.error("Hata:", error);
    console.error("Yığın izleri:", error.stack);
  }
})();
```

---

:::tip
**Yardımcı İpuçları:**
- JSON metadata yüklemeden önce verilerinizi doğrulayın.
- Arweave'e yükleme sırasında süre aşımını kontrol edin.
:::

:::info
**Ekstra Bilgi:**
NFT'lerinizi mintlemeden önce, ARN değerlerinin doğru olduğundan emin olun; aksi takdirde hatalarla karşılaşabilirsiniz.
:::

:::warning
**Dikkat:**
Cüzdan bilgilerinizi asla paylaşmayın. Bu, varlıklarınızı riske atabilir.
:::

:::note
**İlginç Not:**
NFT'lerinizi oluştururken, topluluğunuzdan geri bildirim almak, daha iyi tasarımlar yaratmanıza yardımcı olabilir.
:::

:::danger
**Kritik Uyarı:**
Arweave üzerinde yapacağınız tüm işlemlerde, cüzdan veya anahtar bilgilerinizi kaybederseniz erişiminizi kaybedebilirsiniz.
:::