---
title: Bileşen Kaydı
seoTitle: Vue Bileşen Kaydı
sidebar_position: 4
description: Bu sayfa, Vue bileşenlerinin kaydedilmesi ile ilgili bilgileri içerir. Hem küresel hem de yerel kayıt yöntemlerini açıklamaktadır.
tags: 
  - vue
  - bileşen
  - geliştirme
  - uygulama
keywords: 
  - vue.js
  - bileşen kaydı
  - küresel kayıt
  - yerel kayıt
---
## Bileşen Kaydı {#component-registration}

> Bu sayfa, `Bileşen Temelleri` kısmını okuduğunuzu varsayıyor. Bileşenlere yeniyseniz önce orayı okuyun.



Bir Vue bileşeninin "kaydedilmesi" gerekir ki Vue, bir şablonda karşılaştığında uygulanabilirliğini nerede bulacağını bilsin. Bileşenleri kaydetmenin iki yolu vardır: küresel ve yerel.

## Küresel Kayıt {#global-registration}

Bileşenleri mevcut `Vue uygulaması` içinde küresel olarak kullanılabilir hale getirebiliriz `.component()` yöntemini kullanarak:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // kaydedilen isim
  'MyComponent',
  // uygulama
  {
    /* ... */
  }
)
```

SFC'ler kullanıyorsanız, içe aktarılmış `.vue` dosyalarını kaydediyor olacaksınız:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

`.component()` yöntemi zincirleme olarak kullanılabilir:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Küresel olarak kayıtlı bileşenler, bu uygulama içindeki herhangi bir bileşenin şablonunda kullanılabilir:

```vue-html
<!-- bu, uygulama içindeki herhangi bir bileşende çalışacaktır -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

Bu, tüm alt bileşenler için de geçerlidir; yani bu üç bileşenin hepsi de _birbirlerinin içinde_ kullanılabilir olacaktır.

## Yerel Kayıt {#local-registration}

Kullanışlı olmakla birlikte, küresel kaydın bazı dezavantajları vardır:

1. Küresel kayıt, kullanılmayan bileşenleri (yani "ağaç sarsma") kaldırma sistemlerini engeller. Eğer bir bileşeni küresel olarak kaydettiniz fakat uygulamanızda hiçbir yerde kullanmadıysanız, yine de son paket içerisinde yer alır.

2. Küresel kayıt, büyük uygulamalarda bağımlılık ilişkilerini daha az belirgin hale getirir. Bu, bir sunucu bileşenin uygulamasını bulmayı zorlaştırır. Bu, çok fazla küresel değişken kullanıma benzer şekilde uzun vadeli bakım kolaylığını etkileyebilir.

:::tip
Yerel kayıt, kaydedilen bileşenlerin erişilebilirliğini yalnızca mevcut bileşenle sınırlar. Bu, bağımlılık ilişkisini daha belirgin hale getirir ve ağaç sarsma dostudur.
:::



`` ile SFC kullanırken, içe aktarılan bileşenler kaydetmeden yerel olarak kullanılabilir:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

`` olmayan yerlerde, `components` seçeneğini kullanmanız gerekecek:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```




Yerel kayıt, `components` seçeneğini kullanarak yapılır:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```



`components` nesnesindeki her özellik için anahtar, bileşenin kaydedilen adı olacaktır, değeri ise bileşenin uygulanabilirliğini içerecektir. Yukarıdaki örnek, ES2015 özellik kısaltmasını kullanmakta olup şu şekilde de ifade edilebilir:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Dikkat edin ki **yerel olarak kayıtlı bileşenler, alt bileşenlerde _değil_ de geçerlidir**. Bu durumda, `ComponentA` yalnızca mevcut bileşene erişilebilir olacaktır, çocuk veya alt bileşenlerine değil.

## Bileşen Adı Yazım Kuralları {#component-name-casing}

Kılavuz boyunca bileşenleri kaydederken PascalCase adları kullanıyoruz. Bunun nedeni:

1. PascalCase adları geçerli JavaScript tanımlayıcılarıdır. Bu, bileşenleri JavaScript'te içe aktarmayı ve kaydetmeyi kolaylaştırır. Ayrıca IDE'lerin otomatik tamamlama işlevine yardımcı olur.

2. ``, şablonlarda bunun bir Vue bileşeni olduğunu gösterir, yerel HTML öğesinden farklı olduğunu belirginleştirir. Ayrıca, Vue bileşenlerini özel öğelerden (web bileşenleri) ayırır.

:::info
Bu, SFC veya dize şablonları ile çalışırken önerilen stildir. Ancak, `DOM İçinde Şablon Ayrıştırma Durumları` kısmında tartışıldığı gibi, PascalCase etiketler DOM içindeki şablonlarda kullanılamıyor.
:::

Neyse ki, Vue, kebab-case etiketlerini PascalCase ile kaydedilen bileşenlere çözümleme desteği sağlamaktadır. Bu, `MyComponent` olarak kaydedilen bir bileşenin hem `` hem de `` aracılığıyla şablonda referans alınabileceği anlamına gelir. Bu, şablon kaynağından bağımsız olarak aynı JavaScript bileşeni kayıt kodunu kullanmamıza olanak tanır.