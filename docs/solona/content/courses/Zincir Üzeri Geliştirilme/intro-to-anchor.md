---
title: Anchor Geliştirmeye Giriş
objectives:
  - Anchor çerçevesini kullanarak temel bir Solana programı geliştirin
  - Bir Anchor programının temel yapısını tanımlayın
  - Anchor ile temel hesap doğrulama ve güvenlik kontrollerinin nasıl gerçekleştirileceğini açıklayın
description: "Anchor'da ilk Solana on-chain programınızı oluşturun."
---

## Özet

- Solana üzerindeki **programlar**, gelen talimatlardan argümanları alan **talimat işleyicilerine** sahiptir. Bunlar, bir programdaki herhangi bir işlem için giriş noktasıdır.
- **Rust**, Solana programları oluşturmak için en yaygın dildir. **Anchor** çerçevesi, gelen talimatlardan veri okuma ve doğru hesapların sağlandığını kontrol etme gibi yaygın işleri otomatik olarak halleder; böylece Solana programınızı inşa etmeye odaklanabilirsiniz.

## Ders

Başlamadan önce, Anchor'ın kurulu olduğundan emin olun. Bu dersi `yerel kurulum` üzerinden takip edebilirsiniz.

Solana'nın keyfi kodu yürütme kapasitesi, gücünün temel bir parçasıdır. Solana programları (bazen "akıllı sözleşmeler" olarak adlandırılır), Solana ekosisteminin bel kemiği olan yapılardır. Geliştiricilerin ve yaratıcıların sürekli olarak yeni programlar tasarlayıp dağıttığı bir zamanda, Solana programları koleksiyonu her gün genişlemeye devam ediyor.

Her popüler Solana borsası, borç verme-kiralama uygulaması, dijital sanat müzayede evi, perps platformu ve tahmin pazarı bir programdır.

Bu ders, Rust programlama dili ve Anchor çerçevesini kullanarak bir Solana programı yazmaya ve dağıtmaya yönelik temel bir tanıtım sunacaktır.

