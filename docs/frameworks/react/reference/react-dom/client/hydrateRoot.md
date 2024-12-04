---
title: hydrateRoot
seoTitle: Hydrate Root - React
sidebar_position: 4
description: The hydrateRoot method is essential for integrating server-rendered React components into existing HTML. This guide covers its parameters, return values, usage, and potential pitfalls.
tags: 
  - React
  - hydration
  - server-side rendering
  - web development
keywords: 
  - hydrateRoot
  - React
  - server-rendered HTML
  - hydration errors
  - web applications
---
`hydrateRoot`, React bileşenlerini, daha önce `react-dom/server` tarafından` oluşturulmuş bir tarayıcı DOM düğümünün HTML içeriği içinde görüntülemenizi sağlar.

```js
const root = hydrateRoot(domNode, reactNode, options?)
```