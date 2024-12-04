---
title: Özel Yönergeler
seoTitle: Özel Yönergeler - Vue.js
sidebar_position: 4
description: Vue, kendi özel yönergelerinizi kaydetmenize olanak tanır. Bu kılavuz, özel yönergelerin nasıl kullanılacağını ve yapılandırılacağını açıklar.
tags: 
  - Vue
  - Yönergeler
  - Geliştirme
keywords: 
  - Vue.js
  - özel yönergeler
  - front-end
  - JavaScript
---
## Özel Yönergeler {#custom-directives}


const vHighlight = {
  mounted: el => {
    el.classList.add('is-highlight')
  }
}



.vt-doc p.is-highlight {
  margin-bottom: 0;
}

.is-highlight {
  background-color: yellow;
  color: black;
}


## Giriş {#introduction}

Vue, core içerisinde gönderilen varsayılan yönerge setinin (örneğin `v-model` veya `v-show`) yanı sıra, kendi özel yönergelerinizi kaydetmenize de olanak tanır.

Vue'de iki form kod yeniden kullanımını tanıttık: `bileşenler` ve `composables`. Bileşenler ana yapı taşlarıdır, oysa composables durum mantığını yeniden kullanmaya odaklanır. Özel yönergeler ise esas olarak düz öğelerde düşük seviyeli DOM erişimini içeren mantığı yeniden kullanmak için tasarlanmıştır.

Bir özel yönerge, bir bileşenin yaşam döngüsü kancalarına benzer bir nesne olarak tanımlanır. Kancalar, yönergenin bağlandığı elementi alır. İşte Vue tarafından DOM'a eklendiğinde bir elemana sınıf ekleyen bir yönerge örneği:



```vue
<script setup>
// şablonlarda v-highlight'ı etkinleştirir
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>Bu cümle önemlidir!</p>
</template>
```





```js
const highlight = {
  mounted: (el) => el.classList.add('is-highlight')
}

export default {
  directives: {
    // şablonda v-highlight'ı etkinleştirir
    highlight
  }
}
```

```vue-html
<p v-highlight>Bu cümle önemlidir!</p>
```




  Bu cümle önemlidir!




`` içinde, `v` öneki ile başlayan tüm camelCase değişkenleri özel yönerge olarak kullanılabilir. Yukarıdaki örnekte, `vHighlight` şablonda `v-highlight` olarak kullanılabilir.

`` kullanmıyorsanız, özel yönergeler `directives` seçeneği kullanılarak kaydedilebilir:

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // şablonda v-highlight'ı etkinleştirir
    highlight: {
      /* ... */
    }
  }
}
```





Bileşenlerde olduğu gibi, özel yönergelerin şablonlarda kullanılabilmesi için kaydedilmesi gerekir. Yukarıdaki örnekte, `directives` seçeneği aracılığıyla yerel kayıt kullanıyoruz.



Ayrıca özel yönergelerin global olarak uygulama düzeyinde kaydedilmesi de yaygındır:

```js
const app = createApp({})

