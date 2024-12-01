---
title: ngMocks.stub
description: ngMocks.stub hakkında ng-mocks kütüphanesinden dokümantasyon. Bu içerik, servisler için nasıl yedek yöntemler veya özellikler oluşturulacağını açıklamaktadır. Ayrıca, ilgili kod örnekleri ile kullanım detayları verilmektedir.
keywords: [ngMocks, stub, Angular, test, servis, casus]
---

`ngMocks.stub`, bir servis için yedek yöntemler / özellikler oluşturmak istediğimizde gereklidir.

> Ayarlamak istediğimiz mevcut bir değer / casus varsa, `ngMocks.stubMember` kullanın.

- `ngMocks.stub( service, method )`
- `ngMocks.stub( service, methods )`
- `ngMocks.stub( service, property, 'get' | 'set' )`

Yöntemin bir sahte işlevini / casusunu döndürür. Eğer yöntem henüz bir yedek ile değiştirilmemişse - bu gerçekleşecektir.

```ts
const spy: Function = ngMocks.stub(instance, methodName);
```

Bir özelliğin sahte işlevini / casusunu döndürür. Eğer özellik henüz bir yedek ile değiştirilmemişse - bu gerçekleşecektir.

```ts
const spyGet: Function = ngMocks.stub(instance, propertyName, 'get');
const spySet: Function = ngMocks.stub(instance, propertyName, 'set');
```

:::tip
Özellikleri ve yöntemleri geçersiz kılmak için bir nesne geçirebilirsiniz.
:::

Ya da özellikleri ve yöntemleri geçersiz kılın.

```ts
ngMocks.stub(instance, {
  existingProperty: true,
  existingMethod: jasmine.createSpy(),
});
```

:::info
Yedekleme işlemi, test durumlarınızı daha güvenilir hale getirir. Bu nedenle, her zaman geçerli yöntemleri ve özellikleri hedef alın.
:::