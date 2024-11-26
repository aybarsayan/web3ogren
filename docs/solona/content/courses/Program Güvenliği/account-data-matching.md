---
title: Hesap Verisi Eşleştirme
objectives:
  - Eksik veri doğrulama kontrollerinin güvenlik risklerini açıklayın
  - Uzun form Rust kullanarak veri doğrulama kontrolleri uygulayın
  - Anchor kısıtlamaları kullanarak veri doğrulama kontrolleri uygulayın
description:
  "Programınızdaki veri hesaplarını hem Anchor hem de Native Rust'ta nasıl kontrol edeceğinizi öğrenin."
---

## Özet

- **Veri doğrulama kontrolleri** kullanarak hesap verilerinin beklenen bir değerle eşleştiğini doğrulayın. Uygun veri doğrulama kontrolleri olmadan, beklenmeyen hesaplar bir talimat işleyicisinde kullanılabilir.
- Rust'ta veri doğrulama kontrollerini uygulamak için, bir hesapta saklanan veriyi beklenen bir değerle karşılaştırın.

  ```rust
  if ctx.accounts.user.key() != ctx.accounts.user_data.user {
      return Err(ProgramError::InvalidAccountData.into());
  }
  ```

- Anchor'da, verilen ifadenin doğru olup olmadığını kontrol etmek için bir
  [`kısıtlama`](https://www.anchor-lang.com/docs/account-constraints) kullanabilirsiniz. Alternatif olarak, `has_one` kullanarak, hesapta saklanan bir hedef hesap alanının `Accounts` yapısındaki bir hesap anahtarıyla eşleşip eşleşmediğini kontrol edebilirsiniz.

---

### Eksik veri doğrulama kontrolü

**Aşağıdaki örnekte,** `admin` alanını güncelleyen bir `update_admin` talimat işleyici bulunmaktadır.

:::warning
Talimat işleyicisi, işlemi imzalayan `admin` hesabının `admin_config` hesabında saklanan `admin` ile eşleşip eşleşmediğini doğrulamak için bir veri doğrulama kontrolüne sahip değildir. 
:::

Bu, işlemi imzalayan herhangi bir hesabın `admin` hesabı olarak talimat işleyicisine geçirilmesi durumunda `admin_config` hesabını güncelleyebileceği anlamına gelir.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod data_validation {
    use super::*;
    ...
    pub fn update_admin(ctx: Context<UpdateAdmin>) -> Result<()> {
        ctx.accounts.admin_config.admin = ctx.accounts.new_admin.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(mut)]
    pub admin_config: Account<'info, AdminConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: Bu hesap anchor tarafından kontrol edilmeyecek
    pub new_admin: UncheckedAccount<'info>,
}

#[account]
pub struct AdminConfig {
    admin: Pubkey,
}
```

---

### Veri Doğrulama Kontrolü Ekle

Bu sorunu çözmek için temel Rust yaklaşımı, geçirilen `admin` anahtarını `admin_config` hesabında saklanan `admin` anahtarıyla karşılaştırmaktır. Eşleşmezlerse bir hata fırlatılacaktır.

```rust
if ctx.accounts.admin.key() != ctx.accounts.admin_config.admin {
    return Err(ProgramError::InvalidAccountData.into());
}
```

Bir veri doğrulama kontrolü ekleyerek, `update_admin` talimat işleyici yalnızca işlemin `admin` imzalayıcısının `admin_config` hesabında saklanan `admin` ile eşleşmesi durumunda işlem yapacaktır.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod data_validation {
    use super::*;
    ...
    pub fn update_admin(ctx: Context<UpdateAdmin>) -> Result<()> {
      if ctx.accounts.admin.key() != ctx.accounts.admin_config.admin {
            return Err(ProgramError::InvalidAccountData.into());
        }
        ctx.accounts.admin_config.admin = ctx.accounts.new_admin.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(mut)]
    pub admin_config: Account<'info, AdminConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: Bu hesap anchor tarafından kontrol edilmeyecek
    pub new_admin: UncheckedAccount<'info>,
}

#[account]
pub struct AdminConfig {
    admin: Pubkey,
}
```

---

### Anchor Kısıtlamalarını Kullanma

Anchor, kısıtlama ile bunu basitleştirir. `has_one` kısıtlamasını, veri doğrulama kontrolünü talimat işleyici mantığından `UpdateAdmin` yapısına taşımak için kullanabilirsiniz.

**Aşağıdaki örnekte,** `has_one = admin`, işlemi imzalayan `admin` hesabının `admin_config` hesabında saklanan `admin` alanıyla eşleşmesi gerektiğini belirtir. `has_one` kısıtlamasını kullanmak için, hesap doğrulama yapısındaki veri alanının adlandırma düzeni, hesap üzerindeki adlandırma ile tutarlı olmalıdır.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod data_validation {
    use super::*;
    ...
    pub fn update_admin(ctx: Context<UpdateAdmin>) -> Result<()> {
        ctx.accounts.admin_config.admin = ctx.accounts.new_admin.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(
        mut,
        has_one = admin
    )]
    pub admin_config: Account<'info, AdminConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: Bu hesap anchor tarafından kontrol edilmeyecek
    pub new_admin: UncheckedAccount<'info>,
}

#[account]
pub struct AdminConfig {
    admin: Pubkey,
}
```

Alternatif olarak, `kısıtlama` kullanarak, devam etmeden önce doğru olması gereken bir ifadeyi manuel olarak ekleyebilirsiniz. Bu, adlandırmanın tutarlı olamayacağı veya gelen verileri tam olarak doğrulamak için daha karmaşık bir ifadeye ihtiyaç duyulduğunda faydalıdır.

```rust
#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(
        mut,
        constraint = admin_config.admin == admin.key()
    )]
    pub admin_config: Account<'info, AdminConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: Bu hesap anchor tarafından kontrol edilmeyecek
    pub new_admin: UncheckedAccount<'info>,
}
```

---

## Laboratuvar

### 1. Başlangıç

Başlamak için, [`başlangıç`](https://github.com/solana-developers/account-data-matching/tree/starter) dalından başlangıç kodunu indirin. 
Başlangıç kodu, iki talimat içeren bir program ve test dosyası için kurulum şablonunu içerir.

`initialize_vault` talimat işleyicisi yeni bir `Vault` hesabı ve yeni bir `TokenAccount` başlatır. `Vault` hesabı, bir token hesabının adresini, vault'un yetkilisini ve bir çekim hedef token hesabını saklayacaktır.

Yeni token hesabının yetkisi, programın bir PDA'sı olan `vault` olarak ayarlanacaktır. Bu, `vault` hesabının token hesabından token transferi için imza atabilmesini sağlar.

:::tip
Bu talimat işleyicisinin **bir imzacı kontrolü** ve `vault` için bir sahip kontrolü bulunduğuna dikkat edin. Ancak, hesap doğrulama veya talimat işleyici mantığında, `authority` hesabının `vault` üzerindeki `authority` hesabıyla eşleşip eşleşmediğini kontrol eden bir kod yoktur.
:::

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("J89xWAprDsLAAwcTA6AhrK49UMSAYJJWdXvw4ZQK4suu");

pub const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod account_data_matching {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        ctx.accounts.vault.token_account = ctx.accounts.token_account.key();
        ctx.accounts.vault.authority = ctx.accounts.authority.key();
        ctx.accounts.vault.withdraw_destination = ctx.accounts.withdraw_destination.key();
        Ok(())
    }

    pub fn insecure_withdraw(ctx: Context<InsecureWithdraw>) -> Result<()> {
        let amount = ctx.accounts.token_account.amount;

        let seeds = &[b"vault".as_ref(), &[ctx.bumps.vault]];
        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
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
        seeds = [b"vault"],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = vault,
        seeds = [b"token"],
        bump,
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub withdraw_destination: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InsecureWithdraw<'info> {
    #[account(
        seeds = [b"vault"],
        bump,
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

#[account]
#[derive(Default, InitSpace)]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
    withdraw_destination: Pubkey,
}
```

