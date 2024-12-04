---
title: Slots
seoTitle: Understanding Slots in Vue.js
sidebar_position: 4
description: This section explains how to pass template fragments from a parent component to a child component using slots. It covers the usage of the  element for rendering content.
tags: 
  - Vue.js
  - Slots
  - Components
  - Web Development
keywords: 
  - Vue
  - Slots
  - Component Communication
  - Template Fragments
---
## Slots {#slots}

Props üzerinden veri geçmenin yanı sıra, üst bileşen **slot’lar** aracılığıyla alt bileşene şablon parçaları da geçebilir:



```vue-html
<ChildComp>
  This is some slot content!
</ChildComp>
```




```vue-html
<child-comp>
  This is some slot content!
</child-comp>
```



:::info
Alt bileşende, `` öğesini çıkış noktası olarak kullanarak üst bileşenden slot içeriğini render edebilir.
:::



```vue-html
<!-- in child template -->
<slot/>
```




```vue-html
<!-- in child template -->
<slot></slot>
```



`` çıkış noktası içindeki içerik "yedek" içerik olarak değerlendirilecektir: üst bileşenin herhangi bir slot içeriği geçmediği durumda görüntülenecektir:

```vue-html
<slot>Fallback content</slot>
```

:::tip
Şu anda `` bileşenine herhangi bir slot içeriği geçmiyoruz, bu yüzden yedek içeriği görmelisiniz. Üst bileşenin `msg` durumunu kullanarak alt bileşene biraz slot içeriği verelim.
:::