---
title: "İşlemler ve Talimatlar"
sidebarSortOrder: 2
description:
  Solana işlemleri ve talimatları hakkında bilgi edinin - Solana blok zinciri ile etkileşim kurmanın temel yapı taşları. İşlem yapısını ve talimat bileşimini pratik örneklerle anlayın.
---

Solana'da `işlemler` ağıyla etkileşim kurmak için gönderilir. İşlemler bir veya daha fazla
`talimat` içerir; her biri işlenmesi gereken belirli bir operasyonu temsil eder. Talimatların yürütme mantığı,
Solana ağına dağıtılmış olan `programlar` üzerinde saklanır; burada her program kendi talimat setini saklar.

Aşağıda işlemlerin nasıl yürütüldüğüne dair temel bilgiler bulunmaktadır:

- **Yürütme Sırası**: Bir işlem birden fazla talimat içeriyorsa, talimatlar işlemin içine eklenme sırasına göre işlenir.
- **Atomiklik**: Bir işlem atomiktir, yani ya tüm talimatlar başarıyla işlenerek tamamen tamamlanır ya da hepsi başarısız olur. İşlem içindeki herhangi bir talimat başarısız olursa, hiçbiri yürütülmez.

:::tip
Basitlik açısından, bir işlem bir veya daha fazla talimatı işleme talebi olarak düşünülebilir.
:::

![İşlem Basitleştirilmiş](../../images/solana/public/assets/docs/core/transactions/transaction-simple.svg)

Bir işlemi, her bir talimatın doldurulup zarfa konulduğu bir zarf olarak hayal edebilirsiniz. Daha sonra belgeyi işlemek için zarfı gönderiyoruz; tıpkı ağı üzerinden talimatlarımızı işlemek için bir işlem gönderiyormuş gibi.

---

## Temel Noktalar

- Solana işlemleri, ağda çeşitli programlarla etkileşimde bulunan talimatlardan oluşur; her talimat belirli bir operasyonu temsil eder.
- Her talimat, talimatı işlemek için yürütülecek programı, talimat tarafından gerekli hesapları ve talimatın yürütülmesi için gereken verileri belirtir.
- Bir işlem içindeki talimatlar listelendiği sırayla işlenir.
- İşlemler atomiktir; yani ya tüm talimatlar başarıyla işlenir ya da tüm işlem başarısız olur.
- Bir işlemin maksimum boyutu 1232 bayttır.

---

## Temel Örnek

Aşağıda, bir gönderen tarafından bir alıcıya SOL transferi yapmak için tek bir talimatı temsil eden bir diyagram bulunmaktadır.

Solana üzerindeki bireysel "cüzdanlar", `Sistem Programı` tarafından sahip olunan hesaplardır. `Solana Hesap Modeli` gereği, sadece bir hesabın sahibi olan program, hesap üzerindeki verileri değiştirme yetkisine sahiptir.

Bu nedenle, bir "cüzdan" hesabından SOL transferi yapmak için, Sistem Programı üzerindeki transfer talimatını çağıran bir işlem göndermek gerekir.

![SOL Transferi](../../images/solana/public/assets/docs/core/transactions/sol-transfer.svg)

Gönderen hesabı, işlemde kendi lamport bakiyesinin kesilmesini onaylamak için bir imzalayıcı (`is_signer`) olarak dahil edilmelidir. Hem gönderen hem de alıcı hesapları, talimatın her iki hesabın lamport bakiyesini değiştirdiğinden değiştirilebilir (`is_writable`) olmalıdır.

:::info
İşlem gönderildiğinde, transfer talimatını işlemek için Sistem Programı devreye girer. Sistem Programı, ardından gönderen ve alıcı hesaplarının lamport bakiyelerini günceller.
:::

![SOL Transfer Süreci](../../images/solana/public/assets/docs/core/transactions/sol-transfer-process.svg)

### Basit SOL Transferi

