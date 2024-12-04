---
title: Render Fonksiyonları & JSX
seoTitle: Vue Render Fonksiyonları ve JSX Kullanımı
sidebar_position: 4
description: Vueda render fonksiyonlarının ve JSXin nasıl kullanıldığını keşfedin. Vnode oluşturma, composable API ve daha fazlası hakkında bilgi edinin.
tags: 
  - Vue
  - Render Fonksiyonları
  - JSX
  - Vnode
keywords: 
  - Vue
  - render fonksiyonları
  - JSX
  - Vnode
  - bileşenler
---
## Render Fonksiyonları & JSX {#render-functions-jsx}

Vue, uygulamaları oluşturmak için çoğu durumda şablonlar kullanılmasını önerir. Ancak, JavaScript'in tam programatik gücüne ihtiyaç duyduğumuz durumlar da vardır. İşte burada **render fonksiyonu** kullanabiliriz.

> Sanal DOM ve render fonksiyonları kavramına yeniyseniz, önce `Render Mekanizması` bölümünü okumayı unutmayın.

## Temel Kullanım {#basic-usage}

### Vnode Oluşturma {#creating-vnodes}

Vue, vnode oluşturmak için `h()` fonksiyonu sağlar:

```js
import { h } from 'vue'

const vnode = h(
  'div', // tür
  { id: 'foo', class: 'bar' }, // özellikler
  [
    /* çocuklar */
  ]
)
```

`h()` **hiperskript** için kısadır - bu "HTML (hiper metin işaretleme dili) üreten JavaScript" anlamına gelir. Bu isim, birçok sanal DOM uygulaması tarafından paylaşılan geleneklerden gelir. Daha açıklayıcı bir isim `createVNode()` olabilir, ancak daha kısa bir isim, bu fonksiyonu render fonksiyonu içinde birçok kez çağırmanız gerektiğinde faydalıdır.

`h()` fonksiyonu çok esnek olacak şekilde tasarlanmıştır:

```js
// tür dışındaki tüm argümanlar isteğe bağlıdır
h('div')
h('div', { id: 'foo' })

// hem nitelikler hem de özellikler, özellikler içinde kullanılabilir
// Vue otomatik olarak bunu atamanın doğru yolunu seçer
h('div', { class: 'bar', innerHTML: 'merhaba' })

// .prop ve .attr gibi özellik değiştiricileri eklenebilir
// sırasıyla `.` ve `^` ön ekleri ile
h('div', { '.name': 'some-name', '^width': '100' })

// sınıf ve stil, şablonlardaki desteklediği aynı nesne / dizi
// değer desteğine sahiptir
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// olay dinleyicileri onXxx olarak geçilmelidir
h('div', { onClick: () => {} })

// çocuklar bir string olabilir
h('div', { id: 'foo' }, 'merhaba')

// özellikler yoksa özellikler atlanabilir
h('div', 'merhaba')
h('div', [h('span', 'merhaba')])

// çocuklar dizisi karışık vnode ve string içerebilir
h('div', ['merhaba', h('span', 'merhaba')])
```

Oluşan vnode aşağıdaki şekle sahiptir:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Not
Tam `VNode` arayüzü birçok başka iç özellik içerir, ancak burada listelenenlerden başka herhangi bir özelliğe güvenilmemesi şiddetle önerilir. Bu, iç özellikler değişirse istenmeyen kırılmaları önler.
:::

### Render Fonksiyonlarını Tanımlama {#declaring-render-functions}



