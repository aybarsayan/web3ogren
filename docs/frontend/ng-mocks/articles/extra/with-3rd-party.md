---
title: 3. taraf kütüphanelerle kullanım
description: ng-mocks'ın diğer kütüphaneler ve çatılarla entegrasyonu. Bu belgede, `ng-mocks` ile `@ngneat/spectator` ve `@testing-library/angular` kullanarak bileşenlerin nasıl mock'lanacağı açıklanmaktadır.
keywords: [ng-mocks, Angular, ngneat/spectator, testing-library/angular, mock'lama, bileşen testleri]
---

`ng-mocks`, geliştiricilerin diğer **Angular test kütüphanelerini** kullanmalarını ve aynı zamanda **bağımlılıkları mock'lara dönüştürmelerine** olanak tanıyan `ngMocks.guts` ve `MockBuilder` aracılığıyla esneklik sağlar.

## `@ngneat/spectator`

Örneğin, [`@ngneat/spectator`](https://www.npmjs.com/package/@ngneat/spectator) içinde `createHostFactory`, `createComponentFactory`, `createDirectiveFactory` gibi fonksiyonları mock'alamak gerekiyorsa, `ng-mocks`'tan iki seçeneği kullanabilirsiniz: `ngMocks.guts` ve `MockBuilder`.

### `@ngneat/spectator` ve `ngMocks.guts`

Eğer `ngMocks.guts` kullanıyorsak, ilk parametre olarak istenen bileşeni geçmemiz ve ikinci parametre olarak da onun modülünü geçerek iç yapılarını çıkarıp mock'lamamız gerekiyor.

```ts
const dependencies = ngMocks.guts(MyComponent, ItsModule);
const createComponent = createComponentFactory({
  component: MyComponent,
  ...dependencies,
});
```


**İpuçları**

:::tip
`ngMocks.guts` kullanırken, bileşenin ve modülün eksiksiz seçimini yapmak önemli bir adımdır. Esnekliğinizden yararlandığınızdan emin olun.
:::


### `@ngneat/spectator` ve MockBuilder

Eğer `MockBuilder` kullanıyorsak, o zaman ihtiyaç duyduğumuz şeyi basitçe inşa ederiz. `MyComponent` korunurken, `ItsModule`'in tüm beyanları, içe aktarımları ve dışa aktarımları mock'lanır.

```ts
const dependencies = MockBuilder(MyComponent, ItsModule).build();

const createComponent = createComponentFactory({
  component: MyComponent,
  ...dependencies,
});
```

:::info
Lütfen, bunun ayrıca bağımsız bileşenleri, direktifleri ve boruları kapsadığını unutmayın. `StandaloneComponent`'in tüm içe aktarımları mock'lanacak, ancak bileşen test için olduğu gibi kullanılabilir durumda olacaktır.
:::

```ts
const dependencies = MockBuilder(StandaloneComponent).build();

const createComponent = createComponentFactory({
  component: StandaloneComponent,
  ...dependencies,
});
```

Kârlı.

## @testing-library/angular

Aynı durum [`@testing-library/angular`](https://www.npmjs.com/package/@testing-library/angular) için de geçerlidir.

### @testing-library/angular ve ngMocks.guts

`ngMocks.guts` durumunda:

```ts
const dependencies = ngMocks.guts(MyComponent, ItsModule);
await render(MyComponent, dependencies);
```

### @testing-library/angular ve MockBuilder

`MockBuilder` durumunda:

```ts
const dependencies = MockBuilder(MyComponent, ItsModule).build();
await render(MyComponent, dependencies);
```