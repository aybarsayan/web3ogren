---
title: PDA Paylaşımı
objectives:
  - PDA paylaşımı ile ilişkili güvenlik risklerini açıklamak
  - Ayırıcı yetki alanlarına sahip PDAs türetmek
  - PDA hesaplarını doğrulamak için Anchor'ın `seeds` ve `bump` kısıtlamalarını kullanmak
description:
  "Kullanıcı ve alan özel PDAs kullanarak, PDAs'ı yeniden kullanmanın potansiyel sorunlarını anlayın."
---

## Özet

- Birden fazla yetki alanı için aynı PDA'yı kullanmak, programınızı kullanıcıların kendilerine ait olmayan verilere ve fonlara erişim sağlaması olasılığına açar.
- Aynı PDA'nın birden fazla hesap için kullanımını önlemek amacıyla, kullanıcı ve/veya alan-spesifik seed'ler kullanın.
- Bir PDA'nın beklenen seed'ler ve bump kullanılarak türetildiğini doğrulamak için Anchor'ın `seeds` ve `bump` kısıtlamalarını kullanın.

## Ders

PDA paylaşımı, bir imzalayıcı olarak aynı PDA'nın birden fazla kullanıcı veya alan arasında kullanılmasını ifade eder. Özellikle PDA'lar imzalamak için kullanıldığında, programı temsil etmek için global bir PDA kullanmak uygun görünebilir. Ancak bu, hesap doğrulamasının geçerli olma imkanını artırır, fakat bir kullanıcının kendisine ait olmayan fonlara, transferlere veya verilere erişmesine olanak tanır.

### Güvensiz Global PDA

Aşağıdaki örnekte, `vault` hesabının `authority`'si, `pool` hesabında saklanan `mint` adresi kullanılarak türetilen bir PDA'dır. Bu PDA, token'ların `vault`'tan `withdraw_destination`'a transferi için imzalamak üzere `authority` hesabı olarak talimat işleyiciye geçilir.

> **Not:** `vault` için imzalamak üzere PDA türetmek için `mint` adresini seed olarak kullanmak güvensizdir çünkü aynı `vault` token hesabı için birden fazla `pool` hesabı oluşturulabilir, ancak farklı `withdraw_destination` hesapları ile. 

Token transferleri için imzalamak üzere PDA türetmek için `mint`'i seed olarak kullanarak, herhangi bir `pool` hesabı, bir `vault` token hesabından keyfi bir `withdraw_destination`'a token transferi imzalayabilir.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("ABQaKhtpYQUUgZ9m2sAY7ZHxWv6KyNdhUJW8Dh8NQbkf");

#[program]
pub mod pda_sharing_insecure {
    use super::*;

    pub fn withdraw_tokens(ctx: Context<WithdrawTokens>) -> Result<()> {
        let amount = ctx.accounts.vault.amount;
        let seeds = &[ctx.accounts.pool.mint.as_ref(), &[ctx.accounts.pool.bump]];
        token::transfer(get_transfer_ctx(&ctx.accounts).with_signer(&[seeds]), amount)
    }
}

#[derive(Accounts)]
pub struct WithdrawTokens<'info> {
    #[account(has_one = vault, has_one = withdraw_destination)]
    pool: Account<'info, TokenPool>,
    vault: Account<'info, TokenAccount>,
    withdraw_destination: Account<'info, TokenAccount>,
    /// CHECK: Bu, transfer için imza atacak PDA'dır
    authority: UncheckedAccount<'info>,
    token_program: Program<'info, Token>,
}

pub fn get_transfer_ctx<'accounts, 'remaining, 'cpi_code, 'info>(
    accounts: &'accounts WithdrawTokens<'info>,
) -> CpiContext<'accounts, 'remaining, 'cpi_code, 'info, token::Transfer<'info>> {
    CpiContext::new(
        accounts.token_program.to_account_info(),
        token::Transfer {
            from: accounts.vault.to_account_info(),
            to: accounts.withdraw_destination.to_account_info(),
            authority: accounts.authority.to_account_info(),
        },
    )
}

