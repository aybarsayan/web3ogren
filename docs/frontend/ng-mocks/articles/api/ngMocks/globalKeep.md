---
title: ngMocks.globalKeep
description: ng-mocks kütüphanesi hakkında ngMocks.globalKeep dokümantasyonu. Bu belge, mock modülleri oluştururken dikkat edilmesi gereken önemli noktaları ele almaktadır. Ayrıca, token'ların nasıl korunacağı konusunda pratik bilgiler sunmaktadır.
keywords: [ngMocks, mock, Angular, testing, jasmine, jest, modules]
---

`ngMocks.globalKeep`, mock modülleri oluştururken mocklama sürecinden kaçınılması gereken açıklamaları, servisleri ve token'ları işaretler.

Bunu yapmak için en iyi yer `jasmine` için `src/test.ts`, ya da `jest` için `src/setup-jest.ts` / `src/test-setup.ts` dosyasıdır.

:::tip
Mock modüllerinde kullanılması gereken token'ları belirtmek, testlerinizin güvenilirliğini artıracaktır.
:::

`APP_URL` token'ını mock modüllerinde korunacak şekilde işaretleyelim.

```ts title="src/test.ts"
ngMocks.globalKeep(APP_URL);
```

```ts title="src/test.spec.ts"
// ...
MockModule(ModuleWithService);
// ...
const url = TestBed.inject(APP_URL);
// ...
```

:::info
`url` orijinal olandır. Bu yaklaşım, uygulamanızın farklı parçalarındaki bağlılıkları yönetmenize yardımcı olur.
:::

> "Mock modüllerinin düzgün bir şekilde yapılandırılması, test süreçlerinizin etkinliğini artırır."  
> — ngMocks Dokümantasyonu


Ekstra Bilgi
`ngMocks.globalKeep`, Angular testleri sırasında belirli bağımlılıkların korunmasını sağlamak için etkili bir yöntemdir.


--- 

`url` orijinal olandır.