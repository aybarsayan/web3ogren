---
title: isNgInjectionToken
description: ng-mocks kütüphanesindeki isNgInjectionToken hakkında dökümantasyon. Bu içerik, isNgInjectionToken'un ne olduğunu ve nasıl kullanılacağını açıklamaktadır. Kullanıcılar, bu fonksiyonu uygulamalarında nasıl etkin bir şekilde entegre edebileceklerine dair örnekler bulacaklardır.
keywords: [ng-mocks, isNgInjectionToken, Angular, token, kütüphane, dokümantasyon, geliştirme]
---

`isNgInjectionToken`, bir nesnenin bir token olup olmadığını doğrular.

:::tip
Fonksiyonu kullanmadan önce, `TOKEN`'ın gerçekten bir token olup olmadığını kontrol etmek iyi bir uygulamadır.
:::

```ts
if (isNgInjectionToken(TOKEN)) {
  // bir şeyler yap
}
```

:::info
`isNgInjectionToken` fonksiyonu, Angular uygulamalarında bağımlılık enjeksiyonu sırasında sıkça kullanılır. Token'lar, bağımlılıkların doğru bir şekilde alınmasını sağlamak için kritik öneme sahiptir.
:::