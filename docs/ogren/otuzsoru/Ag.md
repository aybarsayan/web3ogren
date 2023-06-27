# 30 Soruda Bilgisayar Ağları

1.  TCP ve UDP arasındaki temel farklar nelerdir?
2.  IP adresleri ve DNS nasıl çalışır? İkisi arasındaki ilişki nedir?
3.  IPv4 ve IPv6 arasındaki temel farklar nelerdir?
4.  Çeşitli yönlendirme protokollerini (RIP, OSPF, EIGRP, BGP) açıklayın ve karşılaştırın.
5.  Bilgisayar ağlarında hata kontrolü ve düzeltme mekanizmalarından bahsedin.
6.  TCP'nin üçlü el sıkışma (three-way handshake) sürecini açıklayın.
7.  ICMP protokolünün amacı ve işlevi nedir?
8.  Ağlar arası veri iletimini sağlayan IP'nin temel işlevlerini açıklayın.
9.  MAC adresleri ve IP adresleri arasındaki fark nedir?
10.  Ethernet çerçeveleri ve yapısı hakkında bilgi verin.
11.  CSMA/CD ve CSMA/CA arasındaki temel farklar nelerdir?
12.  Kablosuz ağlarda WEP, WPA ve WPA2 güvenlik protokollerinin karşılaştırması.
13.  OSI ve TCP/IP modeli arasındaki farklar nelerdir?
14.  Ağlarda kalite hizmeti (Quality of Service, QoS) nedir ve neden önemlidir?
15.  Ağlarda veri akış kontrol mekanizmalarını açıklayın.
16.  Farklı anahtarlamaları açıklayın: devre anahtarlaması, paket anahtarlaması ve hücre anahtarlaması.
17.  Sinyal gürültü oranı (SNR) nedir ve ağ performansı üzerindeki etkisi nedir?
18.  Kriptografi ve ağ güvenliği arasındaki ilişki nedir?
19.  Ağlarda yaygın olarak kullanılan farklı fiziksel ve veri bağlantı katmanı standartları nelerdir?
20.  VPN'ler (Sanal Özel Ağlar) nedir ve nasıl çalışır?
21.  Ağ topolojileri (yıldız, halka, otobüs, ağaç) hakkında bilgi verin.
22.  Ağ segmentasyonu ve alt ağ maskesi kullanmanın avantajları nelerdir?
23.  Bilgisayar ağlarında çeşitli gecikme türlerini açıklayın: iletim gecikmesi, işleme gecikmesi ve yayılım gecikmesi.
24.  Tıkanıklık kontrolü nedir ve ağ performansı üzerindeki etkisi nedir?
25.  Çok katmanlı anahtarlamayı açıklayın ve kullanım alanlarını belirtin.
26.  Farklı hizmet seviyesi anlaşması (SLA) parametrelerini açıklayın.
27.  Sayısal ve analog sinyaller arasındaki temel farklar nelerdir? Ağlarda nasıl kullanılır?
28.  TCP'nin aşırı yüklenme kontrol mekanizmalarından (congestion control mechanisms) bahsedin: slow start, congestion avoidance, fast retransmit ve fast recovery.
29.  Kablosuz ağlarda kullanılan IEEE 802.11 aile standartları hakkında bilgi verin: 802.11a, 802.11b, 802.11g, 802.11n ve 802.11ac.
30.  SDN (Software-Defined Networking) nedir ve ağ yönetimi üzerinde nasıl bir etkisi vardır?


## TCP ve UDP arasındaki temel farklar nelerdir?

TCP (Transmission Control Protocol) ve UDP (User Datagram Protocol), internet üzerinde veri iletimi için kullanılan iki temel iletişim protokolüdür. İkisi arasındaki temel farklar şunlardır:

1.  Bağlantı:
    
    -   TCP, bağlantı odaklı bir protokoldür. İki uç arasında iletişim başlamadan önce bağlantı kurulur ve iletişim tamamlandığında bağlantı kapatılır.
    -   UDP ise bağlantısız bir protokoldür. İletişim başlamadan önce herhangi bir bağlantı kurulması gerekmez.
2.  Güvenilirlik:
    
    -   TCP, güvenilir bir iletişim sağlar. Veri paketlerinin doğru sırayla ve hatalar olmaksızın iletilmesini garanti eder. Hata kontrolü ve düzeltme mekanizmaları içerir.
    -   UDP, güvenilir olmayan bir iletişim sağlar. Veri paketlerinin doğru sırayla veya hatalar olmaksızın iletilip iletilmediğini garanti etmez.
3.  Hız:
    
    -   TCP, güvenilir iletişim sağladığından, daha fazla kontrol ve hata düzeltme mekanizmalarıyla birlikte daha yavaş bir iletişim sunar.
    -   UDP, güvenilir olmayan iletişim sağladığı için daha hızlıdır. Kontrol ve hata düzeltme mekanizmalarının eksikliği nedeniyle daha düşük gecikme süresi sunar.
4.  Sıralama ve akış kontrolü:
    
    -   TCP, paketlerin doğru sırayla iletilmesini sağlar ve alıcı tarafından doğru sırayla işlenmesini garanti eder. Ayrıca, alıcının ve verici arasında veri akışının hızını kontrol eder.
    -   UDP, paketlerin sıralamasını veya akış kontrolünü sağlamaz.
5.  Başlık Boyutu:
    
    -   TCP başlığı, daha fazla bilgi taşıdığı için daha büyüktür (genellikle 20 bayt).
    -   UDP başlığı, daha az bilgi taşıdığı için daha küçüktür (genellikle 8 bayt).
6.  Kullanım Alanları:
    
    -   TCP, güvenilir ve sıralı veri iletimi gerektiren uygulamalar için kullanılır. Örneğin, web sayfaları, e-postalar ve dosya transferleri.
    -   UDP, hızlı ve düşük gecikme süresi gerektiren uygulamalar için kullanılır, ancak güvenilirlikten ödün verilebilir. Örneğin, video ve ses akışları, VoIP, oyunlar ve bazı DNS sorguları.
7.  Tıkanıklık Kontrolü:
    
    -   TCP, tıkanıklık kontrol mekanizmaları sunar ve ağdaki tıkanıklığa duyarlıdır. Bu, veri akışının düzenlenmesine ve ağda meydana gelen gecikmelerin ve kayıpların önlenmesine yardımcı olur.
    -   UDP, tıkanıklık kontrolü sağlamaz ve ağdaki tıkanıklığa duyarsızdır. Bu nedenle, yüksek hızlı veri aktarımında ağdaki diğer trafiği olumsuz yönde etkileyebilir.
8.  Anlık iletişim:
    
    -   TCP, üç yönlü el sıkışma (three-way handshake) ile iletişimin başlamasını ve bağlantının güvenli bir şekilde kapanmasını sağlar. Bu, alıcı ve verici arasında karşılıklı bir anlayış sağlar ve anında iletişim kurulmasını sağlar.
    -   UDP, anlık iletişim sağlamaz. Verici, alıcıya bilgi gönderir ve alıcının paketleri alıp almadığına dair geri bildirim sağlanmaz.

Her iki protokolün de avantajları ve dezavantajları bulunmaktadır. TCP, güvenilir ve düzenli veri iletimi sunarken, UDP hızlı ve düşük gecikme süresiyle öne çıkmaktadır. Uygulamanın gereksinimlerine bağlı olarak, TCP veya UDP protokolleri tercih edilebilir.

## 2. IP adresleri ve DNS nasıl çalışır? İkisi arasındaki ilişki nedir?

IP adresi (Internet Protokol adresi), İnternet üzerindeki herhangi bir cihazın (bilgisayar, sunucu, yazıcı, akıllı telefon vb.) ağı üzerinde benzersiz bir tanımlayıcıdır. İki cihaz arasında veri alışverişi yapılırken, bu IP adresleri, paketlerin doğru hedefe yönlendirilmesine yardımcı olur. IP adresleri genellikle dört sekiz bitlik sayıdan oluşan IPv4 (ör. 192.168.0.1) veya sekiz 16 bitlik sayıdan oluşan IPv6 (ör. 2001:0db8:85a3:0000:0000:8a2e:0370:7334) formatında gösterilir.

