---
title: renderToStaticNodeStream
seoTitle: Generate Static HTML Stream with React
sidebar_position: 11
description: The renderToStaticNodeStream function converts a non-interactive React tree into a Node.js Readable Stream, allowing for server-side rendering of HTML. This method is essential for producing static content efficiently.
tags: 
  - React
  - Node.js
  - Server-side Rendering
  - HTML
keywords: 
  - renderToStaticNodeStream
  - Node.js Stream
  - React Tree
  - Server Rendering
---
`renderToStaticNodeStream`, etkileşimli olmayan bir React ağacını bir [Node.js Okunabilir Akışına](https://nodejs.org/api/stream.html#readable-streams) dönüştürür.

```js
const stream = renderToStaticNodeStream(reactNode, options?)
```