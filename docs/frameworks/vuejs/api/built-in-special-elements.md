---
title: Yerleşik Özel Elemanlar
seoTitle: Yerleşik Özel Elemanlar - Vue.js
sidebar_position: 4
description: Bu belge, Vue.jsteki yerleşik özel elemanlar hakkında bilgi sunmaktadır. ,  ve  etiketlerinin kullanımını detaylandırır.
tags: 
  - Vue.js
  - Dinamik Bileşenler
  - Slotlar
  - Template
keywords: 
  - Vue
  - component
  - slot
  - template
---
## Yerleşik Özel Elemanlar {#built-in-special-elements}

:::info Bileşenler Değil
``, `` ve `` bileşen benzeri özelliklerdir ve şablon sentaksının bir parçasıdır. Bunlar gerçek bileşenler değildir ve şablon derleme sırasında derlenir. Bu nedenle, geleneksel olarak şablonlarda küçük harfle yazılırlar.
:::

## `` {#component}

Dinamik bileşenleri veya elemanları render etmek için kullanılan "meta bileşen".

- **Props**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Detaylar**

  Render edilecek gerçek bileşen `is` prop'u ile belirlenir.

  - `is` bir string olduğunda, ya bir HTML tag adı ya da bir bileşenin kaydedilmiş adı olabilir.
    
  - Alternatif olarak, `is` doğrudan bir bileşenin tanımına bağlanabilir.

- **Örnek**

  Kaydedilmiş isimle bileşenleri render etme (Options API):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Tanımlama ile bileşenleri render etme (Composition API ile ``):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  HTML elemanlarını render etme:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  `Yerleşik bileşenler` `is` prop'una verilebilir, ancak isimle geçmek istiyorsanız bunları kaydetmeniz gerekir. Örneğin:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  `is` prop'una bileşeni ismi yerine kendisi olarak geçerseniz, kaydetme gerekmez; örneğin `` içinde.

  `` etiketi üzerinde `v-model` kullanıldığında, şablon derleyici bunu `modelValue` prop'u ve `update:modelValue` olay dinleyicisine genişletir; bu, başka bileşenler için olduğu gibi olur. Ancak bu, `` veya `` gibi yerel HTML elemanlarıyla uyumlu olmayacaktır. Sonuç olarak, dinamik olarak oluşturulmuş yerel bir elemanla `v-model` kullanımı çalışmayacaktır:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- 'input' yerel bir HTML elemanı olduğu için bu çalışmayacak -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  Pratikte, bu ucuz durum yaygın değildir çünkü yerel form alanları genelde gerçek uygulamalarda bileşenlerin içine sarılır. Eğer doğrudan bir yerel elemanı kullanmanız gerekiyorsa, `v-model`'i manuel olarak bir özellik ve etkinlik olarak bölebilirsiniz.

- **Ayrıca bkz.** `Dinamik Bileşenler`

## `` {#slot}

Şablonlarda slot içerik çıkışlarını belirtir.

- **Props**

  ```ts
  interface SlotProps {
    /**
     * <slot> etiketine geçirilen herhangi bir props,
     * kapsamlı slotlar için argümanlar olarak geçilecektir
     */
    [key: string]: any
    /**
     * Slot adını belirtmek için ayrılmıştır.
     */
    name?: string
  }
  ```

- **Detaylar**

  `` elementi, bir slot adını belirtmek için `name` niteliğini kullanabilir. `name` belirtilmediğinde, varsayılan slot render edilir. Slot elementine geçirilen ek nitelikler, ana kapsamlı slot için slot props olarak geçilecektir.

  Elementin kendisi eşleşen slot içeriğiyle değiştirilir.

  Vue şablonlarındaki `` elemanları JavaScript'e derlenir, bu nedenle bunlar [yerel `` elemanları](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) ile karıştırılmamalıdır.

- **Ayrıca bkz.** `Bileşen - Slotlar`

## `` {#template}

`` etiketi, yerleşik bir yönergeyi kullanmak istediğimizde DOM'da bir element render etmeden yer tutucu olarak kullanılır.

- **Detaylar**

  `` için özel işleme, yalnızca aşağıdaki yönergelerle kullanıldığında tetiklenir:

  - `v-if`, `v-else-if` veya `v-else`
  - `v-for`
  - `v-slot`

  Eğer bu yönergelerden hiçbiri mevcut değilse, [yerel `` elemanı](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) olarak render edilir.

  `v-for` ile bir `` ayrıca bir `key` niteliğine` sahip olabilir. Tüm diğer nitelikler ve yönergeler, eşleşen bir element olmadan anlamlı olmadıkları için kaldırılacaktır.

  Tek dosya bileşenleri, tüm şablonu sarmak için `üst düzey `` etiketi` kullanır. Bu kullanım, yukarıda açıklanan `` kullanımından ayrıdır. O üst düzey etiket şablonun kendisinin bir parçası değildir ve yönerge gibi şablon sentezini desteklemez.

- **Ayrıca bkz.**
  - `Kılavuz - `` üzerinde `v-if`
  - `Kılavuz - `` üzerinde `v-for`
  - `Kılavuz - Adlandırılmış slotlar`