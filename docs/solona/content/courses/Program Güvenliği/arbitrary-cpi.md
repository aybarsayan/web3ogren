---
title: Keyfiye CPI
objectives:
  - Bilinmeyen bir programa CPI çağırmanın güvenlik risklerini açıklamak
  - Anchor'ın CPI modülünün bir Anchor programından diğerine CPI yapılırken bu durumu nasıl önlediğini göstermek
  - Güvenli bir şekilde bir Anchor programından rastgele bir non-anchor programa CPI yapmak
description: "Diğer Solana programlarından Solana programlarını güvenli bir şekilde nasıl çağıracağınız."
---

## Özet

- Bir CPI oluşturmak için hedef program, çağırma talimatı işleyicisine bir hesap olarak geçirilmelidir. Bu, **herhangi bir** hedef programın talimat işleyicisine geçirilebileceği anlamına gelir. Programınız, hatalı veya beklenmedik programları kontrol etmelidir.
- Yerel programlarda, geçilen programın genel anahtarını beklediğiniz programla basitçe karşılaştırarak kontrol edin.
- Bir program Anchor ile yazılmışsa, bu programın kamuya açık bir CPI modülü olabilir. Bu, başka bir Anchor programından programı çağırmayı basit ve güvenli hale getirir. Anchor CPI modülü, geçirilen programın adresinin modülde saklanan programın adresiyle eşleştiğini otomatik olarak kontrol eder.

---

## Ders

Bir çapraz program çağrısı (CPI), bir programın başka bir programda bir talimat işleyicisini çağırmasıdır. "Rastgele CPI", bir programın, belirli bir programa yönelik bir CPI gerçekleştirmekten ziyade, talimat işleyicisine geçirilen herhangi bir programa CPI vermek üzere yapılandırıldığı anlamına gelir. Programınızın talimat işleyicisinin çağrıcıları, talimatların hesaplar listesine istedikleri **herhangi bir programı** geçirebileceğinden, geçirilen bir programın adresini doğrulamamak, programınızın rastgele programlara CPI'ler gerçekleştirmesine neden olur.

:::tip
Unutmayın, program kontrollerinin eksikliği kötü niyetli kullanıcılar için fırsatlar yaratabilir.
:::

Bu program kontrol eksikliği, kötü niyetli bir kullanıcının beklenmeyen bir programı geçirebileceği bir fırsat yaratır, bu da orijinal programın bu gizemli programa bir talimat işleyicisini çağırmasına neden olur. Bu CPI'nin sonuçlarının ne olacağını söylemek imkânsızdır. Bu, hem orijinal programın hem de beklenmedik programın mantığına, ayrıca orijinal talimat işleyicisine geçirilen diğer hesapların ne olduğuna bağlıdır.

### Eksik Program Kontrolleri

Aşağıdaki programı bir örnek olarak alın. `cpi` talimat işleyicisi `token_program` üzerinde `transfer` talimat işleyicisini çağırıyor, ancak `token_program`ın talimat işleyicisine geçirilen hesap olup olmadığını kontrol eden bir kod yok.

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod arbitrary_cpi_insecure {
    use super::*;

    pub fn cpi(ctx: Context<Cpi>, amount: u64) -> ProgramResult {
        solana_program::program::invoke(
            &spl_token::instruction::transfer(
                ctx.accounts.token_program.key,
                ctx.accounts.source.key,
                ctx.accounts.destination.key,
                ctx.accounts.authority.key,
                &[],
                amount,
            )?,
            &[
                ctx.accounts.source.clone(),
                ctx.accounts.destination.clone(),
                ctx.accounts.authority.clone(),
            ],
        )
    }
}

