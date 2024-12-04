---
title: Öncelik D Kuralları Dikkatle Kullanılmalıdır
seoTitle: Öncelik D Kuralları - Dikkatle Kullanılmalıdır
sidebar_position: 1
description: Vuenun bazı özellikleri, nadir köşe durumlarını veya eski kod tabanından geçişleri sağlamak için vardır. Ancak aşırı kullanımı kodun bakımını zorlaştırabilir.
tags: 
  - Vue
  - Öncelik D
  - Kod Bakımı
  - Geliştirici Prensipleri
keywords: 
  - Vue
  - Öncelik D
  - Kod Bakımı
  - Geliştirici Prensipleri
---
## Öncelik D Kuralları: Dikkatle Kullanılmalıdır {#priority-d-rules-use-with-caution}

Vue'nun bazı özellikleri, nadir köşe durumlarını veya eski bir kod tabanından daha düzgün geçişleri sağlamak amacıyla vardır. Ancak aşırı kullanıldığında, kodunuzu bakımını zorlaştırabilir veya hatta hata kaynağı haline gelebilir. Bu kurallar, potansiyel olarak riskli özelliklere ışık tutarak, ne zaman ve neden kaçınılması gerektiğini açıklar.

## `scoped` ile Element Seçicileri {#element-selectors-with-scoped}

**Element seçicileri `scoped` ile kullanılmamalıdır.**

`scoped` stillerinde element seçicileri yerine sınıf seçicileri tercih edilmelidir, çünkü çok sayıdaki element seçicisi yavaş olacaktır.

::: details Ayrıntılı Açıklama
Stilleri kapsamlandırmak için, Vue bileşen elementlerine `data-v-f3f3eg9` gibi benzersiz bir öznitelik ekler. Ardından, yalnızca bu özniteliğe sahip eşleşen elementlerin seçilmesi için seçiciler değiştirilir (örneğin `button[data-v-f3f3eg9]`).

Sorun, çok sayıda element-öznitelik seçicisinin (örneğin `button[data-v-f3f3eg9]`) sınıf-öznitelik seçicilerine (örneğin `.btn-close[data-v-f3f3eg9]`) göre önemli ölçüde daha yavaş olacağıdır, bu nedenle mümkün olduğunca sınıf seçicileri tercih edilmelidir.
:::


Kötü

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```




İyi

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```



## Varsayılan Ebeveyn-Çocuk İletişimi {#implicit-parent-child-communication}

**Ebeveyn-çocuk bileşen iletişimi için props ve olaylar, `this.$parent` veya props'ları değiştirmek yerine tercih edilmelidir.**

İdeal bir Vue uygulaması, üstten aşağıya props, alttan yukarıya olaylar akışını takip eder. Bu kurala uymak, bileşenlerinizi çok daha anlaşılır hale getirir. Ancak, zaten derin şekilde bağlantılı olan iki bileşeni basitleştirmek için prop değişikliği veya `this.$parent` kullanmanın mikro durumları vardır.

Sorun, bu kalıpların bazı _basit_ durumlarda kolaylıklar sunmasıdır. Dikkat: durumu anlama akışınızı sağlamak için basitliği (daha az kod yazmak) kısa vadeli kolaylıkla (daha az kod yazmak) takas etmeye kapılmayın.




Kötü

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```




İyi

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```








Kötü

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const instance = getCurrentInstance()

function removeTodo() {
  const parent = instance.parent
  if (!parent) return

  parent.props.todos = parent.props.todos.filter((todo) => {
    return todo.id !== props.todo.id
  })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo">×</button>
  </span>
</template>
```




İyi

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="emit('delete')">×</button>
  </span>
</template>
```