---
title: Negatif UNL
seoTitle: Negatif UNL ve XRP Defteri
sidebar_position: 4
description: Negatif UNLnin, XRP Defterinde ağın dayanıklılığını artırma işlevini keşfedin. Ağın, kısmi kesintiler sırasında nasıl sürdürülebilir hale geldiğini anlayın.
tags: 
  - Negatif UNL
  - XRP
  - Konsensüs Protokolü
  - Blockchain
  - Güvenilir Doğrulayıcılar
  - Ağ Sürekliliği
  - Defter Sürümü
keywords: 
  - Negatif UNL
  - XRP
  - Konsensüs Protokolü
  - Blockchain
  - Güvenilir Doğrulayıcılar
  - Ağ Sürekliliği
  - Defter Sürümü
---

## Negatif UNL

_`_NegatifUNL Değişikliği_ hakkında eklendi`._

_Negatif UNL_, XRP Defteri `konsensüs protokolü` bir özelliğidir ve _canlılığı_, ağın kısmi bir kesinti sırasında ileriye doğru ilerleme yeteneğini geliştirir. Negatif UNL kullanarak, sunucular, hangi doğrulayıcıların şu anda çevrimiçi ve çalışır olduğuna bağlı olarak etkili UNL'lerini ayarlar, böylece yeni bir `defter sürümü` birkaç güvenilir doğrulayıcı çevrimdışı olsa bile _doğrulanmış_ olarak ilan edilebilir.

:::info
Negatif UNL, ağın işlem işlemleri veya işlemlerin sonuçlarını nasıl işlediği üzerinde bir etkiye sahip değildir; tek istisna, ağın bazı tür kısmi kesintiler sırasında sonuçları nihai olarak ilan etme yeteneğini artırmasıdır.
:::

## Arka Plan

XRP Defteri protokolündeki her sunucu, güvenilir doğrulayıcılarının bir çoğunluğu (quorum) kabul ettiğinde bir defter sürümünün doğrulandığını bağımsız olarak karar verir. Bir sunucunun güvenilir doğrulayıcıları, o sunucunun UNL'si (Eşsiz Düğüm Listesi) tarafından tanımlanır; bu, çakışmaması için güvendiği doğrulayıcıların bir listesidir. Varsayılan olarak, sunucular en az birinde bir doğrulayıcıya güvenmeye ayarlanmış iki listeden herhangi birini, biri XRP Defteri Vakfı tarafından yayımlanan UNL ve diğeri Ripple tarafından yayımlanan UNL'yi güvenilir kabul eder.

Standart çoğunluk (quorum) gereksinimi güvenilir doğrulayıcıların %80'idir. Eğer güvenilir doğrulayıcıların %20'sinden fazlası çevrimdışı olursa veya ağın geri kalanıyla iletişim kuramaz hale gelirse, sunucular yeni defterleri doğrulamayı durdurur çünkü birçoğunluğa ulaşamazlar. Bu, sonuçların nihai olarak ilan edildiği andan sonra değiştirilememesini sağlamak için bir tasarım seçimidir. Bu tür bir durumda, geri kalan sunucular hala çevrimiçi olacaktır ve geçmiş ve geçici işlemlere dair verileri sağlayabilir, ancak yeni işlemlerin nihai, değişmez sonucunu doğrulayamazlar.

> "Çeşitli bir doğrulayıcı setinin %100 çevrimiçi kalmasını beklemek mantıklı değildir."  
> — Protokol Bilgisi

Ancak bu, birkaç yaygın olarak güvenilen doğrulayıcının çevrimdışı olması halinde ağın ileriye doğru ilerlemeyi durdurabileceği anlamına gelir. 2024-06-25 itibarıyla varsayılan UNL'lerde toplamda 35 doğrulayıcı bulunmaktadır, bu nedenle ağ, 8 veya daha fazla çevrimdışı ise ilerlemeyi durduracaktır.

---

## Özet

Ağaç, donanım bakımı, yazılım güncellemeleri, internet bağlantı sorunları, hedefli saldırılar, insan hatası, donanım arızaları ve doğal afetler gibi sebepler, bir doğrulayıcının geçici olarak kullanılamamasına neden olabilir. "Negatif UNL", **çevrimdışı veya arızalı olduğu düşünülen güvenilir doğrulayıcıların bir listesidir; bu liste geri kalan doğrulayıcılar tarafından bir konsensusla ilan edilir.** Negatif UNL'deki doğrulayıcılar, yeni bir defter sürümünün konsensusa ulaşıp ulaşmadığını belirlemede yok sayılır.

