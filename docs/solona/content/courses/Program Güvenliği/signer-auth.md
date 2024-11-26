---
title: İmza Yetkilendirmesi
objectives:
  - Uygun imza kontrollerinin yapılmamasının güvenlik risklerini açıklamak.
  - Yerel Rust kullanarak imza kontrolleri uygulamak.
  - Anchor'ın `Signer` türünü kullanarak imza kontrolleri uygulamak.
  - Anchor'ın `#[account(signer)]` kısıtlamasını kullanarak imza kontrolleri uygulamak.
description:
  "İmza kontrolleri uygulayarak yalnızca yetkili hesapların talimatları yürütmesini sağlayın."
---

## Özeti

- **İmza Kontrolleri**, belirli hesapların bir işlemi imzalayıp imzalamadığını doğrulamak için gereklidir. Uygun imza kontrolleri olmadan, yetkisiz hesaplar, gerçekleştirilmesine izin verilmeyen talimatları yürütebilir.
- Anchor'da, belirli bir hesabın imzasını otomatik olarak doğrulamak için `Signer` hesap türünü hesap doğrulama yapısında kullanabilirsiniz.
- Anchor ayrıca, işlemin imzalandığını otomatik olarak doğrulayan
  [`#[account(signer)]`](https://www.anchor-lang.com/docs/account-constraints)
  kısıtlamasını sağlar.
- Yerel Rust'da, bir hesabın `is_signer` özelliğinin `true` olduğunu doğrulayarak bir imza kontrolü uygulayın:

  ```rust
  if !ctx.accounts.authority.is_signer {
      return Err(ProgramError::MissingRequiredSignature.into());
  }
  ```

---

## Ders

**İmza kontrolleri**, yalnızca yetkili hesapların belirli talimatları yürütebilmesini sağlar. Bu kontroller olmadan, herhangi bir hesap kısıtlanması gereken işlemleri gerçekleştirebilir ve bu da yetkisiz erişim ve program hesapları üzerinde kontrol gibi ciddi güvenlik açıklarına yol açabilir.

### Eksik İmza Kontrolü

Aşağıda, bir program hesabının `authority` alanını güncelleyen aşırı basitleştirilmiş bir talimat işleyici bulunmaktadır. `UpdateAuthority` hesap doğrulama yapısındaki `authority` alanının türünün `UncheckedAccount` olduğunu unutmayın. Anchor'da 
[`UncheckedAccount`](https://docs.rs/anchor-lang/latest/anchor_lang/accounts/unchecked_account/struct.UncheckedAccount.html) türü, talimat işleyicisi yürütülmeden önce hesaba herhangi bir kontrol yapılmadığını belirtir.

`has_one` kısıtlaması, talimat işleyicisine geçirilen `authority` hesabının `vault` hesabındaki `authority` alanı ile eşleşmesini sağlasa da, `authority` hesabının işlemi gerçekten yetkilendirdiğine dair bir doğrulama yoktur.

:::warning
Bu eksiklik, bir saldırganın `authority` hesabının genel anahtarını ve kendi genel anahtarını `new_authority` hesabı olarak geçirmesine izin verir, böylece kendilerini `vault` hesabının yeni yetkilisi olarak atamış olurlar. Kontrolü ele geçirdikten sonra, program ile yeni yetkili olarak etkileşimde bulunabilirler.
:::

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod insecure_update{
    use super::*;
    ...
    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        ctx.accounts.vault.authority = ctx.accounts.new_authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
   #[account(
        mut,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    pub new_authority: UncheckedAccount<'info>,
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    pub authority: UncheckedAccount<'info>,
}

#[account]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
```

### İmza Yetkilendirme Kontrolleri Ekleme

`authority` hesabının işlemi imzaladığını doğrulamak için talimat işleyicisinde bir imza kontrolü ekleyin:

```rust
if !ctx.accounts.authority.is_signer {
    return Err(ProgramError::MissingRequiredSignature.into());
}
```

:::tip
Bu kontrolü ekleyerek, talimat işleyicisi yalnızca `authority` hesabı işlemi imzaladıysa ilerleyecektir. Hesap imzalanmamışsa, işlem başarısız olacaktır.
:::

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod secure_update{
    use super::*;
    ...
    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        if !ctx.accounts.authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature.into());
        }

        ctx.accounts.vault.authority = ctx.accounts.new_authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    pub new_authority: UncheckedAccount<'info>,
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    pub authority: UncheckedAccount<'info>,
}

#[account]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
```

### Anchor'ın Signer Hesap Türünü Kullanma

Hesap doğrulama ve talimat işleyici yürütme arasındaki ayrımı korumak için talimat işleyici mantığı içinde
[`signer`](https://docs.rs/anchor-lang/latest/anchor_lang/accounts/signer/struct.Signer.html)
kontrolünü doğrudan entegre etmek, bu ayrımı bulanıklaştırabilir. Bu ayrımı sürdürmek için Anchor'ın `Signer` hesap türünü kullanın. Doğrulama yapısındaki `authority` hesabının türünü `Signer` olarak değiştirerek, Anchor belirtilen hesabın işlemi imzaladığını çalışma zamanında otomatik olarak kontrol eder.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod secure_update{
    use super::*;
    ...
    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        ctx.accounts.vault.authority = ctx.accounts.new_authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    pub new_authority: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
```


Not: `Signer` türünü kullandığınızda, başka bir sahiplik veya tür kontrolü yapılmaz.
Bu, işlemin doğru bir şekilde yetkilendirilmesini sağlamanın önemini vurgular.


### Anchor'ın `#[account(signer)]` Kısıtlamasını Kullanma

`Signer` hesap türü kullanışlıdır, ancak diğer sahiplik veya tür kontrollerini gerçekleştirmez, bu da talimat işleyici mantığında kullanımını sınırlamaktadır. 
[anchor'ın `#[account(signer)]`](https://www.anchor-lang.com/docs/account-constraints) kısıtlaması, hesabın işlemi imzaladığını doğrularken, altında yatan verilere erişim sağlamak için bu durumu ele alır.

> Örneğin, bir hesabın hem bir imzalayıcı hem de bir veri kaynağı olmasını bekliyorsanız, `Signer` türü manuel serileştirme gerektirecektir ve otomatik sahiplik ve tür kontrolünden yararlanamazsınız. Bunun yerine, `#[account(signer)]` kısıtlaması, veriye erişmenizi ve hesabın işlemi imzaladığından emin olmanızı sağlar.

Bu örnekte, `authority` hesabında saklanan verilerle güvenli bir şekilde etkileşimde bulunabilir ve işlemi imzaladığını garanti edebilirsiniz.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod secure_update{
    use super::*;
    ...
    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        ctx.accounts.vault.authority = ctx.accounts.new_authority.key();

        // authority'de saklanan verilere erişim
        msg!("Toplam depo sahibi sayısı: {}", ctx.accounts.authority.num_depositors);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,
    /// CHECK: Bu hesap Anchor tarafından kontrol edilmeyecek
    pub new_authority: UncheckedAccount<'info>,
    #[account(signer)]
    pub authority: Account<'info, AuthState>
}

#[account]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
#[account]
pub struct AuthState{
    amount: u64,
    num_depositors: u64,
    num_vaults: u64
}
```

---

## Laboratuvar

Bu laboratuvarda, eksik bir imza kontrolünün bir saldırgana kendilerine ait olmayan tokenleri çekmesine nasıl izin verebileceğini gösteren basit bir program oluşturacağız. Bu program, basitleştirilmiş bir token `vault` hesabını başlatır ve bir imza kontrolünün yokluğunun vault'un nasıl boşaltılabileceğini gösterir.

### 1. Başlangıç

Başlamak için, bu
[`repository'nin starter`](https://github.com/solana-developers/signer-auth/tree/starter) dalından başlangıç kodunu indirin.
Başlangıç kodu, iki talimat işleyicisi ve test dosyası için gerekli kod yapısını içerir.

`initialize_vault` talimat işleyicisi, `Vault` ve `TokenAccount` adında iki yeni hesabı ayarladıktan sonra başlatılır. `Vault` hesabı Program Türetilmiş Adres (PDA) kullanılarak başlatılır ve bir token hesabının adresini ve vault'un yetkilisini saklar. `vault` PDA, token transferlerinde imza yetkilisi olan token hesabının yetkilisi olacaktır.

`insecure_withdraw` talimat işleyicisi, `vault` hesabının token hesabından `withdraw_destination` token hesabına token aktarır. Ancak, `InsecureWithdraw` yapısındaki `authority` hesabı `UncheckedAccount` türündedir, bu da hesabın kontrolsüz olduğunu belirtir.

:::note
Bir imza kontrolü olmadan, kimse `vault` hesabındaki `authority` alanıyla eşleşen `authority` hesabının genel anahtarını sağlayabilir ve `insecure_withdraw` talimat işleyicisi işlemeye devam eder.
:::

Bu örnek biraz abartılı olsa da, herhangi bir DeFi programının daha karmaşık olacağı açıktır, ancak imza kontrolünün yokluğunun yetkisiz token çekişlerine nasıl neden olabileceğini etkili bir şekilde gösterir.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("FeKh59XMh6BcN6UdekHnaFHsNH9NVE121GgDzSyYPKKS");

pub const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod signer_authorization {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        ctx.accounts.vault.token_account = ctx.accounts.token_account.key();
        ctx.accounts.vault.authority = ctx.accounts.authority.key();
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
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = vault,
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
    #[account(
        seeds = [b"vault"],
        bump,
        has_one = token_account,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub withdraw_destination: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    /// CHECK: demo eksik imza kontrolü
    pub authority: UncheckedAccount<'info>,
}

#[account]
#[derive(Default, InitSpace)]
pub struct Vault {
    token_account: Pubkey,
    authority: Pubkey,
}
```

### 2. Insecure_withdraw Talimat İşleyicisini Test Etme

Test dosyası, `walletAuthority`'yi vault üzerindeki `authority` olarak kullanarak `initialize_vault` talimat işleyicisini çağıran bir kod içerir. Kod daha sonra `vaultTokenAccount` token hesabına 100 token basar. İdeal koşullar altında yalnızca `walletAuthority` anahtarı bu 100 tokeni vault'tan çekebilmelidir.

Daha sonra, mevcut sürümün bir üçüncü tarafın bu 100 tokeni çekmesine izin verdiğini göstermek için programda `insecure_withdraw`'u çağıracak bir test ekleyeceğiz.

:::info
Testte, `walletAuthority` genel anahtarını `authority` hesabı olarak kullanacağız ancak işlemi farklı bir anahtar çiftiyle imzalayıp göndereceğiz.
:::

```typescript
describe("İmza Yetkilendirmesi", () => {
    ...
    it("güvensiz çekim gerçekleştiriyor", async () => {
    try {
      const transaction = await program.methods
        .insecureWithdraw()
        .accounts({
          vault: vaultPDA,
          tokenAccount: vaultTokenAccount.publicKey,
          withdrawDestination: unauthorizedWithdrawDestination,
          authority: walletAuthority.publicKey,
        })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(connection, transaction, [
        unauthorizedWallet,
      ]);

      const tokenAccountInfo = await getAccount(
        connection,
        vaultTokenAccount.publicKey
      );
      expect(Number(tokenAccountInfo.amount)).to.equal(0);
    } catch (error) {
      console.error("Güvensiz çekim başarısız oldu:", error);
      throw error;
    }
  });
})
```

`anchor test` komutunu çalıştırarak her iki işlemin de başarıyla tamamlandığını onaylayın.

```bash
İmza Yetkilendirmesi
    ✔ vault'ı başlatır ve tokenları basar (882ms)
    ✔ güvensiz çekim gerçekleştirir (435ms)
```

:::danger
`insecure_withdraw` talimat işleyicisi bir güvenlik açığını göstermektedir. `authority` hesabı için bir imza kontrolü olmadığından, bu işleyici tokenleri `vaultTokenAccount`'tan `unauthorizedWithdrawDestination`'a aktaracaktır, bu da `authority` hesabının genel anahtarının vault hesabındaki `walletAuthority.publicKey` ile eşleştiği sürece mümkündür.
:::

Testte, `unauthorizedWallet`'ı işlemi imzalamak için kullanırken, yine de talimat hesaplarında `walletAuthority.publicKey`'yi authority olarak belirtiyoruz. İmzalayıcı ve belirtilen `authority` arasındaki bu uyumsuzluk normalde bir işlemin başarısız olmasına neden olacaktır. Ancak, `insecure_withdraw` işleyicisindeki uygun bir imza kontrolü yokluğunda işlem başarılı olur.

### 3. Güvenli Çekim Talimat İşleyicisi Eklemek

Bu sorunu çözmek için `secure_withdraw` adında yeni bir talimat işleyici oluşturacağız. Bu talimat işleyici `insecure_withdraw` ile aynı olacaktır, ancak `SecureWithdraw` yapısındaki `authority` hesabını doğrulamak için `Signer` türünü kullanacağız. `authority` hesabı işlemin imzalayıcısı değilse, işlem bir hata ile başarısız olmalıdır.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod signer_authorization {
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
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub withdraw_destination: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub authority: Signer<'info>,
}
```

### 4. Secure_withdraw Talimat İşleyicisini Test Etme

Yeni talimat işleyici yerinde olduğu için, test dosyasına dönerek `secureWithdraw` talimat işleyicisini test edin. `secureWithdraw` talimat işleyicisini çağırırken `walletAuthority.publicKey`'yi `authority` hesabı olarak kullanın ve `unauthorizedWallet` anahtar çiftini imzalayıcı olarak ayarlayın. `unauthorizedWithdrawDestination`'ı çekim hedefi olarak belirleyin.

:::info
`authority` hesabı, `Signer` türü kullanılarak doğrulandığı için, işlem bir imza doğrulama hatası ile başarısız olacaktır. Bunun nedeni, `unauthorizedWallet`'ın işlemi imzalamaya çalışmasıdır, ancak bu, talimat içinde belirtilen `authority` ile eşleşmemektedir (yani `walletAuthority.publicKey`).
:::

```typescript
describe("İmza Yetkilendirmesi", () => {
    ...
    it("yanlış imzalayıcı ile güvenli çekim gerçekleştiremez", async () => {
    try {
      const transaction = await program.methods
        .secureWithdraw()
        .accounts({
          vault: vaultPDA,
          tokenAccount: vaultTokenAccount.publicKey,
          withdrawDestination: unauthorizedWithdrawDestination,
          authority: walletAuthority.publicKey,
        })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(connection, transaction, [
        unauthorizedWallet,
      ]);
      throw new Error("İşlemin başarısız olmasını bekliyorduk ama başarılı oldu");
    } catch (error) {
      expect(error).to.be.an("error");
      console.log("Hata mesajı:", error.message);
    }
  });
})
```

`anchor test` komutunu çalıştırarak işlemin bu sefer bir imza doğrulama hatası döndürdüğünü görün.

```bash
imza-yetkilendirmesi
Hata mesajı: İmza doğrulama hatası.
Genel anahtar için imza eksik [`GprrWv9r8BMxQiWea9MrbCyK7ig7Mj8CcseEbJhDDZXM`].
    ✔ yanlış imzalayıcı ile güvenli çekim gerçekleştirilemez
```

:::note
Bu örnek, talimatları kimin yetkilendirmesi gerektiğini düşünmenin ve her talimatın işlemde bir imzalayıcı olduğundan emin olmanın önemini göstermektedir.
:::

Son çözüm kodunu incelemek için, bunu 
[`repository'nin solution`](https://github.com/solana-developers/signer-auth/tree/solution) dalında bulabilirsiniz.

---

## Mücadele

Artık bu kurs içindeki laboratuvarları ve mücadeleleri tamamladığınıza göre, bilginizi pratik bir ortamda uygulama zamanı. Bu zorluk ve takip eden güvenlik açıkları için, her derste tartışılan belirli güvenlik açığı açısından kendi programlarınızı denetleyin.

### Adımlar

1. **Programınızı Denetleyin veya Açık Kaynak Projesi Bulun**:

   - Kendi kodunuzu imzalayıcı kontrolleri açısından denetleyerek başlayın veya denetlemek için açık kaynaklı bir Solana programı bulun. Başlamak için harika bir yer, [program örnekleri](https://github.com/solana-developers/program-examples) deposudur.

   :::tip 
   **İpucu:** Kendi programınızdaki imzalayıcı kontrollerini denetlemek için farklı araçlar ve yöntemler kullanabilirsiniz.
   :::

2. **İmzalayıcı Kontrol Sorunlarını Araştırın**:

   - İmzalayıcı yetkilendirmesinin kritik olduğu talimat işleyicilerine odaklanın, özellikle tokenları transfer eden veya hassas hesap verilerini değiştirenler.
   - Programı, imzalayıcı doğrulamasının zorunlu olması gereken herhangi bir `UncheckedAccount` tipi açısından gözden geçirin.

   **Anahtar Nokta:** 
   > Kullanıcı yetkilendirmesi gerektiren hesapların, talimat işleyicisinde `Signer` olarak tanımlandığından emin olun.  
   — Geliştirici Kılavuzu

3. **Yamanlayın veya Bildirin**:
   - Kendi kodunuzda bir hata bulursanız, imzalayıcı doğrulaması gerektiren hesaplar için `Signer` tipini kullanarak düzeltin.  
   - Hata açık kaynak projesinde mevcutsa, proje bakıcılarını bilgilendirin veya bir pull request gönderin.

   
   Daha Fazla Bilgi
   
   Eğer hatayı düzeltemiyorsanız: 
   - **Hata Raporu:** Proje bakıcılarına hatayı açıklayan bir rapor hazırlayın.
   - **Pull Request:** Düzeltmenizi içeren bir pull request oluşturun; böylece topluluk faydalanabilir.
   

---



Mücadelenin ardından kodunuzu GitHub'a yükleyin ve
[bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=26b3f41e-8241-416b-9cfa-05c5ab519d80)!
