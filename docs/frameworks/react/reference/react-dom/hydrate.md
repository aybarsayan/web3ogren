---
title: hydrate
seoTitle: Understanding React hydrate API
sidebar_position: 4
description: The hydrate API allows you to render React components into a browser DOM node with pre-existing HTML. Learn how to implement it and avoid common pitfalls.
tags: 
  - React
  - JavaScript
  - hydration
  - web development
keywords: 
  - hydrate
  - React
  - API
  - client-side rendering
  - server-side rendering
---
Bu API, React'ın gelecekteki ana sürümünde kaldırılacaktır.

React 18'de `hydrate` `hydrateRoot`.` ile değiştirilmiştir. React 18'de `hydrate` kullanmak, uygulamanızın React 17 gibi davranacağına dair bir uyarı verecektir. Daha fazla bilgi için `buraya` bakın.





`hydrate`, daha önce `react-dom/server` kullanılarak React 17 ve önceki sürümlerde oluşturulmuş HTML içeriğine sahip bir tarayıcı DOM düğümü içinde React bileşenlerini görüntülemenizi sağlar.

```js
hydrate(reactNode, domNode, callback?)
```