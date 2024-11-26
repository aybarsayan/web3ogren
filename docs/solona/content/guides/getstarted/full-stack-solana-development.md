---
date: 2024-02-29T00:00:00Z
difficulty: intermediate
title: "Tam Yığın Solana Geliştirme ile React ve Anchor"
description: "React ve Anchor ile tam yığın bir Solana dApp nasıl inşa edilir öğrenin"
tags:
  - web3js
  - anchor
keywords:
  - anchor
  - web3js
  - solana
  - anchor eğitimi
  - solana geliştirme girişi
  - blockchain geliştirici
  - blockchain eğitimi
  - web3 geliştirici
---

Bu kılavuz, React ve Anchor kullanarak tam yığın bir Solana dApp oluşturma sürecini size gösterecek. Bir yürüyüş video kaydına [buradan](https://youtu.be/vUHF1X48zM4) ulaşabilirsiniz.

Eğer daha önce Solana kullanmadıysanız ve bir blockchain'in ne olduğunu bilmiyorsanız, temel bilgileri öğrenmek için [bu hızlı kursu](https://www.youtube.com/watch?v=uH60e4gZBSY) kontrol edebilirsiniz. 

:::tip
Bu kılguidaki herhangi bir kelime veya terim karışıklığı yaşıyorsanız, Solana belgelerinde `terminoloji` sayfasına göz atın, gerçekten oldukça iyi!
:::

> Bu kılavuzun son kodu [bu depo](https://github.com/AlmostEfficient/full-stack-solana-dev) içerisinde bulunmaktadır.

## Proje Genel Bakış

Bu araçları kullanarak bir tam yığın Solana uygulaması geliştireceğiz:

- **Anchor** - Rust kullanarak Solana programları oluşturmak için program
- **Solana CLI** - Solana ile etkileşimde bulunmak için komut satırı arayüzü
- **React** - ön uç çerçevesi
- **wallet-adapter** - cüzdanları uygulamanızla bağlamak için kütüphane

### Neler Öğreneceksiniz

- Anchor kullanarak Rust dilinde bir Solana programı nasıl oluşturulur
- Anchor programlarının test edilmesi
- Solana devnet'e dağıtım
- Başlangıçtan itibaren Solana ile etkileşimde bulunan bir React uygulaması inşa etmek
- React uygulamanızın Solana programınıza bağlanması

---

### Ortam Kurulumu

Başlamak için, ortamınızı kurmanız gerekecek. Bu kılavuzun MacOS veya Linux üzerinde çalıştığını varsayıyoruz. Windows kullanıyorsanız, WSL yüklemeniz ve bunu kullanmanız gerekecek, [işte burada](https://learn.microsoft.com/en-us/windows/wsl/install) nasıl yapacağınız.

**İhtiyacınız olan araçların bir listesi:**

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Rust](https://www.rust-lang.org/tools/install/)
- `Solana CLI`
- [Anchor](https://www.anchor-lang.com/docs/installation)

Node ve Yarn'ı yukarıda bağlantılarını verdiğim kurulum sayfalarından indirebilirsiniz. Kalanlar için, farklı işletim sistemleri için detaylı talimatların bulunduğu `Solana Yerel Geliştirme Kılavuzu` 'nu kontrol edin.

**Bu kılavuz için Anchor 0.29 kullanacağız**. Bununla birlikte olduğunuzdan emin olabilirsiniz `avm use 0.29.0` komutunu çalıştırarak.

Her şey kurulu olduğunda, bu komutu çalıştırın:

```shell
solana --version; node -v; yarn --version; anchor --version
```


Windows Kullanıcıları için Önemli Bilgi

:::warning
WSL terminali değil, Windows terminali kullandığınızdan emin olun.
:::



Birçok sürümün ekrana yazdırıldığını görmelisiniz. Eğer bir hata alırsanız, eksik aracı yüklemeniz gerekecek.

Eğer henüz bir Solana cüzdanı oluşturmadıysanız, bunu şu komutla yapabilirsiniz:

```shell
solana-keygen new
```

Bir parolayı girmeniz gerektiği belirtilecektir. Bu, işlemleri imzalamak ve cüzdanınızla etkileşimde bulunmak için kullanacağınız şifredir. Ben sadece cüzdanımı geliştirme için kullandığım için ben boş bıraktım.

Son olarak, inşa ettiğiniz web uygulamasıyla etkileşimde bulunmak için bir Solana tarayıcı cüzdan uzantısına ihtiyacınız olacak. Kullanabileceğiniz bazı popüler cüzdanlar: [Phantom](https://phantom.app/), [Solflare](https://solflare.com/) ve [Backpack](https://backpack.app/).

## Bir Solana Programı Yazın ve Dağıtın

Öncelikle Solana Programımızla başlayacağız (bazen akıllı sözleşme olarak adlandırılır). Bu, etkileşimde bulunacağımız Solana blockchain'inde yer alacak Rust kodu. İşleri hızlandırmak için önce programımızı makinemizde çalışan yerel bir Solana ağına dağıtacağız. Solana CLI'nizi localnet'e şu şekilde yapılandırın:

```shell
solana config set --url localhost
```

Şimdi yerel doğrulayıcıyı ayarlamamız gerekiyor. Yeni bir terminal penceresi açın ve bu komutları çalıştırın:

```shell
cd ~
solana-test-validator
```

(Windows kullanıcıları için - `solana-test-validator` yalnızca `~` dizininde çalışır.)

Aşağıdaki gibi birçok günlük göreceksiniz:

```shell
endgame@~>solana-test-validator
Ledger location: test-ledger
Log: test-ledger/validator.log
⠈ Initializing...
Waiting for fees to stabilize 1...
Identity: 4GrmBaUtMM4CEKBDkwwne9AAVH9gzfqcoqm1Xwj3BfgT
Genesis Hash: E2yTivG7cf2pzfkQCtc3F3QPnerzFSS5Yya5MYnUUG8n
Version: 1.18.1
Shred Version: 18282
Gossip Address: 127.0.0.1:1024
TPU Address: 127.0.0.1:1027
JSON RPC URL: http://127.0.0.1:8899
WebSocket PubSub URL: ws://127.0.0.1:8900
⠉ 00:02:13 | Processed Slot: 321 | Confirmed Slot: 321 | Finalized Slot: 289 | Full Snapshot Slot: 200 | Incremental Snapshot Slot
```

Harika! Makinenizde komplet bir Solana ağı çalışıyor. Bu terminal penceresini açık tutun -- eğer kapatırsanız bu yerel ağ kapanır. Bu yerel ağ, varsayılan olarak CLI adresinize 500000000 SOL airdrop eder. Eğlencesi olsun diye, biraz daha airdrop yapalım.

Yeni bir terminal penceresi açın ve şu komutları çalıştırın:

```shell
solana airdrop 100
solana balance
```

Artık `500000100 SOL` görmelisiniz! Bu, hayal edebileceğiniz her şey için yeterli. Diğer kümelerde (geliştirici ağı veya test ağı gibi) çalışırken, 0 SOL ile başlayacaksınız. SOL'inizi dikkatli bir şekilde kullanmak ve sadece bakiyeniz düşük olduğunda airdrop yapmak önemlidir.

Tamam, biraz kod yazalım!

### Bir Anchor Projesi Kurun

Anchor, Solana programları oluşturmak için bir çerçevedir. Yazmanız gereken boilerplate kod miktarını azaltır ve tür güvenliği ve test gibi birçok yararlı özellik ekler. Çalışma alanınızda, `counter` adında yeni bir Anchor projesi oluşturmak ve içine girmek için şu komutları çalıştırın:

```shell
anchor init counter
cd counter
```

Program kodumuz `programs/counter/src` dizininde yer alacak. Bu programla etkileşimde bulunup test etmek için Mocha/Chai ile desteklenen `tests/counter.ts` dosyasını kullanacağız. Şu aşamada burada başka şeyleri görmezden gelebilirsiniz.

:::note
Solana'da program geliştirme sürecinin en yaygın akışı şu şekildedir:

1. Rust dilinde program yazın
2. Hataları kontrol etmek için programı oluşturun (veya gerçek zamanlı hatalar için [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) kullanın)
3. Beklediğiniz gibi çalıştığından emin olmak için Mocha/Chai testleri yazın
4. Programı test edin
5. Dağıtıma hazır olduğunuzda tekrar edin
:::

Anchor projeleri, kutudan çıkmadan dağıtım için ihtiyacımız olan her şeye sahiptir. Programı oluşturmak için şu komutu çalıştırın:

```shell
anchor build
```

Bu, eski makinelerde ilk çalıştırıldığında bir dakikayı bulabilir. Bu komut, `programs/counter/src` içerisindeki Rust kodunu, Solana blockchain'ine dağıtılacak bir program ikili dosyası haline getirir. Projelerinizde yeni bir `counter/target` klasörünün belirdiğini göreceksiniz. Programınız için oluşturulan tüm artefaktlar burada bulunmaktadır. Komut çalışmayı bitirdikten sonra, şu şekilde bir sonuç alabilirsiniz:

```shell
   Compiling counter v0.1.0 (/mnt/full-stack-solana-dev/counter/programs/counter)
warning: unused variable: `ctx`
 --> programs/counter/src/lib.rs:9:23
  |
9 |     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
  |                       ^^^ help: if this is intentional, prefix it with an underscore: `_ctx`
  |
  = note: `#[warn(unused_variables)]` on by default

warning: `counter` (lib) generated 1 warning (run `cargo fix --lib -p counter` to apply 1 suggestion)
    Finished release [optimized] target(s) in 4m 43s
```

Bir Solana programı oluşturdunuz! Buradaki çıktı, Rust derleyicisinden gelmektedir. Herhangi bir hata, uyarı veya kodunuzdaki başka sorunlar varsa, bunları burada göreceksiniz.

`programs/counter/src/lib.rs` dosyasını açın ve yeni oluşturduğunuz koda bir göz atın:

```rust filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("Bims5KmWhFne1m1UT4bfSknBEoECeYfztoKrsR2jTnrA");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```

İlk satır, Javascript'deki `import` ifadesine benzer şekilde `anchor_lang` Rust kütüphanesini içeri aktarıyor. Sonra `declare_id!` Rust makrosunu görüyoruz. Rust'taki makrolar, diğer kodları yazan kodlardır. Anchor, programınız için bir anahtar çiftini otomatik olarak oluşturur; buradaki ID, o anahtar çiftinin genel anahtarıdır.

Solana programları ağa dağıtıldığında, "başlatılmaları" gerekir. Bu kurulum adımı önemlidir çünkü program mantığının bağımlı olacağı başlangıç durumunu ayarlar. Ayrıca, programın durum kapasitesini kontrol etmesini sağlamak için hesapların sahipliğini programa atar. Bu, iş yapmaya başlamadan önce yeni bir ofis kurmaya benzetilebilir.

:::note
Bu sadece bir işlev gerçekleştiren bir Solana programıdır: başlatır. Bir kez tamamlandığında, çıkış yapar. Buradaki başlatma adımında herhangi bir şey yapmamaktadır.
:::

Bu program için dahil edilen testi `tests/counter.ts` dosyasında bulacaksınız:

```ts filename="tests/counter.ts"
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";

describe("counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Counter as Program<Counter>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
```

Eğer daha önce Mocha kullanmadıysanız, bu size yabancı gelebilir. `describe`, bir test setindeki ilişkili testleri gruplamak için kullanılır ve `it`, bireysel test durumlarını tanımlamak için kullanılır. Anchor, programlarla etkileşimde bulunmayı gerçekten kolay hale getiren hoş bir API sağlar.

::::note
İşte Anchor ve ilgili bölümler:

- `AnchorProvider`, yapılandırılmış Solana geliştirme ortamımıza (local-test-validator) bağlantı sağlamamıza olanak tanır.
- `const program = anchor.workspace.Counter` az önce oluşturduğumuz programa bir referans oluşturur.
- `as Program` programı, programı oluşturduğumuzda Anchor tarafından üretilen IDL'deki tipe dönüştürür.
- `program.methods`, programda tanımladığımız yöntemlere erişim sağlar.
- `initialize().rpc()` 'initialize' yöntemini çağıran bir RPC isteği gönderir.
::::

Bu testi `anchor test --skip-local-validator` ile çalıştırdığınızda şu çıktıyı almalısınız:

```shell
  counter
Your transaction signature 2pMJRoC2h3AmCpfHQaptKTWV7Hyfuc2Gujfzrv6cffRhjptcuPbpMgahgrxtw28kRQ5Gf4d5VdMcon4j9aEmPyVy
    ✔ Is initialized! (325ms)

  1 passing (330ms)

Done in 12.65s.
```

Testler çalıştırılırken, Anchor otomatik olarak bir yerel doğrulayıcı kurar. Zaten bir tane çalıştığı için, bu adımı atlaması ve kendi doğrulayıcımızı kullanmasını isteyebiliriz; bu `--skip-local-validator` bayrağı ile sağlanır.

### Rust içinde bir sayacı programı yazın

İlk programınızı yazmaya hazır mısınız? Sayacı artıran ve mevcut değeri döndüren basit bir program oluşturacağız.

Başlamadan önce, temiz bir sayfadan başlamak için `counter/target` klasörünü silin. `anchor build` çalıştırdığınızda arka planda birçok işlem yapılır, bunlar arasında programınız için oluşturulan anahtar çiftinin depolanacağı `counter/target/deploy/counter-keypair.json` yolu vardır.

`target` klasörünü silmek, önceki program için tüm artefaktları kaldırır, dağıtılması için kullanılan anahtar çiftini de içerir. Bu, daha önce dağıtılan programların kontrolünü kaybedeceğiniz anlamına gelir (şablon programı umurumuzda değil, bu yüzden sorun değil).

Hazırız, şimdi bir sayaç oluşturalım! `programs/counter/src/lib.rs` dosyasını açın ve bununla değiştirin:

```rust filename="lib.rs"
use anchor_lang::prelude::*;

// Program adresini belirtin
declare_id!("C93fyDjEmyAfr9nwDeWMVCeWVVx8fjySxnshSA9VY4KG");

// Program modülünde tanımlanan talimatlar
#[program]
pub mod counter {
    use super::*;

    // Yeni bir sayaç hesabı oluşturmak için talimat
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize yapısından sayaç hesabına referans
        let counter = &ctx.accounts.counter;
        msg!("Sayaç hesabı oluşturuldu! Mevcut sayaç: {}", counter.count);
        Ok(())
    }

    // Bir sayaç hesabını artırmak için talimat
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        // Increment yapısından sayaç hesabına değiştirilmiş referans
        let counter = &mut ctx.accounts.counter;
        msg!("Önceki sayaç: {}", counter.count);

        // Sayaç hesabında depolanan değerini 1 artır
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Sayaç artırıldı! Mevcut sayaç: {}", counter.count);
        Ok(())
    }
}

// Initialize talimatı için gereken hesaplar
#[derive(Accounts)]
pub struct Initialize<'info> {
    // Sayaç hesabını oluşturmak için ödeyen hesap
    #[account(mut)]
    pub user: Signer<'info>, // işlemin imzacısı olmalıdır

    // Talimat içinde oluşturulan ve başlatılan sayaç hesabı
    #[account(
        init,         // bu hesabı oluşturduğumuzu belirtir
        payer = user, // hesabın oluşturulmasında ödeyen hesap
        space = 8 + 8 // yeni hesap için ayrılan alan (8 byte ayırtıcı + 8 byte u64)
    )]
    pub counter: Account<'info, Counter>, // hesabın 'Counter' türünde olduğunu belirtir
    pub system_program: Program<'info, System>, // hesabın Sistem Programı olması gerekir
}

// Artırma talimatı için gereken hesap
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)] // verileri güncellediğimiz için hesap değiştirilmesi gerekmektedir
    pub counter: Account<'info, Counter>, // hesabın 'Counter' türünde olduğunu belirtir
}

