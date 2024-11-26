---
date: 18 Mart 2024
difficulty: Orta
title: "Solana'da Cash Uygulaması"
description:
  "Solana geliştiricileri için hızlı başlangıç kılavuzu; hem Android hem de iOS uyumlu bir React Native mobil uygulamasının nasıl oluşturulacağını öğrenin. Bu uygulama, bir nakit uygulaması deneyimini taklit edecek ancak Solana blockchain'inde çalışacak, web3 ürünlerinin web2 ürünleri ile aynı kullanıcı deneyimine sahip olabileceğini gösterecek. Bunu inşa etmek için bir Anchor programı yazmamız, Solana Name Service SDK'sını entegre etmemiz ve Solana Pay'i entegre etmemiz gerekiyor."
tags:
  - hızlı başlangıç
  - dApp
  - mobil
  - anchor
  - rust
  - react-native
  - expo
keywords:
  - solana dapp
  - on-chain
  - rust
  - anchor programı
  - mobil dapp
  - dapp oluşturma
  - solana dapp oluşturma
  - eğitim
  - solana geliştirmeye giriş
  - blockchain geliştiricisi
  - blockchain eğitimi
  - web3 geliştiricisi
---

Bu kılavuzda, hem Android hem de iOS uyumlu bir React Native mobil uygulaması oluşturmayı öğreneceksiniz. Bu uygulama, bir Nakit Uygulaması deneyimini taklit edecek ancak Solana blockchain'inde çalışacak, web3 ürünlerinin web2 ürünleri ile aynı kullanıcı deneyimine sahip olabileceğini gösterecek. Bunu inşa etmek için bir Anchor programı yazmamız, Solana Name Service SDK'sını entegre etmemiz ve Solana Pay'i entegre etmemiz gerekiyor.

## Ne Öğreneceksiniz

- Ortamınızı kurma
- Solana mobil dApp oluşturma
- Anchor programı geliştirme
- Anchor PDA'ları ve hesapları
- Solana programı dağıtma
- Solana programını test etme
- On-chain bir programı mobil React Native UI ile bağlama
- Solana Pay
- Solana Name Service

## Ne İnşa Edeceksiniz

Nakit Uygulaması'na benzer bir finans uygulaması oluşturmayı öğreneceksiniz. Bu, cüzdan adaptörü, devnet üzerinde dağıtılmış anchor programı ve anchor programı ile etkileşimde bulunmak için özel UI ile bir web3 mobil uygulaması olacaktır.

### Ana Ekran

![Nakit Bakiyesi](../../../images/solana/public/assets/guides/cash-app/HomeScreen.png)
![Nakit Çekim Modalı](../../../images/solana/public/assets/guides/cash-app/CashOutModal.png)

### Ödeme Ekranı

![Ödeme Ekranı](../../../images/solana/public/assets/guides/cash-app/PaymentScreen.png)
![İstek Ekranı](../../../images/solana/public/assets/guides/cash-app/RequestScreen.png)

### QR Ekranı

![QR Ekranı](../../../images/solana/public/assets/guides/cash-app/QRScreen.png)
![QR Modalı](../../../images/solana/public/assets/guides/cash-app/QRModal.png)

### Etkinlik Ekranı

![Etkinlik Ekranı](../../../images/solana/public/assets/guides/cash-app/ActivityScreen.png)

## Ön Gereksinimler