#[derive(Accounts)]
pub struct Cpi<'info> {
    source: UncheckedAccount<'info>,
    destination: UncheckedAccount<'info>,
    authority: UncheckedAccount<'info>,
    token_program: UncheckedAccount<'info>,
}
```

Bir saldırgan, bu talimat işleyicisini kolayca çağırabilir ve kontrol ettiği bir kopya token programını geçirebilir.

### Program Kontrollerini Ekle

Bu zafiyeti düzeltmek için, `token_program`ın genel anahtarının SPL Token Programı olup olmadığını kontrol etmek üzere `cpi` talimat işleyicisine birkaç satır eklemek mümkündür.

```rust
pub fn cpi_secure(ctx: Context<Cpi>, amount: u64) -> ProgramResult {
    if &spl_token::ID != ctx.accounts.token_program.key {
        return Err(ProgramError::IncorrectProgramId);
    }
    solana_program::program::invoke(
        &spl_token::instruction::transfer(
            ctx.accounts.token_program.key,
            ctx.accounts.source.key,
            ctx.accounts.destination.key,
            ctx.accounts.authority.key,
            &[],
            amount,
        )?,
        &[
            ctx.accounts.source.clone(),
            ctx.accounts.destination.clone(),
            ctx.accounts.authority.clone(),
        ],
    )
}
```

:::warning
Artık, bir saldırgan farklı bir token programı geçirirse, talimat işleyici `ProgramError::IncorrectProgramId` hatasını döndürecektir.
:::

CPI ile çağırdığınız programın program kimliğinin adresini sabit kodlayabilir veya kullanılabilir ise programın Rust kütüphanesini kullanarak programın adresini alabilirsiniz. Yukarıdaki örnekte, `spl_token` kütüphanesi SPL Token Programı'nın adresini sağlar.

### Anchor CPI Modülünü Kullan

Program kontrollerini yönetmenin daha basit bir yolu, [Anchor CPI](https://book.anchor-lang.com/anchor_in_depth/CPIs.html) modülünü kullanmaktır. Daha önceki `Anchor CPI dersi` boyunca, Anchor'ın programların CPI'lerini daha basit hale getirmek için otomatik olarak CPI modülleri oluşturduğunu öğrendik. Bu modüller ayrıca, bir kamu talimatına geçirilen programın genel anahtarını doğrulayarak güvenliği artırır.

Her Anchor programı, programın adresini tanımlamak için `declare_id()` makrosunu kullanır. Belirli bir program için bir CPI modülü oluşturulduğunda, bu makroya geçirilen adres "kesin bilgi kaynağı" olarak kullanılır ve otomatik olarak, CPI modülünü kullanan tüm CPI'lerin bu program kimliğini hedeflemesini doğrular.

Temelde manuel program kontrollerinden farklı olmamakla birlikte, CPI modüllerini kullanmak, bir program kontrolünü gerçekleştirmeyi unutmamak veya sabit kodlama sırasında yanlış program kimliğini yazma olasılığını ortadan kaldırır.

### Kullanım Örneği

Aşağıdaki program, SPL Token Programı için, önceki örneklerde gösterilen transfer işlemini gerçekleştirmek üzere bir CPI modülünün kullanımına bir örnek gösterir.

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod arbitrary_cpi_recommended {
    use super::*;

    pub fn cpi(ctx: Context<Cpi>, amount: u64) -> ProgramResult {
        token::transfer(ctx.accounts.transfer_ctx(), amount)
    }
}

#[derive(Accounts)]
pub struct Cpi<'info> {
    source: Account<'info, TokenAccount>,
    destination: Account<'info, TokenAccount>,
    authority: Signer<'info>,
    token_program: Program<'info, Token>,
}

impl<'info> Cpi<'info> {
    pub fn transfer_ctx(&self) -> CpiContext<'_, '_, '_, 'info, token::Transfer<'info>> {
        let program = self.token_program.to_account_info();
        let accounts = token::Transfer {
            from: self.source.to_account_info(),
            to: self.destination.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        CpiContext::new(program, accounts)
    }
}
```


Ek Bilgi

