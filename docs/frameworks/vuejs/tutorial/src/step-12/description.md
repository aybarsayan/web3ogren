---
title: Props
seoTitle: Understanding Props in Vue
sidebar_position: 4
description: This page explains how child components in Vue can receive props from their parent component. It provides code examples and usage information for both the Composition and Options APIs.
tags: 
  - Vue
  - props
  - child components
  - Composition API
  - Options API
keywords: 
  - Vue
  - props
  - child components
  - Composition API
  - Options API
---
## Props {#props}

Bir çocuk bileşeni, **props** aracılığıyla ebeveyninden giriş alabilir. Öncelikle, kabul ettiği props'ları bildirmesi gerekir:




```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

:::note
`defineProps()` bir derleme zaman makrosudur ve içe aktarım gerektirmez. Bildirildikten sonra, `msg` prop'u çocuk bileşeninin şablonunda kullanılabilir. Ayrıca, `defineProps()`'un geri dönen nesnesi aracılığıyla JavaScript'te de erişilebilir.
:::





```js
// çocuk bileşende
export default {
  props: {
    msg: String
  },
  setup(props) {
    // props.msg'e eriş
  }
}
```

Bildirildikten sonra, `msg` prop'u `this` üzerinde açığa çıkar ve çocuk bileşeninin şablonunda kullanılabilir. Alınan props'lar, `setup()`'a ilk argüman olarak geçirilir.







```js
// çocuk bileşende
export default {
  props: {
    msg: String
  }
}
```

Bildirildikten sonra, `msg` prop'u `this` üzerinde açığa çıkar ve çocuk bileşeninin şablonunda kullanılabilir.



Ebeveyn, prop'u çocuğa tıpkı nitelikler gibi geçirebilir. Dinamik bir değer geçmek için, `v-bind` sözdizimini de kullanabiliriz:



```vue-html
<ChildComp :msg="greeting" />
```




```vue-html
<child-comp :msg="greeting"></child-comp>
```



:::tip
Şimdi bunu editörde kendiniz deneyin.
:::