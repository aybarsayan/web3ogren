---
title: Defterler
seoTitle: XRP Defteri ve Yapısı
sidebar_position: 4
description: Defterler, XRP ağındaki verileri saklayan bir yapı olup, blockchain teknolojisi kullanılarak işlemleri takip eder. Her defter sürümü, bir dizi bloktan oluşur ve her biri benzersiz bir hash değerine sahiptir.
tags: 
  - XRP
  - defter
  - blockchain
  - veri saklama
  - konsensüs
  - işlemler
  - ağ
keywords: 
  - XRP
  - defter
  - blockchain
  - veri saklama
  - konsensüs
  - işlemler
  - ağ
---

# Defterler

XRP Defteri, herkesin erişimine açık, paylaşılan global bir defterdir. Bireysel katılımcılar, bunu yönetmek için hiçbir tek kuruluşa güvenmeye gerek kalmadan defterin bütünlüğüne güvenebilirler. XRP Defteri protokolü, yalnızca çok belirli kurallara göre güncellenebilen bir defter veritabanını yöneterek bunu başarır. Eşler arası ağdaki her sunucu, defter veritabanının tam bir kopyasını saklar ve ağ, `konsensüs süreci` ile bloklar halinde uygulanacak aday işlemleri dağıtır.


:::info
Paylaşılan global defter, defter sürümleri veya kısaca _defterler_ olarak adlandırılan bir dizi bloktan oluşur. Her defter sürümü, defterlerin doğru sırasını belirleyen bir [Defter İndeksi][] içerir.
:::

Her kalıcı, kapalı defter aynı zamanda benzersiz, tanımlayıcı bir hash değerine de sahiptir.

> Herhangi bir anda, her XRP Defteri sunucusunda devam eden bir _açık_ defter, bir dizi bekleyen _kapalı_ defter ve değişmez olan _doğrulanmış_ defterlerin bir geçmişi bulunur.  
> — XRP Defteri Protokolü

Tek bir defter sürümü, birkaç bölümden oluşur:


* **Başlık** - [Defter İndeksi][], diğer içeriklerinin hash'leri ve diğer meta veriler.
* **İşlem ağacı** - Bu defteri oluşturmak için önceki deftere uygulanan `işlemler`.
* **Durum ağacı** - Defterdeki tüm veriler, `defter girdileri`: bakiyeler, ayarlar vb.

## Ayrıca Bakınız

- Defter başlıkları, defter nesne kimlikleri ve defter nesne türleri hakkında daha fazla bilgi için `Defter Veri Formatları` sayfasına bakın.
- Sunucuların defter durumundaki değişikliklerin geçmişini nasıl izlediği hakkında bilgi için `Defter Geçmişi` sayfasına bakın.

