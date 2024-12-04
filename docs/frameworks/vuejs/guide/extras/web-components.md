---
title: Vue ve Web Bileşenleri
seoTitle: Vue and Web Components
sidebar_position: 1
description: Bu belge, Vue ve Web Bileşenlerini kullanarak özel öğeler oluşturma ve kullanma süreçlerini ele almaktadır. Geliştiricilere, özel öğelerin nasıl entegre edileceği ve geliştirileceği konusunda yol gösterir.
tags: 
  - Vue
  - Web Bileşenleri
  - Özel Öğeler
  - Geliştirme
  - API
keywords: 
  - VueJS
  - Web Components
  - Custom Elements
  - Frontend Development
  - JavaScript
---
## Vue ve Web Bileşenleri {#vue-and-web-components}

[Web Bileşenleri](https://developer.mozilla.org/en-US/docs/Web/Web_Components), geliştiricilerin yeniden kullanılabilir özel öğeler oluşturmasına izin veren web yerel API'lerinin bir setini tanımlayan bir terimdir.

Vue ve Web Bileşenlerini temelde tamamlayıcı teknolojiler olarak değerlendiriyoruz. Vue, özel öğeleri tüketme ve oluşturma konusunda mükemmel destek sunar. Mevcut bir Vue uygulamasına özel öğeleri entegre ediyorsanız veya özel öğeler oluşturmak ve dağıtmak için Vue kullanıyorsanız, doğru yerdesiniz.

## Vue'da Özel Öğeler Kullanma {#using-custom-elements-in-vue}

Vue [Özel Öğeler Her Yerde testlerinde](https://custom-elements-everywhere.com/libraries/vue/results/results.html) %100 puan aldı. Bir Vue uygulaması içinde özel öğeleri tüketmek, çoğunlukla yerel HTML öğelerini kullanmakla aynıdır, ancak dikkat edilmesi gereken bazı şeyler vardır:

### Bileşen Çözümlemesini Atlama {#skipping-component-resolution}

:::tip
Varsayılan olarak, Vue, yerel olmayan HTML etiketlerini bir kayıtlı Vue bileşeni olarak çözmeye çalışacaktır.
:::

Bu, Vue'nun geliştirme sırasında "bileşen çözümlemesi başarısız oldu" uyarısı yayımlamasına neden olur. Belirli öğelerin özel öğeler olarak ele alınmasını sağlamak ve bileşen çözümlemesini atlamak için, `compilerOptions.isCustomElement` seçeneğini` belirtmemiz gerekir.

Eğer Vue'yu bir yapılandırma ile kullanıyorsanız, bu seçenek yapılandırma dosyaları aracılığıyla geçilmelidir, çünkü bu bir derleme zamanı seçeneğidir.

#### Tarayıcıda Örnek Yapılandırma {#example-in-browser-config}

```js
// Sadece tarayıcıda derleme yapıyorsanız çalışır.
// Yapı araçları kullanıyorsanız, aşağıda yapılandırma örneklerine bakın.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Vite Yapılandırma Örneği {#example-vite-config}

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // tüm tire ile ayrılmış etiketleri özel öğe olarak ele al
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Vue CLI Yapılandırma Örneği {#example-vue-cli-config}

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // ion- ile başlayan tüm etiketleri özel öğe olarak ele al
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

### DOM Özelliklerini Geçme {#passing-dom-properties}

:::info
DOM nitelikleri yalnızca dizeler olabileceğinden, karmaşık verileri özel öğelere DOM özellikleri olarak iletmemiz gerekir.
:::

Özel bir öğe üzerinde özellikler ayarlarken, Vue 3 otomatik olarak `in` operatörünü kullanarak DOM özelliğinin varlığını kontrol eder ve anahtar mevcutsa değeri bir DOM özelliği olarak ayarlamayı tercih eder. Bu, genellikle, özel öğe [önerilen en iyi uygulamaları](https://web.dev/custom-elements-best-practices/) takip ediyorsa düşünmeyecek olduğunuz anlamına gelir.

Ancak, verilerin bir DOM özelliği olarak iletilmesi gereken nadir durumlar olabilir, ancak özel öğe uygun şekilde özellik tanımlamıyor/yansıtıyorsa (`in` kontrolünün başarısız olmasına neden olur). Bu durumda, `.prop` modifikatörü kullanarak `v-bind` bağlamasını bir DOM özelliği olarak ayarlamayı zorlayabilirsiniz:

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- kısayol eşdeğeri -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Vue ile Özel Öğeler Oluşturma {#building-custom-elements-with-vue}

Özel öğelerin temel faydası, herhangi bir çerçeve ile veya hatta çerçeve olmadan kullanılabilmesidir. Bu, son kullanıcının aynı ön uç yığınını kullanmadığı durumlarda bileşenlerin dağıtımında idealdir veya bileşenlerin kullandığı uygulamayı uygulama detaylarından izole etmek istediğinizde idealdir.

### defineCustomElement {#definecustomelement}

Vue, tam olarak aynı Vue bileşen API'lerini kullanarak özel öğeler oluşturmayı destekler. `defineCustomElement` yöntemi, `defineComponent` ile aynı argümanı kabul eder ancak bunun yerine `HTMLElement`'i genişleten bir özel öğe yapıcı döndürür:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // burada normal Vue bileşen seçenekleri
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement yalnızca: gölgeli kök içine enjekte edilecek CSS
  styles: [`/* inline css */`]
})

// Özel öğeyi kaydedin.
// Kaydettikten sonra, sayfadaki tüm `<my-vue-element>` etiketleri
// güncellenmiş olacaktır.
customElements.define('my-vue-element', MyVueElement)

// Ayrıca öğeyi programlı olarak örneklendirebilirsiniz:
// (sadece kaydettikten sonra yapılabilir)
document.body.appendChild(
  new MyVueElement({
    // başlangıç özellikleri (isteğe bağlı)
  })
)
```

#### Yaşam Döngüsü {#lifecycle}

- Bir Vue özel öğesi, öğenin [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) ilk kez çağrıldığında içindeki bir Vue bileşeni örneğini gölgeli kökünde başlatır.

- Öğenin `disconnectedCallback`'ı çağrıldığında, Vue, öğenin bir mikro görev tıklamasından sonra belgeden kopup kopmadığını kontrol edecektir.

  - Eğer öğe hala belgede ise, bu bir taşınmadır ve bileşen örneği korunacaktır;

  - Eğer öğe belgeden kopmuşsa, bu bir kaldırmadır ve bileşen örneği kaldırılacaktır.

#### Özellikler {#props}

- `props` seçeneği kullanılarak tanımlanan tüm özellikler, özel öğe üzerinde özellikler olarak tanımlanacaktır. Vue gereken yerlerde nitelikler / özellikler arasında yansıtmayı otomatik olarak ele alacaktır.

  - Nitelikler her zaman karşılık gelen özelliklere yansıtılır.

  - Temel değerlerle (`string`, `boolean` veya `number`) özellikler, nitelikler olarak yansıtılır.

- Vue ayrıca `Boolean` veya `Number` türleriyle tanımlanan özellikleri, nitelikler (her zaman dizelerdir) olarak ayarlandıklarında istenen türe otomatik olarak dönüştürür. Örneğin, aşağıdaki özellik tanımlaması verildiğinde:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  Ve özel öğe kullanımı:

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  Bileşende `selected` `true` (boolean) olarak ve `index` `1` (number) olarak dönüştürülecektir.

#### Olaylar {#events}

`this.$emit` veya kurulum `emit` aracılığıyla yayımlanan olaylar, özel öğe üzerinde yerel [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) olarak iletilir. Ek olay argümanları (yük) CustomEvent nesnesinin `detail` özelliğinde bir dizi olarak açığa çıkar.

#### Slotlar {#slots}

Bileşen içinde, slotlar her zamanki gibi `` öğesi kullanılarak işlenebilir. Ancak, sonuç olan öğeyi tüketirken yalnızca [yerel slot sözdizimi](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) kabul eder:

- `Kapsamlı slotlar` desteklenmez.

- İsimlendirilmiş slotlar geçerken, `v-slot` direktifi yerine `slot` özniteliğini kullanın:

  ```vue-html
  <my-element>
    <div slot="named">merhaba</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

`Provide / Inject API'si` ve bunun `Composition API eşdeğeri` ayrıca Vue tarafından tanımlanan özel öğeler arasında çalışır. Ancak, bunun yalnızca **özel öğeler arasında** çalıştığını unutmayın. yani bir Vue tarafından tanımlanan özel öğe, özel öğe olmayan bir Vue bileşeni tarafından sağlanan özellikleri enjekte edemeyecektir.

#### Uygulama Düzeyi Yapılandırması  {#app-level-config}

Bir Vue özel öğesinin uygulama örneğini `configureApp` seçeneği ile yapılandırabilirsiniz:

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```

### SFC Olarak Özel Öğeler {#sfc-as-custom-element}

`defineCustomElement`, Vue Tek Dosya Bileşenleri (SFC'ler) için de çalışır. Ancak, varsayılan araç kurulumu ile `` SFC'lerin içinde hala çıkarılacak ve üretim derlemesi sırasında tek bir CSS dosyasına birleştirilecektir. Bir SFC'yi özel bir öğe olarak kullanırken, genellikle `` etiketlerini özel öğenin gölgeli köküne enjekte etmek istenir.

Resmi SFC araçları, SFC'lerin "özel öğe modu" içinde içe aktarımını destekler (gereksinim: `@vitejs/plugin-vue@^1.4.0` veya `vue-loader@^16.5.0`). Özel öğe modunda yüklenmiş bir SFC, `` etiketlerini CSS dizeleri olarak enjekte eder ve bunları bileşenin `styles` seçeneği altında açığa çıkarır. Bu, `defineCustomElement` tarafından alınacak ve örneklendirildiğinde öğenin gölgeli köküne enjekte edilecektir.

Bu modda opt-in yapmak için, yalnızca bileşen dosyası adınızı `.ce.vue` ile sonlandırın:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* inline css */"]

// özel öğe yapıcıya dönüştür
const ExampleElement = defineCustomElement(Example)

// kaydet
customElements.define('my-example', ExampleElement)
```

Özel öğe modunda hangi dosyaların içe aktarılacağını özelleştirmek istiyorsanız (örneğin, _tüm_ SFC'leri özel öğe olarak ele almak), ilgili yapılandırma eklentilerine `customElement` seçeneğini geçebilirsiniz:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Vue Özel Öğeleri Kitaplığı için İpuçları {#tips-for-a-vue-custom-elements-library}

::warning
Vue ile özel öğeler oluştururken, öğeler Vue'nun çalışma zamanına bağımlı olacaktır. Kullanılan özellik sayısına bağlı olarak yaklaşık olarak ~16kb'lık bir temel boyut maliyeti vardır.
:::

Bu, tek bir özel öğe gönderiyorsanız Vue'yu kullanmak için ideal değildir - vanilya JavaScript, [petite-vue](https://github.com/vuejs/petite-vue) veya küçük çalışma zamanı boyutuna odaklanan çerçeveler kullanmak isteyebilirsiniz. Ancak, temel boyut, karmaşık mantığa sahip özel öğeler gönderiyorsanız, çok daha az kodla her bileşenin yazılmasına izin verdiğinden daha adil bir şekilde haklı çıkar. Birlikte göndereceğiniz öğe sayısı arttıkça, daha iyi bir denge olacaktır.

Eğer özel öğeler, Vue'nun da kullanıldığı bir uygulamada kullanılacaksa, oluşturulan paket içinde Vue'yu harici olarak dışarıya aktararak öğelerin, ana uygulamadan aynı Vue kopyasını kullanmasını tercih edebilirsiniz.

Kullanıcılara bunları talep üzerine içe aktarma ve istenen etiket adlarıyla kaydetme esnekliği sunmak için bireysel öğe yapılarını dışa aktarmanızı öneririz. Ayrıca tüm öğeleri kaydetmek için otomatik olarak bir işlev dışa aktarabilirsiniz. İşte bir Vue özel öğe kütüphanesinin giriş noktası örneği:

```js
// elements.js

import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// bireysel öğeleri dışa aktar
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Bir kullanıcı öğeleri bir Vue dosyasında kullanabilir,

```vue
<script setup>
import { register } from 'path/to/elements.js'
register()
</script>

<template>
  <my-foo ...>
    <my-bar ...></my-bar>
  </my-foo>
</template>
```

Ya da JSX ile bir çerçevede veya özel adlar ile herhangi bir başka çerçevede:

```jsx
import { MyFoo, MyBar } from 'path/to/elements.js'

customElements.define('some-foo', MyFoo)
customElements.define('some-bar', MyBar)

export function MyComponent() {
  return <>
    <some-foo ...>
      <some-bar ...></some-bar>
    </some-foo>
  </>
}
```

### Vue Tabanlı Web Bileşenleri ve TypeScript {#web-components-and-typescript}

Vue SFC şablonları yazarken, Vue bileşenlerinizi, özel öğe olarak tanımlananlar da dahil olmak üzere, [tip kontrolü](https://guide/scaling-up/tooling.html#typescript) yapmak isteyebilirsiniz.

::note
Özel öğeler, tarayıcılarda yerleşik API'lerini kullanarak küresel olarak kaydedilir ve varsayılan olarak, Vue şablonlarında kullanıldıklarında tür çıkarımına sahip olmayacaklardır.
::

Vue bileşenleri özel öğeler olarak kaydedildiğinde tür desteği sağlamak için, Vue şablonları için [`GlobalComponents` arayüzünü](https://github.com/vuejs/language-tools/wiki/Global-Component-Types) artırarak küresel bileşen tiplerini kaydedebiliriz (JSX kullanıcıları bunun yerine [JSX.IntrinsicElements](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) tipini artırabilir, bu burada gösterilmemektedir).

Vue ile yapılan özel bir öğe için türü tanımlamak için şu şekilde yapabilirsiniz:

```typescript
import { defineCustomElement } from 'vue'

// Vue bileşenini içe aktarın.
import SomeComponent from './src/components/SomeComponent.ce.vue'

// Vue bileşenini Özel Öğeler sınıfına dönüştürün.
export const SomeElement = defineCustomElement(SomeComponent)

// Sınıf öğesini tarayıcıya kaydetmeyi unutmayın.
customElements.define('some-element', SomeElement)

// Yeni öğe türünü Vue'nun GlobalComponents türüne ekleyin.
declare module 'vue' {
  interface GlobalComponents {
    // Burada Vue bileşen türünü (SomeComponent, *SomeElement* değil) geçirdiğinizden emin olun.
    // Özel Öğeler adlarında bir tire gerektirir, bu nedenle burada tire ile ayrılmış öğe adını kullanın.
    'some-element': typeof SomeComponent
  }
}
```