---
title: Bump Seed Canonicalization
objectives:
  - PDAs'nın kanonik bump olmadan türetilmesinin yarattığı güvenlik açıklarını açıklamak
  - Anchor'ın `seeds` ve `bump` kısıtlarını kullanarak otomatik olarak kanonik bump'ı kullanacak bir PDA başlatmak
  - PDA türetirken gelecekte her zaman kanonik bump'ın kullanılmasını sağlamak için Anchor'ın `seeds` ve `bump` kısıtlarını kullanmak
description:
  "Kanonik bump'ı saklayarak ve yeniden kullanarak tutarlı PDA hesaplamalarının gerekliliğini anlamak."
---

## Özet

- **`create_program_address`** fonksiyonu, bir PDA türetir, ancak bunu kanonik bump'ı aramadan yapar. **:::warning Bu, birden fazla geçerli bump'ın farklı adresler üretmesine izin verir.** Bu, geçerli bir PDA üretebilse de, aynı seed seti için birden fazla bump farklı adresler elde edebileceğinden deterministik değildir. 
- **`find_program_address`** kullanmak, PDA türetiminde genellikle **kanonik bump** olarak adlandırılan **en yüksek geçerli bump**'ın kullanılmasını sağlar. **:::note Bu, belirli bir seed seti için bir adres hesaplamanın deterministik bir yolunu sağlar ve program genelinde tutarlılık yaratır.**
- Anchor'da, PDA türetimlerinin her zaman doğru kanonik bump ile uyumlu olmasını sağlamak için `seeds` ve `bump` belirtebilirsiniz.
- Anchor ayrıca, doğrulama yapısı içinde `bump = ` kısıtlaması kullanarak doğrudan bir bump belirtmenize izin verir. **:::danger Bu, PDA'yı doğrularken doğru bump'ın kullanılmasını garanti eder.**
- `find_program_address` kullanmak, en yüksek geçerli bump'ı arama sürecinden dolayı hesaplama açısından maliyetli olabilir. **:::tip Başlangıçta türetilen bump'ı bir hesabın veri alanında saklamak en iyi uygulama olarak kabul edilir.** Bu, gelecekteki talimat işleyicilerinde bump'ın referans verilmesini sağlar ve tekrar tekrar `find_program_address` çağrısı yapma ihtiyacını ortadan kaldırır.

  ```rust
  #[derive(Accounts)]
  pub struct VerifyAddress<'info> {
      #[account(
          seeds = [DATA_PDA_SEED.as_bytes()],
          bump = data.bump
      )]
      data: Account<'info, Data>,
  }
  ```

- Özetle, **`create_program_address`** bir PDA türetebilirken, **`find_program_address`** her zaman kanonik bump üretmekte tutarlılık ve güvenilirlik sağlar; bu, deterministik program yürütmesi için kritik öneme sahiptir. **:::info Bu, zincir üstü uygulamalarda bütünlüğü korumaya yardımcı olur, özellikle birden fazla talimat işleyicisi boyunca PDAs'ı doğrularken.**

---

## Ders

Bump seed'ler, türetilen bir adresin geçerli bir PDA olmasını sağlamak için kullanılan 0 ile 255 arasında, dahil olmak üzere, bir sayı grubudur. **Kanonik bump**, geçerli bir PDA üreten en yüksek bump değeridir. Solana'daki standart, PDAs türetilirken her zaman kanonik bump kullanmaktır; bu hem güvenlik hem de kolaylık açısından önemlidir.

### create_program_address Kullanarak Güvensiz PDA Türetimi

Bir dizi seed verildiğinde, **`create_program_address`** fonksiyonu doğru bir PDA üretme ihtimali yaklaşık %50'dir. Bump seed, türetilen adresi geçerli bir alana "bump" etmek için seed olarak eklenen ek bir bayttır. **:::note 256 olası bump seed olduğu ve fonksiyon geçerli PDAs üretme olasılığı yaklaşık %50 olduğu için, belirli bir input seed seti için birçok geçerli bump vardır.**

Bu durum, bilinen bilgiler ile hesaplar arasında eşleme yapma yöntemleri olarak seed kullandığınızda hesaplarınızı bulmakta karışıklık yaratabilir. **:::tip Kanonik bump'ı standart olarak kullanmak, doğru hesabı her zaman bulmanızı garanti eder.** Daha da önemlisi, birden fazla bump kullanarak açık uçlu bir yapı oluşturmanın neden olabileceği güvenlik açıklarını önler.

