---
title: Hesap Bakiyesi Alma
sidebarSortOrder: 6
description:
  "Solana'daki her hesapta saklanan bir SOL bakiyesi vardır. Bu hesap bakiyesini
  Solana'da nasıl alacağınızı öğrenin."
---





```typescript filename="get-account-balance.ts"
import { address, createSolanaRpc } from "@solana/web3.js";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const LAMPORTS_PER_SOL = 1_000_000_000; // 1 milyar lamport bir SOL'dir

const wallet = address("nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c");
const { value: balance } = await rpc.getBalance(wallet).send();
console.log(`Bakiye: ${Number(balance) / LAMPORTS_PER_SOL} SOL`);
```

> `v2.0.0` itibarıyla, geliştiriciler ana kütüphane içinde varsayılan
> yapılandırmaları kullanabilirler (`@solana/web3.js`) veya daha iyi
> kompozisyon veya daha ayrıntılı kontrol için herhangi bir alt paketi
> içe aktarabilirler. Daha fazla bilgi için
> [Tree-Shakability](https://github.com/solana-labs/solana-web3.js?tab=readme-ov-file#tree-shakability)
> sayfasına bakın.

:::info
Bu yöntemleri kullanarak hesap bakiyenizi alabilir ve Solana üzerindeki işlemlerinizde
bakiye kontrolü yapabilirsiniz.
:::





```typescript filename="get-account-balance.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const wallet = new PublicKey("nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c");

const balance = await connection.getBalance(wallet);
console.log(`Bakiye: ${balance / LAMPORTS_PER_SOL} SOL`);
```

> Bu kod parçası, Solana ağındaki bir hesabın bakiyesini almanın
> temel bir örneğidir. 

:::warning
Hesap adresinizi doğru bir şekilde girdiğinizden emin olun; aksi takdirde
gerçek hiçbir bakiye elde edemezsiniz.
:::





:::note
Unutmayın ki, Solana ağı üzerinde işlem yaparken her zaman en güncel
belge ve geliştirici bilgilerine başvurmalısınız.
:::