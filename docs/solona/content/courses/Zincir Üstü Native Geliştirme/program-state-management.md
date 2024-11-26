---
title: Temel Bir Program Oluşturma, Bölüm 2 - Durum Yönetimi
objectives:
  - Program Türetilmiş Adres (PDA) kullanarak yeni bir hesap oluşturma sürecini tanımlamak
  - PDA türetmek için tohumları nasıl kullanacağınızı göstermek
  - Bir hesabın ihtiyaç duyduğu alanı kullanarak bir kullanıcının ayırması gereken kira miktarını (lamport olarak) hesaplamak
  - Yeni hesabın adresi olarak bir PDA ile hesap başlatmak için Çapraz Program Çağrısı (CPI) kullanmak
  - Yeni bir hesapta saklanan veriyi nasıl güncelleyeceğinizi açıklamak
description:
  "Programların verileri nasıl sakladığını öğrenin, Solana'nın yerleşik anahtar-değer depolama sistemi ile."
---

## Özet

- Program durumu, programın kendisinde değil, diğer hesaplarda saklanır.
- Durum, program ID'sinden ve isteğe bağlı tohumlardan türetilen Program Türetilmiş Adres (PDA) hesaplarında saklanır. Bir PDAdaki veriler programcı tarafından tanımlanır.
- Bir hesap oluşturmak, gerekli alanı ve karşılık gelen kirayı lamport cinsinden hesaplamayı gerektirir.
- Yeni bir hesap yaratmak için Sistem Programı üzerindeki `create_account` talimat yöneticisine bir Çapraz Program Çağrısı (CPI) yapılması gerekmektedir.
- Bir hesapta veri alanını güncellemek, veriyi hesaba dizi haline getirerek (byte array) dönüştürmeyi içerir.

---

## Ders

Solana, programların durumsuz olmasını sağlayarak hız, verimlilik ve genişletilebilirlik sağlıyor. Durumu programın yürütülebilir dosyası ile birlikte saklamak yerine, programlar Solana'nın hesap modelini kullanarak durumu ayrı PDA hesaplarına okur ve yazar.

Bu model, verileri yönetmek için basit, kullanıcı dostu bir anahtar-değer deposu sağlar ve programların verilerini etkilemeden yükseltilmesine olanak tanır. Ancak, daha eski blok zincirleriyle tanıdık olanlar için bu zorlayıcı olabilir. Bu derste, temel bilgileri öğrenip daha karmaşık blok zincir programlarını adım adım tanıtacağız. Bir Solana programında durum yönetiminin temellerini, durumu bir Rust türü olarak temsil etmeyi, PDA'lar kullanarak hesaplar oluşturmayı ve hesap verilerini dizi haline getirmeyi öğreneceksiniz.

### Program Durumu

Tüm Solana hesapları, bir byte dizisi tutan bir veri alanına sahiptir, bu da hesapları bilgisayardaki dosyalar kadar esnek hale getirir. Bir hesapta, gerekli depolama alanı olduğu sürece her şeyi saklayabilirsiniz.

Geleneksel bir dosya sistemi içindeki dosyalar PDF veya MP3 gibi belirli formatlara uygunken, Solana hesabında saklanan verilerin geri getirilip kullanılabilir hale dönüştürülmesi için bir desene uyması gerekir.

#### Durumu Rust Türü Olarak Temsil Etmek

Rust ile program yazarken, genellikle bu "formatı" tanımlayarak bir Rust veri türü oluştururuz. Bu, önceki derste kesikli talimatları temsil etmek için bir enum oluşturduğumuz gibi benzer bir durumdur 
`talimat veri dizisini serileştirme dersinin ilk bölümünde`.

Çoğu kullanım durumu için basit bir `struct` genellikle yeterlidir. **Örnek:** Bir not alma programı, notları ayrı hesaplarda saklarken, başlık, gövde ve bir ID için alanlar içerebilir:

```rust
struct NoteState {
    title: String,
    body: String,
    id: u64
}
```

#### Serileştirme ve Deserileştirme için Borsh Kullanmak

Talimat verisiyle olduğu gibi, Rust veri türümüzü bir byte dizisine dönüştürmemiz ve tersine dönüştürmemiz gerekiyor. **Serileştirme**, bir nesneyi byte dizisine dönüştürürken, **deserileştirme** bir nesneyi byte dizisinden yeniden yapılandırır.

