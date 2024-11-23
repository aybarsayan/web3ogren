## Tek İşlemeli Bir Web Sunucusu İnşa Etmek

Tek işlemeli bir web sunucusu oluşturmakla başlayacağız. Öncelikle, web sunucusu oluşturma sürecinde yer alan protokollerin hızlı bir genel görünümüne bakalım. Bu protokollerin detayları bu kitabın kapsamının ötesinde, ancak kısa bir genel bakış, gerekli bilgileri edinmenizi sağlayacaktır.

Web sunucularında yer alan iki ana protokol *Hiper Metin Transfer Protokolü* *(HTTP)* ve *İletim Kontrol Protokolü* *(TCP)*’dir. Her iki protokol de *istek-cevap* protokolleridir, yani bir *istemci* istek başlatır ve bir *sunucu* istekleri dinler ve istemciye yanıt verir. Bu isteklerin ve yanıtların içeriği protokoller tarafından tanımlanmıştır.

:::info
TCP, bilgilerin bir sunucudan diğerine nasıl gideceğini tanımlayan daha düşük seviyeli bir protokoldür, ancak o bilginin ne olduğunu belirtmez. HTTP ise, isteklerin ve yanıtların içeriğini tanımlayarak TCP'nin üstünde inşa edilmiştir.
:::

Teknik olarak HTTP, diğer protokollerle kullanılabilir, ancak çoğu durumda HTTP verisini TCP üzerinden göndeririz. TCP ve HTTP isteklerinin ve yanıtlarının ham baytlarıyla çalışacağız.

### TCP Bağlantısını Dinlemek

Web sunucumuzun bir TCP bağlantısını dinlemesi gerekiyor, bu yüzden üzerinde çalışacağımız ilk kısım bu. Standart kütüphane, bunu yapmamıza olanak tanıyan bir `std::net` modülü sunar. Gelin, alışıldık şekilde yeni bir proje oluşturalım:

```console
$ cargo new hello
     Created binary (application) `hello` project
$ cd hello
```

Şimdi *src/main.rs* dosyasındaki 21-1 Numaralı Listede yer alan kodu girelim. Bu kod, `127.0.0.1:7878` adresinde gelen TCP akışlarını dinleyecektir. Bir akış aldığında `Connection established!` (Bağlantı kuruldu!) mesajını yazdıracaktır.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-01/src/main.rs}}
```



`TcpListener` kullanarak, `127.0.0.1:7878` adresinde TCP bağlantılarını dinleyebiliriz. Adresteki iki nokta üst üste öncesindeki kısım, bilgisayarınızı temsil eden bir IP adresidir (her bilgisayarda aynıdır ve yazarların bilgisayarını özel olarak temsil etmez) ve `7878` ise port numarasını belirtir. Bu portu iki nedeni var: 

- HTTP genellikle bu portta kabul edilmez, bu yüzden sunucumuz muhtemelen makinelerinizde çalışmakta olan diğer web sunucuları ile çakışmayacaktır. 
- `7878`, bir telefon üzerinde *rust* olarak yazılmıştır.

:::tip
Bu senaryoda `bind` işlevi, yeni bir `TcpListener` örneği döndürme işlevi görmektedir. `bind` işlevinin adı, bağlantı dinlemek için bir porta bağlanmanın ağ bağlantılarındaki ifadesidir.
:::

`bind` işlevi, bağlanmanın başarısız olabileceğini belirten `Result` döndürür. Örneğin, port 80'e bağlanmak için yönetici ayrıcalıkları gereklidir (yönetici olmayanlar yalnızca 1023'ten büyük portlarda dinleyebilir), bu nedenle bir yönetici olmadan port 80'e bağlanmaya çalışırsak, bağlanma işlevi çalışmaz. Ayrıca bağlanma, iki programın aynı porta dinleme yaptığı durumlarda da çalışmaz. Temel bir sunucu yazdığımız için bu tür hata durumlarını ele almaktan endişelenmeyeceğiz; bunun yerine, hatalar olduğunda programı durdurmak için `unwrap` kullanıyoruz.

`TcpListener` üzerindeki `incoming` yöntemi, bize akışlar dizisini (daha spesifik olarak, `TcpStream` türünden akışlar) veren bir yineleyici döndürür. Tek bir *akış*, istemci ve sunucu arasında açık bir bağlantıyı temsil eder. Bir *bağlantı*, istemcinin sunucuya bağlandığı, sunucunun bir yanıt ürettiği ve sunucunun bağlantıyı kapattığı, tam istek ve yanıt işlemi için kullanılan bir isimdir. Bu nedenle, istemcinin ne gönderdiğini görmek için `TcpStream`'den okuma yapacağız ve ardından isteğe yanıt olarak veri göndermek için akışa yanıtımızı yazacağız. Genel olarak, bu `for` döngüsü her bağlantıyı sırayla işleyip bizim işlememiz için bir dizi akış üretecektir.

:::note
Şimdilik, akışı işleme şeklimiz, akışta herhangi bir hata varsa programımızı durdurmak için `unwrap` çağrısını içerir; hata yoksa, program bir mesaj yazdırır.
:::

Başka bir bağlantı istemcisi sunucuya bağlandığı zaman, `incoming` yönteminden aldığımız hata nedenidir, çünkü aslında bağlantılar üzerinde yineleme yapmıyoruz. Bunun yerine, *bağlantı denemeleri* üzerinde yineleme yapıyoruz. Bağlantı çeşitli nedenlerden ötürü başarısız olabilir, bazıları işletim sistemine özgüdür. Örneğin, birçok işletim sistemi aynı anda açık bağlantı sayısına bir sınır koyar; bu sayıdan fazla yeni bağlantı denemeleri, bazı açık bağlantılar kapatılana kadar hata üretecektir.

Haydi bu kodu çalıştırmayı deneyelim! Terminalde `cargo run` komutunu çağırın ve ardından bir web tarayıcısında *127.0.0.1:7878* adresini yükleyin. Tarayıcı, sunucu şu anda herhangi bir veri göndermediği için “Connection reset” (Bağlantı sıfırlandı.) gibi bir hata mesajı göstermelidir. Ancak terminalinizi incelediğinizde, tarayıcının sunucuya bağlandığı zaman yazdırılan birkaç mesaj görmelisiniz!

```text
     Running `target/debug/hello`
