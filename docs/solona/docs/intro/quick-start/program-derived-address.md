---
sidebarLabel: Program Türetilmiş Adresi
title: Program Türetilmiş Adresi
sidebarSortOrder: 4
description:
  Program Türetilmiş Adresler (PDA'lar) ve Anchor çerçevesini kullanarak bir CRUD
  (Oluştur, Oku, Güncelle, Sil) Solana programı nasıl oluşturulur öğrenin. Bu
  adım adım rehber, PDA'lar kullanarak zincir üstü mesaj hesapları oluşturmayı,
  güncellemeyi ve silmeyi, hesap doğrulamayı ve test yazmayı göstermektedir.
  PDA'ları Solana programlarında nasıl kullanacağınızı anlamak isteyen
  geliştiriciler için mükemmel.
---

Bu bölümde basit bir CRUD (Oluştur, Oku, Güncelle, Sil) programının nasıl
oluşturulacağını gözden geçireceğiz. Program, bir kullanıcının mesajını Program
Türetilmiş Adres (PDA) kullanarak hesap adresi olarak saklayacaktır.

:::tip
Bu bölümün amacı, Anchor çerçevesini kullanarak bir Solana programı oluşturma ve
test etme adımlarını geçmenize yardımcı olmaktır ve bir program içinde PDA'ların
nasıl kullanılacağını göstermektir. Daha fazla ayrıntı için
`Program Türetilmiş Adresi` sayfasına başvurun.
:::

Referans olarak, PDA ve CPI bölümlerinin tamamlanmasının ardından
[son kodu](https://beta.solpg.io/668304cfcffcf4b13384d20a) burada bulabilirsiniz.



### Başlangıç Kodu

Başlamak için bu
[Solana Playground bağlantısını](https://beta.solpg.io/66734b7bcffcf4b13384d1ad) 
açın ve başlangıç kodunu içe aktarın. Sonra "İçe Aktar" düğmesine tıklayın, bu
programı Solana Playground'daki projeler listesine ekleyecektir.

![Import](../../../images/solana/public/assets/docs/intro/quickstart/pg-import.png)

`lib.rs` dosyasında, aşağıdaki `create`, `update` ve `delete` komutlarının
uygulanacağı bir program iskeleti bulacaksınız.

```rs filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("8KPzbM2Cwn4Yjak7QYAEH9wyoQh86NcBicaLuzPaejdw");

#[program]
pub mod pda {
    use super::*;

    pub fn create(_ctx: Context<Create>) -> Result<()> {
        Ok(())
    }

    pub fn update(_ctx: Context<Update>) -> Result<()> {
        Ok(())
    }

    pub fn delete(_ctx: Context<Delete>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create {}

#[derive(Accounts)]
pub struct Update {}

#[derive(Accounts)]
pub struct Delete {}

#[account]
pub struct MessageAccount {}
```

Başlamadan önce, başlangıç programının başarıyla derlenip derlenmediğini
kontrol etmek için Playground terminalinde `build` komutunu çalıştırın.

```shell filename="Terminal"
build
```




```shell filename="Terminal"
$ build
Inşa ediliyor...
Başarıyla tamamlandı. 3.50s'de tamamlandı.
```




### Mesaj Hesap Türünü Tanımlama

Öncelikle, programımızın oluşturacağı mesaj hesabının yapısını tanımlayalım. Bu
program tarafından oluşturulan hesapta saklayacağımız veridir.

`lib.rs` dosyasında, `MessageAccount` yapısını aşağıdaki gibi güncelleyin:

```rs filename="lib.rs"
#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub message: String,
    pub bump: u8,
}
```




```diff
- #[account]
- pub struct MessageAccount {}

+ #[account]
+ pub struct MessageAccount {
+     pub user: Pubkey,
+     pub message: String,
+     pub bump: u8,
+ }
```




Anchor programında `#[account]` makrosu, AccountInfo'nun veri
alanında saklanacak veri türlerini temsil eden yapıları işaretlemek için kullanılır.

Bu örnekte, kullanıcılar tarafından oluşturulan bir mesajı saklamak için bir
`MessageAccount` yapısını tanımlıyoruz. Bu yapı üç alan içerir:

- `user` - Mesaj hesabını oluşturan kullanıcıyı temsil eden bir Pubkey.
- `message` - Kullanıcının mesajını içeren bir String.
- `bump` - Program türetilmiş adresini (PDA) türetirken kullanılan `"bump"
tohumunu` saklayan bir u8. Bu değeri saklamak,
bunu sonraki talimatlarda yeniden türetme ihtiyacını ortadan kaldırarak
işlem maliyetleri açısından tasarruf sağlar. Bir hesap oluşturulduğunda,
`MessageAccount` verisi serileştirilir ve yeni hesabın veri alanında saklanır.

Daha sonra, hesaptan okuma yaparken, bu veri `MessageAccount` veri türüne
geri serileştirilebilir. Hesap verisini oluşturma ve okuma işlemi test bölümünde
gösterilecektir.




Programı tekrar derleyin ve terminalde `build` komutunu çalıştırın.

```shell filename="Terminal"
build
```

Mesaj hesabımızın nasıl görüneceğini tanımladık. Sırada program talimatlarını
uygulamak var.

### Oluştur Talimatını Uygulama

Şimdi, `MessageAccount` oluşturmak ve başlatmak için `create` talimatını
uygulayalım.

Öncelikle, talimat için gerekli hesapları tanımlamak amacıyla `Create`
yapısını aşağıdaki gibi güncelleyin:

```rs filename="lib.rs"
#[derive(Accounts)]
#[instruction(message: String)]
pub struct Create<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        seeds = [b"message", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + 4 + message.len() + 1
    )]
    pub message_account: Account<'info, MessageAccount>,
    pub system_program: Program<'info, System>,
}
```




```diff
- #[derive(Accounts)]
- pub struct Create {}

+ #[derive(Accounts)]
+ #[instruction(message: String)]
+ pub struct Create<'info> {
+     #[account(mut)]
+     pub user: Signer<'info>,
+
+     #[account(
+         init,
+         seeds = [b"message", user.key().as_ref()],
+         bump,
+         payer = user,
+         space = 8 + 32 + 4 + message.len() + 1
+     )]
+     pub message_account: Account<'info, MessageAccount>,
+     pub system_program: Program<'info, System>,
+ }
```




Anchor programında `#[derive(Accounts)]` makrosu, bir talimat için gerekli
hesaplar listesini temsil eden yapıları işaretlemek için kullanılır. Yapıdaki
her alan bir hesaptır.

Yapıdaki her hesap (alan) bir hesap türü (ör. `Signer`) ile etiketlenir ve
daha fazla kısıtlama ile işaretlenebilir (ör. `#[account(mut)]`). Hesap türü ve
hesap kısıtlamaları, talimata geçirilen hesaplar üzerinde güvenlik kontrolleri
gerçekleştirmek için kullanılır.

Her alanın adı sadece bizim anlayışımız içindir ve hesap doğrulama üzerinde
hiçbir etkisi yoktur; ancak, açıklayıcı hesap adları kullanması önerilir.

`Create` yapısı, `create` talimatı için gerekli hesapları tanımlar.

1. `user: Signer`

   - Mesaj hesabını oluşturan kullanıcıyı temsil eder.
   - Yeni hesabın oluşturulması için ödeme yapacağı için değişken olarak işaretlenmiştir (`#[account(mut)]`).
   - İşlemi onaylamak için bir imza sahibi olmalıdır; çünkü lamportlar
     hesaplardan düşülür.

2. `message_account: Account`

   - Kullanıcının mesajını saklamak için oluşturulacak yeni hesap.
   - `init` kısıtlaması, bu hesabın talimat içinde oluşturulacağını gösterir.
   - `seeds` ve `bump` kısıtlamaları, hesabın bir Program Türetilmiş Adresi (PDA) olduğunu gösterir.
   - `payer = user`, yeni hesabın oluşturulması için ödemeyi yapacak olan
     hesabı belirtir.
   - `space`, yeni hesabın veri alanına ayrılan byte sayısını belirtir.

3. `system_program: Program`

   - Yeni hesapların oluşturulması için gereklidir.
   - Arkada, `init` kısıtlaması, belirtilen `space` ile yeni bir hesap
     oluşturmak üzere Sistem Programını çağırır ve program sahibini mevcut
     programa atar.

`#[instruction(message: String)]` açıklaması, `Create` yapısının
`create` talimatından `message` parametresine erişimini sağlar.

`seeds` ve `bump` kısıtlamaları, bir hesabın adresinin bir Program
Türetilmiş Adresi (PDA) olduğunu belirtmek için birlikte kullanılır.

```rs filename="lib.rs"
seeds = [b"message", user.key().as_ref()],
bump,
```

`seeds` kısıtlaması, PDA'yı türetmek için kullanılan isteğe bağlı girişleri
tanımlar.

- `b"message"` - İlk tohum olarak sabit bir dize.
- `user.key().as_ref()` - İkinci tohum olarak `user` hesabının genel anahtarı.

`bump` kısıtlaması, Anchor'un doğru bump tohumunu otomatik olarak bulup
kullanmasını söyler. Anchor, `seeds` ve `bump` kullanarak PDA'yı türetecektir.

`space` hesaplaması (8 + 32 + 4 + message.len() + 1), `MessageAccount` veri
tipi için alan tahsis eder:

- Anchor Hesap ayırıcı (tanımlayıcı): 8 byte
- Kullanıcı Adresi (Pubkey): 32 byte
- Kullanıcı Mesajı (String): 4 byte uzunluğa + değişken mesaj uzunluğu
- PDA Bump tohumu (u8): 1 byte

```rs filename="lib.rs"
#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub message: String,
    pub bump: u8,
}
```

Anchor programları aracılığıyla oluşturulan tüm hesaplar için 8 byte'lık bir
hesap ayırıcı gereklidir; bu, hesaptan oluşturulurken otomatik olarak
oluşturulan bir tanımlayıcıdır.

Bir `String` türü, dize uzunluğunu saklamak için 4 byte gerektirir ve kalan uzunluk
ise gerçek veridir.




Programı tekrar derleyin ve terminalde `build` komutunu çalıştırın.

```shell filename="Terminal"
build
```

Artık mesaj hesabımızın nasıl görüneceğini tanımladık. Sırada program talimatlarını
uygulamak var.

### Oluştur Talimatını Uygulama

Şimdi, `MessageAccount` oluşturmak ve başlatmak için `create` talimatını
uygulayalım.

Öncelikle, talimat için gerekli hesapları tanımlamak amacıyla `Create`
yapısını aşağıdaki gibi güncelleyin:

```rs filename="lib.rs"
pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
    msg!("Mesaj Oluştur: {}", message);
    let account_data = &mut ctx.accounts.message_account;
    account_data.user = ctx.accounts.user.key();
    account_data.message = message;
    account_data.bump = ctx.bumps.message_account;
    Ok(())
}
```




```diff
- pub fn create(_ctx: Context<Create>) -> Result<()> {
-     Ok(())
- }

+ pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
+     msg!("Mesaj Oluştur: {}", message);
+     let account_data = &mut ctx.accounts.message_account;
+     account_data.user = ctx.accounts.user.key();
+     account_data.message = message;
+     account_data.bump = ctx.bumps.message_account;
+     Ok(())
+ }
```




`create` fonksiyonu, yeni bir mesaj hesabının verisini başlatma mantığını
uygular. İki parametre alır:

1. `ctx: Context` - `Create` yapısında belirtilen hesaplara erişim
   sağlar.
2. `message: String` - Saklanacak kullanıcının mesajı.

Fonksiyonun gövdesi aşağıdaki mantığı gerçekleştirir:

1. `msg!()` makrosunu kullanarak program günlüklerine bir mesaj yazdırır.

   ```rs
   msg!("Mesaj Oluştur: {}", message);
   ```

2. Hesap Verisini Başlatma:

   - Bağlamdan `message_account`'a erişir.

   ```rs
   let account_data = &mut ctx.accounts.message_account;
   ```

   - `user` alanını `user` hesabının genel anahtarına ayarlar.

   ```rs
   account_data.user = ctx.accounts.user.key();
   ```

   - `message` alanını fonksiyon argümanından gelen `message` ile ayarlar.

   ```rs
   account_data.message = message;
   ```

   - PDA'yı türetmek için kullanılan `bump` değerini, `ctx.bumps.message_account`'dan alır.

   ```rs
   account_data.bump = ctx.bumps.message_account;
   ```




Programı yeniden derleyin.

```shell filename="Terminal"
build
```

### Güncelle Talimatını Uygulama

Sırada, `MessageAccount`'ı yeni bir mesajla güncellemek için `update` talimatını
uygulamak var.

Öncelikle, `update` talimatı için gerekli hesapları tanımlamak üzere
`Update` yapısını aşağıdaki gibi güncelleyin:

```rs filename="lib.rs"
#[derive(Accounts)]
#[instruction(message: String)]
pub struct Update<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

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




```diff
- #[derive(Accounts)]
- pub struct Update {}

+ #[derive(Accounts)]
+ #[instruction(message: String)]
+ pub struct Update<'info> {
+     #[account(mut)]
+     pub user: Signer<'info>,
+
+     #[account(
+         mut,
+         seeds = [b"message", user.key().as_ref()],
+         bump = message_account.bump,
+         realloc = 8 + 32 + 4 + message.len() + 1,
+         realloc::payer = user,
+         realloc::zero = true,
+     )]
+     pub message_account: Account<'info, MessageAccount>,
+     pub system_program: Program<'info, System>,
+ }
```




`Update` yapısı, `update` talimatı için gerekli hesapları tanımlar.

1. `user: Signer`

   - Mesaj hesabını güncelleyen kullanıcıyı temsil eder.
   - `message_account`'ın boyutunu artırmak için gerekirse ödemeyi yapacağı için
     değişken olarak işaretlenmiştir (`#[account(mut)]`).
   - İşlemi onaylamak için bir imza sahibi olmalıdır.

