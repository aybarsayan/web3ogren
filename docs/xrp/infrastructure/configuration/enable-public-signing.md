---
title: Kamu İmzalamayı Etkinleştir
seoTitle: Rippled Kamu İmzalamayı Etkinleştirme
sidebar_position: 4
description: Bu kılavuz, rippled sunucusunda kamu imzalamayı etkinleştirme adımlarını açıklamaktadır. İmzalamayı etkili bir şekilde yönetmek için en iyi uygulamalara göz atın.
tags: 
  - rippled
  - kamu imzalama
  - güvenlik
  - JSON-RPC
  - WebSocket
keywords: 
  - rippled
  - kamu imzalama
  - güvenlik
  - JSON-RPC
  - WebSocket
---

## Kamu İmzalamayı Etkinleştir

Varsayılan olarak, `rippled` için imzalama yöntemleri `yönetimsel bağlantılar` ile sınırlıdır. **İmzalama yöntemlerinin kamu API yöntemleri olarak kullanılmasına izin vermek** (v1.1.0 öncesi `rippled` sürümleri gibi) isterseniz, bir yapılandırma değişikliği ile etkinleştirebilirsiniz.

Bu, sunucunuzun kabul etmesi durumunda "kamu" `JSON-RPC ve WebSocket bağlantılarında` kullanılabilen aşağıdaki yöntemleri etkinleştirir:

- [sign][sign method]
- [sign_for][sign_for method]
- [submit][submit method] ("sign-and-submit" modunda)

Bu yöntemleri bir yönetici bağlantısından kullanmak için kamu imzalamayı etkinleştirmeniz **gerekmez**.

:::warning
Ripple, kamu imzalamayı etkinleştirmeyi tavsiye etmez. [wallet_propose method][] gibi, imzalama komutları, yönetim düzeyinde izin gerektiren herhangi bir eylemi gerçekleştirmez, ancak bunları yönetici bağlantılarıyla kısıtlamak, kullanıcıları güvensiz iletişimler aracılığıyla gizli anahtarları sorumsuzca gönderme veya alma veya kontrol etmedikleri sunuculara gönderme konusunda korur.
:::

Kamu imzalamayı etkinleştirmek için aşağıdaki adımları izleyin:

1. `rippled`'in yapılandırma dosyasını düzenleyin.

    ```
    vim /etc/opt/ripple/rippled.cfg
    ```

    partial file="/docs/_snippets/conf-file-location.md" /%}

2. Yapılandırma dosyanıza aşağıdaki dizeyi ekleyin ve değişiklikleri kaydedin:

    ```
    [signing_support]
    true
    ```

3. `rippled` sunucunuzu yeniden başlatın:

    ```
    systemctl restart rippled
    ```

## Ayrıca Bakınız

- **Kavramlar:**
    - `İşlemler`
    - `Kriptografik Anahtarlar`
- **Eğitimler:**
    - `Güvenli İmzalamayı Ayarlayın`
    - `HTTP / WebSocket API Kullanımına Başlayın`
    - `JavaScript Kullanımına Başlayın`
- **Referanslar:**
    - [sign method][]
    - [sign_for method][]
    - [submit method][]

