---
date: 2024-04-25T00:00:00Z
difficulty: intermediate
title: PDA'da SOL Depolama
description:
  PDA'ları kullanarak, oyununuzu oynayan oyunculara SOL ödülü verebilirsiniz. Oyuncuların bu oyunda sandıkları bulduğunda bir PDA'dan nasıl SOL ödülü vereceğinizi öğrenin.
tags:
  - oyunlar
  - anchor
  - program
  - web3js
  - rust
keywords:
  - eğitim
  - blokzincir geliştiricisi
  - blokzincir eğitimi
  - web3 geliştiricisi
  - anchor
  - oyunlar
  - örnek
---

Burada SOL'u bir PDA'da nasıl depolayacağınızı öğreneceksiniz. Örnek olarak, bunu bir oyunda oyunculara ödül vermek için kullanacağız. **Oyuncuların sağa hareket edebileceği** ve belirli bir pozisyona ulaştıklarında bir ödül toplayabileceği basit bir oyun inşa edeceğiz. **Ödül, bir PDA'da depolanacak** ve oyuncular oyuna etkileşimde bulunarak bunu talep edebilecekler.

:::tip
**İpucu:** Oyuncuların ödülleri alabilmesi için doğru pozisyona ulaşmaları önemlidir.
:::

Video geçişi:



## Küçük Macera Anchor Programı - İkinci Bölüm

Bu eğitimde, Küçük Macera oyununu yeniden inşa edeceğiz ve **0.1 SOL ödülü** olan bir sandık tanıtacağız. Sandık belirli bir konumda "oluşacak" ve oyuncu o konuma ulaştığında ödülü alacak. Bu programın amacı, **SOL'u bir program hesabında nasıl depolayacağınızı** ve bunu oyunculara nasıl dağıtacağınızı göstermek.

Küçük Macera İki Programı 3 talimattan oluşmaktadır:

- `initialize_level_one` - Bu talimat, **oyuncunun pozisyonunu kaydetmek** için bir ve "ödül sandığı" temsil eden **SOL ödülünü** tutmak için başka bir on-chain hesabı başlatır.
- `reset_level_and_spawn_chest` - Bu talimat, oyuncunun pozisyonunu sıfırlar ve talimatı çağıran kullanıcıdan ödemeyi alarak bir ödül sandığını "yeniden oluşturur".
- `move_right` - Bu talimat, oyuncunun pozisyonunu sağa hareket ettirmesine ve belirli bir pozisyona ulaştıklarında ödül sandığında **SOL'u toplamalarına** olanak tanır.

