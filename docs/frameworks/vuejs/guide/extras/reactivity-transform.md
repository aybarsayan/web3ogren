---
title: Reaktivite Dönüştürme
seoTitle: Vue Reaktivite Dönüştürme Özelliği
sidebar_position: 2
description: Reaktivite Dönüştürme, Vuenun Composition APIsine özgü bir özellik olup, temel reaktivite yönetimini geliştirir. Bu belge, nasıl kullanılacağını açıklamaktadır.
tags: 
  - Vue
  - reaktivite
  - Composition API
  - makrolar
keywords: 
  - Vue reaktivite
  - Composition API
  - makro dönüşüm
  - reaktif değişkenler
---
## Reaktivite Dönüştürme {#reactivity-transform}

:::danger Kaldırılan Deneysel Özellik
Reaktivite Dönüştürme, deneysel bir özellikti ve en son 3.4 sürümünde kaldırıldı. Lütfen [nedenini buradan okuyun](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

Hala kullanmayı düşünüyorsanız, artık [Vue Makroları](https://vue-macros.sxzz.moe/features/reactivity-transform.html) eklentisi aracılığıyla mevcuttur.
:::

:::tip Composition-API'ye Özgü
Reaktivite Dönüştürme, Composition-API'ye özgü bir özelliktir ve bir derleme adımı gerektirir.
:::

## Refs vs. Reaktif Değişkenler {#refs-vs-reactive-variables}

Composition API'nin tanıtılmasından bu yana, çözülemeyen temel sorulardan biri, refs ve reaktif nesnelerin kullanımıdır. **Reaktif nesneleri çözümlerken reaktiviteyi kaybetmek kolaydır**, oysa refs kullanıldığında her yerde `.value` kullanmak zahmetli olabilir. Ayrıca, bir tür sistemi kullanılmadığı takdirde `.value` kullanımı kolayca gözden kaçabilir.

> [Vue Reaktivite Dönüştürme](https://github.com/vuejs/core/tree/main/packages/reactivity-transform), şu şekilde kod yazmamıza olanak tanıyan bir derleme zamanı dönüştürmesidir:

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Buradaki `$ref()` metodu, bir **derleme zamanı makrosu**dır: bu, çalışma zamanı sırasında çağrılacak gerçek bir yöntem değildir. Bunun yerine, Vue derleyici bunu, elde edilen `count` değişkenini bir **reaktif değişken** olarak ele alması için bir ipucu olarak kullanır.

**Reaktif değişkenlere normal değişkenler gibi erişilebilir ve tekrar atama yapılabilir, ancak bu işlemler `.value` ile refs'e derlenir.** Örneğin, yukarıdaki bileşenin `` kısmı şu şekilde derlenir:

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

Refs döndüren her reaktivite API'sinin bir `$` ile başlayan makrosu olacaktır. Bu API'ler şunlardır:

- `ref` -> `$ref`
- `computed` -> `$computed`
- `shallowRef` -> `$shallowRef`
- `customRef` -> `$customRef`
- `toRef` -> `$toRef`

Bu makrolar küresel olarak mevcuttur ve Reaktivite Dönüştürme etkinleştirildiğinde içe aktarım gerektirmez, ancak daha açık olmak isterseniz `vue/macros`'tan içe aktarabilirsiniz:

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## `$()` ile Çözümleme {#destructuring-with}

Bir bileşim işlevinin refs nesnesini döndürmesi ve bu refs'i çözümlemek için çözümleme kullanması yaygındır. Bu amaçla, reaktivite dönüştürme **`$()`** makrosunu sağlar:

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

Derlenmiş çıktı:

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

Eğer `x` zaten bir ref ise, `toRef(__temp, 'x')` onu olduğu gibi döndürecektir ve ek bir ref oluşturulmayacaktır. Eğer bir çözümleme değeri bir ref değilse (örneğin bir fonksiyon), yine de çalışacaktır - değer bir ref içinde sarılacak ve diğer kodun beklendiği gibi çalışmasını sağlayacaktır.

**`$()` çözümleme, hem reaktif nesnelerde hem refs içeren düz nesnelerde çalışır.**

## Mevcut Refs'i Reaktif Değişkenlere Dönüştürme `$()` ile {#convert-existing-refs-to-reactive-variables-with}

Bazı durumlarda, refs döndüren sarmalanmış fonksiyonlara sahip olabiliriz. Ancak, Vue derleyici, bir fonksiyonun bir ref döndüreceğini önceden bilemeyecektir. Bu tür durumlarda, `$()` makrosu mevcut refs'i reaktif değişkenlere dönüştürmek için de kullanılabilir:

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## Reaktif Props Çözümleme {#reactive-props-destructure}

`` içindeki mevcut `defineProps()` kullanımında iki acı noktası bulunmaktadır:

1. `.value` gibi, reaktiviteyi korumak için `props.x` olarak her zaman props'e erişmeniz gerekir. Bu, `defineProps`'ı çözümlemekten alıkoyar çünkü sonuçta çözümlenen değişkenler reaktif değildir ve güncellenmeyecektir.

2. `Yalnızca türde props tanımı` kullanıldığında, props için varsayılan değerleri belirtmenin kolay bir yolu yoktur. Bu kesin amaç için `withDefaults()` API'sini tanıttık, ancak kullanımı hala karmaşık.

Bu sorunları, `$()` ile gördüğümüz gibi, çözümleme ile `defineProps` kullanılırken bir derleme zamanı dönüştürmesi uygulanarak çözebiliriz:

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // varsayılan değer sadece çalışır
    count = 1,
    // yerel takma adlandırma da sadece çalışır
    // burada `props.foo`'yu `bar` olarak takma adlandırıyoruz
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // props değiştiğinde günlüğe kaydedecek
    console.log(msg, count, bar)
  })
</script>
```

Yukarıdaki, şu şekilde derlenmiş bir çalışma zamanı bildirimine dönüştürülecektir:

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## Fonksiyon Sınırları Boyunca Reaktiviteyi Koruma {#retaining-reactivity-across-function-boundaries}

Reaktif değişkenler, `.value` kullanma zorunluluğundan kurtarırken, reaktif değişkenleri işlev sınırları arasında geçirirken "reaktivite kaybı" sorununu oluşturur. Bu iki durumda meydana gelebilir:

### Bir argüman olarak işlevine geçiş {#passing-into-function-as-argument}

Bir ref olarak bir argüman bekleyen bir işlev verildiğinde, örneğin:

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x değişti!')
  })
}

let count = $ref(0)
trackChange(count) // çalışmıyor!
```

Yukarıdaki durum, beklenildiği gibi çalışmayacaktır çünkü şu şekilde derlenir:

```ts
let count = ref(0)
trackChange(count.value)
```

Burada `count.value` bir sayı olarak geçerken, `trackChange` gerçek bir ref beklemektedir. Bunu düzeltmek için `count`'ı geçmeden önce `$$()` ile sarmalayabiliriz:

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

Yukarıdaki şu şekilde derlenir:

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

Gördüğümüz gibi, `$$()` reaktif değişkenler için **kaçış ipucu** olarak hizmet eden bir makrodur: `$$()` içindeki reaktif değişkenlere `.value` eklenmeyecektir.

### Fonksiyon kapsamı içinde döndürme {#returning-inside-function-scope}

Reaktif değişkenler, doğrudan döndürülen bir ifadede kullanılırsa reaktiviteyi kaybedebilir:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // mouse hareketini dinle...

  // çalışmıyor!
  return {
    x,
    y
  }
}
```

Yukarıdaki return ifadesi şu şekilde derlenir:

```ts
return {
  x: x.value,
  y: y.value
}
```

Reaktiviteyi korumak için, aslında refs döndürmeliyiz, döndürme zamanında mevcut değeri değil.

Bu durumu düzeltmek için `$$()` kullanabiliriz. Bu durumda, `$$()` döndürülen nesne üzerinde doğrudan kullanılabilir - `$$()` çağrısı içindeki reaktif değişkenlere dair herhangi bir referans, altında yatan refs'e olan referansı koruyacaktır:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // mouse hareketini dinle...

  // düzeltildi
  return $$({
    x,
    y
  })
}
```