2. `message_account: Account`

   - Kullanıcının mesajını saklayan mevcut hesap.
   - `mut` kısıtlaması, bu hesabın verisinin değiştirileceğini belirtir.
   - `realloc` kısıtlaması, hesabın verisini yeniden boyutlandırmasına izin verir.
   - `seeds` ve `bump` kısıtlamaları, hesabın doğru PDA olduğunu garanti eder.

3. `system_program: Program`
   - Hesap alanı yeniden tahsisatı için gereklidir.
   - `realloc` kısıtlaması, hesap verisinin boyutunu ayarlamak için Sistem
     Programını çağırır.

`bump = message_account.bump` kısıtlaması, Anchor'un yeniden hesaplamak yerine
`message_account`'da saklanan bump tohumunu kullanmasını sağlar.

`#[instruction(message: String)]` açıklaması, `Update` yapısının `update`
talimatından `message` parametresine erişimini sağlar.




Sonrasında, `update` talimatının mantığını uygulayın.

```rs filename="lib.rs"
pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
    msg!("Mesaj Güncelle: {}", message);
    let account_data = &mut ctx.accounts.message_account;
    account_data.message = message;
    Ok(())
}
```




```diff
- pub fn update(_ctx: Context<Update>) -> Result<()> {
-     Ok(())
- }

+ pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
+     msg!("Mesaj Güncelle: {}", message);
+     let account_data = &mut ctx.accounts.message_account;
+     account_data.message = message;
+     Ok(())
+ }
```




