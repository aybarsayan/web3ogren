---
title: Teklifler
seoTitle: XRP Ledger Teklifler Rehberi
sidebar_position: 4
description: Teklifler, XRP Ledgerın para ticaret emirlerinin şeklidir. Yaşam döngülerini ve özelliklerini anlayın.
tags: 
  - XRP Ledger
  - Teklifler
  - merkeziyetsiz borsa
  - ticaret emirleri
  - döviz kuru
  - güven hatları
  - fonlama durumları
keywords: 
  - XRP Ledger
  - Teklifler
  - merkeziyetsiz borsa
  - ticaret emirleri
  - döviz kuru
  - güven hatları
  - fonlama durumları
---

## Teklifler

XRP Ledger'ın `merkeziyetsiz borsasında` ticaret emirlerine "Teklifler" denir. Teklifler XRP'yi `tokenlarla` veya tokenları diğer tokenlarla, aynı para koduna sahip ancak farklı ihraççıları olan tokenlarla değiştirebilir. (Aynı kodu taşıyan ancak farklı ihraççılara sahip tokenlar bazen `rippling` aracılığıyla da değiştirilebilir.)

- Bir Teklif oluşturmak için bir [Teklif Oluşturma işlemi][] gönderin.
- Tamamen doldurulmayan Teklifler, hemen `Teklif nesneleri` olarak defter verilerine kaydedilir. Sonraki Teklifler ve Ödemeler, defterden Teklif nesnesini tüketebilir.
- `Çapraz döviz ödemeleri` Likidite sağlamak için Teklifleri tüketir. Ancak, defterde hiç Teklif nesnesi oluşturmazlar.

## Teklifin Yaşam Döngüsü

> Bir [Teklif Oluşturma işlemi][] ticaret yapmak için bir talimat olup, ya iki token arasında ya da bir token ve XRP arasında gerçekleşir. Her böyle işlem, bir alım miktarı (`TakerPays`) ve bir satım miktarı (`TakerGets`) içerir. — 

İşlem işlendiğinde, mümkün olan en yüksek ölçüde eşleşen veya karşıt Teklifleri otomatik olarak tüketir. Eğer bu, yeni Teklifi tamamen doldurmazsa, geri kalanı defterde Teklif nesnesi haline gelir.

Teklif nesnesi, diğer Teklifler veya çapraz döviz ödemeleri tarafından tamamen tüketilene kadar defterde bekler. Teklifin yerleştirildiği hesap, Teklifin _sahibi_ olarak adlandırılır. Kendi Tekliflerinizi istediğiniz zaman, özel bir [Teklif İptal işlemi][] kullanarak veya [Teklif Oluşturma işlemi][] opsiyonu olarak iptal edebilirsiniz.

:::tip
Teklifleriniz varken, XRP'nizden bir kısmı `sahip rezervine` ayırılır. Teklif herhangi bir nedenle kaldırıldığında, o XRP yeniden serbest bırakılır.
:::

### Varyasyonlar

- **Alış ve Satış:** Varsayılan olarak, Teklifler "alış" Teklifleri olup, "alış" (`TakerPays`) miktarını tamamen aldığınızda tam olarak doldurulmuş kabul edilir. (Belirtilen miktarı alırken beklediğinizden daha az harcayabilirsiniz.) 

Buna karşılık, bir "Satış" Teklifi yalnızca tüm "satış" (`TakerGets`) miktarını harcadığınızda tamamen doldurulmuş sayılır. (Belirtilen miktarı harcarken beklediğinizden daha fazla alabilirsiniz.) 

- Bir **Hızlı veya İptal** Teklifi, deftere yerleştirilmez, böylece yalnızca işlem işlendiğinde mevcut olan, eşleşen Tekliflerle eşleşen miktara kadar işlem yapar.
- Bir **Doldur veya İptal** Teklifi, deftere yerleştirilmez ve başlangıçta gerçekleştirilirken tam miktarı doldurulmazsa iptal edilir. Bu, "Hızlı veya İptal" ile benzerdir, ancak _kısmen_ doldurulamaz.
- **Pasif** Teklif, tam olarak aynı döviz kuru (karşı yönü) ile eşleşen Teklifleri tüketmez ve doğrudan deftere yerleştirilir. İki varlık arasında kesin bir sabit oluşturmak için kullanılabilir. Pasif Teklifler, daha iyi bir döviz oranına sahip diğer Teklifleri yine de tüketmektedir.

## Fonlama Gereksinimleri

Bir Teklif yerleştirmeye çalıştığınızda, işlem "fonlanmamış" olarak reddedilir, eğer işlemin satacağı varlık için en azından bir miktarına sahip değilseniz.

**Bir token satmak için**, ya:

- O tokenın herhangi bir pozitif miktarına sahip olmalısınız, _ya da_
- Tokenın ihraççısı olmalısınız.

Ancak, Teklifte belirtilen tam miktara sahip olmanız gerekmez. Bir Teklif oluşturmak, fonlarınızı kilitlemez, bu nedenle aynı tokenları (veya XRP) satmak için birden fazla Teklif yerleştirebilir veya bir Teklif yerleştirip daha sonra tam olarak fonlamak için yeterince token veya XRP almayı umabilirsiniz.

**XRP satmak için**, deftere yerleştirilecek Teklif nesnesi için, alacağınız tokenı tutacak güven hesapları için gerekli olan tüm `rezerv gereksinimlerini` karşılayacak kadar XRP'ye sahip olmalısınız. Rezerv miktarını ayırdıktan sonra bir miktar XRP'niz kaldığı sürece Teklif yerleştirebilirsiniz.

Bir Teklifiniz başka bir Teklif ile eşleştiğinde, her iki Teklif de sahiplerinin fonlarının izin verdiği ölçüde işlenir. Eğer eşleşen Teklifler varsa ve sizin Teklifiniz tamamen doldurulmadan önce fonlarınız biterse, geri kalan Teklifiniz iptal edilir. 

:::warning
Bir Teklif, o tokenın bakiyesini negatif hale getiremez, eğer o tokenın ihraççısı değilseniz. (Eğer ihraççıysanız, Teklifleri kullanarak yeni tokenlar çıkarabilirsiniz; çıkardığınız tokenlar, bakiyelerinizde negatif olarak temsil edilir.)
:::

Ledger'deki mevcut Tekliflerinizden herhangi birini aşan bir Teklif yerleştirirseniz, eski, aşılmış Teklifler otomatik olarak iptal edilir, ilgilenen miktarlarına bakılmaksızın.

Geçici veya kalıcı olarak _fonlanmamış_ hale gelmesi mümkün olan Teklif durumları şunlardır:

- Eğer sahibi artık satılan varlığa sahip değilse.
    - Teklif, sahibi daha fazla varlık edindiğinde yeniden fonlanır.
- Eğer satılan varlık, bir `dondurulmuş güven hattında` bir token ise.
    - Teklif, güven hattı artık dondurulmadığında yeniden fonlanır.
- Eğer Teklif yeni bir güven hattı oluşturması gerekiyorsa ama sahibi artırılmış `rezerv` için yeterli XRP'ye sahip değilse. (Bkz. `Teklifler ve Güven`.)
    - Teklif, sahibi daha fazla XRP edindiğinde veya rezerv gereksinimleri düştüğünde yeniden fonlanır.
- Eğer Teklif süresi dolmuşsa. (Bkz. `Teklif Süresi Dolmaları`.)

Fonlanmamış bir Teklif, bir işlem onu kaldırana kadar defterde kalır. Teklifin defterden kaldırılabileceği yollar şunlardır:

- Eşleşen bir Teklif veya `Çapraz döviz ödemesi` Teklifi tamamen tüketir.
- Sahibi Teklifi açıkça iptal eder.
- Sahibi, onu aşan yeni bir Teklif göndererek Teklifini dolaylı olarak iptal eder.
- İşlem işlenirken Teklifin fonlanmamış veya süresi dolmuş olduğu tespit edilir. Genellikle bu, başka bir Teklifin onu tüketmeye çalıştığı, ancak başaramadığı anlamına gelir.
    - Bu, Teklifin ödenecek kalan miktarının sıfıra yuvarlandığı durumları içerir.

### Fonlanmamış Teklifleri Takip Etme

Tüm Tekliflerin fonlama durumunu takip etmek, hesaplama açısından zorlayıcı olabilir. Özellikle, aktif ticaret yapan adreslerin çok sayıda açık Teklifleri olabilir. Tek bir bakiye, birçok Teklifin fonlama durumunu etkileyebilir. Bu nedenle, XRP Ledger, fonlanmamış veya süresi dolmuş Teklifleri proaktif olarak bulup kaldırmaz.

Bir istemci uygulaması, Tekliflerin fonlama durumunu yerel olarak takip edebilir. Bunu yapmak için, önce [book_offers yöntemi][] kullanarak bir emir defteri alın ve Tekliflerin `taker_gets_funded` alanını kontrol edin. Ardından, `transactions` akışına `abonelik` yapın ve hangi Tekliflerin değiştirildiğini görmek için işlem meta verilerini izleyin.

## Teklifler ve Güven

`Hassas hatlar` sınırlama değerleri Teklifleri etkilemez. Başka bir deyişle, bir Teklif kullanarak, bir ihraççı için güvendiğiniz en yüksek miktardan daha fazlasını edinebilirsiniz.

