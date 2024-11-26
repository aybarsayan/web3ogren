---
title: Program Türetilmiş Adresi (PDA)
sidebarLabel: Program Türetilmiş Adresi
sidebarSortOrder: 5
description:
  Solana'da Program Türetilmiş Adresleri (PDA'lar) öğrenin - güvenli program imzalaması
  sağlayan belirleyici hesap adresleri. PDA türetimini, kanonik bump'ları ve PDA hesaplarını 
  nasıl oluşturacağınızı anlayın.
---

Program Türetilmiş Adresleri (PDAlar), Solana'daki geliştiricilere iki ana kullanım durumu sağlar:

- **Belirleyici Hesap Adresleri**: PDA'lar, belirli bir program ID'si ve isteğe bağlı "tohum" (önceden tanımlanmış girdiler) kombinasyonu kullanarak bir adres türetmek için bir mekanizma sağlar.
- **Program İmzalamayı Etkinleştirir**: Solana çalışma zamanı, programların kendi program ID'sinden türetilen PDA'lar için "imza atmasına" olanak tanır.

PDA'ları, önceden tanımlanmış bir girdi kümesinden (örneğin, dizeler, sayılar ve diğer hesap adresleri) zincir üzerinde hashmap benzeri yapılar oluşturmanın bir yolu olarak düşünebilirsiniz.

:::tip
**Avantaj**: Bu yaklaşım, tam bir adresi takip etme ihtiyacını ortadan kaldırır. Bunun yerine, yalnızca türetiminde kullanılan belirli girdileri hatırlamanız yeterlidir.
:::

![Program Türetilmiş Adresi](../../images/solana/public/assets/docs/core/pda/pda.svg)

Program Türetilmiş Adresi (PDA) türetmenin, o adreste otomatik olarak zincir üzerinde bir hesap oluşturmadığını anlamak önemlidir. PDA'nın zincir üzerindeki adres olarak kullanıldığı hesaplar, adresi türetmek için kullanılan program aracılığıyla açıkça oluşturulmalıdır. PDA türetimini bir harita üzerindeki bir adres bulmaya benzetebilirsiniz. **Sadece bir adrese sahip olmak, o lokasyonda bir şey inşa edildiği anlamına gelmez.**

