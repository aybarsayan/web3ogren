---
title: Eşsiz Düğüm Listesi (UNL)
seoTitle: Eşsiz Düğüm Listesi ile XRP Ledger Güvenliği
sidebar_position: 4
description: Eşsiz Düğüm Listesi (UNL), bir XRP Ledger sunucusunun güvendiği doğrulayıcıları tanımlar ve konsensüs süreçleri ile sunucu operasyonlarını etkiler. Bu belge, UNLnin önemini, sunucu örtüşmeleri ile ilgili potansiyel problemleri ve doğrulayıcıları önerilen listelere dahil etmeye yönelik yönergeleri açıklamaktadır.
tags: 
  - Eşsiz Düğüm Listesi
  - XRP Ledger
  - doğrulayıcılar
  - konsensüs
  - önerilen listeler
  - sunucu operatörleri
  - ağ güvenliği
keywords: 
  - Eşsiz Düğüm Listesi
  - XRP Ledger
  - doğrulayıcılar
  - konsensüs
  - önerilen listeler
  - sunucu operatörleri
  - ağ güvenliği
---

# Eşsiz Düğüm Listesi (UNL)

Bir _eşsiz düğüm listesi_ (UNL), bir sunucunun birlikte hareket etmeyeceğine güvendiği doğrulayıcıların listesidir. Her XRP Ledger sunucusu, hangi doğrulama oylarına kulak vereceğini ve hangi oyları konsensüs sürecinde dışlayacağını belirleyen bir UNL ile yapılandırılmıştır. Tasarım gereği, bir UNL'deki her girdi bağımsız bir varlığı temsil etmeli; bu bir işyeri, bir üniversite, başka bir tür organizasyon veya sadece bir bireysel hobi sahibi olabilir. **Her girdinin ayrı bir varlık olması sayesinde, hiç kimse ağın normal çalışmasını sağlama sorumluluğunun en az bir payından fazlasını üstlenmez.**

:::info
Doğrulayıcıların tarafsız olması ve her işlemi teknolojinin sınırlamaları içinde **mümkün olan en kısa sürede** işlemeleri amaçlanmaktadır.
:::

> **"Doğrulayıcılar, keyfi nedenlerle bazı işlemleri engelleyemez veya sansürleyemez."**  
> — XRP Ledger Geliştirme Kılavuzu

Doğrayıcıların mümkün olduğunca çevrimiçi ve çalışır durumda olmaları gerekir. Ancak, XRP Ledger, hem ağda hem de doğrulayıcılarda hatalar olmasına izin verecek şekilde tasarlanmıştır. Bazı doğrulayıcılar çevrimdışı, yanlış yapılandırılmış, hatalı veya kesinlikle kötü niyetli olsa bile, ağın çoğunluğu normal çalışıyorsa yine de ilerleme kaydetmesi gerekir ve ağ, kurallara veya geçmişteki ağ geçmişine aykırı işlemleri, yalnızca bir süper çoğunluk (> %80) uzlaşmışsa onaylamayacaktır. Bu noktaları göz önünde bulundurursak, bir UNL'deki doğrulayıcılar, birçok doğrulayıcının aynı şekilde aynı anda başarısız olması veya kötü niyetli nedenlerle birlikte hareket etme olasılığını **en aza indirmek** için seçilir.

---

## UNL Örtüşmesi

Her sunucu operatörü, UNL'lerinde hangi doğrulayıcıların bulunacağı üzerinde tam kontrole sahiptir. **Ancak, iki sunucu tamamen farklı UNL'ler ile çalışıyorsa, defterlerin (ve içlerindeki işlemlerin) ne zaman geçerli olduğu ile ilgili farklı sonuçlara ulaşmaları olasıdır.** 

:::warning
Bu, ağda bir _çatal_ (fork) oluşmasına yol açabilir. Çatallamayı önlemek için XRP Ledger sunucularının, diğerleriyle yüksek derecede örtüşen UNL'ler ile yapılandırılması gerekir.
:::

Başlangıçta, iki sunucunun UNL'leri arasında %60 örtüşmenin, bu sunucuların çatallanmalarını önlemek için yeterli olduğu düşünülüyordu. Ancak, `daha fazla araştırma`, en kötü senaryoda %90 örtüşmenin bir çatallamayı önlemek için gerekli olduğunu gösterdi. Bu, sunucu operatörlerinin UNL'lerini özelleştirme esnekliğini önemli ölçüde sınırlamaktadır: **Diğerlerinin kullandığı UNL'ler ile daha az örtüşme olduğu takdirde, çatallama olasılığı artar.**

