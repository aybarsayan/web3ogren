---
title: Web3.js API Örnekleri
description:
  solana/web3.js kütüphanesini kullanarak Solana blockchain'i ile etkileşim kurmayı
  pratik kod örnekleri ve açıklamalarla öğrenin.
---

## Web3 API Referans Kılavuzu

`@solana/web3.js` kütüphanesi, 
`Solana JSON RPC API` ile ilgili bir pakettir.

`@solana/web3.js` kütüphanesinin tam belgesini 
[burada](https://solana-labs.github.io/solana-web3.js/v1.x/) bulabilirsiniz.

---

## Genel

### Bağlantı

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html)

Bağlantı, `Solana JSON RPC` ile etkileşim kurmak için kullanılır. Bağlantıyı kullanarak işlemleri onaylayabilir, hesap bilgilerini alabilir ve daha fazlasını yapabilirsiniz.

Bağlantıyı, JSON RPC küme son noktası ve istenen taahhüt belirleyerek oluşturursunuz. Bu tamamlandığında, bu bağlantı nesnesini Solana JSON RPC API'si ile etkileşim kurmak için kullanabilirsiniz.

#### Örnek Kullanım

```javascript
const web3 = require("@solana/web3.js");

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let slot = await connection.getSlot();
console.log(slot);
// 93186439

let blockTime = await connection.getBlockTime(slot);
console.log(blockTime);
// 1630747045

let block = await connection.getBlock(slot);
console.log(block);

/*
{
    blockHeight: null,
    blockTime: 1630747045,
    blockhash: 'AsFv1aV5DGip9YJHHqVjrGg6EKk55xuyxn2HeiN9xQyn',
    parentSlot: 93186438,
    previousBlockhash: '11111111111111111111111111111111',
    rewards: [],
    transactions: []
}
*/

let slotLeader = await connection.getSlotLeader();
console.log(slotLeader);
//49AqLYbpJYc2DrzGUAH1fhWJy62yxBxpLEkfJwjKy2jr
```

Yukarıdaki örnek, Bağlantı üzerindeki bazı yöntemleri göstermektedir. Tam liste için 
[kaynak oluşturulan belgeleri](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html) kontrol edin.

### İşlem

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html)

Bir işlem, Solana blockchain'deki programlarla etkileşim kurmak için kullanılır. Bu işlemler, etkileşimde bulunulabilecek tüm hesapların yanı sıra gereken verileri veya program adreslerini içeren TransactionInstructions ile oluşturulur. Her TransactionInstruction, anahtarlar, veriler ve bir programId içerir. Tek bir işlemde birden fazla talimat yapabilir, birden fazla programla aynı anda etkileşimde bulunabilirsiniz.

#### Örnek Kullanım

```javascript
const web3 = require("@solana/web3.js");
const nacl = require("tweetnacl");

// İşlem ücretlerini ödemek için SOL dağıtımı
let payer = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

let toAccount = web3.Keypair.generate();

// Basit İşlem Oluşturma
let transaction = new web3.Transaction();

// Uygulamak için bir talimat ekleyin
transaction.add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }),
);

// İşlemi gönderin ve onaylayın
// Not: feePayer varsayılan olarak ilk imzalayan veya, parametre ayarlanmadıysa, ödeyendir.
await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

// Alternatif olarak, işlemi manuel olarak oluşturun
let recentBlockhash = await connection.getLatestBlockhash();
let manualTransaction = new web3.Transaction({
  recentBlockhash: recentBlockhash.blockhash,
  feePayer: payer.publicKey,
});
manualTransaction.add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }),
);

let transactionBuffer = manualTransaction.serializeMessage();
let signature = nacl.sign.detached(transactionBuffer, payer.secretKey);

manualTransaction.addSignature(payer.publicKey, signature);

let isVerifiedSignature = manualTransaction.verifySignatures();
console.log(`İmzalar doğrulandı: ${isVerifiedSignature}`);

// İmzalar doğrulandı: true

let rawTransaction = manualTransaction.serialize();

await web3.sendAndConfirmRawTransaction(connection, rawTransaction);
```

