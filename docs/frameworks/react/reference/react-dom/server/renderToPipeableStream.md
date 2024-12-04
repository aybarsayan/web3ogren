---
title: renderToPipeableStream
seoTitle: Render to Pipeable Stream in React
sidebar_position: 4
description: The renderToPipeableStream API allows rendering a React tree into a Node.js Stream. Learn how to implement it effectively.
tags: 
  - React
  - Server-Side Rendering
  - Node.js
keywords: 
  - renderToPipeableStream
  - React
  - Node.js
  - server-side rendering
  - streaming
---
`renderToPipeableStream`, bir React ağacını pipeable [Node.js Stream.](/docs/assets/image.png) üzerinde işler.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```







Bu API, Node.js'e özeldir. [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) gibi, Deno ve modern kenar çalışma zamanlarında `renderToReadableStream` kullanmalısınız.