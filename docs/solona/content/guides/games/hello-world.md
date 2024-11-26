---
date: 2024-04-25T00:00:00Z
difficulty: beginner
title: Solana Oyun Geliştirme için Merhaba Dünya
description:
  Anchor framework'ünü kullanarak basit bir macera oyunu oluşturarak Solana oyunları
  geliştirmeye başlayın.
tags:
  - oyunlar
  - anchor
  - program
  - web3js
  - başlangıç
  - rust
keywords:
  - öğretici
  - blockchain geliştirici
  - blockchain öğretici
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
---

Bu geliştirme kılavuzunda, Solana blok zincirini kullanarak basit bir zincir üstü oyunu
geçeceğiz. Bu oyuna _Küçük Macera_ adı verilmektedir ve Anchor framework'ü kullanılarak
oluşturulmuş başlangıç dostu bir Solana programıdır. Bu programın amacı, oyuncuların
konumlarını takip etmelerini ve sola ya da sağa hareket etmelerini sağlayan basit bir
oyun oluşturmayı göstermektir.

> Tam kaynak kodunu, tarayıcınızdan dağıtılabilir halde bulabilirsiniz.
> Bu
> [Solana Playground örneği](https://beta.solpg.io/tutorials/tiny-adventure).

:::info
Anchor framework'ü ile tanışmak isterseniz, [Solana Kursu](https://www.soldev.app/course) içinde
yer alan Anchor modülüne göz atabilirsiniz.
:::

## Video Geçişi



## Başlarken

Başlangıç Solana geliştirmemizi hızlandırmak için, zincir üstü programımızı kodlamak,
oluşturmak ve dağıtmak amacıyla Solana Playground (web tabanlı IDE) kullanacağız. Bu,
Solana geliştirmeye başlamak için yerel olarak hiçbir şey kurmamızı gerektirmeyecektir.

### Solana Playground

[Solana Playground](https://beta.solpg.io/) adresine gidin ve yeni bir Anchor projesi oluşturun.
Eğer Solana Playground'a yeniyseniz, ayrıca bir Playground Cüzdanı oluşturmanız gerekecek.
İşte Solana Playground'u kullanmanın bir örneği:

![Solana Playground'un kurulumu](../../../images/solana/public/assets/guides/hello-world/solpg.gif)

### Başlangıç Program Kodu

Yeni bir Playground projesi oluşturduktan sonra, `lib.rs` dosyasındaki varsayılan başlangıç
kodunu aşağıdaki kod ile değiştirin:

```rust filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
mod tiny_adventure {
    use super::*;

    // talimat işleyicileri buraya eklenecek
}

// yapılar buraya eklenecek

fn print_player(player_position: u8) {
    if player_position == 0 {
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.......");
    } else if player_position == 1 {
        msg!("..o.....");
    } else if player_position == 2 {
        msg!("....o...");
    } else if player_position == 3 {
        msg!("........\\o/");
        msg!("Sonuna ulaştınız! Harika!");
    }
}
```

Bu oyunda, oyuncu 0 konumundan başlayacak ve sola veya sağa hareket edebilecektir. Oyuncunun
oyun boyunca ilerlemesini göstermek için, yolculuklarını görüntülemek üzere mesaj kayıtlarını
kullanacağız.

## Oyun Verisi Hesaplarını Tanımlama

Oyunun inşasının ilk adımı, oyuncunun konumunu depolayacak zincir üstü hesap için bir
yapı tanımlamaktır.

`GameDataAccount` yapısı, oyuncunun mevcut konumunu işarete eden `player_position` adlı
tek bir alana sahiptir.

```rust filename="lib.rs" {13-16} /GameDataAccount/ /player_position/
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
mod tiny_adventure {
    use super::*;

    ...
}

// Oyun Veri Hesabı yapısını tanımlayın
#[account]
pub struct GameDataAccount {
    player_position: u8,
}

...
```

## Program Talimatları

Küçük Macera programımız yalnızca 3
`talimat işleyicisinden` oluşmaktadır:

- `initialize` - oyuncunun konumunu depolamak için bir zincir üstü hesap kurar
- `move_left` - oyuncunun konumunu sola hareket ettirmesine olanak tanır
- `move_right` - oyuncunun konumunu sağa hareket ettirmesine olanak tanır

### Başlatma Talimatı

`initialize` talimatımız, mevcut değilse `GameDataAccount`ı başlatır, 
`player_position` değerini 0'a ayarlar ve bazı mesaj kayıtları yazdırır.

`initialize` talimatı 3 hesaba ihtiyaç duyar:

- `new_game_data_account` - başlattığımız `GameDataAccount`
- `signer` - `GameDataAccount`ın başlatılması için ödeme yapan oyuncu
- `system_program` - yeni bir hesap oluştururken gerekli olan bir hesap

```rust filename="lib.rs" {5-11} /new_game_data_account/ /signer/ /system_program/
#[program]
pub mod tiny_adventure {
    use super::*;

    // GameDataAccount'ı başlatan ve konumu 0'a ayarlayan talimat
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.new_game_data_account.player_position = 0;
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.......");
        Ok(())
    }
}

// Başlatma talimatı için gereken hesapları belirtin
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        seeds = [b"level1"],
        bump,
        payer = signer,
        space = 8 + 1
    )]
    pub new_game_data_account: Account<'info, GameDataAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

...
```

Bu örnekte, `GameDataAccount` adresi için bir `Program Türetilmiş Adres (PDA)` kullanılır.
Bu, adresi daha sonra belirlemek için deterministik olarak bulmamızı sağlar. Bu örnekte, PDA'nın
tek bir sabit değer (`level1`) ile tohumlanarak oluşturulduğu ve programımızı yalnızca bir
`GameDataAccount` oluşturmaya sınırladığı önemlidir. `init_if_needed` kısıtlaması, 
`GameDataAccount`ın yalnızca mevcut değilse başlatılmasını sağlar.

Mevcut uygulamanın, `GameDataAccount` üzerinde kimlerin değişiklik yapabileceğine dair
hiçbir kısıtlama olmadığını belirtmekte fayda var. Bu, oyunu herkesin oyuncunun hareketini
kontrol edebildiği çok oyunculu bir deneyime dönüştürmektedir.

:::warning
Alternatif olarak, göndericinin adresini `initialize` talimatında ek bir tohum olarak
kullanabilirsiniz; bu, her oyuncunun kendi `GameDataAccount`ını oluşturmasına olanak tanır.
:::

### Sola Hareket Talimatı

Artık bir `GameDataAccount` hesabını başlatabildiğimize göre, oyuncunun `player_position`
değerini güncellemesine olanak tanıyan `move_left` talimatını uygulayalım.

Bu örnekte, sola hareket etmek sadece `player_position` değerini 1 azaltmak anlamına
gelmektedir. Ayrıca en alt konumu 0 olarak ayarlayacağız. Bu talimat için gereken tek
hesap `GameDataAccount` olacaktır.

```rust filename="lib.rs" {6-16} /player_position/ /GameDataAccount/
#[program]
pub mod tiny_adventure {
    use super::*;
    ...

    // Sola hareket talimatı
    pub fn move_left(ctx: Context<MoveLeft>) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 0 {
            msg!("Başlangıçta geri döndünüz.");
        } else {
            game_data_account.player_position -= 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }
}

// move_left talimatı için gereken hesabı belirtin
#[derive(Accounts)]
pub struct MoveLeft<'info> {
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
}

...
```

### Sağa Hareket Talimatı

Son olarak, `move_right` talimatını uygulayalım. Benzer şekilde, sağa hareket
etmek `player_position` değerini 1 artırmak anlamına gelecektir. Ayrıca, maksimum
konumu 3 ile sınırlayacağız. 

Bu talimat için gerekli olan tek hesap `GameDataAccount` olacaktır.

```rust filename="lib.rs" {6-16} /player_position/ /GameDataAccount/
#[program]
pub mod tiny_adventure {
    use super::*;
    ...

    // Sağa hareket talimatı
    pub fn move_right(ctx: Context<MoveRight>) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 3 {
            msg!("Sonuna ulaştınız! Harika!");
        } else {
            game_data_account.player_position = game_data_account.player_position + 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }
}

// move_right talimatı için gereken hesabı belirtin
#[derive(Accounts)]
pub struct MoveRight<'info> {
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
}

...
```

## Oluşturma ve Dağıtma

Artık Küçük Macera programımızı tamamladık! Nihai programınız aşağıdaki gibi olmalıdır:

```rust filename="lib.rs"
use anchor_lang::prelude::*;

// Bu programın kamu anahtarıdır ve proje oluşturduğunuzda
// otomatik olarak güncellenecektir.
declare_id!("BouPBVWkdVHbxsdzqeMwkjqd5X67RX5nwMEwxn8MDpor");

#[program]
mod tiny_adventure {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.new_game_data_account.player_position = 0;
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.......");
        Ok(())
    }

    pub fn move_left(ctx: Context<MoveLeft>) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 0 {
            msg!("Başlangıçta geri döndünüz.");
        } else {
            game_data_account.player_position -= 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }

    pub fn move_right(ctx: Context<MoveRight>) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 3 {
            msg!("Sonuna ulaştınız! Harika!");
        } else {
            game_data_account.player_position = game_data_account.player_position + 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }
}

fn print_player(player_position: u8) {
    if player_position == 0 {
        msg!("Bir Yolculuk Başlıyor!");
        msg!("o.......");
    } else if player_position == 1 {
        msg!("..o.....");
    } else if player_position == 2 {
        msg!("....o...");
    } else if player_position == 3 {
        msg!("........\\o/");
        msg!("Sonuna ulaştınız! Harika!");
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        seeds = [b"level1"],
        bump,
        payer = signer,
        space = 8 + 1
    )]
    pub new_game_data_account: Account<'info, GameDataAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MoveLeft<'info> {
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
}

#[derive(Accounts)]
pub struct MoveRight<'info> {
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
}

#[account]
pub struct GameDataAccount {
    player_position: u8,
}
```

Program tamamlandığına göre, artık Solana Playground üzerinde derleyip dağıtma
zamanıdır!

Eğer bu ilk kez Solana Playground kullanıyorsanız, önce bir Playground Cüzdanı oluşturun
ve bir Devnet uç noktasına bağlı olduğunuzdan emin olun. Ardından `solana airdrop 5` komutunu
çalıştırın. Yeterli SOL'unuz olduğunda, programı oluşturup dağıtın. Eğer komut başarısız olursa,
`devnet SOL alma yollarını` 
kontrol edebilirsiniz.

## İstemci ile Başlayın

Bir sonraki bölüm, oyununuzla etkileşimde bulunmak için basit bir istemci tarafı uygulaması
oluşturmanıza rehberlik edecektir. Kodları ayrıntılı açıklamalarla birlikte inceleyeceğiz.
Solana Playground'ta `client.ts` dosyasına gidin ve sonraki bölümlerden kod parçalarını ekleyin.

### GameDataAccount Hesap Adresini Türetilmesi

Öncelikle, `findProgramAddress` fonksiyonunu kullanarak `GameDataAccount` için PDA'yı
türetilmeye çalışalım.

> Bir `Program Türetilmiş Adres (PDA)`, programın ID'si ve ek tohumlar kullanılarak
> türetilen tekil bir adresdir.

```js filename="client.ts"
// İşlediğiniz programla etkileşimde bulunurlarsa herkesin karakteri kontrol edebileceği PDA adresi
const [globalLevel1GameDataAccount, bump] =
  await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("level1", "utf8")],
    pg.program.programId,
  );
```

### Oyun Durumunu Başlatma

Sonraki adımda, önceki adımdaki PDA'yı kullanarak oyun veri hesabını elde etmeye çalışalım.
Eğer hesap mevcut değilse, programımızdan `initialize` talimatını çağırarak oluşturacağız.

```ts filename="client.ts" {11}
let txHash;
let gameDateAccount;

try {
  gameDateAccount = await pg.program.account.gameDataAccount.fetch(
    globalLevel1GameDataAccount,
  );
} catch {
  // Hesabın zaten başlatılıp başlatılmadığını kontrol edin, aksi takdirde başlatın
  txHash = await pg.program.methods
    .initialize()
    .accounts({
      newGameDataAccount: globalLevel1GameDataAccount,
      signer: pg.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([pg.wallet.keypair])
    .rpc();

  console.log(`Günlükleri görmek için 'solana confirm -v ${txHash}' komutunu kullanın`);
  await pg.connection.confirmTransaction(txHash);
  console.log("Bir yolculuk başlıyor...");
  console.log("o........");
}
```

### Sola ve Sağa Hareket

Artık oyunun keyfini çıkarmak için sola veya sağa hareket ediyoruz. Bu, işlemi
Solana ağına göndererek yapılır; programdan `moveLeft` veya `moveRight` talimatını
çağırarak gerçekleşecektir.

Bu adımı istediğiniz kadar tekrar edebilir, her biri zincir üzerinde hareket
mantığını uygulayarak oyuncunun durumunu güncelleyebilir.

```ts filename="client.ts" {2,3}
// Artık buraya oynayabilir, sola ve sağa hareket edebilirsiniz
txHash = await pg.program.methods
  //.moveLeft()
  .moveRight()
  .accounts({
    gameDataAccount: globalLevel1GameDataAccount,
  })
  .signers([pg.wallet.keypair])
  .rpc();
console.log(`Günlükleri görmek için 'solana confirm -v ${txHash}' komutunu kullanın`);
await pg.connection.confirmTransaction(txHash);

gameDateAccount = await pg.program.account.gameDataAccount.fetch(
  globalLevel1GameDataAccount,
);

console.log("Oyuncu pozisyonu:", gameDateAccount.playerPosition.toString());
```

### Oyuncunun Pozisyonunu Kaydetme

Son olarak, `gameDateAccount` içinde depolanan `playerPosition` değerine
dayalı olarak karakterin pozisyonunu kaydetmek için bir `switch` ifadesi kullanalım.
Bu, oyundaki karakterin hareketinin görsel temsilini sağlayacaktır.

```ts filename="client.ts"
switch (gameDateAccount.playerPosition) {
  case 0:
    console.log("Bir yolculuk başlıyor...");
    console.log("o........");
    break;
  case 1:
    console.log("....o....");
    break;
  case 2:
    console.log("......o..");
    break;
  case 3:
    console.log(".........\\o/");
    break;
}
```

### İstemci Programını Çalıştırma

Son olarak, Solana Playground'da "Çalıştır" butonuna tıklayarak istemciyi
çalıştırın. Çıktınız aşağıdaki gibi olmalıdır:

```shell
İstemci çalışıyor...
  client.ts:
    Benim adresim: 8ujtDmwpkQ4Bp4GU4zUWmzf65sc21utdcxFAELESca22
    Benim bakiyem: 4.649749614 SOL
    Günlükleri görmek için 'solana confirm -v 4MRXEWfGqvmro1KsKb94Zz8qTZsPa9x99oMFbLBz2WicLnr8vdYYsQwT5u3pK5Vt1i9BDrVH5qqTXwtif6sCRJCy' komutunu kullanın
    Oyuncu pozisyonu: 1
    ....o....
```

Tebrikler! Küçük Macera oyununu istemciden başarıyla oluşturdunuz, dağıttınız ve
çağırdınız.

> Olanakları daha da göstermek için, [Next.js frontend'i](https://nextjs-tiny-adventure.vercel.app/) üzerinden
> Küçük Macera programıyla etkileşim kurmanın nasıl olduğunu gösteren bir
> demo inceleyebilirsiniz. Ayrıca bu Next.js projesinin
> [kaynak koduna](https://github.com/solana-developers/solana-game-examples/tree/main/tiny-adventure)
> burada göz atabilirsiniz.

## Sırada Ne Var?

Temel oyun tamamlandıktan sonra, yaratıcılığınızı serbest bırakın ve kendi fikirlerinizi
uygulamak için bağımsız olarak deneyimlerinizi zenginleştirin. İşte birkaç öneri:

1. Oyun içi metinleri değiştirin ve ilginç bir hikaye oluşturun. Bir arkadaşınızı
   özel anlatımınızdan geçirip zincir üstü işlemleri nasıl ortaya çıktığını gözlemleyin!
2. Oyuncuları `SOL Ödülleri` ile ödüllendiren bir sandık ekleyin veya
   oyuncunun ilerledikçe madeni paralar toplamasına ve
   `tokenlarla etkileşime girmesine`
   olanak tanıyın.
3. Oyuncunun yukarı, aşağı, sola ve sağa hareket etmesine olanak tanıyan
   bir ızgara oluşturun ve daha dinamik bir deneyim için birden fazla oyuncu tanıtın.

### İkinci Bölüm

Küçük Macera oyununu rehberli geliştirmeye `Küçük Macera - İkinci Bölüm` ile devam edebilirsiniz,
burada SOL'u programda nasıl depolayacağımızı ve ödül olarak oyunculara nasıl dağıtacağımızı göstereceğiz.

### Daha Fazla Kaynak

Ayrıca burada daha fazla Solana oyun geliştirme kaynaklarını keşfedebilirsiniz:

- `Başlamak için kılavuz`
- `Solana Oyun SDK'ları`
- `Örneklerle öğrenin`
- `Enerji Sistemi`
- `Oyunlardaki NFT'ler`
- `Oyunlarda Token`