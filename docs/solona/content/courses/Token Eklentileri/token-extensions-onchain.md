---
title: Zincir Üzerindeki Programlarda Token Uzantılarını Kullanın
objectives:
  - Programınızda hem token programı hesaplarını hem de mint'leri kabul edin
  - Token Programı ile Token Uzantıları programları arasındaki farkları açıklayın
  - Anchor Arayüzlerinin nasıl kullanılacağını açıklayın
description: "Zincir üzerindeki programlarda token uzantılarını kullanın."
---

## Özet

- `Token Uzantıları Programı`, farklı bir program kimliği ile `Token Programı`nın bir üst kümesidir.
- `token_program`, bir hesabın belirli bir token programına ait olduğunu doğrulamanızı sağlayan bir Anchor hesap kısıtlamasıdır.
- Anchor, hem `Token Programı` hem de `Token Uzantıları Programı` ile etkileşimi kolaylaştırmak için Arayüzler kavramını tanıttı.

## Genel Bakış

`Token Uzantıları Programı`, Solana ana ağında Solana token'larına ve mint'lerine ek işlevsellik sağlayan bir programdır. `Token Uzantıları Programı`, `Token Programı`nın bir üst kümesidir. Temel olarak, ek işlevselliğin sonuna eklenmesiyle byte byte yeniden oluşturmadır. Ancak hâlâ ayrı programlardır. İki tür Token Programı ile, talimatlarda program türünün gönderileceğini öngörmeliyiz.

:::note
Bu derste, programınızı Anchor kullanarak `Token Programı` ve `Token Uzantıları Programı` hesaplarını kabul edecek şekilde tasarlamayı öğreneceksiniz. Ayrıca `Token Uzantıları Programı` hesapları ile nasıl etkileşimde bulunacağınızı, bir hesabın hangi token programına ait olduğunu tanımlamayı ve zincir üzerindeki `Token Programı` ile `Token Uzantıları Programı` arasındaki bazı farklılıkları öğreneceksiniz.
:::

### Eski Token Programı ile Token Uzantıları Programı Arasındaki Fark

`Token Uzantıları Programı`nın orijinal `Token Programı`ndan ayrı olduğunu netleştirmeliyiz. `Token Uzantıları Programı`, orijinal `Token Programı`nın bir üst kümesidir; bu da tüm talimatların ve işlevselliğin orijinal `Token Programı` ile birlikte geldiği anlamına gelir.

Daha önce, birincil bir program ( `Token Programı`) hesap oluşturmaktan sorumlu idi. Solana'ya daha fazla kullanım durumu geldikçe, yeni token işlevselliğine ihtiyaç duyuldu. Tarihsel olarak, yeni token işlevselliği eklemenin tek yolu yeni bir token türü oluşturmaktı. Yeni bir token, kendi programına ihtiyaç duyar ve bu yeni token'ı kullanmak isteyen herhangi bir cüzdan veya istemci, onu desteklemek için özel bir mantık eklemek zorunda kalırdı. Neyse ki, farklı token türlerini destekleme sıkıntısı, bu seçeneğin pek çok popüler olmamasını sağladı. Ancak yeni işlevsellik hâlâ çok ihtiyaç duyuluyordu ve bu yüzden `Token Uzantıları Programı` oluşturuldu.

Daha önce bahsedildiği gibi, `Token Uzantıları Programı`, orijinal token programının sıkı bir üst kümesidir ve tüm önceki işlevselliği içerir. `Token Uzantıları Programı` geliştirme ekibi, yeni işlevsellik eklerken kullanıcılar, cüzdanlar ve dApp'lere minimum kesinti sağlamak için bu yaklaşımı seçti. `Token Uzantıları Programı`, Token programı ile aynı talimat setini destekler ve en son talimata kadar byte byte aynıdır, var olan programların `Token Uzantılarını` kutudan çıkma özelliği ile desteklemesini sağlar. Ancak bu, `Token Uzantıları Programı` token'ları ve `Token Programı` token'larının birbiriyle etkileşimli olduğu anlamına gelmez - değildirler. 

**Her birini ayrı olarak ele almamız gerekecek.**

### Belirli Bir Token'ı Hangi Programın Sahip Olduğunu Nasıl Belirleyebiliriz

Anchor ile iki farklı token programını yönetmek oldukça kolaydır. Artık programlarımız içinde token'lar ile çalıştığımızda `token_program` kısıtlamasını kontrol edeceğiz.

İki token programının `ID`'leri aşağıdaki gibidir:

```rust
use spl_token::ID; // Token Programı
use anchor_spl::token_2022::ID; // Token Uzantıları Programı
```

Normal `Token Programı` için kontrol etmek isterseniz aşağıdaki gibi kullanırsınız:

```rust
use spl_token::ID;

// verilen token/mint hesaplarının spl-token programına ait olduğunu doğrulama
#[account(
    mint::token_program = ID,
)]
pub token_a_mint: Box>,
#[account(
    token::token_program = ID,
)]
pub token_a_account: Box>,
```

`Token Uzantıları Programı` için aynı şeyi yapabilirsiniz, sadece farklı bir ID ile.

```rust
use anchor_spl::token_2022::ID;

// verilen token/mint hesaplarının Token Uzantıları programına ait olduğunu doğrulama
#[account(
    mint::token_program = ID,
)]
pub token_a_mint: Box>,
#[account(
    token::token_program = ID,
)]
pub token_a_account: Box>,
```

Bir istemci yanlış token programı hesabını geçirdiğinde, talimat başarısız olacaktır. Ancak bu, iki programı desteklemek istersek bir sorunu gündeme getirir. Eğer program `ID`'sini kodlamaya alırsak, iki kat daha fazla talimat almamız gerekecek. Neyse ki, programınıza geçen token hesaplarının belirli bir token programına ait olduğunu doğrulamak mümkündür. Bunu daha önceki örneklere benzer bir şekilde yaparsınız. Token programının statik `ID`'sini geçmek yerine verilen `token_program`'ı kontrol edersiniz.

```rust
// verilen token ve mint hesaplarının verilen token_program ile eşleşip eşleşmediğini doğrula
#[account(
    mint::token_program = token_program,
)]
pub token_a_mint: Box>,
#[account(
    token::token_program = token_program,
)]
pub token_a_account: Box>,
pub token_program: Interface<'info, token_interface::TokenInterface>,
```

Bir token hesabı ile mint'in hangi token programına ait olduğunu kontrol etmek isterseniz, `AccountInfo` yapısındaki owner alanına başvurabilirsiniz. Aşağıdaki kod, sahibi programın kimliğini günlüğe kaydedecektir. Bu alanı, `spl-token` ve `Token Uzantıları Programı` hesapları için farklı mantıkları yürütmek üzere bir koşullu ifadede kullanabilirsiniz.

```rust
msg!("Token Program Sahibi: {}", ctx.accounts.token_account.to_account_info().owner);
```

### Anchor Arayüzleri

Arayüzler, `Token Uzantılarını` kullanmayı sadeleştiren Anchor'ın en yeni özelliğidir. `anchor_lang` kütüphanesinden iki ilgili arayüz sarmalayıcı türü bulunmaktadır:

