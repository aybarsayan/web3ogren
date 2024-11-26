---
date: Feb 29, 2024
difficulty: intermediate
title: "CosmWasm Akıllı Sözleşmelerden Solana Programlarına"
description: "CosmWasm deneyimi ile Solana Programları yazmayı öğrenin"
tags:
  - rust
keywords:
  - yerel rust
  - solana
  - CosmWasm
  - akıllı sözleşmeler
  - solana geliştirmeye giriş
  - blockchain geliştirici
  - blockchain eğitimi
  - web3 geliştirici
---

CosmWasm ve Solana akıllı sözleşmeleri arasındaki farkları öğrenin.

**CosmWasm**

- Çalışma Ortamı: Blok zincirleri arasında etkileşim için tasarlanmış Cosmos SDK üzerinde çalışır.
- Durum Yönetimi: Durumu saklamak ve geri almak için `cosmwasm_storage` kullanır.
- Giriş Noktaları: Başlatma, yürütme ve sorgulama için ayrı giriş noktaları.
- Mesajlar: Sözleşme etkileşimlerini tanımlamak için `InstantiateMsg`, `ExecuteMsg` ve `QueryMsg` kullanır.

**Solana**

- Çalışma Ortamı: Yüksek verim ve düşük gecikme için optimize edilmiş Solana blok zincirinde çalışır.
- Durum Yönetimi: Hesaplarda saklanan durumun seri hale getirilmesi ve geri alınması için öncelikle `Borsh` kullanır. Solana, verimliliği nedeniyle Borsh'ü önermektedir, ancak geliştiriciler istenirse bincode gibi diğer seri hale getirme formatlarını da kullanabilir.
- Giriş Noktası: Tüm talimatları yöneten tek bir giriş noktası (process_instruction).
- Talimatlar: Genellikle bayt dizileri olarak kodlanmış özel tanımlı talimatlar kullanılarak işlenir. Talimatların akıllı sözleşme içinde açık bir şekilde tanımlanması ve işlenmesi gerekir.

## Durum Yönetimi

CosmWasm'de durum, Cosmos SDK tarafından yönetilen akıllı sözleşmenin depolamasında saklanır. Bu sözleşme, `cosmwasm-storage` tarafından sağlanan yardımcı fonksiyonlar aracılığıyla bu depolama ile etkileşimde bulunur. Bu depolama, blok zinciri durumunun bir parçasıdır ve her sözleşme örneğine özeldir. Durum değişkenleri genellikle bir `state.rs` dosyasında tanımlanır ve `serde` kullanılarak seri hale getirilir/geri alınır. Durum yönetimi fonksiyonları, sözleşme mantığında depolamadan okuma ve yazma işlemleri için kullanılır.

Buna karşılık, Solana programları, yürütme sırasında programa geçirilmiş belirli hesapların verileriyle etkileşimde bulunarak durumu yönetir. Bu hesaplar, Sistem Programı tarafından oluşturulabilir ve verileri saklamak için belirli bir miktar alan tahsis edilir. Bu hesaplardaki durum, Borsh gibi kitaplıklar kullanılarak seri hale getirilir ve geri alınır. Solana programları, hesap verilerini durum bilgisi olarak yorumlamaktan, bu hesaplardan doğrudan yazma ve okuma işlemlerini gerçekleştirmekten sorumludur.

:::note
Solana'daki hesapların temel kavramı, durum yönetimini anlamak ve Solana programlarını etkili bir şekilde tasarlamak için gereklidir. Solana'daki her hesap, belirli bir program (akıllı sözleşme) ile ilişkilendirilebilir ve yalnızca sahibi olan program durumunu değiştirebilir. Bu model, durumun akıllı sözleşmenin kendisi aracılığıyla daha doğrudan yönetildiği birçok diğer blok zinciri platformundan önemli ölçüde farklıdır.
:::

