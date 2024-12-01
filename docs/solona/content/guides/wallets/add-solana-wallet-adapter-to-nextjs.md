---
date: 2024-04-01T00:00:00Z
difficulty: intro
title: "NextJS Uygulamasına Solana Cüzdan Adaptörü Eklemek"
description:
  "Bu kılavuz, Solana cüzdan adaptörünü NextJS'e entegre etme sürecinden
  geçmenize ve uygulamanızda Solana cüzdanlarını kullanmanıza yardımcı olacaktır."
tags:
  - React
  - NextJS
  - javascript
  - cüzdanlar
keywords:
  - cüzdan adaptörü
---

Bu kılavuz, Solana cüzdan adaptörünü NextJS'e entegre etme sürecinden geçmenize ve uygulamanızda Solana cüzdanlarını kullanmanıza yardımcı olacaktır.

Şunları kapsayacağız:

- Yeni bir Next.js projesi oluşturma
- Solana cüzdan adaptörü bağımlılıklarını yükleme
- Next.js uygulamanızda Solana cüzdan adaptörünü kurma
- Bir cüzdanı bağlama butonu ekleme
- `useConnection` ve `useWallet` kancalarını kullanarak diğer Next.js sayfalarında cüzdan bağlamasını kullanma

> **Not:** Solana cüzdan adaptörü, önceden yapılandırılmış bir hızlandırılmış üretim NextJS projesi hızlı bir şekilde oluşturmanıza olanak tanır. Bunu, `npx create-solana-dapp@latest` CLI aracı kullanarak yapabilirsiniz. Bu araç, özel bir Solana dApp iskeleti oluşturmanıza olanak tanır ve özelleştirilmiş mantığınızı eklemeniz için hazırda bekleyen önceden yapılandırılmış Solana program şablonları içerir.

## 1. Next.js Projesi Oluşturma

Next.js, tam yığın web uygulamaları geliştirmek için bir React çerçevesidir. Kullanıcı arayüzlerini oluşturmak için React bileşenlerini ve ek özellikler ve optimizasyonlar için Next.js'i kullanırsınız.

