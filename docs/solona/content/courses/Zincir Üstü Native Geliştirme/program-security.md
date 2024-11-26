---
title: Temel Bir Program Oluşturma, Bölüm 3 - Temel Güvenlik ve Doğrulama
objectives:
  - "Solana programlarını güvence altına almanın neden 'bir saldırgan gibi düşünmek' gerektiğini anlayın."
  - "Programınızı korumak için temel güvenlik uygulamalarını öğrenin ve uygulayın."
  - "Hesap sahipliğini ve işlem geçerliliğini doğrulamak için sahip ve imzacı kontrolleri gerçekleştirin."
  - "Yazılımınıza geçirilen hesapları doğrulayarak beklediğiniz gibi olup olmadıklarını kontrol edin."
  - "Programınızın saldırıya uğramasını engellemek için geçersiz veya kötü niyetli girişleri önlemek için temel veri doğrulaması gerçekleştirin."
description:
  "Sahiplik, imzacı ve hesap doğrulama kontrolleri ile Solana programınızı nasıl güvence altına alacağınızı öğrenin."
---

## Özet

- **Bir saldırgan gibi düşünmek**, zihniyetinizi potansiyel güvenlik açıklarını proaktif olarak tanımlamak için "Bunu nasıl kırarım?" sorusunu sorarak değiştirmekle ilgilidir.
- **Sahiplik kontrolleri**, bir hesabın beklenen kamu anahtarı tarafından kontrol edildiğini doğrular, örneğin bir PDA'nın (Program Türetilmiş Adres) program tarafından sahiplenilip sahiplenilmediğini kontrol ederek.
- **İmzacı kontrolleri**, işlemi imzalamış olan doğru tarafları doğrular ve hesaplarda güvenli değişiklikler yapmalarını sağlar.
- **Hesap doğrulaması**, programınıza geçirilen hesapların beklentilerinize göre olup olmadığını sağlamak için kullanılır; bu, bir PDA'nın türetme doğruluğunu kontrol etmek gibidir.
- **Veri doğrulaması**, programınıza sağlanan talimat verisinin belirli kurallara veya kısıtlamalara uyduğunu doğrular; böylece beklenmeyen davranışa neden olmaz.

## Ders

Önceki derslerde
`deserialize instruction data`
ve
`program state management`
film inceleme programı oluşturduk ve çalışma başlangıcını sağlamak heyecan vericiydi, ancak güvenli geliştirme "çalışıyor" ile bitmez. Potansiyel arıza noktalarını anlamak ve programınızı hem istemeden yapılan hatalardan hem de kasıtlı istismar durumlarından korumak için proaktif adımlar atmak kritik önem taşır.

:::warning
Unutmayın, **programınızın dağıtıldığında iletilecek işlemler üzerinde kontrolünüz yoktur**. Sadece programınızın bunları nasıl yönettiğini kontrol edebilirsiniz.
:::

Bu ders program güvenliğinin kapsamlı bir incelemesi olmaktan uzak, bazı temel tuzakları ele alacağız.

### Bir Saldırgan Gibi Düşünün

Güvenli yazılım geliştirmede temel bir ilke, "saldırgan zihniyetini" benimsemektir. Bu, herhangi birinin programınızı kırabileceği veya istismar edebileceği her olası açıyı düşünmek anlamına gelir.

