---
title: Bileşen Örneği
seoTitle: Bileşen Örneği - Vue Documentation
sidebar_position: 4
description: Bu sayfa, bileşenin genel özelliklerini ve yöntemlerini belgelemektedir. Özellikle veriler ve özellikler üzerinde durulmuştur.
tags: 
  - component
  - vue
  - options
keywords: 
  - bileşen
  - Vue
  - özellikler
  - reaktif
---
## Bileşen Örneği {#component-instance}

:::info
Bu sayfa, bileşenin genel örneği üzerinde tanımlanan yerleşik özellikler ve yöntemleri belgeliyor, yani `this`.
Bu sayfada listelenen tüm özellikler yalnızca okunurdur (iç içe geçmiş `$data` özellikleri hariç).
:::

## $data {#data}

Bileşen tarafından reaktif hale getirilen `data` seçeneğinden dönen nesne. Bileşen örneği, veriler nesnesindeki özelliklere erişimi proxy'ler.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

Bileşenin mevcut, çözülmüş özelliklerini temsil eden bir nesne.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Ayrıntılar**

  Sadece `props` seçeneği aracılığıyla bildirilen özellikler dahil edilecektir. Bileşen örneği, özelliklere erişimi proxy'ler.

## $el {#el}

Bileşen örneğinin yönettiği kök DOM düğümü.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **Ayrıntılar**

  `$el` değeri, bileşen `monte edildiğinde` `undefined` olacaktır.

  - Tek kök öğeye sahip bileşenler için, `$el` o öğeye işaret edecektir.
  - Metin kökü olan bileşenler için, `$el` metin düğümüne işaret edecektir.
  - Birden fazla kök düğümü olan bileşenler için, `$el`, Vue'un bileşenin konumunu DOM'da takip etmek için kullandığı yer tutucu DOM düğümü olacaktır (bir metin düğümü veya SSR hidratasyon modunda bir yorum düğümü).

  :::tip
  Tutarlılık için, `$el`'e güvenmek yerine doğrudan öğelere erişim için `şablon referansları` kullanılması önerilir.
  :::

## $options {#options}

Mevcut bileşen örneğini oluşturmak için kullanılan çözümlenmiş bileşen seçenekleri.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Ayrıntılar**

  `$options` nesnesi, mevcut bileşen için çözümlenmiş seçenekleri açığa çıkarır ve bu olası kaynakların birleşim sonucudur:

  - Küresel mixinler
  - Bileşen `extends` temeli
  - Bileşen mixinleri

  Özelleştirilmiş bileşen seçeneklerini desteklemek için genellikle kullanılır:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **Ayrıca bakınız** `app.config.optionMergeStrategies`

## $parent {#parent}

Mevcut örneğin bir ana örneği varsa, ana örneği. Kök örneği için `null` olacaktır.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

Mevcut bileşen ağacının kök bileşen örneği. Eğer mevcut örneğin ebeveynleri yoksa, bu değer kendisi olacaktır.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

Ana bileşenden geçen `slotları` temsil eden bir nesne.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Ayrıntılar**

  Genellikle `render işlevleri` yazarken manuel olarak kullanılır, ancak bir slotun mevcut olup olmadığını tespit etmek için de kullanılabilir.

  Her slot, adının karşılık geldiği anahtar altında bir dizi vnodes döndüren bir işlev olarak `this.$slots` üzerinde açığa çıkar. Varsayılan slot, `this.$slots.default` olarak açığa çıkar.

  Eğer bir slot `kapsamlı slotsa`, slot işlevlerine geçirilen argümanlar slotun slot özellikleri olarak mevcut olacaktır.

- **Ayrıca bakınız** `Render Fonksiyonları - Slotları Render Etme`

## $refs {#refs}

`Şablon referansları` aracılığıyla kaydedilmiş DOM öğeleri ve bileşen örneklerinin bir nesnesi.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **Ayrıca bakınız**

  - `Şablon referansları`
  - `Özel Özellikler - ref`

## $attrs {#attrs}

