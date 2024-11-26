---
title: Sayfa, Sipariş ve Filtre Program Verisi
objectives:
  - Sayfa, sipariş ve filtre hesapları
  - Verisi olmayan hesapları önceden al
  - Hesabın tampon düzeninde belirli verilerin nerede depolandığını belirle
  - Hesapları sıralamak için kullanılabilecek bir alt küme verisi ile hesapları önceden al
  - Belirli kriterlere uyan verisi olan hesapları al
  - getMultipleAccounts kullanarak toplam hesapların bir alt kümesini al
description: "Solana'dan hesap verilerini etkili bir şekilde nasıl sorgulayacağınızı öğrenin."
---

## Özet

- Bu ders, deseralize hesap verileri dersinde kullandığımız RPC çağlarının bazı işlevlerine dalıyor.
- Hesapların veri olmadan büyük bir kısmını almak için, sadece bir dizi açık anahtar döndürmek üzere filtreleyerek büyük miktarda hesap alabilirsiniz.
- Filtrelenmiş bir açık anahtar listesine sahip olduğunuzda, bunları sıralayıp ait olduğu hesap verilerini alabilirsiniz.

---

## Ders

:::info 
Son derste, hesap verilerinizi çekip görüntüleyebildiğimiz halde, ne kadar hesap çekeceğimiz ya da bunların sırası üzerinde çok fazla kontrol sahibi olmadığımızı fark etmiş olabilirsiniz. 
:::

Bu ders ile `getProgramAccounts` fonksiyonuna yönelik bazı yapılandırma seçeneklerini öğreneceğiz, bu sayede sayfalama, hesap sıralama ve filtreleme gibi işlemler gerçekleştirebileceğiz.

### Sadece gerekli verileri almak için `dataSlice` kullanın

Geçmiş derslerde çalıştığımız Film İnceleme uygulamasının dört milyon film incelemesi olduğunu ve ortalama incelemenin 500 bayt olduğunu düşünün. Bu durumda, tüm inceleme hesapları için toplam indirme boyutu 2GB'ın üzerinde olurdu. Bu, ön yüzünüzün her sayfa yenilendiğinde indirmesini istemeyeceğiniz bir şeydir.

Şans eseri, tüm hesapları almak için kullandığınız `getProgramAccounts` fonksiyonu bir yapılandırma nesnesini argüman olarak alır. Yapılandırma seçeneklerinden biri olan `dataSlice`, iki şeyi sağlamanıza olanak tanır:

- `offset` - veri tamponunun başlangıcından dilimleme işlemini başlatacağınız konum
- `length` - belirtilen ofsetten başlayarak dönecek bayt sayısı

Yapılandırma nesnesine bir `dataSlice` dahil ettiğinizde, fonksiyon sadece belirttiğiniz veri tamponunun alt kümesini döndürecektir.

#### Hesapları Sayfalama

Bu durumun yararlı olduğu alanlardan biri, sayfalamadır. Eğer tüm hesapları gösteren bir liste istiyorsanız ancak o kadar çok hesap varsa ki hepsinin verisini aynı anda almak istemiyorsanız, hesapların tümünü alabilir ama verilerini almak için `{ offset: 0, length: 0 }` şeklinde bir `dataSlice` kullanarak verisini almayabilirsiniz. Sonrasında, sonucu ihtiyaç duyulduğunda veri alacağınız hesap anahtarlarının bir listesine eşleyebilirsiniz.

```tsx
const accountsWithoutData = await connection.getProgramAccounts(programId, {
  dataSlice: { offset: 0, length: 0 },
});

const accountKeys = accountsWithoutData.map(account => account.pubkey);
```

Bu anahtarlar listesi ile birlikte, `getMultipleAccountsInfo` yöntemi kullanarak hesap verilerini "sayfalar" halinde alabilirsiniz:

```tsx
const paginatedKeys = accountKeys.slice(0, 10);
const accountInfos = await connection.getMultipleAccountsInfo(paginatedKeys);
const deserializedObjects = accountInfos.map(accountInfo => {
  // accountInfo.data'yı deseralize etmek için mantığı buraya koyun
});
```

#### Hesapları Sıralama

