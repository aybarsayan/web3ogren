---
title: memo
seoTitle: Memoization in React
sidebar_position: 4
description: This page describes the memo component in React, its usage, parameters, returns, and various optimization techniques.
tags: 
  - React
  - memo
  - performance optimization
keywords: 
  - React
  - memo
  - optimization
---
`memo`, bileşenin özellikleri değiştirilmediğinde bileşeni yeniden oluşturmanıza gerek olmasını sağlar.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```