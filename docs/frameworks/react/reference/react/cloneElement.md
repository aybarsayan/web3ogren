---
title: cloneElement
seoTitle: React cloneElement API Reference
sidebar_position: 4
description: cloneElement allows the creation of a new React element from an existing element. Learn its usage, parameters, and best practices.
tags: 
  - React
  - cloneElement
  - components
  - JSX
  - props
keywords: 
  - cloneElement
  - React
  - props
  - components
  - development
---
:::warning
`cloneElement` kullanımı yaygın değildir ve kırılgan koda yol açabilir. `Yaygın alternatiflere bakın.`
:::



`cloneElement`, başka bir elementi başlangıç noktası olarak kullanarak yeni bir React elementi oluşturmanıza olanak tanır.

```js
const clonedElement = cloneElement(element, props, ...children)
```