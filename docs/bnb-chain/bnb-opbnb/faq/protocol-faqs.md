---
title: Protokol SSSS - opBNB SSSS
description: opBNB testnet, işlem katmanı ve türetim katmanı performansını artırarak yüksek işlem hızları ile düşük gaz ücretleri sunuyor. Bu belgedeki içerik, opBNB'nin özelliklerini ve avantajlarını detaylı bir şekilde açıklamaktadır.
keywords: [opBNB, testnet, işlem hızı, gaz ücreti, blokzincir oyunları, Optimism, Arbitrum]
---

### opBNB, yüksek performans ve uygun gaz ücretini nasıl sağlıyor?

opBNB testnet, [OP Stack manzarası](https://stack.optimism.io/docs/understand/landscape/?ref=binance.ghost.io#existing-landscape) içinde vurgulanan "İşlem Katmanı" ve "Türetim Katmanı"nın performansını artırır.

### opBNB'nin TPS'sini nasıl bekliyorsunuz?

opBNB'nin TPS'si hesaplamalara dayanarak yaklaşık **4,761** işlem/saniye olarak tahmin edilebilir. Bu, Ethereum'un mevcut TPS'sinden önemli ölçüde yüksektir ve daha sık günlük işlemlere olanak tanıyabilir.

### opBNB, web3 oyunlarına ne tür bir etki getirebilir?

:::tip
Performans, oyuncuların çok duyarlı bir deneyim beklemesi nedeniyle oyunlar için önemlidir.
:::

Herhangi bir gecikme, duraksama veya kesinti, oyundaki keyfi ve bütünlüğü zedeler. Blokzincir oyunları için hızlı işlem hızları ve verimlilik, kesintisiz bir kullanıcı deneyimi sağlamak için kritik öneme sahiptir. Oyuncular, oyundaki varlıkların ve para birimlerinin anında transfer edilmesini bekler; bu nedenle altındaki blokzincir ağının yüksek performanslı olması gerekir.

### opBNB ile diğer Optimism tabanlı katman 2 çözümleri, örneğin Base arasındaki fark nedir?

opBNB, BSC üzerinde ilk katman 2 optimistik rollup'tır ve BSC katman 1 maliyeti ETH'den çok daha düşük olduğundan, BSC üzerindeki katman 2'nin maliyeti uygulama geliştiricilerine daha uygun bir çözüm sunacaktır. **Başka bir fark** ise, opBNB'nin BSC'de kullanılmakta olan performans optimizasyon tekniklerini kapsayarak çok daha iyi bir performans sunmasıdır.

### Zaten zkBNB ölçeklenebilir bir çözüm olarak mevcut, neden opBNB'ye ihtiyaç var?

zkBNB EVM uyumlu değildir, bu da onu NFT ve token işlemleri için daha uygun hale getirir, genel dApp'ler için değil. opBNB'nin programlanabilirliği, **daha fazla esneklik** gerektiren uygulamaları desteklemek içindir.

### opBNB süper zincire mi bağlı yoksa alakalı değil mi? opBNB yalnızca BNB Akıllı Zinciri üzerindeki optimistik rollup'lar olarak mı değerlendirilebilir?

opBNB, yalnızca BSC üzerindeki rollup'lar olarak değerlendirilebilir; süper zincir değildir. Daha ayrıntılı bilgi için [bu](https://bnbchain.org/en/blog/opbnb-high-performance-and-low-cost-layer-2-based-on-optimism-op-stack/) blogu kontrol edin. Gelecekte opBNB'yi süper zincir veya L3'e genişletebiliriz.

### opBNB, OP Stack ve Arbitrum Orbit arasındaki farklar nelerdir? Bu farklı teknolojik yığınların artıları ve eksileri nelerdir?

opBNB, OP Stack ve Arbitrum Orbit arasındaki farklar hakkında daha fazla bilgi için [bu](https://bnbchain.org/en/blog/opbnb-high-performance-and-low-cost-layer-2-based-on-optimism-op-stack/) blogu kontrol edin.

### opBNB'yi implementasyonu için neden zkEVM yerine OP Stack kullanıldı?

OP Stack, titiz testler aracılığıyla doğrulanmış güvenilir ve sağlam bir çözümdür. OP Stack, modülerlik düşünülerek tasarlanmıştır ve kodun diğer kısımlarını etkilemeden birden fazla istemciyi ve farklı veri erişim katmanlarını desteklemesine olanak tanır. opBNB, maliyetleri düşürmek ve kullanıcı deneyimini geliştirmek için çeşitli yollar keşfetmek için OP Stack'i sağlam bir temel olarak kullanmaktadır.

### İşlemler nonce sırasının uygulanmasıyla mı yapılır?

Evet, opBNB'deki işlemler nonce sırasının uygulanmasıyla gerçekleşir.

### opBNB, önceden sürme ve diğer işlem ile ilgili saldırıları nasıl önlüyor?

:::warning
Önceden sürme ve diğer işlem ile ilgili saldırılar, birçok blokzincir sisteminin karşılaştığı zorluklardır.
:::

opBNB, bu saldırıları azaltmak için işlem sıralaması ve zaman damgalama gibi mekanizmalar kullanır. Agregatörler, işlemleri adil bir şekilde sıralamaları ve kendi işlemlerine öncelik vermemeleri için teşvik edilmektedir; böylelikle önceden sürme potansiyeli azalmaktadır.

### opBNB ağında kendi doğrulayıcım veya agregatör düğümümü çalıştırabilir miyim?

opBNB ağı şu anda bireysel kullanıcıların doğrulayıcı veya agregatör düğümleri çalıştırmasını desteklememektedir. Ancak, bu özelli üzerinde çalışıyoruz ve gelecekte yayınlamayı planlıyoruz. Lütfen en son güncellemeler için opBNB'yi takip etmeye devam edin.

### opBNB, optimistik rollup çerçevesi içinde yeniden giriş saldırılarını nasıl ele alıyor?

opBNB, yeniden giriş saldırılarını önlemek için sıkı işlem sıralaması ve dikkatli durum yönetimi gibi güvenlik önlemlerinin bir bileşimini kullanmaktadır. Kontrol edilen ve belirlenmiş bir yürütme sırasını zorunlu kılarak, yeniden giriş saldırıları azaltılmaktadır.

### opBNB ağı üzerindeki uzun vadeli saldırıları önlemek için mekanizma nedir?

opBNB, durumunu ana BNB zincirine yerleştiren bir kontrol mekanizması uygular. Bu, en son geçerli durumun on-chain'de korunmasını sağlayarak uzun vadeli saldırıları önlemeye yardımcı olur ve herhangi bir reorganizasyon girişimini imkansız kılar.

### opBNB, merkezi olmayan bir şekilde işlemlerin sıralamasını nasıl sağlıyor?

opBNB ekibi, ağ üzerindeki işlemlerin doğru sıralamasını sağlamak için sıralayıcıyı işletmekle sorumludur. Sıralayıcı, kullanıcılar için güvenilir ve verimli bir hizmet sunan merkezi bir bileşendir.

### opBNB, dolandırıcılık kanıtının kendisi kötü niyetli veya yanlış olduğunda ortaya çıkan anlaşmazlıkları nasıl ele alıyor?

opBNB, anlaşmazlıkları çözmek için bir meydan okuma mekanizması uygular. Eğer kötü niyetli bir dolandırıcılık kanıtı sunulursa, dürüst katılımcılar durumu düzeltmek için karşı-dolandırıcılık kanıtları sunabilir. Meydan okuma süresi, bu kanıtların değerlendirilmesi için zaman sağlar.

### opBNB'deki meydan okuma dönemi nedir?

Meydan okuma döneminde, blokzincirdeki herhangi bir katılımcı, L2 sıralayıcı tarafından sağlanan işlemlerin veya yürütme sonuçlarının geçerliliğine karşı meydan okumalar açabilir. Bu mekanizma, L2 yürütmesinin bütünlüğünü ve doğruluğunu sağlamak için kritik öneme sahiptir.

### Geçerlilik kanıtı ile dolandırıcılık kanıtı arasındaki fark nedir?

Geçerlilik kanıtı, doğrulamayı verimli bir şekilde gerçekleştirmek için etkilidir; doğrulayıcıların sadece "kanıtı" bir kez kontrol etmeleri ve doğruluğunu onaylamaları gerekir. Ancak, bunun dezavantajı, kanıtnın üretilmesinin hem algoritmik hem de verimlilik açısından zor olmasıdır. Popüler bir geçerlilik kanıtı çözümü sıfır bilgi kanıtıdır. Öte yandan, dolandırıcılık kanıtı yürütme açısından etkilidir çünkü yürütme zamanında herhangi bir kanıt üretmez; ancak L2 durumunun doğruluğunu sorgulamak için katılımcılar için belirli bir zaman penceresi oluşturulması gerekir; bu da L2 sonuçlarının nihaiğini büyük ölçüde etkiler.

### Meydan okuma döneminin süresi nedir?

opBNB testnetinde meydan okuma penceresi daha kısadır, bu nedenle geri çekilme sürecini daha hızlı test edebilirsiniz. opBNB'nin ana ağında, meydan okuma penceresi 7 gün uzunluğunda olacaktır.

### Dürüst olmayan sıralayıcılar için cezalar nelerdir?

Bir sıralayıcının dürüst olmadığı veya yanlış yürütme sonuçları sağladığı durumlarda, cezalar uygulanır. Sıralayıcının teminatı, cezalandırma biçimi olarak kesilebilir. Ayrıca, sorunlu işlemden itibaren durum kökleri silinecek ve doğruluğu sağlamak için yeniden hesaplanacaktır.

### Bir akıllı sözleşmenin opBNB üzerinde doğrulanıp doğrulanmadığını API GET isteği ile nasıl kontrol edebilirim?

[API anahtarı](https://nodereal.io/meganode) ve akıllı sözleşme adresi ile sözleşmenin doğrulama durumunu, kaynak kodunu ve ABI'sini alabilirsiniz.

- opBNB ana ağı için, https://open-platform.nodereal.io/{{yourAPIkey}}/op-bnb-mainnet/contract/?action=getsourcecode&address={{contract address}}.
- opBNB testnet için, https://open-platform.nodereal.io/{{yourAPIkey}}/op-bnb-testnet/contract/?action=getsourcecode&address={{contract address}}.

### opBNB'deki onaylı blok yüksekliğini nasıl alabilirim ve neden her zaman en son gelenlerden yüzlerce blok geride?

En son ile onaylı bloklar arasındaki 200'den fazla farkın olması beklenir. Bu, OP tasarımındaki bir kavramdır. En son, en son güvensiz blok olarak tanımlanır. Onaylı olan, L2 bloğunun L1'e kaydedildiği ve ilgili L1 bloğunun onaylandığı anlamına gelir (hızlı kesinlik veya doğal kesinlik ile).