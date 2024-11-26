---
title: Token Oluşturma
sidebarSortOrder: 1
description: "Solana üzerinde nasıl token oluşturulacağını öğrenin."
altRoutes:
  - /developers/cookbook/tokens
---

Token oluşturma, **"mint hesabı"** olarak adlandırılan bir hesabın oluşturulması ile yapılır. Bu mint hesabı daha sonra bir kullanıcının token hesabına token basmak için kullanılır.

:::info
Bu süreç, Solana ekosisteminde yeni token'lar yaratmak için temel bir adımdır.
:::

```typescript filename="create-mint-account.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint,
} from "@solana/spl-token";
import bs58 from "bs58";

(async () => {
  // connection
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const recentBlockhash = await connection.getLatestBlockhash();

  // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2",
    ),
  );

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const alice = Keypair.fromSecretKey(
    bs58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
    ),
  );

  // 1) yerleşik fonksiyonu kullan
  let mintPubkey = await createMint(
    connection, // bağlantı
    feePayer, // ücret ödeyici
    alice.publicKey, // mint yetkisi
    alice.publicKey, // dondurma yetkisi (bunu devre dışı bırakmak için `null` kullanabilirsiniz. devre dışı bıraktığınızda, tekrar aktif hale getiremezsiniz)
    8, // ondalık
  );
  console.log(`mint: ${mintPubkey.toBase58()}`);

  // veya

  // 2) kendin oluştur
  const mint = Keypair.generate();
  console.log(`mint: ${mint.publicKey.toBase58()}`);

  const transaction = new Transaction().add(
    // mint hesabı oluştur
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    // mint hesabını başlat
    createInitializeMintInstruction(
      mint.publicKey, // mint pubkey
      8, // ondalık
      alice.publicKey, // mint yetkisi
      alice.publicKey, // dondurma yetkisi (bunu devre dışı bırakmak için `null` kullanabilirsiniz. devre dışı bıraktığınızda, tekrar aktif hale getiremezsiniz)
    ),
  );

  // İşlemi gönder
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [feePayer, mint], // İmzalayıcılar
  );

  console.log(`txhash: ${transactionSignature}`);
})();
```

:::tip
Yerleşik fonksiyonları kullanmak, daha hızlı ve hatasız bir geliştirme deneyimi sağlar.
:::

:::warning
Mint hesabınızı oluştururken dikkat edin; bir kez devre dışı bıraktığınız mint yetkisini geri almak mümkün değildir.
:::

### Ek Bilgiler


Mint Hesabı Nedir?
Mint hesabı, token'ların yaratılması ve yönetilmesi için gereken bir hesap türüdür. Her bir mint, belirli sayıda token basılmasını ve bu token'ların işlem yapılabilmesini sağlar.


:::note
Kullanıcıların mint yetkisini devre dışı bırakacak şekilde ayarlaması, örneğin, bir Ethereum token'ı gibi merkeziyetsiz token'lar oluşturmak için kullanılabilir.
::: 

--- 