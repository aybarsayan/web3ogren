---
title: Geçersiz ARIA Özellik Uyarısı
seoTitle: Geçersiz ARIA Özellik Uyarısı - Erişilebilirlik
sidebar_position: 4
description: Bu içerik, geçersiz ARIA özelliklerinin nasıl tespit edileceğine ve düzeltileceğine dair önemli bilgiler sunmaktadır. Yanlış yazım ve uygun özellik kullanımı konularında dikkat edilmesi gereken noktalar açıklanmaktadır.
tags: 
  - ARIA
  - erişilebilirlik
  - yazılım geliştirme
keywords: 
  - ARIA
  - erişilebilirlik
  - yazılım
---
Bu uyarı, Web Erişilebilirlik İnisiyatifi (WAI) Erişilebilir Zengin İnternet Uygulaması (ARIA) [spesifikasyonu](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) içinde var olmayan bir `aria-*` özelliği ile bir DOM öğesi oluşturmaya çalıştığınızda tetiklenecektir.

:::warning
Eğer geçerli bir özellik kullandığınızı düşünüyorsanız, yazımını dikkatlice kontrol edin. `aria-labelledby` ve `aria-activedescendant` sıklıkla yanlış yazılmaktadır.
:::

1. Eğer `aria-role` yazdıysanız, muhtemelen `role` demek istediniz.

:::info
Aksi takdirde, en son React DOM sürümünü kullanıyor ve ARIA spesifikasyonunda listelenen geçerli bir özellik adı kullandığınızı doğruladıysanız, lütfen [bir hata rapor edin](https://github.com/facebook/react/issues/new/choose).
:::