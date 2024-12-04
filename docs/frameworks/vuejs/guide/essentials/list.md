---
title: Liste Görselleştirme
seoTitle: Vue.js Liste Görselleştirme
sidebar_position: 4
description: Vue.js uygulamalarında liste görselleştirmenin temel özelliklerini açıklayan bir kılavuz. v-for direktifi kullanarak nasıl dinamik listeler oluşturulacağını öğrenin.
tags: 
  - Vue.js
  - Liste Görselleştirme
  - v-for
  - Reaktif Programlama
keywords: 
  - Vue.js
  - liste
  - v-for
  - programlama
  - web geliştirme
---
## Liste Görselleştirme {#list-rendering}


  



  


## `v-for` {#v-for}

:::info Açıklama
`v-for` direktifini, bir diziye dayalı olarak bir liste ögesini oluşturmak için kullanabiliriz. `v-for` direktifi, `item in items` biçiminde özel bir sözdizimi gerektirir, burada `items` kaynak veri dizisi ve `item` geçiş yapılan dizi elemanı için bir **takma ad**dır.
:::



```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```





```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```



```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

`v-for` kapsamı içinde, şablon ifadeleri tüm üst kapsam özelliklerine erişim sağlar. Ayrıca, `v-for` mevcut öğenin indeksine karşılık gelen isteğe bağlı ikinci bir takma adı da destekler:



```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```




```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```



```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```


const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]


  
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  




[Denemek İçin Oynatma Alanında](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)




[Denemek İçin Oynatma Alanında](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)



`v-for`'un değişken kapsamı, aşağıdaki JavaScript'e benzer:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // dış kapsam `parentMessage`'e erişime sahiptir
  // ancak `item` ve `index` yalnızca burada kullanılabilir
  console.log(parentMessage, item.message, index)
})
```

> **Not:** Görüldüğü gibi, `v-for` değeri `forEach` geri çağırma işlevinin imzasıyla eşleşiyor. Aslında, `v-for` öğe takma adı üzerinde yapılandırmayı benzer şekilde kullanabilirsiniz:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- indeks takma adı ile -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

İç içe `v-for` için, kapsam da iç içe fonksiyonlar gibi çalışır. Her `v-for` kapsamı, üst kapsam erişimine sahiptir:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Ayrıca `in` yerine `of` kullanarak ayırıcı olarak kullanabileceğiniz bir seçenek vardır, böylece JavaScript'in yineleyiciler için sözdizimine daha yakın olur:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` ile Obje {#v-for-with-an-object}

`v-for`'u bir nesnenin özelliklerini döngüye almak için de kullanabilirsiniz. Döngü sırası, nesne üzerindeki `Object.values()` çağrısının sonucuna dayalı olacaktır:



```js
const myObject = reactive({
  title: 'Vue\'da listeler nasıl yapılır',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```




```js
data() {
  return {
    myObject: {
      title: 'Vue\'da listeler nasıl yapılır',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```



```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Ayrıca, nesnenin adını (yaklaşık anahtar) karşılık gelen ikinci bir takma ad da sağlayabilirsiniz:

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

Ve bir indeks için başka bir takma ad:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```



[Denemek İçin Oynatma Alanında](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)




[Denemek İçin Oynatma Alanında](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)



## `v-for` ile Bir Aralık {#v-for-with-a-range}

`v-for` bir tam sayı da alabilir. Bu durumda, `1...n` aralığına dayanarak şablonu bu kadar çok kez tekrarlayacaktır.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Burada `n`, `0` yerine `1` başlangıç değeri ile başlar.

## `v-for` ile `` {#v-for-on-template}

Şablon `v-if`'e benzer şekilde, birden fazla öğenin oluşturulması için `v-for` ile bir `` etiketi de kullanabilirsiniz. Örneğin:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` ile `v-if` {#v-for-with-v-if}

:::warning Not
`v-if` ve `v-for`'u aynı öğede kullanmak önerilmez çünkü örtük öncelik vardır. Daha fazla bilgi için `stil kılavuzuna` bakınız.
:::

Aynı düğümde bulunduklarında, `v-if`'in `v-for`'dan daha yüksek bir önceliği vardır. Bu, `v-if` koşulunun `v-for`'un kapsamındaki değişkenlere erişemeyeceği anlamına gelir:

```vue-html
<!--
Bu, "todo" özelliği belirtilmediği için bir hata verecektir.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Bu, `v-for`'u sarıcı bir `` etiketine taşımakla (bu da daha açıktır) düzeltilir:

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## `key` ile Durumu Koruma {#maintaining-state-with-key}

Vue, `v-for` ile oluşturulan bir öğeler listesini güncellerken, varsayılan olarak "yerinde tamir" stratejisi kullanır. Veri öğelerinin sırası değiştiğinde, Vue, öğelerin sırasını eşleştirmek için DOM öğelerini taşımak yerine, her öğeyi yerinde yamanız ve belirli bir indeksin ne şekilde oluşturulması gerektiğini yansıtması için güncellemektedir.

Bu varsayılan mod verimli olmasına rağmen, **yalnızca listeniz oluşturma çıkışı çocuk bileşen durumuna veya geçici DOM durumuna (örneğin, form girdi değerleri) dayanmadığında uygundur.**

Vue'ya her düğümün kimliğini izleyebileceği ve böylece mevcut öğeleri yeniden kullanabileceği ve sıralayabileceği bir ipucu vermek için, her seçenek için benzersiz bir `key` niteliği sağlamanız gerekir:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- içerik -->
</div>
```

