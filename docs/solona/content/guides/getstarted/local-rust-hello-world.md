---
date: 2024-07-31T00:00:00Z
difficulty: intro
title: "Rust ile Lokal olarak Solana programı kurulum, derleme ve dağıtım"
description:
  "Bu hızlı başlangıç kılavuzu, ilk Rust tabanlı Solana programınızı blockchain'e hızlı bir şekilde kurmayı, derlemeyi ve dağıtmayı gösterecektir."
tags:
  - hızlı başlangıç
  - yerel
  - rust
  - yerel
keywords:
  - rust
  - cargo
  - toml
  - program
  - öğretici
  - solana geliştirme girişimi
  - blockchain geliştirici
  - blockchain öğretici
  - web3 geliştirici
  - windows
altRoutes:
  - /developers/guides/local-rust-hello-world
---

Rust, Solana programlarını yazmak için en yaygın kullanılan programlama dilidir. Bu hızlı başlangıç kılavuzu, ilk Rust tabanlı Solana programınızı blockchain'e hızlı bir şekilde kurmayı, derlemeyi ve dağıtmayı gösterecektir.

:::warning
Bu kılavuz, Solana CLI kullanır ve yerel geliştirme ortamınızı kurduğunuzu varsayar. Hızlı bir şekilde kurulum yapmak için `bölgesel geliştirme hızlı başlangıç kılavuzumuzu` buradan kontrol edin.
:::

## Ne öğreneceksiniz

- Rust dilini yerel olarak nasıl kurulur
- Yeni bir Solana Rust programını nasıl başlatırsınız
- Rust'ta temel bir Solana programını nasıl kodlarsınız
- Rust programınızı nasıl derler ve dağıtırsınız

## Rust ve Cargo'yu Kurun

Rust tabanlı Solana programlarını derleyebilmek için Rust dilini ve Cargo'yu (Rust paket yöneticisi) [Rustup](https://rustup.rs/) kullanarak kurun:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Yerel doğrulayıcınızı çalıştırın

