---
title: Kullanım Türleri
seoTitle: Prop Types and Utility Types in Vue
sidebar_position: 4
description: Bu doküman, Vuedaki propsları ve kullanım türlerini açıklamakta, örneklerle desteklemektedir. Özellikle TypeScript ile kullanımına dair bilgiler içermektedir.
tags: 
  - kullanım türleri
  - Vue
  - TypeScript
  - props
keywords: 
  - kullanım türleri
  - Vue
  - TypeScript
  - props
---
## Kullanım Türleri {#utility-types}

:::info
Bu sayfa, kullanımında açıklamaya ihtiyaç duyabilecek birkaç yaygın kullanılan kullanım türünü listelemektedir. Tüm dışa aktarılan türlerin tam listesi için [kaynak koduna](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131) bakın.
:::

## PropType

Runtime props deklarasyonları kullanırken bir prop'u daha karmaşık türlerle belirtmek için kullanılır.

- **Örnek**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // `Object` için daha spesifik bir tür sağlayın
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Ayrıca bakınız** `Rehber - Bileşen Props'unu Türlendirme`

## MaybeRef {#mayberef}

- Sadece 3.3+ sürümlerinde desteklenir.

`T | Ref` için bir takma ad. `Kompozitler` için argümanları belirtmekte faydalıdır.

## MaybeRefOrGetter {#maybereforgetter}

- Sadece 3.3+ sürümlerinde desteklenir.

`T | Ref | (() => T)` için bir takma ad. `Kompozitler` için argümanları belirtmekte faydalıdır.

## ExtractPropTypes {#extractproptypes}

Runtime props seçenek nesnesinden prop türlerini çıkarır. Çıkarılan türler içsel olarak tanımlıdır - yani, bileşen tarafından alınan çözümlenmiş props'lardır. Bu, boolean props ve varsayılan değerlere sahip props'ların her zaman tanımlı olduğu anlamına gelir, hatta gerekli olmasalar bile.

Genel kullanıcıya açık props'ları çıkarmak için, yani, ebeveynin geçmesine izin verilen props'ları çıkarmak için `ExtractPublicPropTypes` kullanın.

- **Örnek**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes {#extractpublicproptypes}

- Sadece 3.3+ sürümlerinde desteklenir.

Runtime props seçenek nesnesinden prop türlerini çıkarır. Çıkarılan türler genel kullanıma açıktır - yani, ebeveynin geçmesine izin verilen props'lardır.

- **Örnek**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

Özel genel özellikleri desteklemek için bileşen örneği türünü geliştirmek için kullanılır.

- **Örnek**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  Geliştirmeler bir `.ts` veya `.d.ts` modül dosyasında yer almalıdır. Daha fazla ayrıntı için `Tür Geliştirme Yerleşimi` sayfasına bakın.
  :::

- **Ayrıca bakınız** `Rehber - Küresel Özellikleri Geliştirme`

## ComponentCustomOptions {#componentcustomoptions}

Özel seçenekleri desteklemek için bileşen seçenek türünü geliştirmek için kullanılır.

- **Örnek**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  Geliştirmeler bir `.ts` veya `.d.ts` modül dosyasında yer almalıdır. Daha fazla ayrıntı için `Tür Geliştirme Yerleşimi` sayfasına bakın.
  :::

- **Ayrıca bakınız** `Rehber - Özel Seçenekleri Geliştirme`

## ComponentCustomProps {#componentcustomprops}

Tanımlanmamış props'ları TSX öğeleri üzerinde kullanabilmek için izin verilen TSX props'larını artırmak için kullanılır.

- **Örnek**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // artık hello tanımlı bir prop olmasa bile çalışır
  <MyComponent hello="world" />
  ```

  :::tip
  Geliştirmeler bir `.ts` veya `.d.ts` modül dosyasında yer almalıdır. Daha fazla ayrıntı için `Tür Geliştirme Yerleşimi` sayfasına bakın.
  :::

## CSSProperties {#cssproperties}

Stil özellik bağlamalarında izin verilen değerleri artırmak için kullanılır.

- **Örnek**

  Herhangi bir özel CSS özelliğine izin verin

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
Geliştirmeler bir `.ts` veya `.d.ts` modül dosyasında yer almalıdır. Daha fazla ayrıntı için `Tür Geliştirme Yerleşimi` sayfasına bakın.
:::

:::info Ayrıca bakınız
SFC `` etiketleri, dinamik bileşen durumuna bağlı olarak CSS değerlerini bağlama desteği sunar ve bu, tür artırımı olmaksızın özel özellikler oluşturulmasını sağlar.

- `CSS'de v-bind() `
:::