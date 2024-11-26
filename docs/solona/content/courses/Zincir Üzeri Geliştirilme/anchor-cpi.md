---
title: Anchor CPI'leri ve Hatalar
objectives:
  - Bir Anchor programından Çapraz Program Çağrıları (CPI'ler) yapmak
  - Var olan Anchor programlarında talimatları çağırmak için yardımcı işlevler oluşturmak için `cpi` özelliğini kullanmak
  - CPI yardımcı işlevlerinin mevcut olmadığı durumlarda `invoke` ve `invoke_signed` kullanarak CPI'ler yapmak
  - Özel Anchor hatalarını oluşturmak ve döndürmek
description: "Anchor uygulamanızdan diğer Solana programlarını çağırın."
---

## Özeti

- Anchor, **`CpiContext`** kullanarak CPI oluşturmayı basit bir hale getirir
- Anchor'un **`cpi`** özelliği, var olan Anchor programlarında talimatları çağırmak için CPI yardımcı işlevleri üretir
- CPI yardımcı işlevlerine erişiminiz yoksa, yine de doğrudan `invoke` ve `invoke_signed` kullanabilirsiniz
- **`error_code`** nitelik makrosu, özel Anchor Hataları oluşturmak için kullanılır

## Ders

Anchor, çağırdığınız programın da erişebileceğiniz bir Anchor programı olması durumunda, diğer Solana programlarını çağırmayı kolaylaştırır.

Bu derste, bir Anchor CPI'sini nasıl oluşturacağınızı öğreneceksiniz. Ayrıca, daha karmaşık Anchor programları yazmaya başlayabilmeniz için bir Anchor programından özel hataları nasıl fırlatacağınızı da öğreneceksiniz.

### Anchor ile Çapraz Program Çağrıları (CPI'ler)

CPI'ler, programların `invoke` veya `invoke_signed` işlevlerini kullanarak diğer programlardaki talimatları çağırmalarını sağlar. Bu, yeni programların mevcut programların üzerine inşa edilmesine olanak tanır (buna bileşenlilik diyoruz).

Doğrudan `invoke` veya `invoke_signed` kullanarak CPI'ler yapmak bir seçenek olmasına rağmen, Anchor ayrıca bir `CpiContext` kullanarak CPI'ler yapmanın basitleştirilmiş bir yolunu sunar.

:::info
Bu derste, SPL Token Programına CPI'ler yapmak için `anchor_spl` crate'ini kullanacaksınız. 
[`anchor_spl` crate'indeki mevcut olanları keşfedin](https://docs.rs/anchor-spl/latest/anchor_spl/#).
:::

#### `CpiContext`

Bir CPI oluşturmanın ilk adımı bir `CpiContext` örneği oluşturmaktır.
`CpiContext`, Anchor talimat işlevleri için gerekli ilk argüman tipi olan `Context`'e çok benzerdir. İkisi de aynı modülde tanımlanmıştır ve benzer işlevsellik paylaşırlar.

`CpiContext` tipi, çapraz program çağrıları için argüman olmayan girdileri belirtir:

- `accounts` - çağrılan talimat için gerekli hesapların listesi
- `remaining_accounts` - bu talimatta yer almayan ancak başka yerlerde (örneğin, iç talimatlar tarafından) kullanılabilecek hesaplar
- `program` - çağrılan programın program kimliği
- `signer_seeds` - bir veya daha fazla PDA işlemi imzalıyorsa, PDA'ları türetmek için gereken tohumlar

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

Orijinal işlem imzasını geçerken yeni bir örnek oluşturmak için `CpiContext::new` kullanırsınız.

```rust
CpiContext::new(cpi_program, cpi_accounts)
```

```rust
pub fn new(
        program: AccountInfo<'info>,
        accounts: T
    ) -> Self {
    Self {
        accounts,
        program,
        remaining_accounts: Vec::new(),
        signer_seeds: &[],
    }
}
```

CPI için bir PDA adına imzalarken yeni bir örnek oluşturmak için `CpiContext::new_with_signer` kullanırsınız.

```rust
CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds)
```

```rust
pub fn new_with_signer(
    program: AccountInfo<'info>,
    accounts: T,
    signer_seeds: &'a [&'b [&'c [u8]]],
) -> Self {
    Self {
        accounts,
        program,
        signer_seeds,
        remaining_accounts: Vec::new(),
    }
}
```

#### CPI hesapları

`CpiContext`'in temel özelliklerinden biri, `accounts` argümanının genel olmasıdır; böylece `ToAccountMetas` ve `ToAccountInfos` özelliklerini uygulayan herhangi bir nesneyi geçirebilirsiniz.

Bu özellikler, talimat işleyicileriniz için gerekli hesapları belirtmek için kullandığınız `#[derive(Accounts)]` nitelik makrosu ile eklenir. `CpiContext` ile `#[derive(Accounts)]` yapısını da kullanabilirsiniz.

Bu, kod organizasyonu ve tür güvenliği ile yardımcı olur.

#### Diğer bir Anchor programında bir talimat işleyicisini çağırma

Yayımlanmış bir crate ile başka bir Anchor programını çağırırken, Anchor sizler için talimat oluşturucuları ve CPI yardımcı işlevlerini üretebilir.

Basitçe, programınızın `Cargo.toml` dosyasında çağırdığınız programa bağlılığını şöyle tanımlayın:

```
[dependencies]
callee = { path = "../callee", features = ["cpi"]}
```

:::tip
`features = ["cpi"]` ekleyerek, `cpi` özelliğini etkinleştirir ve programınız `callee::cpi` modülüne erişim kazanır.
:::

`cpi` modülü, `callee`'nin talimat işleyicilerini Rust işlevlerine dönüştürür.
Bu işlevler, bir `CpiContext` ve talimat için gerekli ek verileri alır. Bu işlevler, Anchor programlarınızdaki talimat işleyicileriyle aynı şekilde çalışır, ancak `Context` yerine `CpiContext` kullanır. `cpi` modülü ayrıca bu talimat işleyicileri için gerekli hesap yapıları sağlar.

Örneğin, `callee`'de `do_something` adında, `DoSomething` yapısında tanımlanmış hesapları gerektiren bir talimat varsa, `do_something`'i aşağıdaki gibi çağırabilirsiniz:

```rust
use anchor_lang::prelude::*;
use callee;
...

#[program]
pub mod lootbox_program {
    use super::*;

    pub fn call_another_program(ctx: Context<CallAnotherProgram>, params: InitUserParams) -> Result<()> {
        callee::cpi::do_something(
            CpiContext::new(
                ctx.accounts.callee.to_account_info(),
                callee::DoSomething {
                    user: ctx.accounts.user.to_account_info()
                }
            )
        )
        Ok(())
    }
}
...
```

#### Non-Anchor programında bir talimat çağırma

Çağırdığınız program bir Anchor programı _değilse_, iki olası seçeneğiniz vardır:

1. Program yöneticileri, programlarına çağrı yapmak için kendi yardımcı işlevleri içeren bir crate yayımlamış olabilir. Örneğin, `anchor_spl` crate'i, `cpi` program modülünde elde edebileceğiniz çağrılan yer açısından neredeyse özdeş yardımcı işlevler sağlar. Örnek olarak, [`mint_to` yardımcı işlevini](https://docs.rs/anchor-spl/latest/src/anchor_spl/token.rs.html#36-58) kullanabilir ve [`MintTo` hesap yapısını](https://docs.rs/anchor-spl/latest/anchor_spl/token/struct.MintTo.html) kullanarak token dizinini mint edebilirsiniz.

   ```rust
   token::mint_to(
       CpiContext::new_with_signer(
           ctx.accounts.token_program.to_account_info(),
           token::MintTo {
               mint: ctx.accounts.mint_account.to_account_info(),
               to: ctx.accounts.token_account.to_account_info(),
               authority: ctx.accounts.mint_authority.to_account_info(),
           },
           &[&[
               "mint".as_bytes(),
               &[*ctx.bumps.get("mint_authority").unwrap()],
           ]]
       ),
       amount,
   )?;
   ```

2. Eğer çağırmanız gereken talimat(lar) için bir yardımcı modül yoksa, `invoke` ve `invoke_signed` kullanmaya geri dönebilirsiniz. Aslında, yukarıda referans verilen `mint_to` yardımcı işlevinin kaynak kodu, bir `CpiContext` verildiğinde nasıl `invoke_signed` kullanıldığına dair bir örnek sunar. Hesap yapısı ve `CpiContext` kullanıyorsanız benzer bir modeli takip edebilirsiniz.

   ```rust
   pub fn mint_to<'info>(
       ctx: CpiContext<'_foo, '_bar, '_baz, 'info, MintTo<'info>>,
       amount: u64,
   ) -> Result<()> {
       let instruction_handler = spl_token::instruction::mint_to(
           &spl_token::ID,
           ctx.accounts.mint.key,
           ctx.accounts.to.key,
           ctx.accounts.authority.key,
           &[],
           amount,
       )?;
       anchor_lang::solana_program::program::invoke_signed(
           &instruction_handler,
           &[
               ctx.accounts.to,
               ctx.accounts.mint,
               ctx.accounts.authority
           ],
           ctx.signer_seeds,
       )
       .map_err(Into::into)
   }
   ```

### Anchor'da hatalar fırlatmak

Artık Anchor'da yeterince derin bir noktadayız ki, özel hataları nasıl oluşturacağınızı bilmek önemlidir.

Sonuç olarak, tüm programlar aynı hata türünü döndürür:
[`ProgramError`](https://docs.rs/solana-program/latest/solana_program/program_error/enum.ProgramError.html).
Ancak, Anchor kullanarak bir program yazarken, `ProgramError`'ın üstünde bir soyutlama olarak `AnchorError` kullanabilirsiniz. Bu soyutlama, bir program başarısız olduğunda ek bilgiler sağlar, bunlar arasında:

- Hata adı ve numarası
- Hatanın fırlatıldığı kodun yeri
- Bir kısıtlamayı ihlal eden hesap

```rust
pub struct AnchorError {
    pub error_name: String,
    pub error_code_number: u32,
    pub error_msg: String,
    pub error_origin: Option<ErrorOrigin>,
    pub compared_values: Option<ComparedValues>,
}
```

Anchor Hataları şu şekilde sınıflandırılabilir:

- Çerçevenin kendi kodu içinden döndürdüğü Anchor İç Hataları
- Geliştirici olarak yaratabileceğiniz Özel hatalar

Özel hatalar eklemek için `error_code` niteliğini kullanabilirsiniz. Bu niteliği özel bir `enum` türüne eklemeniz yeterlidir. Daha sonra, programınızdaki hatalar olarak `enum` değişkenlerini kullanabilirsiniz. Ayrıca, her bir değişkene `msg` niteliği kullanarak bir hata mesajı ekleyebilirsiniz. Müşteriler, hata meydana geldiğinde bu hata mesajını gösterebilir.

```rust
#[error_code]
pub enum MyError {
    #[msg("MyAccount yalnızca 100'ün altındaki verileri tutabilir")]
    DataTooLarge
}
```

Bir talimat işleyicisinden özel bir hata döndürmek için
[err](https://docs.rs/anchor-lang/latest/anchor_lang/macro.err.html) veya [error](https://docs.rs/anchor-lang/latest/anchor_lang/prelude/macro.error.html)
makrosunu kullanabilirsiniz. Bu makrolar, Anchor'un hata kaydını günlüğe kaydetmesine yardımcı olacak dosya ve satır bilgileri ekler:

```rust
#[program]
mod hello_anchor {
    use super::*;
    pub fn set_data(ctx: Context<SetData>, data: MyAccount) -> Result<()> {
        if data.data >= 100 {
            return err!(MyError::DataTooLarge);
        }
        ctx.accounts.my_account.set_inner(data);
        Ok(())
    }
}

#[error_code]
pub enum MyError {
    #[msg("MyAccount yalnızca 100'ün altındaki verileri tutabilir")]
    DataTooLarge
}
```

Alternatif olarak, hataları döndürmeyi basit hale getirmek için
[require](https://docs.rs/anchor-lang/latest/anchor_lang/macro.require.html) makrosunu kullanabilirsiniz. Yukarıdaki kodu aşağıdaki gibi yeniden yapılandırabilirsiniz:

```rust
#[program]
mod hello_anchor {
    use super::*;
    pub fn set_data(ctx: Context<SetData>, data: MyAccount) -> Result<()> {
        require!(data.data < 100, MyError::DataTooLarge);
        ctx.accounts.my_account.set_inner(data);
        Ok(())
    }
}

#[error_code]
pub enum MyError {
    #[msg("MyAccount yalnızca 100'ün altındaki verileri tutabilir")]
    DataTooLarge
}
```

## Laboratuvar

Bu derste ele aldığımız kavramları, önceki derslerden gelen Movie Review programının üzerine inşa ederek pratik yapalım.

Bu laboratuvarda, kullanıcılar yeni bir film incelemesi eklediklerinde token mintlemek için programı güncelleyeceğiz.

<Adımlar>

### Başlangıç

Başlamak için, önceki dersten alınan Anchor Movie Review programının son durumunu kullanacağız. Dolayısıyla, eğer o dersi yeni tamamladıysanız, her şey hazır ve gitmeye hazırsınız. Eğer buraya yeni katıldıysanız, endişelenmeyin, [başlangıç kodunu indirin](https://github.com/Unboxed-Software/anchor-movie-review-program/tree/solution-pdas).
`solution-pdas` dalını başlangıç noktamız olarak kullanacağız.

### Cargo.toml dosyasına bağımlılıklar ekleyin

Başlamadan önce, `init-if-needed` özelliğini etkinleştirmemiz ve `Cargo.toml` dosyasındaki bağımlılıklara `anchor-spl` crate'ini eklememiz gerekiyor. Eğer `init-if-needed` özelliği hakkında tekrar düşünmek isterseniz, `Anchor PDAları ve Hesaplar dersi` üzerine bir göz atın.

```rust
[dependencies]
anchor-lang = { version = "0.30.1", features = ["init-if-needed"] }
anchor-spl = "0.30.1"
```

:::warning
`anchor-spl`'yi bağımlılık olarak eklediğimize göre, `Cargo.toml`'deki özellikler bölümüne bunun için `idl-build` eklememiz gerekiyor. Bunun nedeni, bu derste ekleyeceğimiz `Accounts` yapıların tamamında kullanılan tüm türlerin bir IDL oluşturmak için `IdlBuild` trait implementasyonuna ihtiyacı olmasıdır.
:::

```rust
[features]
# Tüm satırlar aynı kalır, yalnızca bu idl-build satırı hariç
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
```

### Ödül tokenini başlatın

Sonraki adımda, `lib.rs`'ye gidin ve `InitializeMint` bağlam türünü uygulayın ve talimatın gerektirdiği hesapları ve kısıtlamaları listeleyin. Burada, "mint" dizesini tohum olarak kullanarak yeni bir `Mint` hesabı başlatıyoruz. `Mint` hesabının adresi ve mint otoritesi için aynı PDA'yı kullanabileceğimizi unutmayın. Mint otoritesi olarak PDA kullanmak, programımızın token mintleme işlemi için imza atmasına olanak tanır.

`Mint` hesabını başlatmak için `token_program`, `rent` ve `system_program`'ı hesaplar listesine dahil etmemiz gerekecek.

```rust
#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(
        init,
        seeds = ["mint".as_bytes()],
        bump,
        payer = user,
        mint::decimals = 6,
        mint::authority = user,
    )]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}
```

Yukarıdaki bazı kısıtlamalarla daha önce karşılaşmamış olabilirsiniz. `mint::decimals` ve `mint::authority` eklerken, yeni bir token minti olarak uygun ondalık ve mint yetkisi ayarlarının yapılmasını sağlarken `init` kullanmak zorunda oldukları gibi kısıtlamalar ekledik.

Şimdi, yeni bir token mint başlatacak şekilde bir talimat oluşturun. Bu, her kullanıcı bir inceleme bıraktığında mintlenecek token olacaktır. Özel bir talimat mantığı dahil etmemize gerek olmadığını unutmayın, çünkü başlatma işlemi tamamen Anchor kısıtlamaları ile yönetilebilir.

```rust
pub fn initialize_token_mint(_ctx: Context<InitializeMint>) -> Result<()> {
    msg!("Token mint başlatıldı");
    Ok(())
}
```

### Anchor Hatası

Sonraki adımda, `add_movie_review` veya `update_movie_review` talimatında geçici miktarı doğrulamak için kullanacağımız bir Anchor Hatası oluşturalım.
- `add_movie_review` talimatında geçen `title`
- `add_movie_review` veya `update_movie_review` talimatlarında geçen `description`

```rust
#[error_code]
enum MovieReviewError {
    #[msg("Rating 1 ile 5 arasında olmalıdır")]
    InvalidRating,
    #[msg("Film Başlığı çok uzun")]
    TitleTooLong,
    #[msg("Film Tanımı çok uzun")]
    DescriptionTooLong,
}
```

### `add_movie_review` talimatını güncelleyin

Bir miktar ayarladıktan sonra, inceleme yapan kişiye token mint etmek için `add_movie_review` talimatını ve `AddMovieReview` bağlam türünü güncelleyelim.

Ardından, `AddMovieReview` bağlam türünü aşağıdaki hesapları eklemek için güncelleyin:

- `token_program` - token mint.com ihtiyacını takip edeceğiz
- `mint` - kullanıcılar bir film incelemesi eklediklerinde mintlenecek tokenler için mint hesabı
- `token_account` - yukarıda bahsedilen `mint` ve inceleme yapan kişi için ilişkili token hesabı
- `associated_token_program` - `token_account` üzerinde `associated_token` kısıtlamasını kullanacağımız için gereklidir

```rust
#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct AddMovieReview<'info> {
    #[account(
        init,
        seeds=[title.as_bytes(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = DISCRIMINATOR + MovieAccountState::INIT_SPACE
    )]
    pub movie_review: Account<'info, MovieAccountState>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    #[account(
        seeds = ["mint".as_bytes()],
        bump,
        mut
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = initializer,
        associated_token::mint = mint,
        associated_token::authority = initializer
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
```

Yine, yukarıdaki bazı kısıtlamalar size yabancı olabilir. `associated_token::mint` ve `associated_token::authority` kısıtlamaları ile birlikte `init_if_needed` kısıtlaması, eğer hesap daha önce başlatılmadıysa, bağlı token hesabı olarak belirtilen mint ve yetki için başlatılmasını sağlamak üzere tasarlanmıştır. Ayrıca, hesap başlangıç maliyetleriyle ilgili ödemeleri gerçekleştirecek kişi 'payer' kısıtlaması ile ayarlanacaktır.

Ardından, `add_movie_review` talimatını güncelleyerek aşağıdaki görevleri gerçekleştirin:

- `rating` geçerli olduğunda garantileyin. Geçerli bir değerlendirme değilse, `InvalidRating` hatasını döndürün.
- `title` uzunluğunun geçerli olduğundan emin olun. Geçerli bir uzunluk değilse, `TitleTooLong` hatasını döndürün.
- `description` uzunluğunun geçerli olduğundan emin olun. Geçerli bir uzunluk değilse, `DescriptionTooLong` hatasını döndürün.
- Token programının `mint_to` talimatına, mint yetkisi PDA'sını imzalayan olarak kullanarak bir CPI gerçekleştirin. Unutmayın, 10 token mintleyeceğiz ama mint ondalıklarını düzeltmek için `10 * 10^6` yapmamız gerekecek.

Neyse ki, `anchor_spl` crate'ini kullanarak `mint_to` ve `MintTo` gibi yardımcı işlevler ve türlere erişim sağlayabiliriz. `mint_to`, bir `CpiContext` ve integer argümanı alır; bu integer mintlenecek token sayısını temsil eder. `MintTo`, mint talimatının ihtiyaç duyduğu hesaplar listesi için kullanılabilir.

Kullanım bildirimlerinizi şu şekilde güncelleyin:

```rust
use anchor_spl::token::{mint_to, MintTo, Mint, TokenAccount, Token};
use anchor_spl::associated_token::AssociatedToken;
```

Son olarak, `add_movie_review` işlevini şu şekilde güncelleyin:

```rust
pub fn add_movie_review(
    ctx: Context<AddMovieReview>,
    title: String,
    description: String,
    rating: u8
) -> Result<()> {
    // Derecelendirme 1 ile 5 arasında olmalıdır
    require!(
        rating >= MIN_RATING && rating <= MAX_RATING,
        MovieReviewError::InvalidRating
    );

    // Başlığın 20 karakterden uzun olmaması gerekmektedir
    require!(
        title.len() <= MAX_TITLE_LENGTH,
        MovieReviewError::TitleTooLong
    );

    // Tanımın 50 karakterden uzun olmaması gerekmektedir
    require!(
        description.len() <= MAX_DESCRIPTION_LENGTH,
        MovieReviewError::DescriptionTooLong
    );

    msg!("Film inceleme hesabı oluşturuldu");
    msg!("Başlık: {}", title);
    msg!("Tanım: {}", description);
    msg!("Derecelendirme: {}", rating);

    let movie_review = &mut ctx.accounts.movie_review;
    movie_review.reviewer = ctx.accounts.initializer.key();
    movie_review.title = title;
    movie_review.description = description;
    movie_review.rating = rating;

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                authority: ctx.accounts.initializer.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info()
            },
            &[&[
                "mint".as_bytes(),
                &[ctx.bumps.mint]
            ]]
        ),
        10 * 10 ^ 6
    )?;

    msg!("Tokenlar mintlendi");

    Ok(())
}

### Güncelle `update_movie_review` talimatı

Burada yalnızca `rating` ve `description`'ın geçerli olduğuna dair kontrol ekliyoruz.

```rust
pub fn update_movie_review(
    ctx: Context<UpdateMovieReview>,
    title: String,
    description: String,
    rating: u8
) -> Result {
    // Derecelendirmenin 1 ile 5 arasında olması gerektiğini talep ediyoruz
    require!(
        rating >= MIN_RATING && rating  {
  // İstemciyi yerel küme kullanacak şekilde yapılandırın.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace
    .AnchorMovieReviewProgram as Program

  const movie = {
    title: "Sadece bir test filmi",
    description: "Vay canına ne kadar iyi bir filmdi, gerçekten harikaydı",
    rating: 5,
  }

  const [movie_pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId
  )

  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId
  )
...
}
```

Yüklü değilse `npm install @solana/spl-token --save-dev` komutunu çalıştırabilirsiniz.

Bunu tamamladıktan sonra, `initializeTokenMint` talimatı için bir test ekleyin:

```typescript
it("Ödül tokenini başlatır", async () => {
  const tx = await program.methods.initializeTokenMint().rpc();
});
```

:::note
 `.accounts` eklemek zorunda kalmadığımızı çünkü bunların çıkarıldığını unutmayın, özellikle `mint` hesabı (seed çıkarımınız etkinse) için.
:::

Sonraki adım, `addMovieReview` talimatı için testi güncellemektir. Temel eklemeler şunlardır:

1. İlgili hesap adresini almak, bu hesap talimata geçilecek ve çıkarılamayacak
2. Testin sonunda, ilgili token hesabının 10 token içermesi gerektiğini kontrol etmek

```typescript
it("Film incelemesi ekleniyor", async () => {
  const tokenAccount = await getAssociatedTokenAddress(
    mint,
    provider.wallet.publicKey,
  );

  const tx = await program.methods
    .addMovieReview(movie.title, movie.description, movie.rating)
    .accounts({
      tokenAccount: tokenAccount,
    })
    .rpc();

  const account = await program.account.movieAccountState.fetch(movie_pda);
  expect(account.title).to.equal(movie.title);
  expect(account.rating).to.equal(movie.rating);
  expect(account.description).to.equal(movie.description);
  expect(account.reviewer.toBase58()).to.equal(
    provider.wallet.publicKey.toBase58(),
  );

  const userAta = await getAccount(provider.connection, tokenAccount);
  expect(Number(userAta.amount)).to.equal((10 * 10) ^ 6);
});
```

Bundan sonra, ne `updateMovieReview` testi ne de `deleteMovieReview` testi için herhangi bir değişiklik gerekmiyor.

Bu noktada, `anchor test` komutunu çalıştırın ve aşağıdaki çıktıyı görmelisiniz:

```bash
anchor-movie-review-program
    ✔ Ödül tokenini başlatır (458ms)
    ✔ Film incelemesi ekleniyor (410ms)
    ✔ Film incelemesi güncelleniyor (402ms)
    ✔ Film incelemesi siliniyor (405ms)

  5 başarılı (2s)
```

---

Bu dersteki kavramlarla daha fazla zaman geçirmeye veya bir noktada takılmaya ihtiyacınız varsa, lütfen
[çözüme yönelik kod](https://github.com/Unboxed-Software/anchor-movie-review-program/tree/solution-add-tokens) bölümüne göz atın. Bu laboratuvarın çözümü `solution-add-tokens` dalındadır.

## Challenge

Bu derste öğrendiklerinizi CPIs ile uygulamak için, bunları Öğrenci Giriş programına nasıl dahil edebileceğinizi düşünün. Burada yaptığımız gibi benzer bir şey yapabilir ve kullanıcılar kendilerini tanıttığında onlara token basma işlevselliği ekleyebilirsiniz.

Bunu bağımsız olarak yapmaya çalışın! Ancak takılırsanız, bu [çözüm koduna](https://github.com/Unboxed-Software/anchor-student-intro-program/tree/cpi-challenge) başvurabilirsiniz. Kodunuz, uygulamanıza göre çözüm kodundan biraz farklı görünebilir.

:::success
**Laboratuvarı tamamladınız mı?**  
Kodunuzu GitHub'a yükleyin ve [bize bu ders hakkındaki düşüncelerinizi bildirin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=21375c76-b6f1-4fb6-8cc1-9ef151bc5b0a)!
:::