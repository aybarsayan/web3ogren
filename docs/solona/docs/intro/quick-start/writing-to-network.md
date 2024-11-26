---
sidebarLabel: Ağa Bağlanmak
title: Ağa Bağlanmak
sidebarSortOrder: 2
description:
  Solana ağı ile etkileşim kurmayı, işlemler ve talimatlar göndererek öğrenin.
  SOL tokenlerini aktarmak ve Sistem Programı ile Token Uzantıları Programı kullanarak
  yeni tokenler oluşturmak için adım adım örnekleri takip edin.
---

Artık Solana ağından okuma konusunu keşfettiğimize göre, ona veri yazmayı öğrenelim. Solana'da, ağla etkileşim kurarak talimatlardan oluşan işlemler gönderiyoruz. Bu talimatlar, hesapların nasıl güncellenmesi gerektiğine dair iş mantığını içeren programlar tarafından tanımlanır.

**İki yaygın işlemi**, SOL transferi ve bir token oluşturmayı inceleyerek, işlemleri nasıl oluşturup gönderebileceğimizi gösterelim. Daha fazla ayrıntı için `İşlemler ve Talimatlar` ve `Solana'daki Ücretler` sayfalarına başvurun.

## SOL Transferi

Cüzdanınızdan başka bir hesaba basit bir SOL transferi ile başlayacağız. Bu, Sistem Programı üzerinde transfer talimatının çağrılmasını gerektirir.



### Örnek 1'i Aç

Solana Playground'da örneği açmak için bu [bağlantıya](https://beta.solpg.io/6671d85ecffcf4b13384d19e) tıklayın. Aşağıdaki kodu göreceksiniz:

```ts filename="client.ts"
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

const sender = pg.wallet.keypair;
const receiver = new Keypair();

const transferInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver.publicKey,
  lamports: 0.01 * LAMPORTS_PER_SOL,
});

const transaction = new Transaction().add(transferInstruction);

const transactionSignature = await sendAndConfirmTransaction(
  pg.connection,
  transaction,
  [sender],
);

console.log(
  "İşlem İmzası:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```




Bu script aşağıdakileri yapar:

- Playground cüzdanınızı gönderici olarak ayarlar

  ```ts
  const sender = pg.wallet.keypair;
  ```

- Alıcı olarak yeni bir anahtar çift oluşturur

  ```ts
  const receiver = new Keypair();
  ```

- 0.01 SOL transfer etmek için bir transfer talimatı oluşturur

  ```ts
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL,
  });
  ```

- Transfer talimatını içeren bir işlem oluşturur

  ```ts
  const transaction = new Transaction().add(transferInstruction);
  ```

- İşlemi gönderir ve onaylar

  ```ts
  const transactionSignature = await sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [sender],
  );
  ```

- İşlem detaylarını görmek için Playground terminalinde SolanaFM keşif bağlantısını yazdırır

  ```ts
  console.log(
    "İşlem İmzası:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
  ```




### Örnek 1'i Çalıştır

`run` komutunu kullanarak kodu çalıştırın.

```shell filename="Terminal"
run
```

İşlem detaylarını SolanaFM keşif sayfasında görmek için çıktı bağlantısına tıklayın.




```shell filename="Terminal"
client çalışıyor...
  client.ts:
    İşlem İmzası: https://solana.fm/tx/he9dBwrEPhrfrx2BaX4cUmUbY22DEyqZ837zrGrFRnYEBmKhCb5SvoaUeRKSeLFXiGxC8hFY5eDbHqSJ7NYYo42?cluster=devnet-solana
```




![Transfer SOL](../../../images/solana/public/assets/docs/intro/quickstart/transfer-sol.png)

:::tip
Artık Solana üzerinde ilk işleminizi göndermiş oldunuz! Bir talimat oluşturup bunu bir işleme eklediğimizi ve ardından bu işlemi ağa gönderdiğimizi unutmayın. Bu, herhangi bir işlemi oluşturmanın temel sürecidir.
:::

---

## Token Oluşturma

Şimdi, bir Mint hesabı oluşturarak ve başlatarak yeni bir token oluşturacağız. Bu iki talimat gerektirir:

- Yeni bir hesap oluşturmak için Sistem Programı'nı çağırın
- Hesap verilerini başlatmak için Token Uzantıları Programı'nı çağırın



### Örnek 2'yi Aç

Solana Playground'da örneği açmak için bu [bağlantıya](https://beta.solpg.io/6671da4dcffcf4b13384d19f) tıklayın. Aşağıdaki kodu göreceksiniz:

```ts filename="client.ts"
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

const wallet = pg.wallet;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Mint hesabının adresi olarak kullanılacak anahtar çiftini oluştur
const mint = new Keypair();

// Mint hesabı için gerekli alana karşılık gelen en az lamportları hesapla
const rentLamports = await getMinimumBalanceForRentExemptMint(connection);

// Yeni mint hesabı için alan içeren yeni bir hesap oluşturma talimatı
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: wallet.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: rentLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});

// Mint hesabını başlatmak için talimat
const initializeMintInstruction = createInitializeMint2Instruction(
  mint.publicKey,
  2, // ondalık
  wallet.publicKey, // mint yetkisi
  wallet.publicKey, // dondurma yetkisi
  TOKEN_2022_PROGRAM_ID,
);

// Yeni hesap oluşturma ve mint hesabını başlatma talimatları ile işlem oluştur
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeMintInstruction,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [
    wallet.keypair, // ödeyici
    mint, // mint adresi anahtar çift
  ],
);

console.log(
  "\nİşlem İmzası:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);

console.log(
  "\nMint Hesabı:",
  `https://solana.fm/address/${mint.publicKey}?cluster=devnet-solana`,
);
```




Bu script aşağıdaki adımları gerçekleştirir:

- Playground cüzdanınızı ve Solana devnet'e bir bağlantı ayarlar

  ```ts
  const wallet = pg.wallet;
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  ```

- Mint hesabı için yeni bir anahtar çifti oluşturur

  ```ts
  const mint = new Keypair();
  ```

- Bir Mint hesabı için gereken en az lamport miktarını hesaplar

  ```ts
  const rentLamports = await getMinimumBalanceForRentExemptMint(connection);
  ```

- Mint için yeni bir hesap oluşturma talimatını oluşturur; yeni hesabın sahibi olarak Token Uzantıları programını (`TOKEN_2022_PROGRAM_ID`) belirtir

  ```ts
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mint.publicKey,
    space: MINT_SIZE,
    lamports: rentLamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });
  ```

- Mint hesabı verilerini başlatma talimatını oluşturur

  ```ts
  const initializeMintInstruction = createInitializeMint2Instruction(
    mint.publicKey,
    2,
    wallet.publicKey,
    wallet.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
  ```

- Her iki talimatı tek bir işleme ekler

  ```ts
  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeMintInstruction,
  );
  ```

- İşlemi gönderir ve onaylar. Hem cüzdan hem de mint anahtar çifti işlemde imzalayıcı olarak geçer. Cüzdan, yeni hesabın oluşturulması için ödeme yapmak zorundadır. Mint anahtar çifti, yeni hesabın adresi olarak kamu anahtarını kullandığımız için gereklidir.

  ```ts
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet.keypair, mint],
  );
  ```

- İşlem ve mint hesabı detaylarını SolanaFM'de görüntülemek için bağlantılar yazdırır

  ```ts
  console.log(
    "\nİşlem İmzası:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );

  console.log(
    "\nMint Hesabı:",
    `https://solana.fm/address/${mint.publicKey}?cluster=devnet-solana`,
  );
  ```




### Örnek 2'yi Çalıştır

Kodunuzu `run` komutunu kullanarak çalıştırın.

```shell filename="Terminal"
run
```

Playground terminalinde iki bağlantının yazdırıldığını göreceksiniz:

- Birisi işlem detayları için
- Diğeri yeni oluşturulan mint hesabı için

Bağlantılara tıklayarak işlem detaylarını ve yeni oluşturulan mint hesabını SolanaFM'de inceleyin.




```shell filename="Terminal"
client çalışıyor...
  client.ts:

İşlem İmzası: https://solana.fm/tx/3BEjFxqyGwHXWSrEBnc7vTSaXUGDJFY1Zr6L9iwLrjH8KBZdJSucoMrFUEJgWrWVRYzrFvbjX8TmxKUV88oKr86g?cluster=devnet-solana

Mint Hesabı: https://solana.fm/address/CoZ3Nz488rmATDhy1hPk5fvwSZaipCngvf8rYBYVc4jN?cluster=devnet-solana
```




![Token Oluştur](../../../images/solana/public/assets/docs/intro/quickstart/create-token.png)

![Mint Hesabı](../../../images/solana/public/assets/docs/intro/quickstart/mint-account.png)

:::info
Bu sefer, birden fazla talimatla bir işlem oluşturduğumuzu unutmayın. Önce yeni bir hesap oluşturduk ve ardından verilerini bir mint olarak başlattık. Bu, birden fazla programdan talimatlar içeren daha karmaşık işlemler oluşturmanın yoludur.
:::

