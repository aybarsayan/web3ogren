---
id: funded-call-spread
title: Finanse Edilmiş Çağrı Yayılması Sözleşmesi
---



#####  (Son güncelleme: 20 Şubat 2022)

##### 

Bu sözleşme tamamen teminatlandırılmış bir çağrı yayılması uygulamaktadır. Çağrı yayılması, gelecekteki sözleşmeler, put'lar, call'lar ve bir tahmin pazarının, sigortanın ve çok daha fazlasının temeline atılacak finansal yapı taşlarından biri olarak kullanılabilir. Bir çağrı yayılması, bir satış fiyatında satın alınan bir çağrı opsiyonu ile daha yüksek bir fiyatla satılan ikinci bir çağrı opsiyonunun birleşimidir. Bir çağrı yayılmasında, belirli bir malın bilinen gelecekteki bir zamanda değerine bağlı olarak tamamlayıcı miktarları ödeyen iki katılımcı koltuğu bulunur. Bu video, sözleşmenin  sunmaktadır.

Çağrı yayılmasının iki varyantı vardır. Bu sözleşme, onları diğer taraflara satabilen (veya başka bir şekilde devretme hakkına sahip) yaratıcısı tarafından tamamen finanse edilmiştir. Diğer varyant,  olarak adlandırılır. Bu varyant, yaratıcının her iki tarafın sağlaması gereken teminatın oranını belirtmesine olanak tanır. Her bir taraf, belirli bir pozisyon için belirtilen bir teminat miktarını katkıda bulunma davetiyesi alır.

Bu opsiyonlar finansal olarak sonuçlandırılır. Başlangıçta orijinal alıcının altta yatan varlığın mülkiyetine sahip olması gerekmez ve yararlanıcıların kapanışta teslimat beklememesi gerektiği anlamına gelir.

## İhraçcılar

Çarpma ve Teminat para birimleri genellikle aynı olur, ancak bu sözleşmeler para birimlerini ayrıştırır. Örneğin, bir APPL hisse senedine (`Underlying`) dayalı bir yayılma ile USD cinsinden hisse senedi fiyatı (`Strike`) olan ve sözleşmenin JPY cinsinden ödemeler yaptığı bir senaryo olabilir.

`issuerKeywordRecord`, Üzerindeki, Çarpma ve Teminat için ihracatçıları belirtmektedir.

- Nihai değeri ödeme miktarlarını belirleyen varlık, `Underlying` kullanır. Bu genellikle bir fungible para birimidir ancak şart değildir. Eğer bir "Üstün Büyülü Kılıç"ın değerine dayalı bir çağrı yayılması sözleşmesine sahip olmanızda hiçbir sakınca yoktur, yeter ki sona erme zamanında fiyatını belirlemek için bir fiyat oracle'ı olsun.
- Orijinal depozito ve ödeme, `Collateral` ihracatçısını kullanır.
- `Strike` miktarları, altta yatan varlığın değeriyle ilgili fiyat oracle'ının alıntısı için ve sözleşme şartlarındaki çarpma fiyatları için kullanılır.

## Şartlar

Şartlar `{ timer, underlyingAmount, expiration, priceAuthority, strikePrice1, strikePrice2, settlementAmount }` içerir.

- `timer`,  olup, `priceAuthority` tarafından tanınmalıdır.
- `expiration`, `timer` tarafından tanınan bir zamandır.
- `underlyingAmount`, `priceAuthority`'ye geçirilir. Bu bir NFT veya bir fungible miktar olabilir.
- `strikePrice2`, `strikePrice1`'den büyük olmalıdır.
- `settlementAmount`, yaratıcı tarafından yatırılan ve opsiyon sahipleri arasında paylaşılan miktardır. Teminat kullanır.
- `priceAuthority`, belirlenen zamana göre fiyat taleplerine yanıt verebilecek bir saat olan bir oracldır. Son tarihten sonra, alt varlığın çarpma para birimindeki değerini vererek bir PriceQuote yayınlayacaktır.

<<< @/../snippets/zoe/contracts/test-callSpread.js#startInstance

## Opsiyonların Oluşturulması

Şartlar tüm opsiyon detaylarını belirtir. Ancak, opsiyonlar yaratıcı, değerli hale gelmelerini sağlayan teminatı temin edene kadar verilmez. `creatorInvitation`, iki opsiyonun miktarlarını içeren `customProperties`'a sahiptir: `longAmount` ve `shortAmount`.

<<< @/../snippets/zoe/contracts/test-callSpread.js#invitationDetails

Yaratıcı, bu opsiyon miktarlarını kullanarak, iki opsiyonu fonlar karşılığında alacak şekilde bir teklif oluşturur. Teklif, istenen opsiyonları ve sağlanan teminatı tanımlar. Teklif yapıldığında, iki opsiyon pozisyonunu içeren bir ödeme geri döner. Pozisyonlar, ücretsiz olarak kullanılabilecek davetiyelerdir ve `Collateral` anahtar kelimesi altında opsiyon ödemelerini sağlar.

<<< @/../snippets/zoe/contracts/test-callSpread.js#creatorInvitation

## Opsiyonların Doğrulanması

Sözleşmeden dönen opsiyonlar, Zoe davetiyeleridir, bu nedenle değeri ve şartları sözleşme şartlarını talep ederek doğrulanabilir. Bu, opsiyonların satılmasını mümkün kılar çünkü potansiyel bir alıcı değeri inceleyebilir. Potansiyel alıcı, pricesAuthority'nın güvenilir olup olmadığını görebilir ve altta yatan miktarı doğrulayabilir. Ayrıca, sona erme süresinin beklentileriyle eşleşip eşleşmediğini kontrol edebilir (burada `3n`, testte manuel bir zamanlayıcı için uygun olan küçük bir tam sayıdır; gerçek kullanımda, blok yüksekliği veya duvar saati zamanı temsil edebilir). Çarpma fiyatları ve sonunda alınacak miktar da görünürdür.

<<< @/../snippets/zoe/contracts/test-callSpread.js#verifyTerms

## Opsiyonlar Bağımsız Olarak Kullanılabilir

Sözleşme, opsiyonların belirtilen kapanıştan önce kullanılmasını gerektirmez. Eğer her iki opsiyon kapanış fiyatı belirlendikten sonra kullanılırsa, ödemeler yine de mevcut olacaktır. İki opsiyon, fiyat mevcut olduğunda mümkün olan en kısa sürede ödemelerini sağlar ve biri diğerinin kullanılmasını beklemez.

<<< @/../snippets/zoe/contracts/test-callSpread.js#bobExercise

Bu opsiyonları basit bir şekilde satmak için kullanabileceğiniz bir  vardır.