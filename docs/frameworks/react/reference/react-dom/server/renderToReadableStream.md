---
title: renderToReadableStream
seoTitle: Render to Readable Stream in React
sidebar_position: 11
description: The renderToReadableStream API renders a React tree to a Readable Web Stream. Learn how to utilize this API effectively in your React applications.
tags: 
  - React
  - Web Streams
  - Server Rendering
  - Hydration
keywords: 
  - react
  - renderToReadableStream
  - web streams
  - server rendering
  - hydration
---
`renderToReadableStream` bir React ağacını [Okunabilir Web Akışı](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)'na render eder.

```js
const stream = await renderToReadableStream(reactNode, options?)
```







Bu API [Web Akışları](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)'na bağlıdır. Node.js için `renderToPipeableStream` kullanın.