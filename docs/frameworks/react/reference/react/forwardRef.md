---
title: forwardRef
seoTitle: Understanding forwardRef in React
sidebar_position: 4
description: forwardRef allows your component to expose its DOM node to its parent component. This guide covers usage, parameters, returns, and caveats.
tags: 
  - React
  - Ref
  - Component
keywords: 
  - forwardRef
  - React component
  - ref handling
  - DOM manipulation
---
`forwardRef`, bileşeninizin DOM düğümünü üst bileşene açmasına olanak tanır `ref.`

```js
const SomeComponent = forwardRef(render)
```