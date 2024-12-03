---
title: Defter Geçmişi
seoTitle: XRP Ledger Defter Geçmişi
sidebar_position: 4
description: Ripplerd sunucuları, işlem ve durum geçmişini yerel olarak değişken bir miktarda saklar. XRP Ledgerındaki verilerin ve işlemlerin nasıl yönetildiğini keşfedin.
tags: 
  - XRP Ledger
  - veritabanları
  - işlem geçmişi
  - defter durumu
  - veri saklama
keywords: 
  - XRP Ledger
  - veritabanları
  - işlem geçmişi
  - defter durumu
  - veri saklama
---

# Defter Geçmişi

`Consensus süreci`, her biri önceki bir sürümden belirli bir dizi `işlem` uygulayarak türetilen `doğrulanmış defter sürümleri` zinciri oluşturur. Her `rippled` sunucusu`, defter sürümlerini ve işlem tarihini yerel olarak saklar. Bir sunucunun sakladığı işlem tarihi miktarı, o sunucunun çevrimiçi olma süresine ve ne kadar tarihi alıp saklayacak şekilde yapılandırıldığına bağlıdır.

:::info
Eşler arası XRP Ledger ağındaki sunucular, işlem ve diğer verileri birbirleriyle paylaşır ve bu, konsensüs sürecinin bir parçasıdır.
:::

Her sunucu, her yeni defter sürümünü bağımsız olarak oluşturur ve sonuçları güvenilir doğrulayıcılarıyla karşılaştırarak tutarlılığı sağlar. (Eğer güvenilir doğrulayıcıların bir konsensüsü, bir sunucunun sonuçlarıyla çelişiyorsa, o sunucu gereken verileri arkadaşlarından alır ve tutarlılık sağlar.)

> Sunucular, geçerli tarihlerini doldurmak için daha eski verileri arkadaşlarından indirebilir.  
> — XRP Ledger Veritabanı Yönetimi

Defter yapısı, verilerin bütünlüğünü ve tutarlılığını doğrulamak için herhangi bir sunucunun kullanabileceği kriptografik `hash'ler` içerir.

## Veritabanları

Sunucular, defter durum verilerini ve işlemleri _defter deposu_ adı verilen bir anahtar-değer deposunda saklar. Ayrıca, `rippled`, işlem geçmişi gibi şeylere daha esnek erişim sağlamak ve bazı ayar değişikliklerini takip etmek için birkaç SQLite veritabanı dosyası tutar.

:::warning
Bir `rippled` sunucusunun veritabanı dosyalarının tamamını silmek genellikle güvenlidir, bu da sunucunun çalışmadığı durumlarda geçerlidir.
:::

(Örneğin, bu durumu değiştirmek isteyebilirsiniz eğer sunucunun depolama ayarlarını değiştirirseniz veya test ağından üretim ağına geçiyorsanız.)

## Mevcut Tarih

Tasarım gereği, XRP Ledger'daki tüm veriler ve işlemler kamuya açıktır ve herkes herhangi bir şeyi arayabilir veya sorgulayabilir. Ancak, sunucunuz yalnızca yerel olarak mevcut olan verileri arayabilir. Eğer sunucunuzda mevcut olmayan bir defter sürümü veya işlem için sorgulama yapmaya çalışırsanız, sunucunuz o veriyi bulamadığını bildirecektir.

Gerekli geçmişe sahip diğer sunucular aynı sorguya başarılı bir şekilde yanıt verebilir. XRP Ledger verilerini kullanan bir işiniz varsa, sunucunuzun ne kadar geçmişe sahip olduğuna dikkat etmelisiniz.

[server_info metodu][] sunucunuzun `complete_ledgers` alanında mevcut olan defter sürümlerinin sayısını bildirir.

## Geçmişi Getirme

Bir XRP Ledger sunucusu başladığında, birincil önceliği en son doğrulanmış defterin eksiksiz bir kopyasını almaktır. Buradan itibaren, defter ilerlemesindeki gelişmeleri takip eder. Sunucu, senkronizasyon sonrası ortaya çıkan defter tarihi boşluklarını doldurur ve senkronize olduğu zamandan önceki tarihi yeniden doldurabilir.

:::note
Defter tarihindeki boşluklar, bir sunucu ağla bağlantısını kaybettiğinde, aşırı meşgul olduğunda veya diğer geçici sorunlar yaşadığında oluşabilir.
:::

