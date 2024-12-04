---
title: unmountComponentAtNode
seoTitle: React unmountComponentAtNode API
sidebar_position: 11
description: The unmountComponentAtNode API is used to remove a mounted React component from the DOM, cleaning up event handlers and state. This feature has been deprecated in React 18.
tags: 
  - React
  - API
  - DOM
  - unmount
keywords: 
  - unmountComponentAtNode
  - React
  - component
  - DOM
  - event handler
---
Bu API, React'in gelecekteki büyük bir sürümünde kaldırılacaktır.

React 18'de, `unmountComponentAtNode` `root.unmount()` ile değiştirildi.





`unmountComponentAtNode`, bir montelenmiş React bileşenini DOM'dan kaldırır.

```js
unmountComponentAtNode(domNode)
```