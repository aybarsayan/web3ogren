---
title: Derinlemesine Tepkisel Programlama
seoTitle: Derinlemesine Tepkisel Programlama - Vue Reaktivite Sistemi
sidebar_position: 1
description: Vuenin tepkisel sisteminin derinlemesine incelendiği bu bölüm, reaktivitenin temellerini ve çalışma yöntemlerini kapsamaktadır. JavaScriptteki reaktif programlama örnekleri ve Vuedaki uygulamaları üzerine detaylı bilgiler sunulmaktadır.
tags: 
  - Vue
  - reaktivite
  - JavaScript
  - yazılım geliştirme
keywords: 
  - Vue
  - reaktif programlama
  - JavaScript
  - yazılım geliştirme
---



## Derinlemesine Tepkisel Programlama {#reactivity-in-depth}

Vue’nin en belirgin özelliklerinden biri, müdahale etmeyen tepkisel sistemidir. Bileşen durumu, tepkisel JavaScript nesnelerinden oluşur. Bu nesneleri değiştirdiğinizde, görünüm güncellenir. Durum yönetimini basit ve sezgisel hale getirir, ancak bazı yaygın tuzaklardan kaçınmak için nasıl çalıştığını anlamak da önemlidir. Bu bölümde, Vue’nun tepkisel sisteminin bazı düşük seviyeli ayrıntılarına gireceğiz.

## Tepkisel Programlama Nedir? {#what-is-reactivity}

Bu terim günümüzde programlamada sıkça geçmektedir, ancak insanlar bunu söylediklerinde neyi kast ediyorlar? Tepkisel programlama, değişikliklere deklaratif bir şekilde yanıt verme yeteneği sunan bir programlama paradigmasıdır. Genelde gösterilen kanonik örnek, harika bir örnek olduğu için bir Excel elektronik tablosudur:



