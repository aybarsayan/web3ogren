---
title: Çift Değiştirilebilir Hesaplar
objectives:
  - İki aynı türden değiştirilebilir hesap gerektiren talimatların güvenlik risklerini açıklamak ve bunlardan nasıl kaçınılacağı
  - Yerel Rust kullanarak çift değiştirilebilir hesaplar için bir kontrol uygulamak
  - Anchor kısıtlamalarını kullanarak çift değiştirilebilir hesaplar için bir kontrol uygulamak
description:
  "İki değiştirilebilir hesapla ilgili talimat yöneticileri ile ortaya çıkabilecek açıklar ve bunların nasıl azaltılacağı."
---

## Özette

- Bir talimat iki aynı türde değiştirilebilir hesap gerektirdiğinde, bir saldırgan aynı hesabı iki kez geçirebilir, bu da **istenmeyen mutasyonlara** yol açar.
- Rust'ta çift değiştirilebilir hesapları kontrol etmek için, iki hesabın genel anahtarlarını karşılaştırın ve aynı iseler bir hata fırlatın.

### Rust'ta Çift Değiştirilebilir Hesapları Kontrol Etme

Rust'ta, hesapların genel anahtarlarını karşılaştırabilir ve şayet kimlikleri aynıysa bir hata dönebilirsiniz:

```rust
if ctx.accounts.account_one.key() == ctx.accounts.account_two.key() {
  return Err(ProgramError::InvalidArgument)
}
```

### Anchor'da Kısıtlamaları Kullanma

:::tip
Anchor'da, bir hesap için açık bir `constraint` ekleyerek başka bir hesapla aynı olmadığını garanti edebilirsiniz.
:::

## Ders

**Çift Değiştirilebilir Hesaplar**, bir talimatın iki değiştirilebilir hesap gerektirdiği durumlarda meydana gelir. Eğer aynı hesap iki kez geçerse, **istenmeyen şekillerde değiştirilebilir** ve potansiyel olarak güvenlik açıklarına yol açabilir.

### Kontrol Yok