DNS (Domain Name System), kullanıcıların hatırlaması ve kullanması kolay olan alan adlarını (ör. [www.example.com](http://www.example.com/)) IP adreslerine çeviren bir sistemdir. İnternet tarayıcınızda bir URL (Uniform Resource Locator) yazdığınızda, tarayıcınız önce DNS sunucusuna başvurur ve ilgili IP adresini öğrenir. Ardından tarayıcı, bu IP adresine bağlanır ve web sayfasının içeriğini getirir.

IP adresleri ve DNS arasındaki ilişki, insanların sayısal IP adreslerini hatırlamak zorunda kalmadan İnternet'teki cihazlara ve kaynaklara erişebilmelerini sağlar. DNS, kullanıcı dostu alan adlarını IP adreslerine dönüştürerek, İnternet üzerindeki iletişimi ve navigasyonu daha kolay hale getirir. Bu süreç, İnternet'in günlük kullanımında akıcı ve kullanıcı dostu bir deneyim sağlar.


## 3.  IPv4 ve IPv6 arasındaki temel farklar nelerdir?

IPv4 ve IPv6, İnternet Protokolü'nün (IP) iki farklı sürümüdür ve ağ üzerindeki cihazların iletişimini sağlar. Bu iki sürüm arasındaki temel farklar şunlardır:

1.  Adres uzunluğu ve formatı: IPv4, 32 bitlik adresler kullanır ve bu adresler genellikle dört sekiz bitlik sayıyla gösterilir (ör. 192.168.0.1). IPv6 ise 128 bitlik adresler kullanır ve bu adresler sekiz 16 bitlik sayıyla gösterilir (ör. 2001:0db8:85a3:0000:0000:8a2e:0370:7334).
    
2.  Adres alanı ve kullanılabilir adres sayısı: IPv4'ün 32 bitlik adres uzunluğu nedeniyle yaklaşık 4.3 milyar benzersiz IP adresi sağlayabilir. İnternet'in büyümesi ve cihazların artmasıyla bu adreslerin tükenmesi söz konusu olmuştur. IPv6, 128 bitlik adres uzunluğu sayesinde yaklaşık 3.4 x 10^38 benzersiz IP adresi sağlar, bu da neredeyse sınırsız sayıda adres anlamına gelir.
    
3.  IP adresi atama yöntemleri: IPv4, statik (elle atanmış) ve dinamik (DHCP kullanılarak atanmış) IP adresleri kullanır. IPv6 ise daha esnek ve otomatik adres atama yöntemleri sunar. Bu yöntemler, özellikle "Stateless Address Autoconfiguration (SLAAC)" olarak adlandırılan bir yöntemdir.
    
4.  Yönlendirme ve ağ yapılandırması: IPv6, ağ yapılandırmasını ve yönlendirmeyi basitleştirir. IPv6'nın hiyerarşik adres yapısı sayesinde yönlendirme tablolarının boyutu küçültülebilir ve yönlendirme verimliliği artırılabilir.
    
5.  Güvenlik: IPv4'te güvenlik, opsiyonel bir özelliktir ve genellikle ağ katmanının dışında uygulanır (ör. IPSec). IPv6, IPSec'i protokolün bir parçası olarak içerir ve böylece daha güvenli ve şeffaf iletişim sağlar.
    
6.  Kalite ve hizmet (QoS): IPv6, gerçek zamanlı veri iletimi için kalite ve hizmet özellikleri sunar. Bu özellikler, öncelikli veri trafiği için önceliklendirme sağlayarak ses ve video gibi uygulamaların daha iyi performans göstermesine olanak tanır.
    
7.  Parça başına (fragmentation) işlemi: IPv4'te, parçalama işlemi hem kaynak hem de yönlendiriciler tarafından gerçekleştirilebilir. Bu durum, ağ trafiğinin artması ve yönlendiricilerin daha fazla işlem yapmasıyla ağın performansını olumsuz yönde etkileyebilir. IPv6'da ise, parçalama işlemi yalnızca kaynak cihaz tarafından gerçekleştirilir ve bu sayede ağ performansı daha fazla optimize edilir.
    
8.  Zorunlu özellikler: IPv4'te, bazı özellikler opsiyonel olarak kullanılabilirken, IPv6'da bunlar zorunlu hale getirilmiştir. Örneğin, IPv6, multicast adreslemeyi zorunlu kılar ve bu sayede ağ üzerindeki verimliliği ve performansı artırır.
    
9.  Ağ duyurusu ve keşfi: IPv4'te, ağ duyurusu ve keşfi için kullanılan protokoller ARP (Address Resolution Protocol) ve ICMP (Internet Control Message Protocol) ile sağlanır. IPv6, bu protokolleri, daha hızlı ve güvenli ağ keşfi ve duyurusu için özel olarak tasarlanmış olan NDP (Neighbor Discovery Protocol) ile değiştirir.
    
10.  Mobilite ve taşınabilirlik: IPv6, mobilite ve taşınabilirlik özellikleri sunar, bu sayede kullanıcılar IP adreslerini değiştirmeden farklı ağlara geçebilirler. Bu özellik, özellikle akıllı telefonlar ve diğer mobil cihazlar için önemlidir.
    

Bu farklar ve avantajlar sayesinde IPv6, İnternet'in büyümesine ve gelişmesine uyum sağlamak için IPv4'e göre daha uygun bir çözüm sunmaktadır. Ancak, IPv4 ve IPv6 arasında tam uyumluluk olmadığından, çoğu ağ, her iki protokolü de destekleyen çift yığın (dual-stack) yapılandırmalarını kullanarak geçiş sürecini yönetmektedir.

## 4. Çeşitli yönlendirme protokollerini (RIP, OSPF, EIGRP, BGP) açıklayın ve karşılaştırın.

1.  RIP (Routing Information Protocol): RIP, distance-vector tabanlı bir yönlendirme protokolüdür ve ağırlıklı olarak küçük ve orta ölçekli ağlar için kullanılır. Bellman-Ford algoritması üzerine kuruludur ve maksimum 15 hop sayısı ile sınırlıdır. RIP, zaman içinde dengeli ve kararlı hale gelmesine rağmen, büyük ağlar için ölçeklenebilir değildir ve yavaş yakınsama süreleri sunar.
    
2.  OSPF (Open Shortest Path First): OSPF, iç ağlarda (IGP) kullanılan link-state tabanlı bir yönlendirme protokolüdür. Dijkstra'nın en kısa yol algoritması kullanarak en iyi yolu belirler ve daha hızlı yakınsama süreleri sağlar. OSPF, ağlarda alt bölgelere (areas) ayrılabilir, böylece büyük ağlar için ölçeklenebilir bir çözüm sunar. OSPF, IP üzerinde çalışır ve IPv4 ve IPv6'yı destekler.
    
3.  EIGRP (Enhanced Interior Gateway Routing Protocol): EIGRP, Cisco tarafından geliştirilen gelişmiş bir distance-vector yönlendirme protokolüdür ve sadece Cisco cihazlarında kullanılabilir. Dual (Diffusing Update Algorithm) algoritması üzerine kuruludur ve hızlı yakınsama süreleri ile ölçeklenebilirlik sunar. EIGRP, loop (döngü) önleme mekanizm

## 5.   Bilgisayar ağlarında hata kontrolü ve düzeltme mekanizmalarından bahsedin.

Bilgisayar ağlarında veri iletimi sırasında hataların oluşması kaçınılmazdır. Hata kontrolü ve düzeltme mekanizmaları, veri bütünlüğünün korunmasına ve doğru veri iletiminin sağlanmasına yardımcı olur. Bu mekanizmalar genellikle iki kategoriye ayrılır: hata algılama ve hata düzeltme.

1.  Hata Algılama: Hata algılama mekanizmaları, veri iletiminde hataların tespit edilmesine yardımcı olur. Hatalı veri paketleri genellikle tekrar gönderilmelidir. İki yaygın hata algılama yöntemi şunlardır:

a) Parity Bit (Eşlik Biti): Parity bit, veri iletimi sırasında tek hataların tespit edilmesine yardımcı olur. Veri birimindeki 1'lerin sayısını hesaplayarak tek veya çift eşlik kontrolü sağlanır. Bu yöntem, sadece tek hataları tespit etme yeteneğine sahiptir ve çoklu hataları tespit edemez.

b) Checksum (Saklama Kontrolü): Checksum, gönderen tarafından hesaplanan ve veri birimi ile birlikte gönderilen bir değerdir. Alıcı tarafından da aynı değer hesaplanır ve gönderilen checksum değeri ile karşılaştırılır. Eşleşmezse, hata tespit edilmiş sayılır ve verinin tekrar gönderilmesi istenir.

c) CRC (Cyclic Redundancy Check): CRC, hata tespitinde yaygın olarak kullanılan daha gelişmiş bir yöntemdir. Gönderen tarafından verinin polinomları kullanarak hesaplanan bir CRC değeri üretilir ve veri paketiyle birlikte gönderilir. Alıcı, aynı yöntemi kullanarak CRC değerini hesaplar ve gönderilen değerle karşılaştırır. Eşleşmezse, hatalı iletim tespit edilmiş sayılır.

2.  Hata Düzeltme: Hata düzeltme mekanizmaları, hatalı veri paketlerini tespit etmenin yanı sıra hataları düzeltebilme yeteneğine sahiptir. İki yaygın hata düzeltme yöntemi şunlardır:

a) Hamming Kodu: Hamming kodu, parite bitlerini veriye ekleyerek hataları tespit etmeye ve düzeltmeye yardımcı olur. Hatalı bitlerin konumu ve değeri belirlenerek hatalar düzeltilir. Hamming kodu, tek hataları düzeltebilir ve çift hataları tespit edebilir.

b) FEC (Forward Error Correction): FEC yöntemi, ekstra düzeltici kodları (redundancy) kullanarak alıcı tarafında hataları düzeltmeyi amaçlar

c) FEC (Forward Error Correction): FEC yöntemi, gönderici tarafından veriye ekstra düzeltici kodlar (redundancy) ekleyerek çalışır ve alıcı tarafında hataları düzeltmeyi amaçlar. Bu kodlar, alıcının hatalı bitleri tespit etmesine ve düzeltmesine olanak tanır. FEC, alıcı tarafında daha fazla işlem gücü gerektirse de, hatalı veri paketlerinin tekrar gönderilmesi gereksinimini azaltarak ağ verimliliğini artırır.

d) Reed-Solomon Kodları: Reed-Solomon kodları, FEC yöntemlerinden biridir ve blok kodlaması kullanarak hataları tespit etmeye ve düzeltmeye olanak tanır. Bu kodlar, özellikle dijital veri depolama ve iletiminde (CD, DVD, QR kodları, derin uzay iletişimi vb.) yaygın olarak kullanılır. Reed-Solomon kodları, çoklu hataları tespit etme ve düzeltme becerisine sahiptir.

e) Türbo Kodlar ve LDPC (Low-Density Parity-Check) Kodlar: Türbo kodlar ve LDPC kodlar, daha yüksek düzeyde hata düzeltme performansı sağlayan gelişmiş hata düzeltme yöntemleridir. Türbo kodlar, iki veya daha fazla kodlayıcı bir araya getirerek çalışırken, LDPC kodlar düşük yoğunluklu parite kontrol matrisleri kullanarak hata düzeltme sağlar. Bu yöntemler, özellikle kablosuz iletişim ve dijital yayıncılık gibi yüksek hata oranına sahip ortamlar için uygundur.

Hata kontrolü ve düzeltme mekanizmaları, bilgisayar ağlarındaki veri iletiminin doğruluğunu ve güvenilirliğini sağlamak için önemli bir rol oynar. Bu mekanizmalar, hem hatalı iletimleri tespit etme hem de hataları düzeltebilme yeteneğine sahip olarak ağ performansını ve verimliliğini artırır.

## 6. TCP'nin üçlü el sıkışma (three-way handshake) sürecini açıklayın.

TCP'nin üçlü el sıkışma (three-way handshake) süreci, bir TCP bağlantısının başlatılması sırasında gerçekleşen bir süreçtir. Bu süreç, hem istemci hem de sunucunun birbirleriyle senkronize olmalarını ve bağlantının başarılı bir şekilde kurulmasını sağlar. Üçlü el sıkışma aşağıdaki adımları içerir:

1.  SYN (Synchronize): İstemci, sunucuya SYN paketi gönderir. Bu paket, istemcinin başlatmak istediği bağlantıyı belirtir ve başlangıç sekans numarasını (Initial Sequence Number - ISN) içerir. ISN, istemci tarafından gönderilecek olan ilk veri baytının sekans numarasıdır.
    
2.  SYN-ACK (Synchronize-Acknowledge): Sunucu, istemciden aldığı SYN paketini alır ve bağlantıyı kabul ederse, istemciye geri bir SYN-ACK paketi gönderir. Bu paket, sunucunun kendi başlangıç sekans numarasını ve istemcinin başlangıç sekans numarasını bir artırarak onayladığını belirtir.
    
3.  ACK (Acknowledge): İstemci, sunucunun gönderdiği SYN-ACK paketini alır ve doğru bir şekilde işler. İstemci, sunucuya ACK paketi göndererek el sıkışma sürecini tamamlar. Bu ACK paketi, sunucunun başlangıç sekans numarasını bir artırarak onaylar ve böylece bağlantı başarılı bir şekilde kurulur.
    

Bu üçlü el sıkışma süreci tamamlandıktan sonra, istemci ve sunucu arasında bir TCP bağlantısı başarılı bir şekilde kurulmuş olur ve veri iletimine başlanabilir. Üçlü el sıkışma, hem istemcinin hem de sunucunun bağlantının başarılı bir şekilde kurulması için gerekli bilgilere sahip olduğundan emin olmalarını sağlar ve güvenilir bir iletişim kanalı oluşturur.

## 7.   ICMP protokolünün amacı ve işlevi nedir?

Internet Control Message Protocol (ICMP) bir İnternet Protokolü (IP) ağı üzerinde çalışan hata raporlama ve tanılama protokolüdür. ICMP, ağ yönlendiricileri ve ana bilgisayarlar arasındaki iletişimi sağlamak ve düzgün çalışmayan bağlantıları veya ağdaki diğer sorunları bildirmek için kullanılır. ICMP, IP protokolüne bağlı olarak çalışır ve IP paketleri içinde iletilir.

ICMP'nin temel işlevleri şunlardır:

1.  Hata raporlama: Ağdaki cihazlar arasında iletişim sorunları olduğunda, ICMP hata mesajları göndererek bu sorunları rapor eder. Örneğin, bir hedefe ulaşılamadığında veya bir paketin yaşam süresi (TTL) dolduğunda ICMP hata mesajları gönderilir.
    
2.  Ağ tanılama ve test etme: ICMP, ağ bağlantılarının durumunu ve performansını kontrol etmek için kullanılır. Ping ve Traceroute gibi ağ tanılama araçları, ICMP mesajlarını kullanarak ağdaki gecikmeleri ve yönlendirme yollarını ölçer.
    
3.  Ağ yönlendiricileri arasında bilgi paylaşımı: ICMP, ağ yönlendiricileri arasında bilgi paylaşımını sağlar. Örneğin, ICMP yönlendirme yeniden yönlendirmesi, bir yönlendiricinin daha iyi bir yol bulduğunda diğer yönlendiricilere bildirmek için kullanılır.
    
