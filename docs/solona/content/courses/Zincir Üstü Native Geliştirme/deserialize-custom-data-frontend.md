---
title: Program Verileri Deserileştirme
objectives:
  - Program Türetilmiş Hesapları açıklamak
  - Belirli tohumlarla PDA'ları türetmek
  - Bir programın hesaplarını almak
  - Özel verileri deserileştirmek için Borsh kullanmak
description:
  Native programınıza göndermek için JS/TS istemcilerinde desenetleme talimatları.
---

## Özet

- Programlar, **Program Türetilmiş Adres** (PDA) olarak adlandırılan hesaplarda veri depolar.
- PDA'ların karşılık gelen bir gizli anahtarı yoktur.
- Veri saklamak ve bulmak için `findProgramAddress(seeds, programid)` yöntemini kullanarak bir PDA türetin.
- Bir programa ait hesapları `getProgramAccounts(programId)` kullanarak alabilirsiniz.
- Hesap verileri, ilk başta saklamak için kullanılan aynı düzen kullanılarak deserileştirilmelidir. Bir şema oluşturmak için `@coral-xyz/borsh` kullanabilirsiniz.

## Ders

Son derste, Solana programı tarafından onchain'a saklanan program verilerini seri hale getirdik. Bu derste, programların zincir üzerinde verileri nasıl sakladığını, verileri nasıl alacağını ve sakladıkları verileri nasıl deserileştireceğini daha ayrıntılı olarak ele alacağız.

### Programlar

Deyim yerindeyse, Solana'da her şey bir hesaptır. Hatta programlar bile. Programlar, kodu saklayan ve çalıştırılabilir olarak işaretlenmiş hesaplardır. Bu kod, talimat verildiğinde Solana çalışma zamanı tarafından çalıştırılabilir. **Bir program adresi, Ed25519 Eliptik Eğrisi üzerinde bir genel anahtardır.** Tüm genel anahtarlar gibi, bunların da karşılık gelen gizli anahtarları vardır.

:::note
Programlar verileri kodlarından ayrı olarak saklar. 
::: 

Programlar, **Program Türetilmiş Adresi** (PDA) olarak adlandırılan hesaplarda veri saklar. PDA, Solana'ya özgü bir kavram olsa da, desen aşina bir modeldir:

- PDA'ları, adresin anahtar ve hesap içindeki verinin değer olduğu bir anahtar-değer deposu olarak düşünebilirsiniz.
- PDA'ları ayrıca, adresin içindeki değerleri aramak için kullanılan birincil anahtar olduğu veritabanındaki kayıtlar olarak da değerlendirebilirsiniz.

PDA'lar, bir program adresi ve bazı geliştirici tarafından seçilen tohumları birleştirerek veri parçalarını saklayan adresler oluşturur. PDA'lar Ed25519 Eliptik eğrisinin _dışında_ yer alan adresler olduğu için, PDA'ların gizli anahtarları yoktur. Bunun yerine, PDA'lar, onları oluşturmak için kullanılan program adresi tarafından imzalanabilir.

PDA'lar ve içindeki veriler, program adresi, bump ve tohumlara dayanarak sürekli olarak bulunabilir. Bir PDA bulmak için, geliştiricinin seçtiği (örneğin bir metin dizesi) program kimliği ve tohumlar `findProgramAddress()` fonksiyonuna geçirilir.

> Bazı örneklere bir göz atalım...

##### Örnek: global durumlu program

Global durumu olan basit bir program - ping sayacımız gibi - `"GLOBAL_STATE"` gibi basit bir tohum ifadesi temelinde yalnızca bir PDA kullanmayı isteyebilir. İstemci bu PDA'dan veri okumak isterse, program kimliğini ve bu aynı tohumu kullanarak adresi türetebilir.

```typescript
const [pda, bump] = await findProgramAddress(
  Buffer.from("GLOBAL_STATE"),
  programId,
);
```

![Bir PDA kullanarak global durum](../../../images/solana/public/assets/courses/unboxed/pdas-global-state.svg)

##### Örnek: kullanıcıya özel verileri olan program

Kullanıcıya özel verileri saklayan programlarda, genellikle kullanıcının genel anahtarını tohum olarak kullanmak yaygındır. Bu, her kullanıcının verilerini kendi PDA'sına ayırır. Ayrım, istemcinin her kullanıcının verisini kullanıcı kimliği ve genel anahtarını kullanarak adresi bularak bulmasını sağlar.

```typescript
import { PublicKey } from "@solana/web3.js";
const [pda, bump] = await PublicKey.findProgramAddressSync(
  [publicKey.toBuffer()],
  programId,
);
```

