---
title: Özel onchain programları kullanma
objectives:
  - Özel onchain programlar için işlemler oluşturun
description:
  "TransactionInstruction yapıcısını kullanarak keyfi programlar için talimatlar
  oluşturun."
---

## Özet

Solana, kullanabileceğiniz birden fazla onchain programa sahiptir. Bu programları
kullanan talimatların, çağrılan onchain programındaki belirli işlev tarafından
belirlenmiş özel bir formatta verileri vardır.

---

## Ders

### Talimatlar

Önceki derslerde, Solana'da SOL transfer etmek için `@solana/web3.js`'den
`SystemProgram.transfer()` fonksiyonunu kullandık.

Ancak diğer programlarla çalışırken, talimatları manuel olarak oluşturmanız
gerekir. `@solana/web3.js` ile `TransactionInstruction` yapıcısını kullanarak
talimatlar oluşturabilirsiniz:

```typescript
const instruction = new TransactionInstruction({
  programId: PublicKey;
  keys: [
    {
      pubkey: Pubkey,
      isSigner: boolean,
      isWritable: boolean,
    },
  ],
  data?: Buffer;
});
```

`TransactionInstruction()` 3 alan alır:

- `programId` alanı oldukça açıklayıcıdır: bu programın genel anahtarı (aynı
  zamanda 'adres' veya 'program ID' olarak da adlandırılır).

- `keys`, işlemler sırasında nasıl kullanılacak olan hesapların bir dizisidir.
  Çağırdığınız programın davranışını bilmeniz ve dizide gerekli olan tüm hesapları
  sağladığınızdan emin olmanız gerekir.

  - `pubkey` - hesabın genel anahtarı
  - `isSigner` - hesabın işlemin imzalayıcısı olup olmadığını belirten bir boolean
  - `isWritable` - hesabın işlem sırasında yazılıp yazılmayacağını belirten bir boolean

- programa iletilecek verileri içeren isteğe bağlı bir `Buffer`. Şu anda `data`
  alanını göz ardı edeceğiz, ancak gelecekteki bir derste tekrar ele alacağız.

Talimatımızı oluşturduktan sonra, onu bir işleme ekliyoruz, işlemi işlenmesi ve
onaylanması için RPC'mize gönderiyoruz, ardından işlem imzasına bakıyoruz.

```typescript
const transaction = new web3.Transaction().add(instruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [payer],
);

console.log(`✅ Başarılı! İşlem imzası: ${signature}`);
```

---

### Solana Explorer

