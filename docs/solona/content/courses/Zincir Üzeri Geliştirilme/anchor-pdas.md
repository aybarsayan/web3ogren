---
title: Anchor PDA'ları ve Hesapları
objectives:
  - init_if_needed kısıtlamasını etkinleştirin ve kullanın
  - seeds ve bump kısıtlamalarını kullanarak Anchor'daki PDA hesaplarıyla çalışın
  - Mevcut bir hesapta alanı yeniden tahsis etmek için realloc kısıtlamasını kullanın
  - Mevcut bir hesabı kapatmak için close kısıtlamasını kullanın
description:
  "Solana üzerinde, PDA'ları kullanarak key-value depolama gerçekleştirin."
---

## Özeti

- `seeds` ve `bump` kısıtlamaları, Anchor'daki PDA hesaplarını başlatmak ve doğrulamak için kullanılır.
- `init_if_needed` kısıtlaması, yeni bir hesabı koşullu olarak başlatmak için kullanılır.
- `realloc` kısıtlaması, mevcut bir hesapta alanı yeniden tahsis etmek için kullanılır.
- `close` kısıtlaması, bir hesabı kapatmak ve kiralama bedelini geri almak için kullanılır.

---

## Ders

Bu derste PDA'larla nasıl çalışılacağını, hesapları yeniden tahsis etmeyi ve Anchor'da hesapları kapatmayı öğreneceksiniz.

:::tip
**Not**: Anchor programlarının komut mantığını hesap doğrulamasından ayırdığını unutmayın.
:::

Hesap doğrulaması, bir komut için gereken hesapları listeleyen yapılar içinde gerçekleşir. Yapıdaki her alan bir hesabı temsil eder ve doğrulamayı `#[account(...)]` nitelik makrosunu kullanarak özelleştirebilirsiniz.

Hesapları doğrulamanın yanı sıra, bazı kısıtlamalar, aksi takdirde talimatlarımızdaki tekrarlayan kodları gerektiren görevleri otomatikleştirebilir. Bu ders, PDA'ları kolayca yönetmenize, alanı yeniden tahsis etmenize ve hesapları kapatmanıza yardımcı olmak için `seeds`, `bump`, `realloc` ve `close` kısıtlamalarını kaplayacaktır.

### Anchor ile PDA'lar

PDA'lar, onchain programcı tarafından belirtilen adreslerde, bir dizi seed, bir bump seed ve bir program kimliği kullanarak veri saklar.

Anchor, PDA'yı `seeds` ve `bump` kısıtlamaları ile doğrulamak için uygun bir yol sağlar.

```rust
#[derive(Accounts)]
struct ExampleAccounts {
  #[account(
    seeds = [b"example_seed"],
    bump
  )]
  pub pda_account: Account<'info, AccountType>,
}
```

Hesap doğrulaması sırasında, Anchor belirtilen seed'leri kullanarak bir PDA türetecek ve sağlanan hesabın türetilen PDA ile eşleşip eşleşmediğini kontrol edecektir.

> **Önemli**: `bump` kısıtlaması belirtilmeden dahil edilirse, Anchor, geçerli bir PDA üreten kanonik bump'ı kullanacaktır.

Genellikle, kanonik bump'ı kullanmalısınız. Yapı içindeki diğer alanları da seed olarak kullanabilirsiniz, örneğin imzalayanın genel anahtarı.

Eğer yapı için `#[instruction(...)]` nitelik makrosunu eklerseniz, serileştirilmiş talimat verilerine de atıfta bulunabilirsiniz.

Örneğin, aşağıdaki örnek, şunları içeren bir hesap listesi gösterir:

- `pda_account`
- `user`

`pda_account`, seed'lerin "example_seed" dizesi, `user`'ın genel anahtarı ve talimatın `instruction_data` olarak geçirdiği dize olması gerektiği şekilde kısıtlanmıştır.

