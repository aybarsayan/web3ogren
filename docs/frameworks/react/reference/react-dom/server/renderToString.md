---
title: renderToString
seoTitle: Understanding renderToString in React
sidebar_position: 4
description: renderToString converts a React tree into an HTML string. It is important to understand its limitations and alternative methods effectively.
tags: 
  - React
  - renderToString
  - server-side rendering
keywords: 
  - React
  - renderToString
  - server-side rendering
---
:::tip
`renderToString` converts a React tree into an HTML string, allowing server-side rendering of your application.
:::



`renderToString`, bir React ağacını HTML dizesine çevirir.

```js
const html = renderToString(reactNode, options?)
```