`` kullanırken, `key`'in `` konteynerine yerleştirilmesi gerekir:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Not
`key` burada `v-bind` ile bağlanan özel bir niteliğidir. `Bir nesne ile `v-for` kullanıldığında` özelliği anahtar değişkeni ile karıştırılmamalıdır.
:::

`Önerilmektedir` `v-for` ile mümkün olduğunda bir `key` niteliği sağlamak, iter edilen DOM içeriği basit (yani bileşen veya durum saklayan DOM öğesi içermiyor) olmadığında ya da varsayılan davranıştan performans kazançları için bilerek yararlanıyorsanız kolaydır.

`key` bağlaması, ilkel değerleri - yani dizeleri ve sayıları bekler. `v-for` anahtarları olarak nesneleri kullanmayın. `key` niteliğinin detaylı kullanımı için lütfen `key` API belgelerine` bakınız.

## `v-for` ile Bir Bileşen {#v-for-with-a-component}

> Bu bölüm `Bileşenleri` bilginiz olduğunu varsayar. Geçmekte özgürsünüz ve daha sonra geri dönebilirsiniz.

Bir bileşen üzerinde `v-for`'u, normal bir öğe gibi doğrudan kullanabilirsiniz (bir `key` sağlamayı unutmayın):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

Ancak bu, bileşene otomatik olarak herhangi bir veri geçirmez, çünkü bileşenlerin kendi izole kapsamları vardır. Geçiş yapılan verileri bileşene iletmek için, `props` kullanmalıyız:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

Bileşene `item` verilmemesinin sebebi, bileşenin `v-for`'un işleyişine sıkı bağlı olmasını sağlamak içindir. Verinin nereden geldiği konusunda açıklık sağlamak, bileşenin başka durumlarda yeniden kullanılabilir olmasını sağlar.



Bu [basit bir yapılacaklar listesi](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=) örneğine göz atabilirsiniz, bu sayede `v-for` kullanarak bileşenlerin nasıl oluşturulduğunu ve her örneğe farklı verilerin nasıl geçirileceğini görebilirsiniz.




Bu [basit bir yapılacaklar listesi](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=) örneğine göz atabilirsiniz, bu sayede `v-for` kullanarak bileşenlerin nasıl oluşturulduğunu ve her örneğe farklı verilerin nasıl geçirileceğini görebilirsiniz.



## Dizi Değişiklik Algılama {#array-change-detection}

### Değiştirme Yöntemleri {#mutation-methods}

Vue, reaktif bir dizinin değişim yöntemlerinin çağrıldığını algılayabilir ve gerekli güncellemeleri tetikleyebilir. Bu değişim yöntemleri şunlardır:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Bir Diziyi Değiştirme {#replacing-an-array}

Değiştirme yöntemleri, adından da anlaşılacağı gibi, çağrıldıkları orijinal diziyi değiştirir. Karşılaştırıldığında, `filter()`, `concat()` ve `slice()` gibi değişim yapmayan yöntemler vardır ve bu yöntemler mevcut diziyi değiştirmez, ancak **her zaman yeni bir dizi döner**. Değiştirmeyen yöntemlerle çalışırken, eski diziyi yeni dizi ile değiştirmemiz gerekir:



```js
// `items` dizi değerine sahip bir referanstır
items.value = items.value.filter((item) => item.message.match(/Foo/))
```




```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```



Bunun, Vue'nun mevcut DOM'u atmasına ve tüm listeyi yeniden oluşturmasına neden olacağını düşünebilirsiniz - neyse ki bu böyle değildir. Vue, DOM öğelerinin yeniden kullanımını maksimize etmek için bazı akıllı heuristikler uygular, bu nedenle, üst üste binen nesneleri içeren bir diziyi başka bir dizi ile değiştirmek çok verimli bir işlemdir.

## Filtrelenmiş/Sıralanmış Sonuçları Gösterme {#displaying-filtered-sorted-results}

Bazen, orijinal veriyi gerçekten değiştirmeden veya sıfırlamadan bir dizinin filtrelenmiş veya sıralanmış bir versiyonunu göstermek isteriz. Bu durumda, filtrelenmiş veya sıralanmış diziyi döndüren bir hesaplanan özellik oluşturabilirsiniz.

Örneğin:



```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```




```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```



```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

Hesaplanan özelliklerin mümkün olmadığı durumlarda (örneğin iç içe `v-for` döngülerinde) bir yöntem kullanabilirsiniz:



```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```




```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```



```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Hesaplanan bir özellikte `reverse()` ve `sort()` ile dikkatli olun! Bu iki yöntem, orijinal diziyi değiştirecektir, bu nedenle hesaplanan getterlarda kaçınılmalıdır. Bu yöntemleri çağırmadan önce orijinal dizinin bir kopyasını oluşturun:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()