Connection established!
Connection established!
Connection established!
```

Bazen, bir tarayıcı isteği için birden fazla mesaj yazdırabilirsiniz; bunun nedeni, tarayıcının sayfa için bir istek yapması ve tarayıcı sekmesinde görünen *favicon.ico* simgesi gibi diğer kaynaklar için de istek yapması olabilir.

Ayrıca tarayıcının sunucuya birden fazla kez bağlanmaya çalışıyor olması da mümkündür çünkü sunucu herhangi bir veri ile yanıt vermemektedir. `stream` kapsamdan çıktığında ve döngünün sonunda düşürüldüğünde, bağlantı `drop` uygulamasıyla kapatılır. Tarayıcılar kapalı bağlantılarla bazen yeniden bağlanmayı deneyerek başa çıkmaktadır çünkü sorun geçici olabilir. Önemli olan faktör, bir TCP bağlantısının eline başarıyla ulaşmış olmamızdır!

:::warning
Bir bağlantı kurduktan sonra programı durdurmak için ctrl-c tuşlarına basmayı unutmayın. Belirli bir kod sürümünü çalıştırmayı tamamladıktan sonra, kod değişikliklerinizi yaptıktan sonra `cargo run` komutunu çağırarak programı yeniden başlatmayı unutmayın ki her zaman en yeni kodu çalıştırıyor olun.
:::

### İsteği Okumak

Tarayıcıdan isteği okumak için işlevselliği uygulayalım! İlk önce bağlantı almayı ve daha sonra bağlantı ile bir eylem gerçekleştirmeyi ayrı tutmak için, bağlantıları işlemek üzere yeni bir `handle_connection` fonksiyonu başlatacağız. Bu yeni `handle_connection` fonksiyonunda, TCP akışından veri okuyacağız ve tarayıcıdan gönderilen verileri görebilmek için yazdıracağız. Kodda, 21-2 Numaralı Listeye göre değişiklik yapalım.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-02/src/main.rs}}
```



