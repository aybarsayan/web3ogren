---
title: Sahip Kontrolleri
objectives:
  - Uygun sahip kontrollerinin yapılmamasının güvenlik risklerini açıklayın.
  - Sahip kontrollerini otomatikleştirmek için Anchor'ın `Account` sargısını ve bir hesap türünü kullanın.
  - Açık bir programın, bir hesabı sahip olmasını sağlamak için Anchor'ın `#[account(owner = )]` kısıtlamasını kullanın.
  - Yerel Rust kullanarak sahip kontrollerini uygulayın.
description:
  "Gelen komutları işlerken hesap sahip kontrolünün kullanımını anlayın."
---

## Özet

- **Sahip kontrolleri**, hesapların beklenen program tarafından sahiplenildiğini sağlar. Sahip kontrolleri olmadan, başkaca programlar tarafından sahiplenilen hesaplar bir talimat işleyicisinde kullanılabilir.
- Anchor program hesap türleri `Owner` özelliğini uygular, bu da `Account`'nin program sahipliğini otomatik olarak doğrulamasını sağlar.
- Ayrıca, Anchor'ın
  [`#[account(owner = )]`](https://www.anchor-lang.com/docs/account-constraints)
  kısıtlamasını kullanarak, mevcut programdan farklı bir hesap sahibini tanımlayabilirsiniz.
- Yerel Rust kullanarak bir sahip kontrolü uygulamak için, hesabın sahibinin beklenen program kimliği ile eşleştiğini doğrulayın.

```rust
if ctx.accounts.account.owner != ctx.program_id {
    return Err(ProgramError::IncorrectProgramId.into());
}
```

## Ders

Sahip kontrolleri, bir talimat işleyicisine geçirilen bir hesabın beklenen program tarafından sahiplenildiğini doğrulamak için kullanılır; bu, farklı programlardan hesapların istismar edilmesini önler.

`AccountInfo` yapısı, hesap sahibi olan `owner` dahil olmak üzere birkaç alan içerir. Sahip kontrolleri, `AccountInfo` içindeki bu `owner` alanının beklenen program kimliği ile eşleştiğinden emin olur.

```rust
/// Hesap bilgileri
#[derive(Clone)]
pub struct AccountInfo<'a> {
    /// Hesabın genel anahtarı
    pub key: &'a Pubkey,
    /// İşlem bu hesabın genel anahtarıyla mı imzalandı?
    pub is_signer: bool,
    /// Hesap yazılabilir mi?
    pub is_writable: bool,
    /// Hesapta bulunan lamportlar. Programlar tarafından değiştirilebilir.
    pub lamports: Rc<RefCell<&'a mut u64>>,
    /// Bu hesapta tutulan veri. Programlar tarafından değiştirilebilir.
    pub data: Rc<RefCell<&'a mut [u8]>>,
    /// Bu hesabı sahiplenen program
    pub owner: &'a Pubkey,
    /// Bu hesabın verileri, bir yüklenmiş program içerir (şimdi salt okunur)
    pub executable: bool,
    /// Bu hesabın bir sonraki kira borcunu ödeyeceği dönem
    pub rent_epoch: Epoch,
}
```

### Eksik sahip kontrolü

Aşağıdaki örnekte, `admin_instruction` bir `admin` hesabına kısıtlanması amaçlanmıştır; bu `admin_config` hesabında saklanır. Ancak, programın `admin_config` hesabını sahiplenip sahiplenmediğini kontrol etmekte başarısız olur. Bu kontrol olmadan, bir saldırgan hesabı sahteleştirerek yaptıramaz.

```rust
use anchor_lang::prelude::*;

declare_id!("Cft4eTTrt4sJU4Ar35rUQHx6PSXfJju3dixmvApzhWws");

#[program]
pub mod owner_check {
    use super::*;
    ...

    pub fn admin_instruction(ctx: Context<Unchecked>) -> Result<()> {
        let account_data = ctx.accounts.admin_config.try_borrow_data()?;
        let mut account_data_slice: &[u8] = &account_data;
        let account_state = AdminConfig::try_deserialize(&mut account_data_slice)?;

        if account_state.admin != ctx.accounts.admin.key() {
            return Err(ProgramError::InvalidArgument.into());
        }
        msg!("Admin: {}", account_state.admin.to_string());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Unchecked<'info> {
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    admin_config: UncheckedAccount<'info>,
    admin: Signer<'info>,
}

#[account]
pub struct AdminConfig {
    admin: Pubkey,
}
```

### Sahip kontrolü ekleme

Bu sorunu yerel Rust kullanarak çözmek için, `owner` alanını program kimliği ile karşılaştırın:

```rust
if ctx.accounts.admin_config.owner != ctx.program_id {
    return Err(ProgramError::IncorrectProgramId.into());
}
```

Bir `owner` kontrolü eklemek, diğer programlardan gelen hesapların talimat işleyicisine geçirilmesini engeller.

```rust
use anchor_lang::prelude::*;

declare_id!("Cft4eTTrt4sJU4Ar35rUQHx6PSXfJju3dixmvApzhWws");

#[program]
pub mod owner_check {
    use super::*;
    ...
    pub fn admin_instruction(ctx: Context<Unchecked>) -> Result<()> {
        if ctx.accounts.admin_config.owner != ctx.program_id {
            return Err(ProgramError::IncorrectProgramId.into());
        }

        let account_data = ctx.accounts.admin_config.try_borrow_data()?;
        let mut account_data_slice: &[u8] = &account_data;
        let account_state = AdminConfig::try_deserialize(&mut account_data_slice)?;

        if account_state.admin != ctx.accounts.admin.key() {
            return Err(ProgramError::InvalidArgument.into());
        }
        msg!("Admin: {}", account_state.admin.to_string());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Unchecked<'info> {
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    admin_config: UncheckedAccount<'info>,
    admin: Signer<'info>,
}

#[account]
pub struct AdminConfig {
    admin: Pubkey,
}
```

### Anchor'ın `Account`'sini kullanın

Anchor, `AccountInfo`'yı saran `Account` türü ile sahip kontrollerini basit hale getirir ve otomatik olarak sahipliğin doğrulanmasını sağlar.

Aşağıdaki örnekte, `Account`, `admin_config` hesabını doğrularken, `has_one` kısıtlaması, admin hesabının `admin_config` içindeki `admin` alanı ile eşleştiğini kontrol eder.

```rust
use anchor_lang::prelude::*;

declare_id!("Cft4eTTrt4sJU4Ar35rUQHx6PSXfJju3dixmvApzhWws");

#[program]
pub mod owner_check {
    use super::*;
    ...
    pub fn admin_instruction(ctx: Context<Checked>) -> Result<()> {
        msg!("Admin: {}", ctx.accounts.admin_config.admin.to_string());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Checked<'info> {
    #[account(
        has_one = admin,
    )]
    admin_config: Account<'info, AdminConfig>,
    admin: Signer<'info>,
}

#[account]
pub struct AdminConfig {
    admin: Pubkey,
}
```

### Anchor'ın `#[account(owner = )]` kısıtlamasını kullanın

`Account` türüne ek olarak, bir hesabın sahibi olması gereken programı belirtmek için Anchor'ın [`owner` kısıtlamasını](https://www.anchor-lang.com/docs/account-constraints) kullanabilirsiniz; bu, çağrılan programdan farklı olduğunda özeldir. Bu, bir talimat işleyicisinin hesaptan, başka bir program tarafından oluşturulmuş bir PDA beklediğinde özellikle yararlıdır. `seeds` ve `bump` kısıtlamaları ile birlikte `owner` kullanarak, hesabın adresini doğru bir şekilde türetebilir ve doğrulayabilirsiniz.

`owner` kısıtlamasını uygulamak için, hesabı sahiplenen programın genel anahtarına erişiminiz olmalıdır. Bu, ya ek bir hesap olarak sağlanabilir ya da programınız içinde genel anahtarı sabit kodlayarak yapılabilir.

```rust
use anchor_lang::prelude::*;

declare_id!("Cft4eTTrt4sJU4Ar35rUQHx6PSXfJju3dixmvApzhWws");

#[program]
pub mod owner_check {
    use super::*;
    ...
    pub fn admin_instruction(ctx: Context<Checked>) -> Result<()> {
        msg!("Admin: {}", ctx.accounts.admin_config.admin.to_string());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Checked<'info> {
    #[account(
        has_one = admin,
    )]
    admin_config: Account<'info, AdminConfig>,
    admin: Signer<'info>,
    #[account(
            seeds = b"test-seed",
            bump,
            owner = token_program.key()
    )]
    pda_derived_from_another_program: AccountInfo<'info>,
    token_program: Program<'info, Token>
}

#[account]
pub struct AdminConfig {
    admin: Pubkey,
}
```

## Laboratuvar

Bu laboratuvarda, sahip kontrolü olmadan kötü niyetli bir aktörün basitleştirilmiş bir token cüzdanından tokenları nasıl boşaltabileceğini göstereceğiz. Bu, `İmzacı Yetkilendirme dersi` ile benzer bir laboratuvardır.

Bunu göstermek için iki program kullanacağız:

1. Bir program, tokenları geri çektiği cüzdan hesabında bir sahip kontrolüne sahip değildir.
2. İkinci program, ilk programın cüzdan hesabını taklit etmek için kötü niyetli bir kullanıcı tarafından oluşturulmuş bir kopyadır.

Sahip kontrolü olmaksızın, kötü niyetli kullanıcı, sahte bir program tarafından sahiplenilen kendi cüzdan hesabını geçerek ilk programın hala işlemi gerçekleştirmesini sağlar.

### 1. Başlangıç

[`starter` dalından](https://github.com/solana-developers/owner-checks/tree/starter) başlangıç kodunu indirmeye başlayın. Başlangıç kodu iki program içerir: `clone` ve `owner_check`, ve test dosyası için kurulum içerir.

`owner_check` programı, iki talimat işleyicisi içerir:

- `initialize_vault`: Bir token hesabının ve bir otorite hesabının adreslerini depolayan basit bir cüzdan hesabını başlatır.
- `insecure_withdraw`: Token cüzdanından tokenları geri çeker, ancak cüzdan hesabı için bir sahip kontrolüne sahip değildir.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("3uF3yaymq1YBmDDHpRPwifiaBf4eK8M2jLgaMcCTg9n9");

pub const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod owner_check {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        ctx.accounts.vault.token_account = ctx.accounts.token_account.key();
        ctx.accounts.vault.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn insecure_withdraw(ctx: Context<InsecureWithdraw>) -> Result<()> {
        let account_data = ctx.accounts.vault.try_borrow_data()?;
        let mut account_data_slice: &[u8] = &account_data;
        let account_state = Vault::try_deserialize(&mut account_data_slice)?;

        if account_state.authority != ctx.accounts.authority.key() {
            return Err(ProgramError::InvalidArgument.into());
        }

        let amount = ctx.accounts.token_account.amount;

        let seeds = &[
            b"token".as_ref(),
            &[ctx.bumps.token_account],
        ];
        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.token_account.to_account_info(),
                to: ctx.accounts.withdraw_destination.to_account_info(),
            },
            &signer,
        );

        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = DISCRIMINATOR_SIZE + Vault::INIT_SPACE,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = token_account,
        seeds = [b"token"],
        bump,
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InsecureWithdraw<'info> {
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    pub vault: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"token"],
        bump,
    )]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub withdraw_destination: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(Default, InitSpace)]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
