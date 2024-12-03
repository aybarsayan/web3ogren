---
title: Bağımsız Modda Yeni Bir Genesis Defteri Başlatın
seoTitle: Bağımsız Modda Genesis Defteri Oluşturma Rehberi
sidebar_position: 1
description: Bu kılavuz, bağımsız modda yeni bir genesis defteri başlatmak için gereken adımları ve ayarları sağlar. Kullanıcılar, uygulamalı adımlar ve yapılandırmalar hakkında bilgi alacaklardır.
tags: 
  - genesis defteri
  - bağımsız mod
  - XRP
  - ripple
  - sunucu seçenekleri
keywords: 
  - genesis defteri
  - bağımsız mod
  - XRP
  - ripple
  - sunucu seçenekleri
---

# Bağımsız Modda Yeni Bir Genesis Defteri Başlatın

Bağımsız modda, `rippled` yeni bir genesis defteri oluşturabilir. Bu, üretim XRP Defteri'nden hiçbir defter geçmişi olmadan bilinen bir durum sağlar. (Bu, birim testleri için çok faydalıdır. Bunun dışında da birçok kullanım alanı vardır.)

:::tip
Yeni bir genesis defteri ile bağımsız modda `rippled` başlatmak için `-a` ve `--start` seçeneklerini kullanın:
:::

```
rippled -a --start --conf=/path/to/rippled.cfg
```

Bağımsız modda `rippled` başlatırken kullanabileceğiniz seçenekler hakkında daha fazla bilgi için `Komut Satırı Kullanımı: Bağımsız Mod Seçenekleri` bölümüne bakın.

Bir genesis defterinde, `genesis adresi` tüm 100 milyar XRP'yi içerir. Genesis adresinin anahtarları [hardcoded](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184) olarak şu şekilde tanımlanmıştır:

> **Adres:** `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`  
> **Anahtar:** `snoPBrXtMeMyMHUVTgbuqAfg1SUTb` ("`masterpassphrase`")  
> — Rippled Dokümantasyonu

## Yeni Genesis Defterlerindeki Ayarlar

Yeni bir genesis defterinde, hard-coded varsayılan `Rezerv` **200 XRP** minimum bir adresi finanse etmek için gereklidir ve defterdeki her bir nesne için **50 XRP** artış ile sağlanır. Bu değerler, üretim ağındaki mevcut rezerv gereksinimlerinden daha yüksektir. (Ayrıca bakınız: `Ücret Oylaması`)

:::info
Varsayılan olarak, yeni bir genesis defterinde herhangi bir `değişiklik` etkin değildir.
:::

Bir yeni genesis defteri `--start` ile başlattığınızda, genesis defteri `rippled` sunucusu tarafından doğal olarak desteklenen tüm değişiklikleri etkin hale getiren bir `EnableAmendment sahte işlem` içerir; yalnızca yapılandırma dosyasında açıkça devre dışı bıraktığınız değişiklikler hariç. Bu değişikliklerin etkileri bir sonraki defter sürümünden itibaren geçerlidir. (Hatırlatma: bağımsız modda defteri `manuel olarak ilerletmeniz` gerekir.)

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu
        - `rippled` Sunucu Modları
    - `Paralel Ağlar`
    - `Değişiklikler`
    - `Ücret Oylaması`
- **Referanslar:**
    - [ledger_accept yöntemi][]
    - [server_info yöntemi][]
    - `rippled` Komut Satırı Kullanımı
- **Kullanım Senaryoları:**
    - `XRP Defterine Kod Katkısı Yapın`

