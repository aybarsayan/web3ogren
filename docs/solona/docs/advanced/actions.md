---
sidebarLabel: "Eylemler ve Blinks"
title: "Eylemler ve Blinks"
seoTitle: "Eylemler ve Blinks"
description:
  "Solana Eylemleri, kullanıcıların önizlemesi ve imzalaması için işlem döndüren API'lerdir.
  Blockchain bağlantıları - veya blink'ler - Eylemleri paylaşılabilir, 
  metadata zengin bağlantılara dönüştürür."
altRoutes:
  - /docs/actions
  - /docs/blinks
  - /docs/advanced/blinks
---

`Solana Eylemleri`, kullanıcının önizleme, imzalama ve çeşitli
bağlamlarda gönderme işlemleri gerçekleştirebilmesi için Solana blockchain'inde işlem döndüren 
uygunluk standartlarına uygun API'lerdir. Eylemler, geliştiricilerin 
Solana ekosisteminde yapabileceğiniz şeyleri
ortama entegre etmelerini kolaylaştırır. Bu sayede blok zincir işlemlerini farklı bir uygulama veya web sayfasına
geçiş yapmadan gerçekleştirebilirsiniz.

:::info
`Blockchain bağlantıları` - veya blink'ler - her Solana Eylemini, 
paylaşılabilir, metaveri zengin bir bağlantıya dönüştürür. 
:::

Blink'ler, Eylem farkındalığına sahip istemcilerin (tarayıcı uzantı cüzdanları, botlar) 
kullanıcı için ek özellikler göstermesine olanak tanır. 

Bir web sitesinde, bir blink, merkezi olmayan bir uygulamaya gitmeden 
cüzdanda işlem önizlemesini hemen tetikleyebilir. 
Discord'da, bir bot blink’i etkileşimli bir düğme setine genişletebilir. Bu, zincir üzerinde etkileşim kurma yeteneğini, 
URL'yi görüntüleyebilen herhangi bir web yüzeyine taşır.

## Başlayın

Özel Solana Eylemleri oluşturmaya hızlı bir şekilde başlamak için:

```shell
npm install @solana/actions
```

