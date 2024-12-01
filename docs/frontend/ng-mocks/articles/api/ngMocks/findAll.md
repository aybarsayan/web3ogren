---
title: ngMocks.findAll
description: ng-mocks kütüphanesinden ngMocks.findAll hakkında belgeler. Bu fonksiyon, belirli bir bileşene veya CSS seçicisine dayanan DebugElements dizilerini bulmak için kullanılır. Doğru bileşen örneğini veya kök elemanı kullanarak bileşen yapılarını daha etkin bir şekilde yönetmenizi sağlar.
keywords: [ngMocks, findAll, DebugElements, Angular, CSS selector, fixture]
---

Doğru türde **componentInstance**'a sahip bir bileşene ait bulunan DebugElements dizisini veya bir CSS seçiciyi eşleştiren bir dizi döndürür.  
Bir kök öğesi veya bir fixture belirtilmemişse, geçerli fixture kullanılır.

:::info
`ngMocks.findAll` fonksiyonu farklı argümanlarla kullanılabilir:
- `ngMocks.findAll( fixture?, component )`
- `ngMocks.findAll( fixture?, cssSelector )`
- `ngMocks.findAll( debugElement?, component )`
- `ngMocks.findAll( debugElement?, cssSelector )`
:::

### Örnek Kullanımlar

```ts
const elements1 = ngMocks.findAll(Component1);
const elements2 = ngMocks.findAll(fixture, Component2);
const elements3 = ngMocks.findAll(fixture.debugElement, Component3);
```

```ts
const elements1 = ngMocks.findAll('div.item1');
const elements2 = ngMocks.findAll(fixture, 'div.item2');
const elements3 = ngMocks.findAll(fixture.debugElement, 'div.item3');
```

:::tip
`cssSelector`, bir özellik CSS seçici oluşturmak için bir tuple destekler.
:::

```ts
const elements1 = ngMocks.findAll(['data-key']);
// same result
const elements2 = ngMocks.findAll('[data-key]');
```

```ts
const elements1 = ngMocks.findAll(['data-key', 5]);
// same result
const elements2 = ngMocks.findAll('[data-key="5"]');
```