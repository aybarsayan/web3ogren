---
title: Anchor ile PDA'lar
description:
  Program Türetilmiş Adresleri (PDA'ları) Anchor programlarında nasıl kullanacağınızı öğrenin,
  kısıtlamaları ve yaygın PDA desenlerini uygulayarak.
sidebarLabel: Anchor ile PDA'lar
sidebarSortOrder: 4
---

`Program Türetilmiş Adresler (PDA)`, Solana geliştirmesinde önceden tanımlanmış girdiler (tohumlar) ve bir program kimliğinden belirli olarak türetilmiş benzersiz bir adres oluşturmanıza olanak tanıyan bir özelliktir.

Bu bölüm, **Anchor** programında PDA'ların nasıl kullanılacağına dair temel örnekler sunacaktır.

## Anchor PDA Kısıtlamaları

Anchor programında PDA'ları kullanırken, genellikle PDA'yı türetmek için kullanılan tohumları tanımlamak üzere Anchor'un hesap kısıtlamalarını kullanırsınız. Bu kısıtlamalar, doğru adresin türetilmesini sağlamak için güvenlik kontrolleri olarak görevi görür.

:::note
**PDA tohumlarını tanımlamak için kullanılan kısıtlamalar:**
:::

- `tohumlar`: PDA'yı türetmek için kullanılan isteğe bağlı tohumların bir dizisi. Tohumlar sabit değerler veya hesap verilerine dinamik referanslar olabilir.
- `bump`: PDA'yı türetmek için kullanılan bump tohumudur. Adresin Ed25519 eğrisinden çıkmasını sağlamak ve geçerli bir PDA olmasını garantilemek için kullanılır.
- `tohumlar::program` - (isteğe bağlı) PDA adresini türetmek için kullanılan program kimliğidir. Bu kısıtlama, program kimliğinin mevcut program olmadığı durumlarda kullanılır.

`tohumlar` ve `bump` kısıtlamalarının birlikte kullanılması gerekmektedir.

### Kullanım Örnekleri

Aşağıda, Anchor programında PDA kısıtlamalarının nasıl kullanılacağını gösteren **örnekler** bulunmaktadır.





`tohumlar` kısıtlaması, PDA'yı türetmek için kullanılan isteğe bağlı değerleri belirler.

#### İsteğe Bağlı Tohum Yok

- İsteğe bağlı tohum olmadan bir PDA tanımlamak için boş bir dizi `[]` kullanın.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

#### Tek Sabit Tohum

- `tohumlar` kısıtlamasında isteğe bağlı tohumlar belirtilir.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

#### Birden Fazla Tohum ve Hesap Referansları

- Birden fazla tohum `tohumlar` kısıtlamasında belirtilebilir. `tohumlar` kısıtlaması ayrıca diğer hesap adreslerine veya hesap verilerine referans verebilir.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"hello_world", signer.key().as_ref()],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

Yukarıdaki örnek, **hem bir sabit tohum** (`b"hello_world"`) **hem de bir dinamik tohum** (imzacıdan elde edilen halka açık anahtar) kullanmaktadır.




`bump` kısıtlaması, PDA'yı türetmek için kullanılan bump tohumunu belirler.

#### Otomatik Bump Hesaplama

`bump` kısıtlaması bir değer olmadan kullanıldığında, bump her seferinde otomatik olarak hesaplanır.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

#### Bump Değeri Belirtme

Bump değerini açıkça sağlayabilirsiniz; bu, hesaplama birimi kullanımını optimize etmek için faydalıdır. Bu, PDA hesabının oluşturulmuş olduğunu ve bump tohumunun mevcut bir hesapta alan olarak saklandığını varsayar.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump = pda_account.bump_seed,
    )]
    pub pda_account: Account<'info, CustomAccount>,
}

