---
title: Render Fonksiyonu APIleri
seoTitle: Render Fonksiyonu APIleri - Vue
sidebar_position: 4
description: Render Fonksiyonu APIleri, sanal DOM düğümleri oluşturmak için kullanılan yöntemlerdir. Bu belgede, h(), mergeProps(), cloneVNode() gibi temel APIler hakkında detaylı bilgi bulacaksınız.
tags: 
  - Render Fonksiyonu
  - Vue
  - API
  - Bileşenler
  - Geliştirici
keywords: 
  - Render Fonksiyonu
  - Vue
  - API
  - Bileşenler
  - Geliştirici
---
## Render Fonksiyonu API'leri {#render-function-apis}

## h() {#h}

Sanal DOM düğümleri (vnodes) oluşturur.

- **Tip**

  ```ts
  // tam imza
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // props atlanıyor
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Tipler okunabilirlik için basitleştirilmiştir.

- **Detaylar**

  İlk argüman ya bir dize (yerel öğeler için) ya da bir Vue bileşen tanımı olabilir. İkinci argüman geçilecek props, üçüncü argüman ise çocuklardır.

  Bir bileşen vnode'u oluştururken, çocuklar slot işlevleri olarak geçirilmelidir. Bileşenin yalnızca varsayılan slotu bekliyorsa, tek bir slot işlevi geçirilebilir. Aksi takdirde, slotlar slot işlevlerinin bir nesnesi olarak geçirilmelidir.

  Kolaylık adına, çocuklar bir slot nesnesi değilse, props argümanı atlanabilir.

- **Örnek**

  Yerel öğeleri oluşturma:

  ```js
  import { h } from 'vue'

  // type dışındaki tüm argümanlar isteğe bağlıdır
  h('div')
  h('div', { id: 'foo' })

  // hem öznitelikler hem de özellikler props içinde kullanılabilir
  // Vue otomatik olarak atamanın doğru yolunu seçer
  h('div', { class: 'bar', innerHTML: 'merhaba' })

  // class ve style aynı nesne / dizi değer desteğine sahiptir
  // şablonlardaki gibi
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // olay dinleyicileri onXxx olarak geçirilmelidir
  h('div', { onClick: () => {} })

  // çocuk bir dize olabilir
  h('div', { id: 'foo' }, 'merhaba')

  // props yoksa atlanabilir
  h('div', 'merhaba')
  h('div', [h('span', 'merhaba')])

  // çocuk dizisi karışık vnodes ve dizeleri içerebilir
  h('div', ['merhaba', h('span', 'merhaba')])
  ```

  Bileşenler oluşturma:

  ```js
  import Foo from './Foo.vue'

  // props geçişi
  h(Foo, {
    // some-prop="merhaba" ile eşdeğer
    someProp: 'merhaba',
    // @update="() => {}" ile eşdeğer
    onUpdate: () => {}
  })

  // tek varsayılan slot geçişi
  h(Foo, () => 'varsayılan slot')

  // adlandırılmış slotlar geçişi
  // dikkat, `null` gereklidir ki
  // slot nesnesi props olarak değerlendirilmesin
  h(MyComponent, null, {
    default: () => 'varsayılan slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'bir'), h('span', 'iki')]
  })
  ```

- **Ayrıca bakınız** `Rehber - Render Fonksiyonları - VNode'ları Oluşturma`

## mergeProps() {#mergeprops}

Özel bir işleme ile birden fazla props nesnesini birleştirir.

- **Tip**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Detaylar**

  `mergeProps()` aşağıdaki props'lar için özel bir işleme ile birden fazla props nesnesinin birleştirilmesini destekler:

  - `class`
  - `style`
  - `onXxx` olay dinleyicileri - aynı adı taşıyan birden fazla dinleyici bir diziye birleştirilecektir.

  Birleştirme davranışına ihtiyaç duymazsanız ve basit üstveri isterseniz, yerel nesne yayma kullanılabilir.

- **Örnek**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

Bir vnode'u kopyalar.

- **Tip**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Detaylar**

  Orijinal ile birleştirilmek üzere isteğe bağlı olarak ekstra props ile kopyalanmış bir vnode döndürür.

  Vnodes oluşturulduktan sonra değişmez olarak değerlendirilmelidir ve mevcut bir vnode'un props'larını değiştirmemelisiniz. Bunun yerine, farklı / ekstra props ile kopyalayın.

  Vnodes özel iç özelliklere sahiptir, bu nedenle bunları kopyalamak, nesne yaymasından daha basit değildir. `cloneVNode()` çoğu iç mantığı yönetir.

- **Örnek**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Bir değerin vnode olup olmadığını kontrol eder.

- **Tip**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Bir bileşeni ismiyle manuel olarak çözmek için.

- **Tip**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Detaylar**

  **Not: Bileşeni doğrudan içe aktarmıyorsanız bu gereklidir.**

  `resolveComponent()` doğru bileşen bağlamında çözülmek üzere `setup()` veya render fonksiyonu içinde çağrılmalıdır.

  Eğer bileşen bulunamazsa, bir çalışma zamanı uyarısı oluşturulacak ve isim dizisi döndürülecektir.

- **Örnek**

  

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  
  

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  

- **Ayrıca bakınız** `Rehber - Render Fonksiyonları - Bileşenler`

## resolveDirective() {#resolvedirective}

Bir direktifi ismiyle manuel olarak çözmek için.

- **Tip**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Detaylar**

  **Not: Direktifi doğrudan içe aktarmıyorsanız bu gereklidir.**

  `resolveDirective()` doğru bileşen bağlamında çözülmek üzere `setup()` veya render fonksiyonu içinde çağrılmalıdır.

  Eğer direktif bulunamazsa, bir çalışma zamanı uyarısı oluşturulacak ve fonksiyon `undefined` döndürecektir.

- **Ayrıca bakınız** `Rehber - Render Fonksiyonları - Özel Direktifler`

## withDirectives() {#withdirectives}

Vnodes'e özel direktifler eklemek için.

- **Tip**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Direktif, değer, argüman, modifikatörler]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Detaylar**

  Mevcut bir vnode'u özel direktiflerle sarar. İkinci argüman bir dizi özel direktiften oluşur. Her özel direktif, `[Direktif, değer, argüman, modifikatörler]` biçiminde bir dizi olarak da temsil edilir. Dizi elemanları ihtiyaç duyulmuyorsa atlanabilir.

- **Örnek**

  ```js
  import { h, withDirectives } from 'vue'

  // özel bir direktif
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **Ayrıca bakınız** `Rehber - Render Fonksiyonları - Özel Direktifler`

## withModifiers() {#withmodifiers}

Bir olay işleyici fonksiyonuna yerleşik `v-on` modifikatörleri` eklemek için.

- **Tip**

  ```ts
  function withModifiers(fn: Function, modifiers: ModifierGuardsKeys[]): Function
  ```

- **Örnek**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // v-on:click.stop.prevent ile eşdeğer
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **Ayrıca bakınız** `Rehber - Render Fonksiyonları - Olay Modifikatörleri`