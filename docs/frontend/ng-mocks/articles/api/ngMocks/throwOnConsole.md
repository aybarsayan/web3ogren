---
title: ngMocks.throwOnConsole
description: ng-mocks kütüphanesindeki ngMocks.throwOnConsole hakkında dokümantasyon. Bu işlev, `console.warn` ve `console.error` çağrılarını hata fırlatma mekanizması ile değiştirerek, Ivy etkin modda ortaya çıkan bazı sorunları çözer.
keywords: [ngMocks, throwOnConsole, console.warn, console.error, Ivy, hata fırlatma]
---

`ngMocks.throwOnConsole`, `console.warn` ve `console.error` işlevlerini, hata yerine konsola basmak yerine bir hata fırlatacak şekilde yerleştirir. Bu, bazı hataların fırlatılmak yerine `console` üzerinden basıldığı için **Ivy** etkin modda faydalıdır.

:::info
`ngMocks.throwOnConsole` kullanarak, hata mesajlarınızı daha görünür hale getirebilir ve testlerinizdeki hata ayıklamayı kolaylaştırabilirsiniz.
:::

`ngMocks.throwOnConsole`, mevcut test grubu için işlevleri `beforeAll` içinde yerleştirir ve `afterAll` içinde geri yükler. 

:::tip
Testlerinizde kullanılmadan önce, `ngMocks.throwOnConsole` işlevinin doğru bir şekilde yapılandırıldığından emin olun.
:::

Ayrıca, başka herhangi bir yöntem de sahteleyebilir:

```ts
ngMocks.throwOnConsole('log');
```

> Unutmayın, bu işlevin amacı testlerinizi daha sağlam hale getirmek ve hata yönetiminizi geliştirmektir.  
> — ngMocks Kılavuzu




Detaylı Bilgi

`ngMocks.throwOnConsole` işlevi, belirli senaryolarda konsola basan hataları, uygulamanızın daha tutarlı bir şekilde hata iletileri sağlamasına yardımcı olmak için kullanılır.

