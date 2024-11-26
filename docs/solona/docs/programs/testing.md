---
title: "NodeJS ile Test Etme"
description: "Rust ile yazılmış yerel Solana programlarının NodeJS kullanarak test edilmesi"
sidebarSortOrder: 5
---

Solana üzerinde program geliştirme sürecinde, bunların doğruluğunu ve güvenilirliğini sağlamak çok önemlidir. Şimdiye kadar geliştiriciler `solana-test-validator` kullanarak test yapmaktaydılar. Bu belge, Solana programınızı Node.js kullanarak  
`solana-bankrun` ile test etmeyi kapsamaktadır.

## Genel Bakış

Solana üzerinde programları test etmenin iki yolu vardır:

1. [solana-test-validator](https://docs.solanalabs.com/cli/examples/test-validator):
   Bu, yerel makinenizde Solana Blockchain'in yerel bir emülatörünü başlatır
   ve doğrulayıcı tarafından işlenmesi gereken işlemleri alır.
2. SBF (Solana Bytecode Format) programları için çeşitli
   [BanksClient tabanlı](https://docs.rs/solana-banks-client/latest/solana_banks_client/)
   test çerçeveleri: Bankrun, bir Solana bankasının işlemlerini simüle eden bir çerçevedir,
   geliştiricilerin programları test koşullarında dağıtmasına, etkileşime geçmesine ve davranışını değerlendirmesine olanak tanır
   ana ağı taklit eden koşullar altında. Test ortamını kurmaya yardımcı olur ve
   kapsamlı işlem içgörüleri sunarak hata ayıklamayı ve
   doğrulamayı geliştirmeye yardımcı olur. Bu istemci ile programları yükleyebilir, işlemleri kaydedebilir ve
   işleyebiliriz.
   [solana-program-test](https://docs.rs/solana-program-test) (Rust),
   [solana-bankrun](https://github.com/kevinheavey/solana-bankrun) (Rust,
   JavaScript), [anchor-bankrun](https://www.npmjs.com/package/anchor-bankrun)
   (Anchor, JavaScript),
   [solders.bankrun](https://kevinheavey.github.io/solders/api_reference/bankrun.html)
   (Python) BanksClient tabanlı test çerçevelerine örneklerdir.

> [`pnpm create solana-program`](https://github.com/solana-program/create-solana-program)
> JS ve Rust istemcileri oluşturmanıza yardımcı olabilir, bunlar arasında testler de bulunmaktadır. Anchor henüz
> desteklenmemektedir.

:::info
Bu kılavuzda Solana Bankrun kullanıyoruz. `Bankrun`, Node.js içerisinde Solana programlarını test etmek için süper hızlı, güçlü ve hafif bir çerçevedir.
:::

- Solana Bankrun kullanmanın en büyük avantajı, programları test etmek için
  bir ortam kurmanıza gerek olmamasıdır; bunu `solana-test-validator` kullanırken
  yapmak zorunda kalacağınız gibi. Bunun yerine, bunu testler içerisinde
  bir kod parçası ile yapabilirsiniz.
- Ayrıca, `solana-test-validator` ile mümkün olmayan zaman ve hesap verilerini dinamik olarak ayarlar.

## Kurulum

Node projenize `solana-bankrun`'ı bir dev bağımlılığı olarak ekleyin. Eğer Solana
programınız henüz bir node projesi değilse, bunu `npm init` kullanarak başlatabilirsiniz.

```bash
npm i -D solana-bankrun
```

## Kullanım

### Program Dizini

Öncelikle programın `.so` dosyası aşağıdaki dizinlerden birinde mevcut olmalıdır:

- `./tests/fixtures` (bu dizini mevcut değilse oluşturarak oluşturun).
- Mevcut çalışma dizininiz.
- `BPF_OUT_DIR` veya `SBF_OUT_DIR` ortam değişkenlerinde tanımladığınız bir dizin. `export BPF_OUT_DIR='/path/to/binary'`
- Programınızı doğru dizini belirterek derleyin, böylece kütüphane dosyayı sadece adıyla dizinden alabilir.
  `cargo build-sbf --manifest-path=./program/Cargo.toml --sbf-out-dir=./tests/fixtures`

### Test Çerçevesi

solana-bankrun, [ts-mocha](https://www.npmjs.com/package/ts-mocha),
[ava](https://github.com/avajs/ava), [Jest](https://jestjs.io/) gibi test çerçeveleri ile
JavaScript veya TypeScript içinde kullanılır. Yukarıdakilerden herhangi biri ile başlamayı unutmayın.

:::tip
Programınızı test etmek için bir [npm betiği](https://docs.npmjs.com/cli/v9/using-npm/scripts) ekleyin ve `tests` klasöründe bir `test.ts` dosyası oluşturun.
:::

```json
{
  "scripts": {
    "test": "pnpm ts-mocha -p ./tsconfig.json -t 1000000 ./tests/test.ts"
  }
}
```

### Başlat

`solana-bankrun` içindeki `start` fonksiyonu, bir BanksServer ve BanksClient başlatır,
programları dağıtır ve talimatlara göre hesaplar ekler.

```typescript
import { start } from "solana-bankrun";
import { PublicKey } from "@solana/web3.js";

test("program talimatını test etme", async () => {
  const programId = PublicKey.unique();
  const context = await start([{ name: "program_name", programId }], []);

  const client = context.banksClient;
  const payer = context.payer;
  // testleri yaz
});
```

### Bankrun `context`

- `start` fonksiyonundan Bankrun `context`'ine erişim sağlarız. Context
  bir BanksClient, bir güncel blockhash ve bir fonlandirilmiş payer anahtar çiftini içerir.
- `context`'in bir `payer` özelliği vardır, bu da işlemleri imzalamak için kullanılabilecek
  bir fonlandirilmiş anahtar çiftidir.
- `context` ayrıca `context.lastBlockhash` veya `context.getLatestBlockhash` ile
  testlerde [Blockhash](https://solana.com/docs/terminology#blockhash) almaları kolay bir şekilde sağlar.
- `context.banksClient`, işlemleri göndermek ve defter durumundan hesap verilerini sorgulamak için kullanılır. Örneğin, bazen
  [Rent](https://solana.com/docs/terminology#rent) (lamport cinsinden)  
  bir işlem oluşturmak için gereklidir, örneğin, SystemProgram'ın  
  createAccount() talimatını kullandığınızda. Bunu BanksClient kullanarak yapabilirsiniz:

  ```typescript
  const rent = await client.getRent();

  const Ix: TransactionInstruction = SystemProgram.createAccount({
    // ...
    lamports: Number(rent.minimumBalance(BigInt(ACCOUNT_SIZE))),
    //....
  });
  ```

- BanksClient üzerinden `getAccount` fonksiyonunu kullanarak hesap verilerini okuyabilirsiniz.
  ```typescript
  AccountInfo = await client.getAccount(counter);
  ```

### İşlem İşleme

`processTransaction()` fonksiyonu, start fonksiyonundan yüklenen
programlarla ve hesaplarla işlemi yürütür  
ve bir işlem döndürür.

```typescript
let transaction = await client.processTransaction(tx);
```

## Örnek

Aşağıda bir test yazma örneği bulunmaktadır  
[hello world programı](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/native) için:

```typescript
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { start } from "solana-bankrun";
import { describe, test } from "node:test";
import { assert } from "chai";

describe("hello-solana", async () => {
  // solana-bankrun içerisinde programı yükle
  const PROGRAM_ID = PublicKey.unique();
  const context = await start(
    [{ name: "hello_solana_program", programId: PROGRAM_ID }],
    [],
  );
  const client = context.banksClient;
  const payer = context.payer;

  test("Merhaba de!", async () => {
    const blockhash = context.lastBlockhash;
    // İlk olarak talimatımızı ayarlıyoruz.
    let ix = new TransactionInstruction({
      // işlemi imzalamak için bağlayıcı anahtar çiftini kullanma
      keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
      programId: PROGRAM_ID,
      data: Buffer.alloc(0), // Veri yok
    });

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    // işlemi imzalamak için bağlayıcı anahtar çiftini kullanma
    tx.add(ix).sign(payer);

    // Şimdi işlemi işliyoruz
    let transaction = await client.processTransaction(tx);

    assert(transaction.logMessages[0].startsWith("Program " + PROGRAM_ID));
    assert(transaction.logMessages[1] === "Program log: Merhaba, Solana!");
    assert(
      transaction.logMessages[2] ===
        "Program log: Programımızın Program ID'si: " + PROGRAM_ID,
    );
    assert(
      transaction.logMessages[3].startsWith(
        "Program " + PROGRAM_ID + " tüketildi",
      ),
    );
    assert(transaction.logMessages[4] === "Program " + PROGRAM_ID + " başarıyla tamamlandı");
    assert(transaction.logMessages.length == 5);
  });
});
```

> Bu, [hello world programı](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/native) için testler çalıştırdıktan sonra çıktının nasıl göründüğüdür.

```text
[2024-06-04T12:57:36.188822000Z INFO  solana_program_test] "hello_solana_program" tests/fixtures/hello_solana_program.so dosyasından, 3 saniye, 20 ms, 687 µs ve 246 ns önce değiştirilmiş
[2024-06-04T12:57:36.246838000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111112 invoke [1]
[2024-06-04T12:57:36.246892000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Merhaba, Solana!
[2024-06-04T12:57:36.246917000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Programımızın Program ID'si: 11111111111111111111111111111112
[2024-06-04T12:57:36.246932000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111112 2905 birim hesapladı
[2024-06-04T12:57:36.246937000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111112 başarıyla tamamlandı
▶ hello-solana
  ✔ Merhaba de! (5.667917ms)
▶ hello-solana (7.047667ms)

ℹ testler 1
ℹ gruplar 1
ℹ geçer 1
ℹ başarısız 0
ℹ iptal edilen 0
ℹ atlanan 0
ℹ yapılacak 0
ℹ süre_ms 63.52616