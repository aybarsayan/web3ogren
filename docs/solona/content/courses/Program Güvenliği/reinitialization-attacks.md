---
title: Yeniden Başlatma Saldırıları
objectives:
  - Yeniden başlatma güvenlik açığı ile ilişkili güvenlik risklerini açıklamak
  - Bir hesabın otomatik olarak yeniden başlatılmasını engellemek için kontrol edilen bir hesap ayırt edici set ederek Anchor'un `init` kısıtlamasını kullanmak
  - Bir hesabın zaten başlatılıp başlatılmadığını kontrol etmek için yerel Rust kullanmak
description:
  "Hesapların yeniden başlatılmasının veri üzerindeki etkilerini ve bunları nasıl önleyeceğinizi anlayın."
---

## Özeti

- **Hesap Yeniden Başlatmasını Önleyin:** Bir hesabın yeniden başlatılmasını ve mevcut verilerin üzerine yazılmasını önlemek için bir hesap ayırt edici veya başlatma bayrağı kullanın.
- **Anchor Yaklaşımı:** Bunu, bir sistem programına CPI vasıtasıyla bir hesap oluşturmak için Anchor'un `init` kısıtlamasını kullanarak basitleştirin; bu otomatik olarak ayırt edicisini ayarlar.
- **Yerel Rust Yaklaşımı:** Yerel Rust'da, hesap başlatma sırasında bir is_initialized bayrağı ayarlayın ve yeniden başlatmadan önce kontrol edin:

  ```rust
  if account.is_initialized {
      return Err(ProgramError::AccountAlreadyInitialized.into());
  }
  ```

---

## Ders

Başlatma, yeni bir hesabın verilerini ilk kez ayarlar. **Mevcut verilerin üzerine yazılmasını önlemek için** bir hesabın zaten başlatılıp başlatılmadığını kontrol etmek önemlidir. **Bir hesabı oluşturmanın ve başlatmanın ayrı işlemler olduğunu unutmayın.** Bir hesap oluşturmak, Sistem Programı üzerinde `create_account` talimat işleyicisini çağırmayı içerir; bu, alan ayırır, lamportlarda kira öder ve program sahibini atar. **Başlatma hesap verilerini ayarlar.** Bu adımlar tek bir işlemde birleştirilebilir.

### Eksik Başlatma Kontrolü

Aşağıdaki örnekte, `user` hesabı üzerinde kontrol yok. `initialize` talimat işleyicisi `User` hesap türündeki `authority` alanını ayarlar ve verileri serileştirir. **Kontroller olmadan, bir saldırgan hesabı yeniden başlatabilir ve mevcut `authority` değerini üzerine yazabilir.**

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod initialization_insecure {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.user.authority = ctx.accounts.authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    pub authority: Pubkey,
}
```

### is_initialized Kontrolü Ekle

Bunu düzeltmek için, Kullanıcı hesap türüne `is_initialized` alanı ekleyin ve yeniden başlatmadan önce kontrol edin:

```rust
if user.is_initialized {
    return Err(ProgramError::AccountAlreadyInitialized.into());
}
```

**Bu, `user` hesabının yalnızca bir kez başlatılmasını sağlar.** Eğer `is_initialized` doğru ise, işlem başarısız olur ve saldırganın hesap yetkisini değiştirmesine engel olur.

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program_error::ProgramError;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod initialization_secure {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let user = &mut ctx.accounts.user;

        if user.is_initialized {
            return Err(ProgramError::AccountAlreadyInitialized.into());
        }

        user.is_initialized = true;
        user.authority = ctx.accounts.authority.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    pub is_initialized: bool,
    pub authority: Pubkey,
}
```

### Anchor'un init Kısıtlamasını Kullanın