4.  Tıkanıklık kontrolü: ICMP, ağdaki tıkanıklıkları ve trafik yoğunluğunu tespit etmek için kullanılabilir. Bir yönlendirici, tıkanıklık olduğunu tespit ettiğinde, ICMP ile tıkanıklık bildirim mesajları göndererek diğer cihazları uyarır ve trafiği yönetmeye yardımcı olur.
    

Özetle, ICMP protokolü, İnternet üzerindeki ağların düzgün çalışmasını sağlamak, hataları raporlamak ve ağ performansını izlemek için kullanılır. Bu protokol sayesinde, ağ yöneticileri ve kullanıcılar, ağ ile ilgili sorunları tespit edebilir ve gerekli düzeltmeleri yaparak İnternet bağlantısının kalitesini iyileştirebilir.

## 8.  Ağlar arası veri iletimini sağlayan IP'nin temel işlevlerini açıklayın.

İnternet Protokolü (IP), ağlar arası veri iletimini sağlayan temel bir protokoldür ve İnternet üzerindeki iletişimin temelini oluşturur. IP, verilerin paketlere bölündüğü ve paketlerin kaynak adresten hedef adrese doğru yönlendirildiği bağlantısız ve en iyi çaba (best-effort) bir iletişim modeli kullanır. IP'nin temel işlevleri şunlardır:

1.  Adresleme: IP, her ağ cihazına benzersiz bir adres atar. Bu adresler, veri paketlerinin doğru hedefe ulaşmasını sağlar. IPv4 ve IPv6 olmak üzere iki sürümü vardır. IPv4, 32 bitlik adresler kullanırken, IPv6, 128 bitlik adresler kullanarak daha fazla adresleme alanı sağlar.
    
2.  Paketleme: IP, veriyi daha küçük parçalara (paketlere) böler, böylece veri iletimi daha hızlı ve verimli hale gelir. Her paket, kaynak ve hedef adresler, paket numarası ve diğer kontrol bilgilerini içeren bir başlıkla birlikte gönderilir.
    
3.  Yönlendirme: IP, paketlerin kaynaktan hedefe ulaşmasını sağlayan yolun belirlenmesinde önemli bir rol oynar. Paketler, ağlar arasında yönlendiriciler tarafından yönlendirilir ve hedefe ulaşana kadar birden fazla ağ geçebilir. IP, en iyi çaba (best-effort) yönlendirme modelini kullanır, yani paketlerin iletimi için herhangi bir garantisi yoktur.
    
4.  Tıkanıklık kontrolü: IP, ağ tıkanıklığını azaltmaya yardımcı olmak için paketlerin yaşam süresi (TTL) değerini kullanır. TTL, bir paketin ağda kaç yönlendirici (hop) geçebileceğini belirleyen bir sayıdır. Her yönlendirici, paketin TTL değerini bir azaltır ve TTL sıfıra ulaştığında, paket düşürülür. Bu, sonsuz yönlendirme döngülerini önler ve ağ tıkanıklığını azaltır.
    
5.  Parçalama ve yeniden birleştirme: IP, farklı ağların farklı maksimum iletim birimi (MTU) boyutlarına sahip olabileceğini dikkate alarak, büyük paketlerin parçalanmasını ve hedefte tekrar birleştirilmesini sağlar. Bu, ağ kaynaklarının daha verimli kullanılmasına yardımcı olur.

6.  Hata raporlama: IP, İnternet Kontrol Mesaj Protokolü (ICMP) ile birlikte çalışarak ağdaki hataları ve sorunları rapor eder. ICMP, hedefe ulaşamayan paketler, yönlendirme sorunları ve aşırı gecikmeler gibi problemlerle ilgili geri bildirim sağlar. Bu geri bildirimler, ağ yöneticilerinin sorunları teşhis etmesine ve çözmesine yardımcı olur.

IP'nin temel işlevleri, İnternet üzerindeki iletişimin sağlanmasında ve ağlar arası veri iletiminin etkin bir şekilde gerçekleştirilmesinde kritik bir öneme sahiptir. Bu işlevler, IP'nin İnternet'in temel taşı olmasını sağlar ve çeşitli ağ teknolojilerinin birbirleriyle uyumlu bir şekilde çalışmasına olanak tanır.

## 9. MAC adresleri ve IP adresleri arasındaki fark nedir?

MAC adresleri ve IP adresleri, ağlarda cihazların tanımlanması ve iletişimin sağlanması için kullanılır. İkisi arasındaki temel farklar şunlardır:

1.  Adres türü: MAC adresleri, fiziksel donanım adresleridir ve her ağ arayüzüne özgüdür. Ethernet ve Wi-Fi kartları gibi ağ arayüz kartları (NIC'ler) üretici tarafından atanan benzersiz bir MAC adresine sahiptir. IP adresleri ise ağ katmanında çalışan, cihazların ağ üzerinde iletişim kurabilmesi için atanmış mantıksal adreslerdir.
    
2.  Kapsam: MAC adresleri, yerel ağlar (LAN'lar) içinde kullanılır ve fiziksel olarak bağlı cihazlar arasında veri iletimini sağlar. IP adresleri ise genellikle daha geniş ağlar (WAN'lar) ve İnternet üzerinde kullanılır, böylece farklı ağlarda bulunan cihazlar arasında iletişim sağlanır.
    
3.  Protokol katmanı: MAC adresleri, veri bağlantı katmanında (OSI modelinin 2. katmanı) çalışır ve çerçevelerin (frames) doğru donanıma yönlendirilmesini sağlar. IP adresleri ise ağ katmanında (OSI modelinin 3. katmanı) çalışır ve paketlerin farklı ağlar arasında yönlendirilmesine olanak tanır.
    
4.  Değiştirilebilirlik: IP adresleri, dinamik olarak atanabilir ve cihazların ağ yapılandırması değiştirildiğinde güncellenebilir. MAC adresleri ise genellikle sabittir ve ağ arayüz kartının üretimi sırasında atanır. Bazı durumlarda, MAC adreslerinin değiştirilmesine izin veren yazılım ve donanım araçları mevcuttur; ancak bu, özel durumlar için geçerlidir ve genellikle yapılmaz.
    
5.  Adres uzunluğu ve biçimi: MAC adresleri, 48 bit uzunluğunda ve genellikle onaltılık biçimde gösterilir (ör. 00:1A:2B:3C:4D:5E). IP adresleri ise IPv4 ve IPv6 olmak üzere iki versiyona sahiptir. IPv4 adresleri 32 bit uzunluğunda ve noktalı onlu notasyonda gösterilir (ör. 192.168.1.1), IPv6 adresleri ise 128 bit uzunluğunda ve onaltılık biçimde gösterilir (ör. 2001:0db8:85a3:0000:0000:8a2e:0370:7334).

## 10.  Ethernet çerçeveleri ve yapısı hakkında bilgi verin.

Ethernet, yerel alan ağlarında (LAN) kullanılan popüler bir ağ protokolüdür ve Ethernet çerçevesi, bu protokolde kullanılan temel veri birimidir. Ethernet çerçeveleri, OSI modelinin 2. katmanında (veri bağlantı katmanı) çalışır ve cihazlar arasında veri iletimini sağlar. Ethernet çerçevesinin yapısı, veri iletimi sırasında her çerçeve başlığı ve sonunda bulunan belirli alanlardan oluşur.

Ethernet çerçeve yapısı aşağıdaki gibidir:

1.  Preamble (Önsöz) ve Start Frame Delimiter (SFD) (Çerçeve Başlangıç Belirteci): Çerçevenin başında yer alan bu alanlar, fiziksel katmandaki cihazların çerçeve sınırlarını ve senkronizasyonu algılamalarına yardımcı olur. Preamble, 7 baytlık (56 bit) bir alandır ve ardından 1 baytlık (8 bit) SFD gelir.
    
2.  Destination MAC Address (Hedef MAC Adresi): Bu 6 baytlık (48 bit) alan, çerçevenin alıcısının MAC adresini içerir. Bu adres, çerçevenin hedef ağ arayüzüne doğru yönlendirilmesini sağlar.
    
3.  Source MAC Address (Kaynak MAC Adresi): Bu 6 baytlık (48 bit) alan, çerçevenin göndericisinin MAC adresini içerir. Bu adres, alıcı tarafından kaynak cihazın tanımlanması için kullanılır.
    
4.  EtherType/Length (EtherTipi/Uzunluk): Bu 2 baytlık (16 bit) alan, Ethernet çerçevesinin içeriğini belirtir. Çerçeve içinde taşınan verinin türünü (IP, ARP, IPv6 vb.) veya çerçevenin boyutunu belirlemek için kullanılabilir.
    
5.  Payload (Yük): Bu alan, çerçevenin taşıdığı asıl veriyi içerir. Ethernet çerçevelerinin yük alanı, genellikle 46 ila 1500 bayt arasında değişir. Bu alan, ağ katmanından gelen IP paketleri, ARP mesajları veya diğer protokol verilerini taşır.
    
6.  Frame Check Sequence (Çerçeve Kontrol Dizisi) (FCS): Bu 4 baytlık (32 bit) alan, hata kontrolü için kullanılır. Gönderici tarafından hesaplanan ve alıcı tarafından doğrulanan bir CRC (Döngüsel İkame Kontrolü) değeri içerir. Bu değer, veri iletimi sırasında çerçevedeki hataları tespit etmek için kullanılır.
    

Ethernet çerçeveleri, ağlar arasında veri iletimini sağlayan ve hızlı, güvenilir bir iletişim kurmayı mümkün kılan temel yapı taşlarıdır.

## 11.  CSMA/CD ve CSMA/CA arasındaki temel farklar nelerdir?

CSMA/CD (Carrier Sense Multiple Access with Collision Detection) ve CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) her ikisi de çoklu erişim protokolleri olup, paylaşılan bir iletişim ortamında (örneğin, Ethernet gibi) cihazlar arasında veri iletimini düzenler. Her ne kadar her iki protokol de iletişim çatışmalarını ele alsa da, bunu farklı yöntemlerle yaparlar.

CSMA/CD:

1.  CSMA/CD, genellikle kablolu Ethernet ağlarında kullanılır.
2.  Bu protokol, cihazların iletim yapmadan önce iletişim ortamını dinlemelerini gerektirir. Eğer ortam boşsa, cihaz veri iletimine başlar.
3.  Çatışma tespit edildiğinde, CSMA/CD tüm cihazlara çatışmayı bildirir ve çatışmanın olduğu anda iletimi durdurur.
4.  Çatışma durumunda, her cihaz rastgele bir süre bekler ve daha sonra tekrar iletişim ortamını dinlemeye başlar. Bu süreç, çatışmalar çözülene kadar devam eder.
5.  CSMA/CD, veri iletimi sırasında çatışmaları tespit etme ve düzeltme üzerine odaklanır.

CSMA/CA:

1.  CSMA/CA, genellikle kablosuz Wi-Fi ağlarında kullanılır.
2.  Bu protokol, cihazların iletim yapmadan önce iletişim ortamını dinlemelerini ve çatışma olasılığını azaltacak şekilde iletim zamanlamalarını düzenlemelerini gerektirir.
3.  Çatışma önceden tespit edilemediği için, CSMA/CA çatışmaları önlemeye çalışır.
4.  CSMA/CA, cihazların veri iletimi öncesi rastgele bir süre beklemelerini ve ardından iletişim ortamını kontrol etmelerini sağlar. Eğer ortam boşsa, cihaz veri iletimine başlar.
5.  CSMA/CA, ayrıca ACK (Acknowledgement) paketleri kullanarak başarılı iletimlerin doğrulanmasını sağlar. Eğer bir cihaz, belirli bir süre içinde ACK paketi alamazsa, iletimin başarısız olduğunu varsayar ve iletimi tekrar dener.