`std::io::prelude` ve `std::io::BufReader`'ı tanıma dahil ederek akıştan okuma ve yazma yapmamızı sağlayacak türlere erişim sağlarız. `main` fonksiyonu içindeki `for` döngüsünde, artık bağlantı kurulduğu mesajı yerine yeni `handle_connection` fonksiyonunu çağırıp `stream`'i ona ileteceğiz.

`handle_connection` fonksiyonunda, akışa bir referansı saran yeni bir `BufReader` örneği oluşturuyoruz. `BufReader`, `std::io::Read` özelliği yöntemlerine yönelik çağrıları yöneterek bir önbellek ekler.

Tarayıcıdan sunucumuza gönderilen istek satırlarını toplamak için `http_request` adında bir değişken oluşturuyoruz. Bu satırları bir vektörde toplamak istediğimizi belirtiyoruz ve `Vec` tür anotasyonunu ekliyoruz.

:::tip
`BufReader`, `std::io::BufRead` özelliğini uygular ve `lines` yöntemini sağlar. `lines` yöntemi, her yeni satır baytını gördüğünde veriler akışını ayırarak `Result` türünden bir yineleyici döndürür.
:::

Her `String` elde etmek için her `Result`'ı eşleştirip `unwrap` yaparız. `Result`, veriler geçerli bir UTF-8 değilse ya da akıştan okuma sırasında bir sorun varsa hata içerebilir. Yine, bir üretim programı bu hataları daha zarif bir şekilde ele almalıdır, ancak bu bölümde basitlik açısından hata durumunda programı durdurmayı tercih ediyoruz.

Tarayıcı, HTTP isteğinin sonunu, ardışık iki yeni satır karakteri göndererek sinyal eder, bu nedenle akıştan bir isteği almak için bir boş dizeden olduğu bir satır alana kadar satırları alıyoruz. Satırları vektöre topladıktan sonra, tarayıcının sunucumuza gönderdiği talimatları görebilmek için güzel bir hata ayıklama formatında yazdırıyoruz.

:::note
Bu kodu deneyelim! Programı başlatın ve bir web tarayıcısında tekrar istek yapın. Tarayıcıda hala bir hata sayfası alacağız, ancak terminalde programın çıktısı artık şöyle görünecek:
:::

```console
$ cargo run
   Compiling hello v0.1.0 (file:///projects/hello)
    Finished dev [unoptimized + debuginfo] target(s) in 0.42s
     Running `target/debug/hello`
Request: [
    "GET / HTTP/1.1",
    "Host: 127.0.0.1:7878",
    "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:99.0) Gecko/20100101 Firefox/99.0",
    "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language: en-US,en;q=0.5",
    "Accept-Encoding: gzip, deflate, br",
    "DNT: 1",
    "Connection: keep-alive",
    "Upgrade-Insecure-Requests: 1",
    "Sec-Fetch-Dest: document",
    "Sec-Fetch-Mode: navigate",
    "Sec-Fetch-Site: none",
    "Sec-Fetch-User: ?1",
    "Cache-Control: max-age=0",
]
```

Tarayıcınıza bağlı olarak biraz farklı bir çıktı alabilirsiniz. Şimdi isteği veri olarak yazdırdığımız için, istemciden gelen istek verilerini inceleyerek neden bir tarayıcı isteğinden birden fazla bağlantı aldığımızı görebiliyoruz; isteğin ilk satırındaki `GET`'ten sonraki yolun `/` olduğunu görüyoruz. Tekrar eden bağlantıların tamamı `/*` isteğinde bulunuyorsa, tarayıcının programımızdan bir yanıt almadığı için `/*`'yi sürekli almayı denediğini biliyoruz.

Bu istek verilerini anlamak için inceleyelim.

### HTTP İsteğine Daha Yakından Bakış

HTTP, metin tabanlı bir protokoldür ve bir istek şu formatta olur:

```text
Method Request-URI HTTP-Version CRLF
headers CRLF
message-body
```

:::quote
İlk satır, istemcinin ne talep ettiğine dair bilgileri içeren *istek satırı*dır. İstek satırının ilk kısmı, istemcinin bu isteği yapma yöntemini belirten, `GET` veya `POST` gibi bir *yöntem* olduğunu gösterir. İstemcimiz bir `GET` isteği kullandı, bu da bilgi talep ettiğini gösterir.
— Doğa Bilgisi
:::

