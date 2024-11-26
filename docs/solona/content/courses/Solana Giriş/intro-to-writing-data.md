---
title: Solana Ağı Üzerinde İşlemler Oluşturma
objectives:
  - İşlemleri açıklamak
  - İşlem ücretlerini açıklamak
  - solana/web3.js kullanarak SOL göndermek
  - solana/web3.js kullanarak işlemleri imzalamak
  - İşlemleri görüntülemek için Solana Explorer kullanmak
description:
  "İlk işlemlerinizi DevNet'te, Sistem ve memo programlarını kullanarak gerçekleştirin!"
---

## Özet

Tüm onchain verilerdeki değişiklikler **işlemler** aracılığıyla gerçekleşir. İşlemler çoğunlukla Solana programlarını çağıran bir dizi komut dizisidir. İşlemler atomiktir; bu, işlemin ya başarılı olduğu, yani tüm komutların doğru bir şekilde yürütüldüğü ya da başarısız olduğu, yani işlem hiç çalışmamış gibi olduğu anlamına gelir.

---

## Ders

### İşlemler atomiktir

Onchain verilerdeki herhangi bir değişiklik, programlara gönderilen işlemler aracılığıyla gerçekleşir.

> Solana'daki bir işlem, başka bir yerdeki bir işleme benzer: atomiktir. **Atomik, tüm işlemin ya çalıştığı ya da başarısız olduğu anlamına gelir** — İşlem başarısızsa, hiçbir adım gerçekleşmez.

Bir şey için çevrimiçi ödeme yapmayı düşünün:

- Hesabınızın bakiyesi debite edilir
- Banka fonları satıcıya aktarır

Bu iki şeyin de işlemin başarılı olması için gerçekleşmesi gerekir. Eğer bunlardan biri başarısız olursa, hiçbirinin gerçekleşmemesi gerekir; yani, satıcıya ödeme yapıp hesabınızı debite etmemek veya hesabınızı debite edip satıcıya ödeme yapmamak.

Atomik, işlemin ya gerçekleşmesi - yani tüm bireysel adımların başarılı olması - ya da tüm işlemin başarısız olması anlamına gelir.

### İşlemler komutlar içerir

Solana'daki bir işlemdeki adımlara **komutlar** denir.

Her komut şunları içerir:

- Okunacak ve/veya yazılacak bir dizi hesap. Bu, Solana'nın hızlı olmasını sağlayan şeydir - farklı hesapları etkileyen işlemler aynı anda işlenir.
- Çağrılacak programın genel anahtarı.
- Çağrılan programa geçirilen veriler, bir bayt dizisi olarak yapılandırılmıştır.

Bir işlem çalıştırıldığında, işlemdeki komutlarla bir veya daha fazla Solana programı çağrılır.

Tahmin edebileceğiniz gibi, `@solana/web3.js` işlemler ve komutlar oluşturmak için yardımcı işlevler sağlar. Yeni bir işlem oluşturmak için `new Transaction()` yapılandırıcısını kullanabilirsiniz. Oluşturulduktan sonra, `add()` yöntemi kullanarak işlemi ekleyebilirsiniz.

:::note
Bu yardımcı işlevlerden biri, `SystemProgram.transfer()`'dir; bu, `SystemProgram` için bazı SOL'leri aktarmak üzere bir komut oluşturur:
:::

```typescript
const transaction = new Transaction();

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: sender,
  toPubkey: recipient,
  lamports: LAMPORTS_PER_SOL * amount,
});

transaction.add(sendSolInstruction);
```

`SystemProgram.transfer()` işlevi şunları gerektirir:

- Gönderenin hesabına karşılık gelen bir genel anahtar.
- Alıcının hesabına karşılık gelen bir genel anahtar.
- Göndermek için lamport cinsinden SOL miktarı.

`SystemProgram.transfer()` işlevi SOL'nin göndereni alıcıya göndermek için komutu döndürür.

Bu komutta kullanılan program `system` programı olacaktır (adres `11111111111111111111111111111111`), veri SOL'yi aktarmak için miktar olacaktır (Lamport cinsinden) ve hesaplar gönderen ile alıcıya göre oluşturulacaktır.

Komut daha sonra işleme eklenebilir.

Bütün komutlar eklendikten sonra, bir işlemin kümeye gönderilip onaylanması gerekir:

```typescript
const signature = sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);
```

`sendAndConfirmTransaction()` işlevi şu parametreleri alır:

- Bir küme bağlantısı.
- Bir işlem.
- İşlemde imzacı olarak davranacak bir dizi anahtar çiftleri - bu örnekte, yalnızca bir imzacımız var: gönderici.