Burada A2 hücresi `= A0 + A1` formülü ile tanımlanmıştır (formülü görmek veya düzenlemek için A2'ye tıklayabilirsiniz), bu yüzden elektronik tablo bize 3 verir. Burada şaşırtıcı bir şey yok. Ancak A0 veya A1'i güncellediğinizde, A2’nin otomatik olarak güncellendiğini fark edeceksiniz.

JavaScript genellikle böyle çalışmaz. Benzer bir şeyi JavaScript'te yazmaya çalışsak:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Hala 3
```

`A0`'ı değiştirdiğimizde, `A2` otomatik olarak değişmez.

JavaScript’te bunu nasıl yaparız? Öncelikle, `A2`'yi güncelleyen kodu tekrar çalıştırmak için bunu bir fonksiyonun içine alalım:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Sonra, birkaç terimi tanımlamalıyız:

- `update()` fonksiyonu bir **yan etki** üretir, kısaca **etki** olarak adlandırılır, çünkü programın durumunu değiştirir.

- `A0` ve `A1` etkilerin **bağımlılıkları** olarak kabul edilir, çünkü etkileri gerçekleştirmek için değerleri kullanılır. Etki, bağımlılıklarına **abone** olarak adlandırılır.

İhtiyacımız olan, `A0` veya `A1` (bağımlılıklar) değiştiğinde `update()` (etki) fonksiyonunu çağırabilen bir sihirli fonksiyondur:

```js
whenDepsChange(update)
```

Bu `whenDepsChange()` fonksiyonunun şu görevleri vardır:

1. Bir değişkenin okuma işlemini izlemek: Örneğin, `A0 + A1` ifadesini değerlendirirken, hem `A0` hem de `A1` okunur.

2. Bir değişken okunduğunda ve mevcut bir etkinin yürütülmekte olduğu durumlarda, o etkinin o değişkene abone olmasını sağlamak. Örneğin, `update()` çağrıldığında `A0` ve `A1` okunduğu için, `update()` artık hem `A0` hem de `A1`'in aboneliği haline gelir.

3. Bir değişken değiştirildiğinde bunu tespit etmek. Örneğin, `A0` yeni bir değer atandığında, tüm abone olan etkileri yeniden çalıştırmak için bilgilendirmek.

## Vue'da Tepkisel Programlama Nasıl Çalışır {#how-reactivity-works-in-vue}

Yerli değişkenlerin okuma ve yazmalarını izleyemeyiz; örnekte olduğu gibi. Bunu yapmak için vanilya JavaScript'te hiçbir mekanizma yoktur. Ancak **nesne özelliklerinin** okuma ve yazma işlemlerini kesintiye uğratabiliriz.

JavaScript'te özellik erişimini kesintiye uğratmanın iki yolu vardır: [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) ve [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Vue 2 yalnızca tarayıcı desteği sınırlamaları nedeniyle getter / setter kullanmıştır. Vue 3’te, tepkisel nesneler için Proxies kullanılır ve refs için getter / setter kullanılır. İşte bunların nasıl çalıştığını gösteren bazı sahte kod:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
Buradaki ve aşağıdaki kod parçacıkları, temeldeki kavramları en basit şekilde açıklamak amacıyla hazırlanmıştır, bu nedenle birçok ayrıntı atlanmıştır ve kenar durumları göz ardı edilmiştir.
:::

Bu, temel bilgiler bölümünde tartıştığımız `tepki nesnelerinin bazı sınırlamaları` konusunda bazı açıklamalar yapar:

- Bir reaktif nesnenin bir özelliğini yerel bir değişkene atadığınızda veya yapısının çözümlemesini yaptığınızda, o değişkeni erişmek veya atamak tepkisel değildir çünkü artık kaynak nesne üzerindeki get / set proxy tuzaklarını tetiklemez. Bu "bağlantı kopması" yalnızca değişken bağlama için geçerlidir - eğer değişken bir nesne gibi bir ilkel olmayan değere işaret ediyorsa, nesnenin mutasyonu yine de tepkisel olacaktır.

- `reactive()`'den dönen proxy, orijinal gibi davranmasına rağmen, orijinal ile `===` operatörü kullanılarak karşılaştırıldığında farklı bir kimliğe sahiptir.

`track()` içinde, mevcut bir etkinin olup olmadığını kontrol ediyoruz. Eğer bir tane varsa, izlenen özelliğin abone etkilerini (bir Set içinde saklanır) buluyoruz ve etkinliği Set'e ekliyoruz:

```js
// Bu, bir etki çalıştırılmadan hemen önce ayarlanacaktır.
// Bununla daha sonra ilgileneceğiz.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Etkilerin abonelikleri, global bir `WeakMap>>` veri yapısında saklanır. Bir özellik için bir abonelik etkisi Set'i bulunamazsa (ilk kez izleniyorsa), oluşturulacaktır. Bu, kısaca `getSubscribersForProperty()` fonksiyonunun yaptığıdır. Kolaylık açısından, detaylarını atlayacağız.

`trigger()` içinde, yine özelliğin abone etkilerini buluyoruz. Ancak bu sefer onları çalıştırıyoruz:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Şimdi `whenDepsChange()` fonksiyonuna geri dönelim:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Bu, ham `update` fonksiyonunu, kendisini güncelleme gerçekleştirilmeden önce mevcut etkinin aktif etkisi olarak ayarlayan bir etkiye sarar. Bu, güncelleme sırasında `track()` çağrılarının mevcut aktif etkiyi bulmasını sağlar.

Bu noktada, bağımlılıklarını otomatik olarak izleyen ve bir bağımlılık değiştiğinde tekrar çalışan bir etki oluşturmuş olduk. Buna **Tepkisel Etki** diyoruz.

Vue, tepkisel etkiler oluşturmanıza olanak tanıyan bir API sağlar: `watchEffect()`. Aslında, bunun, örnekteki sihirli `whenDepsChange()` ile oldukça benzer çalıştığını fark etmiş olabilirsiniz. Şimdi, orijinal örneği gerçek Vue API'lerini kullanarak yeniden düzenleyebiliriz:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // A0 ve A1'i izleyerek
  A2.value = A0.value + A1.value
})