Composition API ile şablonlar kullanıldığında, `setup()` kancasının döndürdüğü değer şablona veri açığa çıkarmak için kullanılır. Ancak render fonksiyonları kullanıldığında, render fonksiyonunu doğrudan döndürebiliriz:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // render fonksiyonunu döndür
    return () => h('div', props.msg + count.value)
  }
}
```

Render fonksiyonu `setup()` içinde tanımlandığı için doğal olarak aynı kapsamda tanımlanan özelliklere ve reaktif duruma erişimi vardır.

Tek bir vnode döndürmenin yanı sıra, string veya diziler de döndürebilirsiniz:

```js
export default {
  setup() {
    return () => 'merhaba dünya!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // birden fazla kök düğüm döndürmek için dizi kullanın
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
Doğrudan değerleri döndürmek yerine bir fonksiyon döndürmeyi unutmayın! `setup()` fonksiyonu her bileşen için yalnızca bir kez çağrılır, oysa döndürülen render fonksiyonu birden çok kez çağrılacaktır.
:::




Render fonksiyonlarını `render` seçeneği kullanarak tanımlayabiliriz:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'merhaba'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

`render()` fonksiyonu, `this` aracılığıyla bileşen örneğine erişime sahiptir.

Tek bir vnode döndürmenin yanı sıra, string veya diziler de döndürebilirsiniz:

```js
export default {
  render() {
    return 'merhaba dünya!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // birden fazla kök düğüm döndürmek için dizi kullanın
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```



Bir render fonksiyonu bileşeni, herhangi bir durum durumu gerekmediğinde, kısalık için doğrudan bir fonksiyon olarak da tanımlanabilir:

```js
function Hello() {
  return 'merhaba dünya!'
}
```

Evet, bu geçerli bir Vue bileşenidir! Bu sözdizimi hakkında daha fazla ayrıntı için `Fonksiyonel Bileşenler` bölümüne bakın.

### Vnode'lar Eşsiz Olmalıdır {#vnodes-must-be-unique}

Bileşen ağacındaki tüm vnode'ların eşsiz olması gerekmektedir. Yani, aşağıdaki render fonksiyonu geçerli değildir:

```js
function render() {
  const p = h('p', 'merhaba')
  return h('div', [
    // Aman Tanrım - kopya vnode'lar!
    p,
    p
  ])
}
```

Aynı öğe/bileşeni birden çok kez kopyalamak istiyorsanız, bir fabrika fonksiyonu ile bunu yapabilirsiniz. Örneğin, aşağıdaki render fonksiyonu, 20 aynı paragrafı oluşturmanın mükemmel geçerli bir yoludur:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'merhaba')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) JavaScript'e benzer bir XML uzantısıdır ve şu şekilde yazmamıza olanak tanır:

```jsx
const vnode = <div>merhaba</div>
```

JSX ifadeleri içinde dinamik değerleri gömmek için süslü parantezler kullanın:

```jsx
const vnode = <div id={dynamicId}>merhaba, {userName}</div>
```

`create-vue` ve Vue CLI, önceden yapılandırılmış JSX desteği ile projeleri oluşturma seçeneklerine sahiptir. Eğer JSX'yi manuel olarak yapılandırıyorsanız, lütfen [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) dokümantasyonuna başvurun.

İlk olarak React tarafından tanıtılmış olmasına rağmen, JSX aslında tanımlı bir çalışma zamanı anlamsalına sahip değildir ve çeşitli çıktılara derlenebilir. Eğer daha önce JSX ile çalıştıysanız, **Vue JSX dönüşümünün React'ın JSX dönüşümünden farklı olduğunu** unutmayın, bu nedenle Vue uygulamalarında React'ın JSX dönüşümünü kullanamazsınız. React JSX'den bazı dikkat çekici farklılıklar şunlardır:

- `class` ve `for` gibi HTML niteliklerini özellikler olarak kullanabilirsiniz - `className` veya `htmlFor` kullanmanıza gerek yoktur.
- Bileşenlere çocuklar geçişi (yani slotlar) `farklı çalışır`.

Vue'nun tür tanımlamaları da TSX kullanımı için tür çıkarımı sağlar. TSX kullanırken, TypeScript'in JSX sentaksını Vue JSX dönüşümünün işleyebilmesi için `tsconfig.json` dosyasına `"jsx": "preserve"` belirttiğinizden emin olun.

### JSX Tür Çıkarımı {#jsx-type-inference}

Dönüşümde olduğu gibi, Vue'nun JSX'sinin de farklı tür tanımlarına ihtiyacı vardır.

Vue 3.4'ü itibariyle, Vue artık global `JSX` alanını otomatik olarak kaydetmiyor. TypeScript'e Vue'nun JSX tür tanımlarını kullanması için aşağıdakileri `tsconfig.json` dosyanıza eklediğinizden emin olun:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

Ayrıca, bir dosya başına `/* @jsxImportSource vue */` yorumu ekleyerek dahil olabilirsiniz.

Global `JSX` alanının mevcudiyetine bağlı olan kodunuz varsa, projenizde `vue/jsx`'yi açıkça içe aktararak veya referans göstererek 3.4 öncesi global davranışı tam olarak koruyabilirsiniz; bu, global `JSX` alanını kaydeder.

## Render Fonksiyonu Tarifleri {#render-function-recipes}

Aşağıda, şablon özelliklerini eşdeğer render fonksiyonları / JSX olarak uygulamak için bazı yaygın tarifler sağlayacağız.

