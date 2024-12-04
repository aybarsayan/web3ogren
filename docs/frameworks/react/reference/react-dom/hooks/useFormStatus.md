---
title: useFormStatus
seoTitle: Understanding useFormStatus Hook in React
sidebar_position: 4
description: The useFormStatus hook provides status information regarding the most recent form submission in React applications. This documentation covers its functionality and usage examples.
tags: 
  - React
  - useFormStatus
  - hooks
  - form management
keywords: 
  - useFormStatus
  - React hooks
  - form handling
  - status management
---
`useFormStatus` Kancası şu an sadece React'in Canary ve deneysel kanallarında mevcuttur. `React'in sürüm kanalları hakkında daha fazla bilgi edinin`.





`useFormStatus`, son form göndermesi hakkında durum bilgilerini sağlayan bir Kancadır.

```js
const { pending, data, method, action } = useFormStatus();
```