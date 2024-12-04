---
title: React  Bileşeni
seoTitle: React Script Component - Embed and Manage Scripts
sidebar_position: 4
description: Reactin  bileşeni, harici ve satır içi scriptleri dahil etmenin etkili bir yolunu sunar. Bu belge, kullanım yöntemlerini ve önemli özellikleri kapsamlı bir şekilde açıklamaktadır.
tags: 
  - React
  - script
  - bileşen
  - web geliştirme
keywords: 
  - React
  - script
  - bileşen
  - web geliştirme
---
Lütfen bu sayfadaki bilgileri dikkatlice inceleyin.




:::tip
React'in `` için sunduğu uzantılar şu anda yalnızca React'in kanarya ve deneysel kanallarında mevcuttur. 
:::

React'ın stabil sürümlerinde `` sadece bir [gömülü tarayıcı HTML bileşeni](https://react.dev/reference/react-dom/components#all-html-components) olarak çalışır. `React sürüm kanalları hakkında daha fazla bilgi edinin`.





[Gömülü tarayıcı `` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script), belgenize bir script eklemenizi sağlar.

```js
<script> alert("hi!") </script>
```