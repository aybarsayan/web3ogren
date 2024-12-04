---
title: flushSync
seoTitle: Understanding flushSync in React
sidebar_position: 4
description: flushSync forces React to flush any updates synchronously within a given callback, allowing immediate DOM updates. Use it judiciously to avoid performance issues.
tags: 
  - React
  - flushSync
  - performance
  - DOM updates
keywords: 
  - React
  - flushSync
  - performance
  - DOM updates
---
:::warning
`flushSync` kullanmak yaygın değildir ve uygulamanızın performansını olumsuz etkileyebilir. 
:::



`flushSync`, React'i verilen geri çağırma içinde herhangi bir güncellemeyi senkronize bir şekilde temizlemeye zorlar. Bu, DOM'un hemen güncellenmesini sağlar.

```js
flushSync(callback)
```