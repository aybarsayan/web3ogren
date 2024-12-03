---
title: Tarih Parçalama Yapılandırması
seoTitle: XRP Ledger Tarih Parçalama Yapılandırma Rehberi
sidebar_position: 4
description: Bu kılavuz, rippled sunucularında tarih parçalama yapılandırmayı adım adım açıklamaktadır. Sunucunuzun tarih parçalarını etkili bir şekilde nasıl yöneteceğinizi öğrenin.
tags: 
  - XRP Ledger
  - tarih parçalama
  - rippled
  - veri koruma
  - sunucu yapılandırması
keywords: 
  - XRP Ledger
  - tarih parçalama
  - rippled
  - veri koruma
  - sunucu yapılandırması
---

# Tarih Parçalama Yapılandırması

`Tarih Parçalama`, sunucuların tarihsel XRP Ledger verilerini korumaya katkıda bulunmalarını sağlar; her sunucunun tam tarihi saklaması gerekmez. Varsayılan olarak, `rippled` sunucuları tarih parçalarını saklamaz.

:::tip
Hem doğrulayıcı hem de izleyici (veya stok) `rippled` sunucuları tarih parçalarını saklayacak şekilde yapılandırılabilir, ancak Ripple, bu sunucular üstündeki yükü azaltmak için doğrulayıcı `rippled` sunucularını parça saklayacak şekilde yapılandırmamayı önerir. Bir doğrulayıcı çalıştırıyorsanız ve XRP Ledger tarihi saklamaya katkıda bulunmak istiyorsanız, tarih parçalama etkinleştirilmiş ayrı bir `rippled` sunucusu çalıştırmanızı öneririz.
:::

`rippled` sunucunuzu tarih parçalarını saklayacak şekilde yapılandırmak için aşağıdaki adımları tamamlayın:

## 1. Saklanacak parça sayısını belirleyin

`rippled` sunucunuzu tarih parçalarını saklayacak şekilde yapılandırmadan önce, saklamak istediğiniz tarih parçası sayısını belirlemelisiniz; bu, genellikle, parça deposu için ne kadar disk alanının mevcut olduğuna bağlıdır. Bu, varsayılan defter deposunda sakladığınız tarih miktarını da etkiler. Parça deponuzu yapılandırırken aşağıdakileri dikkate almalısınız:

- Defter deposu (`[node_db]` bölümü ile tanımlanır), tarih parça deposundan ayrıdır. Defter deposu, tüm sunucular için gereklidir ve her zaman `online_delete` parametresinde saklamak istediğiniz defter sayısı ile belirlenen yakın tarih aralığını içerir. (Varsayılan yapılandırma, en son 2000 defteri saklar.)
    - Eğer defter deposunda en az 215 defter (32768) saklarsanız, yakın tarih parçalarını defter deposundan parça deposuna verimli bir şekilde aktarabilirsiniz.
- Tarih parça deposu (`[shard_db]` bölümü ile tanımlanır) yalnızca tarih parçalarını saklamak için gereklidir. Tarih parçalarını saklamayan sunucularda yapılandırma bölümü yer almamalıdır. Saklanan toplam parça sayısı `max_historical_shards` parametresi ile belirlenir; sunucu, bu kadar tamamlanmış parçayı saklamaya çalışır. Tarih parça deposunun _MUTLAKA_ katı halindeki bir disk veya benzeri hızlı bir ortamda saklanması gerekir. Geleneksel döner sabit diskler yetersizdir.
- Bir parça 214 defterden (16384) oluşur ve parçanın yaşı ile orantılı olarak yaklaşık 200 MB ile 4 GB arasında yer kaplar. Daha eski parçalar daha küçüktür çünkü o dönemde XRP Ledger'da daha az aktivite olmuştur.
- Tarih parça deposu ve defter deposu _MUTLAKA_ farklı dosya yollarında saklanmalıdır. İstenirse, defter ve tarih deposunun farklı diskler veya bölümler üzerinde olmasını yapılandırabilirsiniz.
- Hem defter deposunda hem de tarih parça deposunda tam defter geçmişini tutmak mümkün ama gereksizdir.
- Bir parçayı edinmenin süresi, `rippled` sunucusu tarafından gerekli dosya handle'ları sayısı ve bellek önbelleği kullanımı, parçanın boyutından doğrudan etkilenir.
- Daha eski tarih parçalarını saklamak için ek yollar belirtebilirsiniz; bunlar `[historical_shard_paths]` bölümü ile sağlanabilir. Bu yollar, daha az sıklıkla kullanılan verileri tuttuğu için farklı, daha yavaş disklerde olabilir. En son iki parça (en büyük defter indekslerine sahip olanlar) her zaman `[shard_db]` bölümünde belirtilen yolda saklanır.

## 2. rippled.cfg dosyasını düzenleyin

`rippled.cfg` dosyanızı açarak bir `[shard_db]` bölümü ve isteğe bağlı bir `[historical_shard_paths]` bölümü ekleyin.

partial file="/docs/_snippets/conf-file-location.md" /%}

Aşağıdaki örnek, bir `[shard_db]` bölümünün örneğini göstermektedir:

```
[shard_db]
path=/var/lib/rippled/db/shards/nudb
max_historical_shards=12

# En yeni 2'den başka parçalar için isteğe bağlı yollar
[historical_shard_paths]
/mnt/disk1
/mnt/disk2
```

> **Not:** `[shard_db]` içindeki `type` alanı atlanabilir. Mevcutsa, _MUTLAK_ `NuDB` olmalıdır.  
> — Dökümantasyon

:::warning
Eğer `rippled`, parça deposu yolunda yanlış türde veri tespit ederse, `başlatmada hata verir`. Parça deposu için yeni bir klasör kullanmalısınız. Önceki bir RocksDB parça deposu (`rippled` 1.2.x ve altı) kullandıysanız, farklı bir yol kullanın veya RocksDB parça verisini silin.
:::

Daha fazla bilgi için, `[shard_db]` örneğini [rippled.cfg yapılandırma örneği](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg) referans alın.

## 3. Sunucuyu yeniden başlatın

```
systemctl restart rippled
```

## 4. Parçaların indirilmesini bekleyin

Sunucunuz ağ ile senkronize olduktan sonra, mevcut alanı doldurmak için otomatik olarak tarih parçalarını indirmeye başlar. Hangi parçaların indirildiğini görmek için, parça deponuzu yapılandırdığınız klasörde oluşturulan klasörlere bakabilirsiniz. (Bu, `rippled.cfg` dosyasındaki `[shard_db]` bölümündeki `path` alanı ile tanımlanır.)

Bu klasör, sunucunuzun sahip olduğu her parça için numaralandırılmış bir klasör içermelidir. Herhangi bir anda, en fazla bir klasör `control.txt` dosyasını içerebilir ve bunun eksik olduğunu gösterir.

Sunucunuzu bir arşiv dosyasından bir parçayı indirmeye ve içe aktarmaya yönlendirebilirsiniz; bunu [download_shard method][] kullanarak yapabilirsiniz.

Sunucunuz ve onun eşleri tarafından mevcut olan parçaları listelemek için, [crawl_shards method][] veya `Eş Crawları` kullanabilirsiniz.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Defter Geçmişi`
        - `Çevrimiçi Silme`
- **Eğitimler:**
    - `Çevrimiçi Silme Ayarları`
    - `Peer Crawler'ı Yapılandırın`
    - `Kapasite Planlaması`
- **Referanslar:**
    - [download_shard method][]
    - [crawl_shards method][]
    - `Defter Veri Formatları`