### Anahtar Çifti

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Keypair.html)

Anahtar çifti, Solana içinde bir genel anahtar ve gizli anahtar ile bir hesap oluşturmak için kullanılır. Anahtar çiftini oluşturabilir, bir tohumdan üretebilir veya bir gizli anahtardan oluşturabilirsiniz.

#### Örnek Kullanım

```javascript
const { Keypair } = require("@solana/web3.js");

let account = Keypair.generate();

console.log(account.publicKey.toBase58());
console.log(account.secretKey);

// 2DVaHtcdTf7cm18Zm9VV8rKK4oSnjmTkKE6MiXe18Qsb
// Uint8Array(64) [
//   152,  43, 116, 211, 207,  41, 220,  33, 193, 168, 118,
//    24, 176,  83, 206, 132,  47, 194,   2, 203, 186, 131,
//   197, 228, 156, 170, 154,  41,  56,  76, 159, 124,  18,
//    14, 247,  32, 210,  51, 102,  41,  43,  21,  12, 170,
//   166, 210, 195, 188,  60, 220, 210,  96, 136, 158,   6,
//   205, 189, 165, 112,  32, 200, 116, 164, 234
// ]

let seed = Uint8Array.from([
  70, 60, 102, 100, 70, 60, 102, 100, 70, 60, 102, 100, 70, 60, 102, 100, 70,
  60, 102, 100, 70, 60, 102, 100, 70, 60, 102, 100, 70, 60, 102, 100,
]);
let accountFromSeed = Keypair.fromSeed(seed);

console.log(accountFromSeed.publicKey.toBase58());
console.log(accountFromSeed.secretKey);

// 3LDverZtSC9Duw2wyGC1C38atMG49toPNW9jtGJiw9Ar
// Uint8Array(64) [
//    70,  60, 102, 100,  70,  60, 102, 100,  70,  60, 102,
//   100,  70,  60, 102, 100,  70,  60, 102, 100,  70,  60,
//   102, 100,  70,  60, 102, 100,  70,  60, 102, 100,  34,
//   164,   6,  12,   9, 193, 196,  30, 148, 122, 175,  11,
//    28, 243, 209,  82, 240, 184,  30,  31,  56, 223, 236,
//   227,  60,  72, 215,  47, 208, 209, 162,  59
// ]

let accountFromSecret = Keypair.fromSecretKey(account.secretKey);

console.log(accountFromSecret.publicKey.toBase58());
console.log(accountFromSecret.secretKey);

// 2DVaHtcdTf7cm18Zm9VV8rKK4oSnjmTkKE6MiXe18Qsb
// Uint8Array(64) [
//   152,  43, 116, 211, 207,  41, 220,  33, 193, 168, 118,
//    24, 176,  83, 206, 132,  47, 194,   2, 203, 186, 131,
//   197, 228, 156, 170, 154,  41,  56,  76, 159, 124,  18,
//    14, 247,  32, 210,  51, 102,  41,  43,  21,  12, 170,
//   166, 210, 195, 188,  60, 220, 210,  96, 136, 158,   6,
//   205, 189, 165, 112,  32, 200, 116, 164, 234
// ]
```

:::warning
Yüksek entropili bir tohum oluşturmadıkça `fromSeed` kullanmayın. Tohumu paylaşmayın. Tohumu, gizli anahtarınız gibi işleyin.
:::

### PublicKey

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/PublicKey.html)

PublicKey, işlemlerde, anahtar çiftlerinde ve programlarda `@solana/web3.js` içinde kullanılmaktadır. Bir işlemin her hesabını listelediğinizde ve Solana'da genel bir tanımlayıcı olarak publickey'e ihtiyaç duyarsınız.

Bir PublicKey, base58 kodlu bir dize, tampon, Uint8Array, sayı ve bir sayı dizisi ile oluşturulabilir.

#### Örnek Kullanım

