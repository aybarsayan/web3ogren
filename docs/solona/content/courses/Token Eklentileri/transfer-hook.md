---
title: Transfer Hook
objectives:
  - "transfer-hook arayüzünü uygulayan bir program oluştur"
  - "transfer hook ile bir mint oluştur"
  - "bir transfer hook ile bir token'ı başarıyla transfer et"
description:
  "Token transfer edildiğinde bir onchain programında bir fonksiyonu çağıran bir token oluştur."
---

## Özet

- `transfer hook` uzantısı, geliştiricilerin her transferde token'ları üzerinde özelleştirilmiş mantık çalıştırmasına olanak tanır.

- Bir token bir transfer hook'a sahipse, Token Uzantıları Programı her token transferinde transfer hook talimatını çağırır.

- Programın transfer hook programı olarak çalışabilmesi için `TransferHook` arayüzünü uygulaması gerekir.

- Transfer hook'lar, normal, hook ile bağlantısız bir transferdeki hesapların ötesinde ek hesaplar da kullanabilirler. Bu hesaplara 'ek hesaplar' denir ve transfer talimatı tarafından sağlanmalıdır ve token mint oluşturulurken `extra-account-metas` içinde ayarlanır.

- Transfer hook CPI'si içinde, gönderen, mint, alıcı ve sahip tümü düşürülmüştür, yani bunlar hook için yalnızca okunabilir durumdadır. Bu, bu hesapların hiçbiri imza atamaz veya yazılamaz anlamına gelir.

---

## Genel Bakış