Aşağıdaki örnekte, `set_value` talimatı işleyici, bir PDA türetmek için talimat verisi olarak geçirilen bir `bump` kullanmaktadır. **:::info Talimat işleyici, PDA'yı türeterek ve geçirilen hesabı kontrol ederek iyi bir uygulama sergilemektedir; ancak çağrılanın keyfi bir bump geçirmesine izin verecek şekilde yapılandırılmıştır.** 

```rust
use anchor_lang::prelude::*;

declare_id!("ABQaKhtpYQUUgZ9m2sAY7ZHxWv6KyNdhUJW8Dh8NQbkf");

#[program]
pub mod bump_seed_canonicalization_insecure {
    use super::*;

    // create_program_address Kullanarak Güvensiz PDA Türetimi
    pub fn set_value(ctx: Context<BumpSeed>, key: u64, new_value: u64, bump: u8) -> Result<()> {
        let address =
            Pubkey::create_program_address(&[key.to_le_bytes().as_ref(), &[bump]], ctx.program_id)
                .unwrap();
        if address != ctx.accounts.data.key() {
            return Err(ProgramError::InvalidArgument.into());
        }

        ctx.accounts.data.value = new_value;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct BumpSeed<'info> {
    #[account(mut)]
    pub data: Account<'info, Data>,
}

#[account]
pub struct Data {
    pub value: u64,
}
```

### find_program_address Kullanarak Önerilen Türetim

**:::info Bu problemin üstesinden gelmenin basit bir yolu, programın yalnızca kanonik bump'ı beklemesi ve PDA türetmek için `find_program_address` kullanmasıdır.**

`find_program_address`, her zaman kanonik bump kullanır. Bu fonksiyon, her bir yinelemede bump'ı 255'ten başlatıp her çağrıda bir azaltarak `create_program_address` fonksiyonunu çağırarak iterasyon yapar. Geçerli bir adres bulunduğunda, hem türetilen PDA'yı hem de onu türetmek için kullanılan kanonik bump'ı geri döner. 

Bu, input seed'leriniz ile üretilen adres arasında bir birim eşlemesi sağlar.

```rust
pub fn set_value_secure(
    ctx: Context<BumpSeed>,
    key: u64,
    new_value: u64,
    bump: u8,
) -> Result<()> {
    let (address, expected_bump) =
        Pubkey::find_program_address(&[key.to_le_bytes().as_ref()], ctx.program_id);

    if address != ctx.accounts.data.key() {
        return Err(ProgramError::InvalidArgument.into());
    }
    if expected_bump != bump {
        return Err(ProgramError::InvalidArgument.into());
    }

    ctx.accounts.data.value = new_value;
    Ok(())
}
```

### Anchor'ın seed ve bump Kısıtlarını Kullanma

**:::tip Anchor, `seeds` ve `bump` kısıtları kullanarak hesap doğrulama yapısı içinde PDAs türetmek için pratik bir yol sunar.** Bu, hesabı istenen adreste başlatmak için `init` kısıtı ile birleştirilebilir. Tartıştığımız güvenlik açığına karşı programı korumak için, Anchor bir hesabı tümüyle kanonik bump ile başlatmanıza izin vermez. Bunun yerine, PDA'yı türetmek için `find_program_address` kullanır ve ardından başlatma işlemini gerçekleştirir.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod bump_seed_canonicalization_recommended {
    use super::*;

    pub fn set_value(ctx: Context<BumpSeed>, _key: u64, new_value: u64) -> Result<()> {
        ctx.accounts.data.value = new_value;
        Ok(())
    }
}
// PDA'da hesabı başlat
#[derive(Accounts)]
#[instruction(key: u64)]
pub struct BumpSeed<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        seeds = [key.to_le_bytes().as_ref()],
        // Derives the PDA using the canonical bump
        bump,
        payer = payer,
        space = DISCRIMINATOR_SIZE + Data::INIT_SPACE
    )]
    pub data: Account<'info, Data>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Data {
    pub value: u64,
}
```

Eğer bir hesabı başlatmıyorsanız, yine de `seeds` ve `bump` kısıtları ile PDAs'ı doğrulayabilirsiniz. Bu basitçe PDA'yı yeniden türetilir ve türetilen adresin, geçirilen hesabın adresi ile karşılaştırılmasını sağlar.

**:::info Bu durumda, Anchor'un PDA'yı türetmek için kullandığı bump'ı `bump = ` ile belirtmenize izin verilir.** Buradaki amaç, keyfi bump'lar kullanmanızı sağlamak değil, programınızı optimize etmenize yardımcı olmaktır. `find_program_address` fonksiyonunun iteratif doğası maliyet açısından pahalı olduğundan, en iyi uygulama, PDA'ları başlatırken kanonik bump'ı hesap alanına saklamaktır; bu da doğrulama sırasında kaydedilen bump'a referans vermenizi sağlar.

Kullanılacak bump'ı belirttiğinizde, Anchor, sağlanan bump ile `create_program_address` kullanılacak; `find_program_address` değil. Hesap verilerinde bump'ı depolama modeli, programınızın her zaman kanonik bump'ı kullanılmasını garanti eder ve performansı kötüleştirmez.

```rust
use anchor_lang::prelude::*;

