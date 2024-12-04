---
title: React  Component
seoTitle: Enhanced Guide to React  Component
sidebar_position: 4
description: This document provides an in-depth look at the React  component for embedding CSS styles directly into your documents. It covers props, usage, and special rendering behaviors.
tags: 
  - React
  - CSS
  - Frontend Development
  - Style Component
keywords: 
  - React
  - style component
  - CSS
  - frontend development
  - rendering
---
React'in ``'a yaptığı uzantılar şu anda yalnızca React'in kanarya ve deneysel kanallarında mevcuttur. React'ın stabil sürümlerinde `` yalnızca [gömülü bir tarayıcı HTML bileşeni](https://react.dev/reference/react-dom/components#all-html-components) olarak çalışır. `React'ın sürüm kanalları hakkında daha fazla bilgi edinin`.





[Zaten mevcut olan tarayıcı `` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style), belgeye yerleşik CSS stilleri eklemenizi sağlar.

```js
<style>{` p { color: red; } `}</style>
```