Yerel geliştirme ortamınızda aşağıdaki araçları kurun:

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)
- [Solana CLI & Anchor](https://solana.com/docs/intro/installation)
- [Android Studio ve emulator kurulumu](https://docs.solanamobile.com/getting-started/development-setup)
- [React Native Kurulumu](https://reactnative.dev/docs/environment-setup?platform=android)
- [EAS CLI ve Hesap Kurulumu](https://docs.expo.dev/build/setup/)

:::info
Anchor framework ile Solana program geliştirmeye giriş için bu kılavuza göz atın:
- [Solana'da Temel CRUD dApp](https://github.com/solana-foundation/developer-content/blob/main/content/guides/dapps/journal.md#writing-a-solana-program-with-anchor)

Solana Mobil geliştirmeye giriş için Solana Mobile belgelerine göz atın:
- [Solana Mobil Girişi](https://docs.solanamobile.com/getting-started/intro)
:::

## Proje Tasarım Genel Görünümü

Hızlı bir şekilde tüm dApp tasarımını haritalandırmaya başlayalım. Cash Uygulaması'nın bir kopyasını oluşturmak için aşağıdaki özelliklere sahip olmamız gerekiyor:

1. Hesap oluşturma
2. Fon yatırma ve çekme
3. Kullanıcıdan kullanıcıya para transferi
4. QR kodu oluşturma
5. Arkadaşlarla bağlantı kurma
6. Etkinlik takibi
7. Arkadaşlara ödeme istekleri gönderme

Bu işlevleri etkinleştirmek için şunları yapacağız:

1. Kullanıcının yeni bir hesabı on-chain olarak başlatmasını sağlayan bir Solana programı yazmak ve
   [Solana Name Service](https://sns.guide/) ile bir kullanıcı adı ayarlamak _(benzer şekilde $Cashtag gibi)_. Kullanıcı adı SNS üzerinden ayarlandığında, bir hesabın kullanıcı adından doğrudan genel anahtar bilgileri alabilirsiniz.
2. Bir kullanıcıdan nakit hesabına fon yatırabilmesi ve nakit hesabından cüzdanına fon çekebilmesi için Solana programına talimatlar eklemek.
3. Bir kullanıcının kendi nakit hesabından başka bir nakit hesabına doğrudan fon göndermesi, belirli bir nakit hesabından fon talep etmesi ve ödeme taleplerini kabul edip etmeyeceği için talimatlar eklemek.
4. QR kodu oluşturma yeteneğini sağlamak için [Solana Pay](https://docs.solanapay.com/) entegrasyonu. Solana Pay ayrıca, talep edilen işlemin miktarını ve notunu doğrudan QR kodunda belirlemenize olanak tanır.
5. Bir kullanıcının, kullanıcı tarafından sağlanan genel anahtarı bir arkadaşlar vektörüne iterek arkadaş eklemesine olanak tanıyan bir talimat eklemek; bu vektör daha sonra ön uçta Cash Uygulaması'na benzer şekilde görüntülenebilir.
6. Bağlı kullanıcının nakit hesap durumunu sorgulayan bir etkinlik sekmesi eklemek, böylece bekleyen talepleri ve bekleyen ödemeleri gösterebiliriz.
7. Ödeme istekleri için ek bir hesap türü eklemek ve bir isteği oluşturma, bir isteği kabul etme ve ödemeyi işleme alma talimatları yazmak, isteği reddetmek ve bekleyen istek hesabını kapatmak.

## Solana Mobil Uygulama Şablonu Kurulumu

Bu proje bir mobil uygulama olacağı için Solana mobil expo uygulama şablonuyla başlayabiliriz:

```shell
yarn create expo-app --template @solana-mobile/solana-mobile-expo-template
```

Bu, Solana blockchain'i ile etkileşimde bulunan mobil uygulamalar oluşturmak için özel olarak tasarlanmış Expo çerçevesini kullanarak yeni bir proje başlatıyor.

Projeye `cash-app-clone` adını verin, ardından dizine gidin.

Şablonu özel bir geliştirme derlemesi olarak başlatmak ve Android emulator'ünüzde çalıştırmak için
[Uygulamayı Çalıştırma](https://docs.solanamobile.com/react-native/expo#running-the-app) kılavuzunu izleyin. Programı oluşturduğunuzda ve bir dev istemciyi expo ile çalıştırdığınızda, kodunuzu her kaydettiğinizde emulator otomatik olarak güncellenecektir.


Hatırlatma
İşlemleri test edebilmek için aynı Android emulator'ünde [sahte cüzdan](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/android/fakewallet) çalıştırmalısınız; bu, [Solana mobil geliştirme kurulumu belgelerinde](https://docs.solanamobile.com/getting-started/development-setup) açıklandığı gibi ya da emulator'ünüzde Phantom veya Solflare gibi gerçek bir cüzdan uygulaması kurup ayarlamanız gerekir.


## Cash Uygulaması İşlevsellikleri ile Solana Programı Yazma

### Anchor Çalışma Alanını Başlatma

Bu depo içinde Solana program geliştirme, dağıtma ve test etme için bir Anchor çalışma alanı başlatılması gerekiyor.

```shell
cd cash-app-clone

anchor init cash-app
```

Anchor çalışma alanı başlatıldığında, program kodunu yazmaya başlamak için `cash-app/programs/cash-app/src/lib.rs` dosyasına gidin.

Anchor programınız, Anchor çalışma alanını başlatarak zaten tanımlı olmalı ve şu şekilde görünmelidir:

```rust
use anchor_lang::prelude::*;

declare_id!("3dQeymKBEWf32Uzyzxm3Qyopt6uyHJdXxtvrpJdk7vCE");

#[program]
pub mod cash_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```

### Hesap Durumunuzu Tanımlama

```rust
#[account]
#[derive(InitSpace)]
pub struct CashAccount {
    pub owner: Pubkey,
    #[max_len(100)]
    pub friends: Vec<Pubkey>,
}
```

PDA hesaplarının SOL bakiyesini doğrudan sorgulama yeteneğimiz olduğu için, burada kullanıcının hesap bakiyesini izlememize gerek yok.

### Talimatlar Yazma

Artık durum tanımlandığına göre, yeni bir kullanıcı Cash Uygulaması için kaydolduğunda bir hesabı başlatmak üzere bir talimat oluşturmamız gerekiyor. Bu, yeni bir `cash_account` başlatacak ve bu hesabın PDA'sı `"cash-account"` dizesi ile kullanıcının cüzdanının genel anahtarı ile türetilmiş olacaktır.

```rust
#[program]
pub mod cash_app {
    use super::*;

    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<()> {
        let cash_account = &mut ctx.accounts.cash_account;
        cash_account.owner = *ctx.accounts.signer.key;
        cash_account.friends = Vec::new();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(
        init,
        seeds = [b"cash-account", signer.key().as_ref()],
        bump,
        payer = signer,
        space = 8 + CashAccount::INIT_SPACE
    )]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

`CashAccount` durumunu tanımlarken `InitSpace` makrosu kullanıldığı için, bu programın zincirde kaplayacağı alanı hesaplamak için çağrılabilir. Alan, bir programın zincirde tutulması için ne kadar kira ödeneceğini hesaplamak amacıyla gereklidir.

Bir sonraki adımımız, bir kullanıcının nakit hesabına fon yatırmasına imkan tanıyan bir talimat eklemek olacaktır:

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...

    pub fn deposit_funds(ctx: Context<DepositFunds>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let ix = system_instruction::transfer(
            &ctx.accounts.signer.key(),
            ctx.accounts.cash_account.to_account_info().key,
            amount,
        );

        invoke(
            &ix,
            &[
                ctx.accounts.signer.clone(),
                ctx.accounts.cash_account.to_account_info(),
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(
        mut,
        seeds = [b"cash-account", signer.key().as_ref()],
        bump,
    )]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    /// CHECK: Bu hesap yalnızca SOL transferi içindir, veri saklama amacıyla kullanılmaz.
    pub signer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Sağlanan miktar sıfırdan büyük olmalıdır.")]
    InvalidAmount,
}
```

`deposit_funds` fonksiyonu, kullanıcının cüzdanından kullanıcının nakit hesabı PDA'sına SOL transferi yapmak üzere bir sistem talimatı oluşturur. Solana programları güvenlik nedenleriyle izole olacak şekilde tasarlanmıştır; birbirlerinin durumuna veya işlevlerine doğrudan erişimleri yoktur. Eğer bir program, başka bir programın parçası olan bir talimat işleyicisinde çalışması gerekiyorsa, bunu bir çapraz program çağrısı (CPI) aracılığıyla yapmalıdır. Fonlar, kullanıcının cüzdanındaki imzacıdan geldiği için, işlevin, hesapların bakiyesini değiştirmek için Sistem Programı ile etkileşimde bulunması gerekir. Ardından, transfer talimatı `invoke` aracılığıyla yürütülür; bu, talimatı ve talimatın etkileşime gireceği hesapların bir dilimini alarak CPI'yi güvenli bir şekilde gerçekleştirir.

`invoke`, tüm işlemlerin güvenli bir şekilde gerçekleştirilmesini ve Solana ağı ve ilgili özel programlar tarafından belirlenen kurallara uygun olmasını sağlar. Aşağıdakileri doğrular:

- Yalnızca yetkilendirilmiş hesap verisi değişiklikleri gerçekleştirilir.
- Gereken işlemler için gerekli imzalar mevcuttur.
- İşlem, programın kısıtlamalarını veya Solana'nın ağ kurallarını ihlal etmez.

Şimdi, kullanıcının nakit hesabından fon çekmesine izin veren bir talimat eklememiz gerekiyor:

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let cash_account = &mut ctx.accounts.cash_account.to_account_info();
        let wallet = &mut ctx.accounts.signer.to_account_info();

        require!(*cash_account.owner == ctx.accounts.signer.key(), ErrorCode::InvalidSigner);

        **cash_account.try_borrow_mut_lamports()? -= amount;
        **wallet.try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(
        mut,
        seeds = [b"cash-account", signer.key().as_ref()],
        bump,
    )]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Sağlanan miktar sıfırdan büyük olmalıdır.")]
    InvalidAmount,

    #[msg("İmzacı bu talimatı çağırmak için geçerli değildir.")]
    InvalidSigner,
}
```

`deposit_funds` talimatının aksine, `withdraw_funds` talimatı doğrudan [Lamports](https://solana.com/docs/terminology#lamport) `cash_account` ve kullanıcının cüzdanını, `try_borrow_mut_lamports()` kullanarak ayarlamakta. Fonların transferi, bir CPI yükünü gerektirmeden yapılabilir çünkü `cash_account`, işlevi yürütmekte olan aynı program tarafından sahibidir. Bu daha verimli bir yöntemdir ama güvenliği sağlamak adına dikkatli bir işlem gerektirir.

Solana Programı, sahip olduğu bir hesaptan lamportları transfer ederken, gönderici hesabın programa ait olması gereklidir ancak alıcı hesabın program tarafından sahiplenilmiş olması gerekmez. Hesap bakiyelerini değiştirirken lamportlar oluşturulamaz veya yok edilemez; dolayısıyla gerçekleştirilen her azalma, başka bir yerde eşit bir artırma ile dengelenmelidir, aksi takdirde hata alırsınız. Yukarıdaki `withdraw_funds` talimatında, program, nakit hesabından kullanıcının cüzdanına tam olarak aynı miktarda lamport transfer etmektedir.

Hesaptaki lamportları doğrudan manipüle ettiğimizden, işlemin imzacısının, hesabın sahibinin aynı olduğundan emin olmak istiyoruz, böylece yalnızca sahibi bu talimatı çağırabilir. Bu nedenle şu doğrulama kontrolü uygulanmıştır: `require!(cash_account.owner == ctx.accounts.signer, ErrorCode::InvalidSigner)`.

Hata işleme olarak, `#[error_code]` Anchor makrosu kullanılır; bu, `Error` ve `type Result = Result` türlerini Anchor talimat işleyici döndürme türleri olarak kullanılmasını sağlar. Önemli bir nokta, bu niteliğin kullanıcı tanımlı hata enum'undan üretilen `Error`a dönüşüm desteği için `ErrorCode` üzerinde `From` işlemi gerçekleştirmesidir.

Şimdi bir kullanıcıdan diğerine fon transferi için bir talimat oluşturalım.

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...

    pub fn transfer_funds(
        ctx: Context<TransferFunds>,
        _recipient: Pubkey,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let from_cash_account = &mut ctx.accounts.from_cash_account.to_account_info();
        let to_cash_account = &mut ctx.accounts.to_cash_account.to_account_info();

        require!(*cash_account.owner == ctx.accounts.signer.key(), ErrorCode::InvalidSigner);

        **from_cash_account.try_borrow_mut_lamports()? -= amount;
        **to_cash_account.try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(recipient: Pubkey)]
pub struct TransferFunds<'info> {
    #[account(
        mut,
        seeds = [b"cash-account", signer.key().as_ref()],
        bump,
    )]
    pub from_cash_account: Account<'info, CashAccount>,

    #[account(
        mut,
        seeds = [b"cash-account", recipient.key().as_ref()],
        bump,
    )]
    pub to_cash_account: Account<'info, CashAccount>,
    pub system_program: Program<'info, System>,
    pub signer: Signer<'info>,
}
```

Yukarıdaki talimat, `TransferFunds` Context veri yapısının ek bir hesaba sahip olduğu anlamına gelir. `Context`, işlemin ihtiyaç duyduğu tüm hesapların referanslarını içeren bir yapıdır. Bu talimat için, hem gönderici hem de alıcı hesaplarının bilgilerine ihtiyaç duyduğumuz için her iki hesabı da `Context`'te dahil etmemiz gerekmektedir.

Yine, hesaplar arasında doğrudan lamport transferi gerçekleştiriyoruz; çünkü program, `cash_account` hesabına sahiptir. Nakde sahip hesabın PDA'ları, nakit hesabı sahibinin genel anahtarından türetildiği için, talimatın, alıcının genel anahtarını bir parametre olarak alması ve `TransferFunds` Context veri yapısına iletmesi gerekmektedir. Ardından, `cash_account` PDA'sı hem `from_cash_account` hem de `to_cash_account` için türetilebilir.

Her iki hesap da `#[derive(Accounts)]` makrosuna eklendiğinden, deserializasyon ve doğrulama yapılır; bu nedenle, `ctx` içindeki Context ile her iki hesabı doğrudan çağırabilir ve hesap bilgilerini alıp bakiyeleri güncelleyebilirsiniz.

Başka bir kullanıcıya para gönderebilmek için, Cash Uygulaması'na benzer bir şekilde, her iki kullanıcının da bir hesap oluşturması gerekir. Fonlar, kullanıcının cüzdanına değil, kullanıcının `cash_account` PDA'sına gönderilmektedir. Dolayısıyla her kullanıcının, cüzdan genel anahtarlarından türetilen benzersiz PDA'lerini oluşturmak için `initialize_account` talimatını çağırarak bir nakit hesabı oluşturması gerekir. Bunu dApp'in on-boarding sürecinin tasarımında göz önünde bulundurmamız gerekiyor; böylece her kullanıcı bir hesap kaydı oluştururken `initialize_account` talimatını çağırdığından emin olalım.

Artık temel ödeme işlevselliği etkinleştirildiğine göre, arkadaşlarla etkileşimde bulunabilmek istiyoruz. Bu nedenle arkadaş ekleme, arkadaşlardan ödeme talep etme, ve ödeme taleplerini kabul veya reddetmeye yönelik talimatlar eklememiz gerekiyor.

Arkadaş eklemek, `CashAccount` durumundaki `friends` vektörüne yeni bir genel anahtar eklemekten ibarettir.

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...
    pub fn add_friend(ctx: Context<AddFriend>, pubkey: Pubkey) -> Result<()> {
        let cash_account = &mut ctx.accounts.cash_account;
        cash_account.friends.push(pubkey);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddFriend<'info> {
    #[account(
        mut,
        seeds = [b"cash-account", signer.key().as_ref()],
        bump,
    )]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    /// CHECK: Bu hesap yalnızca SOL transferi içindir, veri saklama amacıyla kullanılmaz.
    pub signer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
```

`add_friend` fonksiyonunda bir tasarım sınırlaması bulunmaktadır. Arkadaşların bulunduğu `vec`, bir kullanıcıya ekleyebileceği arkadaş sayısında bir kısıtlama getirir. Bu programı sınırsız arkadaş eklemeye izin verecek şekilde geliştirmek için, arkadaşların saklanma biçimini değiştirmemiz gerekir.

### Bir Programda Birden Fazla Hesap Türü

Arkadaşlardan ödeme talep etmenin birkaç farklı yolu bulunmaktadır. Bu örnekte, her bir ödeme talebinin kendine ait bir PDA hesabı olmasını sağlayarak, aktif talepleri sorgulamayı, tamamlanan talepleri silmeyi ve hem gönderen hem de alıcı nakit hesaplarını güncellemeyi basit hale getireceğiz.

Her yeni ödeme talebi oluşturulduğunda, talimat, ödemenin gönderenini, alıcısını ve miktarını tutan yeni bir PDA hesabı oluşturacaktır.

Bir program içinde birden fazla hesap türüne sahip olmak için, her bir hesap türü için veri yapısını tanımlamanız ve her hesap türünü başlatabilen talimatlar oluşturmanız gerekir. Nakit hesabı için durum veri yapısıyla ve init hesap talimatı zaten mevcut, şimdi bunu bekleyen istek hesabı için ekleyeceğiz.

```rust
#[account]
#[derive(InitSpace)]
pub struct PendingRequest {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
}

#[derive(Accounts)]
pub struct InitializeRequest<'info> {
    #[account(
        init,
        seeds = [b"pending-request", signer.key().as_ref()],
        bump,
        payer = signer,
        space = 8 + PendingRequest::INIT_SPACE
    )]
    pub pending_request: Account<'info, PendingRequest>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

