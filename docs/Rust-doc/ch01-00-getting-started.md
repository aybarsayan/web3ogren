# Başlarken

Rust yolculuğunuza başlayalım! Öğrenilecek çok şey var, ancak her yolculuk bir yerden başlar. Bu bölümde şunları tartışacağız:

* Linux, macOS ve Windows'ta Rust'ı kurma
* `Hello, world!` yazan bir program yazma
* Rust'ın paket yöneticisi ve yapı sistemi olan `cargo` kullanımı

:::info
Rust ile çalışmaya başlamadan önce, resmi [Rust belgelendirmesi](https://doc.rust-lang.org/book/) göz atmanızı öneririm.
:::

## Rust'ı Kurma

Rust'ı sisteminize kurmak için aşağıdaki adımları takip edebilirsiniz:

1. **Rustup**'ı yükleyin. Rustup, Rust programlama dili ve ilgili araçları yönetmek için kullanılan bir araçtır.
2. Terminali açın ve şu komutu çalıştırın:

   ```sh
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

:::tip
Yükleme sırasında varsayılan ayarları kabul etmek genellikle iyi bir başlangıçtır.
:::

### `Hello, world!` Programı

Rust ile ilk programınızı yazmak için bir dosya oluşturun ve `main.rs` olarak adlandırın. Aşağıdaki kodu dosyaya yapıştırın:

```rust
fn main() {
    println!("Hello, world!");
}
```

Bu programı çalıştırmak için terminalde şu komutu kullanabilirsiniz:

```sh
cargo run
```

:::note
`cargo run` komutu, `cargo` yapı sistemini ve paket yöneticisini kullanarak projeyi derler ve çalıştırır.
:::

## Cargo Kullanımı

Rust projelerinizi oluşturmak için `cargo` kullanmanız gerekecek. Cargo, Rust'ın resmi paket yöneticisidir ve projelerinizi kolayca yönetmenizi sağlar.

:::warning
`cargo` ile çalışırken, proje dizininizin doğru olduğundan emin olun.
:::

### Proje Oluşturma

Yeni bir Rust projesi oluşturmak için terminalde aşağıdaki komutu çalıştırın:

```sh
cargo new my_project
```

Bu komutla birlikte, `my_project` adında yeni bir dizin oluşturacaktır.

:::danger
Proje dizininde çalışma yaptığınızdan emin olun, aksi halde dosyalarınız kaybolabilir.
:::