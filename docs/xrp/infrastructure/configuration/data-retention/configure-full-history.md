---
title: Tam Tarih Yapılandırması
seoTitle: Tam Tarih Sunucusu Yapılandırması - XRP Ledger
sidebar_position: 4
description: Bu kılavuz, tam tarih depolamak için sunucunun nasıl yapılandırılacağını açıklamaktadır. Kullanılan yöntemler ve uyarılar hakkında ayrıntılı bilgi sunulmaktadır.
tags: 
  - XRP Ledger
  - tam tarih
  - sunucu yapılandırması
  - veri saklama
  - NuDB
keywords: 
  - XRP Ledger
  - tam tarih
  - veri saklama
  - ripple
  - sunucu yapılandırması
---
# Tam Tarih Yapılandırması

Varsayılan yapılandırmasında, `rippled` sunucusu, yeni defter versiyonları kullanılabilir hale geldikçe, XRP Ledger durumunun ve işlemlerinin tarihini otomatik olarak siler. Bu, mevcut durumu bilmek ve işlemleri işlemek için eski tarihe ihtiyaç duymayan çoğu sunucu için yeterlidir. Ancak, bazı sunucuların XRP Ledger tarihinin mümkün olduğunca fazla kısmını sağlaması ağ için faydalı olabilir.

## Uyarılar

:::warning
Tam tarih depolamak pahalıdır. 2023-07-19 itibarıyla, XRP Ledger'ın tam tarihi yaklaşık **26 terabayt** disk alanı kaplamaktadır ve bu alanın tamamı doğru sunucu performansı için hızlı katı hal disk sürücülerinde depolanmalıdır. Bu kadar büyük bir katı hal depolama ucuz değildir ve saklamanız gereken toplam tarih miktarı günde yaklaşık 12 GB artmaktadır.
:::

Ayrıca, NuDB'de tam tarih depolamak, birçok Linux dağıtımında varsayılan olan ext4 dosya sistemlerinin 16 TB sınırını aşan tek dosyalar gerektirir. XFS (önerilir) veya ZFS gibi daha büyük tek dosya sınırı olan bir dosya sistemi kullanmalısınız.

Eşler arası ağdan tam tarih edinmek uzun zaman alır (birkaç ay) ve sunucunuzun, yeni defter ilerlemesiyle birlikte eski tarihi edinmek için yeterli sistem ve ağ kaynağına sahip olması gerekir. 

> "Eşler arası ağda katılmak, işlem doğrulamak veya ağın mevcut durumunu bilmek için tam tarih sunucusuna ihtiyacınız yoktur." — XRP Ledger Kılavuzu

:::info
Eğer XRP Ledger ağının tarihini tam tarih saklamadan depolamak için katkıda bulunmak istiyorsanız, `tarih parçalama yapılandırmasını` kullanarak rastgele seçilen defter tarih parçalarını depolayabilirsiniz.
:::

## Yapılandırma Adımları

Sunucunuzu tam tarih edinmek ve depolamak için yapılandırmak üzere aşağıdaki adımları tamamlayın:

1. `rippled` sunucusunu çalışıyorsa durdurun.

    ```
    $ sudo systemctl stop rippled
    ```

2. Sunucunuzun yapılandırma dosyasındaki `[node_db]` kısmından `online_delete` ve `advisory_delete` ayarlarını kaldırın (veya yorumlayın) ve türü `NuDB` olarak değiştirin, eğer henüz yapmadıysanız:

    ```
    [node_db]
      type=NuDB
      path=/var/lib/rippled/db/nudb
      #online_delete=300000
      #advisory_delete=0
    ```

    Tam tarih sunucusu için defter deposu olarak NuDB kullanmalısınız, çünkü RocksDB bu kadar büyük bir veritabanında çok fazla RAM gerektirir. Daha fazla bilgi için `Kapasite Planlaması` bölümüne bakabilirsiniz.

    :::warning
    Eğer RocksDB ile daha önce indirilen bir tarihiniz varsa, ya bu veriyi silmeniz ya da NuDB'ye geçerken yapılandırma dosyasındaki veritabanlarının yollarını değiştirmeniz gerekir.
    :::

    partial file="/docs/_snippets/conf-file-location.md" /%}

3. Sunucunuzun yapılandırma dosyasındaki `[ledger_history]` kısmını `full` olarak ayarlayın:

    ```
    [ledger_history]
    full
    ```

4. Sunucunuzun yapılandırma dosyasındaki `[ips_fixed]` kısmını, tam tarih mevcut olan en az bir sunucuyla açıkça eşleşecek şekilde ayarlayın.

    ```
    [ips_fixed]
    169.55.164.20 51235
    50.22.123.215 51235
    ```

    Sunucunuz, yalnızca doğrudan eşleri arasında veri mevcut olduğunda eşler arası ağdan tarihsel verileri indirebilir.

    :::tip
    Ripple, tam tarih sunucularından oluşan bir havuz sunmaktadır. `s2.ripple.com` alan adını birkaç kez çözerek bu sunucuların IP adreslerini alabilirsiniz.
    :::

5. Eğer başka bir tam tarih sunucusundan kullanmak üzere bir veritabanı dökümünüz varsa, sunucunuzun yapılandırma dosyasındaki `[import_db]` kısmını içe aktarılacak verilere işaret edecek şekilde ayarlayın. (Aksi takdirde, bu adımı atlayın.)

    ```
    [import_db]
      type=NuDB
      path=/tmp/full_history_dump/
    ```

6. Daha önce `rippled` ile çalışmış olan sunucunuzun mevcut veritabanı dosyalarını silin, eğer herhangi bir dosyanız varsa:

    ```
    rm -r /var/lib/rippled/db/*
    ```

    :::danger
    Kaldırmadan önce saklamak istediğiniz dosyaların bu klasörde bulunmadığından emin olun. Genel olarak, bir `rippled` sunucusunun veritabanı dosyalarının tamamını silmek güvenlidir.
    :::

7. `rippled` sunucusunu başlatın; eğer bir veritabanı dökümünüz varsa bu dökümü içe aktarın:

    ```
    $ /opt/ripple/bin/rippled --conf /etc/opt/ripple/rippled.cfg --import
    ```

    Büyük bir veritabanı dökümünün içe aktarılması birkaç dakika veya hatta saatler alabilir. Bu süre boyunca sunucu tamamen başlamaz ve ağ ile senkronize olmaz.

8. Eğer sunucunuzun yapılandırma dosyasına bir `[import_db]` kısmı eklediyseniz, içe aktarma tamamlandıktan sonra bunu kaldırın.

9. Sunucunuzun mevcut tarih bilgisini [server_info method][] ile izleyin. 

10. Üretim XRP Ledger tarihindeki en eski mevcut defter versiyonu defter indeksi **32570**'dir. 

## Ayrıca Bakınız

- **Kavramlar:**
    - `Defter Tarihi`
    - `rippled Sunucu Modları`
- **Eğitimler:**
    - `Kapasite Planlaması`, özellikle `Disk Alanı`
    - `Çevrimiçi Silmeyi Yapılandırma`
    - `rippled ile Sorun Giderme`
    - `Günlük Mesajlarını Anlama`
- **Referanslar:**
    - [server_info method][]
    - [can_delete method][]
    - `Defter Veri Biçimleri`
    - `rippled Komut Satırı Kullanım Referansı`