![Kullanıcıya özel durum](../../../images/solana/public/assets/courses/unboxed/pdas-per-user-state.svg)

#### Örnek: her kullanıcı için birden fazla veri öğesi olan program

Kullanıcı başına birden fazla veri öğesi olduğunda, bir program hesapları oluşturmak ve tanımlamak için daha fazla tohum kullanabilir. Örneğin, bir not alma uygulamasında, her not için bir hesap olabilir ve her PDA, kullanıcının genel anahtarı ve notun başlığı ile türetilir.

```typescript
const [pda, bump] = await PublicKey.findProgramAddressSync(
  [publicKey.toBuffer(), Buffer.from("Alışveriş listesi")],
  programId,
);
```

![Bir PDA kullanarak not alma programı](../../../images/solana/public/assets/courses/unboxed/pdas-note-taking-program.svg)

Bu örnekte, hem Alice hem de Bob'un 'Alışveriş Listesi' adında bir notu olduğunu görebiliriz, ancak cüzdan adresini tohumlardan biri olarak kullandığımız için bu iki not aynı anda var olabilir.

#### Birden Fazla Program Hesabını Alma

Adresleri türetmenin yanı sıra, `connection.getProgramAccounts(programId)` kullanarak bir program tarafından oluşturulan tüm hesapları alabilirsiniz. Bu, her nesnenin `pubkey` özelliğine sahip olduğu nesnelerin bir dizisini döndürür. Bu `pubkey`, hesabın genel anahtarını ve `account` özelliği `AccountInfo` türündedir. Hesap verilerini almak için `account` özelliğini kullanabilirsiniz.

```typescript
const fetchProgramAccounts = async () => {
  try {
    const accounts = await connection.getProgramAccounts(programId);

    accounts.forEach(({ pubkey, account }) => {
      console.log("Hesap:", pubkey.toBase58());
      console.log("Veri alanı:", account.data);
    });
  } catch (error) {
    console.error("Program hesaplarını alırken hata:", error);
  }
};

fetchProgramAccounts();
```

### Program verilerini deserileştirme

