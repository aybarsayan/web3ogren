---
title: Genel API
seoTitle: Genel API for Vue
sidebar_position: 1
description: Vuenin Genel APIsine dair detaylı bilgiler ve örnekler içeren belge. Bu belge, temel bileşen tanımlama ve DOM manipülasyonu konularında rehberlik eder.
tags: 
  - Vue
  - API
  - Bileşen
  - Asenkron
keywords: 
  - vue
  - genel api
  - bileşen tanımlama
  - dom güncelleme
  - asenkron
---
## Genel API: Genel {#global-api-general}

## sürüm {#version}

Vue'nin mevcut sürümünü açığa çıkarır.

- **Tür:** `string`

- **Örnek**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Bir sonraki DOM güncellemesi için bekleyen bir yardımcı program.

- **Tür**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Ayrıntılar**

  Vue'de reaktif durumu değiştirirken, sonuç olarak oluşan DOM güncellemeleri senkronize bir şekilde uygulanmaz. Bunun yerine, Vue her bileşenin yalnızca bir kez güncellenmesini sağlamak için "bir sonraki tik" için bunları tamponlar, yaptığınız durum değişikliklerinden bağımsız olarak.

  `nextTick()`, bir durum değişikliğinden hemen sonra DOM güncellemelerinin tamamlanmasını beklemek için kullanılabilir. Bir geri çağırma işlevi argümanı olarak geçirebilir ya da döndürülen Promise'i bekleyebilirsiniz.

- **Örnek**

  
    Kapsamlı Örnek: Composition API

  

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM henüz güncellenmedi
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM şimdi güncellendi
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  
  

  
    Kapsamlı Örnek: Options API

  

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM henüz güncellenmedi
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM şimdi güncellendi
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  
  

- **Ayrıca bakınız** `this.$nextTick()`

## defineComponent() {#definecomponent}

Tür çıkarımı ile bir Vue bileşeni tanımlamak için bir tür yardımcıdır.

- **Tür**

  ```ts
  // seçenek sözdizimi
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // işlev sözdizimi (3.3+ gerektirir)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > Tür, okunabilirlik için basitleştirilmiştir.

- **Ayrıntılar**

  İlk argüman bir bileşen seçenekleri nesnesi bekler. Döndürülen değer, tür çıkarımı amaçları için işlevin temelde bir çalışma zamanı no-op olduğu için aynı seçenekler nesnesi olacaktır.

  Dikkat edilmesi gereken döndürme türü biraz özeldir: bileşen örneği türüne dayanan ve seçenekler bazında çıkarılan bir yapı türü olacaktır. Bu, döndürülen tür bir TSX etiketinde kullanıldığında tür çıkarımı için kullanılır.

  Bir bileşenin örnek türünü (seçeneklerinde `this` türüne eşdeğer) `defineComponent()` dönüş türünden şu şekilde çıkarabilirsiniz:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### İşlev İmzası {#function-signature}

  - Sadece 3.3+ sürümlerde desteklenmektedir.

  `defineComponent()`, Composition API ve `render işlevleri veya JSX` ile kullanılmak üzere alternatif bir imzaya sahiptir. Bir seçenek nesnesi geçirmek yerine, bir işlev beklenir. Bu işlev, `setup()` işlevine benzer: prop ve kurulum bağlamını alır. Dönüş değeri bir render işlevi olmalıdır - hem `h()` hem de JSX desteklenmektedir:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // <script setup> içinde olduğu gibi Composition API'yi kullanın
      const count = ref(0)

      return () => {
        // render işlevi veya JSX
        return h('div', count.value)
      }
    },
    // ekstra seçenekler, örn. props ve emits bildirin
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  Bu imzanın temel kullanım durumu TypeScript ile (özellikle TSX ile)dir, çünkü jenerik desteği vardır:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // <script setup> içinde olduğu gibi Composition API'yi kullanın
      const count = ref(0)

      return () => {
        // render işlevi veya JSX
        return <div>{count.value}</div>
      }
    },
    // manuel çalışma zamanı prop bildirimi şu anda hala gereklidir.
    {
      props: ['msg', 'list']
    }
  )
  ```

  Gelecekte, çalışma zamanı prop bildirimini atlayabilmeniz için otomatik çıkarım ve enjekte eden bir Babel eklentisi sağlamayı planlıyoruz.

  ### webpack Treeshaking ile ilgili not {#note-on-webpack-treeshaking}

  `defineComponent()` bir işlev çağrısı olduğu için, bazı derleme araçlarında yan etkiler üretecek gibi görünebilir, örn. webpack. Bu, bileşenin hiçbir zaman kullanılmadığında bile ağaç titizlenmesinden kaçınır.

  webpack'e bu işlev çağrısının ağaç titizlenmesi için güvenli olduğunu bildirmek için, işlev çağrısından önce `/*#__PURE__*/` yorum notasyonu ekleyebilirsiniz:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Bu, Vite kullanıyorsanız gerekli değildir, çünkü Vite tarafından kullanılan temel üretim paketleyici Rollup, manuel notasyonlara ihtiyaç duymadan `defineComponent()`'ın gerçekten yan etkisiz olduğunu belirlemek için yeterince akıllıdır.

- **Ayrıca bakınız** `Kılavuz - TypeScript ile Vue Kullanımı`

## defineAsyncComponent() {#defineasynccomponent}

Sadece render edildiğinde tembel yüklenen bir asenkron bileşen tanımlayın. Argüman ya bir yükleyici fonksiyonu ya da yükleme davranışı üzerinde daha gelişmiş kontrol için bir seçenek nesnesi olabilir.

- **Tür**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **Ayrıca bakınız** `Kılavuz - Asenkron Bileşenler`