---
title: Geçiş Nitelikleri
seoTitle: Geçiş Nitelikleri - Vue.js
sidebar_position: 4
description: Bu sayfada, bileşenlere geçiş niteliklerinin nasıl miras alındığı, devre dışı bırakılabileceği ve bu niteliklere JavaScriptte nasıl erişileceği ele alınmaktadır.
tags: 
  - Vue
  - Bileşen
  - Geçiş Nitelikleri
  - Props
keywords: 
  - geçiş nitelikleri
  - miras alma
  - Vue bileşenleri
  - $attrs
---
## Geçiş Nitelikleri {#fallthrough-attributes}

> Bu sayfa, `Bileşenler Temelleri` başlıklı içeriği okuduğunuzu varsayıyor. Eğer bileşenlerle yeniyseniz, önce o bölümü okuyun.

## Nitelik Kalıtımı {#attribute-inheritance}

"Geçiş niteliği", bir bileşene geçirilen ancak alıcı bileşenin `props` veya `emits` içinde açıkça belirtilmemiş bir nitelik veya `v-on` olay dinleyicisidir. Bu tür niteliklere yaygın örnekler `class`, `style` ve `id` nitelikleridir.

Bir bileşen tek bir kök öğe oluşturduğunda, geçiş nitelikleri otomatik olarak kök öğenin niteliklerine eklenir. Örneğin, aşağıdaki şablona sahip bir `` bileşeni verildiğinde:

```vue-html
<!-- <MyButton> şablonu -->
<button>Click Me</button>
```

Ve bu bileşeni kullanan bir üst bileşen:

```vue-html
<MyButton class="large" />
```

Sonucu oluşturulan DOM şöyle olacaktır:

```html
<button class="large">Click Me</button>
```

Burada, `` `class`'ın kabul edilen bir prop olarak belirtilmedi. Bu nedenle `class`, geçiş niteliği olarak kabul edilir ve otomatik olarak ``'ın kök öğesine eklenir.

### `class` ve `style` Birleşimi {#class-and-style-merging}

Eğer çocuk bileşenin kök öğesi zaten mevcut boşluk veya stil niteliklerine sahipse, bu nitelikler üstten miras alınan `class` ve `style` değerleri ile birleştirilecektir. Önceki örnekteki `` şablonunu şöyle değiştirdiğimizde:

```vue-html
<!-- <MyButton> şablonu -->
<button class="btn">Click Me</button>
```

Sonuçta oluşturulan DOM şöyle olacaktır:

```html
<button class="btn large">Click Me</button>
```

### `v-on` Dinleyici Kalıtımı {#v-on-listener-inheritance}

Aynı kural `v-on` olay dinleyicileri için de geçerlidir:

```vue-html
<MyButton @click="onClick" />
```

`click` dinleyicisi, ``'ın kök öğesine, yani yerel `` öğesine eklenecektir. Yerel `` tıklandığında, üst bileşenin `onClick` yöntemini tetikleyecektir. Eğer yerel `` üzerinde `v-on` ile bağlı bir `click` dinleyicisi varsa, her iki dinleyici de tetiklenecektir.

### İç İçe Bileşen Kalıtımı {#nested-component-inheritance}

Eğer bir bileşen başka bir bileşeni kök düğümü olarak render ederse, örneğin, `` bileşenini temel düğüm olarak `` bileşenini render edecek şekilde yeniden yapılandırırsak:

```vue-html
<!-- <MyButton/> şablonu, başka bir bileşeni basitçe render eder -->
<BaseButton />
```

O zaman ``'a alınan geçiş nitelikleri otomatik olarak ``'a iletilecektir.

Dikkat edilmesi gereken noktalar:

1. İletilen nitelikler, `` tarafından belirtilmiş olan prop'lar veya `v-on` ile belirtilen dinleyici niteliklerini içermez; diğer bir deyişle, belirtilmiş olan prop'lar ve dinleyiciler `` tarafından "tüketilmiştir".

2. İletilen nitelikler, `` tarafından belirtildiyse prop olarak kabul edilebilir.

## Nitelik Kalıtımını Devre Dışı Bırakma {#disabling-attribute-inheritance}

