---
date: 2024-04-24T00:00:00Z
difficulty: beginner
title: "Solana programında PDA İmzacı ile CPI Nasıl Yapılır"
description:
  "Anchor framework'ünü kullanarak Solana programlarında PDA İmzacı ile
  Cross Program Invocations (CPI) uygulamayı öğrenin"
tags:
  - rust
  - anchor
  - cpi
  - pda
keywords:
  - öğretici
---

Bu kılavuz, `Anchor framework'ü` kullanarak 
gönderenin programın imzalamak zorunda olduğu bir PDA olduğu 
`Cross-Program Invocation (CPI)` kullanarak SOL transferinin 
nasıl yapılacağını göstermektedir.

:::info
Bu senaryonun tipik bir kullanım durumu, kullanıcılar adına 
`t okent hesaplarını` yöneten bir programdır.
:::

Örneğin, bir DeFi protokolünün kullanıcı fonlarını tek bir hesaba havuzladığı 
bir senaryoyu düşünün. Protokolün, otomatik olarak çekim taleplerini yönetmek 
için güvenlik kontrolleri eklemesi gerekmektedir. Böyle durumlarda, bu havuzlanmış 
fonlar üzerindeki kontrol tek bir kullanıcının elinde değil, programın kendisinin 
elindedir. Bu, protokolün token hesaplarının sahibi olarak PDA'ların 
` kullanılmasını` gerektirir ve böylece çekimler için 
programatik olarak imza atılabilir.

---

Aşağıda, Solana programlarını okurken veya yazarken karşılaşabileceğiniz 
işlevsel olarak eşdeğer iki farklı uygulama bulunmaktadır. İşte, 
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi-pda) üzerinde 
son referans programı.

## Başlangıç Kodu

İşte [Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi-sol-transfer-pda-signer) 
üzerinde bir başlangıç programı. `lib.rs` dosyasında tek bir `sol_transfer` 
talimatını içeren aşağıdaki program bulunmaktadır.

```rust filename="lib.rs"
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("3455LkCS85a4aYmSeNbRrJsduNQfYRY82A7eCD3yQfyR");

#[program]
pub mod cpi {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.pda_account.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let seed = to_pubkey.key();
        let bump_seed = ctx.bumps.pda_account;
        let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        )
        .with_signer(signer_seeds);

        transfer(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(
        mut,
        seeds = [b"pda", recipient.key().as_ref()],
        bump,
    )]
    pda_account: SystemAccount<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
```

:::note
`cpi.test.ts` dosyası, özel `sol_transfer` talimatının nasıl çağrılacağını 
gösterir ve SolanaFM'de işlem detaylarına bir bağlantı kaydeder.
:::

Programda belirtilen tohumları kullanarak PDA'nın nasıl türetileceğini 
göstermektedir:

