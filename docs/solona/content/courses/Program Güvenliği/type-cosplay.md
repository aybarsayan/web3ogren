---
title: Tür Cosplay
objectives:
  - Hesap türlerini kontrol etmemekle ilgili güvenlik risklerini açıklayın
  - Yerel Rust kullanarak bir hesap türü ayrıştırıcısı uygulayın
  - Anchor'un `init` kısıtlamasını kullanarak hesapları başlatın
  - Hesap doğrulaması için Anchor'un `Account` türünü kullanın
description:
  "Talimatlarda yanlış hesap türlerini kullanmanın risklerini anlayın ve bunları
  hesap türü kontrolleri ile nasıl azaltacağınızı öğrenin."
---

## Özet

- **Ayrıştırıcılar**, farklı hesap türlerini ayırt eden ve programların doğru
  verilerle etkileşimde bulunmasını sağlayan, hesaplara yazılan 8 baytlık tanımlayıcılardır.
- Rust'ta bir ayrıştırıcı uygulamak için hesap yapısında hesap türünü temsil eden
  bir alan ekleyin.

  ```rust
  #[derive(BorshSerialize, BorshDeserialize)]
  pub struct Kullanıcı {
      ayrıştırıcı: AccountDiscriminant,
      kullanıcı: Pubkey,
  }

  #[derive(BorshSerialize, BorshDeserialize, PartialEq)]
  pub enum AccountDiscriminant {
      Kullanıcı,
      Yönetici,
  }
  ```

- Rust'ta ayrıştırıcıyı kontrol edin ve deseralize edilen hesap verilerinin beklenen değerle
  eşleşip eşleşmediğini doğrulayın.

  ```rust
  if kullanıcı.ayrıştırıcı != AccountDiscriminant::Kullanıcı {
    return Err(ProgramError::InvalidAccountData.into());
  }
  ```

- **Anchor**'da, program hesap türleri otomatik olarak `Discriminator` trait
  uygulamakta olup, bir tür için 8 baytlık benzersiz bir tanımlayıcı oluşturmaktadır.
- Hesabı deseralize ederken ayrıştırıcıyı otomatik olarak kontrol etmek için Anchor'un
  `Account` türünü kullanın.

---

### Ders

> "Tür cosplay" beklenen bir hesap türü yerine beklenmeyen bir hesap türü kullanmayı ifade eder. 
> Arka planda, hesap verileri bir programın özel bir hesap türüne deseralize ettiği bir bayt dizisi olarak saklanır. 
> Hesap türlerini açıkça ayırt eden bir yöntemin olmaması durumunda, beklenmeyen bir hesap verilerinin 
> talimatların beklenmedik şekillerde kullanılmasına neden olabileceği anlamına gelir. — 

### Kontrol Edilmeyen Hesap

Aşağıdaki örnekte, hem `AdminConfig` hem de `UserConfig` hesap türleri
tek bir genel anahtarı saklamaktadır. `admin_instruction`, `admin_config` 
hesabını `AdminConfig` türünde deseralize eder ve ardından bir sahip kontrolü
ve veri doğrulama kontrolü gerçekleştirilir.

Ancak, `AdminConfig` ve `UserConfig` hesap türleri aynı veri yapısına sahip olduğundan,
bir `UserConfig` hesap türü `admin_config` hesabı olarak geçirilebilir.
Hesapta saklanan genel anahtar, işlemi imzalayan `admin` ile eşleştiği sürece,
`admin_instruction` işlem görecektir; imzalayanın aslında bir yönetici olmadığı durumu
dahi geçerlidir.

:::warning
Hesap türlerinde saklanan alanların isimlerinin (`admin` ve `user`) hesap verileri deseralize edilirken herhangi bir fark yaratmadığını unutmayın. 
Veri, alanların sırasına göre serileştirilir ve deseralize edilir; isimleri değil.
:::

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod type_cosplay_insecure {
    use super::*;

    pub fn admin_instruction(ctx: Context<AdminInstruction>) -> Result<()> {
        let account_data =
            AdminConfig::try_from_slice(&ctx.accounts.admin_config.data.borrow()).unwrap();
        if ctx.accounts.admin_config.owner != ctx.program_id {
            return Err(ProgramError::IllegalOwner.into());
        }
        if account_data.admin != ctx.accounts.admin.key() {
            return Err(ProgramError::InvalidAccountData.into());
        }
        msg!("Yönetici {}", account_data.admin);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AdminInstruction<'info> {
    /// CHECK: Bu hesap Anchor tarafından doğrulanmamaktadır
    admin_config: UncheckedAccount<'info>,
    admin: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace)]
