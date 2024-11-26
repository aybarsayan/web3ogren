---
sidebarLabel: Çapraz Program Çağrısı
title: Çapraz Program Çağrısı
sidebarSortOrder: 5
description:
  Anchor çerçevesini kullanarak Solana programlarında Çapraz Program Çağrılarını (CPI'ler) nasıl uygulayacağınızı öğrenin. Bu öğretici, hesaplar arasında SOL transfer etme, Sistem Programı ile etkileşimde bulunma ve CPI'lerde Program Türevli Adresleri (PDA'lar) yönetme yöntemlerini gösterir. Bileşenli Solana programları inşa etmek isteyen geliştiriciler için mükemmeldir.
---

Bu bölümde, önceki PDA bölümündeki CRUD programını güncelleyerek Çapraz Program Çağrılarını (CPI'ler) dahile alacağız. Programı, güncelleme ve silme işlemleri sırasında hesaplar arasında SOL transferi yapacak şekilde değiştireceğiz ve programımızdan (bu durumda Sistem Programı) diğer programlarla nasıl etkileşimde bulunacağımızı göstereceğiz.

:::info
Bu bölümün amacı, Anchor çerçevesini kullanarak bir Solana programında CPI'lerin nasıl uygulanacağını adım adım incelemektir ve önceki bölümde incelediğimiz PDA kavramları üzerine inşa edilmektedir. Daha fazla bilgi için `Çapraz Program Çağrısı` sayfasına başvurun.
:::



### Güncelleme Talimatını Değiştir

İlk olarak, `Update` yapısını ve `update` fonksiyonunu değiştirerek basit bir "güncelleme için ödeme" mekanizması uygulayacağız.

`lib.rs` dosyasını güncelleyerek `system_program` modülünden öğeleri dahil etmeye başlayın.

```rs filename="lib.rs"
use anchor_lang::system_program::{transfer, Transfer};
```




```diff
  use anchor_lang::prelude::*;
+ use anchor_lang::system_program::{transfer, Transfer};
```




Ardından, `Update` yapısını, bir kullanıcı mesaj hesabını güncellediğinde SOL alacak olan `vault_account` adında ek bir hesap içerecek şekilde güncelleyin.

```rs filename="lib.rs"
#[account(
    mut,
    seeds = [b"vault", user.key().as_ref()],
    bump,
)]
pub vault_account: SystemAccount<'info>,
```




```diff
#[derive(Accounts)]
#[instruction(message: String)]
pub struct Update<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

+   #[account(
+       mut,
+       seeds = [b"vault", user.key().as_ref()],
+       bump,
+   )]
+   pub vault_account: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        realloc = 8 + 32 + 4 + message.len() + 1,
        realloc::payer = user,
        realloc::zero = true,
    )]
    pub message_account: Account<'info, MessageAccount>,
    pub system_program: Program<'info, System>,
}
```




`Update` yapısına `vault_account` adlı yeni bir hesap ekliyoruz. Bu hesap, kullanıcılar mesajlarını güncellediğinde SOL alacak olan program kontrollü bir "kasadır".

Kasanın bir PDA kullanılarak oluşturulması, her kullanıcı için program kontrollü bir hesap oluşturur ve böylece kullanıcı fonlarını program mantığı içinde yönetebiliriz.

---

`vault_account`'ın temel özellikleri:

- Hesabın adresi, `seeds` kullanarak türetilen bir PDA'dır: `[b"vault", user.key().as_ref()]`
- Bir PDA olarak, özel anahtarı yoktur, bu nedenle sadece programımız bu adres için CPI gerçekleştirirken "imza" atabilir.
- Bir `SystemAccount` türü olarak, normal cüzdan hesapları gibi Sistem Programı'nın kontrolündedir.

Bu yapılandırma, programımızın:

- Her kullanıcının "kasası" için benzersiz, belirlenebilir adresler oluşturmasına
- İşlemler için imza atmak üzere özel bir anahtara ihtiyaç duymadan fonları kontrol etmesine olanak tanır.

:::note
`delete` talimatında, programımızın bu PDA için CPI'de nasıl "imza atabileceğini" göstereceğiz.
:::




Sonra, `update` talimatında kullanıcının hesabından vault hesabına 0.001 SOL transfer etmek için CPI mantığını uygulayın.

```rs filename="lib.rs"
let transfer_accounts = Transfer {
    from: ctx.accounts.user.to_account_info(),
    to: ctx.accounts.vault_account.to_account_info(),
};
let cpi_context = CpiContext::new(
    ctx.accounts.system_program.to_account_info(),
    transfer_accounts,
);
transfer(cpi_context, 1_000_000)?;
```




```diff
    pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
        msg!("Güncelleme Mesajı: {}", message);
        let account_data = &mut ctx.accounts.message_account;
        account_data.message = message;

+       let transfer_accounts = Transfer {
+           from: ctx.accounts.user.to_account_info(),
+           to: ctx.accounts.vault_account.to_account_info(),
+       };
+       let cpi_context = CpiContext::new(
+           ctx.accounts.system_program.to_account_info(),
+           transfer_accounts,
+       );
+       transfer(cpi_context, 1_000_000)?;
        Ok(())
    }
```




`update` talimatında, Sistem Programı'nın `transfer` talimatını çağırmak için bir Çapraz Program Çağrısı (CPI) gerçekleştiriyoruz. Bu, programımızdan bir CPI gerçekleştirmenin nasıl yapılacağını gösterir ve Solana programlarının bileşenliğini sağlar.

`Transfer` yapısı, Sistem Programı'nın transfer talimatı için gerekli hesapları belirtir:

- `from` - Kullanıcının hesabı (fonların kaynağı)
- `to` - Kasa hesabı (fonların hedefi)

  ```rs filename="lib.rs"
  let transfer_accounts = Transfer {
      from: ctx.accounts.user.to_account_info(),
      to: ctx.accounts.vault_account.to_account_info(),
  };
  ```

`CpiContext`, şu bilgileri belirtir:

- Çağrılacak program (Sistem Programı)
- CPI'de gereken hesaplar (`Transfer` yapısında tanımlanmış)

  ```rs filename="lib.rs"
  let cpi_context = CpiContext::new(
      ctx.accounts.system_program.to_account_info(),
      transfer_accounts,
  );
  ```

`transfer` fonksiyonu, transfer talimatını Sistem Programı'na çağırarak, şunları geçirir:

- `cpi_context` (program ve hesaplar)
- Transfer edilecek tutar (1.000.000 lamport, 0.001 SOL'ye eşdeğer)

  ```rs filename="lib.rs"
  transfer(cpi_context, 1_000_000)?;
  ```

---

CPI için olan yapı, istemci tarafı talimatlarının nasıl oluşturulduğuna benzer; programı, hesapları ve belirli bir talimat için çağrılacak talimat verilerini belirtiriz. Programımızın `update` talimatı çağrıldığında, arka planda Sistem Programı'nın transfer talimatını çağırır.




Programı yeniden inşa edin.

```shell filename="Terminal"
build
```

### Silme Talimatını Değiştir

Artık `Delete` yapısını ve `delete` fonksiyonunu değiştirerek bir "silme sırasında geri ödeme" mekanizması uygulayacağız.

Öncelikle, `Delete` yapısını `vault_account` içerecek şekilde güncelleyin. Bu, kullanıcı mesaj hesabını kapatınca kasadaki herhangi bir SOL'un kullanıcıya transfer edilmesine olanak tanır.

```rs filename="lib.rs"
#[account(
    mut,
    seeds = [b"vault", user.key().as_ref()],
    bump,
)]
pub vault_account: SystemAccount<'info>,
```

Ayrıca transferin CPI için Sistem Programını çağırmak üzere `system_program`'ı ekleyin.

```rs filename="lib.rs"
pub system_program: Program<'info, System>,
```




```diff
#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

+   #[account(
+       mut,
+       seeds = [b"vault", user.key().as_ref()],
+       bump,
+   )]
+   pub vault_account: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        close= user,
    )]
    pub message_account: Account<'info, MessageAccount>,
+   pub system_program: Program<'info, System>,
}
```




`vault_account`, Güncelleme yapısında olduğu gibi aynı PDA türetilmesi kullanmaktadır.

`Delete` yapısına `vault_account` eklemek, programımızın silme talimatı sırasında kullanıcının kasa hesabına erişmesine olanak tanır ve biriken herhangi bir SOL'un kullanıcıya geri transfer edilmesini sağlar.




Sonra, `delete` talimatında vault hesabından kullanıcının hesabına SOL transfer etmek için CPI mantığını uygulayın.

```rs filename="lib.rs"
let user_key = ctx.accounts.user.key();
let signer_seeds: &[&[&[u8]]] =
    &[&[b"vault", user_key.as_ref(), &[ctx.bumps.vault_account]]];

let transfer_accounts = Transfer {
    from: ctx.accounts.vault_account.to_account_info(),
    to: ctx.accounts.user.to_account_info(),
};
let cpi_context = CpiContext::new(
    ctx.accounts.system_program.to_account_info(),
    transfer_accounts,
).with_signer(signer_seeds);
transfer(cpi_context, ctx.accounts.vault_account.lamports())?;
```

:::warning
Not: `_ctx: Context` ifadesini `ctx: Context` olarak güncelledik çünkü işlevin gövdesinde bu bağlamı kullanacağız.
:::




```diff
-    pub fn delete(_ctx: Context<Delete>) -> Result<()> {
+    pub fn delete(ctx: Context<Delete>) -> Result<()> {
         msg!("Mesajı Sil");

+        let user_key = ctx.accounts.user.key();
+        let signer_seeds: &[&[&[u8]]] =
+            &[&[b"vault", user_key.as_ref(), &[ctx.bumps.vault_account]]];
+
+        let transfer_accounts = Transfer {
+            from: ctx.accounts.vault_account.to_account_info(),
+            to: ctx.accounts.user.to_account_info(),
+        };
+        let cpi_context = CpiContext::new(
+            ctx.accounts.system_program.to_account_info(),
+            transfer_accounts,
+        ).with_signer(signer_seeds);
+        transfer(cpi_context, ctx.accounts.vault_account.lamports())?;
         Ok(())
     }

```




Silme talimatında, Sistem Programı'nın transfer talimatını çağırmak için başka bir Çapraz Program Çağrısı (CPI) gerçekleştiriyoruz. Bu CPI, bir Program Türevli Adres (PDA) imza gerektiren bir transfer gerçekleştirmeyi gösterir.

Öncelikle, kasanın PDA'sı için imza tohumlarını tanımlıyoruz:

```rs filename="lib.rs"
let user_key = ctx.accounts.user.key();
let signer_seeds: &[&[&[u8]]] =
    &[&[b"vault", user_key.as_ref(), &[ctx.bumps.vault_account]]];
```

`Transfer` yapısı, Sistem Programı'nın transfer talimatı için gereken hesapları belirtir:

- from: Kasa hesabı (fonların kaynağı)
- to: Kullanıcının hesabı (fonların hedefi)

  ```rs filename="lib.rs"
  let transfer_accounts = Transfer {
      from: ctx.accounts.vault_account.to_account_info(),
      to: ctx.accounts.user.to_account_info(),
  };
  ```

`CpiContext` şu bilgileri belirtir:

- Çağrılacak program (Sistem Programı)
- Transferde yer alan hesaplar (Transfer yapısında tanımlanmış)
- PDA için imza tohumları

  ```rs filename="lib.rs"
  let cpi_context = CpiContext::new(
      ctx.accounts.system_program.to_account_info(),
      transfer_accounts,
  ).with_signer(signer_seeds);
  ```

`transfer` fonksiyonu, transfer talimatını Sistem Programı'na çağırır ve şunları geçirir:

- `cpi_context` (program, hesaplar ve PDA imzası)
- Transfer edilecek miktar (kasa hesabının tüm bakiyesi)

  ```rs filename="lib.rs"
  transfer(cpi_context, ctx.accounts.vault_account.lamports())?;
  ```

Bu CPI uygulaması, programların fonları yönetmek için PDAları nasıl kullanabileceğini gösterir. Programımızın silme talimatı çağrıldığında, arka planda Sistem Programı'nın transfer talimatını çağırır ve tüm fonların kasadan kullanıcıya geri transfer edilmesine izin vermek için PDA'yı imzalayarak yetkilendirir.




Programı yeniden inşa edin.

```shell filename="Terminal"
build
```

### Programı Yeniden Yayınla

Bu değişiklikleri yaptıktan sonra, güncellenen programımızı yeniden yayınlamamız gerekiyor. Bu, değiştirilmiş programımızın test için mevcut olmasını sağlar. Solana'da bir programı güncellemek, yalnızca derlenmiş programı aynı program kimliği ile yayınlamayı gerektirir.

```shell filename="Terminal"
deploy
```




```bash
$ deploy
Yayınlanıyor... Bu işlemler, program boyutuna ve ağ koşullarına bağlı olarak biraz zaman alabilir.
Yayınlama başarılı. 17 saniyede tamamlandı.
```




Programı yalnızca yükseltme yetkisine sahip olanı güncelleyebilir. Yükseltme yetkisi, program yayınlandığında ayarlanır ve programı değiştirme veya kapatma iznine sahip olan tek hesap budur. Yükseltme yetkisi iptal edilirse, program değiştirilemez hale gelir ve hiçbir zaman kapatılamaz veya güncellenemez.

Solana Playground'da programları yayınlarken, Playground cüzdanınız tüm programlarınız için yükseltme yetkisine sahiptir.




### Test Dosyasını Güncelle

Sonraki aşamada, `anchor.test.ts` dosyamızı talimatlarımıza yeni kasa hesabını dahil etmek için güncelleyeceğiz. Bu, kasa PDA'sını türetmeyi ve bunu güncelleme ve silme talimatı çağrılarımıza dahil etmeyi gerektirir.

#### Kasa PDA'sını Türetilmesi

Öncelikle, kasa PDA türetmesini ekleyin:

```ts filename="anchor.test.ts"
const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), wallet.publicKey.toBuffer()],
  program.programId,
);
```




```diff
describe("pda", () => {
  const program = pg.program;
  const wallet = pg.wallet;

  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("message"), wallet.publicKey.toBuffer()],
    program.programId
  );

+  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
+    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
+    program.programId
+  );

  // ...testler
  });
```




#### Güncelleme Testini Değiştir

Sonra, güncelleme talimatını `vaultAccount`'ı dahil edecek şekilde güncelleyin.

```ts filename="anchor.test.ts"  {5}
const transactionSignature = await program.methods
  .update(message)
  .accounts({
    messageAccount: messagePda,
    vaultAccount: vaultPda,
  })
  .rpc({ commitment: "confirmed" });
```




```diff
    const transactionSignature = await program.methods
      .update(message)
      .accounts({
        messageAccount: messagePda,
+       vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });
```




#### Silme Testini Değiştir

Ardından, silme talimatını `vaultAccount`'ı dahil edecek şekilde güncelleyin.

```ts filename="anchor.test.ts"  {5}
const transactionSignature = await program.methods
  .delete()
  .accounts({
    messageAccount: messagePda,
    vaultAccount: vaultPda,
  })
  .rpc({ commitment: "confirmed" });
```




```diff
    const transactionSignature = await program.methods
      .delete()
      .accounts({
        messageAccount: messagePda,
+       vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });
```




### Testi Tekrar Çalıştır

Bu değişiklikleri yaptıktan sonra, her şeyin beklenildiği şekilde çalıştığından emin olmak için testleri çalıştırın:

```shell filename="Terminal"
test
```




```bash
$ test
Testler çalışıyor...
  anchor.test.ts:
  pda
    {
  "user": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "message": "Merhaba, Dünya!",
  "bump": 254
}
    İşlem İmzası: https://solana.fm/tx/qGsYb87mUUjeyh7Ha7r9VXkACw32HxVBujo2NUxqHiUc8qxRMFB7kdH2D4JyYtPBx171ddS91VyVrFXypgYaKUr?cluster=devnet-solana
    ✔ Mesaj Hesabı Oluşturuldu (842ms)
    {
  "user": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "message": "Merhaba, Solana!",
  "bump": 254
}
    İşlem İmzası: https://solana.fm/tx/3KCDnNSfDDfmSy8kpiSrJsGGkzgxx2mt18KejuV2vmJjeyenkSoEfs2ghUQ6cMoYYgd9Qax9CbnYRcvF2zzumNt8?cluster=devnet-solana
    ✔ Mesaj Hesabını Güncelle (946ms)
    Beklenen Null: null
    İşlem İmzası: https://solana.fm/tx/3M7Z7Mea3TtQc6m9z386B9QuEgvLKxD999mt2RyVtJ26FgaAzV1QA5mxox3eXie3bpBkNpDQ4mEANr3trVHCWMC2?cluster=devnet-solana
    ✔ Mesaj Hesabını Sil (859ms)
  3 geçer (3s)
```




Ardından, güncelleme ve silme talimatları içindeki transfer talimatları için CPI'leri görmek üzere SolanFM bağlantılarına göz atabilirsiniz.

![Güncelleme CPI](../../../images/solana/public/assets/docs/intro/quickstart/cpi-update.png)

![Silme CPI](../../../images/solana/public/assets/docs/intro/quickstart/cpi-delete.png)

Herhangi bir hata ile karşılaşırsanız, [son kod](https://beta.solpg.io/668304cfcffcf4b13384d20a) referansına başvurabilirsiniz.



## Sonraki Adımlar

Solana Hızlı Başlangıç kılavuzunu tamamladınız! Hesaplar, işlemler, PDA'lar, CPI'ler hakkında bilgi edindiniz ve kendi programlarınızı yayınladınız.

:::tip
Bu kılavuzda ele alınan konular hakkında daha kapsamlı açıklamalar için `Temel Kavramlar` sayfasını ziyaret edin.
:::

Ek öğrenme kaynakları, `Geliştirici Kaynakları` sayfasında bulunabilir.

### Daha Fazla Örneği Keşfedin

Eğer örnekler üzerinden öğrenmekten hoşlanıyorsanız, çeşitli örnek programlar için [Program Örnekleri Deposu](https://github.com/solana-developers/program-examples) sayfasına göz atın.

Solana Playground, projeleri GitHub bağlantılarını kullanarak içe aktarmak veya görüntülemek için uygun bir özellik sunar. Örneğin, [Solana Playground bağlantısını](https://beta.solpg.io/https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/anchor) açarak bu [Github deposundaki](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/anchor) Anchor projesini görüntüleyebilirsiniz.

`İçe Aktar` butonuna tıklayın ve bir proje adı girerek bunu Solana Playground'daki projeler listesine ekleyin. Bir proje içe aktarıldığında, tüm değişiklikler otomatik olarak kaydedilir ve Playground ortamında korunur.