---
title: Kümeleme
seoTitle: Rippled Sunucularının Kümeleme ile Verimliliğini Artırma
sidebar_position: 4
description: Rippled sunucularını bir kümede çalıştırarak kriptografi yükünü paylaşın. Bu içerik, rippled sunucularının verimliliğini artırmanın yollarını ve kümeleme yöntemlerinin sağladığı avantajları özetlemektedir.
tags: 
  - Kümeleme
  - Rippled
  - sunucular
  - kriptografi
  - veri merkezleri
  - işlem ücretleri
  - özel eş
keywords: 
  - Kümeleme
  - Rippled
  - sunucular
  - kriptografi
  - veri merkezleri
  - işlem ücretleri
  - özel eş
---

## Kümeleme

Eğer bir veri merkezinde birden fazla `rippled` sunucusu çalıştırıyorsanız, bu sunucuları verimliliği artırmak için bir küme haline getirebilirsiniz. **Kümeleme**, `Rippled` sunucularınızı bir araya getirerek çeşitli faydalar sunar:

:::tip
**Faydalar:**
- Küme içindeki `rippled` sunucuları, kriptografi işlerini paylaşır. Eğer bir sunucu bir mesajın kimliğini doğruladıysa, kümedeki diğer sunucular buna güvenir ve tekrar doğrulamazlar.
- Küme halinde çalışan sunucular, davranış bozukluğu gösteren veya ağa zarar veren eşler ve API istemcileri hakkında bilgi paylaşır. Bu durum, kütle saldırılarına karşı tüm sunucuların korunmasını sağlar.
- Küme içindeki sunucular, işlem ücretlerinin bazıları için geçerli yük temelli işlem ücretini karşılamasa bile işlemleri daima küme içinde yayar.
:::

Eğer bir doğrulayıcı olarak `özel eş` kullanıyorsanız, **Ripple** `rippled` sunucularının bir kümesini proxy sunucu olarak kullanmanızı tavsiye eder.

## Ayrıca Bakınız

- **Eğitimler:**
    - `Küme `rippled` Sunucuları`
    - `rippled'i Bir Doğrulayıcı Olarak Çalıştırma`
- **Referanslar:**
    - [peers yöntemi][]
    - [connect yöntemi][]
    - `Eş Tarayıcı`

