---
title: Hesapları Kapatma ve Canlandırma Saldırıları
objectives:
  - Hatalı bir şekilde program hesaplarının kapatılmasıyla ilişkili çeşitli güvenlik açıklıklarını açıklamak
  - Yerel Rust kullanarak program hesaplarını güvenli bir şekilde kapatmak
  - Anchor `close` kısıtlamasını kullanarak program hesaplarını güvenli bir şekilde kapatmak
description:
  "Anchor ve yerel Rust kullanarak program hesaplarını güvenli bir şekilde nasıl kapatacağınız."
---

## Özet

- **Bir hesabı kapatmak**, yeniden başlatma/canlandırma saldırıları için bir fırsat yaratır.
- Solana çalışma zamanı, hesapların artık kira muafiyeti sağlamadığında **çöp toplar**. Hesapları kapatmak, hesapta depolanan lamportların kira muafiyeti için başka bir hesaba aktarılmasını içerir.
- Hesapları güvenli bir şekilde kapatmak ve hesap ayırıcıyı `CLOSED_ACCOUNT_DISCRIMINATOR` olarak ayarlamak için Anchor `#[account(close = )]` kısıtlamasını kullanabilirsiniz.
  ```rust
  #[account(mut, close = receiver)]
  pub data_account: Account<'info, MyData>,
  #[account(mut)]
  pub receiver: SystemAccount<'info>
  ```

## Ders

Basit gelmesine rağmen, hesapları doğru bir şekilde kapatmak karmaşık olabilir. **Belirli adımları takip etmezseniz**, bir saldırganın hesabın kapanmasını atlatmanın birçok yolu vardır.

> **Taktik:** Bu saldırı vektörlerini daha iyi anlamak için her bir senaryoyu derinlemesine inceleyelim. — Dikkatli olun!

### Güvensiz hesap kapama

Temelinde, bir hesabı kapatmak, lamportlarını ayrı bir hesaba aktarmayı içerir ve bu, Solana çalışma zamanının ilk hesabı çöp toplamasını tetikler. Bu, sahiplikten sistem programına geçişi sıfırlar.

Aşağıdaki örneğe göz atın. Talimat iki hesaba ihtiyaç duyar:

1. `account_to_close` - kapanacak hesap
2. `destination` - kapanan hesabın lamportlarını alacak hesap