> Bu ve bu kurstaki sonraki dersler, Anchor ile Solana programları yapılandırmaya başlamak için iyi bir temel sağlayacaktır; ancak Anchor hakkında daha detaylı bilgi almak isterseniz, [The Anchor Book](https://book.anchor-lang.com/) kaynaklarına göz atmanızı öneririz.

### Anchor Nedir?

Anchor, Solana programları yazmayı daha kolay, hızlı ve güvenli hale getirerek onu Solana geliştirme için "gidilecek" çerçeve yapıyor. Kodunuzu düzenlemek ve düşünmeyi kolaylaştırır, yaygın güvenlik kontrollerini otomatik olarak uygular ve Solana programı yazarken aksi takdirde ilişkili olan önemli miktarda boilerplate kodu ortadan kaldırır.

### Anchor program yapısı

Anchor, Rust kodunu sizin için basitleştirmek amacıyla makrolar ve traitler kullanır. Bu, programınıza net bir yapı sağlar, böylece işlevselliğine daha fazla odaklanabilirsiniz.

Anchor tarafından sağlanan bazı önemli makrolar şunlardır:

> Buradan itibaren çok sayıda Rust göreceksiniz. Rust ile tanış olduğunuzu varsayıyoruz; aksi halde [The Rust Book](https://doc.rust-lang.org/book/) kaynağını kontrol etmenizi öneririz.

- `declare_id!` - programın on-chain adresini tanımlayan bir makro
- `#[program]` - programın talimat işleyicilerini içeren modülü belirtmek için kullanılan bir özellik makrosu.
- `Accounts` - bir talimat için gerekli hesap listesini temsil eden yapılara uygulanan bir trait.
- `#[account]` - program için özel hesap türlerini tanımlamak için kullanılan bir özellik makrosu.

Tüm bu unsurları bir araya getirmeden önce, her birini konuşalım.

### Program ID'nizi Tanımlayın

`declare_id` makrosu, Anchor programının on-chain adresini belirler (yani `programId`). Yeni bir Anchor programı oluşturduğunuzda, çerçeve varsayılan bir anahtar çifti üretir. Bu anahtar çifti, aksi belirtilmedikçe programı dağıtmak için kullanılır. Bu anahtar çiftinin genel anahtarı, `declare_id!` makrosundaki `programId` olarak kullanılır.

```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

### Talimat mantığını tanımlayın

`#[program]` özellik makrosu, programınızdaki tüm talimat işleyicilerini içeren modülü tanımlar. Bu, programınızdaki her işlem için iş mantığını uyguladığınız yerdir.

`#[program]` etiketi ile işaretli modüldeki her kamu fonksiyonu ayrı bir talimat işleyici olarak kabul edilecektir.

Her bir talimat işleyicisi (fonksiyon) `Context` türünde bir parametre gerektirir ve gerektiğinde daha fazla parametre içerebilir. Anchor, talimat verilerini otomatik olarak çözdüğü için, talimat verileri ile Rust türleri olarak çalışabilirsiniz.

```rust
#[program]
mod program_module_name {
    use super::*;

    pub fn instruction_one(ctx: Context<InstructionAccounts>, instruction_data: u64) -> Result<()> {
        ctx.accounts.account_name.data = instruction_data;
        Ok(())
    }
}
```

- `#[program]` özellik makrosu, programın talimat mantığını içeren modülü belirtmek için kullanılır.
- `use super::*;` ifadesi, talimat mantığını tanımlamak için gereken ana modülden tüm öğeleri kapsama alanına getirir.
- Sonraki kısımda talimat işleyici fonksiyonu var. Bu fonksiyon, bir hesaba (`instruction_data` olan) bazı veriler yazar.

### Talimat `Context`

`Context` türü, talimat mantığınıza talimat meta verilerini ve hesapları açar.

```rust
pub struct Context<'a, 'b, 'c, 'info, T: Bumps> {
    /// Şu anda yürütülen program ID'si.
    pub program_id: &'a Pubkey,
    /// Çözülmüş hesaplar.
    pub accounts: &'b mut T,
    /// Verilmiş ancak çözülmemiş veya doğrulanmamış kalan hesaplar.
    /// Bunu doğrudan kullanırken çok dikkatli olun.
    pub remaining_accounts: &'c [UncheckedAccount<'info>],
    /// Kısıtlama doğrulaması sırasında bulunan bump tohumları. Bu, işleyicilerin bump tohumlarını tekrar hesaplayıp argüman olarak geçmesine gerek kalmaması için bir kolaylık sağlamak amacıyla verilmiştir.
    /// Tür, #[derive(Accounts)] ile üretilen bump struct'ıdır.
    pub bumps: T::Bumps,
}
```

`Context`, bir talimat işleyicisinin gerektirdiği hesap listesini tanımlayan genel bir türdür. `Context` kullandığınızda, `Accounts` trait'ini benimsemiş bir yapı olarak `T` türünü belirtirsiniz.

Her talimat işleyicisinin ilk argümanı `Context` olmalıdır. `Context`, `AddMovieReview` hesaplarını tutan yapıysa, `add_movie_review()` fonksiyonu için bağlam `Context` olur.


İsimlendirme kuralı
Evet, Accounts yapısı genellikle talimat işleyicisi ile aynı adı taşır, yalnızca BaşlıkBüyüklüğündedir. Örneğin, `add_movie_review()` için hesapları tutan yapı AddMovieReview olarak adlandırılır!


Bu bağlam argümanı aracılığıyla talimat şu hesaplara erişebilir:

- Talimata geçilen hesaplar (`ctx.accounts`)
- Yürütülen programın `ctx.program_id`'si
- Kalan hesaplar (`ctx.remaining_accounts`). `remaining_accounts`, talimat işleyicisine geçilen ancak `Accounts` yapısında beyan edilmeyen tüm hesapları içeren bir vektördür.
- `Accounts` yapısındaki herhangi bir PDA hesapları için bump'lar (`ctx.bumps`)
- `Accounts` yapısındaki herhangi bir PDA hesapları için tohumlar (`ctx.seeds`)

> Bağlamların tasarımı, amaçlarına hizmet etmek için farklı programlar arasında farklılık gösterebilir; ayrıca bağlamın adı, kullanımını daha iyi yansıtmak için herhangi bir şey olabilir (sadece Context ile sınırlı değildir). Bu örnek, Anchor'daki bağlamların nasıl çalıştığını anlamaya yardımcı olmak içindir.

### Talimat hesaplarını tanımlayın

`Accounts` trait'i:

- Bir talimat işleyicisi için doğrulanmış hesapların yapısını tanımlar
- Hesaplara bir talimat işleyicisinin `Context`'i üzerinden erişilebilirlik sağlar
- Genellikle `#[derive(Accounts)]` ile uygulanır
- Yapıda bir `Accounts` ayrıştırıcısı uygulaması yapar
- Güvenli program yürütümü için kısıtlama kontrolleri gerçekleştirir

Örnek:

- `instruction_one` bir `Context` gerektirir
- `InstructionAccounts` yapısı `#[derive(Accounts)]` ile uygulanmıştır
- `account_name`, `user` ve `system_program` gibi hesapları içerir
- Kısıtlamalar `#account(..)` attribute'u ile belirtilir

```rust
#[program]
mod program_module_name {
    use super::*;
    pub fn instruction_one(ctx: Context<InstructionAccounts>, instruction_data: u64) -> Result<()> {
        ...
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        init,
        payer = user,
        space = DISCRIMINATOR + AccountStruct::INIT_SPACE
    )]
    pub account_name: Account<'info, AccountStruct>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}
```

`instruction_one` çağrıldığında, program:

- Giriş işleyicisine geçilen hesapların `InstructionAccounts` yapısında belirtilen hesap türleriyle eşleşip eşleşmediğini kontrol eder
- Hesapları ek kısıtlama ile kontrol eder

> Eğer `instruction_one`'a geçilen hesaplardan herhangi biri `InstructionAccounts` yapısında belirtilen hesap doğrulama veya güvenlik kontrollerini geçemezse, talimat program mantığına ulaşmadan önce başarısız olur.

### Hesap doğrulama

Önceki örnekte, `InstructionAccounts`'ta bir hesap `Account`, bir diğeri `Signer` ve bir diğeri `Program` türündeydi.

Anchor, hesapları temsil etmek için kullanılabilecek bir dizi hesap türü sağlar. Her tür farklı hesap doğrulama uygulamaları yapar. Karşılaşabileceğiniz bazı yaygın türleri geçeceğiz, ancak [hesap türlerinin tam listesini](https://docs.rs/anchor-lang/latest/anchor_lang/accounts/index.html) incelemeyi unutmayın.

#### `Account`

`Account`, program sahipliğini doğrulayan ve iç veriyi bir Rust türüne ayrıştıran `UncheckedAccount` etrafında bir sargıdır.

```rust
// Bu bilgileri çözümler
pub struct UncheckedAccount<'a> {
    pub key: &'a Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
    pub lamports: Rc<RefCell<&'a mut u64>>,
    pub data: Rc<RefCell<&'a mut [u8]>>,    // <---- hesap verisini ayrıştırır
    pub owner: &'a Pubkey,    // <---- sahibi programı kontrol eder
    pub executable: bool,
    pub rent_epoch: u64,
}
```

Önceki örneği hatırlayın: `InstructionAccounts`'ta bir alan `account_name` vardı:

```rust
pub account_name: Account<'info, AccountStruct>
```

Buradaki `Account` sargısı şunları yapar:

- Hesap `data`'sını `AccountStruct` türünde bir formata çözümler
- Hesabın program sahibi ile `AccountStruct` türü için belirlenen program sahibiyle eşleşip eşleşmediğini kontrol eder.

`Account` sargısında belirtilen hesap türü aynı kutucukta `#[account]` özellik makrosu ile tanımlanan bir türse, program sahipliği kontrolleri `declare_id!` makrosunda tanımlanan `programId`'ye göre yapılır.

Aşağıdaki kontroller gerçekleştirilir:

```rust
// Kontroller
Account.info.owner == T::owner()
!(Account.info.owner == SystemProgram && Account.info.lamports() == 0)
```

#### `Signer`

`Signer` türü, verilen hesabın işlemi imzaladığını doğrular. Başka sahiplik veya tür kontrolleri yapılmaz. Kapsam içindeki hesap verisinin talimat içinde gereksiz olduğu durumlarda yalnızca `Signer` kullanılmalıdır.

Önceki örnekteki `user` hesabı için `Signer` türü, `user` hesabının talimatın imzalayıcısı olması gerektiğini belirtir.

Aşağıdaki kontrol sizin için yapılır:

```rust
// Kontroller
Signer.info.is_signer == true
```

#### `Program`

`Program` türü, hesabın belirli bir program olduğunu doğrular.

Önceki örnekteki `system_program` hesabı için `Program` türü, programın sistem programı olması gerektiğini belirtmek için kullanılır. Anchor, kontrol için program ID'sini içeren bir `System` türü sağlar.

Aşağıdaki kontroller sizin için yapılır:

```rust
// Kontroller
account_info.key == expected_program
account_info.executable == true
```

### Hesap ile kısıtlamalar ekleyin

`#[account(..)]` özellik makrosu, hesaplara kısıtlamalar uygulamak için kullanılır. Bu ve gelecekteki derslerde bazı kısıtlama örneklerini geçeceğiz; ancak bir noktada, tam [mümkün olan kısıtlamalar listesini](https://docs.rs/anchor-lang/latest/anchor_lang/derive.Accounts.html) incelemeyi unutmayın.

Yine `InstructionAccounts` örneğindeki `account_name` alanını hatırlayın.

```rust
#[account(
    init,
    payer = user,
    space = DISCRIMINATOR + AccountStruct::INIT_SPACE
)]
pub account_name: Account<'info, AccountStruct>,
#[account(mut)]
pub user: Signer<'info>,
```

`#[account(..)]` etiketinin üç virgülle ayrılmış ifadeyi içerdiğini unutmayın:

- `init` - hesabı sistem programına bir CPI aracılığıyla oluşturur ve başlatır (hesap ayırtıcıyı ayarlar)
- `payer` - hesabın başlatılması için ödeyenin tanımlanmasına `user` hesabını atar
- `space` - hesabı depolamak için blok zincirinde tahsis edilen alan.
  - `DISCRIMINATOR`, bir hesabın ilk 8 baytıdır; Anchor bu alanı hesabın türünü kaydetmek için kullanır.
  - `AccountStruct::INIT_SPACE`, `AccountStruct` içindeki tüm öğeler için gereken toplam alan boyutudur.
  - Bu `space` kısıtlamasının kullanılma gerekliliği, `#[derive(InitSpace)]` makrosunu kullanarak ortadan kaldırılabilir. Bunu, bu derste nasıl kullanacağımızı daha sonra göreceğiz.

`user` için, verilen hesabın değiştirilebilir olduğunu belirtmek için `#[account(..)]` etiketini kullanıyoruz. `user` hesabı, `account_name`'in başlatılmasını ödemek için lamportların düşürülmesi nedeniyle değiştirilebilir olarak işaretlenmelidir.

```rust
#[account(mut)]
pub user: Signer<'info>,
```

`account_name`'e konulan `init` kısıtlamasının otomatik olarak `mut` kısıtlamasını içerdiğini unutmayın, böylece hem `account_name` hem de `user` değiştirilebilir hesaplardır.

### Hesap

`#[account]` etiketi, bir Solana hesabının veri yapısını temsil eden yapılara uygulanır. Aşağıdaki özelliklerin uygulanmasını sağlar:

- `AccountSerialize`
- `AccountDeserialize`
- `AnchorSerialize`
- `AnchorDeserialize`
- `Clone`
- `Discriminator`
- `Owner`

Her bir özelliğin [ayrıntılarını](https://docs.rs/anchor-lang/latest/anchor_lang/attr.account.html) daha fazla okuyabilirsiniz. Ancak, bilmeniz gereken en önemli şey, `#[account]` etiketinin serileştirme ve ayrıştırma yetenekleri sağlaması ve bir hesabın ayırtıcısı ve sahiplik özelliklerini uygulamasıdır.

Ayırtıcı, bir hesap türünün adının SHA256 hash'inin ilk 8 baytından türetilen 8 baytlık benzersiz bir tanımlayıcıdır. Hesap serileştirme özelliklerini uygularken (bu neredeyse her zaman Anchor programında kullanılır) ilk 8 bayt hesap ayırtıcısı için ayrılmıştır.

Sonuç olarak, `AccountDeserialize`'ın `try_deserialize` çağrıları bu ayırtıcıyı kontrol edecektir. Eşleşmezse, geçersiz bir hesap verilmiş demektir ve hesap ayrıştırması bir hata ile çıkacaktır.

`#[account]` etiketi, `declareId` ile belirtilen `programId` doğrultusunda tanımlanan bir struct için `Owner` özelliğini de uygular. Diğer bir deyişle, `#[account]` etiketi ile tanımlanan bir hesap türü kullanılarak başlatılan tüm hesaplar da program tarafından sahiplenilecektir.

Örnek olarak, `InstructionAccounts`'taki `account_name` için kullanılan `AccountStruct` yapısına bakalım:

```rust
#[derive(Accounts)]
pub struct InstructionAccounts {
    #[account(init,
        payer = user,
        space = DISCRIMINATOR + AnchorStruct::INIT_SPACE
    )]
    pub account_name: Account<'info, AccountStruct>,
    ...
}

#[account]
#[derive(InitSpace)]
pub struct AccountStruct {
    data: u64
}

const DISCRIMINATOR: usize = 8;
```

`#[account]` etiketi, `InstructionAccounts` içinde bir hesap olarak kullanılabilir olmasını garanti eder.

`account_name` hesabı başlatıldığında:

- İlk 8 bayt, `AccountStruct` ayırtıcısı olarak `DISCRIMINATOR` sabiti kullanılarak ayarlanır.
- Hesabın veri alanı, `AccountStruct` ile eşleşir.
- Hesap sahibi, `declare_id` ile alınan `programId` olarak ayarlanır.

> `#[derive(InitSpace)]` makrosunu kullanarak kodun daha okunabilir ve sürdürülebilir olması iyi bir pratik olarak kabul edilir.

### Tüm unsurları bir araya getirin

Tüm bu Anchor türlerini birleştirdiğinizde, eksiksiz bir program elde edersiniz. Aşağıda, tek bir talimat ile temel bir Anchor programının örneği verilmiştir:

- Yeni bir hesabı başlatır
- Hesabın veri alanını talimat verileriyle günceller

```rust
// Ortak anchor özelliklerine erişim sağlamak için bu içe aktarmayı kullanın
use anchor_lang::prelude::*;

// Programın on-chain adresi
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// Talimat mantığı
#[program]
mod program_module_name {
    use super::*;
    pub fn instruction_one(ctx: Context<InstructionAccounts>, instruction_data: u64) -> Result<()> {
        ctx.accounts.account_name.data = instruction_data;
        Ok(())
    }
}

// Talimatlar için gelen hesapları doğrulama
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(init,
        payer = user,
        space = DISCRIMINATOR + AccountStruct::INIT_SPACE
    )]
    pub account_name: Account<'info, AccountStruct>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Özel bir program hesap türünü tanımlama
#[account]
#[derive(InitSpace)]
pub struct AccountStruct {
    data: u64
}

const DISCRIMINATOR: usize = 8;
```

#### Önemli noktalar:

- Tüm program yapısı genel olarak üç ana parçaya ayrılabilir:
  1. Hesap kısıtlamaları: talimatlar için gerekli hesapları tanımlar, ayrıca bunlara uygulanacak kuralları belirler - örneğin, işlemi imzalayıp imzalamamaları, talep üzerine oluşturulup oluşturulmaması, PDA'lar için adreslerin nasıl olacağı vb.
  2. Talimat işleyicileri: `#[program]` modulü içindeki fonksiyonlar olarak program mantığını uygular.
  3. Hesaplar: veri hesapları için kullanılan formatı tanımlar.

Artık Anchor çerçevesini kullanarak kendi Solana programınızı inşa etmeye hazırsınız!

## Laboratuvar

Başlamadan önce, Anchor'ı [Anchor belgelerinden adımları takip ederek](https://www.anchor-lang.com/docs/installation) kurun.

Bu laboratuvar için iki talimatlı basit bir sayaç programı oluşturacağız:

- İlk talimat, sayacımızı depolamak için bir hesap başlatır
- İkinci talimat, sayacın depolanan sayısını artırır

#### 1. Kurulum

`anchor init` komutunu çalıştırarak `anchor-counter` adında yeni bir proje oluşturun:

```shell
anchor init anchor-counter
```

Yeni dizine geçin, ardından `anchor build` komutunu çalıştırın:

```shell
cd anchor-counter
anchor build
```

Anchor build, yeni programınız için bir anahtar çifti de oluşturacaktır; anahtarlar `target/deploy` dizininde kaydedilir.

`lib.rs` dosyasını açın ve `declare_id!`'yi kontrol edin:

```rust
declare_id!("BouTUP7a3MZLtXqMAm1NrkJSKwAjmid8abqiNjUyBJSr");
```

ve sonra çalıştırın...

```shell
anchor keys sync
```

Anchor her iki değeri güncelleyecek:

- `lib.rs` içindeki `declare_id!()` içerisindeki anahtar
- `Anchor.toml` içindeki anahtar

`anchor build` sırasında oluşturulan anahtar ile eşleşecek şekilde güncelleyin:

```shell
"anchor-counter/programs/anchor-counter/src/lib.rs" dosyasında yanlış program id beyanı bulundu
BouTUP7a3MZLtXqMAm1NrkJSKwAjmid8abqiNjUyBJSr olarak güncellendi

`anchor_counter` programı için Anchor.toml'da yanlış program id beyanı bulundu
BouTUP7a3MZLtXqMAm1NrkJSKwAjmid8abqiNjUyBJSr olarak güncellendi

Tüm program id beyanları senkronize edildi.
```

Son olarak, `lib.rs` içindeki varsayılan kodu silin ve geriye sadece aşağıdaki kısım kalsın:

```rust
use anchor_lang::prelude::*;

declare_id!("onchain-program-address");

#[program]
pub mod anchor_counter {
    use super::*;
}
```

#### 2. `Counter`'ı Uygulayın

Öncelikle, yeni bir `Counter` hesap türü tanımlamak için `#[account]` etiketini kullanalım. `Counter` yapısı `u64` türünde bir `count` alanını tanımlar. Bu, `Counter` türünde başlatılan yeni hesapların eşleşen bir veri yapısına sahip olmasını bekleyebileceğimiz anlamına gelir. `#[account]` etiketi ayrıca yeni bir hesap için ayırtıcıyı otomatik olarak ayarlar ve hesabın sahibi olarak `declare_id!` makrosundan program ID'sini belirler. Ayrıca, uygun alan tahsisi için `#[derive(InitSpace)]` makrosunu kullanıyoruz.

```rust
#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64,
}

const DISCRIMINATOR: usize = 8;
```  

#### 3. `Context` türü `Initialize` uygulayın

Şimdi `#[derive(Accounts)]` makrosunu kullanarak `initialize` talimatında kullanılan hesapları listeleyen ve doğrulayan `Initialize` türünü uygulayalım. Aşağıdaki hesaplara ihtiyacımız olacak:

- `counter` - talimatla başlatılan sayaç hesabı 
- `user` - başlatma ücreti için ödeme yapan 
- `system_program` - yeni hesapların başlatılması için gerekli sistem programı 

```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,
        payer = user,
        space = DISCRIMINATOR + Counter::INIT_SPACE
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

---

#### 4. `initialize` talimatı işleyicisini ekleyin

Artık `Counter` hesabımız ve `Initialize` türümüz olduğuna göre, `#[program]` içinde `initialize` talimatı işleyicisinde bunu uygulayalım. Bu talimat işleyicisi, `Initialize` türünde bir `Context` gerektirir ve ek talimat verisi almaz. Talimat mantığında, `counter` hesabının `count` alanını `0` olarak ayarlıyoruz.

```rust
pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let counter = &mut ctx.accounts.counter;
    counter.count = 0;
    msg!("Sayaç Hesabı Oluşturuldu");
    msg!("Mevcut Sayı: {}", counter.count);
    Ok(())
}
```

> **Not:** `msg!` makrosu, işlem olarak belirli bir bilgiyi çıktılamak için kullanılır.

---

#### 5. `Context` türü `Update` uygulayın

Şimdi, `#[derive(Accounts)]` makrosunu tekrar kullanarak `increment` talimat işleyicisinin ihtiyaç duyduğu hesapları listeleyen `Update` türünü oluşturalım. Aşağıdaki hesaplara ihtiyacımız olacak:

- `counter` - artırılacak olan mevcut sayaç hesabı 
- `user` - işlem ücreti için ödeme yapan 

Yine, herhangi bir kısıtlamayı `#[account(..)]` niteliğini kullanarak belirtmemiz gerekecek:

```rust
#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}
```

---

#### 6. `increment` talimat işleyicisini ekleyin

Son olarak, `#[program]` içinde `counter` hesabı, ilk talimat işleyicisi tarafından başlatıldıktan sonra `count` değerini bir artıracak bir `increment` talimat işleyicisini uygulayalım. Bu talimat işleyicisi `Update` türünde bir `Context` gerektirir (bir sonraki adımda uygulanacak) ve ek talimat verisi almaz. Talimat mantığında, mevcut bir `counter` hesabının `count` alanını `1` artırıyoruz.

```rust
pub fn increment(ctx: Context<Update>) -> Result<()> {
    let counter = &mut ctx.accounts.counter;
    msg!("Önceki sayaç: {}", counter.count);
    counter.count = counter.count.checked_add(1).unwrap();
    msg!("Sayaç artırıldı. Mevcut sayı: {}", counter.count);
    Ok(())
}
```

---

#### 7. Derleme

Hepsi bir arada, tam program şöyle görünecek:

```rust
use anchor_lang::prelude::*;

declare_id!("BouTUP7a3MZLtXqMAm1NrkJSKwAjmid8abqiNjUyBJSr");

#[program]
pub mod anchor_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Sayaç hesabı oluşturuldu. Mevcut sayı: {}", counter.count);
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        msg!("Önceki sayaç: {}", counter.count);
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Sayaç artırıldı. Mevcut sayı: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,
        payer = user,
        space = DISCRIMINATOR + Counter::INIT_SPACE
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64,
}

const DISCRIMINATOR: usize = 8;
```

> **Uyarı:** Programı derlemek için `anchor build` komutunu çalıştırın.

---

#### 8. Test

Anchor testleri tipik olarak mocha test çerçevesini kullanan Typescript entegrasyon testleridir. Test hakkında daha fazla şey öğreneceğiz, ancak şimdilik `anchor-counter.ts`'ye gidin ve varsayılan test kodunu aşağıdaki ile değiştirin:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { AnchorCounter } from "../target/types/anchor_counter";

describe("anchor-counter", () => {
  // Yerel kümeyi kullanacak şekilde istemciyi yapılandırın.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorCounter as Program<AnchorCounter>;

  const counter = anchor.web3.Keypair.generate();

  it("Başlatıldı!", async () => {});

  it("Sayı artırıldı", async () => {});
});
```

Yukarıdaki kod, başlatılacak `counter` hesabı için yeni bir anahtar çifti oluşturur ve her talimat için bir test yeri oluşturur.

---

**Test Aşaması: `initialize` Talimatı**

Şimdi, `initialize` talimatı için ilk testi oluşturun:

```typescript
it("Başlatıldı!", async () => {
  // Testinizi buraya ekleyin.
  const tx = await program.methods
    .initialize()
    .accounts({ counter: counter.publicKey })
    .signers([counter])
    .rpc();

  const account = await program.account.counter.fetch(counter.publicKey);
  expect(account.count.toNumber()).to.equal(0);
});
```

---

**Test Aşaması: `increment` Talimatı**

Sonra, `increment` talimatı için ikinci testi oluşturun:

```typescript
it("Sayı artırıldı", async () => {
  const tx = await program.methods
    .increment()
    .accounts({ counter: counter.publicKey, user: provider.wallet.publicKey })
    .rpc();

  const account = await program.account.counter.fetch(counter.publicKey);
  expect(account.count.toNumber()).to.equal(1);
});
```

---

Son olarak, `anchor test` komutunu çalıştırın ve şu çıktıyı görmelisiniz:

```shell
anchor-counter
✔ Başlatıldı! (290ms)
✔ Sayı artırıldı (403ms)

2 geçerli (696ms)
```

`anchor test` komutunu çalıştırmak, otomatik olarak yerel bir test doğrulayıcı başlatır, programınızı dağıtır ve mocha testlerinizi buna karşı çalıştırır. Şu anda testlerden kafanız karıştığında endişelenmeyin - daha sonra daha fazla ayrıntıya gireceğiz.

> **Tebrikler!** Anchor çerçevesini kullanarak bir Solana programı oluşturmayı başardınız! Daha fazla zaman ihtiyacınız varsa, [çözüm koduna](https://github.com/Unboxed-Software/anchor-counter-program/tree/solution-increment) başvurabilirsiniz.

---

## Mücadele

Artık bağımsız olarak bir şeyler oluşturma sırası sizde. Basit programlarla başladığımız için, sizin programınız neredeyse tam olarak oluşturduğumuz gibi görünecek. Önceki kodları referans almadan sıfırdan yazabilmenin noktası, kopyala-yapıştır yapmamayı denemek için faydalıdır.

1. Yeni bir program yazın, bir `counter` hesabını başlatır
2. Hem `increment` hem de `decrement` talimatlarını uygulayın
3. Programınızı laboratuvarda yaptığımız gibi oluşturun ve dağıtın
4. Yeni dağıtılan programınızı test edin ve program kayıtlarını kontrol etmek için Solana Explorer'ı kullanın

Her zamanki gibi, bu zorluklarla yaratıcı olun ve onları temel talimatların ötesine götürmek istiyorsanız eğlenin!

Mümkünse bunu bağımsız olarak yapmaya çalışın! Ama sıkışırsanız, [çözüm koduna](https://github.com/Unboxed-Software/anchor-counter-program/tree/solution-decrement) başvurmaktan çekinmeyin.


Laboratuvarı tamamladınız mı?
Kodunuzu GitHub'a itin ve
[bize bu dersi nasıl bulduğunuzu söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=334874b7-b152-4473-b5a5-5474c3f8f3f1)!
