---
date: 2024-04-25T00:00:00Z
difficulty: intermediate
title: Programlarda tokenlarla etkileşim nasıl yapılır
description: Zincir üstü bir eğitim ile Solana oyunlarında tokenları nasıl kullanacağınızı öğrenin
tags:
  - oyunlar
  - anchor
  - program
  - web3js
  - token uzantıları
  - token 2022
  - rust
keywords:
  - eğitim
  - blokzincir geliştirici
  - blokzincir eğitimi
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
---

Solana üzerindeki tokenlar, oyun içi ödüller, teşvikler veya diğer uygulamalar gibi çeşitli amaçlar için kullanılabilir. Örneğin, belirli oyun içi eylemleri tamamladıklarında oyunculara tokenlar oluşturup dağıtabilirsiniz. Bu örnekte, bir oyunda tokenları mintlemek ve yakmak için bir Anchor programının nasıl ayarlanacağını öğreneceğiz. Eğer tokenları bir PDA'da nasıl depolayacağınızı öğrenmek isterseniz, Solana Playground'daki
[Token Vault örneği](https://beta.solpg.io/tutorials/spl-token-vault) kısmına göz atabilirsiniz.

## Genel Bakış

Bu eğitimde, Solana üzerinde `Token Programı` ile etkileşimin temelini tanıtmak için Anchor kullanarak bir oyun inşa edeceğiz. Oyun, yeni bir token mintleme, oyuncu hesaplarını başlatma, düşmanları yenmek için oyunculara ödül verme ve oyuncuların tokenları yakarak iyileşmelerine izin verme gibi dört ana eylem etrafında yapılandırılacaktır.

Program 4 [talimat](https://docs/core/transactions.md#instruction) içerir:

- `create_mint` - bu talimat, mint yetkisi olarak bir `Program Türetilmiş Adres (PDA)` ile yeni bir token mint oluşturur ve mint için metadata hesabını oluşturur. Bu talimatın yalnızca bir "admin" tarafından çağrılmasına izin veren bir kısıtlama ekleyeceğiz.
- `init_player` - bu talimat, başlangıç sağlık değeri 100 olan yeni bir oyuncu hesabı başlatır.
- `kill_enemy` - bu talimat, bir oyuncunun hesabından "bir düşmanı yenme" durumunda 10 sağlık puanı düşürür ve oyuncu için 1 token mintler.
- `heal` - bu talimat, bir oyuncunun 1 token yakarak sağlık değerini yeniden 100'e döndürmesine izin verir.

> Bu örnek, tokenlarla çalışmak için Metaplex tarafından oluşturulmuş bazı harici araçlar ve programlar kullanmaktadır. Kullanıcı cüzdanları, token mintleri, token hesapları ve token metadata hesapları arasındaki ilişkiye dair yüksek seviyeli bir görünüm elde etmek için
> [Metaplex belgeleri](https://docs.metaplex.com/programs/token-metadata/overview) kısmını keşfetmeyi düşünebilirsiniz.

## Başlarken

Programı oluşturmaya başlamak için [Solana Playground](https://beta.solpg.io/) adresini ziyaret edin ve yeni bir Anchor projesi oluşturun. Eğer Solana Playground'a yeniyseniz, bir Playground Cüzdanı oluşturmanız gerekecek. Son örneği burada bulunan [Savaş jetonları](https://beta.solpg.io/tutorials/battle-coins) kısmında bulabilirsiniz.

Yeni bir proje oluşturduktan sonra, varsayılan başlangıç kodunu aşağıdaki kodla değiştirin:

```rust filename="lib.rs"
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata},
    token::{burn, mint_to, Burn, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::{pda::find_metadata_account, state::DataV2};
use solana_program::{pubkey, pubkey::Pubkey};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod anchor_token {
    use super::*;
}
```

Burada sadece bu program için kullanacağımız crate'leri ve ilgili modülleri kapsamımıza alıyoruz. SPL Token programı ile etkileşimde bulunmamıza yardımcı olmak için `anchor_spl` ve `mpl_token_metadata` crate'lerini kullanacağız.

## Mint Oluşturma Talimatı

Öncelikle, yeni bir token mint ve metadata hesabı oluşturmak için bir talimat uygulayalım. Zincir üzerindeki token metadata'sı, isim, sembol ve URI gibi parametreler olarak talimata sağlanacaktır.

:::tip
Ayrıca, yalnızca bir "admin" bu talimatı kullanabilecektir ve bunu sağlamanın yolu bir `ADMIN_PUBKEY` sabiti tanımlamak ve bunu bir kısıtlama olarak kullanmaktır. `ADMIN_PUBKEY` değerini Solana Playground cüzdanınızın public key'i ile değiştirmeyi unutmayın.
:::

`create_mint` talimatı, aşağıdaki hesapları gerektirir:

- `admin` - işlemi imzalayan ve hesapların başlatılması için ödeme yapan `ADMIN_PUBKEY`
- `reward_token_mint` - bir PDA kullanarak başlattığımız yeni token mint
- `metadata_account` - token mint için başlattığımız metadata hesabı
- `token_program` - Token programında talimatlarla etkileşimde bulunmak için gereklidir
- `token_metadata_program` - Token Metadata programındaki talimatlarla etkileşimde bulunmak için gerekli olan hesap
- `system_program` - yeni bir hesap oluşturulurken gerekli olan bir hesap
- `rent` - metadata hesabını oluştururken gerekli olan Sysvar Rent

```rust filename="lib.rs" {2}
// Sadece bu public key bu talimatı çağırabilir
const ADMIN_PUBKEY: Pubkey = pubkey!("REPLACE_WITH_YOUR_WALLET_PUBKEY");

#[program]
pub mod anchor_token {
    use super::*;

    // PDA ile mint authority olarak yeni token mint oluştur
    pub fn create_mint(
        ctx: Context<CreateMint>,
        uri: String,
        name: String,
        symbol: String,
    ) -> Result<()> {
        // CPI için "imzalamak" için PDA tohumları ve bump
        let seeds = b"reward";
        let bump = *ctx.bumps.get("reward_token_mint").unwrap();
        let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

        // Mint için zincir üzerindeki token metadata'sı
        let data_v2 = DataV2 {
            name: name,
            symbol: symbol,
            uri: uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        // CPI Bağlamı
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(), // oluşturulan metadata hesabı
                mint: ctx.accounts.reward_token_mint.to_account_info(), // metadata hesabının mint hesabı
                mint_authority: ctx.accounts.reward_token_mint.to_account_info(), // mint hesabının mint authority'si
                update_authority: ctx.accounts.reward_token_mint.to_account_info(), // metadata hesabının güncelleme yetkisi
                payer: ctx.accounts.admin.to_account_info(), // metadata hesabını oluşturmak için ödeme yapan
                system_program: ctx.accounts.system_program.to_account_info(), // sistem program hesabı
                rent: ctx.accounts.rent.to_account_info(), // rent sysvar hesabı
            },
            signer,
        );

        create_metadata_accounts_v3(
            cpi_ctx, // cpi bağlamı
            data_v2, // token metadata'sı
            true,    // değiştirilebilir
            true,    // güncelleme yetkisi imzacı
            None,    // koleksiyon detayları
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMint<'info> {
    #[account(
        mut,
        address = ADMIN_PUBKEY
    )]
    pub admin: Signer<'info>,

    // PDA, hem mint hesabının adresi hem de mint authoritysidir
    #[account(
        init,
        seeds = [b"reward"],
        bump,
        payer = admin,
        mint::decimals = 9,
        mint::authority = reward_token_mint,

    )]
    pub reward_token_mint: Account<'info, Mint>,

    ///CHECK: metadata hesap adresinin doğrulanması için "address" kısıtlaması kullanılıyor
    #[account(
        mut,
        address=find_metadata_account(&reward_token_mint.key()).0
    )]
    pub metadata_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

`create_mint` talimatı, bir Program Türetilmiş Adres (PDA) kullanarak yeni bir token mint oluşturur; bu adres hem token mint'in adresi hem de mint authority olarak kullanılır. Talimat, bir URI (offchain metadata), isim ve sembol alır.

Bu talimat daha sonra, Token Metadata programından `create_metadata_accounts_v3` talimatını çağırarak token mint için bir metadata hesabı oluşturur.

PDA, metadata hesabı oluşturulurken gerekli bir imza olan mint authority'dir. Talimat verileri (URI, isim, sembol), yeni token mint'inin metadata'sını belirtmek için `DataV2` struct'ında yer alır.

Ayrıca, işlemi imzalayan `admin` hesabının adresinin `ADMIN_PUBKEY` sabitinin değeriyle eşleştiğini doğruluyoruz; böylece yalnızca istediğimiz cüzdan bu talimatı kullanabilir.

```rust
const ADMIN_PUBKEY: Pubkey = pubkey!("REPLACE_WITH_YOUR_WALLET_PUBKEY");
```

## Oyuncu Başlatma Talimatı

Sonraki adımda, başlangıç sağlık değeri 100 olan yeni bir oyuncu hesabı oluşturan `init_player` talimatını implement edelim. `MAX_HEALTH` sabiti, başlangıç sağlık değerini temsil etmek için 100 olarak ayarlanmıştır.

`init_player` talimatı aşağıdaki hesapları gerektirir:

- `player_data` - başlattığımız yeni oyuncu hesabı, oyuncunun sağlığını saklayacaktır
- `player` - işlemi imzalayan ve hesabın başlatılması için ödeyen kullanıcı
- `system_program` - yeni bir hesap oluşturulurken gerekli olan bir hesap

```rust filename="lib.rs"
// Oyuncunun maksimum sağlığı
const MAX_HEALTH: u8 = 100;

#[program]
pub mod anchor_token {
    use super::*;
    ...

    // Yeni oyuncu hesabı oluştur
    pub fn init_player(ctx: Context<InitPlayer>) -> Result<()> {
        ctx.accounts.player_data.health = MAX_HEALTH;
        Ok(())
    }
}
...

#[derive(Accounts)]
pub struct InitPlayer<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + 8,
        seeds = [b"player".as_ref(), player.key().as_ref()],
        bump,
    )]
    pub player_data: Account<'info, PlayerData>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PlayerData {
    pub health: u8,
}
```

`player_data` hesabı, `player` public key'inin bir tohum olarak kullanılmasıyla bir Program Türetilmiş Adres (PDA) kullanılarak başlatılır. Bu, her `player_data` hesabının benzersiz olmasını ve `player` ile ilişkilendirilmesini sağlar, böylece her oyuncu kendi `player_data` hesabını oluşturabilir.

## Düşmanı Öldürme Talimatı

Bir sonraki adımda, oyuncunun sağlığını 10 azaltan ve oyuncunun token hesabına ödül olarak 1 token mintleyen `kill_enemy` talimatını uygulayalım.

`kill_enemy` talimatı aşağıdaki hesapları gerektirir:

- `player` - tokenı alan oyuncu
- `player_data` - oyuncunun mevcut sağlığını saklayan oyuncu verisi hesabı
- `player_token_account` - tokenların mintleneceği oyuncunun bağlı token hesabı
- `reward_token_mint` - mintlenecek token türünü belirten token mint hesabı
- `token_program` - token programındaki talimatlarla etkileşimde bulunmak için gereklidir
- `associated_token_program` - bağlı token hesapları ile çalışırken gereklidir
- `system_program` - yeni bir hesap oluşturulurken gerekli olan bir hesap

```rust filename="lib.rs"
#[program]
pub mod anchor_token {
    use super::*;
    ...

    // Oyuncu token hesabına token mintle
    pub fn kill_enemy(ctx: Context<KillEnemy>) -> Result<()> {
        // Oyuncunun yeterli sağlığı olup olmadığını kontrol et
        if ctx.accounts.player_data.health == 0 {
            return err!(ErrorCode::NotEnoughHealth);
        }
        // Oyuncunun sağlığından 10 çıkar
        ctx.accounts.player_data.health = ctx.accounts.player_data.health.checked_sub(10).unwrap();

        // CPI için "imzalamak" için PDA tohumları ve bump
        let seeds = b"reward";
        let bump = *ctx.bumps.get("reward_token_mint").unwrap();
        let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

        // CPI Bağlamı
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.reward_token_mint.to_account_info(),
                to: ctx.accounts.player_token_account.to_account_info(),
                authority: ctx.accounts.reward_token_mint.to_account_info(),
            },
            signer,
        );

        // 1 token mintle, mintin ondalıklarına dikkat et
        let amount = (1u64)
            .checked_mul(10u64.pow(ctx.accounts.reward_token_mint.decimals as u32))
            .unwrap();

        mint_to(cpi_ctx, amount)?;
        Ok(())
    }
}
...