```rust
#[derive(Accounts)]
#[instruction(instruction_data: String)]
pub struct Example<'info> {
    #[account(
        seeds = [
            b"example_seed",
            user.key().as_ref(),
            instruction_data.as_ref()
        ],
        bump
    )]
    pub pda_account: Account<'info, AccountType>,
    #[account(mut)]
    pub user: Signer<'info>
}
```

Eğer istemci tarafından sağlanan `pda_account` adresi, belirtilen seed'leri ve kanonik bump'ı kullanarak türetilen PDA ile eşleşmiyorsa, hesap doğrulaması başarısız olur.

#### `init` kısıtlaması ile PDA'ları kullanma

`seeds` ve `bump` kısıtlamalarını `init` kısıtlaması ile birleştirerek, bir hesabı bir PDA kullanarak başlatabilirsiniz.

`init` kısıtlaması, hesabın başlatılması için kimin ödeme yaptığı ve ne kadar alan ayrılacağını belirtmek için `payer` ve `space` kısıtlamaları ile birlikte kullanılmalıdır.

:::info
Ayrıca, yeni hesabın oluşturulması ve finanse edilmesi için `system_program`'ı dahil etmeniz gerekiyor.
:::

```rust
#[derive(Accounts)]
pub struct InitializePda<'info> {
    #[account(
        init,
        seeds = [b"example_seed", user.key().as_ref()],
        bump,
        payer = user,
        space = DISCRIMINATOR + AccountType::INIT_SPACE
    )]
    pub pda_account: Account<'info, AccountType>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct AccountType {
    pub data: u64,
}

const DISCRIMINATOR: usize = 8;
```

PDA dışındaki hesaplar için `init` kullanıldığında, Anchor başlatılan hesabın sahibini, şu anda talimatı yürüten program olarak varsayar.

Ancak, `seeds` ve `bump` ile birlikte `init` kullanırken, sahip _mutlaka_ yürütülen program olmalıdır. Bu, PDA için bir hesabı başlatmanın imzaya ihtiyacı olduğu anlamına gelir ve yalnızca yürütülen program bunu sağlayabilir.

#### Seed çıkarımı

Bazı programlar için bir komutun hesap listesi oldukça uzun hale gelebilir. Anchor programı talimatını çağırırken istemci tarafı deneyimini basit hale getirmek için **seed çıkarımını** açabiliriz.

Seed çıkarımı, PDA seed'leri hakkında IDL'ye bilgi ekleyerek Anchor'ın mevcut çağrı yeri bilgilerinden PDA seed'lerini çıkarmasını sağlar. Önceki örnekte, seed'ler `b"example_seed"` ve `user.key()`'dır. İlk değeri statik olduğu için bilinir, ikinci değer ise `user`'ın işlem imzalayıcısı olduğu için bilinir.

:::note
Programınızı oluştururken seed çıkarımını kullanıyorsanız, Anchor kullanarak programı çağırdığınız sürece, PDA'yı açıkça türetmenize veya geçirmenize gerek yoktur. Bunun yerine, Anchor kütüphanesi bunu sizin için yapacaktır.
:::

Seed çıkarımını `Anchor.toml` dosyasında `[features]` bölümünde `seeds = true` ile etkinleştirebilirsiniz.

```
[features]
seeds = true
```

#### `#[instruction(...)]` nitelik makrosunu kullanma

İleri gitmeden önce, `#[instruction(...)]` nitelik makrosuna kısaca bakalım. `#[instruction(...)]` kullandığınızda, listeye sağladığınız talimat verileri, talimat argümanlarıyla aynı sırada ve eşleşecek şekilde olmalıdır. Kullanılmayan argümanları listenin sonunda atlayabilirsiniz, ancak son kullanılacak olan argümana kadar tüm argümanları dahil etmelisiniz.

