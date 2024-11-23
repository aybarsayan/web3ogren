## Cleanup'te Kod Çalıştırma `Drop` Trait'i ile

Akıllı gösterici deseninde önemli ikinci trait `Drop`'dur; bu, bir değerin kapsamdan çıkarken ne olacağını özelleştirmenizi sağlar. `Drop` trait'i herhangi bir tür için bir uygulama sağlayabilir ve bu kod, dosyalar veya ağ bağlantıları gibi kaynakların serbest bırakılması için kullanılabilir.

:::note
`Drop`'u akıllı göstericiler bağlamında tanıtıyoruz çünkü `Drop` trait'inin işlevselliği, hemen hemen her zaman bir akıllı gösterici uygulandığında kullanılır.
:::

Örneğin, bir `Box` bırakıldığında, kutunun işaret ettiği yığın alanını serbest bırakır.

Bazı dillerde, bazı türler için, programcı bu türlerin bir örneğini kullandıktan sonra her seferinde belleği veya kaynakları serbest bırakmak için kod çağrısı yapmalıdır. Dosya tanıtıcıları, soketler veya kilitler gibi örnekler bulunmaktadır. Eğer bunu unuturarlarsa, sistem aşırı yüklenip çökebilir. Rust'ta, bir değerin kapsamdan çıkarken hangi kodun çalıştırılacağını belirtebilir ve derleyici bu kodu otomatik olarak ekler. Sonuç olarak, belirli bir türde bir örneğin tamamlandığı her yerde temizleme kodunu yerleştirme konusunda dikkatli olmanıza gerek yoktur; hala kaynak sızıntısı yaşamazsınız!

:::tip
Bir değerin kapsamdan çıktığında hangi kodun çalıştırılacağını belirtmek için `Drop` trait'ini uyguluyorsunuz.
:::

`Drop` trait'i, `self` parametresi ile bir değişken referansı alan, `drop` adında bir metod uygulamanızı gerektirir. Rust'ın `drop`'u ne zaman çağırdığını görmek için, şimdilik `drop`'ı `println!` ifadeleri ile uygulayalım.