### `v-if` {#v-if}

Şablon:

```vue-html
<div>
  <div v-if="ok">evet</div>
  <span v-else>hayır</span>
</div>
```

Eşdeğer render fonksiyonu / JSX:



```js
h('div', [ok.value ? h('div', 'evet') : h('span', 'hayır')])
```

```jsx
<div>{ok.value ? <div>evet</div> : <span>hayır</span>}</div>
```




```js
h('div', [this.ok ? h('div', 'evet') : h('span', 'hayır')])
```

```jsx
<div>{this.ok ? <div>evet</div> : <span>hayır</span>}</div>
```



### `v-for` {#v-for}

Şablon:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Eşdeğer render fonksiyonu / JSX:



```js
h(
  'ul',
  // varsayılan `items` bir array değerine sahip bir ref'dir
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```




```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```



### `v-on` {#v-on}

Başında `on` ve ardından büyük bir harf olan isimlere sahip nitelikler, olay dinleyicisi olarak değerlendirilir. Örneğin, `onClick` şablonlarda `@click` ile eşdeğerdir.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Bana Tıkla'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  Bana Tıkla
</button>
```

#### Olay Değiştiricileri {#event-modifiers}

`.passive`, `.capture` ve `.once` olay değiştiricileri, olay isminin üzerine camelCase ile eklenebilir.

Örnek:

```js
h('input', {
  onClickCapture() {
    /* capture modunda dinleyici */
  },
  onKeyupOnce() {
    /* sadece bir kez tetiklenir */
  },
  onMouseoverOnceCapture() {
    /* bir kez + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Diğer olay ve anahtar değiştiricileri için `withModifiers` yardımcı programı kullanılabilir:

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Bileşenler {#components}

Bir bileşen için bir vnode oluşturmak için `h()`'ye geçirilen ilk argüman bileşen tanımı olmalıdır. Yani render fonksiyonlarını kullanırken, bileşeni kaydetmek gerekli değildir - yalnızca içe aktarılan bileşenleri doğrudan kullanabilirsiniz:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Gördüğümüz gibi, `h`, geçerli bir Vue bileşeni olduğu sürece her dosya formatından içe aktarılan bileşenlerle çalışabilir.

Dinamik bileşenler render fonksiyonları ile basittir:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Bir bileşen adıyla kaydedilmiş ve doğrudan içe aktarılamıyorsa (örneğin, bir kütüphane tarafından global olarak kaydedilmişse), `resolveComponent()` yardımcı programını kullanarak programlı bir şekilde çözülebilir.

### Slotları Render Etme {#rendering-slots}



Render fonksiyonlarında, slotlar `setup()` bağlamından erişilebilir. `slots` nesnesindeki her slot, **bir dizi vnode döndüren bir işlevdir**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // varsayılan slot:
      // <div><slot /></div>
      h('div', slots.default()),

      // adlandırılmış slot:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

JSX eşdeğeri:

```jsx
// varsayılan
<div>{slots.default()}</div>

// adlandırılmış
<div>{slots.footer({ text: props.message })}</div>
```




Render fonksiyonlarında, slotlar `this.$slots` üzerinden erişilebilir:

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

JSX eşdeğeri:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```



### Slotları Geçirme {#passing-slots}

Bileşenlere çocukları geçmek, öğelere çocukları geçmekten biraz farklı çalışır. Bir dizi yerine, ya bir slot işlevi ya da bir slot işlevleri nesnesi geçmemiz gerekir. Slot işlevleri, çocuk bileşeninde erişildiğinde her zaman dizi vnode'lara normalleştirilmiş olan herhangi bir şeyi döndürebilir.

```js
// tek varsayılan slot
h(MyComponent, () => 'merhaba')

// adlandırılmış slotlar
// `null`'ın slotların nitelikler olarak değerlendirilmemesi için gerekli olduğunu unutmayın
h(MyComponent, null, {
  default: () => 'varsayılan slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'bir'), h('span', 'iki')]
})
```

JSX eşdeğeri:

```jsx
// varsayılan
<MyComponent>{() => 'merhaba'}</MyComponent>

// adlandırılmış
<MyComponent>{{
  default: () => 'varsayılan slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>bir</span>, <span>iki</span>]
}}</MyComponent>
```

Slotları işlevler olarak geçirmek, çocuk bileşenin slotların bağımlılıklarını takip etmesine olanak tanır. Bu, slotun bağımlılıklarının ebeveyn yerine çocuk tarafından izlenmesiyle sonuçlanır ve daha doğru ve etkili güncellemeler sağlanır.

### Scoped Slotlar {#scoped-slots}

Ebeveyn bileşendeki bir scoped slotu render etmek için, bir slot çocuğa geçilir. Slotta artık `text` adıyla bir parametre olduğunu unutmayın. Slot, çocuk bileşende çağrılacak ve çocuk bileşenden gelen veri ebeveyn bileşene aktarılacaktır.

```js
// ebeveyn bileşen
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

Slotların nitelikler olarak değerlendirilmemesi için `null` geçmeyi unutmayın.

```js
// çocuk bileşen
export default {
  setup(props, { slots }) {
    const text = ref('merhaba')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

JSX eşdeğeri:

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```

### Yerleşik Bileşenler {#built-in-components}

`Yerleşik bileşenler` gibi ``, ``, ``, `` ve `` render fonksiyonlarında kullanılmak üzere ithal edilmelidir:



```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```




```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```



### `v-model` {#v-model}

`v-model` direktifi, şablon derlemesi sırasında `modelValue` ve `onUpdate:modelValue` nitelikleri olarak genişletilir - bu nitelikleri kendimiz sağlamamız gerekecek:



```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```




```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```



### Özel Direktifler {#custom-directives}

Özel direktifler, `withDirectives` kullanılarak bir vnode'a uygulanabilir:

```js
import { h, withDirectives } from 'vue'

// bir özel direktif
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

Eğer direktif isimle kaydedilmiş ve doğrudan içe aktarılamıyorsa, `resolveDirective` yardımcı programı kullanılarak çözülebilir.

### Şablon Referansları {#template-refs}



Composition API ile, şablon referansları doğrudan vnode'a geçilen `ref()` ile oluşturulur:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```




Options API ile, şablon referansları vnode niteliklerinde referans adını string olarak geçirerek oluşturulur:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```



## Fonksiyonel Bileşenler {#functional-components}

Fonksiyonel bileşenler, kendi durumları olmayan alternatif bir bileşen türüdür. Onlar saf fonksiyonlar gibi çalışır: giren prop, çıkan vnode. Bileşen örneği (yani `this` yok) oluşturulmadan render edilir ve normal bileşen yaşam döngüsü kancaları olmadan.

Bir fonksiyonel bileşen oluşturmak için, bir seçenek nesnesi yerine düz bir fonksiyon kullanırız. Fonksiyon, bileşenin `render` fonksiyonu gibi işlev görür.



Fonksiyonel bir bileşenin imzası `setup()` kancası ile aynıdır:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```




Fonksiyonel bileşen için `this` referansı yok olduğundan, Vue `props`'ı ilk argüman olarak geçirir:

```js
function MyComponent(props, context) {
  // ...
}
```

İkinci argüman, `context`, üç özellik içerir: `attrs`, `emit` ve `slots`. Bunlar, örnek özellikleri `$attrs`, `$emit` ve `$slots` ile eşdeğerdir.



Bileşenler için genellikle bulunan yapılandırma seçeneklerinin çoğu, fonksiyonel bileşenler için mevcut değildir. Ancak, `props` ve `emits` tanımlamak mümkündür, bunları özellikler olarak ekleyerek:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

`props` seçeneği belirtilmezse, fonksiyona geçirilen `props` nesnesi, `attrs` ile aynı olacak biçimde tüm nitelikleri içerecektir. Prop isimleri, yalnızca `props` seçeneği belirtilirse camelCase'a normalleştirilecektir.

Açık `props`'a sahip fonksiyonel bileşenler için, `nitelik geçişi` normal bileşenlerle aynı şekilde çalışır. Ancak, açık bir şekilde `props` belirtmeyen fonksiyonel bileşenler için, varsayılan olarak yalnızca `class`, `style` ve `onXxx` olay dinleyicileri `attrs`'dan miras alınır. Her iki durumda da, nitelik miras alımını devre dışı bırakmak için `inheritAttrs` ayarını `false` olarak ayarlayabilirsiniz:

```js
MyComponent.inheritAttrs = false
```

Fonksiyonel bileşenler, normal bileşenler gibi kaydedilebilir ve tüketilebilir. Eğer `h()`'ye ilk argüman olarak bir fonksiyon geçirirseniz, bu fonksiyon fonksiyonel bileşen olarak değerlendirilir.