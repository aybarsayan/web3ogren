---
title: React ile Cüzdan Bağlama
sidebarSortOrder: 8
description:
  "Solana'daki her uygulama, kullanıcının cüzdanı ile bir bağlantı gerektirir. 
  Solana'daki cüzdanlara nasıl bağlanılacağını öğrenin."
---

Solana'nın [wallet-adapter](https://github.com/anza-xyz/wallet-adapter) kütüphanesi, istemci tarafında cüzdan bağlantılarını yönetmeyi kolaylaştırır. Tam bir rehber için, `NextJS uygulamasına Solana Wallet Adapter ekleyin` bağlantısına göz atın.

> web3.js v2 için lütfen [react örneğine](https://github.com/solana-labs/solana-web3.js/tree/master/examples/react-app) başvurun — [Anza Web3js v2 Blog](https://www.anza.xyz/blog/solana-web3-js-2-release).

## React ile Cüzdana Nasıl Bağlanılır

:::info
Mevcut olarak, `create-solana-dapp` yalnızca Solana Web3.js v1 ile çalışmaktadır.
:::

React ile hızlı kurulum için:

```bash
npx create-solana-dapp <app-name>
```

Manuel kurulum için, gerekli bağımlılıkları yüklemek üzere aşağıdaki komutu çalıştırın:

```bash
npm install --save \
    @solana/wallet-adapter-base \
    @solana/wallet-adapter-react \
    @solana/wallet-adapter-react-ui \
    @solana/wallet-adapter-wallets \
    @solana/web3.js@1 \
    react
```

`WalletProvider`, kullanıcının cüzdanına bağlanmak ve daha sonra işlemleri göndermek için ayarlanabilir.

```typescript
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Uygulamanız tarafından geçersiz kılınabilecek varsayılan stiller
require('@solana/wallet-adapter-react-ui/styles.css');

export const Wallet: FC = () => {
    // Ağ 'devnet', 'testnet' veya 'mainnet-beta' olarak ayarlanabilir.
    const network = WalletAdapterNetwork.Devnet;

    // Ayrıca özel bir RPC uç noktası da sağlayabilirsiniz.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                    { /* Uygulamanızın bileşenleri burada, bağlam sağlayıcıları içinde yer alır. */ }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
```

:::note
Bu örnekteki cüzdan bağlı olduğu ağ bilgilerini ayarlamayı unutmayın.
:::

---

### Önemli Not:
İşlemleri göndermeden veya cüzdan anahtarını yönetmeden önce mutlaka güvenlik ve en iyi uygulama ilkelerini göz önünde bulundurun.