Solana CLI, yerleşik olarak [test doğrulayıcısını](https://docs.solanalabs.com/cli/examples/test-validator) içerir. Bu komut satırı aracı, makinenizde tam bir blockchain kümesi çalıştırmanıza olanak tanır.

```shell
solana-test-validator
```

:::tip
Solana test doğrulayıcısını, açık kalacak yeni / ayrı bir terminal penceresinde çalıştırın. Bu komut satırı programı, yerel doğrulayıcınızın çevrimiçi kalması ve harekete hazır olması için çalışır durumda kalmalıdır.
:::

Solana CLI'nizi, gelecekteki tüm terminal komutlarınız ve Solana programı dağıtımınız için yerel doğrulayıcınızı kullanacak şekilde yapılandırın:

```shell
solana config set --url localhost
```

## Cargo ile yeni bir Rust kütüphanesi oluşturun

Rust'ta yazılan Solana programları _kütüphanelerdir_ ve `BPF bayt koduna` derlenir ve `.so` formatında kaydedilir.

Cargo komut satırı aracılığıyla `hello_world` adında yeni bir Rust kütüphanesi başlatın:

```shell
cargo init hello_world --lib
cd hello_world
```

Yeni Rust kütüphanenize `solana-program` crate'ini ekleyin:

```shell
cargo add solana-program
```

:::note
`solana-program` ve diğer Solana Rust bağımlılıklarınızı, kurulu olan Solana CLI sürümünüzle uyumlu tutmanız şiddetle önerilir. Örneğin, eğer Solana CLI `2.0.3` sürümünü kullanıyorsanız, bunun yerine:

```
cargo add solana-program@"=2.0.3"
```

komutunu çalıştırabilirsiniz. Bu, crate'inizin yalnızca `2.0.3` sürümünü kullanmasını ve başka bir şey kullanmamasını sağlar. Eğer Solana bağımlılıklarıyla ilgili uyumluluk sorunları yaşarsanız, [Solana Stack Exchange](https://solana.stackexchange.com/questions/9798/error-building-program-with-solana-program-v1-18-and-cli-v1-17/9799) adresine göz atabilirsiniz.
:::

`Cargo.toml` dosyanızı açın ve uygun bir şekilde proje adınızı güncelleyerek gerekli Rust kütüphane yapılandırma ayarlarını ekleyin:

```toml
[lib]
name = "hello_world"
crate-type = ["cdylib", "lib"]
```

## İlk Solana programınızı oluşturun

Rust tabanlı Solana programınızın kodu `src/lib.rs` dosyanızda yer alacaktır. `src/lib.rs` içinde Rust crate'lerinizi içe aktarıp mantığınızı tanımlayabileceksiniz. Favori editörünüzde `src/lib.rs` dosyanızı açın.

`lib.rs`'nin en üstüne `solana-program` crate'ini içe aktarın ve gerekli öğeleri yerel ad alanına getirin:

```rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
};
```

Her Solana programı, Solana runtime'ına onchain kodunuzu çalıştırmaya nereden başlayacağını söyleyen bir `entrypoint` tanımlamalıdır. Programınızın `entrypoint'ı`, `process_instruction` adında bir genel fonksiyon sağlamalıdır:

```rust
// programın giriş noktasını tanımlayıp dışa aktar
entrypoint!(process_instruction);

// program giriş noktasının uygulanması
pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8]
) -> ProgramResult {
    // blockchain'e bir mesaj kaydedin
    msg!("Hello, world!");

    // programdan nazikçe çık
    Ok(())
}
```

Her onchain programı, `Ok` [sonuç enum'unu](https://doc.rust-lang.org/std/result/) `()` değeri ile döndürmelidir. Bu, Solana runtime'ına programınızın hatasız başarılı bir şekilde çalıştığını söyler.

Yukarıdaki program, basitçe [bir mesajı](https://docs.programs/debugging.md#logging) "_Hello, world!_" olarak blockchain kümesine kaydedecek ve daha sonra `Ok(())` ile nazikçe çıkacaktır.

## Rust programınızı derleyin

Bir terminal penceresinde, Rust programınızı projenizin kök dizininde (yani, `Cargo.toml` dosyanızın bulunduğu dizinde) çalıştırarak derleyebilirsiniz:

```shell
cargo build-sbf
```

> Her Rust programınızı derledikten sonra yukarıdaki komut, derlenmiş programınızın `.so` dosyasının build yolunu ve program adresi için kullanılacak varsayılan anahtar dosyasını çıktılayacaktır. `cargo build-sbf`, kurulu solana CLI araçlarından araç zincirini yükler. Herhangi bir sürüm uyuşmazlığı yaşarsanız, bu araçları yükseltmeniz gerekebilir. Eğer şu hatayı alırsanız:
> `error while loading shared libraries: librustc_driver-278a6e01e221f788.so`, `~/.cache/solana/` dizinine gidip oradaki platform araçlarını `rm -rf` komutu ile silmeniz ve ardından `cargo build-sbf` komutunu tekrar çalıştırmanız gerekebilir.

## Solana programınızı dağıtın

Solana CLI kullanarak, programınızı mevcut seçili kümenize dağıtabilirsiniz:

```shell
solana program deploy ./target/deploy/hello_world.so
```

Solana programınız dağıtıldığında (ve işlem [sonuçlandırıldığında](https://docs.solanalabs.com/consensus/commitments)), yukarıdaki komut programınızın genel adresini (program id olarak da bilinir) çıktılayacaktır.

```shell
# örnek çıktı
Program Id: EFH95fWg49vkFNbAdw9vy75tM7sWZ2hQbTTUmuACGip3
```

#### Tebrikler!

Rust dilini kullanarak bir Solana programı başarıyla kurup, derleyip ve dağıttınız.

:::success
Yeni dağıttığınız programınızı görmek için [Solana Explorer](https://explorer.solana.com/) kullanabilirsiniz. Explorer, yerel ağda da çalışıyor, yerel ağda [Solana Explorer'ı açabilirsiniz](https://explorer.solana.com/?cluster=custom) ve sadece programId'nizi arama çubuğuna yapıştırabilirsiniz.
:::

## Hello World programını çağırma

Artık program dağıtıldığında, onu çağırmak ve zincir üzerinde gerçek "Hello World" mesajını görmek istiyoruz. Bunun için Javascript ve `Solana web3.js` kütüphanesini kullanacağız.

### Node.js'i Kurun

Windows'ta WSL2 üzerinde node kullanmak için lütfen bu [WSL2 üzerinde node kurulum kılavuzunu](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) takip edin.

```shell
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

