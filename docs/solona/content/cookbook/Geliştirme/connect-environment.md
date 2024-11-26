---
title: Solana Ortamına Bağlanma
sidebarSortOrder: 2
description: "Solana ortamına nasıl bağlanacağınızı öğrenin."
---

## Solana Geliştirmesi

Solana geliştirmesi yaparken, belirli bir RPC API son noktasına bağlanmanız gerekecek. Solana'nın **üç** halka açık geliştirme ortamı vardır:

- **mainnet-beta**: [https://api.mainnet-beta.solana.com](https://api.mainnet-beta.solana.com)
- **devnet**: [https://api.devnet.solana.com](https://api.devnet.solana.com)
- **testnet**: [https://api.testnet.solana.com](https://api.testnet.solana.com)

:::info
Hangi ortamı kullanmanız gerektiğine bağlı olarak seçiminizi yapabilirsiniz.
:::

```typescript filename="connect-to-environment.ts"
import { clusterApiUrl, Connection } from "@solana/web3.js";

(async () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
})();
```

---

## Özel Kümelere Bağlanma

Son olarak, bir yerel veya uzaktan çalışan özel bir kümeye de aşağıdaki gibi bağlanabilirsiniz:

```ts
import { Connection } from "@solana/web3.js";

(async () => {
  // Bu, sizi yerel doğrulayıcınıza bağlayacaktır
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
})();
```

:::tip
Yerel bir bağlantı kurarken kullanılacak doğru portu kontrol edin.
:::

:::warning
Uzak bir sunucuya bağlanıyorsanız, bağlantı bilgilerinin doğru olduğundan emin olun.
:::


Daha Fazla Bilgi

Bağlantı kurarken, doğrudan doğrulayıcıya bağlantı kurmanın yanı sıra API anahtarları veya kimlik doğrulama bilgileri gerektirebilecek hizmetleri de kullanabilirsiniz. Bu durumda belgelere başvurmanız faydalı olacaktır.



---

> **Unutmayın:** Her geliştirme ortamı farklı özellikler ve kısıtlamalar sunar. Hangi ortamda çalıştığınıza dikkat edin. 
> — Solana Geliştirme Ekibi