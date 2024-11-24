## `RefCell` ve İçsel Değişkenlik Deseni

*İçsel değişkenlik*, Rust'ta bir tasarım desenidir ve verilere değişiklik yapmanıza olanak tanır, bu veriler üzerinde değişmez referanslar olsa bile; normalde, bu eylem borçlanma kuralları tarafından yasaklanır. :::info Bu durum, veri yapıları içinde `unsafe` kodu kullanarak borçlanma kurallarını esnetmeyi içerir. Güvensiz kod, derleyiciye kuralları bizim için kontrol etmekten çok manuel olarak kontrol ettiğimizi belirtir; güvensiz kodu 20. Bölümde daha fazla tartışacağız.

İçsel mutasyon desenini kullanan türleri yalnızca çalışma zamanında borçlanma kurallarının takip edileceğinden emin olduğumuzda kullanabiliriz, bu durumda derleyici bunu garanti edemez. İlgili `unsafe` kodu, güvenli bir API içinde sarılır ve dış tür hala değişmezdir.

Bu kavramı, içsel değişkenlik desenini izleyen `RefCell` türüne bakarak keşfedelim.

### `RefCell` ile Çalışma Zamanında Borçlanma Kurallarını Zorlamak

`Rc` türünden farklı olarak, `RefCell` türü, tutmakta olduğu veriler üzerinde tek sahiplik temsil eder. Peki, `RefCell`'yi `Box` gibi bir türden farklı kılan nedir? Bölüm 4'te öğrendiğiniz borçlanma kurallarını hatırlayın:

* Belirli bir zamanda, *ya* (ama ikisi birden değil) bir değiştirilebilir referans ya da herhangi bir sayıda değişmez referans alabilirsiniz.
* Referanslar her zaman geçerli olmalıdır.

Referanslar ile `Box` ile, borçlanma kurallarının değişmezlikleri derleme zamanında uygulanır. `RefCell` ile bu değişmezlikler *çalışma zamanında* uygulanır. :::warning Referanslarla, bu kuralları ihlal ederseniz derleyici hatası alırsınız. `RefCell` ile, bu kuralları ihlal ederseniz, programınız panik yapacak ve çıkacaktır.

Derleme zamanında borçlanma kurallarını kontrol etmenin avantajı, hataların geliştirme sürecinin daha erken bir aşamasında yakalanmasıdır ve tüm analiz önceden tamamlandığı için çalışma zamanı performansına etkisi yoktur. Bu nedenlerle, çoğu durumda derleme zamanında borçlanma kurallarının kontrol edilmesi en iyi seçimdir, bu yüzden bu Rust'ın varsayılanıdır.

Borçlanma kurallarını çalışma zamanında kontrol etmenin avantajı ise, belirli bellek güvenli senaryoların o zaman izin verilmesidir; bu durum, derleme zamanı kontrolleriyle yasaklanmış olacaktı. Statik analiz, Rust derleyicisi gibi, doğası gereği tutucudur. Kodun bazı özelliklerini analiz ederek tespit etmek imkansızdır: en ünlü örnek, bu kitabın kapsamının ötesinde olan ve araştırması ilginç bir konu olan Halting Problem'dir.

:::note Bazı analizler imkansız olduğundan, Rust derleyicisi, kodun sahiplik kurallarına uygun olup olduğundan emin olamazsa, doğru bir programı reddedebilir; bu şekilde tutucudur. Rust hatalı bir program kabul ederse, kullanıcılar Rust'ın sağladığı güvencelere güvenemez. Ancak, Rust doğru bir programı reddederse, programcı sıkıntı çekecektir, ama felaket bir durum meydana gelmeyecektir. 

`RefCell` türü, kodunuzun borçlanma kurallarını takip ettiğinden emin olduğunuzda ama derleyicinin bunu anlaması ve garanti etmesi mümkün olmadığında kullanışlıdır.

`Rc` gibi, `RefCell` yalnızca tek iş parçacıklı senaryolar için kullanıma uygundur ve çok iş parçacıklı bir bağlamda kullanmaya çalıştığınızda derleme zamanı hatası alırsınız. Çok iş parçacıklı bir programda `RefCell` işlevselliğini nasıl elde edeceğimizi 16. Bölümde konuşacağız.

### Borçlanma Kurallarının Çeşitleri

