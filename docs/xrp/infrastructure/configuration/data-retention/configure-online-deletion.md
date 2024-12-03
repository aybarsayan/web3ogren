---
title: Çevrimiçi Silme Yapılandırması
seoTitle: Çevrimiçi Silme Yapılandırması için Kılavuz
sidebar_position: 4
description: Sunucunuzun işlem geçmişini ne kadar geriye saklayacağını yapılandırın. Bu kılavuz, çevrimiçi silme işlemini nasıl yapılandıracağınızı adım adım açıklamaktadır.
tags: 
  - çevrimiçi silme
  - yapılandırma
  - rippled
  - defter geçmişi
  - sistem gereksinimleri
keywords: 
  - çevrimiçi silme
  - yapılandırma
  - rippled
  - defter geçmişi
  - sistem gereksinimleri
---

# Çevrimiçi Silme Yapılandırması

Varsayılan yapılandırmada, `rippled sunucusu` `geçmişi siler` en son 2000 `defter sürümünden` daha eski olanları, yaklaşık 15 dakikalık `defter geçmişini` saklayarak (defterler arasındaki mevcut hız temel alınarak). Bu sayfa, `rippled` sunucunuzun silmeden önce ne kadar geçmiş saklayacağını yapılandırma yöntemini açıklar.

## Gereksinimler

:::tip
Bu eğitim, sunucunuzun aşağıdaki gereksinimleri karşıladığını varsayar:
:::

- Desteklenen bir işletim sistemindesiniz: Ubuntu Linux, Red Hat Enterprise Linux (RHEL) veya CentOS.
  
- `rippled` sunucusu zaten `yüklenmiş` ve `çevrimiçi silme` etkinleştirilmiştir.

    Önerilen bir platform için yükleme talimatlarını izlediyseniz, çevrimiçi silme varsayılan olarak etkinleştirilmiştir.

- Sunucunuzun `yeterli disk alanı` mevcut, seçtiğiniz miktarda geçmişi defter deposunda saklamak için.

## Yapılandırma Adımları

Sunucunuzun sakladığı tarih miktarını değiştirmek için şu adımları izleyin:

1. Ne kadar defter sürümüne ait geçmiş saklayacağınızı karar verin.

    Yeni defter sürümleri genellikle 3 ila 4 saniye aralıklarla doğrulanır, bu nedenle defter sürüm sayısı, saklamak istediğiniz süre ile yaklaşık olarak ilişkilidir. Farklı yapılandırmalar için ne kadar depolama gerektiği hakkında daha fazla bilgi için `Kapasite Planlaması` kısmına bakın.

    > Çevrimiçi silme, geçmiş silindikten sonra kaç defter sürümünün saklanacağına dayanır; bu nedenle, saklamak istediğinizden iki kat daha fazla defteri saklayacak kadar disk alanına sahip olmalısınız.
    
2. `rippled` yapılandırma dosyanızda, `[node_db]` bölümündeki `online_delete` alanını düzenleyin.

    ```plaintext
    [node_db]
    # Diğer ayarlar değiştirilmeden ...
      online_delete=300000
      advisory_delete=0
    ```

    `online_delete` değerini, çevrimiçi silme işleminden sonra saklanacak minimum defter sürümü sayısı olarak ayarlayın. Otomatik silme (varsayılan) ile sunucu, genellikle yaklaşık bu kadar defter sürümü biriktiğinde silme işlemi gerçekleştirir.

    partial file="/docs/_snippets/conf-file-location.md" /%}

3. `rippled` hizmetini başlatın (veya yeniden başlatın).

    ```shell
    $ sudo systemctl restart rippled
    ```

4. Sunucunuzun ağa senkronize olması için bekleyin.

    Ağınızın ve sisteminizin yeteneklerine göre ve sunucunuzun ne kadar süre çevrimdışı kaldığına bağlı olarak, tam senkronizasyon sağlanması 5 ila 15 dakika arasında sürebilir.

    Sunucunuz ağ ile senkronize olduğunda, [server_info yöntemi][] `"full"`, `"proposing"` veya `"validating"` değerini rapor eder.

5. Sunucunuzun `complete_ledgers` aralığını periyodik olarak kontrol edin; [server_info yöntemi][] kullanarak defterlerin silindiğini doğrulayın.

    Çevrimiçi silme işlemi gerçekleştikten sonra, `complete_ledgers` aralığı daha eski defterlerin artık mevcut olmadığını yansıtır. Sunucunuz geçmişi biriktirdikçe, mevcut toplam defter sayısı ayarladığınız `online_delete` değerinin iki katına çıkana kadar yavaşça artmalı ve ardından çevrimiçi silme işlemi gerçekleştirildiğinde azalmalıdır.

6. `rippled` günlüklerinizi `SHAMapStore::WRN` ile başlayan mesajlar için izleyin. Bu, sunucunuzun ağ ile senkronizasyondan çıktığı için `çevrimiçi silmenin kesintiye uğradığını` gösterebilir.

    :::warning
    Bu durum düzenli olarak oluyorsa, sunucunuz çevrimiçi silme işlemi sırasında defteri güncel tutacak yeterli donanıma sahip olmayabilir. Aynı donanımdaki diğer hizmetlerin (zamanlanmış yedeklemeler veya güvenlik taramaları gibi) `rippled` sunucusu ile kaynaklar için rekabet etmediğinden emin olun.
    :::

    Aşağıdakilerden herhangi birini denemek isteyebilirsiniz:

    - Sistem özelliklerinizi artırın. Öneriler için `Sistem Gereksinimleri` kısmına bakın.
    - Yapılandırmanızı daha az geçmiş saklayacak şekilde değiştirin.
    - Sunucunuzun `node_size` parametresini` değiştirin.
    - Defter deposu için `NuDB kullanın` yerine RocksDB.
    - `Danışman Silme kullanarak çevrimiçi silmeyi zamanlayın`.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Defter Geçmişi`
        - `Çevrimiçi Silme`
- **Eğitimler:**
    - `Danışman Silmeyi Yapılandırın`
    - `Geçmiş Bölgelemesi Yapılandırın`
    - `Kapasite Planlaması`
- **Referanslar:**
    - [server_info yöntemi][]
    - `Defter Veri Formatları`

