## Geri Dönüşü Olmayan Hatalar ve `panic!`

Bazen kodunuzda kötü şeyler olur ve buna bir şey yapamazsınız. Bu durumlarda, Rust `panic!` makrosunu sunar. Pratikte bir paniğe neden olmanın iki yolu vardır: kodumuzun paniğe neden olmasına yol açacak bir eylem gerçekleştirmek (örneğin, bir dizinin sonunu aşacak şekilde erişmek) veya `panic!` makrosunu açıkça çağırmak. Her iki durumda da programımızda bir panik oluştururuz. Varsayılan olarak, bu panikler bir hata mesajı yazdırır, yıpranır, yığın temizlenir ve program sonlanır. Bir ortam değişkeni aracılığıyla, bir panik meydana geldiğinde Rust'un çağrı yığınını göstermesini sağlayarak panik kaynağını bulmayı kolaylaştırabilirsiniz.

> ### Panic'e Yanıt Olarak Yığınların Temizlenmesi veya İptal Edilmesi
> 
> Varsayılan olarak, bir panik meydana geldiğinde program *yıpranma* sürecine girer; bu, Rust'ın yığın boyunca geri yürüyerek karşılaştığı her fonksiyondan verileri temizlediği anlamına gelir. Ancak, geri yürümek ve temizlemek çok zahmetlidir. Bu nedenle Rust, *iptal etmeyi* seçme alternatifini sunar; bu, programı temizlemeden sonlandırır.
> 
> Programın kullandığı bellek daha sonra işletim sistemi tarafından temizlenmelidir. Projenizde elde edilen ikili dosyayı mümkün olduğunca küçük yapmak istiyorsanız, *Cargo.toml* dosyanızdaki ilgili `[profile]` bölümlerine `panic = 'abort'` ekleyerek bir panik meydana geldiğinde yıpranmayı iptal etmeyi tercih edebilirsiniz. Örneğin, çıkış modunda panik sırasında iptal etmek isterseniz, şunu ekleyin:
> 
> ```toml
> [profile.release]
> panic = 'abort'
> ```

Basit bir programda `panic!` çağırmayı deneyelim:


Program Kodu



```rust,should_panic,panics
{{#rustdoc_include ../listings/ch09-error-handling/no-listing-01-panic/src/main.rs}}
```





Programı çalıştırdığınızda, şöyle bir şey görmelisiniz:

```console
{{#include ../listings/ch09-error-handling/no-listing-01-panic/output.txt}}
```

`panic!` çağrısı, son iki satırda yer alan hata mesajına neden olur. İlk satır, panik mesajımızı ve panik meydana gelen kaynak kodundaki yeri gösterir: *src/main.rs:2:5* ifadesi, bunun ikinci satırda, beşinci karakter olduğunu gösterir.

Bu durumda, belirtilen satır kodumuzun bir parçasıdır; eğer o satıra gidersek, `panic!` makrosunun çağrısını göreceğiz. Diğer durumlarda, `panic!` çağrısı kodumuzun çağırdığı bir kodda olabilir ve hata mesajıyla bildirilen dosya adı ve satır numarası, `panic!` makrosunun çağrıldığı başka birinin kodu olacaktır; bu, panik çağrısına yol açan kodumuzun satırı değildir.




`panic!` çağrısının geldiği fonksiyonların geri izini kullanarak sorun yaratan kodumuzun kısmını belirleyebiliriz. `panic!` geri izini nasıl kullanacağımızı anlamak için, kodumuzda bir hata nedeniyle bir kütüphaneden gelen `panic!` çağrısının neye benzediğine bakalım. Liste 9-1, geçerli dizinler aralığında bir indeks bulmaya çalışan bazı kodlar içermektedir.



```rust,should_panic,panics
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-01/src/main.rs}}
```



