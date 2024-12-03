---
title: Ubuntu veya Debian Linux Üzerinde Kurulum
seoTitle: Ubuntu veya Debianda rippled Kurulum Rehberi
sidebar_position: 1
description: Ubuntu Linux üzerinde rippled ikili dosyasını kurma adımlarını ve sistem gereksinimlerini detaylı olarak anlatır. Bu sayfa, gerekli adımları takip ederek kurulumu gerçekleştirmek isteyenler için hazırlanmıştır.
tags: 
  - rippled
  - Ubuntu
  - Debian
  - kurulum
  - sistem gereksinimleri
  - API
  - GPG anahtarı
keywords: 
  - rippled
  - Ubuntu
  - Debian
  - kurulum
  - sistem gereksinimleri
  - API
  - GPG anahtarı
---

# Ubuntu veya Debian Linux Üzerinde Kurulum

Bu sayfa, `rippled`'in en son kararlı sürümünü **Ubuntu Linux 18.04 veya daha üstü** veya **Debian 10 veya daha üstü** üzerinde kurmak için önerilen talimatları tanımlar ve [`apt`](https://ubuntu.com/server/docs) aracını kullanır.

:::note
Bu talimatlar, Ripple tarafından derlenmiş bir ikili dosya kurar.
:::

## Ön Gereksinimler

`rippled`'i kurmadan önce, `Sistem Gereksinimleri` ile ilgili gereklilikleri yerine getirmeniz gerekir.

## Kurulum Adımları

1. Depoları güncelleyin:
    ```
    sudo apt -y update
    ```

2. Araçları kurun:
    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3. Ripple'ın paket imzalama GPG anahtarını güvenilir anahtarlar listenize ekleyin:
    ```
    sudo install -m 0755 -d /etc/apt/keyrings && \
        wget -qO- https://repos.ripple.com/repos/api/gpg/key/public | \
        sudo gpg --dearmor -o /etc/apt/keyrings/ripple.gpg
    ```

4. Yeni eklenen anahtarın parmak izini kontrol edin:
    ```
    gpg --show-keys /etc/apt/keyrings/ripple.gpg
    ```
    Çıktıda Ripple için aşağıdaki gibi bir giriş yer almalıdır:
    ```
    pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
        C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
    uid           TechOps Team at Ripple <techops+rippled@ripple.com>
    sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]
    ```
    Özellikle, parmak izinin eşleştiğinden emin olun. (Yukarıdaki örnekte parmak izi, `C001` ile başlayan ikinci satırda yer alıyor.)

5. İşletim sistemi sürümünüz için uygun Ripple deposunu ekleyin:
    ```
    echo "deb [signed-by=/etc/apt/keyrings/ripple.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

    Yukarıdaki örnek **Ubuntu 20.04 Focal Fossa** için uygundur. Diğer işletim sistemleri için, `focal` kelimesini aşağıdakilerden biriyle değiştirin:

    - **Debian 10 Buster** için `buster`
    - **Debian 11 Bullseye** için `bullseye`
    - **Debian 12 Bookworm** için `bookworm`
    - **Ubuntu 18.04 Bionic Beaver** için `bionic`
    - **Ubuntu 22.04 Jammy Jellyfish** için `jammy`
    - **Ubuntu 24.04 Noble Numbat** için `noble`

    Eğer `rippled`'in geliştirici veya ön sürüm sürümlerine erişmek istiyorsanız, `stable` yerine şunlardan birini kullanın:

    - `unstable` - Ön sürüm derlemeleri ([`release` dalı](https://github.com/XRPLF/rippled/tree/release))
    - `nightly` - Deneysel/geliştirme derlemeleri ([`develop` dalı](https://github.com/XRPLF/rippled/tree/develop))

    :::danger
    Kararsız ve gece yapıları herhangi bir zamanda bozulabilir. Bu yapıların üretim sunucuları için kullanılmaması önerilir.
    :::

6. Ripple deposunu içerecek şekilde paket indeksini güncelleyin ve `rippled`'i kurun.
    ```
    sudo apt -y update && sudo apt -y install rippled
    ```

7. `rippled` servisinin durumunu kontrol edin:
    ```
    systemctl status rippled.service
    ```
    `rippled` servisi otomatik olarak başlamalıdır. Eğer başlamazsa, manuel olarak başlatabilirsiniz:
    ```
    sudo systemctl start rippled.service
    ```

8. İsteğe bağlı: `rippled`'in ayrıcalıklı portlara bağlanmasına izin verin.
    Bu, gelen API isteklerini port 80 veya 443 üzerinde sunmanıza olanak tanır. (Bunu yapmak istiyorsanız, yapılandırma dosyasının port ayarlarını da güncellemelisiniz.)
    ```
    sudo setcap 'cap_net_bind_service=+ep' /opt/ripple/bin/rippled
    ```

9. İsteğe bağlı: çekirdek dökümlerini yapılandırın
    Varsayılan olarak Ubuntu, çökme hatalarını gidermek için yararlı çekirdek dosyaları üretmek için yapılandırılmamıştır. 
    Önce şunu çalıştırın:
    ```
    ulimit -c unlimited
    ```
    Şimdi `sudo systemctl edit rippled` komutunu çalıştırın. Varsayılan düzenleyici açılmalı ve şunu ekleyin:
    ```
    [Service]
    LimitCORE=infinity
    ```

    Bu, `/etc/systemd/system/rippled.service.d/override.conf` dosyasını oluşturur ve çekirdek dökümlerini kaydetmek için işletim sistemini yapılandırır, `rippled` paketinin sağladığı hizmet dosyasını değiştirmeden. Sunucunuz çökerse, çekirdek dökümünü `/var/lib/apport/coredump/` dizininde bulabilirsiniz. Çekirdek dökümünü incelemek için, aşağıdakine benzer bir komut kullanın:
    ```
    gdb /opt/ripple/bin/rippled /var/lib/apport/coredump/core
    ```
    :::info
    Bu şekilde bir çekirdek dosyasını incelemek için, `rippled-dbgsym` paketinin kurulu olması gerekir ve çekirdek dökümleri dizinindeki dosyaları okumak için izne ihtiyacınız vardır.
    :::

## Sonraki Adımlar

partial file="/docs/_snippets/post-rippled-install.md" /%}

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu
    - `Konsensüs`
- **Eğitimler:**
    - `rippled'i yapılandırma`
    - `rippled sorun giderme`
    - `rippled API ile Başlarken`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı
        - [server_info yöntemi][]
    
