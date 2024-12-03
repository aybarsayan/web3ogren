---
title: gRPC APIyi Yapılandır
seoTitle: gRPC API Yapılandırma Kılavuzu
sidebar_position: 4
description: gRPC APIsini etkinleştirip yapılandırmak için gerekli adımlar burada bulunmaktadır. Kullanıcılar, bu API ile veri raporlamaları yapabilirler.
tags: 
  - gRPC
  - ripple
  - yapılandırma
  - API
  - sunucu
  - P2P
keywords: 
  - gRPC
  - ripple
  - yapılandırma
  - API
  - sunucu
  - P2P
---

## gRPC'yi Yapılandır

`rippled` sunucusu, `P2P mod sunucuları` tarafından sağlanabilen sınırlı bir [gRPC API](https://grpc.io/) sunar. Raporlama modu sunucuları, en son doğrulanan defterler ve işlemler hakkında veri almak için bu API'yi kullanır. Sunucunuzda gRPC API'sini etkinleştirmek için yeni bir yapılandırma kısmı ekleyebilirsiniz.

:::warning
gRPC desteği, spesifik olarak P2P mod sunucularından raporlama mod sunucularına veri sağlamak için tasarlanmıştır. gRPC API'sinde önemli değişiklikler uyarı yapılmadan gerçekleşebilir veya sunucunun gelecekteki sürümlerinde tamamen kaldırılabilir.
:::

## Ön Gereksinimler

gRPC'yi etkinleştirmek için aşağıdaki ön gereksinimleri karşılamalısınız:

- `rippled'i yüklemiş olmalısınız`.
- Sunucunuz seçtiğiniz porta bağlanabilmelidir.

## Adımlar

Sunucunuzda gRPC'yi etkinleştirmek için aşağıdaki adımları tamamlayın:

1. `[port_grpc]` kısmının `rippled` yapılandırma dosyanızda bulunduğundan emin olun.

    ```
    [port_grpc]
    port = 50051
    ip = 127.0.0.1
    ```

    - `port`, sunucunun istemci uygulamalarından gRPC bağlantıları için dinlediği portu tanımlar. Önerilen port `50051`'dir.
    - `ip`, sunucunun dinlediği arayüzleri tanımlar. `127.0.0.1`, bağlantıları yerel döngü geri ağına (aynı makine) sınırlandırır ve varsayılan olarak etkindir. Değeri `0.0.0.0` olarak değiştirirseniz, tüm mevcut ağ arayüzlerinde dinleme yapar.

    partial file="/docs/_snippets/conf-file-location.md" /%}

2. `rippled` hizmetini başlatın (veya yeniden başlatın).

    ```
    sudo systemctl restart rippled
    ```

## Ayrıca Bakınız

- **Kavramlar:**
    - `XRP Defterine Genel Bakış`
    - `rippled` Sunucu Modları
- **Eğitimler:**
    - `HTTP / WebSocket API'lerini Kullanarak Başlangıç Yapın`
    - `Güvenilir İşlem Gönderimi`
    - `rippled Sunucusunu Yönetin`
- **Kaynaklar:**
    - `HTTP / WebSocket API Referansı`