---

### 2. Güvensiz çekim Talimat İşleyicisini Test Et

Bu sorunun olduğunu ispatlamak için, vault'un `authority`'sı dışındaki bir hesabın vault'dan çekim yapmaya çalıştığı bir test yazalım.

**Test dosyası,** `authority` olarak sağlayıcı cüzdanı kullanarak `initialize_vault` talimat işleyicisini çağırmak için kod içerir ve ardından vault token hesabına 100 token basar.

`insecure_withdraw` talimat işleyicisini çağırmak için bir test ekleyin. `withdrawDestination` hesabı olarak `fakeWithdrawDestination` ve `authority` olarak `fakeWallet` kullanın. Ardından, işlemi `fakeWallet` kullanarak gönderin.

:::info
Hesap doğrulama yapısında, talimat işleyicisine geçirilen `authority` hesabının, ilk testte başlatılan `vault` hesabında saklanan değerlerle eşleşip eşleşmediğini doğrulayan bir kontrol olmadığından, talimat işleyici başarılı bir şekilde işlenecek ve tokenler `fakeWithdrawDestination` hesabına aktarılacaktır.
:::

```typescript
describe("Account Data Matching", () => {
  ...
  it("allows insecure withdrawal", async () => {
    try {
      const tx = await program.methods
        .insecureWithdraw()
        .accounts({
          vault: vaultPDA,
          tokenAccount: tokenPDA,
          withdrawDestination: fakeWithdrawDestination,
          authority: fakeWallet.publicKey,
        })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [
        fakeWallet,
      ]);

      const tokenAccount = await getAccount(provider.connection, tokenPDA);
      expect(Number(tokenAccount.amount)).to.equal(0);
    } catch (error) {
      throw new Error(
        `Güvensiz çekim beklenmedik şekilde başarısız oldu: ${error.message}`,
      );
    }
  });
})
```

