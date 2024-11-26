---
date: 2023-02-01T00:00:00Z
seoTitle: "Token Extensions: Transfer Hook"
title: Transfer Hook uzantısını nasıl kullanabilirsiniz
description:
  "Transfer Hook uzantısı ve Transfer Hook Arayüzü, her token transferinde
  özel talimat mantığını yürütmek için Mint Hesapları oluşturma yeteneğini
  sunar."
keywords:
  - token 2022
  - token uzantıları
  - token programı
difficulty: orta
tags:
  - token 2022
  - token uzantıları
---

Transfer Hook uzantısı ve Transfer Hook Arayüzü, her token transferinde
özel talimat mantığını yürütmek için Mint Hesapları oluşturma yeteneğini
sunar.

Bu, token transferleri için birçok yeni kullanım durumunu açar, örneğin:

- NFT telif haklarını uygulamak
- Token alabilen cüzdanları siyah veya beyaz listeye almak
- Token transferlerinde özel ücretler uygulamak
- Özel token transfer olayları oluşturmak
- Token transferleriniz üzerindeki istatistikleri takip etmek
- Ve daha fazlası

Bunu başarmak için geliştiricilerin, 
[Transfer Hook Arayüzünü](https://github.com/solana-labs/solana-program-library/tree/master/token/transfer-hook/interface) 
uygulayan bir program üstünde çalışması ve Transfer Hook uzantısı etkin bir Mint Hesabı başlatması gerekir.

Mint Hesabından yapılan her token transferi için, Token Uzantıları programı, Transfer Hook programında bir talimat yürütmek üzere bir Cross Program Invocation (CPI) gerçekleştirir.

:::info
Token Uzantıları programı bir Transfer Hook programına CPI yaptığında, orijinal transferin tüm hesapları sadece okunabilir hesaplara dönüştürülür. Bu, göndericinin imza ayrıcalıklarının Transfer Hook programına uzanmadığı anlamına gelir.

Bu tasarım kararı, Transfer Hook programlarının kötüye kullanımını önlemek için alınmıştır.
:::

---

Bu kılavuzda, Anchor çerçevesini kullanarak bir Transfer Hook programı oluşturacağız; ancak Transfer Hook Arayüzünü yerel bir programla da uygulamak mümkündür. Anchor çerçevesi hakkında daha fazla bilgi için buraya bakın: 
[Anchor Framework](https://www.anchor-lang.com/)

## Transfer Hook Arayüzü Genel Görünümü

Transfer Hook Arayüzü, geliştiricilere belirli bir Mint Hesabı için her token transferinde yürütülen özel talimat mantığını uygulama yolu sağlar.

Transfer Hook Arayüzü aşağıdaki [talimatları](https://github.com/solana-labs/solana-program-library/blob/master/token/transfer-hook/interface/src/instruction.rs) belirtir:

- `Execute`: Token Uzantıları programının her token transferinde çağırdığı bir talimat.
- `InitializeExtraAccountMetaList` (isteğe bağlı): Özel `Execute` talimatı için gereken ek hesapların listesini depolayan bir hesap oluşturur.
- `UpdateExtraAccountMetaList` (isteğe bağlı): Mevcut listeyi geçersiz kılarak ek hesaplar listesini günceller.

Arayüzü kullanarak `InitializeExtraAccountMetaList` talimatını uygulamak teknik olarak gereklidir. Hesap, herhangi bir Transfer Hook programında herhangi bir talimatla oluşturulabilir.

Ancak, bu hesap için Program Türetilmiş Adres (PDA) aşağıdaki tohumlar kullanılarak türetilmelidir:

- Sabit kodlanmış dize "extra-account-metas"
- Mint Hesabı adresi
- Transfer Hook program ID'si

```js
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from("extra-account-metas"), mint.publicKey.toBuffer()],
  program.programId, // transfer hook program ID
);
```

`Execute` talimatı için gereken ek hesapları önceden tanımlanmış PDA'da depolayarak, bu hesaplar istemciden bir token transfer talimatına otomatik olarak eklenebilir.

## Merhaba dünya Transfer Hook

Bu örnek, transfer hook'larının merhaba dünya versiyonudur. Her token transferinde sadece bir mesaj yazdıracak basit bir transfer hook'tur. Örneğe Solana Playground'da açarak başlayalım, token programlarını oluşturmak ve dağıtmak için çevrimiçi bir araç:
[link](https://beta.solpg.io/github.com/solana-developers/anchor-transfer-hook/tree/hello_world)

Örnek, transfer hook arayüzünü uygulayan bir anchor programı ve programı test etmek için bir test dosyasından oluşmaktadır.

Bu program yalnızca 3 talimat içerecektir:

1. `initialize_extra_account_meta_list`: `transfer_hook` talimatı için gereken ek hesapların listesini depolayan bir hesap oluşturur. Merhaba dünya örneğinde bunu boş bırakıyoruz.
2. `transfer_hook`: Bu talimat, her token transferinde CPI yoluyla bir sarılmış SOL token transferini gerçekleştirmek için çağrılır.
3. `fallback`: Anchor'ı kullandığımız ve token programının yerel bir program olduğu için, talimat ayırt edici işaretiyle eşleşmek ve bizim özel `transfer_hook` talimatımızı çağırmak için manuel olarak bir fallback talimatı eklememiz gerekiyor. Bu işlevi değiştirmeniz gerekmiyor.

Token her transfer edildiğinde, bu `transfer_hook` fonksiyonu token programı tarafından çağrılacaktır.

```rust
pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {

    msg!("Merhaba Transfer Hook!");

    Ok(())
}
```

Bu fonksiyonda artık ek mantığınızı ekleyebilirsiniz. Örneğin, 50'den büyük bir tutar transfer edildiğinde transferin başarısız olmasına izin verebilirsiniz:

```rust
#[error_code]
pub enum MyError {
    #[msg("Tutar çok büyük")]
    AmountTooBig,
}

pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {

    msg!("Merhaba Transfer Hook!");

    if amount > 50 {
        return err!(MyError::AmountTooBig);
    }

    Ok(())
}
```

Bu örneği Solana Playground'da çalıştırmak için şu bağlantıyı takip edin: 
[link](https://beta.solpg.io/github.com/solana-developers/anchor-transfer-hook/tree/hello_world)

Playground terminalinde `build` komutunu çalıştırın, bu `lib.rs` dosyasındaki `declare_id` değerini yeni oluşturulan program ID'si ile güncelleyecektir. Ardından programınızı devnet'e dağıtmak için `deploy` komutunu çalıştırın. Program dağıtıldığında test dosyasını terminalde `test` komutunu kullanarak çalıştırabilirsiniz.

Bu daha sonra benzer bir çıkış elde etmenizi sağlayacaktır:

```shell
  transfer-hook.test.ts:
  transfer-hook
    İşlem İmzası: kB8Hkn8NEavK7xztEhQZXKSeidgEK81PZNmgSSodZFVyzM9o18GwNi4bDWD9Q3cbmh75Vn1jqyinYH3YdgJfnuJ
    ✔ Transfer Hook Uzantısıyla Mint Hesabı Oluşturma (539ms)
    İşlem İmzası: Bf9eYieas6jpV8UxS5upuRv2oMebDdHgDstLMw86ptM7cd4qRpaxRyFYmNZC1WZMcDXP68PoGoApUrrrQKeBbJA
    ✔ Token Hesaplarını ve Mint Tokenlerini Oluşturma (744ms)
    İşlem İmzası: 3oRtCjM6oSdkxQKUyGF3r6hmZGLUpNefihHoGQT5cftRPeQtimvVukLPvb3PSpvLrUsoCWBnz6nSm6ZbPRUhx7UP
    ✔ ExtraAccountMetaList Hesabını Oluşturma (728ms)
    Transfer İmzası: WNAWK2o7wWpVCqPz2uoMtHRe1F5B1jfW8v4kezdQYqaXE3nRAPfqUFkFHg31uYmpZCjncZUwo4g9ZuhgMC9cS1i
    ✔ Ek Hesap Meta ile Transfer Hook (1327ms)
  4 geçerli (3s)
```

Tokeninizi oluşturmak için JavaScript kullanmak istemiyorsanız, programınızı dağıttıktan sonra Solana CLI'dan `spl-token` komutunu da kullanabilirsiniz:

```shell
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --transfer-hook yourTransferHookProgramId
```

## Sayıcı Transfer Hook

Bir sonraki örnek, tokeniniz her transfer edildiğinde nasıl bir sayacı artırabileceğinizi gösterecektir.
[link](https://beta.solpg.io/github.com/solana-developers/anchor-transfer-hook/tree/counter)

Transfer hook'ınıza ek hesaplar eklemeniz gerektiğinde, bunları Ek Hesap Meta Listesi hesabına eklemeniz gerekir. Bu durumda, tokenin kaç kez transfer edildiğini kaydeden bir PDA'ya ihtiyacımız var.

Bu, `initialize_extra_account_meta_list` talimatına aşağıdaki kodu ekleyerek yapılabilir:

```rust
let account_metas = vec![
    ExtraAccountMeta::new_with_seeds(
        &[Seed::Literal {
            bytes: "counter".as_bytes().to_vec(),
        }],
        false, // imza sahibi mi
        true,  // yazılabilir mi
    )?,
];
```

Ayrıca, bu hesabı yeni mint hesabını başlatırken oluşturmalıyız ve her token transfer ettiğimizde bunu göndermeliyiz.

```rust
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: ExtraAccountMetaList Hesabı, bu tohumları kullanmak zorunda
    #[account(
        mut,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
    pub extra_account_meta_list: AccountInfo<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init_if_needed,
        seeds = [b"counter"],
        bump,
        payer = payer,
        space = 16
    )]
    pub counter_account: Account<'info, CounterAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferHook<'info> {
    #[account(
        token::mint = mint,
        token::authority = owner,
    )]
    pub source_token: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        token::mint = mint,
    )]
    pub destination_token: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: kaynak token hesabı sahibi, SistemHesabı veya başka bir program tarafından sahip olunan PDA olabilir
    pub owner: UncheckedAccount<'info>,
    /// CHECK: ExtraAccountMetaList Hesabı,
    #[account(
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
    pub extra_account_meta_list: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"counter"],
        bump
    )]
    pub counter_account: Account<'info, CounterAccount>,
}
```

Ve bu hesap bir `u64` sayıcı değişkeni tutacak:

```rust
#[account]
pub struct CounterAccount {
    counter: u64,
}
```

Artık transfer hook fonksiyonumuzda bu sayacı her çağrıldığında bir artırabiliriz:

```rust
pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {

    ctx.accounts.counter_account.counter.checked_add(1).unwrap();
    msg!("Bu token {0} kez transfer edildi", ctx.accounts.counter_account.counter);

    Ok(())
}
```

İstemcide, bu ek hesaplar otomatik olarak `createTransferCheckedWithTransferHookInstruction` yardımcı fonksiyonu tarafından eklenir:

```js
let transferInstructionWithHelper =
  await createTransferCheckedWithTransferHookInstruction(
    connection,
    sourceTokenAccount,
    mint.publicKey,
    destinationTokenAccount,
    wallet.publicKey,
    amountBigInt,
    decimals,
    [],
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );
```

Bu örneği Solana Playground'da çalıştırmak için şu bağlantıyı takip edin: 
[link](https://beta.solpg.io/github.com/solana-developers/anchor-transfer-hook/tree/counter)

Sonrasında orada `build` yazarak, `lib.rs` dosyasındaki `declare_id` değerini yeni bir program ID'si ile güncelleyebilirsiniz. Sonra `deploy` yazarak programınızı devnet'e dağıtabilirsiniz. Program dağıtıldığında `test` yazarak terminalde test dosyasını çalıştırabilirsiniz.

Bu daha sonra aşağıdaki çıkışı verir. Son işlemde tokeninizin kaç kez transfer edildiğini görebilirsiniz:

```shell
"Bu token 1 kez transfer edildi"
```

```shell
Testler çalıştırılıyor...
  transfer-hook.test.ts:
  transfer-hook
    İşlem İmzası: 48r6effAA4B9RVh13eBXdGjmcPKcm6QwnvodX2dT5nNfJyzoS3AejqatKXyqcmpzPdcmpTjgALnd1xx7v17ggptV
    ✔ Transfer Hook Uzantısıyla Mint Hesabı Oluşturma (545ms)
    İşlem İmzası: nfkBH6cbM5c94od3VG4QmxHkXJzm6VEFxogbQKpd7gERJNgESyu1gEjLJnPiUer59sXnx787eB6hYBkhdkFnzdL
    ✔ Token Hesaplarını ve Mint Tokenlerini Oluşturma (354ms)
    Ek hesap meta: null
    İşlem İmzası: 4T6FS3Y95Kjkf9fy5jtCYWo2Wf1SSQKmo6GUK2YqXEcgR4Wrr6aLmnoEBcBNCpEv4ALbJuwu5KtVdxb1S3ynMPJY
    ✔ ExtraAccountMetaList Hesabını Oluşturma (695ms)
    Ek hesap meta: 9mifVeGPh7CHyf1NrcUWzzVKMU7g3AwQ6L3md3fMNqju
    Sayıcı PDA: 334HLdMwbhSGYf8QWHHmEkeZf6x6caXGF6oxVnCEmaQd
    Transfer İmzası: 32zoL4oTC3XPVsgeDmT3KsTS4v8U4qe3GPKMF72QX5eSHgAFagKEyvRrGuoP2UEGLpj41Ygm9dSRi5YKghxS24EN
    ✔ Ek Hesap Meta ile Transfer Hook (776ms)
  4 geçerli (2s)
```


Burada, token transfer edildiğinde bir sayacı artırıyoruz, bu nedenle transfer hook talimatının yalnızca bir transfer sırasında çağrılmasını sağlamalıyız; aksi takdirde biri transfer hook talimatını doğrudan çağırabilir ve sayacımızı karıştırabilir. Bu, transfer hook'larınıza eklemeniz gereken bir kontrol.


Bu kontrolü şu şekilde ekleyebilirsiniz:

```rust
fn assert_is_transferring(ctx: &Context<TransferHook>) -> Result<()> {
    let source_token_info = ctx.accounts.source_token.to_account_info();
    let mut account_data_ref: RefMut<&mut [u8]> = source_token_info.try_borrow_mut_data()?;
    let mut account = PodStateWithExtensionsMut::<PodAccount>::unpack(*account_data_ref)?;
    let account_extension = account.get_extension_mut::<TransferHookAccount>()?;

    if !bool::from(account_extension.transferring) {
        return err!(TransferError::IsNotCurrentlyTransferring);
    }

    Ok(())
}
```

Ve daha sonra bunu `transfer_hook` fonksiyonunuzun başında çağırın:

```rust
    #[error_code]
    pub enum TransferError {
        #[msg("Token şu anda transfer edilmiyor")]
        IsNotCurrentlyTransferring,
    }

    #[interface(spl_transfer_hook_interface::execute)]
    pub fn transfer_hook(ctx: Context<TransferHook>, _amount: u64) -> Result<()> {
        // Bu talimat, bir transfer hookundan çağrılmıyorsa başarısız olur
        assert_is_transferring(&ctx)?;

        ctx.accounts.counter_account.counter.checked_add(1).unwrap();
        msg!("Bu token {0} kez transfer edildi", ctx.accounts.counter_account.counter);

        Ok(())
    }
```

## wSOL Transfer ücreti ile Transfer Hook (ileri düzey örnek)

Bu kılavuzun bir sonraki bölümünde, Anchor çerçevesini kullanarak daha karmaşık bir Transfer Hook programı oluşturacağız. Bu program, her token transferinde gönderenin bir wSOL ücreti ödemesini gerektirecektir.

wSOL transferleri, Transfer Hook programından türetilen bir PDA aracılığıyla gerçekleştirilecektir. Bu, token transfer talimatının ilk göndericisinin imzasının Transfer Hook programında erişilebilir olmamasından dolayı gereklidir.

Bu program yalnızca 3 talimat içerecektir:

1. `initialize_extra_account_meta_list`: `transfer_hook` talimatı için gereken ek hesapları depolayan bir hesap oluşturur.
2. `transfer_hook`: Bu talimat, her token transferinde bir sarılmış SOL tokenini transfer etmek için CPI yoluyla çağrılır.
3. `fallback`: Transfer hook arayüzü talimatlarının belirli ayırt edicileri (talimat tanımlayıcıları) vardır. Bir Anchor programında, talimat ayırt edicisiyle manuel olarak eşleşmek ve özel `transfer_hook` talimatımızı çağırmak için bir fallback talimatı kullanabiliriz.

Bu program, gönderenin her token transferinde sarılmış SOL (wSOL) için bir ücret ödemesini gerektirecektir. İşte 
[final program](https://beta.solpg.io/github.com/solana-developers/anchor-transfer-hook/tree/main).

### Başlarken

Bu Solana Playground'u açarak başlayın 
[link](https://beta.solpg.io/github.com/solana-developers/anchor-transfer-hook/tree/starter) 
ve ardından projeyi kopyalamak için "İçe Aktar" butonuna tıklayın.

Başlangıç kodu, oluşturacağımız program için hazırlanmış bir `lib.rs` ve `transfer-hook.test.ts` dosyası içerir. `lib.rs` dosyasında aşağıdaki kodu görmelisiniz:

```rust
use anchor_lang::{
    prelude::*,
    system_program::{create_account, CreateAccount},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};
use spl_tlv_account_resolution::{
    account::ExtraAccountMeta, seeds::Seed, state::ExtraAccountMetaList,
};
use spl_transfer_hook_interface::instruction::{ExecuteInstruction, TransferHookInstruction};

declare_id!("E6wu6Nykdra8gXs57Zqo7hY6DLaWugTmD3uuuBmX2Vxt");

#[program]
pub mod transfer_hook {
    use super::*;

    pub fn initialize_extra_account_meta_list(
        ctx: Context<InitializeExtraAccountMetaList>,
    ) -> Result<()> {
        Ok(())
    }

    pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
        Ok(())
    }

    pub fn fallback<'info>(
        program_id: &Pubkey,
        accounts: &'info [AccountInfo<'info>],
        data: &[u8],
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList {}

#[derive(Accounts)]
pub struct TransferHook {}
``` 

Projeyi içe aktardıktan sonra, Playground terminalindeyken `build` komutunu kullanarak programı oluşturun.

```
build
```

# Frequency Guidelines

## Strategic Use of Admonitions

:::tip
For helpful suggestions and best practices, remember to comment your code to clarify complex logic.
:::

:::info
This `InitializeExtraAccountMetaList` structure is essential for managing multiple accounts needed for token transfers.
:::

```rust
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// KONTROL: ExtraAccountMetaList Hesabı, bu tohumları kullanmalısınız
    #[account(
        mut,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
    pub extra_account_meta_list: AccountInfo<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    pub wsol_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
```

## Code Update

Sonraki `initialize_extra_account_meta_list` talimatını aşağıdaki kodla güncelleyin:

```rust
pub fn initialize_extra_account_meta_list(
    ctx: Context<InitializeExtraAccountMetaList>,
) -> Result<()> {
    Ok(())
}
```

Yerine aşağıdaki kodu koyun:

```rust
pub fn initialize_extra_account_meta_list(
        ctx: Context<InitializeExtraAccountMetaList>,
    ) -> Result<()> {
        // indeks 0-3, token transferi için gereken hesaplar (kaynak, mint, varış, sahip)
        // indeks 4, ExtraAccountMetaList hesabının adresi
        // `addExtraAccountsToInstruction` JS yardımcı fonksiyonu yanlış çözümleme yapıyor
        let account_metas = vec![
            // indeks 5, sarmalanmış SOL mint
            ExtraAccountMeta::new_with_pubkey(&ctx.accounts.wsol_mint.key(), false, false)?,
            // indeks 6, token programı
            ExtraAccountMeta::new_with_pubkey(&ctx.accounts.token_program.key(), false, false)?,
            // indeks 7, ilişkili token programı
            ExtraAccountMeta::new_with_pubkey(
                &ctx.accounts.associated_token_program.key(),
                false,
                false,
            )?,
            // indeks 8, delege PDA
            ExtraAccountMeta::new_with_seeds(
                &[Seed::Literal {                    bytes: "delegate".as_bytes().to_vec(),
                }],
                false, // imzalayıcı mı
                false,  // yazılabilir mi
            )?,
            // indeks 9, delege sarmalanmış SOL token hesabı
            ExtraAccountMeta::new_external_pda_with_seeds(
                7, // ilişkili token programı indeksi
                &[
                    Seed::AccountKey { index: 8 }, // sahip indeksi (delege PDA)
                    Seed::AccountKey { index: 6 }, // token programı indeksi
                    Seed::AccountKey { index: 5 }, // wsol mint indeksi
                ],
                false, // imzalayıcı mı
                true,  // yazılabilir mi
            )?,
            // indeks 10, gönderici sarmalanmış SOL token hesabı
            ExtraAccountMeta::new_external_pda_with_seeds(
                7, // ilişkili token programı indeksi
                &[
                    Seed::AccountKey { index: 3 }, // sahip indeksi
                    Seed::AccountKey { index: 6 }, // token programı indeksi
                    Seed::AccountKey { index: 5 }, // wsol mint indeksi
                ],
                false, // imzalayıcı mı
                true,  // yazılabilir mi
            )?,
        ];

        // hesap boyutunu hesapla
        let account_size = ExtraAccountMetaList::size_of(account_metas.len())? as u64;
        // minimum gerekli lamportları hesapla
        let lamports = Rent::get()?.minimum_balance(account_size as usize);

        let mint = ctx.accounts.mint.key();
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"extra-account-metas",
            &mint.as_ref(),
            &[ctx.bumps.extra_account_meta_list],
        ]];

        // ExtraAccountMetaList hesabını oluştur
        create_account(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                CreateAccount {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.extra_account_meta_list.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
            lamports,
            account_size,
            ctx.program_id,
        )?;

        // ExtraAccountMetaList hesabını ek hesaplarla başlat
        ExtraAccountMetaList::init::<ExecuteInstruction>(
            &mut ctx.accounts.extra_account_meta_list.try_borrow_mut_data()?,
            &account_metas,
        )?;

        Ok(())
    }
```

## Key Takeaways

> Geri dönen hesap boyutunu hesaplamak için `ExtraAccountMetaList::size_of` fonksiyonunu kullanarak gerekli boyutu bulabilirsiniz.  
> — Kod Geliştirmenleri

### Account Storage Methods

Bu hesapları depolamak için üç yöntem vardır:

1. Hesap adresini doğrudan depolamak:
   - Sarmalanmış SOL mint adresi
   - Token Program ID
   - İlişkili Token Program ID

```rust
// indeks 5, sarmalanmış SOL mint
ExtraAccountMeta::new_with_pubkey(&ctx.accounts.wsol_mint.key(), false, false)?,
// indeks 6, token programı
ExtraAccountMeta::new_with_pubkey(&ctx.accounts.token_program.key(), false, false)?,
// indeks 7, ilişkili token programı
ExtraAccountMeta::new_with_pubkey(
    &ctx.accounts.associated_token_program.key(),
    false,
    false,
)?,
```

2. Transfer Hook programı için bir PDA türetmek üzere tohumları depolamak:
   - Delege PDA

```rust
// indeks 8, delege PDA
ExtraAccountMeta::new_with_seeds(
    &[Seed::Literal {
        bytes: "delegate".as_bytes().to_vec(),
    }],
    false, // imzalayıcı mı
    false,  // yazılabilir mi
)?,
```

3. Transfer Hook programı dışındaki bir program için bir PDA türetmek üzere tohumları depolamak:
   - Delege wSOL İlişkili Token Hesabı
   - Gönderici wSOL İlişkili Token Hesabı

```rust
// indeks 9, delege sarmalanmış SOL token hesabı
ExtraAccountMeta::new_external_pda_with_seeds(
    7, // ilişkili token programı indeksi
    &[
        Seed::AccountKey { index: 8 }, // sahip indeksi (delege PDA)
        Seed::AccountKey { index: 6 }, // token programı indeksi
        Seed::AccountKey { index: 5 }, // wsol mint indeksi
    ],
    false, // imzalayıcı mı
    true,  // yazılabilir mi
)?,
// indeks 10, gönderici sarmalanmış SOL token hesabı
ExtraAccountMeta::new_external_pda_with_seeds(
    7, // ilişkili token programı indeksi
    &[
        Seed::AccountKey { index: 3 }, // sahip indeksi
        Seed::AccountKey { index: 6 }, // token programı indeksi
        Seed::AccountKey { index: 5 }, // wsol mint indeksi
    ],
    false, // imzalayıcı mı
    true,  // yazılabilir mi
)?,
```

---

### Accounting Size Calculation

Sonraki adım, `ExtraAccountMetas` listesini depolamak için gerekli boyut ve kira maliyetini hesaplamaktır.

```rust
// hesap boyutunu hesapla
let account_size = ExtraAccountMetaList::size_of(account_metas.len())? as u64;
// minimum gerekli lamportları hesapla
let lamports = Rent::get()?.minimum_balance(account_size as usize);
```

## Creating an Account

Şimdi, bir hesap oluşturmak için Sistem Programına CPI (Cross-Program Invocation) yapıyoruz ve Transfer Hook Programının sahip olarak ayarlanmasını sağlıyoruz. PDA tohumları, yeni hesap adresi olarak PDA'yı kullandığımızdan, CPI üzerinde imzalayıcı tohumları olarak dahil edilmiştir.

```rust
let mint = ctx.accounts.mint.key();
let signer_seeds: &[&[&[u8]]] = &[&[
    b"extra-account-metas",
    &mint.as_ref(),
    &[ctx.bumps.extra_account_meta_list],
]];

// ExtraAccountMetaList hesabını oluştur
create_account(
    CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        CreateAccount {
            from: ctx.accounts.payer.to_account_info(),
            to: ctx.accounts.extra_account_meta_list.to_account_info(),
        },
    )
    .with_signer(signer_seeds),
    lamports,
    account_size,
    ctx.program_id,
)?;
```

## Initializing Account Data

Hesap oluşturduktan sonra, ExtraAccountMetas listesini depolamak için hesap verilerini başlatıyoruz.

```rust
// ExtraAccountMetaList hesabını ek hesaplarla başlat
ExtraAccountMetaList::init::<ExecuteInstruction>(
    &mut ctx.accounts.extra_account_meta_list.try_borrow_mut_data()?,
    &account_metas,
)?;
```

---


Bu örnekte, ExtraAccountMetas hesabını oluşturmak için Transfer Hook arayüzünü kullanmıyoruz.


### Özel Transfer Hook Talimatı

Sonraki adımda, özel `transfer_hook` talimatını uygulayacağız. Bu, Token Uzantı programının her token transferinde çağıracağı talimattır.

Bu örnekte, her token transferi için wSOL cinsinden bir ücret ödenmesi gerekecek. Basitlik açısından, ücret tutarı token transfer tutarına eşittir.

`TransferHook` yapısını aşağıdaki kodla güncelleyiniz:

```rust
#[derive(Accounts)]
pub struct TransferHook {}
```

Yerine aşağıdaki güncellenmiş kodu koyun:


Bu yapının içindeki hesapların sırası önemlidir. Token Uzantıları programı, bu Transfer Hook programına CPI ile başvurduğunda hesapları bu sırayla sağlar.


```rust
// Hesapların sırası bu yapı için önemlidir.
// İlk 4 hesap, token transferi için gereken hesaplar (kaynak, mint, varış, sahip)
// Kalan hesaplar, ExtraAccountMetaList hesabından gereken ek hesaplar
// Bu hesaplar, token2022 programından bu programa CPI ile sağlanmaktadır
#[derive(Accounts)]
pub struct TransferHook<'info> {
    #[account(
        token::mint = mint,
        token::authority = owner,
    )]
    pub source_token: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        token::mint = mint,
    )]
    pub destination_token: InterfaceAccount<'info, TokenAccount>,
    /// KONTROL: kaynak token hesabı sahibi, SystemAccount veya başka bir program tarafından sahip olunan PDA olabilir
    pub owner: UncheckedAccount<'info>,
    /// KONTROL: ExtraAccountMetaList Hesabı,
    #[account(
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
    pub extra_account_meta_list: UncheckedAccount<'info>,
    pub wsol_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(
        seeds = [b"delegate"],
        bump
    )]
    pub delegate: SystemAccount<'info>,
    #[account(
        mut,
        token::mint = wsol_mint,
        token::authority = delegate,
    )]
    pub delegate_wsol_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = wsol_mint,
        token::authority = owner,
    )]
    pub sender_wsol_token_account: InterfaceAccount<'info, TokenAccount>,
}
```

## Important Considerations

> İlk 4 hesap, ilk token transferi için gereken hesaplar.  
> — Kod Geliştirmenleri

```rust
#[account(
    token::mint = mint,
    token::authority = owner,
)]
pub source_token: InterfaceAccount<'info, TokenAccount>,
pub mint: InterfaceAccount<'info, Mint>,
#[account(
    token::mint = mint,
)]
pub destination_token: InterfaceAccount<'info, TokenAccount>,
/// KONTROL: kaynak token hesabı sahibi, SystemAccount veya başka bir program tarafından sahip olunan PDA olabilir
pub owner: UncheckedAccount<'info>,
```

5. hesap, `transfer_hook` talimatı için gereken ek hesapların listesini depolayan ExtraAccountMeta hesabının adresidir.

```rust
/// KONTROL: ExtraAccountMetaList Hesabı
#[account(
    seeds = [b"extra-account-metas", mint.key().as_ref()],
    bump
)]
pub extra_account_meta_list: UncheckedAccount<'info>,
```

### Remaining Accounts

Kalan hesaplar, `initialize_extra_account_meta_list` talimatında tanımladığımız sırayla ExtraAccountMetas hesabındaki hesaplar olarak sıralanmıştır.

```rust
pub wsol_mint: InterfaceAccount<'info, Mint>,
pub token_program: Interface<'info, TokenInterface>,
pub associated_token_program: Program<'info, AssociatedToken>,
#[account(
    mut,
    seeds = [b"delegate"],
    bump
)]
pub delegate: SystemAccount<'info>,
#[account(
    mut,
    token::mint = wsol_mint,
    token::authority = delegate,
)]
pub delegate_wsol_token_account: InterfaceAccount<'info, TokenAccount>,
#[account(
    mut,
    token::mint = wsol_mint,
    token::authority = owner,
)]
pub sender_wsol_token_account: InterfaceAccount<'info, TokenAccount>,
```

---

### Updating the Transfer Hook

Sonraki adım, `transfer_hook` talimatını aşağıdaki kod ile güncelleyerek değiştirmektir:

```rust
pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
    Ok(())
}
```

Yerine aşağıdaki güncellenmiş kodu koyun:

```rust
// transfer sırasında SOL ücreti gerektirir, lamport ücreti transfer tutarına eşittir
// Eğer bu başarısız olursa, ilk token transferi başarısız olur
pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
    msg!("Delege PDA kullanarak WSOL transferi");

    let signer_seeds: &[&[&[u8]]] = &[&[b"delegate", &[ctx.bumps.delegate]]];

    // delegelerin token hesabından göndericiden delege token hesabına WSOL transfer et
    transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.sender_wsol_token_account.to_account_info(),
                mint: ctx.accounts.wsol_mint.to_account_info(),
                to: ctx.accounts.delegate_wsol_token_account.to_account_info(),
                authority: ctx.accounts.delegate.to_account_info(),
            },
        )
        .with_signer(signer_seeds),
        amount,
        ctx.accounts.wsol_mint.decimals,
    )?;
    Ok(())
}
```

## Summary of Functionality

> Talimat mantığı içinde, göndericinin wSOL token hesabından wSOL transfer etmek için bir CPI yapıyoruz. Bu transfer, delege PDA ile imzalanır. Her token transferi için, göndericinin ilk önce transfer tutarı için delegelere izin vermesi gerekir.  
> — Kod Geliştirmenleri

### Fallback Instruction

Son olarak, Token Uzantı programından gelen CPI'yi ele almak için Anchor programına bir geri dönüş (fallback) talimatı eklememiz gerekiyor.

Bu adım, Anchor'ın talimat ayırıcıları oluşturma şekliyle Transfer Hook arayüz talimatlarında kullanılan ayırıcılar arasındaki fark nedeniyle gereklidir. `transfer_hook` talimatının talimat ayırıcıları, Transfer Hook arayüzü için olanla eşleşmeyecektir.

`fallback` talimatını aşağıdaki starter kod ile güncelleyerek değiştirin:

```rust
pub fn fallback<'info>(
    program_id: &Pubkey,
    accounts: &'info [AccountInfo<'info>],
    data: &[u8],
) -> Result<()> {
    Ok(())
}
```

Yerine aşağıdaki güncellenmiş kodu koyun:

```rust
// geri dönüş talimatı işleyicisi, anchor talimat ayırıcı kontrolü için bir çözüm
pub fn fallback<'info>(
    program_id: &Pubkey,
    accounts: &'info [AccountInfo<'info>],
    data: &[u8],
) -> Result<()> {
    let instruction = TransferHookInstruction::unpack(data)?;

    // talimat ayırıcıyı transfer hook arayüzü yürütme talimatıyla eşleştir
    // token2022 programı, bu talimatı token transferinde CPI yapar
    match instruction {
        TransferHookInstruction::Execute { amount } => {
            let amount_bytes = amount.to_le_bytes();

            // özelleştirilmiş transfer hook talimatını programımızda çağır
            __private::__global::transfer_hook(program_id, accounts, &amount_bytes)
        }
        _ => return Err(ProgramError::InvalidInstructionData.into()),
    }
}
```

## Final Note

Geri dönüş talimatı, gelen bir talimatın talimat ayırıcılarının `TransferHook` arayüzünden gelen `Execute` talimatıyla eşleşip eşleşmediğini kontrol eder. Eğer başarılı bir eşleşme gerçekleşirse, `transfer_hook` talimatını Anchor programımızda çağırır.


Şu anda, bu süreci kolaylaştıran henüz yayımlanmamış bir Anchor özelliği bulunmaktadır. Bu durum, geri dönüş talimatının gerekliliğini ortadan kaldıracaktır.


---

### Programı Derle ve Yayınla

Transfer Hook programı artık tamamlandı. Programı yayınlamak için Playground cüzdanınızda yeterli Devnet SOL bulunduğundan emin olun.

Programı derlemek için aşağıdaki komutu kullanın:

```
build
```

Ardından, programı yayınlamak için şu komutu kullanın:

```
deploy
```

### Test Dosyası Genel Görünümü

Sonra, programı test edelim. `transfer-hook.test.ts` dosyasını açın ve aşağıdaki başlangıç kodunu görmelisiniz:

```js
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TransferHook } from "../target/types/transfer_hook";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMintInstruction,
  createInitializeTransferHookInstruction,
  addExtraAccountsToInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  createApproveInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  getAccount,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import assert from "assert";

describe("transfer-hook", () => {
  // İstemciyi yerel küme kullanacak şekilde yapılandırın.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TransferHook as Program<TransferHook>;
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  // Transfer-hook etkin mint için adres olarak kullanılacak anahtar çiftini oluşturun
  const mint = new Keypair();
  const decimals = 9;

  // Gönderen token hesabı adresi
  const sourceTokenAccount = getAssociatedTokenAddressSync(
    mint.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Alıcı token hesabı adresi
  const recipient = Keypair.generate();
  const destinationTokenAccount = getAssociatedTokenAddressSync(
    mint.publicKey,
    recipient.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // ExtraAccountMetaList adresi
  // Özelleştirilmiş transfer kancası talimatı tarafından gereksinim duyulan ekstra hesapları saklayın
  const [extraAccountMetaListPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("extra-account-metas"), mint.publicKey.toBuffer()],
    program.programId
  );

  // Gönderenin wSOL token'larını transfer etmek için PDA delegesi
  const [delegatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("delegate")],
    program.programId
  );

  // Gönderenin wSOL token hesabı adresi
  const senderWSolTokenAccount = getAssociatedTokenAddressSync(
    NATIVE_MINT, // mint
    wallet.publicKey // owner
  );

  // Gönderenin wSOL token'larını almak için delegasyon PDA wSOL token hesabı adresi
  const delegateWSolTokenAccount = getAssociatedTokenAddressSync(
    NATIVE_MINT, // mint
    delegatePDA, // owner    
    true // allowOwnerOffCurve
  );

  // İki WSol token hesabını kurulum parçası olarak oluşturun
  before(async () => {
    // Gönderen için WSol Token Hesabı
    await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      NATIVE_MINT,
      wallet.publicKey
    );

    // Delegasyon PDA için WSol Token Hesabı
    await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      NATIVE_MINT,
      delegatePDA,
      true
    );
  });

  it("Transfer Kancası Uzantısı ile Mint Hesabı Oluştur", async () => {});

  it("Token Hesapları Oluştur ve Token Bas", async () => {});

  it("ExtraAccountMetaList Hesabı Oluştur", async () => {});

  it("Ek Hesap Meta ile Transfer Kancası", async () => {});
});
```

Öncelikle, **yeni bir Mint Hesabı** için adres olarak kullanılacak bir anahtar çifti oluşturuyoruz. Mint adresini kullanarak, token transferi için kullanacağımız İlişkili Token Hesapları (ATA) adreslerini türetiyoruz.

```js
// Transfer-hook etkin mint için adres olarak kullanılacak anahtar çifti oluşturun
const mint = new Keypair();
const decimals = 9;

// Gönderen token hesabı adresi
const sourceTokenAccount = getAssociatedTokenAddressSync(
  mint.publicKey,
  wallet.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

// Alıcı token hesabı adresi
const recipient = Keypair.generate();
const destinationTokenAccount = getAssociatedTokenAddressSync(
  mint.publicKey,
  recipient.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);
```

Sonraki adımda, **ExtraAccountMetas hesabı** için PDA türetiyoruz. Bu hesap, özel transfer kancası talimatı tarafından gereksinim duyulan ek hesapları saklamak için oluşturulmuştur.

```js
// ExtraAccountMetaList adresi
// Özelleştirilmiş transfer kancası talimatı tarafından gereksinim duyulan ekstra hesapları saklayın
const [extraAccountMetaListPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("extra-account-metas"), mint.publicKey.toBuffer()],
  program.programId,
);
```

Ayrıca, delegasyon olarak kullanılacak PDA'yı türetiyoruz. Gönderen bu adresi wSOL token hesabı için bir delegasyon olarak onaylamak zorundadır. **Bu delegasyon PDA'sı**, özel transfer kancası talimatında wSOL transferi için "imza" atmakta kullanılır.

```js
// Gönderenin wSOL token'larını transfer etmek için PDA delegesi
const [delegatePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("delegate")],
  program.programId,
);
```

Ayrıca, wSOL token hesaplarının adreslerini türetiyoruz. İlk adres, gönderenin wSOL token hesabına aittir ve transfer kancası talimatı tarafından gereksinim duyulan transfer ücreti için fonlanması gerekir. İkinci adres, delegasyon PDA'sı tarafından sahip olunan wSOL token hesabına aittir. Bu örnekte, tüm wSOL ücretleri bu hesaba gönderilir.

```js
// Gönderenin wSOL token hesabı adresi
const senderWSolTokenAccount = getAssociatedTokenAddressSync(
  NATIVE_MINT, // mint
  wallet.publicKey, // owner
);

// Delegasyon PDA wSOL token hesabı adresi, gönderen wSOL token'larını almak için
const delegateWSolTokenAccount = getAssociatedTokenAddressSync(
  NATIVE_MINT, // mint
  delegatePDA, // owner
  true, // allowOwnerOffCurve
);
```

### Son olarak, **kurulum parçası olarak wSOL token hesaplarını** oluşturuyoruz.

```js
// Kurulum parçası olarak iki WSol token hesabını oluştur
before(async () => {
  // Gönderen için WSol Token Hesabı
  await getOrCreateAssociatedTokenAccount(
    connection,
    wallet.payer,
    NATIVE_MINT,
    wallet.publicKey,
  );

  // Delegasyon PDA için WSol Token Hesabı
  await getOrCreateAssociatedTokenAccount(
    connection,
    wallet.payer,
    NATIVE_MINT,
    delegatePDA,
    true,
  );
});
```

### Mint Hesabı Oluştur

Başlamak için, Transfer Kancası uzantısı etkin olan yeni bir Mint Hesabı oluşturmak için bir işlem oluşturun. Bu işlemde, programımızı uzantıda depolanan Transfer Kancası programı olarak belirtmeyi unutmayın.

:::info
Transfer Kancası uzantısını etkinleştirmek, Transfer Uzantı programının her token transferinde hangi programı çağıracağını belirlemesini sağlar.
:::

Yer tutucu testini aşağıdaki güncellenmiş test ile değiştirin:

```js
it("Transfer Kancası Uzantısı ile Mint Hesabı Oluştur", async () => {});
```

Aşağıdaki güncellenmiş test ile değiştirin:

```js
it("Transfer Kancası Uzantısı ile Mint Hesabı Oluştur", async () => {
  const extensions = [ExtensionType.TransferHook];
  const mintLen = getMintLen(extensions);
  const lamports =
    await provider.connection.getMinimumBalanceForRentExemption(mintLen);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: mintLen,
      lamports: lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeTransferHookInstruction(
      mint.publicKey,
      wallet.publicKey,
      program.programId, // Transfer Kancası Program ID
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mint.publicKey,
      decimals,
      wallet.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  const txSig = await sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [wallet.payer, mint],
  );
  console.log(`İşlem İmzası: ${txSig}`);
});
```

### Token Hesapları Oluşturma

Sonraki adımda, kurulum parçası olarak hem gönderenin hem de alıcının İlişkili Token Hesaplarını oluşturun. Ayrıca, gönderenin hesabına biraz token yükleyin.

:::note
Bu işlem sırasında, gönderilen token miktarını belirlemeyi unutmayın.
:::

Yer tutucu testini aşağıdaki güncellenmiş test ile değiştirin:

```js
it("Token Hesapları Oluştur ve Token Bas", async () => {});
```

Aşağıdaki güncellenmiş test ile değiştirin:

```js
// transfer-hook etkin mint için iki token hesabını oluştur
// Gönderen token hesabını 100 token ile finanse et
it("Token Hesapları Oluştur ve Token Bas", async () => {
  // 100 token
  const amount = 100 * 10 ** decimals;

  const transaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      sourceTokenAccount,
      wallet.publicKey,
      mint.publicKey,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      destinationTokenAccount,
      recipient.publicKey,
      mint.publicKey,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
    createMintToInstruction(
      mint.publicKey,
      sourceTokenAccount,
      wallet.publicKey,
      amount,
      [],
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  const txSig = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet.payer],
    { skipPreflight: true },
  );

  console.log(`İşlem İmzası: ${txSig}`);
});
```

### ExtraAccountMeta Hesabı Oluştur

Bir token transferi göndermeden önce, transfer kancası talimatı tarafından gereksinim duyulan tüm ek hesapları saklamak için **ExtraAccountMetas hesabını** oluşturmamız gerekiyor.

:::tip
Bu hesabı oluşturmak için, programımızdan talimatı çağırıyoruz.
:::

Yer tutucu testini aşağıdaki güncellenmiş test ile değiştirin:

```js
it("ExtraAccountMetaList Hesabı Oluştur", async () => {});
```

Aşağıdaki güncellenmiş test ile değiştirin:

```js
// Transfer kancası talimatı tarafından gereksinim duyulan ekstra hesapları saklamak için hesap
it("ExtraAccountMetaList Hesabı Oluştur", async () => {
  const initializeExtraAccountMetaListInstruction = await program.methods
    .initializeExtraAccountMetaList()
    .accounts({
      payer: wallet.publicKey,
      extraAccountMetaList: extraAccountMetaListPDA,
      mint: mint.publicKey,
      wsolMint: NATIVE_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .instruction();

  const transaction = new Transaction().add(
    initializeExtraAccountMetaListInstruction,
  );

  const txSig = await sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [wallet.payer],
    { skipPreflight: true },
  );
  console.log("İşlem İmzası:", txSig);
});
```

### Token Transferi

Son olarak, bir token transferi göndermeye hazırız. Transfer talimatına ek olarak, birkaç ek talimatın da dahil edilmesi gerekir.

- Gönderen, transfer kancası talimatında gereken ücreti karşılamak için SOL'u wSOL token hesabına transfer etmelidir.
- Gönderen, wSOL ücretinin miktarı için delegasyon PDA'sını onaylamalıdır.
- wSOL bakiyesini senkronize etmek için bir talimat ekleyin.
- Token transfer talimatı, transfer kancası talimatı tarafından gereksinim duyulan tüm ekstra hesapları içermelidir.

:::warning
Aşağıdaki adımları izlemek, transfer işleminizin düzgün bir şekilde gerçekleştirilmesi için önemlidir.
:::

Yer tutucu testini aşağıdaki güncellenmiş test ile değiştirin:

```js
it("Ek Hesap Meta ile Transfer Kancası", async () => {});
```

Aşağıdaki güncellenmiş test ile değiştirin:

```js
it("Ek Hesap Meta ile Transfer Kancası", async () => {
  // 1 token
  const amount = 1 * 10 ** decimals;

  // Gönderenin WSol token hesabını finanse etmesi için talimat
  const solTransferInstruction = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: senderWSolTokenAccount,
    lamports: amount,
  });

  // Delegasyon PDA'sını gönderen WSol token hesabından WSol tokenlarını transfer etmesi için onaylama talimatı
  const approveInstruction = createApproveInstruction(
    senderWSolTokenAccount,
    delegatePDA,
    wallet.publicKey,
    amount,
    [],
    TOKEN_PROGRAM_ID,
  );

  // Gönderen WSol token hesabını senkronize et
  const syncWrappedSolInstruction = createSyncNativeInstruction(
    senderWSolTokenAccount,
  );

  // Bu yardımcı fonksiyon, Ek Hesap Metaları hesabında tanımlanan tüm ek hesapların otomatik olarak türetilmesini sağlayacaktır
  let transferInstructionWithHelper =
    await createTransferCheckedWithTransferHookInstruction(
      connection,
      sourceTokenAccount,
      mint.publicKey,
      destinationTokenAccount,
      wallet.publicKey,
      amountBigInt,
      decimals,
      [],
      "onaylı",
      TOKEN_2022_PROGRAM_ID,
    );

  const transaction = new Transaction().add(
    solTransferInstruction,
    syncWrappedSolInstruction,
    approveInstruction,
    transferInstructionWithHelper,
  );

  const txSig = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet.payer],
    { skipPreflight: true },
  );
  console.log("Transfer İmzası:", txSig);
});
```

Transfer talimatı, tüm ek AccountMetaları, ExtraAccountMetas hesabının adresi ve Transfer Kancası programının adresini içermelidir.

### Test Dosyasını Çalıştır

Tüm testleri güncelledikten sonra son adım, test dosyasını çalıştırmaktır.

Test dosyasını çalıştırmak için terminalde aşağıdaki komutu kullanın:

```
test
```

Aşağıdaki gibi bir çıktı görmelisiniz:

```
Testler çalışıyor...
  transfer-hook.test.ts:
  transfer-hook
    İşlem İmzası: 5o12ZTvcSkV8YNqyeQpzRCq4zFSg9VqguQkT9ZSesioj8uzb8dWRheoknuPaRDDqEGdrUBqmRQ2veSUshUicWsqG
    ✔ Transfer Kancası Uzantısı ile Mint Hesabı Oluştur (996ms)
    İşlem İmzası: 4F4Vhi8s1h2reDr6jecvuQFF5XpoofWPpshgAMnfg7jtNZj4HtxbsksFTh28ZjYTaKFpjeturYZKxk5Cj4gBZoy
    ✔ Token Hesapları Oluştur ve Token Bas (716ms)
    İşlem İmzası: 3s4Nok6H4qexpGXup3AWC4nGuiqy567rm5rTWLFMXYKxZJensBVVZHCwVDzpwD3XtWjMFHm4TrvQXwKSsp47y5jx
    ✔ ExtraAccountMetaList Hesabı Oluştur (711ms)
    Transfer İmzası: 53j9QV5LYUVgV7T7Z99GfYg1Xvp2qbQnHsJbzDK6BR5TPBo9s622KCf3W3BDEL4ECprkZFs5biDRDedfVj6zuDA6
    ✔ Ek Hesap Meta ile Transfer Kancası (925ms)
  4 geçerli (5s)
```

### Transfer kancasında token hesap verilerini kullanma

Bazen, ekstra hesap metalarında ek hesaplar türetmek için hesap verilerini kullanmak isteyebilirsiniz. Bu, örneğin, token hesabının sahibi gibi bir veriyi PDA için bir tohum olarak kullanmak istediğinizde yararlıdır.

ExtraAccountMeta oluştururken, herhangi bir hesabın verisini bir ek tohum olarak kullanabilirsiniz. Bu durumda, token hesabı sahibinden bir sayaç hesabı türetmek istiyoruz ve "counter" dizesini kullanacağız. Bu, o token hesabı sahibinin token transferi ne sıklıkla gerçekleştirdiğini her zaman görmemizi sağlar.

:::note
Bunu `extra_account_metas()` işlevinde nasıl ayarlayacağınız aşağıdadır.
:::

```rust
// extra_account_meta_list hesabında saklanacak ekstra hesap metalarını tanımlayın
impl<'info> InitializeExtraAccountMetaList<'info> {
    pub fn extra_account_metas() -> Result<Vec<ExtraAccountMeta>> {
        Ok(
            vec![
                ExtraAccountMeta::new_with_seeds(
                    &[
                        Seed::Literal {
                            bytes: b"counter".to_vec(),
                        },
                        Seed::AccountData { account_index: 0, data_index: 32, length: 32 },
                    ],
                    false, // is_signer
                    true // is_writable
                )?
            ]
        )
    }
}
```

Hesap verilerinin nasıl saklandığını anlamak için **token hesap yapısına** bakalım. Aşağıda bir token hesabı yapısının örneği bulunmaktadır. Bu nedenle, 32 bayt uzunluğundaki 32'den 64'e kadar olan baytları token hesabının sahibi olarak alabiliriz; bu 'account_index: 0' dır. 'account_index' hesap dizisinde hesabın indeksini belirtir. Transfer kancası durumunda, sahibi token hesabı dizinin ilk girişidir. İkinci hesap her zaman mint ve üçüncü hesap varış token hesabıdır. Bu hesap sırası, eski token programında olduğu gibidir.

```rust
/// Hesap verisi.
#[repr(C)]
#[derive(Clone, Copy, Debug, Default, PartialEq)]
pub struct Account {
    /// Bu hesapla ilişkili mint
    pub mint: Pubkey,
    /// Bu hesabın sahibi.
    pub owner: Pubkey,
    /// Bu hesabın sahip olduğu token miktarı.
    pub amount: u64,
    pub delegate: COption<Pubkey>,
    pub state: AccountState,
    pub is_native: COption<u64>,
    pub delegated_amount: u64,
    pub close_authority: COption<Pubkey>,
}
```

Bizim durumumuzda, gönderici token hesabının sahibinden bir sayaç hesabı türetmek istiyoruz, böylece ExtraAccountMeta hesaplarını oluşturduğumuzda, bu PDA sayaç hesabını "counter" dizesi ile gönderen token hesabı sahibinden türetiyoruz. PDA sayaç hesabı başlatıldığında, transfer işlemi sırasında değeri artırmak için kullanabileceğiz.

```rust
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: ExtraAccountMetaList Hesabı, bu tohumları kullanmalısınız
    #[account(
        init,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump,
        space = ExtraAccountMetaList::size_of(
            InitializeExtraAccountMetaList::extra_account_metas()?.len()
        )?,
        payer = payer
    )]
    pub extra_account_meta_list: AccountInfo<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(init, seeds = [b"counter", payer.key().as_ref()], bump, payer = payer, space = 16)]
    pub counter_account: Account<'info, CounterAccount>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
```

Ayrıca, **bu ekstra sayaç hesabını TransferHook yapısında tanımlamamız gerekiyor**. Bu, her transfer gerçekleştirildiğinde TransferHook programımıza iletilen hesaplardır. İstemci bu ek hesapları ExtraAccountsMetaList PDA'sından alır ve bunları token transfer talimatına ekler; ancak burada programda hala bunu tanımlamamız gerekiyor.

```rust
#[derive(Accounts)]
pub struct TransferHook<'info> {
    #[account(token::mint = mint, token::authority = owner)]
    pub source_token: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(token::mint = mint)]
    pub destination_token: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: kaynak token hesabı sahibi, Sistem Hesabı veya başka bir program tarafından sahip olunan PDA olabilir
    pub owner: UncheckedAccount<'info>,
    /// CHECK: ExtraAccountMetaList Hesabı,
    #[account(seeds = [b"extra-account-metas", mint.key().as_ref()], bump)]
    pub extra_account_meta_list: UncheckedAccount<'info>,
    #[account(seeds = [b"counter", owner.key().as_ref()], bump)]
    pub counter_account: Account<'info, CounterAccount>,
}
```

İstemcide bu hesap otomatik olarak oluşturulur ve aşağıdaki gibi kullanılabilir.

```rust
const transferInstructionWithHelper =
await createTransferCheckedWithTransferHookInstruction(
    connection,
    sourceTokenAccount,
    mint.publicKey,
    destinationTokenAccount,
    wallet.publicKey,
    amountBigInt,
    decimals,
    [],
    "onaylı",
    TOKEN_2022_PROGRAM_ID
);
```

Yardımcı fonksiyon, hesapları otomatik olarak Ek Hesap verileri hesabından çözüme kavuşturacaktır. İstemcide, hesap şöyle çözülecektir:

```js
const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

Unutmayın ki **sayaç hesabı**, token hesabının sahibinden türetilmiş olup, transfer işlemi gerçekleştirmeden önce başlatılması gerekir. Bu örnekte, ekstra hesap metalarını başlatırken sayaç hesabını başlattık. Bu nedenle, yalnızca bu işlevi çağıran token hesabı sahibinin bir sayaç PDA'sı olacaktır. Eğer mint'inizdeki her token hesabı için bir sayaç hesabına sahip olmak istiyorsanız, bu PDA'ları önceden oluşturmak için bir işlevselliğe sahip olmanız gerekecektir. DApp'inizde kullanıcının bu sayaç tokenını kullanması için bir buton olmalıdır.

### Sonuç

Transfer Hook eklentisi ve Transfer Hook Arayüzü, her token transferinde özel talimat mantığını yürüten Mint Hesaplarının oluşturulmasını sağlar. 

:::tip
Bu kılavuz, kendi Transfer Hook programlarınızı oluşturmanıza yardımcı olmak için bir referans görevi görmektedir. 
:::

Yaratıcı olmaktan çekinmeyin ve bu yeni işlevselliğin yeteneklerini keşfedin!

> "Özel talimat mantığını uygulamak, transfer süreçlerinizi daha da özelleştirebilir."  
> — Transfer Hook Rehberi

---

:::note
Transfer Hook ile kullanabileceğiniz bazı yaratıcı senaryolar:
- Kullanıcı davranışına dayalı otomatik transferler
- Özel bütçe yönetimi uygulamaları
- Güvenlik protokollerinin iyileştirilmesi
:::

:::warning
Unutmayın, gereksinimleri karşılamayan bir Transfer Hook oluşturmak sisteminizde istenmeyen sonuçlar doğurabilir.  
:::


Eklenti Hakkında Daha Fazla Bilgi
Transfer Hook eklentisi, token transferleri ile ilgili özelleştirilmiş iş akışları oluşturmanıza olanak tanır. İşlevselliği sayesinde, kullanıcı etkileşimlerinizi ve sistem performansınızı artırabilirsiniz.
