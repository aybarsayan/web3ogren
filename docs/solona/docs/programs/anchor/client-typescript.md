---
title: JS/TS İstemcisi
description:
  Anchor'ın TypeScript istemci kütüphanesini Solana programlarıyla etkileşimde
  nasıl kullanacağınızı öğrenin.
sidebarLabel: JS/TS İstemcisi
sidebarSortOrder: 3
---

Anchor, JavaScript veya TypeScript'ten Solana programlarıyla etkileşimi
kolaylaştıran bir Typescript istemci kütüphanesi sağlar
([@coral-xyz/anchor](https://github.com/coral-xyz/anchor/tree/v0.30.1/ts/packages/anchor)).

## İstemci Programı

İstemci kütüphanesini kullanmak için önce bir
[`Program`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/index.ts#L58)
örneği oluşturun. Bu örneği oluşturmak için Anchor tarafından
oluşturulan `IDL dosyası` gereklidir.

:::note
`Program` örneği oluşturmak için programın IDL'sine ve bir 
[`AnchorProvider`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/provider.ts#L55) 
gerekmektedir. `AnchorProvider`, iki şeyi birleştiren bir soyutlamadır:
:::

- `Connection` - bir `Solana kümesine` bağlantı
  (yani localhost, devnet, mainnet)
- `Wallet` - (isteğe bağlı) ödemeleri yapmak ve işlemleri imzalamak için
  kullanılan varsayılan cüzdan





Frontend ile entegre olurken
[Kripto cüzdan adaptörü](https://solana.com/developers/guides/wallets/add-solana-wallet-adapter-to-nextjs) 
kullanmanız gerekecek, `AnchorProvider` ve `Program`'ı yapılandırmalısınız.

```ts {9-10, 12-14}
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { HelloAnchor } from "./idlType";
import idl from "./idl.json";

const { connection } = useConnection();
const wallet = useAnchorWallet();

const provider = new AnchorProvider(connection, wallet, {});
setProvider(provider);

export const program = new Program(idl as HelloAnchor, {
  connection,
});
```

Yukarıdaki kod parçasında:

- `idl.json`, Anchor tarafından üretilen IDL dosyasıdır ve bir Anchor
  projesinde `/target/idl/.json` adresinde bulunur.
- `idlType.ts`, IDL türüdür (TS ile kullanım için) ve bir Anchor
  projesinde `/target/types/.ts` adresinde bulunur.

:::tip
Alternatif olarak, `Program` örneğini sadece IDL ve bir Solana kümesine
`Connection` kullanarak da oluşturabilirsiniz. Bu, varsayılan
`Wallet`'ın bulunmadığı anlamına gelir, ancak bağlı bir cüzdan olmadan
`Program`'ı kullanarak hesapları almak veya talimatlar oluşturmak mümkündür.
:::

```ts {8-10}
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import type { HelloAnchor } from "./idlType";
import idl from "./idl.json";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program(idl as HelloAnchor, {
  connection,
});
```




Anchor, yeni projelerin varsayılan test dosyasında otomatik olarak bir `Program` örneği
oluşturur. Ancak, bu yapılandırma Anchor çalışma alanının dışında `Program`'ı
başlatma şeklinizden farklıdır, örneğin React veya Node.js uygulamalarında.

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";

describe("hello_anchor", () => {
  // İstemciyi yerel küme kullanacak şekilde yapılandırın.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("Başlatıldı!", async () => {
    // Testinizi buraya ekleyin.
    const tx = await program.methods.initialize().rpc();
    console.log("İşlem imzanız", tx);
  });
});
```




## Talimatları Çağırma

Bir `Program` IDL'si kullanılarak kurulum tamamlandıktan sonra,
Anchor [`MethodsBuilder`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L155) 
kullanarak:

- Bireysel talimatlar oluşturun
- İşlemler oluşturun
- İşlemleri oluşturun ve gönderin

Temel format aşağıdaki gibidir:





`program.methods` - Bu, programın IDL'sinden talimat çağrıları oluşturmak için
kullanıcı arayüzüdür.

```ts /methods/ {1}
await program.methods
  .instructionName(instructionData)
  .accounts({})
  .signers([])
  .rpc();
```




`.methods`'den sonra, IDL'den bir talimat adını belirtin ve gerekli
argümanları virgülle ayrılmış değerler olarak geçirin.

```ts /instructionName/ /instructionData1/ /instructionData2/ {2}
await program.methods
  .instructionName(instructionData1, instructionData2)
  .accounts({})
  .signers([])
  .rpc();
```




`.accounts` - IDL'de belirtilen talimat tarafından gereksinim duyulan hesapların
adresini geçin.

```ts /accounts/ {3}
await program.methods
  .instructionName(instructionData)
  .accounts({})
  .signers([])
  .rpc();
```

Bazı hesap adreslerinin açıkça belirtilmesine gerek yoktur, çünkü
Anchor istemcisi bunları otomatik olarak çözebilir. Bunlar genellikle:

- Yaygın hesaplar (ör. Sistem Programı)
- Adresi bir PDA (Program Türetilmiş Adresi) olan hesaplar




`.signers` - İsteğe bağlı olarak, talimat tarafından ek imzacı olarak
gereken bir anahtar çiftleri dizisini geçin. Bu genellikle yeni hesaplar
oluşturulurken kullanılır; burada hesap adresi yeni oluşturulmuş bir anahtar çiftinin
açık anahtarıdır.

```ts /signers/ {4}
await program.methods
  .instructionName(instructionData)
  .accounts({})
  .signers([])
  .rpc();
```

`.signers` yalnızca `.rpc()` ile kullanıldığında kullanılmalıdır. `.transaction()`
veya `.instruction()` kullanıldığında, imzacılar
göndermeden önce işleme eklenmelidir.




Anchor, program talimatlarını oluşturmak için birden fazla yöntem sağlar:





[`rpc()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L283)
metodu
[belirtilen talimatla imzalı bir işlemi gönderir](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/rpc.ts#L29)
ve bir `TransactionSignature` döndürür.

`.rpc` kullanıldığında, `Provider`'dan gelen `Wallet` otomatik olarak
imzacı olarak eklenir.

```ts {13}
// Yeni hesap için anahtar çiftini oluştur
const newAccountKp = new Keypair();

const data = new BN(42);
const transactionSignature = await program.methods
  .initialize(data)
  .accounts({
    newAccount: newAccountKp.publicKey,
    signer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([newAccountKp])
  .rpc();
```




[`transaction()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L382)
metodu,
[belirtilen talimatla bir `Transaction`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/transaction.ts#L18-L26)
oluşturur ancak işlemi göndermez.

```ts {12} /transaction()/1,2,4
// Yeni hesap için anahtar çiftini oluştur
const newAccountKp = new Keypair();

const data = new BN(42);
const transaction = await program.methods
  .initialize(data)
  .accounts({
    newAccount: newAccountKp.publicKey,
    signer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .transaction();

const transactionSignature = await connection.sendTransaction(transaction, [
  wallet.payer,
  newAccountKp,
]);
```




[`instruction()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L348)
metodu,
[belirtilen talimatla bir `TransactionInstruction`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/instruction.ts#L57-L61)
oluşturur. Bu, talimatı bir işlemi manuel olarak eklemek ve diğer
talimatlarla birleştirmek istediğinizde faydalıdır.

```ts {12} /instruction()/
// Yeni hesap için anahtar çiftini oluştur
const newAccountKp = new Keypair();

const data = new BN(42);
const instruction = await program.methods
  .initialize(data)
  .accounts({
    newAccount: newAccountKp.publicKey,
    signer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .instruction();

const transaction = new Transaction().add(instruction);

const transactionSignature = await connection.sendTransaction(transaction, [
  wallet.payer,
  newAccountKp,
]);
```

 


## Hesapları Alma

`Program` istemcisi, Anchor programınız tarafından oluşturulan
hesapları alıp serileştirmeyi basitleştirir.

`program.account`'ı kullanarak, IDL'de tanımlanan hesap türünün adını
takip edin. Anchor, hesapları almak için birden fazla yöntem sağlar.





Belirli bir hesap türü için mevcut tüm hesapları almak için
[`all()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/account.ts#L251)
kullanın.

```ts /all/
const accounts = await program.account.newAccount.all();
```




Belirli bir değerle belirli bir offset'te eşleşen hesap verilerini
filtrelemek için `memcmp` (bellek karşılaştırması) kullanın. `memcmp` kullanırken
alınan hesap türünün veri alanının byte düzenini anlamanız gerekir.

:::warning
Offset'i hesaplarken, Anchor programları tarafından oluşturulan
hesaplarda ilk 8 baytın hesap ayırıcı için rezerve edildiğini
unutmayın.
:::

```ts /memcmp/
const accounts = await program.account.newAccount.all([
  {
    memcmp: {
      offset: 8,
      bytes: "",
    },
  },
]);
```




Tek bir hesabın veri alanını almak için
[`fetch()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/account.ts#L165)
kullanın.

```ts /fetch/
const account = await program.account.newAccount.fetch(ACCOUNT_ADDRESS);
```




Bir dizi hesap adresi geçirerek birden fazla hesabın veri alanını
almak için [`fetchMultiple()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/account.ts#L200)
kullanın.

```ts /fetchMultiple/
const accounts = await program.account.newAccount.fetchMultiple([
  ACCOUNT_ADDRESS_ONE,
  ACCOUNT_ADDRESS_TWO,
]);
```


