---
title: Merkeziyetsiz Borsa
seoTitle: XRP Ledger Merkeziyetsiz Borsa
sidebar_position: 1
description: XRP Ledger, kullanıcıların XRP veya birbirleriyle token ticareti yapabileceği tam işlevsel bir borsa içerir. Bu makalede, merkeziyetsiz borsa, ticaret işleyişi ve dikkat edilmesi gereken önemli noktalar ele alınmaktadır.
tags: 
  - XRP Ledger
  - merkeziyetsiz borsa
  - DEX
  - token ticareti
  - piyasa emirleri
  - işlem özellikleri
  - yüksek frekanslı ticaret
keywords: 
  - XRP Ledger
  - merkeziyetsiz borsa
  - DEX
  - token ticareti
  - piyasa emirleri
  - işlem özellikleri
  - yüksek frekanslı ticaret
---

## Merkeziyetsiz Borsa

XRP Ledger, muhtemelen dünyanın en eski _merkeziyetsiz borsasıdır_ (bazen "DEX" olarak kısaltılır), 2012'de XRP Ledger'ın lansmanından bu yana sürekli olarak faaliyet göstermektedir. Borsa, kullanıcıların `tokenleri` XRP veya diğer tokenler karşılığında alıp satmalarına olanak tanır; bu işlemde yalnızca ağa `ücretler` tahsil edilir (bu ücretler herhangi bir tarafa ödenmez).

:::warning Herkes herhangi bir para birimi kodu veya ticker sembolü ile bir `token çıkarabilir` ve bunu merkeziyetsiz borsada satabilir. Bir token satın almadan önce daima gerekli araştırmayı yapın ve ihraç edene dikkat edin. Aksi takdirde, değerli bir şeyinizi kaybedebilir ve karşılığında değersiz tokenler alabilirsiniz.:::

---

## Yapı

XRP Ledger'ın merkeziyetsiz borsası, kullanıcılar işlem yaptığında talep üzerine takip edilen sınırsız sayıda döviz çiftinden oluşur. Bir döviz çifti, XRP ve bir token veya iki farklı token içerebilir; tokenler her zaman bir ihraççı ve para birimi kodunun kombinasyonu ile tanımlanır. İki token arasında aynı para birimi koduna ve farklı ihraççılara sahip veya aynı ihraççıya ve farklı para birimi kodlarına sahip ticaret yapmak mümkündür.

