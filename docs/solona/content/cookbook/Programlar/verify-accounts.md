---
title: Solana programında hesapları nasıl doğrularız
sidebarSortOrder: 6
description: "Solana programında hesapları nasıl doğrulayacağınızı öğrenin."
---

Solana'daki programlar durumdan bağımsız olduğu için, program oluşturucu olarak geçilen hesapların mümkün olduğunca **doğrulanmasını** sağlamak zorundayız. Bu, kötü niyetli hesap girişlerini engelleyebilmemiz için önemlidir. Yapılabilecek temel kontroller şunlardır:

1. Beklenen imza hesabının gerçekten imzalayıp imzalamadığını kontrol et
2. Beklenen durum hesabının yazılabilir olarak kontrol edilip edilmediğini kontrol et
3. Beklenen durum hesabının sahibinin çağrılan program kimliği olup olmadığını kontrol et
4. Durum ilk kez başlatılıyorsa, hesabın daha önce başlatılıp başlatılmadığını kontrol et
5. Geçilen herhangi bir çapraz program kimliğinin (gerektiğinde) beklendiği gibi olup olmadığını kontrol et

:::tip
**Öneri:** Hesap doğrulama sürecinde tüm bu kontrolleri uygulamak, programınızın güvenliğini artıracaktır.
:::

Aşağıda, yukarıda belirtilen kontrollerle birlikte bir kahraman durum hesabını başlatan temel bir talimat tanımlanmaktadır:

```rust filename="verify-accounts.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_program::ID as SYSTEM_PROGRAM_ID,
    sysvar::Sysvar,
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct HelloState {
    is_initialized: bool,
}

// Gerekli hesaplar
/// 1. [imza] Ödeme yapan
/// 2. [yazılabilir] Merhaba durum hesabı
/// 3. [] Sistem Programı
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    // Ödeme yapan hesap
    let payer_account = next_account_info(accounts_iter)?;
    // Merhaba durum hesabı
    let hello_state_account = next_account_info(accounts_iter)?;
    // Sistem Programı
    let system_program = next_account_info(accounts_iter)?;

    let rent = Rent::get()?;

    // Ödeme yapan hesabın imzalayıcı olup olmadığını kontrol et
    if !payer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Merhaba durum hesabının kira muaf olup olmadığını kontrol et
    if !rent.is_exempt(hello_state_account.lamports(), 1) {
        return Err(ProgramError::AccountNotRentExempt);
    }

    // Merhaba durum hesabının yazılabilir olup olmadığını kontrol et
    if !hello_state_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    // Merhaba durum hesabının sahibinin mevcut program olup olmadığını kontrol et
    if hello_state_account.owner.ne(&program_id) {
        return Err(ProgramError::IllegalOwner);
    }

    // Sistem programının geçerli olup olmadığını kontrol et
    if system_program.key.ne(&SYSTEM_PROGRAM_ID) {
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut hello_state = HelloState::try_from_slice(&hello_state_account.data.borrow())?;

    // Durumun daha önce başlatılıp başlatılmadığını kontrol et
    if hello_state.is_initialized {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    hello_state.is_initialized = true;
    hello_state.serialize(&mut &mut hello_state_account.data.borrow_mut()[..])?;
    msg!("Hesap başlatıldı :)");

    Ok(())
}
```

:::note
**İlginç Bilgi:** Programda bir hesabın daha önce başlatılıp başlatılmadığını kontrol etmek, kaynakların doğru bir şekilde yönetilmesini sağlayarak maliyetlerin düşmesine yardımcı olur.
:::

---