// `Counter` hesabının yapısını tanımla
#[account]
pub struct Counter {
    pub count: u64, // sayaç değerinin türünü u64 olarak tanımla
}
```

Bu projenin yapısı:

- Gerekli Rust kütüphanelerini içe aktarma
- Program adresini beyan etme
- Program talimat işleyicilerini tanımlama (işlevsel mantık)
- Talimat işleyicileri için yapıları tanımlama (aktarılacak veri formatı)
- Bu programın ihtiyaç duyduğu hesaplara dair yapıları tanımlama (blok zincirinde depolanan verilerin formatı)

Buradaki kod, göründüğünden daha basittir. Yeni kavramlara blok blok bakalım.

```rust filename="lib.rs"
// Program modülünde tanımlanan talimatlar
#[program]
pub mod counter {
    use super::*;

    // Yeni bir sayaç hesabı oluşturmak için talimat
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize yapısından sayaç hesabına referans
        let counter = &ctx.accounts.counter;
        msg!("Sayaç hesabı oluşturuldu! Mevcut sayaç: {}", counter.count);
        Ok(())
    }

    // Bir sayaç hesabını artırmak için talimat
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        // Increment yapısından sayaç hesabına değiştirilmiş referans
        let counter = &mut ctx.accounts.counter;
        msg!("Önceki sayaç: {}", counter.count);

        // Sayaç hesabında depolanan değerini 1 artır
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Sayaç artırıldı! Mevcut sayaç: {}", counter.count);
        Ok(())
    }
}
```

Program modülünde, iki talimat işleyicimiz var - bunlar bir API'nin uç noktaları gibidir. Her seferinde RPC'ye gönderilen bir işlem aracılığıyla çağırdığımızda, bazı bağlam (`ctx`) aktarırız - blockchain'in durumu, hangi hesapların onunla etkileşime girdiği, aktarılan veriler vb. Bunu bir POST isteğinin gövdesine benzetebilirsiniz.

Bu talimat işleyicilerin her biri, daha sonra tanımladığımız özel formatlara sahip argümanlar alır ve bir `Result` türü döndürür, bu da Rust'ta yanıtlar/hataları yönetmenin bir yoludur (HTTP yanıt kodu gibi).

`let counter = &ctx.accounts.counter;` bağlamdan geçen `counter` değerini kullanarak bir değiştirilemez referans oluşturur. Bu programda bir anahtar çift oluşturacak ve adresini `counter` parametresi olarak geçeceğiz. Bu, testi incelediğimizde daha anlamlı hale gelecektir.

`msg!`, blok zincirindeki günlüklerde görebileceğimiz bir yazdırma ifadesidir.

`increment` talimat işleyici, geçen bağlamdan sayaç hesabına bir değiştirilebilir referans alır. Mevcut değeri bir `msg!` ifadesi ile yazdıktan sonra, değeri `checked_add` yöntemi ile 1 artırır. `unwrap`, işlemin sonucunu verir (bu işlem, toplamın u64 türünü aşması durumunda işleme hatası verir). Son olarak, başka bir `msg!` ifadesi ile sonuç olarak `Ok(())` döndürüyoruz.

Son olarak, yapı tanımlarına bakalım:

```rust filename="lib.rs"
// Initialize talimatı için gereken hesaplar
#[derive(Accounts)]
pub struct Initialize<'info> {
    // Sayaç hesabını oluşturmak için ödeyen hesap
    #[account(mut)]
    pub user: Signer<'info>, // işlemin imzacısı olmalıdır

    // Talimat içinde oluşturulan ve başlatılan sayaç hesabı
    #[account(
        init,         // bu hesabı oluşturduğumuzu belirtir
        payer = user, // hesabın oluşturulmasında ödeyen hesap
        space = 8 + 8 // yeni hesap için ayrılan alan (8 byte ayırtıcı + 8 byte u64)
    )]
    pub counter: Account<'info, Counter>, // hesabın 'Counter' türünde olduğunu belirtir
    pub system_program: Program<'info, System>, // hesabın Sistem Programı olması gerekir
}

