---
title: Olay Dinleyicileri
seoTitle: Olay Dinleyicileri - Vue.js
sidebar_position: 4
description: Olay dinleyicileri kullanarak Vue.js bileşenlerinde etkileşimli fonksiyonlar oluşturmayı öğrenin. Bu kılavuz, v-on direktifinin nasıl kullanılacağını ve olay yöneticilerinin uygulamadaki rolünü açıklar.
tags: 
  - Vue.js
  - Olay Yönetimi
  - Bileşenler
keywords: 
  - olay dinleyicileri
  - v-on
  - increment fonksiyonu
  - Vue bileşeni
---
## Olay Dinleyicileri {#event-listeners}

DOM olaylarını `v-on` direktifi ile dinleyebiliriz:

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

Sık kullanıldığı için, `v-on` ayrıca bir kısayol sözdizimine de sahiptir:

```vue-html
<button @click="increment">{{ count }}</button>
```



Burada, `increment` `methods` seçeneği kullanılarak tanımlanan bir fonksiyonu referans alır:



```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // bileşen durumunu güncelle
      this.count++
    }
  }
}
```




```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // bileşen durumunu güncelle
      this.count++
    }
  }
})
```



Bir yöntem içinde, bileşen örneğine `this` kullanarak erişebiliriz. Bileşen örneği, `data` ile tanımlanan veri özelliklerini açığa çıkarır. Bu özellikleri değiştirerek bileşen durumunu güncelleyebiliriz.







Burada, `increment` `` içinde tanımlanan bir fonksiyonu referans alır:

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // bileşen durumunu güncelle
  count.value++
}
</script>
```





Burada, `increment` `setup()`'dan dönen nesnedeki bir yöntemi referans alır:

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // bileşen durumunu güncelle
    count.value++
  }

  return {
    count,
    increment
  }
}
```



Fonksiyon içinde, refs'i değiştirerek bileşen durumunu güncelleyebiliriz.



:::tip
Olay yöneticileri, satır içi ifadeleri kullanabilir ve değiştiricilerle yaygın görevleri basitleştirebilir. Bu detaylar [Kılavuz - Olay Yönetimi](https://example.com/guide/essentials/event-handling.html)'nde ele alınmıştır.
:::

Şimdi, `increment` yönteminifonksiyonunu kendiniz uygulamaya çalışın ve bunu butona `v-on` ile bağlayın.