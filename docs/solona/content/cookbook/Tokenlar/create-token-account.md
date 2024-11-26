---
title: Token Hesabı Oluşturma
sidebarSortOrder: 3
description:
  "Kullanıcılar için token tutan Solana token hesapları oluşturmayı öğrenin."
---

Bir kullanıcının token tutması için bir **token hesabına** ihtiyacı vardır.

Her türlü token'a sahip olan bir kullanıcının en az bir token hesabı olacaktır.

:::info
**İlişkili Token Hesapları**, her anahtar çifti için belirleyici olarak oluşturulan hesaplar. **ATA**'lar, token hesaplarını yönetmenin önerilen yöntemidir.
:::

```typescript filename="ata.ts"
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";

(async () => {
  // bağlantı
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

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

  const mintPubkey = new PublicKey(
    "2SKpuBU9ksneBZD4nqbZkw75NE11HsSHsGRtW2BZh5aQ",
  );

  // 1) yerleşik fonksiyonu kullanın
  {
    let ata = await createAssociatedTokenAccount(
      connection, // bağlantı
      feePayer, // ücret ödeyici
      mintPubkey, // basım
      alice.publicKey, // sahip,
    );
    console.log(`ATA: ${ata.toBase58()}`);
  }

  // veya

  // 2) kendiniz oluşturun
  {
    // ATA'yı hesapla
    let ata = await getAssociatedTokenAddress(
      mintPubkey, // basım
      alice.publicKey, // sahip
    );
    console.log(`ATA: ${ata.toBase58()}`);

    // cüzdanınız eğri dışındaysa, kullanmalısınız
    // let ata = await getAssociatedTokenAddress(
    //   mintPubkey, // basım
    //   alice.publicKey // sahip
    //   true, // allowOwnerOffCurve
    // );

    let transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        feePayer.publicKey, // ödeyici
        ata, // ata
        alice.publicKey, // sahip
        mintPubkey, // basım
      ),
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [feePayer], // İmzalayıcılar
    );

    console.log(`txhash: ${await signature}`);
  }
})();
```

:::tip
**Öneri:** Yukarıdaki iki yöntemden birini kullanarak token hesabı oluşturabilirsiniz. Yerleşik fonksiyonu kullanmak daha hızlıdır.
:::

:::note
Token hesabınızı oluşturduktan sonra, **konumunu kontrol etmek** için `ata.toBase58()` kullanarak console.log edebilirsiniz.
::: 

```typescript
console.log(`ATA: ${ata.toBase58()}`);
``` 

:::warning
Unutmayın, cüzdanınız eğri dışındaysa, **allowOwnerOffCurve** parametresini kullanmanız gerekebilir.
:::

***Bu noktada iki önemli yöntem sunulmuştur ve her ikisi de geçerlidir.***