- uygulamanızda 
  [Solana Eylemleri SDK](https://www.npmjs.com/package/@solana/actions) kurun
- Eyleminiz hakkında veri döndüren 
  `GET isteği` için bir API uç noktası oluşturun
- kullanıcı için imzalanabilir işlemi döndüren 
  `POST isteğini` kabul eden bir API uç noktası oluşturun

> `@solana/actions` SDK'sını kullanarak
> [bir Solana Eylemi nasıl oluşturulur](https://www.youtube.com/watch?v=kCht01Ycif0) konulu
> bu video eğitimi göz atın.
>
> Ayrıca bir Eylem için 
> [kaynak kodunu](https://github.com/solana-developers/solana-actions/blob/main/examples/next-js/src/app/api/actions/transfer-sol/route.ts)
> SOL transferi gerçekleştiren buradan bulabilir ve 
> [bu repoda](https://github.com/solana-developers/solana-actions/tree/main/examples) 
> birkaç başka örnek Eylem bulabilirsiniz.

---

Özel Solana Eylemlerinizi üretime dağıtırken:

- uygulamanızın alan adınızın kökünde geçerli bir 
  `actions.json dosyası` olduğundan emin olun
- uygulamanızın tüm Eylem uç noktalarında 
  `gerekli Cross-Origin başlıkları` ile yanıt verdiğinden emin olun, 
  `actions.json` dosyası da dahil
- blink'lerinizi/eylemlerinizi test edin ve hata ayıklayın 
  [Blinks Inspector](https://www.blinks.xyz/inspector) kullanarak

Eylemler ve blink'ler oluşturma konusunda ilham arıyorsanız, 
topluluk oluşturması ve hatta 
[yeni fikirler](https://github.com/solana-developers/awesome-blinks/discussions/categories/ideas-for-blinks) için
göz atmak için [Awesome Blinks](https://github.com/solana-developers/awesome-blinks) 
repo'sunu kontrol edin.

## Eylemler

Solana Eylemleri spesifikasyonu, bir uygulamadan doğrudan kullanıcıya imzalanabilir
işlemleri (ve nihayetinde imzalanabilir mesajları) sunmak için bir dizi standart API
kullanır. Kamuya açık, erişilebilir URL'lerde barındırılırlar ve bu nedenle 
herhangi bir istemcinin etkileşime geçebilmesi için URL'leri üzerinden erişilebilirler.

> Eylemleri, bir kullanıcının blok zincir cüzdanı ile imzalayabileceği 
> meta veri ve bir şey döndüren bir API uç noktası olarak düşünebilirsiniz 
> (ya bir işlem ya da bir kimlik doğrulama mesajı).

Eylemler API'si, bir Eylem URL uç noktasına 
basit `GET` ve `POST` istekleri yapmaktan ibarettir ve 
Eylemler arayüzüne uygun yanıtları yönetir.

1. `GET isteği`, bu URL'de hangi eylemlerin mevcut olduğuna dair 
   insan tarafından okunabilir bilgi sağlayan meta veriyi döndürür ve 
   isteğe bağlı bir ilgili eylemler listesi içerir.
2. `POST isteği`, istemcinin daha sonra 
   kullanıcının cüzdanının imzalaması ve blok zincir üzerinde yürütmesi için 
   imzalanabilir bir işlem veya mesaj döndürür.

### Eylem Yürütme ve Yaşam Döngüsü

Pratikte, Eylemlerle etkileşim kurmak, tipik bir REST API ile etkileşim kurmaya
yakın bir şekilde görünmektedir:

- bir istemci, mevcut Eylemler hakkında meta veriyi almak için 
  bir Eylem URL'sine ilk `GET` isteğini yapar
- uç nokta, uç noktanın meta verisi (uygulamanın başlığı ve simgesi gibi) ve 
  bu uç nokta için mevcut eylemlerin bir listesini içeren bir yanıt döndürür
- istemci uygulaması (bir mobil cüzdan, sohbet botu veya web sitesi gibi) kullanıcının 
  bir eylemi gerçekleştirip geçirerek bir UI (kullanıcı arayüzü) görüntüler
- kullanıcı bir eylemi seçtikten sonra (bir düğmeye tıklayarak), istemci, 
  kullanıcının imzalaması için işlemi almak amacıyla uç noktaya 
  bir `POST` isteği yapar
- cüzdan kullanıcıya işlemi imzalatır ve sonuçta işlemi 
  onay için blok zincirine gönderir

![Solana Eylemleri Yürütme ve Yaşam Döngüsü](../../images/solana/public/assets/docs/action-execution-and-lifecycle.png)

Eylemler URL'sinden işlemleri alırken, istemciler bu işlemlerin blok zincirine 
gönderimini sağlamalı ve durum yaşam döngüsünü yönetmelidir.

:::warning
Eylemler ayrıca yürütmeden önce belirli bir düzeyde iptalleri destekler. 
`GET` ve `POST` isteği, eylemin alınabilir olup olmadığını belirten bazı meta veriler döndürebilir 
(örneğin, `disabled` alanı ile).
:::

Örneğin, bir DAO yönetim önerisinde oylama kolaylaştıran bir Eylem uç noktası varsa ve oylama süresi dolmuşsa, 
ilk `GET isteği` "Bu öneri artık oylamada değil" hata 
mesajını ve "Evet Oyu Ver" ile "Hayır Oyu Ver" butonlarını "devre dışı" olarak 
döndürebilir.

## Blinks

Blink'ler (blockchain bağlantıları), Eylem API'lerini inceleyen ve
Eylemlerle etkileşim kurmak ve yürütmek için kullanıcı arayüzleri oluşturan istemci
uygulamalardır.

Blink'leri destekleyen istemci uygulamaları, yalnızca Eylem uyumlu URL'leri algılar,
parçalar ve kullanıcıların bunlarla standartlaştırılmış kullanıcı arayüzlerinde
etkileşimde bulunmasına olanak tanır.

> Eylem API'sini tamamen inceleyen ve onun için 
> eksiksiz bir arayüz oluşturan her istemci uygulaması bir _blink_ olarak
> kabul edilir. Bu nedenle, tüm istemciler Eylem API'lerini tüketen 
> blink'ler değildir.

### Blink URL Spesifikasyonu

Bir blink URL'si, kullanıcıya bir Eylemin tam 
`yürütme yaşam döngüsünü` tamamlama imkanı sağlayan 
bir istemci uygulamasını tanımlar, cüzdanları ile imzalamayı içerir.

```text
https://example.domain/?action=<action_url>
```

Herhangi bir istemci uygulamasının blink haline gelmesi için:

- Blink URL'si, değeri URL kodlu olan bir `action` sorgu parametresini içermelidir 
  `Eylem URL'si`. Bu değer, diğer protokol parametreleriyle çakışmaması için
  [URL kodlanmış](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  olmalıdır.

- İstemci uygulaması, `action` sorgu parametresini
  [URL çözüp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
  sağlanan Eylem API bağlantısını incelemelidir (bkz. 
  `Eylem URL şeması`).

- İstemci, bir kullanıcının 
  tam `yürütme yaşam döngüsünü` tamamlamasını sağlayan 
  zengin bir kullanıcı arayüzü oluşturmalıdır, cüzdanları ile imzalamayı içerir.

> Tüm blink istemci uygulamaları (örneğin web siteleri veya dApp'ler) 
> tüm Eylemleri desteklemeyecek. Uygulama geliştiricileri, 
> blink arayüzlerinde hangi Eylemleri desteklemek istediklerini seçebilir.

Aşağıdaki örnek, URL kodlu 
`solana-action:https://actions.alice.com/donate` değerine sahip geçerli bir blink URL'sini gösterir:

```text
https://example.domain/?action=solana-action%3Ahttps%3A%2F%2Factions.alice.com%2Fdonate
```

### Eylemleri Blink'ler Üzerinden Algılama

Blink'ler, Eylemlerle en az 3 şekilde bağlantılandırılabilir:

1. Açık bir Eylem URL'sini paylaşarak:
   `solana-action:https://actions.alice.com/donate`

   Bu durumda, yalnızca desteklenen istemciler
   blink'i görüntüleyebilir. Desteklemeyen bir istemci dışında
   herhangi bir yedek bağlantı önizlemesi veya ziyaret edilebilecek bir alan olmayacaktır.

2. Bir web sitesine bağlantı paylaşarak, bu 
   `actions.json dosyasındaki` üzerinden Eylem API'sine bağlıdır.

   Örneğin, `https://alice.com/actions.json`, 
   kullanıcıların Alice'e bağış yapabilecekleri 
   `https://alice.com/donate` web sitesi URL'sini, 
   Alice'e bağış yapma Eylemlerinin barındırıldığı API URL'si 
   `https://actions.alice.com/donate`'e eşler.

3. Eylem URL'sini "araya giren" bir site URL'sine gömerek 
   Eylemleri çözümleme yeteneğine sahip.

   ```text
   https://example.domain/?action=<action_url>
   ```

Blink'leri destekleyen istemcilerin, yukarıdaki formatların herhangi birini alabilmesi 
ve doğrudan istemcide eylemi yürütmeye yönelik bir arayüzü doğru bir şekilde görüntüleyebilmesi gerekir.

Blink'leri desteklemeyen istemciler için, arka planda bir web sitesi 
olmalıdır (tarayıcı evrensel bir yedekleme haline gelir).

Kullanıcı, eylem düğmesi veya metin girişi alanı olmayan bir istemciye 
herhangi bir yere tıkladığında, arka plandaki siteye yönlendirilmelidir.

### Blink Testi ve Doğrulama

Solana Eylemleri ve blink'ler izinsiz bir protokol/spesifikasyon olsa da, 
istemci uygulamaları ve cüzdanlar, kullanıcılara işlemi imzalatmalarını sağlamak için
hala gerekli olanı sağlamalıdır.

> Blink'lerinizi ve eylemlerinizi doğrudan tarayıcınızda inceleme, 
> hata ayıklama ve test etme için [Blinks Inspector](https://www.blinks.xyz/inspector) 
> aracını kullanın. GET ve POST yanıt yüklerini, yanıt başlıklarını görebilir ve 
> bağlantılı Eylemleriniz için tüm girdileri test edebilirsiniz.

Her istemci uygulaması veya cüzdanın, 
kullanıcıların sosyal medya platformlarında otomatik olarak açılacak ve 
derhal görüntülenecek Eylem uç noktaları hakkında farklı gereksinimleri olabilir.

:::note
Örneğin, bazı istemciler, 
kullanıcılar için bir Eylemi açmadan önce doğrulamaya ihtiyaç duyan 
"izin listesi" yaklaşımına göre çalışabilir. 
:::

Tüm blink'ler, Di̇alekt'in
[dial.to](https://dial.to) blink'leri araya giren sitesinde imzalamak ve 
işlem yapmak için görüntülenecek ve kayıtlı durumları blink'te görüntülenecektir.

### Di̇alekt'in Eylem Kaydı

Solana ekosistemi için bir kamu malı olarak, [Dialect](https://dialect.to), 
solana ekosistemine katkıda bulunan 
Solana Vakfı ve diğer topluluk üyeleri ile birlikte 
önceden doğrulanmış ve bilinen kaynaklardan gelen blockchain bağlantılarının 
kamuya açık bir kaydını tutmaktadır. Başladığı andan itibaren, yalnızca 
Dialect kaydında kayıtlı Eylemler, paylaşıldığında Twitter akışında açılacaktır.

İstemci uygulamaları ve cüzdanlar, kullanıcı güvenliğini ve
güvenliğini sağlamak için bu kamu kaydını veya başka bir çözüm kullanmayı
özgürce seçebilir. Eğer Di̇alekt kaydında doğrulanmamışsa, 
blockchain bağlantısı blink istemcisi tarafından 
değişiklik yapılmadan, sıradan bir URL olarak görüntülenecektir.

Geliştiriciler, burada Di̇alekt tarafından doğrulanmak için
başvuruda bulunabilir: 
[dial.to/register](https://dial.to/register)

## Spesifikasyon

Solana Eylemleri spesifikasyonu, bir isteğin/cevabın etkileşim akışının 
bir parçası olan ana bölümlerden oluşur:

- Solana Eylem `URL şeması` bir Eylem URL'si sağlama
- `OPTIONS yanıtı` bir Eylem URL'sine CORS gereksinimlerini 
  iletme
- `GET isteği` bir Eylem URL'sine
- `GET yanıtı` sunucudan
- `POST isteği` bir Eylem URL'sine
- `POST yanıtı` sunucudan

Bu isteklerin her biri, _Eylem istemcisi_ (örneğin cüzdan uygulaması, tarayıcı
uzantısı, dApp, web sitesi vb.) tarafından, zengin kullanıcı
arayüzleri için belirli meta verileri toplamak ve 
Eylemler API'sine kullanıcı girdisini kolaylaştırmak için yapılır.

Yanıtların her biri, bir uygulama (örneğin web sitesi, sunucu
arka ucu vb.) tarafından oluşturulur ve _Eylem istemcisine_ geri 
dönülür. Sonuç olarak, kullanıcının onaylaması, imzalaması ve 
blok zincirine göndermesi için bir imzalanabilir işlem veya mesaj sağlayarak.

> Bu readme dosyasında tanımlanan türler ve arayüzler, 
> okunabilirliği artırmak için genellikle basitleştirilmiş versiyonlardır.
>
> Daha iyi tür güvenliği ve geliştirilmiş geliştirici deneyimi için, 
> `@solana/actions-spec` paketi daha karmaşık tür tanımlamaları içerir. 
> Onlar için 
> [kaynak kodunu burada bulabilirsiniz](https://github.com/solana-developers/solana-actions/blob/main/packages/actions-spec/index.d.ts).

### URL Şeması

Bir Solana Eylem URL'si, kullanıcıya 
imzalanabilir bir Solana işlemi veya mesajı için etkileşimli bir istemi
tanımlar ve 
`solana-action` protokolünü kullanır.

İstek etkileşimlidir çünkü URL'deki parametreler
bir istemci tarafından, kullanıcıya imzalanabilir bir işlem veya mesaj 
oluşturmak için bir dizi standart HTTP isteği yapmak için 
kullanılır.

```text
solana-action:<link>
```

- Bir adet `link` alanı, yol adı olarak gereklidir. Değerin, koşullu olarak
  [URL kodlanması](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  gereken mutlak HTTPS URL'si olması gerekir.

- Eğer URL sorgu parametreleri içeriyorsa, URL kodlanmış olmalıdır. URL değerinin 
  kodlanması, protokol spesifikasyonu ile eklenen herhangi bir Eylem parametreleriyle 
  çakışmasını önler.

- Eğer URL sorgu parametreleri içermiyorsa, URL kodlanmamalıdır. 
  Bu, daha kısa bir URL ve daha az yoğun bir QR kodu oluşturur.

Her iki durumda da, istemciler
[URL çözmeli](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
değeri çözmelidir. Değer zaten çözülmemişse, bu durum üzerinde etkisi yoktur. 
Eğer çözülen değer mutlak bir HTTPS URL'si değilse, cüzdan bunu **yanlış yapılandırılmış** olarak reddetmelidir.

### OPTIONS Yanıtı

Eylem istemcilerinin (blink'ler dahil) CORS'a izin vermek için,
tüm Eylem uç noktalarının, `OPTIONS` metodu için geçerli başlıklarla 
HTTP isteklerine yanıt vermesi gerekmektedir. Bu başlıklar, 
istemcilerin kendi aynı köken alanlarından gelen tüm sonraki istekler için 
CORS kontrollerinden geçmesine izin verecektir.

Bir Eylem istemcisi, 
"Eylem URL'sine yönelik [ön kontrol](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)"
istekleri yaparak, sonraki GET isteğinin Eylem URL'sine
tüm CORS kontrollerinden geçip geçmeyeceğini kontrol edebilir. 
Bu CORS ön kontrol kontrolleri, `OPTIONS` HTTP metodu kullanılarak yapılır
ve Eylem istemcilerini (blink'ler gibi) kendi kaynak alanlarından tüm 
daha sonraki istekleri yapabilmeleri için gerekli HTTP başlıkları ile yanıt vermelidir.

Minimumda, gerekli HTTP başlıkları şunlar olmalıdır:

- `Access-Control-Allow-Origin` değeri `*` ile 
  - bu, tüm Eylem istemcilerin CORS kontrollerini güvenle geçebilmesini 
    sağlar ve tüm gerekli istekleri yapabilir.
- `Access-Control-Allow-Methods` değeri
  `GET,POST,PUT,OPTIONS` 
  - Eylemler için tüm gerekli HTTP istek yöntemlerinin desteklendiğinden emin olur.
- `Access-Control-Allow-Headers` minimum değeri 
  `Content-Type, Authorization, Content-Encoding, Accept-Encoding`

Basitlik amacıyla, geliştiricilerin `OPTIONS` isteklerine
aynı yanıt ve başlıkları döndürmeyi düşünmeleri önerilir. 
`GET` yanıtı` gibi.

---


`actions.json` dosyası yanıtı, 
`GET` ve `OPTIONS` istekleri için geçerli Cross-Origin başlıkları 
dönmelidir, özellikle de `Access-Control-Allow-Origin` 
başlık değeri `*` olmalıdır.

Aşağıda `actions.json` hakkında daha fazla ayrıntı için bakın.


### GET İsteği

Eylem istemcisi (örneğin, cüzdan, tarayıcı uzantısı vb.) 
Eylem'in URL uç noktasına HTTP `GET` JSON isteği yapmalıdır.

- İstek, cüzdan veya kullanıcıyı tanımlamamalıdır.
- İstemci isteği, 
  [`Accept-Encoding` başlığı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) ile yapmalıdır.
- İstemci, isteği yaparken URL'nin alan adını görüntülemelidir.

### GET Yanıtı

Eylem'in URL uç noktası (örn. uygulama veya sunucu arka ucu) HTTP 
`OK` JSON yanıtı (vücutta geçerli bir yük ile) veya uygun bir HTTP hatası 
ile yanıt vermelidir.

- İstemci, HTTP 
  [istemci hatalarına](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses), 
  [sunucu hatalarına](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses) 
  ve [yönlendirme yanıtlarına](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages) 
  yanıt vermelidir.
- Uç nokta, HTTP sıkıştırma için bir 
  [`Content-Encoding` başlığı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) ile yanıt vermelidir.
- Uç nokta,  `application/json` değerine sahip bir 
  [`Content-Type` başlığı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) 
  ile yanıt vermelidir.

- İstemci, yanıtı yalnızca, 
  [HTTP önbellekleme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching)
  yanıt başlıklarıyla talimat verilmediği takdirde önbelleğe almamalıdır.
- İstemci `title`'ı görüntülemeli ve kullanıcıya `icon` 
  resmini sağlamalıdır.

Hata yanıtları (yani HTTP 4xx ve 5xx durum kodları), kullanıcılara yardımcı bir hata 
mesajı sunmak için `ActionError` yapısını izleyen bir JSON yanıt gövdesi döndürmelidir. 
Bkz. `Eylem Hataları`.

#### GET Yanıt Gövdesi

HTTP `OK` JSON yanıtı ile bir `GET` yanıtı, arayüz spesifikasyonunu takip eden bir gövde yükü içermelidir:

```ts filename="ActionGetResponse"
export type ActionType = "action" | "completed";

export type ActionGetResponse = Action<"action">;

export interface Action<T extends ActionType> {
  /** Kullanıcıya sunulacak eylem türü */
  type: T;
  /** Eylem isteğinin kaynağını temsil eden resim URL'si */
  icon: string;
  /** Eylem isteğinin kaynağını tanımlayan metin */
  title: string;
  /** Gerçekleştirilecek eylemin kısa özeti */
  description: string;
  /** Kullanıcıya gösterilecek buton metni */
  label: string;
  /** Kullanıcıya gösterilen butonun UI durumu */
  disabled?: boolean;
  links?: {
    /** Kullanıcının gerçekleştirebileceği ilgili eylemlerin listesi */
    actions: LinkedAction[];
  };
  /** Kullanıcıya gösterilecek ölümcül olmayan hata mesajı */
  error?: ActionError;
}
```

- `type` - Kullanıcıya verilen eylem türü. Varsayılan olarak `action`dır. İlk `ActionGetResponse` 'nin bir türü `action` olmalıdır.

  - `action` - Kullanıcının herhangi bir `LinkedActions` ile etkileşimde bulunmasını sağlayan standart eylem.
  - `completed` - Eylem zincirleme içinde "tamamlandı" durumunu belirtmek için kullanılır.

- `icon` - Değer, bir ikon resminin mutlak HTTP veya HTTPS URL'si olmalıdır. Dosya bir SVG, PNG veya WebP resmi olmalıdır; aksi takdirde istemci/cüzdan bunu **bozuk** olarak reddeder.

- `title` - Değer, eylem isteğinin kaynağını temsil eden UTF-8 dizesi olmalıdır. Örneğin, bu bir markanın, mağazanın, uygulamanın veya istekte bulunan bir kişinin adı olabilir.

- `description` - Değer, eylem hakkında bilgi veren bir UTF-8 dizesi olmalıdır. Açıklama kullanıcıya gösterilmelidir.

- `label` - Değer, kullanıcı ilgisi için tıklanacak bir buton üzerinde gösterilecek bir UTF-8 dizesi olmalıdır. Tüm etiketler 5 kelimelik ifadeyi aşmamalı ve kullanıcının almasını istediğiniz eylemi pekiştirmek için bir fiil ile başlamalıdır. Örneğin, "NFT Mintle", "Evet Oyu Ver" veya "1 SOL Stake Et".

- `disabled` - Değer, gösterilen butonun (gösterilecek olan `label` dizesi) devre dışı durumunu temsil eden bir boolean olmalıdır. Değer belirtilmezse, `disabled` varsayılan olarak `false` olmalıdır (yani varsayılan olarak etkin). Örneğin, eylem uç noktası kapanmış bir yönetişim oyu içinse, `disabled=true` ayarlanmalı ve `label` "Oylama Kapandı" olarak belirtilebilir.

- `error` - Ölümcül olmayan hatalar için isteğe bağlı hata belirtimidir. Varsa, istemcinin bunu kullanıcıya göstermesi gerekir. Eğer ayarlanmışsa, kullanıcıya eylemi yorumlamasını veya göstermesini engellememelidir (bkz. `Eylem Hataları`). Örneğin, hata iş kısıtları, yetkilendirme, durum veya dış kaynak hatası gibi nedenleri göstermek için `disabled` ile birlikte kullanılabilir.

- `links.actions` - Uç nokta için isteğe bağlı bir dizi ilgili eylem. Kullanıcılara listelenen her bir eylem için UI gösterilmeli ve yalnızca birini gerçekleştirmeleri beklenmelidir. Örneğin, bir yönetişim oyu eylem uç noktası kullanıcının "Evet Oyu Ver", "Hayır Oyu Ver" ve "Oylamadan Çekil" gibi üç seçenek döndürmesi gerekebilir.

  - Eğer `links.actions` sağlanmazsa, istemci kök `label` dizesini kullanarak tek bir buton göstermeli ve aynı eylem URL uç noktasına POST isteği yapmalıdır.

  - Eğer herhangi bir `links.actions` sağlanıyorsa, istemci yalnızca `links.actions` alanında listelenen öğelere dayalı butonlar ve giriş alanları göstermelidir. İstemci, kök `label` içeriği için bir buton göstermemelidir.

```ts filename="LinkedAction"
export interface LinkedAction {
  /** Eylem için URL uç noktası */
  href: string;
  /** Kullanıcıya gösterilecek buton metni */
  label: string;
  /**
   * Eylem içinde kullanıcı girişini kabul edecek parametreler
   * @see {ActionParameter}
   * @see {ActionParameterSelectable}
   */
  parameters?: Array<TypedActionParameter>;
}
```

`ActionParameter`, Eylem API'sının kullanıcıdan talep ettiği girişi bildirir:

```ts filename="ActionParameter"
/**
 * Eylem içinde kullanıcı girişini kabul edecek parametre
 * okuma kolaylığı için bu, aslında kullanılan türün basitleştirilmiş bir çeşididir
 */
export interface ActionParameter {
  /** Giriş alanı türü */
  type?: ActionParameterType;
  /** URL'deki parametre adı */
  name: string;
  /** Kullanıcı giriş alanı için yer tutucu metni */
  label?: string;
  /** Bu alanın gerekli olup olmadığını bildirin (varsayılan olarak `false`) */
  required?: boolean;
  /** Kullanıcı girişini istemci tarafında doğrulamak için düzenli ifade deseni */
  pattern?: string;
  /** `type` veya `pattern`'in insan tarafından okunabilen açıklaması, bir başlık ve hata temsil eder, değer eşleşmezse */
  patternDescription?: string;
  /** `type`'a dayalı olarak izin verilen minimum değer */
  min?: string | number;
  /** `type`'a dayalı olarak izin verilen maksimum değer */
  max?: string | number;
}
```

`pattern`, geçerli bir düzenli ifadenin dize eşdeğeridir. Bu düzenli ifade deseni, blink-istemcileri tarafından POST isteği yapılmadan önce kullanıcı girişinin doğrulanması için kullanılmalıdır. Eğer `pattern` geçerli bir düzenli ifade değilse, istemciler tarafından görmezden gelinmelidir.

> **Not:** `patternDescription`, kullanıcıdan beklenen giriş taleplerinin insan tarafından okunabilen bir tanımıdır. Eğer `pattern` sağlanırsa, `patternDescription` sağlanması zorunludur.

`min` ve `max` değerleri, kullanıcının talep ettiği girişi ayarlamak için bir alt ve/veya üst sınır koymaya izin verir (yani min/max sayı veya min/max karakter uzunluğu) ve istemci tarafında doğrulama için kullanılmalıdır. `date` veya `datetime-local` giriş `type`ları için bu değerlerin dize tarihleri olması gerekir. Diğer dize tabanlı giriş `type`ları için değerler, min/max karakter uzunluğunu temsil eden sayılar olmalıdır.

Eğer kullanıcı girişi değeri `pattern`'e göre geçerli olarak kabul edilmiyorsa, kullanıcıya istemci tarafında giriş alanının geçerli olmadığına dair bir hata mesajı gösterecek ve `patternDescription` dizesini gösterilecektir.

`type` alanı, Eylem API'sinin daha spesifik kullanıcı giriş alanlarını bildirmesine izin verir; istemci tarafında daha iyi doğrulama sağlar ve kullanıcı deneyimini geliştirir. Çoğu durumda, bu tür, standart [HTML giriş elementi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) ile benzerlik gösterecektir.

`ActionParameterType` aşağıdaki tür olarak basitleştirilebilir:

```ts filename="ActionParameterType"
/**
 * Kullanıcıya sunulacak giriş alanı türü
 * @default `text`
 */
export type ActionParameterType =
  | "text"
  | "email"
  | "url"
  | "number"
  | "date"
  | "datetime-local"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select";
```

Her `type` değeri, karşılık gelen `type` için standart HTML `input` elementine (örneğin, ``) benzeyen bir kullanıcı girişi alanı ile sonuçlanmalıdır ve istemci tarafında daha iyi bir doğrulama ve kullanıcı deneyimi sağlamalıdır:

- `text` - HTML'deki [“text” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text) elementine eşdeğer.
- `email` - HTML'deki [“email” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email) elementine eşdeğer.
- `url` - HTML'deki [“url” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url) elementine eşdeğer.
- `number` - HTML'deki [“number” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number) elementine eşdeğer.
- `date` - HTML'deki [“date” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) elementine eşdeğer.
- `datetime-local` - HTML'deki [“datetime-local” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local) elementine eşdeğer.
- `checkbox` - HTML'deki standart [“checkbox” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox) elementleri grubuna eşdeğer. Eylem API'sı, aşağıda ayrıntıları belirtilen `options` döndürmelidir. Kullanıcı, sağlanan birden fazla onay kutusu seçeneğini seçebilmelidir.
- `radio` - HTML'deki standart [“radio” girişi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) elementleri grubuna eşdeğer. Eylem API'sı, aşağıda ayrıntıları belirtilen `options` döndürmelidir. Kullanıcı yalnızca sağlanan bir radyo seçeneğini seçebilmelidir.
- Yukarıda belirtilmeyen diğer HTML giriş türü eşdeğerleri (gizli, buton, gönder, dosya vb.) şu anda desteklenmemektedir.

Yukarıdaki HTML giriş türlerine benzeyen elemanlara ek olarak, aşağıdaki kullanıcı girişi elemanları da desteklenmektedir:

- `textarea` - HTML'deki [textarea elementi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) ile eşdeğerdir. Kullanıcının çok satırlı giriş vermesine izin verir.
- `select` - HTML'deki [select elementi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) ile eşdeğerdir ve kullanıcının "açılır" stil bir alan deneyimi yaşamasını sağlar. Eylem API'sı, aşağıda ayrıntıları belirtilen `options` döndürmelidir.


Detaylar

`type` `select`, `checkbox` veya `radio` olarak ayarlandığında, Eylem API'sı, her biri minimum olarak bir `label` ve `value` sağlayan bir `options` dizisi sağlamalıdır. Her bir seçeneğin, kullanıcının geçerli olarak hangi seçeneklerin varsayılan olarak seçileceğini bilgilendirmek için bir `selected` değeri de olabilir (bkz. `checkbox` ve `radio` arasındaki farklılıklar).

Bu `ActionParameterSelectable`, aşağıdaki tür tanımına basitleştirilebilir:

```ts filename="ActionParameterSelectable"
/**
 * okuma kolaylığı için bu, aslında kullanılan türün basitleştirilmiş bir çeşididir
 */
interface ActionParameterSelectable extends ActionParameter {
  options: Array<{
    /** Bu seçilebilir seçeneğin gösterilen UI etiketi */
    label: string;
    /** Bu seçilebilir seçeneğin değeri */
    value: string;
    /** Bu seçeneğin varsayılan olarak seçilip seçilmeyeceği */
    selected?: boolean;
  }>;
}
```

Eğer `type` belirlenmezse veya bilinmeyen/uygun olmayan bir değer ayarlanırsa, blink-istemcileri varsayılan olarak `text` değerine geçmeli ve basit bir metin girişi göstermelidir.

Eylem API'sı, kullanıcı giriş parametrelerinden alınan tüm verileri doğrulamak ve temizlemekle hala sorumludur, gerekli olan herhangi bir "zorunlu" kullanıcı girişini uygulamak için.

HTML/web tabanlı olmayan (yerel mobil gibi) platformlar için, yukarıda tanımlanan HTML/web giriş türleri ile karşılık gelen yerel kullanıcı girişi bileşeni kullanılmalıdır.


#### Örnek GET Yanıtı

Aşağıdaki örnek yanıt, kullanıcıya "Erişim Token'ını Talep Et" etiketine sahip tek bir "kök" eylem sunmayı beklemektedir:

```json
{
  "title": "HackerHouse Etkinlikleri",
  "icon": "<url-to-image>",
  "description": "Hackerhouse erişim token'ınızı talep edin.",
  "label": "Erişim Token'ını Talep Et" // buton metni
}
```

Aşağıdaki örnek yanıt, kullanıcıya bir DAO önerisi için oylarını vermek üzere 3 düğmeyi tıklama imkanını sunan 3 ilgili eylem bağlantısı sağlamaktadır:

```json
{
  "title": "Realms DAO Platformu",
  "icon": "<url-to-image>",
  "description": "DAO yönetişim önerilerine #1234 oy verin.",
  "label": "Oy Ver",
  "links": {
    "actions": [
      {
        "label": "Evet Oyu Ver", // buton metni
        "href": "/api/proposal/1234/vote?choice=yes"
      },
      {
        "label": "Hayır Oyu Ver", // buton metni
        "href": "/api/proposal/1234/vote?choice=no"
      },
      {
        "label": "Oylamadan Çekil", // buton metni
        "href": "/api/proposal/1234/vote?choice=abstain"
      }
    ]
  }
}
```

#### Parametrelerle Örnek GET Yanıtı

Aşağıdaki örnek yanıt, kullanıcıdan metin girişi kabul etme (üzerinden `parameters`) ve bu girişi final `POST` isteği uç noktasında kullanma biçimini göstermektedir (`LinkedAction` içindeki `href` alanı aracılığıyla):

Aşağıdaki örnek yanıt, kullanıcının SOL stake etmesine olanak tanıyan 3 bağlantılı eylem sunmaktadır: "1 SOL Stake Et" etiketli bir buton, "5 SOL Stake Et" etiketli bir başka buton ve eylem API'sine gönderilecek belirli bir "miktar" değeri girmesine olanak tanıyan bir metin giriş alanı:

```json
{
  "title": "Stake-o-matic",
  "icon": "<url-to-image>",
  "description": "SOL stake ederek Solana ağını güvence altına alın.",
  "label": "SOL Stake Et", // gösterilmez çünkü `links.actions` sağlanmıştır
  "links": {
    "actions": [
      {
        "label": "1 SOL Stake Et", // buton metni
        "href": "/api/stake?amount=1"
        // `parameters` yok, bu nedenle metin giriş alanı değil
      },
      {
        "label": "5 SOL Stake Et", // buton metni
        "href": "/api/stake?amount=5"
        // `parameters` yok, bu nedenle metin giriş alanı değil
      },
      {
        "label": "Stake Et", // buton metni
        "href": "/api/stake?amount={amount}",
        "parameters": [
          {
            "name": "amount", // alan adı
            "label": "SOL miktarı" // metin girişi yer tutucusu
          }
        ]
      }
    ]
  }
}
```

Aşağıdaki örnek yanıt, kullanıcının `amount` girmesi için bir giriş alanı sağlamaktadır ve bu, POST isteği ile gönderilir (ya bir sorgu parametresi ya da bir alt yol kullanılabilir):

```json
{
  "icon": "<url-to-image>",
  "label": "SOL Bağışla",
  "title": "İyi Amaçlı Hayır Kurumuna Bağış Yap",
  "description": "Bu hayır kurumunu destekleyerek SOL bağışında bulunun.",
  "links": {
    "actions": [
      {
        "label": "Bağış Yap", // buton metni
        "href": "/api/donate/{amount}", // ya da /api/donate?amount={amount}
        "parameters": [
          // {amount} giriş alanı
          {
            "name": "amount", // giriş alanı adı
            "label": "SOL miktarı" // metin girişi yer tutucusu
          }
        ]
      }
    ]
  }
}
```

### POST İsteği

İstemci, eylem URL'sine bir HTTP `POST` JSON isteği yapmalıdır. Gövde yükü şu şekilde olmalıdır:

```json
{
  "account": "<account>"
}
```

- `account` - Değer, işlemi imzalayabilecek bir hesabın base58 ile kodlanmış genel anahtarı olmalıdır.

İstemci, isteği bir [Accept-Encoding başlığı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) ile yapmalı ve uygulama, HTTP sıkıştırması için [Content-Encoding başlığı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) ile yanıt verebilir.

İstemci, isteğin yapıldığı eylem URL'sinin alan adını görüntülemelidir. Eğer bir `GET` isteği yapıldıysa, istemci ayrıca `title`'ı göstermeli ve o GET yanıtından `icon` resmini render etmelidir.

### POST Yanıtı

Eylemin `POST` uç noktası, geçerli bir yük ile HTTP `OK` JSON yanıtı ile yanıt vermelidir ya da uygun bir HTTP hatası ile.

- İstemci, HTTP [istemci hatalarını](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses), [sunucu hatalarını](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses) ve [yönlendirme yanıtlarını](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages) yönetmelidir.
- Uç nokta, `application/json` olan bir [`Content-Type` başlığı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) ile yanıt vermelidir.

Hata yanıtları (örneğin HTTP 4xx ve 5xx durum kodları), kullanıcılara yardım sağlamak için JSON yanıt gövdesinde `ActionError`'a uyan bir formata sahip olmalıdır. (bkz. `Eylem Hataları`).

#### POST Yanıt Gövdesi

HTTP `OK` JSON yanıtı içeren bir `POST` yanıtı, bir gövde yükü içermelidir:

```ts filename="ActionPostResponse"
/**
 * Eylem POST İsteği tarafından döndürülen yanıt gövde yükü
 */
export interface ActionPostResponse<T extends ActionType = ActionType> {
  /** base64 ile kodlanmış serileştirilmiş işlem */
  transaction: string;
  /** İşlemin doğasını tanımlayan metin */
  message?: string;
  links?: {
    /**
     * Önceki başarılı olduğunda, sonraki eylemi elde etmek için bir sonraki eylem.
     */
    next: NextActionLink;
  };
}
```

- `transaction` - Değer, bir base64 ile kodlanmış [serileştirilmiş işlem](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#serialize) olmalıdır. İstemci, işlemi base64 çözümlemeli ve [deserializasyon yapmalıdır](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#from).

- `message` - Değer, yanıt içindeki işlemin doğasını açıklayan bir UTF-8 dizesi olmalıdır. İstemci bu değeri kullanıcıya göstermelidir. Örneğin, bu bir satın alınan ürünün, bir satın alma üzerine uygulanan indirim veya bir teşekkür notu olabilir.

- `links.next` - Seri halinde birden fazla Eylemi "zincirlemek" için kullanılan isteğe bağlı bir değerdir. Dahil edilen `transaction` on-zincirlenip onaylandıktan sonra, istemci, bir sonraki eylemi çekmeli ve render etmelidir. (bkz. `Eylem Zincirleme`).

- İstemci ve uygulama, gelecekteki spesifikasyon güncellemeleri ile eklenebilecek istek gövdesi ve yanıt gövdesine ek alanlara izin vermelidir.

> **Dikkat:** Uygulama kısmen veya tamamen imzalanmış bir işlem ile yanıt verebilir. İstemci ve cüzdan bu işlemi **güvenilir olmayan** olarak doğrulamalıdır.

#### POST Yanıt - İşlem

Eğer işlem [`signatures`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#signatures) boşsa veya işlem KISMEN imzalanmamışsa:

- İstemci, işlemin [`feePayer`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#feePayer) bölümünü göz ardı etmeli ve `feePayer`'ı istekteki `account` ile ayarlamalıdır.
- İstemci, işlemin [`recentBlockhash`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#recentBlockhash) bölümünü göz ardı etmeli ve `recentBlockhash`'ı [son blockhash](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getLatestBlockhash) olarak ayarlamalıdır.
- İstemci, işlemi imzalamadan önce serileştirip deserializasyon yapmalıdır. Bu, hesap anahtarlarının sıralamasını tutarlı hale getirmeye yardımcı olur, bu [sorunu](https://github.com/solana-labs/solana/issues/21722) aşmak için.

Eğer işlem kısmen imzalanmışsa:

- İstemci, [`feePayer`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#feePayer) veya [`recentBlockhash`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#recentBlockhash) alanını değiştirmemelidir; çünkü bu mevcut imzaları geçersiz kılabilir.
- İstemci, mevcut imzaları doğrulamalıdır ve herhangi biri geçersizse, istemci işlemi **bozuk** olarak reddetmelidir.

İstemci sadece istekteki `account` ile işlemi imzalamalıdır ve bunu yalnızca istekteki `account` için bir imzanın beklenmesi durumunda yapmalıdır.

İstemci dışındaki herhangi bir imza, istemci işlemeyi **kötü amaçlı** olarak reddetmelidir.

### Eylem Hataları

Eylem API'ları, kullanıcılara yardımcı hata mesajları sunmak için `ActionError` kullanarak hatalar döndürmelidir. Bağlama bağlı olarak, bu hata ölümcül veya ölümcül olmayan olabilir.

```ts filename="ActionError"
export interface ActionError {
  /** Kullanıcıya gösterilecek basit hata mesajı */
  message: string;
}
```

Eğer bir Eylem API'sı HTTP hata durum kodu (örneğin 4xx ve 5xx) ile yanıt veriyorsa, yanıt gövdesi `ActionError`'a uyan bir JSON yüküne sahip olmalıdır. Hata ölümcül olarak kabul edilir ve dahil edilen `message` kullanıcıya sunulmalıdır.

İsteğe bağlı `error` niteliğini destekleyen API yanıtları için (örneğin `ActionGetResponse`), hata ölümcül olmayan kabul edilir ve dahil edilen `message` kullanıcıya sunulmalıdır.

## Action Chaining

Solana Eylemleri, ardışık bir dizi halinde "zincirlenebilir". Bir Eylemin işlemi zincir üzerinde onaylandıktan sonra, bir sonraki eylem elde edilebilir ve kullanıcıya sunulabilir.

:::info
Eylem zincirleme, geliştiricilerin blinks içinde daha karmaşık ve dinamik deneyimler oluşturmasına olanak tanır.
:::

Bu, şunları içerir:

- Kullanıcıya birden fazla işlem (ve nihayetinde imza mesajı) sağlama
- Kullanıcının cüzdan adresine dayalı özelleştirilmiş eylem meta verileri
- Başarılı bir işlemden sonra blink meta verilerini yenileme
- İşlem imza ile API geri çağrısı alarak Eylem API sunucusunda ek doğrulama ve mantık sağlama
- Görüntülenen meta verileri güncelleyerek özelleştirilmiş "başarı" mesajları kullanma (örneğin, yeni bir resim ve açıklama)

Birden fazla eylemi bir araya getirmek için, herhangi bir `ActionPostResponse` içinde bir `links.next` belirtmelisiniz:

- `PostNextActionLink` - `signature` ve kullanıcının `account`'ını içeren aynı kaynak geri çağrısı URL'si ile POST isteği bağlantısı. Bu geri çağrılma URL'si `NextAction` ile yanıt vermelidir.
- `InlineNextActionLink` - İşlem onaylandıktan hemen sonra kullanıcıya sunulacak bir sonraki eylem için içte meta veri. Hiçbir geri çağrılma yapılmayacaktır.

```ts
export type NextActionLink = PostNextActionLink | InlineNextActionLink;

/** @see {NextActionPostRequest} */
export interface PostNextActionLink {
  /** Bağlantının türünü belirtir. */
  type: "post";
  /** POST isteğinin yapılacağı göreli veya aynı kaynak URL'si. */
  href: string;
}

/**
 * Mevcut bağlam içinde gömülü bir sonraki eylemi temsil eder.
 */
export interface InlineNextActionLink {
  /** Bağlantının türünü belirtir. */
  type: "inline";
  /** Gerçekleştirilecek sonraki eylem */
  action: NextAction;
}
```

---

### NextAction

:::tip
`ActionPostResponse` içindeki `transaction` kullanıcı tarafından imzalandığında ve zincir üzerinde onaylandığında, blink istemcisi şu yollarla seçenek sunmalıdır:
:::

- `NextAction`'ı almak ve görüntülemek için geri çağrılma isteğini yerine getirmelidir, ya da
- Eğer `links.next` aracılığıyla bir `NextAction` zaten sağlanmışsa, blink istemcisi görüntülenen meta verileri güncellemeli ve geri çağrılma isteği yapmamalıdır.

Geri çağrılma URL'si başlangıçtaki POST isteği ile aynı kaynak değilse, geri çağrılma isteği yapılmamalıdır. Blink istemcileri, kullanıcıyı bilgilendiren bir hata görüntülemelidir.

```ts filename="NextAction"
/** Gerçekleştirilecek sonraki eylem */
export type NextAction = Action<"action"> | CompletedAction;

/** "Tamamlanmış" durumunu eylem zincirlemesi içinde açıklamak için kullanılan tamamlanmış eylem. */
export type CompletedAction = Omit<Action<"completed">, "links">;
```

:::note
`type` değerine bağlı olarak, bir sonraki eylem blink istemcileri aracılığıyla kullanıcıya şu yollarla sunulmalıdır:
:::

- `action` - (varsayılan) Kullanıcının dahil edilen Eylem meta verilerini görebileceği, sağlanan `LinkedActions` ile etkileşime girebileceği ve diğer izleyen eylemleri zincirlemeye devam edebileceği standart bir eylem.

- `completed` - Eylem zincirinin son durumudur, görüntülenen Eylem meta verileri ile blink UI'sını güncelleyebilir, ancak kullanıcının daha fazla eylem gerçekleştirmesine izin vermez.

Eğer `links.next` sağlanamazsa, blink istemcileri mevcut eylemin zincir içindeki son eylem olduğu varsayımını yapmalı ve işlem onaylandıktan sonra "tamamlanmış" UI durumunu sunmalıdır.

---

## actions.json

`actions.json` dosyası` uygulamanın, istemcileri Solana Eylemleri'ni destekleyen web sitesi URL'leri hakkında bilgilendirmesini ve `GET istekleri` gerçekleştirmek için kullanılabilecek bir eşleme sağlamasını mümkün kılar.


Çapraz-Kaynak başlıkları gereklidir

`actions.json` dosyası yanıtı aynı zamanda `GET` ve `OPTIONS` istekleri için geçerli Çapraz-Kaynak başlıklarını döndürmelidir, özellikle `Access-Control-Allow-Origin`
başlık değerinin `*` olması gerekmektedir.

Daha fazla ayrıntı için yukarıdaki `OPTIONS yanıtı`'na bakınız.


`actions.json` dosyası kök alan adında depolanmalı ve evrensel olarak erişilebilir olmalıdır.

Örneğin, web uygulamanız `my-site.com` adresine dağıtıldığında, `actions.json` dosyası `https://my-site.com/actions.json` adresinden erişilebilir olmalıdır. Bu dosya aynı zamanda herhangi bir tarayıcı tarafından, `Access-Control-Allow-Origin`
başlık değeri `*` olarak ayarlandığında Çapraz-Kaynak erişilebilir olmalıdır.

---

### Kurallar

`rules` alanı, uygulamanın bir web sitesinin göreli yol yollarını başka bir yola eşleştirmesine olanak tanır.

**Tip:** `ActionRuleObject` dizisi.

```ts filename="ActionRuleObject"
interface ActionRuleObject {
  /** Kural eşlemesi yapılacak göreli (tercih edilen) veya mutlak yol */
  pathPattern: string;
  /** Eylem isteklerini destekleyen göreli (tercih edilen) veya mutlak yol */
  apiPath: string;
}
```

- `pathPattern` - Gelen her yol adını eşleştiren bir desen.

- `apiPath` - Bir mutlak yol veya harici URL olarak tanımlanan bir konum hedefi.

#### Kurallar - pathPattern

Her gelen yol adını eşleştiren bir desen. Mutlak veya göreli yol olabilir ve aşağıdaki formatları destekler:

- **Kesin Eşleşme**: Kesin URL yolunu eşleştirir.

  - Örnek: `/exact-path`
  - Örnek: `https://website.com/exact-path`

- **Wildcard Eşleşmesi**: URL yolundaki karakter dizilerini eşleştirmek için joker karakterler kullanır. Bu, tek (`*` kullanarak) veya çoklu segmentleri (`**` kullanarak) eşleştirebilir. (bkz. `Yol Eşleşmesi` aşağıda).

  - Örnek: `/trade/*` `/trade/123` ve `/trade/abc` ile eşleşir, yalnızca `/trade/`'den sonraki ilk segmenti yakalar.
  - Örnek: `/category/*/item/**` `/category/123/item/456` ve `/category/abc/item/def` ile eşleşir.
  - Örnek: `/api/actions/trade/*/confirm` `/api/actions/trade/123/confirm` ile eşleşir.

:::warning
#### Kurallar - apiPath

Eylem isteği için hedef yol. Mutlak bir yol veya harici bir URL olarak tanımlanabilir.

- Örnek: `/api/exact-path`
- Örnek: `https://api.example.com/v1/donate/*`
- Örnek: `/api/category/*/item/*`
- Örnek: `/api/swap/**`
:::

#### Kurallar - Sorgu Parametreleri

Orijinal URL'den gelen sorgu parametreleri her zaman korunur ve eşleştirilen URL'ye eklenir.

#### Kurallar - Yol Eşleşmesi

Aşağıdaki tablo, yol eşleşme desenleri için sözdizimini özetlemektedir:

| Operatör | Eşleştirir                                                                                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `*`      | Tek bir yol segmenti, çevresindeki yol ayırıcı / karakterleri içermeden.                                                                                                        |
| `**`     | Sıfır veya daha fazla karakteri, birden fazla yol segmentleri arasındaki herhangi bir yol ayırıcı / karakteri dahil olmak üzere eşleştirir. Diğer operatörler dahil edilirse, `**` operatörü son operatör olmalıdır. |
| `?`      | Desteklenmeyen desen.                                                                                                                                                                   |

---

### Kurallar Örnekleri

Aşağıdaki örnek, sitenizin kökünden `/buy` isteklerine kesin eşleşme kuralını `/api/buy` yoluna eşlemek için gösterir:

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/buy",
      "apiPath": "/api/buy"
    }
  ]
}
```

Aşağıdaki örnek, sitenizin kökünden `/actions/` altındaki herhangi bir yola (alt dizinler hariç) istekleri `/api/actions/` altında karşılık gelen bir yola eşlemek için joker yol eşleşmesi kullanır:

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/actions/*",
      "apiPath": "/api/actions/*"
    }
  ]
}
```

Aşağıdaki örnek, sitenizin kökünden `/donate/` altındaki herhangi bir yola (alt dizinler hariç) istekleri, harici bir sitedeki karşılık gelen mutlak yola `https://api.dialect.com/api/v1/donate/` eşlemek için joker yol eşleşmesi kullanır:

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/donate/*",
      "apiPath": "https://api.dialect.com/api/v1/donate/*"
    }
  ]
}
```

Aşağıdaki örnek, sitenizin kökünden `/api/actions/` altındaki (alt dizinler dahil) her yola istekleri kendisine eşlemek için idempotent bir kural için joker yol eşleşmesi kullanır:

> Idempotent kurallar, blink istemcilerin, verilen bir yolun Eylem API isteğini destekleyip desteklemediğini daha kolay şekilde belirlemesine olanak tanır, `solana-action:` URI ile öne alınmasına ya da ek yanıt testleri yapılmasına gerek kalmadan.

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/api/actions/**",
      "apiPath": "/api/actions/**"
    }
  ]
}
```

---

## Action Identity

Eylem uç noktaları, kullanıcı tarafından imzalanan işlemlerinde dönen bir _Eylem Kimliği_ içerebilir. Bu, indexleyicilerin ve analiz platformlarının zincir üstü etkinlikleri belirli bir Eylem Sağlayıcısına (yani hizmete) kolayca ve doğrulayıcı bir şekilde atfetmesini sağlar.

Eylem Kimliği, işlem içinde bir Memo talimatı kullanılarak yer alan özel olarak biçimlendirilmiş bir mesajı imzalamak için kullanılan bir anahtar çiftidir. Bu _Kimlik Mesajı_, belirli bir Eylem Kimliğine doğrulayıcı bir şekilde atfedilebilir ve böylece işlemleri belirli bir Eylem Sağlayıcısına atfetmek mümkündür.

Anahtar çifti, işlemi imzalamak için gerekli değildir ve bu, cüzdanların ve uygulamaların, kullanıcıya dönen işlemde başka imzalar olmadığında işlem iletimini iyileştirmesine izin verir. (bkz. `POST yanıt işlemi`).

:::danger
Bir Eylem Sağlayıcısının kullanımı, arka uç hizmetlerinin işlemi kullanıcıdan önce önceden imzalamayı gerektiriyorsa, bu anahtar çiftini Eylem Kimliği olarak kullanmalıdır. Bu, işlemde bir hesap daha az dahil edilmesine izin verecektir ve toplam işlem boyutunu 32 bayt ile düşürecektir.
:::

### Eylem Kimlik Mesajı

Eylem Kimlik Mesajı, bir işlemin içine tek bir [SPL Memo](https://spl.solana.com/memo) talimatı kullanılarak dahil edilen bir sütun ayırıcı UTF-8 dizisidir.

```shell
protocol:identity:reference:signature
```

- `protocol` - Kullanılan protokolün değeri (`solana-action` olarak ayarlanır, yukarıdaki `URL Şeması` gereği)
- `identity` - Değer, Eylem Kimliği anahtar çiftinin base58 ile kodlanmış halka anahtar adresi olmalıdır
- `reference` - Değer, base58 ile kodlanmış 32 baytlık bir dizi olmalıdır. Bu, halka anahtarı olup olmadığına veya kıvrımda olup olmadığına bakılmaksızın, ve Solana'daki hesaplarla ilişkili olsa da olmasa da olabilir.
- `signature` - Sadece `reference` değerini imzalayan Eylem Kimliği anahtar çiftinden oluşturulan base58 ile kodlanmış imza.

`reference` değeri yalnızca bir kez ve bir işlemde kullanılmalıdır. İşlemleri bir Eylem Sağlayıcısı ile ilişkilendirmek için yalnızca `reference` değerinin ilk kullanımı geçerli kabul edilir.

İşlemler birden fazla Memo talimatına sahip olabilir. [getSignaturesForAddress](https://solana.com/docs/rpc/http/getsignaturesforaddress) yöntemini gerçekleştirdiğinizde, sonuçların `memo` alanı her memo talimatının mesajını tek bir dize olarak döndürecek ve her biri noktalı virgülle ayrılacaktır.

Kimlik Mesajı'nın Memo talimatı ile birlikte başka bir veri dahil edilmemelidir.

`identity` ve `reference`, işlem üzerindeki Kimlik Mesajı Memo talimatı olmayan bir talimat içinde yalnızca salt okunur, imza sahibi olmayan [anahtarlar](https://solana-labs.github.io/solana-web3.js/v1.x/classes/TransactionInstruction.html#keys) olarak dahil edilmelidir.

Kimlik Mesajı Memo talimatının sıfır hesap sunması gerekir. Herhangi bir hesap sunulursa, Memo programı bu hesapların geçerli imzacılara sahip olmasını gerektirir. Eylemleri tanımlamak amacıyla, bu esneklik kısıtlanır ve kullanıcı deneyimini kötüleştirebilir. Bu nedenle, bir anti-kalıp olarak kabul edilir ve kaçınılması gerekir.

### Eylem Kimliği Doğrulaması

`identity` hesabını içeren herhangi bir işlem, çok aşamalı bir süreçte Eylem Sağlayıcısı ile doğrulayıcı bir şekilde ilişkilendirilebilir:

1. Verilen `identity` için tüm işlemleri alın.
2. Her işlemin memo dizesini ayrıştırın ve doğrulayın, `signature` değerinin `reference` ile geçerli olup olmadığından emin olun.
3. Belirli işlemin zincir üzerindeki ilk `reference` gerçekleşme olup olmadığını doğrulayın:
   - Eğer bu işlem ilk gerçekleşme ise, işlem doğrulanmış olarak kabul edilir ve Eylem Sağlayıcısına güvenle atfedilebilir.
   - Eğer bu işlem ilk gerçekleşme değilse, geçerli değildir ve bu nedenle Eylem Sağlayıcısına atfedilmez.

:::tip
Solana doğrulayıcıları işlemleri hesap anahtarlarıyla indekslediklerinden, [getSignaturesForAddress](https://solana.com/docs/rpc/http/getsignaturesforaddress) RPC yöntemi, `identity` hesabını içeren tüm işlemleri bulmak için kullanılabilir.
:::

Bu RPC yönteminin yanıtı, `memo` alanında tüm Memo verilerini içerir. Eğer işlemde birden fazla Memo talimatı kullanıldıysa, her bir memo mesajı bu `memo` alanında bulunur ve doğrulayıcı tarafından _Kimlik Doğrulama Mesajı_ elde etmek için buna göre ayrıştırılmalıdır.

Bu işlemler öncelikle **DOĞRULANMAMIŞ** olarak kabul edilmelidir. Bu, `identity`'nin işlemi imzalamak için gerekli olmaması nedeniyle, herhangi bir işlemin bu hesabı kimliksiz olarak içermesine izin verir. Bu, atıf ve kullanım sayımlarını yapay olarak artırabilir.

Kimlik Doğrulama Mesajı, `signature` değerinin `identity` tarafından `reference` olarak imzalanarak oluşturulduğundan emin olmak için kontrol edilmelidir. Eğer bu imza doğrulama başarısız olursa, işlem geçersizdir ve Eylem Sağlayıcısına atfedilmelidir.

Eğer imza doğrulama başarılı olursa, doğrulayıcı bu işlemin `reference`'ın zincir üzerindeki ilk gerçekleşmesi olduğundan emin olmalıdır. Eğer değilse, işlem geçersiz kabul edilir.