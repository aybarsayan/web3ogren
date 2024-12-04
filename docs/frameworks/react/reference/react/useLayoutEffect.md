---
title: useLayoutEffect
seoTitle: useLayoutEffect - React Hooks
sidebar_position: 4
description: useLayoutEffect is a hook that runs synchronously after all DOM mutations. Its useful for measuring layout before the browser repaints.
tags: 
  - React
  - Hooks
  - useLayoutEffect
  - Performance
keywords: 
  - React
  - useLayoutEffect
  - Hooks
  - Performance
---
:::warning
`useLayoutEffect` performansı olumsuz etkileyebilir. Mümkünse `useEffect` kullanımını tercih edin.
:::

:::info
`useLayoutEffect`, tarayıcının ekranı tekrar boyamadan önce tetiklenen bir `useEffect` sürümüdür.
:::

```js
useLayoutEffect(setup, dependencies?)
```