Özetle, CSMA/CD ve CSMA/CA her ikisi de çoklu erişim protokolleri olup, paylaşılan iletişim ortamlarında veri iletimini düzenler. CSMA/CD, kablolu Ethernet ağlarında çatışmaları tespit etmeye ve düzeltmeye odaklanırken, CSMA/CA kablosuz Wi-Fi ağlarında çatışmaları önlemeye çalışır.

## 12.  Kablosuz ağlarda WEP, WPA ve WPA2 güvenlik protokollerinin karşılaştırması.

WEP (Wired Equivalent Privacy), WPA (Wi-Fi Protected Access) ve WPA2, kablosuz ağlarda kullanılan güvenlik protokolleridir. Bu protokoller, ağ trafiğini şifreleyerek yetkisiz kullanıcıların erişimini engellemeye çalışır. İşte bu üç protokolün karşılaştırması:

1.  WEP:
    
    -   WEP, 1999'da IEEE 802.11 standardının bir parçası olarak tanıtıldı ve kablosuz ağlarda temel şifreleme sağlamak için tasarlandı.
    -   WEP, 64-bit ve 128-bit anahtar uzunluklarıyla RC4 şifreleme algoritmasını kullanır.
    -   WEP'in statik anahtarları ve zayıf şifreleme yöntemleri nedeniyle, zaman içinde güvenlik açıklarına yol açtı ve kısa sürede kırılabilir hale geldi.
    -   WEP, şu anda güvensiz kabul edilir ve yeni ağlar için önerilmez.
2.  WPA:
    
    -   WPA, WEP'in güvenlik açıklarını gidermek ve daha güvenli bir kablosuz ağ ortamı sağlamak için 2003'te tanıtıldı.
    -   WPA, Temporal Key Integrity Protocol (TKIP) adlı daha güçlü bir şifreleme yöntemi kullanır ve anahtarların her paket için dinamik olarak değiştirilmesini sağlar.
    -   WPA, kullanıcı kimlik doğrulaması için IEEE 802.1X standardını destekler ve genellikle RADIUS sunucularıyla birlikte çalışır.
    -   WPA, WEP'e kıyasla daha güvenli olsa da, TKIP'nin bazı güvenlik açıklarına yol açtığı tespit edildi ve daha güvenli bir protokol olan WPA2 ile değiştirildi.
3.  WPA2:
    
    -   WPA2, 2004 yılında tanıtıldı ve WPA'nın yerini aldı. WPA2, IEEE 802.11i standardında belirtilen güvenlik özelliklerini uygular.
    -   WPA2, daha güçlü bir şifreleme yöntemi olan Advanced Encryption Standard (AES) algoritmasını kullanır ve TKIP'ye göre daha güvenlidir.
    -   WPA2, kullanıcı kimlik doğrulamasında IEEE 802.1X standardını destekler ve RADIUS sunucularıyla birlikte çalışabilir.
    -   WPA2, günümüzde en yaygın kullanılan ve en güvenilir kablosuz ağ güvenlik protokolüdür. 2018'de tanıtılan WPA3 ise, daha da gelişmiş güvenlik özellikleri sunarak gelecekte WPA2'nin yerini almayı amaçlamaktadır.

Özetle, WEP, WPA ve WPA2, kablosuz ağların güvenliğini sağlamak için kullanılan şifreleme protokolleridir. WEP, artık güvensiz kabul edilir ve kullanılması önerilmez. WPA, WEP'e göre daha güvenli bir seçenek olsa da, zaman içinde ortaya çıkan güvenlik açıklarından dolayı WPA2 ile değiştirildi. WPA2 şu anda en güvenli ve yaygın olarak kullanılan kablosuz ağ güvenlik protokolüdür.

WPA3, 2018'de tanıtıldı ve daha gelişmiş güvenlik özellikleri sunarak kablosuz ağ güvenliğini daha da ileri taşımaktadır. WPA3, şifreleme gücünü ve kullanıcı gizliliğini artırarak yetkisiz erişimi ve veri dinlemeyi önlemeye yönelik önlemler sunar. Ayrıca, daha güçlü şifreleme yöntemleri ve yeni protokollerle yeni nesil kablosuz ağları güvence altına almayı amaçlar. WPA2 ile uyumlu olan WPA3, zaman içinde WPA2'nin yerini alması beklenmektedir. Bu nedenle, yeni kablosuz ağlar için WPA2 veya WPA3 kullanılması önerilir.


## 13.  OSI ve TCP/IP modeli arasındaki farklar nelerdir?

OSI ve TCP/IP modelleri, bilgisayar ağlarında iletişimi düzenlemek ve tanımlamak için kullanılan iki farklı ağ mimari modelidir. Her iki model de iletişimin farklı katmanlara bölünmesine dayanır, ancak aralarında bazı önemli farklar vardır:

1.  Katman Sayısı: OSI modeli 7 katmandan oluşurken, TCP/IP modeli 4 katmana sahiptir. OSI modeli, Uygulama, Sunum ve Oturum katmanlarını içerirken, TCP/IP modeli bunları tek bir Uygulama katmanında birleştirir.
    
2.  Protokol Seti: OSI modeli, daha teorik ve genel bir ağ modeli olarak kabul edilirken, TCP/IP modeli daha spesifik ve yaygın olarak kullanılan protokollerin bir kümesini içerir. TCP/IP modeli, internet protokolleri üzerinde yoğunlaşırken, OSI modeli daha geniş bir protokol yelpazesi için kullanılabilir.
    
3.  Standartlaşma ve Geliştirme: OSI modeli, Uluslararası Standartlar Örgütü (ISO) tarafından geliştirilmiştir ve standartlaşmaya yöneliktir. TCP/IP modeli ise, İnternet Mühendisliği Görev Grubu (IETF) tarafından geliştirilmiştir ve daha çok pratik uygulama ve sürekli gelişime odaklanır.
    
4.  Modülerlik: OSI modeli daha modüler bir yapıya sahiptir ve katmanlar arası bağımsızlık sağlar. Bu sayede, bir katmandaki değişiklikler diğer katmanları etkilemez. TCP/IP modeli ise, katmanlar arası bağımsızlığı aynı ölçüde sağlayamaz ve protokollerin birbirine daha yakın bağlantısı söz konusudur.
    
5.  Popülerlik ve Kullanım: Günümüzde, TCP/IP modeli İnternet üzerindeki iletişimin temelini oluşturduğu için daha yaygın olarak kullanılır ve kabul görür. OSI modeli ise, ağ mimarisini ve protokollerini anlamak ve öğretmek için daha çok eğitim amaçlı kullanılır.


## 14.  Ağlarda kalite hizmeti (Quality of Service, QoS) nedir ve neden önemlidir?

Kalite Hizmeti (Quality of Service, QoS), bir ağın veri trafiğini yönetme ve kontrol etme yeteneğidir. QoS, önceliklendirme, bant genişliği rezervasyonu, trafik şekillendirme ve sınırlama gibi teknikler kullanarak belirli uygulamalar, protokoller veya kullanıcılar için ağ performansını optimize eder. QoS'un önemi, şu nedenlerle ortaya çıkar:

1.  Heterojen Ağ Ortamı: Çeşitli uygulama türleri ve farklı kullanıcı ihtiyaçları olan karmaşık ağ ortamlarında, QoS, veri trafiğini düzgün bir şekilde yönetmeye yardımcı olarak kaynakların etkili kullanımını sağlar.
    
2.  Öncelikli Trafik: Gerçek zamanlı uygulamalar (ör. VoIP, video konferans) gecikmeye duyarlıdır ve QoS, bu tür uygulamalar için daha yüksek öncelik sağlayarak gecikme ve jitteri azaltır.
    
3.  Bant Genişliği Kullanımı: QoS, bant genişliğini adil bir şekilde paylaştırarak, bant genişliği yoğun uygulamaların (ör. dosya indirme, video akışı) diğer önemli uygulamaların performansını olumsuz etkilemesini önler.
    
4.  Ağ Tıkanıklığı Yönetimi: QoS, ağ tıkanıklığı durumlarında, önemli trafik akışlarının devam etmesini sağlayarak ağ performansını ve istikrarını korur.
    
5.  Hizmet Seviyesi Anlaşmaları (SLA): QoS, ağ hizmet sağlayıcıları ve müşteriler arasında belirli hizmet seviyeleri sağlamak için Hizmet Seviyesi Anlaşmaları'nın (SLA) uygulanmasını destekler.
    

QoS'un sağladığı bu avantajlar sayesinde, kullanıcılar daha iyi bir ağ deneyimi yaşar ve ağ kaynakları daha verimli kullanılır. Bu nedenle, QoS, ağlarda önemli bir bileşendir.

## 15.  Ağlarda veri akış kontrol mekanizmalarını açıklayın.

Ağlarda veri akış kontrolü, gönderen ve alıcının veri trafiğini düzenli bir şekilde yönetmelerini sağlayan mekanizmalardır. Bu mekanizmalar, ağ üzerindeki trafiği kontrol ederek tıkanıklığı önlemeye, veri kaybını azaltmaya ve ağ performansını artırmaya yardımcı olur. Temel veri akış kontrol mekanizmaları şunlardır:

1.  Stop-and-Wait (Dur ve Bekle): Bu mekanizma, gönderenin her paket gönderdikten sonra alıcıdan bir onay almasını gerektirir. Gönderen, onay alındığında bir sonraki paketi gönderir. Bu yöntem basit ve anlaşılır olmasına rağmen, zaman ve bant genişliği kullanımı açısından verimsizdir.
    
2.  Sliding Window (Kayar Pencere): Bu mekanizma, gönderenin alıcıdan onay almadan birden fazla paket göndermesine izin verir. Gönderen ve alıcı, kayar pencere adı verilen belirli bir boyutta bir tampona sahiptir. Gönderen, tamponunda ne kadar boş alan olduğuna bağlı olarak birden fazla paketi gönderebilir. Alıcı, paketleri aldıkça gönderene kayar pencerenin durumunu bildirir ve gönderen, yeni paketler göndererek pencereyi doldurur. Bu yöntem, daha iyi ağ kullanımı ve performans sağlar.
    
3.  Rate-Based Flow Control (Hız Tabanlı Akış Kontrolü): Bu mekanizma, gönderenin belirli bir hızda veri göndermesine dayanır. Alıcı, ağın ve kendi durumuna göre gönderene uygun hızı belirler ve iletmek istediği veri hızını bildirir. Gönderen, alıcının talep ettiği hızda veri gönderir. Bu yöntem, ağ kaynaklarının etkili kullanımına yardımcı olur.
    
4.  Congestion Control (Tıkanıklık Kontrolü): Bu mekanizma, ağda tıkanıklık oluştuğunda veri akışını düzenlemeye yardımcı olur. Tıkanıklık kontrol algoritmaları, paket kaybı, gecikme ve diğer belirtiler kullanarak ağ tıkanıklığını tespit eder ve gönderenin veri gönderme hızını ayarlar. Tıkanıklık kontrolü, ağ performansını ve güvenilirliğini artırır.
    

Bu mekanizmalar, ağlardaki veri akışını düzenleyerek daha iyi performans, güvenilirlik ve kaynak kullanımı sağlar. Ağ protokolleri, özellikle TCP gibi güvenilir iletim protokolleri, bu mekanizmaları kullanarak veri iletimini düzgün bir şekilde gerçekleştirir.

## 16.  Farklı anahtarlamaları açıklayın: devre anahtarlaması, paket anahtarlaması ve hücre anahtarlaması.

Anahtarlamalar, telekomünikasyon ağlarında veri iletimi için kullanılan tekniklerdir. Aşağıda üç ana anahtarlamadan bahsedilmektedir: devre anahtarlaması, paket anahtarlaması ve hücre anahtarlaması.

