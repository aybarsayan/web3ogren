---
title: CPIs with Anchor
description:
  Solana’da farklı programlar arasında etkileşim sağlamak için Anchor programlarında Cross Program Invocations (CPI) nasıl uygulanacağını öğrenin.
sidebarLabel: CPIs with Anchor
sidebarSortOrder: 5
---

`Cross Program Invocations (CPI)`, bir programın başka bir programın talimatlarını çağırma sürecini ifade eder ve bu, Solana'daki programların bileşenliğini sağlar.

Bu bölüm, bir Anchor programında bir CPI'yi uygulamanın temelini, pratik bir örnek olarak basit bir SOL transfer talimatı kullanarak ele alacaktır. **CPI'yi nasıl uygulayacağınızı anladıktan sonra, aynı kavramları herhangi bir talimat için uygulayabilirsiniz.**

## Cross Program Invocations

Sistem Programının transfer talimatına bir CPI uygulayan bir programı inceleyelim. İşte
[Solana Playground](https://beta.solpg.io/66df2751cffcf4b13384d35a) üzerindeki örnek program.

`lib.rs` dosyası, bir adet `sol_transfer` talimatı içerir. Anchor programındaki `sol_transfer` talimatı çağrıldığında, program içsel olarak Sistem Programının transfer talimatını çağırır.

```rs filename="lib.rs" /sol_transfer/ /transfer/ {23}
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

```:::info
**Not:** `cpi.test.ts` dosyası, Anchor programının `sol_transfer` talimatını nasıl çağıracağını gösterir ve SolanaFM üzerindeki işlem detaylarına bir bağlantı kaydeder.
```

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

Playground'da bu örnek için testi oluşturabilir, dağıtabilir ve çalıştırabilirsiniz, böylece [SolanaFM explorer](https://solana.fm/) üzerindeki işlem detaylarını görebilirsiniz.

**İşlem detayları**, ilk olarak Anchor programının çağrıldığını (talimat 1), ardından Sistem Programının çağrıldığını (talimat 1.1) ve sonuç olarak başarılı bir SOL transferi gerçekleştiğini gösterecektir.

![Transaction Details](../../../images/solana/public/assets/docs/core/cpi/transaction-details.png)

### Örnek 1 Açıklaması

Bir CPI uygulamak, bir işlemi bir geçerlilik süresine eklemek için bir talimat oluşturma örüntüsünü takip eder. Bir CPI uygularken, çağrılan talimat için program kimliğini, hesapları ve talimat verilerini belirtmeliyiz.

Sistem Programının transfer talimatı, iki hesap gerektirir:

- `from`: SOL gönderen hesap.
- `to`: SOL alan hesap.

Örnek programda, `SolTransfer` yapısı transfer talimatı için gereken hesapları belirtir. **CPI'nin Sistem Programını çağırdığını da belirtmek önemlidir.**

```rust /sender/ /recipient/ /system_program/
#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>, // gönderici hesap
    #[account(mut)]
    recipient: SystemAccount<'info>, // alıcı hesap
    system_program: Program<'info, System>, // program kimliği
}
```

---

Aşağıdaki sekmeler, her biri farklı bir soyutlama seviyesinde Cross Program Invocations (CPI) uygulamanın üç yaklaşımını sunar. Tüm örnekler işlevsel olarak eşdeğerdir. Ana amaç, CPI'nin uygulama detaylarını göstermektir.





Örnek kodda yer alan `sol_transfer` talimatı, Anchor çerçevesini kullanarak CPI'leri oluşturmanın tipik bir yaklaşımını gösterir.

Bu yaklaşım, çağrılan talimat için gereken `program_id` ve hesapları içeren bir
[`CpiContext`](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html) oluşturmayı, ardından belirli bir talimatı çağırmak için bir yardımcı fonksiyon (`transfer`) kullanmayı içerir.

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

`cpi_context` değişkeni, transfer talimatı için gereken program kimliğini (Sistem Programı) ve hesapları (gönderen ve alıcı) belirtir.

```rust /program_id/ /from_pubkey/ /to_pubkey/
let cpi_context = CpiContext::new(
    program_id,
    Transfer {
        from: from_pubkey,
        to: to_pubkey,
    },
);
```

`cpi_context` ve `amount` daha sonra, Sistem Programının transfer talimatını çağıran `transfer` fonksiyonuna iletilir.

```rust
transfer(cpi_context, amount)?;
```




Bu örnek, `invoke` fonksiyonu ve
[`system_instruction::transfer`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/system_instruction.rs#L881) kullanarak bir CPI uygulamak için farklı bir yaklaşım gösterir; bu, genellikle yerel Rust programlarında görülür.

Arka planda, önceki örnek bu uygulamanın bir soyutlama şeklidir. Aşağıdaki örnek, işlevsel olarak önceki örneğe eşdeğerdir.

```rust
use anchor_lang::solana_program::{program::invoke, system_instruction};
```

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




Talimatı `invoke()` fonksiyonuna geçmek için de talimatı manuel olarak oluşturabilirsiniz. Bu, istediğiniz talimatı oluşturmanıza yardımcı olacak bir crate yoksa kullanışlıdır. Bu yaklaşım, talimat için `AccountMeta`'ları belirtmenizi gerektirir ve talimat verileri tamponunu doğru bir şekilde oluşturmanızı sağlar.

Aşağıdaki `sol_transfer` talimatı, Sistem Programının transfer talimatına bir CPI'yi manuel uygulamaktadır.

```rust /instruction/10,13 {28}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.sender.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    // Talimat AccountMetas'ını hazırlayın
    let account_metas = vec![
        AccountMeta::new(from_pubkey.key(), true),
        AccountMeta::new(to_pubkey.key(), false),
    ];

    // SOL transfer talimatı ayırıcı
    let instruction_discriminator: u32 = 2;

    // Talimat verilerini hazırlayın
    let mut instruction_data = Vec::with_capacity(4 + 8);
    instruction_data.extend_from_slice(&instruction_discriminator.to_le_bytes());
    instruction_data.extend_from_slice(&amount.to_le_bytes());

    // Talimatı oluşturun
    let instruction = Instruction {
        program_id: program_id.key(),
        accounts: account_metas,
        data: instruction_data,
    };

    // Talimatı çağır
    invoke(&instruction, &[from_pubkey, to_pubkey, program_id])?;
    Ok(())
}
```

Yukarıdaki `sol_transfer` talimatı, bu
`örneği` tekrarlamaktadır; burada bir SOL transfer talimatı manuel olarak oluşturulmuştur. Talimatı bir geçerlilik süresine eklemek için aynı örüntüyü izler.

Rust'ta bir talimat oluştururken, her hesap için `AccountMeta`'yı belirtmek için aşağıdaki sözdizimini kullanın:

```rust
AccountMeta::new(account1_pubkey, true),           // yazılabilir, imzalayıcı
AccountMeta::new(account2_pubkey, false),          // yazılabilir, imzalayıcı değil
AccountMeta::new_readonly(account3_pubkey, false), // yazılamaz, imzalayıcı değil
AccountMeta::new_readonly(account4_pubkey, true),  // yazılabilir, imzalayıcı
```




İşte tüm 3 örneği içeren bir referans program
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi)'da mevcuttur.

## Cross Program Invocations with PDA Signers

Bir sonraki adımda, gönderenin program tarafından "imzalanması" gereken bir Program Derived Address (PDA) olduğu Sistem Programının transfer talimatına bir CPI uygulayan bir programı inceleyelim. İşte
[Solana Playground](https://beta.solpg.io/66df2bd2cffcf4b13384d35b) üzerindeki örnek program.

`lib.rs` dosyası, bir adet `sol_transfer` talimatı içeren aşağıdaki programı içerir.

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

```:::info
**Not:** `cpi.test.ts` dosyası, Anchor programının `sol_transfer` talimatını nasıl çağıracağını gösterir ve SolanaFM üzerindeki işlem detaylarına bir bağlantı kaydeder.
```

Programda belirtilen tohumları kullanarak PDA'yı nasıl türeteceğini gösterir:

```ts /pda/ /wallet.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("pda"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

Bu örnekteki ilk adım, PDA hesabını bildirim cüzdanından temel bir SOL transferi ile finanse etmektir.

```ts filename="cpi.test.ts"
it("Fund PDA with SOL", async () => {
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
    `\nTransaction Signature:` +
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

PDA SOL ile finanse edildikten sonra, `sol_transfer` talimatını çağırın. Bu talimat, bir CPI aracılığıyla SOL'u PDA hesabından `wallet` hesabına aktarır ve program tarafından "imzalanır".

```ts
it("SOL Transfer with PDA signer", async () => {
  const transactionSignature = await program.methods
    .solTransfer(new BN(transferAmount))
    .accounts({
      pdaAccount: PDA,
      recipient: wallet.publicKey,
    })
    .rpc();

  console.log(
    `\nTransaction Signature: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

Testi oluşturabilir, dağıtabilir ve çalıştırarak [SolanaFM explorer](https://solana.fm/) üzerindeki işlem detaylarını görebilirsiniz.

**İşlem detayları**, ilk olarak özel programın çağrıldığını (talimat 1), ardından Sistem Programının çağrıldığını (talimat 1.1) ve sonuç olarak başarılı bir SOL transferi gerçekleştiğini gösterecektir.

![Transaction Details](../../../images/solana/public/assets/docs/core/cpi/transaction-details-pda.png)

### Örnek 2 Açıklaması

Örnek kodda, `SolTransfer` yapısı transfer talimatı için gereken hesapları belirtir.

**Gönderen**, programın imzalaması gereken bir PDA'dır. `pda_account` için adres türetmek amacıyla kullanılan `tohumlar`, sabit kodlu "pda" dizesi ve `recipient` hesabının adresini içerir. Bu, `pda_account` adresinin her `recipient` için benzersiz olduğu anlamına gelir.

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

PDA'yı türetmek için kullanılan Javascript eşdeğeri test dosyasında yer almaktadır.

```ts /pda/ /wallet.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("pda"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

---

Aşağıdaki sekmeler, her biri farklı bir soyutlama seviyesinde Cross Program Invocations (CPI) uygulamanın iki yaklaşımını sunar. Her iki örnek de işlevsel olarak eşdeğerdir. Ana amaç, CPI'nin uygulama detaylarını göstermektir.





Örnek kodda yer alan `sol_transfer` talimatı, Anchor çerçevesini kullanarak CPI'leri oluşturmanın tipik bir yaklaşımını gösterir.

Bu yaklaşım, çağrılan talimat için gereken `program_id` ve hesapları içeren bir
[`CpiContext`](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html) oluşturmayı, ardından belirli bir talimatı çağırmak için bir yardımcı fonksiyon (`transfer`) kullanmayı içerir.

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

PDAlara imza atarken, tohumlar ve bump seed `signer_seeds` olarak `cpi_context` içinde `with_signer()` yöntemi kullanılarak dahil edilir. Bir PDA için bump seed, `ctx.bumps` takibine alınarak erişilebilir.

```rust /signer_seeds/ /bump_seed/ {3}
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

`cpi_context` ve `amount` daha sonra, CPI'yi gerçekleştirmek için `transfer` fonksiyonuna iletilir.

```rust
transfer(cpi_context, amount)?;
```

CPI işlenirken, Solana çalışma zamanı sağlanan tohumların ve çağıran program kimliğinin geçerli bir PDA türeteceğini doğrular. PDA daha sonra çağrı sırasında bir imzalayıcı olarak eklenir. **Bu mekanizma, programların kendi program kimlikleriyle türetilen PDAlar için imza atmasını sağlar.**




Arka planda, önceki örnek `invoke_signed()` fonksiyonu etrafında bir sarıcıdır; bu da
[`system_instruction::transfer`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/system_instruction.rs#L881) kullanarak talimatı oluşturur.

Bu örnek, bir PDA imzalı olarak bir CPI yapmak için `invoke_signed()` fonksiyonunun nasıl kullanılacağını gösterir.

```rust
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};
```

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

Bu uygulama, önceki örnekle işlevsel olarak eşdeğerdir. **`signer_seeds`, `invoke_signed` fonksiyonuna geçirilir.**




İşte her iki örneği içeren bir referans program
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi-pda)'da mevcuttur.