---
date: 2024-04-24T00:00:00Z
difficulty: beginner
title: "Yerel Rust Programı Yazma Rehberi"
description:
  "Bu rehber, Rust programlama dilini kullanarak onchain programlar geliştirme konusunda temel bir genel bakış sunmaktadır."
tags:
  - rust
keywords:
  - öğretici
---

Anchor çerçevesini kullanmadan Solana programları yazmak için 
[`solana_program`](https://docs.rs/solana-program/latest/solana_program/) kütüphanesini kullanıyoruz. 
Bu, Rust'ta onchain programlar yazmak için temel kütüphanedir.

Yeni başlayanlar için, `Anchor çerçevesi` ile başlamak önerilir.

## Program

Aşağıda, yeni bir hesap oluşturmak için tek bir talimat içeren basit bir Solana programı bulunmaktadır. Solana programının temel yapısını açıklamak için adım adım ilerleyeceğiz. İşte program [Solana Playground](https://beta.solpg.io/661058a6cffcf4b13384d02a) üzerinde.

```rust filename="lib.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction::create_account,
    sysvar::Sysvar,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = Instructions::try_from_slice(instruction_data)?;
    match instruction {
        Instructions::Initialize { data } => process_initialize(program_id, accounts, data),
    }
}

pub fn process_initialize(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let new_account = next_account_info(accounts_iter)?;
    let signer = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    let account_data = NewAccount { data };
    let size = account_data.try_to_vec()?.len();
    let lamports = (Rent::get()?).minimum_balance(size);

    invoke(
        &create_account(
            signer.key,
            new_account.key,
            lamports,
            size as u64,
            program_id,
        ),
        &[signer.clone(), new_account.clone(), system_program.clone()],
    )?;

    account_data.serialize(&mut *new_account.data.borrow_mut())?;
    msg!("Veriyi değiştirildi: {:?}!", data);
    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum Instructions {
    Initialize { data: u64 },
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct NewAccount {
    pub data: u64,
}
```

### Giriş Noktası

Her Solana programı, programı çağırmak için kullanılan tek bir 
[giriş noktası](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/entrypoint.rs#L125) içerir. 
[`process_instruction`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/entrypoint.rs#L28-L29) 
fonksiyonu, giriş noktasına geçirilen verileri işlemek için kullanılır. Bu fonksiyon, aşağıdaki parametreleri gerektirir:

- `program_id` - Geçerli programın adresi
- `accounts` - Bir talimatı yürütmek için gereken hesaplar dizisi.
- `instruction_data` - Belirli bir talimata özel serileştirilmiş veriler.

```rust
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    ...
}
```

Bu parametreler, bir `talimat` için gereken ayrıntılara karşılık gelir.

### Talimatlar

Sadece bir giriş noktası olmasına rağmen, program yürütme `instruction_data`'ya bağlı olarak farklı yollar izleyebilir. Talimatları, programda ayrı bir talimatı temsil eden bir [enum](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html) içinde değişkenler olarak tanımlamak yaygındır.

```rust {3}
#[derive(BorshSerialize, BorshDeserialize)]
pub enum Instructions {
    Initialize { data: u64 },
}
```

Giriş noktasına geçirilen `instruction_data`, karşılık gelen enum değişkenini belirlemek için serileştirilir.

```rust {6} /instruction_data/
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = Instructions::try_from_slice(instruction_data)?;
    match instruction {
        Instructions::Initialize { data } => process_initialize(program_id, accounts, data),
    }
}
```

Bir [match](https://doc.rust-lang.org/book/ch06-02-match.html) ifadesi, tanımlanan talimatı işleme mantığını içeren fonksiyonu çağırmak için kullanılır. Bu fonksiyonlar genellikle `talimat işleyiciler` olarak adlandırılır.

```rust /process_initialize/
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = Instructions::try_from_slice(instruction_data)?;
    match instruction {
        Instructions::Initialize { data } => process_initialize(program_id, accounts, data),
    }
}

pub fn process_initialize(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: u64,
) -> ProgramResult {
    ...
    Ok(())
}
```

### Talimatı İşleme

Her programda, o talimatı gerçekleştirmek için gereken mantığı uygulayan belirli bir talimat işleyici fonksiyon bulunur.

```rust
pub fn process_initialize(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let new_account = next_account_info(accounts_iter)?;
    let signer = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    let account_data = NewAccount { data };
    let size = account_data.try_to_vec()?.len();
    let lamports = (Rent::get()?).minimum_balance(size);

    invoke(
        &create_account(
            signer.key,
            new_account.key,
            lamports,
            size as u64,
            program_id,
        ),
        &[signer.clone(), new_account.clone(), system_program.clone()],
    )?;

    account_data.serialize(&mut *new_account.data.borrow_mut())?;
    msg!("Veriyi değiştirildi: {:?}!", data);
    Ok(())
}
```

Programa sağlanan hesaplara erişmek için, `accounts` argümanı aracılığıyla giriş noktasına geçirilen hesaplar listesini yinelemek için bir [iteratör](https://doc.rust-lang.org/book/ch13-02-iterators.html) kullanın. 
[`next_account_info`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/account_info.rs#L326) 
fonksiyonu, iteratördeki bir sonraki ögeyi erişmek için kullanılır.

```rust {1} /new_account/ /signer/ /system_program/
let accounts_iter = &mut accounts.iter();

let new_account = next_account_info(accounts_iter)?;
let signer = next_account_info(accounts_iter)?;
let system_program = next_account_info(accounts_iter)?;
```

Yeni bir hesap oluşturmak, `Sistem Programı` üzerindeki [`create_account`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/programs/system/src/system_processor.rs#L145) talimatını çağırmayı gerektirir. Sistem Programı yeni bir hesap oluşturduğunda, yeni hesabın program sahibini atayabilir.

:::info
Bu örnekte, `Çapraz Program Çağrısı` kullanarak Sistem Programını çağırıyor ve çalıştıran programı sahibi olarak belirterek yeni bir hesap oluşturuyoruz. 
`Solana Hesap Modeli` gereğince, yalnızca bir hesabın `sahibi` olarak atanmış program, hesap üzerindeki verileri değiştirmeye yetkilidir.
:::

```rust
let account_data = NewAccount { data };
let size = account_data.try_to_vec()?.len();
let lamports = (Rent::get()?).minimum_balance(size);

invoke(
    &create_account(
        signer.key,      // ödeyici
        new_account.key, // yeni hesap adresi
        lamports,        // kira
        size as u64,     // alan
        program_id,      // program sahibi adresi
    ),
    &[signer.clone(), new_account.clone(), system_program.clone()],
)?;
```

Hesap başarıyla oluşturulduktan sonra, son adım yeni hesabın `data` alanına verileri serileştirmektir. Bu, hesabın verilerini başlatır ve giriş noktasına geçirilen `data`yı depolar.

```rust
account_data.serialize(&mut *new_account.data.borrow_mut())?;
```

### Durum

Yapılar, bir program için özel bir veri hesap türünün formatını tanımlamak için kullanılır. Hesap verilerinin serileştirilmesi ve serileştirmeden çıkarılması genellikle [Borsh](https://borsh.io/) kullanılarak yapılır.

Bu örnekte, `NewAccount` yapısı yeni bir hesapta depolanacak verinin yapısını tanımlar.

```rust
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct NewAccount {
    pub data: u64,
}
```

Tüm Solana hesapları, rastgele verileri bir bayt dizisi olarak depolamak için kullanılabilecek bir `data` alanı içerir. Bu esneklik, programların yeni hesaplar içinde özelleştirilmiş veri yapıları oluşturmalarına ve depolamalarına olanak tanır.

`process_initialize` fonksiyonunda, giriş noktasına geçirilen veri, `NewAccount` yapısının bir örneğini oluşturmak için kullanılır. Bu örnek serileştirilir ve yeni oluşturulan hesabın veri alanında depolanır.

```rust /data: u64/1 /account_data/ /NewAccount { data }/ /NewAccount/
pub fn process_initialize(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: u64,
) -> ProgramResult {

    let account_data = NewAccount { data };

    invoke(
        ...
    )?;

    account_data.serialize(&mut *new_account.data.borrow_mut())?;
    msg!("Veriyi değiştirildi: {:?}!", data);
    Ok(())
}
...

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct NewAccount {
    pub data: u64,
}
```

## İstemci

Yerel Rust'ta yazılmış Solana programlarıyla etkileşim, doğrudan 
[`TransactionInstruction`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/TransactionInstruction.html) oluşturmayı içerir.

Benzer şekilde, hesap verilerini almak ve serileştirmek, zincir üzerindeki programın veri yapıları ile uyumlu bir şema oluşturmayı gerektirir.

> **Desteklenen çeşitli istemci dilleri vardır.** Ayrıntıları,
> `Rust` ve 
> `Javascript/Typescript` için 
> Solana İstemcileri altında bulabilirsiniz.

Aşağıda, yukarıdaki programdan `initialize` talimatını nasıl çağıracağımıza dair bir örneği inceleyeceğiz.

```ts filename="native.test.ts"
describe("Test", () => {
  it("Initialize", async () => {
    // Yeni hesap için anahtar çifti oluştur
    const newAccountKp = new web3.Keypair();

    const instructionIndex = 0;
    const data = 42;

    // Talimat veri tamponu oluştur
    const instructionData = Buffer.alloc(1 + 8);
    instructionData.writeUInt8(instructionIndex, 0);
    instructionData.writeBigUInt64LE(BigInt(data), 1);

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: newAccountKp.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: pg.wallet.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: pg.PROGRAM_ID,
      data: instructionData,
    });

    const transaction = new web3.Transaction().add(instruction);

    const txHash = await web3.sendAndConfirmTransaction(
      pg.connection,
      transaction,
      [pg.wallet.keypair, newAccountKp],
    );
    console.log(`Logları görmek için 'solana confirm -v ${txHash}' kullanın`);

    // Hesabı Al
    const newAccount = await pg.connection.getAccountInfo(
      newAccountKp.publicKey,
    );

    // Hesap Verisini Serileştir
    const deserializedAccountData = borsh.deserialize(
      AccountDataSchema,
      AccountData,
      newAccount.data,
    );

    console.log(Number(deserializedAccountData.data));
  });
});

class AccountData {
  data = 0;
  constructor(fields: { data: number }) {
    if (fields) {
      this.data = fields.data;
    }
  }
}

const AccountDataSchema = new Map([
  [AccountData, { kind: "struct", fields: [["data", "u64"]] }],
]);
```

### Talimatları Çağırma

Bir talimatı çağırmak için, zincir üzerindeki programla eşleşen bir `TransactionInstruction` oluşturmanız gerekir. Bu, aşağıdakileri belirtmeyi içerir:

- Çağrılan program için program ID'si
- Talimat tarafından gereken her hesap için `AccountMeta`
- Talimat tarafından gereken talimat veri tamponu

```ts
// Yeni hesap için anahtar çifti oluştur
const newAccountKp = new web3.Keypair();

const instructionIndex = 0;
const data = 42;

// Talimat veri tamponu oluştur
const instructionData = Buffer.alloc(1 + 8);
instructionData.writeUInt8(instructionIndex, 0);
instructionData.writeBigUInt64LE(BigInt(data), 1);

const instruction = new web3.TransactionInstruction({
  keys: [
    {
      pubkey: newAccountKp.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: pg.wallet.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
  ],
  programId: pg.PROGRAM_ID,
  data: instructionData,
});
```

Öncelikle yeni bir anahtar çifti oluşturun. Bu anahtar çiftinin publicKey'i, `initialize` talimatı tarafından oluşturulacak yeni hesabın adresi olarak kullanılacaktır.

```ts
// Yeni hesap için anahtar çifti oluştur
const newAccountKp = new web3.Keypair();
```

Talimat oluşturulmadan önce, talimatın beklediği talimat veri tamponunu hazırlayın. Bu örnekte, tamponun ilk baytı program üzerindeki hangi talimatın çağrılacağını tanımlar. Ek olarak 8 bayt, `initialize` talimatı tarafından gerekli olan `u64` tip veri için ayrılmıştır.

```ts {5}
const instructionIndex = 0;
const data = 42;

// Talimat veri tamponu oluştur
const instructionData = Buffer.alloc(1 + 8);
instructionData.writeUInt8(instructionIndex, 0);
instructionData.writeBigUInt64LE(BigInt(data), 1);
```

Talimat veri tamponunu oluşturduktan sonra, bunu `TransactionInstruction` oluşturmak için kullanın. Bu, program ID'sini belirtmeyi ve talimatta yer alan her hesap için `AccountMeta` tanımlamayı içerir. Bu, her hesabın yazılabilir durumu ve işlemde bir imzacı olup olmadığını belirtmeyi içerir.

```ts {4-6, 9-11, 14-16}
const instruction = new web3.TransactionInstruction({
  keys: [
    {
      pubkey: newAccountKp.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: pg.wallet.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
  ],
  programId: pg.PROGRAM_ID,
  data: instructionData,
});
```

Son olarak, talimatı yeni bir işleme ekleyin ve ağ tarafından işlenmesi için gönderin.

```ts {1} /instruction/ /transaction/
const transaction = new web3.Transaction().add(instruction);

const txHash = await web3.sendAndConfirmTransaction(
  pg.connection,
  transaction,
  [pg.wallet.keypair, newAccountKp],
);
console.log(`Logları görmek için 'solana confirm -v ${txHash}' kullanın`);
```

### Hesapları Alma

Hesap verilerini almak ve serileştirmek için, önce beklenen zincir üzerindeki hesap verileriyle uyumlu bir şemayı oluşturmalısınız.

```ts
class AccountData {
  data = 0;
  constructor(fields: { data: number }) {
    if (fields) {
      this.data = fields.data;
    }
  }
}

const AccountDataSchema = new Map([
  [AccountData, { kind: "struct", fields: [["data", "u64"]] }],
]);
```

Daha sonra, hesabın adresini kullanarak `AccountInfo`'yu alın.

```ts /newAccountKp.publicKey/
const newAccount = await pg.connection.getAccountInfo(newAccountKp.publicKey);
```

Son olarak, önceden tanımlanmış şemayı kullanarak `AccountInfo`'nun `data` alanını serileştirin.

```ts /newAccount.data/ {2-4}
const deserializedAccountData = borsh.deserialize(
  AccountDataSchema,
  AccountData,
  newAccount.data,
);

console.log(Number(deserializedAccountData.data));
```