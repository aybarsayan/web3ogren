---
title: Kompozisyon API Yardımcılar
seoTitle: Composition API Helpers
sidebar_position: 4
description: Bu doküman, Vue Composition API yardımcı fonksiyonları hakkında bilgi verir. useAttrs(), useSlots(), useModel, useTemplateRef ve useId gibi fonksiyonları içerir.
tags: 
  - Vue
  - Composition API
  - Helper Functions
  - JavaScript
keywords: 
  - Composition API
  - useAttrs
  - useSlots
  - useModel
  - useTemplateRef
  - useId
---
## useAttrs() {#useattrs}

`attrs` nesnesini `Setup Context` içinden döner. Bu nesne, mevcut bileşenin `geçiş özelliklerini` içerir. Bu, setup context nesnesinin mevcut olmadığı `` içinde kullanılmak üzere tasarlanmıştır.

- **Tür**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

`slots` nesnesini `Setup Context` içinden döner. Bu nesne, üst bileşenden geçirilen slotları, sanal DOM düğümlerini döndüren çağrılabilir fonksiyonlar olarak içerir. Bu, setup context nesnesinin mevcut olmadığı `` içinde kullanılmak üzere tasarlanmıştır.

TypeScript kullanılıyorsa, `defineSlots()` tercih edilmelidir.

- **Tür**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

`defineModel()` fonksiyonunu destekleyen temel yardımcıdır. `` kullanıyorsanız, `defineModel()` tercih edilmelidir.

- Sadece 3.4+ sürümlerinde mevcut

- **Tür**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **Örnek**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- :::info
  `useModel()` SFC olmayan bileşenlerde de kullanılabilir, örneğin ham `setup()` fonksiyonu kullanıldığında. İlk argüman olarak `props` nesnesini alır ve ikinci argüman olarak model adını bekler. Opsiyonel üçüncü argüman, sonuç model referansı için özel alıcı ve ayarlayıcı tanımlamak için kullanılabilir. `defineModel()`'ın aksine, prop'ları ve emisyonları kendiniz tanımlamak ile sorumlusunuz.
  :::

## useTemplateRef()  {#usetemplateref}

Değeri, eşleşen ref özniteliğine sahip şablon öğesi veya bileşen ile senkronize edilecek yüzeyel bir referans döner.

- **Tür**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Örnek**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **Ayrıca bakınız**
  - `Kılavuz - Şablon Referansları`
  - `Kılavuz - Şablon Referanslarını Yazma` 
  - `Kılavuz - Bileşen Şablon Referanslarını Yazma` 

## useId()  {#useid}

Erişilebilirlik öznitelikleri veya form öğeleri için uygulamaya özgü benzersiz kimlikler oluşturmak için kullanılır.

- **Tür**

  ```ts
  function useId(): string
  ```

- **Örnek**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Ad:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- :::tip
  `useId()` tarafından oluşturulan kimlikler, uygulama başına benzersizdir. Form öğeleri ve erişilebilirlik öznitelikleri için kimlikler oluşturmakta kullanılabilir. Aynı bileşende birden fazla çağrı, farklı kimlikler üretecek; aynı bileşenin birden fazla örneği `useId()` çağırdığında da farklı kimlikler olacaktır.
  :::

- :::danger
  `useId()` tarafından oluşturulan kimliklerin, sunucu ve istemci renderları arasında da sabitlenmesi garantidir, bu nedenle SSR uygulamalarında hidrasyon uyumsuzluklarına neden olmadan kullanılabilir. Aynı sayfada birden fazla Vue uygulama örneğiniz varsa, her uygulamanın hedef kimliğini belirterek ID çakışmalarını önlemek için `app.config.idPrefix` ile bir ID ön eki verebilirsiniz.
  :::