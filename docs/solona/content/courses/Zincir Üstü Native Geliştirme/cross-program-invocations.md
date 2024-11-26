---
title: Çapraz Program Çağrıları
objectives:
  - Çapraz Program Çağrıları (CPI'ler) hakkında açıklama yapın
  - CPI'lerin nasıl oluşturulup kullanılacağını tanımlayın
  - Bir programın PDA için nasıl bir imza sağlayacağını açıklayın
  - CPI'lerle ilişkili yaygın hatalardan kaçınma ve sorunları giderme
description: "Diğer Solana programlarında işlevleri nasıl çağıracağınızı öğrenin."
---

## Özeti

- **Çapraz Program Çağrısı (CPI)**, bir programın başka bir programı çağırdığı,
  çağrılan programdaki belirli bir talimata hedeflediği durumdur.
- CPI'ler, `invoke` veya `invoke_signed` komutları kullanılarak gerçekleştirilir.
  İkincisi, programların sahip oldukları Program Türetilmiş Adresler (PDA'lar) adına imza atmalarını sağlar.
- CPI'ler, Solana programlarının tamamen etkileşimli olmasını sağlayarak, herhangi bir
  talimat işleyicinin başka bir program tarafından bir CPI aracılığıyla çağrılmasına olanak tanır.
- CPI'ler yaygın olarak kullanılır. Örneğin, programınız token transfer ediyorsa,
  transferi gerçekleştirmek için Token veya Token Uzantıları programlarına bir CPI
  gerçekleştirecektir.
- Bir CPI'de çağıran programın, çağrılan programa iletilen hesaplar veya veriler üzerinde kontrolü olmadığından,
  çağrılan programın tüm parametreleri doğrulaması önemlidir. Bu, kötü niyetli veya yanlış verilerin
  program güvenliğini tehdit etmemesini sağlar.

---

## Ders

### CPI Nedir?

**Çapraz Program Çağrısı (CPI)**, bir programın başka bir programın talimatını doğrudan çağırdığı bir durumdur.
Bu, bir istemcinin programlara JSON RPC API'si kullanarak çağrılar yaptığına benzer. Bir CPI'de, programınız
yerel programları, üçüncü taraf programları veya kendi oluşturduğunuz programları çağırabilir. CPI'ler, programlar
arasında sorunsuz bir etkileşim sağlar ve tüm Solana ekosistemini geliştiriciler için büyük bir API haline getirir.

:::info
Başka bir programda bir talimatı çağırmak için talimatı doğru bir şekilde oluşturmanız gerekir. CPI oluşturma süreci,
istemci tarafında talimatlar oluşturma ile benzerdir, ancak `invoke` veya `invoke_signed` kullanırken önemli
farklılıklar vardır.
:::

Bu dersin ilerleyen bölümlerinde her iki yöntemi de inceleyeceğiz.

### Çapraz Program Çağrısı (CPI) Yapmak

Bir CPI yapmak için `solana_program` crate'inden
[`invoke`](https://docs.rs/solana-program/latest/solana_program/program/fn.invoke.html)
veya
[`invoke_signed`](https://docs.rs/solana-program/latest/solana_program/program/fn.invoke_signed.html)
fonksiyonlarını kullanın.

- `invoke` ile, programınıza sunulmuş olan orijinal işlem imzasını geçirin.
- Programınızın Program Türetilmiş Adresleri (PDA'lar) için "imza atması" gerektiğinde `invoke_signed` kullanın.

```rust
// PDA'lar için imza gerekmiyorsa kullanılır
pub fn invoke(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>]
) -> ProgramResult

// Bir programın bir PDA için 'imza' sağlaması gerektiğinde, signer_seeds parametresini kullanarak
pub fn invoke_signed(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>],
    // Her biri bir dizi tohum içeren imzacı PDA'ların bir dizisi
    signers_seeds: &[&[&[u8]]]
) -> ProgramResult
```

Çapraz Program Çağrısı (CPI) yaptığınızda, çağıran programın ayrıcalıkları çağrılan programa uzatılır. Eğer
çağıran programın işlem işleyicisi, çağrılan programı ararken hesaplardaki imzacı veya yazılabilir olarak işaretlenmişse,
bu hesaplar çağrılan programda imzacı veya yazılabilir durumunu korur.

:::tip
Geliştirici olarak, CPI'ye hangi hesapların geçirileceği üzerinde tam kontrole sahipsiniz. CPI oluşturmayı,
programınıza iletilen verilerle sadece yeni bir talimat oluşturmak olarak düşünebilirsiniz.
:::

#### invoke fonksiyonu ile CPI

```rust
invoke(
    &Instruction {
        program_id: calling_program_id,
        accounts: accounts_meta,
        data,
    },
    &account_infos[account1.clone(), account2.clone(), account3.clone()],
)?;
```

- `program_id` - Çağırdığınız programın genel anahtarı.
- `account` - Çağrılan programın okuyacağı veya yazacağı her hesabı içeren bir hesap meta verileri listesi.
- `data` - Çağrılan programa iletilen veriyi temsil eden bir byte tamponu.

:::note
`Instruction` yapısının aşağıdaki tanımı vardır:
:::

```rust
pub struct Instruction {
    pub program_id: Pubkey,
    pub accounts: Vec<AccountMeta>,
    pub data: Vec<u8>,
}
```

Çağırdığınız programa bağlı olarak, `Instruction` nesnesini oluşturmak için yardımcı fonksiyonlar içeren bir
crate mevcut olabilir. Birçok birey ve kuruluş, programlarıyla birlikte bu işlevleri sergileyen
kamusal olarak mevcut crate'ler sağlar, bu da program etkileşimini kolaylaştırır.

Örneğin, bu dersin laboratuvarında, mintleme talimatları oluşturmak için `spl_token` crate'ini
kullanacağız. Eğer böyle bir crate mevcut değilse, `Instruction` örneğini elle oluşturmanız gerekecektir.

`program_id` alanı basit olsa da, `accounts` ve `data` alanlarının daha fazla açıklamaya ihtiyacı vardır.

`accounts` ve `data` alanları `Vec` (vektör) türündedir. Vektör oluşturmak için
[`vec`](https://doc.rust-lang.org/std/macro.vec.html) makrosunu dizi notasyonu kullanarak
oluşturabilirsiniz, aşağıda gösterildiği gibi:

```rust
let v = vec![1, 2, 3];
assert_eq!(v[0], 1);
assert_eq!(v[1], 2);
assert_eq!(v[2], 3);
```

`Instruction` yapısının `accounts` alanı, [`AccountMeta`](https://docs.rs/solana-program/latest/solana_program/instruction/struct.AccountMeta.html) türünden bir vektör bekler. `AccountMeta` yapısının aşağıdaki tanımı vardır:

```rust
pub struct AccountMeta {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}
```

Bu iki parçayı birleştirmek şöyle görünür:

```rust
use solana_program::instruction::AccountMeta;

vec![
    AccountMeta::new(account1_pubkey, true), // yazılabilir, imzacı hesap için meta verileri
    AccountMeta::read_only(account2_pubkey, false), // okunabilir, imzacı olmayan hesap için meta verileri
    AccountMeta::read_only(account3_pubkey, true), // okunabilir, imzacı hesap için meta verileri
    AccountMeta::new(account4_pubkey, false), // yazılabilir, imzacı olmayan hesap için meta verileri
]
```

`Instruction` nesnesinin son alanı, veri olarak temsil edilen bir byte tamponudur. Rust'ta, bu tamponu
[`Vec::with_capacity()`](https://doc.rust-lang.org/std/vec/struct.Vec.html#method.with_capacity) kullanarak
alan ayırarak oluşturabilir ve ardından değerler ekleyerek veya dilimlerle genişleterek vektörü doldurabilirsiniz.
Bu, istemci tarafında olduğu gibi byte tamponunu artan şekilde oluşturmanıza olanak tanır.

:::info
Callak programının gereksinimlerini ve kullanılan seri hale getirme formatını belirleyin, ardından
kodunuzu eşleştirecek şekilde yazın. [`vec` makrosunun bazı](https://doc.rust-lang.org/alloc/vec/struct.Vec.html#) özelliklerini
okuyabilirsiniz.
:::

```rust
let mut vec = Vec::with_capacity(3);
vec.push(1);
vec.push(2);
vec.extend_from_slice(&number_variable.to_le_bytes());
```

[`extend_from_slice`](https://doc.rust-lang.org/alloc/vec/struct.Vec.html#method.extend_from_slice)
metodu, size alışkın olmayabilirsiniz. Bu, vektörler üzerinde bir dilim girişi alarak, dilim üzerinde iterasyon yapar,
her bir elemana kopyalar ve ardından onu `Vec`'e ekler.

#### Hesap listesini geçme

Talimatın yanı sıra, hem `invoke` hem de `invoke_signed`, bir dizi `account_info` nesnesi de gerektirir.
Tam olarak talimatta eklediğiniz `AccountMeta` nesneleri listesindeki hesapların tümünü dahil etmeniz gerekir.

Programınızda bir CPI yaptığınızda, programınıza iletilmiş olan tüm `account_info` nesnelerini zaten
yakalamış olmalısınız ve bunları değişkenlerde saklamış olmalısınız. Bu hesapları kopyalayıp göndererek
CPI için `account_info` nesneleri listenizi oluşturacaksınız.

```rust
&[first_account.clone(), second_account.clone(), third_account.clone()]
```

#### invoke ile CPI

Hem talimat hem de hesaplar listesi oluşturulduktan sonra, `invoke` çağrısını gerçekleştirebilirsiniz.

```rust
invoke(
    &Instruction {
        program_id: calling_program_id,
        accounts: accounts_meta,
        data,
    },
    &[account1.clone(), account2.clone(), account3.clone()],
)?;
```

Bir imza eklemeye gerek yoktur çünkü Solana çalışma zamanı, programınıza sağlanan orijinal imzayı geçer.
Unutmayın, eğer bir PDA adına imza gerektiğinde `invoke` çalışmaz. Bu durumda, `invoke_signed`
kullanmanız gerekecektir.

#### invoke_signed ile CPI

`invoke_signed` kullanmak biraz farklıdır çünkü imzanın oluşturulması gereken PDA'lar için kullanılan
tohumları gerektiren ek bir alan vardır. Önceki derslerden hatırlayabileceğiniz gibi, PDA'lar Ed25519 eğrisi üzerinde
yatay değildir ve dolayısıyla karşılık gelen bir gizli anahtarları yoktur. Programların PDA'ları için imzalar sağlayabildiğini öğrendiniz,
ancak bunun nasıl çalıştığını henüz öğrenmediniz—şimdi öğreniyorsunuz. Programlar, `invoke_signed` fonksiyonu ile
PDA'lar için imzalar sağlar.

`invoke_signed` fonksiyonunun ilk iki alanı, `invoke` ile aynıdır, ancak burada ek bir `signers_seeds`
alanı da gereklidir.

```rust
invoke_signed(
    &instruction,
    accounts,
    &[&["Birinci adreslerin tohumları"],
        &["İkinci adreslerin birinci tohumları",
        "İkinci adreslerin ikinci tohumları"]],
)?;
```

PDA'ların kendi gizli anahtarları yoktur, ancak bir program, PDA'yı bir imzacı olarak içeren bir talimat vermek için
kullanılabilir. Çalışma zamanının, `signers_seeds` alanındaki adresin çağıran programla bağlantılı olduğunu
doğrulamak için gereken tohumları sağlamak zorundadır.

Solana çalışma zamanı, sağlanan tohumlar ve çağıran programın `program_id`'sini kullanarak
[`create_program_address`](https://docs.rs/solana-program/latest/solana_program/pubkey/struct.Pubkey.html#method.create_program_address) çağrısını
içsel olarak tetikler. Sonucu, talimatta sağlanan adreslerle karşılaştırır. Eğer herhangi bir adres eşleşirse,
çalışma zamanı, adresin ilişkili olduğu programın çağıran olduğunu ve imzacı olma yetkisine sahip olduğunu
bilecektir.

---

### En iyi uygulamalar ve yaygın tuzaklar

#### Güvenlik kontrolleri

CPI'leri kullanırken programınızın güvenliğini ve sağlamlığını sağlamak için hatırlanması gereken bazı yaygın hatalar
ve önemli noktalar vardır. Öncelikle, programlarımıza iletilen bilgiler üzerinde kontrolümüz olmadığını unutmayın.
Bu nedenle, her zaman CPI'ye iletilen `program_id`, hesaplar ve verilerin doğrulanması önemlidir. Bu güvenlik
kontrolleri olmadan, birisi beklenmeyen bir programda bir talimatı çağıran bir işlem gönderebilir, bu da
ciddi bir güvenlik riski yaratır.

Neyse ki, `invoke_signed` fonksiyonu, imzacılar olarak işaretlenmiş olan herhangi bir PDA'nın geçerliliği ile ilgili
kendi kontrollerini gerçekleştirir. Ancak, diğer tüm hesaplar ve `instruction_data` program kodunuzda CPI yapmadan
önce doğrulanmalıdır. Ayrıca, çağırdığınız programdaki hedef alınan talimatı sağladığınızdan emin olmanız da
önemlidir. Bunun en basit yolu, çağırdığınız programın kaynak kodunu gözden geçirmek, istemci tarafında bir
talimat oluştururken yapacağınız gibidir.

#### Yaygın hatalar

CPI'yi yürütürken karşılaşabileceğiniz yaygın hatalar vardır ve bu hatalar genellikle CPI'yi yanlış bilgiyle
oluşturduğunuzu gösterir. Örneğin, benzer bir hata mesajıyla karşılaşabilirsiniz:

```text
EF1M4SPfKcchb6scq297y8FPCaLvj5kGjwMzjTM68wjA'nın imzacı ayrıcalığı yükseltildi
Program hata verdi: "Yetkisiz imzacı veya yazılabilir hesap ile çapraz program çağrısı"
```

Bu mesaj yanıltıcı olabilir çünkü "imzacı ayrıcalığı yükseltildi" başlangıçta bir sorun gibi görünmeyebilir,
ancak bu, mesajdaki adres için yanlış bir şekilde imza attığınız anlamına gelir. `invoke_signed` kullanıyorsanız
ve bu hatayı alıyorsanız, sağladığınız tohumların yanlış olması muhtemeldir. Bu hatayı [buradan](http://explorer.solana.com/tx/3mxbShkerH9ZV1rMmvDfaAhLhJJqrmMjcsWzanjkARjBQurhf4dounrDCUkGunH1p9M4jEwef9parueyHVw6r2Et?cluster=devnet) kontrol edebilirsiniz.

Benzer bir hata, bir hesaba yazılmadığı için `AccountMeta` yapısında işaretlenmemişse meydana gelir:

```text
2qoeXa9fo8xVHzd2h9mVcueh6oK3zmAiJxCTySM5rbLZ'nın yazılabilir ayrıcalığı yükseltildi
Program hata verdi: "Yetkisiz imzacı veya yazılabilir hesap ile çapraz program çağrısı"
```

:::warning
Unutmayın, program yürütülmesi sırasında verileri değiştirilebilen her hesap, `writable` olarak belirtilmelidir.
Yürütme sırasında, `writable` olarak belirtilmemiş bir hesaba yazma girişimi işlemin başarısız olmasına neden olacaktır.
Benzer şekilde, program tarafından sahip olunmayan bir hesaba yazma işlemi de işlemin başarısız olmasına neden olacaktır.

Program yürütülmesi sırasında, lamport bakiyesi değiştirilebilen her hesap da `writable` olarak belirtilmelidir.
`writable` olarak belirtilmemiş bir hesaptan lamport çıkarmak, işlemin başarısız olmasına neden olacaktır. Bununla birlikte,
herhangi bir hesaba lamport eklemek, değiştirilebilir olduğu sürece izin verilir.

Bunu eyleme geçmek için [bu işlemi explorer'dan](https://explorer.solana.com/tx/ExB9YQJiSzTZDBqx4itPaa4TpT8VK4Adk7GU5pSoGEzNz9fa7PPZsUxssHGrBbJRnCvhoKgLCWnAycFB7VYDbBg?cluster=devnet) izleyebilirsiniz.
:::

### CP'lerin önemi

Çapraz Program Çağrıları (CPI'ler), Solana ekosisteminin önemli bir özelliğidir çünkü tüm dağıtılan programların
etkileşimli olmasını sağlar. CPI'ler ile geliştirme sırasında tekerleği yeniden icat etmenize gerek yoktur, çünkü
yeni protokoller ve uygulamalar, mevcut olanlar üzerine inşa edilebilir, tam olarak lego tuğlaları gibi.
CPI'ler, geliştiricilerin programlarınızı entegre etmelerine veya üzerine inşa etmelerine olanak tanır. Eğer
harika ve faydalı bir şey inşa ederseniz, diğer geliştiriciler protokolünüzü projelerinde kullanabilir.
Birliktelik, Web3'ün en benzersiz yönlerinden biridir ve CPI'ler Solana'da bunu mümkün kılar.

CPI'lerin bir diğer önemli yönü, programların PDA'lar için imza atmalarını sağlamasıdır. Muhtemelen fark ettiğiniz
gibi, PDA'lar Solana geliştirmesinde sıkça kullanılmaktadır çünkü programların, dış kullanıcıların bu adreslere
ait imzalarla geçerli işlemler oluşturmasını önleyen belirli adresleri kontrol etmesine olanak tanır. Bu özellik,
peşinden koştuğumuz birçok Web3 uygulamasında _son derece_ faydalıdır, örneğin DeFi ve NFT'lerde. CPI'ler olmadan,
PDA'lar çok daha az kullanışlı olurdu çünkü programlar, PDA'larla ilgili işlemler için imza atma yeteneğine sahip
olmazlardı—bu da onları, bir PDA'ya gönderilen varlıkların geri alınamayacağı kara deliklere dönüştürürdü!

---

## Laboratuvar

Şimdi CPI'lerle ilgili bazı uygulama deneyimi kazanalım ve Movie Review programına bazı eklemeler yapalım.
Önceki dersleri geçmeden bu derse dalıyorsanız, sorun değil! Movie Review programı, kullanıcıların film
yorumlarını göndermesine olanak tanır ve bu yorumlar PDA hesaplarında saklanır.

`program türetilmiş adresler dersinde`,
PDA'lar kullanarak film yorumlarına yorum yapma yeteneğini eklemiştik. Bu derste, bir inceleme veya yorum
gönderildiğinde, programın inceleyen veya yorum yapan kişilere token mintlemesini sağlayacağız.

Bunu gerçekleştirmek için, SPL Token Programının `MintTo` talimatını CPI aracılığıyla çağıracağız. Tokenlar, token mintleri ve yeni token mintleme konularında yeniliklere ihtiyacınız varsa, bu laboratuvara devam etmeden önce
`Token Program dersine` göz atın.

### 1. Başlangıç kodunu alın ve bağımlılıkları ekleyin

Başlamak için, önceki PDA dersinden Movie Review programının son halini kullanacağız.
Eğer o dersi tamamladıysanız, her şey ayarlıdır ve ilerlemeye hazırsınız. Eğer bu noktada
girmeye başladıysanız, sorun yok! [solution-add-comments dalından başlangıç kodunu](https://github.com/solana-developers/movie-program/tree/solution-add-comments) indirebilirsiniz.

### 2. Cargo.toml dosyasına bağımlılıkları ekleyin

Başlamadan önce, `[dependencies]` altında `Cargo.toml` dosyasına iki yeni bağımlılık eklememiz gerekiyor.
Mevcut bağımlılıklara ek olarak `spl-token` ve `spl-associated-token-account` crate'lerini kullanacağız.

```toml
spl-token = { version="6.0.0", features = [ "no-entrypoint" ] }
spl-associated-token-account = { version="5.0.1", features = [ "no-entrypoint" ] }
```

Yukarıdakileri ekledikten sonra, bağımlılıkları çözmek ve devam etmek için konsolda `cargo check` çalıştırın.
Kurulumunuza bağlı olarak, ilerlemek için crate sürümlerini değiştirmeyi bekleyebilirsiniz.

### 3. add_movie_review'e gerekli hesapları ekleyin

Kullanıcıların bir yorum oluşturduğunda token mint almasını istediğimiz için, mintleme mantığını
`add_movie_review` fonksiyonu içerisine eklemek mantıklıdır. Token mintleme yapacağımız için
`add_movie_review` talimat işleyicisinin iletilen hesaplara birkaç yeni hesabın eklenmesi gerekmektedir:

- `token_mint` - tokenin mint adresi
- `mint_auth` - token mint otoritesinin adresi
- `user_ata` - bu mint için kullanıcının ilişkili token hesabı (tokenlerin mint edileceği yer)
- `token_program` - token programının adresi

Bu yeni hesapları, geçirilen hesaplar üzerinde yineleme yapan fonksiyonun içine ekleyerek başlayacağız:

```rust filename="processor.rs"
// add_movie_review içinde
msg!("Film yorumu ekleniyor...");
msg!("Başlık: {}", title);
msg!("Değerlendirme: {}", rating);
msg!("Açıklama: {}", description);

let account_info_iter = &mut accounts.iter();

let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let token_mint = next_account_info(account_info_iter)?;
let mint_auth = next_account_info(account_info_iter)?;
let user_ata = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
let token_program = next_account_info(account_info_iter)?;
```

Yeni işlevsellik için ekstra bir `instruction_data` gerekmediği için, verilerin nasıl serileştirildiğine dair değişiklik yapılması gerekmiyor. Tek gereken ek bilgilerin ekstra hesaplar olmasıdır.

### 4. `add_movie_review` fonksiyonuna inceleyiciye token oluşturma

Minting mantığına dalmadan önce, dosyanın en üstünde Token programının adresini ve `LAMPORTS_PER_SOL` sabitini içe aktaralım.

```rust filename="processor.rs"
// processor.rs içinde
use solana_program::native_token::LAMPORTS_PER_SOL;
use spl_associated_token_account::get_associated_token_address;
use spl_token::{instruction::initialize_mint, ID as TOKEN_PROGRAM_ID};
```

Artık token'ların gerçek minting'ini yöneten mantığa geçebiliriz! Bunu `add_movie_review` fonksiyonunun sonunda, `Ok(())` döndürüldükten hemen önce ekleyeceğiz.

Token minting işlemi, mint authority tarafından bir imza gerektirir. Programın token mint edebilmesi için, mint authority'nin programın imza atabileceği bir hesap olması gerekir. Diğer bir deyişle, bu hesap program tarafından sahip olunan bir PDA hesabı olmalıdır.

:::tip
Bir PDA hesabı oluşturmanın avantajı, programın bu hesap için imzalamayı garanti etmesidir.
:::

Ayrıca, token mintimizi, mint hesabının belirleyici bir şekilde elde edilebileceği bir PDA hesabı olacak şekilde yapılandıracağız. Bu sayede, programa geçirilen `token_mint` hesabının beklenen hesap olduğunu her zaman doğrulayabiliriz.

Gelip `find_program_address` fonksiyonunu kullanarak, sırasıyla "token_mint" ve "token_auth" tohumları ile token mint ve mint authority adreslerini elde edelim.

```rust filename="processor.rs"
// Bir inceleme eklemek için token mint et
msg!("Mint authority elde ediliyor");
let (mint_pda, _mint_bump) = Pubkey::find_program_address(&[b"token_mint"], program_id);

let (mint_auth_pda, mint_auth_bump) = Pubkey::find_program_address(&[b"token_auth"], program_id);
```

Sonraki adımda, programa geçirilen her bir yeni hesabı kontrol edeceğiz. Hesapları doğrulamayı unutmamak önemlidir!

```rust filename="processor.rs"
if *token_mint.key != mint_pda {
    msg!("Yanlış token mint");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *mint_auth.key != mint_auth_pda {
    msg!("Geçilen mint ile elde edilen mint eşleşmiyor");
    return Err(ReviewError::InvalidPDA.into());
}

if *user_ata.key != get_associated_token_address(initializer.key, token_mint.key) {
    msg!("Başlatıcı için yanlış ilişkili token hesabı");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *token_program.key != TOKEN_PROGRAM_ID {
    msg!("Yanlış token programı");
    return Err(ReviewError::IncorrectAccountError.into());
}
```

Sonunda, doğru hesapları kullanarak token programının `mint_to` fonksiyonuna bir CPI gerçekleştirebiliriz, `invoke_signed` kullanarak. `spl_token` crate'i, minting talimatını oluşturmak için bir `mint_to` yardımcı fonksiyonu sağlar. Bu harika çünkü bu sayede tüm talimatı sıfırdan manuel olarak inşa etmek zorunda kalmıyoruz. Bunun yerine, fonksiyonun gerekli argümanlarını geçebiliriz. İşte fonksiyonun imzası:

```rust filename="processor.rs"
// Token programı içinde, bir Instruction nesnesi döner
pub fn mint_to(
    token_program_id: &Pubkey,
    mint_pubkey: &Pubkey,
    account_pubkey: &Pubkey,
    owner_pubkey: &Pubkey,
    signer_pubkeys: &[&Pubkey],
    amount: u64,
) -> Result<Instruction, ProgramError>
```

Daha sonra `token_mint`, `user_ata` ve `mint_auth` hesaplarının kopyalarını sağlıyoruz. Ve, bu ders için en ilgili olanı, `token_mint` adresini bulmak için kullanılan tohumları sağlıyoruz, bump tohumunu dahil ederek.

```rust filename="processor.rs"
msg!("Kullanıcı ilişkili token hesabına 10 token mint ediliyor");
invoke_signed(
    // Talimat
    &spl_token::instruction::mint_to(
        token_program.key,
        token_mint.key,
        user_ata.key,
        mint_auth.key,
        &[],
        10 * LAMPORTS_PER_SOL,
    )?,
    // Account_infos
    &[token_mint.clone(), user_ata.clone(), mint_auth.clone()],
    // Tohumlar
    &[&[b"token_auth", &[mint_auth_bump]]],
)?;

Ok(())
```

Burada `invoke_signed` kullandığımızı ve `invoke` kullanmadığımızı unutmayın. Token programı, bu işlem için `mint_auth` hesabının imza atmasını gerektirir. `mint_auth` hesabı bir PDA olduğundan, yalnızca türediği program onun adına imza atabilir. `invoke_signed` çağrıldığında, Solana çalışma zamanı, sağlanan tohumlar ve bump ile birlikte `create_program_address` çağrısını yapar ve ardından türetilen adresi sağlayan `AccountInfo` nesnelerinin tüm adresleriyle karşılaştırır. Eğer herhangi bir adres türetilen adresle eşleşiyorsa, çalışma zamanı, eşleşen hesabın bu programın bir PDA'sı olduğunu ve programın bu hesap için bu işlemi imza attığını bilir.

:::note
Bu aşamada, `add_movie_review` talimat işleyicisinin tam işlevsel olması ve bir inceleme oluşturulduğunda inceleyiciye on token mint etmesi gerekir.
:::

### 5. `add_comment` için tekrar et

`add_comment` fonksiyonundaki güncellemelerimiz, yukarıdaki `add_movie_review` fonksiyonunda yaptığımız şeylere neredeyse özdeş olacak. Tek fark, incelemenin üzerine ağırlık vermek için, yorum için mint edilen token sayısını ondan beşe değiştireceğiz. Öncelikle, `add_movie_review` fonksiyonundaki ile aynı dört ek hesapla hesapları güncelleyin.

```rust filename="processor.rs"
// add_comment içinde
let account_info_iter = &mut accounts.iter();

let commenter = next_account_info(account_info_iter)?;
let pda_review = next_account_info(account_info_iter)?;
let pda_counter = next_account_info(account_info_iter)?;
let pda_comment = next_account_info(account_info_iter)?;
let token_mint = next_account_info(account_info_iter)?;
let mint_auth = next_account_info(account_info_iter)?;
let user_ata = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
let token_program = next_account_info(account_info_iter)?;
```

Sonraki adımda, `Ok(())` öncesinde, `add_comment` fonksiyonunun sonuna doğru ilerleyeceğiz. Ardından mint hesabı ve mint authority hesaplarını elde edin. Unutmayın, her ikisi de sırasıyla "token_mint" ve "token_authority" tohumu ile türetilmiştir.

```rust filename="processor.rs"
// Burada token mint et
msg!("Mint authority elde ediliyor");
let (mint_pda, _mint_bump) = Pubkey::find_program_address(&[b"token_mint"], program_id);
let (mint_auth_pda, mint_auth_bump) =
    Pubkey::find_program_address(&[b"token_auth"], program_id);
```

Sonraki adımda, yeni hesapların her birinin doğru hesap olduğunu doğrularız.

```rust filename="processor.rs"
if *token_mint.key != mint_pda {
    msg!("Yanlış token mint");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *mint_auth.key != mint_auth_pda {
    msg!("Geçilen mint ile elde edilen mint eşleşmiyor");
    return Err(ReviewError::InvalidPDA.into());
}

if *user_ata.key != get_associated_token_address(commenter.key, token_mint.key) {
    msg!("Yorumcu için yanlış ilişkili token hesabı");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *token_program.key != TOKEN_PROGRAM_ID {
    msg!("Yanlış token programı");
    return Err(ReviewError::IncorrectAccountError.into());
}
```

Sonunda, `invoke_signed` kullanarak Token programına `mint_to` talimatını iletin, yorumcuya beş token gönderin.

```rust filename="processor.rs"
msg!("Kullanıcı ilişkili token hesabına 5 token mint ediliyor");
invoke_signed(
    // Talimat
    &spl_token::instruction::mint_to(
        token_program.key,
        token_mint.key,
        user_ata.key,
        mint_auth.key,
        &[],
        5 * LAMPORTS_PER_SOL,
    )?,
    // Hesap bilgiler
    &[token_mint.clone(), user_ata.clone(), mint_auth.clone()],
    // Tohumlar
    &[&[b"token_auth", &[mint_auth_bump]]],
)?;

Ok(())
```

### 6. Token mint'ı ayarla

Artık inceleyicilere ve yorumculara token mint etmek için gereken tüm kodu yazdık, ancak bunun çalışması için "token_mint" tohumu ile türetilmiş bir token mint'ın var olduğunu varsayıyoruz. Bunun çalışması için, token mint'ı başlatmak üzere bir ek talimat oluşturacağız. Bu talimat, yalnızca bir kez çağrılacak şekilde yazılacak ve kim tarafından çağrıldığı çok önemli değil.

:::info
Bu derste, PDA'lar ve CPI'ler ile ilişkili tüm kavramları sıkça vurguladığımız için, bu bölümü daha az açıklama ile geçeceğiz.
:::

Başlangıçta `instruction.rs` dosyasındaki `MovieInstruction` enum'una dördüncü bir talimat varyantı ekleyin.

```rust filename="instruction.rs"
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
    InitializeMint,
}
```

`unpack` fonksiyonundaki `match` ifadesine bu yeni durumu eklemeyi unutmayın, aynı dosyada ayrıştırıcı `3` altına.

```rust filename="instruction.rs"
impl MovieInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&discriminator, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        match discriminator {
            0 => {
                let payload = MovieReviewPayload::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Ok(Self::AddMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                })
            }
            1 => {
                let payload = MovieReviewPayload::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Ok(Self::UpdateMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                })
            }
            2 => {
                let payload = CommentPayload::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Ok(Self::AddComment {
                    comment: payload.comment,
                })
            }
            3 => Ok(Self::InitializeMint),
            _ => return Err(ProgramError::InvalidInstructionData),
        }
    }
}
```

`processor.rs` dosyasındaki `process_instruction` fonksiyonuna yeni talimatı ekleyin ve `initialize_token_mint` fonksiyonunu çağırın.

```rust filename="processor.rs"
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
        MovieInstruction::InitializeMint => initialize_token_mint(program_id, accounts),
    }
}
```

Son olarak, `initialize_token_mint` fonksiyonunu tanımlayıp uygulayın. Bu fonksiyon, token mint ve mint authority PDA'larını türetecek, token mint hesabını oluşturacak ve ardından token mint'ı başlayacak. Tüm bunların detaylı bir açıklamasını sağlamayacağız, ancak kodunuzu okuyup anlamanız önemli, çünkü token mint'ın oluşturulması ve başlatılması her ikisi de CPI'leri içeriyor. Tekrar, token'lar ve mint'ler hakkında bir tazeleme isterseniz, 
`Token Program dersi` ne bir göz atın.

```rust filename="processor.rs"
pub fn initialize_token_mint(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();

    let initializer = next_account_info(account_info_iter)?;
    let token_mint = next_account_info(account_info_iter)?;
    let mint_auth = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let sysvar_rent = next_account_info(account_info_iter)?;

    let (mint_pda, mint_bump) = Pubkey::find_program_address(&[b"token_mint"], program_id);
    let (mint_auth_pda, _mint_auth_bump) =
        Pubkey::find_program_address(&[b"token_auth"], program_id);

    msg!("Token mint: {:?}", mint_pda);
    msg!("Mint authority: {:?}", mint_auth_pda);

    if mint_pda != *token_mint.key {
        msg!("Yanlış token mint hesabı");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    if *token_program.key != TOKEN_PROGRAM_ID {
        msg!("Yanlış token programı");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    if *mint_auth.key != mint_auth_pda {
        msg!("Yanlış mint auth hesabı");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(82);

    invoke_signed(
        &system_instruction::create_account(
            initializer.key,
            token_mint.key,
            rent_lamports,
            82,
            token_program.key,
        ),
        &[
            initializer.clone(),
            token_mint.clone(),
            system_program.clone(),
        ],
        &[&[b"token_mint", &[mint_bump]]],
    )?;

    msg!("Token mint hesabı oluşturuldu");

    invoke_signed(
        &initialize_mint(
            token_program.key,
            token_mint.key,
            mint_auth.key,
            Option::None,
            9,
        )?,
        &[token_mint.clone(), sysvar_rent.clone(), mint_auth.clone()],
        &[&[b"token_mint", &[mint_bump]]],
    )?;

    msg!("Token mint başlatıldı");

    Ok(())
}
```

### 7. Derleme ve Yayınlama

Artık programımızı oluşturup dağıtmaya hazırız! Programı `cargo build-sbf` komutuyla oluşturabilirsiniz.

```sh
cargo build-sbf
```

Daha sonra programı `solana program deploy` komutunu çalıştırarak dağıtın.

```sh
solana program deploy target/deploy/<your_program_name>.so
```

Başarılı bir dağıtım sonrasında, bir Program ID alacaksınız. Örneğin:

```sh
Program Id: AzKatnACpNwQxWRs2YyPovsGhgsYVBiTmC3TL4t72eJW
```

Eğer dağıtım sırasında "yetersiz fonlar" hatası ile karşılaşırsanız, dağıtım cüzdanınıza SOL eklemeniz gerekebilir. Solana CLI kullanarak bir airdrop talep edin:

```sh
solana airdrop 2
```

Airdrop aldıktan sonra, dağıtımı tekrar deneyin.

:::callout
Dağıtım yapmadan veya airdrop talep etmeden önce Solana CLI'nizi doğru ağ için yapılandırdığınızdan (`Localnet`, `devnet`, `testnet` veya `mainnet-beta`) emin olun.
:::

Eğer program dağıtımı sırasında aşağıdaki hatayı alırsanız, bu durum program boyutunuzun uzatılması gerektiğini gösterir:

```sh
Error: Deploying program failed: RPC response error -32002: Transaction simulation failed: Error processing Instruction 0: account data too small for instruction [3 log messages]
```

Bunu çözmek için, eğer Solana CLI sürümünüz 1.18 veya daha yeniyse, aşağıdaki komutu çalıştırın:

```sh
solana program extend PROGRAM_ID 20000 -u d -k KEYPAIR_FILE_PATH
```

`PROGRAM_ID` ve `KEYPAIR_FILE_PATH` değerlerini kendi değerlerinizle değiştirin. Örneğin:

```sh
solana program extend HMDRWmYvL2A9xVKZG8iA1ozxi4gMKiHQz9mFkURKrG4 20000 -u d -k ~/.config/solana/id.json
```

:::callout
Komutta doğru Solana'nın JSON RPC veya moniker URL parametresini geçtiğinizden emin olun.

```bash
-u, --url <URL_OR_MONIKER>  URL for Solana's JSON RPC or moniker (or their first letter): [mainnet-beta, testnet, devnet, localhost]
```
:::

Bir inceleme veya yorum eklemenin token gönderip göndermediğini test etmeden önce, programın token mint'ının başlatılması gerekiyor.

Öncelikle, boş bir NPM projesi oluşturun ve başlatın, ardından proje dizinine geçin:

```bash
mkdir movie-token-client
cd movie-token-client
npm init -y
```

Tüm gerekli bağımlılıkları yükleyin.

```bash
npm i @solana/web3.js@1 @solana-developers/helpers@2.5.2

npm i --save-dev esrun
```

`initialize-review-token-mint.ts` adında yeni bir dosya oluşturun:

```bash
touch initialize-review-token-mint.ts
```

Aşağıdaki kodu yeni oluşturduğunuz dosyaya kopyalayın.

```typescript filename="initialize-review-token-mint.ts"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  initializeKeypair,
  airdropIfRequired,
  getExplorerLink,
} from "@solana-developers/helpers";

const PROGRAM_ID = new PublicKey(
  "AzKatnACpNwQxWRs2YyPovsGhgsYVBiTmC3TL4t72eJW",
);

const LOCALHOST_RPC_URL = "http://localhost:8899";
const AIRDROP_AMOUNT = 2 * LAMPORTS_PER_SOL;
const MINIMUM_BALANCE_FOR_RENT_EXEMPTION = 1 * LAMPORTS_PER_SOL;

const connection = new Connection(LOCALHOST_RPC_URL);
const userKeypair = await initializeKeypair(connection);

await airdropIfRequired(
  connection,
  userKeypair.publicKey,
  AIRDROP_AMOUNT,
  MINIMUM_BALANCE_FOR_RENT_EXEMPTION,
);

const [tokenMintPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_mint")],
  PROGRAM_ID,
);

const [tokenAuthPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_auth")],
  PROGRAM_ID,
);

const INITIALIZE_MINT_INSTRUCTION = 3;

const initializeMintInstruction = new TransactionInstruction({
  keys: [
    { pubkey: userKeypair.publicKey, isSigner: true, isWritable: false },
    { pubkey: tokenMintPDA, isSigner: false, isWritable: true },
    { pubkey: tokenAuthPDA, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ],
  programId: PROGRAM_ID,
  data: Buffer.from([INITIALIZE_MINT_INSTRUCTION]),
});

const transaction = new Transaction().add(initializeMintInstruction);

try {
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [userKeypair],
  );
  const explorerLink = getExplorerLink("transaction", transactionSignature);

  console.log(`Transaction submitted: ${explorerLink}`);
} catch (error) {
  if (error instanceof Error) {
    throw new Error(
      `Program token mint'ı başlatma başarısız oldu: ${error.message}`,
    );
  } else {
    throw new Error("Bilinmeyen bir hata oluştu");
  }
}
```

`initialize-review-token-mint.ts` dosyasındaki `PROGRAM_ID`'yi program ID'niz ile değiştirin. Ardından dosyayı şu şekilde çalıştırın:

```bash
npx esrun initialize-review-token-mint.ts
```

Token mint'ınız şimdi başlatılacak. Betimlemenin yerel ağda dağıtıldığını varsayıyoruz. Eğer devnet'e dağıtıyorsanız, betimlemeyi buna göre güncelleyin.

Token mint'ınızı başlattıktan sonra, inceleme ve yorum eklemeyi test etmek için 
[Movie Review frontend](https://github.com/Unboxed-Software/solana-movie-frontend/tree/solution-add-tokens) kullanabilirsiniz. Tekrar edelim, kod devnet üzerinde olduğunuzu varsayıyor, bu nedenle buna göre hareket edin.

Bir inceleme gönderdikten sonra, cüzdanınızda 10 yeni token görmeniz gerekir! Bir yorum eklediğinizde, 5 token almanız gerekir. Bunlar herhangi bir özel isim veya resme sahip olmayacaktır çünkü token'a herhangi bir metadata eklemedik, ama fikri anladığınızı düşünüyorum.

:::quote
Bu dersteki kavramlarla daha fazla zaman geçirmeniz veya bir noktada zorlanmanız durumunda, 
[çözüm koduna `solution-add-tokens` dalında](https://github.com/solana-developers/movie-program/tree/solution-add-tokens) bir göz atabilirsiniz.
— Unboxed Software
:::

## Challenge

Bu derste öğrendiklerinizle CP'leri nasıl uygulayabileceğinizi düşünün. Öğrenci Tanıtım programına nasıl dahil edebileceğinizi düşünün. Burada yaptığımız gibi benzer bir şey yapabilir ve kullanıcılar kendilerini tanıtırken onlara token oluşturacak bazı işlevsellikler ekleyebilirsiniz. 

:::tip
**Öneri:** Kullanıcı tanıtım programında token oluşturma işlevselliğini kullanarak etkileşimi artırabilirsiniz.
:::

Ya da gerçekten hırslı hissediyorsanız, şimdiye kadar kursta öğrendiklerinizi nasıl kullanabileceğinizi düşünün ve sıfırdan tamamen yeni bir şey yaratın.

Harika bir örnek, merkeziyetsiz bir Stack Overflow oluşturmak olabilir. Program, bir kullanıcının genel puanını belirlemek için token'ları kullanabilir; sorular doğru cevaplandığında token'lar oluşturabilir; kullanıcıların cevapları oylamasına izin verebilir vb. 

:::info
Tüm bunlar mümkün ve artık bunu kendi başınıza inşa etmek için gereken becerilere ve bilgiye sahipsiniz!
:::


Önemli Notlar

- Token kullanımı ile kullanıcı etkileşimini artırmak mümkündür.
- Merkeziyetsiz sistemler, kullanıcı verilerini kendi ellerine almayı sağlar.



---

**Kodunuzu GitHub'a yükleyin ve**  
[bizeden bu derse ilişkin ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=ade5d386-809f-42c2-80eb-a6c04c471f53)!


Kodunuzu GitHub'a yükleyin ve
[bizeden bu derse ilişkin ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=ade5d386-809f-42c2-80eb-a6c04c471f53)!
