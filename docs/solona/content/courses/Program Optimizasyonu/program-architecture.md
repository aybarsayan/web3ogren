---
title: Program Mimarisi
objectives:
  - Büyük verilerle onchain çalışmak için Box ve Zero Copy kullanın
  - Daha iyi PDA tasarım kararları verin
  - Programlarınızı geleceğe dönük hale getirin
  - Eş zamanlılık sorunlarıyla başa çıkın
description: "Solana programlarınızı verimli bir şekilde tasarlayın."
---

## Özeti

- Verilerinizin hesapları Stack için çok büyükse, bunları Heap'e tahsis etmek için `Box` içinde sarın.
- `Box` için çok büyük olan hesaplarla (10MB'den küçük) başa çıkmak için Zero-Copy kullanın.
- Hesapta alanların boyutu ve sırası önemlidir; değişken uzunlukta alanları sona koyun.
- Solana paralel işlem yapabilir; ancak yine de darboğazlarla karşılaşabilirsiniz. Programla etkileşimde bulunan tüm kullanıcıların yazması gereken "paylaşılan" hesaplara dikkat edin.

---

## Ders

Program Mimarisi, hobi sahibi ile profesyoneli birbirinden ayıran unsurdur. Performanslı programlar hazırlamak, koddan çok sistem **tasarımı** ile ilgilidir. Ve siz, tasarımcı olarak şunları düşünmelisiniz:

> "Kodunuzun ne yapması gerektiği yargısını yapın."  
> **— Program Mimarisi Eğitimi**

1. Kodunuzun ne yapması gerektiği
2. Olası uygulamaların neler olduğu
3. Farklı uygulamalar arasındaki ticaretlerin neler olduğu

Bu sorular, bir blok zinciri geliştirirken daha da önemlidir. Sadece kaynaklar, tipik bir hesaplama ortamından daha sınırlıdır; aynı zamanda insanların varlıklarıyla da başa çıkıyorsunuz.

Varlık yönetimi tartışmasının çoğunu  
` güvenlik kursu dersi` ile bırakacağız,  
ancak Solana geliştirmedeki kaynak sınırlamaların doğasını belirtmek önemlidir. Elbette, tipik bir geliştirme ortamında sınırlamalar vardır; ancak bir blok zinciri ve Solana geliştirme ile ilgili olarak hesapta ne kadar veri depolanabileceği, bu verileri depolamanın maliyeti ve bir işlem başına ne kadar hesaplama birimi mevcut olduğu gibi sınırlamalar da vardır. Program tasarımcısı olarak, uygun, hızlı, güvenli ve işlevsel programlar oluşturmak için bu sınırlamalara dikkat etmelisiniz. Bugün, Solana programları oluştururken dikkate alınması gereken daha gelişmiş konulara dalacağız.

---

### Büyük Hesaplarla Baş Etmek

Modern uygulama programlamasında, kullandığımız veri yapılarının boyutunu düşünmemiz pek gerekmez. Bir dize yapmak mı istiyorsunuz? İstediğinizde suistimali önlemek için 4000 karakter sınırı koyabilirsiniz; ancak bu muhtemelen bir sorun değildir. Bir tamsayı mı istiyorsunuz? Genellikle convenience için 32-bit'tir.

Yüksek seviyeli dillerde, veri bol. Şimdi, Solana alanında, depolanan her byte için (kira) gelir ve heap, stack ve hesap boyutları üzerinde sınırlamalarımız var. Baytlarımızla biraz daha kurnaz olmamız gerekiyor. Bu bölümde bakacağımız iki ana endişe var:

1. Byte başına ödeme yaptığımız için, genel olarak ayak izimizi mümkün olduğunca küçük tutmak istiyoruz. Optimizasyonu bir başka bölümde daha ayrıntılı olarak inceleyeceğiz; ancak burada veri boyutları kavramına giriş yapacağız.

2. Daha büyük verilerle çalışırken, [Stack](https://solana.com/docs/programs/faq#stack) ve [Heap](https://solana.com/docs/programs/faq#heap-size) kısıtlamalarıyla karşılaşacağız - bunlardan kaçınmak için Box ve Zero-Copy kullanmayı düşüneceğiz.

---

#### Boyutlar

Solana'da bir işlemin ücret ödeyeni, onchain depolanan her byte için ödeme yapar. Buna [kira](https://solana.com/docs/core/fees#rent) denir.


Not: Kira, biraz yanıltıcı bir terimdir...

Kira, biraz yanıltıcı bir terimdir çünkü asla kalıcı olarak alınmaz. Hesaba kira yatırdığınızda, o veri orada sonsuza kadar kalabilir veya hesabı kapattığınızda kira geri alınabilir. Önceleri, kira, geleneksel kira gibi aralıklarla ödeniyordu; ancak şimdi kira muafiyeti için zorunlu minimum bakiye bulunmaktadır. Bununla ilgili daha fazla bilgiyi [Solana belgelerinde](https://solana.com/docs/core/fees#rent-exempt) okuyabilirsiniz.


Blockchain'e veri koymak maliyetli olabilir; bu nedenle NFT nitelikleri ve ilişkili dosyalar gibi offchain depolanmaktadır. Amaç, programınızın yüksek işlevselliğini sağlamak ile kullanıcıların onchain'de veri depolamanın maliyetinden cesaretlerinin kırılmaması arasında bir denge kurmaktır.

Programınızdaki alanı optimize etmenin ilk adımı, yapılarınızdaki boyutları anlamaktır. Aşağıda [Anchor Book](https://book.anchor-lang.com/anchor_references/space.html) dan yararlı bir referans bulunmaktadır.



| Türler      | Byte cinsinden alan             | Detaylar/Örnek                                                                                  |
| ----------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| bool        | 1                              | sadece 1 bite ihtiyaç duyar, yine de 1 byte kullanır                                            |
| u8/i8       | 1                              |                                                                                                |
| u16/i16     | 2                              |                                                                                                |
| u32/i32     | 4                              |                                                                                                |
| u64/i64     | 8                              |                                                                                                |
| u128/i128   | 16                             |                                                                                                |
| [T;amount]  | space(T) * amount             | örn. space([u16;32]) = 2 * 32 = 64                                                             |
| Pubkey      | 32                             |                                                                                                |
| Vec\    | 4 + (space(T) * amount)       | Hesap boyutu sabit olduğundan hesap başlangıçta yeterli alanla başlatılmalıdır                 |
| String      | 4 + string uzunluğu (byte cinsinden) | Hesap boyutu sabit olduğundan hesap başlangıçta yeterli alanla başlatılmalıdır                 |
| Option\ | 1 + (space(T))                |                                                                                                |
| Enum        | 1 + En büyük varyant boyutu   | örn. Enum { A, B { val: u8 }, C { val: u16 } } -> 1 + space(u16) = 3                          |
| f32         | 4                              | NaN için serileştirme başarısız olacaktır                                                       |
| f64         | 8                              | NaN için serileştirme başarısız olacaktır                                                       |

Bunları bildiğinize göre, programda alabileceğiniz küçük optimizasyonlar hakkında düşünmeye başlayın. Örneğin, yalnızca 100'e ulaşacak bir tamsayı alanınız varsa, bir u64/i64 kullanmayın; bir u8 kullanın. Neden? Çünkü bir u64, 8 byte yer kaplayarak 2^64 veya 1.84 * 10^19 maksimum değerine sahiptir. Bunun alan israfı, çünkü yalnızca 100'e kadar sayıları karşılamak için yeterlidir. Tek bir byte, 255 maksimum değerini verir ki, bu durumda yeterli olacaktır. Benzer şekilde, asla negatif sayı almayacaksanız, i8 kullanmanın bir anlamı yoktur.

Ancak küçük sayı türleri ile dikkatli olun. Aksi takdirde, taşma nedeniyle beklenmedik davranışlarla karşılaşabilirsiniz. Örneğin, sürekli artırılan bir u8 türü 255'e ulaşır ve 256 yerine 0'a döner. Daha iyi bir gerçek dünya bağlamı için  
**[Y2K hatası](https://www.nationalgeographic.org/encyclopedia/Y2K-bug/#:~:text=As%20the%20year%202000%20approached%2C%20computer%20programmers%20realized%20that%20computers,would%20be%20damaged%20or%20flawed.)** 'na bakın.

Anchor boyutları hakkında daha fazla okumak istiyorsanız, [Sec3'ün blog yazısına](https://www.sec3.dev/blog/all-about-anchor-account-size) göz atın.

---

#### Box

Artık veri boyutları hakkında biraz şey bildiğinize göre, büyük veri hesaplarıyla baş etmek için karşılaşacağınız bir soruna bakalım. Şöyle bir veri hesabınız olduğunu varsayalım:

```rust
#[account]
pub struct SomeBigDataStruct {
    pub big_data: [u8; 5000],
}

#[derive(Accounts)]
pub struct SomeFunctionContext<'info> {
    pub some_big_data: Account<'info, SomeBigDataStruct>,
}
```

Eğer `SomeFunctionContext` bağlamında `SomeBigDataStruct`'i bir fonksiyona geçirmeye çalışırsanız, şu derleyici uyarısıyla karşılaşacaksınız:

`// Stack offset of XXXX exceeded max offset of 4096 by XXXX bytes, please minimize large stack variables`

Ve programı çalıştırmayı denerseniz, sadece bekleyecek ve başarısız olacaktır.

Neden böyle?

Bu, Stack ile ilgilidir. Solana'da bir fonksiyonu her çağırdığınızda, 4KB'lik bir stack çerçevesi alır. Bu, yerel değişkenler için statik bellek tahsisidir. Burada tüm `SomeBigDataStruct` bellekte saklanır ve 5000 byte veya 5KB, 4KB limitinden büyük olduğu için bir stack hatası meydana gelir. Peki bunu nasıl çözeriz?

Cevap, 
[**`Box`**](https://docs.rs/anchor-lang/latest/anchor_lang/accounts/boxed/index.html) tipidir!

```rust
#[account]
pub struct SomeBigDataStruct {
    pub big_data: [u8; 5000],
}

#[derive(Accounts)]
pub struct SomeFunctionContext<'info> {
    pub some_big_data: Box<Account<'info, SomeBigDataStruct>>, // <- Box eklendi!
}
```

Anchor'da, **`Box<T>`** hesabı Stack yerine Heap'e tahsis etmek için kullanılır. Bu harika çünkü Heap bize çalışmak için 32KB verir. En güzel kısım, fonksiyon içinde hiçbir şey farklı yapmanız gerekmiyor. Yapmanız gereken tek şey, tüm büyük veri hesaplarınızın etrafına `Box` eklemektir.

> "Ancak Box mükemmel değildir. Yeterince büyük hesaplarla stack'i aşabilirsiniz."  
> **— Program Mimarisi Eğitimi**

Bunu bir sonraki bölümde nasıl çözebileceğimizi öğreneceğiz.

---

#### Zero Copy

Tamam, şimdi `Box` kullanarak orta büyüklükte hesaplarla baş edebilirsiniz. Ama ya 10MB'lik maksimum boyutta gerçekten büyük hesaplar kullanmanız gerektiğinde? Aşağıdaki örneğe bakın:

```rust
#[account]
pub struct SomeReallyBigDataStruct {
    pub really_big_data: [u128; 1024], // 16,384 byte
}
```

Bu hesap, içine bir `Box` sarılmış olsa bile programınızın başarısız olmasına neden olacaktır. Bunun üstesinden gelmek için `zero_copy` ve `AccountLoader` kullanabilirsiniz. Hesap yapınıza `zero_copy` ekleyin, hesap doğrulama yapınızda `zero`'yu kısıtlama olarak ekleyin ve hesap türünü doğrulama yapısında bir `AccountLoader` içinde sarmalayın.

```rust
#[account(zero_copy)]
pub struct SomeReallyBigDataStruct {
    pub really_big_data: [u128; 1024], // 16,384 byte
}

pub struct ConceptZeroCopy<'info> {
    #[account(zero)]
    pub some_really_big_data: AccountLoader<'info, SomeReallyBigDataStruct>,
}
```

**Not**: Eğer daha eski bir Anchor sürümü ` [`zero_copy`] daha verimli olmanın yanı sıra, en belirgin yararı, maksimum stack veya heap boyutundan daha büyük hesap türlerini tanımlama yeteneğidir. 

Temelde, programınız asla zero-copy hesap verilerini stack veya heap'e yüklemez. Bunun yerine, ham veriye işaretçi erişimi alır. `AccountLoader`, bunun kodunuzdan hesapla etkileşim şekliniz hakkında çok fazla şeyin değişmediğinden emin olur.

`zero_copy` kullanırken bazı caveat'lar vardır. İlk olarak, hesap doğrulama yapınızda `init` kısıtlamasını kullanamazsınız; bu, 10KB'den büyük hesaplarla ilgili CPI sınırlaması nedeniyle olur.

```rust
pub struct ConceptZeroCopy<'info> {
    #[account(zero, init)] // <- Bunu yapamazsınız
    pub some_really_big_data: AccountLoader<'info, SomeReallyBigDataStruct>,
}
```

Bunun yerine, istemciniz ayrı bir talimatla büyük bir hesap oluşturmalı ve kirasını ödemelidir.

```typescript
const accountSize = 16_384 + 8;
const ix = anchor.web3.SystemProgram.createAccount({
  fromPubkey: wallet.publicKey,
  newAccountPubkey: someReallyBigData.publicKey,
  lamports:
    await program.provider.connection.getMinimumBalanceForRentExemption(
      accountSize,
    ),
  space: accountSize,
  programId: program.programId,
});

const txHash = await program.methods
  .conceptZeroCopy()
  .accounts({
    owner: wallet.publicKey,
    someReallyBigData: someReallyBigData.publicKey,
  })
  .signers([someReallyBigData])
  .preInstructions([ix])
  .rpc();
```

İkinci caveat, hesap yüklemek için rust talimat işleyicinizin içinden şu yöntemlerden birini çağırmanız gerektiğidir:

- `load_init`, bir hesabı ilk başlatırken (bu, kullanıcının talimat kodu yalnızca eklendikten sonra eklenen eksik hesap ayırıcıyı göz ardı edecektir)
- `load`, hesap değiştirilemezken
- `load_mut`, hesap değiştirilebilirse

Örneğin, yukarıdaki `SomeReallyBigDataStruct`'yi başlatmak ve manipüle etmek isterseniz, fonksiyonda aşağıdakileri çağırırsınız:

```rust
let some_really_big_data = &mut ctx.accounts.some_really_big_data.load_init()?;
```

Bunu yaptıktan sonra, ardından hesabı normal gibi ele alabilirsiniz! Tüm bunları kendiniz kodda denemek için harekete geçin!

Bu konunun tüm detaylarını anlamak için, Solana, Box ve Zero-Copy'yi vanilla Solana'da açıklayan çok güzel bir [video](https://www.youtube.com/watch?v=zs_yU0IuJxc&feature=youtu.be) ve [kod](https://github.com/solana-developers/anchor-zero-copy-example) hazırladı.

---

### Hesaplarla Başa Çıkma

Artık Solana'da alan dikkate almanın temel unsurlarını bildiğinize göre, daha yüksek seviyede bazı dikkate alınması gereken noktaları inceleyelim. Solana'da her şey bir hesaptır; bu nedenle önümüzdeki birkaç bölümde bazı hesap mimarisi kavramlarına bakacağız.

---

#### Veri Sırası

Bu ilk dikkat edilecek husus oldukça basittir. Genel bir kural olarak, tüm değişken uzunlukta alanları hesabın sonunda tutun. Aşağıdakilere bakın:

```rust
#[account] // Anchor hesap ayracını gizler
pub struct BadState {
    pub flags: Vec<u8>, // 0x11, 0x22, 0x33 ...
    pub id: u32         // 0xDEAD_BEEF
}
```

`flags` alanı değişken uzunlukta. Bu, belirli bir hesabı `id` alanıyla aramayı çok zorlaştırır; çünkü `flags` içindeki verilerin güncellenmesi `id` alanının bellek haritasındaki konumunu değiştirir.

Bunu daha net hale getirmek için:


Örnek:

`flags` dört öğe içerdiğinde ile sekiz öğe içerdiğinde bu hesabın verisinin onchain'de nasıl göründüğüne dikkat edin. Eğer `solana account ACCOUNT_KEY` çağrısı yaparsanız, aşağıdaki gibi bir veri dökümü alırsınız:

```rust
0000:   74 e4 28 4e    d9 ec 31 0a  -> Hesap Ayracı (8)
0008:   04 00 00 00    11 22 33 44  -> Vec Boyutu (4) | Veri 4*(1)
0010:   DE AD BE EF                 -> id (4)

--- vs ---

0000:   74 e4 28 4e    d9 ec 31 0a  -> Hesap Ayracı (8)
0008:   08 00 00 00    11 22 33 44  -> Vec Boyutu (8) | Veri 4*(1)
0010:   55 66 77 88    DE AD BE EF  -> Veri 4*(1) | id (4)
```



Her iki durumda da, ilk sekiz byte Anchor hesap ayracını temsil eder. İlk durumda, sonraki dört byte, `flags` vektörünün boyutunu temsil eder, ardından bir diğer dört byte veri için gelir ve nihayet `id` alanının verisi gelir.

İkinci durumda, `id` alanı `flags` alanındaki verilerin dört byte daha fazla yer kaplaması nedeniyle adres 0x0010'dan 0x0014'e taşındı.

Bunun ana problemi sorgulamalardır. Solana'yı sorgularken, hesapların ham verilerine bakan filtreler kullanırsınız. Bunlara `memcmp` filtreleri veya bellek karşılaştırma filtreleri denir. Filtreye bir `offset` ve `bytes` verirsiniz, ardından filtre doğrudan belleğe bakar, sağladığınız offset ile başlangıçtan offset alır ve bellekteki byte'ları verdiğiniz `bytes` ile karşılaştırır.

Örneğin, `flags` yapısının her zaman 0x0008 adresinde başlayacağını bilirsiniz; çünkü ilk 8 byte hesap ayracını içerir. `flags` uzunluğunun dört ile eşit olduğu tüm hesapları sorgulamak mümkündür çünkü _biliyoruz_ ki 0x0008'deki dört byte `flags` verisindeki boyutu temsil eder. Hesap ayracının ...

```typescript
const states = await program.account.badState.all([
  {
    memcmp: {
      offset: 8,
      bytes: bs58.encode([0x04]),
    },
  },
]);
```

Ancak, `id` ile sorgulamak isterseniz, `offset` için ne koymanız gerektiğini bilmezsiniz; çünkü `id`'nin konumu `flags` uzunluğuna göre değişkendir. Bu pek yararlı görünmüyor. Kimlikler genelde `flags` ile sorgulara yardımcı olmak için vardır! Basit çözüm sıralamayı değiştirmek.

```rust
#[account] // Anchor hesap ayracını gizler
pub struct GoodState {
    pub id: u32         // 0xDEAD_BEEF
    pub flags: Vec<u8>, // 0x11, 0x22, 0x33 ...
}
```

Değişken uzunlukta alanların yapının sonunda olmasıyla, her zaman ilk değişken uzunluk alanından önceki tüm alanlara göre hesapları sorgulayabilirsiniz. Bu bölümün başına tekrar dönmek gerekirse: Genel bir kural olarak, tüm değişken uzunluklu yapıları hesabın sonunda tutun.

---

#### Hesap Esnekliği ve Geleceğe Dönük Tasarım

Solana programları geliştirirken, hesap yapıları tasarlarken gelecekteki güncellemeleri ve geriye dönük uyumluluğu göz önünde bulundurmak kritik öneme sahiptir. Solana, bu zorlukları etkili bir şekilde yönetmek için hesap yeniden boyutlandırma ve Anchor'ın `InitSpace` özelliği gibi güçlü özellikler sunar. Hadi bir oyun durumu örneği ile daha dinamik ve esnek bir yaklaşımı keşfedelim:

```rust
use anchor_lang::prelude::*;

# GameState Yapısı

```rust
#[derive(InitSpace)]
pub struct GameState {  // V1
    pub version: u8,
    pub health: u64,
    pub mana: u64,
    pub experience: Option,
    #[max_len(50)]
    pub event_log: Vec
}
```

Bu `GameState` içinde:

- Hesap yapısı değişikliklerini izlemek için bir `version` alanı
- Temel karakter nitelikleri (`health`, `mana`)
- Geriye dönük uyumluluk için bir `Option<u64>` olarak `experience` alanı
- Belirtilmiş maksimum uzunlukla bir `event_log`

:::note
Bu yaklaşımın temel avantajları:
:::

1. **Otomatik Alan Hesaplama**: `InitSpace` niteliği, gerekli hesap alanını otomatik olarak hesaplar.
2. **Sürümleme**: `version` alanı, hesap yapısı sürümlerinin kolayca tanımlanmasını sağlar.
3. **Esnek Alanlar**: Yeni alanlar için `Option<T>` kullanmak, eski sürümlerle uyumluluğu korur.
4. **Belirlenmiş Sınırlar**: `Vec` alanları üzerindeki `max_len` niteliği, boyut kısıtlamalarını açıkça iletir.

## Hesap Yapısının Yükseltilmesi

Hesap yapınızı yükseltmeniz gerektiğinde, örneğin `event_log` uzunluğunu artırmak veya yeni alanlar eklemek gibi, Anchor'un `realloc` kısıtıyla tek bir yükseltme talimatı kullanabilirsiniz:

1. Yeni alanlar veya artırılmış `max_len` niteliği ile `GameState` yapısını güncelleyin:

   ```rust
   #[account]
   #[derive(InitSpace)]
   pub struct GameState {
       pub version: u8,
       pub health: u64,
       pub mana: u64,
       pub experience: Option,
       #[max_len(100)]  // 50'den artırıldı
       pub event_log: Vec,
       pub new_field: Option, // Yeni alan eklendi
   }
   ```

2. `GameState` için tüm yükseltmelerde Anchor'un `realloc` kısıtını kullanarak tek bir `UpgradeGameState` bağlamı kullanın:

   ```rust
   #[derive(Accounts)]
   pub struct UpgradeGameState {
       #[account(
           mut,
           realloc = GameState::INIT_SPACE,
           realloc::payer = payer,
           realloc::zero = false,
       )]
       pub game_state: Account,
       #[account(mut)]
       pub payer: Signer,
       pub system_program: Program,
   }
   ```

3. Yükseltme mantığını tek bir işlevde uygulayın:

   ```rust
   pub fn upgrade_game_state(ctx: Context) -> Result {
       let game_state = &mut ctx.accounts.game_state;

       match game_state.version {
           1 => {
               game_state.version = 2;
               game_state.experience = Some(0);
               msg!("Sürüm 2'ye yükseltildi");
           },
           2 => {
               game_state.version = 3;
               game_state.new_field = Some(0);
               msg!("Sürüm 3'e yükseltildi");
           },
           _ => return Err(ErrorCode::AlreadyUpgraded.into()),
       }

       Ok(())
   }
   ```

:::tip
Bu yaklaşımı göstermek için örnek:
:::

```rust
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GameState {
    pub version: u8,
    pub health: u64,
    pub mana: u64,
    pub experience: Option,
    #[max_len(100)]  // 50'den artırıldı
    pub event_log: Vec,
    pub new_field: Option,
}

#[derive(Accounts)]
pub struct UpgradeGameState {
    #[account(
        mut,
        realloc = GameState::INIT_SPACE,
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub game_state: Account,
    #[account(mut)]
    pub payer: Signer,
    pub system_program: Program,
}

#[program]
pub mod your_program {
    use super::*;

    // ... diğer talimatlar ...

    pub fn upgrade_game_state(ctx: Context) -> Result {
        let game_state = &mut ctx.accounts.game_state;

        match game_state.version {
            1 => {
                game_state.version = 2;
                game_state.experience = Some(0);
                msg!("Sürüm 2'ye yükseltildi");
            },
            2 => {
                game_state.version = 3;
                game_state.new_field = Some(0);
                msg!("Sürüm 3'e yükseltildi");
            },
            _ => return Err(ErrorCode::AlreadyUpgraded.into()),
        }

        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Hesap zaten en son sürümde")]
    AlreadyUpgraded,
}
```

:::info
Bu yaklaşım:
- Anchor'un [`realloc`](https://docs.rs/anchor-lang/latest/anchor_lang/derive.Accounts.html#normal-constraints) kısıtlamasını kullanarak hesap büyütmeyi otomatik olarak ele alır.
- [`InitSpace`](https://docs.rs/anchor-lang/latest/anchor_lang/derive.InitSpace.html) türetilmiş makro, `GameState` yapısı için `Space` niteliğini otomatik olarak uygular. Bu nitelik [`INIT_SPACE`](https://docs.rs/anchor-lang/latest/anchor_lang/trait.Space.html#associatedconstant.INIT_SPACE) ilişkili sabitini içerir ve bu, hesap için gerekli toplam alanı hesaplar.
- Ek kira için bir ödeyici belirtilir `realloc::payer = payer`.
- Mevcut verileri korur `realloc::zero = false`.
:::

---

Hesap verileri, tek bir çağrı içinde `solana_program::entrypoint::MAX_PERMITTED_DATA_INCREASE` byte'ya kadar artırılabilir.

Büyütülecek bellek, program giriş noktasında zaten sıfır ile başlatılmış ve tekrar sıfırlanması hesaplama birimlerini boşa harcar. Eğer aynı çağrı içinde bir program daha büyük bir alandan daha küçük bir alana yeniden tahsis ederse ve tekrar daha büyüğe geri dönerse, yeni alan eski veriler içerebilir. Bu durumda `zero_init` için `true` geçmek gereklidir, aksi halde hesaplama birimleri sıfır ile yeniden başlatılarak israf edilmiş olur.

:::callout
Hesap yeniden boyutlandırma güçlüdür, ancak dikkatli kullanılmalıdır. Sıklıkla boyutlandırma ile başlangıç tahsisi arasında denge kurmayı göz önünde bulundurun.

- Hesabınızın boyutlandırmadan önce kiradan muaf olduğundan emin olun.
- İşlemin ödeyeni, ek lamportları sağlamaktan sorumludur.
- Program tasarımınızda sık tekrar boyutlandırmaların maliyet etkilerini göz önünde bulundurun.
:::

### Veri Optimizasyonu

Burada amaç israf edilen bitlerin farkında olmaktır. Örneğin, yılın ayını temsil eden bir alanınız varsa, `u64` kullanmayın. Yılda sadece 12 ay vardır. `u8` kullanın. Daha da iyisi, `u8` Enum kullanın ve ayları etiketleyin.

:::tip
Bit tasarrufu konusunda daha agresif olmak için booleans ile dikkatli olun. Aşağıdaki sekiz boolean bayrağından oluşan yapıyı inceleyin. Boolean _tek bir bit_ olarak temsil edilebilirken, borsh serileştirilmesi her bir bu alan için tam bir byte ayıracaktır. Bu, sekiz booleanın sekiz byte olmasına neden olur ve bu da boyutta sekiz kat artış demektir.
:::

```rust
#[account]
pub struct BadGameFlags { // 8 byte
    pub is_frozen: bool,
    pub is_poisoned: bool,
    pub is_burning: bool,
    pub is_blessed: bool,
    pub is_cursed: bool,
    pub is_stunned: bool,
    pub is_slowed: bool,
    pub is_bleeding: bool,
}
```

Bunu optimize etmek için tek bir alanı `u8` olarak kullanabilirsiniz. Sonra bit işlemleri kullanarak her bir biti kontrol edebilir ve "açık mı" olduğunu belirleyebilirsiniz.

```rust
const IS_FROZEN_FLAG: u8 = 1  Carol

Bob ---- pays --> Dean
```

Ama Alice ve Bob aynı anda Carol'a ödemeye çalışırlarsa sorun yaşayacaklardır.

```rust
Alice -- pays --> |
                      -- > Carol
Bob   -- pays --- |
```

Her iki işlem de Carol'ın token hesabına yazdığı için, sadece bir tanesi aynı anda geçebilir. Ne yazık ki, Solana çok hızlıdır, bu nedenle ödemelerinin aynı anda yapıldığı gibi görünebilir. Ama eğer Alice ve Bob'dan daha fazla kişi Carol'a ödeme yapmaya çalışırsa ne olur?

```rust
Alice -- pays --> |
                      -- > Carol
x1000 -- pays --- |
Bob   -- pays --- |
```

Eğer 1000 kişi aynı anda Carol'a ödeme yapmaya çalışırsa, her bir bu 1000 talimat sırayla çalışmaya alınacaktır. Bunlardan bazıları, ödemenin hemen geçtiğini görecektir. Onlar, talimatları erken dahil edilen şanslı olanlardır. Ama bazıları oldukça beklemek zorunda kalacaktır. Ve bazıları, işlem sadece başarısız olacaktır.

1000 kişinin aynı anda Carol'a ödeme yapması pek olası görünmese de, birçok kişinin aynı anda aynı hesaba veri yazmaya çalıştığı bir etkinlik, yani NFT mint süreci oldukça yaygındır.

Diyelim ki süper popüler bir program oluşturuyorsunuz ve işlediğiniz her İşlemden bir ücret almak istiyorsunuz. Hesap nedenlerinden, tüm bu ücretlerin tek bir cüzdana gitmesini istiyorsunuz. Bu kurulumla, kullanıcıların yoğunluğunda protokolünüz yavaşlayacak veya güvenilmez hale gelecektir. Kötü bir durum. Peki çözüm ne? Veri işlemini ücret işleminden ayırmak.

Örneğin, `DonationTally` adlı bir veri hesabınız olduğunu hayal edin. Tek ve yalnızca işlevi, belirli bir sabit kodlu cüzdanına ne kadar bağış yaptığınızı kaydetmektir.

```rust
#[account]
pub struct DonationTally {
    is_initialized: bool,
    lamports_donated: u64,
    lamports_to_redeem: u64,
    owner: Pubkey,
}
```

Öncelikle alt optimal çözümü inceleyelim.

```rust
pub fn run_concept_shared_account_bottleneck(ctx: Context, lamports_to_donate: u64) -> Result {

    let donation_tally = &mut ctx.accounts.donation_tally;

    if !donation_tally.is_initialized {
        donation_tally.is_initialized = true;
        donation_tally.owner = ctx.accounts.owner.key();
        donation_tally.lamports_donated = 0;
        donation_tally.lamports_to_redeem = 0;
    }

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.community_wallet.to_account_info(),
        });
    transfer(cpi_context, lamports_to_donate)?;

    donation_tally.lamports_donated = donation_tally.lamports_donated.checked_add(lamports_to_donate).unwrap();
    donation_tally.lamports_to_redeem = 0;

    Ok(())
}
```

Bağış miktarını güncellediğiniz bilgi içinde hardcoded `community_wallet` cüzdanına transfer yapmak için yine en basit çözüm olarak gözüksede, bu bölüm için testleri çalıştırdığınızda yavaşlama göreceksiniz.

Artık optimize edilmiş çözüme bakalım:

```rust
pub fn run_concept_shared_account(ctx: Context, lamports_to_donate: u64) -> Result {

    let donation_tally = &mut ctx.accounts.donation_tally;

    if !donation_tally.is_initialized {
        donation_tally.is_initialized = true;
        donation_tally.owner = ctx.accounts.owner.key();
        donation_tally.lamports_donated = 0;
        donation_tally.lamports_to_redeem = 0;
    }

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: donation_tally.to_account_info(),
        });
    transfer(cpi_context, lamports_to_donate)?;

    donation_tally.lamports_donated = donation_tally.lamports_donated.checked_add(lamports_to_donate).unwrap();
    donation_tally.lamports_to_redeem = donation_tally.lamports_to_redeem.checked_add(lamports_to_donate).unwrap();

    Ok(())
}

pub fn run_concept_shared_account_redeem(ctx: Context) -> Result {
    let transfer_amount: u64 = ctx.accounts.donation_tally.lamports_donated;

    // DonationTally hesabındaki bakiyeyi azalt
    **ctx.accounts.donation_tally.to_account_info().try_borrow_mut_lamports()? -= transfer_amount;

    // Community_wallet hesabına bakiyeyi artır
    **ctx.accounts.community_wallet.to_account_info().try_borrow_mut_lamports()? += transfer_amount;

    // Lamports_donated ve lamports_to_redeem'i resetle
    ctx.accounts.donation_tally.lamports_to_redeem = 0;

    Ok(())
}
```

Burada, `run_concept_shared_account` işlevinde, bottlenecka transfer yerine `donation_tally` PDA'sına transfer yapıyoruz. Bu şekilde, yalnızca bağışçı ile ilgili hesabı ve PDA'sını etkiliyoruz - böylece bir bottleneck olmuyor! Ek olarak, gelecekte `community_wallet`'a transfer edilmesi gereken kaç lamportun biriktiğini akılda tutuyoruz, yani bir süre sonra community wallet gidip tüm yerinde bırakılan lamportları temizleyecektir. Önemli bir nokta, herkesin yeniden alma işlemi için imza atabilmesidir çünkü PDA kendisi üzerinde izin haklarına sahiptir.

Her durumda bottlenecklerden kaçınmak istiyorsanız, bu bir yöntemdir. Sonuçta bu bir tasarım kararıdır ve daha basit, daha az optimal çözüm bazı programlar için iyi olabilir. Ancak programınız yüksek trafiğe sahip olacaksa, optimize etmeyi denemeye değer. En kötü, en iyi ve ortalama vakaları görmeniz için her zaman bir simülasyon çalıştırabilirsiniz.

### Aksiyon İçinde Görün

Bu dersteki tüm kod parçacıkları, bu kavramları göstermek için oluşturduğumuz bir [Solana programının](https://github.com/Unboxed-Software/advanced-program-architecture.git) parçasıdır. Her kavramın birlikte bir programı ve test dosyası vardır. Örneğin, **Boyutlar** kavramı şu konumda bulunabilir:

**program -** `programs/architecture/src/concepts/sizes.rs`

**test -** `tests/sizes.ts`

Artık bu kavramların her birini okuduğunuza göre, kodu denemeye dalabilirsiniz. Mevcut değerleri değiştirebilir, programı kırmaya çalışabilir ve her şeyin nasıl çalıştığını anlamaya çalışabilirsiniz.

Başlamak için [bunu Github'dan](https://github.com/Unboxed-Software/advanced-program-architecture.git) forklayabilir ve/veya klonlayabilirsiniz. Test paketini oluşturup çalıştırmadan önce, lütfen `lib.rs` ve `Anchor.toml` dosyalarınızı yerel program ID'nizle güncellemeyi unutmayın.

Tüm test paketini çalıştırabilir veya belirli bir test dosyasında yalnızca o dosyanın testlerini çalıştırmak için [`.only` ekleyebilirsiniz](https://mochajs.org/#exclusive-tests) `describe` çağrısına. Kendinize uygun şekilde özelleştirip kendinize ait hale getirmekten çekinmeyin.

### Sonuç

Birçok program mimarisi tasarımı hakkında konuştuk: baytlar, hesaplar, tıkanıklıklar ve daha fazlası. Bu belirli tasarım unsurlarıyla karşılaşıp karşılaşmayacağınızdan emin olamamakla birlikte, umarım örnekler ve tartışmalar bir düşünce kıvılcımı yaratmıştır. Sonuçta, sisteminizin tasarımcısı sizsiniz. **Göreviniz çeşitli çözümlerin artılarını ve eksilerini tartmaktır.** İleri görüşlü olun, ancak pratik de kalın. Hiçbir şeyin "bir tek iyi yolu" yoktur. Sadece takasları biliyor olun.

---

## Laboratuvar

Tüm bu kavramları, Solana'da basit ama optimize edilmiş bir RPG oyun motoru oluşturmak için kullanacağız. Bu program aşağıdaki özelliklere sahip olacaktır:

- Kullanıcıların bir oyun oluşturmasına (`Game` hesabı) ve "oyun yöneticisi" olmasına (oyunun otoritesi)
- Oyun yöneticileri, kendi oyununun yapılandırmasından sorumludur
- Kamuoyundan herhangi biri bir oyuna oyuncu olarak katılabilir - her oyuncu/oyun kombinasyonu bir `Player` hesabına sahip olacaktır
- Oyuncular, eylem puanlarını harcayarak canavarlar (`Monster` hesabı) yaratabilir ve onlarla savaşabilir; eylem puanı olarak lamportları kullanacağız
- Harcanan eylem puanları, `Game` hesabında listelendiği gibi bir oyunun hazinesine gider

**Gideceğimiz yol boyunca farklı tasarım kararlarının takaslarını tartışacağız ve neden bazı şeyleri bu şekilde yaptığımız hakkında bir fikir vereceğiz.** Hadi başlayalım!

### 1. Program Kurulumu

Bunu sıfırdan inşa edeceğiz. Yeni bir Anchor projesi oluşturarak başlayın:

```bash
anchor init rpg
```

:::note
Bu laboratuvar, Anchor sürüm `0.30.1` düşünülerek oluşturuldu. Derleme problemleriyle karşılaşırsanız, lütfen ortam ayarları için [çözüm koduna](https://github.com/solana-developers/anchor-rpg/tree/main) bakın.
:::

Sonra, program ID'nizi otomatik olarak senkronize edecek `anchor keys sync` komutunu çalıştırın. Bu komut, program dosyalarınızdaki program ID'lerini (including `Anchor.toml`) program anahtar çiftinin gerçek `pubkey` ile günceller.

Son olarak, `lib.rs` dosyasında programı oluşturacağız. **Başlamadan önce dosyanıza aşağıdakileri kopyalayın:**

```rust filename="lib.rs"
use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;

declare_id!("YOUR_KEY_HERE__YOUR_KEY_HERE");

#[program]
pub mod rpg {
    use super::*;

    pub fn create_game(ctx: Context, max_items_per_player: u8) -> Result {
        run_create_game(ctx, max_items_per_player)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn create_player(ctx: Context) -> Result {
        run_create_player(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn spawn_monster(ctx: Context) -> Result {
        run_spawn_monster(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn attack_monster(ctx: Context) -> Result {
        run_attack_monster(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn deposit_action_points(ctx: Context) -> Result {
        run_collect_action_points(ctx)?;
        sol_log_compute_units();
        Ok(())
    }
}
```

### 2. Hesap Yapıları Oluşturma

Başlangıç kurulumumuz hazır olduğuna göre, hesaplarımızı oluşturalım. Toplam 3 hesap olacak:

1. **`Game`** - Bu hesap bir oyunu temsil eder ve yönetir. Oyun katılımcıların ödeme yapacağı hazineyi içerir ve oyun yöneticilerinin oyunu özelleştirmek için kullanabileceği bir yapılandırma yapısı içerir. Aşağıdaki alanları içermelidir:
   - `game_master` - etkili olarak sahibi/otoritesi
   - `treasury` - oyuncuların eylem puanlarını gönderecekleri hazine (sadece lamportları kullanacağız)
   - `action_points_collected` - hazinede toplanan eylem puanlarının sayısını takip eder
   - `game_config` - oyunu özelleştirmek için bir yapılandırma yapısı
2. **`Player`** - Oyun hesabı adresi ve oyuncunun cüzdan adresi kullanılarak türetilen bir PDA hesabı. Oyuncunun oyun durumunu izlemek için gereken birçok alanı vardır:
   - `player` - oyuncunun halka açık anahtarı
   - `game` - karşılık gelen oyun hesabının adresi
   - `action_points_spent` - harcanan eylem puanları
   - `action_points_to_be_collected` - hala toplanması gereken eylem puanları
   - `status_flag` - oyuncunun durumu
   - `experience` - oyuncunun deneyimi
   - `kills` - öldürülen canavar sayısı
   - `next_monster_index` - karşılaşılacak bir sonraki canavarın indeksi
   - `inventory` - oyuncunun envanterinin bir vektörü
3. **`Monster`** - Oyun hesabı adresi, oyuncunun cüzdan adresi ve bir indeks (bu, `Player` hesabındaki `next_monster_index` olarak saklanan) kullanılarak türetilen bir PDA hesabı.
   - `player` - canavarın karşılaştığı oyuncu
   - `game` - canavarın ilişkilendirildiği oyun
   - `hitpoints` - canavarın kalan can puanı

***Bu nihai proje yapısıdır:***

```bash
src/
├── constants.rs              # Program boyunca kullanılan sabitler
├── error/                    # Hata modülü
│   ├── errors.rs             # Özel hata tanımlamaları
│   └── mod.rs                # Hata işleme için modül bildirimleri
├── helpers.rs                # Program genelinde kullanılan yardımcı fonksiyonlar
├── instructions/             # Farklı oyun eylemleri için talimat işleyicileri
│   ├── attack_monster.rs     # Bir canavara saldırmayı işler
│   ├── collect_points.rs     # Puan toplama işlemlerini işler
│   ├── create_game.rs        # Oyun yaratmayı işler
│   ├── create_player.rs      # Oyuncu yaratmayı işler
│   ├── mod.rs                # Talimatlar için modül bildirimleri
│   └── spawn_monster.rs      # Yeni bir canavar yaratmayı işler
├── lib.rs                    # Program için ana giriş noktası
└── state/                    # Oyun veri yapıları için durum modülü
    ├── game.rs               # Oyun durumu temsili
    ├── mod.rs                # Durum için modül bildirimleri
    ├── monster.rs            # Canavar durumu temsili
    └── player.rs             # Oyuncu durumu temsili
```

**Program eklendiğinde, hesaplar şu şekilde görünmelidir:**

```rust
// ----------- HESAPLAR ----------

// `state/game.rs` içinde
use anchor_lang::prelude::*;
#[account]
#[derive(InitSpace)]
pub struct Game {
    pub game_master: Pubkey,
    pub treasury: Pubkey,
    pub action_points_collected: u64,
    pub game_config: GameConfig,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct GameConfig {
    pub max_items_per_player: u8
}

// `state/player.rs` içinde
use anchor_lang::prelude::*;
#[account]
#[derive(InitSpace)]
pub struct Player { // 8 byte
    pub player: Pubkey,                 // 32 byte
    pub game: Pubkey,                   // 32 byte

    pub action_points_spent: u64,               // 8 byte
    pub action_points_to_be_collected: u64,     // 8 byte

    pub status_flag: u8,                // 8 byte
    pub experience: u64,                 // 8 byte
    pub kills: u64,                     // 8 byte
    pub next_monster_index: u64,        // 8 byte

    pub inventory: Vec,  // Maksimum 8 öğe
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct InventoryItem {
    pub name: [u8; 32], // Sabit isim 32 byte'a kadar
    pub amount: u64
}

// `state/monster.rs` içinde
use anchor_lang::prelude::*;
#[account]
#[derive(InitSpace)]
pub struct Monster {
    pub player: Pubkey,
    pub game: Pubkey,
    pub hitpoints: u64,
}
```

> **Burada çok karmaşık tasarım kararları yok, ama `Player` yapısındaki `inventory` alanı hakkında konuşalım. `inventory` değişken uzunlukta olduğundan, sorgulamayı kolaylaştırmak için hesap sonunda yer almasını seçtik.**

### 3. İkincil Türler Oluşturma

Şimdi, henüz oluşturmadığımız hesaplarımızın referans aldığı bazı türleri eklememiz gerekiyor.

Oyun yapılandırma yapısı ile başlayalım. **Teknik olarak, bu `Game` hesabında yer alabilirdi, ancak biraz ayrım ve kapsülleme yapmanın güzel olduğunu düşünüyoruz.** Bu yapı, her oyuncu için izin verilen maksimum öğeleri saklamalıdır.

```rust filename="game.rs"
// ----------- OYUN YAPISI ----------
// `state/game.rs` içinde
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct GameConfig {
    pub max_items_per_player: u8
}
```

**Solana programlarında hesapların yeniden tahsis edilmesi, Anchor'ın [`realloc`](https://docs.rs/anchor-lang/latest/anchor_lang/derive.Accounts.html#normal-constraints) hesap kısıtlaması ve Solana'nın hesap boyutunu değiştirme yetenekleri sayesinde daha esnek hale geldi.** Bir hesap yapısı içinde alan eklerken basit kalmaya devam ederken, modern uygulamalar daha uyarlanabilir tasarımlara olanak tanır:

1. **`#[account()]` niteliğinde, yeniden boyutlandırma parametrelerini belirtmek için Anchor'ın `realloc` kısıtlamasını kullanın:**

   ```rust
   #[account(
       mut,
       realloc = AccountStruct::INIT_SPACE,
       realloc::payer = payer,
       realloc::zero = false,
   )]
   ```

2. **Hesap alanını otomatik olarak hesaplamak için Anchor'ın `InitSpace` niteliğini kullanın.**
3. **`Vec` veya `String` gibi değişken uzunluklu alanlar için maksimum boyutu belirtmek üzere `max_len` niteliğini kullanın.**
4. **Yeni alanlar eklediğinizde, geri uyumluluk için `Option<T>` kullanmayı düşünün.**
5. **Farklı düzenleri yönetmek için hesap yapınızda bir versiyonlama sistemi uygulayın.**
6. **Yeniden tahsis maliyetlerini karşılamak için ödeme hesabının değişken ve imzalayan olduğunu garantileyin:**

   ```rust
   #[account(mut)]
   pub payer: Signer,
   ```

> **Bu yaklaşım, yeni alanlar eklense bile hesap yapısı evriminin daha kolay olmasını sağlar, ayrıca Anchor'ın yerleşik yetenekleri ile verimli sorgulama ve serileştirme/serileştirme işlemlerini sürdürmenizi sağlar. Bu, istediğiniz zaman hesapların boyutunu değiştirmeye olanak tanır, kiralama muafiyetini otomatik olarak yönetir.**

Şimdi durum bayraklarımızı oluşturalım. **Unutmayın ki, bayraklarımızı boolean olarak depolayabiliriz ama bir byte içinde birden fazla bayrağı depolayarak alan tasarrufu sağlarız.** Her bayrak, byte içindeki farklı bir bitten oluşur. **`1`'i doğru bite yerleştirmek için `<<` operatörünü kullanabiliriz.**

```rust filename="constants.rs"
// ----------- DURUM ----------

pub const IS_FROZEN_FLAG: u8 = 1 << 0;
pub const IS_POISONED_FLAG: u8 = 1 << 1;
pub const IS_BURNING_FLAG: u8 = 1 << 2;
pub const IS_BLESSED_FLAG: u8 = 1 << 3;
pub const IS_CURSED_FLAG: u8 = 1 << 4;
pub const IS_STUNNED_FLAG: u8 = 1 << 5;
pub const IS_SLOWED_FLAG: u8 = 1 << 6;
pub const IS_BLEEDING_FLAG: u8 = 1 << 7;

pub const NO_EFFECT_FLAG: u8 = 0b00000000;
pub const ANCHOR_DISCRIMINATOR: usize = 8;
pub const MAX_INVENTORY_ITEMS: usize = 8;
```

Son olarak, `InventoryItem`'ımızı oluşturalım. Bu, öğenin adı ve miktarı için alanlara sahip olmalıdır.

```rust filename="player.rs"
// ----------- ENVANTER ----------

// `state/player.rs` içinde
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct InventoryItem {
    pub name: [u8; 32], // Sabit isim 32 byte'a kadar
    pub amount: u64
}
```

### 4. Eylem Puanlarını Harcama için Yardımcı Fonksiyon Oluşturma

Programın talimatlarını yazmadan önce, eylem puanlarını harcama işlemi için bir yardımcı fonksiyon oluşturacağız. **Oyuncular, oyun içindeki eylemleri gerçekleştirmek için ödeme olarak eylem puanlarını (lamportları) oyun hazinesine gönderecekler.**

**Lamportları bir hazineye göndermek, o hazine hesabına veri yazmayı gerektirdiği için, birçok oyuncunun aynı anda aynı hazineye yazmaya çalışması durumunda bir performans darboğazı ile karşılaşabiliriz (bkz. `Eşzamanlılıkla Baş Etme`).**

Bunun yerine, oyuncunun PDA hesabına göndereceğiz ve o hesaptan hazineye lamportları bir kerede gönderecek bir talimat oluşturacağız. **Bu yaklaşım, her oyuncunun kendi hesabı bulunduğundan, herhangi bir eşzamanlılık sorununu giderir, ayrıca programın bu lamportları istediği zaman almasına izin verir.**

```rust filename="helper.rs"
// ----------- YARDIMCI ----------

// `src/helpers.rs` içinde
use anchor_lang::{prelude::*, system_program};

use crate::{error::RpgError, Player};

pub fn spend_action_points<'info>(
    action_points: u64,
    player_account: &mut Account,
    player: &AccountInfo,
    system_program: &AccountInfo,
) -> Result {
    player_account.action_points_spent = player_account
        .action_points_spent
        .checked_add(action_points)
        .ok_or(error!(RpgError::ArithmeticOverflow))?;

    player_account.action_points_to_be_collected = player_account
        .action_points_to_be_collected
        .checked_add(action_points)
        .ok_or(error!(RpgError::ArithmeticOverflow))?;

    system_program::transfer(
        CpiContext::new(
            system_program.to_account_info(),
            system_program::Transfer {
                from: player.to_account_info(),
                to: player_account.to_account_info(),
            },
        ),
        action_points,
    )?;

    msg!("{} eylem puanı çıkışı", action_points);

    Ok(())
}
```

### 5. Oyun Oluşturma

İlk talimatımız `game` hesabını oluşturmak olacak. **Herkes bir `game_master` olabilir ve kendi oyununu oluşturabilir, ancak bir oyun oluşturulduktan sonra belirli kısıtlamalar vardır.**

Birincisi, `game` hesabı, `treasury` cüzdanını kullanarak bir PDA'dır. **Bu, aynı `game_master`'ın her biri için farklı bir hazine kullanarak birden fazla oyunu yönetmesini sağlar.**

:::tip
`treasury`, talimat üzerinde imzalayan bir kişidir. **Bu, oyunu yaratan kişinin `treasury`'nin özel anahtarlarına sahip olduğundan emin olmak içindir. Bu, "doğru yol" yerine bir tasarım kararını ifade eder. Nihayetinde, oyun yöneticisinin fonlarını geri alabileceğinden emin olmak için bir güvenlik önlemidir.**
:::

```rust filename="create_game.rs"
// ----------- OYUN OLUŞTURUN ----------

// `src/instructions/create_game.rs` içinde
use anchor_lang::prelude::*;

use crate::{error::RpgError, Game, ANCHOR_DISCRIMINATOR};

#[derive(Accounts)]
pub struct CreateGame {
    #[account(
        init,
        seeds = [b"GAME", treasury.key().as_ref()],
        bump,
        payer = game_master,
        space = ANCHOR_DISCRIMINATOR + Game::INIT_SPACE
    )]
    pub game: Account,
    #[account(mut)]
    pub game_master: Signer,
    pub treasury: Signer,
    pub system_program: Program,
}

pub fn run_create_game(ctx: Context, max_items_per_player: u8) -> Result {
    if max_items_per_player == 0 {
        return Err(error!(RpgError::InvalidGameConfig));
    }

    let game = &mut ctx.accounts.game;
    game.game_master = ctx.accounts.game_master.key();
    game.treasury = ctx.accounts.treasury.key();
    game.action_points_collected = 0;
    game.game_config.max_items_per_player = max_items_per_player;

    msg!("Oyun oluşturuldu!");
    Ok(())
}
```

### 6. Oyuncu Oluşturma

İkinci talimatımız `player` hesabını oluşturacak. **Bu talimat hakkında dikkate alınması gereken üç takas var:**

1. **Oyuncu hesabı, `game` ve `player` cüzdanını kullanarak türetilmiş bir PDA hesabıdır. Bu, oyuncuların birden fazla oyuna katılım göstermelerine olanak tanır ancak her oyun için yalnızca bir oyuncu hesabının olmasını sağlar.**
2. **`game` hesabını bir `Box`'ın içine sarıyoruz, böylece yığını doldurmadan yığını korumuş oluyoruz.**
3. **Her oyuncunun ilk eylemi kendilerini oyuna dahil etmek olduğundan, `spend_action_points` fonksiyonunu çağırıyoruz. Şu an için `action_points_to_spend` değerini 100 lamport olarak sabitliyoruz, ancak gelecekte bu durum oyunun yapılandırmasına eklenebilir.**

```rust filename="create_player.rs"
// ----------- OYUNCU OLUŞTURUN ----------

// `src/instructions/create_player.rs` içinde
use anchor_lang::prelude::*;

use crate::{
    error::RpgError, helpers::spend_action_points, Game, Player, ANCHOR_DISCRIMINATOR,
    CREATE_PLAYER_ACTION_POINTS, NO_EFFECT_FLAG,
};

#[derive(Accounts)]
pub struct CreatePlayer {
    pub game: Box>,
    #[account(
        init,
        seeds = [
            b"PLAYER",
            game.key().as_ref(),
            player.key().as_ref()
        ],
        bump,
        payer = player,
        space = ANCHOR_DISCRIMINATOR + Player::INIT_SPACE
    )]
    pub player_account: Account,
    #[account(mut)]
    pub player: Signer,
    pub system_program: Program,
}

pub fn run_create_player(ctx: Context) -> Result {
    let player_account = &mut ctx.accounts.player_account;
    player_account.player = ctx.accounts.player.key();
    player_account.game = ctx.accounts.game.key();
    player_account.status_flag = NO_EFFECT_FLAG;
    player_account.experience = 0;
    player_account.kills = 0;

    msg!("Kahraman oyuna girdi!");

    // Oyuncu yaratmak için 100 lamport harca
    let action_points_to_spend = CREATE_PLAYER_ACTION_POINTS;

    spend_action_points(
        action_points_to_spend,
        player_account,
        &ctx.accounts.player.to_account_info(),
        &ctx.accounts.system_program.to_account_info(),
    )
    .map_err(|_| error!(RpgError::InsufficientActionPoints))?;

    Ok(())
}
```

### 7. Canavar Yaratma

Artık oyuncuları oluşturma yolumuzu bildiğimize göre, onlarla savaşacak canavarlar da yaratmamız gerekiyor. **Bu talimat, `game` hesabı, `player` hesabı ve oyuncunun karşılaştığı canavar sayısını temsil eden bir indeks kullanarak yeni bir `Monster` hesabı oluşturacaktır.** Burada bahsedilmesi gereken iki tasarım kararı var:

1. **PDA tohumları, bir oyuncunun oluşturduğu tüm canavarları takip etmemize olanak tanır.**
2. **Hem `game` hem de `player` hesaplarını `Box` içinde sarıyoruz, böylece yığın üzerinde yerleştiriyoruz.**

```rust filename="spawn_monster.rs"
// ----------- CANAVAR YARAT ----------

// `src/instructions/spawn_monster.rs` içinde
use anchor_lang::prelude::*;

use crate::{helpers::spend_action_points, Game, Monster, Player, SPAWN_MONSTER_ACTION_POINTS, ANCHOR_DISCRIMINATOR};

#[derive(Accounts)]
pub struct SpawnMonster {
    pub game: Box>,
    #[account(
        mut,
        has_one = game,
        has_one = player,
    )]
    pub player_account: Box>,
    #[account(
        init,
        seeds = [
            b"MONSTER",
            game.key().as_ref(),
            player.key().as_ref(),
            player_account.next_monster_index.to_le_bytes().as_ref()
        ],
        bump,
        payer = player,
        space = ANCHOR_DISCRIMINATOR + Monster::INIT_SPACE
    )]
    pub monster: Account,
    #[account(mut)]
    pub player: Signer,
    pub system_program: Program,
}

pub fn run_spawn_monster(ctx: Context) -> Result {
    let monster = &mut ctx.accounts.monster;
    monster.player = ctx.accounts.player.key();
    monster.game = ctx.accounts.game.key();
    monster.hitpoints = 100;

    let player_account = &mut ctx.accounts.player_account;
    player_account.next_monster_index = player_account.next_monster_index.checked_add(1).unwrap();

    msg!("Canavar Yaratıldı!");

    // 5 lamport harcayarak canavar yarat
    let action_point_to_spend = SPAWN_MONSTER_ACTION_POINTS;
    spend_action_points(
        action_point_to_spend,
        player_account,
        &ctx.accounts.player.to_account_info(),
        &ctx.accounts.system_program.to_account_info(),
    )?;

    Ok(())
}

### 8. Canavarları Saldır

Şimdi! O canavarlara saldırın ve biraz deneyim kazanmaya başlayın!

Buradaki mantık şu şekildedir:

- Oyuncular bir `action_point` harcayarak saldırır ve 1 `experience` kazanır.
- Eğer oyuncu canavarı öldürürse, `kill` sayıları artar.

:::tip
Her RPG hesabını `Box` içine almak, yığındaki alan tahsisi için önemlidir.
:::

Tasarım kararları açısından, her bir RPG hesabını `Box` içine aldık yığın için tahsis etmek amacıyla. Ayrıca, deneyim ve öldürme sayısını artırırken `saturating_add` kullandık.

`saturating_add` fonksiyonu sayının asla taşmamasını sağlar. Diyelim ki `kills` bir u8 ve mevcut öldürme sayım 255 (0xFF). Eğer bir tane daha öldürürsem ve normal bir şekilde eklersem, e.g. `255 + 1 = 0 (0xFF + 0x01 = 0x00) = 0`, öldürme sayısı 0 olur. `saturating_add`, sıfıra dönüşmek üzereyse max değerinde tutar; bu yüzden `255 + 1 = 255` olur. `checked_add` fonksiyonu taşma durumu varsa hata verecektir. Rust'ta matematik yaparken bunu aklınızda bulundurun. `kills` bir u64 olmasına rağmen ve mevcut programlamasıyla asla taşma yapmamasına rağmen, güvenli matematik kullanmak ve taşmaları düşünmek iyi bir uygulamadır.

```rust filename="attack_monster.rs"
// ----------- CANAVARA SALDIR ----------

// Inside src/instructions/attack_monster.rs
use anchor_lang::prelude::*;
use crate::{helpers::spend_action_points, Monster, Player, ATTACK_ACTION_POINTS, error::RpgError};

#[derive(Accounts)]
pub struct AttackMonster<'info> {
    #[account(
        mut,
        has_one = player,
    )]
    pub player_account: Box<Account<'info, Player>>,
    #[account(
        mut,
        has_one = player,
        constraint = monster.game == player_account.game @ RpgError::GameMismatch
    )]
    pub monster: Box<Account<'info, Monster>>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn run_attack_monster(ctx: Context<AttackMonster>) -> Result<()> {
    let player_account = &mut ctx.accounts.player_account;
    let monster = &mut ctx.accounts.monster;

    let hp_before_attack = monster.hitpoints;
    let hp_after_attack = monster.hitpoints.saturating_sub(1);
    let damage_dealt = hp_before_attack.saturating_sub(hp_after_attack);
    monster.hitpoints = hp_after_attack;

    if damage_dealt > 0 {
        msg!("Verilen Hasar: {}", damage_dealt);
        player_account.experience = player_account.experience.saturating_add(1);
        msg!("+1 EXP");

        if hp_after_attack == 0 {
            player_account.kills = player_account.kills.saturating_add(1);
            msg!("Canavarı öldürdün!");
        }
    } else {
        msg!("Dur! Zaten ölü!");
    }

    // Canavara saldırmak için 1 lamport harcayın
    let action_point_to_spend = ATTACK_ACTION_POINTS;

    spend_action_points(
        action_point_to_spend,
        player_account,
        &ctx.accounts.player.to_account_info(),
        &ctx.accounts.system_program.to_account_info()
    )?;

    Ok(())
}
```

### 9. Hazineye Aktarım

Bu son talimatımızdır. Bu talimat, harcanan `action_points`'ı `treasury` cüzdanına göndermeyi sağlar.

Yine, RPG hesaplarını kutuya alalım ve güvenli matematik kullanalım.

```rust filename="collect_points.rs"
// ----------- HAZİNEYE AKTAR ----------

// Inside src/instructions/collect_points.rs
use anchor_lang::prelude::*;
use crate::{error::RpgError, Game, Player};

#[derive(Accounts)]
pub struct CollectActionPoints<'info> {
    #[account(
        mut,
        has_one = treasury @ RpgError::InvalidTreasury
    )]
    pub game: Box<Account<'info, Game>>,
    #[account(
        mut,
        has_one = game @ RpgError::PlayerGameMismatch
    )]
    pub player: Box<Account<'info, Player>>,
    #[account(mut)]
    /// CHECK: Oyun hesabında kontrol edilecektir
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// Literal olarak TX ücretini ödeyen herkes bu komutu çalıştırabilir - bunu bir clockwork botuna verin
pub fn run_collect_action_points(ctx: Context<CollectActionPoints>) -> Result<()> {
    let transfer_amount = ctx.accounts.player.action_points_to_be_collected;

    // Oyuncudan hazineye lamport transfer et
    let player_info = ctx.accounts.player.to_account_info();
    let treasury_info = ctx.accounts.treasury.to_account_info();

    **player_info.try_borrow_mut_lamports()? = player_info
        .lamports()
        .checked_sub(transfer_amount)
        .ok_or(RpgError::InsufficientFunds)?;

    **treasury_info.try_borrow_mut_lamports()? = treasury_info
        .lamports()
        .checked_add(transfer_amount)
        .ok_or(RpgError::ArithmeticOverflow)?;

    ctx.accounts.player.action_points_to_be_collected = 0;

    ctx.accounts.game.action_points_collected = ctx.accounts.game
        .action_points_collected
        .checked_add(transfer_amount)
        .ok_or(RpgError::ArithmeticOverflow)?;

    msg!("Hazine {} action points topladı", transfer_amount);

    Ok(())
}
```

### 10. Hata Yönetimi

Şimdi, şimdiye kadar kullandığımız tüm hataları `errors.rs` dosyasında ekleyelim.

```rust filename="errors.rs"
// ------------ RPG HATALARI --------------

// Inside src/error/errors.rs

use anchor_lang::prelude::*;

#[error_code]
pub enum RpgError {
    #[msg("Aritmetik taşma meydana geldi")]
    ArithmeticOverflow,
    #[msg("Geçersiz oyun yapılandırması")]
    InvalidGameConfig,
    #[msg("Oyuncu bulunamadı")]
    PlayerNotFound,
    #[msg("Canavar bulunamadı")]
    MonsterNotFound,
    #[msg("Yetersiz action points")]
    InsufficientActionPoints,
    #[msg("Geçersiz saldırı")]
    InvalidAttack,
    #[msg("Maksimum envanter boyutuna ulaşıldı")]
    MaxInventoryReached,
    #[msg("Geçersiz eşya işlemi")]
    InvalidItemOperation,
    #[msg("Canavar ve oyuncu aynı oyunda değiller")]
    GameMismatch,
    #[msg("Geçersiz hazine hesabı")]
    InvalidTreasury,
    #[msg("Oyuncu belirtilen oyuna ait değil")]
    PlayerGameMismatch,
    #[msg("Transfer için yetersiz fon")]
    InsufficientFunds
}
```

### 11. Modül İlanları

Projede kullanılan tüm modülleri aşağıdaki gibi ilan etmemiz gerekiyor:

```rust
// Inside src/error/mod.rs
pub mod errors;
pub use errors::RpgError;   // Özel hata türünü açığa çıkar

// Inside src/instructions/mod.rs
pub mod attack_monster;
pub mod collect_points;
pub mod create_game;
pub mod create_player;
pub mod spawn_monster;

pub use attack_monster::*;   // attack_monster fonksiyonlarını açığa çıkar
pub use collect_points::*;    // collect_points fonksiyonlarını açığa çıkar
pub use create_game::*;       // create_game fonksiyonlarını açığa çıkar
pub use create_player::*;     // create_player fonksiyonlarını açığa çıkar
pub use spawn_monster::*;     // spawn_monster fonksiyonlarını açığa çıkar

// Inside src/state/mod.rs
pub mod game;
pub mod monster;
pub mod player;

pub use game::*;      // Oyun durumunu açığa çıkar
pub use monster::*;   // Canavar durumunu açığa çıkar
pub use player::*;    // Oyuncu durumunu açığa çıkar
```

### 12. Hepsini Birleştirme

Artık tüm talimat mantığımız yazıldığına göre, bu fonksiyonları programdaki gerçek talimatlara ekleyelim. Her talimat için hesaplamalı birimlerin günlük verilerini kaydetmek de faydalı olabilir.

```rust filename="lib.rs"
// Inside src/lib.rs
use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;

mod state;
mod instructions;
mod constants;
mod helpers;
mod error;

use state::*;
use constants::*;
use instructions::*;

declare_id!("5Sc3gJv4tvPiFzE75boYMJabbNRs44zRhtT23fLdKewz");

#[program]
pub mod rpg {
    use super::*;

    pub fn create_game(ctx: Context<CreateGame>, max_items_per_player: u8) -> Result<()> {
        run_create_game(ctx, max_items_per_player)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn create_player(ctx: Context<CreatePlayer>) -> Result<()> {
        run_create_player(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn spawn_monster(ctx: Context<SpawnMonster>) -> Result<()> {
        run_spawn_monster(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn attack_monster(ctx: Context<AttackMonster>) -> Result<()> {
        run_attack_monster(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn deposit_action_points(ctx: Context<CollectActionPoints>) -> Result<()> {
        run_collect_action_points(ctx)?;
        sol_log_compute_units();
        Ok(())
    }
}
```

Eğer tüm bölümleri doğru bir şekilde eklediyseniz, başarılı bir şekilde derleyebilmelisiniz.

```shell
anchor build
```

### Test Etme

Şimdi her şeyi birleştirelim ve uygulamada görelim!

`tests/rpg.ts` dosyasını ayarlayarak başlayacağız. Her testi adım adım yazacağız. Ancak testlere dalmadan önce, bazı önemli hesapları –özellikle `gameMaster` ve `treasury` hesaplarını– başlatmamız gerekiyor.

```typescript filename="rpg.ts"
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Rpg } from "../target/types/rpg";
import { assert } from "chai";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionSignature,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const GAME_SEED = "GAME";
const PLAYER_SEED = "PLAYER";
const MONSTER_SEED = "MONSTER";
const MAX_ITEMS_PER_PLAYER = 8;
const INITIAL_MONSTER_HITPOINTS = 100;
const AIRDROP_AMOUNT = 10 * LAMPORTS_PER_SOL;
const CREATE_PLAYER_ACTION_POINTS = 100;
const SPAWN_MONSTER_ACTION_POINTS = 5;
const ATTACK_MONSTER_ACTION_POINTS = 1;
const MONSTER_INDEX_BYTE_LENGTH = 8;

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.Rpg as Program<Rpg>;
const wallet = provider.wallet as NodeWallet;
const gameMaster = wallet;
const player = wallet;

const treasury = Keypair.generate();

const findProgramAddress = (seeds: Buffer[]): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(seeds, program.programId);

const confirmTransaction = async (
  signature: TransactionSignature,
  provider: anchor.Provider,
) => {
  const latestBlockhash = await provider.connection.getLatestBlockhash();
  const confirmationStrategy: TransactionConfirmationStrategy = {
    signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  };

  try {
    const confirmation =
      await provider.connection.confirmTransaction(confirmationStrategy);
    if (confirmation.value.err) {
      throw new Error(
        `İşlem başarısız oldu: ${confirmation.value.err.toString()}`,
      );
    }
  } catch (error) {
    throw new Error(`İşlem onayı başarısız: ${error.message}`);
  }
};

const createGameAddress = () =>
  findProgramAddress([Buffer.from(GAME_SEED), treasury.publicKey.toBuffer()]);

const createPlayerAddress = (gameAddress: PublicKey) =>
  findProgramAddress([
    Buffer.from(PLAYER_SEED),
    gameAddress.toBuffer(),
    player.publicKey.toBuffer(),
  ]);

const createMonsterAddress = (
  gameAddress: PublicKey,
  monsterIndex: anchor.BN,
) =>
  findProgramAddress([
    Buffer.from(MONSTER_SEED),
    gameAddress.toBuffer(),
    player.publicKey.toBuffer(),
    monsterIndex.toArrayLike(Buffer, "le", MONSTER_INDEX_BYTE_LENGTH),
  ]);

describe("RPG oyunu", () => {
  it("yeni bir oyun oluşturur", async () => {});

  it("yeni bir oyuncu oluşturur", async () => {});

  it("bir canavar doğurur", async () => {});

  it("bir canavara saldırır", async () => {});

  it("action points'ı aktarır", async () => {});
});
```

Şimdi `yeni bir oyun oluştur` testini ekleyelim. Sadece sekiz eşya ile `createGame` çağrısını yapın, tüm hesapları geçirtiğinizden emin olun ve `treasury` hesabının işlemi imzaladığını kontrol edin.

```typescript
it("yeni bir oyun oluşturur", async () => {
  try {
    const [gameAddress] = createGameAddress();

    const createGameSignature = await program.methods
      .createGame(MAX_ITEMS_PER_PLAYER)
      .accounts({
        game: gameAddress,
        gameMaster: gameMaster.publicKey,
        treasury: treasury.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([treasury])
      .rpc();

    await confirmTransaction(createGameSignature, provider);
  } catch (error) {
    throw new Error(`Oyunun oluşturulması başarısız oldu: ${error.message}`);
  }
});
```

Testinizin çalıştığını kontrol edin:

```typescript
yarn install
anchor test
```

:::warning
Eğer `yarn install` komutu bir şekilde bazı `.pnp.*` dosyaları ve hiç `node_modules` oluşturmadıysa, `rm -rf .pnp.*` komutunu takip eden `npm i` ve ardından `yarn install` komutunu çağırmayı deneyin. Bu işe yarayabilir.
:::

Artık her şey çalışıyorsa, `yeni bir oyuncu oluştur`, `bir canavar doğur` ve `bir canavara saldır` testlerini uygulayalım. Her bir testi tamamladığınızda çalıştığını doğrulayın.

```typescript
it("yeni bir oyuncu oluşturur", async () => {
  try {
    const [gameAddress] = createGameAddress();
    const [playerAddress] = createPlayerAddress(gameAddress);

    const createPlayerSignature = await program.methods
      .createPlayer()
      .accounts({
        game: gameAddress,
        playerAccount: playerAddress,
        player: player.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await confirmTransaction(createPlayerSignature, provider);
  } catch (error) {
    throw new Error(`Oyuncunun oluşturulması başarısız oldu: ${error.message}`);
  }
});

it("bir canavar doğurur", async () => {
  try {
    const [gameAddress] = createGameAddress();
    const [playerAddress] = createPlayerAddress(gameAddress);

    const playerAccount = await program.account.player.fetch(playerAddress);
    const [monsterAddress] = createMonsterAddress(
      gameAddress,
      playerAccount.nextMonsterIndex,
    );

    const spawnMonsterSignature = await program.methods
      .spawnMonster()
      .accounts({
        game: gameAddress,
        playerAccount: playerAddress,
        monster: monsterAddress,
        player: player.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await confirmTransaction(spawnMonsterSignature, provider);
  } catch (error) {
    throw new Error(`Canavar doğurma başarısız oldu: ${error.message}`);
  }
});

it("bir canavara saldırır", async () => {
  try {
    const [gameAddress] = createGameAddress();
    const [playerAddress] = createPlayerAddress(gameAddress);

    const playerAccount = await program.account.player.fetch(playerAddress);
    const [monsterAddress] = createMonsterAddress(
      gameAddress,
      playerAccount.nextMonsterIndex.subn(1),
    );

    const attackMonsterSignature = await program.methods
      .attackMonster()
      .accounts({
        playerAccount: playerAddress,
        monster: monsterAddress,
        player: player.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await confirmTransaction(attackMonsterSignature, provider);

    const monsterAccount = await program.account.monster.fetch(monsterAddress);
    assert(
      monsterAccount.hitpoints.eqn(INITIAL_MONSTER_HITPOINTS - 1),
      "Canavar hitpoint'ları saldırıdan sonra 1 azalmış olmalı",
    );
  } catch (error) {
    throw new Error(`Canavara saldırma başarısız oldu: ${error.message}`);
  }
});
```

Bu aşamada saldıracak canavarımızın `playerAccount.nextMonsterIndex.subn(1).toBuffer('le', 8)` olduğunu unutmayın. Bu, en son doğmuş canavarı saldırı için hedeflememizi sağlar. `nextMonsterIndex`'in altındaki herhangi bir şey olabilir. Son olarak, tohumlar sadece bir dizi bayt olduğu için, dizini u64 olarak, 8 baytta little-endian (le) formatında dönüştürmemiz gerekmektedir.

`anchor test` komutunu çalıştırın ve canavara zarar verin!

Son olarak, tüm yatırılan action points'ı toplamak için bir test yazalım. Bu test, yaptığı şeylere göre karmaşık gelebilir. Bunun nedeni, `depositActionPoints` işlevini çağıracağını gösteren yeni hesaplar oluşturmasıdır. Bu, bu oyunun sürekli çalışması halinde, bir tür zamanlayıcı botu gibi davranacak bir "clockwork" hesabı ile biraz daha mantıklı hale gelir.

```typescript
it("action points'ı aktarır", async () => {
  try {
    const [gameAddress] = createGameAddress();
    const [playerAddress] = createPlayerAddress(gameAddress);

    // Herkesin action points'ı aktarabileceğini göstermek için
    // Yani bunu bir clockwork botuna verin
    const clockworkWallet = anchor.web3.Keypair.generate();

    // Başlangıç bakiyesi vermek için
    const clockworkProvider = new anchor.AnchorProvider(
      program.provider.connection,
      new NodeWallet(clockworkWallet),
      anchor.AnchorProvider.defaultOptions(),
    );

    // Hesapları lamports ile beslemek zorunda kalacağız aksi takdirde işlem başarısız olacaktır
    const amountToInitialize = 10000000000;

    const clockworkAirdropTx =
      await clockworkProvider.connection.requestAirdrop(
        clockworkWallet.publicKey,
        amountToInitialize,
      );

    await confirmTransaction(clockworkAirdropTx, clockworkProvider);

    const treasuryAirdropTx = await clockworkProvider.connection.requestAirdrop(
      treasury.publicKey,
      amountToInitialize,
    );

    await confirmTransaction(treasuryAirdropTx, clockworkProvider);

    const depositActionPointsSignature = await program.methods
      .depositActionPoints()
      .accounts({
        game: gameAddress,
        player: playerAddress,
        treasury: treasury.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await confirmTransaction(depositActionPointsSignature, provider);

    const expectedActionPoints =
      CREATE_PLAYER_ACTION_POINTS +
      SPAWN_MONSTER_ACTION_POINTS +
      ATTACK_MONSTER_ACTION_POINTS;
    const treasuryBalance = await provider.connection.getBalance(
      treasury.publicKey,
    );
    assert(
      treasuryBalance === AIRDROP_AMOUNT + expectedActionPoints,
      "Hazine bakiyesi beklenen action points ile eşleşmelidir",
    );

    const gameAccount = await program.account.game.fetch(gameAddress);
    assert(
      gameAccount.actionPointsCollected.eqn(expectedActionPoints),
      "Oyun action points topladığı beklenen değerle eşleşmelidir",
    );

    const playerAccount = await program.account.player.fetch(playerAddress);
    assert(
      playerAccount.actionPointsSpent.eqn(expectedActionPoints),
      "Oyuncunun harcadığı action points beklenen değerle eşleşmelidir",
    );
    assert(
      playerAccount.actionPointsToBeCollected.eqn(0),
      "Oyuncunun toplanacak action points'i olmamalıdır",
    );
  } catch (error) {
    throw new Error(`Action points'ı aktarma başarısız oldu: ${error.message}`);
  }
});
```

Son olarak, her şeyin çalışıp çalışmadığını görmek için `anchor test` komutunu çalıştırın.

```bash
RPG oyunu
    ✔ yeni bir oyun oluşturur (317ms)
    ✔ yeni bir oyuncu oluşturur (399ms)
    ✔ bir canavar doğurur (411ms)
    ✔ bir canavara saldırır (413ms)
    ✔ action points'ı aktarır (1232ms)
```

Tebrikler! Bu çok şey kapsıyordu, ancak artık bir mini RPG oyun motoruna sahipsiniz. Her şey düzgün çalışmıyorsa, laboratuvarı geri dönüp nereye yanlış gittiğinizi kontrol edin. Gerekirse, [çözüm kodunun `main` dalına](https://github.com/solana-developers/anchor-rpg) başvurabilirsiniz.

:::note
Bu kavramları kendi programlarınızda uygulamak üzere kullanmayı unutmayın. Her küçük optimizasyon toplanır!
:::

## Zorluk

Şimdi bağımsız bir şekilde pratik yapma sırası sizde. Laboratuvar kodunu tekrar gözden geçirerek yapabileceğiniz ek optimizasyonlar ve/veya genişletmeler arayın. 

:::tip 
**Yardımcı Öneriler:** Eklemek istediğiniz yeni sistemler ve özellikler hakkında düşünün ve bunları nasıl optimize edebileceğinizi planlayın.
:::

Örnek modifikasyonların bazılarını [RPG deposunun `challenge-solution` dalında](https://github.com/solana-developers/anchor-rpg/tree/challenge-solution) bulabilirsiniz.

Son olarak, kendi programlarınızdan birini gözden geçirin ve bellek yönetimini, depolama boyutunu ve/veya eşzamanlılığı iyileştirecek optimizasyonlar üzerinde düşünün.

:::warning 
**Önemli Dikkat:** Kodunuzu optimize ederken, performans ile kullanılabilirlik arasında denge kurmayı unutmayın.
:::


Ek Bilgiler

Kod geliştirme sürecinde göz önünde bulundurmanız gereken bazı önemli noktalar:

- İşlevsellik ile karmaşıklık arasında denge kurun.
- Performans gereksinimlerinizi belirleyin.
- Kodunuzun sürdürülebilirliğini artıracak yöntemleri araştırın.



---


Kodunuzu GitHub'a gönderin ve

[bize bu derse ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=4a628916-91f5-46a9-8eb0-6ba453aa6ca6)!