`update` fonksiyonu, mevcut bir mesaj hesabını değiştirme mantığını
uygular. İki parametre alır:

1. `ctx: Context` - `Update` yapısında belirtilen hesaplara erişim
   sağlar.
2. `message: String` - Mevcut olanın yerine geçecek yeni mesaj.

Fonksiyonun gövdesi:

1. Program günlüklerine bir mesaj yazdırır.

2. Hesap Verisini Güncelleme:
   - Bağlamdan `message_account`'a erişir.
   - `message` alanını fonksiyon argümanındaki yeni `message` ile ayarlar.




Programı tekrar derleyin.

```shell filename="Terminal"
build
```

### Silme Talimatını Uygulama

Şimdi, `MessageAccount`'ı kapatmak için `delete` talimatını uygulamak var.

`Delete` yapısını aşağıdaki gibi güncelleyin:

```rs filename="lib.rs"
#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        close= user,
    )]
    pub message_account: Account<'info, MessageAccount>,
}
```




```diff
- #[derive(Accounts)]
- pub struct Delete {}

+ #[derive(Accounts)]
+ pub struct Delete<'info> {
+     #[account(mut)]
+     pub user: Signer<'info>,
+
+     #[account(
+         mut,
+         seeds = [b"message", user.key().as_ref()],
+         bump = message_account.bump,
+         close = user,
+     )]
+     pub message_account: Account<'info, MessageAccount>,
+ }
```




