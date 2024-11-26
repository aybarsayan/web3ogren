---
sidebarSortOrder: 4
title: Adres Arama Tabloları
description:
  Solana Adres Arama Tabloları (ALT'ler) kullanarak bir işlem başına
  64 adrese kadar nasıl verimli bir şekilde işlem yapılacağını öğrenin.
  web3.js kullanarak arama tabloları oluşturun, genişletin ve faydalanın.
---

Adres Arama Tabloları, kısaca "_arama tabloları_" veya kısaca "_ALT'ler_" olarak adlandırılan
yöntemler, geliştiricilerin ilişkili adresler koleksiyonu oluşturmasına ve
bir işlemi tek bir işlemin içinde daha fazla adresi verimli bir şekilde yüklemesine olanak tanır.

Solana blockchain'inde her işlem, işlemle etkileşimde bulunan her
adresin bir listesini gerektirdiğinden, bu liste pratikte işlem başına 32
adres ile sınırlıdır. `Adres Arama Tabloları` yardımıyla, bir işlem artık bu
sınırı 64 adrese yükseltebilecektir.

## Zincir üzerindeki adreslerin sıkıştırılması

Gerekli tüm adresler bir Adres Arama Tablosu'na zincir üzerinde depolandıktan
sonra, her bir adres işlem içinde tablodaki 1 baytlık indeksi ile
referans alınabilir (tam 32 baytlık adresleri yerine). Bu arama yöntemi,
32 baytlık bir adresi 1 baytlık bir indeks değerine "sıkıştırır".

:::info
Bu "sıkıştırma", bir işlem içinde kullanılmak üzere tek bir arama tablosunda
256 adrese kadar depolanmasına olanak tanır.
:::

## Sürüm İlişkili İşlemler

Bir Adres Arama Tablosunu bir işlem içinde kullanmak için, geliştiriciler
yeni `Sürüm İlişkili İşlem formatı` ile tanıtılan v0
işlemlerini kullanmalıdır.

## Adres arama tablosu nasıl oluşturulur

`@solana/web3.js` kütüphanesi ile yeni bir arama tablosu oluşturmak,
eski `legacy` işlemleri ile benzerlik gösterir, ancak bazı farklılıkları vardır.

`@solana/web3.js` kütüphanesini kullanarak, yeni bir arama tablosu
oluşturmak için gereken talimatı oluşturmak ve adresini belirlemek için
[`createLookupTable`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/AddressLookupTableProgram.html#createLookupTable)
fonksiyonunu kullanabilirsiniz:

```js
const web3 = require("@solana/web3.js");

// bir kümeye bağlan ve geçerli `slot`u al
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const slot = await connection.getSlot();

// Varsayım:
// `payer` yeterli SOL'a sahip geçerli bir `Keypair`

const [lookupTableInst, lookupTableAddress] =
  web3.AddressLookupTableProgram.createLookupTable({
    authority: payer.publicKey,
    payer: payer.publicKey,
    recentSlot: slot,
  });

console.log("arama tablosu adresi:", lookupTableAddress.toBase58());

// Adres Arama Tablosunu zincir üzerinde oluşturmak için:
// `lookupTableInst` talimatını bir işlemde gönderin
```

> **NOT:** Adres arama tabloları **v0** işlemi veya `legacy` işlemi ile **oluşturulabilir**. Ancak Solana çalışma zamanı, 
> yalnızca `v0 Sürüm İlişkili İşlemleri` kullanarak
> bir arama tablosundaki ek adresleri alabilir ve işleyebilir.

## Bir arama tablosuna adres eklemek

Adres eklemek, "_genişletme_" olarak bilinir. `@solana/web3.js`
kütüphanesini kullanarak, yeni bir _genişlet_ talimatı oluşturabilirsiniz
[`extendLookupTable`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/AddressLookupTableProgram.html#extendLookupTable)
metodu ile:

```js
// `extend` talimatı aracılığıyla `lookupTableAddress` tablosuna adres ekle
const extendInstruction = web3.AddressLookupTableProgram.extendLookupTable({
  payer: payer.publicKey,
  authority: payer.publicKey,
  lookupTable: lookupTableAddress,
  addresses: [
    payer.publicKey,
    web3.SystemProgram.programId,
    // burada daha fazla `publicKey` adresi listele
  ],
});

// Bu `extendInstruction`'ı kümeye bir işlemde gönder ve
// `lookupTableAddress` adresi ile arama tablonuza `adresler` listesini ekle
```

> **NOT:** `legacy` işlemlerinin aynı bellek sınırlamaları nedeniyle, bir
> Adres Arama Tablosunu _genişletmek_ için kullanılan herhangi bir işlem,
> ne kadar adresin aynı anda eklenebileceği konusunda da sınırlıdır. Bu nedenle,
> tek bir işlemin bellek sınırlamalarına sığamayacak kadar fazla adres
> eklemek için birden fazla işlem kullanmanız gerekecektir (~20).

Bu adresler tablonuza eklendikten ve zincir üzerinde depolandıktan sonra,
Adres Arama Tablosunu gelecekteki işlemlerde kullanabileceksiniz.
Bu gelecekteki işlemlerde 64 adrese kadar olan adresleri etkinleştirir.

## Adres Arama Tablosunu Getirme

Kümeden başka bir hesap (veya PDA) talep eder gibi, tamamını
[`getAddressLookupTable`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getAddressLookupTable)
metodunu kullanarak bir Adres Arama Tablosunu alabilirsiniz:

```js
// alınacak arama tablosunun `PublicKey`'sini tanımla
const lookupTableAddress = new web3.PublicKey("");

// kümeye tablosunu al
const lookupTableAccount = (
  await connection.getAddressLookupTable(lookupTableAddress)
).value;

// `lookupTableAccount` artık bir `AddressLookupTableAccount` nesnesi olacaktır

console.log("Kümeden alınan tablo adresi:", lookupTableAccount.key.toBase58());
```

`lookupTableAccount` değişkenimiz şimdi `AddressLookupTableAccount` nesnesi olacak 
ve zincir üzerinde arama tablosunda depolanan tüm adreslerin listesini okumak için ayrıştırabiliriz:

```js
// tabloda depolanan tüm adresleri döngüyle geç ve ayrıştır
for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
  const address = lookupTableAccount.state.addresses[i];
  console.log(i, address.toBase58());
}
```

## Bir işlem içinde adres arama tablosunu nasıl kullanılır

Arama tablonuzu oluşturduktan ve gerekli adresinizi
zincir üzerinde depoladıktan (arama tablosunu genişleterek), zincir üzerinde
arama yeteneklerini kullanmak için bir `v0` işlemi oluşturabilirsiniz.

Eski `legacy` işlemlerinde olduğu gibi, işlem
için zincir üzerinde gerçekleştirilecek tüm `talimatları` oluşturabilirsiniz. 
Daha sonra bu talimatların bir dizisini `v0` işlemi içinde kullanılan
`Mesaj` olarak sağlayabilirsiniz.

> **NOT:** Bir `v0` işleminde kullanılan talimatlar, geçmişte talimatları
oluşturmak için kullanılan aynı yöntemler ve fonksiyonlar ile oluşturulabilir.
Adres Arama Tablosu ile ilgili talimatlarda herhangi bir değişiklik gerekmemektedir.

```js
// Varsayımlar:
// - `arrayOfInstructions` bir `TransactionInstruction` dizisi olarak oluşturulmuştur
// - yukarıda elde edilen `lookupTableAccount`'ı kullanıyoruz

// v0 uyumlu bir işlem `Mesajı` oluştur
const messageV0 = new web3.TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions: arrayOfInstructions, // bu bir talimatlar dizisidir
}).compileToV0Message([lookupTableAccount]);

// v0 mesajından bir v0 işlemi oluştur
const transactionV0 = new web3.VersionedTransaction(messageV0);

// oluşturduğumuz `payer` adlı dosya sistemi cüzdanını kullanarak v0 işlemini imzala
transactionV0.sign([payer]);

// işlemi gönder ve onayla
// (NOT: Burada bir `Signer` dizisi yoktur; aşağıdaki nota bakın...)
const txid = await web3.sendAndConfirmTransaction(connection, transactionV0);

console.log(
  `İşlem: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
);
```

> **NOT:** Bir `VersionedTransaction`'ı kümeye gönderirken, `sendAndConfirmTransaction`
> metodunu çağırmadan önce imzalanması gerekir. Eğer bir dizi `Signer` 
> (eski `legacy` işlemlerinde olduğu gibi) ile geçirirseniz, yöntem bir hata
> tetikler!

## Daha Fazla Kaynak

- Adres Arama Tabloları ve Sürüm İlişkili İşlemler için [öneriyi](https://docs.solanalabs.com/proposals/versioned-transactions) okuyun
- [Adres Arama Tablolarını kullanan örnek Rust programı](https://github.com/TeamRaccoons/address-lookup-table-multi-swap)