pub struct AdminConfig {
    admin: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace)]
pub struct UserConfig {
    user: Pubkey,
}
```

#### Hesap Ayrıştırıcısı Ekleyin

Bunu çözmek için, her hesap türü için bir ayrıştırıcı alanı ekleyin ve
bir hesabı başlatırken ayrıştırıcıyı ayarlayın.


Not: Ayrıştırıcı Tanımı
Benzer ses taşısalar da, bir
[Rust **ayrıştırıcı**](https://doc.rust-lang.org/std/mem/fn.discriminant.html)
aynı şey değildir.
[Anchor **ayrıştırıcısı**](https://book.anchor-lang.com/anchor_bts/discriminator.html)!

- **Rust ayrıştırıcısı**: Bu, Rust'ın bir enum'un hangi varyantı temsil ettiğini takip etmek için kullandığı
  dahili bir değerdir. Enum varyantları için sahne arkasında bir etiket gibidir.

- **Anchor ayrıştırıcısı**: Bu, Anchor'un her hesabın verisinin başına eklediği,
  türü tanımlayan 8 baytlık benzersiz bir tanımlayıcıdır. Solana programlarının
  hangi tür hesapla ilgilendiğini hızlı bir şekilde tanımasına yardımcı olur.


Aşağıdaki örnek, `AdminConfig` ve `UserConfig` hesap türlerini
`ayrıştırıcı` alanıyla günceller. `admin_instruction` artık `ayrıştırıcı` alanı için
ek bir veri doğrulama kontrolü içermektedir.

```rust
if account_data.ayrıştırıcı != AccountDiscriminant::Admin {
    return Err(ProgramError::InvalidAccountData.into());
}
```

Eğer talimata geçirilen `admin_config` hesabının `ayrıştırıcı` alanı
beklenen `AccountDiscriminant` ile eşleşmezse, işlem başarısız olacaktır.
Her hesabın başlatılması sırasında `ayrıştırıcı` için uygun bir değer ayarlandığından emin olun
ve her sonraki talimata bu kontrolleri dahil edin.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod type_cosplay_secure {
    use super::*;

    pub fn admin_instruction(ctx: Context<AdminInstruction>) -> Result<()> {
        let account_data =
            AdminConfig::try_from_slice(&ctx.accounts.admin_config.data.borrow()).unwrap();
        if ctx.accounts.admin_config.owner != ctx.program_id {
            return Err(ProgramError::IllegalOwner.into());
        }
        if account_data.admin != ctx.accounts.admin.key() {
            return Err(ProgramError::InvalidAccountData.into());
        }
        if account_data.ayrıştırıcı != AccountDiscriminant::Admin {
            return Err(ProgramError::InvalidAccountData.into());
        }
        msg!("Yönetici {}", account_data.admin);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AdminInstruction<'info> {
    /// CHECK: Bu hesap Anchor tarafından doğrulanmamaktadır
    admin_config: UncheckedAccount<'info>,
    admin: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace)]
pub struct AdminConfig {
    ayrıştırıcı: AccountDiscriminant,
    admin: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace)]
pub struct UserConfig {
    ayrıştırıcı: AccountDiscriminant,
    user: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, PartialEq, InitSpace)]
pub enum AccountDiscriminant {
    Admin,
    User,
}
```

### Anchor'un Hesap Sarıcısını Kullanın

:::tip
Her hesaba her talimatta bu kontrolleri uygulamak zahmetli olabilir. Neyse ki, Anchor her hesabın sahip olması gereken özellikleri otomatik olarak uygulamak için `#[account]` niteliğini sunar.
:::