`Delete` yapısı, `delete` talimatı için gerekli hesapları tanımlar:

1. `user: Signer`

   - Mesaj hesabını kapatan kullanıcıyı temsil eder.
   - Değişken olarak işaretlenmiştir (`#[account(mut)]`) çünkü kapanan hesaptan
     lamportları alacaktır.
   - Doğru kullanıcının mesaj hesabını kapatmasını sağlamak için bir imza
     sahibi olmalıdır.

2. `message_account: Account`

   - Kapatılan hesap.
   - `mut` kısıtlaması, bu hesabın değiştirileceğini belirtir.
   - `seeds` ve `bump` kısıtlamaları, hesabın doğru PDA olduğunu garanti eder.
   - `close = user` kısıtlaması, bu hesabın kapatılacağını ve lamportlarının 
     `user` hesabına aktarılacağını belirtir.




Sırada, `delete` talimatının mantığını uygulamak var.

```rs filename="lib.rs"
pub fn delete(_ctx: Context<Delete>) -> Result<()> {
    msg!("Mesaj Silindi");
    Ok(())
}
```




```diff
- pub fn delete(_ctx: Context<Delete>) -> Result<()> {
-     Ok(())
- }

+ pub fn delete(_ctx: Context<Delete>) -> Result<()> {
+     msg!("Mesaj Silindi");
+     Ok(())
+ }
```




