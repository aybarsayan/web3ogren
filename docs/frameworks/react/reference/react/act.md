---
title: act
seoTitle: React act Helper for Testing
sidebar_position: 1
description: act is a helper for applying pending React updates, allowing you to perform necessary actions before making assertions. This guide explains its usage in UI testing effectively.
tags: 
  - React
  - Testing
  - Testing Library
keywords: 
  - act
  - UI Testing
  - React Testing Library
---
`act`, bekleyen React güncellemelerini uygulamak için bir test yardımcıdır, böylece doğrulamalar yapmadan önce gerekli olan işlemleri gerçekleştirebilirsiniz.

```js
await act(async actFn)
```



Bir bileşeni doğrulamalar için hazırlamak üzere, onu render eden ve güncellemeleri gerçekleştiren kodu `await act()` çağrısının içine sarın. Bu, testinizin tarayıcıda React'ın nasıl çalıştığına daha yakın bir şekilde çalışmasını sağlar.

:::note
Doğrudan `act()` kullanmanın biraz fazla ayrıntılı olduğunu görebilirsiniz. Bazı şemaların önüne geçmek için, `act()` ile sarılmış yardımcıları olan bir kütüphane kullanabilirsiniz; örneğin, [React Testing Library](https://testing-library.com/docs/react-testing-library/intro).
:::