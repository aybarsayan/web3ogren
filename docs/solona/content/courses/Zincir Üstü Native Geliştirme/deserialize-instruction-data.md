---
title: Temel Bir Program Oluşturma, Bölüm 1 - Talimat Verilerini İşleme
objectives:
  - Rust'ta değişkenleri ve değişmezleri atama
  - Rust yapıları ve enum'ları oluşturma ve kullanma
  - Rust eşleşme ifadelerini kullanma
  - Rust türlerine uygulamalar ekleme
  - Talimat verilerini yerel Rust veri türlerine dönüştürme
  - Farklı talimat türleri için farklı program mantığını yürütme
  - Solana'da akıllı sözleşmenin yapısını açıklama
description:
  "Yerel programların farklı işlevler için talimatları nasıl ayırt ettiğini öğrenin."
---

## Özet

- Çoğu program **birden fazla ayrık talimat işleyicisini** destekler (bazen sadece 'talimatlar' olarak adlandırılır) - bunlar programınızdaki işlevlerdir.
- Rust **enum'ları**, her talimat işleyicisini temsil etmek için sıklıkla kullanılır.
- Rust yapıları için Borsh serileştirme ve serileştirme işlevselliği sağlamak için `borsh` kütüphanesini ve `derive` niteliğini kullanabilirsiniz.
- Rust `eşleşme` ifadeleri, sağlanan talimata dayalı koşullu kod yolları oluşturmanıza yardımcı olur.

## Ders

:::tip
Bir Solana programının temel öğelerinden biri, talimat verilerini işleme mantığıdır.
:::

Çoğu program, talimat işleyicileri olarak da adlandırılan birden fazla işlevi destekler. Örneğin, bir programın yeni bir veri parçası oluşturma ile aynı veri parçasını silme için farklı talimat işleyicileri olabilir. Programlar, hangi talimat işleyicisinin yürütüleceğini belirlemek için talimat verilerindeki farklılıkları kullanır.

Talimat verileri, programınızın giriş noktasına bir byte dizisi olarak sağlandığından, kodunuz boyunca talimatları daha kullanılabilir bir biçimde temsil eden bir Rust veri türü oluşturmak yaygındır. Bu ders, böyle bir tür oluşturmanıza, talimat verilerini bu biçime ayrıştırmanıza ve programın giriş noktasına geçirilen talimata dayanarak uygun talimat işleyicisini çalıştırmanıza rehberlik edecektir.

### Rust Temelleri

Temel bir Solana programının ayrıntılarına dalmadan önce, bu derste kullanılacak Rust temellerini kapsayalım.

#### Değişkenler

Rust'ta değişken atamaları `let` anahtar kelimesi kullanılarak yapılır.

```rust
let age = 33;
```

Varsayılan olarak, Rust'taki değişkenler değişmezdir, yani bir kez ayarlandığında değerleri değiştirilemez. Daha sonra değiştirilebilecek bir değişken oluşturmak için `mut` anahtar kelimesini kullanın. Bu anahtar kelime ile bir değişken tanımlamak, saklanan değerinin değişmesine izin verir.

```rust
// Derleyici bir hata verecektir
let age = 33;
age = 34;

// Bu izinlidir
let mut mutable_age = 33;
mutable_age = 34;
```

Rust derleyici, değişmez değişkenlerin değişmesini sağladığından, bunu kendiniz takip etmeniz gerekmez. Bu, kodunuzu anlamayı kolaylaştırır ve hata ayıklamayı basitleştirir.

#### Yapılar

Bir yapı (yapı kısaltması) anlamlı bir grup oluşturan birden fazla ilgili değeri bir arada paketlemenizi ve adlandırmanızı sağlayan özel bir veri türüdür. Bir yapıda her veri parçası farklı türlerde olabilir ve her birinin kendine ait bir adı vardır. Bu veri parçalarına alan denir ve diğer dillerdeki özelliklere benzer şekilde davranır.

```rust
struct User {
    active: bool,
    email: String,
    age: u64
}
```

Bir yapıyı tanımladıktan sonra kullanmak için, her alan için somut değerler belirterek bir yapı örneği oluşturun.

