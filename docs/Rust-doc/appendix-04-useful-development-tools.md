## Ek D - Kullanışlı Geliştirme Araçları

Bu eki, Rust projesinin sağladığı bazı kullanışlı geliştirme araçlarından bahsedeceğiz. **Otomatik biçimlendirme, uyarı düzeltme yöntemleri, bir linter ve IDE'lerle entegrasyonu** inceleyeceğiz.

---

### `rustfmt` ile Otomatik Biçimlendirme

`rustfmt` aracı, kodunuzu topluluk kod stiline göre yeniden biçimlendirir. Birçok işbirlikçi proje, Rust yazarken hangi stilin kullanılacağına dair tartışmaları önlemek için `rustfmt` kullanır: herkes kodunu bu araçla biçimlendirir.

:::tip
**İpucu:** `rustfmt` ile kod stilinizi otomatik olarak düzenleyerek takım içindeki tutarlılığı artırabilirsiniz.
:::

`rustfmt`'yi yüklemek için aşağıdakileri yazın:

```console
$ rustup component add rustfmt
```

Bu komut, Rust'ın hem `rustc` hem de `cargo` sağladığı gibi, size `rustfmt` ve `cargo-fmt` verir. Herhangi bir Cargo projesini biçimlendirmek için aşağıdakileri yazın:

```console
$ cargo fmt
```

Bu komutu çalıştırmak, mevcut crate içindeki tüm Rust kodunu yeniden biçimlendirir. Bu sadece kod stilini değiştirmelidir, kodun anlamsal yapısını değil. `rustfmt` hakkında daha fazla bilgi için [belgelere][rustfmt] bakın.

[rustfmt]: https://github.com/rust-lang/rustfmt

---

### `rustfix` ile Kodunuzu Düzeltin

`rustfix` aracı, Rust kurulumları ile birlikte gelir ve net bir şekilde düzeltilecek şekilde hataları otomatik olarak düzeltebilir, bu da muhtemelen istediğiniz şeydir. Daha önce derleyici uyarıları gördüğünüz muhtemeldir. Örneğin, bu kodu düşünün:

Dosya Adı: src/main.rs

```rust
fn do_something() {}

fn main() {
    for i in 0..100 {
        do_something();
    }
}
```

Burada, `do_something` fonksiyonunu 100 kez çağırıyoruz, ancak `for` döngüsünün gövdesinde `i` değişkenini hiç kullanmıyoruz. Rust bu konuda bize uyarıda bulunur:

```console
$ cargo build
   Compiling myprogram v0.1.0 (file:///projects/myprogram)
warning: unused variable: `i`
 --> src/main.rs:4:9
  |
4 |     for i in 0..100 {
  |         ^ help: consider using `_i` instead
  |
  = note: #[warn(unused_variables)] on by default

    Finished dev [unoptimized + debuginfo] target(s) in 0.50s
```

Uyarı, `_i` ismini kullanmamızı önermektedir: alt çizgi, bu değişkenin kullanılmasa da sorun olmayacağını belirtir. Bu öneriyi otomatik olarak uygulamak için `rustfix` aracını kullanarak `cargo fix` komutunu çalıştırabiliriz:

```console
$ cargo fix
    Checking myprogram v0.1.0 (file:///projects/myprogram)
      Fixing src/main.rs (1 fix)
    Finished dev [unoptimized + debuginfo] target(s) in 0.59s
```

*src/main.rs* dosyasına tekrar baktığımızda, `cargo fix`'in kodu değiştirdiğini göreceğiz:

Dosya Adı: src/main.rs

```rust
fn do_something() {}

fn main() {
    for _i in 0..100 {
        do_something();
    }
}
```

`for` döngüsü değişkeninin adı artık `_i` ve uyarı artık görünmüyor.

:::info
**Not:** Ayrıca, `cargo fix` komutunu, kodunuzu farklı Rust sürümleri arasında geçiş yapmak için de kullanabilirsiniz. Sürümler [Ek E][editions] bölümünde ele alınmaktadır.
:::

---

### Clippy ile Daha Fazla Lint

Clippy aracı, kötü kod yazım hatalarını yakalayıp Rust kodunuzu geliştirmenizi sağlayan bir lint koleksiyonudur.

Clippy'yi yüklemek için aşağıdakileri yazın:

```console
$ rustup component add clippy
```

Clippy'nin lint'lerini herhangi bir Cargo projesinde çalıştırmak için şunları yazın:

```console
$ cargo clippy
```

Örneğin, pi gibi matematiksel bir sabitin yaklaşık değerini kullanan bir program yazdığınızı düşünün, bu program şöyle olabilir:

Dosya Adı: src/main.rs

```rust
fn main() {
    let x = 3.1415;
    let r = 8.0;
    println!("dairenin alanı {}", x * r * r);
}
```

Bu projede `cargo clippy` çalıştırdığınızda bu hatayı alırsınız:

```text
error: approximate value of `f{32, 64}::consts::PI` found
 --> src/main.rs:2:13
  |
2 |     let x = 3.1415;
  |             ^^^^^^
  |
  = note: `#[deny(clippy::approx_constant)]` on by default
  = help: consider using the constant directly
  = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#approx_constant
```

Bu hata, Rust'ın zaten daha doğru bir `PI` sabiti tanımladığını ve programınızın bu sabiti kullanırsanız daha doğru olacağını sizi bilgilendirir. **Kodunuzu `PI` sabitini kullanacak şekilde değiştirirsiniz. Aşağıdaki kod, Clippy'den hiçbir hata veya uyarı almaz:**

Dosya Adı: src/main.rs

```rust
fn main() {
    let x = std::f64::consts::PI;
    let r = 8.0;
    println!("dairenin alanı {}", x * r * r);
}
```

:::note
Clippy hakkında daha fazla bilgi için [belgelere][clippy] bakın.
:::

[clippy]: https://github.com/rust-lang/rust-clippy

---

### `rust-analyzer` Kullanarak IDE Entegrasyonu

IDE entegrasyonu için Rust topluluğu, [`rust-analyzer`][rust-analyzer] kullanmayı önermektedir. Bu araç, [Dil Sunucusu Protokolü][lsp] ile iletişim kuran derleyici merkezli araçların bir setidir. Farklı istemciler `rust-analyzer`'ı kullanabilir, örneğin [Visual Studio Code için Rust analizörü eklentisi][vscode].

[lsp]: http://langserver.org/
[vscode]: https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer

`rust-analyzer` projesinin [ana sayfasını][rust-analyzer] ziyaret edin kurulum talimatları için, ardından belirli IDE'nizde dil sunucusu desteği kurun. IDE'niz otomatik tamamlama, tanıma atlama ve satır içi hatalar gibi yetenekler kazanacaktır.

[rust-analyzer]: https://rust-analyzer.github.io
[editions]: appendix-05-editions.md