#[derive(Accounts)]
pub struct KillEnemy<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"player".as_ref(), player.key().as_ref()],
        bump,
    )]
    pub player_data: Account<'info, PlayerData>,

    // Oyuncu token hesabı yoksa başlat
    #[account(
        init_if_needed,
        payer = player,
        associated_token::mint = reward_token_mint,
        associated_token::authority = player
    )]
    pub player_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"reward"],
        bump,
    )]
    pub reward_token_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Yeterli sağlık yok")]
    NotEnoughHealth,
}
```

Oyuncunun sağlığı, "düşmanla mücadelenin" bir temsilcisi olarak 10 azaltılır. Ayrıca, oyuncunun mevcut sağlığını kontrol ediyor ve eğer sağlık 0 ise özel bir Anchor hatası döndürüyoruz.

Talimat daha sonra `mint_to` talimatını Token programından çağırarak bir çapraz program çağrısı (CPI) gerçekleştirir ve 1 tokenı `reward_token_mint`'ten `player_token_account`'a öldürme ödülü olarak mintler.

Token mintinin mint authority'si bir Program Türetilmiş Adres (PDA) olduğundan, ek imzacılara ihtiyaç duymadan bu talimatı çağırarak tokenları mintleyebiliriz. Program, PDA adına "imzalamak" için imza atabilir, böylece token mintleme işlemi için ek imzacı gerektirmeden gerçekleştirilir.

## İyileştirme Talimatı

Sonraki adımda, oyuncunun 1 token yakarak sağlığını maksimum değerine yeniden döndürmesine izin veren `heal` talimatını uygulayalım.

`heal` talimatı aşağıdaki hesapları gerektirir:

- `player` - iyileştirme eylemini gerçekleştiren oyuncu
- `player_data` - oyuncunun mevcut sağlığını saklayan oyuncu veri hesabı
- `player_token_account` - tokenların yakılacağı oyuncunun bağlı token hesabı
- `reward_token_mint` - yakılacak token türünü belirten token mint hesabı
- `token_program` - token programındaki talimatlarla etkileşimde bulunmak için gereklidir
- `associated_token_program` - bağlı token hesapları ile çalışırken gereklidir

```rust filename="lib.rs"
#[program]
pub mod anchor_token {
    use super::*;
    ...

