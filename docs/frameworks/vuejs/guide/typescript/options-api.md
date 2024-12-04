---
title: Seçenek API ile TypeScript
seoTitle: Seçenek API Kullanarak TypeScript ile Geliştirme
sidebar_position: 4
description: Bu sayfa, Vuenin Seçenek APIsini kullanarak TypeScript ile bileşen geliştirme yöntemlerini özetlemektedir. Propslar, emitler ve event handlerlar gibi konularda TypeScript desteğini ele almaktadır.
tags: 
  - Vue
  - TypeScript
  - Seçenek API
  - Bileşen
  - Geliştirme
keywords: 
  - Vue
  - TypeScript
  - Seçenek API
  - Bileşen
  - Geliştirme
---
## Seçenek API ile TypeScript {#typescript-with-options-api}

> Bu sayfanın, `Vue ile TypeScript Kullanımı` hakkında bir önizleme okuduğunuzu varsaydığını belirtmek isteriz.

:::tip
Vue, Seçenek API ile TypeScript kullanımını desteklese de, Composition API aracılığıyla Vue ile TypeScript kullanılması önerilmektedir; çünkü bu, daha basit, daha verimli ve daha sağlam tür çıkarımı sunar.
:::

## Bileşen Props'larını Tiplendirme {#typing-component-props}

Seçenek API'de props için tür çıkarımı, bileşenin `defineComponent()` ile sarmalanmasını gerektirir. Bu sayede, Vue `props` seçeneğine dayanarak, `required: true` ve `default` gibi ek seçenekleri dikkate alarak props'lar için türleri çıkarabilir:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // tür çıkarımı etkin
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // tür: string | undefined
    this.id // tür: number | string | undefined
    this.msg // tür: string
    this.metadata // tür: any
  }
})
```

Ancak, çalışma zamanı `props` seçenekleri yalnızca bir prop'un türü olarak constructor işlevlerini destekler – iç içe özelliklere veya işlev çağrı imzalarına sahip nesneler gibi karmaşık türler belirlemenin bir yolu yoktur.

Karmaşık props türlerini belirtilmek için `PropType` yardımcı türünü kullanabiliriz:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // `Object` için daha spesifik bir tür sağla
      type: Object as PropType<Book>,
      required: true
    },
    // işlevleri de belirtebiliriz
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS Hatası: 'string' türündeki argüman
    // 'number' türündeki parametreye atanamaz
    this.callback?.('123')
  }
})
```

### Uyarılar {#caveats}

Eğer TypeScript sürümünüz `4.7`'den düşükse, `validator` ve `default` prop seçenekleri için işlev değerlerini kullanırken dikkatli olmalısınız – ok işlevleri kullanmaya özen gösterin:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // TypeScript sürümünüz 4.7'den düşükse ok işlevlerini kullanın
      default: () => ({
        title: 'Ok İşlev İfadesi'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Bu, TypeScript'in bu işlevler içinde `this`'in türünü çıkarması gerekliliğini önler; bu durum, maalesef, tür çıkarımının başarısız olmasına neden olabilir. Bu, önceki bir [tasarım sınırlaması](https://github.com/microsoft/TypeScript/issues/38845) idi ve şimdi [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods) ile geliştirilmiştir.

## Bileşen Emit'lerini Tiplendirme {#typing-component-emits}

Bir yayılmış etkinliğin beklenen yük payload türünü `emits` seçeneğinin nesne sözdizimini kullanarak bildirebiliriz. Ayrıca, tüm bildirilmeyen yayılmış etkinlikler çağrıldığında bir tür hatası verecektir:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // çalışma zamanı doğrulaması yap
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Tür hatası!
      })

      this.$emit('non-declared-event') // Tür hatası!
    }
  }
})
```

## Hesaplanan Özellikleri Tiplendirme {#typing-computed-properties}

Bir hesaplanan özellik, dönüş değerine dayanarak türünü çıkarır:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Merhaba!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // tür: string
  }
})
```

