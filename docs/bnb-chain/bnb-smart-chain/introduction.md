---
title: Giriş - BSC Geliştir
description: BNB Akıllı Zincir (BSC), programlanabilirlik ve birlikte çalışabilirlik sunan yenilikçi bir blok zinciri platformudur. PoSA konsensüs sistemi ile güvenli ve istikrarlı bir çözüm sağlar. Bu yapı, etkin madencilik ve topluluk katılımını teşvik eder.
keywords: [BNB, BSC, blok zinciri, PoSA, akıllı sözleşme, staking, EVM uyumlu]
---

# Giriş

BNB Akıllı Zincir, BNB Beacon Chain'e programlanabilirlik ve birlikte çalışabilirlik getirmek için yenilikçi bir çözümdür. BNB Akıllı Zincir, kısa blok süresi ve daha düşük ücretleri destekleyebilen İkincil Yetki Kanıtı (PoSA) konsensüsüne sahip 55 doğrulayıcıdan oluşan bir sisteme dayanır. Staking'in en çok bağlı olan doğrulayıcı adayları, doğrulayıcı haline gelecek ve blok üretecektir. 

:::note
İki kez imza tespiti, kötü niyetli oy tespiti ve diğer cezalandırma mantığı güvenlik, istikrar ve zincir kesinliğini garanti eder. 
:::

32 aktif doğrulayıcının yanı sıra, BSC yedekler olarak "Adaylar" olarak adlandırılacak 23 pasif doğrulayıcı da dahil olmak üzere daha fazla doğrulayıcı tanıtacaktır. 

Adaylar, BSC ana ağında blok üretecek ve gaz ücretleri alacak, ancak seçilmiş 32 resmi doğrulayıcı grubuna göre çok daha az bir şansa sahip olacaklardır. Kullanılamayan adaylar da daha küçük bir boyutta cezalandırılacaktır. Aday doğrulayıcıların kaliteden emin olmaya ve BSC'yi güvence altına almaya istekli olmalarını sağlamak için makul bir motivasyon sağlanması beklenmektedir. 

Aşırı bir durumda, eğer aktif olan 32 doğrulayıcının çoğunluğu saldırıya uğrayıp çevrimdışı olursa, Aday Doğrulayıcılar, BNB Beacon Chain'e duraklayan bloklar hakkında bildirimde bulunabilir, işlemi devam ettirebilir ve nihayetinde aktif doğrulayıcı setinin yeniden seçim önerisini sunabilirler.

---

BNB Akıllı Zincir, EVM uyumlu akıllı sözleşmeleri ve protokolleri de desteklemektedir. Yerel birlikte çalışabilirlik desteği sayesinde çapraz zincir transferi ve diğer iletişim mümkündür. BNB Akıllı Zincir:

* **Kendine egemen bir blok zinciri**: Seçilmiş doğrulayıcılarla güvenlik ve emniyet sağlar.
* **EVM uyumlu**: Daha hızlı kesinlik ve daha ucuz işlem ücretleri ile mevcut Ethereum araçlarını destekler.
* **Hızlı Kesinlik**: Çoğu durumda zinciri iki blok içinde kesinleştirir.
* **Birlikte çalışabilir**: Verimli yerel çift zincir iletişimi ile gelir; hızlı ve sorunsuz bir kullanıcı deneyimi gerektiren yüksek performanslı dApp'lerin ölçeklenmesi için optimize edilmiştir.
* **Zincir içi yönetim ile dağıtılmıştır**: İkincil Yetki Kanıtı (PoSA), merkeziyetsizlik ve topluluk katılımcılarını getirir. Yerel token olarak BNB, hem akıllı sözleşme yürütme gazı hem de staking için token olarak kullanılacaktır.

## İkincil Yetki Kanıtı

İkincil Yetki Kanıtı (PoW), merkeziyetsiz bir ağı uygulamak için pratik bir mekanizma olarak kabul edilmiş olsa da, çevre dostu değildir ve güvenliği sağlamak için büyük bir katılımcı sayısına ihtiyaç duyar.