# Cash App Program

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...

    pub fn new_request(ctx: Context, sender: Pubkey, amount: u64) -> Result {
        let pending_request = &mut ctx.accounts.pending_request;
        pending_request.recipient = *ctx.accounts.signer.key;
        pending_request.sender = sender;
        pending_request.amount = amount;
        Ok(())
    }
}
```

Şimdi ödeme taleplerini gönderebildiğimize göre, bu ödemeleri kabul etmek veya reddetmek için bir işlevsellik eklememiz gerekiyor. O yüzden bu talimatları şimdi ekleyelim.

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...

    pub fn decline_request(_ctx: Context) -> Result {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct DeclineRequest {
    #[account(
        mut,
        seeds = [b"pending-request", signer.key().as_ref()],
        bump,
        close = signer,
    )]
    pub pending_request: Account,
    #[account(mut)]
    pub signer: Signer,
    pub system_program: Program,
}
```

Bir talebi reddetmek için `pending_request` hesabının kapatılması gerekiyor. `DeclineRequest` veri yapısı için hesap makrosunda `close` kısıtlamasını belirttiğimizde, hesap doğru imzalayıcı imzaladığında kendiliğinden kapanır.

:::info
`accept_request` için de, işlemin tamamlanmasının ardından hesabın kapanmasını istiyoruz ama önce talep edilen fonların doğru alıcıya transfer edilmesi gerekiyor.
:::

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...

    pub fn accept_request(ctx: Context) -> Result {
        let amount = ctx.accounts.pending_request.amount;

        let from_cash_account = &mut ctx.accounts.from_cash_account.to_account_info();
        let to_cash_account = &mut ctx.accounts.to_cash_account.to_account_info();

        **from_cash_account.try_borrow_mut_lamports()? -= amount;
        **to_cash_account.try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct AcceptRequest {
    #[account(
        mut,
        seeds = [b"pending-request", signer.key().as_ref()],
        bump,
        close = signer,
    )]
    pub pending_request: Account,
    #[account(
        mut,
        seeds = [b"cash-account", pending_request.sender.key().as_ref()],
        bump,
    )]
    pub from_cash_account: Account,
    #[account(
        mut,
        seeds = [b"cash-account", pending_request.recipient.key().as_ref()],
        bump,
    )]
    pub to_cash_account: Account,
    #[account(mut)]
    pub signer: Signer,
    pub system_program: Program,
}
```

`AcceptRequest` yapısı üç hesaba referanslar içeriyor çünkü talebi tamamlamak için her üçünü de almamız gerekiyor. `recipient` ve `sender` kamu anahtarları `pending_request` hesap durumundan çekiliyor ve bu işlem için gerekli olan iki `cash_account` hesabını çıkarmak için kullanılıyor.

:::warning
Artık fonları yatırabiliyoruz, çekebiliyoruz, başka bir kullanıcıya fon gönderebiliyoruz, başka bir kullanıcıdan fon talep edebiliyoruz, arkadaş ekleyebiliyoruz ve talepleri kabul/red edebiliyoruz. Bu, Cash App'taki tüm işlevselliği kapsıyor. Test etmeden önce bu programa bir optimizasyon daha ekleyeceğiz.
:::

### Eşsiz PDA’lar için Sayı Entegre Etme

Bir kullanıcının birden fazla bekleyen talebi olabileceğinden, her talebin eşsiz bir PDA’ya sahip olmasını istiyoruz. Bu nedenle, yukarıdaki kodu PDA’ya bir sayaç ekleyecek şekilde güncelleyebiliriz. Sayaç, kullanıcının nakit hesap durumu içinde takip edileceğinden, artık `ProcessRequest` hem nakit hesabını hem de bekleyen talep hesabını alması gerekecek. Öncelikle her iki hesap veri yapısını güncelleyelim.

```rust
#[account]
#[derive(InitSpace)]
pub struct CashAccount {
    pub signer: Pubkey,
    pub friends: Vec,
    pub request_counter: u64,
}

#[account]
#[derive(InitSpace)]
pub struct PendingRequest {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub id: u64,
}
```

Artık `InitializeRequest`, `DeclineRequest` ve `AcceptRequest` yapılarının talepleri hazırlayan nakit hesabını içerecek şekilde güncellenmesi gerekiyor, böylece sayaç sorgulanabilir ve artırılabilir ve `pending_request` hesabı PDA üretiminde sayacın değerini kullanabilir.

```rust
#[derive(Accounts)]
pub struct InitializeRequest {
    #[account(
        init,
        seeds = [b"pending-request", signer.key().as_ref(), cash_account.pending_request_counter.to_le_bytes().as_ref()],
        bump,
        payer = signer,
        space = 8 + PendingRequest::INIT_SPACE
    )]
    pub pending_request: Account,
    #[account(
        mut,
        seeds = [b"cash-account", signer.key().as_ref()],
        bump,
        close = signer,
    )]
    pub cash_account: Account,
    #[account(mut)]
    pub signer: Signer,
    pub system_program: Program,
}

#[derive(Accounts)]
pub struct DeclineRequest {
    #[account(
        mut,
        seeds = [b"pending-request", signer.key().as_ref(), pending_request.id.to_le_bytes().as_ref()],
        bump,
        close = signer,
    )]
    pub pending_request: Account,
    #[account(mut)]
    pub signer: Signer,
    pub system_program: Program,
}

#[derive(Accounts)]
pub struct AcceptRequest {
    #[account(
        mut,
        seeds = [b"pending-request", signer.key().as_ref(), pending_request.id.to_le_bytes().as_ref()],
        bump,
        close = signer,
    )]
    pub pending_request: Account,
    #[account(
        mut,
        seeds = [b"cash-account", pending_request.sender.key().as_ref()],
        bump,
    )]
    pub from_cash_account: Account,
    #[account(
        mut,
        seeds = [b"cash-account", pending_request.recipient.key().as_ref()],
        bump,
    )]
    pub to_cash_account: Account,
    #[account(mut)]
    pub signer: Signer,
    pub system_program: Program,
}
```

Son olarak, her hesabın başlatılmasını güncellememiz gerekiyor. `pending_request_counter` 0'dan başlamalı ve o belirli nakit hesabından gönderilen her yeni taleple birlikte artırılmalıdır.

```rust
#[program]
pub mod cash_app {
    use super::*;

    //...

    pub fn initialize_account(ctx: Context) -> Result {
        let cash_account = &mut ctx.accounts.cash_account;
        cash_account.signer = *ctx.accounts.signer.key;
        cash_account.friends = Vec::new();
        cash_account.request_counter = 0;
        Ok(())
    }