`anchor test` komutunu çalıştırarak her iki işlemin de başarılı bir şekilde tamamlandığını görün.

```bash
Account Data Matching
    ✔ vault'ı başlatır ve tokenleri basar (879ms)
    ✔ güvensiz çekime izin verir (431ms)
```

---

### 3. Güvenli Çekim Talimat İşleyicisini Ekle

Şimdi güvenli bir sürümünü (`secure_withdraw`) uygulayalım.

Bu talimat işleyicisi, `insecure_withdraw` talimat işleyicisine benzer olacaktır, ancak `authority` hesabının talimat işleyicisine geçirilen hesabın `vault` hesabındaki `authority` hesabıyla eşleşip eşleşmediğini kontrol etmek için hesap doğrulama yapısında `has_one` kısıtlaması kullanacağız. Böylece yalnızca doğru yetki hesabı vault'un tokenlerini çekebilir.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod account_data_matching {
    use super::*;
    ...
    pub fn secure_withdraw(ctx: Context<SecureWithdraw>) -> Result<()> {
        let amount = ctx.accounts.token_account.amount;

        let seeds = &[b"vault".as_ref(), &[ctx.bumps.vault]];
        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.withdraw_destination.to_account_info(),
            },
            &signer,
        );

        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SecureWithdraw<'info> {
    #[account(
        seeds = [b"vault"],
        bump,
        has_one = token_account,
        has_one = authority,
        has_one = withdraw_destination,
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

---

### 4. Güvenli Çekim Talimat İşleyicisini Test Et

Şimdi `secure_withdraw` talimat işleyicisini, biri `fakeWallet`'ı yetki olarak kullanan ve diğeri `wallet`'ı yetki olarak kullanan iki test ile test edeceğiz. İlk çağrının bir hata döndürmesini, ikincisinin ise başarılı olmasını bekliyoruz.

