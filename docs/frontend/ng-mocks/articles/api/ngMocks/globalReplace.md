---
title: ngMocks.globalReplace
description: ng-mocks kütüphanesindeki ngMocks.globalReplace hakkında dokümantasyon. Bu özellik, mock modüller oluştururken değiştirilecek olan bildirimler ve modülleri işaret etmek amacıyla kullanılır. Kullanımı ve örnekleri ile ilgili detayları burada bulabilirsiniz.
keywords: [ngMocks, globalReplace, mock modüller, BrowserAnimationsModule, NoopAnimationsModule]
---

`ngMocks.globalReplace`, mock modüller oluştururken değiştirilecek olan bildirimler ve modülleri (ancak hizmetler ve tokenlar hariç) işaretler.

:::tip
En iyi uygulama olarak, `ngMocks.globalReplace` fonksiyonunu `jasmine` için `src/test.ts` veya `jest` için `src/setup-jest.ts` / `src/test-setup.ts` dosyalarında kullanmalısınız.
:::

Eğer `BrowserAnimationsModule`'u global olarak `NoopAnimationsModule` ile değiştirmek isteseydik,
bunu şu şekilde yapabilirdik:

```ts title="src/test.ts"
ngMocks.globalReplace(BrowserAnimationsModule, NoopAnimationsModule);
```

Artık `BrowserAnimationsModule`'u içe aktaran tüm mock modülleri, bunun yerine `NoopAnimationsModule`'a sahiptir.

:::info
`ngMocks.globalReplace` kullanarak yapılandırma yapmak, testlerinizde daha kararlı bir ortam sağlar. Özellikle animasyonları test etmek istemiyorsanız, bu değişiklik oldukça faydalı olacaktır.
::: 

```ts
// Another example of using globalReplace
ngMocks.globalReplace(SomeService, MockSomeService);
```

:::warning
Değişikliklerinize dikkat edin; global olarak yapılan değişiklikler, tüm testlerinizde etkili olacaktır. Yanlış bir modül değişikliği, beklenmedik sonuçlara yol açabilir.
:::