:::tip
Bir Next.js uygulaması oluşturmak için [Node.js'i yüklemeniz](https://nodejs.org/en/download) gerekecektir.
:::

Bize temel bir iskelet oluşturacak bu komutu çalıştırabiliriz:

```bash
npx create-next-app@latest
```

Proje adı, Typescript, ESlint, Tailwind CSS, src dizini, App yönlendiricisini kullanma ve varsayılan içe aktarma takma adını özelleştirme gibi konularda sizden sorular soracaktır. Bu kılavuz için şu anda varsayılan ve önerilen tüm seçenekleri kullanacağız; App yönlendiricisini de dahil.

İskeleti oluşturduktan sonra dizin yapısı şöyle görünecektir:

```
├── src
│   └── app
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
```

## 2. Solana Cüzdan Adaptörünü Yükleme

Uygulamanız kullanıcılarının kendi favori Solana cüzdanlarını bağlayabilmesi için, çeşitli Solana cüzdan adaptörü paketlerini yükleyip kullanmamız gerekecek. Bu paketler, Solana cüzdanlarını NextJS uygulamamıza entegre etmek için gereken temel işlevleri, kancaları ve React bileşenlerini içerir.

Daha iyi bir bileşen oluşturulabilirliği ve daha küçük üretim yapılarını sağlamak için "standart cüzdan adaptörü" işlevselliği birkaç farklı pakete bölünmüştür:

- `@solana/wallet-adapter-base`, kullanıcının yüklediği cüzdanları tespit eden ve cüzdandan işlem imzalayan/gönderen işlevler içerir.
- `@solana/wallet-adapter-react`, kullanıcının cüzdan durumunu yönetmeye yardımcı olacak işlevsellik içerir ve `useConnection` ve `useWallet` gibi kancalara erişim sağlar.
- `@solana/wallet-adapter-react-ui`, cüzdan işlemleriyle ilgili birkaç temel UI bileşeni sağlar; bunlar arasında cüzdan bağla/ayır butonu ve cüzdan seçim modalının bağlamları ile sağlayıcıları bulunur.

:::warning
Bu paketleri, tercih ettiğiniz node paket yöneticisini kullanarak Next.js projenize yükleyin:
:::

```shell
npm install @solana/web3.js@1 \
    @solana/wallet-adapter-base \
    @solana/wallet-adapter-react \
    @solana/wallet-adapter-react-ui \
    @solana/wallet-adapter-wallets
```

## 3. Next.js Uygulamanızda Cüzdan Adaptörü Kurma

Bu bölüm, Next.js uygulamanızı gelecek sayfalarınızda Solana cüzdan özelliklerini kullanabilmeniz için ayarlamanıza yardımcı olacaktır.

Bir `components` klasörü oluşturun ve `AppWalletProvider.tsx` adında bir dosya ekleyin. Bu dosyanın içeriğini, [kök düzen dosyasında](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts) kullanılmak üzere dışa aktaracağız.

Klasör yapınız şöyle görünmelidir:

```
├── src
│   └── app
│       ├── components
│       │   └── AppWalletProvider.tsx
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
```

### AppWalletProvider.tsx

Bu dosyanın amacı, tüm bağlamın alt bileşenlerinde kullanılacak verileri "teleport" etmeye yardımcı olacak bir [bağlam sağlayıcı](https://react.dev/learn/passing-data-deeply-with-context) olarak bir React bileşeni dışa aktarmaktır. Bu, bu bağlamın çocuklarının tüm Solana cüzdan adaptörü işlevselliğine kolay erişim sağlamasına ve uygulamanız içinde kullanıcı cüzdan etkileşimlerini kolaylaştırmasına olanak tanır.

> **Not:** Oluşturduğumuz bu `AppWalletProvider.tsx` dosyası, **istemci tarafında** sunulacaktır, SUNUCU tarafında değil. Bu nedenle, NextJS'in bağlamımızı ve çocuk bileşenlerimizi istemci tarafında oluşturmak için dosyanın üst kısmına `"use client"` direktifini eklememiz gerekiyor.

İlk olarak, dosyaya tüm bağımlılıkları içe aktarmamız gerekecek; bunun yanında `connectionProvider` ve `WalletProvider` gibi cüzdan adaptörü paketlerinden standart bağlam sağlayıcılarını da ekleyeceğiz.

- `WalletAdapterNetwork`, `mainnet-beta`, `testnet` ve `devnet` gibi varsayılan ağ değerlerini tanımlayan bir enum'dur.
- `@solana/wallet-adapter-base` içindeki `WalletModalProvider`, "cüzdanı bağla" butonunun bağlamını içerir. Bu buton, kullanıcılarınızın uygulamanıza bağlanmak için Solana cüzdanlarını seçmelerine olanak tanıyan cüzdan bağlama modal bileşeninin görünürlüğünü değiştirmelerine yardımcı olur.
- `UnsafeBurnerWalletAdapter`, cüzdanları test etmek için cüzdan adaptörü bakımcıları tarafından sunulan bir React bileşenidir. Bu Burner Wallet, başlangıç paketlerinde kullanılan varsayılan cüzdan adaptörüdür. Bu adaptör, Cüzdan Adaptörü arayüzünü uygular ancak mesajları imzalamak için güvensiz bir yerel anahtar çifti kullanır.

Standart cüzdan adaptörü UI bileşenlerini kullandığımızdan, bu React bileşenlerinin düzgün bir şekilde görüntülenmesi için gerekli standart CSS stillerini içe aktarmamız gerekecek. Bu stillerin her biri kolayca özelleştirilebilir.

:::note
Bu bağımlılıkları içe aktaralım ve kurduğumuz bağlam/sağlayıcı bileşeninde daha fazla kullanmayı amaçlayalım:
:::

```tsx filename=AppWalletProvider.tsx
"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
// import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

// Varsayılan stiller, uygulamanız tarafından değiştirilebilir
require("@solana/wallet-adapter-react-ui/styles.css");
```

### Desteklenen cüzdanlar ve "cüzdan standartı"

Uygulamanız içinde kullanıcıların kullanmak isteyeceği çeşitli Solana cüzdanlarını desteklemenin iki yolu vardır:

1. [Cüzdan-standart](https://github.com/wallet-standard/wallet-standard) uygulamasına sahip cüzdanlar. Bu cüzdanlar, `@solana/wallet-adapter-base` ile otomatik tespit edilir ve kullanıcıların uygulamalarında kullanmaları için ek bir kod eklemenizi gerektirmez.
2. [Eski cüzdan adaptörleri](https://github.com/anza-xyz/wallet-adapter/blob/master/PACKAGES.md#wallets) ile cüzdanlar, bir npm paketine dahil edilmiştir. Bu cüzdanları uygulamanızda desteklemek için, her bir cüzdanın eski adaptörünü yükleyip uygulamanıza dahil etmeniz gerekecektir.

:::info
En popüler Solana cüzdanları, zaten `cüzdan-standart`'a uymaktadır ve uygulamanız içinde bu popüler Solana cüzdanlarını kullanmak için özel bir şey yapmanıza gerek yoktur. Otomatik olarak çalışacaklar ve kullanıcılarınıza gösterilecektir (aşağıdaki
[Solana Mobil Stack Cüzdan Adaptörü](https://www.notion.so/Integrate-solana-wallets-to-your-NextJS-webapp-60e34961b0174982859b4cb9973b2723?pvs=21) dahil).
Eğer kullanıcılarınızın uygulamanızda desteklemesini istediği belirli, standart dışı bir cüzdan varsa, o zaman eski adaptörünü manuel olarak eklemeyi öneriyoruz.
:::

### AppWalletProvider'ı Ayarlama

`AppWalletProvider` bileşenimiz, istediğimiz RPC uç noktası aracılığıyla istenen Solana ağ kümesine (yani `devnet`, `mainnet-beta` vb.) bağlantıyı sağlamak için kullanılacaktır. Bu RPC uç noktası, uygulamamızın işlemleri göndereceği yerdir. Buradaki kılavuzda, `devnet` ağ kümesini kullanacak şekilde kodlanmıştır.

Bu örnekte ayrıca, `wallets` adında bir dizi tanımlıyoruz. Bu dizi, uygulamanızda ithal edip desteklemek istediğiniz herhangi bir eski cüzdan adaptör cüzdanını içermektedir. Ancak, muhtemelen bu dizide herhangi bir girişe ihtiyacınız yok.

```tsx filename=AppWalletProvider.tsx
// buraya ithalatlar

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      // burada eski cüzdan adaptörlerini manuel olarak ekleyin
      // new UnsafeBurnerWalletAdapter(),
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

:::tip
`endpoint` ve `wallets` değişkenlerini cüzdan adaptörü paketleri tarafından sağlanan `ConnectionProvider` ve `WalletProvider`'a prop olarak geçiriyoruz. `autoConnect` prop'u, uygulamanızın bir kullanıcının uygulamanız yüklendiğinde daha önce bağlı olduğu cüzdana otomatik bağlanma girişiminde bulunup bulunmayacağını belirler.

`WalletModalProvider`, kullanıcılara mevcut ve yüklenmiş cüzdanlar listesinden seçim yapmalarına yardımcı olan `WalletModal` adlı bir bileşene sahiptir. Bu sağlayıcı, çocuk bileşenlerinde bu modalın görünürlüğünü kontrol etmeye yardımcı olur.
:::

### Uygulamanızı AppWalletAdapter ile Sarmalama

`AppWalletAdapter` bağlamımız ayarlanmış ve kullanıma hazır olduğuna göre, uygulamamızı bu bağlamla sarmalayarak API'lerinin, kancalarının ve durumunun uygulamamızın geri kalanında ve çocuk sayfalarda erişilebilir olmasını sağlamalıyız.

Kök `layout.tsx` dosyanız içinde `AppWalletAdapter` sağlayıcınızı içe aktarın ve uygulamanızın `children`'larını `AppWalletAdapter` bileşeninin çocukları olarak geçirin:

```tsx filename=src/app/layout.tsx
import AppWalletProvider from "./components/AppWalletProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
```

:::danger
Yukarıdaki adımları tamamladıktan ve `AppWalletAdapter` düzgün bir şekilde ayarlandıktan sonra, NextJS uygulamanız kullanıcı cüzdanlarıyla etkileşimde bulunmaya hazırdır.
:::

## 4. Cüzdanı Bağlama Butonu

"Cüzdanı Bağla" butonu, kullanıcıların "cüzdan seç modalını" açmasına ve uygulamanıza bağlanmak için istedikleri Solana cüzdanını seçmelerine olanak tanıyan yaygın bir bileşendir.

Geliştiriciler genellikle bu cüzdan bağlama butonu bileşenini, bağlama butonunun görünür ve erişilebilir olmasını sağlamak için temel üst öğe bileşenlerine eklerler. Bu, kullanıcıların uygulamanızın herhangi bir yerinde cüzdanlarını kolayca bağlamalarını sağlarken. Ancak, bu kılavuzun basitliği için, cüzdan bağlantısını ana sayfaya ekliyoruz:

`app` klasörünüzün kökünde bulunan `page.tsx` dosyanızda, `@solana/wallet-adapter-react-ui`'dan `WalletMultiButton`'ı içe aktarın. Ardından, bu buton bileşenini ana sayfa bileşeninizden döndürebilirsiniz.

```tsx filename=src/app/page.tsx
"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded">
        <WalletMultiButton style= />
      </div>
    </main>
  );
}
```

:::note
Şimdi geliştirme sunucunuzu başlatın ve web sitenizin tarayıcınızda sunulduğunu görün:
:::

```bash
❯ npm run dev

> my-app@0.1.0 dev
> next dev

   ▲ Next.js 14.1.3
   - Local:        http://localhost:3000

 ✓ Ready in 3.1s
```

Aşağıda, cüzdan adaptörü paketlerinden sağlanan varsayılan stillerle birlikte tarayıcınızdaki çıktının nasıl görünmesi gerektiğine dair bir demo bulunmaktadır:

![Select and Connect Solana Wallets using Wallet Adapter](../../../images/solana/public/assets/guides/integrate-solana-wallets-into-nextjs/connect-solana-wallets.gif)

## 5. useWallet ve useConnection Kancaları

Uygulamanızın, kullanıcıların Solana cüzdanlarıyla etkileşimi genellikle `useWallet` ve `useConnection` kancaları aracılığıyla gerçekleşir; bu kancalar cüzdan adaptörü paketleri tarafından sağlanır ve `AppWalletAdapter` bağlamınızın tüm çocuk bileşenlerine erişilebilir.

@solana/wallet-adapter-react paketinden, uygulamanızın istemci tarafında `AppWalletAdapter` bağlamının bir çocuğu olan her yerde kullanılabilen `useWallet` ve `useConnection` adı verilen iki kancayı içe aktarabilirsiniz. Bu örnekte, bu kancalar tüm uygulamanız için geçerlidir.

- `useWallet` kancası, cüzdanın `publicKey`'si gibi detayları ve cüzdanın `bağlanıyor` mu yoksa `bağlı` mı olduğunu içerir.
- `useConnection` kancası, uygulamanızın Solana blockchain'ine RPC uç noktanız aracılığıyla bağlanmasını sağlar.

> **Not:** Solana, [JSON-RPC 2.0 spesifikasyonunu](https://solana.com/docs/rpc) kullanır; bu, taşımaya bağımlı değildir ve HTTP, HTTPS, WebSocket, TCP ve diğer taşıma yöntemleri üzerinden uygulanabilir. Bu, `useConnection` kancası tarafından döndürülen `connection` nesnesini kullanarak [WebSocket bildirimleri](https://solana.com/docs/rpc/websocket) veya [HTTP istekleri gönderebileceğiniz](https://solana.com/docs/rpc/http) anlamına gelir.

### Airdrop Gerçekleştirme

İşte `useConnection` ve `useWallet` kancalarından `connection` ve `publicKey`'yi kullanarak bir [devnet SOL airdrop'u](https://solana.com/developers/guides/getstarted/solana-token-airdrop-and-faucets) almanın bir örneği.

Bu `getAirdropOnClick` fonksiyonu, [blockhash](https://solana.com/docs/core/transactions/confirmation#what-is-a-blockhash) almak için [`getLatestBlockhash`](https://solana.com/docs/rpc/http/getlatestblockhash) RPC yöntemini kullanır. Ayrıca, `connection` üzerinden [`requestAirdrop`](https://solana.com/docs/rpc/http/requestairdrop#parameters) fonksiyonu ile işlem imzasını alır. Airdrop'un başarılı olduğunu ve SOL'un kullanılabilir olduğunu garanti etmek için işlemin [doğrulandığını](https://solana.com/docs/rpc#configuring-state-commitment) ve bloğa eklendiğini doğrulayabiliriz.

```tsx
const { connection } = useConnection();
const { publicKey } = useWallet();

const getAirdropOnClick = async () => {
  try {
    if (!publicKey) {
      throw new Error("Cüzdan Bağlı Değil");
    }
    const [latestBlockhash, signature] = await Promise.all([
      connection.getLatestBlockhash(),
      connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL),
    ]);
    const sigResult = await connection.confirmTransaction(
      { signature, ...latestBlockhash },
      "confirmed",
    );
    if (sigResult) {
      alert("Airdrop onaylandı!");
    }
  } catch (err) {
    alert("Airdrop için oran sınırına sahipsiniz");
  }
};
```

### Cüzdan Bakiyesi Alma

İşte `useConnection` ve `useWallet` kancalarını kullanarak bağlı cüzdanın SOL bakiyesini almanın bir örneği.

[`getBalance`](https://solana.com/docs/rpc/http/getbalance#parameters), `connection` nesnesinden herhangi bir Solana hesabının (bir kullanıcının cüzdanı gibi) SOL bakiyesini almak için çağırabileceğiniz bir RPC HTTP yöntemidir. Bu fonksiyonu `setTimeout` ile çağırmak, her 10 saniyede bir bakiyeyi sürekli kontrol etmek için uygundur:

```tsx
const [balance, setBalance] = useState<number>(0);

useEffect(() => {
  if (publicKey) {
    (async function getBalanceEvery10Seconds() {
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
      setTimeout(getBalanceEvery10Seconds, 10000);
    })();
  }
}, [publicKey, connection, balance]);
```

### Bir Sayfada Cüzdan ile Etkileşim

Bu tür işlevlerle ve cüzdan adaptörü paketlerinde sağlananlarla, kullanıcının cüzdanının bağlı olup olmadığını tespit edebilir, bağlanılan ağda devnet veya SOL almak için bir buton oluşturabilir ve daha fazlasını yapabilirsiniz.

Artık bu kancaları ve yukarıda tartıştığımız özel işlevleri kullanarak kullanıcıların istedikleri Solana cüzdanlarıyla etkileşime girmelerini sağlamak için yeni bir sayfa oluşturalım:

`app` klasörü içinde bir klasör oluşturun ve adını `address` koyun. O klasör içinde `page.tsx` adında bir dosya oluşturun. Bu örnekte, yeni sayfamız `src/app/address/page.tsx` konumunda olacaktır:

```bash
├── src
│   └── app
│       ├── address
│       │   └── page.tsx
│       ├── components
│       │   └── AppWalletProvider.tsx
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
```

Yeni sayfanız içinde, kullanıcıya, Solana cüzdanlarıyla etkileşime girmesi için yukarıda tartıştığımız işlevleri ve kancaları kullanarak oluşturduğumuz kodu ekleyelim:

```tsx filename=src/app/address/page.tsx
"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function Address() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  // buraya `getAirdropOnClick` fonksiyonu için kod

  // buraya `getBalanceEvery10Seconds` ve useEffect kodu

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      {publicKey ? (
        <div className="flex flex-col gap-4">
          <h1>Public anahtarınız: {publicKey?.toString()}</h1>
          <h2>Bakiyeniz: {balance} SOL</h2>
          <div>
            <button
              onClick={getAirdropOnClick}
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Airdrop Al
            </button>
          </div>
        </div>
      ) : (
        <h1>Cüzdan bağlı değil</h1>
      )}
    </main>
  );
}
```

:::info
Ana sayfada cüzdan bağlandığında adres sayfanızın görünümü aşağıdaki gibi olacaktır.
:::

![Example "address" page that uses the Solana wallet adapter hooks](../../../images/solana/public/assets/guides/integrate-solana-wallets-into-nextjs/address-page.png)

## Sonraki Adımlar

- `useWallet` kancasını kullanarak, kullanıcının bağlı Solana cüzdanını işlem imzalamak veya uygulamanın sağladığı düz bir mesajı imzalamalarını istemek için tetikleyebilirsiniz.

- `connection` nesnesinden (via the `useConnection` hook) [herhangi bir RPC yöntemini](https://solana.com/docs/rpc) çağırabilirsiniz.

- Ayrıca, [Jupiter](https://jup.ag) yaratıcılarının sağladığı [Unified Wallet Kit](https://unified.jup.ag/) ile göz atabilirsiniz. Bu, geliştiricilere en iyi Solana cüzdan entegrasyon deneyimini sağlamak ve kullanıcılarınız için en iyi cüzdan deneyimini sunmayı hedefleyen açık kaynaklı bir cüzdan adaptörü alternatifidir.

Yeni bir uygulama veya proje oluşturuyorsanız, kullanıcılarınız için önceden yapılandırılmış Solana cüzdan adaptörü içeren bir iskelet oluşturmak için `create-solana-dapp` CLI aracını da kullanabilirsiniz. Yeni bir uygulama oluşturmak için terminalinizde CLI aracını çalıştırın:

```shell
npx create-solana-dapp@latest
```

Sizden ortak bilgileri (proje adı ve istenen ön yüz çerçevesi gibi) istemekte ve ardından kullanıcılarınız için tamamen yapılandırılmış, Solana cüzdan adaptörü ile hazır bir özel proje oluşturacaktır.