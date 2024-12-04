---
title: React Suspense Component Overview
seoTitle: React Suspense Component Overview
sidebar_position: 4
description: The  component allows you to display a fallback UI while loading child components. This document covers its props, usage, and caveats.
tags: 
  - React
  - Suspense
  - Loading States
  - Components
keywords: 
  - React
  - Suspense
  - loading
  - fallback
---
`` bileşeni, çocukları yüklenene kadar bir geri dönüş görüntülemenizi sağlar.

```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```