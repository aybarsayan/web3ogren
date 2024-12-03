---
title: Otomatik Piyasa Yapıcılar
seoTitle: Otomatik Piyasa Yapıcılar (AMM) ve XRP Ledger
sidebar_position: 4
description: Otomatik Piyasa Yapıcılar (AMMler) kripto paraların önemli bir parçasıdır ve varlık çiftleri arasında likidite sağlar. AMMler ve XRP Ledger hakkında daha fazla bilgi edinin.
tags: 
  - AMM
  - XRP
  - Merkezsiz Borsa
  - likidite sağlayıcıları
  - ticaret ücretleri
keywords: 
  - AMM
  - XRP
  - Merkezsiz Borsa
  - likidite sağlayıcıları
  - ticaret ücretleri
---

## Otomatik Piyasa Yapıcılar

_(Eklenmiştir [AMM değişikliği][])_

Otomatik Piyasa Yapıcılar (AMM'ler), XRP Ledger'ın merkezsiz borsasında likidite sağlar. Her AMM, iki varlığın havuzunu tutar. İki varlık arasında bir formül tarafından belirlenen bir döviz kuru ile değiştirme yapabilirsiniz.



AMM'ye varlık yatıranlara _likidite sağlayıcıları_ denir. Bunun karşılığında, likidite sağlayıcıları AMM'den _LP tokenleri_ alırlar.



LP tokenleri, likidite sağlayıcılarına şunları yapma imkanı tanır:

- LP tokenlerini, AMM havuzundaki varlıkların bir payı için geri alabilirler, alınan ücretler dahil.
- AMM ücret ayarlarını değiştirmek için oy verebilirler; her oy, oylayanın sahip olduğu LP tokeni sayısına göre ağırlıklandırılır.
- AMM ticaret ücretlerinde geçici bir indirim almak için bazı LP tokenlerini teklif edebilirler.

## AMM Nasıl Çalışır

Bir AMM, iki farklı varlık tutar: bunlardan en fazla biri XRP olabilir; biri veya her ikisi de `tokenler` olabilir. 
Herhangi bir varlık çifti için, defterde en fazla bir AMM bulunabilir. Eğer varlık çifti için AMM yoksa, herkes AMM'yi oluşturabilir ya da zaten var olan bir AMM'ye varlık yatırabilir.

Merkezsiz borsada ticaret yapmak istediğinizde, `Teklifler` ve `Çapraz Para Transferleri` ticareti tamamlamak için otomatik olarak AMM'leri kullanabilir. Tek bir işlem, Teklifleri, AMM'leri veya her ikisini de kullanarak gerçekleştirilebilir; bu, hangi yolun daha ucuz olduğuna bağlıdır.



:::info
Bir `Payment` veya `OfferCreate` işleminin AMM ile etkileşime girdiğini, işlem meta verisinde bir `RippleState` defter kaydı kontrol ederek belirleyebilirsiniz. `Flags` değerinin `16777216` olması, AMM likiditesinin kullanıldığını gösterir.
:::

Bir AMM, havuzdaki varlıkların bakiyesi temelinde döviz kurunu ayarlar. Bir AMM ile ticaret yaptığınızda, döviz kuru, ticaretinizin AMM'nin tutduğu varlıkların dengesini ne kadar değiştirdiğine bağlı olarak ayarlanır. Bir varlığın arzı azalırken, o varlığın fiyatı artar; bir varlığın arzı artarken, o varlığın fiyatı düşer.



Bir AMM, genel olarak havuzunda daha büyük miktarlar bulunduğunda daha iyi döviz kurları sunar. Bunun nedeni, her ticaretin, AMM'nin varlıklarının dengesinde daha küçük bir kaymaya neden olmasıdır. Bir ticaret, AMM'nin iki varlıktaki arzını daha fazla dengesiz hale getirdikçe, döviz kuru daha aşırı hale gelir.

AMM ayrıca döviz kurunun üzerine bir yüzdelik ticaret ücreti ekler.

XRP Ledger, 0.5 ağırlık parametresine sahip bir _geometrik ortalama_ AMM'yi uygulamaktadır, bu nedenle _sabit ürün_ piyasa yapıcısı gibi çalışır. _Sabit ürün_ AMM formülü ve genel olarak AMM'lerin ekonomisi hakkında detaylı açıklama için [Kris Machowski'nin Otomatik Piyasa Yapıcılara Girişi](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/) kısmına bakın.

### Token İhraççıları

Farklı ihraççılara sahip tokenler, farklı varlıklar olarak kabul edilir. Bu, aynı para birimi koduna sahip fakat farklı ihraççılara sahip iki token için bir AMM olabileceği anlamına gelir. Örneğin, WayGate tarafından ihraç edilen _FOO_, StableFoo tarafından ihraç edilen _FOO_'dan farklıdır. Benzer şekilde, tokenlar aynı ihraççıya sahip olabilir fakat farklı para birimi kodlarına sahip olabilir. Ticaret yönü önemli değildir; FOO.WayGate ile XRP arasındaki AMM, XRP ile FOO.WayGate arasındaki AMM ile aynıdır.

### Para Birimi Riski

Havuzdaki iki varlık arasındaki fon akışı, nispeten aktif ve dengeli olduğunda, ücretler likidite sağlayıcıları için pasif gelir kaynağı sağlar. Ancak, varlıklar arasındaki relatif fiyat kayması olduğunda, likidite sağlayıcıları [para birimi riski](https://www.investopedia.com/terms/c/currencyrisk.asp) nedeniyle zarar edebilir.

### DEX Etkileşimi

AMM'ler, likiditeyi artırmak için merkezi limit emir defteri (CLOB) tabanlı DEX ile entegre edilmiştir. Teklifler ve ödemeler, bir likidite havuzunun, emir defterleri aracılığıyla mı yoksa her ikisiyle birlikte mi işlem yapmanın en iyi oranı sağladığını belirlemek için otomatik olarak optimize edilir. Bu, işlemlerin, tekliflerin DEX üzerinde veya AMM havuzları aracılığıyla en verimli ticaret yolu kullanmasını garanti eder.

Aşağıdaki diyagram, bir teklifin diğer tekliflerle ve DEX'teki AMM likiditesiyle nasıl etkileşime girdiğini göstermektedir.



### Varlıklara Yönelik Kısıtlamalar

Kötüye kullanımı önlemek amacıyla, AMM'de kullanılan varlıklara bazı kısıtlamalar uygulanmaktadır. Eğer bu kısıtlamaları karşılamayan bir varlıkla AMM oluşturmaya çalışırsanız, işlem başarısız olur. Kurallar şunlardır:

- Varlık, başka bir AMM'den bir LP token olmamalıdır.
- Eğer varlık, `Yetkilendirilmiş Güven Hatları` kullanan bir ihraççı tarafından ihraç edilmiş bir token ise, AMM'yi oluşturan kişi bu tokenleri tutmak için yetkilendirilmiş olmalıdır. Sadece sizin yetkilendirilmiş güven hatlarınız, bu tokeni AMM'ye yatırabilir veya çekebilir; ancak yine de diğer varlığı yatırabilir veya çekebilirsiniz.
- Eğer [Clawback değişikliği][] etkinleştirilmişse, tokenin ihraççısı, kendi tokenlerini geri alma yeteneğini etkinleştirmiş olmamalıdır.

## LP Tokenleri

AMM'yi oluşturan kişi, ilk likidite sağlayıcısı olur ve AMM'nin havuzundaki varlıkların %100'lük mülkiyetini temsil eden LP tokenleri alır. Bu LP tokenlerinden bir kısmını veya tamamını geri alarak AMM'den varlık çekebilirler. (Miktarlar zamanla değişecektir, çünkü insanlar AMM ile ticaret yapmaktadırlar.) AMM, her iki varlık için çekim yaparken bir ücret talep etmez.

Örneğin, 5 ETH ve 5 USD ile bir AMM oluşturduysanız ve birisi 1.26 USD karşılığında 1 ETH'yi değiştirirse, havuz artık 4 ETH ve 6.26 USD içerir. LP tokenlerinizin yarısını harcayarak 2 ETH ve 3.13 USD çekebilirsiniz.


Herkes mevcut bir AMM'ye varlık yatırabilir. Bunu yaptıklarında, yatırdıkları miktara göre yeni LP tokenleri alırlar. Bir likidite sağlayıcısının bir AMM'den çekebileceği miktar, sahip olduğu AMM'nin LP tokenlerinin toplam sayısı ile karşılaştırıldığında, AMM'nin LP tokenleri ile oranına dayanmaktadır.

LP tokenler, XRP Ledger'deki diğer tokenler gibidir. Onları birçok ödeme türünde kullanabilir veya merkezsiz borsa üzerinden ticaret yapabilirsiniz. (LP tokenlerini ödeme olarak almak istiyorsanız, AMM Hesabı'nı ihraççı olarak belirten sıfırdan farklı bir limit ile bir `güven hattı` kurmalısınız.) Ancak, LP tokenlerini yalnızca AMM'ye doğrudan gönderebilirsiniz (onları kullanarak), [AMMWithdraw][] işlem türünü kullanarak, diğer ödeme türleri aracılığıyla değil. Benzer şekilde, AMM'nin havuzuna yalnızca [AMMDeposit][] işlem türünü kullanarak varlık gönderebilirsiniz.

Bir AMM'nin varlık havuzunun boş durumda olması, yalnızca AMM'nin çevrimiçi LP tokeni kalmadığında mümkündür. Bu durum, yalnızca bir [AMMWithdraw][] işlemi sonucunda gerçekleşebilir; böyle olduğunda, AMM otomatik olarak silinir.

### LP Token Para Birimi Kodları

LP tokenleri, 160-bit hexadecimal `"standart olmayan" format` kullanır. Bu kodlar ilk 8 bit `0x03` şeklindedir. Kodun geri kalanı, iki varlığın para birimi kodlarının ve ihraççılarının SHA-512 hash'inin ilk 152 bitine kadar kısaltılmasıdır. (Varlıklar, sayısal olarak daha düşük para birimi+ihraççı çiftinin ilk olduğu "kanonik bir sıra" içine yerleştirilir.) Sonuç olarak, belirlenen bir varlık çiftinin AMM'si için LP tokenlerinin tahmin edilebilir, tutarlı bir para birimi kodu vardır.

## Ticaret Ücretleri

Ticaret ücretleri, likidite sağlayıcıları için bir pasif gelir kaynağıdır. Diğerlerinin havuzun varlıklarıyla ticaret yapmasına izin vermenin para birimi riskini dengelerler. Ticaret ücretleri AMM'ye, doğrudan likidite sağlayıcılarına değil, ödenir. Likidite sağlayıcıları, LP tokenlerini AMM havuzunun bir yüzdesi karşılığında geri alarak yarar sağlarlar.

Likidite sağlayıcıları, ücreti %0 ile %1 arasında, 0.001% artışlarla belirlemek için oy verebilirler. Ticaret ücretlerini uygun bir oranla ayarlamak için likidite sağlayıcılarının bir teşviki vardır: eğer ücretler çok yüksekse, ticaretler daha iyi bir oran elde etmek için emir defterlerini kullanacaktır; eğer ücretler çok düşükse, likidite sağlayıcıları havuza katkıda bulunmaktan hiçbir fayda elde edemezler.

Her AMM, likidite sağlayıcılarına sahip oldukları LP token sayısına orantılı olarak, ücretleri hakkında oy verme gücü verir. Oy vermek için bir likidite sağlayıcı, bir [AMMVote][] işlemi gönderir. Kimse yeni bir oy verdiğinde, AMM, en son oyların LP tokeni sahipliği ile ağırlıklandırılmış ortalaması olarak ücretini yeniden hesaplar. En fazla 8 likidite sağlayıcısının oyları bu şekilde sayılabilir; eğer daha fazla likidite sağlayıcı oy verirken, yalnızca en çok LP tokenine sahip olan 8 oy sayılır. Likidite sağlayıcılarının LP tokenlerinin payı birçok sebepten (örneğin, bu tokenleri `Teklifler` kullanarak ticaret yapmak gibi) hızla değişebilir; ancak ticaret ücretleri, yalnızca biri yeni bir oy verdiğinde yeniden hesaplanır (bu oy en yüksek 8 oydan biri olmasa bile).

### Müzayede Alanı

XRP Ledger'ın AMM tasarımı, bir _müzayede alanı_ içerir. Bir likidite sağlayıcı, ticaret ücreti için 24 saatlik bir süre boyunca indirim almak üzere müzayede alanını talep etmek için LP Tokenleri teklif edebilir. Teklif edilen LP tokenler, AMM'ye geri döner.

Herhangi bir AMM ile, eğer varlıklarının fiyatı dış piyasalarda önemli ölçüde kayarsa, yatırımcılar arbitraj yaparak AMM'den kâr elde edebilirler. Bu, likidite sağlayıcıları için bir kayba yol açabilir. Müzayede mekanizması, bunun değerinin daha fazlasını likidite sağlayıcılarına geri döndürmeyi ve AMM'nin fiyatlarını dış piyasalara daha hızlı bir şekilde dengelemeyi amaçlamaktadır.

Bir seferde müzayede alanını tutan yalnızca bir hesap olabilir; ancak başarılı teklif sahibi olarak, indirim alacak 4 ek hesabı isimlendirebilirsiniz. Eğer alan şu anda doluysa, mevcut alan sahibini değiştirmek için onların teklifini geçmelisiniz. Eğer birisi sizi yer değiştirirse, geriye kalan süreye bağlı olarak teklifinizin bir yüzdesini geri alırsınız. Aktif bir müzayede alanını tuttuğunuz sürece, o AMM'ye karşı işlem yaparken normal ticaret ücretinin 1/10 (ondalık) kadar indirimli bir ticaret ücreti ödeyeceksiniz.

Eğer müzayede alanı boş veya süresi dolmuşsa, kazanmak için en düşük teklif, mevcut toplam LP Token sayısının ticaret ücretiyle çarpılıp 25'e bölünmesiyle eşit olur.  (Pseudocode'da `MinBid = LPTokens * TradingFee / 25`.) Eğer müzayede alanı doluysa, en az minimum teklifin üzerine, mevcut alan sahibinin ödediği miktarın %105'ine kadar teklif vermeniz gerekmektedir; bu, kalan süreye bağlı olarak indirimli olacaktır.

## Defterde Temsili

Defterdeki durum verisinde, bir AMM, birden fazla `defter kaydı` içerir:

- Otomatik piyasa yapıcıyı tanımlayan bir [AMM kaydı][].
- AMM'nin LP tokenlerini ihraç eden ve AMM'nin XRP'sini tutan özel bir [AccountRoot kaydı][].

    Bu AccountRoot'un adresi, AMM oluşturulduğunda biraz rastgele seçilir ve AMM silinip yeniden oluşturulduğunda farklıdır. Bu, insanların AMM hesabını önceden fazla XRP ile finanse etmesini önlemek içindir.

- AMM'nin havuzundaki tokenler için özel AMM Hesabına ait `Güven Hatları`.

Bu defter kayıtları hiçbir hesap tarafından sahip olunmaz, bu nedenle `rezerv gereksinimi` onlara uygulanmaz. Ancak, spamı önlemek için, AMM oluşturma işlemi, gönderenin daha fazla XRP yakmasını gerektiren özel bir `işlem maliyeti` içerir.

## Silinme

Bir AMM, bir [AMMWithdraw işlemi][] havuzundaki tüm varlıkları çektiğinde silinir. Bu yalnızca AMM'nin tüm çevrimiçi LP tokenlerini geri alarak gerçekleşir. AMM'yi silmek, onunla ilişkili olan tüm defter kayıtlarını kaldırır, bunlar arasında:

- AMM
- AccountRoot
- AMM'nin LP tokenleri için güven hatları. Bu güven hatlarının 0 bakiyesi olur, ancak limit gibi diğer detayları, varsayılan değerden farklı bir değere ayarlanmış olabilir.
- AMM havuzunda bulunan varlıkların güven hatları.

Eğer AMM hesabına bağlı 512'den fazla güven hattı varsa, işlem başarılı olur ve mümkün olduğunca çok güven hattı silinir; ancak AMM, defterde havuzunda varlık kalmadan bırakılır.

AMM'nin havuzunda varlık yoksa, herkes bir [AMMDelete işlemi][] göndererek onu silebilir; eğer kalan güven hatlarının sayısı hala sınırdan fazlaysa, AMM'yi tamamen silmek için birden fazla AMMDelete işlemi gerekli olabilir. Alternatif olarak, herkes AMM'yi yeniymiş gibi finanse etmek için `özel bir yatırım` gerçekleştirebilir. Boş bir varlık havuzuna sahip bir AMM üzerinde başka hiçbir işlem geçerli değildir.

Boş bir AMM'yi silmek için bir geri ödeme veya teşvik yoktur.

