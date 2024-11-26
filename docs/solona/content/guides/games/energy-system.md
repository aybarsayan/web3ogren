---
date: 2024-04-25T00:00:00Z
difficulty: intermediate
title: Solana Üzerinde Eğlenceli Oyunlar İçin Enerji Sistemi Kurma
description:
  Oyun içi eylemleri gerçekleştirmek için enerji harcayan, zamanla yenilenen
  bir zincir içi enerji sistemi oluşturmayı öğrenin.
tags:
  - oyunlar
  - anchor
  - program
  - react
  - web3js
  - unity
  - rust
keywords:
  - öğretici
  - işlemler
  - blok zincir geliştirici
  - blok zincir öğretici
  - web3 geliştirici
  - anchor
  - oyunlar
  - enerji sistemi
  - zaman bazlı
  - zincir içi zamanlayıcı
  - örnek
---

Eğlenceli oyunlar, oyundaki eylemlerin enerji harcadığı ve zamanla yenilendiği
enerji sistemlerini yaygın olarak kullanır. Bu kılavuzda, Solana üzerinde nasıl
bir enerji sistemi inşa edeceğimizi anlatacağız. Eğer daha önce Solana hakkında
bilginiz yoksa, bunun yerine `Merhaba Dünya Örneği` ile başlayın.