declare_id!("CVwV9RoebTbmzsGg1uqU1s4a3LvTKseewZKmaNLSxTqc");

// Hesap alanı hesaplaması için sabit
pub const DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod bump_seed_canonicalization_recommended {
    use super::*;

    // Bump'ı depolayan bir değeri ayarlama talimat işleyicisi
    pub fn set_value(ctx: Context<BumpSeed>, _key: u64, new_value: u64) -> Result<()> {
        ctx.accounts.data.value = new_value;

        // Kanonik bump'ı hesapta depola
        // Bu bump, Anchor tarafından otomatik olarak türetilir
        ctx.accounts.data.bump = ctx.bumps.data;

        Ok(())
    }

    // PDA adresini doğrulama işlem talimatı işleyicisi
    pub fn verify_address(ctx: Context<VerifyAddress>, _key: u64) -> Result<()> {
        msg!("PDA'nın kanonik bump ile türetildiği doğrulandı: {}", ctx.accounts.data.key());
        Ok(())
    }
}

// PDA hesabı başlatmak için hesap doğrulama yapısı
#[derive(Accounts)]
#[instruction(key: u64)]
pub struct BumpSeed<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [key.to_le_bytes().as_ref()],
        bump,  // Anchor otomatik olarak kanonik bump'ı kullanır
        payer = payer,
        space = DISCRIMINATOR_SIZE + Data::INIT_SPACE
    )]
    pub data: Account<'info, Data>,

    pub system_program: Program<'info, System>
}

// PDA adresini doğrulamak için hesap doğrulama yapısı
#[derive(Accounts)]
#[instruction(key: u64)]
pub struct VerifyAddress<'info> {
    #[account(
        seeds = [key.to_le_bytes().as_ref()],
        bump = data.bump  // Saklanan bump kullanılacak, garanti kanonik
    )]
    pub data: Account<'info, Data>,
}