```javascript
const { Buffer } = require("buffer");
const web3 = require("@solana/web3.js");
const crypto = require("crypto");

// Base58 kodlu dize ile bir PublicKey oluşturma
let base58publicKey = new web3.PublicKey(
  "5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj",
);
console.log(base58publicKey.toBase58());

// 5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj

// Program Adresi Oluşturma
let highEntropyBuffer = crypto.randomBytes(31);
let programAddressFromKey = await web3.PublicKey.createProgramAddress(
  [highEntropyBuffer.slice(0, 31)],
  base58publicKey,
);
console.log(`Üretilen Program Adresi: ${programAddressFromKey.toBase58()}`);

// Üretilen Program Adresi: 3thxPEEz4EDWHNxo1LpEpsAxZryPAHyvNVXJEJWgBgwJ

// Bir PublicKey'ye göre Program adresini bulma
let validProgramAddress = await web3.PublicKey.findProgramAddress(
  [Buffer.from("", "utf8")],
  programAddressFromKey,
);
console.log(`Geçerli Program Adresi: ${validProgramAddress}`);

// Geçerli Program Adresi: C14Gs3oyeXbASzwUpqSymCKpEyccfEuSe8VRar9vJQRE,253
```

### SystemProgram

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/SystemProgram.html)

SystemProgram, hesaplar oluşturma, hesap verilerini ayırma, bir hesabı programlara atama, nonce hesapları ile çalışma ve lamport transfer etme yeteneği sağlar. Bireysel talimatların çözülmesi ve okunması için SystemInstruction sınıfını kullanabilirsiniz.

#### Örnek Kullanım

```javascript
const web3 = require("@solana/web3.js");

// İşlem ücretlerini ödemek için SOL dağıtımı
let payer = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Hesap Verisi Ayırıcı
let allocatedAccount = web3.Keypair.generate();
let allocateInstruction = web3.SystemProgram.allocate({
  accountPubkey: allocatedAccount.publicKey,
  space: 100,
});
let transaction = new web3.Transaction().add(allocateInstruction);

await web3.sendAndConfirmTransaction(connection, transaction, [
  payer,
  allocatedAccount,
]);

// Nonce Hesabı Oluşturma
let nonceAccount = web3.Keypair.generate();
let minimumAmountForNonceAccount =
  await connection.getMinimumBalanceForRentExemption(web3.NONCE_ACCOUNT_LENGTH);
let createNonceAccountTransaction = new web3.Transaction().add(
  web3.SystemProgram.createNonceAccount({
    fromPubkey: payer.publicKey,
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: payer.publicKey,
    lamports: minimumAmountForNonceAccount,
  }),
);

await web3.sendAndConfirmTransaction(
  connection,
  createNonceAccountTransaction,
  [payer, nonceAccount],
);

// Nonce'yi ileri alma - Hesap yöneticisi olarak işlemler oluşturmak için kullanılır
let advanceNonceTransaction = new web3.Transaction().add(
  web3.SystemProgram.nonceAdvance({
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: payer.publicKey,
  }),
);

await web3.sendAndConfirmTransaction(connection, advanceNonceTransaction, [
  payer,
]);

// Hesaplar arasında lamport transferi
let toAccount = web3.Keypair.generate();

let transferTransaction = new web3.Transaction().add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }),
);
await web3.sendAndConfirmTransaction(connection, transferTransaction, [payer]);

// Yeni bir hesabı bir programa atama
let programId = web3.Keypair.generate();
let assignedAccount = web3.Keypair.generate();

let assignTransaction = new web3.Transaction().add(
  web3.SystemProgram.assign({
    accountPubkey: assignedAccount.publicKey,
    programId: programId.publicKey,
  }),
);

await web3.sendAndConfirmTransaction(connection, assignTransaction, [
  payer,
  assignedAccount,
]);
```

### Secp256k1Program

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Secp256k1Program.html)

Secp256k1Program, Bitcoin ve Ethereum tarafından kullanılan Secp256k1 imzalarını doğrulamak için kullanılır.

#### Örnek Kullanım

