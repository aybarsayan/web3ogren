---
title: ngMocks.globalMock
description: ng-mocks kütüphanesindeki ngMocks.globalMock ile ilgili belgeler. Bu doküman, ngMocks.globalMock ile korunan modüllerdeki bildirimleri, hizmetleri ve token'ları nasıl taklit edeceğinizi açıklar. Ayrıca, en iyi uygulamaları ve örnek kullanım senaryolarını içerir.
keywords: [ngMocks, globalMock, Jasmine, Jest, mock, Angular, test]
---

`ngMocks.globalMock`, mock modülleri oluştururken, korunan modüllerde yer alan bildirimleri, hizmetleri ve token'ları taklit edileceğini işaretler.

:::tip
**İpucu:** En iyi uygulama olarak, bu işlemi `jasmine` için `src/test.ts`, veya `jest` için `src/setup-jest.ts` / `src/test-setup.ts` dosyalarında yapmanız önerilir.
:::

`APP_URL` token'ını korunan modüllerinde taklit edilmesi için işaretleyelim.

```ts title="src/test.ts"
ngMocks.globalKeep(AppModule);
ngMocks.globalMock(APP_URL);
ngMocks.defaultMock(APP_URL, () => 'mock');
```

```ts title="src/test.spec.ts"
// ...
MockModule(AppModule);
// ...
const url = TestBed.inject(APP_URL);
// ...
```

> `url` değeri `mock`'tir.  
> — Kullanıcı Yorumları

:::info
**Ek Bilgi:** Yalnızca korunan modüllerin taklit edilmesi gerektiğini unutmayın, aksi halde beklenmedik sonuçlar alabilirsiniz.
:::


Daha Fazla Bilgi

`ngMocks.globalMock`, modüller arasında bir bütünlük sağlayarak test süreçlerini kolaylaştırır. Farklı ortamlar için çeşitli konfigürasyonlar yaparak, uygulamanızın öngörülemez elemanlarını kontrol altında tutabilirsiniz.
 

--- 

Bunu yapmanın en iyi yeri yukarıda belirtilen dosyalardır.