---
title: Bir cüzdandan tüm NFT'leri nasıl alabilirsiniz?
sidebarSortOrder: 18
description:
  "Solana'daki bir cüzdandan tüm fungible olmayan token'ları (NFT'leri) nasıl alacağınızı öğrenin."
---

:::info
Bu belgede, Solana cüzdanından nasıl NFT alabileceğiniz hakkında ayrıntılı bilgi bulacaksınız.
:::

```typescript filename="get-nfts-by-wallet.ts"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAllDigitalAssetWithTokenByOwner } from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl } from "@solana/web3.js";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

(async () => {
  try {
    // UMI örneği oluştur
    const umi = createUmi(clusterApiUrl("devnet"));

    // Sahibin genel anahtarı
    const ownerPublicKey = publicKey(
      "2R4bHmSBHkHAskerTHE6GE1Fxbn31kaD5gHqpsPySVd7",
    );

    console.log("NFT'ler alınıyor...");
    const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(
      umi,
      ownerPublicKey,
    );

    console.log(`Sahip için ${allNFTs.length} NFT bulundu:`);
    allNFTs.forEach((nft, index) => {
      console.log(`\nNFT #${index + 1}:`);
      console.log("Mint Adresi:", nft.publicKey);
      console.log("İsim:", nft.metadata.name);
      console.log("Sembol:", nft.metadata.symbol);
      console.log("URI:", nft.metadata.uri);
    });

    // Tüm NFT verilerine ihtiyacınız varsa
    console.log("\nTam NFT verileri:");
    console.log(JSON.stringify(allNFTs, null, 2));
  } catch (error) {
    console.error("Hata:", error);
  }
})();
```

:::tip
Bu script, cüzdan sahibi için tüm NFT'leri alma sürecini otomatikleştirir.
:::

### NFT Alma Süreci

1. **UMI Oluşturma**: 
   UMI'yi başlatmak için `createUmi` kullanılır.
   
   - Örnek: `const umi = createUmi(clusterApiUrl("devnet"));`

2. **Cüzdan Sahibi Anahtarı**:
   Cüzdan sahibinin genel anahtarını belirtin.

3. **NFT'leri Getirme**:
   `fetchAllDigitalAssetWithTokenByOwner` fonksiyonu ile NFT'ler alınır.

:::note
Cüzdan sahibi için bulunan NFT sayısı, `allNFTs.length` ile görüntülenir.
:::

#### Önemli Not
Cüzdanınızda mevcut olan tüm NFT'lerin tam listesini almak istiyorsanız, `JSON.stringify(allNFTs, null, 2)` kullanarak JSON formatında görüntüleyebilirsiniz.

:::warning
Cüzdan sahibi anahtarının doğruluğunu kontrol edin; hatalı bir anahtar, beklenmeyen sonuçlara yol açabilir.
:::

--- 

**Anahtar Çıkarımlar:**

> "Bu script, Solana cüzdanındaki NFT'leri verimli bir şekilde toplamak için güçlü bir araçtır."  
> — Geliştirici Rehberi