```

`clone` programı tek bir talimat işleyicisi içerir:

- `initialize_vault`: Kötü niyetli kullanıcının kendi otoritesini ayarlamasına imkan tanıyan, `owner_check` programının cüzdan hesabını taklit eden sahte bir cüzdan hesabını başlatır.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

declare_id!("2Gn5MFGMvRjd548z6vhreh84UiL7L5TFzV5kKGmk4Fga");

pub const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod clone {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        ctx.accounts.vault.token_account = ctx.accounts.token_account.key();
        ctx.accounts.vault.authority = ctx.accounts.authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = DISCRIMINATOR_SIZE + Vault::INIT_SPACE,
    )]
    pub vault: Account<'info, Vault>,
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default, InitSpace)]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
```

### 2. Güvensiz geri çekme talimat işleyicisini test edin

Test dosyası, her iki programda da bir cüzdanı başlatma testlerini içerir. `insecure_withdraw` talimat işleyicisinde, bir sahip kontrolü olmamasının token geri çekme imkanı sağladığını göstermek için bir test ekleyeceğiz.

```typescript
describe("Sahip Kontrolü", () => {
    ...
    it("güvensiz geri çekme yapıyor", async () => {
    try {
      const transaction = await program.methods
        .insecureWithdraw()
        .accounts({
          vault: vaultCloneAccount.publicKey,
          tokenAccount: tokenPDA,
          withdrawDestination: unauthorizedWithdrawDestination,
          authority: unauthorizedWallet.publicKey,
        })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(connection, transaction, [
        unauthorizedWallet,
      ]);

      const tokenAccountInfo = await getAccount(connection, tokenPDA);
      expect(Number(tokenAccountInfo.amount)).to.equal(0);
    } catch (error) {
      console.error("Güvensiz geri çekme başarısız oldu:", error);
      throw error;
    }
  });
})
```