1.  Devre Anahtarlaması: Devre anahtarlaması, özellikle telefon ağlarında kullanılan eski bir iletişim yöntemidir. Bu yöntemde, iletişim başlamadan önce gönderen ve alıcı arasında fiziksel bir bağlantı kurulur. İletişim sırasında bu bağlantı sürekli açık tutulur ve tüm veri bu devre üzerinden iletilir. İletişim sona erdiğinde, bağlantı kapatılır ve devre serbest bırakılır. Devre anahtarlaması, gecikmenin düşük olduğu ve iletişimin sürekli olduğu durumlar için uygundur. Ancak, kaynak kullanımı açısından verimsizdir, çünkü devre sürekli olarak tahsis edilir ve kullanılmayan zamanlarda boşa harcanır.
    
2.  Paket Anahtarlaması: Paket anahtarlaması, günümüzde internet ve bilgisayar ağlarında yaygın olarak kullanılan bir iletişim yöntemidir. Bu yöntemde, gönderilecek veriler küçük paketlere bölünür ve her paket bağımsız olarak hedefe yönlendirilir. Paketler, ağdaki farklı yolları kullanarak hedefe ulaşabilir ve alıcı tarafından yeniden birleştirilir. Paket anahtarlaması, veri trafiğinin dinamik olduğu ve kaynakların daha etkili kullanılması gereken durumlar için uygundur. Ayrıca, ağda tıkanıklık oluştuğunda paketler farklı yolları kullanarak esnek bir şekilde yönlendirilebilir.
    
3.  Hücre Anahtarlaması: Hücre anahtarlaması, özellikle ATM (Asynchronous Transfer Mode) ağlarında kullanılan bir iletişim yöntemidir. Hücre anahtarlaması, paket anahtarlamaya benzer, ancak veriler sabit boyutta hücrelere bölünür. Bu sayede, ağ trafiği daha iyi yönetilebilir ve kaynaklar etkili bir şekilde kullanılabilir. Hücre anahtarlaması, gerçek zamanlı uygulamalar ve çoklu ortam iletişimi için uygundur, çünkü düşük gecikme ve düşük kayıp oranı sağlar.
    

Bu anahtarlamalar, farklı gereksinimlere ve ağ koşullarına göre veri iletimi için kullanılır. Günümüzde, paket anahtarlaması ve hücre anahtarlaması, daha etkili kaynak kullanımı ve esneklik sağladığı için devre anahtarlamasına kıyasla daha yaygın olarak kullanılmaktadır.


## 18. Kriptografi ve ağ güvenliği arasındaki ilişki nedir?

Kriptografi, bilgi ve verilerin güvenliğini sağlamak için kullanılan bir bilim dalıdır. Kriptografi, iletilen veya saklanan verilerin gizliliğini, bütünlüğünü ve doğrulanmasını sağlamak amacıyla şifreleme ve şifre çözme tekniklerini içerir. Ağ güvenliği, bilgisayar ağları ve altyapılarını yetkisiz erişim, kötü amaçlı saldırılar, veri hırsızlığı ve diğer tehditlere karşı korumayı amaçlayan bir disiplindir.

Kriptografi ve ağ güvenliği arasındaki ilişki, kriptografinin ağ güvenliği için önemli bir bileşen olması ve ağlarda güvenli iletişim sağlamak için kullanılmasıdır. Kriptografi, aşağıdaki şekillerde ağ güvenliğine katkıda bulunur:

1.  Gizlilik: Kriptografi, şifreleme algoritmaları kullanarak verilerin okunamaz hale getirilmesini sağlar. Bu, yetkisiz kişilerin verilere erişmesi ve bunları okuması durumunda bile, verilerin anlamlı bilgiye dönüştürülmesini önler.
    
2.  Bütünlük: Kriptografi, veri bütünlüğünü sağlamak için kullanılabilir. Örneğin, karma fonksiyonları ve dijital imzalar, verilerin kötü amaçlı olarak değiştirilmesini veya bozulmasını tespit etmeye yardımcı olabilir.
    
3.  Kimlik doğrulama: Kriptografi, kullanıcıların ve sistemlerin kimliklerini doğrulamak için dijital sertifikalar ve imzalar gibi teknikler kullanır. Bu, yetkisiz kullanıcıların veya sistemlerin ağa erişimini engeller ve güvenli iletişim sağlar.
    
4.  İletişim güvenliği: Kriptografi, iletişim kanallarının güvenliğini sağlamak için kullanılabilir. Örneğin, güvenli soket katmanı (SSL) ve taşıma katmanı güvenliği (TLS) gibi protokoller, şifreli iletişim kanalları oluşturarak veri aktarımının gizliliğini ve bütünlüğünü korur.
    
5.  Erişim kontrolü: Kriptografi, verilere ve sistemlere erişimi yetkilendirmek ve kontrol etmek için kullanılabilir. Örneğin, anahtar yönetimi ve şifreleme, yetkili kullanıcıların belirli verilere ve kaynaklara erişimini sağlar.

6.  Non-repudiation: Kriptografi, veri iletimi ve işlemlerin gerçekleştirilmesiyle ilgili olarak tarafların inkâr edemeyeceği bir kanıt sağlar. Dijital imzalar ve zaman damgaları gibi teknikler, veri gönderenin ve alıcının kimliğini doğrular ve işlemin gerçekleştirildiğini kanıtlar.
    
7.  Anahtar değişimi: Kriptografi, güvenli anahtar değişimini sağlar, böylece taraflar arasındaki şifreli iletişimi başlatmak ve sürdürmek için kullanılabilir. Diffie-Hellman anahtar değişimi gibi protokoller, ortak bir şifreleme anahtarı oluşturmak için taraflar arasında güvenli bir yöntem sunar.
    
8.  Hızlı geri dönüşüm: Kriptografi, güvenli ağlar için hızlı geri dönüşüm sağlar. Eğer şifreleme anahtarları veya sertifikalarının geçerlilik süresi dolarsa, kriptografik teknikler yeni anahtarlar ve sertifikalar oluşturarak ağın güvenliğini sürdürmeye yardımcı olur.
    
9.  Güvenlik protokolleri: Kriptografi, güvenli ağ protokolleri oluşturmak için temel oluşturur. IPsec, SSL/TLS ve HTTPS gibi protokoller, kriptografik teknikleri kullanarak veri iletiminin güvenliğini sağlar.
    
10.  Hedefli saldırılara karşı koruma: Kriptografi, hedefli saldırılara karşı ağları korumaya yardımcı olur. Şifreleme ve dijital imzalar, kötü amaçlı kullanıcıların ağ trafiğini manipüle etmesini veya taklit etmesini önler.
    

Sonuç olarak, kriptografi ve ağ güvenliği arasındaki ilişki, kriptografinin ağ güvenliğinin temel bileşenlerinden biri olması ve ağların güvenliğini sağlamak için kullanılmasıdır. Kriptografi, ağ güvenliği disiplininde kullanılan önemli bir araç ve tekniktir ve ağlarda güvenli iletişimi, veri korumasını ve kimlik doğrulamayı sağlamaya yardımcı olur.

## 19.  Ağlarda yaygın olarak kullanılan farklı fiziksel ve veri bağlantı katmanı standartları nelerdir?

Ağlarda kullanılan fiziksel ve veri bağlantı katmanı standartları, veri iletimi ve ağ cihazları arasındaki iletişimi sağlamak için tasarlanmıştır. İşte bazı yaygın olarak kullanılan fiziksel ve veri bağlantı katmanı standartları:

1.  Ethernet: Ethernet, yerel alan ağlarında (LAN) en yaygın kullanılan teknolojidir. IEEE 802.3 standardı olarak da bilinen Ethernet, çeşitli hızlarda (10 Mbps'ten 100 Gbps'ye kadar) çalışabilen ve kablolu iletişim için bakır veya fiber optik kabloları kullanan bir veri bağlantı katmanı protokolüdür.
    
2.  Wi-Fi: Kablosuz yerel alan ağlarında (WLAN) kullanılan en yaygın standart olan Wi-Fi, IEEE 802.11 ailesine aittir. Wi-Fi, radyo frekansları üzerinden veri iletimi sağlar ve evlerde, iş yerlerinde ve halka açık alanlarda kablosuz erişim sağlamak için kullanılır.
    
3.  Bluetooth: Bluetooth, kısa mesafeli kablosuz iletişim için tasarlanmıştır ve öncelikle tüketici elektroniği ve kişisel alan ağları (PAN) için kullanılır. IEEE 802.15.1 standardı olarak bilinen Bluetooth, düşük enerjili radyo frekansları kullanarak cihazlar arasında veri iletimi sağlar.
    
4.  SONET/SDH: Senkronize Optik Ağ (SONET) ve Senkronize Dijital Hiyerarşi (SDH), geniş alan ağlarında (WAN) yüksek hızlı, fiber optik iletişim sağlamak için kullanılır. Bu standartlar, ağ altyapısında veri, ses ve video iletimi için esnek ve güvenilir bir çözüm sunar.
    
5.  ATM (Asynchronous Transfer Mode): ATM, hücre tabanlı bir veri iletim teknolojisi olup, geniş alan ağlarında (WAN) yüksek hızlı ve kaliteli hizmet sağlamak için tasarlanmıştır. ATM, sabit boyutta hücreler kullanarak veri, ses ve video trafiğini iletmek için kullanılır.
    
6.  Frame Relay: Frame Relay, geniş alan ağlarında (WAN) veri iletimi için bir paket anahtarlamalı protokoldür. Frame Relay, değişken boyutlu paketler (çerçeveler) kullanarak veri iletimi sağlar ve hizmet kalitesi (QoS) mekanizmalarıyla düşük gecikme süreleri sunar.
    
7.  PPP (Point-to-Point Protocol): PPP, iki nokta arasında doğrudan bir bağlantı sağlamak için kullanılan veri bağlantı katmanı protokolüdür. Genellikle WAN bağlantıları için kullanılır ve IP, IPX ve AppleTalk gibi çeşitli ağ protokolleri üzerinde çalışabilir. PPP, veri bağlantı katmanında hata kontrolü, kimlik doğrulama ve bağlantı yönetimi gibi özellikler sunar.

8.  HDLC (High-Level Data Link Control): HDLC, veri bağlantı katmanında çalışan bit yönlü, paket anahtarlamalı bir protokoldür. HDLC, noktadan noktaya ve çok noktadan noktaya bağlantıları destekler ve hata kontrolü, akış kontrolü ve çerçeve sınırlama gibi özellikler sunar.
    
9.  DSL (Digital Subscriber Line): DSL, mevcut telefon hatları üzerinden yüksek hızlı veri iletimi sağlayan bir ağ teknolojisidir. DSL, veri bağlantı katmanında çalışır ve genellikle ev ve küçük işletme kullanıcılarına geniş bant İnternet erişimi sağlamak için kullanılır.
    
10.  FDDI (Fiber Distributed Data Interface): FDDI, yerel alan ağlarında (LAN) fiber optik kablolar üzerinden yüksek hızlı veri iletimi sağlamak için kullanılan bir veri bağlantı katmanı protokolüdür. FDDI, hızlı ve güvenilir veri iletimi için çift halka mimarisi kullanır ve 100 Mbps'ye kadar hızlar sunar.

Bu fiziksel ve veri bağlantı katmanı standartları, ağların veri iletimini sağlamak, hız ve güvenilirlik sunmak ve farklı ağ ortamlarında çalışmak üzere tasarlanmıştır. Her bir standart, belirli bir uygulama veya ağ türü için optimize edilmiştir ve ağların, cihazların ve uygulamaların verimli ve güvenilir bir şekilde çalışmasını sağlar.


## 20.  VPN'ler (Sanal Özel Ağlar) nedir ve nasıl çalışır?

