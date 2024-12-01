---
title: Angular uygulamasında bir sağlayıcının nasıl test edileceği
description: Angular sağlayıcısını testlerle kapsama. Bu kılavuz, Angular uygulamalarında sağlayıcıların nasıl etkili bir şekilde test edileceğini ve en iyi uygulamaları ele almaktadır.
keywords: [Angular, test, sağlayıcı, MockBuilder, ng-mocks, yazılım testi, birim testi]
---

Genellikle, basit bir sağlayıcıyı test etmek istiyorsanız `TestBed`'e ihtiyacınız yoktur, **en iyi yol izole edilmiş saf birim testleri yazmaktır**.

:::tip 
İyi bir ayrıştırma için her bir testi izole etmek, karmaşıklığı azaltacak ve bakımını kolaylaştıracaktır.
:::

Yine de, [`MockBuilder`](https://www.npmjs.com/package/ng-mocks#mockbuilder) burada yardımcı olabilir. Bir sağlayıcının karmaşık bağımlılıkları varsa veya modülün sağlayıcıyı belirli bir şekilde oluşturup oluşturmadığını doğrulamak istiyorsanız, sağlayıcıyı ilk parametre olarak ve modülünü ikinci parametre olarak geçmeniz gerekir.

```ts
beforeEach(() => MockBuilder(TargetService, TargetModule));
```

Bir testte, servis davranışını doğrulamak için hizmetin bir instance'ını almak için global enjektörü kullanmalısınız:

```ts
const service = TestBed.get(TargetService);
expect(service.echo()).toEqual(service.value);
```

Burada faydalı olabilecek şey, **bağımlılıkları nasıl özelleştireceğinizdir**. 3 seçenek bulunmaktadır: `.mock`, `.provide` ve `MockInstance`. Bunların hepsi iyi bir seçimdir:

```ts
beforeEach(() =>
  MockBuilder(TargetService, TargetModule)
    // Service2, TargetModule içinde sağlanmıştır / içe aktarılmıştır
    .mock(Service2, {
      trigger: () => 'mock2',
    })
    // Service3, TestBed içinde sağlanacaktır
    .provide({
      provide: Service3,
      useValue: {
        trigger: () => 'mock3',
      },
    })
);
```

```ts
beforeAll(() => {
  MockInstance(Service1, {
    init: instance => {
      instance.trigger = () => 'mock1';
    },
  });
});
```

:::info
Sağlayıcıların oluşturulma şekli ne olursa olsun: `useClass`, `useValue` vb. Testleri oldukça benzer.
:::

## Yaygın durumlar için canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProvider/test.spec.ts&initialpath=%3Fspec%3DTestProviderCommon)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProvider/test.spec.ts&initialpath=%3Fspec%3DTestProviderCommon)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProvider/test.spec.ts"
import { Injectable } from '@angular/core';

import { MockBuilder, MockRender } from 'ng-mocks';

// Basit bir hizmet, daha fazla mantık içerebilir,
// ancak bu test gösterimi için gereksizdir.
@Injectable()
class TargetService {
  public readonly value = true;

  public echo(): boolean {
    return this.value;
  }
}

describe('TestProviderCommon', () => {
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetService));

  it('echo üzerinde değeri döner', () => {
    const service = MockRender(TargetService).point.componentInstance;

    expect(service.echo()).toEqual(service.value);
  });
});
```

## Bağımlılıklarla canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProviderWithDependencies/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithDependencies)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProviderWithDependencies/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithDependencies)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProviderWithDependencies/test.spec.ts"
import { Injectable, NgModule } from '@angular/core';

import {
  MockBuilder,
  MockInstance,
  MockRender,
  MockReset,
} from 'ng-mocks';

// Bağımlılık 1
@Injectable()
class Service1 {
  protected name = 'service1';

  public trigger(): string {
    return this.name;
  }
}
// Bağımlılık 2
@Injectable()
class Service2 {
  protected name = 'service2';

  public trigger(): string {
    return this.name;
  }
}

// Basit bir hizmet, daha fazla mantık içerebilir,
// ancak bu test gösterimi için gereksizdir.
@Injectable()
class TargetService {
  public readonly value1: string;
  public readonly value2: string;

  public constructor(dep1: Service1, dep2: Service2) {
    this.value1 = dep1.trigger();
    this.value2 = dep2.trigger();
  }
}

// Tüm hizmetleri sağlayan bir modül.
@NgModule({
  providers: [Service1, Service2, TargetService],
})
class TargetModule {}

describe('TestProviderWithDependencies', () => {
  // Hizmeti test etmek istediğimiz için, MockBuilder'ın ilk
  // parametre olarak geçiyoruz. Bağımlılıklarını doğru şekilde tatmin etmek için
  // modülünü ikinci parametre olarak geçmemiz gerekiyor.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetService, TargetModule));

  beforeAll(() => {
    // Service1'in mock kopyasının davranışını biraz özelleştirelim.
    MockInstance(Service1, {
      init: instance => {
        instance.trigger = () => 'mock1';
      },
    });
    // Service2'nin mock kopyasının davranışını biraz özelleştirelim.
    MockInstance(Service2, {
      init: instance => {
        instance.trigger = () => 'mock2';
      },
    });
  });

  // MockInstance'dan özelleştirmeleri sıfırlar.
  afterAll(MockReset);

  it('TargetService oluşturur', () => {
    // Tüm bağımlılıklar mevcutsa yalnızca bir instance oluşturur.
    const service = MockRender(TargetService).point.componentInstance;

    // Davranışı doğrulayalım.
    expect(service.value1).toEqual('mock1');
    expect(service.value2).toEqual('mock2');
  });
});
```

