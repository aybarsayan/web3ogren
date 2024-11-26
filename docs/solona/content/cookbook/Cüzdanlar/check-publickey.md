---
title: Bir Genel Anahtar Nasıl Doğrulanır
sidebarSortOrder: 4
description:
  "Solana'daki genel anahtarlar, az bir miktar kod ile doğrulanabilir. Solana'da genel anahtarların nasıl doğrulanacağını öğrenin."
---

### Genel Anahtarların Doğrulanması

Belirli özel durumlarda (örneğin **Program Türetilmiş Adres**), genel anahtarların onlarla ilişkili bir özel anahtarı olmayabilir. Genel anahtarın **ed25519 eğrisi** üzerinde olup olmadığını kontrol ederek bunu inceleyebilirsiniz. 

:::info
Eğri üzerinde yatan yalnızca genel anahtarlar, cüzdanı olan kullanıcılar tarafından kontrol edilebilir.
:::





```typescript
import { isAddress } from "@solana/web3.js";

// generateKeyPair() her zaman kullanıcılar için geçerli bir genel anahtar verecektir

// Geçerli genel anahtar
const key = "5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY";

// ed25519 eğrisi üzerinde yatar ve kullanıcılar için uygundur
console.log("Geçerli Adres: ", isAddress(key));

// Geçerli genel anahtar
const offCurveAddress = "4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e";

// ed25519 eğrisi üzerinde değil, bu nedenle kullanıcılar için uygun değil
console.log("Geçerli Dış Eğri Adresi: ", isAddress(offCurveAddress));

// Geçerli bir genel anahtar değil
const errorPubkey = "testPubkey";
console.log("Geçersiz Adres: ", isAddress(errorPubkey));
```




```typescript
import { PublicKey } from "@solana/web3.js";

// Keypair.generate() her zaman kullanıcılar için geçerli bir genel anahtar verecektir

// Geçerli genel anahtar
const key = new PublicKey("5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY");
// ed25519 eğrisi üzerinde yatar ve kullanıcılar için uygundur
console.log(PublicKey.isOnCurve(key.toBytes()));

// Geçerli genel anahtar
const offCurveAddress = new PublicKey(
  "4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e",
);

// ed25519 eğrisi üzerinde değil, bu nedenle kullanıcılar için uygun değil
console.log(PublicKey.isOnCurve(offCurveAddress.toBytes()));

// Geçerli bir genel anahtar değil
const errorPubkey = new PublicKey("testPubkey");
console.log(PublicKey.isOnCurve(errorPubkey.toBytes()));
```




:::tip
**Doğrulama** adımlarını dikkatlice uygulamak, güvenliğiniz için önemlidir.
:::

### Sonuç

Herhangi bir genel anahtarın doğruluğunu kontrol etmek için yukarıdaki yöntemleri kullanabilirsiniz. Doğru bir genel anahtar, yalnızca eğri üzerinde yatan ve kullanıcılar için uygun olanlardır. 

:::warning
Geçersiz anahtarlar kullanmak, cüzdan erişimi kaybına yol açabilir. Dikkatli olun!
::: 

---
