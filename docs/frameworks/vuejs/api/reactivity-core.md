---
title: Reaktivite API Temel
seoTitle: Reaktivite API Temel Kılavuzu
sidebar_position: 4
description: Reaktivite APIsinin temel kavramlarını, işlevlerini ve kullanımlarını içeren bir rehberdir. Bu kılavuz, reaktif programlamaya giriş yapmak isteyenler için faydalı olacaktır.
tags: 
  - reaktivite
  - Vue
  - Composition API
  - JavaScript
keywords: 
  - reaktivite
  - Vue
  - Composition API
  - JavaScript
---
## Reaktivite API: Temel {#reactivity-api-core}

:::info Diğerleri
Reaktivite API'lerini daha iyi anlamak için, aşağıdaki bölümleri kılavuzda okumanız önerilir:

- `Reaktivite Temelleri` (API tercihi Composition API olarak ayarlanmış)
- `Reaktivite Derinliği`
:::

## ref() {#ref}

Bir iç değeri alır ve iç değere işaret eden tek bir `.value` özelliğine sahip reaktif ve değiştirilebilir bir referans (ref) nesnesi döndürür.

- **Tip**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Ayrıntılar**

  Ref nesnesi değiştirilebilir - yani `.value`'a yeni değerler atayabilirsiniz. Ayrıca reaktiftir - yani `.value`'a yapılan okuma işlemleri izlenir ve yazma işlemleri ilgili etkileri tetikler.

  Eğer bir nesne ref'in değeri olarak atanırsa, nesne `reactive()` ile derinlemesine reaktif hale getirilir. Bu ayrıca, nesne içindeki iç içe geçmiş referansların da derinlemesine açılacağı anlamına gelir.

  Derin dönüşümden kaçınmak için `shallowRef()` kullanın.

- **Örnek**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **Diğerleri**
  - `Kılavuz - Reaktivite Temelleri `ref()` ile`
  - `Kılavuz - `ref()` Tiplendirme` 

## computed() {#computed}

Bir [getter fonksiyonu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) alır ve getter'dan dönen değeri için readonly reaktif `ref` nesnesi döndürür. Ayrıca yazılabilir bir ref nesnesi oluşturmak için `get` ve `set` fonksiyonları içeren bir nesne de alabilir.

- **Tip**

  ```ts
  // yalnızca okunabilir
  function computed<T>(
    getter: (oldValue: T | undefined) => T,
    // aşağıdaki "Computed Debugging" bağlantısına bakın
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // yazılabilir
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Örnek**

  readonly computed referansı oluşturma:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // hata
  ```

  yazılabilir computed referansı oluşturma:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Hata ayıklama:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Diğerleri**
  - `Kılavuz - Hesaplanan Özellikler`
  - `Kılavuz - Hesaplanan Hata Ayıklama`
  - `Kılavuz - `computed()` Tiplendirme` 
  - `Kılavuz - Performans - Hesaplanan Stabilite`

## reactive() {#reactive}

Nesnenin reaktif bir proxy'sini döndürür.

- **Tip**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Ayrıntılar**

  Reaktif dönüşüm "derindir": tüm iç içe geçmiş özellikleri etkiler. Bir reaktif nesne ayrıca `refs` olan tüm özellikleri derinlemesine açar ve reaktivitelerini korur.

  Ref erişimi bir reaktif dizi veya `Map` gibi yerel bir koleksiyon türünün bir elemanı olarak yapıldığında, ref açma işlemi gerçekleştirilmez.

  Derin dönüşümü önlemek ve yalnızca kök düzeyde reaktiviteyi korumak için `shallowReactive()` kullanın.

  Döndürülen nesne ve iç içe nesneleri [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) ile sarılır ve **orijinal nesnelerle** eşit değildir. Reaktif proxy ile çalışmak ve orijinal nesneye bağlı kalmamak önerilir.

- **Örnek**

  Reaktif bir nesne oluşturma:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Ref açma:

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref açılacak
  console.log(obj.count === count.value) // true

  // `obj.count` güncellenecek
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // `count` ref'ini de güncelleyecek
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  Ref'ler, dizi veya koleksiyon elemanları olarak erişildiğinde **açılmaz**:

  ```js
  const books = reactive([ref('Vue 3 Kılavuzu')])
  // burada .value gerekli
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // burada .value gerekli
  console.log(map.get('count').value)
  ```

  Bir `ref` `reactive` özelliğine atandığında, o ref de otomatik olarak açılacaktır:

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **Diğerleri**
  - `Kılavuz - Reaktivite Temelleri`
  - `Kılavuz - `reactive()` Tiplendirme` 

## readonly() {#readonly}

Bir nesne (reaktif veya düz) ya da bir `ref` alır ve orijinaline readonly proxy döndürür.

