## Kurulum

İlk adım Rust'ı kurmaktır. Rust'ı, Rust sürümlerini ve ilgili araçları yönetmek için kullanılan `rustup` adındaki komut satırı aracını kullanarak indireceğiz. **İndirme için bir internet bağlantısına ihtiyacınız olacak.**

> Not: Eğer bir sebepten dolayı `rustup` kullanmak istemiyorsanız, [Diğer Rust Kurulum Yöntemleri sayfasına][otherinstall] bakabilirsiniz.

Aşağıdaki adımlar, Rust derleyicisinin en son kararlı sürümünü kurar. **Rust'ın kararlılığı**, kitapta derlenebilen tüm örneklerin, daha yeni Rust sürümleri ile derlenmeye devam edeceğini garanti eder. Çıktılar, Rust zaman zaman hata mesajları ve uyarıları geliştirirse sürümler arasında biraz farklılık gösterebilir. Diğer bir deyişle, bu adımları kullanarak yüklediğiniz her yeni, kararlı Rust sürümü, bu kitabın içeriği ile beklenildiği gibi çalışacaktır.

> ### Komut Satırı Notasyonu
>
> Bu bölümde ve kitap boyunca, terminalde kullanılan bazı komutları göstereceğiz. Terminalde girmeniz gereken satırlar hep `$` ile başlar. `$` karakterini yazmanıza gerek yoktur; bu, her komutun başlangıcını belirtmek için gösterilen komut satırı istemidir. `$` ile başlamayan satırlar genellikle önceki komutun çıktısını gösterir. Ayrıca, PowerShell'e özgü örnekler `$` yerine `>` kullanacaktır.

### Linux veya macOS'ta `rustup` Kurulumu

Linux veya macOS kullanıyorsanız, bir terminal açın ve aşağıdaki komutu girin:

```console
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Bu komut, bir betik indirir ve `rustup` aracının en son kararlı Rust sürümünü kurmaya başlamasını sağlar. Şifrenizi girmeniz istenebilir. Kurulum başarılı olursa, aşağıdaki satır görünecektir:

```text
Rust is installed now. Great!
```

:::note
Ayrıca, Rust'ın derlenmiş çıktıları tek bir dosyada birleştirmek için kullandığı bir *linker* programına ihtiyacınız olacak. Muhtemelen zaten bir tane vardır. Linker hataları alıyorsanız, genellikle bir linker içeren bir C derleyicisi yüklemelisiniz. C derleyicisi, bazı yaygın Rust paketlerinin C koduna bağımlı olması nedeniyle de yararlıdır.
:::

macOS'ta bir C derleyicisi edinmek için şu komutu çalıştırabilirsiniz:

```console
$ xcode-select --install
```

Linux kullanıcıları genellikle dağıtımlarının belgelerine göre GCC veya Clang yüklemelidir. Örneğin, Ubuntu kullanıyorsanız, `build-essential` paketini kurabilirsiniz.

### Windows'ta `rustup` Kurulumu

Windows'ta [https://www.rust-lang.org/tools/install][install] adresine gidin ve Rust'ı kurmak için talimatları izleyin. Kurulumun bir noktasında, Visual Studio'yu kurmanız istenecek. **Bu**, programları derlemek için gerekli olan bir linker ve yerel kütüphaneleri sağlar. Bu adımda daha fazla yardıma ihtiyacınız varsa, [https://rust-lang.github.io/rustup/installation/windows-msvc.html][msvc] adresine bakın.

:::tip
Bu kitabın geri kalanı, *cmd.exe* ve PowerShell'de çalışan komutlar kullanır. Belirli farklılıklar varsa, hangi komutun kullanılacağını açıklayacağız.
:::

### Sorun Giderme

Rust'ın doğru bir şekilde kurulu olup olmadığını kontrol etmek için bir shell açın ve bu satırı girin:

```console
$ rustc --version
```

En son kararlı sürümün sürüm numarasını, commit hash'ini ve commit tarihini aşağıdaki formatta görmelisiniz:

```text
rustc x.y.z (abcabcabc yyyy-mm-dd)
```

> Eğer bu bilgiyi görüyorsanız, Rust'ı başarıyla kurmuşsunuzdur! Eğer bu bilgiyi görmüyorsanız, Rust'ın `%PATH%` sistem değişkeninizde olup olmadığını kontrol edin.
> — Rust Kurulumu Kontrolü

Windows CMD'de kullanın:

```console
> echo %PATH%
```

PowerShell'de kullanın:

```powershell
> echo $env:Path
```

Linux ve macOS'ta kullanın:

```console
$ echo $PATH
```

Her şey doğruysa ve Rust hala çalışmıyorsa, yardım alabileceğiniz birçok yer vardır. **Diğer Rustaceans** (kendimize verdiğimiz komik bir lakap) ile nasıl iletişime geçeceğinizi [topluluk sayfasında][community] öğrenebilirsiniz.

### Güncelleme ve Kaldırma

:::info
`rustup` aracılığıyla Rust yüklendikten sonra, yeni bir sürüme güncellemek kolaydır. Shell'inizden aşağıdaki güncelleme betiğini çalıştırın:
:::

```console
$ rustup update
```

Rust'ı ve `rustup`'ı kaldırmak için shell'inizden aşağıdaki kaldırma betiğini çalıştırın:

```console
$ rustup self uninstall
```

### Yerel Belgeler

Rust'ın kurulumu, çevrimdışı okuyabilmeniz için yerel bir belge kopyasını da içerir. Yerel belgeleri tarayıcınızda açmak için `rustup doc` komutunu çalıştırın.

:::tip
Standart kütüphane tarafından sağlanan herhangi bir tür veya işlevi bilmiyorsanız veya nasıl kullanılacağını bilmiyorsanız, ne yaptığını veya nasıl kullanılacağını öğrenmek için uygulama programlama arayüzü (API) belgelerini kullanın!
:::

[otherinstall]: https://forge.rust-lang.org/infra/other-installation-methods.html
[install]: https://www.rust-lang.org/tools/install
[msvc]: https://rust-lang.github.io/rustup/installation/windows-msvc.html
[community]: https://www.rust-lang.org/community