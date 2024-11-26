---
date: 2024-04-25T00:00:00Z
difficulty: beginner
title: Oyun durumunu kaydetme
description: Solana programında bir oyunun durumunu nasıl kaydedilir
tags:
  - oyunlar
  - çapa
  - program
  - solana playground
  - web3js
  - yerel
  - rust
keywords:
  - öğretici
  - blockchain geliştiricisi
  - blockchain öğretici
  - web3 geliştiricisi
  - çapa
  - oyunlar
  - örnek
---

Solana blok zincirini, oyun durumunuzu program hesaplarında kaydetmek için kullanabilirsiniz. Bunlar, programınız tarafından sahip olunan hesaplardır ve program kimliğinden ve bazı tohumlardan türetilirler. Bunlar, veritabanı girişleri olarak düşünülebilir. 

:::tip
**Not:** Örneğin bir PlayerData hesabı oluşturabilir ve oyuncuların genel anahtarını bir tohum olarak kullanabiliriz. Bu, her oyuncunun cüzdan başına bir oyuncu hesabına sahip olabileceği anlamına gelir.
:::

Bu hesaplar varsayılan olarak 10Kb'a kadar olabilir. **Daha büyük bir hesaba ihtiyacınız varsa** [büyük hesapları nasıl yöneteceğinizi](https://github.com/solana-developers/anchor-zero-copy-example) inceleyin. Bunu aşağıdaki gibi bir programda yapabilirsiniz:

```rust
pub fn init_player(ctx: Context<InitPlayer>) -> Result<()> {
    ctx.accounts.player.energy = MAX_ENERGY;
    ctx.accounts.player.health = MAX_HEALTH;
    ctx.accounts.player.last_login = Clock::get()?.unix_timestamp;
    Ok(())
}

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
    pub health: u64,
    pub log: u64,
    pub energy: u64,
    pub last_login: i64
}
```

Bu oyuncu verisi ile işlem talimatları aracılığıyla etkileşimde bulunabilirsiniz. Örneğin, oyuncunun bir canavarı öldürdüğünde deneyim kazanmasını istiyoruz:

```rust
pub fn kill_enemy(mut ctx: Context<KillEnemy>, enemyId: u8) -> Result<()> {
    let account = &mut ctx.accounts;

    ... enerji ile ilgilen

    if ctx.accounts.player.energy == 0 {
        return err!(ErrorCode::NotEnoughEnergy);
    }

    ... kimlik ile düşman değerlerini al ve savaşı hesapla

    ctx.accounts.player.xp = ctx.accounts.player.xp + 1;
    ctx.accounts.player.energy = ctx.accounts.player.energy - 1;

    ... seviye atlama ile ilgilen

    msg!("Düşmanı öldürdün ve 1 xp aldın. Şu anda {} xp ve {} enerji kaldı.", ctx.accounts.player.xp, ctx.accounts.player.energy);
    Ok(())
}
```

:::info
**JavaScript İstemcisi:** Bir JavaScript istemcisinden bu şekilde görünecektir:
:::

```js
const wallet = useAnchorWallet();
const provider = new AnchorProvider(connection, wallet, {});
setProvider(provider);
const program = new Program(IDL, PROGRAM_ID, provider);

const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from("player", "utf8"),
  publicKey.toBuffer()],
  new PublicKey(PROGRAM_ID)
);

try {
  const transaction = program.methods
    .initPlayer()
    .accounts({
      player: pda,
      signer: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  const tx = await transaction;
  const txSig = await sendTransaction(tx, connection);
  await connection.confirmTransaction(txSig, "confirmed");
```

:::note
**Enerji Sistemi:** Bu enerji sistemini nasıl inşa edeceğinizi burada öğrenebilirsiniz:
`Bir Enerji sistemi inşa etmek`
:::