`delete` fonksiyonu bir parametre alır:

1. `_ctx: Context` - `Delete` yapısında belirtilen hesaplara erişim
   sağlar. `_ctx` sözdizimi, fonksiyonun gövdesinde Context'i kullanmayacağımızı
   belirtir.

Fonksiyonun gövdesi yalnızca program günlüklerine bir mesaj yazdırır. 
Fonksiyonun herhangi bir ek mantığa ihtiyacı yoktur çünkü hesabın gerçek kapanması
`Delete` yapısındaki `close` kısıtlaması tarafından işlenir.




Programı tekrar derleyin.

```shell filename="Terminal"
build
```

### Programı Yayınlama

Temel CRUD programı şimdi tamamlandı. Programı yayınlamak için Playground
terminalinde `deploy` komutunu çalıştırın.

```shell filename="Terminal"
deploy
```




```bash
$ deploy
Yayınlanıyor... Bu, program boyutuna ve ağ koşullarına bağlı olarak biraz zaman
alabilir.
Yayınlama başarılı. 17s içinde tamamlandı.
```




### Test Dosyası Kurulumu

Başlangıç koduyla birlikte `anchor.test.ts` adlı bir test dosyası da bulunmaktadır.

```ts filename="anchor.test.ts"
import { PublicKey } from "@solana/web3.js";

describe("pda", () => {
  it("Mesaj Hesabı Oluştur", async () => {});

  it("Mesaj Hesabı Güncelle", async () => {});

  it("Mesaj Hesabı Sil", async () => {});
});
```

Aşağıdaki kodu `describe` içine ekleyin, ancak `it` bölümlerinden önce.

```ts filename="anchor.test.ts"
const program = pg.program;
const wallet = pg.wallet;

const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("message"), wallet.publicKey.toBuffer()],
  program.programId,
);
```


Fark

```diff
  import { PublicKey } from "@solana/web3.js";

  describe("pda", () => {
+    const program = pg.program;
+    const wallet = pg.wallet;
+
+    const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
+      [Buffer.from("message"), wallet.publicKey.toBuffer()],
+      program.programId
+    );

    it("Mesaj Hesabı Oluştur", async () => {});

    it("Mesaj Hesabı Güncelle", async () => {});

    it("Mesaj Hesabı Sil", async () => {});
  });
```




Açıklama

Bu bölümde, test dosyasını basitçe kuruyoruz.

:::info
Solana Playground, `pg.program`'ın programla etkileşimde bulunmak için istemci kitaplığına erişmemizi sağladığı bazı gereksiz bileşenleri kaldırır, `pg.wallet` ise oyun alanı cüzdanınızdır.
:::

```ts filename="anchor.test.ts"
const program = pg.program;
const wallet = pg.wallet;
```

Kurulumun bir parçası olarak, mesaj hesabı PDA'sını türetiyoruz. Bu, programda belirtilen tohumları kullanarak Javascript'te PDA'yı nasıl türeteceğimizi gösterir.

```ts filename="anchor.test.ts"
const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("message"), wallet.publicKey.toBuffer()],
  program.programId,
);
```