#[account]
pub struct CustomAccount {
    pub bump_seed: u8,
}
```

Bump değerini hesabın verilerinde saklayarak programın bunu yeniden hesaplamasına gerek kalmaz, bu da hesaplama birimlerini tasarruf etmesini sağlar. Saklanan bump değeri, hesapta veya başka bir hesapta saklanabilir.




`tohumlar::program` kısıtlaması, PDA'yı türetmek için kullanılan program kimliğini belirler. Bu kısıtlama, başka bir programdan PDA türettiğinizde kullanılır.

:::info
Bu kısıtlamayı, talimatınızın başka bir program tarafından oluşturulan PDA hesaplarıyla etkileşimde bulunması gerektiğinde kullanın.
:::

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump,
        seeds::program = other_program.key(),
    )]
    pub pda_account: SystemAccount<'info>,
    pub other_program: Program<'info, OtherProgram>,
}
```




`init` kısıtlaması, yeni bir hesap oluşturmak için `tohumlar` ve `bump` ile yaygın olarak kullanılır; bu, adresin bir PDA olduğu anlamına gelir. Altyapıda `init` kısıtlaması, hesabı oluşturmak için Sistem Programını tetikler.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        seeds = [b"hello_world", signer.key().as_ref()],
        bump,
        payer = signer,
        space = 8 + 1,
    )]
    pub pda_account: Account<'info, CustomAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct CustomAccount {
    pub bump_seed: u8,
}
```




## IDL'de PDA tohumları

`tohumlar` kısıtlamasında tanımlanan Program Türetilmiş Adres (PDA) tohumları, programın IDL dosyasına dahil edilir. Bu, **Anchor istemcisinin** bu tohumları kullanarak hesapları otomatik olarak çözmesine olanak tanır.

Aşağıdaki örnek, program, IDL ve istemci arasındaki ilişkiyi göstermektedir.





Aşağıdaki program, bir statik tohum (`b"hello_world"`) ve imzacıdan elde edilen bir halka açık anahtarı dinamik tohum olarak kullanarak bir `pda_account` tanımlar.

```rs {18} /signer/
use anchor_lang::prelude::*;

declare_id!("BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5");

#[program]
mod hello_anchor {
    use super::*;
    pub fn test_instruction(ctx: Context<InstructionAccounts>) -> Result<()> {
        msg!("PDA: {}", ctx.accounts.pda_account.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"hello_world", signer.key().as_ref()],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```




Programın IDL dosyası, `tohumlar` kısıtlamasında tanımlanan PDA tohumlarını içerir.

- Statik tohum `b"hello_world"` byte değerlerine dönüştürülür.
- Dinamik tohum, imzacı hesabına referans olarak dahil edilir.

```json {22-29}
{
  "address": "BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5",
  "metadata": {
    "name": "hello_anchor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "test_instruction",
      "discriminator": [33, 223, 61, 208, 32, 193, 201, 79],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "pda_account",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [104, 101, 108, 108, 111, 95, 119, 111, 114, 108, 100]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ]
}
```




Anchor istemcisi, IDL dosyasını kullanarak PDA adresini otomatik olarak çözebilir.

Aşağıdaki örnekte, Anchor, imzacı olarak sağlayıcı cüzdanı kullanarak PDA adresini otomatik olarak çözer ve halka açık anahtarını PDA türetimi için dinamik tohum olarak kullanır. Bu, talimatı oluştururken PDA'yı açıkça türetme ihtiyacını ortadan kaldırır.

```ts {13}
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";

describe("hello_anchor", () => {
  // Müşteriyi yerel küme kullanacak şekilde yapılandırın.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("Başlatıldı!", async () => {
    // Testinizi burada ekleyin.
    const tx = await program.methods.testInstruction().rpc();
    console.log("İşlem imzanız", tx);
  });
});
```

Talimat uygulandığında, PDA, program talimatında tanımlandığı gibi program loglarına yazdırılır.

```{3}
Program BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5 invoke [1]
Program logu: Talimat: TestInstruction
Program logu: PDA: 3Hikt5mpKaSS4UNA5Du1TZJ8tp4o8VC8YWW6X9vtfVnJ
Program BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5 18505 hesaplama birimini tüketti, 200000 birim içerisindedir.
Program BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5 başarı ile tamamlandı
```


