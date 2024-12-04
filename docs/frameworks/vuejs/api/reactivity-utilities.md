---
title: Reactivity API Utilities
seoTitle: Utilities of the Reactivity API in Vue
sidebar_position: 4
description: This section details various utilities available in the Reactivity API of Vue, including functions like isRef, unref, and toRef. Each function is described with its type signatures, examples, and use cases to enhance understanding.
tags: 
  - Reactivity
  - Vue
  - Utilities
  - JavaScript
keywords: 
  - reactivity
  - Vue
  - JavaScript
  - isRef
  - unref
  - toRef
---
## isRef() {#isref}

Bir değerin bir ref nesnesi olup olmadığını kontrol eder.

- **Tür**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Dönüş türü bir [tip predikatı](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) olduğunu unutmayın, bu da `isRef`'in bir tür koruyucu olarak kullanılabileceği anlamına gelir:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // foo'nun türü Ref<unknown> olarak daraltılmıştır
    foo.value
  }
  ```

## unref() {#unref}

Argüman bir ref ise iç değeri döndürür, aksi takdirde argümanı kendisini döndürür. Bu, `val = isRef(val) ? val.value : val` ifadesinin bir şekerleme işlemidir.

- **Tür**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Örnek**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped'in türü artık guaranteed number
  }
  ```

## toRef() {#toref}

Değerleri / ref'leri / getter'ları ref'lere normalize etmek için kullanılabilir (3.3+).

Ayrıca, bir kaynak reaktif nesnede bir özellik için bir ref oluşturmak için de kullanılabilir. Oluşturulan ref, kaynak özelliği ile senkronizedir: kaynak özelliğini değiştirmek, ref'i günceller ve bunun tersine.

- **Tür**

  ```ts
  // normalizasyon imzası (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // nesne özellik imzası
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Örnek**

  Normalizasyon imzası (3.3+):

  ```js
  // mevcut ref'leri olduğu gibi döndürür
  toRef(existingRef)

  // .value erişiminde getter'ı çağıran readonly bir ref oluşturur
  toRef(() => props.foo)

  // fonksiyon olmayan değerlerden normal ref'ler oluşturur
  // ref(1) ile eşdeğerdir
  toRef(1)
  ```

  Nesne özellik imzası:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // orijinal özellik ile senkronize olan iki yönlü bir ref
  const fooRef = toRef(state, 'foo')

  // ref'in değiştirilmesi orijinali günceller
  fooRef.value++
  console.log(state.foo) // 2

  // orijinalin değiştirilmesi ref'i de günceller
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Bu durum, aşağıdakilerden farklıdır:

  ```js
  const fooRef = ref(state.foo)
  ```

  Yukarıdaki ref, `state.foo` ile **senkronize değildir**, çünkü `ref()` bir düz sayı değeri alıyor.

  `toRef()`, bir özelliğin ref'ini bir bileşen işlevine geçmek istediğinizde faydalıdır:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // `props.foo`'yu bir ref'e çevirir, ardından bir
  // bileşene geçirir
  useSomeFeature(toRef(props, 'foo'))

  // getter sentaksı - 3.3+ için tavsiye edilir
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  `toRef` bileşen özellikleri ile kullanıldığında, özellikleri değiştirme ile ilgili olağan kısıtlamalar hala geçerlidir. Ref'e yeni bir değer atama girişimi, özelliği doğrudan değiştirmeye eşdeğerdir ve bu da izin verilmez. Bu durumda, `get` ve `set` ile `computed` kullanmayı düşünmek isteyebilirsiniz. Bileşenlerle `v-model'in nasıl kullanılacağı` hakkında daha fazla bilgi için kılavuza bakın.

  Nesne özellik imzası kullanıldığında, `toRef()` mevcut olmasa bile kullanılabilir bir ref dönecektir. Bu, olası özelliklerle çalışmayı mümkün kılar, ki bunlar `toRefs` tarafından alınmaz.

## toValue() {#tovalue}

- Sadece 3.3+ sürümünde desteklenir

Değerleri / ref'leri / getter'ları değerlere normalize eder. Bu, `unref()` ile benzerdir, ancak getter'ları da normalize eder. Eğer argüman bir getter ise, çağrılır ve dönüş değeri döndürülür.

Bu, ya bir değer, bir ref ya da bir getter olabilen bir argümanı normalize etmek için `Composables` içerisinde kullanılabilir.

- **Tür**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Örnek**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Composables içinde argümanları normalize etme:

  ```js
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // id değişikliklerine tepki ver
    })
  }

  // bu composable, aşağıdakilerden herhangi birini destekler:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Reaktif bir nesneyi, orijinal nesnenin karşılık gelen özelliğine işaret eden her bir özelliği ref olan düz bir nesneye dönüştürür. Her bir ayrı ref, `toRef()` kullanılarak oluşturulur.

- **Tür**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Örnek**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  stateAsRefs'in türü: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // Ref ve orijinal özellik "bağlantılıdır"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs`, bir composable işlevinden reaktif bir nesne döndürdüğünüzde yararlıdır, böylece tüketen bileşen döndürülen nesneyi yapısına göre ayırabilir/dağıtabilir ve reaktivite kaybetmez:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ... state üzerinde çalışan mantık

    // dönerken ref'lere dönüştür
    return toRefs(state)
  }

  // reaktivite kaybetmeden yapılandırılabilir
  const { foo, bar } = useFeatureX()
  ```

  `toRefs`, yalnızca çağrı anında kaynak nesnede sayılabilir özellikler için ref oluşturacaktır. Henüz mevcut olamayabilecek bir özellik için bir ref oluşturmak isterseniz, `toRef` kullanın.

## isProxy() {#isproxy}

Bir nesnenin `reactive()`, `readonly()`, `shallowReactive()` veya `shallowReadonly()` kullanılarak oluşturulup oluşturulmadığını kontrol eder.

- **Tür**

  ```ts
  function isProxy(value: any): boolean
  ```

## isReactive() {#isreactive}

Bir nesnenin `reactive()` veya `shallowReactive()` kullanılarak oluşturulup oluşturulmadığını kontrol eder.

- **Tür**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Geçilen değerin bir readonly nesne olup olmadığını kontrol eder. Bir readonly nesnenin özellikleri değişebilir, ancak bunlar geçilen nesne aracılığıyla doğrudan atanamaz.

`readonly()` ve `shallowReadonly()` ile oluşturulan proxy'ler, bir `set` fonksiyonu olmayan `computed()` ref'i gibi readonly olarak kabul edilir.

- **Tür**

  ```ts
  function isReadonly(value: unknown): boolean
  ```