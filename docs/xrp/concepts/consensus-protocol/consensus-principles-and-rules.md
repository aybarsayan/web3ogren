---
title: Konsensüs Prensipleri ve Kuralları
seoTitle: Konsensüs Kuralları ve XRP Ledger Mekanizması
sidebar_position: 1
description: Kullanıcıların, ulusal sınırları aşarak fon transferi yapmalarını sağlayan konsensüs algoritmasının kuralları ve prensipleri hakkında bilgi verir. XRP Ledgerın teknolojik özellikleri ve işleyiş mantığı detaylandırılır.
tags: 
  - XRP Ledger
  - konsensüs
  - çift harcama
  - dijital para
  - blockchain
keywords: 
  - XRP Ledger
  - konsensüs
  - çift harcama
  - dijital para
  - blockchain
---

# Konsensüs Prensipleri ve Kuralları

XRP Ledger, kullanıcıların ulusal sınırlar boyunca, bir e-posta göndermek kadar kesintisiz bir şekilde fon transferi yapmalarını sağlayan evrensel bir ödeme sistemidir. Bitcoin gibi diğer eşler arası ödeme ağlarının aksine, XRP Ledger, eşler arası işlem düzenlemesine olanak tanıyan merkeziyetsiz bir bilgisayar ağıdır. Diğer dijital para protokollerinin aksine, XRP Ledger, kullanıcıların işlemlerini istedikleri herhangi bir para birimi cinsinden ifade etmelerine olanak tanır; bu, fiat para birimleri, dijital para birimleri, diğer değer biçimleri ve XRP (XRP Ledger'ın yerel varlığı) dahil.

:::info
XRP Ledger teknolojisi, neredeyse gerçek zamanlı düzenleme (üç ila altı saniye) sağlar ve ödemelerin otomatik olarak en ucuz para birimi ticaret emirlerini kullanacağı merkeziyetsiz bir borsa içerir.
:::

## Arka Plan

### Mekanikler

XRP Ledger'ın temelinde, hesaplar, bakiyeler ve varlık ticareti teklifleri gibi bilgileri kaydeden paylaşımlı bir veritabanı bulunmaktadır. "İşlemler" adı verilen imzalı talimatlar, hesaplar oluşturma, ödemeler yapma ve varlık ticareti gibi değişikliklere neden olur.

> "Her sunucu, her işlemi belirli, bilinen kurallara göre işler." — XRP Ledger

Bir kriptografik sistem olarak, XRP Ledger hesaplarının sahipleri, kamu/özel anahtar çiftlerine karşılık gelen _kriptografik kimlikler_ ile tanımlanır. İşlemler, bu kimliklerle eşleşen kriptografik imzalarla yetkilendirilir. Nihai hedef, ağdaki her sunucunun tam olarak aynı genel defter durumunun bir kopyasına sahip olmasıdır; bu, tek bir merkezi otoriteye ihtiyaç duymadan gerçekleşir.

### Çift Harcama Problemi

"Çift harcama" problemi, herhangi bir dijital ödeme sistemine yönelik temel bir zorluktur. Problem, paranın bir yerde harcandığında, başka bir yerde de harcanamaması gereğinden kaynaklanır. Daha genel olarak, problem, iki işlemin olduğu durumlarla ilgilidir; burada ya biri geçerlidir ama birlikte değil.

Diyelim ki Alice, Bob ve Charlie bir ödeme sistemi kullanıyor ve Alice’in bakiyesi 10 dolardır. Ödeme sisteminin işe yaraması için, Alice'in 10 doları Bob'a ya da Charlie'ye gönderebiliyor olması gerekir. Ancak, Alice hem Bob'a hem de Charlie'ye aynı anda 10 dolar göndermeye çalışırsa, çift harcama problemi ortaya çıkar.

:::warning
Eğer Alice "aynı" 10 doları hem Charlie'ye hem de Bob'a gönderebiliyorsa, ödeme sistemi işe yaramaz hale gelir.
:::

Geleneksel olarak, ödeme sistemleri çift harcama problemini merkezi bir otoritenin işlemleri izlemesi ve onaylaması yoluyla çözer. Örneğin, bir banka, bir çekin temizlenmesi gerektiğine karar verirken, bankanın tek bakımcısı olduğu verici bakiyesine dayanır. Böyle bir sistemde, tüm katılımcılar merkezi otoritenin kararlarını takip eder.

XRP Ledger gibi dağıtık defter teknolojilerine merkezi bir otoriteye ihtiyaç yoktur. Çift harcama problemini başka bir şekilde çözmeleri gerekir.

## Konsensüs Nasıl Çalışır

### Problemi Basitleştirerek

Çift harcama probleminin çoğu, bir hesabın sahip olmadığı fonları harcamasını yasaklayan gibi bilinen kurallar kullanılarak çözülebilir. Aslında, çift harcama problemi işlemleri sıraya koymaya indirgenebilir.

Alice'in 10 doları hem Bob'a hem de Charlie'ye göndermeye çalıştığı örneği düşünelim. Eğer Bob'a yapılan ödeme ilk olarak biliniyorsa, herkes Alice'in Bob'u ödemek için yeterli fonunun olduğunu kabul edebilir. Eğer Charlie'ye yapılan ödeme ikinci olarak biliniyorsa, herkes Alice'in bu fonları Charlie'ye gönderemeyeceğini kabul eder çünkü para zaten Bob'a gönderilmiştir.

Ayrıca, işlemleri belirleyici kurallar ile sıralayabiliriz. İşlemler dijital bilgi toplulukları olduğundan, bir bilgisayarın bunları sıraya koyması çok kolaydır.

Bu, merkezi bir otorite olmadan çift harcama problemini çözmek için yeterli olabilirdi, ancak herhangi bir işlem sonucunu kesin olarak bilebilmek için her işlemi önceden toplamamız gerekecekti. Açıkça, bu pratik değildir. 

Eğer işlemleri gruplar hâlinde toplayabilir ve bu gruplar üzerinde uzlaşabilirsek, o grup içindeki işlemleri sıralayabiliriz. Her katılımcı, hangi işlemlerin bir birim olarak işlenmesi gerektiği konusunda uzlaşırsa, belirleyici kuralları kullanarak çift harcama problemini merkezi bir otoriteye ihtiyaç duymadan çözebilirler. Katılımcılar, her biri işlemleri sıralar ve bilinen kurallar doğrultusunda belirleyici bir şekilde uygular. XRP Ledger, çift harcama problemini tam olarak bu şekilde çözer.

XRP Ledger, çelişkili birden fazla işlemin uzlaşılan grupta yer almasına izin verir. İşlemler, belirleyici kurallara göre yürütülür; böylece sıralama kurallarına göre ilk gelen işlem başarılı olur ve çelişkili işlem ikinci gelirse başarısız olur.

### Konsensüs Kuralları

Konsensüsün ana rolü, süreçteki katılımcıların hangi işlemlerin bir grup olarak işlenmesi gerektiği konusunda uzlaşmalarıdır; çift harcama problemini çözmek için. Bu uzlaşının sağlanması neden beklenenden daha kolaydır:

1. Eğer bir işlemin böyle bir işlem grubuna dahil edilmemesi için hiçbir sebep yoksa, tüm dürüst katılımcılar bunu dahil etmeyi kabul eder. Eğer tüm katılımcılar zaten uzlaşırsa, konsensüsün yapacak bir işi yoktur.
2. Eğer bir işlemin böyle bir grup içine dahil edilmemesi için herhangi bir sebep varsa, tüm dürüst katılımcılar bunu hariç tutmaya istekli olacaktır. Eğer işlem hâlâ geçerliyse, onu bir sonraki tura dahil etmek için hiçbir sebep yoktur ve bu durumda hepsi dahil edilmesi konusunda uzlaşmalıdır.
3. İşlemlerin nasıl gruplanmasıyla ilgili durumu, katılımcılar arasında son derece nadirdir. Uzlaşma sağlanması en kolay olan durum, herkesin önceliği uzlaşıyken, sadece farklı çıkarların olduğu durumlarda zorluk çıkmasıdır.
4. Belirleyici kurallar, grupların oluşmasında kullanılabilir, böylece sadece uç durumlarda anlaşmazlık meydana gelir. Örneğin, bir turda iki çelişkili işlem varsa, hangisinin bir sonraki tura dahil edileceğini belirlemek için belirleyici kurallar kullanılabilir.

Her katılımcının öncelikli hedefi doğruluktur. Öncelikle paylaşılan defterin bütünlüğünü ihlal etmeyecek şekilde kuralları uygulamak zorundadırlar. Örneğin, düzgün imzalanmamış bir işlem asla işlenmemelidir (diğer katılımcılar bunun işlenmesini istese bile). Ancak, her dürüst katılımcının ikinci önceliği uzlaşıdır. Potansiyel çift harcamalarla bir ağın hiçbir yararı yoktur; dolayısıyla her dürüst katılımcı, doğru olan her şeyden daha çok uzlaşı sağlayabilmeyi değerlendirir.

### Konsensüs Turları

Bir konsensüs turu, işlenebilecek bir işlem grubunda uzlaşma sağlama çabasıdır. Konsensüs turu, bunu yapmak isteyen her katılımcının başlangıç pozisyonunu almasıyla başlar. Bu, gördükleri geçerli işlemler setidir.

Katılımcılar daha sonra konsensüse “çığ” olarak geçer: Eğer belirli bir işlem çoğunluk desteği almazsa, katılımcılar o işlemi ertelemeyi kabul ederler. Eğer belirli bir işlem çoğunluk desteğini alıyorsa, katılımcılar o işlemi dahil etmeyi kabul ederler. Böylece hafif çoğunluklar hızla tam destek haline gelir ve hafif azınlıklar da hızla mevcut turdan evrensel bir red haline gelir.

:::tip
Konsensüsün %50 civarında tıkanmasını önlemek ve güvenilir bir yakınsama için gereken örtüşmeyi azaltmak üzere, bir işlem için gereken eşik zamanla artar.
:::

Başlangıçta, katılımcılar, diğer katılımcıların %50 veya daha fazlası ona katılıyor ise bir işlemi dahil etmeyi kabul etmeye devam eder. Eğer katılımcılar arasında bir anlaşmazlık varsa, bu eşiği artırırlar, önce %60'a ardından daha da yükseğe, tüm tartışmalı işlemler mevcut setten çıkarılana kadar. Bu şekilde kaldırılan işlemler, bir sonraki defter versiyonuna ertelenir.

Bir katılımcı, işlem setinin işlenmesi için uzlaşacak bir süper çoğunluk gördüğünde, konsensüsün sağlandığını ilan eder.

### Konsensüs Başarısız Olabilir

Asla mükemmel bir konsensüs sağlamak için tasarlanmış bir konsensüs algoritması geliştirmek pratik değildir. Bunun nedenini anlamak için, konsensüs sürecinin bir noktada sona ermesi gerektiğini düşünelim. Her katılımcı, bir konsensüsün sağlandığını ve belirli bir işlem setinin sürecin sonucu olarak bilindiğini ilan etmelidir. Bu ilan, o katılımcıyı konsensüs sürecinin sonucu olarak belirli bir işlem setine geri alınamaz bir şekilde bağlar.

Bir katılımcının bunu ilk önce yapması gerekmektedir; yoksa başka katılımcılar bunu asla yapamaz ve konsensüs sağlanamaz. Şimdi, bunu ilk yapan katılımcıyı düşünelim. Bu katılımcı konsensüsün sona erdiğine karar verdiğinde, diğer katılımcılar henüz o kararı vermemiştir. Eğer onlar, kendi bakış açılarına göre uzlaşılan seti değiştiremediyse, o zaten konsensüsün sona erdiğine karar vermiş olmalıydı. Yani, hala uzlaşılan setlerini değiştirebilir durumdadırlar.

:::danger
Konsensüs sürecinin asla sona ermesi için, bir katılımcının işlemler kümesi üzerine uzlaşmanın sağlandığını ilan etmesi gerekmektedir; oysa diğer her katılımcı teoride hâlâ belirlenen işlem setini değiştirme kapasitesine sahiptir.
:::

Bir grup insanın bir odada hangi kapıdan çıkacakları konusunda uzlaşmaya çalıştığını hayal edin. Katılımcılar ne kadar tartışırlarsa tartışsınlar, bir noktada, _birinin_ ilk kapıdan çıkması gerekecektir; oysa arkasındaki insanlar hâlâ fikirlerini değiştirebilir ve diğer kapıdan çıkabilirler.

Bu tür bir başarısızlık olasılığı çok düşük seviyelere indirilebilir, ancak sıfıra indirilmesi mümkün değildir. Mühendislik uzlaşmaları nedeniyle, bu olasılığı bin de birin altına düşürmek, konsensüsü önemli ölçüde yavaşlatır ve ağda ve uç noktada daha az toleranslı hale getirir.

### XRP Ledger Konsensüs Başarısızlığını Nasıl Yönetir

Bir konsensüs turu tamamlandığında, her katılımcı, mutabık olduklarına inandıkları işlem setini uygular. Bu, defterin bir sonraki durumunun nasıl olması gerektiğini inşa etmelerini sağlar.

Ayrıca doğrulayıcı olan katılımcılar, bu bir sonraki defterin kriptografik bir parmak izini yayınlar. Bu parmak izine “doğrulama oyu” denir. Eğer konsensüs turu başarılı olduysa, dürüst doğrulayıcıların büyük çoğunluğu aynı parmak izini yayınlamalıdır.

Katılımcılar daha sonra bu doğrulama oylarını toplar. Doğrulama oyları aracılığıyla, önceki konsensüs turunun süper çoğunluk katılımcısının işlemler setine katıldığını belirleyebilirler.

Katılımcılar, olasılık sırasına göre üç durumdan birine girerler:

1. Süper çoğunluğun kabul ettiği aynı defteri oluşturmuşlardır. Bu durumda, o defteri tamamen doğrulanmış kabul edebilir ve içeriğine güvenebilirler.
2. Süper çoğunluğun kabul ettiği bir defterden farklı bir defter inşa etmişlerdir. Bu durumda, süper çoğunluk defterini oluşturmalı ve kabul etmelidirler. Bu genellikle onların erken bir konsensüs ilan ettiklerini ve birçok katılımcının daha sonra değiştiğini gösterir. Operasyona devam etmek için, süper çoğunluk defterine "geçmeleri" gerekir.
3. Alınan doğrulamadan süper çoğunluk açıkça belli değildir. Bu durumda, önceki konsensüs turu boşa gitmiştir ve herhangi bir defterin doğrulanabilmesi için yeni bir tur olması gerekmektedir.

Elbette, durum 1 en yaygın olanıdır. Durum 2, ağ için hiçbir zarara neden olmaz. Küçük bir katılımcı yüzdesi her turda durum 2'ye düşebilir ve ağ hiçbir sorun yaşamadan çalışır. Hatta bu katılımcılar, süper çoğunlukla aynı defteri inşa etmediklerini kabul edebilirler; bu nedenle, süper çoğunluk ile uzlaştıkları zamana kadar sonuçlarını nihai olarak rapor etmemeleri gerektiğini bilirler.

:::note
Durum 3, ağın birkaç saniye boyunca ileriye doğru ilerleme kaydedememesi anlamına gelir; bu oldukça nadirdir.
:::

Bu durumda, bir sonraki konsensüs turunun başarısız olma olasılığı çok daha düşüktür çünkü anlaşmazlıklar konsensüs sürecinde çözülür; sadece kalan anlaşmazlıklar bir başarısızlığa neden olabilir.

Nadir durumlarda, ağın tamamı birkaç saniye boyunca ileriye doğru ilerleyemez. Karşılığında, ortalama işlem onay süreleri düşüktür.

## Felsefe

Bir sistemin, bazı bileşenlerin başarısız olduğu, bazı katılımcıların kötü niyetli olduğu vb. koşullar altında bile sonuçlar sağlayabilme yeteneği bir güvenilirlik türüdür. Bu önemli olsa da, kriptografik ödeme sistemlerinde çok daha önemli olan başka bir güvenilirlik biçimi vardır — bir sistemin, güvenilir olarak rapor edilen sonuçlar sunabilme yeteneği. Yani, bir sistem bize güvenilir bir sonucu rapor ettiğinde, o sonuca güvenebilmeliyiz.

Ancak gerçek dünya sistemleri, her iki güvenilirlik türünün de tehlikeye girebileceği operasyonel koşullar ile karşı karşıya kalır. Bunlar arasında donanım arızaları, iletişim arızaları ve hatta kötü niyetli katılımcılar bulunur. XRP Ledger'ın tasarım felsefesinin bir parçası, sonuçların güvenilirliklerinin zayıfladığı koşulları tespit etmek ve bildirmektir; bunun yerine güvenilemeyecek sonuçlar sunmak yerine.

XRP Ledger'ın konsensüs algoritması, gereksiz yere hesaplama kaynakları tüketmeden iş kanıtı sistemlerine sağlam bir alternatif sunar. Bizans arızaları mümkündür ve gerçekleşir, ancak sonuçları yalnızca küçük gecikmelerdir. Tüm durumlarda, XRP Ledger'ın konsensüs algoritması, gerçekten güvenilir olduklarında sonuçları güvenilir olarak rapor eder.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Konsensüs`
    - `Konsensüs Araştırması`
    - [XRPL Konsensüs Mekanizması Videosu](https://www.youtube.com/watch?v=k6VqEkqRTmk&list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi&index=2)
- **Eğitimler:**
    - `Güvenilir İşlem Gönderimi`
    - `Doğrulayıcı Olarak `rippled` Çalıştırma`
- **Referanslar:**
    - `Defter Formatı Referansı`
    - `İşlem Formatı Referansı`
    - [consensus_info yöntemi][]
    - [validator_list_sites yöntemi][]
    - [validators yöntemi][]
    - [consensus_info yöntemi][]

