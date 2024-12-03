---
title: Sistem Gereksinimleri
seoTitle: XRP Ledger (rippled) İçin Sistem Gereksinimleri
sidebar_position: 4
description: Rippled çalıştırmak için donanım ve yazılım gereksinimleri. Bu doküman, XRP Ledger (rippled) sunucusunun önerilen ve minimum sistem gereksinimlerini detaylandırmaktadır.
tags: 
  - rippled
  - sistem gereksinimleri
  - işletim sistemi
  - CPU
  - disk
  - RAM
  - ağ
keywords: 
  - rippled
  - sistem gereksinimleri
  - işletim sistemi
  - CPU
  - disk
  - RAM
  - ağ
---

# Sistem Gereksinimleri

## Önerilen Özellikler

Üretim ortamlarında güvenilir performans için, aşağıdaki özelliklere sahip veya daha iyisi olan bare metal üzerinde bir XRP Ledger (`rippled`) sunucusu çalıştırılması önerilmektedir:

- **İşletim Sistemi:** Ubuntu (LTS), Red Hat Enterprise Linux (en son sürüm) veya uyumlu bir Linux dağıtımı.
- **CPU:** 8'den fazla çekirdek ve hyperthreading etkinleştirilmiş Intel Xeon 3+ GHz işlemci.
- **Disk:** SSD / NVMe (sürekli 10.000 IOPS - patlama veya zirve değil - veya daha iyi). Veritabanı bölümü için minimum **50 GB**. Amazon Elastic Block Store (AWS EBS) kullanmayın çünkü gecikmesi senkronizasyon için çok yüksektir.
- **RAM:** 64 GB.
- **Ağ:** Ana bilgisayarda bir gigabit ağ arayüzüne sahip kurumsal veri merkezi ağı.

:::tip
AWS'de bir doğrulayıcı için, günlükleme ve çekirdek döküm depolama için ekstra **1 TB** disk ile `z1d.2xlarge` geçerli bir seçenek olabilir.
:::

## Minimum Özellikler

:::warning Bu özellikler, güvenilir bir şekilde `Mainnet ile senkronizasyonu sürdürmekte` yeterli değildir. Üretim kullanımı için yukarıda önerilen özelliklere uyun.:::

Test amaçları için, aşağıdaki minimum gereksinimlere sahip emtia donanımı üzerinde bir XRP Ledger sunucusu çalıştırabilirsiniz:

- **İşletim Sistemi:** macOS, Windows (64-bit) veya çoğu Linux dağıtımı (Red Hat, Ubuntu ve Debian desteklenmektedir).
- **CPU:** 64-bit x86_64, 4'ten fazla çekirdek.
- **Disk:** SSD / NVMe (sürekli 10.000 IOPS - patlama veya zirve değil - veya daha iyi). Veritabanı bölümü için minimum **50 GB**. Amazon Elastic Block Store (AWS EBS) kullanmayın çünkü gecikmesi senkronizasyon için çok yüksektir.
- **RAM:** 16 GB+.

> Amazon EC2'nin `i3.2xlarge` VM boyutu, iş yükünüze bağlı olarak uygun olabilir. Hızlı bir ağ bağlantısı tercih edilir. Bir sunucunun istemci yükünü artırmak, kaynak ihtiyaçlarını artırır. — Sistem Yüksekliği

## Sistem Zamanı

Bir `rippled` sunucusu doğru zamanı korumaya dayanır. Sistem saatinin Network Time Protocol (NTP) kullanılarak, `ntpd` veya `chrony` gibi daemonlar ile senkronize edilmesi önerilir.

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu
    - `Konsensüs`
- **Eğitimler:**
    - `Kapasite Planlaması` - Önerilen özellikler ve üretim ihtacını planlamaya dair daha fazla bilgi
    - `rippled` Kurulum
    - `rippled'yi Gider`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı
        - [server_info yöntemi][]
        
