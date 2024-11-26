---
title: Token Mint Nasıl Alınır
sidebarSortOrder: 2
description:
  "Solana token mint bilgilerini, arz, yetki ve ondalık sayısını nasıl alacağınızı öğrenin."
---

Bir tokenın mevcut arzını, yetkisini veya ondalık sayısını almak için, token mint'in hesap bilgilerini almanız gerekmektedir.

:::info
**Not:** Mint bilgileri, token'ın doğru bir şekilde yönetilmesi için kritik öneme sahiptir.
:::

```typescript filename="get-mint-account.ts"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const mintAccountPublicKey = new PublicKey(
    "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV",
  );

  let mintAccount = await getMint(connection, mintAccountPublicKey);

  console.log(mintAccount);
  /*
  {
    address: PublicKey {
      _bn: <BN: 7351e5e067cc7cfefef42e78915d3c513edbb8adeeab4d9092e814fe68c39fec>
    },
    mintAuthority: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    },
    supply: 0n,
    decimals: 8,
    isInitialized: true,
    freezeAuthority: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    }
  }
  */
})();
```

:::tip
Mint hesap bilgilerini alırken doğru bir `PublicKey` kullanmak önemlidir.
:::

:::warning
**Dikkat:** Yanlış bir mint adresi kullanıldığında, geçersiz sonuçlar alabilirsiniz.
:::

:::note
Token'ın arza ve ondalık sayısı, uygulama geliştirme aşamasında göz önünde bulundurulmalıdır.
:::

## Mint Hesap Bilgilerine Erişim

### Mevcut Arz
Mint hesabı ile mevcut arz bilgilerine ulaşabilirsiniz. Bu bilgi genellikle token'ın işlem hacmiyle ilişkilidir.

### Yetki Bilgisi
Mint hesap bilgileri, token'ın kim tarafından yaratıldığını belirten yetki bilgilerini içerir. Bu bilgiyi almak, token yönetiminde kritik rol oynar. 

### Ondalık Sayısı
Bir tokenın ondalık sayısı, kullanıcıların her bir token parçasını nasıl kullanabileceğini belirler. Ondalık sayısı düşük olan tokenlar daha az bölünebilirken, yüksek olanlar daha fazla esneklik sağlar.

---

:::info
**Önemli:** Bu kod örneği, sadece `devnet` üzerinde çalışmaktadır. Üretim ortamında farklı bir ağ kullanılabilir.
:::