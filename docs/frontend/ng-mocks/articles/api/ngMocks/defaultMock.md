---
title: ngMocks.defaultMock
description: ng-mocks kütüphanesindeki ngMocks.defaultMock hakkında belge. Bu belge, test ortamlarındaki mocklar için varsayılan değerlerin nasıl ayarlandığını ve override işlemlerinin nasıl yapıldığını açıklamaktadır.
keywords: [ngMocks, defaultMock, test ortamı, override, Jasmine, Jest]
---

Test ortamındaki mocklar için varsayılan değerleri ayarlar.

- `ngMocks.defaultMock( Service, (instance, injector) => overrides )` - bir sınıf için bir override ekler
- `ngMocks.defaultMock( TOKEN, (value, injector) => value )` - bir token için bir override ekler
- `ngMocks.defaultMock( Component )` - override'ları kaldırır
- `ngMocks.defaultMock( TOKEN )` - override'ları kaldırır

:::tip
Bunu yapmak için en iyi yer, Jasmine için `src/test.ts` veya Jest için `src/setup-jest.ts` / `src/test-setup.ts`'dir.
:::

Örneğin, bir servis veya bileşenin `Observable` olması gereken bir özelliği varsa. O zaman, bu özelliği tüm test suite'inde bir `EMPTY` akışı olarak yapılandırabiliriz.

> **Not:** Aşağıdaki örnek, bir bileşenin `Observable` niteliğini nasıl ayarlayabileceğinizi göstermektedir.  
> — Test Kütüphanesi

```ts
declare class MyComponent {
  public url: string;
  public stream$: Observable<void>;
  public getStream(): Observable<void>;
}
```

```ts title="src/test.ts"
// döndürülen nesne, bileşen örneğine uygulanacaktır.
ngMocks.defaultMock(MyComponent, () => ({
  stream$: EMPTY,
  getStream: () => EMPTY,
}));

// manuel override.
ngMocks.defaultMock(MyComponent, instance => {
  instance.stream$ = EMPTY;
});

// token'ları override etme.
ngMocks.defaultMock(MY_TOKEN, () => 'DEFAULT_VALUE');

// url 'DEFAULT_VALUE' olacaktır.
ngMocks.defaultMock(MyComponent, (_, injector) => ({
  url: injector.get(MY_TOKEN),
}));

// tüm override'ları kaldırma.
ngMocks.defaultMock(MyComponent);
```