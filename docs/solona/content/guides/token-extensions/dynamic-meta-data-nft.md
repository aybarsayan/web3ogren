---
date: 2024-04-25T00:00:00Z
difficulty: intermediate
title: Token Uzantılarını Kullanarak Dinamik Meta Veri NFT'leri
description:
  Meta veri token uzantısını kullanarak, bir NFT'nin mint işlemi sırasında 
  seviye ve XP gibi dinamik meta verileri doğrudan kaydetmek mümkündür.
tags:
  - oyunlar
  - anchor
  - program
  - web3js
  - token uzantıları
  - token 2022
  - NFT'ler
  - rust
keywords:
  - eğitim
  - blockchain geliştirici
  - blockchain eğitimi
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
  - NFT'ler
  - meta veri
  - token uzantıları
  - token 2022
---

[Token Uzantı programı](https://solana.com/developers/guides/token-extensions/getting-started) sayesinde, meta veri uzantılarını kullanarak NFT'ler ve dijital varlıklar yaratabilirsiniz. Bu uzantılar, ([meta veri işaretçisi ve token meta verisi](https://solana.com/developers/guides/token-extensions/metadata-pointer)) istediğiniz her türlü meta veriyi doğrudan zincir üzerinde kaydetmenize imkan tanır. Tüm bunlar, özelleştirilebilir bir anahtar-değer veri deposu içinde, token'ın mint hesabında yer alır ve maliyetleri ve karmaşıklığı azaltır.

:::tip
Bu özellik, özellikle [web3 oyunları](https://solana.com/solutions/games-tooling) için harikadır çünkü artık zincir üzerindeki bir anahtar-değer deposunda "ek meta veri alanları" bulundurabiliyoruz. Bu sayede oyunların NFT'nin kendisi içinde (örneğin bir oyun karakterinin istatistikleri veya envanteri) benzersiz durumu kaydetmesini/erişmesini sağlar.
:::

## Zincir Üstü Programın İnşası

Bu geliştirici kılavuzunda, Token Uzantılarına dayalı NFT'ler ve özel meta verileri nasıl oluşturacağınızı göstereceğiz. Bunu `Anchor programı` kullanarak gerçekleştireceğiz. Bu program, bir oyun oyuncusunun seviyesini ve topladığı kaynakları bir NFT içinde saklayacak.

Bu NFT, Anchor programı tarafından oluşturulacak, bu nedenle JavaScript istemcisinden mint etmesi oldukça kolaydır. Her NFT, Token Metadata arayüzü aracılığıyla sağlanan bazı temel yapıya sahip olacaktır:

- varsayılan zincir üstü alanlar - `name`, `symbol` ve `uri`
  - `uri`, NFT'nin offchain meta verilerini içeren bir offchain json dosyasına bir bağlantıdır
- ayrıca tanımladığımız özel "ilave alanlar" da olacaktır

Bu alanların tümü, NFT'nin mint hesabına işaret eden meta veri uzantısı kullanılarak kaydedilir ve böylece herkes veya her program tarafından erişilebilir hale gelir.



Bu örneğin video yürüyüşünü Solana Vakfı Youtube kanalında bulabilirsiniz:

- [Video Yürüyüşü](https://www.youtube.com/watch?v=n-ym1utpzhk)
- [Tam Kaynak Kodu](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/NFT-meta-data-pointer/anchor)



### Oyunlardaki Diğer Kullanım Durumları

Bu tür özelleştirilebilir zincir üstü meta verilere sahip NFT'ler, oyun geliştiricileri için birçok ilginç olasılık açar. Özellikle bu meta verilerin doğrudan etkileşime geçilmesi veya bir `zincir üstü program` tarafından yönetilmesi mümkündür.

Bu oyunla ilgili bazı kullanım durumları şunları içerebilir:

- oyuncunun seviyesini ve XP'sini kaydetmek
- mevcut silah ve zırh
- mevcut görev
- liste devam ediyor!

---

## NFT Mint Etme

:::info
NFT'yi oluşturmak için aşağıdaki adımları izlememiz gerekmektedir:
:::

1. Bir mint hesabı oluşturun
2. Mint hesabını başlatın
3. Bir meta veri işaretçisi hesabı oluşturun
4. Meta veri işaretçisi hesabını başlatın
5. Meta veri hesabını oluşturun
6. Meta veri hesabını başlatın
7. İlişkili token hesabını oluşturun
8. Token'ı ilişkili token hesabına mint edin
9. Mint yetkisini dondurun

### Rust Program Kodu

:::note
Token uzantı programını kullanarak NFT'yi mint etmek için kullanılan rust kodu aşağıdaki gibidir:
:::

```rust name="Program"
// arzu edilen uzantılar ile mint hesabı için gereken alanı hesaplayın
let space = ExtensionType::try_calculate_account_len::<Mint>(
    &[ExtensionType::MetadataPointer])
    .unwrap();

// Meta veri hesabı için gereken alan.
// Meta veriyi mint hesabının en sonuna koyarız, böylece
// ek bir hesap yaratmamıza gerek kalmaz.
// Sonra meta veri işaretçisi geri mint hesabına işaret eder.
// Bu teknikle, hem mint bilgileri hem de meta veri için sadece bir hesaba ihtiyaç vardır.

let meta_data_space = 250;

let lamports_required = (Rent::get()?).minimum_balance(space + meta_data_space);

msg!(
    "Mint ve meta veri hesap boyutu ve maliyeti: {} lamports: {}",
    space as u64,
    lamports_required
);

system_program::create_account(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        system_program::CreateAccount {
            from: ctx.accounts.signer.to_account_info(),
            to: ctx.accounts.mint.to_account_info(),
        },
    ),
    lamports_required,
    space as u64,
    &ctx.accounts.token_program.key(),
)?;

// Mint'i token programına atayın
system_program::assign(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        system_program::Assign {
            account_to_assign: ctx.accounts.mint.to_account_info(),
        },
    ),
    &token_2022::ID,
)?;

// Meta veri işaretçisini başlatın (Mint'i başlatmadan önce bunu yapmalısınız)
let init_meta_data_pointer_ix =
spl_token_2022::extension::metadata_pointer::instruction::initialize(
    &Token2022::id(),
    &ctx.accounts.mint.key(),
    Some(ctx.accounts.nft_authority.key()),
    Some(ctx.accounts.mint.key()),
)
.unwrap();

invoke(
    &init_meta_data_pointer_ix,
    &[
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.nft_authority.to_account_info()
    ],
)?;

// Mint cpi'yi başlatın
let mint_cpi_ix = CpiContext::new(
    ctx.accounts.token_program.to_account_info(),
    token_2022::InitializeMint2 {
        mint: ctx.accounts.mint.to_account_info(),
    },
);

token_2022::initialize_mint2(
    mint_cpi_ix,
    0,
    &ctx.accounts.nft_authority.key(),
    None).unwrap();

// Meta veri hesabı için mint yetkisi olarak bir PDA kullanıyoruz çünkü
// NFT'yi programdan güncelleyebilmek istiyoruz.
let seeds = b"nft_authority";
let bump = ctx.bumps.nft_authority;
let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

msg!("Meta veri başlatıldı {0}", ctx.accounts.nft_authority.to_account_info().key);

// Meta veri hesabını başlatın
let init_token_meta_data_ix =
&spl_token_metadata_interface::instruction::initialize(
    &spl_token_2022::id(),
    ctx.accounts.mint.key,
    ctx.accounts.nft_authority.to_account_info().key,
    ctx.accounts.mint.key,
    ctx.accounts.nft_authority.to_account_info().key,
    "Beaver".to_string(),
    "BVA".to_string(),
    "https://arweave.net/MHK3Iopy0GgvDoM7LkkiAdg7pQqExuuWvedApCnzfj0".to_string(),
);

invoke_signed(
    init_token_meta_data_ix,
    &[ctx.accounts.mint.to_account_info().clone(), ctx.accounts.nft_authority.to_account_info().clone()],
    signer,
)?;

// Meta veri hesabını, bu durumda oyuncu seviyesini içeren ek bir alan ile güncelleyin
invoke_signed(
    &spl_token_metadata_interface::instruction::update_field(
        &spl_token_2022::id(),
        ctx.accounts.mint.key,
        ctx.accounts.nft_authority.to_account_info().key,
        spl_token_metadata_interface::state::Field::Key("level".to_string()),
        "1".to_string(),
    ),
    &[
        ctx.accounts.mint.to_account_info().clone(),
        ctx.accounts.nft_authority.to_account_info().clone(),
    ],
    signer
)?;

// İlişkili token hesabını oluşturun
associated_token::create(
    CpiContext::new(
    ctx.accounts.associated_token_program.to_account_info(),
    associated_token::Create {
        payer: ctx.accounts.signer.to_account_info(),
        associated_token: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
    },
))?;

// Bir tane token'ı oyuncunun ilişkili token hesabına mint edin
token_2022::mint_to(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        token_2022::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.nft_authority.to_account_info(),
        },
        signer
    ),
    1,
)?;

// Mint yetkisini dondurun, böylece daha fazla token mint edilmeyecek ve NFT haline gelecek
token_2022::set_authority(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        token_2022::SetAuthority {
            current_authority: ctx.accounts.nft_authority.to_account_info(),
            account_or_mint: ctx.accounts.mint.to_account_info(),
        },
        signer
    ),
    AuthorityType::MintTokens,
    None,
)?;
```

### JavaScript İstemci Kodu

:::note
İstemciden NFT mint etmek çok kolaydır:
:::

```js name="Client"
const nftAuthority = PublicKey.findProgramAddressSync(
  [Buffer.from("nft_authority")],
  program.programId,
);

const mint = new Keypair();

const destinationTokenAccount = getAssociatedTokenAddressSync(
  mint.publicKey,
  publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
);

const transaction = await program.methods
  .mintNft()
  .accounts({
    signer: publicKey,
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    tokenAccount: destinationTokenAccount,
    mint: mint.publicKey,
    rent: web3.SYSVAR_RENT_PUBKEY,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    nftAuthority: nftAuthority[0],
  })
  .signers([mint])
  .transaction();

console.log("işlem", transaction);

const txSig = await sendTransaction(transaction, connection, {
  signers: [mint],
  skipPreflight: true,
});

console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
```

## Hızlı Başlangıç Örneği

Yukarıdaki örnek, Solana Oyunları Ön Ayarı'na dayanmaktadır ve bu, size JavaScript ve Unity istemcisini içeren bir iskelet oluşturur ve Solana Anchor programı ile etkileşim için yapılandırma içerir.

Aşağıdaki komut ile kendiniz çalıştırabilirsiniz:

```shell
npx create-solana-game gameName
```

### Yerel Ortamınızı Ayarlayın

:::warning
Bu örneği yerel olarak çalıştırmak için, Solana geliştirme için [yerel ortamınızı ayarlamış](https://docs.solana.com/cli/install-solana-cli-tools) olduğunuzdan emin olmalısınız; bu, Anchor CLI'yi yüklemeyi ve yapılandırmayı içerir.
:::

Eğer henüz yapmadıysanız, daha önce bağlantılı olan ayar kılavuzunu takip edebilirsiniz.

### Proje Yapısı

Anchor projesi şöyle yapılandırılmıştır:

Giriş noktası lib.rs dosyasındadır. Burada program kimliğini ve talimatları tanımlarız. Talimatlar, talimatlar klasöründe tanımlanmıştır. Durum, durum klasöründe tanımlanmıştır.

Böylece çağrılar lib.rs dosyasına gelir ve ardından talimatlara iletilir. Talimatlar, verileri almak ve güncellemek için durumu çağırır.

NFT'yi mint etme talimatını talimatlar klasöründe bulabilirsiniz.

```shell
├── src
│   ├── instructions
│   │   ├── chop_tree.rs
│   │   ├── init_player.rs
│   │   ├── mint_nft.rs
│   │   └── update_energy.rs
│   ├── state
│   │   ├── game_data.rs
│   │   ├── mod.rs
│   │   └── player_data.rs
│   ├── lib.rs
│   └── constants.rs
│   └── errors.rs

```

### Anchor Programı

`create-solana-game` aracından oluşturulan Anchor programının ayarını bitirmek için:

1. `cd program` yazarak program dizinine gidin
2. `anchor build` yazarak programı derleyin
3. `anchor deploy` yazarak programı dağıtın
4. Terminalden program kimliğini alarak `lib.rs`, `anchor.toml` ve Unity projesinde `AnchorService` ile eğer JavaScript kullanıyorsanız `anchor.ts` dosyalarına kopyalayın
5. Tekrar derleyin ve dağıtın

### NextJS İstemcisi

:::note
`create-solana-game` aracından oluşturulan NextJS istemcisinin ayarını bitirmek için:
:::

1. `programId` değerini `app/utils/anchor.ts` dosyasına kopyalayın
2. `cd app` yazarak uygulama dizinine gidin
3. Node bağımlılıklarını yüklemek için `yarn install` yazın
4. İstemciyi başlatmak için `yarn dev` yazın
5. Anchor programında değişiklik yaptıktan sonra, türleri istemciye kopyaladığınızdan emin olun ki kullanabilirsiniz. TypeScript türlerini `target/idl` klasöründe bulabilirsiniz.

## Bu Örneği Yerel Olarak Çalıştırın

:::info
Anchor'ın `test` komutu `--detach` bayrağı ile birlikte, Solana yerel test doğrulayıcınızı başlatır ve yapılandırır, programın dağıtılması sağlanır (ve testler tamamlandıktan sonra doğrulayıcıyı çalışır durumda tutar):
:::

```shell
cd program
anchor test --detach
```

Daha sonra [Solana Explorer](https://explorer.solana.com/) adresini yerel test doğrulayıcınızı kullanacak şekilde ayarlayabilirsiniz (bu, `anchor test` komutunu çalıştırdığınızda başlar) böylece işlemleri görebilirsiniz:

```
https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
```

Program, net üzerinde de zaten dağıtılmış durumda, böylece `devnet` üzerinde deneyebilirsiniz. JavaScript istemcisinin ayrıca NFT'yi mint etmek için bir düğmesi de bulunmaktadır. JavaScript istemcisini başlatmak için:

```shell
cd app
yarn install
yarn dev
```

### Unity Projesini Açın

Öncelikle Unity 2021.3.32.f1 (veya benzeri) sürümü ile Unity projesini açın, ardından `GameScene` veya `LoginScene` sahnesini açın ve oynat düğmesine basın. Sol alt köşedeki editör giriş düğmesini kullanın.

:::warning
Eğer devnet SOL alamıyorsanız, konsoldan adresinizi kopyalayıp, [devnet SOL alma](https://solana.com/developers/guides/getstarted/solana-token-airdrop-and-faucets) rehberindeki talimatları takip edebilirsiniz.
:::

### Unity'de Solana Test Doğrulayıcısına Bağlanın

Devnet SOL elde etme sorununu yaşamamak için, Unity içinden çalışan yerel test doğrulayıcınıza bağlanabilirsiniz. Cüzdan sahibi oyun nesnesine bu bağlantıları ekleyin:

```shell
http://localhost:8899
ws://localhost:8900
```

### JavaScript İstemcisini Çalıştırın

JavaScript istemcisini başlatmak ve oyunla ve programla web tarayıcınızı kullanarak etkileşime geçmek için:

- repodaki `app` dizinini açın
- Node bağımlılıklarını yükleyin
- geliştirme sunucusunu başlatmak için `dev` komutunu çalıştırın

```shell
cd app
yarn install
yarn dev
```

Programı değiştirmeye ve kendi programınıza bağlanmaya başlamak için aşağıdaki adımları izleyin.