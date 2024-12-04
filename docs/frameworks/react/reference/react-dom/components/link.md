---
title:  Bileşeni
seoTitle: React  Bileşeni Hakkında Bilgiler
sidebar_position: 11
description: Reactin  bileşeni, harici kaynaklara bağlanmanıza ve belgeleri meta verilerle süslemenize olanak tanır. Bu dökümanda,  bileşeninin kullanımı hakkında detayları ve önemli notları bulabilirsiniz.
tags: 
  - React
  - Web Geliştirme
  - HTML
  - bileşenler
keywords: 
  -  bileşeni
  - React
  - web bileşenleri
  - stil sayfası
  - meta veriler
---
:::tip
React'in ``'e yaptığı eklemeler şu an sadece React'in kanarya ve deneysel kanallarında mevcuttur.
:::

React'in kararlı sürümlerinde `` sadece [yerleşik bir tarayıcı HTML bileşeni](https://react.dev/reference/react-dom/components#all-html-components) olarak çalışmaktadır. `React'in sürüm kanalları hakkında daha fazla bilgi edinin`.





[Yerleşik tarayıcı `` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), stil sayfaları gibi harici kaynakları kullanmanıza veya belgeleri bağlantı meta verileri ile süslemenize olanak tanır.

```js
<link rel="icon" href="favicon.ico" />
```