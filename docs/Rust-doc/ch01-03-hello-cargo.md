## Merhaba, Cargo!

Cargo, Rust'un derleme sistemi ve paket yöneticisidir. Çoğu Rust geliştiricisi, Cargo'yu Rust projelerini yönetmek için kullanır çünkü Cargo, kodunuzu derleme, kodunuzun bağımlı olduğu kütüphaneleri indirme ve bu kütüphaneleri derleme gibi birçok görevi sizin için halleder. (Kodunuzun ihtiyaç duyduğu kütüphanelere **bağımlılıklar** diyoruz.)

Şu ana kadar yazdığımız en basit Rust programları, hiç bağımlılığa sahip değildir. **"Merhaba, dünya!" projesini Cargo ile inşa etseydik, yalnızca kodunuzu derleyen Cargo'nun kısmını kullanırdık.** Daha karmaşık Rust programları yazdıkça bağımlılıklar ekleyeceksiniz ve Cargo kullanarak bir proje başlatıyorsanız, bağımlılıkları eklemek çok daha kolay olacaktır.

Rust projelerinin büyük çoğunluğu Cargo'yu kullandığı için, bu kitabın geri kalanı sizin de Cargo kullanıyormuşsunuz gibi varsaymaktadır. Cargo, resmi kurulum yöntemlerini kullanarak Rust yüklediyseniz, Rust ile birlikte kurulu gelir. Rust'ı başka bir yöntemle yüklediyseniz, aşağıdakini terminalinize yazarak Cargo'nun kurulu olup olmadığını kontrol edin:

```console
$ cargo --version
```

Bir sürüm numarası görüyorsanız, size ait! `command not found` gibi bir hata görüyorsanız, yükleme yönteminizle ilgili belgeleri kontrol ederek Cargo'yu ayrı olarak nasıl yükleyeceğinizi belirleyin.

### Cargo ile Proje Oluşturma

Cargo kullanarak yeni bir proje oluşturalım ve bunun orijinal “Merhaba, dünya!” projemizden nasıl farklı olduğunu görelim. *projects* dizinine geri dönün (veya kodunuzu saklamak için karar verdiğiniz yere). Ardından, herhangi bir işletim sisteminde aşağıdakileri çalıştırın:

```console
$ cargo new hello_cargo
$ cd hello_cargo
```

İlk komut, *hello_cargo* adında yeni bir dizin ve proje oluşturur. Projemize *hello_cargo* adını verdik ve Cargo, dosyalarını aynı isme sahip bir dizinde oluşturur.

*hello_cargo* dizinine gidin ve dosyaları listeleyin. Cargo'nun bizim için iki dosya ve bir dizin oluşturduğunu göreceksiniz: bir *Cargo.toml* dosyası ve içinde *main.rs* dosyası bulunan bir *src* dizini.

Ayrıca yeni bir Git deposu başlatmış ve bir *.gitignore* dosyası oluşturmuştur. Eğer mevcut bir Git deposu içinde `cargo new` komutunu çalıştırırsanız, Git dosyaları oluşturulmaz; bu davranışı, `cargo new --vcs=git` kullanarak geçersiz kılabilirsiniz.

:::note
Git, yaygın bir sürüm kontrol sistemidir. `cargo new` komutunu farklı bir sürüm kontrol sistemi veya hiç sürüm kontrol sistemi kullanması için `--vcs` bayrağını kullanarak değiştirebilirsiniz. Mevcut seçenekleri görmek için `cargo new --help` komutunu çalıştırın.
:::

Tercih ettiğiniz metin düzenleyicisinde *Cargo.toml* dosyasını açın. Dosya, 1-2 numaralı listedeki koda benzer görünmelidir.



```toml
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2021"

# Daha fazla anahtar ve tanımları için https://doc.rust-lang.org/cargo/reference/manifest.html adresine bakın

[dependencies]
```



Bu dosya, Cargo'nun yapılandırma formatı olan [*TOML*][toml] (*Tom'un Bariz, Minimal Dili*) formatındadır.

İlk satır, `[package]`, takip eden ifadelerin bir paketi yapılandırdığını gösteren bir bölüm başlığıdır. Bu dosyaya daha fazla bilgi eklediğimizde, diğer bölümleri ekleyeceğiz.

Sonraki üç satır, Cargo'nun programınızı derlemesi için ihtiyaç duyduğu yapılandırma bilgilerini ayarlar: isim, sürüm ve kullanılması gereken Rust sürümü. `edition` anahtarını `Ek E` bölümünde konuşacağız.