> Breakpoint 2021'de sundukları sunumda,
> [Neodyme](https://workshop.neodyme.io/) güvenli program geliştirmeyi sadece bir şeyin ne zaman kırıldığını tanımlamakla kalmayıp, onun nasıl kırılabileceğini keşfetmekle ilgilidir. "Bunu nasıl kırarım?" diyerek, sadece beklenen işlevselliği test etmekten uygulamanın zayıf noktalarını açığa çıkarmaya geçersiniz.
> — Neodyme

Tüm programlar, karmaşıklığı ne olursa olsun, istismar edilebilir. Amaç kesin güvenliği sağlamak değildir (bu imkansızdır); kötü niyetli aktörlerin zayıf noktaları istismar etmesini mümkün olduğunca zorlaştırmaktır. Bu zihniyeti benimsediğinizde, programınızın güvenliğindeki açıkları tanımlamak ve kapatmak konusunda daha iyi bir şekilde hazırlıklı olursunuz.

#### Tüm Programlar Kırılabilir

Her programın zayıf noktaları vardır. Sorun, onun kırılıp kırılmayacağı değil, ne kadar çaba gerektirdiğidir. Geliştiriciler olarak amacımız, mümkün olduğunca çok güvenlik açığını kapatmak ve kodumuzu kırmak için gereken çabayı artırmaktır. Örneğin, film inceleme programımız incelemeleri saklamak için hesaplar oluşturuyorsa, bir saldırgan gibi düşünerek yakalanabilecek istemeden meydana gelen davranışlar olabilir. Bu derste bu sorunları ve bunları nasıl ele alacağımızı inceleyeceğiz.

### Hata Yönetimi

Birkaç yaygın güvenlik tuzağına dalmadan önce, programınızda hataları nasıl kullanacağınızı bilmek önemlidir. Solana programlarındaki güvenlik sorunları genellikle anlamlı bir hata ile çalışmanın sonlandırılmasını gerektirir. Tüm hatalar yıkıcı değildir, ancak bazıları programın durdurulması ve daha ileri işleme devam edilmesine engel olmak için uygun bir hata kodu dönmesi gerekir.

#### Özel Hatalar Oluşturma

Solana'nın
[`solana_program`](https://docs.rs/solana-program/latest/solana_program/) kutusu, hata yönetimi için genel bir
[`ProgramError`](https://docs.rs/solana-program/latest/solana_program/program_error/enum.ProgramError.html)
enum'u sunar. Ancak, özel hatalar daha fazla ayrıntılı, bağlama özgü bilgi sağlayarak hata ayıklama ve test sırasında yardımcı olur.

Kullanmak istediğimiz hataları listeleyen bir enum türü oluşturarak kendi hatalarımızı tanımlayabiliriz. Örneğin, `NoteError` içinde `Forbidden` ve `InvalidLength` varyantları bulunmaktadır. Enum, `thiserror` kütüphanesinin `Error` trait'ini uygulamak için `derive` attribute macro'sunu kullanarak bir Rust `Error` türüne dönüştürülmüştür. Her hata türünün kendi `#[error("...")]` notasyonu da vardır. Bu, her bir hata türü için hata mesajı sağlamanızı mümkün kılar.

Programınızda özel hataları nasıl tanımlayabileceğinize dair bir örnek:

```rust
use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum NoteError {
    #[error("Yetkisiz erişim - Bu notu siz sahiplenmiyorsunuz.")]
    Forbidden,

    #[error("Geçersiz nota uzunluğu - Metin izin verilen sınırı aşıyor.")]
    InvalidLength,
}
```

Bu örnekte, yetkisiz erişim ve geçersiz veri girişi gibi hatalar için özel hatalar oluşturuyoruz (örneğin, nota uzunluğu). Özel hataları tanımlamak, hata ayıklama veya yürütme sırasında neyin yanlış gittiğini açıklamak için daha fazla esneklik sağlar.

#### Hataları Döndürme

Derleyici, program tarafından dönen hataların `solana_program` kutusundan `ProgramError` türünde olmasını bekler. Bu, özel hatamızı bu türde dönüştüreceği bir yolumuz yoksa, onu döndüremeyeceğimiz anlamına gelir. Aşağıdaki uygulama, özel hatamız ile `ProgramError` türü arasında dönüşümü ele alır.

```rust
impl From<NoteError> for ProgramError {
    fn from(e: NoteError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
```

Programdan özel hatayı döndürmek için, basitçe hatayı `ProgramError` örneğine dönüştürmek için `into()` yöntemini kullanın.

```rust
if pda != *note_pda.key {
    return Err(NoteError::Forbidden.into());
}
```

Bu, programın hataları nazik bir şekilde ele almasını ve sorunlar meydana geldiğinde anlamlı geri bildirim sağlamasını garanti eder.

### Temel Güvenlik Kontrolleri

Solana programınızın yaygın güvenlik açıklarına karşı dayanıklı olmasını sağlamak için önemli güvenlik kontrollerini eklemelisiniz. Bu, geçersiz hesapları veya yetkisiz işlemleri tespit etmek ve istenmeyen davranışları önlemek için kritik öneme sahiptir.

#### Sahiplik Kontrolleri

Bir sahiplik kontrolü, bir hesabın beklenen program tarafından sahiplenildiğini doğrular. Örneğin, programınız PDA'lara (Program Türetilmiş Adresler) bağlıysa, bu PDA'ların programınız tarafından kontrol edildiğinden ve dış bir taraf tarafından değil olduğundan emin olmak istersiniz.

Önceki derslerde referans verdiğimiz not alma uygulaması örneğini kullanalım
`deserialize instruction data`
ve
`program state management`.
Bu uygulamada, kullanıcılar program tarafından PDA hesaplarında saklanan notları oluşturabilir, güncelleyebilir ve silebilir.

:::tip
Bir kullanıcı `update` talimat işleyicisini çağırdığında, ayrıca bir `pda_account` sağlar. Sağlanan `pda_account`'ın güncellemek istedikleri belirli nota ait olduğunu varsayıyoruz, ancak kullanıcı istedikleri herhangi bir talimat verisini girebilir. Aynı zamanda, nota hesabının veri formatına uyan ama not alma programı tarafından oluşturulmayan veriler gönderebilirler. Bu güvenlik açığı, kötü niyetli bir kodun sisteme sızması için bir yol olabilir.
:::

Bu sorunun en basit yolu, bir hesabın sahibiğin beklediğiniz kamu anahtarı olup olmadığını her zaman kontrol etmektir. Bu durumda, not hesabının programın kendisi tarafından sahiplenilen bir PDA hesabı olmasını bekliyoruz. Bu durum gerçekleşmediğinde, durumu uygun bir hata olarak rapor edebiliriz.

Bir hesabın program tarafından sahiplenilip sahiplenilmediğini doğrulamak için nasıl bir sahiplik kontrolü yapabileceğinizi gösterelim:

```rust
if note_pda.owner != program_id {
    return Err(ProgramError::InvalidNoteAccount);
}
```

Bu örnekte, `note_pda`nın programın kendisi (program_id ile belirtildiği gibi) tarafından sahiplenilip sahiplenilmediğini kontrol ediyoruz. Bu tür sahiplik kontrolleri, yetkisiz varlıkların kritik hesaplarla oynamasını önler.

:::note
PDAlar genellikle bir programın durumunun güvenilir depoları olarak kabul edilir. Doğru programın PDAlara sahip olduğundan emin olmak, kötü niyetli davranışları önlemenin temel bir yoludur.
:::

#### İmzacı Kontrolleri

İmzacı kontrolleri, işlemin doğru taraflar tarafından imzalandığını doğrular. Not alma uygulamasında, örneğin, yalnızca nota yaratıcısının notu güncelleyebileceğini doğrulamak istiyoruz. Bu kontrol olmadan, herhangi biri başka bir kullanıcının notasını kendi kamu anahtarını geçirerek değiştirmeye çalışabilir.

```rust
if !initializer.is_signer {
    msg!("Gerekli imza eksik");
    return Err(ProgramError::MissingRequiredSignature)
}
```

Başlatıcının işlemi imzaladığını doğrulayarak, yalnızca hesabın meşru sahibi tarafından eylemlerinin yapılmasını sağlarız.

#### Hesap Doğrulaması

Hesap doğrulaması, programa geçirilen hesapların doğru ve geçerli olduğunu kontrol eder. Bu genellikle, bilinen tohumlar (PDAlar için) kullanılarak beklenen hesabın türetilmesi ve bu hesabın geçirilen hesap ile karşılaştırılması yoluyla yapılır.

Örneğin, not alma uygulamasında, beklenen PDA'yı yaratıcının kamu anahtarı ve not ID'sini kullanarak türetebilir ve ardından sağlanan hesabın buna uymasını doğrulayabilirsiniz:

```rust
let (expected_pda, bump_seed) = Pubkey::find_program_address(
    &[
        note_creator.key.as_ref(),
        id.as_bytes().as_ref(),
    ],
    program_id
);

if expected_pda != *note_pda.key {
    msg!("PDA için geçersiz tohumlar");
    return Err(ProgramError::InvalidArgument)
}
```

Bu kontrol, kullanıcının yanlış bir PDA veya başkasına ait bir PDA geçmesini önler. PDA'nın türetilmesini doğrulayarak, programın doğru hesap üzerinde işlem yaptığını sağlamış olursunuz.

### Veri Doğrulaması

Veri doğrulaması, programınıza sağlanan girişin beklenen kriterlere uyduğunu sağlar. Bu, yanlış veya kötü niyetli verilerin programın öngörülemeyen bir şekilde davranmasını önlemek için kritik öneme sahiptir.

Örneğin, programınız kullanıcıların bir karakterin genişleme niteliklerine puan tahsis etmelerine olanak tanıyorsa, her nitelikten maksimum izin verilen bir değer vardır. Herhangi bir güncelleme yapmadan önce, yeni tahsisatın tanımlı limiti aşmadığından emin olmalısınız:

```rust
if character.agility + new_agility > 100 {
    msg!("Nitelik puanları 100'ü geçemez");
    return Err(AttributeError::TooHigh.into())
}
```

Benzer şekilde, kullanıcının izin verilen puan sayısını aşmadığını kontrol etmelisiniz:

```rust
if attribute_allowance < new_agility {
    msg!("İzin verilen miktardan fazla puan tahsis etmeye çalışıyorsunuz");
    return Err(AttributeError::ExceedsAllowance.into())
}
```

Bu doğrulamaları uygulamazsanız, program beklenmeyen bir duruma girebilir veya kötü niyetli aktörler tarafından istismar edilebilir, bu potansiyel olarak mali kayıplara veya tutarsız davranışlara yol açabilir.

Örneğin, bu örneklerde bahsedilen karakterin bir NFT olduğunu düşünün. Ayrıca, programın NFT'nin nitelik puanlarının sayısına orantılı olarak token ödülleri kazanmak için stake edilmesini sağlayabileceğini düşünün. Bu veri doğrulama kontrollerinin uygulanmaması, kötü niyetli bir aktörün aşırı yüksek bir nitelik puanı atamasına ve hızlıca hazineyi tüm ödüllerle boşaltmasına izin verebilir; bu ödüller aslında daha büyük bir staker havuzunda daha eşit bir şekilde dağıtılmak üzere tasarlanmıştır.

#### Tam Sayı Aşımı ve Altında Kalma

Rust'ta (ve Solana programlarında) tam sayılarla çalışırken meydana gelen yaygın tuzaklardan biri, tam sayı aşımı ve altında kalmayı yönetmektir. Rust tam sayıları sabit boyutlara sahiptir ve yalnızca belirli bir aralıkta değer tutabilir. Bir değer bu aralığı aştığında, döngü yaparak beklenmeyen sonuçlar doğurur.

Örneğin, `u8` (0 ile 255 arasında değer tutar) ile 255'e 1 eklemek, 0 değerine (aşım) yol açar. Bunu önlemek için,
[`checked_add()`](https://doc.rust-lang.org/std/primitive.u8.html#method.checked_add)
ve 
[`checked_sub()`](https://doc.rust-lang.org/std/primitive.u8.html#method.checked_sub) gibi kontrol edilen matematik fonksiyonlarını kullanmalısınız:

Tam sayı aşımını ve altında kalmayı önlemek için ya:

1. Aşım veya altında kalmanın _olamayacağından_ emin olacak bir mantık oluşturun veya
2. `+` yerine `checked_add()` gibi kontrol edilen matematiği kullanın

   ```rust
   let first_int: u8 = 5;
   let second_int: u8 = 255;
   let sum = first_int.checked_add(second_int)
    .ok_or(ProgramError::ArithmeticOverflow)?;
   ```

---

## Laboratuvar

Bu laboratuvarda, kullanıcıların PDA hesaplarında film incelemeleri saklamasına olanak tanıyan Film İnceleme programına yöneleceğiz. Önceki derslerdeki
`deserialize instruction data`
ve
`program state management`
konularını tamamlamadıysanız endişelenmeyin - bu kılavuz kendi başına yeterlidir.

Film İnceleme programı, kullanıcıların PDA hesaplarında incelemeler eklemesine ve güncellemesine olanak tanır. Önceki derslerde, incelemeleri eklemeye yönelik temel işlevselliği uyguladık. Şimdi, güvenli bir biçimde güncelleme özelliğini ekleyeceğiz. Programımızı yazmak, derlemek ve dağıtmak için [Solana Playground](https://beta.solpg.io/) kullanacağız.

### 1. Başlangıç Kodunu Alın

Başlamak için
[film inceleme başlangıç kodunu](https://beta.solpg.io/62b552f3f6273245aca4f5c9) bulabilirsiniz. Film İnceleme laboratuvarlarını takip ettiyseniz, programımızı yeniden yapılandırdığımızı göreceksiniz.

Yeniden yapılandırılan başlangıç kodu, öncekilerle hemen hemen aynı. `lib.rs` oldukça büyük ve yönetilemez hale geldiğinden, kodunu 3 dosyaya ayırdık: `lib.rs`, `entrypoint.rs` ve `processor.rs`. `lib.rs` artık sadece kodun modüllerini kaydediyor, `entrypoint.rs` yalnızca programın giriş noktasını tanımlıyor ve ayarlıyor ve `processor.rs`, talimatları işlemek için program mantığını ele alıyor. Ayrıca, özel hataları tanımlayacağımız bir `error.rs` dosyası ekledik. Tam dosya yapısı şu şekildedir:

- **lib.rs** - modülleri kaydedin
- **entrypoint.rs -** programın giriş noktası
- **instruction.rs -** talimat verisini serileştirmek ve serileştirmek
- **processor.rs -** talimatları işlemek için program mantığı
- **state.rs -** durumu serileştirmek ve serileştirmek
- **error.rs -** özel program hataları

Dosya yapısındaki bazı değişikliklerin yanı sıra, bu laboratuvarın güvenliğe odaklanmasını artıracak bir miktar kodu da güncelledik.

Film incelemelerini güncellemeye olanak tanıyacağımızdan, `add_movie_review()` fonksiyonundaki `account_len` değerini de değiştirdik (artık `processor.rs` içerisinde). İncelemenin boyutunu hesaplamak ve hesap uzunluğunu yalnızca ihtiyaç duyduğu kadar büyük bir şekilde ayarlamak yerine, her inceleme hesabı için basitçe 1000 bayt ayıracağız. Böylelikle, bir kullanıcı film incelemesini güncellediğinde boyutunu yeniden tahsis etme veya kirasını yeniden hesaplama konusunda endişelenmemize gerek kalmaz.

Bunu şu şekilde değiştirdik:

```rust
let account_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());
```

Bunu şu hale getirdik:

```rust
let account_len: usize = 1000;
```

:::info
[realloc](https://docs.rs/solana-sdk/latest/solana_sdk/account_info/struct.AccountInfo.html#method.realloc) yöntemi, Solana Labs tarafından yakın zamanda etkinleştirildi ve hesaplarınızın boyutunu dinamik bir şekilde değiştirmeyi mümkün kılar. Bu laboratuvar için bu yöntemi kullanmayacağız, ancak bunun farkında olmak önemlidir.
:::

Son olarak, `state.rs` içinde `MovieAccountState` yapımız için `impl` anahtar kelimesini kullanarak bazı ek işlevsellikler de uyguladık.

Film incelememiz için, bir hesabın daha önce başlatılıp başlatılmadığını kontrol etme yeteneğine ihtiyacımız var. Bunu `MovieAccountState` yapısındaki `is_initialized` alanını kontrol eden bir `is_initialized` fonksiyonu oluşturarak yapıyoruz.

`Sealed`, Solana'nın Rust'ın `Sized` trait'inin bir versiyonudur. Bu, yalnızca `MovieAccountState`'in bilinen bir boyutu olduğunu ve bazı derleyici optimizasyonları sağladığını belirtir.

```rust filename="state.rs"
impl Sealed for MovieAccountState {}

impl IsInitialized for MovieAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
```

Devam etmeden önce, programın mevcut durumu hakkında sağlam bir anlayışınız olduğundan emin olun. Kodu gözden geçirin ve zorlayıcı bulduğunuz herhangi bir nokta üzerinde düşünmek için biraz zaman ayırın. Başlangıç kodunu önceki dersin [çözüm kodu](https://beta.solpg.io/62b23597f6273245aca4f5b4) ile karşılaştırmak faydalı olabilir.

### 2. Özel Hatalar

Önceden başlatılmamış hesaplar, geçersiz PDA eşleşmeleri, veri limitlerinin aşılması ve geçersiz derecelendirmeler (derecelendirmeler 1 ile 5 arasında olmalıdır) gibi durumları ele almak için özel hatalar tanımlayacağız. Bu hatalar, `error.rs` dosyasına eklenecektir:

Başlangıç kodu, boş bir  `error.rs` dosyası içerir. O dosyayı açın ve yukarıdaki her bir durum için hataları ekleyin.

```rust filename="error.rs"
use solana_program::{program_error::ProgramError};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ReviewError{
    // Hata 0
    #[error("Hesap henüz başlatılmadı")]
    UninitializedAccount,
    // Hata 1
    #[error("Türetilen PDA, geçirilen PDA ile eşleşmiyor")]
    InvalidPDA,
    // Hata 2
    #[error("Giriş verisi maksimum uzunluğu aşıyor")]
    InvalidDataLength,
    // Hata 3
    #[error("Derecelendirme 5'ten büyük veya 1'den küçük")]
    InvalidRating,
}

impl From<ReviewError> for ProgramError {
    fn from(e: ReviewError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
```

Hata durumlarını eklemenin yanı sıra, gerektiğinde hatayı `ProgramError` türüne dönüştürmemizi sağlayan bir uygulama eklediğimizi unutmayın.

Hataları ekledikten sonra, bunları kullanmak için `processor.rs` içinde `ReviewError`'ı içe aktarın.

```rust filename="processor.rs"
use crate::error::ReviewError;
```

### 3. add_movie_review'e Güvenlik Kontrolleri Ekleyin

Artık kullanmak için hatalarımız olduğuna göre, `add_movie_review` fonksiyonuna bazı güvenlik kontrolleri uygulayalım.

#### İmzacı Kontrolü

İlk yapmamız gereken şey, bir incelemenin `initializer`'ının aynı zamanda işlemde bir imzacı olduğunu garanti etmektir. Bu, film incelemeleri gönderirken başka birinin kimliğine bürünemeyeceğinizi sağlar. Bu kontrolü, hesapları döngüye alırken hemen ekleyeceğiz.

```rust filename="processor.rs"
let account_info_iter = &mut accounts.iter();

let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;

if !initializer.is_signer {
    msg!("Gerekli imza eksik");
    return Err(ProgramError::MissingRequiredSignature)
}
```

#### Hesap Doğrulaması

Sonra, kullanıcının geçtiği `pda_account`'ın beklediğimiz `pda` olduğunu doğrulayalım. Hatırlayın ki, bir film incelemesi için `initializer` ve `title` anahtarları ile `pda`yı türetmiştik. Talimatlarımız içinde, `pda`yı yeniden türeteceğiz ve ardından bunun `pda_account` ile eşleşip eşleşmediğini kontrol edeceğiz. Adresler eşleşmiyorsa, özel `InvalidPDA` hatamızı döndüreceğiz.

```rust filename="processor.rs"
// PDA'yı türetin ve kullanıcıdan gelenle eşleşip eşleşmediğini kontrol edin
let (pda, _bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), account_data.title.as_bytes().as_ref(),], program_id);

if pda != *pda_account.key {
    msg!("PDA için geçersiz tohumlar");
    return Err(ReviewError::InvalidPDA.into())
}
``` 

#### Veri doğrulama

Şimdi bazı veri doğrulama işlemleri yapalım.

Öncelikle `rating`'in 1 ile 5 arasında olup olmadığını kontrol edeceğiz. Kullanıcı tarafından sağlanan rating bu aralıkta değilse, özel `InvalidRating` hatamızı döndüreceğiz.

```rust filename="processor.rs"
if rating > 5 || rating < 1 {
    msg!("Rating cannot be higher than 5");
    return Err(ReviewError::InvalidRating.into())
}
```

:::tip
**Not:** Değerlendirme, sistemin doğru çalışması için önemli bir unsurdur.
:::

Sonraki adımda, inceleme içeriğinin, hesabımız için tahsis ettiğimiz 1000 baytı aşmadığından emin olalım. Boyut 1000 baytı aşarsa, özel `InvalidDataLength` hatamızı döndüreceğiz.

```rust filename="processor.rs"
let total_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());
if total_len > 1000 {
    msg!("Data length is larger than 1000 bytes");
    return Err(ReviewError::InvalidDataLength.into())
}
```

:::info
**Önemli Bilgi:** Veri boyut kontrolü, sistem kaynaklarının verimli kullanılmasını sağlar.
:::

Son olarak, hesabın önceden başlatılıp başlatılmadığını kontrol etmek için `MovieAccountState` için uyguladığımız `is_initialized` fonksiyonunu çağıracağız. Hesap zaten mevcutsa, o zaman bir hata döndüreceğiz.

```rust filename="processor.rs"
if account_data.is_initialized() {
    msg!("Account already initialized");
    return Err(ProgramError::AccountAlreadyInitialized);
}
```

Toplu olarak, `add_movie_review()` fonksiyonu aşağıdaki gibi görünmelidir:

```rust filename="processor.rs"
pub fn add_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {
    msg!("Adding movie review...");
    msg!("Title: {}", title);
    msg!("Rating: {}", rating);
    msg!("Description: {}", description);

    let account_info_iter = &mut accounts.iter();

    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    if !initializer.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature)
    }

    let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), title.as_bytes().as_ref(),], program_id);
    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ProgramError::InvalidArgument)
    }

    if rating > 5 || rating < 1 {
        msg!("Rating cannot be higher than 5");
        return Err(ReviewError::InvalidRating.into())
    }

    let total_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());
    if total_len > 1000 {
        msg!("Data length is larger than 1000 bytes");
        return Err(ReviewError::InvalidDataLength.into())
    }

    let account_len: usize = 1000;

    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);

    invoke_signed(
        &system_instruction::create_account(
        initializer.key,
        pda_account.key,
        rent_lamports,
        account_len.try_into().unwrap(),
        program_id,
        ),
        &[initializer.clone(), pda_account.clone(), system_program.clone()],
        &[&[initializer.key.as_ref(), title.as_bytes().as_ref(), &[bump_seed]]],
    )?;

    msg!("PDA created: {}", pda);

    msg!("unpacking state account");
    let mut account_data = try_from_slice_unchecked::<MovieAccountState>(&pda_account.data.borrow()).unwrap();
    msg!("borrowed account data");

    msg!("checking if movie account is already initialized");
    if account_data.is_initialized() {
        msg!("Account already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    account_data.title = title;
    account_data.rating = rating;
    account_data.description = description;
    account_data.is_initialized = true;

    msg!("serializing account");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    msg!("state account serialized");

    Ok(())
}
```

---

### 4. Film İncelemesi Güncellemelerini MovieInstruction'da Destekle

Sonraki adımda, `instruction.rs` dosyasını güncelleyerek film incelemelerini güncelleme desteği ekleyeceğiz. `MovieInstruction` içinde yeni bir `UpdateMovieReview()` varyantı tanıtacağız:

```rust filename="instruction.rs"
pub enum MovieInstruction {
    AddMovieReview {
        title: String,
        rating: u8,
        description: String
    },
    UpdateMovieReview {
        title: String,
        rating: u8,
        description: String
    }
}
```

Payload yapısı aynı kalabilir çünkü varyant türü dışında, talimat verileri `AddMovieReview()` için kullandığımızla aynıdır.

Ayrıca `UpdateMovieReview()` için `unpack()` fonksiyonunu güncelleyeceğiz.

```rust filename="instruction.rs"
// Inside instruction.rs
impl MovieInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
        Ok(match variant {
            0 => Self::AddMovieReview {
                title: payload.title,
                rating: payload.rating,
                description: payload.description },
            1 => Self::UpdateMovieReview {
                title: payload.title,
                rating: payload.rating,
                description: payload.description },
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}
```

### 5. update_movie_review Fonksiyonunu Tanımlayın

Artık `instruction_data`'yı ayıklayıp, programın hangi talimatını çalıştıracağımızı belirleyebildiğimize göre, `processor.rs` dosyasındaki `process_instruction()` fonksiyonundaki match ifadesine `UpdateMovieReview()` ekleyebiliriz.

```rust filename="processor.rs"
// Inside processor.rs
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    // Unpack instruction data
    let instruction = MovieInstruction::unpack(instruction_data)?;
    match instruction {
        MovieInstruction::AddMovieReview { title, rating, description } => {
            add_movie_review(program_id, accounts, title, rating, description)
        },
        // Add UpdateMovieReview to match against our new data structure
        MovieInstruction::UpdateMovieReview { title, rating, description } => {
            // Make call to update function that we'll define next
            update_movie_review(program_id, accounts, title, rating, description)
        }
    }
}
```

Sonraki adımda yeni `update_movie_review()` fonksiyonunu tanımlayabiliriz. Tanım, `add_movie_review` tanımıyla aynı parametreleri içermelidir.

```rust filename="processor.rs"
pub fn update_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {

}
```

### 6. update_movie_review Fonksiyonunu Uygulayın

Artık bir film incelemesini güncellemek için mantığı doldurmak kaldı. Öncelikle güvenli bir şekilde başlamalıyız.

`tadd_movie_review()` fonksiyonu gibi, hesapları döngüleyerek başlayalım. Gerekli olan tek hesap `initializer` ve `pda_account`'dır.

```rust filename="processor.rs"
pub fn update_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {
    msg!("Updating movie review...");

    // Get Account iterator
    let account_info_iter = &mut accounts.iter();

    // Get accounts
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;

}
```

#### Mülkiyet Kontrolü

Devam etmeden önce, `pda_account`'ı doğrulayacak bazı temel güvenlik kontrolleri uygulayalım. Bu, `pda_account`'ın programımız tarafından sahiplenilip sahiplenilmediğini doğrulamak için yapılır. Eğer sahip değilse, `InvalidOwner` hatasını döndüreceğiz.

```rust filename="processor.rs"
if pda_account.owner != program_id {
    return Err(ProgramError::InvalidOwner)
}
```

#### İmza Kontrolü

Bir sonraki adımda, `initializer`'ın güncelleme talimatına da imza atıp atmadığını kontrol ediyoruz. Bir film incelemesi verisini güncellediğimiz için, incelemeye yapılan değişikliklerin onaylandığından emin olmak istiyoruz. Eğer `initializer` bu işlemi imzalamadıysa, bir hata döndürmeyi planlıyoruz.

```rust filename="processor.rs"
if !initializer.is_signer {
    msg!("Missing required signature");
    return Err(ProgramError::MissingRequiredSignature)
}
```

#### Hesap Doğrulaması

Son olarak, kullanıcı tarafından sağlanan `pda_account`'ın, `initializer` ve `title` kullanılarak türettiğimiz PDA ile eşleştiğinin kontrolünü yapalım. Eğer adresler eşleşmiyorsa, özel `InvalidPDA` hatamızı döndüreceğiz. Bunu `add_movie_review()` fonksiyonunda yaptığımız gibi uygulayacağız.

```rust filename="processor.rs"
// Derive PDA and check that it matches client
let (pda, _bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), account_data.title.as_bytes().as_ref(),], program_id);

if pda != *pda_account.key {
    msg!("Invalid seeds for PDA");
    return Err(ReviewError::InvalidPDA.into())
}
```

#### pda_account'ı Ayıklama ve Veri Doğrulaması Yapma

Artık kodumuz, geçen hesapların güvenilir olduğunu sağladıktan sonra, `pda_account`'ı ayıklama ve bazı veri doğrulamaları yapma zamanı geldi. Öncelikle `pda_account`'ı ayıklayarak onu değişken `account_data`'ya atayalım.

```rust filename="processor.rs"
msg!("unpacking state account");
let mut account_data = try_from_slice_unchecked::<MovieAccountState>(&pda_account.data.borrow()).unwrap();
msg!("borrowed account data");
```

Artık hesaba ve alanlarına erişimimiz olduğuna göre, ilk yapmamız gereken şey hesabın önceden başlatılıp başlatılmadığını kontrol etmek. Başlatılmamış bir hesap güncellenemez, bu nedenle programımız özel `UninitializedAccount` hatasını döndürmelidir.

```rust
if !account_data.is_initialized() {
    msg!("Account is not initialized");
    return Err(ReviewError::UninitializedAccount.into());
}
```

Sonraki adımda `rating`, `title` ve `description` verilerini doğrulamamız gerek; bu işlem `add_movie_review()` fonksiyonunda yaptığımız gibi olmalıdır. `rating`'i 1 ile 5 arasında kısıtlamalı ve inceleme boyutunu 1000 bayttan az tutmalıyız. Kullanıcı tarafından sağlanan rating bu aralıkta değilse, özel `InvalidRating` hatamızı döndüreceğiz. İnceleme çok uzunsa, özel `InvalidDataLength` hatamızı döndüreceğiz.

```rust filename="processor.rs"
if rating > 5 || rating < 1 {
    msg!("Rating cannot be higher than 5");
    return Err(ReviewError::InvalidRating.into())
}

let total_len: usize = 1 + 1 + (4 + account_data.title.len()) + (4 + description.len());
if total_len > 1000 {
    msg!("Data length is larger than 1000 bytes");
    return Err(ReviewError::InvalidDataLength.into())
}
```

#### Film inceleme hesabını güncelleme

Artık tüm güvenlik kontrollerini uyguladığımıza göre, film inceleme hesabını güncelleyebiliriz. `account_data`'yı güncelleyerek ve yeniden serileştirerek işlemi tamamlayabiliriz. Bu aşamada programımızdan `Ok` döndürebiliriz.

```rust filename="processor.rs"
account_data.rating = rating;
account_data.description = description;

account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

Ok(())
```

Tüm olarak, `update_movie_review()` fonksiyonu aşağıdaki gibi görünmelidir. Hata ayıklamada netlik sağlamak için ek kayıtlar da ekledik.

```rust filename="processor.rs"
pub fn update_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {
    msg!("Updating movie review...");

    let account_info_iter = &mut accounts.iter();

    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;

    if pda_account.owner != program_id {
      return Err(ProgramError::IllegalOwner)
    }

    if !initializer.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature)
    }

    msg!("unpacking state account");
    let mut account_data = try_from_slice_unchecked::<MovieAccountState>(&pda_account.data.borrow()).unwrap();
    msg!("review title: {}", account_data.title);

    let (pda, _bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), account_data.title.as_bytes().as_ref(),], program_id);
    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ReviewError::InvalidPDA.into())
    }

    msg!("checking if movie account is initialized");
    if !account_data.is_initialized() {
        msg!("Account is not initialized");
        return Err(ReviewError::UninitializedAccount.into());
    }

    if rating > 5 || rating < 1 {
        msg!("Invalid Rating");
        return Err(ReviewError::InvalidRating.into())
    }

    let update_len: usize = 1 + 1 + (4 + description.len()) + account_data.title.len();
    if update_len > 1000 {
        msg!("Data length is larger than 1000 bytes");
        return Err(ReviewError::InvalidDataLength.into())
    }

    msg!("Review before update:");
    msg!("Title: {}", account_data.title);
    msg!("Rating: {}", account_data.rating);
    msg!("Description: {}", account_data.description);

    account_data.rating = rating;
    account_data.description = description;

    msg!("Review after update:");
    msg!("Title: {}", account_data.title);
    msg!("Rating: {}", account_data.rating);
    msg!("Description: {}", account_data.description);

    msg!("serializing account");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    msg!("state account serialized");

    Ok(())
}
```

### 7. Derleyin ve yükseltin

Programımızı derlemek ve yükseltmek için hazırız! Doğru talimat verileriyle bir işlem göndererek programınızı test edebilirsiniz. Bunun için bu [frontend](https://github.com/solana-developers/movie-frontend/tree/solution-update-reviews) kullanabilirsiniz. Doğru programı test ettiğinizden emin olmak için `Form.tsx` ve `MovieCoordinator.ts` dosyalarında `MOVIE_REVIEW_PROGRAM_ID`'yi program ID'niz ile değiştirmeniz gerektiğini unutmayın.

:::warning
**Uyarı:** Programınızın doğru çalıştığından emin olunmadan canlıya geçiş yapmayın.
:::

Bu projeyle ilgili bu kavramlara rahat hissetmek için daha fazla zaman almanız gerekiyorsa, [çözüm koduna](https://beta.solpg.io/62c8c6dbf6273245aca4f5e7) göz atabilirsiniz.

## Görev

Artık önceki derslerde kullandığınız Öğrenci Tanıtım programı üzerine inşa ederek bağımsız bir şey oluşturma sırası sizde. Eğer birlikte devam etmediyseniz veya kodunuzu kaydetmediyseniz, [bu başlangıç kodunu](https://beta.solpg.io/62b11ce4f6273245aca4f5b2) kullanabilirsiniz.

Öğrenci Tanıtım programı, öğrencilerin kendilerini tanıttığı bir Solana Programıdır. Program, kullanıcıdan bir isim ve kısa bir mesaj alır ve verileri on-chain depolamak için bir hesap oluşturur.

:::note
**İlginç:** Proje, programcıların kullanıcı veri yönetimini öğrenmelerine yardımcı olmaktadır.
:::

Bu derste öğrendiklerinizi kullanarak Öğrenci Tanıtım Programına uygulamayı deneyin. Program:

1. Öğrencilerin mesajlarını güncelleyebileceği bir talimat ekle
2. Bu derste öğrendiğimiz temel güvenlik kontrollerini uygula

Mümkünse bağımsız bir şekilde bunu yapmaya çalışın! Ama takılırsanız, [çözüm koduna](https://beta.solpg.io/62c9120df6273245aca4f5e8) başvurabilirsiniz. Uygulamanız ve yazdığınız hatalara bağlı olarak kodunuz çözüm kodundan biraz farklı görünebilir.



Kodunuzu GitHub'a yükleyin ve
[bize bu derse dair düşüncelerinizi iletin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=3dfb98cc-7ba9-463d-8065-7bdb1c841d43)!