Ethereum ve [MATIC Bor](https://github.com/maticnetwork/bor), [TOMOChain](https://tomochain.com/), [GoChain](https://gochain.io/), [xDAI](https://xdai.io/) gibi bazı diğer blok zinciri ağları, farklı senaryolar içinde hem test ağı hem de ana ağda [Yetki Kanıtı (PoA)](https://en.wikipedia.org/wiki/Proof_of_authority) veya varyantlarını kullanmaktadır. 

> PoA, 51% saldırısına karşı bazı savunmalar sunarak belirli seviyelerdeki Bizans oyuncularına (kötü niyetli veya hacklenmiş) karşı daha iyi verimlilik ve tolerans sağlar. 
> — Akıllı Sözleşme Projesi   

Bu arada, PoA protokolü, blokları üretmek için sırayla dönen düğümlerin tüm yetkilere sahip olması ve yolsuzluk ile güvenlik saldırılarına açık olması nedeniyle PoW kadar merkeziyetsiz olmadığı için en çok eleştirilen konudur. EOS ve Lisk gibi diğer blok zincirleri, token sahiplerinin oylama yapmasına ve doğrulayıcı setini seçmesine olanak tanıyan farklı türde [Delegeli Hisse Kanıtı (DPoS)](https://en.bitcoinwiki.org/wiki/DPoS) sunmaktadır. 

BSC burada DPoS ve PoA'yı konsensüs için birleştirmeyi önermektedir, böylece:

1. Bloklar sınırlı bir doğrulayıcı seti tarafından üretilir.
2. Doğrulayıcılar, [Ethereum'un Clique](https://eips.ethereum.org/EIPS/eip-225) konsensüs tasarımına benzer şekilde, bir PoA şeklinde blok üretiminde sırayla dönerler.
3. Doğrulayıcı seti, staking temelli yönetime dayanarak içeri ve dışarı seçilir.

Hızlı belirleme, kullanıcı deneyimini büyük ölçüde iyileştirebilir. `Hızlı Kesinlik` özelliği, gelecek Plato güncellemesi ile etkinleştirilecektir. Bu, BSC'nin büyük bir avantajı olacak ve birçok dapp bundan faydalanacaktır.

BSC konsensüs protokolü aşağıdaki amaçları yerine getirir:

1. Kısa Blok Süresi, ana ağda 3 saniye.
2. İşlemlerin kesinliğini onaylamak için oldukça kısa bir süre gerektirir, gelecek Plato güncellemesinden sonra ana ağda yaklaşık 6 saniye.
3. Yerel token BNB'nin enflasyonu yoktur, blok ödülü işlem ücretlerinden toplanır ve BNB olarak ödenir.
4. Ethereum sistemi ile %100 uyumludur.
5. Modern proof-of-stake blok zinciri ağı yönetimine imkan tanır.

## Güvenlik

Eğer ½*N+1 doğrulayıcı dürüstse, PoA tabanlı ağlar genellikle güvenli ve düzgün çalışır. Ancak, belirli sayıda Bizans doğrulayıcıların ağı hedef alma ihtimali hâlâ vardır, örneğin [Klon Saldırısı](https://arxiv.org/pdf/1902.10244.pdf) yoluyla. BSC, çift imza atma veya devamsızlık için Bizans doğrulayıcıları cezalandırmak amacıyla Cezalandırma mantığını tanıtmaktadır. 

:::warning
Bu Cezalandırma mantığı, kötü niyetli doğrulayıcıları çok kısa bir süre içinde açığa çıkaracak ve "Klon Saldırısı"nı gerçekleştirmek çok zor veya son derece yararsız hale getirecektir. 
:::

## Hızlı Kesinlik

Kesinlik, blok zinciri güvenliği için kritik öneme sahiptir, bir blok kesinleştirildiğinde geri alınamaz. Hızlı kesinlik özelliği çok kullanışlıdır, kullanıcılar en son kesinleştirilen bloktan doğru bilgileri aldıklarından emin olabilirler ve ardından hemen ne yapacaklarına karar verebilirler. Tasarımın daha fazla detayları için lütfen [BEP-126](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP126.md) bağlantısına başvurun.

Gelecek Plato güncellemesi öncesinde, BC'yi mümkün olduğunca güvence altına almak için, BSC kullanıcılarının ⅔*N+1 farklı doğrulayıcı tarafından mühürlenmiş blokları alana kadar beklemeleri teşvik edilmektedir. 

> Bu şekilde, BSC, BC ile benzer bir güvenlik seviyesinde güvenilir olabilir ve %⅓*N'den daha az Bizans doğrulayıcıyı tolere edebilir.
> — Güvenlik Protokolleri   

21 doğrulayıcı ile, eğer blok süresi 3 saniye ise, ⅔*N+1 farklı doğrulayıcı mühürleri için gereken süre (⅔*21+1)*3 = 45 saniye olacaktır. BSC için herhangi bir kritik uygulama, nispeten güvenli bir kesinlik sağlamak için ⅔*N+1 beklemek zorunda kalacaktır. Yukarıda belirtilen cezalandırma mekanizması ile, ½*N+1 veya daha az blok, çoğu işlem için onay olarak yeterlidir.

Gelecek Plato güncellemesinden sonra, `Hızlı Kesinlik` özelliği etkinleştirilecektir. Zincir, ⅔*N veya daha fazla doğrulayıcı normal oy kullandığında iki blok içinde kesinleştirilecektir, aksi takdirde zincirin önceki gibi olasılıkla kesinliğe ulaşması için sabit bir blok sayısı olacaktır.

## Ödül

Mevcut doğrulayıcı setindeki tüm BSC doğrulayıcıları, BNB'deki işlem ücretleri ile ödüllendirilecektir. BNB enflasyonist bir token olmadığından, Bitcoin ve Ethereum ağlarının ürettiği madencilik ödülleri gibi hiçbir madencilik ödülü olmayacak ve gaz ücreti doğrulayıcılar için ana ödül olacaktır. Gelecek Plato güncellemesinden sonra, toplanan ücretlerin bir kısmı kesinlik oylaması için ödül olarak kullanılacaktır. BNB, diğer kullanım durumları ile birlikte de bir araç token olduğundan, delegeler ve doğrulayıcılar BNB tutmaktan başka faydalar da elde edecektir.

Doğrulayıcılar için ödül, her bloktaki işlemlerden toplanan ücretlerdir. Doğrulayıcılar, BNB'lerini kendilerine stake eden delegelere ne kadar iade edeceklerine karar verebilirler; böylece daha fazla staking çekebilirler. Her doğrulayıcı, aynı olasılıkta blok üretmek için sırayla dönüş alacak (eğer %100 canlı kalırlarsa), dolayısıyla uzun vadede, tüm stabil doğrulayıcılar benzer büyüklükte bir ödül elde edebilirler. 

:::tip
Bu arada, her doğrulayıcı üzerindeki stake'ler farklı olabilir, bu nedenle daha fazla kullanıcı bir doğrulayıcıya daha fazla güvenip devretmeye eğilimli olduklarından, potansiyel olarak daha az ödül alacaklardır.
:::

Bu nedenle, rasyonel delegeler, eğer doğrulayıcı hâlâ güven veriyorsa (güvensiz doğrulayıcı cezalandırılabilecek bir risk oluşturabilir) daha az stake ile olanı seçme eğiliminde olacaktır. Sonuçta, tüm doğrulayıcılardaki stake'ler daha az varyasyon gösterecektir. Bu, aslında stake yoğunluğunu ve bazı diğer ağlarda görülen "kazanan sürekli kazanır" sorununu önlemektedir.

## Token Ekonomisi

BC ve BSC, BNB ve BEP2 tokenleri için aynı token evrenini paylaşır. Bu tanımlar:

1. Aynı token, her iki ağda dolaşabilir ve çapraz zincir iletişim mekanizması aracılığıyla iki yönlü olarak akabilir.
2. Aynı token'ın toplam dolaşımı, iki ağ arasında yönetilmelidir; yani, bir token'ın toplam etkili arzı, hem BSC hem de BC’deki token’ın toplam etkili arzının toplamı olmalıdır.
3. Token'ler, BSC üzerinde ERC20 token standardına benzer bir formatta veya BC üzerinde BEP2 olarak ilk kez oluşturulabilir ve ardından diğerinde oluşturulabilir. Her iki ağda da ikisini bağlamak ve token'ın toplam arzını güvence altına almak için yerel yollar bulunmaktadır.

## Staking ve Yönetim

İkincil Yetki Kanıtı, merkeziyetsizlik ve topluluk katılımı getirir. Temel mantığı aşağıdaki gibi özetlenebilir. Diğer ağlardan özellikle Cosmos ve EOS'tan benzer fikirler görebilirsiniz.

1. Token sahipleri, doğrulayıcılar da dahil olmak üzere, token'larını "bağlı" olarak stake edebilirler. Token sahipleri, herhangi bir doğrulayıcıya veya doğrulayıcı adayına token'larını devredebilir, gerçek bir doğrulayıcı olmasını bekleyebilir ve daha sonra token'larını yeniden devretmek için farklı bir doğrulayıcı veya aday seçebilirler.
2. Tüm doğrulayıcı adayları, üzerlerindeki bağlı token sayısına göre sıralanacak ve en üsttekiler gerçek doğrulayıcılar haline gelecektir.
3. Doğrulayıcılar, blok ödüllerinin (bir kısmını) delegelerine paylaşabilirler.
4. Doğrulayıcılar, çift imza atma ve/veya istikrarsızlık gibi kötü davranışları için "Cezalandırma" ile karşılaşabilirler.
5. Kötü davranışlar tespit edildiğinde sistemin token'ların bağlı kalmasını sağlamak için doğrulayıcılar ve delegeler için bir "bağlı kalma dönemi" bulunmaktadır; sorumlu olan bu süre zarfında cezalandırılacaktır.