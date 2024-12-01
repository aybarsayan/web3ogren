---
title: getSourceOfMock
description: getSourceOfMock yöntemi, ng-mocks kütüphanesinde bir mock sınıfının kaynağını döndürmek için kullanılır. Bu belge, yöntemin nasıl çalıştığını ve kullanım örneklerini içermektedir.
keywords: [ng-mocks, getSourceOfMock, mock sınıfı, TypeScript, yazılım geliştirme]
---

`getSourceOfMock`, bir mock sınıfının kaynağını döndürür.

:::tip
Bu yöntemi kullanarak, mock nesnenizin arkasındaki orijinal sınıfa kolayca erişebilirsiniz.
:::

```ts
// `MockClass`'ın kaynak sınıfını döndürür
const OriginalClass1 = getSourceOfMock(MockClass);
```

:::info
Eğer `OriginalClass2` bir mock değilse, bu yöntem aynı sınıfı döndürür.
:::

```ts
// OriginalClass2 bir mock değilse aynı sınıfı döndürür
const OriginalClass2 = getSourceOfMock(OriginalClass2);
```

---

> "ng-mocks kütüphanesi, test yazımını kolaylaştıran güçlü bir araçtır."  
> — ng-mocks Geliştirici Ekibi