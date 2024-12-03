---
title: rippled v1.3.x Göç Talimatları
seoTitle: rippled v1.3.x Migration Instructions
sidebar_position: 4
description: Bu talimatlar, rippled paketini 1.2.xden 1.3.xe nasıl yükselteceğinizi adım adım açıklamaktadır. Yükseltme prosedürü ve öneriler hakkında detaylı bilgi edinin.
tags: 
  - rippled
  - yükseltme
  - Linux
  - Ubuntu
  - CentOS
  - RHEL
  - geçiş talimatları
keywords: 
  - rippled
  - yükseltme
  - Linux
  - Ubuntu
  - CentOS
  - RHEL
  - geçiş talimatları
---

# rippled v1.3.x Göç Talimatları

Bu belge, `rippled` 1.2.4 veya daha eski sürümden `rippled` v1.3 veya daha yeni sürüme geçiş sürecini açıklamaktadır. Bu geçiş süreci, `rippled` kurulum sürecinin 1.3 sürümü itibarıyla değişmesi nedeniyle gereklidir.

Bu belge, desteklenen platformlarda yükseltme için geçiş adımlarını sağlamaktadır:

- `CentOS veya Red Hat Enterprise Linux (RHEL)`
- `Ubuntu Linux`

Diğer platformlar için, kaynak koddan derleme talimatlarını güncellenmiş olarak inceleyin. (`Ubuntu`, `macOS` veya [Windows](https://github.com/XRPLF/rippled/tree/develop/Builds/VisualStudio2017))

---

## CentOS veya Red Hat Enterprise Linux (RHEL) Üzerinde Geçiş

Ripple'ın resmi RPM deposu ve kullanım talimatları değişmiştir. Eğer `otomatik güncellemeler` etkin durumda ise, sisteminizin geçişi otomatik olarak gerçekleştirmesi gerekir. Eski depodan yeni depoya manuel olarak geçmek için aşağıdaki adımları tamamlayın:

1. `rippled` sunucusunu durdurun.

    ```
    $ sudo systemctl stop rippled.service
    ```

2. Eski Ripple depo paketini kaldırın.

    ```
    $ sudo rpm -e ripple-repo
    ```

    `rippled-repo` paketi artık **KULLANIMDIŞI**. Paket, 1.3.1 sürümü için bir kez daha güncellenmiştir. Gelecekte, depolardaki herhangi bir değişiklik, `ripple.repo` dosyasında manual değişiklik yapmayı gerektirecektir. 

3. Ripple'ın yeni yum deposunu ekleyin:

    ```
    $ cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-stable]
    name=XRP Ledger Paketleri
    baseurl=https://repos.ripple.com/repos/rippled-rpm/stable/
    enabled=1
    gpgcheck=0
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
    repo_gpgcheck=1
    REPOFILE
    ```

4. Yeni `rippled` paketini yükleyin:

    ```
    $ sudo yum install rippled
    ```

    Versiyon 1.3.1, config dosyalarınızda (`rippled.cfg` ve `validators.txt`) herhangi bir değişiklik gerektirmemektedir. Bu güncelleme prosedürü mevcut config dosyalarınızı yerinde bırakmaktadır.

5. systemd birimi dosyalarını yeniden yükleyin:

    ```
    $ sudo systemctl daemon-reload
    ```

6. `rippled` hizmetini başlatın:

    ```
    $ sudo systemctl start rippled.service
    ```

---

:::danger Uyarı
Eğer `otomatik güncellemeleri` kullanıyorsanız, bu geçiş sürecini gerçekleştirdikten sonra devam etmelidir. Ancak, **`ripple-repo` paketi artık kullanılmıyor**. Sonuç olarak, gelecekte, Ripple'ın depolarındaki herhangi bir değişiklik, repo dosyanızı manuel olarak güncellemeyi gerektirebilir.
:::

---

## Ubuntu Linux Üzerinde Geçiş

Versiyon 1.3'ten önce, Ubuntu Linux'ta `rippled` kurmanın desteklenen yolu RPM paketini yüklemek için Alien kullanmaktı. `rippled` v1.3.1 ile birlikte Ripple, Ubuntu ve Debian Linux için yerel bir paket sağlamaktadır ve bu, önerilen yükleme yoludur. Eğer zaten RPM paketi yüklüyse, paketi yükseltmek ve yerel APT (`.deb`) paketine geçiş yapmak için `yükleme adımlarını` tamamlayın.

Eğer config dosyalarınızda (`/opt/ripple/etc/rippled.cfg` ve `/opt/ripple/etc/validators.txt`) herhangi bir değişiklik yaptıysanız, `apt` yükleme sırasında config dosyalarınızı paketlerden en yeni sürümleriyle değiştirmek isteyip istemediğinizi sorabilir. Versiyon 1.3, config dosyasında herhangi bir değişiklik gerektirmemektedir, bu nedenle mevcut config dosyalarınızı güvenle değiştirmeden tutabilirsiniz.

1. 1.3 için yerel APT paketini yükledikten sonra, hizmeti yeniden yüklemeniz/yeniden başlatmanız gerekmektedir:

    1. systemd birimi dosyalarını yeniden yükleyin:

        ```
        $ sudo systemctl daemon-reload
        ```

    2. `rippled` hizmetini yeniden başlatın:

        ```
        $ sudo systemctl restart rippled.service
        ```

Eğer başka paketler için Alien'i artık kullanmıyorsanız, aşağıdaki adımları kullanarak isteğe bağlı olarak onu ve bağımlılıklarını kaldırabilirsiniz:

1. Alien'i kaldırın:

    ```
    $ sudo apt -y remove alien
    ```

2. Kullanılmayan bağımlılıkları kaldırın:

    ```
    $ sudo apt -y autoremove
    ```

---

### Otomatik Güncellemeler

`rippled` v1.3 paketi, Ubuntu ve Debian Linux'ta çalışan güncellenmiş bir otomatik güncelleme betiği içermektedir. Daha fazla bilgi için `rippled'yi Linux'ta Otomatik Güncelle` sayfasını ziyaret edin.

## Ayrıca Bakınız

- **[`rippled` v1.3.1 Sürüm Notları](https://github.com/XRPLF/rippled/releases/1.3.1)**
- **Kavramlar:**
    - `rippled` Sunucusu
    - `Konsensüs`
- **Eğitimler:**
    - `Linux'ta Otomatik Güncelle`
    - `rippled ile Sorun Giderme`
    - `rippled API ile Başlayın`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı
        - [server_info yöntemi][]