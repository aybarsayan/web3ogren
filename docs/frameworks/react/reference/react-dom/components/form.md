---
title: React'da Form Component
seoTitle: Form Component in React
sidebar_position: 4
description: This document provides an overview of the  component in React, including its features, usage, and handling form submissions effectively. Learn how to use the component along with example codes.
tags: 
  - React
  - forms
  - frontend
  - components
keywords: 
  - form
  - React
  - user input
  - submission
---
:::tip
React'in `` üzerindeki uzantıları yalnızca React'in canary ve deneysel kanallarında mevcuttur.
:::

React'ın kararlı sürümlerinde, `` yalnızca bir [yerleşik tarayıcı HTML bileşeni](https://react.dev/reference/react-dom/components#all-html-components) olarak çalışır. `React'ın sürüm kanalları hakkında daha fazla bilgi edinin`.





[Yerleşik tarayıcı `` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form), bilgi göndermek için etkileşimli kontroller oluşturmanıza olanak tanır.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Ara</button>
</form>
```