![Solana Explorer Devnet'te ayarlanmış](../../../images/solana/public/assets/courses/unboxed/solana-explorer-devnet.png)

Blok zincirindeki tüm işlemler herkese açık olarak 
[Solana Explorer](http://explorer.solana.com) üzerinden görüntülenebilir. Örneğin, yukarıdaki
örnekte `sendAndConfirmTransaction()` ile döndürülen imzayı alabilir,
Solana Explorer'da bu imzayı aratabilir ve şöyle bilgileri görebilirsiniz:

- Ne zaman gerçekleşti
- Hangi blokta yer aldı
- İşlem ücreti
- ve daha fazlası!

![Bir işlem hakkında detaylar içeren Solana Explorer](../../../images/solana/public/assets/courses/unboxed/solana-explorer-transaction-overview.png)

---

## Laboratuvar

### Ping sayacı programı için işlemler yazma

Her seferinde bir ping yapıldığında bir sayacı artıracak bir onchain programa ping
atmak için bir script oluşturacağız. Bu program Solana Devnet'te `ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa` adresinde
mevcuttur. Program verilerini `Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod` adresindeki
belirli bir hesapta saklar.

![Solana programları ve verileri ayrı hesaplarda saklar](../../../images/solana/public/assets/courses/unboxed/pdas-global-state.svg)

### Temel iskelet

Daha önce `Veri Yazımına Giriş` dersinde yaptığımız
aynı paketleri ve `.env` dosyasını kullanarak başlayacağız.

Dosyayı `send-ping-transaction.ts` olarak adlandırın:

```typescript
import * as web3 from "@solana/web3.js";
import "dotenv/config";
import {
  getKeypairFromEnvironment,
  airdropIfRequired,
} from "@solana-developers/helpers";

const payer = getKeypairFromEnvironment("SECRET_KEY");
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

const newBalance = await airdropIfRequired(
  connection,
  payer.publicKey,
  1 * web3.LAMPORTS_PER_SOL,
  0.5 * web3.LAMPORTS_PER_SOL,
);
```

Bu, Solana Devnet'e bağlanacak ve gerekirse test Lamport talep edecektir.

---

### Ping programı

Şimdi Ping programıyla iletişim kuralım! Bunu yapmak için:

1. bir işlem oluşturun
2. bir talimat oluşturun
3. talimatı işleme ekleyin
4. işlemi gönderin

:::tip
Unutmayın, buradaki en zor kısım doğru bilgileri talimatlara dahil etmektir.
:::

Çağırdığımız programın adresini biliyoruz. Ayrıca, programın yazdığı veri için
separate adrese de sahibiz. Bunların her ikisinin string versiyonlarını dosyanın
üst kısmında sabitler olarak ekleyelim:

```typescript
const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS =
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";
```

Şimdi yeni bir işlem oluşturalım, ardından program hesabı için bir `PublicKey`
ve veri hesabı için başka bir `PublicKey` başlatalım.

```typescript
const transaction = new web3.Transaction();
const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);
```

Sonrasında, talimatı oluşturalım. Unutmayın, talimatın Ping programının genel
anahtarını içermesi ve okunacak veya yazılacak tüm hesapları içeren bir dizi
bulundurması gerekmektedir. Bu örnek programda, yalnızca yukarıda bahsedilen
veri hesabı gereklidir.

```typescript
const transaction = new web3.Transaction();
const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

const instruction = new web3.TransactionInstruction({
  keys: [
    {
      pubkey: pingProgramDataId,
      isSigner: false,
      isWritable: true,
    },
  ],
  programId,
});
```

Sonrasında, oluşturduğumuz işleme bu talimatı ekleyelim. Ardından,
`sendAndConfirmTransaction()` fonksiyonunu çağırarak bağlantıyı, işlemi ve
ödeyiciyi geçelim. Son olarak, o fonksiyon çağrısının sonucunu konsolda
yazdıralım, böylece Solana Explorer'da kontrol edebiliriz.

```typescript
transaction.add(instruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [payer],
);

console.log(`✅ İşlem tamamlandı! İmza: ${signature}`);
```

---

### Ping istemcisini çalıştırın ve Solana Explorer'ı kontrol edin

Şimdi kodu aşağıdaki komutla çalıştırın:

```bash
npx esrun send-ping-transaction.ts
```

Biraz zaman alabilir ama konsolda aşağıdaki gibi uzun bir dizi göreceksiniz:

```
✅ İşlem tamamlandı! İmza: 55S47uwMJprFMLhRSewkoUuzUs5V6BpNfRx21MpngRUQG3AswCzCSxvQmS3WEPWDJM7bhHm3bYBrqRshj672cUSG
```

İşlem imzasını kopyalayın. Ardından
[Devnet'te Solana explorer](https://explorer.solana.com/?cluster=devnet) ziyaret edin. İmza
arama çubuğuna yapıştırın (Devnet'e bağlı olduğunuzdan emin olun) ve
enter'a basın. İşlemle ilgili tüm detayları görmelisiniz. Sayfanın en altına
kadar kaydırırsanız, `Program Logs` bölümü, programın kaç kez pinglendiğini
gösterir ve sizin pinginizi içerir.

![Ping programını çağırmaktan elde edilen loglarla Solana Explorer](../../../images/solana/public/assets/courses/unboxed/solana-explorer-ping-result.png)

Explorer'da gezinirseniz, şöyle şeyler göreceksiniz:

- **Hesap Girdi(leri)** şunları içerecektir:
  - Ödeme yapanın adresi - işlem için 5000 lamportun borçlandırıldığı
  - Ping programının adresi
  - Ping programının veri adresi
- **Talimat** bölümünde hiçbir veri içermeyen tek bir talimat olacaktır -
  ping programı oldukça basit bir programdır, bu nedenle herhangi bir veriye ihtiyaç duymamaktadır.
- **Program Talimat Logları** ping programından gelen logları gösterir.

Gelecekte Solana Explorer'da işlemleri görüntülemeyi kolaylaştırmak isterseniz,
`console.log` işlemini şu şekilde değiştirebilirsiniz:

```typescript
console.log(
  `İşleminizi Solana Explorer'da görüntüleyebilirsiniz:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
);
```

Ve işte bu şekilde, Solana ağında programlar çağırabilir ve onchain veri yazabilirsiniz!

Sonraki birkaç derste, nasıl 

1. tarayıcıdan güvenli bir şekilde işlemler göndereceğinizi
2. talimatlarınıza özel veriler ekleyeceğinizi
3. zincirden verileri çözümleyebileceğinizi öğreneceksiniz

---

## Challenge

Devnet'te bir hesabın SOL’lerini başka bir hesaba aktarmanızı sağlayacak sıfırdan
bir script oluşturun. İşlem imzasını yazdırmayı unutmayın, böylece Solana Explorer'da
görüntüleyebilirsiniz.

Eğer takılırsanız, [çözüm koduna](https://github.com/Unboxed-Software/solana-ping-client) göz atabilirsiniz.


Kodunuzu GitHub'a yükleyin ve
[burası hakkında ne düşündüğünüzü bize bildirin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=e969d07e-ae85-48c3-976f-261a22f02e52)!
