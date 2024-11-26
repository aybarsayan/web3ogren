---
title: CPI Guard
objectives:
  - CPI Guard'ın neye karşı koruma sağladığını açıklamak
  - CPI Guard'ı test etmek için kod yazmak
description:
  "Diğer programlardan çağrılmasına izin vermeyen token oluşturma."
---

## Özet

- `CPI Guard`, Token Extensions Programı'ndan bir token hesap uzantısıdır.
- `CPI Guard` uzantısı, çapraz-program çağrıları sırasında belirli eylemleri yasaklar. Etkinleştirildiğinde, koruma sağlar ve token hesabında çeşitli potansiyel olarak kötü niyetli eylemlere karşı güvenlik önlemleri sağlar.
- `CPI Guard`, istenildiği zaman etkinleştirilebilir veya devre dışı bırakılabilir.
- Bu korumalar, `Token Extensions Program` içinde uygulanır.

## Genel Bakış

CPI Guard, çapraz-program çağrıları sırasında belirli eylemleri yasaklayan bir uzantıdır. Bu, kullanıcıları, Sistem veya Token programlarının dışında gizli olan eylemler için istemeden imza atmaktan korur.

:::tip
CPI Guard'ın sağladığı korumalar, kullanıcıların kötü niyetli işlemleri gerçekleştirmesini engelleyerek güvenliği artırır.
:::

Bunun belirli bir örneği, CPI guard etkinleştirildiğinde, hiçbir CPI'nin bir token hesabı üzerinde bir delege onaylayamayacağıdır. Bu kullanışlıdır çünkü kötü niyetli bir CPI `set_delegate` çağrısı yaptığında, hemen görünür bir bakiye değişikliği yoktur, ancak saldırgan artık token hesabı üzerinde transfer ve yakma yetkisine sahip olur. CPI guard bunu imkansız hale getirir.

Kullanıcılar, token hesaplarındaki CPI Guard uzantısını istedikleri zaman etkinleştirebilir veya devre dışı bırakabilir. Etkinleştirildiğinde, CPI sırasında aşağıdaki etkileri vardır:

- **Transfer**: imza yetkisi, hesap sahibi veya daha önce atanmış hesap delegesi olmalıdır.
- **Yak**: imza yetkisi, hesap sahibi veya daha önce atanmış hesap delegesi olmalıdır.
- **Onayla**: yasaklı - CPI içinde herhangi bir delege onaylanamaz.
- **Hesabı Kapat**: lamport hedefi, hesap sahibi olmalıdır.
- **Kapatma Yetkisini Belirle**: kaldırma olmadığı sürece yasaklı.
- **Sahibi Belirle**: her zaman yasaklı, CPI dışında bile.

CPI Guard, her bir bireysel Token Extensions Programı token hesabının etkinleştirilmesi gereken bir uzantıdır.

### CPI Guard Nasıl Çalışır

CPI Guard, uzantı için yeterli alanla oluşturulmuş bir token hesabında etkinleştirilebilir ve devre dışı bırakılabilir. `Token Extensions Program` yukarıda belirtilen eylemlerle ilgili mantıkta birkaç kontrol çalıştırır, böylece bir talimatın devam edip etmeyeceğine karar verir. Genel olarak aşağıdakileri yapar:

- Hesabın CPI Guard uzantısına sahip olup olmadığını kontrol eder.
- Token hesabında CPI Guard'ın etkinleştirilip etkinleştirilmediğini kontrol eder.
- Fonksiyonun bir CPI içinde çalışıp çalışmadığını kontrol eder.