- **Tip**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Ayrıntılar**

  Readonly proxy derindir: erişilen herhangi bir iç içe özelliği de readonly olacak şekilde. Ayrıca, `reactive()` ile aynı ref açma davranışına sahiptir, ancak açılan değerler de readonly olacaktır.

  Derin dönüşümden kaçınmak için `shallowReadonly()` kullanın.

- **Örnek**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // reaktivite takibi için çalışır
    console.log(copy.count)
  })

  // orijinalin değiştirilmesi, kopyaya bağlı izleyicileri tetikler
  original.count++

  // kopyanın değiştirilmesi hata verecek ve uyarı oluşturacak
  copy.count++ // uyarı!
  ```

## watchEffect() {#watcheffect}

Bağımlılıklarını reaktif olarak izlerken bir fonksiyonu hemen çalıştırır ve bağımlılıklar değiştiğinde yeniden çalıştırır.

- **Tip**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // varsayılan: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // çağrılabilir, `stop` ile aynı
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Ayrıntılar**

  İlk argüman çalıştırılacak efekt fonksiyonudur. Etki fonksiyonu, bir temizlik geri çağrısı kaydı oluşturmak için kullanılabilecek bir fonksiyonu alır. Temizlik geri çağrısı, efekt bir sonraki kez yeniden çalıştırılmadan hemen önce çağrılır ve geçersiz kılınan yan etkileri temizlemek için kullanılabilir, örneğin, bekleyen bir asenkron isteği (aşağıdaki örneğe bakın).

  İkinci argüman, efektin temizleme zamanlamasını ayarlamak veya etkisinin bağımlılıklarını hata ayıklamak için kullanılabilecek isteğe bağlı bir seçenek nesnesidir.

  Varsayılan olarak, izleyiciler bileşen rendere edilmeden hemen önce çalışacaktır. `flush: 'post'` ayarlamak, izleyiciyi bileşen rendering işleminden sonra erteleyerek çalıştırır. Daha fazla bilgi için `Geri Çağırım Temizleme Zamanlaması` bağlantısına bakın. Nadir durumlarda, bir reaktif bağımlılık değiştiğinde hemen bir izleyiciyi tetiklemek gerekebilir, örneğin, bir önbelleği geçersiz kılmak için. Bu `flush: 'sync'` kullanılarak gerçekleştirilebilir. Ancak, bu ayarın dikkatlice kullanılması gerekmektedir; zira birden fazla özelliğin aynı anda güncellenmesi durumunda, performans ve veri tutarlılığı sorunlarına yol açabilir.

  Dönüş değeri, efektin bir daha çalıştırılmaması için çağrılabilir bir işlevdir.

- **Örnek**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> 0'ı günlüğe kaydeder

  count.value++
  // -> 1'i günlüğe kaydeder
  ```

  İzleyiciyi durdurma:

  ```js
  const stop = watchEffect(() => {})

  // izleyici artık gerekli değilse:
  stop()
  ```

  İzleyiciyi duraklatma / yeniden başlatma: 

  ```js
  const { stop, pause, resume } = watchEffect(() => {})

  // izleyiciyi geçici olarak duraklat
  pause()

  // daha sonra yeniden başlat
  resume()

  // durdur
  stop()
  ```

  Yan etki temizleme:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel`, `id` değişirse çağrılacak, tamamlanmamışsa
    // önceki isteği iptal eder
    onCleanup(cancel)
    data.value = await response
  })
  ```

  3.5+ ile yan etki temizleme:

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  Seçenekler:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Diğerleri**
  - `Kılavuz - İzleyiciler`
  - `Kılavuz - İzleyici Hata Ayıklama`

## watchPostEffect() {#watchposteffect}

`flush: 'post'` seçeneği ile `watchEffect()` kısayolu.

## watchSyncEffect() {#watchsynceffect}

`flush: 'sync'` seçeneği ile `watchEffect()` kısayolu.

## watch() {#watch}

Bir veya daha fazla reaktif veri kaynağını izler ve kaynaklar değiştiğinde bir geri çağırma fonksiyonu çalıştırır.

