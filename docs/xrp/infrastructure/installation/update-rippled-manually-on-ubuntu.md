---
title: Ubuntu veya Debianda Manuel Güncelleme
seoTitle: Ubuntu ve Debian için rippled Manuel Güncelleme Kılavuzu
sidebar_position: 4
description: Bu kılavuz, Ubuntu Linux üzerinde rippledin en son sürümüne manuel olarak nasıl güncelleneceğini adım adım açıklar. Özellikle güncelleme sırasında dikkat edilmesi gereken unsurlar vurgulanmıştır.
tags: 
  - Ubuntu
  - Debian
  - rippled
  - manuel güncelleme
  - GPG anahtarı
keywords: 
  - Ubuntu
  - Debian
  - rippled
  - manuel güncelleme
  - GPG anahtarı
---

## Ubuntu veya Debian'da Manuel Güncelleme

Bu sayfa, Ubuntu Linux üzerinde `rippled`'in en son sürümüne manuel olarak nasıl güncelleneceğini açıklar. Bu talimatlar, daha önce `native paket kullanarak `rippled`'i kurmuş` olduğunuzu varsayar. Ripple, mümkünse `otomatik güncellemeler` ayarlamanızı önerir.

:::warning 
Ripple, v1.7.0 sürümünden hemen önce, ikili paketleri imzalamak için kullanılan GPG anahtarını yeniledi. 1.7.0 sürümünden daha eski bir sürümden güncellemeyi düşünüyorsanız, önce güncellenmiş genel anahtarı indirip manuel olarak güvenmeniz gerekir:

```
wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | \
  sudo apt-key add -
```

Daha fazla bilgi için [`rippled` 1.7.0 sürüm notlarına](https://xrpl.org/blog/2021/rippled-1.7.0.html#upgrading-special-action-required) bakın.
:::

:::tip 
Bu adımları tek seferde gerçekleştirmek için, Ubuntu ve Debian ile uyumlu olan `rippled` paketinin içinde yer alan `/opt/ripple/bin/update-rippled.sh` betiğini çalıştırabilirsiniz. Bu betik, `sudo` kullanıcısı olarak çalıştırılmalıdır.
:::

Manuel güncelleme yapmak için aşağıdaki adımları tamamlayın:

1. Depoları güncelleyin:

    ```
    $ sudo apt -y update
    ```

2. `rippled` paketini yükseltin:

    ```
    $ sudo apt -y upgrade rippled
    ```

3. `systemd` birim dosyalarını yeniden yükleyin:

    ```
    $ sudo systemctl daemon-reload
    ```

4. `rippled` hizmetini yeniden başlatın:

    ```
    $ sudo service rippled restart
    ```

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu
    - `Konsensüs`
- **Eğitimler:**
    - `rippled` v1.3.x Göç Talimatları
    - `rippled'i Giderme`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı
        - [server_info yöntemi][]
        