## useClass için canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProviderWithUseClass/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseClass)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProviderWithUseClass/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseClass)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProviderWithUseClass/test.spec.ts"
import { Injectable, NgModule } from '@angular/core';

import {
  MockBuilder,
  MockInstance,
  MockRender,
  MockReset,
} from 'ng-mocks';

// useClass ile değiştirmek istediğimiz bir hizmet.
@Injectable()
class Service1 {
  public constructor(public name: string) {}
}

// Service1'i değiştiren bir hizmet.
@Injectable()
class Service2 extends Service1 {
  public readonly flag = true;
}

// Test etmek ve useClass ile değiştirmek istediğimiz bir hizmet.
@Injectable()
class Target1Service {
  public constructor(public readonly service: Service1) {}
}

// Target1Service'i değiştiren bir hizmet.
@Injectable()
class Target2Service extends Target1Service {
  public readonly flag = true;
}

// Tüm hizmetleri sağlayan bir modül.
@NgModule({
  providers: [
    {
      provide: 'real',
      useValue: 'real',
    },
    {
      deps: ['real'],
      provide: Service1,
      useClass: Service2,
    },
    {
      deps: [Service1],
      provide: Target1Service,
      useClass: Target2Service,
    },
  ],
})
class TargetModule {}

describe('TestProviderWithUseClass', () => {
  // Hizmeti test etmek istediğimiz için, MockBuilder'ın ilk
  // parametre olarak geçiyoruz. Bağımlılıklarını doğru şekilde tatmin etmek için
  // modülünü ikinci parametre olarak geçmemiz gerekiyor.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(Target1Service, TargetModule));

  beforeAll(() => {
    // Service1'in mock kopyasının davranışını biraz özelleştirelim.
    MockInstance(Service1, {
      init: instance => {
        instance.name = 'mock1';
      },
    });
  });

  // MockInstance'dan özelleştirmeleri sıfırlar.
  afterAll(MockReset);

  it('tüm bağımlılıkları dikkate alır', () => {
    const service = MockRender<
      Target1Service & Partial<Target2Service>
    >(Target1Service).point.componentInstance;

    // Hizmetin Target2Service'den bir bayrağa sahip olduğunu doğrulayalım.
    expect(service.flag).toBeTruthy();
    expect(service).toEqual(jasmine.any(Target2Service));

    // Ve Service1'in mock kopyasıyla değiştirildiğini ve adının undefined olduğunu doğrulayalım.
    expect(service.service.name).toEqual('mock1');
    expect(service.service).toEqual(jasmine.any(Service1));

    // Çünkü mock bir modül kullanıyoruz, Service1
    // `provide` sınıfına dayalı bir mock kopyasıyla
    // değiştirilmiştir, diğer değerler mock oluşturma mantığı tarafından göz ardı edilir.
    expect(service.service).not.toEqual(jasmine.any(Service2));
  });
});
```

## useValue için canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProviderWithUseValue/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseValue)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProviderWithUseValue/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseValue)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProviderWithUseValue/test.spec.ts"
import { Injectable, NgModule } from '@angular/core';

import { MockBuilder, MockRender } from 'ng-mocks';

// Basit bir hizmet, daha fazla mantık içerebilir,
// ancak bu test gösterimi için gereksizdir.
@Injectable()
class TargetService {
  public readonly name = 'target';
}

// Tüm hizmetleri sağlayan bir modül.
@NgModule({
  providers: [
    {
      provide: TargetService,
      // bunun yerine boş bir nesne
      useValue: {
        service: null,
      },
    },
  ],
})
class TargetModule {}

describe('TestProviderWithUseValue', () => {
  // Hizmeti test etmek istediğimiz için, MockBuilder'ın ilk
  // parametre olarak geçiyoruz. Doğru bir şekilde başlatmasını tatmin etmek için
  // modülünü ikinci parametre olarak geçmemiz gerekiyor.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetService, TargetModule));

  it('TargetService oluşturur', () => {
    const service =
      MockRender<TargetService>(TargetService).point
        .componentInstance;

    // Alınan verileri doğrulayalım.
    expect(service as any).toEqual({
      service: null,
    });
  });
});
```

