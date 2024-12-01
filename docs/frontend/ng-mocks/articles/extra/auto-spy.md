---
title: Auto Spy
description: Angular uygulamalarında ng-mocks yardımıyla testlerde Auto Spy nasıl etkinleştirilir hakkında bilgi. ngMocks.autoSpy ile tüm mock yöntemlerini kolayca casus haline getirerek testlerinizi daha etkili hale getirebilirsiniz.
keywords: [Angular, ng-mocks, test, auto spy, jasmine, jest, sinon]
---

`ngMocks.autoSpy`, tüm mock yöntemlerinin casus olmasını istediğinizde kullanışlıdır.

Bir bileşenin bağımlılığının bir yöntemini çağırdığı ve bunun bir testle kapsanması gerektiği durumu hayal edin. `expect.toHaveBeenCalled`, **bir casusu kabul eder**, bu nedenle yöntem bir casus olmalıdır ve bu da testin başında casusu kurmanızı gerektirir.

:::tip
Eğer assert etmeniz gereken daha fazla yönteminiz varsa, daha fazla casus kurmanız gerekir.
:::

```ts
it('calls user.load', () => {
  const userService = TestBed.inject(UserService);
  spyOn(userService, 'init'); // neden?
  spyOn(userService, 'load'); // neden?
  spyOn(userService, 'set'); // neden?
  
  const fixture = TestBed.createComponent(UserComponent);
  fixture.detectChanges();
  
  expect(userService.init).toHaveBeenCalled();
  expect(userService.load).toHaveBeenCalled();
  expect(userService.set).toHaveBeenCalled();
});
```

Buradaki çözüm `ngMocks.autoSpy` kullanmaktır. Varsayılan olarak, tüm mock yöntemleri `undefined` döndüren boş işlevlerdir. `ngMocks.autoSpy` yardımıyla, yöntemler casus olacaktır.

Bu nedenle test şu şekilde görünebilir:

```ts
it('calls user.load', () => {  
  const fixture = TestBed.createComponent(UserComponent);
  fixture.detectChanges();

  const userService = TestBed.inject(UserService);
  expect(userService.init).toHaveBeenCalled();
  expect(userService.load).toHaveBeenCalled();
  expect(userService.set).toHaveBeenCalled();
});
```

## Kurulum

Eğer **hizmetlerin, bileşenlerin**, direktiflerin ve tüplerin Angular testlerinde tüm yöntemlerini otomatik olarak casus yapmak istiyorsak, `src/test.ts` dosyasına aşağıdaki kodu ekleyin.

```ts title="src/test.ts"
import { ngMocks } from 'ng-mocks';

ngMocks.autoSpy('jasmine');
// // zaten casuslar bulunan testler varsa bu kısmı komentleyin.
// jasmine.getEnv().allowRespy(true);
```

Jest için bunu `src/setup-jest.ts` / `src/test-setup.ts` dosyasına ekleyin.

```ts title="src/setup-jest.ts / src/test-setup.ts"
import { ngMocks } from 'ng-mocks';

ngMocks.autoSpy('jest');
```

## Özel casus

Her yönteme kendi casuslarını kurmak isteyebilirsiniz. Örneğin, [sinon.js](https://sinonjs.org/) gibi başka bir kütüphane kullanıyorsanız.

:::info
Bu durumda, bir casus oluşturan kendi geri çağrınızı sağlayabilirsiniz:
:::

```ts
ngMocks.autoSpy(spyName => {
  return sinon.fake();
});
```

## Testte otomatik casusu değiştirin

Varsayılan davranışı almak istiyorsanız, parametre olarak `default` geçin.

```ts
ngMocks.autoSpy('default');
```

Ayrıca, çağrıları hatırlar ve önceki yapılandırmaya sıfırlayabiliriz. Bu, bir testi `beforeEach` veya `beforeAll` ile **otomatik casus davranışını değiştirmemiz** gerektiğinde ve sonrasında `afterEach` veya `afterAll`'de geri yüklememiz faydalı olabilir, ne olduğunu umursamadan.

```ts
beforeEach(() => ngMocks.autoSpy('jasmine'));
beforeEach(() => ngMocks.autoSpy('default'));
beforeEach(() => ngMocks.autoSpy('jasmine'));
afterEach(() => ngMocks.autoSpy('reset')); // şimdi varsayılan
afterEach(() => ngMocks.autoSpy('reset')); // şimdi jasmine
// çağrılar dışında, şimdi varsayılan
afterEach(() => ngMocks.autoSpy('reset'));
```