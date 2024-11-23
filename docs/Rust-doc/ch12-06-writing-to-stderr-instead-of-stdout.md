## Standart Hata Mesajlarını Standart Çıktı Yerine Standart Hata Çıktısına Yazma

Şu anda, tüm çıktılarımızı terminale `println!` makrosu kullanarak yazıyoruz. Çoğu terminalde iki tür çıktı vardır: **standart çıktı** (`stdout`) genel bilgiler için ve **standart hata** (`stderr`) hata mesajları için. Bu ayrım, kullanıcıların bir programın başarılı çıktısını bir dosyaya yönlendirmesine, ancak hata mesajlarını ekrana yazdırmasına olanak tanır.

:::info
`println!` makrosu yalnızca standart çıktıya yazdırma yeteneğine sahiptir, bu yüzden standart hata çıktısına yazdırmak için başka bir şey kullanmamız gerekiyor.
:::

### Hataların Nereye Yazıldığını Kontrol Etme

Öncelikle, `minigrep` tarafından yazdırılan içeriğin mevcut olarak standart çıktıya nasıl yazıldığını gözlemleyelim; bu, standart hata çıktısına yazmak istediğimiz herhangi bir hata mesajını da içerir. Bunu, standart çıktı akışını bir dosyaya yönlendirip kasıtlı olarak bir hata oluşturarak yapacağız. Standart hata akışını yönlendirmeyeceğiz, böylece standart hataya gönderilen her türlü içerik ekranda görünmeye devam edecek.

Komut satırı programlarının hata mesajlarını standart hata akışına göndermesi beklenir, bu yüzden standart çıktı akışını bir dosyaya yönlendirmiş olsak bile hata mesajlarını ekranda hala görebiliriz. Programımız şu anda iyi davranmıyor: Hata mesajı çıktısını dosyaya kaydettiğini göreceğiz!

Bu davranışı göstermek için, programı `>` ve yönlendirmek istediğimiz dosya yolu olan *output.txt* ile çalıştıracağız. Herhangi bir argüman geçmeyeceğiz, bu bir hataya neden olmalıdır:

```console
$ cargo run > output.txt
```

>`>` sözdizimi, shell'e standart çıktı içeriğini *output.txt* dosyasına yazmasını söyler. Ekranda gördüğümüz hata mesajını göremediğimiz için, bu mesajın dosyaya gitmiş olması gerektiği anlamına geliyor. İşte *output.txt* içeriği:

```text
Problem parsing arguments: not enough arguments
```

Evet, hata mesajımız **standart çıktıya** yazdırılıyor. Bu tür hata mesajlarının standart hata akışına yazdırılması, yalnızca başarılı bir çalışmadan gelen verilerin dosyaya girmesi için çok daha kullanışlıdır. Bunu değiştireceğiz.

### Hataları Standart Hata Çıktısına Yazdırma

Hata mesajlarının nasıl yazdırılacağını değiştirmek için 12-24 No’lu listedeki kodu kullanacağız. Bu bölümde daha önce yaptığımız yeniden yapılandırma sayesinde, hata mesajlarını yazdıran tüm kod tek bir işlevde, `main` fonksiyonunda yer alıyor. 

:::tip
Standart kütüphane, standart hata akışına yazdıran `eprintln!` makrosunu sağlıyor, bu yüzden `println!` kullandığımız iki yeri `eprintln!` kullanacak şekilde değiştireceğiz.
:::



```rust,ignore
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-24/src/main.rs:here}}
```



Şimdi, herhangi bir argüman olmaksızın ve standart çıktıyı `>` ile yönlendirerek programı tekrar çalıştıralım:

```console
$ cargo run > output.txt
Problem parsing arguments: not enough arguments
```

Artık hatayı ekranda görüyoruz ve *output.txt* içinde hiçbir şey yok; bu, komut satırı programlarının beklenen davranışıdır.

:::note
Argümanları bir hata oluşturmayacak şekilde fakat yine de standart çıktıyı bir dosyaya yönlendirerek programı tekrar çalıştıralım, şöyle:
:::

```console
$ cargo run -- to poem.txt > output.txt
```

Terminalde hiçbir çıktı görmeyeceğiz ve *output.txt* sonuçlarımızı içerecek:

Dosya Adı: output.txt

```text
Are you nobody, too?
How dreary to be somebody!
```

Bu, artık başarılı çıktı için standart çıktıyı ve uygun durumlarda hata çıktısı için standart hata akışını kullandığımızı göstermektedir.

## Özeti

Bu bölüm, şimdiye kadar öğrendiğiniz bazı ana kavramları gözden geçirdi ve Rust'ta yaygın G/Ç işlemlerinin nasıl gerçekleştirileceğini ele aldı. Komut satırı argümanları, dosyalar, ortam değişkenleri ve hataları yazdırmak için `eprintln!` makrosunu kullanarak artık komut satırı uygulamaları yazmaya hazırsınız. Önceki bölümlerdeki kavramlarla birleştirildiğinde, kodunuz iyi organize olacak, verileri uygun veri yapılarında etkili bir şekilde saklayacak, hataları güzel bir şekilde yönetecek ve iyi test edilecektir.

:::warning
Sonraki bölümde, işlevsel dillerden etkilenen bazı Rust özelliklerini keşfedeceğiz: closures ve iteratorler.
:::