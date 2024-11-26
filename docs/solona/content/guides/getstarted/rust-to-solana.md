---
date: 2024-05-21T00:00:00Z
difficulty: Intro
title: "Rust Deneyimi ile Solana'ya Başlarken"
description: "Rust Mühendisi olarak Solana üzerinde nasıl geliştirme yapmaya başlayacağınızı öğrenin"
tags:
  - rust
  - solana
  - anchor
keywords:
  - anchor
  - web3js
  - solana
  - anchor eğitimi
  - solana geliştirmeye giriş
  - blokzincir geliştiricisi
  - blokzincir eğitimi
  - web3 geliştiricisi
  - rust geliştiricisi
---

Rust bilen geliştiricilerin Solana geliştirmesine girmesi için harika bir başlangıç vardır. Rust, Solana Blokzinciri'nde onchain programlar yazmak için resmi olarak desteklenen bir dildir. Ancak, dilin kullanımında bazı önemli farklılıklar kafa karıştırıcı olabilir.

:::tip
Bu rehber, bu farklılıklardan bazılarını, özellikle kurulum detayları, kısıtlamalar, makro değişiklikleri ve hesaplama limitlerini ele alacaktır.
:::

Ayrıca, Solana ile başlamanız için gerekli geliştirme ortamlarını ve çerçeveleri de kapsayacaktır. 

Bu rehberin sonunda, Rust geliştiricileri Solana yolculuklarına başlamak için bilmesi gereken farklılıkları anlayacaklar.

## Temel Farklılıkları Anlamak

