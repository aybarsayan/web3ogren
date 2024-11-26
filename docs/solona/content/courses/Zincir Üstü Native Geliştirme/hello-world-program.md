---
title: Merhaba Dünya
objectives:
  - Rust modül sistemini kullanın
  - Rust'ta bir fonksiyon tanımlayın
  - Result türünü açıklayın
  - Bir Solana programının giriş noktasını açıklayın
  - Temel bir Solana programı oluşturun ve dağıtın
  - “Merhaba, dünya!” programımızı çağırmak için bir işlem gönderin
description:
  "Anchor olmadan, yerel Rust kullanarak Solana için bir onchain program oluşturun."
---

## Özet

- Yerel Solana programları, talimatları işlemek için tek bir **giriş noktası** bulunur.
- Bir program, bir talimatı işlemek için **program_id**, bir liste **accounts** ve talimatla birlikte dahil edilen **instruction_data** kullanır.

---

## Ders

:::info
Aşağıdaki kılavuz, Solana program temellerine aşina olduğunuzu varsayıyor. Değilseniz, `Onchain Programlamaya Giriş` bölümüne göz atın.
:::

Bu ders, herhangi bir çerçeve olmaksızın Rust programlama dilini kullanarak bir Solana programı yazmayı ve dağıtmayı tanıtacaktır. Bu yaklaşım, daha fazla kontrol sağlar ancak bir onchain program oluşturmanın temel işlerinin birçoğunu kendiniz halletmenizi gerektirir.

Yerel bir geliştirme ortamı kurmanın dikkat dağıtıcı unsurlarından kaçınmak için, Solana Playground adında bir tarayıcı tabanlı IDE kullanacağız.

### Rust Temelleri

