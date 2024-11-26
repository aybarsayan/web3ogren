---
title: Anchor ile Başlarken
description:
  Solana programlarını Anchor çerçevesi kullanarak nasıl oluşturacağınızı öğrenin. Bu kapsamlı kılavuz, Anchor ile Solana akıllı sözleşmelerini oluşturma, derleme, test etme ve dağıtma konularını ele alıyor.
sidebarLabel: Anchor Çerçevesi
sidebarSortOrder: 0
altRoutes:
  - /docs/programs/debugging
  - /docs/programs/lang-c
  - /docs/programs/overview
---

Anchor çerçevesi, Solana programları oluşturma sürecini basitleştiren bir araçtır. Blockchain geliştirmeye yeni başlayan biri misiniz yoksa deneyimli bir programcı mı? **Anchor**, Solana programları yazma, test etme ve dağıtma sürecini kolaylaştırır.

Bu bölümde, aşağıdaki konulara değineceğiz:

- Yeni bir Anchor projesi oluşturma
- Programınızı derleme ve test etme
- Solana kümelerine dağıtım yapma
- Proje dosya yapısını anlama

---

## Ön Gereksinimler

Ayrıntılı kurulum talimatları için `kurulum` sayfasını ziyaret edin.

Başlamadan önce aşağıdakilerin yüklü olduğundan emin olun:

- **Rust**: Solana programları oluşturmak için kullanılan programlama dili.
- **Solana CLI**: Solana geliştirme için komut satırı aracı.
- **Anchor CLI**: Anchor çerçevesi için komut satırı aracı.

:::tip
Kurulumları tamamladıysanız, verilen komutları terminalde çalıştırarak doğrulayabilirsiniz.
:::

Anchor CLI kurulumunu doğrulamak için terminalinizi açın ve şu komutu çalıştırın:

```shell filename="Terminal"
anchor --version
```

Beklenen çıktı:

```shell filename="Terminal"
anchor-cli 0.30.1
```

---

## Başlarken

Bu bölüm, ilk yerel Anchor programınızı oluşturmak, derlemek ve test etmek için temel adımları kapsar.



### Yeni Bir Proje Oluşturun

Yeni bir proje başlatmak için `anchor init` komutunu projenizin adıyla takip edin. Bu komut, belirtilen adla yeni bir dizin oluşturur ve varsayılan bir program ve test dosyası ayarlar.

```shell filename="Terminal"
anchor init my-program
```

Yeni proje dizinine gidin ve kod editörünüzde açın.

```shell filename="Terminal" copy
cd my-program
```

Varsayılan Anchor programı `/programs/my-project/src/lib.rs` dizininde bulunmaktadır.




`declare_id!` makrosundaki değer program kimliğidir, programınız için benzersiz bir tanımlayıcıdır.

Varsayılan olarak, `/target/deploy/my_project-keypair.json`ndeki anahtar çiftinin genel anahtarıdır.

```rs filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg");

#[program]
pub mod my_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```




Varsayılan Typescript test dosyası `/tests/my-project.ts` dizinindedir.




Bu dosya, varsayılan programın `initialize` talimatını Typescript ile nasıl çağıracağını gösterir.

```ts filename="my-project.ts"
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProject } from "../target/types/my_project";

describe("my-project", () => {
  // Müşteriyi yerel kümeyi kullanacak şekilde yapılandırın.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MyProject as Program<MyProject>;

  it("Is initialized!", async () => {
    // Testinizi buraya ekleyin.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
```




Eğer test için Rust tercih ediyorsanız, projenizi `--test-template rust` bayrağı ile başlatın.

```shell
anchor init --test-template rust my-program
```

Rust test dosyası `/tests/src/test_initialize.rs` dizininde olacaktır.




```rust filename="test_initialize.rs"
use std::str::FromStr;

use anchor_client::{
    solana_sdk::{
        commitment_config::CommitmentConfig, pubkey::Pubkey, signature::read_keypair_file,
    },
    Client, Cluster,
};

#[test]
fn test_initialize() {
    let program_id = "3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg";
    let anchor_wallet = std::env::var("ANCHOR_WALLET").unwrap();
    let payer = read_keypair_file(&anchor_wallet).unwrap();

    let client = Client::new_with_options(Cluster::Localnet, &payer, CommitmentConfig::confirmed());
    let program_id = Pubkey::from_str(program_id).unwrap();
    let program = client.program(program_id).unwrap();

    let tx = program
        .request()
        .accounts(my_program::accounts::Initialize {})
        .args(my_program::instruction::Initialize {})
        .send()
        .expect("");

    println!("Your transaction signature {}", tx);
}
```




### Programı Derleme

Programı derlemek için `anchor build` komutunu çalıştırın.

```shell filename="Terminal" copy
anchor build
```

Derlenen program `/target/deploy/my_project.so` dizininde olacaktır. Bu dosyanın içeriği, programınızı dağıttığınızda Solana ağında (bir çalıştırılabilir hesap olarak) depolanan içeriği temsil eder.

### Programı Test Etme

Programı test etmek için `anchor test` komutunu çalıştırın.

```shell filename="Terminal" copy
anchor test
```

