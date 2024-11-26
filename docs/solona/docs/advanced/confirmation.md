---
sidebarSortOrder: 1
sidebarLabel: "Onay & Süre Dolma"
title: "İşlem Onayı ve Süre Dolma"
seoTitle: "İşlem Onayı ve Süre Dolma"
description:
  "Solana işlem onayı ve bir işlemin ne zaman süresinin dolacağını
  (son blok hash kontrolü dahil) anlamak."
altRoutes:
  - /docs/advanced
  - /docs/core/transactions/confirmation
---

İşlem onayına ilişkin
`transaction confirmation` sorunları,
birçok yeni geliştirici için uygulama oluştururken yaygındır. Bu makale,
Solana blok zincirinde kullanılan onay mekanizması hakkında genel anlayışı
artırmayı ve önerilen bazı en iyi uygulamaları amaçlamaktadır.

## İşlemler hakkında kısa bir arka plan

Solana işlem onayı ve süre dolması nasıl çalıştığına girmeden önce,
birkaç şeyin temel anlayışını kısaca oluşturalım:

- işlem nedir
- bir işlemin yaşam döngüsü
- bir blok hash nedir
- ve Tarih Kanıtı (PoH) hakkında kısa bir anlayış ve bunun
  blok hashleri ile ilişkisi

### İşlem nedir?

İşlemler iki bileşenden oluşur: bir
`mesaj` ve bir
`imzalar listesi`. İşlem mesajı
büyünün gerçekleştiği yerdir ve yüksek seviyede dört bileşenden oluşur:

- işlemin meta verileri ile bir **başlık**,
- çağrılacak bir **talimat listesi**,
- yüklenmesi gereken bir **hesaplar listesi** ve
- bir **“son blok hash.”**

Bu makalede, işlemin
`son blok hash'i` üzerinde çokça duracağız
çünkü bu, işlem onayında büyük bir rol oynamaktadır.

### İşlem yaşam döngüsü tazelemesi

Aşağıda bir işlemin yaşam döngüsünün yüksek seviyeden bir görünümü
bulunmaktadır. Bu makale, adımları 1 ve 4 hariç her şeyi ele alacaktır.

1. Bir başlık ve talimatlar ile okuma ve yazma için gereken hesapların
   listesini oluşturun
2. Son blok hash'ini alın ve bunu bir işlem mesajı hazırlamada kullanın
3. İşlemi simüle edin ve beklenildiği gibi davranıp davranmadığını kontrol edin
4. Kullanıcıdan hazırlanan işlem mesajını özel anahtarı ile imzalamak için
   talepte bulunun
5. İşlemi mevcut blok üreticisine iletmeye çalışan bir RPC düğümüne gönderin
6. Bir blok üreticisinin işlemi doğrulayıp kendi ürettiği bloğa
   eklemesini umun
7. İşlemin bir bloğa dahil edildiğini onaylayın veya süresinin dolup dolmadığını
   tespit edin

### Blokhash nedir?

Bir `“blok hash”`, bir
`“slot”` için son Tarih Kanıtı
(PoH) hashine atıfta bulunur (aşağıda açıklama). Solana, PoH'yi güvenilir
bir saat olarak kullandığı için, bir işlemin son blok hash'i
**zaman damgası** olarak düşünülebilir.

### Tarih Kanıtı tazelemesi

Solana'nın Tarih Kanıtı mekanizması, güvenilir bir saat oluşturmak için
önemli ölçüde uzun bir SHA-256 hash zincirini kullanır. İsimdeki “tarih”
kısmı, blok üreticilerinin işlemlerin kimliklerini işleme aldıkları ve
hangi işlemlerin bloklarında işlendiğini kaydetmek için akışa hashlediği
gerçeğinden gelmektedir.