Örneğin, bir talimatın `input_one`, `input_two` ve `input_three` argümanlarına sahip olduğunu düşünün. Hesap kısıtlamalarınız `input_one` ve `input_three`'e başvurması gerekiyorsa, `#[instruction(...)]` nitelik makrosunda tüm üç argümanı listelemeniz gerekir.

Ancak, eğer kısıtlamalarınız sadece `input_one` ve `input_two`'ye başvuruyorsa, `input_three`'i atlayabilirsiniz.

```rust
pub fn example_instruction(
    ctx: Context<Example>,
    input_one: String,
    input_two: String,
    input_three: String,
) -> Result<()> {
    ...
    Ok(())
}

#[derive(Accounts)]
#[instruction(input_one:String, input_two:String)]
pub struct Example<'info> {
    ...
}
```

Ayrıca, girdileri yanlış sırada listelediğinizde bir hata alacaksınız:

```rust
#[derive(Accounts)]
#[instruction(input_two:String, input_one:String)]
pub struct Example<'info> {
    ...
}
```

### İhtiyaç olduğunda başlatma

Anchor, hesabın henüz başlatılmadığı durumda bir hesabı başlatmak için kullanılabilecek `init_if_needed` kısıtlaması sunar.

Bu özellik, onu kullanmaya niyetli olduğunuzu garanti etmek için bir özellik bayrağı ile korunur. Güvenlik nedenleriyle, bir talimatın birden fazla mantık yoluna dalmasından kaçınmak akıllıca olur.

:::warning
`init_if_needed` kullanırken, programınızı yeniden başlatma saldırılarına karşı gözetim altında tutmalısınız. Kodunuzda, başlatılmış bir hesabın ilk kez başlatıldıktan sonra başlangıç ayarlarına sıfırlanamayacağını kontrol eden kontroller eklemeniz gerekir.
:::

`init_if_needed` kullanmak için önce özelliği `Cargo.toml` dosyanızda etkinleştirmelisiniz.

```rust
[dependencies]
anchor-lang = { version = "0.30.1", features = ["init-if-needed"] }
```

Özelliği etkinleştirdikten sonra, kısıtlamayı `#[account(...)]` nitelik makrosunda dahil edebilirsiniz. Aşağıdaki örnek, mevcut bir token hesabı yoksa yeni bir ilişkili token hesabını başlatmak için `init_if_needed` kısıtlamasını kullanmayı göstermektedir.

```rust
#[program]
mod example {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}
```

Önceki örnekte `initialize` talimatı çağrıldığında, Anchor `token_account`'ın mevcut olup olmadığını kontrol edecek ve varsa başlatacaktır. Eğer zaten varsa, o zaman talimat, hesabı başlatmadan devam edecektir. `init` kısıtlamasında olduğu gibi, `init_if_needed`'i `seeds` ve `bump` ile bir arada kullanabilirsiniz eğer hesap bir PDA ise.

### Yeniden tahsis

`realloc` kısıtlaması, mevcut hesaplar için alanı yeniden tahsis etmenin basit bir yolunu sağlar.

`realloc` kısıtlaması, aşağıdaki kısıtlamalarla birlikte kullanılmalıdır:

- `mut` - hesap değiştirilebilir olarak ayarlanmalıdır
- `realloc::payer` - yeniden tahsisatın hesabın alanını arttırıp azaltmasına bağlı olarak, çıkarılacak veya eklenecek lamportları belirten hesap
- `realloc::zero` - yeni belleğin sıfıra başlatılıp başlatılmayacağını belirten boolean

`init` ile olduğu gibi, `realloc` kullanırken `system_program`'ın hesap doğrulama yapısında hesaplardan biri olarak dahil edilmesi gerekmektedir.

Aşağıda `String` türünde bir `data` alanını saklayan bir hesap için alanı yeniden tahsis etmenin bir örneği bulunmaktadır.