Öncelikle, bu rehberin hedefinin Rust'ın Solana ile çalışırken dil olarak kullanımındaki farklılıkları anlamak olduğunu belirtmek gerekir. 
[Blokzincir veya Solana temelleri](https://solana.com/learn/blockchain-basics) üzerinde durmayacaktır.

Ayrıca, Solana'da program yazmak için anlaşılması gereken temel Solana kavramlarını da kapsamayacaktır. Bu kavramlar arasında şunlar bulunmaktadır:

- [Programlar](https://solana.com/docs/core/programs) - Solana'nın akıllı sözleşmelere karşılık gelen versiyonu
- [Hesaplar](https://solana.com/docs/core/accounts) - Solana defterinde verileri (veri hesabı) tutan veya yürütme programı olan bir kayıt
- Çeşitli [ücretler](https://solana.com/docs/core/fees#why-pay-transaction-fees) - Temel ücret, öncelik ücreti ve kira gibi
- [İşlemler](https://solana.com/docs/core/transactions) - Ağ ile etkileşimlerde bulunan ve talimatlar, imzalar ve daha fazlasını içeren etkileşimlerdir.

Bu temel kavramlar hakkında daha fazla bilgi için [Solana geliştirici belgelerine](https://solana.com/docs) bakın.

---

### Proje Kurulumu Üzerindeki Farklar

Şimdi **proje kurulumu** üzerindeki farklara bakalım.

## Ana Kurulum Detayları

Rust'daki Solana için onchain programlar hala Rust programlarıdır. Hala kök dizinde bir `/src` klasör ve `Cargo.toml` dosyası ile standart Rust projesini izlerler. Ancak, birkaç önemli farklılık vardır.

### Proje Bağımlılıkları

Başlamak için, Rust ile yazılmış her onchain Solana programı için [solana-program crate](https://crates.io/crates/solana-program) gereklidir. Bu, tüm onchain Rust programları için temel kütüphanedir. Kütüphane, gerekli **program giriş noktası** _(aşağıya bakın)_, **temel veri türleri**, **günlük makroları** ve daha fazlası için makrolar tanımlar.

### Program Giriş Noktası

:::info
Solana programları, `main` işlevi yerine `entrypoint!` makrosunu kullanır. Bu simge dışa aktarılır ve program çalıştırıldığında Solana çalışma zamanı tarafından çağrılır.
:::

Giriş noktası makrosu belirli bir işlevi çağırır ve bu işlevin aşağıdaki tür imzasına sahip olması gerekir:

```rust
pub fn process_instruction( program_id: &Pubkey, accounts: &[AccountInfo],
instruction_data: &[u8], ) -> ProgramResult {

        //program kodu buraya yazılır

}
```

Bu üç parametre her onchain programa geçilir:

1. `program_id`, mevcut programın açık anahtarıdır.
2. `accounts`, talimatı işlemek için gerekli olan tüm hesaplarıdır.
3. `instruction_data`, o talimata özgü veridir.

Her program, talimat üzerinde `entrypoint!` makrosunu çağırmalıdır:

```rust
entrypoint!(process_instruction);
```

### Derleme ve Test

[Solana komut satırı araçlarını](https://solana.com/docs/intro/installation) kurduktan sonra, projeler normal şekilde `cargo build` ile ana makineleri hedef alacak şekilde derlenebilir.

Ancak, Solana çalışma zamanını hedeflemek için `cargo build-bpf` veya `cargo build-spf` kullanmalısınız; bu, programı Solana çalışma zamanında çalıştırmak için gerekli bytecode'a derleyecektir.

:::note
Birim testi standart `#test` öznitelikleri ile `cargo test` kullanılarak yapılabilir. Daha entegre testler için, [solana-program-test](https://crates.io/crates/solana-program-test) crate'i, dış testlerin işlemler göndermesine izin veren bir yerel Solana çalışma zamanı örneği sağlar.
:::

Son olarak, [solana-test-validator](https://docs.solanalabs.com/cli/examples/test-validator) ile tam bir test kümesi başlatılabilir; bu, Solana CLI ile birlikte kurulu olan bir makinede tamamen işlevsel bir test kümesi oluşturur ve programları dağıtıp testler gerçekleştirebilir.

---

## Kısıtlamaları Anlamak

Çoğu standart Rust crate'i Solana çalışma zamanında mevcut olsa da ve üçüncü taraf crate'ler de desteklense de, bazı kısıtlamalar mevcuttur. Solana çalışma zamanının kaynak kısıtlamaları var ve deterministik olarak çalışması gerektiğinden, bilinmesi gereken farklılıklar şunlardır:

### Paket Sınırlamaları

Aşağıdaki paketler kullanılamaz:

- rand
- std::fs
- std::net
- std::future
- std::process
- std::sync
- std::task
- std::thread
- std::time

Aşağıdaki paketlerin işlevselliği sınırlıdır:

- std::hash
- std::os

### Rand Bağımlılıkları

:::warning
Programların deterministik olarak çalışması gerektiğinden `rand` crate'i mevcut değildir. `rand`'ya bağımlı olan ek bir crate kullanmak da derleme hatalarına neden olur.
:::

Ancak, kullanılan crate `rand`'ya bağımlı ancak aslında rastgele sayı üretmiyorsa, programın Cargo.toml dosyasına aşağıdakileri ekleyerek bunun üstesinden gelmek mümkündür:

```toml
[dependencies]
getrandom = { version = "0.1.14", features = ["dummy"] }
```

### Makro Değişiklikleri

Bazı standart makrolar değiştirilmiş veya davranışları değiştirilmiştir. İlk olarak, `println!` makrosu, hesaplaması daha basit olan `msg!` makrosu ile değiştirilmiştir. `msg!` makrosu program günlüklerine çıktıyı verir ve aşağıdaki gibi kullanılabilir:

```rust
msg!("Mesajınız");
msg!(0_64, 1_64, 2_64);
msg!("Değişkeniniz: {:?}", variable);
```

`panic!`, `assert!` ve dahili panikler de varsayılan olarak program günlüklerine yazılır. Ancak, bu, özel bir panik işleyicisi ile değiştirilebilir.

:::danger
`panic!` için daha iyi bir alternatif olarak hata yönetimi kullanılmalıdır:
:::

```rust
#[error_code]
pub enum MyErrors {
    CustomError,
}

#[program]
pub mod anchor_error_test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        //panic!("PANİK");
        return Err(MyErrors::CustomError.into());

        Ok(())
    }
}
```

---

## Hesaplama Bütçesi

Bir Rust geliştiricisi olarak, verimli hesaplama yeni bir şey değildir. Ancak Solana'da her işlem için geçerli olan sabit bir [hesaplama bütçesi](https://solana.com/developers/guides/advanced/how-to-request-optimal-compute) olduğunu bilmek önemli olabilir. İşlemler hesaplama bütçesini aştığında, durdurulur ve hata döner.

Programlar, `sol_remaining_compute_units` sistem çağrısı aracılığıyla kalan hesaplama birimlerinin sayısına erişebilir ve `sol_log_compute_units` ile kalan hesaplama birimlerinin sayısını günlüğe kaydedebilir.

---

## Geliştirme Ortamını ve Çerçeveleri Öğrenme

Solana CLI ve `solana_program` crate'i başlamak için gereken her şeydir, ancak öğrenimi hızlandırabilecek birkaç yararlı araç vardır.

![Ağ Diyagramı](../../../images/solana/public/assets/guides/rust-to-solana/network-diagram.png)

### Solana Playground

[Sola Playground](https://beta.solpg.io/) geliştiricilerin Solana programlarını geliştirmesine ve dağıtmasına olanak tanıyan tarayıcı tabanlı bir IDE'dir.

![Solana Playground](../../../images/solana/public/assets/guides/rust-to-solana/solana-playground.png)

Solana ile geliştirmeye başlamak için en kolay yoldur ve Solana Rust programlarını oluşturma, test etme ve dağıtma desteği sağlar. Ayrıca, öğrenmeye rehberlik edecek bir dizi yerleşik eğitim mevcut.

:::tip
Solana Playground, geliştiricilerin yerel bir ortam kurmadan hemen başlamasına olanak tanır.
:::

### Anchor Kullanımı

[Anchor](https://www.anchor-lang.com/) güvenli Solana programlarının inşasını hızlandırmayı hedefleyen bir çerçevedir. Standart genel kodu işleyerek geliştirme döngüsünü hızlandırabilir. Ayrıca, varsayılan olarak bazı güvenlik kontrolleri sağlar ve Solana programlarını daha güvenli hale getirir.

Yeni bir program oluşturmak için, sadece Solana playground'da `yeni bir Anchor projesi oluşturun`.

Alternatif olarak, [Anchor CLI'yi](https://www.anchor-lang.com/docs/installation) yerel olarak kurun ve ardından `anchor init ` komutunu kullanarak yeni bir Anchor projesi oluşturun.

---

## Offchain Programlar Oluşturma

Bu rehber, Rust ile **onchain Solana programları** geliştirmeye dair temel detayları ele almıştır. Ancak, Rust ile **offchain Solana istemcileri** geliştirmek de mümkündür. Bu, [solana_sdk crate](https://docs.rs/solana-sdk/latest/solana_sdk/) kullanılarak yapılabilir. Bu, Rust programlarının [JSON RPC API](https://solana.com/docs/rpc) aracılığıyla bir Solana düğümü ile etkileşimde bulunmasını sağlar.

Diğer bir seçenek, RPC aracılığıyla Anchor'da yazılmış Solana programları ile etkileşimde bulunan [anchor_client crate](https://docs.rs/anchor-client/latest/anchor_client/) kullanmaktır. Alternatif olarak, Rust'ta onchain programlar yazmayı ve offchain istemcileri [JS/TS'de](https://solana.com/de/docs/clients/javascript-reference) değerlendirmeyi düşünün.

### Kapanış

Bu rehber, Solana için Rust ile geliştirme temellerini, kurulum detayları ve kısıtlamalardan geliştirme ortamları ve çerçevelere kadar kapsadı.

Rust ile yazılmış diğer Solana program örnekleri için bu [GitHub'daki örneklere](https://github.com/solana-labs/solana-program-library/tree/master/examples/rust) göz atın.

Birçok örnek Solana programını görüntülemek için [GitHub'daki Solana Program Örneklerine](https://solana.com/docs/programs/examples) bakın.