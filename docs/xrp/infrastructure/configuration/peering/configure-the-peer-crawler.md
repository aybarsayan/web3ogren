---
title: Eş Tarayıcıyı Yapılandırın
seoTitle: Eş Tarayıcıyı Yapılandırma Kılavuzu
sidebar_position: 4
description: Rippled sunucunuzun eş tarayıcı APIsi ile sağladığı bilgileri nasıl yapılandıracağınızı öğrenin. Bu kılavuz, raporlanan bilgilerin değiştirilmesi ve eş tarayıcı APIsinin devre dışı bırakılması gibi yöntemleri içerir.
tags: 
  - rippled
  - eş tarayıcı
  - yapılandırma
  - API
  - RXPLedger
  - peer
  - sunucu
keywords: 
  - rippled
  - eş tarayıcı
  - yapılandırma
  - API
  - RXPLedger
  - peer
  - sunucu
---

## Eş Tarayıcıyı Yapılandırın

Varsayılan olarak, `rippled` sunucuları, `eş tarayıcı API'si` aracılığıyla, XRP Ledger'ın eşler arası ağının sağlık ve topolojisini izlemeyi kolaylaştırmak için, **herhangi birinin** sorduğu istatistikleri herkese açık olarak sağlar. **Sunucunuzu** daha fazla veya daha az bilgi sağlamak ya da eş tarayıcı isteklerini tamamen reddetmek için yapılandırabilirsiniz.

:::info
Bu belge, iki seçenek için adımları içerir:

- Eş Tarayıcının Raporladığı Bilgileri Değiştirin
- Eş Tarayıcıyı Devre Dışı Bırakın
:::

## Eş Tarayıcının Raporladığı Bilgileri Değiştirin

Sunucunuzun eş tarayıcı isteklerine ne kadar bilgi sağlayacağını yapılandırmak için, aşağıdaki adımları tamamlayın:

1. `rippled`'in yapılandırma dosyasını düzenleyin.

    ```bash
    vim /etc/opt/ripple/rippled.cfg
    ```

    partial file="/docs/_snippets/conf-file-location.md" /%}

2. Yapılandırma dosyanızdaki `[crawl]` kısmını ekleyin veya güncelleyin ve değişiklikleri kaydedin:

    ```bash
    [crawl]
    overlay = 1
    server = 1
    counts = 0
    unl = 1
    ```

    Bu kısımdaki alanlar, sunucunun `eş tarayıcı yanıtında` geri döndürdüğü alanları kontrol eder. Yapılandırma alanlarının isimleri, API yanıtındaki alanlarla eşleşir. `1` değerine sahip bir ayar, alanı yanıtta dahil etmek anlamına gelir. `0` değeri o alanı yanıttan hariç tutmak anlamına gelir. **Bu örnek, her ayar için varsayılan değerleri gösterir.**

3. Yapılandırma dosyasındaki değişiklikleri kaydettikten sonra, **güncellenen yapılandırmayı uygulamak için** `rippled` sunucunuzu yeniden başlatın:

    ```bash
    systemctl restart rippled
    ```

## Eş Tarayıcıyı Devre Dışı Bırakın

Sunucunuzda eş tarayıcı API'sini devre dışı bırakmak ve böylece eş tarayıcı isteklerine hiç yanıt vermemek için, aşağıdaki adımları tamamlayın:

1. `rippled`'in yapılandırma dosyasını düzenleyin.

    ```bash
    vim /etc/opt/ripple/rippled.cfg
    ```

    partial file="/docs/_snippets/conf-file-location.md" /%}

2. Yapılandırma dosyanızdaki `[crawl]` kısmını ekleyin veya güncelleyin ve değişiklikleri kaydedin:

    ```bash
    [crawl]
    0
    ```

    **Crawl kısmındaki tüm diğer içerikleri kaldırın veya yorum haline getirin.**

3. Yapılandırma dosyasındaki değişiklikleri kaydettikten sonra, **güncellenen yapılandırmayı uygulamak için** `rippled` sunucunuzu yeniden başlatın:

    ```bash
    systemctl restart rippled
    ```

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Eş Protokolü`
- **Eğitimler:**
    - `Rippled Sunucusunu Yönetme`
- **Referanslar:**
    - [server_info method][]
    - [peers method][]
    - `Eş Tarayıcı`