// Artırma talimatı için gereken hesap
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)] // verileri güncellediğimiz için hesap değiştirilmesi gerekmektedir
    pub counter: Account<'info, Counter>, // hesabın 'Counter' türünde olduğunu belirtir
}

// `Counter` hesabının yapısını tanımla
#[account]
pub struct Counter {
    pub count: u64, // sayaç değerinin türünü u64 olarak tanımla
}
```

Yorumlara göz atmayı unutmayın!

:::danger
**Bu kodun alışılmadık hissettirmesi doğaldır**. Anchor, hesap oluşturma ve hesap türü tanımlarını ayırmaya benzer şeyler yapmaktadır. Daha fazla program yazdıkça, buna alışacaksınız.
:::

`initialize` talimatı yalnızca bir şeyi gerçekleştirir: yeni bir `Counter` türünde hesap oluşturur. Bunu yapmak için, kimin ödeyeceğine, oluşturduğumuz hesabın detaylarına ve kullanılacak programa ihtiyacımız var.

Şimdi satır satır geçelim:

- `#[derive(Accounts)]`, Anchor'a hesaplar için gerekli serileştirme ve serileştirmeyi oluşturması talimatını verir.
- `#[account(mut)]`, Anchor'a hesabın değiştirilebilir olduğunu söyler.
- `pub user: Signer,` kullanıcı, işlemi imzalayan ve ödeyen `Signer<>` türündedir. `'info` Rust ömrüdür.
- `#[account(init, payer = user, space = 8 + 8)]`
  - `#[account(init)]`, Anchor'a bu hesabın oluşturulacağını söyler.
  - `payer = user` Anchor'a, hesabın kullanıcının sahip olduğunu belirtir.
  - `space = 8 + 8`, Anchor'a hesabın ne kadar alanı olacağını gösterir.
