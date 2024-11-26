---
date: 2024-04-24T00:00:00Z
difficulty: beginner
title: "Solana Programında CPI Nasıl Yapılır"
description:
  "Anchor framework'ünü kullanarak Solana programlarında Cross Program Invocations (CPI) uygulamayı öğrenin"
tags:
  - rust
  - anchor
  - cpi
keywords:
  - öğretici
---

Bu kılavuz, SOL transferini `Cross Program Invocation (CPI)` kullanarak göstermek için `Anchor framework'ünü` kullanmaktadır. Aşağıda, Solana programları okurken veya yazarken karşılaşabileceğiniz üç farklı, ancak işlevsel olarak eşdeğer uygulama bulunmaktadır. İşte [Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi) üzerinde son bir referans programı.

## Başlangıç Kodu

Burada, [Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi-sol-transfer) üzerinde bir başlangıç programı yer almaktadır. `lib.rs` dosyası, tek bir `sol_transfer` talimatını içeren aşağıdaki programı içermektedir.

```rust filename="lib.rs"
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("9AvUNHjxscdkiKQ8tUn12QCMXtcnbR9BVGq3ULNzFMRi");

#[program]
pub mod cpi {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.sender.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        );

        transfer(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
```

:::note
`cpi.test.ts` dosyası, özel `sol_transfer` talimatının nasıl çağrılacağını gösterir ve SolanaFM'deki işlem detaylarına bir bağlantı kaydeder.
:::

```ts filename="cpi.test.ts"
it("SOL Transfer Anchor", async () => {
  const transactionSignature = await program.methods
    .solTransfer(new BN(transferAmount))
    .accounts({
      sender: sender.publicKey,
      recipient: recipient.publicKey,
    })
    .rpc();

  console.log(
    `\nTransaction Signature:` +
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

İşlem detaylarında, özel programın öncelikle çağrıldığını (talimat 1), ardından Sistem Programı'nın (talimat 1.1) çağrıldığını gösterir ve sonuçta başarılı bir SOL transferi gerçekleştirilir.

![İşlem Detayları](../../../images/solana/public/assets/docs/core/cpi/transaction-details.png)

Bu örneği Playground üzerinde derleyip, dağıtarak test edebilir ve [SolanaFM keşif aracı](https://solana.fm/) üzerinden işlem detaylarını görüntüleyebilirsiniz.

## Anchor ile CPI Nasıl Yapılır

Başlangıç kodunda, `SolTransfer` yapısı, transfer talimatı için gerekli olan hesapları belirtmektedir.

```rust /sender/ /recipient/ /system_program/
#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
```

### Anchor CpiContext

Başlangıç kodunda yer alan `sol_transfer` talimatı, CPI oluşturmanın tipik bir yaklaşımını göstermektedir ve [Anchor framework'ü](https://www.anchor-lang.com/) kullanılmaktadır.

:::info
Bu yaklaşım, çağrılan talimata gereken `program_id` ve hesapları içeren bir [`CpiContext`](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html) oluşturmayı ve ardından belirli bir talimatı çağırmak için (`transfer`) bir yardımcı fonksiyon kullanmayı içerir.
:::

```rust
use anchor_lang::system_program::{transfer, Transfer};
```

```rust /cpi_context/ {14}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.sender.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let cpi_context = CpiContext::new(
        program_id,
        Transfer {
            from: from_pubkey,
            to: to_pubkey,
        },
    );

    transfer(cpi_context, amount)?;
    Ok(())
}
```

`cpi_context` değişkeni, transfer talimatı için gereken program ID'sini (Sistem Programı) ve hesapları (gönderen ve alıcı) belirtir.

```rust /program_id/ /from_pubkey/ /to_pubkey/
let cpi_context = CpiContext::new(
    program_id,
    Transfer {
        from: from_pubkey,
        to: to_pubkey,
    },
);
```

`cpi_context` ve `amount`, CPI'yi gerçekleştirmek için `transfer` fonksiyonuna geçirilir.

```rust
transfer(cpi_context, amount)?;
```

### Yardımcı Kütüphane ile Çağırma

Arka planda, yukarıdaki `CpiContext` örneği, `solana_program` kütüphanesinin `invoke` fonksiyonu etrafında bir sarmalayıcıdır ve [`system_instruction::transfer`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/system_instruction.rs#L881) kullanarak talimatı oluşturur.

Aşağıdaki örnek, `system_instruction::transfer` yöntemini kullanarak Sistem Programı'nın transfer talimatına CPI yapmak için `invoke()` fonksiyonunu nasıl kullanacağınızı gösterir.

Öncelikle, `lib.rs` dosyasının üst kısmına bu importları ekleyin:

```rust
use anchor_lang::solana_program::{program::invoke, system_instruction};
```

Sonra, `sol_transfer` talimatını aşağıdaki gibi değiştirin:

```rust /instruction/1,3 {9}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.sender.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let instruction =
        &system_instruction::transfer(&from_pubkey.key(), &to_pubkey.key(), amount);

    invoke(instruction, &[from_pubkey, to_pubkey, program_id])?;
    Ok(())
}
```

:::tip
Bu uygulama, önceki örnekle işlevsel olarak eşdeğerdir.
:::

### Talimat ile Çağırma

Ayrıca, `invoke()` fonksiyonuna geçmek için talimatı elle oluşturabilirsiniz. Bu, çağırmak istediğiniz talimatı oluşturmak için bir kütüphane mevcut olmadıkça faydalıdır.

Bu yaklaşım, talimatın gerektirdiği `AccountMeta`'ları manuel olarak belirtmenizi ve talimat verileri tamponunu doğru bir şekilde oluşturmanızı gerektirir.

Aşağıdaki `sol_transfer` talimatı, önceki iki örneğin tamamen genişletilmiş eşdeğeridir.

```rust /instruction/10,13 {28}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.sender.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    // Talimat AccountMeta'ları hazırlama
    let account_metas = vec![
        AccountMeta::new(from_pubkey.key(), true),
        AccountMeta::new(to_pubkey.key(), false),
    ];

    // SOL transfer talimatı ayırtıcısı
    let instruction_discriminator: u32 = 2;

    // Talimat verilerini hazırlama
    let mut instruction_data = Vec::with_capacity(4 + 8);
    instruction_data.extend_from_slice(&instruction_discriminator.to_le_bytes());
    instruction_data.extend_from_slice(&amount.to_le_bytes());

    // Talimat oluşturma
    let instruction = Instruction {
        program_id: program_id.key(),
        accounts: account_metas,
        data: instruction_data,
    };

    // Talimatı çağırma
    invoke(&instruction, &[from_pubkey, to_pubkey, program_id])?;
    Ok(())
}
```

> Yukarıdaki `sol_transfer` talimatı, `bu örneği` SOL transfer talimatını elle oluşturma konusunda yinelemektedir. Talimat oluşturma sürecinde aşağıdaki biçimi kullanmalısınız:
> 
> ```rust
> AccountMeta::new(account1_pubkey, true),           // yazılabilir, imzacı
> AccountMeta::new(account2_pubkey, false),          // yazılabilir, imzacı değil
> AccountMeta::new_readonly(account3_pubkey, false), // yazılamaz, imzacı değil
> AccountMeta::new_readonly(account4_pubkey, true),  // yazılabilir, imzacı
> ```