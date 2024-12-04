---
title: Vue Uygulaması Oluşturma
seoTitle: Vue Application Creation
sidebar_position: 1
description: Bu kılavuzda, Vue uygulamalarının nasıl oluşturulacağını ve uygulama örneği ve kök bileşen gibi temel kavramları keşfedeceğiz.
tags: 
  - Vue
  - Uygulama Geliştirme
  - web geliştirme
keywords: 
  - Vue.js
  - uygulama örneği
  - kök bileşen
  - geliştirme
---
## Vue Uygulaması Oluşturma {#creating-a-vue-application}

## Uygulama Örneği {#the-application-instance}

Her Vue uygulaması, yeni bir **uygulama örneği** oluşturmakla başlar ve bu işlem `createApp` fonksiyonu ile gerçekleştirilir:

```js
import { createApp } from 'vue'

const app = createApp({
  /* kök bileşen seçenekleri */
})
```

## Kök Bileşen {#the-root-component}

`createApp` fonksiyonuna göndereceğimiz nesne aslında bir bileşendir. Her uygulama, diğer bileşenleri çocuk olarak içerebilen bir "kök bileşen" gerektirir.

Eğer Tek Dosya Bileşenleri kullanıyorsanız, genellikle kök bileşeni başka bir dosyadan içe aktarırız:

```js
import { createApp } from 'vue'
// Tek dosya bileşeni olan App'ten kök bileşeni içe aktarın.
import App from './App.vue'

const app = createApp(App)
```


Bu kılavuzdaki birçok örnek yalnızca tek bir bileşene ihtiyaç duysa da, çoğu gerçek uygulama, iç içe geçmiş, yeniden kullanılabilir bileşenlerden oluşan bir ağaç yapısında organize edilmiştir. Örneğin, bir Todo uygulamasının bileşen ağacı şöyle görünür:

Bileşen Ağaç Yapısı

```
App (kök bileşen)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

:::

Kılavuzun ilerleyen bölümlerinde, birden fazla bileşeni nasıl tanımlayıp birleştireceğimizi tartışacağız. Bunun öncesinde, tek bir bileşenin içinde neler olduğunu odaklanacağız.

## Uygulamayı Montajlama {#mounting-the-app}

Bir uygulama örneği, `.mount()` metodu çağrılmadığı sürece hiçbir şey render etmeyecektir. Bir "container" argümanı bekler; bu, ya gerçek bir DOM elementi ya da bir seçici dizesi olabilir:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

Uygulamanın kök bileşeninin içeriği, container elementinin içinde render edilecektir. Container elementi kendisi uygulamanın bir parçası olarak kabul edilmez.

`.mount()` yöntemi, tüm uygulama yapılandırmaları ve varlık kayıtları tamamlandıktan sonra çağrılmalıdır. Ayrıca, döndürdüğü değerin, varlık kayıt yöntemlerinden farklı olarak, uygulama örneği yerine kök bileşen örneği olduğunu not ediniz.

### DOM İçindeki Kök Bileşen Şablonu {#in-dom-root-component-template}

Kök bileşenin şablonu genellikle bileşenin kendisinin bir parçasıdır, ancak şablonu ayrıca doğrudan montaj konteynerinin içine yazarak ayrı olarak sağlamak da mümkündür:

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

Vue, kök bileşeninde zaten bir `template` seçeneği yoksa otomatik olarak container'ın `innerHTML`'sini şablon olarak kullanacaktır.

DOM içindeki şablonlar, `Vue'yu bir yapım adımı olmadan kullanma` durumunda uygulamalarda sıklıkla kullanılır. Ayrıca, kök şablonun sunucu tarafından dinamik olarak üretilebileceği sunucu tarafı çerçeveleri ile bir arada da kullanılabilirler.

## Uygulama Yapılandırmaları {#app-configurations}

Uygulama örneği, birkaç uygulama düzeyi seçeneğini yapılandırmamıza olanak tanıyan bir `.config` nesnesi sağlar. Örneğin, tüm alt bileşenlerden gelen hataları yakalayan bir uygulama düzeyindeki hata işleyicisi tanımlayabiliriz:

```js
app.config.errorHandler = (err) => {
  /* hatayı ele al */
}
```

Uygulama örneği, uygulama kapsamındaki varlıkları kaydetmek için birkaç yöntem de sunar. Örneğin, bir bileşeni kaydetmek için:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Bu, `TodoDeleteButton`'ı uygulamamızın her yerinde kullanılabilir hale getirir. Bileşenlerin ve diğer varlık türlerinin kaydı hakkında daha fazla bilgiyi kılavuzun ilerleyen bölümlerinde tartışacağız. Uygulama örneği API'lerinin tam listesine de `API referansı` içerisinden ulaşabilirsiniz.

Uygulamayı montajlamadan önce tüm uygulama yapılandırmalarını uyguladığınızdan emin olun!

## Birden Fazla Uygulama Örneği {#multiple-application-instances}

Aynı sayfada yalnızca tek bir uygulama örneği ile sınırlı değilsiniz. `createApp` API'si, her biri kendi yapılandırma ve küresel varlık alanına sahip birden fazla Vue uygulamasının aynı sayfada bir arada bulunmasına olanak tanır:

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

:::warning
Eğer Vue'yu sunucu tarafından render edilen HTML'yi geliştirmek için kullanıyorsanız ve yalnızca büyük bir sayfanın belirli kısımlarını kontrol etmek için Vue'ya ihtiyaç duyuyorsanız, tüm sayfanın üzerine tek bir Vue uygulama örneği monte etmekten kaçının. Bunun yerine, sorumlu oldukları öğelere montajlamak için birden fazla küçük uygulama örneği oluşturun.
:::