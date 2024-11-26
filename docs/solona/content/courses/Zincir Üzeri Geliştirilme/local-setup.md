---
title: Yerel Program Geliştirme
objectives:
  - Solana program geliştirme için, Solana CLI araçları, Rust ve Anchor ile bir yerel ortam kurun.
  - Anchor'ın kutudan çıkar çıkmaz hatasız ve uyarısız çalıştığından emin olun.
description:
  "Onchain programları oluşturmak için yerel bir geliştirme ortamı kurun."
---

## Özet

- Yerel olarak onchain programlar geliştirmek için **Solana CLI**, **Rust** ve (isteğe bağlı ama önerilen) **Anchor** gerekiyor.
- Yeni bir boş Anchor projesi oluşturmak için `anchor init` komutunu kullanabilirsiniz.
- `anchor test` testlerinizi çalıştırır ve kodunuzu da derler.

---

## Ders

Bu ders, onchain programlar geliştirmek için gereken araçların kurulumuna dair bir kılavuzdur. Solana CLI araçlarını, Rust SDK'yı ve Anchor'u kurarak kurulumu test etmek için bir test programı oluşturalım.

### Windows Kullanıcıları için Ekstra Adımlar

:::tip
macOS ve Linux kullanıcıları bu kısmı atlayabilir. Windows'taysanız, bu ekstra adımları takip edebilirsiniz.
:::