```rust
#[derive(Accounts)]
#[instruction(instruction_data: String)]
pub struct ReallocExample<'info> {
    #[account(
        mut,
        seeds = [b"example_seed", user.key().as_ref()],
        bump,
        realloc = DISCRIMINATOR + STRING_SIZE_SPACE + instruction_data.len(),
        realloc::payer = user,
        realloc::zero = false,
    )]
    pub pda_account: Account<'info, AccountType>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct AccountType {
    pub data: String,
}

const DISCRIMINATOR: usize = 8;
const STRING_SIZE_SPACE: usize = 4;
```

Yukarıdaki örnekteki `realloc` kısıtlaması şu şekilde açıklanabilir:

- `DISCRIMINATOR` değeri `8`
- `STRING_SIZE_SPACE` değeri, dize uzunluğunu saklamak için gerekli alan için `4`. BORSH serileştirmesi ile gerekmiştir.
- `instruction_data.len()` ise dizenin kendisinin uzunluğudur.

:::quote
> [BORSH](https://solanacookbook.com/guides/serialization.html) _Binary Object Representation Serializer for Hashing_ anlamına gelir ve veri yapılarının etkin ve kompakt bir şekilde serileştirilmesi ve serileştirilmesi için kullanılır.
:::

Hesap veri uzunluğundaki değişiklik artırıcıysa, lamportlar `realloc::payer`dan, kira harçları için muafiyetin korunması amacıyla hesaba geçecektir. Eğer değişiklik azaltıcıysa, lamportlar hesaptan geri `realloc::payer`a aktarılacaktır.

`realloc::zero` kısıtlaması, yeniden tahsis sırasında tahsis edilen yeni belleğin sıfıra ayarlanmasını garanti eder. Eğer bir hesabın belleğin sıklıkla boyut değiştirmesini bekliyorsanız, bunu true olarak ayarlamalısınız. Bu şekilde, aksi takdirde kalan eski veriyi temizlersiniz.

### Kapatma

`close` kısıtlaması, mevcut bir hesabı kapatmanın basit ve güvenli bir yolunu sağlar.

`close` kısıtlaması, hesabı talimatın yürütülmesinin sonunda kapalı olarak işaretleyerek, ayrıcı değerini _CLOSED_ACCOUNT_DISCRIMINATOR_ olarak ayarlar ve lamportlarını belirtilen bir hesaba gönderir.

:::danger
> Bu özel değer, hesabın yeniden açılmasını önler çünkü bir hesabı yeniden başlatmaya girişim, ayrıcı kontrolünü geçmez.
:::

Aşağıdaki örnek, `close` kısıtlamasını kullanarak `data_account`'ı kapatır ve kira için ayrılan lamportları `receiver` hesabına gönderir.

```rust
pub fn close(ctx: Context<Close>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut, close = receiver)]
    pub data_account: Account<'info, AccountType>,
    #[account(mut)]
    pub receiver: Signer<'info>
}
```

---

## Laboratuvar

Bu derste ele aldığımız kavramları pekiştirmek için Anchor çerçevesini kullanarak bir Film İnceleme programı oluşturalım.

Bu program, kullanıcılara:

- İnceleme saklamak için yeni bir film inceleme hesabı başlatmak için PDA kullanma
- Mevcut bir film inceleme hesabının içeriğini güncelleme
- Mevcut bir film inceleme hesabını kapatma

### Yeni bir Anchor projesi oluşturma

Başlamak için `anchor init` kullanarak yeni bir proje oluşturalım.

```bash
anchor init anchor-movie-review-program
```

Sonrasında `programs` klasörü içindeki `lib.rs` dosyasına gidin ve aşağıdaki başlangıç kodunu görmelisiniz.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod anchor_movie_review_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```

`initialize` talimatını ve `Initialize` tipini kaldırın.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod anchor_movie_review_program {
    use super::*;

}
```

### MovieAccountState

Öncelikle `#[account]` nitelik makrosunu kullanarak `MovieAccountState`'i tanımlayalım. Bu, film inceleme hesaplarının veri yapısını temsil edecektir. Hatırlatmak gerekirse, `#[account]` nitelik makrosu, hesabın serileştirilmesi ve serileştirilmesi konusunda yardımcı olan çeşitli niteliklerin uygulanmasını sağlar, hesabın ayırıcı değerini ayarlar ve yeni bir hesabın sahipliğini `declare_id!` makrosunda tanımlanan program kimliğine atar.

Her bir film inceleme hesabında, şunları saklayacağız:

- `reviewer` - incelemeyi oluşturan kullanıcı
- `rating` - filmin derecelendirmesi
- `title` - filmin başlığı
- `description` - inceleme içeriği

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod anchor_movie_review_program {
    use super::*;

}

#[account]
#[derive(InitSpace)]
pub struct MovieAccountState {
    pub reviewer: Pubkey,    // 32
    pub rating: u8,          // 1
    #[max_len(20)]
    pub title: String,       // 4 + len()
    #[max_len(50)]
    pub description: String, // 4 + len()
}

const DISCRIMINATOR: usize = 8;
```

`#[derive(InitSpace)]` makrosunu `AccountStruct` üzerinde kullanmak, alanlar için gereken `INIT_SPACE` sabitini otomatik olarak hesaplar; bu sabit, hesap alanlarının sabit boyutlu alanlarının yanı sıra uzunluk ön ekli dizeleri de dahil olmak üzere gerekli alanı temsil eder.

Dize gibi dinamik alanlar için, `#[max_len]` makrosunu kullanarak bu alanların maksimum uzunluğunu belirleyebiliriz, böylece hesap başlatılırken gereken alanı belirleyebiliriz. Burada, `title` dizisinin maksimum uzunluğunun 20, `description` dizisinin ise maksimum uzunluğunun 50 olduğunu seçtik.

### Özel hata kodları

Uygulama sırasında bazı kontroller yapacak ve bu kontroller başarılı olmadığında özel hatalar fırlatacağız.

Bunun için, farklı türde hatalar ile ilişkilendirilmiş hata mesajlarını içeren bir enum oluşturalım:

```rust
#[error_code]
enum MovieReviewError {
    #[msg("Rating must be between 1 and 5")]
    InvalidRating,
    #[msg("Movie Title too long")]
    TitleTooLong,
    #[msg("Movie Description too long")]
    DescriptionTooLong,
}
```

`#[error_code]` makrosu, talimat işleyicilerimizden dönüş türü olarak kullanılacak hata türlerini oluşturacaktır.

Şimdilik özel hatalar hakkında çok endişelenmeyin, çünkü bunlar bir sonraki bölümde daha ayrıntılı bir şekilde ele alınacaktır.

### Film İncelemesi Ekle

Sonraki adım, `add_movie_review` talimatını uygulamak olsun. `add_movie_review` talimatı, kısa süre içinde uygulayacağımız `AddMovieReview` türünden bir `Context` gerektirecektir.

Bu talimat, bir inceleyen tarafından sağlanan ek talimat verileri olarak üç ek argümanı gerektirecektir:

- `title` - bir `String` olarak filmin başlığı
- `description` - bir `String` olarak inceleme detayları
- `rating` - filmin derecelendirmesi olarak bir `u8`

Talimat mantığı içinde, yeni `movie_review` hesabının verilerini talimat verileri ile dolduracağız. Ayrıca `reviewer` alanını talimat bağlamından `initializer` hesabi olarak ayarlayacağız.

Ayrıca, `require!` makrosunu kullanarak aşağıdaki koşulların yerine getirildiğinden emin olacağız:

- Derecelendirme 1 ile 5 arasında olmalıdır
- Başlık 20 karakterden uzun olmamalıdır
- Açıklama 50 karakterden uzun olmamalıdır

`require!` makrosu, bir kontrol gerçekleştirir ve bu kontrol başarılı olmadığında özel bir hata fırlatır.

```rust
const MIN_RATING: u8 = 1;
const MAX_RATING: u8 = 5;
const MAX_TITLE_LENGTH: usize = 20;
const MAX_DESCRIPTION_LENGTH: usize = 50;

#[program]
pub mod anchor_movie_review_program {
    use super::*;

    pub fn add_movie_review(
        ctx: Context<AddMovieReview>,
        title: String,
        description: String,
        rating: u8,
    ) -> Result<()> {
        // Derecelendirmenin 1 ile 5 arasında olmasını sağlıyoruz
        require!(rating >= MIN_RATING && rating <= MAX_RATING, MovieReviewError::InvalidRating);

        // Başlığın 20 karakterden uzun olmamasını sağlıyoruz
        require!(title.len() <= MAX_TITLE_LENGTH, MovieReviewError::TitleTooLong);

        // Açıklamanın 50 karakterden uzun olmamasını sağlıyoruz
        require!(description.len() <= MAX_DESCRIPTION_LENGTH, MovieReviewError::DescriptionTooLong);

        msg!("Film İnceleme Hesabı Oluşturuldu");
        msg!("Başlık: {}", title);
        msg!("Açıklama: {}", description);
        msg!("Derecelendirme: {}", rating);

        let movie_review = &mut ctx.accounts.movie_review;
        movie_review.reviewer = ctx.accounts.initializer.key();
        movie_review.title = title;
        movie_review.rating = rating;
        movie_review.description = description;
        Ok(())
    }
}
```

Sonraki adım, talimat bağlamında kullanılan tür için `AddMovieReview` yapısını oluşturmaktır. Bu yapı, `add_movie_review` talimatının gerektirdiği hesapları listeleyecektir.

Şunları kullanmanız gerekebilir:

- `#[derive(Accounts)]` makrosu, yapı içinde belirtilen hesapların listesini seri hale getirmek ve doğrulamak için kullanılır.
- `#[instruction(...)]` nitelik makrosu, talimat verilerini talimata erişmek için kullanılır.
- `#[account(...)]` nitelik makrosu, hesaplar üzerinde ek kısıtlamaları belirtir.

`movie_review` hesabı, başlatılması gereken bir PDA olduğundan, `init` kısıtlamasının yanı sıra `seeds` ve `bump` kısıtlamalarını da ekleyeceğiz. 

PDA seed'leri için film başlığını ve inceleyeninin genel anahtarını kullanacağız. Başlatım için ödeyici, inceleyici olmalı ve hesapta ayrılması gereken alan, hesap ayrıcı, inceleyenin genel anahtarı ve film incelemesi için yeterli olmalıdır.

```rust
#[derive(Accounts)]
#[instruction(title:String)]
pub struct AddMovieReview<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = DISCRIMINATOR + MovieAccountState::INIT_SPACE
    )]
    pub movie_review: Account<'info, MovieAccountState>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

### Film Değerlendirmesini Güncelle

Şimdi, `UpdateMovieReview` türünde bir bağlam ile `update_movie_review` talimatını uygulayalım.

Daha önce olduğu gibi, talimatın bir değerlendiren tarafından sağlanan üç ek argüman gerektireceğini unutmayın:

- `title` - filmin başlığı
- `description` - inceleme detayları
- `rating` - film için puanlama

Talimat mantığı içinde, `movie_review` hesabında saklanan `rating` ve `description`'ı güncelleyeceğiz.

`title`, talimat işlevinin kendisinde kullanılmasa da, bir sonraki adımda `movie_review` hesap doğrulaması için ihtiyaç duyacağız.

```rust
#[program]
pub mod anchor_movie_review_program {
    use super::*;

		...

    pub fn update_movie_review(
        ctx: Context,
        title: String,
        description: String,
        rating: u8,
    ) -> Result {

        // Puanın 1 ile 5 arasında olmasını sağlıyoruz
        require!(rating >= MIN_RATING && rating  {
    #[account(
        mut,
        seeds = [title.as_bytes(), initializer.key().as_ref()],
        bump,
        realloc = DISCRIMINATOR + MovieAccountState::INIT_SPACE,
        realloc::payer = initializer,
        realloc::zero = true,
    )]
    pub movie_review: Account,
    #[account(mut)]
    pub initializer: Signer,
    pub system_program: Program,
}
```

:::warning
`realloc` kısıtlamasının, `description` değerinin güncellenmesine bağlı olarak `movie_review` hesabının gereksinim duyduğu yeni alanı ayarladığını unutmayın.
:::

Ayrıca, `realloc::payer` kısıtlaması, ek lamportların gereksinim duyulduğunda veya iade edildiğinde `initializer` hesabından alınacağını veya bu hesaba gönderileceğini belirtir.

Son olarak, `movie_review` hesabının tahsis edilen alanını değiştirebileceğinden, `realloc::zero` kısıtlamasını `true` olarak ayarlıyoruz.

---

### Film Değerlendirmesini Sil

Son olarak, mevcut bir `movie_review` hesabını kapatmak için `delete_movie_review` talimatını uygulayalım.

`DeleteMovieReview` türünde bir bağlam kullanacağız ve herhangi bir ek talimat verisi eklemeyecek. Sadece bir hesabı kapattığımız için, aslında işlevin gövdesinde herhangi bir talimat mantığına ihtiyacımız yok. Kapatma işlemi, `DeleteMovieReview` türündeki Anchor kısıtlaması tarafından halledilecektir.

```rust
#[program]
pub mod anchor_movie_review_program {
    use super::*;

		...

    pub fn delete_movie_review(_ctx: Context, title: String) -> Result {
        msg!("{} için film değerlendirmesi silindi", title);
        Ok(())
    }

}
```

:::note
Sonraki adımda `DeleteMovieReview` yapısını uygulayalım.
:::

```rust
#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteMovieReview {
    #[account(
        mut,
        seeds=[title.as_bytes(), initializer.key().as_ref()],
        bump,
        close=initializer
    )]
    pub movie_review: Account,
    #[account(mut)]
    pub initializer: Signer,
    pub system_program: Program
}
```

Burada, `movie_review` hesabını kapatıldığımızı ve kiralamanın `initializer` hesabına iade edilmesi gerektiğini belirtmek için `close` kısıtlamasını kullanıyoruz. Ayrıca, `movie_review` hesabı için doğrulama amaçlı `seeds` ve `bump` kısıtlamalarını da ekliyoruz. Anchor, hesabı güvenli bir şekilde kapatmak için gereken ek mantığı otomatik olarak yönetir.

---

### Test

Program hazır duruma geldi! Şimdi test edelim. `anchor-movie-review-program.ts` dosyasına gidin ve varsayılan test kodunu aşağıdaki ile değiştirin.

Burada:

- Film değerlendirme talimat verileri için varsayılan değerler oluşturuyoruz
- Film değerlendirme hesabı PDA'sını türetiyoruz
- Testler için yer tutucular oluşturuyoruz

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";

describe("anchor-movie-review-program", () => {
  // İstemcinin yerel kümeyi kullanmasını ayarlayın.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorMovieReviewProgram as Program;

  const movie = {
    title: "Sadece bir test filmi",
    description: "Vay canına, gerçekten harika bir filmdi",
    rating: 5,
  };

  const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId,
  );

  it("Film değerlendirmesi eklendi`", async () => {});

  it("Film değerlendirmesi güncellendi`", async () => {});

  it("Film değerlendirmesini siler", async () => {});
});
```

:::tip
Not edin ki `.accounts` eklemiyoruz. Bunun nedeni, `AnchorProvider`'dan gelen `Wallet`'in otomatik olarak imzalayıcı olarak dahil edilmesi, Anchor'un `SystemProgram` gibi belirli hesapları çıkarsayabilmesi ve Anchor'un talimat argümanı olan `title` ve imzalayıcının genel anahtarından `movieReview` PDA'sını çıkarsayabilmesidir.
:::


<summary>Gizli not: `Anchor.toml` dosyasında `seeds = true` ile tohum çıkarmayı açmayı unutmayın.</summary>
Dikkate almanız gereken önemli bir ayrıntıdır!


Talimat çalıştıktan sonra, `movieReview` hesabını alıyoruz ve bu hesapta saklanan verilerin beklenen değerlerle eşleşip eşleşmediğini kontrol ediyoruz.

```typescript
it("Film değerlendirmesi eklendi`", async () => {
  // Testinizi burada ekleyin.
  const tx = await program.methods
    .addMovieReview(movie.title, movie.description, movie.rating)
    .rpc();

  const account = await program.account.movieAccountState.fetch(moviePda);
  expect(movie.title === account.title);
  expect(movie.rating === account.rating);
  expect(movie.description === account.description);
  expect(account.reviewer === provider.wallet.publicKey);
});
```

:::tip
Şimdi, daha önceki süreçle aynı süreci takip ederek `updateMovieReview` talimatı için testi oluşturalım.
:::

```typescript
it("Film değerlendirmesi güncellendi`", async () => {
  const newDescription = "Vay bu yeni";
  const newRating = 4;

  const tx = await program.methods
    .updateMovieReview(movie.title, newDescription, newRating)
    .rpc();

  const account = await program.account.movieAccountState.fetch(moviePda);
  expect(movie.title === account.title);
  expect(newRating === account.rating);
  expect(newDescription === account.description);
  expect(account.reviewer === provider.wallet.publicKey);
});
```

{% raw %}
```typescript
it("Film değerlendirmesini siler", async () => {
  const tx = await program.methods.deleteMovieReview(movie.title).rpc();
});
```  
{% endraw %}

Son olarak, `anchor test` çalıştırın ve konsolda aşağıdaki çıktıyı görmelisiniz.

```bash
  anchor-movie-review-program
    ✔ Film değerlendirmesi eklendi` (139ms)
    ✔ Film değerlendirmesi güncellendi` (404ms)
    ✔ Film değerlendirmesini siler (403ms)

  3 geçerli (950ms)
