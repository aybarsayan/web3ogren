---
title: Birden Fazla Talimat Okuma
sidebarSortOrder: 6
description:
  "Bir Solana programında bir işlemden nasıl birden fazla talimat okunacağını öğrenin."
---

Solana, mevcut işlemdeki tüm talimatlara göz atmamıza olanak tanır. Bunları bir değişkende saklayabilir ve üzerinde döngü yapabiliriz. Bununla birlikte, şüpheli işlemleri kontrol etmek gibi birçok şey yapabiliriz.

:::tip
**Not:** Talimatlar üzerinde döngü yaparken dikkatli olun, aksi takdirde dikkatlice işlenmeyen veri kaybı yaşanabilir.
:::

```rust filename="read-multiple-instructions.rs"
use anchor_lang::{
    prelude::*,
    solana_program::{
        sysvar,
        serialize_utils::{read_pubkey, read_u16}
    }
};

declare_id!("8DJXJRV8DBFjJDYyU9cTHBVK1F1CTCi6JUBDVfyBxqsT");

#[program]
pub mod cookbook {
    use super::*;

    pub fn read_multiple_instruction<'info>(ctx: Context<ReadMultipleInstruction>, creator_bump: u8) -> Result<()> {
        let instruction_sysvar_account = &ctx.accounts.instruction_sysvar_account;

        let instruction_sysvar_account_info = instruction_sysvar_account.to_account_info();

        let id = "8DJXJRV8DBFjJDYyU9cTHBVK1F1CTCi6JUBDVfyBxqsT";

        let instruction_sysvar = instruction_sysvar_account_info.data.borrow();

        let mut idx = 0;

        let num_instructions = read_u16(&mut idx, &instruction_sysvar)
        .map_err(|_| MyError::NoInstructionFound)?;

        for index in 0..num_instructions {
            let mut current = 2 + (index * 2) as usize;
            let start = read_u16(&mut current, &instruction_sysvar).unwrap();

            current = start as usize;
            let num_accounts = read_u16(&mut current, &instruction_sysvar).unwrap();
            current += (num_accounts as usize) * (1 + 32);
            let program_id = read_pubkey(&mut current, &instruction_sysvar).unwrap();

            if program_id != id
            {
                msg!("İşlem program id'si {} olan bir ix içeriyordu", program_id);
                return Err(MyError::SuspiciousTransaction.into());
            }
        }

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(creator_bump:u8)]
pub struct ReadMultipleInstruction<'info> {
    #[account(address = sysvar::instructions::id())]
    instruction_sysvar_account: UncheckedAccount<'info>
}

#[error_code]
pub enum MyError {
    #[msg("Talimat bulunamadı")]
    NoInstructionFound,
    #[msg("Şüpheli işlem tespit edildi")]
    SuspiciousTransaction
}
```

:::info
**İpucu:** İşlemlerdeki talimatları kontrol ederken dikkat ettiğinizden emin olun. Şüpheli işlemler, genellikle beklenmeyen program kimlikleriyle sonuçlanır.
:::

:::note
**Dikkat:** Bu örnekte, yöntemler Rust dili ve Anchor framework kullanılarak oluşturulmuştur. 
:::


Ek bilgi
Bu kod, belirli bir program kimliğine sahip işlemleri kontrol etmek için tasarlanmıştır. Böylece geliştiriciler, yalnızca beklenen işlemlerin çalıştığından emin olabilir.


--- 

**Kısaca,** bir işlemdeki talimatların okunması, güvenlik açısından önemli bir işlemdir. Kullanıcının beklenmeyen verilerle karşılaşmaması için dikkat edilmesi gereken birkaç husus bulunmaktadır.