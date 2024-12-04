---
title: useInsertionEffect
seoTitle: Understanding useInsertionEffect in React
sidebar_position: 4
description: The useInsertionEffect hook allows styles to be injected before any layout effects are triggered, making it essential for CSS-in-JS library authors. This documentation explains its usage, parameters, and caveats.
tags: 
  - React
  - Hooks
  - useInsertionEffect
  - CSS-in-JS
keywords: 
  - useInsertionEffect
  - CSS-in-JS
  - layout effects
  - React hooks
---
:::tip
`useInsertionEffect` is primarily for authors of CSS-in-JS libraries. If you are not working on a CSS-in-JS library and do not need a place to inject styles, you might want to consider using `useEffect` or `useLayoutEffect`.
:::



`useInsertionEffect`, DOM'a herhangi bir layout Effects tetiklenmeden önce öğelerin eklenmesine olanak tanır.

```js
useInsertionEffect(setup, dependencies?)
```