> Bu bölüm, PDA türetmenin detaylarını ele alacaktır. Programların imza için PDA'ları nasıl kullandığına dair detaylar, her iki kavram için bağlam gerektirdiğinden `Çapraz Program Çağrıları (CPI'ler)` bölümünde ele alınacaktır.

## Ana Noktalar

- PDA'lar, kullanıcı tanımlı tohumlar, bir bump tohumu ve bir programın ID'sinin kombinasyonu kullanılarak belirleyici olarak türetilen adreslerdir.

- PDA'lar, Ed25519 eğrisinin dışına düşen ve karşılığı olmayan özel anahtara sahip adreslerdir.

- Solana programları, kendi program ID'si kullanılarak türetilen PDA'lar için programatik olarak "imza atabilir".

- **Dikkat**: Bir PDA türetmek otomatik olarak zincir üzerinde bir hesap oluşturmaz.

- PDA'nın adresi olarak kullanıldığı bir hesap, bir Solana programında özel bir talimat aracılığıyla açıkça oluşturulmalıdır.

## PDA Nedir

PDA'lar, belirleyici olarak türetilen ve standart public key'ler gibi görünen ancak ilişkilendirilmiş özel anahtarı olmayan adreslerdir. Bu, dış bir kullanıcının adres için geçerli bir imza üretemeyeceği anlamına gelir. Ancak, Solana çalışma zamanı, programların özel anahtar gerektirmeksizin PDA'lar için programatik olarak "imza atmasına" olanak tanır.

Bağlam açısından, Solana [Keypair'lar](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/src/signer/keypair.rs#L25) Ed25519 eğrisi (eliptik eğri kriptografisi) üzerindeki noktalar olup, bir public key ve karşılık gelen bir özel anahtar içerir. Genellikle, public key'leri yeni zincir üzerindeki hesaplar için benzersiz ID'ler ve özel anahtarları imzalama işlemleri için kullanırız.

![Eğri Üzerindeki Adres](../../images/solana/public/assets/docs/core/pda/address-on-curve.svg)

Bir PDA, belirli bir girdi setini kullanarak Ed25519 eğrisinin dışına düşecek şekilde kasıtlı olarak türetilen bir noktadır. Ed25519 eğrisinin dışındaki bir noktanın geçerli bir karşılık gelen özel anahtarı yoktur ve kriptografik işlemler (imzalama) için kullanılamaz.

Bir PDA, zincir üzerindeki bir hesap için adres (benzersiz tanımlayıcı) olarak kullanılarak, program durumunu kolayca depolamak, haritalamak ve almak için bir yöntem sağlar.

![Eğri Dışındaki Adres](../../images/solana/public/assets/docs/core/pda/address-off-curve.svg)

## PDA Nasıl Türetilir

Bir PDA türetmek için 3 girdi gereklidir:

1. **İsteğe bağlı tohumlar**: PDA türetmek için kullanılan önceden tanımlanmış girdiler (örneğin, dize, sayı, diğer hesap adresleri). Bu girdiler bir byte tamponuna dönüştürülür.

2. **Bump tohumu**: Geçerli bir PDA (eğri dışında) türetilmesini garanti etmek için kullanılan ek bir girdi (0-255 arasında bir değer). Bu bump tohumu (255'le başlayan), bir PDA türetildiğinde isteğe bağlı tohumlara eklenerek, noktayı Ed25519 eğrisinin dışına "itmek" için kullanılır. Bump tohumu bazen "nonce" olarak da adlandırılır.

3. **Program ID**: PDA'nın türetildiği programın adresi. Bu, PDA adına "imza atabilecek" programdır.

![PDA Türetimi](../../images/solana/public/assets/docs/core/pda/pda-derivation.svg)

Aşağıdaki örnekler, Solana Playground'a bağlantılar içermektedir; burada örnekleri tarayıcıda bir editörde çalıştırabilirsiniz.

### FindProgramAddress

Bir PDA türetmek için, [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) kütüphanesinden [`findProgramAddressSync`](https://github.com/solana-labs/solana-web3.js/blob/ca9da583a39cdf8fd874a2e03fccdc849e29de34/packages/library-legacy/src/publickey.ts#L212) yöntemini kullanabiliriz. Bu işlevin diğer programlama dillerinde de eşdeğerleri vardır (örneğin, [Rust](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/pubkey.rs#L484)), ancak bu bölümde Javascript kullanarak örnekler üzerinden geçeceğiz.

`findProgramAddressSync` yöntemini kullanırken, şunları geçiriyoruz:

- Önceden tanımlanmış isteğe bağlı tohumlar, byte tamponuna dönüştürülmüş olarak,

- PDA türetiminde kullanılan program ID'si (adres)

Geçerli bir PDA bulunduğunda, `findProgramAddressSync` hem adresi (PDA) hem de PDA'yı türetmek için kullanılan bump tohumunu geri döndürür.

Aşağıdaki örnek, isteğe bağlı tohum sağlamadan PDA türetir.

```ts /[]/
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");

const [PDA, bump] = PublicKey.findProgramAddressSync([], programId);

console.log(`PDA: ${PDA}`);
console.log(`Bump: ${bump}`);
```

Bu örneği [Solana Playground](https://beta.solpg.io/66031e5acffcf4b13384cfef) üzerinde çalıştırabilirsiniz. PDA ve bump tohumu çıktısı her zaman aynı olacaktır:

```
PDA: Cu7NwqCXSmsR5vgGA3Vw9uYVViPi3kQvkbKByVQ8nPY9
Bump: 255
```

Aşağıdaki bir sonraki örnek "helloWorld" isteğe bağlı tohumunu ekler.

```ts /string/
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");
const string = "helloWorld";

const [PDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from(string)],
  programId,
);