- [`Interface`](https://docs.rs/anchor-lang/latest/anchor_lang/accounts/interface/index.html)
- [`InterfaceAccount`](https://docs.rs/anchor-lang/latest/anchor_lang/accounts/interface_account/index.html)

Ve `anchor_spl` kütüphanesinden üç karşılık gelen Hesap Türü:

- [`Mint`](https://docs.rs/anchor-spl/latest/anchor_spl/token_interface/struct.Mint.html)
- [`TokenAccount`](https://docs.rs/anchor-spl/latest/anchor_spl/token_interface/struct.TokenAccount.html)
- [`TokenInterface`](https://docs.rs/anchor-spl/latest/anchor_spl/token_interface/struct.TokenInterface.html)

Önceki bölümde örneğimizde `token_program`'ı şu şekilde tanımladık:

```rust
pub token_program: Interface<'info, token_interface::TokenInterface>,
```

Bu kod, `Interface` ve `token_interface::TokenInterface`'ı kullanmaktadır.

> **“Interface”, orijinal “Program” türünün üzerinde bir sarmalayıcıdır ve birden fazla olası program kimliği sağlar.” — Anchor Belgeleri**

Belirtilen arayüz türünden beklenen hesaplar kümesinden birinin hesap olduğunu doğrulayan bir türdür. `Interface` türü aşağıdakileri kontrol eder:

- Verilen hesabın çalıştırılabilir olup olmadığını
- Verilen arayınç türünden beklenen bir hesaplar kümesinden birinin olup olmadığını

Özel bir arayüz türü ile birlikte `Interface` sarmalayıcısını kullanmalısınız. `anchor_lang` ve `anchor_spl` kütüphaneleri, kutudan çıktığı gibi aşağıdaki `Interface` türünü sağlar:

- [TokenInterface](https://docs.rs/anchor-spl/latest/anchor_spl/token_interface/struct.TokenInterface.html)

`TokenInterface`, geçen hesabın pubkey'inin ya `spl_token::ID` ya da `spl_token_2022::ID` ile eşleşmesini bekleyen bir arayüz türü sağlar. Bu program kimlikleri, Anchor'daki `TokenInterface` türünde sabit kodlanmıştır.

```rust
static IDS: [Pubkey; 2] = [spl_token::ID, spl_token_2022::ID];

#[derive(Clone)]
pub struct TokenInterface;

impl anchor_lang::Ids for TokenInterface {
    fn ids() -> &'static [Pubkey] {
        &IDS
    }
}
```

Anchor, geçen hesabın kimliğinin yukarıdaki iki kimlikten birine eşleşip eşleşmediğini kontrol eder. Verilen hesap bu ikisinden hiçbirine uymuyorsa, Anchor `InvalidProgramId` hatası fırlatır ve işlemin yürütülmesini engeller.

```rust
impl<T: Ids> CheckId for T {
    fn check_id(id: &Pubkey) -> Result<()> {
        if !Self::ids().contains(id) {
            Err(error::Error::from(error::ErrorCode::InvalidProgramId).with_account_name(*id))
        } else {
            Ok(())
        }
    }
}

.
.
.

impl<'a, T: CheckId> TryFrom<&'a AccountInfo<'a>> for Interface<'a, T> {
    type Error = Error;
    /// Verilen `info`yu `Program`a deserialize eder.
    fn try_from(info: &'a AccountInfo<'a>) -> Result<Self> {
        T::check_id(info.key)?;
        if !info.executable {
            return Err(ErrorCode::InvalidProgramExecutable.into());
        }
        Ok(Self::new(info))
    }
}
```

`InterfaceAccount` türü, `Interface` türüne benzer; bu sefer `AccountInfo` üzerinde bir sarmalayıcıdır. `InterfaceAccount`, hesaplar üzerinde kullanılır; program sahipliğini doğrular ve alt verileri Rust türüne deserialize eder. Bu ders, token ve mint hesapları üzerinde `InterfaceAccount` kullanmaya odaklanacaktır. Daha önce bahsettiğimiz `anchor_spl::token_interface` kütüphanesinden `Mint` veya `TokenAccount` türleri ile `InterfaceAccount` sarmalayıcısını kullanabiliriz. İşte bir örnek:

```rust
use {
    anchor_lang::prelude::*,
    anchor_spl::{token_interface},
};

#[derive(Accounts)]
pub struct Example<'info>{
    // Token hesabı
    #[account(
        token::token_program = token_program
    )]
    pub token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
    // Mint hesabı
    #[account(
        mut,
        mint::token_program = token_program
    )]
    pub mint_account: InterfaceAccount<'info, token_interface::Mint>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
}
```

Eğer Anchor ile tanışsanız, `TokenAccount` ve `Mint` hesap türlerinin yeni olmadığını fark edebilirsiniz. Ancak yeni olan şey, bu türlerin `InterfaceAccount` sarmalayıcısı ile nasıl çalıştığıdır. `InterfaceAccount` sarmalayıcısı, `Token Programı` veya `Token Uzantıları Programı` hesaplarının geçirilmesine ve deserialize edilmesine olanak tanır; tıpkı `Interface` ve `TokenInterface` türleri gibi. Bu sarmalayıcılar ve hesap türleri, geliştiricilere `Token Programı` ve `Token Uzantıları Programı` ile etkileşimde bulunma konusunda esneklik sağlayacak şekilde bir arada çalışıyor.

:::warning
Ancak, `token_interface` modülünden bu türleri, normal Anchor `Program` ve `Account` sarmalayıcıları ile kullanamazsınız. Bu yeni türler yalnızca `Interface` veya `InterfaceAccount` sarmalayıcıları ile kullanılır. Örneğin, aşağıdakiler geçerli olmayacak ve bu hesap deserialize etme işlemiyle gönderilen herhangi bir işlemin hata döndüreceği anlamına gelir.
:::

```rust
// Bu geçersiz, bir örnek olarak kullanıldı.
// token_interface::* türü üzerinde Account saramazsınız.
pub token_account: Account<'info, token_interface::TokenAccount>
```

## Laboratuvar

Şimdi, `Token Uzantıları Programı` üzerinde elle tutulan deneyim kazanalım; hem `Token Programı` hem de `Token Uzantıları Programı` hesaplarını kabul edecek genel bir token staking programı uygulayarak. Staking programları açısından bu, şu tasarımla basit bir uygulama olacaktır:

- Tüm stake edilen token'ları tutacak bir stake havuz hesabı oluşturacağız. Belirli bir token için yalnızca bir staking havuzu olacaktır. Program bu hesabın sahibi olacaktır.
- Her stake havuzunun, havuzda stake edilen token'ların miktarı vb. ile ilgili bilgileri tutacak bir durum hesabı olacaktır.
- Kullanıcılar, istedikleri kadar token stake edebilirler; token hesaplarından stake havuzuna transfer ederek.
- Her kullanıcı için stake ettikleri her havuz için oluşturulacak bir durum hesabı olacaktır. Bu durum hesabı, bu havuzda kaç token stake ettiklerini, en son ne zaman stake ettiklerini vb. takip edecektir.
- Kullanıcılara, unstaking sonrasında staking ödül token'ları verilecektir. Ayrı bir talep süreci gerekli değildir.
- Bir kullanıcının staking ödüllerini basit bir algoritma kullanarak belirleyeceğiz.
- Program, hem `Token Programı` hem de `Token Uzantıları Programı` hesaplarını kabul edecektir.

Programın dört talimatı olacaktır: `init_pool`, `init_stake_entry`, `stake`, `unstake`.

:::info
Bu laboratuvar, bu kursta daha önce ele alınan pek çok Anchor ve Solana API'sini kullanacaktır. Bazı kavramları açıklamak için zaman harcamayacağız; bilmeniz beklenen konular. Bununla birlikte, başlayalım.
:::

#### 1. Solana/Anchor/Rust Sürümlerini Kontrol Edin

Bu laboratuvarda `Token Uzantıları` programı ile etkileşimde bulunacağız ve bu, Solana cli sürümünün ≥ `1.18.0` olmasını gerektirir.

Sürümünüzü kontrol etmek için aşağıdaki komutu çalıştırın:

```bash
solana --version
```

`solana --version` komutunu çalıştırdıktan sonra yazdırılan sürüm `1.18.0`'dan küçükse, 
`cli sürümünü manuel olarak güncelleyebilirsiniz`. Yazılış anında, `solana-install update` komutunu çalıştırarak CLI'yı doğru sürüme güncelleyemezsiniz. Bu komut bizim için CLI'yı doğru sürüme güncellemeyecek, bu nedenle açıkça `1.18.0` sürümünü indirmemiz gerekiyor. Bunu aşağıdaki komut ile yapabilirsiniz:

```bash
solana-install init 1.18.0
```

Eğer programı oluştururken aşağıdaki hata ile karşılaşırsanız, bu muhtemelen Solana CLI'nın doğru sürümünü yüklemediğiniz anlamına gelir.

```bash
anchor build
error: package `solana-program v1.18.0` cannot be built because it requires rustc 1.72.0 or newer, while the currently active rustc version is 1.68.0-dev
Either upgrade to rustc 1.72.0 or newer, or use
cargo update -p solana-program@1.18.0 --precise ver
where `ver` is the latest version of `solana-program` supporting rustc 1.68.0-dev
```

Ayrıca en son Anchor CLI sürümünün yüklü olduğundan emin olmalısınız. Güncelleme adımlarını takip edebilirsiniz 
avm ile buradan: https://www.anchor-lang.com/docs/avm veya basitçe :

```bash
avm install latest
avm use latest
```

Yazıldığı sırada, en son Anchor CLI sürümü `0.29.0`'dır.

**Artık doğru tüm sürümlere sahip olmalıyız.**

#### 2. Başlangıç Kodunu Alın ve Bağımlılıkları Ekleyin

Başlangıç dalını alalım.

```bash
git clone https://github.com/Unboxed-Software/token22-staking
cd token22-staking
git checkout starter
```

#### 3. Program ID'sini ve Anchor Anahtar Çifti'ni Güncelleyin

Başlangıç dalına girdikten sonra, `anchor keys list` komutunu çalıştırarak program ID'nizi alın.

Bu program ID'sini `Anchor.toml` dosyasına kopyalayın ve yapıştırın:

```rust
// in Anchor.toml
[programs.localnet]
token_22_staking = "<YOUR-PROGRAM-ID-HERE>"
```

Ve `programs/token-22-staking/src/lib.rs` dosyasında:

```rust
declare_id!("<YOUR-PROGRAM-ID-HERE>");
```

Son olarak, `Anchor.toml` dosyasında geliştirici anahtar çiftinizin yolunu ayarlayın.

```toml
[provider]
cluster = "Localnet"
wallet = "/YOUR/PATH/HERE/id.json"
```

Mevcut anahtar çiftinizin yolunu bilmiyorsanız, bunu bulmak için Solana cli'sini çalıştırabilirsiniz.

```bash
solana config get
```

#### 4. Programın Oluştuğunu Doğrulayın

Başlangıç kodunu derleyecek ve her şeyin doğru yapılandırıldığını doğrulayacağız. Derlenmiyorsa, lütfen yukarıdaki adımları tekrar kontrol edin.

```bash
anchor build
```

Derleme scriptinin uyarılarını güvenle göz ardı edebilirsiniz, bunlar gerekli kodu eklediğimizde kaybolacaktır.

Geliştirme ortamının diğer kısmının doğru şekilde ayarlandığından emin olmak için sağlanan testleri çalıştırmaktan çekinmeyin. Node bağımlılıklarını `npm` veya `yarn` kullanarak kurmanız gerekecek. Testler çalıştırılabilir, ancak programımızı tamamlamadan önce hepsi başarısız olacaktır.

```bash
yarn install
anchor test
```

#### 5. Program Tasarımını Keşfedin

Programın düzgün derlendiğini doğruladığımıza göre, programın düzenine bir göz atalım. `/programs/token22-staking/src` içinde birkaç farklı dosya olduğunu göreceksiniz:

- `lib.rs`
- `error.rs`
- `state.rs`
- `utils.rs`

`errors.rs` ve `utils.rs` dosyaları önceden sizin için doldurulmuştur. `errors.rs`, programımız için özel hatalarımızı tanımladığımız yer. Bunu yapmak için tek yapmanız gereken herkese açık bir `enum` oluşturmak ve her hatayı tanımlamaktır.

`utils.rs`, yalnızca `check_token_program` adında bir işlev içeren bir dosyadır. Bu, ihtiyaç duyduğunuz takdirde yardımcı işlevler yazabileceğiniz bir dosyadır. Bu işlev daha önceden yazılmıştır ve programımızda talimatın geçirdiği belirli token programını günlüğe kaydetmek için kullanılacaktır. Bu programda hem `Token Uzantıları Programı` hem de `spl-token` kullanacağız, bu nedenle bu işlev bu ayrımı netleştirmek için yardımcı olacaktır.

`lib.rs`, programımızın giriş noktasıdır; diğer tüm Solana programlarında yaygın bir uygulama olarak. Burada, `declare_id` Anchor makrosunu kullanarak program kimliğimizi tanımlıyoruz ve herkese açık `token_22_staking` modülünü oluşturuyoruz. Bu modül, kamuya açık olarak çağrılabilen talimatlarımızı tanımladığımız yer, bunlar programımızın API'si olarak düşünülebilir.

Burada dört ayrı talimat tanımlanmıştır:

- `init_pool`
- `init_stake_entry`
- `stake`
- `unstake`

Bu talimatların her biri, başka bir yerde tanımlanan bir `handler` yöntemine yapılan bir çağrıdır. Bunu programı modülerleştirmek için yapıyoruz; bu, programın daha düzenli kalmasına yardımcı olur. Büyük programlarla çalışırken bu genellikle iyi bir fikirdir.

#### 6. `state.rs`'yi Uygulayın

`/src/state.rs` dosyasını açın. Burada, programımız boyunca ihtiyaç duyacağımız bazı durum veri yapıları ve birkaç sabit tanımlayacağız. Öncelikle burada ihtiyaç duyacağımız paketleri tanıtalım.

```rust
use {
    anchor_lang::prelude::*,
    solana_program::{pubkey::Pubkey},
};
```

Sonrasında, program boyunca referans verilecek birkaç tohum tanımlayacağız. Bu tohumlar, programımızın bekleyeceği farklı PDA'lar türetmek için kullanılacaktır.

```rust
pub const STAKE_POOL_STATE_SEED: &str = "state";
pub const VAULT_SEED: &str = "vault";
pub const VAULT_AUTH_SEED: &str = "vault_authority";
pub const STAKE_ENTRY_SEED: &str = "stake_entry";
```

Artık, programımızın durumu tutmak için kullanacağı iki farklı hesabı tanımlayan iki veri yapısı tanımlayacağız: `PoolState` ve `StakeEntry`.

`PoolState` hesabı, belirli bir staking havuzuna dair bilgileri tutmak amacıyla oluşturulmuştur.

```rust
#[account]
pub struct PoolState {
    pub bump: u8,
    pub amount: u64,
    pub token_mint: Pubkey,
    pub staking_token_mint: Pubkey,
    pub staking_token_mint_bump: u8,
    pub vault_bump: u8,
    pub vault_auth_bump: u8,
    pub vault_authority: Pubkey,
}
```

`StakeEntry` hesabı, belirli bir kullanıcının o havuzdaki stake'ini tutacaktır.

```rust
#[account]
pub struct StakeEntry {
    pub user: Pubkey,
    pub user_stake_token_account: Pubkey,
    pub bump: u8,
    pub balance: u64,
    pub last_staked: i64,
}
```

#### 7. `init_pool` Talimatı

Program mimarimizin ne olduğunu anladıktan sonra, ilk talimat `init_pool` ile başlayalım.

`init_pool.rs` dosyasını açtığınızda, aşağıdakileri görmelisiniz:

```rust
use {
    anchor_lang::prelude::*,
    crate::{state::*, utils::*},
    anchor_spl::{token_interface},
    std::mem::size_of
};

pub fn handler(ctx: Context<InitializePool>) -> Result <()> {
    check_token_program(ctx.accounts.token_program.key());

    Ok(())
}
```

# Frequency Guidelines:

## 1. Strategic Use of Admonitions:
:::tip
For helpful suggestions and best practices, consider initializing your variables wisely to avoid errors.
:::

:::info
It's important to understand the purpose of each account structure to ensure your program functions correctly.
:::

:::warning
Make sure your `UncheckedAccount` is validated properly; failing to do so could lead to security risks.
:::

:::note
Remember, the `InterfaceAccount` is specifically designed to manage interactions with both Token Program and Token Extensions.
:::

:::danger
Critical warning: Always verify the authority of token accounts to prevent unauthorized access.
:::

---

## 2. Quote Formatting:
> "Struct field 'pool_authority' is unsafe, but is not documented."  
— Anchor Language Documentation

This emphasizes the importance of correctly documenting checks for accounts that are deemed unsafe.

---

## 3. Details Elements:

Additional Context on Account Structures
The account structures must be properly defined to ensure a successful transaction. Each account should adhere to specified constraints and carry the correct attributes.


---

## 4. Content Structure:
To enhance readability, the structure of content can be significantly improved:

1. Break long paragraphs into digestible chunks for clarity.
2. Use **bold** and _italic_ for emphasis on key terms.
3. Convert the list of required accounts into bullet points:

   - `pool_authority` - Authority PDA for all staking pools.
   - `pool_state` - State account created for this specific staking pool.
   - `token_mint` - Mint of the tokens expected to be staked in the pool.
   - `token_vault` - Token account on a PDA for the staked tokens.
   - `staking_token_mint` - Mint for the staking rewards token.
   - `payer` - Account that pays for the staking pool creation.
   - `token_program` - Token program associated with given tokens and mint accounts.
   - `system_program` - System program.
   - `rent` - Rent program.

---

## 5. Requirements:
Ensure that all code blocks remain untouched while maintaining the technical terms and the existing markdown hierarchy.

### The Account Structure Example:
```rust
#[derive(Accounts)]
pub struct InitializePool<'info> {
    /// CHECK: PDA, tüm token vaultları üzerindeki yetki
    #[account(
        seeds = [VAULT_AUTH_SEED.as_bytes()],
        bump
    )]
    pub pool_authority: UncheckedAccount<'info>,
    // havuz durumu hesabı
    #[account(
        init,
        seeds = [token_mint.key().as_ref(), STAKE_POOL_STATE_SEED.as_bytes()],
        bump,
        payer = payer,
        space = 8 + size_of::<PoolState>()
    )]
    pub pool_state: Account<'info, PoolState>,
    // token minti
    #[account(
        mint::token_program = token_program,
        mint::authority = payer
    )]
    pub token_mint: InterfaceAccount<'info, token_interface::Mint>,
    // Token Mint için havuz token hesabı
    #[account(
        init,
        token::mint = token_mint,
        token::authority = pool_authority,
        token::token_program = token_program,
        seeds = [token_mint.key().as_ref(), pool_authority.key().as_ref(), VAULT_SEED.as_bytes()],
        bump,
        payer = payer,
    )]
    pub token_vault: InterfaceAccount<'info, token_interface::TokenAccount>,
    // staking token minti
    #[account(
        mut,
        mint::token_program = token_program
    )]
    pub staking_token_mint: InterfaceAccount<'info, token_interface::Mint>,
    // payer, havuz vaultının oluşturulması için ödeme yapacak
    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>
}
```

#### 9. `stake` Talimatı

`stake` talimatı, kullanıcıların tokenlerini gerçekten stake etmek istediklerinde çağrılan talimattır. Bu talimat, kullanıcının stake etmek istediği token miktarını, program tarafından sahip olunan havuz kasası hesabına aktarır. Bu talimatta, potansiyel olarak kötü niyetli işlem gerçekleştirilmesini önlemek için çok sayıda doğrulama bulunmaktadır.

**Gerekli hesaplar şunlardır:**

- `pool_state` - Staking havuzunun state hesabı.
- `token_mint` - Stake edilen tokenin mint'i. Bu aktarım için gereklidir.
- `pool_authority` - Tüm staking havuzları üzerinde yetki veren PDA.
- `token_vault` - Bu havuzda stake edilen tokenlerin tutulduğu token kasası hesabı.
- `user` - Tokenleri stake etmeye çalışan kullanıcı.
- `user_token_account` - Kullanıcının stake etmek istediği tokenlerin aktarılacağı kullanıcı sahipli token hesabı.
- `user_stake_entry` - Önceki talimatta oluşturulan Kullanıcı `StakeEntry` hesabı.
- `token_program`
- `system_program`

---

Öncelikle, `Stake` hesap yapısını oluşturalım.

İlk olarak, `pool_state` hesabına bakalım. Bu, önceki talimatlarda kullandığımız, aynı tohumlar ve bump ile türetilmiş olan aynı hesaptır.

```rust
#[derive(Accounts)]
pub struct Stake<'info> {
    // pool state account
    #[account(
        mut,
        seeds = [token_mint.key().as_ref(), STAKE_POOL_STATE_SEED.as_bytes()],
        bump = pool_state.bump,
    )]
    pub pool_state: Account<'info, PoolState>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
}
```

Sonraki, bu talimat için transfer CPI'sinde gerekli olan `token_mint`. Bu, stake edilen tokenin mint'idir. Verilen mint'in belirtilen `token_program`a ait olduğunu doğruluyoruz ki burada hiçbir `spl-token` ve `Token Extensions Program` hesaplarının karışmadığından emin olalım.

```rust
// Mint of token to stake
#[account(
    mut,
    mint::token_program = token_program
)]
pub token_mint: InterfaceAccount<'info, token_interface::Mint>,
```

`pool_authority` hesabı, yine tüm staking havuzları üzerinde yetki olan PDA'dır.

```rust
/// CHECK: PDA, auth over all token vaults
#[account(
    seeds = [VAULT_AUTH_SEED.as_bytes()],
    bump
)]
pub pool_authority: UncheckedAccount<'info>,
```

Şimdi `token_vault` var, bu tokenler stake edilirken tutulacaktır. Bu hesap doğrulanmalıdır, çünkü tokenler buraya aktarılacaktır. Burada, verilen hesabın `token_mint`, `pool_authority` ve `VAULT_SEED` tohumlarından türetilen beklenen PDA olduğunu doğruluyoruz. Verilen token hesabının belirtilen `token_program`a ait olduğunu da doğruluyoruz. Burada, yine `InterfaceAccount` ve `token_interface::TokenAccount` kullanarak hem `spl-token` hem de `Token Extensions Program` hesaplarını destekliyoruz.

```rust
// pool token account for Token Mint
#[account(
    mut,
    // use token_mint, pool auth, and constant as seeds for token a vault
    seeds = [token_mint.key().as_ref(), pool_authority.key().as_ref(), VAULT_SEED.as_bytes()],
    bump = pool_state.vault_bump,
    token::token_program = token_program
)]
pub token_vault: InterfaceAccount<'info, token_interface::TokenAccount>,
```

`user` hesabı, değişken olarak işaretlenmiştir ve işlemi imzalaması gerekmektedir. Token aktarımını başlatan kullanıcıdır ve aktarılacak tokenlerin sahibidir, bu nedenle transferin gerçekleşmesi için imzası gereklidir.

```rust
#[account(
    mut,
    constraint = user.key() == user_stake_entry.user
    @ StakeError::InvalidUser
)]
pub user: Signer<'info>,
```

Verilen kullanıcının, belirtilen `user_stake_entry` hesabında saklanan aynı pubkey olduğunu doğruluyoruz. Eğer değilse, programımız `InvalidUser` özel hatasını fırlatacaktır.

`user_token_account`, stake edilmesi için aktarılacak tokenlerin mevcut tutulması gereken token hesabıdır. Bu token hesabının mint'i, staking havuzunun mint'i ile eşleşmelidir. Eğer eşleşmezse, özel bir `InvalidMint` hatası fırlatılacaktır. Verilen token hesabının belirtilen `token_program` ile eşleştiğini de doğruluyoruz.

```rust
#[account(
    mut,
    constraint = user_token_account.mint == pool_state.token_mint
    @ StakeError::InvalidMint,
    token::token_program = token_program
)]
pub user_token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
```

Son üç hesap, artık tanıdığımız hesaplar.

```rust
#[account(
    mut,
    seeds = [user.key().as_ref(), pool_state.token_mint.key().as_ref(), STAKE_ENTRY_SEED.as_bytes()],
    bump = user_stake_entry.bump,
)]
pub user_stake_entry: Account<'info, StakeEntry>,
pub token_program: Interface<'info, token_interface::TokenInterface>,
pub system_program: Program<'info, System>
}
```

Tam `Stake` hesap yapısı şu şekilde görünmelidir:

```rust
#[derive(Accounts)]
pub struct Stake<'info> {
    // pool state account
    #[account(
        mut,
        seeds = [token_mint.key().as_ref(), STAKE_POOL_STATE_SEED.as_bytes()],
        bump = pool_state.bump,
    )]
    pub pool_state: Account<'info, PoolState>,
    // Mint of token to stake
    #[account(
        mut,
        mint::token_program = token_program
    )]
    pub token_mint: InterfaceAccount<'info, token_interface::Mint>,
    /// CHECK: PDA, auth over all token vaults
    #[account(
        seeds = [VAULT_AUTH_SEED.as_bytes()],
        bump
    )]
    pub pool_authority: UncheckedAccount<'info>,
    // pool token account for Token Mint
    #[account(
        mut,
        // use token_mint, pool auth, and constant as seeds for token a vault
        seeds = [token_mint.key().as_ref(), pool_authority.key().as_ref(), VAULT_SEED.as_bytes()],
        bump = pool_state.vault_bump,
        token::token_program = token_program
    )]
    pub token_vault: InterfaceAccount<'info, token_interface::TokenAccount>,
    #[account(
        mut,
        constraint = user.key() == user_stake_entry.user
        @ StakeError::InvalidUser
    )]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = user_token_account.mint == pool_state.token_mint
        @ StakeError::InvalidMint,
        token::token_program = token_program
    )]
    pub user_token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
    #[account(
        mut,
        seeds = [user.key().as_ref(), pool_state.token_mint.key().as_ref(), STAKE_ENTRY_SEED.as_bytes()],
        bump = user_stake_entry.bump,
    )]
    pub user_stake_entry: Account<'info, StakeEntry>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
    pub system_program: Program<'info, System>
}
```

Hesap yapısı için bu kadar. **Çalışmanızı kaydedin ve programınızın hala derlenip derlenmediğini doğrulayın.**

```bash
anchor build
```

---

Sonraki adımda, gerçekleştirmemiz gereken transfer CPI'sine yardımcı olacak bir yardımcı fonksiyon implementasyonu yapacağız. `Stake` veri yapımızın altında `transfer_checked_ctx` metodunun iskeletini ekleyeceğiz. Aşağıdaki şeklinde ekleyin:

```rust
impl<'info> Stake<'info> {
    // transfer_checked for Token2022
    pub fn transfer_checked_ctx(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
    }
}
```

Bu yöntem, bir argüman olarak `&self` alır; bu, yöntem içerisinde `self` çağrısı yaparak `Stake` yapısının üyelerine erişim sağlar. Bu metodun bir `CpiContext` döndürmesi beklenmektedir,
[bu, bir Anchor ilkesidir](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html).

Bir `CpiContext` şu şekilde tanımlanır:

```rust
pub struct CpiContext<'a, 'b, 'c, 'info, T>
where
    T: ToAccountMetas + ToAccountInfos<'info>,
{
    pub accounts: T,
    pub remaining_accounts: Vec<AccountInfo<'info>>,
    pub program: AccountInfo<'info>,
    pub signer_seeds: &'a [&'b [&'c [u8]]],
}
```

Burada `T`, davet ettiğiniz talimatın hesap yapısını temsil eder.

Bu, geleneksel Anchor talimatlarının girdi olarak beklediği `Context` nesnesine çok benzemektedir (yani `ctx: Context`). Burada bir Cross-Program Invocation için bir tanım yapıyoruz!

Bizim durumumuzda, `transfer_checked` talimatını iki token programından birinde başlatacağız; bu nedenle `transfer_checked_ctx` metod adıdır ve döndürülen `CpiContext` içinde `TransferChecked` türü bulunmaktadır. `transfer` talimatı, `Token Extensions Program` içinde kullanılmaması önerilen bir talimattır ve bunun yerine `transfer_checked` kullanılmalıdır.

Şimdi bu metodun hedefini bildiğimize göre, bunu implement edebiliriz! Öncelikle, çağıracağımız programı tanımlamamız gerekiyor. Bu, hesap yapımızda iletilmiş olan `token_program` olmalıdır.

```rust
impl<'info> Stake<'info> {
    // transfer_checked for spl-token or Token2022
    pub fn transfer_checked_ctx(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_program = self.token_program.to_account_info();
    }
}
```

Görüyorsunuz ki, `Stake` veri yapısının hesaplarına `self` ile kolayca başvurabiliyoruz.

Sonrasında CPI ile geçireceğimiz hesapları tanımlamamız gerekiyor. Bunu, [`anchor_spl::token_2022` kütüphanesinden](https://docs.rs/anchor-spl/latest/anchor_spl/token_2022/struct.TransferChecked.html) içe aktardığımız `TransferChecked` veri tipi aracılığıyla yapabiliriz. Bu veri tipi şu şekilde tanımlıdır:

```rust
pub struct TransferChecked<'info> {
    pub from: AccountInfo<'info>,
    pub mint: AccountInfo<'info>,
    pub to: AccountInfo<'info>,
    pub authority: AccountInfo<'info>,
}
```

Bu veri tipi, hepsi programımıza gönderilmesi gereken dört farklı `AccountInfo` nesnesini beklemektedir. `cpi_program` gibi, bu `TransferChecked` veri yapısını da `self`'i referans alarak oluşturabiliriz ki, bu yalnızca `transfer_checked_ctx` bu satırla `impl Stake` sisteminde implement edildiği için mümkündür. Bunun dışında referans alacak `self` yoktur.

```rust
impl<'info> Stake<'info> {
    // transfer_checked for spl-token or Token2022
    pub fn transfer_checked_ctx(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.user_token_account.to_account_info(),
            to: self.token_vault.to_account_info(),
            authority: self.user.to_account_info(),
            mint: self.token_mint.to_account_info()
        };
    }
}
```

Yani, `cpi_program` ve `cpi_accounts` tanımladık ama bu yöntem bir `CpiContext` nesnesi döndürmelidir. Bunu yapmak için, ikisini `CpiContext` yapıcı fonksiyonu `CpiContext::new`'e geçmeliyiz.

```rust
impl<'info> Stake<'info> {
    // transfer_checked for Token2022
    pub fn transfer_checked_ctx(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.user_token_account.to_account_info(),
            to: self.token_vault.to_account_info(),
            authority: self.user.to_account_info(),
            mint: self.token_mint.to_account_info()
        };

        CpiContext::new(cpi_program, cpi_accounts)
    }
}
```

Bunu tanımladıktan sonra, `handler` metodumuzda herhangi bir noktada `transfer_checked_ctx` çağrısı yapabiliriz ve bu `CpiContext` nesnesini kullanabileceğimiz bir nesne döndürecektir.

**`handler` fonksiyonuna geçtiğimizde, burada birkaç şey yapmamız gerekiyor. Öncelikle, `transfer_checked_ctx` metodumuzu kullanarak doğru `CpiContext`'i oluşturmalı ve CPI'yi gerçekleştirmeliyiz. Sonrasında iki durum hesabımızda bazı kritik güncellemeler yapmamız gerekiyor. Hatırlatma olarak, iki durum hesabımız var: `PoolState` ve `StakeEntry`. İlki, genel staking havuzunun mevcut durumu ile ilgili bilgileri tutarken, ikincisi bu havuzdaki belirli bir kullanıcının stake'ine ilişkin doğru bir kayıt tutmaktadır. Bu bağlamda, staking havuzundaki herhangi bir güncelleme olduğunda her iki durumu da bir şekilde güncelliyor olmalıyız.**

Öncelikle gerçek CPI'yi implement edelim. `transfer_checked_ctx()` metodumuzda cevapsız bıraktığımız program ve hesaplar ile birlikte, CPI'ye gerekli olanları önceden tanımlamış olduğumuzdan, gerçek CPI oldukça basit olacaktır. `anchor_spl::token_2022` kütüphanesinden, özellikle de `transfer_checked` fonksiyonunu kullanacağız. Bu, 
[aşağıdaki gibi tanımlanmaktadır](https://docs.rs/anchor-spl/latest/anchor_spl/token_2022/fn.transfer_checked.html):

```rust
pub fn transfer_checked<'info>(
    ctx: CpiContext<'_, '_, '_, 'info, TransferChecked<'info>>,
    amount: u64,
    decimals: u8
) -> Result<()>
```

Üç girdi parametresini alır:

- `CpiContext`
- miktar
- ondalık sayılar

`CpiContext`, transferimizi `transfer_checked_ctx()` metodunda döndürdüğümüz ile aynıdır, bu yüzden ilk argüman için metodu `ctx.accounts.transfer_checked_ctx()` ile çağırabiliriz.

Miktar, transfer edilmesi gereken token miktarıdır; bu, `handler` metodumuzun bir girdi parametresi olarak beklediğidir.

Son olarak, `decimals` argümanı, aktarımın yapıldığı token mint'inin ondalık sayısıdır. Bu, transfer edilen kontrol talimatının bir gerekliliğidir. `token_mint` hesabı ile aktarılan mint'teki ondalık sayı aslında bu talimatta alınabilir. Ardından, sadece onu üçüncü argüman olarak iletebiliriz.

Genel olarak şöyle görünmelidir:

```rust
pub fn handler(ctx: Context<Stake>, stake_amount: u64) -> Result<()> {
    check_token_program(ctx.accounts.token_program.key());

    msg!("Havuz başlangıç toplamı: {}", ctx.accounts.pool_state.amount);
    msg!("Kullanıcı girişi başlangıç bakiyesi: {}", ctx.accounts.user_stake_entry.balance);

    let decimals = ctx.accounts.token_mint.decimals;
    // transfer_checked for either spl-token or the Token Extension program
    transfer_checked(ctx.accounts.transfer_checked_ctx(), stake_amount, decimals)?;

    Ok(())
}
```

`transfer_checked` metodu, `transfer_checked` talimat nesnesini oluşturur ve aslında `CpiContext` içindeki programı çağırır. Biz sadece bu işlemin üstünde Anchor'un sarmalayıcısını kullanıyoruz. Merak ediyorsanız, [işte kaynak kodu](https://docs.rs/anchor-spl/latest/src/anchor_spl/token_2022.rs.html#35-61).

```rust
pub fn transfer_checked<'info>(
    ctx: CpiContext<'_, '_, '_, 'info, TransferChecked<'info>>,
    amount: u64,
    decimals: u8,
) -> Result<()> {
    let ix = spl_token_2022::instruction::transfer_checked(
        ctx.program.key,
        ctx.accounts.from.key,
        ctx.accounts.mint.key,
        ctx.accounts.to.key,
        ctx.accounts.authority.key,
        &[],
        amount,
        decimals,
    )?;
    solana_program::program::invoke_signed(
        &ix,
        &[
            ctx.accounts.from,
            ctx.accounts.mint,
            ctx.accounts.to,
            ctx.accounts.authority,
        ],
        ctx.signer_seeds,
    )
    .map_err(Into::into)
}
```

**Anchor'un `CpiContext` sarmalayıcısını kullanmak çok daha temizdir ve birçok şeyi gizler, ancak altında neler olduğunu anlamak önemlidir.**

`transfer_checked` fonksiyonu tamamlandıktan sonra, durumsal hesaplarımızı güncellemeye başlayabiliriz; çünkü bu, transferin gerçekleştiği anlamına gelir. Güncellenmesi gereken iki hesap, `pool_state` ve `user_entry` hesaplarıdır; bu, genel staking havuzu verilerini ve belirli bir kullanıcı ile ilgili stake bilgileri temsil eder.

> Bu, `stake` talimatı olduğu için ve kullanıcı tokenleri havuza aktarırken, hem kullanıcının stake ettiği miktarı temsil eden hem de havuzda toplam stake edilen miktarı artırmak gerekir.

Bunu yapmak için, `pool_state` ve `user_entry` hesaplarını değişken olarak deserialize edeceğiz ve `pool_state.amount` ve `user_enry.balance` alanlarını `stake_amount` ile artıracağız. `CheckedAdd`, tampon taşmasını düşünmeden matematiksel işlemleri güvenli bir şekilde gerçekleştirmenize olanak tanır. `checked_add()`, iki sayıyı toplar ve taşmayı kontrol eder. Eğer taşma olursa, `None` döner.

Son olarak, `user_entry.last_staked` alanını, `Clock`'tan elde edilen mevcut unix zaman damgası ile güncelleyelim. Bu, belirli bir kullanıcının en son ne zaman token stake ettiğini takip etmek içindir.

Bunu `transfer_checked` işleminden sonra `Ok(())` öncesinde `handler` fonksiyonuna ekleyin.

```rust
let pool_state = &mut ctx.accounts.pool_state;
let user_entry = &mut ctx.accounts.user_stake_entry;

// havuz durumu miktarını güncelle
pool_state.amount = pool_state.amount.checked_add(stake_amount).unwrap();
msg!("Mevcut havuz stake toplamı: {}", pool_state.amount);

// kullanıcı stake girdisini güncelle
user_entry.balance = user_entry.balance.checked_add(stake_amount).unwrap();
msg!("Kullanıcı stake bakiyesi: {}", user_entry.balance);
user_entry.last_staked = Clock::get().unwrap().unix_timestamp;
```

---

Bu, biraz fazla bilgi içeren bir dizi adım oldu; bu yüzden geriye dönüp her şeyin mantıklı olduğundan emin olun. Yeni konular için bağlantılı tüm dış kaynakları kontrol edin. Hazır olduğunuzda, **çalışmanızı kaydedin ve programınızın hala derlenip derlenmediğini doğrulayın!**

```bash
anchor build

#### 10. `unstake` Talimatı

Son olarak, `unstake` işlemi, `stake` işlemiyle oldukça benzer olacaktır. Kullanıcının stake havuzundan **token'ları** transfer etmemiz gerekecek, bu zamanda kullanıcı stake ödüllerini alacak. Bu stake ödülleri, kullanıcının isteği üzerine aynı işlemde oluşturulacaktır.

:::note
Burada önemli bir nokta, kullanıcının ne kadar token'un unstaked edileceğini belirlemesine izin vermeyeceğiz; sadece şu anda stake ettikleri tüm token'ları unstake edeceğiz.
:::

Ayrıca, ne kadar ödül token'ı kazandıklarını belirlemek için çok gerçekçi bir algoritma uygulamayacağız. Basitçe, stake bakiyelerini alıp bunu **10** ile çarparak kazandıkları ödül token'larının miktarını belirleyeceğiz. Bunu programı basit tutmak ve dersin amacına odaklanmak için tekrar yapıyoruz, bu da `Token Extensions Program`.

Hesap yapısı `stake` talimatıyla çok benzer olacak, ancak birkaç fark var. Bizim ihtiyaç duyduğumuz:

- `pool_state`
- `token_mint`
- `pool_authority`
- `token_vault`
- `user`
- `user_token_account`
- `user_stake_entry`
- `staking_token_mint`
- `user_stake_token_account`
- `token_program`
- `system_program`

:::info
`stake` ve `unstake` için gereken hesaplar arasındaki temel fark, kullanıcıya staking ödüllerini mintlemek için bu talimat için `staking_token_mint` ve `user_stake_token_account`'a ihtiyaç duymamızdır.
:::

Her bir hesabı ayrı ayrı incelemeyeceğiz çünkü yapı, önceki talimatla aynı; sadece bu iki yeni hesabın eklenmesiyle ilgili.

Öncelikle, `staking_token_mint` hesabı stake ödül token'ının mint'idir. Mint otoritesi, programın kullanıcılara token mintleme yeteneğine sahip olması için `pool_authority` PDA olmalıdır. Verilen `staking_token_mint` hesabı aynı zamanda verilen `token_program` ile eşleşmelidir. Bu hesabın `pool_state` hesap alanındaki `staking_token_mint` alanında saklanan pubkey ile örtüşüp örtüşmediğini kontrol edecek özel bir kısıtlama ekleyeceğiz, eğer değilse özel `InvalidStakingTokenMint` hatasını döndüreceğiz.

```rust
// Staking token mint
    #[account(
        mut,
        mint::authority = pool_authority,
        mint::token_program = token_program,
        constraint = staking_token_mint.key() == pool_state.staking_token_mint
        @ StakeError::InvalidStakingTokenMint
    )]
    pub staking_token_mint: InterfaceAccount,
```

`user_stake_token_account` da benzer bir yapıya sahiptir. Bu, mint `staking_token_mint` ile eşleşmeli, `user` otorite olmalıdır çünkü bunlar onların stake ödülleridir ve bu hesap, `user_stake_entry` hesabında saklanan stake token hesabıyla örtüşmelidir.

```rust
#[account(
        mut,
        token::mint = staking_token_mint,
        token::authority = user,
        token::token_program = token_program,
        constraint = user_stake_token_account.key() == user_stake_entry.user_stake_token_account
        @ StakeError::InvalidUserStakeTokenAccount
    )]
    pub user_stake_token_account: InterfaceAccount,
```

Son haliyle `Unstake` yapısı şöyle olmalıdır:

```rust
#[derive(Accounts)]
pub struct Unstake {
    // havuz durumu hesabı
    #[account(
        mut,
        seeds = [token_mint.key().as_ref(), STAKE_POOL_STATE_SEED.as_bytes()],
        bump = pool_state.bump,
    )]
    pub pool_state: Account,
    // token mint'i
    #[account(
        mut,
        mint::token_program = token_program
    )]
    pub token_mint: InterfaceAccount,
    /// CHECK: PDA, tüm token vault'lara yetki
    #[account(
        seeds = [VAULT_AUTH_SEED.as_bytes()],
        bump
    )]
    pub pool_authority: UncheckedAccount,
    // Token Mint için havuz token hesabı
    #[account(
        mut,
        // token_mint, havuz otoritesi ve sabit olarak kullanılarak token vault belirtiliyor
        seeds = [token_mint.key().as_ref(), pool_authority.key().as_ref(), VAULT_SEED.as_bytes()],
        bump = pool_state.vault_bump,
        token::token_program = token_program
    )]
    pub token_vault: InterfaceAccount,
    // sadece kullanıcı token'larını unstake edebilmelidir
    #[account(
        mut,
        constraint = user.key() == user_stake_entry.user
        @ StakeError::InvalidUser
    )]
    pub user: Signer,
    #[account(
        mut,
        constraint = user_token_account.mint == pool_state.token_mint
        @ StakeError::InvalidMint,
        token::token_program = token_program
    )]
    pub user_token_account: InterfaceAccount,
    #[account(
        mut,
        seeds = [user.key().as_ref(), pool_state.token_mint.key().as_ref(), STAKE_ENTRY_SEED.as_bytes()],
        bump = user_stake_entry.bump,

    )]
    pub user_stake_entry: Account,
    // staking token mint'i
    #[account(
        mut,
        mint::authority = pool_authority,
        mint::token_program = token_program,
        constraint = staking_token_mint.key() == pool_state.staking_token_mint
        @ StakeError::InvalidStakingTokenMint
    )]
    pub staking_token_mint: InterfaceAccount,
    #[account(
        mut,
        token::mint = staking_token_mint,
        token::authority = user,
        token::token_program = token_program,
        constraint = user_stake_token_account.key() == user_stake_entry.user_stake_token_account
        @ StakeError::InvalidUserStakeTokenAccount
    )]
    pub user_stake_token_account: InterfaceAccount,
    pub token_program: Interface,
    pub system_program: Program
}
```

Artık bu talimatta gerçekleştirmemiz gereken iki farklı CPI var - bir transfer ve bir mint. Bu talimatta her ikisi için de bir `CpiContext` kullanacağız. Ancak dikkat edilmesi gereken bir nokta var, `stake` talimatında bir PDA'dan **"imza"** gerektirmedik fakat bu talimat için gerekmektedir. Bu yüzden, daha önceki gibi tam aynı modeli takip edemeyeceğiz ama benzer bir şey yapabiliriz.

Tekrar, `Unstake` veri yapısında iki yardımcı işlev oluşturalım: `transfer_checked_ctx` ve `mint_to_ctx`.

```rust
impl Unstake  {
    // Token2022 için transfer_checked
    pub fn transfer_checked_ctx(&'a self, seeds: &'a [&[&[u8]]]) -> CpiContext> {

    }