```javascript
const { keccak_256 } = require("js-sha3");
const web3 = require("@solana/web3.js");
const secp256k1 = require("secp256k1");

// secp256k1'den Ethereum Adresi oluşturma
let secp256k1PrivateKey;
do {
  secp256k1PrivateKey = web3.Keypair.generate().secretKey.slice(0, 32);
} while (!secp256k1.privateKeyVerify(secp256k1PrivateKey));

let secp256k1PublicKey = secp256k1
  .publicKeyCreate(secp256k1PrivateKey, false)
  .slice(1);

let ethAddress =
  web3.Secp256k1Program.publicKeyToEthAddress(secp256k1PublicKey);
console.log(`Ethereum Adresi: 0x${ethAddress.toString("hex")}`);

// Ethereum Adresi: 0xadbf43eec40694eacf36e34bb5337fba6a2aa8ee

// İddia oluşturma talimatları oluşturmak için bir anahtar çiftine fonlama
let fromPublicKey = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  fromPublicKey.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Ethereum Anahtarı ile Mesajı İmzalama
let plaintext = Buffer.from("string address");
let plaintextHash = Buffer.from(keccak_256.update(plaintext).digest());
let { signature, recid: recoveryId } = secp256k1.ecdsaSign(
  plaintextHash,
  secp256k1PrivateKey,
);

// İmzanın doğrulanması için bir işlem oluşturma
let transaction = new Transaction().add(
  web3.Secp256k1Program.createInstructionWithEthAddress({
    ethAddress: ethAddress.toString("hex"),
    plaintext,
    signature,
    recoveryId,
  }),
);

// İşlem, mesajın adres tarafından imzalandığı doğrulandığında başarıyla sonuçlanacaktır.
await web3.sendAndConfirmTransaction(connection, transaction, [fromPublicKey]);
```

### Mesaj

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Message.html)

Mesaj, işlemlerin başka bir yol ile oluşturulması için kullanılır. Bir mesaj, işlemin bir parçası olan hesaplar, başlık, talimatlar ve recentBlockhash kullanılarak oluşturulabilir. Bir `İşlem`, bir Mesaj ve işlemi gerçekleştirmek için gereken imzaların listesidir.

#### Örnek Kullanım

```javascript
const { Buffer } = require("buffer");
const bs58 = require("bs58");
const web3 = require("@solana/web3.js");

let toPublicKey = web3.Keypair.generate().publicKey;
let fromPublicKey = web3.Keypair.generate();

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  fromPublicKey.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

let type = web3.SYSTEM_INSTRUCTION_LAYOUTS.Transfer;
let data = Buffer.alloc(type.layout.span);
let layoutFields = Object.assign({ instruction: type.index });
type.layout.encode(layoutFields, data);

let recentBlockhash = await connection.getRecentBlockhash();

let messageParams = {
  accountKeys: [
    fromPublicKey.publicKey.toString(),
    toPublicKey.toString(),
    web3.SystemProgram.programId.toString(),
  ],
  header: {
    numReadonlySignedAccounts: 0,
    numReadonlyUnsignedAccounts: 1,
    numRequiredSignatures: 1,
  },
  instructions: [
    {
      accounts: [0, 1],
      data: bs58.encode(data),
      programIdIndex: 2,
    },
  ],
  recentBlockhash,
};

let message = new web3.Message(messageParams);

let transaction = web3.Transaction.populate(message, [
  fromPublicKey.publicKey.toString(),
]);

await web3.sendAndConfirmTransaction(connection, transaction, [fromPublicKey]);
```

### Yapı

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Struct.html)

Yapı sınıfı, JavaScript'te Rust uyumlu yapılar oluşturmak için kullanılır. Bu sınıf, yalnızca Borsh kodlu Rust yapıları ile uyumludur.

#### Örnek Kullanım

Rust'ta Yapı:

```rust
pub struct Fee {
    pub denominator: u64,
    pub numerator: u64,
}
```

Web3 ile Kullanma:

```javascript
import BN from "bn.js";
import { Struct } from "@solana/web3.js";

export class Fee extends Struct {
  denominator: BN;
  numerator: BN;
}
```

### Enum

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Enum.html)

Enum sınıfı, JavaScript'te Rust uyumlu bir Enum'u temsil etmek için kullanılır. Enum, kaydedilse de yalnızca bir dize temsili olacaktır, ancak 
`Struct` ile birlikte kullanıldığında doğru bir şekilde kodlanabilir/çözülebilir. Bu sınıf, yalnızca Borsh kodlu Rust enumerasyonları ile uyumludur.