Son satır, `[dependencies]`, projenizin bağımlılıklarını listelemeniz için bir bölümün başlangıcıdır. Rust'ta, kod paketlerine *crate* denir. Bu proje için başka crate'lere ihtiyacımız yok ama 2. bölümdeki ilk projede ihtiyaç duyacağız; dolayısıyla o zaman bu bağımlılıklar bölümünü kullanacağız.

Şimdi *src/main.rs* dosyasını açın ve bir göz atın:

Dosya Adı: src/main.rs

```rust
fn main() {
    println!("Merhaba, dünya!");
}
```

Cargo, sizin için bir “Merhaba, dünya!” programı oluşturdu, tıpkı 1-1 numaralı listedeki gibi! **Şu ana kadar, projemiz ile Cargo'nun oluşturduğu proje arasındaki farklar, Cargo'nun kodu *src* dizinine yerleştirmesi ve üst dizinde bir *Cargo.toml* yapılandırma dosyası bulundurmasıdır.**

Cargo, kaynak dosyalarınızın *src* dizininde yer almasını bekler. Üst düzey proje dizini, yalnızca README dosyaları, lisans bilgileri, yapılandırma dosyaları ve kodunuzla ilgili olmayan diğer her şey için kullanılır. Cargo kullanmak, projelerinizi organize etmenize yardımcı olur. **Her şeyin bir yeri vardır ve her şey yerindedir.**

:::tip
Eğer “Merhaba, dünya!” projesinde olduğu gibi Cargo kullanmayan bir projeye başladıysanız, onu Cargo kullanan bir projeye dönüştürebilirsiniz. Proje kodunu *src* dizinine taşıyın ve uygun bir *Cargo.toml* dosyası oluşturun. Bu *Cargo.toml* dosyasını almanın kolay bir yolu, `cargo init` komutunu çalıştırmaktır; bu da otomatik olarak dosyayı oluşturacaktır.
:::

### Cargo Projesi Oluşturma ve Çalıştırma

Şimdi, “Merhaba, dünya!” programını Cargo ile derleyip çalıştırdığımızda neyin farklı olduğuna bakalım! *hello_cargo* dizininizden projenizi derlemek için aşağıdaki komutu girin:

```console
$ cargo build
   Compiling hello_cargo v0.1.0 (file:///projects/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 2.85 secs
```

