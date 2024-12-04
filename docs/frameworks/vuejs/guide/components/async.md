---
title: Asenkron Bileşenler
seoTitle: Vue Asynchronous Components Overview
sidebar_position: 4
description: Asynchronous components in Vue allow for dynamic loading of components only when needed, optimizing performance and user experience. This guide covers their basic usage, error handling, and hydration strategies.
tags: 
  - Vue
  - Asynchronous Components
  - Dynamic Loading
  - Performance Optimization
keywords: 
  - Vue
  - Asynchronous Components
  - Dynamic Loading
  - Performance Optimization
---
## Asenkron Bileşenler {#async-components}

## Temel Kullanım {#basic-usage}

Büyük uygulamalarda, uygulamayı daha küçük parçalara ayırmamız ve yalnızca ihtiyaç duyulduğunda sunucudan bir bileşeni yüklememiz gerekebilir. Bunu mümkün kılmak için Vue, `defineAsyncComponent` fonksiyonunu sunar:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ... bileşeni sunucudan yükle
    resolve(/* yüklenmiş bileşen */)
  })
})
// ... `AsyncComp`'i normal bir bileşen gibi kullan
```

Gördüğünüz gibi, `defineAsyncComponent`, bir Promise döndüren bir yükleyici fonksiyonu kabul eder. Promise'in `resolve` geri çağrısı, bileşen tanımınızı sunucudan aldığınızda çağrılmalıdır. Yüklemenin başarısız olduğunu belirtmek için `reject(reason)` çağrısını da yapabilirsiniz.

:::info
[ES modül dinamik içe aktarma](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) de bir Promise döndürür, bu nedenle çoğu zaman bunu `defineAsyncComponent` ile birlikte kullanacağız. Vite ve webpack gibi paketleyiciler de bu söz dizimini destekler (ve bundle bölme noktaları olarak kullanır), bu nedenle Vue SFC'lerini içe aktarmak için bunu kullanabiliriz:
:::

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

Sonuç olarak `AsyncComp`, yalnızca sayfada gerçekten render edildiğinde yükleyici fonksiyonunu çağıran bir sargı bileşenidir. Ayrıca, herhangi bir props ve slot'u iç bileşene iletecektir, böylece asenkron sargıyı kullanarak orijinal bileşeni sorunsuz bir şekilde değiştirebilir ve tembel yükleme elde edebilirsiniz.

Normal bileşenler gibi, asenkron bileşenler de `küresel olarak kaydedilebilir` `app.component()` kullanılarak:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```


Options API Kullanımı

Ayrıca, bir bileşen yerel olarak `kaydedilirken` `defineAsyncComponent` kullanabilirsiniz:

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```




Composition API Kullanımı

Ayrıca, ebeveyn bileşenin içinde doğrudan tanımlanabilirler:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```



## Yükleme ve Hata Durumları {#loading-and-error-states}

Asenkron işlemler kaçınılmaz olarak yükleme ve hata durumlarını içerir - `defineAsyncComponent()` bu durumları gelişmiş seçenekler aracılığıyla yönetmeyi destekler:

```js
const AsyncComp = defineAsyncComponent({
  // yükleyici fonksiyon
  loader: () => import('./Foo.vue'),

  // asenkron bileşen yüklenirken kullanılacak bir bileşen
  loadingComponent: LoadingComponent,
  // yükleme bileşeninin gösterilmesinden önceki gecikme. Varsayılan: 200ms.
  delay: 200,

  // yükleme başarısız olursa kullanılacak bir bileşen
  errorComponent: ErrorComponent,
  // zaman aşımı sağlanırsa ve aşıldıysa hata bileşeni gösterilecektir.
  // Varsayılan: Sonsuz.
  timeout: 3000
})
```

Eğer bir yükleme bileşeni sağlanmışsa, iç bileşen yüklenirken önce o gösterilecektir. Yükleme bileşeninin gösterilmesinden önce varsayılan olarak 200ms'lik bir gecikme vardır - bu, hızlı ağlarda anlık yükleme durumunun çok hızlı bir şekilde değişmesi ve titreme gibi görünmesi nedeniyle yapılmıştır.

Eğer bir hata bileşeni sağlanmışsa, yükleyici fonksiyondan dönen Promise reddedildiğinde gösterilecektir. İsteğin çok uzun sürmesi durumunda hata bileşenini göstermek için bir zaman aşımı belirtebilirsiniz.

## Tembel Hidrasyon  {#lazy-hydration}

> Bu bölüm yalnızca `Sunucu Taraflı Rendering` kullanıyorsanız geçerlidir.

Vue 3.5+ sürümlerinde, asenkron bileşenler bir hidrasyon stratejisi sağlayarak ne zaman hidratlandıklarını kontrol edebilirler.

- Vue, birkaç yerleşik hidrasyon stratejisi sunar. Bu yerleşik stratejilerin kullanılmadıklarında ağaç sarsak için ayrı ayrı içe aktarılması gerekir.

- Tasarım, esneklik sağlamak için kasıtlı olarak düşük seviyelidir. Derleyici söz dizimi şekilleri gelecekte ya çekirdek ya da daha yüksek seviyeli çözümler (örn. Nuxt) üzerine inşa edilebilir.

### Boşta Hidrasyon {#hydrate-on-idle}

`requestIdleCallback` aracılığıyla hidrasyon:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* isteğe bağlı olarak maksimum zaman aşımını geçebilirsiniz */)
})
```

### Görünürken Hidrasyon {#hydrate-on-visible}

`IntersectionObserver` aracılığıyla element(ler) görünür olduğunda hidrasyon.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

Gözlemci için opsiyonel olarak bir nesne değeri geçebilirsiniz:

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Medya Sorgusu ile Hidrasyon {#hydrate-on-media-query}

Belirtilen medya sorgusu eşleştiğinde hidrasyon.

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Etkileşim ile Hidrasyon {#hydrate-on-interaction}

Belli bir olay(lar) bileşen element(ler) üzerinde tetiklendiğinde hidrasyon. Hidrasyon tamamlandığında tetikleyen olay da tekrar oynatılacaktır.

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

Ayrıca birden fazla olay türü listesi de olabilir:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Özel Strateji {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement, bileşenin hidratlanmamış DOM'undaki tüm kök elementleri
  // yinelemek için bir yardımcıdır, çünkü kök bir parça yerine
  // tek bir element olabilir
  forEachElement(el => {
    // ...
  })
  // hazır olduğunda `hydrate` çağrısını yap
  hydrate()
  return () => {
    // gerekirse bir kaldırma fonksiyonu döndür
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Suspense ile Kullanım {#using-with-suspense}

Asenkron bileşenler, `` yerleşik bileşeni ile birlikte kullanılabilir. `` ve asenkron bileşenler arasındaki etkileşim ` için özel bölümde` belgelenmiştir.