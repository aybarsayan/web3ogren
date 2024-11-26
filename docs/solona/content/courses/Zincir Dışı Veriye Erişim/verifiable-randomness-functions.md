---
title: Doğrulanabilir Rastgelelik Fonksiyonları
objectives:
  - Onchain rastgele sayı üretmenin sınırlamalarını açıklamak
  - Doğrulanabilir Rastgelelik nasıl çalışır açıklamak
  - Switchboard'un VRF oracle kuyruğunu kullanarak onchain bir programdan rastgelelik üretmek ve tüketmek
description: "Onchain programlarınızda uygun kriptografik rastgelelik kullanın."
---

## Özet

- Programınız içinde rastgelelik üretme girişimleri, onchain'de gerçek rastgelelik yokken kullanıcılar tarafından tahmin edilebilir.
- Doğrulanabilir Rastgele Fonksiyonlar (VRF'ler), geliştiricilere onchain programlarında güvenli bir şekilde üretilen rastgele sayıları entegre etme fırsatı sunar.
- VRF, çıktısının doğru hesaplandığını kanıtlayan bir genel anahtar psödo rastgele fonksiyondur.
- Switchboard, Solana ekosistemi için geliştirici dostu bir VRF sunar.

---

## Ders

### Onchain Rastgelelik

Rastgele sayılar **_doğal olarak_** onchain'de izin verilmez. Bunun nedeni Solana'nın deterministik olmasıdır, her doğrulayıcı kodunuzu çalıştırır ve aynı sonucu alması gerekir. Yani bir çekiliş programı oluşturmak istiyorsanız, rastgeleliği blockchain dışında aramak zorundasınız. İşte burada **Doğrulanabilir Rastgele Fonksiyonlar (VRF'ler)** devreye giriyor. VRF'ler, geliştiricilere merkezi olmayan bir şekilde onchain rastgelelik entegre etmenin güvenli bir yolunu sunar.

### Rastgelelik Türleri

Bir blockchain için rastgele sayıların nasıl üretileceğine dalmadan önce, öncelikle geleneksel bilgisayar sistemlerinde nasıl üretildiğini anlamalıyız. Gerçekten iki tür rastgele sayı vardır: _gerçek rastgele_ ve _psödo rastgele_. Aralarındaki fark, sayıların nasıl üretildiğindedir.

Bilgisayarlar, dış dünyadan bir tür fiziksel ölçüm alarak _gerçek rastgele_ sayılar elde edebilirler. Bu ölçümler, elektronik gürültü, radyoaktif bozulma veya atmosferik gürültü gibi doğal olaylardan yararlanarak rastgele veriler üretir. Bu süreçler içsel olarak öngörülemez olduğundan, ürettikleri sayılar gerçekten rastgele ve tekrar edilemez.

Öte yandan, _psödo rastgele_ sayılar, rastgele gibi görünen sayı dizileri üretmek için deterministik bir süreç kullanan algoritmalar tarafından üretilir. Psödo rastgele sayı üreteçleri (PRNG'ler), bir başlangıç değeri olan bir tohumla başlar ve ardından sayı dizisindeki sonraki sayıları üretmek için matematiksel formüller kullanır. Aynı tohum kullanıldığında, bir PRNG her zaman aynı sayı dizisini üretir. Gerçek entropiye yakın bir şeyle tohumlamak önemlidir: bir yönetici tarafından sağlanan "rastgele" girdi, son sistem kaydı, sistem saatinizin zamanı ve diğer faktörlerin bir kombinasyonu vb. 

:::note
Eğlenceli bir gerçek: eski video oyunları, hız koşucularının rastgeleliklerinin nasıl hesaplandığını bulmaları nedeniyle kırıldı. Özellikle bir oyun, oyundaki attığınız adım sayısını bir tohum olarak kullanıyordu.
:::

Maalesef, bu iki tür rastgelelik de Solana programlarında doğal olarak mevcut değildir, çünkü bu programlar deterministik olmalıdır. 

> **Önemli Not:**
> Tüm doğrulayıcıların aynı sonuca ulaşması gerekir. Hepsinin aynı rastgele sayıyı seçmesi imkansızdır ve bir tohum kullanırlarsa, saldırılara maruz kalacaktır. 
> 
> Daha fazla bilgi için [Solana SSS](https://solana.com/docs/programs/lang-rust#depending-on-rand) sayfasına göz atın. 

Bu nedenle rastgelelik için VRF'lerle blockchain dışına bakmamız gerekecek.

---

### Doğrulanabilir Rastgelelik Nedir?

Bir Doğrulanabilir Rastgele Fonksiyonu (VRF), çıktısının doğru hesaplandığını kanıtlayan bir genel anahtar psödo rastgele fonksiyondur. Bu, bir dağıtımcıyla birlikte bir rastgele sayı üretmek için bir kriptografik anahtar çiftinin kullanılabileceği anlamına gelir, bu da daha sonra herhangi biri tarafından doğrulanabilir; böylece değer doğru hesaplandığında üreticinin gizli anahtarının sızma olasılığı yoktur. Doğrulandığında, rastgele değer bir hesapta onchain olarak saklanır.

VRF'ler, bir blockchain üzerinde doğrulanabilir ve öngörülemez rastgelelik sağlamak için kritik bir bileşendir ve geleneksel PRNG'lerin bazı eksikliklerini ve merkezi olmayan bir sistemde gerçek rastgeleliği elde etme zorluklarını ele alır.

#### VRF'nin Temel Özellikleri

Bir VRF'nin üç temel özelliği vardır:

1. **Deterministik** - Bir VRF, bir gizli anahtar ve bir nonce'i girdi olarak alır ve deterministik olarak bir çıktı üretir. Sonuç, görünüşte rastgele bir değerdir. Aynı gizli anahtar ve nonce verildiğinde, VRF her zaman aynı çıktıyı üretir. Bu özellik, rastgele değerin herkes tarafından tekrar üretilebilmesi ve doğrulanabilmesini sağlar.
2. **Öngörülemezlik** - Bir VRF'nin çıktısı, gizli anahtara erişimi olmayan herkes için gerçek rastgelelikten ayırt edilemez görünmektedir. Bu özellik, VRF'nin deterministik olsa bile, girdilerin bilgisi olmadan sonucu önceden tahmin edemeyeceğinizi sağlar.
3. **Doğrulanabilirlik** - Herkes, uygun gizli anahtar ve nonce kullanarak bir VRF tarafından üretilen rastgele değerinin geçerliliğini doğrulayabilir.

VRF'ler, yalnızca Solana'ya özgü değildir ve diğer blockchainlerde psödo rastgele sayılar üretmek için kullanılmıştır. Neyse ki, Switchboard, Solana için VRF'nin uygulanmasını sunmaktadır.

---

### Switchboard VRF Uygulaması

Switchboard, Solana'da VRF'ler sunan merkezi olmayan bir Oracle ağdır. Oracle'lar, bir blockchain'e dış veriler sağlayan hizmetlerdir, böylece gerçek dünya olaylarıyla etkileşime geçebilirler. Switchboard ağı, dış verileri ve onchain hizmet taleplerini sağlamak için üçüncü taraflar tarafından işletilen birçok farklı bireysel oracaldan oluşmaktadır. 

:::tip
Switchboard'un Oracle ağı hakkında daha fazla bilgi edinmek için lütfen `Oracle dersi` sayfasına bakın.
:::

Switchboard'un VRF'si kullanıcıların onchain rastgelelik çıkışı üretmesi için bir oracle talep etmesine olanak tanır. Bir oracle talep atandığında, VRF sonucunun kanıtının onchain'de doğrulanması gerekir. VRF kanıtının tam olarak onchain'de doğrulanması 276 talimat (~48 işlem) alır. Kanıt doğrulandığında, Switchboard programı, VRF Hesabı tarafından hesap oluşturma sırasında tanımlanan bir onchain geri çağırmayı gerçekleştirecektir. Buradan program rastgele veriyi tüketebilir.

Ödeme nasıl alındığını merak ediyor olabilirsiniz. Switchboard'un VRF uygulamasında, her talep için ödeme yapıyorsunuz.

---

### VRF Talep Etme ve Tüketme

Artık bir VRF'nin ne olduğunu ve Switchboard Oracle ağına nasıl uyduğunu bildiğimize göre, Solana programından rastgeleliği nasıl talep edip tüketebileceğimize daha yakından bakalım. Yüksek seviyede, Switchboard'dan rastgelelik talep etme ve tüketme süreci şu şekilde görünmektedir:

1. Program yetkisi olarak kullanılacak bir `programAuthority` PDA oluşturun ve program adına imzala.
2. `programAuthority`yı otorite olarak belirterek bir Switchboard VRF Hesabı oluşturun ve VRF'nin veriyi geri döneceği `callback` fonksiyonunu belirtin.
3. Switchboard programında `request_randomness` talimatını çağırın. Program, VRF talebimize bir oracle atayacaktır.
4. Oracle, talebi yönlendirir ve Switchboard programına gizli anahtarı kullanarak hesaplanan kanıtla yanıt verir.
5. Oracle, VRF kanıtını doğrulamak için 276 talimatı yürütür.
6. VRF kanıtı doğrulandığında, Switchboard programı, ilk talepte geri çağrılan `callback` fonksiyonunu, Oracle'dan dönen psödo rastgele sayı ile çağıracaktır.
7. Program, rastgele sayıyı tüketir ve bununla iş mantığını çalıştırabilir!

Burada birçok adım var, ama endişelenmeyin, sürecin her adımına detaylı bir şekilde geçeceğiz.

:::warning 
Öncelikle rastgelelik talep etmek için kendimizin oluşturması gereken birkaç hesap var, özellikle `authority` ve `vrf` hesapları. 
:::

`authority` hesabı, rastgelelik talep eden programımızdan türetilmiş bir PDA'dır. Oluşturduğumuz PDA, kendi ihtiyaçlarımız için kendi tohumlarımıza sahip olacaktır. Şimdilik, bunları sadece `VRFAUTH` olarak ayarlayacağız.

```typescript
// PDA oluştur
[vrfAuthorityKey, vrfAuthoritySecret] =
  anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("VRFAUTH")],
    program.programId,
  );
```

Ardından, Switchboard programı tarafından sahip olunan bir `vrf` hesabını başlatmamız ve yeni türettiğimiz PDA'yı otorite olarak işaretlememiz gerekiyor. `vrf` hesabının aşağıdaki veri yapısı vardır.

```rust
pub struct VrfAccountData {
    /// VRF hesabının mevcut durumu.
    pub status: VrfStatus,
    /// VRF turlarını izlemek için artan sayaç.
    pub counter: u128,
    /// Hesap değişiklikleri yapmak için yetkilendirilen onchain hesap. <-- Bu bizim PDA'mız
    pub authority: Pubkey,
    /// VRF güncelleme talebini yerine getirmek için atanmış OracleQueueAccountData.
    pub oracle_queue: Pubkey,
    /// VRF güncelleme talebi için fonları tutacak olan token hesabı.
    pub escrow: Pubkey,
    /// Bir güncelleme talebi başarıyla doğrulandığında çağrılan geri çağırma.
    pub callback: CallbackZC,
    /// VRF güncelleme talebi için atanan oracle sayısı.
    pub batch_size: u32,
    /// VRF krank eylemleri arasındaki ara durumu içeren yapı.
    pub builders: [VrfBuilder; 8],
    /// Yaratıcıların sayısı.
    pub builders_len: u32,
    pub test_mode: bool,
    /// Geçerli turda henüz geçerli sayılmamış güncelleme talebinden oracle sonuçları.
    pub current_round: VrfRound,
    /// Gelecek bilgi için ayrılmış.
    pub _ebuf: [u8; 1024],
}
```

Bu hesapta önemli alanlar `authority`, `oracle_queue` ve `callback`'dir. `authority`, bu `vrf` hesabında rastgelelik talep edebilme yetkisine sahip programın bir PDA'sıdır. Böylece yalnızca o program, vrf talebi için gereken imzayı sağlayabilir. `oracle_queue` alanı, bu hesapla yapılan vrf taleplerinin hizmet vermesini istediğiniz belirli oracle kuyruğunu belirtmenizi sağlar. 

:::info
Switchboard'daki oracle kuyruklarıyla tanış değilseniz, `Bağlantı kurma veri dersi` sayfasına göz atın! 
:::

Son olarak, `callback` alanı, rastgelelik sonucunun doğrulanmasının ardından Switchboard programının çağıracağı geri çağırma talimatını tanımladığınız yerdir.

`callback` alanı
`[CallbackZC](https://github.com/switchboard-xyz/solana-sdk/blob/9dc3df8a5abe261e23d46d14f9e80a7032bb346c/rust/switchboard-solana/src/oracle_program/accounts/ecvrf.rs#L25)` türündedir.

```rust
#[zero_copy(unsafe)]
#[repr(packed)]
pub struct CallbackZC {
    /// Çağrılan geri çağırma programının program kimliği.
    pub program_id: Pubkey,
    /// Geri çağırma talimatında kullanılan hesaplar.
    pub accounts: [AccountMetaZC; 32],
    /// Geri çağırmada kullanılan hesapların sayısı.
    pub accounts_len: u32,
    /// Serileştirilmiş talimat verisi.
    pub ix_data: [u8; 1024],
    /// Talimat verisindeki serileştirilmiş bayt sayısı.
    pub ix_data_len: u32,
}
```

İşte bu, istemci tarafında Geri Arama yapısını tanımlama şekli.

```typescript
// örnek
import Callback from '@switchboard-xyz/solana.js'
...
...

const vrfCallback: Callback = {
      programId: program.programId,
      accounts: [
        // consumeRandomness'e tüm hesapların doldurulduğundan emin olun
        { pubkey: clientState, isSigner: false, isWritable: true },
        { pubkey: vrfClientKey, isSigner: false, isWritable: true },
        { pubkey: vrfSecret.publicKey, isSigner: false, isWritable: true },
      ],
      // talimatın adını kullanın
      ixData: vrfIxCoder.encode("consumeRandomness", ""), // burada talimat için herhangi bir parametre geçin
    }
```

Şimdi, `vrf` hesabını oluşturabilirsiniz.

```typescript
// Switchboard VRF oluştur
[vrfAccount] = await switchboard.queue.createVrf({
  callback: vrfCallback,
  authority: vrfAuthorityKey, // vrf yetkisi
  vrfKeypair: vrfSecret,
  enable: !queue.unpermissionedVrfEnabled, // yalnızca gerekliyse izinleri ayarlayın
});
```

Artık gerekli tüm hesaplara sahip olduğumuza göre, sonunda Switchboard programında `request_randomness` talimatını çağırabiliriz. Önemli olan, `request_randomness` talimatını bir istemcide veya bir program içinde çapraz program çağrımı (CPI) ile çağırabileceğinizi belirtmektir. 

:::tip
Bu isteği yapmak için gereken hesaplara bir göz atmak üzere gerçek [Switchboard programı](https://github.com/switchboard-xyz/solana-sdk/blob/fbef37e4a78cbd8b8b6346fcb96af1e20204b861/rust/switchboard-solana/src/oracle_program/instructions/vrf_request_randomness.rs#L8) içinde Hesap yapısı tanımını kontrol edelim.
:::

```rust
// Switchboard programından
// https://github.com/switchboard-xyz/solana-sdk/blob/fbef37e4a78cbd8b8b6346fcb96af1e20204b861/rust/switchboard-solana/src/oracle_program/instructions/vrf_request_randomness.rs#L8

pub struct VrfRequestRandomness<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf: AccountInfo<'info>,
    #[account(mut)]
    pub oracle_queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub data_buffer: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [
            b"PermissionAccountData",
            queue_authority.key().as_ref(),
            oracle_queue.key().as_ref(),
            vrf.key().as_ref()
        ],
        bump = params.permission_bump
    )]
    pub permission: AccountInfo<'info>,
    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, constraint = payer_wallet.owner == payer_authority.key())]
    pub payer_wallet: Account<'info, TokenAccount>,
    #[account(signer)]
    pub payer_authority: AccountInfo<'info>,
    pub recent_blockhashes: AccountInfo<'info>,
    #[account(seeds = [b"STATE"], bump = params.state_bump)]
    pub program_state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}
```

Rastgelelik talebi için gereken tüm hesaplar bunlar, şimdi bunu bir Solana programında CPI üzerinden nasıl göründüğüne bakalım. Bunu yapmak için, 
[SwitchboardV2 rust crate](https://github.com/switchboard-xyz/solana-sdk/blob/main/rust/switchboard-solana/src/oracle_program/instructions/vrf_request_randomness.rs)'den `VrfRequestRandomness` veri yapısını kullanıyoruz. Bu yapı, burada işleri bizim için kolaylaştıran yerleşik yeteneklere sahiptir; özellikle hesap yapısı tanımlanmıştır ve `invoke` veya `invoke_signed` nesnesini çağırabiliriz.

```rust
// istemci programımız
use switchboard_v2::VrfRequestRandomness;
use state::*;

pub fn request_randomness(ctx: Context<RequestRandomness>, request_params: RequestRandomnessParams) -> Result <()> {
	let switchboard_program = ctx.accounts.switchboard_program.to_account_info();

	let vrf_request_randomness = VrfRequestRandomness {
	    authority: ctx.accounts.vrf_state.to_account_info(),
	    vrf: ctx.accounts.vrf.to_account_info(),
	    oracle_queue: ctx.accounts.oracle_queue.to_account_info(),
	    queue_authority: ctx.accounts.queue_authority.to_account_info(),
	    data_buffer: ctx.accounts.data_buffer.to_account_info(),
	    permission: ctx.accounts.permission.to_account_info(),
	    escrow: ctx.accounts.switchboard_escrow.clone(),
	    payer_wallet: ctx.accounts.payer_wallet.clone(),
	    payer_authority: ctx.accounts.user.to_account_info(),
	    recent_blockhashes: ctx.accounts.recent_blockhashes.to_account_info(),
	    program_state: ctx.accounts.program_state.to_account_info(),
	    token_program: ctx.accounts.token_program.to_account_info(),
	};

	msg!("rastgelelik talep ediliyor");
	vrf_request_randomness.invoke_signed(
	    switchboard_program,
	    request_params.switchboard_state_bump,
	    request_params.permission_bump,
	    state_seeds,
	)?;

...

Ok(())
}
```

Switchboard programı çağrıldığında, kendi içinde bazı mantıklar yapar ve `vrf` hesabındaki tanımlanmış oracle kuyruğunda rastgelelik talebini karşılamak için bir oracle atar. Atanan oracle ardından rastgele bir değer hesaplar ve bunu Switchboard programına geri gönderir.

Sonuç doğrulandığında, Switchboard programı daha sonra `vrf` hesabında tanımlanan geri çağırma talimatını çağırır. Geri çağırma talimatı, rastgele sayılar kullanarak iş mantığınızı yazmış olacağınız yerdir.

---

```rust
// istemci programımız

# [derive(Accounts)]
pub struct ConsumeRandomness<'info> {
    // vrf client state
    #[account]
    pub vrf_auth: AccountLoader<'info, VrfClientState>,
    // switchboard vrf account
    #[account(
        mut,
        constraint = vrf.load()?.authority == vrf_auth.key() @ EscrowErrorCode::InvalidVrfAuthorityError
    )]
    pub vrf: AccountLoader<'info, VrfAccountData>
}

pub fn handler(ctx: Context<ConsumeRandomness>) -> Result<()> {
    msg!("Rastgelelik tüketiliyor!");

    // vrf hesap verilerini yükle
    let vrf = ctx.accounts.vrf.load()?;
    // rastgelelik sonuçlarını almak için get_result yöntemini kullan
    let result_buffer = vrf.get_result()?;

    // sonuç tamponunun tamamen 0 olup olmadığını kontrol et
    if result_buffer == [0u8; 32] {
        msg!("vrf tamponu boş");
        return Ok(());
    }

    msg!("Sonuç tamponu {:?}", result_buffer);
    // rastgele değeri istediğiniz gibi kullanın

    Ok(())
}

> **Not:** Artık rastgelelik elde ettiniz! Hooray! Ama henüz tartışmadığımız bir şey var ve o da rastgelelik sonuçlarının nasıl döndüğüdür. Switchboard, rastgeleliğinizi sağlamak için 
> [`get_result()`](https://github.com/switchboard-xyz/solana-sdk/blob/9dc3df8a5abe261e23d46d14f9e80a7032bb346c/rust/switchboard-solana/src/oracle_program/accounts/vrf.rs#L122) metodunu çağırarak bunu yapar.  
> — *Daha fazla bilgi için geçerli Switchboard belgelerine bakınız.*  

Bu yöntem, `vrf` hesabının `current_round.result` alanını SwitchboardDecimal formatında döndürür, bu aslında 32 rastgele 
[`u8`](https://github.com/switchboard-xyz/solana-sdk/blob/9dc3df8a5abe261e23d46d14f9e80a7032bb346c/rust/switchboard-solana/src/oracle_program/accounts/ecvrf.rs#L65C26-L65C26) işaretsiz tam sayılarından oluşan bir tampon alanıdır. Bu işaretsiz tam sayıları programınızda istediğiniz gibi kullanabilirsiniz, ancak oldukça yaygın bir yöntem, tampon içindeki her bir tam sayıyı bir rastgele sayı olarak ele almaktır. Örneğin, eğer bir zar atışı (1-6) istiyorsanız, dizinin ilk baytını alıp 6 ile modlayıp bir ekleyebilirsiniz.

```rust
// ilk değeri saklamak için bayt dilimini oluştur
let dice_roll = (result_buffer[0] % 6) + 1;
```

Rastgele değerlerle ne yapacağınız tamamen size kalmış!

---

## Switchboard VRF ile rastgelelik talep etmenin özü budur. 
VRF talep sürecinde yer alan adımları hatırlamak için bu diyagrama bakın.
![VRF Diagram](../../../images/solana/public/assets/courses/unboxed/vrf-diagram.png)

## Laboratuvar

Bu dersin laboratuvarı için, `Oracle dersi` ile kaldığımız yerden devam edeceğiz. Oracle dersini ve demolarını tamamlamadıysanız, bunu kesinlikle yapmanızı öneririz çünkü birçok örtüşen kavram var ve Oracle dersinin kod tabanından başlayacağız.

> **İpucu:** Oracle dersini tamamlamak istemiyorsanız, bu laboratuvar için başlangıç kodu sizin için sağlanmıştır [lab Github deposunun ana dalında](https://github.com/solana-developers/burry-escrow).

Repo, "Michael Burry" adında bir escrow programı içermektedir. Bu, bir kullanıcının belirli bir fiyat belirlediği kadar SOL'unu kilitlemesine olanak tanıyan bir programdır. Bu programa VRF işlevselliği ekleyeceğiz, böylece kullanıcı "hapisten çıkabilir". Bugün gerçekleştireceğimiz demo, kullanıcının iki sanal zar atmasına izin verecek; eğer zarlar eşleşirse (iki zar aynı olursa), kullanıcı SOL fiyatına bakılmaksızın fonlarını escrow'dan çekebilir.

---

#### 1. Program Kurulumu

Önceki dersten repo klonluyorsanız, aşağıdakileri yaptığınızdan emin olun:

1. `git clone https://github.com/solana-developers/burry-escrow`
2. `cd burry-escrow`
3. `anchor build`
4. `anchor keys list`
   1. Elde edilen anahtarı `Anchor.toml` ve `programs/burry-escrow/src/lib.rs` dosyasına yerleştirin
5. `solana config get`
   1. **Anahtar Çifti Yolu** alanını alın ve `Anchor.toml` dosyasındaki `wallet` alanını değiştirin
6. `yarn install`
7. `anchor test`

Tüm testler geçtikten sonra başlamak için hazırız. Önce bazı başlangıç yapılarını doldurarak başlayacağız, ardından işlevleri uygulayacağız.

#### 2. Cargo.toml

Öncelikle, VRF, ücretleri için SPL jetonları kullandığından, `Cargo.toml` dosyamıza `anchor-spl`'yi eklememiz gerekiyor.

```typescript
[dependencies]
anchor-lang = "0.28.0"
anchor-spl = "0.28.0"
switchboard-v2 = "0.4.0"
```

#### 3. Lib.rs

Sonraki adımda, `lib.rs`'yi düzenleyerek bugün inşa edeceğimiz ek işlevleri ekleyeceğiz. İşlevler aşağıdaki gibidir:

- `init_vrf_client` - VRF yetkisi PDA'sını oluşturur, bu da rastgeleliği imzalayıp tüketir.
- `get_out_of_jail` - VRF'den rastgelelik talep eder, aslında zar atar.
- `consume_randomness` - Zar atışlarını kontrol edeceğimiz VRF için geri çağırma işlevi.

```rust
use anchor_lang::prelude::*;
use instructions::deposit::*;
use instructions::withdraw::*;
use instructions::init_vrf_client::*;
use instructions::get_out_of_jail::*;
use instructions::consume_randomness::*;

pub mod instructions;
pub mod state;
pub mod errors;

declare_id!("YOUR_KEY_HERE");

#[program]
mod burry_escrow {

    use crate::instructions::init_vrf_client::init_vrf_client_handler;

    use super::*;

    pub fn deposit(ctx: Context, escrow_amt: u64, unlock_price: f64) -> Result {
        deposit_handler(ctx, escrow_amt, unlock_price)
    }

    pub fn withdraw(ctx: Context) -> Result {
        withdraw_handler(ctx)
    }

    pub fn init_vrf_client(ctx: Context) -> Result{
        init_vrf_client_handler(ctx)
    }

    pub fn get_out_of_jail(ctx: Context, params: RequestRandomnessParams) -> Result{
        get_out_of_jail_handler(ctx, params)
    }

    pub fn consume_randomness(ctx: Context) -> Result{
        consume_randomness_handler(ctx)
    }
}
```

`YOUR_KEY_HERE` kısmını kendi program anahtarınızla değiştirmeyi unutmayın.

#### 4. State.rs

Sonraki adımda, `state.rs` dosyasına `EscrowState` için bir `out_of_jail` bayrağı ekleyin. İki eşleşen zar attığımızda, bu bayrağı çevireceğiz. `withdraw` işlevi çağrıldığında, fiyatı kontrol etmeden fonları transfer edebiliriz.

```rust
// state.rs
#[account]
pub struct EscrowState {
    pub unlock_price: f64,
    pub escrow_amount: u64,
    pub out_of_jail: bool
}
```

Ardından, bu program için ikinci veri hesabımızı oluşturun: `VrfClientState`. Bu, zar atışlarımızın durumunu tutacaktır. Aşağıdaki alanlara sahip olacaktır:

- `bump` - Hesabın imzasını kolaylaştırmak için hesabın bump'ını depolar.
- `result_buffer` - VRF fonksiyonunun ham rastgelelik verilerini dökeceği yerdir.
- `dice_type` - Bunu 6 olarak ayarlayacağız, yani 6 yüzlüdür.
- `die_result_1` ve `die_result_2` - Zar atışlarımızın sonuçlarıdır.
- `timestamp` - Son zar atışımızın zamanını takip eder.
- `vrf` - VRF hesabının genel anahtarıdır; Switchboard programı tarafından sahibidir. `VrfClientState`'in inicializasyon fonksiyonunu çağırmadan önce bunu oluşturacağız.
- `escrow` - Burry escrow hesabımızın genel anahtarıdır.

> **Uyarı:** Ayrıca, `VrfClientState` bağlamını `zero_copy` yapısını yapacağız. Bu, `load_init()` ile başlatılacağı ve `AccountLoader` ile hesaplara geçirileceği anlamına gelir. Bunu, VRF fonksiyonlarının çok hesap yoğun olması ve yığın üzerinde dikkatli olmamız gerektiğinden yapıyoruz. `zero_copy` hakkında daha fazla bilgi edinmek istiyorsanız, 
> `Program Mimarisi dersi` göz atın.

```rust
// state.rs

#[repr(packed)]
#[account(zero_copy(unsafe))]
#[derive(Default)]
pub struct VrfClientState {
    pub bump: u8,
    pub result_buffer: [u8; 32],
    pub dice_type: u8, // 6 yüzlü
    pub die_result_1: u8,
    pub die_result_2: u8,
    pub timestamp: i64,
    pub vrf: Pubkey,
    pub escrow: Pubkey
}
```

Son olarak, PDA'mıza `VRF_STATE_SEED`'i ekleyeceğiz, VRF Client hesabı için.

```rust
pub const VRF_STATE_SEED: &[u8] = b"VRFCLIENT";
```

`state.rs` dosyanız bu şekilde görünmelidir:

```rust
use anchor_lang::prelude::*;

pub const ESCROW_SEED: &[u8] = b"MICHAEL BURRY";
pub const VRF_STATE_SEED: &[u8] = b"VRFCLIENT";
pub const SOL_USDC_FEED: &str = "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR";

#[account]
pub struct EscrowState {
    pub unlock_price: f64,
    pub escrow_amount: u64,
    pub out_of_jail: bool
}

#[repr(packed)]
#[account(zero_copy(unsafe))]
#[derive(Default)]
pub struct VrfClientState {
    pub bump: u8,
    pub result_buffer: [u8; 32],
    pub dice_type: u8, // 6 yüzlü
    pub die_result_1: u8,
    pub die_result_2: u8,
    pub timestamp: i64,
    pub vrf: Pubkey,
    pub escrow: Pubkey
}
```

#### 5. Errors.rs

Sonraki adımda, `errors.rs` dosyasına bir son hata ekleyelim, `InvalidVrfAuthorityError`. Bunu VRF yetkisi yanlış olduğunda kullanacağız.

```rust
use anchor_lang::prelude::*;

#[error_code]
#[derive(Eq, PartialEq)]
pub enum EscrowErrorCode {
    #[msg("Geçerli bir Switchboard hesabı değil")]
    InvalidSwitchboardAccount,
    #[msg("Switchboard beslemesi 5 dakikadır güncellenmedi")]
    StaleFeed,
    #[msg("Switchboard beslemesi sağlanan güven aralığını aştı")]
    ConfidenceIntervalExceeded,
    #[msg("Geçerli SOL fiyatı Escrow kilit fiyatının üzerinde değil.")]
    SolPriceAboveUnlockPrice,
    #[msg("Switchboard VRF Hesabının yetkisi, istemcinin durumun genel anahtarına ayarlanmalıdır")]
    InvalidVrfAuthorityError,
}
```

#### 6. Mod.rs

Şimdi, yeni yazacağımız işlevleri içermek için `mod.rs` dosyamızı değiştirelim.

```rust
pub mod deposit;
pub mod withdraw;
pub mod init_vrf_client;
pub mod get_out_of_jail;
pub mod consume_randomness;
```

#### 7. Deposit.rs ve Withdraw.rs

Son olarak, `deposit.rs` ve `withdraw.rs` dosyalarımızı yeni güçlerimizi yansıtacak şekilde güncelleyelim.

Öncelikle, `deposit.rs` içinde `out_of_jail` bayrağımızı `false` olarak başlatıyoruz.

```rust
// deposit.rs'da
...
let escrow_state = &mut ctx.accounts.escrow_account;
    escrow_state.unlock_price = unlock_price;
    escrow_state.escrow_amount = escrow_amount;
    escrow_state.out_of_jail = false;
...
```

Ardından, basit hapisten çıkma mantığımızı yazalım. Oracle fiyat kontrollerimizi bir `if` ifadesiyle saralım. `escrow_state` hesabındaki `out_of_jail` bayrağı `false` ise, o zaman SOL'un kilidini açmak için fiyat kontrolüne geçiyoruz:

```rust
if !escrow_state.out_of_jail {
      // sonuç al
      let val: f64 = feed.get_result()?.try_into()?;

      // beslemenin son 300 saniyede güncellenip güncellenmediğini kontrol et
      feed.check_staleness(Clock::get().unwrap().unix_timestamp, 300)
      .map_err(|_| error!(EscrowErrorCode::StaleFeed))?;

      msg!("Geçerli besleme sonucu {}!", val);
      msg!("Açılma fiyatı {}", escrow_state.unlock_price);

      if val  {
    #[account(mut)]
    pub user: Signer,
    // burry escrow hesabı
    #[account(
        mut,
        seeds = [ESCROW_SEED, user.key().as_ref()],
        bump,
    )]
    pub escrow_account: Account,
    // vrf client durumu
    #[account(
        init,
        seeds = [
            VRF_STATE_SEED,
            user.key.as_ref(),
            escrow_account.key().as_ref(),
            vrf.key().as_ref(),
        ],
        payer = user,
        space = 8 + std::mem::size_of::(),
        bump
    )]
    pub vrf_state: AccountLoader,

    // switchboard vrf hesabı
    #[account(
        mut,
        constraint = vrf.load()?.authority == vrf_state.key() @ EscrowErrorCode::InvalidVrfAuthorityError
    )]
    pub vrf: AccountLoader,
    pub system_program: Program
}
```

`vrf_state` hesabının, `VRF_STATE_SEED` stringi ve `user`, `escrow_account` ile `vrf` genel anahtarları ile türetildiğini gözlemleyin. Bu, tek bir kullanıcının yalnızca bir `vrf_state` hesabı başlatabileceği anlamına gelir; tam olarak aynı şekilde sadece bir `escrow_account` sahibi olabilir. Sadece bir tane olduğundan, eğer titiz olmak isterseniz, kirayı geri alabilmeniz için bir `close_vrf_state` işlevi uygulamayı düşünebilirsiniz.

Şimdi bu işlev için bazı temel başlatma mantığı yazalım. Öncelikle, `vrf_state` hesabını `load_init()` ile yükleyip başlatıyoruz. Ardından her bir alanın değerlerini dolduruyoruz.

```rust
pub fn init_vrf_client_handler(ctx: Context) -> Result {
    msg!("init_client validate");

    let mut vrf_state = ctx.accounts.vrf_state.load_init()?;
    *vrf_state = VrfClientState::default();
    vrf_state.bump = ctx.bumps.get("vrf_state").unwrap().clone();
    vrf_state.escrow = ctx.accounts.escrow_account.key();
    vrf_state.die_result_1 = 0;
    vrf_state.die_result_2 = 0;
    vrf_state.timestamp = 0;
    vrf_state.dice_type = 6; // yüzlü

    Ok(())
}
```

#### 9. Hapisten Çık

Artık `VrfClientState` hesabını başlattığımıza göre, bunu `get_out_jail` talimatında kullanabiliriz. `/instructions` klasöründe `get_out_of_jail.rs` adında yeni bir dosya oluşturalım.

`get_out_jail` talimatı, Switchboard'a VRF talebimizi yapacak. Hem VRF talebi için hem de iş mantığı geri çağırma işlevimiz için gereken tüm hesapları geçmemiz gerekecek.

VRF Hesapları:

- `payer_wallet` - VRF talebi için ödeme yapacak token cüzdanı; kullanıcının bu hesabın sahibi olması gerekir.
- `vrf` - İstemci tarafından oluşturulan VRF hesabı.
- `oracle_queue` - rastgelelik sonucunu iletecek oracle kuyruğu.
- `queue_authority` - kuyruğun yetkisi.
- `data_buffer` - kuyruğun rastgelelik hesaplamak/doğrulamak için kullandığı veri tamponu hesabı.
- `permission` - `vrf` hesabı oluşturulduğunda oluşturulur. Diğer hesaplardan türetilmiştir.
- `switchboard_escrow` - Payer'ın tokenleri gönderdiği yer.
- `program_state` - Switchboard programının durumu.

Programlar:

- `switchboard_program`
- `recent_blockhashes`
- `token_program`
- `system_program`

İş Mantığı Hesapları:

- `user` - Fonları escrow'da olan kullanıcı hesabı.
- `escrow_account` - Kullanıcının burry escrow durum hesabı.
- `vrf_state` - `init_vrf_client` talimatında başlatılan VRF client durumu hesabı.

```rust
use crate::state::*;
use crate::errors::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::*;
use switchboard_v2::{VrfAccountData, OracleQueueAccountData, PermissionAccountData, SbState, VrfRequestRandomness};
use anchor_spl::token::{TokenAccount, Token};

#[derive(Accounts)]
pub struct RequestRandomness {
    // ÖDEME HESAPLARI
    #[account(mut)]
    pub user: Signer,
    #[account(mut,
        constraint =
            payer_wallet.owner == user.key()
            && switchboard_escrow.mint == program_state.load()?.token_mint
    )]
    pub payer_wallet: Account,
    // burry escrow hesabı
    #[account(
        mut,
        seeds = [ESCROW_SEED, user.key().as_ref()],
        bump,
    )]
    pub escrow_account: Account,
    // vrf client durumu
    #[account(
        mut,
        seeds = [
            VRF_STATE_SEED,
            user.key.as_ref(),
            escrow_account.key().as_ref(),
            vrf.key().as_ref(),
        ],
        bump
    )]
    pub vrf_state: AccountLoader,
    // switchboard vrf hesabı
    #[account(
        mut,
        constraint = vrf.load()?.authority == vrf_state.key() @ EscrowErrorCode::InvalidVrfAuthorityError
    )]
    pub vrf: AccountLoader,
    // switchboard hesapları
    #[account(mut,
        has_one = data_buffer
    )]
    pub oracle_queue: AccountLoader,
    /// KONTROL:
    #[account(
        mut,
        constraint = oracle_queue.load()?.authority == queue_authority.key()
    )]
    pub queue_authority: UncheckedAccount,
    /// KONTROL
    #[account(mut)]
    pub data_buffer: AccountInfo,
    #[account(mut)]
    pub permission: AccountLoader,
    #[account(mut,
        constraint = switchboard_escrow.owner == program_state.key() && switchboard_escrow.mint == program_state.load()?.token_mint
    )]
    pub switchboard_escrow: Account,
    #[account(mut)]
    pub program_state: AccountLoader,
    /// KONTROL:
    #[account(
        address = *vrf.to_account_info().owner,
        constraint = switchboard_program.executable == true
    )]
    pub switchboard_program: AccountInfo,
    // SİSTEM HESAPLARI
    /// KONTROL:
    #[account(address = recent_blockhashes::ID)]
    pub recent_blockhashes: AccountInfo,
    pub token_program: Program,
    pub system_program: Program
}

# Frequency Guidelines

## 1. Strategic Use of Admonitions

:::tip
Kullanım kolaylığı için öneriler ve en iyi uygulamalar.
:::

:::info
Kodun önemini ve bağlamını artırmak için ek bilgi.
:::

:::warning
Potansiyel tuzaklar veya önemli hususlara dikkat edin.
:::

:::note
İlginç bilgiler veya daha derin açıklamalar için notlar.
:::

:::danger
Kritik uyarılar için dikkat edilmesi gereken noktalar.
:::

## 2. Quote Formatting

> Önemli bir çıkarım: Randomness isteniyor ve işleme alınıyor.  
> — Kod Kısım Referansı

## 3. Details Elements


Geri çağırma talimatı hakkında daha fazla bilgi

Bu talimatlar Switchboard programına VRF doğrulanması sırasında sağlanacaktır. Her bir hesap ile ilgili işlemler detaylıca açıklanacaktır.



## 4. Content Structure

#### 10. Rastgeleliği Tüket

Artık Switchboard'den bir VRF istemek için mantığı oluşturduğumuza göre, VRF doğrulandığında Switchboard programının çağıracağı geri çağırma talimatını oluşturmamız gerekiyor. 

1. `/instructions` dizininde `consume_randomness.rs` adlı yeni bir dosya oluşturun.
2. Rastgeleliği kullanarak hangi zarların atıldığını belirleyin.
3. Eğer çift zar atılırsa, `vrf_state` üzerindeki `out_of_jail` alanını true olarak ayarlayın.

**Hesapları Tanımlama:**

- **escrow_account**: Kullanıcının teminatlı fonları için durum hesabı.
- **vrf_state**: Zar atma hakkında bilgi tutmak için durum hesabı.
- **vrf**: Switchboard ağı tarafından hesaplanan rastgele numarayla hesabı.

```rust
// consume_randomness.rs içinde
use crate::state::*;
use crate::errors::*;
use anchor_lang::prelude::*;
use switchboard_v2::VrfAccountData;

#[derive(Accounts)]
pub struct ConsumeRandomness<'info> {
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowState>,
    #[account(mut)]
    pub vrf_state: AccountLoader<'info, VrfClientState>,
    #[account(
        mut,
        constraint = vrf.load()?.authority == vrf_state.key() @ EscrowErrorCode::InvalidVrfAuthorityError
    )]
    pub vrf: AccountLoader<'info, VrfAccountData>
}
```

## 5. Requirements

```rust
pub fn consume_randomness_handler(ctx: Context<ConsumeRandomness>) -> Result <()> {
    msg!("Rastgelelik tüketiliyor...");

    let vrf = ctx.accounts.vrf.load()?;
    let result_buffer = vrf.get_result()?;

    if result_buffer == [0u8; 32] {
        msg!("vrf tamponu boş");
        return Ok(());
    }
    
    // Yeni kod
    let vrf_state = &mut ctx.accounts.vrf_state.load_mut()?;
    if result_buffer == vrf_state.result_buffer {
        msg!("result_buffer değişmedi");
        return Ok(());
    }
    
    // Rastgele değerleri işle
    ...
}
```

> Not: `AccountLoader` büyük hesapların yığın ve yığın taşmasını önler.  
> — Ek Bilgi

#### 11. Test Etme

Tamam, şimdi programımızı test edelim.

```toml
# Anchor.toml dosyasında gerekli hesap ayarlamaları yapılmalıdır.
```

## VRF HESAPLARI
[[test.validator.clone]] # sbv2 tasdik programID
address = "sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx"

[[test.validator.clone]] # sbv2 tasdik IDL
address = "5ExuoQR69trmKQfB95fDsUGsUrrChbGq9PFgt8qouncz"

[[test.validator.clone]] # sbv2 SbState
address = "CyZuD7RPDcrqCGbNvLCyqk6Py9cEZTKmNKujfPi3ynDd"
```

Sonra `vrf-test.ts` adında yeni bir test dosyası oluşturuyoruz ve aşağıdaki kodu kopyalayıp yapıştırıyoruz. Bu, oracle dersi ile ilgili son iki testi alır, bazı importlar ekler ve `delay` adında yeni bir işlev ekler.

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BurryEscrow } from "../target/types/burry_escrow";
import { Big } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  AnchorWallet,
  SwitchboardProgram,
  SwitchboardTestContext,
  Callback,
  PermissionAccount,
} from "@switchboard-xyz/solana.js";
import { NodeOracle } from "@switchboard-xyz/oracle";
import { assert } from "chai";

export const solUsedSwitchboardFeed = new anchor.web3.PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR",
);

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("burry-escrow-vrf", () => {
  // Yerel küme kullanmak için istemciyi yapılandırın.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.BurryEscrow as Program;
  const payer = (provider.wallet as AnchorWallet).payer;

  it("Burry Escrow Oluştur Abone Fiyatın Üstünde", async () => {
    // switchboard devnet program nesnesini al
    const switchboardProgram = await SwitchboardProgram.load(
      "devnet",
      new anchor.web3.Connection("https://api.devnet.solana.com"),
      payer,
    );
    const aggregatorAccount = new AggregatorAccount(
      switchboardProgram,
      solUsedSwitchboardFeed,
    );

    // escrow durum hesabını türet
    const [escrowState] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("MICHAEL BURRY"), payer.publicKey.toBuffer()],
      program.programId,
    );
    console.log("Escrow Hesabı: ", escrowState.toBase58());

    // en son SOL fiyatını al
    const solPrice: Big | null = await aggregatorAccount.fetchLatestValue();
    if (solPrice === null) {
      throw new Error("Aggregator hiç değer tutmuyor");
    }
    const failUnlockPrice = solPrice.plus(10).toNumber();
    const amountToLockUp = new anchor.BN(100);

    // İşlem gönder
    try {
      const tx = await program.methods
        .deposit(amountToLockUp, failUnlockPrice)
        .accounts({
          user: payer.publicKey,
          escrowAccount: escrowState,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      await provider.connection.confirmTransaction(tx, "confirmed");
      console.log("İşlem imzanız", tx);

      // Oluşturulan hesabı al
      const newAccount = await program.account.escrowState.fetch(escrowState);

      const escrowBalance = await provider.connection.getBalance(
        escrowState,
        "confirmed",
      );
      console.log("Onchain serbest bırakma fiyatı:", newAccount.unlockPrice);
      console.log("Escrow'daki miktar:", escrowBalance);

      // Onchain'deki verinin yerel 'veri' ile eşit olup olmadığını kontrol et
      assert(failUnlockPrice == newAccount.unlockPrice);
      assert(escrowBalance > 0);
    } catch (error) {
      console.log(error);
      assert.fail(error);
    }
  });

  it("UnlockPrice'ın Altında fiyat varken para çekme girişimi", async () => {
    let didFail = false;

    // escrow adresini türet
    const [escrowState] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("MICHAEL BURRY"), payer.publicKey.toBuffer()],
      program.programId,
    );

    // tx gönder
    try {
      const tx = await program.methods
        .withdraw()
        .accounts({
          user: payer.publicKey,
          escrowAccount: escrowState,
          feedAggregator: solUsedSwitchboardFeed,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      await provider.connection.confirmTransaction(tx, "confirmed");
      console.log("İşlem imzanız", tx);
    } catch (error) {
      didFail = true;

      assert(
        error.message.includes(
          "Mevcut SOL fiyatı Escrow serbest bırakma fiyatının üzerinde değil.",
        ),
        "Beklenmedik hata mesajı: " + error.message,
      );
    }

    assert(didFail);
  });
});
```

:::note
Eğer yalnızca vrf testlerini çalıştırmak istiyorsanız, 
`describe("burry-escrow-vrf", () => {` kısmını: 
`describe.only("burry-escrow-vrf", () => {` ile değiştirin.
:::

Şimdi, `SwitchboardTestContext` kullanarak yerel VRF Oracle sunucumuzu kuruyoruz. Bu bize bir `switchboard` bağlamı ve bir `oracle` düğümü verecek. Başlatma işlevlerini `before()` fonksiyonunda çağırıyoruz. Bu, herhangi bir test başlamadan önce çalışacak ve tamamlanacaktır. Son olarak, her şeyi temizlemek için `after()` işlevine `oracle?.stop()` ekleyelim.

```typescript
describe.only("burry-escrow-vrf", () => {
  // Yerel küme kullanmak için istemciyi yapılandırın.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env()
  const program = anchor.workspace.BurryEscrow as Program;
  const payer = (provider.wallet as AnchorWallet).payer

  // EKLENEN KOD
  let switchboard: SwitchboardTestContext
  let oracle: NodeOracle

  before(async () => {
    switchboard = await SwitchboardTestContext.loadFromProvider(provider, {
      name: "Test Queue",
      // Test çalıştırmaları arasında PDA şemalarının değişmemesi için bir anahtar çifti sağlayabilirsiniz
      // keypair: SwitchboardTestContext.loadKeypair(SWITCHBOARD_KEYPAIR_PATH),
      queueSize: 10,
      reward: 0,
      minStake: 0,
      oracleTimeout: 900,
      // agregatörler, bir kuyrukta katılmadan önce PERMIT_ORACLE_QUEUE_USAGE'ye ihtiyaç duymayacak
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: true,
      oracle: {
        name: "Test Oracle",
        enable: true,
        // stakingWalletKeypair: SwitchboardTestContext.loadKeypair(STAKING_KEYPAIR_PATH),
      },
    })

    oracle = await NodeOracle.fromReleaseChannel({
      chain: "solana",
      // oracle'ın en son test ağındaki (devnet) sürümünü kullan
      releaseChannel: "testnet",
      // izleme ve bildirim gibi üretim yeteneklerini devre dışı bırakır
      network: "localnet",
      rpcUrl: provider.connection.rpcEndpoint,
      oracleKey: switchboard.oracle.publicKey.toBase58(),
      // oracle'ın işlemler için ödeme yapabilmesi için ödeyici anahtar çiftine giden yol
      secretPath: switchboard.walletPath,
      // oracle günlüklerini konsolda bastırmak için true olarak ayarlayın
      silent: false,
      // iş akışını hızlandırmak için isteğe bağlı env değişkenleri
      envVariables: {
        VERBOSE: "1",
        DEBUG: "1",
        DISABLE_NONCE_QUEUE: "1",
        DISABLE_METRICS: "1",
      },
    })

    switchboard.oracle.publicKey

    // oracle'ı başlat ve zincir üstünde kalp atışları yapmasını bekle
    await oracle.startAndAwait()
  })

  after(() => {
    oracle?.stop()
  })

// ... kodun geri kalanı
}
```

Şimdi gerçek testimizi çalıştıralım. Testimizi, çift atana kadar zar atmaya devam edecek şekilde yapılandıracağız, ardından fonları çekip çekemeyeceğimizi kontrol edeceğiz.

Öncelikle, ihtiyaç duyduğumuz tüm hesapları toplayacağız. `switchboard` test bağlamı bunların çoğunu bize verir. Ardından `initVrfClient` fonksiyonumuzu çağırmamız gerekiyor. Son olarak, zarlarımızı bir döngüde atacağız ve çift olup olmadığını kontrol edeceğiz.

```typescript
it("Para çekene kadar zar at", async () => {
  // escrow adresini türet
  const [escrowState] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("MICHAEL BURRY"), payer.publicKey.toBuffer()],
    program.programId,
  );

  const vrfSecret = anchor.web3.Keypair.generate();
  const [vrfClientKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("VRFCLIENT"),
      payer.publicKey.toBytes(),
      escrowState.toBytes(),
      vrfSecret.publicKey.toBytes(),
    ],
    program.programId,
  );
  console.log(`VRF Client: ${vrfClientKey}`);

  const vrfIxCoder = new anchor.BorshInstructionCoder(program.idl);
  const vrfClientCallback: Callback = {
    programId: program.programId,
    accounts: [
      // consumeRandomness'taki tüm hesapların doldurulmasını sağla
      // { pubkey: payer.publicKey, isSigner: false, isWritable: true },
      { pubkey: escrowState, isSigner: false, isWritable: true },
      { pubkey: vrfClientKey, isSigner: false, isWritable: true },
      { pubkey: vrfSecret.publicKey, isSigner: false, isWritable: true },
    ],
    ixData: vrfIxCoder.encode("consumeRandomness", ""), // işlev için burada herhangi bir parametre ilet
  };

  const queue = await switchboard.queue.loadData();

  // Switchboard VRF ve İzin hesabı oluştur
  const [vrfAccount] = await switchboard.queue.createVrf({
    callback: vrfClientCallback,
    authority: vrfClientKey, // vrf yetkilisi
    vrfKeypair: vrfSecret,
    enable: !queue.unpermissionedVrfEnabled, // yalnızca gerekiyorsa izinleri ayarlayın
  });

  // vrf verisi
  const vrf = await vrfAccount.loadData();

  console.log(`Oluşturulan VRF Hesabı: ${vrfAccount.publicKey}`);

  // tohumları kullanarak mevcut VRF izin hesabını türet
  const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
    switchboard.program,
    queue.authority,
    switchboard.queue.publicKey,
    vrfAccount.publicKey,
  );

  const [payerTokenWallet] =
    await switchboard.program.mint.getOrCreateWrappedUser(
      switchboard.program.walletPubkey,
      { fundUpTo: 1.0 },
    );

  // vrf istemcisini başlat
  try {
    const tx = await program.methods
      .initVrfClient()
      .accounts({
        user: payer.publicKey,
        escrowAccount: escrowState,
        vrfState: vrfClientKey,
        vrf: vrfAccount.publicKey,

        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
  } catch (error) {
    console.log(error);
    assert.fail();
  }

  let rolledDoubles = false;
  while (!rolledDoubles) {
    try {
      // Rastgelelik talep et ve zar at
      const tx = await program.methods
        .getOutOfJail({
          switchboardStateBump: switchboard.program.programState.bump,
          permissionBump,
        })
        .accounts({
          vrfState: vrfClientKey,
          vrf: vrfAccount.publicKey,
          user: payer.publicKey,
          payerWallet: payerTokenWallet,
          escrowAccount: escrowState,
          oracleQueue: switchboard.queue.publicKey,
          queueAuthority: queue.authority,
          dataBuffer: queue.dataBuffer,
          permission: permissionAccount.publicKey,
          switchboardEscrow: vrf.escrow,
          programState: switchboard.program.programState.publicKey,

          switchboardProgram: switchboard.program.programId,
          recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      await provider.connection.confirmTransaction(tx, "confirmed");
      console.log(`Oluşturulan VrfClient Hesabı: ${vrfClientKey}`);

      // switchboard'ın rastgele numarayı üretip callback işlevini çağırması için birkaç saniye bekleyin
      console.log("Zar Atılıyor...");

      let didUpdate = false;
      let vrfState = await program.account.vrfClientState.fetch(vrfClientKey);

      while (!didUpdate) {
        console.log("Zar kontrol ediliyor...");
        vrfState = await program.account.vrfClientState.fetch(vrfClientKey);
        didUpdate = vrfState.timestamp.toNumber() > 0;
        await delay(1000);
      }

      console.log(
        "Zar sonuçları - Zar 1:",
        vrfState.dieResult1,
        "Zar 2:",
        vrfState.dieResult2,
      );
      if (vrfState.dieResult1 == vrfState.dieResult2) {
        rolledDoubles = true;
      } else {
        console.log("Zarı sıfırlama...");
        await delay(5000);
      }
    } catch (error) {
      console.log(error);
      assert.fail();
    }
  }

  const tx = await program.methods
    .withdraw()
    .accounts({
      user: payer.publicKey,
      escrowAccount: escrowState,
      feedAggregator: solUsedSwitchboardFeed,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([payer])
    .rpc();

  await provider.connection.confirmTransaction(tx, "confirmed");
});
```

`payerTokenWallet`'ı aldığımız işlevi unutmayın. VRF, isteyicinin bazı sarmalanmış SOL ödemesini gerektirir. Bu, oracle ağına olan teşvik mekanizmasının bir parçasıdır. Neyse ki, testlerde Switchboard bize bu gerçekten güzel fonksiyonu sağlıyor. 

```typescript
const [payerTokenWallet] =
  await switchboard.program.mint.getOrCreateWrappedUser(
    switchboard.program.walletPubkey,
    { fundUpTo: 1.0 },
  );
```

---

Ve işte burada! `anchor test` kullanarak tüm testleri çalıştırabilir ve geçebilirsiniz.

Eğer bir şey çalışmıyorsa, geri dönüp nerede yanlış yaptığınızı bulun. Alternatif olarak, [vrf dalında çözüm kodunu](https://github.com/solana-developers/burry-escrow/tree/vrf) denemekten çekinmeyin.

## Meydan Okuması

Artık bağımsız bir şey üzerinde çalışmanın zamanı geldi. Programımıza bazı `Monopoly kuralları`#Rules>) ekleyelim. Kullanıcının ne kadar rollover yaptığını takip etmek için programa biraz mantık ekleyin. Eğer üç kez zar atarlarsa ve çift yapmazlarsa, paralarını çekebilmeleri gerekir; tıpkı Monopoly'de hapisten çıkmak gibi.

Eğer takılırsanız, çözümü [`vrf-challenge-solution` dalında](https://github.com/solana-developers/burry-escrow/tree/vrf-challenge-solution) bulabilirsiniz.

:::success
Kodunuzu GitHub'a yükleyin ve
[bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=5af49eda-f3e7-407d-8cd7-78d0653ee17c)!
:::