---
title: Rust ile Program Geliştirme
description:
  Solana programlarını Rust kullanarak geliştirmeyi öğrenin, akıllı sözleşmelerin Solana blockchain üzerindeki oluşturulması, derlenmesi, testi ve dağıtımı için adım adım talimatlar dahil.
sidebarLabel: Rust Programları
sidebarSortOrder: 1
altRoutes:
  - /docs/programs/lang-rust
---

Solana programları esasen Rust programlama dili kullanılarak geliştirilir. Bu sayfa, Anchor framework'ü kullanmadan Rust'ta Solana programları yazmaya odaklanmaktadır; bu yaklaşım genellikle "yerel Rust" programları yazma olarak adlandırılır.

Yerel Rust geliştirme, geliştiricilere Solana programları üzerinde doğrudan kontrol sağlar. Ancak, bu yaklaşım, Anchor framework'ünü kullanmaya kıyasla daha fazla manuel kurulum ve şablon kod gerektirir. Bu yöntem, aşağıdaki belirli ihtiyaçları olan geliştiriciler için önerilir:

- Program mantığı ve optimizasyonlar üzerinde daha ayrıntılı kontrol arayanlar
- Daha yüksek düzeyde framework'lere geçmeden önce temel kavramları öğrenmek isteyenler

:::tip
Yeni başlayanlar için Anchor framework'ü ile başlamalarını öneriyoruz. Daha fazla bilgi için `Anchor` bölümüne bakın.
:::

## Ön Koşullar

Detaylı kurulum talimatları için `installation` sayfasını ziyaret edin.

Başlamadan önce aşağıdakilerin yüklü olduğundan emin olun:

- Rust: Solana programları oluşturmak için programlama dili.
- Solana CLI: Solana geliştirme için komut satırı aracı.

## Başlarken

Aşağıdaki örnek, Rust ile yazılmış ilk Solana programınızı oluşturmak için temel adımları kapsamaktadır. "Hello, world!" yazan minimal bir program yaratacağız.



### Yeni Bir Program Oluşturma

Öncelikle, `--lib` bayrağı ile birlikte standart `cargo init` komutunu kullanarak yeni bir Rust projesi oluşturun.

```shell filename="Terminal"
cargo init hello_world --lib
```

Proje dizinine gidin. Varsayılan `src/lib.rs` ve `Cargo.toml` dosyalarını görmelisiniz.

```shell filename="Terminal"
cd hello_world
```

Sonra, `solana-program` bağımlılığını ekleyin. Bu, Solana programı oluşturmak için gereken minimum bağımlılıktır.

```shell filename="Terminal"
cargo add solana-program@1.18.26
```

Ardından, `Cargo.toml` içine aşağıdaki kodu ekleyin. Bu yapılandırmayı eklemezseniz, programı derlediğinizde `target/deploy` dizini oluşturulmayacaktır.

```toml filename="Cargo.toml"
[lib]
crate-type = ["cdylib", "lib"]
```

`Cargo.toml` dosyanız aşağıdaki gibi görünmelidir:

```toml filename="Cargo.toml"
[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "1.18.26"
```

Sonra, `src/lib.rs` dosyasının içeriğini aşağıdaki kod ile değiştirin. Bu, program çağrıldığında "Hello, world!" mesajını program günlüğüne yazan minimal bir Solana programıdır.

> **Not:** `msg!` makrosu, Solana programlarında mesajı program günlüğüne yazdırmak için kullanılır.

```rs filename="lib.rs"
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) - ProgramResult {
    msg!("Hello, world!");
    Ok(())
}
```

### Programı Derleme

Sonra, `cargo build-sbf` komutunu kullanarak programı derleyin.

```shell filename="Terminal"
cargo build-sbf
```

Bu komut, ağa "akıllı sözleşme" olarak dağıtılacak olan derlenmiş Solana programını içeren önemli iki dosya içeren `target/deploy` dizinini oluşturur:

1. Bir `.so` dosyası (örneğin, `hello_world.so`): Bu, ağa dağıtılacak olan derlenmiş Solana programıdır.
2. Bir anahtar çift dosyası (örneğin, `hello_world-keypair.json`): Bu anahtar çiftinin kamu anahtarı, program dağıtıldığında program ID'si olarak kullanılır.

Program ID'sini görüntülemek için, terminalinizde aşağıdaki komutu çalıştırın. Bu komut, belirtilen dosya yolundaki anahtar çiftinin kamu anahtarını yazdırır:

```shell filename="Terminal"
solana address -k ./target/deploy/hello_world-keypair.json
```

Örnek çıktı:

```
4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz
```

### Programı Test Etme

Sonra, `solana-program-test` kütüphanesini kullanarak programı test edin. `Cargo.toml`'ye aşağıdaki bağımlılıkları ekleyin.