Aşağıdaki bölümlerde, programı adım adım nasıl inşa edeceğinizi anlatacağız. Tam kaynak kodunu, doğrudan tarayıcınızdan Solana Playground kullanarak dağıtabileceğiniz bağlantıda bulabilirsiniz: [Playground'da Aç](https://beta.solpg.io/tutorials/tiny-adventure-two).

---

### Başlarken

Küçük Macera oyununu inşa etmeye başlamak için bu adımları izleyin:

1. [Solana Playground](https://beta.solpg.io/) adresini ziyaret edin ve yeni bir Anchor projesi oluşturun.
2. Solana Playground'a yeni iseniz, ayrıca bir Playground Cüzdanı oluşturmanız gerekecek.

Yeni bir proje oluşturduktan sonra, varsayılan başlangıç kodunu aşağıdaki kodla değiştirin:

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program;

declare_id!("11111111111111111111111111111111");

#[program]
mod tiny_adventure_two {
    use super::*;
}

fn print_player(player_position: u8) {
    if player_position == 0 {
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.........💎");
    } else if player_position == 1 {
        msg!("..o.......💎");
    } else if player_position == 2 {
        msg!("....o.....💎");
    } else if player_position == 3 {
        msg!("........\\o/💎");
        msg!("..........\\o/");
        msg!("Sonuna ulaştınız! Harika!");
    }
}
```

Bu oyunda, oyuncu 0 pozisyonunda başlar ve sadece sağa hareket edebilir. **Oyuncunun ödül sandığına doğru ilerleyişini** görselleştirmek için mesaj günlüklerini kullanacağız!

### Sandık Kasa Hesabını Tanımlama

Programın başında `CHEST_REWARD` sabitini ekleyin. `CHEST_REWARD`, sandığa konulacak ve ödül olarak verilecek lamport miktarını temsil eder. **Lamportlar**, 1 SOL eşdeğerinde 1 milyar lamportun en küçük kesirleridir.

SOL ödülünü depolamak için **yeni bir `ChestVaultAccount` yapısı** tanımlayacağız. Bu boş bir yapıdır çünkü doğrudan hesapta lamportları güncelleyeceğiz. Hesap, SOL ödülünü tutacak ve ek veri saklamasına ihtiyaç duymayacaktır.

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program;

declare_id!("11111111111111111111111111111111");

#[program]
mod tiny_adventure_two {
    use super::*;

    // Sandıklara konulacak ve ödül olarak verilecek lamport miktarı.
    const CHEST_REWARD: u64 = LAMPORTS_PER_SOL / 10; // 0.1 SOL
}

// Sandık Kasa Hesabı yapısını tanımla
#[account]
pub struct ChestVaultAccount {}
```

### Oyun Verisi Hesabını Tanımlama

Oyuncunun pozisyonunu oyunda **takip etmek** için, oyuncunun pozisyonunu saklayacak olan on-chain hesabı için bir yapı tanımlamamız gerekiyor. 

`GameDataAccount` yapısı, oyuncunun mevcut pozisyonunu unsigned 8-bit tamsayı olarak saklayan tek bir alana sahiptir.

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program;

declare_id!("11111111111111111111111111111111");

#[program]
mod tiny_adventure_two {
    use super::*;
    ...

}

// Oyun Verisi Hesabı yapısını tanımla
#[account]
pub struct GameDataAccount {
    player_position: u8,
}
```

`GameDataAccount` yapısı tanımlandıktan sonra, oyuna etkileşimde bulundukça oyuncunun pozisyonunu saklamak ve güncellemek için bunu kullanabilirsiniz. **Oyuncu sağa doğru hareket ettikçe** ve oyunda ilerledikçe, pozisyonları `GameDataAccount` içinde güncellenecek ve SOL ödülünü içeren sandığa doğru ilerlemelerini takip edebileceksiniz.

### Seviye Bir Talimatını Başlat

`GameDataAccount` ve `ChestVaultAccount` tanımlı olduğu için, `initialize_level_one` talimatını uygulayalım. Bu talimat, hem `GameDataAccount` hem de `ChestVaultAccount`'ı başlatır, oyuncunun pozisyonunu 0 olarak ayarlar ve başlangıç mesajını gösterir.

`initialize_level_one` talimatı 4 hesap gerektirir:

- `new_game_data_account` - oyuncunun pozisyonunu saklamak için başlattığımız `GameDataAccount`
- `chest_vault` - SOL ödülünü saklamak için başlattığımız `ChestVaultAccount`
- `signer` - hesapların başlatılması için ödeme yapan oyuncu
- `system_program` - yeni bir hesap oluştururken gereken bir hesap

```rust
#[program]
pub mod tiny_adventure_two {
    use super::*;

    pub fn initialize_level_one(_ctx: Context<InitializeLevelOne>) -> Result<()> {
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.......💎");
        Ok(())
    }

    ...
}

// initialize_level_one talimatının gerektirdiği hesapları belirt
#[derive(Accounts)]
pub struct InitializeLevelOne<'info> {
    #[account(
        init_if_needed,
        seeds = [b"level1"],
        bump,
        payer = signer,
        space = 8 + 1
    )]
    pub new_game_data_account: Account<'info, GameDataAccount>,
    #[account(
        init_if_needed,
        seeds = [b"chestVault"],
        bump,
        payer = signer,
        space = 8
    )]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

