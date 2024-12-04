---
title: createRef
seoTitle: createRef - React Reference
sidebar_position: 4
description: createRef is used to create a reference object that can hold a random value, typically used in class components. This documentation covers its usage, parameters, and alternatives.
tags: 
  - React
  - createRef
  - Component
  - useRef
keywords: 
  - createRef
  - useRef
  - React components
  - references
  - class components
---
:::tip
`createRef` genelde `sınıf bileşenleri` için kullanılır. Fonksiyon bileşenleri genellikle `useRef` kullanır.
:::



`createRef`, rastgele bir değer içerebilecek bir `ref` nesnesi oluşturur.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```