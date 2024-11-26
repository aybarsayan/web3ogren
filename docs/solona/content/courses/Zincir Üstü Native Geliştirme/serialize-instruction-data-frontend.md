---
title: Yerel Program Geliştirme İçin Özelleştirilmiş Talimat Verilerini Serileştirme
objectives:
  - Bir işlemin içeriğini açıklamak
  - İşlem talimatlarını açıklamak
  - Solana'nın çalışma zamanı optimizasyonlarının temellerini açıklamak
  - Borsh'u açıklamak
  - Yerel programlar için program verilerini serileştirmek için Borsh'u kullanmak
description: Solana hesaplarından alınan verileri nasıl çözümleriz.
---

## Özet

- Yerel (Anchor olmayan) Solana geliştirmesi, verilerin manuel olarak serileştirilmesini ve çözümlenmesini gerektirir.
- İşlemler, bir dizi talimattan oluşur; tek bir işlem içinde farklı programları hedefleyen herhangi bir sayıda talimat bulunabilir. Bir işlem gönderildiğinde, Solana çalışma zamanı talimatlarını sırayla ve atomik olarak işleme alacaktır; bu, herhangi bir talimatın herhangi bir nedenle başarısız olması durumunda, tüm işlemin işlenemeyeceği anlamına gelir.
  
> **Önemli Not:** Her _talimat_ üç bileşenden oluşur: hedef programın kimliği, ilgili tüm hesapların bir dizisi ve talimat verisinin bir bayt tamponu.  
> — Belirli bir yapı bilgisi