// etkiyi tetikler
A0.value = 2
```

Bir ref'i mutasyona uğratmak için kullanılan bir tepkisel etki, en ilginç kullanım durumu değildir; aslında, bir hesaplanan özellik kullanmak daha deklaratiftir:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

`computed` dahili olarak geçersiz kılmayı ve yeniden hesaplamayı bir tepkisel etki kullanarak yönetir.

Peki, yaygın ve yararlı bir tepkisel etkinin örneği nedir? Eh, DOM'u güncellemek! Basit "tepki ile render" uygulamasını şöyle gerçekleştirebiliriz:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Sayım: ${count.value}`
})

// DOM'u günceller
count.value++
```

Aslında, bu, bir Vue bileşeninin durumu ve DOM'u senkronize tutması için oldukça yakındır - her bileşen örneği, DOM'u oluşturmak ve güncellemek için bir tepkisel etki oluşturur. Elbette Vue bileşenleri, DOM'u güncellemek için `innerHTML`'den çok daha verimli yollar kullanır. Bu, `Render Mekanizması` bölümünde tartışılmaktadır.



`ref()`, `computed()` ve `watchEffect()` API'leri, Composition API'nin bir parçasıdır. Eğer şimdiye kadar Vue ile yalnızca Options API kullanıyorsanız, Composition API’nin Vue’nun tepkisel sisteminin alt yapısında nasıl çalıştığına daha yakın olduğunu fark edeceksiniz. Aslında, Vue 3’te Options API, Composition API’nin üstünde uygulanmaktadır. Bileşen örneği üzerindeki (`this`) tüm özellik erişimleri, tepkisel izleme için getiricileri / ayarlayıcıları tetikler ve `watch` ve `computed` gibi seçenekler içsel olarak Composition API eşdeğerlerini çağırır.



## Çalışma Zamanında Tepkisel Programlama vs. Derleme Zamanında Tepkisel Programlama {#runtime-vs-compile-time-reactivity}

Vue’nun reaktör sistemi esasen çalışma zamanına dayalıdır: izleme ve tetikleme, kod doğrudan tarayıcıda çalışırken gerçekleştirilir. Çalışma zamanı tepkiselliğinin avantajları, bir derleme adımı olmadan çalışabilmesi ve daha az kenar durumu olmasını sağlar. Öte yandan, bu, JavaScript’in sözdizimi sınırlamalarına bağlıdır ve bu nedenle Vue refs gibi değer kaplarını gerektirir.

Bazı çerçeveler, [Svelte](https://svelte.dev/) gibi, derleme sırasında tepkiselliği uygulayarak bu tür sınırlamaları aşmayı tercih eder. Dördündan, kodu analiz edip dönüştürerek tepkiselliği simüle eder. Derleme adımı, çerçeveyi JavaScript’in anlamını değiştirmesine izin sunar - örneğin, yerel olarak tanımlanan değişkenlere erişim etrafına bağımlılık analizi ve etki tetikleme yapacak şekilde kod enjekte etmek. Dezavantajı, bu tür dönüşümlerin bir derleme adımı gerektirmesidir ve JavaScript anlamlarını değiştirmek, aslında JavaScript gibi görünen ancak başka bir şeyle derlenen yeni bir dil yaratmak demektir.

Vue ekibi, deneysel bir özellik olan `Reaktör Dönüşümü` aracılığıyla bu yönü araştırdı, ancak nihayetinde, burada belirtilen [gerekçeler](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028) nedeniyle projemiz için uygun olmadığını düşündük.

## Tepkisel Hata Ayıklama {#reactivity-debugging}

Vue'nun tepkisel sistemi bağımlılıkları otomatik olarak izlemek harikadır, ancak bazı durumlarda tam olarak neyin izlenildiğini veya bir bileşeni neyin tekrar render ettirdiğini anlamak isteyebiliriz.

### Bileşen Hata Ayıklama Kancaları {#component-debugging-hooks}

Bir bileşenin render'ı sırasında hangi bağımlılıkların kullanıldığını ve hangi bağımlılığın bir güncellemeyi tetiklediğini izlemek için ``renderTracked``onRenderTracked` ve `renderTriggered``onRenderTriggered` yaşam döngüsü kancalarını kullanabiliriz. Her iki kanca da ilgili bağımlılık hakkında bilgi içeren bir hata ayıklayıcı olayı alır. Bağlamalarda bağımlılığı etkileşimli olarak incelemek için bir `debugger` ifadesi yerleştirilmesi önerilir:



```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```




```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```



:::tip
Bileşen hata ayıklama kancaları yalnızca geliştirme modunda çalışır.
:::

Hata ayıklama olayı nesneleri şu türdedir:



```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Hesaplanan Özellik Hata Ayıklama {#computed-debugging}



Hesaplanan özellikleri `computed()`'a bir ikinci seçenek nesnesi geçirerek hata ayıklayabiliriz; bu nesne `onTrack` ve `onTrigger` geri çağırmalarını içerir:

- `onTrack`, bir tepkisel özellik veya referans bir bağımlılık olarak izlendiğinde çağrılır.
- `onTrigger`, izleyici geri çağırması bir bağımlılığın mutasyonu ile tetiklendiğinde çağrılır.

Her iki geri çağırma da `bileşen hata ayıklama kancalarıyla` aynı formatta hata ayıklama olayları alır:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // count.value bağımlılık olarak izlendiğinde tetiklenir
    debugger
  },
  onTrigger(e) {
    // count.value mutasyona uğradığında tetiklenir
    debugger
  }
})

// plusOne'a erişim sağlama, onTrack'ı tetikler
console.log(plusOne.value)

// count.value'ı mutasyona uğratma, onTrigger'ı tetikler
count.value++
```

:::tip
`onTrack` ve `onTrigger` hesaplanan seçenekleri yalnızca geliştirme modunda çalışır.
:::

### Gözlemci Hata Ayıklama {#watcher-debugging}



`computed()`'a benzer şekilde, gözlemciler de `onTrack` ve `onTrigger` seçeneklerini destekler:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
`onTrack` ve `onTrigger` gözlemci seçenekleri yalnızca geliştirme modunda çalışır.
:::

## Dış Durum Sistemleri ile Entegrasyon {#integration-with-external-state-systems}

Vue’nun reaktör sistemi, düz JavaScript nesnelerini derinlemesine reaktif proxy'lere dönüştürerek çalışır. Derin dönüşüm, dış durum yönetim sistemleri ile entegre olduğunda gereksiz veya bazen istenmeyen olabilir (örneğin, dış bir çözüm de Proxies kullanıyorsa).

Vue'nun tepkisel sistemini bir dış durum yönetim çözümü ile entegre etmenin genel fikri, dış durumu `shallowRef` içinde tutmaktır. Bir shallow ref, yalnızca `.value` özelliği erişildiğinde tepkisel hale gelir - iç değer olduğu gibi bırakılır. Dış durum değiştiğinde, güncellemeleri tetiklemek için ref değerini değiştirebiliriz.

### Değişmez Veri {#immutable-data}

Bir geri alma / yineleme özelliği uyguluyorsanız, muhtemelen her kullanıcı düzenlemesinde uygulamanın durumunun bir anlık görüntüsünü almak istersiniz. Ancak, Vue’nun değiştirilebilir tepkisel sistemi, durum ağacı büyük olduğunda bunun için en uygun sistem değildir, çünkü her güncelleme için tüm durum nesnesini seri hale getirmek, hem CPU hem de bellek maliyetleri açısından pahalı olabilir.

