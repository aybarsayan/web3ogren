---
title: Tepkisel API İleri Düzey
seoTitle: Gelişmiş Tepkisel API Kullanımı
sidebar_position: 11
description: Bu belge, Vue.js içinde kullanılabilen ileri düzey tepkisel API fonksiyonlarını açıklar. shallowRef, triggerRef, customRef gibi kavramları detaylandırır.
tags: 
  - Vue.js
  - Tepkisel API
  - shallowRef
  - triggerRef
  - customRef
keywords: 
  - Vue
  - reactivity
  - shallowRef
  - triggerRef
  - customRef
---
## shallowRef() {#shallowref}

`ref()` fonksiyonunun sığ versiyonu.

- **Tip**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Açıklama**

  `ref()`'den farklı olarak, bir shallow ref'in iç değeri olduğu gibi saklanır ve gösterilir, derinlemesine reaktif hale getirilmeyecektir. Sadece `.value` erişimi reaktiftir.

  `shallowRef()` genellikle büyük veri yapılarının performans optimizasyonları veya harici durum yönetim sistemleriyle entegrasyon için kullanılır.

- **Örnek**

  ```js
  const state = shallowRef({ count: 1 })

  // değişimi tetiklemiyor
  state.value.count = 2

  // değişimi tetikliyor
  state.value = { count: 2 }
  ```

- **Ayrıca bakınız**
  - `Rehber - Büyük Değiştirilemez Yapılar için Reaktivite Yükünü Azaltma`
  - `Rehber - Harici Ortam Sistemleriyle Entegrasyon`

## triggerRef() {#triggerref}

Bir `shallow ref` üzerinde etkileri tetikler. Genellikle bir shallow ref'in iç değerinde derin mutasyonlar yapıldıktan sonra kullanılır.

- **Tip**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Örnek**

  ```js
  const shallow = shallowRef({
    greet: 'Merhaba, dünya'
  })

  // İlk geçişte "Merhaba, dünya" bir kez loglanır
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Bu etkiyi tetiklemez çünkü ref sığdır
  shallow.value.greet = 'Merhaba, evren'

  // "Merhaba, evren" loglanır
  triggerRef(shallow)
  ```

## customRef() {#customref}

Hassas kontrol ile bağımlılık takibi ve güncellemeleri tetiklemeyi sağlayan özelleştirilmiş bir ref oluşturur.

- **Tip**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Açıklama**

  `customRef()` bir fabrika fonksiyonu bekler, bu fonksiyon `track` ve `trigger` fonksiyonlarını argüman olarak alır ve `get` ve `set` metotlarıyla bir obje döndürmelidir.

  Genel olarak, `track()` `get()` içinde çağrılır ve `trigger()` `set()` içinde çağrılır. Ancak, ne zaman çağrıldıkları veya hiç çağrılmayacakları üzerinde tam kontrole sahipsinizdir.

- **Örnek**

  En son set çağrısından sonra belirli bir zaman aşımından sonra yalnızca değerleri güncelleyen bir debounced ref oluşturma:

  ```js
  import { customRef } from 'vue'

  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Bileşendeki kullanım:

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('merhaba')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Oyun Alanında Deneyin](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

  :::warning Dikkatli Kullanım
  customRef kullanırken, özellikle getter her çalıştığında yeni nesne veri türleri oluşturmaktan kaçınmalıyız. Bu, bir üst ve alt bileşen arasındaki ilişkiyi etkiler ve böyle bir customRef'in bir prop olarak geçildiği durumlarda sorun yaratabilir.

  Üst bileşenin render fonksiyonu, farklı bir reaktif durumdaki değişikliklerle tetiklenebilir. Yeniden render sırasında, customRef'imiz yeniden değerlendiriliyor, bir alt bileşene prop olarak yeni bir nesne veri türü döndürülüyor. Bu prop, alt bileşendeki son değeriyle karşılaştırılıyor ve farklı oldukları için, alt bileşendeki customRef'in reaktif bağımlılıkları tetikleniyor. Bu arada, üst bileşendeki reaktif bağımlılıklar çalışmıyor, çünkü customRef'in setter'ı çağrılmadı ve bağımlılıkları tetiklenmedi.
  :::

## shallowReactive() {#shallowreactive}

`reactive()` fonksiyonunun sığ versiyonu.

- **Tip**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Açıklama**

  `reactive()`'den farklı olarak, derin bir dönüşüm yoktur: yalnızca kök düzeyindeki özellikler sığ reaktif bir nesne için reaktiftir. Özellik değerleri olduğu gibi saklanır ve gösterilir - bu ayrıca ref değerlerine sahip özelliklerin **otomatik olarak açılmayacağı** anlamına gelir.

  :::warning Dikkatli Kullanım
  Sığ veri yapıları yalnızca bir bileşenin kök düzeyinde durum için kullanılmalıdır. Bunu derin reaktif bir nesne içine yerleştirmekten kaçının, çünkü bu, anlaşılması ve hata ayıklaması zor olan tutarsız reaktivite davranışına sahip bir ağaç oluşturabilir.
  :::

- **Örnek**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // durumun kendi özelliklerini değiştirmek reaktiftir
  state.foo++

  // ...ancak iç içe nesneleri dönüştürmez
  isReactive(state.nested) // false

  // REAKTİF DEĞİL
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

`readonly()` fonksiyonunun sığ versiyonu.

- **Tip**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Açıklama**

  `readonly()`'den farklı olarak, derin bir dönüşüm yoktur: yalnızca kök düzeyindeki özellikler salt okunur hale gelir. Özellik değerleri olduğu gibi saklanır ve gösterilir - bu ayrıca ref değerlerine sahip özelliklerin **otomatik olarak açılmayacağı** anlamına gelir.

  :::warning Dikkatli Kullanım
  Sığ veri yapıları yalnızca bir bileşenin kök düzeyinde durum için kullanılmalıdır. Bunu derin reaktif bir nesne içine yerleştirmekten kaçının, çünkü bu, anlaşılması ve hata ayıklaması zor olan tutarsız reaktivite davranışına sahip bir ağaç oluşturabilir.
  :::

- **Örnek**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // durumun kendi özelliklerini değiştirmek başarısız olur
  state.foo++

  // ...ancak iç içe nesneler üzerinde çalışır
  isReadonly(state.nested) // false

  // çalışır
  state.nested.bar++
  ```