`anchor test` komutunu çalıştırarak, `insecure_withdraw` işleminin başarılı bir şekilde tamamlandığını doğrulayın.

```bash
owner-check
  ✔ cüzdanı başlatır (866ms)
  ✔ sahte cüzdanı başlatır (443ms)
  ✔ güvensiz geri çekmeyi gerçekleştirir (444ms)
```


**Not:** `vaultCloneAccount`
`vaultCloneAccount`, her iki programın da aynı ayrımcıyı kullanması nedeniyle başarılı bir şekilde ayrıştırılır; bu ayrımcı, aynı `Vault` yapı adından türetilmiştir.


```rust
#[account]
#[derive(Default, InitSpace)]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
```

### 3. Güvenli geri çekme talimat işleyicisini ekleyin

Şimdi, `Account` türü ile bir `secure_withdraw` talimat işleyicisi ekleyerek güvenlik açığını kapatacağız. Bu, bir sahip kontrolünün gerçekleştirilmesini sağlar.

`owner_check` programının `lib.rs` dosyasına, `secure_withdraw` talimat işleyicisini ve bir `SecureWithdraw` hesaplar yapısını ekleyin. `has_one` kısıtlaması, talimat işleyicisine geçirilen `token_account` ve `authority`'nin, `vault` hesabında saklanan değerlerle eşleşmesini sağlamak için kullanılacaktır.

