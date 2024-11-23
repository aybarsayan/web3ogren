## Merhaba, Dünya!

Rust'ı kurduğunuza göre, ilk Rust programınızı yazma zamanı. Yeni bir dil öğrenirken geleneksel olarak, ekrana `Hello, world!` metnini yazdıran küçük bir program yazılır, bu yüzden burada da aynı şeyi yapacağız!

> **Not:** Bu kitap, komut satırıyla temel bir aşinalık varsayar. Rust, düzenleme veya araçlarınızla ilgili özel talepler içermez, bu yüzden komut satırı yerine entegre bir geliştirme ortamı (IDE) kullanmayı tercih ediyorsanız, en sevdiğiniz IDE'yi kullanmaktan çekinmeyin. Birçok IDE şimdi Rust desteği sağlıyor; ayrıntılar için IDE'nin belgelerine bakın. Rust ekibi, `rust-analyzer` aracılığıyla **harika IDE desteği** sağlamak için çalıştı. Daha fazla bilgi için [Ek D][devtools] bölümüne bakın.

### Bir Proje Dizini Oluşturma

Rust kodunuzu saklamak için bir dizin oluşturarak başlayacaksınız. Rust için kodunuzun nerede bulunduğu önemli değil, ancak bu kitapta yapılacak alıştırmalar ve projeler için ana dizininizde bir *projects* dizini oluşturmanızı ve tüm projelerinizi burada tutmanızı öneriyoruz.

Bir terminal açın ve *projects* dizinini ve *projects* dizini içinde “Hello, world!” projesi için bir dizin oluşturmak üzere aşağıdaki komutları girin.

**Linux, macOS ve Windows'un PowerShell'i için:**

```console
$ mkdir ~/projects
$ cd ~/projects
$ mkdir hello_world
$ cd hello_world
```

**Windows CMD için:**

```cmd
> mkdir "%USERPROFILE%\projects"
> cd /d "%USERPROFILE%\projects"
> mkdir hello_world
> cd hello_world
```

### Bir Rust Programı Yazma ve Çalıştırma

Sonraki adımda, yeni bir kaynak dosyası oluşturun ve adını *main.rs* koyun. Rust dosyaları her zaman *.rs* uzantısıyla biter. Dosya adınızda birden fazla kelime kullanıyorsanız, kelimeleri ayırmak için **alt çizgi kullanma** kuralı vardır. Örneğin, *hello_world.rs* yerine *helloworld.rs* kullanmayın.

Artık oluşturduğunuz *main.rs* dosyasını açın ve aşağıdaki kodu girin.


Listing 1-1: Ekrana `Hello, world!` yazdıran bir program

```rust
fn main() {
    println!("Hello, world!");
}
```



Dosyayı kaydedin ve *~/projects/hello_world* dizinindeki terminal penceresine geri dönün. Linux veya macOS'ta dosyayı derlemek ve çalıştırmak için aşağıdaki komutları girin:

```console
$ rustc main.rs
$ ./main
Hello, world!
```

Windows'ta `./main` yerine `.\main.exe` komutunu girin:

```powershell
> rustc main.rs
> .\main.exe
Hello, world!
```

Hangi işletim sistemini kullandığınızdan bağımsız olarak, `Hello, world!` dizesi terminale yazdırılmalıdır. Eğer bu çıktıyı görmüyorsanız, yardım almak için [“Sorun Giderme”][troubleshooting] bölümüne geri dönün.

> **Tebrikler!** Eğer `Hello, world!` yazdırıldıysa, resmen bir Rust programı yazdınız. Bu, sizi bir Rust programcısı yapar—**hoş geldiniz!**

### Bir Rust Programının Anatomisi

Bu “Hello, world!” programını daha ayrıntılı gözden geçirelim. İlk olarak parçanın bir kısmı şudur:

```rust
fn main() {

}
```

Bu satırlar `main` adında bir fonksiyonu tanımlar. `main` fonksiyonu özeldir: her yürütülebilir Rust programında çalışan ilk koddur.  Burada, ilk satır, parametre almayan ve hiçbir şey döndürmeyen `main` adında bir fonksiyonu tanımlar. Eğer parametreler olsaydı, parantezlerin `()` içinde yer alırdı.

Fonksiyon gövdesi `{}` ile sarılmıştır. Rust, tüm fonksiyon gövdelerinin etrafında süslü parantezler gerektirir. Açılış süslü parantezi, fonksiyon tanımıyla aynı satıra koymak ve arasına bir boşluk eklemek iyi bir tarzdır.

