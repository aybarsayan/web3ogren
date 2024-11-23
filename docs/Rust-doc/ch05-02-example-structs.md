## Bir Struct Kullanarak Örnek Program

Struct'ları ne zaman kullanmamız gerektiğini anlamak için, bir dikdörtgenin alanını hesaplayan bir program yazalım. Tekil değişkenler kullanarak başlayacağız ve ardından programı struct'lar kullanacak şekilde yeniden yapılandıracağız.

Piksellerle belirtilen bir dikdörtgenin genişliğini ve yüksekliğini alarak alanını hesaplayacak *rectangles* adında yeni bir ikili proje oluşturalım. Aşağıdaki 5-8 numaralı liste, projemizde böyle bir hesaplama yapmanın kısa bir programını gösteriyor: *src/main.rs*.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-08/src/main.rs:all}}
```



Şimdi, bu programı `cargo run` komutuyla çalıştırın:

```console
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing-05-08/output.txt}}
```

Bu kod, her boyutla `area` fonksiyonunu çağırarak dikdörtgenin alanını bulma konusunda başarılı, ancak bu kodu daha net ve okunabilir hale getirmek için daha fazlasını yapabiliriz.

:::note
Bu kodun sorunu, `area` fonksiyonunun imzasında açıktır.
:::

```rust,ignore
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-08/src/main.rs:here}}
```

`area` fonksiyonu bir dikdörtgenin alanını hesaplamak için tasarlanmıştır, ancak yazdığımız fonksiyonun iki parametresi var ve programımızda bu parametrelerin ilişkili olduğu hiç bir şey net değil. Genişlik ve yüksekliği bir arada gruplamak daha okunabilir ve daha yönetilebilir olacaktır. Bunu, 3. Bölümdeki [“Tuple Tipi”][the-tuple-type] bölümünde tartıştığımız bir şekilde yapabiliriz: tuple'lar kullanarak.

### Tuple'lar ile Yeniden Yapılandırma

Aşağıdaki 5-9 numaralı liste, tuple'lar kullanan programımızın bir başka versiyonunu göstermektedir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-09/src/main.rs}}
```



Bir açıdan, bu program daha iyidir. Tuple'lar biraz yapı eklememizi sağlar ve şimdi sadece bir argüman geçiriyoruz. Ancak başka bir açıdan, bu versiyon daha az net: tuple'lar elemanlarını adlandırmaz, bu yüzden tuple'ın parçalarına indeksle erişmemiz gerekir ve bu da hesaplamamızı daha az belirgin hale getirir.

> **Önemli Nokta**: Genişlik ve yüksekliği karıştırmak alan hesabı için önemli olmayacak, ancak eğer dikdörtgeni ekrana çizeceksek bu önemli olacaktır! `width`'in tuple indeksi `0` ve `height`'in tuple indeksi `1` olduğunu akılda tutmalıyız. Başka birinin kodumuzu kullanması durumunda bu, anlaması daha zor olacaktır. Kodumuzda verimizin anlamını iletmediğimiz için hata yapma olasılığı artar.

### Struct'lar ile Yeniden Yapılandırma: Daha Fazla Anlam Eklemek

