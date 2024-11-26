---
title: Token Göndermenin Yolu
sidebarSortOrder: 2
description:
  "Token kullanımı Solana üzerindeki herhangi bir uygulamada yaygındır. Solana üzerinde token göndermeyi öğrenin."
---

SPL Token'ları aktarmak için [Token Program][1] kullanılmaktadır. Bir SPL token göndermek için, onun SPL token hesap adresini bilmeniz gerekir. Aşağıdaki örnek ile hem adresi alabilir hem de token gönderebilirsiniz.

:::info
**Token göndermeden önce bu adımları takip edin.** Doğru hesap adreslerini kullanmak, işlem güvenliği için önemlidir.
:::

```typescript filename="send-tokens.ts"
import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createTransferInstruction,
} from "@solana/spl-token";

(async () => {
  // Küme ile bağlantı kur
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Yeni bir cüzdan anahtarı oluştur ve SOL airdrop'u al
  const fromWallet = Keypair.generate();
  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL,
  );
  // Airdrop onayını bekle
  await connection.confirmTransaction(fromAirdropSignature);

  // Yeni bir cüzdan oluşturun, yeni basılan token'ları almak için
  const toWallet = Keypair.generate();

  // Yeni token mint oluştur
  const mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
  );

  // fromWallet Solana adresinin token hesabını al, yoksa oluştur
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey,
  );

  // toWallet Solana adresinin token hesabını al, yoksa oluştur
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWallet.publicKey,
  );

  // "fromTokenAccount" hesabına 1 yeni token basma
  await mintTo(
    connection,
    fromWallet,
    mint,
    fromTokenAccount.address,
    fromWallet.publicKey,
    1000000000, // 1 token, ancak lamport cinsinden
    [],
  );

  // İşleme token transfer talimatlarını ekle
  const transaction = new Transaction().add(
    createTransferInstruction(
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      1,
    ),
  );

  // İşlemi imzala, yayınla ve onayla
  await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
})();
```

:::tip
**Airdrop**: Yeni bir cüzdan oluşturduğunuzda, işlem masraflarını karşılamak için **SOL** almanız gerektiğini unutmayın.
:::


Detaylı Bilgi

Token gönderimi için gereken adımlar:
1. **Cüzdan Oluşturun**: Yeni bir cüzdan anahtarı oluşturun.
2. **Airdrop Talep Edin**: Cüzdanınıza SOL aktarın.
3. **Token Hesapları Oluşturun**: Gerekirse, hem gönderici hem de alıcı için token hesapları oluşturun.
4. **Token Mint Edin**: Token'ları mintleyin ve gönderin.



--- 

:::warning
Token gönderme işlemi sırasında, işlem ücretlerini dikkate alın. Yetersiz bakiye ile işlem gerçekleştirmeye çalışırsanız hata alabilirsiniz.
:::

> "İşlem güvenliğiniz için doğru adresleri kullanmaya özen gösterin."  
> — Solana Geliştirici Rehberi

[1]: https://spl.solana.com/token