`dataSlice` seçeneği, sayfalama sırasında bir hesap listesini sıralamak istediğinizde de yardımcı olur. Hala tüm verileri bir kerede almak istemiyorsunuz, ancak tüm anahtarlara ve bunları önceden sıralamak için bir yola ihtiyacınız var. Bu durumda, hesap verilerinin düzenini anlamalı ve veri dilimini sadece sıralamada kullanmak üzere ihtiyaç duyduğunuz verilerle sınırlı hale getirmelisiniz.

Örneğin, aşağıdaki gibi iletişim bilgilerini saklayan bir hesaba sahip olabilirsiniz:

- `initialized` bir boolean olarak
- `phoneNumber` bir unsigned, 64-bit tam sayı olarak
- `firstName` bir string olarak
- `secondName` bir string olarak

Eğer tüm hesap anahtarlarını kullanıcının ilk adına göre alfabetik olarak sıralamak istiyorsanız, ismin başladığı ofseti bulmalısınız. İlk alan, `initialized`, ilk baytı alır, ardından `phoneNumber` başka 8 bayt alır, bu nedenle `firstName` alanı `1 + 8 = 9` ofsetinde başlar. Ancak, borsh'deki dinamik veri alanları, verilerin uzunluğunu kaydetmek için ilk 4 baytı kullanır, bu yüzden 4 bayt daha atlayarak ofseti 13 yaparız.

Veri dilimini oluşturacak uzunluğu belirlemeniz gerekecek. Uzunluk değişken olduğu için veriyi çekmeden önce kesin olarak bilemeyiz. Ancak, çoğu durumu kapsayacak kadar büyük ve alınması çok sıkıntı yaratmayacak kadar kısa bir uzunluk seçebilirsiniz. 15 bayt, çoğu ilk isim için yeterlidir, ancak bir milyon kullanıcı ile bile küçük bir indirme sağlar.

Veri dilimi ile birlikte hesapları aldıktan sonra, diziyi sıralamak için `sort` yöntemini kullanabilirsiniz.

```tsx
// getProgramAccounts() tarafından döndürülen hesap türü
type ProgramAccount = {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
};

// Bir dize uzunluğunun mevcut uzunluğunu depolamak için 4 bayt kullanılır
const STRING_LENGTH_SPACE = 4;

// Hesap yapısına ilişkin bazı meta veriler için 9 bayt ayrılmıştır.
const ACCOUNT_METADATA_SPACE = 9;

// Gerçek verinin başladığı ofset.
const DATA_OFFSET = STRING_LENGTH_SPACE + ACCOUNT_METADATA_SPACE;

// Elde etmemiz gereken verinin uzunluğu (burada 15 bayt, ilgili veri diliminin beklenen boyutuna dayanarak).
const DATA_LENGTH = 15;

// salt okunur hesap yanıtını al
const readOnlyAccounts = await connection.getProgramAccounts(programId, {
  dataSlice: { offset: DATA_OFFSET, length: DATA_LENGTH },
});

// Salt okunur dizinin bir kopyasını yap
const accounts: Array<ProgramAccount> = Array.from(readonlyAccounts);

accounts.sort((a, b) => {
  try {
    // Sınırsız erişimi önlemek için tamponların yeterince uzun olup olmadığını kontrol edin
    const lengthA = a.account.data.readUInt32LE(0);
    const lengthB = b.account.data.readUInt32LE(0);

    if (
      a.account.data.length < STRING_LENGTH_SPACE + lengthA ||
      b.account.data.length < STRING_LENGTH_SPACE + lengthB
    ) {
      throw new Error("Tampon uzunluğu yetersiz");
    }

    const dataA = a.account.data.subarray(
      STRING_LENGTH_SPACE,
      STRING_LENGTH_SPACE + lengthA,
    );
    const dataB = b.account.data.subarray(
      STRING_LENGTH_SPACE,
      STRING_LENGTH_SPACE + lengthB,
    );

    return dataA.compare(dataB);
  } catch (error) {
    console.error("Hesapları sıralarken hata: ", error);
    return 0; // Hata durumunda varsayılan sıralama
  }
});

const accountKeys = accounts.map(account => account.pubkey);
```

Yukarıdaki örnekte, verileri doğrudan karşılaştırmadığımıza dikkat edin. Bu, dinamik boyutlu türler için Borsh'in, verilerin o alanı temsil eden boyutunu belirtmek için başlangıçta bir unsigned, 32-bit (4 bayt) tam sayı kullandığı içindir. Dolayısıyla, ilk isimleri doğrudan karşılaştırmak için, her biri için uzunluğu almalı ve ardından 4 bayt ofset ve doğru uzunlukla bir veri dilimi oluşturmamız gerekiyor.

