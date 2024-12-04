---
title: Öncelikli A Kuralları Temel
seoTitle: Prioritized A Rules Essentials
sidebar_position: 1
description: Bu kurallar hataları önlemeye yardımcı olur, bu nedenle öğrenin ve her ne pahasına olursa olsun bunlara uyun. İstisnalar olabilir, ancak bunlar çok nadir olmalı.
tags: 
  - Vue
  - JavaScript
  - Bileşen
  - Geliştirme
keywords: 
  - Vue
  - JavaScript
  - Bileşen
  - Geliştirme
---
## Öncelikli A Kuralları: Temel {#priority-a-rules-essential}

Bu kurallar hataları önlemeye yardımcı olur, bu nedenle öğrenin ve her ne pahasına olursa olsun bunlara uyun. İstisnalar olabilir, ancak bunlar çok nadir olmalı ve yalnızca JavaScript ve Vue hakkında uzman bilgisi olan kişiler tarafından yapılmalıdır.

## Çok Kelimeli Bileşen İsimleri Kullan {#use-multi-word-component-names}

Kullanıcı bileşen isimleri her zaman çok kelimeli olmalıdır, kök `App` bileşenleri hariç. Bu, mevcut ve gelecekteki HTML öğeleri ile çakışmaları [önler](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name), zira tüm HTML öğeleri tek kelimeden oluşur.


Kötü

```vue-html
<!-- önceden derlenmiş şablonlarda -->
<Item />

<!-- DOM içi şablonlarda -->
<item></item>
```




İyi

```vue-html
<!-- önceden derlenmiş şablonlarda -->
<TodoItem />

<!-- DOM içi şablonlarda -->
<todo-item></todo-item>
```



## Ayrıntılı Prop Tanımları Kullan {#use-detailed-prop-definitions}

Taahhüt edilmiş kodda, prop tanımları her zaman olabildiğince ayrıntılı olmalı ve en azından tür(ler) ile belirtilmelidir.

::: details Ayrıntılı Açıklama
Ayrıntılı `prop tanımları` iki avantaj sağlar:

- Bileşenin API'sini belgeler, böylece bileşenin nasıl kullanılması gerektiğini görmek kolaydır.
- Geliştirme sırasında, Vue bileşen hiç yanlış formatlanmış props sağlanırsa sizi uyarır ve potansiyel hata kaynaklarını yakalamanıza yardımcı olur.
:::




Kötü

```js
// Bu yalnızca prototipleme sırasında kabul edilir
props: ['status']
```




İyi

```js
props: {
  status: String
}
```

```js
// Daha da iyi!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```








Kötü

```js
// Bu yalnızca prototipleme sırasında kabul edilir
const props = defineProps(['status'])
```




İyi

```js
const props = defineProps({
  status: String
})
```

```js
// Daha da iyi!

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```





## Anahtar `v-for` Kullan {#use-keyed-v-for}