- `pub counter: Account,` oluşturulan hesap `Counter` türünde olmalıdır.
- `pub system_program: Program,` sistem programının, işlemin hesapları arasında yer alması gerektiğine dair bir kısıtlama ekler.

Bir dahaki sefere şablonu inşa etmeyi ve test etmeyi atlayabilirsiniz.

### Programımız için bir test yazma

Sıra geldi, şimdi yazdığımız bu programı test edelim. `tests/counter.ts` dosyasını açın ve bunu ile değiştirin:

```ts filename="tests/counter.ts"
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { Keypair } from "@solana/web3.js";

describe("counter", () => {
  // Müşteriyi yerel küme ile kullanacak şekilde yapılandırın.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  // Sayaç hesabı için bir anahtar çifti oluşturun.
  const counterAccount = new Keypair();

  it("Başlatıldı!", async () => {
    // Başlatma talimatını çağırın.
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
      })
      .signers([counterAccount]) // sayaç anahtar çiftini ek olarak imzalayıcı olarak dahil edin.
      .rpc({ skipPreflight: true });

    // Sayaç hesabı verilerini alın.
    const accountData = await program.account.counter.fetch(
      counterAccount.publicKey,
    );

    console.log(`İşlem İmzası: ${transactionSignature}`);
    console.log(`Sayı: ${accountData.count}`);
  });

  it("Arttır", async () => {
    // Arttırma talimatını çağırın.
    const transactionSignature = await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
      })
      .rpc();

    // Sayaç hesabı verilerini alın.
    const accountData = await program.account.counter.fetch(
      counterAccount.publicKey,
    );

    console.log(`İşlem İmzası: ${transactionSignature}`);
    console.log(`Sayı: ${accountData.count}`);
  });
});
```

Başlatma test durumunu yeni mantığımızla eşleştirmek için güncelledik ve arttırma için bir durum ekledik. Bunu satır satır nasıl yaptığımıza bakalım.

```ts
const counterAccount = new Keypair();
```

Öncelikle, sayaç hesabının adresi olarak kullanılacak yeni bir anahtar çifti oluşturuyoruz. Bu, sayacın verilerinin depolanacağı yerdir.

:::note
**Önemli Not:** Yeni bir `Keypair` oluşturmak, güvenlik açısından dikkat edilmesi gereken bir durumdur. Bu anahtar çifti korunmalıdır.
:::

```ts
const transactionSignature = await program.methods
  .initialize()
  .accounts({
    counter: counterAccount.publicKey,
  })
  .signers([counterAccount]) // sayaç anahtar çiftini ek olarak imzalayıcı olarak dahil edin.
  .rpc({ skipPreflight: true });
```

Sonra, bu adresi başlatma talimatı bağlamında `counter` olarak geçiriyoruz. Bu hesabın değiştirileceği için ayrıca bir imzalayıcı olarak dahil edilmesi gerekmektedir. Test durumunu kapatmak için hesap verilerini alır ve sayacın değerini yazdırırız.

> **Önemli:** `increment` test durumu arttırma talimatını çağırır ve hesap verilerini alır, ancak zaten başlatıldığı için yalnızca global durumdan sayaç hesabının adresini geçiririz.

Artık loglarımızda mesajlar yazdırdığımız için bir log görüntüleyici kuracağız. Başka bir terminal açın ve `solana logs` komutunu çalıştırın. Bu, Solana işlem loglarını akıtarak gösterir. Yerel kümeyi kullanmak için de 
[Solana explorer](https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899) üzerinden işlemlerinizi görüntüleyebilirsiniz.

---

Haydi bunu çalıştıralım! `anchor test --skip-local-validator` komutunun çıkışı size şöyle olmalıdır:

```shell
Sayı: 1
    ✔ Arttırma (3973ms)

  2 başarılı (8s)

Tamamlandı: 26.34s.
```

### Anchor programınızı bir PDA ile nihai hale getirin

Elimizdeki program oldukça iyi ve istediğimiz işlevi gerçekleştiriyor, ancak verileri saklama yöntemi verimsiz ve tamamen güvenli değil.

Şu anda, sayaç verilerini saklamak için bir hesap oluşturuyoruz. Bu, hesabı takip etmemizi gerektiriyor ve anahtar çifti sızdırılırsa herkes değerini değiştirebilir. Ayrıca hesabın boyutunu statik olarak tahsis ediyoruz, bu da ideal değil.

