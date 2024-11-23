---
id: network-api
title: Ağ API'si
---



Gerekli yetkilere sahip olan bir kod, "ağ API'si" aracılığıyla, genel olarak BSD soket API'sine benzer bir şekilde çalışan bir arayüze erişebilir. Bu kod şu işlemleri gerçekleştirebilir:

- Çeşitli ağ yığınlarında dinleme portu açmak.
- Uzaktaki portlarla bağlantı başlatmak.
- Bu bağlantılar üzerinden veri göndermek ve almak.
- Bağlantıyı ve/veya portları kapatmak.

Bağlantı türü, vattın çalıştığı host tarafından sınırlıdır. Zincir tabanlı makineler, çoğaltılmış mutabakatın platoniği bir alanında çalışmak zorundadır, bu nedenle ağ seçenekleri IBC gibi protokollere sınırlıdır. IBC, bir bütün zincirin başka zincir benzeri varlıklarla iletişim kurmasına olanak tanır. Her böyle varlık, genellikle geçerli bir dizi doğrulayıcı kamu anahtarını ve belirli bir tarihsel hashlenmiş blok tanımlayıcıları içeren gelişen bir konsensüs kuralları setiyle tanımlanır.

**DİKKAT:** IBC,  terimini zincirler arası atlama anlamında kullanır ve  terimini de bir dizi atlama üzerinden Port'tan Port'a bir yol olarak ifade eder. Bu talihsiz bir durumdur çünkü IBC "Kanalları" TCP "bağlantılarına" en doğru şekilde karşılık gelir ve ağ API'leri hakkında çoğu tartışma (bu dahil) "bağlantılar" hakkında kapsamlı bir şekilde konuşacaktır. Şu anda, IBC uygulamamız yalnızca önceden belirlenmiş atlamaları kullanabilir ve kullanıcı düzeyindeki kodun çalışma zamanında yeni atlamalar (IBC Bağlantıları) oluşturmasına olanak tanımaz. Ancak kullanıcı düzeyindeki kod, her zaman yeni IBC Kanalları oluşturabilir. Terminoloji karışıklığı, "Dahili Bağlantıyı Kabul Etme" bölümünde en bariz şekilde görülecektir; burada kullanıcı kodu gerçekten bir dahili IBC _Kanalı_ kabul etmektedir.

Bu IBC atlamaları aracılığıyla bir kanal, her iki ucunda da IBC-farkında koda sonlanır. Bu uçlar, geleneksel (statik) IBC işleyicileri (örneğin, bir ICS-20 token transfer modülü) veya dinamik IBC işleyicileri (örneğin, bir SwingSet vatında çalışan) olabilir. SwingSet vat kodu, farklı bir SwingSet makinesindeki vat kodu ile iletişim kurmak istediğinde IBC bağlantısını doğrudan kullanmaz: bunun yerine normal nihai-yolla gönderim işlemlerini (`E(target).foo(args)`) gerçekleştirecek ve "CapTP" vaat borulama katmanının detayları işlemesine izin verecektir. Ancak, başka bir zincirde bir ICS-20 işleyicisi ile iletişim kurmak isteyen vat kodu, bu katmanı kullanmak zorundadır.

Tekil bir makine içinde bulunan vatlar, TCP, HTTP ve WebSocket gibi geleneksel ağ katmanlarını kullanabilir. Bu, örneğin, WebSocket kullanarak vatı sipariş durumu için sorgulayan tarayıcı tabanlı kullanıcı arayüzleriyle iletişim kurmalarına olanak tanır. Bu bağlantıların normal ocap kurallarını takip etmesi gerekmez, bu yüzden bunları kabul eden vat kodu kendi kimlik doğrulama ve erişim kontrol korumalarını sağlamalıdır.

Tekil makineler, özel protokoller kullanarak zincirlerle ve tersine iletişim kurabilir. Bu, CapTP'nin bu heterojen makine türleri arasındaki ocap mesajlaşması sağlamak için kullanılacaktır.

## Agoric-sdk Kullanıcı Yerel Portu

Agoric testnetinin her kullanıcısı birkaç kişisel IBC dinleme portu alır. Bu `Port` nesnelerine `home.ibcport` dizisinde erişebilirsiniz ve bunların yerel adresini öğrenmek için `E(home.ibcport[0]).getLocalAddress()` gibi bir şey çağırabilirsiniz. Bu, `/ibc-port/portbvmnfb` gibi bir yerel adres döndürür.

Bu, kullanıcı kodunun IBC `Port` almasının şu anda tek yoludur; fakat IBC olmayan portlar yerel `home.network` nesnesini kullanarak tahsis edilebilir. Bu, daha sonraki bir belgede ayrıntılı olarak ele alınacak olan gelişmiş bir kullanım senaryosudur.

## Uzaktaki Bir Port ile Bağlantı Kurma

