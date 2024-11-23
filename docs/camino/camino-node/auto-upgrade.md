---
sidebar_position: 6
title: Node'u Otomatik Olarak Yükselt
description: Camino Node'u Otomatik Olarak Yükseltme
---

# Camino Node'u Otomatik Olarak Yükseltme

Bu kılavuz, bir bash betiği ve crontab kullanarak camino-node'u otomatik olarak nasıl yükselteceğinizi anlatmaktadır.

## Otomatik Kurulum Betiği

Daha önce camino-node'u autoinstall betiği ile yüklediyseniz, aşağıdaki adımları takip ederek otomatik bir güncelleme yapılandırabilirsiniz:

### Node Yükseltici Betiğini İndirin

Öncelikle, node yükseltici betiğini indirin. Bu betiği düğümün işletim sisteminde herhangi bir yere yerleştirebilirsiniz. Bu kılavuz için betiği `/root` dizinine koyduğunuzu varsayıyoruz.

```
wget -nd -m https://raw.githubusercontent.com/chain4travel/camino-docs/c4t/scripts/camino-node-upgrader.sh;\
chmod 755 camino-node-upgrader.sh
```

**Kullanım:**

Betiğin tek bir seçeneği `-u` vardır ve bu, bir kullanıcı adı argümanı ile takip edilir. Camino-node'u yüklerken kullandığınız kullanıcı adını sağlamalısınız.

```
# ./camino-node-upgrader.sh -h
Kullanım: camino-node-upgrader.sh -u kullanıcı_adı
```

:::note KÖK KULLANICI OLARAK ÇALIŞTIRILMASI GEREKEN

Bu betik, kök kullanıcı ayrıcalıkları ile çalıştırılması amaçlanmıştır.

:::

### Crontab Dosyasını Düzenle

Crontab dosyasını (`/etc/crontab`) düzenleyin ve aşağıdaki satırı ekleyin. Cron hizmetinin betiği çalıştıracağı istenen zamanı seçin.

Aşağıdaki örnekte, betik her gün 08:00'de çalışacak ve çıktısını `/var/log/camino-node-upgrader.log` dosyasına kaydedecektir. Betiğin hangi işlemleri yaptığını gözden geçirmek için bu dosyayı kontrol edebilirsiniz.

:::tip YÜKSELTME ZAMANINI KİŞİSELLEŞTİR

Sağlanan örneği kullanmak yerine, yükseltme zamanını tercihinize göre ayarlamanız önerilir. Bu, ağdaki tüm düğümlerin aynı anda yükseltilmesini önleyecek ve genel olarak daha pürüzsüz bir yükseltme süreci sağlayacaktır.

:::

```cron
0 8 * * *       root    /root/camino-node-upgrader.sh -u  >> /var/log/camino-node-upgrader.log 2>&1
```

:::tip KULLANICI ADINI DEĞİŞTİR

Kaydetmeden önce, crontab girişindeki `` kısmını uygun kullanıcı adı ile değiştirdiğinizden emin olun.

:::

:::caution Otomatik Yükseltmeler İçin Önemli Önlemler

Otomatik yükseltmelerin her zaman belirli riskler taşıdığını unutmayın. Yükseltme sürecinde karşılaşılabilecek beklenmedik sorunları ele almak için bir yedekleme planının olması önemlidir. En önemlisi, düğümünüzün stake anahtarlarını yedeklediğinizden emin olun.

:::

### Betikten Örnek Çıktı

İşte `v0.4.9` versiyonundan `v1.0.0` versiyonuna güncellenen bir düğümden alınan örnek çıktı.