`Box`, `Rc` ya da `RefCell` seçimi için nedenleri özetleyelim:

* `Rc` aynı veri üzerinde birden fazla sahibi olan bir yapı sağlar; `Box` ve `RefCell`'nin tek sahipleri vardır.
* `Box` derleme zamanında kontrol edilen değişmez veya değiştirilebilir borçlara izin verir; `Rc` yalnızca derleme zamanında kontrol edilen değişmez borçlara izin verir; `RefCell` çalışma zamanında kontrol edilen değişmez veya değiştirilebilir borçlara izin verir.
* Çünkü `RefCell` çalışma zamanında kontrol edilen değiştirilebilir borçlara izin verdiğinden, `RefCell` değişmez olduğunda bile içindeki değeri değiştirebilirsiniz.

Değişmez bir değerin içinde değeri değiştirmek *içsel değişkenlik* desenidir. İçsel değişkenliğin yararlı olduğu bir duruma bakalım ve neden mümkün olduğunu inceleyelim.

### İçsel Değişkenlik: Değişmez Bir Değere Değiştirilebilir Bir Borç

Borçlanma kurallarının bir sonucu olarak, bir değişmez değere sahip olduğunuzda, onu değiştirilebilir olarak borç alamazsınız. Örneğin, bu kod derlenmeyecek:

```rust,ignore,did_not_compile
{{#rustdoc_include ../listings/ch15-smart-pointers/no-listing-01-cant-borrow-immutable-as-mutable/src/main.rs}}
```

Bu kodu derlemeye çalışırsanız şu hatayı alırsınız:

```console
{{#include ../listings/ch15-smart-pointers/no-listing-01-cant-borrow-immutable-as-mutable/output.txt}}
```

:::tip Değerin yöntemlerinde kendini değiştirmesinin yararlı olacağı durumlar vardır ama diğer kodlara karşı değişmez görünür. Değerin yöntemleri dışındaki kod, değeri değiştiremez. `RefCell` kullanmak içsel değişkenliği elde etmenin bir yoludur, ancak `RefCell` borçlanma kurallarını tamamen aşmaz: derleyicinin borç kontrolü bu içsel değişkenliği sağlar ve borçlanma kuralları çalışma zamanında kontrol edilir. Kuralları ihlal ederseniz, derleyici hatası yerine bir `panic!` alırsınız.

`RefCell` kullanarak değişmez bir değeri değiştirmeye çalıştığımız pratik bir örneği inceleyelim ve bunun neden yararlı olduğunu görelim.

#### İçsel Değişkenlik İçin Bir Kullanım Durumu: Mock Obje

Bazen bir programcı test sırasında bir türü başka bir tür için kullanır, belirli bir davranışı gözlemlemek ve bunun doğru bir şekilde uygulandığını doğrulamak amacıyla. Bu yer tutucu türe *test double* denir. Bunu, bir kişinin bir aktörün yerine geçerek belirli zorlu bir sahneyi yapması bağlamındaki bir "stunt double" gibi düşünün. Test double'lar, testlerimizi çalıştırırken diğer türlerin yerini alır. *Mock objeler*, bir test sırasında neler olduğunu kaydeden belirli test double türleridir, böylece doğru eylemlerin gerçekleşip gerçekleşmediğini iddia edebilirsiniz.

Rust, diğer dillerin objeleri gibi objelere sahip değildir ve Rust'ın standart kütüphanesinde bazı diğer dillerdeki gibi mock obje işlevselliği yoktur. Ancak, kesinlikle bir mock objesi olarak aynı işlevi görecek bir yapı oluşturabilirsiniz.

Test edeceğimiz senaryo: bir değeri maksimum bir değere göre takip eden bir kütüphane oluşturacağız ve mevcut değerin maksimum değere ne kadar yakın olduğuna bağlı olarak mesajlar göndereceğiz. Bu kütüphane, bir kullanıcının yapabileceği API çağrı sayısını takip etmek için kullanılabilir.

