---
title: useOptimistic
seoTitle: İyimser Kullanım Kancası - React
sidebar_position: 4
description: useOptimistic, kullanıcı arayüzünü iyimser bir şekilde güncellemenizi sağlayan bir React Kancasıdır. Kullanıcı etkileşimlerinin daha hızlı hissettirilmesine yardımcı olur.
tags: 
  - React
  - useOptimistic
  - kullanıcı arayüzü
  - kancalar
keywords: 
  - useOptimistic
  - React
  - iyimser güncellemeler
  - kullanıcı deneyimi
---
`useOptimistic` Kancası şu anda yalnızca React'in Canary ve deneme kanallarında mevcuttur. Daha fazla bilgi için `React sürüm kanallarına buradan ulaşabilirsiniz`.





`useOptimistic`, kullanıcı arayüzünü iyimser bir şekilde güncellemenizi sağlayan bir React Kancasıdır.

```js
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```