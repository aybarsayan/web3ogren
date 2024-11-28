---
title: opBNB Köprüsü - opBNB SSS
description: opBNB, BNB ekosistemine ölçeklendirme ve kullanıcı dostu deneyimler sunmayı amaçlayan bir projedir. Bu belgede, opBNB'nin Superchain ile entegrasyonu, işlem maliyetleri ve çekim talepleri gibi konular ele alınmaktadır.
keywords: [opBNB, Superchain, Ethereum, BNB, L2, işlem maliyetleri, çekim talebi]
---

### opBNB ve Optimism'in Superchain'i arasındaki entegrasyonun durumu nedir?

opBNB, L2 ölçeklendirme ve kullanıcı dostu UX'in BNB ekosistemine getirilmesini hedefleyen bir projedir. Bu, **BNB L2 üzerinde hızlı** ve **ucuz işlemleri** mümkün kılacak ve uygulamalar inşa etmek ve çalıştırmak için merkeziyetsiz bir platform olan Greenfield ile sorunsuz bir birlikte çalışabilirlik sağlayacaktır. Superchain, Ethereum için L2/L3 ölçeklendirme ve güvenlik sağlamak üzere OP Stack'i kullanan yenilikçi bir çözümdür. Kullanıcıların tek bir cüzdan ile çeşitli L2 protokollerine erişim sağlamasına ve düşük ücretler ile yüksek verimlilikten yararlanmasına olanak tanır. opBNB, Superchain ile işbirliği yapmayı ve OP Stack'i BNB Zinciri'ne entegre etmeyi istemektedir.

### opBNB köprü sayfası ile cüzdanım arasındaki tahmini çekim/depozito işlemleri maliyetindeki farkın nedeni nedir?

opBNB'den varlık yatırmak veya çekmek için köprüyü kullandığınızda, köprü işleminiz için gaz maliyetini tahmin edecektir. Bu, işlemin blockchain'de yürütülmesinin simüle edilmesiyle yapılır, işlemi göndermeden veya ağın durumunu değiştirmeden. Simülasyon, işlemin mevcut ağ durumunda yürütülmesi durumunda ne kadar gaz birimi kullanacağını belirten bir sayı döndürür.

:::tip
Bu süreci anlamak, işlem maliyetlerinizi tahmin etmenize yardımcı olabilir.
:::

Bu sayıyı elde etmek için köprü, alt ve üst gaz birimleri arasında ikili arama algoritması uygulayan `estimateGas` adında bir fonksiyon kullanır. Alt kenar genellikle **21,000**'dir, bu da basit bir ether transferi için gereken minimum gazdır. Üst kenar ya kullanıcı tarafından belirtilir ya da bekleyen bloğun blok gaz limiti dikkate alınarak elde edilir. Fonksiyon, en küçük gaz değerini belirleyene kadar bu aralıkta farklı gaz değerleri ile işlemi gerçekleştirmeye çalışır ve dışarıda gaz istisnasına neden olmayan en küçük gaz değerini bulur. Bu, işlemin tahmini gaz kullanımını belirtir.

> Örneğin:  
> Bu örnekte, köprünün gaz tahmini yaklaşık **0.0008 BNB**'dir, bu da yaklaşık **$0.17**'dir.  
> — opBNB Dokümantasyonu

![](../../images/bnb-chain/bnb-opbnb/img/bridge-estimate.png){: style="width:400px"}

Ancak, köprü ile etkileşime geçmek için kullandığınız cüzdan, tahmini işlem maliyetini hesaplamak için farklı bir yöntem kullanabilir. Bu, işleminiz için harcamaya istekli olduğunuz maksimum gaz miktarı olan gaz limiti ile hesaplanabilir. Bu genellikle köprü tarafından verilen tahminden daha yüksektir.

> Örneğin:  
> Cüzdanın işlem tahmini yaklaşık **0.002 BNB**'dir, bu da yaklaşık **$0.47**'dir.  
> — opBNB Dokümantasyonu

![](../../images/bnb-chain/bnb-opbnb/img/faqs/wallet-estimate.png){: style="width:400px"}

İşlem zincir üzerinde gerçekleştirildiğinde, opBNB gezgini üzerinde işlemin gerçek maliyetini görebilirsiniz, bu genellikle köprü tarafından verilen tahmine benzer.

---

### Çekim talebinden sonra 7 gün içerisinde BSC'deki token'larım neden alınmıyor?

İşlem geçmişindeki kanıtı imzalamayı unutmuş olabilirsiniz. Bu, 7 günlük meydan okuma penceresini başlatmak için gerekli bir adımdır. Kanıtın imzalanmaması durumunda, köprü meydan okuma penceresi ile devam etmeyecek ve çekiminiz ertelenecektir.

![](../../images/bnb-chain/bnb-opbnb/img/withdraw-confirm.png){: style="width:400px"}

### 7 günlük meydan okuma penceresini başlatmak için neden kanıtı imzalamaya ihtiyacım var?

opBNB'den BSC'ye token çektiğinizde, L2'deki işleminizin geçerli ve L2'nin dünya durumu ile tutarlı olduğunu doğrulamak için bir çekim kanıtı sağlamanız gerekir. Bu, L1'in L2'nin tam dünya durumuna erişimi olmadığı için gereklidir; yalnızca veri erişilebilirliği (DA) verisi ve L2'den dünya durumunun periyodik anlık görüntülerine sahiptir. DA verisi, işlemlerin L2 üzerindeki sıkıştırılmış bir temsilidir ve gerektiğinde L2'nin dünya durumunu yeniden oluşturmak için kullanılabilir. Ancak, bu süreç pahalı ve zaman alıcıdır, bu yüzden her çekim için yapılmaz. Bunun yerine, L2 üzerindeki işleminizin belirli bir zaman dilimindeki dünya durumu ile eşleştiğini gösteren bir kriptografik kanıt olan bir çekim kanıtı sunmanız gerekir. Bu şekilde, çekiminizin güvenli ve doğru olmasını sağlayabilirsiniz ve hiç kimse L2 üzerinde hile yapamaz veya çift harcama yapamaz.

:::info
L2 üzerindeki işlemlerinizin güvenliği için her zaman bu adımları takip etmeniz önemlidir.
:::