Test dosyasını, Playground terminalinde `test` komutunu çalıştırarak test edin, dosyanın beklendiği gibi çalıştığını kontrol edin. Testleri aşağıdaki adımlarla gerçekleştireceğiz.

```shell filename="Terminal"
test
```


Çıktı

```bash
$ test
Testler çalışıyor...
  anchor.test.ts:
  pda
    ✔ Mesaj Hesabı Oluştur
    ✔ Mesaj Hesabı Güncelle
    ✔ Mesaj Hesabı Sil
  3 başarılı (4ms)
```



### Create Instruction'ı Çağırın

İlk testi aşağıdaki ile güncelleyin:

```ts filename="anchor.test.ts"
it("Mesaj Hesabı Oluştur", async () => {
  const message = "Merhaba, Dünya!";
  const transactionSignature = await program.methods
    .create(message)
    .accounts({
      messageAccount: messagePda,
    })
    .rpc({ commitment: "confirmed" });

  const messageAccount = await program.account.messageAccount.fetch(
    messagePda,
    "confirmed",
  );

  console.log(JSON.stringify(messageAccount, null, 2));
  console.log(
    "İşlem İmzası:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```


Fark

```diff
- it("Mesaj Hesabı Oluştur", async () => {});

+ it("Mesaj Hesabı Oluştur", async () => {
+   const message = "Merhaba, Dünya!";
+   const transactionSignature = await program.methods
+     .create(message)
+     .accounts({
+       messageAccount: messagePda,
+     })
+     .rpc({ commitment: "confirmed" });
+
+   const messageAccount = await program.account.messageAccount.fetch(
+     messagePda,
+     "confirmed"
+   );
+
+   console.log(JSON.stringify(messageAccount, null, 2));
+   console.log(
+     "İşlem İmzası:",
+     `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
+   );
+ });
```



Açıklama

Öncelikle, "Merhaba, Dünya!" mesajını geçirerek `create` talimatını çağıran bir işlem gönderiyoruz.

```ts filename="anchor.test.ts"
const message = "Merhaba, Dünya!";
const transactionSignature = await program.methods
  .create(message)
  .accounts({
    messageAccount: messagePda,
  })
  .rpc({ commitment: "confirmed" });
```

İşlem gönderildikten ve hesap oluşturulduktan sonra, adresini kullanarak hesabı alıyoruz (`messagePda`).

```ts filename="anchor.test.ts"
const messageAccount = await program.account.messageAccount.fetch(
  messagePda,
  "confirmed",
);
```

Son olarak, hesap verilerini ve işlem detaylarını görüntülemek için bir bağlantıyı günlüğe kaydediyoruz.

```ts filename="anchor.test.ts"
console.log(JSON.stringify(messageAccount, null, 2));
console.log(
  "İşlem İmzası:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```



### Update Instruction'ı Çağırın

İkinci testi aşağıdaki ile güncelleyin:

```ts filename="anchor.test.ts"
it("Mesaj Hesabı Güncelle", async () => {
  const message = "Merhaba, Solana!";
  const transactionSignature = await program.methods
    .update(message)
    .accounts({
      messageAccount: messagePda,
    })
    .rpc({ commitment: "confirmed" });

  const messageAccount = await program.account.messageAccount.fetch(
    messagePda,
    "confirmed",
  );

  console.log(JSON.stringify(messageAccount, null, 2));
  console.log(
    "İşlem İmzası:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```


Fark

```diff
- it("Mesaj Hesabı Güncelle", async () => {});

+ it("Mesaj Hesabı Güncelle", async () => {
+   const message = "Merhaba, Solana!";
+   const transactionSignature = await program.methods
+     .update(message)
+     .accounts({
+       messageAccount: messagePda,
+     })
+     .rpc({ commitment: "confirmed" });
+
+   const messageAccount = await program.account.messageAccount.fetch(
+     messagePda,
+     "confirmed"
+   );
+
+   console.log(JSON.stringify(messageAccount, null, 2));
+   console.log(
+     "İşlem İmzası:",
+     `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
+   );
+ });
```



Açıklama

Öncelikle, "Merhaba, Solana!" mesajını yeni mesaj olarak geçirmek suretiyle `update` talimatını çağıran bir işlem gönderiyoruz.

```ts filename="anchor.test.ts"
const message = "Merhaba, Solana!";
const transactionSignature = await program.methods
  .update(message)
  .accounts({
    messageAccount: messagePda,
  })
  .rpc({ commitment: "confirmed" });
