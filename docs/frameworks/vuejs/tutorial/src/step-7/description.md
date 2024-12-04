---
title: Liste Renderleme
seoTitle: Liste Renderleme - Vue.js
sidebar_position: 4
description: Bu sayfada, bir kaynak diziye dayanarak öğeleri render etmek için v-for direktifinin kullanımı açıklanmaktadır. Ayrıca liste güncelleme yöntemleri de ele alınmaktadır.
tags: 
  - Vue.js
  - Direktifler
  - Liste Renderleme
  - Geliştirme
keywords: 
  - Vue.js
  - v-for
  - list rendering
  - gelişim
---
## Liste Renderleme {#list-rendering}

Bir kaynak diziye dayanarak bir dizi öğeyi render etmek için `v-for` direktifini kullanabiliriz:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Burada `todo`, şu anda üzerinde geçiş yapılan dizi elemanını temsil eden yerel bir değişkendir. Sadece `v-for` öğesi ya da içinde erişilebilir, bir fonksiyon kapsamına benzer.

:::info
Her todo nesnesine benzersiz bir `id` verdiğimizi ve bunu her `` için `özel `key` özniteliği` olarak bağladığımızı unutmayın. `key`, Vue'nun her ``'yi dizideki karşılık gelen nesnesinin konumuna göre doğru bir şekilde taşınmasını sağlar.
:::

Listeyi güncellemenin iki yolu vardır:

1. Kaynak dizi üzerinde [değiştirme yöntemlerini](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) çağırmak:

   

   ```js
   todos.value.push(newTodo)
   ```

   
   

   ```js
   this.todos.push(newTodo)
   ```

   

2. Diziyi yeni bir dizi ile değiştirmek:

   

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

   
   

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   

Burada basit bir todo listemiz var - **`addTodo()`** ve **`removeTodo()`** yöntemleri için mantığı uygulamayı deneyin!

:::tip
`v-for` hakkında daha fazla ayrıntı için: `Kılavuz - Liste Renderleme`
:::