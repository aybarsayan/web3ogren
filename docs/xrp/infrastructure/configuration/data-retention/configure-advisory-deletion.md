---
title: Danışmanlık Silmeyi Yapılandırın
seoTitle: Danışmanlık Silmeyi Yapılandırma Rehberi
sidebar_position: 4
description: Bu rehber, danışmanlık silmeyi yapılandırmak için gerekli adımları ayrıntılı bir şekilde açıklamaktadır. Sunucunuzun performansını artırmak için çevrimiçi silme süreçlerini optimize edin.
tags: 
  - danışmanlık silme
  - XRP Ledger
  - çevrimiçi silme
  - yapılandırma
  - veri saklama
keywords: 
  - danışmanlık silme
  - XRP Ledger
  - çevrimiçi silme
  - yapılandırma
  - veri saklama
---

## Danışmanlık Silmeyi Yapılandırın

Varsayılan yapılandırma dosyası, `rippled` uygulamasını, yeni defter sürümleri mevcut oldukça XRP Ledger durum ve işlemlerinin tarihini otomatik olarak silmek üzere ayarlamaktadır. Sunucunuz yoğun saatlerde donanım kaynaklarının çoğunu kullanıyorsa, sunucuyu, çevrimdışı saatler sırasında çalıştırılması planlanan bir komut tarafından tetiklendiğinde defterleri silmek üzere yapılandırabilirsiniz, böylece çevrimiçi silmenin **sunucu performansını** etkileme olasılığı azalır.

---

## Ön Gereksinimler

Bu öğretici, sunucunuzun aşağıdaki ön gereksinimleri karşıladığını varsayıyor:

- Desteklenen bir işletim sistemi kullanıyorsunuz: Ubuntu Linux, Red Hat Enterprise Linux (RHEL) veya CentOS.
- `rippled` sunucusu zaten **yüklenmiş** ve **çevrimiçi silme** etkin durumda.

    Varsayılan yapılandırma dosyası, çevrimiçi silmeyi 2000 defter sürümünden sonra etkinleştirir.

- Bir `cron` daemon'u yüklenmiş ve çalışıyor.

    Ubuntu Linux varsayılan olarak bir `cron` daemon'u çalıştırır.

    RHEL veya CentOS üzerinde, `cronie` paketini yükleyebilirsiniz:

    ```bash
    $ sudo yum install cronie
    ```

- Sunucunuzun defter deposunda seçtiğiniz miktarda geçmişi depolamak için yeterli disk alanı var.

    Farklı yapılandırmalar için ne kadar depolama gerektiğini görmek için `Kapasiye Planlaması` sayfasına bakın. Danışmanlık silme etkinse, sunucunun silmeden önce biriktirebileceği maksimum tarih, `online_delete` ayarındaki defter sürüm sayısı ile çevrimiçi silme istemi arasındaki süre kadar zamandır.

- Sunucunuz için en az meşgul saatlerin hangi saatler olduğunu biliyorsunuz.

---

## Yapılandırma Adımları

Günlük bir programla danışmanlık silmeyi yapılandırmak için aşağıdaki adımları izleyin:

1. `rippled` yapılandırma dosyanızın `[node_db]` bölümünde `advisory_delete`'i etkinleştirin.

    ```ini
    [node_db]
    # Diğer ayarlar değişmeden ...
      online_delete=300000
      advisory_delete=1
    ```

    - `advisory_delete`'i `1` olarak ayarlayın, böylece çevrimiçi silme yalnızca tetiklendiğinde çalıştırılır. (Yeni defter sürümleri mevcut oldukça otomatik çalıştırmak için `0` olarak ayarlayın.)
    - `online_delete`'i çevrimiçi silme çalıştırıldıktan sonra saklanacak en az defter sürüm sayısına ayarlayın. Sunucu çevrimiçi silme çalıştırılana kadar bundan daha fazla tarih biriktirir.

    partial file="/docs/_snippets/conf-file-location.md" /%}

