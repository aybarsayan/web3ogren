---
title: isMockedNgDefOf
description: Documentation about isMockedNgDefOf from ng-mocks library, which is used to verify whether a class is actually a mock class or not. This guide covers the various methods of checking mocks against different Angular constructs.
keywords: [ng-mocks, isMockedNgDefOf, mock class, Angular, testing, verification]
---

`isMockedNgDefOf`, bir sınıfın gerçekten bir mock sınıfı olup olmadığını doğrulamak için kullanılır.

:::info
**Tip:** `isMockedNgDefOf` method is particularly useful when working with Angular applications to ensure that your tests accurately reflect the state of your components, services, and directives.
:::

```ts
// `MockClass`'ın
// `SomeClass`'ın bir mock sınıfı ve bir modül olup olmadığını kontrol eder
if (isMockedNgDefOf(MockClass, SomeClass, 'm')) {
  // evet, öyle
}

// `MockClass`'ın
// `SomeClass`'ın bir mock sınıfı ve bir bileşen olup olmadığını kontrol eder
if (isMockedNgDefOf(MockClass, SomeClass, 'c')) {
  // evet, öyle
}

// `MockClass`'ın
// `SomeClass`'ın bir mock sınıfı ve bir direktif olup olmadığını kontrol eder
if (isMockedNgDefOf(MockClass, SomeClass, 'd')) {
  // evet, öyle
}

// `MockClass`'ın
// `SomeClass`'ın bir mock sınıfı ve bir pip olup olmadığını kontrol eder
if (isMockedNgDefOf(MockClass, SomeClass, 'p')) {
  // evet, öyle
}

// `MockClass`'ın
// `SomeClass`'ın bir mock sınıfı olup olmadığını kontrol eder
if (isMockedNgDefOf(MockClass, SomeClass)) {
  // evet, öyle
}
```

:::tip
**Öneri:** Mock sınıflarını test ederken, her bir bileşen tipi için (`m`, `c`, `d`, `p`) ayrı kontroller koyarak kapsamlı test senaryoları oluşturabilirsiniz.
:::


Detaylar
`isMockedNgDefOf` ile ilgili daha fazla bilgi ve örnek kullanım için ng-mocks belgelerini kontrol edin.


--- 

Bu yöntem, test ettiğiniz öğelerin beklenildiği gibi çalıştığını doğrulamak için mükemmel bir yoldur. `isMockedNgDefOf` kullanarak, potansiyel sorunları önceden belirleyebilir ve uygulamanızın kalitesini artırabilirsiniz.