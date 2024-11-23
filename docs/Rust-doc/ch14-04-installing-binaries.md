


## `cargo install` ile İkili Dosyaların Kurulumu

`cargo install` komutu, ikili crate'leri yerel olarak kurmanıza ve kullanmanıza olanak tanır. Bu, sistem paketlerinin yerini almak için tasarlanmamıştır; Rust geliştiricilerinin, [crates.io](https://crates.io/) üzerinde diğerlerinin paylaştığı araçları kurması için pratik bir yol sunar. Sadece ikili hedefleri olan paketleri kurabileceğinizi unutmayın. **_İkili hedef_**, crate'in bir *src/main.rs* dosyası varsa veya başka bir dosya ikili olarak belirtilmişse oluşturulan çalıştırılabilir programdır; kendi başına çalıştırılamayan ancak diğer programlar içinde dahil edilmek için uygun olan bir kütüphane hedefinden farklıdır. Genellikle, crate'ler bir crate'in bir kütüphane olup olmadığı, ikili hedefinin olup olmadığı veya her ikisi hakkında *README* dosyasında bilgi barındırır.

:::info
`cargo install` ile kurulan tüm ikili dosyalar, kurulum kökünün *bin* klasöründe saklanır. Eğer Rust'ı *rustup.rs* kullanarak kurduysanız ve özel bir yapılandırmanız yoksa, bu dizin *$HOME/.cargo/bin* olacaktır.
:::

Kurduğunuz programları `cargo install` ile çalıştırabilmek için bu dizinin `$PATH`'inizde olduğundan emin olun.

Örneğin, 12. Bölüm'de `grep` aracının dosyaları aramak için kullanılan `ripgrep` adında bir Rust uygulaması olduğunu belirtmiştik. `ripgrep`'i kurmak için aşağıdaki komutu çalıştırabiliriz:



```console
$ cargo install ripgrep
    Updating crates.io index
  Downloaded ripgrep v13.0.0
  Downloaded 1 crate (243.3 KB) in 0.88s
  Installing ripgrep v13.0.0
--snip--
   Compiling ripgrep v13.0.0
    Finished `release` profile [optimized + debuginfo] target(s) in 10.64s
  Installing ~/.cargo/bin/rg
   Installed package `ripgrep v13.0.0` (executable `rg`)
```

> Çıktının sondan bir önceki satırı, kurulan ikili dosyanın yerini ve adını göstermektedir; bu durumda `ripgrep` için bu ad `rg`dir. — 

Daha önce bahsedildiği gibi, kurulum dizini `$PATH`'inizde olduğu sürece, `rg --help` komutunu çalıştırabilir ve dosyaları aramak için daha hızlı, rustik bir araç kullanmaya başlayabilirsiniz!

:::warning
Kurulum dizinini `$PATH`'inizde eklemeyi unutmayın; aksi takdirde kurduğunuz programları çalıştıramazsınız.
:::