Program mantığı, `destination` hesabının lamportlarını `account_to_close`’da depolanan miktarla artırarak hesabı kapatmayı amaçlar ve `account_to_close`'un lamportlarını 0'a ayarlar. Bu programda, tam bir işlem işlemi tamamlandıktan sonra `account_to_close` çalışma zamanı tarafından çöp toplanacaktır.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod closing_accounts_insecure {
    use super::*;

    pub fn close(ctx: Context<Close>) -> ProgramResult {
        let dest_starting_lamports = ctx.accounts.destination.lamports();

        **ctx.accounts.destination.lamports.borrow_mut() = dest_starting_lamports
            .checked_add(ctx.accounts.account_to_close.to_account_info().lamports())
            .unwrap();
        **ctx.accounts.account_to_close.to_account_info().lamports.borrow_mut() = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Close<'info> {
    account_to_close: Account<'info, Data>,
    destination: AccountInfo<'info>,
}

#[account]
pub struct Data {
    data: u64,
}
```

Ancak, çöp toplama işlemi, işlem tamamlanana kadar gerçekleşmez. Ve bir işlemede birden fazla talimat olabileceğinden, bu bir saldırgan için hesabı kapatma talimatını çağırma fırsatı yaratır, ancak ayrıca işlemde hesabın kira muafiyet lamportlarını iade etmek için bir transfer de ekleyebilir. Sonuç olarak, hesap _çöp toplanmayacak_, bu da saldırganın programda beklenmeyen davranışlar oluşturmasına ve hatta bir protokolden belirli bir miktarı boşaltmasına yol açacaktır.

### Güvenli hesap kapama

Bu açığı kapatmanın en önemli iki yolu, hesap verilerini sıfırlamak ve hesabın kapandığını belirten bir hesap ayırıcı eklemektir. **İkisinin de olması**, istenmeyen program davranışlarını önlemek için gereklidir.

Verileri sıfırlanmış bir hesap hâlâ bazı şeyler için kullanılabilir, özellikle de adres türetimi program içinde doğrulama amaçları için kullanılıyorsa. Ancak, saldırganın önceki depolanan verilere erişememesi durumunda zarar potansiyel olarak sınırlı olabilir.

> **İpucu:** Programı daha güvenli hale getirmek için, kapatılan hesaplara "kapalı" olarak belirten bir hesap ayırıcı eklenmeli ve tüm talimatlar tüm geçirilen hesaplar üzerinde kontroller yapmalı ve hesap kapalı olarak işaretlenmişse bir hata döndürmelidir.

Aşağıdaki örneğe bakın. Bu program, bir hesaptan lamportları transfer ediyor, hesap verilerini sıfırlıyor ve çöp toplanmadan önce bu hesabın tekrar kullanılmasını önlemek umuduyla tek bir talimatla bir hesap ayırıcı ayarlıyor. Bu işlemlerden herhangi birinin eksik olması, bir güvenlik açığına yol açacaktır.

```rust
use anchor_lang::prelude::*;
use std::io::Write;
use std::ops::DerefMut;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod closing_accounts_insecure_still_still {
    use super::*;

    pub fn close(ctx: Context<Close>) -> ProgramResult {
        let account = ctx.accounts.account.to_account_info();

        let dest_starting_lamports = ctx.accounts.destination.lamports();

        **ctx.accounts.destination.lamports.borrow_mut() = dest_starting_lamports
            .checked_add(account.lamports())
            .unwrap();
        **account.lamports.borrow_mut() = 0;

        let mut data = account.try_borrow_mut_data()?;
        for byte in data.deref_mut().iter_mut() {
            *byte = 0;
        }

        let dst: &mut [u8] = &mut data;
        let mut cursor = std::io::Cursor::new(dst);
        cursor
            .write_all(&anchor_lang::__private::CLOSED_ACCOUNT_DISCRIMINATOR)
            .unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Close<'info> {
    account: Account<'info, Data>,
    destination: AccountInfo<'info>,
}

#[account]
pub struct Data {
    data: u64,
}
```

Yukarıdaki örneğin Anchor'ın `CLOSED_ACCOUNT_DISCRIMINATOR` kullandığını unutmayın. Bu, her bir baytın `255` olduğu yalnızca bir hesap ayırıcıdır. Ayırıcı herhangi bir doğrudan anlam taşımamakla birlikte, kapalı hesapların bir talimata geçirildiğinde her zaman hata döndüren hesap doğrulama kontrolleriyle birleştirirseniz, programınızın kapalı bir hesapla yanlışlıkla bir talimat işleme almasını durdurursunuz.

#### Manuel Zorla Fon Kesme

Hala bir küçük sorun var. Hesap verilerini sıfırlama ve "kapalı" hesap ayırıcı ekleme uygulaması, programınızın kötüye kullanımını durduracak olsa da, bir kullanıcı, bir talimatın sonunda hesabın lamportlarını iade ederek hesabın çöp toplanmasını önleyebilir. Bu, kullanılmayan ama aynı zamanda çöp toplanamayan bir veya potansiyel olarak birçok hesabın var olduğu bir limbo durumuna yol açar.

Bu kenar durumu ele almak için, "kapalı" hesap ayırıcı ile etiketlenen hesapları fona zorla kesmeye olanak tanıyan bir talimat eklemeyi düşünebilirsiniz. Bu talimat yalnızca kesilen hesabın kapalı olarak işaretlendiğini doğrulamak için hesap doğrulaması yapar. Bu şu şekilde görünebilir:

```rust
use anchor_lang::__private::CLOSED_ACCOUNT_DISCRIMINATOR;
use anchor_lang::prelude::*;
use std::io::{Cursor, Write};
use std::ops::DerefMut;

...

    pub fn force_defund(ctx: Context<ForceDefund>) -> ProgramResult {
        let account = &ctx.accounts.account;

        let data = account.try_borrow_data()?;
        assert!(data.len() > 8);

        let mut discriminator = [0u8; 8];
        discriminator.copy_from_slice(&data[0..8]);
        if discriminator != CLOSED_ACCOUNT_DISCRIMINATOR {
            return Err(ProgramError::InvalidAccountData);
        }

        let dest_starting_lamports = ctx.accounts.destination.lamports();

        **ctx.accounts.destination.lamports.borrow_mut() = dest_starting_lamports
            .checked_add(account.lamports())
            .unwrap();
        **account.lamports.borrow_mut() = 0;

        Ok(())
    }

...

#[derive(Accounts)]
pub struct ForceDefund<'info> {
    account: AccountInfo<'info>,
    destination: AccountInfo<'info>,
}
```

Bu talimat herhangi biri tarafından çağrılabileceğinden, bu, bir saldırganın hesap kira muafiyetini ödeyerek yeniden canlandırma saldırılarını engelleyebilir, ancak başka biri iade edilen hesapta bulunan lamportları kendileri için talep edebilir.

Gerekli olmasa da, "limbo" hesaplarla ilişkili alan ve lamport israfını elimine etmeye yardımcı olabilir.

### Anchor `close` Kısıtlamasını Kullanma

Neyse ki, Anchor tüm bunları `#[account(close = )]` kısıtlaması ile çok daha basit hale getiriyor. Bu kısıtlama, bir hesabı güvenli bir şekilde kapatmak için gereken her şeyi halleder:

1. Hesabın lamportlarını belirli bir ``'a aktarır
2. Hesap verilerini sıfırlar
3. Hesap ayırıcısını `CLOSED_ACCOUNT_DISCRIMINATOR` varyantına ayarlar

Yapmanız gereken tek şey, kapatılmasını istediğiniz hesaba hesap doğrulama yapısına eklemektir:

```rust
#[derive(Accounts)]
pub struct CloseAccount {
    #[account(
        mut,
        close = receiver
    )]
    pub data_account: Account<'info, MyData>,
    #[account(mut)]
    pub receiver: SystemAccount<'info>
}
```

`force_defund` talimatı isteğe bağlı bir ek olup, kullanmak isterseniz kendi başınıza gerçekleştirmeniz gerekecektir.

---

## Laboratuvar

Bir saldırganın canlandırma saldırısından nasıl yararlanabileceğini netleştirmek için, kullanıcıların piyangoya katılımını yönetmek üzere program hesap durumunu kullanan basit bir piyango programıyla çalışalım.

### 1. Kurulum

`starter` dalından kodu alın 
[şu repodan](https://github.com/Unboxed-Software/solana-closing-accounts/tree/starter).

Kodda programda iki talimat ve `tests` dizininde iki test bulunmaktadır.

Program talimatları:

1. `enter_lottery`
2. `redeem_rewards_insecure`

Bir kullanıcı `enter_lottery` çağrıldığında, program, kullanıcının piyango girişine dair bir durumu depolamak için bir hesap başlatacaktır.

Bu tamamen gelişmiş bir piyango programı yerine basit bir örnek olduğu için, bir kullanıcı piyangoya girdikten sonra dilediği zaman `redeem_rewards_insecure` talimatını çağırabilir. Bu talimat, kullanıcıya ödülleri, kullanıcının piyangoya katıldığı kadar miktarda Token oluşturur. Ödülleri oluşturdıktan sonra program, kullanıcının piyango girişini kapatır.

> **Not:** Program koduna aşina olmak için bir dakikanızı ayırın. `enter_lottery` talimatı, kullanıcıya bağlı bir PDA'da bir hesap oluşturur ve üzerinde bazı durumları başlatır.

`redeem_rewards_insecure` talimatı bazı hesap ve veri doğrulamaları gerçekleştirir, verilen token hesabına jetonlar çıkarır ve ardından piyango hesabını lamportlarını kaldırarak kapatır.

Ancak, `redeem_rewards_insecure` talimatının yalnızca hesabın lamportlarını dışarı aktardığını ve hesabı canlandırma saldırılarına açık bıraktığını unutmayın.

### 2. Güvensiz Programı Test Etme

Hesabını kapatmayı başaran bir saldırgan, `redeem_rewards_insecure`'i birden fazla kez çağırabilir ve hak ettiklerinden daha fazla ödül talep edebilir.

Zaten bu güvenlik açığını sergileyen bazı başlangıç testleri yazılmış. `tests` dizinindeki `closing-accounts.ts` dosyasına bir bakın. 'before' fonksiyonunda bazı ayarlamalar var, ardından `attacker` için yeni bir piyango kaydı oluşturan bir test var.

Son olarak, bir saldırganın hesabı canlı tutmayı nasıl başarabileceğini ve ardından ödülleri nasıl tekrar talep edebileceğini gösteren bir test var. O test şu şekildedir:

```typescript
it("attacker can close + refund lottery acct + claim multiple rewards", async () => {
  // claim multiple times
  for (let i = 0; i < 2; i++) {
    const tx = new Transaction();
    // instruction claims rewards, program will try to close account
    tx.add(
      await program.methods
        .redeemWinningsInsecure()
        .accounts({
          lotteryEntry: attackerLotteryEntry,
          user: attacker.publicKey,
          userAta: attackerAta,
          rewardMint: rewardMint,
          mintAuth: mintAuth,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction(),
    );

    // user adds instruction to refund dataAccount lamports
    const rentExemptLamports =
      await provider.connection.getMinimumBalanceForRentExemption(
        82,
        "confirmed",
      );
    tx.add(
      SystemProgram.transfer({
        fromPubkey: attacker.publicKey,
        toPubkey: attackerLotteryEntry,
        lamports: rentExemptLamports,
      }),
    );
    // send tx
    await sendAndConfirmTransaction(provider.connection, tx, [attacker]);
    await new Promise(x => setTimeout(x, 5000));
  }

  const ata = await getAccount(provider.connection, attackerAta);
  const lotteryEntry =
    await program.account.lotteryAccount.fetch(attackerLotteryEntry);

  expect(Number(ata.amount)).to.equal(
    lotteryEntry.timestamp.toNumber() * 10 * 2,
  );
});
```

Bu test şunları yapmaktadır:

1. Kullanıcının ödüllerini talep etmek için `redeem_rewards_insecure`'i çağırır.
2. Aynı işlemde, hesabı gerçekten kapatmadan önce kullanıcının `lottery_entry`'sini iade etmek için bir talimat ekler.
3. Bir kez daha ödülle birlikte 1 ve 2 adımlarını başarıyla tekrarlar.

> **Uyarı:** Teorik olarak, a) programda daha fazla ödül kalmadığı veya b) biri durumu fark edip düzeltmediği sürece, 1-2 adımlarını sonsuz bir şekilde tekrarlayabilirsiniz. Bu, herhangi bir gerçek programda ciddi bir sorun olurdu çünkü kötü niyetli bir saldırganın tüm ödül havuzunu boşaltmasına olanak tanır.

