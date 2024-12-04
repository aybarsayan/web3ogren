---
title: Yaşam Döngüsü Seçenekleri
seoTitle: Yaşam Döngüsü Seçenekleri - Vue.js
sidebar_position: 4
description: Bu belge, Vue.js yaşam döngüsü kancalarının kullanımını ve her bir kancanın ne zaman çağrılacağını açıklar. Farklı kancaların detaylarına ve örneklerine ulaşın.
tags: 
  - Vue.js
  - Yaşam Döngüsü
  - Bileşenler
  - Geliştirme
keywords: 
  - yaşam döngüsü
  - Vue.js
  - bileşen
  - reaktif
  - senkron
---
## Seçenekler: Yaşam Döngüsü {#options-lifecycle}

:::info Ayrıca bakınız
Yaşam döngüsü kancalarının ortak kullanımı için `Kılavuz - Yaşam Döngüsü Kancaları` sayfasını ziyaret edin.
:::

## beforeCreate {#beforecreate}

Örnek başlatıldığında çağrılır.

- **Tip**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Ayrıntılar**

  Örnek başlatıldığında ve özellikler çözüldüğünde hemen çağrılır.

  Ardından, özellikler reaktif özellikler olarak tanımlanır ve `data()` veya `computed` gibi durumlar ayarlanır.

  Not: Composition API'nin `setup()` kancası, Options API kancalarından, hatta `beforeCreate()`'den önce çağrılır.