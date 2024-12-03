---
title: Kapasite Planlaması
seoTitle: XRP Ledger Sunucusu için Kapasite Planlaması
sidebar_position: 4
description: Bu belge, XRP Ledger sunucusunun performansını ayarlamak ve optimize etmek için yapılandırma, ağ ve donanım önerileri sunmaktadır.
tags: 
  - rippled
  - kapasite planlaması
  - API kullanımı
  - donanım önerileri
  - XRP Ledger
keywords: 
  - rippled
  - kapasite planlaması
  - API kullanımı
  - donanım önerileri
  - XRP Ledger
---

## Kapasite Planlaması

Bu belge, bir XRP Ledger sunucusunun performansını ayarlamak ve optimize etmek için kullanılabilecek yapılandırma, ağ ve donanım önerilerini tanımlamaktadır.

Bir XRP Ledger sunucusundaki yük, birden fazla faktöre bağlı olarak değişir. Bunlardan biri, ağdaki aktivitedir. Paylaşılan defterdeki verilerin toplam boyutu ve gönderilen işlem hacmi, küresel XRP Ledger topluluğundaki organik faktörlerden etkilenerek değişir. Diğer bir faktör ise API kullanımını içerir; farklı türdeki `API çağrıları` sunucu üzerinde farklı yükler oluşturur. Kamuya açık API sağlayan sunucular, belirli entegrasyon yazılımlarına özel bir API sağlayanlar veya hiç API sunmayanlar arasında performans özellikleri oldukça farklı olabilir.

:::tip
Sunucunuzun, XRP Ledger ağ aktivitesini bugün ve gelecekte karşılayacak kapasiteye sahip olmasını sağlamak için bu faktörleri dikkate almalısınız.
:::

## Yapılandırma Ayarları

Varsayılan yapılandırma dosyası, geniş bir yaygın kullanım senaryosu yelpazesi için ayarları içerir. Donanımınıza ve amaçladığınız kullanım modeline uygun ayarları özelleştirerek daha iyi performans elde edebilirsiniz.

Bu bölümdeki ayarlar, `rippled.cfg` dosyasındaki parametrelerdir. `rippled` GitHub deposundaki [`cfg` dizininde](https://github.com/XRPLF/rippled/blob/develop/cfg/rippled-example.cfg) bir örnek yapılandırma dosyası olan `rippled-example.cfg` dosyasına erişebilirsiniz. Örnek yapılandırma dosyasındaki ayarlar, sunucuyla birlikte yüklenen varsayılan yapılandırmaya karşılık gelir.

### Düğüm Boyutu

`[node_size]` parametresi, sunucunuzun genel donanım kapasitesiyle eşleşmelidir. Bu parametreyi atlayarak, sunucunun sistemin toplam RAM'i ve CPU iş parçacığı sayısına dayalı olarak uygun bir ayar seçmesini sağlayabilirsiniz. Bu değeri açıkça ayarlayabilirsiniz, eğer otomatik ayar sisteminiz için yanlışsa; örneğin, sistemin bazı RAM'inin veya iş parçacıklarının diğer yazılımlar için ayrılması gerekiyorsa veya işletim sistemi tarafından bildirilen miktarlar doğru değilse. (Bu bazı konteynerlerde gerçekleşebilir.) badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1Güncellendi: rippled 1.8.1/badge %}

> Genel bir kural olarak, her zaman mevcut RAM'in destekleyebileceği en büyük düğüm boyutunu kullanmalısınız. 

Aşağıdaki tabloda önerilen ayarları görebilirsiniz.

#### Öneri

Her `[node_size]` değerinin, mevcut RAM için karşılık gelen bir gereksinimi vardır. Örneğin, `[node_size]` değerini `huge` olarak ayarlarsanız, `rippled`'in sorunsuz çalışmasını sağlamak için en az 32 GB mevcut RAM'e sahip olmalısınız.

Sunucunuzu ayarlamak için `tiny` ile başlayıp, kullanım senaryonuz için gereksinimleri netleştirdikçe boyutu `small`, `medium`, vs. olarak artırmak faydalı olabilir.

| Mevcut RAM   | `node_size` değeri | Notlar                                   |
|:-------------|:--------------------|:-----------------------------------------|
|  Eğer `[node_size]` parametresini geçersiz bir değere ayarlarsanız, `sunucu başlamaz`.

### Düğüm DB Türü

`rippled.cfg` dosyasındaki `[node_db]` bölümündeki `type` alanı, `rippled`'in defter verilerini saklamak için kullandığı anahtar-değer deposunun türünü ayarlar.