### Sadece belirli hesapları almak için `filters` kullanın

Hesap başına alınan verileri sınırlamak harikadır, ancak eğer sadece belirli bir kritere uyan hesapları döndürmek istiyorsanız ne yapabilirsiniz? İşte burada `filters` yapılandırma seçeneği devreye giriyor. Bu seçenek, aşağıdaki ile eşleşen nesneleri içerebilen bir dizidir:

- `memcmp` - sağlanan bir dizi baytı, program hesabı verileri ile belirli bir ofsetten karşılaştırır. Alanlar:
  - `offset` - veri karşılaştırmadan önce program hesabı verilerinde ofsetin kaç bayt atlanacağını belirleme
  - `bytes` - eşleşecek veriyi temsil eden base-58 kodlu bir dizi; 129 bayttan az olmalıdır
- `dataSize` - program hesabı veri uzunluğunu sağlanan veri boyutu ile karşılaştırır

Bunlar, eşleşen verilere ve/veya toplam veri boyutuna göre filtreleme yapmanıza olanak tanır.

Örneğin, bir `memcmp` filtresi ekleyerek bir iletişim listesinde arama yapabilirsiniz:

```tsx
type ProgramAccount = {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
};

const DATA_OFFSET = 2; // Hesabın veri şemasının sürüm bilgisini depolayan ilk 2 baytı atla. Bu sürümleme, hesabın yapısındaki değişikliklerin takip edilip yönetilmesini sağlar.
const DATA_LENGTH = 18; // Karşılaştırma için kullanıcının açık anahtarını depolayan hesabın verilerinin bir kısmını içeren 18 bayt veri alın.

async function fetchMatchingContactAccounts(
  connection: Connection,
  search: string,
): Promise<Array<AccountInfo<Buffer> | null>> {
  let filters: Array<{ memcmp: { offset: number; bytes: string } }> = [];

  if (search.length > 0) {
    filters = [
      {
        memcmp: {
          offset: DATA_OFFSET,
          bytes: bs58.encode(Buffer.from(search)), // Arama dizisini Base58'ye dönüştürerek zincirdeki verilerle karşılaştırma yap.
        },
      },
    ];
  }

  // Salt okunur hesap yanıtını al
  const readonlyAccounts = await connection.getProgramAccounts(
    new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    {
      dataSlice: { offset: DATA_OFFSET, length: DATA_LENGTH }, // Aramaya uygun veri bölümünü almak için.
      filters,
    },
  );

  // Salt okunur dizinin bir kopyasını yap
  const accounts: Array<ProgramAccount> = Array.from(readonlyAccounts);

  return accounts.map(account => account.account); // Hesap verilerini döndür.
}
```

Yukarıdaki örnekte dikkate alınması gereken iki şey:

1. Ofseti 13 olarak ayarlıyoruz çünkü daha önce `firstName` için veri düzenindeki ofseti 9 olarak bulmuştuk ve ek olarak dizenin uzunluğunu gösteren ilk 4 baytı atlamak istiyoruz.
2. Arama terimi üzerinde base-58 kodlama yapmak için üçüncü taraf bir kütüphane `bs58` kullanıyoruz. Bunu `npm install bs58` kullanarak yükleyebilirsiniz.

## Laboratuvar

Geçtiğimiz iki derste üzerinde çalıştığımız Film İnceleme uygulamasını hatırlıyor musunuz? İnceleme listesini sayfalamak, incelemeleri düzensiz olmaktan çıkarmak ve temel bir arama işlevselliği eklemek için biraz kurgulayacağız. Önceki derslere göz atmayı atladıysanız endişelenmeyin - gerekli bilgiye sahipseniz, bu laboratuvarı önceki projede çalışmadan takip edebilirsiniz.

![film inceleme ön yüzü](../../../images/solana/public/assets/courses/movie-review-frontend-dapp.png)

#### **1. Başlangıç kodunu indirin**

