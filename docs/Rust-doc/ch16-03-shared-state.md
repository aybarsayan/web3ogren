## Paylaşılan Durum Eşzamanlılığı

Mesaj iletimi, eşzamanlılığı yönetmenin iyi bir yoludur, ancak tek yol değildir. Başka bir yöntem, birden fazla iş parçacığının aynı paylaşılan verilere erişmesi olabilirdi. Go dilinin belgelerinden gelen bu sloganı tekrar düşünelim: “belleği paylaşarak iletişim kurmayın.”

:::note  
Belleği paylaşarak iletişim kurmak neye benzeyecek? Ayrıca, neden mesaj iletimine meraklı olanlar bellek paylaşımını kullanmamaları konusunda uyarıyorlar?
:::

Bir şekilde, herhangi bir programlama dilindeki kanallar, tek sahipliğe benzer, çünkü bir değeri bir kanaldan geçirdiğinizde, o değeri bir daha kullanmamalısınız. Paylaşılan bellek eşzamanlılığı, çoklu sahiplik gibidir: birden fazla iş parçacığı aynı bellek konumuna aynı anda erişebilir. 15. Bölümde, akıllı işaretçilerin çoklu sahipliği mümkün kıldığını gördünüz; çoklu sahiplik, bu farklı sahiplerin yönetilmesini gerektirdiğinden karmaşıklık katabilir. Rust’ın tür sistemi ve sahiplik kuralları, bu yönetimi doğru bir şekilde sağlamada büyük yardımcıdır. 

Bir örnek olarak, paylaşılan bellek için, daha yaygın eşzamanlılık ilkerinden biri olan mutexlere bakalım.

---

### Bir İş Parçacığına Aynı Anda Erişim İçin Mutex Kullanma

*Mutex*, *karşılıklı dışlama* için bir kısaltmadır; bir mutex, bir iş parçacığının belirli bir veri parçasına herhangi bir zamanda sadece bir kez erişmesine izin verir. Bir mutex’deki verilere erişmek için, bir iş parçacığı önce mutex’in *kilidini* almak istediğini belirterek sinyal vermelidir. Kilit, veri üzerinde kimin şu anda tekil erişime sahip olduğunu takip eden mutex’in bir veri yapısıdır. Bu nedenle, mutex, sahip olduğu veriyi kilitleme sistemi aracılığıyla *koruyarak* tarif edilir.

:::warning  
Mutexler, kullanılması zor olarak bilinir çünkü iki kuralı hatırlamanız gerekir:
- Veriyi kullanmadan önce kilidi almaya çalışmalısınız.
- Mutex’in koruduğu veriyi kullandıktan sonra, diğer iş parçacıklarının kilidi alabilmesi için veriyi kilidini açık bırakmalısınız.
:::

Gerçek dünya benzetimi olarak bir mutex için, yalnızca bir mikrofon olan bir konferans panel tartışmasını hayal edin. Bir panelist konuşmadan önce, mikrofonu kullanmak istediğini sormalı veya sinyal vermelidir. Mikrofonu aldığında, istediği kadar konuşabilir ve daha sonra mikrofonu konuşmak isteyen bir sonraki paneliste devredebilir. Eğer bir panelist, mikrofonu bitirdiğinde devretmeyi unutursa, başka kimse konuşamaz. Paylaşılan mikrofonun yönetiminde yanlışlık olursa, panel planlandığı gibi çalışmaz!

:::tip  
Mutex’lerin yönetimi oldukça zordur; bu nedenle birçok insan kanallar konusunda heyecanlıdır. Ancak, Rust’ın tür sistemi ve sahiplik kuralları sayesinde, kilit alma ve bırakmada yanlış yapamazsınız.
:::

---

#### `Mutex` API'sı

Bir mutex nasıl kullanılacağına dair bir örnek olarak, basitlik açısından tek iş parçacıklı bir bağlamda bir mutex kullanmaya başlayalım; bu, 16-12 No'lu Listingde gösterilmiştir:

` API’sini keşfetmek için basitlik">

```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-12/src/main.rs}}
```



Birçok türde olduğu gibi, `Mutex`’yi ilişkili `new` fonksiyonunu kullanarak oluştururuz. Mutex içindeki verilere erişmek için, kilidi almak için `lock` metodunu kullanırız. Bu çağrı, mevcut iş parçacığını engelleyecek, bu da kilidi almak sırası gelene kadar çalışmasına izin vermeyecektir.

:::info  
`lock` çağrısı, kilidi tutan başka bir iş parçacığı paniklediğinde başarısız olacak. Böyle bir durumda kimse kilidi alamaz, bu nedenle bu duruma sahipseniz, bu iş parçacığı panik yapması için `unwrap` kullanmayı seçtik.
:::

Kilidi aldıktan sonra, bu durumda `num` adındaki dönen değeri, içerideki veriye işaret eden bir değiştirilebilir referans olarak ele alabiliriz. Tür sistemi, `m` içindeki değeri kullanmadan önce bir kilit almayı sağlamaktadır. `m`’nin türü `Mutex`, `i32` değildir, dolayısıyla `i32` değerini kullanabilmek için *kesinlikle* `lock` çağrısı yapmalıyız. Unutamayız; tür sistemi başka türlü içteki `i32`’ye erişmemize izin vermez.

Tahmin edebileceğiniz gibi, `Mutex` bir akıllı işaretçidir. Daha doğru bir deyişle, `lock` çağrısı *şu* an `MutexGuard` adlı bir akıllı işaretçi döndürmektedir; bu, `unwrap` çağrısı ile işlediğimiz bir `LockResult` ile sarmalanmıştır. `MutexGuard` akıllı işaretçisi, iç verimize işaret eden `Deref` implementasyonuna sahiptir; akıllı işaretçide ayrıca bir `Drop` implementasyonu bulunur; bu, bir `MutexGuard` kapsamdan çıktığında kilidi otomatik olarak serbest bırakır; bu da iç kapsamın sonunda gerçekleşir. Sonuç olarak, kilidi serbest bırakmayı unutarak diğer iş parçacıları tarafından mutex'in kullanılmasını engelleme riski taşımıyoruz, çünkü kilidin serbest bırakılması otomatik olarak gerçekleşir.

Kilidi serbest bıraktıktan sonra, mutex değerini yazdırabiliriz ve içteki `i32` değerini 6'ya değiştirebildiğimizi görebiliriz.

---

#### Çoklu İş Parçacıkları Arasında `Mutex` Paylaşma

Şimdi, `Mutex` kullanarak çoklu iş parçacıkları arasında bir değeri paylaşmayı deneyelim. 10 iş parçacığı başlatalım ve her birinin bir sayaç değerini 1 artırmasını sağlayalım; bu nedenle sayaç 0'dan 10'a çıkacaktır. Aşağıdaki 16-13 No'lu Listingdeki örnek, bir derleyici hatası verecek ve bu hatayı kullanarak `Mutex` kullanımı hakkında daha fazla bilgi edineceğiz ve Rust’ın bu konuda nasıl yardımcı olduğunu keşfedeceğiz.

` tarafından korunan sayacı artıran on iş parçacığı">

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-13/src/main.rs}}
```



Sayaç değişkenini, 16-12 No'lu Listingdeki gibi bir `Mutex` içine yerleştirecek şekilde oluşturuyoruz. Ardından, bir sayı aralığı üzerinde yineleme yaparak 10 iş parçacığı oluşturuyoruz. `thread::spawn` kullanıyor ve tüm iş parçacıklarına aynı closure'ı veriyoruz: bu closure, sayacı iş parçacığına geçiyor, `lock` metodunu çağırarak `Mutex` üzerindeki kilidi alıyor ve ardından mutex içindeki değere 1 ekliyor. Bir iş parçacığı closure'ını çalıştırmayı bitirdiğinde, `num` kapsamdan çıkacak ve başka bir iş parçacığının kilidi alabilmesi için kilidi serbest bırakacaktır.

Ana iş parçacığında, tüm birleştirme tutucularını topluyoruz. Ardından, 16-2 No'lu Listingde yaptığımız gibi, tüm iş parçacıklarının tamamlandığından emin olmak için her tutucuda `join` çağrısını yapıyoruz. Bu noktada, ana iş parçacığı kilidi alacak ve bu programın sonucunu yazdıracaktır.

Bu örneğin derlenmeyeceğini ima etmiştik. Şimdi nedenini bulalım!

```console
{{#include ../listings/ch16-fearless-concurrency/listing-16-13/output.txt}}
```

Hata mesajı, `counter` değerinin döngünün bir önceki yinelemesinde taşındığını belirtmektedir. Rust, sahipliği `counter` değişkenini birden fazla iş parçacığına taşımamıza izin vermediğini ifade ediyor. Derleyici hatasını, 15. Bölümde tartıştığımız çoklu sahiplik yöntemi ile düzeltelim.

---

#### Çoklu İş Parçacıkları ile Çoklu Sahiplik

15. Bölümde, akıllı işaretçi `Rc` kullanarak bir değeri birden fazla sahibimiz olacağını göstermiştik. Bunu burada da yapalım ve ne olacağını görelim. `Mutex`'yi `Rc` içine sarmalayarak 16-14 No'lu Listingde `Rc`'yi klonlayıp sonra sahipliği iş parçacığına geçireceğiz.

`yi sahiplenmesine izin vermek için `Rc` kullanmaya çalışmak">

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-14/src/main.rs}}
```



Tekrar derleyip... farklı hatalar alıyoruz! Derleyici bize çok şey öğretiyor.

```console
{{#include ../listings/ch16-fearless-concurrency/listing-16-14/output.txt}}
```

Vay canına, hata mesajı çok uzun! Burada odaklanılacak önemli kısım:
`` `Rc>` iş parçacıkları arasında güvenli bir şekilde iletilemez ``. Derleyici bize nedenini de söylüyor: `` `Send` özelliği `Rc>` için uygulanmamıştır ``. 

:::tip  
`Send` hakkında bir sonraki bölümde konuşacağız: bu, kullandığımız türlerin eşzamanlı durumlar için uygun olduğunu garanti eden özelliklerden biridir.
:::

Maalesef, `Rc` iş parçacıkları arasında paylaşılmak için güvenli değildir. `Rc` referans sayısını yönettiğinde, her `clone` çağrısı için sayıya ekleme yapar ve her klon serbest bırakıldığında sayıyı çıkarır. Ancak, sayısı değiştiğinde başka bir iş parçacığı tarafından kesintiye uğramadığını garanti etmek için hiçbir eşzamanlılık ilkesini kullanmaz. Bu, yanlış sayılara yol açabilir; bu ince hatalar, muhtemelen bellek sızıntılarına veya bir değerin işlem tamamlanmadan düşmesine neden olabilir. İhtiyacımız olan, tam olarak `Rc` gibi ama referans sayısını eşzamanlılık açısından güvenli bir şekilde değiştiren bir türdür.

---

#### `Arc` ile Atomik Referans Sayımı

Şans eseri, `Arc`, eşzamanlı durumlarda güvenli bir şekilde kullanılabilen `Rc` gibi bir türdür. *a*, *atomik* anlamına gelir; bu, *atomik olarak referans sayısı yönetilen* bir tür demektir. Atomikler, burada ayrıntılı olarak ele almayacağımız ek bir eşzamanlılık ilkesidir: daha fazla ayrıntı için standart kütüphane belgelerine [`std::sync::atomic`][atomic] bakın. Bu noktada, atomiklerin temel türler gibi çalıştığını ama güvenli bir şekilde iş parçacıkları arasında paylaşılabileceğini bilmeniz yeterli.

O halde, tüm temel türlerin neden atomik olmadığını ve standart kütüphane türlerinin neden varsayılan olarak `Arc` kullanmamakta olduğunu merak edebilirsiniz. Bunun nedeni, iş parçacığı güvenliğinin bir performans cezasıyla birlikte gelmesidir; bu, gerçekten ihtiyaç duyduğunuzda sadece ödemek istediğiniz bir ücrettir. Sadece tek bir iş parçacığında değerler üzerinde işlemler yapıyorsanız, atomiklerin sağladığı garantileri sağlamaya gerek kalmadan kodunuz daha hızlı çalışabilir.

Örneğimize dönecek olursak: `Arc` ve `Rc` aynı API’ye sahiptir, bu nedenle programımızı `use` satırını, `new` çağrısını ve `clone` çağrısını değiştirerek düzeltiyoruz. 16-15 No'lu Listingdeki kod nihayet derlenecek ve çalıştırılacaktır:

` sarmalamak için bir `Arc` kullanmak">

```rust
{{#rustdoc_include ../listings/ch16-fearless-concurrency/listing-16-15/src/main.rs}}
```



Bu kod aşağıdaki çıktıyı verecektir:

```text
Sonuç: 10
```

Başardık! 0'dan 10'a kadar saydık; bu çok etkileyici görünmese de, `Mutex` ve iş parçacığı güvenliği hakkında çok şey öğrendik. Bu programın yapısını, yalnızca bir sayacı artırmanın ötesinde daha karmaşık işlemler yapmak için de kullanabilirsiniz. Bu stratejiyi kullanarak, bir hesabı bağımsız parçalara bölebilir, bu parçaları iş parçacıkları arasında dağıtabilir ve ardından her iş parçacığının kendi parçasıyla son sonucu güncellemesi için bir `Mutex` kullanabilirsiniz.

:::info  
Basit sayısal işlemler yapıyorsanız, standart kütüphane [`std::sync::atomic` modülü][atomic] tarafından sağlanan `Mutex` türlerinden daha basit türler mevcuttur. Bu türler, temel türlere güvenli, eşzamanlı, atomik erişim sağlar. Bu örnekte, `Mutex` kullandık çünkü `Mutex`'nin nasıl çalıştığına odaklanmak istedik.
:::

---

### `RefCell`/`Rc` ile `Mutex`/`Arc` Arasındaki Benzerlikler

`counter`’ın değişmez olduğunu ancak içindeki değere bir değiştirilebilir referans alabileceğimizi fark etmiş olabilirsiniz; bu, `Mutex`nin içsel değişkenlik sağladığı anlamına geliyor. 15. Bölümde, `Rc` içindeki içerikleri değiştirebilmemiz için `RefCell` kullandığımız gibi, `Arc` içindeki içerikleri değiştirmek için `Mutex` kullandığınızda size tüm mantık hatalarından koruyamayacağıdır. 15. Bölümde `Rc` kullanmanın, iki `Rc` değerinin karşılıklı olarak birbirine referans vermesi, böylece bellek sızıntılarına neden olabilecek referans döngülerini oluşturma riski olduğunu hatırlayın. Benzer şekilde, `Mutex` *ölü kilitler* oluşturma riski taşır. Bu, bir işlemin iki kaynağı kilitlemesi gerektiğinde ve iki iş parçacığının her biri kilitlerden birini aldıysa ve birbirlerini sonsuza dek beklemelerine neden oluyorsa gerçekleşir. 

:::danger  
Ölüm kilitleri ile ilgileniyorsanız, bir Rust programı oluşturmayı deneyin; ardından herhangi bir dildeki mutexler için ölüm kilidi hafifletme stratejilerini araştırın ve Rust’ta bunları uygulamaya çalışın. Rust için `Mutex` ve `MutexGuard` ile ilgili standart kütüphane API belgeleri yararlı bilgiler sunmaktadır.
:::

Bu bölümü, `Send` ve `Sync` özellikleri hakkında konuşarak ve bunları özel türlerle nasıl kullanabileceğimizle tamamlayalım.

[atomic]: ../std/sync/atomic/index.html