    // Oyuncunun sağlığı için token yak
    pub fn heal(ctx: Context<Heal>) -> Result<()> {
        ctx.accounts.player_data.health = MAX_HEALTH;

        // CPI Bağlamı
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.reward_token_mint.to_account_info(),
                from: ctx.accounts.player_token_account.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        );

        // 1 token yak, mintin ondalıklarına dikkat et
        let amount = (1u64)
            .checked_mul(10u64.pow(ctx.accounts.reward_token_mint.decimals as u32))
            .unwrap();

        burn(cpi_ctx, amount)?;
        Ok(())
    }
}
...

#[derive(Accounts)]
pub struct Heal<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"player".as_ref(), player.key().as_ref()],
        bump,
    )]
    pub player_data: Account<'info, PlayerData>,

    #[account(
        mut,
        associated_token::mint = reward_token_mint,
        associated_token::authority = player
    )]
    pub player_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"reward"],
        bump,
    )]
    pub reward_token_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
```

Oyuncunun sağlığı `heal` talimatı ile maksimum değerine geri döndürülür. Talimat daha sonra, oyuncunun `player_token_account`'ından tokenı yakmak için Token programından `burn` talimatını çağırmak üzere bir çapraz program çağrısı (CPI) gerçekleştirir.

## Inşa Et ve Dağıt

Harika bir iş çıkardınız! Şimdi programı oluşturup dağıtabilirsiniz. Nihai programınız aşağıdaki gibi görünmelidir:

```rust filename="lib.rs"
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata},
    token::{burn, mint_to, Burn, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::{pda::find_metadata_account, state::DataV2};
use solana_program::{pubkey, pubkey::Pubkey};

declare_id!("CCLnXJAJYFjCHLCugpBCEQKrpiSApiRM4UxkBUHJRrv4");

const ADMIN_PUBKEY: Pubkey = pubkey!("REPLACE_WITH_YOUR_WALLET_PUBKEY");
const MAX_HEALTH: u8 = 100;
```

#[program]
pub mod anchor_token {
    use super::*;

    // Yeni bir token mint oluştur PDA'yı mint yetkisi olarak kullanarak
    pub fn create_mint(
        ctx: Context,
        uri: String,
        name: String,
        symbol: String,
    ) -> Result {
        // PDA tohumları ve bump CPI için "imzalama"
        let seeds = b"reward";
        let bump = *ctx.bumps.get("reward_token_mint").unwrap();
        let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

        // Mint için on-chain token metadata
        let data_v2 = DataV2 {
            name: name,
            symbol: symbol,
            uri: uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        // CPI Bağlamı
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(), // oluşturulan metadata hesabı
                mint: ctx.accounts.reward_token_mint.to_account_info(), // metadata hesabının mint hesabı
                mint_authority: ctx.accounts.reward_token_mint.to_account_info(), // mint hesabının mint yetkisi 
                update_authority: ctx.accounts.reward_token_mint.to_account_info(), // metadata hesabının güncelleme yetkisi
                payer: ctx.accounts.admin.to_account_info(), // metadata hesabının oluşturulması için ödeyici
                system_program: ctx.accounts.system_program.to_account_info(), // sistem program hesabı
                rent: ctx.accounts.rent.to_account_info(), // kiralama sysvar hesabı
            },
            signer,
        );

        create_metadata_accounts_v3(
            cpi_ctx, // cpi bağlamı
            data_v2, // token metadata
            true,    // değiştirilebilir mi
            true,    // güncelleme yetkisi imzalayıcı mı
            None,    // koleksiyon detayları
        )?;

        Ok(())
    }

    // Yeni bir oyuncu hesabı oluştur
    pub fn init_player(ctx: Context) -> Result {
        ctx.accounts.player_data.health = MAX_HEALTH;
        Ok(())
    }

    // Oyuncu token hesabına token mint et
    pub fn kill_enemy(ctx: Context) -> Result {
        // Oyuncunun yeterli sağlığı olup olmadığını kontrol et
        if ctx.accounts.player_data.health == 0 {
            return err!(ErrorCode::NotEnoughHealth);
        }
        // Oyuncudan 10 sağlık çıkar

        ctx.accounts.player_data.health = ctx.accounts.player_data.health.checked_sub(10).unwrap();
        // PDA tohumları ve bump CPI için "imzalama"
        let seeds = b"reward";
        let bump = *ctx.bumps.get("reward_token_mint").unwrap();
        let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

        // CPI Bağlamı
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.reward_token_mint.to_account_info(),
                to: ctx.accounts.player_token_account.to_account_info(),
                authority: ctx.accounts.reward_token_mint.to_account_info(),
            },
            signer,
        );

        // Mint 1 token, mint'in ondalıklarını hesaba kat
        let amount = (1u64)
            .checked_mul(10u64.pow(ctx.accounts.reward_token_mint.decimals as u32))
            .unwrap();

        mint_to(cpi_ctx, amount)?;
        Ok(())
    }

    // Oyuncunun sağlığını iyileştir
    pub fn heal(ctx: Context) -> Result {
        ctx.accounts.player_data.health = MAX_HEALTH;

        // CPI Bağlamı
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.reward_token_mint.to_account_info(),
                from: ctx.accounts.player_token_account.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        );

        // 1 token yak, mint'in ondalıklarını hesaba kat
        let amount = (1u64)
            .checked_mul(10u64.pow(ctx.accounts.reward_token_mint.decimals as u32))
            .unwrap();

        burn(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMint {
    #[account(
        mut,
        address = ADMIN_PUBKEY
    )]
    pub admin: Signer,

    // PDA hem mint hesabının adresi hem de mint yetkisi
    #[account(
        init,
        seeds = [b"reward"],
        bump,
        payer = admin,
        mint::decimals = 9,
        mint::authority = reward_token_mint,

    )]
    pub reward_token_mint: Account,

    ///CHECK: Metadata hesabı adresini doğrulamak için "address" kısıtlaması kullanılıyor
    #[account(
        mut,
        address=find_metadata_account(&reward_token_mint.key()).0
    )]
    pub metadata_account: UncheckedAccount,

    pub token_program: Program,
    pub token_metadata_program: Program,
    pub system_program: Program,
    pub rent: Sysvar,
}

#[derive(Accounts)]
pub struct InitPlayer {
    #[account(
        init,
        payer = player,
        space = 8 + 8,
        seeds = [b"player".as_ref(), player.key().as_ref()],
        bump,
    )]
    pub player_data: Account,
    #[account(mut)]
    pub player: Signer,
    pub system_program: Program,
}

#[derive(Accounts)]
pub struct KillEnemy {
    #[account(mut)]
    pub player: Signer,

    #[account(
        mut,
        seeds = [b"player".as_ref(), player.key().as_ref()],
        bump,
    )]
    pub player_data: Account,

    // Oyuncu token hesabını initialize et, eğer mevcut değilse
    #[account(
        init_if_needed,
        payer = player,
        associated_token::mint = reward_token_mint,
        associated_token::authority = player
    )]
    pub player_token_account: Account,

    #[account(
        mut,
        seeds = [b"reward"],
        bump,
    )]
    pub reward_token_mint: Account,

    pub token_program: Program,
    pub associated_token_program: Program,
    pub system_program: Program,
}

#[derive(Accounts)]
pub struct Heal {
    #[account(mut)]
    pub player: Signer,

    #[account(
        mut,
        seeds = [b"player".as_ref(), player.key().as_ref()],
        bump,
    )]
    pub player_data: Account,

    #[account(
        mut,
        associated_token::mint = reward_token_mint,
        associated_token::authority = player
    )]
    pub player_token_account: Account,

    #[account(
        mut,
        seeds = [b"reward"],
        bump,
    )]
    pub reward_token_mint: Account,

    pub token_program: Program,
    pub associated_token_program: Program,
}

#[account]
pub struct PlayerData {
    pub health: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Yeterli sağlık yok")]
    NotEnoughHealth,
}

## Müşteri ile Başlarken

Bu bölümde, program ile etkileşim kurmak için basit bir istemci tarafı uygulamasını yürüyerek göstereceğiz. Başlamak için, Solana Playground'daki `client.ts` dosyasına gidin, yer tutucu kodu kaldırın ve aşağıdaki bölümlerden kod parçalarını ekleyin.

Öncelikle, kurulum için aşağıdaki kodu ekleyin.

```js filename="client.ts"
import { Metaplex } from "@metaplex-foundation/js";
import { getMint, getAssociatedTokenAddressSync } from "@solana/spl-token";

// metaplex token metadata program ID
const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

// metaplex ayarlama
const metaplex = Metaplex.make(pg.connection);

// token metadata
const metadata = {
  uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
  name: "Solana Gold",
  symbol: "GOLDSOL",
};

// ödül token mint PDA'sı
const [rewardTokenMintPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("reward")],
  pg.PROGRAM_ID,
);