...
```

Her iki `GameDataAccount` ve `ChestVaultAccount`, hesap adresinin bulunabilirliğini sağlamak için bir Program Türetilmiş Adres (PDA) kullanılarak oluşturulmaktadır; bu, bize daha sonra adresi deterministik olarak bulma olanağı sağlar. `init_if_needed` kısıtlaması, hesapların yalnızca mevcut olmadıklarında başlatılmasını sağlar. Bu talimatta her iki hesabın PDA'ları tek bir sabit tohum kullanır, bu nedenle program yalnızca birer adet oluşturabilir. Sonuç olarak, bu talimat yalnızca bir kez çağrılmalıdır.

Mevcut uygulamanın, `GameDataAccount`'ı kimlerin değiştirebileceği konusunda bir kısıtlama olmadığını belirtmek gerekir; bu, oyunu çok oyunculu bir deneyime dönüştürerek herkesin oyuncunun hareketlerini kontrol etmesine olanak tanır.

:::info
**Not:** Alternatif olarak, `initialize` talimatında imzalayanın adresini ekstra bir tohum olarak kullanabilir ve her oyuncunun kendi `GameDataAccount`'ını oluşturmasına izin verebilirsiniz.
:::

### Seviye Sıfırla ve Sandığı Oluştur Talimatı

Sonraki olarak, oyuncunun pozisyonunu başlangıç noktasına sıfırlayan ve sandığı 0.1 SOL'luk bir ödülle dolduran `reset_level_and_spawn_chest` talimatını uygulayalım.

`reset_level_and_spawn_chest` talimatı 4 hesap gerektirir:

- `new_game_data_account` - oyuncunun pozisyonunu saklayan `GameDataAccount`
- `chest_vault` - SOL ödülünü saklayan `ChestVaultAccount`
- `signer` - sandık için SOL ödülünü sağlayan oyuncu
- `system_program` - SOL transferinde kullanacağımız program (CPI)

```rust
#[program]
pub mod tiny_adventure_two {
    use super::*;
    ...

    pub fn reset_level_and_spawn_chest(ctx: Context<SpawnChest>) -> Result<()> {
        ctx.accounts.game_data_account.player_position = 0;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info().clone(),
                to: ctx.accounts.chest_vault.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, CHEST_REWARD)?;

        msg!("Seviye Sıfırlandı ve Sandık pozisyon 3'te Oluşturuldu");

        Ok(())
    }

    ...
}

// reset_level_and_spawn_chest talimatının gerektirdiği hesapları belirt
#[derive(Accounts)]
pub struct SpawnChest<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, seeds = [b"chestVault"], bump)]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
    pub system_program: Program<'info, System>,
}

...
```

Bu talimat, ödül sandığına SOL transferinde kullanmak üzere bir çapraz program çağrısı (CPI) içerir. **Çapraz program çağrısı**, bir programın başka bir programın talimatını çağırmasıdır. Bu durumda, `payer`'dan `ChestVaultAccount`'a SOL'u aktarmak için `system_program`'dan `Transfer` talimatını çağırmak için bir CPI kullanıyoruz.

:::warning
**Uyarı:** Çapraz program çağrıları, Solana programlama modelinde önemli bir kavramdır; bu nedenle, programların diğer programların talimatlarıyla doğrudan etkileşimde bulunmasını sağlamak için doğru yapılması gerekir.
:::

### Sağa Hareket Talimatı

Son olarak, sandık ödülünü toplama mantığını içeren `move_right` talimatını uygulayalım. Bir oyuncu pozisyon 3'e ulaştığında ve doğru "şifreyi" girerse, ödül **`ChestVaultAccount`**'dan oyuncunun hesabına transfer edilir. Eğer yanlış bir şifre girilirse, özel bir Anchor Hatası döndürülür. Eğer oyuncu zaten pozisyon 3'teyse, bir mesaj kaydedilir. Aksi takdirde, pozisyon 1 arttırılır ve sağa hareket ettiği görüntülenir.

Bu "şifre" işlevinin ana amacı, bir talimata parametreler eklemeyi ve geliştirilen özel Anchor Hatalarını uygulamayı göstermektir. Bu örnekte, doğru şifre "gib" olacaktır.

`move_right` talimatı 3 hesap gerektirir:

- `new_game_data_account` - oyuncunun pozisyonunu saklayan `GameDataAccount`
- `chest_vault` - SOL ödülünü saklayan `ChestVaultAccount`
- `player_wallet` - talimatı çağıran oyuncunun cüzdanı ve SOL ödülü alacak potansiyel alıcı

```rust
#[program]
pub mod tiny_adventure_two {
    use super::*;
    ...