```ts /pda/ /wallet.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("pda"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

Bu örnekteki ilk adım, PDA hesabını Playground cüzdanından temel bir SOL 
transferi ile finanse etmektir.

```ts filename="cpi.test.ts"
it("PDA'yı SOL ile finanse et", async () => {
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: PDA,
    lamports: transferAmount,
  });

  const transaction = new Transaction().add(transferInstruction);

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet.payer], // imzalayıcı
  );

  console.log(
    `\nİşlem İmzası:` +
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

PDA SOL ile finanse edildikten sonra, `sol_transfer` talimatı çağrılır. 
Bu talimat, SOL'u PDA'dan `wallet` hesabına geri transfer eder ve bu işlem 
System Program'a bir CPI ile “imzalanır”.

```ts
it("PDA imzacı ile SOL Transferi", async () => {
  const transactionSignature = await program.methods
    .solTransfer(new BN(transferAmount))
    .accounts({
      pdaAccount: PDA,
      recipient: wallet.publicKey,
    })
    .rpc();

  console.log(
    `\nİşlem İmzası: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

İşlem detayları, öncelikle özel programın çağrıldığını (görev 1), ardından 
System Program'ı (görev 1.1) çağırdığını gösterir ve bu da başarılı bir SOL 
transferi ile sonuçlanır.

![İşlem Detayları](../../../images/solana/public/assets/docs/core/cpi/transaction-details-pda.png)

İşlem detaylarını görüntülemek için testi derleyebilir, dağıtabilir ve çalıştırabilirsiniz. 
[SolanaFM explorer](https://solana.fm/) üzerinde.

---

## Anchor Kullanarak İmzacılarla CPI Nasıl Yapılır

Başlangıç kodunda, `SolTransfer` yapısı transfer talimatı için gereken hesapları 
belirler.

```rust /pda_account/ /recipient/2 /system_program/
#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(
        mut,
        seeds = [b"pda", recipient.key().as_ref()],
        bump,
    )]
    pda_account: SystemAccount<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
```

`pda_account` için adres türetmek üzere kullanılan `seeds`, sabit kodlanmış 
"pda" dizesini ve `recipient` hesabının adresini içerir. Bu, `pda_account` için 
adresin her `recipient` için benzersiz olduğu anlamına gelir.

PDA'yı türetmek için Javascript karşılığı test dosyasında bulunmaktadır.

```ts /pda/ /wallet.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("pda"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

### Anchor CpiContext

Başlangıç kodunda yer alan `sol_transfer` talimatı, Anchor framework'ü kullanarak 
CPI'ların nasıl oluşturulacağına dair tipik bir yaklaşımı göstermektedir.

Bu yaklaşım, çağrılan talimatlar için gereken `program_id` ve hesapları 
içeren bir [`CpiContext`](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html) 
oluşturmayı, ardından belirli bir talimatı invoke etmek için bir yardımcı 
fonksiyonu (`transfer`) içermektedir.

```rust /cpi_context/ {19}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.pda_account.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let seed = to_pubkey.key();
    let bump_seed = ctx.bumps.pda_account;
    let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

    let cpi_context = CpiContext::new(
        program_id,
        Transfer {
            from: from_pubkey,
            to: to_pubkey,
        },
    )
    .with_signer(signer_seeds);

    transfer(cpi_context, amount)?;
    Ok(())
}
```

:::tip
PDAlar ile imzalama yapıldığında, isteğe bağlı tohumlar ve bump tohumları 
`cpi_context` içinde `signer_seeds` olarak `with_signer()` kullanılarak dahil edilir.
:::

```rust /signer_seeds/
let seed = to_pubkey.key();
let bump_seed = ctx.bumps.pda_account;
let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

let cpi_context = CpiContext::new(
    program_id,
    Transfer {
        from: from_pubkey,
        to: to_pubkey,
    },
)
.with_signer(signer_seeds);
```

`cpi_context` ve `amount`, CPI'yi gerçekleştirmek için `transfer` fonksiyonuna 
geçilir.

```rust
transfer(cpi_context, amount)?;
```

CPI işlenirken, Solana çalışma zamanı sağlanan tohumların ve çağrıları program ID'sinin geçerli bir PDA türettiğini doğrular. PDA, çağrıda bir imzacı olarak eklenir. 
Bu mekanizma, programların kendi program ID'sinden türetilen PDAlar için programatik olarak imza atmasına olanak tanır.

### Crate Yardımcı ile Çağırma

Altta yatan kod, yukarıdaki örnek `invoke_signed()` fonksiyonunun bir 
sargısıdır ve [`system_instruction::transfer`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/system_instruction.rs#L881) 
kullanarak talimatı oluşturur.

Aşağıdaki örnek, `invoke_signed()` fonksiyonunu kullanarak System Program'ın 
transfer talimatına bir CPI yapmak için `system_instruction::transfer` yöntemini 
kullanır ve PDA tarafından imzalanır.

Öncelikle, `lib.rs` dosyasının üst kısmına bu ithalatları ekleyin:

```rust
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};
```

Sonra, `sol_transfer` talimatını aşağıdaki gibi değiştirin:

```rust /instruction/1,3 {13}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.pda_account.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let seed = to_pubkey.key();
    let bump_seed = ctx.bumps.pda_account;
    let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

    let instruction =
        &system_instruction::transfer(&from_pubkey.key(), &to_pubkey.key(), amount);

    invoke_signed(instruction, &[from_pubkey, to_pubkey, program_id], signer_seeds)?;
    Ok(())
}
```

Bu uygulama, önceki örnekle işlevsel olarak eşdeğerdir. `signer_seeds`, 
`invoke_signed` fonksiyonuna geçirilir.