### 3. `redeem_rewards_secure` talimatını oluşturun

Bunun olmasını önlemek için, piyango hesabını Anchor `close` kısıtlaması kullanarak güvenli bir şekilde kapatan yeni bir talimat oluşturacağız. Eğer isterseniz, bunu kendiniz deneyebilirsiniz.

Yeni hesap doğrulama yapısı `RedeemWinningsSecure` şöyle görünmelidir:

```rust
#[derive(Accounts)]
pub struct RedeemWinningsSecure<'info> {
    // program expects this account to be initialized
    #[account(
        mut,
        seeds = [user.key().as_ref()],
        bump = lottery_entry.bump,
        has_one = user,
        close = user
    )]
    pub lottery_entry: Account<'info, LotteryAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = user_ata.key() == lottery_entry.user_ata
    )]
    pub user_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = reward_mint.key() == user_ata.mint
    )]
    pub reward_mint: Account<'info, Mint>,
    ///CHECK: mint authority
    #[account(
        seeds = [MINT_SEED.as_bytes()],
        bump
    )]
    pub mint_auth: AccountInfo<'info>,
    pub token_program: Program<'info, Token>
}
```

Tamamen aynı olmalıdır, ancak `lottery_entry` hesabı üzerinde ek bir `close = user` kısıtlaması bulunmaktadır. Bu, Anchor’ın hesap verilerini sıfırlayarak, lamportları `user` hesabına aktararak ve hesap ayırıcısını `CLOSED_ACCOUNT_DISCRIMINATOR` olarak ayarlayarak hesabı kapatmasını söyleyecektir. Bu son adım, hesabın zaten kapanmaya çalışıldığında tekrar kullanılmasını engelleyecektir.