---

## Tavsiye Edilen Doğrulayıcı Listeleri

Çeşitli ve güvenilir bir doğrulayıcı listesini elde etmeyi kolaylaştırmak için XRP Ledger, tavsiye edilen doğrulayıcı listeleri sistemi kullanmaktadır. Bir sunucu, bir _yayımcıdan_ tavsiye edilen bir listeyi indirmek üzere yapılandırılabilir ve bu listeyi UNL'si olarak kullanabilir. Bir sunucu ayrıca birden fazla yayıncının listesini kullanmak üzere de yapılandırılabilir; yani sunucunun UNL'si, yayımlanan listelerin _herhangi_ birinde bulunan her doğrulayıcıdan oluşur. **Birden fazla listede yer alan doğrulayıcılar, sunucunun UNL'sinde yalnızca bir kez yer alır.**

Tavsiye edilen bir liste, yayıncısının ortak anahtarı ile tanımlanabilir. Genellikle tavsiye edilen listeler, indirilmek üzere bir web sitesi ile ilişkilidir, ancak listeler, web sitesine erişim sorunları durumunda **eşler arası (peer-to-peer)** ağ aracılığıyla da iletilebilir.

> **"Sunucu operatörleri, güvenilir doğrulayıcı listesi yayıncılarını seçerken dikkatli olmalıdır."**  
> — XRP Ledger Güvenlik Kılavuzu

Şu anda, XRP Ledger sunucuları için varsayılan yapılandırma, XRP Ledger Vakfı tarafından yayımlanan bir liste ve Ripple tarafından yayımlanan bir liste kullanmaktadır. Genellikle, bu listeler birbirine çok benzer veya hatta aynı olabilir. _Varsayılan UNL_ terimi (bazen dUNL kısaltmasıyla anılır), bu listelerde yer alan doğrulayıcılar grubunu ifade eder.

:::tip
Herkes, doğru formatta imzalı bir doğrulayıcı listesi yayımlayabilir; bu, imzalanmış ikili verileri içeren bir JSON belgesidir.
:::

Tavsiye edilen doğrulayıcı listeleri, zamanla güncellenmeli, daha kaliteli doğrulayıcılar ekleyip güvenilir olmayan veya emekli olan doğrulayıcıları çıkarmalıdır. Genellikle, bir tavsiye edilen doğrulayıcı listesinin bir son kullanım süresi vardır, çünkü yayıncı bu süreye kadar bir güncelleme sağlamış olmayı bekler. Listelerin ayrıca, **en yüksek sıralama numarasının o listenin en yeni sürümü olduğunu** ve daha eski sürümleri geçersiz kıldığını belirten bir sıralama numarası vardır. Listeler, sunucuların yeni sürüme geçiş zamanını koordine edebilmesi için bir etkinleşme tarihine de sahip olabilir ve güncellenmiş liste, onu kullanan tüm sunuculara yayılma fırsatı bulabilir.

---

## Tavsiye Edilen Listede Doğrulayıcınızı Nasıl Yayınlarsınız

Her yayıncı, listelerine dahil edilme kriterlerini kendileri belirleyebilir. Ancak, doğrulayıcınızın listelerine eklenmesi için gereken kriterler genellikle şunları içerir:

- Yüksek çalışma süreli bir doğrulayıcıyı en az bir yıl boyunca çalıştırmak ve ağın geri kalanıyla yüksek uyum sağlamak.
- `Alan doğrulaması` ayarlamak.
- XRP Ledger topluluğunda ayrı ve tanınabilir bir varlık olmak; örneğin, zaten bir doğrulayıcı çalıştıran bir şirketin çalışanı olmamak.
- Diğer doğrulayıcıların çoğundan ayrı bir fiziksel konumda doğrulayıcıyı çalıştırmak. (Örneğin, tek bir veri merkezindeki bir kesinti, birçok doğrulayıcının devre dışı kalmasına neden olmamalıdır.)

Doğrulayıcı listesi operatörleri, desteklenebilir listeye dahil edilme sürecinde adayları mülakata tabi tutabilirler, böylece gereksinimleri karşıladıklarından ve gelecekte sunucuyu çalıştırma taahhütleri olduğundan emin olabilirler.