Bağlantı kurmak için, bir yerel `Port` nesnesi ile başlamanız ve uzak uca ait ismi bilmeniz gerekmektedir. Uzak uç, `/ibc-hop/$HOPNAME/ibc-port/$PORTNAME/ordered/$VERSION` gibi bir isme sahip olacaktır (burada `ibc-hop`, `ibc-port` ve `ordered` kelimeleri doğrudan yazılacak, ancak `$HOPNAME`, `$PORTNAME` ve `$VERSION` ise farklı uçlar arasında değişecek olan değeri temsil eden yer tutuculardır).

Ayrıca oluşturmakta olduğunuz bağlantıyı yönetmek için bir `ConnectionHandler` nesnesi hazırlamanız gerekir. Bu, bağlantıda meydana gelen olaylar için çağrılacak birkaç metoda sahiptir, bunlar arasında paketlerin varışını da içerir. Bu,  bölümünde açıklanmıştır.

Sonra yerel `Port` üzerindeki `connect()` metodunu çağıracaksınız. Bu, veri gönderebileceğiniz yeni bir `Connection` nesnesiyle aksi bir `Promise` döndürecektir. `ConnectionHandler`'ınız, yeni kanal hakkında bilgilendirilecektir ve diğer taraftan gelen verileri alacaktır.

```js
const remoteEndpoint = `/ibc-hop/${hopName}/ibc-port/${portName}/ordered/${version}`;
E(home.ibcport[0])
  .connect(remoteEndpoint, connectionHandler)
  .then(conn => doSomethingWithConnection(conn));
```

## Dinleme Portunu Açma ve Gelen Bağlantıyı Kabul Etme

`connect()` metodunun diğer tarafı bir "dinleme portudur". Bu portlar, gelen bağlantıların kurulmasını bekleyerek durmaktadır.

Dinleme portu almak için, bir `NetworkInterface` nesnesine (örneğin, `home.network` altındaki `ag-solo` nesnesi) ihtiyacınız vardır ve ona bir uç noktaya `bind()` etmesini istemeniz gerekir. Belirli bir port adı sağlayabilir veya API'nin sizin için rastgele bir tane tahsis etmesine izin verebilirsiniz. Uç nokta, bu portun kabul edeceği bağlantının türünü (IBC, TCP, vb.) ve o bağlantının bazı özelliklerini belirler. `bind()` bu bilgilerin kodlanması için bir "çoklu adres" kullanır.

```js
// Rastgele bir tahsis istemek - bir "/" ile bitiyor
E(home.network)
  .bind('/ibc-port/')
  .then(port => usePort(port));

// ya da belirli bir port ismi istemek
E(home.network)
  .bind('/ibc-port/my-cool-port-name')
  .then(port => usePort(port));
```

IBC, iki belirli zincir arasında veri taşıyan adlandırılmış "atlamalara" sahiptir (IBC spesifikasyonunda "Bağlantılar" olarak adlandırdıkları). Bu atlamalar belgedeki bağlantılardan farklıdır. `/ibc-port/$PORT` gibi bir port için "atlama" belirtmeden bir port bağladığınızda, her hangi bir IBC zinciri bu portla bağlantı başlatabilir.

Bu port nesnesinin, özellikle rastgele bir tahsis istemişseniz, yerel adresini istemek üzerinden ulaşabilirsiniz (aksi takdirde hangi adresi aldığınızı bilmenin bir yolu yoktur):

```js
E(port)
  .getLocalAddress()
  .then(localAddress => useIt(localAddress));
```

Port bağlandıktan sonra, gelen bağlantılar için hazır olduğunu işaretlemek üzere `addListener()` çağrısında bulunmalısınız. Bununla birlikte, dinleme olaylarına yanıt vermek için bir `ListenHandler` nesnesi sağlamanız gerekebilir. `ConnectionHandler` ile benzer şekilde, bu metodların hepsi isteğe bağlıdır.

- `onListen(port, handler)`: port dinlemeye başladığında çağrılır
- `onAccept(port, remote, handler)`: yeni bir kanal kabul edildiğinde çağrılır
- `onError(port, rejection, handler)`: port, bağlantıların kabul edilemediğinde, örneğin, uzaktaki zincire olan Bağlantı başarısız olduğunda çağrılır, bu bir konsensüs hatası gözlemi ile olabilir
- `onRemove(port, handler)`: `ListenHandler` kaldırıldığında çağrılır

`ChannelHandler`'ınız hazır olduğunda, `addListener()` çağrısını yapın:

```js
port.addListener(handler).then(() => console.log('dinleyici aktif'));
```

`onAccept()` en önemli metoddur. Bir `remote` uç noktası ile çağrılır; bu, diğer uçtaki `Port` adresini gösterir ve bununla `connect()` çağrışı yapmış olan birinin bağlantıyı kabul edip etmeyeceğinizi veya gelen mesajlar üzerindeki yetkinizde ne tür bir otorite uygulamanız gerektiğini belirleyebilirsiniz.

Eğer kabul etmeyi seçerseniz, `onAccept()` metodunuz bir `Promise` döndürmelidir ve bu `ConnectionHandler` ile aynı şekilde kullanılacaktır. Reddetmek için bir hata fırlatın.

## Veri Gönderme

