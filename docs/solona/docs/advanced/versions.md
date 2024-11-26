---
sidebarSortOrder: 3
title: Versiyonlu İşlemler
description:
  "Temel Solana kavramlarını keşfedin: işlemler, versiyonlu işlemler,
  Solana çalışma zamanında ek işlevsellik sağlama, adres arama
  tabloları ve daha fazlası."
altRoutes:
  - /docs/core/transactions/versions
---

**Versiyonlu İşlemler**, Solana çalışma zamanında ek işlevsellik sağlayan yeni işlem formatıdır. Bu, 
`Adres Arama Tabloları` gibi özellikleri içerir.

Versiyonlu işlemlerin yeni işlevselliğini (veya geriye dönük uyumluluğu) desteklemek için zincir üstü programlarda **GEREKEN** değişiklikler yapılması gerekmez, ancak geliştiriciler, 
`farklı işlem versiyonlarından kaynaklanan hataları` önlemek için istemci tarafı kodlarını güncellemek **ZORUNDADIR**.

## Mevcut İşlem Versiyonları

Solana çalışma zamanı iki işlem versiyonunu destekler:

- `legacy` - ek bir fayda sağlamayan eski işlem formatı
- `0` - 
  `Adres Arama Tabloları` desteği eklenmiştir.

## Maksimum desteklenen işlem versiyonu

Bir işlem döndüren tüm RPC istekleri, başvurdukları uygulamada destekleyecekleri en yüksek işlem versiyonunu 
`maxSupportedTransactionVersion` seçeneği ile belirtmelidir. Bu, 
`getBlock` ve 
`getTransaction` yöntemlerini içerir.

Eğer alınan Versiyonlu İşlem, belirlenen `maxSupportedTransactionVersion` değerinden yüksekse, RPC isteği başarısız olur. (örneğin, `legacy` seçildiğinde bir versiyon `0` işlemi dönerse)

> **UYARI:** Eğer bir `maxSupportedTransactionVersion` değeri belirlenmezse, yalnızca 
> `legacy` işlemler RPC yanıtında izin verilecektir. Bu nedenle, eğer bir versiyon `0` işlemi dönerse, RPC
> istekleriniz **BAŞARISIZ** olacaktır.

## Maksimum desteklenen versiyonu nasıl ayarlarsınız

`maxSupportedTransactionVersion` değerini, 
[`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/v1.x/) kütüphanesi ile ve RPC uç noktasına doğrudan JSON formatında istek yaparak ayarlayabilirsiniz.

### web3.js kullanarak

[`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/v1.x/) kütüphanesini kullanarak, en son bloğu alabilir veya belirli bir işlemi yakalayabilirsiniz:

```js
// `devnet` kümesine bağlan ve mevcut `slot` değerini al
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const slot = await connection.getSlot();

// en son bloğu al (v0 işlemlerine izin veriliyor)
const block = await connection.getBlock(slot, {
  maxSupportedTransactionVersion: 0,
});

// belirli bir işlemi al (v0 işlemlerine izin veriliyor)
const getTx = await connection.getTransaction(
  "3jpoANiFeVGisWRY5UP648xRXs3iQasCHABPWRWnoEjeA93nc79WrnGgpgazjq4K9m8g2NJoyKoWBV1Kx5VmtwHQ",
  {
    maxSupportedTransactionVersion: 0,
  },
);
```

### RPC'ye JSON istekleri

Standart bir JSON formatında POST isteği kullanarak, belirli bir bloğu alırken `maxSupportedTransactionVersion` ayarlayabilirsiniz:

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d \
'{"jsonrpc": "2.0", "id":1, "method": "getBlock", "params": [430, {
  "encoding":"json",
  "maxSupportedTransactionVersion":0,
  "transactionDetails":"full",
  "rewards":false
}]}'
```

## Versiyonlu İşlem nasıl oluşturulur

Versiyonlu işlemler, işlemleri oluşturmanın eski yöntemine benzer şekilde oluşturulabilir. Kullanılan belirli kütüphanelerde bazı farklılıklar vardır.

Aşağıda, iki hesap arasında SOL transferi gerçekleştirmek için 
`@solana/web3.js` kütüphanesini kullanarak bir Versiyonlu İşlem oluşturma örneği yer almaktadır.

### Notlar:

- `payer`, SOL ile finanse edilmiş geçerli bir `Keypair` cüzdanıdır.
- `toAccount`, geçerli bir `Keypair`dir.

Öncelikle web3.js kütüphanesini içe aktarın ve istediğiniz kümeye bir `connection` oluşturun.

Ondan sonra, işlemimiz için ve hesap için ihtiyaç duyacağımız en son `blockhash` ve `minRent` değerlerini tanımlayalım:

```js
const web3 = require("@solana/web3.js");

// kümeye bağlan ve kiralama muafiyeti durumu için minimum kiralama bedelini al
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
let minRent = await connection.getMinimumBalanceForRentExemption(0);
let blockhash = await connection
  .getLatestBlockhash()
  .then(res => res.blockhash);
```

İşleminizde göndermek istediğiniz tüm `instructions` için bir `array` oluşturun. Aşağıdaki bu örnekte, basit bir SOL transfer talimatı oluşturuyoruz:

```js
// istediğiniz `instructions` ile bir array oluşturun
const instructions = [
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: minRent,
  }),
];
```

Sonra, istediğiniz `instructions` ile `MessageV0` formatında bir işlem mesajı oluşturun:

```js
// v0 uyumlu mesaj oluştur
const messageV0 = new web3.TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();
```

Ardından, v0 uyumlu mesajımızı verirken yeni bir `VersionedTransaction` oluşturun:

```js
const transaction = new web3.VersionedTransaction(messageV0);

// gerekli `Signers` ile işleminizi imzalayın
transaction.sign([payer]);
```

İşlemi imzalamanız için iki yöntem vardır:

- `VersionedTransaction` yöntemine bir `signatures` arrayi geçmek, veya
- gerekli `Signers` arrayini geçerek `transaction.sign()` yöntemini çağırmak

> **NOT:** `transaction.sign()` yöntemini çağırdıktan sonra, önceki tüm işlem `signatures`ları, sağlanan `Signers`'dan oluşturulan yeni imzalarla tamamen değiştirilecektir.

Tüm gerekli hesaplar tarafından imzalanmış `VersionedTransaction`'ınızı oluşturduktan sonra, kümeye gönderebilir ve yanıtı `await` edebilirsiniz:

```js
// v0 işlemimizi kümeye gönder
const txId = await connection.sendTransaction(transaction);
console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
```

> **NOT:** `legacy` işlemlerinin aksine, `sendTransaction` aracılığıyla bir `VersionedTransaction` göndermek, ikinci parametre olarak bir `Signers` arrayi geçmeyi **DESTEKLEMEZ**. İşlemi çağırmadan önce imzalamanız gerekecektir `connection.sendTransaction()`.

---

## Daha Fazla Kaynak

- 
  `Adres Arama Tabloları için Versiyonlu İşlemleri kullanma`
- Solana Explorer üzerinde bir
  [v0 işlem örneğini görüntüleyin](https://explorer.solana.com/tx/h9WQsqSUYhFvrbJWKFPaXximJpLf6Z568NW1j6PBn3f7GPzQXe9PYMYbmWSUFHwgnUmycDNbEX9cr6WjUWkUFKx/?cluster=devnet)
- 
  [Versiyonlu İşlem ve Adres Arama Tabloları için kabul edilen öneriyi](https://docs.solanalabs.com/proposals/versioned-transactions) okuyun.