Negatif UNL'de bulunan bir doğrulayıcı çevrimiçi döndüğünde ve tutarlı doğrulama oyları gönderdiğinde, geri kalan doğrulayıcılar onu kısa bir süre sonra Negatif UNL'den çıkarır.

1. Doğrulayıcılar bir veya iki tane birer birer çevrimdışı giderken, geri kalan doğrulayıcılar etkili UNL'lerini kademeli olarak ayarlamak için Negatif UNL'yi kullanabilir; böylece ağ, bir çoğunluğa ulaşmak için yalnızca çevrimdışı olan doğrulayıcıların %80'ine ihtiyaç duyar.
2. Ağın parçalanmasını önlemek için, çoğunluğun toplam doğrulayıcıların en az %60'ı olması gerekir.

Eğer %20'den fazla doğrulayıcı aniden bir anda çevrimdışı olursa, geri kalan sunucular yeni bir defteri doğrulamak için gerekli olan çoğunluğu elde edemez. Ancak, o sunucular azalan konsensüs turları aracılığıyla geçici bir ileriye doğru ilerleme sağlayabilirler.

:::warning
Negatif UNL, `stand-alone mode` üzerinde hiçbir etkiye sahip değildir; çünkü sunucu, stand-alone modda konsensus kullanmaz.
:::

## Nasıl Çalışır

Negatif UNL, `konsensüs süreci` ile yakından ilişkilidir ve ağın olumsuz durumlarda sürekliliğini ve güvenilirliğini sürdürmek için korumalarla tasarlanmıştır. Tüm güvenilir doğrulayıcılar normal çalıştığında, Negatif UNL kullanılmaz ve hiçbir etkisi yoktur. Bazı doğrulayıcılar çevrimdışı veya senkronizasyon dışı göründüğünde, Negatif UNL kuralları devreye girer.

:::note
Negatif UNL, belirli bir defter sürümünün konsensüs sürecine hangi Negatif UNL'nin uygulanacağı konusunda herhangi bir zamana dayalı anlaşmazlığı önlemek için yavaş bir hızda değişecek şekilde tasarlanmıştır.
:::

### Güvenilirlik Ölçümü

Ağdaki her sunucunun, çakışmayan doğrulayıcılarına güvenmediği bir UNL'si bulunmaktadır. (Varsayılan olarak, bir sunucunun kesin UNL'si, Ripple'ın yayımladığı önerilen doğrulayıcı listesinin temelinde örtük olarak ayarlanmıştır.) Her sunucu, güvenilir doğrulayıcılarının _güvenilirliğini_, son 256 defterin, doğrulayıcının doğrulama oylarının, sunucunun konsensus görüntüsüyle eşleştiği oranı kullanarak takip eder. Diğer bir deyişle:

> Güvenilirlik = Va ÷ 256  
> — Doğrulama Hesaplaması

Va, son 256 defter için bir doğrulayıcıdan alınan ve sunucunun kendine ait konsensus görüşüyle eşleşen toplam doğrulama oylarının sayısını ifade eder.

Bu güvenilirlik ölçütü, bir doğrulayıcının _ve_ o doğrulayıcının davranışının mevcut olmasını ölçer. Bir doğrulayıcının güvenilirlik puanı, ağın geri kalanıyla senkronize ve sunucunun puanlama kurallarını izliyorsa yüksek olmalıdır. Bir doğrulayıcının güvenilirlik puanı aşağıdaki sebeplerden biri nedeniyle zarar görebilir:

- Doğrulayıcının doğrulama oyları sunucuya ulaşamıyorsa, bu da onların arasındaki zayıf ağ bağlantısı nedeniyle olabilir.
- Doğrulayıcı çalışmıyorsa veya aşırı yüklenmişse.
- Doğrulayıcı, çeşitli sebeplerle sunucu ile aynı protokol kurallarını izlemiyorsa; muhtemel sebepler arasında yanlış yapılandırma, yazılım hataları, kasıtlı olarak `farklı bir ağ` izlemek veya kötü niyetli davranışlar yer alabilir.

Eğer bir doğrulayıcının güvenilirliği **%50'den az** ise, o doğrulayıcı Negatif UNL'ye eklenmek için adaydır. Negatif UNL'den çıkarılmak için, bir doğrulayıcının güvenilirliği **%80'den fazla** olmalıdır.

