# Blockchain Hizmetleri

## Alan Adı Sistemleri

Ethereum'da kullanıcılar, Ethereum blok zinciri üzerinde inşa edilmiş merkeziyetsiz bir adlandırma sistemi olan Ethereum Name Service (ENS) kullanır.

TON blok zinciri, gömülü bir alan adı sistemi olarak bilinen TON DNS'yi içerir. Bu merkeziyetsiz hizmet, kullanıcıların akıllı sözleşmeleri, web siteleri veya başka her türlü çevrimiçi içerikleri için insan okunabilir alan adları kaydetmesine olanak tanır. Böyle bir cihaz, TON blok zinciri üzerindeki merkeziyetsiz uygulamalar (dApps) ve diğer kaynaklarla etkileşimi kolaylaştırır. 

> **Önemli Not:** TON'daki DNS sistemi, geleneksel İnternet DNS sistemlerine benzer şekilde çalışır, ancak merkeziyetsiz yapısı, alan adlarını kontrol etmek ve yönetmek için merkezi bir otoriteye ihtiyaç duymayarak sansür, dolandırıcılık ve alan adı gaspetme risklerini azaltır.  
> — Kaynak: TON Teknik Dokümantasyonu

## WWW

TON WWW, blok zinciri aracılığıyla merkeziyetsiz web siteleri oluşturmanıza ve etkileşimde bulunmanıza olanak tanıyan TON blok zincirinin bir parçasıdır. Geleneksel web sitelerinin aksine, TON'daki web siteleri `.ton` ile biten özel URL'ler aracılığıyla erişilebilir ve URL'den doğrudan işlem ve diğer operasyonlara olanak tanıyan `ton://` formatında benzersiz bağlantıları destekler.

### Temel Özellikler:

- **Kripto cüzdanlarının alan adlarına doğrudan bağlama yeteneği**
- Kullanıcıların ek ayrıntılara ihtiyaç duymadan **alice.place.ton** gibi adreslere kripto para göndermesine olanak tanır. 

:::tip
Bu basitlik, bağışlar ve ödemeler sürecini büyük ölçüde basitleştirir, daha sezgisel ve kullanışlı hale getirir.
:::

## Proxy

TON Proxy, yüksek düzeyde güvenlik ve anonimlik sunan TON protokolüne dayalı bir araçtır. TON Proxy aracılığıyla iletilen tüm veriler şifrelenir ve bu da kullanıcıların gizli bilgilerini korur.

### Avantajlar:

- **İSS'ler veya devlet kurumları tarafından yapılan engelleri aşabilme yeteneği**: Bu, bilgilere kısıtlamasız erişim gerektiren kullanıcılar için vazgeçilmez bir araç haline getirir.

Ayrıca, TON Proxy, Internet bağlantı hızlarını artırmaya yardımcı olur. Otomatik olarak en düşük yükteki sunucuları seçer, bu da bağlantı kalitesini ve İnternet erişim hızını artırır.

## Merkeziyetsiz Depolama

Ethereum, büyük miktarda veri saklamak için uygun değildir. Bu nedenle, Ethereum'daki merkeziyetsiz depolama genellikle verileri merkeziyetsiz ve güvenli bir şekilde saklamak ve geri almak için dağıtık dosya sistemleri kullanmayı içerir. Ethereum'da merkeziyetsiz depolama için popüler bir yaklaşım, kullanıcıların dağıtılmış düğümler ağından dosya saklamasına ve geri almasına olanak tanıyan P2P dosya sistemi olan InterPlanetary File System (IPFS)'dir.

TON ağı, TON Blockchain tarafından blokların arşiv kopyalarını ve durum verilerini (anlık görüntüler) saklamak için kullanılan kendi merkeziyetsiz depolama hizmetine sahiptir. Ayrıca, kullanıcıların dosyalarını veya platformda çalışan diğer hizmetleri saklamak için de kullanılabilir, torrent benzeri erişim teknolojisi ile. 


En Popüler Kullanım Durumu:
NFT meta verilerini doğrudan TON depolama alanında saklamak olup, IPFS gibi ek dağıtık dosya depolama hizmetleri kullanılmadan yapılır.


## Ödeme Hizmetleri

TON Ödemeleri, TON blok zincirinde sıfır ağ ücreti ile yıldırım hızında işlemler için bir çözümdür. TON blok zinciri, çoğu görev için yeterli olsa da, TON Proxy, TON Depolama veya belirli bir merkeziyetsiz uygulama gibi bazı uygulamalar, çok daha yüksek hız ve daha düşük maliyetlerle mikro işlemler gerektirir. 

:::info
Ödeme kanalları, ayrıca Lightning ağı olarak da bilinir, bu sorunu çözmek için oluşturulmuştur.
:::

Ödeme kanalları, iki tarafın başlangıç bakiyeleri ile blok zincirinde özel bir akıllı sözleşme oluşturarak zincir dışı işlemler yapmasına olanak tanır. Daha sonra, istenen kadar işlem gerçekleştirebilirler; bu işlemler hız sınırı veya ücret olmaksızın gerçekleştirilebilir. Ağın ücretleri yalnızca kanal açıldığında ve kapandığında tahsil edilir. 

> **Teknolojik Not:** Bu teknoloji, bir tarafın diğer taraf dolandırıcılık yaparsa veya kaybolursa kendi başına kanalı kapatmasına izin vererek uygun çalışma garantisi sağlar.  
> — Kaynak: TON Protokolü Belgeleri