`transfer-hook` uzantısı, her transferden sonra aynı işlem içinde özel onchain mantığının çalıştırılmasına olanak tanır. Daha spesifik olarak, `transfer-hook` uzantısı, Solana programı şeklinde bir 'hook' veya 'callback' gerektirir; bu, 
[Transfer Hook Arayüzü](https://github.com/solana-labs/solana-program-library/tree/master/token/transfer-hook/interface)'ne uymalıdır. Ardından, bu mint'in herhangi bir token'ı transfer edildiğinde, Token Uzantıları Programı bu 'hook'u CPI olarak çağırır.

:::info 
Ek olarak, `transfer-hook` uzantısı ayrıca hook'un çalışması için gerekli olabilecek `extra-account-metas`'ı da saklar.
:::

Bu uzantı, birçok yeni kullanım durumuna olanak tanır, bunlar arasında:

- NFT'leri transfer etmek için sanatçı telif ödemelerini zorlamak.
- Token'ların bilinen kötü aktörlere transfer edilmesini engellemek (blocklistler).
- Bir token almak için belirli bir NFT'ye sahip olma zorunluluğu (allowlistler).
- Token analitikleri.

Bu derste, onchain'da transfer hook'larını nasıl uygulayacağımızı ve frontend'de bunlarla nasıl çalışacağımızı keşfedeceğiz.

### Onchain'de transfer hook'larını uygulamak

`transfer hook` ile bir mint oluşturmanın ilk kısmı, 
[Transfer Hook Arayüzü](https://github.com/solana-labs/solana-program-library/tree/master/token/transfer-hook/interface)'ne uyan bir onchain program bulmak veya yaratmaktır.

[Transfer Hook Arayüzü](https://github.com/solana-labs/solana-program-library/blob/master/token/transfer-hook/interface/src/instruction.rs) transfer hook programının şunları içermesini belirtir:

- `Execute` (zorunlu): Token Uzantıları Programı'nın her token transferinde çağırdığı bir talimat yöneticisi.

- `InitializeExtraAccountMetaList` (isteğe bağlı): transfer hook programı tarafından gereken ek hesapların listesi olan bir hesap (`extra_account_meta_list`) oluşturur.

- `UpdateExtraAccountMetaList` (isteğe bağlı): mevcut listeyi üst üste yazarak ek hesaplar listesini günceller.

:::note
Teknik olarak, arayüzü kullanarak `InitializeExtraAccountMetaList` talimatını uygulamak zorunlu değildir, ancak `extra_account_meta_list` hesabının olması gerekmektedir. Bu hesap, herhangi bir Transfer Hook programındaki herhangi bir talimat tarafından oluşturulabilir. Ancak, hesabın Program Derived Address (PDA) aşağıdaki tohumlar kullanılarak türetilmelidir:
:::

- Sabit kodlu dize `extra-account-metas`
  
- Mint Hesap adresi

- Transfer Hook program ID'si

```typescript
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from("extra-account-metas"), mint.publicKey.toBuffer()],
  program.programId, // transfer hook program ID
);
```

:::tip
`Execute` talimatındaki ek hesapların gerekli olduğu durumlarda, bu hesaplar `extra_account_meta_list` PDA'sında saklanarak client'dan bir token transfer talimatına otomatik olarak eklenebilir. Bunu offchain bölümünde göreceğiz.
:::

#### 1. `initialize_extra_account_meta_list` talimatı:

Bir token'ı Token Uzantıları Programı'nı kullanarak transfer ettiğimizde program, mint'imizi inceleyecek ve bir transfer hook'a sahip olup olmadığını belirleyecektir. Eğer bir transfer hook mevcutsa, Token Uzantıları Programı transfer hook programımıza CPI (cross-program invocation) başlatacaktır. Token Uzantıları Programı, transfer sırasında (ve `extra_account_meta_list`'te belirtilen ek hesaplar dahil olmak üzere) tüm hesapları transfer hook programına iletecektir. Ancak, 4 temel hesabı (`gönderen`, `mint`, `alıcı`, `sahip`) iletmeden önce, bu hesapları düşürecektir (yani, güvenlik nedenleriyle değiştirilebilir veya imzalanabilir yetenekleri kaldıracaktır).

:::warning
Diğer bir deyişle, hook'um bu hesapları aldığında bunlar yalnızca okunabilir olacaktır. Transfer hook programı, bu hesapları değiştiremez ve bunlarla herhangi bir işlem imzalayamaz. 
:::

Bu dört hesapla ne değiştirip ne de imzalayamasak da, `extra_account_meta_list` PDA'sındaki herhangi bir ek hesap için `is_signer` ve `is_writable` belirtebiliriz. Ayrıca, `extra_account_meta_list` PDA'sını hook programında belirtilen yeni veri hesapları için bir imzacı olarak kullanabiliriz.

`extra_account_meta_list`, herhangi bir transfer gerçekleşmeden önce oluşturulmalıdır. Ayrıca, eğer gerekirse, `UpdateExtraAccountMetaList` talimatını uygulayarak ve kullanarak `extra_account_meta_list`teki hesapların listesini güncelleyebiliriz.

`extra_account_meta_list`, yalnızca `ExtraAccountMeta` listesidir. `ExtraAccountMeta` yapısına bir göz atalım
[kaynak kodda](https://github.com/solana-labs/solana-program-library/blob/4f1668510adef2117ee3c043bd26b79789e67c8d/libraries/tlv-account-resolution/src/account.rs#L90):

```rust
impl ExtraAccountMeta {
    /// Bir genel anahtardan `ExtraAccountMeta` oluştur
    /// Bu standart `AccountMeta`yı temsil eder
    pub fn new_with_pubkey(
        pubkey: &Pubkey,
        is_signer: bool,
        is_writable: bool,
    ) -> Result<Self, ProgramError> {
        Ok(Self {
            discriminator: 0,
            address_config: pubkey.to_bytes(),
            is_signer: is_signer.into(),
            is_writable: is_writable.into(),
        })
    }

    /// Bir dizi tohumu kullanarak `ExtraAccountMeta` PDA oluştur
    pub fn new_with_seeds(
        seeds: &[Seed],
        is_signer: bool,
        is_writable: bool,
    ) -> Result<Self, ProgramError> {
        Ok(Self {
            discriminator: 1,
            address_config: Seed::pack_into_address_config(seeds)?,
            is_signer: is_signer.into(),
            is_writable: is_writable.into(),
        })
    }

    /// Farklı bir programdan bir dış program için `ExtraAccountMeta` PDA oluştur
    /// Bu PDA, yürütme programı dışında hesap listesindeki bir programa aittir. 
    /// Yürütme programındaki bir PDA için, `ExtraAccountMeta::new_with_seeds` kullanın.
    pub fn new_external_pda_with_seeds(
        program_index: u8,
        seeds: &[Seed],
        is_signer: bool,
        is_writable: bool,
    ) -> Result<Self, ProgramError> {
        Ok(Self {
            discriminator: program_index
                .checked_add(U8_TOP_BIT)
                .ok_or(AccountResolutionError::InvalidSeedConfig)?,
            address_config: Seed::pack_into_address_config(seeds)?,
            is_signer: is_signer.into(),
            is_writable: is_writable.into(),
        })
    }
}
```

`ExtraAccountMeta` oluşturmanın üç yöntemi vardır:

1. `ExtraAccountMeta::new_with_pubkey` - Normal bir hesap (program olmayan hesap) için.

2. `ExtraAccountMeta::new_with_seeds` - Çağıran transfer hook programından bir program hesabı PDA'sı için.

3. `ExtraAccountMeta::new_external_pda_with_seeds` - Farklı bir harici programdan bir program hesabı PDA'sı için.

Artık hangi hesapları saklayabileceğimizi bildiğimize göre, bunları `extra_account_meta_list`te saklayalım. `InitializeExtraAccountMetaList` talimatını kendisi hakkında konuşalım. Çoğu uygulama için, yalnızca `extra_account_meta_list` hesabını oluşturması ve ihtiyaç duyduğu ek hesaplarla yüklemesi yeterlidir.

Şimdi iki ek rastgele hesapla `extra_account_meta_list`'i başlatacağımız basit bir örneğe bakalım: `some_account` ve bir `pda_account`. `initialize_extra_account_meta_list` işlevi aşağıdakileri yapacaktır:

1. `extra_account_meta_list` hesabında saklamak istediğimiz hesapları bir vektör haline getirmek (bunu derinlemesine tartışacağız).

2. `ExtraAccountMetas` listesini saklamak için gereken boyutu ve kira miktarını hesaplamak.

3. Bir hesap oluşturmak için Sistem Programı'na bir CPI yaparak Transfer Hook Programını sahip olarak ayarlamak ve ardından `ExtraAccountMetas` listesini saklamak için hesap verilerini başlatmak.

```rust
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
  #[account(mut)]
  payer: Signer<'info>,

 /// CHECK: ExtraAccountMetaList Hesabı, bu tohumları kullanmalıdır
  #[account(
        mut,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
  pub extra_account_meta_list: AccountInfo<'info>,
  pub mint: InterfaceAccount<'info, Mint>,

  pub system_program: Program<'info, System>,

  // ekstra-account-metas'a eklenecek hesaplar
  pub some_account: UncheckedAccount<'info>,
  #[account(seeds = [b"some-seed"], bump)]
  pub pda_account: UncheckedAccount<'info>,

}

pub fn initialize_extra_account_meta_list(ctx: Context<InitializeExtraAccountMetaList>) -> Result<()> {
  let account_metas = vec![
    ExtraAccountMeta::new_with_pubkey(&ctx.accounts.some_account.key(), false, true)?, // Sadece okunabilir
    ExtraAccountMeta::new_with_seeds(
      &[
        Seed::Literal {
          bytes: "some-seed".as_bytes().to_vec(),
        },
      ],
      true, // imzacı
      true // yazılabilir
    )?,
  ];

  // hesap boyutunu hesapla
  let account_size = ExtraAccountMetaList::size_of(account_metas.len())? as u64;

  // listeyi saklamak için gereken minimum lamport miktarını hesapla
  let lamports = Rent::get()?.minimum_balance(account_size as usize);

  let mint = ctx.accounts.mint.key();
  let signer_seeds: &[&[&[u8]]] = &[&[b"extra-account-metas", &mint.as_ref(), &[ctx.bumps.extra_account_meta_list]]];

  // ExtraAccountMetaList hesabını oluştur
  create_account(
    CpiContext::new(ctx.accounts.system_program.to_account_info(), CreateAccount {
      from: ctx.accounts.payer.to_account_info(),
      to: ctx.accounts.extra_account_meta_list.to_account_info(),
    }).with_signer(signer_seeds),
    lamports,
    account_size,
    ctx.program_id
  )?;

  // ekstra hesaplarla ExtraAccountMetaList hesabını başlat
  ExtraAccountMetaList::init::<ExecuteInstruction>(
    &mut ctx.accounts.extra_account_meta_list.try_borrow_mut_data()?,
    &account_metas
  )?;

  Ok(())
}
```

:::note
Şimdi `ExtraAccountMeta`'nın saklayabileceğimiz bazı özelliklerine daha yakından bakalım.
:::

Hesap adresini doğrudan saklayabiliriz, programın kendisine ait bir PDA türetmek için tohumları saklayabiliriz ve Transfer Hook programından farklı bir program için bir PDA türetmek için tohumları saklayabiliriz.

İlk yöntemi `ExtraAccountMeta::new_with_pubkey` çok basittir; yalnızca bir hesap adresine ihtiyacınız vardır. Bu adresi talimata geçirebilir veya bir kütüphaneden (örneğin sistem programı veya token programı) alabilir ya da hatta sabit bir şekilde kodlayabilirsiniz.

Ancak burada en ilginç kısım, tohumları saklamak ve bu tohumlar ya transfer hook programının kendisi ya da bir ilişkili token hesabı gibi başka bir programın PDA'sı olabilir. Her ikisini de `ExtraAccountMeta::new_with_seeds` ve `ExtraAccountMeta::new_external_pda_with_seeds` kullanarak yapabiliriz ve onlara bu tohumları geçirebiliriz.

Tohumları geçirme yöntemlerimizi anlamak için, kaynak kodunu inceleyelim:

```rust
pub fn new_with_seeds(
  seeds: &[Seed],
  is_signer: bool,
  is_writable: bool,
)

pub fn new_external_pda_with_seeds(
  program_index: u8,
  seeds: &[Seed],
  is_signer: bool,
  is_writable: bool,
)
```

Her iki yöntemin de benzer olduğuna dikkat edin; tek değişiklik, `new_external_pda_with_seeds` metodunda kendi programımıza ait olmayan PDAlar için `program_id` geçmemiz gerektiğidir. Bunun dışında, bir tohum listesi sağlamalıyız (bunu yakında konuşacağız) ve hesap için imzacı veya yazılabilir olup olmadığını belirlemek için iki boolean (is_signer ve is_writable) sağlamalıyız.

Tohumları sağlamak biraz açıklama gerektiriyor. Sabit kodlu literal tohumlar yeterince kolay, ama ya bir tohumun değişken olmasını istiyorsanız, örneğin geçirilen bir hesabın genel anahtarı ile oluşturulmuşsa ne olur? Bunu açıklamak için, konuyu anlamayı kolaylaştırmak adına bölmeliyiz. Önce, tohum enums'larının uygulamasına bakalım
[spl_tlv_account_resolution::seeds::Seed](https://github.com/solana-labs/solana-program-library/blob/master/libraries/tlv-account-resolution/src/seeds.rs):

```rust
pub enum Seed
    /// Başlatılmamış yapılandırma bayt alanı
    Uninitialized,
    /// Sabit kodlu bir argüman
    /// Şu şekilde paketlenmiştir:
    ///     * 1 - Ayrımcı
    ///     * 1 - literal uzunluğu
    ///     * N - literal baytları
    Literal {
        /// Bayt vektörü olarak temsil edilen literal değer.
        ///
        /// Örneğin, bir literal değer bir dize literal ise,
        /// bu değer
        /// `"my-seed".as_bytes().to_vec()` olur.
        bytes: Vec<u8>,
    },
    /// Talimat verildiğinde bir argüman, talimat verilerinden çözülür
    /// Şu şekilde paketlenmiştir:
    ///     * 1 - Ayrımcı
    ///     * 1 - Talimat verilerinin başlangıç indeksi
    ///     * 1 - İndeksten itibaren talimat verilerinin uzunluğu
    InstructionData {
        /// Talimat argümanının baytlarının başladığı indeks
        index: u8,
        /// Talimat argümanının uzunluğu (bayt sayısı)
        ///
        /// Not: Maksimum tohum uzunluğu 32 bayttır, bu yüzden `u8` burada uygundur
        length: u8,
    },
    /// Tüm hesap listesinden bir hesabın genel anahtarı.
    /// Not: Bu, gerekli olan herhangi bir ek hesabı içerir.
    ///
    /// Şu şekilde paketlenmiştir:
    ///     * 1 - Ayrımcı
    ///     * 1 - Hesap listesindeki hesap indeks
    AccountKey {
        /// Tüm hesap listesindeki hesabın indeksi
        index: u8,
    },
    /// Bazı hesaba iç verilerden çözülecek bir argüman
    /// Şu şekilde paketlenmiştir:
    ///     * 1 - Ayrımcı
    ///     * 1 - Hesap listesindeki hesap indeksi
    ///     * 1 - Hesap verilerinin başladığı indeks
    ///     * 1 - İndeksten itibaren argümanın uzunluğu
    AccountData {
        /// Tüm hesap listesindeki hesabın indeksi
        account_index: u8,
        /// Hesap verilerinin argümanının baytlarının başladığı indeks
        data_index: u8,
        /// Argümanın uzunluğu (bayt sayısı)
        ///
        /// Not: Maksimum tohum uzunluğu 32 bayttır, bu yüzden `u8` burada uygundur
        length: u8,
    },
}
```

Yukarıdaki koddan görebileceğimiz gibi, tohum sağlamanın dört ana yolu vardır:

1. Sabit kodlu bir literal argüman, örneğin dize "some-seed" gibi.

2. Talimat verildiğinde bir argüman, talimat verilerinden çözülecek. Bunu yapmak için başlangıç indeksini ve istediğimiz verinin uzunluğunu vererek gerçekleştirebiliriz.

3. Hesap listesinin tamamından bir hesabın genel anahtarı. Bunu, hesabın indeksini vererek gerçekleştirebiliriz (bunu daha fazla konuşacağız).

4. Bazı hesapların iç verilerinden çözülecek bir argüman. Bunu yapmak için hesabın indeksini, verilerin başlayacağı indeksi ve verilerin uzunluğunu verebiliriz.

:::tip
İkinci ve üçüncü yöntemleri kullanabilmek için, hesap indeksini almanız gerekiyor. Bu, `Execute` fonksiyonuna geçirilen hesabın indeksini temsil eder. İndeksler standarttır:

- 0-3 indeksi her zaman `source`, `mint`, `destination` ve `owner` olacaktır.
- 4 indeksi `extra_account_meta_list` olacaktır.
- 5+ indeksi ise oluşturduğunuz `account_metas` sırasına bağlı olacaktır.
:::

```rust
    // 0-3 indeksi token transferi için gereken hesaplar (source, mint, destination, owner)
    // 4 indeksi extra_account_meta_list hesabıdır
  let account_metas = vec![
    // 5 indeksi - some_account
    ExtraAccountMeta::new_with_pubkey(&ctx.accounts.some_account.key(), false, true)?,
    // 6 indeksi - pda_account
    ExtraAccountMeta::new_with_seeds(
      &[
        Seed::Literal {
          bytes: "some-seed".as_bytes().to_vec(),
        },
      ],
      true, // imzacı
      true // yazılabilir
    )?,
  ];
```

:::note
Artık `pda_account`'ın "some-seed" ile oluşturulduğunu ve `some_account`'a ait olduğunu varsayalım. Burada hesap anahtarı indeksini belirtebiliriz:
:::

```rust
  // 0-3 indeksi token transferi için gereken hesaplar (source, mint, destination, owner)
  // 4 indeksi extra_account_meta_list hesabıdır
  let account_metas = vec![
    // 5 indeksi - some_account
    ExtraAccountMeta::new_with_pubkey(&ctx.accounts.some_account.key(), false, true)?,
    // 6 indeksi - pda_account
    ExtraAccountMeta::new_with_seeds(
      &[
        Seed::AccountKey {
          index: 5, // `some_account`'ın indeksi
        },
        Seed::Literal {
          bytes: "some-seed".as_bytes().to_vec(),
        },
      ],
      true, // imzacı
      true // yazılabilir
    )?,
  ];
```

:::warning
Not: 0-4 indeksi hesapları, `Execute` fonksiyonu tarafından belirlenir. Bunlar şunlardır: `source`, `mint`, `destination`, `owner`, `extra_account_meta_list` sırasıyla. İlk dördü, yalnızca okunabilir durumdadır. Bunlar her zaman yalnızca okunabilir olacaktır. Bu ilk dört hesap içinden herhangi birini `extra_account_meta_list`e eklemeye çalışırsanız, bunlar her zaman yalnızca okunabilir olarak kabul edilir, is_writable veya is_signer ile farklı şekilde belirleseniz bile.
:::

#### 2. `transfer_hook` Talimatı

Anchor'da, `Execute` fonksiyonu çağrıldığında `transfer_hook` talimatını arar ve çağırır. Bu, token transferi için özel mantığımızı uygulayabileceğimiz yerdir.

:::info
Token Uzantıları Programı programımızı tetiklediğinde, bu talimatı çağırır ve transfer edilen miktar ile birlikte tüm hesapları geçirir. İlk 5 hesap her zaman `source`, `mint`, `destination`, `owner`, `extraAccountMetaList` olacak ve geri kalanı, varsa, `ExtraAccountMetaList` hesabına eklediğimiz hesaplar olacaktır.
:::

Bu talimat için bir örnek `TransferHook` yapısına göz atalım:

```rust
// Hesapların sırası bu yapı için önemlidir.
// İlk 4 hesap, token transferi için gereken hesaplar (source, mint, destination, owner)
// Kalan hesaplar, ExtraAccountMetaList hesabından gereken ek hesaplarıdır
// Bu hesaplar, Token Uzantıları Programı tarafından bu programa CPI ile sağlanır.
```

# Transfer Hook Programı

## Frequency Guidelines

### 1. Stratejik Kullanım

:::info
Burada sıranın önemli olduğunu unutmayın; ilk 5 hesap öyle görünmelidir ve ardından `extraAccountMetaList` hesabındaki hesaplardaki sırayı takip etmelidir.
:::

Bunun dışında, transfer kancası içinde istediğiniz herhangi bir işlevselliği yazabilirsiniz. Fakat unutmayın, eğer kanca başarısız olursa, tüm işlem başarısız olur.

```rust
pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
    // burada mantığınızı gerçekleştirin
    Ok(())
}
```

---

### 3. Fallback

:::warning
Transfer kancalarının on-chain bölümündeki son bir uyarı: Anchor ile çalışırken, Token Extensions Programından Cross-Program Invocation (CPI) işlemlerini yönetmek için Anchor programında bir `fallback` talimatı belirtmemiz gerekiyor.
:::

Bu, Anchor'ın `transfer_hook` talimatı arayüz talimatlarında kullanılanlardan farklı olarak talimat ayırtıcıları oluşturmasından dolayı gereklidir. 

```rust
// anchor talimat ayırtıcı kontrolü için geçici çözüm olarak fallback talimat yöneticisi
pub fn fallback<'info>(program_id: &Pubkey, accounts: &'info [AccountInfo<'info>], data: &[u8]) -> Result<()> {
  let instruction = TransferHookInstruction::unpack(data)?;

  match instruction {
      TransferHookInstruction::Execute { amount } => {
          let amount_bytes = amount.to_le_bytes();
          // programımızda özel transfer kanca talimatını çağır
          __private::__global::transfer_hook(program_id, accounts, &amount_bytes)
      }
      _ => {
          return Err(ProgramError::InvalidInstructionData.into());
      }
  }
}
```

---

### Transfer Kancaları ile Frontend'den Kullanım

:::tip
Transfer Hook arayüzünü takip eden bir Solana programı dağıttığımızı varsayalım.
:::

Transfer kancası ile birlikte bir mint oluşturmak ve başarılı transferler sağlamak için şu adımları izleyin:

1. **Transfer kancası uzantısı ile mint oluşturun** ve kullanmak istediğiniz on-chain transfer kanca programına işaret edin.
2. **`extraAccountList` hesabını başlatın.** Bu adım, herhangi bir transferden önce yapılmalıdır ve mint sahibinin/yaratıcısının sorumluluğudur. Her mint için sadece bir kez yapılması gerekir.
3. **Token Extensions Programından transfer talimatı çağrıldığında,** tüm gerekli hesapları geçtiğinizden emin olun.

---

#### `Transfer-Hook` Uzantısı ile Bir Mint Oluşturun:

Transfer-kanca uzantısı ile bir mint oluşturmak için üç talimat gereklidir:

1. `createAccount` - Mint hesabı için blockchain üzerinde alan ayırır.
2. `createInitializeTransferHookInstruction` - transfer kanca uzantısını başlatır, bu, transfer kancasının program adresini parametre olarak alır.
3. `createInitializeMintInstruction` - Mint'i başlatır.

```ts
const extensions = [ExtensionType.TransferHook];

const mintLen = getMintLen(extensions);

const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

const transaction = new Transaction().add(
  // Mint hesabını ayır
  SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintLen,
    lamports: lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
  // Transfer kanca uzantısını başlatın ve programımıza işaret edin
  createInitializeTransferHookInstruction(
    mint.publicKey,
    wallet.publicKey,
    program.programId, // Transfer Kanca Programı ID
    TOKEN_2022_PROGRAM_ID,
  ),
  // Mint talimatı başlat
  createInitializeMintInstruction(mint.publicKey, decimals, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
);
```

---

#### `ExtraAccountMetaList` Hesabını Başlatın:

Mint'i herhangi bir işlem için hazırlamanın bir sonraki adımı `ExtraAccountMetaList`'i başlatmaktır. 

:::note
Bu Transfer Kanca Arayüzünün bir parçası olduğundan, bu standartlaştırılmış olmalıdır. 
:::

Kendi programınızı Anchor içinde oluşturduysanız, IDL'ler derleme işleminden sonra `target/idl` klasöründe olacaktır. Testler veya istemci kodunda, doğrudan `anchor.workspace.program_name.method` üzerinden yöntemlere erişebilirsiniz:

```ts
import * as anchor from "@coral-xyz/anchor";

const program = anchor.workspace.TransferHook as anchor.Program<TransferHook>;
// şimdi program.method size programın yöntemlerini verecektir
```

Böylece `ExtraAccountMetaList`'i başlatmak için yapmamız gereken tek şey, yöntemlerden `initializeExtraAccountMetaList`'i çağırmak ve doğru hesapları ona geçirmek.

```ts
const initializeExtraAccountMetaListInstruction = await program.methods
  .initializeExtraAccountMetaList()
  .accounts({
    mint: mint.publicKey,
    extraAccountMetaList: extraAccountMetaListPDA,
    anotherMint: crumbMint.publicKey,
  })
  .instruction();

const transaction = new Transaction().add(
  initializeExtraAccountMetaListInstruction,
);
```

`initializeExtraAccountMetaList`'i çağırdıktan sonra, transfer kanca etkinleştirilmiş mint ile token transferi yapmak için her şey hazır.

---

#### Tokenları Başarıyla Transfer Et:

`transfer hook` uzantısı ile tokenları gerçekten transfer etmek için, `createTransferCheckedWithTransferHookInstruction`'ı aramanız gerekir. 

```ts
const transferInstruction =
  await createTransferCheckedWithTransferHookInstruction(
    connection,
    sourceTokenAccount,
    mint.publicKey,
    destinationTokenAccount,
    wallet.publicKey,
    BigInt(1), // miktar
    0, // Ondalık
    [],
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );
```

Arka planda, `createTransferCheckedWithTransferHookInstruction` yöntemi mint'in bir transfer kancasına sahip olup olmadığını kontrol eder, eğer varsa ekstra hesapları alır ve bunları transfer talimatına ekler.
[Kaynak koduna bir göz atın](https://github.com/solana-labs/solana-program-library/blob/8ae0c89c12cf05d0787ee349dd5454e1dcbe4a4f/token/js/src/extensions/transferHook/instructions.ts#L261)

```ts
/**
 * Transfer kanca için ekstra hesaplarla transferChecked talimatı oluştur
 *
 * @param connection            Kullanılacak bağlantı
 * @param source                Kaynak hesap
 * @param mint                  Güncellenecek mint
 * @param destination           Hedef hesap
 * @param owner                 Kaynak hesabının sahibi
 * @param amount                Transfer edilecek token miktarı
 * @param decimals              Transfer miktarındaki ondalık sayısı
 * @param multiSigners          Çoklu imza sahibi hesap(ler)i
 * @param commitment            Kullanılacak taahhüt
 * @param programId             SPL Token program hesabı
 *
 * @return Bir işlem oluştur
 */
export async function createTransferCheckedWithTransferHookInstruction(
  connection: Connection,
  source: PublicKey,
  mint: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: bigint,
  decimals: number,
  multiSigners: (Signer | PublicKey)[] = [],
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
) {
  const instruction = createTransferCheckedInstruction(
    source,
    mint,
    destination,
    owner,
    amount,
    decimals,
    multiSigners,
    programId,
  );

  const mintInfo = await getMint(connection, mint, commitment, programId);
  const transferHook = getTransferHook(mintInfo);

  if (transferHook) {
    await addExtraAccountMetasForExecute(
      connection,
      instruction,
      transferHook.programId,
      source,
      mint,
      destination,
      owner,
      amount,
      commitment,
    );
  }

  return instruction;
}
```

---

### Teorik Örnek - Sanatçı Royalty'leri

:::note
`transfer hook` uzantısı hakkında bildiklerimizi temel alarak, NFT'ler için sanatçı royalty'lerini uygulamanın kavramsal olarak nasıl gerçekleşebileceğine bir göz atalım.
:::

Eğer tanımıyor iseniz, sanatçı royalisi, bir NFT'nin herhangi bir satışında ödenen bir ücrettir. Tarihsel olarak, bunlar daha çok öneriler gibi olmuşlardır zira herhangi bir zamanda bir kullanıcı, royalty'leri uygulamayan bir platform veya programda ödeme karşılığında NFT'sini takas edebilir. İyi bir taraftan, transfer kancaları ile biraz daha yakınlaşabiliriz.

**Birinci Yaklaşım** - SOL'ü doğrudan `owner`dan sanatçıya doğrudan kancada transfer etmek. 

:::warning
Bu kulağa iyi bir yol gibi gelse de iki sebepten dolayı işe yaramayacak.
:::

Birincisi, kanca sanatçıya ne kadar ödeme yapılacağını bilmeyecek - bunun sebebi transfer kancasının gerekli `source`, `mint`, `destination`, `owner`, `extraAccountMetaList` ve listedeki tüm hesaplar dışında herhangi bir argümanı almamasıdır. 

#### İkinci Yaklaşım

Royalti'nin ödenip ödenmediğini takip eden `extraAccountMetaList` tarafından sahiplenen bir veri PDA'sı oluşturmak. Eğer ödenmişse transfere izin verin, ödenmemişse reddedin. Bu yaklaşım çok aşamalıdır ve transfer kanca programında ek bir işlev gerektirecektir.

Diyelim ki transfer kanca programımızda `payRoyalty` adında yeni bir yöntemimiz var. Bu işlev şunları yerine getirmelidir:

1. `extraAccountMetaList` tarafından sahiplenen bir veri PDA'sı oluşturun.
2. Royalti miktarını `owner`dan sanatçıya transfer edin.
3. Satış bilgileri ile veri PDA'sını güncelleyin.

Sonra transferi gerçekleştireceğiz ve transfer kancasının yapması gereken tek şey, PDA'daki satış verilerini kontrol etmektir. Oradan transfere izin verip vermeyeceğine karar verecektir.

Unutmayın ki, yukarıda belirtilenler sadece teorik bir tartışmadır ve kapsamlı değildir.

---

## Laboratuvar

Bu laboratuvarında transfer kancalarının nasıl çalıştığını keşfedeceğiz ve bir Cookie Crumb programı yaratacağız. Bir Cookie NFT'sine sahip olacağız ve her transferden sonra gönderen kişiye bir Crumb SFT (1'den fazla tedarik olan NFT) mintleme işlemi uygulayacağız - bir "crumb izi" bırakacağız. İlginç bir yan etki olarak, bu NFT'nin kaç kez transfer edildiğini sadece crumb tedarikine bakarak görebileceğiz.

### 0. Kurulum

#### 1. Solana/Anchor/Rust Sürümlerini Doğrulama

Bu laboratuvarında `Token Extensions Program` ile etkileşimde bulunacağız ve bunun için Solana CLI sürümünün ≥ 1.18.1 olmasını gerektirir.

Sürümünüzü kontrol etmek için şu komutu çalıştırın:

```bash
solana --version
```

Eğer `solana --version` komutunu çalıştırdıktan sonra yazdırılan sürüm `1.18.0`'dan düşükse, CLI sürümünü manuel olarak güncelleyebilirsiniz.

```bash
solana-install init 1.18.1
```

Programı derlemeye çalıştığınız herhangi bir noktada bu hatayla karşılaşılırsa, doğru Solana CLI sürümüne sahip değilsiniz demektir.

```bash
anchor build
error: package `solana-program v1.18.1` cannot be built because it requires rustc 1.72.0 or newer, while the currently active rustc version is 1.68.0-dev
```

Ayrıca, en son sürümde Anchor CLI'yi de yüklemek isteyeceksiniz. Bunu [avm aracılığıyla Anchor'ı güncelleyerek](https://www.anchor-lang.com/docs/avm) yapabilirsiniz.

ya da sadece şu komutları çalıştırabilirsiniz:

```bash
avm install latest
avm use latest
```

Yazma anında, Anchor CLI'nin en son sürümü `0.30.1`'dir. 

---

### 2. Başlangıç kodunu alın

Başlangıç dalını alalım.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-transfer-hooks
cd solana-lab-transfer-hooks
git checkout starter
```

#### 3. Program Kimliğini ve Anchor Anahtar çiftini Güncelleyin

Başlangıç dalında olduğunuzda, şu komutu çalıştırın:

```bash
anchor keys sync
```

Bu, program anahtarınızı `Anchor.toml` dosyasındaki ve `programs/transfer-hook/src/lib.rs` dosyasındaki tanımlı program kimliği ile senkronize eder.

Son yapmanız gereken, `Anchor.toml` dosyasındaki anahtar çifti yolunu ayarlamaktır:

```toml
[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"
```

---

#### 4. Programın derlendiğini doğrulayın

Her şeyin doğru yapılandırıldığını doğrulamak için başlangıç kodunu derleyelim. Eğer derlenmezse, lütfen yukarıdaki adımları gözden geçirin.

```bash
anchor build
```

Derleme betiğinin uyarılarını güvenle göz ardı edebilirsiniz. Ancak sonunda, şöyle bir mesaj görmelisiniz:

```bash
Finished release [optimized] target(s)
```

Geliştirme ortamının geri kalanının doğru şekilde kurulup kurulmadığını kontrol etmek için sağlanan testleri çalıştırabilirsiniz. Node bağımlılıklarını `npm` veya `yarn` kullanarak yüklemeniz gerekecek.

```bash
yarn install
anchor test
```

Bu testleri daha sonra dolduracağız.

---

### 1. Transfer Kanca Programını Yazın

Bu bölümde, anchor kullanarak on-chain transfer kanca programını yazmaya dalacağız, tüm kod `programs/transfer-hook/src/lib.rs` dosyasına gidecek.

`lib.rs` dosyasının içine bir göz atın, bazı başlangıç kodlarımızın olduğunu göreceksiniz:

#### Talimatlar

- `initialize_extra_account_meta_list`
- `transfer_hook`
- `fallback`

#### Hesap Yapısı

- `InitializeExtraAccountMetaList`
- `TransferHook`

`initialize_extra_account_meta_list` fonksiyonu, transfer kancası için gereken ek hesapları başlatır.

```rust

# Frequency Guidelines
- Maximum 5 enhancement features per 2000 characters
- Distribute features evenly throughout the content
- Only add where they significantly improve understanding

## Strategic Use of Admonitions

:::tip
For helpful suggestions and best practices, ensure that you list the necessary accounts for the transfer hook instruction.
:::

:::info
The `mint_authority` account is derived from the seed `b"mint-authority"`. This will allow the program itself to sign for minting.
:::

:::warning
Be mindful that `crumb_mint_ata` or `associated_token_program` is not defined explicitly. This is because `crumb_mint_ata` is variable and is directed from other accounts in `extra_account_meta_list`.
:::

:::note
The sequence of accounts is crucial in the `TransferHook` struct, as it affects how the Token Extensions Program provides these accounts with a CPI call.
:::

:::danger
Ensure you do not modify any URLs, paths, or references, as maintaining links and paths is critical for your code.
:::

---

## Quote Formatting

> "Each account within the `TransferHook` struct has specific requirements, especially the first four accounts needed for the token transfer."  
> — Transfer Hook Struct Documentation

---

## Details Elements


<summary>Expand to learn more about the `initialize_extra_account_meta_list` command.</summary>

The `initialize_extra_account_meta_list` function performs the following operations:
1. Lists the necessary accounts for the transfer hook instruction.
2. Calculates the space and rent required for `extra_account_meta_list`.
3. Makes a CPI call to the System Program to create an account and sets the Transfer Hook Program as the owner.
4. Initializes account data for storing the `extra_account_meta_list`.



---

## Content Structure

**`initialize_extra_account_meta_list` Instruction**

Let’s write the `initialize_extra_account_meta_list` function that will do the following:

1. **List Accounts**: Transfer hook instruction requires necessary accounts in a vector.
2. **Calculate Sizes**: Calculate the size and rent required for `extra_account_meta_list`.
3. **Create Account**: Make a CPI call to System Program to create an account and set Transfer Hook Program as owner.
4. **Initialize Data**: Initialize account data for storing accounts in `extra_account_meta_list`.

Here’s the code for that:

```rust
pub fn initialize_extra_account_meta_list(ctx: Context) -> Result {
  ...
}
```

---

### `transfer_hook` Instruction

At this stage, we will implement the `transfer_hook` instruction. This instruction will be called by the Token Extensions Program whenever a token transfer occurs.

> "The transfer_hook instruction will mint a crumb token every time a cookie transfer occurs."  
> — Transfer Hook Purpose Explanation

The `TransferHook` structure will hold the necessary accounts for this instruction:

```rust
#[derive(Accounts)]
pub struct TransferHook {
  ...
}
```

---

**`transfer_hook` Instruction**

This instruction is straightforward as it will make a CPI to the Token Program to mint a new crumb token for each transfer. We just need to pass the correct accounts to the `mint_to` CPI.

```rust
pub fn transfer_hook(ctx: Context, _amount: u64) -> Result {
  ...
}
```

Make sure to run the program tests to validate that everything is functioning as intended:

```bash
anchor test
```

#### 4. "Crumb Mint" Testini Yazın

Şimdi kurabiye NFT'mizi oluşturduğumuza göre, **crumb** SFT'lerimizi de oluşturmamız gerekiyor. Kurabiyemizin her transferinde basılacak crumb'ları oluşturmak ikinci testimiz olacak.

> "Unutmayın ki crumb'larımız bir Token Programı mintidir ve metadata eklemek için Metaplex'i kullanmamız gerekiyor."  
> — Mantıksal açıklama

Öncelikle bazı Metaplex hesaplarını alıp metadata'mızı formatlamamız gerekiyor.


<summary>Metadata Formatlama</summary>
Metadata'mızı formatlamak için, Metaplex'in `DataV2` yapısını karşılamamız gerekiyor - bunun için sadece `crumbMetadata`'mıza bazı ek alanlar eklememiz yeterli.


Gereksinim duyacağımız Metaplex hesapları şunlardır:

- `TOKEN_METADATA_PROGRAM_ID`: Metaplex programı
- `metadataPDA`: `crumbMint`'imizden türetilen metadata hesap PDA'sı

---

Son olarak, crumb'ı oluşturmak için aşağıdaki talimatlara ihtiyacımız var:

- `SystemProgram.createAccount`: Mintimiz için alan ayırır
- `createInitializeMintInstruction`: Mintimizi başlatır
- `createCreateMetadataAccountV3Instruction`: Metadata hesabını oluşturur
- `createSetAuthorityInstruction`: Bu, mint yetkisini `crumbMintAuthority`'ye ayarlayarak, transfer kancası programının sahip olduğu PDA'yı belirler

Hepsini bir araya getirdiğimizde aşağıdaki gibi bir sonuç elde ederiz:

```ts
it("Create Crumb Mint", async () => {
  // SFT'nin 0 ondalık haneli olması gerekiyor
  const decimals = 0;

  const size = MINT_SIZE;
  const lamports = await connection.getMinimumBalanceForRentExemption(size);

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  );

  const metadataData: DataV2 = {
    ...crumbMetadata,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      crumbMint.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );

  const metadataPDA = metadataPDAAndBump[0];

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payerWallet.publicKey,
      newAccountPubkey: crumbMint.publicKey,
      space: size,
      lamports: lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      crumbMint.publicKey, // mint
      decimals, // ondalık
      payerWallet.publicKey, // mint yetkisi
      null, // dondurma yetkisi
      TOKEN_PROGRAM_ID,
    ),
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: crumbMetadata.mint,

        mintAuthority: payerWallet.publicKey,        
        payer: payerWallet.publicKey,
        updateAuthority: payerWallet.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          collectionDetails: null,
          data: metadataData,
          isMutable: true,
        },
      },
    ),
    createSetAuthorityInstruction(
      // yetkiyi transfer kancası PDA'sına ayarlayın
      crumbMint.publicKey, // mint
      payerWallet.publicKey, // mevcut yetki
      AuthorityType.MintTokens, // yetki türü
      crumbMintAuthority, // yeni yetki
      [], // çoklu imzalar
      TOKEN_PROGRAM_ID,
    ),
  );

  const txSig = await sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [payerWallet.payer, crumbMint],
    { skipPreflight: true },
  );

  console.log(getExplorerLink("transaction", txSig, "localnet"));
});
```

---

#### 5. "ExtraAccountMetaList Hesabını Başlatır" Testini Yazın

Bir sonraki testimiz, **kurabiyemizi** transfer etmeye başlayabilmemiz ve transfer kancamızın çalışmasını görebilmemiz için kurulumun son adımıdır. `ExtraAccountMetaList` hesabını oluşturmalıyız.

**Dikkat:** Bu sefer yalnızca bir talimat yürütmemiz gerekiyor: `initializeExtraAccountMetaList`. Bu, uyguladığımız işlevdir.

Unutmayın, bu aşağıdaki ek hesapları alır:

- `mint`: Kurabiye minti
- `extraAccountMetaList`: Ek hesapları tutan PDA
- `crumbMint`: Crumb minti

```ts
// Transfer kancası talimatı tarafından gereken ekstra hesapları saklamak için hesap
it("Initializes ExtraAccountMetaList Account", async () => {
  const initializeExtraAccountMetaListInstruction = await program.methods
    .initializeExtraAccountMetaList()
    .accounts({
      mint: cookieMint.publicKey,
      extraAccountMetaList: extraAccountMetaListPDA,
      crumbMint: crumbMint.publicKey,
    })
    .instruction();

  const transaction = new Transaction().add(
    initializeExtraAccountMetaListInstruction,
  );

  const txSig = await sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [payerWallet.payer],
    {
      skipPreflight: true,
      commitment: "confirmed",
    },
  );

  console.log(getExplorerLink("transaction", txSig, "localnet"));
});
```

---

#### 6. "Transfer ve Geri Transfer" Testini Yazın

Son testimiz, kurabiyemizi geri ve ileri transfer etmek ve **crumb'larımızın** hem `payerWallet` hem de `recipient`'e basıldığını görmek.

Ancak transferden önce, hem `payerWallet` hem de `recipient` için kurabiye ve crumb tokenlerini tutacak ATAs'ları oluşturmalıyız. Bunu, `getOrCreateAssociatedTokenAccount` çağrısı yaparak gerçekleştirebiliriz. Sadece `destinationCookieAccount`, `sourceCrumbAccount` ve `destinationCrumbAccount`'i almak için bunu yapmamız gerekiyor.

**Not:** Çünkü `sourceCookieAccount`, NFT'yi mintlediğimizde oluşturulmuştur.

Transfer etmek için `createTransferCheckedWithTransferHookInstruction` çağrısını yaparız. Bu aşağıdakileri alır:

- `connection`: Kullanılacak bağlantı
- `source`: Kaynak token hesabı
- `mint`: Transfer edilecek mint
- `destination`: Hedef token hesabı
- `owner`: Kaynak token hesabının sahibi
- `amount`: Transfer edilecek miktar
- `decimals`: Mint'in ondalıkları
- `multiSigners`: Çoklu imza için imza hesapları
- `commitment`: Kullanılacak taahhüt
- `programId`: SPL Token program hesabı

Bunu `recipient`'e iki kez çağıracağız.

Bunun, transfer kancası için gereken **crumbMint** gibi herhangi bir ek hesabı almadığını görebilirsiniz. Bunu, bu işlevin bizim için `extraAccountMeta`'yı alması ve gerekli tüm hesapları otomatik olarak dahil etmesinden kaynaklanıyor! Bununla birlikte, bu asenkron olduğundan, `await` etmemiz gerekecek.

Son olarak, transferlerden sonra crumb mint'i alacağız ve toplam arzın iki olduğunu doğrulayacağız ve hem `sourceCrumbAccount` hem de `destinationCrumbAccount`'in bazı crumb'lara sahip olduğunu kontrol edeceğiz.

> "Hepsini bir araya getirdiğimizde son testimizi elde ederiz:"  
> — Tanım

```ts
it("Transfer and Transfer Back", async () => {
  const amount = BigInt(1);
  const decimals = 0;

  // Gerekli tüm ATAs'ları oluştur
  const destinationCookieAccount = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payerWallet.payer,
      cookieMint.publicKey,
      recipient.publicKey,
      false,
      undefined,
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID,
    )
  ).address;

  const sourceCrumbAccount = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payerWallet.payer,
      crumbMint.publicKey,
      payerWallet.publicKey,
      false,
      undefined,
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    )
  ).address;

  const destinationCrumbAccount = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payerWallet.payer,
      crumbMint.publicKey,
      recipient.publicKey,
      false,
      undefined,
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    )
  ).address;

  // Standart token transfer talimatı
  const transferInstruction =
    await createTransferCheckedWithTransferHookInstruction(
      connection,
      sourceCookieAccount,
      cookieMint.publicKey,
      destinationCookieAccount,
      payerWallet.publicKey,
      amount,
      decimals, // Ondalık
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

  const transferBackInstruction =
    await createTransferCheckedWithTransferHookInstruction(
      connection,
      destinationCookieAccount,
      cookieMint.publicKey,
      sourceCookieAccount,
      recipient.publicKey,
      amount,
      decimals, // Ondalık
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

  const transaction = new Transaction().add(
    transferInstruction,
    transferBackInstruction,
  );

  const txSig = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payerWallet.payer, recipient],
    {
      skipPreflight: true,
    },
  );

  console.log(getExplorerLink("transaction", txSig, "localnet"));

  const mintInfo = await getMint(
    connection,
    crumbMint.publicKey,
    "processed",
    TOKEN_PROGRAM_ID,
  );

  const sourceCrumbAccountInfo = await getAccount(
    connection,
    sourceCrumbAccount,
    "processed",
    TOKEN_PROGRAM_ID,
  );

  const destinationCrumbAccountInfo = await getAccount(
    connection,
    destinationCrumbAccount,
    "processed",
    TOKEN_PROGRAM_ID,
  );

  expect(Number(mintInfo.supply)).to.equal(2);
  expect(Number(sourceCrumbAccountInfo.amount)).to.equal(1);
  expect(Number(destinationCrumbAccountInfo.amount)).to.equal(1);

  console.log("\nCrumb Sayısı:", Number(mintInfo.supply));
  console.log("Kaynak Crumb Miktarı:", Number(sourceCrumbAccountInfo.amount));
  console.log(
    "Hedef Crumb Miktarı\n",
    Number(destinationCrumbAccountInfo.amount),
  );
});
```

---

Bütün testleri çalıştırın:

```bash
anchor test
```

Hepsinin geçmesi gerekiyor!

Explorerdaki herhangi bir linki incelemek isterseniz şunları yapın:

```bash
solana-test-validator --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ./tests/metaplex_token_metadata_program.so
```

Sonra şunu test edebilirsiniz:

```bash
anchor test --skip-local-validator
```

---

**Hepsi bu kadar!** Transfer kancası ile bir mint oluşturdunuz!

## Görev

Transfer kancasını değiştirin, böylece bir crumb'a sahip olan hiç kimse kurabiyesini geri alamaz.