---
title: IDL Dosyası
description:
  Anchor'daki Arayüz Tanım Dili (IDL) dosyasını öğrenin, amacı, faydaları ve program-müşteri etkileşimlerini nasıl kolaylaştırdığı hakkında bilgi edinin.
sidebarLabel: IDL Dosyası
sidebarSortOrder: 2
---

Arayüz Tanım Dili (IDL) dosyası, programın talimatlarını ve hesaplarını açıklayan standart bir JSON dosyası sağlar. Bu dosya, zincir üzerindeki programınızı istemci uygulamalarıyla entegre etme sürecini **kolaylaştırır**.

:::note
IDL dosyalarının, program ile istemci arasında veri iletimini standartlaştırdığına dikkat edin.
:::

### IDL'nin Temel Faydaları:

- **Standartlaştırma**: Programın talimatlarını ve hesaplarını tanımlamak için tutarlı bir format sağlar.
- **İstemci Üretimi**: Programla etkileşimde bulunmak için istemci kodu üretmekte kullanılır.

`anchor build` komutu, `/target/idl/.json` konumunda bir IDL dosyası oluşturur.

Aşağıdaki kod parçaları, programın, IDL'nin ve istemcinin birbirleriyle nasıl ilişkili olduğunu vurgulamaktadır.

## Program Talimatları

IDL'deki `instructions` dizisi, programınızdaki tanımlı talimatlarla doğrudan ilişkilidir. Her talimat için gereken hesapları ve parametreleri belirtir.





Aşağıdaki program, gerekli hesapları ve parametreleri belirten bir `initialize` talimatı içerir.

```rust {8-12, 15-22}
use anchor_lang::prelude::*;

declare_id!("BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Veri değiştirildi: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64,
}
```




Oluşturulan IDL dosyası, adını, hesaplarını, argümanlarını ve ayrımcısını içeren standartlaştırılmış JSON formatında talimatı içerir.

```json filename="JSON" {11-12, 14-27, 30-33}
{
  "address": "BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd",
  "metadata": {
    "name": "hello_anchor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Anchor ile oluşturuldu"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [
        {
          "name": "new_account",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "NewAccount",
      "discriminator": [176, 95, 4, 118, 91, 177, 125, 232]
    }
  ],
  "types": [
    {
      "name": "NewAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": "u64"
          }
        ]
      }
    }
  ]
}
```




Ardından IDL dosyası, programla etkileşimde bulunmak için bir istemci oluşturmak üzere kullanılır ve **program talimatını çağırma sürecini** kolaylaştırır.

```ts {19-26}
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";
import { Keypair } from "@solana/web3.js";
import assert from "assert";

describe("hello_anchor", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("initialize", async () => {
    // Yeni hesap için anahtar çifti oluştur
    const newAccountKp = new Keypair();

    // İşlem gönder
    const data = new BN(42);
    const transactionSignature = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: wallet.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    // Oluşturulan hesabı al
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey,
    );

    console.log("İşlem imzası: ", transactionSignature);
    console.log("Zincir üzerindeki veri:", newAccount.data.toString());
    assert(data.eq(newAccount.data));
  });
});
```




## Program Hesapları

IDL'deki `accounts` dizisi, `#[account]` makrosu ile işaretlenmiş programdaki yapılarla ilişkilidir. Bu yapılar, program tarafından oluşturulan hesaplarda saklanan verileri tanımlar.





Aşağıdaki program, tek bir `data` alanına sahip bir `NewAccount` yapısını tanımlar.

```rust {24-27}
use anchor_lang::prelude::*;

declare_id!("BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Veri değiştirildi: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64,
}
```




Oluşturulan IDL dosyası, hesabı standartlaştırılmış JSON formatında, adını, ayrımcısını ve alanlarını içerecek şekilde içerir.

```json filename="JSON" {39-40, 45-54}
{
  "address": "BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd",
  "metadata": {
    "name": "hello_anchor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Anchor ile oluşturuldu"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [
        {
          "name": "new_account",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "NewAccount",
      "discriminator": [176, 95, 4, 118, 91, 177, 125, 232]
    }
  ],
  "types": [
    {
      "name": "NewAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": "u64"
          }
        ]
      }
    }
  ]
}
```




IDL dosyası, programla etkileşimde bulunmak için bir istemci oluşturmak üzere kullanılır, böylece hesap verilerini alma ve serileştirmeyi kolaylaştırır.

```ts {29-31}
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";
import { Keypair } from "@solana/web3.js";
import assert from "assert";

describe("hello_anchor", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("initialize", async () => {
    // Yeni hesap için anahtar çifti oluştur
    const newAccountKp = new Keypair();

    // İşlem gönder
    const data = new BN(42);
    const transactionSignature = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: wallet.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    // Oluşturulan hesabı al
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey,
    );

    console.log("İşlem imzası: ", transactionSignature);
    console.log("Zincir üzerindeki veri:", newAccount.data.toString());
    assert(data.eq(newAccount.data));
  });
});
```




## Ayrımcılar

