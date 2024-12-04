---
title: useActionState
seoTitle: useActionState Hook Documentation
sidebar_position: 4
description: The useActionState hook allows you to update the state based on the outcome of a form action in React applications.
tags: 
  - React
  - Hooks
  - State Management
  - Forms
keywords: 
  - useActionState
  - React Hook
  - Form Handling
---
`useActionState` Kancası şu anda yalnızca React'in Canary ve deneysel kanallarında mevcuttur. `Sürüm kanalları hakkında daha fazla bilgi edinin`. Ayrıca, `useActionState`'in tam faydasını elde etmek için `React Sunucu Bileşenlerini` destekleyen bir çerçeve kullanmanız gerekmektedir.





Önceki React Canary sürümlerinde, bu API React DOM'un bir parçasıydı ve `useFormState` olarak adlandırılıyordu.





`useActionState`, bir form eyleminin sonucuna dayanarak durumu güncellemenizi sağlayan bir Kancadır.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```