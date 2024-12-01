---
title: Angular uygulamasında bağımsız bir pipenin nasıl test edileceği
description: Bağımsız bir Angular pipeni test etmenin yolları ve örnek kodlar ile kapsamlı açıklamalar. Uygulama üzerinden pratik örneklerle bağımsız pipe test edildiğinde dikkate alınması gereken noktaları keşfedin.
keywords: [Angular, bağımsız pipe, test, MockBuilder, RootService, ng-mocks]
---

Bağımsız bir pipe, normal bir pipe ile karşılaştırıldığında pek çok farklılık göstermez.  
Hiçbir bağımlılığı içe aktaramaz, yalnızca kök sağlayıcıları enjekte edebilir.  
Kök sağlayıcılarını taklit etmek için `MockBuilder` kullanılabilir.


Bağımsız Pipe Örneği

Aşağıdaki bağımsız pipe'ı hayal edelim:

```ts
@Pipe({
  name: 'standalone',
  standalone: true,
})
class StandalonePipe implements PipeTransform {
  constructor(public readonly rootService: RootService) {}

  transform(value: string): string {
    return this.rootService.trigger(value);
  }
}
```

Gördüğümüz gibi, `RootService`'i enjekte ediyor, bu da birim testlerinde taklit edilmelidir.



:::tip
Kök bağımlılıkların doğru bir şekilde taklit edilmesi, testlerin güvenilirliğini artırır.
:::

Aşağıdaki kod ile yapılandırmak mümkündür:

```ts
beforeEach(() => {
  return MockBuilder(StandalonePipe);
});
```

Artık `StandalonePipe`'ın tüm kök bağımlılıkları taklitlerdir,  
ve pipenin özellikleri, yöntemleri, enjekte edilenleri test için mevcuttur.

:::info
Bir bağımlılığı korumanız gerekiyorsa, onu `.keep` ile basitçe çağırabilirsiniz.
:::

Örneğin, `RootService`'i korumak isteseydik, kod şöyle görünürdü:

```ts
beforeEach(() => {
  return MockBuilder(StandalonePipe).keep(RootService);
});
```

## Canlı örnek

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestStandalonePipe/test.spec.ts&initialpath=%3Fspec%3DTestStandalonePipe)
- [StackBlitz'de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestStandalonePipe/test.spec.ts&initialpath=%3Fspec%3DTestStandalonePipe)

```ts title="https://github.com/help-me-mom/ng-mocks/tree/master/examples/TestStandalonePipe/test.spec.ts"
import {
  Injectable,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  MockBuilder,
  MockInstance,
  MockRender,
  ngMocks,
} from 'ng-mocks';

// Taklit etmek istediğimiz bir kök hizmet.
@Injectable({
  providedIn: 'root',
})
class RootService {
  trigger(name: string) {
    // çok harika bir şey yapar

    return name;
  }
}

// Test edeceğimiz bir bağımsız pipe.
@Pipe({
  name: 'standalone',
  standalone: true,
})
class StandalonePipe implements PipeTransform {
  constructor(public readonly rootService: RootService) {}

  transform(value: string): string {
    return this.rootService.trigger(value);
  }
}

describe('TestStandalonePipe', () => {
  // Her testten sonra sıfırlanacak taklitler için bir bağlam oluşturur.
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(StandalonePipe);
  });

  it('bağımlılıkları render eder', () => {
    // RootService'in ne yaptığını özelleştirmek.
    MockInstance(
      RootService,
      'trigger',
      jasmine.createSpy(),
    ).and.returnValue('mock');

    // Pipe'i render etmek.
    const fixture = MockRender(StandalonePipe, {
      $implicit: 'test',
    });

    // StandalonePipe'in RootService.trigger'ı çağırdığını doğrulama.
    const rootService = ngMocks.findInstance(RootService);
    // Bu, autoSpy sayesinde mümkündür.
    expect(rootService.trigger).toHaveBeenCalledWith('test');

    // StandalonePipe'in RootService'in sonucunu render ettiğini doğrulama.
    expect(ngMocks.formatText(fixture)).toEqual('mock');
  });
});
```