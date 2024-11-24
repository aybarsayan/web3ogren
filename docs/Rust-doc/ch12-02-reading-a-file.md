## Bir Dosya Okuma

Artık `file_path` argümanında belirtilen dosyayı okuma işlevselliği ekleyeceğiz. Öncelikle test etmek için küçük miktarda metin içeren, birden fazla satırda bazı tekrar eden kelimelerle dolu örnek bir dosyaya ihtiyaç duyuyoruz. Aşağıdaki Liste 12-3, bu iş için iyi bir seçenek olacak bir Emily Dickinson şiiri içeriyor!

:::info
Projenizin kök seviyesinde *poem.txt* adlı bir dosya oluşturun ve “Ben Hiç Kimseyim! Siz kimsiniz?” şiirini girin.
:::



```text
{{#include ../listings/ch12-an-io-project/listing-12-03/poem.txt}}
```



Metin hazır olduğunda, *src/main.rs* dosyasını düzenleyin ve dosyayı okumak için aşağıdaki gibi kod ekleyin, Liste 12-4'te gösterilmiştir.



```rust,should_panic,noplayground
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-04/src/main.rs:here}}
```



Öncelikle, dosyaları yönetmek için `std::fs`'ı getirmek üzere ilgili standart kütüphanenin bir parçasını `use` açıklamasıyla ekliyoruz.

> **Anahtar Not:**
> `main` fonksiyonunda, yeni `fs::read_to_string` ifadesi `file_path`'i alır, o dosyayı açar ve dosyanın içeriğini içeren `std::io::Result` türünde bir değer döndürür.  
> — **Etkileşimli Altyapı Prototipi**

Bundan sonra, dosya okunduktan sonra `contents` değerini yazdıran geçici bir `println!` ifadesi ekliyoruz, böylece programın şu ana kadar düzgün çalışıp çalışmadığını kontrol edebiliriz.

:::tip
> Bu kodu, ilk komut satırı argümanı olarak herhangi bir dize ile (çünkü arama kısmını henüz uygulamadık) ve ikinci argüman olarak *poem.txt* dosyası ile çalıştıralım:
:::

```console
{{#rustdoc_include ../listings/ch12-an-io-project/listing-12-04/output.txt}}
```

Harika! Kod, dosyanın içeriğini okudu ve ardından yazdırdı. Ancak kodda birkaç hata var. Şu anda, `main` fonksiyonu birden fazla sorumluluğa sahip: genel olarak, bir fonksiyon yalnızca bir fikirden sorumlu olduğunda daha net ve bakımı daha kolaydır.

:::warning
Diğer bir sorun da hataları beklediğimiz kadar iyi yönetemememizdir. Program hâlâ küçük, bu nedenle bu hatalar büyük bir sorun değil, ancak program büyüdükçe bunları temiz bir şekilde düzeltmek daha zor olacaktır.
:::

Program geliştirirken erken dönemde yeniden yapılandırmaya başlamak iyi bir uygulamadır çünkü daha az kodu yeniden yapılandırmak çok daha kolaydır. Bunu bir sonraki aşamada yapacağız.