#### Örnek Kullanım

Rust:

```rust
pub enum AccountType {
    Uninitialized,
    StakePool,
    ValidatorList,
}
```

Web3:

```javascript
import { Enum } from "@solana/web3.js";

export class AccountType extends Enum {}
```

### NonceAccount

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/NonceAccount.html)

Genellikle bir işlemin `recentBlockhash` alanı çok eskiyse, işlem reddedilir. Belirli bir güvenli hizmet sağlamak için, Nonce Hesapları kullanılır. Bir Nonce Hesabının üzerine eklenmiş bir `recentBlockhash` kullanan işlemler, Nonce Hesabı öne alınmadığı sürece süresi dolmaz.

Bir nonce hesabı oluşturmak için önce normal bir hesap oluşturabilir, ardından `SystemProgram` kullanarak bu hesabı Nonce Hesabı yapabilirsiniz.

#### Örnek Kullanım

```javascript
const web3 = require("@solana/web3.js");

// Bağlantıyı oluşturma
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

// Hesaplar oluşturma
let account = web3.Keypair.generate();
let nonceAccount = web3.Keypair.generate();

// Hesabı fonlama
let airdropSignature = await connection.requestAirdrop(
  account.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Kira muafiyeti için minimum miktarı alma
let minimumAmount = await connection.getMinimumBalanceForRentExemption(
  web3.NONCE_ACCOUNT_LENGTH,
);

// CreateNonceAccount işlemini oluşturma
let transaction = new web3.Transaction().add(
  web3.SystemProgram.createNonceAccount({
    fromPubkey: account.publicKey,
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: account.publicKey,
    lamports: minimumAmount,
  }),
);
// Nonce Hesabı Oluşturma
await web3.sendAndConfirmTransaction(connection, transaction, [
  account,
  nonceAccount,
]);

let nonceAccountData = await connection.getNonce(
  nonceAccount.publicKey,
  "confirmed",
);

console.log(nonceAccountData);
// NonceAccount {
//   authorizedPubkey: PublicKey {
//     _bn: <BN: 919981a5497e8f85c805547439ae59f607ea625b86b1138ea6e41a68ab8ee038>
//   },
//   nonce: '93zGZbhMmReyz4YHXjt2gHsvu5tjARsyukxD4xnaWaBq',
//   feeCalculator: { lamportsPerSignature: 5000 }
// }

let nonceAccountInfo = await connection.getAccountInfo(
  nonceAccount.publicKey,
  "confirmed",
);

let nonceAccountFromInfo = web3.NonceAccount.fromAccountData(
  nonceAccountInfo.data,
);

console.log(nonceAccountFromInfo);
// NonceAccount {
//   authorizedPubkey: PublicKey {
//     _bn: <BN: 919981a5497e8f85c805547439ae59f607ea625b86b1138ea6e41a68ab8ee038>
//   },
//   nonce: '93zGZbhMmReyz4YHXjt2gHsvu5tjARsyukxD4xnaWaBq',
//   feeCalculator: { lamportsPerSignature: 5000 }
// }
```

Yukarıdaki örnek, `SystemProgram.createNonceAccount` kullanarak bir `NonceAccount` oluşturma ve hesap bilgileri ile `NonceAccount`'ı alma yöntemlerini göstermektedir. Nonce'yi kullanarak, nonce yerinde `recentBlockhash` ile çevrimdışı işlemler oluşturabilirsiniz.

### Oy Hesabı

