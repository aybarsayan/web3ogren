---
title: useCallback
seoTitle: React useCallback Hook Detailed Guide
sidebar_position: 4
description: Learn how to optimize performance in React components using the useCallback Hook. This guide explains its functionality, parameters, and common use cases.
tags: 
  - React
  - Hooks
  - Performance Optimization
  - useCallback
keywords: 
  - useCallback
  - React Hooks
  - performance
  - optimization
---
`useCallback`, bir React Hook'u olup, yeniden render'lar arasında bir fonksiyon tanımını önbelleğe almanıza olanak tanır.

```js
const cachedFn = useCallback(fn, dependencies)
```