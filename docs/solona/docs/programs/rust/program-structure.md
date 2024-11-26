---
title: Rust Program Yapısı
sidebarLabel: Program Yapısı
description:
  Rust ile Solana programlarının nasıl yapılandırılacağını, giriş noktaları, durum
  yönetimi, talimat işleme ve test etme dâhil öğrenin.
sidebarSortOrder: 1
---

Rust ile yazılmış Solana programlarının minimum yapısal gereksinimleri vardır, bu da kodun nasıl düzenlendiği konusunda esneklik sağlar. Tek gereksinim, bir programın `entrypoint` içermesi gerektiğidir; bu, programın yürütmeye nereden başlayacağını tanımlar.

## Program Yapısı

Dosya yapısı için katı kurallar olmamakla birlikte, Solana programları genellikle yaygın bir şablon izler:

- `entrypoint.rs`: Gelen talimatları yönlendiren giriş noktasını tanımlar.
- `state.rs`: Programa özgü durumu tanımlar (hesap verileri).
- `instructions.rs`: Programın gerçekleştirebileceği talimatları tanımlar.
- `processor.rs`: Her talimat için iş mantığını uygulayan talimat işleyicilerini (fonksiyonları) tanımlar.
- `error.rs`: Programın döndürebileceği özel hataları tanımlar.

