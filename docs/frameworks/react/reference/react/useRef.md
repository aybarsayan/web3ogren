---
title: useRef
seoTitle: useRef React Hook for Reference Management
sidebar_position: 4
description: Use the useRef hook in React to maintain a mutable reference that does not trigger re-renders. This guide covers usage, caveats, practical examples, and pitfalls.
tags: 
  - React
  - useRef
  - Hooks
  - JavaScript
keywords: 
  - useRef
  - react hooks
  - reference
  - mutable reference
---
`useRef`, bir değer referans almanıza olanak tanıyan bir React Hook'udur; bu değer render için gerekli değildir.

```js
const ref = useRef(initialValue)
```