### İşlemlerin ücretleri vardır

İşlem ücretleri, işlemleri işlemek için gereken CPU ve GPU kaynakları için doğrulayıcı ağına tazminat olarak Solana ekonomisine entegre edilmiştir. Solana işlem ücretleri belirleyicidir.

- **Bir işlemin imzacılar dizisindeki ilk imzacı, işlem ücretini ödemekten sorumlu kişidir.** 
- Bu imzacı, işlem ücretini karşılayacak kadar SOL'e sahip değilse, işlem bir hata ile iptal edilecektir:

```
> İşlem simülasyonu başarısız oldu: Bir hesabı debite etme girişimi ancak önceden bir kredi kaydı bulunamadı.
```

Bu hatayı alıyorsanız, bunun nedeni anahtar çiftinizin tamamen yeni olması ve işlem ücretlerini karşılayacak kadar SOL'i olmamasıdır. Bu durumu düzeltmek için bağlantıyı kurduktan hemen sonra aşağıdaki satırları ekleyelim:

```typescript
await airdropIfRequired(
  connection,
  keypair.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL,
);
```

Bu, hesabınıza tester için kullanabileceğiniz 1 SOL yatıracaktır. Bu, değer taşıdığında Mainnet'te çalışmayacaktır. Ancak, yerel ve Devnet'te test etmek için son derece uygundur.

Ayrıca, yerel veya devnet'te test ederken hesabınıza ücretsiz test SOL almak için Solana CLI komutu `solana airdrop 1` kullanabilirsiniz.

### Solana Explorer

![Solana Explorer Devnet'e ayarlı](../../../images/solana/public/assets/courses/unboxed/solana-explorer-devnet.png)

Blockchain'deki tüm işlemler, [Solana Explorer](http://explorer.solana.com) üzerinde genel olarak görüntülenebilir. Örneğin, yukarıdaki örnekte `sendAndConfirmTransaction()` tarafından döndürülen imzayı alabilir, bu imzayı Solana Explorer'da arayabilir ve şu bilgileri görebilirsiniz:

- Ne zaman gerçekleşti
- Hangi bloğa dahil edildi
- İşlem ücreti
- ve daha fazlası!

![Bir işlemin detaylarıyla Solana Explorer](../../../images/solana/public/assets/courses/unboxed/solana-explorer-transaction-overview.png)

---

## Laboratuvar

Diğer öğrencilere SOL göndermek için bir script oluşturacağız.

### Temel iskelet

Daha önce `Kriptografi Girişinde` yaptığımız aynı paketleri ve `.env` dosyasını kullanarak başlayacağız.

`transfer.ts` adında bir dosya oluşturun:

```typescript
import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
  console.log(`Lütfen göndereceğiniz bir genel anahtar girin`);
  process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log(
  `✅ Kendi anahtar çiftimizi, hedef genel anahtarı yükledik ve Solana'ya bağlandık`,
);
```

Bağlantıyı kurduğunuzdan, anahtar çiftinizi yüklendiğinden ve yüklenmesini sağlamak için scripti çalıştırın:

```bash
npx esrun transfer.ts (hedef cüzdan adresi)
```

### İşlemi oluşturun ve çalıştırın

İşlemi tamamlamak ve göndermek için aşağıdakileri ekleyin:

```typescript
console.log(
  `✅ Kendi anahtar çiftimizi, hedef genel anahtarı yükledik ve Solana'ya bağlandık`,
);

const transaction = new Transaction();

const LAMPORTS_TO_SEND = 5000;

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);

console.log(
  `💸 Tamamlandı! ${LAMPORTS_TO_SEND} gönderen adresi ${toPubkey}'ye gönderildi.`,
);
console.log(`İşlem imzası ${signature}!`);
```

### Deneyin

Diğer öğrencilere SOL gönderin.

```bash
npx esrun transfer.ts (hedef cüzdan adresi)
```

---

## Mücadele

Aşağıdaki soruları yanıtlayın:

- Transfer için ne kadar SOL alındı? Bu ne kadar USD ediyor?
- https://explorer.solana.com adresinde işleminizi bulabilir misiniz? Unutmayın ki biz `devnet` ağını kullanıyoruz.
- Transfer ne kadar sürüyor?
- "onaylı" kelimesinin ne anlama geldiğini düşünüyorsunuz?

:::success
**Laboratuvarı tamamladınız mı?**
Kodunuzu GitHub'a yükleyin ve
[bize bu dersle ilgili ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=dda6b8de-9ed8-4ed2-b1a5-29d7a8a8b415)!
:::
