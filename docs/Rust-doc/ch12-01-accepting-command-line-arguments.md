## Komut Satırı Argümanlarını Alma

Her zamanki gibi, `cargo new` ile yeni bir proje oluşturalım. Projemizi `minigrep` olarak adlandıracağız, böylece bunu sisteminizde zaten bulunan `grep` aracından ayırt edebiliriz.

```console
$ cargo new minigrep
     Created binary (application) `minigrep` project
$ cd minigrep
```

İlk görevimiz `minigrep`'in iki komut satırı argümanını kabul etmesini sağlamak: dosya yolu ve aramak için bir dize. Yani, programımızı `cargo run` ile çalıştırmak, iki tire kullanarak sonraki argümanların `cargo` değil programımız için olduğunu belirtmek, aramak için bir dize vermek ve arama yapacağımız bir dosyanın yolunu belirtmek istiyoruz, şöyle:

```console
$ cargo run -- searchstring example-filename.txt
```

Şu anda, `cargo new` ile oluşturulan program, verdiğimiz argümanları işleyemiyor. :::info Mevcut bazı kütüphaneler, komut satırı argümanlarını kabul eden bir program yazmanıza yardımcı olabilir, ancak bu kavramı yeni öğrendiğiniz için bu yeteneği kendimiz uygulayalım.

### Argüman Değerlerini Okuma

`minigrep`'in geçirdiğimiz komut satırı argümanlarının değerlerini okuyabilmesi için Rust'ın standart kütüphanesinde sağlanan `std::env::args` fonksiyonuna ihtiyacımız var. Bu fonksiyon, `minigrep`'e geçirilen komut satırı argümanlarının bir yineleyicisidir. Yineleyicileri [Bölüm 13][ch13]'te tamamen inceleyeceğiz. Şimdilik, yineleyiciler hakkında bilmeniz gereken iki detay var: yineleyiciler bir dizi değer üretir ve bir yineleyici üzerinde `collect` metodunu çağırarak onu, yineleyicinin ürettiği tüm öğeleri içeren bir koleksiyona (örneğin bir vektöre) dönüştürebiliriz.

Aşağıdaki kod, `minigrep` programınızın geçilen herhangi bir komut satırı argümanını okumasına ve ardından değerleri bir vektörde toplamasına olanak tanır.



```rust
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-01/src/main.rs}}
```



Öncelikle `std::env` modülünü kullanabilmemiz için bir `use` ifadesiyle kapsamımıza alıyoruz. `std::env::args` fonksiyonunun iki modülde iç içe olduğunu fark edin. :::note [Bölüm 7][ch7-idiomatic-use]'de tartıştığımız gibi, istenen fonksiyon birden fazla modül içinde iç içe olduğunda, fonksiyonu değil üst modülü kapsamımıza almayı tercih ettik. Bu sayede, `std::env`'den diğer fonksiyonları kolayca kullanabiliriz. Aynı zamanda, `use std::env::args` ekleyip ardından fonksiyonu sadece `args` ile çağırmaktan daha az belirsizdir, çünkü `args`, mevcut modülde tanımlanmış bir fonksiyon gibi kolayca yanlış anlaşılabilir. 

> ### `args` Fonksiyonu ve Geçersiz Unicode
>
> `std::env::args` fonksiyonu, herhangi bir argüman geçersiz Unicode içeriyorsa panik yapar. Programınızın geçersiz Unicode içeren argümanları kabul etmesi gerekiyorsa, bunun yerine `std::env::args_os` kullanın. Bu fonksiyon, `String` değerleri yerine `OsString` değerleri üreten bir yineleyici döndürür. Basitlik açısından burada `std::env::args` kullanmayı tercih ettik çünkü `OsString` değerleri platforma göre farklılık gösterir ve `String` değerlerden daha karmaşık bir şekilde çalışılmaktadır.

`main` fonksiyonunun ilk satırında `env::args`'i çağırıyoruz ve hemen ardından yineleyiciyi, yineleyicinin ürettiği tüm değerleri içeren bir vektöre dönüştürmek için `collect` kullanıyoruz. `collect` fonksiyonunu birçok tür koleksiyon oluşturmak için kullanabiliyoruz; bu nedenle `args`'in türünü bir dize vektörü istediğimizi belirtmek için açıkça belirtiyoruz. :::tip Rust'ta türleri nadiren belirtmeniz gerekmese de, `collect` genellikle hangi tür koleksiyon istediğinizi çıkarsayamadığı için türü belirtmeniz gereken bir fonksiyondur. 

Son olarak, vektörü hata ayıklama makrosu ile yazdırıyoruz. Önce hiç argüman ile ardından da iki argüman ile bu kodu çalıştırmayı deneyelim:

```console
{{#include ../listings/ch12-an-io-project/listing-12-01/output.txt}}
```

```console
{{#include ../listings/ch12-an-io-project/output-only-01-with-args/output.txt}}
```

Vektördeki ilk değerin `"target/debug/minigrep"` olduğunu fark edin, bu da binary'mizin adıdır. Bu, C'deki argümanlar listesinin davranışıyla eşleşiyor ve programların yürütmeleri sırasında çağrıldıkları isimle kullanmalarına olanak tanıyor. :::warning Program adını mesajlarda yazdırmak veya programın davranışını, programın çağrıldığı komut satırı takma adı temelinde değiştirmek için erişiminizin olması genellikle kullanışlıdır. Ancak bu bölümün amaçları doğrultusunda, program adını göz ardı edeceğiz ve yalnızca ihtiyacımız olan iki argümanı saklayacağız.

### Argüman Değerlerini Değişkenlerde Saklama

Program şu anda komut satırı argümanları olarak belirtilen değerleri erişebiliyor. Şimdi, bu iki argümanın değerlerini değişkenlerde saklamamız gerekiyor, böylece değerleri programın geri kalanında kullanabiliriz. Bunu, Aşağıdaki Listing 12-2'de yapıyoruz.



```rust,should_panic,noplayground
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-02/src/main.rs}}
```



Vektörü yazdırdığımızda gördüğümüz gibi, programın adı vektörde `args[0]`'da ilk değeri alır, bu nedenle argümanlara indeks 1'den başlıyoruz. `minigrep`in ilk argümanı, aradığımız dizge olacağından, ilk argümanın referansını `query` değişkenine koyuyoruz. İkinci argüman dosya yolu olacağından, ikinci argümanın referansını `file_path` değişkenine koyuyoruz.

Bu değişkenlerin değerlerini, kodun istediğimiz gibi çalıştığını kanıtlamak için geçici olarak yazdırıyoruz. Bu programı tekrar `test` ve `sample.txt` argümanlarıyla çalıştıralım:

```console
{{#include ../listings/ch12-an-io-project/listing-12-02/output.txt}}
```

Harika, program çalışıyor! İhtiyacımız olan argümanların değerleri doğru değişkenlere kaydediliyor. Daha sonra, kullanıcı hiçbir argüman sağlamadığında gibi bazı potansiyel hatalı durumları ele almak için hata işleme ekleyeceğiz; şimdilik, bu durumu göz ardı edeceğiz ve dosya okuma yetenekleri eklemeye çalışacağız.

[ch13]: ch13-00-functional-features.html
[ch7-idiomatic-use]: ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#creating-idiomatic-use-paths