    // Sağa hareket talimatı
    pub fn move_right(ctx: Context<MoveRight>, password: String) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 3 {
            msg!("Sonuna ulaştınız! Harika!");
        } else if game_data_account.player_position == 2 {
            if password != "gib" {
                return err!(MyError::WrongPassword);
            }

            game_data_account.player_position = game_data_account.player_position + 1;

            msg!(
                "Başardınız! İşte ödülünüz {0} lamport",
                CHEST_REWARD
            );

            **ctx
                .accounts
                .chest_vault
                .to_account_info()
                .try_borrow_mut_lamports()? -= CHEST_REWARD;
            **ctx
                .accounts
                .player
                .to_account_info()
                .try_borrow_mut_lamports()? += CHEST_REWARD;
        } else {
            game_data_account.player_position = game_data_account.player_position + 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }

    ...
}

// move_right talimatının gerektirdiği hesapları belirt
#[derive(Accounts)]
pub struct MoveRight<'info> {
    #[account(mut, seeds = [b"chestVault"], bump)]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
}

// Özel Anchor Hatası
#[error_code]
pub enum MyError {
    #[msg("Şifre yanlıştı")]
    WrongPassword,
}

...
```

Ödülü sandıktan oyuncu hesabına lamport transfer etmek için, daha önce yaptığımız gibi bir Çapraz Program Çağrısı (CPI) kullanamayız çünkü `ChestVaultAccount` sistem programı tarafından korunmamaktadır. Bunun yerine, `try_borrow_mut_lamports` kullanarak hesapların içindeki lamportları doğrudan değiştiriyoruz. Lamportların düşürüldüğü hesabın imzalayıcı olması gerektiğine dikkat edin; çalışma zamanı her işlemden sonra toplam hesap bakiyelerinin eşit kalmasını sağlıyor.

:::danger
**Kritik Uyarı:** Program Türetilmiş Hesapların (PDA'ların) iki ana özelliği vardır:
1. Bir hesabın adresini bulmanın deterministik bir yolunu sağlamak
2. PDA'dan türetilen programın onlar için "imzalamasına" izin vermek
:::

Bu, `ChestVaultAccount`'tan lamportları düşürebilmemizi sağlar; çünkü talimat için açıkça ek bir imzalayıcı talep etmeye gerek yoktur.

### İnşa Et ve Dağıt

Tebrikler! Artık **Küçük Macera programının ikinci bölümünü** tamamladınız! Nihai programınız şöyle görünmelidir:

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program;

// Bu, programınızın genel anahtarıdır ve proje derlendiğinde otomatik olarak güncellenecektir.
declare_id!("7gZTdZg86YsYbs92Rhv63kZUAkoww1kLexJg8sNpgVQ3");

#[program]
mod tiny_adventure_two {
    use super::*;

    // Sandıklara konulacak ve ödül olarak verilecek lamport miktarı.
    const CHEST_REWARD: u64 = LAMPORTS_PER_SOL / 10; // 0.1 SOL

    pub fn initialize_level_one(_ctx: Context<InitializeLevelOne>) -> Result<()> {
        // Genellikle üretim kodunuzda çok fazla metin yazmazdınız çünkü bu işlem birimi maliyetlidir.
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.......💎");
        Ok(())
    }

    pub fn reset_level_and_spawn_chest(ctx: Context<SpawnChest>) -> Result<()> {
        ctx.accounts.game_data_account.player_position = 0;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info().clone(),
                to: ctx.accounts.chest_vault.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, CHEST_REWARD)?;

        msg!("Seviye Sıfırlandı ve Sandık pozisyon 3'te Oluşturuldu");

        Ok(())
    }

    pub fn move_right(ctx: Context<MoveRight>, password: String) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 3 {
            msg!("Sonuna ulaştınız! Harika!");
        } else if game_data_account.player_position == 2 {
            if password != "gib" {
                return err!(MyError::WrongPassword);
            }

            game_data_account.player_position = game_data_account.player_position + 1;

            msg!(
                "Başardınız! İşte ödülünüz {0} lamport",
                CHEST_REWARD
            );

            **ctx
                .accounts
                .chest_vault
                .to_account_info()
                .try_borrow_mut_lamports()? -= CHEST_REWARD;
            **ctx
                .accounts
                .player
                .to_account_info()
                .try_borrow_mut_lamports()? += CHEST_REWARD;
        } else {
            game_data_account.player_position = game_data_account.player_position + 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }
}

fn print_player(player_position: u8) {
    if player_position == 0 {
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.........💎");
    } else if player_position == 1 {
        msg!("..o.......💎");
    } else if player_position == 2 {
        msg!("....o.....💎");
    } else if player_position == 3 {
        msg!("........\\o/💎");
        msg!("..........\\o/");
        msg!("Sonuna ulaştınız! Harika!");
    }
}

#[derive(Accounts)]
pub struct InitializeLevelOne<'info> {
    // Bir hesabı başlatmak için alanı belirtmemiz gerekir.
    // İlk 8 bayt varsayılan hesap ayırtıcısıdır,
    // sonraki 1 bayt YeniHesap.data'nın türü olan u8'den gelir.
    // (u8 = 8 bitlik unsigned tamsayı = 8 bayt)
    // Ayrıca imzalayanı tohum olarak kullanabilirsiniz [imzalayan.key().as_ref()],
    #[account(
        init_if_needed,
        seeds = [b"level1"],
        bump,
        payer = signer,
        space = 8 + 1
    )]
    pub new_game_data_account: Account<'info, GameDataAccount>,
    // Bu, ödül SOL'unu yatıracağımız PDA'dır ve
    // ilk sandığı bulan oyuncuya geri gönderiyoruz.
    #[account(
        init_if_needed,
        seeds = [b"chestVault"],
        bump,
        payer = signer,
        space = 8
    )]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SpawnChest<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, seeds = [b"chestVault"], bump)]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MoveRight<'info> {
    #[account(mut, seeds = [b"chestVault"], bump)]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[account]
pub struct GameDataAccount {
    player_position: u8,
}

#[account]
pub struct ChestVaultAccount {}

#[error_code]
pub enum MyError {
    #[msg("Şifre yanlıştı")]
    WrongPassword,
}
```

