---
title: NFT Meta Verilerini Nasıl Alırsınız
sidebarSortOrder: 16
description:
  "Solana'da bir değiştirilemez token'ın (NFT) meta verilerini nasıl alacağınızı öğrenin."
---

:::info
NFT meta verilerini almak, NFT projelerinde önemli bir adımdır. Bu, projenizin özgünlüğünü ve değerini belirlemeye yardımcı olabilir.
:::

```typescript filename="get-nft-metadata.ts"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import {
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@metaplex-foundation/js";

(async () => {
  try {
    // UMI örneği oluşturun
    const umi = createUmi("https://api.mainnet-beta.solana.com");

    // mplTokenMetadata eklentisini kullanın
    umi.use(mplTokenMetadata());

    // Yeni bir anahtar çifti oluşturun (gerekirse kendi anahtar çiftinizle değiştirebilirsiniz)
    const keypair = generateSigner(umi);
    umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

    // Almak istediğiniz NFT'nin mint adresi
    const mintAddress = new PublicKey(
      "Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK",
    );

    console.log("NFT meta verilerini alıyor...");
    const asset = await fetchDigitalAsset(umi, mintAddress);

    console.log("NFT Meta Verileri:");

    // Eğer belirli meta veri alanlarına erişmek istiyorsanız:
    console.log("\nİsim:", asset.metadata.name);
    console.log("Sembol:", asset.metadata.symbol);
    console.log("URI:", asset.metadata.uri);

    // JSON meta verilerini al ve logla
    if (asset.metadata.uri) {
      const response = await fetch(asset.metadata.uri);
      const jsonMetadata = await response.json();
      console.log("\nJSON Meta Verileri:");
      console.log(JSON.stringify(jsonMetadata, null, 2));
    }
  } catch (error) {
    console.error("Hata:", error);
  }
})();
```

:::tip
Yukarıdaki kod örneği, Solana üzerindeki NFT'lerin meta verilerine erişmenin temel bir yolunu göstermektedir.   
:::


Daha Fazla Bilgi

- NFT meta verileri genellikle JSON formatında tutulur.
- Meta veriler, görüntü, isim, sembol ve diğer bilgiler içerebilir.



:::warning
API anahtarını güvenli bir şekilde saklamayı unutmayın. Açık olarak paylaşmak, hesabınızın güvenliğini tehlikeye atabilir.
:::

--- 

:::note
Her bir NFT'nin benzersiz bir "mint address" ile temsil edildiğini unutmayın. Bu adres, özel ve güvenli bir bilgi olarak düşünülmelidir.
:::

:::danger
Bir hata oluşursa, hata mesajını dikkatlice inceleyin; bu, sorunları çözmenize yardımcı olabilir.
:::