### Çözümleme edilen props üzerinde `$$()` kullanma {#using-on-destructured-props}

`$$()` çözümlenen props'lar üzerinde çalışır çünkü bunlar da reaktif değişkenlerdir. Derleyici, bu durumu verimlilik için `toRef` ile dönüştürecektir:

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

şu şekilde derlenir:

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## TypeScript Entegrasyonu  {#typescript-integration}

Vue, bu makrolar için (küresel olarak mevcut) tipler sunar ve tüm türler beklendiği gibi çalışacaktır. **Standart TypeScript semantiklerinde herhangi bir uyumsuzluk yoktur**, bu nedenle sözdizimi tüm mevcut araçlarla çalışacaktır.

Bu, makroların yalnızca geçerli JS/TS'nin izin verildiği dosyalarda - yalnızca Vue SFC'lerinde değil - çalışabileceği anlamına gelir.

Makrolar küresel olarak mevcut olduğundan, türlerinin açık bir şekilde referans verilmesi gerekir (örneğin bir `env.d.ts` dosyasında):

```ts
/// <reference types="vue/macros-global" />
```

Makroları `vue/macros`'tan açık bir şekilde içe aktarırken, türleri küresel olarak bildirimde bulunmadan çalışacaktır.

## Açık Opt-in {#explicit-opt-in}

:::danger Artık çekirdekte desteklenmiyor
Aşağıdaki, Vue sürüm 3.3 ve altındaki sürümler için geçerlidir. Destek, Vue çekirdeği 3.4 ve üzeri ile kaldırılmıştır ve `@vitejs/plugin-vue` 5.0 ve üzeri ile kaldırılmıştır. Dönüştürmeyi kullanmaya devam etmeyi düşünüyorsanız, lütfen [Vue Makroları](https://vue-macros.sxzz.moe/features/reactivity-transform.html) ile geçiş yapın.
:::

### Vite {#vite}

- `@vitejs/plugin-vue@>=2.0.0` gerektirir
- SFC'ler ve js(x)/ts(x) dosyalarına uygulanır. Dönüşüm uygulanmadan önce dosyalar üzerinde hızlı bir kullanım kontrolü yapılır, bu nedenle makroları kullanmayan dosyalar için performans maliyeti olmamalıdır.
- `reactivityTransform` artık `script.refSugar` olarak iç içe geçmek yerine eklenti kök düzeyinde bir seçenek olduğundan, yalnızca SFC'leri etkilemez.

```js
// vite.config.js
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- Mevcut durumda yalnızca SFC'leri etkiler
- `vue-loader@>=17.0.0` gerektirir

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### Düz `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- Mevcut durumda yalnızca SFC'leri etkiler
- `vue-loader@>=17.0.0` gerektirir

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}