İşte `SystemProgram.transfer` yöntemini kullanarak bir SOL transfer talimatı nasıl oluşturulacağına dair bir [Solana Playground](https://beta.solpg.io/656a0ea7fb53fa325bfd0c3e) örneği:

```typescript
// Transfer edilecek miktarı tanımlayın
const transferAmount = 0.01; // 0.01 SOL

// wallet_1'den wallet_2'ye SOL transferi için bir transfer talimatı oluşturun
const transferInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver.publicKey,
  lamports: transferAmount * LAMPORTS_PER_SOL, // transferAmount'ı lamportlara çevirin
});

// Yeni bir işleme transfer talimatını ekleyin
const transaction = new Transaction().add(transferInstruction);
```

Scripti çalıştırın ve konsola kaydedilen işlem detaylarını inceleyin. Aşağıdaki bölümlerde, arka planda neler olup bittiğini adım adım inceleyeceğiz.

---

## İşlem

Bir Solana
[işlemi](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/src/transaction/mod.rs#L173),

1. [İmzalar](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/src/signature.rs#L27):
   İşlemde yer alan imzaların bir dizisi.
2. [Mesaj](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/message/legacy.rs#L110):
   Atomik olarak işlenecek talimatların listesi.

![İşlem Formatı](../../images/solana/public/assets/docs/core/transactions/tx_format.png)

Bir işlem mesajının yapısı:

- `Mesaj Başlığı`: İmzalayıcı ve yalnızca okunabilir hesap sayısını belirtir.
- `Hesap Adresleri`: İşlemdeki talimatlar için gereken hesap adreslerinin dizisi.
- `Son Blokhash`: İşlemin tarih damgası olarak görev yapar.
- `Talimatlar`: Yürütülecek talimatların dizisi.

![İşlem Mesajı](../../images/solana/public/assets/docs/core/transactions/legacy_message.png)

### İşlem Boyutu

Solana ağı, [IPv6 MTU](https://en.wikipedia.org/wiki/IPv6_packet) boyut kısıtlamaları ile uyumlu olarak 1280 bayt maksimum iletim birimi (MTU) boyutuna uymaktadır; bu da UDP üzerinden kümeler arası bilgilerin hızlı ve güvenilir bir şekilde iletilmesini sağlar. Gerekli başlıklar (IPv6 için 40 bayt ve parça başlığı için 8 bayt) dikkate alındığında,
[1232 bayt paket verisi için mevcuttur](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/src/packet.rs#L16-L21),
serileştirilmiş işlemler gibi.

Bu, bir Solana işleminin toplam boyutunun 1232 bayt ile sınırlı olduğu anlamına gelir. İmzaların ve mesajın kombinasyonu bu limiti aşamaz.

- **İmzalar**: Her imza 64 bayt gerektirir. İmza sayısı, işlemin gereksinimlerine bağlı olarak değişkenlik gösterebilir.
- **Mesaj**: Mesaj, talimatlar, hesaplar ve ek meta veriler içerir; her hesabın 32 bayt gerektirdiği göz önüne alındığında, işlemin içindeki talimatlara bağlı olarak hesaplar ve meta verilerin toplam boyutu değişkenlik gösterebilir.

![İşlem Formatı](../../images/solana/public/assets/docs/core/transactions/issues_with_legacy_txs.png)

### Mesaj Başlığı

[Mesaj başlığı](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/message/mod.rs#L96), işlemin hesap adresleri dizisinde yer alan hesapların ayrıcalıklarını belirtir. Üç bayttan oluşmaktadır; her biri bir u8 tam sayısına sahiptir ve birlikte şu bilgileri belirtir:

1. İşlem için gereken imza sayısı.
2. İmza gerektiren yalnızca okunabilir hesap adresi sayısı.
3. İmza gerektirmeyen yalnızca okunabilir hesap adresi sayısı.

![Mesaj Başlığı](../../images/solana/public/assets/docs/core/transactions/message_header.png)

### Kompakt-Dizi Formatı

Bir işlem mesajı bağlamında, kompakt dizi, aşağıdaki formatta serileştirilmiş bir dizidir:

1. Uzunluğu, [kompakt-u16](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/short_vec.rs) kodlaması ile gösterilmiştir.
2. Kodlanmış uzunluktan sonra sıralı bir şekilde dizinin bireysel öğeleri gelmektedir.

![Kompakt dizi formatı](../../images/solana/public/assets/docs/core/transactions/compact_array_format.png)

Bu kodlama yöntemi, işlem mesajı içindeki `Hesap Adresleri` ve `Talimatlar` dizilerinin uzunluklarını belirtmek için kullanılır.

### Hesap Adresleri Dizisi

Bir işlem mesajı, işlemin içindeki talimatlar için gerekli olan tüm [hesap adreslerini](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/message/legacy.rs#L119) içeren bir dizi içerir.

Bu dizi, hesap adresi sayısının `kompakt-u16` kodlanması ile başlar ve akabinde hesaplar için ayrıcalık sırasına göre adresleri takip eder. Mesaj başlığındaki meta veriler, her bölümdeki hesap sayısını belirlemek için kullanılır.

- Yazılabilir ve imzalayıcı olan hesaplar
- Yalnızca okunabilir ve imzalayıcı olan hesaplar
- Yazılabilir ve imzalayıcı olmayan hesaplar
- Yalnızca okunabilir ve imzalayıcı olmayan hesaplar

![Kompakt hesap adresleri dizisi](../../images/solana/public/assets/docs/core/transactions/compat_array_of_account_addresses.png)

### Son Blokhash

Tüm işlemler, işlemin tarih damgası olarak görev yapan bir [son blokhash](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/message/legacy.rs#L122) içerir. Blokhash, tekrarı önlemek ve eski işlemleri ortadan kaldırmak için kullanılır.

:::warning
Bir işlemin blokhash’inin maksimum yaşı 150 bloktur (~1 dakika, 400ms blok süreleri varsayılarak). Eğer bir işlemin blokhash’i, en son blokhash’ten 150 blok daha eskiyse, geçersiz sayılır. Bu, belirli bir zaman dilimi içinde işlenmeyen işlemlerin asla yürütülmeyeceği anlamına gelir.
:::

Geçerli blokhash ve blokhash’in geçerli olacağı son blok yüksekliğini almak için `getLatestBlockhash` RPC yöntemini kullanabilirsiniz. İşte bir [Solana Playground](https://beta.solpg.io/661a06e1cffcf4b13384d046) örneği.

### Talimatlar Dizisi

Bir işlem mesajı, işlenmek üzere talep edilen tüm [talimatların](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/message/legacy.rs#L128) bir dizisini içerir. Bir işlem mesajındaki talimatlar, [DerlenmişTalimat](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/instruction.rs#L633) formatındadır.

Hesap adresleri dizisi gibi, bu kompakt dizi de, talimat sayısının `kompakt-u16` kodlaması ile başlar ve ardından talimatlar dizisi gelir. Dizi içindeki her talimat aşağıdaki bilgileri tanımlar:

1. **Program ID**: Talimatı işleyecek zincir üstü programı tanımlar. Bu, hesap adresleri dizisinde bir hesap adresine işaret eden bir u8 indeksi olarak temsil edilir.
2. **Hesap adresi indekslerinin kompakt dizisi**: Talimat için gerekli her hesap için hesap adresleri dizisine işaret eden u8 indekslerinin dizisi.
3. **Opak u8 verilerin kompakt dizisi**: Çağrılan program için spesifik bir u8 bayt dizisi. Bu veri, programda çağrılması gereken talimatı ve talimatın gerektirdiği ek verileri (örneğin, fonksiyon argümanlarını) tanımlar.

![Talimatların Kompakt Dizisi](../../images/solana/public/assets/docs/core/transactions/compact_array_of_ixs.png)

### Örnek İşlem Yapısı

Aşağıda, tek bir `SOL transferi` talimatı içeren bir işlemin yapısına dair bir örnek bulunmaktadır. Mesaj detaylarını, başlığı, hesap anahtarlarını, blokhash’i ve talimatları içermektedir; bunların yanı sıra işlem için imzayı göstermektedir.

- `başlık`: `accountKeys` dizisindeki okuma/yazma ve imzalayıcı ayrıcalıklarını tanımlamak için kullanılan verileri içerir.
- `accountKeys`: İşlemdeki tüm talimatların hesap adreslerini içeren dizi.
- `recentBlockhash`: İşlem oluşturulduğunda işlemin üzerinde yer alan blokhash.
- `instructions`: İşlemdeki tüm talimatları içeren dizi. Her `account` ve `programIdIndex`, bir indeksle `accountKeys` dizisine atıfta bulunmaktadır.
- `imzalar`: İşlemdeki talimatlar tarafından imzalayıcı olarak gereken tüm hesaplar için imzaları içeren dizi. Bir imza, ilgili hesabın özel anahtarı kullanılarak işlem mesajını imzalayarak oluşturulur.

```json
"transaction": {
    "message": {
      "header": {
        "numReadonlySignedAccounts": 0,
        "numReadonlyUnsignedAccounts": 1,
        "numRequiredSignatures": 1
      },
      "accountKeys": [
        "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
        "5snoUseZG8s8CDFHrXY2ZHaCrJYsW457piktDmhyb5Jd",
        "11111111111111111111111111111111"
      ],
      "recentBlockhash": "DzfXchZJoLMG3cNftcf2sw7qatkkuwQf4xH15N5wkKAb",
      "instructions": [
        {
          "accounts": [
            0,
            1
          ],
          "data": "3Bxs4NN8M2Yn4TLb",
          "programIdIndex": 2,
          "stackHeight": null
        }
      ],
      "indexToProgramIds": {}
    },
    "signatures": [
      "5LrcE2f6uvydKRquEJ8xp19heGxSvqsVbcqUeFoiWbXe8JNip7ftPQNTAVPyTK7ijVdpkzmKKaAQR7MWMmujAhXD"
    ]
  }
```

## Talimat

Bir
[talimat](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/instruction.rs#L329), zincir üzerinde belirli bir eylemi gerçekleştirmek için bir talep olup, bir
`program` içindeki yürütme mantığının en küçük kesintisiz birimidir.

:::note
Bir işleme eklemek için bir talimat oluştururken, her talimat aşağıdaki bilgileri içermelidir:
:::

- **Program adresi**: Çağrılan programı belirtir.
- **Hesaplar**: Talimatın okuduğu veya yazdığı her hesabı, diğer programları da kullanarak, `AccountMeta` yapısını kullanarak listeler.
- **Talimat Verisi**: Hangi `talimat işleyicisinin` programda çağrılacağını belirten bir bayt dizisi ile birlikte, talimat işleyicisinin gerektirdiği ek verilere (fonksiyon argümanları gibi) sahiptir.

![İşlem Talimatı](../../images/solana/public/assets/docs/core/transactions/instruction.svg)

### AccountMeta

Bir talimat için gerekli olan her hesap için aşağıdaki bilgiler belirtilmelidir:

- `pubkey`: Bir hesabın zincir üzerindeki adresi
- `is_signer`: Hesabın işlemde bir imzalayıcı olarak gerekip gerekmediğini belirtir
- `is_writable`: Hesap verilerinin değiştirilecek olup olmadığını belirtir

Bu bilgi, [AccountMeta](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/instruction.rs#L539) olarak adlandırılır.

![AccountMeta](../../images/solana/public/assets/docs/core/transactions/accountmeta.svg)

Bir talimat için gereken tüm hesaplar ve her hesabın yazılabilir olup olmadığı belirtilerek, işlemler paralel olarak işlenebilir.

:::tip
Örneğin, aynı durumu yazan herhangi bir hesap içermeyen iki işlem aynı anda yürütülebilir.
:::

### Örnek Talimat Yapısı

Aşağıda, bir `SOL transferi` talimatının yapısının bir örneği bulunmaktadır; bu yapı, talimat için gereken hesap anahtarlarını, program ID’sini ve verileri ayrıntılı olarak belirtmektedir.

- `keys`: Bir talimat için gereken her hesap için `AccountMeta`’yı içerir.
- `programId`: Çağrılan talimat için yürütme mantığını içeren programın adresi.
- `data`: Talimat için verilerin bir bayt dizisi olarak tanımlandığı belirtilen talimat verisi.

```
{
  "keys": [
    {
      "pubkey": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
      "isSigner": true,
      "isWritable": true
    },
    {
      "pubkey": "BpvxsLYKQZTH42jjtWHZpsVSa7s6JVwLKwBptPSHXuZc",
      "isSigner": false,
      "isWritable": true
    }
  ],
  "programId": "11111111111111111111111111111111",
  "data": [2,0,0,0,128,150,152,0,0,0,0,0]
}
```

## Genişletilmiş Örnek

Program talimatları oluşturma detayları genellikle istemci kütüphaneleri tarafından soyutlanmaktadır. Ancak, biri mevcut değilse, talimatı manuel olarak inşa etmeye daima geri dönebilirsiniz.

### Manuel SOL Transferi

İşte bir [Solana Playground](https://beta.solpg.io/656a102efb53fa325bfd0c3f) örneği; bu örnek, bir SOL transfer talimatını manuel olarak nasıl inşa edeceğinizi gösterir:

```typescript
// Transfer edilecek miktarı tanımlayın
const transferAmount = 0.01; // 0.01 SOL

// Sistem Programı transfer talimatı için talimat indeksi
const transferInstructionIndex = 2;

// Transfer talimatına iletilecek veriler için bir tampon oluşturun
const instructionData = Buffer.alloc(4 + 8); // uint32 + uint64
// Tampon içerisine talimat indeksini yazın
instructionData.writeUInt32LE(transferInstructionIndex, 0);
// Tampon içerisine transfer miktarını yazın
instructionData.writeBigUInt64LE(BigInt(transferAmount * LAMPORTS_PER_SOL), 4);

// Gönderen ile alıcı arasında SOL transferi yapmak için manuel bir transfer talimatı oluşturun
const transferInstruction = new TransactionInstruction({
  keys: [
    { pubkey: sender.publicKey, isSigner: true, isWritable: true },
    { pubkey: receiver.publicKey, isSigner: false, isWritable: true },
  ],
  programId: SystemProgram.programId,
  data: instructionData,
});

// Yeni bir işleme transfer talimatını ekleyin
const transaction = new Transaction().add(transferInstruction);
```

Arka planda, `SystemProgram.transfer` yöntemini kullanarak yapılan `basit örnek`, yukarıdaki daha uzun örnekle işlevsel olarak eşdeğerdir. `SystemProgram.transfer` yöntemi, yalnızca talimat verisi tamponu ve talimat için gereken her hesap için `AccountMeta` oluşturmaya ilişkin detayları soyutlamaktadır.