2. Sunucunun çevrimiçi silmeyi çalıştırması için [can_delete method][]'unu test edin.

    Bu komutu çalıştırmak için `rippled` komut satırı arayüzünü kullanabilirsiniz. Örneğin:

    ```bash
    $ rippled --conf=/etc/opt/ripple/rippled.cfg can_delete now
    ```

    Yanıt, sunucunun defter deposundan silebileceği maksimum defter indeksini belirtir. Örneğin, aşağıdaki mesaj, 43633667 defter indeksine kadar ve dahil olarak defter sürümlerinin silinebileceğini gösterir:

    ```json
    {
      "result": {
        "can_delete": 43633667,
        "status": "success"
      }
    }
    ```

    Sunucu yalnızca, kendisinde bulunan **_daha yeni_** onaylı defter sürümlerinin sayısı `online_delete` ayarına eşit ya da daha büyük olduğunda bu defter sürümlerini siler.

3. Önceki adımda test ettiğiniz `can_delete` methodunu belirlenen bir zamanda çalıştırmak için `cron` daemon'unuzu yapılandırın.

    `cron` yapılandırmanızı düzenleyin:

    ```bash
    $ crontab -e
    ```

    Aşağıdaki örnek, sunucunun her gün sabah 1:05'de silme işlemini gerçekleştirmesini ayarlar:

    ```bash
    5 1 * * * rippled --conf /etc/opt/ripple/rippled.cfg can_delete now
    ```

    Komutun, sunucunuzun yapılandırılmış zaman dilimine dayanarak çalışmasını planladığınızdan emin olun.

    :::tip
    Eğer `advisory_delete` devre dışıysa, çevrimiçi silmeyi çalıştırmak için bir `cron` işi planlamanıza gerek yoktur. Bu durumda, `rippled` en eski ile mevcut onaylı defter sürümleri arasındaki fark en az `online_delete` değeri kadar olduğunda çevrimiçi silmeyi otomatik olarak çalıştırır.
    :::

4. `rippled` hizmetini başlatın (veya yeniden başlatın).

    ```bash
    $ sudo systemctl restart rippled
    ```

5. Planlandığı gibi defterlerin silindiğini doğrulamak için [server_info method][]'unu kullanarak sunucunuzun `complete_ledgers` aralığını periyodik olarak kontrol edin.

    `complete_ledgers` içindeki en düşük defter indeksi, çevrimiçi silme sonrasında artmalıdır.

    Silme işlemi, sunucunuzun ne kadar meşgul olduğuna ve bir kerede ne kadar geçmiş sildiğinize bağlı olarak tamamlanması birkaç dakika sürebilir.

---

## Sorun Giderme

Eğer yapılandırdıktan sonra çevrimiçi silmenin çalışmadığını düşünüyorsanız, aşağıdakileri deneyin:

- `cron` işini yapılandıran kullanıcının `rippled` sunucusunu komut satırı istemcisi olarak çalıştırma yetkisine sahip olduğunu kontrol edin.
- `cron` işinizin sözdizimini ve ne zaman çalışması gerektiğini kontrol edin.
- `cron` yapılandırmanızda belirtilen yolda `rippled` çalıştırılabilir dosyasının mevcut olduğunu kontrol edin. Gerekirse, çalıştırılabilir dosyanın mutlak yolunu belirtebilirsiniz, örneğin `/opt/ripple/bin/rippled`.
- `rippled` günlüklerinde `SHAMapStore::WRN` ile başlayan mesajları kontrol edin. Bu, sunucunuzun ağla senkronizesinin bozulmasından dolayı **çevrimiçi silmenin kesintiye uğradığını** gösterebilir.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Defter Geçmişi`
        - `Çevrimiçi Silme`
- **Eğitimler:**
    - `Çevrimiçi Silmeyi Yapılandırın`
    - `rippled ile Sorun Giderme`
    - `Günlük Mesajlarını Anlama`
- **Referanslar:**
    - [server_info method][]
    - [can_delete method][]
    - [logrotate method][]
    - `Defter Veri Formatları`