Neredeyse tüm amaçlar için `NuDB` kullanın. Hızlı bir SSD gereklidir. `Daha fazla bilgi edinin`.

`RocksDB` ayarı, eski amaçlar için mevcuttur, ancak genellikle önerilmez. `Daha fazla bilgi edinin`.

Örnek `rippled-example.cfg` dosyasında, `[node_db]` bölümündeki `type` alanı `NuDB` olarak ayarlanmıştır.

#### RocksDB Kullanımı Hakkında Daha Fazla

[RocksDB](https://rocksdb.org/docs/getting-started.html), `rippled` içinde yerleşik bir kalıcı anahtar-değer deposudur. **RocksDB desteği, eski bir destek olarak kabul edilmektedir.** RocksDB kullanan sunucular, büyük bir veritabanını sürdürmenin bellek gereksinimleri nedeniyle Mainnet ile senkronizasyonu genellikle zor bulurlar. Genel olarak, bunun yerine NuDB kullanılmalıdır.

RocksDB'yi kullanabileceğiniz durumlar, RocksDB formatında kaydedilmiş tarihsel verileri yüklemeniz gerektiğinde veya verileri yavaş SSD'lerde veya döner disklerde saklıyorsanız ortaya çıkabilir. Döner diskler Mainnet ile eşleşemese de, muhtemelen çevrimdışı testleri veya küçük özel ağları bunlar üzerinde çalıştırabilirsiniz.

RocksDB, daha fazla işlem işleme çıktısı elde etmek için ayarlarını değiştirebileceğiniz performans ile ilgili yapılandırma seçeneklerine sahiptir. İşte RocksDB için bir örnek `[node_db]` yapılandırması:

```
[node_db]
type=RocksDB
path=/var/lib/rippled/db/rocksdb
open_files=512
filter_bits=12
cache_mb=512
file_size_mb=64
file_size_mult=2
online_delete=2000
advisory_delete=0
```

(`path`'ı, defter verilerini diskte saklamak istediğiniz dizine ayarlayın. `online_delete` ve `advisory_delete` ayarlarını istenen şekilde değiştirin.)

#### NuDB Kullanımı Hakkında Daha Fazla

[NuDB](https://github.com/vinniefalco/nudb#introduction), SSD sürücüler için optimize edilmiş yalnızca ekleme yapabilen bir anahtar-değer deposudur.

NuDB, saklanan verilerin `miktarına` bağlı olarak neredeyse sabit performans ve bellek ayak izine sahiptir. NuDB _bir_ katı hal sürücüsü gerektirir. Ölçeklenebilirlik testleri, NuDB'nin, üretim ve benzer yapılandırmalarda RocksDB ile eşit veya daha iyi performansa sahip olduğunu göstermiştir.

Üretim sunucuları, NuDB kullanacak şekilde yapılandırılmalı ve kullanım senaryonuz için gereken tarihsel veri miktarını saklamalıdır.

NuDB, `rippled.cfg` dosyasındaki performansla ilgili yapılandırma seçeneklerini içermez. İşte NuDB kullanan bir `rippled` sunucusu için önerilen `[node_db]` yapılandırması:

```
[node_db]
type=NuDB
path=/var/lib/rippled/db/nudb
online_delete=2000
advisory_delete=0
```

`path`'ı, defter verilerini diskte saklamak istediğiniz dizine ayarlayın. `online_delete` ve `advisory_delete` ayarlarını istenen şekilde değiştirin. Bu ayarlar hakkında daha fazla bilgi için `Online Silme Yapılandırmasını` ve `Danışma Silme Yapılandırmasını` inceleyin.

### Günlük Seviyesi

Örnek `rippled-example.cfg` dosyası, `[rpc_startup]` bölümünde günlük ayrıntı seviyesini `warning` olarak ayarlamaktadır. Bu ayar, daha ayrıntılı günlükler ile karşılaştırıldığında disk alanı ve I/O gereksinimlerini büyük ölçüde azaltır. Ancak, daha ayrıntılı günlükler, sorun gidermede daha fazla görünürlük sağlar.

:::warning
Eğer `[rpc_startup]` bölümünden `log_level` komutunu atlıyorsanız, sunucu günlüğü `debug` seviyesinde diske yazar ve `warning` seviyesindeki günlükleri konsola çıktılar. `debug` seviyesinde günlüğün yazılması, işlem hacmine ve istemci etkinliğine bağlı olarak, günlük başına birçok GB daha fazla disk alanı gerektirebilir.
:::

## Ağ ve Donanım

XRP Ledger ağındaki her sunucu, ağın tüm işlem işleme işlerini gerçekleştirir. Ağ üzerindeki toplam aktivite değişiklik göstermektedir ama çoğunlukla zamanla artış göstermiştir, bu nedenle mevcut ağ aktivitesi için ihtiyaç duyduğunuzdan daha fazla kapasiteye sahip donanım seçmelisiniz.

### Öneri

Önerilen donanım özelliklerinin özeti için `Sistem Gereksinimleri` kısmına bakın.

#### CPU Kullanımı ve Sanallaştırma

En iyi performansı fiziksel makinelerde alırsınız, ancak sanal makineler de host donanımı yeterince yüksek spesifikasyonlara sahip olduğu sürece neredeyse aynı performansı sağlayabilir.

#### Disk Hızı

Depolama hızı, bir sunucunun kapasitesindeki en önemli faktörlerden biridir. Düşük gecikmeli rastgele okumalar ve yüksek veri aktarım hızı sunan yüksek kaliteli bir katı hal sürücüsü (SSD) kullanın. Ripple mühendisleri, aşağıdaki maksimum okuma ve yazma hızlarını gözlemlemiştir:

- Dakikada 10,000'den fazla okuma (yoğun kullanılan halka sunucu kümelerinde)
- Dakikada 7,000'den fazla yazma (dedike performans testlerinde)

#### Disk Alanı

`[node_db]` bölümü, sunucunun _defter verilerini_ kontrol eder; bu, `defter geçmişini` içerir. Ne kadar disk alanına ihtiyacınız, ne kadar geçmişin yerel olarak saklanmasını istediğinize bağlıdır. Bir XRP Ledger sunucusunun, konsensüs sürecine uymak ve defterin tam durumunu raporlamak için en son 256 defter versiyonundan fazlasını saklamasına gerek yoktur, ancak yalnızca sunucunun yerel olarak sakladığı defter versiyonlarında gerçekleştirilmiş işlemler için sorgulama yapabilirsiniz. `[node_db]`'nin `path`'ını, defter verileri için seçtiğiniz depolama konumuna işaret edecek şekilde yapılandırmalısınız.

Ne kadar veri saklayacağınızı kontrol etmek için `çevrimiçi silme` işlevini kullanabilirsiniz; varsayılan yapılandırma dosyası sunucunun son 2000 defter versiyonunu tutmasını sağlar. Çevrimiçi silme olmadığında, sunucunun disk gereksinimleri sınırsız olarak büyür.

Aşağıdaki tablo, yazma anında (2023-07-19) farklı miktarlardaki tarihler için gereksinimleri yaklaşık olarak göstermektedir:

| Gerçek Zaman Miktarı | Defter Versiyonları Sayısı | Gerekli Disk Alanı (NuDB) |
|:----------------------|:----------------------------|:---------------------------|
| 2 saat                | 2,000                       | 450 MB                     |
| 1 gün                 | 25,000                      | 12 GB                      |
| 14 gün                | 350,000                     | 168 GB                     |
| 30 gün                | 750,000                     | 360 GB                     |
| 90 gün                | 2,250,000                   | 1 TB                       |
| 1 yıl                 | 10,000,000                  | 4.5 TB                     |
| 2 yıl                 | 20,000,000                  | 9 TB                       |
| Tam geçmiş            | 81,000,000+                 | ~26 TB                     |

Bu rakamlar tahmindir. Birçok faktöre, en önemlisi, ağdaki işlem hacmine bağlıdır. İşlem hacmi arttıkça, her defter versiyonu daha fazla benzersiz veriyi saklar. Gelecek büyümeye hazırlık yapmak için ek depolama kapasitesi sağlamalısınız.

`online_delete` ayarı, sunucunun eski geçmişi sildikten sonra kaç defter versiyonu saklayacağını belirtir. Çevrimiçi silme çalışmadan hemen önce, o kadar defter versiyonunu maximum (ayrıca disk alanı) saklamak için yeterli disk alanı planlanmalısınız.

Ne kadar tarih sakladığınızı değiştirmek için talimatlar için `Çevrimiçi Silme Yapılandırmasını` inceleyin.

`[database_path]`, işlem verileri ile bazı çalışma zamanı yapılandırmalarını içeren ayrı muhasebe veritabanlarını yapılandırır.

Genel bir kural olarak, `rippled` sunucusu çalışmadığı zaman defter verisi ve muhasebe veritabanlarıyla ilgili veritabanı dosyalarını güvenle silebilirsiniz; bu, sunucunun sakladığı tüm defter geçmişini temizler, ancak sunucu bu veriyi ağdan yeniden edinebilir. Ancak, `[database_path]` içindeki `wallet.db` dosyasını silerseniz, `değişiklik oylamaları` ve `eş peer rezervasyonları` gibi çalışma zamanında yapılan yapılandırma değişikliklerini manuel olarak yeniden uygulamalısınız.

Eğer defter geçmişini saklamaya katkıda bulunmak istiyorsanız ancak tam geçmişi saklayacak kadar disk alanınız yoksa, `Tarih Shardlama` özelliğini kullanabilir ve ayrılmış bir shard deposunda rastgele bir defter aralığını saklayabilirsiniz. Tarih sharding, `[shard_db]` bölümünde yapılandırılır.

##### Amazon Web Hizmetleri

Amazon Web Hizmetleri (AWS), popüler bir sanallaştırılmış barındırma ortamıdır. `rippled`'i AWS üzerinde çalıştırabilirsiniz, ancak Elastic Block Storage (EBS) kullanmayın. `Sistem Gereksinimleri` kısmına bakın.

AWS örnek depolama alanları (`ephemeral` storage) uygun performans sağlar, ancak bazı durumlarda verileri kaybedebilirsiniz; örneğin bir örneği başlat/durdurduğunuzda. Bu kabul edilebilir olabilir, çünkü bireysel bir XRP Ledger sunucusu genellikle kaybolan defter geçmişini eşlerinden yeniden edinir. Yapılandırma ayarları daha kalıcı bir depolama alanında saklanmalıdır.

`[node_db]` bölümünüzün yolu ve `[database_path]`'ınızın her ikisinin de uygun depolama alanına işaret ettiğinden emin olun.

#### RAM/Bellek

Bellek gereksinimleri esasen `node_size` yapılandırma ayarının bir fonksiyonudur ve tarihsel verileri geri yükleyen istemci trafiği miktarıyla ilişkilidir. Bellek gereksinimlerinin daha fazla bilgisi için `Düğüm Boyutu` kısmına bakın.

#### Ağ

Herhangi bir işletme veya taşıyıcı sınıf veri merkezi, XRP Ledger sunucularını çalıştıracak yeterli ağ bant genişliğine sahip olmalıdır. Gerekli bant genişliği, ağdaki mevcut işlem hacmine bağlı olarak önemli ölçüde değişiklik göstermektedir. Sunucu davranışları (örneğin, `defter geçmişini` doldurma) de ağ kullanımına etki eder. Tüketici sınıfı ev interneti, genellikle güvenilir bir sunucu çalıştırmak için yeterli değildir.

Son derece yüksek işlem hacmi dönemlerinde, bazı operatörler sunucularının tamamen 100 megabit/s ağ bağlantısını doldurduğunu bildirmişlerdir, bu nedenle güvenilir performans için gigabit ağ arayüzü gereklidir.

İşte yaygın görevler için gözlemlenen sıkıştırılmamış ağ bant genişliği kullanımı örnekleri:

| Görev                                           | Gönder/Al                |
|:------------------------------------------------|:------------------------|
| Ortalama işlem hacimlerini işleme              | 2 Mbps yukarı, 2 Mbps aşağı |
| Pik işlem hacimlerini işleme                   | >100 Mbps yukarı       |
| Tarihsel defter ve işlem raporlarını sunma    | 100 Mbps yukarı        |
| `rippled`'i başlatma                          | 20 Mbps aşağı          |

:::note
Ağ bant genişliğinden tasarruf etmek için `peer-to-peer iletişimlerde sıkıştırmayı etkinleştirebilirsiniz`, bu da daha yüksek CPU maliyeti ile birlikte gelir. Birçok donanım yapılandırması normal kullanım sırasında fazladan CPU kapasitesine sahiptir, bu nedenle eğer ağ bant genişliğiniz sınırlıysa bu, ekonomik bir seçenek olabilir.
:::

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu`
    - `Konsensüs`
- **Eğitimler:**
    - `rippled'i Yapılandırma`
        - `Çevrimiçi Silme Yapılandırmasını` - Sunucunuzun ne kadar tarihsel defter versiyonunu tutacağını ayarlayın.
    - `rippled'i Sorun Giderin`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı`
        - [logrotate yöntemi][] - Sunucunun hata ayıklama günlüğünü kapatır ve yeniden açar, böylece standart araçlarla döndürebilirsiniz.
        - [server_info yöntemi][] - Sunucu hakkında genel bilgiler; senkronizasyon durumu ve diskte mevcut olan tarihsel defter versiyonları sayısı dahil.
        - [get_counts yöntemi][] - Sağlıklılık ile ilgili ek bilgiler, özellikle RAM'de kaç nesne tutulduğuna dair.

