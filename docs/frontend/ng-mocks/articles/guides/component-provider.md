---
title: Angular uygulamasında bir bileşenin sağlayıcısını test etme
description: Bir Angular bileşeninin sağlayıcısını testlerle kapsama. Bu kılavuz, sağlanan hizmetlerin test edilmesi için gerekli adımları ve en iyi uygulamaları sunmaktadır.
keywords: [Angular, test, sağlayıcı, bileşen, MockBuilder, ng-mocks, test hizmeti]
---

Test etmek için sağlayıcıları olan bir bileşenimiz varsa, sağlayıcı dışında her şeyi taklit etmemiz gerekir:

```ts
beforeEach(() => MockBuilder(TargetService, TargetComponent));
```

:::info
Bu kod, `TargetComponent`'ın taklit bir kopyası ile `TestBed`'i kuracak, ancak `TargetService`'i olduğu gibi bırakacak, böylece onu doğrulayabileceğiz.
:::

Testte, taklit bileşeni render etmemiz, fixture'da onun öğesini bulmamız ve öğeden servisi çıkarmamız gerekiyor. [`MockRender`](https://www.npmjs.com/package/ng-mocks#mockrender) kullanıyorsak, bileşenin öğesine `fixture.point` aracılığıyla erişebiliriz.

```ts
const fixture = MockRender(TargetComponent);
const service = fixture.point.injector.get(TargetService);
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProviderInComponent/test.spec.ts&initialpath=%3Fspec%3DTestProviderInComponent)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProviderInComponent/test.spec.ts&initialpath=%3Fspec%3DTestProviderInComponent)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProviderInComponent/test.spec.ts"
import { Component, Injectable } from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

// Basit bir servis, daha fazla mantık içerebilir,
// ancak test gösterimi için gereksizdir.
@Injectable()
class TargetService {
  public readonly value = 'target';
}

@Component({
  providers: [TargetService],
  selector: 'target',
  template: '{{ service.value }}',
})
class TargetComponent {
  public constructor(public readonly service: TargetService) {}
}

describe('TestProviderInComponent', () => {
  // Servisi test etmek istediğimiz için, MockBuilder'ın
  // ilk parametresi olarak geçiyoruz.
  // TargetComponent ile ilgilenmediğimiz için, onu
  // taklit bir kopya ile değiştirmek üzere ikinci parametre olarak
  // geçiyoruz. MockBuilder'ın promise'ini döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetService, TargetComponent));

  it('bileşen aracılığıyla servise erişime sahiptir', () => {
    // Taklit bileşeni render edelim. Servise erişim
    // sağlayan bir nokta sunar.
    const fixture = MockRender(TargetComponent);

    // Bileşenin öğesi fixture.point'tır.
    // Şimdi ngMocks.get kullanarak iç hizmetleri çıkarabiliriz.
    const service = ngMocks.get(fixture.point, TargetService);

    // İşte buradayız, şimdi servisle ilgili her şeyi
    // doğrulayabiliriz.
    expect(service.value).toEqual('target');
  });
});
```

:::tip
Bileşen testleri yazarken, her zaman taklit bileşenlerin ve hizmetlerin nasıl çalıştığını göz önünde bulundurun. Bu, testlerinizin doğruluğunu artıracaktır.
:::