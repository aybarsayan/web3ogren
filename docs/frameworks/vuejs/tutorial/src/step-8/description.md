---
title: Hesaplanan Özellik
seoTitle: Hesaplanan Özellik - Vue.js
sidebar_position: 4
description: Bu bölümde, Vue.jsde hesaplanan özelliklerin nasıl kullanılacağını keşfedeceğiz. Ayrıca, tamamlanmış todoları gizlemek için hesaplanan özelliklerin nasıl uygulanacağını öğreneceksiniz.
tags: 
  - Vue
  - computed
  - reactive
  - todo list
keywords: 
  - hesaplanan özellik
  - Vue.js
  - reaktive veriler
  - todo uygulaması
---
## Hesaplanan Özellik {#computed-property}

Son adımda oluşturduğumuz todo listesine devam edelim. Burada her bir todo'ya bir geçiş işlevselliği ekledik. Bu, her todo nesnesine bir `done` özelliği ekleyerek ve bunu bir onay kutusuna bağlamak için `v-model` kullanarak gerçekleştirildi:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

:::info
Bir sonraki iyileştirmemiz, tamamlanmış todos'ları gizleme yeteneği eklemektir. `hideCompleted` durumunu geçiş yapan bir düğmemiz mevcut. Ancak, bu duruma göre farklı liste öğelerini nasıl render ederiz?
:::



Hesaplanan özellik tanıtıyoruz. Diğer özelliklerden reaktif olarak hesaplanan bir özelliği `computed` seçeneği kullanarak ilan edebiliriz:



```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // `this.hideCompleted` durumuna göre filtrelenmiş todos'ları döndür
    }
  }
}
```




```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // `this.hideCompleted` durumuna göre filtrelenmiş todos'ları döndür
    }
  }
})
```






`computed()` tanıtıyoruz. Diğer reaktif veri kaynaklarına dayanan `.value` hesaplayan bir computed ref oluşturabiliriz:



```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // `todos.value` & `hideCompleted.value`'a dayalı filtrelenmiş todos'ları döndür
})
```




```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // `todos.value` & `hideCompleted.value`'a dayalı filtrelenmiş todos'ları döndür
    })

    return {
      // ...
    }
  }
})
```





```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Hesaplanan bir özellik, hesaplama sırasında kullanılan diğer reaktif durumu bağımlılık olarak izler. Sonucu önbelleğe alır ve bağımlılıkları değiştiğinde otomatik olarak günceller.

:::tip
Şimdi, `filteredTodos` hesaplanan özelliğini eklemeyi ve hesaplama mantığını uygulamayı deneyin! Doğru bir şekilde uygulandığında, tamamlanmış öğeleri gizlerken bir todo'yu onaylamak, onu hemen gizlemelidir.
:::