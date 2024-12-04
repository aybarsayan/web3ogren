---
title: SFC CSS Özellikleri
seoTitle: SFC CSS Features
sidebar_position: 4
description: Bu içerik, Scopd CSS, CSS Modülleri ve ilgili ipuçları gibi SFC CSS özelliklerini kapsamlı bir şekilde ele almaktadır. Modern bileşen yapısında stil yönetimi için önemli bilgiler sunar.
tags: 
  - Vue
  - CSS
  - SCSS
  - web development
keywords: 
  - "SFC"
  - "CSS Modülleri"
  - "scoped CSS"
  - "vue component"
---
## SFC CSS Özellikleri {#sfc-css-features}

## Scoped CSS {#scoped-css}

Bir `` etiketi `scoped` niteliğine sahipse, CSS'i yalnızca mevcut bileşenin öğelerine uygulanır. Bu, Shadow DOM'da bulunan stil kapsüllemeye benzerdir. Bazı kısıtlamaları vardır, ancak herhangi bir polifill gerektirmez. Aşağıdakileri dönüştürmek için PostCSS kullanılarak elde edilir:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

Aşağıdaki şekilde dönüştürülür:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### Çocuk Bileşen Kök Öğeleri {#child-component-root-elements}

`scoped` ile, üst bileşenin stilleri çocuk bileşenlere sızmaz. Ancak, bir çocuk bileşenin kök düğümü, hem üst bileşenin scoped CSS'sinden hem de çocuğun scoped CSS'sinden etkilenir. Bu, üst bileşenin çocuk kök öğesini düzenleme amaçları için stillendirebilmesi için tasarlanmıştır.

### Derin Seçiciler {#deep-selectors}

`scoped` stillerde bir seçicinin "derin" olmasını, yani çocuk bileşenleri etkilemesini istiyorsanız, `:deep()` psödo-sınıfını kullanabilirsiniz:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

Yukarıdaki, şu şekilde derlenir:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
`v-html` ile oluşturulan DOM içeriği scoped stillerden etkilenmez, ancak yine de derin seçiciler kullanarak stillendirebilirsiniz.
:::

### Slotlu Seçiciler {#slotted-selectors}

Varsayılan olarak, scoped stiller `` ile render edilen içerikleri etkilemez, çünkü bunlar üst bileşen tarafından sahiplenilen öğeler olarak kabul edilir. Slot içeriğini açıkça hedeflemek için `:slotted` psödo-sınıfını kullanın:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Küresel Seçiciler {#global-selectors}

Sadece bir kuralın evrensel olarak uygulanmasını istiyorsanız, başka bir `` oluşturmaktansa `:global` psödo-sınıfını kullanabilirsiniz:

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Yerel ve Küresel Stillere Karıştırma {#mixing-local-and-global-styles}

Aynı bileşende hem scoped hem de non-scoped stilleri de dahil edebilirsiniz:

```vue
<style>
/* küresel stiller */
</style>

<style scoped>
/* yerel stiller */
</style>
```

### Scoped Stil İpuçları {#scoped-style-tips}

- **Scoped stiller sınıfların ihtiyaçlarını ortadan kaldırmaz**. Farklı CSS seçicilerini uygularken tarayıcıların renderlama şekli nedeniyle, `p { color: red }` scoped olduğunda (yani bir nitelik seçici ile birleştirildiğinde) çok daha yavaş çalışır. Eğer `.example { color: red }` gibi sınıflar veya id'ler kullanırsanız, bu performans kaybını neredeyse tamamen ortadan kaldırırsınız.

- **Yinelenen bileşenlerde torun seçicileri ile dikkatli olun!** Seçici için bir CSS kuralı `.a .b` ise, `.a` ile eşleşen öğe bir yinelenen çocuk bileşeni içeriyorsa, o çocuk bileşende bulunan tüm `.b` öğeleri bu kural tarafından eşleşir.

## CSS Modülleri {#css-modules}

Bir `` etiketi [CSS Modülleri](https://github.com/css-modules/css-modules) olarak derlenir ve sonuçta oluşan CSS sınıflarını bileşene `$style` anahtarı altında bir nesne olarak sunar:

```vue
<template>
  <p :class="$style.red">Bu kırmızı olmalı</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

Sonuçta oluşan sınıflar çakışmayı önlemek için hashlenir ve CSS'i yalnızca mevcut bileşene kapsüllemekte aynı etkiyi elde eder.

Daha fazla detay için [CSS Modülleri spesifikasyonuna](https://github.com/css-modules/css-modules) ve [küresel istisnalara](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) ve [kompozisyona](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#composition) başvurun.

### Özel Enjeksiyon Adı {#custom-inject-name}

Enjekte edilen sınıflar nesnesinin özellik anahtarını `module` niteliğine bir değer vererek özelleştirebilirsiniz:

```vue
<template>
  <p :class="classes.red">kırmızı</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Composition API ile Kullanım {#usage-with-composition-api}

Enjekte edilen sınıflar `setup()` ve `` içinde `useCssModule` API'si aracılığıyla erişilebilir. Özel enjeksiyon isimleri olan `` blokları için, `useCssModule` ilk argüman olarak eşleşen `module` niteliği değerini kabul eder:

```js
import { useCssModule } from 'vue'

// setup() kapsamı içinde...
// varsayılan, <style module> için sınıfları döndürür
useCssModule()

// adlandırılmış, <style module="classes"> için sınıfları döndürür
useCssModule('classes')
```

- **Örnek**

```vue
<script setup lang="ts">
import { useCssModule } from 'vue'

const classes = useCssModule()
</script>

<template>
  <p :class="classes.red">kırmızı</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

## `v-bind()` CSS'te {#v-bind-in-css}

SFC `` etiketleri, dinamik bileşen durumuna bağlı CSS değerlerini bağlama desteği sunar:

```vue
<template>
  <div class="text">merhaba</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

Sözdizimi `` ile çalışır ve JavaScript ifadelerini destekler (tırnak içine alınmalıdır):

```vue
<script setup>
import { ref } from 'vue'
const theme = ref({
    color: 'red',
})
</script>

<template>
  <p>merhaba</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

Gerçek değer, hashlenmiş bir CSS özel özelliği olarak derlenecektir, bu yüzden CSS hala statiktir. Özel özellik, bileşenin kök öğesine inline stiller aracılığıyla uygulanacak ve kaynak değer değiştiğinde reaktif olarak güncellenecektir.