Verileri saklamanın doğru yolu Program Türetilmiş Adresi (PDA) kullanmaktır. PDA, bilinen öğelerin bir kombinasyonu (seçim olarak belirttiğimiz bir dizi) ve program kimliği kullanılarak "türetilen" bir program tarafından kontrol edilen bir hesaptır. PDA’da saklanan veriler yalnızca program tarafından değiştirilebileceği için daha güvenlidir.

:::tip
**İpucu:** Artık verileri saklayan bir anahtar çiftini takip etme ve yönetme zorunluluğu yerine, bizim için bir PDA türeten bir işlev kullanabiliriz.
:::

```ts
// yeni metod
const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")], // Bu seçenektir - yalnızca "counter" dizesi.
  program.programId, // Program ile etkileşimde bulunuyorsak, kimliğini biliyoruz.
);
```

:::info
**Dikkat:** `counterAccount` anahtar çifti ile veri tutmamak, gizliliği artıran önemli bir adımdır.
:::

```ts
// eski yöntem ile karşılaştır
const counterAccount = new Keypair(); // Bu değeri takip etmelisiniz
// başkalarıyla kolayca paylaşılamaz
// güvenlik endişesi - eğer anahtar çifti sızdırılırsa herkes değeri değiştirebilir.
```

Bir PDA’nın son parçası bir `bump` numarasıdır. Bu, türetilen adresin özel anahtar içermediğinden emin olmak için kullanılan ek bir öğedir. PDA bulmak için:

- program kimliği
- seed (diziniz)
- bump (hesapta depolanan bir sayı)

:::details
**Ayrıntılar:** `lib.rs` dosyanızdaki güncellenmiş kodun bu kısmı:
```rust filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("C87Mkt2suddDsb6Y15hJyGQzu9itMhU7RGxTQw17mTm");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.bump = ctx.bumps.counter; // `Counter` hesabında bump seed'ini saklayın.
        msg!("Sayaç hesabı oluşturuldu! Mevcut sayı: {}", counter.count);
        msg!("Sayaç bump'ı: {}", counter.bump);
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        msg!("Önceki sayaç: {}", counter.count);
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Sayaç arttırıldı! Mevcut sayı: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    // PDA olarak bir adres kullanarak `Counter` hesabını oluşturun ve başlatın.
    #[account(
        init,
        seeds = [b"counter"], // pda için isteğe bağlı tohumlar
        bump,                 // pda için bump tohum
        payer = user,
        space = 8 + Counter::INIT_SPACE
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    // `Counter` hesabının adresi belirtilen `seeds` ile türetilen bir PDA olmalıdır.
    #[account(
        mut,
        seeds = [b"counter"], // pda için isteğe bağlı tohumlar
        bump = counter.bump,  // `Counter` hesabında depolanan pda için bump tohum
    )]
    pub counter: Account<'info, Counter>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64, // 8 bayt
    pub bump: u8,   // 1 bayt
}
```
:::

Her şeyi kopyalayıp-yapıştırdıysanız `anchor keys sync` komutunu çalıştırdığınızdan emin olun. Ayrıca `seeds` öğesinin Anchor özelliği olarak etkin olduğundan emin olmalısınız. `Anchor.toml` dosyanızı açın ve `[features]` bölümünde `seeds = true` olarak ayarlayın:

```toml
[toolchain]

[features]
seeds = true
skip-lint = false
```

Bu kodların çoğunu biliyorsunuz. Şimdi bir PDA kullanmak için yaptığımız değişikliklere dalalım:

`initialize` fonksiyonunda, `counter.bump = ctx.bumps.counter;` ile `Counter` hesabında `bump` tohumunu saklıyoruz. Bu, PDA’yı yeniden türetmemiz gerektiğinde bump tohumunu tekrar alabilmemizi sağlıyor. Ayrıca `Counter` yapısının boyutuna dayanarak alan tahsis ediyoruz.

:::warning
**Uyarı:** `Initialize` yapısında, `counter` alanı için `#[account()]` özniteliğini güncelledik.
:::

- `seeds = [b"counter"]` PDA'yı türetmek için kullanılan tohumları belirtir. Bu durumda, yalnızca "counter" dizesini byte dilimine dönüştürür.
- `bump`, Anchor'a PDA için standart bump numarasını kullanmasını söyler.

`Increment` yapısında da aynı PDA tohumu ve bump ile güncellendi. Son olarak, `Counter` yapısı artık bump tohumunu saklamak için bir `bump` alanı içeriyor.

Bu yaklaşım, daha iyi güvenlik sağlar ve sayaç hesabı için ayrı bir anahtar çifti yönetme gereğini ortadan kaldırır. Bump tohumunu almak gerektiğinde kolayca elde edebilmek için `Counter` hesabında saklanır.

Bunu test edelim! `tests/counter.ts` dosyanızdaki yeni test şöyle görünecektir:

```ts filename="tests/counter.ts"
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { PublicKey } from "@solana/web3.js";

describe("counter", () => {
  // Müşteriyi yerel küme ile kullanacak şekilde yapılandırın.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  const [counterPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    program.programId,
  );

  it("Başlatıldı!", async () => {
    try {
      const txSig = await program.methods
        .initialize()
        .accounts({
          counter: counterPDA,
        })
        .rpc();

      const accountData = await program.account.counter.fetch(counterPDA);
      console.log(`İşlem İmzası: ${txSig}`);
      console.log(`Sayı: ${accountData.count}`);
    } catch (error) {
      // Eğer PDA Hesabı zaten oluşturulmuşsa, bir hata bekliyoruz.
      console.log(error);
    }
  });

  it("Arttır", async () => {
    const transactionSignature = await program.methods
      .increment()
      .accounts({
        counter: counterPDA,
      })
      .rpc();

    const accountData = await program.account.counter.fetch(counterPDA);

    console.log(`İşlem İmzası: ${transactionSignature}`);
    console.log(`Sayı: ${accountData.count}`);
  });
});
```

Gördüğünüz gibi, burada bir anahtar çifti oluşturmuyoruz. Bu programı başlatmak ve onunla etkileşimde bulunmak için gereken her şey kolayca tanımlanabilir ve paylaşılabilir.

Artık bunu dağıtmaya hazırız. Solana programları durumu depolamaz; her şey hesaplarda depolanır. Bu, veri kaybetmeden programları yükseltmeyi kolaylaştırır. Bir program dağıttığınızda, yalnızca ilk dağıttığınız programın boyutunun iki katı kadar alan ayrılır. Yani, orijinal programınız 100 byte ise, yeni program en fazla 200 byte olabilir. Programınız daha büyükse, onu uzatmanız gerekecektir.

