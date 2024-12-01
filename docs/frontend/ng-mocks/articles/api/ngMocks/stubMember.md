---
title: ngMocks.stubMember
description: ng-mocks kütüphanesindeki ngMocks.stubMember hakkında belgeler. Bu içerik, Angular testlerinde servis yöntemlerinin, özelliklerin ve alıcıların nasıl geçersiz kılınacağını detaylandırmaktadır.
keywords: [ngMocks, stubMember, Angular, test, casuslar, yöntem geçersiz kılma, özellik geçersiz kılma]
---

`ngMocks.stubMember`, **mevcut casusların** veya tanımlı değerlerin **örneklerine enjekte edilmesini** sağlar.

```ts
// yöntemi geçersiz kılma
ngMocks.stubMember(service, method, customCallback);

// özelliğin değerini geçersiz kılma
ngMocks.stubMember(service, property, customValue);

// alıcıyı geçersiz kılma, mevcut ayarlayıcıyı etkilemez
ngMocks.stubMember(service, property, customGetter, 'get');

// ayarlayıcıyı geçersiz kılma, mevcut alıcıyı etkilemez
ngMocks.stubMember(service, property, customSetter, 'set');
```

Geçirilen değeri döndürür, bu nedenle **casuslar için hızlı zincirler** ve taklitler sağlar.

```ts
ngMocks.stubMember(service, 'handler', jasmine.createSpy('handler'))
  .and.returnValue('fake');

ngMocks.stubMember(service, 'read', jasmine.createSpy('read'), 'set')
  .and.toThrowError();
```

:::tip
Eğer bir servisin yöntemini Angular testlerinde geçersiz kılmamız gerekiyorsa:
:::

```ts
const service = TestBed.inject(Service);
ngMocks.stubMember(service, 'handler', () => 'fake');
// service.handler() === 'fake'
```

:::info
Eğer bir bileşenin özelliğini Angular testlerinde geçersiz kılmamız gerekiyorsa:
:::

```ts
const component = TestBed.createComponent(Component)
  .componentInstance;
ngMocks.stubMember(service, 'name', 'mock');
// service.name === 'mock'
```

Eğer Angular testlerinde bir alıcıyı geçersiz kılmamız gerekiyorsa:

```ts
const service = TestBed.inject(Service);
ngMocks.stubMember(service, 'name', () => 'mock', 'get');
// service.name === 'mock'
```

:::warning
Eğer Angular testlerinde bir ayarlayıcıyı geçersiz kılmamız gerekiyorsa:
:::

```ts
const service = TestBed.inject(Service);
let value: any;
ngMocks.stubMember(service, 'name', v => (value = v), 'set');
// value === undefined
service.name = 'fake';
// value === 'fake'
```