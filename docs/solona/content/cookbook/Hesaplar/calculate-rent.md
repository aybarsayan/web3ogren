---
title: Hesap Oluşturma Maliyetini Nasıl Hesaplayabilirsiniz
sidebarSortOrder: 2
description:
  "Bir hesap oluşturduğunuzda, bu oluşturma belirli bir SOL tutarında bir maliyet taşır. Bir hesabın oluşturulurken ne kadar maliyeti olduğunu nasıl hesaplayacağınızı öğrenin."
---

Solana'da hesapları canlı tutmak, **kira** adı verilen bir depolama maliyetine neden olur. Hesapta saklamayı düşündüğünüz veri miktarını dikkate almanız gerekir. *Hesap kapandığında kira tamamen geri alınabilir.*

:::note
**Kira Hesaplama**: Hesap oluşturmadaki kira maliyetini anlamak, bütçe planlaması açısından kritik bir adımdır.
:::





```typescript filename="calculate-rent.ts"
import { createSolanaRpc } from "@solana/web3.js";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
// 1.5k bayt
const space = 1500n;

const lamports = await rpc.getMinimumBalanceForRentExemption(space).send();
console.log("Kira muafiyeti için minimum bakiye:", lamports);
```





```typescript
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// hesapta kira hesaplamak için bayt cinsinden veri uzunluğu
const dataLength = 1500;
const rentExemptionAmount =
  await connection.getMinimumBalanceForRentExemption(dataLength);
console.log({
  rentExemptionAmount,
});
```





:::tip
**İpucu**: Hesapta ne kadar veri saklayacağınızı doğru bir şekilde tahmin etmek, kira maliyetlerini etkileyen önemli bir faktördür.
:::

### Kira Maliyeti Hesaplama

Kira maliyetinizi hesaplamak için şu adımları izleyebilirsiniz:

1. **Veri Boyutunu Belirleyin**: Hesabınızda saklamak istediğiniz verilerin toplam boyutunu bayt cinsinden hesaplayın.
2. **Kira Miktarını Hesaplayın**: Yukarıda belirtilen kod örneklerinden birini kullanarak minimum bakiye için kira muafiyetini hesaplayın.

:::info
**Ek Bilgi**: Kira muafiyeti, yalnızca hesapta bulunan veriler için geçerlidir. Hesabınızı kullanmadığınızda, verileriniz silinebilir.
:::

:::warning
**Önemli Uyarı**: Veri oluştururken, doğru veri boyutunu girmediğiniz takdirde, gereksiz maliyetlerle karşılaşabilirsiniz.
:::

---