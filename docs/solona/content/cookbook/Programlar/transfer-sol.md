---
title: Solana Programında SOL Nasıl Transfer Edilir
sidebarSortOrder: 1
description: "Solana programında SOL transfer etmeyi öğrenin."
---

Solana Programınız, lamportları bir hesaptan diğerine 'System' programını 'çağırmadan' transfer edebilir. Temel kural, programınızın herhangi bir hesabından **sahip olduğu** lamportları, herhangi bir hesabın transfer edebilmesidir.

> **Ana Kural:** Alıcı hesabı _programınızın sahibi olduğu_ bir hesap olmak zorunda değildir.  
> — Solana Geliştirici Kılavuzu

```rust filename="transfer-sol.rs"
/// Bir hesaptan (program sahibi olmalı) başka bir hesaba
/// lamportları transfer eder. Alıcı herhangi bir hesap olabilir
fn transfer_service_fee_lamports(
    from_account: &AccountInfo,
    to_account: &AccountInfo,
    amount_of_lamports: u64,
) -> ProgramResult {
    // Gönderilen hesapta yeterince lamport var mı?
    if **from_account.try_borrow_lamports()? < amount_of_lamports {
        return Err(CustomError::InsufficientFundsForTransaction.into());
    }
    // from_account'tan borç alın ve to_account'a kredi ekleyin
    **from_account.try_borrow_mut_lamports()? -= amount_of_lamports;
    **to_account.try_borrow_mut_lamports()? += amount_of_lamports;
    Ok(())
}

/// Programınıza gönderilen talimata ilişkin ana fonksiyon işleyicisi
fn instruction_handler(accounts: &[AccountInfo]) -> ProgramResult {
    // 'from' ve 'to' hesaplarını alın
    let account_info_iter = &mut accounts.iter();
    let from_account = next_account_info(account_info_iter)?;
    let to_service_account = next_account_info(account_info_iter)?;

    // Bu talimatı yerine getirmek için 5 lamportluk bir hizmet 'ücreti' alın
    transfer_service_fee_lamports(from_account, to_service_account, 5u64)?;

    // Ana talimatı yerine getirin
    // ... vb.

    Ok(())
}
```

:::tip
Eğer **from_account**'ta yeterli lamport yoksa, `InsufficientFundsForTransaction` hatası alırsınız. Bu yüzden, işlemi gerçekleştirmeden önce, mevcut bakiyenizi kontrol etmek iyi bir uygulamadır.
:::

:::info
Bu işlem sırasında, gönderen hesap **program sahibi** olmalıdır; aksi takdirde işlem gerçekleştirilemez.
:::

---

Kod içerisinde kullanılan *fonksiyonlar* ve *işleyiciler* hakkında daha fazla bilgi almak için [Solana Geliştirici Kılavuzu](https://docs.solana.com/) sayfasını inceleyebilirsiniz.

---