Anchor, bir programdaki her talimat ve hesap türü için benzersiz bir 8 baytlık ayrımcı atar. Bu ayrımcılar, farklı talimatlar veya hesap türleri arasında ayırt edici kimlikler olarak hizmet eder.

Ayrımcı, bir ön ek ile talimat veya hesap adının birleşiminin Sha256 hash'inin ilk 8 baytından oluşturulur. Anchor v0.30'dan itibaren bu ayrımcılar IDL dosyasında dahil edilir.

:::warning
Unutmayın ki, Anchor ile çalışırken genellikle bu ayrımcılarla doğrudan etkileşime girmeniz gerekmez. Bu bölüm, ayrımcının nasıl oluşturulduğu ve kullanıldığına dair bağlam sağlamak için hazırlanmıştır.
:::





Talimat ayrımcısı, çağrıldığında programın hangi spesifik talimatı yürütmesi gerektiğini belirlemek için kullanılır.

Bir Anchor program talimatı çağrıldığında, ayrımcı, talimat verisinin ilk 8 baytı olarak eklenir. Bu, Anchor istemcisi tarafından otomatik olarak yapılır.

```json filename="IDL"  {4}
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
       ...
    }
  ]
```

Bir talimat için ayrımcı, `global` ön ekinin ve talimat adının Sha256 hash'inin ilk 8 baytıdır.

Örneğin:

```
sha256("global:initialize")
```

Aynı zamanda, onaltılık çıktısı:

```
af af 6d 1f 0d 98 9b ed d4 6a 95 07 32 81 ad c2 1b b5 e0 e1 d7 73 b2 fb bd 7a b5 04 cd d4 aa 30
```

İlk 8 bayt, talimat için ayrımcı olarak kullanılır.

```
af = 175
af = 175
6d = 109
1f = 31
0d = 13
98 = 152
9b = 155
ed = 237
```

Ayrımcı oluşturma uygulanmasını Anchor kod tabanında
[buradan](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/syn/src/codegen/program/common.rs#L5-L19) bulabilirsiniz,
ki bu [şurada](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/syn/src/codegen/program/instruction.rs#L27) kullanılır.




Hesap ayrımcısı, zincir üzerindeki verileri serileştirirken spesifik hesap türünü tanımlamak için kullanılır ve hesap oluşturulduğunda ayarlanır.

```json filename="IDL"  {4}
  "accounts": [
    {
      "name": "NewAccount",
      "discriminator": [176, 95, 4, 118, 91, 177, 125, 232]
    }
  ]
```

Bir hesap için ayrımcı, `account` ön ekinin ve hesap adının Sha256 hash'inin ilk 8 baytıdır.

Örneğin:

```
sha256("account:NewAccount")
```

Aynı zamanda, onaltılık çıktısı:

```
b0 5f 04 76 5b b1 7d e8 a1 93 57 2a d3 5e b1 ae e5 f0 69 e2 09 7e 5c d2 64 56 55 2a cb 4a e9 57
```

İlk 8 bayt, hesap için ayrımcı olarak kullanılır.

```
b0 = 176
5f = 95
04 = 4
76 = 118
5b = 91
b1 = 177
7d = 125
e8 = 232
```

Ayrımcı oluşturma uygulanmasını Anchor kod tabanında
[buradan](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L101-L117) bulabilirsiniz.

:::tip
Unutmayın ki, aynı hesap adlarına sahip farklı programlar aynı ayrımcıyı oluşturacaktır. Hesap verilerini serileştirirken, Anchor programları aynı zamanda bir hesabın belirli bir hesap türü için beklenen program tarafından sahiplenildiğini kontrol edecektir.
:::




Olay ayrımcısı, olay yayımı sırasında zincir üzerindeki verileri serileştirirken spesifik olay türünü tanımlamak için kullanılır.

```json filename="IDL"  {4}
  "events": [
    {
      "name": "NewEvent",
      "discriminator": [113, 21, 185, 70, 164, 63, 232, 201]
    }
  ]
```

Bir olay için ayrımcı, `event` ön ekinin ve olay adının Sha256 hash'inin ilk 8 baytıdır.

Örneğin:

```
sha256("event:NewEvent")
```

Aynı zamanda, onaltılık çıktısı:

```
71 15 b9 46 a4 63 e8 c9 2a 3c 4d 83 87 16 cd 9b 66 28 cb e2 cb 7c 5d 70 59 f3 42 2b dc 35 03 53
```

İlk 8 bayt, hesabın ayrımcısı olarak kullanılır.

Onaltılık değerleri ondalık formata dönüştürdüğümüzde:

```
71 = 113
15 = 21
b9 = 185
46 = 70
a4 = 164
63 = 99
e8 = 232
c9 = 201
```

Ayrımcı oluşturma uygulamasını Anchor kod tabanında
[buradan](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/event/src/lib.rs#L23-L27) bulabilirsiniz.

:::info
Unutmayın ki, aynı olay adlarına sahip farklı programlar aynı ayrımcıyı oluşturacaktır. Olay verilerini serileştirirken, Anchor programları aynı zamanda bir olayın belirli bir olay türü için beklenen program tarafından sahiplenildiğini kontrol edecektir.
:::


