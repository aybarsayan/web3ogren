---
title: Kriptografi ve Solana Ağı
objectives:
  - Simetrik ve asimetrik kriptografiyi anlamak
  - Anahtar çiftlerini açıklamak
  - Yeni bir anahtar çifti oluşturmak
  - Bir env dosyasından anahtar çifti yüklemek
description: "Asimetrik kriptografiyi ve Solana'nın bunu nasıl kullandığını anlayın."
---

## Özeti

- Bir **anahtar çifti**, **açık anahtar** ve **gizli anahtar** olan eşleşen bir çifttir.
- **Açık anahtar**, Solana ağı üzerindeki bir hesaba işaret eden bir “adres” olarak kullanılır. Açık anahtar herkesle paylaşılabilir.
- **Gizli anahtar**, hesap üzerindeki yetkiyi doğrulamak için kullanılır. Adından da anlaşılacağı gibi, gizli anahtarları her zaman *gizli* tutmalısınız.
- `@solana/web3.js`, yeni bir anahtar çifti oluşturmak veya mevcut bir gizli anahtarı kullanarak bir anahtar çifti oluşturmak için yardımcı fonksiyonlar sağlar.

---

## Ders

Bu derste, kriptografinin temel temelini keşfedeceğiz ve bunun Solana ekosisteminde nasıl uygulandığını inceleyeceğiz.

### Simetrik ve Asimetrik Kriptografi

'Kriptografi', bilgiyi gizleme çalışmasıdır. Günlük yaşamınızda karşılaşacağınız iki ana kriptografi türü vardır:

**Simetrik Kriptografi**, aynı anahtarın hem şifrelemek hem de şifre çözmek için kullanıldığı durumdur. Yüzlerce yıl öncesine dayanmaktadır ve Antik Mısırlılar'dan Kraliçe I. Elizabeth'e kadar herkes tarafından kullanılmıştır.

Birçok simetrik kriptografi algoritması vardır, ancak günümüzde en yaygın olanlar **AES** ve **Chacha20**'dur.

**Asimetrik Kriptografi**

- Asimetrik kriptografi - aynı zamanda '[açık anahtar kriptografisi](https://en.wikipedia.org/wiki/Public-key_cryptography)' olarak adlandırılır ve 1970'lerde geliştirilmiştir. Asimetrik kriptografide katılımcıların anahtar çiftleri (veya **anahtar çiftleri**) vardır. Her anahtar çifti bir **gizli anahtar** ve bir **açık anahtar** içerir. Asimetrik şifreleme, simetrik şifrelemeden farklı çalışır ve farklı şeyler yapabilir:

- **Şifreleme**: Eğer bir açık anahtarla şifrelendiyse, yalnızca aynı anahtar çiftinin gizli anahtarı kullanılarak okunabilir.
- **İmzalar**: Eğer bir gizli anahtarla şifrelendiyse, aynı anahtar çiftinin açık anahtarı o gizli anahtar sahibinin imzaladığını kanıtlamak için kullanılabilir.
- Asimetrik kriptografiyi, simetrik kriptografi için iyi bir anahtar bulmak için de kullanabilirsiniz! Bu, açık anahtarlarınızı ve alıcının açık anahtarını kullanarak bir 'oturum' anahtarı oluşturma işlemidir.
- Asimetrik kriptografi algoritmalarının çeşitleri vardır, ancak günümüzde en yaygın olanlar **ECC** veya **RSA** varyantlarıdır.

Asimetrik şifreleme, etrafımızdaki birçok sistemin temelini oluşturur:

:::tip
**Anahtar Kullanım Örnekleri**:
- Banka kartınızda işlemleri imzalamak için kullanılan bir gizli anahtar vardır. Bankanız, işlemi aynı açık anahtarla kontrol ederek sizin yaptığınızı doğrulayabilir.
- Web siteleri, sertifikalarında bir açık anahtar içerir. Tarayıcınız bu açık anahtarı, web sayfasına gönderdiği verileri (kişisel bilgiler, giriş ayrıntıları ve kredi kartı numaraları gibi) şifrelemek için kullanır.
  Web sitesi, veriyi okuyabilmek için eşleşen bir özel anahtara sahiptir.
- Elektronik pasaportunuz, verilerin sahte olmadığını garanti etmek için onu veren ülke tarafından imzalanmıştır.
  
  Elektronik pasaport kapıları, bunun doğruluğunu, sizin veren ülkeden alınan açık anahtar kullanarak doğrulayabilir.
- Telefonunuzdaki mesajlaşma uygulamaları, bir oturum anahtarı oluşturmak için anahtar değişimi kullanır.
:::

Kısacası, kriptografi etrafımızda. Solana, diğer blok zincirleri de dahil olmak üzere, kriptografinin yalnızca bir kullanım alanıdır.

---

### Solana açık anahtarları adres olarak kullanır

![Solana cüzdan adresleri](../../../images/solana/public/assets/courses/unboxed/wallet-addresses.svg)

Solana ağında yer alan insanlar en az bir anahtar çiftine sahiptir. Solana'da:

- **Açık anahtar**, Solana ağı üzerindeki bir hesaba işaret eden bir “adres” olarak kullanılır. `example.sol` gibi dostane isimler bile, 'dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8' gibi adreslere işaret eder.
- **Gizli anahtar**, o anahtar çifti üzerindeki yetkiyi doğrulamak için kullanılır. Bir adres için gizli anahtarınız varsa, o adresin içindeki jetonları kontrol edersiniz. Bu nedenle, adından da anlaşılacağı gibi, gizli anahtarları her zaman *gizli* tutmalısınız.

---