Ağ API'si (en azından IBC için), her paketin ağ üzerinden tam olarak iletildiği bir "kayıt borusu" sunar; bu, bir paketin nerede bitip diğerinin başladığını ayırt etmek için ek bir çerçeveleme gerektirmez. Bu, bağlantı başına genellikle uzunluk başlıkları ekleyerek çerçeve sınırlarını belirlemeyi gerektiren TCP bağlantısının sunduğu "bayt borusu" ile zıttır.

Bir `Connection` nesnesine sahip olduğunuzda, veri göndermek için `send()` metodunu çağırabilirsiniz:

```js
connection.send('veri');
```

`send()`, bağlantının diğer tarafı tarafından gönderilen ACK verilerine yönelik bir Promise döndürür; bu, `onReceive()` için gelen verilerle aynı şekilde temsil edilmektedir.

## Veri Alma

Her açık bağlantıya bir `ConnectionHandler` nesnesi sağlamalısınız; burada çeşitli olaylar gerçekleştiğinde çağrılacak yöntemler yazıyorsunuz. Aynı işleyici nesnesini birden fazla bağlantı arasında paylaşabilirsiniz veya her biri için ayrı bir tane oluşturabilirsiniz.

Metodlardan herhangi birini atlayabilirsiniz ve bu olaylar basitçe göz ardı edilecektir. Tüm bu metodlar, ilk argüman olarak Bağlantı nesnesini ve son argüman olarak `ConnectionHandler`'ı içerir; bu da, birden fazla bağlantı arasında ortak bir işleyici fonksiyonu paylaşmak isterseniz size yardımcı olabilir.

- `onOpen(connection, handler)`: bu, bağlantı kurulduğunda çağrılır; bu, uzak uç tarafının bağlantı talebini başarılı bir şekilde kabul ettiğini gösterir
- `onReceive(connection, packetBytes, handler)`: bu, uzak uç her veri paketi gönderdiğinde çağrılır
- `onClose(connection, reason, handler)`: bu, bağlantı kapandığında çağrılır; bu, bir tarafın kapanmasını talep etmesi veya bir hata oluşması nedeniyle olabilir. `reason` değeri `undefined` olabilir.

`onReceive()` en önemli metoddur. Uzak uç bir paket gönderdiğinde, `onReceive()` metodunuz, o paketin içindeki verilerle (şu anda inter-vat marshalling sınırlamaları nedeniyle bir String olarak, ancak idealde kendi `toString(encoding='latin1')` metodunda özel bir ArrayBuffer olarak) çağrılır.

`onReceive()` dönüş değeri nominal olarak, mesajın ACK verileri için bir Promise'dir (bu, eninde sonunda `connection.send()` tarafından döndürülen Promise üzerinde görünür).
IBC için, eğer ACK verileri boş bir değerseniz `''` olarak belirlenirse, uygulama otomatik olarak basit bir `'\x01'` ACK gönderir; çünkü boş ACK'lar  ile desteklenmez. Bu davranış, diğer ağ uygulamaları için farklı olabilir.
Mümkünse ACK verilerinden kaçınılması önerilir.

## Bağlantıyı Kapatma

Bir bağlantı artık işe yaramaz hale geldiğinde, kapatmalısınız:

```js
connection.close();
```

Bu, bir kapatma başlatır. Her iki taraftaki `ConnectionHandler`'lar nihayetinde `onClose()` metodlarına ayrıca bir `reason` ile çağrılır. Bu, kasıtlı bir `onClose()` ('reason' `undefined` olur) ile bir hata durumu arasında ayrım yapmalarını sağlar.

## Bir Dinleyiciyi Kaldırma

Artık bir portta bağlantı almak istemiyorsanız, dinleyiciyi kaldırabilirsiniz:

```js
port.removeListener(handler).then(() => console.log('kaldırıldı'));
```

Onu kaldırmak için eklediğiniz işleyiciyi sağlamalısınız; bu, aynı portta birden fazla dinleyiciye sahip olma yeteneğini gelecekte sağlamak için gereklidir.

Bu portta yeniden dinlemek istiyorsanız, daha önce olduğu gibi `port.addListener(...)` çağrısını yapabilirsiniz. Yeni bir bağlantı başlatmak isterseniz, her zaman `port.connect(...)` çağrısını yapabilirsiniz.

### Portu Tamamen Kapatma

Bir dinleyiciyi kaldırmak, port adresini diğer `bind()` taleplerine uygun hale getirmek için serbest bırakmaz. Bunu tamamen tahsis etmek ve tüm dinleyicileri kaldırmak, tüm bekleyen bağlantıları kapatmak ve adresini serbest bırakmak için aşağıdakini çağırabilirsiniz:

```js
port.revoke();
```

**DİKKAT:** `E(home.ibcport[0]).revoke()` çağrısı yaparsanız, bu artık yeni `connect()` veya `addListener()` çağrıları için işe yaramaz olacaktır. İşlevsel bir `home.ibcport[0]` ile yeni bir kurulum elde etmek için yeni bir Agoric istemcisinin sağlanması gerekecektir.