Ardından, minting CPI'sini token programına yardımcı olmak için yeni `RedeemWinningsSecure` yapısında bir `mint_ctx` yöntemi oluşturabiliriz.

```Rust
impl<'info> RedeemWinningsSecure<'info> {
    pub fn mint_ctx(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = MintTo {
            mint: self.reward_mint.to_account_info(),
            to: self.user_ata.to_account_info(),
            authority: self.mint_auth.to_account_info()
        };

        CpiContext::new(cpi_program, cpi_accounts)
    }
}
```

Son olarak, yeni güvenli talimatın mantığı şöyle görünmelidir:

```rust
pub fn redeem_winnings_secure(ctx: Context<RedeemWinningsSecure>) -> Result<()> {

    msg!("Ödülleri hesaplıyoruz");
    let amount = ctx.accounts.lottery_entry.timestamp as u64 * 10;

    msg!("{} jetonları ödül olarak basılıyor", amount);
    // program imzacı tohumları
    let auth_bump = *ctx.bumps.get("mint_auth").unwrap();
    let auth_seeds = &[MINT_SEED.as_bytes(), &[auth_bump]];
    let signer = &[&auth_seeds[..]];

    // kullanıcıya basarak ödülleri geri al
    mint_to(ctx.accounts.mint_ctx().with_signer(signer), amount)?;

    Ok(())
}
```