:::danger
**Kritik Uyarı:** Yeni programımız, orijinalin boyutunun 2 katından fazla olduğu için eğer `anchor test --skip-local-validator` komutunu çalıştırırsak bu hatayı alacağız:
```shell
Error: Deploying program failed: RPC response error -32002: Transaction simulation failed: Error processing Instruction 0: account data too small for instruction [3 log messages]
```
:::

Burada üç seçeneğimiz var:

- Eski program hesabının boyutunu uzatın.
- Yeni bir program dağıtın.
- Yerel doğrulayıcıyı sıfırlayın.

İlk seçeneği seçelim çünkü SOL'de milyonlarımız var. Öncelikle eski program hesabının boyutunu alalım:

```shell
solana program show C87Mkt2suddDsb6Y15hJyGQzu9itMhU7RGxTQw17mTm
```

Çıktının şöyle bir şey görünmesini bekliyorsunuz:

```shell
Program Id: C87Mkt2suddDsb6Y15hJyGQzu9itMhU7RGxTQw17mTm
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: 22D5oHo5q8LtdvYePrSBwy6D58z2K9KKwdn6W1UiEQEz
Authority: FmpP9UGJUBoYUDFpBYALDGudAZtTTmK46tBpC6TkcXry
Last Deployed In Slot: 283249128
Data Length: 204080 (0x31d30) bytes
Balance: 1.42160088 SOL
```

Yeni programın boyutunu bulmak için şu komutu çalıştırın:

```shell
du -h target/deploy/counter.so
```

Bu, derlenmiş programın disk alanını yazdıracaktır. Bunun ne kadar SOL'e mal olacağını bulmak için:

```shell
solana rent 200000
```

Şimdi uzatalım, program kimliğine ve uzatma boyutuna byte olarak ihtiyacınız var:

```shell
solana program extend C87Mkt2suddDsb6Y15hJyGQzu9itMhU7RGxTQw17mTm 200000
```

Artık yeni programı dağıtıp test edebiliriz:

```shell
anchor test --skip-local-validator
```

İlk komut, program adresinizi `lib.rs` dosyanızda güncelleyecek. İkinci komut, programınızı yerel test doğrulayıcınızda derleyip dağıtacak ve test edecektir.

### Devnet'e dağıtım

Buradan sonra, yerel geliştirme ile işimiz bitti. Kılavuzun geri kalanında Solana'nın devnet'ini kullanacağız. Solana'nın devnet'i, gerçek verilerin ve sahte jetonların bulunduğu kamu geliştirme blok zinciridir. Bunu, kodunuzu üretime dağıtmadan önceki "hazırlık ortamınız" olarak düşünün.

İşlemler için bazı Solana devnet jetonlarına ihtiyacımız olacak. CLI cüzdanınızı devnet olarak yapılandırmanız ve bu komutlarla bazı jetonlar almanız gerekecek:

```
solana config set --url devnet
solana airdrop 2
```