### @solana/web3.js kullanarak bir anahtar çifti oluşturmak

Solana blok zincirini, tarayıcıdan veya node.js ile `@solana/web3.js` npm modülü ile kullanabilirsiniz. Normalde nasıl bir proje oluşturursanız, öyle ayarlayın, ardından [npm kullanarak](https://nodesource.com/blog/an-absolute-beginners-guide-to-using-npm/) `@solana/web3.js`'yi yükleyin:

```shell
npm i @solana/web3.js@1
```

Bu kursta `web3.js`'yi aşamalı olarak ele alacağız, ancak [resmi web3.js dökümantasyonuna](https://solana.com/docs/clients/javascript-reference) da göz atabilirsiniz.

Jeton göndermek, NFT'ler göndermek veya Solana'da veri okumak ve yazmak için kendi anahtar çiftinize ihtiyacınız olacak. Yeni bir anahtar çifti oluşturmak için `@solana/web3.js`'den `Keypair.generate()` fonksiyonunu kullanın:

```typescript
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`Açık anahtar: `, keypair.publicKey.toBase58());
console.log(`Gizli anahtar: `, keypair.secretKey);
```

:::warning
**Gizli anahtarları kaynak kodunuza dahil etmeyin**  
Anahtar çifti gizli anahtardan yeniden oluşturulabileceğinden, genellikle yalnızca gizli anahtarı saklarız ve anahtar çiftini gizli anahtardan yeniden oluştururuz.

Ayrıca, gizli anahtar adres üzerindeki yetkiyi verdiğinden, gizli anahtarları kaynak kodunda saklamayız. Bunun yerine:

- Gizli anahtarları `.env` dosyasına koyarız.
- `.gitignore` dosyasına `.env` ekleriz, böylece `.env` dosyası eklenmez.
:::

---

### Varolan bir anahtar çiftini yükleme

Daha önceden kullanmak istediğiniz bir anahtar çiftiniz varsa, dosya sisteminde veya bir `.env` dosyasında saklanan mevcut bir gizli anahtardan `Keypair` yükleyebilirsiniz. Node.js'de, `@solana-developers/helpers` npm paketi bazı ekstra fonksiyonlar içerir:

```bash
npm i @solana-developers/helpers
```

- Bir `.env` dosyasını kullanmak için `getKeypairFromEnvironment()` fonksiyonunu kullanın.
- Bir Solana CLI dosyasını kullanmak için `getKeypairFromFile()` fonksiyonunu kullanın.

```typescript
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
```

Artık anahtar çiftleri oluşturmayı ve yüklemeyi biliyorsunuz! Öğrendiklerimizi pratik yapalım.

---

## Laboratuvar

Bu laboratuvar, anahtar çiftlerini ve Solana üzerinde gizli anahtarları güvenli bir şekilde nasıl saklayacağımızı öğreneceğiz.

### Kurulum

Yeni bir dizin oluşturun, TypeScript, Solana web3.js ve esrun'u yükleyin:

```bash
mkdir generate-keypair
cd generate-keypair
npm init -y
npm install typescript @solana/web3.js@1 esrun @solana-developers/helpers@2
```

`generate-keypair.ts` adında yeni bir dosya oluşturun:

```typescript
import { Keypair } from "@solana/web3.js";
const keypair = Keypair.generate();
console.log(`✅ Anahtar çifti oluşturuldu!`);
```

`npx esrun generate-keypair.ts` çalıştırın. Aşağıdaki metni görmelisiniz:

```
✅ Anahtar çifti oluşturuldu!
```

Her `Keypair`'in bir `publicKey` ve `secretKey` özelliği vardır. Dosyayı güncelleyin:

```typescript
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`Açık anahtar: `, keypair.publicKey.toBase58());
console.log(`Gizli anahtar: `, keypair.secretKey);
console.log(`✅ Bitirildi!`);
```

`npx esrun generate-keypair.ts` çalıştırın. Aşağıdaki metni görmelisiniz:

```
Açık anahtar:  764CksEAZvm7C1mg2uFmpeFvifxwgjqxj2bH6Ps7La4F
Gizli anahtar:  Uint8Array(64) [
  (uzun bir sayı dizisi)
]
✅ Bitirildi!
```

---

## Bir .env dosyasından mevcut bir anahtar çiftini yükleme

Gizli anahtarınızın güvende kalmasını sağlamak için gizli anahtarı bir `.env` dosyası kullanarak enjekte etmenizi öneririz:

Daha önce oluşturduğunuz anahtarın içeriği ile `.env` adında yeni bir dosya oluşturun:

```env
SECRET_KEY="[(bir dizi sayı)]"
```

Daha sonra, çevreden anahtar çiftini yükleyebiliriz. `generate-keypair.ts` dosyasını güncelleyin:

```typescript
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `✅ Bitirildi! Gizli anahtarımızı güvenli bir şekilde, bir env dosyası kullanarak yükledik!`,
);
```

`npx esrun generate-keypair.ts` çalıştırın. Aşağıdaki sonucu görmelisiniz:

```text
✅ Bitirildi! Gizli anahtarımızı güvenli bir şekilde, bir env dosyası kullanarak yükledik!
```

Artık anahtar çiftleri ve Solana üzerinde gizli anahtarların güvenli bir şekilde nasıl saklanacağını öğrendik. Bir sonraki bölümde, bunları kullanacağız!

:::success
## Laboratuvarı tamamladınız mı?

Kodunuzu GitHub'a iterek [bize bu dersi nasıl bulduğunuzu anlatın](https://form.typeform.com/to/IPH0UGz7#answers-lesson=ee06a213-5d74-4954-846e-cba883bc6db1)!
:::