```rust
#[program]
pub mod owner_check {
    use super::*;
    ...

    pub fn secure_withdraw(ctx: Context<SecureWithdraw>) -> Result<()> {
        let amount = ctx.accounts.token_account.amount;

        let seeds = &[
            b"token".as_ref(),
            &[*ctx.bumps.get("token_account").unwrap()],
        ];
        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.token_account.to_account_info(),
                to: ctx.accounts.withdraw_destination.to_account_info(),
            },
            &signer,
        );

        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}
...

#[derive(Accounts)]
pub struct SecureWithdraw<'info> {
    #[account(
       has_one = token_account,
       has_one = authority
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"token"],
        bump,
    )]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub withdraw_destination: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub authority: Signer<'info>,
}
```

### 4. Güvenli geri çekme talimat işleyicisini test edin

`secure_withdraw` talimat işleyicisini test etmek için, önce `vaultCloneAccount` hesabını kullanarak bir kez çağıracağız ve bunun başarısız olmasını bekleyeceğiz. Sonra, doğru `vaultAccount` hesabı ile talimat işleyicisini invoke ederek, çalıştığını doğrulamak için talimat işleyicisini çağıracağız.

```typescript
describe("Sahip Kontrolü", () => {
    ...
    it("hatalı otorite ile güvenli geri çekmeyi başarısız kılar", async () => {
    try {
      const transaction = await program.methods
        .secureWithdraw()
        .accounts({
          vault: vaultCloneAccount.publicKey,
          tokenAccount: tokenPDA,
          withdrawDestination: unauthorizedWithdrawDestination,
          authority: unauthorizedWallet.publicKey,
        })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(connection, transaction, [
        unauthorizedWallet,
      ]);
      throw new Error("İşlemin başarısız olmasını bekliyordum, ancak başarılı oldu");
    } catch (error) {
      expect(error).to.be.an("error");
      console.log("Hata mesajı:", error.message);
    }
  });

  it("güvenli geri çekmeyi başarıyla gerçekleştirir", async () => {
    try {
      await mintTo(
        connection,
        walletAuthority.payer,
        tokenMint,
        tokenPDA,
        walletAuthority.payer,
        INITIAL_TOKEN_AMOUNT
      );

      await program.methods
        .secureWithdraw()
        .accounts({
          vault: vaultAccount.publicKey,
          tokenAccount: tokenPDA,
          withdrawDestination: authorizedWithdrawDestination,
          authority: walletAuthority.publicKey,
        })
        .rpc();

      const tokenAccountInfo = await getAccount(connection, tokenPDA);
      expect(Number(tokenAccountInfo.amount)).to.equal(0);
    } catch (error) {
      console.error("Güvenli geri çekme başarısız oldu:", error);
      throw error;
    }
  });
})
```

