---
title: kullan
seoTitle: Kullan - React use APIsi
sidebar_position: 4
description: Reactin use APIsinin kullanımı, özellikleri ve potansiyel hatalar hakkında ayrıntılı bilgi.
tags: 
  - React
  - kullanımları
  - API
keywords: 
  - use API
  - React
  - promise
  - context
  - bileşen
---
`use` API'si şu anda yalnızca React'in Canary ve deneysel kanallarında kullanılabilir. `React'in sürüm kanalları hakkında daha fazla bilgi edinin`.





`use`, bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya `context` gibi bir kaynağın değerini okumanızı sağlayan bir React API'sidir.

```js
const value = use(resource);
```