VPN'ler (Sanal Özel Ağlar), güvenli ve şifreli bir bağlantı üzerinden İnternet üzerinde veri iletimi sağlayan bir ağ teknolojisidir. VPN'ler, genellikle uzaktan çalışan kullanıcıların veya farklı coğrafi konumlardaki şubelerin, şirketin iç ağına güvenli bir şekilde erişebilmesi için kullanılır. VPN'ler, aynı zamanda İnternet üzerinde anonim ve güvenli bir şekilde gezinmeyi sağlar ve coğrafi kısıtlamaları aşmaya yardımcı olur.

VPN'ler şu şekilde çalışır:

1.  VPN istemcisi: Kullanıcının cihazında (bilgisayar, akıllı telefon, tablet vb.) çalışan bir yazılımdır. VPN istemcisi, kullanıcının cihazını VPN sunucusuna bağlamak için kullanılır.
    
2.  VPN sunucusu: VPN sağlayıcısı tarafından yönetilen ve kullanıcıların bağlanabileceği özel bir sunucudur. VPN sunucusu, kullanıcıların verilerini şifreler ve İnternet üzerinden güvenli bir şekilde iletmek için kullanılır.
    
3.  Şifreleme ve kimlik doğrulama: VPN'ler, verilerin güvenliğini sağlamak için güçlü şifreleme yöntemleri kullanır. Ayrıca, VPN istemcisi ve sunucusu arasında kimlik doğrulama işlemi gerçekleştirilir. Bu, yetkisiz erişimi ve veri ihlallerini önlemeye yardımcı olur.
    
4.  Tünelleme protokolleri: VPN'ler, verilerin İnternet üzerinden güvenli bir şekilde iletilmesi için tünelleme protokolleri kullanır. Bu protokoller, verileri şifreleyerek ve paketlere bölerek güvenli bir tünel oluşturur. En popüler tünelleme protokolleri arasında OpenVPN, L2TP/IPsec ve IKEv2/IPsec bulunmaktadır.
    
5.  IP gizleme: VPN'ler, kullanıcıların gerçek IP adreslerini gizleyerek ve VPN sunucusunun IP adresi ile değiştirerek anonimlik sağlar. Bu, kullanıcıların çevrimiçi etkinliklerinin izlenmesini ve coğrafi kısıtlamaların aşılmasını sağlar.
    

VPN'ler, İnternet üzerinde güvenli, şifreli ve anonim bir şekilde iletişim kurmak için kullanılan önemli bir ağ teknolojisidir. İşletmeler ve bireysel kullanıcılar, VPN'leri kullanarak veri güvenliğini ve gizliliğini artırabilir ve coğrafi kısıtlamaları aşarak küresel erişimi sağlayabilir.

## 21. Ağ topolojileri (yıldız, halka, otobüs, ağaç) hakkında bilgi verin.

Ağ topolojisi, bir ağın fiziksel ve mantıksal düzenini ifade eder. Farklı ağ topolojileri, cihazların ve kablolamanın nasıl düzenlendiğine ve veri paketlerinin ağ üzerinde nasıl iletilip alındığına dair bilgi sağlar. İşte en yaygın ağ topolojilerinden bazıları ve bunların özellikleri:

1.  Yıldız topolojisi: Yıldız topolojisinde, tüm cihazlar (istemciler ve sunucular) merkezi bir cihaz (genellikle bir anahtar veya yönlendirici) ile bağlantılıdır. Merkezi cihaz, ağ üzerinde veri iletimini yönetir ve tüm bağlantıları kontrol eder. Yıldız topolojisinin avantajları arasında basit tasarım, kolay hata tespiti ve merkezi yönetim bulunur. Dezavantajları ise merkezi cihazın tek bir hata noktası olması ve daha fazla kablolama gerektirmesidir.
    
2.  Halka topolojisi: Halka topolojisinde, cihazlar bir döngü veya halka şeklinde bağlanır ve veri paketleri saat yönünde veya saat yönünün tersine doğru hareket eder. Her cihaz, iletilen veriyi alır, işler ve sonraki cihaza iletir. Halka topolojisinin avantajları arasında az kablolama ve düşük gecikme süreleri bulunur. Dezavantajları ise arızalı bir cihazın tüm ağı etkileyebilmesi ve genişletilmesinin zor olmasıdır.
    
3.  Otobüs topolojisi: Otobüs topolojisinde, tüm cihazlar tek bir iletim ortamına (genellikle bir koaksiyel kablo) bağlanır ve bu ortam üzerinde veri paketleri ileri ve geri hareket eder. Otobüs topolojisinin avantajları arasında basit yapı, düşük maliyet ve kolay kurulum bulunur. Dezavantajları ise ağ üzerindeki trafik yoğunluğunun performansı düşürebilmesi ve arıza tespitinin zor olmasıdır.
    
4.  Ağaç topolojisi: Ağaç topolojisi, yıldız topolojisinin bir varyasyonudur ve genellikle büyük, dağıtılmış ağlar için kullanılır. Ağaç topolojisinde, merkezi cihazlar (anahtarlar veya yönlendiriciler) yıldız topolojisi şeklinde birbirine bağlanır ve daha sonra her bir merkezi cihaz, alt düzeydeki cihazlara yıldız topolojisi kullanarak bağlanır. Ağaç topolojisinin avantajları arasında genişletilebilirlik, merkezi yönetim ve modüler yapı bulunur. Dezavantajları ise daha fazla kablolama gerektirmesi ve merkezi cihazların tek hata noktası olarak kabul edilmesidir.

Ağ topolojilerini seçerken ve tasarlarken, ağın boyutu, performans gereksinimleri, güvenilirlik, maliyet ve yönetilebilirlik gibi faktörler dikkate alınmalıdır. Farklı ağ topolojilerinin avantajları ve dezavantajları, belirli bir ağın ihtiyaçlarına ve hedeflerine göre değerlendirilmelidir.

Sonuç olarak, ağ topolojileri, ağın fiziksel ve mantıksal düzenini ifade eden yapılarıdır. Yıldız, halka, otobüs ve ağaç topolojileri gibi çeşitli ağ topolojileri, veri iletişiminin ve ağ yönetiminin nasıl gerçekleştirileceğine dair farklı yöntemler sunar. Bu topolojiler arasında seçim yaparken, ağın özel ihtiyaçlarına ve hedeflerine göre en uygun çözümü belirlemek önemlidir.


## 22.  Ağ segmentasyonu ve alt ağ maskesi kullanmanın avantajları nelerdir?

Ağ segmentasyonu ve alt ağ maskesi kullanmanın avantajları şunlardır:

1.  Geliştirilmiş güvenlik: Ağ segmentasyonu, ağınızdaki farklı bölümler arasında güvenlik duvarları ve erişim kontrol listeleri kullanarak daha fazla güvenlik sağlar. Bu, hassas bilgilerin sızmasını önlemeye ve zararlı yazılımların yayılmasını sınırlamaya yardımcı olur.
    
2.  Performansın artırılması: Ağ segmentasyonu, daha küçük ve yönetilebilir alt ağlara bölünmüş bir ağda veri trafiğinin yerel kalmasını sağlar. Bu, ağ trafiğini azaltır, gecikme sürelerini düşürür ve genel performansı iyileştirir.
    
3.  Trafik yönetimi: Segmentasyon ve alt ağ maskesi kullanarak, ağ yöneticileri trafiği daha etkin bir şekilde yönetebilir ve önceliklendirebilir. Bu, ağ üzerindeki yükü hafifletir ve önemli uygulamaların daha hızlı çalışmasını sağlar.
    
4.  Kusurlu etki alanının sınırlandırılması: Ağ segmentasyonu, bir ağ kesintisi veya hata durumunda etkilenen kullanıcıların ve cihazların sayısını azaltmaya yardımcı olur. Bu, sorunun daha hızlı teşhis edilmesine ve çözülmesine olanak tanır ve ağın geri kalanının çalışmaya devam etmesini sağlar.
    
5.  Büyüme ve ölçeklendirme: Ağ segmentasyonu ve alt ağ maskesi kullanarak, ağınızı daha kolay büyütebilir ve ölçeklendirebilirsiniz. Bu, şirketinizin ve ağınızın ihtiyaçları değiştikçe ağınızı kolayca genişletmenize ve yapılandırmanıza olanak tanır.
    
6.  Daha iyi ağ yönetimi: Segmentasyon ve alt ağ maskesi kullanarak, ağ yöneticileri ağ üzerinde daha fazla kontrol ve esneklik sağlar. Bu, ağ yapılandırmasının daha düzenli ve daha iyi yönetilmesine yardımcı olur ve ağın genel işleyişini ve güvenilirliğini artırır.
    

Sonuç olarak, ağ segmentasyonu ve alt ağ maskesi kullanmanın avantajları, ağ güvenliğinin, performansının ve yönetiminin geliştirilmesine yardımcı olurken, aynı zamanda ağın büyüme ve ölçeklendirme ihtiyaçlarına uyum sağlar. Bu teknikler, modern ağlarda verimlilik ve güvenliği sağlamak için önemli araçlardır.

## 23.  Bilgisayar ağlarında çeşitli gecikme türlerini açıklayın: iletim gecikmesi, işleme gecikmesi ve yayılım gecikmesi.

Bilgisayar ağlarında çeşitli gecikme türleri şunlardır:

1.  İletim gecikmesi: İletim gecikmesi, bir cihazın paketleri ağ üzerinden gönderirken yaşadığı gecikmedir. Bu gecikme, paketin boyutuna, ağ bağlantısının bant genişliğine ve diğer faktörlere bağlı olarak değişir. İletim gecikmesi, paketin başlangıcından bitişine kadar geçen süreyi ifade eder ve genellikle milisaniye (ms) cinsinden ölçülür. Büyük paketlerin gönderilmesi ve düşük bant genişlikli bağlantılar, iletim gecikmesini artırır.
    
2.  İşleme gecikmesi: İşleme gecikmesi, bir cihazın (örneğin yönlendirici veya anahtar) paketi işleme sürecinde yaşadığı gecikmedir. Bu süreç, paketin hedef adresini belirlemek, hata kontrolünü gerçekleştirmek ve paketi ileri yönlendirmek için doğru çıkış bağlantısını seçmek gibi işlemleri içerir. İşleme gecikmesi, cihazın donanım ve yazılım performansına, işlemci yüküne ve ağ trafiğine bağlı olarak değişir. İşleme gecikmesi de genellikle milisaniye cinsinden ölçülür.
    
3.  Yayılım gecikmesi: Yayılım gecikmesi, bir paketin ağ üzerinde bir noktadan diğerine yayılma süresidir. Bu gecikme, sinyalin iletilme hızına ve ağdaki mesafeye bağlıdır. Yayılım gecikmesi, paketin bir cihazdan diğerine fiziksel olarak iletilmesi için geçen süreyi ifade eder ve genellikle milisaniye cinsinden ölçülür. Yayılım gecikmesi, ağın fiziksel uzunluğu ve sinyallerin yayılma hızıyla doğru orantılıdır.
    

Bu gecikme türleri, bilgisayar ağlarında veri iletiminin genel gecikmesine katkıda bulunur. Genellikle, uygulamaların ve kullanıcıların veri iletiminde düşük gecikme sürelerine ihtiyacı vardır. Bu nedenle, ağ mühendisleri ve yöneticileri, iletim, işleme ve yayılım gecikmelerini en aza indirmek için ağ tasarımı ve yapılandırması üzerinde çalışır.


## 24.  Tıkanıklık kontrolü nedir ve ağ performansı üzerindeki etkisi nedir?

