---
title: Link Sıkıştırmasını Etkinleştir
seoTitle: Etkin Link Sıkıştırması ile Bant Genişliğinizi Korumak
sidebar_position: 4
description: Eşler arası iletişimi sıkıştırarak bant genişliğini kaydedin. Bu kılavuz, rippled sunucusunun link sıkıştırmasını etkinleştirme adımlarını açıklamaktadır.
tags: 
  - link sıkıştırma
  - rippled
  - bant genişliği
  - peering
  - konfigürasyon
  - sunucu
  - iletişim
keywords: 
  - link sıkıştırma
  - rippled
  - bant genişliği
  - peering
  - konfigürasyon
  - sunucu
  - iletişim
---

## Link Sıkıştırmasını Etkinleştir

:::info
`rippled` sunucusu, daha yüksek CPU kullanımı pahasına `eşler arası iletişimlerini` sıkıştırarak bant genişliğini kaydedebilir. Link sıkıştırmasını etkinleştirirseniz, sunucu otomatik olarak link sıkıştırması etkin olan diğer eş sunucularla iletişimlerini sıkıştırır.
:::

## Adımlar

Sunucunuzda link sıkıştırmasını etkinleştirmek için aşağıdaki adımları tamamlayın:

### 1. `rippled` sunucunuzun konfigürasyon dosyasını düzenleyin.

```sh
$ vim /etc/opt/ripple/rippled.cfg
```

partial file="/docs/_snippets/conf-file-location.md" /%}

### 2. Konfigürasyon dosyasında, `[compression]` bölümünü ekleyin veya yorumdan çıkarın.

Sıkıştırmayı etkinleştirmek için:

```text
[compression]
true
```

Sıkıştırmayı devre dışı bırakmak için `false` kullanın (varsayılan).

:::tip
Konfigürasyon dosyasını düzenlerken dikkatli olun. Yanlış bir ayar sunucunuzun doğru çalışmamasına sebep olabilir.
:::

### 3. `rippled` sunucusunu yeniden başlatın.

```sh
$ sudo systemctl restart rippled.service
```

Yeniden başlatma işlemi sonrasında, sunucunuz otomatik olarak link sıkıştırmasını etkin olan diğer eşlerle kullanır.

## Ayrıca Bakınız

- `Kapasite Planlaması`
- `Eş Protokolü`

:::note
Sunucunuzu yeniden başlattıktan sonra, bağlantıların sıkıştırıldığından emin olmak için sistem günlüklerini kontrol edin.
:::