Solana Hesap Modeli hakkında detaylı bilgi için Solana belgelerine [buradan](https://solana.com/docs/core/accounts) bakabilirsiniz.

---

### Temel Farklar

1. Depolama Soyutlaması:
   - **CosmWasm**: Durumu yönetmek için `cosmwasm_storage` gibi soyutlamalar kullanır. Sözleşme, Cosmos SDK tarafından sağlanan bir anahtar-değer depolama sistemi ile etkileşimde bulunur.
   - **Solana**: Hesap verilerinden doğrudan okur ve yazar, bu hesapların durumu Solana blok zincirinin bir parçasıdır.
   
2. Seri Hale Getirme:
   - **CosmWasm**: Interoperabilite ve insan okunabilirliği için JSON karışımı ve durum saklaması için bincode gibi ikili formatlar kullanır.
   - **Solana**: Yüksek verimli bir ortamda hız ve tutarlılığı sağlamak için tüm seri hale getirme amaçları için tipik olarak Borsh kullanır, ancak isteğe bağlı olarak kendi seçiminizi yapabilirsiniz.
   
3. Durum Konumu:
   - **CosmWasm**: Durum, Cosmos SDK tarafından yönetilen sözleşmenin depolamasında saklanır.
   - **Solana**: Durum, yürütme sırasında programa geçirilen hesap verilerinde saklanır.
   
4. Erişim Desenleri:
   - **CosmWasm**: Durum, CosmWasm tarafından sağlanan depolama API'leri aracılığıyla erişilir.
   - **Solana**: Durum, hesapların verilerini doğrudan manipüle ederek erişilir.

---

### CosmWasm Durum Yönetimini Solana'ya Dönüştürme

#### Adım 1: Hesap Durumunu Tanımlama

Solana'da durum, hesaplarda saklanır. Durum yapısını tanımlayın ve Borsh kullanarak yönetim yapın.

**CosmWasm Durum Tanımı**

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct State {
    pub count: u32,
}
```

**Solana Durum Tanımı**

```rust
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterState {
    pub count: u32,
}
```

---

#### Adım 2: Durumu Okuma ve Yazma

Solana'da durum, program mantığında hesap verilerinden okunur ve yazılır.

```rust
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, program_error::ProgramError, pubkey::Pubkey,
};
use borsh::BorshDeserialize;
use std::convert::TryInto;

pub fn process_increment(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let counter_account = next_account_info(account_info_iter)?;

    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut counter_data = Counter::try_from_slice(&counter_account.data.borrow())?;
    counter_data.count += 1;
    counter_data.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;

    Ok(())
}
```

---

## Giriş Noktaları

CosmWasm, farklı türdeki işlemler için ayrı giriş noktaları (başlatma, yürütme, sorgulama) ile modüler bir yaklaşım sunar. Solana, tüm talimat türleri için bir tek giriş noktası (process_instruction) kullanır ve bu, ince ayrıntılı kontrol sağlar.

### Temel Farklar

1. Giriş noktası yapısı
   - CosmWasm'de, her giriş noktası genellikle Rust'ta `#[entry_point]` niteliği ile tanımlanan ayrı bir fonksiyon olarak tanımlanır.
   - Solana'da, program içten talimat verisini temel alarak uygun işleyiciye yönlendirme yapar.
   
2. Seri Hale Getirme ve Geri Alma
   - CosmWasm sözleşmeleri, mesajın seri hale getirilmesi ve geri alınmasında JSON kullanır, bu da anlamayı ve hata ayıklamayı kolaylaştırır fakat ek yük getirebilir.
   - Solana Programları, talimatlar için ikili seri hale getirmenin daha verimli olması nedeniyle daha hızlı ve depolama açısından daha verimli verimlilik sağlar.
   
3. Hata Yönetimi
   - CosmWasm tipik olarak standart Rust hata yönetim yöntemlerini kullanır ve hatalar sonuç kısmında döndürülür.
   - Solana'nın özel bir program hata seti vardır ve hata yönetimi, talimat işlemesine sıkı bir şekilde bağlıdır. Hataların doğru bir şekilde yayılması, doğru işlem davranışını sağlamak için önemlidir.

---

### CosmWasm Giriş Noktalarını Solana'ya Dönüştürme

**CosmWasm Giriş Noktası Örneği**

```rust
use cosmwasm_std::{entry_point, DepsMut, Env, MessageInfo, Response, StdResult};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    // Başlatma mantığı
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Increment {} => execute_increment(deps, env, info),
        ExecuteMsg::Reset { count } => execute_reset(deps, env, info, count),
    }
}

#[entry_point]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCount {} => query_count(deps),
    }
}
```

**Solana Giriş Noktası Örneği**

```rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
};
use borsh::BorshDeserialize;

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = CounterInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        CounterInstruction::Initialize { count } => {
            process_initialize(accounts, count, program_id)
        }
        CounterInstruction::Increment => process_increment(accounts, program_id),
        CounterInstruction::Reset { count } => process_reset(accounts, count, program_id),
    }
}
```

---

## Mesajlar ve Talimat Yönetimi

CosmWasm mesajları ile Solana program talimatları arasındaki temel farkları anlamak, bu iki ekosistem arasında geçiş yapan geliştiriciler için çok önemlidir.

### Temel Farklar

CosmWasm akıllı sözleşmeleri, farklı etkileşim türlerini işlemek için mesaj tabanlı bir mimari kullanır. Bu mesajlar, bir sözleşmenin gerçekleştirebileceği girişleri ve işlemleri tanımlar.

