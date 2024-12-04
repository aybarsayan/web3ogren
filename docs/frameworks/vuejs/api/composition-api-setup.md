---
title: Composition API
seoTitle: Comprehensive Guide to Composition API in Vue
sidebar_position: 4
description: This document provides an in-depth understanding of the Composition API, its usage in Vue components, and best practices for effective implementation.
tags: 
  - Vue
  - Composition API
  - Development
keywords: 
  - Vue
  - Composition API
  - setup
  - reactivity
---
## Composition API: setup() {#composition-api-setup}

## Temel Kullanım {#basic-usage}

`setup()` kancası, aşağıdaki durumlarda bileşenlerde Composition API kullanımının giriş noktası olarak hizmet eder:

1. Yapı aşaması olmadan Composition API kullanmak;
2. Options API bileşeninde Composition-API tabanlı kod ile entegrasyon.

:::info Not
Eğer Tek Dosya Bileşenleri ile Composition API kullanıyorsanız, daha özlü ve ergonomik bir söz dizimi için `` şiddetle tavsiye edilir.
:::

Reaktif durumu `Reactivity API'leri` kullanarak tanımlayabiliriz ve `setup()`'tan bir nesne döndürerek onları şablona açabiliriz. Döndürülen nesnedeki özellikler ayrıca bileşen örneğinde de mevcut olacaktır (diğer seçenekler kullanılıyorsa):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // şablona ve diğer seçenek API kancalarına aç
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

`setup`'tan dönen `refs`, şablonda erişildiğinde `otomatik olarak yüzeysel bir şekilde açılır` bu nedenle onlara erişirken `.value` kullanmanıza gerek yoktur. Onlar `this` üzerinde erişildiğinde de aynı şekilde açılır.

> **Önemli Not:** `setup()` kendisi bileşen örneğine erişime sahip değildir - `setup()` içinde `this` değeri `undefined` olacaktır. Options API'den Composition API ile açılan değerlere erişebilirsiniz, ancak bunun tersini yapamazsınız.

`setup()` bir nesneyi _senkronize_ olarak döndürmelidir. `async setup()` kullanılabileceği tek durum, bileşenin bir `Suspense` bileşeninin alt bileşeni olmasıdır.

## Props Erişimi {#accessing-props}

`setup` fonksiyonundaki ilk argüman `props` argümanıdır. Standart bir bileşende beklediğiniz gibi, bir `setup` fonksiyonu içindeki `props` reaktiftir ve yeni props geçildiğinde güncellenir.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Eğer `props` nesnesini destructure ederseniz, destructure edilen değişkenler reaktivitesini kaybedecektir. Bu nedenle, her zaman `props.xxx` şeklinde props'lara erişmeniz önerilir.

:::tip İpucu
Eğer gerçekten props'ları destructure etmeniz gerekirse veya bir prop'u dış bir işlevin içine geçirirken reaktiviteyi korumanız gerekirse, bunu `toRefs()` ve `toRef()` yardımcı API'leri ile yapabilirsiniz.
:::

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // `props`'ı bir refs nesnesine dönüştür, ardından destructure et
    const { title } = toRefs(props)
    // `title`, `props.title`'ı takip eden bir ref
    console.log(title.value)

    // VEYA, `props` üzerindeki tek bir özelliği bir ref'e dönüştür
    const title = toRef(props, 'title')
  }
}
```

## Setup Bağlamı {#setup-context}

`setup` fonksiyonuna geçirilen ikinci argüman **Setup Bağlamı** nesnesidir. Bağlam nesnesi, `setup` içinde faydalı olabilecek diğer değerleri açar:

```js
export default {
  setup(props, context) {
    // Özellikler (Reaktif olmayan nesne, $attrs'a eşdeğer)
    console.log(context.attrs)

    // Slotlar (Reaktif olmayan nesne, $slots'a eşdeğer)
    console.log(context.slots)

    // Olayları Yaymak (Fonksiyon, $emit'e eşdeğer)
    console.log(context.emit)

    // Kamuya açık özellikleri açmak (Fonksiyon)
    console.log(context.expose)
  }
}
```

Bağlam nesnesi reaktif değildir ve güvenle destructure edilebilir:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` ve `slots`, bileşen güncellendiğinde her zaman güncellenen durum nesneleridir. Bu nedenle, onları destructure etmemek ve her zaman `attrs.x` veya `slots.x` olarak özelliklere atıfta bulunmak önemlidir. Ayrıca, `props`'ların aksine, `attrs` ve `slots`'ın özellikleri **reaktif değildir**. Eğer `attrs` veya `slots` üzerindeki değişikliklere dayalı yan etkiler uygulamayı düşünüyorsanız, bunu bir `onBeforeUpdate` yaşam döngüsü kancasının içinde yapmalısınız.

### Kamuya Açık Özellikleri Açma {#exposing-public-properties}

`expose`, bileşen örneğine üst bileşen tarafından `şablon referansları` aracılığıyla erişildiğinde açık olan özellikleri açıkça sınırlamak için kullanılabilen bir fonksiyondur:

```js{5,10}
export default {
  setup(props, { expose }) {
    // örneği "kapalı" yap -
    // yani, üst bileşene hiçbir şey açma
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // yerel durumu seçerek aç
    expose({ count: publicCount })
  }
}
```

## Render Fonksiyonları ile Kullanım {#usage-with-render-functions}

`setup`, aynı kapsamda tanımlanan reaktif durumu doğrudan kullanabilen bir `render fonksiyonu` da döndürebilir:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Bir render fonksiyonu döndürmek, başka bir şey döndürmemizi engeller. Dahili olarak bunun bir sorun olmaması gerekir, ancak bu bileşenin yöntemlerini üst bileşene şablon referansları aracılığıyla açmak isterseniz sorun yaratabilir.

Bu sorunu `expose()` çağrısını yaparak çözebiliriz:

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

`increment` metodu, o zaman üst bileşende bir şablon referansı aracılığıyla mevcut olacaktır.