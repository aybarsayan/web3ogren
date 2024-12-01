---
title: Program Konfigürasyonu
objectives:
  - Cargo.toml dosyasında program özelliklerini tanımlayın
  - Hangi özelliklerin etkin veya devre dışı olduğuna bağlı olarak koşullu kod derlemek için yerel Rust cfg özniteliğini kullanın
  - Hangi özelliklerin etkin veya devre dışı olduğuna bağlı olarak koşullu kod derlemek için yerel Rust cfg! makrosunu kullanın
  - Program konfigürasyon değerlerini depolamak için kullanılacak bir program hesabı ayarlamak üzere yalnızca yöneticilere açık bir talimat oluşturun
description:
  "Ayrı ortamlar, özellik bayrakları ve yalnızca yöneticilere özel talimatlar oluşturun."
---

## Özet

- Onchain bir programda ayrı ortamlar yaratmak için "kutudan çıkar çıkmaz" çözümler yoktur, ancak yaratıcılık konusunda ilerlerseniz ortam değişkenlerine benzer bir şey elde edebilirsiniz.
- Rust özellikleri ile farklı kod çalıştırmak veya sağlanan Rust özelliğine bağlı olarak farklı değişken değerleri sağlamak için 
  [`cfg` özniteliğini](https://doc.rust-lang.org/rust-by-example/attribute/cfg.html) kullanabilirsiniz (`#[cfg(feature = ...)]`). _Bu derleme zamanında gerçekleşir ve bir program dağıtıldıktan sonra değerleri değiştirmeye izin vermez_.
- Benzer şekilde, etkinleştirilen özelliklere bağlı olarak farklı kod yollarını derlemek için 
  [`cfg!` **makrosunu**](https://doc.rust-lang.org/std/macro.cfg.html) kullanabilirsiniz.
- Dağıtımdan sonra ortam benzeri değişkenler için program hesapları oluşturun ve programın yükseltme yetkisi tarafından erişilebilen yalnızca yöneticilere açık talimatlar oluşturun.

---

## Ders

Mühendislerin yazılım geliştirme türleri arasında karşılaştığı zorluklardan biri, test edilebilir kod yazmak ve yerel geliştirme, test etme, üretim vb. için ayrı ortamlar oluşturmaktır.

:::note
Bu, Solana program geliştirme sürecinde özellikle zordur. 
:::

Örneğin, her bir yatırılan NFT'nin günlük 10 ödül token'ı kazandığı bir NFT stakinin oluşturulacağını hayal edin. Testlerin sadece birkaç yüz milisaniyede çalıştığını düşünürsek ödülleri talep etme yeteneğini nasıl test edersiniz?

Geleneksel web geliştirmede, bu genellikle farklı "ortamlar" içinde farklı değerler sağlamak için ortam değişkenleri ile ele alınır. Ancak, Solana programlarının şu anda resmi bir ortam değişkenleri kavramı yoktur. Eğer olsaydı, test ortamınızdaki ödülleri 10,000,000 token'a güncelleyerek ödül talep etme işlemini kolaylaştırabilirsiniz.

Neyse ki, bu işlevselliği az bir yaratıcılıkla taklit edebilirsiniz. En etkili çözüm, iki tekniğin bir kombinasyonunu içerir:

1. **Yerel Rust** özellik bayrakları, derleme sırasında "ortamı" belirlemenize izin verir ve bu da kodun belirli bir yapılandırmaya göre değerleri ayarlamasını sağlar.
2. **Yalnızca yöneticilere açık** program hesapları ve talimatları, gönderim sonrasında yapılandırma değerlerini ayarlamak ve yönetmek için sadece programın yükseltme `yetkisine` erişilebilen talimatlar içermektedir.

---

### Yerel Rust Özellik Bayrakları

Ortamlara oluşturmanın en basit yollarından biri Rust özelliklerini kullanmaktır. Özellikler, programın `Cargo.toml` dosyasının `[features]` tablosunda tanımlanır. **Farklı kullanım durumları için birden fazla özellik tanımlayabilirsiniz.**

```toml
[features]
feature-one = []
feature-two = []
```

Yukarıdakilerin sadece bir özelliği tanımladığını belirtmek önemlidir. Programınızı test ederken bir özelliği etkinleştirmek için `anchor test` komutu ile birlikte `--features` bayrağını kullanabilirsiniz.

```bash
anchor test -- --features "feature-one"
```

Ayrıca birden fazla özelliği virgül ile ayırarak belirtebilirsiniz.

```bash
anchor test -- --features "feature-one", "feature-two"
```

#### Kodun Koşullu Olmasını Sağlamak için cfg Özniteliğini Kullanın

Bir özellik tanımlandıktan sonra, kodunuzda verilen bir özelliğin etkin olup olmadığına bağlı olarak koşullu kod derlemek için `cfg` özniteliğini kullanabilirsiniz. **Bu, programınızdan belirli bir kodu dahil etmenizi veya hariç tutmanızı sağlar.**

`cfg` özniteliğini kullanma sözdizimi, başka bir öznitelik makrosu gibidir: `#[cfg(feature=[FEATURE_HERE])]`. Örneğin, aşağıdaki kod `testing` özelliği etkin olduğunda `function_for_testing` işlevini derler ve aksi takdirde `function_when_not_testing` işlevini derler:

```rust
#[cfg(feature = "testing")]
fn function_for_testing() {
    // "testing" özellik bayrağı etkin olduğunda dahil edilecek kod
}

#[cfg(not(feature = "testing"))]
fn function_when_not_testing() {
    // "testing" özellik bayrağı etkin olmadığında dahil edilecek kod
}
```

:::tip
Bu, özellik etkinleştirilerek veya devre dışı bırakılarak Anchor programınızdaki belirli işlevselliği derleme zamanı itibariyle etkinleştirmenize veya devre dışı bırakmanıza olanak tanır.
:::

Ayrı "ortamlar" oluşturmayı hedeflemek için bunu kullanmayı hayal etmek zor değildir. Örneğin, tüm jetonların hem Mainnet hem de Devnet üzerinde dağıtımlara sahip olması gerekmez. Bu nedenle, Mainnet dağıtımları için bir jeton adresini hard-code yapabilir ve Devnet ve Localnet dağıtımları için farklı bir adres hard-code yapabilirsiniz. Bu sayede, kodun kendisinde herhangi bir değişiklik yapmadan farklı ortamlar arasında hızlıca geçiş yapabilirsiniz.

Aşağıdaki kod, yerel testler için farklı jeton adreslerini içeren bir Anchor programının bir örneğini gösterir:

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[cfg(feature = "local-testing")]
pub mod constants {
    use solana_program::{pubkey, pubkey::Pubkey};
    pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("WaoKNLQVDyBx388CfjaVeyNbs3MT2mPgAhoCfXyUvg8");
}

#[cfg(not(feature = "local-testing"))]
pub mod constants {
    use solana_program::{pubkey, pubkey::Pubkey};
    pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
}

#[program]
pub mod test_program {
    use super::*;

    pub fn initialize_usdc_token_account(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        token::mint = mint,
        token::authority = payer,
    )]
    pub token: Account<'info, TokenAccount>,
    #[account(address = constants::USDC_MINT_PUBKEY)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

Bu örnekte `cfg` özniteliği, `constants` modülünün iki farklı uygulamasını koşullu olarak derlemek için kullanılır. Bu, programın `local-testing` özelliği etkin olduğunda `USDC_MINT_PUBKEY` sabitine farklı değerler kullanmasını sağlar.

#### Kodun Koşullu Olmasını Sağlamak için cfg! Makrosunu Kullanın

Rust'taki `cfg` özniteliğine benzer şekilde, `cfg!` **makrosu** belirli yapılandırma bayraklarının değerlerini çalıştırma zamanında kontrol etmenizi sağlar. Bu, belirli yapılandırma bayraklarının değerlerine bağlı olarak farklı kod yollarını çalıştırmak istiyorsanız kullanılabilir.

Bu, daha önce bahsettiğimiz NFT staking uygulamasındaki zamana dayalı kısıtlamaları atlamak veya ayarlamak için kullanılabilir. **Bir test çalıştırıldığında, üretim yapısını çalıştırmaktan daha yüksek staking ödülleri sağlayacak kodu yürütmek mümkün olur.**

Bir Anchor programında `cfg!` makrosunu kullanmak için, ilgili koşullu ifade ile `cfg!` makro çağrısını eklemeniz yeterlidir:

```rust
#[program]
pub mod my_program {
    use super::*;

    pub fn test_function(ctx: Context<Test>) -> Result<()> {
        if cfg!(feature = "local-testing") {
            // "local-testing" özelliği etkin olduğunda yalnızca bu kod çalıştırılacak
            // ...
        } else {
            // "local-testing" özelliği etkin olmadığında yalnızca bu kod çalıştırılacak
            // ...
        }
        // Her zaman dahil edilmesi gereken kod buraya yazılır
        ...
        Ok(())
    }
}
```

Bu örnekte `test_function`, çalıştırma zamanında `local-testing` özelliğinin değerini kontrol etmek için `cfg!` makrosunu kullanır. Eğer `local-testing` özelliği etkinse, ilk kod yolu yürütülür. Eğer `local-testing` özelliği etkin değilse, ikinci kod yolu yürütülür.

---

### Yalnızca Yöneticilere Açık Talimatlar

Özellik bayrakları, derleme sırasında değerleri ve kod yollarını ayarlamak için harika olsa da, programınızı dağıttıktan sonra bir şeyi ayarlamanız gerektiğinde pek yardımcı olmaz.

Örneğin, NFT staking programınız farklı bir ödül token'ı kullanmak zorunda kalırsa, programı güncelleyebilmek için yeniden dağıtım yapmanız gerekir. **Program yöneticilerinin belirli program değerlerini güncelleyebilme yeteneği olsaydı... Bu mümkün!**

Öncelikle, programınızı değişkenlerinizi değiştirme ihtimali olduğunuz verileri bir hesaba depolamak üzere yapılandırmalısınız. 

:::warning
Sonra, bu hesabın yalnızca bilinen bir program yetkisi tarafından güncellenebildiğinden emin olmalısınız. Bu, bu hesabın verilerini değiştiren her talimatın kimin bu talimatı imzalayabileceği konusunda sınırlamalar içermesi gerektiği anlamına gelir.
:::

Bu teoride oldukça basit görünüyor, ancak temel bir sorun var: Program yöneticisinin kim olduğunu programın nasıl bileceği?

Elbette bunun birkaç çözümü var, her birinin kendi avantajları ve dezavantajları var:

1. Yalnızca yöneticilere açık talimat kısıtlamalarında kullanılabilecek bir yöneticinin genel anahtarını hard-code yapın.
2. Programın yükseltme yetkisini yöneticilerin yetkisi yapın.
3. Konfigürasyon hesabında yöneticiyi saklayın ve `initialize` talimatında ilk yöneticiyi ayarlayın.

---

#### Konfigürasyon Hesabını Oluşturun

İlk adım programınıza "konfigürasyon" hesabı eklemektir. Bunu ihtiyaçlarınıza en uygun şekilde özelleştirebilirsiniz, ancak tek bir global PDA öneriyoruz. Anchor'da, bu sadece bir hesap yapısı oluşturup tek bir tohum kullanarak hesabın adresini türetmek anlamına gelir.

```rust
pub const SEED_PROGRAM_CONFIG: &[u8] = b"program_config";

#[account]
pub struct ProgramConfig {
    reward_token: Pubkey,
    rewards_per_day: u64,
}
```

Yukarıdaki örnek, bahsettiğimiz NFT staking programı için varsayımsal bir konfigürasyon hesabını temsil etmektedir. **Ödül olarak kullanılacak token'ı ve her staking günü için verilecek token miktarını temsil eden verileri depolar.**

Konfigürasyon hesabı tanımlandıktan sonra, kodun geri kalanının bu değerleri kullanırken bu hesabı referans aldığından emin olun. Bu şekilde, hesap içindeki veriler değişirse, program buna göre uyum sağlar.

#### Konfigürasyon Güncellemelerini Hard-code Yöneticilere Sınırlayın

Konfigürasyon hesabı verilerini başlatma ve güncellemenin bir yolunu bulmalısınız. Bu, yalnızca bir yöneticinin çağırabileceği bir veya daha fazla talimata sahip olmanız gerektiği anlamına gelir. 

:::tip
Bunu gerçekleştirmenin en basit yolu, bir yöneticinin genel anahtarını kodunuza hard-code yapmaktır ve ardından imzacı ile bu genel anahtarı karşılaştırarak talimatlarınızın hesap doğrulamasına basit bir imzacı kontrolü ekleyebilirsiniz.
:::

Anchor'da, `update_program_config` talimat işleyicisini yalnızca bir hard-code yöneticinin kullanabilmesi için kısıtlamak şöyle görünebilir:

```rust
#[program]
mod my_program {
    pub fn update_program_config(
        ctx: Context<UpdateProgramConfig>,
        reward_token: Pubkey,
        rewards_per_day: u64
    ) -> Result<()> {
        ctx.accounts.program_config.reward_token = reward_token;
        ctx.accounts.program_config.rewards_per_day = rewards_per_day;

        Ok(())
    }
}

pub const SEED_PROGRAM_CONFIG: &[u8] = b"program_config";

#[constant]
pub const ADMIN_PUBKEY: Pubkey = pubkey!("ADMIN_WALLET_ADDRESS_HERE");

#[derive(Accounts)]
pub struct UpdateProgramConfig<'info> {
    #[account(mut, seeds = SEED_PROGRAM_CONFIG, bump)]
    pub program_config: Account<'info, ProgramConfig>,
    #[account(constraint = authority.key() == ADMIN_PUBKEY)]
    pub authority: Signer<'info>,
}
```

Talimat işleyici mantığı bile yürütülmeden önce, talimatın imzacısının hard-code `ADMIN_PUBKEY` ile eşleşip eşleşmediği kontrol edilir. Yukarıdaki örnek, konfigürasyon hesabını başlatan talimatı göstermez, ancak bu kısmın da, bir saldırganın hesabı beklenmeyen değerlerle başlatamaması için benzer kısıtlamalara sahip olması gerekir.

Bu yaklaşım işe yarasa da, bir programın yükseltme yetkisi ile birlikte bir yönetici cüzdanını takip etmek anlamına gelir. Birkaç satır daha kod yazarak, bir talimatı yalnızca yükseltme yetkisi tarafından çağrılabilir hale getirebilirsiniz. Tek zor kısım, bir programın yükseltme yetkisini karşılaştırmaktır.

---

#### Konfigürasyon Güncellemelerini Programın Yükseltme Yetkisine Sınırlayın

Neyse ki, her programın `upgrade_authority_address` alanına sahip olan bir program veri hesabı vardır. Program kendisi, bu hesabın adresini kendi verilerinde `programdata_address` alanında saklar.

Bu nedenle, hard-code yönetici örneğinde talimat için gereken iki hesaba ek olarak, bu talimat, `program` ve `program_data` hesaplarını gerektirir.

Hesapların aşağıdaki kısıtlamalara sahip olması gerekir:

1. Sağlanan `program_data` hesabının, programın `programdata_address` alanıyla eşleştiğini sağlayan bir `program` kısıtlaması.
2. Talimatın imzacısının, `program_data` hesabının `upgrade_authority_address` alanıyla eşleştiğini sağlayan bir `program_data` hesabı kısıtlaması.

Tamamlandığında, bu şöyle görünür:

```rust
...

#[derive(Accounts)]
pub struct UpdateProgramConfig<'info> {
    #[account(mut, seeds = SEED_PROGRAM_CONFIG, bump)]
    pub program_config: Account<'info, ProgramConfig>,
    #[account(constraint = program.programdata_address()? == Some(program_data.key()))]
    pub program: Program<'info, MyProgram>,
    #[account(constraint = program_data.upgrade_authority_address == Some(authority.key()))]
    pub program_data: Account<'info, ProgramData>,
    pub authority: Signer<'info>,
}
```

Yine, yukarıdaki örnek, konfigürasyon hesabını başlatan talimatı göstermez, ancak bu kısmın da, bir saldırganın hesabı beklenmeyen değerlerle başlatamaması için benzer kısıtlamalara sahip olması gerekir.

Program veri hesabı hakkında daha önce duymadıysanız, program dağıtımları hakkında 
[bu Notion belgesini](https://www.notion.so/29780c48794c47308d5f138074dd9838) okumanızda fayda var. 

#### Sağlanan Yöneticilere Konfigürasyon Güncellemelerini Sınırlayın

Önceki iki seçenek oldukça güvenli, ancak aynı zamanda esnek değildir. Peki ya yöneticiyi başka birisi olarak güncellemek isterseniz? Bunun için yönetici bilgilerini konfigürasyon hesabında saklayabilirsiniz.

```rust
pub const SEED_PROGRAM_CONFIG: &[u8] = b"program_config";

#[account]
pub struct ProgramConfig {
    admin: Pubkey,
    reward_token: Pubkey,
    rewards_per_day: u64,
}
```

Daha sonra "güncelleme" talimatlarınızı, konfigürasyon hesabının `admin` alanına karşılık gelen bir imzacı denetimi ile sınırlayabilirsiniz.

```rust
...

pub const SEED_PROGRAM_CONFIG: &[u8] = b"program_config";

#[derive(Accounts)]
pub struct UpdateProgramConfig<'info> {
    #[account(mut, seeds = SEED_PROGRAM_CONFIG, bump)]
    pub program_config: Account<'info, ProgramConfig>,
    #[account(constraint = authority.key() == program_config.admin)]
    pub authority: Signer<'info>,
}
```

Burada bir tuhaflık var: bir program dağıtıldığında ve konfigürasyon hesabı başlatılmadan önce _hiçbir yönetici yoktur_. Bu, konfigürasyon hesabını başlatma talimatının yalnızca yöneticilere açık olabileceği anlamına gelir. Bu, bir saldırganın kendisini yönetici olarak atamak istemesi durumunda çağrılabileceği anlamına gelir.

:::danger
Bu kötü bir durum gibi görünse de, programınızı "başlatılmış" olarak değerlendirmemek gerektiğini ifade eder. 
:::

Bu nedenle, konfigürasyon hesabını kendiniz başlatmadıkça ve hesabın üzerinde listelenen yöneticinin beklediğiniz kişi olup olmadığını doğrulamadıkça, programınızı başlatılmış olarak varsaymayın. Eğer dağıtım scriptanız dağıttıktan hemen sonra `initialize` çağrısı yapıyorsa, bir saldırganın programınızın varlığından haberdar olmasının pek olası olmadığı gibi, kendisini yönetici yapmaya çalışması da mümkündür. Eğer birisi "programınızı keserse", programı yükseltme yetkisi ile kapatabilir ve yeniden dağıtabilirsiniz.

---

## Laboratuvar

Şimdi birlikte bunu deneyelim. Bu laboratuvar için, USDC ödemelerine izin veren basit bir program ile çalışacağız. Program, transferi kolaylaştırmak için küçük bir ücret alır. Bunun bir nebze kurgusal olduğunu unutmayın, çünkü aracı bir sözleşme olmadan doğrudan transferler yapabilirsiniz, ancak bazı karmaşık DeFi programlarının nasıl çalıştığını simüle eder.

Programımızı test ederken, bir yöneticinin kontrolünde konfigürasyon hesabı ve bazı özellik bayrakları aracılığıyla sağlanan esneklikten fayda göreceğimizi kısa sürede öğreneceğiz.

---

### 1. Başlangıç

Başlangıç kodunu
[`starter` şubesinden](https://github.com/solana-developers/admin-instructions/tree/starter) indirin. Kod, `tests` dizininde bir tane talimat işleyici ve bir tane test içeren bir programı içerir.

**Programın nasıl çalıştığını hızlıca inceleyelim.**

`lib.rs` dosyası, USDC adresi için bir sabit ve bir tane `payment` talimatı içeriyor. `payment` talimatı, talimat işleyici mantığının bulunduğu `instructions/payment.rs` dosyasındaki `payment_handler` talimatını çağırır.

---

`instructions/payment.rs` dosyası `payment_handler` işlevinin yanı sıra `payment` talimatı için gerekli hesapları temsil eden `Payment` hesap doğrulama yapısını da içerir. `payment_handler` talimat işleyici mantığı, ödeme miktarından %1'lik bir ücreti hesaplar, bu ücreti belirlenen bir token hesabına aktarır ve kalan miktarı ödeme alıcısına aktarır.

Son olarak, `tests` dizininde, `payment` talimatını basitçe çağıran ve karşılık gelen token hesap bakiyelerinin uygun şekilde borçlandığını ve alacaklandığını doğrulayan yalnızca bir test dosyası olan `config.ts` bulunmaktadır.

:::
Devam etmeden önce, bu dosyalarla ve içerikleriyle tanışmak için birkaç dakikanızı ayırın.
:::

### 2. Var olan testi çalıştırın

Var olan testi çalıştırarak başlayalım.

`package.json` dosyasında belirtilen bağımlılıkları yüklemek için `yarn` veya `npm install` kullanmayı unutmayın. Ardından `anchor keys list` komutunu çalıştırarak programınızın genel anahtarının konsola yazdırıldığından emin olun. Bu, yerel olarak sahip olduğunuz anahtarlara bağlı olarak farklıdır, bu nedenle `lib.rs` ve `Anchor.toml` dosyalarını _sizin_ anahtarınıza uygun şekilde güncellemelisiniz.

Son olarak, testi başlatmak için `anchor test` komutunu çalıştırın. **Aşağıdaki hata mesajı ile başarısız olmalıdır:**

```shell
Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: incorrect program id for instruction
```

Bu hatanın nedeni, programın `lib.rs` dosyasında hard-code olarak bulunan ana ağ USDC mint adresini kullanmaya çalışmamızdır; ancak bu mint, yerel ortamda mevcut değildir.


### 3. Yerel Test Özelliği Ekleme

Bunu düzeltmek için, yerel olarak kullanabileceğimiz ve programın içine gömülü olarak yazabileceğimiz bir mint'e ihtiyacımız var. Yerel ortam test sırasında sık sık sıfırlanacağı için, her seferinde aynı mint adresini yeniden oluşturmak için kullanabileceğiniz bir anahtar çifti saklamanız gerekiyor.

> **İpucu:** Hard-coded adresi yerel ve ana ağ (mainnet) derlemeleri arasında değiştirmek zorunda kalmak istemezsiniz, çünkü bu insan hatasına neden olabilir (ve sadece can sıkıcıdır). Bu nedenle, etkinleştirildiğinde programın yerel mint'imizi kullanmasını sağlayacak bir `local-testing` özelliği oluşturacağız, aksi takdirde üretim USDC mint'ini kullanır.

Yeni bir anahtar çifti oluşturmak için `solana-keygen grind` komutunu çalıştırın. "env" ile başlayan bir açık anahtara sahip bir anahtar çifti oluşturmak için aşağıdaki komutu çalıştırın.

```shell
solana-keygen grind --starts-with env:1
```

Bir anahtar çifti bulunduğunda, aşağıdaki gibi bir çıktı görmelisiniz:

```shell
Wrote keypair to env9Y3szLdqMLU9rXpEGPqkjdvVn8YNHtxYNvCKXmHe.json
```

:::warning
Oluşturulan anahtar çifti dosyasını (`env9Y3szLdqMLU9rXpEGPqkjdvVn8YNHtxYNvCKXmHe.json`) `.gitignore` dosyanıza eklemeyi unutmayın, böylece anahtar çiftinizi GitHub veya diğer versiyon kontrol platformlarına yanlışlıkla yüklemekten kaçınabilirsiniz. Anahtar çiftini daha sonra kullanmayı planlıyorsanız, onu düzgün bir şekilde korumak kritik öneme sahiptir.
:::

Anahtar çifti çalışma dizininizde bir dosyaya yazılır. Artık bir yer tutucu USDC adresine sahip olduğumuza göre, `lib.rs` dosyasını değiştirelim. `local-testing` özelliği etkinleştirildiğinde veya devre dışı bırakıldığında `USDC_MINT_PUBKEY` sabitini tanımlamak için `cfg` niteliğini kullanın. `local-testing` için `USDC_MINT_PUBKEY` sabitini önceki adımda oluşturulanla ayarlamayı unutmayın.

```rust
use anchor_lang::prelude::*;
mod instructions;
use instructions::*;

declare_id!("BC3RMBvVa88zSDzPXnBXxpnNYCrKsxnhR3HwwHhuKKei");

#[cfg(feature = "local-testing")]
#[constant]
pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("...");

#[cfg(not(feature = "local-testing"))]
#[constant]
pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

#[program]
pub mod config {
    use super::*;

    pub fn payment(ctx: Context<Payment>, amount: u64) -> Result<()> {
        instructions::payment_handler(ctx, amount)
    }
}
```

Sonra, `/programs` altında bulunan `Cargo.toml` dosyasına `local-testing` özelliğini ekleyin.

```shell
[features]
...
local-testing = []
```

Sonra, oluşturulan anahtar çiftini kullanarak bir mint oluşturmak için `config.ts` test dosyasını güncelleyin. `mint` sabitini silerek başlayın.

```typescript
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
```

:::info
`anchor test` komutu, yerel bir ağda çalıştırıldığında `solana-test-validator` kullanarak yeni bir test doğrulayıcısı başlatır. Bu test doğrulayıcısı, yükseltilemeyen bir yükleyici kullanır. Yükseltilemeyen yükleyici, programın `program_data` hesabının doğrulayıcı başlatıldığında başlatılmadığı anlamına gelir. Bu hesabın, programdan yükseltme yetkisini erişim biçimi olduğunu derslerden hatırlarsınız.
:::

Bunun etrafında çalışmak için, program için yükseltilebilir bir yükleyici ile dağıtım komutunu çalıştıran test dosyasına bir `deploy` işlevi ekleyebilirsiniz. Kullanmak için, `anchor test --skip-deploy` komutunu çalıştırın ve test doğrulayıcısı başladıktan sonra dağıtım komutunu çalıştırmak için test içinde `deploy` işlevini çağırın.

```typescript
import { execSync } from "child_process";
import path from "path";

...

const deploy = () => {
  const workingDirectory = process.cwd();
  const programKeypairPath = path.join(
    workingDirectory,
    "target",
    "deploy",
    "config-keypair.json",
  );
  const programBinaryPath = path.join(
    workingDirectory,
    "target",
    "deploy",
    "config.so",
  );

  const deploy_command = `solana program deploy --url localhost -v --program-id "${programKeypairPath}" "${programBinaryPath}"`;

  try {
    execSync(deploy_command, { stdio: "inherit" });
    console.log("Program başarıyla dağıtıldı");
  } catch (error) {
    console.error("Programı dağıtırken hata:", error.message);
    throw error;
  }
};

...

before(async () => {
  deploy();
  ...
});
```

Örneğin, özelliklerle test çalıştırmak için komut şöyle görünecektir:

```shell
anchor test --skip-deploy -- --features "local-testing"
```

Sonra, aynı mint adresini her seferinde testlerin çalıştırılması için anahtar çiftini kullanarak mint oluşturacak şekilde testi güncelleyin. Lütfen dosya adını önceki adımda oluşturulanla değiştirin.

```typescript
let tokenMint: PublicKey;

const deploy = () => {
  const workingDirectory = process.cwd();
  const programKeypairPath = path.join(
    workingDirectory,
    "target",
    "deploy",
    "config-keypair.json",
  );
  const programBinaryPath = path.join(
    workingDirectory,
    "target",
    "deploy",
    "config.so",
  );

  const deploy_command = `solana program deploy --url localhost -v --program-id "${programKeypairPath}" "${programBinaryPath}"`;

  try {
    execSync(deploy_command, { stdio: "inherit" });
    console.log("Program başarıyla dağıtıldı");
  } catch (error) {
    console.error("Programı dağıtırken hata:", error.message);
    throw error;
  }
};

before(async () => {
  try {
      deploy();
      const mintKeypairData = fs.readFileSync(
        "envYcAnc9BvWEqDy4VKJsiECCbbc72Fynz87rBih6DV.json"
      );
      const mintKeypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(mintKeypairData))
      );

      tokenMint = await createMint(
        connection,
        walletAuthority.payer,
        walletAuthority.publicKey,
        null,
        0,
        mintKeypair
      );
...
```

Son olarak, `local-testing` özelliği etkinleştirilmiş olarak testi çalıştırın.

```shell
anchor test --skip-deploy -- --features "local-testing"
```

Aşağıdaki çıktıyı görmelisiniz:

```shell
Config
  ✔ pembayaran berhasil diselesaikan (432ms)


  1 passing (21s)
```

Hürr. İşte böyle, farklı ortamlar için iki farklı kod yolunu çalıştırmak için özellikleri kullandınız.

---

### 4. Program Yapılandırması

Özellikler, derleme aşamasında farklı değerler ayarlamak için harika, ama ya program tarafından kullanılan ücret yüzdesini dinamik olarak güncelleyebilmek isterseniz? Bunu mümkün kılmak için, programı yükseltmeden ücreti güncelleyebileceğimiz bir Program Yapılandırma hesabı oluşturalım.

Başlamak için, ilk olarak `lib.rs` dosyasını güncelleyelim:

1. Program yapılandırma hesabı için PDA'yı oluşturmak üzere kullanılacak bir `SEED_PROGRAM_CONFIG` sabitini ekleyin.
2. Program yapılandırma hesabını başlatırken bir kısıtlama olarak kullanılacak bir `ADMIN` sabitini ekleyin. Sabitin değeri olarak kullanmak için adresinizi almak üzere `solana address` komutunu çalıştırın.
3. Kısa süre içinde uygulayacağımız bir `state` modülü ekleyin.
4. Uygulayacağımız `initialize_program_config` ve `update_program_config` talimatlarını ve bunların "işleyicileri" için çağrıları ekleyin.

```rust
use anchor_lang::prelude::*;
mod instructions;
use instructions::*;
mod state;

declare_id!("FF3eGbZnharYruJNwRV7jqnDYvpLkyvgbSv5gsGbJHps");

#[cfg(not(feature = "local-testing"))]
#[constant]
pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

#[cfg(feature = "local-testing")]
#[constant]
pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("envYcAnc9BvWEqDy4VKJsiECCbbc72Fynz87rBih6DV");

pub const SEED_PROGRAM_CONFIG: &[u8] = b"program_config";

#[constant]
pub const ADMIN: Pubkey = pubkey!("GprrWv9r8BMxQiWea9MrbCyK7ig7Mj8CcseEbJhDDZXM");

#[program]
pub mod config {

    use super::*;

    pub fn payment(ctx: Context<Payment>, amount: u64) -> Result<()> {
        instructions::payment_handler(ctx, amount)
    }

    pub fn initialize_program_config(ctx: Context<InitializeProgramConfig>) -> Result<()> {
        instructions::initialize_program_config_handler(ctx)
    }

    pub fn update_program_config(ctx: Context<UpdateProgramConfig>, new_fee: u64) -> Result<()> {
        instructions::update_program_config_handler(ctx, new_fee)
    }
}
```

### 5. Program Yapılandırma Durumu

Sonra, `ProgramConfig` durumunun yapısını tanımlayalım. Bu hesap admin'i, ücretlerin gönderileceği token hesabını ve ücret oranını depolayacaktır. Bu yapıyı depolamak için gereken bayt sayısını da belirleyeceğiz.

`/src` dizininde `state.rs` adında yeni bir dosya oluşturun ve aşağıdaki kodu ekleyin.

```rust
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProgramConfig {
    pub admin: Pubkey,
    pub fee_destination: Pubkey,
    pub fee_basis_points: u64,
}
```

### 6. Program Yapılandırma Hesabı Talimatını Ekle

Artık program yapılandırma hesabını başlatmak için talimat mantığını oluşturalım. Bu, yalnızca `ADMIN` anahtarıyla imzalanmış bir işlem tarafından çağrılabilir ve `ProgramConfig` hesabındaki tüm özellikleri ayarlamalıdır.

`/src/instructions/program_config` yolunda `program_config` adında bir klasör oluşturun. Bu klasör, program yapılandırma hesabıyla ilgili tüm talimatları depolayacaktır.

`program_config` klasörü içinde `initialize_program_config.rs` adında bir dosya oluşturun ve aşağıdaki kodu ekleyin.

```rust
use crate::state::ProgramConfig;
use crate::{ADMIN, SEED_PROGRAM_CONFIG, USDC_MINT_PUBKEY};
use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

pub const DISCRIMINATOR_SIZE: usize = 8;

#[derive(Accounts)]
pub struct InitializeProgramConfig<'info> {
    #[account(
        init,
        seeds = [SEED_PROGRAM_CONFIG],
        bump,
        payer = authority,
        space = DISCRIMINATOR_SIZE + ProgramConfig::INIT_SPACE
    )]
    pub program_config: Account<'info, ProgramConfig>,
    #[account(token::mint = USDC_MINT_PUBKEY)]
    pub fee_destination: Account<'info, TokenAccount>,
    #[account(mut, address = ADMIN)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_program_config_handler(ctx: Context<InitializeProgramConfig>) -> Result<()> {
    ctx.accounts.program_config.set_inner(ProgramConfig {
        admin: ctx.accounts.authority.key(),
        fee_destination: ctx.accounts.fee_destination.key(),
        fee_basis_points: 100,
    });
    Ok(())
}
```

### 7. Program Yapılandırma Ücretini Güncelleme Talimatını Ekle

Sonra, yapılandırma hesabını güncelleme talimatı mantığını uygulayın. Talimat, imzacıların `program_config` hesabında depolanan `admin` ile eşleşmesini gerektirmelidir.

`program_config` klasörü içinde `update_program_config.rs` adında bir dosya oluşturun ve aşağıdaki kodu ekleyin.

```rust
use crate::state::ProgramConfig;
use crate::{SEED_PROGRAM_CONFIG, USDC_MINT_PUBKEY};
use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

#[derive(Accounts)]
pub struct UpdateProgramConfig<'info> {
    #[account(mut, seeds = [SEED_PROGRAM_CONFIG], bump)]
    pub program_config: Account<'info, ProgramConfig>,
    #[account(token::mint = USDC_MINT_PUBKEY)]
    pub fee_destination: Account<'info, TokenAccount>,
    #[account(mut, address = program_config.admin)]
    pub admin: Signer<'info>,
    /// CHECK: mevcut admin tarafından rastgele atandı
    pub new_admin: UncheckedAccount<'info>,
}

pub fn update_program_config_handler(
    ctx: Context<UpdateProgramConfig>,
    new_fee: u64,
) -> Result<()> {
    ctx.accounts.program_config.admin = ctx.accounts.new_admin.key();
    ctx.accounts.program_config.fee_destination = ctx.accounts.fee_destination.key();
    ctx.accounts.program_config.fee_basis_points = new_fee;
    Ok(())
}
```

### 8. mod.rs Ekle ve instructions.rs'yi Güncelle

Sonra, `lib.rs`'den gelen çağrının hata vermemesi için oluşturduğumuz talimat işleyicilerini dışa aktaralım. `program_config` klasöründe bir `mod.rs` dosyası ekleyin. İki modülü, `initialize_program_config` ve `update_program_config` erişilebilir hale getirmek için aşağıdaki kodu ekleyin.

```rust
mod initialize_program_config;
pub use initialize_program_config::*;

mod update_program_config;
pub use update_program_config::*;
```

Artık `/src/instructions.rs` dosyasını güncelleyerek kodu aşağıdaki gibi `program_config` ve `payment` modüllerini erişilebilir hale getirin.

```rust
mod program_config;
pub use program_config::*;

mod payment;
pub use payment::*;
```

### 9. Ödeme Talimatını Güncelle

Son olarak, ödeme talimatını güncelleyerek `fee_destination` hesabının talimatlardaki `fee_destination` ile eşleştiğini kontrol edin. Ardından, talimatın ücret hesaplamasını program yapılandırma hesabında depolanan `fee_basis_point`'a dayandıracak şekilde güncelleyin.

```rust
use crate::state::ProgramConfig;
use crate::{SEED_PROGRAM_CONFIG, USDC_MINT_PUBKEY};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

#[derive(Accounts)]
pub struct Payment<'info> {
    #[account(
        seeds = [SEED_PROGRAM_CONFIG],
        bump,
        has_one = fee_destination
    )]
    pub program_config: Account<'info, ProgramConfig>,
    #[account(mut, token::mint = USDC_MINT_PUBKEY)]
    pub fee_destination: Account<'info, TokenAccount>,
    #[account(mut, token::mint = USDC_MINT_PUBKEY)]
    pub sender_token_account: Account<'info, TokenAccount>,
    #[account(mut, token::mint = USDC_MINT_PUBKEY)]
    pub receiver_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub sender: Signer<'info>,
}

pub fn payment_handler(ctx: Context<Payment>, amount: u64) -> Result<()> {
    let fee_amount = amount
        .checked_mul(ctx.accounts.program_config.fee_basis_points)
        .ok_or(ProgramError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    let remaining_amount = amount.checked_sub(fee_amount).ok_or(ProgramError::ArithmeticOverflow)?;

    msg!("Miktar: {}", amount);
    msg!("Ücret Miktarı: {}", fee_amount);
    msg!("Kalan Transfer Miktarı: {}", remaining_amount);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.sender_token_account.to_account_info(),
                authority: ctx.accounts.sender.to_account_info(),
                to: ctx.accounts.fee_destination.to_account_info(),
            },
        ),
        fee_amount,
    )?;

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.sender_token_account.to_account_info(),
                authority: ctx.accounts.sender.to_account_info(),
                to: ctx.accounts.receiver_token_account.to_account_info(),
            },
        ),
        remaining_amount,
    )?;

    Ok(())
}

### 10. Test

Yeni program yapılandırma yapımızı ve talimatlarımızı uyguladıktan sonra, güncellenmiş programımızı test etmeye geçelim. Başlamak için, test dosyasına program yapılandırma hesabı için PDA ekleyin.

```typescript
describe("Config", () => {
  ...
  const programConfig = findProgramAddressSync(
    [Buffer.from("program_config")],
    program.programId
  )[0]
...
```

Sonraki adımda, test dosyasını şu üç testle güncelleyin:

1. Program yapılandırma hesabının doğru bir şekilde başlatıldığı
2. Ödeme talimatının beklendiği gibi çalıştığı
3. Yapılandırma hesabının admin tarafından başarıyla güncellenebildiği
4. Yapılandırma hesabının admin dışında birisi tarafından güncellenemediği

**İlk test**, program yapılandırma hesabını başlatır ve doğru ücretin ayarlandığını ve doğru adminin program yapılandırma hesabında saklandığını doğrular.

```typescript
it("initializes program config account", async () => {
  try {
    await program.methods
      .initializeProgramConfig()
      .accounts({
        programConfig: programConfig,
        feeDestination: feeDestination,
        authority: walletAuthority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const configAccount =
      await program.account.programConfig.fetch(programConfig);
    
    expect(configAccount.feeBasisPoints.toNumber()).to.equal(
      INITIAL_FEE_BASIS_POINTS,
    );
    expect(configAccount.admin.toString()).to.equal(
      walletAuthority.publicKey.toString(),
    );
  } catch (error) {
    console.error("Program config initialization failed:", error);
    throw error;
  }
});
```

:::tip
**İpuçları**: Testlerinizi işlerken, değişikliklerinizi sıklıkla kontrol edin ve geribildirim alın. Error loglarını dikkatle incelemek, hataları hızlıca çözmenize yardımcı olabilir.
:::

**İkinci test**, ödeme talimatının doğru çalıştığını doğrular; ücret, ücret varlığına gönderilir ve kalan bakiye alıcıya aktarılır. Burada, mevcut testi `programConfig` hesabını dahil etmek için güncelliyoruz.

```typescript
it("completes payment successfully", async () => {
  try {
    const transaction = await program.methods
      .payment(new anchor.BN(PAYMENT_AMOUNT))
      .accounts({
        programConfig: programConfig,
        feeDestination: feeDestination,
        senderTokenAccount: senderTokenAccount,
        receiverTokenAccount: receiverTokenAccount,
        sender: sender.publicKey,
      })
      .transaction();

    await anchor.web3.sendAndConfirmTransaction(connection, transaction, [
      sender,
    ]);

    const senderBalance = await getAccount(connection, senderTokenAccount);
    const feeDestinationBalance = await getAccount(connection, feeDestination);
    const receiverBalance = await getAccount(connection, receiverTokenAccount);

    expect(Number(senderBalance.amount)).to.equal(0);
    expect(Number(feeDestinationBalance.amount)).to.equal(
      (PAYMENT_AMOUNT * INITIAL_FEE_BASIS_POINTS) / 10000,
    );
    expect(Number(receiverBalance.amount)).to.equal(
      (PAYMENT_AMOUNT * (10000 - INITIAL_FEE_BASIS_POINTS)) / 10000,
    );
  } catch (error) {
    console.error("Payment failed:", error);
    throw error;
  }
});
```

:::info
**Not**: Bakiye kontrolü için doğru hesap bilgilerine erişiminiz olduğundan emin olun. Bu, testlerin geçirilebilirliğini etkileyebilir.
:::

**Üçüncü test**, program yapılandırma hesabındaki ücreti güncellemeye çalışır ve bunun başarılı olması beklenir.

```typescript
it("updates program config account", async () => {
  try {
    await program.methods
      .updateProgramConfig(new anchor.BN(UPDATED_FEE_BASIS_POINTS))
      .accounts({
        programConfig: programConfig,
        admin: walletAuthority.publicKey,
        feeDestination: feeDestination,
        newAdmin: walletAuthority.publicKey,
      })
      .rpc();

    const configAccount =
      await program.account.programConfig.fetch(programConfig);
    expect(configAccount.feeBasisPoints.toNumber()).to.equal(
      UPDATED_FEE_BASIS_POINTS,
    );
  } catch (error) {
    console.error("Program config update failed:", error);
    throw error;
  }
});
```

**Dördüncü test**, program yapılandırma hesabındaki ücreti güncellemeye çalışırken, adminin program yapılandırma hesabında saklanmadığı durumu kontrol eder ve bunun başarısız olması gerekir.

```typescript
it("fails to update program config account with unauthorized admin", async () => {
  try {
    const transaction = await program.methods
      .updateProgramConfig(new anchor.BN(300))
      .accounts({
        programConfig: programConfig,
        admin: sender.publicKey,
        feeDestination: feeDestination,
        newAdmin: sender.publicKey,
      })
      .transaction();

    await anchor.web3.sendAndConfirmTransaction(connection, transaction, [
      sender,
    ]);
    throw new Error("Expected transaction to fail, but it succeeded");
  } catch (error) {
    expect(error).to.exist;
    console.log("Transaction failed as expected:", error.message);
  }
});
```

**Son olarak**, testi aşağıdaki komutla çalıştırın:

```shell
anchor test --skip-deploy -- --features "local-testing"
```

Aşağıdaki çıktıyı görmelisiniz:

```shell
Config
    ✔ initializes program config account (430ms)
    ✔ completes payment successfully (438ms)
    ✔ updates program config account (416ms)
Transaction failed as expected: Simulation failed.
Message: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x7dc.
Logs:
[
  "Program FF3eGbZnharYruJNwRV7jqnDYvpLkyvgbSv5gsGbJHps invoke [1]",

  "Program log: Instruction: UpdateProgramConfig",  "Program log: AnchorError caused by account: admin. Error Code: ConstraintAddress. Error Number: 2012. Error Message: An address constraint was violated.",
  "Program log: Left:",
  "Program log: F32dEMPn4BtQjHBgXXwfuEMo5qBQJySs8cCDrtwWQdBr",
  "Program log: Right:",
  "Program log: GprrWv9r8BMxQiWea9MrbCyK7ig7Mj8CcseEbJhDDZXM",
  "Program FF3eGbZnharYruJNwRV7jqnDYvpLkyvgbSv5gsGbJHps consumed 7868 of 200000 compute units",
  "Program FF3eGbZnharYruJNwRV7jqnDYvpLkyvgbSv5gsGbJHps failed: custom program error: 0x7dc"
].
Catch the `SendTransactionError` and call `getLogs()` on it for full details.
    ✔ fails to update program config account with unauthorized admin

  4 passing (22s)
```

Ve bu kadar! **Programı gelecekte daha kolay çalışacak hale getirdiniz.** Son çözüm koduna bakmak isterseniz, [bu](https://github.com/solana-developers/admin-instructions/tree/solution) reposunun `solution` dalında bulabilirsiniz.

## Challenge

Artık bazılarını kendiniz yapma zamanı geldi. Programın yükseltme yetkisini başlangıçta admin olarak kullanabileceğimizi belirtmiştik. Labın `initialize_program_config` fonksiyonunu, yalnızca yükseltme yetkisi çağırabilir şekilde güncelleyebilirsiniz; bunun yerine sabit kodlanmış bir `ADMIN` olmadan.

Bunu kendiniz yapmayı deneyin, ancak takılırsanız, [bu](https://github.com/solana-developers/admin-instructions/tree/challenge) reposunun `challenge` dalını referans alarak bir örnek çözüm görebilirsiniz.


<summary>Callout: Lab'ı tamamladınız mı?</summary>

Kodunuzu GitHub'a yükleyin ve
[bize bu derste ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=02a7dab7-d9c1-495b-928c-a4412006ec20)!