Veriyi etiketleyerek anlam eklemek için struct'ları kullanırız. Kullandığımız tuple'ı, tümüne bir isim ve parçalara isimler vererek bir struct'a dönüştürebiliriz; bu, 5-10 numaralı listede gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-10/src/main.rs}}
```



Burada `Rectangle` adında bir struct tanımladık. Süslü parantezlerin içinde, `width` ve `height` olarak iki alan tanımladık ve her ikisi de `u32` türünde. Ardından, `main` içinde genişliği `30` ve yüksekliği `50` olan belirli bir `Rectangle` örneği oluşturduk.

:::info
`area` fonksiyonumuz artık bir parametre ile tanımlanmıştır, bu parametreye `rectangle` adını verdik ve tipi bir `Rectangle` örneğinin değiştirilemez bir borcudur. 4. Bölümde bahsettiğimiz gibi, struct'ın mülkiyetini almak yerine onu ödünç almak istiyoruz. Bu sayede, `main` mülkiyetini korur ve `rect1` üzerinde kullanmaya devam edebiliriz; bu yüzden fonksiyon imzasında `&` kullandık.
:::

`area` fonksiyonu, `Rectangle` örneğinin `width` ve `height` alanlarına erişir (bir borçlu struct örneğinin alanlarına erişmenin alan değerlerini taşımaz; bu nedenle, genellikle struct'ların borçlarını görürsünüz). Artık `area` fonksiyonu tam olarak ne anlama geldiğini söylüyor: `Rectangle`'ın alanını hesaplamak, `width` ve `height` alanlarını kullanarak. Bu, genişlik ve yüksekliğin birbiriyle ilişkili olduğunu iletir ve değerlerin adına, `0` ve `1` gibi tuple indeks değerleri yerine tanımlayıcı isimler verir. Bu netlik açısından bir kazanım.

### Türetilmiş Niteliklerle Kullanışlı İşlevsellik Eklemek

Programımızı debug ederken bir `Rectangle` örneğini yazdırmanın ve tüm alanlarının değerlerini görmenin yararlı olacağını düşündük. Aşağıdaki 5-11 numaralı liste, daha önceki bölümlerde kullandığımız [`println!` makrosunu][println] denemektedir. Ancak bu çalışmayacak.



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-11/src/main.rs}}
```



Bu kodu derlediğimizde, şu ana mesajı veren bir hata alıyoruz:

```text
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing-05-11/output.txt:3}}
```

:::warning
`println!` makrosu birçok tür formatlama yapabilir ve varsayılan olarak, süslü parantezler `println!`'e `Display` adı verilen bir formatlama kullanmasını söyler: doğrudan son kullanıcıya hitap eden çıktılar için tasarlanmıştır. Şimdiye kadar gördüğümüz ilkel türler varsayılan olarak `Display`'i uygular çünkü bir `1` veya başka herhangi bir ilkel türü kullanıcıya göstermek için tek bir yol vardır. Ancak struct'larla, `println!`'in çıktıyı nasıl formatlaması gerektiği daha az nettir çünkü daha fazla görüntüleme olasılığı vardır: Virgül ister misiniz? Süslü parantezleri yazmak ister misiniz? Tüm alanları göstermeli mi? Bu belirsizlik nedeniyle Rust, ne istediğimizi tahmin etmeye çalışmaz ve struct'ların `println!` ile kullanabileceği `Display` uygulaması yoktur.
:::

Hataları okumaya devam edersek, bu yararlı notu buluruz:

```text
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing-05-11/output.txt:9:10}}
```

Haydi deneyelim! `println!` makrosu çağrısını şimdi `println!("rect1 is {rect1:?}");` şeklinde yapacağız. Süslü parantezlerin içinde `:?` belirteci, `println!`'e `Debug` adı verilen bir çıktı formatını kullanmak istediğimizi söyler. `Debug` niteliği, yapıların değerini debug sırasında görmek için yararlı bir şekilde yazdırmamıza olanak tanır.

Bu değişiklikle kodu derleyelim. Aman Tanrım! Hala hata alıyoruz:

```text
{{#include ../listings/ch05-using-structs-to-structure-related-data/output-only-01-debug/output.txt:3}}
```

Ama yine, derleyici bize yararlı bir not veriyor:

```text
{{#include ../listings/ch05-using-structs-to-structure-related-data/output-only-01-debug/output.txt:9:10}}
```

Rust *debugging* bilgilerini yazdırma işlevselliğini sağlar, ancak bu işlevselliği struct'ımız için mevcut hale getirmek için açıkça bunu kabul etmemiz gerekir. Bunu yapmak için, struct tanımının hemen önüne `#[derive(Debug)]` dış niteliğini ekliyoruz; bu, 5-12 numaralı listede gösterilmiştir.



```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-12/src/main.rs}}
```



Artık programı çalıştırdığımızda hiçbir hata almayacağız ve şu çıktıyı göreceğiz:

```console
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing-05-12/output.txt}}
```