Kütüphanemiz, bir değerin maksimuma ne kadar yakın olduğunu takip etme işlevselliğini sağlayacak ve hangi zamanlarda ne mesajların olması gerektiğini belirtecektir. Uygulamalarımızın bu mesajları göndermek için mekanizmayı sağlaması beklenmektedir: uygulama bir mesajı uygulamada koyabilir, bir e-posta gönderebilir, bir SMS gönderebilir veya başka bir şey yapabilir. Kütüphanenin bu ayrıntıyı bilmesine gerek yoktur. Tek ihtiyacı olan, sağlayacağımız `Messenger` adlı bir interface'i uygulayan bir şeydir. Liste 15-20, kütüphane kodunu göstermektedir:



```rust,noplayground
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-20/src/lib.rs}}
```



Bu kodun önemli bir kısmı, `Messenger` trait'inin `self`'e değişmez bir referans alıp mesajın metnini alan bir `send` adlı bir metodudur. Bu trait, mock objemizin gerçek bir obje gibi kullanılabilmesi için gereken arayüzdür. Diğer önemli kısmı, `LimitTracker`'daki `set_value` metodunun davranışını test etmek istiyoruz. `value` parametresinin ne olacağını değiştirebiliriz, ancak `set_value` hiçbir şey döndürmediği için iddiada bulunamayız. Eğer `Messenger` trait'ini uygulayan bir şeyle belirli bir değer için bir `LimitTracker` oluşturmayı ve `value` için farklı sayılar gönderildiğinde messenger'ın uygun mesajları göndermesini istiyorsak, bunu belirtebilmek istiyoruz.

Mesajları göndermesi istenen `MockMessenger` adında bir mock objesi oluşturmamız gerekir. `send` metodumuzu çağırdığımızda bir e-posta veya SMS göndermek yerine, sadece gönderilmesi gereken mesajları takip edecektir. Yeni bir mock objesi oluşturabilir, mock objeyi kullanan bir `LimitTracker` oluşturabilir, `LimitTracker` üzerinde `set_value` metodunu çağırabilir ve ardından mock objenin beklediğimiz mesajları içerip içermediğini kontrol edebiliriz. Liste 15-21, tam olarak bunu gerçekleştirmeye çalışıyoruz ama borç kontrol edici bize izin vermiyor:



```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-21/src/lib.rs:here}}
```



Bu test kodu, gönderilmesi istenen mesajları takip eden `String` değerlerinin bulunduğu bir `Vec` ile birlikte bir `sent_messages` alanı olan bir `MockMessenger` yapısı tanımlar. Bunun yanı sıra, yeni `MockMessenger` değerleri oluşturmayı kolaylaştıran bir `new` adlı ilişkili bir fonksiyon tanımlıyoruz. Ardından, `LimitTracker`'a bir `MockMessenger` sağlamak için `Messenger` trait'ini `MockMessenger` için uyguluyoruz. `send` metodunun tanımında, parametre olarak geçilen mesajı alıyoruz ve `sent_messages` listesini `MockMessenger` içinde saklıyoruz.

Testte, `LimitTracker`'ın `value`'yi maksimum değerinin %75'inden daha fazla bir değere ayarlaması durumunda ne olacağını test ediyoruz. Önce, boş bir mesaj listesi ile `MockMessenger` objesi oluşturuyoruz. Ardından yeni bir `LimitTracker` oluşturuyoruz ve ona yeni `MockMessenger` referansını ve maksimum değer olarak 100 veriyoruz. Değeri 80 olan `set_value` metodunu çağırıyoruz, bu da 100'ün %75'inden daha fazla. Ardından, `MockMessenger`'ın takip ettiği mesajlar listesinin şimdi içinde bir mesaj olması gerektiğini doğruluyoruz.

Ancak, bu testle ilgili bir sorun var, burada gösterildiği gibi:

```console
{{#include ../listings/ch15-smart-pointers/listing-15-21/output.txt}}
```

Mesajları takip etmek için `MockMessenger`'ı değiştiremiyoruz çünkü `send` metodu geçerli olmayan bir referansı alıyor. Hata metnindeki öneriyi, `&mut self` yerine kullanmaya yönelik, `send`'in imzasını `Messenger` trait tanımındaki imza ile eşleşmeyecek (denemek isteyebilirsiniz ve hangi hata mesajını aldığınızı görmekte özgürsünüz).

:::danger İçsel değişkenliğin yardımcı olduğu bir durum bu! `sent_messages`'i bir `RefCell` içinde saklayacağız ve bu sayede `send` metodu `sent_messages`'i görmek için değiştirebilecektir. Liste 15-22'de bunun nasıl göründüğünü gösteriyoruz:

