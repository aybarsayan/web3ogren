---
title: NGXS'nin Angular uygulamalarında nasıl test edileceği
description: Bu belge, Angular uygulamalarında NGXS'yi test etmenin en iyi yöntemlerini ve uygulamaları açıklamaktadır. NGXS, yönetim sağlamak için etkili bir araçtır ve doğru test yöntemleri ile kullanılmalıdır.
keywords: [NGXS, Angular, test, MockBuilder, NgxsModule]
---

Eğer modüllerinizde `NGXS`'yi taklit etmekten kaçınmanız gerekiyorsa, `.keep` kullanmalısınız.

```ts
beforeEach(() =>
   MockBuilder(TargetComponent, TargetModule)
     
     // NgxsModule.forRoot() TargetModule veya onun içe aktarımlarında çağrılır 
     .keep(NgxsModule.forRoot().ngModule) // tüm NgxsModule.forRoot'u korur
     
     // yalnızca modülünüz NgxsModule.forFeature'ı içe aktarıyorsa ekleyin
     // NgxsModule.forFeature() TargetModule veya onun içe aktarımlarında çağrılır
     .keep(NgxsModule.forFeature().ngModule) // tüm NgxsModule.forFeature'ı korur
     
     // store'un kök sağlayıcısını korur
     .keep(Store)
 );
```

:::tip
**İpucu:** NGXS'yi test ederken, `NgxsModule.forRoot()` ve `Store`'u korumayı unutmayın. Bu, uygulamanızın düzgün çalışmasını sağlamak için kritik öneme sahiptir.
:::

Eğer modülünüz yalnızca `NgxsModule.forFeature`'ı içe aktarıyorsa, `NgxsModule.forRoot()` ve `Store`'u manuel olarak eklemeniz gerekir:

```ts
beforeEach(() =>
   MockBuilder(
     // koru ve dışa aktar
     [
       TargetComponent,
       NgxsModule.forRoot(), // gerekli hizmetleri sağlar
       Store, // store'un kök sağlayıcısını korur
     ],
     // taklit
     TargetModule,
   ).keep(NgxsModule.forFeature().ngModule) // tüm NgxsModule.forFeature'ı korur
 );
```

:::info
**Ek Bilgi:** `NgxsModule.forRoot()` kullanmak, uygulamanızın durumu yönetme yeteneğini artırır. Bu nedenle, modül yapınıza göre doğru yüklemeleri yapmak önemlidir.
:::