## toRaw() {#toraw}

Vue tarafından oluşturulan bir proxy'nin ham, orijinal nesnesini döndürür.

- **Tip**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Açıklama**

  `toRaw()` `reactive()`, `readonly()`, `shallowReactive()` veya `shallowReadonly()` tarafından oluşturulan proxy'lerden orijinal nesneyi döndürebilir.

  Bu, proxy erişim / takip yükü almadan geçici olarak okuma yapmak veya değişiklik tetiklememek için kullanılabilecek bir kaçış yoludur. Orijinal nesneye kalıcı bir referans tutulması **tavsiye edilmez**. Dikkatli kullanın.

- **Örnek**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

Bir nesneyi belirler, böylece hiçbir zaman bir proxy'ye dönüştürülmez. Nesneyi kendisini döndürür.

- **Tip**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Örnek**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // ayrıca diğer reaktif nesnelerin içinde iç içe olduğunda çalışır
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Dikkatli Kullanım
  `markRaw()` ve `shallowReactive()` gibi sığ API'lar, varsayılan derin reaktif / salt okunur dönüşümden seçici olarak feragat etmenizi sağlar ve durumu grafiğinizde ham, proxy'siz nesneleri yerleştirmenizi sağlar. Çeşitli nedenlerle kullanılabilirler:

  - Bazı değerlerin reaktif hale getirilmemesi gerekir, örneğin karmaşık bir 3. parti sınıf örneği veya bir Vue bileşen nesnesi.

  - Proxy dönüşümünü atlamak, sabit veri kaynaklarıyla büyük listeleri işlerken performans iyileştirmeleri sağlayabilir.

  Bunlar gelişmiş olarak kabul edilir çünkü ham feragat yalnızca kök düzeyinde, bu nedenle bir iç içe geçmiş, işaretlenmemiş ham nesneyi reaktif bir nesneye yerleştirirseniz ve ardından tekrar erişirseniz, proxy sürümünü geri alırsınız. Bu, **kimlik tehlikeleri** oluşturabilir - yani, nesne kimliğine dayanan bir işlem yaparken ama hem ham hem de proxy sürümünü kullanmak:
  
  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // `foo` ham olarak işaretlenmiş olsa da, foo.nested değildir.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Kimlik tehlikeleri genel olarak nadirdir. Ancak, bu API'leri kullanırken kimlik tehlikelerinden güvenli bir şekilde kaçınmak için reaktivite sisteminin nasıl çalıştığına dair sağlam bir anlayışa sahip olmanız gerekir.
  :::

## effectScope() {#effectscope}

Reaktif etkileri (yani, hesaplanmış ve izleyiciler) toplamak için bir etki kapsamı nesnesi oluşturur, böylece bu etkiler birlikte atılabilir. Bu API'nin detaylı kullanım durumları için ilgili [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)'ye başvurun.

- **Tip**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // kapsam aktif değilse undefined
    stop(): void
  }
  ```

- **Örnek**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Sayı: ', doubled.value))
  })

  // kapsam içindeki tüm etkileri kaldırmak için
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

Varsa, mevcut aktif `etki kapsamı`'nı döndürür.

- **Tip**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

Mevcut aktif `etki kapsamı` üzerine bir atılma geri çağırma kaydı oluşturur. Bu geri çağırma, ilişkili etki kapsamı durdurulduğunda çağrılacaktır.

Bu yöntem, her Vue bileşeninin `setup()` fonksiyonu da bir etki kapsamı içinde çağrıldığı için tekrar kullanılabilir kompozisyon fonksiyonlarında `onUnmounted` yerine bileşen bağlantılı olmayan bir alternatif olarak kullanılabilir.

Bu fonksiyon aktif bir etki kapsamı olmadan çağrılırsa bir uyarı verilecektir. 3.5+ sürümünde bu uyarı, ikinci argüman olarak `true` verilerek bastırılabilir.

- **Tip**

  ```ts
  function onScopeDispose(fn: () => void, failSilently?: boolean): void
  ```