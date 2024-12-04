---
title: useMemo
seoTitle: useMemo - React Hook for Optimizing Performance
sidebar_position: 4
description: useMemo is a React Hook that allows caching a calculations result between renders. Learn how to effectively use it to optimize your components.
tags: 
  - React
  - Hooks
  - Performance Optimization
  - Memoization
keywords: 
  - useMemo
  - caching
  - React performance
  - re-rendering
---
`useMemo`, bir React Hook'udur ve yeniden render işlemleri arasında bir hesaplamanın sonucunu önbelleğe almanıza olanak tanır.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```