```shell filename="Terminal"
cargo add solana-program-test@1.18.26 --dev
cargo add solana-sdk@1.18.26 --dev
cargo add tokio --dev
```

Program kodunun altına, `src/lib.rs` dosyasına aşağıdaki testi ekleyin. Bu, hello world programını çağıran bir test modülüdür.

```rs filename="lib.rs"
#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{signature::Signer, transaction::Transaction};

    #[tokio::test]
    async fn test_hello_world() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) =
            ProgramTest::new("hello_world", program_id, processor!(process_instruction))
                .start()
                .await;

        // Programı çağırmak için talimat oluştur
        let instruction =
            solana_program::instruction::Instruction::new_with_borsh(program_id, &(), vec![]);

        // Talimatı yeni bir işlemin içine ekle
        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer], recent_blockhash);

        // İşlemi işleme al
        let transaction_result = banks_client.process_transaction(transaction).await;
        assert!(transaction_result.is_ok());
    }
}
```

`cargo test-sbf` komutunu kullanarak testi çalıştırın. Program günlüğünde "Hello, world!" mesajı görüntülenecektir.

```shell filename="Terminal"
cargo test-sbf
```

Örnek çıktı:

```shell filename="Terminal" {4} /Program log: Hello, world!/
running 1 test
[2024-10-18T21:24:54.889570000Z INFO  solana_program_test] "hello_world" SBF program from /hello_world/target/deploy/hello_world.so, modified 35 seconds, 828 ms, 268 µs and 398 ns ago
[2024-10-18T21:24:54.974294000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-18T21:24:54.974814000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Hello, world!
[2024-10-18T21:24:54.976848000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 140 of 200000 compute units
[2024-10-18T21:24:54.976868000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
test test::test_hello_world ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.13s
```

### Programı Dağıtma

Sonra, programı dağıtın. Yerel geliştirirken, `solana-test-validator` kullanabiliriz.

Öncelikle, Solana CLI'yi yerel Solana kümesini kullanacak şekilde yapılandırın.

```shell filename="Terminal"
solana config set -ul
```

Örnek çıktı:

```
Config File: /.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /.config/solana/id.json
Commitment: confirmed
```

Yeni bir terminal açın ve yerel doğrulayıcıyı başlatmak için `solana-test-validator` komutunu çalıştırın.

```shell filename="Terminal"
solana-test-validator
```

Test doğrulayıcısı çalışırken, programı yerel doğrulayıcıya dağıtmak için ayrı bir terminalde `solana program deploy` komutunu çalıştırın.

```shell filename="Terminal"
solana program deploy ./target/deploy/hello_world.so
```

Örnek çıktı:

```
Program Id: 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz
Signature:
5osMiNMiDZGM7L1e2tPHxU8wdB8gwG8fDnXLg5G7SbhwFz4dHshYgAijk4wSQL5cXiu8z1MMou5kLadAQuHp7ybH
```

Program ID'sini ve işlem imzasını [Solana Explorer](https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899) üzerinden inceleyebilirsiniz. Solana Explorer'daki kümenin de localhost olması gerektiğini unutmayın. Solana Explorer üzerindeki "Özel RPC URL" seçeneği varsayılan olarak `http://localhost:8899`'dur.

### Programı Çağırma

Sonra, bir Rust istemcisi kullanarak programı nasıl çağıracağımızı göstereceğiz.

Önce bir `examples` dizini ve bir `client.rs` dosyası oluşturun.

```shell filename="Terminal"
mkdir -p examples
touch examples/client.rs
```

`Cargo.toml` dosyasına aşağıdakileri ekleyin.

```toml filename="Cargo.toml"
[[example]]
name = "client"
path = "examples/client.rs"
```

`solana-client` bağımlılığını ekleyin.

```shell filename="Terminal"
cargo add solana-client@1.18.26 --dev
```

Aşağıdaki kodu `examples/client.rs` dosyasına ekleyin. Bu, yeni bir anahtar çiftine işlem ücretlerini ödemek için kaynak sağlayan ve ardından hello world programını çağıran bir Rust istemci betiğidir.

```rs filename="example/client.rs"
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    instruction::Instruction,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
};
use std::str::FromStr;

#[tokio::main]
async fn main() {
    // Program ID (gerçek program ID'niz ile değiştirin)
    let program_id = Pubkey::from_str("4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz").unwrap();

    // Solana devnet'e bağlan
    let rpc_url = String::from("http://127.0.0.1:8899");
    let client = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    // Ödeyici için yeni bir anahtar çifti oluştur
    let payer = Keypair::new();

    // Airdrop talep et
    let airdrop_amount = 1_000_000_000; // 1 SOL
    let signature = client
        .request_airdrop(&payer.pubkey(), airdrop_amount)
        .expect("Airdrop talep etme başarısız oldu");

    // Airdrop onayını bekle
    loop {
        let confirmed = client.confirm_transaction(&signature).unwrap();
        if confirmed {
            break;
        }
    }

    // Talimat oluştur
    let instruction = Instruction::new_with_borsh(
        program_id,
        &(),    // Boş talimat verisi
        vec![], // Hesap gerekmez
    );

    // Talimatı yeni bir işleme ekle
    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer], client.get_latest_blockhash().unwrap());

    // İşlemi gönder ve onayla
    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => println!("İşlem İmzası: {}", signature),
        Err(err) => eprintln!("İşlem gönderme hatası: {}", err),
    }
}
```

