---
title: Bir Hesabı Kapatma Yöntemi
sidebarSortOrder: 5
description:
  "Bir hesaba artık ihtiyaç duyulmuyorsa, hesabı kapatarak kirayı geri alabilirsiniz. Solana'da hesapları etkili bir şekilde nasıl kapatacağınızı öğrenin."
---

Hesapları kapatmak, hesabı açmak için kullanılan SOL'u geri almanıza olanak tanır, ancak hesabın içindeki tüm bilgilerin silinmesini gerektirir. 

:::info
Bir hesap kapatıldığında, bilgilerin aynı talimat içinde sıfırlanmış olduğundan emin olun; aksi takdirde, insanların aynı işlemde hesabı yeniden açıp verilere erişim sağlamasını engelleyemezsiniz.
:::

Bunun nedeni, işlemin tamamlanana kadar hesabın aslında kapatılmamış olmasıdır.

```rust filename="close-account.rs" {18-25}
use solana_program::{
    account_info::next_account_info, account_info::AccountInfo, entrypoint,
    entrypoint::ProgramResult, pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();

    let source_account_info = next_account_info(account_info_iter)?;
    let dest_account_info = next_account_info(account_info_iter)?;

    let dest_starting_lamports = dest_account_info.lamports();
    **dest_account_info.lamports.borrow_mut() = dest_starting_lamports
        .checked_add(source_account_info.lamports())
        .unwrap();
    **source_account_info.lamports.borrow_mut() = 0;

    source_account_info.assign(&system_program::ID);
    source_account_info.realloc(0, false).map_err(Into::into)

    Ok(())
}
```

:::tip
Hesap kapatma işlemi sırasında, tüm kaynakların doğru bir şekilde transfer edildiğinden emin olun. 
:::

:::warning
Eğer hesabı kapatmayı unutur ve bir işlem yapmaya devam ederseniz, bu durum hesabın kapatılmasını engelleyebilir.
:::


---

### Önemli Notlar

- **İşlem tamamlanmadan hesabı kapatmamak**: Hesap kapatma tamamlanana kadar işlemler üzerinde dikkatli olunmalıdır.
- **Veri silinmesi**: Hesabın içindeki tüm bilgilerin silinmesi gerekmektedir.

:::note
Bu işlem, hesabı kalıcı olarak devre dışı bırakacağı için dikkatle planlanmalıdır. 
:::