Bu işe yaramazsa, `solana address` komutuyla cüzdan adresinizi yazdırabilir ve [Solana faucet](https://faucet.solana.com/) ile bazı jetonlar alabilirsiniz.

Artık programımızı devnet'e dağıtmaya hazırız. İşte yaptıklarımızın özeti:

- `Anchor.toml` dosyamızı devnet'i kullanacak şekilde güncelleyin.
- Programımızı devnet'e dağıtın.
- Programımızı başlatmak ve sayaç değerini arttırmak için testi yeniden çalıştırın.

`Anchor.toml` dosyanızı devnet ağı kullanacak şekilde güncelleyin ve devnet programınızın adresini ekleyin:

```toml
[toolchain]

[features]
seeds = true
skip-lint = false

[programs.localnet]
counter = "Bims5KmWhFne1m1UT4bfSknBEoECeYfztoKrsR2jTnrA"

[programs.devnet]
counter = "Bims5KmWhFne1m1UT4bfSknBEoECeYfztoKrsR2jTnrA"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "/home/endgame/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

Neler değişti? Yeni bir `[programs.devnet]` bölümü ekledim ve `[provider]` bölümünde `cluster` değerini `devnet` olarak değiştirdim.

Dağıtım için hazırız! `anchor test` komutunu çalıştırdığınızda şunları görmelisiniz:

```shell
Dağıtım kümesi: https://api.devnet.solana.com
Yükseltme yetkisi: /home/endgame/.config/solana/id.json
"counter" programı dağıtılıyor...
Program yolu: /full-stack-solana-dev/counter/target/deploy/counter.so...
Program Id: F7nbbscQpQucypsjzJccBDLBSVAVKBHumNLpxqHXym4U

Dağıtım başarılı

Anchor.toml'da bir 'test' betiği bulundu. Bu, bir test paketi olarak çalıştırılıyor!

Test paketini çalıştırma: "/full-stack-solana-dev/counter/Anchor.toml"
```

Adresinizi kopyalayın ve kontrol edin [Solana explorer](https://explorer.solana.com/?cluster=devnet).

Artık localhost'tan çıkmış durumdayız! İnternetteki herkes artık programınızla etkileşimde bulunabilir. Onların bunu yapabilmesi için bir ön yüz oluşturalım.

#### Program dağıtımı başarısız mı oldu?

Program kodları, programlar dağıtılırken geçici olarak `buffer hesaplarında` saklanır. Bu hesapları görüntüleyebilir ve kapatabilirsiniz:

```shell
solana program show --buffers
solana program close --buffers
```

#### Gazdan mı bitiyorsunuz?

Eğer gazdan tamamen bitmişseniz, daha önce dağıttığınız programları kapatabilirsiniz. Bu **geri alınamaz**. Bu programlar silinecek ve yeniden dağıtılamayacak. Son çare olarak:

```shell
solana program close --programid <program id>
```

Ya da gerçekten cesur hissediyorsanız:

```shell
solana program close --all
```

## Uygulamanız için bir React istemcisi oluşturun

Artık Solana programınız kamu devnet blok zincirinde aktif olduğuna göre, onunla etkileşim kurmanın çeşitli yolları var. Düşünebileceğiniz herhangi bir istemci çalışır - Node.js betiği, React uygulaması, mobil uygulama, hatta bir sunucusuz işlev. Bu kılavuzda bir React uygulaması oluşturacağız.

### React projenizi kurun

Ön uçlar için gereken her şeyi veren birçok Solana şablonu mevcuttur. **Bir Solana şablonu kullanmayacağız**. Genellikle içine birçok şey eklenmiş olup, yeni başlayanlar için bunlar bunaltıcı olabilir.

Bunun yerine, kendiniz yapmanız için size yol göstereceğim. Bu, şablonların ne yaptığını anlamanıza yardımcı olacak ve Solana cüzdanlarını entegre etmenin ne kadar basit olabileceğini gösterecek.

[Dikkatli](https://vitejs.dev/) kullanacağız çünkü Next.js'den daha basit ve işleri hafif tutuyor. Burada öğrendikleriniz, Tüm React framework’lerine - Next, Remix vb. geçerlidir.

Yeni bir terminal penceresi açarak ve çalışma alanınızda yeni bir vite projesi oluşturmak için (counter klasörünün dışında olduğunuzdan emin olun):

```shell
yarn create vite
```

İstediğiniz herhangi bir isim verebilirsiniz (benimki `front-end`). Framework olarak React'ı ve varyant olarak TypeScript'i seçin. Endişelenmeyin, önemli bir TypeScript uygulamamız olmayacak!

Windows kullanıyorsanız ve WSL kullanıyorsanız, sıcak yeniden yüklemenin çalışması için `vite.config.ts` dosyanızı güncellemeniz gerekecek. Dosyayı açın ve bunu değiştirin:

```javascript
// WINDOWS'DA WSL KULLANANLAR İÇİN (LİNÜX/MACOS İÇİN GEREKSİZ)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
```

Daha sonra `front-end` klasörüne gidin ve tüm bağımlılıkları yüklemek için `yarn` komutunu çalıştırın:

```shell
cd front-end
yarn
```

Ön yüzünüz hazır! `yarn dev` komutunu çalıştırın ve React uygulamanızı `http://localhost:5173/` adresinde açın.

### Cüzdanı bağla butonu oluşturun

Sıfırdan bir "cüzdanı bağla butonu" oluşturmanıza gerek yok. Solana ekosisteminde cüzdanları eklemeyi plug-n-play hale getiren oldukça güzel cüzdan adaptör kütüphaneleri mevcut. Üstelik stilini de özelleştirebilirsiniz!

Bu komutu terminalinize yazın ve ihtiyacımız olan tüm `wallet-adapter` bileşenlerini yükleyin:

```shell
yarn add react @solana/web3.js@1 \
  @solana/wallet-adapter-base @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

Bazı sihirli şeyler görmek için hazır mısınız? `front-end/src/App.tsx` dosyanızı açın ve oradaki kodu bununla değiştirin:

```tsx filename="App.tsx"
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "./App.css";

// Uygulamanız tarafından geçersiz kılınabilen varsayılan stiller
import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  // Ağ 'devnet', 'testnet' veya 'mainnet-beta' olarak ayarlanabilir.
  const network = WalletAdapterNetwork.Devnet;
  // Ayrıca özel bir RPC noktası verebilirsiniz.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      // istenirse, burada belirli/özel cüzdanlar tanımlayabilirsiniz (normalde gerekli değil)
      // aksi takdirde, cüzdan adaptörü, kullanıcının tarayıcısında mevcut olan cüzdanları otomatik olarak algılar.
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <h1>Hello Solana</h1>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

Bu kod parçacığı ve yapılandırma, doğrudan [wallet-adapter belgelerinden](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md) alınmıştır. Burada yaptığımız şey, `wallet-adapter` ithalatlarını getirip, Solana ağı bağlantısını yapılandırmak ve uygulamamızı gerekli bağlam sağlayıcıları ile sarmaktır.

`http://localhost:5173/` adresine geri döndüğünüzde bunu göreceksiniz:

![localhost vite app with select wallet button](../../../images/solana/public/assets/guides/full-stack-solana-dev/fs-hello-solana.png)

Hazırız!

:::note
**Not:** Uygulama başlığını `index.html` dosyasında değiştirebilirsiniz.
:::

### Blockchain'den Okuma

Ön yüzünüzden doğrudan blockchain'den veri okumaya hazır mısınız? Bu düşündüğünüzden daha kolay!

İlk olarak, dağıtılan programımızı ön yüz React uygulamamızla bağlayan katmanı inşa etmemiz gerekiyor. Programımızın ne olduğunu ve en son `anchor build` komutunu çalıştırdığımızda Anchor'dan üretilen IDL'yi kullanarak bununla nasıl etkileşim kuracağımızı tanımlayacağız.

`front-end/src` içinde `anchor` adında yeni bir klasör oluşturun ve `target/types/counter.ts` (Anchor programından) yeni bir `idl.ts` adlı dosyaya kopyalayın. Bu IDL'yi, programımızla etkileşim kurmamıza olanak tanıyan Typescript nesneleri oluşturmak için kullanacağız.

Ön yüzümüzde program için arayüzler oluşturmak için Anchor SDK'sına ihtiyaç duyacağız. Bunu şu komutla yükleyin:

```shell
yarn add @coral-xyz/anchor@0.29
```

---

Şimdi "bağlantı katmanı" kodu için. `front-end/src/anchor` klasöründe bir `setup.ts` dosyası oluşturun ve şu kodu ekleyin:

```ts filename="setup.ts"
import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL, Counter } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const programId = new PublicKey("B2Sj5CsvGJvYEVUgF1ZBnWsBzWuHRQLrgMSJDjBU5hWA");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// IDL, program ID ve bağlantı ile program arayüzünü başlatın.
// Bu kurulum, tanımlanan arayüzü kullanarak on-chain programıyla etkileşim kurmamızı sağlar.
export const program = new Program<Counter>(IDL, programId, {
  connection,
});

export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  program.programId,
);

// Bu, IDL'ye dayalı Counter veri yapısı için sadece bir TypeScript türüdür.
// Bunu ihtiyacımız var, böylece TypeScript bize bağırmaz
export type CounterData = IdlAccounts<Counter>["counter"];
```

:::info
Burada, programımızla etkileşim kurmak için gerekli altyapıyı oluşturmak için arayüzü kullanıyoruz. Sayıcı hesabı için PDA'yı üretiyoruz - bunu, Solana işlemi gönderdiğimizde, o işlemi değiştirecek tüm hesapları belirtmemiz gerektiği için ihtiyaç duyuyoruz.
:::

Bir token oluşturuyorsak veya sayacın değerini değiştiriyorsak, o hesaplar değişecektir ve işlemde adreslerini dahil etmemiz gerekecektir. Bunlar, uygulamamızın her yerinde erişebileceğimiz `setup.ts` dosyasında yer alıyor.

`programId` değerini KENDİ programınızın adresiyle değiştirmeyi unutmayın. Artık her şeyi ayarladığımıza göre, blockchain'den veri okumaya hazırız!

`front-end/src` içinde `components` adında yeni bir dizin oluşturun ve içine şu kodla bir `counter-state.tsx` dosyası ekleyin:

```tsx filename="counter-state.tsx"
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { program, counterPDA, CounterData } from "../anchor/setup";

export default function CounterState() {
  const { connection } = useConnection();
  const [counterData, setCounterData] = useState<CounterData | null>(null);

  useEffect(() => {
    const fetchCounterData = async () => {
      try {
        // İlk hesap verilerini al
        const data = await program.account.counter.fetch(counterPDA);
        setCounterData(data);
      } catch (error) {
        console.error("Hesap verilerini alırken hata:", error);
      }
    };

    fetchCounterData();

    // Hesap değişikliğine abone ol
    const subscriptionId = connection.onAccountChange(
      // İzlemek istediğimiz hesabın adresi
      counterPDA,
      // Hesap değiştiğinde çağrılacak geri bildirim
      accountInfo => {
        try {
          const decodedData = program.coder.accounts.decode(
            "counter",
            accountInfo.data,
          );
          setCounterData(decodedData);
        } catch (error) {
          console.error("Hesap verilerini çözerken hata:", error);
        }
      },
    );

    return () => {
      // Hesap değişikliğinden aboneliği kaldır
      connection.removeAccountChangeListener(subscriptionId);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, counterPDA, connection]);

  // Sayıcının değerini render et
  return <p className="text-lg">Sayım: {counterData?.count?.toString()}</p>;
}
```

:::tip
Yukarıda, `program.account.counter.fetch(counterPDA)` kullanarak React uygulaması yüklendiğinde on-chain sayıcının değerini alıyoruz. Ayrıca, geri bildirim olarak bir çağrı alacak `connection.onAccountChange` ile o on-chain verilerinin herhangi bir değişikliğini izlemeye abone oluyoruz. Geri bildirim, elde ettiğimiz verileri çözüp ayarlar.
:::

Son adım, `CounterState` bileşenini `App.tsx` dosyamuza eklemektir. Dosyanın sonuna bunu ekleyin:

```tsx filename="App.tsx"
// ... önceki ithalatlar
// Yeni oluşturduğumuz bileşeni içe aktar
import CounterState from "./components/counter-state";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      // istenirse, burada özel/tanımlı cüzdanları manuel olarak tanımlayın (normalde gerekli değildir)
      // aksi takdirde, cüzdan-adaptor kullanıcının tarayıcısında mevcut cüzdanları otomatik olarak algılayacaktır
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <h1>Merhaba Solana</h1>
          <CounterState />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

Artık `http://localhost:5173/` adresini açtığınızda şu şekilde bir şey görmelisiniz:

```shell
Sayım: 2
```

---

VAY. BİZ BLOCKCHAIN'DEN VERİ OKUDUK. Şimdi momentumumuzu devam ettirelim ve blockchain'e veri yazalım!

### Blockchain'e Yazma

Şimdi artırma işlevselliğini ekleyeceğiz. Hepsini bir düğme bileşeninde bir araya getiriyoruz. `components/increment-button.tsx` adında yeni bir dosya oluşturun ve şu kodu ekleyin:

```tsx filename="increment-button.tsx"
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program } from "../anchor/setup";

export default function IncrementButton() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!publicKey) return;

    setIsLoading(true);

    try {
      // Arttırma işlevini çağırmak için bir işlem oluştur
      const transaction = await program.methods
        .increment() // Bu herhangi bir argüman almaz, bu yüzden hiçbir şey geçmemize gerek yok
        .transaction();

      const transactionSignature = await sendTransaction(
        transaction,
        connection,
      );

      console.log(
        `Keşfede görüntüle: https://solana.fm/tx/${transactionSignature}?cluster=devnet-alpha`,
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button className="w-24" onClick={onClick} disabled={!publicKey}>
      {isLoading ? "Yükleniyor" : "Arttır"}
    </button>
  );
}
```

:::note
Bu kodun çoğunu biliyorsunuz. Burada olan tek yeni şey, gönderdiğimiz işlemdir. Sayacı artıran ve token'imizi oluşturan bir işlem oluşturmak için `program.methods.increment()` yöntemini kullanıyoruz. İlgili hesaplar, kullanıcının cüzdanı ve kullanıcının cüzdanı için ilişkili token hesabıdır.
:::

Yeni `IncrementButton` bileşenimizi `App.tsx` dosyasına ekleyerek düğmeyi görebilirsiniz:

```tsx filename="App.tsx"
// ... önceki ithalatlar
// Yeni oluşturduğumuz bileşeni içe aktar
import IncrementButton from "./components/increment-button";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      // istenirse, burada özel/tanımlı cüzdanları manuel olarak tanımlayın (normalde gerekli değildir)
      // aksi takdirde, cüzdan-adaptor kullanıcının tarayıcısında mevcut cüzdanları otomatik olarak algılayacaktır
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <h1>Merhaba Solana</h1>
          <CounterState />
          <IncrementButton />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

