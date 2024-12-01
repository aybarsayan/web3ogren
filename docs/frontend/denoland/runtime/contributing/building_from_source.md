---
title: "Kaynaktan Deno İnşa Etme"
description: Deno'yu kaynak kodundan inşa etmek için gerekli adımlar ve ön koşullar hakkında detaylar. Bu rehber, hem Windows hem de Unix tabanlı sistemlerde derleme sürecini ele alır.
keywords: [Deno, kaynak kodu, inşa etme, Rust, Protobuf, Python 3, yazılım geliştirme]
oldUrl:
 - /runtime/references/contributing/building_from_source/
 - /runtime/manual/references/contributing/building_from_source/
---

Aşağıda Deno'yu kaynaktan nasıl inşa edeceğinize dair talimatlar bulunmaktadır. Sadece Deno kullanmak istiyorsanız, önceden derlenmiş bir yürütülebilir dosya indirebilirsiniz (daha fazla bilgi için `Başlarken` bölümüne bakın).

## Depoyu Klonlama

:::note

Deno alt modüller kullanıyor, bu nedenle `--recurse-submodules` kullanarak klonlamayı unutmayın.

:::

**Linux(Debian)**/**Mac**/**WSL**:

```shell
git clone --recurse-submodules https://github.com/denoland/deno.git
```

**Windows**:

1. [“Geliştirici Modunu Etkinleştir"](https://www.google.com/search?q=windows+enable+developer+mode)
   (aksi halde simli bağlantılar yönetici ayrıcalıkları gerektirecektir).
2. Git'in 2.19.2.windows.1 veya daha yeni bir sürümünü kullandığınızdan emin olun.
3. Checkout öncesinde `core.symlinks=true` ayarını yapın:

   ```shell
   git config --global core.symlinks true
   git clone --recurse-submodules https://github.com/denoland/deno.git
   ```

## Ön Gereksinimler

### Rust

:::note

Deno, belirli bir Rust sürümünü gerektirir. Deno diğer sürümlerde veya Rust Gecelik Sürümlerinde inşa etmeyi desteklemeyebilir. Belirli bir sürüm için gereken Rust sürümü, `rust-toolchain.toml` dosyasında belirtilmiştir.

:::

[Rust'ı Güncelleyin veya Kurun](https://www.rust-lang.org/tools/install). Rust'ın doğru bir şekilde kurulup güncellenmediğini kontrol edin:

```console
rustc -V
cargo -V
```

### Yerel Derleyiciler ve Bağlayıcılar

Deno'nun birçok bileşeni, optimize edilmiş yerel işlevleri inşa etmek için bir yerel derleyici gerektirir.

#### Linux(Debian)/WSL

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
./llvm.sh 17
apt install --install-recommends -y cmake libglib2.0-dev
```

#### Mac

Mac kullanıcılarının _XCode Komut Satırı Araçları'nın_ kurulu olması gerekir. ([XCode](https://developer.apple.com/xcode/) zaten _XCode Komut Satırı Araçları'nı içermektedir. Kurulumu yapmak için `xcode-select --install` komutunu çalıştırın.)

[CMake](https://cmake.org/) ayrıca gereklidir, ancak _Komut Satırı Araçları_ ile birlikte gelmez.

```console
brew install cmake
```

#### Mac M1/M2

Apple aarch64 kullanıcıları için `lld` kurulmalıdır.

```console
brew install llvm lld
# /opt/homebrew/opt/llvm/bin/ yolunu $PATH'e ekleyin
```

#### Windows

1. [VS Community 2019](https://www.visualstudio.com/downloads/) indirin ve "C++ ile Masaüstü Geliştirme" aracını seçerek aşağıdaki gereksinim duyulan araçları seçtiğinizden emin olun.

   - CMake için Visual C++ araçları
   - Windows 10 SDK (10.0.17763.0)
   - Test araçları ana özellikler - Derleme Araçları
   - Visual C++ ATL (x86 ve x64 için)
   - Visual C++ MFC (x86 ve x64 için)
   - C++/CLI desteği
   - VC++ 2015.3 v14.00 (v140) masaüstü için araç seti

2. “Windows için Hata Ayıklama Araçlarını” etkinleştirin.
   - "Denetim Masası" → "Programlar" → "Programlar ve Özellikler" kısmına gidin.
   - "Windows Yazılım Geliştirme Kiti - Windows 10" seçin.
   - → "Değiştir" → "Değiştir" → "Windows için Hata Ayıklama Araçları"nı kontrol edin → "Değiştir" → "Tamamla".
   - Veya kullanın:
     [Windows için Hata Ayıklama Araçları](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/)
     (Not: dosyaları indirecek, `X64 Debuggers And Tools-x64_en-us.msi` dosyasını manuel olarak kurmanız gerekiyor.)

### Protobuf Derleyicisi

Deno'yu inşa etmek için
[Protocol Buffers derleyicisi](https://grpc.io/docs/protoc-installation/) gereklidir.

#### Linux(Debian)/WSL

```sh
apt install -y protobuf-compiler
protoc --version  # Derleyici sürümünün 3+ olduğundan emin olun
```

#### Mac

```sh
brew install protobuf
protoc --version  # Derleyici sürümünün 3+ olduğundan emin olun
```

#### Windows

Windows kullanıcıları en son ikili sürümü [GitHub](https://github.com/protocolbuffers/protobuf/releases/latest) adresinden indirebilir.

## Python 3

:::note

Deno, WPT testlerini çalıştırmak için [Python 3](https://www.python.org/downloads) gerektirir. `PATH`'inizde suffix'siz bir `python`/`python.exe` bulunduğundan emin olun ve Python 3'e işaret etsin.

:::

## Deno İnşası

Deno'yu inşa etmenin en kolay yolu, V8'in önceden derlenmiş bir sürümünü kullanmaktır.

:::tip 

_WSL kullanıyorsanız, `.wslconfig` dosyasında yeterli bellek ayırdığınızdan emin olun._

:::

```console
cargo build -vv
```

Ancak, daha düşük seviyeli V8 geliştirmesi yapıyorsanız veya V8'in önceden derlenmiş sürümlerinin mevcut olmadığı bir platform kullanıyorsanız, Deno ve V8'i kaynak kodundan inşa etmeyi isteyebilirsiniz:

```console
V8_FROM_SOURCE=1 cargo build -vv
```

V8'in kaynak kodundan inşa edileceği zaman daha fazla bağımlılık olabilir. V8 inşası hakkında daha fazla bilgi için [rusty_v8'in README'sine](https://github.com/denoland/rusty_v8) bakınız.

## İnşa Etme

Cargo ile inşa edin:

```shell
# İnşa et:
cargo build -vv

# İnşa hatası mı var? En son main'i yüklediğinizden emin olun ve tekrar deneyin, veya işe yaramıyorsa şunu deneyin:
cargo clean && cargo build -vv

# Çalıştır:
./target/debug/deno run tests/testdata/run/002_hello.ts
```

## Testleri Çalıştırma

Deno, hem Rust hem de TypeScript ile yazılmış kapsamlı bir test setine sahiptir. Rust testleri inşa süreci sırasında aşağıdaki komutla çalıştırılabilir:

```shell
cargo test -vv
```

TypeScript testleri şu şekilde çalıştırılabilir:

```shell
# Tüm birim/testleri çalıştır:
target/debug/deno test -A --unstable --lock=tools/deno.lock.json --config tests/config/deno.json tests/unit

# Belirli bir testi çalıştır:
target/debug/deno test -A --unstable --lock=tools/deno.lock.json --config tests/config/deno.json tests/unit/os_test.ts
```

## Birden Fazla Kütüphane ile Çalışma

Bir değişim seti birden fazla Deno kütüphanesini kapsıyorsa, birden fazla kütüphaneyi birlikte inşa etmek isteyebilirsiniz. Gereksinim duyulan tüm kütüphaneleri bir arada checkout yapmanız önerilir. Örneğin:

```shell
- denoland/
  - deno/
  - deno_core/
  - deno_ast/
  - ...
```

Daha sonra varsayılan bağımlılık yollarını geçersiz kılmak için
[Cargo'nun patch özelliğini](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html) kullanabilirsiniz:

```shell
cargo build --config 'patch.crates-io.deno_ast.path="../deno_ast"'
```

Eğer birkaç gün boyunca bir değişim seti üzerinde çalışıyorsanız, yamanızı `Cargo.toml` dosyanıza eklemeyi tercih edebilirsiniz (değişikliklerinizi sahnelemeden önce bunu kaldırmayı unutmayın):

```sh
[patch.crates-io]
deno_ast = { path = "../deno_ast" }
```

Bu, yerel yoldan `deno_ast` kütüphanesini inşa edecek ve o sürümü kullanacak, `crates.io`'dan almak yerine.

:::warning

**Not**: Bağımlılıkların `Cargo.toml` içindeki sürümlerinin, diskinizde bulunan bağımlılık sürümleriyle eşleştiğinden emin olun.

Sürümleri denetlemek için `cargo search ` komutunu kullanın.