Yukarıdaki örnekte olduğu gibi, Anchor, CPI'leri onlarla çalışıyormuş gibi çıkarmanızı sağlayan birkaç
[popüler yerel program için sarmalayıcılar oluşturdu](https://github.com/coral-xyz/anchor/tree/master/spl/src).

Ayrıca, CPI yaptığınız program türüne bağlı olarak, belki de Anchor'ın
[`Program` hesap türünü](https://docs.rs/anchor-lang/latest/anchor_lang/accounts/program/struct.Program.html)
kullanarak hesap doğrulama yapabilirsiniz. Hem [`anchor_lang`](https://docs.rs/anchor-lang/latest/anchor_lang) hem de [`anchor_spl`](https://docs.rs/anchor_spl/latest/) kütüphanelerinde, kutudan gelen aşağıdaki `Program` türleri sağlanır:

- [`System`](https://docs.rs/anchor-lang/latest/anchor_lang/system_program/struct.System.html)
- [`AssociatedToken`](https://docs.rs/anchor-spl/latest/anchor_spl/associated_token/struct.AssociatedToken.html)
- [`Token`](https://docs.rs/anchor-spl/latest/anchor_spl/token/struct.Token.html)

Bir Anchor programının CPI modülüne erişiminiz varsa, genellikle programın türünü aşağıdaki gibi içe aktarabilirsiniz; program adını gerçek programın adıyla değiştirmeyi unutmayın:

```rust
use other_program::program::OtherProgram;
```


## Laboratuvar

CPI'ler için kullandığınız programla kontroller yapmanın önemini göstermek için, basitleştirilmiş ve biraz kurgusal bir oyun üzerinde çalışacağız. Bu oyun, PDA hesaplarıyla karakterleri temsil eder ve karakterlerin sağlık ve güç gibi meta verilerini ve özelliklerini yönetmek için ayrı bir "meta veri" programı kullanır.

:::note
Bu örnek biraz kurgusal olsa da, aslında Solana'daki NFT'lerin nasıl çalıştığına çok benzer bir mimariye sahiptir: SPL Token Programı token minlerini, dağıtımını ve transferlerini yönetir ve ayrı bir meta veri programı token'lara meta verileri atamak için kullanılır. Bu yüzden burada geçirdiğimiz zafiyet, gerçek token'lara da uygulanabilir.
:::

### 1. Kurulum

Bu depo için
[`starter` dalı](https://github.com/solana-developers/arbitrary-cpi/tree/starter) ile başlayacağız.
Depoyu klonlayın ve ardından `starter` dalında açın.

Üç program olduğunu göreceksiniz:

1. `gameplay`
2. `character-metadata`
3. `fake-metadata`

İlk program, `gameplay`, doğrudan testimizin kullandığı programdır. Programa göz atın. İki talimatı vardır:

1. `create_character_insecure` - yeni bir karakter oluşturur ve meta veri programına karakterin başlangıç özelliklerini kurmak için CPI yapar
2. `battle_insecure` - iki karakteri birbirine karşı karşıya getirir ve en yüksek özelliklere sahip karaktere "zafer" atar

**İpucu**: Geçerli bir program kimliği doğruladığınızdan emin olun. Bu, programınızın güvenliğini artırmak için önemlidir.

İkinci program `character-metadata`, karakter meta verilerini işlemek için "onaylı" program olarak tasarlanmıştır. Bu programa göz atın. Yeni bir PDA oluşturan `create_metadata` için tek bir talimat işleyicisi vardır ve karakterin sağlık ve gücü için 0 ile 20 arasında bir değeri rastgele atar.

Son program `fake-metadata`, `gameplay` programını kötüye kullanmak için bir saldırganın oluşturabileceği "sahte" bir meta veri programıdır. Bu program, `character-metadata` programına neredeyse tamamen benzerdir; tek fark, karakterin başlangıç sağlık ve gücünü maksimum izin verilen değer olan 255 olarak ayarlamasıdır.

### 2. `create_character_insecure` Talimat İşleyicisini Test Et

Bunun için `tests` dizininde zaten bir test var. Uzun ama birlikte incelemeden önce bir dakikanızı ayırın:

```typescript
it("Güvensiz talimatlar saldırganın her seferinde başarıyla kazanmasına izin veriyor", async () => {
  try {
    // Gerçek meta veri programı ile oyuncu birini başlat
    await gameplayProgram.methods
      .createCharacterInsecure()
      .accounts({
        metadataProgram: metadataProgram.programId,
        authority: playerOne.publicKey,
      })
      .signers([playerOne])
      .rpc();

    // Saldırganı sahte meta veri programı ile başlat
    await gameplayProgram.methods
      .createCharacterInsecure()
      .accounts({
        metadataProgram: fakeMetadataProgram.programId,
        authority: attacker.publicKey,
      })
      .signers([attacker])
      .rpc();

    // Her iki oyuncunun meta veri hesaplarını al
    const [playerOneMetadataKey] = getMetadataKey(
      playerOne.publicKey,
      gameplayProgram.programId,
      metadataProgram.programId,
    );

    const [attackerMetadataKey] = getMetadataKey(
      attacker.publicKey,
      gameplayProgram.programId,
      fakeMetadataProgram.programId,
    );

    const playerOneMetadata =
      await metadataProgram.account.metadata.fetch(playerOneMetadataKey);

    const attackerMetadata =
      await fakeMetadataProgram.account.metadata.fetch(attackerMetadataKey);
    // Normal oyuncunun sağlık ve gücü 0 ile 20 arasında olmalı
    expect(playerOneMetadata.health).to.be.lessThan(20);
    expect(playerOneMetadata.power).to.be.lessThan(20);

    // Saldırganın sağlık ve gücü 255 olacak
    expect(attackerMetadata.health).to.equal(255);
    expect(attackerMetadata.power).to.equal(255);
  } catch (error) {
    console.error("Test hatalı:", error);
    throw error;
  }
});
```

:::info
Bu test, normal bir oyuncu ve bir saldırganın her ikisinin de karakterlerini nasıl oluşturduğunu gösteriyor. Sadece saldırgan, sahte meta veri programının program kimliğini geçiriyor, bu da `create_character_insecure` talimatının program kontrollerine sahip olmaması nedeniyle çalışmasına fırsat tanıyor.
:::

Sonuç olarak, normal karakter uygun sağlık ve güç değerlerine sahip: her biri 0 ile 20 arasında bir değer. Ancak saldırganın sağlık ve gücü her biri 255, bu da saldırganı yenilmez kılıyor.

Henüz yapmadıysanız, `anchor test` komutunu çalıştırın ve bu testin gerçekten tanımlandığı gibi davrandığını görün.

### 3. `create_character_secure` Talimat İşleyicisini Oluştur

Bunu, yeni bir karakter oluşturmak için güvenli bir talimat işleyicisi oluşturarak düzeltelim. Bu talimat işleyicisi, **uygun program kontrollerini** uygulamalı ve CPI'yi yapmak için `character-metadata` programının `cpi` kütüphanesini kullanmalıdır; sadece `invoke` kullanmamalıdır.

Kendi yeteneklerinizi test etmek isterseniz, devam etmeden önce bunu kendiniz deneyin.

Öncelikle, `gameplay` programının `lib.rs` dosyasının en üstünde `use` ifademizi güncelleyelim. Hesap doğrulama için program türüne ve `create_metadata` CPI'sini gerçekleştirmek için yardımcı işleve erişim sağlayacağız.

```rust
use character_metadata::{
    cpi::accounts::CreateMetadata,
    cpi::create_metadata,
    program::CharacterMetadata,
};
```

Ardından, `CreateCharacterSecure` adında yeni bir hesap doğrulama yapısı oluşturalım. Bu sefer, `metadata_program` bir `Program` türü oluyor:

```rust
#[derive(Accounts)]
pub struct CreateCharacterSecure<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = DISCRIMINATOR_SIZE + Character::INIT_SPACE,
        seeds = [authority.key().as_ref()],
        bump
    )]
    pub character: Account<'info, Character>,
    #[account(
        mut,
        seeds = [character.key().as_ref()],
        seeds::program = metadata_program.key(),
        bump,
    )]
    /// CHECK: Bu hesap anchor tarafından kontrol edilmeyecek
    pub metadata_account: AccountInfo<'info>,
    pub metadata_program: Program<'info, CharacterMetadata>,
    pub system_program: Program<'info, System>,
}
```

Son olarak, `create_character_secure` talimat işleyicisini ekleyelim. Daha önceki ile aynı olacak, ancak artık doğrudan `invoke` yerine Anchor CPIs'in tam işlevselliğini kullanacak:

```rust
pub fn create_character_secure(ctx: Context<CreateCharacterSecure>) -> Result<()> {
    // Karakter verilerini başlat
    let character = &mut ctx.accounts.character;
    character.metadata = ctx.accounts.metadata_account.key();
    character.authority = ctx.accounts.authority.key();
    character.wins = 0;

    // CPI bağlamını hazırla
    let cpi_context = CpiContext::new(
        ctx.accounts.metadata_program.to_account_info(),
        CreateMetadata {
            character: ctx.accounts.character.to_account_info(),
            metadata: ctx.accounts.metadata_account.to_owned(),
            authority: ctx.accounts.authority.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        },
    );

    // Meta verileri oluşturmak için CPI'yi gerçekleştir
    create_metadata(cpi_context)?;

    Ok(())
}
```

### 4. `create_character_secure` Talimat İşleyicisini Test Et

Artık yeni bir karakteri güvenli bir şekilde başlatmanın bir yolunu bulduğumuza göre, yeni bir test oluşturalım. Bu test, sadece saldırganın karakterini başlatmaya çalışmalı ve bir hata fırlatılmasını beklemelidir.

```typescript
it("sahte program ile güvenli karakter oluşturmayı engeller", async () => {
  try {
    await gameplayProgram.methods
      .createCharacterSecure()
      .accounts({
        metadataProgram: fakeMetadataProgram.programId,
        authority: attacker.publicKey,
      })
      .signers([attacker])
      .rpc();

    throw new Error("createCharacterSecure'ın bir hata fırlatmasını bekliyordum");
  } catch (error) {
    expect(error).to.be.instanceOf(Error);
    console.log(error);
  }
});
```

Henüz yapmadıysanız, `anchor test` komutunu çalıştırın. Beklendiği gibi bir hatanın fırlatıldığını fark edin; talimat işleyicisine geçirilen program kimliğinin beklenen program kimliğiyle uyuşmadığını gösteren ayrıntılı bir açıklama:

```bash
'Program log: AnchorError caused by account: metadata_program. Error Code: InvalidProgramId. Error Number: 3008. Error Message: Program ID was not as expected.',
'Program log: Left:',
'Program log: HQqG7PxftCD5BB9WUWcYksrjDLUwCmbV8Smh1W8CEgQm',
'Program log: Right:',
'Program log: 4FgVd2dgsFnXbSHz8fj9twNbfx8KWcBJkHa6APicU6KS'
```

:::danger
Rastgele CPI'lere karşı korunmanın yolu budur!
:::

Bazı durumlarda, programınızın CPIs'inde daha fazla esneklik istemek isteyebilirsiniz. İhtiyacınız olan programı tasarlamanızda sizi engellemeyeceğiz, ancak programınızda herhangi bir güvenlik açığı olmadığından emin olmak için mümkün olan her önlemi almanızı rica ediyoruz.

Son çözüm koduna göz atmak isterseniz, bunu [aynı deponun `solution` dalında](https://github.com/solana-developers/arbitrary-cpi/tree/solution) bulabilirsiniz.

## Zorluk

Bu birim içindeki diğer derslerde olduğu gibi, bu güvenlik açığını önlemek için fırsatınız kendi veya diğer programları denetlemektir.

En az bir programı gözden geçirmek için biraz zaman ayırın ve talimat işleyicilerine geçirilen **her program için program kontrollerinin** yerinde olduğundan emin olun; özellikle CPI ile çağrılan programlar için.

Başka birinin programında bir hata veya açığı bulursanız, lütfen onlara bildirin! Kendi programınızda bir tane bulursanız, hemen düzeltildiğinden emin olun.



Kodunuzu GitHub'a gönderin ve
[bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=5bcaf062-c356-4b58-80a0-12cca99c29b0)!