Tıkanıklık kontrolü, bilgisayar ağlarında veri trafiğinin yoğunluğunu yönetmek için kullanılan bir mekanizmadır. Tıkanıklık kontrolü, ağ üzerindeki kaynakları (örneğin bant genişliği ve yönlendiricilerin işlem kapasitesi) en uygun şekilde kullanarak, veri paketlerinin kaybolmasını ve hizmet kalitesinin düşmesini önlemeye çalışır. Tıkanıklık kontrolü, ağın performansını ve güvenilirliğini artırmak ve uygun veri akış hızını sağlamak için önemlidir.

Tıkanıklık kontrolünün ağ performansı üzerindeki etkisi şunlardır:

1.  Paket kaybının azaltılması: Tıkanıklık kontrolü, ağ üzerindeki veri trafiğini düzenleyerek paket kaybının önlenmesine yardımcı olur. Bu, ağ üzerindeki veri akışının daha güvenilir olmasını sağlar.
    
2.  Düşük gecikme süreleri: Tıkanıklık kontrolü, ağdaki veri trafiğinin düzgün dağıtılmasını sağlayarak gecikme sürelerini düşürür. Bu, daha hızlı veri iletimi ve daha iyi bir kullanıcı deneyimi sağlar.
    
3.  Adil kaynak paylaşımı: Tıkanıklık kontrolü, ağ kaynaklarının (örneğin bant genişliği) adil bir şekilde dağıtılmasını sağlar. Bu, tüm kullanıcıların ve uygulamaların ağ üzerindeki kaynaklara uygun şekilde erişebilmesine olanak tanır.
    
4.  Ağ istikrarının sağlanması: Tıkanıklık kontrolü, ağ üzerindeki yoğun trafiği yöneterek ağın istikrarını korur. Bu, ağın sürekli olarak yüksek performanslı ve güvenilir kalmasına yardımcı olur.
    

Tıkanıklık kontrolü, ağ protokolleri (örneğin TCP) tarafından gerçekleştirilir. TCP tıkanıklık kontrolü, paket kaybı ve gecikme sürelerini gözlemleyerek ağdaki tıkanıklığı tespit eder ve veri akışını buna göre ayarlar. Bu şekilde, ağ üzerindeki veri trafiği düzgün bir şekilde yönetilir ve ağ performansı optimize edilir.


## 25.  Çok katmanlı anahtarlamayı açıklayın ve kullanım alanlarını belirtin.

Çok katmanlı anahtarlamayı (multi-layer switching), ağ trafiğini yönlendiren ve yöneten bir anahtarlamadır. Bu anahtarlamada veri trafiği, OSI modelinde farklı katmanlar arasında etkili bir şekilde yönlendirilir. Temel olarak, çok katmanlı anahtarlamada ağ katmanı (Katman 3) ve veri bağlantı katmanı (Katman 2) işlevleri bir arada kullanılır. Bu, hem hızlı ve verimli anahtarlamayı hem de ağ yönlendirmesi için gelişmiş özellikleri sağlar.

Çok katmanlı anahtarlamayı kullanmanın avantajları şunlardır:

1.  Yüksek performans: Çok katmanlı anahtarlamayla, ağ cihazları (örneğin yönlendiriciler ve anahtarlar) daha hızlı ve daha verimli bir şekilde çalışır. Bu, veri trafiğinin daha hızlı ve düşük gecikme süreleriyle yönlendirilmesine olanak tanır.
    
2.  Daha iyi ölçeklenebilirlik: Çok katmanlı anahtarlamayı kullanan ağlar, büyümeye ve değişime daha iyi uyum sağlayabilir. Bu, ağ yöneticilerinin daha büyük ve daha karmaşık ağlar oluşturmasına ve yönetmesine olanak tanır.
    
3.  Gelişmiş ağ yönetimi: Çok katmanlı anahtarlamayla, ağ yöneticileri daha etkili bir şekilde ağ trafiğini yönlendirebilir ve yönetebilir. Bu, ağ üzerindeki kaynakların daha iyi kullanılmasına ve ağın daha iyi performans göstermesine olanak tanır.
    
4.  Güvenlik ve politika uygulama: Çok katmanlı anahtarlamayı kullanan ağ cihazları, ağ trafiğini daha hassas bir şekilde kontrol etme ve yönlendirme yeteneğine sahiptir. Bu, ağ güvenliğinin ve politika uygulamasının daha iyi sağlanmasına yardımcı olur.
    

Çok katmanlı anahtarlamayı kullanmanın tipik kullanım alanları şunlardır:

1.  Büyük ölçekli kurumsal ağlar: Çok katmanlı anahtarlamayı kullanan ağlar, büyük ölçekli kurumsal ağların karmaşıklığı ve ölçeğini daha iyi yönetebilir.
    
2.  Veri merkezi ağları: Veri merkezlerinde, çok katmanlı anahtarlamayla yüksek hızlı ve düşük gecikmeli ağ bağlantıları sağlanır.
    
3.  İnternet servis sağlayıcıları (ISP): İnternet servis sağlayıcıları, çok katmanlı anahtarlamayı kullanarak geniş kapsamlı ağları yönetir ve müşterilere hizmet sunar.

4.  Kampüs ağları: Üniversiteler ve kurumlar, çok katmanlı anahtarlamayı kullanarak büyük ve karmaşık kampüs ağları oluşturur ve yönetir. Bu sayede, öğrencilere, öğretim üyelerine ve çalışanlara daha hızlı ve güvenilir erişim sağlayarak, veri iletişimi, işbirliği ve kaynak paylaşımını geliştirirler. Çok katmanlı anahtarlamayı kullanan kampüs ağları, ağ trafiğinin yönlendirilmesinde ve yönetilmesinde daha verimli olurken, aynı zamanda güvenliği ve politika uygulamasını da güçlendirir.

5.  Bulut hizmetleri ve ağları: Çok katmanlı anahtarlamayı kullanan bulut hizmet sağlayıcıları, kullanıcıların uygulamalarına ve verilerine hızlı ve güvenilir erişim sağlamak için yüksek performanslı ağ altyapıları oluşturur ve yönetir.
    
6.  Telekomünikasyon ağları: Telekom operatörleri, çok katmanlı anahtarlamayı kullanarak geniş coğrafi bölgelerde veri, ses ve video hizmetleri sunar.
    
7.  Nesnelerin İnterneti (IoT) ağları: IoT cihazları arasındaki iletişimi yönetmek ve denetlemek için çok katmanlı anahtarlamayı kullanan ağlar, IoT uygulamalarının ölçeklenebilirliğini ve güvenilirliğini artırır.
    

Sonuç olarak, çok katmanlı anahtarlamayı kullanan ağlar, veri trafiğinin yönlendirilmesinde ve yönetilmesinde daha etkili ve verimli olur. Bu, ağ performansını ve ölçeklenebilirliğini artırırken, güvenliği ve politika uygulamasını da güçlendirir. Çok katmanlı anahtarlamayı kullanarak, ağ yöneticileri ve operatörleri, daha hızlı, güvenilir ve esnek ağ altyapıları oluşturarak daha iyi hizmet sunabilir.

## 26.  Farklı hizmet seviyesi anlaşması (SLA) parametrelerini açıklayın.

Hizmet Seviyesi Anlaşması (SLA) parametreleri, bir hizmet sağlayıcısı ile müşteri arasında hizmetin kalitesi ve performansının ölçülmesi ve takibi için belirlenen metriklerdir. Bu parametreler, hizmetin düzeyini ve müşterinin beklentilerini netleştirmeye yardımcı olur. İşte bazı yaygın SLA parametreleri:

1.  Kullanılabilirlik: Bir hizmetin sürekli olarak ne kadar süreyle çalışır durumda olduğunu ölçen bir yüzde değeri. Genellikle "yüzde 99,9 kullanılabilirlik" gibi ifade edilir.
    
2.  Yanıt süresi: Hizmet sağlayıcısının bir isteği işleme koyma veya tamamlama süresi. Örneğin, bir müşteri desteği talebine verilen yanıt süresi.
    
3.  Veri iletim hızı: Verinin ağ üzerinden ne kadar hızlı aktarıldığını belirten bir ölçüm. Bu, genellikle Mbps (megabit/saniye) veya Gbps (gigabit/saniye) cinsinden ifade edilir.
    
4.  Paket kaybı: Ağ üzerinden gönderilen veri paketlerinin başarılı bir şekilde ulaşamama oranı. Bu oran, genellikle ağ kalitesi ve güvenilirliği hakkında bilgi verir.
    
5.  Gecikme: Ağ üzerinden veri iletiminin ne kadar sürede gerçekleştiğini ölçen bir süre. Genellikle milisaniye (ms) cinsinden ifade edilir.
    
6.  Hata oranı: İşlemlerde meydana gelen hataların sayısını ve oranını ölçen bir metrik. Bu, genellikle hizmet sağlayıcının hizmetlerinin ne kadar güvenilir olduğunu gösterir.
    
7.  Çözüm süresi: Bir sorunun tespit edilmesinden çözülmesine kadar geçen süre. Bu süre, hizmet sağlayıcının müşterinin sorunlarını ne kadar hızlı çözdüğünü gösterir.
    
8.  İş sürekliliği ve felaket kurtarma: Hizmet sağlayıcının doğal afetler, siber saldırılar veya başka tür felaketler sonrasında hizmetleri ne kadar hızlı ve etkili bir şekilde yeniden başlatabildiğini gösteren metrikler.
    
9.  Müşteri memnuniyeti: Müşterilerin hizmet sağlayıcısından aldıkları hizmetlerin kalitesi hakkındaki geri bildirimlerini ölçen bir değerlendirme. Bu, genellikle anketler ve değerlendirmeler aracılığıyla ölçülür.

10.  SLA uyum oranı: Hizmet sağlayıcısının SLA parametrelerine ne kadar sıkı bir şekilde uyduğunu gösteren bir metrik. Bu, hizmet sağlayıcının hizmet kalitesi ve müşteri memnuniyeti açısından ne kadar güvenilir olduğunu gösterir.
    
11.  Kapasite: Bir hizmet sağlayıcının, müşteri taleplerini karşılamak için ne kadar kaynak sağlayabileceğini ölçen bir parametre. Bu, özellikle büyük ölçekli projeler ve yüksek hacimli veri trafiği durumlarında önemlidir.
    
12.  Ölçeklenebilirlik: Hizmet sağlayıcısının, müşterinin gereksinimlerine göre hizmetleri ve kaynakları nasıl artırabileceğini veya azaltabileceğini gösteren bir metrik. Bu, bir işletmenin büyümesi ve değişen ihtiyaçlarına göre hizmet sağlayıcının ne kadar esnek olduğunu gösterir.

## 27.  Sayısal ve analog sinyaller arasındaki temel farklar nelerdir? Ağlarda nasıl kullanılır?

Sayısal ve analog sinyaller, veri iletiminde kullanılan iki farklı sinyal türüdür. Her ikisi de ağlarda bilgi taşımak için kullanılır, ancak farklı özelliklere ve kullanım alanlarına sahiptir.

Sayısal sinyaller:

1.  Sayısal sinyaller, sürekli olmayan ve ayrık değerlerle ifade edilen sinyallerdir.
2.  Genellikle ikili (0 ve 1) biçiminde temsil edilir ve dijital veri iletimi için kullanılır.
3.  Sayısal sinyaller, hatalara ve parazite karşı daha dayanıklıdır. Hatalı veri iletimi durumunda, hatalar düzeltilip tespit edilebilir.
4.  Sayısal sinyaller daha yüksek bant genişliği ve veri aktarım hızlarına olanak tanır.
5.  Dijital teknolojilerin yaygınlaşmasıyla, sayısal sinyaller günümüzde ağlarda daha yaygın olarak kullanılmaktadır.

Analog sinyaller:

1.  Analog sinyaller, sürekli ve kesintisiz değerlere sahip olan sinyallerdir.
2.  Genellikle gerçek dünya olaylarından, örneğin ses ve ışık gibi fiziksel niceliklerden türetilir.
3.  Analog sinyaller, parazit ve gürültüye daha duyarlıdır ve bu nedenle iletim sırasında kalite kaybı yaşayabilirler.
4.  Analog sinyaller genellikle düşük bant genişliği ve veri aktarım hızlarına sahiptir.
5.  Telefon hatları ve radyo frekansları gibi eski iletişim sistemlerinde analog sinyaller yaygın olarak kullanılır.

Ağlarda kullanımı: Analog sinyaller, esas olarak eski telefon hatları, radyo frekansları ve televizyon yayınları gibi eski iletişim sistemlerinde kullanılır. Sayısal sinyaller ise günümüzde Ethernet, Wi-Fi, optik fiber ve diğer modern ağ teknolojilerinde kullanılır. Analog sinyaller, sayısal sistemlere entegre edilmeden önce analog-dijital dönüştürücüler (ADC) aracılığıyla sayısal sinyallere dönüştürülür ve tam tersi için de dijital-analog dönüştürücüler (DAC) kullanılır.

## 28.  TCP'nin aşırı yüklenme kontrol mekanizmalarından (congestion control mechanisms) bahsedin: slow start, congestion avoidance, fast retransmit ve fast recovery.

TCP'nin aşırı yüklenme kontrol mekanizmaları, ağlardaki tıkanıklığın azaltılması ve veri iletiminin optimize edilmesi için tasarlanmıştır. Bu mekanizmalar, veri iletiminin hızını ve güvenilirliğini artırmak için çalışır ve aşağıdaki şekilde tanımlanabilir:

1.  Slow Start (Yavaş Başlangıç): Slow Start, bir bağlantının başlangıcında gönderim hızını kademeli olarak artıran bir mekanizmadır. Bu, gönderici tarafından gönderilebilecek maksimum segment boyutunu (MSS) kullanarak başlar ve her başarılı ACK (acknowledgement) için gönderim hızını iki katına çıkarır. Bu süreç, gönderici tarafından belirlenen bir eşik değerine ulaşıldığında sona erer. Slow Start, aşırı yüklenmeyi önlemek ve ağın taşıyabileceği veri miktarını belirlemek için kullanılır.
    
2.  Congestion Avoidance (Tıkanıklık Önleme): Congestion Avoidance, Slow Start eşiğine ulaşıldığında devreye girer ve gönderim hızının daha kontrollü bir şekilde artmasını sağlar. Her başarılı ACK için, gönderim hızı daha az hızlı artar (genellikle her round-trip time (RTT) boyunca bir MSS kadar artar). Eğer tıkanıklık tespit edilirse, eşik değeri yarıya düşürülür ve Slow Start yeniden başlar.
    
3.  Fast Retransmit (Hızlı Yeniden Gönderme): Fast Retransmit, ağda paket kaybı olduğunda devreye giren bir mekanizmadır. Gönderici, aynı ACK numarasının belirli bir sayıda (genellikle üç) tekrar alınmasını tespit ettiğinde, paketin kaybolduğunu varsayar ve kayıp paketi hemen yeniden gönderir. Bu, zaman aşımı sürelerini beklemeye gerek kalmadan paket kayıplarının düzeltilmesine olanak tanır.
    
4.  Fast Recovery (Hızlı Kurtarma): Fast Recovery, Fast Retransmit ile birlikte çalışarak tıkanıklığın hızlı bir şekilde düzeltilmesini sağlar. Fast Recovery sırasında, gönderici eşik değerini yarıya düşürür ve gönderim hızını bu yeni değere ayarlar. Daha sonra, Congestion Avoidance algoritması devreye girer ve gönderim hızını yavaşça artırır. Bu süreç, kayıp paketin ACK'sı alındığında sona erer ve gönderici normal iletimine devam eder.
    

Bu dört mekanizma, TCP'nin aşırı yüklenme kontrol stratejisinin temel bileşenleridir ve ağ performansını optimize etmek için birlikte çalışır. Bu sayede, ağ kaynaklarının etkili kullanımı sağlanır ve tıkanıklık durumlarında daha hızlı ve güvenilir bir iletim süreci gerçekleştirilir. Ağ tıkanıklığının azaltılması ve veri iletiminin optimize edilmesi, kullanıcı deneyimini ve uygulama performansını iyileştirir.

TCP'nin aşırı yüklenme kontrol mekanizmalarının başarılı bir şekilde uygulanması, ağlardaki kaynak kullanımını dengeler ve veri akışını düzenler. Bu süreç, ağ trafiğini analiz etmek ve uygun gönderim hızlarını belirlemek için sürekli olarak geri bildirim sağlar. Ayrıca, ağda yaşanan kaynak sınırlamaları ve tıkanıklıkların etkisini en aza indirerek, ağda daha verimli bir şekilde çalışılmasına yardımcı olur.

Sonuç olarak, TCP'nin aşırı yüklenme kontrol mekanizmaları, ağlarda tıkanıklığın azaltılması ve veri iletiminin optimize edilmesi için kritik öneme sahiptir. Bu mekanizmalar, ağ performansını artırmak, kaynak kullanımını optimize etmek ve kullanıcı deneyimini iyileştirmek için birlikte çalışır. Ağ yöneticileri ve mühendisleri, bu mekanizmaların işleyişini anlamak ve doğru şekilde uygulamak suretiyle, ağların daha güvenilir ve etkili bir şekilde çalışmasını sağlayabilirler.

## 29. Kablosuz ağlarda kullanılan IEEE 802.11 aile standartları hakkında bilgi verin: 802.11a, 802.11b, 802.11g, 802.11n ve 802.11ac.

IEEE 802.11 ailesi, kablosuz yerel alan ağları (WLAN) için geliştirilmiş standartlardır. İlk olarak 1997'de yayınlanan bu standartlar, sürekli olarak geliştirilerek farklı özellikler ve performans seviyeleri sunmaktadır. İşte kablosuz ağlarda kullanılan IEEE 802.11 aile standartlarından bazıları:

1.  802.11a: 1999 yılında tanıtılan bu standart, 5 GHz frekans bandında çalışır ve OFDM (Orthogonal Frequency-Division Multiplexing) modülasyon tekniği kullanır. 802.11a, teorik olarak maksimum 54 Mbps veri hızına ulaşabilir. Bu standart, 2.4 GHz bandındaki parazitlere duyarlı olmayan bir seçenek sunar, ancak daha kısa menzil ve daha düşük duvar penetrasyonu sağlar.
    
2.  802.11b: 1999'da tanıtılan bu standart, 2.4 GHz frekans bandında çalışır ve DSSS (Direct Sequence Spread Spectrum) modülasyon tekniğini kullanır. 802.11b, maksimum 11 Mbps veri hızına ulaşabilir ve daha uzun menzil sunar. Ancak, 2.4 GHz bandındaki diğer cihazlarla (ör. mikrodalga fırınlar ve kablosuz telefonlar) parazit riski taşır.
    
3.  802.11g: 2003'te tanıtılan bu standart, 2.4 GHz frekans bandında çalışır ve OFDM modülasyon tekniği kullanır. 802.11g, 802.11a'nın hız avantajlarını (maksimum 54 Mbps) 802.11b'nin menzil avantajlarıyla birleştirir. 802.11b ile geriye dönük uyumludur, ancak yine de 2.4 GHz bandındaki parazit sorunlarına maruz kalabilir.
    
4.  802.11n: 2009'da tanıtılan bu standart, hem 2.4 GHz hem de 5 GHz frekans bantlarında çalışabilir ve MIMO (Multiple Input Multiple Output) teknolojisini kullanır. 802.11n, teorik olarak maksimum 600 Mbps veri hızına ulaşabilir ve daha geniş kapsama alanı ve daha iyi duvar penetrasyonu sağlar. 802.11a, 802.11b ve 802.11g ile geriye dönük uyumludur.
    
5.  802.11ac: 2013'te tanıtılan bu standart, 5 GHz frekans bandında çalışır ve çoklu kullanıcı MIMO (MU-MIMO) teknolojisini destekler. 802.11ac, teorik olarak maksimum 1300 Mbps (Gigabit) veri hızına ulaşabilir ve daha yüksek hız, daha geniş kapsama alanı ve daha iyi performans sunar. 802.11n ile geriye dönük uyumludur, ancak eski 802.11 standartlarıyla (802.11a, 802.11b ve 802.11g) doğrudan uyumlu değildir.

IEEE 802.11 aile standartları sürekli olarak geliştirilmekte ve yeni standartlar ortaya çıkmaktadır. Örneğin, 802.11ax (Wi-Fi 6) ve 802.11ay gibi daha yeni standartlar, daha yüksek hızlar, daha fazla kullanıcı kapasitesi ve enerji verimliliği sunarak kablosuz ağ performansını daha da artırmaktadır. Bu standartların her biri, kablosuz ağların hız, menzil, kapasite ve güvenilirliğini geliştirmek için tasarlanmıştır ve belirli kullanım senaryoları ve gereksinimler için farklı avantajlar sunar.


## 30.  SDN (Software-Defined Networking) nedir ve ağ yönetimi üzerinde nasıl bir etkisi vardır?

SDN (Software-Defined Networking), ağ donanımı ve yazılımı arasında bir ayrım sağlayarak ağ yönetimini ve yapılandırmasını merkezi bir kontrol düzleminden gerçekleştirmeyi amaçlayan bir ağ mimarisidir. Geleneksel ağ yönetiminde, ağ cihazları (yönlendiriciler, anahtarlar vb.) özelleştirilmiş donanım ve içerisinde yönetim yazılımı bulunan özel cihazlardır. Bu, ağların yapılandırılması ve yönetimi için cihaz bazında manuel müdahaleler gerektirir ve esneklik ve ölçeklenebilirlik açısından sınırlamalar yaratır.

SDN, ağ kontrolünü ve yönetimini merkezi bir denetleyiciye (SDN Controller) taşır. Bu denetleyici, tüm ağ donanımıyla iletişim kurar ve yönlendirme, güvenlik ve ağ politikalarının tutarlı ve merkezi bir şekilde uygulanmasını sağlar. Ağ donanımı, kontrol düzlemi ve veri düzlemi arasında bir ayrım yaparak, donanımdan bağımsız olarak ağları yapılandırmayı ve yönetmeyi mümkün kılar.

SDN'nin ağ yönetimi üzerindeki etkileri şunlardır:

1.  Esneklik: Ağ yapılandırmasının ve yönetiminin merkezi hale gelmesi sayesinde, ağlarda değişiklik yapmak ve yeni hizmetler eklemek daha hızlı ve kolay hale gelir.
2.  Ölçeklenebilirlik: SDN, donanımdan bağımsız olarak ağları genişletme ve küçültme yeteneği sağlar, bu da büyük ölçekli ve karmaşık ağların yönetilmesini kolaylaştırır.
3.  Maliyet tasarrufu: Donanım ve yazılımın ayrılması, daha az özel donanıma bağımlılık ve daha düşük maliyetlerle daha fazla ağ fonksiyonunun gerçekleştirilmesini sağlar.
4.  Güvenlik: Merkezi ağ yönetimi, ağ politikalarının ve güvenlik kurallarının daha kolay ve tutarlı bir şekilde uygulanmasını sağlar.
5.  Yenilikçilik: Ağlar ve hizmetler için açık standartlar ve API'ler kullanarak, üçüncü taraf yazılım geliştiricilerin yeni ve yenilikçi hizmetler oluşturmasını ve ağlar üzerinde çalıştırmasını kolaylaştırır.

SDN, ağ yönetimi ve yapılandırması için daha hızlı, esnek ve ölçeklenebilir bir yaklaşım sunarak, IT altyapısının ve hizmetlerinin daha etkili ve verimli bir şekilde sunulmasına olanak tanır.