"Merhaba, dünya!" programımızı oluşturmaya dalmadan önce, bazı Rust temellerini gözden geçirelim. Rust hakkında daha derin bilgi için [Rust Dil Kitabı](https://doc.rust-lang.org/book/ch00-00-introduction.html) bölümüne göz atabilirsiniz.

#### Modül Sistemi

Rust, kodu topluca "modül sistemi" olarak adlandırılan bir yapıyla organize eder. Bu yapı:

- **Modüller**: Kodları mantıksal birimlere ayırarak organizasyon, kapsam ve yol gizliliği için izole alanlar sağlar.
- **Kürekler (Crates)**: Ya bir kütüphane ya da çalıştırılabilir bir programdır. Bir kürek için kaynak kodu genellikle birden fazla modüle bölünmüştür.
- **Paketler**: Kürekler koleksiyonu ve metadata ile paketler arası bağımlılıkları belirten bir manifest dosyası içerir.

Bu derste, kürekleri ve modülleri kullanmaya odaklanacağız.

#### Yollar ve Kapsam

Kürekler, birden fazla projede paylaşılabilen modüller içerir. Bir modül içerisindeki bir öğeye erişmek istiyorsak, "yolunu" bilmemiz gerekir; bu, bir dosya sisteminde gezmeye benzer.

:::note
Kürek yapısını, kürek tabanı olan ve modüllerin dalları şeklinde düşünün; her biri potansiyel olarak alt modüller veya ek öğeler barındırabilir.
:::

Belirli bir modül veya öğeye olan yol, kürekten o modüle kadar her adımın adıyla `::` ile ayrılır.

Örneğin:

1. Temel kürek `solana_program`’dır.
2. `solana_program`, `account_info` adında bir modül içerir.
3. `account_info`, `AccountInfo` adında bir yapı içerir.

`AccountInfo`'ya giden yol `solana_program::account_info::AccountInfo` olur.

Başka bir anahtar kelime yoksa, kodunuzda `AccountInfo`'yu kullanmak için bu yolun tamamını referans almanız gerekir. Ancak, [`use`](https://doc.rust-lang.org/stable/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html) anahtar kelimesi ile bir öğeyi kapsamınıza alarak, her seferinde tam yolu belirtmeden dosya boyunca tekrar kullanabilirsiniz. Rust dosyasının en üstünde bir dizi `use` komutu görmek oldukça yaygındır.

```rust
use solana_program::account_info::AccountInfo
```

#### Rust'ta Fonksiyon Tanımlama

Rust'ta fonksiyonlar `fn` anahtar kelimesi kullanılarak tanımlanır, ardından bir fonksiyon adı ve parantez seti gelir.

```rust
fn process_instruction()
```

Fonksiyonumuza, parantez içinde değişken adlarını ve bunların karşılık gelen veri türlerini ekleyerek argümanlar ekleyebiliriz.

Rust, "statically typed" bir dildir, yani Rust'taki her değer, derleme zamanında bilinen belirli bir "veri tipi"ne sahiptir. Birden fazla türün mümkün olduğu durumlarda, değişkenlerimize bir tür açıklaması eklememiz gerekir.

Aşağıdaki örnekte, aşağıdaki argümanları gerektiren `process_instruction` adında bir fonksiyon yaratıyoruz:

- `program_id` - türü `&Pubkey` olmalıdır.
- `accounts` - türü `&[AccountInfo]` olmalıdır.
- `instruction_data` - türü `&[u8]` olmalıdır.

`process_instruction` fonksiyonunda listelenen her argümanın türünün önünde `&` olduğunu unutmayın. Rust'ta `&`, başka bir değişkene "referans" anlamına gelir; böylece onu sahiplenmeden bir değere atıfta bulunabilirsiniz. Referansın, belirli bir türde geçerli bir değere işaret etmesi garanti edilir. Rust'ta bir referans oluşturma işlemi “borrowing” olarak adlandırılır.

:::tip
Bu örnekte, `process_instruction` fonksiyonu çağrıldığında, bir kullanıcı gereksinim duyulacak argümanlar için değerleri vermelidir.
:::

`process_instruction` fonksiyonu, kullanıcı tarafından sağlanan değerleri referans alarak, her bir değerin fonksiyonda belirtilen doğru veri türü olduğunu garantiler.

Ayrıca, `&[AccountInfo]` ve `&[u8]` etrafındaki köşeli parantezleri unutmayın. Bu, `accounts` ve `instruction_data` argümanlarının sırasıyla `AccountInfo` ve `u8` türlerinin "dilimlerini" beklediğini gösterir. "Dilim", derleme zamanında bilinmeyen bir uzunluğa sahip bir diziye benzer (aynı türdeki nesnelerin bir koleksiyonu). Başka bir deyişle, `accounts` ve `instruction_data` argümanları, bilinmeyen uzunluktaki girdileri bekler.

```rust
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
)
```

Ayrıca, fonksiyonlarımızın geri değer döndürmesi için fonksiyonun dönüş türünü bir ok -> ile belirtebiliriz.

Aşağıdaki örnekte, `process_instruction` fonksiyonu artık `ProgramResult` türünde bir değer döndürecektir. Bunu bir sonraki bölümde ele alacağız.

```rust
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult
```

#### Result Enum

`Result`, başarı (`Ok`) veya başarısızlık (`Err`) gibi iki ayrı sonucu temsil eden standart bir kütüphane türüdür. Enum'lar hakkında daha fazla bilgiyi gelecekteki bir derste ele alacağız, ancak bu derste `Ok`’ı göreceksiniz, bu yüzden temel bilgileri kapsamak önemlidir.

:::warning
`Ok` veya `Err` kullanırken, bir değer belirtmelisiniz; değerin türü, kodun bağlamı tarafından belirlenir.
:::

Örneğin, dönüş değeri `Result` olan bir fonksiyon, gömülü bir dize değeri ile `Ok` veya gömülü bir tamsayı ile `Err` dönebilir. Bu örnekte, tamsayı bir hata kodu olarak kullanılabilir.

Bir dize değeri ile bir başarı durumunu döndürmek için aşağıdaki şekilde işlem yaparsınız:

```rust
Ok(String::from("Başarılı!"));
```

Bir tamsayı ile bir hata döndürmek için aşağıdaki şekilde işlem yaparsınız:

```rust
Err(404);
```

### Solana Programları

:::note
Solana ağında depolanan tüm verilerin, "hesaplar" olarak adlandırılan yapılarda yer aldığını unutmayın. Her hesabın kendine özgü bir adresi vardır; bu adres, hesap verilerine kimlik vermek ve erişmek için kullanılır.
:::

Solana programları, talimatları depolayan ve yürüten belirli bir Solana hesap türüdür.

#### Solana Program Küreği

Rust ile Solana programları yazmak için `solana_program` kütüphane küreğini kullanıyoruz. `solana_program` küreği, Solana programları için standart bir kütüphane işlevi görür. Bu standart kütüphane, Solana programlarımızı geliştirmek için kullanacağımız modülleri ve makroları içerir. Daha fazla ayrıntı için, [`solana_program` küreği belgelerine](https://docs.rs/solana-program/latest/solana_program/index.html) göz atın.

Temel bir program için, `solana_program` küreğinden aşağıdaki öğeleri kapsamımıza almanız gerekiyor:

```rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};
```

- `AccountInfo` - Hesap adresleri, sahipleri, lamport bakiyeleri, veri uzunluğu, çalıştırılabilir durum, kira dönemi ve hesabın geçerli işlemde imzalı veya yazılabilir olup olmadığını erişmemizi sağlayan bir yapıdır.
- `entrypoint` - Gelen talimatları alan ve uygun talimat işleyicisine yönlendiren bir fonksiyonu tanımlayan bir makro.
- `ProgramResult` - `entrypoint` modülünde `Result` veya `ProgramError` döndüren bir tür.
- `Pubkey` - Adreslere halka açık anahtarlar olarak erişim sağlayan bir yapıdır.
- `msg` - Program günlüğüne mesajlar basmamızı sağlayan bir makrodur.

#### Solana Program Giriş Noktası

Solana programları, program talimatlarını işlemek için tek bir giriş noktasına ihtiyaç duyar. Giriş noktası `entrypoint!` makrosu kullanılarak tanımlanır.

:::tip
Bir Solana programının giriş noktası, aşağıdaki argümanlara sahip `process_instruction` fonksiyonuna ihtiyaç duyar:
:::

- `program_id` - Programın depolandığı hesabın adresi.
- `accounts` - Talimatı işlemek için gereken hesapların listesi.
- `instruction_data` - Serileştirilmiş, talimata özgü veri.

```rust
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult;
```

Solana program hesaplarının yalnızca talimatları işlemek için mantığı depoladığını unutmayın. Bu, program hesaplarının "salt okunur" ve "durumsuz" olduğu anlamına gelir. Bir programın bir talimatı işlemek için ihtiyaç duyduğu "durum" (veri kümesi), program hesabından ayrı veri hesaplarında depolanır.

Bir talimatı işlemek için, talimat tarafından gerektiren veri hesapları programın `accounts` argümanı aracılığıyla açıkça geçirilmelidir. Ek girdiler, `instruction_data` argümanı aracılığıyla geçirilmelidir.

:::danger
Program çalıştırıldıktan sonra, program `ProgramResult` türünde bir değer döndürmelidir. Bu tür, başarı durumunun gömülü değeri `()` ve başarısızlık durumunun gömülü değeri `ProgramError` olan bir `Result`'dır. `()` boş bir değerdir ve `ProgramError`, `solana_program` küreğinde tanımlanan bir hata türüdür.
:::

...ve işte bu kadar - artık Rust kullanarak bir Solana programı oluşturmanın temellerini biliyorsunuz. Şimdi öğrendiklerimizi pratiğe dökelim!

---

## Laboratuvar

Solana Playground kullanarak bir "Merhaba, Dünya!" programı oluşturacağız. Solana Playground, Solana programlarını doğrudan tarayıcınızdan yazmanıza ve dağıtmanıza olanak tanıyan bir araçtır.

### 1. Kurulum

Öncelikle, [Solana Playground](https://beta.solpg.io/) adresini açın. İçine girdikten sonra, `lib.rs` dosyasındaki mevcut tüm kodu silin. Ardından, Playground içinde yeni bir cüzdan oluşturun.

![Gif Solana Playground Cüzdan Oluştur](../../../images/solana/public/assets/courses/unboxed/hello-world-create-wallet.gif)

### 2. Solana Program Küreği

Gerekli bileşenleri 'solana_program' küreğinden içe aktararak başlayacağız.

```rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};
```

Ardından, giriş noktamızı `entrypoint!` makrosu kullanarak ayarlayacak ve `process_instruction` fonksiyonunu tanımlayacağız. Program çağrıldığında program günlüğüne “Merhaba, dünya!” mesajını yazdırmak için `msg!` makrosunu kullanacağız.

### 3. Giriş Noktası

```rust
entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Merhaba, dünya!");

    Ok(())
}
```

:::tip
Her şeyi bir araya getirerek, eksiksiz “Merhaba, dünya!” programımız aşağıdaki gibi görünür:
:::

```rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Merhaba, dünya!");

    Ok(())
}
```

### 4. Derle ve Dağıt

Şimdi, Solana Playground'u kullanarak programımızı oluşturalım ve dağıtalım.

![Gif Solana Playground Oluştur ve Dağıt](../../../images/solana/public/assets/courses/unboxed/hello-world-build-deploy.gif)

### 5. Programı Çağır

Son olarak, programımızı istemci tarafında çağıralım. Bu dersin ana odak noktası Solana programımızı inşa etmek olduğu için, indirmek için
[“Merhaba, dünya!” programımızı çağırmak için istemci kodunu](https://github.com/solana-developers/hello-world-client) sağladık.

Bu kod, işlemi oluşturan ve gönderen bir `sayHello` yardımcı fonksiyonu içerir. `index.ts` dosyasında `programId` adında bir değişken bulacaksınız. Bunu, Solana Playground'u kullanarak dağıttığınız “Merhaba, dünya!” programının program kimliği ile güncelleyin.

```typescript
let programId = new web3.PublicKey("<YOUR_PROGRAM_ID>");
```

Program kimliğini Solana Playground'da aşağıda gösterildiği gibi bulabilirsiniz.

![Gif Solana Playground Program Kimliği](../../../images/solana/public/assets/courses/unboxed/hello-world-program-id.gif)

Sonrasında, `npm i` komutunu çalıştırarak Node modüllerini yükleyin.

Ardından, `npm start` komutunu çalıştırın. Bu komut:

1. Yeni bir anahtar çifti oluşturacak ve `.env` dosyasını mevcut değilse oluşturacaktır.
2. Bu hesaba devnet'te biraz SOL havale edecektir.
3. “Merhaba, dünya!” programını çağıracaktır.
4. Solana Explorer'da görüntüleyebileceğiniz bir işlem URL'sini çıktı olarak verecektir.

Konsoldan işlem URL'sini kopyalayın ve tarayıcınıza yapıştırın. "Merhaba, dünya!" mesajının görüntülendiğini görmek için Program Talimat Günlükleri bölümüne kaydırın.

![Ekran görüntüsü Solana Explorer Program Günlüğü](../../../images/solana/public/assets/courses/unboxed/hello-world-program-log.png)

Tebrikler! Başarıyla bir Solana programı oluşturdunuz ve dağıttınız!

---

## Meydan Okuma

Şimdi bağımsız olarak bir şey inşa etme sırası sizde. Çok basit programlarla başladığımız için, göreviniz tam olarak az önce oluşturduğumuza benzer olacak. Amaç, önceden örneklere başvurmadan kod yazmayı pratik etmektir, bu yüzden kopyalayıp yapıştırmaktan kaçının.

1. Program günlüğüne kendi özel mesajınızı yazdırmak için `msg!` makrosunu kullanan yeni bir program yazın.
2. Programınızı laboratuvarımızda yaptığımız gibi oluşturun ve dağıtın.
3. Yeni dağıttığınız programınızı çağırın ve Solana Explorer'da mesajınızın program günlüğünde basıldığını doğrulamak için kontrol edin.

:::tip
Her zamanki gibi, bu meydan okumalarla yaratıcı olmaktan çekinmeyin ve temel talimatların ötesine geçebilirsiniz — en önemlisi, eğlenin!
:::


Kodunuzu GitHub'a yükleyin ve
[bize bu ders hakkında ne düşündüğünüzü anlatın](https://form.typeform.com/to/IPH0UGz7#answers-lesson=5b56c69c-1490-46e4-850f-a7e37bbd79c2)!
