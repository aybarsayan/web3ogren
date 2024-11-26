---
title: Anchor Program Yapısı
description:
  Anchor programlarının yapısını, ana makroları ve Solana program geliştirmesini
  basitleştirmedeki rollerini öğrenin
sidebarLabel: Program Yapısı
sidebarSortOrder: 1
---

[Anchor framework](https://www.anchor-lang.com/) kullanarak  
[Rust makrolarını](https://doc.rust-lang.org/book/ch19-06-macros.html) kullanarak  
şablon kodunu azaltır ve Solana programlarını yazarken gerekli olan  
güvenlik kontrollerinin uygulanmasını basitleştirir.

Bir Anchor programında bulunan ana makrolar şunlardır:

- `declare_id`: Programın zincir üzerindeki adresini belirtir
- [`#[program]`](#program-macro): Programın talimat mantığını içeren modülü belirtir
- [`#[derive(Accounts)]`](#derive-accounts-macro): Bir talimat tarafından gereken  
  hesaplar listesini belirtmek için yapılara uygulanır
- [`#[account]`](#account-macro): Program için özel hesap türleri oluşturmak üzere  
  yapılara uygulanır

## Örnek Program

Yukarıda bahsedilen makroların kullanımını gösteren basit bir programı  
inceleyelim. Aşağıdaki örnek program, `initialize` talimatına geçirilen  
`u64` değerini depolayan yeni bir hesap (`NewAccount`) oluşturur.

```rust filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Veri değiştirildi: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64,
}
```

## declare_id! makrosu

[`declare_id`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L430)  
makrosu, programın zincir üzerindeki adresini, program ID'si olarak bilinen şekilde belirtir.

```rust filename="lib.rs" {3}
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");
```

Varsayılan olarak, program ID'si `/target/deploy/your_program_name.json` dosyasında  
oluşturulan anahtar çiftinin ortak anahtarıdır.

:::tip
`declare_id` makrosundaki program ID'si değerini `/target/deploy/your_program_name.json`  
dosyasındaki anahtar çiftinin ortak anahtarı ile güncellemek için şu komutu çalıştırın:
:::

```shell filename="Terminal"
anchor keys sync
```

`anchor keys sync` komutu, bir havuzdan klonlanan bir depoda, klonlanmış  
repo'nun `declare_id` makrosundaki program ID'si değeri ile yerel `anchor build`  
komutunu çalıştırdığınızda oluşturulan program ID'si değeri eşleşmeyeceği için  
çalıştırılması faydalıdır.

## #[program] makrosu

[`#[program]`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/program/src/lib.rs#L12)  
makrosu, programınız için tüm talimat işleyicilerini içeren modülü tanımlar. Bu  
modül içerisindeki her bir genel işlev, çağrılabilecek bir talimata karşılık gelir.

```rust filename="lib.rs" {5, 8-12}
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Veri değiştirildi: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64,
}
```

### Talimat Kontexte

Talimat işleyicileri, bir talimat çağrıldığında yürütülen mantığı tanımlayan  
fonksiyonlardır. Her işleyicinin ilk parametresi, talimatın gerektirdiği  
hesapları belirten `Context` türüdür; burada `T`, `Accounts` arayüzünü  
uygulayan bir yapıdır.

`Context` tipi, talimata aşağıdaki argüman olmayan girdilere erişim sağlar:

```rust
pub struct Context<'a, 'b, 'c, 'info, T> {
    /// Mevcut yürütülen program id'si.
    pub program_id: &'a Pubkey,
    /// Ters çevrilmiş hesaplar.
    pub accounts: &'b mut T,
    /// Verilmiş ama ters çevrilmemiş ya da doğrulanmamış kalan hesaplar.
    /// Bunun doğrudan kullanırken dikkatli olunmalıdır.
    pub remaining_accounts: &'c [AccountInfo<'info>],
    /// Kısıtlama doğrulaması sırasında bulunan bump tohumları. Bu, işleyicilerin
    /// yeniden bump tohumlarını hesaplaması ya da bunları argüman olarak geçmesi
    /// gerekmediği için bir kolaylık olarak sağlanır.
    pub bumps: BTreeMap<String, u8>,
}
```

`Context` alanlarına talimatta nokta notasyonu kullanarak erişilebilir:

- `ctx.accounts`: Talimat için gereken hesaplar
- `ctx.program_id`: Programın ortak anahtarı (adres)
- `ctx.remaining_accounts`: `Accounts` yapısında belirtilmemiş ek hesaplar.
- `ctx.bumps`: `Accounts` yapısında belirtilen her  
  `Program Türetilmiş Adresi (PDA)` hesapları için bump  
  tohumları

Ek parametreler isteğe bağlıdır ve talimat çağrıldığında sağlanması gereken  
argümanları belirtmek için eklenebilir.

```rust filename="lib.rs" /Context/ /data/1
pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
    ctx.accounts.new_account.data = data;
    msg!("Veri değiştirildi: {}!", data);
    Ok(())
}
```

Bu örnekte, `Initialize` yapısı, `initialize` talimatı tarafından gereken  
her bir alanı temsil eden `Accounts` arayüzünü uygular.

```rust filename="lib.rs" /Initialize/ /Accounts/
#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Veri değiştirildi: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

## #[derive(Accounts)] makrosu

[`#[derive(Accounts)]`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/derive/accounts/src/lib.rs#L630)  
makrosu, bir talimat çağrıldığında sağlanması gereken hesapları belirtmek için  
bir yapıya uygulanır. Bu makro, hesapların doğrulaması ve hesap verilerinin  
serileştirilmesi ve ters çevrilmesini basitleştiren  
[`Accounts`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/src/lib.rs#L105)  
arayüzünü uygular.

```rust /Accounts/ {1}
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

Yapının her bir alanı, bir talimat tarafından gereken hesapları temsil eder.  
Her bir alanın isimlendirilmesi keyfidir, ancak hesabın amacını gösteren  
tanımlayıcı bir ad kullanılması önerilir.

### Hesap Doğrulama

Güvenlik açıklarını önlemek için, bir talimata sağlanan hesapların beklenen  
hesaplar olduğunun doğrulanması önemlidir. Hesaplar, Anchor programlarında  
genellikle birlikte kullanılan iki şekilde doğrulanır:

- [Hesap Kısıtlamaları](https://www.anchor-lang.com/docs/account-constraints):  
  Kısıtlamalar, bir hesabın talimat için geçerli sayılması için sağlaması gereken  
  ek şartları tanımlar. Kısıtlamalar, `Accounts` arayüzünü uygulayan bir  
  yapının üstüne yerleştirilen `#[account(..)]` niteliği ile uygulanır.

  Kısıtlamaların uygulanmasını [buradan](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/syn/src/parser/accounts/constraints.rs) bulabilirsiniz.
  
  ```rust {3, 5}
  #[derive(Accounts)]
  pub struct Initialize<'info> {
      #[account(init, payer = signer, space = 8 + 8)]
      pub new_account: Account<'info, NewAccount>,
      #[account(mut)]
      pub signer: Signer<'info>,
      pub system_program: Program<'info, System>,
  }
  ```

- [Hesap Türleri](https://www.anchor-lang.com/docs/account-types):  
  Anchor, istemcinin sağladığı hesabın programın beklediği ile eşleşmesini  
  sağlamak için çeşitli hesap türleri sunar.

  Hesap türlerinin uygulanmasını [buradan](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/src/accounts) bulabilirsiniz.

  ```rust /Account/2 /Signer/ /Program/
  #[derive(Accounts)]
  pub struct Initialize<'info> {
      #[account(init, payer = signer, space = 8 + 8)]
      pub new_account: Account<'info, NewAccount>,
      #[account(mut)]
      pub signer: Signer<'info>,
      pub system_program: Program<'info, System>,
  }
  ```

Bir Anchor programında bir talimat çağrıldığında, program önce sağlanan  
hesapları doğrular, sonra talimatın mantığını yürütür. Doğrulamadan sonra,  
bu hesaplar talimat içerisinde `ctx.accounts` sözdizimini kullanarak  
erişilebilir.

## #[account] makrosu

[`#[account]`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L66)  
makrosu, programınız tarafından oluşturulan özel hesaplarda depolanan verileri  
tanımlayan yapılara uygulanır.

```rust
#[account]
pub struct NewAccount {
    data: u64,
}
```

Bu makro, [burada](https://docs.rs/anchor-lang/latest/anchor_lang/attr.account.html)  
detaylandırılan çeşitli nitelikleri uygulamaktadır. `#[account]` makrosunun temel  
işlevsellikleri şunlardır:

- [Program Sahibini Atama](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L119-L132):  
  Bir hesap oluşturulduğunda, hesabın program sahibi otomatik olarak `declare_id`  
  içinde belirtilen program olarak ayarlanır.
- [Ayırıcıyı Ayarlama](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L101-L117):  
  Hesap verilerinin ilk 8 byte'ına, hesap türüne özgü benzersiz bir 8 byte ayırıcı  
  eklenir. Bu, hesap türlerinin ayırt edilmesine yardımcı olur ve hesap  
  doğrulamasında kullanılır.
- [Veri Serileştirme ve Ters Çevirme](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L202-L246):  
  Hesap verileri otomatik olarak serileştirilir ve ters çevrilir.

### Hesap Ayırıcı

Anchor programındaki bir hesap ayırıcı, her hesap türüne özgü 8 byte'lık bir  
tanımlayıcıyı ifade eder. Bu, `account:` stringinin SHA256 hash'inin  
ilk 8 byte'ından türetilir. Bu ayırıcı, bir hesap oluşturulduğunda hesap verisinin  
ilk 8 byte'ı olarak depolanır.

Anchor programında bir hesap oluştururken, ayırıcı için 8 byte tahsis  
edilmelidir.

```rust /8/1
#[account(init, payer = signer, space = 8 + 8)]
pub new_account: Account<'info, NewAccount>,
```

Ayırıcı aşağıdaki iki senaryoda kullanılır:

- Başlatma: Bir hesap oluşturulduğunda, ayırıcı hesap verisinin ilk 8 byte'ı  
  olarak ayarlanır.
- Ters Çevirme: Hesap verisi ters çevrildiğinde, hesap verisinin ilk 8 byte'ı  
  beklenen hesap türünün ayırıcısı ile karşılaştırılır.

Eğer bir tutarsızlık varsa, istemcinin beklenmeyen bir hesap sağladığını  
gösterir. Bu mekanizma, Anchor programlarında bir hesap doğrulama kontrolü  
olarak hizmet vermektedir.