`key` ile `v-for` bileşenlerde _her zaman_ gereklidir, böylece iç bileşen durumu alt ağaçta korunur. Ancak, ögeler için de, animasyonlarda [nesne sürekliliği](https://bost.ocks.org/mike/constancy/) gibi öngörülebilir davranışı korumak için iyi bir uygulamadır.

::: details Ayrıntılı Açıklama
Diyelim ki bir görev listesiniz var:



```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'v-for kullanmayı öğren'
      },
      {
        id: 2,
        text: 'anahtar kullanmayı öğren'
      }
    ]
  }
}
```





```js
const todos = ref([
  {
    id: 1,
    text: 'v-for kullanmayı öğren'
  },
  {
    id: 2,
    text: 'anahtar kullanmayı öğren'
  }
])
```



Sonra bunları alfabetik olarak sıralıyorsunuz. DOM'u güncellerken, Vue, en ucuz DOM değişikliklerini gerçekleştirmek için render işlemine optimize eder. Bu, ilk görev ögesinin silinmesi ve sonra listenin sonuna tekrar eklenmesi anlamına gelebilir.

Sorun, DOM'da kalacak öğeleri silmemek için önemli olabilecek durumların olmasıdır. Örneğin,  kullanarak liste sıralamasını animasyon yapmayı ya da oluşturulan öge bir  ise odaklanmayı korumak isteyebilirsiniz. Bu durumlarda, her bir öğe için benzersiz bir anahtar eklemek (örneğin `:key="todo.id"`) Vue'ya nasıl davranması gerektiğini daha öngörülebilir bir şekilde söyleyecektir.

Tecrübemizde, her zaman benzersiz bir anahtar eklemek daha iyidir, böylece siz ve ekibiniz bu kenar durumları hakkında endişelenmek zorunda kalmazsınız. Nadiren, performans açısından kritik senaryolar varsa, nesne sürekliliği gerekli değilse, bilinçli bir istisna yapabilirsiniz.
:::


Kötü

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```




İyi

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```



## `v-for` ile `v-if` Kullanımını Kaçının {#avoid-v-if-with-v-for}

**`v-if` direktifini asla `v-for` ile aynı öğede kullanmayın.**

Bu, iki yaygın durumda cazip olabilir:

- Bir listede öğeleri filtrelemek için (örneğin, `v-for="user in users" v-if="user.isActive"`). Bu durumda, `users`'ı filtrelenmiş listenizi döndüren yeni bir hesaplanan özellik ile değiştirin (örneğin, `activeUsers`).
  
- Bir listeyi render etmekten kaçınmak için, eğer gizlenmesi gerekiyorsa (örneğin, `v-for="user in users" v-if="shouldShowUsers"`). Bu durumda, `v-if`'i bir kapsayıcı öğeye (örneğin, `ul`, `ol`) taşıyın.

::: details Ayrıntılı Açıklama
Vue direktiflerini işlerken, `v-if`'in `v-for`'dan daha yüksek bir önceliği vardır, bu nedenle bu şablon:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Hata verecektir, çünkü `v-if` direktifi önce değerlendirilecektir ve döngü değişkeni `user` bu anda mevcut değildir.

Bu, hesaplanan bir özellik üzerinde tekrarlayarak düzeltilebilir:



```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```





```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```



```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Alternatif olarak, `` öğesini sarmak için `v-for` ile bir `` etiketi kullanabiliriz:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::


Kötü

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```




İyi

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```



## Bileşen-Diğer Stil Kullan {#use-component-scoped-styling}

Uygulamalar için, üst düzey `App` bileşenindeki ve yerleşim bileşenlerindeki stil global olabilir, ancak diğer tüm bileşenler her zaman kapsamlı olmalıdır.

Bu, `Tekli Dosya Bileşenleri` için yalnızca geçerlidir. [`scoped` attribute](https://vue-loader.vuejs.org/guide/scoped-css.html) kullanımını gerektirmez. Kapsama, [CSS modülleri](https://vue-loader.vuejs.org/guide/css-modules.html), [BEM](http://getbem.com/) gibi sınıf tabanlı bir strateji veya başka bir kütüphane/gelenek yoluyla sağlanabilir.

**Ancak, bileşen kütüphaneleri `scoped` özniteliğini kullanmaktansa sınıf tabanlı bir strateji tercih etmelidir.**

Bu, dahili stilleri ezmeyi kolaylaştırır, insan tarafından okunabilir sınıf adları ile, bu adların çok yüksek spesifikliği yoktur, ama yine de bir çakışmayı sonuçlandırmak için çok düşük bir ihtimalle karşı karşıya kalır.

::: details Ayrıntılı Açıklama
Büyük bir proje geliştiriyorsanız, diğer geliştiricilerle çalışıyorsanız veya bazen 3. taraf HTML/CSS (örneğin, Auth0'dan) ekliyorsanız, tutarlı kapsama stillerinizin yalnızca hedef bileşenlere uygulandığından emin olur.

`scoped` özniteliğinin ötesinde, benzersiz sınıf adları kullanmak, 3. taraf CSS'nin kendi HTML'nize uygulanmadığından emin olmanıza yardımcı olabilir. Örneğin, birçok proje `button`, `btn` veya `icon` sınıf adlarını kullanır, bu nedenle BEM gibi bir strateji kullanmasanız bile, uygulama-spesifik ve/veya bileşen-spesifik bir ön ek eklemek (örneğin, `ButtonClose-icon`) bazı korumalar sağlayabilir.
:::


Kötü

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```




İyi

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- `scoped` özniteliğini kullanarak -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- CSS modüllerini kullanarak -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- BEM konvansiyonunu kullanarak -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```