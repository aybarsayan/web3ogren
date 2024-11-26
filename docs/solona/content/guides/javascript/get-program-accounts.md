---
date: 2023-04-22T00:00:00Z
title: TypeScript ile Tüm Program Hesaplarını Al
description:
  "Bir program tarafından sahip olunan tüm hesapları döndüren GetProgramAccounts RPC yöntemi hakkında daha fazla bilgi edinin."
keywords:
  - rpc
  - getProgramAccounts
difficulty: intermediate
tags:
  - getProgramAccounts
  - rpc
  - web3.js
altRoutes:
  - /developers/guides/get-program-accounts
---

Bir program tarafından sahip olunan tüm hesapları döndüren bir RPC yöntemi. Şu anda sayfalama desteklenmemektedir. 
`getProgramAccounts` talepleri, yanıt süresini iyileştirmek ve yalnızca istenen sonuçları döndürmek için `dataSlice` ve/veya `filters` parametrelerini içermelidir.

## getProgramAccounts RPC Yöntemi

`getProgramAccounts` RPC yönteminin aşağıdaki sözdizimi vardır:

- `programId`: `string` - Sorgulamak için programın pubkey'i, base58 kodlu dize olarak sağlanır
- (isteğe bağlı) `configOrCommitment`: `object` - Aşağıdaki isteğe bağlı alanları içeren yapılandırma parametreleri:
  - (isteğe bağlı) `commitment`: `string` -
    `Durum taahhüdü`
  - (isteğe bağlı) `encoding`: `string` - Hesap verileri için kodlama, ya:
    `base58`, `base64` veya `jsonParsed`. Not: web3js kullanıcıları bunun yerine
    [`getParsedProgramAccounts`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getParsedProgramAccounts) kullanmalıdır
  - (isteğe bağlı) `dataSlice`: `object` - Döndürülen hesap verilerini sınırlamak için:
    - `offset`: `number` - Hesap verilerine geri dönmeye başlamak için bayt sayısı
    - `length`: `number` - Döndürülecek hesap veri baytı sayısı
  - (isteğe bağlı) `filters`: `array` - Aşağıdaki filtre nesnelerini kullanarak sonuçları filtreleyin:
    - `memcmp`: `object` - Hesap verileri ile bir dizi baytı eşleştirin:
      - `offset`: `number` - Hesap verilerine karşılaştırmaya başlamak için bayt sayısı
      - `bytes`: `string` - Eşleşmesi gereken veri, base58 kodlu dize olarak 129 bayt ile sınırlıdır
    - `dataSize`: `number` - Hesap verileri uzunluğunu sağlanan veri boyutuyla karşılaştırır
  - (isteğe bağlı) `withContext`: `boolean` - Sonucu bir
    `RpcResponse JSON nesnesi` ile sarmalayın

### Yanıt

Varsayılan olarak `getProgramAccounts`, aşağıdaki yapıya sahip JSON nesneleri dizisini döndürecektir:

- `pubkey`: `string` - Hesapın pubkey'i, base58 kodlu dize olarak
- `account`: `object` - Aşağıdaki alt alanlarla bir JSON nesnesi:
  - `lamports`: `number`, Hesaba atanan lamport sayısı
  - `owner`: `string`, Hesabın atandığı programın base58 kodlu pubkey'i
  - `data`: `string` | `object` - Hesap ile ilişkili veri, sağlanan kodlama parametresine bağlı olarak ya kodlanmış ikili veri ya da JSON formatında
  - `executable`: `boolean`, Hesabın bir program içerip içermediği bilgisini gösterir
  - `rentEpoch`: `number`, Bu hesabın bir sonraki kira borcunu ödeyeceği dönem

## Derinlemesine İnceleme

`getProgramAccounts`, bir program tarafından sahip olunan tüm hesapları döndüren çok yönlü bir RPC metodudur. `getProgramAccounts`'ı birçok yararlı sorgular için kullanabiliriz, örneğin:

- Belirli bir cüzdan için tüm token hesapları
- Belirli bir minta ait tüm token hesapları (yani tüm [JUP](https://www.jup.ag) sahipleri)
- Belirli bir program için tüm özel hesaplar (yani tüm [Mango](https://mango.markets/) kullanıcıları)

:::tip
Yararlı olmasına rağmen, `getProgramAccounts` mevcut kısıtlamaları nedeniyle sıkça yanlış anlaşılmaktadır. 
:::

`getProgramAccounts` tarafından desteklenen birçok sorgunun büyük veri setlerini taramak için RPC düğümlerine ihtiyaç duymasıdır. Bu tarama işlemleri hem bellek hem de kaynak açısından yoğun olacaktır. 

:::warning
Sonuç olarak, fazla sık veya çok geniş kapsamlı çağrılar bağlantı zaman aşımına neden olabilir.
Dahası, bu yazının yazıldığı sırada `getProgramAccounts` son noktası sayfalama desteklememektedir. 
Bir sorgunun sonuçları çok büyükse yanıt kesilecektir.
:::

Bu mevcut kısıtlamaların üstesinden gelmek için `getProgramAccounts`, `dataSlice` ve `filters` seçenekleri olan `memcmp` ve `dataSize` gibi birkaç yararlı parametre sunmaktadır. Bu parametrelerin kombinasyonlarını sağlayarak sorgularımızın kapsamını yönetilebilir ve öngörülebilir boyutlara düşürebiliriz.

`getProgramAccounts`'ın yaygın bir örneği, 
[SPL-Token Programı](https://spl.solana.com/token) ile etkileşimde bulunmayı içerir. Token Programı tarafından sahip olunan tüm hesapları 
[basic call](https://solana.com/docs/rpc/http/getprogramaccounts#parameters) ile toplamak büyük miktarda veri gerektirecektir. Ancak, parametreler sağlayarak yalnızca kullanmak istediğimiz verileri etkili bir şekilde talep edebiliriz.

### `filters`

`getProgramAccounts` ile kullanılacak en yaygın parametre `filters` dizisidir. Bu dizi, `dataSize` ve `memcmp` olmak üzere iki tür filtrenin kabul edilmesini sağlar.  

:::note
Her iki filtreyi kullanmadan önce, talep ettiğimiz verilerin nasıl düzenlendiği ve seri hale getirildiği konusunda aşina olmalıyız.
:::

#### `dataSize`

Token Programı durumunda, [token hesaplarının 165 bayt uzunluğunda olduğunu](https://github.com/solana-labs/solana-program-library/blob/08d9999f997a8bf38719679be9d572f119d0d960/token/program/src/state.rs#L86-L106) görebiliriz. Özellikle, bir token hesabı sekiz farklı alana sahiptir ve her bir alan belirli sayıda bayt gerektirir. Bu verilerin nasıl düzenlendiğini aşağıdaki illüstrasyonu kullanarak görselleştirebiliriz.

![Hesap Boyutu](../../../images/solana/public/assets/guides/get-program-accounts/account-size.png)

Cüzdan adresimize sahip olan tüm token hesaplarını bulmak istersek, sorgumuzun kapsamını yalnızca 165 bayt uzunluğundaki hesaplarla sınırlamak için `filters` dizimize `{ dataSize: 165 }` ekleyebiliriz. Ancak tek başına bu yeterli olmayacaktır. Ayrıca, cüzdan adresimize sahip hesapları arayan bir filtre eklememiz gerekecektir. Bunu `memcmp` filtresi ile başarabiliriz.

#### `memcmp`

`memcmp` filtresi, ya da "bellek karşılaştırma" filtresi, herhangi bir alanda saklanan verileri karşılaştırmamıza olanak tanır. Özellikle, belirli bir pozisyonda belirli bir dizi bayt ile eşleşen hesaplar için sorgu yapabiliriz. `memcmp` iki argüman gerektirir:

- `offset`: Verileri karşılaştırmaya başlayacağımız pozisyon. Bu pozisyon bayt cinsinden ölçülmekte ve bir tam sayı olarak ifade edilmektedir.
- `bytes`: Hesabın verileri ile eşleşmesi gereken veri. Bu, base-58 kodlu bir dize olarak belirtilmeli ve 129 bayttan daha az olmalıdır.

> **Önemli Not:** `memcmp`'in yalnızca `bytes` üzerinde tam eşleşme sağlayan sonuçlar döndüreceğini unutmamak önemlidir. 

Şu an itibarıyla, sağladığımız `bytes` değerinden daha az veya daha fazla olan değerler için karşılaştırmalar desteklenmemektedir.

Token Programı örneğimizde, sorgumuzu yalnızca cüzdan adresimize sahip token hesaplarını döndürecek şekilde değiştiriyoruz. Bir token hesabına baktığımızda, bir token hesabında saklanan ilk iki alanın her birinin pubkey olduğunu ve her pubkey'in 32 bayt uzunluğunda olduğunu görebiliriz. `owner` alanı ikinci alan olduğuna göre, `memcmp`'imize 32 baytlık bir `offset` ile başlamalıyız. Buradan sonra, `owner` alanının cüzdan adresimizle eşleşen hesapları arayacağız.

![Hesap Boyutu](../../../images/solana/public/assets/guides/get-program-accounts/memcmp.png)

Bu sorguyu aşağıdaki örnekle başlatabiliriz:

```typescript filename="get-program-accounts.ts"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";

(async () => {
  const MY_WALLET_ADDRESS = "FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T";
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const accounts = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      filters: [
        {
          dataSize: 165, // bayt sayısı
        },
        {
          memcmp: {
            offset: 32, // bayt sayısı
            bytes: MY_WALLET_ADDRESS, // base58 kodlu dize
          },
        },
      ],
    },
  );

  console.log(
    `Cüzdan ${MY_WALLET_ADDRESS} için ${accounts.length} token hesabı bulundu: `,
  );
  accounts.forEach((account, i) => {
    console.log(
      `-- Token Hesap Adresi ${i + 1}: ${account.pubkey.toString()} --`,
    );
    console.log(`Mint: ${account.account.data["parsed"]["info"]["mint"]}`);
    console.log(
      `Miktar: ${account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"]}`,
    );
  });
})();
```

Çıktı şu şekilde olmalıdır:

```shell
    Cüzdan FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T için 2 token hesabı bulundu:
    -- Token Hesap Adresi 0:  H12yCcKLHFJFfohkeKiN8v3zgaLnUMwRcnJTyB4igAsy --
    Mint: CKKDsBT6KiT4GDKs3e39Ue9tDkhuGUKM3cC2a7pmV9YK
    Miktar: 1
    -- Token Hesap Adresi 1:  Et3bNDxe2wP1yE5ao6mMvUByQUHg8nZTndpJNvfKLdCb --
    Mint: BUGuuhPsHpk8YZrL2GctsCtXGneL1gmT5zYb7eMHZDWf
    Miktar: 3
```

### `dataSlice`

İki filtre parametresinin yanı sıra, `getProgramAccounts` için en yaygın üçüncü parametre `dataSlice`dir. `filters` parametresinin aksine, `dataSlice`, bir sorgu tarafından döndürülen hesap sayısını azaltmayacaktır. Bunun yerine, `dataSlice`, her bir hesap için döndürülecek veri miktarını sınırlayacaktır.

:::info
`dataSlice`, büyük bir veri kümesi üzerinde sorgular çalıştırdığımızda ancak hesap verilerinin kendisi ile gerçekten ilgilenmediğimiz durumlarda özellikle kullanışlıdır. Bunun bir örneği, belirli bir token mint'i için token hesaplarının sayısını bulmak istememizdir.
:::

```typescript filename="get-program-accounts-data-slice.ts"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";

(async () => {
  const MY_TOKEN_MINT_ADDRESS = "BUGuuhPsHpk8YZrL2GctsCtXGneL1gmT5zYb7eMHZDWf";
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const accounts = await connection.getProgramAccounts(
    TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      dataSlice: {
        offset: 0, // bayt sayısı
        length: 0, // bayt sayısı
      },
      filters: [
        {
          dataSize: 165, // bayt sayısı
        },
        {
          memcmp: {
            offset: 0, // bayt sayısı
            bytes: MY_TOKEN_MINT_ADDRESS, // base58 kodlu dize
          },
        },
      ],
    },
  );
  console.log(
    `Mint ${MY_TOKEN_MINT_ADDRESS} için ${accounts.length} token hesabı bulundu`,
  );
  console.log(accounts);
})();
```

Çıktı şu şekilde olmalıdır (dikkat ederseniz, `account.data` bölümünde boş `` var):

```text
Mint BUGuuhPsHpk8YZrL2GctsCtXGneL1gmT5zYb7eMHZDWf için 3 token hesabı bulundu
  [
    {
      account: {
        data: <Buffer >,
        executable: false,
        lamports: 2039280,
        owner: [PublicKey],
        rentEpoch: 228
      },
      pubkey: PublicKey {
        _bn: <BN: a8aca7a3132e74db2ca37bfcd66f4450f4631a5464b62fffbd83c48ef814d8d7>
      }
    },
    {
      account: {
        data: <Buffer >,
        executable: false,
        lamports: 2039280,
        owner: [PublicKey],
        rentEpoch: 228
      },
      pubkey: PublicKey {
        _bn: <BN: ce3b7b906c2ff6c6b62dc4798136ec017611078443918b2fad1cadff3c2e0448>
      }
    },
    {
      account: {
        data: <Buffer >,
        executable: false,
        lamports: 2039280,
        owner: [PublicKey],
        rentEpoch: 228
      },
      pubkey: PublicKey {
        _bn: <BN: d4560e42cb24472b0e1203ff4b0079d6452b19367b701643fa4ac33e0501cb1>
      }
    }
  ]
```

Tüm üç parametreyi (`dataSlice`, `dataSize` ve `memcmp`) birleştirerek sorgumuzun kapsamını sınırlayabilir ve yalnızca ilgilendiğimiz verileri verimli bir şekilde döndürebiliriz.

## Diğer Kaynaklar

- [RPC API Belge](https://solana.com/docs/rpc/http/getprogramaccounts)
- [web3.js belgesi](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getProgramAccounts)
- [getParsedProgramAccounts belgesi](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getParsedProgramAccounts)