`anchor test` çalıştırıldığında, `vaultCloneAccount` hesabı ile yapılan işlemin başarısız olduğunu ve `vaultAccount` hesabı ile yapılan işlemin başarılı bir şekilde geri çekildiğini göreceksiniz.

```bash
"Program 3uF3yaymq1YBmDDHpRPwifiaBf4eK8M2jLgaMcCTg9n9 invoke [1]",
"Program log: Talimat: SecureWithdraw",
"Program log: Hesap: vault tarafından tetiklenen AnchorError. Hata Kodu: AccountOwnedByWrongProgram. Hata Numarası: 3007. Hata Mesajı: Verilen hesap, beklenenden farklı bir program tarafından sahiplenilmektedir.",
"Program log: Sol:",
"Program log: 2Gn5MFGMvRjd548z6vhreh84UiL7L5TFzV5kKGmk4Fga",
"Program log: Sağ:",
"Program log: 3uF3yaymq1YBmDDHpRPwifiaBf4eK8M2jLgaMcCTg9n9",
"Program 3uF3yaymq1YBmDDHpRPwifiaBf4eK8M2jLgaMcCTg9n9 200000 hesaplama biriminin 4449'unu harcadı",
"Program 3uF3yaymq1YBmDDHpRPwifiaBf4eK8M2jLgaMcCTg9n9 başarısız oldu: özel program hatası: 0xbbf"
```

Burada, Anchor'ın `Account` türünün, hesap doğrulama sürecini sahiplik kontrolleri ile otomatikleştirdiğini görebiliriz. Ayrıca, Anchor hataları, hatanın nedenini belirleyen bilgileri sağlamakta; örneğin, log `AnchorError caused by account: vault` göstermektedir; bu da hata ayıklamaya yardımcı olur.

```bash
✔ hatalı otorite ile güvenli geri çekmeyi başarısız kılar
✔ güvenli geri çekmeyi başarıyla gerçekleştirir (847ms)
```

Sahiplik kontrollerinin sağlanması, güvenlik açıklarından kaçınmak için kritik önem taşır. Bu örnek, uygun doğrulamanın ne kadar basit olduğunu gösterirken, belirli programların hangi hesaplar tarafından sahiplenildiğini her zaman doğrulamanın önemli olduğunu göstermektedir.

Son çözüm kodunu incelemek isterseniz, [repo'nun `solution` dalında](https://github.com/solana-developers/owner-checks/tree/solution) bulunmaktadır.

## Mücadele

Bu ünitedeki diğer derslerde olduğu gibi, kendi veya başka programlarınızı denetleyerek güvenlik açığı önlemeyi pratik yapın.

:::tip
Hesaplarda mülkiyet kontrollerinin uygun şekilde uygulandığını doğrulamak için en az bir programı gözden geçirmek için zaman ayırın.
:::

Başka bir programda bir hata veya açık bulursanız, geliştiriciye bildirin. Kendi programınızda bir tane bulursanız, hemen düzeltin.


  Laboratuvarı tamamladınız mı?
  
  Kodunuzu GitHub’a yükleyin ve  
  [bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=e3069010-3038-4984-b9d3-2dc6585147b1)!


:::warning
Unutmayın ki, güvenlik açıkları yalnızca geliştirme aşamasında değil, dağıtım ve kullanım aşamalarında da ortaya çıkabilir. 
:::

:::info
Mülkiyet kontrollerini her zaman güncel tutmak, yazılımınızın güvenliği için kritik öneme sahiptir.
:::

“Güvenlik açığı tespiti geliştirilmiş bir yazılımın temel özelliklerinden biridir.”  
— Bilgi Güvenliği Uzmanı 

--- 

Kodunuzu yönetirken, bu önerilere dikkat etmeyi unutmayın.