console.log(`PDA: ${PDA}`);
console.log(`Bump: ${bump}`);
```

Bu örneği de [Solana Playground](https://beta.solpg.io/66031ee5cffcf4b13384cff0) üzerinde çalıştırabilirsiniz. PDA ve bump tohumu çıktısı her zaman aynı olacaktır:

```
PDA: 46GZzzetjCURsdFPb7rcnspbEMnCBXe9kpjrsZAkKb6X
Bump: 254
```

Bump tohumunun 254 olduğunu not edin. Bu, 255'in Ed25519 eğrisinin üzerinde bir nokta türettiği ve geçerli bir PDA olmadığı anlamına gelir.

`findProgramAddressSync` tarafından döndürülen bump tohumu, verilen kombinasyon için geçerli bir PDA'yı türeten ilk değerdir (255-0 arasında).

> Bu ilk geçerli bump tohumu "kanonik bump" olarak adlandırılır. Program güvenliği için, PDA'larla çalışırken yalnızca kanonik bump'ı kullanmanız önerilir.

### CreateProgramAddress

Alt yapıda, `findProgramAddressSync`, tohumlar tamponuna dolayımlı bir bump tohumu (nonce) ekleyerek [`createProgramAddressSync`](https://github.com/solana-labs/solana-web3.js/blob/ca9da583a39cdf8fd874a2e03fccdc849e29de34/packages/library-legacy/src/publickey.ts#L168) yöntemini çağırır. Bump tohumu 255 değeri ile başlar ve geçerli bir PDA (eğri dışında) bulunana kadar 1 azaltılır.

Önceki örneği, `createProgramAddressSync` kullanarak ve 254 bump tohumunu açıkça geçirerek tekrar edebilirsiniz.

```ts /bump/
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");
const string = "helloWorld";
const bump = 254;

const PDA = PublicKey.createProgramAddressSync(
  [Buffer.from(string), Buffer.from([bump])],
  programId,
);

console.log(`PDA: ${PDA}`);
```

Yukarıdaki örneği [Solana Playground](https://beta.solpg.io/66031f8ecffcf4b13384cff1) üzerinde çalıştırın. Aynı tohumlar ve program ID'si ile verildiğinde, PDA çıktısı önceki ile uyuşacaktır:

```
PDA: 46GZzzetjCURsdFPb7rcnspbEMnCBXe9kpjrsZAkKb6X
```

### Kanonik Bump

"Kanonik bump", geçerli bir PDA türeten ilk bump tohumunu (255'ten başlayarak 1 azaltarak) ifade eder. Program güvenliği için, yalnızca kanonik bump'tan türetilen PDA'lar kullanılması önerilir.

Önceki örneği referans alarak, aşağıdaki örnek, 255-0 arasındaki her bump tohumunu kullanarak bir PDA türetmeye çalışır.

```ts
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");
const string = "helloWorld";

// Gösterim için tüm bump tohumları arasında döngü
for (let bump = 255; bump >= 0; bump--) {
  try {
    const PDA = PublicKey.createProgramAddressSync(
      [Buffer.from(string), Buffer.from([bump])],
      programId,
    );
    console.log("bump " + bump + ": " + PDA);
  } catch (error) {
    console.log("bump " + bump + ": " + error);
  }
}
```

Örneği [Solana Playground](https://beta.solpg.io/66032009cffcf4b13384cff2) üzerinde çalıştırın ve aşağıdaki çıktıyı göreceksiniz:

```
bump 255: Error: Invalid seeds, address must fall off the curve
bump 254: 46GZzzetjCURsdFPb7rcnspbEMnCBXe9kpjrsZAkKb6X
bump 253: GBNWBGxKmdcd7JrMnBdZke9Fumj9sir4rpbruwEGmR4y
bump 252: THfBMgduMonjaNsCisKa7Qz2cBoG1VCUYHyso7UXYHH
bump 251: EuRrNqJAofo7y3Jy6MGvF7eZAYegqYTwH2dnLCwDDGdP
bump 250: Error: Invalid seeds, address must fall off the curve
...
// kalan bump çıktıları
```

Beklendiği gibi, bump tohumu 255 hata fırlatır ve geçerli bir PDA türeten ilk bump tohumu 254'tür.

Ancak, 253-251 bump tohumlarının hepsinin farklı adreslerle geçerli PDA'lar türettiğini unutmayın. Bu, aynı isteğe bağlı tohumlar ve `programId` ile verilen bir bump tohumunun farklı bir değerine sahip olmanın hala geçerli bir PDA türetebileceği anlamına gelir.

:::warning
Solana programları geliştirirken, programa geçirilen bir PDA'nın kanonik bump kullanılarak türetildiğini doğrulayan güvenlik kontrollerinin dahil edilmesi önerilir. Bunu yapmamak, programda beklenmeyen hesapların sağlanmasına yol açabilecek güvenlik açıkları oluşturabilir.
:::

## PDA Hesapları Oluşturma

Bu örnek program, [Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/pda-account) kullanarak PDA'yı yeni hesabın adresi olarak kullanan bir hesap oluşturmayı göstermektedir. Örnek program, Anchor çerçevesi kullanılarak yazılmıştır.

`lib.rs` dosyasında, PDA'yı hesabın adresi olarak kullanarak yeni bir hesap oluşturmak için tek bir talimat içeren aşağıdaki programı bulacaksınız. Yeni hesap, PDA'yı türetmek için kullanılan `user` adresini ve `bump` tohumunu saklar.

```rust filename="lib.rs" {11-14,26-29}
use anchor_lang::prelude::*;