Artık program tamamlandı, onu **Solana Playground** kullanarak inşa edip dağıtalım!

Solana Playground'a yeni iseniz, önce bir Playground cüzdanı oluşturun ve bir Devnet uç noktasına bağlı olduğunuzdan emin olun. Ardından, `solana airdrop 2` komutunu çalıştırarak **6 SOL** alana kadar devam edin. Yeterince SOL'unuz olduğunda, programı inşa edin ve dağıtın.

### Müşteri ile Başlayın

Bu bölümde, oyunun etkileşimde bulunmak için basit bir istemci tarafı uygulamasını adım adım inceleyeceğiz. Kodu parçalayacağız ve her adım için detaylı açıklamalar vereceğiz. Başlamak için Solana Playground'daki `client.ts` dosyasına gidin, yer tutucu kodunu kaldırın ve aşağıdaki bölümlerden kod parçalarını ekleyin.

Öncelikle, `GameDataAccount` ve `ChestVaultAccount` için PDA'ları (Program Türetilmiş Adresleri) elde edelim. **PDA**, programın kimliği ve ek tohumlar kullanılarak türetilen, bir genel anahtar formatında benzersiz bir adrestir.

```js
// PDA adresi, herkes karakteri kontrol edebilecek, eğer programınızla etkileşime geçerse
const [globalLevel1GameDataAccount, bump] =
  await anchor.web3.PublicKey.findProgramAddress(

    [Buffer.from("level1", "utf8")],    //[pg.wallet.publicKey.toBuffer()], <- Oyuncu cüzdanını da bir tohum olarak ekleyebilirsiniz, böylece her oyuncu için bir örneğe sahip olursunuz. Rust kısmındaki tohumu da değiştirmeyi unutmayın.
    pg.program.programId,
  );

// Programın, sandıklardaki SOL ödülünü kaydedeceği ve ödülün yeniden ödeneceği yerdir.
const [chestVaultAccount, chestBump] =
  await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("chestVault", "utf8")],
    pg.program.programId,
  );
```

