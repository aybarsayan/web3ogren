---
title: yum ile CentOS/Red Hat üzerine kurulum
seoTitle: yum Installation on CentOS/Red Hat
sidebar_position: 4
description: CentOS veya Red Hat üzerinde rippled kurulumuna dair adımları anlatmaktadır.
tags: 
  - rippled
  - CentOS
  - Red Hat
  - yum
  - kurulum
  - XRP Ledger
  - sistem gereksinimleri
keywords: 
  - rippled
  - CentOS
  - Red Hat
  - yum
  - kurulum
  - XRP Ledger
  - sistem gereksinimleri
---

## yum ile CentOS/Red Hat üzerine kurulum

Bu sayfa, **CentOS 7** veya **Red Hat Enterprise Linux 7** üzerinde `rippled`'in en son kararlı sürümünün kurulumuna yönelik önerilen talimatları açıklamaktadır. Ripple'ın [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) deposunu kullanarak.

Bu talimatlar Ripple tarafından derlenmiş bir ikili dosyayı kurar.

## Ön Koşullar

`rippled`'i kurmadan önce `Sistem Gereksinimlerini` karşılamanız gerekmektedir.

:::info 
Ripple'di kurulumundan önce sisteminizin güncel olduğundan emin olun. Bu, kurulum sürecinde olası sorunları önlemenize yardımcı olacaktır.
:::

## Kurulum Adımları

1. Ripple RPM deposunu kurun:

    İstediğiniz sürümlerin kararlılığı için uygun RPM deposunu seçin:

    - `stable` en son üretim sürümü için (`master` dalı)
    - `unstable` ön sürüm derlemeleri için (`release` dalı)
    - `nightly` deneysel/geliştirme derlemeleri için (`develop` dalı)

    

    ```Stable
    cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-stable]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/stable/
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
    REPOFILE
    ```

    ```Pre-release
    cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-unstable]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/unstable/
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/unstable/repodata/repomd.xml.key
    REPOFILE
    ```

    ```Development
    cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-nightly]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/nightly/
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/nightly/repodata/repomd.xml.key
    REPOFILE
    ```

    

2. En son repo güncellemelerini çekin:

    ```
    sudo yum -y update
    ```

3. Yeni `rippled` paketini kurun:

    ```
    sudo yum install rippled
    ```

4. systemd birim dosyalarını yeniden yükleyin:

    ```
    sudo systemctl daemon-reload
    ```

5. `rippled` hizmetini açılışta başlatmak için yapılandırın:

    ```
    sudo systemctl enable rippled.service
    ```

6. `rippled` hizmetini başlatın:

    ```
    sudo systemctl start rippled.service
    ```

:::tip
Kurulumdan sonra, `rippled` hizmetinin düzgün bir şekilde çalıştığını ve kaydedildiğini kontrol etmek için aşağıdaki komutu kullanabilirsiniz:
```
sudo systemctl status rippled.service
```
:::

## Sonraki Adımlar

partial file="/docs/_snippets/post-rippled-install.md" /%}

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu`
    - `Konsensüs`
- **Eğitimler:**
    - `rippled'i yapılandırma`
    - `rippled ile sorun giderme`
    - `rippled API ile Başlayın`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı`
        - [server_info metodu][]