declare_id!("75GJVCJNhaukaa2vCCqhreY31gaphv7XTScBChmr1ueR");

#[program]
pub mod pda_account {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let account_data = &mut ctx.accounts.pda_account;
        // `user` adresini sakla
        account_data.user = *ctx.accounts.user.key;
        // kanonik bump'ı sakla
        account_data.bump = ctx.bumps.pda_account;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        // PDA'yı türetmek için tohumları ayarla
        seeds = [b"data", user.key().as_ref()],
        // kanonik bump'ı kullan
        bump,
        payer = user,
        space = 8 + DataAccount::INIT_SPACE
    )]
    pub pda_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct DataAccount {
    pub user: Pubkey,
    pub bump: u8,
}
```

PDA'yı türetmek için kullanılan tohumlar, talimata sağlanan `user` hesabının adresi ve sabitlenmiş dize `data`'yı içerir. Anchor çerçevesi, otomatik olarak kanonik `bump` tohumunu türetir.

```rust /data/ /user.key()/ /bump/
#[account(
    init,
    seeds = [b"data", user.key().as_ref()],
    bump,
    payer = user,
    space = 8 + DataAccount::INIT_SPACE
)]
pub pda_account: Account<'info, DataAccount>,
```

`init` kısıtlaması, Anchor'a PDA'yı adres olarak kullanarak yeni bir hesap oluşturması için Sistem Programını çağırma talimatı verir. Alt yapıda bu, bir `CPI` aracılığıyla yapılmaktadır.

```rust /init/
#[account(
    init,
    seeds = [b"data", user.key().as_ref()],
    bump,
    payer = user,
    space = 8 + DataAccount::INIT_SPACE
)]
pub pda_account: Account<'info, DataAccount>,
```

Verilen Solana Playground bağlantısında bulunan test dosyasında (`pda-account.test.ts`), PDA'yı türetmek için Javascript eşdeğerini bulacaksınız.

```ts /data/ /user.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("data"), user.publicKey.toBuffer()],
  program.programId,
);
```

Daha sonra, PDA'yı adres olarak kullanarak yeni bir zincir üzerindeki hesap oluşturmak için `initialize` talimatını çağıran bir işlem gönderilir. İşlem gönderildiğinde, oluşturulan zincir üzerindeki hesabı fetch etmek için PDA kullanılır.

```ts /initialize()/ /PDA/  {14}
it("Başlatıldı!", async () => {
  const transactionSignature = await program.methods
    .initialize()
    .accounts({
      user: user.publicKey,
      pdaAccount: PDA,
    })
    .rpc();

  console.log("İşlem İmzası:", transactionSignature);
});

it("Hesabı Fetch Et", async () => {
  const pdaAccount = await program.account.dataAccount.fetch(PDA);
  console.log(JSON.stringify(pdaAccount, null, 2));
});
```

Not edin ki, aynı `user` adresini bir tohum olarak kullanarak `initialize` talimatını birden fazla kez çağırırsanız, işlem başarısız olacaktır. Bunun nedeni, türetilen adreste zaten bir hesabın mevcut olmasıdır.