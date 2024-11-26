---
sidebarLabel: JavaScript / TypeScript
title: Solana için JavaScript İstemcisi
sidebarSortOrder: 2
description:
  Solana ile JavaScript/TypeScript istemci kütüphanesi (@solana/web3.js) kullanarak nasıl etkileşimde bulunacağınızı öğrenin. Bu kılavuz, cüzdan bağlantıları, işlemler ve kod örnekleri ile özel program etkileşimlerini kapsar.
---

## Solana-Web3.js Nedir?

Solana-Web3.js kütüphanesi, Solana'nın tamamını kapsama hedefindedir. Kütüphane, `Solana JSON RPC API` üzerine inşa edilmiştir.

`@solana/web3.js` kütüphanesinin tam belgelerini [buradan](https://solana-labs.github.io/solana-web3.js/v1.x/) bulabilirsiniz.

## Yaygın Terimler

| Terim        | Tanım                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Program      | Talimatları yorumlamak için yazılan durumdan bağımsız yürütülebilir kod. Programlar, sağlanan talimatlar doğrultusunda eylemler gerçekleştirme yeteneğine sahiptir.  |
| Talimat      | Bir istemcinin bir işlemde dahil edebileceği bir programın en küçük birimi. İşleme kodu içinde bir talimat bir veya daha fazla çapraz program çağrısını içerebilir.  |
| İşlem        | Bir veya daha fazla Keypair kullanılarak istemci tarafından imzalanan ve yalnızca iki olası sonuçla atomik olarak yürütülen bir veya daha fazla talimat.                |

Tam terim listesi için `Solana terimleri` kısmına bakın.

## Başlarken

### Kurulum

#### yarn

```shell
yarn add @solana/web3.js@1
```

#### npm

```shell
npm install --save @solana/web3.js@1
```

#### Paket

```html
<!-- Geliştirme (minimleştirilmemiş) -->
<script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>

<!-- Üretim (minimleştirilmiş) -->
<script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
```

### Kullanım

#### Javascript

```javascript
const solanaWeb3 = require("@solana/web3.js");
console.log(solanaWeb3);
```

#### ES6

```javascript
import * as solanaWeb3 from "@solana/web3.js";
console.log(solanaWeb3);
```

#### Tarayıcı Paketi

```javascript
// solanaWeb3, paket scripti tarafından global ad alanında sağlanır
console.log(solanaWeb3);
```

## Hızlı Başlangıç

### Cüzdana Bağlanma

Kullanıcıların Solana'da dApp veya uygulamanızı kullanabilmeleri için anahtar çiftlerine erişmeleri gerekecek. Anahtar çifti, işlemleri imzalamak için kullanılan bir özel anahtar ile eşleşen bir genel anahtardır.

Bir anahtar çifti elde etmenin iki yolu vardır:

1. Yeni bir Anahtar Çifti oluştur
2. Gizli anahtarı kullanarak bir Anahtar Çifti elde et

Yeni bir Anahtar Çifti elde etmek için şunları kullanabilirsiniz:

```javascript
const { Keypair } = require("@solana/web3.js");

let keypair = Keypair.generate();
```

:::tip 
Bu, kullanıcı için finansman ve kullanım amacıyla tamamen yeni bir Anahtar Çifti oluşturur.
:::

Kullanıcıların gizli anahtarı bir metin kutusu aracılığıyla girmesine izin verebilir ve `Keypair.fromSecretKey(secretKey)` ile Anahtar Çiftini elde edebilirsiniz.

```javascript
const { Keypair } = require("@solana/web3.js");

let secretKey = Uint8Array.from([
  202, 171, 192, 129, 150, 189, 204, 241, 142, 71, 205, 2, 81, 97, 2, 176, 48,
  81, 45, 1, 96, 138, 220, 132, 231, 131, 120, 77, 66, 40, 97, 172, 91, 245, 84,
  221, 157, 190, 9, 145, 176, 130, 25, 43, 72, 107, 190, 229, 75, 88, 191, 136,
  7, 167, 109, 91, 170, 164, 186, 15, 142, 36, 12, 23,
]);

let keypair = Keypair.fromSecretKey(secretKey);
```

Günümüzde birçok cüzdan, kullanıcıların çeşitli eklentiler veya web cüzdanları aracılığıyla anahtar çiftlerini kullanmalarına izin verir. Genel öneri, işlemleri imzalamak için cüzdanların, anahtar çiftlerinin değil, kullanılmasıdır. Cüzdan, dApp ile anahtar çifti arasında bir ayrım katmanı oluşturur ve dApp'in asla gizli anahtara erişimini sağlamaz. 

:::info
Harici cüzdanlarla bağlantı kurmanın yollarını [wallet-adapter](https://github.com/solana-labs/wallet-adapter) kütüphanesinde bulabilirsiniz.
:::

### İşlemleri Oluşturma ve Gönderme

Solana üzerindeki programlarla etkileşimde bulunmak için işlemleri oluşturur, imzalarsınız ve ağına gönderirsiniz. İşlemler, imzalarla birlikte talimatlar koleksiyonudur. Bir işlemdeki talimatların varlık sırası, onların yürütülme sırasını belirler.

Solana-Web3.js'de bir işlem, `Transaction` nesnesi kullanılarak oluşturulur ve istenen mesajlar, adresler veya talimatlar eklenir.

Bir transfer işlemi örneğini ele alalım:

```javascript
const {
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

let fromKeypair = Keypair.generate();
let toKeypair = Keypair.generate();
let transaction = new Transaction();

transaction.add(
  SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: toKeypair.publicKey,
    lamports: LAMPORTS_PER_SOL,
  }),
);
```

Yukarıdaki kod, imzalanmaya ve ağa iletilmeye hazır bir işlem oluşturmaktadır. `SystemProgram.transfer` talimatı, gönderilecek lamport miktarını içeren işlem üzerine eklenmiştir ve `to` ve `from` genel anahtarlarını içerir.

:::tip
İşlemi imzalamak ve ağına göndermek için yalnızca bir anahtar çifti ile işlemi imzalamak ve göndermek yeterlidir.
:::

Kullanıcıyı bilgilendirmek veya bir işlem tamamlandıktan sonra bir şey yapmak isterseniz `sendAndConfirmTransaction` kullanabilir veya işlemin onaylanmasını beklemediğinizde `sendTransaction` kullanabilirsiniz.

```javascript
const {
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection,
} = require("@solana/web3.js");

let keypair = Keypair.generate();
let connection = new Connection(clusterApiUrl("testnet"));

sendAndConfirmTransaction(connection, transaction, [keypair]);
```

Yukarıdaki kod, `SystemProgram` kullanarak bir `TransactionInstruction` alır, bir `Transaction` oluşturur ve ağına gönderir. Hangi Solana ağına bağlandığınızı tanımlamak için `Connection` kullanırsınız; bunlar `mainnet-beta`, `testnet` veya `devnet`'dir.

---

### Özel Programlarla Etkileşim

Önceki bölüm, temel işlemleri göndermeyi ele alır. Solana'da yaptığınız her şey, önceki bölümdeki transfer işlemi de dahil olmak üzere farklı programlarla etkileşim halindedir. Yazıldığı tarihte, Solana üzerindeki programlar ya Rust ya da C ile yazılmıştır.

`SystemProgram`'ı inceleyelim. Rust dilinde Solana üzerindeki bir hesapta alan ayırma yöntemi imzası aşağıdaki gibidir:

```rust
pub fn allocate(
    pubkey: &Pubkey,
    space: u64
) -> Instruction
```

:::warning
Solana'da bir programla etkileşimde bulunmak istediğinizde, etkileşimde bulunacağınız tüm hesapları bilmeniz gerekir.
:::

Talimat içinde etkileşimde bulunacağınız her hesabı sağlamanız her zaman gerekir. Ayrıca, hesabın `isSigner` veya `isWritable` olup olmadığını belirtmeniz gerekir.

Yukarıdaki `allocate` yönteminde, tek bir hesap `pubkey` gereklidir ve ayrıca tahsis için bir `space` miktarı sağlanmalıdır. `allocate` yöntemi, içinde alan ayırarak hesaba yazma işlemi yapar, bu nedenle `pubkey`'nin `isWritable` olması gereklidir. `isSigner`, talimatı yürüten hesabı belirtirken gereklidir. Bu durumda, imzalayıcı, kendi içinde alan ayırma isteğinde bulunan hesaptır.

`solana-web3.js` kullanarak bu talimatı nasıl çağıracağımıza bakalım:

```javascript
let keypair = web3.Keypair.generate();
let payer = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("testnet"));

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });
```

Öncelikle, testnet üzerinde alan ayırma işlemi yapacak bir hesap oluşturmak için hesap Anahtar Çifti ve bağlantıyı ayarlıyoruz. Ayrıca, bir ödünç alan Anahtar Çifti oluşturur ve tahsis işlemi için SOL alırız.

```javascript
let allocateTransaction = new web3.Transaction({
  feePayer: payer.publicKey,
});
let keys = [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }];
let params = { space: 100 };
```

`allocateTransaction`, `keys` ve `params` nesnelerini oluşturarak bir işlem yaratıyoruz. `feePayer`, bir işlemi oluştururken işlemi kimin ödediğini belirten isteğe bağlı bir alandır; varsayılan olarak işlemin ilk imzalayanının genel anahtarıdır. `keys`, programın `allocate` işlevinin etkileşimde bulunacağı tüm hesapları temsil eder. `allocate` işlevinin ayrıca alan gerektirdiğinden, `allocate` işlevini çağırırken kullanılacak `params`'ı oluşturuyoruz.

```javascript
let allocateStruct = {
  index: 8,
  layout: struct([u32("instruction"), ns64("space")]),
};
```

Yukarıdaki yapı, yük (payload) oluşturmayı kolaylaştırmak için `@solana/buffer-layout`'ten `u32` ve `ns64` kullanılarak oluşturulmuştur. `allocate` işlevi, `space` parametresini alır. Bu işlevle etkileşimde bulunmak için verileri Buffer formatında sağlamamız gerekir. `buffer-layout` kütüphanesi, buffer'ı tahsis etme ve Solana'daki Rust programlarının yorumlayabilmesi için doğru şekilde kodlama yapmaya yardımcı olur.

:::note
Bu yapıyı inceleyelim.
:::

```javascript
{
  index: 8, /* <-- */
  layout: struct([
    u32('instruction'),
    ns64('space'),
  ])
}
```

`index`, `allocate` işlevinin `SystemProgram` için talimat enum'undaki 8. pozisyonda olduğu için 8 olarak ayarlanır.

```rust
/* https://github.com/solana-labs/solana/blob/21bc43ed58c63c827ba4db30426965ef3e807180/sdk/program/src/system_instruction.rs#L142-L305 */
pub enum SystemInstruction {
    /** 0 **/CreateAccount {/**/},
    /** 1 **/Assign {/**/},
    /** 2 **/Transfer {/**/},
    /** 3 **/CreateAccountWithSeed {/**/},
    /** 4 **/AdvanceNonceAccount,
    /** 5 **/WithdrawNonceAccount(u64),
    /** 6 **/InitializeNonceAccount(Pubkey),
    /** 7 **/AuthorizeNonceAccount(Pubkey),
    /** 8 **/Allocate {/**/},
    /** 9 **/AllocateWithSeed {/**/},
    /** 10 **/AssignWithSeed {/**/},
    /** 11 **/TransferWithSeed {/**/},
    /** 12 **/UpgradeNonceAccount,
}
```

Bir sonraki kısım, `u32('instruction')`'dır.

```javascript
{
  index: 8,
  layout: struct([
    u32('instruction'), /* <-- */
    ns64('space'),
  ])
}
```

`allocate` yapısındaki `layout`, bir talimatı çağırırken her zaman `u32('instruction')`'ı ilk eleman olarak içermelidir.

```javascript
{
  index: 8,
  layout: struct([
    u32('instruction'),
    ns64('space'), /* <-- */
  ])
}
```

`ns64('space')`, `allocate` işlevinin argümanıdır. Rust dilindeki orijinal `allocate` işlevinde alan türü `u64` olarak belirlenmiştir. `u64`, unsigned 64 bit tamsayıdır. Javascript varsayılan olarak yalnızca 53 bit tamsayılar sunar. `ns64`, Rust ve Javascript arasında tür dönüşümlerine yardımcı olmak için `@solana/buffer-layout`'ten gelir. Rust ve Javascript arasındaki diğer tür dönüşümleri [solana-labs/buffer-layout](https://github.com/solana-labs/buffer-layout) adresinde bulabilirsiniz.

```javascript
let data = Buffer.alloc(allocateStruct.layout.span);
let layoutFields = Object.assign({ instruction: allocateStruct.index }, params);
allocateStruct.layout.encode(layoutFields, data);
```

Önceden oluşturduğumuz bufferLayout'i kullanarak bir veri buffer'ı ayırabiliriz. Sonra, parametrelerimizi `{ space: 100 }` olarak atayarak doğru bir şekilde yerleşime eşleştiriyoruz ve verileri buffer'a kodluyoruz. Artık veri, programa gönderilmeye hazır.

```javascript
allocateTransaction.add(
  new web3.TransactionInstruction({
    keys,
    programId: web3.SystemProgram.programId,
    data,
  }),
);

await web3.sendAndConfirmTransaction(connection, allocateTransaction, [
  payer,
  keypair,
]);
```

Son olarak, işlem talimini tüm hesap anahtarları, ödeyici, veri ve program kimliği ile işlemeye ekliyoruz ve işlemi ağa yayınlıyoruz.

:::danger
Tam kod aşağıda bulunmaktadır.
:::

```javascript
const { struct, u32, ns64 } = require("@solana/buffer-layout");
const { Buffer } = require("buffer");
const web3 = require("@solana/web3.js");

let keypair = web3.Keypair.generate();
let payer = web3.Keypair.generate();

let connection = new web3.Connection(web3.clusterApiUrl("testnet"));

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

let allocateTransaction = new web3.Transaction({
  feePayer: payer.publicKey,
});
let keys = [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }];
let params = { space: 100 };

let allocateStruct = {
  index: 8,
  layout: struct([u32("instruction"), ns64("space")]),
};

let data = Buffer.alloc(allocateStruct.layout.span);
let layoutFields = Object.assign({ instruction: allocateStruct.index }, params);
allocateStruct.layout.encode(layoutFields, data);

allocateTransaction.add(
  new web3.TransactionInstruction({
    keys,
    programId: web3.SystemProgram.programId,
    data,
  }),
);

await web3.sendAndConfirmTransaction(connection, allocateTransaction, [
  payer,
  keypair,
]);