## useExisting için canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProviderWithUseExisting/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseExisting)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProviderWithUseExisting/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseExisting)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProviderWithUseExisting/test.spec.ts"
import { Injectable, NgModule } from '@angular/core';

import {
  MockBuilder,
  MockInstance,
  MockRender,
  MockReset,
} from 'ng-mocks';

// Kullanmak istediğimiz bir hizmet.
@Injectable()
class Service1 {
  public name = 'target';
}

// Değiştirmek istediğimiz bir hizmet.
@Injectable()
class Service2 {
  public name = 'target';
}

// Test etmek ve useExisting ile değiştirmek istediğimiz bir hizmet.
@Injectable()
class TargetService {}

// Tüm hizmetleri sağlayan bir modül.
@NgModule({
  providers: [
    Service1,
    {
      provide: Service2,
      useExisting: Service1,
    },
    {
      provide: TargetService,
      useExisting: Service2,
    },
  ],
})
class TargetModule {}

describe('TestProviderWithUseExisting', () => {
  // Hizmeti test etmek istediğimiz için, MockBuilder'ın ilk
  // parametre olarak geçiyoruz. Doğru bir şekilde başlatmasını tatmin etmek için
  // modülünü ikinci parametre olarak geçmemiz gerekiyor.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetService, TargetModule));

  beforeAll(() => {
    // Service1'in mock kopyasının davranışını biraz özelleştirelim.
    MockInstance(Service2, {
      init: instance => {
        instance.name = 'mock2';
      },
    });
  });

  // MockInstance'dan özelleştirmeleri sıfırlar.
  afterAll(MockReset);

  it('TargetService oluşturur', () => {
    const service = MockRender<
      TargetService & Partial<{ name: string }>
    >(TargetService).point.componentInstance;

    // Service2 mock bir kopya ile değiştirildiği için,
    // burada Service1'in bir mock kopyasını alıyoruz.
    expect(service).toEqual(jasmine.any(Service2));
    // TargetService'i koruduğumuz için, burada useExisting'de olduğu gibi
    // Service2'nin bir mock kopyasını alıyoruz.
    expect(service.name).toEqual('mock2');
  });
});
```

## useFactory için canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProviderWithUseFactory/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseFactory)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProviderWithUseFactory/test.spec.ts&initialpath=%3Fspec%3DTestProviderWithUseFactory)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProviderWithUseFactory/test.spec.ts"
import { Injectable, NgModule } from '@angular/core';

import {
  MockBuilder,
  MockInstance,
  MockRender,
  MockReset,
} from 'ng-mocks';

// Bağımlılık 1.
@Injectable()
class Service1 {
  public name = 'target';
}

// Kullanmak istediğimiz bir hizmet.
@Injectable()
class TargetService {
  public constructor(public readonly service: Service1) {}
}

// Tüm hizmetleri sağlayan bir modül.
@NgModule({
  providers: [
    Service1,
    {
      deps: [Service1],
      provide: TargetService,
      useFactory: (service: Service1) => new TargetService(service),
    },
  ],
})
class TargetModule {}

describe('TestProviderWithUseFactory', () => {
  // Hizmeti test etmek istediğimiz için, MockBuilder'ın ilk
  // parametre olarak geçiyoruz. Doğru bir şekilde başlatmasını tatmin etmek için
  // modülünü ikinci parametre olarak geçmemiz gerekiyor.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetService, TargetModule));

  beforeAll(() => {
    // Service1'in mock kopyasının davranışını biraz özelleştirelim.
    MockInstance(Service1, {
      init: instance => {
        instance.name = 'mock1';
      },
    });
  });

  // MockInstance'dan özelleştirmeleri sıfırlar.
  afterAll(MockReset);

  it('TargetService oluşturur', () => {
    const service = MockRender(TargetService).point.componentInstance;

    // Service1 mock kopyasıyla değiştirildiği için, burada mock1'i almalıyız.
    expect(service.service.name).toEqual('mock1');
  });
});