- Her _işlem_, okumak veya yazmak istediği tüm hesapların bir dizisini, bir veya daha fazla talimat, bir önceki blok hash'i ve bir veya daha fazla imzayı içerir.
- Bir istemciden talimat verisini geçirmek için bayt tamponuna serileştirilmesi gerekir. Bu serileştirme işlemini kolaylaştırmak için [Borsh](https://borsh.io/) kullanacağız.
- İşlemler, blockchain tarafından herhangi bir nedenle işlenemeyebilir; burada en yaygın olanlardan bazılarını tartışacağız.

---

## Ders

### İşlemler

:::note
Bu kurs, `Solana'ya Giriş` veya eşdeğer bilgi tamamlanmasını gerektirir. Ayrıca, Anchor'ın sağladığı kullanım kolaylığı ve güvenli varsayılanlar üzerinde daha fazla kontrolü tercih eden gelişmiş geliştiricileri hedeflemektedir. Onchain programlar geliştirmeye yeni başlıyorsanız, `Anchor` kullanmayı tercih edebilirsiniz.
:::

`Solana'ya Giriş` dersinde, yaygın Solana programları için talimatlarla işlemler oluşturmayı öğrendik.

Bu ders, birkaç derste geliştireceğimiz kendi yerel Solana programlarımız için talimatlar oluşturmayı gösterecektir. Özellikle, yerel (Anchor olmayan) program geliştirme için gerekli olan serileştirme ve çözümlenme ile ilgili olarak öğreneceğiz.

#### İşlem İçerikleri

Her işlem şunları içerir:

- Okumak veya yazmak istediği her hesabı içeren bir dizi
- Bir veya daha fazla talimat
- Son bir blok hash'i
- Bir veya daha fazla imza

`@solana/web3.js`, bu işlemi sizin için basitleştirir, böylece sadece talimatlar ve imzalar eklemeye odaklanabilirsiniz. Kütüphane, bu bilgilere dayanarak hesaplar dizisini oluşturur ve güncel bir blok hash'i içermenin mantığını yönetir.

### Talimatlar

Her talimat şunları içerir:

- Hedef programın kimliği (açık anahtar)
- Uygulama sırasında okunacak veya yazılacak her hesabı listeleyen bir dizi
- Talimat verisinin bir bayt tamponu

Programın açık anahtarı ile tanımlanması, talimatın doğru program tarafından gerçekleştirilmesini garanti eder.

Okunacak veya yazılacak her hesabın dizisini dahil etmek, ağın yüksek işlem yükünü ve daha hızlı yürütmeyi sağlayan birkaç optimizasyon gerçekleştirmesine olanak tanır.

Bayt tamponu, bir programa dış veriyi geçirmenizi sağlar.

Tek bir işlemde birden fazla talimat içerebilirsiniz. Solana çalışma zamanı bu talimatları sırayla ve atomik olarak işleme alacaktır. Diğer bir deyişle, eğer her talimat başarılı olursa, tüm işlem başarılı olacaktır; ancak eğer tek bir talimat başarısız olursa, tüm işlem hemen başarısız olacaktır ve yan etkisi olmayacaktır.

**Hesap dizisi**, sadece hesapların açık anahtarlarından oluşan bir dizi değildir. Dizideki her nesne hesabın açık anahtarını, işlemin imzacısı olup olmadığını ve yazılabilir olup olmadığını içerir. 

:::tip
Bir talimatın yürütülmesi sırasında bir hesabın yazılabilir olup olmadığını dahil etmek, çalışma zamanının akıllı sözleşmelerin paralel işlenmesini kolaylaştırmasını sağlar. Hangi hesapların yalnızca okunabilir ve hangi hesaplara yazılacağını belirlemeniz gerektiği için, çalışma zamanı, hangi işlemlerin örtüşmeyen veya yalnızca okunabilir olduğunu belirleyebilir ve bunların eşzamanlı olarak yürütülmesine izin verebilir.
:::

Solana'nın çalışma zamanı hakkında daha fazla bilgi edinmek için bu [blog yazısını Sealevel](https://solana.com/news/sealevel---parallel-processing-thousands-of-smart-contracts) kontrol edin.

---

#### Talimat Verisi

Talimatlara rastgele veri ekleyebilme yeteneği, programların dinamik ve esnek olmasını sağlamak için önemlidir; bu, bir HTTP isteğinin gövdesinin dinamik ve esnek REST API'leri oluşturmanıza olanak tanımasıyla aynıdır.

Bir HTTP isteğinin gövdesinin yapısı çağrılacak uç noktaya bağlıyken, talimat verisi olarak kullanılan bayt tamponunun yapısı tamamen alıcı programa bağlıdır. Kendi tam yığın dApp'inizi oluşturuyorsanız, o zaman programı oluştururken kullandığınız aynı yapılandırmayı istemci tarafı koduna kopyalamanız gerekecektir. Program geliştirmesiyle ilgilenen başka bir geliştiriciyle çalışıyorsanız, eşleşen tampon düzenlerini sağlamak için koordine olabilirsiniz.

> **Örnek:** Somut bir örneğe bakalım. Bir Web3 oyunu üzerinde çalıştığınızı ve bir oyuncu envanteri programı ile etkileşime giren istemci tarafı kodunu yazmaktan sorumlu olduğunuzu hayal edin. 

Program, istemcinin:

- Bir oyuncunun oyun sonuçlarına göre envanter ekleyebilmesine
- Envanteri bir oyuncudan diğerine transfer edebilmesine
- Seçilen envanter öğeleriyle bir oyuncuyu donatabilmesine olanak tanıyacak şekilde tasarlandı.

Bu program, her birinin kendi fonksiyonunda kapsülendiği şekilde yapılandırılmış olacaktır. Ancak her programın yalnızca bir giriş noktası vardır. Talimat verisi aracılığıyla bu fonksiyonlardan hangisinin çalıştırılacağını programa talimat edeceksiniz.

Ayrıca talimat verisinde, fonksiyonun düzgün bir şekilde yürütülmesi için gerekli olan herhangi bir bilgiyi de dahil edeceksiniz, örneğin bir envanter öğesinin ID'si, envanteri transfer edilecek bir oyuncu vb.

Bu verinin tam olarak nasıl yapılandırılacağı, programın nasıl yazıldığına bağlı olacaktır; ancak talimat verisindeki ilk alanın, programın bir fonksiyona eşleştirebileceği bir sayı olması yaygındır, sonrasında ise ek alanlar fonksiyon argümanları olarak işlev görür.

### Serileştirme

Bir talimat veri tamponuna hangi bilgilerin dahil edileceğini bilmenin yanı sıra, bunu düzgün bir şekilde serileştirmeniz de gerekir. Solana'da en yaygın kullanılan serileştirici [Borsh](https://borsh.io)'dur. Web sitesine göre:

> Borsh, Hashing için İkili Nesne Temsili Serileştiricisidir. Güvenlik açısından kritik projelerde kullanılmak üzere tasarlanmıştır; tutarlılığı, güvenliği, hızı öncelikli notar.  
> — Borsh Projesi

Borsh, yaygın türleri bir tampona serileştiren bir [JS kütüphanesi](https://github.com/near/borsh-js) sunmaktadır. Bu süreci daha da kolaylaştırmayı amaçlayan Borsh üzerinde inşa edilen diğer paketler de mevcuttur. `@coral-xyz/borsh` kütüphanesini kullanacağız ve bu, `npm` kullanılarak yüklenebilir.

Önceki oyun envanteri örneğini temel alarak, programı belirli bir öğeyle bir oyuncuyu donatması için talimat verdiğimiz varsayımsal bir senaryoya bakalım. Varsayalım ki program, aşağıdaki özelliklere sahip bir yapı temsil eden bir tampon kabul edecek şekilde tasarlanmıştır:

1. `variant`, programın hangi talimatı veya fonksiyonu çalıştıracağını belirten unsigned, 8-bit bir tam sayıdır.
2. `playerId`, verilen öğe ile donatılacak oyuncunun oyuncu kimliğini temsil eden unsigned, 16-bit bir tam sayıdır.
3. `itemId`, verilen oyuncu için donatılacak öğenin kimliğini temsil eden unsigned, 256-bit bir tam sayıdır.

Tüm bunlar, sırayla okunacak bir bayt tamponu olarak geçecektir; bu nedenle, uygun tampon düzeni sırasını sağlamak kritik önem taşır.

```typescript
import * as borsh from "@coral-xyz/borsh";

const equipPlayerSchema = borsh.struct([
  borsh.u8("variant"),
  borsh.u16("playerId"),
  borsh.u256("itemId"),
]);
```

Verileri bu şema ile `encode` yöntemi kullanarak kodlayabilirsiniz. Bu yöntem, serileştirilecek verileri temsil eden bir nesne ve bir tamponu argüman olarak alır. Aşağıdaki örnekte, gereğinden çok daha büyük yeni bir tampon ayırıyoruz, ardından verileri o tampona kodluyoruz ve orijinal tamponu, yalnızca gerektiği kadar büyük yeni bir tampona dilimliyoruz.

```typescript
import * as borsh from "@coral-xyz/borsh";

const equipPlayerSchema = borsh.struct([
  borsh.u8("variant"),
  borsh.u16("playerId"),
  borsh.u256("itemId"),
]);

const buffer = Buffer.alloc(1000);
equipPlayerSchema.encode(
  { variant: 2, playerId: 1435, itemId: 737498 },
  buffer,
);

const instructionBuffer = buffer.subarray(0, equipPlayerSchema.getSpan(buffer));
```

Bir tampon başarılı bir şekilde oluşturulduktan ve veriler serileştirildikten sonra geriye kalan tek şey, işlemi oluşturmaktır. Bu, daha önceki derslerde yaptığınız şeye benzer. Aşağıdaki örnek, şunları varsayıyor:

- `player`, `playerInfoAccount` ve `PROGRAM_ID` zaten kod snippet'inin dışındaki bir yerde tanımlı
- `player`, bir kullanıcının açık anahtarıdır
- `playerInfoAccount`, envanter değişikliklerinin yazılacağı hesabın açık anahtarıdır
- Talimatın yürütülmesi sürecinde `SystemProgram` kullanılacaktır.

```typescript
import * as borsh from "@coral-xyz/borsh";
import {
  clusterApiUrl,
  Connection,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const equipPlayerSchema = borsh.struct([
  borsh.u8("variant"),
  borsh.u16("playerId"),
  borsh.u256("itemId"),
]);

const buffer = Buffer.alloc(1000);
equipPlayerSchema.encode(
  { variant: 2, playerId: 1435, itemId: 737498 },
  buffer,
);

const instructionBuffer = buffer.subarray(0, equipPlayerSchema.getSpan(buffer));

const endpoint = clusterApiUrl("devnet");
const connection = new Connection(endpoint);

const transaction = new Transaction();
const instruction = new TransactionInstruction({
  keys: [
    {
      pubkey: player.publicKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: playerInfoAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
  ],
  data: instructionBuffer,
  programId: PROGRAM_ID,
});

transaction.add(instruction);

try {
  const transactionId = await sendAndConfirmTransaction(
    connection,
    transaction,
    [player],
  );
  const explorerLink = getExplorerLink("transaction", transactionId, "devnet");
  console.log(`İşlem gönderildi: ${explorerLink}`);
} catch (error) {
  alert(error);
}
```

---

## Laboratuvar

Birlikte bu süreci pratiğe dökelim ve kullanıcıların bir film incelemesi göndermesine ve bunun Solana ağına kaydedilmesine olanak tanıyan bir Film İncelemesi uygulaması inşa edelim. Bu uygulamayı, her derste yeni işlevsellik ekleyerek parça parça inşa edeceğiz.

![Film inceleme ön yüzü](../../../images/solana/public/assets/courses/movie-review-dapp.png)

İnşa edeceğimiz programın hızlı bir diyagramı:

![Solana, verileri PDAs'da saklar; bu PDAs, tohumları kullanılarak bulunabilir](../../../images/solana/public/assets/courses/unboxed/movie-review-program.svg)

Bu uygulama için kullanacağımız Solana programının açık anahtarı `CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN`'dir.

#### 1. Başlangıç kodunu indirin

Başlamadan önce, [başlangıç kodunu](https://github.com/solana-developers/movie-review-frontend/tree/starter) indirip indirmediğinizi kontrol edin.

Proje, oldukça basit bir Next.js uygulamasıdır. "Cüzdanlar" dersinde oluşturduğumuz `WalletContextProvider`'ı, bir film incelemesini görüntülemek için `Card` bileşenini, incelemeleri bir listede görüntülemek için `MovieList` bileşenini, yeni bir inceleme göndermek için `Form` bileşenini ve `Movie.ts` dosyasını içermektedir; bu dosya, `Movie` nesnesinin sınıf tanımını içerir.

Şu an için, `npm run dev` ile çalıştırdığınızda sayfada görüntülenen filmlerin mock olduğunu unutmayın. Bu derste, yeni bir inceleme eklemeye odaklanacağız ancak o incelemenin görüntülenmesi için henüz bir şey yapamayacağız. Bir sonraki derste, onchain hesaplardan özel verileri çözümlenemeye odaklanacağız.

#### 2. Tampon düzenini oluşturun

Bir Solana programı ile düzgün bir şekilde etkileşimde bulunmak için, verilerin nasıl yapılandırılmasını beklediğini bilmeniz gerekir. Film İncelemeleri programımız, talimat verisinin şunları içermesini bekler:

1. `variant`, hangi talimatın (programda hangi fonksiyonun çağrılacağı) yürütüleceğini temsil eden unsigned, 8-bit bir tam sayıdır.
2. `title`, incelediğiniz filmin başlığını temsil eden bir dizedir.
3. `rating`, incelediğiniz filme verdiğiniz 5 üzerinden puanı temsil eden unsigned, 8-bit bir tam sayıdır.
4. `description`, filme bıraktığınız yazılı incelemenin içeriğini temsil eden bir dizedir.

`Movie` sınıfında bir `borsh` düzeni yapılandırmaya başlayalım. Öncelikle `@coral-xyz/borsh`'i içe aktarın. Sonra uygun `borsh` yapısını içeren bir `borshInstructionSchema` özelliği oluşturun.

```typescript
import * as borsh from '@coral-xyz/borsh'

export class Movie {
  title: string;
  rating: number;
  description: string;

  ...

  borshInstructionSchema = borsh.struct([
    borsh.u8('variant'),
    borsh.str('title'),
    borsh.u8('rating'),
    borsh.str('description'),
  ])
}
```

Unutmayın ki *sıra önemlidir*. Buradaki özelliklerin sırası, programın yapısıyla farklı olursa, işlem başarısız olacaktır.

#### 3. Verileri serileştirmek için bir yöntem oluşturun

Artık tampon düzenimizi ayarladığımıza göre, `Movie` sınıfında, bir `Buffer` döndüren `serialize()` adında bir yöntem oluşturalım; bu yöntem, `Movie` nesnesinin özelliklerini uygun düzen içinde kodlayacaktır.

Sabit bir tampon boyutu ayırmak yerine, `Movie` nesnesindeki her alan için gereken alanı dinamik olarak hesaplayacağız. Özellikle, `INIT_SPACE` (dize uzunluğu meta verisini hesaba katmak için) ve `ANCHOR_DISCRIMINATOR`'ı (Anchor tarafından kullanılan 8 baytlık ayırıcıyı hesaba katmak için) kullanacağız.

```typescript
import * as borsh from "@coral-xyz/borsh";

// Boyut hesaplamaları için sabitler
const ANCHOR_DISCRIMINATOR = 8; // Anchor tarafından kullanılan hesap ayırıcı için 8 bayt
const STRING_LENGTH_SPACE = 4; // Her dizenin uzunluğunu saklamak için 4 bayt

// 'title' ve 'description' dizeleri için özel boyutlar
const TITLE_SIZE = 100; // 'title' için 100 bayt ayır
const DESCRIPTION_SIZE = 500; // 'description' için 500 bayt ayır

// Film inceleme yapısının toplam alan hesaplaması
const MOVIE_REVIEW_SPACE =
  ANCHOR_DISCRIMINATOR + // 8 bayt hesap ayırıcı için
  STRING_LENGTH_SPACE +
  TITLE_SIZE + // Başlık uzunluğu için 4 bayt + başlık için 100 bayt
  STRING_LENGTH_SPACE +
  DESCRIPTION_SIZE + // Açıklama uzunluğu için 4 bayt + açıklama için 500 bayt
  1 + // 'variant' için 1 bayt
  1; // 'rating' için 1 bayt

export class Movie {
  title: string;
  rating: number;
  description: string;

  constructor(title: string, rating: number, description: string) {
    // Başlık ve açıklama için belirli boyutları zorlayın
    if (title.length > TITLE_SIZE) {
      throw new Error(`Başlık ${TITLE_SIZE} karakteri aşamaz.`);
    }
    if (description.length > DESCRIPTION_SIZE) {
      throw new Error(
        `Açıklama ${DESCRIPTION_SIZE} karakteri aşamaz.`,
      );
    }

    this.title = title;
    this.rating = rating;
    this.description = description;
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.u8("rating"),
    borsh.str("description"),
  ]);

  serialize(): Buffer {
    try {
      // Tam olarak gereken alanla bir tampon ayırın
      const buffer = Buffer.alloc(MOVIE_REVIEW_SPACE);
      this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
      return buffer.subarray(0, this.borshInstructionSchema.getSpan(buffer));
    } catch (error) {
      console.error("Serileştirme hatası:", error);
      return Buffer.alloc(0);
    }
  }
}
```

Yukarıda gösterilen yöntem, önce nesnemiz için yeterince büyük bir tampon oluşturur, ardından `{ ...this, variant: 0 }`'ı o tampona kodlar. Çünkü `Movie` sınıf tanımı, tampon düzeni için gereken 4 özellikten 3'ünü içerir ve aynı isimlendirmeyi kullandığı için doğrudan yayma operatörüyle kullanabiliriz ve sadece `variant` özelliğini ekleyebiliriz. Son olarak, yöntem, orijinalinden kullanılmayan kısmı çıkararak yeni bir tampon döndürür.

#### 4. Kullanıcı formu gönderdiğinde bir işlem gönderin

Artık talimat veri yapı taşlarına sahip olduğumuza göre, kullanıcı formu gönderdiğinde işlemi oluşturup gönderebiliriz. `Form.tsx` dosyasını açın ve `handleTransactionSubmit` fonksiyonunu bulun. Bu, kullanıcı Film Değerlendirme formunu her gönderdiğinde `handleSubmit` tarafından çağrılır.

Bu fonksiyonun içinde, form aracılığıyla gönderilen verileri içeren işlemi oluşturup göndereceğiz.

**Öncelikle** `@solana/web3.js`'i içe aktarın ve `useConnection` ile `useWallet`'ı `@solana/wallet-adapter-react`'ten içe aktarın.

```tsx
import { FC } from "react";
import { Movie } from "../models/Movie";
import { useState } from "react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
```

---

Sonraki adımda, `handleSubmit` fonksiyonundan önce `useConnection()` çağrısını yaparak bir `connection` nesnesi alın ve `useWallet()` çağrısını yaparak `publicKey` ve `sendTransaction`'ı alın.

```tsx
import { FC } from 'react'
import { Movie } from '../models/Movie'
import { useState } from 'react'
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js"
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getExplorerLink } from "@solana-developers/helpers";

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const Form: FC = () => {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const movie = new Movie(title, rating, description)
    handleTransactionSubmit(movie)
  }

  ...
}
```

:::tip
`handleTransactionSubmit` fonksiyonunu uygulamadan önce, ne yapılması gerektiğinden bahsedelim. Şunları yapmamız gerekiyor:
:::

1. Kullanıcının cüzdanını bağladığını doğrulamak için `publicKey`'nin var olup olmadığını kontrol edin.
2. `movie` üzerinde `serialize()` çağrısını yaparak talimat verilerinin temsil edildiği bir tampon alın.
3. Yeni bir `Transaction` nesnesi oluşturun.
4. İşlemin okunacağı veya yazılacağı tüm hesapları alın.
5. Bu hesapların tümünü `keys` argümanında içeren, tamponu `data` argümanında ve programın kamu anahtarını `programId` argümanında içeren yeni bir `Instruction` nesnesi oluşturun.
6. Son adımda elde edilen talimatı işleme ekleyin.
7. Birleştirilmiş işlemi geçirerek `sendTransaction` çağrısını yapın.

Bu oldukça fazla işlem! Ama endişelenmeyin, bunu yaptıkça daha kolay hale gelecektir. Yukarıdaki ilk 3 adımla başlayalım:

```typescript
const handleTransactionSubmit = async (movie: Movie) => {
  if (!publicKey) {
    alert("Lütfen cüzdanınızı bağlayın!");
    return;
  }

  const buffer = movie.serialize();
  const transaction = new Transaction();
};
```

---

Sonraki adım, işlemin okuyacağı veya yazacağı tüm hesapları almaktır. Geçmiş derslerde verilerin saklanacağı hesap size verilmişti. Bu sefer, hesabın adresi daha dinamik olduğu için hesaplanması gerekiyor. Bunu bir sonraki derste derinlemesine ele alacağız, fakat şu anda aşağıdaki gibi kullanabilirsiniz; burada `pda` verilerin saklanacağı hesabın adresidir:

```typescript
const [pda] = await PublicKey.findProgramAddressSync(

  [publicKey.toBuffer(), Buffer.from(movie.title)],  new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
);
```

:::note
Bu hesaba ek olarak, programın `SystemProgram`'den de okuması gerekiyor, bu yüzden dizimiz `SystemProgram.programId`'yi de içermelidir.
:::

Bununla birlikte, kalan adımları tamamlayabiliriz:

```typescript
const handleTransactionSubmit = async (movie: Movie) => {
  if (!publicKey) {
    alert("Lütfen cüzdanınızı bağlayın!");
    return;
  }

  const buffer = movie.serialize();
  const transaction = new Transaction();

  const [pda] = await PublicKey.findProgramAddressSync(
    [publicKey.toBuffer(), new TextEncoder().encode(movie.title)],
    new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
  );

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: buffer,
    programId: new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
  });

  transaction.add(instruction);

  try {
    let transactionId = await sendTransaction(transaction, connection);
    const explorerLink = getExplorerLink(
      "transaction",
      transactionId,
      "devnet",
    );
    console.log(`İşlem gönderildi: ${explorerLink}`);
  } catch (error) {
    alert(error);
  }
};
```

---

Ve hepsi bu! Artık sitedeki formu kullanarak bir film incelemesi gönderebilirsiniz. Arayüzde yeni incelemeyi yansıtan bir güncelleme görmeyeceksiniz, ancak işlemin başarıyla gerçekleştiğini görmek için Solana Explorer üzerindeki işlem günlüğüne bakabilirsiniz.

Bu projeyle rahat hissetmek için biraz daha zamana ihtiyacınız varsa, tam
[çözüm koduna](https://github.com/solana-developers/movie-review-frontend/tree/solution-serialize-instruction-data) göz atabilirsiniz.

## Zorluk

Artık bağımsız olarak bir şeyler inşa etme zamanı. Bu kursun öğrencilerinin kendilerini tanıttığı bir uygulama oluşturun! Bunu destekleyen Solana programı `HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf` adresindedir.

![Öğrenci Tanıtımları ön yüzü](../../../images/solana/public/assets/courses/student-intros-frontend.png)

1. Bunu sıfırdan inşa edebilir veya
   [başlangıç kodunu indirebilirsiniz](https://github.com/solana-developers/solana-student-intro-frontend/tree/starter).
2. `StudentIntro.ts` dosyasında talimat tamponu düzenini oluşturun. Program, talimat verilerinin şunları içermesini bekler:
   1. Çalıştırılacak talimatı temsil eden (`0` olmalı) işaretsiz, 8 bitlik bir tamsayı olan `variant`.
   2. Öğrencinin adını temsil eden bir dize olan `name`.
   3. Öğrencinin Solana yolculuğuna dair paylaştığı mesajı temsil eden bir dize olan `message`.
3. `StudentIntro.ts` dosyasında bir `StudentIntro` nesnesini serileştirmek için tampon düzenini kullanacak bir yöntem oluşturun.
4. `Form` bileşeninde, `StudentIntro`'yu serileştiren, uygun işlemi ve işlem talimatlarını oluşturan ve işlemi kullanıcının cüzdanına gönderen `handleTransactionSubmit` fonksiyonunu uygulayın.
5. Artık tanıtımları gönderebilir ve bilgilerin zincir üzerinde saklanmasını sağlayabilirsiniz! İşlem kimliğini kaydetmeyi unutmayın ve çalıştığını doğrulamak için Solana Explorer'da görün.

:::warning
Eğer bir noktada tıkanırsanız,
[çözüm koduna göz atabilirsiniz](https://github.com/solana-developers/solana-student-intro-frontend/tree/solution-serialize-instruction-data).
:::

Bu zorluklarla yaratıcılığınızı kullanmaktan çekinmeyin ve daha da ileri götürün. Talimatlar sizi geri tutmak için burada değil!


Kodunuzu GitHub'a yükleyin ve
[bize bu dersle ilgili ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=6cb40094-3def-4b66-8a72-dd5f00298f61)!