terminali yeniden açın

```shell
nvm install --lts
node --version
```

macOS için [paket yöneticisi aracılığıyla node.js kurabilirsiniz](https://nodejs.org/en/download/package-manager)

### İstemci dosyasını oluşturun

Solana web3.js kütüphanesini ve Solana yardımcı kütüphanesini yükleyin:

```shell
npm install @solana/web3.js@1 @solana-developers/helpers@2
```

`client.mjs` adında yeni bir dosya oluşturun ve aşağıdaki kodu ekleyin:

```javascript
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getKeypairFromFile } from "@solana-developers/helpers";

const programId = new PublicKey("YOUR_PROGRAM_ID");

// Bir Solana kümesine bağlanın. Yerel test doğrulayıcınıza ya da devnet'e
const connection = new Connection("http://localhost:8899", "confirmed");
//const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Önceki adımda oluşturduğumuz anahtar çiftini yüklüyoruz
const keyPair = await getKeypairFromFile("~/.config/solana/id.json");

// Her işlem için bir blockhash gereklidir
const blockhashInfo = await connection.getLatestBlockhash();

// Yeni bir işlem oluştur
const tx = new Transaction({
  ...blockhashInfo,
});

// Hello World talimatını ekleyin
tx.add(
  new TransactionInstruction({
    programId: programId,
    keys: [],
    data: Buffer.from([]),
  }),
);

// Daha önce oluşturduğunuz anahtar çifti ile işlemi imzalayın
tx.sign(keyPair);

// İşlemi Solana ağına gönderin
const txHash = await connection.sendRawTransaction(tx.serialize());

console.log("İşlem hash'i ile gönderildi:", txHash);

await connection.confirmTransaction({
  blockhash: blockhashInfo.blockhash,
  lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
  signature: txHash,
});

console.log(
  `Tebrikler! 'Hello World' işleminizi Solana Explorer'da görüntüleyin:
  https://explorer.solana.com/tx/${txHash}?cluster=custom`,
);
```

> Dağıtım adımından aldığınız program ID'sini `YOUR_PROGRAM_ID` ile değiştirmeyi unutmayın.

### İstemciyi çalıştırın

Artık bu dosyayı çalıştırmak için `node` kullanarak zincir üzerindeki "Hello World" mesajını görebiliriz.

```shell
node client.mjs
```

Aşağıdaki çıktıyı görmelisiniz:

```shell
Tebrikler! 'Hello World' işleminizi Solana Explorer'da görüntüleyin:
  https://explorer.solana.com/tx/2fTcQ74z4DVi8WRuf2oNZ36z7k9tGRThaRPXBMYgjMUNUbUSKLrP6djpRUZ8msuTXvZHFe3UXi31dfgytG2aJZbv?cluster=custom
```

:::success
Bağlantıyı takip ederseniz, Solana Explorer'da 'Hello World' işleminizi görebilirsiniz.
:::

## Solana devnet'e dağıtım yapın

Artık programınızı yerel kümenize başarıyla dağıttınız. Programınızı arkadaşlarınıza göstermek için halka açık devnet'e dağıtmak isterseniz, aşağıdaki komutu çalıştırabilirsiniz:

```shell
solana program deploy ./target/deploy/hello_world.so --url https://api.devnet.solana.com
```

Ardından, `client.mjs` dosyanızdaki bağlantı URL'sini de `https://api.devnet.solana.com` olarak değiştirin ve istemciyi tekrar çalıştırın.

```shell
node client.mjs
```

Önceki gibi aynı çıktıyı göreceksiniz, ancak şimdi halka açık devnet kümesinde. İşlemi tekrar [Solana Explorer](https://explorer.solana.com/?cluster=devnet) üzerinde görebilirsiniz. Artık sağ üstte devnet'e geçmeniz yeterli.

Tebrikler, artık herkes sizin "Hello World" işleminizi Solana blockchain'inde görebilir.

## Sonraki adımlar

Rust tabanlı Solana programları yazmayı öğrenmek için aşağıdaki bağlantılara göz atın:

- `Solana programı yazma genel bakış`
- [Solana Hızlı Başlangıç Kılavuzu](https://solana.com/docs/intro/quick-start)
- `Rust ile Solana programları geliştirmeyi öğrenin`
- `Onchain programları hata ayıklama`