Betik çalıştırılmadan önce yukarıdaki kod parçasındaki program ID'sini kendi program ID'nizle değiştirin.

Program ID'nizi almak için aşağıdaki komutu çalıştırabilirsiniz.

```shell filename="Terminal"
solana address -k ./target/deploy/hello_world-keypair.json
```

```diff
#[tokio::main]
async fn main() {
-     let program_id = Pubkey::from_str("4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz").unwrap();
+     let program_id = Pubkey::from_str("YOUR_PROGRAM_ID").unwrap();
    }
}
```

İstemci betiğini aşağıdaki komutla çalıştırın.

```shell filename="Terminal"
cargo run --example client
```

Örnek çıktı:

```
İşlem İmzası: 54TWxKi3Jsi3UTeZbhLGUFX6JQH7TspRJjRRFZ8NFnwG5BXM9udxiX77bAACjKAS9fGnVeEazrXL4SfKrW7xZFYV
```

İşlem imzasını [Solana Explorer](https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899) üzerinden inceleyerek program günlüğünde "Hello, world!" mesajını görebilirsiniz.

### Programı Güncelleme

Solana programları, aynı program ID'sine yeniden dağıtılarak güncellenebilir. `src/lib.rs` dosyasını "Hello, world!" yerine "Hello, Solana!" yazacak şekilde güncelleyin.

```diff filename="lib.rs"
pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) - ProgramResult {
-   msg!("Hello, world!");
+   msg!("Hello, Solana!");
    Ok(())
}
```

Güncellenmiş programı `cargo test-sbf` komutunu kullanarak test edin.

```shell filename="Terminal"
cargo test-sbf
```

Program günlüğünde "Hello, Solana!" mesajını görmelisiniz.

```shell filename="Terminal" {4}
running 1 test
[2024-10-23T19:28:28.842639000Z INFO  solana_program_test] "hello_world" SBF program from /code/misc/delete/hello_world/target/deploy/hello_world.so, modified 4 minutes, 31 seconds, 435 ms, 566 µs and 766 ns ago
[2024-10-23T19:28:28.934854000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-23T19:28:28.936735000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Hello, Solana!
[2024-10-23T19:28:28.938774000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 140 of 200000 compute units
[2024-10-23T19:28:28.938793000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
test test::test_hello_world ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.14s
```

Güncellenmiş bir `.so` dosyasını oluşturmak için `cargo build-sbf` komutunu çalıştırın.

```shell filename="Terminal"
cargo build-sbf
```

Programı dağıtmak için `solana program deploy` komutunu kullanarak yeniden dağıtın.

```shell filename="Terminal"
solana program deploy ./target/deploy/hello_world.so
```

İstemci kodunu tekrar çalıştırın ve işlem imzasını Solana Explorer'da inceleyerek program günlüğünde "Hello, Solana!" mesajını görün.

```shell filename="Terminal"
cargo run --example client
```

### Programı Kapatma

Solana programınızı kapatarak hesaba tahsis edilen SOL'u geri alabilirsiniz. Programı kapatmak geri alınamaz, bu nedenle dikkatli yapılmalıdır.

:::warning
Bir programı kapatmak için `solana program close ` komutunu kullanın. Örneğin:
```shell filename="Terminal"
solana program close 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz --bypass-warning
```
:::

Örnek çıktı:

```
Kapalı Program Id 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz, 0.1350588 SOL geri alındı
```

Bir program kapatıldıktan sonra, program ID'si tekrar kullanılamaz. Daha önce kapatılan bir program ID'si ile program dağıtmaya çalışmak bir hataya yol açacaktır.

```
Error: Program 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz has been closed, use a new Program Id
```

Eğer bir programı kapattıktan sonra aynı kaynak kodu ile yeniden dağıtmanız gerekirse, yeni bir program ID'si oluşturmanız gerekir. Program için yeni bir anahtar çifti oluşturmak için aşağıdaki komutu çalıştırın:

```shell filename="Terminal"
solana-keygen new -o ./target/deploy/hello_world-keypair.json --force
```

Alternatif olarak, mevcut anahtar çiftinin dosyasını (örn. `./target/deploy/hello_world-keypair.json`) silebilir ve tekrar `cargo build-sbf` çalıştırarak yeni bir anahtar çifti dosyası oluşturabilirsiniz.