[Değişmez veri yapıları](https://en.wikipedia.org/wiki/Persistent_data_structure), durum nesnelerini asla değiştirmeyerek bu sorunu çözer - bunun yerine, eski nesnelerle aynı değişmeyen parçaları paylaşan yeni nesneler oluşturur. JavaScript’te değişmez verileri kullanmanın farklı yolları vardır, ancak değişmez verileri kullanırken daha ergonomik ve değiştirilebilir sözdizimini koruduğu için Vue ile [Immer](https://immerjs.github.io/immer/) kullanmanızı öneririz.

Immer’i Vue ile basit bir bileşen aracılığıyla entegre edebiliriz:

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Oyun Alanında deneyin](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### Durum Makineleri {#state-machines}

[Durum Makinesi](https://en.wikipedia.org/wiki/Finite-state_machine), bir uygulamanın içinde olabileceği tüm olası durumları ve bir durumdan diğerine geçiş yapmanın tüm olası yollarını tanımlamada kullanılan bir modeldir. Basit bileşenler için aşırı olabilir, ancak karmaşık durum akışlarını daha sağlam ve yönetilebilir hale getirmeye yardımcı olabilir.

JavaScript'te en popüler durum makinesi uygulamalarından biri [XState](https://xstate.js.org/) dir. İşte bununla entegre olan bir bileşen:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Oyun Alanında deneyin](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/), asenkron olay akışları ile çalışmak için bir kütüphanedir. [VueUse](https://vueuse.org/) kütüphanesi, RxJS akışlarını Vue’nun tepkisel sistemi ile bağlamak için [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) eklentisini sağlar.

## Sinyallere Bağlantı {#connection-to-signals}

Birçok diğer çerçeve, Vue'nun Composition API'sinden gelen referanslara benzer tepkisel ilkeleri "sinyaller" terimi altında tanıtmıştır:

- [Solid Sinyalları](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular Sinyalları](https://angular.dev/guide/signals)
- [Preact Sinyalları](https://preactjs.com/guide/v10/signals/)
- [Qwik Sinyalları](https://qwik.builder.io/docs/components/state/#usesignal)

Temelde, sinyaller Vue referansları ile aynı türde bir tepkisel ilke oluşturur. Yeni bir sinyal, bir değer kapsayıcısıdır ve erişim sırasında bağımlılık izleme, mutasyon sırasında yan etkileri tetikleme sağlar. Bu tepkisel-primitif tabanlı paradigma, ön yüz dünyasında nispeten yeni bir kavram değildir: bir dekad önce [Knockout gözlemleri](https://knockoutjs.com/documentation/observables.html) ve [Meteor Tracker](https://docs.meteor.com/api/tracker.html) gibi uygulamalara dayanmaktadır. Vue'nun Options API'si ve React durum yönetim kütüphanesi [MobX](https://mobx.js.org/) da aynı ilkelere dayanmaktadır, ancak bu ilkeleri nesne özellikleri ardında gizlemektedir.

Sinyallerin tanımlanabilmesi için gerekli bir nitelik olmamasına rağmen, bugün kavram genellikle güncellemelerin ince taneli abonelikler aracılığıyla yapıldığı render modeli ile birlikte tartışılmaktadır. Sanal DOM kullanımı nedeniyle, Vue şu anda benzer optimizasyonlara ulaşmak için derleyicilere `dayanmaktadır`. Ancak, ayrıca Sanal DOM'a dayanmayıp Vue’nun yerleşik tepkisel sisteminden daha fazla yararlanacak yeni bir Solid ilhamlı derleme stratejisini [Vapor Modu](https://github.com/vuejs/core-vapor) araştırıyoruz.

### API Tasarımı Trade-Off’ları {#api-design-trade-offs}

Preact ve Qwik sinyallerinin tasarımı, Vue'nun `shallowRef` ile çok benzerlik göstermektedir: üçü de `.value` özelliği aracılığıyla değiştirilebilir bir arayüz sunar. Tartışmayı Solid ve Angular sinyallerine odaklanacağız.