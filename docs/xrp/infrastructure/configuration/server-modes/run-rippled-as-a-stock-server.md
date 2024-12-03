---
title: rippledı Bir Stok Sunucu Olarak Çalıştır
seoTitle: XRP Ledger için rippled ile Stok Sunucu Kurulumu
sidebar_position: 4
description: XRP ile entegre olan herkes için çok amaçlı bir yapılandırma. Bu içerik, rippledı bir stok sunucu olarak nasıl çalıştıracağınızı ve yapılandıracağınıza dair bilgiler sunmaktadır.
tags: 
  - rippled
  - stok sunucu
  - XRP Ledger
  - işlemler
  - kriptografi
keywords: 
  - rippled
  - stok sunucu
  - XRP Ledger
  - işlemler
  - kriptografi
---

## rippled'ı Bir Stok Sunucu Olarak Çalıştır

Bir stok sunucu, `rippled` için çok amaçlı bir yapılandırmadır. Bir stok sunucu ile, XRP Ledger'a işlemler gönderebilir, defter geçmişine erişebilir ve XRP ile XRP Ledger'ı entegre etmek için en son `araçları` kullanabilirsiniz. İstemci uygulamalarını bu sunucu aracılığıyla XRP Ledger'a bağlayabilirsiniz.

Bir stok sunucu aşağıdakilerin tamamını gerçekleştirir:

- `eşler ağına` bağlanır
- Kriptografik olarak imzalanmış `işlemleri` iletir
- Tam paylaşılmış küresel `defterin` yerel bir kopyasını korur

:::tip
**Not:** Bir doğrulayıcı olarak `konsensüs sürecine` katılmak için, `rippled'ı bir doğrulayıcı olarak çalıştırın` yerine.
:::

## `rippled`'ı Kurun ve Çalıştırın

Varsayılan paket kurulumu, az sayıda işlem geçmişi ile bir stok sunucu kurar. Kurulum adımları için `Install `rippled` sayfasına bakın.

Kurulumdan sonra, sunucunuzun ne kadar tarih saklayacağını ayarlayabilirsiniz. Bunu nasıl yapacağınıza dair adımlar için `Çevrimiçi Silme Yapılandırmasını` inceleyin.

## Sorun Giderme

Daha fazla bilgi için `rippled'ı Sorun Giderme` sayfasına bakın.

## Ayrıca Bakınız

- **Kavramlar:**
    - `XRP Ledger Genel Bakış`
    - `The `rippled` Sunucusu`
- **Kılavuzlar:**
    - `Küme rippled Sunucuları`
    - `Install `rippled`
    - `Kapasite Planlaması`
- **Referanslar:**
    - [Doğrulayıcı Anahtarları Araç Kılavuzu](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_info yöntemi][]
    - [validator_list_sites yöntemi][]
    - [validators yöntemi][]

:::note
**İlginç Not:** `rippled` çok amaçlı sunucu yapılandırmalarında genişletilebilir. Ek özellikler ve yapılandırmalar ekleyebilirsiniz.
:::

