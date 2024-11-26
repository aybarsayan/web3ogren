---
title: Programda hesapları nasıl okunur
sidebarSortOrder: 6
description: "Solana programında hesapları nasıl okuyacağınızı öğrenin."
---

Solana'daki neredeyse tüm talimatlar en az **2 - 3** hesabı gerektirir ve bu hesaplar, talimat işleyicileri üzerinde hangi sırayı beklendiğini belirtir. Hesapları manuel olarak dizinlemek yerine Rust'taki `iter()` metodundan faydalanırsak, bu oldukça basit olur. 

:::tip
`next_account_info` metodu temelde iterable'ın ilk indeksini dilimleyerek hesaplar dizisinde bulunan hesabı döndürmektedir.
:::

Bir grup hesap bekleyen ve her birini çözümlememiz gereken basit bir talimatı görelim.

```rust filename="read-accounts.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct HelloState {
    is_initialized: bool,
}

// Gerekli Hesaplar
/// 1. [imza atan] Payer
/// 2. [yazılabilir] Hello durumu hesabı
/// 3. [] Kira hesabı
/// 4. [] Sistem Programı
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    // Tüm hesapları bir iterator olarak almak (for döngüleri ve iterasyonlar için kolaylaştırma)
    let accounts_iter = &mut accounts.iter();
    // Payer hesabı
    let payer_account = next_account_info(accounts_iter)?;
    // Hello durumu hesabı
    let hello_state_account = next_account_info(accounts_iter)?;
    // Kira hesabı
    let rent_account = next_account_info(accounts_iter)?;
    // Sistem Programı
    let system_program = next_account_info(accounts_iter)?;

    Ok(())
}
```

:::info
Bu yapı, hesapları daha etkili bir şekilde çözümlenmesine olanak tanır ve kodun okunabilirliğini artırır.
:::

### Hesapların Anlaşılması

Aşağıdaki bilgileri aklınızda bulundurmalısınız:

- **Payer** hesabı, diğer hesapların oluşturulmasında ve işlemlerinin gerçekleştirilmesinde kullanılır.
- **Hello durumu** hesabı, programınızın iç durumunu saklar.
- **Kira hesabı**, hesapların yapılan işlemler için gerekli kaynakların sağlanmasını garantiler.
- **Sistem Programı**, Solana'nın temel işlevlerini sağlar.

:::note
Hesapların düzenli bir şekilde yönetilmesi, programınızın hatasız çalışmasını sağlamak için kritik öneme sahiptir.
:::

```rust
// Örnek kullanım
let payer_account = next_account_info(accounts_iter)?;
```

:::warning
Herhangi bir hesap için kodda hatalı bir başvuru yapılması durumu, çalışma zamanında hata almanıza sebep olabilir.
:::