Bileşenin geçiş alanı özelliklerini içeren bir nesne.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Ayrıntılar**

  `Geçiş Alanları`, ana bileşen tarafından geçirilen ancak çocuk tarafından bir özellik veya yayımlanan bir etkinlik olarak bildirilmemiş olan özellikler ve olay işleyicileridir.

  Varsayılan olarak, `$attrs` içerisindeki her şey yalnızca tek bir kök öğe varsa bileşenin kök elemanında otomatik olarak miras alınacaktır. Bu davranış, bileşenin birden fazla kök düğümü olduğunda devre dışı bırakılır ve `inheritAttrs` seçeneği ile açıkça devre dışı bırakılabilir.

- **Ayrıca bakınız**

  - `Geçiş Alanları`

## $watch() {#watch}

Gözlemciler oluşturmak için kurallı API.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // varsayılan: false
    deep?: boolean // varsayılan: false
    flush?: 'pre' | 'post' | 'sync' // varsayılan: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Ayrıntılar**

  İlk argüman, gözlem kaynağıdır. Bu, bir bileşen özellik adı dizesi, basit bir noktayla ayrılmış yol dizesi veya bir [getter işlevi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) olabilir.

  İkinci argüman, geri çağırma işlevidir. Geri çağırma, izlenen kaynağın yeni değerini ve eski değerini alır.

  - **`immediate`**: gözlemci oluşturulduğunda geri çağırmayı hemen tetikleyin. İlk çağrıda eski değer `undefined` olacaktır.
  - **`deep`**: kaynak bir nesne olduğunda derin gezinti yapılmasını zorlayın, böylece geri çağırma derin değişimlerde tetiklenir. `Derin Gözlemciler` bölümüne bakın.
  - **`flush`**: geri çağırmanın akış zamanlamasını ayarlayın. `Geri Çağırma Akış Zamanlaması` ve `watchEffect()` bölümüne bakın.
  - **`onTrack / onTrigger`**: gözlemcinin bağımlılıklarını debug edin. `Gözlemci Hatası Ayıklama` bölümüne bakın.

- **Örnek**

  Bir özellik adını izleyin:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Noktayla ayrılmış bir yolu izleyin:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Daha karmaşık ifadeler için getter kullanın:

  ```js
  this.$watch(
    // her seferinde `this.a + this.b` ifadesi
    // farklı bir sonuç verirse, işleyici çağrılacaktır.
    // Sanki hesaplanan bir özelliği izliyormuşuz
    // hesaplanan özelliği tanımlamadan.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Gözlemciyi durdurmak:

  ```js
  const unwatch = this.$watch('a', cb)

  // daha sonra...
  unwatch()
  ```

- **Ayrıca bakınız**
  - `Seçenekler - `watch`
  - `Kılavuz - Gözlemciler`

## $emit() {#emit}

Mevcut örnek üzerinde özel bir olayı tetikler. Ek argümanlar, dinleyicinin geri çağırma işlevine geçecektir.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Örnek**

  ```js
  export default {
    created() {
      // sadece olay
      this.$emit('foo')
      // ek argümanlarla
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **Ayrıca bakınız**

  - `Bileşen - Olaylar`
  - `emits` seçeneği`

## $forceUpdate() {#forceupdate}

Bileşen örneğini yeniden oluşturmayı zorlar.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Ayrıntılar**

  Vue'un tamamen otomatik reaktivite sistemi göz önüne alındığında, bunun nadiren gerektiği durumlar vardır. Tek ihtiyaç duyabileceğiniz durumlar, gelişmiş reaktivite API'leri ile açıkça oluşturulmuş reaktif olmayan bileşen durumunuz olduğunda olabilir.

## $nextTick() {#nexttick}

Küresel `nextTick()` fonksiyonunun örnek ile bağlı versiyonu.

- **Tür**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Ayrıntılar**

  `nextTick()` fonksiyonunun küresel versiyonundan tek fark, `this.$nextTick()`'e geçirilen geri çağırmanın `this` bağlamının mevcut bileşen örneğine bağlı olmasıdır.

- **Ayrıca bakınız** `nextTick()`