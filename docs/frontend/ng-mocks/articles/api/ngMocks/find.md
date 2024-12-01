---
title: ngMocks.find
description: ng-mocks kütüphanesindeki `ngMocks.find` işlevine dair detaylı bilgiler ve kullanımı hakkında rehber.
keywords: [ngMocks, Angular, DebugElement, cssSelector, componentInstance, tuple, fixture]
---

Bulunan bir **DebugElement**'i döndürür; bu, doğru türde bir **componentInstance**'a ait olmalıdır veya bir **css seçicisi** ile eşleşmelidir. Eğer bir kök eleman veya bir fixture belirtilmemişse, mevcut fixture kullanılır.

:::tip
Kullanım kolaylığı açısından, `ngMocks.find` fonksiyonunu düzgün bir şekilde yapılandırmak önemlidir.
:::

- `ngMocks.find(fixture?, component, notFoundValue?)`
- `ngMocks.find(fixture?, cssSelector, notFoundValue?)`
- `ngMocks.find(debugElement?, component, notFoundValue?)`
- `ngMocks.find(debugElement?, cssSelector, notFoundValue?)`

## Bileşen Sınıfı

```ts
const element1 = ngMocks.find(Component1);
const element2 = ngMocks.find(fixture, Component2);
const element3 = ngMocks.find(fixture.debugElement, Component3);
```

## CSS Seçici

```ts
const element1 = ngMocks.find('div.con1');
const element2 = ngMocks.find(fixture, 'div.con2');
const element3 = ngMocks.find(fixture.debugElement, 'div.con3');
```

:::info
**cssSelector** ile seçim yaparken, doğru sınıfları kullanmak seçiminiz üzerinde büyük bir etkiye sahip olabilir.
:::

## Tuple

`cssSelector`, bir attribute css seçici oluşturmak için bir tuple'u destekler. İlk değer bir **attribute adı**dır, ikinci değer isteğe bağlıdır ve attribute'un istenen değerine işaret eder.

```ts
const el1 = ngMocks.find(['data-key']);
// bu, aşağıdakiyle aynıdır
const el2 = ngMocks.find('[data-key]');

el1 === el2; // true
```

```ts
const el1 = ngMocks.find(['data-key', 5]);
// bu, aşağıdakiyle aynıdır
const el2 = ngMocks.find('[data-key="5"]');

el1 === el2; // true
```