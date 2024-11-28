---
title: Genel Bakış - BSC MEV
description: BSC ağı, MEV pazarını güçlendirmek için Proposer-Builder Ayrımı modelini benimsemektedir. Bu içerik, BSC MEV'nin işleyişini, sağladığı avantajları ve süreçleri derinlemesine incelemektedir.
keywords: [BSC, MEV, Proposer-Builder Ayrımı, Builder API, blok önericisi, merkezsiz borsa, DeFi]
---

# BSC MEV Genel Bakışı

BSC ağı, adil ve birleşik bir MEV pazarının oluşturulması için [Builder API Specification](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP322.md) standartlarını tanıttı. Daha önce, BSC istemcileri, birden fazla MEV sağlayıcısıyla aynı anda etkileşime geçmek için yerel destekten yoksundu. Ağa birçok farklı istemci yazılımı sürümü kullanıldığı için **istikrar** kayboldu. En son BSC istemcisi, [Proposer-Builder Ayrımı](https://ethereum.org/en/roadmap/pbs/) modelini benimsemektedir. Bu birleşik çerçeve içinde, BSC ağının birçok yönü iyileştirilmiştir:

- **İstikrar**: Validatörlerin çeşitli Builders'lar ile sorunsuz bir şekilde entegre olmak için yalnızca resmi istemciyi kullanmaları gerekmektedir.

- **Ekonomi**: İzin olmaksızın katılabilen Builders, sağlıklı bir pazar rekabetini teşvik eder. Validatörler, daha fazla değer çıkararak daha fazla builder ile entegre olabilir, bu da delegeler için de faydalıdır.

- **Şeffaflık**: Bu spesifikasyon, BSC MEV pazarında şeffaflığı sağlamayı hedeflemekte, paydaşlar arasındaki kar dağılımını kamuya açmaktadır.

## MEV ve PBS Nedir

MEV, aynı zamanda Maksimum (veya Maden) Çıkarılabilir Değer olarak da bilinmektedir ve işlem sıralamasından elde edilebilecek toplam değer ölçüsü olarak tanımlanabilir. Yaygın örnekler arasında merkeziyetsiz borsalarda swap'lar üzerinden arbitraj yapmak veya DeFi pozisyonlarını tasfiye etme fırsatlarını belirlemek yer almaktadır. **MEV'yi en üst düzeye çıkarmak**, ileri düzey teknik uzmanlık ve düzenli validatörlerle entegre edilmiş özel yazılım gerektirmektedir. Merkezi operatörlerle birlikte elde edilen kazançların daha yüksek olması muhtemeldir.

> "Proposer-builder ayrımı (PBS), MEV'nin ekonomisini yeniden yapılandırarak bu sorunu çözmektedir."  
> — BSC MEV Genel Bakışı

Blok inşaatçıları bloklar oluşturur ve bunları blok önericisine sunar; blok önericisi, en kârlı olanı seçerken blok inşaatçısına bir ücret ödemektedir. Bu, küçük bir uzman blok inşaatçısı grubunun MEV çıkarımında baskın olsa bile, ödülün yine de ağda herhangi bir validatöre gittiği anlamına gelir.

## BSC'de Nasıl Çalışır

![MEV on BSC](../../../images/bnb-chain/bnb-smart-chain/img/mev/mev-overview.png)

Yukarıdaki şekil, BSC ağında çalışan PBS'nin temel iş akışını göstermektedir.

- **MEV Araştırmacıları**, kârlı MEV fırsatlarını tespit eden bağımsız ağ katılımcılarıdır ve işlemlerini builders'a sunarlar. Araştırmacılardan gelen işlemler genellikle bir araya toplanır ve bir blokta dahil edilir, aksi takdirde hiçbiri dahil edilmez.

:::tip
Builder, çeşitli kaynaklardan gelen işlemleri toplayarak mühürsüz bir blok oluşturur ve bunu blok önericisine sunar. 
:::

- Builder, bu bloğun benimsenmesi durumunda önericinin builder'a ödemesi gereken ücret miktarını talepte belirtir. Builder'dan gelen mühürsüz bloğa da **blok teklifi** denir, zira bahşiş talep edebilir.

- Önerici, birden fazla builderdan en kârlı olan bloğu seçer ve bloğun sonunda builder'a bir ödeme işlemi ekleyerek ücreti öder.

Ağ güvenliğini artırmak için **Sentry** adı verilen yeni bir bileşen tanıtılmıştır. Bu, önericilerin builders ile iletişim kurmasına yardımcı olur ve ödeme işlemlerini kolaylaştırır.

## Daha Fazla Nedir

BSC üzerindeki PBS modeli, Ethereum'daki uygulamasından birçok açıdan farklıdır. Bunun başlıca sebepleri şunlardır:

1. **Farklı Güven Modeli**: BNB Akıllı Zincir üzerindeki validatörler daha güvenilir olarak kabul edilir; çünkü önemli bir BNB delegasyonu gerektirir ve yüksek bir itibarı sürdürmek zorundadır. Bu durum, Ethereum'a kıyasla çok daha kolay hâle gelmektedir; yani, validatör olma engeli çok düşüktür (örneğin, 32 ETH).

2. **Farklı Konsensüs Algoritmaları**: Ethereum'da, bir blok başlığı bir builder'dan validatöre imzalama için aktarılır; bu, bloğun ağda yayılmasına olanak tanırken, işlemleri validatöre açıklamaz. Aksine, BSC'de geçerli bir blok başlığı oluşturmak, işlemlerin ve sistem sözleşmesi çağrılarının (örneğin, ödül transferi ve validatör seti sözleşmesine yatırma gibi) yürütülmesini gerektirdiğinden, builders'ın tüm bloğu önermesi imkânsızdır.

3. **Farklı Bloklama Süresi**: BSC'de Ethereum'un 12 saniyesine kıyasla 3 saniyelik daha kısa bir blok süresi ile zaman verimliliği tasarımı kritik hale gelmektedir.

:::info
Bu farklılıklar, BSC'nin PBS'sinde ödeme, etkileşim ve API'ler açısından farklı tasarımlara yol açmıştır. Daha fazla tasarım felsefesi için lütfen [BEP322: Builder API Specification for BNB Smart Chain](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP322.md) referansına göz atınız.
:::