---
title: Maksimum Eş Sayısını Ayarlayın
seoTitle: Rippled Sunucusu için Maksimum Eş Sayısı Ayarı
sidebar_position: 4
description: Rippled sunucunuzun bağlanabileceği maksimum eş sayısını nasıl ayarlayacağınızı öğrenin. Bu ayar, ağ performansını ve bağlantı kalitesini etkileyebilir.
tags: 
  - rippled
  - eş sayısı
  - yapılandırma
  - ağ bant genişliği
  - sunucu ayarları
keywords: 
  - rippled
  - eş sayısı
  - yapılandırma
  - ağ bant genişliği
  - peering
  - sunucu ayarları
---

## Maksimum Eş Sayısını Ayarlayın

`rippled` sunucusu, bağlanacağı `eşler` için yapılandırılabilir bir yumuşak maksimum sayı sunar. Varsayılan maksimum eş sayısı **21**'dir.

:::info
Sunucu, gelen ve giden eşlerin yaklaşık kotalarını içsel olarak oluşturur. `Sabit eşler, eş rezervasyonları` kullanıyorsanız veya [connect method][] ile ek eşlere manuel olarak bağlanıyorsanız, yumuşak maksimumu aşabilirsiniz.
:::

Sunucunuzun izin verdiği maksimum eş sayısını değiştirmek için aşağıdaki adımları izleyin:

1. `rippled`'in yapılandırma dosyasını düzenleyin.

    ```bash
    $ vim /etc/opt/ripple/rippled.cfg
    ```

    partial file="/docs/_snippets/conf-file-location.md" /%}

2. Yapılandırma dosyasında, `[peers_max]` dizesinin yorumunu kaldırın ve düzenleyin veya henüz yoksa bir tane ekleyin:

    ```bash
    [peers_max]
    30
    ```

   Dizenin tek içeriği, izin verilen toplam eş sayısını belirten bir tamsayı olmalıdır. Varsayılan olarak, sunucu yaklaşık %85 gelen ve %15 giden eş oranını korumaya çalışır, ancak minimum 10 giden eş ile birlikte, bu yüzden 68'den az herhangi bir değer sunucunuzun yaptığı giden eş bağlantı sayısını artırmaz.

   `[peers_max]` değeri 10'dan azsa, sunucu ağ bağlantılı kalabilmesi için sabit kodlanmış bir minimum 10 giden eşe izin verir. Tüm giden eş bağlantılarını engellemek için `sunucuyu özel bir eş olarak yapılandırın`.

    :::warning
    Bağlı olduğunuz eş sunucu sayısı arttıkça, `rippled` sunucunuzun kullandığı ağ bant genişliği artar. `rippled` sunucunuzun iyi bir ağ bağlantısına sahip olduğundan ve kullanacağı bant genişliği için karşılayabileceğiniz maliyetlerin olması durumunda büyük eş sunucu sayıları yapılandırmalısınız.
    :::

3. `rippled` sunucusunu yeniden başlatın.

    ```bash
    $ sudo systemctl restart rippled.service
    ```

## Ayrıca Bakın

- **Kavramlar:**
    - `Eş Protokolü`
    - `rippled` Sunucusu
- **Kılavuzlar:**
    - `Kapasite Planlaması`
    - `rippled` Sunucusunu Hatasını Giderin
- **Referanslar:**
    - [connect method][]
    - [peers method][]
    - [print method][]
    - [server_info method][]
    