Her sunucu, doğrulayıcılar da dahil olmak üzere, kendi güvenilir doğrulayıcıları için bağımsız olarak güvenilirlik puanları hesaplar. Farklı sunucular, bir doğrulayıcının güvenilirliği hakkında farklı sonuçlara ulaşabilirler; bu ya o doğrulayıcının oyları bir sunucuya ulaşırken diğerine ulaşmaması ya da belirli defterler hakkında birbirlerinden daha fazla veya daha az sıklıkla anlaşmazlık yaşamaları nedeniyle olabilir. Negatif UNL'den bir doğrulayıcı eklemek veya çıkarmak için, güvenilir doğrulayıcıların konsensusu, belirli bir doğrulayıcının güvenilirlik eşiğinin üzerinde veya altında olduğu konusunda hemfikir olmalıdır.

:::tip
Doğrulayıcılar kendi güvenilirliklerini takip ederler, ancak kendilerini Negatif UNL'ye eklemeye önermezler. Bir doğrulayıcının kendi güvenilirliğini ölçmesi, doğrulama oylarının ağda ne kadar başarılı bir şekilde yayıldığını hesaba katamaz; bu nedenle dış sunuculardan alınan ölçümler kadar güvenilir değildir.
:::

### Negatif UNL'yi Değiştirme

Bir defter sürümü, _bayrak defteri_ olarak kabul edilir eğer defter indeksi 256'ya tam bölünebiliyorsa. Negatif UNL, yalnızca bayrak defterlerinde değiştirilebilir. (Bayrak defterleri, XRP Defteri Ana Ağı üzerinde yaklaşık her 15 dakikada bir meydana gelir. Düşük işlem hacmine sahip test ağlarında daha uzun aralıklarla meydana gelebilirler.)

Her bayrak defterinde, aşağıdaki değişiklikler geçerlidir:

1. Önceki bayrak defterinde planlanan Negatif UNL değişiklikleri, bir sonraki defter sürümünde geçerlidir. Bu bayrak defterinin kendisinin doğrulanması için konsensüs süreci planlanan değişikliği kullanmaz.

    :::info
    Bu, bir defterin durum verilerinin, bir `işlem` veya `sahte işlem` olmaksızın değiştirildiği tek durumlardan biridir.
    :::

2. Negatif UNL dolu değilse, her sunucu %50'den az güvenilirliğe sahip güvenilir doğrulayıcılarından **1** doğrulayıcı eklenmesini önermektedir.
3. Negatif UNL boş değilse, her sunucu Negatif UNL'den **1** doğrulayıcının çıkarılmasını önermektedir. Bir sunucu, bir doğrulayıcıyı Negatif UNL'den çıkarma önerisinde bulunabilir:
    - O doğrulayıcı %80'den fazla güvenilirlik puanına sahipse.
    - O doğrulayıcı kendi UNL'sinde yoksa. (Eğer bir doğrulayıcı kalıcı olarak devre dışı kalırsa, bu kural, sunucuların yapılandırmalarından çıkarıldıktan sonra defter üzerindeki Negatif UNL'den de çıkarılmasını sağlar.)
4. Eğer Negatif UNL için önerilen bir değişiklik, bir konsensus sağlarsa, değişiklik bir sonraki bayrak defterinde geçerli olacak şekilde planlanır. Bu şekilde en fazla bir ekleme ve bir çıkarma planlanabilir.

Doğrulayıcıları Negatif UNL'ye ekleme ve çıkarma önerileri, [UNLModify sahte işlemleri][] şeklinde ifade edilir. Konsensüs süreci, her sahte işlemin bir konsensusa ulaşıp ulaşmadığını veya dışarı atılıp atılmadığını belirler; bu, diğer `sahte işlemler` ile aynı şekilde gerçekleştirilir. Diğer bir deyişle, belirli bir doğrulayıcı Negatif UNL'ye eklenebilir veya çıkarılabilir olması için, sunucuların aynı değişikliği önermiş olması gerekmektedir.

Negatif UNL'deki planlı ve etkili değişiklikler, defterin durum verilerindeki `NegatifUNL nesnesi` içinde izlenir.

### Negatif UNL Sınırları

