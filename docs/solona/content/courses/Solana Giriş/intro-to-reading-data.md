---
title: Solana Ağı'ndan Veri Okuma
objectives:
  - Hesapları ve adreslerini anlama
  - SOL ve lamportları anlama
  - web3.js kullanarak Solana'ya bağlanma ve hesap bakiyesini okuma
description:
  "TypeScript ile Solana DevNet'e bağlan ve blok zincirinden veri oku!"
---

## Özeti

- **SOL**, Solana'nın yerel token'ının adıdır. Her SOL, 1 milyar **Lamport**'tan oluşur.
- **Hesaplar**, token'ları, NFT'leri, programları ve verileri saklar. Şu an için, SOL saklayan hesaplara odaklanacağız.
- **Adresler**, Solana ağındaki hesapları işaret eder. Herkes, belirli bir adresteki verileri okuyabilir. Çoğu adres ayrıca **açık anahtar**dır.

---

# Ders

### Hesaplar

Solana üzerindeki tüm veriler hesaplarda saklanır. Hesaplar şunları saklayabilir:

- SOL
- USDC gibi diğer token'lar
- NFT'ler
- Bu kursta yapacağımız film inceleme programı gibi programlar!
- Yukarıdaki program için bir film incelemesi gibi program verileri!

### SOL

SOL, Solana'nın 'yerel token'ıdır - bu, SOL'un işlem ücretlerini, hesap kiralarını ve diğer yaygın ödemeleri karşılamak için kullanıldığı anlamına gelir. SOL bazen `◎` sembolü ile gösterilir. Her SOL, 1 milyar **Lamport**'tan oluşur.

:::info
Mali uygulamaların genellikle USD için sent ile ve GBP için pence ile hesaplama yaptığı gibi, Solana uygulamaları genellikle SOL'u Lamport olarak transfer eder, harcar, saklar ve yönetir; yalnızca kullanıcıya tam SOL göstermek için dönüştürür.
:::

### Adresler

Adresler benzersiz bir şekilde hesapları tanımlar. Adresler genellikle `dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8` gibi base-58 kodlu dizeler olarak gösterilir. Solana'daki çoğu adres aynı zamanda **açık anahtar**dır. Önceki bölümde bahsedildiği gibi, bir adres için eşleşen gizli anahtara sahip olan kişi, hesabı kontrol eder - örneğin, gizli anahtarına sahip olan kişi, hesabından token gönderebilir.

---

## Solana Blok Zincirinden Okuma

### Kurulum

Solana ile ilgili işlerin çoğunu yapmak için `@solana/web3.js` adında bir npm paketi kullanıyoruz. Ayrıca TypeScript ve `esrun` kuracağız, böylece `.ts` dosyalarını komut satırında çalıştırabiliriz:

```bash
npm install typescript @solana/web3.js@1 esrun
```

### Ağa Bağlan

`@solana/web3.js` kullanarak Solana ağıyla her etkileşim `Connection` nesnesi üzerinden gerçekleşecek. `Connection` nesnesi, belirli bir Solana ağı ile, 'küme' olarak adlandırılan bir bağlantı kurar. Şu an için, `Mainnet` yerine `Devnet` kümesini kullanacağız. `Devnet`, geliştirici kullanımı ve test için tasarlanmıştır ve `DevNet` token'larının gerçek bir değeri yoktur.

```typescript
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`✅ Bağlandı!`);
```

Bu TypeScript'i çalıştırmak (`npx esrun example.ts`) şu çıktıyı gösterir:

```
✅ Bağlandı!
```

### Ağı Okuma

Bir hesabın bakiyesini okumak için:

```typescript
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const address = new PublicKey("CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN");
const balance = await connection.getBalance(address);

console.log(`Hesabın ${address} adresindeki bakiyesi ${balance} lamport.`);
console.log(`✅ Tamamlandı!`);
```

