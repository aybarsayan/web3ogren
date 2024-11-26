---
title: Yerel bir json dosyası anahtar çiftini yükleme
sidebarSortOrder: 6
description: "Bir dosyadan anahtar çifti nasıl yükleyeceğinizi öğrenin."
---

Yerel projenizi çalıştırdığınızda muhtemelen bir dosya json anahtar çifti kullanmak istersiniz. Bu, tüm yemek kitabı örnekleri için çok yararlı olabilir. 

:::tip
Anahtar çiftinizi oluşturmak için `solana-keygen grind --starts-with a23:1` komutunu kullanabilirsiniz.
:::

Ardından, `loadKeypairFromFile` fonksiyonunu kullanarak projelerinizde bu anahtar çiftini yükleyip kullanabilirsiniz.

```typescript filename="load-keypair-from-file.ts"
import {
  airdropFactory,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  devnet,
  generateKeyPair,
  getAddressFromPublicKey,
  KeyPairSigner,
  lamports,
} from "@solana/web3.js";
import fs from "fs";
import path from "path";
import os from "os";

// Yeni kütüphane, Solana anahtar çiftleri ve adreslerine yeni bir yaklaşım getirmektedir,
// bu, 1.x sürümündeki PublicKey ve Keypair sınıflarından oldukça farklı hissedilecektir.
// Artık tüm anahtar işlemler, JavaScript’in Web Crypto API’sindeki yerel Ed25519 uygulamasını kullanır.
async function createKeypair() {
  const newKeypair: CryptoKeyPair = await generateKeyPair();
  const publicAddress = await getAddressFromPublicKey(newKeypair.publicKey);

  console.log(`Açık anahtar: ${publicAddress}`);
}

export async function loadDefaultKeypair(): Promise<KeyPairSigner<string>> {
  return await loadKeypairFromFile("~/.config/solana/id.json");
}

export async function loadDefaultKeypairWithAirdrop(
  cluster: string,
): Promise<KeyPairSigner<string>> {
  const keypair = await loadDefaultKeypair();
  const rpc = createSolanaRpc(devnet(`https://api.${cluster}.solana.com`));
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    devnet(`wss://api.${cluster}.solana.com`),
  );
  try {
    const result = await rpc.getBalance(keypair.address).send();

    console.log(`Bakiye: ${result.value} lamports`);
    if (result.value < lamports(500_000n)) {
      console.log(`Bakiye düşük, airdrop talep ediliyor`);
      const airdrop = airdropFactory({ rpc, rpcSubscriptions });
      await airdrop({
        commitment: "confirmed",
        lamports: lamports(1_000_000_000n),
        recipientAddress: keypair.address,
      });
    }
  } catch (err) {
    console.error("Bakiye alınırken hata:", err);
  }
  return keypair;
}

export async function loadKeypairFromFile(
  filePath: string,
): Promise<KeyPairSigner<string>> {
  // Bu, dosya sisteminden varsayılan anahtar çiftini yüklemenizi sağlamak için burada.
  const resolvedPath = path.resolve(
    filePath.startsWith("~") ? filePath.replace("~", os.homedir()) : filePath,
  );
  const loadedKeyBytes = Uint8Array.from(
    JSON.parse(fs.readFileSync(resolvedPath, "utf8")),
  );
  // Burada, özel anahtarınızı çıkarmanız gerekiyorsa ikinci parametreyi true olarak ayarlayabilirsiniz.
  const keypairSigner = await createKeyPairSignerFromBytes(loadedKeyBytes);
  return keypairSigner;
}

createKeypair();
```

:::info
Anahtar çiftinizi güvenli bir biçimde saklamak için `.json` dosyasını şifreleyerek koruyun.
:::

:::warning
Dikkat: Anahtar çiftinizin açık bir şekilde görülmesi, cüzdanınıza erişim kaybına yol açabilir.
:::

:::note
Bu fonksiyonlar ile oluşturulan anahtarlar, JavaScript’in Web Crypto API’si ile yerel bir şekilde yönetilir.
:::

:::danger
Lütfen anahtar çiftinizin bulunduğu dosya yolunu dikkatlice kontrol edin; hatalı bir yol girişimi, dosya erişim hatasını doğurabilir.
---