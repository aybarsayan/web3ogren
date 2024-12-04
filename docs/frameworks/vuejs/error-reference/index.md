---
title: Üretim Hata Kodu Referansı
seoTitle: Üretim Hata Kodu Referansı - Hataların Anlaşılması
sidebar_position: 4
description: Bu belge, üretim hataları ve derleyici hata kodları hakkında bilgi sağlamaktadır. Hata kodları, tam bilgi dizeleri ile eşleştirilmiştir.
tags: 
  - hata kodları
  - üretim
  - API
  - Vue
keywords: 
  - hata yönetimi
  - çalışma zamanı hataları
  - derleyici hataları
  - Vue.js
---
## Üretim Hata Kodu Referansı {#error-reference}

:::info
Bu bölüm, üretim derlemelerinde karşılaşabileceğiniz hata kodlarının referansını sunmaktadır.
:::

## Çalışma Zamanı Hataları {#runtime-errors}

Üretim derlemelerinde, aşağıdaki hata işleyici API'lerine geçirilen 3. argüman, tam bilgi dizesi yerine kısa bir kod olacaktır:

- `app.config.errorHandler`
- `onErrorCaptured` (Composition API)
- `errorCaptured` (Options API)

Aşağıdaki tablo, kodları orijinal tam bilgi dizelerine eşlemektedir.



:::note
Önemli not: Hataların daha iyi anlaşılması için kullanım örnekleri incelenebilir.
:::

## Derleyici Hataları {#compiler-errors}

Aşağıdaki tablo, üretim derleyici hata kodlarını orijinal mesajlarına eşlemektedir.



:::warning
Yalnızca hata kodlarını incelemek yeterli olmayabilir; hata mesajlarını da göz önünde bulundurmanız önemlidir.
:::