:::tip
Örnekleri [Solana Program Kütüphanesi](https://github.com/solana-labs/solana-program-library/tree/master/token/program/src) adresinde bulabilirsiniz.
:::

## Örnek Program

Birden fazla talimatla yerel bir Rust programı oluşturmayı göstermek için, basit bir sayaç programını iki talimat uygulayacak şekilde inceleyeceğiz:

1. `InitializeCounter`: Yeni bir hesap oluşturur ve başlangıç değerini başlatır.
2. `IncrementCounter`: Var olan bir hesapta saklanan değeri artırır.

:::note
Basitlik için program, tek bir `lib.rs` dosyasında uygulanacaktır, ancak pratikte büyük programları birden fazla dosyaya bölmek isteyebilirsiniz.
:::


👀 Tam Program Kodu

```rs filename="lib.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

// Program giriş noktası
entrypoint!(process_instruction);

// Talimatları doğru işleyiciye yönlendiren fonksiyon
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) - ProgramResult {
    // Talimat verilerini ayır
    let instruction = CounterInstruction::unpack(instruction_data)?;

    // Talimat türünü eşle
    match instruction {
        CounterInstruction::InitializeCounter { initial_value } = {
            process_initialize_counter(program_id, accounts, initial_value)?
        }
        CounterInstruction::IncrementCounter = process_increment_counter(program_id, accounts)?,
    };
    Ok(())
}

// Programın yürütebileceği talimatlar
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    InitializeCounter { initial_value: u64 }, // varyant 0
    IncrementCounter,                         // varyant 1
}

impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // İlk bayttan talimat varyantını al
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        // Talimat türünü eşle ve varyanta göre kalan baytları ayrıştır
        match variant {
            0 => {
                // InitializeCounter için, kalan baytlardan bir u64 ayrıştır
                let initial_value = u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                );
                Ok(Self::InitializeCounter { initial_value })
            }
            1 => Ok(Self::IncrementCounter), // Ek veri gerekmez
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}

// Yeni bir sayaç hesabını başlat
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Sayaç hesabımızın boyutu
    let account_space = 8; // bir u64 saklamak için byte cinsinden boyut

    // Kira muafiyeti için minimum bakiyeyi hesapla
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Sayaç hesabını oluştur
    invoke(
        &system_instruction::create_account(
            payer_account.key,    // Yeni hesap için ödeme yapan hesap
            counter_account.key,  // Oluşturulacak hesap
            required_lamports,    // Yeni hesaba aktarılacak lamport miktarı
            account_space as u64, // Veri alanı için tahsis edilecek byte cinsinden boyut
            program_id,           // Program sahibi programı ayarla
        ),
        &[
            payer_account.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    // Başlangıç değeri ile yeni bir CounterAccount yapısı oluştur
    let counter_data = CounterAccount {
        count: initial_value,
    };

    // Sayaç hesabının verisine değişken bir referans al
    let mut account_data = &mut counter_account.data.borrow_mut()[..];

    // CounterAccount yapısını hesabın verisine serileştir
    counter_data.serialize(&mut account_data)?;

    msg!("Sayaç değeri ile başlatıldı: {}", initial_value);

    Ok(())
}

// Var olan bir sayacın değerini güncelle
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // Hesap sahipliğini doğrula
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Hesap verisi üzerindeki değişken borçlanma
    let mut data = counter_account.data.borrow_mut();

    // Hesap verisini CounterAccount yapısına ayrıştır
    let mut counter_data: CounterAccount = CounterAccount::try_from_slice(&data)?;

    // Sayaç değerini artır
    counter_data.count = counter_data
        .count
        .checked_add(1)
        .ok_or(ProgramError::InvalidAccountData)?;

    // Güncellenen sayaç verisini tekrar hesaba serileştir
    counter_data.serialize(&mut &mut data[..])?;

    msg!("Sayaç değeri artırıldı: {}", counter_data.count);
    Ok(())
}

// Sayacın verilerini temsil eden yapı
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    count: u64,
}

#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Sayaç hesabımız için adres olarak kullanmak üzere yeni bir anahtar çifti oluştur
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Adım 1: Sayacı başlat
        println!("Sayaç başlatma testi...");

        // Başlatma talimatını oluştur
        let mut init_instruction_data = vec![0]; // 0 = başlatma talimatı
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Başlatma talimatı ile işlemi gönder
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verisini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verisini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Sayaç başarılı bir şekilde başlatıldı, değeri: {}",
                counter.count
            );
        }

        // Adım 2: Sayacı artır
        println!("Sayaç artırma testi...");

        // Artırma talimatını oluştur
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1], // 1 = artırma talimatı
            vec![AccountMeta::new(counter_keypair.pubkey(), true)],
        );

        // Artırma talimatı ile işlemi gönder
        let mut transaction =
            Transaction::new_with_payer(&[increment_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verisini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verisini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 43);
            println!("✅ Sayaç başarılı bir şekilde artırıldı: {}", counter.count);
        }
    }
}
```

```toml filename="Cargo.toml"
[package]
name = "counter_program"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
borsh = "1.5.1"
solana-program = "1.18.26"

[dev-dependencies]
solana-program-test = "1.18.26"
solana-sdk = "1.18.26"
tokio = "1.41.0"
```



***



### Yeni Bir Program Oluştur

Öncelikle, `--lib` bayrağı ile standart `cargo init` komutunu kullanarak yeni bir Rust projesi oluşturun.

```shell filename="Terminal"
cargo init counter_program --lib
```

Proje dizinine gidin. Varsayılan `src/lib.rs` ve `Cargo.toml` dosyalarını görmelisiniz.

```shell filename="Terminal"
cd counter_program
```

Sonra, `solana-program` bağımlılığını ekleyin. Bu, bir Solana programı geliştirmek için gerekli minimum bağımlılıktır.

```shell filename="Terminal"
cargo add solana-program@1.18.26
```

Sonrasında, `Cargo.toml` dosyasına aşağıdaki kesiti ekleyin. Bu konfigürasyonu eklemezseniz, programı derlediğinizde `target/deploy` dizini oluşturulmayacaktır.

```toml filename="Cargo.toml"
[lib]
crate-type = ["cdylib", "lib"]
```

`Cargo.toml` dosyanız aşağıdaki gibi görünmelidir:

```toml filename="Cargo.toml"
[package]
name = "counter_program"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "1.18.26"
```

### Program Giriş Noktası

Bir Solana programı giriş noktası, bir program çağrıldığında çağrılan fonksiyondur. Giriş noktası aşağıdaki ham tanıma sahip olup, geliştiriciler kendi giriş noktası fonksiyonunu oluşturma özgürlüğüne sahiptir.

:::info
Basitlik adına, giriş noktasını tanımlamak için `solana_program` kütüphanesinden bir [`entrypoint!`](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L124-L140) makrosunu kullanabilirsiniz.
:::

```rs
#[no_mangle]
pub unsafe extern "C" fn entrypoint(input: *mut u8) -> u64;
```

`lib.rs` dosyasındaki varsayılan kodu aşağıdaki kod ile değiştirin. Bu kesit:

1. Gerekli bağımlılıkları `solana_program` kütüphanesinden içe aktarır.
2. `entrypoint!` makrosunu kullanarak program girişi tanımlar.
3. Talimatları uygun işleyici fonksiyonlara yönlendirecek `process_instruction` fonksiyonunu uygular.

```rs filename="lib.rs" {13} /process_instruction/
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Program mantığınız
    Ok(())
}
```

`entrypoint!` makrosu, aşağıdaki [tip imzası](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L28-L29) ile bir fonksiyon gerektirir:

```rs
pub type ProcessInstruction =
    fn(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult;
```

Bir Solana programı çağrıldığında, giriş noktası [serileştirir](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L277) girdi verilerini (bayt olarak sağlanan) üç değere ve onları [`process_instruction`](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L132) fonksiyonuna iletir:

- `program_id`: Çağrılan programın genel anahtarı (mevcut program)
- `accounts`: Çağrılan talimat için gereken `AccountInfo` hesapları
- `instruction_data`: Programın yürütmesi gereken talimatı belirtilen ek veriler

Bu üç parametre, bir programı çağırırken istemcilerin sağlaması gereken verilere doğrudan karşılık gelir.

### Program Durumunu Tanımlama

Bir Solana programı geliştirirken, genellikle programınızın durumunu tanımlamaya başlarsınız - hesabında oluşturulan ve sahip olunan veriler.

Program durumu, programınızdaki hesapların veri düzenini temsil eden Rust yapıları kullanılarak tanımlanır. Programınız için farklı türde hesapları temsil eden birden fazla yapı tanımlayabilirsiniz.

Hesaplarla çalışırken, programınızın veri türlerini bir hesap veri alanında saklanan ham baytlara dönüştürmenin bir yoluna ihtiyacınız vardır:

- Serileştirme: Veri türlerinizi bir hesabın veri alanında saklamak için baytlara dönüştürme
- Serisini çözme: Bir hesapta saklanan baytları geri veri türlerinize dönüştürme

Solana program geliştirmeleri için herhangi bir serileştirme formatını kullanabilirsiniz, ancak [Borsh](https://borsh.io/) yaygın olarak kullanılır. Solana programınızda Borsh'u kullanmak için:

1. `Cargo.toml` dosyanıza `borsh` kütüphanesini bağımlılık olarak ekleyin:

```shell filename="Terminal"
cargo add borsh
```

2. Borsh yapılarını içe aktarın ve yapılarınız için bu traitleri uygulamak üzere derleme makrosunu kullanın:

```rust
use borsh::{BorshSerialize, BorshDeserialize};

// Sayacın verilerini temsil eden yapıyı tanımlayın
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    count: u64,
}
```

`lib.rs` dosyasına `CounterAccount` yapısını ekleyerek program durumu tanımlayın. Bu yapı, hem başlatma hem de artırma talimatlarında kullanılacaktır.

```rs filename="lib.rs" {12} {25-29}
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};
use borsh::{BorshSerialize, BorshDeserialize};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Program mantığınız
    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    count: u64,
}
```

### Talimatları Tanımlama

Talimatlar, Solana programınızın gerçekleştirebileceği farklı işlemleri ifade eder. Bunları programınıza etkileşimde bulunan kullanıcıların alabileceği eylemleri tanımlayan genel API'ler olarak düşünebilirsiniz.

Talimatlar genellikle her bir talimatı temsil eden farklı bir Rust enum'u kullanarak tanımlanır; burada:

- Her enum varyantı farklı bir talimatı temsil eder
- Varyantın yükü, talimatın parametrelerini temsil eder

Rust enum varyantlarının varsayılan olarak 0'dan başlayarak numaralandığını unutmayın.

:::tip
Aşağıda, iki talimatı tanımlayan bir enum örneği bulunmaktadır:
:::

```rust
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    InitializeCounter { initial_value: u64 }, // varyant 0
    IncrementCounter,                         // varyant 1
}
```

Bir istemci programınızı çağırdığında, talimat verilerini (bir dizi bayt olarak) sağlamalıdır; burada:

- İlk byte, hangi talimat varyantının yürütüleceğini belirler (0, 1, vb.)
- Kalan baytlar, serileştirilmiş talimat parametrelerini içerir (gerekirse)

Talimat verilerini (baytları) bir enum varyantına dönüştürmek için, yardımcı bir metot uygulamak yaygın bir uygulamadır. Bu metot:

1. İlk byte'i bölerek talimat varyantını alır
2. Varyanta göre eşleştirme yapar ve geri kalan baytlardan ek parametreleri ayrıştırır
3. Karşılık gelen enum varyantını döndürür

Örneğin, `CounterInstruction` enum'u için `unpack` metodu:

```rust
impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // İlk bayttan talimat varyantını al
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        // Talimat türünü eşle ve varyanta göre kalan baytları ayrıştır
        match variant {
            0 => {
                // InitializeCounter için, kalan baytlardan bir u64 ayrıştır
                let initial_value = u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                );
                Ok(Self::InitializeCounter { initial_value })
            }
            1 => Ok(Self::IncrementCounter), // Ek veri gerekmez
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
```

Sayacın programı için talimatları tanımlamak üzere aşağıdaki kodu `lib.rs` dosyasına ekleyin.

```rs filename="lib.rs" {18-46}
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg,
    program_error::ProgramError, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Program mantığınız
    Ok(())
}

# Counter Program

## Frequency Guidelines
- Maximum 5 enhancement features per 2000 characters
- Distribute features evenly throughout the content
- Only add where they significantly improve understanding

## 1. CounterInstruction Enum

```rust
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    InitializeCounter { initial_value: u64 }, // varyant 0
    IncrementCounter,                         // varyant 1
}

impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result {
        // İlk byte'dan talimat varyantını al
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        // Talimat türünü eşleştir ve varyanta göre kalan byte'ları ayrıştır
        match variant {
            0 => {
                // InitializeCounter için, kalan byte'lardan bir u64 ayrıştır
                let initial_value = u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                );

                Ok(Self::InitializeCounter { initial_value })            
            }
            1 => Ok(Self::IncrementCounter), // Ek bilgiye gerek yok
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
```

---

## Talimat İşleyicileri

Talimat işleyicileri, her talimat için iş mantığını içeren fonksiyonlara atıfta bulunur. İşleyici fonksiyonları genellikle `process_` olarak adlandırılır, ancak herhangi bir adlandırma kuralını seçmekte özgürsünüz.

Aşağıdaki kodu `lib.rs` dosyasına ekleyin. Bu kod, önceki adımda tanımlanan `CounterInstruction` enum'ını ve `unpack` metodunu kullanarak gelen talimatları uygun işleyici fonksiyonlara yönlendirecektir:

```rust filename="lib.rs" {8-17} {20-32} /process_initialize_counter/1 /process_increment_counter/1
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Talimat verisini ayrıştır
    let instruction = CounterInstruction::unpack(instruction_data)?;

    // Talimat türünü eşleştir
    match instruction {
        CounterInstruction::InitializeCounter { initial_value } => {
            process_initialize_counter(program_id, accounts, initial_value)?
        }
        CounterInstruction::IncrementCounter => process_increment_counter(program_id, accounts)?,
    };
}

fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    // Uygulama detayları...
    Ok(())
}

fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    // Uygulama detayları...
    Ok(())
}
```

---

### process_initialize_counter Açıklama



`process_initialize_counter` fonksiyonu üç hesaba ihtiyaç duyar:

1. Oluşturulup başlatılacak sayaç hesabı
2. Yeni hesabın oluşturulması için fonlayacak olan hesap
3. Yeni hesabı oluşturmak için çağırdığımız Sistem Programı

Talimata gereken hesapları tanımlamak için `accounts` dilimi üzerinde bir iteratör oluşturur ve her bir hesap için `next_account_info` fonksiyonunu kullanırız. Belirttiğiniz hesap sayısı, talimatın gerektirdiği hesaplar olmalıdır.

Hesapların sırası önemlidir - istemci tarafında talimat oluştururken hesaplar programda tanımlandığı sırayla sağlanmalıdır ki talimat başarıyla çalışsın.

Hesapların değişken isimlerinin programın işlevselliği üzerinde bir etkisi olmasa da, tanımlayıcı isimlerin kullanılması önerilir.

```rust filename="lib.rs" {6-10}
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    Ok(())
}
```

---

### Hesap Oluşturma

Bir hesap oluşturulmadan önce, şunları yapmamız gerekiyor:

1. Hesabın veri alanı için ayrılacak alanı (bayt cinsinden) belirtin. **Bir u64 değeri** depozito alanı olarak 8 byte alacaktır.
2. Minimum "kira" bakiyesini hesaplayın. Solana'da, hesapların hesapta saklanan verilere göre belirli bir minimum bakiyeyi (kira) koruması gerekir.

```rust filename="lib.rs" {12-17}
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Sayaç hesabımızın boyutu
    let account_space = 8; // Bir u64 depolamak için bayt cinsinden boyut

    // Kira muafiyeti için minimum bakiyeyi hesapla
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    Ok(())
}
```

---

### Hesap Oluşturma Adımları

Alan tanımlandıktan ve kira hesaplandığında, hesabı oluşturmak için Sistem Programı'nın `create_account` talimatını çağırın.

```rust filename="lib.rs" {19-33}
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Sayaç hesabımızın boyutu
    let account_space = 8; // Bir u64 depolamak için bayt cinsinden boyut

    // Kira muafiyeti için minimum bakiyeyi hesapla
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Sayaç hesabını oluştur
    invoke(
        &system_instruction::create_account(
            payer_account.key,    // Yeni hesap için ödeme yapacak hesap
            counter_account.key,  // Oluşturulacak hesap
            required_lamports,    // Yeni hesaba transfer edilecek lamport miktarı
            account_space as u64, // Veri alanı için ayrılacak bayt cinsinden boyut
            program_id,           // Program sahibini programımıza ayarlayın
        ),
        &[
            payer_account.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    Ok(())
}
```

---

### First Counter Account Initialization

Hesap oluşturulduktan sonra, hesap verilerini başlatmak için şunları yaparız:

1. **Talimata geçirilen** `initial_value` ile yeni bir `CounterAccount` yapısı oluşturun.
2. Yeni hesabın veri alanına değişken bir referans alın.
3. `CounterAccount` yapısını hesabın veri alanına seri hale getirerek `initial_value` değerini hesabın üzerinde depolarız.

```rust filename="lib.rs" {35-44} /initial_value/
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Sayaç hesabımızın boyutu
    let account_space = 8; // Bir u64 depolamak için bayt cinsinden boyut

    // Kira muafiyeti için minimum bakiyeyi hesapla
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Sayaç hesabını oluştur
    invoke(
        &system_instruction::create_account(
            payer_account.key,    // Yeni hesap için ödeme yapacak hesap
            counter_account.key,  // Oluşturulacak hesap
            required_lamports,    // Yeni hesaba transfer edilecek lamport miktarı
            account_space as u64, // Veri alanı için ayrılacak bayt cinsinden boyut
            program_id,           // Program sahibini programımıza ayarlayın
        ),
        &[
            payer_account.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    // Başlangıç değeri ile yeni bir CounterAccount yapısını oluştur
    let counter_data = CounterAccount {
        count: initial_value,
    };

    // Sayaç hesabının verilerine değişken bir referans al
    let mut account_data = &mut counter_account.data.borrow_mut()[..];

    // CounterAccount yapısını hesabın verisine seri hale getir
    counter_data.serialize(&mut account_data)?;

    msg!("Sayaç değeri ile başlatıldı: {}", initial_value);

    Ok(())
}
```

---

### process_increment_counter Fonksiyonu

Sonraki adım olarak `process_increment_counter` fonksiyonunun implementasyonunu ekleyin. Bu talimat mevcut bir sayaç hesabının değerini artırır.



`process_initialize_counter` fonksiyonu gibi, hesaplar üzerinde bir iteratör oluşturarak başlıyoruz. Bu durumda yalnızca güncellenmesi beklenen bir hesap vardır.

Bir geliştiricinin, programa geçirilen hesapları doğrulamak için çeşitli güvenlik kontrolleri uygulaması gerektiğini unutmayın. Çünkü tüm hesaplar talimatı çağıran tarafından sağlanır, bu nedenle sağlanan hesapların programın beklediği hesaplar olduğu garantisi yoktur. Hesap doğrulama kontrollerinin eksik olması, programın güvenlik açıklarının yaygın bir kaynağıdır.

Aşağıdaki örnek, `counter_account` olarak bahsettiğimiz hesabın yürütülen program tarafından sahip olunduğunu doğrulamak için bir kontrol içerir.

```rust filename="lib.rs" {6-9}
// Mevcut bir sayacın değerini artır
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // Hesap sahipliğini doğrula
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    Ok(())
}
```

---

### Hesap Verilerini Güncelleme

Hesap verilerini güncellemek için:

- Mevcut hesabın veri alanını değişken olarak ödünç alın
- Ham byte'ları `CounterAccount` yapımıza ayrıştırın
- `count` değerini güncelleyin
- Değiştirilen yapıyı tekrar hesabın veri alanına seri hale getirin

```rust filename="lib.rs" {11-24}
// Mevcut bir sayacın değerini artır
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // Hesap sahipliğini doğrula
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Hesap verisini değişken olarak ödünç al
    let mut data = counter_account.data.borrow_mut();

    // Hesap verisini CounterAccount yapımıza ayrıştır
    let mut counter_data: CounterAccount = CounterAccount::try_from_slice(&data)?;

    // Sayaç değerini artır
    counter_data.count = counter_data
        .count
        .checked_add(1)
        .ok_or(ProgramError::InvalidAccountData)?;

    // Güncellenmiş sayaç verisini tekrar hesabın içinde sakla
    counter_data.serialize(&mut &mut data[..])?;

    msg!("Sayaç değeri artırıldı: {}", counter_data.count);
    Ok(())
}
```

---

### Talimat Testi

Program talimatlarını test etmek için, aşağıdaki bağımlılıkları `Cargo.toml` dosyasına ekleyin.

```shell filename="Terminal"
cargo add solana-program-test@1.18.26 --dev
cargo add solana-sdk@1.18.26 --dev
cargo add tokio --dev
```

Ardından `lib.rs` dosyasına aşağıdaki test modülünü ekleyin ve testleri yürütmek için `cargo test-sbf` komutunu çalıştırın. İsteğe bağlı olarak, çıktıdaki print ifadelerini görmek için `--nocapture` bayrağını kullanın.

```shell filename="Terminal"
cargo test-sbf -- --nocapture
```


Öncelikle, test modülünü kurun ve gerekli bağımlılıkları ekleyin:

```rust filename="lib.rs"
#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        // Test kodu buraya gelecek
    }
}
```

Ardından, `ProgramTest` kullanarak testi ayarlayın. Sonra, başlatacağımız sayaç hesabının adresi olarak kullanmak için yeni bir anahtar çiftini oluşturun ve sayaç için belirleyeceğimiz başlangıç değerini tanımlayın.

```rust filename="lib.rs"
```


# [cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Sayac hesabımızın adresi olarak kullanmak için yeni bir anahtar çifti oluşturun
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Adım 1: Sayacı başlat
        println!("Sayacı başlatma testi...");

        // Başlatma talimatı oluştur
        let mut init_instruction_data = vec![0]; // 0 = başlatma talimatı
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Başlatma talimatıyla işlem gönder
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verilerini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verilerini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Sayaç başarıyla {} değeri ile başlatıldı",
                counter.count
            );
        }

        // Adım 2: Sayacı artır
        println!("Sayacı artırma testi...");

        // Artırma talimatı oluştur
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1], // 1 = artırma talimatı
            vec![AccountMeta::new(counter_keypair.pubkey(), true)],
        );

        // Artırma talimatıyla işlem gönder
        let mut transaction =
            Transaction::new_with_payer(&[increment_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verilerini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verilerini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 43);
            println!("✅ Sayaç başarıyla {} değerine artırıldı", counter.count);
        }
    }
}

---

Hesap oluştururken, her hesap [`AccountMeta`](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/instruction.rs#L539-L545) olarak sağlanmalıdır; bu da şunları belirtir:

- Hesabın genel anahtarı (`Pubkey`)
- `is_writable`: Hesap verilerinin değişip değişmeyeceği
- `is_signer`: Hesabın işlemi imzalayıp imzalamayacağı

```rs
AccountMeta::new(account1_pubkey, true),           // yazılabilir, imzalayıcı
AccountMeta::new(account2_pubkey, false),          // yazılabilir, imzalayıcı değil
AccountMeta::new_readonly(account3_pubkey, false), // yazılamaz, imzalayıcı değil
AccountMeta::new_readonly(account4_pubkey, true),  // yazılabilir, imzalayıcı
```

:::tip
Başlatma talimatını test etmek için:

- 0 varyantı (`InitializeCounter`) ve başlangıç değeri ile talimat verisi oluşturun
- Program kimliği, talimat verisi ve gerekli hesaplarla talimat oluşturun
- Başlatma talimatıyla bir işlem gönderin
- Hesabın doğru başlangıç değeri ile oluşturulduğunu kontrol edin
:::

```rs filename="lib.rs" {16-53}
    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Sayac hesabımızın adresi olarak kullanmak için yeni bir anahtar çifti oluşturun
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Adım 1: Sayacı başlat
        println!("Sayacı başlatma testi...");

        // Başlatma talimatı oluştur
        let mut init_instruction_data = vec![0]; // 0 = başlatma talimatı
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Başlatma talimatıyla işlem gönder
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verilerini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verilerini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Sayaç başarıyla {} değeri ile başlatıldı",
                counter.count
            );
        }

        // Adım 2: Sayacı artır
        println!("Sayacı artırma testi...");

        // Artırma talimatı oluştur
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1], // 1 = artırma talimatı
            vec![AccountMeta::new(counter_keypair.pubkey(), true)],
        );

        // Artırma talimatıyla işlem gönder
        let mut transaction =
            Transaction::new_with_payer(&[increment_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verilerini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verilerini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 43);
            println!("✅ Sayaç başarıyla {} değerine artırıldı", counter.count);
        }
    }