Defter tarihini indirirken sunucu, eksik verileri `eş sunucularından` talep eder ve verinin bütünlüğünü kriptografik [hash'ler][Hash] kullanarak doğrular.

Tarihi yeniden doldurmak, sunucunun en düşük önceliklerinden biridir, bu yüzden eksik tarihin doldurulması uzun sürebilir, özellikle de sunucu meşgulse veya donanım ve ağ özellikleri yeterince iyi değilse. Donanım özellikleriyle ilgili öneriler için `Kapasite Planlaması` sayfasına bakın.

Ayrıca, tarihi doldururken en az bir sunucunun doğrudan arkadaşının söz konusu geçmişe sahip olması gerektiğini unutmayın. Sunucunuzun eşler arası bağlantılarını yönetmek hakkında daha fazla bilgi için `Peering Yapılandırma` sayfasına bakın.

XRP Ledger, verileri (birçok farklı seviyede) içeriğinin benzersiz bir hash'iyle tanımlar. XRP Ledger'ın durum verileri, `LedgerHashes nesne türü` biçiminde defterin tarihine dair kısa bir özet içerir. Sunucular, hangi defter sürümlerini alacaklarını bilmek ve aldıkları defter verilerinin doğru ve eksiksiz olduğunu doğrulamak için LedgerHashes nesnelerini kullanır.

### Yeniden Doldurma


Bir sunucunun indirmeyi denediği tarih miktarı, yapılandırmasına bağlıdır. Sunucu, mevcut en eski defterine kadar geçmişi indirmeye çalışarak eksik yerleri doldurmayı otomatik olarak dener. Sunucunun geçmişi bu noktadan önce yeniden doldurması için `[ledger_history]` ayarını kullanabilirsiniz. Ancak, sunucu asla `silme` planlanan defterleri indirmez.

`[ledger_history]` ayarı, mevcut doğrulanmış defterden önce biriken minimum defter sayısını tanımlar. Ağı `tam tarih` indirmek için `full` özel değerini kullanın. Eğer belirli bir defter sayısı belirtirseniz, bu sayılar `online_deletion` ayarına eşit veya daha fazla olmalıdır; `[ledger_history]` ayarını kullanarak sunucunun daha az tarih indirmesini sağlayamazsınız.

Bir sunucunun sakladığı tarih miktarını azaltmak için, bunun yerine `çevrimiçi silme` ayarlarını değiştirin.

## Tam Tarih

XRP Ledger ağındaki bazı sunucular, "tam tarih" sunucusu olarak yapılandırılmıştır. Bu sunucular, diğer izleme sunucularından önemli ölçüde daha fazla disk alanı gerektirir ve mevcut tüm XRP Ledger tarihini toplar ve **çevrimiçi silme kullanmazlar**.

XRP Ledger Vakfı, topluluk üyeleri tarafından işletilen bir dizi tam tarih sunucusuna erişim sağlar (daha fazla bilgi için [xrplcluster.com](https://xrplcluster.com) adresine bakın). Ripple ayrıca, `s2.ripple.com` adresinde kamu hizmeti olarak bir dizi kamuya açık tam tarih sunucusu sağlar.

:::danger
Tam Tarih sunucularının sağlayıcıları, kaynaklara kötüye kullanma veya sistemlere aşırı yükleme tespit edildiğinde erişimi engelleme hakkını saklı tutar.
:::

admonition type="success" name="İpucuBazı kripto para birimi ağlarının aksine, XRP Ledger'daki sunucular, mevcut durumu bilmek ve güncel işlemlerle uyum sağlamak için tam tarihe ihtiyaç duymaz.:::

Tam tarih ayarlarıyla ilgili talimatlar için `Tam Tarih Yapılandırma` sayfasına bakın.

## Tarih Sharding

XRP Ledger'ın tam tarihini tek bir pahalı makinede saklamanın bir alternatifi, birçok sunucunun, tüm defter tarihinin bir kısmını saklayacak şekilde yapılandırılmasıdır. `Tarih Sharding` özelliği, bu olanağı sağlar ve defter tarihinin aralıklarını _shard store_ adı verilen ayrı bir depolama alanında saklar.

Bir eş sunucu belirli verileri istediğinde (yukarıda `geçmişi getirme` bölümünde açıklandığı gibi), bir sunucu ya defter deposundan ya da shard deposundan veriyle yanıt verebilir.

:::tip
Çevrimiçi silme, **shard store**'dan silme işlemi yapmaz. Ancak, çevrimiçi silmeyi sunucunuzun depolama alanında en az 32768 defter sürümünü saklayacak şekilde yapılandırırsanız, sunucunuz eksik defterleri otomatik olarak silmeden önce defter store'dan shard store'a kopyalayabilir.
:::

Daha fazla bilgi için `Tarih Sharding Yapılandırma` sayfasına bakın.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Defterler`
    - `Konsensüs`
- **Eğitimler:**
    - `rippled` Yapılandırma`
        - `Çevrimiçi Silmeyi Yapılandır`
        - `Tavsiyeli Silmeyi Yapılandır`
        - `Tarih Sharding Yapılandır`
        - `Tam Tarih Yapılandır`
- **Kaynaklar:**
    - [ledger metodu][]
    - [server_info metodu][]
    - [ledger_request metodu][]
    - [can_delete metodu][]
    - [ledger_cleaner metodu][]
    