// oyuncu veri hesabı PDA'sı
const [playerPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("player"), pg.wallet.publicKey.toBuffer()],
  pg.PROGRAM_ID,
);

// ödül token mint metadata hesabı adresi
const rewardTokenMintMetadataPDA = await metaplex
  .nfts()
  .pdas()
  .metadata({ mint: rewardTokenMintPda });

// oyuncu token hesabı adresi
const playerTokenAccount = getAssociatedTokenAddressSync(
  rewardTokenMintPda,
  pg.wallet.publicKey,
);
```

Sonraki iki yardımcı fonksiyonu ekleyin. Bu fonksiyonlar, işlemleri onaylamak ve hesap verilerini almak için kullanılacaktır.

```js
async function logTransaction(txHash) {
  const { blockhash, lastValidBlockHeight } =
    await pg.connection.getLatestBlockhash();

  await pg.connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature: txHash,
  });

  console.log(`Loglar için 'solana confirm -v ${txHash}' kullanın`);
}

async function fetchAccountData() {
  const [playerBalance, playerData] = await Promise.all([
    pg.connection.getTokenAccountBalance(playerTokenAccount),
    pg.program.account.playerData.fetch(playerPDA),
  ]);

  console.log("Oyuncu Token Bakiyesi: ", playerBalance.value.uiAmount);
  console.log("Oyuncu Sağlığı: ", playerData.health);
}
```

Ardından, mevcut değilse yeni bir token mint oluşturmak için `createMint` talimatını çağırın:

```js
let txHash;

