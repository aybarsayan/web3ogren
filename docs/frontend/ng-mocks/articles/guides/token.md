---
title: Angular uygulamasında bir token nasıl test edilir
description: Angular token'ını testler ile kapsamak. Bu makalede, test süreçleri için gereken yapılandırmalar ve en iyi uygulamalar anlatılmaktadır.
keywords: [Angular, token, test, MockBuilder, ng-mocks, TestBed, ServiceExisting]
---

Angular uygulamasında token'ların doğru test edilmesi için, uygulamadaki kullanımlarına kıyasla ek bildirimler gereklidir.

Bir token bir fabrika fonksiyonuna sahip olabileceği için, uygulamanın başarılı bir şekilde çalışması için token'ı sağlayıcılara listelemek her zaman gerekli değildir. 

:::warning
Maalesef, test için durum böyle değildir ve bu durumda `ng-mocks` token'ı tespit edemez. Lütfen, token ve bağımlılıklarının ilgili modülün sağlayıcıları içinde listelendiğinden emin olun, böylece `ng-mocks` bunları doğru şekilde sahteleyebilir.
:::

`TestBed` yapılandırması, ilk parametresi test etmek istediğimiz token ve ikinci parametresi modül olan [`MockBuilder`](https://www.npmjs.com/package/ng-mocks#mockbuilder) aracılığıyla yapılmalıdır.

```ts
beforeEach(() => MockBuilder(TOKEN_EXISTING, TargetModule));
```

`useExisting` bayrağı ile bir token test ediyorsanız, göstericinin korunmadığı sürece sahte yapılacağını aklınıza getirmelisiniz.

```ts
beforeEach(() =>
  MockBuilder(TOKEN_EXISTING, TargetModule)
    // ServiceExisting TargetModule içinde sağlanmıştır / içe aktarılmıştır
    .keep(ServiceExisting)
);
```

Bir testte token'ı alıp değerini doğrulamamız gerekiyor.

```ts
const token = TestBed.get(TOKEN_EXISTING);
expect(token).toEqual(jasmine.any(ServiceExisting));
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestToken/test.spec.ts&initialpath=%3Fspec%3DTestToken)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestToken/test.spec.ts&initialpath=%3Fspec%3DTestToken)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestToken/test.spec.ts"
import { Injectable, InjectionToken, NgModule } from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

const TOKEN_CLASS = new InjectionToken('CLASS');
const TOKEN_EXISTING = new InjectionToken('EXISTING');
const TOKEN_FACTORY = new InjectionToken('FACTORY');
const TOKEN_VALUE = new InjectionToken('VALUE');

class ServiceClass {
  public readonly name = 'class';
}

@Injectable()
class ServiceExisting {
  public readonly name = 'existing';
}

// Tüm hizmetleri sağlayan bir modül.
@NgModule({
  providers: [
    ServiceExisting,
    {
      provide: TOKEN_CLASS,
      useClass: ServiceClass,
    },
    {
      provide: TOKEN_EXISTING,
      useExisting: ServiceExisting,
    },
    {
      provide: TOKEN_FACTORY,
      useFactory: () => 'FACTORY',
    },
    {
      provide: TOKEN_VALUE,
      useValue: 'VALUE',
    },
  ],
})
class TargetModule {}

describe('TestToken', () => {
  ngMocks.faster();

  // Token'ları test etmek istediğimiz için, MockBuilder'daki .keep içinde
  // bunları geçiriyoruz. Doğru şekilde başlatmalarını sağlamak için
  // ikinci parametre olarak modülünü geçmemiz gerekiyor.
  beforeEach(() => {
    return MockBuilder(
      [TOKEN_CLASS, TOKEN_EXISTING, TOKEN_FACTORY, TOKEN_VALUE],
      TargetModule,
    );
  });

  it('TOKEN_CLASS yaratır', () => {
    const token =
      MockRender<ServiceClass>(TOKEN_CLASS).point.componentInstance;

    // Token'ın ServiceClass örneği olduğunu doğrulamak.
    expect(token).toEqual(jasmine.any(ServiceClass));
    expect(token.name).toEqual('class');
  });

  it('TOKEN_EXISTING yaratır', () => {
    const token =
      MockRender<ServiceExisting>(TOKEN_EXISTING).point
        .componentInstance;

    // Token'ın ServiceExisting örneği olduğunu doğrulamak.
    // Ancak, sahte bir kopya ile değiştirildiği için,
    // boş bir isim görmeliyiz.
    expect(token).toEqual(jasmine.any(ServiceExisting));
    expect(token.name).toBeUndefined();
  });

  it('TOKEN_FACTORY yaratır', () => {
    const token = MockRender(TOKEN_FACTORY).point.componentInstance;

    // Yaratılan fabrikanın burada olup olmadığını kontrol etme.
    expect(token).toEqual('FACTORY');
  });

  it('TOKEN_VALUE yaratır', () => {
    const token = MockRender(TOKEN_VALUE).point.componentInstance;

    // Ayarlanmış değeri kontrol etme.
    expect(token).toEqual('VALUE');
  });
});