```

Bu projede bu kavramlarla rahat hissetmeniz için daha fazla zaman ayırmanız gerekiyorsa, devam etmeden önce
[çözüm koduna](https://github.com/Unboxed-Software/anchor-movie-review-program/tree/solution-pdas) göz atabilirsiniz.

## Zorluk

Artık bağımsız olarak bir şeyler inşa etme sırası sizde. Bu derste tanıtılan kavramlarla donanmış olarak, daha önce kullandığımız Öğrenci Tanıtım programını Anchor çerçevesini kullanarak yeniden oluşturmaya çalışın.

Öğrenci Tanıtım programı, öğrencilerin kendilerini tanıttığı bir Solana Programıdır. Program, bir kullanıcının adını ve kısa bir mesajı talimat verisi olarak alır ve verileri on-chain olarak saklamak için bir hesap oluşturur.

Bu derste öğrendiklerinizi kullanarak bu programı inşa edin. Program, aşağıdaki talimatları içermelidir:

1. Öğrenci adını ve kısa mesajını saklayan her öğrenci için bir PDA hesabı başlatın.
2. Mevcut bir hesapta mesajı güncelleyin.
3. Mevcut bir hesabı kapatın.

Bu bağımsız olarak yapmaya çalışın! Ama eğer sıkıştıysanız, 
[çözüm koduna](https://github.com/Unboxed-Software/anchor-student-intro-program) başvurabilirsiniz.
