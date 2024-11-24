## Testlerin Nasıl Çalıştırılacağını Kontrol Etme

`targo run` kodunuzu derlediği ve sonuç olarak ikili dosyayı çalıştırdığı gibi, `cargo test` de kodunuzu test modunda derleyip sonuç olarak test ikilisini çalıştırır. `cargo test` tarafından üretilen ikilinin varsayılan davranışı, tüm testleri paralel olarak çalıştırmak ve test çalışmaları sırasında oluşturulan çıktıyı yakalamaktır; bu, çıktının görüntülenmesini engelleyerek test sonuçlarıyla ilgili çıktıyı okumayı kolaylaştırır. Ancak, bu varsayılan davranışı değiştirmek için komut satırı seçenekleri belirtebilirsiniz.

Bazı komut satırı seçenekleri `cargo test`'e gider, bazıları ise sonuçta elde edilen test ikilisine gider. Bu iki tür argümanı ayırmak için, `cargo test`'e giden argümanları listeleyip ardından `--` ayırıcıyı kullanarak test ikilisi için gidenleri sıralarsınız. `cargo test --help` komutu, `cargo test` ile kullanabileceğiniz seçenekleri gösterirken, `cargo test -- --help` komutu ise ayırıcıdan sonra kullanabileceğiniz seçenekleri gösterir.

### Testleri Paralel veya Sıralı Çalıştırma

Birden fazla testi çalıştırdığınızda, varsayılan olarak bunlar paralel olarak iş parçacıkları kullanılarak çalıştırılır; bu, işlemleri daha hızlı tamamlamanıza ve daha hızlı geri bildirim almanıza olanak tanır. 

> **Not**: Testler aynı anda çalıştığı için, testlerinizin birbirine ya da ortak bir duruma, şimdiki çalışma dizini veya ortam değişkenleri gibi, bağımlı olmadığından emin olmalısınız.

Örneğin, her bir testin diskte *test-output.txt* adlı bir dosya oluşturduğu ve bu dosyaya bazı veriler yazdığı varsayılsın. Ardından her test bu dosyadaki verileri okur ve dosyanın belirli bir değeri içerdiğini doğrular; bu değer her bir testte farklıdır. Testlerin aynı anda çalışması nedeniyle, bir test bir dosyayı başka bir test dosyayı yazarken ve okurken üzerine yazabilir. İkinci test, kodun yanlış olduğu için değil, testlerin birbirine müdahale ettiği için başarısız olacaktır. 

:::tip
Bir çözüm, her testin farklı bir dosyaya yazmasını sağlamaktır; diğer bir çözüm ise testleri birer birer çalıştırmaktır.
:::

Testleri paralel olarak çalıştırmak istemiyorsanız veya kullanılan iş parçacıklarının sayısı üzerinde daha fazla kontrol istiyorsanız, `--test-threads` bayrağını ve kullanmak istediğiniz iş parçacığı sayısını test ikilisine gönderirsiniz. Aşağıdaki örneğe bir göz atın:

```console
$ cargo test -- --test-threads=1
```

Test iş parçacığı sayısını `1` olarak ayarlıyoruz, programa paralellik kullanmamasını söylüyoruz. Testleri bir iş parçacığı kullanarak çalıştırmak, paralel çalıştırmaktan daha uzun sürecektir, ancak testler durumları paylaşırlarsa birbiriyle çelişmeyecektir.

### Fonksiyon Çıktısını Gösterme

Varsayılan olarak, bir test geçtiğinde, Rust'ın test kütüphanesi standart çıkışa basılan her şeyi yakalar. Örneğin, bir testte `println!` çağırırsak ve test geçerse, terminalde `println!` çıktısını görmeyeceğiz; yalnızca testin geçtiğini belirten satırı göreceğiz. Başarısız olursa, standart çıkışa basılan her şeyi başarısızlık mesajının geri kalanıyla birlikte göreceğiz.

Örnek olarak, aşağıdaki test listesi, parametre değerini yazdıran ve 10 döndüren komik bir fonksiyona sahip olduğu gibi, bir geçen test ve bir başarısız test içeriyor.



```rust,panics,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-10/src/lib.rs}}
```



Bu testleri `cargo test` ile çalıştırdığımızda, şu çıktıyı göreceğiz:

```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-10/output.txt}}
```

Bu çıktıda, `4 değerini aldım` ifadesinin nerede olduğunu göremiyoruz; bu, geçen test çalıştığında basılmıştır. Bu çıktı yakalanmıştır. Başarısız olan testten gelen çıktı, baştaki test özet çıktısında görünür ve aynı zamanda başarısızlığın sebebini gösterir.

Geçen testlerin basılmış değerlerini de görmek istiyorsak, Rust'a başarılı testlerin çıktısını da gösterecek şekilde `--show-output` bayrağını verebiliriz:

```console
$ cargo test -- --show-output
```

11-10. Listede tekrar testleri `--show-output` bayrağıyla çalıştırdığımızda, şu çıktıyı alırız:

```console
{{#include ../listings/ch11-writing-automated-tests/output-only-01-show-output/output.txt}}
```

### İsimle Test Alt Kümeleri Çalıştırma

Bazen, tamamen bir test takımı çalıştırmak uzun zaman alabilir. Belirli bir alanda kod üzerinde çalışıyorsanız, yalnızca o koda ait testleri çalıştırmak isteyebilirsiniz. Hangi testlerin çalıştırılacağını seçmek için `cargo test`'e çalıştırmak istediğiniz testin adını veya adlarını argüman olarak geçirebilirsiniz.

Test alt kümesini nasıl çalıştıracağımızı göstermek için, önce `add_two` fonksiyonumuz için üç test oluşturacağız; bu 11-11. Listede gösterilmiştir ve hangilerini çalıştıracağımızı seçeceğiz.



```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/listing-11-11/src/lib.rs}}
```



Argüman geçirmeden testleri çalıştırdığımızda, daha önce gördüğümüz gibi, tüm testler paralel olarak çalışır:

```console
{{#include ../listings/ch11-writing-automated-tests/listing-11-11/output.txt}}
```

#### Tek Testleri Çalıştırma

Sadece o testi çalıştırmak için, `cargo test`'e herhangi bir test fonksiyonunun adını geçirebiliriz:

```console
{{#include ../listings/ch11-writing-automated-tests/output-only-02-single-test/output.txt}}
```

Sadece `one_hundred` adlı test çalıştı; diğer iki test bu adı karşılamadı. Test çıktısı, çalışmayan daha fazla test olduğuna bizi bilgilendirir ve `2 filtered out` ifadesini sonunda gösterir.

Bu şekilde birden fazla testin adını belirtemeyiz; verilen ilk değer `cargo test` için kullanılacaktır. Ancak birden fazla testi çalıştırmanın bir yolu vardır.

#### Birden Fazla Testi Çalıştırmak için Filtreleme

Bir test adının bir bölümünü belirtebiliriz ve adı o değeri karşılayan herhangi bir test çalıştırılacaktır. Örneğin, test adlarımızdan ikisi `add` içerdiğinden, şu şekilde `cargo test add` komutunu vererek o iki testi çalıştırabiliriz:

```console
{{#include ../listings/ch11-writing-automated-tests/output-only-03-multiple-tests/output.txt}}
```

Bu komut, adı `add` içeren tüm testleri çalıştırdı ve `one_hundred` adlı testi filtreledi. Ayrıca, bir testin bulunduğu modül testin adı olduğundan, bir modül adında filtreleme yaparak modüldeki tüm testleri çalıştırabiliriz.

### Bazı Testleri Özel Olarak İstenmedikçe Yoksayma

Bazen, bazı özel testlerin çalıştırılması çok zaman alabilir, bu yüzden çoğu `cargo test` çalıştırmasında bunları hariç tutmak isteyebilirsiniz. Çalıştırmak istediğiniz tüm testleri argüman olarak listelemek yerine, zaman alıcı testleri `ignore` niteliği ile etiketleyerek hariç tutabilirsiniz:

Dosya Adı: src/lib.rs

```rust,noplayground
{{#rustdoc_include ../listings/ch11-writing-automated-tests/no-listing-11-ignore-a-test/src/lib.rs:here}}
```

`#[test]`'den sonra, dışlamak istediğimiz test için `#[ignore]` satırını ekliyoruz. Artık testlerimizi çalıştırdığımızda, `it_works` çalışacak, ancak `expensive_test` çalışmayacaktır:

```console
{{#include ../listings/ch11-writing-automated-tests/no-listing-11-ignore-a-test/output.txt}}
```

`expensive_test` fonksiyonu `ignored` olarak listelendi. Sadece yoksayılan testleri çalıştırmak istiyorsak, `cargo test -- --ignored` kullanabiliriz:

```console
{{#include ../listings/ch11-writing-automated-tests/output-only-04-running-ignored/output.txt}}
```

Hangi testlerin çalıştırılacağını kontrol ederek, `cargo test` sonuçlarının hızlı bir şekilde döneceğinden emin olabilirsiniz. Yoksayılan testlerin sonuçlarını kontrol etmenin mantıklı olduğu ve sonuçları bekleyecek zamanınız olduğunda, bunun yerine `cargo test -- --ignored` çalıştırabilirsiniz. İster yoksayılan ister yoksayıcı olmayan tüm testleri çalıştırmak istiyorsanız, `cargo test -- --include-ignored` çalıştırabilirsiniz.