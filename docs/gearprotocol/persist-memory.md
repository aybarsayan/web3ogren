---
title: Persistent Memory
sidebar_label: Persistent Memory
sidebar_position: 10
---
# Kalıcı bellek (Persistent Memory)

Gear Protokolü'nün diğer bir ayırt edici özelliği Kalıcı bellek yaklaşımıdır. Bu, geliştirmeyi kolaylaştırır, karmaşıklığı azaltır ve protokol bellek yönetimini gerçek hayattaki donanım ve işletim sistemleriyle eşleştirir.

Gear Ağlarında çalışan programlar depolama kullanmaz, bunun yerine tam durumları kalıcı hale getirilir, bu da blockchain bağlamı için çok daha az API yüzeyi sağlar. Alan özgü dil özelliklerinden kaçınır ve daha karmaşık dil yapılarının kullanılmasına olanak tanır - kalıcı kapsülleri, gelecek kompozitörlerini vb.

Gear Protokolü, akıllı bir protokolün birinci sınıf sistem çağrıları olarak bellek ayırma ve bellek geri alma işlemlerini kullanır. Bellek erişimi de takip edilir ve yalnızca gereken sayfalar yüklenir/saklanır. Bu, blockchain'in durumunda saklanan akıllı sözleşmelerin heap'a ayrılan yığıt çerçevelerinin (genellikle geleceklerde ve onların bileşimcilerinde bulunanlar) sorunsuz bir şekilde kalıcı hale getirilmesine ve ihtiyaç duyulduğunda çağrılmasına olanak tanır ve talep üzerine durumlarını korur.

Program kodu, değiştirilemez bir Wasm veri yığını olarak depolanır. Her programın sabit bir bellek miktarı vardır ve bu bellek mesaj işleme arasında kalıcıdır (söz konusu statik alan).

Gear örneği, her program için ayrı bir bellek alanı tutar ve kalıcılığını garanti eder. Bir program, yalnızca kendi bellek alanı içinde okuma ve yazma yapabilir ve diğer programların bellek alanına erişemez. Her program için ayrı bellek alanı, başlatması sırasında ayrılmıştır ve ek bir ücret gerektirmez (programın başlatma ücretine dahildir).

Bir program, 64KB'lık bloklar halinde gereken bellek miktarını ayırabilir. Her bellek bloğu tahsisi gaz ücreti gerektirir. Her sayfa (64KB), dağıtılmış veritabanı arka uçta ayrı ayrı saklanır, ancak çalışma zamanında Gear düğümü sürekli bir çalışma zamanı belleği oluşturur ve programların yeniden yüklenmeden üzerinde çalışmasına olanak tanır.

# Bellek paralelliği (Memory Parallelism)

Program başına ayrı izole bellek alanı, bir Gear düğümünde mesaj işlemenin paralelleştirilmesine olanak sağlar. Paralel işleme akış sayısı, CPU çekirdek sayısına eşittir. Her akış, belirli bir program kümesi için hedeflen

en mesajları işler. Bu, diğer programlardan veya dışardan (kullanıcı işlemleri) gönderilen mesajları içerir.

Örneğin, 100 farklı programa hedeflenen mesajları içeren bir mesaj kuyruğu düşünelim ve 2 işleme akışına sahip bir ağda çalışan Gear düğümüne sahip olalım. Gear motoru, çalışma zamanında tanımlanan bir akış sayısını (tipik bir doğrulayıcı makinedeki CPU çekirdek sayısıyla eşit) kullanarak toplam hedeflenen program miktarını akış sayısına böler ve her akış için bir mesaj havuzu oluşturur (her akışta 50 program).

Programlar ayrı akışlara dağıtılır ve her mesaj, hedeflenen programının tanımlandığı bir akışta görünür. Bu nedenle, belirli bir programa yönelik tüm mesajlar tek bir işleme akışında görünür.

Her döngüde hedeflenen bir program birden fazla mesaj içerebilir ve bir akış, birçok program için mesajları işler. Mesaj işleme sonucu, her akıştan gelen yeni mesajlar, mesaj kuyruğuna eklenir ve döngü tekrarlanır. Mesaj işleme sırasında oluşturulan sonuç mesajları genellikle başka bir adrese gönderilir (kökene geri dönüş veya bir sonraki programa).

![alt text](../../static/img/gear/message-parallelism.jpg)