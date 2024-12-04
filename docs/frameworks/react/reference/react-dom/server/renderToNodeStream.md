---
title: renderToNodeStream
seoTitle: renderToNodeStream - React Documentation
sidebar_position: 11
description: The renderToNodeStream API renders a React tree to a Node.js Readable Stream. This guide provides usage details and parameters.
tags: 
  - React
  - Node.js
  - Server-Side Rendering
  - Web Development
keywords: 
  - renderToNodeStream
  - React Server API
  - Node.js stream
  - Server-rendering
---
Bu API, React'ın gelecekteki büyük bir sürümünde kaldırılacaktır. Bunun yerine `renderToPipeableStream` kullanın.





`renderToNodeStream`, bir React ağacını [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) olarak render eder.

```js
const stream = renderToNodeStream(reactNode, options?)
```