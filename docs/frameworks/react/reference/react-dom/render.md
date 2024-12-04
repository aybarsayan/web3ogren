---
title: render
seoTitle: Render API in React
sidebar_position: 4
description: The render API allows users to display React components in the browsers DOM. This documentation provides insights on its usage, parameters, and caveats.
tags: 
  - React
  - API
  - JSX
keywords: 
  - render
  - React
  - JavaScript
  - DOM
  - components
---
Bu API, gelecekteki bir ana sürümde React'ten kaldırılacaktır.

React 18'de, `render` `createRoot` ile değiştirildi. React 18'de `render` kullanmak, uygulamanızın React 17 gibi davranacağını bildiren bir uyarı verecektir. Daha fazla bilgiyi `buradan öğrenin.`





`render`, bir parçayı `JSX` ("React node") bir tarayıcı DOM düğümüne çizer.

```js
render(reactNode, domNode, callback?)
```