---
title: experimental_useEffectEvent
seoTitle: Experimental useEffectEvent in React
sidebar_position: 4
description: This document discusses the experimental useEffectEvent API in React, highlighting its usage and experimental nature. It provides installation instructions for the experimental packages and usage examples.
tags: 
  - react
  - hooks
  - experimental
  - event handling
keywords: 
  - useEffectEvent
  - React
  - experimental API
  - event handling
---
**Bu API deneyseldir ve henüz React'ın kararlı versiyonunda mevcut değildir.**

Bunu, React paketlerini en son deneysel sürüme yükselterek deneyebilirsiniz:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

> React'ın deneysel sürümleri hatalar içerebilir. Üretimde kullanmayın.  
> — React Team




Önemli Bilgiler

`useEffectEvent`, reaktif olmayan mantığı bir `Etkileşim Olayı.` içine çıkarmanıza olanak tanıyan bir React Hook'udur.

```js
const onSomething = useEffectEvent(callback)
```





:::tip
**En iyi uygulamalar:** React'ın deneysel sürümlerini kullanırken dikkatli olun.
:::