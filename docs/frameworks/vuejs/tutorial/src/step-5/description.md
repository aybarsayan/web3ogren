---
title: Form Bağlantıları
seoTitle: Form Bağlantıları - Vue Kullanımı
sidebar_position: 4
description: Bu bölümde, Vue.js ile form bağlantılarının nasıl yapılacağını öğrenin. İki yönlü veri bağlama ve v-model direktifi hakkında bilgi edinin.
tags: 
  - Vue
  - Form Bağlantıları
  - v-bind
  - v-on
  - v-model
keywords: 
  - Vue
  - form binding
  - two-way binding
  - v-model
  - text input
---
## Form Bağlantıları {#form-bindings}

`v-bind` ve `v-on` kullanarak, form giriş elemanları üzerinde iki yönlü bağlantılar oluşturabiliriz:

```vue-html
<input :value="text" @input="onInput">
```



```js
methods: {
  onInput(e) {
    // bir v-on işleyicisi, yerel DOM olayını
    // argüman olarak alır.
    this.text = e.target.value
  }
}
```





```js
function onInput(e) {
  // bir v-on işleyicisi, yerel DOM olayını
  // argüman olarak alır.
  text.value = e.target.value
}
```



Giriş kutusuna yazmayı deneyin - yazdıkça `` içeriğinin güncellendiğini görmelisiniz.

:::tip
İki yönlü bağlantıları basitleştirmek için, Vue `v-model` adında bir direktif sağlar; bu, yukarıdakilerin aslında sözdizimsel şeklidir:
:::

```vue-html
<input v-model="text">
```

`v-model` otomatik olarak `` değerini bağlanan durum ile senkronize eder, böylece bunun için artık bir olay işleyicisine ihtiyaç duyulmaz.

`v-model`, sadece metin girişleri için değil, aynı zamanda onay kutuları, radyo düğmeleri ve seçim açılır menüleri gibi diğer giriş türleri için de çalışır. Daha fazla ayrıntıyı Rehber - Form Bağlantıları bölümünde ele alıyoruz.

:::info
Şimdi, kodu `v-model` kullanacak şekilde yeniden düzenlemeyi deneyin.
:::