    pub fn new_request(ctx: Context, recipient: Pubkey, amount: u64) -> Result {
        let cash_account = &mut ctx.accounts.cash_account;
        let pending_request = &mut ctx.accounts.pending_request;
        pending_request.sender = *ctx.accounts.signer.key;
        pending_request.recipient = recipient;
        pending_request.amount = amount;
        pending_request.id = cash_account.request_counter;
        cash_account.request_counter += 1;
        Ok(())
    }
}
```

Artık Solana programınız son sürümüyle eşleşmeli [burada](https://github.com/solana-developers/cash-app-clone/blob/main/cash-app/anchor/cash-app/src/lib.rs):

### Programı Derle ve Dağıt

Öncelikle, Anchor programını dağıtmalıyız. Test amaçlı olarak yerel ağınıza veya devnet'e dağıtabilirsiniz.

- `Devnet`, Solana'nın halka açık bir test ağıdır ve ana ağa daha yakın bir deneyim sunar. Daha geniş bir doğrulayıcı setiyle çalışır ve CPI'ler, oracle'lar ve cüzdan hizmetlerinin test edilmesini kolayca sağlar.
- `Localnet`, makinenizde yerel olarak çalışan Solana blockchain'in özel bir örneğidir. Ortam üzerinde daha fazla kontrol sağlar ama gerçek dünya blockchain koşullarını tamamen taklit etmez.

Rehberin bir sonraki bölümünde, Anchor test setini çalıştırmak için yerel ağa dağıtılmış programa ihtiyacınız olacak, bu yüzden şimdi yerel ağa dağıtım yapın.

Terminalinizde `cash-app-clone/cash-app` dizinine gidin.

```shell
solana-test-validator
```

Bu, bilgisayarınızda Solana blockchain ortamını simüle eden bir yerel test doğrulayıcı çalıştırır. Not: Test doğrulayıcınız çalışmadan yerel ağa dağıtım yapamazsınız.

```shell
anchor build
```

Bu, programınızın çalışma alanını inşa eder. Solana'nın BPF runtime'ını hedefler ve her programın IDL'sini `target/idl` klasörüne ve ilgili typescript türlerini `target/types` klasörüne yayımlar. Eğer programınız derlenmezse, çözülmesi gereken bir hata vardır.

```shell
anchor deploy --provider.cluster localnet
```

Bu komut, programınızı belirtilen kümeye dağıtır ve bir program ID kamu anahtarı üretir. Yerel ağa dağıtım yapmak isterseniz, dağıtım yapabilmek için `solana-test-validator` çalıştırıyor olmalısınız.

```shell
anchor keys sync
```

Bu, programın `declare_id!` pubkey'ini programın gerçek pubkey'i ile senkronize eder. Özellikle `lib.rs` ve `Anchor.toml` dosyalarını günceller.

### Anchor Programını Test Etme

Solana Anchor programlarını test etmek, Solana programının davranışını simüle etmek ve beklendiği gibi çalışıp çalışmadığını doğrulamak anlamına gelir. Aşağıdaki test için şunları inceleyeceğiz:

- Kullanıcı A ve Kullanıcı B için Hesaplar Oluşturur
- Kullanıcı A'nın hesabına fon yatırır
- Kullanıcı A'nın hesabından fon çeker
- Kullanıcı A'nın hesabından Kullanıcı B'nin hesabına fon transfer eder
- Kullanıcı A, Kullanıcı B'yi arkadaş olarak ekler
- Kullanıcı A, Kullanıcı B'den fon talep eder
- Kullanıcı B, talebi kabul eder
- Kullanıcı A, yeniden Kullanıcı B'den fon talep eder
- Kullanıcı B, talebi reddeder

Bir Anchor çalışma alanı başlatıldığında, TypeScript testleri için bir dosya oluşturulur. `cash-app-clone/cash-app/tests/cash-app.ts` dizinine giderek test şablonunu bulabilirsiniz, bu şablon gerekli modülleri içerecektir.

Öncelikle, Solana blockchain ile etkileşimde bulunmak için ortamımızı ayarlamamız gerekiyor.

```tsx
describe("cash-app", () => {
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.CashApp as Program;
});
```

`provider`, uygulamanız ile Solana blockchain arasındaki etkileşimleri kolaylaştırmanıza olanak tanır. Bu, işlemleri imzalamak için kullanılan anahtarı içeren bir cüzdanı da içerir.

`program` artık Anchor programınızın temsilcisidir ve zincir üstü programınızda tanımlanan işlevleri çağırmak, gereken hesapları geçirmek ve programın verilerini yönetmek için kullanılabilir. Solana blockchain ile etkileşimi basit hale getirir.

Sonrasında, Solana programıyla etkileşimde bulunacak cüzdan hesaplarını ve bunların `cash_account` PDA'larını tanımlamamız gerekiyor. `myWallet`, provider'ın cüzdanıdır, bu nedenle `AnchorProvider` ile entegre edilmiştir ve `provider` başlatıldığında yapılandırılmıştır. `yourWallet` ise yeni bir cüzdandır, bu nedenle SOL ile finanse edilmesi gerekmektedir; airdrop talep edilerek bu sağlanabilir.

```tsx
it("A'dan B'ye kullanıcı akışı", async () => {
  const myWallet = provider.wallet as anchor.Wallet;
  const yourWallet = new anchor.web3.Keypair();

  const [myAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("cash-account"), myWallet.publicKey.toBuffer()],
    program.programId,
  );

  const [yourAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("cash-account"), yourWallet.publicKey.toBuffer()],
    program.programId,
  );

  console.log("Airdrop talep ediliyor");
  const airdropTx = await provider.connection.requestAirdrop(
    yourWallet.publicKey,
    5 * anchor.web3.LAMPORTS_PER_SOL,
  );
  await provider.connection.confirmTransaction(airdropTx);

  let yourBalance = await program.provider.connection.getBalance(
    yourWallet.publicKey,
  );
  console.log("Cüzdan bakiyeniz:", yourBalance);
});
```

Artık Solana programıyla etkileşimde bulunabiliriz. İlk önce her kullanıcının `cash_account` hesabını başlatmalıyız.

```tsx
const initMe = await program.methods
  .initializeAccount()
  .accounts({
    cashAccount: myAccount,
    signer: myWallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
console.log(`Logları görmek için 'solana confirm -v ${initMe}' kullanın`);

await anchor.getProvider().connection.confirmTransaction(initMe);

const initYou = await program.methods
  .initializeAccount()
  .accounts({
    cashAccount: yourAccount,
    signer: yourWallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([yourWallet])
  .rpc();
console.log(`Senin hesabın başlatıldı : ${initYou}' `);

await anchor.getProvider().connection.confirmTransaction(initYou);
```

Program ad alanı `program.methods` kullanılarak çağrıldığında, o programın talimat işleyicileri ile etkileşimde bulunabilirsiniz. Bir işlem gönderildiğinde `provider` _(veya ondan türetilen yöntemler, örneğin `program.rpc()`)_, imzalama `myWallet` tarafından otomatik olarak gerçekleştirilir. `provider` yapılandırması ile otomatik olarak gönderilen işlemler için imzacı olarak `myWallet`'ı dahil eder. Bu, bir işlemi oluştururken `.signers()` dizisine `myWallet`'ı manuel olarak belirtmenize gerek olmadığı anlamına gelir, çünkü bu, provider'ın yapılandırmasıyla varsayılan olarak imzacı olduğu varsayılır. Ancak, `yourWallet` yeni bir keypair'dir ve `provider` ile otomatik olarak ilişkilendirilmediği için bu cüzdanın işlemlerde imzalama için kullanılmasını açıkça belirtmemiz gerekir.

Başka bir talimat çağrısı yukarıda açıklandığı gibi tam olarak ele alındığından, bu test örneğini bağımsız olarak tamamlayabilirsiniz.

Son olarak, test suite'inizi yerel ağınız üzerinde çalıştırın.

```shell
anchor test
```

## Solana Programını React-Native Expo Uygulamasına Bağlama

Artık çalışan bir Solana programına sahip olduğumuza göre, bunu dApp'in UI'si ile entegre etmemiz gerekiyor.

### Android Emülatörü

Rehber boyunca yapacağımız UI güncellemelerini gerçek zamanlı olarak görebilmek için Android emülatörünü çalıştıralım.

Bir EAS hesabınız olması ve EAS CLI'da hesabınıza giriş yapmış olmanız gerekir; bunun için [expo belgelerini](https://docs.expo.dev/build/setup/) takip edin.

Terminalinizde `cash-app-clone` dizinine gidin ve çalıştırın:

```shell
eas build --profile development --platform android
```

Sonra yeni bir terminal penceresinde şunu çalıştırın:

```shell
npx expo start --dev-client
```

Yapıyı Android emülatörüne yükleyin ve ayrı bir pencerede çalışır durumda tutun. Her dosyayı kaydettiğinizde emülatör yenilenecektir.

### İlk Program Bağlantısı

Dağıtılmış Solana programımız ile etkileşimde bulunmak üzere kullanıcıların kamu anahtarını parametre olarak alan özel bir kanca oluşturabiliriz. Program ID'si, programın dağıtıldığı rpc uç noktası, programın IDL'si ve belirli bir kullanıcının PDA'sını sağlayarak Solana programıyla etkileşimleri yönetmek için gerekli mantığı oluşturabiliriz. `utils/useCashAppProgram.tsx` altında yeni bir dosya oluşturun ve bu fonksiyonu uygulayın.

Bu uygulamanın halka açık olmasını istediğimiz için, programınızı devnet'e dağıtın ve `11111111111111111111111111111111` yerine o kamu anahtarını kullanın.

```tsx
export function UseCashAppProgramAccount(user: PublicKey) {
  const cashAppProgramId = new PublicKey("11111111111111111111111111111111");

  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com"),
  );

  const [cashAppPDA] = useMemo(() => {
    const accountSeed = [Buffer.from("cash_account"), user.toBuffer()];
    return PublicKey.findProgramAddressSync(accountSeed, cashAppProgramId);
  }, [cashAppProgramId]);

  const cashAppProgram = useMemo(() => {
    return new Program(
      idl as CashAppProgram,
      cashAppProgramId,
      { connection },
    );
  }, [cashAppProgramId]);

  const value = useMemo(
    () => ({
      cashAppProgram: cashAppProgram,
      cashAppProgramId: cashAppProgramId,
      cashAppPDA: cashAppPDA,
    }),
    [cashAppProgram, cashAppProgramId, cashAppPDA],
  );

  return value;
}
```

Artık her kamu anahtarı için yalnızca bir `cash_account` hesabı bulunduğundan, kullanıcının kamu anahtarını bir parametre olarak alıp, bu yeni kullanıcının Cash App PDA'sının kamu anahtarını hesaplamak kolaydır.

Program oluşturulurken IDL, JSON dosyası olarak oluşturulduğundan, bunu bu dosyaya içe aktarabiliriz.

Bu fonksiyon şunları döndürür:

- `cashAppPDA` - Bağlanan kullanıcının nakit hesabı için Program Türevli Adresi (PDA)
- `cashAppProgramID` - devnet üzerinde dağıtılmış Solana programının kamu anahtarı
- `cashAppProgram` - IDL'nin deserilize edilmiş istemci temsili olan Cash App programı.

`Program` sınıfı, bir Anchor programının IDL deserilize edilmiş istemci temsili sağlar. Bu API, zincir üstü programlarla iletişim kurmakla ilgili her şey için tek durak noktasıdır. İşlemleri göndermeyi, hesapları deserilize etmeyi, talimat verilerini çözmeyi, olayları dinlemeyi vb. sağlar.

`Program` sınıfından oluşturulan `cashAppProgram` nesnesi, dinamik olarak oluşturulmuş bir dizi özellik sunar, bu özelliklere `namespaces` denir. `Namespaces`, program yöntemleri ve hesapları ile bire bir eşleşme yapar ve proje ilerledikçe bunları sıklıkla kullanacağız. `namespace` genellikle şu şekilde kullanılır: `program.<namespace>.<program-specific-method>`

Belirli bir kamu anahtarıyla ilişkili belirli `pending_request` hesapları için bilgi almak amacıyla, pending request ID'sini bir parametre olarak almamız gerekecek.

```tsx
export function UsePendingRequestAccount(
  user: PublicKey,
  count: number,
  cashAppProgramId: PublicKey,
) {
  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com"),
  );

  bigNumber = new BN(count);
  const [pendingRequestPDA] = useMemo(() => {
    const pendingRequestSeed = [
      Buffer.from("cash_account"),
      user.toBuffer(),
      bigNumber.toBuffer(),
    ];
    return PublicKey.findProgramAddressSync(
      pendingRequestSeed,
      cashAppProgramId,
    );
  }, [cashAppProgramId]);

  const value = useMemo(
    () => ({
      pendingRequestPDA: pendingRequestPDA,
    }),
    [pendingRequestPDA],
  );

  return value;
}

### Stil ve Temalar

React Native, standart CSS özelliklerine dayanan bir stil sistemi kullanır, ancak bu, mobil geliştirme için özel olarak tasarlanmıştır. Stil, JavaScript nesneleri kullanılarak tanımlanır ve **bu, JavaScript'in yeteneklerinden yararlanarak dinamik stil oluşturma olanağı sağlar.** 

:::tip
Cash App görünümüne benzer bir tasarım elde etmek için, bu dApp genelinde kullanılacak bir StyleSheet Objesi oluşturacağız. Bu stil sayfası, monokrom gri tonlamalı bir renk paleti, kalın metin ve yuvarlak şekiller içerecektir.
:::

```jsx
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#1b1b1b",
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 40,
  },
  buttonGroup: {
    flexDirection: "column",
    paddingVertical: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  cardContainer: {
    width: width - 40,
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  modalView: {
    backgroundColor: "#444",
    padding: 35,
    alignItems: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,

    width: "100%", height: "40%",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 16,
    color: "#666",
  },
});

export default styles;
```

`StyleSheet`'i ayarlamanın yanı sıra temayı da güncellememiz gerekir. **Bir tema tüm uygulamada daha tutarlı bir görünüm ve his yaratır.** `App.tsx` dosyasına gidin ve kodu yalnızca `DarkTheme` kullanacak şekilde güncelleyin.

---

### Navigasyon Çubuğu ve Sayfaların Ayarlanması

Cash App'in UI/UX'ini takip etmek için, aşağıdaki ekranlara ihtiyacımız olacak: Ana Sayfa, Ödeme, Tarama ve Etkinlik.

:::info
`HomeNavigator.tsx` dosyasına gidin ve ``'ı şu ekranları içerecek şekilde güncelleyin:
:::

```tsx
<PaperProvider theme={theme}>
  <Tab.Navigator
    screenOptions={({ route }) => ({
      header: () => <TopBar />,
      tabBarIcon: ({ focused, color, size }) => {
        switch (route.name) {
          case "Home":
            return (
              <MaterialCommunityIcon
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            );
          case "Pay":
            return (
              <MaterialCommunityIcon
                name={focused ? "currency-usd" : "currency-usd"}
                size={size}
                color={color}
              />
            );
          case "Scan":
            return (
              <MaterialCommunityIcon
                name={focused ? "qrcode-scan" : "qrcode-scan"}
                size={size}
                color={color}
              />
            );
          case "Activity":
            return (
              <MaterialCommunityIcon
                name={focused ? "clock-outline" : "clock-outline"}
                size={size}
                color={color}
              />
            );
        }
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Pay" component={PayScreen} />
    <Tab.Screen name="Scan" component={ScanScreen} />
    <Tab.Screen name="Activity" component={ActivityScreen} />
  </Tab.Navigator>
</PaperProvider>
```

Buna ek olarak, her bu ekran için yeni dosyalar oluşturmanız gerekecek. `src/screens` dizinine gidin ve `PayScreen.tsx`, `ScanScreen.tsx` ve `ActivityScreen.tsx` için bir dosya oluşturun.

Her dosya, bu şablondaki HomeScreen'le aynı formatı izleyen bir işleve sahip olmalıdır.

```tsx
export function HomeScreen() {
  return <View style={styles.screenContainer}></View>;
}
```

---

### Bileşenlerin Oluşturulması

Bu kılavuz boyunca, özellikleri oluşturmak için modüler bir yaklaşım kullanacağız; böylece her seferinde bir bileşene odaklanabiliriz.

#### Hesap Bakiyesi Bileşeni

Ana ekranla başlayalım. Cash App'i taklit etmek için, yalnızca hesap bakiyenizi gösteren bir kapsayıcıya, hesabınıza para yatırmak için bir düğmeye ve hesabınızdan para çekmek için bir düğmeye ihtiyacımız var.

:::warning
Kullandığımız expo şablonunda zaten benzer bir işlevsellik var. Ancak, bu kod bağlı cüzdan bakiyeniz içindir ve nakit hesabının bakiyesi için değil.
:::

Bu nedenle, bu özelliği dağıtılan Solana programımıza bağlamamız ve kullanıcının `cash_account` bakiyesini sorgulamamız gerekiyor.

Öncelikle ana sayfayı basitleştirerek şöyle yapın:

```tsx
export function HomeScreen() {
  const { selectedAccount } = useAuthorization();

  return (
    <View style={styles.screenContainer}>
      {selectedAccount ? (
        <>
          <AccountDetailFeature />
        </>
      ) : (
        <>
          <Text style={styles.headerTextLarge}>Solana Cash App</Text>
          <Text style={styles.text}>
            {" "}
            Cüzdanınızı bağlamak için Solana (SIWS) ile oturum açın.
          </Text>
          <SignInFeature />
        </>
      )}
    </View>
  );
}
```

Ardından, `AccountDetailFeature`'a gidin ve stilini `cardContainer`'ı kullanacak şekilde güncelleyin, kart kapsayıcı için bir "Nakit Bakiyesi" etiketi ekleyin ve aşağıda gösterildiği gibi `AccountTokens` bileşenini silin:

```tsx
export function AccountDetailFeature() {
  const { selectedAccount } = useAuthorization();

  if (!selectedAccount) {
    return null;
  }
  const theme = useTheme();

  return (
    <>
      <View style={styles.cardContainer}>
        <Text variant="titleMedium" style={styles.headerText}>
          Nakit Bakiyesi
        </Text>
        <View style={{ alignItems: "center" }}>
          <AccountBalance address={selectedAccount.publicKey} />
          <AccountButtonGroup address={selectedAccount.publicKey} />
        </View>
      </View>
    </>
  );
}
```

:::note
Daha önce oluşturduğumuz `StyleSheet` her sayfaya dahil edilmelidir.
:::

Şimdi `AccountBalance` işlevine tıklayın. Bu sorguyu güncellemek için, sadece `useGetBalance` işlevine geçirilen genel anahtarı değiştirmemiz gerekiyor. Daha önce oluşturduğumuz `cashAppPDA`'yı alabiliriz.

```tsx
export function AccountBalance({ address }: { address: PublicKey }) {
  const { cashAppPDA } = UseCashAppProgram(address);

  const query = useGetBalance(cashAppPDA);
  const theme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  return (
    <>
      <View style={styles.accountBalance}>
        <Text variant="displayMedium" theme={theme}>
          ${query.data ? lamportsToSol(query.data) : "0.00"}
        </Text>
      </View>
    </>
  );
}
```

---

#### Para Yatırma ve Çekme Bileşenleri

Sonraki adım olarak, para yatırma ve çekme düğmelerini güncellememiz gerekecek. `AccountButtonGroup` işlevine gidin.

:::danger
Dağıtılan Solana programından bir talimat çağırmak ve yürütmek için, program ad alanlarını kullanabiliriz; bu ad alanları, program yöntemleri ve hesaplarıyla birbirine eşleşir.
:::

```tsx
const [connection] = useState(
  () => new Connection("https://api.devnet.solana.com"),
);

const depositFunds = useCallback(
  async (program: Program<CashApp>) => {
    let signedTransactions = await transact(
      async (wallet: Web3MobileWallet) => {
        const [authorizationResult, latestBlockhash] = await Promise.all([
          authorizeSession(wallet),
          connection.getLatestBlockhash(),
        ]);

        const depositInstruction = await program.methods
          .depositFunds(pubkey, newDepositAmount)
          .accounts({
            user: authorizationResult.publicKey,
            fromCashAccount: cashAppPDA,
          })
          .instruction();

        const depositTransaction = new Transaction({
          ...latestBlockhash,
          feePayer: authorizationResult.publicKey,
        }).add(depositInstruction);

        const signedTransactions = await wallet.signTransactions({
          transactions: [depositTransaction],
        });

        return signedTransactions[0];
      },
    );

    let txSignature = await connection.sendRawTransaction(
      signedTransactions.serialize(),
      {
        skipPreflight: true,
      },
    );

    const confirmationResult = await connection.confirmTransaction(
      txSignature,
      "confirmed",
    );

    if (confirmationResult.value.err) {
      throw new Error(JSON.stringify(confirmationResult.value.err));
    } else {
      console.log("İşlem başarıyla gönderildi!");
    }
  },
  [authorizeSession, connection, cashAppPDA],
);
```

Bu işlev, bağlı olan Solana programı içinde paranın yatırılması sürecini yönetmek için React'in `useCallback` kancasını kullanarak bir anımsatıcı geri çağırma işlevi oluşturur. **Bir `Program` parametresi alır; bu, `CashApp` dApp için bir Anchor program arayüzüdür.**

`namespace` genel olarak şu şekilde kullanılır: `program..`; yukarıdaki kodda, belirtilen `accounts` ile `depositFunds` için bir `instruction` oluşturuyoruz.

:::tip
Ardından bu talimat bir `Transaction`'a eklenebilir ve bağlı cüzdanla imzalanabilir. Son olarak, imzalı işlem `connection` nesnesindeki `sendRawTransaction` yöntemi kullanılarak gönderilir.
:::

`depositFunds` işlevini elde ettikten sonra, `withdrawFunds` işlevini oluşturmak için aynı formatı uygulamanız gerekecek; `withdrawFunds` talimatı için program ad alanını kullanın.

```tsx
const withdrawInstruction = await program.methods
  .withdrawFunds(pubkey, newDepositAmount)
  .accounts({
    user: authorizationResult.publicKey,
    fromCashAccount: cashAppPDA,
  })
  .instruction();
```

### Ek belgeler:

- [İşlemler ve Talimatlar](https://solana.com/docs/core/transactions)
- [Connection Sınıfı](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html)
- Cüzdana [kütüphaneler](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/android/walletlib) sağlamak için Mobil Cüzdan Adaptörü işlem imzalama hizmetlerini dapp'lere yüklenmesi ve ithal edilmesi gereken npm paketleri:
  - @solana-mobile/mobile-wallet-adapter-protocol-web3js
  - @coral-xyz/anchor
  - @solana/web3.js

---

Artık bu işlevleri UI'deki düğmelere bağlayabiliriz. Mevcut `AccountButtonGroup` işlevine çok benzer bir yapı izleyerek, ancak farklı işlevsellik gerekecek. Bu nedenle, işlevin içindeki her şeyi silin.

:::note
Cash App ayrıca "Nakit Ekle" ve "Nakit Çek" düğmelerine tıkladığınızda modal'lar kullanır; bu nedenle bir çekme ve yatırma modal'ımız olacak. Ayrıca, yatırılacak veya çekilecek miktar için bir kullanıcı girişi alacağız. Son olarak, oluşturduğumuz `depositFunds` ve `withdrawFunds` işlevlerini çağırmamız gerekecek.
:::

```tsx
export function AccountButtonGroup({ address }: { address: PublicKey }) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [genInProgress, setGenInProgress] = useState(false);
  const [depositAmount, setDepositAmount] = useState(new anchor.BN(0));
  const newDepositAmount = new anchor.BN(depositAmount * 1000000000);
  const [withdrawAmount, setWithdrawAmount] = useState(new anchor.BN(0));
  const newWithdrawAmount = new anchor.BN(withdrawAmount * 1000000000);
  const { authorizeSession, selectedAccount } = useAuthorization();
  const { cashAppProgram } = UseCashAppProgram(address);

  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com"),
  );

  const DepositModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDepositModal}
      onRequestClose={() => {
        setShowDepositModal(!showDepositModal);
      }}
    >
      <View style={styles.bottomView}>
        <View style={styles.modalView}>
          <Text style={styles.buttonText}>Nakit Ekle</Text>
          <TextInput
            label="Miktar"
            value={depositAmount}
            onChangeText={setDepositAmount}
            keyboardType="numeric"
            mode="outlined"
            style={{
              marginBottom: 10,
              backgroundColor: "#ccc",
              width: "80%",
              marginTop: 10,
            }}
          />
          <Button
            mode="contained"
            style={styles.modalButton}
            onPress={async () => {
              setDepositModalVisible(!showDepositModal);
              if (genInProgress) {
                return;
              }
              setGenInProgress(true);
              try {
                if (!cashAppProgram || !selectedAccount) {
                  console.warn(
                    "Program/cüzdan henüz başlatılmamış. Öncelikle bir cüzdan bağlamayı deneyin.",
                  );
                  return;
                }
                const deposit = await depositFunds(cashAppProgram);

                alertAndLog(
                  "Nakit hesabına para yatırıldı ",
                  "Kaydedilen işlem için konsolu kontrol edin.",
                );
                console.log(deposit);
              } finally {
                setGenInProgress(false);
              }
            }}
          >
            Ekle
          </Button>
          <TouchableOpacity
            style={{ position: "absolute", bottom: 25 }}
            onPress={() => setDepositModalVisible(false)}
          >
            <Button>Kapat</Button>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const WithdrawModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showWithdrawModal}
      onRequestClose={() => {
        setShowWithdrawModal(!showWithdrawModal);
      }}
    >
      <View style={styles.bottomView}>
        <View style={styles.modalView}>
          <Text style={styles.buttonText}>Nakit Çek</Text>
          <TextInput
            label="Miktar"
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            keyboardType="numeric"
            mode="outlined"
            style={{
              marginBottom: 20,
              backgroundColor: "#ccc",
              width: "80%",
              marginTop: 50,
            }}
          />
          <Button
            mode="contained"
            style={styles.modalButton}
            onPress={async () => {
              setShowWithdrawModal(!withdrawModalVisible);
              if (genInProgress) {
                return;
              }
              setGenInProgress(true);
              try {
                if (!cashAppProgram || !selectedAccount) {
                  console.warn(
                    "Program/cüzdan henüz başlatılmamış. Öncelikle bir cüzdan bağlamayı deneyin.",
                  );
                  return;
                }
                const deposit = await withdrawFunds(cashAppProgram);

                alertAndLog(
                  "Nakit hesabından para çekildi ",
                  "Kaydedilen işlem için konsolu kontrol edin.",
                );
                console.log(deposit);
              } finally {
                setGenInProgress(false);
              }
            }}
          >
            Çek
          </Button>
          <TouchableOpacity
            style={{ position: "absolute", bottom: 25 }}
            onPress={() => setShowWithdrawModal(false)}
          >
            <Button>Kapat</Button>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <>
      <View style={styles.buttonRow}>
        <DepositModal />
        <WithdrawModal />
      </View>
    </>
  );
}
```

Bütün gerekli işlevsellik, bir Cash App kopyası için ana sayfada toplandı. **Şimdi diğer ekranlara geçebiliriz; bu ekran, bir kullanıcıdan diğerine para aktarmayı içeriyor.**

---

#### Ödeme Bileşeni

Ödeme sayfası için, nakit uygulama Solana programından `transferFunds` işlevini çağırmamız gerekecek. Bunu yapmak için, `depositFunds` için açıklanan aynı süreci kullanacağız. 

:::info
Ancak, CashApp Solana Programında tanımlanan `TransferFunds` yapısı, `depositFunds` için gereken bir hesap yerine 2 `cash_account` hesabı gerektirir. Yani tek değişiklik, alıcı hesabının ve gönderen hesabının PDA'larının hesaplanmasını eklemektir; aşağıda gösterildiği gibi:
:::

```tsx
const [recipientPDA] = useMemo(() => {
  const recipientSeed = [Buffer.from("cash-account"), recipient.toBuffer()];
  return PublicKey.findProgramAddressSync([recipientSeed], cashAppProgramId);
}, [cashAppProgramId]);

const transferInstruction = await program.methods
  .transferFunds(pubkey, newTransferAmount)
  .accounts({
    user: authorizationResult.publicKey,
    fromCashAccount: cashAppPDA,
    toCashAccount: recipientPDA,
  })
  .instruction();
```

Alıcının PDA'sını hesaplamak için, alıcının genel anahtarı `transferFunds` işlevine bir parametre olarak geçirilmelidir; bu, transfer edilecek miktar ve imzacı yüksekliği ile birlikte yapılmalıdır.

---

#### Talep Bileşeni

Talep sayfası için, nakit uygulama Solana programından `newRequest` işlevini çağırmamız gerekecek. Bu işlev de birden fazla hesap gerektirir. Burada, `pending_request` hesabı ve imzacıya ait `cash_account` hesabına ihtiyacınız olacak.

```tsx
const [pendingRequestPDA] = useMemo(() => {
  const pendingRequestSeed = [
    Buffer.from("pending-request"),
    requester.toBuffer(),
  ];
  return PublicKey.findProgramAddressSync(
    [pendingRequestSeed],
    cashAppProgramId,
  );
}, [cashAppProgramId]);

const requestInstruction = await program.methods
  .newPendingRequest(pubkey, requestAmount)
  .accounts({
    user: authorizationResult.publicKey,
    pendingRequest: pendingRequestPDA,
    cashAccount: cashAppPDA,
  })
  .instruction();
```

---

#### Talebi Kabul Et ve Reddet Bileşenleri

Kullanıcı, etkinlik sayfasında bekleyen ödeme talepleriyle etkileşimde bulunacaktır.

```tsx
const acceptInstruction = await program.methods
  .acceptRequest()
  .accounts({
    user: authorizationResult.publicKey,
    pendingRequest: pendingRequestPDA,
    toCashAccount: recipientPDA,
    fromCashAccount: cashAppPDA,
  })
  .instruction();

const declineInstruction = await program.methods
  .declineRequest()
  .accounts({
    user: authorizationResult.publicKey,
    pendingRequest: pendingRequestPDA,
  })
  .instruction();
```

### Ekranların Oluşturulması

#### Ödeme Ekranı

Cash App'te, ödeme ekranı, kullanıcı giriş değerini alıp başka bir ekrana yönlendiren `istek` ve `öde` butonlarıyla basit bir tuş takımıdır. 

Bu nedenle ödeme ekranı esasen bir UI çalışmasıdır. **Klavye aracılığıyla sayısal bir değer yazabilmemiz**, girdi değerini işleyebilmemiz, küçük bir modal üzerinden para birimi seçebilmemiz ve butonlar aracılığıyla istek ve ödeme sayfalarına göz atabilmemiz gerekmektedir. Aşağıda kodu bulabilirsiniz:

```tsx
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const App: React.FC<Props> = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleInput = (value: string) => {
    setInputValue(inputValue + value);
  };

  const handleBackspace = () => {
    setInputValue(inputValue.slice(0, -1));  
  };

  type NumberButtonProps = {
    number: string;
  };

  const NumberButton: React.FC<NumberButtonProps> = ({ number }) => (
    <TouchableOpacity style={styles.button} onPress={() => handleInput(number)}>
      <Text style={styles.buttonText}>{number}</Text>
    </TouchableOpacity>
  );

  const CurrencySelectorModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.bottomView}>
        <View style={styles.modalView}>
          <Text style={styles.buttonText}>Para Birimi Seçin</Text>
          <View style={styles.centeredView}>
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.currencyText}>
                {" "}
                <MaterialCommunityIcon
                  name="currency-usd"
                  size={30}
                  color="white"
                />
                ABD Doları
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.currencyText}>
                {" "}
                <MaterialCommunityIcon name="bitcoin" size={30} color="white" />
                Bitcoin
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ position: "absolute", bottom: 25 }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.mediumButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <CurrencySelectorModal />
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>${inputValue || "0"}</Text>
        <TouchableOpacity
          style={{ position: "relative", marginTop: 15 }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.smallButtonText}>
            USD{" "}
            <MaterialCommunityIcon
              name="chevron-down"
              size={15}
              color="white"
            />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.keypad}>
        <View style={styles.row}>
          {[1, 2, 3].map(number => (
            <NumberButton key={number} number={number.toString()} />
          ))}
        </View>
        <View style={styles.row}>
          {[4, 5, 6].map(number => (
            <NumberButton key={number} number={number.toString()} />
          ))}
        </View>
        <View style={styles.row}>
          {[7, 8, 9].map(number => (
            <NumberButton key={number} number={number.toString()} />
          ))}
        </View>
        <View style={styles.row}>
          <NumberButton number="." />
          <NumberButton number="0" />
          <TouchableOpacity style={styles.button} onPress={handleBackspace}>
            <Text style={styles.buttonText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          style={styles.sideButton}
          onPress={() => navigation.navigate("Receive", { inputValue })}
        >
          İstek
        </Button>
        <Button
          mode="contained"
          style={styles.sideButton}
          onPress={() => navigation.navigate("Send", { inputValue })}
        >
          Öde
        </Button>
      </View>
    </View>
  );
};
```

Yukarıdaki kodda, `İstek` ve `Öde` butonları, işleminizi tamamlamak için yeni sayfalara yönlendiriyor ve Cash App UX'ine benzer bir deneyim sunuyor.

#### İstek ve Ödeme Ekranları

`İstek` ve `Ödeme` Ekranları, önceki Ödeme ekranından giriş değerlerinizi almalı ve bunları `transferFunds` ve `newPaymentRequest` talimatlarını yürütmek için kullanmalıdır.

```tsx
const PayScreen: React.FC<Props> = ({ route, navigation }) => {
  const [reason, setReason] = useState("");
  const { inputValue } = route.params;
  const [genInProgress, setGenInProgress] = useState(false);
  const [userName, setUserName] = useState("");
  const newAmount = new anchor.BN(inputValue);

  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com"),
  );
  const { authorizeSession, selectedAccount } = useAuthorization();
  const user = selectedAccount.publicKey;
  const { cashAppProgram, cashAppPDA } = UseCashAppProgram(user);

  const transferFunds = useCallback(
    async (program: Program<CashApp>) => {
      let signedTransactions = await transact(
        async (wallet: Web3MobileWallet) => {
          const [authorizationResult, latestBlockhash] = await Promise.all([
            authorizeSession(wallet),
            connection.getLatestBlockhash(),
          ]);

          const { pubkey } = getDomainKeySync(userName);
          console.log(pubkey);
          console.log(newAmount);

          const transferInstruction = await program.methods
            .transferFunds(pubkey, newAmount)
            .accounts({
              user: authorizationResult.publicKey,
              fromCashAccount: cashAppPDA,
            })
            .instruction();

          const transferTransaction = new Transaction({
            ...latestBlockhash,
            feePayer: authorizationResult.publicKey,
          }).add(transferInstruction);

          const signedTransactions = await wallet.signTransactions({
            transactions: [transferTransaction],
          });

          return signedTransactions[0];
        },
      );

      let txSignature = await connection.sendRawTransaction(
        signedTransactions.serialize(),
        {
          skipPreflight: true,
        },
      );

      const confirmationResult = await connection.confirmTransaction(
        txSignature,
        "confirmed",
      );

      if (confirmationResult.value.err) {
        throw new Error(JSON.stringify(confirmationResult.value.err));
      } else {
        console.log("İşlem başarıyla gönderildi!");
      }
    },
    [authorizeSession, connection, cashAppPDA],
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>${inputValue}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (genInProgress) {
              return;
            }
            setGenInProgress(true);
            try {
              if (!cashAppProgram || !selectedAccount) {
                console.warn(
                  "Program/cüzdan henüz başlatılmadı. Önce bir cüzdan bağlamayı deneyin.",
                );
                return;
              }
              const deposit = await transferFunds(cashAppProgram);

              alertAndLog(
                "Nakit hesabına para yatırıldı",
                "Kaydedilen işlem için konsolu kontrol edin.",
              );
              console.log(deposit);
            } finally {
              setGenInProgress(false);
            }
          }}
        >
          <Text style={styles.buttonText}>Öde</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kime:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUserName}
          value={userName}
          placeholder="Kullanıcı"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Sebep:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setReason}
          value={reason}
          placeholder="Not"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.regular}>Satın alma korumasını etkinleştir:</Text>
        <Switch
          value={purchaseProtection}
          onValueChange={setPurchaseProtection}
          trackColor={{ false: "#767577", true: "#7F5AF0" }}
          thumbColor={purchaseProtection ? "#7F5AF0" : "#f4f3f4"}
        />
      </View>
    </View>
  );
};

export default PayScreen;
```

:::note
RequestScreen için, `transferFunds` talimatı yerine `newPaymentRequest` talimatını kullanacaksınız.
:::

Bunu deneyin, ardından işinizi buradan kontrol edin:

#### Aktivite Ekranı

Aktivite Ekranı, arkadaş eklemenize, bekleyen ödeme isteklerini görmenize, istekleri kabul etmenize ve istekleri reddetmenize olanak tanır.

Arkadaş Ekleme Özelliği için, eklemek istediğiniz arkadaşın pubkey'ini girmek için bir metin kutusuna ve arkadaş ekleme talimatını çağıran bir butona ihtiyacınız olacak.

```tsx
export function AddFriend({ address }: { address: PublicKey }) {
  const [pubkey, setPubkey] = useState("");
  const [signingInProgress, setSigningInProgress] = useState(false);
  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com"),
  );
  const { authorizeSession, selectedAccount } = useAuthorization();
  const { cashAppProgram, cashAppPDA, friends } = UseCashAppProgram(address);
  const user = friends.data?.balance;

  const addFriend = useCallback(
    async (program: Program<CashApp>) => {
      let signedTransactions = await transact(
        async (wallet: Web3MobileWallet) => {
          const [authorizationResult, latestBlockhash] = await Promise.all([
            authorizeSession(wallet),
            connection.getLatestBlockhash(),
          ]);

          const addFriendIX = await program.methods
            .addFriend(pubkey)
            .accounts({
              user: authorizationResult.publicKey,
              cashAccount: cashAppPDA,
            })
            .instruction();

          const addFriendTX = new Transaction({
            ...latestBlockhash,
            feePayer: authorizationResult.publicKey,
          }).add(addFriendIX);

          const signedTransactions = await wallet.signTransactions({
            transactions: [addFriendTX],
          });

          return signedTransactions[0];
        },
      );

      let txSignature = await connection.sendRawTransaction(
        signedTransactions.serialize(),
        {
          skipPreflight: true,
        },
      );

      const confirmationResult = await connection.confirmTransaction(
        txSignature,
        "confirmed",
      );

      if (confirmationResult.value.err) {
        throw new Error(JSON.stringify(confirmationResult.value.err));
      } else {
        console.log("İşlem başarıyla gönderildi!");
      }
    },
    [authorizeSession, connection, cashAppPDA],
  );

  return (
    <View
      style={{
        padding: 5,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Text
        variant="titleMedium"
        style={{
          color: "white",
          marginBottom: 10,
        }}
      >
        {" "}
        Yeni Arkadaş Ekle:
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextInput
          value={pubkey}
          onChangeText={setPubkey}
          style={{
            marginBottom: 10,
            marginTop: 10,
            backgroundColor: "#f0f0f0",
            height: 40,
            padding: 10,
            fontSize: 18,
            width: "60%",
            marginLeft: 20,
            marginRight: 20,
          }}
        />
        <Button
          mode="contained"
          disabled={signingInProgress}
          onPress={async () => {
            if (signingInProgress) {
              return;
            }
            setSigningInProgress(true);
            try {
              const signedTransaction = await addFriend(cashAppProgram);
              alertAndLog(
                "İşlem imzalandı",
                "Daha fazla bilgi için son işlemleri görüntüleyin.",
              );
              console.log(signedTransaction);
            } catch (err: any) {
              alertAndLog(
                "İmzalama sırasında hata",
                err instanceof Error ? err.message : err,
              );
            } finally {
              setSigningInProgress(false);
            }
          }}
        >
          Ekle
        </Button>
      </View>
    </View>
  );
}
```

:::tip
İstekleri kabul etmek ve reddetmek için benzer bir yöntemi izleyeceksiniz. Bunu kendiniz deneyin, ardından çalışmanızı gözden geçirmek için kodu buradan kontrol edin.
:::

[burada](https://github.com/solana-developers/cash-app-clone/blob/main/cash-app/src/components/solana-pay/solana-pay-ui.tsx)

## Solana Pay ile QR Kodu işlevselliğini etkinleştirme

Cash App'teki QR kodu işlevselliğini taklit etmek için, basitçe `@solana/pay` JavaScript SDK'sını kullanabilirsiniz. Daha fazla bilgi için, [Solana Pay API Referansına](https://docs.solanapay.com/api/core) başvurun.

`encodeURL` işlevi, belirli bir işlem için Solana Pay URL'sini kodlamak üzere bir miktar ve bir not alır.

Genellikle, bu işlev, bir QR kodu oluşturmak için `createQR` ile birlikte kullanılır. Bugün itibarıyla, Solana Pay'in mevcut `createQR` işlevi react-native ile uyumlu değil, dolayısıyla farklı bir QR kodu oluşturucu kullanmamız gerekecek. Bu kılavuzda, URL'yi `react-native-qrcode-svg` içindeki `QRCode`'ya gireceğiz. Aynı QR kodu stilini Solana Pay `createQR` ile elde edemeyeceğiz, ancak yine de gerekli QR kodunu doğru bir şekilde oluşturabiliriz.

Basitlik açısından, bu işlevsellik kendi ekranında yer alacak; bu ekranı daha önce Tarama Ekranı olarak tanımlamıştık. Ana ekrana benzer şekilde, `ScanScreen.tsx` dosyasına geçin ve aşağıdaki işlevi ayarlayın:

```tsx
export function ScanScreen() {
  const { selectedAccount } = useAuthorization();

  return (
    <View style={styles.container}>
      {selectedAccount ? (
        <View style={styles.container}>
          <SolanaPayButton address={selectedAccount.publicKey} />
        </View>
      ) : (
        <>
          <Text style={styles.headerTextLarge}>Solana Cash App</Text>
          <Section description="Cüzdanınızı bağlamak için Solana ile giriş yapın." />
          <SignInFeature />
        </>
      )}
    </View>
  );
}
```

Artık `SolanaPayButton` bileşenini oluşturmalıyız. `src/components/solana-pay/solana-pay-ui.tsx` altında bir dosya oluşturun. Cash App'te QR kodu, kullanıcıların Cash App profiline bir bağlantıdır ve uygulamada statik bir görüntüdür. Ancak Solana Pay QR kodu, her talep edilen işlem için benzersiz olarak oluşturulmaktadır, bu nedenle görüntülenen QR kodu miktarı, notu ve alıcının genel anahtar bilgilerini içermektedir. UI/UX'imiz, bu bölümde Cash App'ten biraz farklı işlev görecektir.

Cash App'ın görünüm ve hissini takip etmek için, ekranın çoğunluğunu QR kodunu görüntülemesine izin vereceğiz ve en altta bir modal için miktar ve not girdi alanları ile birlikte bir QR kodu oluştur butonu yer alacak. "QR Oluştur" butonuna tıkladığımızda, yeni bir Solana Pay URL'si oluşturmak ve bu değeri modaldan çıkarıp Tarama Ekranı'na göndermek isteyeceğiz, böylece ekran yeni QR kodunu görselleştirebilir.

Bunu Solana Pay API'si, durum yönetimi, koşullu render etme ve iki bileşen arasındaki veri iletimi ile gerçekleştirebiliriz, aşağıda gösterildiği gibi:

```tsx
export function SolanaPayButton({ address }: { address: PublicKey }) {
  const [showPayModal, setShowPayModal] = useState(false);

  const [url, setUrl] = useState("");

  return (
    <>
      <View>
        <View
          style={{
            height: 200,
            width: 200,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginBottom: 200,
            marginTop: 200,
          }}
        >
          {url ? (
            <>
              <View
                style={{
                  height: 350,
                  width: 350,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  backgroundColor: "#333",
                  borderRadius: 25,
                }}
              >
                <QRCode
                  value={url}
                  size={300}
                  color="black"
                  backgroundColor="white"
                />
              </View>
            </>
          ) : (
            <View
              style={{
                height: 350,
                width: 350,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                backgroundColor: "#333",
                borderRadius: 25,
              }}
            >
              <Text style={styles.text2}> Gösterilecek bir QR Kodu oluşturun. </Text>
            </View>
          )}
          <Text style={styles.text}> Ödemek için Tara </Text>
        </View>
        <SolanaPayModal
          hide={() => setShowPayModal(false)}
          show={showPayModal}
          address={address}
          setParentUrl={setUrl}
        />
        <Button
          mode="contained"
          onPress={() => setShowPayModal(true)}
          style={styles.button}
        >
          Yeni QR Kodu Oluştur
        </Button>
      </View>
    </>
  );
}

export function SolPayModal({
  hide,
  show,
  address,
  setParentUrl,
}: {
  hide: () => void;
  show: boolean;
  address: PublicKey;
  setParentUrl: (url: string) => void;
}) {
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const number = BigNumber(amount);
    const newUrl = encodeURL({
      recipient: address,
      amount: number,
      memo,
    }).toString();
    setParentUrl(newUrl);
    hide();
  };

  return (
    <AppModal
      title="Öde"
      hide={hide}
      show={show}
      submit={handleSubmit}
      submitLabel="QR Oluştur"
      submitDisabled={!memo || !amount}
    >
      <View style={{ padding: 20 }}>
        <TextInput
          label="Miktar"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20, backgroundColor: "#f0f0f0" }}
        />
        <TextInput
          label="Not"
          value={memo}
          onChangeText={setMemo}
          mode="outlined"
          style={{ marginBottom: 5, backgroundColor: "#f0f0f0" }}
        />
      </View>
    </AppModal>
  );
}

## Kullanıcı Adlarını Kamu Anahtarlarıyla Solana İsim Servisi Üzerinden Bağlama

Solana İsim Servisi _(SNS)_, okunabilir bir ismin Solana adresine eşlenmesine olanak tanır. SNS'yi uygulayarak, bir kullanıcının bir kullanıcı adı oluşturmasını kolayca isteyebiliriz _(bu, arka planda SNS adları haline gelecektir)_ ve bu isim doğrudan kullanıcıların cüzdan adresine eşlenecektir. Solana İsim Servisi'nin, bu dapp üzerinde pek çok ön yüzü basitleştirebilecek iki işlevi vardır:

- `getDomainKeySync` - sağlanan alan adıyla ilişkili olan kamu anahtarını döndüren bir işlev. Bu, bir kamu anahtarı için kullanıcı girişi gereken her yerde uygulanabilir. Artık kullanıcı bir hesaba bakarken yalnızca bir kullanıcı adı yazması yeterlidir, tam olarak Cash App'de olduğu gibi. SNS'nin buna 
  [doğrudan sorgulama](https://sns.guide/domain-name/domain-direct-lookup.html) dediği şey budur.

:::tip
Kullanıcı adı ile işlem yaparken, işlemi kolaylaştırmak için kullanıcı adlarını ve ilgili kamu anahtarlarını mümkün olduğunca iyi yönetin.
:::

- `reverseLookup` - sağlanan kamu anahtarının alan adını döndüren asenkron bir işlev. Bu, kullanıcı adını görüntülemek istediğiniz UI'nın her yerinde uygulanabilir. SNS'nin buna 
  [ters sorgulama](https://sns.guide/domain-name/domain-reverse-lookup.html) dediği şey budur.

Bunu göstermek için, fonksiyonumuzu artık bir kamu anahtarı yerine bir kullanıcı adı parametresi kabul edecek şekilde güncelleyelim ve SNS API'sini entegre edelim.

```tsx
const transferFunds = useCallback(
  async (program: Program) => {
    let signedTransactions = await transact(
      async (wallet: Web3MobileWallet) => {
        const [authorizationResult, latestBlockhash] = await Promise.all([
          authorizeSession(wallet),
          connection.getLatestBlockhash(),
        ]);

        const { pubkey } = getDomainKeySync(userName);

        const [recipientPDA] = useMemo(() => {
          const recipientSeed = pubkey.toBuffer();
          return PublicKey.findProgramAddressSync(
            [recipientSeed],
            cashAppProgramId,
          );
        }, [cashAppProgramId]);

        const transferInstruction = await program.methods
          .transferFunds(pubkey, newTransferAmount)
          .accounts({
            user: authorizationResult.publicKey,
            fromCashAccount: cashAppPDA,
            toCashAccount: recipientPDA,
          })
          .instruction();

        const transferTransaction = new Transaction({
          ...latestBlockhash,
          feePayer: authorizationResult.publicKey,
        }).add(transferInstruction);

        const signedTransactions = await wallet.signTransactions({
          transactions: [transferTransaction],
        });

        return signedTransactions[0];
      },
    );

    let txSignature = await connection.sendRawTransaction(
      signedTransactions.serialize(),
      {
        skipPreflight: true,
      },
    );

    const confirmationResult = await connection.confirmTransaction(
      txSignature,
      "confirmed",
    );

    if (confirmationResult.value.err) {
      throw new Error(JSON.stringify(confirmationResult.value.err));
    } else {
      console.log("İşlem başarıyla gönderildi!");
    }
  },
  [authorizeSession, connection, cashAppPDA],
);
```

Bu uygulama, bir girdi kamu anahtarı gerektirdiği her yerde entegre edilebilir ve kullanıcı deneyimini bir web2 uygulamasıyla aynı hale getirir.

## Son Düşünceler

Web3 mobil uygulamanızı tamamladığınız için tebrikler! Bu eğitimi tamamlayarak, bir cüzdan adaptörü ile bir expo mobil uygulaması oluşturmayı, bir anchor solana programı yazmayı ve dağıtılmış bir solana programına bir mobil UI bağlamayı öğrendiniz.

:::info
Bu süreçte öğrendiğiniz bilgiler, gelecekteki projelerinizde size büyük avantajlar sağlayacaktır.
:::

Bu bilgileri geliştirmek için, göz atabileceğiniz birkaç kaynak daha:

- [Anchor Kitabı](https://book.anchor-lang.com/)
- [Solana Kılavuzları](https://solana.com/developers/guides)
- [Program Örnekleri](https://github.com/solana-developers/program-examples)