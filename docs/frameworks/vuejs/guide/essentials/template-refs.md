---
title: Şablon Referansları
seoTitle: Vue Şablon Referansları
sidebar_position: 4
description: Vuenun deklaratif render modeli ile DOM unsurlarına erişim için özel ref özniteliğinin nasıl kullanılacağını keşfedin. Örneklerle bu konuyu derinlemesine inceleyin.
tags: 
  - Vue
  - Şablon Referansları
  - Deklaratif Render
  - Composition API
  - Options API
keywords: 
  - Vue
  - Template Refs
  - DOM Erişimi
  - Composition API
  - Options API
---
## Şablon Referansları {#template-refs}

Vue'nun deklaratif render modeli, doğrudan DOM işlemlerinin çoğunu sizin için soyutlasa da, hala altındaki DOM unsurlarına doğrudan erişim gerektiren durumlar olabilir. Bunu başarmak için özel `ref` özniteliğini kullanabiliriz:

```vue-html
<input ref="input">
```

`ref`, `v-for` bölümünde tartışılan `key` özniteliğine benzer özel bir özniteliktir. Bizi, bir DOM elemanına veya çocuk bileşen örneğine, bileşen yüklendikten sonra doğrudan bir referans almayı sağlar. Bu, örneğin, bileşen yüklendiğinde bir girişi programlı olarak odaklamak veya bir 3. parti kütüphaneyi bir eleman üzerinde başlatmak istediğinizde faydalı olabilir.

## Referanslara Erişim {#accessing-the-refs}

:::info
Composition API ile referansı elde etmek için `useTemplateRef()`  yardımcı fonksiyonunu kullanabiliriz.
:::

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// ilk argüman, şablondaki ref değeriyle eşleşmelidir
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

TypeScript kullanırken, Vue'nun IDE desteği ve `vue-tsc`, `input.value`'nin tipini, karşılık gelen `ref` özniteliği hangi eleman veya bileşende kullanılıyorsa ona göre otomatik olarak çıkarır.


3.5’ten Önceki Kullanım

`useTemplateRef()`'in tanıtılmadığı 3.5’ten önceki sürümlerde, şablon ref özniteliğinin değeriyle eşleşen bir isimle bir ref tanımlamamız gerekir:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// eleman referansını tutmak için bir ref tanımla
// isim, şablon ref değeriyle eşleşmelidir
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

`` kullanılmıyorsa, `setup()`'tan da ref'i döndürdüğünüzden emin olun:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```



Ref'e yalnızca bileşen yüklendikten sonra erişebileceğinizi unutmayın. Bir şablon ifadesinde `$refs.input``input` erişmeye çalışırsanız, ilk render'da `undefined``null` olacaktır. Bu, elemanın ilk render'dan sonra var olmadığı içindir!



Bir şablon ref'inin değişikliklerini izlemeye çalışıyorsanız, ref'in `null` değerine sahip olduğu durumu hesaba almak için dikkatli olun:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // henüz montelenmedi, veya element unmounted (ör. v-if ile)
  }
})
```

Ayrıca bakınız: `Şablon Referanslarının Tipi` 



## `v-for` İçindeki Referanslar {#refs-inside-v-for}

> v3.5 veya üstü gerektirir



`v-for` içinde `ref` kullanıldığında, karşılık gelen ref bir dizi değeri içermelidir ve bu değerler montajdan sonra doldurulacaktır:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Playground'da Deneyin](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)


3.5’ten Önceki Kullanım

`useTemplateRef()`'in tanıtılmadığı 3.5’ten önceki sürümlerde, şablon ref değerine eşleşen bir isimle bir ref tanımlamamız ve ref'in de bir dizi değeri içermesi gerekir:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```






`v-for` içinde `ref` kullanıldığında, elde edilen ref değeri, karşılık gelen elemanları içeren bir dizi olacaktır:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Playground'da Deneyin](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)



Ref dizisinin kaynak dizinin aynı sırasını garanti etmediğini not etmek gerekir.

## Fonksiyon Referansları {#function-refs}

Bir dizi anahtar yerine, `ref` özniteliği aynı zamanda her bileşen güncellemesinde çağrılacak bir fonksiyona bağlanabilir ve bu size eleman referansını saklamak için tamamen esneklik sağlar. Fonksiyon ilk argüman olarak eleman referansını alır:

```vue-html
<input :ref="(el) => { /* el'i bir özelliğe veya ref'e atayın */ }">
```

Dinamik bir `:ref` bağlaması kullandığımızı unutmayın, bu yüzden ona bir fonksiyon geçirebiliriz, yerine bir ref adı dizesi. Eleman unmounted olduğunda, argüman `null` olacaktır. Elbette, satır içi fonksiyon yerine bir yöntem de kullanabilirsiniz.

## Bileşen Üzerinde Ref {#ref-on-component}

> Bu bölüm, `Bileşenler` hakkında bilgi sahibi olunduğunu varsayar. İsterseniz atlayabilir ve daha sonra geri dönebilirsiniz.

`ref`, bir çocuk bileşen üzerinde de kullanılabilir. Bu durumda referans bir bileşen örneği olacaktır:



```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value, <Child /> örneğini tutacaktır
})
</script>

<template>
  <Child ref="child" />
</template>
```


3.5’ten Önceki Kullanım

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value, <Child /> örneğini tutacaktır
})
</script>

<template>
  <Child ref="child" />
</template>
```






```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child, <Child /> örneğini tutacaktır
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```



Eğer çocuk bileşen Options API kullanıyorsa veya `` kullanmıyorsa,referans alınan örnek, çocuk bileşenin `this` ile aynı olacaktır, bu da demektir ki, üst bileşen her özellik ve metoda tam erişime sahip olacaktır. Bu, üst ve alt bileşenler arasında sıkı bağlı uygulama detayları oluşturmayı kolaylaştırır, bu nedenle bileşen referanslarının yalnızca gerçekten gerekli olduğunda kullanılmalıdır - çoğu durumda, üst / alt etkileşimleri standart props ve emit arayüzlerini kullanarak uygulamayı denemelisiniz.



Burada bir istisna, `` kullanan bileşenler **varsayılan olarak gizlidir**: üst bileşen, bir çocuk bileşeni `` ile referans alıyorsa, çocuk bileşenin kamu arayüzünü `defineExpose` makrosunu kullanarak açmadıkça, herhangi bir şeye erişemeyecektir:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Derleyici makroları, defineExpose gibi, içeri aktarıma ihtiyaç duymaz
defineExpose({
  a,
  b
})
</script>
```

Bir üst bileşen, bu bileşenin bir şablon referansı aracılığıyla bir örneğini aldığında, alınan örnek `{ a: number, b: number }` şeklinde olacaktır (referanslar, normal örneklerde olduğu gibi otomatik olarak açılacaktır).

Ayrıca bakınız: `Bileşen Şablon Referanslarının Tipi` 




`expose` seçeneği, bir çocuk örneğine erişimi kısıtlamak için kullanılabilir:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

Yukarıdaki örnekte, bir üst bileşen, bu bileşeni şablon ref aracılığıyla referans alıyorsa yalnızca `publicData` ve `publicMethod`'a erişebilecektir.