İstek satırının bir sonraki kısmı `/*` olup, istemcinin talep ettiği *Tekdüzen Kaynak Tanımlayıcısı* *(URI)*'dir: bir URI, neredeyse ama tam olarak bir *Tekdüzen Kaynak Yeri* *(URL)* ile aynı değildir. URI'ler ve URL'ler arasındaki fark, bu bölümde bizim amacımız açısından önemli değildir, ancak HTTP spesifikasyonu URI terimini kullandığı için burada düşünsel olarak URL yerine URI geçecek şekilde zihinsel olarak değiştirebiliriz.

Son kısım, istemcinin kullandığı HTTP versiyonudur ve istek satırı bir *CRLF dizisi* ile sona erer. (CRLF, *karakter dönüşü* ve *satır beslemesi* terimlerinden gelmektedir!) CRLF dizisi ayrıca `\r\n` şeklinde yazılabilir; burada `\r` karakter dönüşümü, `\n` ise satır beslemesidir. CRLF dizisi istek satırını talep verisinin geri kalanından ayırır. CRLF dizisi yazdırıldığında yeni bir satır başladığını görürüz, `\r\n` değil.

Şu ana kadar programımızı çalıştırdığımızdan elde ettiğimiz istek satırı verilerine baktığımızda, `GET` yöntemi olduğunu, `/*` istek URI'sini ve `HTTP/1.1` versiyonunu görüyoruz.

İstek satırından sonra, `Host:` kısmından itibaren kalan satırlar başlıklardır. `GET` isteklerinin gövdesi yoktur.

Farklı bir tarayıcıdan istek yapmayı ya da *127.0.0.1:7878/test* gibi farklı bir adres istemeyi deneyin, isteğin veri setinin nasıl değiştiğini görün.

Artık tarayıcının ne talep ettiğini bildiğimize göre, geri veri gönderelim!

### Bir Yanıt Yazmak

Bir istemci isteğine yanıt olarak veri gönderme işlevselliğini uygulayacağız. Yanıtların aşağıdaki formatı vardır:

```text
HTTP-Version Status-Code Reason-Phrase CRLF
headers CRLF
message-body
```

İlk satır, yanıt olarak kullanılan HTTP versiyonunu, isteğin sonucunu özetleyen sayısal bir durum kodunu ve durum koduna dair bir metin tanımını içeren bir *durum satırı*dır. CRLF dizisinden sonra herhangi başlıklar, başka bir CRLF dizisi ve yanıtın gövdesi bulunur.

:::tip
HTTP versiyon 1.1 kullanan, durum kodu 200 olan, OK durum tanımına sahip, başlığı olmayan ve gövdesi olmayan bir yanıt örneği şu şekildedir:
```text
HTTP/1.1 200 OK\r\n\r\n
```
:::

