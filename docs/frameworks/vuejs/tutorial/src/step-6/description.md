---
title: Koşullu Renderleme
seoTitle: Koşullu Renderleme - Vue.js Rehberi
sidebar_position: 4
description: Koşullu renderleme, Vue.jsde bileşenlerin belirli koşullar altında nasıl görüntüleneceğini kontrol etmeyi sağlar. Bu bölümde, v-if, v-else ve v-else-if direktiflerinin kullanımı açıklanır.
tags: 
  - Vue.js
  - Koşullu Renderleme
  - JavaScript
keywords: 
  - vue
  - koşullu renderleme
  - v-if
  - v-else
---
## Koşullu Renderleme {#conditional-rendering}

Elementi koşullu olarak renderlamak için `v-if` direktifini kullanabiliriz:

```vue-html
<h1 v-if="awesome">Vue harika!</h1>
```

> Bu `` sadece `awesome` değerinin [doğru](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) olması durumunda renderlanacaktır. Eğer `awesome` [yanlış](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) bir değer alırsa, DOM'dan kaldırılacaktır. — Vue.js Kılavuzu

Koşulun diğer dallarını belirtmek için `v-else` ve `v-else-if` de kullanabiliriz:

```vue-html
<h1 v-if="awesome">Vue harika!</h1>
<h1 v-else>Ah hayır 😢</h1>
```

:::tip
Şu anda, demo her iki ``'i de aynı anda gösteriyor ve buton hiçbir şey yapmıyor. Onlara `v-if` ve `v-else` direktiflerini eklemeyi deneyin ve butonu kullanarak aralarında geçiş yapabilmemiz için `toggle()` metodunu uygulayın.
:::

`v-if` hakkında daha fazla bilgi: `Rehber - Koşullu Renderleme`