Güzel! En güzel çıktı değil, ancak bu örneğin tüm alanlarının değerlerini gösteriyor; bu da debug süresince kesinlikle yardımcı olacaktır. Daha büyük struct'lar için, biraz daha kolay okunur bir çıktı almak yararlıdır; bu durumlarda, `println!` dizesinde `{:?}` yerine `{:#?}` kullanabiliriz. Bu örnekte, `{:#?}` stilini kullanmak şu çıktıyı verecektir:

```console
{{#include ../listings/ch05-using-structs-to-structure-related-data/output-only-02-pretty-debug/output.txt}}
```

`Debug` formatını kullanarak bir değeri yazdırmanın bir başka yolu, [`dbg!` makrosunu][dbg] kullanmaktır. Bu makro, bir ifadenin sahipliğini alır (bu, `println!`'ın bir referans alması durumunda) ve o ifadenin bulunduğu dosya ve satır numarasını yazdırır ve ifadenin sonuç değerini gösterir, ardından bu değerin sahipliğini geri döner.

:::tip
`dbg!` makrosunu çağırmak, standart hata konsol akışına (`stderr`) yazdırır; buna karşılık `println!`, standart çıktı konsol akışına (`stdout`) yazdırır. `stderr` ve `stdout` hakkında daha fazla bilgi için [12. Bölümdeki “Standart Çıktı Yerine Standart Hata Akışına Hata Mesajları Yazma” bölümüne][err] göz atacağız.
:::

`width` alanına atanan değere ve `rect1`'deki yapının değerine ilgi duyduğumuz bir örnek:

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/no-listing-05-dbg-macro/src/main.rs}}
```

`dbg!` makrosunu `30 * scale` ifadesinin etrafına koyabiliriz ve çünkü `dbg!` ifadenin değerinin sahipliğini döndürür, `width` alanı `dbg!` çağrısının orada olmadığı gibi aynı değeri alacaktır. `dbg!` 'ın `rect1`'in sahipliğini almasını istemiyoruz, bu yüzden bir sonraki çağrıda `rect1`'in referansını kullanıyoruz. İşte bu örneğin çıktısı:

```console
{{#include ../listings/ch05-using-structs-to-structure-related-data/no-listing-05-dbg-macro/output.txt}}
```

Çıktının ilk kısmı, `30 * scale` ifadesini debug ettiğimiz *src/main.rs* dosyasının 10. satırından geldi ve sonucu `60` olarak çıktı (tam sayıların `Debug` formatı, yalnızca değerlerini yazdırmak için uygulanır). `src/main.rs` dosyasının 14. satırındaki `dbg!` çağrısı ise `Rectangle` yapısının değerini gösterir. Bu çıktı, `Rectangle` türünün güzel `Debug` formatını kullanır. `dbg!` makrosu, kodunuzun ne yaptığını anlamaya çalışırken gerçekten yararlı olabilir!

:::danger
`Debug` niteliğine ek olarak, Rust, özel türlerimize yararlı davranış ekleyebilen bir dizi nitellik verir. Bu nitelikler ve davranışları [Ek C'de][app-c] listelenmiştir. Bu niteliklerin özel davranışlarla nasıl uygulanacağını ve kendi niteliklerimizi nasıl oluşturacağımızı 10. Bölümde ele alacağız. `derive` dışında başka birçok nitelik de bulunmaktadır; daha fazla bilgi için [Rust Referansındaki “Nitelikler” bölümüne][attributes] bakın.
:::

`area` fonksiyonumuz çok spesifiktir: yalnızca dikdörtgenlerin alanını hesaplar. Bu davranışı `Rectangle` struct'ımıza daha sıkı şekilde bağlamak yararlı olacaktır çünkü başka bir tür ile çalışmaz. Bu kodu, `area` fonksiyonunu `Rectangle` türü üzerinde tanımlanmış bir `area` *metoduna* dönüştürerek nasıl yeniden yapılandırabileceğimize bakalım.

[the-tuple-type]: ch03-02-data-types.html#the-tuple-type  
[app-c]: appendix-03-derivable-traits.md  
[println]: ../std/macro.println.html  
[dbg]: ../std/macro.dbg.html  
[err]: ch12-06-writing-to-stderr-instead-of-stdout.html  
[attributes]: ../reference/attributes.html  