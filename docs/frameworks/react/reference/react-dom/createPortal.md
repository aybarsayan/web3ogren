---
title: createPortal
seoTitle: createPortal - React
sidebar_position: 4
description: The createPortal function allows you to render children into a different part of the DOM. This is particularly useful for components like modals or tooltips.
tags: 
  - React
  - Portal
  - DOM Manipulation
  - Component Rendering
keywords: 
  - createPortal
  - React
  - DOM
  - JSX
  - Portal
---
`createPortal`, DOM'un farklı bir parçasına bazı çocukları render etmenizi sağlar.

```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```