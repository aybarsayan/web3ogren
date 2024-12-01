---
title: Angular uygulamasında çoklu token testi nasıl yapılır
description: Çoklu token'ları test etmek, Angular uygulamalarında önemli bir adımdır. Bu makalede, token'ların nasıl doğru bir şekilde test edilebileceğine dair bir yaklaşım sunulmaktadır.
keywords: [Angular, çoklu token, test, TestBed, MockBuilder]
---

Eğer `"Bir token nasıl teste tabi tutulur"` makalesini okumadıysanız, lütfen önce onu okuyun.

:::tip 
Çoklu token'ları test ederken, `TestBed.get`'in token ile eşleşen tüm sağlayıcıların bir dizisini döndürdüğünü unutmayın.
:::

Çoklu token'ları test etmek, `TestBed.get`'in token ile eşleşen tüm sağlayıcıların bir dizisini döndürmesi dışında oldukça benzerdir.

```ts
const values = TestBed.get(TOKEN_MULTI);
expect(values).toEqual(jasmine.any(Array));
expect(values.length).toEqual(4);
```

## Canlı örnek

- [CodeSandbox üzerinde deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestMultiToken/test.spec.ts&initialpath=%3Fspec%3DTestMultiToken)
- [StackBlitz üzerinde deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestMultiToken/test.spec.ts&initialpath=%3Fspec%3DTestMultiToken)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestMultiToken/test.spec.ts"
import { Injectable, InjectionToken, NgModule } from '@angular/core';

import { MockBuilder, MockRender } from 'ng-mocks';

const TOKEN_MULTI = new InjectionToken('MULTI');

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
      multi: true,
      provide: TOKEN_MULTI,
      useClass: ServiceClass,
    },
    {
      multi: true,
      provide: TOKEN_MULTI,
      useExisting: ServiceExisting,
    },
    {
      multi: true,
      provide: TOKEN_MULTI,
      useFactory: () => 'FACTORY',
    },
    {
      multi: true,
      provide: TOKEN_MULTI,
      useValue: 'VALUE',
    },
  ],
})
class TargetModule {}

describe('TestMultiToken', () => {
  // Token'ı test etmek istediğimiz için, onu MockBuilder'ın birinci
  // parametresi olarak geçiyoruz. Doğru bir şekilde başlatmasını
  // sağlamak için modülünü ikinci parametre olarak geçmemiz gerekiyor.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TOKEN_MULTI, TargetModule));

  it('TOKEN_MULTI oluşturur', () => {
    const tokens =
      MockRender<any[]>(TOKEN_MULTI).point.componentInstance;

    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(4);

    // Token'ın ServiceClass'ın bir örneği olduğunu doğruluyoruz.
    expect(tokens[0]).toEqual(jasmine.any(ServiceClass));
    expect(tokens[0].name).toEqual('class');

    // Token'ın ServiceExisting'ın bir örneği olduğunu doğruluyoruz.
    // Fakat mock kopyası ile değiştirildiği için
    // boş bir isim görmeliyiz.
    expect(tokens[1]).toEqual(jasmine.any(ServiceExisting));
    expect(tokens[1].name).toBeUndefined();

    // Burada fabrikamızın yarattığını kontrol ediyoruz.
    expect(tokens[2]).toEqual('FACTORY');

    // Ayarlanmış değeri kontrol ediyoruz.
    expect(tokens[3]).toEqual('VALUE');
  });
});
```