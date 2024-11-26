---
title: Program Türetilmiş Adresler (PDA'lar)
objectives:
  - Program Türetilmiş Adresler (PDA'lar) hakkında bilgi vermek
  - PDA'ların çeşitli kullanım durumlarını açıklamak
  - PDA'ların nasıl türetildiğini tanımlamak
  - PDA türetimlerini kullanarak verileri bulmak ve geri almak
description: "PDA'lar hakkında derinlemesine bir anlayış kazanın."
---

## Özet

- **Program Türetilmiş Adres** (PDA), bir **program ID'si** ve isteğe bağlı bir **seeds** listesi kullanılarak türetilir.
- PDA'ları türeten program, bunları sahiplenir ve kontrol eder.
- PDA türetimi, türetimde kullanılan seeds'e dayalı olarak verileri bulmanın deterministik bir yolunu sağlar.
- Seeds, ayrı bir PDA hesabında depolanan verilere haritalamak için kullanılabilir.
- Bir program, kendi ID'sinden türetilen PDA'lar adına talimatları imzalayabilir.

## Ders

### Program Türetilmiş Adresi Nedir?

Program Türetilmiş Adresler (PDA'lar), kamu anahtarları yerine, şu kombinasyona dayalı olarak hesaplanan (ya da 'bulunan') adreslerdir:

- Program ID'si
- Programcı tarafından belirlenen bir "seed" seti.

Bundan sonra daha fazla bilgi vereceğiz, ancak bu seeds'ler, PDA'ları veri depolama ve geri alma amacıyla kullanmada önemli bir rol oynayacaktır.

PDA'lar iki ana işlevi yerine getirir:

1. Bir program için belirli bir veri maddesini bulmanın deterministik bir yolunu sağlar.
2. PDA'ya sahip olan programın, tıpkı bir kullanıcının kendi hesabı için anahtarını kullanarak imza atması gibi, PDA'lar adına imza atmasını yetkilendirir.

:::note
Bu ders, PDA'ları veri bulma ve depolama amacıyla nasıl kullanacağımıza odaklanacaktır. PDA ile imzalama konusunu daha ayrıntılı olarak bir sonraki derste ele alacağız; burada Çapraz Program İstekleri (CPI'ler) üzerinde duracağız.
:::

### PDA Bulma

Teknik olarak, PDA'lar bir program ID'si ve bir veya daha fazla girdi seed'ine dayalı olarak _bulunur_ veya _türetilir_.

Diğer Solana hesaplarından farklı olarak, PDA'lar kamu anahtarları değildir ve gizli anahtarları yoktur. Kamu anahtarları Solana'nın Ed25519 eğrisi üzerinde olduğundan, PDA'lara bazen 'eğri dışı adresler' denir.

PDA'lar, program ID'si ve seed'leri kullanarak deterministik olarak bir PDA üreten bir hashing fonksiyonu kullanılarak bulunur. Hem Solana ön yüzü hem de arka yüz kodu, program ID'si ve seed'ler kullanarak bir adres belirleyebilir; aynı program aynı seed'lerle her zaman aynı Program Türetilmiş Adresi üretir.

### Seed'ler

"Seed'ler", `find_program_address` fonksiyonundaki girdilerdir. Siz geliştirici olarak, `find_program_address` metoduna geçirilecek seed'leri belirlersiniz, `find_program_address` metodu ise adresin _eğri dışında_ olmasını sağlamak için bir bump seed olarak bilinen ek bir sayısal seed ekler; bu, geçerli bir kamu anahtarı olmamasını ve karşılık gelen gizli anahtara sahip olmamasını garanti eder.

`find_program_address`, bump seed değeri 255 ile başlayarak eğri dışı adresi hesaplamak için bir döngü kullanır ve çıktının bir kamu anahtarı adresi (eğride) veya geçerli bir kamu anahtarı (eğri dışı) olup olmadığını kontrol eder. Eğer eğri dışı bir adres bulunamazsa, bu metod bump seed'i bir azaltarak tekrar dener (`255`, `254`, `253`, vb.). Metodo geçerli bir PDA bulursa, PDA'yı ve onu türeten canonical bump seed'i döner.

Eğer elde edilen PDA Ed25519 eğrisindeyse, bir hata döner: `PubkeyError::InvalidSeeds`.

:::warning
Bir PDA'nın maksimum `16` seed'i olabilir ve her seed en fazla `32` byte uzunluğunda olmalıdır. Eğer bir seed bu uzunluğu aşarsa veya seed sayısı sınırı geçerse, sistem `PubkeyError::MaxSeedLengthExceeded` hatasını döner. Bu hata, 'Seed uzunluğu adres üretimi için çok uzun' anlamına gelir. Geliştiriciler genellikle static string'ler ve kamu anahtarları kullanır.
:::

[PublicKey](https://docs.rs/solana-program/latest/solana_program/pubkey/struct.Pubkey.html#) tipi, bir Solana programında bir PDA bulmak için birden fazla metoda sahiptir:

1. `find_program_address`
2. `try_find_program_address`
3. `create_program_address`

Bu metotlar, isteğe bağlı bir "seed" listesi ve bir `program ID` girdisi alır ve PDA ve bir bump seed veya bir hata ve bir PDA dönebilir.

### 1. find_program_address

`find_program_address` için kaynak kodu:

```rust
pub fn find_program_address(seeds: &[&[u8]], program_id: &Pubkey) -> (Pubkey, u8) {
    Self::try_find_program_address(seeds, program_id)
        .unwrap_or_else(|| panic!("Geçerli bir program adresi bump seed'i bulamadı"))
}
```

Arka planda, `find_program_address` metodu giriş `seeds`'leri ve `program_id`'yi `try_find_program_address` metoduna geçirir.

### 2. try_find_program_address

`try_find_program_address` metodu, ardından `bump_seed`i tanıtır. `bump_seed`, 0 ile 255 arasında bir değere sahip bir `u8` değişkenidir. 255'ten başlayarak azalan bir aralıkta yineleme yapılırken, bir `bump_seed` eklenir giriş seed'lerine `create_program_address` metoduna geçilir. Eğer `create_program_address`'ın çıktısı geçerli bir PDA değilse, `bump_seed` bir düşürülerek döngü devam eder, geçerli bir PDA bulunana kadar.

```rust
pub fn try_find_program_address(seeds: &[&[u8]], program_id: &Pubkey) -> Option<(Pubkey, u8)> {
    //..
    let mut bump_seed = [u8::MAX];
    for _ in 0..u8::MAX {
        {
            let mut seeds_with_bump = seeds.to_vec();
            seeds_with_bump.push(&bump_seed);
            match Self::create_program_address(&seeds_with_bump, program_id) {
                Ok(address) => return Some((address, bump_seed[0])),
                Err(PubkeyError::InvalidSeeds) => (),
                _ => break,
            }
        }
        bump_seed[0] -= 1;
    }
    None

    // ...
}
```

Görüyoruz ki, `try_find_program_address` `create_program_address` metodunu çağırıyor.

```rust
pub fn try_find_program_address(seeds: &[&[u8]], program_id: &Pubkey) -> Option<(Pubkey, u8)> {
    // ...
    for _ in 0..std::u8::MAX {
        {
            // `create_program_address` burada çağrılır
            match Self::create_program_address(&seeds_with_bump, program_id) {
               //...
            }
        }
        //...
    }
}

```

### 3. create_program_address

`create_program_address` metodu, seed'ler ve `program_id` üzerinde bir hashing işlemi gerçekleştirir. Bu işlemler, bir anahtar hesaplayarak ve bunun Ed25519 eliptik eğrisi üzerinde olup olmadığını kontrol ederek gerçekleştirilir. Eğer geçerli bir PDA bulunursa (yani eğrinin _dışında_ bir adres), ya PDA veya bir hata döner.

`create_program_address` için kaynak kodu:

```rust
pub fn create_program_address(seeds: &[&[u8]], program_id: &Pubkey) -> Result<Pubkey, PubkeyError> {
    if seeds.len() > MAX_SEEDS {
        return Err(PubkeyError::MaxSeedLengthExceeded);
    }
    for seed in seeds.iter() {
        if seed.len() > MAX_SEED_LEN {
            return Err(PubkeyError::MaxSeedLengthExceeded);
        }
    }

    //..
    let mut hasher = crate::hash::Hasher::default();
    for seed in seeds.iter() {
        hasher.hash(seed);
    }
    hasher.hashv(&[program_id.as_ref(), PDA_MARKER]);
    let hash = hasher.result();

    if bytes_are_curve_point(hash) {
        return Err(PubkeyError::InvalidSeeds);
    }

    Ok(Pubkey::from(hash.to_bytes()))

    // ...
}
```

:::tip
`find_program_address` metodunun çağrılması sırasında bir hata oluştuğunda, etkili bir şekilde ele almak önemlidir. İstatistiksel olarak olası olmamakla birlikte, sistem, PDA'nın eğrinin üzerinde yer aldığında `Geçerli bir program adresi bump seed'i bulamıyor` hatasını döner. Bunun yerine `try_find_program_address` metodu kullanılır.
:::

Ed25519 eğrisinin dışındaki geçerli bir PDA'yı bulmak, canonical bump seed üzerindeki yinelemeler nedeniyle zaman alıcı olabilir. Bu işlem, programın hesaplama bütçesinin değişken bir miktarını tüketebilir. Geliştiriciler, `bump_seed`'i (aynı zamanda canonical bump olarak da bilinir) ve kullanıcı tarafından sağlanan seed'leri talimat verileri olarak geçerek performansı optimize edebilirler ve ardından seed ve canonical bump'u yeniden çözümler. Bu yeniden çözümlenen çıktılar daha sonra `create_program_address` metoduna geçilerek PDA'nın türetilmesi için kullanılabilir. `create_program_address` metodunun hesaplama bütçesine sabit bir maliyet yüklediği önemle belirtilmelidir.

Seed'lerin bir byte dilimi olarak geçilmesi nedeniyle adres çakışmaları meydana gelebilir; yani `{abcdef}`, `{abc, def}` ve `{ab, cd, ef}` gibi seed'ler aynı PDA'nın oluşturulmasına sebep olur. Geliştiriciler bazen çakışmaları önlemek için tire gibi ayırıcı karakterler eklemeyi isteyebilir.

Özetle, `find_program_address` metodu giriş seed'lerini ve `program_id`'yi `try_find_program_address` metoduna geçirir. `try_find_program_address` metodu 255 değerinde bir `bump_seed` ile başlar, bunu giriş seed'lerine ekler ve ardından geçerli bir PDA bulana kadar `create_program_address` metodunu tekrar tekrar çağırır. Bulduğunda, hem PDA hem de `bump_seed` döner.

Farklı geçerli bump'lar, aynı giriş seed'leri için farklı geçerli PDA'lar üretir. `find_program_address` tarafından döndürülen `bump_seed` her zaman bulunan ilk geçerli PDA'dır.

Onchain'de PDA oluştururken canonical bump'u kullanmak hayati önem taşır. `bump_seed` değerini 255 ile başlatmak ve 0'a kadar aşağı doğru yinelemek, dönen seed'in her zaman mümkün olan en büyük geçerli `8-bit` değer olmasını sağlar. Bu `bump_seed`, "_canonical bump_" olarak bilinir. Canonical bump'u kullanmak ve programınıza geçirilen her PDA'nın bütünlüğünü sağlamak için doğrulamak her zaman en iyi uygulamadır.

### PDA hesaplarını veri depolamak için kullanma

Solana programları stateless olduğundan, durum, programın yürütme dosyasının depolandığı ayrı hesaplarda saklanır. Programlar, veri depolama amacıyla PDA olmayan hesaplar oluşturmak için Sistem Programını kullanabilse de, programla ilgili verileri depolamak için PDA'lar tercih edilir. Bu tercih, seed'lerin ve canonical bump'ın doğrudan aynı PDA'ya karşılık gelmesi ve program ID'si olarak belirtilen programın kendi adına imza atabilmesi nedeniyle yaygındır.

:::info
Program Türetilmiş Adresler (PDA'lar), yalnızca programın kendi adına imza atabileceği hesap anahtarlarıdır. Çapraz program istekleri sırasında, program `invoke_signed` çağrısını yaparak ve adresi oluşturmak için kullanılan aynı seed'leri ve hesaplanan bump seed'i sağlayarak anahtar için "imza atabilir." Çalışma zamanı daha sonra adresle ilişkili programın çağrılan program olduğunu ve dolayısıyla imza atmaya yetkili olduğunu doğrular.
:::

Eğer PDA'larda veri depolama konusunda yeniden bir hatırlatma ihtiyacınız olursa, `Durum Yönetimi dersi` üzerine göz atabilirsiniz.

### PDA hesaplarında depolanan verilere haritalama

PDA hesaplarında veri depolamak yalnızca bir kısmıdır. Veriyi geri almak, başka bir kısmı oluşturur. İki yaklaşımı ele alacağız:

1. Veri depolamak üzere çeşitli hesapların adreslerini saklayan bir PDA "harita" hesabı oluşturma
2. Uygun PDA hesaplarını bulmak ve gerekli verileri geri almak için seed'leri stratejik bir şekilde kullanma

### PDA "harita" hesaplarını kullanarak veriyi haritalama

Örneğin, bir not alma uygulamasını düşünün. Uygulama, her biri bireysel bir not saklayan PDA hesapları oluşturur. Ayrıca, "GLOBAL_MAPPING" gibi statik bir seed kullanarak tek bir global PDA hesabı olan "harita" hesabını türetir. Bu harita hesabı, kullanıcıların halka açık anahtarlarını, notlarının saklandığı PDA'ların listesine haritalar.

:::tip
Bir kullanıcının notlarını almak için, harita hesabında kullanıcıların halka açık anahtarlarıyla ilişkili adres listesini kontrol edip, her adres için hesabı geri gönderme işlemi yapılır.
:::

Bu tür bir çözüm, geleneksel web geliştiricileri için daha yaklaşılabilir olsa da, web3 geliştirme açısından bazı dezavantajları vardır. Zira harita hesabında saklanan harita boyutu zamanla büyüyecektir, her yeni not oluşturduğunuzda ya eski harita hesabını yaratırken gerektiğinden fazla alan ayırmanız ya da alan ayırmanız gerekecek. Ayrıca, sonunda 10 megabaytlık hesap boyutu sınırına ulaşacaksınız.

Bu durumu bir dereceye kadar, her kullanıcı için ayrı bir harita hesabı oluşturarak hafifletebilirsiniz. Örneğin, tüm program için tek bir PDA harita hesabı yerine her kullanıcı için bir PDA harita hesabı oluşturabilirsiniz. Bu harita hesapları, kullanıcıların halka açık anahtarları ile ilişkilidir. Sonrasında, her notun adreslerini ilgili kullanıcının harita hesabında saklayabilirsiniz.

Bu yaklaşım, her harita hesabı için gereken boyutu azaltır, ancak yine de sürece gereksiz bir yük ekler: ilgili not verilerini bulabilmek için harita hesabındaki bilgiyi _önceden_ okuma gerekliliği.

Bu yaklaşım, bir uygulama için geçerli bir seçim olabilir, ancak varsayılan veya önerilen stratejiden farklı olmalıdır.

### PDA türetimi kullanarak veriyi haritalama

Eğer PDA'ları türetmek için kullandığınız seed'ler konusunda stratejik olursanız, gerektiği gibi haritalamaları onlara yerleştirebilirsiniz. Bu, sadece tartıştığımız not alma uygulaması örneğinin doğal bir evrimidir. Eğer not yaratıcısının halka açık anahtarını bir seed olarak kullanarak her kullanıcı için bir harita hesabı oluşturuyorsanız, o zaman neden not için PDA türetmek üzere hem yaratıcının halka açık anahtarını hem de bilinen bir bilgiyi birlikte kullanmayasınız?

Bu kurs boyunca seed'leri hesaplara haritalandırıyoruz ama bunu henüz açıkça tartışmadık. Önceki derslerde inşa ettiğimiz Film İnceleme programını düşünün. Bu program, incelediği filmin başlığını ve inceleme yaratıcısının halka açık anahtarını kullanarak incelemenin depolanması gereken adresi bulur. Bu yaklaşım, programın her yeni inceleme için benzersiz bir adres oluşturmasına ve gerektiğinde bir incelemeyi kolayca bulmasına olanak tanır. Bir kullanıcının "Spiderman" incelemesini bulmak istediğinizde, PDA hesabının adresini kullanıcının halka açık anahtarı ve "Spiderman" metnini seed olarak kullanarak türetebilirsiniz.

```rust
let (pda, bump_seed) = Pubkey::find_program_address(
    &[initializer.key.as_ref(), title.as_bytes().as_ref()],
    program_id,
);
```

### İlişkili token hesap adresleri

Bu haritalama türünün pratik bir diğer örneği ise ilişkili token hesap (ATA) adreslerini belirlemektir. ATA, belirli bir hesap için token'ları saklamak için kullanılan bir adresdir - örneğin, Jane'in USDC hesabı. ATA adresi, aşağıdaki şekilde türetilir:

- Kullanıcının cüzdan adresi
- Token'ın mint adresi
- Kullanılan token programı - ya eski token programı ya da yeni [token uzantıları program ID'si](https://docs.rs/spl-token-2022/latest/spl_token_2022/fn.id.html).

```toml
# ...
[dependencies]
spl-token-2022 = "<en son sürüm burada>"
spl-associated-token-account = "<en son sürüm burada>"
```

```rust
// Token uzantıları program ID'sini al
let token2022_program = spl_token_2022::id();
let associated_token_address = spl_associated_token_account::get_associated_token_address_with_program_id(&wallet_address, &token_mint_address, &token2022_program);
```

Arka planda, ilişkili token adresi `wallet_address`, `token_program_id` ve `token_mint_address`'i seed olarak kullanarak bulunan bir PDA'dır; bu, belirli bir token mint için herhangi bir cüzdan adresiyle ilişkili bir token hesabını bulmanın deterministik bir yolunu sunar.

```rust
fn get_associated_token_address_and_bump_seed_internal(
    wallet_address: &Pubkey,
    token_mint_address: &Pubkey,
    program_id: &Pubkey,
    token_program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            &wallet_address.to_bytes(),
            &token_program_id.to_bytes(),
            &token_mint_address.to_bytes(),
        ],
        program_id,
    )
}
```

Kullanacağınız seed'ler ile PDA hesapları arasındaki haritalar, spesifik programınıza ciddi şekilde bağlı olacaktır. Bu, sistem tasarımı veya mimarisi dersi değil, ancak dikkate alınması gereken birkaç kılavuzu belirtmekte fayda var:

- PDA türetimi sırasında bilinen seed'leri kullanın
- Verileri tek bir hesapta birleştirme şekli açısından düşünceli olun
- Her hesap içinde kullanılan veri yapısına dair düşünceli olun
- Daha basit genellikle daha iyidir

## Laboratuvar

Önceki derslerde birlikte çalıştığımız Film İnceleme programıyla pratik yapalım. Eğer önceki dersi yapmadan bu derse katılıyorsanız endişelenmeyin - yine de takip edebilmeniz mümkün olmalıdır.

Hatırlatma olarak, Film İnceleme programı kullanıcıların film incelemeleri oluşturmasına olanak tanır. Bu incelemeler, başlatıcının halka açık anahtarı ve gözden geçirilen filmin başlığı kullanılarak türetilmiş bir PDA kullanılarak bir hesapta saklanır.

Daha önce, bir film incelemesini güvenli bir şekilde güncelleme yeteneğini uygulamayı tamamladık. Bu laboratuvarı, kullanıcıların bir film incelemesi üzerine yorum yapabilme yeteneğini eklemek için kullanacağız. Bu özelliği oluşturmayı, PDA hesaplarını kullanarak yorum depolama yapısını nasıl kuracağımıza dair bir fırsat olarak değerlendireceğiz.

### 1. Başlangıç kodunu alın

Başlamak için, [film programı başlangıç kodunu](https://github.com/solana-developers/movie-program/tree/starter) `starter` dalında bulabilirsiniz.

Eğer Film İnceleme laboratuvarlarına katıldıysanız, bu şu ana kadar geliştirdiğimiz programdır. Daha önce, kodumuzu yazmak, oluşturmak ve dağıtmak için [Solana Playground](https://beta.solpg.io/) kullandık. Bu derste, programı yerel olarak geliştirip dağıtacağız. `solana-test-validator`'ın çalıştığından emin olun.

Klasörü açın ve ardından programı derlemek için `cargo build-bpf` komutunu çalıştırın. `cargo build-bpf` komutu, dağıtım için bir paylaşımlı kütüphane oluşturacaktır ve bu kütüphane `./target/deploy/` yolunda çıkacaktır.

`./target/deploy/` klasörü, `.so` formatında paylaşımlı kütüphaneyi ve `-keypair.json` formatında programın halkasal anahtarını içeren anahtar çiftini barındırır.

```sh
cargo build-bpf
```

Programı dağıtmak için, `cargo build-bpf` çıktısını kopyalayıp `solana program deploy` komutunu çalıştırın.

```sh
solana program deploy <YOL>
```

Programı, film inceleme [ön yüzü](https://github.com/solana-developers/movie-frontend/tree/solution-update-reviews) ile test edebilirsiniz ve dağıttığınız program ID'si ile güncelleyebilirsiniz. `solution-update-reviews` dalını kullandığınızdan emin olun.

### 2. Hesap yapısını planlayın

Yorum eklemek, her yorumla ilişkili verilerin depolanması hakkında birkaç karar almamız gerektiği anlamına gelir. İyi bir yapı için kriterler şunlardır:

- Aşırı karmaşık olmamak
- Veri kolaylıkla geri alınabilmeli
- Her yorum, ilişkili olduğu incelemeye bir şeyle bağlanmalı

Bunu yapmak için, iki yeni hesap türü oluşturacağız:

- Yorum sayacı hesabı
- Yorum hesabı

Her inceleme için bir yorum sayacı hesabı olacak ve her gönderilen yorum için bir hesap bağlanacak. Yorum sayacı hesabı, yorum sayacının PDA'sını bulmak için incelemenin adresini bir seed olarak kullanarak belirli bir inceleme ile bağlanacaktır. Ayrıca, "yorum" sabit dizesini de seed olarak kullanacaktır.

Yorum hesabını, bir incelemeye aynı yöntemle bağlayın. Ancak, "yorum" dizesini seed olarak içermeyecek; bunun yerine, _gerçek yorum sayısını_ seed olarak kullanacaktır. Bu şekilde, istemci, aşağıdaki gibi bir işlem yaparak verilen bir inceleme için yorumları kolaylıkla geri alabilir:

1. Yorum sayacı hesabının verilerini okuyarak bir incelemedeki toplam yorum sayısını belirleyin.
2. `n`, incelemedeki toplam yorum sayısıdır; `n` kez döngü oluşturun. Her döngüde, inceleme adresini ve mevcut sayıyı seed olarak kullanarak bir PDA türetin. Sonuç, yorumları depolayan hesapların adreslerini içeren `n` PDA olacaktır.
3. Her `n` PDA için hesapları alın ve saklanan verileri okuyun.

Hesaplarımızın her biri, önceden bilinen veriler kullanılarak deterministik olarak geri alınabilir.

Bu değişiklikleri uygulamak için, aşağıdakileri yapın:

- Yorum sayacı ve yorum hesaplarını temsil etmek için struct'ları tanımlayın
- Mevcut `MovieAccountState`'yi bir ayırt edici işlev (daha sonra bu konuya değineceğiz) içerecek şekilde güncelleyin
- `add_comment` talimatını temsil etmek için bir talimat varyantı ekleyin
- Mevcut `add_movie_review` talimat işleme fonksiyonunu, yorum sayacı hesabını oluşturmaya dahil edecek şekilde güncelleyin
- Yeni bir `add_comment` talimat işleme fonksiyonu oluşturun

### 3. MovieCommentCounter ve MovieComment Yapılarının Tanımlanması

Hatırlayın ki `state.rs` dosyası, programımızın yeni bir hesabın veri alanını doldurmak için kullandığı yapıları tanımlar.

Yorum yapabilmek için iki yeni yapı tanımlamamız gerekiyor:

1. `MovieCommentCounter` - bir değerlendirmeye bağlı yorum sayısını saklamak için
2. `MovieComment` - her yoruma bağlı verileri saklamak için

 :::note
Programımız için kullanacağımız yapıları tanımlayalım. Her yapıya, mevcut `MovieAccountState` ile birlikte bir `discriminator` alanı ekliyoruz. Artık birden fazla hesap türüne sahip olduğumuz için, istemciden ihtiyaç duyduğumuz hesap türünü almak için sadece bir yol bulmamız gerekiyor. Bu discriminator, program hesaplarımızı alırken hesapları filtreleyecek bir string'dir.
 :::

```rust
#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieAccountState {
    pub discriminator: String,
    pub is_initialized: bool,
    pub reviewer: Pubkey,
    pub rating: u8,
    pub title: String,
    pub description: String,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieCommentCounter {
    pub discriminator: String,
    pub is_initialized: bool,
    pub counter: u64,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieComment {
    pub discriminator: String,
    pub is_initialized: bool,
    pub review: Pubkey,
    pub commenter: Pubkey,
    pub comment: String,
    pub count: u64,
}

impl Sealed for MovieAccountState {}

impl IsInitialized for MovieAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for MovieCommentCounter {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for MovieComment {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
```

 :::tip
Mevcut yapımıza yeni bir `discriminator` alanı eklediğimiz için, hesap boyutu hesaplama değişiklik göstermelidir. Kodumuzdan bazı parçaları temizleyelim. Üstteki üç yapı için, bir sabit `DISCRIMINATOR` ve ya bir sabit `SIZE` ya da `get_account_size` yöntemini ekleyecek bir uygulama ekleyeceğiz. Bu şekilde, bir hesabı başlatırken ihtiyaç duyulan boyutu hızlıca alabiliriz.
 :::

```rust
impl MovieAccountState {
    pub const DISCRIMINATOR: &'static str = "review";

    pub fn get_account_size(title: String, description: String) -> usize {
        return (4 + MovieAccountState::DISCRIMINATOR.len())
            + 1
            + 1
            + (4 + title.len())
            + (4 + description.len());
    }
}

impl MovieCommentCounter {
    pub const DISCRIMINATOR: &'static str = "counter";
    pub const SIZE: usize = (4 + MovieCommentCounter::DISCRIMINATOR.len()) + 1 + 8;
}

impl MovieComment {
    pub const DISCRIMINATOR: &'static str = "comment";

    pub fn get_account_size(comment: String) -> usize {
        return (4 + MovieComment::DISCRIMINATOR.len()) + 1 + 32 + 32 + (4 + comment.len()) + 8;
    }
}
```

 :::warning
Artık, discriminator veya hesap boyutuna ihtiyaç duyduğumuz her yerde bu uygulamayı kullanabiliriz ve istem dışı yazım hataları riski olmayacaktır.
 :::

### 4. AddComment Talimatı Oluşturun

Hatırlayın ki `instruction.rs` dosyası, programımızın kabul edeceği talimatları ve her birinin veri alanını nasıl ayrıştıracağını tanımlar. Yorum eklemek için yeni bir talimat çeşidi eklememiz gerekiyor. `MovieInstruction` enum'una yeni bir çeşit `AddComment` ekleyelim.

```rust
pub enum MovieInstruction {
    AddMovieReview {
        title: String,
        rating: u8,
        description: String,
    },
    UpdateMovieReview {
        title: String,
        rating: u8,
        description: String,
    },
    AddComment {
        comment: String,
    },
}
```

Sonra, bu yeni talimatla ilişkili talimat verilerini temsil etmek için bir `CommentPayload` yapısı oluşturacağız. Hesaba ekleyeceğimiz verilerin çoğu programa geçirilen hesaplarla ilişkili genel anahtarlar olacak, bu yüzden burada tek ihtiyacımız olan şey yorum metnini temsil eden tek bir alandır.

```rust
#[derive(BorshDeserialize)]
struct CommentPayload {
    comment: String,
}
```

 :::tip
Artık talimat verilerinin ayrıştırılmasını güncelleyelim. Talimat verilerinin ayrıştırılmasını, her talimat için ilişkili yük yapısını kullanarak her eşleşen vakaya taşımamız gerektiğine dikkat edin.
 :::

```rust
impl MovieInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match variant {
            0 => {
                let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
                Self::AddMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }
            }
            1 => {
                let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
                Self::UpdateMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }
            }
            2 => {
                let payload = CommentPayload::try_from_slice(rest).unwrap();
                Self::AddComment {
                    comment: payload.comment,
                }
            }
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
```

Son olarak, `processor.rs` dosyasındaki `process_instruction` fonksiyonunu güncelleyerek yeni talimat çeşidimizi kullanın.

`processor.rs` dosyasında, `state.rs`'den yeni yapıları kapsam içine alın.

```rust
use crate::state::{MovieAccountState, MovieCommentCounter, MovieComment};
```

Sonra `process_instruction` içinde, ayrıştırılan `AddComment` talimat verilerini kısa süre içinde uygulayacağımız `add_comment` fonksiyonuna eşleştirin.

```rust
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = MovieInstruction::unpack(instruction_data)?;
    match instruction {
        MovieInstruction::AddMovieReview {
            title,
            rating,
            description,
        } => add_movie_review(program_id, accounts, title, rating, description),
        MovieInstruction::UpdateMovieReview {
            title,
            rating,
            description,
        } => update_movie_review(program_id, accounts, title, rating, description),

        MovieInstruction::AddComment { comment } => add_comment(program_id, accounts, comment),
    }
}
```

### 5. add_movie_review'i Güncelleyin ve Yorum Sayacı Hesabı Oluşturun

`add_comment` fonksiyonunu uygulamadan önce, `add_movie_review` fonksiyonunu inceleyeceğiz ve incelemenin yorum sayacı hesabını oluşturmasını güncelleyeceğiz. 

Unutmayın ki, bu hesap, bir değerlendirme ile ilişkili toplam yorum sayısını takip edecektir. Adresi, film inceleme adresi ve "comment" kelimesini tohum olarak kullanan bir PDA ile türetilecektir. Sayacı nasıl sakladığımız tamamen bir tasarım tercihi. İlk film inceleme hesabına bir "counter" alanı ekleyebiliriz.

 :::tip
`add_movie_review` fonksiyonu içinde, film inceleme hesabıyla birlikte başlatacağımız yeni sayaç hesabını temsil etmek için bir `pda_counter` ekleyelim. Artık `accounts` argümanı aracılığıyla `add_movie_review` fonksiyonuna dört hesabın geçirilmesini bekleyin.
 :::

```rust
let account_info_iter = &mut accounts.iter();

let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let pda_counter = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
```

Sonra, `total_len`'in 1000 bayttan az olduğunu kontrol eden bir sınır var, ancak `total_len` artık doğru değil çünkü bir discriminator ekledik. `total_len`'in yerine `MovieAccountState::get_account_size` çağrısını koymalıyız:

```rust
let account_len: usize = 1000;

if MovieAccountState::get_account_size(title.clone(), description.clone()) > account_len {
    msg!("Veri boyutu 1000 bayttan büyük");
    return Err(ReviewError::InvalidDataLength.into());
}
```

 :::tip
Bu talimatın düzgün çalışması için `update_movie_review` fonksiyonu içindeki kodu güncellemeyi unutmayın.
 :::

İnceleme hesabını başlattıktan sonra, `MovieAccountState` yapısında belirttiğimiz yeni alanlarla `account_data`yı da güncellemeyi unutmamalıyız.

```rust
account_data.discriminator = MovieAccountState::DISCRIMINATOR.to_string();
account_data.reviewer = *initializer.key;
account_data.title = title;
account_data.rating = rating;
account_data.description = description;
account_data.is_initialized = true;
```

Son olarak, `add_movie_review` fonksiyonu içinde, sayaç hesabını başlatmak için aşağıdaki mantığı ekleyin:

1. Sayaç hesabı için kira muafiyet miktarını hesaplamak
2. İnceleme adresi ve "comment" string'ini tohum olarak kullanarak sayaç PDA'sını türetmek
3. Hesabı oluşturmak için sistem programını çağırmak
4. Başlangıç sayaç değerini ayarlamak
5. Hesap verilerini seri hale getirmek ve fonksiyondan dönmek

 :::info
Bu adımları `add_movie_review` fonksiyonunun en sonuna ekleyin ve `Ok(())` çağrısını öncelemeniz gerektiğini unutmayın.
 :::

```rust
msg!("yorum sayacı oluştur");
let rent = Rent::get()?;
let counter_rent_lamports = rent.minimum_balance(MovieCommentCounter::SIZE);

let (counter, counter_bump) =
    Pubkey::find_program_address(&[pda.as_ref(), "comment".as_ref()], program_id);
if counter != *pda_counter.key {
    msg!("Geçersiz PDA için tohumlar");
    return Err(ProgramError::InvalidArgument);
}

invoke_signed(
    &system_instruction::create_account(
        initializer.key,
        pda_counter.key,
        counter_rent_lamports,
        MovieCommentCounter::SIZE.try_into().unwrap(),
        program_id,
    ),
    &[
        initializer.clone(),
        pda_counter.clone(),
        system_program.clone(),
    ],
    &[&[pda.as_ref(), "comment".as_ref(), &[counter_bump]]],
)?;
msg!("yorum sayacı oluşturuldu");

let mut counter_data =
    try_from_slice_unchecked::<MovieCommentCounter>(&pda_counter.data.borrow()).unwrap();

msg!("sayacı hesabının zaten başlatılıp başlatılmadığını kontrol et");
if counter_data.is_initialized() {
    msg!("Hesap zaten başlatıldı");
    return Err(ProgramError::AccountAlreadyInitialized);
}

counter_data.discriminator = MovieCommentCounter::DISCRIMINATOR.to_string();
counter_data.counter = 0;
counter_data.is_initialized = true;
msg!("yorum sayısı: {}", counter_data.counter);
counter_data.serialize(&mut &mut pda_counter.data.borrow_mut()[..])?;
```

Fonksiyon, yeni bir inceleme oluşturduğunda iki hesabı başlatır:

1. Birincisi, incelemenin içeriğini saklayan inceleme hesabıdır. Bu, programın başladığı versiyonumuzdan değişmemiştir.
2. İkincisi, yorumlar için sayaç tutmaya yarayan hesaptır.

### 6. add_comment'ı Uygulayın

Sonunda, yeni yorum hesapları oluşturmak için `add_comment` fonksiyonunu uygulayın.

Bir inceleme için yeni bir yorum oluşturduğumuzda, yorum sayacı PDA hesabında artırılacak ve yorum hesabı için PDA, inceleme adresi ve mevcut sayım kullanılarak türetilecektir.

Diğer talimat işleme fonksiyonlarında olduğu gibi, öncelikle programa geçirilen hesapları yineleyeceğiz. Daha sonra, başka bir şey yapmadan önce, mevcut yorum sayısını erişmek için sayaç hesabını ayrıştırmamız gerekir:

```rust
pub fn add_comment(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    comment: String,
) -> ProgramResult {
    msg!("Yorum Ekleniyor...");
    msg!("Yorum: {}", comment);

    let account_info_iter = &mut accounts.iter();

    let commenter = next_account_info(account_info_iter)?;
    let pda_review = next_account_info(account_info_iter)?;
    let pda_counter = next_account_info(account_info_iter)?;
    let pda_comment = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let mut counter_data =
        try_from_slice_unchecked::<MovieCommentCounter>(&pda_counter.data.borrow()).unwrap();

    Ok(())
}
```

 :::tip
Artık sayaç verilerine erişimimiz olduğuna göre, geri kalan adımlara devam edebiliriz:
1. Yeni yorum hesabı için kira muafiyet miktarını hesaplamak
2. Yorum hesabı için PDA'yı inceleme adresi ve mevcut yorum sayısını kullanarak türetmek
3. Yeni yorum hesabını oluşturmak için Sistem Programını çağırmak
4. Yeni oluşturulan hesaba uygun değerleri ayarlamak
5. Hesap verilerini seri hale getirmek ve fonksiyondan dönmek
 :::

```rust
pub fn add_comment(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    comment: String,
) -> ProgramResult {
    msg!("Yorum Ekleniyor...");
    msg!("Yorum: {}", comment);

    let account_info_iter = &mut accounts.iter();

    let commenter = next_account_info(account_info_iter)?;
    let pda_review = next_account_info(account_info_iter)?;
    let pda_counter = next_account_info(account_info_iter)?;
    let pda_comment = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let mut counter_data =
        try_from_slice_unchecked::<MovieCommentCounter>(&pda_counter.data.borrow()).unwrap();

    let account_len = MovieComment::get_account_size(comment.clone());

    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);

    let (pda, bump_seed) = Pubkey::find_program_address(
        &[
            pda_review.key.as_ref(),
            counter_data.counter.to_be_bytes().as_ref(),
        ],
        program_id,
    );
    if pda != *pda_comment.key {
        msg!("Geçersiz PDA için tohumlar");
        return Err(ReviewError::InvalidPDA.into());
    }

    invoke_signed(
        &system_instruction::create_account(
            commenter.key,
            pda_comment.key,
            rent_lamports,
            account_len.try_into().unwrap(),
            program_id,
        ),
        &[
            commenter.clone(),
            pda_comment.clone(),
            system_program.clone(),
        ],
        &[&[
            pda_review.key.as_ref(),
            counter_data.counter.to_be_bytes().as_ref(),
            &[bump_seed],
        ]],
    )?;

    msg!("Yorum Hesabı Oluşturuldu");

    let mut comment_data =
        try_from_slice_unchecked::<MovieComment>(&pda_comment.data.borrow()).unwrap();

    msg!("yorum hesabının zaten başlatılıp başlatılmadığını kontrol et");
    if comment_data.is_initialized() {
        msg!("Hesap zaten başlatıldı");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    comment_data.discriminator = MovieComment::DISCRIMINATOR.to_string();
    comment_data.review = *pda_review.key;
    comment_data.commenter = *commenter.key;
    comment_data.comment = comment;
    comment_data.is_initialized = true;
    comment_data.serialize(&mut &mut pda_comment.data.borrow_mut()[..])?;

    msg!("Yorum Sayısı: {}", counter_data.counter);
    counter_data.counter += 1;
    counter_data.serialize(&mut &mut pda_counter.data.borrow_mut()[..])?;

    Ok(())
}
```

### 7. Oluşturun ve Dağıtın

Programımızı oluşturup dağıtmaya hazırız!

Güncellenmiş programı `cargo build-bpf` komutunu çalıştırarak oluşturun. Programı dağıtmak için `solana program deploy ` komutunu çalıştırın.

 :::info
Programınızı uygun talimat verileriyle bir işlem göndererek test edebilirsiniz. Kendi script’inizi oluşturabilir veya
[bu ön uç](https://github.com/solana-developers/movie-frontend/tree/solution-add-comments)'u kullanabilirsiniz.
`MOVIE_REVIEW_PROGRAM_ID`'yi programınızın kimliği ile değiştirmeyi unutmayın, aksi takdirde ön uç programınızla çalışmaz.
 :::

 :::warning
Yeni başlatılan `discriminator` ile yapılan kritik değişiklikler nedeniyle, daha önce `discriminator`'ı eklemeden önce kullandığınız program kimliğini kullanarak bu programı dağıtırsanız, önceki oluşturduğunuz incelemeler, veri uyuşmazlığı nedeniyle bu ön uçta gösterilmeyecektir.
 :::

 :::tip
Bu proje ile bu kavramlar hakkında daha fazla zaman geçirmek ihtiyacınız varsa, devam etmeden önce
[çözüm koduna](https://github.com/solana-developers/movie-program/tree/solution-add-comments) göz atabilirsiniz.
Çözüm kodunun, bağlantılı depodaki `solution-add-comments` şubesinde olduğunu unutmayın.
 :::

## Zorluk

Artık bağımsız bir şeyler inşa etme sırası sizde! Daha önceki derslerde kullandığımız Öğrenci Tanıtım programıyla çalışmaya başlayabilirsiniz. Öğrenci Tanıtım programı, öğrencilere kendilerini tanıtma imkanı sunan bir Solana programıdır. Bu program, bir kullanıcının ismini ve kısa bir mesajı `instruction_data` olarak alır ve verileri on-chain'de saklamak için bir hesap oluşturur. Bu zorluk için:

1. Diğer kullanıcıların bir tanıta yanıt vermesine izin veren bir talimat ekleyin
2. Programı yerel olarak oluşturun ve dağıtın

 :::note
Geçmiş derslere katılmadıysanız veya daha önceki çalışmanızı kaydetmediyseniz, [solana-student-intro-program](https://github.com/solana-developers/student-intro-program/tree/starter) deposunun `starter` dalındaki başlangıç kodunu kullanabilirsiniz.
 :::

Bunu bağımsız olarak yapmaya çalışın! Ancak takılırsanız, [çözüm koduna](https://github.com/solana-developers/student-intro-program/tree/solution-add-replies) göz atabilirsiniz. Çözüm kodu, `solution-add-replies` dalında yer almakta ve kodunuz biraz farklı görünebilir.


Kodunuzu GitHub'a yükleyin ve [bu ders hakkında ne düşündüğünüzü bize söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=89d367b4-5102-4237-a7f4-4f96050fe57e)!