#[account]
#[derive(InitSpace)]
pub struct TokenPool {
    pub vault: Pubkey,
    pub mint: Pubkey,
    pub withdraw_destination: Pubkey,
    pub bump: u8,
}
```

### Güvenli Hesap Spesifik PDA

Hesap spesifik bir PDA oluşturmanın bir yolu, `withdraw_destination`'ı `vault` token hesabının yetkisi olarak kullanılan PDA'yı türetmek için seed olarak kullanmaktır. Bu, `withdraw_tokens` talimat işleyicisinde CPI için imzalayan PDA'nın, amaçlanan `withdraw_destination` token hesabına göre türetildiğinden emin olunmasını sağlar. Diğer bir deyişle, bir `vault` token hesabından yalnızca, başlangıçta `pool` ile başlatılan `withdraw_destination`'a token'ların çekilmesine izin verilir.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod pda_sharing_secure {
    use super::*;

    pub fn withdraw_tokens(ctx: Context<WithdrawTokens>) -> Result<()> {
        let amount = ctx.accounts.vault.amount;
        let seeds = &[
            ctx.accounts.pool.withdraw_destination.as_ref(),
            &[ctx.accounts.pool.bump],
        ];
        token::transfer(get_transfer_ctx(&ctx.accounts).with_signer(&[seeds]), amount)
    }
}

#[derive(Accounts)]
pub struct WithdrawTokens<'info> {
    #[account(has_one = vault, has_one = withdraw_destination)]
    pool: Account<'info, TokenPool>,
    vault: Account<'info, TokenAccount>,
    withdraw_destination: Account<'info, TokenAccount>,
    /// CHECK: Bu, transfer için imza atacak PDA'dır
    authority: UncheckedAccount<'info>,
    token_program: Program<'info, Token>,
}

pub fn get_transfer_ctx<'accounts, 'remaining, 'cpi_code, 'info>(
    accounts: &'accounts WithdrawTokens<'info>,
) -> CpiContext<'accounts, 'remaining, 'cpi_code, 'info, token::Transfer<'info>> {
    CpiContext::new(
        accounts.token_program.to_account_info(),
        token::Transfer {
            from: accounts.vault.to_account_info(),
            to: accounts.withdraw_destination.to_account_info(),
            authority: accounts.pool.to_account_info(),
        },
    )
}

#[account]
#[derive(InitSpace)]
pub struct TokenPool {
    pub vault: Pubkey,
    pub mint: Pubkey,
    pub withdraw_destination: Pubkey,
    pub bump: u8,
}
```

### Anchor'ın Seeds ve Bump Kısıtlamaları

PDAs, bir hesabın adresi olarak kullanılabilir ve programların sahip oldukları PDAs için imza atmaları için izin verebilir.

Aşağıdaki örnekte, `withdraw_destination` kullanılarak türetilen bir PDA, hem `pool` hesabının adresi hem de `vault` token hesabının sahibi olarak kullanılmaktadır. Bu, yalnızca doğru `vault` ve `withdraw_destination` ile ilişkili `pool` hesabının, `withdraw_tokens` talimat işleyicisinde kullanılabileceği anlamına gelir.

> **İpucu:** Anchor'ın `seeds` ve `bump` kısıtlamalarını, `pool` hesabı PDA'sını doğrulamak için [`#[account(...)]`](https://www.anchor-lang.com/docs/account-constraints) niteliği ile kullanabilirsiniz. Anchor, belirtilen `seeds` ve `bump` kullanarak bir PDA türetir ve bunu talimat işleyicisine geçirilen `pool` hesabı ile karşılaştırır. `has_one` kısıtlaması, yalnızca `pool` hesabında depolanan doğru hesapların talimat işleyicisine geçirilmesini daha da sağlamak için kullanılır.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("ABQaKhtpYQUUgZ9m2sAY7ZHxWv6KyNdhUJW8Dh8NQbkf");

#[program]
pub mod pda_sharing_recommended {
    use super::*;

    pub fn withdraw_tokens(ctx: Context<WithdrawTokens>) -> Result<()> {
        let amount = ctx.accounts.vault.amount;
        let seeds = &[
            ctx.accounts.pool.withdraw_destination.as_ref(),
            &[ctx.accounts.pool.bump],
        ];
        token::transfer(get_transfer_ctx(&ctx.accounts).with_signer(&[seeds]), amount)
    }
}

#[derive(Accounts)]
pub struct WithdrawTokens<'info> {
    #[account(
        seeds = [withdraw_destination.key().as_ref()],
        bump = pool.bump,
        has_one = vault,
        has_one = withdraw_destination,
    )]
    pool: Account<'info, TokenPool>,
    #[account(mut)]
    vault: Account<'info, TokenAccount>,
    #[account(mut)]
    withdraw_destination: Account<'info, TokenAccount>,
    token_program: Program<'info, Token>,
}