Bu mantık, talep eden kullanıcının ödüllerini hesaplar ve ödülleri aktarır. Ancak, hesap doğrulama yapısındaki `close` kısıtlaması nedeniyle saldırganın bu talimatı birden fazla kez çağırması beklenemez.

### 4. Programı Test Etme

Yeni güvenli talimatımızın test edilmesi için iki kez `redeemingWinningsSecure`'i çağırmaya çalışan yeni bir test oluşturalım. İkinci çağrının hata fırlatmasını bekliyoruz.

```typescript
it("attacker cannot claim multiple rewards with secure claim", async () => {
  const tx = new Transaction();
  // instruction claims rewards, program will try to close account
  tx.add(
    await program.methods
      .redeemWinningsSecure()
      .accounts({
        lotteryEntry: attackerLotteryEntry,
        user: attacker.publicKey,
        userAta: attackerAta,
        rewardMint: rewardMint,
        mintAuth: mintAuth,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction(),
  );

  // user adds instruction to refund dataAccount lamports
  const rentExemptLamports =
    await provider.connection.getMinimumBalanceForRentExemption(
      82,
      "confirmed",
    );
  tx.add(
    SystemProgram.transfer({
      fromPubkey: attacker.publicKey,
      toPubkey: attackerLotteryEntry,
      lamports: rentExemptLamports,
    }),
  );
  // send tx
  await sendAndConfirmTransaction(provider.connection, tx, [attacker]);

  try {
    await program.methods
      .redeemWinningsSecure()
      .accounts({
        lotteryEntry: attackerLotteryEntry,
        user: attacker.publicKey,
        userAta: attackerAta,
        rewardMint: rewardMint,
        mintAuth: mintAuth,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([attacker])
      .rpc();
  } catch (error) {
    console.log(error.message);
    expect(error);
  }
});
```

`anchor test` komutunu çalıştırarak testin geçtiğini görebilirsiniz. Çıktı aşağıdaki şekilde görünecektir:

```
  closing-accounts
    ✔ Piyangoya gir (451ms)
    ✔ saldırgan kapanabilir + piyango hesabı iade + birden fazla ödül talep edebilir (18760ms)
AnchorError caused by account: lottery_entry. Error Code: AccountDiscriminatorMismatch. Error Number: 3002. Error Message: 8 byte discriminator did not match what was expected.
    ✔ saldırgan güvenli talep ile birden fazla ödül talep edemez (414ms)
```

> **Not:** Bu kötü niyetli kullanıcının hesabını tamamen iade etmelerini engellemiyor - yalnızca programımızın hesabı kapatılırken kapalı bir hesabı yanlışlıkla yeniden kullanmasını önlüyor. Henüz `force_defund` talimatını uygulamadık, ancak yapabiliriz. Eğer denemek isterseniz, kendiniz bir şans verin!

Hesapları kapatmanın en basit ve en güvenli yolu, Anchor'ın `close` kısıtlamasını kullanmaktır. Eğer bu kısıtlamayı kullanamayacak kadar özel bir davranışa ihtiyacınız varsa, programınızın güvenliğini sağlamak için bu işlevselliği tekrar etmeyi unutmayın.

Son çözüm koduna bakmak isterseniz, onu aynı repodaki `solution` dalında bulabilirsiniz.
[repo](https://github.com/Unboxed-Software/solana-closing-accounts/tree/solution).

---

## Meydan Okuma

Bu birim içindeki diğer derslerde olduğu gibi, bu güvenlik açığından kaçınma fırsatınız, kendi veya diğer programlarınızı denetlemekle ilgilidir.

Hesapların kapatıldığında canlandırma saldırılarına maruz kalmadıklarından emin olmak için en az bir programı gözden geçirmek için biraz zaman ayırın. 

> **Öneri:** Unutmayın, birinin programında bir hata veya kötüye kullanım fark ederseniz, lütfen onları bilgilendirin! Kendi programınızda bir seçenek bulursanız, hemen düzeltin.


Kodunuzu GitHub'a gönderin ve
[bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=e6b99d4b-35ed-4fb2-b9cd-73eefc875a0f)!