Bu komut, mevcut dizininizde değil, *target/debug/hello_cargo* (veya Windows'ta *target\debug\hello_cargo.exe*) içinde bir çalıştırılabilir dosya oluşturur. Varsayılan derleme bir hata ayıklama derlemesidir, bu yüzden Cargo, ikili dosyayı *debug* adında bir dizinde saklar. Çalıştırılabilir dosyayı bu komutla çalıştırabilirsiniz:

```console
$ ./target/debug/hello_cargo # veya Windows üzerinde .\target\debug\hello_cargo.exe
Merhaba, dünya!
```

Her şey yolunda giderse, `Merhaba, dünya!` terminale yazdırılmalıdır. `cargo build` komutunu ilk kez çalıştırdığınızda, Cargo ayrıca üst düzeyde yeni bir dosya oluşturur: *Cargo.lock*. Bu dosya, projenizdeki bağımlılıkların tam sürümlerini izler. Bu projenin bağımlılıkları olmadığı için dosya biraz seyrek görünüyor. Bu dosyayı manuel olarak değiştirmeye gerek yoktur; Cargo içeriklerini sizin için yönetir.

:::warning
`cargo build` komutuyla bir projeyi derledik ve `./target/debug/hello_cargo` ile çalıştırdık, ancak tüm bu işlemi tek bir komutla `cargo run` da kullanabiliriz:
:::

```console
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.0 secs
     Running `target/debug/hello_cargo`
Merhaba, dünya!
```

`cargo run` kullanmak, `cargo build` çalıştırmak ve ardından ikili dosyanın tam yolunu kullanmayı hatırlamak zorunda kalmaktan daha uygundur, bu yüzden çoğu geliştirici `cargo run` kullanır.

Bu kez Cargo'nun `hello_cargo`'yu derlediğine dair bir çıktı görmediğimizde, Cargo dosyaların değişmediğini anladı, bu yüzden sadece ikili dosyayı çalıştırdı. Eğer kaynak kodunuzu değiştirmiş olsaydınız, Cargo projeyi çalıştırmadan önce yeniden derleyecekti ve bu çıktıyı görecektiniz:

```console
$ cargo run
   Compiling hello_cargo v0.1.0 (file:///projects/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.33 secs
     Running `target/debug/hello_cargo`
Merhaba, dünya!
```

Cargo'nun ayrıca `cargo check` adlı bir komutu vardır. Bu komut, kodunuzu derleyip derlemediğini hızlı bir şekilde kontrol eder, ancak çalıştırılabilir bir dosya üretmez:

```console
$ cargo check
   Checking hello_cargo v0.1.0 (file:///projects/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.32 secs
```

Neden bir çalıştırılabilir dosya istemeyesiniz? Çoğunlukla, `cargo check`, bir çalıştırılabilir dosya üretme adımını atladığı için `cargo build` komutundan çok daha hızlıdır. Kodu yazarken sürekli olarak işlemlerinizi kontrol ediyorsanız, `cargo check` kullanmak, projenizin hala derlenip derlenmediğini öğrenme sürecini hızlandırır! **Bu nedenle, birçok Rust geliştiricisi, programlarını yazarken aralıklarla `cargo check` çalıştırır ve çalıştırılabilir dosyayı kullanmaya hazır olduklarında `cargo build` çalıştırır.**

### Şimdiye Kadar Öğrendiklerimiz

Şimdiye kadar Cargo hakkında öğrendiklerimizi özetleyelim:

- `cargo new` kullanarak bir proje oluşturabiliriz.
- `cargo build` kullanarak bir projeyi derleyebiliriz.
- `cargo run` kullanarak bir projeyi tek adımda derleyip çalıştırabiliriz.
- `cargo check` kullanarak hataları kontrol etmek için bir ikili dosya oluşturmadan derleyebiliriz.
- Derleme sonucunu kodumuzla aynı dizinde saklamak yerine Cargo, *target/debug* dizininde saklar.

Cargo kullanmanın bir diğer avantajı da, komutların hangi işletim sisteminde çalışırsanız çalışın aynı olmasıdır. Bu nedenle, bu noktada Linux ve macOS ile Windows için özel talimatlar vermeyeceğiz.

### Yayın için Derleme

Projeniz nihayet yayın için hazır olduğunda, `cargo build --release` komutunu kullanarak onu optimize edilmiş bir şekilde derleyebilirsiniz. Bu komut, *target/release* içinde bir çalıştırılabilir dosya oluşturur, *target/debug* yerine. Optimizasyonlar, Rust kodunuzun daha hızlı çalışmasını sağlarken, bunları etkinleştirmek, programınızın derlenme süresini uzatır. Bu nedenle, geliştirme sırasında hızlı ve sık yeniden derleme isteği için bir profil, bir de kullanıcıya vermek istediğiniz son program için başka bir profil vardır; bu profil, yeniden derlenmeyecek ve mümkün olduğunca hızlı çalışacaktır. Kodu çalıştırma süresini ölçüyorsanız, `cargo build --release` komutunu çalıştırın ve *target/release* içindeki çalıştırılabilir dosyayla ölçüm yapın.

### Cargo’nun Alışkanlık Olarak Kullanımı

Basit projelerde, Cargo'nun yalnızca `rustc` kullanmaktan daha fazla değer sunduğu görülmüyor, ancak programlarınız daha karmaşık hale geldikçe değeri kanıtlayacaktır. Programlar birden fazla dosyaya veya bir bağımlılığa ihtiyaç duyduğunda, Cargo'nun derlemeyi koordine etmesi çok daha kolaydır.

> **Not:** `hello_cargo` projesi basit olmasına rağmen, şimdi Rust kariyerinizin geri kalanında kullanacağınız birçok gerçek aracı kullanıyor. Aslında, mevcut projeler üzerinde çalışmak için kodu Git kullanarak kontrol etmek, o projeye geçmek ve derlemek için şu komutları kullanabilirsiniz:

```console
$ git clone example.org/someproject
$ cd someproject
$ cargo build
```

Cargo hakkında daha fazla bilgi için [belgelere][cargo] göz atabilirsiniz.

## Özet

Rust yolculuğunuzda harika bir başlangıç yaptınız! Bu bölümde şunları öğrendiniz:

- `rustup` kullanarak en son kararlı Rust sürümünü yüklemek
- Daha yeni bir Rust sürümüne güncellemek
- Yerel olarak yüklenmiş belgelere erişmek
- `rustc` kullanarak doğrudan bir “Merhaba, dünya!” programı yazmak ve çalıştırmak
- Cargo'nun alışkanlıkları ile yeni bir proje oluşturmak ve çalıştırmak

Bu, daha kapsamlı bir program inşa etmek ve Rust kodu yazmayı ve okumayı öğrenmek için harika bir zamandır. **Bu nedenle, 2. bölümde bir tahmin oyunu programı yapacağız.** Rust'taki yaygın programlama kavramlarının nasıl çalıştığını öğrenmeye başlamak isterseniz, 3. bölüme bakın ve sonra 2. bölüme geri dönün.

[installation]: ch01-01-installation.html#installation
[toml]: https://toml.io
[appendix-e]: appendix-05-editions.html
[cargo]: https://doc.rust-lang.org/cargo/