Sonrasında, `GameDataAccount` ve `ChestVaultAccount`'ı ayarlamak için `initializeLevelOne` talimatını çağıracağız.

```js
// Seviyeyi başlat
let txHash = await pg.program.methods
  .initializeLevelOne()
  .accounts({
    chestVault: chestVaultAccount,
    newGameDataAccount: globalLevel1GameDataAccount,
    signer: pg.wallet.publicKey,
    systemProgram: web3.SystemProgram.programId,
  })
  .signers([pg.wallet.keypair])
  .rpc();

console.log(`Logları görmek için 'solana confirm -v ${txHash}' kullanın`);
await pg.connection.confirmTransaction(txHash);

let balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(
  `Bir sandık çıkmadan önceki bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`,
);
```

:::note
Bundan sonra, oyuncunun konumunu 0 yapmak ve `ChestVaultAccount`'ı 0.1 SOL ile doldurmak için `resetLevelAndSpawnChest` talimatını kullanacağız.
:::

```js
// Oyuncu pozisyonunu 0'a geri döndür ve sandığı sol ile doldur
txHash = await pg.program.methods
  .resetLevelAndSpawnChest()
  .accounts({
    chestVault: chestVaultAccount,
    gameDataAccount: globalLevel1GameDataAccount,
    payer: pg.wallet.publicKey,
    systemProgram: web3.SystemProgram.programId,
  })
  .signers([pg.wallet.keypair])
  .rpc();

console.log(`Logları görmek için 'solana confirm -v ${txHash}' kullanın`);
await pg.connection.confirmTransaction(txHash);

console.log("Seviye sıfırlandı ve sandık oluşturuldu 💎");
console.log("o........💎");
```

Artık oyunu etkileşimde bulunarak çağırabiliriz `moveRight` talimatını. Bu örnekte, oyuncu `ChestVaultAccount`'tan ödülü almak için pozisyona ulaşana kadar bu talimatı döngü şeklinde kullanacağız.