`http://localhost:5173/` adresini açın ve şimdi bir düğme görmelisiniz. Tarayıcı cüzdanınızda `devnet` ile bağlantıda olduğunuzdan emin olun ve bu düğmeye tıklayın. İşlemi imzalamanızı isteyen bir pop-up veya bildirim görmelisiniz. O işlemi onayladıktan sonra, sayacın arttığını ve ilgili token hesabının oluşturulduğunu görmelisiniz.

Başardınız! Artık tam yığın bir Solana geliştiricisiniz.

## Şimdi ne olacak?

Dünya sizindir. Hayal edebileceğiniz her şeyi, Solana ile yaratabilirsiniz.

- Daha fazla on-chain program örneği için [Program örnekleri](https://github.com/solana-developers/program-examples) reposunu kontrol edin.
- Bir Hackathon'a katılın ve işin içine biraz girin - https://solana.com/hackathon
- Bir görev alın ve biraz para kazanın - https://earn.superteam.fun/
- Daha ileri düzey Solana uygulamaları geliştirin - https://www.soldev.app/course
- Bu şablonlara göz atın -
  - [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp)
  - [create-solana-game](https://github.com/solana-developers/create-solana-game)
  - [örnek mobil uygulamalar](https://docs.solanamobile.com/sample-apps/sample_app_overview)

Ne inşa ederseniz edin, bunu dünyayla paylaşın! Twitter'da beni etiketleyin [@almostefficient](https://twitter.com/almostefficient), sizin inşa ettiğinizi görmek beni mutlu ediyor :)

Bol şans!