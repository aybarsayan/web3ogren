---
title: Özellik Bağlama
seoTitle: Özellik Bağlama - Vue Direktifleri ve Dinamik Değerler
sidebar_position: 4
description: Vuede özellik bağlama yöntemlerini keşfedin. Bu yazıda, v-bind direktifi ve dinamik değerlerle ilgili önemli detaylar bulunmaktadır.
tags: 
  - Vue
  - direktif
  - özellik bağlama
  - JavaScript
keywords: 
  - Vue
  - v-bind
  - direktif
  - dinamik değer
  - özellik
---
## Özellik Bağlama {#attribute-bindings}

Vue'de süslü parantezler yalnızca metin araştırması için kullanılır. Dinamik bir değere bir niteliği bağlamak için `v-bind` direktifini kullanırız:

```vue-html
<div v-bind:id="dynamicId"></div>
```

Bir **direktif**, `v-` ön eki ile başlayan özel bir niteliktir. Vue'nun şablon sözdiziminin bir parçasıdır. Metin araştırmasına benzer şekilde, direktif değerleri bileşenin durumuna erişimi olan JavaScript ifadeleridir. `v-bind` ve direktif sözdiziminin tam detayları hakkında Kılavuz - Şablon Sözdizimi bölümünde konuşulmaktadır.

**İlk iki noktalama işaretinden sonraki kısım** (`:id`), direktifin "argümanı"dır. Burada, öğenin `id` niteliği, bileşenin durumundaki `dynamicId` özelliği ile senkronize edilecektir.

```vue-html
<div :id="dynamicId"></div>
```

`v-bind` sıkça kullanıldığından, ona özel bir kısayol sözdizimi vardır:

:::tip
`v-bind` direktifinin kısayolunu kullanarak daha temiz ve okunabilir kod yazabilirsiniz.
:::

Şimdi, `` etiketine dinamik bir `class` bağlamaya çalışın, bu bağlamanın değeri olarak `titleClass` veri özelliğiref kullanın. Eğer doğru bir şekilde bağlanmışsa, metin kırmızıya dönecektir.