pub fn get_transfer_ctx<'accounts, 'remaining, 'cpi_code, 'info>(
    accounts: &'accounts WithdrawTokens<'info>,
) -> CpiContext<'accounts, 'remaining, 'cpi_code, 'info, token::Transfer<'info>> {
    CpiContext::new(
        accounts.token_program.to_account_info(),
        token::Transfer {
            from: accounts.vault.to_account_info(),
            to: accounts.withdraw_destination.to_account_info(),
            authority: accounts.pool.to_account_info(),
        },
    )
}

#[account]
#[derive(InitSpace)]
pub struct TokenPool {
    pub vault: Pubkey,
    pub mint: Pubkey,
    pub withdraw_destination: Pubkey,
    pub bump: u8,
}
```

## Laboratuvar

Şimdi PDA paylaşımının bir saldırganın kendisine ait olmayan tokenları nasıl çekebileceğini göstermek için basit bir program oluşturarak pratik yapalım. Bu laboratuvar yukarıdaki örnekleri genişleterek gerekli program hesaplarını başlatmak için talimat işleyicilerini ekleyecektir.

### 1. Başlangıç

Başlamak için, bu deposunun [`starter`](https://github.com/solana-developers/pda-sharing/tree/starter) dalında başlangıç kodunu indirin. Başlangıç kodu, iki talimat işleyicisi ile bir program ve test dosyası için hazırlayıcı kurulum içerir.

`initialize_pool` talimat işleyicisi, bir `vault`, `mint`, `withdraw_destination` ve `bump` depolayan yeni bir `TokenPool` başlatır. `vault`, yetkisi mint adresi kullanılarak türetilen bir PDA olarak ayarlanmış bir token hesabıdır.

`withdraw_insecure` talimat işleyicisi, `vault` token hesabındaki tokenları bir `withdraw_destination` token hesabına transfer edecektir.

> **Uyarı:** Ancak, yazıldığı gibi imza atmak için kullanılan seedler `vault`'ın çekim hedefine özel değildir, bu nedenle program güvenlik açıklarına açıktır. Devam etmeden önce kodu incelemek için bir dakikanızı ayırın.

### 2. Withdraw_insecure Talimat İşleyicisini Test Edin

Test dosyası, `initialize_pool` talimat işleyicisini çağırmak ve ardından `vault` token hesabına 100 token mintlemek için kod içerir. Ayrıca, `withdraw_insecure`'ı amaçlanan `withdraw_destination` kullanarak çağırmak için bir test içerir. Bu, talimat işleyicilerinin amaçlandığı gibi kullanılabileceğini gösterir.

Bundan sonra, talimat işleyicilerinin kötüye kullanılmaya açık olduğunu gösteren iki test daha vardır.

1. İlk test, `vault` token hesabını kullanarak "sahte" bir `pool` hesabı oluşturmak için `initialize_pool` talimat işleyicisini çağırır, ancak farklı bir `withdraw_destination` kullanır.
2. İkinci test, bu havuzdan çekim yaparak vault'tan fon çalar.

```typescript
it("allows insecure initialization with incorrect vault", async () => {
  try {
    await program.methods
      .initializePool(insecureAuthorityBump)
      .accounts({
        pool: insecurePoolFake.publicKey,
        mint: tokenMint,
        vault: insecureVault.address,
        withdrawDestination: fakeWithdrawDestination,
      })
      .signers([insecurePoolFake])
      .rpc();

    await mintTo(
      connection,
      wallet.payer,
      tokenMint,
      insecureVault.address,
      wallet.payer,
      INITIAL_MINT_AMOUNT,
    );

    const vaultAccount = await getAccount(connection, insecureVault.address);
    expect(Number(vaultAccount.amount)).to.equal(INITIAL_MINT_AMOUNT);
  } catch (error) {
    throw new Error(`Test failed: ${error.message}`);
  }
});

