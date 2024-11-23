# Fiyatlandırılmış Çağ Yayılması Sözleşmesi



#####  (Son güncelleme: 20 Şubat 2022)

##### 

Bu sözleşme, tamamen teminatlandırılmış bir çağ yayılımını uygulamaktadır. Bir çağ yayılımını,  olarak kullanarak, gelecekteki işlemler, put'lar, çağlar ve tahmin piyasası, sigorta ve daha fazlası için bir temel oluşturan etkinlik ikili seçenekleri yaratabilirsiniz. Çağ yayılması, bir uygulanma fiyatında satın alınan bir çağ opsiyonu ile daha yüksek bir fiyattan satılan ikinci bir çağ opsiyonunun kombinasyonudur. Bir çağ yayılması, belirli bir malın değerine bağlı olarak, bilinen bir gelecekte ödenecek tamamlayıcı miktarları ödeyen iki katılımcı koltuğa sahiptir. Bu video, sözleşmenin  sunmaktadır.

Çağ yayılımının iki versiyonu vardır. Bu versiyonda, yaratıcının, her birinin bir pozisyonu elde etmesine olanak tanıyan ve teminatın bir kısmını sağlaması gereken bir çift davet talep etmesi gerekmektedir. Diğer versiyon ise  olarak adlandırılmaktadır. Bu, yaratıcısı tarafından tamamen finanse edilmektedir ve yaratıcı daha sonra bu opsiyonları diğer taraflara satabilir (veya başka şekilde transfer edebilir). Opsiyonları temsil eden Zoe davetleri çiftler halinde üretilir. Bireysel opsiyonlar, potansiyel alıcılar tarafından incelenebilir detaylara sahip Zoe davetleridir.

Bu opsiyonlar finansal olarak sonuçlandırılır. Başlangıçta orijinal alıcının temel varlığın mülkiyetine sahip olma zorunluluğu yoktur ve yararlanıcıların kapanışta teslim almayı beklememesi gerekir.

## İhraçcılar

Çarpan ve Teminat para birimleri genellikle aynı olur. Ancak bu sözleşmeler para birimlerini ayrıştırır. Örneğin, APPL hissesi (`Underlying`) üzerinden bir yayılım oluşturabilir, hisse fiyatı USD olarak (`Strike`) belirlenir ve sözleşme JPY olarak (`Collateral`) ödenir.

`issuerKeywordRecord`, Üzerinde, Çarpan ve Teminat için ihraççıları tanımlar.

- Nihai değeri ödemeleri belirleyen varlık, `Underlying` kullanır. Bu genellikle fungible bir para birimi olsa da zorunlu değildir. "Üstün Büyü Kılıcı"nın değerine dair bir çağ yayılımı sözleşmesi yapmak tamamen geçerli olacaktır; yeter ki sona erme zamanında fiyatını belirlemek için bir fiyat oracle'ı bulunsun.
- Orijinal depozit ve ödeme, `Collateral` ihraççısını kullanır.
- `Strike` miktarları, Temas'ın değerine dair fiyat oracle’ının alıntısı için ve koşullardaki uygulanma fiyatları için kullanılır.

## Koşullar

Koşullar, `{ timer, underlyingAmount, expiration, priceAuthority, strikePrice1, strikePrice2, settlementAmount }` içerir.

- `timer`,  olmalı ve `priceAuthority` tarafından tanınmalıdır.
- `expiration`, `timer` tarafından tanınan bir zamandır.
- `underlyingAmount`, `priceAuthority`'ye iletilir. Bu bir NFT veya fungible bir miktar olabilir.
- `strikePrice2`, `strikePrice1`'den büyük olmalıdır.
- `settlementAmount`, yaratıcının yatırdığı ve opsiyon sahipleri arasında bölünen miktardır. Teminatı kullanır.
- `priceAuthority`, belirli bir zaman için fiyat taleplerine yanıt verebilmesi için bir timer’a sahip olan bir oracledır. Son tarihten sonra, uygulanma varlığının değerini belirten bir PriceQuote yayınlayacaktır.

<<< @/../snippets/zoe/contracts/test-callSpread.js#startInstancePriced

## Opsiyon Davetlerini Oluşturma

Koşullar, opsiyonların tüm detaylarını belirtir. Uzun pozisyon için katkıda bulunulacak payı belirtmek için `creatorFacet.makeInvitationPair()` çağrısı gerekmektedir. Bu, bir çift davet döndürür.

<<< @/../snippets/zoe/contracts/test-callSpread.js#makeInvitationPriced

Yaratıcı, bu davetleri iki tarafa verir (veya kendisi için birini tutabilir). Bob bir davet aldığında, istediği çağ yayılımı opsiyonunun değerini çıkarabilir ve bir teklifte bulunabilir. Gereken teminat, opsiyonun detaylarında da bulunmaktadır. Davetlerin sahipleri, gereksinim duyulan teminat ile uygulama işlemi yaparak gerçek çağ yayılımı opsiyon pozisyonlarını alabilir.

<<< @/../snippets/zoe/contracts/test-callSpread.js#exercisePricedInvitation

## Opsiyonları Doğrulama

Opsiyonlar, tam olarak kendini tanımlayan davetler olarak paketlenmiştir ve Zoe ile doğrulanabilir, böylece değerleri bunlara ilgi duyan herkes tarafından anlaşılır hale gelir.

<<< @/../snippets/zoe/contracts/test-callSpread.js#validatePricedInvitation

Bu sözleşmenin örneği ile ilişkilendirilmiş şartların detayları, temel çağ yayılımı opsiyonunun erişilebilirliğini sağlar.

<<< @/../snippets/zoe/contracts/test-callSpread.js#checkTerms-priced

## Opsiyonlar Bağımsız Olarak Uygulanabilir

Opsiyon pozisyon davetleri ücretsiz olarak kullanılabilir ve `Collateral` anahtar kelimesi altında ödemelerini sağlar.

<<< @/../snippets/zoe/contracts/test-callSpread.js#bobExercise

Sözleşme, opsiyonların belirlenen kapanıştan önce kullanılmalarına bağlı değildir. Eğer herhangi bir opsiyon, kapanış fiyatı belirlendikten sonra kullanılırsa, ödemeler hala mevcut olacaktır. İki opsiyon, kullanımdan sonra mümkün olan en kısa sürede ödeme sağlamakta olup, hiçbiri diğerinin kullanılmasını beklemez.