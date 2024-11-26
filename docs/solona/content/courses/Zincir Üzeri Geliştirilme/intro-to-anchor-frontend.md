---
title: İstemci tarafında Anchor geliştirmeye giriş
objectives:
  - İstemciden bir Solana programı ile etkileşim kurmak için bir IDL kullanın
  - Anchor `Provider` nesnesini açıklayın
  - Anchor `Program` nesnesini açıklayın
  - Talimatlar ve işlemler oluşturmak için Anchor `MethodsBuilder`'ı kullanın
  - Anchor ile hesapları fetch edin
  - Anchor ve bir IDL kullanarak talimatları çağırmak için bir frontend ayarlayın
description:
  "Anchor'ın otomatik JS/TS istemcilerini kullanarak programınıza talimat göndermek."
---

## Özet

- Bir **IDL**, bir Solana programının yapısını temsil eden bir dosyadır. Anchor kullanılarak yazılan ve oluşturulan programlar, otomatik olarak karşılık gelen bir IDL oluşturur. IDL, Arayüz Tanım Dili'nin kısaltmasıdır.
- `@coral-xyz/anchor`, Anchor programlarıyla etkileşim kurmanız için gereken her şeyi içeren bir Typescript istemcisidir.
- Bir **Anchor `Provider`** nesnesi, bir kümeye `connection` ve belirtilen bir `wallet`'ı birleştirerek işlem imzalamayı sağlar.
- Bir **Anchor `Program`** nesnesi, belirli bir programla etkileşim kurmak için özel bir API sağlar. Bir `Program` örneği oluşturmak için programın IDL'si ve `Provider` kullanılır.
- **Anchor `MethodsBuilder`**, talimatlar ve işlemler oluşturmak için `Program` üzerinden basit bir arayüz sağlar.

---

## Ders

Anchor, bir programın yapısını yansıtan bir Arayüz Tanım Dili (IDL) dosyası sağlayarak istemciden Solana programlarıyla etkileşim sürecini basitleştirir. IDL'nin Anchor'ın Typescript kütüphanesi (`@coral-xyz/anchor`) ile birlikte kullanılması, talimatlar ve işlemler oluşturmak için basitleştirilmiş bir format sağlar.

```typescript
// işlem gönderir
await program.methods
  .instructionName(instructionDataInputs)
  .accounts({})
  .signers([])
  .rpc();
```

Bu, bir Typescript istemcisinden çalışır, ister bir frontend ister entegrasyon testleri olsun. Bu dersde, `@coral-xyz/anchor` kullanarak istemci tarafı program etkileşiminizi nasıl basitleştireceğimizi ele alacağız.

### Anchor istemci tarafı yapısı

Öncelikle, Anchor'ın Typescript kütüphanesinin temel yapısını gözden geçirelim. Kullanacağınız temel nesne `Program` nesnesidir. Bir `Program` örneği, belirli bir Solana programını temsil eder ve programla veri okuma ve yazma işlemleri için özel bir API sağlar.

Bir `Program` örneği oluşturmak için aşağıdakilere ihtiyacınız var:

- `IDL` - bir programın yapısını temsil eden dosya
- `Connection` - küme bağlantısı
- `Wallet` - işlem ödemesi ve imzalamak için kullanılan varsayılan anahtar çifti
- `Provider` - Solana kümesine `Connection` ve bir `Wallet`'ı kapsar.

![Anchor yapısı](../../../images/solana/public/assets/courses/unboxed/anchor-client-structure.png)

Yukarıdaki resim, bu parçaların her birinin bir `Program` örneği oluşturmak için nasıl bir araya geldiğini gösterir. Her birini ayrı ayrı ele alacağız.

#### Arayüz Tanım Dili (IDL)

Bir Anchor programı oluşturduğunuzda, Anchor, programınızın IDL'sini temsil eden bir JSON ve Typescript dosyası oluşturur. IDL, programın yapısını temsil eder ve bir istemci tarafından belirli bir programla nasıl etkileşim kuracağı konusunda çıkarım yapmak için kullanılabilir.