// tüm bileşenlerde v-highlight'ı kullanılabilir hale getirir
app.directive('highlight', {
  /* ... */
})
```

## Özel Yönergeleri Ne Zaman Kullanmalı {#when-to-use}

Özel yönergeler yalnızca istenen işlevselliğin doğrudan DOM manipülasyonu ile sağlanabildiği durumlarda kullanılmalıdır.

Bunun yaygın bir örneği, bir öğeyi odaklayan `v-focus` özel yönergesidir.



```vue
<script setup>
// şablonlarda v-focus'ı etkinleştirir
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```





```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // şablonda v-focus'ı etkinleştirir
    focus
  }
}
```

```vue-html
<input v-focus />
```



Bu yönerge, yalnızca sayfa yüklendiğinde değil, aynı zamanda öğe dinamik olarak Vue tarafından eklendiğinde de çalıştığı için `autofocus` özniteliğinden daha kullanışlıdır!

Mümkünse, daha verimli ve sunucu-rendering dostu olduğu için `v-bind` gibi yerleşik yönergelerle bildirimsel şablonlama önerilir.

## Yönerge Kancaları {#directive-hooks}

Bir yönerge tanım nesnesi birkaç kanca fonksiyonu sağlayabilir (tümü isteğe bağlı):

```js
const myDirective = {
  // bağlanan elementin niteleri
  // veya olay dinleyicileri uygulanmadan önce çağrılır
  created(el, binding, vnode) {
    // argümanlar hakkında daha fazla detay için aşağıya bakın
  },
  // elementin DOM'a eklenecek olduğu zaman hemen önce çağrılır.
  beforeMount(el, binding, vnode) {},
  // bağlanan elementin üst bileşeninin
  // ve tüm çocuklarının monte edildiğinde çağrılır.
  mounted(el, binding, vnode) {},
  // üst bileşen güncellenmeden önce çağrılır
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // üst bileşen ve
  // tüm çocukları güncellendikten sonra çağrılır
  updated(el, binding, vnode, prevVnode) {},
  // üst bileşen montajdan önce çağrılır
  beforeUnmount(el, binding, vnode) {},
  // üst bileşen montajdan ayrıldığında çağrılır
  unmounted(el, binding, vnode) {}
}
```

### Kanca Argümanları {#hook-arguments}

Yönerge kancalarına bu argümanlar geçirilir:

- `el`: yönergenin bağlandığı element. Bu, DOM'u doğrudan manipüle etmek için kullanılabilir.

- `binding`: aşağıdaki özellikleri içeren bir nesne.

  - `value`: Yönergeye geçirilen değer. Örneğin `v-my-directive="1 + 1"` içinde, değer `2` olacaktır.
  - `oldValue`: Önceki değer, yalnızca `beforeUpdate` ve `updated` içinde mevcuttur. Değerin değişip değişmediğine bakılmaksızın mevcuttur.
  - `arg`: Yönergeye geçirilen argüman, varsa. Örneğin `v-my-directive:foo` içinde, arg `"foo"` olacaktır.
  - `modifiers`: Varsa, işaretçileri içeren bir nesne. Örneğin `v-my-directive.foo.bar` içinde, işaretçiler nesnesi `{ foo: true, bar: true }` olacaktır.
  - `instance`: Yönergenin kullanıldığı bileşenin örneği.
  - `dir`: yönerge tanım nesnesi.

- `vnode`: bağlanan elementi temsil eden alttaki VNode.
- `prevVnode`: önceki render'dan bağlanan elementi temsil eden VNode. Sadece `beforeUpdate` ve `updated` kancalarında mevcuttur.

Bir örnek vermek gerekirse, aşağıdaki yönerge kullanımını düşünün:

```vue-html
<div v-example:foo.bar="baz">
```

`binding` argümanı şu şekilde bir nesne olacaktır:

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` değer */,
  oldValue: /* önceki güncellemeden `baz` değeri */
}
```

Yerleşik yönergelerde olduğu gibi, özel yönerge argümanları dinamik olabilir. Örneğin:

```vue-html
<div v-example:[arg]="value"></div>
```

Burada yönerge argümanı, bileşen durumundaki `arg` özelliğine dayanarak reaktif olarak güncellenir.

:::tip Not
`el` dışında, bu argümanları yalnızca okunabilir olarak işlemeniz ve asla değiştirmeniz önerilmez. Kancalar arasında bilgi paylaşmanız gerektiğinde, bunu elementin [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) üzerinden yapmanız önerilir.
:::

## Fonksiyon Kısayolu {#function-shorthand}

Özel bir yönergenin `mounted` ve `updated` için aynı davranışa sahip olması yaygındır; diğer kancalara gerek yoktur. Bu gibi durumlarda, yönergeyi bir fonksiyon olarak tanımlayabiliriz:

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // bu hem `mounted` hem de `updated` için çağrılacak
  el.style.color = binding.value
})
```

## Nesne Literalleri {#object-literals}

Yönergenizin birden fazla değere ihtiyacı varsa, JavaScript nesne literali de geçebilirsiniz. Unutmayın, yönergeler geçerli herhangi bir JavaScript ifadesini alabilir.

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## Bileşenlerde Kullanım {#usage-on-components}

:::warning Önerilmez
Bileşenlerde özel yönergelerin kullanılması önerilmez. Bir bileşen birden fazla kök düğme sahip olduğunda beklenmedik davranışlar meydana gelebilir.
:::

Bileşenlerde kullanıldığında, özel yönergeler her zaman bir bileşenin kök düğümüne uygulanır; `Fallthrough Attributes` ile benzer şekilde.

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- MyComponent şablonu -->

<div> <!-- v-demo yönergesi burada uygulanacak -->
  <span>Bileşen içeriğim</span>
</div>
```

Bileşenlerin birden fazla kök düğüme sahip olabileceğini unutmayın. Çoklu kök bileşenlere uygulandığında, bir yönerge göz ardı edilecek ve bir uyarı verilecektir. Niteliklerin aksine, yönergeler `v-bind="$attrs"` ile farklı bir öğeye geçirilemez.