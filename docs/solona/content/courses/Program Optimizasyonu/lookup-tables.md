---
title: Versiyonlu İşlemler ve Adres Arama Tabloları
objectives:
  - Versiyonlu işlemler oluşturmak
  - Adres arama tabloları oluşturmak
  - Adres arama tablolarını genişletmek
  - Versiyonlu işlemlerle adres arama tablolarını kullanmak
description: "Adres arama tablolarını kullanarak büyük miktarda hesap kullanın."
---

## Özet

- Solana'daki **Versiyonlu İşlemler**, hem eski hem de yeni işlem formatlarını destekler. Orijinal formata "eski" denir, yeni formatlar ise 0 sürümünden başlamaktadır. Versiyonlu işlemler, Adres Arama Tabloları (LUT'ler) kullanımını göz önünde bulundurmak amacıyla tanıtılmıştır.
- **Adres Arama Tabloları**, diğer hesapların adreslerini saklayan özel hesaplardır. Versiyonlu işlemlerde, bu adresler tam 32 bayt adres yerine 1 baytlık bir indeksle referans alınabilir. Bu optimizasyon, önceden mümkün olandan daha karmaşık işlemlere olanak tanır.

---

## Ders

Tasarım gereği, Solana işlemleri 1232 baytla sınırlıdır. Bu limiti aşan işlemler başarısız olacaktır, bu da gerçekleştirilebilecek atomik işlemlerin boyutunu kısıtlar. Bu limit, ağ seviyesinde optimizasyonlara olanak tanırken, işlem karmaşıklığı üzerinde kısıtlamalar getirir.

İşlem boyutu kısıtlamalarını aşmak için, Solana birden fazla sürümü destekleyen yeni bir işlem formatı tanıtmıştır. Şu anda iki işlem versiyonu desteklenmektedir:

1. `legacy` - Orijinal işlem formatı
2. `0` - Adres Arama Tablolarını destekleyen en son format.

:::info
Mevcut Solana programlarının versiyonlu işlemleri desteklemek için değişiklik yapması gerekmez. Ancak, tanıtımından önce oluşturulan istemci tarafı kodlarının güncellenmesi gerekecektir.
:::

Bu derste, versiyonlu işlemlerin temellerini ve bunları nasıl kullanacağımızı inceleyeceğiz, buna dahil olarak:

- Versiyonlu işlemler oluşturma
- Adres arama tabloları oluşturma ve yönetme
- Versiyonlu işlemlerde adres arama tablolarını kullanma

### Versiyonlu İşlemler

Solana işlemlerinde en büyük alan tüketicilerinden biri, her biri 32 bayt olan hesap adresleridir. 39 hesaba sahip işlemler için boyut limiti, talimat verileri için hesaplama yapmadan bile aşılmaktadır. Genellikle, işlemler yaklaşık 20 hesap ile çok büyük hale gelir.

Versiyonlu işlemler, adreslerin ayrı saklanmasını ve 1 baytlık bir indeks aracılığıyla referans alınmasını sağlayarak bu sorunu ele alır. Bu, hesap adresleri için gerekli alanı minimize ederek işlem boyutunu büyük ölçüde azaltır.

> "Adres Arama Tabloları kullanılmasa bile, versiyonlu işlemleri anlamak, en son Solana özellikleriyle uyumluluğu sürdürmek için kritik öneme sahiptir." — Solana Dokümantasyonu

`@solana/web3.js` kütüphanesi, versiyonlu işlemler ve adres arama tabloları ile çalışmak için gerekli tüm araçları sunar.

#### Versiyonlu işlemleri oluşturma

Versiyonlu bir işlem oluşturmak için öncelikle aşağıdaki parametrelerle bir `TransactionMessage` oluşturmalısınız:

- `payerKey` - işlemi ödeyecek hesabın genel anahtarı
- `recentBlockhash` - ağdan alınan son blok hash'i
- `instructions` - işlemin gerçekleştireceği talimatlar.

Mesaj nesnesi oluşturulduktan sonra, `compileToV0Message()` metodunu kullanarak bunu bir versiyon `0` işlemine dönüştürebilirsiniz.

```typescript
import * as web3 from "@solana/web3.js";

// Örnek transfer talimatı
const transferInstruction = SystemProgram.transfer({
  fromPubkey: payer.publicKey, // Gönderen hesabın genel anahtarı
  toPubkey: toAccount.publicKey, // Alıcı hesabın genel anahtarı
  lamports: 1 * LAMPORTS_PER_SOL, // Lamport cinsinden transfer edilecek miktar
});

// En son blok hash'ini alın
const { blockhash } = await connection.getLatestBlockhash();

// İşlem mesajını oluşturun
const message = new TransactionMessage({
  payerKey: payer.publicKey, // Ödeyici hesabının genel anahtarı
  recentBlockhash: blockhash, // En son blok hash'i
  instructions: [transferInstruction], // İşlem talimatları
}).compileToV0Message();
```