Enerji sistemi ve bir React istemcisi ile yeni bir oyunu kolayca
kurabilirsiniz. Bunu yapmak için [Create Solana Game](https://github.com/solana-developers/solana-game-preset) kullanın.
Sadece şu komutu çalıştırın:

```bash
npx create-solana-game oyun-adınız
```

> `create-solana-game` kullanımına dair bir öğretici bulabilirsiniz.
> [Buraya tıklayın](https://youtu.be/fnhivg_pemI?si=6xIubFFYPOGiEjKY).
> Ayrıca aşağıdaki kılavuzda açıklanan örneğin
> [video yürüyüşünü](https://youtu.be/YYQtRCXJBgs?si=fIZRFkIYJ9wYjEcI) de bulabilirsiniz.

## Anchor programı

Başlangıç olarak, oyuncunun enerji rezervlerini zamanla kademeli olarak
yenileyen bir Anchor programı oluşturmaya rehberlik edeceğiz. Enerji, oyuncunun
oyun içinde çeşitli eylemleri gerçekleştirmesine olanak tanıyacak. Örneğimizde,
bir oduncu ağaç kesecek ve her ağaç kesme işlemi bir odun kazandıracak ve bir
enerji puanı harcayacak.

### Oyuncu hesabını oluşturma

İlk olarak, oyuncunun durumunu kaydeden bir hesap oluşturması gerekecek. Ayrıca,
programla oyuncunun son etkileşiminin Unix zaman damgasını `last_login` değerinde
saklayacağız. Bu durum ile belirli bir zamanda oyuncunun ne kadar enerjisi olduğunu
hesaplayabileceğiz. Ayrıca, oduncunun oyunda ne kadar odun kesebileceği için bir
değerimiz var.

```rust
pub fn init_player(ctx: Context<InitPlayer>) -> Result<()> {
    ctx.accounts.player.energy = MAX_ENERGY;
    ctx.accounts.player.last_login = Clock::get()?.unix_timestamp;
    Ok(())
}
```

```rust
#[derive(Accounts)]
pub struct InitPlayer <'info> {
    #[account(
        init,
        payer = signer,
        space = 1000,
        seeds = [b"player".as_ref(), signer.key().as_ref()],
        bump,
    )]
    pub player: Account<'info, PlayerData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PlayerData {
    pub name: String,
    pub level: u8,
    pub xp: u64,
    pub wood: u64,
    pub energy: u64,
    pub last_login: i64
}
```

### Ağaç kesme

Daha sonra, oyuncu `chop_tree` talimatını çağırdığında, oyuncunun yeterli
enerjisi olup olmadığını kontrol edeceğiz ve ona bir odun ile ödüllendireceğiz
(oyuncunun odun sayısını artırarak).

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Yeterli enerji yok")]
    NotEnoughEnergy,
}

pub fn chop_tree(mut ctx: Context<ChopTree>) -> Result<()> {
    let account = &mut ctx.accounts;
    update_energy(account)?;

    if ctx.accounts.player.energy == 0 {
        return err!(ErrorCode::NotEnoughEnergy);
    }

    ctx.accounts.player.wood = ctx.accounts.player.wood + 1;
    ctx.accounts.player.energy = ctx.accounts.player.energy - 1;
    msg!("Bir ağaç kestiniz ve 1 odun elde ettiniz. {} odununuz ve {} enerjiniz kaldı.", ctx.accounts.player.wood, ctx.accounts.player.energy);
    Ok(())
}
```

### Enerjiyi hesaplama

**İlginç kısım** `update_energy` fonksiyonunda gerçekleşiyor. Ne kadar zamanın
geçtiğini kontrol ediyoruz ve oyuncunun o zamandaki enerji miktarını hesaplıyoruz.
Aynı şeyi istemcide de yapacağız. Enerjiyi sürekli olarak kontrol etmek yerine
**tembel bir şekilde** güncelliyoruz. Bu, oyun geliştirmede yaygın bir tekniktir.

```rust
const TIME_TO_REFILL_ENERGY: i64 = 60;
const MAX_ENERGY: u64 = 10;

pub fn update_energy(ctx: &mut ChopTree) -> Result<()> {
    let mut time_passed: i64 = &Clock::get()?.unix_timestamp - &ctx.player.last_login;
    let mut time_spent: i64 = 0;
    while time_passed > TIME_TO_REFILL_ENERGY {
        ctx.player.energy = ctx.player.energy + 1;
        time_passed -= TIME_TO_REFILL_ENERGY;
        time_spent += TIME_TO_REFILL_ENERGY;
        if ctx.player.energy == MAX_ENERGY {
            break;
        }
    }

    if ctx.player.energy >= MAX_ENERGY {
        ctx.player.last_login = Clock::get()?.unix_timestamp;
    } else {
        ctx.player.last_login += time_spent;
    }

    Ok(())
}
```

## JavaScript istemcisi

Burada, `create-solana-game` kullanarak bir
[örnek bulun](https://github.com/solana-developers/solana-game-starter-kits/tree/main/lumberjack)
ve bir React istemcisi ile oluşturulmuş.

### Bağlantı oluşturma

Anchor.ts dosyasında, Solana blok zincirine (bu durumda, devnet) bir bağlantı
oluşturuyoruz:

```js
export const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed",
);
```

**Onay parametresinin** `confirmed` olarak ayarlandığını unutmayın. Bu, işlemlerin
`finalize` edilmeden önce `confirmed` olmasını beklediğimiz anlamına gelir. Bu,
işlemin geçerli olduğunu söyleyen ağın süper çoğunluğunun sonuç vermesini
beklediğimiz anlamına gelir. Bu yaklaşık 400ms sürer ve iptal edilmeyen onaylı
bir işlem olmamıştır. Genel olarak oyunlar için, `confirmed` mükemmel bir
işlem taahhüt düzeyidir.

### Oyuncu verilerini başlatma

İlk olarak, oyuncu hesabının program adresini bulmak için `player` tohum
dizgesini ve oyuncunun genel anahtarını kullanacağız
(`PDA türetmek`). Sonrasında `initPlayer` fonksiyonunu
çağırarak hesabı oluşturacağız.

```js
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from("player", "utf8"), publicKey.toBuffer()],
  new PublicKey(LUMBERJACK_PROGRAM_ID),
);

const transaction = program.methods
  .initPlayer()
  .accounts({
    player: pda,
    signer: publicKey,
    systemProgram: SystemProgram.programId,
  })
  .transaction();

const tx = await transaction;
const txSig = await sendTransaction(tx, connection, {
  skipPreflight: true,
});

