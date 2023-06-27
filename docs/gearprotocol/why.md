---
title: Neden Gear İnşa Edilmiş?
sidebar_position: 2
sidebar_label: Neden Gear İnşa Edilmiş?
---

## Global Etki

Blockchain teknolojisi, merkezi sunucu tabanlı internetten (Web2) dağıtık ve merkezsiz bir yapıya (Web3) hızlı bir geçiş sağlamıştır. Onun ayırt edici özellikleri şunlardır: tek bir noktada başarısızlık olmaması (büyük bir oranda katılımcı saldırıya uğratılsa veya ortadan kaldırılsa bile ağ hâlâ işlev görebilir), sansür direnci, ağdaki herhangi bir kişinin hizmeti kullanabilme imkânı (izin gerektirmeyen).

Web3, merkezi olmayan uygulamalar (dApp'ler) ve varlıkların (asset) yeni türlerini tanıtmıştır; bunlar arasında merkezi olmayan finans (DeFi), merkezi olmayan para borsaları (DEX), merkezi olmayan pazar yerleri ve oyun platformları, NFT'ler, Sosyal Token'lar ve daha fazlası yer alır.

Bugün endüstri henüz bebeklik döneminde olduğu için hızlı büyüme fırsatı sunmaktadır. Dahası, Web3 geliştiricilerine olan talep şu anda tüm zamanların en yükseğindedir ve benimsenme hızı hiç olmadığı kadar hızlı bir şekilde artmaktadır.

Gear, Web3 ekosistemini oluşturmak için önemli bir platform olma amacıyla inşa edilmiştir.

### Blok zincirlerinin evrimi

Blok zincirleri, temelde taraflar arasındaki işlemlerin herkes tarafından erişilebilir bir şekilde saklandığı bir geçmişi depolar. Blok zincirindeki verilere merkezsiz, değiştirilemez ve izinsiz erişim sağlarlar.

Blok zinciri teknolojisinin başlangıcında olan ağların önemli sorunları vardır:
- Ölçeklenebilirlik eksikliği, düşük işlem hızı, yüksek işlem maliyeti - hepsi Web3 uygulamalarının büyümesini engeller.
- Alan özel geliştirme dilleri, gelişime engel olan yüksek engelleri beraberinde getirir. Yeni programlama dili ve paradigmaları öğrenme ihtiyacı, Web3'e giren geliştiricilerin büyümesini engeller.
- Karmaşık ve verimsiz yerel uzlaşma protokolleri.
- Ağlar arasında iletişim eksikliği.
## Dotsama ekosistemi (Polkadot/Kusama ağları)

Çözüm, blok zincirlerini bir araya getiren bir Layer-0 teknolojisi oluşturma odaklı olan Parity Technologies tarafından bulunmuştur. Bu teknoloji Polkadot olarak adlandırılan büyük bir ağa blok zincirlerini birleştirir.

Polkadot, blok zincirlerinin bir arada var olup birbirini tamamlayabileceği bir sistem sağlar. Farklı paralel blok zincirleri (parachain'ler) Substrate üzerine inşa edilir ve Polkadot ile bağlantılıdır. Bu, farklı düğümlerin farklı uygulama mantığını çalıştırmasını sağlar ve her bir zinciri kendi platformunda tutar. Tüm parachain'ler birbirine bağlanarak çok işlevli blok zinciri hizmetlerinden oluşan devasa bir ağ oluşturur. Parachain'ler, Polkadot ekosisteminin Layer-1'ini oluşturur. Ethereum, Bitcoin, Solana vb. gibi diğer bağımsız Layer-1 blok zincir ağlarından farklı olan ana fark, parachain'lerin Substrate Cumulus kütüphanesi ve bağımsız blok zincirlerinin köprülerle bağlanmasıdır.

Polkadot ve test ağı Kusama, tamamen genişletilebilir ve ölçeklenebilir bir blok zinciri geliştirme, dağıtım ve etkileşim test platformu olarak tasarlanmıştır. Yeni blok zinciri teknolojileri mevcut hâle geldikçe, aşırı karmaşık merkezi olmayan koordinasyon veya sert çatallanma gerektirmeksizin bu teknolojileri bünyesine entegre edebilecek şekilde oluşturulmuştur.

Bugün Polkadot, hızla büyüyen çoklu zincir ağlarından biridir. Akıllı sözleşme platformları inşa etmek için uyarlanabilir bir mimariye ve merkezi olmayan uygulamalar için hızlı teknoloji geliştirmeye sahip olsa da, kendisi başlı başına bir akıllı sözleşme platformu değildir.

<!---
Substrate üzerine inşa edilen bir akıllı sözleşme platformu olarak, Gear, Polkadot veya Kusama'da bir Layer-1 parachain veya Polkadot veya Kusama'dan bağımsız bir bağımsız ağ olan "Gear Network"ü dağıtmak için kullanılabilecek şekilde inşa edilmiştir. Gear Network, geliştiricilerin dApp'lerini en kolay ve verimli şekilde sadece dakikalar içinde dağıtmalarını sağlar. Bu, geliştiricilerin, her bir benzersiz ağın avantajlarından yararlanarak Polkadot ve Kusama üzerinde dApp'ler inşa etmelerini sağlar, bununla birlikte bunu yap

mak için geleneksel olarak harcanan önemli zaman ve maliyetten kaçınır.
--->

Substrate üzerine inşa edilen Gear Protocol, Layer-1 parachain veya bağımsız bir ağın dağıtım altyapısına erişimi kolaylaştırır. Gear, ağ katılımı ve işlevselliği için teknik geliştirme, yazılım ve yardımcı programlarıyla dApp dağıtım sürecini basitleştirir ve geniş bir bilgi erişimi ve teknik destek sunar.

Polkadot mimarisinde birkaç bileşen bulunmaktadır:
- Relay Chain
- Parachains
- Köprüler

### Relay Chain

Relay Chain, Polkadot'un kalbidir ve ağın güvenliği, uzlaşısı ve zincirler arası etkileşiminden sorumludur. Özel blok zincirlerinin ve halka açık blok zincirlerinin birleşik ve birbirine bağlanabilir Polkadot ağı içinde bağlanmasını sağlar. Relay Chain, bir Layer-0 platformu olarak düşünülebilir.

Relay Chain'in minimal işlevselliği, akıllı sözleşmeler gibi gelişmiş işlevsellik özelliklerini desteklemediği anlamına gelir. Diğer belirli görevler parachain'lere devredilir ve her birinin farklı uygulamaları ve özellikleri vardır.

Relay Chain'in temel görevi, genel sistemini ve bağlı parachain'lerini koordine ederek ölçeklenebilir ve birbirine bağlanabilir bir ağ oluşturmaktır.

Ayrıca, Relay Chain ağın paylaşılan güvenliğinden, uzlaşısından ve zincirler arası etkileşiminden sorumludur.

### Parachains

Parachain'ler, kendi token'larına sahip olabilen ve işlevselliğini belirli kullanım durumları için optimize edebilen egemen blok zincirleridir.

Parachain'lerin diğer ağlarla etkileşim kabiliyetini sağlamak için Relay Chain'e bağlanması gerekmektedir. Bunun için parachain'ler sürekli bağlantı için bir slot kiralayabilir veya ilerledikçe ödeme yapabilir (bu durumda Parathread olarak adlandırılır). Parachain'ler, Polkadot ekosisteminin Layer-2'sini oluşturur.

Parachain'ler, Relay Chain'in doğrulayıcıları tarafından doğrulanabilir ve isimlerini ana Relay Chain'e paralel çalışan paralel zincirlerin kavramından alırlar. Paralel doğaları nedeniyle işlem işleme sürecini paralel hâle getirerek Polkadot ağının ölçeklenebilirliğini iyileştirmeye yardımcı olurlar.

Parachain'ler, belirli kullanım durumları için işlevselliğini optimize eder ve birçok durumda kendi token'larını destek

ler.

Polkadot ve Kusama'da bir parachain olabilmek için projeler [parachain açık artırmalarına](https://parachains.info/auctions) katılmalıdır.

### Köprüler

Blok zinciri köprüsü, Polkadot ekosisteminin Ethereum, Bitcoin ve diğer harici ağlarla bağlantı kurmasına ve iletişim kurmasına olanak sağlayan özel bir bağlantıdır. Bu tür ağlar, Layer-1 olarak kabul edilebilir. Bir köprü bağlantısı, bir blok zincirinden diğerine token veya keyfi veri transferine olanak tanır.

## Gear Protocol'ün Dotsama ekosistemindeki rolü

Polkadot gibi, Gear Protocol de Substrate çerçevesini kullanır. Bu, özel uygulamalar için farklı blok zincirleri oluşturmayı kolaylaştırır. Substrate, kutudan çıkan geniş işlevselliği sağlar ve protokolün üzerinde özel bir motor oluşturmaya odaklanmanızı sağlar. Gear Protocol üzerine inşa eden projeler, çözümlerini Polkadot/Kusama ekosistemine sorunsuz bir şekilde entegre edebilir.

Polkadot'un merkezi yönü, zincirler arasında keyfi mesajların yönlendirilme yeteneğidir. Hem Polkadot hem de Gear ağları, asenkron mesajlar olarak adlandırılan aynı dili konuşurlar, bu nedenle Gear kullanılarak oluşturulan projeler Polkadot ve Kusama ağlarına kolayca entegre olabilir. Asenkron mesajlaşma mimarisi, Gear ağlarını verimli ve kullanımı kolay parachain'ler yapar.

Gear Protocol'ün çoğu geliştirici ve ilham kaynağı, Polkadot ve Substrate teknolojilerinin oluşturulmasında doğrudan yer almıştır. Gear, ağın güvenliğine ve esnekliğine dayanarak ürünümüzden yüksek güvenlik ve esneklik bekliyoruz, tam olarak Polkadot gibi.

Gear ağları, donanım geliştikçe doğal olarak ölçeklenir, çünkü tüm CPU çekirdeklerini kullanır. Bugün standart bir bilgisayara sahip herkes bir Gear düğümü çalıştırabilir. Parachain yuvalarına birden çok dağıtarak ve ölçeklenebilirlik için bağımsız bir ağ olarak paylaştırılarak Gear ağları ölçeklenebilirliklerini artırabilir.

Daha fazla ayrıntı için [Gear Beyaz Kağıdı'na](https://whitepaper.gear-tech.io/) başvurun.