Bir programın `user_a` ve `user_b` için bir veri alanını güncellediğini düşünün. Eğer aynı hesap hem `user_a` hem de `user_b` için geçirilirse, program ikinci değeri ile **veri alanını geçersiz kılarak** istenmeyen yan etkilere yol açabilir.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod duplicate_mutable_accounts_insecure {
    use super::*;

    pub fn update(ctx: Context<Update>, a: u64, b: u64) -> Result<()> {
        ctx.accounts.user_a.data = a;
        ctx.accounts.user_b.data = b;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub user_a: Account<'info, User>,
    #[account(mut)]
    pub user_b: Account<'info, User>,
}

#[account]
#[derive(Default)]
pub struct User {
    pub data: u64,
}
```

#### Rust'ta Kontrol Eklenmesi

Bunu önlemek için, hesapların farklı olduğunu garanti edecek şekilde talimat mantığına bir kontrol ekleyin:

```rust
if ctx.accounts.user_a.key() == ctx.accounts.user_b.key() {
    return Err(ProgramError::InvalidArgument)
}
```

Bu kontrol, `user_a` ve `user_b` hesaplarının aynı olmadığını garanti eder.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod duplicate_mutable_accounts_secure {
    use super::*;

    pub fn update(ctx: Context<Update>, a: u64, b: u64) -> Result<()> {
        if ctx.accounts.user_a.key() == ctx.accounts.user_b.key() {
            return Err(ProgramError::InvalidArgument)
        }
        ctx.accounts.user_a.data = a;
        ctx.accounts.user_b.data = b;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub user_a: Account<'info, User>,
    #[account(mut)]
    pub user_b: Account<'info, User>,
}

#[account]
#[derive(Default)]
pub struct User {
    pub data: u64,
}
```

#### Anchor Kısıtlaması Kullanma

:::info
Anchor'da daha iyi bir çözüm, hesap doğrulama yapısında [ `constraint` anahtar kelimesini](https://www.anchor-lang.com/docs/account-constraints) kullanmaktır.
:::

`#[account(..)]` özellik makrosunu ve kısıtlama anahtar kelimesini kullanarak bir hesaba elle kısıtlama ekleyebilirsiniz. Kısıtlama anahtar kelimesi, takip eden ifadenin doğru ya da yanlış olup olmadığını kontrol eder ve ifade yanlışsa bir hata döner.

Bu, kontrolün hesap doğrulaması sırasında otomatik olarak yapılmasını sağlar:

```rust
use anchor_lang::prelude::*;

declare_id!("AjBhRphs24vC1V8zZM25PTuLJhJJXFnYbimsZF8jpJAS");

#[program]
pub mod duplicate_mutable_accounts_recommended {
    use super::*;

    pub fn update(ctx: Context<Update>, a: u64, b: u64) -> Result<()> {
        ctx.accounts.user_a.data = a;
        ctx.accounts.user_b.data = b;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        constraint = user_a.key() != user_b.key())]
    pub user_a: Account<'info, User>,
    #[account(mut)]
    pub user_b: Account<'info, User>,
}

#[account]
#[derive(Default)]
pub struct User {
    pub data: u64,
}
```

## Laboratuvar

Çift değiştirilebilir hesaplar için kontrol yapmayı atlayarak programınızda belirsiz bir davranışın nasıl ortaya çıkacağını göstermek için basit bir Taş Kağıt Makas programı oluşturarak uygulama yapalım.

Bu program, “oyuncu” hesaplarını başlatacak ve taş, kağıt ve makas oyununu başlatmak için iki oyuncu hesabını gerektiren ayrı bir talimat içerecektir.

- `PlayerState` hesabını başlatan bir `initialize` talimatı
- İki `PlayerState` hesabı gerektiren fakat hesapların talimata geçirilenlerin farklı olduğunu kontrol etmeyen bir `rock_paper_scissors_shoot_insecure` talimatı
- İki oyuncu hesabının farklı olduğunu garanti eden `rock_paper_scissors_shoot_secure` talimatı

### Başlangıç

Başlamak için, `starter` dalındaki [bu depo](https://github.com/solana-developers/duplicate-mutable-accounts/tree/starter) üzerindeki başlangıç kodunu indirin. Başlangıç kodu, iki talimat ve test dosyası için hazırlık kurulumunu içeren bir program içerir.

`initialize` talimatı, bir oyuncunun genel anahtarını ve `None` olarak ayarlanmış bir `choice` alanını saklayan yeni bir `PlayerState` hesabı başlatır.

`rock_paper_scissors_shoot_insecure` talimatı, iki `PlayerState` hesabı gerektirir ve her oyuncu için `RockPaperScissors` enum'undan bir seçim gerektirir, ancak talimata geçirilen hesapların farklı olup olmadığını kontrol etmez. Bu, **tek bir hesabın talimattaki her iki `PlayerState` hesabı için** kullanılabileceği anlamına gelir.

```rust filename="constants.rs"
pub const DISCRIMINATOR_SIZE: usize = 8;
```

```rust filename="lib.rs"
use anchor_lang::prelude::*;

mod constants;
use constants::DISCRIMINATOR_SIZE;

declare_id!("Lo5sj2wWy4BHbe8kCSUvgdhzFbv9c6CEERfgAXusBj9");

#[program]
pub mod duplicate_mutable_accounts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.new_player.player = ctx.accounts.payer.key();
        ctx.accounts.new_player.choice = None;
        Ok(())
    }

    pub fn rock_paper_scissors_shoot_insecure(
        ctx: Context<RockPaperScissorsInsecure>,
        player_one_choice: RockPaperScissors,
        player_two_choice: RockPaperScissors,
    ) -> Result<()> {
        ctx.accounts.player_one.choice = Some(player_one_choice);
        ctx.accounts.player_two.choice = Some(player_two_choice);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = DISCRIMINATOR_SIZE + PlayerState::INIT_SPACE
    )]
    pub new_player: Account<'info, PlayerState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RockPaperScissorsInsecure<'info> {
    #[account(mut)]
    pub player_one: Account<'info, PlayerState>,
    #[account(mut)]
    pub player_two: Account<'info, PlayerState>,
}

#[account]
#[derive(Default, InitSpace)]
pub struct PlayerState {
    pub player: Pubkey,
    pub choice: Option<RockPaperScissors>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum RockPaperScissors {
    Rock,
    Paper,
    Scissors,
}
```

### rock_paper_scissors_shoot_insecure talimatını test etme

Test dosyası, iki oyuncu hesabı oluşturmak için `initialize` talimatını iki kez çağırmak için gereken kodu içerir.

`playerOne.publicKey`'i hem `playerOne` hem de `playerTwo` olarak geçirerek `rock_paper_scissors_shoot_insecure` talimatını çağıracak bir test ekleyin.

```typescript
describe("duplicate-mutable-accounts", () => {
    ...
    it("İnsecure talimatı çağırır", async () => {
        await program.methods
        .rockPaperScissorsShootInsecure({ rock: {} }, { scissors: {} })
        .accounts({
            playerOne: playerOne.publicKey,
            playerTwo: playerOne.publicKey,
        })
        .rpc()

        const p1 = await program.account.playerState.fetch(playerOne.publicKey)
        assert.equal(JSON.stringify(p1.choice), JSON.stringify({ scissors: {} }))
        assert.notEqual(JSON.stringify(p1.choice), JSON.stringify({ rock: {} }))
    })
})
```

`anchor test` komutunu çalıştırarak işlemlerin başarılı bir şekilde tamamlandığını görün, aynı hesap talimatta iki hesap olarak kullanılsa bile. `playerOne` hesabı her iki oyuncu içinde kullanıldığı için `playerOne` hesabında depolanan `choice` alanının da geçersiz kılındığını ve yanlış olarak `scissors` olarak ayarlandığını not edin.

```bash
duplicate-mutable-accounts
  ✔ Oyuncu Bir Başlatıldı (461ms)
  ✔ Oyuncu İki Başlatıldı (404ms)
  ✔ Güvenilmeyen talimat çağrıldı (406ms)
```

:::warning
Hem çoğul hesapların izin verilmesi oyunun mantıklı bir şekilde ilerlememesine neden olmaktadır, hem de belirsiz davranışın doğmasına sebep olur. Eğer bu programı daha da geliştirirsek, programın yalnızca tek bir seçilmiş seçeneği olduğu için başka bir seçenekle karşılaştırılamaz. Oyun her seferinde berabere sonuçlanır. Ayrıca bir insan olarak `playerOne`'ın seçiminin taş mı yoksa makas mı olduğu tam olarak belirsiz olduğu için programın davranışları da tuhaflaşır.
:::

### rock_paper_scissors_shoot_secure talimatını eklemek

Sonraki adımda, `lib.rs` dosyasına geri dönerek `player_one` ve `player_two` hesaplarının farklı olup olmadığını kontrol eden ek bir `constraint` eklemek için `rock_paper_scissors_shoot_secure` talimatını ekleyin.

```rust
#[program]
pub mod duplicate_mutable_accounts {
    use super::*;
        ...
        pub fn rock_paper_scissors_shoot_secure(
            ctx: Context<RockPaperScissorsSecure>,
            player_one_choice: RockPaperScissors,
            player_two_choice: RockPaperScissors,
        ) -> Result<()> {
            ctx.accounts.player_one.choice = Some(player_one_choice);
            ctx.accounts.player_two.choice = Some(player_two_choice);
            Ok(())
        }
}

#[derive(Accounts)]
pub struct RockPaperScissorsSecure<'info> {
    #[account(
        mut,
        constraint = player_one.key() != player_two.key()
    )]
    pub player_one: Account<'info, PlayerState>,
    #[account(mut)]
    pub player_two: Account<'info, PlayerState>,
}
```

### rock_paper_scissors_shoot_secure talimatını test etme

`rock_paper_scissors_shoot_secure` talimatını test etmek için, talimatı iki kez çağıracağız. İlk olarak, talimatın istenildiği gibi çalıştığını kontrol etmek için iki farklı oyuncu hesabı kullanarak talimatı çağıracağız. Sonra, `playerOne.publicKey`'i her iki oyuncu hesabı olarak kullanarak çağıracağız, bunun başarısız olmasını bekliyoruz.

```typescript
describe("duplicate-mutable-accounts", () => {
    ...
    it("Güvenli talimatı çağırır", async () => {
        await program.methods
        .rockPaperScissorsShootSecure({ rock: {} }, { scissors: {} })
        .accounts({
            playerOne: playerOne.publicKey,
            playerTwo: playerTwo.publicKey,
        })
        .rpc()

        const p1 = await program.account.playerState.fetch(playerOne.publicKey)
        const p2 = await program.account.playerState.fetch(playerTwo.publicKey)
        assert.equal(JSON.stringify(p1.choice), JSON.stringify({ rock: {} }))
        assert.equal(JSON.stringify(p2.choice), JSON.stringify({ scissors: {} }))
    })

    it("Güvenli talimatı çağır - hata bekliyoruz", async () => {
        try {
        await program.methods
            .rockPaperScissorsShootSecure({ rock: {} }, { scissors: {} })
            .accounts({
                playerOne: playerOne.publicKey,
                playerTwo: playerOne.publicKey,
            })
            .rpc()
        } catch (err) {
            expect(err)
            console.log(err)
        }
    })
})
```

`anchor test` komutunu çalıştırarak talimatın istediğimiz gibi çalıştığını ve `playerOne` hesabının iki kez kullanılmasının beklenen hatayı döndürdüğünü görün.

```bash
'Program Lo5sj2wWy4BHbe8kCSUvgdhzFbv9c6CEERfgAXusBj9 invoke [1]',
'Program log: Talimat: RockPaperScissorsShootSecure',
'Program log: AnchorError, hesap tarafından neden oldu: player_one. Hata Kodu: ConstraintRaw. Hata Numarası: 2003. Hata Mesajı: Bir ham kısıtlama ihlal edildi.',
'Program Lo5sj2wWy4BHbe8kCSUvgdhzFbv9c6CEERfgAXusBj9 200000 hesaplama birimi içinden 3414 birim tüketti',
'Program Lo5sj2wWy4BHbe8kCSUvgdhzFbv9c6CEERfgAXusBj9 başarısız oldu: özelleştirilmiş program hatası: 0x7d3'
```

:::note
Basit bir kısıtlama, bu açığı kapatmak için yeterlidir. Biraz süslü bir örnek olsa da, iki aynı türde hesapların farklı olacağı varsayımıyla programınızı yazarsanız ortaya çıkabilecek garip davranışları göstermektedir. Programınızın beklediğiniz davranışını düşünmeye her zaman dikkat edin ve bunun belirgin olup olmadığını sorgulayın.
:::

Son çözüm kodunu görmek isterseniz, bunu [depo](https://github.com/solana-developers/duplicate-mutable-accounts/tree/solution) üzerindeki `solution` dalında bulabilirsiniz.

## Meydan Okuma

Bu ünitedeki diğer derslerde olduğu gibi, bu güvenlik açığını önlemek için fırsatınız kendi veya diğer programları denetlemektir.

En az bir programı gözden geçirmek için biraz zaman ayırın ve iki aynı türden değiştirilebilir hesabı olan her talimatın uygun bir şekilde kısıtlandığından emin olun.

Unutmayın, eğer bir başkasının programında bir hata veya güvenlik açığı bulursanız, lütfen onları bilgilendirin! Kendi programınızda bir tane bulursanız, hemen düzeltmek için harekete geçin.


Kodunuzu GitHub'a gönderin ve
[bu ders hakkında ne düşündüğünüzü bize söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=9b759e39-7a06-4694-ab6d-e3e7ac266ea7)!