it("allows insecure withdrawal to incorrect destination", async () => {
  try {
    await program.methods
      .withdrawInsecure()
      .accounts({
        pool: insecurePoolFake.publicKey,
        authority: insecureAuthority,
      })
      .rpc();

    const vaultAccount = await getAccount(connection, insecureVault.address);
    expect(Number(vaultAccount.amount)).to.equal(0);
  } catch (error) {
    throw new Error(`Test failed: ${error.message}`);
  }
});
```

`anchor test` komutunu çalıştırarak işlemlerin başarılı bir şekilde tamamlandığını ve `withdraw_insecure` talimat işleyicisinden `vault` token hesabının sahte bir çekim hedefine boşaltıldığını görebilirsiniz.

### 3. Initialize_pool_secure Talimat İşleyicisini Ekleyin

Artık bir havuzun güvenli bir şekilde başlatılması için programa yeni bir talimat işleyicisi ekleyelim.

Bu yeni `initialize_pool_secure` talimat işleyicisi, `withdraw_destination` kullanılarak türetilen bir PDA olarak bir `pool` hesabını başlatacaktır. Aynı zamanda, yetkisi `pool` PDA'sı olarak ayarlanmış bir `vault` token hesabını başlatacaktır.

```rust
pub fn initialize_pool_secure(ctx: Context<InitializePoolSecure>) -> Result<()> {
    ctx.accounts.pool.vault = ctx.accounts.vault.key();
    ctx.accounts.pool.mint = ctx.accounts.mint.key();
    ctx.accounts.pool.withdraw_destination = ctx.accounts.withdraw_destination.key();
    ctx.accounts.pool.bump = ctx.bumps.pool;
    Ok(())
}
...

#[derive(Accounts)]
pub struct InitializePoolSecure<'info> {
    #[account(
        init,
        payer = payer,
        space = DISCRIMINATOR_SIZE + TokenPool::INIT_SPACE,
        seeds = [withdraw_destination.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, TokenPool>,
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = payer,
        token::mint = mint,
        token::authority = pool,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub withdraw_destination: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}
```

### 4. Withdraw_secure Talimat İşleyicisini Ekleyin

Sonraki adım, `vault` token hesabından `withdraw_destination`'a token çekmek için bir `withdraw_secure` talimat işleyicisi eklemektir. `pool` hesabı, doğru PDA hesabının sağlandığından emin olmak için `seeds` ve `bump` kısıtlamaları kullanılarak doğrulanır. `has_one` kısıtlamaları, doğru `vault` ve `withdraw_destination` token hesaplarının sağlandığını kontrol eder.

```rust
pub fn withdraw_secure(ctx: Context<WithdrawTokensSecure>) -> Result<()> {
    let amount = ctx.accounts.vault.amount;
    let seeds = &[
        ctx.accounts.pool.withdraw_destination.as_ref(),
        &[ctx.accounts.pool.bump],
    ];
    token::transfer(
        get_secure_transfer_ctx(&ctx.accounts).with_signer(&[seeds]),
        amount,
    )
}

...

