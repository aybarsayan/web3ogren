---
title: "TypeError Tanımsız subscribe özelliğini okuyamıyorum hatasını nasıl düzeltirim"
description: Tanımsız subscribe özelliğini okuyamıyor hatasıyla karşılaştığınızda Angular testleri için bir çözüm. Bu kılavuzda, hata ile başa çıkma yöntemleri ve olası çözüm yolları detaylı biçimde ele alınıyor. 
keywords: [Angular, TypeError, subscribe, test, mock]
---

Bu sorun, **bir şeyin bir mock nesne ile değiştirilmiş olduğunu** ve observable akışları yerine sahte bir sonuç (`undefined`) döndürdüğünü gösterir.

:::info
Bu hata için bir cevap, bir mock servisi tarafından tetiklenmişse ve özelliği `undefined` türündeyse, `Gözlemlerin nasıl taklit edileceği` bölümünde bulunmaktadır.
:::

Ya da eğer hata bir mock bileşen veya mock direktifi tarafından neden olmuşsa `MockInstance` veya `ngMocks.defaultMock` inceleyebilirsiniz.

## Angular Material UI

Eğer `ng-mocks` ile `Angular Material UI` kullanıyorsanız ve bir mat modülünü korumanız gerekiyorsa, 
ama bu `TypeError: Tanımsız değerlerin özelliklerini okuyamıyorum (subscribe okuma)` hatasına neden oluyorsa:

> Büyük olasılıkla, bu, kullanılan modülün, varsayılan olarak `ng-mocks` tarafından mock’lanan bir kök sağlayıcı kullandığını gösterir.  
> — Tanımsız değer durumu

Bunu çözmek için 2 seçeneğiniz var: **kök sağlayıcıların mock’lanmasını atlamak** veya hangi mock sağlayıcının soruna neden olduğunu bulmak ve bu mock’un `undefined` yerine `Observable` döndürmesi için özelleştirmek.

### Kök sağlayıcıların mock’lanmasını atlamak

Kök sağlayıcıların mock’lanmasını atlamak için basitçe
`MockBuilder` tanımınıza `.keep(NG_MOCKS_ROOT_PROVIDERS)` ekleyin:

```ts
import { MockBuilder, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';

describe('suite', () => {
  beforeEach(() => MockBuilder(YourComponent, ItsModule)
    .keep(MatBadgeModule) // veya diğer bir MatModule
    .keep(NG_MOCKS_ROOT_PROVIDERS) // <- düzeltme
  );
});
```

### Bir mock’u özelleştirmek

Bir mock’u özelleştirmek için `EMPTY` ve `ngMocks.defaultMock` kullanabilirsiniz:

```ts title="src/test.ts"
import { EMPTY } from 'rxjs';
import { ngMocks } from 'ng-mocks';

ngMocks.defaultMock(BreakpointObserver, () => ({
  observe: jasmine.createSpy().and.returnValue(EMPTY),
}));
```


Daha Fazla Bilgi

Bu yöntemlerle hata ile başa çıkmak, Angular uygulamalarınızda daha sağlam testler yazmanıza yardımcı olacaktır. Unutmayın, her zaman mock nesnelerinizi ve sağlayıcılarınızı iyi yapılandırdığınızdan emin olun.