Liste 15-14, `CustomSmartPointer` yapısını gösterir; bu yapının tek özel işlevselliği, örnek kapsamdan çıktığında `Dropping CustomSmartPointer!` yazdırmasıdır, böylece Rust'ın `drop` fonksiyonunu ne zaman çalıştırdığını görebiliriz.



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-14/src/main.rs}}
```



`Drop` trait'i, önceden tanımlı bir kütüphanededir, bu nedenle onu kapsamımıza almamız gerekmez. `CustomSmartPointer` üzerinde `Drop` trait'ini uyguluyoruz ve `println!` çağrısı yapan `drop` metodunun bir uygulamasını sağlıyoruz. `drop` fonksiyonunun gövdesi, türünüzün bir örneği kapsamdan çıkarken çalıştırmak istediğiniz mantığı yerleştireceğiniz yerdir. Rust'ın `drop`'ı hangi sıradışılıkta çağırdığını görselleştirmek için burada bazı metinler yazdırıyoruz.

`main` içinde iki `CustomSmartPointer` örneği oluşturuyoruz ve ardından `CustomSmartPointers created` yazdırıyoruz. `main`'in sonunda, `CustomSmartPointer` örneklerimiz kapsamdan çıkacak ve Rust, `drop` metoduna koyduğumuz kodu çağıracak, son mesajımızı yazdıracaktır. Dikkat edin; `drop` metodunu açıkça çağırmamıza gerek yok.

:::info
Bu programı çalıştırdığımızda, aşağıdaki çıktıyı göreceğiz:
:::

```console
{{#include ../listings/ch15-smart-pointers/listing-15-14/output.txt}}
```

Rust, örneklerimiz kapsamdan çıkarken otomatik olarak bizim için `drop` çağırdı ve belirttiğimiz kodu çalıştırdı. Değişkenler, yaratıldıkları sıranın tersine bırakılır, bu nedenle `d` önce `c` bırakıldı. Bu örneğin amacı, `drop` metodunun nasıl çalıştığını size görsel bir rehber olarak sunmaktır; genellikle türünüzün çalıştırması gereken temizleme kodunu belirtirsiniz, bir yazdırma mesajı değil.

### `std::mem::drop` ile Değeri Erken Bırakma

Ne yazık ki, otomatik `drop` işlevselliğini devre dışı bırakmak kolay değildir. `drop`'ı devre dışı bırakmak genellikle gerekli değildir; `Drop` trait'inin bütün amacı, bunun otomatik olarak halledilmesidir. Ancak, bazen bir değeri erken temizlemek isteyebilirsiniz. Bir örnek, kilitleri yöneten akıllı göstericiler kullanırken olabilir: aynı kapsamda diğer kodların kilidi alabilmesi için kilidi serbest bırakan `drop` metodunu zorlamak isteyebilirsiniz. Rust, `Drop` trait'inin `drop` metodunu manuel olarak çağırmanıza izin vermez; bunun yerine, bir değeri kapsamının sonundan önce bırakmak istiyorsanız standart kütüphanede sağlanan `std::mem::drop` fonksiyonunu çağırmalısınız.

Liste 15-14'ten `main` fonksiyonunu değiştirerek `Drop` trait'inin `drop` metodunu manuel olarak çağırmaya çalıştığımızda, Liste 15-15'te görülen bir derleyici hatası alacağız:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-15/src/main.rs:here}}
```



Bu kodu derlemeye çalıştığımızda, aşağıdaki hata mesajını alırız:

```console
{{#include ../listings/ch15-smart-pointers/listing-15-15/output.txt}}
```

:::warning
Bu hata mesajı, `drop`'ı açıkça çağırmamıza izin verilmediğini belirtir. Hata mesajı, bir örneği temizleyen bir fonksiyon anlamına gelen *destructor* terimini kullanır. Bir *destructor*, bir örneği oluşturan *constructor* terimine benzer. Rust'taki `drop` fonksiyonu, belirli bir destructor'dır.
:::

Rust'ın `drop`'ı açıkça çağırmamıza izin vermemesinin nedeni, Rust'ın `main`'in sonunda değerin üzerinde otomatik olarak `drop` çağıracağıdır. Bu, Rust'ın aynı değeri iki kez temizlemeye çalışacağı için bir *double free* hatasına neden olacaktır.

:::info
Bir değerin kapsamdan çıktığında otomatik olarak `drop` eklenmesini devre dışı bırakamıyor ve `drop` metodunu açıkça çağıramıyoruz. Dolayısıyla, bir değerin erken temizlenmesini zorlamak gerektiğinde, `std::mem::drop` fonksiyonunu kullanırız.
:::

`std::mem::drop` fonksiyonu, `Drop` trait'inde yer alan `drop` metodundan farklıdır. Kullanmak istediğimiz değeri zorlamak için bir argüman olarak geçiririz. Fonksiyon önceden tanımlıdır, bu nedenle Liste 15-15'te `drop` fonksiyonunu çağırmak için `main`'i şu şekilde değiştirebiliriz: 



```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-16/src/main.rs:here}}
```



Bu kodu çalıştırmak, aşağıdakileri yazdırır:

```console
{{#include ../listings/ch15-smart-pointers/listing-15-16/output.txt}}
```

:::tip
Metin ```Dropping CustomSmartPointer with data `some data`!``` yazısı, `CustomSmartPointer created.` ve `CustomSmartPointer dropped before the end of main.` metinleri arasında yer alır; bu, `drop` metodunun `c`'yi o noktada bırakmak için çağrıldığını gösterir.
:::

Temizlemeyi rahat ve güvenli hale getirmek için `Drop` trait'i uygulamasında belirtilen kodu birçok şekilde kullanabilirsiniz: örneğin, kendi bellek yöneticinizi oluşturmak için kullanabilirsiniz! `Drop` trait'i ve Rust'ın sahiplik sistemiyle, temizleme işlemini hatırlamak zorunda kalmazsınız çünkü Rust bunu otomatik olarak yapar.

Ayrıca, hala kullanılan değerlere bir şekilde kazara temizleme yol açan sorunlar hakkında endişelenmenize gerek yoktur: her zaman geçerli olan referansları garanti eden sahiplik sistemi, `drop`'ın yalnızca değer kullanılmadığında bir kez çağrılmasını da sağlar.

---

Artık `Box`'yi ve akıllı göstericilerin bazı özelliklerini incelediğimize göre, standart kütüphanede tanımlanan birkaç başka akıllı göstericiye bakalım.