Ağın, iki veya daha fazla alt ağa bölünmesini önlemek için, Negatif UNL, çoğunluk gereksinimini toplam UNL kayıtlarının %60'ının altına düşüremez. Bunu sağlamak için, bir sunucu, Negatif UNL'nin "dolu" olduğunu, Negatif UNL'deki doğrulayıcıların sayısının sunucunun yapılandırılmış UNL'sindeki doğrulayıcıların sayısının %25'i (aşağı yuvarlanmış) kadar olması şartı ile değerlendirir. (Bu %25, %25'inin çıkarılması durumunda, geri kalan %75'teki %80'lik bir konsensüsün, orijinal sayının %60'ına eşit olduğu hesaplamasına dayanmaktadır.) Eğer bir sunucu Negatif UNL'nin dolu olduğuna karar verirse, yeni eklemeleri önermeyecektir; ancak nihai sonuç, güvenilir doğrulayıcıların ne yapacağına bağlıdır.

### Birden Fazla Aday Doğrulayıcıdan Seçim Yapma

Birden fazla doğrulayıcının güvenilirlik eşiğine dayanarak Negatif UNL'ye eklenmek için aday olması mümkündür. Her seferde yalnızca bir doğrulayıcı Negatif UNL'ye eklenebileceğinden, sunucular hangi doğrulayıcıyı önermek için seçeceklerini belirlemeleri gerekir. Birden fazla aday varsa, sunucu aşağıdaki mekanizmayı kullanarak hangi doğrulayıcıyı önereceklerini seçer:

1. Ana defter sürümünün defter hash'i ile başla.
2. Her aday doğrulayıcının genel anahtarını al.
3. Aday doğrulayıcı ve ana defterin hash'inin eksklizif-veya (XOR) değerini hesapla.
4. Hesaplamanın sayısal olarak en düşük sonucunu öner.

Eğer belirli bir bayrak defterinde Negatif UNL'den çıkarılacak birden fazla aday varsa, sunucular aynı mekanizmayı doğru seçmek için kullanır.

Bu mekanizmanın birkaç faydalı özelliği vardır:

- Tüm sunucuların erişiminde kolayca hesaplanabilen bilgilere dayanır.
- Çoğu sunucu, güvenilir doğrulayıcılar için biraz farklı puanlar hesaplamalarına rağmen, aynı adayı seçerler. Bu, sunucuların hangi doğrulayıcının _en az_ veya _en_ güvenilir olduğunu konusunda anlaşmazlık yaşasa bile geçerlidir. Bu, güvenilirlik eşiklerinin üzerinde veya altında olup olmadıkları hakkında sunucuların anlaşmazlık yaşadığı birçok durumda bile geçerlidir. Böylece ağ, hangi doğrulayıcının eklenip çıkarılacağı konusunda konsensusa ulaşma olasılığını artırır.
- Her defter sürümünde aynı sonuçları her zaman vermez. Negatif UNL'de önerilen bir değişiklik, bir konsensus sağlamadığında, ağ bazı sunucuların her seferinde aynı doğrulayıcıyı ekleme veya çıkarma konusunda başarısız olmasıyla sıkışıp kalmaz. Ağ, sonraki bayrak defterlerinde başka bir adayı Negatif UNL'ye eklemeyi veya çıkarmayı deneyebilir.

### Doğrulamaları Filtreleme

Konsensüs sürecinin `doğrulama aşaması` sırasında, ana defterin Negatif UNL'sindeki doğrulayıcılar devre dışı bırakılır. Her sunucu, devre dışı bırakılan doğrulayıcılar çıkarıldığında yapılandırılmış UNL'sinin bir "etkili UNL" toplamını hesaplar ve çoğunluğu yeniden hesaplar. (Çoğunluk her zaman etkili UNL'nin en az %80'i ve yapılandırılmış UNL'nin en az %60'ıdır). Eğer devre dışı bırakılan bir doğrulayıcı doğrulama oyları gönderirse, sunucular, devre dışı bırakılan doğrulayıcının güvenilirlik ölçümü hesaplanması için bu oyları izlerler, ancak bu oyları bir defter sürümünün bir konsensusa ulaşıp ulaşmadığını belirlemede kullanmazlar.

:::info
Negatif UNL, çoğunluğun hesaplandığı _toplam_ güvenilir doğrulayıcıları değil, toplam güvenilir doğrulayıcıların sayısını ayarlamaktadır; dolayısıyla, toplam güvenilir doğrulayıcıları azaltmak, çoğunluğa ulaşmak için gereken oy sayısını her zaman değiştirmeyebilir. Örneğin, toplamda 15 doğrulayıcı varsa, %80'i tam olarak 12 doğrulayıcıdır. Eğer toplam 14 doğrulayıcıya düşerse, %80'i 11.2 doğrulayıcı olur, bu da yine de çoğunluğa ulaşmak için 12 doğrulayıcı gerektirdiği anlamına gelir.
:::