`#[account]` ile işaretlenmiş yapılar, aynı zamanda `Account` ile ilişkilendirilerek
geçilen hesabın gerçekten beklediğiniz türde olduğunu doğrulamak için kullanılabilir.
`#[account]` niteliğine sahip bir yapı temsili başlatıldığında,
hesap türüne özgü bir ayrıştırıcı için ilk 8 bayt otomatik olarak ayrılır.
Hesap verilerinin deseralize edilmesi sırasında Anchor, otomatik olarak
ayrıştırıcının beklenen hesap türü ile eşleşip eşleşmediğini kontrol eder
ve eşleşmezse hata verir.

Aşağıdaki örnekte, `Account` belirtiyor ki,
`admin_config` hesabının `AdminConfig` türünde olması bekleniyor.
Anchor, hesabın verilerinin ilk 8 baytının
`AdminConfig` türünün ayrıştırıcısı ile eşleşip eşleşmediğini otomatik olarak kontrol eder.

`admin` alanı için veri doğrulama kontrolü, talimat mantığından
hesap doğrulama yapısına `has_one` kısıtlaması ile taşınmıştır.
`#[account(has_one = admin)]` ifadesi, `admin_config`
hesabının `admin` alanının talimata geçirilen `admin` hesabı ile eşleşmesi gerektiğini belirtir.
`has_one` kısıtlamasının çalışabilmesi için yapının içindeki hesabın
isminin, doğruladığınız hesaptaki alanın ismiyle eşleşmesi gerektiğini unutmayın.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod type_cosplay_recommended {
    use super::*;

    pub fn admin_instruction(ctx: Context<AdminInstruction>) -> Result<()> {
        msg!("Yönetici {}", ctx.accounts.admin_config.admin);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AdminInstruction<'info> {
    #[account(has_one = admin)]
    admin_config: Account<'info, AdminConfig>,
    admin: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct AdminConfig {
    admin: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct UserConfig {
    user: Pubkey,
}
```

:::info
Bu zayıflık, Anchor kullanırken genelde endişelenmenizin gerekmediği bir şeydir; işin özü budur! Ancak, bu sorunun yerel Rust programlarında nasıl ortaya çıkabileceğini keşfettikten sonra, Anchor hesabındaki hesap ayrıştırıcısının önemünü daha iyi anladığınızdan emin olmalısınız.
:::

Anchor'un otomatik ayrıştırıcı kontrolleri, geliştiricilerin ürünlerine daha fazla odaklanmalarına
imkan tanır; ancak Anchor'un sahne arkasında neler yaptığını anlayabilmek, sağlam Solana programları oluşturmak için hala önemlidir.

## Laboratuvar

:::tip
Bu laboratuvar, bir tür cosplay zayıflığını sergilemek için iki program oluşturmanızı isteyecektir:
:::

- İlk program, ayrıştırıcı olmadan hesapları başlatır.
- İkinci program, Anchor'un `init` kısıtlamasını kullanarak hesapları başlatır; bu otomatik olarak bir hesap ayrıştırıcısını ayarlar.

### 1. Başlangıç

Başlamak için, başlangıç kodunu [bu depodan](https://github.com/solana-developers/type-cosplay/tree/starter) başlangıç dalından indirin.
Başlangıç kodu, üç talimat ve bazı testleri içeren bir program içerir.

Üç talimat şunlardır:

1. `initialize_admin` - Bir yönetici hesabı başlatır ve programın yönetici yetkisini ayarlar.
2. `initialize_user` - Standart bir kullanıcı hesabını başlatır.
3. `update_admin` - Mevcut yöneticinin programın yönetici yetkisini güncellemesine izin verir.

`lib.rs` dosyasındaki talimatları gözden geçirin. Son talimat, yalnızca
`initialize_admin` talimatı ile başlatılan yönetici hesabında `admin` alanına
eşleyen hesap tarafından çağrılabilir olmalıdır.

### 2. Kontrol Edilmeyen update_admin Talimatını Test Edin

Hem `AdminConfig` hem de `User` hesap türleri aynı alanlara ve alan türlerine sahiptir:

```rust
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AdminConfig {
    admin: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct User {
    user: Pubkey,
}
```

:::danger
Bu nedenle, `update_admin` talimatındaki `admin` hesabı yerine bir
`User` hesabı geçmek mümkündür; bu, yalnızca bir yöneticinin bu talimatı çağırabilmesi gereken
gerekliliği aşmaktadır.
:::

`tests` dizinindeki `solana-type-cosplay.ts` dosyasına bakın. 
Bu dosya, temel bir kurulum ve bir kullanıcı hesabını başlatan
ve yöneticinin hesabı yerine kullanıcı hesabıyla `update_admin` çağıran iki test içermektedir. 

`anchor test` komutunu çalıştırın ve `update_admin`'ın başarıyla tamamlandığını görün:

```bash
  type-cosplay
    ✔ Kullanıcı Hesabı Başlat (223ms)
    ✔ Kullanıcı Hesabı ile güncelleme talimatını çağır (442ms)
```

### 3. Tür Denetimli Program Oluşturun

Ardından, mevcut anchor programının kök dizininde `anchor new type-checked` komutunu çalıştırarak
`type-checked` adında yeni bir program oluşturun.

Artık `programs` klasörünüzde iki programınız olacak. Yeni programın program kimliğini görmek için
`anchor keys list` komutunu çalıştırın. Bu programın `lib.rs` dosyasına ve `Anchor.toml` dosyasına ekleyin.

Test dosyasının kurulumunu güncelleyerek yeni programı ve başlatılacak hesaplar için iki yeni anahtar çifti ekleyin:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TypeCosplay } from "../target/types/type_cosplay";
import { TypeChecked } from "../target/types/type_checked";
import { expect } from "chai";

describe("type-cosplay", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TypeCosplay as Program<TypeCosplay>;
  const programChecked = anchor.workspace.TypeChecked as Program<TypeChecked>;

  const userAccount = anchor.web3.Keypair.generate();
  const newAdmin = anchor.web3.Keypair.generate();

  const userAccountChecked = anchor.web3.Keypair.generate();
  const adminAccountChecked = anchor.web3.Keypair.generate();
});
```

### 4. Tür Denetimli Programı Uygulayın

`type_checked` programında, bir `AdminConfig` hesabını ve
bir `User` hesabını başlatmak için `init` kısıtlamasını kullanarak iki talimat ekleyin.
Anchor, hesabın verilerinin ilk 8 baytını, hesap türüne özgü bir ayrıştırıcı
olarak otomatik olarak ayarlar.

Ayrıca, `admin_config` hesabını `AdminConfig` hesap türü olarak doğrulayan
`update_admin` talimatını ekleyin. Anchor, hesap ayrıştırıcısının beklenen hesap türü ile eşleşip eşleşmediğini otomatik olarak kontrol edecektir:

```rust
use anchor_lang::prelude::*;

declare_id!("G36iNpB591wxFeaeq55qgTwHKJspBrETmgok94oyqgcc");

const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod type_checked {
    use super::*;

    pub fn initialize_admin(ctx: Context<InitializeAdmin>) -> Result<()> {
        ctx.accounts.admin_config.admin = ctx.accounts.admin.key();
        Ok(())
    }

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        ctx.accounts.user_account.user = ctx.accounts.user.key();
        Ok(())
    }

    pub fn update_admin(ctx: Context<UpdateAdmin>) -> Result<()> {
        ctx.accounts.admin_config.admin = ctx.accounts.admin.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAdmin<'info> {
    #[account(
        init,
        payer = admin,
        space = DISCRIMINATOR_SIZE + AdminConfig::INIT_SPACE
    )]
    pub admin_config: Account<'info, AdminConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = DISCRIMINATOR_SIZE + User::INIT_SPACE
    )]
    pub user_account: Account<'info, User>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(
        mut,
        has_one = admin
    )]
    pub admin_config: Account<'info, AdminConfig>,
    pub new_admin: SystemAccount<'info>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct AdminConfig {
    admin: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    user: Pubkey,
}
```

### 5. Güvenli update_admin Talimatını Test Edin

Test dosyasında, `type_checked` programından bir `AdminConfig` hesabını ve bir `User` hesabını başlatın.
Ardından, yeni oluşturulan hesapları geçirerek `updateAdmin` talimatını iki kez çağırın:

```typescript
describe("type-cosplay", () => {
    ...

  it("Tür denetimli AdminConfig Hesabını Başlat", async () => {
    try {
      await programChecked.methods
        .initializeAdmin()
        .accounts({
          adminConfig: adminAccountChecked.publicKey,
        })
        .signers([adminAccountChecked])
        .rpc();
    } catch (error) {
      throw new Error(
        `Tür denetimli AdminConfig Hesabını başlatma başarısız oldu: ${error.message}`
      );
    }
  });

  it("Tür denetimli Kullanıcı Hesabını Başlat", async () => {
    try {
      await programChecked.methods
        .initializeUser()
        .accounts({
          userAccount: userAccountChecked.publicKey,
          user: provider.wallet.publicKey,
        })
        .signers([userAccountChecked])
        .rpc();
    } catch (error) {
      throw new Error(
        `Tür denetimli Kullanıcı Hesabını başlatma başarısız oldu: ${error.message}`
      );
    }
  });

  it("Kullanıcı Hesabı kullanarak güncelleme talimatını çağır", async () => {
    try {
      await programChecked.methods
        .updateAdmin()
        .accounts({
          adminConfig: userAccountChecked.publicKey,
          newAdmin: newAdmin.publicKey,
          admin: provider.wallet.publicKey,
        })
        .rpc();
    } catch (error) {
      expect(error);
      console.log(error);
    }
  });

  it("AdminConfig Hesabı kullanarak güncelleme talimatını çağır", async () => {
    try {
      await programChecked.methods
        .updateAdmin()
        .accounts({
          adminConfig: adminAccountChecked.publicKey,
          newAdmin: newAdmin.publicKey,
          admin: provider.wallet.publicKey,
        })
        .rpc();
    } catch (error) {
      throw new Error(
        `AdminConfig Hesabı kullanarak güncelleme talimatını çağırma başarısız oldu: ${error.message}`
      );
    }
  });
})
```

`anchor test` komutunu çalıştırın. Kullanıcı hesap türünü geçerken,
bu talimatın `AdminConfig` türünde olmadığı için bir Anchor Hatası döndürmesini bekliyoruz:

```bash
'Program G36iNpB591wxFeaeq55qgTwHKJspBrETmgok94oyqgcc invoke [1]',
'Program log: Talimat: UpdateAdmin',
'Program log: admin_config hesabı nedeniyle oluşan Anchor Hatası. Hata Kodu: AccountDiscriminatorMismatch. Hata Numarası: 3002. Hata Mesajı: 8 baytlık ayrıştırıcı beklenenle eşleşmedi.',
'Program G36iNpB591wxFeaeq55qgTwHKJspBrETmgok94oyqgcc 200000 hesap biriminden 3506'sını tüketti',
'Program G36iNpB591wxFeaeq55qgTwHKJspBrETmgok94oyqgcc başarısız oldu: özel program hatası: 0xbba'
```

:::note
Anchor'un en iyi uygulamalarını takip etmek, programlarınızın bu
zayıflıktan kaçınmasını sağlar. Hesap yapıları oluştururken her zaman `#[account]`
özelliğini kullanın, hesapları başlatırken `init` kısıtlamasını kullanın ve
hesap doğrulama yapılarınızdaki `Account` türünü kullanın.
:::

Son çözüm kodu için, çözümün bulunduğu `solution` dalına bakabilirsiniz
[depolarda](https://github.com/solana-developers/type-cosplay/tree/solution).

## Meydan Okuma

Bu birim için diğer derslerde olduğu gibi, bu güvenlik açığını önlemek adına kendi ya da
başkalarının programlarını denetleyerek pratik yapın.

En az bir programı gözden geçirin ve hesap türlerinin bir ayrıştırıcıya sahip olduğundan,
ve bunların her hesap ve talimat için kontrol edildiğinden emin olun. 
Standart Anchor türleri bu kontrolü otomatik olarak gerçekleştirdiğinden,
yerel bir programda zayıflık bulma olasılığınız daha yüksektir.

Unutmayın, başkalarının programında bir hata veya istismar bulursanız, lütfen
onlara bildirin. Kendi programınızda bir tane bulursanız, hemen düzeltin.



Kodunuzu GitHub'a yükleyin ve
[bu dersi nasıl bulduğunuzu bize bildirin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=37ebccab-b19a-43c6-a96a-29fa7e80fdec)!