Serileştirme ve deserileştirme için Borsh kullanmaya devam edeceğiz. Rust'ta `borsh` kütüphanesi, `BorshSerialize` ve `BorshDeserialize` niteliklerini sağlar. Bu nitelikleri `derive` öznitelik makrosu kullanarak uygularız:

```rust
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
struct NoteState {
    title: String,
    body: String,
    id: u64
}
```

Bu nitelikler, veri serileştirme ve deserileştirme için `NoteState` üzerinde yöntemler sağlar.

### Hesap Oluşturma

Bir hesabın veri alanını güncellemeden önce, önce hesabı oluşturmalıyız.

Programımızda yeni bir hesap oluşturmak için:

1. Hesap için gereken alanı ve kirayı hesaplayın.
2. Yeni hesap için bir adres belirleyin.
3. Yeni hesabı oluşturmak için sistem programını çağırın.

#### Alan ve kira

Solana ağı üzerinde veri saklamak, kullanıcıların lamport cinsinden kira ayırmasını gerektirir. Gerekli kira, hesaba ayrılan alan miktarına bağlıdır, bu nedenle hesabı oluşturmadan önce gerekli alanı belirlemeliyiz.

:::note
Kiranın daha çok bir depo gibi olduğunu unutmayın; kiraya ayrılan tüm lamportlar bir hesap kapatıldığında tamamen geri alınabilir. Ayrıca, tüm yeni hesaplar [kira muaf](https://twitter.com/jacobvcreech/status/1524790032938287105) olmalıdır, yani lamportlar zamanla düşmez. Bir hesap, en az iki yıllık kira tutarını tutuyorsa kira muafı olarak kabul edilir ve bu, hesapların, sahibi hesap kapatıp kira çekene dek sürekli olarak zincirde saklanmasını sağlar.
:::

Not alma uygulamamız örneğinde `NoteState` yapılandırması üç alana sahiptir: `title`, `body` ve `id`. Gerekli hesap boyutunu hesaplamak için, her alan için ihtiyaç duyulan alanı toplarız.

Dize gibi dinamik veriler için, Borsh, alanın uzunluğunu saklamak için ek 4 byte ekler. Bu, `title` ve `body` her biri 4 byte artı kendi boyutlarına ihtiyaç duyduğu anlamına gelir. `id` alanı, 64 bitlik bir tamsayıdır veya 8 byte.

Bu uzunlukları ekleyebilir ve `solana_program` kütüphanesinin `rent` modülündeki `minimum_balance` fonksiyonunu kullanarak gereken kirayı hesaplayabiliriz:

```rust
// NoteState yapısı için gereken hesap boyutunu hesapla
let account_len: usize = (4 + title.len()) + (4 + body.len()) + 8;

// Gerekli kirayı hesapla
let rent = Rent::get()?;
let rent_lamports = rent.minimum_balance(account_len);
```

#### Program Türetilmiş Adresler (PDA)

Bir hesap oluşturmadan önce, hesaba atamak için bir adrese ihtiyacımız var. Program sahipliğindeki hesaplar için bu, `find_program_address` fonksiyonu kullanılarak bulunan bir Program Türetilmiş Adres (PDA) olacaktır.

PDAlar, hesap oluşturan programın adresi olan program ID'si ve isteğe bağlı tohumlar kullanılarak türetilir. `find_program_address` fonksiyonu her seferinde aynı girdilerle aynı adresi döndürür, bu da herhangi bir sayıda PDA hesabını belirleyip bulmamızı sağlar.

`find_program_address` fonksiyonu ayrıca PDA'nın karşılık gelen bir gizli anahtara sahip olduğundan emin olmak için "bump seed" sağlar. Fonksiyon, geçerli bir PDA bulunana kadar 255'lik bir bump seed ile başlar.

Not alma programımız için, not oluşturucunun halka açık anahtarını ve ID'yi tohum olarak kullanacağız. Bu, her not için hesabı deterministik bir şekilde bulmamıza olanak tanır:

```rust
let (note_pda_account, bump_seed) = Pubkey::find_program_address(
    &[note_creator.key.as_ref(), id.as_bytes().as_ref(),],
    program_id
);
```

#### Çapraz Program Çağrısı (CPI)

Kira hesaplayıp geçerli bir PDA türettikten sonra, hesap oluşturmak için Çapraz Program Çağrısı (CPI) kullanarak hesabı oluşturabiliriz. CPI, bir programın başka bir program üzerindeki bir talimatı çağırdığı zaman gerçekleşir. Yeni bir hesap oluşturmak için, sistem programında `create_account` talimatını çağıracağız.

CPI'lar ya `invoke` ya da `invoke_signed` kullanılarak yapılabilir.

```rust
pub fn invoke(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>]
) -> ProgramResult
```

```rust
pub fn invoke_signed(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>],
    signers_seeds: &[&[&[u8]]]
) -> ProgramResult
```

Bu derste, bir programa, geleneksel gizli anahtar kullanmadan bir Program Türetilmiş Adres (PDA) için eylemleri yetkilendirebilen `invoke_signed` fonksiyonunu keşfedeceğiz. İşte nasıl çalışır:

1. `invoke_signed`, tohumlar, bir bump seed ve program ID'si kullanarak bir PDA türetir.
2. Bu türetilen PDA, talimattaki tüm hesaplarla karşılaştırılır.
3. Eğer bir hesap türetilen PDA ile eşleşirse, o hesabın imzalayıcı alanı true olur.

:::tip
Bu yöntem, güvenliği sağlar çünkü `invoke_signed`, PDA'yı çağıran programın ID'si kullanarak üretir, bu da diğer programların, farklı bir program ID'si ile türetilen hesapları yetkilendiren eşleşen PDAlar üretmesini engeller.
:::

PDA'nın "yetkilendirme" olarak belirtildiğini anlamak önemlidir; bu geleneksel imzalar gibi gizli anahtar kullanmaz. Bunun yerine, bu mekanizma programların kontrol ettikleri PDA hesapları için zincir üzerinde eylemleri onaylamasına olanak tanır.

```rust
invoke_signed(
    // talimat
    &system_instruction::create_account(
        note_creator.key,
        note_pda_account.key,
        rent_lamports,
        account_len.try_into().unwrap(),
        program_id,
    ),
    // account_infos
    &[note_creator.clone(), note_pda_account.clone(), system_program.clone()],
    // signers_seeds
    &[&[note_creator.key.as_ref(), note_id.as_bytes().as_ref(), &[bump_seed]]],
)?;
```

### Hesap Verilerini Serileştirme ve Deserileştirme

Bir hesap oluşturduktan sonra, verilerini Rust türüne dönüştürerek güncelleyip tekrar serileştirmeliyiz.

#### Hesap Verilerini Deserileştirmek

Bir hesabın verilerini güncellemek için öncelikle, verilerin byte dizisini hesap türüne dönüştürmeliyiz. Hesabın veri alanını ödünç alarak, mülkiyet almadan ona erişebiliriz. Daha sonra, verileri uygun Rust türüne dönüştürmek için `try_from_slice_unchecked()` fonksiyonunu kullanıyoruz:

```rust
let mut account_data = try_from_slice_unchecked::<NoteState>(note_pda_account.data.borrow()).unwrap();

account_data.title = title;
account_data.body = rating;
account_data.id = id;
```

#### Hesap Verilerini Serileştirmek

Hesabın verilerini temsil eden Rust örneği uygun değerlerle güncellendikten sonra, verileri "kaydedebiliriz".

Bu, oluşturduğunuz Rust türünün örneği üzerinde `serialize` fonksiyonu ile yapılır. Hesap verileri için değişken bir referans geçirmenizi gerektirir. Buradaki sözdizimi karmaşık olabilir, bu yüzden tamamen anlamasanız endişelenmeyin. Ödünç alma ve referanslar Rust'ta en zorlu kavramlardan ikisidir.

```rust
account_data.serialize(&mut &mut note_pda_account.data.borrow_mut()[..])?;
```

Yukarıdaki örnek, `account_data` nesnesini bir byte dizisine dönüştürür ve `note_pda_account` üzerinde `data` özelliğine ayarlar. Bu, güncellenmiş `account_data` değişkenini yeni hesabın veri alanına kaydeder. Artık bir kullanıcı `note_pda_account`'u alıp verileri deserileştirdiğinde, hesabımıza serileştirilmiş güncellenmiş verileri görüntüleyecektir.

### İteratörler

Önceki örneklerde `note_creator`'a atıfta bulunduğumuzda onun nereden geldiğini göstermediğinizi fark etmiş olabilirsiniz.

Buna ve diğer hesaplara erişmek için bir
[İteratör](https://doc.rust-lang.org/std/iter/trait.Iterator.html) kullanıyoruz. İteratör, bir değerler kümesinin her bir elemanına ardışık erişim sağlamak için kullanılan bir Rust özelliğidir. İteratörler, Solana programlarında, program giriş noktasına `accounts` argümanı aracılığıyla geçirilen hesap listesini güvenli bir şekilde yinelemek için kullanılır.

#### Rust İteratörü

İteratör deseni, bir dizi öğe üzerinde görevler gerçekleştirmenizi sağlar. `iter()` yöntemi, bir koleksiyona atıfta bulunan bir iteratör nesnesi oluşturur. Rust'ta iteratörler tembeldir ve tüketen yöntemler çağrılmadıkça hiçbir etkisi yoktur. Ardışık dizide bir sonraki öğeyi almak için `next()` fonksiyonunu kullanın.

```rust
let v1 = vec![1, 2, 3];

// vec üzerinde iteratörü oluştur
let v1_iter = v1.iter();

// İlk öğeyi almak için iteratörü kullan
let first_item = v1_iter.next();

// İkinci öğeyi almak için iteratörü kullan
let second_item = v1_iter.next();
```

#### Solana Hesapları İteratörü

Solana programlarında, talimat yöneticisi, tüm gerekli hesaplar için `AccountInfo` öğelerini içeren bir `accounts` argümanı alır. Talimat yöneticisi içinde bu hesapları kullanmak için, `accounts`'a değişken bir referans ile bir iteratör oluşturun. Bu yaklaşım, hesap bilgilerini ardışık olarak işleyip, talimat yöneticisi mantığı için gereken verilere erişmenizi sağlar.

İteratörü doğrudan kullanmak yerine, `solana_program` kütüphanesinde sağlanan `account_info` modülünden `next_account_info` fonksiyonuna iteratörü geçirebilirsiniz.

Örneğin, bir not alma programında yeni bir not oluşturmayı düşündüğünüzü varsayın. Bu talimat, minimum olarak aşağıdaki hesapları gerektirir:

- Notu oluşturan kullanıcının hesabı.
- Notu saklamak için bir PDA.
- Yeni bir hesabı başlatmak için `system_program` hesabı.

Üç hesap, program giriş noktasına `accounts` argümanı aracılığıyla geçirilir. Daha sonra, her hesapla ilişkili `AccountInfo`'yu ayırmak için bir `accounts` iteratörü kullanılır.

Not: `&mut` anahtar kelimesi, `accounts` argümanına değişken bir referans olduğunu belirtir. Daha fazla ayrıntı için 
[Rust'ta referanslar](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html) ve [mut anahtar kelimesi](https://doc.rust-lang.org/std/keyword.mut.html) referanslarına bakabilirsiniz.

```rust
// Hesap iteratörünü al
let account_info_iter = &mut accounts.iter();

// Hesapları al
let note_creator = next_account_info(account_info_iter)?;
let note_pda_account = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
```

## Laboratuvar

Bu bölüm birkaç yeni kavram tanıttı. Bunları birlikte uygulayalım ve önceki dersten Movie Review programını geliştirelim. Bu dersten başlıyorsanız bile, size ulaşmanızı sağlayacak. Kodumuzu yazmak, oluşturmak ve dağıtmak için [Solana Playground](https://beta.solpg.io) kullanacağız.

Kısaca hatırlatmak gerekirse, kullanıcıların filmleri değerlendirmesine olanak tanıyan bir Solana programı oluşturuyoruz. Önceki derste `talimat verisini deserileştirdik` ancak bu verileri bir hesapta saklamadık. Şimdi programımızı, kullanıcının film incelemesini saklamak için yeni hesaplar oluşturacak şekilde güncelleyelim.

### 1. Başlangıç kodunu alın

Geçtiğimiz derste laboratuvarı tam olarak tamamlamadıysanız ya da kaçırdığınız bir şey olup olmadığını kontrol etmek istiyorsanız, 
[başlangıç koduna](https://beta.solpg.io/66d67d97cffcf4b13384d333) atıfta bulunabilirsiniz.

Programımız şu anda, program giriş noktasına iletilen `instruction_data`'yı deserileştirmek için kullanılan bir `instruction.rs` dosyasını içeriyor. `lib.rs` dosyasını da deserileştirilmiş talimat verimizi program günlüğüne yazdırabileceğimiz noktaya kadar tamamladık ve `msg!` makrosunu kullandık.

### 2. Hesap verilerini temsil etmek için yapı oluşturun

Şimdi `state.rs` adında yeni bir dosya oluşturarak başlayalım.

Bu dosya:

1. Yeni bir hesabın veri alanını doldurmak için kullanılan `struct`'ı tanımlayacaktır.
2. Bu yapıya `BorshSerialize` ve `BorshDeserialize` niteliklerini ekleyecektir.

Öncelikle `borsh` kütüphanesinden gerekli öğeleri içeri aktaralım:

```rust
use borsh::{BorshSerialize, BorshDeserialize};
```

Ardından, her yeni film inceleme hesabının veri alanında saklayacağı parametreleri tanımlayan `MovieAccountState` yapısını oluşturalım. Yapı aşağıdaki alanları içerir:

- `is_initialized` - hesabın başlatılıp başlatılmadığını gösterir.
- `rating` - kullanıcının filmin derecelendirmesidir.
- `description` - kullanıcının film ile ilgili açıklamasıdır.
- `title` - değerlendirilen filmin başlığıdır.

```rust
#[derive(BorshSerialize, BorshDeserialize, Default)]
pub struct MovieAccountState {
    pub is_initialized: bool,
    pub rating: u8,
    pub title: String,
    pub description: String,
}
```

### 3. lib.rs'yi güncelleyin

Sonraki adımda `lib.rs` dosyasını güncelleyin. Film Değerlendirme programını tamamlamak için gereken her şeyi içe aktarmaya başlayın. Her birimin detayları için 
[solana_program kütüphanesine](https://docs.rs/solana-program/latest/solana_program/) başvurabilirsiniz.

```rust
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};
use borsh::{BorshDeserialize, BorshSerialize};

pub mod instruction;
pub mod state;

use instruction::MovieInstruction;
use state::MovieAccountState;
```

### 4. Hesaplar arasında iterasyon yapın

`add_movie_review` fonksiyonunu geliştirirken devam edin. Bir dizi hesabın, `add_movie_review` fonksiyonuna tek bir `accounts` argümanı aracılığıyla geçirildiğini hatırlayın. Talimatı işlemek için, `accounts` üzerinde yineleme yapın ve her bir hesap için `AccountInfo`'yu bir değişkene atayın.

```rust
// Hesap iteratörünü al
let account_info_iter = &mut accounts.iter();

// Hesapları al
let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
```

### 5. PDA türetin

`add_movie_review` fonksiyonu içinde, kullanıcının geçmesini beklediğiniz PDA'yı türetin. `pda_account` aynı hesaba referans vermeye devam etse de, `find_program_address()` fonksiyonunu çağırmanız gerektiği için bump seed'e ihtiyaç vardır.

Her yeni hesabın PDA'sı, initialize edenin halka açık anahtarı ve film başlığı tohumları kullanılarak türetilir. Bu ayarlama, her kullanıcının sadece bir film başlığı için bir incelemesiyle sınırlandırır, ancak farklı kullanıcıların aynı filmi değerlendirmesine ve aynı kullanıcının farklı filmleri değerlendirmesine olanak tanır.

```rust
// PDA'yı türet
let (pda, bump_seed) = Pubkey::find_program_address(
    &[initializer.key.as_ref(), title.as_bytes().as_ref()],
    program_id,
);
```

### 6. Alan ve kira hesaplayın

Yeni hesap için gereken kirayı hesaplayın. Kira, bir kullanıcının Solana ağında veri saklamak için bir hesaba ayırması gereken lamport miktarıdır. Kira hesaplamak için önce yeni hesabın gerektirdiği alanı belirleyin.

`MovieAccountState` yapılandırması dört alana sahiptir. `rating` ve `is_initialized` için 1 byte ayıracağız. `title` ve `description` için ise uzunluğuna 4 byte daha ekleyeceğiz.

```rust
// Hesap boyutunu hesapla
let account_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());

// Gerekli kirayı hesapla
let rent = Rent::get()?;
let rent_lamports = rent.minimum_balance(account_len);
```

### 7. Yeni hesap oluşturun

Kira hesaplandıktan ve PDA doğrulandığında, yeni hesabı oluşturun. Bunu yapmak için, sistem programından `create_account` talimatını Cross Program Invocation (CPI) kullanarak çağırın. Hesap, bir PDA ile oluşturulduğundan ve Film İnceleme programı talimatları "imzalamak" zorunda olduğundan `invoke_signed` kullanmalısınız.

```rust
// Hesabı oluştur
invoke_signed(
    &system_instruction::create_account(
        initializer.key,
        pda_account.key,
        rent_lamports,
        account_len.try_into().unwrap(),
        program_id,
    ),
    &[
        initializer.clone(),
        pda_account.clone(),
        system_program.clone(),
    ],
    &[&[
        initializer.key.as_ref(),
        title.as_bytes().as_ref(),
        &[bump_seed],
    ]],
  )?;

msg!("PDA oluşturuldu: {}", pda);
```

### 8. Hesap verilerini güncelleyin

Artık yeni hesabı oluşturduğumuza göre, `state.rs` dosyamızdaki `MovieAccountState` yapısının formatını kullanarak yeni hesabın veri alanını güncellemeye hazırız. Öncelikle, `pda_account`'taki hesap verilerini `try_from_slice` kullanarak deserileştirin ve ardından her alanın değerlerini ayarlayın.

```rust
msg!("Durum hesabını açıyoruz");
let mut account_data =
    MovieAccountState::try_from_slice(&pda_account.data.borrow())
        .unwrap_or(MovieAccountState::default());
msg!("Hesap verileri ödünç alındı");

account_data.title = title;
account_data.rating = rating;
account_data.description = description;
account_data.is_initialized = true;
```

Son olarak, güncellenmiş `account_data`'yı `pda_account`ın veri alanına serileştirin.

```rust
msg!("Hesabı serileştiriyoruz");
account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
msg!("Durum hesabı serileştirildi");
```

### 9. İnşa et ve dağıt

Artık programınızı inşa edip dağıtmaya hazırsınız!

![Gif Build and Deploy Program](../../../images/solana/public/assets/courses/unboxed/movie-review-pt2-build-deploy.gif)

Programınızı doğru `instructiondata` ile bir işlem göndererek test edebilirsiniz. Bunun için  
[barkod](https://github.com/solana-developers/movie-review-program-client) veya  
[frontend](https://github.com/solana-developers/movie-review-frontend) oluşturduğumuz şeylerden birini kullanabilirsiniz.  
`Özelleştirilmiş Talimat Verilerini Deserialize Etme dersi` içerisinde her iki durumda da, doğru programı test ettiğinizden emin olmak için program ID'sini ilgili `web/components/ui/review-form.ts` dosyasına ayarlayın.

:::tip 
Eğer barkodu kullanıyorsanız, sadece  
`index.ts` bileşenindeki `movieProgramId`'ye atanan değeri, dağıttığınız programın genel anahtarı ile değiştirin.
:::

:::tip 
Eğer frontend'i kullanıyorsanız, sadece `review-form.tsx` bileşenindeki  
`MOVIE_REVIEW_PROGRAM_ID`'yi, dağıttığınız programın adresi ile değiştirin.
:::

Sonrasında frontend'i çalıştırın, bir görüntü gönderin ve incelemeyi görmek için tarayıcıyı yenileyin.  
Bu projede bu kavramlarla rahat hissetmek için daha fazla zamana ihtiyacınız varsa, devam etmeden önce  
[çözüm koduna](https://beta.solpg.io/66d67f31cffcf4b13384d334) bir göz atın.

---

## Meydan Okuma

Şimdi bağımsız olarak bir şeyler inşa etme sırası sizde. Bu derste tanıtılan kavramlarla,  
şimdi Modul 1'deki Öğrenci Tanıtım programını yeniden yaratmak için ihtiyacınız olan her şeye sahipsiniz.

> Öğrenci Tanıtım programı, öğrencilerin kendilerini tanıttıkları bir Solana Programıdır. Program, bir kullanıcının ismini ve kısa bir mesajı `instruction_data` olarak alır ve verileri onchain'da saklamak için bir hesap oluşturur.  
> — Dökümantasyon

Bu derste öğrendiklerinizi kullanarak bu programı oluşturun. Programın ayrıca bir isim ve kısa bir mesajı `instruction data` olarak almasının yanı sıra:

1. Her öğrenci için ayrı bir hesap oluşturmalıdır.
2. Her hesapta `is_initialized`'ı boolean, `name`'i string ve `msg`'yi de string olarak saklamalıdır.

Programınızı test etmek için, oluşturduğumuz  
[frontend](https://github.com/solana-developers/solana-student-intro-frontend) ile inşa edin  
`Sayfa, Sıralama ve Filtre Program Verileri dersi`.  
Ön yüzdeki program ID'sini, dağıttığınız programla değiştirin.

:::warning 
Eğer yapabilirseniz bu işi bağımsız yapmaya çalışın! Ama takılırsanız,  
[çözüm koduna](https://beta.solpg.io/62b11ce4f6273245aca4f5b2) başvurabilirsiniz.
:::



Kodunuzu GitHub'a yükleyin ve  
[bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=8320fc87-2b6d-4b3a-8b1a-54b55afed781)!