[Kaynak Dokümantasyon](https://solana-labs.github.io/solana-web3.js/v1.x/classes/VoteAccount.html)

Oy hesabı, ağ üzerindeki yerel oy hesabı programından oy hesaplarını çözme yeteneği sağlayan bir nesnedir.

#### Örnek Kullanım

```javascript
const web3 = require("@solana/web3.js");

let voteAccountInfo = await connection.getProgramAccounts(web3.VOTE_PROGRAM_ID);
let voteAccountFromData = web3.VoteAccount.fromAccountData(
  voteAccountInfo[0].account.data,
);
console.log(voteAccountFromData);
/*
VoteAccount {
  nodePubkey: PublicKey {
    _bn: <BN: cf1c635246d4a2ebce7b96bf9f44cacd7feed5552be3c714d8813c46c7e5ec02>
  },
  authorizedWithdrawer: PublicKey {
    _bn: <BN: b76ae0caa56f2b9906a37f1b2d4f8c9d2a74c1420cd9eebe99920b364d5cde54>
  },
  commission: 10,
  rootSlot: 104570885,
  votes: [
    { slot: 104570886, confirmationCount: 31 },
    { slot: 104570887, confirmationCount: 30 },
    { slot: 104570888, confirmationCount: 29 },
    
    { slot: 104570889, confirmationCount: 28 },    { slot: 104570890, confirmationCount: 27 },
    { slot: 104570891, confirmationCount: 26 },
    { slot: 104570892, confirmationCount: 25 },
    { slot: 104570893, confirmationCount: 24 },
    { slot: 104570894, confirmationCount: 23 },
    ...
  ],
  authorizedVoters: [ { epoch: 242, authorizedVoter: [PublicKey] } ],
  priorVoters: [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object]
   ],
  epochCredits: [
    { epoch: 179, credits: 33723163, prevCredits: 33431259 },
    { epoch: 180, credits: 34022643, prevCredits: 33723163 },
    { epoch: 181, credits: 34331103, prevCredits: 34022643 },
    { epoch: 182, credits: 34619348, prevCredits: 34331103 },
    { epoch: 183, credits: 34880375, prevCredits: 34619348 },
    { epoch: 184, credits: 35074055, prevCredits: 34880375 },
    { epoch: 185, credits: 35254965, prevCredits: 35074055 },
    { epoch: 186, credits: 35437863, prevCredits: 35254965 },
    { epoch: 187, credits: 35672671, prevCredits: 35437863 },
    { epoch: 188, credits: 35950286, prevCredits: 35672671 },
    { epoch: 189, credits: 36228439, prevCredits: 35950286 },
    ...
  ],
  lastTimestamp: { slot: 104570916, timestamp: 1635730116 }
}
*/
```

---

## Staking

### StakeProgram

[Kaynak Dokümantasyonu](https://solana-labs.github.io/solana-web3.js/v1.x/classes/StakeProgram.html)

:::info 
**StakeProgram**, SOL'ü stake etmek ve bunları ağdaki herhangi bir doğrulayıcıya devretmek için kolaylık sağlar. 
:::

StakeProgram'ı kullanarak bir stake hesabı oluşturabilir, bazı SOL'leri stake edebilir, stake'inizin çekimi için hesapları yetkilendirebilir, stake'inizi devre dışı bırakabilir ve fonlarınızı çekebilirsiniz. StakeInstruction sınıfı, StakeProgram'ı çağıran işlemlerden daha fazla talimatı çözmek ve okumak için kullanılır.

#### Örnek Kullanım

```javascript
const web3 = require("@solana/web3.js");

// İşlem oluşturmak için bir anahtar fonu
let fromPublicKey = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  fromPublicKey.publicKey,
  web3.LAMPORTS_PER_SOL,
);
await connection.confirmTransaction({ signature: airdropSignature });

// Hesap Oluştur
let stakeAccount = web3.Keypair.generate();
let authorizedAccount = web3.Keypair.generate();

/* 
:::note 
Bu, bir stake hesabı için minimum miktardır -- Staking için ek Lamport ekleyin
Örneğin, stake'in bir parçası olarak 50 lamport ekliyoruz 
:::
*/
let lamportsForStakeAccount =
  (await connection.getMinimumBalanceForRentExemption(
    web3.StakeProgram.space,
  )) + 50;

let createAccountTransaction = web3.StakeProgram.createAccount({
  fromPubkey: fromPublicKey.publicKey,
  authorized: new web3.Authorized(
    authorizedAccount.publicKey,
    authorizedAccount.publicKey,
  ),
  lamports: lamportsForStakeAccount,
  lockup: new web3.Lockup(0, 0, fromPublicKey.publicKey),
  stakePubkey: stakeAccount.publicKey,
});
await web3.sendAndConfirmTransaction(connection, createAccountTransaction, [
  fromPublicKey,
  stakeAccount,
]);

// Stake'in mevcut olduğunu kontrol edin
let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
console.log(`Stake bakiyesi: ${stakeBalance}`);
// Stake bakiyesi: 2282930

// Stake'imizin durumunu doğrulayabiliriz. Bu, aktif hale gelmesi biraz zaman alabilir
let stakeState = await connection.getStakeActivation(stakeAccount.publicKey);
console.log(`Stake durumu: ${stakeState.state}`);
// Stake durumu: inactive

// Stake'imizi devretmek için, mevcut oy hesaplarını alır ve ilkiyi seçeriz
let voteAccounts = await connection.getVoteAccounts();
let voteAccount = voteAccounts.current.concat(voteAccounts.delinquent)[0];
let votePubkey = new web3.PublicKey(voteAccount.votePubkey);

// Daha sonra stake'imizi voteAccount'a devredebiliriz
let delegateTransaction = web3.StakeProgram.delegate({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: authorizedAccount.publicKey,
  votePubkey: votePubkey,
});
await web3.sendAndConfirmTransaction(connection, delegateTransaction, [
  fromPublicKey,
  authorizedAccount,
]);

// Fonlarımızı çekmek için önce stake'i devre dışı bırakmalıyız
let deactivateTransaction = web3.StakeProgram.deactivate({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: authorizedAccount.publicKey,
});
await web3.sendAndConfirmTransaction(connection, deactivateTransaction, [
  fromPublicKey,
  authorizedAccount,
]);

// Devre dışı bırakıldıktan sonra, fonlarımızı çekebiliriz
let withdrawTransaction = web3.StakeProgram.withdraw({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: authorizedAccount.publicKey,
  toPubkey: fromPublicKey.publicKey,
  lamports: stakeBalance,
});

await web3.sendAndConfirmTransaction(connection, withdrawTransaction, [
  fromPublicKey,
  authorizedAccount,
]);
```

---

### Yetkilendirilen

[Kaynak Dokümantasyonu](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Authorized.html)

Yetkilendirilen, Solana içinde staking için yetkilendirilmiş bir hesap oluştururken kullanılan bir nesnedir. Bir `staker` ve `withdrawer` belirleyerek, farklı bir hesap kullanıcının dışında para çekmesine izin verir.

:::tip 
`Authorized` nesnesinin daha fazla kullanımını `StakeProgram` altında bulabilirsiniz.
:::

### Kilitleme

[Kaynak Dokümantasyonu](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Lockup.html)

Kilitleme, bir hesap oluşturmak için `StakeProgram` ile birlikte kullanılır. Kilitlenme, stake'in ne kadar süreyle kilitleneceğini veya geri alınamaz hale geleceğini belirlemek için kullanılır. Kilitleme, hem dönem için hem de Unix zaman damgası için 0 olarak ayarlandığında, stake hesabı için kilitlenme devre dışı bırakılacaktır.

#### Örnek Kullanım

```javascript
const {
  Authorized,
  Keypair,
  Lockup,
  StakeProgram,
} = require("@solana/web3.js");

let account = Keypair.generate();
let stakeAccount = Keypair.generate();
let authorized = new Authorized(account.publicKey, account.publicKey);
let lockup = new Lockup(0, 0, account.publicKey);

let createStakeAccountInstruction = StakeProgram.createAccount({
  fromPubkey: account.publicKey,
  authorized: authorized,
  lamports: 1000,
  lockup: lockup,
  stakePubkey: stakeAccount.publicKey,
});
```

Yukarıdaki kod, `StakeProgram` ile bir hesap oluşturulurken kullanılacak bir `createStakeAccountInstruction` oluşturur. 

:::warning
Kilitleme, dönem ve Unix zaman damgası için 0 olarak ayarlandığında, hesap için kilitleme devre dışı bırakılır. 
:::

Daha fazla bilgi için `StakeProgram` bakın.