Negatif UNL, önerilen işlem setinde hangi işlemlerin dahil edileceği gibi, konsensüs sürecinin diğer bölümleri üzerinde herhangi bir etkiye sahip değildir. Bu adımlar her zaman yapılandırılmış UNL'ye dayanır ve eşikler, konsensüs turuna etkin olarak katılan güvenilir doğrulayıcıların sayısına dayanmaktadır. Negatif UNL'de bulunan bir doğrulayıcı bile konsensüs sürecine katılabilir.

### Örnek

Aşağıdaki örnek, Negatif UNL'nin konsensüs sürecini nasıl etkilediğini gösterir:

1. Varsayalım ki sunucunuzun UNL'si 38 güvenilir doğrulayıcıdan oluşmaktadır, bu durumda %80'lik bir çoğunluk en az 31 güvenilir doğrulayıcıya eşittir.



2. Bu doğrulayıcıların 2'si, MissingA ve UnsteadyB, çevrimdışı gibi göründüğünü varsayın. (Her ikisi de %50'nin altında güvenilirlik puanlarına sahiptir.) _N_ defteri için konsensüs sürecinde, geri kalan birçok doğrulayıcı UnsteadyB'yi Negatif UNL'ye eklemeyi önerir. Teklif, geri kalan en az 31 doğrulayıcıdan oluşan bir çoğunlukla geçer ve _N_ defteri doğrulanır; UnsteadyB devre dışı bırakılacak şekilde planlanır.


3. _N+1_ ile _N+256_ arasındaki defterler için konsensüs süreci değişmeden devam eder.

4. Sonraki bayrak defterinde, _N+256_, UnsteadyB defterde "planlı" listesinden otomatik olarak "devre dışı" listesine geçer. Ayrıca, MissingA hala çevrimdışı olduğundan, doğrulayıcılar konsensus ile MissingA'nın bir sonraki bayrak defterinde devre dışı bırakılmasını planlar.


5. _N+257_ ile _N+512_ arasındaki defterler için çoğunluk artık 37 doğrulayıcıdan 30'dur.

6. UnsteadyB, _N+270_ defterinde yeniden çevrimiçi oluyor. _N+270_ ile _N+511_ arasındaki defterler için ağı geri kalanıyla anlaşan doğrulama oyları gönderiyor; böylece güvenilirlik puanı %80'in üzerine çıkıyor.


7. Bir sonraki baylak defterinde, _N+256_, MissingA planlı olarak devre dışı bırakılır. Bu arada, doğrulayıcılar, UnsteadyB'yi Negatif UNL'den çıkarmak için bir konsensus sağlarlar; bu, gelişmiş güvenilirlik puanı nedeniyle gerçekleşir.


8. _N+513_ ile _N+768_ arasındaki defterler için çoğunluk 36 doğrulayıcıdan 29'dur. UnsteadyB, MissingA çevrimdışı kalırken, doğrulamaları kararlı şekilde göndermeye devam eder.

9. Bayrak defterinde _N+768_, UnsteadyB planlandığı gibi devre dışı bırakma listesinden otomatik olarak çıkarılır.


10. Sonunda, MissingA'nın büyük ihtimalle geri dönmeyeceğine karar verip, sunucunuzun yapılandırılmış UNL'sinden çıkarıyorsunuz. Sunucunuz, o zamandan itibaren her bayrak defterinde MissingA'nın Negatif UNL'den çıkarılmasını önermeye başlar.


11. Doğrulayıcı operatörleri MissingA'yı yapılandırılmış UNL'lerinden çıkardıkça, onların doğrulayıcıları da MissingA'nın Negatif UNL'den çıkarılması için oy kullanır. Yeterli sayıda doğrulayıcı bunu yaptığında, MissingA'yı çıkarmak için yapılan teklif bir konsensus sağlar; böylece MissingA planlanır, ardından sonunda Negatif UNL'den çıkarılır.


---

## Ayrıca Bakın

- **Kavramlar:**
    - `Konsensüs Protokolü`
- **Kılavuzlar:**
    - `rippled`'inizi Paralel Bir Ağa Bağlayın`
    - `rippled`'i Doğrulayıcı Olarak Çalıştırın`
- **Referanslar:**
    - `NegatifUNL Nesnesi`
    - [UNLModify sahte işlemi][]
    - [ledger_entry yöntemi][]
    - [consensus_info yöntemi][]