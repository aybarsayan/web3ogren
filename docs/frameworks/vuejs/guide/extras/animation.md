---
title: Animasyon Teknikleri
seoTitle: Vue Animasyon Teknikleri ve Uygulamaları
sidebar_position: 4
description: Vueda animasyon teknikleri hakkında bilgi edinin. Giriş/çıkış animasyonları, sınıf tabanlı ve durum tabanlı animasyonların nasıl uygulanacağını öğrenin.
tags: 
  - Vue
  - Animasyon
  - Geçişler
  - Geliştirme
keywords: 
  - Vue
  - Animasyon
  - Geçişler
  - CSS
  - Geliştirme
---
## Animasyon Teknikleri {#animation-techniques}

Vue, giriş/çıkış ve liste geçişlerini yönetmek için `` ve `` bileşenlerini sağlar. Ancak, bir Vue uygulamasında bile animasyon kullanmanın birçok başka yolu vardır. Burada birkaç ek teknik tartışacağız.

## Sınıf Tabanlı Animasyonlar {#class-based-animations}

:::tip
DOM'a girmeyen/çıkmayan öğeler için animasyonları dinamik olarak bir CSS sınıfı ekleyerek tetikleyebiliriz.
:::



```js
const disabled = ref(false)

function warnDisabled() {
  disabled.value = true
  setTimeout(() => {
    disabled.value = false
  }, 1500)
}
```




```js
export default {
  data() {
    return {
      disabled: false
    }
  },
  methods: {
    warnDisabled() {
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 1500)
    }
  }
}
```



```vue-html
<div :class="{ shake: disabled }">
  <button @click="warnDisabled">Bana tıkla</button>
  <span v-if="disabled">Bu özellik devre dışı bırakıldı!</span>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```



## Durum Tabanlı Animasyonlar {#state-driven-animations}

:::info
Bazı geçiş efektleri, bir etkileşim meydana geldiğinde bir öğeye stil bağlayarak değerleri ara değerlerle uygulamak suretiyle uygulanabilir.
:::



```js
const x = ref(0)

function onMousemove(e) {
  x.value = e.clientX
}
```




```js
export default {
  data() {
    return {
      x: 0
    }
  },
  methods: {
    onMousemove(e) {
      this.x = e.clientX
    }
  }
}
```



```vue-html
<div
  @mousemove="onMousemove"
  :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
  class="movearea"
>
  <p>Fareyi bu divin etrafında hareket ettir...</p>
  <p>x: {{ x }}</p>
</div>
```

```css
.movearea {
  transition: 0.3s background-color ease;
}
```



:::note
Renklerin yanı sıra, transform, genişlik veya yükseklik animasyonu için stil bağlamaları da kullanabilirsiniz.
:::

Hatta spring fiziği kullanarak SVG yollarını animatize edebilirsiniz - sonuçta, hepsi birer nitelik veri bağlamasıdır:



## Gözlemcilerle Animasyon Yapma {#animating-with-watchers}

:::warning
Biraz yaratıcılıkla, bazı sayısal durumlara dayanan gözlemcileri kullanarak her şeyi animatize edebiliriz.
:::

```vue-html
Bir sayı yazın: <input v-model.number="number" />
<p>{{ tweened.number.toFixed(0) }}</p>
```



```js
import { ref, reactive, watch } from 'vue'
import gsap from 'gsap'

const number = ref(0)
const tweened = reactive({
  number: 0
})

watch(number, (n) => {
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
})
```




```js
import gsap from 'gsap'

export default {
  data() {
    return {
      number: 0,
      tweened: 0
    }
  },
  watch: {
    number(n) {
      gsap.to(this, { duration: 0.5, tweened: Number(n) || 0 })
    }
  }
}
```

```vue-html
Bir sayı yazın: <input v-model.number="number" />
<p>{{ tweened.toFixed(0) }}</p>
```







:::note
[Açık Oyun Alanında Deneyin](https://play.vuejs.org/#eNpNUstygzAM/BWNLyEzBDKd6YWSdHrpsacefSGgJG7xY7BImhL+vTKv9ILllXYlr+jEm3PJpUWRidyXjXIEHql1e2mUdrYh6KDBY8yfoiR1wRiuBZVn6OHYWA0r5q6W2pMv3ISHkBPSlNZ4AtPqAzawC2LRdj3DdEU0WA34qB910sBUnsFWmp6LpRmaRo9UHMLIrGG3h4EBQ/OEbDRpxjx51TYFKWtYKHmOF9WP4Qzs+x22EDoA9NLwmaejC/x+vhBqVxeEfAPIK3WBsi6830lRobZSDDjA580hFIt8roxrCS4bbSuskxFmzhhIAenEy92id1CnzZzfd91szETmZ72rH6zYOej7PA3rYXrKE3GUp//m5KunWx3C5CE6enS0hjZXVKczZXCwdfWyoF79YgZPqBliJ9iGSUTEYlzuRrO9X94a/lUGNTklvBTZvAMpwhYCIMWZyPksTVvjvk9JaXUacq9sSlujFJPnvej/AElH3FQ=)
:::




:::note
[Açık Oyun Alanında Deneyin](https://play.vuejs.org/#eNpNUctugzAQ/JWVLyESj6hSL5Sm6qXHnnr0xYENuAXbwus8Svj3GlxIJEvendHMvgb2bkx6cshyVtiyl4b2XMnO6J6gtsLAsdcdbKZwwxVXeJmpCo/CtQQDVwCVIBFtQwzQI7leLRmAct0B+xx28YLQGVFh5aGAjNM3zvRZUNnkizhII7V6w9xTSjqiRtoYBqhcL0hq5c3S5/hu/blKbzfYwbh9LMWVf0W2zusTws60gnDK6OtqEMTaeSGVcQSnpNMVtmmAXzkLAWeQzarCQNkKaz1zkHWysPthWNryjX/IC1bRbgvjWGTG64rssbQqLF3bKUzvHmH6o1aUnFHWDeVw0G31sqJW/mIOT9h5KEw2m7CYhUsmnV/at9XKX3n24v+E5WxdNmfTbieAs4bI2DzLnDI/dVrqLpu4Nz+/a5GzZYls/AM3dcFx)
:::