```
*** Yükseltme işlemi başlatılıyor kullanıcı: camino ***
*** Tarih: Per Şub 27 22:36:01 UTC 2023 ***
Camino-node systemd servisi bulundu...
Ortam hazırlanıyor...
amd64 mimarisi bulundu...
Son sürüm kontrol ediliyor... son camino-node versiyonu: v1.0.0
Mevcut çalışan düğüm versiyonu alınıyor... mevcut çalışan camino-node versiyonu: v0.4.9
Mevcut Düğüm versiyonu (v0.4.9) en son (v1.0.0) değil
Camino-node yükseltiliyor...
Servis durduruluyor... tamamlandı @Per Şub 27 22:36:02 UTC 2023
Düğüm versiyonu bulundu.
İndirilmeye çalışılıyor: https://github.com/chain4travel/camino-node/releases/download/v1.0.0/camino-node-linux-amd64-v1.0.0.tar.gz

     0K .......... .......... .......... .......... ..........  0% 1.51M 19s
    50K .......... .......... .......... .......... ..........  0% 2.03M 17s
   100K .......... .......... .......... .......... ..........  0% 4.15M 13s
   150K .......... .......... .......... .......... ..........  0% 8.02M 11s
--------------------8 "camino-node-linux-amd64-v1.0.0.tar.gz" [1]
Düğüm dosyaları çıkarılıyor...
camino-node-v1.0.0/tools/
camino-node-v1.0.0/tools/cert
camino-node-v1.0.0/LICENSE
camino-node-v1.0.0/plugins/
camino-node-v1.0.0/camino-node
Düğüm dosyaları /home/camino/camino-node dizinine çıkarıldı.
Düğüm yükseltildi, servis başlatılıyor... tamamlandı @Per Şub 27 22:36:08 UTC 2023
Yeni düğüm versiyonu:
camino-node: v1.0.0, commit: c403cb6
caminogo: v1.0.0-rc1, commit: 0c5035f69
  uyumluluk: v1.0.0 [veritabanı: v1.4.5]
Tamamlandı!
```

Eğer en son yayımlanan düğüm versiyonu, zaten kurulu olan versiyonla aynı ise, çıktı şöyle görünecektir:

```
*** Yükseltme işlemi başlatılıyor kullanıcı: camino ***
*** Tarih: Per Şub 27 22:37:01 UTC 2023 ***
Camino-node systemd servisi bulundu...
Ortam hazırlanıyor...
amd64 mimarisi bulundu...
Son sürüm kontrol ediliyor... son camino-node versiyonu: v1.0.0
Mevcut çalışan düğüm versiyonu alınıyor... mevcut çalışan camino-node versiyonu: v1.0.0
Mevcut düğüm versiyonu (v1.0.0) en son (v1.0.0). Atlanıyor...
```

## Docker Compose

Eğer camino-node'u Docker ile yüklediyseniz, aşağıdaki yapılandırma ile otomatik yükseltmeleri etkinleştirebilirsiniz:

### Docker Compose'a Watchtower Ekleyin

Otomatik yükseltmeler için camino-node konteynerine otomatik yükseltmeleri etkinleştirmek amacıyla Docker Compose dosyanıza Watchtower hizmetini ekleyin.

```yaml
version: "3.1"

services:
  camino:
    image: c4tplatform/camino-node:latest
    ports:
      - 9650:9650
      - 9651:9651
    volumes:
      - ./camino-data:/root/.caminogo
    # Düğümünüzün genel IP adresini  ile değiştirin
    command:
      [
        "./camino-node",
        "--network-id=camino",
        "--public-ip=",
        "--http-host=0.0.0.0",
      ]
    restart: always
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: always
    environment:
      WATCHTOWER_POLL_INTERVAL: 86400
      WATCHTOWER_CLEANUP: "true"
      WATCHTOWER_DEBUG: "true"
      WATCHTOWER_LABEL_ENABLE: "true"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

#### Watchtower Poll Aralığını Kişiselleştirin:

Yukarıdaki `WATCHTOWER_POLL_INTERVAL` değerini (saniye cinsinden) istediğiniz anket aralığına değiştirebilirsiniz. Sağlanan örnekte, bu değer 24 saat olarak ayarlanmıştır, Watchtower'ın varsayılan değeridir.

#### Genel IP'nizi Belirleyin:

Komut satırında genel IP adresinizi belirtmeyi unutmayın.