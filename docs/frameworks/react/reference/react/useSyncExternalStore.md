---
title: useSyncExternalStore
seoTitle: useSyncExternalStore - React Hook for External Store Subscriptions
sidebar_position: 4
description: useSyncExternalStore allows you to subscribe to an external store in React components, ensuring proper state management. This guide will explain its usage, parameters, and additional considerations.
tags: 
  - React
  - Hooks
  - State Management
  - External Store
keywords: 
  - useSyncExternalStore
  - React Hooks
  - External State
  - State Management
---
`useSyncExternalStore`, dış bir depoya abone olmanıza olanak tanıyan bir React Hook'udur.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```