```typescript
describe("account-data-matching", () => {
  ...
  it("prevents unauthorized secure withdrawal", async () => {
    try {
      const tx = await program.methods
        .secureWithdraw()
        .accounts({
          vault: vaultPDA,
          tokenAccount: tokenPDA,
          withdrawDestination: fakeWithdrawDestination,
          authority: fakeWallet.publicKey,
        })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [
        fakeWallet,
      ]);

      throw new Error("Güvenli çekim başarısız olması gerekiyordu ama olmadı");
    } catch (error) {
      expect(error).to.be.an("error");
      console.log("Beklenen hata meydana geldi:", error.message);
    }
  });

  it("allows secure withdrawal by authorized user", async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await mintTo(
        provider.connection,
        wallet.payer,
        mint,
        tokenPDA,
        wallet.payer,
        100,
      );

      await program.methods
        .secureWithdraw()
        .accounts({
          vault: vaultPDA,
          tokenAccount: tokenPDA,
          withdrawDestination,
          authority: wallet.publicKey,
        })
        .rpc();

      const tokenAccount = await getAccount(provider.connection, tokenPDA);
      expect(Number(tokenAccount.amount)).to.equal(0);
    } catch (error) {
      throw new Error(`Güvenli çekim beklenmedik şekilde başarısız oldu: ${error.message}`);
    }
  });
})
```

`anchor test` komutunu çalıştırarak yanlış yetki hesabı kullanan işlemin artık bir Anchor Hatası döndürdüğünü, doğru hesaplar kullanan işlemin ise başarılı bir şekilde tamamlandığını görün.

```bash
"Program J89xWAprDsLAAwcTA6AhrK49UMSAYJJWdXvw4ZQK4suu invoke [1]",
"Program log: Talimat: SecureWithdraw",
"Program log: AnchorError, hesabın sebep olduğu hata: vault. Hata Kodu: ConstraintHasOne. Hata Numarası: 2001. Hata Mesajı: Bir has one kısıtlaması ihlal edildi.",
"Program log: Sol:",
"Program log: GprrWv9r8BMxQiWea9MrbCyK7ig7Mj8CcseEbJhDDZXM",
"Program log: Sağ:",
"Program log: 2jTDDwaPzbpG2oFnnqtuHJpiS9k9dDVqzzfA2ofcqfFS",
"Program J89xWAprDsLAAwcTA6AhrK49UMSAYJJWdXvw4ZQK4suu 200000 hesap biriminden 11790 kullandı",
"Program J89xWAprDsLAAwcTA6AhrK49UMSAYJJWdXvw4ZQK4suu başarısız oldu: özel program hatası: 0x7d1"
```

Anchor, loglar da hatanın sebep olduğu hesabı belirtir (`AnchorError, hesabın sebep olduğu hata: vault`).

```bash
✔ yetkisiz güvenli çekimi engeller
✔ yetkili kullanıcı tarafından güvenli çekime izin verir (1713ms)
```

Ve işte böylece, güvenlik açığını kapattınız. Bu potansiyel istismarlar arasındaki tema çoğunlukla oldukça basit olmaktır. Ancak, programlarınızın kapsamı ve karmaşıklığı arttıkça, olası istismarları kaçırmak daha da kolay hale gelir. Çalışmaması gerektiğini düşündüğünüz talimatları gönderen testler yazma alışkanlığı edinmek harika bir fikirdir. Ne kadar çok olursa, o kadar iyi. Böylece sorunları dağıtımdan önce yakalamış olursunuz.

Eğer son çözüm koduna göz atmak isterseniz, onu [`çözüm`](https://github.com/solana-developers/account-data-matching/tree/solution) dalında bulabilirsiniz.

---

## Zorluk

Bu birim içindeki diğer derslerde olduğu gibi, bu güvenlik açığını önlemeye yönelik fırsatınız, kendi veya başka programları denetlemekle ilgilidir.

En az bir programı gözden geçirmek ve doğru veri kontrollerinin yerinde olup olmadığını sağlamak için biraz zaman ayırın.

Unutmayın, eğer başkasının programında bir hata veya istismar bulursanız, lütfen onları bilgilendirin! Kendi programınızda bir bulursanız, lütfen hemen düzeltin.



Kodunuzu GitHub'a gönderin ve
[bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=a107787e-ad33-42bb-96b3-0592efc1b92f)!