:::tip 
Son derste laboratuvarı tamamlamadıysanız veya bir şeyleri kaçırmadığınızdan emin olmak istiyorsanız, [başlangıç kodunu](https://github.com/solana-developers/movie-review-frontend/tree/solutions-deserialize-account-data) indirebilirsiniz.
:::

Proje oldukça basit bir Next.js uygulamasıdır. Hesaplar dersiyle oluşturduğumuz `WalletContextProvider`, bir film incelemesini görüntülemek için bir `Card` bileşeni, incelemeleri bir listede görüntülemek için bir `MovieList` bileşeni, yeni bir inceleme göndermek için bir `Form` bileşeni, ve bir `Movie.ts` dosyası içerir; bu dosya bir `Movie` nesnesinin sınıf tanımını içerir.

#### 2. İncelemelere sayfalama ekleyin

Öncelikle, hesap verilerini almak için kodu kapsayacak bir alan oluşturalım. Yeni bir `MovieCoordinator.ts` dosyası oluşturun ve bir `MovieCoordinator` sınıfı tanımlayın. Ardından, `MOVIE_REVIEW_PROGRAM_ID` sabitini `MovieList`'ten bu yeni dosyaya taşıyalım.

```tsx
const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export class MovieCoordinator {}
```

Artık `MovieCoordinator`'i kullanarak bir sayfalama uygulaması oluşturabiliriz. Bir not; bu, Solana hesaplarıyla etkileşimin karmaşık tarafına odaklanabilmek amacıyla mümkün olduğunca basit bir sayfalama uygulaması olacaktır. Üretim uygulaması için daha iyisini yapabilirsiniz ve yapmalısınız.

Bu bilgilerden sonra, `web3.PublicKey[]` türünde bir statik `accounts` özelliği, bir statik `prefetchAccounts(connection: web3.Connection)` fonksiyonu ve bir statik `fetchPage(connection: web3.Connection, page: number, perPage: number): Promise>` fonksiyonu oluşturun. Ayrıca `@solana/web3.js` ve `Movie`'yi içe aktarmanız gerekecek.

```tsx
import { Connection, PublicKey, AccountInfo } from "@solana/web3.js";
import { Movie } from "../models/Movie";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export class MovieCoordinator {
  static accounts: PublicKey[] = [];

  static async prefetchAccounts(connection: Connection) {}

  static async fetchPage(
    connection: Connection,
    page: number,
    perPage: number,
  ): Promise<Array<Movie>> {}
}
```

Sayfalamanın anahtarı, tüm hesapları verisiz önceden almaktır. `prefetchAccounts` fonksiyonun gövdesini bunun için dolduralım ve alınan açık anahtarları statik `accounts` özelliğine atalım.

```tsx
static async prefetchAccounts(connection: Connection) {
  try {
    const accounts = await connection.getProgramAccounts(
      new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        dataSlice: { offset: 0, length: 0 },
      }
    );

    this.accounts = accounts.map((account) => account.pubkey);
  } catch (error) {
    console.error("Hesapları önceden alırken hata:", error);
  }
}
```

Şimdi `fetchPage` yöntemini dolduralım. Öncelikle, henüz hesaplar önceden alınmadıysa bunu yapmamız gerekecek. Ardından, istenen sayfaya karşılık gelen hesap açık anahtarlarını alabilir ve `connection.getMultipleAccountsInfo`'u çağırabiliriz. Son olarak, hesap verilerini deseralize edip karşılık gelen `Movie` nesnelerini döndürürüz.

```tsx
static async fetchPage(
  connection: Connection,
  page: number,
  perPage: number,
  reload = false
): Promise<Array<Movie>> {
  if (this.accounts.length === 0 || reload) {
    await this.prefetchAccounts(connection);
  }

  const paginatedPublicKeys = this.accounts.slice(
    (page - 1) * perPage,
    page * perPage
  );

    if (!paginatedPublicKeys.length) {
      return [];
    }

    const accounts = await connection.getMultipleAccountsInfo(
      paginatedPublicKeys
    );

    const movies = accounts.reduce((accumulator: <Array<Movie>>, account) => {
      try {
        const movie = Movie.deserialize(account?.data);
        if (movie) {
          accumulator.push(movie);
        }
      } catch (error) {
        console.error("Film verilerini deseralize ederken hata: ", error);
      }
      return accumulator;
    }, []);

    return movies;
  }
```

Bunu tamamladıktan sonra, `MovieList`'i bu yöntemleri kullanacak şekilde yeniden yapılandırabiliriz. `MovieList.tsx` dosyasına `const [page, setPage] = useState(1)` ekleyin; ardından, `useEffect`'i `MovieCoordinator.fetchPage`'i çağıracak şekilde güncelleyin.

```tsx
const connection = new Connection(clusterApiUrl("devnet"));
const [movies, setMovies] = useState<Array<Movie>>([]);
const [page, setPage] = useState(1);

useEffect(() => {
  const fetchMovies = async () => {
    try {
      const movies = await MovieCoordinator.fetchPage(connection, page, 10);
      setMovies(movies);
    } catch (error) {
      console.error("Filmleri alırken başarısız: ", error);
    }
  };

  fetchMovies();
}, [page, connection]);
```

Son olarak, farklı sayfalara geçiş yapmak için listenin altına butonlar eklememiz gerekiyor:

```tsx
return (
  <div className="py-5 flex flex-col w-fullitems-center justify-center">
    {movies.map((movie, i) => (
      <Card key={i} movie={movie} />
    ))}

    <div className="flex justify-between mt-4">
      {page > 1 && (
        <button
          onClick={() => setPage(page - 1)}
          className="px-6 py-2 bg-gray-300 text-black font-semibold rounded"
        >
          Önceki
        </button>
      )}
      {movies.length === 5 && (
        <button
          onClick={() => setPage(page + 1)}
          className="px-6 py-2 bg-gray-300 text-black font-semibold rounded"
        >
          Sonraki
        </button>
      )}
    </div>
  </div>
);
```

Bu noktada, projeyi çalıştırıp sayfalar arasında tıklayabilmeniz gerekir!

#### 3. İncelemeleri başlığa göre alfabetik olarak sıralayın

İncelemelere baktığınızda belirli bir sırada olmadıklarını görebilirsiniz. Bunu, veri dilimimize yeterince veriyi geri ekleyerek düzeltebiliriz, böylece bazı sıralama işlemleri gerçekleştirebiliriz. Film inceleme veri tamponundaki çeşitli özellikler aşağıdaki gibi yer alır

- `initialized` - unsigned 8-bit tam sayı; 1 bayt
- `rating` - unsigned 8-bit tam sayı; 1 bayt
- `title` - dize; bilinmeyen bayt sayısı
- `description` - dize; bilinmeyen bayt sayısı

Buna dayanarak, `title`'a erişmek için veri diliminde sağlamamız gereken ofset 2'dir. Ancak uzunluk belirlenemez, bu yüzden makul bir uzunluk sağlayabiliriz. Her durumda çok fazla veri çekmemek için uzunluğu 18 olarak belirlemeyi tercih edeceğim.

`getProgramAccounts`'ta veri dilimini değiştirdikten sonra, döndürülen diziyi aslında sıralamamız gerekecektir. Bunu yapmak için, `title`'a karşılık gelen veri tamponunun bir kısmını karşılaştırmalıyız. Borsh'deki dinamik bir alanın ilk 4 baytı, alanın byte cinsinden uzunluğunu depolamak için kullanılır. Bu nedenle, yukarıda tartıştığımız şekilde dilimlenmiş herhangi bir `data` tamponunda, dize kısmı `data.slice(4, 4 + data[0])` şeklindedir.

Artık bunu düşündüğümüze göre, `MovieCoordinator` içindeki `prefetchAccounts` fonksiyonunun uygulanışını değiştirelim:

```tsx
// getProgramAccounts() tarafından döndürülen hesap türü
type ProgramAccount = {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
};

const DATA_OFFSET = 2; // Hesabın veri yapısının sürüm bilgisini depolayan ilk 2 baytı atla. Bu sürümleme, hesabın yapısındaki değişikliklerin takip edilip yönetilmesini sağlar.
const DATA_LENGTH = 18; // Kullanıcının açık anahtarını karşılaştırmak için hesabın verilerinin bir kısmını içeren 18 bayt veriyi alın.
// Her bir hesap tamponundaki başlığın boyutunu tanımlayın
const HEADER_SIZE = 4; // Uzunluk başlığı için 4 bayt

static async prefetchAccounts(connection: Connection) {
  // Salt okunur hesap yanıtını al
  const readonlyAccounts = (await connection.getProgramAccounts(
    new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    {
      dataSlice:{ offset: DATA_OFFSET, length: DATA_LENGTH },
    }
  ))

  const accounts: Array<ProgramAccount> = Array.from(readonlyAccounts);   // Salt okunur dizinin bir kopyasını yap

  accounts.sort((a, b) => {
    try {
      // Sınırsız erişimi önlemek için tamponların yeterince uzun olup olmadığını kontrol edin
      const lengthA = a.account.data.readUInt32LE(0); // Uzunluğu depolamak için ilk 4 baytı okuyun
      const lengthB = b.account.data.readUInt32LE(0);

      if (
        a.account.data.length < HEADER_SIZE + lengthA ||
        b.account.data.length < HEADER_SIZE + lengthB
      ) {
        throw new Error('Tampon uzunluğu yetersiz');
      }

      const dataA = a.account.data.subarray(HEADER_SIZE, HEADER_SIZE + lengthA);
      const dataB = b.account.data.subarray(HEADER_SIZE, HEADER_SIZE + lengthB);

      return dataA.compare(dataB);
    } catch (error) {
      console.error('Hesapları sıralarken hata: ', error);
      return 0; // Hata durumunda varsayılan sıralama
    }
  });

    this.accounts = accounts.map(account => account.pubkey)

    } catch (error) {
    console.error("Hesapları önceden alırken hata:", error);
  }
}
```

Ve işte bu kadar, uygulamayı çalıştırıp film incelemeleri listesini alfabetik olarak görebilmelisiniz.

#### 4. Arama Ekle

Bu uygulamayı geliştirmek için son yapacağımız şey bazı temel arama özelliklerini eklemektir. `prefetchAccounts` fonksiyonuna bir `search` parametresi ekleyelim ve fonksiyonun gövdesini bunu kullanacak şekilde yeniden yapılandıralım.

Belirli verilerle hesapları filtrelemek için `getProgramAccounts`'ın `config` parametresinin `filters` özelliğini kullanabiliriz. `title` alanlarına olan offset 2'dir, ancak ilk 4 bayt başlığın uzunluğunu gösterdiği için dizeye olan gerçek offset 6'dır. Baytların base 58 ile kodlanması gerektiğini unutmayın, bu yüzden `bs58` kütüphanesini kurup içe aktaralım.

```tsx
import bs58 from 'bs58'

...

static async prefetchAccounts(connection: Connection, search: string) {
  const readonlyAccounts = (await connection.getProgramAccounts(
      new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        dataSlice: { offset: DATA_OFFSET, length: DATA_LENGTH },
        filters:
          search === ""

            ? []            : [
                {
                  memcmp: {
                    offset: 6,
                    bytes: bs58.encode(Buffer.from(search)),
                  },
                },
              ],
      }
  ));

  const accounts: Array<ProgramAccount> = Array.from(readonlyAccounts);  // Salt okunur dizinin değiştirilebilir bir kopyasını yap

  accounts.sort((a, b) => {
      try {
        const lengthA = a.account.data.readUInt32LE(0);
        const lengthB = b.account.data.readUInt32LE(0);

      if (
        a.account.data.length < HEADER_SIZE + lengthA ||
        b.account.data.length < HEADER_SIZE + lengthB
      ) {
        throw new Error('Buffer uzunluğu yetersiz');
      }

      const dataA = a.account.data.subarray(HEADER_SIZE, HEADER_SIZE + lengthA);
      const dataB = b.account.data.subarray(HEADER_SIZE, HEADER_SIZE + lengthB);

        return dataA.compare(dataB);
      } catch (error) {
        console.error("Hesapları sıralarken hata: ", error);
        return 0;
      }
    });

    this.accounts = accounts.map((account) => account.pubkey);
}
```

:::tip
`prefetchAccounts` fonksiyonunu geliştirmek için `filters` özelliğini dikkatle ayarlamalısınız.
:::

Şimdi `fetchPage` fonksiyonuna bir `search` parametresi ekleyelim ve `prefetchAccounts` çağrısını güncelleyerek bu parametreyi iletelim. Ayrıca `fetchPage` fonksiyonuna `reload` boolean parametresi eklememiz gerekecek, böylece arama değeri değiştiğinde hesap ön yüklemesini zorlayabiliriz.

```tsx
static async fetchPage(
  connection: Connection,
  page: number,
  perPage: number,
  search: string,
  reload = false
): Promise<Array<Movie>> {
  if (this.accounts.length === 0 || reload) {
    await this.prefetchAccounts(connection, search);
  }

  const paginatedPublicKeys = this.accounts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  if (paginatedPublicKeys.length === 0) {
    return [];
  }

  const accounts = await connection.getMultipleAccountsInfo(
    paginatedPublicKeys
  );

  const movies = accounts.reduce((accumulator: <Array<Movie>>, account) => {
    try {
      const movie = Movie.deserialize(account?.data);
      if (movie) {
        accumulator.push(movie);
      }
    } catch (error) {
        console.error('Film verilerini ayrıştırırken hata: ', error);
      }
    return accumulator;
  }, []);

  return movies;
}
```

:::warning
`fetchPage` fonksiyonunda `reload` parametresinin doğru kullanımı, arama sonuçlarının güncel kalmasını sağlar.
:::

Bunu yaptığımızda, `MovieList` içindeki kodu düzgün bir şekilde çağırmak için güncelleyelim.

Öncelikle, diğer `useState` çağrılarının yanına `const [search, setSearch] = useState('')` ekleyelim. Ardından, `useEffect` içindeki `MovieCoordinator.fetchPage` çağrısını `search` parametresini iletecek ve `search !== ''` olduğunda yeniden yükleyecek şekilde güncelleyelim.

```tsx
const connection = new Connection(clusterApiUrl("devnet"));
const [movies, setMovies] = useState<Array<Movie>>([]);
const [page, setPage] = useState(1);
const [search, setSearch] = useState("");

useEffect(() => {
  const fetchMovies = async () => {
    try {
      const movies = await MovieCoordinator.fetchPage(
        connection,
        page,
        5,
        search,
        search !== "",
      );
      setMovies(movies);
    } catch (error) {
      console.error("Filmleri getirmekte hata:", error);
    }
  };

  fetchMovies();
}, [connection, page, search]);
```

:::note
`useEffect` kullanımınız, bileşen durumları değiştiğinde arama sonuçlarını güncellemeye yardımcı olur.
:::

Son olarak, `search` değerini ayarlayacak bir arama çubuğu ekleyelim:

```tsx
return (
  <div className="py-5 flex flex-col w-full items-center justify-center">
    <input
      id="search"
      className="w-[300px] p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-400"
      onChange={e => setSearch(e.target.value)}
      placeholder="Ara"
    />
    ...
  </div>
);
```

Ve hepsi bu kadar! Uygulama artık sıralı incelemelere, sayfalara ve arama özelliklerine sahip.

:::info
Bu oldukça yoğun bir bilgiydi, ama üstesinden geldiniz. Eğer kavramları sindirmek için biraz daha zaman harcamanız gerekiyorsa, zorlandığınız bölümleri tekrar okuyabilir ve/veya [çözüm koduna](https://github.com/solana-developers/movie-review-frontend/tree/solutions-paging-account-data) göz atabilirsiniz.
:::

## Mücadele

Şimdi bu konuda kendi başınıza deneme yapma zamanı. Geçen dersten Student Intros uygulamasını kullanarak, sayfalama, isimlere göre alfabetik sıralama ve isimle arama ekleyin.

![Student Intros frontend](../../../images/solana/public/assets/courses/student-intros-frontend.png)

1. Bunu sıfırdan inşa edebilir veya [başlangıç kodunu](https://github.com/solana-developers/solana-student-intro-frontend/tree/solution-deserialize-account-data) indirebilirsiniz.
2. Projeye hesapları veri olmadan ön yükleyerek sayfalama ekleyin, sadece gerektiğinde her hesap için hesap verilerini getirin.
3. Uygulamada görüntülenen hesapları isimlerine göre alfabetik olarak sıralayın.
4. Bir öğrencinin adıyla tanıtımları arama yeteneği ekleyin.

:::danger
Bu zorlu bir görev. Takıldığınızda, [çözüm koduna](https://github.com/solana-developers/solana-student-intro-frontend/tree/solution-paging-account-data) başvurabilirsiniz.
:::

Her zaman olduğu gibi, bu zorluklarla yaratıcı olun ve isterseniz talimatların ötesine geçin!


Kodu GitHub'a gönderin ve
[bize bu ders hakkında ne düşündüğünüzü anlatın](https://form.typeform.com/to/IPH0UGz7#answers-lesson=9342ad0a-1741-41a5-9f68-662642c8ec93)!