#[derive(Accounts)]
pub struct WithdrawTokensSecure<'info> {
    #[account(
        has_one = vault,
        has_one = withdraw_destination,
        seeds = [withdraw_destination.key().as_ref()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, TokenPool>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub withdraw_destination: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

pub fn get_secure_transfer_ctx<'accounts, 'remaining, 'cpi_code, 'info>(
    accounts: &'accounts WithdrawTokensSecure<'info>,
) -> CpiContext<'accounts, 'remaining, 'cpi_code, 'info, token::Transfer<'info>> {
    CpiContext::new(
        accounts.token_program.to_account_info(),
        token::Transfer {
            from: accounts.vault.to_account_info(),
            to: accounts.withdraw_destination.to_account_info(),
            authority: accounts.pool.to_account_info(),
        },
    )
}
```

### 5. Withdraw_secure Talimat İşleyicisini Test Edin

Son olarak, test dosyasına geri dönerek `withdraw_secure` talimat işleyicisini test edelim ve PDA imzalama yetkimizin kapsamını daraltarak zayıflığı ortadan kaldırdığımızı gösterelim.

Zayıflığın yamanmadığını gösteren bir test yazmadan önce, başlangıç ve withdraw talimat işleyicilerinin beklendiği gibi çalıştığını gösteren bir test yazalım:

```typescript
it("performs secure pool initialization and withdrawal correctly", async () => {
  try {
    const initialWithdrawBalance = await getAccount(
      connection,
      withdrawDestination,
    );

    await program.methods
      .initializePoolSecure()
      .accounts({
        mint: tokenMint,
        vault: recommendedVault.publicKey,
        withdrawDestination: withdrawDestination,
      })
      .signers([recommendedVault])
      .rpc();

    await new Promise(resolve => setTimeout(resolve, 1000));

    await mintTo(
      connection,
      wallet.payer,
      tokenMint,
      recommendedVault.publicKey,
      wallet.payer,
      INITIAL_MINT_AMOUNT,
    );

    await program.methods
      .withdrawSecure()
      .accounts({
        vault: recommendedVault.publicKey,
        withdrawDestination: withdrawDestination,
      })
      .rpc();

    const finalWithdrawBalance = await getAccount(
      connection,
      withdrawDestination,
    );

    expect(
      Number(finalWithdrawBalance.amount) -
        Number(initialWithdrawBalance.amount),
    ).to.equal(INITIAL_MINT_AMOUNT);
  } catch (error) {
    throw new Error(`Test failed: ${error.message}`);
  }
});
```

Artık saldırının artık çalışmadığını test edelim. `vault` yetkisi, amaçlanan `withdraw_destination` token hesabı kullanılarak türetilmiş bir `pool` PDA'sı olduğundan, başka bir hesaba çekim yapılmasının bir yolu olmamalıdır.

Yanlış bir çekim amacının `withdraw_secure` talimatını çağırmaktan kaçındığını gösteren bir test ekleyin. Bu, önceki testte oluşturulan havuz ve vault'u kullanabilir.

```typescript
it("prevents secure withdrawal to incorrect destination", async () => {
  try {
    await program.methods
      .withdrawSecure()
      .accounts({
        vault: recommendedVault.publicKey,
        withdrawDestination: fakeWithdrawDestination,
      })
      .signers([recommendedVault])
      .rpc();

    throw new Error("Expected an error but withdrawal succeeded");
  } catch (error) {
    expect(error).to.exist;
    console.log("Error message:", error.message);
  }
});
```

Son olarak, `pool` hesabı `withdraw_destination` token hesabı kullanılarak türetilildiğinden, aynı PDA ile sahte bir `pool` hesabı oluşturamayız. Saldırganın yanlış bir vault eklemesini önleyecek şekilde yeni `initialize_pool_secure` talimat işleyicisinin çalışmadığını gösteren bir test ekleyin.

```typescript
it("prevents secure pool initialization with incorrect vault", async () => {
  try {
    await program.methods
      .initializePoolSecure()
      .accounts({
        mint: tokenMint,
        vault: insecureVault.address,
        withdrawDestination: withdrawDestination,
      })
      .signers([recommendedVault])
      .rpc();

    throw new Error("Expected an error but initialization succeeded");
  } catch (error) {
    expect(error).to.exist;
    console.log("Error message:", error.message);
  }
});
```

`anchor test` komutunu çalıştırarak, yeni talimat işleyicilerin bir saldırganın kendisine ait olmayan vault'dan çekim yapmasına izin vermediğini görebilirsiniz.

```bash
PDA paylaşımı
    ✔ güvenli olmayan başlatmaya yanlış vault ile izin verir (852ms)
    ✔ güvenli olmayan çekim yapmaya yanlış hedefe izin verir (425ms)
    ✔ güvenli havuz başlatması ve çekimini doğru şekilde gerçekleştirir (2150ms)
Hata mesajı: bilinmeyen imzacı: BpaG3NbsvLUqyFLZo9kWPwda3iPM8abJYkBfwBsASsgi
    ✔ yanlış hedefe güvenli çekim yapılmasını engeller
Hata mesajı: bilinmeyen imzacı: BpaG3NbsvLUqyFLZo9kWPwda3iPM8abJYkBfwBsASsgi
    ✔ yanlış vault ile güvenli havuz başlatmayı engeller
```

Ve bu kadar! Tartıştığımız diğer güvenlik açıklarından farklı olarak, bu daha kavramsal bir durumdur ve yalnızca belirli bir Anchor türünü kullanarak düzeltilemez. Programınızın mimarisini düşünmeniz ve farklı alanlar arasında PDA'ları paylaşmadığınızdan emin olmanız gerekecek.

> **Not:** Son çözüm kodunu görmek isterseniz, çözüm [[solution](https://github.com/solana-developers/pda-sharing/tree/solution)] dalında bulabilirsiniz.

## Meydan Okuma

Bu ünitedeki diğer derslerde olduğu gibi, bu güvenlik açığından kaçınma fırsatınız, kendi veya diğer programlarınızı denetleme sürecindedir.

En az bir programı gözden geçirmek ve PDA yapısında potansiyel zayıflıkları aramak için biraz zaman ayırın. İmzalamak için kullanılan PDAs mümkün olduğunca dar ve tek bir alana odaklanmalıdır.

Unutmayın, başka birinin programında bir hata veya saldırgan bulursanız, lütfen onları bilgilendirin! Kendi programınızda bir bulursanız, hemen düzeltin.



Kodunuzu GitHub'a gönderin ve
[bize bu dersle ilgili ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=5744079f-9473-4485-9a14-9be4d31b40d1)!