XRP Ledger'daki tüm değişikliklerde olduğu gibi, bir ticaret yapmak için bir `işlem` göndermeniz gerekir. XRP Ledger'daki bir ticaret `Teklif` olarak adlandırılır. Teklif, belirli bir miktar bir para birimini (XRP veya bir token) başka bir para birimi için alım veya satım yapmak amacıyla bir [_limit emri_](https://en.wikipedia.org/wiki/Order_(exchange)#Limit_order) gibidir.

> Ağ bir Teklif gerçekleştirdiğinde, eğer aynı döviz çifti için herhangi bir eşleşen Teklif varsa, bunlar en iyi döviz kuru ile başlayarak tüketilir.  
> — XRP Ledger Ticaret İşleyişi

Bir Teklif tamamen veya kısmen doldurulabilir; eğer hemen tamamen doldurulmazsa, kalan miktar için defterde pasif bir Teklif nesnesi haline gelir. Daha sonra, diğer Teklifler veya `Çapraz para birimi ödemeleri` Teklifi eşleştirebilir ve tüketebilir. Bu nedenle, Teklifler, başlangıçta yerleştirildiğinde talep edilen döviz kurundan daha iyi bir şekilde veya daha sonra tam olarak belirtilen döviz kurunda (küçük yuvarlama farkları haricinde) gerçekleştirilebilir.

Teklifler, yerleştirildikten sonra manuel veya otomatik olarak iptal edilebilir. Tekliflerin bu ve diğer özellikleri hakkında daha fazla bilgi için `Teklifler` sayfasına bakın.

İki token ticareti yaparken, `otomatik köprüleme` işlem sırasında token-xrp ve xrp-token ticareti yaparak döviz kurlarını ve likiditeyi iyileştirir, bunun daha ucuz olduğu durumlarda token-tokens ticaretine göre.

---

### Örnek Ticaret


Yukarıdaki diagram, merkeziyetsiz borsada bir örnek ticareti göstermektedir. Bu örnekte, Tran adında bir tüccar, hayali bir işletme olan WayGate tarafından çıkarılan FOO para birimi koduna sahip 100 token almak için bir Teklif verir. (Kısalık açısından, "FOO.WayGate" bu tokenleri anlatır.) Tran, toplamda 1000 XRP harcamaya istekli olduğunu belirtir. Tran'ın işlemi işlendiğinde, aşağıdaki olaylar gerçekleşir:

1. Ağ, Tran'ın Teklifinin döviz kurunu, satın alma miktarını ödeme miktarına bölerek hesaplar.
2. Ağ, Tran'ın Teklifinin tersine dair emir defterini bulur: bu durumda, FOO.WayGate satma ve XRP alma emir defteri demektir. Bu emir defteri zaten diğer tüccarların çeşitli miktar ve döviz kurları için mevcut Teklifleri içermektedir.
3. Tran'ın Teklifi, en iyi döviz kurundan başlayarak eşleşen Teklifleri "tüketir", ya Tran'ın Teklifi tamamen doldurulmuş olur ya da Tran'ın Teklifindeki belirtilen döviz kuru ile eşit veya daha iyi olan başka Teklif kalmamıştır. Bu örnekte yalnızca talep edilen kurda veya daha iyi durumda 22 FOO.WayGate mevcuttur. Tüketilen Teklifler emir defterinden kaldırılır.
4. Tran, ticaretin alabilmeyi başardığı kadar FOO.WayGate miktarını, onları satmak için önceki emirler vermiş tüccarlardan alır. Bu tokenler, Tran'ın FOO için WayGate'a `güven hattı` cüzdanına gider. (Eğer Tran önceden bu güven hattına sahip değilse, otomatik olarak oluşturulur.)
5. Bu karşılığında, o tüccarlar Tran'dan belirtilen döviz kurlarına göre XRP alırlar.
6. Ağ, Tran'ın Teklifinin geri kalanını hesaplar: çünkü başlangıçtaki Teklif, 100 FOO.WayGate almak için verilmiştir ve şimdi Tran 22 almıştır, geri kalan miktar 78 FOO.WayGate'dır. Bu, orijinal döviz kuru kullanılarak, Tran'ın Teklifinin geri kalanı artık 780 XRP karşılığında 78 FOO.WayGate almak için olacaktır.
7. Ortaya çıkan "geri kalan" miktar, Tran'ın işlem yaptığı yönle aynı yönde olan emir defterine konur: XRP satmak ve FOO.WayGate almak.

Daha sonraki işlemler, Tran'ın işlemi ile _aynı_ defterde hemen sonra gerçekleştirilenler dahil, güncellenmiş emir defterlerini ticaretlerinde kullanır, böylelikle Tran'ın Teklifinin tamamen doldurulana veya Tran bunu iptal edene kadar kısmen veya tamamen tüketebilirler.

:::info Bir defter kapandığında ve doğrulandığında işlemlerin yürütülme sırası, o işlemlerin gönderildiği sıralamayla aynı değildir. Birden fazla işlem aynı defterdeki aynı emir defterini etkiliyorsa, bu işlemlerin sonundaki sonuçlar, işlem gönderimi sırasında hesaplanan ön sonuçlardan çok farklı olabilir. İşlemlerin sonuçlarının nihai olup olmadığını öğrenmek için `Sonuçların Nihayeti` sayfasına bakın.:::

---

## Sınırlamalar

Merkeziyetsiz borsa, aşağıdaki sınırlamalarla tasarlanmıştır:

- Ticaretler yalnızca yeni bir defter kapandığında (yaklaşık her 3-5 saniyede bir) yürütüldüğü için, XRP Ledger [yüksek frekanslı ticaret](https://en.wikipedia.org/wiki/High-frequency_trading) için uygun değildir. Bir defter içinde işlemlerin yürütülme sırası, [önceden bilgilendirme](https://en.wikipedia.org/wiki/Front_running) işlemlerini caydırmak için tahmin edilemez olacak şekilde tasarlanmıştır.

- XRP Ledger, yerel olarak piyasa emirleri, durdurma emirleri veya kaldıraçla ticaret gibi kavramları temsil etmez. Bu kavramlardan bazıları özel tokenlerin ve Teklif özelliklerinin yaratıcı kullanımıyla mümkün olabilir.

- Merkeziyetsiz bir sistem olarak XRP Ledger, ticaretle ilgili olan `hesaplar` arkasındaki gerçek insanlar ve kuruluşlar hakkında herhangi bir bilgiye sahip değildir. Defter, kimin ticarete katılabileceği veya katılamayacağına dair kısıtlamalar getiremiyor ve kullanıcılar ile ihraççılar, çeşitli temel varlıkları temsil eden tokenlerin ticaretini düzenleyen ilgili yasalara uymalıdır. `dondurmalar` ve `yetkilendirilmiş güven hattı` gibi özellikler, ihraççıların ilgili yasalar ve düzenlemelere uymalarına yardımcı olmak için tasarlanmıştır.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - XRP Ledger'daki ticaretlerin nasıl işlediğine dair ayrıntılar için `Teklifler` sayfasına bakın.
    - XRP Ledger'da çeşitli değer türlerinin nasıl temsil edilebileceğine dair genel bir bakış için `Tokenler` sayfasına bakın.
- **Referanslar:**
    - [account_offers method][] hesap tarafından verilen Teklifleri bulmak için
    - [book_offers method][] belirli bir döviz çifti için alım veya satım Tekliflerini bulmak için
    - [OfferCreate transaction][] yeni bir Teklif vermek veya mevcut bir Teklifi değiştirmek için
    - [OfferCancel transaction][] mevcut bir Teklifi iptal etmek için
    - [Offer object][] defterdeki pasif Tekliflerin veri yapısı için
    - [DirectoryNode object][] belirli bir döviz çifti ve döviz kuru için tüm Teklifleri takip eden veri yapısı için.



