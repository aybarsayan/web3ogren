---
title: isMockOf
description: ng-mocks kütüphanesinin isMockOf fonksiyonunun kullanımını ve gerekliliğini açıklayan bir dokümantasyon.
keywords: [ng-mocks, isMockOf, TypeScript, mock objesi, hata ayıklama, Angular]
---

`isMockOf`, `ng-mocks` araçlarını render etmek istediğimizde yardımcı olur, ancak TypeScript bir `instance`'ı mock objesi olarak tanımaz.

:::info
Bu durum, geliştirme sürecinde karşılaşabileceğiniz önemli bir noktadır. Aşağıdaki gibi bir hata aldığımızda bu gereklidir:
:::

```ts
// `instance`'ın
// `MockedModule<SomeClass>` örneği olup olmadığını kontrol eder
if (isMockOf(instance, SomeClass, 'm')) {
  // evet, öyle
}

// `instance`'ın
// `MockedComponent<SomeClass>` örneği olup olmadığını kontrol eder
if (isMockOf(instance, SomeClass, 'c')) {
  // evet, öyle
}

// `instance`'ın
// `MockedDirective<SomeClass>` örneği olup olmadığını kontrol eder
if (isMockOf(instance, SomeClass, 'd')) {
  // evet, öyle
}

// `instance`'ın
// `MockedPipe<SomeClass>` örneği olup olmadığını kontrol eder
if (isMockOf(instance, SomeClass, 'p')) {
  // evet, öyle
}

// `instance`'ın
// mock `SomeClass` örneği olup olmadığını kontrol eder
if (isMockOf(instance, SomeClass, 'p')) {
  // evet, öyle
}
```

:::tip
TypeScript ile çalışırken, `isMockOf` gibi fonksiyonlar kullanmak, kodunuzun sürdürülebilirliğini artırır ve hata ayıklama sürecinde size yardımcı olur.
:::