// PDA hesabı için veri yapısı
#[account]
#[derive(InitSpace)]
pub struct Data {
    pub value: u64,
    pub bump: u8  // Kanonik bump'ı saklar
}
```

`bump` kısıtlamasında bump'ı belirtmediğinizde, Anchor yine de kanonik bump'ı kullanarak PDA'yı türetmek için `find_program_address` kullanacaktır. **:::warning Bu durumda, talimat işleyiciniz değişken bir hesaplama bütçesi gerektirecektir.** Bütçe aşımına maruz kalan programlar, programın bütçesinin zaman zaman ve öngörülemeyen bir şekilde aşılma riski olabileceğinden bunu dikkatle kullanmalıdır.

Öte yandan, eğer sadece bir hesap geçirilip geçilmediği kontrol ediliyorsa, Anchor'un kanonik bump'ı türetmesine izin vermeniz veya programınızı gereksiz risklere maruz bırakmanız gerekecek. **:::danger Bu durumda, lütfen performansa karşı hafif bir kayıp olsa bile kanonik bump'ı kullanmaya devam edin.**

---

## Laboratuvar

Kanonik bump'ı kontrol etmediğinizde ortaya çıkabilecek güvenlik istismarlarını göstermek için, her program kullanıcısının "zamanında" ödül "talep etmesine" izin veren bir program ile başlayalım.

### 1. Kurulum

Öncelikle, [bu depo](https://github.com/solana-developers/bump-seed-canonicalization/tree/starter) üzerindeki `starter` dalındaki kodu alın.

Programda iki talimat işleyicisi ve `tests` dizininde bir test bulunduğunu fark edin.

Programdaki talimat işleyicileri:

1. `create_user_insecure`
2. `claim_insecure`

`create_user_insecure` talimat işleyicisi yalnızca imzacı'nın genel anahtarı ve geçirilen bir bump kullanarak bir PDA'da yeni bir hesap oluşturur.

`claim_insecure` talimat işleyicisi, kullanıcıya 10 token mint eder ve ardından hesabın ödüllerini talep edilmiş olarak işaretler, böylece tekrar talep edemezler.

**:::note Ancak program, söz konusu PDAs'ın kanonik bump kullanıp kullanmadığını açıkça kontrol etmez.** Programın ne yaptığını anlamak için göz atın ve sonra devam edin.

### 2. Güvensiz Talimat İşleyicileri Test Etme

Talimat işleyicileri açıkça `user` PDA'nın kanonik bump kullanmasını zorunlu kılmadığı için, bir saldırgan her cüzdan için birden fazla hesap oluşturabilir ve izin verilen miktardan daha fazla ödül talep edebilir.

`tests` dizinindeki test, bir saldırganı temsil eden yeni bir keypair olan `attacker` oluşturur. Ardından, tüm geçerli bump'lar arasında döngü gerçekleştirir ve `create_user_insecure` ve `claim_insecure` fonksiyonlarını çağırır. Sonunda, **:::info test, saldırganın birden fazla kez ödül alabilmiş olmasını ve her kullanıcı için tahsis edilen 10 token'dan daha fazlasını kazanmış olmasını bekler.**

```typescript
it("allows attacker to claim more than reward limit with insecure instruction handlers", async () => {
  try {
    const attacker = Keypair.generate();
    await airdropIfRequired(
      connection,
      attacker.publicKey,
      1 * LAMPORTS_PER_SOL,
      0.5 * LAMPORTS_PER_SOL,
    );
    const ataKey = await getAssociatedTokenAddress(mint, attacker.publicKey);

    let successfulClaimCount = 0;

    for (let i = 0; i < 256; i++) {
      try {
        const pda = anchor.web3.PublicKey.createProgramAddressSync(
          [attacker.publicKey.toBuffer(), Buffer.from([i])],
          program.programId,
        );
        await program.methods
          .createUserInsecure(i)
          .accounts({
            user: pda,
            payer: attacker.publicKey,
          })
          .signers([attacker])
          .rpc();
        await program.methods
          .claimInsecure(i)
          .accounts({
            user: pda,
            mint,
            payer: attacker.publicKey,
            userAta: ataKey,
            mintAuthority,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([attacker])
          .rpc();

        successfulClaimCount += 1;
      } catch (error) {
        if (
          error instanceof Error &&
          !error.message.includes(
            "Invalid seeds, address must fall off the curve",
          )
        ) {
          console.error(error);
        }
      }
    }

    const ata = await getAccount(connection, ataKey);

    console.log(
      `Attacker claimed ${successfulClaimCount} times and got ${Number(
        ata.amount,
      )} tokens`,
    );

    expect(successfulClaimCount).to.be.greaterThan(1);
    expect(Number(ata.amount)).to.be.greaterThan(10);
  } catch (error) {
    throw new Error(`Test failed: ${error.message}`);
  }
});
```

**:::note `anchor test` komutunu çalıştırarak bu testin geçtiğini görebilirsiniz ve bu da saldırganın başarılı olduğunu göstermektedir.** Test, geçerli tüm bump'lar için talimat işleyicilerini çağırdığından, çalıştırılması biraz zaman alır, bu yüzden sabırlı olun.

```bash
  Bump seed canonicalization
Attacker claimed 121 times and got 1210 tokens
    ✔ allows attacker to claim more than reward limit with insecure instructions (119994ms)
```

### 3. Güvenli Talimat İşleyicisi Oluşturma

**:::warning Güvenlik açığını kapatmak için iki yeni talimat işleyici oluşturalım:** 

1. `create_user_secure`
2. `claim_secure`

Hesap doğrulama veya talimat işleyici mantığını yazmadan önce, `UserSecure` adında yeni bir kullanıcı tipi oluşturalım. **:::tip Bu yeni tip, struct üzerinde kanonik bump'ı bir alan olarak ekleyecektir.**

```rust
// Güvenli kullanıcı hesap yapısı
#[account]
#[derive(InitSpace)]
pub struct UserSecure {
    pub auth: Pubkey,
    pub bump: u8,
    pub rewards_claimed: bool,
}
```

Ardından, her bir yeni talimat işleyici için hesap doğrulama yapıları oluşturalım. **:::info Bunlar, güvensiz versiyonlarla çok benzer olacak, ancak Anchor'ın PDAs'ın türetilmesi ve ayrıştırılmasına izin verecek.**

```rust
// Güvenli bir kullanıcı hesabı oluşturmak için hesap doğrulama yapı
#[derive(Accounts)]
pub struct CreateUserSecure<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = DISCRIMINATOR_SIZE + UserSecure::INIT_SPACE,
        seeds = [payer.key().as_ref()],
        bump
    )]
    pub user: Account<'info, UserSecure>,
    pub system_program: Program<'info, System>,
}

