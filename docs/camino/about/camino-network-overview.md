---
sidebar_position: 2
---

# Camino Ağı Genel Bakış

Camino Ağı, ,  ve  olmak üzere 3 yerleşik blockchain'den oluşur. Bu 3 blockchain, **Ana Ağ** tarafından doğrulanır ve güvence altına alınır. Ana Ağ, özel bir altyapıdır ve tüm özel alt ağların üyeleri, Ana Ağ'ın da bir üyesi olmalıdır.



## Exchange Chain (X-Chain)

**X-Chain**, dijital akıllı varlıklar oluşturma ve ticaret yapma amacıyla merkeziyetsiz bir platform olarak işlev görür. Bu dijital varlıklar, gerçek dünya kaynaklarının (örneğin, hisse senetleri, tahviller) bir temsilidir ve bu varlıkların davranışını yöneten bir dizi kural içerir; örneğin "yarına kadar ticareti yapılamaz" veya "yalnızca ABD vatandaşlarına gönderilebilir."

X-Chain üzerinde işlem gören bir varlık CAM'dır. Camino Ağı üzerinde bir blockchain'e işlem yaptığınızda, CAM cinsinden bir ücret ödersiniz.

X-Chain, Avalanche Sanal Makinesinin (AVM) bir örneğidir. , istemcilerin X-Chain üzerinde varlık oluşturmasına ve ticaret yapmasına olanak tanır.

Bu zincir, yüksek düzeyde uzmanlaşmış ve performans açısından optimize edilmiştir; basit bir karmaşıklık seviyesinde tutulduğundan işlemlerin genel ağırlığı diğer zincirlere göre daha düşüktür. Bu, aynı zamanda işlem ücreti hesaplamasında da bir faktördür, çünkü basit ve hızlı işlemler ağa fazla yük bindirmez.

## Platform Chain (P-Chain)

**P-Chain**, Camino Ağı'ndaki metadata blockchain'dir ve doğrulayıcıları koordine eder, aktif alt ağları takip eder ve yeni alt ağların oluşturulmasını sağlar. P-Chain, **Snowman konsensüs protokolünü** uygular.

, istemcilerin alt ağlar oluşturmasına, alt ağlara doğrulayıcı eklemesine ve blockchain'ler oluşturmasına olanak tanır.

Sadece koordinasyon değil, aynı zamanda doğrulayıcıların oluşturulması ve stake'in devri de P-Chain'in bir parçasıdır. Kavramsal olarak, stake/delegasyonu doğrulayıcılara bağlama şeklimizi değiştirmek üzere sürekli bir süreç içerisindeyiz; ancak temel olarak hala P-Chain üzerinde yönetilmektedir.

## Contract Chain (C-Chain)

**C-Chain**, akıllı sözleşmelerin oluşturulmasına olanak tanır ve  aracılığıyla bu işlemler gerçekleştirilir.

C-Chain, Camino Ağı tarafından desteklenen Ethereum Sanal Makinesi'nin bir örneğidir.

Bu zincirde muhtemelen toplam yükün %95'i işlem görmektedir. Kullanıcılar, bu zinciri kullanarak (çoğunlukla uygulamalar aracılığıyla) Solidity ile yazılabilen akıllı sözleşmeleri dağıtır ve kullanır. Bu zincir üzerinde kullanılan adresler, EVM/Ethereum'dan aşina olduğunuz yapıyla da özdeş olup, mevcut uygulamalarla (örneğin MetaMask) bu zincire oldukça kolay bir şekilde bağlanabilirsiniz. Maksimum esneklik ve uyumluluk bakımından, en büyük olumsuz nokta, (karmaşık) işlemlerin yürütülmesinin _potansiyel olarak_ yavaş olabilmesidir. Bu nedenle, karmaşık veya verimsiz akıllı sözleşmeler nedeniyle ağda aşırı yüklenmeyi önlemek için, işlem ücretleri dağıtılmak istenen sözleşmelerin karmaşıklığını yansıtır.

## Neden 3 zincir?

Her zaman bir işi yapacak en uygun aracı kullanmak gerekmektedir. İşte Avalanche içindeki özel zincirlerin yaklaşımının arkasındaki felsefe budur. Camino Ağı da aynı teknik çerçeve üzerine inşa edildiğinden bu durum bizim için de geçerlidir. Bu zincirler, amaçlarına göre tamamen ayrı sistemler olarak tasarlanmış, optimize edilmiş ve değerlendirilmiştir. Başta biraz karmaşık görünebilir, ancak bu uygulama alanlarının farklı zincirlere ayrılmasının iyi nedenleri vardır. Sonuçta, ihtiyacınız olan zincirleri kullanmakla sınırlı olduğunuz için durum çok da karmaşık değildir.

Zincirler arasındaki tek etkileşim, CAM token'larının değiştirilmesidir. Varlık veya kişi tarafından hangi zincirin kullanılacağına karar veren faktörler şunlardır:

- Doğrulayıcılar, P-Chain ile çalışmalıdır.
- Uygulama geliştiricileri, gereksinimlerine bağlı olarak, birçok küçük işlem için ücretleri azaltmak amacıyla X-Chain üzerinden entegrasyon yapmanın faydalı olup olmayacağına karar verebilir. Daha karmaşık uygulama senaryoları olduğunda, akıllı sözleşmeleri gerektirecek şekilde C-Chain kullanılacaktır.
- Uygulama kullanıcıları bunun pek farkında olmamalıdır, çünkü uygulamalar bu süreci arka planda yönetmelidir.

Özetlemek gerekirse:

- Herkes,  aracılığıyla zincirler arasında CAM'ı kolayca transfer edebilir.
- Ağ operatörleri/doğrulayıcılar ve devretmek isteyen herkes P-Chain'i de kullanmalıdır.
- İleri düzey uygulama geliştiricileri, hızlı ve basit X-Chain'in sınırlamalarına ve avantajlarına yönelik çalışmayı tercih edebilir.
- Akıllı sözleşmelerin dağıtımı gibi diğer tüm işlemler EVM uyumlu olan C-Chain üzerinde gerçekleşir.

## Sanal Makineler

Bir **Sanal Makine (VM)**, bir blockchain'in uygulama düzeyindeki mantığını tanımlar. Teknik terimlerle, blockchain'in durumunu, durum geçiş işlevini, işlemleri ve kullanıcıların blockchain ile etkileşime girebileceği API'yi belirler. Camino Ağı üzerindeki her blockchain, bir VM'nin örneğidir.

, ağ, konsensüs ve blockchain yapısı gibi daha düşük seviyeli mantıklarla ilgilenmenize gerek yoktur. Camino Ağı bunu arka planda halleder, böylece inşa etmek istediğiniz şey üzerine yoğunlaşabilirsiniz.

VM'yi bir blockchain için bir plan olarak düşünün; aynı VM'yi, her biri aynı kuralları takip eden, fakat diğer blockchain'lerden mantıksal olarak bağımsız birçok blockchain oluşturmak için kullanabilirsiniz.

### Neden Sanal Makineler?

Başlangıçta, blockchain ağlarında önceden tanımlanmış ve statik bir işlevsellik setine sahip bir Sanal Makine (VM) bulunuyordu. Bu katı ve monolitik tasarım, blockchain tabanlı uygulamaların bu tür ağlarda çalıştırılmasını sınırlıyordu.

Özelleştirilmiş merkeziyetsiz uygulamalar isteyen kişiler, baştan kendi blockchain ağlarını oluşturmak zorundaydılar. Bu, büyük ölçüde zaman ve çaba gerektiriyor, sınırlı güvenlik sağlıyordu ve genellikle var olmayan, hassas bir blockchain ile sonuçlanıyordu.

Ethereum, bu sorunu akıllı sözleşmelerle çözmeye bir adım attı. Geliştiriciler, ağ ve konsensüs ile ilgili endişelenmek zorunda kalmadılar, ancak merkeziyetsiz uygulamalar oluşturmak yine de zordu. Ethereum VM düşük performansa sahipti ve akıllı sözleşme geliştiricilerine kısıtlamalar getiriyordu. Solidity ve Ethereum akıllı sözleşmeleri yazmak için kullanılan diğer birkaç dil, çoğu programcı için tanıdık değildi.

VM'ler, blockchain tabanlı merkeziyetsiz bir uygulama tanımlamayı kolaylaştırır. Yeni, sınırlı diller olan Solidity yerine, geliştiriciler VM'leri Go ile yazabilir (gelecekte diğer diller de desteklenecektir).

## Alt Ağlar

Bir **alt ağ**, belirli bir dizi blockchain'in durumunu konsensusa ulaşmak üzere çalışan dinamik bir doğrulayıcı setidir. Her blockchain, tam olarak bir alt ağ tarafından doğrulanır. Bir alt ağ, birçok blockchain'i doğrulayabilir. Bir düğüm, birçok alt ağın üyesi olabilir.

Bir alt ağ, kendi üyeliğini yönetir ve bileşen doğrulayıcılarının belirli özelliklere sahip olmasını talep edebilir. Bu oldukça faydalıdır ve bunun sonuçlarını daha derinlemesine bir şekilde aşağıda inceleyeceğiz:

### Uyumluluk

Camino Ağı'nın alt ağ mimarisi, düzenleyici uyumluluğu yönetilebilir kılar. Yukarıda belirtilenlere ek olarak, bir alt ağ, doğrulayıcıların belirli gereksinimleri karşılamasını isteyebilir.

Gereksinim örneklerine şunlar dahildir:

- Doğrulayıcılar belirli bir ülkede yer almalıdır
- Doğrulayıcılar KYC/AML kontrollerini geçmelidir
- Doğrulayıcılar belirli bir lisansa sahip olmalıdır

(Açık olmak gerekirse, yukarıdaki örnekler sadece örneklerdir. Tüm gereksinimler Camino Ağı'na uygulanmaz.)

### Özel Blockchain'ler için Destek

Sadece belirli önceden tanımlanmış doğrulayıcıların katılabileceği bir alt ağ oluşturabilirsiniz ve bu da içeriklerin yalnızca o doğrulayıcılar tarafından görünmesini sağlamakta olan özel bir alt ağ oluşturur. Bu, bilgilerini gizli tutmakla ilgilenen kuruluşlar için idealdir.

### Endişelerin Ayrılması

Heterojen bir blockchain ağında, bazı doğrulayıcılar belirli blockchain'leri doğrulamak istemeyebilir, çünkü bu blockchain'ler ile ilgilenmiyorlar. Alt ağ modeli, doğrulayıcıların sadece önemli oldukları blockchain'lerle ilgilenmelerine izin verir. Bu, doğrulayıcılar üzerindeki yükü azaltır.

### Uygulama Özel Gereksinimleri

Farklı blockchain tabanlı uygulamalar, doğrulayıcıların belirli özelliklere sahip olmasını gerektirebilir. Örneğin, büyük miktarda RAM veya CPU gücü gerektiren bir uygulama olduğunu varsayalım. Bir alt ağ, doğrulayıcıların uygulamanın düşük performans göstermemesi için belirli donanım gereksinimlerini karşılamasını talep edebilir.