```

---

Artırma talimatını test etmek için:

- Program kimliği, talimat verisi ve gerekli hesaplarla talimat oluşturun
- Artırma talimatıyla bir işlem gönderin
- Hesabın doğru değere artırıldığını kontrol edin

:::info
Artırma talimatının veri kümesi `[1]` olup, 1 varyantına (`IncrementCounter`) karşılık gelir. Artırma talimatı için ekstra parametre olmadığından, veri yalnızca talimat varyantıdır.
:::

```rs filename="lib.rs" {55-82}
    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Sayac hesabımızın adresi olarak kullanmak için yeni bir anahtar çifti oluşturun
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Adım 1: Sayacı başlat
        println!("Sayacı başlatma testi...");

        // Başlatma talimatı oluştur
        let mut init_instruction_data = vec![0]; // 0 = başlatma talimatı
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Başlatma talimatıyla işlem gönder
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verilerini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verilerini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Sayaç başarıyla {} değeri ile başlatıldı",
                counter.count
            );
        }

        // Adım 2: Sayacı artır
        println!("Sayacı artırma testi...");

        // Artırma talimatı oluştur
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1], // 1 = artırma talimatı
            vec![AccountMeta::new(counter_keypair.pubkey(), true)],
        );

        // Artırma talimatıyla işlem gönder
        let mut transaction =
            Transaction::new_with_payer(&[increment_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Hesap verilerini kontrol et
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Sayaç hesabını almakta başarısız oldu");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Sayaç verilerini ayrıştırmada başarısız oldu");
            assert_eq!(counter.count, 43);
            println!("✅ Sayaç başarıyla {} değerine artırıldı", counter.count);
        }
    }
```

---

```shell filename="Terminal" {6} {10}
running 1 test
[2024-10-29T20:51:13.783708000Z INFO  solana_program_test] "counter_program" SBF program from /counter_program/target/deploy/counter_program.so, modified 2 seconds, 169 ms, 153 µs and 461 ns ago
[2024-10-29T20:51:13.855204000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-29T20:51:13.856052000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111111 invoke [2]
[2024-10-29T20:51:13.856135000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111111 success
[2024-10-29T20:51:13.856242000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Sayaç değeri: 42 ile başlatıldı
[2024-10-29T20:51:13.856285000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 3791 of 200000 compute units
[2024-10-29T20:51:13.856307000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
[2024-10-29T20:51:13.860038000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-29T20:51:13.860333000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Sayaç değeri: 43'e artırıldı
[2024-10-29T20:51:13.860355000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 756 of 200000 compute units
[2024-10-29T20:51:13.860375000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
test test::test_counter_program ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.08s
```