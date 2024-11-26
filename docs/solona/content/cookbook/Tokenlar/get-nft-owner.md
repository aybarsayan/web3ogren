---
title: Bir NFT'nin sahibini nasıl alabilirsiniz
sidebarSortOrder: 17
description:
  "Solana üzerinde bir değiştirilemez tokenin (NFT) sahibini nasıl alacağınızı öğrenin."
---

Eğer bir NFT'nin mint anahtarına sahipseniz, o mint anahtarı için en büyük token hesabına göz atarak mevcut sahibini bulabilirsiniz.

:::note
NFT'lerin bir tedarike sahip olduğunu ve bölünemez olduklarını unutmayın, yani o tokenin yalnızca bir token hesabı o anda o tokeni tutacak, diğer tüm token hesapları için ise bakiyenin 0 olacağı anlamına gelir.
:::

En büyük token hesabı belirlendikten sonra, sahibini alabiliriz.

```typescript filename="get-nft-owner.ts"
import { Connection, PublicKey } from "@solana/web3.js";

(async () => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const tokenMint = "9ARngHhVaCtH5JFieRdSS5Y8cdZk2TMF4tfGSWFB9iSK";

  const largestAccounts = await connection.getTokenLargestAccounts(
    new PublicKey(tokenMint),
  );
  const largestAccountInfo = await connection.getParsedAccountInfo(
    largestAccounts.value[0].address,
  );
  console.log(largestAccountInfo?.value?.data);

  const owner = largestAccountInfo?.value?.data?.parsed.info.owner;
  console.log("NFT sahibi :", owner);
})();
```

:::tip
Aşağıdaki adımları takip etmek, NFT sahibini doğru bir şekilde almanıza yardımcı olacaktır:
1. Mint anahtarını edinin.
2. En büyük token hesabını sorgulayın.
3. Sahibi bulmak için hesap bilgilerini çözümleyin.
:::

Bu süreçte dikkat edilmesi gereken bazı noktalar bulunmaktadır:

:::warning
Eğer mint anahtarı yanlışsa veya NFT mevcut değilse, başarıyla owner bilgisini alamazsınız. 
:::

:::info
NFT sahibiyle ilgili bilgileri almak için güçlü bir API bağlantısına ihtiyacınız vardır. Genellikle, ana ağda test etmeniz önerilir.
:::

NFT'yi sorguladıktan sonra, elde ettiğiniz bilgileri kullanarak varlıkların yönetimini sağlayabilirsiniz. 

Sonuç: NFT kişinin sahibi olduğunda, bu bilgi, dijital varlıkların alım-satım işlemlerinde kritik bir rol oynar.

:::quote
“En büyük token hesabını bulmak, NFT sahipliğini doğrulamak için temel bir adımdır.”  
— Uzman Görüşü
:::