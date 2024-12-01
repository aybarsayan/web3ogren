---
title: ngMocks.revealAll
description: ng-mocks kütüphanesinden ngMocks.revealAll hakkında belge. Bu belge, `ngMocks.revealAll` fonksiyonunun nasıl çalıştığını ve kullanıldığını açıklar. Ayrıca, kullanıcıların bu fonksiyonu daha etkili bir şekilde kullanmaları için ipuçları ve örneklerle doludur.
keywords: [ngMocks, angular, testing, revealAll, input]
---

`ngMocks.revealAll`'ün davranışı `ngMocks.reveal` ile tekrar eder, ancak ilk uygun elemanı döndürmek yerine, `ngMocks.revealAll` tüm uygun elemanları toplar ve hepsini döndürür.

Aşağıdaki gibi bir şablonda:

```html
<app-form>
  <ng-container block="personal">
    <input appInput="firstName">
    <input appInput="lastName">
  </ng-container>
  <ng-container block="address">
    <input appInput="street">
    <input appInput="city">
    <input appInput="country">
  </ng-container>
</app-form>
```

:::info
Bu şablonda, `ngMocks.revealAll` ile formun içindeki tüm blokları ve ilgili girişleri alabiliriz.
:::

formu, blokları ve girişlerini aşağıdaki gibi alabiliriz:

```ts
// kökler
const formEl = ngMocks.reveal('app-form');
const personalEl = ngMocks.reveal(formEl, ['block', 'personal']);
const addressEl = ngMocks.reveal('app-form', ['block', 'address']);

// 2 eleman
const personalEls = ngMocks.revealAll(personalEl, AppInputDirective);

// 3 eleman
const addressEls = ngMocks.revealAll(addressEl, AppInputDirective);
```

:::tip
`ngMocks.revealAll` kullanırken, doğru elemanları aldığınızdan emin olun. Anlamlı sonuçlar elde etmek için, `AppInputDirective`'in doğru şekilde tanımlandığını kontrol edin.
:::