```rust
let mut user1 = User {
    active: true,
    email: String::from("test@test.com"),
    age: 36
};
```

Bir yapıdan belirli bir değeri almak veya ayarlamak için nokta notasyonunu kullanın.

```rust
user1.age = 37;
```

:::note
Derinlemesine bir anlayış için [struct örneklerine](https://doc.rust-lang.org/rust-by-example/custom_types/structs.html) göz atabilirsiniz.
:::

#### Enumerasyonlar

Enumerasyonlar (veya Enum'lar), bir türü, olası varyantlarını sıralayarak tanımlamanıza olanak tanıyan bir veri yapısıdır. Bir enum örneği şu şekilde görünebilir:

```rust
enum LightStatus {
    On,
    Off
}
```

Bu örnekte `LightStatus` enum'u iki olası varyant içerir: `On` veya `Off`.

Ayrıca bir yapının alanları eklemek gibi enum varyantlarına değerler de dahil edebilirsiniz.

```rust
enum LightStatus {
    On {
        color: String
    },
    Off
}

let light_status = LightStatus::On { color: String::from("red") };
```

Bu örnekte, bir değişkeni `LightStatus`'un `On` varyantına ayarlamak için `color` değerinin de ayarlanması gereklidir. Rust'ta enum'ları kullanmaya dair daha fazla örnek için [burası Rust by Example sayfasına göz atabilirsiniz](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html).

#### Eşleşme İfadeleri

Eşleşme ifadeleri, diğer dillerdeki `switch` ifadelerine çok benzer. [`eşleşme`](https://doc.rust-lang.org/rust-by-example/flow_control/match.html) ifadesi, bir değeri bir dizi desenle karşılaştırmanıza ve ardından desenin değeriyle eşleşip eşleşmediğine bağlı olarak kod yürütmenize olanak tanır. Desenler, sabit değerler, değişken adları, joker karakterler ve daha fazlasından oluşabilir. Eşleşme ifadesi tüm olası senaryoları içermelidir; aksi takdirde kod derlenmez.

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25
    }
}
```

#### Uygulamalar

[`impl`](https://doc.rust-lang.org/rust-by-example/trait/impl_trait.html) anahtar kelimesi, Rust'ta bir türün uygulamalarını tanımlamak için kullanılır. Fonksiyonlar ve sabitler, bir uygulama içinde tanımlanabilir.

```rust
struct Example {
    number: i32
}

impl Example {
    fn boo() {
        println!("boo! Example::boo() çağrıldı!");
    }

    fn answer(&mut self) {
        self.number += 42;
    }

    fn get_number(&self) -> i32 {
        self.number
    }
}
```

Buradaki `boo` fonksiyonu, türün kendisi üzerinde çağrılabilir, tür örneğinde değil:

```rust
Example::boo();
```

Bu arada `answer`, `Example`'ın değiştirilebilir bir örneğini gerektirir ve nokta sözdizimi ile çağrılabilir:

```rust
let mut example = Example { number: 3 };
example.answer();
```

#### Özellikler ve Nitelikler

Bu aşamada kendi özelliklerinizi veya niteliklerinizi oluşturmayacaksınız, bu nedenle detaylı bir açıklama gerekli değildir. Ancak `derive` nitelik makrosunu ve `borsh` kütüphanesi tarafından sağlanan bazı özellikleri kullanacaksınız, bu nedenle her birine yüksek seviyede bir anlayışa sahip olmak önemlidir.

[Özellikler](https://doc.rust-lang.org/rust-by-example/trait.html), türlerin uygulayabileceği bir soyut arayüzü tanımlar. Bir özellik `bark()` fonksiyonunu tanımlıyorsa ve bir tür bu özelliği benimserse, tür `bark()` fonksiyonunu uygulamalıdır.

[Nitelikler](https://doc.rust-lang.org/rust-by-example/attribute.html), bir tür için meta veriler ekler ve birçok farklı amaç için kullanılabilir.

Bir türün üzerine [`derive` niteliğini](https://doc.rust-lang.org/rust-by-example/trait/derive.html) eklediğinizde ve bir veya daha fazla desteklenen özellik sağladığınızda, kodun altında otomatik olarak o tür için bu özellikleri uygulamak üzere kod üretilir. Yakında bunu somut bir örnek ile sağlayacağız.

### Talimatları Rust Veri Türü Olarak Temsil Etmek

Rust temellerini kapsadıktan sonra, bunları Solana programlarına uygulayalım.

Genellikle, programlar birden fazla talimat işleyicisine sahip olacaktır. Örneğin, not alma uygulamasının arka ucu olarak işlev gören bir programınız olabilir. Bu programın yeni bir not oluşturma, mevcut bir notu güncelleme ve mevcut bir notu silme talimatlarını kabul ettiğini varsayın.

Talimatlar ayrık türlere sahip olduğundan, genellikle bir enum veri türü için mükemmel bir uyum sağlar.

```rust
enum NoteInstruction {
    CreateNote {
        title: String,
        body: String,
        id: u64
    },
    UpdateNote {
        title: String,
        body: String,
        id: u64
    },
    DeleteNote {
        id: u64
    }
}
```

`NoteInstruction` enum'un her varyantının, programın bir not oluşturma, güncelleme ve silme görevlerini yerine getirirken kullanacağı yerleşik verilerle geldiğine dikkat edin.

### Talimat Verilerini Ayrıştırma

Talimat verileri programa bir byte dizisi olarak iletildiğinden, bu diziyi talimat enum türünün bir örneğine belirli bir şekilde dönüştürmeniz gerekir.

Önceki birimlerde, istemci tarafında serileştirme ve ayrıştırma için Borsh kullandık. Borsh'u program tarafında kullanmak için `borsh` kütüphanesini kullanıyoruz. Bu kütüphane, `BorshDeserialize` ve `BorshSerialize` için özellikler sağlar ve bu özellikleri `derive` niteliği kullanarak türlerinize uygulayabilirsiniz.

Talimat verilerini ayrıştırmayı basit hale getirmek için, verileri temsil eden bir yapı oluşturabilir ve bu yapıya `BorshDeserialize` özelliğini uygulamak için `derive` niteliğini kullanabilirsiniz. Bu, `BorshDeserialize` içinde tanımlanan, talimat verilerini ayrıştırırken kullanacağımız `try_from_slice` metodunu uygular.

Unutmayın, yapı kendisi byte dizisindeki verilerin yapısına eşleşmelidir.

```rust
#[derive(BorshDeserialize)]
struct NoteInstructionPayload {
    id: u64,
    title: String,
    body: String
}
```

:::info
Bu yapı oluşturulduğunda, talimat enum'unuz için talimat verilerini ayrıştırmaya ilişkin mantığı işlemek üzere bir uygulama oluşturabilirsiniz. Bu genellikle `unpack` adında bir fonksiyon içinde yapılır; bu fonksiyon, talimat verisini bir argüman olarak alır ve ayrıştırılmış verilerle enum'un uygun örneğini döndürür.
:::

Programınızı, ilk byte'ın (veya başka bir sabit sayıda byte'ın) çalıştırılması gereken talimat işleyicisine bir kimlik olarak bekleyecek şekilde yapılandırmak standart bir uygulamadır. Bu, bir tam sayı veya bir dize kimliği olabilir. Bu örnek için ilk byte'ı kullanıp 0, 1 ve 2'yi sırasıyla oluşturma, güncelleme ve silme talimat işleyicilerine eşleyeceğiz.

```rust
impl NoteInstruction {
    // Gelen tamponu ilişkili Talimata ayır
    // Giriş için beklenen format, Borsh ile serileştirilmiş bir vektördür
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // İlk byte'ı yürütülecek talimat işleyici belirlemek için varyant olarak alın
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        // Geçici yük yapı kullanarak ayrıştırma işlemi
        let payload = NoteInstructionPayload::try_from_slice(rest)
            .map_err(|_| ProgramError::InvalidInstructionData)?;
        // Varyant ile eşleşerek hangi veri yapısının beklenildiğini belirleyin ve TestStruct veya hata döndürün
        match variant {
            0 => Ok(Self::CreateNote {
                title: payload.title,
                body: payload.body,
                id: payload.id,
            }),
            1 => Ok(Self::UpdateNote {
                title: payload.title,
                body: payload.body,
                id: payload.id,
            }),
            2 => Ok(Self::DeleteNote { id: payload.id }),
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
```

:::warning
Bu örnekte çok şey var, bu nedenle adım adım ilerleyelim:
:::

1. Bu fonksiyon, `input` parametresi üzerinde `split_first` fonksiyonunu kullanarak bir demet döndürerek başlar. İlk öğe olan `variant`, byte dizisinden ilk byte ve ikinci öğe olan `rest`, byte dizisinin geri kalanıdır.
2. Fonksiyon, `NoteInstructionPayload` üzerinde `try_from_slice` metodunu kullanarak byte dizisinin geri kalanını `NoteInstructionPayload` örneği olan `payload`'a ayrıştırır.
3. Son olarak, fonksiyon `variant` üzerinde bir `match` ifadesi kullanarak uygun enum örneğini `payload`'dan bilgi alarak oluşturur ve döndürür. Her geçerli varyant (0, 1, 2), belirli bir NoteInstruction varyantına karşılık gelirken, başka bir değer bir hataya yol açar.


Hata İşleme Yöntemleri

Bu işlevde henüz açıklamadığımız Rust sözdizimi var. `ok_or`, `map_err` ve `?` operatörleri hata işleme için kullanılır:

- [`ok_or`](https://doc.rust-lang.org/std/option/enum.Option.html#method.ok_or):
  Bir `Option`'ı `Result`'a dönüştürür. Eğer `Option` `None` ise, sağlanan hatayı döndürür. Aksi takdirde, `Some` değerini `Ok` olarak döndürür.

- [`map_err`](https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err):
  Bir `Result`'ın hatasını, hataya bir işlev uygulayarak dönüştürür. `Ok` değerini değiştirmeden bırakır.

- [`?` operatörü](https://doc.rust-lang.org/rust-by-example/error/result/enter_question_mark.html):
  Bir `Result` veya `Option`'ı açar. Eğer `Ok` veya `Some` ise, değeri döndürür. Eğer `Err` veya `None` ise, hatayı çağıran fonksiyona yayar.


### Program Mantığı

Talimat verilerini özel bir Rust türüne ayrıştırma yöntemine sahip olduğunuzda, programınızdaki talimatın giriş noktasına dayanarak farklı kod yollarını yürütmek için uygun kontrol akışını kullanabilirsiniz.

```rust
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Not programı giriş noktası");
    // Talimat verilerini ayrıştırmak için unpack'i çağır
    let instruction = NoteInstruction::unpack(instruction_data)?;
    // Döndürülen veri yapısını beklediğinizle eşleştirin
    match instruction {
        NoteInstruction::CreateNote { title, body, id } => {
             msg!("Talimat: Not Oluştur");
            // Not oluşturmak için program kodunu çalıştır
        },
        NoteInstruction::UpdateNote { title, body, id } => {
            msg!("Talimat: Not Güncelle");
            // Not güncellemek için program kodunu çalıştır
        },
        NoteInstruction::DeleteNote { id } => {
            msg!("Talimat: Not Sil");
            // Not silmek için program kodunu çalıştır
        }
    }
}
```

Bir veya iki talimat içeren basit programlar için, mantığı `match` ifadesinin içinde koymak yeterli olabilir. Ancak birçok talimat içeren programlar için, her talimat işleyicisi için mantığı ayrı bir fonksiyona yazmak ve `match` ifadesi içinde çağırmak tavsiye edilir.

### Program Dosya Yapısı

:::info
`Merhaba Dünya dersi`, tek bir dosyaya sığacak kadar basit bir programı gösterdi. Program karmaşıklığı arttıkça, okunabilir ve genişletilebilir bir proje yapısını korumak önemli hale gelir. Bu, kodu fonksiyonlara ve veri yapısına kapsüle etmeyi ve ilgili kodları ayrı dosyalara gruplamayı içerir.
:::

Örneğin, talimat tanımı ve ayrıştırma kodu, giriş noktasından ayrı bir dosyada yer almalıdır. Bu yaklaşım, bir giriş noktası için bir dosya ve bir talimat işleyicisi için başka bir dosya oluşturabilir.

- **lib.rs**
- **instruction.rs**

Programınızı birden fazla dosyaya bölerken, tüm dosyaları genellikle `lib.rs` içinde merkezi bir konumda kaydettirin. Her dosya bu şekilde kaydedilmelidir.

```rust filename="lib.rs"
// lib.rs içinde
pub mod instruction;
```

Ayrıca diğer dosyalardaki `use` ifadeleri için tanımlamaların kullanılabilir hale gelmesi için `pub` anahtar kelimesini kullanın.

```rust
pub enum NoteInstruction { ... }
```

## Laboratuvar

Bu dersin laboratuvarında, Modül 1'den Movie Review programının ilk yarısını oluşturacaksınız, talimat verilerini ayrıştırmaya odaklanarak. Sonraki ders, kalan uygulamayı kapsayacaktır.

### 1. Giriş noktası

[Solana Playground](https://beta.solpg.io/) kullanarak, mevcut `lib.rs` dosyasındaki her şeyi temizleyin. Ardından aşağıdaki kütüphaneleri getirin ve programın giriş noktasını giriş noktası makrosunu kullanarak tanımlayın.

```rust filename="lib.rs"
use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    account_info::AccountInfo,
};

// Giriş noktası, process_instruction fonksiyonu çağrısıdır
entrypoint!(process_instruction);

// lib.rs içinde
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    Ok(())
}
```

:::tip
Bu adımı tamamladığınızda, programınızın giriş noktasını başarıyla tanımlamış olacaksınız.
:::

#### 2. Talimat verilerini ayrıştırma

Desteklediğiniz talimatları tanımlayın ve bir ayrıştırma fonksiyonu uygulayın. `instruction.rs` adında yeni bir dosya oluşturun ve `BorshDeserialize` ve `ProgramError` için `use` ifadelerini ekleyin ve `title`, `rating` ve `description` değerlerini içeren bir `AddMovieReview` varyantına sahip bir `MovieInstruction` enum'u oluşturun.

```rust filename="instruction.rs"
use borsh::{BorshDeserialize};
use solana_program::program_error::ProgramError;

