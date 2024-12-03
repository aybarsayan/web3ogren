---
title: Linuxta Otomatik Güncelleme
seoTitle: Linuxta rippled için Otomatik Güncellemeler
sidebar_position: 4
description: Linux üzerinde rippled otomatik güncellemeleri ayarlayın. Bu kılavuz, otomatik güncelleme sürecini adım adım açıklar ve dikkat edilmesi gereken önemli noktaları vurgular.
tags: 
  - Linux
  - rippled
  - otomatik güncelleme
  - cron
  - sunucu yönetimi
  - güvenlik
  - yazılım güncellemeleri
keywords: 
  - Linux
  - rippled
  - otomatik güncelleme
  - cron
  - sunucu yönetimi
  - güvenlik
  - yazılım güncellemeleri
---

# Linux'ta Otomatik Güncelleme

Linux üzerinde, `rippled`'i en son sürüme otomatik olarak yükseltmek için bir kerelik bir `cron` yapılandırması ayarlayabilirsiniz. Ripple, mümkünse otomatik güncellemeleri etkinleştirmeyi önermektedir.

Bu talimatlar, `rippled`'i `yum` deposundan (CentOS/RedHat) veya `apt` ile (Ubuntu/Debian) kurduğunuzu varsayar.

Otomatik güncellemeleri ayarlamak için aşağıdaki adımları tamamlayın:

1. `/opt/ripple/etc/update-rippled-cron` dosyasının mevcut olduğunu kontrol edin. Eğer yoksa, manuely güncelleyin (`CentOS/Red Hat` veya `Ubuntu/Debian`).

2. `cron.d` klasörünüzde `/opt/ripple/etc/update-rippled-cron` yapılandırma dosyasına bir symlink oluşturun:

    ```
    sudo ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
    ```

    Bu yapılandırma, her yeni sürümden bir saat içinde kurulu `rippled` paketini güncellemek için bir script çalıştırır. Birçok sunucunun aynı anda güncellenmesinden dolayı ağ kararsızlığını önlemek için, bu script otomatik olarak sunucuyu yeniden başlatmaz, bu nedenle eski sürüm çalışmaya devam eder.

    badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1Güncellendi: rippled 1.8.1/badge %}

3. **Yeni bir sürüm çıktığında,** `rippled` servisinizin güncellenmiş yazılıma geçiş yapması için manuel olarak yeniden başlatmanız gerekmektedir.

    ```
    sudo systemctl restart rippled.service
    ```

:::warning
Gelecekte, Ripple'ın depolarında yapılan değişiklikler, scriptinizin güncellemeleri aradığı URL'lerde manuel müdahale gerektirebilir. Gerekli değişiklikler hakkında duyurular için `XRP Ledger Blog` veya [ripple-server posta listesi](https://groups.google.com/forum/#!forum/ripple-server) ile güncel kalın.
:::

## Ayrıca Bakın

- **Kavramlar:**
    - `rippled` Sunucusu
    - `Konsensüs`
- **Eğitimler:**
    - `Kapalı Planlama`
    - `rippled Hata Ayıklama`
- **Referanslar:**
    - `rippled` API Referansı
        - `rippled` Komut Satırı Kullanımı
        - [server_info metodu][]
        