```

İşlem gönderildikten ve hesap güncellendikten sonra, hesabı adresi (`messagePda`) kullanarak alıyoruz.

```ts filename="anchor.test.ts"
const messageAccount = await program.account.messageAccount.fetch(
  messagePda,
  "confirmed",
);
```

Son olarak, hesap verilerini ve işlem detaylarını görüntülemek için bir bağlantıyı günlüğe kaydediyoruz.

```ts filename="anchor.test.ts"
console.log(JSON.stringify(messageAccount, null, 2));
console.log(
  "İşlem İmzası:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```



### Delete Instruction'ı Çağırın

Üçüncü testi aşağıdaki ile güncelleyin:

```ts filename="anchor.test.ts"
it("Mesaj Hesabı Sil", async () => {
  const transactionSignature = await program.methods
    .delete()
    .accounts({
      messageAccount: messagePda,
    })
    .rpc({ commitment: "confirmed" });

  const messageAccount = await program.account.messageAccount.fetchNullable(
    messagePda,
    "confirmed",
  );

  console.log("Beklenen Null:", JSON.stringify(messageAccount, null, 2));
  console.log(
    "İşlem İmzası:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```


Fark

```diff
- it("Mesaj Hesabı Sil", async () => {});

+ it("Mesaj Hesabı Sil", async () => {
+   const transactionSignature = await program.methods
+     .delete()
+     .accounts({
+       messageAccount: messagePda,
+     })
+     .rpc({ commitment: "confirmed" });
+
+   const messageAccount = await program.account.messageAccount.fetchNullable(
+     messagePda,
+     "confirmed"
+   );
+
+   console.log("Beklenen Null:", JSON.stringify(messageAccount, null, 2));
+   console.log(
+     "İşlem İmzası:",
+     `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
+   );
+ });
```



Açıklama

Öncelikle, mesaj hesabını kapatmak için `delete` talimatını çağıran bir işlem gönderiyoruz.

```ts filename="anchor.test.ts"
const transactionSignature = await program.methods
  .delete()
  .accounts({
    messageAccount: messagePda,
  })
  .rpc({ commitment: "confirmed" });
```

İşlem gönderildikten ve hesap kapatıldıktan sonra, adresini kullanarak hesabı almayı deniyoruz (`messagePda`) ve değeri null olarak döndüreceği için `fetchNullable` kullanıyoruz.

```ts filename="anchor.test.ts"
const messageAccount = await program.account.messageAccount.fetchNullable(
  messagePda,
  "confirmed",
);
```

Son olarak, hesap verilerini ve işlem detaylarını görüntülemek için bir bağlantıyı günlüğe kaydediyoruz; burada hesap verileri null olarak kaydedilmelidir.

```ts filename="anchor.test.ts"
console.log(JSON.stringify(messageAccount, null, 2));
console.log(
  "İşlem İmzası:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```



### Testi Çalıştırma

Testler kurulduktan sonra, test dosyasını Playground terminalinde `test` komutunu çalıştırarak çalıştırın.

```shell filename="Terminal"
test
```


Çıktı

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
    İşlem İmzası: https://solana.fm/tx/5oBT4jEdUR6CRYsFNGoqvyMBTRDvFqRWTAAmCGM9rEvYRBWy3B2bkb6GVFpVPKBnkr714UCFUurBSDKSa7nLHo8e?cluster=devnet-solana
    ✔ Mesaj Hesabı Oluştur (1025ms)
    {
  "user": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "message": "Merhaba, Solana!",
  "bump": 254
}
    İşlem İmzası: https://solana.fm/tx/42veGAsQjHbJP1SxWBGcfYF7EdRN9X7bACNv23NSZNe4U7w2dmaYgSv8UUWXYzwgJPoNHejhtWdKZModHiMaTWYK?cluster=devnet-solana
    ✔ Mesaj Hesabı Güncelle (713ms)
    Beklenen Null: null
    İşlem İmzası: https://solana.fm/tx/Sseog2i2X7uDEn2DyDMMJKVHeZEzmuhnqUwicwGhnGhstZo8URNwUZgED8o6HANiojJkfQbhXVbGNLdhsFtWrd6?cluster=devnet-solana
    ✔ Mesaj Hesabı Sil (812ms)
  3 başarılı (3s)
```

