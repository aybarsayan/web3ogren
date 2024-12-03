---
title: Manuel Güncelleme
seoTitle: CentOS ve Red Hatta rippled Nasıl Güncellenir?
sidebar_position: 4
description: Bu kılavuz, CentOS veya Red Hat Enterprise Linuxta rippledin manuel güncellenmesi için gerekli adımları sağlar. Adımlar açık bir şekilde açıklanmıştır.
tags: 
  - CentOS
  - Red Hat
  - rippled
  - güncelleme
  - sistemd
keywords: 
  - CentOS
  - Red Hat
  - rippled
  - güncelleme
  - GPG anahtarı
  - sistemd
---

## CentOS/Red Hat'ta Manuel Güncelleme

Bu sayfa, CentOS veya Red Hat Enterprise Linux'ta `rippled`'in en son sürümüne nasıl manuel olarak güncelleneceğini açıklar. Ripple, mümkünse `otomatik güncellemeleri` ayarlamanızı önerir.

:::info
Bu talimatların, `yum` depo adresinden `rippled`'i `yüklediğinizi` varsaydığını unutmayın.
:::

:::tip Bu adımları bir seferde gerçekleştirmek için, `rippled` paketinin bir parçası olan `/opt/ripple/bin/update-rippled.sh` betiğini çalıştırabilirsiniz. Bu betiğin `sudo` kullanıcısı olarak çalıştırılması gerekir.:::

Manuel olarak güncellemek için aşağıdaki adımları tamamlayın:

1. `rippled` 1.7.0 sürümüne daha önceki bir sürümden geçiyorsanız, Ripple'ın güncellenmiş GPG anahtarını almak için depoyu yeniden ekleyin. Aksi takdirde, bu adımı atlayın:

    ```
    $ cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-stable]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/stable
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
    REPOFILE
    ```

2. En son `rippled` paketini indirin ve yükleyin:

    ```
    $ sudo yum update rippled
    ```

    Bu güncelleme prosedürü mevcut yapılandırma dosyalarınızı yerinde bırakır.

3. `systemd` birim dosyalarını yeniden yükleyin:

    ```
    $ sudo systemctl daemon-reload
    ```

4. `rippled` servisini yeniden başlatın:

    ```
    $ sudo service rippled restart
    ```

---

## Ayrıntılı Bilgi

- **Kavramlar:**
    - `rippled` Sunucusu
    - `Konsensüs`
- **Eğitimler:**
    - `rippled` v1.3.x Geçiş Talimatları
    - `rippled'i Hatasını Giderme`
- **Kaynaklar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı
        - [server_info yöntemi][]

