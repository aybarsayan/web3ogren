---
title: Angular uygulamasında bağımsız bir yönergeyi test etme
description: Bu belge, bağımsız bir Angular yönergesinin test edilmesine yönelik kapsamlı bir kılavuz sunmaktadır. Geliştiricilere, bağımsız yönergelerin nasıl test edileceği ve bağımlılıkların nasıl taklit edileceği konularında yardımcı olacaktır.
keywords: [Angular, bağımsız yönerge, test etme, MockBuilder, TestBed, ng-mocks, gelişim]
---

Burada bağımsız bir yönergeyi nasıl test edeceğinizi bulabilirsiniz.

:::info
Bir bağımsız yönerge, standart bir yönergenin aynı özellik setine sahiptir. Bağımsız bir yönerge, yalnızca kök hizmetler ve token'lar gibi olası bağımlılıklara sahiptir.
:::

Birim testinde, geliştiriciler böyle bağımlılıkları taklit etmeyi tercih ederler. `MockBuilder`, `TestBed`'i bu şekilde yapılandırmaya yardımcı olur.

Diyelim ki, aşağıdaki bağımsız yönergeye sahibiz:

```ts
@Directive({
  selector: 'standalone',
  standalone: true,
})
class StandaloneDirective implements OnInit {
  @Input() public readonly name: string | null = null;

  constructor(public readonly rootService: RootService) {}

  ngOnInit(): void {
    this.rootService.trigger(this.name);
  }
}
```

Gördüğümüz gibi, bağımsız yönerge `RootService`'i enjekte ediyor ve ideal olarak, hizmet taklit edilmelidir.

:::tip
`TestBed`'i yapılandırmak için aşağıdaki kodu kullanmalısınız:
:::

```ts
beforeEach(() => {
  return MockBuilder(StandaloneDirective);
});
```

Arka planda `StandaloneDirective`'i `kept` olarak işaretler ve `shallow` ve `export` bayraklarını ayarlar:

```ts
beforeEach(() => {
  return MockBuilder().keep(StandaloneDirective, {
    shallow: true,
    export: true,
  });
});
```

Artık `StandaloneDirective`'in tüm bağımlılıkları taklitlerdir ve yönergenin özellikleri, yöntemleri, enjekte edilenleri test için mevcut.

:::warning
Bir bağımlılığı korumanız gerekiyorsa, yalnızca `.keep` ile çağırın.
:::

Örneğin, `RootService`'i korumak istiyorsak, kod şu şekilde görünür:

```ts
beforeEach(() => {
  return MockBuilder(StandaloneDirective).keep(RootService);
});
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestStandaloneDirective/test.spec.ts&initialpath=%3Fspec%3DTestStandaloneDirective)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestStandaloneDirective/test.spec.ts&initialpath=%3Fspec%3DTestStandaloneDirective)

:::note
Aşağıdaki kod, bağımsız yönergeyi test etmek için örnek bir test senaryosudur.
:::

```ts title="https://github.com/help-me-mom/ng-mocks/tree/master/examples/TestStandaloneDirective/test.spec.ts"
import {
  Directive,
  Injectable,
  Input,
  OnInit,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

// Taklit etmek istediğimiz bir kök hizmet.
@Injectable({
  providedIn: 'root',
})
class RootService {
  trigger(name: string | null) {
    // çok havalı bir şey yapar

    return name;
  }
}

// Test edeceğimiz bir bağımsız yönerge.
@Directive({
  selector: 'standalone',
  standalone: true,
})
class StandaloneDirective implements OnInit {
  @Input() public readonly name: string | null = null;

  constructor(public readonly rootService: RootService) {}

  ngOnInit(): void {
    this.rootService.trigger(this.name);
  }
}

describe('TestStandaloneDirective', () => {
  beforeEach(() => {
    return MockBuilder(StandaloneDirective);
  });

  it('bağımlılıkları render eder', () => {
    // Yönergeyi render etme.
    MockRender(StandaloneDirective, {
      name: 'test',
    });

    // StandaloneDirective'in RootService.trigger'ı çağırdığını doğrulama.
    const rootService = ngMocks.findInstance(RootService);
    // bu autoSpy sayesinde mümkün.
    expect(rootService.trigger).toHaveBeenCalledWith('test');
  });
});
```