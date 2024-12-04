---
title: Kompozisyon API Bağımlılık Enjeksiyonu
seoTitle: Composition API Dependency Injection
sidebar_position: 4
description: Bağımlılık enjeksiyonu, Vue bileşenleri arasında veri paylaşımı için etkili bir yaklaşımdır. Bu doküman, provide() ve inject() fonksiyonlarının nasıl kullanılacağını açıklar.
tags: 
  - Kompozisyon API
  - Bağımlılık Enjeksiyonu
  - Vue
  - TypeScript
keywords: 
  - Kompozisyon API
  - Bağımlılık Enjeksiyonu
  - Vue
  - TypeScript
---
## provide() {#provide}

Alt bileşenler tarafından enjekte edilebilen bir değeri sağlar.

- **Tip**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Ayrıntılar**

  `provide()` iki argümanı alır: anahtar, bir dize veya simge olabilir ve enjekte edilecek değerdir.

  TypeScript kullanırken, anahtar bir simge olarak `InjectionKey` şeklinde dönüştürülebilir - bu, `provide()` ile `inject()` arasındaki değer tipini senkronize etmek için kullanılabilecek bir Vue tarafından sağlanan yardımcı türdür.

  Yaşam döngüsü kancası kayıt API'lerine benzer şekilde, `provide()`, bir bileşenin `setup()` aşamasında senkron olarak çağrılmalıdır.

- **Örnek**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // statik değeri sağla
  provide('path', '/project/')

  // reaktif değeri sağla
  const count = ref(0)
  provide('count', count)

  // Simge anahtarları ile sağla
  provide(countSymbol, count)
  </script>
  ```

- **Ayrıca bakınız**
  - `Kılavuz - Sağlama / Enjeksiyon`
  - `Kılavuz - Sağlama / Enjeksiyon Tipi`