Varsayılan olarak, `Anchor.toml` yapılandırma dosyası `localnet` kümesini belirtmektedir. `localnet` üzerinde geliştirme yaparken, `anchor test` otomatik olarak:

1. Yerel bir Solana doğrulayıcısını başlatır
2. Programınızı yerel kümeye derler ve dağıtır
3. `tests` klasöründeki testleri çalıştırır
4. Yerel Solana doğrulayıcısını durdurur

Alternatif olarak, yerel Solana doğrulayıcısını manuel olarak başlatıp ona karşı testleri çalıştırabilirsiniz. Bu, **doğrulayıcıyı çalışır durumda tutarak** programınız üzerinde iterasyon yaparken, hesapları ve işlem günlüklerini [Solana Explorer](https://explorer.solana.com/?cluster=custom) üzerinde incelemenizi sağlar.

Yeni bir terminal açın ve `solana-test-validator` komutunu çalıştırarak yerel Solana doğrulayıcısını başlatın.

```shell filename="Terminal" copy
solana-test-validator
```

Başka bir terminalde, yerel kümeye karşı testleri çalıştırın. Yerel doğrulayıcıyı başlatmayı atlamak için `--skip-local-validator` bayrağını kullanın çünkü zaten çalışıyor.

```shell filename="Terminal" copy
anchor test --skip-local-validator
```

### Devnet'e Dağıtım

Varsayılan olarak, bir Anchor projesindeki `Anchor.toml` yapılandırma dosyası `localnet` kümesini belirtmektedir.

```toml filename="Anchor.toml" {14}
[toolchain]

[features]
resolution = true
skip-lint = false

[programs.localnet]
my_program = "3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

Programınızı devnet'e dağıtmak için `cluster` değerini `Devnet` olarak değiştirdikten sonra, dağıtım için gerekli olan SOL'ye sahip olduğunuzdan emin olun.

```diff
-cluster = "Localnet"
+cluster = "Devnet"
```

```toml filename="Anchor.toml"
[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"
```

Artık `anchor deploy` komutunu çalıştırdığınızda, programınız devnet kümesine dağıtılacaktır. `anchor test` komutu da `Anchor.toml` dosyasında belirtilen küme değerini kullanacaktır.

```shell
anchor deploy
```

Mainnet'e dağıtım yapmak için `Anchor.toml` dosyanızı güncelleyerek **mainnet** kümesini belirtin.

```toml filename="Anchor.toml"
[provider]
cluster = "Mainnet"
wallet = "~/.config/solana/id.json"
```

### Programı Güncelleme

Solana programları, aynı program kimliğine yeniden dağıtılarak güncellenebilir.

Bir programı güncellemek için, programınızın kodunda değişiklikler yapın ve güncellenmiş bir `.so` dosyası oluşturmak için `anchor build` komutunu çalıştırın.

```shell
anchor build
```

Sonra güncellenmiş programı yeniden dağıtmak için `anchor deploy` komutunu çalıştırın.

```shell
anchor deploy
```

### Programı Kapatma

Bir program hesabına tahsis edilen SOL'yi geri almak için Solana programınızı kapatabilirsiniz.

Bir programı kapatmak için `solana program close ` komutunu kullanın. Örneğin:

```shell
solana program close 3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg --bypass-warning
```

:::warning
Not: Bir program kapatıldığında, program kimliği yeni bir program dağıtmak için kullanılamaz.
:::



---

## Proje Dosya Yapısı

Aşağıda bir Anchor çalışma alanındaki varsayılan dosya yapısının genel bir görünümü bulunmaktadır:

```
.
├── .anchor
│   └── program-logs
├── app
├── migrations
├── programs
│   └── [proje-adi]
│       └── src
│           ├── lib.rs
│           ├── Cargo.toml
│           └── Xargo.toml
├── target
│   ├── deploy
│   │   └── [proje-adi]-keypair.json
│   ├── idl
│   │   └── [proje-adi].json
│   └── types
│       └── [proje-adi].ts
├── tests
│   └── [proje-adi].ts
├── Anchor.toml
├── Cargo.toml
└── package.json
```

### Programlar Klasörü

`/programs` klasörü, projenizin Anchor programlarını içerir. Tek bir çalışma alanı birden fazla program içerir.

### Testler Klasörü

`/tests` klasörü, projeniz için test dosyalarını içerir. Projenizi oluşturduğunuzda sizin için varsayılan bir test dosyası oluşturulur.

### Hedef Klasörü

`/target` klasörü, derleme çıktıları içerir. Ana alt klasörler şunlardır:

- `/deploy`: Programlarınız için anahtar çiftini ve program ikili dosyasını içerir.
- `/idl`: Programlarınız için JSON IDL içerir.
- `/types`: IDL için TypeScript türlerini içerir.

### Anchor.toml Dosyası

`Anchor.toml` dosyası, projeniz için çalışma alanı ayarlarını yapılandırır.

### .anchor Klasörü

Son test dosyalarının son çalışmasından işlem günlüklerini içeren bir `program-logs` dosyasını içerir.

### Uygulama Klasörü

`/app` klasörü, tercihe bağlı olarak frontend kodunuz için kullanılabilecek boş bir klasördür.