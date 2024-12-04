---
title: Yayınlar
seoTitle: Olay Yayınlama Yöntemleri
sidebar_position: 4
description: Bu bölüm, alt bileşenlerin üst bileşenlere nasıl olay yayınlayabileceğini açıklar. Ayrıca, üst bileşenin alt bileşenden gelen olayları nasıl dinleyeceğini gösterir.
tags: 
  - Vue.js
  - Olay Yönetimi
  - Bileşenler
keywords: 
  - yayın
  - bileşen
  - olay
  - Vue
---
## Yayınlar {#emits}

Props almanın yanı sıra, bir alt bileşen de üst bileşene olaylar yayabilir:




```vue
<script setup>
// yayımlanan olayları belirle
const emit = defineEmits(['response'])

// argüman ile yayımlama
emit('response', 'hello from child')
</script>
```





```js
export default {
  // yayımlanan olayları belirle
  emits: ['response'],
  setup(props, { emit }) {
    // argüman ile yayımlama
    emit('response', 'hello from child')
  }
}
```







```js
export default {
  // yayımlanan olayları belirle
  emits: ['response'],
  created() {
    // argüman ile yayımlama
    this.$emit('response', 'hello from child')
  }
}
```



:::tip
`this.$emit()` ve `emit()` fonksiyonlarına verilen ilk argüman, olay adıdır. Ek argümanlar, olay dinleyicisine iletilir.
:::

## Olay Dinleme

Üst bileşen, alt bileşen tarafından yayımlanan olayları `v-on` ile dinleyebilir - burada işleyici, alt bileşenin yayım çağrısından gelen ek argümanı alır ve yerel duruma atar:



```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```




```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```



:::info
Artık bunu düzenleyicide kendiniz deneyin.
:::