// Ödüllerin güvenli bir şekilde talep edilmesi için hesap doğrulama yapısı
#[derive(Accounts)]
pub struct SecureClaim<'info> {
    #[account(
        mut,
        seeds = [payer.key().as_ref()],
        bump = user.bump,
        constraint = !user.rewards_claimed @ ClaimError::AlreadyClaimed,
        constraint = user.auth == payer.key()
    )]
    pub user: Account<'info, UserSecure>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub user_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    /// CHECK: Bu, seed kısıtlı kontrol edilen mint authority PDA'dır
    #[account(seeds = [b"mint"], bump)]
    pub mint_authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

Son olarak, iki yeni talimat işleyicisi için talimat işleyici mantığını uygulayalım. **:::tip `create_user_secure` talimat işleyicisi, yalnızca `auth`, `bump` ve `rewards_claimed` alanlarını kullanıcı hesabı veri yapısına ayarlamak zorundadır.** 

```rust
// Kullanıcı hesabını oluşturmak için güvenli talimat
pub fn create_user_secure(ctx: Context<CreateUserSecure>) -> Result<()> {
    ctx.accounts.user.set_inner(UserSecure {
        auth: ctx.accounts.payer.key(),
        bump: ctx.bumps.user,
        rewards_claimed: false,
    });
    Ok(())
}
```

**:::info `claim_secure` talimat işleyicisi, kullanıcıya 10 token mint etmeli ve ardından kullanıcı hesabının `rewards_claimed` alanını `true` olarak ayarlamalıdır.**

```rust
// Ödülleri talep etmek için güvenli talimat
pub fn claim_secure(ctx: Context<SecureClaim>) -> Result<()> {
    // Kullanıcının ilişkili token hesabına token mint et
    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_ata.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            &[&[b"mint", &[ctx.bumps.mint_authority]]],
        ),
        10,
    )?;

    // Ödülleri talep edilmiş olarak işaretle
    ctx.accounts.user.rewards_claimed = true;

    Ok(())
}

### 4. Güvenli Komut Yöneticilerini Test Etme

Saldırganın yeni komut yöneticileri kullanarak birden fazla kez talep edemeyeceğini göstermek için bir test yazalım.

Eski testte olduğu gibi birden fazla PDA kullanarak döngüye girmeye çalıştığınızda, **komut yöneticilerine geçerli olmayan bir bump bile geçiremeyeceğinizi fark edeceksiniz**. Ancak, çeşitli PDA’lar kullanarak döngü oluşturabilir ve sonunda yalnızca 10 token için 1 talep gerçekleştiğini kontrol edebilirsiniz. Nihai testiniz aşağıdaki gibi görünecektir:

```typescript
it("saldırganın güvenli komut yöneticileri ile yalnızca bir kez talep etmesine izin verir", async () => {
  try {
    const attacker = Keypair.generate();
    await airdropIfRequired(
      connection,
      attacker.publicKey,
      1 * LAMPORTS_PER_SOL,
      0.5 * LAMPORTS_PER_SOL,
    );
    const ataKey = await getAssociatedTokenAddress(mint, attacker.publicKey);
    const [userPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [attacker.publicKey.toBuffer()],
      program.programId,
    );

    await program.methods
      .createUserSecure()
      .accounts({
        payer: attacker.publicKey,
        user: userPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([attacker])
      .rpc();

    await program.methods
      .claimSecure()
      .accounts({
        payer: attacker.publicKey,
        user: userPDA,
        userAta: ataKey,
        mint,
        mintAuthority,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([attacker])
      .rpc();

    let successfulClaimCount = 1;

    for (let i = 0; i 
<summary><strong>Callout type="success" title="Laboratuvarı tamamladınız mı?"></strong></summary>

Kodunuzu GitHub'a yükleyin ve
[bize bu dersi nasıl bulduğunuzu söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=d3f6ca7a-11c8-421f-b7a3-d6c08ef1aa8b)!
</details>