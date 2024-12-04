---
title: Bileşim APIsi Yaşam Döngüsü Kancaları
seoTitle: Bileşim API Yaşam Döngüsü Kancaları
sidebar_position: 4
description: Bu sayfa, Vue Bileşim APIsi ve yaşam döngüsü kancaları hakkında bilgi sunmaktadır. Kullanım notları, fonksiyon türleri ve örneklerle açık bir şekilde açıklanmaktadır.
tags: 
  - Bileşim API
  - Yaşam Döngüsü Kancaları
  - Vue
  - JavaScript
keywords: 
  - Bileşim API
  - yaşam döngüsü
  - Vue
  - SEO
---
## Bileşim API'si: Yaşam Döngüsü Kancaları {#composition-api-lifecycle-hooks}

:::info Kullanım Notu
Bu sayfada listelenen tüm API'ler, bir bileşenin `setup()` aşamasında senkronize olarak çağrılmalıdır. Daha fazla ayrıntı için `Kılavuz - Yaşam Döngüsü Kancaları` sayfasına bakın.
:::

## onMounted() {#onmounted}

Bileşen monte olduktan sonra çağrılacak bir geri çağırma işlevi kaydeder.

- **Tür**

  ```ts
  function onMounted(callback: () => void): void
  ```

- **Ayrıntılar**

  Bir bileşen, aşağıdaki durumlarda monte edilmiş olarak kabul edilir:

  - Tüm senkronize alt bileşenleri monte edilmişse (asenkron bileşenler veya `` ağaçlarının içindeki bileşenler dahil değildir).
  
  - Dom ağacı oluşturulmuş ve ana kapsayıcıya eklenmişse. Uygulamanın kök kapsayıcısının da dökümanda olduğunu yalnızca garanti eder.

  Bu kanca, genellikle bileşenin render edilen DOM'una erişim gerektiren yan etkileri gerçekleştirmek için veya `sunucu tarafından render edilmiş bir uygulamada` DOM ile ilgili kodun istemci ile sınırlanması için kullanılır.

  **Bu kanca, sunucu tarafı render etme sırasında çağrılmaz.**

- **Örnek**

  Şablon referansı aracılığıyla bir öğeye erişim:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```