await connection.confirmTransaction(txSig, "confirmed");
```

### Hesap güncellemelerine abone olma

Sonra, JavaScript istemcisi içinde, oyuncunun hesabındaki değişiklikleri
abone olup dinlemek için websocket'leri kullanacağız. Burada websocket kullanmamızın
nedeni, değişiklikleri almak için daha hızlı bir yol olmasıdır.

`connection.onAccountChange`, hesapta meydana gelen her değişikliği istemciye
gönderen bir RPC düğümüne soket bağlantısı oluşturur. Daha sonra bu verileri
TypeScript türlerine çözmek için `program.coder` kullanabilir ve bunları oyunda
doğrudan kullanabiliriz.

```js
useEffect(() => {
  if (!publicKey) {
    console.log("Genel anahtar eksik");
    return;
  }

  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("player", "utf8"), publicKey.toBuffer()],
    new PublicKey(LUMBERJACK_PROGRAM_ID),
  );

  const fetchPlayerData = async () => {
    try {
      const data = await program.account.playerData.fetch(pda);
      setGameState(data);
    } catch (error) {
      console.error("Oyuncu verileri alınırken hata:", error);
      window.alert("Oyuncu verisi bulunamadı, lütfen başlatın!");
    }
  };

  fetchPlayerData();

  const handleAccountChange = (account: AccountInfo<Buffer>) => {
    try {
      const decodedData = program.coder.accounts.decode("playerData", account.data);
      setGameState(decodedData);
    } catch (error) {
      console.error("Hesap verileri çözümleme hatası:", error);
    }
  };

  const subscriptionId = connection.onAccountChange(pda, handleAccountChange);

  return () => {
    connection.removeAccountChangeListener(subscriptionId);
  };
}, [publicKey]);

```

### Enerjiyi hesaplama ve geri sayımı gösterme

JavaScript istemcisinde, programda olduğu gibi oyuncunun bu noktadaki
enerji miktarını önceden hesaplayabilir ve enerji ne zaman tekrar kullanılabilir
olduğunu bilmesi için ona bir geri sayım zamanlayıcı gösterebiliriz:

```js
useEffect(() => {
    const interval = setInterval(async () => {
        if (gameState == null || gameState.lastLogin == undefined || gameState.energy >= 10) {return;}
        const lastLoginTime = gameState.lastLogin * 1000;
        let timePassed = ((Date.now() - lastLoginTime) / 1000);
        while (timePassed > TIME_TO_REFILL_ENERGY && gameState.energy < MAX_ENERGY) {
            gameState.energy = (parseInt(gameState.energy) + 1);
            gameState.lastLogin = parseInt(gameState.lastLogin) + TIME_TO_REFILL_ENERGY;
            timePassed -= TIME_TO_REFILL_ENERGY;
        }
        setTimePassed(timePassed);
        let nextEnergyIn = Math.floor(TIME_TO_REFILL_ENERGY - timePassed);
        if (nextEnergyIn < TIME_TO_REFILL_ENERGY && nextEnergyIn > 0) {
            setEnergyNextIn(nextEnergyIn);
        } else {
            setEnergyNextIn(0);
        }

    }, 1000);

    return () => clearInterval(interval);
}, [gameState, timePassed]);

...

{(gameState && <div className="flex flex-col items-center">
    {("Odun: " + gameState.wood + " Enerji: " + gameState.energy + " Sonraki enerji: " + nextEnergyIn )}
</div>)}

```

Bununla birlikte, artık enerji bazlı bir oyun oluşturabilirsiniz ve ayrıca
birisi oyunda bir bot oluşturursa, en fazla yapabilecekleri şey optimal
olarak oynamaktır. Bu, oyununuzun mantığına bağlı olarak, normal bir şekilde oyun
oynamak daha da kolay olabilir.

> **Not:** Bu oyunu, oyuncuların oyun içindeki eylemler için bazı SPL tokenleri ile ödüllendirme
özelliğini ekleyerek daha da iyi hale getirebilirsiniz.
> [Tokenler ile oyunlarda etkileşim](https://content/guides/games/interact-with-tokens.md) kısmını inceleyin.