---
title: Önerilen Öncelik C Kuralları
seoTitle: Önerilen Öncelik C Kuralları - Uygulama Geliştirme İpuçları
sidebar_position: 2
description: Bu belge, tutarlılık sağlamak için önerilen öncelik C kurallarını açıklar ve varsayılan seçenekler sunar. Topluluk standartları hakkında bilgi verir.
tags: 
  - Kodlama standartları
  - Vue.js
  - Uygulama geliştirme
keywords: 
  - önerilen kurallar
  - kod tutarlılığı
  - bileşenler
  - Vue
---
## Önerilen Öncelik C Kuralları {#priority-c-rules-recommended}

eşit derecede iyi birden fazla seçenek mevcut olduğu durumlarda, tutarlılığı sağlamak için keyfi bir seçim yapılabilir. Bu kurallarda, her bir kabul edilebilir seçeneği tanımlar ve varsayılan bir seçim öneririz. Bu, kendi kod tabanınızda farklı bir seçim yapma özgürlüğünüz olduğu anlamına gelir, yeter ki tutarlı olun ve mantıklı bir sebebiniz olsun. Ancak, gerçekten iyi bir sebebiniz olmalı! Topluluk standartlarına uyum sağladığınızda:

1. Karşılaştığınız topluluk kodunu daha kolay çözümlemeyi öğrenirsiniz.
2. Topluluğun kod örneklerini değiştirmeden kopyalayıp yapıştırabilirsiniz.
3. Yeni işe alımların, en azından Vue ile ilgili olarak, tercih ettiğiniz kodlama stiline alışık olduğunu sıkça görebilirsiniz.

:::tip
Kodunuzun tutarlılığını artırmak için bu kurallara uyun.
:::

## Bileşen/Örnek Seçenekleri Sırası {#component-instance-options-order}

**Bileşen/örnek seçenekleri tutarlı bir şekilde sıralanmalıdır.**

Bileşen seçenekleri için önerdiğimiz varsayılan sıradır. Kategorilere ayrılmışlardır, böylece eklentilerden yeni özellikler ekleyeceğiniz yeri bilirsiniz.

1. **Küresel Farkındalık** (bileşenden daha fazlasına dair bilgi gerektirir)

   - `name`

2. **Şablon Derleyici Seçenekleri** (şablonların derlenme şeklini değiştirir)

   - `compilerOptions`

3. **Şablon Bağımlılıkları** (şablonda kullanılan varlıklar)

   - `components`
   - `directives`

4. **Bileşim** (özellikleri seçeneklere birleştirir)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **Arayüz** (bileşene yönelik arayüz)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **Bileşim API'si** (Bileşim API'sini kullanma girişi)

   - `setup`

7. **Yerel Durum** (yerel reaktif özellikler)

   - `data`
   - `computed`

8. **Olaylar** (reaktif olaylar tarafından tetiklenen geri çağırmalar)

   - `watch`
   - Yaşam Döngüsü Olayları (çağrıldıkları sıraya göre)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **Reaktif Olmayan Özellikler** (reaktivite sisteminden bağımsız örnek özellikler)

   - `methods`

10. **Rendering** (bileşen çıktısının deklaratif tanımı)
    - `template`/`render`

:::info
Bu sıralama, komponentlerinizi daha anlaşılır ve yönetilebilir hale getirir.
:::

## Eleman Nitelikleri Sırası {#element-attribute-order}

**Elemanların (bileşenler de dahil) nitelikleri tutarlı bir şekilde sıralanmalıdır.**

Bileşen seçenekleri için önerdiğimiz varsayılan sıradır. Kategorilere ayrılmışlardır, böylece özel nitelikler ve direktifler ekleyeceğiniz yeri bilirsiniz.

1. **Tanım** (bileşen seçeneklerini sağlar)

   - `is`

2. **Liste Oluşturma** (aynı elemanın birden fazla varyasyonunu oluşturur)

   - `v-for`

3. **Koşullar** (elemanın render edilip edilmeyeceği)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Render Modifikatörleri** (elemanın nasıl render edildiğini değiştirir)

   - `v-pre`
   - `v-once`

5. **Küresel Farkındalık** (bileşenden daha fazlasına dair bilgi gerektirir)

   - `id`

6. **Eşsiz Nitelikler** (eşsiz değerler gerektiren nitelikler)

   - `ref`
   - `key`

7. **İki Yönlü Bağlama** (bağlamayı ve olayları birleştirme)

   - `v-model`

8. **Diğer Nitelikler** (tanımlanmamış bağlı ve bağlı olmayan tüm nitelikler)

9. **Olaylar** (bileşen event dinleyicileri)

   - `v-on`

10. **İçerik** (elemanın içeriğini geçersiz kılar)
    - `v-html`
    - `v-text`

:::note
Niteliklerin tutarlı bir şekilde sıralanması, kodunuzu daha okunabilir kılar.
:::

## Bileşen/Örnek Seçeneklerindeki Boş Satırlar {#empty-lines-in-component-instance-options}

**Çok satırlı özellikler arasında bir boş satır eklemek isteyebilirsiniz, özellikle de seçenekleriniz ekranınıza sığmayacak kadar daraldığında.**

Bileşenler sıkışık ya da okunması zor hale geldiğinde, çok satırlı özellikler arasında boşluk eklemek, tekrar göz atmayı kolaylaştırabilir. Bazı editörlerde, bu gibi biçimlendirme seçenekleri klavye ile gezinmeyi de kolaylaştırabilir.




Kötü

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```




İyi

```js
// Boşluk da uygundur, yeter ki bileşen
// hala okunabilir ve gezinilebilir olsun.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```








Kötü

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```




İyi

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```





## Tek Dosya Bileşeni Üst Düzey Eleman Sırası {#single-file-component-top-level-element-order}

**`Tek Dosya Bileşenleri`, ``, `` ve `` etiketlerini tutarlı bir şekilde, `` en sona gelecek şekilde sıralanmalıdır, çünkü diğer iki etiket her zaman birinden en az bir tanesi gereklidir.**


Kötü

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```




İyi

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```