CPI Guard token uzantısını düşünmenin iyi bir yolu, ya etkin ya da devre dışı olan bir kilit olarak düşünmektir. Koruma, bir boolean değeri saklayan 
[data struct 'CpiGuard'](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/extension/cpi_guard/mod.rs#L24) kullanır. Bu değer, korumanın etkin mi yoksa devre dışı mı olduğunu gösterir. CPI Guard uzantısının sadece iki talimatı vardır: `Enable` ve `Disable`. Her biri bu boolean değerini değiştirmektedir.

```rust
pub struct CpiGuard {
    /// Kilitli ayrıcalıklı token işlemlerinin CPI aracılığıyla gerçekleşmesini engelle
    pub lock_cpi: PodBool,
}
```

CPI Guard'ın etkin olup olmadığını ve talimatın bir CPI'nin parçası olarak yürütülüp yürütülmediğini belirlemeye yardımcı olmak için `Token Extensions Program` içinde iki ek yardımcı işlev bulunmaktadır. İlk olarak, `cpi_guard_enabled()` mevcut durumda 'CpiGuard.lock_cpi' alanının değerini döndürür, uzantı hesapta yoksa false döner. Programın geri kalan kısmı bu işlevi kullanarak korumanın etkin olup olmadığını belirleyebilir.

```rust
/// Bu hesap için CPI Guard'ın etkin olup olmadığını belirle
pub fn cpi_guard_enabled(account_state: &StateWithExtensionsMut<Account>) -> bool {
    if let Ok(extension) = account_state.get_extension::<CpiGuard>() {
        return extension.lock_cpi.into();
    }
    false
}
```

İkinci yardımcı işlev `in_cpi()` olarak adlandırılır ve mevcut talimatın bir CPI içinde olup olmadığını belirler. Bu işlev, 
[`solana_program` rust crate içindeki `get_stack_height()`](https://docs.rs/solana-program/latest/solana_program/instruction/fn.get_stack_height.html) çağrısı yaparak mevcutta bir CPI içinde olup olmadığını belirleyebilir. Bu işlev, talimatların mevcut yığın yüksekliğini döndürür. İlk işlem seviyesinde oluşturulan talimatlar, [`TRANSACTION_LEVEL_STACK_HEIGHT`](https://docs.rs/solana-program/latest/solana_program/instruction/constant.TRANSACTION_LEVEL_STACK_HEIGHT.html) veya 1 yükseklik değerine sahip olacaktır. İlk iç çağrılan işlem veya CPI, `TRANSACTION_LEVEL_STACK_HEIGHT` + 1 yükseklik olacaktır, ve bu şekilde devam eder. Bu bilgiyle, `get_stack_height()` değeri `TRANSACTION_LEVEL_STACK_HEIGHT`'dan büyük döndüğünde, şu anda bir CPI içinde olduğumuzu biliriz! `in_cpi()` işlevinin kontrol ettiği tam olarak budur. Eğer `get_stack_height() > TRANSACTION_LEVEL_STACK_HEIGHT` ise, `True` döner. Aksi halde, `False` döner.

```rust
/// CPI'de olup olmadığımızı belirle
pub fn in_cpi() -> bool {
    get_stack_height() > TRANSACTION_LEVEL_STACK_HEIGHT
}
```

Bu iki yardımcı işlevi kullanarak, `Token Extensions Program` bir talimatı reddedip reddedemeyeceğini kolayca belirleyebilir.

### CPI Guard'ı Değiştir

CPI Guard'ı açıp kapatmak için bir Token Hesabının bu belirli uzantı için başlatılmış olması gerekir. Ardından, CPI Guard'ı etkinleştirmek için bir talimat gönderilebilir. Bu sadece bir istemci tarafından yapılabilir. _CPI aracılığıyla CPI Guard'ı değiştirmen mümkün değildir._ `Enable` talimatı 
[CPI aracılığıyla çağrılıp çağrılmadığını kontrol eder ve eğer öyleyse bir hata döner](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/extension/cpi_guard/processor.rs#L44).
Bu, sadece son kullanıcının CPI Guard'ı değiştirebileceği anlamına gelir.

```rust
// process_toggle_cpi_guard() içinde
if in_cpi() {
    return Err(TokenError::CpiGuardSettingsLocked.into());
}
```

CPI'yi etkinleştirmek için 
[`@solana/spl-token` TypeScript paketini](https://solana-labs.github.io/solana-program-library/token/js/modules.html) kullanabilirsin. İşte bir örnek.

```typescript
// CPI Guard uzantısı ile token hesabı oluştur
const tokenAccount = tokenAccountKeypair.publicKey;
const extensions = [ExtensionType.CpiGuard];
const tokenAccountLen = getAccountLen(extensions);
const lamports =
  await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

const createTokenAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccount,
  space: tokenAccountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});

// 'enable CPI Guard' talimatı oluştur
const enableCpiGuardInstruction = createEnableCpiGuardInstruction(
  tokenAccount,
  owner.publicKey,
  [],
  TOKEN_2022_PROGRAM_ID,
);

const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount,
  mint,
  owner.publicKey,
  TOKEN_2022_PROGRAM_ID,
);

// Bu talimatlarla işlem oluştur
const transaction = new Transaction().add(
  createTokenAccountInstruction,
  initializeAccountInstruction,
  enableCpiGuardInstruction,
);

transaction.feePayer = payer.publicKey;
// İşlemi gönder
await sendAndConfirmTransaction(connection, transaction, [
  payer,
  owner,
  tokenAccountKeypair,
]);
```

Hesap başlatıldıktan sonra, 
[`enableCpiGuard`](https://solana-labs.github.io/solana-program-library/token/js/functions/enableCpiGuard.html) ve [`disableCpiGuard`](https://solana-labs.github.io/solana-program-library/token/js/functions/disableCpiGuard.html) yardımcı işlevlerini de kullanabilirsiniz.

```typescript
// CPI Guard'ı etkinleştir
await enableCpiGuard(
  connection, // bağlantı
  payer, // ödeyici
  userTokenAccount.publicKey, // hesap
  payer, // sahibi
  [], // çoklu imzalar
);

// CPI Guard'ı devre dışı bırak
await disableCpiGuard(
  connection, // bağlantı
  payer, // ödeyici
  userTokenAccount.publicKey, // hesap
  payer, // sahibi
  [], // çoklu imzalar
);
```

### CPI Guard Koruma Önlemleri

#### Transfer

CPI Guard'ın transfer özelliği, hesap delegesi dışında hiç kimsenin bir transfer talimatını yetkilendirmesini engeller. Bu, `Token Extensions Program` içindeki çeşitli transfer işlevlerinde uygulanmaktadır. Örneğin, 
[`transfer` talimatına`](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L428) baktığımızda, gerekli koşullar karşılandığında bir hata döndüren bir kontrol olduğunu görebiliriz.

Yukarıda tartıştığımız yardımcı işlevleri kullanarak, program bir hata atıp atmayacağına karar verebilir.

```rust
// token uzantı programındaki process_transfer içinde
if let Ok(cpi_guard) = source_account.get_extension::<CpiGuard>() {
    if cpi_guard.lock_cpi.into() && in_cpi() {
        return Err(TokenError::CpiGuardTransferBlocked.into());
    }
}
```

Bu koruma, bir token hesabının sahibi bile başka bir hesabın yetkili delegesi varken tokenları transfer edemeyeceği anlamına gelir.

#### Yakma

Bu CPI Guard, sadece hesap delegesinin bir token hesabından token yakmasını sağlar; bu, transfer koruması gibi çalışır.

`process_burn` işlevi, `Token Extension Program` içindeki transfer işlemleri ile aynı şekilde çalışır. Aynı koşullar altında 
[hata dönecektir](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L1076).

```rust
// token uzantı programındaki process_burn içinde
if let Ok(cpi_guard) = source_account.get_extension::<CpiGuard>() {
    if cpi_guard.lock_cpi.into() && in_cpi() {
        return Err(TokenError::CpiGuardBurnBlocked.into());
    }
}
```

Bu koruma, bir token hesabının sahibi bile başka bir hesabın yetkili delegesi varken tokenları yakamaz.

#### Onay

CPI Guard, bir token hesabının delegesini CPI aracılığıyla onaylamayı önler. Bir delegeyi istemci talimatı aracılığıyla onaylayabilirsiniz, ancak CPI aracılığıyla değil. `Token Extension Program`'ın `process_approve` işlevi,  
[CPI'nin etkin olup olmadığını ve şu anda bir CPI içinde olup olmadığını belirlemek için aynı kontrolleri gerçekleştirir](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L583).

:::info
Bu, son kullanıcının bir işlem imzalarken token hesabı üzerinde dolaylı olarak bir delegeleri onaylama riski taşımadığı anlamına gelir. Daha önce, kullanıcı, cüzdanlarının bu tür işlemler hakkında kendilerini önceden bilgilendirmesi amacıyla merhametindeydi.
:::

#### Kapatma

Bir token hesabını CPI aracılığıyla kapatmak için, korumanın etkin olması, `Token Extensions Program`'ın
[token hesabının lamportlarının alındığı hedef hesabın hesap sahibi olduğunu kontrol etmesi](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L1128) anlamına gelir.

`process_close_account` işlevinden tam kod bloğu şöyledir:

```rust
if !source_account
    .base
    .is_owned_by_system_program_or_incinerator()
{
    if let Ok(cpi_guard) = source_account.get_extension::<CpiGuard>() {
        if cpi_guard.lock_cpi.into()
            && in_cpi()
            && !cmp_pubkeys(destination_account_info.key, &source_account.base.owner)
        {
            return Err(TokenError::CpiGuardCloseAccountBlocked.into());
        }
    }
...
}
```

Bu koruma, kullanıcıyı, kendi sahip oldukları bir token hesabını kapatacak bir işlemi imzalamaktan ve o hesabın lamportlarının başka bir hesaba devredilmesinden korur. Bu, son kullanıcının perspektifinden, talimatları kendileri incelemeden tespit etmek zor olacaktır. Bu koruma, token hesabı kapatıldığında bu lamportların yalnızca sahibine devredilmesini sağlar.

#### Kapatma Yetkisini Belirle

CPI Guard, `CloseAccount` yetkisini CPI aracılığıyla belirlemeyi engeller, ancak daha önce belirlenmiş bir `CloseAccount` yetkisini kaldırabilirsin. `Token Extension Program`, 
[`process_set_authority`](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L697) işlevine `new_authority` parametresine bir değer geçirilip geçirilmediğini kontrol ederek bunu uygular.

```rust
AuthorityType::CloseAccount => {
    let authority = account.base.close_authority.unwrap_or(account.base.owner);
    Self::validate_owner(
        program_id,
        &authority,
        authority_info,
        authority_info_data_len,
        account_info_iter.as_slice(),
    )?;

    if let Ok(cpi_guard) = account.get_extension::<CpiGuard>() {
        if cpi_guard.lock_cpi.into() && in_cpi() && new_authority.is_some() {
            return Err(TokenError::CpiGuardSetAuthorityBlocked.into());
        }
    }

    account.base.close_authority = new_authority;
}
```

Bu koruma, kullanıcının başka bir hesaba, arka planda token hesabını kapatma yetkisini verme işlemi imzalamasını engeller.

#### Sahibi Belirle

CPI Guard, hesap sahibinin CPI aracılığıyla veya başka herhangi bir şekilde değiştirilmesini engeller. Hesap yetkisi, önceki bölümde `CloseAccount` yetkisi ile aynı `process_set_authority` işlevinde güncellenir. Eğer talimat, CPI Guard etkinken bir hesabın yetkisini güncellemeye çalışıyorsa,  
[işlev iki mümkün hatadan birini döndürecektir](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L662).

Eğer talimat CPI içerisinde yürütülüyorsa, işlev `CpiGuardSetAuthorityBlocked` hatası döndürecektir. Aksi takdirde `CpiGuardOwnerChangeBlocked` hatası döner.

```rust
if let Ok(cpi_guard) = account.get_extension::<CpiGuard>() {
    if cpi_guard.lock_cpi.into() && in_cpi() {
        return Err(TokenError::CpiGuardSetAuthorityBlocked.into());
    } else if cpi_guard.lock_cpi.into() {
        return Err(TokenError::CpiGuardOwnerChangeBlocked.into());
    }
}
```

Bu koruma, etkin olduğunda bir Token hesabının mülkiyetinin hiçbir koşulda değiştirilmesini engeller.

---

## Laboratuvar

Bu laboratuvar öncelikle TypeScript'te testler yazmaya odaklanacaktır, ancak bu testler için yerel olarak bir program yürütmemiz gerekecek. Bu nedenle, programın çalışması için bilgisayarınızda uygun bir ortam sağlamak amacıyla birkaç adım atmamız gerekecek. On-chain program sizin için önceden yazılmıştır ve laboratuvar başlangıç koduna dahil edilmiştir.

On-chain program, CPI Guard'ın koruduğu birkaç talimat içerir. Bu talimatları, hem CPI Guard etkin hem de devre dışı bırakılmış olarak çağıran testler yazacağız.

:::note
Testler `/tests` dizininde bireysel dosyalara ayrılmıştır. Her bir dosya, programımızda belirli bir talimatı çağıran ve belirli bir CPI Guard'ı gösterecek şekilde kendi birim testi olarak hizmet eder.
:::

Programın beş talimatı vardır: `malicious_close_account`, `prohibited_approve_account`, `prohibited_set_authority`, `unauthorized_burn`, `set_owner`.

Bu talimatların her biri, `Token Extensions Program`'a bir CPI çağrısı yapar ve orijinal işlemi imzalayan kişinin bilgisizliği dahilinde belirli bir token hesabında bir eylem gerçekleştirmeye çalışır. `Transfer` korumasını test etmeyeceğiz çünkü bu, `Burn` korumasıyla aynıdır.

#### 1. Solana/Anchor/Rust Sürümlerini Doğrulayın

Bu laboratuvar sırasında `Token Extensions Program` ile etkileşimde bulunacağız ve bunun için Solana CLI sürümünün ≥ 1.18.0 olması gereklidir.

Sürümünüzü kontrol etmek için:

```bash
solana --version
```

`solana --version` komutunu çalıştırdıktan sonra yazdırılan sürüm `1.18.0`'dan daha düşükse, CLI sürümünü manuel olarak güncelleyebilirsiniz. Not: Bu yazının yazıldığı sırada, ayrıca `solana-install update` komutunu çalıştırarak doğrudan CLI sürümünü güncelleyemezsiniz. Bu komut, CLI'yi doğru sürüme güncellemeyecek, bu nedenle `1.18.0` sürümünü açıkça indirmeniz gerekiyor. Bunu aşağıdaki komut ile yapabilirsiniz:

```bash
solana-install init 1.18.0
```

Programı derlemeye çalışırken herhangi bir hata alırsanız, bu, muhtemelen doğru sürümde Solana CLI'nin yüklü olmadığı anlamına gelir.

```bash
anchor build
error: package `solana-program v1.18.0` cannot be built because it requires rustc 1.72.0 or newer, while the currently active rustc version is 1.68.0-dev
Either upgrade to rustc 1.72.0 or newer, or use
cargo update -p solana-program@1.18.0 --precise ver
where `ver` is the latest version of `solana-program` supporting rustc 1.68.0-dev
```

Ayrıca `0.29.0` sürümündeki Anchor CLI'nin yüklü olduğundan emin olmalısınız. AVM üzerinden güncelleme yapmak için burada listelenen adımları takip edebilirsiniz
https://www.anchor-lang.com/docs/avm

ya da basitçe çalıştırabilirsiniz

```bash
avm install 0.29.0
avm use 0.29.0
```

Bu yazının yazıldığı sırada, Anchor CLI'nin en son sürümü `0.29.0`'dır.

Şimdi, Rust sürümümüzü kontrol edebiliriz.

```bash
rustc --version
```

Bu yazının yazıldığı sırada, Rust derleyicisi için `1.26.0` sürümü kullanılıyordu. Eğer güncellemek isterseniz, bunu `rustup` ile yapabilirsiniz 
https://doc.rust-lang.org/book/ch01-01-installation.html

```bash
rustup update
```

Şimdi doğru sürümlerin yüklü olması gerekir.

#### 2. Başlangıç kodunu alın ve bağımlılıkları ekleyin

Başlangıç dalını alalım.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-cpi-guard
cd solana-lab-cpi-guard
git checkout starter
```

#### 3. Program ID'sini ve Anchor Anahtar Çifti'ni Güncelleyin

Başlangıç dalına girdikten sonra, çalıştırın

`anchor keys sync`

Bu, program kimliğini çeşitli yerlerde yeni program anahtar çiftinizle değiştirecektir.

Sonrasında `Anchor.toml` dosyasında geliştirici anahtar çifti yolunuzu ayarlayın.

```toml
[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"
```

"~/.config/solana/id.json" en yaygın anahtar çifti yoludur; ancak emin değilseniz, sadece çalıştırın:

```bash
solana config get
```

#### 4. Programın derlendiğini onaylayın

Her şeyin doğru yapılandırıldığını doğrulamak için başlangıç kodunu inşa edelim. Eğer derlenmezse, lütfen yukarıdaki adımları tekrar gözden geçirin.

```bash
anchor build
```

Derleme betiği uyarılarını güvenle yok sayabilirsiniz, bunlar gerekli kodu ekledikçe kaybolacaktır.

Geliştirme ortamının doğru şekilde ayarlandığından emin olmak için sağlanan testleri çalıştırabilirsiniz. Node bağımlılıklarını `npm` veya `yarn` kullanarak kurmanız gerekecek. Testler çalışmalıdır, ancak şu anda hiçbir şey yapmamaktadır.

```bash
yarn install
anchor test

#### 5. CPI Guard ile Token Oluşturun

Herhangi bir test yazmadan önce, CPI Guard uzantısıyla bir Token hesabı oluşturacak yardımcı bir fonksiyon oluşturalım. Bunu yeni bir dosya olan `tests/token-helper.ts`'de ve `createTokenAccountWithCPIGuard` adında yeni bir fonksiyonda yapalım.

Bu fonksiyon, dahili olarak şunları çağıracaktır:

- `SystemProgram.createAccount`: Token hesabı için alan ayırır
- `createInitializeAccountInstruction`: Token hesabını başlatır
- `createEnableCpiGuardInstruction`: CPI Guard'ı etkinleştirir

```ts
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createEnableCpiGuardInstruction,
  createInitializeAccountInstruction,
  getAccountLen,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function createTokenAccountWithCPIGuard(
  connection: Connection,
  payer: Keypair,
  owner: Keypair,
  tokenAccountKeypair: Keypair,
  mint: PublicKey,
): Promise {
  const tokenAccount = tokenAccountKeypair.publicKey;

  const extensions = [ExtensionType.CpiGuard];

  const tokenAccountLen = getAccountLen(extensions);
  const lamports =
    await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

  const createTokenAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: tokenAccount,
    space: tokenAccountLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const initializeAccountInstruction = createInitializeAccountInstruction(
    tokenAccount,
    mint,
    owner.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );

  const enableCpiGuardInstruction = createEnableCpiGuardInstruction(
    tokenAccount,
    owner.publicKey,
    [],
    TOKEN_2022_PROGRAM_ID,
  );

  const transaction = new Transaction().add(
    createTokenAccountInstruction,
    initializeAccountInstruction,
    enableCpiGuardInstruction,
  );

  transaction.feePayer = payer.publicKey;

  // İşlem gönder
  return await sendAndConfirmTransaction(connection, transaction, [
    payer,
    owner,
    tokenAccountKeypair,
  ]);
}
```

---

#### 5. Yetkiliyi Onayla

:::info
Test edeceğimiz ilk CPI Guard, yetkili onaylama işlevselliğidir.
:::

CPI Guard, CPI etkin olduğunda bir token hesabının yetkilisini onaylamayı tamamen engeller. CPI Guard olan bir hesapta bir delegesi onaylamanın mümkün olduğu, yalnızca bunun bir CPI ile yapılmadığını belirtmek önemlidir. Bunu yapmak için, diğer bir program yerine bir istemciden doğrudan `Token Extensions Program`'a bir talimat göndermelisiniz.

Testimizi yazmadan önce, test ettiğimiz program koduna bir göz atmalıyız. `prohibited_approve_account` talimatı burada hedef alacağımız şeydir.

```rust
// src/lib.rs içinde
pub fn prohibited_approve_account(ctx: Context, amount: u64) -> Result {
    msg!("ProhibitedApproveAccount çağrıldı");

    msg!(
        "Yetkili onaylama: {} kadar transfer etmek için {}.",
        ctx.accounts.delegate.key(),
        amount
    );

    approve(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Approve {
                to: ctx.accounts.token_account.to_account_info(),
                delegate: ctx.accounts.delegate.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )
}
...

#[derive(Accounts)]
pub struct ApproveAccount {
    #[account(mut)]
    pub authority: Signer,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount,
    /// KONTROL: onaylanacak delegat
    #[account(mut)]
    pub delegate: AccountInfo,
    pub token_program: Interface,
}
```

>Eğer Solana programlarına aşina iseniz, bu oldukça basit bir talimat gibi görünmelidir. Talimat, bir `Signer` olarak bir `authority` hesabı ve `authority`'nin yetkilisi olduğu bir `token_account` beklemektedir.

Talimat daha sonra `Token Extensions Program` üzerindeki `Approve` talimatını çağırarak `delegate`'i belirli bir `token_account` üzerindeki yetkili olarak atamayı dener.

Şimdi, `/tests/approve-delegate-example.ts` dosyasını açalım ve bu talimatı test etmeye başlayalım. Başlangıç koduna bir göz atın. Bir ödeyici, bazı test anahtar çiftleri ve testlerden önce çalışacak `airdropIfRequired` fonksiyonu bulunuyor.

Başlangıç koduyla rahat hissettiğinizde, "Yetkili Onayla" testlerine geçebiliriz. Hedef programımızdaki tam aynı talimatı, CPI koruma ile ve olmadan çağıran testler oluşturacağız.

Talimatımızı test etmek için önce token mintimizi ve uzantıları içeren bir token hesabı oluşturmamız gerekiyor.

```typescript
it("CPI koruması etkin olduğunda 'Yetkili Onayla'yı durdurur", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Şimdi, `Token Extensions Program` üzerindeki 'Yetkili Onayla' talimatını çağırmayı deneyen programımıza bir işlem gönderebiliriz.

```typescript
// "CPI koruması devre dışı olduğunda 'Yetkili Onayla'yı durdurur" test bloğu içinde
try {
  const tx = await program.methods
    .prohibitedApproveAccount(new anchor.BN(1000))
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      delegate: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();

  console.log("İşlem imzanız", tx);
} catch (e) {
  assert(
    e.message ==
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2d",
  );
  console.log(
    "CPI Guard etkin, ve bir program bir yetkiliyi onaylamaya çalıştı",
  );
}
```

:::tip
Bu işlemi bir try/catch bloğu içine aldığımızı unutmayın. Çünkü bu talimat, CPI Guard düzgün çalıştığında başarısız olmalıdır.
:::

Hata mesajını yakalıyoruz ve hatanın beklediğimiz şey olduğunu doğruluyoruz.

Şimdi, "CPI koruması devre dışı olduğunda 'Yetkili Onayla'yı sağlar" testine geçiyoruz. Amacımız, CPI Guard olmayan bir token hesabı paslayarak aynı işlemi gerçekleştirmek.

```typescript
it("CPI koruması devre dışı olduğunda 'Yetkili Onayla'yı sağlar", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .prohibitedApproveAccount(new anchor.BN(1000))
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      delegate: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

Bu işlem başarılı olacak ve `delegate` hesabı artık `userTokenAccount`'tan belirli bir miktarda token transfer etme yetkisine sahip olacaktır.

Çalışmanızı kaydedebilirsiniz ve `anchor test` komutunu çalıştırabilirsiniz. Tüm testler çalışacaktır, ancak bu iki test henüz herhangi bir işlem yapmaktadır. Şu aşamada her ikisi de geçmelidir.

---

#### 6. Hesabı Kapat

Hesabı kapatma talimatı, `Token Extensions Program` üzerindeki `close_account` talimatını çağırır. Bu, belirtilen token hesabını kapatır. Ancak, döndürülen kira lamportlarının hangi hesaba aktarılacağını tanımlama yeteneğine sahipsiniz. CPI Guard, bu hesabın her zaman hesap sahibinin hesabı olmasını sağlar.

```rust
pub fn malicious_close_account(ctx: Context) -> Result {
    msg!("MaliciousCloseAccount çağrıldı");

    msg!(
        "Kapatılacak token hesabı : {}",
        ctx.accounts.token_account.key()
    );

    close_account(CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        CloseAccount {
            account: ctx.accounts.token_account.to_account_info(),
            destination: ctx.accounts.destination.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    ))
}

...

#[derive(Accounts)]
pub struct MaliciousCloseAccount {
    #[account(mut)]
    pub authority: Signer,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount,
    /// KONTROL: kötü niyetli hesap
    #[account(mut)]
    pub destination: AccountInfo,
    pub token_program: Interface,
    pub system_program: Program,
}
```

:::warning
Programımız, `close_account` talimatını çağırır, ancak potansiyel olarak kötü niyetli bir istemci, `destination` hesabı olarak token hesabı sahibi olmayan bir hesabı geçirebilir. Bu, kullanıcının perspektifinden görmek zor olabilir, eğer cüzdan onları bilgilendirmezse. CPI Guard etkinken, `Token Extension Program` bu durumda talimatı reddedecektir.
:::

Bunu test etmek için, `/tests/close-account-example.ts` dosyasını açalım. Başlangıç kodu, önceki testlerimizle aynıdır.

Öncelikle mintimizi ve CPI korumalı token hesabımızı oluşturalım:

```typescript
it("CPI Guard etkin olduğunda 'Hesabı Kapat' durdurur", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Şimdi, `malicious_close_account` talimatımıza bir işlem gönderebiliriz. Bu token hesabında CPI Guard etkin olduğundan, işlem başarısız olmalıdır. Testimiz, bunun beklenen nedenden ötürü başarısız olduğunu doğrular.

```typescript
// "CPI Guard etkin olduğunda 'Hesabı Kapat' durdurur" test bloğu içinde
try {
  const tx = await program.methods
    .maliciousCloseAccount()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      destination: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();

  console.log("İşlem imzanız", tx);
} catch (e) {
  assert(
    e.message ==
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2c",
  );
  console.log(
    "CPI Guard etkin, ve bir program, lamportları geri döndürmeden bir hesabı kapatmaya çalıştı",
  );
}
```

Artık CPI Guard'ı devre dışı bırakabilir ve `Close Account without CPI Guard` testindeki tam aynı işlemi gönderebiliriz. Bu işlem bu kez başarılı olmalıdır.

```typescript
it("CPI Guard olmadan Hesabı Kapat", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .maliciousCloseAccount()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      destination: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

---

#### 7. Yetki Ayarla

`prohibited_set_authority` talimatına geçiyoruz, CPI Guard, bir CPI'nin `CloseAccount` yetkisini ayarlamasını engeller.

```rust
pub fn prohibted_set_authority(ctx: Context) -> Result {
    msg!("ProhibitedSetAuthority çağrıldı");

    msg!(
        "Token hesabının yetkisi: {} adresine ayarlanıyor: {}",
        ctx.accounts.token_account.key(),
        ctx.accounts.new_authority.key()
    );

    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.authority.to_account_info(),
                account_or_mint: ctx.accounts.token_account.to_account_info(),
            },
        ),
        spl_token_2022::instruction::AuthorityType::CloseAccount,
        Some(ctx.accounts.new_authority.key()),
    )
}

#[derive(Accounts)]
pub struct SetAuthorityAccount {
    #[account(mut)]
    pub authority: Signer,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount,
    /// KONTROL: onaylanacak delegat
    #[account(mut)]
    pub new_authority: AccountInfo,
    pub token_program: Interface,
}
```

Programımızın talimatı sadece `SetAuthority` talimatını çağırır ve belirli bir token hesabının `spl_token_2022::instruction::AuthorityType::CloseAccount` yetkisini ayarlamak istediğimizi belirtir.

```typescript
it("CPI koruması etkin olduğunda yetki ayarlama", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );

  try {
    const tx = await program.methods
      .prohibtedSetAuthority()
      .accounts({
        authority: payer.publicKey,
        tokenAccount: userTokenAccount.publicKey,
        newAuthority: maliciousAccount.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    console.log("İşlem imzanız", tx);
  } catch (e) {
    assert(
      e.message ==
        "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2e",
    );
    console.log(
      "CPI Guard etkin, ve bir program yetki eklemek veya değiştirmeye çalıştı",
    );
  }
});
```

"CPI koruması etkin olduğunda 'Yetki Ayarla' testine geçiyoruz" testinde, CPI Guard'ı devre dışı bırakabilir ve işlemi yeniden gönderebiliriz.

```typescript
it("Yetki Ayarlama Örneği", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .prohibtedSetAuthority()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      newAuthority: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

---

#### 8. Yak

Test edeceğimiz bir sonraki talimat, test programımızdaki `unauthorized_burn` talimatıdır. Bu talimat, `Token Extensions Program` üzerindeki `burn` talimatını çağırır ve verilen token hesabından belirli bir miktarda token yakma girişiminde bulunur.

CPI Guard, bunun yalnızca imzalayıcı yetki token hesabı delegesi olduğunda mümkün olmasını sağlar.

```rust
pub fn unauthorized_burn(ctx: Context, amount: u64) -> Result {
    msg!("Yakma çağrıldı");

    msg!(
        "{} token adresinden yakılıyor: {}",
        amount,
        ctx.accounts.token_account.key()
    );

    burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.token_mint.to_account_info(),
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )
}

...

#[derive(Accounts)]
pub struct BurnAccounts {
    #[account(mut)]
    pub authority: Signer,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount,
    #[account(
        mut,
        mint::token_program = token_program
    )]
    pub token_mint: InterfaceAccount,
    pub token_program: Interface,
}
```

Bunu test etmek için `tests/burn-example.ts` dosyasını açın. Başlangıç kodu önceki kodlarla aynı, tek fark `maliciousAccount` yerine `delegate` kullanıyoruz.

Sonra, mintimizi ve CPI korumalı token hesabımızı oluşturabiliriz.

```typescript
it("Yetkili imzası olmadan 'Yakmayı' durdurur", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Artık test hesabımıza bazı tokenlar basmalıyız.

```typescript
// "Yetkili imzası olmadan 'Yakmayı' durdurur" test bloğu içinde
const mintToTx = await mintTo(
  provider.connection,
  payer,
  testTokenMint.publicKey,
  userTokenAccount.publicKey,
  payer,
  1000,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Şimdi, token hesabımız üzerinde bir delegesi onaylayacağız. Bu token hesabında şu anda bir CPI Guard etkin, ancak yine de bir delegesi onaylayabiliyoruz. Bunun nedeni, `Token Extensions Program`'ı doğrudan çağırıyor olmamız ve önceki örneğimizdeki gibi bir CPI değiliz.

```typescript
// "Yetkili imzası olmadan 'Yakmayı' durdurur" test bloğu içinde
const approveTx = await approve(
  provider.connection,
  payer,
  userTokenAccount.publicKey,
  delegate.publicKey,
  payer,
  500,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Artık token hesabımız üzerinde bir delegemiz olduğuna göre, programımıza bir işlem gönderebilir ve bazı tokenları yakmayı deneyebiliriz. `payer` hesabını yetki olarak geçiriyoruz. Bu hesap `userTokenAccount`'ın sahibidir, ancak `delegate` hesabını yetkili olarak onayladığımız için, CPI Guard bu işlemin geçmesine izin vermeyecek.

```typescript
// "Yetkili imzası olmadan 'Yakmayı' durdurur" test bloğu içinde
try {
  const tx = await program.methods
    .unauthorizedBurn(new anchor.BN(500))
    .accounts({
      // payer delegesi değil
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      tokenMint: testTokenMint.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();

  console.log("İşlem imzanız", tx);
} catch (e) {
  assert(
    e.message ==
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2b",
  );
  console.log(
    "CPI Guard etkin, ve bir program kullanıcı fonlarını yakmaya çalıştı fakat delegeden faydalanmadı.",
  );
}
```

"Yetki İmzası Olmadan Yakma Örneği" testinde, CPI Guard'ı devre dışı bırakmak ve işlemi yeniden göndermek. 

```typescript
it("Yetkilisi Olmadan Yakma Örneği", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  const tx = await program.methods
    .unauthorizedBurn(new anchor.BN(500))
    .accounts({
      // payer delegesi değil
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      tokenMint: testTokenMint.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

#### 9. Sahibini Ayarla

Test edeceğimiz son CPI Guard `SetOwner` korumasıdır. CPI Guard etkinleştirildiğinde, bu eylem her zaman yasaktır, hatta bir CPI dışındayken bile. Bunu test etmek için, bir jeton hesabının sahibini istemci tarafından ayarlamayı ve test programımız aracılığıyla CPI ile yapmayı deneyeceğiz.

:::tip
Sahibi ayarlarken dikkatli olun; CPI Guard etkin olduğunda işlemler başarısız olacaktır.
:::

İşte program talimatı.

```rust
pub fn set_owner(ctx: Context) -> Result {
    msg!("SetOwner çağrıldı");

    msg!(
        "Jeton hesabının sahibi: {} adresine ayarlanıyor: {}",
        ctx.accounts.token_account.key(),
        ctx.accounts.new_owner.key()
    );

    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.authority.to_account_info(),
                account_or_mint: ctx.accounts.token_account.to_account_info(),
            },
        ),
        spl_token_2022::instruction::AuthorityType::AccountOwner,
        Some(ctx.accounts.new_owner.key()),
    )
}

#[derive(Accounts)]
pub struct SetOwnerAccounts {
    #[account(mut)]
    pub authority: Signer,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount,
    /// CHECK: onaylamak için delegat
    #[account(mut)]
    pub new_owner: AccountInfo,
    pub token_program: Interface,
}
```

`/tests/set-owner-example.ts` dosyasını açın. Bunun için yazacağımız dört test var. Bir CPI olmadan sahibin ayarlanması için iki tane ve CPI aracılığıyla sahibin ayarlanması için iki tane.

:::info
`delegate` fonksiyonunu çıkardığımızı ve `firstNonCPIGuardAccount`, `secondNonCPIGuardAccount` ve `newOwner` eklediğimizi unutmayın.
:::

İlk `"CPI korumalı bir hesapta CPI olmadan 'Sahipliği Ayarla'yı durdurur"` testinden başlayarak, mint ve CPI korumalı jeton hesabını oluşturacağız.

```typescript
it("CPI korumalı bir hesapta CPI olmadan 'Sahipliği Ayarla'yı durdurur", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Sonra, `@solana/spl-token` kütüphanesinden `setAuthority` fonksiyonu ile `Token Extensions Program`'ının `set_authority` talimatına bir işlem göndermeyi deneyeceğiz.

```typescript
// "CPI korumalı bir hesapta CPI olmadan 'Sahipliği Ayarla'yı durdurur" test bloğunun içinde
try {
  await setAuthority(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    AuthorityType.AccountOwner,
    newOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
} catch (e) {
  assert(
    e.message ==
      "işlem gönderimi başarısız oldu: İşlem simülasyonu başarısız oldu: Talimat 0'ı işleme hatası: özel program hatası: 0x2f",
  );
  console.log(
    "CPI Guard etkinken hesap sahipliği değiştirilemez.",
  );
}
```

Bu işlemin başarısız olması gerekir, bu yüzden çağrıyı bir try/catch bloğuna sarıyoruz ve hatanın beklenen hata olduğunu kontrol ediyoruz.

:::note
Unutmayın, CPI Guard etkin durumda iken hesap sahipliği değişiklikleri mümkün değildir.
:::

Şimdi, CPI Guard etkin değilken başka bir jeton hesabı oluşturup aynı şeyi deneyeceğiz.

```typescript
it("CPI Olmadan CPI Korumalı Hesap Üzerinde Sahipliği Ayarla", async () => {
  await createAccount(
    provider.connection,
    payer,
    testTokenMint.publicKey,
    payer.publicKey,
    firstNonCPIGuardAccount,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await setAuthority(
    provider.connection,
    payer,
    firstNonCPIGuardAccount.publicKey,
    payer,
    AuthorityType.AccountOwner,
    newOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
});
```

Bu test başarılı olmalıdır.

:::warning
Eğer bu test geçmezse, CPI Guard'ın etkin olduğundan emin olun.
:::

Şimdi, bir CPI kullanarak bunu test edelim. Bunu yapmak için, programımızın `set_owner` talimatına bir işlem göndermemiz yeterlidir.

```typescript
it("[CPI Guard] CPI Korumalı Hesap Üzerinde CPI ile Sahipliği Ayarla", async () => {
  try {
    await program.methods
      .setOwner()
      .accounts({
        authority: payer.publicKey,
        tokenAccount: userTokenAccount.publicKey,
        newOwner: newOwner.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();
  } catch (e) {
    assert(
      e.message ==
        "işlem gönderimi başarısız oldu: İşlem simülasyonu başarısız oldu: Talimat 0'ı işleme hatası: özel program hatası: 0x2e",
    );
    console.log(
      "CPI Guard etkin, ve bir program bir yetki eklemeye veya değiştirmeye çalıştı.",
    );
  }
});
```

Son olarak, CPI Guard etkin değilken başka bir jeton hesabı oluşturup bunu program talimatına iletebiliriz. Bu sefer, CPI geçmelidir.

```typescript
it("CPI Olmadan CPI Korumalı Hesap Üzerinde Sahipliği Ayarla", async () => {
  await createAccount(
    provider.connection,
    payer,
    testTokenMint.publicKey,
    payer.publicKey,
    secondNonCPIGuardAccount,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .setOwner()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: secondNonCPIGuardAccount.publicKey,
      newOwner: newOwner.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

Ve hepsi bu kadar! İşlerinizi kaydedebilir ve `anchor test` çalıştırabilirsiniz. Yazdığımız tüm testler geçmelidir.

## Meydan Okuma

Transfer işlevselliği için bazı testler yazın.