Öncelikle, Windows Terminal'inin kurulu olduğundan emin olun; aksi takdirde Windows Terminal'i 
[Microsoft Store](https://apps.microsoft.com/detail/9N0DX20HK701) üzerinden kurabilirsiniz.

Sonrasında,
[Windows Subsystem for Linux (WSL)'yi](https://learn.microsoft.com/en-us/windows/wsl/install) 
kurun. WSL, bilgisayarınızı yavaşlatmadan gerektiğinde hemen başlatılan bir Linux ortamı sağlar.

Windows Terminal'i açın, 'Ubuntu' oturumu başlatın ve bu adımlara devam edin.

### Rust'ı İndirin

Öncelikle, Rust'ı 
[bu talimatları takip ederek](https://www.rust-lang.org/tools/install) 
kurun:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Solana CLI Araçlarını İndirin

Sonrasında, 
`Solana CLI araçlarını indirin`:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Kurulumdan sonra, `solana -V` komutunu çalıştırdığınızda `solana-cli 1.18.x` (burada `x` herhangi bir sayı olabilir) göstermelidir.

### Solana Test Validator'ünü Çalıştırma

Solana Test Validator, Solana blockchain'i için yerel bir emülatördür. Geliştiricilere, bir kamu testnet veya mainnet'e bağlanmadan Solana programlarını inşa edip test edebilecekleri özel ve kontrollü bir ortam sunar.

Solana Test Validator'ü başlatmak için şu komutu çalıştırın:

```bash
solana-test-validator
```

`solana-test-validator` çalıştırıldığında, validatorün doğru çalıştığını belirten bir çıktı görmelisiniz. Aşağıda çıkışın nasıl görüneceğine dair bir örnek verilmiştir:

```bash
$ solana-test-validator
--faucet-sol argümanı göz ardı edildi, defter zaten mevcut
Defter konumu: test-ledger
Kayıt: test-ledger/validator.log
⠴ Başlatılıyor...
Ücretlerin istikrara kavuşmasını bekliyor 1...
Kimlik: J8yKZJa5NtcmCQqmBRC6Fe8X6AECo8Vc3d7L3dF9JPiM
Genesis Hash: FTPnCMDzTEthZxE6DvHbsWWv83F2hFe1GFvpVFBMUoys
Sürüm: 1.18.22
Shred Sürümü: 49491
Gossip Adresi: 127.0.0.1:1024
TPU Adresi: 127.0.0.1:1027
JSON RPC URL: http://127.0.0.1:8899
WebSocket PubSub URL: ws://127.0.0.1:8900
⠄ 00:00:25 | İşlenen Slot: 114 | Onaylanan Slot: 114 | Nihai Slot: 82 | Tam Anlık Görüntü Slotu: - | Artımlı Anlık Görüntü Slotu: - | İşlemler: 111 | ◎499.999445000
```

> Bu çıktıyı görüyorsanız, Solana test validator'ü düzgün çalışıyor demektir. `anchor test` komutunu çalıştırmanız gerektiğinden süreci CTRL + C tuşları ile iptal etmelisiniz.

Daha ayrıntılı bilgi için, 
[Solana Test Validator kılavuzuna](https://solana.com/developers/guides/getstarted/solana-test-validator) 
bakabilirsiniz.

### Anchor'ı İndirin

Son olarak, [Anchor'ı indirin](https://www.anchor-lang.com/docs/installation):

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

Linux (ya da WSL) kullanıcıları için ek bağımlılıkları kurmanız gerekebilir:

```bash
sudo apt-get update && \
sudo apt-get upgrade && \
sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
```

devam edin...

```bash
avm install latest
avm use latest
```

Kurulumdan sonra, `anchor -V` komutunu çalıştırdığınızda `anchor-cli 0.30.1` göstermelidir. Anchor hakkında daha fazla bilgi için 
[Anchor Kitabı'na](https://book.anchor-lang.com) 
başvurabilirsiniz.

### Anchor Kurulumu Doğrulayın

Anchor kullanarak varsayılan içerik ile geçici bir proje oluşturun ve derlendiğinden ve çalıştığından emin olun:

```bash
anchor init temp-project
cd temp-project
anchor test
```

**`anchor test` komutu hatasız ve uyarısız bir şekilde tamamlanmalıdır.**

---

**Ancak bazı sorunlarla karşılaşabilirsiniz; bunları aşağıda çözeceğiz:**

#### `package 'solana-program' v1.18.12` hatası

`solana-program` ve `solana-cli` arasında uyumsuz sürümlerden kaynaklanmaktadır. 

:::note
`cargo add solana-program@"=1.18.x"` komutunu çalıştırın, burada `x` sizin `solana-cli` sürümünüzle eşleşmelidir. Sonrasında `anchor test` komutunu tekrar çalıştırın.
:::

#### Hata: `Anahtar dosyası okunamıyor`

`.config/solana/id.json` dosyasına bir anahtar ekleyin. Anahtar çiftini bir `.env` dosyasından (sadece sayı dizisi) bir dosyaya kopyalayabilir ya da yeni bir anahtar dosyası oluşturmak için `solana-keygen new --no-bip39-passphrase` komutunu kullanabilirsiniz. Daha sonra `anchor test` komutunu tekrar çalıştırın.

#### Hata: `build-sbf` komutu yok

Bu mesajı görüyorsanız, bu hata genellikle ilgili ikili dosyaların shell'inizin PATH değişkeninde olmadığı için ortaya çıkar.

Bu komutu çalıştırarak bu klasörü shell'inize ekleyin ve değişikliği kalıcı hale getirmek için `~/.zshrc` veya `~/.bashrc` dosyanıza ekleyin.

```bash
export PATH=~"/.local/share/solana/install/active_release/bin:$PATH"
```

#### En son blockhash alınamıyor. Test validator'ü başlamış görünmüyor.

Solana'nın arşivleme için kullandığı 'tar' (tape archiver) komutunun birden fazla sürümü vardır. macOS, BSD tar ile gelir, ancak Solana CLI GNU sürümünün kurulu olmasını istemektedir.

- [Homebrew](https://brew.sh/) kurun ve GNU tar'ı kurmak için kullanın:

  ```bash
  # Homebrew'i kur; zaten Homebrew kuruluysa bu adımı atlayabilirsiniz
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # GNU tar'ı kurun
  brew install gnu-tar
  ```

- Değişikliği kalıcı hale getirmek için bunu `~/.zshrc` veya `~/.bashrc` dosyanıza ekleyin.

  ```bash
  export PATH=/opt/homebrew/opt/gnu-tar/libexec/gnubin:$PATH
  ```

#### Hata: `Ayrıcalıklı rpc portunuz: 8899 zaten kullanılıyor`

`solana-test-validator` çalıştırıyorsanız, `anchor test` çalıştırıldığında `Error: Your configured rpc port: 8899 is already in use` hatasıyla karşılaşabilirsiniz. 

:::warning
Bunu çözmek için, `anchor test` çalıştırmadan önce `solana-test-validator`'i durdurun.
:::

### Tamam mı?

Devam etmeden önce `anchor test`'in hatasız ve uyarısız olarak başarıyla tamamlandığından emin olun.



Kodunuzu GitHub'a yükleyin ve
[bu dersi nasıl bulduğunuzu bize söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=aa0b56d6-02a9-4b36-95c0-a817e2c5b19d)!
