---
title: PDA Hesabı ile Nasıl İmzalanır
sidebarSortOrder: 4
description:
  "Program Türetilmiş Adreslerinde hesapların ana özelliği, programların bu hesapları kullanarak imza atabilmesidir. Solana'da PDA hesapları ile nasıl imzalanacağını öğrenin."
---

Program türetilmiş adresleri (PDA), programların sahip olduğu ve imza atabilen hesaplar oluşturmak için kullanılabilir. Bu, bir programın bir token hesabına sahip olmasını ve tokenları bir hesaptan diğerine transfer etmesini istediğinizde yararlıdır.

:::info
**Not:** PDA hesapları, programın yürütülmesi sırasında imza atan hesaplar oluşturmada kritik öneme sahiptir.
:::

```rust filename="sign-with-pda.rs" {22-34}
use solana_program::{
    account_info::next_account_info, account_info::AccountInfo, entrypoint,
    entrypoint::ProgramResult, program::invoke_signed, pubkey::Pubkey, system_instruction,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();

    let pda_account_info = next_account_info(account_info_iter)?;
    let to_account_info = next_account_info(account_info_iter)?;
    let system_program_account_info = next_account_info(account_info_iter)?;

    // hesap bütçesini kaydetmek için bump seed'i geç
    let bump_seed = instruction_data[0];

    invoke_signed(
        &system_instruction::transfer(
            &pda_account_info.key,
            &to_account_info.key,
            100_000_000, // 0.1 SOL
        ),
        &[
            pda_account_info.clone(),
            to_account_info.clone(),
            system_program_account_info.clone(),
        ],
        &[&[b"escrow", &[bump_seed]]],
    )?;

    Ok(())
}
```

:::tip
**Helpful Hint:** PDA'lar ile çalışırken her zaman uygun `bump seed` değerini kullandığınızdan emin olun. Bu, işlemlerinizin güvenliğini artırır.
:::

### PDA Hesabının Kullanılması

PDA hesabını imzalamak için aşağıdaki adımları takip edebilirsiniz:

1. **Hesap Bilgilerini Alma:** Öncelikle, gerekli hesap bilgilerini (PDA, hedef hesap ve sistem programı) almanız gerekir.
2. **Bump Seed Değerini Belirleme:** Hesap bütçesini kaydetmek için bump seed değerini geçmelisiniz.
3. **İşlemi Gerçekleştirme:** `invoke_signed` fonksiyonu ile işlemi gerçekleştirin.

:::warning
**Dikkat:** PDA hesapları yanlış kullanıldığında, fonksiyonlarınız beklenmedik şekilde sonuçlanabilir.
:::

### Ek Bilgiler


Daha Fazla Bilgi

PDA'lar, token dönüşümlerinde kullanılabilir ve doğru bir şekilde imzalanmadıklarında işlemlerinizi etkileyebilir.



> "Program, PDA hesaplarını kullanarak güvenli ve verimli token transferleri gerçekleştirebilir."  
> — Solana Program Geliştiricisi