```js
// Burada sağa üç kez hareket ediyoruz ve seviyenin sonunda sandığı topluyoruz
for (let i = 0; i < 3; i++) {
  txHash = await pg.program.methods
    .moveRight("gib")
    .accounts({
      chestVault: chestVaultAccount,
      gameDataAccount: globalLevel1GameDataAccount,
      player: pg.wallet.publicKey,
    })
    .signers([pg.wallet.keypair])
    .rpc();

  console.log(`Logları görmek için 'solana confirm -v ${txHash}' kullanın`);
  await pg.connection.confirmTransaction(txHash);
  let balance = await pg.connection.getBalance(pg.wallet.publicKey);
  console.log(`Bakiyem: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

  let gameDateAccount = await pg.program.account.gameDataAccount.fetch(
    globalLevel1GameDataAccount,
  );

  console.log("Oyuncu pozisyonu:", gameDateAccount.playerPosition.toString());

  switch (gameDateAccount.playerPosition) {
    case 0:
      console.log("Bir yolculuk başlıyor...");
      console.log("o........💎");
      break;
    case 1:
      console.log("....o....💎");
      break;
    case 2:
      console.log("......o..💎");
      break;
    case 3:
      console.log(".........\\o/💎");
      console.log("...........\\o/");
      break;
  }
}
```

Son olarak, Solana Playground'daki "Çalıştır" butonuna basarak istemciyi çalıştırın. **`moveRight`** talimatı için "gib" dışında bir şey girdiğinizde, sandık ödülünü talep etmek için pozisyona ulaştığınızda aşağıdaki hata mesajı ile karşılaşacaksınız:

```
Hata Kodu: WrongPassword. Hata Numarası: 6000. Hata Mesajı: Şifre yanlıştı.
```

Ancak doğru şifreyi girerseniz, çıktı şu şekilde olmalıdır:

```
İstemci çalışıyor...
  client.ts:
    Logları görmek için 'solana confirm -v CX8VWV5Jp1kXDkZrTdeeyibgZg3B3cXAzchzCfNHvJoqARSGHeEU5injypxFwiKFcHPcWFG9BeNSrqZAdENtL2t' kullanın
    Bir sandık çıkmadan önceki bakiyem: 6.396630254 SOL
    Logları görmek için 'solana confirm -v 3HwAS1RK7beL3mGoNdFYWteJXF3NdJXiEskJrHtuJ6Tu9ow67Zo3yScQBEPQyish33hP8WyuVanmq93wEFJ2LQcx' kullanın
    Seviye sıfırlandı ve sandık oluşturuldu 💎
    o........💎
    Logları görmek için 'solana confirm -v 43KnGrx5VQYd8LctsNaNqN1hg69vE6wiiTbdxTC1uM3Hasnq7ZdM9zWx4JS39AKNz2FpQr9a3ZnEA7XscEzmXQ5U' kullanın
    Bakiyem: 6.296620254 SOL
    Oyuncu pozisyonu: 1
    ....o....💎
    Logları görmek için 'solana confirm -v AGxYWDw49d4y5dLon5M42eu1qG8g2Yf7FeTr3Dpbf1uFXnMeUzp4XWmHyQP1YRNpT8acz4aTJU9f2FQpL6BSAkY' kullanın
    Bakiyem: 6.296615254 SOL
    Oyuncu pozisyonu: 2
    ......o..💎
    Logları görmek için 'solana confirm -v 5pjAU5NrS4u91QLWZTvo9aXBtR3c6g981UGSxrWDoDW5MehXnx5LnAxu4jKLp1p75RKpVSgMBgg2zHX3WDyci7AK' kullanın
    Bakiyem: 6.396610254 SOL
    Oyuncu pozisyonu: 3
    .........\o/💎
    ...........\o/
```

:::info
Tebrikler! Müşteri tarafında Tiny Adventure Two'yu başarıyla oluşturmuş, dağıtmış ve etkileşimde bulunmuş oldunuz. Oyuncuların seviyenin sonunda sandığı alarak ödül toplamasını sağlayan yeni bir özellik eklediniz. Ayrıca, Anchor programı içinde SOL transfer etmeyi ve hesaplarda lamportları doğrudan değiştirmeyi öğrendiniz.
:::

Bağımsız olarak devam etmeye ve oyunu yeni seviyeler veya alternatif ödüller gibi ek özelliklerle geliştirmeye devam edebilirsiniz!

Daha ileri örnekler için `Solana Oyun Örneklerine` göz atabilirsiniz.