Burada, dizimizdeki 100. elemana (indeks 99'da çünkü dizinleme sıfırdan başlar) erişmeye çalışıyoruz, ancak dizimizde yalnızca üç eleman var. Bu durumda Rust panik yapacaktır. `[]` kullanmanın bir eleman döndürmesi beklenirken, geçersiz bir indeks verirseniz burada Rust'ın döndürebileceği doğru bir eleman yoktur.

:::warning
C dilinde, bir veri yapısının sonundan okumaya çalışmak tanımsız bir davranıştır. O elemanla ilgili olabilecek bellek konumundaki herhangi bir şeyi alabilirsiniz; o bellek o yapıya ait olmasa bile. Bu, *buffer overread* olarak adlandırılır ve bir saldırganın dizini öyle bir şekilde manipüle etmesi durumunda güvenlik açıklarına yol açabilir ki, bu durum verilerin okunmasına neden olur; bu veriler yapının sonrasında saklanır.
:::

Kodunuzu bu tür güvenlik açığına karşı korumak için, var olmayan bir dizindeki bir elemanı okumaya çalıştığınızda Rust, yürütmeyi durduracak ve devam etmeyi reddedecektir. Bunu deneyelim ve görelim:

```console
{{#include ../listings/ch09-error-handling/listing-09-01/output.txt}}
```

Bu hata, `v` dizisinde indeks `99` erişmeye çalıştığımız *main.rs* dosyasının 4. satırına işaret ediyor.

> *note:* Bu hata ile ilgili olayların tam geri izini almak için `RUST_BACKTRACE` ortam değişkenini ayarlayabileceğimizi söylüyor. *Geri iz* tam olarak bu noktaya ulaşmak için çağrılan tüm fonksiyonların bir listesidir. Rust'taki geri izler, diğer dillerde olduğu gibi çalışır: geri izini okumak için üstten başlayın ve yazdığınız dosyaları görene kadar okuyun. Sorunun kökeni o noktadır. O noktadan yukarıdaki satırlar, kodunuzun çağırdığı kodlardır; aşağıdaki satırlar ise kodunuzun çağrıldığı kodlardır. Bu önceden ve sonra gelen satırlar, temel Rust kodunu, standart kütüphane kodunu veya kullandığınız kütüphaneleri içerebilir. `RUST_BACKTRACE` ortam değişkenini `0` dışındaki herhangi bir değere ayarlayarak bir geri izi elde etmeyi deneyelim. Liste 9-2, göreceğiniz çıktıya benzer bir çıkış gösterir.



```console
$ RUST_BACKTRACE=1 cargo run
thread 'main' panicked at src/main.rs:4:6:
index out of bounds: the len is 3 but the index is 99
stack backtrace:
   0: rust_begin_unwind
             at /rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/std/src/panicking.rs:662:5
   1: core::panicking::panic_fmt
             at /rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/core/src/panicking.rs:74:14
   2: core::panicking::panic_bounds_check
             at /rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/core/src/panicking.rs:276:5
   3: <usize as core::slice::index::SliceIndex<[T]>>::index
             at /rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/core/src/slice/index.rs:302:10
   4: core::slice::index::<impl core::ops::index::Index<I> for [T]>::index
             at /rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/core/src/slice/index.rs:16:9
   5: <alloc::vec::Vec<T,A> as core::ops::index::Index<I>>::index
             at /rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/alloc/src/vec/mod.rs:2920:9
   6: panic::main
             at ./src/main.rs:4:6
   7: core::ops::function::FnOnce::call_once
             at /rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/core/src/ops/function.rs:250:5
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.
```



Bu çok fazla çıktı! Gördüğünüz tam çıktı, işletim sisteminize ve Rust versiyonunuza bağlı olarak farklı olabilir. Bu bilgileri içeren geri izlerini elde etmek için, hata ayıklama sembolleri etkinleştirilmelidir. Hata ayıklama sembolleri, `cargo build` veya `cargo run` komutlarını `--release` bayrağı olmadan kullandığınızda varsayılan olarak etkinleştirilir; burada olduğu gibi.

Liste 9-2'deki çıktıda, geri izdeki 6. satır, sorun yaratan projemizdeki satıra işaret eder: *src/main.rs* dosyasının 4. satırı. Programımızın panik yapmasını istemiyorsak, ilk önce yazdığımız bir dosyayı belirten satıra bakarak incelememize başlamalıyız. Liste 9-1'de kasıtlı olarak panik yapacak kod yazdığımızda, panik durumunu düzeltmenin yolunu göstermeden dizideki geçerli indeks aralığının dışına erişmemek olacaktır. Kodunuz gelecekte panik yaptığında, kodun hangi değerlerle hangi eylemi gerçekleştirdiğini ve yerine ne yapması gerektiğini belirlemeniz gerekecektir.

:::note
Geri döneceğiz `panic!` ve hata koşullarını yönetmek için ne zaman `panic!` kullanmamız gerektiğine ve ne zaman kullanmamamız gerektiğine bu bölümün ilerleyen kısımlarında [“`panic!` Yapmalı mıyız?”][to-panic-or-not-to-panic] bölümünde bakacağız. Sırada `Result` kullanarak bir hatadan nasıl kurtulacağımıza bakacağız.
::: 

[to-panic-or-not-to-panic]:
ch09-03-to-panic-or-not-to-panic.html#to-panic-or-not-to-panic