` kullanma">

```rust,noplayground
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-22/src/lib.rs:here}}
```



`sent_messages` alanı artık `Vec` yerine `RefCell>` türündedir. `new` fonksiyonunda, boş vektörün etrafında yeni bir `RefCell>` örneği oluşturuyoruz.

`send` metodunun uygulanması için birinci parametre hala `self`'in değişmez bir borcudur, bu da trait tanımıyla eşleşmektedir. `self.sent_messages` içindeki `RefCell>` üzerinde `borrow_mut` çağrısı yaparak içindeki `RefCell>` değerine değiştirilebilir bir referans alıyoruz; bu vektördür. Ardından, test sırasında gönderilen mesajları takip etmek için değiştirilebilir referans üzerinde `push` çağrısında bulunabiliriz.

Son değişiklik ise iddiada yapmamız gereken değişikliktir: iç vektörde kaç öğe olduğunu görmek için, `RefCell>` üzerinde `borrow` çağrısı yaparak vektör üzerinde değişmez bir referans alıyoruz.

Artık `RefCell` kullanmayı nasıl yapacağınızı gördüğünüze göre, nasıl çalıştığına daha derinlemesine dalalım!

#### `RefCell` ile Çalışma Zamanında Borçların Takibi

Değişmez ve değiştirilebilir referanslar oluştururken, sırasıyla `&` ve `&mut` sözdizimini kullanırız. `RefCell` ile, `RefCell`'ye ait güvenli API'nin bir parçası olan `borrow` ve `borrow_mut` metodlarını kullanırız. `borrow` metodu akıllı işaretçi türü `Ref`'yi döndürür ve `borrow_mut` akıllı işaretçi türü `RefMut`'yi döndürür. Her iki tür de `Deref`'i uygular, bu nedenle onları normal referanslar gibi kullanabiliriz.

:::info `RefCell`, şu anda aktif olan kaç `Ref` ve `RefMut` akıllı işaretçinin olduğunu takip eder. Her `borrow` çağrısında, `RefCell` aktif olan değişmez borçların sayısını artırır. `Ref` değeri kapsamdan çıktığında, değişmez borçların sayısı bir azalır. Derleme zamanı borçlanma kurallarında olduğu gibi, `RefCell` bize her noktada birden fazla değişmez borç veya bir değiştirilebilir borç olmasını sağlar.

Bu kuralları ihlal etmeye çalıştığımızda, referanslarla alacağımız bir derleyici hatası yerine, `RefCell`'nin implementasyonu çalışma zamanında panik yapar. Liste 15-23, Liste 15-22'deki `send` metodunun idaresinde bir değişikliktir. Burada, aynı kapsamda iki değiştirilebilir borç oluşturmaya çalışarak `RefCell`'nin bunu çalışma zamanında nasıl önlediğini göstermek amacıyla yapıyoruz.

`'nin panik vereceği durum">

```rust,ignore,panics
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-23/src/lib.rs:here}}
```



`borrow_mut`'ten dönen `RefMut` akıllı işaretçi için bir `one_borrow` değişkeni oluşturuyoruz. Ardından, aynı şekilde `two_borrow` adlı başka bir değiştirilebilir borç oluşturuyoruz. Bu, aynı kapsamda iki değiştirilebilir referans oluşturur ki bu da yasaktır. Kütüphanemiz için testleri çalıştırdığımızda, Liste 15-23'deki kod hatasız derlenecek ama test başarısız olacaktır:

```console
{{#include ../listings/ch15-smart-pointers/listing-15-23/output.txt}}
```

Bu kodun `already borrowed: BorrowMutError` mesajıyla panik yaptığını fark edin. İşte bu şekilde `RefCell` çalışma zamanında borçlanma kurallarını ihlallerine karşı çalışır.

