---
title: experimental_taintObjectReference
seoTitle: API for experimental_taintObjectReference
sidebar_position: 4
description: Bu API, belirli bir nesne örneğinin bir Client Bileşenine geçirilmesini önler. Deneysel sürümler hatalar içerebilir, dikkatli kullanılmalıdır.
tags: 
  - React
  - API
  - experimental
  - Client Bileşenleri
keywords: 
  - taintObjectReference
  - React API
  - kullanici verileri
  - güvenlik
---
**Bu API deneyseldir ve henüz React'ın kararlı bir sürümünde mevcut değildir.**

En son deneysel sürüme güncelleyerek deneyebilirsiniz:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React'ın deneysel sürümleri hatalar içerebilir. Bunları üretimde kullanmayın.

Bu API yalnızca React Sunucu Bileşenleri içinde mevcuttur.





`taintObjectReference`, belirli bir nesne örneğinin bir Client Bileşenine, örneğin bir `user` nesnesine aktarılmasını önlemenizi sağlar.

```js
experimental_taintObjectReference(message, object);
```

Bir anahtar, hash veya token geçişini önlemek için `taintUniqueValue` sayfasına bakın.