Bir bileşenin otomatik olarak nitelik miras almasını istemiyorsanız, bileşenin seçeneklerinde `inheritAttrs: false` ayarını yapabilirsiniz.

:::info
3.3 sürümünden itibaren `` içinde doğrudan `defineOptions` kullanabilirsiniz:
:::

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup mantığı
</script>
```

Nitelik kalıtımını devre dışı bırakmanın yaygın senaryosu, niteliklerin kök düğümün dışında başka öğelere uygulanması gerektiğinde ortaya çıkar. `inheritAttrs` seçeneğini `false` olarak ayarlayarak, geçiş niteliklerinin nerelere uygulanması gerektiği üzerinde tam kontrol sağlayabilirsiniz.

Bu geçiş niteliklerine şablon ifadelerinde `$attrs` ile doğrudan erişilebilir:

```vue-html
<span>Geçiş nitelikleri: {{ $attrs }}</span>
```

`$attrs` nesnesi, bileşenin `props` veya `emits` seçenekleriyle belirtilmemiş tüm nitelikleri içerir (örneğin: `class`, `style`, `v-on` dinleyicileri vb.).

Bazı notlar:

- Props'tan farklı olarak, geçiş nitelikleri JavaScript'te orijinal yazım şekillerini korur, bu nedenle `foo-bar` gibi bir nitelik, `$attrs['foo-bar']` olarak erişilmelidir.

- `@click` gibi bir `v-on` olay dinleyicisi, `$attrs` nesnesinde bir fonksiyon olarak `onClick` altında görünür.

Önceki bölümdeki `` bileşeni örneğini kullanarak - bazen gerçek `` öğesini stil amaçları için ekstra bir `` ile sarmalamamız gerekebilir:

```vue-html
<div class="btn-wrapper">
  <button class="btn">Click Me</button>
</div>
```

Tüm geçiş niteliklerinin, `class` ve `v-on` dinleyicileri gibi, içteki ``'a, dıştaki ``'ye değil, uygulanmasını istiyoruz. Bunu `inheritAttrs: false` ve `v-bind="$attrs"` ile elde edebiliriz:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

Unutmayın ki `v-bind` argüman olmadan` bir nesnenin tüm özelliklerini hedef öğenin nitelikleri olarak bağlar.

## Birden Fazla Kök Düğümde Nitelik Kalıtımı {#attribute-inheritance-on-multiple-root-nodes}

Tek bir kök düğüm içeren bileşenlerden farklı olarak, birden fazla kök düğümü olan bileşenler otomatik bir nitelik geçiş davranışına sahip değildir. Eğer `$attrs` açıkça bağlanmazsa, çalışma zamanı uyarısı verilecektir.

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

Eğer `` aşağıdaki çoklu kök şablonuna sahipse, geçiş niteliklerinin nereye uygulanacağı konusunda Vue emin olamayacağı için bir uyarı olacaktır:

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

Eğer `$attrs` açıkça bağlanırsa, uyarı bastırılacaktır:

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## Geçiş Niteliklerine JavaScript'te Erişim {#accessing-fallthrough-attributes-in-javascript}

:::note
Gerekirse, `` içinde `useAttrs()` API'sini kullanarak bir bileşenin geçiş niteliklerine erişebilirsiniz:
:::

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

`` kullanmıyorsanız, `attrs` `setup()` bağlamının bir özelliği olarak görünür:

```js
export default {
  setup(props, ctx) {
    // geçiş nitelikleri ctx.attrs olarak görünür
    console.log(ctx.attrs)
  }
}
```

Burada `attrs` nesnesinin her zaman en son geçiş niteliklerini yansıttığını, ancak reaktif olmadığını belirtmek gerekir (performans nedenleriyle). Değişimlerini gözlemlemek için watcher kullanamazsınız. Eğer reaktiviteye ihtiyaç duyarsanız, bir prop kullanın. Alternatif olarak, her güncellemede en son `attrs` ile yan etkileri gerçekleştirmek için `onUpdated()` kullanabilirsiniz.

:::danger
Gerekirse, bir bileşenin geçiş niteliklerine `$attrs` örnek özelliği aracılığıyla erişebilirsiniz:
:::

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```