1. Mesaj Türleri:

   - InstantiateMsg: Sözleşme başlatma parametrelerini tanımlar.
   - ExecuteMsg: Çeşitli sözleşme işlevlerini yürütmek için parametreleri tanımlar.
   - QueryMsg: Sözleşme durumunu değiştirilmeksizin sorgulamak için parametreleri tanımlar.

2. Mesajların Yönetimi:

   - Farklı mesaj türleri için ayrı giriş noktaları: başlatma, yürütme ve sorgulama.
   - Her giriş noktası, belirli mesaj türünü işler ve ilgili mantığı gerçekleştirir.

Solana programları, bir zincir içi programın gerçekleştirebileceği işlemleri tanımlamak için talimatlar kullanır. Bu talimatlar, CosmWasm mesajlarına kıyasla daha ayrıntılı ve düşük seviyededir.

1. Talimat Tanımı:

   - Talimatlar, özel veri yapıları kullanılarak tanımlanır.
   - Genellikle Borsh kullanılarak seri hale getirilir ve geri alınır.

2. Hesap Yönetimi:

   - Talimatlar, programın okuyacağı veya yazacağı hesaplara referanslar içerir.
   - Programın blok zinciri durumunda işlem yapmak için gerekli erişime sahip olmasını sağlar.

---

### Mesajları Talimatlara Dönüştürme

#### Adım 1: Mesajları Talimat Olarak Tanımlama

CosmWasm'de mesajlar yapı ve enum'lar kullanılarak tanımlanır. Solana'da da benzer yapı ve enum'lar talimatları tanımlamak için kullanılacaktır.

**CosmWasm Mesaj Tanımı:**

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg {
    pub count: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ExecuteMsg {
    Increment {},
    Reset { count: u32 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct QueryMsg {
    pub get_count: {},
}
```

**Solana Talimat Tanımları:**

```rust
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    Initialize { count: u32 },
    Increment,
    Reset { count: u32 },
}
```

---

#### Adım 2: Talimat Yönetimini Uygulama

Solana'da her talimat için işleyiciler oluşturun. Bu, her talimatı işlemek ve hesap durumunu güncellemek için mantık yazmayı içerir. Bu, CosmWasm akıllı sözleşmesinde Execute ve Query mesajlarını yönetmeye çok benzer.

**Solana Talimat Yönetimi:**

```rust
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};
use crate::state::CounterState;

pub fn process_initialize(
    accounts: &[AccountInfo],
    count: u32,
    program_id: &Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let counter_account = next_account_info(account_info_iter)?;

    // Hesabın program tarafından sahiplenildiğini doğrula
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut counter_data = CounterState { count };

    // Durumu hesabın içine seri hale getir
    counter_data.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;

    Ok(())
}

pub fn process_increment(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let counter_account = next_account_info(account_info_iter)?;

    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Durumu geri al
    let mut counter_data = CounterState::try_from_slice(&counter_account.data.borrow())?;

    // Sayımı güncelle
    counter_data.count += 1;

    // Güncellenmiş durumu hesabın içine yeniden seri hale getir
    counter_data.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;

    Ok(())
}

pub fn process_reset(
    accounts: &[AccountInfo],
    count: u32,
    program_id: &Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let counter_account = next_account_info(account_info_iter)?;

    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut counter_data = CounterState::try_from_slice(&counter_account.data.borrow())?;

    counter_data.count = count;

    counter_data.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;

    Ok(())
}
```

---

## Solana Programı Avantajları

1. **Performans Verimliliği**:
   - Solana'nın ikili talimat verisi ve doğrudan hesap manipülasyonu, yüksek performans ve düşük gecikme sağlar.
   - Bu, merkezi olmayan borsa (DEX'ler) ve diğer performans duyarlı kullanım durumları gibi yüksek verimlilik gerektiren uygulamalar için kritik öneme sahiptir.
   
2. **İnce Ayrıntılı Kontrol**:
   - Talimat tabanlı yaklaşım, programın yürütülmesi ve durum yönetimi üzerinde ince ayrıntılı kontrol sunar.
   - Geliştiriciler, programlarını düşük seviyede optimize etme imkânına sahip olabilir, bu da daha verimli uygulamalara yol açabilir.
   
3. **Esneklik**:
   - Özel talimatlar, özel kullanım durumlarına uyacak şekilde tasarlanabilir, bu da gelişmiş ve karmaşık işlemler için esneklik sağlar.
   - Bu, oldukça özel mantıkları uygulamak isteyen geliştiriciler için uygundur.

Sonuç olarak, Solana, yüksek performans, düşük gecikme ve yürütme üzerinde ince ayrıntılı kontrol gerektiren uygulamalar için idealdir. Düşük seviyeli programlamada rahat olan ve belirli kullanım durumları için optimize edilmeye ihtiyaç duyan geliştiriciler için daha uygundur.