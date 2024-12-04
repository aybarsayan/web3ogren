---
title: İzleyiciler
seoTitle: İzleyiciler - Vue.js Rehberi
sidebar_position: 4
description: İzleyiciler, Vue.js uygulamalarında bir değişikliğe tepki olarak yan etkiler eklemek için kullanılan bir özellik. Bu belge, izleyici kullanımını ve örneklerini sunar.
tags: 
  - Vue.js
  - İzleyiciler
  - Reactivity
  - Composition API
keywords: 
  - izleyici
  - Vue
  - reactivity
  - callback
---
## İzleyiciler {#watchers}

Bazen "yan etkileri" tepki olarak gerçekleştirmemiz gerekebilir - örneğin, bir sayı değiştiğinde bunu konsola kaydetmek. Bunu izleyiciler ile gerçekleştirebiliriz:



```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // evet, console.log() bir yan etkidir
  console.log(`Yeni sayı: ${newCount}`)
})
```

`watch()` doğrudan bir ref'yi izleyebilir ve `count` değerinin her değiştiğinde geri çağırma (callback) tetiklenir. `watch()` ayrıca diğer veri kaynaklarını da izleyebilir - daha fazla bilgiye Kılavuz - İzleyiciler kısmından ulaşabilirsiniz.




```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // evet, console.log() bir yan etkidir
      console.log(`Yeni sayı: ${newCount}`)
    }
  }
}
```

Burada, `count` özelliğine yapılan değişiklikleri izlemek için `watch` seçeneğini kullanıyoruz. `count` değiştiğinde geri çağırma (callback) çağrılır ve yeni değeri argüman olarak alır. Daha fazla bilgiye Kılavuz - İzleyiciler kısmından ulaşabilirsiniz.



:::tip
Konsola kaydetmekten daha pratik bir örnek, bir ID değiştiğinde yeni veri çekmektir. Sahip olduğumuz kod, bileşen monte edildiğinde sahte bir API'den todo verilerini çekiyor. Ayrıca, çekilmesi gereken todo ID'sini artıran bir buton bulunmaktadır.
:::

Butona tıklanıldığında yeni bir todo çeken bir izleyici uygulamayı deneyin.