:::info 
[Anchor'un `init` kısıtlaması](https://www.anchor-lang.com/docs/account-constraints), `#[account(...)]` niteliği ile kullanıldığında bir hesabı başlatır, hesap ayırt edicisini ayarlar ve talimat işleyicisinin her hesap için yalnızca bir kez çağrılabileceğinden emin olur. `init` kısıtlaması, başlatma için ödeme yapan hesabı ve gerekli alan miktarını belirtmek üzere `payer` ve `space` kısıtlamaları ile kullanılmalıdır.
:::

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod initialization_recommended {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("GM");
        ctx.accounts.user.authority = ctx.accounts.authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = DISCRIMINATOR_SIZE + User::INIT_SPACE
    )]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    pub authority: Pubkey,
}
```

#### Anchor'un init_if_needed Kısıtlaması


:::warning Öneme Dikkat

[Anchor'un `init_if_needed` kısıtlaması](https://www.anchor-lang.com/docs/account-constraints), bir özellik bayrağı ile korunmalıdır. yalnızca henüz başlatılmamış bir hesabı başlatır. Hesap zaten başlatılmışsa, talimat işleyicisi yine de çalışacaktır, bu nedenle hesabı başlangıç durumuna sıfırlamayı önlemek için talimat işleyicinizde kontroller eklemek son derece önemlidir.


**Örneğin,** `authority` alanı talimat işleyicisinde ayarlanmışsa, bu talimat işleyicisinde, bir saldırganın zaten ayarlanmış olanı yeniden başlatmasını önlemeye yönelik kontroller sağladığınızdan emin olun. Genellikle, hesap verilerini başlatmak için ayrı bir talimat işleyicisi bulundurmak daha güvenlidir.

---

## Laboratuvar

Bu laboratuvarda, iki talimat işleyicisi olan basit bir Solana programı oluşturacağız:

- `insecure_initialization` - Kontrol olmadan bir hesabı başlatır, yeniden başlatmaya izin verir.
- `recommended_initialization` - Yeniden başlatmayı önleyerek Anchor'un `init` kısıtlamasını kullanarak bir hesabı başlatır.

### 1. Başlangıç

Başlamak için, bu
[`başlangıç` deposunun dalından](https://github.com/solana-developers/reinitialization-attacks/tree/starter) başlangıç kodunu indirin. Başlangıç kodu, bir talimat işleyicisine ve test dosyasının iskelet ayarına sahip bir program içerir.

`insecure_initialization` talimat işleyicisi, bir `authority`'nin genel anahtarını saklayan yeni bir `user` hesabını başlatır. Hesap, istemci tarafında tahsis edilmesi ve ardından program talimatına geçirilmesi beklenir. Ancak, `user` hesabının başlangıç durumunun zaten ayarlanıp ayarlanmadığını doğrulamak için herhangi bir kontrol yoktur. Bu, aynı hesabın ikinci kez geçirilmesine ve `authority`'nin üzerine yazılmasına izin verir.

```rust
use anchor_lang::prelude::*;

declare_id!("HLhxJzFYjtXCET4HxnSzv27SpXg16FWNDi2LvrNmSvzH");

#[program]
pub mod initialization {
    use super::*;