    // mint_to
    pub fn mint_to_ctx(&'a self, seeds: &'a [&[&[u8]]]) -> CpiContext> {

    }
}
```

Öncelikle `transfer_checked_ctx` üzerinde çalışalım, bu metodun implementasyonu neredeyse daha önceki `stake` talimatındaki ile aynı. Ana fark burada iki argümanımız var: `self` ve `seeds`. İkinci argüman, normalde `invoke_signed` metoduna geçeceğimiz PDA imza tohumlarının vektörüdür. PDA ile imza atmamız gerektiğinden, `CpiContext::new` yapıcısını çağırmak yerine `CpiContext::new_with_signer` kullanacağız.

:::tip
`new_with_signer` şu şekilde tanımlanmıştır:

```rust
pub fn new_with_signer(
    program: AccountInfo,
    accounts: T,
    signer_seeds: &'a [&'b [&'c [u8]]]
) -> Self
```
:::

Ayrıca, `TransferChecked` yapısındaki `from` ve `to` hesapları öncekilerden tersine çevrilecektir.

```rust
// spl-token veya Token2022 için transfer_checked
pub fn transfer_checked_ctx(&'a self, seeds: &'a [&[&[u8]]]) -> CpiContext> {

    let cpi_program = self.token_program.to_account_info();
    let cpi_accounts = TransferChecked {
        from: self.token_vault.to_account_info(),
        to: self.user_token_account.to_account_info(),
        authority: self.pool_authority.to_account_info(),
        mint: self.token_mint.to_account_info()
    };

    CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds)
}
```

[`anchor_lang` crate dökümantasyonuna göz atın](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html#method.new_with_signer) `CpiContext` hakkında daha fazla bilgi edinmek için.

Şimdi `mint_to_ctx` fonksiyonuna geçelim, tam olarak yaptığımız gibi `transfer_checked_ctx` ama `mint_to` talimatına hedef alacağız! Bunu yapmak için, `TransferChecked` yerine `MintTo` yapısını kullanmamız gerekecek. `MintTo` şu şekilde tanımlanmıştır:

```rust
pub struct MintTo {
    pub mint: AccountInfo,
    pub to: AccountInfo,
    pub authority: AccountInfo,
}
```

[`anchor_spl::token_2022::MintTo` rust crate dokümantasyonu](https://docs.rs/anchor-spl/latest/anchor_spl/token_2022/struct.MintTo.html).

Bunu göz önünde bulundurarak, `mint_to_ctx` yöntemini `transfer_checked_ctx` ile aynı şekilde uygulayabiliriz. Bu CPI ile tam aynı `token_program`'ı hedef alacağız, bu yüzden `cpi_program` daha önceki gibi olmalıdır. `MintTo` yapısını, doğru hesapları geçirerek `TransferChecked` yapısı gibi inşa ediyoruz. `mint`, kullanıcının mint edileceği `staking_token_mint`, `to` kullanıcının `user_stake_token_account`, ve `authority` ise bu mint üzerinde tam otoriteye sahip olması gereken `pool_authority` olmalıdır.

Son olarak, fonksiyon bir imzacı tohumuyla oluşturulmuş bir `CpiContext` nesnesi döndürür.

```rust
// mint_to
pub fn mint_to_ctx(&'a self, seeds: &'a [&[&[u8]]]) -> CpiContext> {
    let cpi_program = self.token_program.to_account_info();
    let cpi_accounts = MintTo {
        mint: self.staking_token_mint.to_account_info(),
        to: self.user_stake_token_account.to_account_info(),
        authority: self.pool_authority.to_account_info()
    };

    CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds)
}
```

Artık `handler` fonksiyonumuzun mantığına geçebiliriz. Bu talimat, hem havuz hem de kullanıcı durumu hesaplarını güncellemeli, kullanıcının stake edilmiş tüm token'larını transfer etmeli ve kullanıcının ödül token'larını mint etmelidir. Başlamak için bazı bilgileri günlüğe kaydedip kullanıcının transfer etmesi gereken token miktarını belirleyeceğiz.

Kullanıcının stake miktarını `user_stake_entry` hesabında takip ettik, bu nedenle bu noktada kullanıcının ne kadar token'ı stake ettiğini tam olarak biliyoruz. Bu miktarı `user_entry.balance` alanından alabiliriz. Ardından, bazı bilgileri günlüğe kaydetmek için bunu yazdıralım. Transfer edilecek miktarın, havuzda saklanan miktardan daha fazla olmadığını doğrulayacağız. Eğer böyle bir durum varsa, özel `OverdrawError` döneriz ve kullanıcının havuzu boşaltmasını engelleriz.

```rust
pub fn handler(ctx: Context) -> Result  {
    check_token_program(ctx.accounts.token_program.key());

    let user_entry = &ctx.accounts.user_stake_entry;
    let amount = user_entry.balance;
    let decimals = ctx.accounts.token_mint.decimals;

    msg!("Kullanıcı stake bakiyesi: {}", user_entry.balance);
    msg!("Kullanıcının tüm stake bakiyesini geri çekiyoruz. Geri çekilecek token miktarı: {}", amount);
    msg!("Geri çekmeden önce toplam stake: {}", ctx.accounts.pool_state.amount);

    // kullanıcı ve havuzun >= istenen miktarda token'a sahip olduğunu doğrula
    if amount > ctx.accounts.pool_state.amount {
        return Err(StakeError::OverdrawError.into())
    }

    // Daha fazla kod gelecek

    Ok(())
}
```

Sonraki adım, PDA imza tohumları için ihtiyaç duyulacak tohumları almak. `pool_authority`, bu CPIs'de imza atmak için gereken şey olduğu için o hesabın tohumlarını kullanıyoruz.

```rust
// program imzacı tohumları
let auth_bump = ctx.accounts.pool_state.vault_auth_bump;
let auth_seeds = &[VAULT_AUTH_SEED.as_bytes(), &[auth_bump]];
let signer = &[&auth_seeds[..]];
```

Bu tohumları `signer` değişkeninde sakladıktan sonra, bunu `transfer_checked_ctx()` metoduna kolayca geçirebiliriz. Aynı zamanda, sahne arkasında CPI'yi gerçekten tetiklemek için Anchor crate'indeki `transfer_checked` yardımcı fonksiyonunu çağıracağız.

```rust
// stake edilmiş token'ları transfer et
transfer_checked(ctx.accounts.transfer_checked_ctx(signer), amount, decimals)?;
```

Sonrasında, kullanıcıya mint edilecek ödül token sayısını hesaplayacak ve `mint_to` talimatını `mint_to_ctx` fonksiyonumuzu kullanarak çağıracağız. Unutmayın, biz sadece kullanıcının stake ettiği token sayısını alıp bunun 10 ile çarparak ödül miktarını alıyoruz. Bu, üretimde kullanmak için mantıklı olmayacak çok basit bir algoritmadır ama burada bir örnek olarak çalışıyor.

:::warning
`checked_mul()`'ı burada kullanıyoruz, `stake` talimatındaki `checked_add` ile aynı mantıkla. Yine, bu bir buffer overflow'u önlemek içindir.
:::

```rust
// kullanıcıların stake ödüllerini mint etmek, stake edilen token miktarının 10 katı
let stake_rewards = amount.checked_mul(10).unwrap();

