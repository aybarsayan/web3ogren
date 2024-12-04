---
title: useImperativeHandle
seoTitle: Understanding useImperativeHandle in React
sidebar_position: 4
description: useImperativeHandle is a React Hook that allows you to customize the handle displayed as a ref. This guide provides clear examples and usage scenarios to enhance your understanding.
tags: 
  - React
  - Hooks
  - useImperativeHandle
  - refs
keywords: 
  - useImperativeHandle
  - React Hooks
  - custom ref
  - focus
  - scrollIntoView
---
`useImperativeHandle`, bir `ref.` olarak sergilenen handle'ı özelleştirmenizi sağlayan bir React Hook'udur.

```js
useImperativeHandle(ref, createHandle, dependencies?)
```