    pub fn insecure_initialization(ctx: Context<Unchecked>) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let mut user_data = User::try_from_slice(&user.data.borrow())?;
        user_data.authority = ctx.accounts.authority.key();
        user_data.serialize(&mut *user.data.borrow_mut())?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Unchecked<'info> {
    #[account(mut)]
    /// CHECK: Bu hesap talimat içinde başlatılacak
    pub user: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    pub authority: Pubkey,
}
```

### 2. Güvensiz Başlatma Talimat İşleyicisini Test Et

Test dosyası, bir hesap oluşturmaya yönelik ayarları içerir ve ardından aynı hesapla `insecure_initialization` talimat işleyicisini iki kez çağırır.

**`insecure_initialization` talimat işleyicisinde,** hesap verilerinin daha önce başlatılmadığını doğrulamak için kontrol olmadığı için, bu talimat işleyicisi her iki seferde başarılı bir şekilde yürütülür, hatta *farklı* bir `authority` hesabı ile bile.

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Initialization } from "../target/types/initialization";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  SendTransactionError,
} from "@solana/web3.js";
import { expect } from "chai";
import { airdropIfRequired } from "@solana-developers/helpers";

describe("Initialization", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Initialization as Program<Initialization>;

  const walletAuthority = provider.wallet as anchor.Wallet;
  const secondWallet = Keypair.generate();

  const insecureUserAccount = Keypair.generate();
  const recommendedUserAccount = Keypair.generate();

  const ACCOUNT_SPACE = 32;
  const AIRDROP_AMOUNT = 1 * LAMPORTS_PER_SOL;
  const MINIMUM_BALANCE_FOR_RENT_EXEMPTION = 1 * LAMPORTS_PER_SOL;

  before(async () => {
    try {
      const rentExemptionAmount =
        await provider.connection.getMinimumBalanceForRentExemption(
          ACCOUNT_SPACE,
        );

      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: walletAuthority.publicKey,
        newAccountPubkey: insecureUserAccount.publicKey,
        space: ACCOUNT_SPACE,
        lamports: rentExemptionAmount,
        programId: program.programId,
      });

      const transaction = new Transaction().add(createAccountInstruction);

      await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        transaction,
        [walletAuthority.payer, insecureUserAccount],
      );

      await airdropIfRequired(
        provider.connection,
        secondWallet.publicKey,
        AIRDROP_AMOUNT,
        MINIMUM_BALANCE_FOR_RENT_EXEMPTION,
      );
    } catch (error) {
      console.error("Kurulum başarısız:", error);
      throw error;
    }
  });

  it("güvensiz başlatma gerçekleştirir", async () => {
    try {
      await program.methods
        .insecureInitialization()
        .accounts({
          user: insecureUserAccount.publicKey,
          authority: walletAuthority.publicKey,
        })
        .signers([walletAuthority.payer])
        .rpc();
    } catch (error) {
      console.error("Güvensiz başlatma başarısız:", error);
      throw error;
    }
  });

  it("farklı yetki ile güvensiz başlatmayı yeniden çağırır", async () => {
    try {
      const transaction = await program.methods
        .insecureInitialization()
        .accounts({
          user: insecureUserAccount.publicKey,
          authority: secondWallet.publicKey,
        })
        .signers([secondWallet])
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        transaction,
        [secondWallet],
      );
    } catch (error) {
      console.error("Güvensiz başlatma yeniden çağrısı başarısız:", error);
      throw error;
    }
  });
});
```

`anchor test` çalıştırarak **`insecure_initialization` talimat işleyicisinin** her iki çağrıda da başarılı bir şekilde çalıştığını doğrulayın.

```bash
Initialization
    ✔ güvensiz başlatma gerçekleştirir (420ms)
    ✔ farklı yetki ile güvensiz başlatmayı yeniden çağırır (419ms)
```

### 3. Recommended_initialization Talimat İşleyicisini Ekle

Şimdi, güvenlik sorununu ele alan `recommended_initialization` adında yeni bir talimat işleyicisi oluşturalım. Bu, güvensiz talimat işleyicisinden farklı olarak, kullanıcının hesabının yaratılışını ve başlatılmasını Anchor'un `init` kısıtlamasını kullanarak halledecektir.

**Bu kısıtlama**, hesabın sistem programına CPI aracılığıyla oluşturulmasını sağlar ve ayırt edici (discriminator) ayarlarını tanımlar. **Böylece, aynı kullanıcı hesabıyla yapılan herhangi bir sonraki çağrı başarısız olur ve yeniden başlatmaya izin vermez.**

```rust
use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod initialization {
    use super::*;
    ...
    pub fn recommended_initialization(ctx: Context<Checked>) -> Result<()> {
        ctx.accounts.user.authority = ctx.accounts.authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Checked<'info> {
    #[account(
        init,
        payer = authority,
        space = DISCRIMINATOR_SIZE + User::INIT_SPACE
    )]
    user: Account<'info, User>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    pub authority: Pubkey,
}
```