PoH hash hesaplama
[PoH hash hesaplama](https://github.com/anza-xyz/agave/blob/aa0922d6845e119ba466f88497e8209d1c82febc/entry/src/poh.rs#L79):
`next_hash = hash(prev_hash, hash(transaction_ids))`


PoH güvenilir bir saat olarak kullanılabilir çünkü her hash
sequential olarak üretilmelidir. Her üretilen blok bir blok hash'i ve
doğrulayıcıların hash zincirinin tam sırasını paralel olarak doğrulayıp
bir miktar zamanın gerçekten geçmiş olduğunu kanıtlayabilmeleri için
“ticks” olarak adlandırılan bir hash kontrol noktaları listesi içerir.

## İşlem Süre Dolması

Varsayılan olarak, tüm Solana işlemleri belirli bir süre içinde bir bloğa
commit edilmediğinde süresini dolduracaktır. İşlem onayı sorunlarının **büyük bir
çoğunluğu** RPC düğümlerinin ve doğrulayıcıların **süresi dolmuş**
işlemleri nasıl tespit ettiği ve ele aldığı ile ilgilidir. İşlem süre dolması
nasıl çalıştığını sağlam bir şekilde anlamanız, işlem onayı sorunlarınızın çoğunu
tahmin etmenize yardımcı olmalıdır.

### İşlem süre dolması nasıl çalışır?

Her işlem, bir PoH saat zaman damgası olarak kullanılan “son blok hash”
içerir ve bu blok hash’i artık “yeterince son” olmadığında süresini doldurur.

Her blok kesinleştirildiğinde (yani, maksimum tick yüksekliği
[ulaşıldığında](https://github.com/anza-xyz/agave/blob/0588ecc6121ba026c65600d117066dbdfaf63444/runtime/src/bank.rs#L3269-L3271),
“blok sınırına” ulaşıldığında), son blok hash’i
[300 en son blok hash'ini](https://github.com/anza-xyz/agave/blob/e0b0bcc80380da34bb63364cc393801af1e1057f/sdk/program/src/clock.rs#L123-L126)
saklayan `BlockhashQueue`'ye eklenir. İşlem işleme sırasında, Solana
doğrulayıcıları her işlemin son blok hash'inin en son 151 saklanan hash içinde
kaydedilip kaydedilmediğini kontrol eder (aka "maksimum işleme yaşı"). Eğer işlem
son blok hash'i [bu](https://github.com/anza-xyz/agave/blob/cb2fd2b632f16a43eff0c27af7458e4e97512e31/runtime/src/bank.rs#L3570-L3571)
maksimum işleme yaşından daha eski ise, işlem işlenmez.

> Mevcut
> [maksimum işleme yaşı 150](https://github.com/anza-xyz/agave/blob/cb2fd2b632f16a43eff0c27af7458e4e97512e31/sdk/program/src/clock.rs#L129-L131)
> ve kuyruktaki bir blok hash'inin “0-indexed” olmasından dolayı
> [151 blok hash'inin](https://github.com/anza-xyz/agave/blob/992a398fe8ea29ec4f04d081ceef7664960206f4/accounts-db/src/blockhash_queue.rs#L248-L274)
> “yeterince yeni” ve işleme için geçerli kabul edildiği.

`Slotlar` (yani bir doğrulayıcının bir blok oluşturabileceği
zaman dilimi) yaklaşık
[400ms](https://github.com/anza-xyz/agave/blob/cb2fd2b632f16a43eff0c27af7458e4e97512e31/sdk/program/src/clock.rs#L107-L109)
süreyle yapılandırılmıştır ancak bu 400ms ile 600ms arasında değişebilir, böylece
belirli bir blok hash'i yaklaşık 60 ile 90 saniye arasında sadece
süresi dolmuş olarak dikkate alınır.

### İşlem süre dolması örneği

Kısa bir örnek üzerinden geçelim:

1. Bir doğrulayıcı, mevcut slot için yeni bir blok üretmeye aktif olarak devam ediyor.
2. Doğrayıcı, kullanıcının son blok hash’i `abcd...` olan bir işlem alır.
3. Doğrayıcı, bu blok hash'ini `BlockhashQueue`'deki son blok hash listesiyle kontrol eder ve bunun 151 blok önce oluşturulduğunu fark eder.
4. Tam olarak 151 blok hash'e eski olduğundan, işlem henüz süresini doldurmamış ve işlenebilir!
5. Ama bekleyin: işlemi gerçekten işleme almadan önce, doğrayıcı bir sonraki bloğu tamamlar ve `BlockhashQueue`'ya ekler. Ardından, sonraki slot için blok üretmeye başlar (doğrayıcılar ardışık 4 slot boyunca blok üretebilir).
6. Doğrayıcı, o aynı işlemi tekrar kontrol eder ve şimdi bunun 152 blok hash'e eski olduğunu bulur ve reddedilir çünkü çok eski :(

## İşlemler neden süresini doluyor?

Bunun çok iyi bir nedeni var, aynı işlemin iki kez işlenmesini engellemek için
doğrayıcıların işlem yapmalarına yardımcı olmaktır.

İkili bir yaklaşım, her yeni işlemi blok zincirinin tüm işlem geçmişi ile
doğrulamak olabilir. Ancak, işlemlerin kısa bir süre sonra süresini
doldurması gerektiğinden, doğrayıcıların sadece yeni bir işlemin
görece küçük bir setin _son işlenmiş_ işlemler arasında olup olmadığını
kontrol etmesi gerekmektedir.

### Diğer blok zincirleri

Solana'nın çift işlemleri önleme yaklaşımı, diğer blok zincirlerinden oldukça
farklıdır. Örneğin, Ethereum her işlem gönderen için bir sayıcı (nonce)
tutar ve yalnızca bir sonraki geçerli nonce'u kullanan işlemleri işler.

Ethereum'un bu yaklaşımı, doğrayıcıların uygulaması için kolaydır, ancak
kullanıcılar için sorunlu olabilir. Birçok kişi, Ethereum işlemlerinin uzun
bir süre _beklemede_ durumda kaldığı durumlarla karşılaşmıştır ve ardından
daha yüksek nonce değerleri kullanan tüm sonraki işlemler işlemden engellenmiştir.

### Solana'daki avantajlar

Solana'nın yaklaşımının birkaç avantajı vardır:

1. Tek bir ücret ödeyici, aynı anda herhangi bir sırayla işlenmesine izin
   verilebilecek birden fazla işlem gönderebilir. Bu, birçok uygulamayı aynı anda
   kullanıyorsanız meydana gelebilir.
2. Bir işlem bir bloğa commit edilmezse ve süresi dolarsa, kullanıcılar
   önceki işlemlerinin ASLA işlenmeyeceğini bilerek tekrar deneyebilir.

Sayaç kullanmamış olmaları sayesinde, Solana cüzdan deneyimi kullanıcılar
için daha kolay anlaşılabilir hale geliyor çünkü hızlı bir şekilde başarı,
başarısızlık veya süre dolma durumlarına ulaşabiliyor ve rahatsız edici
beklemede kalan durumlardan kaçınabiliyorlar.

### Solana'daki dezavantajlar

Elbette bazı dezavantajlar da var:

1. Doğrayıcılar, çift işleme önlemek için işlenmiş tüm işlem kimliklerinin
   setini aktif olarak takip etmelidir.
2. Süre dolma aralığı çok kısa ise, kullanıcılar işlemlerini süresi dolmadan
   göndermekte zorlanabilir.

Bu dezavantajlar, işlem süre dolmasının nasıl yapılandırıldığına dair bir
takasın ön plana çıkar. Bir işlemin süre dolması süresi artırıldığında,
doğrayıcıların daha fazla işlemi takip etmek için daha fazla bellek kullanması
gerekir. Süre dolma süresi azaltıldığında, kullanıcılar işlemlerini
göndermek için yeterince zaman bulamazlar.

Mevcut olarak, Solana kümeleri, işlemlerin 151 bloktan daha eski blok hash'leri
kullanmasını gerektirir.

> Bu [Github problemi](https://github.com/solana-labs/solana/issues/23582)
> ana ağ-beta doğrulayıcılarının işlemleri takip etmek için yaklaşık 150MB
> belleğe ihtiyaç duyduğunu tahmin eden bazı hesaplamalar içermektedir.
> Bu, gerektiğinde süre dolma süresi azaltılmadan gelecekte daha da küçültülebilir.

## İşlem onayı ipuçları

Daha önce bahsedildiği gibi, blok hash'leri yalnızca 151 blok süre
dolmadan süresi dolacaktır, bu da işlemlerin hedef süre olan 400ms
içinde işlendiğinde neredeyse **bir dakika** kadar hızlı geçebilir.

Bir dakika, bir istemcinin son blok hash'ini alması, kullanıcı imzası
beklemesi ve nihayetinde yayılmış işlemin bunu kabul edecek bir lidere
ulaşmasını umması gerektiği düşünülürse pek fazla zaman değil. İşlem süre
dolmasından dolayı onay başarısızlıklarını önlemeye yardımcı olacak bazı ipuçlarına
göz atalım!

### Blok hash'lerini uygun onay düzeyi ile al

Kısa süre dolma çerçevesini göz önünde bulundurursak, istemcilerin ve
uygulamaların kullanıcıların mümkün olduğunca yeni bir blok hash'iyle
işlem oluşturmalarına yardımcı olmaları hayati önem taşımaktadır.

Blok hash'lerini alırken, mevcut önerilen RPC API
`getLatestBlockhash` adını
almaktadır. Varsayılan olarak, bu API en son kesinleşmiş
bloğun blok hash'ini döndürmek için `finalized` onay düzeyini kullanır.
Ancak, bu davranışı `‘commitment’ parametresini`
farklı bir onay düzeyine ayarlayarak geçersiz kılabilirsiniz.

:::tip
**Öneri**: RPC isteği gönderirken neredeyse her zaman `onaylı` onay düzeyinin
kullanılması gerektiği düşünülebilir çünkü genelde `işlenmiş` onaya göre,
yetersiz bir miktar arka planda kalmaktadır ve düşük bir olasılıkla
kopyalanmış bir [fork](https://docs.solanalabs.com/consensus/fork-generation)
ait olma şansı vardır.
:::

Ancak diğer seçenekleri de düşünmekte özgürsünüz:

- `işlenmiş` seçim şıkkı, diğer onay düzeylerine göre en son blok
  hash'ini almanızı sağlar ve dolayısıyla işlemi hazırlamak ve işleme almak
  için en fazla süreye sahip olmanızı sağlar. Ancak Solana blok zincirinde
  fork'ların yaygınlığı nedeniyle, yaklaşık %5'lik oranla, blok duyurulmadığı
  için tamamlanmamış kalabilir, bu nedenle işleminiz, terkedilmiş bir forkla
  ilişkilendirilmiş bir blok hash'i kullanma riski taşır. Terkedilmiş bloklara
  bağlı kalarak kullanılan blok hash'leri, kesinleşmiş blok zincirinde
  asla son değerlendirilecektir.
- `varsayılan onay düzeyini` olan `finalized` kullanmak,
  seçtiğiniz blok hash'inin terkedilmiş bir fork için ait olmama riskini bertaraf eder.
  Ancak, bu takasın en son onaylı bloğuyla en son kesinleşmiş blok arasında
  genellikle en az 32 slot farklılığı vardır. Bu takas oldukça şiddetli olup
  işlemlerinizin süresinin yaklaşık 13 saniye kadar azalmasını sağlar ama bu
  dengesiz küme koşullarında daha fazla olabilir.

### Uygun ön uç onay düzeyini kullan

Eğer işleminiz inanılmış bir RPC düğümünden blok hash'i aldıysa, sonra o
işlemi farklı bir RPC düğümü ile gönderir veya simüle ederseniz, bir
düğüm diğerinden geri kaldığı için sorunlarla karşılaşabilirsiniz.

RPC düğümleri `sendTransaction` isteğini aldıklarında, en son kesinleşmiş
bloğu veya `preflightCommitment` parametresiyle belirlenen bloğu kullanarak
işleminizin süre dolma bloğunu belirlemeye çalışacaklardır. **ÇOK** yaygın
olan bir sorun, alınan bir işlemin blok hash'inin bu işlemin süre dolması
hesaplanırken kullanılan bloğun ardından üretilmiş olmasıdır. Eğer bir RPC
düğümü işleminizin ne zaman süresinin dolduğunu belirleyemezse, işleminizi sadece
**bir kez** iletecek ve sonrasında işlemi **atlayacaktır**.

Benzer şekilde, RPC düğümleri `simulateTransaction` isteği aldıklarında,
en son kesinleşmiş bloğu veya `preflightCommitment` parametresi ile seçilen
bloğu kullanarak işleminizi simüle ederler. Simülasyonda seçilen blok işlem
bloğunuzun blok hash'inden daha yaşlıysa, simülasyon “blok hash'i bulunamadı”
hatasıyla başarısız olur.

:::tip
**Öneri**: `skipPreflight` kullanıyor olsanız bile, **HER ZAMAN** `sendTransaction`
ve `simulateTransaction` istekleri için işleminizin blok hash'ine ulaşmakta
kullanılan aynı onay düzeyine `preflightCommitment` parametresini ayarlayın.
:::

### İşlem gönderirken geri kalan RPC düğümlerine dikkat edin

Uygulamanız bir RPC havuz hizmeti kullanıyorsa veya RPC uç noktası işlem oluşturmada
ve işlem göndermede farklı ise, bir RPC düğümünün diğerine göre geri kalma durumlarında
dikkatli olmalısınız. Örneğin, bir RPC düğümünden blok hash'i aldıysanız ve
sonrasında bu işlemi başka bir RPC düğümüne iletmek için gönderiyorsanız,
ikinci RPC düğümü birincisinden geri kalıyor olabilir.

:::tip
**Öneri**: `sendTransaction` istekleri için, istemciler belirli bir aralıkla bir RPC
düğümüne işlemi yeniden göndermeye devam etmelidir. Böylece, bir RPC
düğümü kümenin biraz gerisinde kalıyorsa, sonunda senkronize olacak ve
işleminizin süresinin dolmasını doğru bir şekilde tespit edebileceklerdir.
:::

`simulateTransaction` istekleri için, istemcilerin RPC düğümüne
`replaceRecentBlockhash` parametresini
kullanırken davranarak, simüle edilen işlemin blok hash'ini her zaman
geçerli olacak bir blok hash'i ile değiştirmesini sağlamalıdır.

### Eski blok hash'lerini yeniden kullanmaktan kaçının

Uygulamanız çok yakın bir blok hash'i aldığında bile, işlemlerde bu
blok hash'inin çok uzun süre yeniden kullanılmadığından emin olmalısınız.
İdeal senaryo, bir kullanıcı işlem imzalayacağı zaman hemen öncesinde
yakın bir blok hash'inin alınmasıdır.

:::note
**Uygulamalar için öneri**: Kullanıcı bir işlem oluşturacak bir eylemi tetiklediğinde, uygulamanızın
zaten geçerli bir blok hash'inin mevcut olduğunu garanti altına almak için
yeni yakın blok hash'leri almak amacıyla sık sık sorgulama yapın.

**Cüzdanlar için öneri**: Hızla yeni yakın blok hash'leri almak için sık sık sorgulama yapın ve
bir işlemin süresinin mümkün olduğunca yeni olmasını sağlamak için
işlemin yakın blok hash'ini imzalamadan hemen önce değiştirmeyi
hedefleyin.
:::

### Blok hash'lerini alırken sağlıklı RPC düğümleri kullanın

`onaylı` onay düzeyinden bir RPC düğümünden en son blok hash'ini
almak, en son onaylı bloğun blok hash'i ile yanıt verir. Solana'nın
blok yayılım protokolü, blokları staked düğümlere göndermeyi önceliklendirir
bu nedenle RPC düğümleri doğal olarak kümelerin geri kalanından bir blok
geride kalır. Ayrıca uygulama isteklerini işlemek için daha fazla iş
yapmak zorunda kalabilirler ve yoğun kullanıcı trafiği altında daha fazla
geride kalabilirler.

Geride kalan RPC düğümleri bu sebeplerle `getLatestBlockhash`
isteklerine, kümeye bir süre önce onaylanmış blok hash'leriyle
yanıt verebilirler. Varsayılan olarak, bir geride kalan RPC düğümü
kümeye 150 slot kadar geride olduğunu tespit ederse, isteklere yanıt
vermemeyi tercih eder ancak bu eşik noktaya oldukça yaklaşırken
hala süresi dolmaya yakın bir blok hash'i dönebilir.

:::warning
**Öneri**: RPC düğümlerinizin, küme durumunu güncel bir görünümüne sahip olduğundan emin
olmak için en aşağıdaki yöntemlerden birini kullanarak sağlığını
izleyin:

1. RPC düğümünüzün en yüksek işlenmiş slotunu `getSlot` RPC API'sini
   `işlenmiş` onay düzeyinde çağırarak alabilir ve ardından
   `getMaxShredInsertSlot` RPC API'sini
   çağırarak işlemin işlem gördüğü slot ile ilgili bilgileri alabilirsiniz. Bu iki
   yanıt arasındaki fark oldukça büyükse, küme, RPC düğümünün işlediğinden
   çok daha fazla blok üretmektedir.
2. Farklı birkaç RPC API düğümünde `onaylı` onay düzeyinde `getLatestBlockhash`
   API'sini çağırabilir ve en yüksek slotu döndüren düğümün
   `bağlam slotunu` kullanarak
   blok hash'ini alabilirsiniz.
:::

### Süre dolması için yeterince bekleyin

:::tip
**Öneri**: İşleminizin son blok hash'ini almak için `getLatestBlockhash`
RPC API'sini aradığınızda, yanıtın `lastValidBlockHeight` değerini dikkate alın.

Ardından, `onaylı` onay düzeyinden `getBlockHeight`
RPC API'sini sorgulayarak önceki dönen son geçerli blok yüksekliğinden
daha büyük bir blok yüksekliği dökünceye kadar bekleme yapın.
:::

### “Dayanıklı” işlemler kullanmayı düşünün

Bazen işlem süresi dolması sorunları gerçekten önlenmesi zor durumlar
oluşturabilir (örneğin çevrimdışı imzalama, küme kararsızlığı). Eğer önceki
ipuçları kullanım durumunuz için hala yeterli değilse, dayanıklı işlemleri
kullanmayı sağlayacak şekilde geçiş yapabilirsiniz (yalnızca biraz kurulum
gerektirir).

Dayanıklı işlemleri kullanmaya başlamak için, bir kullanıcının önce
[özel bir zincir içi “nonce” hesabı oluşturan talimatları çağıran bir
işlem](https://docs.rs/solana-program/latest/solana_program/system_instruction/fn.create_nonce_account.html)
göndermesi gerekmektedir ve bir “dayanıklı blok hash” bunun içinde saklanır.
Gelecekte istediği herhangi bir noktada (nonce hesabı kullanılmadığı sürece),
kullanıcı aşağıdaki 2 kuralı takip ederek dayanıklı bir işlem oluşturabilir:

1. Talimat listesi, zincir içi nonce hesabını yükleyen bir
   [“nonce’u ilerlet” sistem talimatı](https://docs.rs/solana-program/latest/solana_program/system_instruction/fn.advance_nonce_account.html)
   ile başlamalıdır.
2. İşlemin blok hash’i, zincir içindeki nonce hesabında saklanan dayanıklı
   blok hash’i ile eşit olmalıdır.

Bu dayanıklı işlemlerin Solana çalışma zamanında nasıl işlendiği:

1. Eğer işlem bloğunun hash’i artık “son” değilse, çalışma zamanı
   “nonce’u ilerlet” sistem talimatıyla işlemin talimat listesinin
   başlamış olup olmadığını kontrol eder.
2. Eğer öyleyse, “nonce’u ilerlet” talimatında belirtilen nonce hesabını
   yükler.
3. Ardından, saklanan dayanıklı blok hash’inin işlem blok hash'iyle
   eşleştiğini kontrol eder.
4. Son olarak, aynı işlem asla tekrar işlenemeyecek şekilde
   nonce hesabının saklanan blok hash'ini en son yakın blok hash'ine
   ilerleteceğinden emin olur.

Bu dayanıklı işlemlerin nasıl çalıştığı hakkında daha fazla ayrıntı için, [orijinal teklifi](https://docs.solanalabs.com/implemented-proposals/durable-tx-nonces)
okuyabilir ve Solana belgelerinde `örneği kontrol edebilirsiniz`.