// kullanıcıya ödülleri mint et
mint_to(ctx.accounts.mint_to_ctx(signer), stake_rewards)?;
```

Son olarak, havuz ve kullanıcının bakiyelerinden unstaked olan miktarı çıkarmak için durum hesaplarımızı güncellememiz gerekecek. Bunun için `checked_sub()` kullanacağız.

```rust
// değiştirilebilir referansları al
let pool_state = &mut ctx.accounts.pool_state;
let user_entry = &mut ctx.accounts.user_stake_entry;

// transfer edilen miktarı havuz toplamından çıkar
pool_state.amount = pool_state.amount.checked_sub(amount).unwrap();
msg!("Geri çekimden sonra toplam stake: {}", pool_state.amount);

// kullanıcı stake kaydını güncelle
user_entry.balance = user_entry.balance.checked_sub(amount).unwrap();
user_entry.last_staked = Clock::get().unwrap().unix_timestamp;
```

Tüm bunları bir araya getirdiğimizde nihai `handler` fonksiyonumuz şöyle olur:

```rust
pub fn handler(ctx: Context) -> Result  {
    check_token_program(ctx.accounts.token_program.key());

    let user_entry = &ctx.accounts.user_stake_entry;
    let amount = user_entry.balance;
    let decimals = ctx.accounts.token_mint.decimals;

    msg!("Kullanıcı stake bakiyesi: {}", user_entry.balance);
    msg!("Kullanıcının tüm stake bakiyesini geri çekiyoruz. Geri çekilecek token miktarı: {}", amount);
    msg!("Geri çekmeden önce toplam stake: {}", ctx.accounts.pool_state.amount);

    // kullanıcı ve havuzun >= istenen miktarda token'a sahip olduğunu doğrula
    if amount > ctx.accounts.pool_state.amount {
        return Err(StakeError::OverdrawError.into())
    }

    // program imzacı tohumları
    let auth_bump = ctx.accounts.pool_state.vault_auth_bump;
    let auth_seeds = &[VAULT_AUTH_SEED.as_bytes(), &[auth_bump]];
    let signer = &[&auth_seeds[..]];

    // stake edilmiş token'ları transfer et
    transfer_checked(ctx.accounts.transfer_checked_ctx(signer), amount, decimals)?;

    // kullanıcıların stake ödüllerini mint etmek, stake edilen token miktarının 10 katı
    let stake_rewards = amount.checked_mul(10).unwrap();

    // kullanıcıya ödülleri mint et
    mint_to(ctx.accounts.mint_to_ctx(signer), stake_rewards)?;

    // değiştirilebilir referansları al
    let pool_state = &mut ctx.accounts.pool_state;
    let user_entry = &mut ctx.accounts.user_stake_entry;

    // transfer edilen miktarı havuz toplamından çıkar
    pool_state.amount = pool_state.amount.checked_sub(amount).unwrap();
    msg!("Geri çekimden sonra toplam stake: {}", pool_state.amount);

    // kullanıcı stake kaydını güncelle
    user_entry.balance = user_entry.balance.checked_sub(amount).unwrap();
    user_entry.last_staked = Clock::get().unwrap().unix_timestamp;

    Ok(())
}
```

İşte staking programımızın son hali! Bu program için önceden yazılmış bir test seti bulunmaktadır. Gerekli test paketlerini yükleyip testleri çalıştırabilirsiniz:

```bash
npm install
anchor test
```

Eğer sorunla karşılaşırsanız, [çözüm dalını kontrol etmeyi](https://github.com/Unboxed-Software/token22-staking/tree/solution) unutmayın.

## Görev

Token Program ve Token Extensions Program bağımsız olan kendi programınızı oluşturun.