### 4. Recommended_initialization Talimat İşleyicisini Test Et

**`recommended_initialization` talimat işleyicisinde olduğu gibi, çağrıyı iki kez yaparak test edin.** Bu defa, işlem ikinci kez aynı hesabı başlatmaya çalışırken başarısız olmalıdır.

```typescript
describe("Initialization", () => {
  ...
  it("tavsiye edilen başlatmayı gerçekleştirir", async () => {
    try {
      await program.methods
        .recommendedInitialization()
        .accounts({
          user: recommendedUserAccount.publicKey,
        })
        .signers([recommendedUserAccount])
        .rpc();
    } catch (error) {
      console.error("Tavsiye edilen başlatma başarısız:", error);
      throw error;
    }
  });

  it("farklı yetki ile tavsiye edilen başlatmayı yeniden çağırmayı başarısız kılar", async () => {
    try {
      const transaction = await program.methods
        .recommendedInitialization()
        .accounts({
          user: recommendedUserAccount.publicKey,
          authority: secondWallet.publicKey,
        })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        transaction,
        [secondWallet, recommendedUserAccount],
        { commitment: "confirmed" }
      );

      throw new Error("Yeniden çağrılma beklenmedik şekilde başarılı oldu");
    } catch (error) {
      if (error.message === "Yeniden çağrılma beklenmedik şekilde başarılı oldu") {
        throw error;
      }

      if (error instanceof SendTransactionError) {
        console.log("İşlem beklendiği gibi başarısız oldu");
      } else {
        console.error("Beklenmedik hata:", error);
      }
      console.log(error)
      expect(error).to.exist;
    }
  });
});
```

`anchor test` çalıştırarak, ikinci işlemin hesabın zaten kullanıldığına dair bir hata ile başarısız olduğunu doğrulayın.

```bash
'Program HLhxJzFYjtXCET4HxnSzv27SpXg16FWNDi2LvrNmSvzH invoke [1]',
'Program log: Talimat: TavsiyeEdilenBaşlatma',
'Program 11111111111111111111111111111111 invoke [2]',
'Allocate: hesap Address { address: FcW7tG71GKuRgxEbgFuuNQNV3HVSMmVyKATo74iCK4yi, base: None } zaten kullanılıyor',
'Program 11111111111111111111111111111111 failed: custom program error: 0x0',
'Program HLhxJzFYjtXCET4HxnSzv27SpXg16FWNDi2LvrNmSvzH consumed 3330 of 200000 compute units',
'Program HLhxJzFYjtXCET4HxnSzv27SpXg16FWNDi2LvrNmSvzH failed: custom program error: 0x0'
```

**Anchor'un `init` kısıtlamasını kullanmak genellikle yeniden başlatma saldırılarına karşı koruma sağlar.** Bu güvenlik istismarları için çözüm basittir ancak hayati öneme sahiptir. **Bir hesabı her başlatırken, ya `init` kısıtlamasını kullandığınızdan ya da mevcut bir hesabın başlangıç durumunu sıfırlamayı önlemek için başka bir kontrol uyguladığınızdan emin olun.**

Final çözüm kodu için, bu
[`çözüm` deposunun dalına](https://github.com/solana-developers/reinitialization-attacks/tree/solution) bakın.

---

## Zorluk

Zorluğunuz, bu güvenlik istismarından kaçınmayı pratik yapmak için kendi veya başkalarının programlarını denetlemektir.

**En az bir programı gözden geçirmek ve talimat işleyicilerinin yeniden başlatma saldırılarına karşı yeterince korunduğundan emin olmak için biraz zaman ayırın.**

**Başka bir programda bir hata veya istismar bulursanız, geliştiriciyi bilgilendirin. Kendi programınızda bulursanız, hemen düzeltin.**


Kodunuzu GitHub'a gönderin ve [bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=652c68aa-18d9-464c-9522-e531fd8738d5)!