try {
  const mintData = await getMint(pg.connection, rewardTokenMintPda);
  console.log("Mint Zaten Var");
} catch {
  txHash = await pg.program.methods
    .createMint(metadata.uri, metadata.name, metadata.symbol)
    .accounts({
      rewardTokenMint: rewardTokenMintPda,
      metadataAccount: rewardTokenMintMetadataPDA,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    .rpc();
  await logTransaction(txHash);
}
console.log("Token Mint: ", rewardTokenMintPda.toString());
```

Sonrasında, mevcut değilse yeni bir oyuncu hesabı oluşturmak için `initPlayer` talimatını çağırın.

```js
try {
  const playerData = await pg.program.account.playerData.fetch(playerPDA);
  console.log("Oyuncu Zaten Var");
  console.log("Oyuncu Sağlığı: ", playerData.health);
} catch {
  txHash = await pg.program.methods
    .initPlayer()
    .accounts({
      playerData: playerPDA,
      player: pg.wallet.publicKey,
    })
    .rpc();
  await logTransaction(txHash);
  console.log("Oyuncu Hesabı Oluşturuldu");
}
```

Sonra, `killEnemy` talimatını çağırın:

```js
txHash = await pg.program.methods
  .killEnemy()
  .accounts({
    playerData: playerPDA,
    playerTokenAccount: playerTokenAccount,
    rewardTokenMint: rewardTokenMintPda,
  })
  .rpc();
await logTransaction(txHash);
console.log("Düşman Yenildi");
await fetchAccountData();
```

Son olarak, `heal` talimatını çağırın:

```js
txHash = await pg.program.methods
  .heal()
  .accounts({
    playerData: playerPDA,
    playerTokenAccount: playerTokenAccount,
    rewardTokenMint: rewardTokenMintPda,
  })
  .rpc();
await logTransaction(txHash);
console.log("Oyuncu İyileştirildi");
await fetchAccountData();
```

Son olarak, Solana Playground'da “Çalıştır” butonuna tıklayarak istemciyi çalıştırın. Konsola yazdırılan Token Mint adresini kopyalayabilir ve Solana Explorer'da tokenin şimdi metadata'ya sahip olduğunu doğrulayabilirsiniz. Çıktı aşağıdakine benzer olmalıdır:

```
İstemci çalışıyor...
  client.ts:
    Loglar için 'solana confirm -v 3AWnpt2Wy6jQckue4QeKsgDNKhKkhpewPmRtxvJpzxGgvK9XK9KEpTiUzAQ5vSC6CUoUjc6xWZCtrihVrFy8sACC' kullanın
    Token Mint:  3eS7hdyeVX5g8JGhn3Z7qFXJaewoJ8hzgvubovQsPm4S
    Loglar için 'solana confirm -v 63jbBr5U4LG75TiiHfz65q7yKJfHDhGP2ocCiDat5M2k4cWtUMAx9sHvxhnEguLDKXMbDUQKUt1nhvyQkXoDhxst' kullanın
    Oyuncu Hesabı Oluşturuldu
    Loglar için 'solana confirm -v 2ziK41WLoxfEHvtUgc5c1SyKCAr5FvAS54ARBJrjqh9GDwzYqu7qWCwHJCgMZyFEVovYK5nUZhDRHPTMrTjq1Mm6' kullanın
    Düşman Yenildi
    Oyuncu Token Bakiyesi:  1
    Oyuncu Sağlığı:  90
    Loglar için 'solana confirm -v 2QoAH22Q3xXz9t2TYRycQMqpEmauaRvmUfZ7ZNKUEoUyHWqpjW972VD3eZyeJrXsviaiCC3g6TE54oKmKbFQf2Q7' kullanın
    Oyuncu İyileştirildi
    Oyuncu Token Bakiyesi:  0
    Oyuncu Sağlığı:  100