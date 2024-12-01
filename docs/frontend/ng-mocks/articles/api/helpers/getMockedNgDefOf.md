---
title: getMockedNgDefOf
description: ng-mocks kütüphanesinden getMockedNgDefOf hakkında dokümantasyon. Bu işlev, TestBedde yapılandırılmış bileşenlerin veya direktiflerin sahte sınıflarını almak için kullanılır ve test süreçlerini kolaylaştırır.
keywords: [ng-mocks, TestBed, getMockedNgDefOf, sahte sınıf, Angular testleri]
---

`getMockedNgDefOf`, **bir testte** TestBed'de yapılandırılmış bir şeyin **sahte sınıfını almak istediğimizde** yardımcı olur.

```ts
// mevcut bir `MockedModule<SomeClass>` nesnesini döndürür
const mockModule = getMockedNgDefOf(SomeClass, 'm');

// mevcut bir `MockedComponent<SomeClass>` nesnesini döndürür
const mockComponent = getMockedNgDefOf(SomeClass, 'c');

// mevcut bir `MockedDirective<SomeClass>` nesnesini döndürür
const mockDirective = getMockedNgDefOf(SomeClass, 'd');

// mevcut bir `MockedPipe<SomeClass>` nesnesini döndürür
const mockPipe = getMockedNgDefOf(SomeClass, 'p');

// mevcut bir `SomeClass` sahte sınıfını döndürür
const mock = getMockedNgDefOf(SomeClass);
```

:::tip
`getMockedNgDefOf` işlevi ile çeşitli sahte sınıfları alarak testlerinizde esneklik sağlayabilirsiniz. Her bir tür için uygun parametreleri kullandığınızdan emin olun.
:::

:::info
Bu işlev, özellikle **Angular testleri** sırasında **sahte bileşenler** oluşturmak için oldukça kullanışlıdır ve testlerinizi daha etkili hale getirir.
:::

:::warning
Sahte sınıfları kullanırken, gerçek bileşenlerin davranışlarını doğru bir şekilde simüle ettiğinizden emin olun. Aksi takdirde, test sonuçlarınız yanıltıcı olabilir.
:::

> "Bu işlev, sahte bileşen veya direktif tanımlamalarını kolaylaştırarak test süreçlerinizi hızlandırır." — ng-mocks Kütüphanesi


Ek Bilgi

`getMockedNgDefOf` tarafından döndürülen nesneler, mevcut Angular bileşenleri ve direktifleri için gerçekçi test senaryoları oluşturmanıza yardımcı olur.