Otomatik olmasa da, Metaplex tarafından sağlanan [shank](https://github.com/metaplex-foundation/shank) gibi araçlar kullanarak yerel bir Solana programından da bir IDL oluşturabilirsiniz.

Bir IDL'nin sağladığı bilgileri anlamak için, daha önce oluşturduğunuz sayaç programının IDL'si aşağıdadır:

```json
{
  "address": "9sMy4hnC9MML6mioESFZmzpntt3focqwUq1ymPgbMf64",
  "metadata": {
    "name": "anchor_counter",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Anchor ile oluşturuldu"
  },
  "instructions": [
    {
      "name": "increment",
      "discriminator": [11, 18, 104, 9, 104, 174, 59, 33],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [
        {
          "name": "counter",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Counter",
      "discriminator": [255, 176, 4, 245, 188, 253, 124, 25]
    }
  ],
  "types": [
    {
      "name": "Counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    }
  ]
}
```

:::info  
IDL'yi incelediğinizde, `programId` ve `metadata` nesnesini görebilirsiniz, bunlar anchor 0.30.0'da eklenmiştir.  
:::

Bu program, `initialize` ve `increment` adlı iki talimat işleyicisine sahiptir.

Her iki talimat için de kullanıcıyı gerektiren `user`ın bir imzacı olarak belirtildiğine dikkat edin. Ayrıca, her iki talimat için de ek bir talimat verisi gerekmez, çünkü `args` bölümü her ikisi için de boştur.

`accounts` bölümüne daha derinlemesine bakarsak, programın `Counter` adında bir hesap türüne sahip olduğunu ve bununla birlikte çeşitli hesap türlerini ayırt etmek için kullanılan `discriminator` alanını görebilirsiniz.

Son olarak, `types` bölümümüzde `accounts` bölümünde tanımlanan hesap türleri yer almaktadır; bu durumda, `Counter` hesap türü için `u64` türünde tek bir alan olan `count` vardır.

Her ne kadar IDL, her talimat için uygulama ayrıntılarını sağlamasa da, zincir üzerindeki programın talimatları nasıl yapılandırması gerektiği konusunda temel bir anlayış elde edebiliriz ve program hesaplarının yapısını görebiliriz.

Her ne şekilde elde ederseniz edin, `@coral-xyz/anchor` paketini kullanarak bir programla etkileşim kurmak için bir IDL dosyasına _ihtiyacınız vardır_. IDL'yi kullanmak için, IDL dosyasını projenize ve türlerle birlikte dahil etmeli ve ardından dosyayı içe aktarmalısınız.

```typescript
import idl from "./idl.json";
```

Ayrıca, programla etkileşim kurmayı kolaylaştıracak türler için IDL'yi de talep edersiniz. Türler, programınızı oluşturduktan sonra `/target/types` klasöründe bulunabilir. Aşağıda, yukarıdaki IDL'nin türleri verilmiştir; bunlar tam IDL ile aynı yapıya sahiptir, ancak yalnızca bir tür yardımcıdır.

```typescript
/**
 * Program IDL'si, JS/TS'de kullanılabilmesi için camelCase formatında.
 *
 * Bunun yalnızca bir tür yardımcı olduğunu ve gerçek IDL olmadığını unutmayın. Orijinal
 * IDL, `target/idl/anchor_counter.json` adresinde bulunabilir.
 */
export type AnchorCounter = {
  address: "9sMy4hnC9MML6mioESFZmzpntt3focqwUq1ymPgbMf64";
  metadata: {
    name: "anchorCounter";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Anchor ile oluşturuldu";
  };
  instructions: [
    {
      name: "increment";
      discriminator: [11, 18, 104, 9, 104, 174, 59, 33];
      accounts: [
        {
          name: "counter";
          writable: true;
        },
        {
          name: "user";
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "counter";
          writable: true;
          signer: true;
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "counter";
      discriminator: [255, 176, 4, 245, 188, 253, 124, 25];
    }
  ];
  types: [
    {
      name: "counter";
      type: {
        kind: "struct";
        fields: [
          {
            name: "count";
            type: "u64";
          }
        ];
      };
    }
  ];
};
```

#### Provider

Bir `Program` nesnesi oluşturmak için IDL kullanmadan önce önce bir Anchor `Provider` nesnesi oluşturmanız gerekir.

`Provider` nesnesi iki şeyi birleştirir:

- `Connection` - bir Solana kümesine bağlantı (yani localhost, devnet, mainnet)
- `Wallet` - işlem ödemesi ve imzalamak için kullanılan belirli bir adres

`Provider`, bir `Wallet`'ın imzasını çıkış işlemlerine ekleyerek Solana blockchain'ine işlem gönderebilir. Bir frontend ile Solana cüzdan sağlayıcısı kullanırken, tüm çıkış işlemleri yine de kullanıcının cüzdan tarayıcı uzantısı aracılığıyla onaylanmalıdır.

`Wallet` ve `Connection` ayarlamak şöyle olacaktır:

```typescript
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const { connection } = useConnection();
const wallet = useAnchorWallet();
```

Bağlantıyı ayarlamak için, Solana kümesine `Connection` almak için `@solana/wallet-adapter-react` içindeki `useConnection` kancasını kullanabilirsiniz.

`useWallet` kancasından sağlanan `Wallet` nesnesinin, Anchor `Provider`'ın beklediği `Wallet` nesnesi ile uyumlu olmadığını unutmayın. Ancak `@solana/wallet-adapter-react` ayrıca `useAnchorWallet` kancasını da sağlıyor.

Karşılaştırma için, `useAnchorWallet` ile elde edilen `AnchorWallet` şöyle görünmektedir:

```typescript
export interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}
```

Ve `useWallet`'dan gelen `WalletContextState` şöyle görünmektedir:

```typescript
export interface WalletContextState {
  autoConnect: boolean;
  wallets: Wallet[];
  wallet: Wallet | null;
  publicKey: PublicKey | null;
  connecting: boolean;
  connected: boolean;
  disconnecting: boolean;
  select(walletName: WalletName): void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendTransaction(
    transaction: Transaction,
    connection: Connection,
    options?: SendTransactionOptions,
  ): Promise<TransactionSignature>;
  signTransaction: SignerWalletAdapterProps["signTransaction"] | undefined;
  signAllTransactions:
    | SignerWalletAdapterProps["signAllTransactions"]
    | undefined;
  signMessage: MessageSignerWalletAdapterProps["signMessage"] | undefined;
}
```

:::warning  
`WalletContextState`, `AnchorWallet`'a kıyasla çok daha fazla işlevsellik sağlar, fakat `Provider` nesnesini kurmak için `AnchorWallet` gereklidir.  
:::

`Provider` nesnesini oluşturmak için, `@coral-xyz/anchor` içindeki `AnchorProvider`'ı kullanırsınız.

`AnchorProvider` kurucusu üç parametre alır:

- `connection` - Solana kümesine `Connection`
- `wallet` - `Wallet` nesnesi
- `opts` - sağlanmadığı takdirde varsayılan ayarı belirten isteğe bağlı parametre

`Provider` nesnesini oluşturduktan sonra, `setProvider` kullanarak varsayılan sağlayıcı olarak ayarlarsınız.

```typescript
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, setProvider } from "@coral-xyz/anchor";

const { connection } = useConnection();
const wallet = useAnchorWallet();
const provider = new AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
setProvider(provider);
```

#### Program

IDL ve bir sağlayıcıya sahip olduğunuzda, bir `Program` örneği oluşturabilirsiniz. Kurucu üç parametre gerektirir:

- `idl` - IDL, `Idl` olarak tür
- `Provider` - önceki bölümde tartışılan sağleyici

`Program` nesnesi, bir Solana programıyla etkileşim kurmak için kullanabileceğiniz özel bir API oluşturur. Bu API, zincir üzerindeki programlarla iletişim kurmakla ilgili her şey için tek durak noktasıdır. Diğer şeylerin yanı sıra, işlemler gönderebilir, ayrıştırılmış hesapları fetch edebilir, talimat verilerini çözümleyebilir, hesap değişikliklerine abone olabilir ve olayları dinleyebilirsiniz. Ayrıca [Program sınıfı hakkında daha fazla bilgi edinebilirsiniz](https://coral-xyz.github.io/anchor/ts/classes/Program.html#constructor).

`Program` nesnesini oluşturmak için, önce `@coral-xyz/anchor`'dan `Program` ve `Idl`'yi içe aktarın. `Idl`, Typescript ile çalışırken kullanabileceğiniz bir türdür.

`Program` nesnesini oluştururken, varsayılan `Provider` belirtilmemişse otomatik olarak kullanılır.

Tür desteğini etkinleştirmek için, anchor projenizdeki `/target/types`'tan türleri projenize içe aktarın ve program nesnesi için türü belirtin.

Toplamda, son ayar aşağıdaki gibi görünecektir:

```typescript
import idl from "./idl.json";
import type { CounterProgram } from "@/types";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, Idl, AnchorProvider, setProvider } from "@coral-xyz/anchor";

const { connection } = useConnection();
const wallet = useAnchorWallet();

const provider = new AnchorProvider(connection, wallet, {});
setProvider(provider);

const program = new Program(idl as CounterProgram);

// sağlayıcıyı açıkça belirtebiliriz
const program = new Program(idl as CounterProgram, provider);
```

### Anchor `MethodsBuilder`

`Program` nesnesi kurulduktan sonra, programla ilgili talimatlar ve işlemler oluşturmak için Anchor Methods Builder'ı kullanabilirsiniz. `MethodsBuilder`, işlemleri çağırmak için basitleştirilmiş bir format sağlamak üzere IDL'yi kullanır.

İstemciden bir programla etkileşim kurarken camel case adlandırma kuralının kullanıldığını; ancak Rust'da program yazarken snake case adlandırma kuralının kullanıldığını unutmayın.

Temel `MethodsBuilder` formatı aşağıdaki gibidir:

```typescript
// işlem gönderir
await program.methods
  .instructionName(instructionDataInputs)
  .accounts({})
  .signers([])
  .rpc();
```

Adım adım ilerlersek:

1. `program` üzerinde `methods` çağırın - bu, programın IDL'sine ilişkin talimat çağrıları oluşturmak için yapılandırıcı API'dir.
2. Talimat adını `.instructionName(instructionDataInputs)` olarak çağırın - noktayı kullanarak talimatı çağırın ve talimatın adını geçerek herhangi bir talimat argümanını virgülle ayırarak geçin.
3. `accounts` çağırın - nokta söz dizimini kullanarak `.accounts` çağırın ve IDL'ye dayalı olarak talimatın beklediği her hesabı içeren bir nesneyi geçin.
4. Opsiyonel olarak `signers` çağırın - nokta söz dizimini kullanarak `.signers` çağırın ve talimat tarafından gereken ek imzacıların bir dizisini geçin.
5. `rpc` çağırın - bu yöntem, belirli talimat ile imzalı bir işlem oluşturur ve gönderir ve bir `TransactionSignature` döndürür. `.rpc` kullanırken, `Provider`'dan `Wallet` otomatik olarak imzacı olarak dahildir ve açıkça belirtilmesine gerek yoktur.

Eğer talimat dışında başka ek imzacılar gerekmiyorsa, yalnızca `Provider` ile belirtilen `Wallet`, `.signer([])` satırını dışarıda bırakabilirsiniz.

Ayrıca, işlemi doğrudan oluşturmak için `.rpc()`'yu `.transaction()` ile değiştirebilirsiniz. Bu, belirtilen talimatı kullanarak bir `Transaction` nesnesi oluşturur.

```typescript
// işlemi oluşturur
const transaction = await program.methods
  .instructionName(instructionDataInputs)
  .accounts({})
  .transaction();

await sendTransaction(transaction, connection);
```

Benzer şekilde, talimat oluşturmak için aynı formatı kullanabilirsiniz; `.instruction()` ile başlayın ve ardından talimatları yeni bir işleme manuel olarak ekleyin. Bu, belirtilen talimatı kullanarak bir `TransactionInstruction` nesnesi oluşturur.

```typescript
// ilk talimatı oluşturur
const instructionOne = await program.methods
  .instructionOneName(instructionOneDataInputs)
  .accounts({})
  .instruction();

// ikinci talimatı oluşturur
const instructionTwo = await program.methods
  .instructionTwoName(instructionTwoDataInputs)
  .accounts({})
  .instruction();

// her iki talimatı tek bir işleme ekle
const transaction = new Transaction().add(instructionOne, instructionTwo);

// işlemi gönder
await sendTransaction(transaction, connection);
```

Özetle, Anchor `MethodsBuilder`, zincir üzerindeki programlarla etkileşim sağlamak için basitleştirilmiş ve daha esnek bir yol sunar. Bir talimat, bir işlem veya bir işlemi oluşturup gönderebilirsiniz; esasen aynı formatı kullanarak, hesapları veya talimat verilerini manuel olarak serileştirip çözmek zorunda kalmadan.

### Program hesaplarını fetch etme

`Program` nesnesi, program hesaplarını kolayca fetch etmenizi ve filtrelemenizi de sağlar. Program üzerinde `account` çağrısını yaparak ve ardından IDL'de yansıtılan hesap türünün adını belirterek başlayın. Anchor, ardından istenen tüm hesapları ayrıştırır ve döndürür.

Aşağıdaki örnek, Sayaç programı için var olan tüm `counter` hesaplarını fetch etmenin nasıl olacağını göstermektedir.

```typescript
const accounts = await program.account.counter.all();
```

Ayrıca, `memcmp` kullanarak bir filtre uygulayabilir ve ardından bir `offset` ve filtreniz için `bytes` belirtebilirsiniz.

Aşağıdaki örnek, `count` değeri 0 olan tüm `counter` hesaplarını fetch eder. 8'lik `offset`, Anchor'ın hesap türlerini tanımlamak için kullandığı 8 byte'lık discriminator içindir. 9. byte, `count` alanının başladığı yerdir. IDL'ye başvurursanız, sonraki byte'ın `u64` türünde `count` alanını sakladığını görebilirsiniz. Anchor daha sonra, aynı konumdaki eşleşen byte'ları filtreleyip döndürür.

```typescript
const accounts = await program.account.counter.all([
  {
    memcmp: {
      offset: 8,
      bytes: bs58.encode(new BN(0, "le").toArray()),
    },
  },
]);
```

Alternatif olarak, aradığınız belirli bir hesabın adresini biliyorsanız, `fetch` kullanarak ayrıştırılmış hesap verilerini edinebilirsiniz.

```typescript
const account = await program.account.counter.fetch(ACCOUNT_ADDRESS);
```

Benzer şekilde, `fetchMultiple` kullanarak birden fazla hesabı fetch edebilirsiniz.

```typescript
const accounts = await program.account.counter.fetchMultiple([
  ACCOUNT_ADDRESS_ONE,
  ACCOUNT_ADDRESS_TWO,
]);
```

---

## Laboratuvar

Bunu birlikte, bir önceki dersten aldığımız Sayaç programı için bir frontend oluşturarak pratik yapalım. Hatırlatma olarak, Sayaç programının iki talimatı bulunmaktadır:

- `initialize` - yeni bir `Counter` hesabını başlatır ve `count` değerini `0` olarak ayarlar.
- `increment` - mevcut bir `Counter` hesabındaki `count` değerini artırır.

#### 1. Başlangıç kodunu indirin

[Bunu projenin başlangıç kodunu indirin](https://github.com/solana-developers/anchor-ping-frontend/tree/starter).
Başlangıç kodunu indirdikten sonra içeride biraz gezinin. Bağımlılıkları `npm install` ile yükleyin ve ardından uygulamayı `npm run dev` ile çalıştırın.

Bu proje, `npx create-next-dapp` kullanılarak oluşturulmuş basit bir Next.js uygulamasıdır.

Sayaç programı için `idl.json` dosyası ve bu laboratuvar boyunca oluşturacağımız `Initialize` ve `Increment` bileşenleri bulunmaktadır.

#### 2. `Initialize`

Başlamak için, `components/counter/counter-data-access.tsx` bileşeninde `useCounterProgram` kancasını oluşturmak için gerekli ayarları tamamlayalım.

:::info
Unutmayın, programımızda talimatları çağırmak için Anchor `MethodsBuilder` kullanmak üzere bir `Program` örneğine ihtiyacımız var.
:::

`create-solana-dapp` zaten bizim için bir `getCounterProgram` oluşturur ve bu, bize `Program` örneğini döndürür.

```typescript
// Bu, Counter Anchor programını almak için bir yardımcı fonksiyondur.
export function getCounterProgram(provider: AnchorProvider) {
  return new Program(CounterIDL as AnchorCounter, provider);
}
```

Şimdi, `useCounterProgram` kancasından bir program örneği oluşturacağız.

```typescript
const provider = useAnchorProvider();
const program = getCounterProgram(provider);
```

- `useAnchorProvider`, provider'ı döndüren bir yardımcı fonksiyondur ve `components/solana/solana-provider` dosyasındadır. Artık program örneğimiz var, aslında programın `initialize` talimatını çağırabiliriz. Bunu `useMutation` kullanarak gerçekleştireceğiz.

:::tip
Unutmayın, yeni bir `Counter` hesabı başlatacağımız için yeni bir `Keypair` oluşturmamız gerekecek.
:::

```typescript
const initialize = useMutation({
  mutationKey: ["counter", "initialize", { cluster }],

  mutationFn: (keypair: Keypair) =>
    program.methods
      .initialize()
      .accounts({ counter: keypair.publicKey })
      .signers([keypair])
      .rpc(),

  onSuccess: signature => {
    transactionToast(signature);
    return accounts.refetch();
  },
  onError: () => toast.error("Hesabı başlatmada başarısız olundu"),
});
```

Sadece bir `keypair` kabul eden `mutationFn`'ye odaklanın. Yeni bir işlem oluşturup göndermek için Anchor `MethodsBuilder` kullanıyoruz. Unutmayın, Anchor bazı gerekli hesapları, örneğin `user` ve `systemAccount` hesaplarını çıkarabilir. Ancak, dinamik olarak oluşturduğumuz `counter` hesabını çıkaramaz, bu nedenle onu `.accounts` ile eklemeniz gerekecek. Bu keypair'i de imzalayıcı olarak `.signers` ile eklemeniz gerekecek. Son olarak, işlemi kullanıcının cüzdanına göndermek için `.rpc()` kullanabilirsiniz.

:::note
İşlem geçtiğinde, `onSuccess` ile imzayı çağırıyor ve ardından `accounts`'ı güncelliyoruz.
:::

#### 3. `Accounts`

Yukarıdaki `initialize` mutasyonu sırasında `accounts.refetch()` çağrısı yapıyoruz. Bu, her yeni hesap başlatıldığında depoladığımız hesapların yenilenmesidir.

```typescript
const accounts = useQuery({
  queryKey: ["counter", "all", { cluster }],
  queryFn: () => program.account.counter.all(),
});
```

Artık oluşturulan tüm `counter` hesaplarını almak için `program` örneğinden `account` kullanıyoruz. Bu yöntem, içsel olarak `getProgramAccounts` çağrısını yapar.

#### 4. `Increment`

Sonraki aşamada `useCounterProgramAccount` kancasına geçelim. Daha önce `program` ve `accounts` fonksiyonlarını oluşturduğumuz için, onları çağıracağız ve yeniden tanımlamayacağız.

Başlangıç ayarları için aşağıdaki kodu ekleyin:

```typescript
export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  ...

  const { program, accounts } = useCounterProgram();
}
```

Sonrasında, Anchor `MethodsBuilder` kullanarak `increment` talimatını çağırmak için yeni bir talimat oluşturalım. Yine, Anchor wallet'tan `user` hesabını çıkarabildiği için yalnızca `counter` hesabını eklememiz yeterli olacaktır.

```typescript
const incrementMutation = useMutation({
  mutationKey: ["counter", "increment", { cluster, account }],

  mutationFn: () =>
    program.methods.increment().accounts({ counter: account }).rpc(),

  onSuccess: tx => {
    transactionToast(tx);
    return accountQuery.refetch();
  },
});
```

Counter güncellendikçe, işlem başarıyla tamamlandığında `accountQuery.refetch()` çağrısıyla sayacı güncelleyeceğiz.

```typescript
const accountQuery = useQuery({
  queryKey: ["counter", "fetch", { cluster, account }],
  queryFn: () => program.account.counter.fetch(account),
});
```

#### 6. Ön Uç Testi

Bu noktada her şey çalışmalıdır! Ön ucu test etmek için `yarn dev` çalıştırabilirsiniz.

1. Cüzdanınızı bağlayın ve `Counter Program` sekmesine gidin.
2. `Create` butonuna tıklayın ve ardından işlemi onaylayın.
3. Ekranın sağ alt köşesinde `initialize` işlemi için Solana Explorer'a bir bağlantı görmelisiniz. `Increment` butonu ve sayaç görünmelidir.
4. `Increment` butonuna tıklayın ve ardından işlemi onaylayın.
5. Birkaç saniye bekleyin. Sayaç ekranda artmalıdır.

![Anchor Frontend Demo](../../../images/solana/public/assets/courses/unboxed/anchor-frontend-demo.gif)

:::tip
Her işlemden sonra program günlüklerini incelemek için bağlantılara tıklamaktan çekinmeyin!
:::

![Initialize Program Log](../../../images/solana/public/assets/courses/unboxed/anchor-frontend-initialize.png)

![Increment Program Log](../../../images/solana/public/assets/courses/unboxed/anchor-frontend-increment.png)

> Tebrikler, artık bir Anchor IDL kullanarak Solana programını çağırmak için bir ön uç ayarlamayı biliyorsunuz.  
> — Belirtilen bilgi

Bu projede bu kavramlarla rahat hissetmek için daha fazla zaman gerekiyorsa, devam etmeden önce  
[solution-increment] branşındaki çözüm koduna göz atabilirsiniz. 

## Challenge

Şimdi bağımsız olarak bir şeyler inşa etme zamanı. Laboratuvar çalışmamız üzerinde inşa ederek, ön uçta sayacı azaltan bir buton oluşturan yeni bir bileşen yaratmaya çalışın.

Ön uçta bileşeni oluşturmadan önce, öncelikle şunları yapmanız gerekiyor:

1. Bir `decrement` talimatı uygulayan yeni bir program oluşturun ve dağıtın.
2. Ön uçta IDL dosyasını yeni programınızdaki ile güncelleyin.
3. `programId`'yi yeni programınızdaki ile güncelleyin.

Biraz yardıma ihtiyacınız olursa, bu programı  
[referans alın](https://github.com/solana-developers/anchor-ping-frontend/tree/solution-increment).

Bunu bağımsız olarak yapmaya çalışın! Ama takılırsanız,  
[çözüm koduna](https://github.com/solana-developers/anchor-ping-frontend/tree/solution-decrement) başvurabilirsiniz.


Kodunuzu GitHub'a gönderin ve  
[bui dersi değerlendirin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=774a4023-646d-4394-af6d-19724a6db3db)!