:::tip Borçlama hatalarını çalışma zamanında yakalamayı seçmek, burada yaptığımız gibi, geliştirme sürecinin ilerleyen aşamalarında hataları bulmaya çalışırken daha olasıdır: belki de kodunuzun üretime konuşlandırılana kadar hata bulamayabilirsiniz. Ayrıca, çalışma zamanı performansında daha küçük bir kayba yol açma sonucunu doğurur, çünkü borçları çalışma zamanında takip etmek zorundasınız; oysa derleme zamanında bu olmayacaktır. Ancak, `RefCell` kullanmak, değişmez değerlerin yalnızca geçerli olduğu bir bağlamda, gördüğü mesajları takip edebilmek için kendini değiştirebilen bir mock obje yazmanızı sağlar. Alışılmadık referansların sağladığı işlevselliği elde etmek için `RefCell`'yi değiş tokuş edebilirsiniz.

### `Rc` ve `RefCell`'yi Birleştirerek Değiştirilebilir Veriler için Birden Fazla Sahip Olma

`RefCell`'yi kullanmanın yaygın bir yolu, `Rc` ile bir arada kullanmaktır. `Rc` bazı verilerin birden fazla sahibi olmasına olanak tanır, ancak o verinin yalnızca değişmez erişimini sağlar. Eğer bir `Rc`'niz varsa ve bu `RefCell` tutuyorsa, birden fazla sahibi olabilen *ve* bu veriyi değiştirebileceğiniz bir değere erişebilirsiniz!

Örneğin, Liste 15-18'de şemayı kullanmak için `Rc`'nin nasıl kullanıldığına geri dönelim; burada birkaç listenin başka bir liste ile ortak sahipliğini sağlamak için `Rc` kullandık. `Rc` yalnızca değişmez değerler tuttuğu için bir kez oluşturduğumuz liste değerlerinin hiçbirini değiştiremeyiz. Liste değerlerinin içindeki değerleri değiştirme yeteneğini kazanmak için `RefCell` ekleyelim. Liste 15-24, `Cons` tanımında bir `RefCell` kullanarak, tüm listelerde saklanan değeri değiştirebileceğimizi göstermektedir:

>` kullanma">

```rust
{{#rustdoc_include ../listings/ch15-smart-pointers/listing-15-24/src/main.rs}}
```



`Rc>` tipi bir değer oluşturuyoruz ve daha sonra bunu `value` adlı bir değişkende saklıyoruz, böylece daha sonra doğrudan erişebiliriz. Ardından, `value` içeren bir `Cons` ile `a`da bir `List` oluşturuyoruz. `value`'yi kopyalamamız gerekiyor, böylece hem `a` hem de `value`, içindeki `5` değerine sahip olabilir. `value`'den `a`'ya sahiplik devretmemek veya `a`'nın `value`'dan borçlanmaması gerekiyor.

Liste `a`'yı bir `Rc` ile sarıyoruz, böylece `b` ve `c` listelerini oluşturduğumuzda her ikisi de `a`'ya referans verebilir, bu da Liste 15-18'de yaptığımızı gösterir.

Listeleri `a`, `b` ve `c` içinde oluşturduğumuzda, `value`'ye 10 eklemek istiyoruz. Bunu, 5. Bölümde tartıştığımız otomatik dereference işlemini kullanarak, `value` üzerinde `borrow_mut` çağrısı yaparak yapıyoruz (bkz. "Nerede `->` Operatörü?"). `borrow_mut` metodu `RefMut` akıllı işaretçisini döndürür ve biz de `RefCell` içindeki değeri değiştirmek için dereference operatörünü kullanırız.

:::tip `a`, `b` ve `c`'yi yazdırdığımızda, hepsinin 5 yerine 15 olan değiştirilmiş değere sahip olduğunu görebiliriz:

```console
{{#include ../listings/ch15-smart-pointers/listing-15-24/output.txt}}
```

Bu teknik oldukça havalı! `RefCell` kullanarak dışarıdan değişmez görünen bir `List` değerine sahibiz. Ancak, veri yapılarımızda ihtiyaç duyduğumuzda verilerimizi değiştirebilmek için içsel değişkenliğe erişim sağlayan `RefCell` metodlarını kullanabiliyoruz. Borçlanma kurallarının çalışma zamanı kontrolleri, veri yarışlarını önlememize yardımcı olur ve bazen bu esnekliğin kazanılabilmesi için hızımızdan az da olsa feragat etmek değerdir. Unutmayın ki `RefCell` çok iş parçacıklı kodlar için çalışmaz! `Mutex`, `RefCell`'nin iş parçacığı güvenli sürümüdür ve 16. Bölümde `Mutex`'yi tartışacağız.