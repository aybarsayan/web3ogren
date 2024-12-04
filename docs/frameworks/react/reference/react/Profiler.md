---
title: Profiler
seoTitle: Programmatic Performance Measurement with Profiler in React
sidebar_position: 4
description: The  component allows you to measure rendering performance programmatically. Learn how to use it effectively in your React applications.
tags: 
  - React
  - Performance
  - Profiling
  - Development
keywords: 
  - Profiler
  - Rendering
  - Performance Measurement
---
`` render performansını programatik olarak ölçmenizi sağlar.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```