Bazı durumlarda, bir hesaplanan özelliğin türünü açıkça belirtmeniz, uygulamasının doğru olduğundan emin olmak için yararlı olabilir:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Merhaba!'
    }
  },
  computed: {
    // dönen türü açıkça belirt
    greeting(): string {
      return this.message + '!'
    },

    // yazılabilir bir hesaplanan özelliği anotlayarak
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

Açık anotlar, TypeScript'in döngü çıkarsama döngüleri nedeniyle bir hesaplanan özelliğin türünü çıkaramadığı bazı uç durumlarda da gerekli olabilir.

## Olay İşleyicilerini Tiplendirme {#typing-event-handlers}

Yerel DOM olaylarıyla çalışırken, işleyiciye geçtiğimiz argümanı doğru bir şekilde tiplendirmek faydalı olabilir. Bu örneğe bakalım:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event`, 'any' türüne sahip
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Tip anotasyonu olmadan, `event` argümanı örtülü olarak 'any' türüne sahip olacaktır. Bu ayrıca, `tsconfig.json`'da `"strict": true` veya `"noImplicitAny": true` varsa bir TS hatasına da yol açar. Bu nedenle, olay işleyicilerinin argümanını açıkça anotlamak önerilir. Ayrıca, `event`'in özelliklerine erişirken tür doğrulamaları kullanmanız da gerekebilir:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Global Özellikleri Genişletme {#augmenting-global-properties}

Bazı eklentiler, `app.config.globalProperties` aracılığıyla tüm bileşen örneklerine global olarak erişilebilen özellikler kurar. Örneğin, veri alma için `this.$http` veya uluslararasılaştırma için `this.$translate` kurabiliriz. TypeScript ile çalışabilmesi için, Vue, [TypeScript modül genişletmesi](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) yoluyla genişletilmesi amaçlanan bir `ComponentCustomProperties` arayüzü sunar:

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

Ayrıca bakınız:

- [Bileşen tür uzantıları için TypeScript birim testleri](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

### Tür Genişletme Yerleşimi {#type-augmentation-placement}

Bu tür genişletmeyi bir `.ts` dosyasında veya proje genelinde `*.d.ts` dosyasında koyabiliriz. Her iki durumda da, `tsconfig.json`'a dahil edildiğinden emin olun. Kütüphane / eklenti yazarları için, bu dosya `package.json`'daki `types` özelliğinde belirtilmelidir.

Modül genişletmesinden faydalanmak için, genişletmenin bir [TypeScript modülünde](https://www.typescriptlang.org/docs/handbook/modules.html) yerleştirildiğinden emin olmalısınız. Yani, en az bir üst düzey `import` veya `export` içermelidir; bu, sadece `export {}` olsa bile. Genişletme bir modülün dışında yerleştirilirse, orijinal türleri geçersiz kılacak, genişletecek değildir!

```ts
// Çalışmıyor, orijinal türleri geçersiz kılıyor.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Doğru bir şekilde çalışır
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Özel Seçenekleri Genişletme {#augmenting-custom-options}

Bazı eklentiler, örneğin `vue-router`, `beforeRouteEnter` gibi özel bileşen seçeneklerini destekler:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Uygun tür genişletmesi olmadan, bu hook'un argümanları örtülü olarak 'any' türüne sahip olacaktır. Bu özel seçenekleri desteklemek için `ComponentCustomOptions` arayüzünü genişletebiliriz:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Artık `beforeRouteEnter` seçeneği uygun şekilde tiplenmiş olacaktır. Unutmayın ki bu, bir örnektir - `vue-router` gibi iyi tiplenmiş kütüphaneler, otomatik olarak bu genişletmeleri kendi tür tanımlarında gerçekleştirmelidir.

Ayrıca bakınız:

- [Bileşen tür uzantıları için TypeScript birim testleri](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)