pub enum MovieInstruction {
    AddMovieReview {
        title: String,
        rating: u8,
        description: String
    }
}
```

Ardından, ayrıştırma için bir ara tür olarak bir `MovieReviewPayload` yapısını tanımlayın. `BorshDeserialize` özelliği için varsayılan uygulamayı sağlamak üzere derive niteliği makrosunu kullanın.

```rust
#[derive(BorshDeserialize)]
struct MovieReviewPayload {
    title: String,
    rating: u8,
    description: String
}
```

Son olarak, `MovieInstruction` enum'unu uygulayarak, bir byte dizisini alıp `Result` türü döndüren bir `unpack` fonksiyonu tanımlayın. Bu fonksiyon:

1. Diziden ilk baytı `split_first` kullanarak ayırmalıdır.
2. Kalan diziyi bir `MovieReviewPayload` örneğine ayrıştırmalıdır.
3. İlk byte 0 ise `MovieInstruction`'ın `AddMovieReview` varyantını döndürmek üzere bir `match` ifadesi kullanmalı, aksi takdirde bir program hatası döndürmelidir.

```rust
impl MovieInstruction {
    // Gelen tamponu ilişkili Talimata ayır
    // Giriş için beklenen format, Borsh ile serileştirilmiş bir vektördür
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
         // Giriş boş olmadığından emin olun ve ilk byte'ı (talimat varyantı) ayır
        let (&variant, rest) = input.split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        // Kalan girişi bir MovieReviewPayload'a ayrıştırmayı deneyin
        let payload = MovieReviewPayload::try_from_slice(rest)
            .map_err(|_| ProgramError::InvalidInstructionData)?;
        // Talimat varyantında eşleşerek uygun MovieInstruction'u oluşturun
        match variant {
            0 => Ok(Self::AddMovieReview {
                title: payload.title,
                rating: payload.rating,
                description: payload.description,
            }),
            // Varyant hiçbir tanınmış talimatla eşleşmiyorsa hata döndürün
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}

#### 3. Program mantığı

Talimatların serileştirilmesi ayarlandığında program mantığını işlemek için `lib.rs` dosyasına geri dönün. `lib.rs` dosyasında `instruction.rs` dosyasını kaydedin ve `MovieInstruction` türünü kapsama alın.

```rust
pub mod instruction;
use instruction::{MovieInstruction};
```

Sonra, `program_id`, `accounts`, `title`, `rating` ve `description` argümanlarını alan bir `add_movie_review` fonksiyonu tanımlayın ve `ProgramResult` döndürün. Şimdilik, bu değerleri kaydedin, ve fonksiyonun uygulanışına bir sonraki derste geri döneceğiz.

```rust
pub fn add_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {

    // Geçilen talimat verilerini kaydediyoruz
    msg!("Film incelemesi ekleniyor...");
    msg!("Başlık: {}", title);
    msg!("Derecelendirme: {}", rating);
    msg!("Açıklama: {}", description);

    Ok(())
}
```

Son olarak, `process_instruction` içinden `add_movie_review` çağrısını yapın, talimatı `unpack` yöntemini kullanarak açın ve talimatın `AddMovieReview` varyantı olduğundan emin olmak için bir `match` ifadesi kullanın.

```rust
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    // Açma çağrıldı
    let instruction = MovieInstruction::unpack(instruction_data)?;
    // `instruction` değişkenine dönen veri yapısıyla eşleştirin
    match instruction {
        MovieInstruction::AddMovieReview { title, rating, description } => {
            // `add_move_review` fonksiyonunu çağırıyoruz
            add_movie_review(program_id, accounts, title, rating, description)
        }
    }
}
```

Bununla, programınız bir işlem gönderildiğinde talimat verilerini kaydetmelidir. Programınızı son derste olduğu gibi Solana Playground'dan oluşturun ve dağıtın. Farklı bir adres olmasını isterseniz, dağıtmadan önce yeni bir program ID'si oluşturabilirsiniz.

:::tip
**Önemli Not:** Program ID'niz değişmediyse, aynı ID'ye dağıtılacaktır.
:::

Doğru talimat verileri ile bir işlem göndererek programınızı test edebilirsiniz. Bunun için, 
[bunifu script](https://github.com/solana-developers/movie-review-program-client) veya
[ön yüz](https://github.com/solana-developers/movie-review-frontend) kullanabilirsiniz. Her iki durumda da, uygun alana program ID'nizi kopyaladığınızdan ve test ettiğiniz programın doğru olduğundan emin olun.

:::warning
**Dikkat:** Bu adımları atlamamak önemli, aksi takdirde testleriniz başarısız olabilir.
:::

İlerlemeye geçmeden önce bu laboratuvarla ilgili zaman ayırın ve takılırsanız [çözüm kodu](https://beta.solpg.io/62aa9ba3b5e36a8f6716d45b) ile referans alabilirsiniz.

## Zorluk

Bu derse yönelik zorluk için Modül 1'den Öğrenci Tanıtım programını çoğaltın. Program, bir kullanıcının adını ve kısa bir mesajı `instruction_data` olarak alır ve verileri zincirde depolamak için bir hesap oluşturur.

Öğrendiklerinizi kullanarak, çağrıldığında `name` ve `message` değerlerini program loglarına yazdıracak şekilde Öğrenci Tanıtım programını oluşturun.

Programınızı, 
`Serialize Custom Instruction Data dersinde` oluşturduğumuz
[ön yüzü](https://github.com/solana-developers/student-intro-frontend/tree/solution-serialize-instruction-data) oluşturarak test edebilir ve Solana Explorer'daki program loglarını kontrol edebilirsiniz. Ön yüz kodundaki program ID'sini dağıttığınız program ID'si ile değiştirin.


<summary><strong>İpuçları ve Tavsiyeler</strong></summary>

Bunu bağımsız olarak yapmaya çalışın! Ama eğer takılırsanız [çözüm kodunu](https://beta.solpg.io/62b0ce53f6273245aca4f5b0) referans alabilirsiniz.



<Callout type="success" title="Laboratuvarı tamamladınız mı?">

Kodunuzu GitHub'a itiniz ve 
[bize bu derste ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=74a157dc-01a7-4b08-9a5f-27aa51a4346c)!
</Callout>