---
title: Yönetici API Yöntemleri
seoTitle: XRP Ledger Yönetici API Yöntemleri
sidebar_position: 4
description: Bu API yöntemleri ile XRP Ledger sunucusunu yönetin. Yönetici API yöntemleri, sunucunun yönetimi, izlenmesi ve hata ayıklanması için komutları içerir.
tags: 
  - XRP Ledger
  - Yönetici API
  - Sunucu Yönetimi
  - Hata Ayıklama
  - Veri Yönetimi
keywords: 
  - XRP Ledger
  - yönetici API
  - sunucu yönetimi
  - hata ayıklama
  - veri yönetimi
---

# Yönetici API Yöntemleri

Bu yönetici API yöntemlerini kullanarak bir `rippled` sunucusunu yönetin. Yönetici yöntemleri, sunucunun işletimini sürdüren güvenilir personel için tasarlanmıştır. Yönetici yöntemleri, **sunucunun yönetimi, izlenmesi ve hata ayıklanması için komutları** içerir.

:::tip
Yönetici komutları yalnızca `rippled.cfg` dosyasının tanımladığı bir ana bilgisayar ve bağlantı noktasına bağlı olduğunuzda kullanılabilir.
:::

Varsayılan olarak, komut satırı istemcisi bir yönetici bağlantısı kullanır. `rippled` ile nasıl bağlanılacağı hakkında daha fazla bilgi için `Getting Started with the `rippled` API` sayfasına bakın.

## `Anahtar Oluşturma Yöntemleri`

Bu yöntemleri anahtar oluşturmak ve yönetmek için kullanın.

* **`validation_create`** - `rippled` düğüm anahtar çifti için biçimlendirilmiş anahtar oluşturur. **(Doğrulayıcılar, bu yöntem ile oluşturulan anahtarlar yerine `tokenler` kullanmalıdır.)**
* **`wallet_propose`** - Yeni bir hesap için anahtarlar oluşturur.

---

## `Günlükleme ve Veri Yönetim Yöntemleri`

Bu yöntemleri günlük seviyelerini ve defterler gibi diğer verileri yönetmek için kullanın.

* **`can_delete`** - Belirli bir deftere kadar çevrimiçi silmeyi sağlar.
* **`download_shard`** - Defter tarihinin belirli bir parçasını indirir.
* **`ledger_cleaner`** - Bozulmuş veriler için defter temizleme hizmetini yapılandırır.
* **`ledger_request`** - Belirli bir defter sürümü için bir eş sunucudan sorgu yapar.
* **`log_level`** - Günlük ayrıntı düzeyini alır veya değiştirir.
* **`logrotate`** - Günlük dosyasını yeniden açar.
* **`node_to_shard`** - Defter deposundan parça deposuna veri kopyalar.

---

## `Sunucu Kontrol Yöntemleri`

Bu yöntemleri `rippled` sunucusunu yönetmek için kullanın.

* **`ledger_accept`** - Stand-alone modda defteri kapatır ve ilerletir.
* **`stop`** - `rippled` sunucusunu kapatır.

---

## `İmza Yöntemleri`

Bu yöntemleri işlemleri imzalamak için kullanın.

* **`sign`** - Bir işlemi kriptografik olarak imzalar.
* **`sign_for`** - Çoklu imzaya katkıda bulunur.

> Varsayılan olarak, bu yöntemler `yöneticiye özel`dir. Sunucu yöneticisi, `genel imzalamayı etkinleştirdiyse`, genel yöntemler olarak kullanılabilirler.  
> — Yönetici API Bilgisi

---

## `Eş Yönetimi Yöntemleri`

Bu yöntemleri sunucunun bağlantılarını **eşler arası XRP Ledger ağında** yönetmek için kullanın.

* **`connect`** - `rippled` sunucusunu belirli bir eş ile bağlamaya zorlar.
* **`peer_reservations_add`** - Belirli bir eş için rezerve edilen bir slot ekler veya günceller.
* **`peer_reservations_del`** - Belirli bir eş için rezerve edilen bir slotu siler.
* **`peer_reservations_list`** - Belirli eşler için rezerve edilen slotları listeler.
* **`peers`** - Bağlı olan eş sunucular hakkında bilgi alır.

---

## `Durum ve Hata Ayıklama Yöntemleri`

Bu yöntemleri ağın ve sunucunun durumunu kontrol etmek için kullanın.

* **`consensus_info`** - Konsensüs durumuyla ilgili bilgi alır.
* **`feature`** - Protokol değişiklikleri hakkında bilgi alır.
* **`fetch_info`** - Sunucunun ağ ile senkronizasyonu hakkında bilgi alır.
* **`get_counts`** - Sunucunun iç durumu ve bellek kullanımı hakkında istatistik alır.
* **`manifest`** - Bilinen bir doğrulayıcı hakkında en son genel anahtar bilgilerini alır.
* **`print`** - İç alt sistemler hakkında bilgi alır.
* **`validator_info`** - Sunucunun doğrulayıcı ayarları hakkında bilgi alır, eğer bir doğrulayıcı olarak yapılandırılmışsa.
* **`validator_list_sites`** - Doğrulayıcı listelerini yayınlayan siteler hakkında bilgi alır.
* **`validators`** - Mevcut doğrulayıcılar hakkında bilgi alır.

---

## Kullanımdan Kaldırılan Yöntemler

Aşağıdaki yönetici komutları **kullanılmaktan kaldırılmıştır** ve ya kaldırılmıştır ya da bildirim verilmeden kaldırılabilir:

* `ledger_header` - Bunun yerine [defter yöntemini][] kullanın.
* `unl_add`, `unl_delete`, `unl_list`, `unl_load`, `unl_network`, `unl_reset`, `unl_score` - Bunun yerine UNL yönetimi için `validators.txt` yapılandırma dosyasını kullanın.
* `wallet_seed` - Bunun yerine [wallet_propose yöntemini][] kullanın.
* `validation_seed` - Bunun yerine yapılandırma dosyasını ve `validator-keys-tool` kullanarak tohumunuzu yönetin.

---