Dönen bakiye, daha önce tartıştığımız gibi *lamport* cinsindendir. Web3.js, Lamport'ları SOL olarak göstermek için `LAMPORTS_PER_SOL` sabitini sağlar:

```typescript
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const address = new PublicKey("CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN");
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;

console.log(`Hesabın ${address} adresindeki bakiyesi ${balanceInSol} SOL.`);
console.log(`✅ Tamamlandı!`);
```

`npx esrun example.ts` çalıştırıldığında şöyle bir çıktı alırsınız:

```
Hesabın CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN adresindeki bakiyesi 0.00114144 SOL.
✅ Tamamlandı!
```

:::tip
...ve tam olarak böylece, Solana blok zincirinden veri okumayı başardık!
:::

## Uygulama

Öğrendiklerimizi uygulayalım ve belirli bir adresteki bakiyeyi kontrol edelim.

### Bir anahtar çiftini yükle

Önceki bölümden açık anahtarı hatırlayın.

`check-balance.ts` adında yeni bir dosya oluşturun ve `` kısmını kendi açık anahtarınızla değiştirin.

Script, açık anahtarı yükler, DevNet'e bağlanır ve bakiyeyi kontrol eder:

```typescript
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const publicKey = new PublicKey("<your public key>");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `💰 Tamamlandı! ${publicKey} adresindeki cüzdanın bakiyesi ${balanceInSOL}!`,
);
```

Bunu bir dosyaya kaydedin ve `npx esrun check-balance.ts` çalıştırın. Şöyle bir çıktı görmelisiniz:

```
💰 Tamamlandı! ${publicKey} adresindeki cüzdanın bakiyesi 0!
```

### Devnet SOL Al

Devnet'te geliştirme yapmak için ücretsiz SOL alabilirsiniz. Devnet SOL'i, değeri olmayan bir masa oyunu parası gibi düşünün - görünüşte değeri vardır ama gerçekte yoktur.

[Devnet SOL alın](https://faucet.solana.com/) ve anahtar çiftinizin açık anahtarını adres olarak kullanın.

İstediğiniz miktarda SOL seçin.

### Bakiyenizi Kontrol Edin

Scripti yeniden çalıştırın. Bakiyenizin güncellendiğini görmelisiniz:

```
💰 Tamamlandı! ${publicKey} adresindeki cüzdanın bakiyesi 0.5!
```

### Diğer Öğrencilerin Bakiyelerini Kontrol Edin

Scripti, herhangi bir cüzdanın bakiyesini kontrol etmek için değiştirebilirsiniz.

```typescript
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const suppliedPublicKey = process.argv[2];
if (!suppliedPublicKey) {
  throw new Error("Bakiyesini kontrol etmek için bir açık anahtar sağlayın!");
}

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const publicKey = new PublicKey(suppliedPublicKey);

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `✅ Tamamlandı! ${publicKey} adresindeki cüzdanın bakiyesi ${balanceInSOL}!`,
);
```

Cüzdan adreslerini arkadaşlarınızla sohbet kanalında paylaşın ve bakiyelerini kontrol edin.

```bash
% npx esrun check-balance.ts (bazı cüzdan adresi)
✅ Tamamlandı! ${publicKey} adresindeki cüzdanın bakiyesi 3!
```

Ve birkaç arkadaşınızın bakiyelerini kontrol edin.

## Challenge

Scripti aşağıdaki gibi değiştirin:

- Geçersiz cüzdan adreslerini yönetmek için talimatlar ekleyin.
- Scripti `mainNet`'e bağlanacak şekilde değiştirin ve bazı ünlü Solana cüzdanlarını kontrol edin. `toly.sol`, `shaq.sol` veya `mccann.sol` deneyin.

Bir sonraki derste SOL transfer edeceğiz!

---


Kodunuzu GitHub'a yükleyin ve
[bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=8bbbfd93-1cdc-4ce3-9c83-637e7aa57454)!