Durum kodu 200, standart başarı yanıtıdır. Metin, küçük bir başarılı HTTP yanıtıdır. Bunu, başarılı bir isteğin yanıtı olarak akışa yazalım! `handle_connection` fonksiyonundan, istek verilerini yazdıran `println!` komutunu kaldırıp, 21-3 Numaralı Listede yer alan kodla değiştireceğiz.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-03/src/main.rs:here}}
```



İlk yeni satır, başarı mesajı verilerini taşıyan `response` değişkenini tanımlar. Ardından, yanıt verimizi baytlara dönüştürmek için `as_bytes` çağrısını yaparız. `stream` üzerindeki `write_all`, `&[u8]` alır ve bu baytları doğrudan bağlantı üzerinden gönderir. `write_all` işlemi başarısız olabileceği için, önceki gibi hata sonucunu `unwrap` ile kullanıyoruz. Yine, gerçek bir uygulama da buralarda hata işleme eklerdiniz.

Bu değişikliklerle kodumuzu çalıştıralım ve bir istek yapalım. Artık terminale herhangi bir veri yazdırmıyoruz, dolayısıyla yalnızca Cargo'dan gelen çıktıyı göreceğiz. Bir web tarayıcında *127.0.0.1:7878* adresini açtığınızda, hata değil, boş bir sayfa görmelisiniz. HTTP isteği almayı ve yanıt göndermeyi başarıyla gerçekleştirdiniz!

### Gerçek HTML Döndürme

Şimdi, boş bir sayfadan daha fazlasını döndürme işlevselliğini uygulayalım. Proje dizininizin kökünde *hello.html* adında yeni bir dosya oluşturun, *src* dizininde değil. İstediğiniz herhangi bir HTML'yi yazabilirsiniz. 21-4 Numaralı Liste bir olasılığı göstermektedir.



```html
{{#include ../listings/ch21-web-server/listing-21-05/hello.html}}
```



Bu minimal HTML5 belgesi, bir başlık ve biraz metin içermektedir. Bu dosyayı sunucudan bir istek aldığında döndürmek için, `handle_connection` fonksiyonunu 21-5 Numaralı Listede gösterildiği gibi değiştirerek HTML dosyasını okuyacağız, yanıtın gövdesine ekleyecek ve göndereceğiz.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-05/src/main.rs:here}}
```



Standart kütüphanenin dosya sistemi modülünü tanıma dahil etmek için `fs`’yi `use` ifadesine ekledik. Bir dosyanın içeriğini bir dizeye okuma kodu, 12. Bölümde I/O projemizde dosyanın içeriğini okuduğumuzda olduğu gibi tanıdık gelmesi gerekir.

:::note
Ardından, içeriklerin başarı yanıtının gövdesi olarak eklenmesini sağlamak için `format!` kullanıyoruz. Geçerli bir HTTP yanıtı sağlamak için, yanıt gövdemizin boyutunu ayarladığımız `Content-Length` başlığını ekliyoruz, bu durumda `hello.html` dosyasının boyutudur.
:::

Bu kodu `cargo run` ile çalıştırın ve tarayıcınızda *127.0.0.1:7878* adresini yükleyin; HTML’iniz görüntülenmelidir!

Şu an için, `http_request` içindeki istek verilerini göz ardı ediyoruz ve koşulsuz olarak HTML dosyasının içeriğini geri gönderiyoruz. Bu, tarayıcınızda *127.0.0.1:7878/something-else* isteğini denerseniz bile, hala aynı HTML yanıtını alacaksınız. Şu anki durumumuzda sunucumuz çok sınırlı ve çoğu web sunucusunun yaptığı gibi işlem yapmamaktadır. Yanıtlarımızı isteğe bağlı olarak özelleştirmek ve yalnızca düzgün bir şekilde oluşturulmuş `/*` isteği için HTML dosyasını göndermek istiyoruz.

### İsteği Doğrulama ve Seçici Yanıt Verme

Şu anda, web sunucumuz, istemcinin talep ettiği şey ne olursa olsun dosyadaki HTML'i döndürecektir. Tarayıcının `/*` istediğini kontrol etme işlevselliğini ekleyelim ve tarayıcı başka bir şey talep ettiğinde hata yanıtı döndürüp HTML dosyasını gönderirken, `handle_connection` fonksiyonunu 21-6 Numaralı Listede gösterildiği gibi değiştireceğiz. Bu yeni kod, gelen istek içeriğini bildiğimiz `/*` isteğine karşı kontrol eder ve istekleri farklı bir şekilde ele almak için `if` ve `else` blokları ekler.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-06/src/main.rs:here}}
```



Sadece HTTP isteğinin ilk satırına bakacağız, bu yüzden isteğin tamamını bir vektöre okumak yerine, yineleyiceden ilk unsuru almak için `next`'i çağırıyoruz. İlk `unwrap`, `Option` durumunu ele alır ve yineleyicide hiç öğe yoksa programı durdurur. İkinci `unwrap`, `Result`'ı ele alır ve 21-2 Numaralı Listede eklenen `map`'teki `unwrap` ile aynı etkiye sahiptir.

:::info
Sonra, `request_line`'ın bir `GET` isteği olup olmadığını kontrol ediyoruz. Eğer öyleyse, `if` bloğu HTML dosyamızın içeriğini döndürür.
:::

Eğer `request_line`, `/*` yoluna olan `GET` isteğine eşit değilse, başka bir istekte bulunmuşuz demektir. `else` bloğuna başka bir isteği yanıtlamak için kod ekleyeceğiz.

Şimdi bu kodu çalıştırın ve *127.0.0.1:7878* isteği yapın; *hello.html* içeriğini almalısınız. Farklı bir istek yaptığınızda, örneğin *127.0.0.1:7878/something-else* gibi, 21-1 ve 21-2 Numaralı Listelerde gördüğünüz gibi bir bağlantı hatası alacaksınız.

:::danger
Şimdi *else* bloğuna 21-7 Numaralı Listede yer alan kodu ekleyerek, talep için içerik bulunamadığını bildiren durum kodu 404 olan bir yanıt döndüreceğiz. Ayrıca tarayıcıda yanıt olarak kullanıcının karşılaşacağı bir sayfanın HTML'ini döndüreceğiz.
:::



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-07/src/main.rs:here}}
```



Burada, yanıtımızda durum kodu 404 olan bir durum satırı ve `NOT FOUND` durum açıklaması var. Yanıtın gövdesi de *404.html* dosyasındaki HTML olacak. Hata sayfası için yanıt vermek üzere, *hello.html* ile birlikte yanına *404.html* dosyası oluşturmalısınız; yine istediğiniz herhangi bir HTML dosyasını kullanabilir ya da 21-8 Numaralı Listede yer alan örnek HTML'i kullanabilirsiniz.



```html
{{#include ../listings/ch21-web-server/listing-21-07/404.html}}
```



Bu değişikliklerle sunucunuzu tekrar çalıştırın. *127.0.0.1:7878* isteği *hello.html* içeriğini döndürmelidir; diğer herhangi bir istek, örneğin *127.0.0.1:7878/foo* ise, *404.html* dosyasından gelen hatalı HTML ile yanıt vermelidir.

### Yeniden Yapılandırma Dokunuşu

Şu anda `if` ve `else` bloklarında çok fazla tekrar var: ikisi de dosyaları okuyor ve dosyaların içeriğini akışa yazıyor. Tek fark durumu gösteren satır ve dosya adı. Kodumuzu daha özlü hale getirmek için bu farkları, durum satırının ve dosya adının değerlerini değişkenlere atayacak ayrı `if` ve `else` satırlarına çıkaralım; ardından, dosyayı okumak ve yanıtı yazmak için bu değişkenleri koşulsuz olarak kullanabiliriz. 

:::info **İpucu:** Bu yeniden yapılandırma ile kod okunabilirliğini artırıyoruz.

Liste 21-9, büyük `if` ve `else` bloklarının yerini alan sonucu gösteren kodu sergilemektedir.



```rust,no_run
{{#rustdoc_include ../listings/ch21-web-server/listing-21-09/src/main.rs:here}}
```



Artık `if` ve `else` blokları sadece durum satırı ve dosya adı için uygun değerleri bir demet içinde döndürüyor; ardından bu iki değeri `status_line` ve `filename` olarak atamak için `let` ifadesinde bir desktraktür kullanıyoruz, bu konu 19. Bölümde tartışılmıştır.

:::tip **Not:** Değişken kullanımı, kodun bakımı ve genişletilmesi için önemlidir.

Önceden tekrarlanan kod artık `if` ve `else` bloklarının dışındadır ve `status_line` ve `filename` değişkenlerini kullanmaktadır. Bu, iki durum arasındaki farkı görmek için daha kolay hale getirir ve dosya okuma ve yanıt yazma işlemlerini değiştirmek istiyorsak kodu güncellemek için yalnızca bir yerimiz olduğu anlamına gelir. Liste 21-9'daki kodun davranışı, Liste 21-7'dekine eşit olacaktır.

:::warning **Dikkat:** Yeniden yapılandırma sırasında bazı işlevlerin etkilendiğinden emin olun.

Harika! Şimdi bir isteğe bir içerik sayfası ile yanıt veren yaklaşık 40 satırlık Rust kodunda basit bir web sunucusuna sahibiz ve tüm diğer isteklere 404 yanıtı veriyoruz.

:::danger **Önemli:** Sunucunun yanıt süreleri, yoğun istek durumlarında önemli ölçüde etkilenebilir.

Şu anda sunucumuz tek bir iş parçacığında çalışıyor, yani yalnızca bir isteği aynı anda hizmet edebiliyor. Bunun problem olabileceğini simüle ederek inceleyelim. Ardından, sunucumuzun aynı anda birden fazla isteği nasıl işleyebileceğini çözebiliriz.