Ancak, tokenları tutmak yine de ihraççıya bir güven hattı gerektirir. Bir Teklif işleme alındığında, gerekli güven hatlarını otomatik olarak oluşturur ve limitlerini 0 olarak ayarlar. `Güven hatları, bir hesabın tutması gereken rezervi artırır`, bu nedenle yeni bir güven hattı gerektiren herhangi bir Teklif, adresin o güven hattı için rezerv gereksinimini karşılayacak kadar XRP'ye sahip olmasını gerektirir.

:::note
Güven hattı limitleri, almak istediğiniz tokendan daha fazlasını ödemenizi sağlamaz. Teklifler, ne kadar token almak istediğinizi ifade eden açık bir beyan oldukları için bu limitleri aşabilirler.
:::


## Teklif Tercihi

Mevcut Teklifler, `TakerGets` ve `TakerPays` arasındaki oran olarak ölçülen döviz kuruna göre gruplandırılır. Daha yüksek döviz kuruna sahip Teklifler öncelikle alınır. (Yani, teklifi kabul eden kişi, ödeyebileceği miktara karşılık olarak alabileceği kadar fazla alır.) 

Aynı döviz kuruna sahip Teklifler, ilk yerleştirilenlerin temelinde alınır.

Teklifler aynı defter bloğunda işlenirken, hangi sırayla işleneceği, işlemlerin [deftere uygulanma](https://github.com/XRPLF/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/consensus/LedgerConsensus.cpp#L1435-L1538 "Kaynak kodu: İşlem sıralaması") [kanonik sırasına](https://github.com/XRPLF/rippled/blob/release/src/ripple/app/misc/CanonicalTXSet.cpp "Kaynak kodu: İşlem sıralaması") bağlıdır. Bu davranış, belirleyici, verimli ve manipüle edilmesi zor olacak şekilde tasarlanmıştır.

## Teklif Süresi Dolması

Bir Teklif yerleştirdiğinizde, isteğe bağlı olarak ona bir son tarih ekleyebilirsiniz. Varsayılan olarak, Teklifler süresi dolmaz. Zaten süresi dolmuş bir yeni Teklif oluşturamazsınız.

Süre dolum süreleri saniye seviyesinde belirtilir, ancak bir Teklifin süresinin dolduğu gerçek dünyadaki zaman daha az kesindir. Bir Teklif, süresi dolmuş bir zaman dilimine sahipse, bu süresi dolmuş kabul edilir. Aksi takdirde, bir Teklif hala işlem yapılabilir, gerçek dünya zamanı Teklifin süresinin bitiminden daha geç olsa bile.

:::note
Başka bir deyişle, bir Teklif hala "aktif" sayılırsa, süresi dolmuş olan zaman dilimi, en son doğrulanan defterin kapanış zamanından daha geçse, saatlerinizin zamanı ne olursa olsun.
:::

Bu, ağın nasıl uzlaşma sağladığına dair bir sonuçtur. Tüm eşler arası ağın bir uzlaşmaya ulaşabilmesi için, tüm sunucular hangi Tekliflerin süresi dolmuş olduğu konusunda işlem uygular. Bireysel sunucular, iç saat ayarlarında hafif farklılıklar gösterebilir, bu nedenle "geçerli" zamanı kullansalardı hangi Tekliflerin süresi dolmuş olduğunu belirlemede aynı sonuca ulaşmayabilirler. 

Bir defterin kapanma zamanı, o defterdeki işlemler işlenene kadar bilinmez, bu yüzden sunucular bunun yerine _önceki_ defterin resmi kapanma zamanını kullanır. `Defter kapanma süreleri yuvarlanır`, bu da geçerli dünya zamanı ile Teklifin süresinin dolup dolmadığını belirlemek için kullanılan zaman arasındaki potansiyel farkı artırır.

:::info Süresi dolmuş Teklifler, bir işlem onları kaldırana kadar defter verilerinde kalır. O zamana kadar, API'den (örneğin, [ledger_entry yöntemi][] kullanarak) alınan verilerde görünebilirler. İşlemler, buldukları süresi dolmuş ve fonlanmamış Teklifleri otomatik olarak siler, genellikle bunlarla eşleşip onları iptal edecek Teklifler veya çapraz döviz ödemeleri uygulanırken. Bir Teklife ait olan sahip rezervi, Teklif gerçekten silinene kadar tekrar kullanıma açılmaz.:::

## Ayrıca Bakınız

- **Kavramlar:**
    - `Tokenlar`
    - `Yollar`
- **Referanslar:**
    - [account_offers yöntemi][]
    - [book_offers yöntemi][]
    - [Teklif Oluşturma işlemi][]
    - [Teklif İptal işlemi][]
    - `Teklif nesnesi`