> **Not:** Rust projeleri arasında standart bir stilde kalmak istiyorsanız, kodunuzu belirli bir stilde biçimlendirmek için `rustfmt` adlı bir otomatik biçimlendirme aracını kullanabilirsiniz (daha fazla bilgi için [Ek D][devtools]). Rust ekibi, bu aracı standart Rust dağıtımıyla birlikte dahil etmiştir, dolayısıyla bilgisayarınızda zaten yüklü olmalıdır!

`main` fonksiyonunun gövdesinde aşağıdaki kod yer almaktadır:

```rust
    println!("Hello, world!");
```

Bu satır, bu küçük programda **tüm işi yapar**: metni ekrana yazdırır. Burada dikkat edilmesi gereken dört önemli detay vardır:

1. Rust tarzı dört boşluk ile boşluk bırakmaktır, sekme değil.
2. `println!` bir Rust makrosunu çağırır. Eğer bir fonksiyonu çağırıyorsa, `println` (sonundaki `!` olmadan) olarak girilecektir. Rust makrolarını 20. Bölümde daha ayrıntılı olarak ele alacağız. Şu an için `!` kullandığınızda, normal bir fonksiyonu değil de bir makroyu çağırdığınızı bilmeniz yeterlidir ve makrolar her zaman fonksiyonlar ile aynı kurallara uymayabilir.
3. `"Hello, world!"` dizesini görüyorsunuz. Bu dizeyi `println!`'e bir argüman olarak geçiriyoruz ve dize ekrana yazdırılıyor.
4. Satırı bir noktalı virgül (`;`) ile bitiriyoruz; bu da bu ifadenin sona erdiğini ve bir sonrakinin başlamaya hazır olduğunu gösterir. Rust kodunun çoğu satırı noktalı virgül ile sona erer.

### Derleme ve Çalıştırma Ayrı Aşamalardır

Yeni oluşturduğunuz bir programı çalıştırdınız, şimdi sürecin her adımını inceleyelim.

Bir Rust programını çalıştırmadan önce, Rust derleyicisini kullanarak derlemelisiniz. Bunu yapmak için `rustc` komutunu girip kaynak dosyanızın adını geçmelisiniz, şu şekilde:

```console
$ rustc main.rs
```

Eğer C veya C++ geçmişiniz varsa, bunun `gcc` veya `clang` ile benzer olduğunu göreceksiniz. Başarılı bir şekilde derlendikten sonra, Rust bir ikili yürütülebilir dosya çıkartır.

Linux, macOS ve Windows'un PowerShell'i için, kabuğunuzda `ls` komutunu girerek yürütülebilir dosyayı görebilirsiniz:

```console
$ ls
main  main.rs
```

Linux ve macOS'ta iki dosya göreceksiniz. Windows'un PowerShell'indeyseniz, CMD kullanıyorken göreceğiniz aynı üç dosyayı göreceksiniz. Windows CMD'de ise aşağıdaki komutu girersiniz:

```cmd
> dir /B %= /B seçeneği sadece dosya adlarını gösterir =%
main.exe
main.pdb
main.rs
```

Bu, *.rs* uzantılı kaynak kodu dosyasını, yürütülebilir dosyayı (*main.exe* Windows'ta, ancak diğer platformlarda *main*) ve Windows kullanırken *.pdb* uzantılı hata ayıklama bilgilerini içeren bir dosyayı gösterir. Buradan *main* veya *main.exe* dosyasını çalıştırırsınız, şu şekilde:

```console
$ ./main # veya Windows'ta .\main.exe
```

Eğer *main.rs* “Hello, world!” programınızsa, bu satır `Hello, world!` mesajını terminalinize yazdırır.

> **Not:** Ruby, Python veya JavaScript gibi dinamik bir dille daha fazla aşina iseniz, bir programı derleme ve çalıştırmanın ayrı aşamalar olduğunu görmeye alışkın olmayabilirsiniz. Rust, *önceden derlenmiş* bir dildir, yani bir programı derleyip yürütülebilir dosyayı başkasına verebilir ve bu kişi, Rust kurulu olmadan bile programı çalıştırabilir. Eğer birine *.rb*, *.py* veya *.js* dosyası verirseniz, sırasıyla Ruby, Python veya JavaScript uygulamasının kurulu olması gerekir. Ancak bu dillerde, programınızı derlemek ve çalıştırmak için sadece bir komut yeterlidir. Tüm bunlar dil tasarımındaki bir takas meselesidir.

Sadece `rustc` ile derlemek, basit programlar için iyidir ancak projeniz büyüdükçe, tüm seçenekleri yönetmek ve kodunuzu paylaşmayı kolaylaştırmak isteyeceksiniz. Şimdi, gerçek dünya Rust programları yazmanıza yardımcı olacak Cargo aracını tanıtacağız.

[troubleshooting]: ch01-01-installation.html#troubleshooting  
[devtools]: appendix-04-useful-development-tools.html