`AccountInfo` nesnesindeki `data` özelliği bir tampon (buffer) nesnesidir. Bunu verimli bir şekilde kullanmak için, içeriğini daha kullanılabilir bir hale dönüştüren kod yazmanız gerekecektir. Bu, önceki derste ele aldığımız seri hale getirme işlemine benzer. Daha önce olduğu gibi, [Borsh](https://borsh.io/) ve `@coral-xyz/borsh` kullanacağız. Bunlardan herhangi biri hakkında tazeleme yapmanız gerekiyorsa, önceki derse bir göz atın.

:::info
Deserileştirme, önceden hesap düzeni bilgisi gerektirir. Kendi programlarınızı oluştururken, bunun nasıl yapılacağını o sürecin bir parçası olarak tanımlayacaksınız.
:::

Birçok program, hesap verilerini deserileştirmeye dair belgeler de sunar. Aksi takdirde, program kodu mevcutsa, kaynağa bakarak yapıyı belirleyebilirsiniz.

Onchain programdan verileri düzgün bir şekilde deserileştirmek için, hesabın nasıl saklandığını yansıtan bir istemci tarafı şeması oluşturmanız gerekecektir. Örneğin, aşağıdaki şema, onchain bir oyundaki bir oyuncuya dair meta verileri saklayan bir hesap için olabilir.

```typescript
import * as borsh from "@coral-xyz/borsh";

borshAccountSchema = borsh.struct([
  borsh.bool("initialized"),
  borsh.u16("playerId"),
  borsh.str("name"),
]);
```

Düzeninizi tanımladıktan sonra, şemaya `.decode(buffer)` çağrısını yapın.

```typescript
import * as borsh from "@coral-xyz/borsh";

borshAccountSchema = borsh.struct([
  borsh.bool("initialized"),
  borsh.u16("playerId"),
  borsh.str("name"),
]);

const { playerId, name } = borshAccountSchema.decode(buffer);
```

## Laboratuvar

Bu derste öğrendiklerimizi birlikte uygulamaya geçirelim ve geçen dersten Movie Review uygulaması üzerinde çalışmaya devam edelim. Eğer yalnızca bu derse yeni katıldıysanız endişelenmeyin - her iki şekilde de takip etmek mümkün olacaktır.

Hatırlatma olarak, bu proje, kullanıcıların film incelemeleri yapmalarına olanak tanıyan Devnet üzerinde dağıtılmış bir Solana programını kullanmaktadır. Geçen derste, kullanıcıların film incelemeleri göndermelerini sağlayan ön uç iskeletine işlevsellik ekledik ama inceleme listesi hala örnek veriler gösteriyor. Programın depolama hesaplarını alarak ve oradaki verileri deserileştirerek bunu düzeltelim.

![film inceleme ön ucu](../../../images/solana/public/assets/courses/movie-review-frontend-dapp.png)

#### 1. Başlangıç kodunu indirin

Son derste laboratuvarı tamamlamadıysanız veya hiçbir şeyi kaçırmadığınızdan emin olmak istiyorsanız, [başlangıç kodunu](https://github.com/solana-developers/movie-review-frontend/tree/solution-serialize-instruction-data) indirebilirsiniz.

Proje, oldukça basit bir Next.js uygulamasıdır. Cüzdanlar dersinde oluşturduğumuz `WalletContextProvider`, bir film incelemesini görüntülemek için bir `Card` bileşeni, incelemeleri bir listede görüntüleyen bir `MovieList` bileşeni, yeni bir inceleme göndermek için bir `Form` bileşeni ve `Movie` nesnesi için bir sınıf tanımına sahip `Movie.ts` dosyasını içerir.

`npm run dev` komutunu çalıştırdığınızda, sayfada görüntülenen incelemelerin örnek olduğunu unutmayın. Bunları gerçek verilerle değiştireceğiz.

#### 2. Tampon düzenini oluşturun

Unutmayın ki bir Solana programıyla düzgün bir şekilde etkileşim kurmak için verinin yapılandırmasının nasıl olduğunu bilmeniz gerekir. Hatırlatma:

![Film İnceleme Programını Gösteren Ed25519 Eğrisi](../../../images/solana/public/assets/courses/unboxed/movie-review-program.svg)

Programın çalıştırılabilir verileri bir program hesabında bulunmaktadır, ancak bireysel incelemeler PDA'larda saklanmaktadır. Her cüzdan için, her film başlığı için benzersiz bir PDA oluşturmak üzere `findProgramAddress()` kullanıyoruz. PDA'nın `data` alanında şu verileri saklayacağız:

1. Hesabın başlatılıp başlatılmadığını temsil eden bir boolean olarak `initialized`.
2. İncelemeyi yapan kişinin filme verdiği 5 üzerinden puanı temsil eden bir işaretsiz, 8-bit tam sayısı olarak `rating`.
3. İncelenen filmin başlığını temsil eden bir string olarak `title`.
4. İncelemeye ait yazılı kısmı temsil eden bir string olarak `description`.

`Movie` sınıfında film hesabı veri düzenini temsil etmek için bir `borsh` düzeni yapılandırmayı başlatalım. Öncelikle `@coral-xyz/borsh`'yi içe aktarın. Daha sonra, yukarıda listelenen özellikleri içeren uygun `borsh` yapısını ayarlayarak bir `borshAccountSchema` statik özelliği oluşturun.

```typescript
import * as borsh from '@coral-xyz/borsh'

export class Movie {
  title: string;
  rating: number;
  description: string;

  ...

  static borshAccountSchema = borsh.struct([
    borsh.bool('initialized'),
    borsh.u8('rating'),
    borsh.str('title'),
    borsh.str('description'),
  ])
}
```

Unutmayın, buradaki sıralama _önemlidir_. Hesap verilerinin nasıl yapılandırıldığıyla eşleşmelidir.

#### 3. Veriyi deserileştirmek için bir yöntem oluşturun

Şimdi tampon düzenimiz ayarlandığına göre, `Movie` içinde `deserialize` adlı, isteğe bağlı bir `Buffer` alacak ve bir `Movie` nesnesi veya `null` döndürecek bir statik yöntem oluşturalım.

```typescript
import * as borsh from '@coral-xyz/borsh'

export class Movie {
  title: string;
  rating: number;
  description: string;

  ...

  static borshAccountSchema = borsh.struct([
    borsh.bool('initialized'),
    borsh.u8('rating'),
    borsh.str('title'),
    borsh.str('description'),
  ])

  static deserialize(buffer?: Buffer): Movie|null {
    if (!buffer) {
      return null
    }

    try {
      const { title, rating, description } =
        this.borshAccountSchema.decode(buffer);
      return new Movie(title, rating, description);
    } catch (error) {
      console.error("Deserileştirme hatası:", error);
      console.error("Tampon uzunluğu:", buffer.length);
      console.error("Tampon verisi:", buffer.toString("hex"));
      return null;
    }
  }
}
```

Yöntem ilk olarak tamponun var olup olmadığını kontrol eder ve eğer yoksa `null` döner. Daha sonra, oluşturduğumuz düzeni kullanarak tamponu çözümler ve elde edilen verileri kullanarak bir `Movie` nesnesi oluşturur ve döner. Eğer çözümleme başarısız olursa, yöntem hatayı kaydeder ve `null` döner.

#### 4. Film inceleme hesaplarını al

Artık hesap verilerini deserileştirmek için bir yolumuz olduğuna göre, hesapları gerçekten almanız gerekiyor. `MovieList.tsx` dosyasını açın ve `@solana/web3.js`'yi içe aktarın. Ardından, `MovieList` bileşeninde yeni bir `Connection` oluşturun. Son olarak, `useEffect` içindeki `setMovies(Movie.mocks)` satırını `connection.getProgramAccounts` çağrısıyla değiştirin. Elde edilen diziyi alıp bir dizi filme dönüştürün ve `setMovies` çağrısını yapın.

```typescript
import { Card } from "./Card";
import { FC, useEffect, useState } from "react";
import { Movie } from "../models/Movie";
import { PublicKey } from "@solana/web3.js"
import { useConnection } from "@solana/wallet-adapter-react";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export const MovieList: FC = () => {
  const { connection } = useConnection();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchProgramAccounts = async () => {
      try {
        const accounts = await connection.getProgramAccounts(new PublicKey(MOVIE_REVIEW_PROGRAM_ID));

        const movies: Movie[] = accounts.map(({ account }) => Movie.deserialize(account.data));

        setMovies(movies);
      } catch (error) {
        console.error("Program hesaplarını alırken hata:", error);
      }
    };
    fetchProgramAccounts();
  }, [connection]);


  return (
    <div>
      {movies.map((movie, i) => (
        <Card key={i} movie={movie} />
      ))}
    </div>
  );
};
```

Bu noktada, uygulamayı çalıştırarak programdan alınan film incelemeleri listesini görmelisiniz!

Gönderilen inceleme sayısına bağlı olarak, bu yükleme uzun sürebilir veya tarayıcınızı tamamen dondurabilir. Ancak endişelenmeyin — bir sonraki derste, yükleyeceğiniz verilerle daha hassas olabilmeniz için hesapları sayfalama ve filtrelemeyi öğreneceğiz.

:::warning
Bu projeyle bu kavramlara aşina olmaya daha fazla zaman ihtiyacınız varsa, devam etmeden önce [çözüm koduna](https://github.com/solana-developers/movie-review-frontend/tree/solutions-deserialize-account-data) göz atabilirsiniz.
:::

## Meydan Okuma

Artık bağımsız bir şeyler oluşturma sırası sizde. Geçen derste, yeni bir tanıtım göndermek için talimat verisini seri hale getirmeye yönelik Student Intros uygulaması üzerinde çalıştınız. Artık programın hesap verilerini almak ve deserileştirmek zamanı. Bunu destekleyen Solana programı şu adrestedir: `HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf`.

![Öğrenci Tanıtımları ön ucu](../../../images/solana/public/assets/courses/student-intros-frontend.png)

1. Bunu sıfırdan oluşturabilir veya [başlangıç kodunu indirebilirsiniz](https://github.com/solana-developers/solana-student-intro-frontend/tree/solution-serialize-instruction-data).
2. `StudentIntro.ts` dosyasında hesap tampon düzenini oluşturun. Hesap verileri şunları içerir:
   1. Çalıştırılacak talimatı (1 olmalıdır) temsil eden işaretsiz, 8-bit tamsayı olarak `initialized`.
   2. Öğrencinin adını temsil eden bir string olarak `name`.
   3. Öğrencinin Solana yolculuğu hakkında paylaştığı mesajı temsil eden bir string olarak `message`.
3. `StudentIntro.ts` dosyasında, hesap verileri tamponunu bir `StudentIntro` nesnesine deserileştirmek için tampon düzenini kullanacak bir statik yöntem oluşturun.
4. `StudentIntroList` bileşeninin `useEffect`'inde, programın hesaplarını alın ve verilerini `StudentIntro` nesneleri listesine deserileştirin.
5. Artık örnek veriler yerine ağdan öğrenci tanıtımlarını görmelisiniz!

Gerçekten zorlanıyorsanız, [çözüm koduna](https://github.com/solana-developers/solana-student-intro-frontend/tree/solution-deserialize-account-data) göz atmaktan çekinmeyin.

Her zaman olduğu gibi, bu meydan okumalarla yaratıcılığınızı kullanın ve talimatların ötesine geçin istiyorsanız!


Kodunuzu GitHub'a yükleyin ve
[bize bu dersten ne düşündüğünüzü bildirin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=9cb89e09-2c97-4185-93b0-c89f7aca7677)!