- **Tip**

  ```ts
  // tek kaynak izleme
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // birden fazla kaynak izleme
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | (T extends object ? T : never) // reaktif nesne

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // varsayılan: false
    deep?: boolean | number // varsayılan: false
    flush?: 'pre' | 'post' | 'sync' // varsayılan: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // varsayılan: false (3.4+)
  }

  interface WatchHandle {
    (): void // çağrılabilir, `stop` ile aynı
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

  > Tipler okunabilirlik için basitleştirilmiştir.

- **Ayrıntılar**

  `watch()` varsayılan olarak isteksizdir - yani, geri çağırma yalnızca izlenen kaynak değiştiğinde çağrılır.

  İlk argüman, izleyicinin **kaynağı**dır. Kaynak şunlardan biri olabilir:

  - Bir değer döndüren bir getter fonksiyonu
  - Bir ref
  - Bir reaktif nesne
  - ...veya yukarıdakilerin bir dizisi.

  İkinci argüman, kaynak değiştiğinde çağrılacak geri çağırmadır. Geri çağırma üç argüman alır: yeni değeri, eski değeri ve bir yan etki temizleme geri çağrısı kaydedebilmek için bir fonksiyonu. Temizlik geri çağrısı, efekt bir sonraki kez yeniden çalıştırılmadan hemen önce çağrılır ve geçersiz kılınan yan etkileri temizlemek için kullanılabilir, örneğin, bekleyen bir asenkron isteği.

  Birden fazla kaynağı izlerken, geri çağırma, kaynak dizisine karşılık gelen yeni / eski değerleri içeren iki dizi alır.

  Üçüncü isteğe bağlı argüman, aşağıdaki ayarları destekleyen bir seçenek nesnesidir:

  - **`immediate`**: izleyici oluşturulduğunda geri çağırmayı hemen tetikler. İlk çağrıda eski değer `undefined` olacaktır.
  - **`deep`**: bir nesne ise kaynağın derinlemesine geçişi zorlanarak, geri çağırmanın derin mutasyonlarda tetiklenmesini sağlar. 3.5+ sürümünde, bu aynı zamanda maksimum geçiş derinliğini belirten bir sayı olabilir. Daha fazla bilgi için `Derin İzleyiciler` kısmına bakın.
  - **`flush`**: geri çağırmanın temizleme zamanlamasını ayarlar. Daha fazla bilgi için `Geri Çağırım Temizleme Zamanlaması` ve `watchEffect()` kısmına bakın.
  - **`onTrack / onTrigger`**: izleyicinin bağımlılıklarını hata ayıklamak için kullanılır. Daha fazla bilgi için `İzleyici Hata Ayıklama` kısmına bakın.
  - **`once`**: (3.4+) geri çağırmayı yalnızca bir kez çalıştırır. Geri çağırmanın ilk çalıştırılmasından sonra izleyici otomatik olarak durdurulur.

  `watchEffect()` ile karşılaştırıldığında, `watch()` bize şunları yapma imkanı tanır:

  - Yan etkileri isteksiz olarak gerçekleştirmek;
  - İzleyiciyi yeniden çalıştırmak için hangi durumların tetiklendiği konusunda daha spesifik olmak;
  - İzlenen durumun hem önceki hem de mevcut değerine erişmek.

- **Örnek**

  Bir getter'ı izleme:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Bir ref'i izleme:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  Birden fazla kaynağı izlerken, geri çağırma, kaynak dizisi ile eşleşen yeni / eski değerleri içeren diziler alır:

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  Bir getter kaynağını kullanırken, izleyici yalnızca getter'ın döndürdüğü değer değiştiğinde tetiklenir. Geri çağırmanın derin mutasyonlarda tetiklenmesini istiyorsanız, izleyiciyi derin modda zorlamanız gerekir `{ deep: true }`. Dikkat edin, derin modda, yeni değer ve eski değer aynı nesne olacaktır eğer geri çağırma bir derin mutasyon tarafından tetiklenirse:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  Doğrudan bir reaktif nesneyi izlediğinizde, izleyici otomatik olarak derin moddadır:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* state'deki derin mutasyonlarda tetiklenir */
  })
  ```

  `watch()` aynı temizleme zamanlama ve hata ayıklama seçeneklerini `watchEffect()` ile paylaşır:

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  İzleyiciyi durdurma:

  ```js
  const stop = watch(source, callback)

  // izleyici artık gerekliyse:
  stop()
  ```

  İzleyiciyi duraklatma / yeniden başlatma: 

  ```js
  const { stop, pause, resume } = watch(() => {})

  // izleyiciyi geçici olarak duraklat
  pause()

  // daha sonra yeniden başlat
  resume()

  // durdur
  stop()
  ```

  Yan etki temizleme:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel`, `id` değişirse çağrılacak, tamamlanmamışsa
    // önceki isteği iptal eder
    onCleanup(cancel)
    data.value = await response
  })
  ```

  3.5+ ile yan etki temizleme:

  ```js
  import { onWatcherCleanup } from 'vue'

  watch(id, async (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

- **Diğerleri**

  - `Kılavuz - İzleyiciler`
  - `Kılavuz - İzleyici Hata Ayıklama`

## onWatcherCleanup()  {#onwatchercleanup}

Geçerli izleyici yeniden çalıştırılmadan önce yürütülecek bir temizleme fonksiyonunu kaydedin. Sadece bir `watchEffect` etkisi veya `watch` geri çağırma fonksiyonunun senkron yürütülmesi sırasında çağrılabilir (yani, bir async fonksiyonda `await` ifadesinden sonra çağrılamaz).

- **Tip**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **Örnek**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel`, `id` değişirse çağrılacak, tamamlanmamışsa
    // önceki isteği iptal eder
    onWatcherCleanup(cancel)
  })
  ```