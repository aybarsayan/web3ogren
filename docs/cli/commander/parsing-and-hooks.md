---
title: Yaşam Döngüsü ve Kancalarının Ayrıştırılması
description: Bu belge, bir argüman dizisi ile başlayan ve komutları işleyen bir sürecin ayrıntılarını sunmaktadır. İşlemler, alt komutlar aracılığıyla gerçekleştirilirken, son komut eylem yöneticisini çağırır. 
keywords: [yaşam döngüsü, kanca, argüman, komut, eylem yöneticisi, program, seçenek]
---

# Yaşam Döngüsü ve Kancalarının Ayrıştırılması

İşlem, bir argüman dizisi ile başlar. Her komut, anladığı seçenekleri işler ve kaldırır ve kalan argümanları bir sonraki alt komuta iletir. Son komut, eylem yöneticisini çağırır.

---

Üst düzey komutla (program) başlamak:

- **seçenekleri ayrıştır**: tanınan seçenekleri ayrıştır (bu komut için) ve argümanlardan kaldır
- **ortamı ayrıştır**: ortam değişkenlerini ara (bu komut için)
- **ima edilenleri işle**: herhangi bir ima edilen seçenek değerini ayarla (bu komut için)
- **ilk argüman** bir alt komutsa
    - `preSubcommand` kancalarını çağır
    - kalan argümanları alt komuta iletir ve aynı şekilde işler

---

Son (yaprak) komuta ulaştığımızda:

- **eksik zorunlu seçenekleri kontrol et**
- **çelişen seçenekleri kontrol et**
- **bilinmeyen seçenekleri kontrol et**
- kalan argümanları komut-argümanları olarak işle
- `preAction` kancalarını çağır
- eylem yöneticisini çağır
- `postAction` kancalarını çağır

:::tip
Eylem yöneticisi çağrılmadan önce tüm argümanların kontrol edilmesi, hata oluşumunu en aza indirmeye yardımcı olur.
:::