Sonrasında, oluşturulan mesajı `VersionedTransaction` yapıcısına geçirerek versiyonlu bir işlem oluşturun. İşlem, ardışık olarak eski işlemlere benzer bir şekilde imzalanıp ağa gönderilir.

```typescript
// Derlenmiş mesajdan versiyonlu işlemi oluşturun
const transaction = new VersionedTransaction(message);

// İşlemi ödeyicinin anahtar çifti ile imzala
transaction.sign([payer]);

// İmzalanmış işlemi ağa gönder
const signature = await connection.sendTransaction(transaction);
```

---

### Adres Arama Tablosu

Adres Arama Tabloları (LUT'ler), diğer hesap adreslerine referansları depolayan hesaplardır. Bu LUT hesapları, Adres Arama Tablosu Programı tarafından sahiplenilir ve bir işleme dahil edilebilecek hesap sayısını artırır.

Versiyonlu işlemlerde, LUT adresleri dahil edilir ve ilave hesaplar tam 32 baytlık adres yerine 1 baytlık bir indeksle referans alınır; bu da işlemin kullandığı alanı azaltır.

`@solana/web3.js` kütüphanesi, LUT'leri yönetmek için `AddressLookupTableProgram` sınıfını sunar:

- `createLookupTable` - yeni bir LUT hesabı oluşturur.
- `freezeLookupTable` - bir LUT'yi değiştirilemez hale getirir.
- `extendLookupTable` - mevcut bir LUT'ye adres ekler.
- `deactivateLookupTable` - bir LUT için devre dışı bırakma sürecini başlatır.
- `closeLookupTable` - bir LUT hesabını kalıcı olarak kapatır.

#### Adres arama tablosu oluşturma

`createLookupTable` yöntemini kullanarak bir adres arama tablosu oluşturma talimatını oluşturabilirsiniz. Bu, aşağıdaki parametreleri gerektirir:

- `authority` - adres arama tablosunu değiştirme yetkisine sahip olan hesap.
- `payer` - hesap oluşturma ücretlerini ödeyecek olan hesap.
- `recentSlot` - adres arama tablosunun adresini türetmek için kullanılan son slot.

Fonksiyon, LUT oluşturma talimatını ve adresini döndürür.

```typescript
// Mevcut slotu alın
const slot = await connection.getSlot();

// Adres arama tablosu oluşturma talimatını oluşturun ve adresini alın
const [lookupTableInst, lookupTableAddress] =
  AddressLookupTableProgram.createLookupTable({
    authority: user.publicKey, // LUT'yi değiştirmeye yetkili olan hesap
    payer: user.publicKey, // İşlem ücretlerini ödeyen hesap
    recentSlot: slot - 1, // LUT adresini türetmek için son slotu kullanın
  });
```

Altta, LUT adresi, `authority` ve `recentSlot`'u tohum olarak kullanan bir Program Türetilmiş Adres (PDA) ile üretilir.

```typescript
const [lookupTableAddress, bumpSeed] = PublicKey.findProgramAddressSync(
  [params.authority.toBuffer(), toBufferLE(BigInt(params.recentSlot), 8)],
  this.programId,
);
```


Önemli Not
En son slotu kullanmak bazen işlemi gönderirken hatalara yol açabilir. Bunun önlenmesi için genellikle en son slotun bir öncesini kullanmak önerilir (`recentSlot: currentSlot - 1`). Eğer işlemi gönderirken hatalarla karşılaşırsanız, yeniden göndermeyi deneyin.


```
"Program AddressLookupTab1e1111111111111111111111111 invoke [1]",
"188115589 is not a recent slot",
"Program AddressLookupTab1e1111111111111111111111111 failed: invalid instruction data";
```

#### Adres arama tablosunu genişletme

`extendLookupTable` yöntemi, mevcut bir adres arama tablosuna adres eklemek için bir talimat oluşturur. Şu parametreleri gerektirir:

- `payer` - işlem ücretlerini ve ek kira bedellerini ödeyen hesap.
- `authority` - adres arama tablosunu değiştirmeye yetkili olan hesap.
- `lookupTable` - genişletilecek adres arama tablosunun adresi.
- `addresses` - adres arama tablosuna eklenecek adreslerin listesi.

Fonksiyon, adres arama tablosunu genişletmek için bir talimat döndürür.

```typescript
const addresses = [
  new PublicKey("31Jy3nFeb5hKVdB4GS4Y7MhU7zhNMFxwF7RGVhPc1TzR"),
  new PublicKey("HKSeapcvwJ7ri6mf3HwBtspLFTDKqaJrMsozdfXfg5y2"),
  // Buraya daha fazla adres ekleyin
];

// Sağlanan adreslerle adres arama tablosunu genişletmek için talimat oluşturun
const extendInstruction = AddressLookupTableProgram.extendLookupTable({
  payer: user.publicKey, // İşlem ücretlerini ödeyen hesap
  authority: user.publicKey, // Adres arama tablosunu değiştirmeye yetkili hesap
  lookupTable: lookupTableAddress, // Genişletilecek adres arama tablosunun adresi
  addresses: addresses, // Adres arama tablosuna eklenecek adresler
});
```

Dikkat edilmesi gereken bir nokta, bir adres arama tablosunu genişletirken, tek bir talimatta eklenebilecek adres sayısının 1232 baytlık işlem boyutu limiti ile sınırlı olduğudur. Tek bir işlemede yaklaşık 30 adres eklenebilir. Daha fazlasını eklemek gerektiğinde, birden fazla işlem gereklidir. Her adres arama tablosu en fazla 256 adres depolayabilir.

#### İşlem gönderme

Talimatları oluşturduktan sonra, bunları bir işleme ekleyebilir ve ağına gönderebilirsiniz:

```typescript
// En son blok hash'ini alın
const { blockhash } = await connection.getLatestBlockhash();

// İşlem mesajını oluşturun
const message = new TransactionMessage({
  payerKey: payer.publicKey, // İşlem ücreti ödeyen hesap
  recentBlockhash: blockhash, // En yeni blok hash'i
  instructions: [lookupTableInst, extendInstruction], // İşlemlere dahil edilecek talimatlar
}).compileToV0Message();

// Mesajdan versiyonlu işlemi oluşturun
const transaction = new VersionedTransaction(message);

// İşlemi imzala
transaction.sign([payer]);

// İmzalanmış işlemi ağa gönder
const transactionSignature = await connection.sendTransaction(transaction);
```

Adres arama tablolarını oluşturduktan veya genişlettikten sonra, bir işlemede kullanılmadan önce bir slot boyunca "ısınması" gerektiğini unutmayın. Siz sadece önceden mevcut slotlarda adres arama tablolarına ve eklenen adreslere erişebilirsiniz.

Aşağıdaki hatayla karşılaşırsanız, bu, bir adres arama tablosuna veya bir adrese ısınma süreci tamamlanmadan erişmeye çalıştığınızın bir göstergesi olabilir:

```typescript
SendTransactionError: failed to send transaction: invalid transaction: Transaction address table lookup uses an invalid index
```

Bu sorunu önlemek için, adres arama tablasını genişlettikten sonra bir işlemde tabloya referans vermeden önce bir gecikme eklediğinizden emin olun.

#### Adres arama tablosunu devre dışı bırakma

Adres arama tablosunun (LUT) artık gerekli olmadığında, kira bakiyesini geri almak için devre dışı bırakabilirsiniz. Bir LUT'yi devre dışı bırakmak, 513 slot boyunca kullanılabilir durumda kalacağı bir "soğuma" dönemine koyar. Bu, işlemlerin aynı slot içinde LUT'leri devre dışı bırakıp yeniden oluşturarak sansürlenmesini önler.

Bir LUT'yi devre dışı bırakmak için `deactivateLookupTable` metodunu şu parametrelerle kullanın:

- `lookupTable` - devre dışı bırakılacak LUT'nin adresi.
- `authority` - LUT'yi devre dışı bırakma yetkisine sahip olan hesap.

```typescript
const deactivateInstruction = AddressLookupTableProgram.deactivateLookupTable({
  lookupTable: lookupTableAddress, // Devre dışı bırakılacak LUT'nin adresi
  authority: user.publicKey, // Adres arama tablosunu değiştirme yetkisi olan hesap
});
```

#### Adres arama tablosunu kapatma

Bir LUT devre dışı bırakıldığında ve soğuma süresi geçtikten sonra, kira bakiyesini geri almak için adres arama tablosunu kapatabilirsiniz. `closeLookupTable` metodunu kullanın, bu metot şu parametreleri gerektirir:

- `lookupTable` - kapatılacak LUT'nin adresi.
- `authority` - LUT'yi kapatma yetkisine sahip olan hesap.
- `recipient` - geri alınan kira bakiyesini alacak hesap.

```typescript
const closeInstruction = AddressLookupTableProgram.closeLookupTable({
  lookupTable: lookupTableAddress, // Kapatılacak LUT'nin adresi
  authority: user.publicKey, // LUT'yi kapatma yetkisi olan hesap
  recipient: user.publicKey, // Geri alınan kira bakiyesini alacak hesap
});
```

Bir LUT tamamen devre dışı bırakılmadan kapatılmaya çalışılırsa, aşağıdaki hatayla karşılaşılacaktır:

```
"Program AddressLookupTab1e1111111111111111111111111 invoke [1]",
"Table cannot be closed until it's fully deactivated in 513 blocks",
"Program AddressLookupTab1e1111111111111111111111111 failed: invalid program argument";
```

#### Adres arama tablosunu dondurma

Standart CRUD işlemlerinin yanı sıra, bir adres arama tablosunu "dondurabilirsiniz". Bu, artık genişletilemeyecek, devre dışı bırakılamayacak veya kapatılamayacak hale getirir.

Bu işlem için `freezeLookupTable` metodu kullanılır ve aşağıdaki parametreleri alır:

- `lookupTable` - dondurulacak LUT'nin adresi.
- `authority` - LUT'yi dondurmaya yetkili olan hesap.

```typescript
const freezeInstruction = AddressLookupTableProgram.freezeLookupTable({
  lookupTable: lookupTableAddress, // Dondurulacak LUT'nin adresi
  authority: user.publicKey, // LUT'yi dondurmaya yetkili olan hesap
});
```

Bir LUT dondurulduğunda, herhangi bir değişiklik girişimi şu hata gibi bir sonuç verecektir:

```
"Program AddressLookupTab1e1111111111111111111111111 invoke [1]",
"Lookup table is frozen",
"Program AddressLookupTab1e1111111111111111111111111 failed: Account is immutable";
```

#### Versiyonlu işlemlerde adres arama tablolarını kullanma

Bir adres arama tablosunu versiyonlu bir işlemde kullanmak için, önce adresi kullanarak adres arama tablosu hesabını almak gerekir:

```typescript
// Adresini kullanarak blok zincirinden adres arama tablosu hesabını al
const lookupTableAccount = (
  await connection.getAddressLookupTable(new PublicKey(lookupTableAddress))
).value;
```

Adres arama tablosu hesabını aldıktan sonra, işlem için talimatların listesini oluşturabilirsiniz. `TransactionMessage`'i oluştururken, adres arama tablosu hesaplarını `compileToV0Message()` metoduna bir dizi olarak aktarın. Gerekirse birden fazla adres arama tablosu hesabı ekleyebilirsiniz.

```typescript
const message = new web3.TransactionMessage({
  payerKey: payer.publicKey, // İşlemi ödeyen hesabın genel anahtarı
  recentBlockhash: blockhash, // En son blok hash'i
  instructions: instructions, // İşlemlere dahil edilecek talimatlar
}).compileToV0Message([lookupTableAccount]); // Adres arama tablolarını dahil et

// Derlenmiş mesajı kullanarak versiyonlu bir işlem oluşturun
const transaction = new web3.VersionedTransaction(message);

// İşlemi imzala
transaction.sign([payer]);

// İmzalanmış işlemi ağa gönder
const transactionSignature = await connection.sendTransaction(transaction);
```

---

## Laboratuvar

Şimdi adres arama tablolarını kullanma pratiği yapalım!

Bu laboratuvar, versiyonlu bir işlemde adres arama tablosu oluşturma, genişletme ve kullanma konularında sizi yönlendirecektir.

#### 1. `try-large-transaction.ts` dosyasını oluşturun

Başlamak için, proje dizininde `try-large-transaction.ts` adında yeni bir dosya oluşturun. Bu dosya, bir eski işlemin 22 alıcıya SOL transfer etmek için oluşturulduğu bir senaryoyu gösterecek kodu içerecektir. İşlem, her bir alıcıya (imzalayan) SOL transfer eden 22 ayrı talimat içerecektir.

Bu örnek, tek bir işlemin içinde birçok hesap adresini barındırırken eski işlemlerin önemli bir kısıtlamasını vurgular. Beklendiği gibi, bu işlemi göndermeye çalışırken, işlem boyut sınırlarını aşacağı için muhtemelen başarısız olacaktır.

İşte `try-large-transaction.ts` dosyasına eklemeniz gereken kod:

```typescript filename="try-large-transaction.ts"
import {
  Connection,
  clusterApiUrl,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  initializeKeypair,
  makeKeypairs,
  getExplorerLink,
} from "@solana-developers/helpers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  // Yerel Solana kümesine bağlan
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Ortam değişkenlerinden anahtar çiftini başlat veya yeni bir tane oluştur
  const payer = await initializeKeypair(connection);

  // makeKeypairs kullanarak 22 alıcı anahtar çifti oluştur
  const recipients = makeKeypairs(22).map(keypair => keypair.publicKey);

  // Eski bir işlem oluştur
  const transaction = new Transaction();

  // İşleme 22 transfer talimatı ekle
  recipients.forEach(recipient => {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient,
        lamports: LAMPORTS_PER_SOL * 0.01, // Her alıcıya 0.01 SOL aktar
      }),
    );
  });

  // İşlemi imzala ve gönder
  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      payer,
    ]);
    console.log(
      `İşlem başarılı, imza: ${getExplorerLink("tx", signature, "devnet")}`,
    );
  } catch (error) {
    console.error("İşlem başarısız:", error);
  }
}
```

Örneği çalıştırmak için `npx esrun try-large-transaction.ts` komutunu çalıştırın. Bu işlem:

- Yeni bir anahtar çifti oluşturacaktır.
- Anahtar çifti ayrıntılarını `.env` dosyasına kaydedecektir.
- Üretilen anahtar çiftine devnet SOL airdrop isteyecektir.
- İşlemi göndermeye çalışacaktır.
- İşlem 22 talimat içerdiğinden, "İşlem çok büyük" hatası ile başarısız olması beklenmektedir.

```
Creating .env file
Current balance is 0
Airdropping 1 SOL...
New balance is 1
PublicKey: 7YsGYC4EBs6Dxespe4ZM3wfCp856xULWoLw7QUcVb6VG
Error: Transaction too large: 1244 > 1232
```

#### 2. `use-lookup-tables.ts` dosyasını oluşturun

Sonraki adımda, adres arama tablolarını versiyonlu işlemlerle birleştirerek, eski işlemlerin sınırlamalarını aşmayı ve tek bir işlemde daha fazla adres eklemeyi nasıl kullanacağımıza bakacağız.

Proje dizininde `use-lookup-tables.ts` adında yeni bir dosya oluşturun. Bu dosyaya adres arama tablolarının kullanımını gösterecek kodu ekleyeceksiniz.

İşte `use-lookup-tables.ts` dosyasına eklemeniz gereken başlangıç kodu:

```typescript filename="use-lookup-tables.ts"
import {
  Connection,
  clusterApiUrl,
  Keypair,
  TransactionInstruction,
  AddressLookupTableAccount,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
  AddressLookupTableProgram,
  LAMPORTS_PER_SOL,
  getSlot,
} from "@solana/web3.js";
import {
  initializeKeypair,
  makeKeypairs,
  getExplorerLink,
} from "@solana-developers/helpers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  // Yerel Solana kümesine bağlan
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Ortam değişkenlerinden anahtar çiftini başlat veya yeni bir tane oluştur
  const payer = await initializeKeypair(connection);

  // makeKeypairs kullanarak 22 alıcı anahtar çifti oluştur
  const recipients = makeKeypairs(22).map(keypair => keypair.publicKey);
}
```

Sonraki adımda, versiyonlu işlemler ve adres arama tabloları ile çalışmak için gerekli olacak birkaç yardımcı fonksiyon oluşturacağız. Bu fonksiyonlar, sürecimizi basitleştirmek ve kodumuzu daha modüler ve yeniden kullanılabilir hale getirmek için önemli olacak.

#### 3. `sendV0Transaction` yardımcı fonksiyonunu oluşturun

Versiyonlu işlemleri işlemek için, `use-lookup-tables.ts` dosyasında `sendV0Transaction` adıyla bir yardımcı fonksiyon oluşturacağız. Bu fonksiyon, süreci basitleştirmek için aşağıdaki parametreleri alacaktır:

- `connection`: küme için Solana bağlantısı (örneğin, devnet).
- `user`: işlemi imzalayan kullanıcının (ödeyen) anahtar çifti.
- `instructions`: işlemde dahil edilecek TransactionInstruction nesnelerinin bir dizisi.
- `lookupTableAccounts` (isteğe bağlı): ek adreslere atıfta bulunmak için bir lookup table hesapları dizisi.

:::tip
Bu yardımcı fonksiyon, işlemleri daha etkili bir şekilde yönetmek için optimizedir.
:::

Bu yardımcı fonksiyon:

- Solana ağından en son blockhash ve son geçerli block yüksekliğini alacaktır.
- Verilen talimatları kullanarak versiyonlu bir işlem mesajı derleyecektir.
- İşlemi kullanıcının anahtar çifti ile imzalayacaktır.
- İşlemi ağa gönderecektir.
- İşlemi onaylayacak ve Solana Explorer kullanarak işlemin URL'sini kaydedecektir.

```typescript filename="use-lookup-tables.ts"
async function sendV0Transaction(
  connection: Connection,
  user: Keypair,
  instructions: TransactionInstruction[],
  lookupTableAccounts?: AddressLookupTableAccount[],
) {
  // En son blockhash ve son geçerli block yüksekliğini al

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  // Sağlanan talimatlarla yeni bir işlem mesajı oluştur
  const messageV0 = new TransactionMessage({
    payerKey: user.publicKey, // Payer (yani işlem ücretlerini ödeyen hesap)
    recentBlockhash: blockhash, // En son blokun blockhash'i
    instructions, // İşlemde dahil edilecek talimatlar
  }).compileToV0Message(lookupTableAccounts);

  // Mesajdan bir versiyonlu işlem oluştur
  const transaction = new VersionedTransaction(messageV0);

  // Yardımcı fonksiyonu kullanarak işlemi gönder ve onayla
  const txid = await sendAndConfirmTransactionV0(
    connection,
    transaction,
    [user],
    {
      commitment: "finalized", // İşlemin en yüksek seviyede onaylandığını sağlar
    },
  );

  // Yardımcıyı kullanarak Solana Explorer'da işlem URL'sini kaydet
  const explorerLink = getExplorerLink("tx", txid, "devnet");
  console.log(
    `İşlem başarılı! Solana Explorer'da görüntüleyin: ${explorerLink}`,
  );
}
```

#### 4. `waitForNewBlock` yardımcı fonksiyonunu oluşturun

Lookup tabloları ile çalışırken, yeni oluşturulmuş veya genişletilmiş lookup tablolarının hemen kullanılamayacağını hatırlamak önemlidir. Bu nedenle, bu tabloları referans gösteren işlemleri göndermeden önce yeni bir bloğun üretilmesini beklememiz gerekecek.

`waitForNewBlock` adıyla bir yardımcı fonksiyon oluşturacağız ve bu fonksiyon aşağıdaki parametreleri alacaktır:

- `connection`: Solana ağ bağlantısı.
- `targetBlockHeight`: beklenilecek hedef block yüksekliği.

Bu fonksiyon:

- Ağın mevcut block yüksekliğini her saniyede bir (1000ms) kontrol eden bir döngü başlatacaktır.
- Mevcut block yüksekliği hedef block yüksekliğini aştığında vaadini yerine getirecektir.

```typescript filename="use-lookup-tables.ts"
async function waitForNewBlock(
  connection: Connection,
  targetHeight: number,
): Promise<void> {
  console.log(`Yeni ${targetHeight} blok için bekleniyor...`);

  // Blockchain’in ilk block yüksekliğini al
  const { lastValidBlockHeight: initialBlockHeight } =
    await connection.getLatestBlockhash();

  return new Promise(resolve => {
    const SECOND = 1000;
    const checkInterval = 1 * SECOND; // Yeni blokları kontrol etme aralığı (1000ms)

    // Yeni blok yüksekliklerini kontrol etmek için bir aralık ayarla
    const intervalId = setInterval(async () => {
      try {
        // Mevcut block yüksekliğini al
        const { lastValidBlockHeight: currentBlockHeight } =
          await connection.getLatestBlockhash();

        // Eğer mevcut block yüksekliği hedefi aşarsa, çöz ve aralığı temizle
        if (currentBlockHeight >= initialBlockHeight + targetHeight) {
          clearInterval(intervalId);
          console.log(`Yeni block yüksekliği ulaşıldı: ${currentBlockHeight}`);
          resolve();
        }
      } catch (error) {
        console.error("Block yüksekliğini alırken hata oluştu:", error);
        clearInterval(intervalId);
        resolve(); // Hata durumunda takılmamayı sağlamak için çöz
      }
    }, checkInterval);
  });
}
```

#### 5. `initializeLookupTable` fonksiyonunu oluşturun

Sonraki adım olarak, alıcıların adreslerini tutmak için bir lookup tablosu başlatmamız gerekiyor. `initializeLookupTable` fonksiyonu aşağıdaki parametreleri alacaktır:

- `user`: kullanıcının anahtar çifti (ödeyen ve yetki sahibi).
- `connection`: Solana ağ bağlantısı.
- `addresses`: lookup tablosuna eklemek için bir alıcı adresleri (pubkey) dizisi.

Bu fonksiyon:

- Lookup tablosunun adresini türetmek için mevcut slotu alacaktır.
- Sağlanan alıcı adresleri ile birlikte lookup tablosunun oluşturulması ve genişletilmesi için gerekli talimatları oluşturacaktır.
- Bu talimatları içeren bir işlemi gönderecek ve onaylayacaktır.
- Oluşturulan yeni lookup tablosunun adresini döndürecektir.

İşlem tüm alıcı adreslerini içerse de, lookup tablosunu kullanmak Solana’nın bu adreslere gerçek işlemde çok daha az bayt ile atıfta bulunmasına olanak tanır. Lookup tablosunu versiyonlu işleme dahil ederek, çerçeve işlem boyutunu optimize eder, adreslerin yerini lookup tablosuna işaret eden işaretçilerle değiştirir.

:::info
Lookup tabloları, büyük işlem gruplarını yönetmek için önemli bir araçtır.
:::

```typescript filename="use-lookup-tables.ts"
async function initializeLookupTable(
  user: Keypair,
  connection: Connection,
  addresses: PublicKey[],
): Promise<PublicKey> {
  // @solana/web3.js kütüphanesinden yardımcı bir fonksiyon kullanarak mevcut slotu al
  const slot = await getSlot(connection);

  // Bir lookup tablosu oluşturmak için bir talimat oluştur
  // ve yeni lookup tablosunun adresini al
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: user.publicKey, // Lookup tablosunu değiştirme yetkisi
      payer: user.publicKey, // İşlem ücretleri için ödeyen
      recentSlot: slot - 1, // Lookup tablosunun adresini türetmek için slot
    });

  console.log("Lookup Tablosu Adresi:", lookupTableAddress.toBase58());

  // Sağlanan adreslerle birlikte bir lookup tablosunu genişletmek için bir talimat oluştur
  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: user.publicKey, // İşlem ücretlerinin ödeyeni
    authority: user.publicKey, // Lookup tablosunu genişletme yetkisi
    lookupTable: lookupTableAddress, // Genişletilecek lookup tablosunun adresi
    addresses: addresses.slice(0, 30), // Her talimata en fazla 30 adres ekle
  });

  // Versiyonlu işlemi göndermek için yardımcı fonksiyonu kullan
  await sendVersionedTransaction(connection, user, [
    lookupTableInst,
    extendInstruction,
  ]);

  return lookupTableAddress;
}
```

#### 6. `main` fonksiyonunu lookup tabloları kullanacak şekilde değiştirin

Yardımcı fonksiyonlar yerinde olduğuna göre, artık `main` fonksiyonunu versiyonlu işlemleri ve adres lookup tablolarını kullanacak şekilde değiştirmeye hazırız. Bunu yapmak için aşağıdaki adımları takip edeceğiz:

1. `initializeLookupTable` çağrısını yapın: Alıcıların adresleri ile lookup tablosunu oluşturun ve genişletin.
2. `waitForNewBlock` çağrısını yapın: Yeni bir bloğun gelmesini bekleyerek lookup tablosunun etkin hale gelmesini sağlayın.
3. Lookup Tablosunu Alın: `connection.getAddressLookupTable` kullanarak lookup tablosunu alacak ve işlemlerde referans göstereceğiz.
4. Transfer Talimatları Oluşturun: Her alıcı için bir transfer talimatı oluşturun.
5. Versiyonlu İşlemi Gönderin: `sendV0Transaction` kullanarak lookup tablosunu referans göstererek tüm transfer talimatları ile tek bir işlem gönderin.

```typescript filename="use-lookup-tables.ts"
async function main() {
  // devnet Solana kümesine bağlan
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Çevresel değişkenden anahtar çiftini oluştur veya yeni bir tane oluştur
  const payer = await initializeKeypair(connection);

  // makeKeypairs kullanarak 22 alıcı anahtar çifti oluştur
  const recipients = makeKeypairs(22).map(keypair => keypair.publicKey);
  // Oluşturulan alıcılar ile lookup tablosunu başlat
  const lookupTableAddress = await initializeLookupTable(
    user,
    connection,
    recipients,
  );

  // Lookup tablosunu kullanmadan önce yeni bir bloğun gelmesini bekleyin
  await waitForNewBlock(connection, 1);

  // Lookup tablosu hesabını alın
  const lookupTableAccount = (
    await connection.getAddressLookupTable(lookupTableAddress)
  ).value;

  // Lookup tablosunun başarıyla alındığını kontrol et
  if (!lookupTableAccount) {
    throw new Error("Lookup tablosu bulunamadı");
  }

  // Her alıcı için transfer talimatları oluştur
  const transferInstructions = recipients.map(recipient =>
    SystemProgram.transfer({
      fromPubkey: user.publicKey, // Ödeyen
      toPubkey: recipient, // Alıcı
      lamports: LAMPORTS_PER_SOL * 0.01, // Transfer edilecek miktar
    }),
  );

  // Lookup tablosunu içeren versiyonlu işlemi gönder
  const txid = await sendVersionedTransaction(
    connection,
    user,
    transferInstructions,
    [lookupTableAccount],
  );

  // Kolay erişim için işlem bağlantısını kaydet
  console.log(`İşlem URL'si: ${getExplorerLink("tx", txid, "devnet")}`);
}
```

Tam alıcı adresleri ile transfer talimatları oluşturacak olsak da, lookup tablolarını kullanmak, `@solana/web3.js` çerçevesinin işlem boyutunu optimize etmesine olanak tanır. İşlemdeki adresler lookup tablosuyla eşleştiğinde, bu adresler lookup tablosuna referans veren kompakt işaretçilerle değiştirilir. Bunu yaparak, adresler son işlemde yalnızca bir bayt kullanılarak temsil edilir, böylece işlemin boyutunu önemli ölçüde azaltır.

```bash
npx esrun use-lookup-tables.ts
```

Çıkışın aşağıdakine benzer bir şey görmelisiniz:

```bash
Geçerli bakiye 1.38866636
PublicKey: 8iGVBt3dcJdp9KfyTRcKuHY6gXCMFdnSG2F1pAwsUTMX
lookup tablosu adresi: Cc46Wp1mtci3Jm9EcH35JcDQS3rLKBWzy9mV1Kkjjw7M
https://explorer.solana.com/tx/4JvCo2azy2u8XK2pU8AnJiHAucKTrZ6QX7EEHVuNSED8B5A8t9GqY5CP9xB8fZpTNuR7tbUcnj2MiL41xRJnLGzV?cluster=devnet
Yeni 1 blok bekleniyor
https://explorer.solana.com/tx/rgpmxGU4QaAXw9eyqfMUqv8Lp6LHTuTyjQqDXpeFcu1ijQMmCH2V3Sb54x2wWAbnWXnMpJNGg4eLvuy3r8izGHt?cluster=devnet
Başarıyla tamamlandı
```

Konsoldaki ilk işlem bağlantısı, lookup tablosunun oluşturulması ve genişletilmesi için olan işlemi temsil eder. İkinci işlem ise tüm alıcılara yapılan transferleri temsil eder. Bu işlemleri incelemek için explorerı kullanabilirsiniz.

Unutmayın, başlangıç kodunu ilk indirdiğinizde bu işlem başarısız oluyordu. Artık lookup tablolarını kullandığımıza göre, tüm 22 transferi tek bir işlemde yapabiliriz.

#### 7. Lookup tablosuna daha fazla adres ekleyin

Unutmayın ki, şu ana kadar geliştirdiğimiz çözüm, yalnızca 30 hesaba kadar transferleri destekliyor çünkü yalnızca bir kez lookup tablosunu genişletiyoruz. Transfer talimatı boyutunu hesaba kattığınızda, aslında lookup tablosunu ek bir 27 adresle genişletmek ve 57 alıcıya kadar atomik bir transfer gerçekleştirmek mümkün. Bu desteği şimdi ekleyelim!

Yapmamız gereken tek şey `initializeLookupTable` fonksiyonuna gidip iki şey yapmak:

1. `extendLookupTable` çağrısını, yalnızca ilk 30 adresi ekleyecek şekilde değiştirin (bunun ötesinde işlem çok büyük olacak)
2. Tüm adresler eklenene kadar her seferinde 30 adres genişleten bir döngü ekleyin

```typescript filename="use-lookup-tables.ts"
async function initializeLookupTable(
  user: Keypair,
  connection: Connection,
  addresses: PublicKey[],
): Promise<PublicKey> {
  // Mevcut slotu al
  const slot = await connection.getSlot();

  // Lookup tablosunu oluştur ve adresini al
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: user.publicKey, // Lookup tablosunu değiştirme yetkisi
      payer: user.publicKey, // İşlem ücretleri için ödeyen
      recentSlot: slot - 1, // Lookup tablosunun adresini türetmek için son slot
    });
  console.log("Lookup tablosu adresi:", lookupTableAddress.toBase58());

  // Lookup tablosunu partiler halinde genişletmek için yardımcı fonksiyon
  const extendLookupTable = async (remainingAddresses: PublicKey[]) => {
    while (remainingAddresses.length > 0) {
      const toAdd = remainingAddresses.slice(0, 30); // En fazla 30 adres ekle
      remainingAddresses = remainingAddresses.slice(30);

      const extendInstruction = AddressLookupTableProgram.extendLookupTable({
        payer: user.publicKey,
        authority: user.publicKey,
        lookupTable: lookupTableAddress,
        addresses: toAdd,
      });

      // Yeni adreslerle lookup tablosunu genişletmek için işlemi gönder
      await sendVersionedTransaction(connection, user, [extendInstruction]);
    }
  };

  // İlk 30 adresi ekleyerek lookup tablosunu oluşturmak için başlangıç işlemini gönder
  const initialBatch = addresses.slice(0, 30);
  const remainingAddresses = addresses.slice(30);

  await sendVersionedTransaction(connection, user, [lookupTableInst]);

  // Kalan adresleri varsa lookup tablosunu genişletin
  await extendLookupTable(initialBatch);
  await extendLookupTable(remainingAddresses);

  return lookupTableAddress;
}
```

Tebrikler! Bu laboratuvar ile ilgili kendinizi iyi hissediyorsanız, muhtemelen lookup tabloları ve versiyonlu işlemlerle başa çıkmaya hazırsınız. Nihai çözüm kodunu incelemek istiyorsanız, [çözüm dalında bulabilirsiniz](https://github.com/Unboxed-Software/solana-versioned-transactions/tree/solution).

## Zorluk

Bir zorluk olarak, lookup tablolarını devre dışı bırakmayı, kapatmayı ve dondurmayı deneyin. Bir lookup tablosunu kapatmadan önce onun devre dışı kalmasını beklemeniz gerektiğini unutmayın. Ayrıca, bir lookup tablosu donmuşsa, değiştirilemez (devre dışı bırakılabilir veya kapatılabilir), bu nedenle ayrı testler yapmanız veya ayrı lookup tabloları kullanmanız gerekecektir.

1. Lookup tablosunu devre dışı bırakmak için bir fonksiyon oluşturun.
2. Lookup tablosunu kapatmak için bir fonksiyon oluşturun.
3. Lookup tablosunu dondurmak için bir fonksiyon oluşturun.
4. Fonksiyonları `main()` fonksiyonunda çağırarak test edin.

:::warning
İşlemi göndermek ve lookup tablosunun etkinleştirilmesini/devre dışı bırakılmasını beklemek için laboratuvarımızda oluşturduğumuz fonksiyonları yeniden kullanabilirsiniz.
:::

Bu [çözüm koduna](https://github.com/Unboxed-Software/versioned-transaction/tree/challenge) göz atmanızda özgürsünüz.


Kodunuzu GitHub'a gönderin ve 
[bize bu ders hakkında ne düşündüğünüzü bildirin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=b58fdd00-2b23-4e0d-be55-e62677d351ef)!
